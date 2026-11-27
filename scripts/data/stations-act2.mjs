// Act 2 (Stations 08–12): Historical Detective Work & Early Schools

export const ACT2_STATIONS = [
  // S08
  `<section id="evidence" class="chapter" data-station="8" tabindex="-1"><div class="container">
    <div class="kicker">第 08 站 · 石刻、手稿與不同版本</div>
    <h2>當歷史偵探</h2>
    <p>傳世佛經歷經數百年口耳相傳與抄寫，有沒有不靠宗教傳說、能用物質材料獨立查證年代的線索？有！最重要的是西元前3世紀孔雀王朝阿育王石刻，以及西元前1至後4世紀的犍陀羅樺樹皮手稿。<a class="src" href="./history-research.html#c08-001">藍毘尼柱（C08-001）</a> <a class="src" href="./history-research.html#c08-002">銘文轉寫（C08-002）</a> <a class="src" href="./history-research.html#c08-003">拜拉特七經（C08-003）</a> <a class="src" href="./history-research.html#c08-004">拘那含柱（C08-004）</a> <a class="src" href="./history-research.html#c08-005">僧團詔令（C08-005）</a> <a class="src" href="./history-research.html#c08-006">犍陀羅寫本（C08-006）</a> <a class="src" href="./history-research.html#c08-007">LOC 2018305008（C08-007）</a></p>
    <div class="play">
      <span class="kicker">真實史料放大鏡 · 先觀察實物，再開啟轉寫與限制</span>
      <h3>切換五件可查證實物照片，使用放大與標註圖層</h3>
      <div class="tab-row js-only" role="group" aria-label="選擇館藏實物">
        <button type="button" data-artifact="lumbini" aria-pressed="true">IMG01 藍毘尼石柱銘文</button>
        <button type="button" data-artifact="bhabra" aria-pressed="false">拜拉特石刻（提羅睺羅）</button>
        <button type="button" data-artifact="nigali" aria-pressed="false">尼迦利薩格爾石柱</button>
        <button type="button" data-artifact="sarnath" aria-pressed="false">鹿野苑分裂詔令</button>
        <button type="button" data-artifact="gandhara" aria-pressed="false">IMG02 犍陀羅樺皮卷</button>
      </div>
      <figure class="artifact-fig">
        <div class="artifact-stage" id="viewer-stage" tabindex="0" aria-label="史料影像檢視區，可用按鈕或鍵盤加號減號零及左右方向鍵縮放移動">
          <img id="viewer-img" data-fallback src="assets/history/evidence/img01-rummindei-inscription.jpg" width="1000" height="662" loading="lazy" alt="1896年印度考古調查局拍攝的藍毘尼阿育王石柱五行婆羅米文石刻銘文近照">
          <div class="img-fallback" id="viewer-fallback" hidden>
            <p><strong>影像暫時無法載入（離線或網路受限）。</strong></p>
            <p>您仍可透過官方館藏查閱：藍毘尼（UNESCO 666）、Hultzsch 1925 CII Vol. I（Archive.org）、犍陀羅 BL Or. 14915（Wikimedia Commons CC0）與 LOC 2018305008。</p>
          </div>
          <div class="artifact-overlay" id="viewer-overlay">
            <span class="overlay-pill">藍毘尼（倫明代）阿育王石柱銘文（約前249年）（可關閉圖層，原圖像素未經AI修改）</span>
          </div>
        </div>
        <figcaption>
          <p id="viewer-obs">先看實物：石柱表面刻有五行垂直整齊的古代幾何筆畫字母（婆羅米文），第2行右段可見「Budha Sakyamunī」字跡。</p>
          <p id="viewer-trans" class="note" hidden>轉寫與譯意：天愛喜見王登基第20年親自參訪禮敬，因『釋迦牟尼佛（Budha Sakyamunī）』生於此地而立石柱，減免藍毘尼村稅賦為八分之一。</p>
          <p id="viewer-limit" class="small">權利與限制：Public Domain（ASI 1896）。證明前3世紀聖地認定；不證明出生走七步或出生年分。</p>
        </figcaption>
      </figure>
      <div class="controls js-only" role="group" aria-label="影像放大與圖層控制">
        <button type="button" id="viewer-zoom-in">放大 ＋</button>
        <button type="button" id="viewer-zoom-out">縮小 −</button>
        <button type="button" id="viewer-pan-left">← 左移</button>
        <button type="button" id="viewer-pan-right">右移 →</button>
        <button type="button" id="viewer-toggle-overlay" aria-pressed="true">顯示／隱藏標註圖層</button>
        <button type="button" id="viewer-toggle-trans" aria-pressed="false">顯示轉寫與譯意</button>
        <button type="button" id="viewer-reset">重設視圖</button>
      </div>
      <p id="viewer-zoom-status" class="small" role="status" aria-live="polite">目前縮放：100%</p>
    </div>
    <div class="grid">
      <article class="card-box">
        <span class="tag">A 考古實物 · IMG01</span>
        <h3>藍毘尼阿育王石柱（約前249年）</h3>
        <img src="assets/history/evidence/img01-lumbini-pillar.jpg" width="800" height="961" loading="lazy" alt="1896年印度考古調查局拍攝的藍毘尼阿育王石柱及其周圍遺跡黑白歷史照片" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">館藏／來源：ASI 1896（Public Domain via Wikimedia Commons）；UNESCO 666。證明西元前3世紀已紀念釋迦牟尼誕生地，但未證實出生年份或走七步神話。<a href="#s-ashoka">見來源</a></p>
      </article>
      <article class="card-box">
        <span class="tag">A 考古實物 · IMG02</span>
        <h3>犍陀羅樺樹皮手稿（西元前1–後1世紀）</h3>
        <img src="assets/history/evidence/img02-gandhara-bl-or14915.jpg" width="1000" height="667" loading="lazy" alt="大英圖書館Or. 14915號西元1世紀犍陀羅語佉盧文樺樹皮手稿殘片實物影像" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">館藏／來源：大英圖書館 BL Or. 14915（CC0）；另見 <a href="https://www.loc.gov/item/2018305008/" target="_blank" rel="noopener noreferrer">美國國會圖書館 2018305008（Public Domain Mark 1.0，官網對自動請求回傳 HTTP 403 屬技術存取受阻 ACCESS_BLOCKED，非版權禁止）</a>。Split 藏本《八千頌般若》C14 測年約 75 CE（2σ 47–147 CE）。<a href="./history-research.html#c08-007">見寫本命題</a> · <a href="#s-scroll">見來源</a></p>
      </article>
    </div>
    <div class="table-wrap"><table role="table"><caption>阿育王四項核心碑銘證據與可確認範圍（對應原表 T07）</caption><thead><tr><th>碑銘證據</th><th>可以確認的歷史事實</th><th>不可自動推論的範圍</th></tr></thead><tbody>
      <tr><th data-label="碑銘證據">藍毘尼石柱</th><td data-label="可以確認的歷史事實">王權支持佛教聖地與紀念活動</td><td data-label="不可自動推論的範圍">不證明佛陀出生走七步或全部佛傳生平</td></tr>
      <tr><th data-label="碑銘證據">拜拉特（Bhabra）碑銘</th><td data-label="可以確認的歷史事實">國王推薦七項佛教教導供僧俗信眾學習（含羅睺羅妄語教誡）</td><td data-label="不可自動推論的範圍">不證明今日整部尼柯耶／阿含已於前3世紀逐字定本</td></tr>
      <tr><th data-label="碑銘證據">僧團分裂相關詔令</th><td data-label="可以確認的歷史事實">王權以行政介入僧團秩序與分裂問題</td><td data-label="不可自動推論的範圍">不獨立證實南傳編年史第三次結集的全部細節</td></tr>
      <tr><th data-label="碑銘證據">尼迦利薩格爾石柱</th><td data-label="可以確認的歷史事實">當時已存在過去佛（拘那含佛）信仰及佛塔崇拜</td><td data-label="不可自動推論的範圍">不證明過去佛神話傳記為歷史事實</td></tr>
    </tbody></table></div>
    <h3>實物寫本與編年史寫經年代必須切開</h3>
    <p>大犍陀羅地區出土的樺樹皮卷（BL Or.14915、Senior、Bajaur 與 Split 藏本）整體跨越公元前1世紀至公元4世紀，是實存至今且可測年的物質手稿；相較之下，斯里蘭卡阿盧寺於前1世紀寫定巴利三藏的說法出於《大史》等數百年後的編年史記載，該批前1世紀原始貝葉早已散佚不存（較晚期藏經樓亦於1848年焚毀）。<a class="src" href="./history-research.html#gandhara-manuscripts">寫本與編年史對比</a></p>
    <div class="play"><span class="kicker">情境挑戰 5／5 · 現代情境</span><h3>石柱記載此地是佛陀出生地，最有力的結論？</h3>
      <div class="choices" role="group" aria-label="石柱記載此地是佛陀出生地，最有力的結論？">
        <button type="button" data-feedback="碑文沒有記載也不可能證明走七步的神話故事。" aria-controls="q-evidence" aria-pressed="false">A．佛陀出生就走七步</button>
        <button type="button" data-feedback="正確：這是實物碑銘直接支持的範圍（前3世紀聖地認定）。" aria-controls="q-evidence" aria-pressed="false">B．當時已有此聖地認定</button>
        <button type="button" data-feedback="碑文未收錄全套佛經，亦不證明全部經典已定稿。" aria-controls="q-evidence" aria-pressed="false">C．全部佛經都已定稿</button>
      </div>
      <p class="result" id="q-evidence" role="status" aria-live="polite">點選答案，這裡會顯示理由。</p>
      <p class="small"><strong>不按也能讀：</strong>B。一件實物只能支持與它性質相符的具體命題。</p>
    </div>
    <nav class="station-nav" aria-label="站點 8 導覽"><p class="small">目前第 8／22 站</p><div class="button-row"><a class="button secondary" href="#menu">↑ 四幕目錄</a><a class="button secondary" href="#truth">← 上一站</a><a class="button secondary" href="./history-research.html#ashoka-inscriptions">研究詳頁</a><a class="button" href="#transmission">下一站 →</a></div></nav>
  </div></section>`,

  // S09
  `<section id="transmission" class="chapter" data-station="9" tabindex="-1"><div class="container">
    <div class="kicker">第 09 站 · 口傳不是錄音，也不是隨便亂編</div>
    <h2>二千多年的傳話遊戲</h2>
    <p>佛滅後數百年間，僧團靠口耳相傳保存教法。這是不是就像派對裡的「傳話遊戲」一傳就全走樣？Alexander Wynne（2004）研究指出，早期僧團對戒本與定型句採行高度紀律化的集體背誦與校對；但 Mark Allon（2022）與臺灣佛學期刊（越建東 2007；溫宗堃 2010）對比巴利與漢譯阿含，也確認經文確實經歷增刪、模板化編輯與改寫。<a class="src" href="./history-research.html#c09-001">口傳張力研究（C09-001）</a> <a class="src" href="#s-allon">來源索引</a></p>
    <div class="play">
      <span class="kicker">雙向口傳形成沙盒（教學玩具模型，非歷史統計機率）</span>
      <h3>經典形成是「集體校對保守性」與「異文擴編」並存</h3>
      <div class="scene" style="margin:10px 0">
        <svg viewBox="0 0 460 175" role="img" aria-labelledby="s09-diag-t s09-diag-d">
          <title id="s09-diag-t">經典形成與集體校對雙向流程示意（V02）</title>
          <desc id="s09-diag-d">顯示早期教導經集體合誦校對保存核心，同時在跨區域流傳、翻譯、爭議編輯與書寫中產生異文的雙向過程。</desc>
          <rect width="460" height="175" rx="14" fill="#173832"/>
          <g fill="#224a42" stroke="#9fe0bd" stroke-width="2">
            <rect x="14" y="24" width="124" height="44" rx="8"/>
            <rect x="168" y="24" width="124" height="44" rx="8"/>
            <rect x="322" y="24" width="124" height="44" rx="8"/>
            <rect x="88" y="102" width="132" height="44" rx="8"/>
            <rect x="242" y="102" width="132" height="44" rx="8"/>
          </g>
          <path d="M138 46 H168 M292 46 H322 M230 68 V102 M220 124 H242" stroke="#ecc98e" stroke-width="2.5"/>
          <g fill="#f8f5ee" font-size="12" text-anchor="middle" font-weight="700">
            <text x="76" y="50">早期教導／定型句</text>
            <text x="230" y="50">集體合誦校對(保守)</text>
            <text x="384" y="50">書寫、翻譯與註解</text>
            <text x="154" y="128">區域異文與增補</text>
            <text x="308" y="128">交叉校對重整</text>
            <text x="230" y="164" fill="#b7e3ca" font-size="11">雙向互動流程：整齊完整不等於更原始，集體校對也可維持穩定</text>
          </g>
        </svg>
      </div>
      <div class="controls js-only" role="group" aria-label="模擬不同傳承情境">
        <button type="button" data-txmode="whisper" aria-pressed="false">1. 單人耳語傳話</button>
        <button type="button" data-txmode="chorus" aria-pressed="false">2. 集體合誦校對</button>
        <button type="button" data-txmode="translate" aria-pressed="false">3. 跨語言翻譯轉換</button>
        <button type="button" data-txmode="expand" aria-pressed="false">4. 因應爭議編輯增補</button>
        <button type="button" id="s09-reset">重設沙盒</button>
      </div>
      <p id="s09-out" class="result" role="status" aria-live="polite">請選擇上方情境，比較「集體穩定保存」與「邊緣異文增刪」（示範模擬，非歷史機率）。</p>
    </div>
    <div class="table-wrap"><table role="table"><caption>影響佛教傳承真實性的十一個主要因素（對應原表 T02）</caption><thead><tr><th>影響因素</th><th>可能造成的結果</th></tr></thead><tbody>
      <tr><th data-label="影響因素">長期口耳相傳</th><td data-label="可能造成的結果">遺漏、記憶偏差、內容擴寫（整齊亦可能源於後期模板化編集）</td></tr>
      <tr><th data-label="影響因素">語言與文字轉換</th><td data-label="可能造成的結果">原始概念被重新解釋</td></tr>
      <tr><th data-label="影響因素">宗派競爭</th><td data-label="可能造成的結果">新增支持自身立場的教義；消失派別僅剩對手描述</td></tr>
      <tr><th data-label="影響因素">政治權力介入</th><td data-label="可能造成的結果">選擇性保存、禁止或改造經典</td></tr>
      <tr><th data-label="影響因素">戰爭與宗教迫害</th><td data-label="可能造成的結果">寺院、文獻與傳承者消失</td></tr>
      <tr><th data-label="影響因素">經濟與生存需求</th><td data-label="可能造成的結果">宗教儀式、祈福與喪葬服務增加</td></tr>
      <tr><th data-label="影響因素">地方文化融合</th><td data-label="可能造成的結果">吸收當地神祇、習俗與價值觀</td></tr>
      <tr><th data-label="影響因素">性別與社會階級</th><td data-label="可能造成的結果">教義及出家制度受到社會結構影響</td></tr>
      <tr><th data-label="影響因素">祖師權威與正統競爭</th><td data-label="可能造成的結果">建構祖師世系、追溯神聖來源</td></tr>
      <tr><th data-label="影響因素">後世抄寫與編輯</th><td data-label="可能造成的結果">註解混入正文、不同版本合併</td></tr>
      <tr><th data-label="影響因素">殖民與現代化</th><td data-label="可能造成的結果">佛教被重新包裝成哲學、科學或民族文化</td></tr>
    </tbody></table></div>
    <aside class="note"><b>存活者偏差</b><p>假設十個傳承中只有兩個經歷戰亂和淘汰存活下來，後人不能反推「原來只有這兩派」。這是歷史推論原則，無法給出具體淘汰比例。</p></aside>
    <nav class="station-nav" aria-label="站點 9 導覽"><p class="small">目前第 9／22 站</p><div class="button-row"><a class="button secondary" href="#menu">↑ 四幕目錄</a><a class="button secondary" href="#evidence">← 上一站</a><a class="button secondary" href="./history-research.html#oral-transmission">研究詳頁</a><a class="button" href="#history">下一站 →</a></div></nav>
  </div></section>`,

  // S10
  `<section id="history" class="chapter" data-station="10" tabindex="-1"><div class="container">
    <div class="kicker">第 10 站 · 從印度到世界各地</div>
    <h2>把時間拉到兩千多年</h2>
    <p>歷史上的喬達摩大約活動於西元前5世紀，但從佛陀入滅到阿育王石刻（前3世紀中葉）之間相隔約一個半世紀，是史料最薄弱的斷層。這裡整合現代學術約略年代（不採單一宗派佛曆，且各地區發展不同步）、佛陀生平證據評估，以及歷次結集的不同記載。<a class="src" href="./history-research.html#c10-001">歷史佛陀（C10-001）</a> <a class="src" href="./history-research.html#c10-002">十二時期（C10-002）</a> <a class="src" href="./history-research.html#c10-003">結集分析（C10-003）</a></p>
    <div class="play">
      <span class="kicker">互動歷史地圖與 12 時期時間滑桿（示意地理定位，不代表現代或古代精確國界）</span>
      <h3>拖動或點按切換 12 個歷史時期</h3>
      <div class="map-box">
        <svg viewBox="0 0 460 260" role="img" aria-labelledby="s10-map-t s10-map-d">
          <title id="s10-map-t">佛教跨區域歷史發展示意定位圖</title>
          <desc id="s10-map-d">簡化亞洲地理輪廓標示大犍陀羅、北印度、斯里蘭卡、東南亞、西藏、中國內地及日韓臺灣相對定位，僅供教學定位，非精確政治疆界。</desc>
          <rect width="460" height="260" rx="14" fill="#173832"/>
          <!-- Simplified landmass shapes (India, Himalayas/Tibet, East Asia, Mainland SE Asia, Sri Lanka, Japan, Taiwan) -->
          <path d="M80 70 Q135 55 185 85 L220 120 L195 190 L165 215 L140 165 L100 125 Z" fill="#2c5950" stroke="#7a9186" stroke-width="1.5"/>
          <path d="M185 85 Q245 70 300 80 L365 95 L355 160 L300 170 L250 140 Z" fill="#274e46" stroke="#7a9186" stroke-width="1.5"/>
          <path d="M245 145 L295 165 L290 218 L255 210 L240 175 Z" fill="#2c5950" stroke="#7a9186" stroke-width="1.5"/>
          <ellipse cx="195" cy="216" rx="10" ry="12" fill="#3b6e63" stroke="#9fe0bd" stroke-width="1.5"/>
          <path d="M385 110 Q398 115 392 140" fill="none" stroke="#3b6e63" stroke-width="6" stroke-linecap="round"/>
          <ellipse cx="366" cy="166" rx="6" ry="11" fill="#3b6e63" stroke="#9fe0bd" stroke-width="1.5"/>
          <g fill="#c6cec3" font-size="10">
            <text x="115" y="106">犍陀羅</text>
            <text x="172" y="138">北印/摩揭陀</text>
            <text x="232" y="220" text-anchor="middle">斯里蘭卡</text>
            <text x="248" y="118">西藏/喜馬拉雅</text>
            <text x="322" y="122">漢地</text>
            <text x="268" y="198">東南亞</text>
            <text x="415" y="128">日本</text>
            <text x="385" y="170">臺灣</text>
          </g>
          <circle id="s10-map-dot" cx="185" cy="145" r="10" fill="#ecc98e" stroke="#14171a" stroke-width="3"/>
          <text id="s10-map-label" x="185" y="130" text-anchor="middle" fill="#ffd48b" font-size="12" font-weight="800">前600–400</text>
          <text x="230" y="252" text-anchor="middle" fill="#9fe0bd" font-size="10">示意定位點，不表示確切國界或單線傳播箭頭</text>
        </svg>
      </div>
      <label class="js-only" for="s10-slider"><b>選擇時期滑桿（第 1 至 12 期）</b></label>
      <input class="js-only" id="s10-slider" type="range" min="0" max="11" value="0">
      <div class="controls js-only">
        <button type="button" id="s10-prev">← 上一時期</button>
        <button type="button" id="s10-next">下一時期 →</button>
      </div>
      <div class="tab-row js-only" role="group" aria-label="快速選取時期">
        <button type="button" data-era="0" aria-pressed="true">前600–400</button>
        <button type="button" data-era="2" aria-pressed="false">前268–232阿育王</button>
        <button type="button" data-era="4" aria-pressed="false">前100–後200手稿</button>
        <button type="button" data-era="7" aria-pressed="false">500–1000密教唐宋</button>
        <button type="button" data-era="11" aria-pressed="false">1900至今</button>
      </div>
      <div class="result" role="status" aria-live="polite">
        <strong id="s10-time">前600–400（第 1／12 期）</strong>
        <p id="s10-title" style="margin:4px 0">沙門運動與歷史佛陀｜地區：恒河中游（今北印／尼泊爾南）</p>
        <p id="s10-info" class="small" style="margin:0">史料可信：高；生平細節未定 — 喬達摩在多元沙門競爭環境中教導；佛滅確切年份仍有約前5世紀區間爭議。</p>
      </div>
    </div>
    <h3>一、歷史上的釋迦牟尼：究竟知道多少？（對應原表 T04）</h3>
    <div class="table-wrap"><table role="table"><caption>流傳說法 · 歷史證據評估（Bechert / Gombrich 等指出佛滅約在西元前5世紀，約前405說尚無單一共識）</caption><thead><tr><th>流傳說法</th><th>歷史證據評估</th></tr></thead><tbody>
      <tr><th data-label="流傳說法">曾有一位稱為喬達摩的修行導師</th><td data-label="歷史證據評估">高</td></tr>
      <tr><th data-label="流傳說法">活動於古印度北部及今尼泊爾南部一帶</th><td data-label="歷史證據評估">高</td></tr>
      <tr><th data-label="流傳說法">建立修行者團體並傳授解脫方法</th><td data-label="歷史證據評估">高</td></tr>
      <tr><th data-label="流傳說法">出身具有一定社會地位的釋迦族</th><td data-label="歷史證據評估">中高</td></tr>
      <tr><th data-label="流傳說法">是現代人理解的王國王子</th><td data-label="歷史證據評估">中低（可能有後世王室化描寫）</td></tr>
      <tr><th data-label="流傳說法">29歲出家、35歲成道、80歲入滅</th><td data-label="歷史證據評估">傳統記載，精確年齡未獲獨立證實</td></tr>
      <tr><th data-label="流傳說法">出生時走七步並宣告天上天下唯我獨尊</th><td data-label="歷史證據評估">無獨立歷史證據</td></tr>
      <tr><th data-label="流傳說法">菩提樹下遭遇魔王及超自然事件</th><td data-label="歷史證據評估">歷史方法無法驗證</td></tr>
      <tr><th data-label="流傳說法">具有宿命通、天眼通等神通</th><td data-label="歷史證據評估">歷史方法無法驗證</td></tr>
      <tr><th data-label="流傳說法">後世佛傳的全部對話及事件</th><td data-label="歷史證據評估">不可直接當成逐字史實</td></tr>
    </tbody></table></div>
    <h3>二、佛教歷史十二時期全表（對應原表 T03）</h3>
    <div class="table-wrap"><table role="table"><caption>時期 · 主要歷史發展 · 史料可信程度</caption><thead><tr><th>時期</th><th>主要歷史發展</th><th>史料可信程度</th></tr></thead><tbody>
      <tr><th data-label="時期">西元前600～400年</th><td data-label="主要歷史發展">古印度沙門運動興起，釋迦牟尼活動於此環境</td><td data-label="史料可信程度">高；個人生平細節較低</td></tr>
      <tr><th data-label="時期">西元前400～300年</th><td data-label="主要歷史發展">佛陀入滅後，僧團口傳、戒律爭議與早期分化</td><td data-label="史料可信程度">中</td></tr>
      <tr><th data-label="時期">西元前268～232年左右</th><td data-label="主要歷史發展">阿育王統治，佛教獲得強大政治支持</td><td data-label="史料可信程度">極高</td></tr>
      <tr><th data-label="時期">西元前300～100年</th><td data-label="主要歷史發展">部派佛教逐漸發展，各自傳承經律</td><td data-label="史料可信程度">高</td></tr>
      <tr><th data-label="時期">西元前100～西元200年</th><td data-label="主要歷史發展">早期佛教手稿、大乘經典逐漸出現</td><td data-label="史料可信程度">高</td></tr>
      <tr><th data-label="時期">西元100～500年</th><td data-label="主要歷史發展">大乘思想、般若、中觀、瑜伽行派逐漸發展</td><td data-label="史料可信程度">高</td></tr>
      <tr><th data-label="時期">西元100～600年</th><td data-label="主要歷史發展">佛教廣泛進入中國、中亞、朝鮮、日本</td><td data-label="史料可信程度">高</td></tr>
      <tr><th data-label="時期">西元500～1000年</th><td data-label="主要歷史發展">印度密教發展，漢地宗派與藏傳佛教成形</td><td data-label="史料可信程度">高</td></tr>
      <tr><th data-label="時期">西元1000～1300年</th><td data-label="主要歷史發展">印度大型寺院衰退；斯里蘭卡僧團重整</td><td data-label="史料可信程度">高</td></tr>
      <tr><th data-label="時期">西元1200～1600年</th><td data-label="主要歷史發展">上座部佛教在東南亞多地確立主流地位</td><td data-label="史料可信程度">高</td></tr>
      <tr><th data-label="時期">西元1600～1900年</th><td data-label="主要歷史發展">國家宗教制度、殖民統治、宗派改革</td><td data-label="史料可信程度">極高</td></tr>
      <tr><th data-label="時期">西元1900年至今</th><td data-label="主要歷史發展">佛教現代化、人間佛教、全球禪修與心理學化</td><td data-label="史料可信程度">極高</td></tr>
    </tbody></table></div>
    <h3>三、歷次佛教結集可靠嗎？（對應原表 T05）</h3>
    <div class="table-wrap"><table role="table"><caption>結集 · 傳統敘述 · 歷史學評估</caption><thead><tr><th>結集</th><th>傳統敘述</th><th>歷史學評估</th></tr></thead><tbody>
      <tr><th data-label="結集">第一次結集</th><td data-label="傳統敘述">佛滅後500阿羅漢共同背誦經律</td><td data-label="歷史學評估">多部律藏共有集體傳誦記憶，但1974年結集史研究等對會議細節與完整經藏當時完成之說高度存疑</td></tr>
      <tr><th data-label="結集">第二次結集</th><td data-label="傳統敘述">約百年後因戒律問題召開會議</td><td data-label="歷史學評估">具較強歷史基礎，但是否直接造成第一次部派分裂仍有爭議</td></tr>
      <tr><th data-label="結集">第三次結集</th><td data-label="傳統敘述">阿育王支持僧團清除異端（主要據南傳史書記載）</td><td data-label="歷史學評估">王權介入僧團秩序有碑銘支持；南傳《善見律》會議細節非所有部派共認，欠獨立佐證</td></tr>
      <tr><th data-label="結集">第四次結集</th><td data-label="傳統敘述">完成經典書寫或論藏整理</td><td data-label="歷史學評估">南傳斯里蘭卡與北傳迦膩色伽王所稱第四次結集實屬不同事件，不可混談</td></tr>
    </tbody></table></div>
    <nav class="station-nav" aria-label="站點 10 導覽"><p class="small">目前第 10／22 站</p><div class="button-row"><a class="button secondary" href="#menu">↑ 四幕目錄</a><a class="button secondary" href="#transmission">← 上一站</a><a class="button secondary" href="./history-research.html#chronology">研究詳頁</a><a class="button" href="#branches">下一站 →</a></div></nav>
  </div></section>`,

  // S11
  `<section id="branches" class="chapter" data-station="11" tabindex="-1"><div class="container">
    <div class="kicker">第 11 站 · 部派、核心思想與三大傳承</div>
    <h2>不同傳承保存了什麼？</h2>
    <p>佛教不是從一開始就「一分為二或分成十八個整齊分支」。南傳《島史》把根本分裂歸因於毘舍離十事非法、說一切有部歸因於「大天五事」、《舍利弗問經》歸因於戒律增廣；Nattier 與 Prebish（1977）指出根本分裂早於阿育王（約佛滅116年前後）且偏重戒律實務分歧。更重要的是：今天的上座部不等於古代全部上座系，大乘也不是由大眾部單線分出的單一宗派。<a class="src" href="./history-research.html#c11-001">部派分裂（C11-001）</a> <a class="src" href="./history-research.html#c11-002">早期核心與無我（C11-002）</a> <a class="src" href="./history-research.html#c11-003">轉法輪／緣起對讀（C11-003）</a></p>
    <div class="play">
      <span class="kicker">交織河道網絡示意（V01 升級，非單一血統樹狀分家）</span>
      <h3>點按不同分支，看它們各自保存了什麼與面臨的限制</h3>
      <div class="scene" style="margin:10px 0">
        <svg viewBox="0 0 460 220" role="img" aria-labelledby="s11-v01-t s11-v01-d">
          <title id="s11-v01-t">佛教傳承交織河道關係示意</title>
          <desc id="s11-v01-d">顯示歷史佛陀與早期僧團分化為上座系、大眾系及其他部派，再以實線與虛線交互演變為南傳、東亞與藏傳佛教，虛線表示歷史不確定或跨區交流。</desc>
          <rect width="460" height="220" rx="14" fill="#173832"/>
          <g fill="#224a42" stroke="#9fe0bd" stroke-width="2">
            <rect x="145" y="10" width="170" height="34" rx="8"/>
            <rect x="20" y="68" width="124" height="34" rx="7"/>
            <rect x="168" y="68" width="124" height="34" rx="7"/>
            <rect x="316" y="68" width="124" height="34" rx="7"/>
            <rect x="20" y="148" width="124" height="40" rx="8" stroke="#ecc98e"/>
            <rect x="168" y="148" width="124" height="40" rx="8" stroke="#ecc98e"/>
            <rect x="316" y="148" width="124" height="40" rx="8" stroke="#ecc98e"/>
          </g>
          <path d="M230 44 V56 M82 56 H378 M82 56 V68 M230 56 V68 M378 56 V68" stroke="#9fe0bd" stroke-width="2" fill="none"/>
          <path d="M82 102 V148 M230 102 V148 M378 102 V148" stroke="#ecc98e" stroke-width="2" stroke-dasharray="5 3" fill="none"/>
          <path d="M82 125 H378" stroke="#c6cec3" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/>
          <g fill="#f8f5ee" font-size="11.5" text-anchor="middle" font-weight="700">
            <text x="230" y="31">歷史佛陀與早期口傳僧團</text>
            <text x="82" y="89">上座系諸部派</text>
            <text x="230" y="89">法藏/有部等其他部派</text>
            <text x="378" y="89">大眾系諸部派</text>
            <text x="82" y="172">南傳上座部</text>
            <text x="230" y="172">東亞佛教（大乘）</text>
            <text x="378" y="172">藏傳與密教</text>
            <text x="230" y="208" fill="#b7e3ca" font-size="10.5">實線＝制度傳承延續；虛線＝多派交織、跨傳承交流與未定史實（非逐代血統圖）</text>
          </g>
        </svg>
      </div>
      <div class="tab-row js-only" role="group" aria-label="傳統分支說明">
        <button type="button" data-trad="south" aria-pressed="true">南傳上座部</button>
        <button type="button" data-trad="east" aria-pressed="false">漢傳／東亞佛教</button>
        <button type="button" data-trad="tibet" aria-pressed="false">藏傳佛教</button>
        <button type="button" data-trad="lost" aria-pressed="false">已消失古部派</button>
      </div>
      <p id="s11-trad-out" class="result" role="status" aria-live="polite">南傳上座部：保存巴利尼柯耶與上座部律，但經12世紀統合與18世紀傳戒重建，非完全等同古代全體上座系。</p>
    </div>
    <h3>一、七大古部派歷史特色（對應原表 T08）</h3>
    <div class="table-wrap"><table role="table"><caption>古部派 · 主要歷史特色</caption><thead><tr><th>部派</th><th>主要歷史特色</th></tr></thead><tbody>
      <tr><th data-label="部派">大眾部</th><td data-label="主要歷史特色">部分支系發展出較超越人間的佛陀觀</td></tr>
      <tr><th data-label="部派">說一切有部</th><td data-label="主要歷史特色">對時間、存在及現象分類提出高度系統化的理論</td></tr>
      <tr><th data-label="部派">經量部</th><td data-label="主要歷史特色">重視經典，相對批判部分論藏理論</td></tr>
      <tr><th data-label="部派">犢子部及相關部派</th><td data-label="主要歷史特色">探討無我與人格延續之間的哲學問題</td></tr>
      <tr><th data-label="部派">法藏部</th><td data-label="主要歷史特色">其戒律傳承對今日漢傳佛教具有重要影響（四分律）</td></tr>
      <tr><th data-label="部派">南傳上座部</th><td data-label="主要歷史特色">保存完整巴利三藏及自身的註釋傳統</td></tr>
      <tr><th data-label="部派">根本說一切有部</th><td data-label="主要歷史特色">其戒律成為藏傳佛教的重要制度基礎</td></tr>
    </tbody></table></div>
    <h3>二、跨語文檢驗：十二項早期核心思想與《無我相經》（對應原表 T06）</h3>
    <div class="play">
      <span class="kicker">五語無我材料切換（實證邊界誠實標示，不以AI翻譯充數）</span>
      <div class="tab-row js-only" role="group" aria-label="選擇無我相經語本">
        <button type="button" data-lang5="pli" aria-pressed="true">巴利 SN 22.59</button>
        <button type="button" data-lang5="lzh" aria-pressed="false">漢譯 SA 34</button>
        <button type="button" data-lang5="pgd" aria-pressed="false">犍陀羅 Senior 22</button>
        <button type="button" data-lang5="san" aria-pressed="false">梵文平行線索</button>
        <button type="button" data-lang5="xct" aria-pressed="false">藏文平行狀況</button>
      </div>
      <p id="s11-lang5-out" class="result" role="status" aria-live="polite">【巴利文 SN 22.59（已完整核對）】Rūpaṁ, bhikkhave, anattā... ‘netaṁ mama, nesohamasmi, na meso attā’ti（色非我…這不是我、非我所）。</p>
    </div>
    <div class="table-wrap"><table role="table"><caption>十二項早期思想可信度與白話解釋（原表 T06；古老共同記載不證明科學證實來世）</caption><thead><tr><th>教義或修行內容</th><th>屬於早期佛教可信程度</th><th>白話解釋</th></tr></thead><tbody>
      <tr><th data-label="教義或修行內容">苦、集、滅、道（四諦）</th><td data-label="屬於早期佛教可信程度">高</td><td data-label="白話解釋">認識痛苦、找出成因、理解解除痛苦的可能與方法</td></tr>
      <tr><th data-label="教義或修行內容">八正道</th><td data-label="屬於早期佛教可信程度">高</td><td data-label="白話解釋">從認知、言行、生活方式及精神訓練著手</td></tr>
      <tr><th data-label="教義或修行內容">無常</th><td data-label="屬於早期佛教可信程度">高</td><td data-label="白話解釋">一切有條件形成的事物都在變化</td></tr>
      <tr><th data-label="教義或修行內容">無我</th><td data-label="屬於早期佛教可信程度">高</td><td data-label="白話解釋">不將身心經驗執著為永恆、不變且可完全控制的自我</td></tr>
      <tr><th data-label="教義或修行內容">緣起</th><td data-label="屬於早期佛教可信程度">高</td><td data-label="白話解釋">現象依賴條件形成，而非完全獨立存在</td></tr>
      <tr><th data-label="教義或修行內容">五蘊</th><td data-label="屬於早期佛教可信程度">高</td><td data-label="白話解釋">透過身體、感受、辨識、心理活動與識分析經驗</td></tr>
      <tr><th data-label="教義或修行內容">戒律與倫理</th><td data-label="屬於早期佛教可信程度">高</td><td data-label="白話解釋">約束傷害他人的行為及不善的生活方式</td></tr>
      <tr><th data-label="教義或修行內容">禪定與正念</th><td data-label="屬於早期佛教可信程度">高</td><td data-label="白話解釋">訓練注意力、覺察與心的穩定</td></tr>
      <tr><th data-label="教義或修行內容">貪、瞋、癡</th><td data-label="屬於早期佛教可信程度">高</td><td data-label="白話解釋">欲望執著、敵意與錯誤認知是重要痛苦來源</td></tr>
      <tr><th data-label="教義或修行內容">業力、輪迴</th><td data-label="屬於早期佛教可信程度">高</td><td data-label="白話解釋">早期教義已存在，但超越死亡的真實性非歷史學或現代科學能驗證</td></tr>
      <tr><th data-label="教義或修行內容">涅槃與解脫</th><td data-label="屬於早期佛教可信程度">高</td><td data-label="白話解釋">佛教早期的核心修行目標</td></tr>
      <tr><th data-label="教義或修行內容">完整阿毘達磨理論體系</th><td data-label="屬於早期佛教可信程度">較晚形成</td><td data-label="白話解釋">對早期思想進一步分類、系統化與哲學分析</td></tr>
    </tbody></table></div>
    <h3>三、三大佛教傳承十項交叉比較（對應原表 T22，逐列完整）</h3>
    <div class="table-wrap"><table role="table"><caption>比較項目 · 南傳上座部 · 漢傳佛教 · 藏傳佛教（各傳承內部仍有差異）</caption><thead><tr><th>比較項目</th><th>南傳上座部</th><th>漢傳佛教</th><th>藏傳佛教</th></tr></thead><tbody>
      <tr><th data-label="比較項目">早期經典保存</th><td data-label="南傳上座部">完整巴利經藏</td><td data-label="漢傳佛教">保存重要阿含經及其他早期文獻</td><td data-label="藏傳佛教">保存部分早期經律及其他印度文獻</td></tr>
      <tr><th data-label="比較項目">主要戒律來源</th><td data-label="南傳上座部">上座部律藏</td><td data-label="漢傳佛教">法藏部四分律</td><td data-label="藏傳佛教">根本說一切有部律</td></tr>
      <tr><th data-label="比較項目">後世哲學發展</th><td data-label="南傳上座部">阿毘達磨及註釋傳統</td><td data-label="漢傳佛教">中觀、唯識、天台、華嚴等</td><td data-label="藏傳佛教">中觀、唯識、密教及論辯傳統</td></tr>
      <tr><th data-label="比較項目">地方文化融合</th><td data-label="南傳上座部">南亞及東南亞文化</td><td data-label="漢傳佛教">儒家、道教與地方信仰</td><td data-label="藏傳佛教">西藏及喜馬拉雅地區文化</td></tr>
      <tr><th data-label="比較項目">政治干預</th><td data-label="南傳上座部">王室僧團改革、殖民與國家制度</td><td data-label="漢傳佛教">皇帝支持、滅佛、國家管理</td><td data-label="藏傳佛教">王室支持、宗派政治及政教制度</td></tr>
      <tr><th data-label="比較項目">傳承中斷及重建</th><td data-label="南傳上座部">有</td><td data-label="漢傳佛教">有</td><td data-label="藏傳佛教">有</td></tr>
      <tr><th data-label="比較項目">後世編纂與註釋</th><td data-label="南傳上座部">有</td><td data-label="漢傳佛教">有</td><td data-label="藏傳佛教">有</td></tr>
      <tr><th data-label="比較項目">祖師權威與傳承敘事</th><td data-label="南傳上座部">有</td><td data-label="漢傳佛教">有</td><td data-label="藏傳佛教">有</td></tr>
      <tr><th data-label="比較項目">宗教儀式與民間信仰</th><td data-label="南傳上座部">有</td><td data-label="漢傳佛教">有</td><td data-label="藏傳佛教">有</td></tr>
      <tr><th data-label="比較項目">能證明完整保存佛陀原始教導</th><td data-label="南傳上座部">無法</td><td data-label="漢傳佛教">無法</td><td data-label="藏傳佛教">無法</td></tr>
    </tbody></table></div>
    <nav class="station-nav" aria-label="站點 11 導覽"><p class="small">目前第 11／22 站</p><div class="button-row"><a class="button secondary" href="#menu">↑ 四幕目錄</a><a class="button secondary" href="#history">← 上一站</a><a class="button secondary" href="./history-research.html#traditions-comparison">研究詳頁</a><a class="button" href="#south">下一站 →</a></div></nav>
  </div></section>`,

  // S12
  `<section id="south" class="chapter" data-station="12" tabindex="-1"><div class="container">
    <div class="kicker">第 12 站 · 斯里蘭卡三座大寺與近代戒脈</div>
    <h2>南傳也經過重整</h2>
    <p>許多人以為南傳上座部兩千五百年來完全沒有改變，但「經典早年保存」與「現行宗派制度」必須分開。古代斯里蘭卡至少並存大寺、無畏山寺與祇陀林寺三大僧團中心；12世紀王權統合後大寺派才取得主導；18世紀中期斯里蘭卡具足戒更曾斷絕，須迎請暹羅與緬甸重新傳戒。<a class="src" href="./history-research.html#c12-001">南傳制度重整（C12-001）</a> <a class="src" href="./history-research.html#c12-004">固都陶 729 碑（C12-004）</a> <a class="src" href="#s-gethin">來源索引</a></p>
    <div class="grid">
      <article class="card-box">
        <span class="tag">考古遺址實景 · IMG03</span>
        <h3>無畏山寺大塔（Abhayagiri）</h3>
        <img src="assets/history/evidence/img03-abhayagiri.jpg" width="900" height="496" loading="lazy" alt="斯里蘭卡阿努拉德普勒無畏山寺磚造大塔與石柱遺址照片" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">攝於2016（Nicolas Chadeville, CC BY 4.0）。曾接納大乘與多元思想，12世紀統合後失去獨立機構地位（當代外觀含近代修復）。</p>
      </article>
      <article class="card-box">
        <span class="tag">考古遺址實景 · IMG04</span>
        <h3>祇陀林寺大塔（Jetavanaramaya）</h3>
        <img src="assets/history/evidence/img04-jetavanaramaya.jpg" width="900" height="602" loading="lazy" alt="夜間燈光映照下的斯里蘭卡祇陀林寺大型磚造佛塔與前方遺址石柱" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">攝於2018（Nipuna Gamage, CC BY-SA 4.0）。反映古代斯里蘭卡僧團多元並立格局。</p>
      </article>
    </div>
    <div class="table-wrap"><table role="table"><caption>古代斯里蘭卡三重要僧團中心（對應原表 T09）</caption><thead><tr><th>僧團</th><th>歷史特色</th></tr></thead><tbody>
      <tr><th data-label="僧團">大寺派（Mahāvihāra）</th><td data-label="歷史特色">5世紀覺音整理義註《清淨道論》，12世紀波羅迦羅摩跋訶一世統合後成為現代上座部主要制度與文獻來源</td></tr>
      <tr><th data-label="僧團">無畏山寺派（Abhayagiri）</th><td data-label="歷史特色">曾經接觸及接受較多不同佛教思想與修行傳統；Max Deeg (2024) 指出其歷史常被大寺編年史遮蔽</td></tr>
      <tr><th data-label="僧團">祇陀林寺派（Jetavana）</th><td data-label="歷史特色">具有自身的僧團及思想傳承，12世紀統合後不再獨立</td></tr>
    </tbody></table></div>
    <div class="play">
      <span class="kicker">制度重整與傳戒接力探索</span>
      <h3>點按觀察南傳近代歷史關鍵轉折</h3>
      <div class="tab-row js-only" role="group" aria-label="南傳重整節點">
        <button type="button" data-south="maha" aria-pressed="true">大寺與覺音（5–12世紀）</button>
        <button type="button" data-south="abhaya" aria-pressed="false">無畏山寺史料</button>
        <button type="button" data-south="jeta" aria-pressed="false">祇陀林寺派</button>
        <button type="button" data-south="relay1753" aria-pressed="false">1753 暹羅傳戒與種姓</button>
        <button type="button" data-south="kuthodaw" aria-pressed="false">固都陶 729 碑與泰國 1902 法</button>
      </div>
      <p id="s12-out" class="result" role="status" aria-live="polite">【大寺派（Mahāvihāra）】保存巴利三藏與覺音（約5世紀）《清淨道論》義註傳統，12世紀（約1165）在王權支持下取得主導。</p>
    </div>
    <div class="card-box" style="margin-top:14px">
      <span class="tag">歷史實物 · 緬甸固都陶碑林</span>
      <h3>敏東王 729 塊巴利三藏經文石碑（1860–1868 刻成、1871 第五次結集）</h3>
      <img src="assets/history/evidence/extra-kuthodaw-slab.jpg" width="800" height="1067" loading="lazy" alt="緬甸固都陶碑林白色小塔內直立刻滿緬文拼寫巴利三藏經文的大理石碑" style="max-width:340px;width:100%;height:auto;border-radius:8px;margin:8px 0">
      <p class="small">攝於2006（Wagaung, CC BY-SA 3.0）。UNESCO 世界記憶列 729 塊經文大理石碑（不含另有說明碑；勿誤作 730 塊經文碑）。<a class="src" href="./history-research.html#c12-004">見詳頁校勘（C12-004）</a></p>
    </div>
    <aside class="note"><b>不能否定巴利經藏價值</b><p>制度歷經統合、戒脈斷絕重建與近代王室法制化（如泰國 1833 法宗派與 1902 僧團法），並不等於推翻巴利經藏保存大量早期核心文獻的學術價值。</p></aside>
    <nav class="station-nav" aria-label="站點 12 導覽"><p class="small">目前第 12／22 站 · 第二幕結束，可稍後繼續</p><div class="button-row"><a class="button secondary" href="#menu">↑ 四幕目錄</a><a class="button secondary" href="#branches">← 上一站</a><a class="button secondary" href="./history-research.html#theravada-history">研究詳頁</a><a class="button" href="#mahayana">進入第三幕 →</a></div></nav>
  </div></section>`
];
