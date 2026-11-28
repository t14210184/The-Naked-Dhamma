// Act 2 (Stations 08–12): Real Museum Archaeology + Natural Earth Historical Geography
import { ASIA_LAND_PATH, ASIA_LAKES_PATH, ASIA_PLACES } from "./asia-map-data.mjs";

const p = ASIA_PLACES;

export const ACT2_STATIONS = [
  // S08: Archaeological Artifact Magnifier
  `<section id="evidence" class="chapter theme-archive" data-station="8" tabindex="-1"><div class="container">
    <div class="kicker">第 08 關 · 真實古物放大尋寶</div>
    <h2>不靠傳說，石柱和樹皮講什麼？</h2>
    <p class="story-lead">如果不要只靠後人說的故事，世界上到底找不找得到真的摸得著、能測年代的佛教古董？有！兩件最重要的寶貝是兩千兩百多年前阿育王刻在石頭上的字，還有約兩千年前寫在樹皮上的古卷。</p>

    <div class="play">
      <span class="kicker">博物館放大尋寶台 · 自己放大照片找刻字，再點開看翻譯</span>
      <div class="tab-row js-only" role="group" aria-label="選擇五張博物館真跡照片">
        <button type="button" data-artifact="lumbini" aria-pressed="true">1. 誕生地石柱刻字</button>
        <button type="button" data-artifact="bhabra" aria-pressed="false">2. 點名推薦七部經石刻</button>
        <button type="button" data-artifact="nigali" aria-pressed="false">3. 紀念更早佛陀石柱</button>
        <button type="button" data-artifact="sarnath" aria-pressed="false">4. 不准分裂僧團告示</button>
        <button type="button" data-artifact="gandhara" aria-pressed="false">5. 寫在樺樹皮上的古經</button>
      </div>

      <figure class="artifact-fig">
        <div class="artifact-stage" id="viewer-stage" tabindex="0" aria-label="博物館照片放大區，可用按鈕或鍵盤加減與方向鍵移動">
          <img id="viewer-img" data-fallback src="assets/history/evidence/img01-rummindei-inscription.jpg" width="1000" height="662" loading="lazy" alt="1896年印度考古調查局拍攝的藍毘尼阿育王石柱五行古代石刻文字近照">
          <div class="img-fallback" id="viewer-fallback" hidden>
            <p><strong>照片暫時載入不到（可能是目前沒有連網）。</strong></p>
            <p>您可以回到有網路時重開，或點下方來源連結直接看各地博物館官方收藏。</p>
          </div>
          <div class="artifact-overlay" id="viewer-overlay">
            <span class="overlay-pill">藍毘尼石柱上的刻字（約兩千兩百多年前，真實古物照片未修圖）</span>
          </div>
        </div>
        <figcaption>
          <p id="viewer-obs"><strong>先自己看圖找線索：</strong>石頭表面刻了五排整齊的古代文字，從上往下數第二排右邊，看得出「釋迦牟尼佛」的古老寫法。</p>
          <p id="viewer-cue" class="small">放大提示：點下面「放大細節 ＋」到 140%–180%，看第二排右半段的石刻筆畫。</p>
          <p id="viewer-trans" class="note" hidden>上面刻了什麼意思？國王登基第二十年親自來這裡禮敬，寫說因為「釋迦牟尼佛生在這個村子」，所以立柱紀念，並減免村裡稅金剩八分之一。</p>
          <p id="viewer-limit" class="small">來源與限度：1896 年老檔案照片（已無版權限制）。證明公元前三世紀人們已認定這裡是佛陀誕生地，但沒有證明生在哪一年或出生走七步的神話。</p>
        </figcaption>
      </figure>

      <div class="controls js-only" role="group" aria-label="照片放大與掀開答案控制">
        <button type="button" id="viewer-zoom-in">放大細節 ＋</button>
        <button type="button" id="viewer-zoom-out">縮小 −</button>
        <button type="button" id="viewer-pan-left">← 往左看</button>
        <button type="button" id="viewer-pan-right">往右看 →</button>
        <button type="button" id="viewer-toggle-overlay" aria-pressed="true">開關小標籤</button>
        <button type="button" id="viewer-toggle-trans" aria-pressed="false">揭曉石頭上寫什麼</button>
        <button type="button" id="viewer-reset">回到原本大小</button>
      </div>
      <p id="viewer-zoom-status" class="small" role="status" aria-live="polite">目前大小：100%</p>
    </div>

    <div class="grid">
      <article class="card-box">
        <span class="tag">真實歷史老照片</span>
        <h3>藍毘尼的石柱現場</h3>
        <img src="assets/history/evidence/img01-lumbini-pillar.jpg" width="800" height="961" loading="lazy" alt="1896年拍攝的藍毘尼石柱整根外觀與石刻位置全景老照片" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">1896 年考古隊拍到的石柱全景。它證實國王特地來立柱紀念釋迦牟尼出生地；至於這根柱子為什麼被後世埋進土裡又挖出來，那又是另一段考古大發現。</p>
      </article>
      <article class="card-box">
        <span class="tag">兩千歲樺樹皮真跡</span>
        <h3>大犍陀羅的樹皮古經</h3>
        <img src="assets/history/evidence/img02-gandhara-bl-or14915.jpg" width="1000" height="667" loading="lazy" alt="大英圖書館收藏的一世紀犍陀羅語樺樹皮古寫本六片殘卷" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">大英圖書館收藏的樹皮捲軸（約西元一世紀），寫著很早期的經典；美國國會圖書館也有類似藏品（網站防機器人擋住自動連線，想看高清原圖請直接到 <a href="https://www.loc.gov/item/2018305008/" target="_blank" rel="noopener noreferrer">國會圖書館官方頁面 ↗</a>）。</p>
      </article>
    </div>

    <div class="source-door">
      <p>📖 <strong>這些古物研究從哪裡來？</strong>來自孔雀王朝阿育王石刻實物報告與大英圖書館／雪梨大學犍陀羅寫本測年計畫。</p>
      <a class="button secondary" href="./history-research.html#ashoka-inscriptions">看四座石刻＋古寫本完整考證 →</a>
    </div>

    <details class="story-more">
      <summary>想再多看一點：石柱和傳說寫經時間差在哪？</summary>
      <p class="small">提醒一件事：斯里蘭卡流傳故事說前 1 世紀就用棕櫚葉寫下了全部巴利三藏，但那批前 1 世紀的原本早已不見，這件事也是幾百年後的編年史寫的。目前人類真的拿得到手裡測年、還看得到字的實物，最早就是這些比阿育王更晚一兩百年左右的樺樹皮古卷！</p>
      <div class="table-wrap"><table role="table"><caption>阿育王四處石刻能證明什麼、又不能亂猜什麼</caption><thead><tr><th>石頭刻字</th><th>這塊石頭真的有講的事</th><th>不能多猜的範圍</th></tr></thead><tbody>
        <tr><th data-label="石刻">藍毘尼石柱</th><td data-label="能證">西元前三世紀國王認定這裡是佛陀誕生聖地。</td><td data-label="限制">沒寫誕生那年是哪一年，也沒有寫走七步神話。</td></tr>
        <tr><th data-label="石刻">拜拉特石刻</th><td data-label="能證">國王挑了七段教導推薦大家多讀（包含第 05 關對羅睺羅的故事）。</td><td data-label="限制">不證明當時整本巴利大藏經已一字不改定案。</td></tr>
        <tr><th data-label="石刻">禁止分裂石柱</th><td data-label="能證">當時國王親自下令管理出家人的團體秩序。</td><td data-label="限制">不能單獨證明後代歷史書記載的第三次結集所有開會細節。</td></tr>
        <tr><th data-label="石刻">尼迦利石柱</th><td data-label="能證">當時人們已經在拜過去出現過的佛陀（拘那含佛）與佛塔。</td><td data-label="限制">不證明過去幾位古佛的神話傳記當真在歷史上發生過。</td></tr>
      </tbody></table></div>
    </details>

    <nav class="station-nav" aria-label="第 8 關導覽"><p class="small">目前第 8／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#truth">← 上一關</a><a class="button" href="#transmission">下一關：兩千年的傳話遊戲 →</a></div></nav>
  </div></section>`,

  // S09: Oral Transmission Circle Lab
  `<section id="transmission" class="chapter theme-storybook" data-station="9" tabindex="-1"><div class="container">
    <div class="kicker">第 09 關 · 沒錄音機的時代怎麼背兩百年？</div>
    <h2>榕樹下的古代傳話實驗室</h2>
    <p class="story-lead">佛陀過世後好幾百年都沒有寫成書，全靠一屆一屆用嘴巴背給下一屆聽！這是不是像派對上「耳語傳話」一樣越傳越歪？點進來看看四種完全不一樣的傳法結果！</p>

    <div class="play">
      <span class="kicker">傳話圈實驗 · 選一種傳法方式，看話繞一圈變成什麼樣子</span>
      <div class="story-stage">
        <img class="stage-art" src="assets/history/illustrations/s09-village-circle.webp" width="1200" height="675" loading="lazy" alt="陽光透進大榕樹林，五位僧侶與村民圍坐草蓆上把一捲古書輕輕往下傳遞（現代繪本插畫）">
        <div class="stage-overlay-row">
          <span class="badge ok" id="s09-mode-pill">目前測試：還沒有開始傳話</span>
        </div>
        <div class="three" style="padding:10px 12px">
          <div class="node" id="s09-card-1"><span class="actor-badge">起點的話</span><p id="s09-n1-txt" style="margin:4px 0;font-weight:700">「這句教導很重要」</p></div>
          <div class="node" id="s09-card-2"><span class="actor-badge">怎麼傳？</span><p id="s09-n2-txt" style="margin:4px 0;font-weight:700">點下方選傳遞方式</p></div>
          <div class="node" id="s09-card-3"><span class="actor-badge">繞一圈之後</span><p id="s09-n3-txt" style="margin:4px 0;font-weight:700">結果會出現在這裡</p></div>
        </div>
      </div>

      <div class="controls js-only" role="group" aria-label="測試四種口傳方式">
        <button type="button" data-txmode="whisper" aria-pressed="false">1. 悄悄說給下一個人聽</button>
        <button type="button" data-txmode="chorus" aria-pressed="false">2. 一大群人定期一起大聲念</button>
        <button type="button" data-txmode="translate" aria-pressed="false">3. 翻譯成外國語言</button>
        <button type="button" data-txmode="expand" aria-pressed="false">4. 遇到新問題時補進新條文</button>
        <button type="button" id="s09-reset">再玩一次</button>
      </div>
      <p id="s09-out" class="result" role="status" aria-live="polite">點選上面四個按鈕，就能看出「集體背書很穩」和「細節還是會慢慢多出來」為什麼會同時發生！</p>
    </div>

    <div class="story-takeaway">
      <h3>兩句話記住：既不會隨便全改掉，也不是一字不差</h3>
      <p>一方面，研究口傳的學者（如 Alexander Wynne）發現，古代出家人其實很像音樂合唱團一樣定期集體對詞、互相盯著有沒有背漏，所以核心骨幹滿穩的。另一方面，比較巴利文跟中文版本的學者也發現，很多重複的排比句型、翻譯改寫和後來補充的分類還是默默加了進去——所以<strong>背得整整齊齊，不等於那段就是最早的原本！</strong></p>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段研究從哪裡來？</strong>整合古代佛教口傳記憶機制與巴利漢譯對讀研究。</p>
      <a class="button secondary" href="./history-research.html#oral-transmission">看口傳研究論文與對讀細節 →</a>
    </div>

    <details class="story-more">
      <summary>想再多看一點：還有哪 11 種生活現實會悄悄改變流傳下來的書？</summary>
      <p class="small">另外記住一個道理：如果古代十個流派裡有八個在戰爭裡消失了，只剩兩個活到今天，我們不能因為今天只看到這兩個，就以為兩千年前原本只有這兩家（學者稱這種看不見死角叫「存活者偏差」）。</p>
      <div class="table-wrap"><table role="table"><caption>讓古代文獻慢慢產生變化的十一種力量</caption><thead><tr><th>影響原因</th><th>可能讓後來的人看到什麼變化</th></tr></thead><tbody>
        <tr><th data-label="原因">口耳傳很久</th><td data-label="變化">容易掉字、記錯，或是用好背的固定模板越補越長</td></tr>
        <tr><th data-label="原因">換成別的語言文字</th><td data-label="變化">原本的意思被借用新語言的習慣來理解</td></tr>
        <tr><th data-label="原因">不同派別彼此競爭</th><td data-label="變化">各自加上支持自己的故事；輸掉或消失的派別，只剩別人在罵他的紀錄</td></tr>
        <tr><th data-label="原因">國王跟官府介入</th><td data-label="變化">挑自己喜歡的保存，把不喜歡的刪掉或改寫</td></tr>
        <tr><th data-label="原因">打仗與災禍</th><td data-label="變化">廟宇被燒，住那裡的人跟書一起不見</td></tr>
        <tr><th data-label="原因">寺廟要吃飯活下去</th><td data-label="變化">祈福、超度與喪禮儀式越加越多</td></tr>
        <tr><th data-label="原因">入境隨俗當地文化</th><td data-label="變化">吸收當地的神明、家庭觀念與過節習慣</td></tr>
        <tr><th data-label="原因">男女與階級觀念</th><td data-label="變化">規矩受到當地社會風俗影響</td></tr>
        <tr><th data-label="原因">立祖師品牌講正統</th><td data-label="變化">替早年歷史補寫清楚的「第一代傳到第幾代」名單</td></tr>
        <tr><th data-label="原因">後人抄寫不小心或熱心</th><td data-label="變化">旁邊的讀書筆記不小心被下個抄書人抄進正文裡</td></tr>
        <tr><th data-label="原因">近代碰上科學跟殖民</th><td data-label="變化">被重新包裝成「心靈科學」或「減壓生活哲學」</td></tr>
      </tbody></table></div>
    </details>

    <nav class="station-nav" aria-label="第 9 關導覽"><p class="small">目前第 9／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#evidence">← 上一關</a><a class="button" href="#history">下一關：兩千五百年的地圖旅行 →</a></div></nav>
  </div></section>`,

  // S10: TEMPLATE FLAGSHIP 2 — Real Natural Earth Asia Coastline Map + Stepped Historical Explorer
  `<section id="history" class="chapter theme-atlas" data-station="10" tabindex="-1"><div class="container">
    <div class="kicker">第 10 關 · 帶著真實亞洲地圖去時光旅行</div>
    <h2>兩千五百年的亞洲探索之旅</h2>
    <p class="story-lead">佛教從北印度出發後，並沒有像一條直線那樣照順序慢慢傳開，而是同一時期在不同地方各自長出不一樣的樣子！拉動時間軸或按播放，看這張真實亞洲海岸線地圖上的各個城市怎麼依時代一一亮起來。</p>

    <div class="play">
      <span class="kicker">真實地理地圖 × 12 段時光旅行（Natural Earth 1:50m 公版地理底圖，非古代國界）</span>
      <div class="atlas-stage">
        <svg id="s10-atlas-svg" viewBox="0 0 800 500" role="img" aria-labelledby="s10-map-t s10-map-d">
          <title id="s10-map-t">佛教兩千五百年亞洲真實海岸線互動歷史地圖</title>
          <desc id="s10-map-d">採用 Natural Earth 1:50m 公版陸地與湖泊資料繪製的印度、斯里蘭卡、東南亞、西藏、中國、日本與臺灣地理底圖，隨時代切換顯示各地城市、手稿與歷史傳播走廊。</desc>
          <rect class="atlas-sea" width="800" height="500" rx="12"/>
          <path class="atlas-land" d="${ASIA_LAND_PATH}"/>
          <path class="atlas-lake" d="${ASIA_LAKES_PATH}"/>

          <!-- Uncertain / Dashed Multiple Historical Corridors (no false straight arrows) -->
          <path id="s10-route-nw" class="atlas-route" d="M${p.magadha[0]} ${p.magadha[1]} Q135 160 ${p.gandhara[0]} ${p.gandhara[1]} Q195 62 ${p.dunhuang[0]} ${p.dunhuang[1]} Q370 92 ${p.changan[0]} ${p.changan[1]} L${p.nanjing[0]} ${p.nanjing[1]}" fill="none" stroke="#9e5a1f" stroke-opacity="0.25" stroke-width="3" stroke-dasharray="8 6"/>
          <path id="s10-route-sea" class="atlas-route" d="M${p.magadha[0]} ${p.magadha[1]} Q182 325 ${p.anuradhapura[0]} ${p.anuradhapura[1]} Q272 425 ${p.ayutthaya[0]} ${p.ayutthaya[1]} Q465 365 ${p.nanjing[0]} ${p.nanjing[1]}" fill="none" stroke="#18594b" stroke-opacity="0.25" stroke-width="3" stroke-dasharray="8 6"/>
          <path id="s10-route-him" class="atlas-route" d="M${p.magadha[0]} ${p.magadha[1]} Q246 196 ${p.samye[0]} ${p.samye[1]} Q360 155 ${p.changan[0]} ${p.changan[1]}" fill="none" stroke="#7d4a82" stroke-opacity="0.22" stroke-width="2.5" stroke-dasharray="5 6"/>

          <!-- Real Latitude/Longitude Pin Landmarks -->
          <g font-size="11.5" font-weight="750" fill="#243330">
            <g class="map-pin" id="pin-lumbini"><circle cx="${p.lumbini[0]}" cy="${p.lumbini[1]}" r="4.5" fill="#fffdf7" stroke="#243330" stroke-width="1.8"/><text x="${p.lumbini[0]-12}" y="${p.lumbini[1]-8}" text-anchor="end">藍毘尼</text></g>
            <g class="map-pin" id="pin-magadha"><circle cx="${p.magadha[0]}" cy="${p.magadha[1]}" r="4.5" fill="#fffdf7" stroke="#243330" stroke-width="1.8"/><text x="${p.magadha[0]+8}" y="${p.magadha[1]+14}">摩揭陀・那爛陀</text></g>
            <g class="map-pin" id="pin-gandhara"><circle cx="${p.gandhara[0]}" cy="${p.gandhara[1]}" r="4.5" fill="#fffdf7" stroke="#243330" stroke-width="1.8"/><text x="${p.gandhara[0]+8}" y="${p.gandhara[1]+4}">大犍陀羅</text></g>
            <g class="map-pin" id="pin-anuradhapura"><circle cx="${p.anuradhapura[0]}" cy="${p.anuradhapura[1]}" r="4.5" fill="#fffdf7" stroke="#243330" stroke-width="1.8"/><text x="${p.anuradhapura[0]+8}" y="${p.anuradhapura[1]+4}">斯里蘭卡</text></g>
            <g class="map-pin" id="pin-samye"><circle cx="${p.samye[0]}" cy="${p.samye[1]}" r="4.5" fill="#fffdf7" stroke="#243330" stroke-width="1.8"/><text x="${p.samye[0]+8}" y="${p.samye[1]-4}">桑耶寺</text></g>
            <g class="map-pin" id="pin-dunhuang"><circle cx="${p.dunhuang[0]}" cy="${p.dunhuang[1]}" r="4.5" fill="#fffdf7" stroke="#243330" stroke-width="1.8"/><text x="${p.dunhuang[0]+8}" y="${p.dunhuang[1]+4}">敦煌</text></g>
            <g class="map-pin" id="pin-mandalay"><circle cx="${p.mandalay[0]}" cy="${p.mandalay[1]}" r="4.5" fill="#fffdf7" stroke="#243330" stroke-width="1.8"/><text x="${p.mandalay[0]+8}" y="${p.mandalay[1]+4}">緬甸</text></g>
            <g class="map-pin" id="pin-ayutthaya"><circle cx="${p.ayutthaya[0]}" cy="${p.ayutthaya[1]}" r="4.5" fill="#fffdf7" stroke="#243330" stroke-width="1.8"/><text x="${p.ayutthaya[0]+8}" y="${p.ayutthaya[1]+4}">泰國東南亞</text></g>
            <g class="map-pin" id="pin-changan"><circle cx="${p.changan[0]}" cy="${p.changan[1]}" r="4.5" fill="#fffdf7" stroke="#243330" stroke-width="1.8"/><text x="${p.changan[0]-8}" y="${p.changan[1]-8}" text-anchor="end">長安</text></g>
            <g class="map-pin" id="pin-nanjing"><circle cx="${p.nanjing[0]}" cy="${p.nanjing[1]}" r="4.5" fill="#fffdf7" stroke="#243330" stroke-width="1.8"/><text x="${p.nanjing[0]+8}" y="${p.nanjing[1]-4}">建康(南京)</text></g>
            <g class="map-pin" id="pin-taipei"><circle cx="${p.taipei[0]}" cy="${p.taipei[1]}" r="4.5" fill="#fffdf7" stroke="#243330" stroke-width="1.8"/><text x="${p.taipei[0]+8}" y="${p.taipei[1]+4}">臺灣</text></g>
            <g class="map-pin" id="pin-kyoto"><circle cx="${p.kyoto[0]}" cy="${p.kyoto[1]}" r="4.5" fill="#fffdf7" stroke="#243330" stroke-width="1.8"/><text x="${p.kyoto[0]+8}" y="${p.kyoto[1]+4}">日本</text></g>
          </g>

          <!-- Primary & Secondary Active Era Highlight Pins -->
          <circle id="s10-map-ring" cx="${p.lumbini[0]}" cy="${p.lumbini[1]}" r="22" fill="#e6a23c" fill-opacity="0.22" stroke="#b36500" stroke-width="2.5" stroke-dasharray="4 3"/>
          <circle id="s10-map-dot" cx="${p.lumbini[0]}" cy="${p.lumbini[1]}" r="10.5" fill="#d97706" stroke="#fffdf7" stroke-width="2.5"/>
          <circle id="s10-map-dot2" cx="${p.magadha[0]}" cy="${p.magadha[1]}" r="7.5" fill="#15803d" stroke="#fffdf7" stroke-width="2" opacity="0"/>
          <rect x="14" y="454" width="772" height="32" rx="8" fill="#182b27" fill-opacity="0.9"/>
          <text id="s10-era-note-svg" x="400" y="475" text-anchor="middle" fill="#fffdf7" font-size="12.5" font-weight="700">現代真實海岸底圖（非古代國界）；虛線代表多條可能路徑與未定史實</text>
        </svg>
        <div class="stage-overlay-row">
          <span class="badge ok" id="s10-time">西元前 600–400 年（第 1／12 站）</span>
          <button type="button" id="s10-autoplay" class="js-only" aria-pressed="false">▶ 沿時間軸播放</button>
        </div>
      </div>

      <label class="js-only" for="s10-slider"><b>拉動這條時光軸，看各地事件接連亮起：</b></label>
      <input class="js-only" id="s10-slider" type="range" min="0" max="11" value="0">
      <div class="controls js-only">
        <button type="button" id="s10-prev">← 上一個時代</button>
        <button type="button" id="s10-next">下一個時代 →</button>
      </div>
      <div class="tab-row js-only" role="group" aria-label="直接跳到重要時代">
        <button type="button" data-era="0" aria-pressed="true">前5世紀｜沙門與佛陀</button>
        <button type="button" data-era="2" aria-pressed="false">前3世紀｜阿育王石刻</button>
        <button type="button" data-era="4" aria-pressed="false">1世紀｜最早樹皮書卷</button>
        <button type="button" data-era="7" aria-pressed="false">6–10世紀｜漢地吐蕃並行</button>
        <button type="button" data-era="11" aria-pressed="false">近現代｜臺灣與全世界</button>
      </div>
      <div class="result" role="status" aria-live="polite">
        <strong id="s10-title">沙門運動與歷史上的佛陀｜活躍地帶：恒河中游（今北印／尼泊爾南）</strong>
        <p id="s10-info" style="margin:6px 0 0">真找得到什麼？確定有位喬達摩在北印度教導大家離苦的方法；但具體生平細節跟過世那一年，現在還是只能抓個大約範圍。</p>
      </div>
    </div>

    <div class="story-takeaway">
      <h3>兩點地圖誠實提醒（別被漂亮底圖騙了！）</h3>
      <p>第一，這張底圖用的是現代全球真實海岸線資料（Natural Earth），<strong>不代表兩千年前古代的國界或海岸完全長這樣</strong>；第二，地圖上那幾條虛線走廊，代表的是考古與史料看得到的多方交流方向，並不表示每一小段路程都有寫進死板的時間表。</p>
    </div>

    <div class="source-door">
      <p>📖 <strong>這份年代與歷史評估從哪裡來？</strong>整合歷史佛陀研究與十二個時期、四次大集會的史料比對。</p>
      <a class="button secondary" href="./history-research.html#chronology">看歷史佛陀生平證據與結集考證 →</a>
    </div>

    <details class="story-more">
      <summary>想再多查詳細資料：佛陀生平十項傳說可信嗎？十二時代跟四次大會全表</summary>
      <div class="table-wrap"><table role="table"><caption>關於釋迦牟尼生平，哪些比較穩、哪些沒證據？</caption><thead><tr><th>常聽到的說法</th><th>現在找到的證據夠嗎</th></tr></thead><tbody>
        <tr><th data-label="說法">確實有位叫喬達摩的修行老師</th><td data-label="證據">高</td></tr>
        <tr><th data-label="說法">活動在北印度和今天尼泊爾南邊</th><td data-label="證據">高</td></tr>
        <tr><th data-label="說法">建立出家人團體教大家脫離痛苦</th><td data-label="證據">高</td></tr>
        <tr><th data-label="說法">出身有一定地位的釋迦族</th><td data-label="證據">中高</td></tr>
        <tr><th data-label="說法">像現代想像的豪華王國王子</th><td data-label="證據">中低（可能有後人寫得更戲劇化）</td></tr>
        <tr><th data-label="說法">29歲出家、35歲覺悟、80歲過世</th><td data-label="證據">傳統說法，沒辦法找到當年官方出生證明</td></tr>
        <tr><th data-label="說法">出生馬上走七步講話</th><td data-label="證據">找不到歷史證據</td></tr>
        <tr><th data-label="說法">樹下遇到魔王與各種神通奇蹟</th><td data-label="證據">歷史研究沒辦法檢驗這種故事</td></tr>
        <tr><th data-label="說法">後代佛陀傳記寫的每句對白都是真錄音</th><td data-label="證據">不能當成一字不差的錄音記錄</td></tr>
      </tbody></table></div>
    </details>

    <nav class="station-nav" aria-label="第 10 關導覽"><p class="small">目前第 10／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#transmission">← 上一關</a><a class="button" href="#branches">下一關：三條大河的共同拼圖 →</a></div></nav>
  </div></section>`,

  // S11: Shared Puzzle & Diverging Branches
  `<section id="branches" class="chapter theme-atlas" data-station="11" tabindex="-1"><div class="container">
    <div class="kicker">第 11 關 · 為什麼分出這麼多派別？</div>
    <h2>把各派擺在一起，拼出共同的拼圖</h2>
    <p class="story-lead">大家常問：到底南傳、漢傳還是藏傳才是最原味的那一家？其實早期很多條河流本來就有來往分流——試著點按把不同傳承的資料放進拼圖盤，看哪些拼得起來、哪些就是各走各的！</p>

    <div class="play">
      <span class="kicker">共同核心拼圖桌 · 點選地區傳承，看「拼合的核心」跟「不同的生活規矩」</span>
      <div class="story-stage" style="padding:12px">
        <div class="puzzle-board" id="s11-puzzle-board">
          <div class="puzzle-piece snapped" id="s11-pz-core"><strong>🧩 中央共同拼圖（跨語言找得到的）</strong><p class="small" id="s11-pz-core-txt">苦與脫苦方法・無常會變・沒有不變的真我・減輕貪瞋癡</p></div>
          <div class="puzzle-piece" id="s11-pz-vinaya"><strong>📜 各自帶走的戒律本</strong><p class="small" id="s11-pz-vinaya-txt">點下面切換南傳、漢傳或藏傳，看這格怎麼變！</p></div>
          <div class="puzzle-piece" id="s11-pz-dev"><strong>🌿 當地後來長出的大系統</strong><p class="small" id="s11-pz-dev-txt">每條河流都有自己數百年的文化融合</p></div>
        </div>
      </div>

      <div class="tab-row js-only" role="group" aria-label="選擇不同地區傳承">
        <button type="button" data-trad="south" aria-pressed="true">東南亞與斯里蘭卡（南傳）</button>
        <button type="button" data-trad="east" aria-pressed="false">中韓日臺漢字圈（漢傳）</button>
        <button type="button" data-trad="tibet" aria-pressed="false">西藏與喜馬拉雅（藏傳）</button>
        <button type="button" data-trad="lost" aria-pressed="false">已經消失的古代派別</button>
      </div>
      <p id="s11-trad-out" class="result" role="status" aria-live="polite">南傳保存了一整套完整的巴利語早期經律，但中間也經歷過十二世紀國王整理、十八世紀從外國請僧人重新傳戒，並不是兩千多年一動也不動。</p>

      <h3 style="margin-top:16px">摸摸同一段早年經文的五種語言線索：</h3>
      <div class="tab-row js-only" role="group" aria-label="五種古老語言版本對比">
        <button type="button" data-lang5="pli" aria-pressed="true">巴利語古本</button>
        <button type="button" data-lang5="lzh" aria-pressed="false">古代漢語譯本</button>
        <button type="button" data-lang5="pgd" aria-pressed="false">大犍陀羅語殘卷</button>
        <button type="button" data-lang5="san" aria-pressed="false">古印度梵語線索</button>
        <button type="button" data-lang5="xct" aria-pressed="false">古藏語保存狀況</button>
      </div>
      <p id="s11-lang5-out" class="note" role="status" aria-live="polite">【巴利語本（完整對讀）】講身體不是永遠不變的我：「這不是我的，這不是我，這不是我的真我。」</p>
    </div>

    <div class="story-takeaway">
      <h3>沒有哪一派能包辦「100% 佛陀原裝版」</h3>
      <p>每一個活到今天的佛教傳統都既保存了一部分很早期的核心想法，也都經歷過中斷、王室整理、當地習俗融合跟後世註解。最聰明的讀法，是拿幾種版本互相對照，而不是盲目喊哪一派唯一正統！</p>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段跨派別比較從哪裡來？</strong>取材自跨語文早期《無我相經》《轉法輪經》比對及近代部派歷史研究。</p>
      <a class="button secondary" href="./history-research.html#traditions-comparison">看七大古部派與十大交叉比較表 →</a>
    </div>

    <details class="story-more">
      <summary>展開完整比較：十二項早年核心思想清單 &amp; 三大傳統十項對比</summary>
      <div class="table-wrap"><table role="table"><caption>三大佛教傳承在歷史上的十項真實狀況</caption><thead><tr><th>比較項目</th><th>南傳上座部</th><th>漢傳佛教</th><th>藏傳佛教</th></tr></thead><tbody>
        <tr><th data-label="項目">早年經典保存</th><td data-label="南傳">完整巴利經藏</td><td data-label="漢傳">保存重要阿含經等早年翻譯</td><td data-label="藏傳">保存部分早年經律與印度古籍</td></tr>
        <tr><th data-label="項目">出家戒規來源</th><td data-label="南傳">上座部律</td><td data-label="漢傳">法藏部《四分律》</td><td data-label="藏傳">根本說一切有部律</td></tr>
        <tr><th data-label="項目">後來哲學開展</th><td data-label="南傳">論典與義註系統</td><td data-label="漢傳">中觀、唯識、天台、華嚴、禪宗</td><td data-label="藏傳">中觀、因明、密教論辯系統</td></tr>
        <tr><th data-label="項目">融合當地文化</th><td data-label="南傳">南亞與東南亞習俗</td><td data-label="漢傳">儒家孝道、道家等</td><td data-label="藏傳">西藏及喜馬拉雅文化</td></tr>
        <tr><th data-label="項目">經歷政治插手</th><td data-label="南傳">王權整理、殖民改革</td><td data-label="漢傳">皇帝支持或滅佛</td><td data-label="藏傳">王室支持與政教制度</td></tr>
        <tr><th data-label="項目">傳承曾中斷重建</th><td data-label="南傳">有</td><td data-label="漢傳">有</td><td data-label="藏傳">有</td></tr>
        <tr><th data-label="項目">能單獨證明「全數原汁原味」？</th><td data-label="南傳">沒辦法</td><td data-label="南傳漢傳">沒辦法</td><td data-label="藏傳">沒辦法</td></tr>
      </tbody></table></div>
    </details>

    <nav class="station-nav" aria-label="第 11 關導覽"><p class="small">目前第 11／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#history">← 上一關</a><a class="button" href="#south">下一關：海島古寺的傳承接力 →</a></div></nav>
  </div></section>`,

  // S12: Sri Lanka Three Monasteries, Maritime Relay & Kuthodaw 729 Slabs
  `<section id="south" class="chapter theme-atlas" data-station="12" tabindex="-1"><div class="container">
    <div class="kicker">第 12 關 · 保存最完整經典的地方也換過接棒手</div>
    <h2>斯里蘭卡三座古寺與海上傳戒接力</h2>
    <p class="story-lead">今天說起南傳佛教，大家都想到斯里蘭卡跟緬甸、泰國。但在古代斯里蘭卡，其實曾同時住著三大彼此不同的寺院中心；到了十八世紀，島上的比丘傳承一度快要斷光，甚至要靠船隻從泰國接送法師來重新接棒！</p>

    <div class="play">
      <span class="kicker">南亞海洋接力地圖 · 點選時代站點，看南傳教團怎麼重整與接棒</span>
      <div class="atlas-stage">
        <svg viewBox="0 0 800 380" role="img" aria-labelledby="s12-map-t s12-map-d">
          <title id="s12-map-t">斯里蘭卡至東南亞海上求戒接力真實地理圖</title>
          <desc id="s12-map-d">基於 Natural Earth 地理輪廓標示斯里蘭卡、緬甸曼德勒與泰國阿瑜陀耶，呈現 1753 年跨海重立出家戒脈路線（虛線表示歷史航線研究）。</desc>
          <rect class="atlas-sea" width="800" height="380" rx="12"/>
          <g transform="translate(80,-115) scale(1.02)">
            <path class="atlas-land" d="${ASIA_LAND_PATH}"/>
            <path class="atlas-lake" d="${ASIA_LAKES_PATH}"/>
          </g>
          <path id="s12-sea-arc" d="M446 244 Q360 322 254 312" fill="none" stroke="#18594b" stroke-opacity="0.35" stroke-width="3.5" stroke-dasharray="8 5"/>
          <circle id="s12-pin-sl" cx="254" cy="312" r="10" fill="#d97706" stroke="#fffdf7" stroke-width="2.5"/>
          <circle id="s12-pin-mm" cx="403" cy="157" r="7" fill="#fffdf7" stroke="#243330" stroke-width="2"/>
          <circle id="s12-pin-th" cx="446" cy="244" r="7" fill="#fffdf7" stroke="#243330" stroke-width="2"/>
          <g font-size="12" font-weight="750" fill="#243330">
            <text x="270" y="317">斯里蘭卡三座大寺（5–12世紀統合）</text>
            <text x="418" y="155">緬甸曼德勒（729塊經碑）</text>
            <text x="462" y="248">泰國（1753年搭船支援接棒）</text>
          </g>
        </svg>
      </div>

      <div class="tab-row js-only" role="group" aria-label="點按南傳關鍵歷史轉折">
        <button type="button" data-south="maha" aria-pressed="true">1. 5世紀大寺與整理註解</button>
        <button type="button" data-south="abhaya" aria-pressed="false">2. 無畏山寺（曾經包容多種思想）</button>
        <button type="button" data-south="jeta" aria-pressed="false">3. 祇陀林寺（12世紀王權統合）</button>
        <button type="button" data-south="relay1753" aria-pressed="false">4. 1753 泰國跨海重新傳戒</button>
        <button type="button" data-south="kuthodaw" aria-pressed="false">5. 緬甸 729 塊大石碑刻經</button>
      </div>
      <p id="s12-out" class="result" role="status" aria-live="polite">【大寺派】五世紀時在這裡把古老巴利三藏跟詳細註解整理下來；十二世紀國王下令把三座大寺院統一起來，才定出今天南傳的主要系統。</p>
    </div>

    <div class="grid">
      <article class="card-box">
        <span class="tag">斯里蘭卡遺址真實照片</span>
        <h3>無畏山寺大塔</h3>
        <img src="assets/history/evidence/img03-abhayagiri.jpg" width="900" height="496" loading="lazy" alt="斯里蘭卡阿努拉德普勒無畏山寺磚造大塔與遺址照片" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">當年規模龐大、也願意接納大乘思想，十二世紀整合後獨立系統消失（今天看到的磚塔含近代修復）。</p>
      </article>
      <article class="card-box">
        <span class="tag">緬甸真實世界遺產照片</span>
        <h3>曼德勒 729 塊三藏石碑</h3>
        <img src="assets/history/evidence/extra-kuthodaw-slab.jpg" width="800" height="1067" loading="lazy" alt="緬甸固都陶碑林白塔裡直立刻滿經文的白色大理石碑照片" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">十九世紀緬甸國王為保存佛經免遭殖民戰亂失傳，刻成整整 <strong>729 塊</strong>大理石經碑（另外還有 1 塊記錄建碑經過的紀念碑）。</p>
      </article>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段歷史從哪裡來？</strong>取材自斯里蘭卡寺院考古與十八、十九世紀南傳教團重組史料。</p>
      <a class="button secondary" href="./history-research.html#theravada-history">看南傳三寺與 729 碑完整研究 →</a>
    </div>

    <nav class="station-nav" aria-label="第 12 關導覽"><p class="small">目前第 12／22 關 · 第二區結束</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#branches">← 上一關</a><a class="button" href="#mahayana">進入第三區：大乘、中國與雪山 →</a></div></nav>
  </div></section>`
];
