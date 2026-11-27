import assert from "node:assert/strict";
import { Script } from "node:vm";
import { readFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { extname, resolve } from "node:path";
import { chromium, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";

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

function validateHtmlStatic(label, html) {
  for (const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    new Script(m[1], { filename: label + "-inline.js" });
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
  assert.equal(ids.length, new Set(ids).size, `${label}: duplicate IDs`);
  const idSet = new Set(ids);
  const broken = [...html.matchAll(/href="#([^"]+)"/g)].map(x => x[1]).filter(x => !idSet.has(x));
  assert.equal(broken.length, 0, `${label}: broken internal anchors: ${broken.join(",")}`);
  const leaks = html.match(/(turn\d+search|<Cite\b|<AsyncImage|TODO:)/g);
  assert.equal(leaks, null, `${label}: leaked source markers`);
  return idSet;
}

function validateCoverageStatic(covText, hIds, rIds, minRows = 244) {
  const lines = covText.trim().split(/\r?\n/);
  const headers = lines[0].split("\t");
  assert(lines.length - 1 >= minRows, "coverage matrix rows < " + minRows);
  const idx = name => headers.indexOf(name);
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split("\t");
    const sid = cols[idx("source_id")];
    const pub = (cols[idx("public_anchor")] || "").replace(/^#/, "");
    const res = (cols[idx("research_anchor")] || "").replace(/^#/, "");
    const cids = (cols[idx("claim_ids")] || "").trim();
    assert(pub && hIds.has(pub), `coverage ${sid}: invalid public_anchor #${pub}`);
    assert(res && rIds.has(res), `coverage ${sid}: invalid research_anchor #${res}`);
    assert(cids.length > 0, `coverage ${sid}: empty claim_ids`);
  }
  return lines.length - 1;
}

// 1. Static checks on build outputs, JS files, TSVs, and assets
const historyHtml = readFileSync("history.html", "utf8");
const researchHtml = readFileSync("history-research.html", "utf8");
new Script(readFileSync("assets/history/history.js", "utf8"), { filename: "assets/history/history.js" });
new Script(readFileSync("assets/history/research.js", "utf8"), { filename: "assets/history/research.js" });

const hIds = validateHtmlStatic("history.html", historyHtml);
const rIds = validateHtmlStatic("history-research.html", researchHtml);

assert.equal((historyHtml.match(/data-station="/g) || []).length, 22, "expected 22 stations");
assert.equal((historyHtml.match(/data-source\b/g) || []).length, 31, "expected 31 source cards");

const legacyAnchors = [
  "s-four","s-fourmore","s-drum","s-teacher","s-kalama","s-rahula","s-direction","s-truth",
  "s-core","s-meat","s-ashoka","s-scroll","s-allon","s-baums","s-buddha","s-council",
  "s-fogelin","s-sen","s-gethin","s-heart","s-attribution","s-filial","s-veg","s-chan",
  "s-tibet","s-japan","s-nuns","s-modern","s-tw","s-lib"
];
for (const lid of legacyAnchors) assert(hIds.has(lid), `missing legacy #${lid}`);

for (const m of historyHtml.matchAll(/href="\.\/history-research\.html#([^"]+)"/g)) {
  assert(rIds.has(m[1]), `broken cross link ./history-research.html#${m[1]}`);
}
for (const m of researchHtml.matchAll(/href="\.\/history\.html#([^"]+)"/g)) {
  assert(hIds.has(m[1]), `broken cross link ./history.html#${m[1]}`);
}

const covText = readFileSync("docs/HISTORY_COVERAGE.tsv", "utf8");
const covCount = validateCoverageStatic(covText, hIds, rIds);

// Verify images rights TSV + SHA256 hashes + HTML dimensions
const rightsLines = readFileSync("docs/HISTORY_IMAGES_RIGHTS.tsv", "utf8").trim().split(/\r?\n/);
const rHeaders = rightsLines[0].split("\t");
for (let i = 1; i < rightsLines.length; i++) {
  const cols = rightsLines[i].split("\t");
  const status = cols[rHeaders.indexOf("status")];
  const localFile = cols[rHeaders.indexOf("local_file")];
  const expectedSha = cols[rHeaders.indexOf("file_SHA256")];
  if (status === "EMBEDDED") {
    assert(existsSync(localFile), "missing evidence image: " + localFile);
    const actualSha = createHash("sha256").update(readFileSync(localFile)).digest("hex");
    assert.equal(actualSha, expectedSha, "SHA256 mismatch for " + localFile);
  }
}
for (const m of historyHtml.matchAll(/<img\b[^>]*>/g)) {
  assert(/\bwidth="/.test(m[0]) && /\bheight="/.test(m[0]) && /\balt="/.test(m[0]), "<img> missing dimensions/alt: " + m[0]);
}

// 2. Negative self-tests (ensure verifier catches broken HTML/TSV)
assert.throws(() => validateHtmlStatic("neg-dup", '<div id="x"></div><div id="x"></div>'), /duplicate IDs/);
assert.throws(() => validateHtmlStatic("neg-anchor", '<div id="x"><a href="#missing"></a></div>'), /broken internal anchors/);
assert.throws(() => validateCoverageStatic("source_id\tpublic_anchor\tresearch_anchor\tclaim_ids\nX1\t#four\t#method\tC01-001", hIds, rIds, 244), /coverage matrix rows/);
assert.throws(() => validateCoverageStatic("source_id\tpublic_anchor\tresearch_anchor\tclaim_ids\nX1\t#bad\t#method\tC01-001", hIds, rIds, 1), /invalid public_anchor/);
console.log("PASS static + negative self-tests (" + covCount + " coverage rows)");

// 3. Local static server for Playwright
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
  const a = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
    visible: [...document.querySelectorAll("main section[id]")].filter(x => !x.hidden && !x.closest("[hidden]")).map(x => x.id),
    header: document.querySelector(".header").getBoundingClientRect().height,
    body: document.body.scrollHeight,
    theme: document.documentElement.dataset.theme
  }));
  assert(a.scroll <= a.client + 2, label + " horizontal overflow " + JSON.stringify(a));
  assert(a.header <= maxHeader, label + " header exceeds " + maxHeader + "px: " + JSON.stringify(a));
  console.log("PASS " + label + " " + JSON.stringify(a));
  return a;
}

async function go(page, id) {
  await page.goto(base + "#" + id);
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

try {
  // Cold-start 5-run latency / LCP / CLS measurement
  const perfRuns = [];
  for (let r = 0; r < 5; r++) {
    const pc = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "zh-TW" });
    const pp = await pc.newPage();
    await pp.addInitScript(() => {
      window.__perf = { lcp: 0, cls: 0 };
      new PerformanceObserver(l => {
        for (const e of l.getEntries()) window.__perf.lcp = Math.max(window.__perf.lcp, e.startTime);
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(l => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    const t0 = Date.now();
    await pp.goto(base, { waitUntil: "load" });
    await pp.waitForFunction(() => document.documentElement.classList.contains("enhanced"));
    const dt = Date.now() - t0;
    const m = await pp.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      return {
        wallMs: 0,
        domInteractive: Math.round(nav ? nav.domInteractive : 0),
        loadEnd: Math.round(nav ? nav.loadEventEnd : 0),
        lcpMs: Math.round(window.__perf.lcp),
        cls: Number(window.__perf.cls.toFixed(4))
      };
    });
    m.wallMs = dt;
    perfRuns.push(m);
    await pc.close();
  }
  console.log("PERF_COLD_5_RUNS " + JSON.stringify(perfRuns));

  context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, locale: "zh-TW" });
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  const page = await context.newPage();
  page.on("pageerror", e => { errors.push(String(e)); console.error("PAGE_ERROR", e.stack || String(e)); });

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

  // Touch target size check on landing action buttons
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

  // S01 Visitors
  await go(page, "four");
  await page.locator("[data-visitor='v2']").click();
  await page.locator("[data-vaction='believe']").click();
  assert((await page.locator("#s01-result").textContent()).includes("不能直接相信"));
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
  await shots(page, "s02-drum-han");
  await page.locator("#reset-drum").click();
  assert.equal(await page.locator("#leather").getAttribute("opacity"), "0");

  // S03 Teacher
  await go(page, "teacher");
  await page.locator("[data-tstage='famous']").click();
  await page.locator("[data-tjudge='mind']").click();
  assert((await page.locator("#s03-judge-result").textContent()).includes("超出證據範圍"));
  await page.locator("#s03-reset").click();

  // S04 Kalama
  await go(page, "kalama");
  await page.locator("[data-kalama-ver='han']").click();
  assert((await page.locator("#s04-version-out").textContent()).includes("沒有十項清單"));
  await page.locator("[data-assasa='a2']").click();
  assert((await page.locator("#s04-assasa-out").textContent()).includes("第二安穩"));

  // S05 Rahula
  await go(page, "rahula");
  await page.locator("[data-basin='flipped']").click();
  assert.equal(await page.locator("#basin-bowl").getAttribute("transform"), "rotate(180 120 75)");
  await page.locator("[data-mirror='after']").click();

  // S06 Direction
  await go(page, "direction");
  await page.locator("[data-dir='d_counter']").click();
  assert((await page.locator("#s06-dir-out").textContent()).includes("不能用這八項標準"));

  // S07 Truth
  await go(page, "truth");
  await page.locator("[data-epitem='t3']").click();
  await page.locator("[data-epcat='unknown']").click();
  assert((await page.locator("#s07-result").textContent()).includes("✓ 分類合理"));
  await page.locator("#s07-reset").click();

  // S08 Evidence Magnifier + Real Images
  await go(page, "evidence");
  await checkVisibleImgs(page, "S08 lumbini");
  await page.locator("[data-artifact='bhabra']").click();
  await page.locator("#viewer-zoom-in").click();
  assert((await page.locator("#viewer-zoom-status").textContent()).includes("140%"));
  await page.locator("#viewer-toggle-trans").click();
  assert(!(await page.locator("#viewer-trans").isHidden()));
  await page.locator("[data-artifact='gandhara']").click();
  await checkVisibleImgs(page, "S08 gandhara");
  await page.locator("#viewer-reset").click();
  await shots(page, "s08-magnifier");

  // S09 Transmission
  await go(page, "transmission");
  await page.locator("[data-txmode='chorus']").click();
  assert((await page.locator("#s09-out").textContent()).includes("Wynne"));
  await page.locator("#s09-reset").click();

  // S10 History Timeline & Map
  await go(page, "history");
  await page.locator("[data-era='2']").click();
  assert((await page.locator("#s10-time").textContent()).includes("前268–232"));
  await page.locator("#s10-next").click();
  assert((await page.locator("#s10-time").textContent()).includes("前300–100"));
  await shots(page, "s10-timeline");

  // S11 Branches & 5-Language
  await go(page, "branches");
  await page.locator("[data-trad='east']").click();
  assert((await page.locator("#s11-trad-out").textContent()).includes("漢傳佛教"));
  await page.locator("[data-lang5='lzh']").click();
  assert((await page.locator("#s11-lang5-out").textContent()).includes("雜阿含"));

  // S12 South Theravada
  await go(page, "south");
  await checkVisibleImgs(page, "S12 kuthodaw/sri-lanka");
  await page.locator("[data-south='kuthodaw']").click();
  assert((await page.locator("#s12-out").textContent()).includes("729"));

  // S13 Mahayana
  await go(page, "mahayana");
  await page.locator("[data-mahac='sunyata']").click();
  await page.locator("[data-bvacana='trad']").click();

  // S14 Texts (16 options)
  await go(page, "texts");
  assert.equal(await page.locator("#s14-text-select option").count(), 16);
  await page.locator("#s14-text-select").selectOption("surangama");
  await page.locator("#s14-next-clue").click();
  assert((await page.locator("#s14-desk-out").textContent()).includes("T945"));
  await page.locator("#s14-all-clues").click();
  await page.locator("[data-heart='alt']").click();
  await shots(page, "s14-texts");

  // S15 China
  await go(page, "china");
  await page.locator("[data-cscene='food']").click();
  assert((await page.locator("#s15-out").textContent()).includes("10世紀"));

  // S16 Chan
  await go(page, "chan");
  await checkVisibleImgs(page, "S16 chan");
  await page.locator("[data-chan='tiansheng']").click();
  assert((await page.locator("#s16-out").textContent()).includes("1036"));

  // S17 Tibet
  await go(page, "tibet");
  await page.locator("[data-tibet-item='tb4']").click();
  await page.locator("[data-tbox='belief']").click();
  assert((await page.locator("#s17-result").textContent()).includes("✓ 分類合宜"));

  // S18 Politics
  await go(page, "politics");
  await checkVisibleImgs(page, "S18 india");
  await page.locator("[data-pol='war']").check();
  await page.locator("[data-pol='canon']").check();
  assert((await page.locator("#s18-out").textContent()).includes("存活者偏差"));
  await page.locator("#s18-reset").click();

  // S19 Japan
  await go(page, "japan");
  await page.locator("[data-jpera='meiji']").click();
  assert((await page.locator("#s19-out").textContent()).includes("並非強制結婚"));

  // S20 Women
  await go(page, "women");
  await page.locator("[data-wrelay='bhutan']").click();
  assert((await page.locator("#s20-relay-out").textContent()).includes("265"));
  await page.locator("[data-wview='conserv']").click();

  // S21 Modern & Taiwan
  await go(page, "modern");
  await checkVisibleImgs(page, "S21 taiwan");
  await page.locator("[data-modclaim='mindfulness']").click();
  assert((await page.locator("#s21-mod-out").textContent()).includes("Salguero"));
  await page.locator("[data-twera='modern']").click();
  await shots(page, "s21-taiwan");

  // S22 Lab Workbench
  await go(page, "lab");
  await page.locator("[data-risk='low']").click();
  await page.locator("#audit-case").selectOption({ label: "拈花微笑是否有早期文獻？" });
  await page.locator("#load-case").click();
  for (const c of await page.locator(".audit-check").all()) await c.check();
  assert((await page.locator("#audit-status").textContent()).includes("7／7"));
  await page.reload();
  assert.equal(await page.locator(".audit-check:checked").count(), 7);
  await page.locator("#copy-notes").click();
  await page.waitForFunction(() => document.querySelector("#copy-status").textContent.length > 0);
  assert((await page.locator("#notes-output").inputValue()).includes("非真偽判定分數"));
  await page.locator("#reset-audit").click();
  assert.equal(await page.locator(".audit-check:checked").count(), 0);
  await shots(page, "s22-workbench");

  // Library NFKC + 0-result + pills + return
  await go(page, "library");
  await page.locator("#source-search").fill("ＡＮ ３.６５");
  assert(await page.locator("[data-source]:not([hidden])").count() > 0);
  await page.locator("#source-search").fill("不存在之關鍵字XYZ");
  assert.equal(await page.locator("[data-source]:not([hidden])").count(), 0);
  assert((await page.locator("#source-count").textContent()).includes("查無符合"));
  await page.locator("[data-filter='阿育王']").click();
  assert(await page.locator("[data-source]:not([hidden])").count() > 0);
  await page.locator("#clear-search").click();
  assert.equal(await page.locator("[data-source]:not([hidden])").count(), 31);
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

  // Dark theme + keyboard 24px -> 28px + 7 widths + 200% zoom simulation
  await page.locator(".settings summary").click();
  await page.locator("#theme").click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await page.locator("#fontUp").focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  assert.equal(await page.locator("#font-status").textContent(), "字級 24px");
  await page.locator("#fontUp").click();
  await page.locator("#fontUp").click();
  assert.equal(await page.locator("#font-status").textContent(), "字級 28px");
  await page.locator(".settings summary").click();
  await go(page, "four");
  await shots(page, "station-dark-large");
  await axe(page, "dark large s01");

  for (const w of [320, 375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width: w, height: 900 });
    const mh = w <= 430 ? 56 : 64;
    for (const id of ["top", "four", "evidence", "history", "texts", "modern", "lab", "library"]) {
      await go(page, id);
      await inspect(page, id + " " + w + "px 28px dark", mh);
    }
  }
  // WCAG 200% zoom reflow test (720px viewport ~= 1440px @ 200%)
  await page.setViewportSize({ width: 720, height: 900 });
  await go(page, "lab");
  await inspect(page, "200pct zoom reflow lab", 64);

  await page.setViewportSize({ width: 390, height: 844 });
  await go(page, "library");
  await axe(page, "dark library");

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

  // Research companion page checks
  await page.goto(resUrl);
  await page.waitForFunction(() => document.documentElement.classList.contains("enhanced"));
  await inspect(page, "research light 390px", 56);
  await shots(page, "research-light");
  await axe(page, "research light");
  await page.locator("#res-search").fill("SF 245");
  assert.equal(await page.locator("[data-evidence-card]:not([hidden])").count(), 1);
  await page.locator("#res-clear").click();
  assert.equal(await page.locator("[data-evidence-card]:not([hidden])").count(), 31);
  await page.locator("#copy-bib").click();
  assert((await page.locator("#bib-copy-status").textContent()).includes("31 筆"));
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
  assert.equal(await np.locator("[data-source]").count(), 31);
  assert.equal(await np.locator("[data-station][hidden]").count(), 0);
  await np.locator("#act-3 summary").click();
  assert(await np.locator("#act-3 a[href='#china']").isVisible());
  await np.goto(resUrl);
  assert.equal(await np.locator("[data-evidence-card]").count(), 31);
  await no.close();

  assert.deepEqual(errors, [], "uncaught page errors");
  console.log("HISTORY_QA_SUMMARY " + JSON.stringify({ engine, failures: 0, stations: 22, sourceGroups: 31, researchClaims: 36, coverageRows: covCount }));
} finally {
  if (context) {
    await context.tracing.stop({ path: output + "/trace.zip" }).catch(() => {});
    await context.close();
  }
  await browser.close();
  server.close();
}
