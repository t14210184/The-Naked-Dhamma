import assert from "node:assert/strict";
import { Script } from "node:vm";
import { readFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { createServer } from "node:http";
import { extname, resolve } from "node:path";
import { chromium, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { EVIDENCE_ITEMS } from "./data/evidence-registry.mjs";
import { CLAIMS } from "./data/claims-registry.mjs";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

const ALL_STATIONS = [
  "four", "drum", "teacher", "kalama", "rahula", "direction", "truth",
  "evidence", "transmission", "history", "branches", "south",
  "mahayana", "texts", "china", "chan", "tibet", "politics",
  "japan", "women", "modern", "lab"
];
const WIDTHS = [320, 375, 390, 430, 768, 1024, 1440];
const ALLOWED_COV_STATES = new Set([
  "SEMANTIC_VERIFIED",
  "INVENTORY_ONLY",
  "PRIMARY_PENDING",
  "INSUFFICIENT_DATA",
  "ACCESS_LIMITED",
  "RIGHTS_EXCEPTION"
]);
const ALLOWED_URL_DISPOSITIONS = new Set([
  "KEPT",
  "RESTORED",
  "REPLACED_EQUIVALENT",
  "EXCLUDED_MIRROR_OR_REDUNDANT"
]);

function validateHtmlStatic(label, html) {
  for (const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    new Script(m[1], { filename: label + "-inline.js" });
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
  assert.equal(ids.length, new Set(ids).size, `${label}: duplicate IDs`);
  const idSet = new Set(ids);
  const broken = [...html.matchAll(/href="#([^"]+)"/g)].map(x => x[1]).filter(x => !idSet.has(x));
  assert.equal(broken.length, 0, `${label}: broken internal anchors: ${broken.join(",")}`);
  const leaks = html.match(/(turn\d+search|<Cite\b|<AsyncImage|TODO:|RIGHTS_LINK_ONLY)/g);
  assert.equal(leaks, null, `${label}: leaked source markers: ${leaks}`);
  if (label === "history.html") {
    const publicFlow = html.replace(/<section id="library"[\s\S]*$/i, "");
    const jargonLeaks = publicFlow.match(/(ACCESS_BLOCKED|FULLTEXT_CHECKED|PRIMARY_CHECKED|ABSTRACT_ONLY|CATALOG_ONLY|無JS|toy demo|玩具示意|對應原表 T|十種不應單憑的理由|四種安穩|三時省察|語文學編纂回譯假說)/g);
    assert.equal(jargonLeaks, null, `${label}: plain-language violation in public flow: ${jargonLeaks}`);
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    assert(/\bwidth="/.test(m[0]) && /\bheight="/.test(m[0]) && /\balt="/.test(m[0]), `${label}: <img> missing dimensions/alt: ${m[0]}`);
  }
  return idSet;
}

const TABLE_ROW_COUNTS = [6, 11, 12, 10, 4, 12, 4, 7, 3, 9, 16, 6, 5, 9, 8, 8, 11, 7, 5, 5, 7, 10, 10]; // sum = 185
const EXPECTED_BASELINE_IDS = [
  ...Array.from({ length: 22 }, (_, i) => `CH${String(i + 1).padStart(2, "0")}`),
  ...TABLE_ROW_COUNTS.flatMap((n, tIdx) =>
    Array.from({ length: n }, (_, rIdx) => `T${String(tIdx + 1).padStart(2, "0")}-R${String(rIdx + 1).padStart(2, "0")}`)
  ),
  ...Array.from({ length: 12 }, (_, i) => `IMG${String(i + 1).padStart(2, "0")}`),
  ...Array.from({ length: 5 }, (_, i) => `V${String(i + 1).padStart(2, "0")}`),
  ...Array.from({ length: 20 }, (_, i) => `PDF-P${String(i + 1).padStart(2, "0")}`)
]; // exact 244 baseline denominator IDs from SOURCE_BASELINE.md

function validateCoverageStatic(covText, hIds, rIds, claimSet, evAccessMap, minRows = 244, minDistinctStates = 3, requireBaseline = true) {
  const lines = covText.trim().split(/\r?\n/);
  const headers = lines[0].split("\t");
  for (const req of ["input_id", "public_anchor", "research_anchor", "claim_ids", "evidence_ids", "verification_state"]) {
    assert(headers.includes(req), `coverage missing required column: ${req}`);
  }
  assert(lines.length - 1 >= minRows, "coverage matrix rows < " + minRows);
  const idx = name => headers.indexOf(name);
  const seenIds = new Set();
  const seenStates = new Set();
  const stateCounts = {};
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split("\t");
    const iid = (cols[idx("input_id")] || "").trim();
    const pub = (cols[idx("public_anchor")] || "").replace(/^#/, "").trim();
    const res = (cols[idx("research_anchor")] || "").replace(/^#/, "").trim();
    const cids = (cols[idx("claim_ids")] || "").trim();
    const eids = (cols[idx("evidence_ids")] || "").trim();
    const vstate = (cols[idx("verification_state")] || "").trim();
    assert(iid && !seenIds.has(iid), `coverage duplicate or empty input_id: ${iid}`);
    seenIds.add(iid);
    assert(ALLOWED_COV_STATES.has(vstate), `coverage ${iid}: invalid verification_state '${vstate}'`);
    seenStates.add(vstate);
    stateCounts[vstate] = (stateCounts[vstate] || 0) + 1;
    assert(pub && hIds.has(pub), `coverage ${iid}: invalid public_anchor #${pub}`);
    assert(res && rIds.has(res), `coverage ${iid}: invalid research_anchor #${res}`);
    assert(cids.length > 0, `coverage ${iid}: empty claim_ids`);
    for (const cid of cids.split(",")) {
      assert(claimSet.has(cid.trim()), `coverage ${iid}: unknown claim_id ${cid}`);
    }
    assert(eids.length > 0, `coverage ${iid}: empty evidence_ids`);
    const parsedEids = eids.split(",").map(s => s.trim()).filter(Boolean);
    for (const eid of parsedEids) {
      assert(evAccessMap.has(eid), `coverage ${iid}: unknown evidence_id ${eid}`);
    }
    if (vstate === "SEMANTIC_VERIFIED") {
      const nonFull = parsedEids.filter(eid => !["PRIMARY_CHECKED", "FULLTEXT_CHECKED"].includes(evAccessMap.get(eid)));
      assert.equal(nonFull.length, 0, `coverage ${iid}: SEMANTIC_VERIFIED cannot rely on non-primary/non-fulltext evidence (${nonFull.join(",")})`);
    }
  }
  if (requireBaseline) {
    const missingBase = EXPECTED_BASELINE_IDS.filter(id => !seenIds.has(id));
    assert.equal(missingBase.length, 0, `coverage missing baseline IDs: ${missingBase.join(",")}`);
  }
  assert(seenStates.size >= minDistinctStates, `coverage states insufficiently varied: ${[...seenStates].join(",")}`);
  return { totalRows: lines.length - 1, baselineIdsVerified: requireBaseline ? EXPECTED_BASELINE_IDS.length : 0, stateCounts };
}

function validateRightsStatic(rightsText, claimSet) {
  const lines = rightsText.trim().split(/\r?\n/);
  const headers = lines[0].split("\t");
  const idx = name => headers.indexOf(name);
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split("\t");
    const aid = cols[idx("asset_id")];
    const status = cols[idx("status")];
    const localFile = cols[idx("local_file")];
    const expectedSha = cols[idx("file_SHA256")];
    const allowedUse = cols[idx("allowed_use")] || "";
    const cids = (cols[idx("claim_ids")] || "").trim();
    assert(cids.length > 0, `rights ${aid}: empty claim_ids`);
    for (const cid of cids.split(",")) {
      assert(claimSet.has(cid.trim()), `rights ${aid}: unknown claim_id ${cid}`);
    }
    if (status === "EMBEDDED") {
      assert(existsSync(localFile), "missing evidence image: " + localFile);
      const actualSha = createHash("sha256").update(readFileSync(localFile)).digest("hex");
      assert.equal(actualSha, expectedSha, "SHA256 mismatch for " + localFile);
    }
    if (status === "ACCESS_BLOCKED") {
      assert(!/RIGHTS_DENIED/i.test(allowedUse), `rights ${aid}: ACCESS_BLOCKED conflated with RIGHTS_DENIED`);
    }
  }
  return lines.length - 1;
}

function validateLegacyUrlsStatic(legacyText, evIdSet, exactRows = 95, htmlBundle = null) {
  const lines = legacyText.trim().split(/\r?\n/);
  const headers = lines[0].split("\t");
  const idx = name => headers.indexOf(name);
  assert.equal(lines.length - 1, exactRows, `legacy URLs expected ${exactRows} rows, got ${lines.length - 1}`);
  const seen = new Set();
  const counts = {};
  const normalizedBundle = htmlBundle ? htmlBundle.replace(/&amp;/g, "&") : null;
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split("\t");
    const url = (cols[idx("legacy_url")] || "").trim();
    const disp = (cols[idx("disposition")] || "").trim();
    const eid = (cols[idx("evidence_id")] || "").trim();
    const tgt = idx("v2_target_url") >= 0 ? (cols[idx("v2_target_url")] || "").trim() : "";
    assert(url && !seen.has(url), `legacy URL empty/duplicate: ${url}`);
    seen.add(url);
    assert(ALLOWED_URL_DISPOSITIONS.has(disp), `legacy URL ${url}: invalid disposition ${disp}`);
    assert(eid === "SITE" || evIdSet.has(eid), `legacy URL ${url}: unknown evidence_id ${eid}`);
    if (normalizedBundle && ["KEPT", "RESTORED", "REPLACED_EQUIVALENT"].includes(disp)) {
      assert(tgt && normalizedBundle.includes(tgt), `legacy URL ${url} target missing in HTML bundle: ${tgt}`);
    }
    counts[disp] = (counts[disp] || 0) + 1;
  }
  return { total: lines.length - 1, counts };
}

// 1. Static checks on build outputs, JS files, TSVs, and assets
const historyHtml = readFileSync("history.html", "utf8");
const researchHtml = readFileSync("history-research.html", "utf8");
new Script(readFileSync("assets/history/history.js", "utf8"), { filename: "assets/history/history.js" });
new Script(readFileSync("assets/history/research.js", "utf8"), { filename: "assets/history/research.js" });

const hIds = validateHtmlStatic("history.html", historyHtml);
const rIds = validateHtmlStatic("history-research.html", researchHtml);

const claimSet = new Set(CLAIMS.map(c => c.id));
const evAccessMap = new Map(EVIDENCE_ITEMS.map(e => [e.id, e.access]));
const evIdSet = new Set(evAccessMap.keys());
const expectedSources = EVIDENCE_ITEMS.length;
const expectedClaims = CLAIMS.length;
const htmlBundle = historyHtml + "\n" + researchHtml;

const landingColdCompressedBytes =
  gzipSync(readFileSync("history.html")).length +
  gzipSync(readFileSync("assets/history/history.css")).length +
  gzipSync(readFileSync("assets/history/history.js")).length;
assert(landingColdCompressedBytes <= 512000, `cold compressed bundle exceeds 500 KiB: ${landingColdCompressedBytes}`);

let inputHashCheck = "SKIPPED_INPUTS_NOT_COMMITTED";
if (existsSync("inputs/buddhist_history_original.txt")) {
  const txtSha = createHash("sha256").update(readFileSync("inputs/buddhist_history_original.txt")).digest("hex");
  assert.equal(txtSha, "2916c64e045f427b7959e5aa79ffedb888803a96d1e8c0e325adff4044f86f27", "buddhist_history_original.txt SHA256 mismatch");
  inputHashCheck = "TXT_SHA256_MATCHED";
}

assert.equal((historyHtml.match(/data-station="/g) || []).length, 22, "expected 22 stations");
assert.equal((historyHtml.match(/data-source\b/g) || []).length, expectedSources, `expected ${expectedSources} source cards`);
assert.equal((researchHtml.match(/data-evidence-card\b/g) || []).length, expectedSources, `expected ${expectedSources} research evidence cards`);

const legacyAnchors = [
  "s-four","s-fourmore","s-drum","s-teacher","s-kalama","s-rahula","s-direction","s-truth",
  "s-core","s-meat","s-ashoka","s-scroll","s-allon","s-baums","s-buddha","s-council",
  "s-fogelin","s-sen","s-gethin","s-heart","s-attribution","s-filial","s-veg","s-chan",
  "s-tibet","s-japan","s-nuns","s-modern","s-tw","s-lib"
];
for (const lid of legacyAnchors) assert(hIds.has(lid), `missing legacy #${lid}`);
for (const cid of claimSet) assert(rIds.has(cid.toLowerCase()), `missing research claim anchor #${cid.toLowerCase()}`);

for (const m of historyHtml.matchAll(/href="\.\/history-research\.html#([^"]+)"/g)) {
  assert(rIds.has(m[1]), `broken cross link ./history-research.html#${m[1]}`);
}
for (const m of researchHtml.matchAll(/href="\.\/history\.html#([^"]+)"/g)) {
  assert(hIds.has(m[1]), `broken cross link ./history.html#${m[1]}`);
}

const covResult = validateCoverageStatic(readFileSync("docs/HISTORY_COVERAGE.tsv", "utf8"), hIds, rIds, claimSet, evAccessMap, 244, 3, true);
const rightsCount = validateRightsStatic(readFileSync("docs/HISTORY_IMAGES_RIGHTS.tsv", "utf8"), claimSet);
const legacyResult = validateLegacyUrlsStatic(readFileSync("docs/HISTORY_LEGACY_URLS.tsv", "utf8"), evIdSet, 95, htmlBundle);

// 2. Negative self-tests (ensure verifier catches broken HTML/TSV/states/URLs/baseline)
assert.throws(() => validateHtmlStatic("neg-dup", '<div id="x"></div><div id="x"></div>'), /duplicate IDs/);
assert.throws(() => validateHtmlStatic("neg-anchor", '<div id="x"><a href="#missing"></a></div>'), /broken internal anchors/);
assert.throws(() => validateCoverageStatic(
  "input_id\tpublic_anchor\tresearch_anchor\tclaim_ids\tevidence_ids\tverification_state\nX1\t#four\t#method\tC01-001\tE01\tSEMANTIC_VERIFIED",
  hIds, rIds, claimSet, evAccessMap, 244, 1, false
), /coverage matrix rows/);
assert.throws(() => validateCoverageStatic(
  "input_id\tpublic_anchor\tresearch_anchor\tclaim_ids\tevidence_ids\tverification_state\nX1\t#bad\t#method\tC01-001\tE01\tSEMANTIC_VERIFIED",
  hIds, rIds, claimSet, evAccessMap, 1, 1, false
), /invalid public_anchor/);
assert.throws(() => validateCoverageStatic(
  "input_id\tpublic_anchor\tresearch_anchor\tclaim_ids\tevidence_ids\tverification_state\nX1\t#four\t#method\tC01-001\tE01\tUNKNOWN",
  hIds, rIds, claimSet, evAccessMap, 1, 1, false
), /invalid verification_state/);
assert.throws(() => validateCoverageStatic(
  "input_id\tpublic_anchor\tresearch_anchor\tclaim_ids\tevidence_ids\tverification_state\nX1\t#four\t#method\tC01-001\tE01\tSEMANTIC_VERIFIED\nX2\t#four\t#method\tC01-001\tE01\tSEMANTIC_VERIFIED",
  hIds, rIds, claimSet, evAccessMap, 1, 3, false
), /insufficiently varied/);
assert.throws(() => validateCoverageStatic(
  "input_id\tpublic_anchor\tresearch_anchor\tclaim_ids\tevidence_ids\tverification_state\nX1\t#texts\t#heart-sutra-origin\tC14-002B\tE20C\tSEMANTIC_VERIFIED",
  hIds, rIds, claimSet, evAccessMap, 1, 1, false
), /cannot rely on non-primary\/non-fulltext evidence/);
assert.throws(() => validateCoverageStatic(
  "input_id\tpublic_anchor\tresearch_anchor\tclaim_ids\tevidence_ids\tverification_state\nX1\t#four\t#method\tC01-001\tE01\tSEMANTIC_VERIFIED\nX2\t#four\t#method\tC01-001\tE04B\tACCESS_LIMITED\nX3\t#four\t#method\tC01-001\tE20C\tINSUFFICIENT_DATA",
  hIds, rIds, claimSet, evAccessMap, 1, 3, true
), /coverage missing baseline IDs/);
assert.throws(() => validateLegacyUrlsStatic("legacy_url\tdisposition\tevidence_id\tv2_target_url\nhttps://example.com\tBAD\tE01\thttps://example.com", evIdSet, 1), /invalid disposition/);
assert.throws(() => validateLegacyUrlsStatic("legacy_url\tdisposition\tevidence_id\tv2_target_url\nhttps://example.com\tKEPT\tE01\thttps://not-in-built-html.invalid/x", evIdSet, 1, htmlBundle), /target missing in HTML bundle/);

console.log("PASS static + 10 negative self-tests", JSON.stringify({
  sources: expectedSources,
  claims: expectedClaims,
  rightsRows: rightsCount,
  landingColdCompressedBytes,
  inputHashCheck,
  coverage: covResult,
  legacyUrls: legacyResult
}));

// 3. Batch planning for full 22 x 7 x 2 x 2 = 616 layout matrix
const batchEnv = process.env.MATRIX_BATCH ?? "all";
const batchSlices = [
  ALL_STATIONS.slice(0, 6),   // Batch 0: S01-S06
  ALL_STATIONS.slice(6, 12),  // Batch 1: S07-S12
  ALL_STATIONS.slice(12, 17), // Batch 2: S13-S17
  ALL_STATIONS.slice(17, 22)  // Batch 3: S18-S22
];
const matrixStations = batchEnv === "all" ? ALL_STATIONS : (batchSlices[Number(batchEnv)] || []);
assert(matrixStations.length > 0, `Invalid MATRIX_BATCH=${batchEnv}`);
const runFullInteractiveAndShots = batchEnv === "all" || batchEnv === "0";

const engine = process.env.ENGINE || "chromium";
const output = "qa-screenshots/history-" + engine;
mkdirSync(output, { recursive: true });
mkdirSync(output + "/visual-audit", { recursive: true });
mkdirSync(output + "/videos", { recursive: true });

const rootDir = resolve(".");
const server = createServer((req, res) => {
  const cleanPath = decodeURIComponent(req.url.split("?")[0]);
  const rel = cleanPath === "/" ? "history.html" : cleanPath.slice(1);
  const abs = resolve(rootDir, rel);
  if (!abs.startsWith(rootDir) || !existsSync(abs) || statSync(abs).isDirectory()) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  res.setHeader("content-type", MIME[extname(abs)] || "application/octet-stream");
  res.end(readFileSync(abs));
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const origin = "http://127.0.0.1:" + server.address().port;
const base = origin + "/history.html";
const resUrl = origin + "/history-research.html";

let launchOpts = { headless: true };
if (engine === "chromium") {
  if (process.env.CHROME_BIN && existsSync(process.env.CHROME_BIN)) {
    launchOpts.executablePath = process.env.CHROME_BIN;
  } else {
    launchOpts.channel = "chromium";
  }
}
const browser = await ({ chromium, webkit }[engine]).launch(launchOpts);
let context;
const errors = [];

const shots = (page, name) => page.screenshot({ path: output + "/" + name + ".png", fullPage: false });

async function inspect(page, label, maxHeader = 64) {
  const a = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const clippedControls = [];
    for (const el of document.querySelectorAll("main button:not([hidden]), main a.button:not([hidden]), main summary, main input, main select, main svg, main table")) {
      if (!el.offsetParent && getComputedStyle(el).position !== "fixed") continue;
      if (el.closest("[hidden]")) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > vw + 2 || r.left < -2) {
        clippedControls.push((el.tagName + "#" + (el.id || "") + ":" + Math.round(r.left) + ".." + Math.round(r.right) + ">" + vw));
      }
    }
    return {
      client: vw,
      scroll: document.documentElement.scrollWidth,
      visible: [...document.querySelectorAll("main section[id]")].filter(x => !x.hidden && !x.closest("[hidden]")).map(x => x.id),
      header: Math.round(document.querySelector(".header").getBoundingClientRect().height),
      body: document.body.scrollHeight,
      theme: document.documentElement.dataset.theme,
      fontScale: document.documentElement.dataset.fontScale || "default",
      clipped: clippedControls
    };
  });
  assert(a.scroll <= a.client + 2, label + " horizontal overflow " + JSON.stringify(a));
  assert(a.header <= maxHeader, label + " header exceeds " + maxHeader + "px: " + JSON.stringify(a));
  assert.equal(a.clipped.length, 0, label + " clipped/overflowing elements: " + a.clipped.join(", "));
  return a;
}

async function go(page, id) {
  const current = page.url();
  if (current.startsWith(base)) {
    await page.evaluate(targetId => { location.hash = "#" + targetId; }, id);
  } else {
    await page.goto(base + "#" + id);
  }
  await page.waitForFunction(targetId => {
    const target = document.getElementById(targetId);
    return document.documentElement.classList.contains("enhanced")
      && !!target
      && !target.closest("[hidden]")
      && (targetId !== "all" || document.querySelectorAll("[data-station]:not([hidden])").length === 22);
  }, id);
}

async function axe(page, label) {
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  if (result.violations.length) {
    console.error(label, JSON.stringify(result.violations.map(v => ({
      id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary }))
    }))));
  }
  assert.equal(result.violations.length, 0, label + " axe violations");
  console.log("PASS axe " + label);
}

async function checkVisibleImgs(page, label) {
  const imgs = page.locator("img");
  const n = await imgs.count();
  const bad = [];
  for (let i = 0; i < n; i++) {
    const loc = imgs.nth(i);
    if (!(await loc.isVisible())) continue;
    await loc.scrollIntoViewIfNeeded();
    const res = await loc.evaluate(el => {
      if (el.complete) return el.naturalWidth > 0 ? null : el.getAttribute("src");
      return new Promise(r => {
        const done = () => r(el.naturalWidth > 0 ? null : el.getAttribute("src"));
        el.addEventListener("load", done, { once: true });
        el.addEventListener("error", done, { once: true });
        setTimeout(done, 4000);
      });
    });
    if (res) bad.push(res);
  }
  assert.equal(bad.length, 0, label + " broken images: " + bad.join(","));
}

let layoutCellsVerified = 0;
let interactionLatencies = {};
let perfSummary = null;

try {
  if (runFullInteractiveAndShots) {
    // Cold-start 5-run latency / LCP / CLS measurement (strictly filtering invalid <=0ms LCP)
    const perfRuns = [];
    for (let r = 0; r < 5; r++) {
      const pc = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "zh-TW" });
      const pp = await pc.newPage();
      await pp.addInitScript(() => {
        window.__perf = { lcp: null, cls: 0 };
        new PerformanceObserver(l => {
          for (const e of l.getEntries()) {
            const t = e.startTime || e.renderTime || 0;
            if (t > 0) window.__perf.lcp = Math.max(window.__perf.lcp || 0, t);
          }
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver(l => {
          for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });
      });
      const t0 = Date.now();
      await pp.goto(base, { waitUntil: "load" });
      await pp.waitForFunction(() => document.documentElement.classList.contains("enhanced"));
      await pp.waitForTimeout(200);
      const dt = Date.now() - t0;
      const m = await pp.evaluate(() => {
        const nav = performance.getEntriesByType("navigation")[0];
        const lcpRaw = window.__perf.lcp;
        return {
          wallMs: 0,
          domInteractive: Math.round(nav ? nav.domInteractive : 0),
          loadEnd: Math.round(nav ? nav.loadEventEnd : 0),
          lcpMs: lcpRaw && lcpRaw > 0 ? Math.round(lcpRaw) : null,
          lcpStatus: lcpRaw && lcpRaw > 0 ? "VALID" : "INVALID_SAMPLE",
          cls: Number(window.__perf.cls.toFixed(4))
        };
      });
      m.wallMs = dt;
      perfRuns.push(m);
      await pc.close();
    }
    const validLcps = perfRuns.map(x => x.lcpMs).filter(x => typeof x === "number" && x > 0).sort((a, b) => a - b);
    perfSummary = {
      runs: perfRuns.length,
      validLcpCount: validLcps.length,
      invalidLcpCount: perfRuns.length - validLcps.length,
      lcpMedianMs: validLcps.length ? validLcps[Math.floor(validLcps.length / 2)] : null,
      maxCls: Math.max(...perfRuns.map(x => x.cls)),
      landingColdCompressedBytes
    };
    assert(perfSummary.validLcpCount >= 4, `too few valid LCP samples: ${perfSummary.validLcpCount}`);
    assert(perfSummary.lcpMedianMs !== null && perfSummary.lcpMedianMs <= 2500, `LCP median > 2500ms: ${perfSummary.lcpMedianMs}`);
    assert(perfSummary.maxCls <= 0.1, `CLS > 0.1: ${perfSummary.maxCls}`);
    console.log("PERF_COLD_5_RUNS", JSON.stringify({ perfSummary, perfRuns }));
  }

  context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, locale: "zh-TW" });
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  const page = await context.newPage();
  page.on("pageerror", e => { errors.push(String(e)); console.error("PAGE_ERROR", e.stack || String(e)); });

  if (runFullInteractiveAndShots) {
    // Landing + Quick
    await page.goto(base);
    await page.waitForFunction(() => document.documentElement.classList.contains("enhanced") && document.querySelector("#four").hidden);
    const landing = await inspect(page, "initial landing", 56);
    assert(landing.visible.includes("top"), "landing visible includes top");
    assert(landing.body < 6500, "landing unexpectedly long " + landing.body);
    assert.equal(await page.locator(".act").count(), 4);
    assert.equal(await page.locator(".act[open]").count(), 0);
    await shots(page, "landing-light");
    await axe(page, "light landing");

    const smallTargets = await page.evaluate(() => {
      return [...document.querySelectorAll(".header a, .header summary, .hero-action a.button")]
        .filter(el => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44);
        })
        .map(el => el.textContent.trim() + ":" + Math.round(el.getBoundingClientRect().height));
    });
    assert.equal(smallTargets.length, 0, "touch target < 44px: " + smallTargets.join(","));

    // Landing Hero + Image check
    await checkVisibleImgs(page, "landing hero");

    // Menu -> S01
    await page.locator("#act-1 summary").click();
    await page.locator("#act-1 a[href='#four']").click();
    await page.waitForFunction(() => !document.querySelector("#four").hidden);
    assert.equal((await inspect(page, "station one", 56)).visible[0], "four");

    // S01 Visitors + storybook gate verification
    await go(page, "four");
    await checkVisibleImgs(page, "S01 visitors");
    const tS01 = Date.now();
    await page.locator("[data-visitor='v2']").click();
    await page.locator("[data-vaction='believe']").click();
    assert((await page.locator("#s01-result").textContent()).includes("不能這樣就直接相信"));
    assert.equal(await page.locator("#s01-chk-v2").textContent(), "已查 ✓");
    assert((await page.locator("#s01-desk-stamp").textContent()).includes("不能只靠搬出權威"));
    interactionLatencies.s01Ms = Date.now() - tS01;
    await shots(page, "visual-audit/s01-mobile-after");
    await page.locator("#s01-reset").click();
    assert((await page.locator("#s01-progress").textContent()).includes("0／4"));
    assert.equal(await page.locator("#s01-chk-v2").textContent(), "未查");
    await shots(page, "s01-light");
    await axe(page, "light s01");

    // S02 Drum workshop
    await go(page, "drum");
    await checkVisibleImgs(page, "S02 workshop");
    for (let i = 0; i < 5; i++) await page.locator("#patch").click();
    assert.equal(await page.locator(".drum-patch.visible").count(), 5);
    assert(await page.locator("#patch").isDisabled());
    await page.locator("#mode-han").click();
    await page.locator("#patch").click();
    assert.equal(await page.locator("#leather").getAttribute("opacity"), "1");
    await shots(page, "s02-light");
    await page.locator("#reset-drum").click();
    assert.equal(await page.locator("#leather").getAttribute("opacity"), "0");

    // S03 Teacher diary + optional <details> quiz
    await go(page, "teacher");
    await page.locator("[data-tstage='famous']").click();
    assert((await page.locator("#s03-time-badge").textContent()).includes("第二頁"));
    await page.locator("[data-tjudge='mind']").click();
    assert((await page.locator("#s03-judge-result").textContent()).includes("超過我們能看得到的範圍"));
    await page.locator("#teacher details.story-more summary").click();
    await page.locator("[aria-controls=q-teacher]").nth(2).click();
    assert((await page.locator("#q-teacher").textContent()).includes("說得對"));
    await shots(page, "s03-light");
    await page.locator("#s03-reset").click();

    // S04 Kalama Town Rumor Detective (Game A) + Four Hypothetical Worlds (Game B)
    await go(page, "kalama");
    await checkVisibleImgs(page, "S04 town square");
    await page.locator("[data-kalama-npc='n8']").click();
    assert((await page.locator("#s04-speaker-tag").textContent()).includes("挑水大姊"));
    await page.locator("#s04-flip-clue").click();
    assert((await page.locator("#s04-clue-out").textContent()).includes("胃口一樣"));
    await page.locator("#s04-pin-hold").click();
    assert((await page.locator("#s04-saved-badge").textContent()).includes("1／10"));
    await page.locator("#s04-next-npc").click();
    assert((await page.locator("#s04-speaker-tag").textContent()).includes("9."));
    await page.locator("[data-assasa='a4']").click();
    assert((await page.locator("#s04-world-badge").textContent()).includes("假設世界 4／4"));
    assert((await page.locator("#s04-assasa-out").textContent()).includes("世界 4"));
    await shots(page, "s04-light");
    await shots(page, "visual-audit/s04-mobile-after");
    await axe(page, "light s04");

    // S05 Rahula (Three Full Scenes: Basin + Normal Asian Elephant + Mirror Stories)
    await go(page, "rahula");
    await checkVisibleImgs(page, "S05 rahula scenes");
    assert.equal(await page.locator("[data-basin='little']").textContent(), "1. 倒掉一些水");
    assert.equal(await page.locator("[data-basin='empty']").textContent(), "2. 把水全部倒光");
    assert.equal(await page.locator("[data-basin='flipped']").textContent(), "3. 把盆子倒過來");
    assert.equal(await page.locator("[data-basin='upright']").textContent(), "4. 把盆子翻回來");
    await page.locator("[data-basin='flipped']").click();
    assert.equal(await page.locator("#basin-bowl").getAttribute("transform"), "rotate(180 150 108)");
    assert.equal(await page.locator("#basin-puddle").getAttribute("opacity"), "0.9");
    assert.equal(await page.locator("#basin-svg-label").textContent(), "盆口朝下蓋在石地上");
    await page.locator("[data-elstep='protect']").click();
    assert((await page.locator("#s05-el-badge").textContent()).includes("捲進象牙後面"));
    await page.locator("[data-mirror='after']").click();
    assert((await page.locator("#s05-mirror-tag").textContent()).includes("右邊畫面"));
    await shots(page, "s05-light");
    await shots(page, "visual-audit/s05-mobile-after");
    await axe(page, "light s05");

    // S06 Direction Two Paths
    await go(page, "direction");
    await checkVisibleImgs(page, "S06 two paths");
    await page.locator("[data-dir='d_counter']").click();
    assert((await page.locator("#s06-dir-out").textContent()).includes("公元前"));
    assert((await page.locator("#s06-path-badge").textContent()).includes("陷阱"));
    await shots(page, "s06-light");

    // S07 Truth 3-Drawer Cabinet
    await go(page, "truth");
    await page.locator("[data-epitem='t3']").click();
    await page.locator("[data-epcat='unknown']").click();
    assert((await page.locator("#s07-result").textContent()).includes("✓ 放得很對"));
    assert(await page.locator("#s07-dr-unknown.is-active").count() === 1);
    await shots(page, "s07-light");
    await page.locator("#s07-reset").click();

    // S08 Evidence Magnifier: ALL 5 artifacts dynamically verified (UI timing separated from img decode)
    await go(page, "evidence");
    let totalS08DecodeMs = 0;
    for (const [artKey, expectedFrag] of [
      ["lumbini", "釋迦牟尼"],
      ["bhabra", "羅睺羅"],
      ["nigali", "拘那含"],
      ["sarnath", "分裂"],
      ["gandhara", "大英圖書館"]
    ]) {
      const tUi = Date.now();
      await page.locator(`[data-artifact='${artKey}']`).click();
      const fullCap = (await page.locator("#viewer-obs").textContent())
        + " " + (await page.locator("#viewer-cue").textContent())
        + " " + (await page.locator("#viewer-trans").textContent())
        + " " + (await page.locator("#viewer-limit").textContent());
      assert(fullCap.includes(expectedFrag), `S08 ${artKey} caption missing '${expectedFrag}'`);
      if (artKey === "gandhara") interactionLatencies.s08UiSwitchMs = Date.now() - tUi;
      const tDec = Date.now();
      await checkVisibleImgs(page, `S08 ${artKey}`);
      totalS08DecodeMs += Date.now() - tDec;
    }
    interactionLatencies.s08ImgDecodeMs = totalS08DecodeMs;
    await page.locator("[data-artifact='bhabra']").click();
    await page.locator("#viewer-zoom-in").click();
    assert((await page.locator("#viewer-zoom-status").textContent()).includes("140%"));
    await page.locator("#viewer-toggle-trans").click();
    assert(!(await page.locator("#viewer-trans").isHidden()));
    await shots(page, "visual-audit/s08-mobile-after");
    await page.locator("#viewer-reset").click();
    await shots(page, "s08-light");

    // S09 Transmission Circle
    await go(page, "transmission");
    await checkVisibleImgs(page, "S09 banyan circle");
    await page.locator("[data-txmode='chorus']").click();
    assert((await page.locator("#s09-out").textContent()).includes("合唱團"));
    assert((await page.locator("#s09-n2-txt").textContent()).includes("集體合誦"));
    assert((await page.locator("#s09-mode-pill").textContent()).includes("測試二"));
    await shots(page, "s09-light");
    await shots(page, "visual-audit/s09-mobile-after");
    await page.locator("#s09-reset").click();
    assert((await page.locator("#s09-mode-pill").textContent()).includes("還沒有開始"));

    // S10 Natural Earth History Timeline & Map + Play toggle
    await go(page, "history");
    const nePathLen = await page.locator("#s10-atlas-svg .atlas-land").getAttribute("d");
    assert(nePathLen && nePathLen.length > 1000, "S10 missing Natural Earth coastline path");
    await page.locator("[data-era='2']").click();
    assert((await page.locator("#s10-time").textContent()).includes("前 268–232"));
    assert.equal(await page.locator("#s10-map-dot2").getAttribute("opacity"), "1");
    await page.locator("#s10-next").click();
    assert((await page.locator("#s10-time").textContent()).includes("前 300–100"));
    assert.equal(await page.locator("#s10-map-dot").getAttribute("cx"), "88.6");
    await page.locator("#s10-autoplay").click();
    await page.locator("#s10-autoplay").click();
    await shots(page, "s10-light");
    await shots(page, "visual-audit/s10-mobile-after");
    await axe(page, "light s10");

    // S11 Branches & 5-Language
    await go(page, "branches");
    await page.locator("[data-trad='east']").click();
    assert((await page.locator("#s11-pz-vinaya-txt").textContent()).includes("法藏部"));
    await page.locator("[data-lang5='lzh']").click();
    assert((await page.locator("#s11-lang5-out").textContent()).includes("雜阿含"));
    await shots(page, "s11-light");

    // S12 South Theravada Natural Earth map & real relics
    await go(page, "south");
    await checkVisibleImgs(page, "S12 kuthodaw/sri-lanka");
    await page.locator("[data-south='relay1753']").click();
    assert.equal(await page.locator("#s12-sea-arc").getAttribute("stroke-opacity"), "0.95");
    await page.locator("[data-south='kuthodaw']").click();
    assert((await page.locator("#s12-out").textContent()).includes("729"));
    await shots(page, "s12-light");

    // S13 Mahayana
    await go(page, "mahayana");
    await page.locator("[data-mahac='sunyata']").click();
    await page.locator("[data-bvacana='trad']").click();
    await shots(page, "s13-light");

    // S14 Texts (16 options + parallel segments + Attwood 2020 + Fukui chronology)
    await go(page, "texts");
    assert.equal(await page.locator("#s14-text-select option").count(), 16);
    await page.locator("#s14-text-select").selectOption("surangama");
    await page.locator("#s14-next-clue").click();
    assert((await page.locator("#s14-desk-out").textContent()).includes("T945"));
    await page.locator("#s14-all-clues").click();
    assert((await page.locator("#s14-heart-out").textContent()).includes("Attwood 2020"));
    await page.locator("[data-heartseg='seg3']").click();
    assert((await page.locator("#s14-p-skt").textContent()).includes("aprāptitvāt"));
    const tS14 = Date.now();
    await page.locator("[data-heart='alt']").click();
    const s14AltTxt = await page.locator("#s14-heart-out").textContent();
    assert(s14AltTxt.includes("1987 年") && s14AltTxt.includes("2000 年不是第三個全新證據"));
    interactionLatencies.s14HeartSwitchMs = Date.now() - tS14;
    await shots(page, "s14-light");
    await shots(page, "visual-audit/s14-mobile-after");

    // S15 China
    await go(page, "china");
    await checkVisibleImgs(page, "S15 china arrival");
    await page.locator("[data-cscene='food']").click();
    assert((await page.locator("#s15-out").textContent()).includes("十世紀"));
    await shots(page, "s15-light");

    // S16 Chan Bookshelf
    await go(page, "chan");
    await checkVisibleImgs(page, "S16 chan");
    await page.locator("[data-chan='tiansheng']").click();
    assert((await page.locator("#s16-out").textContent()).includes("1036"));
    await shots(page, "s16-light");

    // S17 Tibet
    await go(page, "tibet");
    await checkVisibleImgs(page, "S17 samye");
    await page.locator("[data-tibet-item='tb4']").click();
    await page.locator("[data-tbox='belief']").click();
    assert((await page.locator("#s17-result").textContent()).includes("✓ 分得很對"));
    assert(await page.locator("#s17-box-belief.is-active").count() === 1);
    await shots(page, "s17-light");

    // S18 Politics & Archives
    await go(page, "politics");
    await checkVisibleImgs(page, "S18 india");
    await page.locator("[data-pol='war']").check();
    await page.locator("[data-pol='elite']").check();
    await page.locator("[data-pol='canon']").check();
    assert((await page.locator("#s18-out").textContent()).includes("只挑特定書目"));
    assert.equal(await page.locator("#s18-st-india").textContent(), "戰亂＋斷援重創");
    await shots(page, "s18-light");
    await shots(page, "visual-audit/s18-mobile-after");
    await page.locator("#s18-reset").click();
    assert.equal(await page.locator("#s18-st-india").textContent(), "局部暫時保存");

    // S19 Japan Time Machine
    await go(page, "japan");
    await checkVisibleImgs(page, "S19 kyoto");
    await page.locator("[data-jpera='meiji']").click();
    assert((await page.locator("#s19-out").textContent()).includes("沒有強迫全部僧人都要結婚"));
    await shots(page, "s19-light");

    // S20 Women Ordination Relay Map
    await go(page, "women");
    await page.locator("[data-wrelay='bhutan']").click();
    assert.equal(await page.locator("#s20-baton").getAttribute("cx"), "259.3");
    assert((await page.locator("#s20-relay-out").textContent()).includes("265"));
    await page.locator("[data-wview='conserv']").click();
    await shots(page, "s20-light");

    // S21 Modern & Taiwan
    await go(page, "modern");
    await checkVisibleImgs(page, "S21 taiwan");
    await page.locator("[data-modclaim='mindfulness']").click();
    assert((await page.locator("#s21-mod-out").textContent()).includes("不適"));
    await page.locator("[data-twera='modern']").click();
    await shots(page, "s21-light");

    // S22 Lab Workbench
    await go(page, "lab");
    await page.locator("#audit-case").selectOption({ label: "1. 「聽說靈山拈花微笑是佛陀當場發生的事？」" });
    await page.locator("#load-case").click();
    for (const c of await page.locator(".audit-check").all()) await c.check();
    assert((await page.locator("#audit-status").textContent()).includes("7／7"));
    await page.reload();
    assert.equal(await page.locator(".audit-check:checked").count(), 7);
    const tS22 = Date.now();
    await page.locator("#copy-notes").click();
    await page.waitForFunction(() => document.querySelector("#copy-status").textContent.length > 0);
    interactionLatencies.s22CopyNotesMs = Date.now() - tS22;
    assert((await page.locator("#notes-output").inputValue()).includes("非真偽評分"));
    await page.locator("#reset-audit").click();
    assert.equal(await page.locator(".audit-check:checked").count(), 0);
    await shots(page, "s22-light");

    // Library NFKC + 0-result + pills + 42 cards + return
    await go(page, "library");
    await page.locator("#source-search").fill("ＡＮ ３.６５");
    assert(await page.locator("[data-source]:not([hidden])").count() > 0);
    await page.locator("#source-search").fill("不存在之關鍵字XYZ");
    assert.equal(await page.locator("[data-source]:not([hidden])").count(), 0);
    assert((await page.locator("#source-count").textContent()).includes("找不到跟"));
    await page.locator("[data-filter='阿育王']").click();
    assert(await page.locator("[data-source]:not([hidden])").count() > 0);
    await page.locator("#clear-search").click();
    assert.equal(await page.locator("[data-source]:not([hidden])").count(), expectedSources);
    await shots(page, "library");
    await axe(page, "light library");

    await go(page, "four");
    await page.locator("#four details.story-more summary").click();
    await page.locator("#four a[href='#s-four']").first().click();
    await page.waitForFunction(() => !document.querySelector("#library").hidden);
    assert.equal(await page.locator("#source-back").getAttribute("href"), "#four");
    await page.locator("#source-back").click();
    await page.waitForFunction(() => !document.querySelector("#four").hidden);

    // Bad hash fallback
    await page.goto(base + "#nonexistent-hash");
    await page.waitForFunction(() => !document.querySelector("#route-notice").hidden && !document.querySelector("#top").hidden);

    // Font 16px shrink check + keyboard 24px -> 28px check
    await page.locator(".settings summary").click();
    await page.locator("#fontDown").click();
    await page.locator("#fontDown").click();
    assert((await page.locator("#font-status").textContent()).includes("16px"));
    await inspect(page, "16px light 390px top", 56);
    await page.locator("#fontUp").click();
    await page.locator("#fontUp").click();
    assert((await page.locator("#font-status").textContent()).includes("20px"));
    await page.locator("#fontUp").focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Space");
    assert((await page.locator("#font-status").textContent()).includes("24px"));
    await page.locator("#fontUp").click();
    await page.locator("#fontUp").click();
    assert((await page.locator("#font-status").textContent()).includes("28px"));
    await page.locator("#theme").click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.locator(".settings summary").click();
    await go(page, "four");
    await shots(page, "station-dark-large");
    await axe(page, "dark large s01");
    await go(page, "library");
    await axe(page, "dark library");

    // Reset to light 20px cleanly before matrix loop
    await page.locator(".settings summary").click();
    await page.locator("#theme").click();
    for (let k = 0; k < 4; k++) await page.locator("#fontDown").click();
    await page.locator(".settings summary").click();
  }

  // 4. Full Matrix Loop: matrixStations x 7 widths x 2 themes x 2 font scales (20px & 28px)
  await page.goto(base);
  await page.waitForFunction(() => document.documentElement.classList.contains("enhanced"));
  for (const theme of ["light", "dark"]) {
    const curTheme = await page.locator("html").getAttribute("data-theme");
    if (curTheme !== theme) {
      await page.locator(".settings summary").click();
      await page.locator("#theme").click();
      await page.locator(".settings summary").click();
    }
    for (const targetFont of ["20px", "28px"]) {
      const curStatus = await page.locator("#font-status").textContent();
      if (!curStatus.includes(targetFont)) {
        await page.locator(".settings summary").click();
        const btn = targetFont === "28px" ? "#fontUp" : "#fontDown";
        for (let k = 0; k < 4; k++) await page.locator(btn).click();
        assert((await page.locator("#font-status").textContent()).includes(targetFont));
        await page.locator(".settings summary").click();
      }
      for (const w of WIDTHS) {
        await page.setViewportSize({ width: w, height: 900 });
        const mh = w <= 430 ? 56 : 64;
        const targets = (batchEnv === "0" && theme === "dark" && targetFont === "28px")
          ? ["top", ...matrixStations, "library"]
          : matrixStations;
        for (const id of targets) {
          await go(page, id);
          await inspect(page, `${id} ${w}px ${targetFont} ${theme}`, mh);
          if (matrixStations.includes(id)) layoutCellsVerified++;
        }
      }
    }
  }
  console.log(`PASS layout matrix batch=${batchEnv}: ${layoutCellsVerified} station cells verified across 7 widths x 2 themes x 2 font scales`);

  // Ensure light / 20px / 390px before zoom/print/research checks
  await page.setViewportSize({ width: 390, height: 844 });
  if ((await page.locator("html").getAttribute("data-theme")) !== "light") {
    await page.locator(".settings summary").click();
    await page.locator("#theme").click();
    await page.locator(".settings summary").click();
  }
  if (!(await page.locator("#font-status").textContent()).includes("20px")) {
    await page.locator(".settings summary").click();
    for (let k = 0; k < 4; k++) await page.locator("#fontDown").click();
    await page.locator(".settings summary").click();
  }

  if (runFullInteractiveAndShots) {
    // Browser Zoom & Reflow Checks:
    // 1) CSS Reflow at 640px (1280px@200% equivalent) & 720px viewport (explicitly separated from CDP zoom)
    await page.setViewportSize({ width: 640, height: 900 });
    await go(page, "texts");
    await inspect(page, "css-reflow-640px-proxy texts", 64);
    await page.setViewportSize({ width: 720, height: 900 });
    await go(page, "lab");
    await inspect(page, "css-reflow-720px-proxy lab", 64);

    // 2) Real Chromium CDP 200% browser scale zoom (separate from viewport reflow)
    let pageScaleFactor2xCdp = "NOT_APPLICABLE_NO_CDP_ON_WEBKIT";
    if (engine === "chromium") {
      await page.setViewportSize({ width: 1280, height: 900 });
      const cdp = await context.newCDPSession(page);
      await cdp.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });
      await go(page, "evidence");
      await inspect(page, "real-cdp-200pct-zoom evidence", 64);
      await cdp.send("Emulation.setPageScaleFactor", { pageScaleFactor: 1 });
      await cdp.detach();
      pageScaleFactor2xCdp = "PASS_CDP_PAGE_SCALE_2X_ONLY";
    }

    // 3) Dedicated visual captures across flagship stations (Desktop 1280 before/after + 28px dark) + representative animation video recording
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(base);
    await page.waitForFunction(() => document.documentElement.classList.contains("enhanced"));
    await page.screenshot({ path: `${output}/visual-audit/hero-desktop.png`, fullPage: false });
    for (const [stId, fnBefore, fnAfter] of [
      ["four", async () => {}, async () => { await page.locator("[data-visitor='v3']").click(); await page.locator("[data-vaction='check']").click(); }],
      ["drum", async () => { await page.locator("#reset-drum").click(); }, async () => { await page.locator("#patch").click(); await page.locator("#patch").click(); await page.locator("#patch").click(); }],
      ["kalama", async () => {}, async () => { await page.locator("[data-kalama-npc='n8']").click(); await page.locator("#s04-flip-clue").click(); await page.locator("[data-assasa='a2']").click(); }],
      ["rahula", async () => { await page.locator("[data-basin='full']").click(); }, async () => { await page.locator("[data-basin='flipped']").click(); await page.locator("[data-mirror='during']").click(); }],
      ["evidence", async () => { await page.locator("[data-artifact='lumbini']").click(); }, async () => { await page.locator("[data-artifact='gandhara']").click(); await page.locator("#viewer-zoom-in").click(); await page.locator("#viewer-toggle-trans").click(); await checkVisibleImgs(page, "visual gandhara"); }],
      ["transmission", async () => { await page.locator("#s09-reset").click(); }, async () => { await page.locator("[data-txmode='whisper']").click(); }],
      ["history", async () => { await page.locator("[data-era='0']").click(); }, async () => { await page.locator("[data-era='7']").click(); }],
      ["texts", async () => { await page.locator("[data-heartseg='seg1']").click(); }, async () => { await page.locator("[data-heartseg='seg3']").click(); await page.locator("[data-heart='nattier']").click(); }],
      ["politics", async () => { await page.locator("#s18-reset").click(); }, async () => { await page.locator("[data-pol='war']").check(); await page.locator("[data-pol='copy']").check(); }]
    ]) {
      await go(page, stId);
      await fnBefore();
      await inspect(page, `desktop-1280-before ${stId}`, 64);
      await page.locator(`#${stId} .play`).first().evaluate(el => el.scrollIntoView({ block: "start" }));
      await page.screenshot({ path: `${output}/visual-audit/${stId}-desktop-before.png`, fullPage: false });
      await fnAfter();
      await inspect(page, `desktop-1280-after ${stId}`, 64);
      await page.locator(`#${stId} .play`).first().evaluate(el => el.scrollIntoView({ block: "start" }));
      await page.screenshot({ path: `${output}/visual-audit/${stId}-desktop-after.png`, fullPage: false });
    }
    // Representative Playwright animation recordings (S02 drum pegs, S05 copper basin pour/flip, S10 Natural Earth travel)
    const vidCtx = await browser.newContext({
      viewport: { width: 1024, height: 760 },
      locale: "zh-TW",
      recordVideo: { dir: `${output}/videos`, size: { width: 1024, height: 760 } }
    });
    const vp = await vidCtx.newPage();
    await vp.goto(base + "#rahula");
    await vp.waitForFunction(() => document.documentElement.classList.contains("enhanced"));
    for (const st of ["little", "empty", "flipped", "upright", "full"]) {
      await vp.locator(`[data-basin='${st}']`).click();
      await vp.waitForTimeout(380);
    }
    await vp.evaluate(() => { location.hash = "#drum"; });
    await vp.waitForFunction(() => !document.querySelector("#drum").hidden);
    for (let k = 0; k < 4; k++) { await vp.locator("#patch").click(); await vp.waitForTimeout(280); }
    await vp.evaluate(() => { location.hash = "#history"; });
    await vp.waitForFunction(() => !document.querySelector("#history").hidden);
    for (const era of [0, 2, 4, 7, 11]) { await vp.locator(`[data-era='${era}']`).click(); await vp.waitForTimeout(350); }
    await vidCtx.close();

    // Dark + 28px spot captures on key upgraded stations
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".settings summary").click();
    await page.locator("#theme").click();
    for (let k = 0; k < 4; k++) await page.locator("#fontUp").click();
    await page.locator(".settings summary").click();
    for (const stId of ["four", "kalama", "rahula", "history", "texts"]) {
      await go(page, stId);
      await inspect(page, `dark-28px-390 ${stId}`, 56);
      await page.screenshot({ path: `${output}/visual-audit/${stId}-dark-28px.png`, fullPage: false });
    }
    // Restore light 20px
    await page.locator(".settings summary").click();
    await page.locator("#theme").click();
    for (let k = 0; k < 4; k++) await page.locator("#fontDown").click();
    await page.locator(".settings summary").click();
    console.log("ZOOM_CHECK_STATUS", JSON.stringify({ engine, cssReflow640px_1280at200pct: "PASS", cssReflow720px: "PASS", pageScaleFactor2x_CDP: pageScaleFactor2xCdp }));

    // Resume bookmark
    await go(page, "china");
    await page.goto(base);
    await page.waitForFunction(() => !document.querySelector("#resume").hidden);
    assert.equal(await page.locator("#resume-link").getAttribute("href"), "#china");
    await page.locator("#resume-link").click();
    await page.waitForFunction(() => !document.querySelector("#china").hidden);

    // All + Print
    await go(page, "all");
    assert.equal(await page.locator("[data-station]:not([hidden])").count(), 22);
    await page.emulateMedia({ media: "print" });
    await go(page, "four");
    assert.equal(await page.locator("#china").evaluate(e => getComputedStyle(e).display), "block");
    await page.emulateMedia({ media: "screen" });

    // Forced-colors + reduced-motion smoke check
    await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
    await go(page, "drum");
    await page.emulateMedia({ reducedMotion: "no-preference", forcedColors: "none" });

    // Research companion page checks (incl. 10-field claims, 39 sources, 95 legacy URLs, galleries)
    await page.goto(resUrl);
    await page.waitForFunction(() => document.documentElement.classList.contains("enhanced"));
    await inspect(page, "research light 390px", 56);
    await checkVisibleImgs(page, "research gallery light");
    await shots(page, "research-light");
    await axe(page, "research light");

    await page.goto(resUrl + "#c14-002");
    assert((await page.locator("#c14-002").textContent()).includes("T0223"));
    await page.goto(resUrl + "#legacy-urls");
    assert.equal(await page.locator("#legacy-urls tbody tr").count(), 95);
    await page.locator("#res-search").fill("SF 245");
    assert.equal(await page.locator("[data-evidence-card]:not([hidden])").count(), 1);
    await page.locator("#res-clear").click();
    assert.equal(await page.locator("[data-evidence-card]:not([hidden])").count(), expectedSources);
    await page.locator("#copy-bib").click();
    assert((await page.locator("#bib-copy-status").textContent()).includes(`${expectedSources} 筆`));
    await page.locator(".settings summary").click();
    await page.locator("#theme").click();
    await shots(page, "research-dark");
    await axe(page, "research dark");

    // Broken image fallback + storage denied context
    const secCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "zh-TW" });
    await secCtx.addInitScript(() => {
      const boom = () => { throw new DOMException("blocked", "SecurityError"); };
      Object.defineProperty(window, "localStorage", { get() { return { getItem: boom, setItem: boom, removeItem: boom }; } });
    });
    const secPage = await secCtx.newPage();
    secPage.on("pageerror", e => { errors.push("storage-ctx: " + e); });
    await secPage.route("**/img01-rummindei-inscription.jpg", route => route.abort());
    await secPage.goto(base + "#evidence");
    await secPage.waitForFunction(() => !document.querySelector("#evidence").hidden && !document.querySelector("#viewer-fallback").hidden);
    await secPage.locator(".settings summary").click();
    await secPage.locator("#theme").click();
    assert.equal(await secPage.locator("html").getAttribute("data-theme"), "dark");
    await secCtx.close();

    // No-JS context on both HTML pages
    const no = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const np = await no.newPage();
    await np.goto(base);
    assert.equal(await np.locator("[data-station]").count(), 22);
    assert.equal(await np.locator("[data-source]").count(), expectedSources);
    assert.equal(await np.locator("[data-station][hidden]").count(), 0);
    await np.locator("#act-3 summary").click();
    assert(await np.locator("#act-3 a[href='#china']").isVisible());
    await np.goto(resUrl);
    assert.equal(await np.locator("[data-evidence-card]").count(), expectedSources);
    await no.close();
  }

  assert.deepEqual(errors, [], "uncaught page errors");
  console.log("HISTORY_QA_SUMMARY " + JSON.stringify({
    engine,
    batch: batchEnv,
    failures: 0,
    stations: 22,
    layoutCellsVerified,
    sourceGroups: expectedSources,
    researchClaims: expectedClaims,
    coverageRows: covResult.totalRows,
    coverageStates: covResult.stateCounts,
    legacyUrlsAudited: legacyResult.total,
    legacyUrlDispositions: legacyResult.counts,
    perfSummary,
    interactionLatencies
  }));
} finally {
  if (context) {
    await context.tracing.stop({ path: output + "/trace.zip" }).catch(() => {});
    await context.close();
  }
  await browser.close();
  server.close();
}
