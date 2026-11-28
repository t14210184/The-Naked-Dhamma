// Act 3 (Stations 13–18): Mahāyāna, Text Detective, China Arrival, Chan Bookshelf, Tibet Map, Vanishing Libraries
import { ASIA_LAND_PATH, ASIA_LAKES_PATH, ASIA_PLACES } from "./asia-map-data.mjs";

const p = ASIA_PLACES;

export const ACT3_STATIONS = [
  // S13: The Growing Tree of Ideas
  `<section id="mahayana" class="chapter theme-atlas" data-station="13" tabindex="-1"><div class="container">
    <div class="kicker">第 13 關 · 大乘經典是從哪裡長出來的？</div>
    <h2>一棵不斷長出新枝葉的思想大樹</h2>
    <p class="story-lead">很多人曾經好奇：大乘佛教到底是「在家人造反創出來的新宗派」，還是後來的人把早期已經有的種子慢慢澆水養大的？兩千年前的古寫本跟近代研究給了一個很不一樣的答案。</p>

    <div class="play">
      <span class="kicker">思想發芽觀察器 · 點選九朵花，看它是早年就有種子，還是後來長大的枝葉</span>
      <div class="story-stage" style="padding:12px">
        <div class="drawer-bank">
          <div class="drawer-box is-active" id="s13-seed-box"><strong>🌱 早年已經找得到的種子</strong><p class="small" id="s13-seed-txt">早在各派都有的古經裡，就能看到對一切眾生溫柔、想離苦的心。</p></div>
          <div class="drawer-box" id="s13-bloom-box"><strong>🌸 後來慢慢展開的新枝葉</strong><p class="small" id="s13-bloom-txt">西元前後，在寺院裡寫作抄經的出家人把想法越發展越豐富（虛線＝很多條流派交錯，不是一條死板家譜）。</p></div>
        </div>
        <p id="s13-concept-out" class="speech-bubble">「對大家友善不害人（慈悲）」：這顆種子最早在跨傳承古書裡就已經有了！</p>
      </div>

      <div class="tab-row js-only" role="group" aria-label="點選九個常見大乘想法">
        <button type="button" data-mahac="compassion" aria-pressed="true">1. 溫柔待人（慈悲）</button>
        <button type="button" data-mahac="bodhisattva" aria-pressed="false">2. 想成佛幫大家（菩薩）</button>
        <button type="button" data-mahac="sunyata" aria-pressed="false">3. 一切都在變、沒有固定本體（空性）</button>
        <button type="button" data-mahac="paramita" aria-pressed="false">4. 六項日常修練</button>
        <button type="button" data-mahac="fields" aria-pressed="false">5. 其他世界也有佛</button>
        <button type="button" data-mahac="amitabha" aria-pressed="false">6. 阿彌陀佛淨土世界</button>
        <button type="button" data-mahac="tathagata" aria-pressed="false">7. 人人都有成佛潛力</button>
        <button type="button" data-mahac="yogacara" aria-pressed="false">8. 心如何認識世界</button>
        <button type="button" data-mahac="trikaya" aria-pressed="false">9. 佛的三種呈現方式</button>
      </div>

      <div class="controls js-only" role="group" aria-label="用哪一種角度問這是不是佛說">
        <button type="button" data-bvacana="hist" aria-pressed="true">問法一：歷史上當場親口說的嗎？</button>
        <button type="button" data-bvacana="trad" aria-pressed="false">問法二：信徒傳統裡認同的精神嗎？</button>
      </div>
      <p id="s13-bvacana-out" class="result" role="status" aria-live="polite">【歷史學問法】問的是公元前五世紀喬達摩有沒有親口說過這些成套理論。照歷史手邊看得到的證據，成熟的系統大多是數百年後才慢慢形成的。</p>
    </div>

    <div class="story-takeaway">
      <h3>兩件常被誤會的事，一次講清楚</h3>
      <p>第一，科學測年約西元 75 年左右的古樹皮經卷（在今天阿富汗／巴基斯坦北部一帶出土）證明，早期大乘經典確實在印度文化圈寫出來，<strong>不是</strong>中國人憑空編出來的。第二，近年研究也推翻了「大乘是普通在家信徒反抗出家人」的舊說——寫作跟保護這些早期經卷的，很多本身就是在傳統大寺院裡苦修打坐的出家人。</p>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段發現從哪裡來？</strong>取材自近年古寫本碳十四斷代與大乘起源學術研究。</p>
      <a class="button secondary" href="./history-research.html#mahayana-origins">看寫本測年範圍與學者論文 →</a>
    </div>

    <details class="story-more">
      <summary>想再多看一點：九項常見觀念跟早年想法的關係清單</summary>
      <div class="table-wrap"><table role="table"><caption>九種後來大家熟知的概念，早年有沒有基礎？</caption><thead><tr><th>概念</th><th>跟早年古書的關係</th></tr></thead><tbody>
        <tr><th data-label="概念">慈悲</th><td data-label="關係">早年古書本來就有</td></tr>
        <tr><th data-label="概念">菩薩</th><td data-label="關係">早年主要指佛陀還沒覺悟前的稱呼；大乘把它擴展成每個人都可以發願走的路</td></tr>
        <tr><th data-label="概念">空性</th><td data-label="關係">跟早年講的「無常、無我、彼此依賴而生」有關係，後來哲學分析變得很細</td></tr>
        <tr><th data-label="概念">六波羅蜜</th><td data-label="關係">布施、守規矩、忍耐等早年都有，六項排成一套是以後的整理</td></tr>
        <tr><th data-label="概念">十方有很多佛的世界</th><td data-label="關係">有早年線索，後來大大發揮想像與描寫</td></tr>
        <tr><th data-label="概念">西方極樂淨土</th><td data-label="關係">屬於後來發展成熟的淨土信仰系統</td></tr>
        <tr><th data-label="概念">人人都有佛性</th><td data-label="關係">較後期在印度開展的重要大乘思想</td></tr>
        <tr><th data-label="概念">唯識哲學</th><td data-label="關係">約西元四、五世紀慢慢整理出來的細膩心理哲學</td></tr>
        <tr><th data-label="概念">三身佛說法</th><td data-label="關係">後世哲學思考「佛陀到底是哪一種存在」的理論發展</td></tr>
      </tbody></table></div>
    </details>

    <nav class="station-nav" aria-label="第 13 關導覽"><p class="small">目前第 13／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#south">← 上一關</a><a class="button" href="#texts">下一關：古經身分鑑定所 →</a></div></nav>
  </div></section>`,

  // S14: Ancient Scripture ID Lab & Heart Sutra Side-by-Side
  `<section id="texts" class="chapter theme-archive" data-station="14" tabindex="-1"><div class="container">
    <div class="kicker">第 14 關 · 為什麼古人自己也在查「這部經誰寫的？」</div>
    <h2>古經身分證鑑定所</h2>
    <p class="story-lead">挑一本流傳下來的佛經，抽一張檔案線索出來看看——連古代中國的出家學者自己也早就編過書，專門區分哪些確實來自印度、哪些是在中國文化裡寫成、哪些還要打問號！</p>

    <div class="play">
      <span class="kicker">檔案櫃 1｜挑選 16 部有名佛典，一格格打開查證線索</span>
      <label class="js-only" for="s14-text-select"><b>想先查哪一部經典或書本？（共 16 部可選）</b></label>
      <select class="js-only" id="s14-text-select">
        <option value="nikaya">1. 巴利文四部早期大經集</option>
        <option value="agama">2. 中國保存的四阿含經</option>
        <option value="dhp">3. 法句經（好記的小短詩）</option>
        <option value="snp">4. 經集（早年偈頌集）</option>
        <option value="diamond">5. 金剛經</option>
        <option value="lotus">6. 法華經</option>
        <option value="avatamsaka">7. 華嚴經</option>
        <option value="amitabha">8. 阿彌陀經</option>
        <option value="sukh">9. 無量壽經</option>
        <option value="heart">10. 心經（只有兩百六十字卻爭議超大！）</option>
        <option value="surangama">11. 楞嚴經（注意不要跟另一部同名經搞混）</option>
        <option value="qixin">12. 大乘起信論</option>
        <option value="yulanpen">13. 盂蘭盆經（目連救母的故事）</option>
        <option value="fumu">14. 父母恩重難報經</option>
        <option value="platform">15. 六祖壇經</option>
        <option value="tantras">16. 密宗經典</option>
      </select>
      <div class="controls js-only">
        <button type="button" id="s14-next-clue">打開下一張線索卡</button>
        <button type="button" id="s14-all-clues">一次看全部線索</button>
        <button type="button" id="s14-reset-desk">換回第一張</button>
      </div>
      <div id="s14-desk-out" class="result" role="status" aria-live="polite">選好想看的書，點「打開下一張線索卡」！</div>
    </div>

    <div class="play" id="s14-parallel-box">
      <span class="kicker">特別對比桌｜大家最熟的《心經》，到底是從印度翻譯來，還是先在中國整理再翻成古印度文？</span>
      <h3>切換四段經文，直接看中國早年的《大品般若經》跟後來的《心經》有多像！</h3>
      <div class="tab-row js-only" role="group" aria-label="切換心經四段對照">
        <button type="button" data-heartseg="seg1" aria-pressed="true">1. 開頭「度一切苦厄」去哪了？</button>
        <button type="button" data-heartseg="seg2" aria-pressed="false">2. 「色即是空」這幾句</button>
        <button type="button" data-heartseg="seg3" aria-pressed="false">3. 「以無所得故」的小卡關</button>
        <button type="button" data-heartseg="seg4" aria-pressed="false">4. 結尾的咒語段落</button>
      </div>
      <div class="parallel-grid" role="region" aria-live="polite" aria-label="四個古本直接比對">
        <article class="parallel-card"><h4>早年《大品般若經》（404年譯）</h4><p id="s14-p-t223" class="small">這一大段裡面<strong>找不到</strong>「觀自在菩薩行深…度一切苦厄」這幾句開頭。</p></article>
        <article class="parallel-card"><h4>《摩訶般若大明咒經》（舊本）</h4><p id="s14-p-t250" class="small">寫作「觀世音菩薩…照見五陰空，<strong>度一切苦厄</strong>」（有學者懷疑這版其實較晚才寫上舊翻譯家的名字）。</p></article>
        <article class="parallel-card"><h4>玄奘法師譯《心經》（通行版）</h4><p id="s14-p-t251" class="small">寫作「觀自在菩薩…照見五蘊皆空，<strong>度一切苦厄</strong>」。</p></article>
        <article class="parallel-card"><h4>古印度梵文本怎麼寫？</h4><p id="s14-p-skt" class="small"><strong>通行梵文原本沒有「度一切苦厄」這一句！</strong>目前只有在另一部漢譯經典裡看得到類似話，表示《心經》開頭不像整段直接照現存梵文翻譯。</p></article>
      </div>

      <h4 style="margin-top:14px">目前學者之間有哪三種主要看法？（目前學界還沒有單一最後定案！）</h4>
      <div class="tab-row js-only" role="group" aria-label="心經來源的三種研究看法">
        <button type="button" data-heart="trad" aria-pressed="false">看法一：一直都是從印度梵本翻譯來</button>
        <button type="button" data-heart="nattier" aria-pressed="true">看法二：先在中國整理好，再翻成印度古文？</button>
        <button type="button" data-heart="alt" aria-pressed="false">看法三：日本學者的不同反對意見</button>
      </div>
      <p id="s14-heart-out" class="result" role="status" aria-live="polite">【先在中國整理再回譯的看法】有研究者對字句發現《心經》中段跟早兩百多年翻譯的《大品般若經》幾乎一樣，連古文裡一處特別的詞「以無所得故」轉成梵文時也留下一樣的小疙瘩（Attwood 2020 完整論文看得出這些文字證據；另兩篇 1992 與 2021 詳細論文因網站防抓取或付費牆還沒拿到全本核對）。另外要分開：有些學者覺得這只是當時常見的重點摘錄，另一位學者個人則推論部分舊本可能屬故意托名——這點學者間還在吵，沒有定論！</p>
    </div>

    <div class="story-takeaway">
      <h3>兩個提醒：別把「不是最早原本」跟「壞人故意騙錢」畫上等號！</h3>
      <p>第一，就算是在中國文化裡長出來的經典（像講孝順的《父母恩重經》或《大乘起信論》），很多也是為了在當地弘法而用心整理的哲學與宗教作品，不全是惡意詐騙；第二，中國正牌佛典大資料庫也有說明：「有收進資料庫，不等於替每部書保證它一定出於古代印度」！</p>
    </div>

    <div class="source-door">
      <p>📖 <strong>想看原始古書位置與各家論文詳細清單？</strong>這裡有完整的經典編碼、頁數對讀及我們已讀與還沒拿到的文獻說明。</p>
      <a class="button secondary" href="./history-research.html#heart-sutra-origin">看《心經》《楞嚴經》與十六部經典學術考證 →</a>
    </div>

    <nav class="station-nav" aria-label="第 14 關導覽"><p class="small">目前第 14／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#mahayana">← 上一關</a><a class="button" href="#china">下一關：印度僧人的中國之旅 →</a></div></nav>
  </div></section>`,

  // S15: Indian Monk's Journey in China
  `<section id="china" class="chapter theme-documentary" data-station="15" tabindex="-1"><div class="container">
    <div class="kicker">第 15 關 · 當印度修行人走進重視家族的中國</div>
    <h2>印度僧人的中國生活大適應</h2>
    <p class="story-lead">早年印度的出家人不跟家裡同住、也不能自己種田、沿門托缽別人供養什麼就吃什麼。可是走進傳統中國鄉村後，大家突然問他：「你不結婚生小孩算不孝順吧？又不下田怎麼過日子？」看生活習慣怎麼一點一點變出今天的樣子！</p>

    <div class="play">
      <span class="kicker">文化碰面場景切換 · 點三個生活難題，看看怎麼改變</span>
      <div class="story-stage">
        <img class="stage-art" src="assets/history/illustrations/s15-china-arrival.webp" width="1200" height="675" loading="lazy" alt="穿黃袍的印度行腳僧微笑走進陽光中國木門院子，一旁有菜園、素食餐桌和合掌歡迎他的村民（現代繪本插畫）">
        <div class="stage-overlay-row">
          <span class="badge ok" id="s15-scene-badge">目前生活話題：1. 父母與家族怎麼辦？</span>
        </div>
      </div>

      <div class="tab-row js-only" role="group" aria-label="選擇三個中國生活適應主題">
        <button type="button" data-cscene="filial" aria-pressed="true">1. 不婚生子是不是不孝？</button>
        <button type="button" data-cscene="work" aria-pressed="false">2. 不靠托缽怎麼種菜吃飯？</button>
        <button type="button" data-cscene="food" aria-pressed="false">3. 為什麼漢傳佛教全面吃全素？</button>
      </div>
      <p id="s15-out" class="result" role="status" aria-live="polite">【孝親與家族】其實最早的印度古經早就非常看重照顧爸爸媽媽；但面對中國「無後為大」的壓力，後來發展出了「出家修好幫助全家人」「盂蘭盆追思祖先」這些接地氣的說法與法會。</p>
    </div>

    <div class="story-takeaway">
      <h3>所以吃素這件事，古印度跟漢地一樣嗎？</h3>
      <p>早期印度戒律禁止吃人、象、馬、狗、蛇等十種特定動物的肉，但只要符合「<strong>沒看到為你殺、沒聽到為你殺、也不懷疑專門為你殺</strong>」的三個條件，托缽得到什麼就吃什麼。後來到了中國，大乘經典更強調完全不吃肉、加上六世紀梁武帝大力推行，經歷好幾百年到了大約十世紀，才定型成漢傳僧侶全面吃全素的規矩——所以<strong>不能因為南傳法師照古戒接受三淨肉，就罵人家破戒！</strong></p>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段生活史研究從哪裡來？</strong>取材自早期《善生經》《耆婆經》對照與中國佛教素食及寺院經濟史研究。</p>
      <a class="button secondary" href="./history-research.html#food-vinaya">看古戒原文與素食演變研究 →</a>
    </div>

    <nav class="station-nav" aria-label="第 15 關導覽"><p class="small">目前第 15／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#texts">← 上一關</a><a class="button" href="#chan">下一關：一朵花的秘密書架 →</a></div></nav>
  </div></section>`,

  // S16: Secret of the Flower Sermon (Interactive Timeline Bookshelf)
  `<section id="chan" class="chapter theme-archive" data-station="16" tabindex="-1"><div class="container">
    <div class="kicker">第 16 關 · 靈山「拈花微笑」是什麼時候被寫進書裡的？</div>
    <h2>一朵花的秘密時光書架</h2>
    <p class="story-lead">大家最常聽到禪宗故事說：「佛陀在靈山大會拿起一朵花一句話也沒說，只有迦葉尊者看懂而微笑！」可是這段故事，在佛陀之後的前面一千多年間的古老經典裡，怎麼都翻不到……打開這排古代書籍一本本找找看！</p>

    <div class="play">
      <span class="kicker">古代圖書館書架 · 從早到晚翻開五本書，看「花」在哪一本才第一次出現！</span>
      <div class="story-stage">
        <img class="stage-art" src="assets/history/illustrations/s16-song-library.webp" width="1200" height="675" loading="lazy" alt="木造宋代書院圖書館裡掛著暖光燈籠，整齊的木書架擺著線裝古書，前方木桌上供著一朵蓮花（現代繪本插畫）">
        <div class="shelf-row" style="padding:10px 12px">
          <button type="button" class="book-spine" data-chan="early" aria-pressed="true"><span class="actor-badge">8世紀前</span><strong>早年大藏經／敦煌本</strong><small>結果：還沒寫花 ❌</small></button>
          <button type="button" class="book-spine" data-chan="baolin" aria-pressed="false"><span class="actor-badge">801年</span><strong>寶林傳（殘卷）</strong><small>結果：提付法沒寫花 ⏳</small></button>
          <button type="button" class="book-spine" data-chan="jingde" aria-pressed="false"><span class="actor-badge">1004年</span><strong>景德傳燈錄</strong><small>結果：還未見完整 🌸❌</small></button>
          <button type="button" class="book-spine" data-chan="tiansheng" aria-pressed="false"><span class="actor-badge">1029/1036</span><strong>天聖廣燈錄</strong><small>結果：首度完整登場！🌸✓</small></button>
          <button type="button" class="book-spine" data-chan="dafan" aria-pressed="false"><span class="actor-badge">宋代</span><strong>大梵天王問佛決疑經</strong><small>結果：較晚本土著作 📚</small></button>
        </div>
      </div>
      <p id="s16-out" class="result" role="status" aria-live="polite">【早年大藏經與唐代敦煌手抄本】沒有記「佛陀拿一朵花、迦葉微笑」的故事；這時期的寫本看得出文字比較單純，跟後來印刷的厚版書差很多。</p>
    </div>

    <div class="grid">
      <article class="card-box">
        <span class="tag">版本對照真跡照片</span>
        <h3>1310年高麗木刻版《壇經》（絕非敦煌原本）</h3>
        <img src="assets/history/evidence/img05-platform-sutra-1310.jpg" width="900" height="785" loading="lazy" alt="1310年高麗木刻板六祖壇經對開頁面，印著「風吹幡動」故事" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">這是法國國家圖書館收藏的<strong>1310年木刻版</strong>（已經經過後世好幾次加長改寫），<strong>不能當成唐朝敦煌手抄本替身</strong>！大英圖書館有真正的敦煌古卷，因網站防機器人無法直接放圖，請點此親自觀看：<a href="https://idp.bl.uk/collection/C4D4682ACF944CAF9378F5C5701576A0/" target="_blank" rel="noopener noreferrer">大英圖書館敦煌古卷網頁 ↗</a></p>
      </article>
      <article class="card-box">
        <span class="tag">一千年後的藝術畫像</span>
        <h3>雲谷等顏繪達摩水墨軸（16–17世紀）</h3>
        <img src="assets/history/evidence/img06-bodhidharma-met.jpg" width="800" height="1067" loading="lazy" alt="十六至十七世紀日本畫家繪製的達摩祖師水墨畫掛軸" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">紐約大都會博物館收藏的水墨畫。它畫在達摩過世將近一千年之後，是藝術想像，<strong>不是達摩真人的長相照片！</strong></p>
      </article>
    </div>

    <div class="story-takeaway">
      <h3>晚一點出現的故事，等於沒有價值嗎？不是的！</h3>
      <p>雖然歷史學者發現「二十八位祖師一一交接」「拈花微笑」是唐宋時代才慢慢整理定型的傳承故事，不是佛陀當場的文字記錄；但作為一種「不需要靠講一大堆話、用心領會」的哲學比喻，它在中國跟東亞藝術與生活思考裡仍然很有力量。</p>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段文獻追查從哪裡來？</strong>取材自近現代禪學史對敦煌寫本與宋代燈錄成書年代的比對研究。</p>
      <a class="button secondary" href="./history-research.html#flower-sermon">看燈錄年表、學者研究與限度說明 →</a>
    </div>

    <nav class="station-nav" aria-label="第 16 關導覽"><p class="small">目前第 16／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#china">← 上一關</a><a class="button" href="#tibet">下一關：翻過高山的藏傳書卷 →</a></div></nav>
  </div></section>`,

  // S17: Crossing the Himalayas (Map + Three Wooden Boxes + Real Samye Photo)
  `<section id="tibet" class="chapter theme-atlas" data-station="17" tabindex="-1"><div class="container">
    <div class="kicker">第 17 關 · 雪域高原的三個故事箱</div>
    <h2>翻越喜馬拉雅山的書卷</h2>
    <p class="story-lead">佛教走過全世界海拔最高的雪山來到西藏，留下極多連印度本國都已經燒光失傳的寶貴大經！同時也流傳著「埋在土裡的古代書卷」「活佛轉世」等大家超好奇的說法。哪些在歷史檔案裡看得到、哪些屬於個人宗教信仰？放進三個木箱試試看！</p>

    <div class="play">
      <span class="kicker">高山路徑＋三箱分類遊戲 · 把四件事放進最合適的箱子</span>
      <div class="atlas-stage">
        <svg viewBox="0 0 800 320" role="img" aria-labelledby="s17-map-t s17-map-d">
          <title id="s17-map-t">印度至西藏喜馬拉雅傳播地理與三個證據箱</title>
          <desc id="s17-map-d">以 Natural Earth 輪廓標示印度那爛陀與西藏桑耶寺位置，虛線標示跨喜馬拉雅多波往來與文化互動。</desc>
          <rect class="atlas-sea" width="800" height="320" rx="12"/>
          <g transform="translate(110,-65) scale(1.1)">
            <path class="atlas-land" d="${ASIA_LAND_PATH}"/>
            <path class="atlas-lake" d="${ASIA_LAKES_PATH}"/>
          </g>
          <path d="M346 186 Q380 158 412 138" fill="none" stroke="#7d4a82" stroke-width="3.5" stroke-dasharray="7 5"/>
          <circle cx="346" cy="186" r="7.5" fill="#d97706" stroke="#fffdf7" stroke-width="2"/>
          <circle cx="412" cy="138" r="9.5" fill="#7d4a82" stroke="#fffdf7" stroke-width="2.5"/>
          <g font-size="12" font-weight="750" fill="#243330">
            <text x="235" y="196">北印度（7世紀後密教成熟＋大寺翻譯）</text>
            <text x="428" y="142">西藏桑耶寺（約779年王室建寺）</text>
          </g>
        </svg>
        <div class="drawer-bank" style="padding:8px 0 0">
          <div class="drawer-box is-active" id="s17-box-archive"><strong>🏛️ 實物和歷史檔案箱</strong><p class="small">找得到同時期石碑或翻譯對照</p></div>
          <div class="drawer-box" id="s17-box-lineage"><strong>📜 宗派自己的傳承說法箱</strong><p class="small">教內自有傳統講法，但外部還難確定</p></div>
          <div class="drawer-box" id="s17-box-belief"><strong>🙏 宗教信仰箱（歷史方法查不到）</strong><p class="small">講前世今生心識延續，非科學或考古範圍</p></div>
        </div>
      </div>

      <div class="tab-row js-only" role="group" aria-label="選擇四件藏傳相關故事">
        <button type="button" data-tibet-item="tb1" aria-pressed="true">1. 西元779年桑耶寺與石碑</button>
        <button type="button" data-tibet-item="tb2" aria-pressed="false">2. 西藏保存了印度失傳古書</button>
        <button type="button" data-tibet-item="tb3" aria-pressed="false">3. 從地裡或心中找出的古代秘密典籍</button>
        <button type="button" data-tibet-item="tb4" aria-pressed="false">4. 活佛轉世者是不是前世同一人再生？</button>
      </div>
      <p id="s17-item-text" class="speech-bubble">「西元八世紀後期赤松德贊國王支持建立了桑耶寺，石碑也還留在現場。」</p>
      <div class="controls js-only" role="group" aria-label="放入三個箱子">
        <button type="button" data-tbox="archive" aria-pressed="false">放進「歷史檔案箱」</button>
        <button type="button" data-tbox="lineage" aria-pressed="false">放進「宗派自述箱」</button>
        <button type="button" data-tbox="belief" aria-pressed="false">放進「宗教信仰箱」</button>
      </div>
      <p id="s17-result" class="result" role="status" aria-live="polite">選一件事情再放進箱子裡看看結果！</p>
    </div>

    <div class="card-box">
      <span class="tag">歷史現址實景照片</span>
      <h3>西藏桑耶寺</h3>
      <img src="assets/history/evidence/extra-samye.jpg" width="900" height="600" loading="lazy" alt="西藏桑耶寺當代庭院與兩位行進中的藏傳僧侶遠景照片" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
      <p class="small">最早約在西元 779 年由吐蕃王室建立（現存建築經過歷代多次重建），見證密教與印度論書正式傳入西藏的歷史起點；注意研究密宗的學者也提醒大家，不能把中世紀繁複的宗教符號隨便看成「邪門巫術」，而要放回當年大學校寺院文化中去讀。</p>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段西藏歷史研究從哪裡來？</strong>取材自西藏史料與學者對密續符號及早期苯教互動的研究。</p>
      <a class="button secondary" href="./history-research.html#tibetan-lineages">看桑耶寺史料、薩迦班智達討論與金瓶掣籤考證 →</a>
    </div>

    <nav class="station-nav" aria-label="第 17 關導覽"><p class="small">目前第 17／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#chan">← 上一關</a><a class="button" href="#politics">下一關：消失的古代圖書館 →</a></div></nav>
  </div></section>`,

  // S18: Vanishing Ancient Libraries Sandbox
  `<section id="politics" class="chapter theme-workshop" data-station="18" tabindex="-1"><div class="container">
    <div class="kicker">第 18 關 · 為什麼有些經書留下了，有些卻完全失傳？</div>
    <h2>誰留下書，誰沒能留下？</h2>
    <p class="story-lead">紙和樹皮很怕火、怕水、怕戰亂，大寺院又需要大量糧食、土地跟國王保護才能專心抄書。勾選下面的歷史事件，親自看看古代四個大藏書庫發生了什麼巨變！</p>

    <div class="play">
      <span class="kicker">藏書閣生存大挑戰 · 勾選不同歷史事件（幫助理解概念，非真實統計數字）</span>
      <div class="story-stage" style="padding:12px">
        <div class="repo-grid">
          <div class="repo-card" id="s18-box-india"><strong>🏛️ 北印那爛陀等大寺</strong><p class="small">樹皮與棕櫚葉寫本</p><span class="badge warn" id="s18-st-india">戰火摧毀風險</span></div>
          <div class="repo-card" id="s18-box-sl"><strong>🏝️ 斯里蘭卡海島寺院</strong><p class="small">椰葉書寫與整理</p><span class="badge" id="s18-st-sl">看條件變化</span></div>
          <div class="repo-card" id="s18-box-china"><strong>📜 中原木刻《開寶藏》</strong><p class="small">皇帝挑出來木刻印刷＋石經</p><span class="badge ok" id="s18-st-china">挑進書目的留存</span></div>
          <div class="repo-card" id="s18-box-dunhuang"><strong>🏜️ 敦煌洞窟・外國譯本</strong><p class="small">封進沙漠與帶到海外</p><span class="badge" id="s18-st-dunhuang">看條件變化</span></div>
        </div>
      </div>

      <div class="checks js-only">
        <label><input type="checkbox" data-pol="war" checked><span>發生戰火、外敵攻打或皇帝下令拆廟（如中國幾次滅佛、中亞戰火）</span></label>
        <label><input type="checkbox" data-pol="elite"><span>大寺院拿了太多國王田地、跟附近一般老百姓越來越疏遠</span></label>
        <label><input type="checkbox" data-pol="canon" checked><span>朝廷編成《開寶藏》只挑特定書目刻進木板印刷（沒被挑中的就慢慢弄丟）</span></label>
        <label><input type="checkbox" data-pol="copy"><span>大家努力多抄幾份，還刻在石頭上、或由船隊帶去外國翻譯保存</span></label>
      </div>
      <div class="controls js-only" style="margin-top:8px"><button type="button" id="s18-reset">全部取消重看</button></div>
      <p id="s18-out" class="result" role="status" aria-live="polite"></p>
    </div>

    <div class="grid">
      <article class="card-box">
        <span class="tag">印度真實考古現場</span>
        <h3>那爛陀大寺遺址</h3>
        <img src="assets/history/evidence/img07-nalanda.jpg" width="900" height="613" loading="lazy" alt="印度那爛陀大寺磚造階梯與大片僧舍考古遺址" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">曾經容納數千名學者的古老大學寺。考古學家 Lars Fogelin 指出，北部佛教後來衰退並不只是「外來軍隊打進來」單一原因，還包含王室贊助換別家、大地主寺院跟平常百姓漸漸脫節等七種力量交織！</p>
      </article>
      <article class="card-box">
        <span class="tag">印度真實考古現場</span>
        <h3>超戒寺遺址與倒下石柱</h3>
        <img src="assets/history/evidence/img08-vikramashila.jpg" width="900" height="600" loading="lazy" alt="印度比哈爾邦超戒寺遺址與地面斷裂石柱" style="width:100%;height:auto;border-radius:8px;margin:8px 0">
        <p class="small">即使在北印大寺院倒下之後，東印度與邊緣地區其實還有一些小社群繼續留下來一陣子，並沒有一夕之間全部歸零。</p>
      </article>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段歷史研究從哪裡來？</strong>取材自北宋木刻大藏經印刷史與考古學者對北印佛教衰退的研究。</p>
      <a class="button secondary" href="./history-research.html#india-decline">看十一個關鍵大事件＋七項衰退原因清單 →</a>
    </div>

    <nav class="station-nav" aria-label="第 18 關導覽"><p class="small">目前第 18／22 關 · 第三區結束</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#tibet">← 上一關</a><a class="button" href="#japan">進入第四區：走進近代與臺灣 →</a></div></nav>
  </div></section>`
];
