import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { ACT1_STATIONS } from "./data/stations-act1.mjs";
import { ACT2_STATIONS } from "./data/stations-act2.mjs";
import { ACT3_STATIONS } from "./data/stations-act3.mjs";
import { ACT4_STATIONS } from "./data/stations-act4.mjs";
import { EVIDENCE_ITEMS } from "./data/evidence-registry.mjs";
import { RESEARCH_SECTIONS, CLAIMS } from "./data/claims-registry.mjs";

const esc = s => String(s)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

// Map E01..E31 to unique article IDs while preserving all 30 legacy #s-* IDs cleanly.
// Specifically: E01 -> s-four, E02 -> s-four-da2, E03 -> s-fourmore, E04 -> s-fourmore-vinaya,
// E13 -> s-baums, E19 -> s-mahayana, and add #s-veg inside E23 (#s-meat) and #s-sen inside E26 (#s-fogelin).
function resolveSourceId(item, seenIds) {
  let id = item.legacyAnchor;
  if (seenIds.has(id)) {
    const map = {
      E02: "s-four-da2",
      E04: "s-fourmore-vinaya",
      E19: "s-mahayana"
    };
    id = map[item.id] || ("s-" + item.id.toLowerCase());
  }
  seenIds.add(id);
  return id;
}

function buildLibraryArticles() {
  const seen = new Set();
  return EVIDENCE_ITEMS.map(item => {
    const id = resolveSourceId(item, seen);
    const extraAnchor = id === "s-meat"
      ? `<span id="s-veg"></span>`
      : (id === "s-fogelin" ? `<span id="s-sen"></span>` : "");
    const accessLabel = {
      PRIMARY_CHECKED: "經文實證已讀",
      FULLTEXT_CHECKED: "公開全文已讀",
      ABSTRACT_ONLY: "摘要／書目已核",
      CATALOG_ONLY: "館藏目錄定位"
    }[item.access] || item.access;
    return `<article class="evidence" id="${id}" data-source tabindex="-1">${extraAnchor}
      <p><span class="tag">${esc(item.type)}</span> <span class="badge">${esc(item.id)}</span> <span class="badge">${esc(accessLabel)}</span></p>
      <h3>${esc(item.title)}</h3>
      <p class="small"><strong>作者／編譯者：</strong>${esc(item.author)} · <strong>年代：</strong>${esc(item.year)} · <strong>卷頁：</strong>${esc(item.locator)}</p>
      <p>${esc(item.summary)}</p>
      <p class="small"><strong>支持範圍：</strong>${esc(item.supports)} · <strong>不代表：</strong>${esc(item.doesNotSupport)}</p>
      <p class="small">關鍵詞：${esc(item.topics.join("、"))}</p>
      <div class="links">
        <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">主要來源連結</a>
        ${item.altUrl ? `<a href="${esc(item.altUrl)}" target="_blank" rel="noopener noreferrer">平行／補充來源</a>` : ""}
        <a href="./history-research.html#${esc(item.id.toLowerCase())}">在研究頁檢視書目與引文</a>
      </div>
    </article>`;
  }).join("\n");
}

function buildHistoryHtml() {
  const allStations = [...ACT1_STATIONS, ...ACT2_STATIONS, ...ACT3_STATIONS, ...ACT4_STATIONS].join("\n");
  const libraryArticles = buildLibraryArticles();

  return `<!DOCTYPE html>
<html lang="zh-Hant" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#f8f5ee">
  <title>這真的是佛陀說的嗎？｜佛教歷史互動探索館 v2.0｜看見更多</title>
  <meta name="description" content="以早期經律、阿育王碑銘、犍陀羅手稿、跨傳承比較與現代史料，用22站互動探索認識兩千五百年佛教如何形成與查證。">
  <link rel="canonical" href="https://t14210184.github.io/The-Naked-Dhamma/history.html">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="zh_TW">
  <meta property="og:site_name" content="看見更多｜The Naked Dhamma">
  <meta property="og:title" content="這真的是佛陀說的嗎？｜22站互動證據探索館">
  <meta property="og:description" content="從古鼓、石柱碑銘、犍陀羅寫本到現代佛教與七步查證法：為兒童與長輩也能自在操作而重建的互動歷史探索館。">
  <meta property="og:url" content="https://t14210184.github.io/The-Naked-Dhamma/history.html">
  <meta property="og:image" content="https://t14210184.github.io/The-Naked-Dhamma/social-history.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="assets/history/history.css">
  <script defer src="assets/history/history.js"></script>
</head>
<body>
  <a class="skip" href="#main">跳到主要內容</a>
  <header class="header">
    <div class="container">
      <div class="bar">
        <a class="logo" href="./index.html">看見更多</a>
        <a class="top-link" href="#menu">目錄</a>
        <a class="top-link" href="./history-research.html">研究</a>
        <details class="settings" id="settings">
          <summary aria-label="設定字級、深淺配色與朗讀">設定</summary>
          <div class="settings-panel" role="group" aria-label="閱讀顯示設定">
            <p class="small">可調整字級大小，與切換暖紙淺色／柔光深色模式。</p>
            <div class="controls">
              <button type="button" id="fontDown" aria-label="縮小文字">字－</button>
              <button type="button" id="fontUp" aria-label="放大文字">字＋</button>
              <button type="button" id="theme" aria-pressed="false">切換柔光深色</button>
            </div>
            <p id="font-status" class="small" role="status" aria-live="polite">字級 20px</p>
            <p><button type="button" id="tts-toggle" aria-pressed="false" hidden>朗讀目前頁面</button></p>
            <p id="tts-status" class="small" role="status" aria-live="polite"></p>
            <p class="small"><a href="./index.html">首頁</a> · <a href="./merit.html">第二篇</a> · <a href="./history-research.html">研究詳頁</a> · <a href="#library">來源庫</a></p>
          </div>
        </details>
      </div>
      <div class="progress" aria-hidden="true"><span id="reading"></span></div>
    </div>
  </header>

  <main id="main">
    <section id="top" class="hero" tabindex="-1">
      <div class="container">
        <div id="route-notice" class="note" role="status" aria-live="polite" hidden></div>
        <div id="resume" class="note" hidden>
          <p><strong>上次看到：</strong><a id="resume-link" href="#four">繼續閱讀</a> <button type="button" id="resume-close" class="small">清除紀錄</button></p>
        </div>

        <div class="hero-grid">
          <div class="hero-intro">
            <span class="kicker">第三篇｜佛教史與文本證據探索館（v2.0）</span>
            <h1>這真的是<em>佛陀說的嗎？</em></h1>
            <p class="lead">兩千五百年前沒有錄音機。今日各地流傳的經典、宗派與儀式，究竟哪些有跨傳承與古物佐證，哪些是歷代地方文化的演變與重新編寫？</p>
            <p class="small">全部 22 站可依序探索、也可直接跳頁或無 JS 完整閱讀；每個白話結論都附原典依據並直連 <a href="./history-research.html">專業研究證據詳頁</a>。</p>
          </div>
          <div class="hero-action">
            <div class="button-row">
              <a class="button" href="#four">從第 01 站開始</a>
              <a class="button secondary" href="#quick">先看五分鐘總覽</a>
              <a class="button secondary" href="#all">一次展開全館</a>
              <a class="button secondary" href="./history-research.html">看研究與書目詳頁</a>
            </div>
          </div>
          <div class="art">
            <svg viewBox="0 0 380 230" role="img" aria-labelledby="hero-art-t hero-art-d">
              <title id="hero-art-t">從早期教法核對到兩千五百年歷史層次示意圖</title>
              <desc id="hero-art-d">顯示四大教法查證桌、阿育王石柱與犍陀羅樺皮卷、以及五大歷史層次的探索路徑（現代原創插圖）。</desc>
              <rect width="380" height="230" rx="16" fill="#173832"/>
              <g fill="#224a42" stroke="#9fe0bd" stroke-width="2">
                <rect x="20" y="28" width="102" height="58" rx="10"/>
                <rect x="139" y="28" width="102" height="58" rx="10"/>
                <rect x="258" y="28" width="102" height="58" rx="10"/>
              </g>
              <path d="M122 57 H139 M241 57 H258" stroke="#ecc98e" stroke-width="3"/>
              <g fill="#f8f5ee" font-size="13" text-anchor="middle" font-weight="700">
                <text x="71" y="53">第一步</text>
                <text x="71" y="73" fill="#ecc98e">經律查證法</text>
                <text x="190" y="53">第二步</text>
                <text x="190" y="73" fill="#ecc98e">碑銘與古寫本</text>
                <text x="309" y="53">第三步</text>
                <text x="309" y="73" fill="#ecc98e">各傳承演變</text>
              </g>
              <rect x="20" y="106" width="340" height="96" rx="12" fill="#102924" stroke="#7a9186" stroke-width="1.5"/>
              <g fill="#e6e3dc" font-size="12" text-anchor="middle">
                <text x="190" y="130" font-weight="700" fill="#9fe0bd">不把歷史事實、哲學價值與宗教信仰混為一談</text>
                <text x="190" y="153">古老 ≠ 佛陀逐字原音 · 晚出 ≠ 惡意造假</text>
                <text x="190" y="174">跨傳承相同 ≠ 完全獨立 · 史料 ≠ 證明宗教或醫療真偽</text>
                <text x="190" y="195" fill="#ecc98e" font-size="11">22 站獨立互動展區 × 雙主題大字級 × 完整書目可驗</text>
              </g>
            </svg>
            <p>現代原創導覽示意：帶您一步步拆解經典背後的歷史證據層次。</p>
          </div>
        </div>

        <noscript>
          <div class="note"><p><strong>您目前停用了 JavaScript：</strong>本頁面已自動展開全部 22 站全文、圖表與 31 組來源庫，並隨附「不按也能讀」替代文字說明，您仍可順暢讀完全文與點擊站內導覽。</p></div>
        </noscript>

        <section id="menu" class="menu" tabindex="-1" aria-label="四幕二十二站總目錄">
          <h2>四幕展覽總目錄（22 站 · 點按任一幕展開）</h2>
          <p class="small">預設收合以保持首頁清爽；您也可直接點擊「一次展開全館」瀏覽長文章。</p>
          <div class="act-grid">
            <details class="act" id="act-1">
              <summary><span class="act-num">第一幕 · S01–S07</span><strong>經典自己怎麼教我們查證？</strong><small>四大教法、古鼓譬喻、查驗導師與知識邊界</small></summary>
              <ol class="station-list">
                <li><a href="#four"><span class="station-num">01</span><span>誰說的都要查</span><small>DN 16 與 DA 2 四大教法查證桌</small></a></li>
                <li><a href="#drum"><span class="station-num">02</span><span>鼓還叫原來的鼓嗎？</span><small>巴利木楔鼓 vs 漢譯牛皮鼓</small></a></li>
                <li><a href="#teacher"><span class="station-num">03</span><span>佛經允許我們查老師嗎？</span><small>MN 47 與 MA 186 三時點調查</small></a></li>
                <li><a href="#kalama"><span class="station-num">04</span><span>《伽藍經》是不是「自己爽就好」？</span><small>AN 3.65 vs MA 16 與四安穩</small></a></li>
                <li><a href="#rahula"><span class="station-num">05</span><span>跟孩子講實話的鏡子</span><small>MN 61／MA 14 洗腳盆與三時鏡</small></a></li>
                <li><a href="#direction"><span class="station-num">06</span><span>怎麼分辨這方法把人帶去哪裡？</span><small>AN 8.53 八項方向羅盤</small></a></li>
                <li><a href="#truth"><span class="station-num">07</span><span>「我覺得」和「我真的知道」差在哪？</span><small>MN 95 認識論三階梯</small></a></li>
              </ol>
            </details>

            <details class="act" id="act-2">
              <summary><span class="act-num">第二幕 · S08–S12</span><strong>真實歷史、碑銘與早期流派</strong><small>阿育王石刻、犍陀羅手稿、口傳與部派分化</small></summary>
              <ol class="station-list">
                <li><a href="#evidence"><span class="station-num">08</span><span>當歷史偵探</span><small>藍毘尼石柱與犍陀羅樺皮實物放大鏡</small></a></li>
                <li><a href="#transmission"><span class="station-num">09</span><span>二千多年的傳話遊戲</span><small>口傳保守性與異文擴編沙盒</small></a></li>
                <li><a href="#history"><span class="station-num">10</span><span>兩千五百年的路</span><small>生平卡、十二時期時間軸與四次結集</small></a></li>
                <li><a href="#branches"><span class="station-num">11</span><span>同一棵樹還是很多條河？</span><small>早期12共識、七部派與三大傳統</small></a></li>
                <li><a href="#south"><span class="station-num">12</span><span>南傳上座部也是慢慢長成的</span><small>斯里蘭卡三寺、1753 戒脈與 729 經碑</small></a></li>
              </ol>
            </details>

            <details class="act" id="act-3">
              <summary><span class="act-num">第三幕 · S13–S18</span><strong>大乘、東亞轉折、禪與藏傳</strong><small>古典起源、疑偽辨析、漢地調適與存活者偏差</small></summary>
              <ol class="station-list">
                <li><a href="#mahayana"><span class="station-num">13</span><span>大乘經典從哪裡來？</span><small>Split C14 75 CE 與九項思想交織河道</small></a></li>
                <li><a href="#texts"><span class="station-num">14</span><span>佛經也有身分證問題</span><small>16類文獻鑑定桌與《心經》《楞嚴》對讀</small></a></li>
                <li><a href="#china"><span class="station-num">15</span><span>到了中國，佛教怎麼生活？</span><small>孝道、莊園與三淨肉到十世紀素食</small></a></li>
                <li><a href="#chan"><span class="station-num">16</span><span>「拈花微笑」不是佛世現場筆錄？</span><small>敦煌 vs 1310 版與燈錄成書偵探</small></a></li>
                <li><a href="#tibet"><span class="station-num">17</span><span>密教、伏藏與轉世怎麼看？</span><small>吐蕃史實、桑耶寺與宗教信念分界</small></a></li>
                <li><a href="#politics"><span class="station-num">18</span><span>皇帝、戰爭與《大藏經》如何留下來？</span><small>滅佛、那爛陀衰退與《開寶藏》</small></a></li>
              </ol>
            </details>

            <details class="act" id="act-4">
              <summary><span class="act-num">第四幕 · S19–S22</span><strong>近代變革、臺灣現場與七步工具</strong><small>日本明治法令、女性受戒、現代正念與查證工具</small></summary>
              <ol class="station-list">
                <li><a href="#japan"><span class="station-num">19</span><span>日本和尚為什麼能結婚生子？</span><small>親鸞先例、德川戶籍與 1872 解禁令</small></a></li>
                <li><a href="#women"><span class="station-num">20</span><span>女性的地位一直都是這樣嗎？</span><small>八敬法、429/433南京與 2022/2025 不丹</small></a></li>
                <li><a href="#modern"><span class="station-num">21</span><span>你認識的佛教，其實只有一百年？</span><small>佛教現代主義、禪修風險與臺灣四期</small></a></li>
                <li><a href="#lab"><span class="station-num">22</span><span>下一次有人說「這是佛陀親口講的」</span><small>舉證負擔、五層模型與七步查證工作台</small></a></li>
              </ol>
            </details>
          </div>
        </section>
      </div>
    </section>

    <section id="quick" class="chapter" tabindex="-1">
      <div class="container">
        <span class="kicker">五分鐘總覽 · 五大關鍵發現</span>
        <h2>不想一次看 22 站？先掌握這五把鑰匙</h2>
        <ol class="quick-list">
          <li><strong>早期經典主動教人查證，而非盲信權威：</strong><a href="#four">DN 16 與 DA 2 四大教法</a>要求即使是親聞佛陀或整個僧團的話也要比對經律；<a href="#kalama">AN 3.65《伽藍經》</a>但也不是「自己覺得對就好」，仍須受貪瞋癡與智者稱譽檢驗。</li>
          <li><strong>最早的實物比傳世全本紙本早了許多世紀：</strong>目前有紀年實物為西元前3世紀<a href="#evidence">阿育王碑銘</a>，以及前1至後4世紀<a href="#evidence">犍陀羅樺皮手稿</a>；口傳期間既有嚴格集體背誦（Wynne 2004），也有異文與定型句編輯（Allon 2022）。</li>
          <li><strong>沒有單一宗派能獨佔「100% 佛陀原汁原味」：</strong>南傳、漢傳、藏傳各有古老核與各自經歷的<a href="#branches">部派分化</a>、王權整理（如<a href="#south">1753 斯里蘭卡暹羅派重建</a>）與歷史篩選（如<a href="#politics">《開寶藏》與寺院衰退</a>）。</li>
          <li><strong>後世發展不等於蓄意造假：</strong><a href="#mahayana">Split 寫本（約75 CE）</a>證明大乘源於印度文化圈；中國疑偽經、日本 1872 解禁令、漢傳 10 世紀確立僧尼素食與<a href="#modern">近現代正念詮釋</a>，都反映時代調適而非單純詐欺。</li>
          <li><strong>帶走工具，把三件事永遠分開：</strong>歷史事實、哲學啟發與宗教信念各有檢驗方式。用第 22 站的<a href="#lab">七步查證法與五層歷史模型</a>，遇到「佛陀這樣說」即可獨立核實。</li>
        </ol>
        <div class="button-row">
          <a class="button" href="#four">進第 01 站互動探索</a>
          <a class="button secondary" href="#menu">回到四幕目錄</a>
          <a class="button secondary" href="./history-research.html">打開學術證據詳頁</a>
        </div>
      </div>
    </section>

    ${allStations.replace(/^/, '<span id="all"></span>\n    ')}

    <section id="library" class="chapter" tabindex="-1">
      <div class="container">
        <span class="kicker">核心文獻與館藏來源資料庫 · 共 ${EVIDENCE_ITEMS.length} 組</span>
        <h2>全部核心資料來源與查證連結</h2>
        <p><a id="source-back" class="button secondary js-only" href="#four" hidden>← 回到剛剛在看的站點</a></p>
        <p class="small">本區對應站內全部引用並保留舊深連結；更完整的命題級正反證據表、多語引文與學界書目請見 <a href="./history-research.html#bib">研究詳頁完整書目</a>。</p>
        <label class="js-only" for="source-search"><b>搜尋來源（支援繁簡字與全半形）：</b>
          <input type="search" id="source-search" class="search" placeholder="例如：DN 16、伽藍經、阿育王、犍陀羅、心經、不丹、臺灣">
        </label>
        <div class="controls js-only" role="group" aria-label="常用關鍵詞快速篩選">
          <button type="button" data-filter="四大教法">四大教法</button>
          <button type="button" data-filter="伽藍經">伽藍經</button>
          <button type="button" data-filter="阿育王">阿育王</button>
          <button type="button" data-filter="犍陀羅">犍陀羅</button>
          <button type="button" data-filter="心經">心經</button>
          <button type="button" data-filter="禪宗">禪宗</button>
          <button type="button" data-filter="比丘尼">比丘尼</button>
          <button type="button" data-filter="臺灣">臺灣</button>
          <button type="button" id="clear-search">顯示全部</button>
        </div>
        <p id="source-count" class="small" role="status" aria-live="polite">顯示 ${EVIDENCE_ITEMS.length}／${EVIDENCE_ITEMS.length} 組來源。</p>
        ${libraryArticles}
        <nav class="station-nav" aria-label="來源庫導覽"><div class="button-row"><a class="button secondary" href="#menu">↑ 四幕目錄</a><a class="button secondary" href="#lab">← 回到第 22 站</a><a class="button" href="./history-research.html">前往完整學術研究詳頁 →</a></div></nav>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <p><strong>看見更多｜The Naked Dhamma</strong> · 第三篇《這真的是佛陀說的嗎？》v2.0</p>
      <p class="small">本作品為純靜態公開歷史與文獻科普；不使用任何外部追蹤、分析或個人資料收集。宗教信念真偽與醫學療效超越歷史研究範圍。</p>
      <p><a href="./index.html">系列首頁</a><a href="./merit.html">第二篇：功德真相</a><a href="./history-research.html">研究與完整書目頁</a><a href="#top">回到本頁頂部</a></p>
    </div>
  </footer>
</body>
</html>
`;
}

function buildResearchHtml(rightsRows) {
  const accessBadge = acc => {
    const map = {
      PRIMARY_CHECKED: ["ok", "PRIMARY_CHECKED · 原典逐段查核"],
      FULLTEXT_CHECKED: ["ok", "FULLTEXT_CHECKED · 公開全文已讀"],
      ABSTRACT_ONLY: ["warn", "ABSTRACT_ONLY · 摘要／目錄驗證"],
      CATALOG_ONLY: ["warn", "CATALOG_ONLY · 館藏目錄索引"]
    };
    const [cls, txt] = map[acc] || ["", acc];
    return `<span class="badge ${cls}">${esc(txt)}</span>`;
  };

  const sectionHtml = RESEARCH_SECTIONS.map(sec => {
    const secClaims = CLAIMS.filter(c => c.researchAnchor === "#" + sec.id);
    const secEv = EVIDENCE_ITEMS.filter(e => sec.evidenceIds.includes(e.id));
    const claimCards = secClaims.map(c => `
      <article class="card-box" id="${esc(c.id.toLowerCase())}" style="margin:14px 0">
        <p><span class="tag">${esc(c.id)}</span> <span class="badge">站 ${String(c.station).padStart(2, "0")}</span> <span class="badge">${esc(c.type)}</span> <span class="badge ok">評估：${esc(c.assessment)}</span></p>
        <h3>${esc(c.plain)}</h3>
        <p class="small"><strong>可檢驗命題：</strong>${esc(c.proposition)}</p>
        <div class="table-wrap"><table role="table"><caption>命題 ${esc(c.id)} 學術評估細目</caption><thead><tr><th>審查維度</th><th>核查結論與依據</th></tr></thead><tbody>
          <tr><th data-label="審查維度">評估理由</th><td data-label="核查結論與依據">${esc(c.reason)}</td></tr>
          <tr><th data-label="審查維度">直接支持材料</th><td data-label="核查結論與依據">${esc(c.directSupport)}</td></tr>
          <tr><th data-label="審查維度">反證／張力與異文</th><td data-label="核查結論與依據">${esc(c.counterEvidence)}</td></tr>
          <tr><th data-label="審查維度">替代假說</th><td data-label="核查結論與依據">${esc(c.alternatives)}</td></tr>
          <tr><th data-label="審查維度">獨立性判斷</th><td data-label="核查結論與依據">${esc(c.dependency)}</td></tr>
          <tr><th data-label="審查維度">成立範圍與限制</th><td data-label="核查結論與依據">${esc(c.scope)} · ${esc(c.limitations)}</td></tr>
          <tr><th data-label="審查維度">未解問題</th><td data-label="核查結論與依據">${esc(c.openQuestions)}</td></tr>
        </tbody></table></div>
        <div class="src-inline">
          <a class="claim-tag" href="./history.html${esc(c.publicAnchor)}">← 返回大眾探索館（第 ${String(c.station).padStart(2, "0")} 站）</a>
          ${c.evidenceIds.map(eid => `<a class="claim-tag" href="#${esc(eid.toLowerCase())}">證據 ${esc(eid)}</a>`).join("")}
        </div>
      </article>
    `).join("\n");

    return `<section class="research-sec wide" id="${esc(sec.id)}" tabindex="-1"><div class="container">
      <div class="kicker">第 ${String(sec.station).padStart(2, "0")} 站研究專區 · 錨點 #${esc(sec.id)}</div>
      <h2>${esc(sec.title)}</h2>
      <p><a class="button secondary" href="./history.html${esc(sec.publicAnchor)}">← 回到大眾互動頁面（${esc(sec.publicAnchor)}）</a></p>
      ${claimCards || `<p class="note">本專區為跨命題綜述背景；主要資料來源如下：${secEv.map(e => `${e.id} ${esc(e.title)}`).join("；")}。</p>`}
      ${secEv.length ? `<p class="small"><strong>對應關鍵證據群：</strong>${secEv.map(e => `<a href="#${esc(e.id.toLowerCase())}">${esc(e.id)}（${esc(e.title.slice(0, 24))}…）</a>`).join(" · ")}</p>` : ""}
    </div></section>`;
  }).join("\n");

  const rightsTableRows = rightsRows.map(r => `
    <tr>
      <th data-label="編號／主題">${esc(r.asset_id)} (${esc(r.topic_id)}) · ${esc(r.subject)}</th>
      <td data-label="狀態／授權">${esc(r.status)} · ${esc(r.allowed_use)}</td>
      <td data-label="館藏與對象年代">${esc(r.collection)} (${esc(r.accession_or_locator)}) · ${esc(r.object_date_and_basis)}</td>
      <td data-label="支持與限制">${esc(r.supports)}（限制：${esc(r.limitations)}）· <a href="${esc(r.original_item_URL)}" target="_blank" rel="noopener noreferrer">官方／館藏條目</a></td>
    </tr>
  `).join("\n");

  const bibCards = EVIDENCE_ITEMS.map(item => `
    <article class="evidence" id="${esc(item.id.toLowerCase())}" data-evidence-card data-type="${esc(item.type)}" data-access="${esc(item.access)}" tabindex="-1">
      <p><span class="tag">${esc(item.id)}</span> <span class="tag">${esc(item.type)}</span> ${accessBadge(item.access)}</p>
      <h3>${esc(item.title)}</h3>
      <p data-bib-line>${esc(item.id)}. ${esc(item.author)} (${esc(item.year)}). ${esc(item.title)}. ${esc(item.locator)}. [檢索日期: ${esc(item.retrieved)}; 驗證狀態: ${esc(item.access)}]. ${esc(item.url)}</p>
      <blockquote cite="${esc(item.url)}">${esc(item.excerpt)}<cite>來源摘要／合法短引（${esc(item.lang)}）· 權利：${esc(item.rights)}</cite></blockquote>
      <p><strong>本研究運用：</strong>${esc(item.summary)}</p>
      <p class="small"><strong>可以直接支持：</strong>${esc(item.supports)}<br><strong>不可據以推論：</strong>${esc(item.doesNotSupport)}</p>
      <div class="links">
        <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">主要線上來源</a>
        ${item.altUrl ? `<a href="${esc(item.altUrl)}" target="_blank" rel="noopener noreferrer">平行／館藏連結</a>` : ""}
        <a href="./history.html#${esc(item.legacyAnchor)}">見大眾頁來源卡</a>
      </div>
    </article>
  `).join("\n");

  return `<!DOCTYPE html>
<html lang="zh-Hant" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#f8f5ee">
  <title>這真的是佛陀說的嗎？｜學術研究、多語原典與書目詳頁｜看見更多</title>
  <meta name="description" content="第三篇《這真的是佛陀說的嗎？》獨立可重現學術查證詳頁：三軸證據評級、${CLAIMS.length}項命題評估、跨語言異文、圖片授權審計與${EVIDENCE_ITEMS.length}筆書目。">
  <link rel="canonical" href="https://t14210184.github.io/The-Naked-Dhamma/history-research.html">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="zh_TW">
  <meta property="og:site_name" content="看見更多｜The Naked Dhamma">
  <meta property="og:title" content="這真的是佛陀說的嗎？｜學術研究證據與完整書目詳頁">
  <meta property="og:description" content="命題級正反證據、巴利／漢譯／梵本多語對讀、考古碑銘與寫本權利核實，每條皆可互連返回大眾探索館 22 站。">
  <meta property="og:url" content="https://t14210184.github.io/The-Naked-Dhamma/history-research.html">
  <meta property="og:image" content="https://t14210184.github.io/The-Naked-Dhamma/social-history-research.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="assets/history/history.css">
  <script defer src="assets/history/research.js"></script>
</head>
<body>
  <a class="skip" href="#main">跳到主要內容</a>
  <header class="header">
    <div class="container">
      <div class="bar">
        <a class="logo" href="./index.html">看見更多</a>
        <a class="top-link" href="./history.html">探索館</a>
        <a class="top-link" href="#bib">書目</a>
        <details class="settings" id="settings">
          <summary aria-label="設定字級與配色">設定</summary>
          <div class="settings-panel" role="group" aria-label="閱讀顯示設定">
            <div class="controls">
              <button type="button" id="fontDown" aria-label="縮小文字">字－</button>
              <button type="button" id="fontUp" aria-label="放大文字">字＋</button>
              <button type="button" id="theme" aria-pressed="false">切換柔光深色</button>
            </div>
            <p id="font-status" class="small" role="status" aria-live="polite">字級 20px</p>
            <p class="small"><a href="./index.html">首頁</a> · <a href="./merit.html">第二篇</a> · <a href="./history.html">大眾探索館</a></p>
          </div>
        </details>
      </div>
    </div>
  </header>

  <main id="main">
    <section class="hero" tabindex="-1"><div class="container">
      <span class="kicker">第三篇專業伴隨頁 · 可獨立重現查證之學術證據庫</span>
      <h1>研究方法、<em>命題證據</em>與完整書目</h1>
      <p class="lead">本頁為《這真的是佛陀說的嗎？》22 站大眾互動探索館的學術依據庫，收錄 ${CLAIMS.length} 項命題級審查表、跨部派多語平行對讀、${rightsRows.length} 筆實物影像授權審計，以及 ${EVIDENCE_ITEMS.length} 組結構化核心參考資料。</p>
      <div class="button-row">
        <a class="button" href="./history.html">回到大眾探索館</a>
        <a class="button secondary" href="#method">方法與資料檢索紀錄</a>
        <a class="button secondary" href="#image-rights">實物圖片授權表</a>
        <a class="button secondary" href="#bib">全部書目（${EVIDENCE_ITEMS.length} 組）</a>
      </div>
    </div></section>

    <section class="research-sec wide" id="overview-standards" tabindex="-1"><div class="container">
      <h2>本頁遵守的三軸證據分級與四大公平準則</h2>
      <div class="grid">
        <article class="card-box">
          <h3>三軸證據評級標準</h3>
          <ul class="small">
            <li><strong>軸一｜材料性質：</strong>P1 跨傳承早期經律共見（同源分化非完全獨立）／ P2 單一部派早期經律 ／ P3 各派律藏與阿毘達磨 ／ P4 大乘與後期宗派文獻 ／ P5 註釋編年語錄 ／ A 實物考古碑銘檔案 ／ R 同行評審歷史研究 ／ E 現代教育心理實證。</li>
            <li><strong>軸二｜支持程度：</strong>極強 · 強 · 中 · 弱 · 無法證明 · 目前未知（不提供虛構百分比）。</li>
            <li><strong>軸三｜實際查證深度：</strong><code>PRIMARY_CHECKED</code>（原典逐段核對）、<code>FULLTEXT_CHECKED</code>（公開論文全文已讀）、<code>ABSTRACT_ONLY</code>（付費／館藏僅讀摘要與編目）、<code>CATALOG_ONLY</code>。</li>
          </ul>
        </article>
        <article class="card-box">
          <h3>四大跨宗派對等準則</h3>
          <ul class="small">
            <li><strong>古老 ≠ 逐字佛說：</strong>巴利或阿含較古只代表跨部派共有核心，不等於錄音筆原話。</li>
            <li><strong>晚出 ≠ 蓄意造假：</strong>大乘、疑偽經或漢藏日演變多數出於哲學系統化或文化調適，不可輕率貼上詐欺標籤。</li>
            <li><strong>跨傳承相同 ≠ 完全獨立：</strong>各部派經典同源分化，屬於相關證詞而非互不認識的多位目擊者。</li>
            <li><strong>史學 ≠ 宗教真偽與醫療療效：</strong>歷史文獻不能證明或證偽超越經驗的宗教信念，也不能替代醫療建議。</li>
          </ul>
        </article>
      </div>
      <div class="note">
        <h3>與既有版本（v1.1 &amp; PDF 稽核）比對後的重要勘誤紀錄</h3>
        <ul>
          <li><strong>緬甸曼德勒固都陶碑林數量：</strong>校正部分轉述作 730 塊之混稱，準確區分為 <strong>729 塊三藏經文石碑</strong>（1860–1868 刻成、1871 第五次結集認可）另加第 730 塊建碑史誌碑。</li>
          <li><strong>2025 年不丹第二次比丘尼大戒人數：</strong>Bhutan Nuns Foundation 官方公布為來自 14 國之 <strong>265 位</strong>女眾（部分國際媒體報導作近 270 位），本頁並列口徑差異並標示各藏傳宗派承認度仍具分歧。</li>
          <li><strong>《楞嚴經》經號防混：</strong>唐代《大佛頂首楞嚴經》為 <strong>T945</strong>，須嚴格區分鳩摩羅什譯《首楞嚴三昧經》<strong>T642</strong>。</li>
          <li><strong>《心經》研究補充：</strong>除 Jan Nattier (1992) 與 Jayarava Attwood (2021, JIABS 44，本站尚未取得全文核對全數 22 對比點) 的漢編回譯假說外，並列保留部分日本與當代學者「般若要義摘錄結合陀羅尼修持本」之替代解釋。</li>
          <li><strong>無法繞過之館藏網站誠實揭露：</strong>美國國會圖書館犍陀羅卷 JSON 端點對自動化客戶端回傳 HTTP 403，大英圖書館 IDP Dunhuang S.5475 具反爬蟲挑戰；本站絕不繞過存取限制，均改以官方連結呈交讀者開啟，並以 CC0 BL Or. 14915 與 BnF 1310 刻本標示對照。</li>
        </ul>
      </div>
    </div></section>

    ${sectionHtml}

    <section class="research-sec wide" id="image-rights" tabindex="-1"><div class="container">
      <div class="kicker">實物與檔案影像透明稽核 · ${rightsRows.length} 筆紀錄</div>
      <h2>歷史實物影像來源、權利授權與證明界線</h2>
      <p class="small">本站絕不使用 AI 圖像充當歷史文物。凡受館藏系統或隱私考量不嵌入之圖像均標為 <code>RIGHTS_LINK_ONLY</code> 並附官方館藏網址；完整機讀表置於專案 <code>docs/HISTORY_IMAGES_RIGHTS.tsv</code>。</p>
      <div class="table-wrap"><table role="table"><caption>歷史證據圖像與權利稽核表</caption><thead><tr><th>編號與主題</th><th>授權與狀態</th><th>館藏／年代基礎</th><th>證明範圍與限制</th></tr></thead><tbody>
        ${rightsTableRows}
      </tbody></table></div>
    </div></section>

    <section class="research-sec wide" id="bib" tabindex="-1"><div class="container">
      <div class="kicker">完整可查核證據與書目總表 · 共 ${EVIDENCE_ITEMS.length} 筆</div>
      <h2>篩選原典與學術文獻</h2>
      <div class="grid">
        <div>
          <label class="js-only" for="res-search"><b>搜尋書目或原典號：</b>
            <input type="search" id="res-search" class="search" placeholder="例如：DN 16、SF 245、Allon、Kieschnick、2025">
          </label>
        </div>
        <div class="controls js-only">
          <label for="res-type"><b>材料類型：</b>
            <select id="res-type">
              <option value="">全部類型</option>
              <option value="P1">P1 跨傳承早期經律</option>
              <option value="P2">P2 單部派早期經律</option>
              <option value="A">A 考古與館藏實物</option>
              <option value="R">R 同行評審歷史研究</option>
              <option value="E">E 教育與心理研究</option>
            </select>
          </label>
          <label for="res-access"><b>查證深度：</b>
            <select id="res-access">
              <option value="">全部等級</option>
              <option value="PRIMARY_CHECKED">PRIMARY_CHECKED</option>
              <option value="FULLTEXT_CHECKED">FULLTEXT_CHECKED</option>
              <option value="ABSTRACT_ONLY">ABSTRACT_ONLY</option>
            </select>
          </label>
          <button type="button" id="res-clear">重設篩選</button>
          <button type="button" id="copy-bib">複製完整書目</button>
        </div>
      </div>
      <p id="res-filter-status" class="small" role="status" aria-live="polite">顯示 ${EVIDENCE_ITEMS.length}／${EVIDENCE_ITEMS.length} 筆證據與書目。</p>
      <p id="bib-copy-status" class="small" role="status" aria-live="polite"></p>
      <textarea id="bib-output" rows="8" hidden readonly aria-label="完整書目純文字複製區"></textarea>
      ${bibCards}
      <nav class="station-nav" aria-label="研究頁底部導覽"><div class="button-row"><a class="button" href="./history.html">回到大眾探索館</a><a class="button secondary" href="./history.html#lab">前往第 22 站查證工作台</a><a class="button secondary" href="./index.html">系列首頁</a></div></nav>
    </div></section>
  </main>

  <footer class="footer">
    <div class="container">
      <p><strong>看見更多｜The Naked Dhamma</strong> · 第三篇研究與書目伴隨頁</p>
      <p class="small">核查檢索基準日：2026-11-27。凡標示 <code>ABSTRACT_ONLY</code> 者皆未主張讀過付費全書，保留待閱限制。</p>
      <p><a href="./index.html">系列首頁</a><a href="./merit.html">第二篇：功德真相</a><a href="./history.html">大眾探索館</a></p>
    </div>
  </footer>
</body>
</html>
`;
}

function parseTsv(path) {
  const lines = readFileSync(path, "utf8").trim().split(/\r?\n/);
  const headers = lines[0].split("\t");
  return lines.slice(1).map(line => {
    const cols = line.split("\t");
    const obj = {};
    headers.forEach((h, i) => { obj[h] = cols[i] ?? ""; });
    return obj;
  });
}

function auditHtml(label, html) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) throw new Error(`${label} duplicate IDs: ${dup.join(", ")}`);
  const idSet = new Set(ids);
  const broken = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]).filter(x => !idSet.has(x));
  if (broken.length) throw new Error(`${label} broken internal anchors: ${[...new Set(broken)].join(", ")}`);
  const leaks = html.match(/(turn\d+search|<Cite\b|<AsyncImage|TODO:)/g);
  if (leaks) throw new Error(`${label} leaked source markers: ${leaks.slice(0, 5).join(", ")}`);
  return idSet;
}

const rightsRows = parseTsv("docs/HISTORY_IMAGES_RIGHTS.tsv");
const historyHtml = buildHistoryHtml();
const researchHtml = buildResearchHtml(rightsRows);

const hIds = auditHtml("history.html", historyHtml);
const rIds = auditHtml("history-research.html", researchHtml);

// Verify all 30 legacy #s-* IDs and all 22 stations
const expectedLegacy = [
  "s-four","s-fourmore","s-drum","s-teacher","s-kalama","s-rahula","s-direction","s-truth",
  "s-core","s-meat","s-ashoka","s-scroll","s-allon","s-baums","s-buddha","s-council",
  "s-fogelin","s-sen","s-gethin","s-heart","s-attribution","s-filial","s-veg","s-chan",
  "s-tibet","s-japan","s-nuns","s-modern","s-tw","s-lib"
];
const missingLegacy = expectedLegacy.filter(id => !hIds.has(id));
if (missingLegacy.length) throw new Error("Missing legacy #s-* anchors: " + missingLegacy.join(", "));
const stationCount = (historyHtml.match(/data-station="/g) || []).length;
if (stationCount !== 22) throw new Error("Expected 22 stations, got " + stationCount);

// Verify cross-page anchors
const toResearch = [...historyHtml.matchAll(/href="\.\/history-research\.html#([^"]+)"/g)].map(m => m[1]).filter(x => !rIds.has(x));
if (toResearch.length) throw new Error("Broken links to history-research.html: " + [...new Set(toResearch)].join(", "));
const toPublic = [...researchHtml.matchAll(/href="\.\/history\.html#([^"]+)"/g)].map(m => m[1]).filter(x => !hIds.has(x));
if (toPublic.length) throw new Error("Broken links to history.html: " + [...new Set(toPublic)].join(", "));

// Verify all local evidence images exist, are referenced in history.html/TSV, and have width/height
const evFiles = readdirSync("assets/history/evidence").filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
for (const f of evFiles) {
  const rel = "assets/history/evidence/" + f;
  if (!rightsRows.some(r => r.local_file === rel)) throw new Error("Unregistered evidence file: " + rel);
}
for (const imgTag of historyHtml.matchAll(/<img\b[^>]*>/g)) {
  if (!/\bwidth="/.test(imgTag[0]) || !/\bheight="/.test(imgTag[0]) || !/\balt="/.test(imgTag[0])) {
    throw new Error("<img> missing width/height/alt: " + imgTag[0]);
  }
}

// Verify coverage matrix completeness against generated HTML IDs
const covRows = parseTsv("docs/HISTORY_COVERAGE.tsv");
if (covRows.length < 244) throw new Error("Expected >= 244 coverage rows, got " + covRows.length);
const claimSet = new Set(CLAIMS.map(c => c.id));
const evIdSet = new Set(EVIDENCE_ITEMS.map(e => e.id));
for (const row of covRows) {
  const pub = row.public_anchor.replace(/^#/, "");
  const res = row.research_anchor.replace(/^#/, "");
  if (!hIds.has(pub)) throw new Error(`Coverage ${row.source_id} invalid public_anchor #${pub}`);
  if (!rIds.has(res)) throw new Error(`Coverage ${row.source_id} invalid research_anchor #${res}`);
  for (const cid of row.claim_ids.split(",")) {
    if (!claimSet.has(cid.trim())) throw new Error(`Coverage ${row.source_id} unknown claim ${cid}`);
  }
  for (const eid of row.evidence_ids.split(",")) {
    if (!evIdSet.has(eid.trim())) throw new Error(`Coverage ${row.source_id} unknown evidence ${eid}`);
  }
}

writeFileSync("history.html", historyHtml, "utf8");
writeFileSync("history-research.html", researchHtml, "utf8");

const gz = buf => gzipSync(buf).length;
const cssBuf = readFileSync("assets/history/history.css");
const jsBuf = readFileSync("assets/history/history.js");
const rjsBuf = readFileSync("assets/history/research.js");
const hBuf = Buffer.from(historyHtml, "utf8");
const rBuf = Buffer.from(researchHtml, "utf8");
const landingGz = gz(hBuf) + gz(cssBuf) + gz(jsBuf);

console.log(JSON.stringify({
  built: true,
  stations: stationCount,
  librarySources: EVIDENCE_ITEMS.length,
  legacyAnchorsVerified: expectedLegacy.length,
  researchSections: RESEARCH_SECTIONS.length,
  claims: CLAIMS.length,
  coverageRowsVerified: covRows.length,
  rightsRows: rightsRows.length,
  sizes: {
    historyHtmlBytes: hBuf.length,
    historyHtmlGzip: gz(hBuf),
    historyCssGzip: gz(cssBuf),
    historyJsGzip: gz(jsBuf),
    landingColdCompressedBytes: landingGz,
    researchHtmlBytes: rBuf.length,
    researchHtmlGzip: gz(rBuf),
    researchJsGzip: gz(rjsBuf)
  }
}, null, 2));
if (landingGz > 500 * 1024) throw new Error("Landing compressed payload exceeds 500 KiB: " + landingGz);
