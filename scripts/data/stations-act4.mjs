// Act 4 (Stations 19–22): Japan Time Machine, Women Relay Map, Taiwan Documentary & Final Detective Desk
import { ASIA_LAND_PATH, ASIA_LAKES_PATH, ASIA_PLACES } from "./asia-map-data.mjs";

const p = ASIA_PLACES;

export const ACT4_STATIONS = [
  // S19: Japan Temple Time Machine
  `<section id="japan" class="chapter theme-documentary" data-station="19" tabindex="-1"><div class="container">
    <div class="kicker">第 19 關 · 為什麼在日本看得到和尚結婚生小孩？</div>
    <h2>日本寺院的時光機</h2>
    <p class="story-lead">很多台灣觀光客去日本寺廟玩都會嚇一跳：那裡的住持竟然有太太小孩，甚至由兒子接著管這間廟！是不是日本佛教隨便改壞了古規矩？轉動時光門，看三個完全不同的年代怎麼走過來的。</p>

    <div class="play">
      <span class="kicker">寺院時光門 · 切換三個時代，看住持跟家裡的生活怎麼改變</span>
      <div class="story-stage">
        <div class="basin-hud">
          <div class="basin-vessel" style="padding:6px">
            <img src="assets/history/evidence/extra-kyoto-shinran.jpg" width="960" height="1280" loading="lazy" alt="日本京都六角堂頂法寺木造親鸞堂屋簷上的鬼瓦與「六」字紋飾實景照片" style="width:100%;max-height:280px;object-fit:cover;border-radius:8px;display:block">
            <p class="small" style="margin:6px 0 0">京都六角堂親鸞堂屋瓦實景</p>
          </div>
          <div>
            <p class="actor-badge" id="s19-era-badge">⏳ 時代一｜兩千多年前古印度</p>
            <h4 id="s19-era-title" style="margin:4px 0">離開家庭生活、靠大家一起守規矩</h4>
            <p id="s19-out" class="result" role="status" aria-live="polite">古印度出家人的理想是離開自己原本的家、不結婚、不靠血緣把廟傳給親生兒子，跟國王保持一點獨立距離。</p>
          </div>
        </div>
      </div>

      <div class="tab-row js-only" role="group" aria-label="切換三個日本制度時代">
        <button type="button" data-jpera="india" aria-pressed="true">1. 早年印度出家生活</button>
        <button type="button" data-jpera="medieval" aria-pressed="false">2. 13世紀親鸞與江戶戶籍制度</button>
        <button type="button" data-jpera="meiji" aria-pressed="false">3. 1872年明治政府解除禁令</button>
      </div>
    </div>

    <div class="story-takeaway">
      <h3>兩點一定要弄清楚：既不是所有日本和尚都這樣，也不是被迫結婚！</h3>
      <p>第一，早在明治時代數百年前，淨土真宗的開創者親鸞就已經公開成家了；而在江戶時代，政府規定每戶人家要向特定廟宇登記戶口（有點像戶政事務所兼辦喪禮）。第二，<strong>1872 年政府的法令只是把「和尚結婚吃肉會被抓去罰」的刑罰取消</strong>，並沒有強迫每個人都要結婚，當時各宗派也吵得很激烈——今天依然有一些嚴格單身的叢林寺院與尼眾。</p>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段日本史研究從哪裡來？</strong>取材自學者對明治宗教政策與親鸞傳統的歷史專書研究。</p>
      <a class="button secondary" href="./history-research.html#japan-institutions">看日本與古印度對照詳情與書目 →</a>
    </div>

    <nav class="station-nav" aria-label="第 19 關導覽"><p class="small">目前第 19／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#politics">← 上一關</a><a class="button" href="#women">下一關：女性出家的跨國接力 →</a></div></nav>
  </div></section>`,

  // S20: Cross-Regional Women Ordination Relay Map
  `<section id="women" class="chapter theme-atlas" data-station="20" tabindex="-1"><div class="container">
    <div class="kicker">第 20 關 · 為什麼有的國家有比丘尼，有的地方曾斷過又再接回來？</div>
    <h2>跨越海洋與高山的接力棒</h2>
    <p class="story-lead">早年經典明明記載過許多女性出家證悟的故事，但後來斯里蘭卡跟印度失傳了女眾大戒、只剩中國與韓國保存下來，甚至到了五世紀，斯里蘭卡法師還曾坐船到南京傳戒！點接力賽道上的各站看看！</p>

    <div class="play">
      <span class="kicker">跨亞洲接力地圖 · 點選四棒接力點，看這場跨越一千六百年的故事</span>
      <div class="atlas-stage">
        <svg viewBox="0 0 800 380" role="img" aria-labelledby="s20-map-t s20-map-d">
          <title id="s20-map-t">亞洲女眾受戒傳承接力真實地圖</title>
          <desc id="s20-map-d">以 Natural Earth 亞洲底圖標示斯里蘭卡（429/433年渡海出發點）、中國南京、現代印度菩提伽耶與 2022/2025 不丹授戒接力地點。</desc>
          <rect class="atlas-sea" width="800" height="380" rx="12"/>
          <g transform="translate(0,-65)">
            <path class="atlas-land" d="${ASIA_LAND_PATH}"/>
            <path class="atlas-lake" d="${ASIA_LAKES_PATH}"/>
          </g>
          <path d="M${p.anuradhapura[0]} ${p.anuradhapura[1]-65} Q390 310 ${p.nanjing[0]} ${p.nanjing[1]-65}" fill="none" stroke="#18594b" stroke-width="3" stroke-dasharray="7 5"/>
          <path d="M${p.nanjing[0]} ${p.nanjing[1]-65} Q360 110 ${p.bhutan[0]} ${p.bhutan[1]-65}" fill="none" stroke="#b36500" stroke-width="2.5" stroke-dasharray="6 5"/>
          <circle id="s20-baton" cx="${p.lumbini[0]}" cy="${p.lumbini[1]-65}" r="11" fill="#d97706" stroke="#fffdf7" stroke-width="3"/>
          <g font-size="11.5" font-weight="750" fill="#243330">
            <text x="${p.lumbini[0]-10}" y="${p.lumbini[1]-78}" text-anchor="end">早年古印度（女眾出家記載）</text>
            <text x="${p.anuradhapura[0]+10}" y="${p.anuradhapura[1]-60}">斯里蘭卡（出發渡海／後曾中斷）</text>
            <text x="${p.nanjing[0]+10}" y="${p.nanjing[1]-62}">南京（429／433年接收並保存到今）</text>
            <text x="${p.bhutan[0]+10}" y="${p.bhutan[1]-62}">不丹（2022・2025跨國授戒）</text>
          </g>
        </svg>
      </div>

      <div class="tab-row js-only" role="group" aria-label="切換接力站點">
        <button type="button" data-wrelay="early" aria-pressed="true">1. 早年印度與各派規矩不同</button>
        <button type="button" data-wrelay="nanjing" aria-pressed="false">2. 西元429／433年 斯里蘭卡→南京</button>
        <button type="button" data-wrelay="revival96" aria-pressed="false">3. 1996–1998 當代南傳跨國復戒</button>
        <button type="button" data-wrelay="bhutan" aria-pressed="false">4. 2022／2025 不丹大型授戒</button>
      </div>
      <p id="s20-relay-out" class="result" role="status" aria-live="polite">【早年記載與各派規矩】最早的經典記載女性出家一樣能修成大成就；至於要求尼眾從屬男眾的「八條特別規定」，研究各派古律的學者發現不同派別寫得不太一樣，可能有後來慢慢加進來的歷史痕跡。</p>

      <h4 style="margin-top:14px">目前各宗派對「斷了以後能不能靠別派重新恢復？」有兩種不同看法：</h4>
      <div class="tab-row js-only" role="group" aria-label="看雙方的理由">
        <button type="button" data-wview="open" aria-pressed="true">支持跨國跨派協力恢復的一方</button>
        <button type="button" data-wview="conserv" aria-pressed="false">強調照本派舊律條嚴守的一方</button>
      </div>
      <p id="s20-view-out" class="note" role="status" aria-live="polite">支持跨派別協力恢復的法師與學者指出：古戒本裡也曾記錄在特殊情況下彈性處理的方法，而且現存東亞法脈當年就是靠斯里蘭卡幫忙接起來的！</p>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段女性受戒歷史研究從哪裡來？</strong>我們兩邊理由都如實擺出來，不替任何宗教領袖投票判定誰才算數。</p>
      <a class="button secondary" href="./history-research.html#bhikkhuni-history">看各律藏異文、2025不丹人數與研究限制 →</a>
    </div>

    <nav class="station-nav" aria-label="第 20 關導覽"><p class="small">目前第 20／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#japan">← 上一關</a><a class="button" href="#modern">下一關：臺灣百年現場與現代佛教 →</a></div></nav>
  </div></section>`,

  // S21: Modern Buddhism Myths & Four Periods of Taiwan History
  `<section id="modern" class="chapter theme-documentary" data-station="21" tabindex="-1"><div class="container">
    <div class="kicker">第 21 關 · 走進現代都市與我們身邊的臺灣</div>
    <h2>你以為的佛教，其實只有一百年？</h2>
    <p class="story-lead">很多人說：「佛教其實是減壓心理學，不拜拜也不講鬼神，只靠打坐正念就好！」真的是這樣嗎？而今天在臺灣看到的廟會拜拜、大型佛教醫院、慈善志工跟禪修班，又是怎麼在這一兩百年慢慢長成這樣的？</p>

    <div class="play">
      <span class="kicker">迷思破解機 · 點點看四句常聽到的現代說法</span>
      <div class="tab-row js-only" role="group" aria-label="檢驗四句現代常見說法">
        <button type="button" data-modclaim="phil" aria-pressed="true">1.「只是哲學，不算宗教」</button>
        <button type="button" data-modclaim="science" aria-pressed="false">2.「全部早年教義都等於現代科學」</button>
        <button type="button" data-modclaim="mindfulness" aria-pressed="false">3.「學點正念呼吸就代表全部、零風險」</button>
        <button type="button" data-modclaim="charity" aria-pressed="false">4.「辦慈善就是自古唯一的樣子」</button>
      </div>
      <p id="s21-mod-out" class="result" role="status" aria-live="polite">把佛教講成純哲學或心理學，其實是近一百多年亞洲改革者面對西方科學跟殖民衝擊時，重新找出來的介紹方式——早年古書裡照樣有寫到諸天鬼神跟脫離生死的宗教追求。</p>
    </div>

    <div class="play">
      <span class="kicker">臺灣百年相簿 · 點四個時期，對應下面的真實老照片與現場照</span>
      <div class="tab-row js-only" role="group" aria-label="切換臺灣百年四時期">
        <button type="button" data-twera="qing" aria-pressed="true">1. 清朝末年（寺院跟民間一起拜）</button>
        <button type="button" data-twera="jp" aria-pressed="false">2. 日本時代（1895–1945）</button>
        <button type="button" data-twera="postwar" aria-pressed="false">3. 戰後重建與人間佛教</button>
        <button type="button" data-twera="modern" aria-pressed="false">4. 解嚴後慈善醫療與多元傳承</button>
      </div>
      <p id="s21-tw-out" class="result" role="status" aria-live="polite">【清代到近代早期】觀音菩薩、祖先祭祀跟地方神明常常同在一座廟裡（看下面約百年前的艋舺龍山寺老照片！）。</p>
    </div>

    <div class="grid">
      <article class="card-box">
        <span class="tag">百年老照片</span>
        <h4>艋舺龍山寺前水池（約1895–1922）</h4>
        <img src="assets/history/evidence/img09-longshan-1900s.jpg" width="960" height="730" loading="lazy" alt="約百年前臺北艋舺龍山寺與前方水池小舟的黑白歷史老照片" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">見證早期臺灣佛教與觀音、民間習俗交融的模樣。</p>
      </article>
      <article class="card-box">
        <span class="tag">歷史老照片</span>
        <h4>臺北西本願寺臺灣別院（約1932）</h4>
        <img src="assets/history/evidence/img10-honganji-1932.jpg" width="960" height="657" loading="lazy" alt="約1932年日治時期臺北西本願寺臺灣別院建築老照片" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">見證日治時期日本宗派傳進臺灣與近代佛學教育興起。</p>
      </article>
      <article class="card-box">
        <span class="tag">當代實景（說明：組織創於1967年）</span>
        <h4>高雄佛光山園區當代實景</h4>
        <img src="assets/history/evidence/img11-foguangshan.jpg" width="960" height="640" loading="lazy" alt="高雄佛光山八塔與園區當代建築照片" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">呈現戰後臺灣「人間佛教」走向公共社會的大規模機構實景（非 1945 年代初期老照片）。</p>
      </article>
      <article class="card-box">
        <span class="tag">當代公共醫療實景</span>
        <h4>臺北慈濟醫院外觀（2011）</h4>
        <img src="assets/history/evidence/img12-tzuchi-hospital.jpg" width="960" height="720" loading="lazy" alt="臺北慈濟醫院現代大樓外觀照片" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">展現當代臺灣佛教投入醫療與慈善服務的樣子（為保護大家隱私，特別拍建築外觀而不拍路人臉孔）。</p>
      </article>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段近現代與臺灣史從哪裡來？</strong>取材自近現代佛教主義與臺灣佛教歷史專書，並附上禪修心理安全的科學研究提醒（正念減壓不能取代看醫生！）。</p>
      <a class="button secondary" href="./history-research.html#buddhist-modernism">看現代正念研究限制與臺灣四期文獻 →</a>
    </div>

    <nav class="station-nav" aria-label="第 21 關導覽"><p class="small">目前第 21／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#women">← 上一關</a><a class="button" href="#lab">最後一關：歷史偵探結案工具台 →</a></div></nav>
  </div></section>`,

  // S22: Final Detective Desk, Five-Layer Model, Six Cautions & Clean Conclusion
  `<section id="lab" class="chapter theme-archive" data-station="22" tabindex="-1"><div class="container">
    <div class="kicker">第 22 關 · 把整座故事館的工具帶回家</div>
    <h2>下一次有人說「這是佛陀講的」……</h2>
    <p class="story-lead">逛完兩千五百年的線索，我們不需要全部相信、也不用一竿子打翻說全都假的！這張工作台讓你挑一個常聽到的說法，自己動手用偵探工具查一次——不計分、不上傳資料，純粹是讓你帶走的方法。</p>

    <div class="play" id="workbench">
      <span class="kicker">偵探工作台 · 選一個說法，照四個檢驗動作勾選並可複製筆記（只存在你這台電腦）</span>
      <label class="js-only" for="audit-case"><b>挑一句你想試查的話：</b>
        <select id="audit-case">
          <option value="">— 在心裡想任一句網路轉傳的句子，或點選下方題目 —</option>
          <option value="拈花微笑是否有早期文獻？">1. 「聽說靈山拈花微笑是佛陀當場發生的事？」</option>
          <option value="《伽藍經》是否叫人只相信自己？">2. 「網路說《伽藍經》就是只要自己喜歡就好？」</option>
          <option value="「佛陀說過」的網路語錄圖卡">3. 「朋友傳了一張『佛陀曾說…』的心靈圖卡！」</option>
        </select>
      </label>
      <div class="controls js-only">
        <button type="button" id="load-case">載入提示線索</button>
        <button type="button" id="copy-notes">複製純文字查證筆記</button>
        <button type="button" id="reset-audit">清空重選</button>
      </div>
      <p id="case-status" class="note" role="status" aria-live="polite">選題目後，試著順手點下面七個小確認動作。</p>

      <div class="checks" aria-label="七步檢查清單">
        <label><input type="checkbox" class="audit-check"><span><strong>1. 先問：最早是誰、在哪時代講的？</strong>（<a href="#four">第 01 關</a>）</span></label>
        <label><input type="checkbox" class="audit-check"><span><strong>2. 講得出哪部經嗎？</strong>（注意：在電腦網站找得到全文，不等於已經證明年代！）</span></label>
        <label><input type="checkbox" class="audit-check"><span><strong>3. 不同國家與語言版本寫一樣嗎？</strong>（<a href="#drum">第 02 關</a>、<a href="#kalama">第 04 關</a>）</span></label>
        <label><input type="checkbox" class="audit-check"><span><strong>4. 找不找得到真正古老的石頭刻字或樹皮古卷？</strong>（<a href="#evidence">第 08 關</a>）</span></label>
        <label><input type="checkbox" class="audit-check"><span><strong>5. 有沒有人提出不一樣的考證跟疑問？</strong>（<a href="#texts">第 14 關</a>）</span></label>
        <label><input type="checkbox" class="audit-check"><span><strong>6. 分清三件事：歷史事實、哲學有沒有道理、是不是宗教信仰。</strong>（<a href="#truth">第 07 關</a>）</span></label>
        <label><input type="checkbox" class="audit-check"><span><strong>7. 最後想：聽了這個做法會不會更貪、更愛罵人或逼人拿錢不要懷疑？找無資料就誠實說「目前還不知道」。</strong></span></label>
      </div>
      <p id="audit-status" class="result" role="status" aria-live="polite">目前進度：0／7（只是筆記進度，不是考試分數喔！）</p>
      <p id="copy-status" class="small" role="status" aria-live="polite"></p>
      <textarea id="notes-output" rows="8" hidden readonly aria-label="純文字查證筆記欄"></textarea>
    </div>

    <div class="play">
      <span class="kicker">像剝千層派一樣看懂今天的佛教（順序只是時間早晚，不是誰好誰壞、也不是比例）</span>
      <h3>切換每一層，看兩千五百年怎麼一層層疊起來</h3>
      <details class="layer-item" open>
        <summary>第一層｜歷史上的佛陀教導（約兩千五百年前）</summary>
        <p>從考古旁證和各地都有的古書核心，整理出的早期減苦思考與品行提醒；當年沒有錄音，只能抓出大方向。</p>
      </details>
      <details class="layer-item">
        <summary>第二層｜早年出家團體用嘴巴背誦跟分家（前4～前1世紀）</summary>
        <p>大家一起對詞背經留下骨架，但在印度各地傳開後，不同版本的文字漸漸有些差別。</p>
      </details>
      <details class="layer-item">
        <summary>第三層｜哲學整理、大乘與密教出現（西元前後起數百年）</summary>
        <p>把早年想法寫成有系統的哲學論書，同時在印度大寺裡長出大乘經典和後來的密續系統（並不是惡意捏造）。</p>
      </details>
      <details class="layer-item">
        <summary>第四層｜各地國王、文化跟戰火塑造的模樣（漢地・西藏・日本・東南亞）</summary>
        <p>中國朝廷印大藏經、全面吃素、日本後來取消不准和尚結婚的處罰、斯里蘭卡從泰國請僧人重新接續戒脈……歷史實實在在改變過樣貌。</p>
      </details>
      <details class="layer-item">
        <summary>第五層｜近一百年走進現代科學、減壓與臺灣社區</summary>
        <p>正念課程、人間佛教寺院和醫院志工，讓古老傳統用現代人聽得懂的方式繼續走進生活。</p>
      </details>
    </div>

    <div class="note">
      <h3>遇到哪六種話時，值得多停一秒再相信？</h3>
      <ol>
        <li>「全世界只有我們這一派是真的，其他派全部是錯的。」</li>
        <li>「這位老師一定有神通，所以他的話不准懷疑。」</li>
        <li>「這本書雖然一千多年後才出現，但一定是佛陀當年秘密講的。」</li>
        <li>「只要一直捐錢、繳費參加法會，就能保證消災或買到好下輩子。」</li>
        <li>「因為我宗教身分特別，所以不用理會一般做人道德或國家法律。」</li>
        <li>「問歷史來源或翻出不同證據來看就是沒信心、有罪過。」</li>
      </ol>
      <p class="small">提醒：遇到這些說法不一定代表對方一定是壞人；但只要牽涉叫你掏錢、放棄思考或只聽他一個人時，多花幾倍工夫查清楚是應該的。</p>
    </div>

    <div class="source-door">
      <p>📖 <strong>想看本站全部 42 組原始典籍書目、研究命題、證據強度與誠實限制？</strong>全部整理在專業研究與書目詳頁。</p>
      <a class="button secondary" href="./history-research.html">打開完整專業研究頁 →</a>
    </div>

    <nav class="station-nav" aria-label="終點站導覽"><p class="small">全部 22 關探索完成！</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館四幕地圖</a><a class="button secondary" href="#modern">← 上一關</a><a class="button secondary" href="./history-research.html">看完整專業研究頁</a><a class="button" href="#library">往下看 42 組古書與研究來源庫 ↓</a></div></nav>
  </div></section>`
];
