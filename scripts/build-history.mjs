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
          <div class="note"><p><strong>您目前停用了 JavaScript：</strong>本頁面已自動展開全部 22 站全文、圖表與 ${EVIDENCE_ITEMS.length} 組來源庫，並隨附「不按也能讀」替代文字說明，您仍可順暢讀完全文與點擊站內導覽。</p></div>
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
      <p><a href="./index.html">系列首頁</a><a href="./merit.html">第二篇：功德真相</a><a href="./history-research.html">研究與完整書目頁</a><a href="https://github.com/t14210184/The-Naked-Dhamma" target="_blank" rel="noopener noreferrer">GitHub 原始碼</a><a href="https://github.com/t14210184/The-Naked-Dhamma/issues" target="_blank" rel="noopener noreferrer">勘誤與建議（Issues）</a><a href="#top">回到本頁頂部</a></p>
    </div>
  </footer>
</body>
</html>
`;
}

const SECTION_GALLERIES = {
  "ashoka-inscriptions": [
    { src: "assets/history/evidence/img01-rummindei-inscription.jpg", w: 1280, h: 848, crop: "--ox:62%;--oy:42%;--zoom:1.85", title: "藍毘尼（倫明代）石柱銘文第2行局部分鏡", cap: "館藏 ASI 1896 · 婆羅米文第2行「Budha Sakyamunī」實物局部放大（Public Domain）。" },
    { src: "assets/history/evidence/img01-bhabra-edict.jpg", w: 1280, h: 711, crop: "--ox:48%;--oy:58%;--zoom:1.75", title: "拜拉特（Calcutta-Bairāt）碑銘第6行分鏡", cap: "CII Vol. I (1925) · 第6行提「Lāghulovāde」（羅睺羅妄語教誡）與七法門（Public Domain）。" },
    { src: "assets/history/evidence/img01-nigali-sagar.jpg", w: 960, h: 720, crop: "", title: "尼迦利薩格爾阿育王石柱", cap: "Nepal · 擴建拘那含佛塔記載（CC BY 2.0），見證前3世紀已有過去佛崇拜。" },
    { src: "assets/history/evidence/img01-sarnath-edict.jpg", w: 960, h: 715, crop: "", title: "鹿野苑僧團分裂詔令拓片", cap: "CII Vol. I (1925) · 顯示王權介入僧團秩序，不可直接當成第三次結集全細節實錄（Public Domain）。" }
  ],
  "gandhara-manuscripts": [
    { src: "assets/history/evidence/img02-gandhara-bl-or14915.jpg", w: 1280, h: 853, crop: "--ox:50%;--oy:45%;--zoom:1.8", title: "BL Or. 14915 part 31 樺樹皮佉盧文局部分鏡", cap: "大英圖書館 CC0 · 現存約1世紀前半葉實物寫本；另見 LOC 2018305008（Public Domain Mark 1.0，官網對自動請求回傳 HTTP 403 ACCESS_BLOCKED，須以官方連結開啟）。" }
  ],
  "theravada-history": [
    { src: "assets/history/evidence/img03-abhayagiri.jpg", w: 960, h: 530, crop: "", title: "無畏山寺大塔（Abhayagiri Vihāra）", cap: "Anuradhapura · 攝於2016（Nicolas Chadeville, CC BY 4.0，含近代修復）。" },
    { src: "assets/history/evidence/img04-jetavanaramaya.jpg", w: 960, h: 642, crop: "", title: "祇陀林寺大塔（Jetavanārāmaya）", cap: "Anuradhapura · 攝於2018（Nipuna Gamage, CC BY-SA 4.0）。" },
    { src: "assets/history/evidence/extra-kuthodaw-slab.jpg", w: 960, h: 1280, crop: "--ox:50%;--oy:38%;--zoom:1.65", title: "曼德勒固都陶碑林第729經碑局部刻文", cap: "UNESCO 世界記憶（CC BY-SA 3.0）· 1860–1868 刻成 729 塊三藏經文碑（另有第730塊建碑史誌碑）。" }
  ],
  "chan-lineages": [
    { src: "assets/history/evidence/img05-platform-sutra-1310.jpg", w: 960, h: 838, crop: "--ox:55%;--oy:45%;--zoom:1.7", title: "BnF Coréen 110 · 1310年高麗刊本局部分鏡", cap: "1310年刊本《壇經》文字細節（Public Domain，絕非敦煌 S.5475 替代件；IDP S.5475 受反爬蟲保護 ACCESS_BLOCKED）。" },
    { src: "assets/history/evidence/img06-bodhidharma-met.jpg", w: 960, h: 1281, crop: "", title: "MET 2015.300.71 · 達摩掛軸", cap: "雲谷等顏（16–17世紀），大都會藝術博物館 CC0 · 明示為後世藝術想像而非寫實肖像。" }
  ],
  "tibetan-lineages": [
    { src: "assets/history/evidence/extra-samye.jpg", w: 960, h: 640, crop: "", title: "西藏桑耶寺當代實景（2011）", cap: "Lark Ascending (Public Domain) · 對應約779年赤松德贊建寺脈絡，現存建築歷經多代重修。" }
  ],
  "india-decline": [
    { src: "assets/history/evidence/img07-nalanda.jpg", w: 960, h: 654, crop: "", title: "那爛陀大寺第五僧院遺址", cap: "UNESCO World Heritage · Sumitsurai (2023, CC BY-SA 4.0)。" },
    { src: "assets/history/evidence/img08-vikramashila.jpg", w: 960, h: 640, crop: "", title: "超戒寺遺址與倒伏石柱", cap: "ASI N-BR-2 · Spotplayerx (2021, CC BY-SA 4.0)。" }
  ],
  "taiwan-history": [
    { src: "assets/history/evidence/img09-longshan-1900s.jpg", w: 960, h: 730, crop: "", title: "艋舺龍山寺歷史照片（c.1895–1922）", cap: "清末至日初（Public Domain）· 見證觀音信仰與民間信仰共構。" },
    { src: "assets/history/evidence/img10-honganji-1932.jpg", w: 960, h: 657, crop: "", title: "臺北西本願寺臺灣別院（c.1932）", cap: "大橋捨三郎書刊圖版（Public Domain）· 日治時期內地宗派制度擴張。" },
    { src: "assets/history/evidence/img11-foguangshan.jpg", w: 960, h: 640, crop: "", title: "高雄佛光山當代實景", cap: "lumoplank (CC0) · 1967年創寺之當代人間佛教實景，非戰後初期原照。" },
    { src: "assets/history/evidence/img12-tzuchi-hospital.jpg", w: 960, h: 720, crop: "", title: "臺北慈濟醫院建築外觀（2011）", cap: "玄史生 (CC0) · 採建築外觀以免個人肖像隱私疑慮。" }
  ]
};

function renderSectionGallery(secId) {
  const items = SECTION_GALLERIES[secId];
  if (!items || !items.length) return "";
  return `<div class="research-gallery">${items.map(g => `
    <figure class="card-box" style="margin:0">
      <div class="${g.crop ? "crop-frame" : "artifact-stage"}"${g.crop ? ` style="${esc(g.crop)};min-height:auto"` : ` style="min-height:140px;margin:8px 0"`}>
        <img src="${esc(g.src)}" width="${g.w}" height="${g.h}" loading="lazy" alt="${esc(g.title + " — " + g.cap)}"${g.crop ? "" : ' style="width:100%;height:auto;border-radius:8px"'}>
      </div>
      <figcaption class="small"><strong>${esc(g.title)}：</strong>${esc(g.cap)}</figcaption>
    </figure>`).join("")}</div>`;
}

function buildResearchHtml(rightsRows, legacyRows, covRows) {
  const evById = new Map(EVIDENCE_ITEMS.map(e => [e.id, e]));
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
    const claimCards = secClaims.map(c => {
      const evList = (c.evidenceIds || []).map(eid => evById.get(eid)).filter(Boolean);
      const locators = evList.map(e => `${e.id}: ${e.locator}`).join("；") || "見下方專區書目";
      const excerptsHtml = evList.length
        ? `<ul class="small" style="margin:0;padding-left:1.2em">${evList.map(e => `<li><strong>${esc(e.id)}（${esc(e.lang)}）：</strong>「${esc(e.excerpt)}」</li>`).join("")}</ul>`
        : "無直接引文";
      const bibHtml = evList.length
        ? `<ul class="small" style="margin:0;padding-left:1.2em">${evList.map(e => `<li><a href="#${esc(e.id.toLowerCase())}">${esc(e.id)}</a>. ${esc(e.author)} (${esc(e.year)}). ${esc(e.title)}. ${esc(e.locator)}. [<code>${esc(e.access)}</code>] <a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">${esc(e.url)}</a></li>`).join("")}</ul>`
        : "請參閱下方書目總表";
      return `
      <article class="card-box" id="${esc(c.id.toLowerCase())}" style="margin:14px 0">
        <p><span class="tag">${esc(c.id)}</span> <span class="badge">站 ${String(c.station).padStart(2, "0")}</span> <span class="badge">${esc(c.type)}</span> <span class="badge ok">評估：${esc(c.assessment)}</span></p>
        <h3>${esc(c.plain)}</h3>
        <div class="table-wrap"><table role="table"><caption>命題 ${esc(c.id)} 十項學術可重現審查細目</caption><thead><tr><th>審查維度</th><th>核查結論與依據</th></tr></thead><tbody>
          <tr><th data-label="1. 研究問題">1. 研究問題（可檢驗命題）</th><td data-label="核查結論與依據">${esc(c.proposition)}</td></tr>
          <tr><th data-label="2. 個別材料定位">2. 個別材料定位</th><td data-label="核查結論與依據">${esc(locators)}</td></tr>
          <tr><th data-label="3. 原文／譯文與短引">3. 原文／合法引文與譯注</th><td data-label="核查結論與依據">${excerptsHtml}</td></tr>
          <tr><th data-label="4. 版本差異">4. 版本差異與平行對讀</th><td data-label="核查結論與依據">${esc(c.counterEvidence)}</td></tr>
          <tr><th data-label="5. 個別書目">5. 個別書目與官方入口</th><td data-label="核查結論與依據">${bibHtml}</td></tr>
          <tr><th data-label="6. 推導">6. 推導方式</th><td data-label="核查結論與依據">${esc(c.reason)}</td></tr>
          <tr><th data-label="7. 支持與反證">7. 支持證據／反證張力</th><td data-label="核查結論與依據"><strong>支持：</strong>${esc(c.directSupport)}<br><strong>反證與張力：</strong>${esc(c.counterEvidence)}</td></tr>
          <tr><th data-label="8. 依賴性">8. 獨立性與依賴關係</th><td data-label="核查結論與依據">${esc(c.dependency)}</td></tr>
          <tr><th data-label="9. 替代假說">9. 替代假說</th><td data-label="核查結論與依據">${esc(c.alternatives)}</td></tr>
          <tr><th data-label="10. 判斷與不確定性">10. 評估判斷與不確定性</th><td data-label="核查結論與依據"><strong>結論：</strong>${esc(c.assessment)}；<strong>成立範圍：</strong>${esc(c.scope)}；<strong>研究限制：</strong>${esc(c.limitations)}；<strong>未解問題：</strong>${esc(c.openQuestions)}</td></tr>
        </tbody></table></div>
        <div class="src-inline">
          <a class="claim-tag" href="./history.html${esc(c.publicAnchor)}">← 返回大眾探索館（第 ${String(c.station).padStart(2, "0")} 站）</a>
          ${c.evidenceIds.map(eid => `<a class="claim-tag" href="#${esc(eid.toLowerCase())}">證據 ${esc(eid)}</a>`).join("")}
        </div>
      </article>`;
    }).join("\n");

    return `<section class="research-sec wide" id="${esc(sec.id)}" tabindex="-1"><div class="container">
      <div class="kicker">第 ${String(sec.station).padStart(2, "0")} 站研究專區 · 錨點 #${esc(sec.id)}</div>
      <h2>${esc(sec.title)}</h2>
      <p><a class="button secondary" href="./history.html${esc(sec.publicAnchor)}">← 回到大眾互動頁面（${esc(sec.publicAnchor)}）</a></p>
      ${renderSectionGallery(sec.id)}
      ${claimCards || `<p class="note">本專區為方法與綜述背景；主要資料來源如下：${secEv.map(e => `${e.id} ${esc(e.title)}`).join("；")}。</p>`}
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
        <a class="button secondary" href="#method">方法與 277 項盤點</a>
        <a class="button secondary" href="#image-rights">實物圖片授權表</a>
        <a class="button secondary" href="#legacy-urls">v1.1 95 連結追查</a>
        <a class="button secondary" href="#bib">全部書目（${EVIDENCE_ITEMS.length} 組）</a>
      </div>
    </div></section>

    <section class="research-sec wide" id="overview-standards" tabindex="-1"><div class="container">
      <h2>本頁遵守的三軸證據分級、狀態盤點與四大公平準則</h2>
      <div class="grid">
        <article class="card-box">
          <h3>三軸證據評級標準</h3>
          <ul class="small">
            <li><strong>軸一｜材料性質：</strong>P1 跨傳承早期經律共見（同源分化非完全獨立）／ P2 單一部派早期經律 ／ P3 各派律藏與阿毘達磨 ／ P4 大乘與後期宗派文獻 ／ P5 註釋編年語錄 ／ A 實物考古碑銘檔案 ／ R 同行評審歷史研究 ／ E 現代教育心理實證。</li>
            <li><strong>軸二｜支持程度：</strong>極強 · 強 · 中 · 弱 · 無法證明 · 目前未知（不提供虛構百分比）。</li>
            <li><strong>軸三｜實際查證深度：</strong><code>PRIMARY_CHECKED</code>（原典逐段核對）、<code>FULLTEXT_CHECKED</code>（公開論文全文已讀）、<code>ABSTRACT_ONLY</code>（付費／館藏僅讀摘要與編目）、<code>CATALOG_ONLY</code>。全館 277 列來源覆蓋清冊誠實區分 <code>SEMANTIC_VERIFIED</code>、<code>ACCESS_LIMITED</code>、<code>RIGHTS_EXCEPTION</code>、<code>INSUFFICIENT_DATA</code> 與 <code>PRIMARY_PENDING</code>。</li>
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
        <h3>第二輪獨立稽核與勘誤紀錄</h3>
        <ul>
          <li><strong>《增壹阿含經》EA 28.5（T02, 652b13–653a18）實文勘誤：</strong>EA 28.5〈聲聞品〉所載並非巴利四種權威轉述人，而是依契經、律、阿毘曇、戒四項檢驗從「東南西北」四方來僧對經本、義、味與戒行之理解；與 DN 16／AN 4.180／DA 2 平行對讀時嚴格保留其敘事與判準差異。</li>
          <li><strong>《心經》T0223 vs T0250／T0251 字句更正與日本學界替代假說：</strong>實際對照 CBETA《大品般若經》（T0223 卷1, 223a13–21）確見「非色異空、非空異色…無苦集滅道，亦無智亦無得」；「度一切苦厄」見於 T0250／T0251 而<strong>不在</strong> T0223〈習應品〉對應段（修正第一輪誤植）。除 Jan Nattier (1992) 與 Attwood (2021, 付費全文 22 點未逐一查證) 外，並列福井文雅（1987, 1994, 2000）對漢撰回譯說的反論與陀羅尼修持脈絡解釋。</li>
          <li><strong>原覆蓋清冊 CH03 年代倒置更正：</strong>已將「早於佛陀數百年」勘正為「晚於佛陀數十年至數百年」，並逐列擴充 <code>docs/HISTORY_COVERAGE.tsv</code> 至 ${covRows.length} 列，誠實保留受限與資料不足項目。</li>
          <li><strong>緬甸曼德勒固都陶碑林與 2025 不丹授戒口徑：</strong>準確區分為 <strong>729 塊三藏經文石碑</strong>（另有第 730 塊建碑史誌碑），以及 Bhutan Nuns Foundation 官方公布 2025 年 11 月來自 14 國之 <strong>265 位</strong>（部分外媒作近 270 位）。</li>
          <li><strong>《楞嚴經》經號防混：</strong>唐代《大佛頂首楞嚴經》為 <strong>T945</strong>，嚴格區分鳩摩羅什譯《首楞嚴三昧經》<strong>T642</strong>。</li>
          <li><strong>技術封鎖（ACCESS_BLOCKED）不等於版權禁止（RIGHTS_DENIED）：</strong>美國國會圖書館 <code>2018305008</code> 館藏標示 Public Domain Mark 1.0，但對自動 HTTP 請求回傳 HTTP 403；大英圖書館 IDP <code>Or.8210/S.5475</code> 亦採反爬蟲挑戰。本站不繞過任何安全機制，均改以官方直連提供讀者查閱，且絕不以 1310 年高麗刻本混充敦煌寫本替代件。</li>
        </ul>
      </div>
    </div></section>

    ${sectionHtml}

    <section class="research-sec wide" id="image-rights" tabindex="-1"><div class="container">
      <div class="kicker">實物與檔案影像透明稽核 · ${rightsRows.length} 筆紀錄</div>
      <h2>歷史實物影像來源、權利授權與證明界線</h2>
      <p class="small">本站絕不使用 AI 圖像充當歷史文物。凡可合法嵌入之文物與實景照均經 SHA-256 與授權驗證（Public Domain、CC0、CC BY、CC BY-SA）；對自動請求回傳封鎖者誠實標為 <code>ACCESS_BLOCKED</code>（技術受阻而非版權禁止）並附官方館藏網址；基於個人肖像隱私保留者標為 <code>NOT_EMBEDDED_PRIVACY</code>；完整清冊見 <code>docs/HISTORY_IMAGES_RIGHTS.tsv</code>。</p>
      <div class="table-wrap"><table role="table"><caption>歷史證據圖像與權利稽核表</caption><thead><tr><th>編號與主題</th><th>授權與狀態</th><th>館藏／年代基礎</th><th>證明範圍與限制</th></tr></thead><tbody>
        ${rightsTableRows}
      </tbody></table></div>
    </div></section>

    <section class="research-sec wide" id="legacy-urls" tabindex="-1"><div class="container">
      <div class="kicker">v1.1 外部連結逐條稽核 · 共 ${legacyRows.length} 個不重複網址</div>
      <h2>原版 95 個外部 HTTPS 連結去向總表</h2>
      <p class="small">逐一核對 v1.1 基準提交（<code>6c8cc58</code>）內出現的全部 ${legacyRows.length} 個不重複外部 HTTPS 連結，並依實務測試紀錄為保留（<code>KEPT</code>）、補回（<code>RESTORED</code>）、等效學術來源替代（<code>REPLACED_EQUIVALENT</code>）或鏡像冗餘排除（<code>EXCLUDED_MIRROR_OR_REDUNDANT</code>）；完整 TSV 見 <code>docs/HISTORY_LEGACY_URLS.tsv</code>。</p>
      <div class="table-wrap"><table role="table"><caption>v1.1 舊版連結處理清冊（${legacyRows.length} 列）</caption><thead><tr><th>原網址／歸屬證據</th><th>處理決定</th><th>現用網址或替代目標</th><th>2026-11-28 查核／說明</th></tr></thead><tbody>
        ${legacyRows.map(u => `<tr>
          <th data-label="原網址／歸屬"><code>${esc(u.legacy_url)}</code><br><span class="small">${esc(u.evidence_id)}</span></th>
          <td data-label="處理決定"><span class="badge">${esc(u.disposition)}</span></td>
          <td data-label="現用或替代目標">${u.v2_target_url && u.v2_target_url.startsWith("http") ? `<a href="${esc(u.v2_target_url)}" target="_blank" rel="noopener noreferrer">${esc(u.v2_target_url)}</a>` : `<code>${esc(u.v2_target_url || "—")}</code>`}</td>
          <td data-label="查核與理由"><code>${esc(u.http_check_20261128)}</code> · ${esc(u.rationale)}</td>
        </tr>`).join("\n")}
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
      <p class="small">核查檢索基準日：2026-11-28。凡標示 <code>ABSTRACT_ONLY</code> 者皆未主張讀過付費全書，保留待閱限制。</p>
      <p><a href="./index.html">系列首頁</a><a href="./merit.html">第二篇：功德真相</a><a href="./history.html">大眾探索館</a><a href="https://github.com/t14210184/The-Naked-Dhamma" target="_blank" rel="noopener noreferrer">GitHub 原始碼</a><a href="https://github.com/t14210184/The-Naked-Dhamma/issues" target="_blank" rel="noopener noreferrer">勘誤與建議（Issues）</a></p>
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

const covRows = parseTsv("docs/HISTORY_COVERAGE.tsv");
const rightsRows = parseTsv("docs/HISTORY_IMAGES_RIGHTS.tsv");
const legacyRows = parseTsv("docs/HISTORY_LEGACY_URLS.tsv");
const historyHtml = buildHistoryHtml().replace(/[ \t]+$/gm, "");
const researchHtml = buildResearchHtml(rightsRows, legacyRows, covRows).replace(/[ \t]+$/gm, "");

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

// Verify all local evidence images exist, are registered in HISTORY_IMAGES_RIGHTS.tsv, and have width/height
const claimSet = new Set(CLAIMS.map(c => c.id));
const evIdSet = new Set(EVIDENCE_ITEMS.map(e => e.id));
const evFiles = readdirSync("assets/history/evidence").filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
for (const f of evFiles) {
  const rel = "assets/history/evidence/" + f;
  if (!rightsRows.some(r => r.local_file === rel)) throw new Error("Unregistered evidence file: " + rel);
}
for (const r of rightsRows) {
  if (!r.asset_id || !r.status || !r.claim_ids) throw new Error("Incomplete rights row: " + JSON.stringify(r));
  for (const cid of r.claim_ids.split(",")) {
    if (!claimSet.has(cid.trim())) throw new Error(`Rights ${r.asset_id} unknown claim ${cid}`);
  }
  if (r.status === "EMBEDDED") {
    if (!r.local_file || !/^[0-9a-f]{64}$/.test(r.file_SHA256)) throw new Error(`Rights ${r.asset_id} missing file or SHA256`);
  }
  if (r.status === "ACCESS_BLOCKED" && /RIGHTS_DENIED/i.test(r.allowed_use)) {
    throw new Error(`Rights ${r.asset_id} conflates ACCESS_BLOCKED with RIGHTS_DENIED`);
  }
}
for (const html of [historyHtml, researchHtml]) {
  for (const imgTag of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\bwidth="/.test(imgTag[0]) || !/\bheight="/.test(imgTag[0]) || !/\balt="/.test(imgTag[0])) {
      throw new Error("<img> missing width/height/alt: " + imgTag[0]);
    }
  }
}

// Verify coverage matrix completeness and non-uniform verification states
if (covRows.length < 244) throw new Error("Expected >= 244 coverage rows, got " + covRows.length);
const seenInputIds = new Set();
const allowedStates = new Set(["SEMANTIC_VERIFIED", "INVENTORY_ONLY", "PRIMARY_PENDING", "INSUFFICIENT_DATA", "ACCESS_LIMITED", "RIGHTS_EXCEPTION"]);
const seenStates = new Set();
for (const row of covRows) {
  if (!row.input_id || seenInputIds.has(row.input_id)) throw new Error("Duplicate or empty input_id: " + row.input_id);
  seenInputIds.add(row.input_id);
  if (!allowedStates.has(row.verification_state)) throw new Error(`Coverage ${row.input_id} invalid state ${row.verification_state}`);
  seenStates.add(row.verification_state);
  const pub = row.public_anchor.replace(/^#/, "");
  const res = row.research_anchor.replace(/^#/, "");
  if (!hIds.has(pub)) throw new Error(`Coverage ${row.input_id} invalid public_anchor #${pub}`);
  if (!rIds.has(res)) throw new Error(`Coverage ${row.input_id} invalid research_anchor #${res}`);
  for (const cid of row.claim_ids.split(",")) {
    if (!claimSet.has(cid.trim())) throw new Error(`Coverage ${row.input_id} unknown claim ${cid}`);
  }
  for (const eid of row.evidence_ids.split(",")) {
    if (!evIdSet.has(eid.trim())) throw new Error(`Coverage ${row.input_id} unknown evidence ${eid}`);
  }
}
if (seenStates.size < 3) throw new Error("Coverage matrix must reflect diverse verification states, got: " + [...seenStates].join(", "));

// Verify 95 legacy URL dispositions
if (legacyRows.length !== 95) throw new Error("Expected 95 legacy URL rows, got " + legacyRows.length);
const seenLegacyUrls = new Set();
const allowedDispositions = new Set(["KEPT", "RESTORED", "REPLACED_EQUIVALENT", "EXCLUDED_MIRROR_OR_REDUNDANT"]);
for (const u of legacyRows) {
  if (!u.legacy_url || seenLegacyUrls.has(u.legacy_url)) throw new Error("Duplicate/empty legacy_url: " + u.legacy_url);
  seenLegacyUrls.add(u.legacy_url);
  if (!allowedDispositions.has(u.disposition)) throw new Error(`Legacy URL invalid disposition: ${u.disposition}`);
  if (u.evidence_id !== "SITE" && !evIdSet.has(u.evidence_id)) throw new Error(`Legacy URL unknown evidence_id: ${u.evidence_id}`);
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
  coverageStates: [...seenStates],
  legacyUrlsVerified: legacyRows.length,
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
