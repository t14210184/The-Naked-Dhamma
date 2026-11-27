import assert from "node:assert/strict";
import { Script } from "node:vm";
import { readFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
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
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    assert(/\bwidth="/.test(m[0]) && /\bheight="/.test(m[0]) && /\balt="/.test(m[0]), `${label}: <img> missing dimensions/alt: ${m[0]}`);
  }
  return idSet;
}

function validateCoverageStatic(covText, hIds, rIds, claimSet, evIdSet, minRows = 244, minDistinctStates = 3) {
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
    for (const eid of eids.split(",")) {
      assert(evIdSet.has(eid.trim()), `coverage ${iid}: unknown evidence_id ${eid}`);
    }
  }
  assert(seenStates.size >= minDistinctStates, `coverage states insufficiently varied: ${[...seenStates].join(",")}`);
  return { totalRows: lines.length - 1, stateCounts };
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

function validateLegacyUrlsStatic(legacyText, evIdSet, exactRows = 95) {
  const lines = legacyText.trim().split(/\r?\n/);
  const headers = lines[0].split("\t");
  const idx = name => headers.indexOf(name);
  assert.equal(lines.length - 1, exactRows, `legacy URLs expected ${exactRows} rows, got ${lines.length - 1}`);
  const seen = new Set();
  const counts = {};
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split("\t");
    const url = (cols[idx("legacy_url")] || "").trim();
    const disp = (cols[idx("disposition")] || "").trim();
    const eid = (cols[idx("evidence_id")] || "").trim();
    assert(url && !seen.has(url), `legacy URL empty/duplicate: ${url}`);
    seen.add(url);
    assert(ALLOWED_URL_DISPOSITIONS.has(disp), `legacy URL ${url}: invalid disposition ${disp}`);
    assert(eid === "SITE" || evIdSet.has(eid), `legacy URL ${url}: unknown evidence_id ${eid}`);
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
const evIdSet = new Set(EVIDENCE_ITEMS.map(e => e.id));
const expectedSources = EVIDENCE_ITEMS.length;
const expectedClaims = CLAIMS.length;

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

const covResult = validateCoverageStatic(readFileSync("docs/HISTORY_COVERAGE.tsv", "utf8"), hIds, rIds, claimSet, evIdSet);
const rightsCount = validateRightsStatic(readFileSync("docs/HISTORY_IMAGES_RIGHTS.tsv", "utf8"), claimSet);
const legacyResult = validateLegacyUrlsStatic(readFileSync("docs/HISTORY_LEGACY_URLS.tsv", "utf8"), evIdSet);

// 2. Negative self-tests (ensure verifier catches broken HTML/TSV/states/URLs)
assert.throws(() => validateHtmlStatic("neg-dup", '<div id="x"></div><div id="x"></div>'), /duplicate IDs/);
assert.throws(() => validateHtmlStatic("neg-anchor", '<div id="x"><a href="#missing"></a></div>'), /broken internal anchors/);
assert.throws(() => validateCoverageStatic(
  "input_id\tpublic_anchor\tresearch_anchor\tclaim_ids\tevidence_ids\tverification_state\nX1\t#four\t#method\tC01-001\tE01\tSEMANTIC_VERIFIED",
  hIds, rIds, claimSet, evIdSet, 244, 1
), /coverage matrix rows/);
assert.throws(() => validateCoverageStatic(
  "input_id\tpublic_anchor\tresearch_anchor\tclaim_ids\tevidence_ids\tverification_state\nX1\t#bad\t#method\tC01-001\tE01\tSEMANTIC_VERIFIED",
  hIds, rIds, claimSet, evIdSet, 1, 1
), /invalid public_anchor/);
assert.throws(() => validateCoverageStatic(
  "input_id\tpublic_anchor\tresearch_anchor\tclaim_ids\tevidence_ids\tverification_state\nX1\t#four\t#method\tC01-001\tE01\tUNKNOWN",
  hIds, rIds, claimSet, evIdSet, 1, 1
), /invalid verification_state/);
assert.throws(() => validateCoverageStatic(
  "input_id\tpublic_anchor\tresearch_anchor\tclaim_ids\tevidence_ids\tverification_state\nX1\t#four\t#method\tC01-001\tE01\tSEMANTIC_VERIFIED\nX2\t#four\t#method\tC01-001\tE01\tSEMANTIC_VERIFIED",
  hIds, rIds, claimSet, evIdSet, 1, 3
), /insufficiently varied/);
assert.throws(() => validateLegacyUrlsStatic("legacy_url\tdisposition\tevidence_id\nhttps://example.com\tBAD\tE01", evIdSet, 1), /invalid disposition/);

console.log("PASS static + 7 negative self-tests", JSON.stringify({
  sources: expectedSources,
  claims: expectedClaims,
  rightsRows: rightsCount,
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
      maxCls: Math.max(...perfRuns.map(x => x.cls))
    };
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

    // Menu -> S01
    await page.locator("#act-1 summary").click();
    await page.locator("#act-1 a[href='#four']").click();
    await page.waitForFunction(() => !document.querySelector("#four").hidden);
    assert.equal((await inspect(page, "station one", 56)).visible[0], "four");

    // Generic 5 quizzes
    for (const q of ["four", "teacher", "kalama", "rahula", "evidence"]) {
      await go(page, q);
      const buttons = page.locator("[aria-controls=q-" + q + "]");
      assert.equal(await buttons.count(), 3);
      for (let i = 0; i < 3; i++) {
        const b = buttons.nth(i);
        await b.click();
        assert.equal(await b.getAttribute("aria-pressed"), "true");
        assert.equal(await page.locator("#q-" + q).textContent(), await b.getAttribute("data-feedback"));
      }
    }

    // S01 Visitors + synthetic click latency check
    await go(page, "four");
    const tS01 = Date.now();
    await page.locator("[data-visitor='v2']").click();
    await page.locator("[data-vaction='believe']").click();
    assert((await page.locator("#s01-result").textContent()).includes("不能直接相信"));
    interactionLatencies.s01Ms = Date.now() - tS01;
    await page.locator("#s01-reset").click();
    assert((await page.locator("#s01-progress").textContent()).includes("0／4"));
    await shots(page, "s01-light");
    await axe(page, "light s01");

    // S02 Drum
    await go(page, "drum");
    for (let i = 0; i < 5; i++) await page.locator("#patch").click();
    assert.equal(await page.locator(".drum-patch.visible").count(), 5);
    assert(await page.locator("#patch").isDisabled());
    await page.locator("#mode-han").click();
    await page.locator("#patch").click();
    assert.equal(await page.locator("#leather").getAttribute("opacity"), "1");
    await shots(page, "s02-light");
    await page.locator("#reset-drum").click();
    assert.equal(await page.locator("#leather").getAttribute("opacity"), "0");

    // S03 Teacher
    await go(page, "teacher");
    await page.locator("[data-tstage='famous']").click();
    await page.locator("[data-tjudge='mind']").click();
    assert((await page.locator("#s03-judge-result").textContent()).includes("超出證據範圍"));
    await shots(page, "s03-light");
    await page.locator("#s03-reset").click();

    // S04 Kalama
    await go(page, "kalama");
    await page.locator("[data-kalama-ver='han']").click();
    assert((await page.locator("#s04-version-out").textContent()).includes("沒有十項清單"));
    await page.locator("[data-assasa='a2']").click();
    assert((await page.locator("#s04-assasa-out").textContent()).includes("第二安穩"));
    await shots(page, "s04-light");

    // S05 Rahula
    await go(page, "rahula");
    await page.locator("[data-basin='flipped']").click();
    assert.equal(await page.locator("#basin-bowl").getAttribute("transform"), "rotate(180 120 75)");
    await page.locator("[data-mirror='after']").click();
    await shots(page, "s05-light");

    // S06 Direction
    await go(page, "direction");
    await page.locator("[data-dir='d_counter']").click();
    assert((await page.locator("#s06-dir-out").textContent()).includes("不能用這八項標準"));
    await shots(page, "s06-light");

    // S07 Truth
    await go(page, "truth");
    await page.locator("[data-epitem='t3']").click();
    await page.locator("[data-epcat='unknown']").click();
    assert((await page.locator("#s07-result").textContent()).includes("✓ 分類合理"));
    await shots(page, "s07-light");
    await page.locator("#s07-reset").click();

    // S08 Evidence Magnifier: ALL 5 artifacts dynamically verified
    await go(page, "evidence");
    for (const [artKey, expectedFrag] of [
      ["lumbini", "Budha"],
      ["bhabra", "Lāghulovāde"],
      ["nigali", "拘那含"],
      ["sarnath", "分裂"],
      ["gandhara", "ACCESS_BLOCKED"]
    ]) {
      const tArt = Date.now();
      await page.locator(`[data-artifact='${artKey}']`).click();
      await checkVisibleImgs(page, `S08 ${artKey}`);
      const fullCap = (await page.locator("#viewer-obs").textContent())
        + " " + (await page.locator("#viewer-trans").textContent())
        + " " + (await page.locator("#viewer-limit").textContent());
      assert(fullCap.includes(expectedFrag), `S08 ${artKey} caption missing '${expectedFrag}'`);
      if (artKey === "gandhara") interactionLatencies.s08ArtifactSwitchMs = Date.now() - tArt;
    }
    await page.locator("[data-artifact='bhabra']").click();
    await page.locator("#viewer-zoom-in").click();
    assert((await page.locator("#viewer-zoom-status").textContent()).includes("140%"));
    await page.locator("#viewer-toggle-trans").click();
    assert(!(await page.locator("#viewer-trans").isHidden()));
    await page.locator("#viewer-reset").click();
    await shots(page, "s08-light");

    // S09 Transmission
    await go(page, "transmission");
    await page.locator("[data-txmode='chorus']").click();
    assert((await page.locator("#s09-out").textContent()).includes("Wynne"));
    await shots(page, "s09-light");
    await page.locator("#s09-reset").click();

    // S10 History Timeline & Map
    await go(page, "history");
    await page.locator("[data-era='2']").click();
    assert((await page.locator("#s10-time").textContent()).includes("前268–232"));
    await page.locator("#s10-next").click();
    assert((await page.locator("#s10-time").textContent()).includes("前300–100"));
    await shots(page, "s10-light");

    // S11 Branches & 5-Language
    await go(page, "branches");
    await page.locator("[data-trad='east']").click();
    assert((await page.locator("#s11-trad-out").textContent()).includes("漢傳佛教"));
    await page.locator("[data-lang5='lzh']").click();
    assert((await page.locator("#s11-lang5-out").textContent()).includes("雜阿含"));
    await shots(page, "s11-light");

    // S12 South Theravada
    await go(page, "south");
    await checkVisibleImgs(page, "S12 kuthodaw/sri-lanka");
    await page.locator("[data-south='kuthodaw']").click();
    assert((await page.locator("#s12-out").textContent()).includes("729"));
    await shots(page, "s12-light");

    // S13 Mahayana
    await go(page, "mahayana");
    await page.locator("[data-mahac='sunyata']").click();
    await page.locator("[data-bvacana='trad']").click();
    await shots(page, "s13-light");

    // S14 Texts (16 options + T223 vs T250/T251 + Fukui)
    await go(page, "texts");
    assert.equal(await page.locator("#s14-text-select option").count(), 16);
    await page.locator("#s14-text-select").selectOption("surangama");
    await page.locator("#s14-next-clue").click();
    assert((await page.locator("#s14-desk-out").textContent()).includes("T945"));
    await page.locator("#s14-all-clues").click();
    assert((await page.locator("#s14-heart-out").textContent()).includes("T0223"));
    const tS14 = Date.now();
    await page.locator("[data-heart='alt']").click();
    assert((await page.locator("#s14-heart-out").textContent()).includes("福井文雅"));
    interactionLatencies.s14HeartSwitchMs = Date.now() - tS14;
    await shots(page, "s14-light");

    // S15 China
    await go(page, "china");
    await page.locator("[data-cscene='food']").click();
    assert((await page.locator("#s15-out").textContent()).includes("10世紀"));
    await shots(page, "s15-light");

    // S16 Chan
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
    assert((await page.locator("#s17-result").textContent()).includes("✓ 分類合宜"));
    await shots(page, "s17-light");

    // S18 Politics
    await go(page, "politics");
    await checkVisibleImgs(page, "S18 india");
    await page.locator("[data-pol='war']").check();
    await page.locator("[data-pol='canon']").check();
    assert((await page.locator("#s18-out").textContent()).includes("存活者偏差"));
    await shots(page, "s18-light");
    await page.locator("#s18-reset").click();

    // S19 Japan
    await go(page, "japan");
    await page.locator("[data-jpera='meiji']").click();
    assert((await page.locator("#s19-out").textContent()).includes("並非強制結婚"));
    await shots(page, "s19-light");

    // S20 Women
    await go(page, "women");
    await page.locator("[data-wrelay='bhutan']").click();
    assert((await page.locator("#s20-relay-out").textContent()).includes("265"));
    await page.locator("[data-wview='conserv']").click();
    await shots(page, "s20-light");

    // S21 Modern & Taiwan
    await go(page, "modern");
    await checkVisibleImgs(page, "S21 taiwan");
    await page.locator("[data-modclaim='mindfulness']").click();
    assert((await page.locator("#s21-mod-out").textContent()).includes("Salguero"));
    await page.locator("[data-twera='modern']").click();
    await shots(page, "s21-light");

    // S22 Lab Workbench
    await go(page, "lab");
    await page.locator("[data-risk='low']").click();
    await page.locator("#audit-case").selectOption({ label: "拈花微笑是否有早期文獻？" });
    await page.locator("#load-case").click();
    for (const c of await page.locator(".audit-check").all()) await c.check();
    assert((await page.locator("#audit-status").textContent()).includes("7／7"));
    await page.reload();
    assert.equal(await page.locator(".audit-check:checked").count(), 7);
    const tS22 = Date.now();
    await page.locator("#copy-notes").click();
    await page.waitForFunction(() => document.querySelector("#copy-status").textContent.length > 0);
    interactionLatencies.s22CopyNotesMs = Date.now() - tS22;
    assert((await page.locator("#notes-output").inputValue()).includes("非真偽判定分數"));
    await page.locator("#reset-audit").click();
    assert.equal(await page.locator(".audit-check:checked").count(), 0);
    await shots(page, "s22-light");

    // Library NFKC + 0-result + pills + 39 cards + return
    await go(page, "library");
    await page.locator("#source-search").fill("ＡＮ ３.６５");
    assert(await page.locator("[data-source]:not([hidden])").count() > 0);
    await page.locator("#source-search").fill("不存在之關鍵字XYZ");
    assert.equal(await page.locator("[data-source]:not([hidden])").count(), 0);
    assert((await page.locator("#source-count").textContent()).includes("查無符合"));
    await page.locator("[data-filter='阿育王']").click();
    assert(await page.locator("[data-source]:not([hidden])").count() > 0);
    await page.locator("#clear-search").click();
    assert.equal(await page.locator("[data-source]:not([hidden])").count(), expectedSources);
    await shots(page, "library");
    await axe(page, "light library");

    await go(page, "four");
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
    assert.equal(await page.locator("#font-status").textContent(), "字級 16px");
    await inspect(page, "16px light 390px top", 56);
    await page.locator("#fontUp").click();
    await page.locator("#fontUp").click();
    assert.equal(await page.locator("#font-status").textContent(), "字級 20px");
    await page.locator("#fontUp").focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Space");
    assert.equal(await page.locator("#font-status").textContent(), "字級 24px");
    await page.locator("#fontUp").click();
    await page.locator("#fontUp").click();
    assert.equal(await page.locator("#font-status").textContent(), "字級 28px");
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
        assert.equal(await page.locator("#font-status").textContent(), `字級 ${targetFont}`);
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
    // 1) CSS Reflow at 720px viewport (WCAG 1.4.10 Reflow proxy, explicitly distinguished from CDP zoom)
    await page.setViewportSize({ width: 720, height: 900 });
    await go(page, "lab");
    await inspect(page, "css-reflow-720px-proxy lab", 64);

    // 2) Real Chromium CDP 200% browser scale zoom (separate from viewport reflow)
    let cdpZoomStatus = "NOT_SUPPORTED_ON_ENGINE";
    if (engine === "chromium") {
      await page.setViewportSize({ width: 1280, height: 900 });
      const cdp = await context.newCDPSession(page);
      await cdp.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });
      await go(page, "evidence");
      await inspect(page, "real-cdp-200pct-zoom evidence", 64);
      await cdp.send("Emulation.setPageScaleFactor", { pageScaleFactor: 1 });
      await cdp.detach();
      cdpZoomStatus = "PASS_CDP_SCALE_2X";
    }
    await page.setViewportSize({ width: 390, height: 844 });
    console.log("ZOOM_CHECK_STATUS", JSON.stringify({ engine, cssReflow720px: "PASS", realCdpZoom: cdpZoomStatus }));

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
