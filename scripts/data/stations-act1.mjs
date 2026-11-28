// Act 1 (Stations 01–07): Gamified Storybook Museum Architecture

export const ACT1_STATIONS = [
  // S01: Four Visitors at the Gate
  `<section id="four" class="chapter theme-storybook" data-station="1" tabindex="-1"><div class="container">
    <div class="kicker">第 01 關 · 佛陀最後一段旅程的提醒</div>
    <h2>誰說的都要放上桌子查</h2>
    <p class="story-lead">想像寺院門口來了四位客人，每個人都搬出最有分量的靠山，說自己帶來的才是真的佛法。如果你是守門人，誰的話可以不用查就直接點頭？</p>

    <div class="play">
      <span class="kicker">互動小劇場 · 點一位來客，看他走上前把話送上木桌</span>
      <div class="story-stage">
        <img class="stage-art" src="assets/history/illustrations/s01-visitors.webp" width="1200" height="675" loading="lazy" alt="四位穿著素樸袍子的行者從木門走進陽光庭院，右前方木桌上擺著兩捆古代棕櫚葉經典（現代繪本插畫，非古代實物照）">
        <div class="stage-overlay-row">
          <span class="badge ok" id="s01-stage-badge">目前站在桌前：1. 說親耳聽佛陀講的人</span>
          <span class="badge" id="s01-desk-stamp">桌上狀態：還沒決定怎麼處理</span>
        </div>
      </div>

      <div class="actor-strip js-only" role="group" aria-label="請四位來客依序走上前">
        <button type="button" class="actor-card" data-visitor="v1" aria-pressed="true"><span class="actor-badge" id="s01-chk-v1">未查</span><strong>1. 說親耳聽過</strong><small>「我當面聽佛陀這樣說！」</small></button>
        <button type="button" class="actor-card" data-visitor="v2" aria-pressed="false"><span class="actor-badge" id="s01-chk-v2">未查</span><strong>2. 代表大寺院</strong><small>「整間廟的長老都說對！」</small></button>
        <button type="button" class="actor-card" data-visitor="v3" aria-pressed="false"><span class="actor-badge" id="s01-chk-v3">未查</span><strong>3. 好幾位老前輩</strong><small>「三位專家一起掛保證！」</small></button>
        <button type="button" class="actor-card" data-visitor="v4" aria-pressed="false"><span class="actor-badge" id="s01-chk-v4">未查</span><strong>4. 最有名的師父</strong><small>「受人敬重的老師告訴我！」</small></button>
      </div>

      <p id="s01-visitor-text" class="speech-bubble">第一位客人開口：「我在佛陀面前親耳聽到這段話！」</p>

      <div class="controls js-only" role="group" aria-label="你打算怎麼回應這位客人">
        <button type="button" data-vaction="believe" aria-pressed="false">馬上點頭相信</button>
        <button type="button" data-vaction="reject" aria-pressed="false">覺得他在吹牛，直接趕走</button>
        <button type="button" data-vaction="check" aria-pressed="false">先把話記清楚，放上經書與戒規桌比對</button>
        <button type="button" id="s01-reset">全部重來</button>
      </div>
      <div id="s01-result" class="result" role="status" aria-live="polite">點上面任一種回應，看看門口的查證桌會發生什麼事！</div>
      <p id="s01-progress" class="small" role="status" aria-live="polite">已經盤問過的來客：0／4 位（四位裡面沒有半個可以跳過比對！）</p>
    </div>

    <div class="story-takeaway">
      <h3>這個故事想告訴我們什麼？</h3>
      <p>故事裡既不叫人「誰大聲就聽誰」，也不鼓勵「沒聽清楚就亂罵人」。不管對方背景多大，先把每句話記下來，拿去跟大家公認的經典教導和生活規範（佛家稱為「經」與「律」）比對：合得上就收下，合不上就不急著採用。</p>
      <p class="small"><strong>也要注意的細節：</strong>有另一部經典雖然中文也譯成同一個標題《四大》，裡頭講的卻是「從東南西北四個方向來的出家人」怎麼核對經文跟意思，和這四位客人的故事並不一樣。</p>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段故事從哪裡來？</strong>取材自記載佛陀晚年遊行的高古經典（如《大般涅槃經》與《遊行經》等早期版本）。</p>
      <a class="button secondary" href="./history-research.html#four-authority">看佛經原文與各版本比對 →</a>
    </div>

    <details class="story-more">
      <summary>想多認識一點：為什麼「看誰說的」不夠？不同古老版本有什麼小差別？</summary>
      <div class="table-wrap"><table role="table"><caption>幾個古老版本各自怎麼教大家查證</caption><thead><tr><th>流傳的版本</th><th>叫大家拿什麼出來對照</th><th>歷史學者怎麼看這點差別</th></tr></thead><tbody>
        <tr><th data-label="版本">南傳《大般涅槃經》等</th><td data-label="對照基準">經（核心教導）、律（生活規則）</td><td data-label="學者看法">學者討論當時的「經」，可能還不是今天這樣厚厚一整套，而是早期已經整理好的重點摘要。</td></tr>
        <tr><th data-label="版本">漢譯《長阿含・遊行經》</th><td data-label="對照基準">諸經、律、法三樣一起核對</td><td data-label="學者看法">漢譯本多寫了一項「依法」，看得出早期口傳跟翻譯過程中有些微差異。</td></tr>
        <tr><th data-label="版本">漢譯《增壹阿含經》同名故事</th><td data-label="對照基準">檢查從東南西北四方來的出家人懂不懂經文、道理、用詞與戒行</td><td data-label="學者看法">這篇是另一組故事，而且提到「阿毘曇」，看得出有後來進一步分類整理的痕跡。</td></tr>
        <tr><th data-label="版本">中亞吐魯番古梵文殘卷</th><td data-label="對照基準">對照經典、戒律與法理，明確講「靠經，不靠某個人」</td><td data-label="學者看法">更直接點出標準是在道理與文本，而不是崇拜哪位說話者的名氣。</td></tr>
      </tbody></table></div>
      <p class="small"><a href="#s-four">在本頁看這段故事的書目摘要 →</a></p>
    </details>

    <nav class="station-nav" aria-label="第 1 關導覽"><p class="small">目前第 1／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button" href="#drum">下一關：修破鼓的故事 →</a></div></nav>
  </div></section>`,

  // S02: Ancient Drum Workshop
  `<section id="drum" class="chapter theme-workshop" data-station="2" tabindex="-1"><div class="container">
    <div class="kicker">第 02 關 · 流傳下來的故事也會變嗎？</div>
    <h2>這面鼓還是原本那面鼓嗎？</h2>
    <p class="story-lead">木匠桌上放著一面相傳幾百年的大木鼓，上面已經裂開一條縫。流傳了兩種截然不同的修補故事：一種一直塞進新木片，另一種改用牛皮繃起來。動手修修看，最後還認得出原本的鼓嗎？</p>

    <div class="play">
      <span class="kicker">木匠修鼓互動台 · 兩種古老故事都能親手試試看</span>
      <div class="story-stage">
        <img class="stage-art" src="assets/history/illustrations/s02-workshop.webp" width="1200" height="675" loading="lazy" alt="陽光灑進古印度木匠工坊，桌上放著木槌、鑿子與牛皮條，中央空出木台（現代繪本插畫）">
        <div class="basin-hud">
          <div class="basin-vessel">
            <svg viewBox="0 0 360 230" role="img" aria-labelledby="drum-title drum-desc">
              <title id="drum-title">古木鼓修補過程畫面</title>
              <desc id="drum-desc">隨點擊次數逐步換入五塊新木片，或切換成牛皮補面後脫落只剩零碎木頭。</desc>
              <ellipse cx="180" cy="204" rx="108" ry="18" fill="#463120" opacity="0.22"/>
              <path id="drum-body" d="M88 64 Q58 132 88 194 Q180 226 272 194 Q302 132 272 64 Z" fill="#9f6537" stroke="#533118" stroke-width="4"/>
              <ellipse cx="180" cy="64" rx="92" ry="30" fill="#eccb9c" stroke="#6c401e" stroke-width="4"/>
              <path d="M110 88 Q180 112 250 88" fill="none" stroke="#8b552a" stroke-width="2.5" opacity="0.55"/>
              <path d="M150 54 L196 74 L172 80" fill="none" stroke="#472814" stroke-width="3" stroke-linecap="round"/>
              <!-- 5 Wooden Replacement Wedges -->
              <g id="drum-wedges" fill="#3a8072" stroke="#183b34" stroke-width="2.5">
                <rect class="drum-patch" x="92" y="96" width="32" height="92" rx="6"/>
                <rect class="drum-patch" x="128" y="106" width="32" height="94" rx="6"/>
                <rect class="drum-patch" x="164" y="109" width="32" height="95" rx="6"/>
                <rect class="drum-patch" x="200" y="106" width="32" height="94" rx="6"/>
                <rect class="drum-patch" x="236" y="96" width="32" height="92" rx="6"/>
              </g>
              <!-- Leather Wrap Mode -->
              <g id="leather" opacity="0">
                <ellipse cx="180" cy="64" rx="94" ry="31" fill="#6f3e22" stroke="#d9b280" stroke-width="5"/>
                <path d="M100 72 Q180 99 260 72 M114 55 Q180 35 246 55" stroke="#e4c28f" stroke-width="3" fill="none" stroke-dasharray="6 4"/>
                <path d="M96 86 L108 178 M264 86 L252 178" stroke="#c8915c" stroke-width="8" stroke-linecap="round"/>
              </g>
              <!-- Final Leather Peeling State -->
              <g id="leather-peel" opacity="0">
                <path d="M104 68 L256 58 L236 86 L122 92 Z" fill="#efe5d6" stroke="#9e392a" stroke-width="3" stroke-dasharray="5 3"/>
                <rect x="106" y="176" width="48" height="14" rx="4" transform="rotate(-8 130 183)" fill="#9f6537" stroke="#533118" stroke-width="2"/>
                <rect x="194" y="178" width="54" height="14" rx="4" transform="rotate(9 221 185)" fill="#8a542c" stroke="#533118" stroke-width="2"/>
              </g>
            </svg>
          </div>
          <div>
            <p id="drum-mode" class="speech-bubble">故事 A（一直補新木頭）：鼓身裂掉就打進新木片，慢慢把原木全換光了。</p>
            <p id="drum-status" class="result" role="status" aria-live="polite">還沒有動手修補，原木鼓身看得到一條裂痕。</p>
          </div>
        </div>
      </div>

      <div class="controls drum-modes js-only" role="group" aria-label="切換兩個版本的修鼓故事">
        <button id="mode-pali" type="button" aria-pressed="true">故事 A：補進新木塊</button>
        <button id="mode-han" type="button" aria-pressed="false">故事 B：改繃牛皮來補</button>
        <button id="drum-sound" type="button" aria-pressed="false">鼓聲示範：目前靜音</button>
      </div>
      <div class="drum-actions js-only" style="margin-top:10px">
        <button class="button" id="patch" type="button">動手修補一次</button>
        <button id="reset-drum" type="button">恢復原本的古鼓</button>
      </div>
      <p class="small">提醒：五塊木片與音效是為了幫助想像的示範，不代表古經寫的真實次數；兩個古老故事各有各的畫面，誰也沒有辦法取代誰。</p>
    </div>

    <div class="story-takeaway">
      <h3>連「提醒大家東西會變質」的故事自己，都留下了兩種版本！</h3>
      <p>故事 A 擔心後人看不起樸素深刻的核心道理、只愛聽華麗好聽的新詩詞，最後整面鼓只剩新塞進去的木頭；故事 B 說原本鼓聲能傳幾十里，改用牛皮繃緊之後再也敲不出好聽的聲音，最後牛皮碎掉、只剩零散木片。這剛好告訴我們：沒有哪一個單獨版本能自稱完全沒變過。</p>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段故事從哪裡來？</strong>取材自巴利文《相應部》與漢譯《雜阿含經》保存的同源「古鼓譬喻」。</p>
      <a class="button secondary" href="./history-research.html#drum-parallels">看兩個古本的原文差別 →</a>
    </div>

    <details class="story-more">
      <summary>想再多看一點：兩個版本分別指什麼？學者怎麼解讀？</summary>
      <div class="grid">
        <article class="card"><h3>巴利文版本的故事線索</h3><p>寫木鼓框裂開後每次都塞進一塊新木頭，最後原本的木頭全部不見，只剩下補丁聚在一起。經裡以此提醒不要放著深奧道理不學，反而一直去寫好聽的文章。</p></article>
        <article class="card"><h3>漢譯版本的故事線索</h3><p>寫大鼓本來聲音洪亮可傳很遠，破裂後改用牛皮繞著綁起來補，結果再也聽不到從前那麼美妙的聲音，後來牛皮全爛掉只剩堆成堆的舊木片。</p></article>
      </div>
      <p class="small">學者（如現代比對研究者 Bhikkhu Sujato）指出，今天沒辦法斷定哪一個版本一定比較早，也不能拿這個故事亂貼標籤指責某個現代宗派都是假的。</p>
    </details>

    <nav class="station-nav" aria-label="第 2 關導覽"><p class="small">目前第 2／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#four">← 上一關</a><a class="button" href="#teacher">下一關：可以觀察老師嗎？ →</a></div></nav>
  </div></section>`,

  // S03: Observing a Teacher Across Time
  `<section id="teacher" class="chapter theme-storybook" data-station="3" tabindex="-1"><div class="container">
    <div class="kicker">第 03 關 · 不會讀心術怎麼選老師？</div>
    <h2>觀察老師的三頁筆記本</h2>
    <p class="story-lead">有人自稱已經看透人生、完全沒有煩惱，可是我們又沒辦法打開他的腦袋看裡面在想什麼。佛經居然說：就算遇到有名的老師（甚至佛陀自己），也可以用眼睛看、耳朵聽來慢慢觀察！</p>

    <div class="play">
      <span class="kicker">虛構人物觀察模擬 · 翻開三段不同時間的筆記，再做判斷</span>
      <div class="story-stage">
        <div class="basin-hud">
          <div class="basin-vessel" id="s03-diary-card" style="text-align:left;padding:14px">
            <p class="actor-badge" id="s03-time-badge">📅 第一頁｜剛認識前兩週</p>
            <h3 id="s03-scene-title" style="margin:4px 0">看起來簡單樸素、講課也很清楚</h3>
            <p id="s03-scene-metrics" class="small" style="margin:6px 0">👀 看得到的：每天穿很樸素、說話輕聲細語。<br>❓ 還看不到的：沒看過他生氣、遇到錢或被人批評會怎麼樣。</p>
          </div>
          <div>
            <p id="s03-stage-text" class="speech-bubble">「才相處兩個禮拜，課講得很順，可是他平常真的都這樣嗎？」</p>
            <p id="s03-judge-result" class="result" role="status" aria-live="polite">先試著選一個時間點，再點下面你的判斷！</p>
          </div>
        </div>
      </div>

      <div class="tab-row js-only" role="group" aria-label="切換觀察的時間點">
        <button type="button" data-tstage="early" aria-pressed="true">第 1 頁：剛認識兩週</button>
        <button type="button" data-tstage="famous" aria-pressed="false">第 2 頁：突然紅起來、捐款變多後</button>
        <button type="button" data-tstage="critic" aria-pressed="false">第 3 頁：被人公開抓錯時</button>
      </div>

      <div class="controls js-only" role="group" aria-label="做出你的觀察結論">
        <button type="button" data-tjudge="observe" aria-pressed="false">先記錄看得到的言行</button>
        <button type="button" data-tjudge="insufficient" aria-pressed="false">時間還太短，再多觀察</button>
        <button type="button" data-tjudge="mind" aria-pressed="false">確定他已經完全開悟！</button>
        <button type="button" id="s03-reset">重設筆記本</button>
      </div>
    </div>

    <div class="story-takeaway">
      <h3>好名氣、好外表都不算數：尊重跟查證可以同時存在</h3>
      <p>古代故事提醒大家四件事：看他說話跟做事有沒有藏私生氣、看的時間有沒有拉長、看他成名拿到很多好處後有沒有變驕傲，還有用看得到的行為去推測他是不是真的不想害人——而不是憑感覺猜人家心裡有沒有神通。看資料還不夠時，老實說「我還不能確定」就是最聰明的做法。</p>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段故事從哪裡來？</strong>取材自《中部・思察經》與漢譯《中阿含經・求解經》（兩個早期版本都寫過這個故事）。</p>
      <a class="button secondary" href="./history-research.html#teacher-investigation">看佛經原文與學者說明 →</a>
    </div>

    <details class="story-more">
      <summary>想再多試題目：如果有百萬粉絲的老師說「不用查我」呢？</summary>
      <div class="play" style="margin:10px 0">
        <h3>遇到這種說法，你怎麼辦？</h3>
        <div class="choices" role="group" aria-label="百萬粉絲老師問題">
          <button type="button" data-feedback="追蹤人數多只代表很紅，不代表不用核對他的言行與主張是否可靠。" aria-controls="q-teacher" aria-pressed="false">A．粉絲這麼多，應該不會錯吧</button>
          <button type="button" data-feedback="還沒看到具體證據就罵對方一定是騙子，也不是公道的做法。" aria-controls="q-teacher" aria-pressed="false">B．叫人別查，他一定在騙人</button>
          <button type="button" data-feedback="說得對！真正有根據的信任，是觀察很久以後建立的，不是閉著眼睛相信。" aria-controls="q-teacher" aria-pressed="false">C．照樣長期觀察他的言行、問清楚道理</button>
        </div>
        <p class="result" id="q-teacher" role="status" aria-live="polite">點選上面任一個選項看看結果。</p>
      </div>
    </details>

    <nav class="station-nav" aria-label="第 3 關導覽"><p class="small">目前第 3／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#drum">← 上一關</a><a class="button" href="#kalama">下一關：小鎮傳聞偵探 →</a></div></nav>
  </div></section>`,

  // S04: PRIORITY REWORK — Town Rumor Detective & Four Hypothetical Worlds
  `<section id="kalama" class="chapter theme-storybook" data-station="4" tabindex="-1"><div class="container">
    <div class="kicker">第 04 關 · 大家都來小鎮說自己是對的</div>
    <h2>小鎮傳聞偵探與四個假設世界</h2>
    <p class="story-lead">一群不同門派的老師輪流來到村口大樹下，每個人都誇自己最厲害、批評別人都在亂講。鎮上的居民聽得頭昏眼花——如果你也在現場，要靠什麼才能知道哪條路真的不害人？</p>

    <!-- GAME A: Town Rumor Detective (all 10 Pali reasons represented distinctly & respectfully) -->
    <div class="play" id="s04-game-a">
      <span class="kicker">遊戲一｜小鎮傳聞偵探（共 10 位街坊各自帶來一個理由）</span>
      <h3>點點看大樹下的鎮民，先打開線索，再跟「是否害人」比一比！</h3>
      <div class="story-stage">
        <img class="stage-art" src="assets/history/illustrations/s04-town-square.webp" width="1200" height="675" loading="lazy" alt="陽光下古印度村莊大榕樹廣場：白鬍子阿公講故事、旅人拿著棕櫚葉書捆、老師席地講課、兩位婦人聊天的繪本場景（現代插畫）">
        <div class="stage-overlay-row">
          <span class="badge ok" id="s04-speaker-tag">目前走到廣場中間：1. 愛講古的村口阿伯</span>
          <span class="badge" id="s04-saved-badge">已放進「先保留不亂定案」板：0／10 則</span>
        </div>
      </div>

      <div class="actor-strip js-only" role="group" aria-label="選擇十位小鎮居民">
        <button type="button" class="actor-card" data-kalama-npc="n1" aria-pressed="true"><span class="actor-badge">1｜世代口傳</span><strong>村口阿伯</strong><small>大家都一直這樣講</small></button>
        <button type="button" class="actor-card" data-kalama-npc="n2" aria-pressed="false"><span class="actor-badge">2｜一代傳一代</span><strong>大廟小師兄</strong><small>師公傳下來幾百年</small></button>
        <button type="button" class="actor-card" data-kalama-npc="n3" aria-pressed="false"><span class="actor-badge">3｜大家都在轉傳</span><strong>茶館老闆娘</strong><small>整條街都在傳這消息</small></button>
        <button type="button" class="actor-card" data-kalama-npc="n4" aria-pressed="false"><span class="actor-badge">4｜古書有寫</span><strong>捧書先生</strong><small>手裡這本經書寫很清楚</small></button>
        <button type="button" class="actor-card" data-kalama-npc="n5" aria-pressed="false"><span class="actor-badge">5｜推起來很合理</span><strong>年輕辯論員</strong><small>照這邏輯推下去一定通</small></button>
        <button type="button" class="actor-card" data-kalama-npc="n6" aria-pressed="false"><span class="actor-badge">6｜看幾個例子猜</span><strong>市集算帳人</strong><small>上次也這樣，大概都一樣</small></button>
        <button type="button" class="actor-card" data-kalama-npc="n7" aria-pressed="false"><span class="actor-badge">7｜自己想得很漂亮</span><strong>愛思考的學生</strong><small>我想通的道理太完整了</small></button>
        <button type="button" class="actor-card" data-kalama-npc="n8" aria-pressed="false"><span class="actor-badge">8｜剛好合我心意</span><strong>挑水大姊</strong><small>跟我原本想法完全相同</small></button>
        <button type="button" class="actor-card" data-kalama-npc="n9" aria-pressed="false"><span class="actor-badge">9｜講的人很有派頭</span><strong>體面大講者</strong><small>學問高、看起來就很可靠</small></button>
        <button type="button" class="actor-card" data-kalama-npc="n10" aria-pressed="false"><span class="actor-badge">10｜是我自己的老師</span><strong>忠實徒弟</strong><small>他是我師父，聽他的準沒錯</small></button>
      </div>

      <p id="s04-npc-quote" class="speech-bubble">村口阿伯笑著說：「我們從祖父那時候就是這樣一直講下來的，還能錯嗎？」</p>

      <div class="controls js-only" role="group" aria-label="操作鎮民提供的線索">
        <button type="button" id="s04-flip-clue" aria-pressed="false">翻開線索看看（優點和風險）</button>
        <button type="button" id="s04-weigh-harm" aria-pressed="false">放上「是否害人／越貪越氣」天平比比看</button>
        <button type="button" id="s04-pin-hold" aria-pressed="false">先記下來，暫時不下結論</button>
        <button type="button" id="s04-next-npc">換下一位居民 →</button>
      </div>
      <div id="s04-clue-out" class="result" role="status" aria-live="polite">提醒：傳統、書本、老師和想道理都可能是好線索，但「單憑其中任何一個」都還不能證明一定對！</div>
    </div>

    <!-- GAME B: Four Hypothetical Worlds around ordinary person A-Ming -->
    <div class="play" id="s04-game-b">
      <span class="kicker">遊戲二｜四個假設世界（不是只說「自己爽就好」！）</span>
      <h3>就算不知道死後有沒有另一個世界，為什麼「善良不害人」還是划算？</h3>
      <p class="small">來看村裡普通人<strong>阿明</strong>的故事：他平常幫忙鄰居提菜、不亂佔人便宜，盡量用寬厚不傷人的心對待身邊的人。切換下面四種假設，看阿明的人生在哪一個世界吃虧？</p>

      <div class="story-stage">
        <div class="basin-hud">
          <div class="basin-vessel" id="s04-world-card" style="text-align:left;padding:14px">
            <p class="actor-badge" id="s04-world-badge">假設世界 1／4｜假如有下輩子，好壞也有報應</p>
            <h4 id="s04-world-title" style="margin:4px 0">阿明幫助鄰居，心安理得走下去</h4>
            <p id="s04-world-scene" class="small" style="margin:6px 0">🌤️ <strong>眼前生活：</strong>街坊喜歡他，他每天睡得安穩。<br>🚶 <strong>未來路徑：</strong>照這個世界的假設，不傷人的人走到未來也會走向好地方。</p>
          </div>
          <div>
            <p id="s04-assasa-out" class="result" role="status" aria-live="polite">世界 1：如果真的有死後世界和善惡報應，阿明因為平常不害人、心裡善良，死後也能安心。（這是故事裡推想的安慰，並不是用動畫證明真有來世喔！）</p>
            <p class="small">誠實小提醒：好心不害人<strong>並不保證</strong>人這輩子永遠不會生病、遇到意外或被壞人欺負；重點是至少自己的心裡踏實、問心無愧。</p>
          </div>
        </div>
      </div>

      <div class="tab-row js-only" role="group" aria-label="切換四個假設世界">
        <button type="button" data-assasa="a1" aria-pressed="true">1. 如果有來世跟報應</button>
        <button type="button" data-assasa="a2" aria-pressed="false">2. 如果沒有來世跟報應</button>
        <button type="button" data-assasa="a3" aria-pressed="false">3. 如果做壞事會有惡果</button>
        <button type="button" data-assasa="a4" aria-pressed="false">4. 如果做壞事不會有惡果</button>
      </div>
    </div>

    <div class="story-takeaway">
      <h3>《伽藍經》真的叫人「只要自己覺得對就好」嗎？完全不是！</h3>
      <p>故事後段馬上反過來問：如果某種想法讓你<strong>更愛貪便宜、更容易發脾氣、越變越糊塗，甚至去傷害別人</strong>，那就不該跟著做；反過來，如果讓你少一點貪念與敵意、好好待人、明理的人也會點頭肯定，那才值得去行。經裡還特別講到用親切、同情、歡喜別人好與平靜不偏心對待世界。</p>
    </div>

    <details class="story-more">
      <summary>兩種古老版本，有什麼不一樣？（先玩完故事再看這裡）</summary>
      <p>這套「十個不能只靠單一理由」和「四個假設」，主要保存在南傳巴利文的《增支部》第 3.65《伽藍經》裡；中國漢譯保存的較早版本《中阿含》第 16 經《伽藍經》，<strong>並沒有寫那十條清單也沒有這四個假設</strong>，而是直接切入討論怎麼放下貪心、生氣、糊塗，去修習對人友善寬闊的心（慈悲喜捨）。所以講到十條清單時，要老實說這是巴利本的內容！</p>
      <p class="small">（展開可查巴利本十條詳細名單：口傳、師徒傳承、傳聞、經典寫本、邏輯推理、推論、想像思考通順、符合自己原想法、講者看似有才華、尊敬自己老師。）</p>
    </details>

    <div class="source-door">
      <p>📖 <strong>這段故事從哪裡來？</strong>取材自南亞古老佛經《伽藍經》（巴利文《增支部》與漢譯《中阿含經》版本各有不同寫法）。</p>
      <a class="button secondary" href="./history-research.html#kalama-context">看兩版本佛經原文與學者考證 →</a>
    </div>

    <nav class="station-nav" aria-label="第 4 關導覽"><p class="small">目前第 4／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#teacher">← 上一關</a><a class="button" href="#rahula">下一關：水盆、大象與鏡子 →</a></div></nav>
  </div></section>`,

  // S05: TEMPLATE FLAGSHIP 1 — Three Complete Storybook Scenes (Basin, Elephant, Mirror)
  `<section id="rahula" class="chapter theme-storybook" data-station="5" tabindex="-1"><div class="container">
    <div class="kicker">第 05 關 · 跟孩子聊為什麼不能故意說謊</div>
    <h2>一盆水、一頭大象，和一面鏡子</h2>
    <p class="story-lead">佛陀去看年輕的兒子羅睺羅，洗完腳後沒有馬上講大道理，而是用手邊的洗腳盆、國王的戰象，還有每天照臉用的銅鏡，演了三段一看就懂的生活故事。</p>

    <!-- SCENE A: Buddha, Rahula & Interactive Copper Basin -->
    <div class="play" id="s05-scene-a">
      <span class="kicker">故事場景一｜師父與小羅睺羅的銅盆</span>
      <h3>伸手試試看：故意說謊又不知羞恥時，盆裡還剩下什麼？</h3>
      <div class="basin-stage">
        <img class="stage-art" src="assets/history/illustrations/s05-rahula-courtyard.webp" width="1200" height="675" loading="lazy" alt="陽光溫柔的古印度石階走廊上，留著鬍鬚的師父坐著與年輕小沙彌羅睺羅望向前方石地，等待演示洗腳盆（現代繪本插畫）">
        <div class="basin-hud">
          <div class="basin-vessel">
            <svg viewBox="0 0 300 210" role="img" aria-labelledby="s05-basin-t s05-basin-d">
              <title id="s05-basin-t">立體銅製洗腳盆倒水與翻蓋動作</title>
              <desc id="s05-basin-d">可操作倒掉一些水、全部倒光、把盆子倒過來覆蓋石地與再翻回正面的立體水盆畫面。</desc>
              <defs>
                <linearGradient id="copperGrad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stop-color="#dfab75"/>
                  <stop offset="52%" stop-color="#b5713d"/>
                  <stop offset="100%" stop-color="#7c4722"/>
                </linearGradient>
                <linearGradient id="rimGrad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stop-color="#f2cc9b"/>
                  <stop offset="50%" stop-color="#d28d52"/>
                  <stop offset="100%" stop-color="#f0c792"/>
                </linearGradient>
                <linearGradient id="waterGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#8ae0da"/>
                  <stop offset="100%" stop-color="#369693"/>
                </linearGradient>
                <clipPath id="s05-cup-clip"><path d="M84 62 L216 62 L195 144 Q150 156 105 144 Z"/></clipPath>
              </defs>
              <!-- Stone Courtyard Floor Shadow & Spill Puddle -->
              <ellipse cx="150" cy="176" rx="88" ry="15" fill="#4f3e2d" opacity="0.16"/>
              <ellipse id="basin-puddle" cx="150" cy="182" rx="108" ry="18" fill="#5abcb7" opacity="0"/>
              <g id="basin-drops" fill="#77d6d0" opacity="0">
                <circle cx="94" cy="154" r="4"/><circle cx="150" cy="166" r="5"/><circle cx="204" cy="152" r="4"/>
              </g>
              <!-- Flip/Tilt Group around center (150, 108) -->
              <g id="basin-bowl">
                <!-- Back inside copper wall -->
                <ellipse cx="150" cy="62" rx="70" ry="14" fill="#6b3e1f"/>
                <!-- Animated Water Surface & Body inside basin -->
                <g clip-path="url(#s05-cup-clip)">
                  <rect id="basin-water" x="78" y="66" width="144" height="86" fill="url(#waterGrad)"/>
                  <ellipse id="basin-surface" cx="150" cy="66" rx="64" ry="10" fill="#b7f2ed" opacity="0.88"/>
                </g>
                <!-- Outer hammered copper belly with thickness rim -->
                <path d="M80 62 L220 62 L198 145 Q150 160 102 145 Z" fill="url(#copperGrad)" fill-opacity="0.32" stroke="#5f3314" stroke-width="3.5" stroke-linejoin="round"/>
                <path d="M77 62 Q150 76 223 62" fill="none" stroke="url(#rimGrad)" stroke-width="7" stroke-linecap="round"/>
                <ellipse cx="150" cy="62" rx="73" ry="14" fill="none" stroke="#5f3314" stroke-width="3"/>
                <circle cx="80" cy="96" r="6" fill="none" stroke="#dfab75" stroke-width="3"/>
                <circle cx="220" cy="96" r="6" fill="none" stroke="#dfab75" stroke-width="3"/>
              </g>
              <text id="basin-svg-label" x="150" y="203" text-anchor="middle" fill="#475b55" font-size="13" font-weight="700">盆裡原本裝滿乾淨的水</text>
            </svg>
          </div>
          <div>
            <p id="s05-basin-out" class="result" role="status" aria-live="polite">銅盆剛洗完腳、裡面還裝滿水。請照故事順序點點看下面的按鈕！</p>
            <div class="controls js-only" role="group" aria-label="操作羅睺羅的洗腳盆">
              <button type="button" data-basin="little" aria-pressed="false">1. 倒掉一些水</button>
              <button type="button" data-basin="empty" aria-pressed="false">2. 把水全部倒光</button>
              <button type="button" data-basin="flipped" aria-pressed="false">3. 把盆子倒過來</button>
              <button type="button" data-basin="upright" aria-pressed="false">4. 把盆子翻回來</button>
              <button type="button" data-basin="full" aria-pressed="true">重新裝滿水</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SCENE B: Anatomically Natural Asian Elephant -->
    <div class="play" id="s05-scene-b">
      <span class="kicker">故事場景二｜為什麼戰象會小心捲起鼻子？</span>
      <h3>認識真的亞洲象：全身上下都在保護最重要的地方</h3>
      <div class="story-stage">
        <img class="stage-art" src="assets/history/illustrations/s05-elephant-king.webp" width="1200" height="675" loading="lazy" alt="站在皇宮石庭院裡的亞洲戰象，有著隆起額頭、大小適中的耳朵、兩根象牙、粗壯四肢、織錦背毯與緊緊捲起保護在象牙下的長鼻子（現代繪本插畫）">
        <div class="stage-overlay-row">
          <span class="badge ok" id="s05-el-badge">目前聚焦：看清楚這頭真實的亞洲大象</span>
        </div>
      </div>
      <div class="tab-row js-only" role="group" aria-label="看看大象為什麼護著鼻子">
        <button type="button" data-elstep="look" aria-pressed="true">1. 看牠全身和站姿</button>
        <button type="button" data-elstep="protect" aria-pressed="false">2. 為什麼把長鼻捲起來？</button>
        <button type="button" data-elstep="meaning" aria-pressed="false">3. 跟說話有什麼關係？</button>
      </div>
      <p id="s05-el-out" class="result" role="status" aria-live="polite">古印度國王的戰象身高體壯，前面走著四條粗壯像柱子的腿、有堅硬的象牙和大耳朵——但牠最寶貝的其實是敏感又不能受傷的長鼻子。</p>
    </div>

    <!-- SCENE C: Bronze Mirror Story Scenarios -->
    <div class="play" id="s05-scene-c">
      <span class="kicker">故事場景三｜鏡子裡看得到的行為選擇</span>
      <h3>每天看自己一次：講出那句話之前、當下和之後，會發生什麼事？</h3>
      <div class="story-stage">
        <img class="stage-art" src="assets/history/illustrations/s05-mirror-triptych.webp" width="1200" height="675" loading="lazy" alt="橫向三段繪本情境：左邊孩子拿著圓形銅鏡托著下巴停下思考；中間話說到一半趕緊剎車停手；右邊微笑彎腰跟朋友道歉和好（現代繪本插畫）">
        <div class="stage-overlay-row">
          <span class="badge ok" id="s05-mirror-tag">故事定格：左邊畫面｜準備講出口前先照一下</span>
        </div>
      </div>
      <div class="tab-row js-only" role="group" aria-label="切換三個故事瞬間">
        <button type="button" data-mirror="before" aria-pressed="true">1. 做之前先想一想</button>
        <button type="button" data-mirror="during" aria-pressed="false">2. 正在做時察覺到不對</button>
        <button type="button" data-mirror="after" aria-pressed="false">3. 做錯了之後怎麼辦</button>
      </div>
      <p id="s05-mirror-out" class="result" role="status" aria-live="polite">【做之前想一想】小安差點把同學的糗事發到班群，拿起銅鏡想了一秒：「這句話發出去會害別人受傷嗎？」想通了就決定先不講，省下一場傷害。</p>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段故事從哪裡來？</strong>取材自印度佛教最早期的教誡經典（南傳《教誡羅睺羅庵婆羅經》與漢譯《羅云經》）；而且公元前三世紀的阿育王石刻也真的點名推薦這篇！</p>
      <a class="button secondary" href="./history-research.html#bairat-rahula">看石刻實物與佛經原文 →</a>
    </div>

    <details class="story-more">
      <summary>想再多試題目或去第 08 關看那塊古老的阿育王石刻</summary>
      <p class="small">如果你不小心轉傳了一條錯的消息，按故事裡的做法就是「做完發現出錯，坦白說清楚並改正，避免害別人再錯」，而不是偷偷刪掉就裝沒事。<a href="#evidence">直接跳到第 08 關看拜拉特石刻真跡照片 →</a></p>
    </details>

    <nav class="station-nav" aria-label="第 5 關導覽"><p class="small">目前第 5／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#kalama">← 上一關</a><a class="button" href="#direction">下一關：兩條生活路 →</a></div></nav>
  </div></section>`,

  // S06: Two Lifestyle Paths
  `<section id="direction" class="chapter theme-storybook" data-station="6" tabindex="-1"><div class="container">
    <div class="kicker">第 06 關 · 走這條路，心會更輕鬆還是更累？</div>
    <h2>把人帶去哪裡的兩條路</h2>
    <p class="story-lead">摩訶波闍波提（照顧佛陀長大的姨母）想找一句簡單又好記的準則，方便每天檢查自己的生活。下面兩條鄉間小路，讓你一眼看出差別。</p>

    <div class="play">
      <span class="kicker">路線選擇實驗 · 點一個生活例子，看看旅人走上哪一條路</span>
      <div class="story-stage">
        <img class="stage-art" src="assets/history/illustrations/s06-two-paths.webp" width="1200" height="675" loading="lazy" alt="陽光下分岔的兩條路：左邊綠蔭小路草花開滿、放著輕便布鞋；右邊石板陡坡堆滿沉重金幣布袋與打結粗繩（現代繪本插畫）">
        <div class="stage-overlay-row">
          <span class="badge ok" id="s06-path-badge">🚶 旅人腳步：走上左邊清爽森林路</span>
        </div>
      </div>

      <div class="controls js-only" role="group" aria-label="選擇生活情境">
        <button type="button" data-dir="d1" aria-pressed="true">狀況 A：不藏私教人正確資訊</button>
        <button type="button" data-dir="d2" aria-pressed="false">狀況 B：被一直推銷昂貴改運法會</button>
        <button type="button" data-dir="d3" aria-pressed="false">狀況 C：認真工作養家、量力幫人</button>
        <button type="button" data-dir="d_counter" aria-pressed="false">⚠️ 陷阱提醒：看外表穿得破舊就準嗎？</button>
      </div>
      <p id="s06-dir-out" class="result" role="status" aria-live="polite">【不藏私分享正確知識】這條路讓人越走越輕快：不需要拼命佔有、炫耀或綁住別人，心裡更安定。</p>
    </div>

    <div class="story-takeaway">
      <h3>重要界線：這把尺拿來量「心情和品行」，不能拿來猜經書年代</h3>
      <p>故事裡教人看八個生活方向：有沒有更少貪心、更少受困、更知足、更好相處、不要懶散也不要給別人帶來沉重負擔。<strong>但注意兩件事：</strong>第一，普通人認真上班養家完全沒問題；第二，你不能只靠別人穿得多樸素就說他一定好，更不能用這八點去推論哪部經典一定出自古代！</p>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段故事從哪裡來？</strong>取材自早期經律兩部文獻裡給姨母的簡要教導（《增支部》與律藏故事）。</p>
      <a class="button secondary" href="./history-research.html#direction-tests">看原文八項條目與研究頁說明 →</a>
    </div>

    <details class="story-more">
      <summary>想再多看一點：八個生活方向的全部對照表</summary>
      <div class="table-wrap"><table role="table"><caption>讓人更輕鬆自在的方向 vs 讓人更緊繃沉重的方向</caption><thead><tr><th>✓ 越走越輕快的方向</th><th>× 越走越累的方向</th></tr></thead><tbody>
        <tr><th data-label="✓">放下過多貪求</th><td data-label="×">越來越想抓緊佔有</td></tr>
        <tr><th data-label="✓">解開不必要的綁手綁腳</th><td data-label="×">越綁越死</td></tr>
        <tr><th data-label="✓">減少囤積負擔</th><td data-label="×">什麼都想塞滿口袋</td></tr>
        <tr><th data-label="✓">慾望慢慢變少</th><td data-label="×">想要越多越大</td></tr>
        <tr><th data-label="✓">容易感到夠了、知足</th><td data-label="×">永遠覺得不夠</td></tr>
        <tr><th data-label="✓">喜歡安靜清爽</th><td data-label="×">成天泡在吵鬧是非裡</td></tr>
        <tr><th data-label="✓">願意花精神踏實練習</th><td data-label="×">一直拖延懶散</td></tr>
        <tr><th data-label="✓">好照顧、不給別人添大麻煩</th><td data-label="×">很難伺候、一直要資源</td></tr>
      </tbody></table></div>
    </details>

    <nav class="station-nav" aria-label="第 6 關導覽"><p class="small">目前第 6／22 關</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#rahula">← 上一關</a><a class="button" href="#truth">下一關：相信還是知道？ →</a></div></nav>
  </div></section>`,

  // S07: Three-Drawer Evidence Sorter
  `<section id="truth" class="chapter theme-archive" data-station="7" tabindex="-1"><div class="container">
    <div class="kicker">第 07 關 · 「我覺得」跟「真的找得到證據」不一樣</div>
    <h2>把故事放進三個不同的抽屜</h2>
    <p class="story-lead">有一部古老經典坦白說：靠「信仰」「剛好喜歡」「大家傳下來」「自己想通」這五件事，就算你超級誠懇，結論還是有可能講錯！那該怎麼老實看待自己手上的故事？</p>

    <div class="play">
      <span class="kicker">檔案整理遊戲 · 選一張卡片，決定它該拉開哪個抽屜放進去</span>
      <div class="story-stage" style="padding:12px">
        <div class="drawer-bank" id="s07-drawers">
          <div class="drawer-box is-active" id="s07-dr-belief"><strong>🧺 抽屜一｜我自己這樣信</strong><p class="small" id="s07-dr-belief-txt">放「目前找無公開證據、屬於個人信仰」的想法</p></div>
          <div class="drawer-box" id="s07-dr-supported"><strong>🏛️ 抽屜二｜找得到古物證據</strong><p class="small" id="s07-dr-supported-txt">放「有石碑、檔案或實證支撐」的事實</p></div>
          <div class="drawer-box" id="s07-dr-unknown"><strong>🕰️ 抽屜三｜現在還不知道</strong><p class="small" id="s07-dr-unknown-txt">放「古書沒記或還在爭議，先留著等新線索」的問題</p></div>
        </div>
        <p id="s07-item-text" class="speech-bubble">卡片 1：「聽說某位師父會神通，能算準下次樂透頭獎號碼。」</p>
      </div>

      <div class="tab-row js-only" role="group" aria-label="換一張卡片試試看">
        <button type="button" data-epitem="t1" aria-pressed="true">卡片 1：預知樂透號碼</button>
        <button type="button" data-epitem="t2" aria-pressed="false">卡片 2：兩千多年前刻在石柱上的字</button>
        <button type="button" data-epitem="t3" aria-pressed="false">卡片 3：佛陀精確出生是哪一天</button>
        <button type="button" data-epitem="t4" aria-pressed="false">卡片 4：當新的好證據出現時！</button>
      </div>

      <div class="controls js-only" role="group" aria-label="放進哪個抽屜">
        <button type="button" data-epcat="belief" aria-pressed="false">放進抽屜一（我自己相信）</button>
        <button type="button" data-epcat="supported" aria-pressed="false">放進抽屜二（找得到證據）</button>
        <button type="button" data-epcat="unknown" aria-pressed="false">放進抽屜三（現在還不知道）</button>
        <button type="button" id="s07-reset">清空重放</button>
      </div>
      <p id="s07-result" class="result" role="status" aria-live="polite">選卡片再選抽屜，看哪一個抽屜拉開亮燈！</p>
    </div>

    <div class="story-takeaway">
      <h3>先老實分清這三個抽屜，就不怕把信仰和歷史混在一起</h3>
      <p>經裡把這第一步叫做「保護真實」：老實說「這是我現在的信念」，不要還沒查證就大喊「只有我對，其他人都笨蛋」。之後若真的找到新證據（像卡片 4 那樣），還可以隨時把卡片換進更確定的抽屜！</p>
    </div>

    <div class="source-door">
      <p>📖 <strong>這段故事從哪裡來？</strong>取材自巴利文《中部・商伽經》對「守護真實」三階段的清楚區分。</p>
      <a class="button secondary" href="./history-research.html#truth-epistemology">看佛經原文與學者考證 →</a>
    </div>

    <details class="story-more">
      <summary>看看怎麼把一句「聽起來太絕對」的話改得更老實</summary>
      <div class="table-wrap"><table role="table"><caption>太武斷的講法 vs 老實又可查的講法</caption><thead><tr><th>容易講過頭的話</th><th>比較實在的講法</th></tr></thead><tbody>
        <tr><th data-label="講過頭">佛陀一定親口講過這句！</th><td data-label="實在講法">某幾部古老佛經裡有這樣記。</td></tr>
        <tr><th data-label="講過頭">兩千年來絕對沒變過！</th><td data-label="實在講法">照目前找得到的早年寫本看來是這樣。</td></tr>
        <tr><th data-label="講過頭">他一定已經完全開悟！</th><td data-label="實在講法">看得出他言行滿一致的，至於內心全貌我測不到。</td></tr>
        <tr><th data-label="講過頭">照我信的方法做一定有效！</th><td data-label="實在講法">在某種情況下看到對某些人有幫助，但仍有條件限制。</td></tr>
      </tbody></table></div>
    </details>

    <nav class="station-nav" aria-label="第 7 關導覽"><p class="small">目前第 7／22 關 · 第一區結束</p><div class="button-row"><a class="button secondary" href="#menu">↑ 回到全館地圖</a><a class="button secondary" href="#direction">← 上一關</a><a class="button" href="#evidence">進入第二區：真實古物大探索 →</a></div></nav>
  </div></section>`
];
