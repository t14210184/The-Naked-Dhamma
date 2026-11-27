// Act 1 (Stations 01–07): How the Early Texts Teach Verification

export const ACT1_STATIONS = [
  // S01
  `<section id="four" class="chapter" data-station="1" tabindex="-1"><div class="container">
    <div class="kicker">第 01 站 · 佛陀最後一段旅程</div>
    <h2>誰說的都要查</h2>
    <p>假設今天有個人跑來對你說：「我親耳聽過佛陀這樣講！」你該不該馬上點頭？早期《大般涅槃經》（DN 16）與漢譯《長阿含》第2經《遊行經》（DA 2）描寫佛陀最後旅途，主動教弟子怎麼面對四種不同「權威來源」的轉述。<a class="src" href="./history-research.html#four-authority">DN 16；DA 2（研究對讀）</a> <a class="src" href="#s-four">來源索引</a></p>
    <div class="scene">
      <svg viewBox="0 0 460 190" role="img" aria-labelledby="s01-svg-t s01-svg-d">
        <title id="s01-svg-t">四位前來轉述的訪客與同一張查證桌</title>
        <desc id="s01-svg-d">四位聲稱不同權威來源的訪客站在左側，右側為放置經與律卷軸的查證桌（現代原創示意）。</desc>
        <rect width="460" height="190" rx="14" fill="#173832"/>
        <g fill="#e8d6b9" stroke="#f7e6cc" stroke-width="2">
          <circle cx="52" cy="56" r="14"/><path d="M36 96q16-24 32 0z"/>
          <circle cx="116" cy="56" r="14"/><path d="M100 96q16-24 32 0z"/>
          <circle cx="180" cy="56" r="14"/><path d="M164 96q16-24 32 0z"/>
          <circle cx="244" cy="56" r="14"/><path d="M228 96q16-24 32 0z"/>
        </g>
        <rect x="296" y="72" width="136" height="66" rx="10" fill="#9a6b3f" stroke="#f1d09a" stroke-width="3"/>
        <rect x="314" y="54" width="44" height="24" rx="5" fill="#fffdf7" stroke="#79521e" stroke-width="2"/>
        <rect x="368" y="54" width="44" height="24" rx="5" fill="#fffdf7" stroke="#79521e" stroke-width="2"/>
        <g fill="#f8f5ee" font-size="11.5" text-anchor="middle" font-weight="700">
          <text x="52" y="122">1.稱親聞</text>
          <text x="116" y="122">2.某僧團</text>
          <text x="180" y="122">3.多長老</text>
          <text x="244" y="122">4.一長老</text>
          <text x="336" y="71" fill="#243330">經</text>
          <text x="390" y="71" fill="#243330">律</text>
          <text x="364" y="114">同一張查證桌</text>
        </g>
        <text x="230" y="170" text-anchor="middle" fill="#b7e3ca" font-size="12">現代原創示意：四種權威轉述均須經過同一程序</text>
      </svg>
    </div>
    <ol class="steps">
      <li><h3>第一位來客（轉述主張）</h3><p>（白話重述）有比丘宣稱：「我親自從佛陀聽到、領受這項法與律。」</p></li>
      <li><h3>第二位來客（轉述主張）</h3><p>有比丘宣稱：「我在某住處有上座領導的僧團面前親聞此說。」</p></li>
      <li><h3>第三位來客（轉述主張）</h3><p>有比丘宣稱：「我在多位博學持法、持律、持本母的長老前領受此說。」</p></li>
      <li><h3>第四位來客（轉述主張）</h3><p>有比丘宣稱：「我從某位博學持法、持律的長老親自聽到。」</p></li>
    </ol>
    <blockquote>不應不信，亦不應毀；當於諸經推其虛實，依律、依法究其本末。<cite>《長阿含經》第2經《遊行經》，T01, no. 1, 17c04–06。古漢文短引。<a class="src" href="./history-research.html#four-authority">查看研究對讀</a></cite></blockquote>
    <div class="play">
      <span class="kicker">互動查證桌 · 操作全部四位來客 × 三種回應</span>
      <h3>輪流檢驗四位來客，看看誰能免查？</h3>
      <div class="tab-row js-only" role="group" aria-label="選擇四位來客">
        <button type="button" data-visitor="v1" aria-pressed="true">1. 稱親聞佛陀</button>
        <button type="button" data-visitor="v2" aria-pressed="false">2. 稱某僧團</button>
        <button type="button" data-visitor="v3" aria-pressed="false">3. 稱多位長老</button>
        <button type="button" data-visitor="v4" aria-pressed="false">4. 稱單一長老</button>
      </div>
      <p id="s01-visitor-text" class="note">第一位：聲稱親聞佛陀 — 「我在佛陀面前親耳聽到、親手領受這套法與律。」</p>
      <div class="controls js-only" role="group" aria-label="對來客的處理">
        <button type="button" data-vaction="believe" aria-pressed="false">直接相信</button>
        <button type="button" data-vaction="reject" aria-pressed="false">立刻斥責</button>
        <button type="button" data-vaction="check" aria-pressed="false">先記清再比對經律</button>
        <button type="button" id="s01-reset">重設查證桌</button>
      </div>
      <p id="s01-result" class="result" role="status" aria-live="polite">請點選上面四位來客與三種處理方式；沒有任何一位可跳過查證。</p>
      <p id="s01-progress" class="small" role="status" aria-live="polite">已檢驗來客：0／4 位（無任何一位可免查）</p>
    </div>
    <div class="play"><span class="kicker">情境挑戰 1／5 · 現代情境</span><h3>哪一位可以免查？</h3>
      <div class="choices" role="group" aria-label="哪一位可以免查？">
        <button type="button" data-feedback="連聲稱親耳聽過佛陀的人也須查證（DN 16:4.8）。" aria-controls="q-four" aria-pressed="false">A．親自聽過佛陀的人</button>
        <button type="button" data-feedback="整座寺院的集體權威也不能免查（DN 16:4.9）。" aria-controls="q-four" aria-pressed="false">B．整座寺院的長老</button>
        <button type="button" data-feedback="正確：四種來源適用同一套經律審查。" aria-controls="q-four" aria-pressed="false">C．四位都要查</button>
      </div>
      <p class="result" id="q-four" role="status" aria-live="polite">點選答案，這裡會顯示理由。</p>
      <p class="small"><a href="./history-research.html#four-authority">查這題的原典與研究 →</a></p>
      <p class="small"><strong>不按也能讀：</strong>C。四種來源一律比對；資料不足時保留判斷則是現代加上的誠實選項。</p>
    </div>
    <h3>別把三種同名規則與部派異文混在一起</h3>
    <div class="table-wrap"><table role="table"><caption>跨部派四大教法與同名規則對照</caption><thead><tr><th>文獻／傳統</th><th>比對標準</th><th>歷史學意義與限制</th></tr></thead><tbody>
      <tr><th data-label="文獻／傳統">巴利 DN 16／AN 4.180</th><td data-label="比對標準">經（sutta）、律（vinaya）兩項</td><td data-label="歷史學意義與限制">Sujato 討論當時 sutta 未必指今日封閉整部經藏，可能指早期教法綱要（本母／四諦）。</td></tr>
      <tr><th data-label="文獻／傳統">法藏部《長阿含》DA 2</th><td data-label="比對標準">諸經、律、法 三項（T01, 17c）</td><td data-label="歷史學意義與限制">較巴利多出「依法」，顯示口傳與翻譯層次差異。</td></tr>
      <tr><th data-label="文獻／傳統">《增壹阿含》EA 28.5</th><td data-label="比對標準">契經、律、阿毘曇、戒（T02, 652b）</td><td data-label="歷史學意義與限制">將「阿毘曇」列入，反映較晚期三藏分類形成後的編輯痕跡。</td></tr>
      <tr><th data-label="文獻／傳統">吐魯番梵本 SF 245</th><td data-label="比對標準">依契經不依人；驗經、律、法性（dharmatā）</td><td data-label="歷史學意義與限制">Waldschmidt 刊本 Wal 24.2–13 明文對比「依經不依人」。</td></tr>
      <tr><th data-label="文獻／傳統">律藏《大品》／後世四依</th><td data-label="比對標準">律制四大標準（Kd 6）／依法不依人等四依</td><td data-label="歷史學意義與限制">Lamotte 研究指出三者功能與時代不同，不可混為一談。</td></tr>
    </tbody></table></div>
    <p><a class="src" href="./history-research.html#four-authority">閱讀 S01 完整原文對讀與限制</a></p>
    <nav class="station-nav" aria-label="站點 1 導覽"><p class="small">目前第 1／22 站</p><div class="button-row"><a class="button secondary" href="#menu">↑ 四幕目錄</a><a class="button secondary" href="./history-research.html#four-authority">研究詳頁</a><a class="button" href="#drum">下一站 →</a></div></nav>
  </div></section>`,

  // S02
  `<section id="drum" class="chapter" data-station="2" tabindex="-1"><div class="container">
    <div class="kicker">第 02 站 · 兩個古老版本的警告</div>
    <h2>鼓還叫原來的鼓嗎？</h2>
    <p>古代有面名叫阿能訶（Āṇaka）的鼓。巴利《相應部》SN 20.7 說它裂開時人們不斷打入木楔（āṇi），直到原本的木鼓框完全消失；漢譯《雜阿含經》SA 1258 則說這面鼓聲音原徹四十里，破後改繃牛皮纏補，美聲卻再也回不來，最後皮剝落唯餘聚木。連「警告傳承變質」的故事本身，在不同傳承裡也有異文！<a class="src" href="./history-research.html#drum-parallels">SN 20.7；SA 1258（研究對讀）</a> <a class="src" href="#s-drum">來源索引</a></p>
    <div class="play">
      <p class="kicker">雙版本視覺對照 · 同一面鼓（教學示意，非原經比例）</p>
      <h3>切換巴利版與漢譯版，看看材質如何改變</h3>
      <div class="controls drum-modes js-only" role="group" aria-label="古鼓版本">
        <button id="mode-pali" type="button" aria-pressed="true">巴利 SN 20.7（木楔）</button>
        <button id="mode-han" type="button" aria-pressed="false">漢譯 SA 1258（牛皮纏補）</button>
        <button id="drum-sound" type="button" aria-pressed="false">合成音效：預設關閉</button>
      </div>
      <p id="drum-mode">巴利版 SN 20.7：鼓身裂開後反覆打入木楔（āṇi），原木框逐漸消失。</p>
      <div class="drum-visual">
        <svg viewBox="0 0 420 310" role="img" aria-labelledby="drum-title drum-desc">
          <title id="drum-title">古鼓修補雙版本示意</title>
          <desc id="drum-desc">巴利版本以五片木楔逐次替換原鼓木框；漢譯版本以牛皮纏補鼓面及後續剝落唯餘聚木。步數為教學示意。</desc>
          <rect width="420" height="310" rx="20" fill="#122d38"/>
          <path d="M110 90Q74 166 110 240Q210 280 310 240Q346 166 310 90Z" fill="#a66f43" stroke="#f7d9a0" stroke-width="5"/>
          <ellipse cx="210" cy="90" rx="100" ry="38" fill="#e7c59a" stroke="#f8e0ae" stroke-width="6"/>
          <ellipse cx="210" cy="240" rx="100" ry="33" fill="none" stroke="#d4a46c" stroke-width="5"/>
          <g stroke="#623e31" stroke-width="7"><path d="M133 124L155 244M180 131L189 260M230 131L221 260M277 124L255 244"/></g>
          <g fill="#9bcfc4" stroke="#0e3a40" stroke-width="4">
            <rect class="drum-patch" x="109" y="127" width="42" height="118" rx="10"/>
            <rect class="drum-patch" x="150" y="139" width="42" height="118" rx="10"/>
            <rect class="drum-patch" x="190" y="139" width="42" height="118" rx="10"/>
            <rect class="drum-patch" x="230" y="139" width="42" height="118" rx="10"/>
            <rect class="drum-patch" x="271" y="127" width="42" height="118" rx="10"/>
          </g>
          <g id="leather" opacity="0">
            <ellipse cx="210" cy="90" rx="101" ry="39" fill="#7d4a2d" stroke="#f8e0ae" stroke-width="7"/>
            <path d="M122 100Q210 131 298 100M135 78Q210 54 285 78" stroke="#e8c58d" stroke-width="4" fill="none" stroke-dasharray="7 4"/>
            <path d="M116 117l10 103m178-103-10 103" stroke="#d49e6a" stroke-width="11"/>
          </g>
          <g id="leather-peel" opacity="0">
            <path d="M115 95 L295 85 L270 120 L130 125 Z" fill="#122d38" stroke="#f0a89b" stroke-width="3" stroke-dasharray="5 3"/>
            <text x="210" y="112" text-anchor="middle" fill="#f0a89b" font-size="14" font-weight="700">皮大剝落・唯有聚木</text>
          </g>
          <text x="210" y="296" text-anchor="middle" fill="#f7e6cc" font-size="18">傳承之鼓（現代示意）</text>
        </svg>
      </div>
      <p id="drum-status" class="result" role="status" aria-live="polite">尚未修補。</p>
      <div class="drum-actions js-only">
        <button class="button" id="patch" type="button">修補一次</button>
        <button id="reset-drum" type="button">重設古鼓</button>
      </div>
      <p class="small">提醒：五片木楔與合成音效僅作教學示意（合成音效不代表古代鼓聲，且不冒充原經步數）；兩版本各自保存不同細節，不能互相取代。</p>
    </div>
    <div class="grid">
      <article class="card"><h3>巴利 SN 20.7（無JS靜態對照）</h3><p>鼓身木框（pokkharaphalaka）裂開後反覆打入木楔（āṇi），終至原木消失、只剩木楔聚（āṇisaṅghāṭo）。比喻後代忽視如來深奧空相應經，偏好詩人華麗辭藻。</p></article>
      <article class="card"><h3>漢譯 SA 1258（無JS靜態對照）</h3><p>鼓聲原徹四十里（T02, 345b），裂後以牛皮周匝纏縛而失美聲，後皮大剝落唯餘聚木。比喻不修身戒心慧、忽視空相應隨順緣起法而專崇世俗雜論。</p></article>
    </div>
    <aside class="note"><b>不是宗派黑名單</b><p>如 Bhikkhu Sujato 討論指出，目前無法斷定巴利或漢譯哪一版更原始；也不可用這則譬喻指控現代某個宗派「全是假的」。<a class="src" href="./history-research.html#drum-parallels">研究限制</a></p></aside>
    <nav class="station-nav" aria-label="站點 2 導覽"><p class="small">目前第 2／22 站</p><div class="button-row"><a class="button secondary" href="#menu">↑ 四幕目錄</a><a class="button secondary" href="#four">← 上一站</a><a class="button secondary" href="./history-research.html#drum-parallels">研究詳頁</a><a class="button" href="#teacher">下一站 →</a></div></nav>
  </div></section>`,

  // S03
  `<section id="teacher" class="chapter" data-station="3" tabindex="-1"><div class="container">
    <div class="kicker">第 03 站 · 不會讀心的人怎麼辨認導師</div>
    <h2>連老師也可以調查？</h2>
    <p>《中部》第47經《思察經》（MN 47）與漢譯《中阿含》第186經《求解經》（MA 186）記載：如果你不會讀心術，怎麼知道一位老師是否真如他所宣稱那樣覺悟？經文說，連佛陀自己也可以用眼睛看、耳朵聽來調查。<a class="src" href="./history-research.html#teacher-investigation">MN 47；MA 186</a> <a class="src" href="#s-teacher">來源索引</a></p>
    <ol class="steps">
      <li><h3>看身語清淨與雜染</h3><p>眼見耳聞的言行中有無貪瞋癡混雜的跡象？</p></li>
      <li><h3>看時間夠不夠久</h3><p>是剛起步裝出來的，還是長期（dīgharattaṁ）一貫如此？</p></li>
      <li><h3>看成名得利養之後</h3><p>名氣與供養大增後，是否出現新的過患或傲慢？</p></li>
      <li><h3>問動機而不臆測神通</h3><p>是因害怕才守規矩，還是真能離欲？（仍限於可觀察言行與對談查驗。）</p></li>
    </ol>
    <div class="play">
      <span class="kicker">觀察時點檢驗器 · 虛構示範情境（不影射真實人物）</span>
      <h3>切換不同時期，把「看到的」和「猜想的」分開</h3>
      <div class="tab-row js-only" role="group" aria-label="選擇觀察時點">
        <button type="button" data-tstage="early" aria-pressed="true">1. 成名前（初見兩週）</button>
        <button type="button" data-tstage="famous" aria-pressed="false">2. 成名得供養後</button>
        <button type="button" data-tstage="critic" aria-pressed="false">3. 受公開批評時</button>
      </div>
      <p id="s03-stage-text" class="note">【情境一：成名前（虛構示範）】該老師生活簡樸、講解有條理，但你只相處兩週，尚未見過他面對金錢與衝突。</p>
      <div class="controls js-only" role="group" aria-label="你的判斷">
        <button type="button" data-tjudge="observe" aria-pressed="false">依現有言行評估</button>
        <button type="button" data-tjudge="insufficient" aria-pressed="false">資料不足，繼續長期觀察</button>
        <button type="button" data-tjudge="mind" aria-pressed="false">認定他已全知開悟</button>
        <button type="button" id="s03-reset">重設情境</button>
      </div>
      <p id="s03-judge-result" class="result" role="status" aria-live="polite">請依可觀察言行選擇判斷。</p>
    </div>
    <div class="play"><span class="kicker">情境挑戰 2／5 · 現代情境</span><h3>有百萬粉絲的大師說：『我的證量不用你查。』</h3>
      <div class="choices" role="group" aria-label="有百萬粉絲的大師說：『我的證量不用你查。』">
        <button type="button" data-feedback="人氣不能代替證據，MN 47 連佛陀都接受弟子長期查驗。" aria-controls="q-teacher" aria-pressed="false">A．信徒多，所以正確</button>
        <button type="button" data-feedback="資料不足不等於已證明他蓄意騙人，宜保持查證。" aria-controls="q-teacher" aria-pressed="false">B．立刻認定他騙人</button>
        <button type="button" data-feedback="正確：尊重和查證並不衝突；終點是「有根據的信心（ākāravatī saddhā）」，不是情緒性猜疑。" aria-controls="q-teacher" aria-pressed="false">C．觀察言行並查證主張</button>
      </div>
      <p class="result" id="q-teacher" role="status" aria-live="polite">點選答案，這裡會顯示理由。</p>
      <p class="small"><a href="./history-research.html#teacher-investigation">查這題的原典與研究 →</a></p>
      <p class="small"><strong>不按也能讀：</strong>C。頭銜、外表、人氣不夠；良好言行也不等於證明導師全知。</p>
    </div>
    <nav class="station-nav" aria-label="站點 3 導覽"><p class="small">目前第 3／22 站</p><div class="button-row"><a class="button secondary" href="#menu">↑ 四幕目錄</a><a class="button secondary" href="#drum">← 上一站</a><a class="button secondary" href="./history-research.html#teacher-investigation">研究詳頁</a><a class="button" href="#kalama">下一站 →</a></div></nav>
  </div></section>`,

  // S04
  `<section id="kalama" class="chapter" data-station="4" tabindex="-1"><div class="container">
    <div class="kicker">第 04 站 · 伽藍人的困擾</div>
    <h2>每個人都說自己對</h2>
    <p>不同宗教導師來到伽藍人住的小鎮，每位都稱讚自己、貶低別人，讓尚未歸信的居民十分困惑。巴利《增支部》AN 3.65 提出十種「不可單憑」的理由；漢譯《中阿含》第16經《伽藍經》（MA 16）則沒有那十條清單，而是直接切入貪瞋癡與善惡行為。千萬別把這部經誤讀成「只信自己喜歡的就是對」！<a class="src" href="./history-research.html#kalama-context">AN 3.65；MA 16；Bodhi (1988)</a> <a class="src" href="#s-kalama">來源索引</a></p>
    <div class="play">
      <span class="kicker">版本比對與四種安穩探索</span>
      <div class="controls js-only" role="group" aria-label="伽藍經版本切換">
        <button type="button" data-kalama-ver="pali" aria-pressed="true">巴利 AN 3.65 結構</button>
        <button type="button" data-kalama-ver="han" aria-pressed="false">漢譯 MA 16 差異</button>
      </div>
      <p id="s04-version-out" class="result" role="status" aria-live="polite">巴利 AN 3.65：先列「十種不應單憑的理由」，接著問貪瞋癡是否導致傷害、智者讚責何者，最後給出四種安穩。</p>
    </div>
    <div class="table-wrap"><table role="table"><caption>巴利 AN 3.65 十種不能單憑的理由 · 今天的例子（註：漢譯 MA 16 無此十條清單）</caption><thead><tr><th>不能單憑</th><th>今天的例子</th></tr></thead><tbody>
      <tr><th data-label="不能單憑">口傳（anussava）</th><td data-label="今天的例子">大家一直這樣說</td></tr>
      <tr><th data-label="不能單憑">師徒傳承（paramparā）</th><td data-label="今天的例子">祖師代代相傳</td></tr>
      <tr><th data-label="不能單憑">傳聞（itikirā）</th><td data-label="今天的例子">群組與網友都在轉發</td></tr>
      <tr><th data-label="不能單憑">經典收集（piṭakasampadā）</th><td data-label="今天的例子">書裡或藏經裡有寫</td></tr>
      <tr><th data-label="不能單憑">邏輯推理（takkahetu）</th><td data-label="今天的例子">聽起來很合邏輯</td></tr>
      <tr><th data-label="不能單憑">推論（nayahetu）</th><td data-label="今天的例子">看一件事推測全部</td></tr>
      <tr><th data-label="不能單憑">思量外相（ākāraparivitakka）</th><td data-label="今天的例子">感覺想通了就一定對</td></tr>
      <tr><th data-label="不能單憑">符合己見（diṭṭhinijjhānakkhanti）</th><td data-label="今天的例子">正好符合我本來立場</td></tr>
      <tr><th data-label="不能單憑">說者看似有能力（bhabbarūpatā）</th><td data-label="今天的例子">學歷高、外表莊嚴可信</td></tr>
      <tr><th data-label="不能單憑">尊敬自己的老師（samaṇo no garu）</th><td data-label="今天的例子">因為他是我師父</td></tr>
    </tbody></table></div>
    <div class="play">
      <span class="kicker">四種安穩（Assāsa）情境展開</span>
      <h3>就算還不確定死後世界，為什麼不害人仍站得住腳？</h3>
      <div class="tab-row js-only" role="group" aria-label="四種安穩情境">
        <button type="button" data-assasa="a1" aria-pressed="true">1. 若有來世</button>
        <button type="button" data-assasa="a2" aria-pressed="false">2. 若無來世</button>
        <button type="button" data-assasa="a3" aria-pressed="false">3. 若惡有報</button>
        <button type="button" data-assasa="a4" aria-pressed="false">4. 若惡無報</button>
      </div>
      <p id="s04-assasa-out" class="result" role="status" aria-live="polite">第一安穩：若確有來世與善惡業報，不懷怨害、清淨行善者死後可生善處（經典觀點，非科學已證實來世）。</p>
      <p class="small">（無JS靜態完整對照：①若有來世得善趣；②若無來世今生亦無怨無惱受智者稱譽；③若惡有惡果則無須恐懼；④若惡無此果今生仍清白。此思考不保證善人現世永不受天災或他人傷害。）</p>
    </div>
    <div class="play"><span class="kicker">情境挑戰 3／5 · 現代情境</span><h3>聽到一個符合自己想法的理論，你怎麼做？</h3>
      <div class="choices" role="group" aria-label="聽到一個符合自己想法的理論，你怎麼做？">
        <button type="button" data-feedback="可能落入確認偏誤（第八條：只因符合自己原本見解就接受）。" aria-controls="q-kalama" aria-pressed="false">A．信，因為符合我</button>
        <button type="button" data-feedback="正確：須檢視是否減少貪瞋癡與傷害、智者評價及其他證據（Bodhi 1988）。" aria-controls="q-kalama" aria-pressed="false">B．查反例、行為後果與其他證據</button>
        <button type="button" data-feedback="經文並未否定全部經典與理性學習，而是反對「單憑」其中一項定案。" aria-controls="q-kalama" aria-pressed="false">C．凡經典都錯</button>
      </div>
      <p class="result" id="q-kalama" role="status" aria-live="polite">點選答案，這裡會顯示理由。</p>
      <p class="small"><a href="./history-research.html#kalama-context">查這題的原典與研究 →</a></p>
      <p class="small"><strong>不按也能讀：</strong>B。理由需要檢驗，注意貪瞋癡與傷害後果。</p>
    </div>
    <nav class="station-nav" aria-label="站點 4 導覽"><p class="small">目前第 4／22 站</p><div class="button-row"><a class="button secondary" href="#menu">↑ 四幕目錄</a><a class="button secondary" href="#teacher">← 上一站</a><a class="button secondary" href="./history-research.html#kalama-context">研究詳頁</a><a class="button" href="#rahula">下一站 →</a></div></nav>
  </div></section>`,

  // S05
  `<section id="rahula" class="chapter" data-station="5" tabindex="-1"><div class="container">
    <div class="kicker">第 05 站 · 阿育王碑銘也提到的教誡</div>
    <h2>一盆水、一面鏡子</h2>
    <p>佛陀探望年輕的羅睺羅，洗完腳後沒有直接講大道理，而是拿起洗腳盆做了一連串動作：倒到剩一點點、全倒光、反蓋在地上、再翻回正面——藉此警告「故意說謊卻不知羞恥」的人，他的修行實質就跟空盆一樣。經文還用戰場上的王象和每天照臉的鏡子作比喻。<a class="src" href="./history-research.html#rahula-reflection">MN 61；MA 14《羅云經》</a> <a class="src" href="./history-research.html#bairat-rahula">拜拉特石刻交叉佐證</a></p>
    <div class="play">
      <span class="kicker">動手倒水盆 · 對應 MN 61 與 MA 14 原文順序</span>
      <h3>點點看洗腳盆的五個狀態</h3>
      <div class="scene" style="max-width:340px;margin:10px auto">
        <svg viewBox="0 0 240 130" role="img" aria-labelledby="s05-basin-t s05-basin-d">
          <title id="s05-basin-t">羅睺羅洗腳盆與戰象側面示意</title>
          <desc id="s05-basin-d">左側為可翻轉與調水位的洗腳盆，右側為具長鼻、象牙與四肢的正常比例側面大象示意。</desc>
          <rect width="240" height="130" rx="12" fill="#173832"/>
          <g id="basin-bowl">
            <path d="M35 45 L105 45 L94 94 L46 94 Z" fill="#c7a37d" stroke="#f7e6cc" stroke-width="3"/>
            <clipPath id="bclip"><path d="M38 47 L102 47 L92 92 L48 92 Z"/></clipPath>
            <rect id="basin-water" x="35" y="48" width="70" height="42" fill="#70c2b4" clip-path="url(#bclip)"/>
          </g>
          <!-- Anatomically recognizable side-profile elephant (trunk, ears, tusks, 4 legs, tail) -->
          <g fill="#9ba7a5" stroke="#e6e3dc" stroke-width="2">
            <path d="M148 82 C142 62 152 46 174 46 C192 46 205 56 207 72 L207 104 L197 104 L197 86 L184 86 L184 104 L174 104 L174 86 L160 86 L160 104 L151 104 Z"/>
            <path d="M198 52 C214 48 225 58 224 72 C223 82 228 89 231 85" fill="none" stroke="#e6e3dc" stroke-width="5" stroke-linecap="round"/>
            <ellipse cx="198" cy="60" rx="8" ry="12" fill="#7c8a88"/>
            <path d="M210 68 Q220 71 223 64" fill="none" stroke="#fffdf7" stroke-width="3" stroke-linecap="round"/>
            <path d="M148 64 Q139 74 142 84" fill="none" stroke="#e6e3dc" stroke-width="2.5" stroke-linecap="round"/>
          </g>
          <text x="184" y="120" text-anchor="middle" fill="#b7e3ca" font-size="10">王象唯護長鼻（現代示意）</text>
        </svg>
      </div>
      <div class="controls js-only" role="group" aria-label="洗腳盆動作">
        <button type="button" data-basin="little" aria-pressed="false">1. 留少許水</button>
        <button type="button" data-basin="empty" aria-pressed="false">2. 全部倒光</button>
        <button type="button" data-basin="flipped" aria-pressed="false">3. 翻覆空盆</button>
        <button type="button" data-basin="upright" aria-pressed="false">4. 仰轉空器</button>
        <button type="button" data-basin="full" aria-pressed="true">重設盛滿水</button>
      </div>
      <p id="s05-basin-out" class="result" role="status" aria-live="polite">初始盛滿水的洗腳盆：準備開始操作（MN 61／MA 14）。</p>
      <p class="small">王象譬喻脈絡：古印度戰象上陣時前腳、後腳、頭耳牙尾皆用來戰鬥，唯獨保護長鼻；一旦連長鼻也不顧，代表毫無底線。經文以此比喻故意妄語不知羞愧者（《中阿含》14）。</p>
    </div>
    <div class="play">
      <span class="kicker">鏡子省察 · 做前、做中、做後</span>
      <div class="tab-row js-only" role="group" aria-label="三時省察">
        <button type="button" data-mirror="before" aria-pressed="true">做之前</button>
        <button type="button" data-mirror="during" aria-pressed="false">做當中</button>
        <button type="button" data-mirror="after" aria-pressed="false">做之後</button>
      </div>
      <p id="s05-mirror-out" class="result" role="status" aria-live="polite">做之前（鏡前自照）：先想這句話或行動會不會傷害自己、別人或雙方？若會傷害，盡力不做。</p>
    </div>
    <div class="play"><span class="kicker">情境挑戰 4／5 · 現代情境</span><h3>你轉發一個消息，後來發現錯了。</h3>
      <div class="choices" role="group" aria-label="你轉發一個消息，後來發現錯了。">
        <button type="button" data-feedback="如果他人已受誤導或影響，悄悄刪掉不等於負責修正。" aria-controls="q-rahula" aria-pressed="false">A．刪掉就當沒事</button>
        <button type="button" data-feedback="正確：把做後反省（坦承過失、避免再犯）應用在現代訊息查證。" aria-controls="q-rahula" aria-pressed="false">B．公開更正，避免再傳</button>
        <button type="button" data-feedback="這與經文戒除故意妄語完全相反。" aria-controls="q-rahula" aria-pressed="false">C．再傳一個假消息</button>
      </div>
      <p class="result" id="q-rahula" role="status" aria-live="polite">點選答案，這裡會顯示理由。</p>
      <p class="small"><a href="./history-research.html#bairat-rahula">前往研究頁看拜拉特石刻 × MN 61 交叉佐證 →</a></p>
      <p class="small"><strong>不按也能讀：</strong>B。前3世紀阿育王拜拉特石刻明文推薦「對羅睺羅關於妄語的教誡」，證實此教誡主題早於前3世紀已流傳，但不等於證明整部經每字不變。</p>
    </div>
    <p><a class="button secondary" href="#evidence">跳往第 08 站直接看拜拉特石刻放大圖</a></p>
    <nav class="station-nav" aria-label="站點 5 導覽"><p class="small">目前第 5／22 站</p><div class="button-row"><a class="button secondary" href="#menu">↑ 四幕目錄</a><a class="button secondary" href="#kalama">← 上一站</a><a class="button secondary" href="./history-research.html#rahula-reflection">研究詳頁</a><a class="button" href="#direction">下一站 →</a></div></nav>
  </div></section>`,

  // S06
  `<section id="direction" class="chapter" data-station="6" tabindex="-1"><div class="container">
    <div class="kicker">第 06 站 · 修行方向不是功德價目表</div>
    <h2>教法把你帶去哪裡？</h2>
    <p>摩訶波闍波提請佛陀給一句簡要可守持的教法。巴利《增支部》AN 8.53（亦見律藏《小品》Cv 10.5）給了八組清楚的「方向羅盤」——看一套教法是令人更貪婪執著、增加負擔，還是越來越少欲知足、平靜易處。<a class="src" href="./history-research.html#direction-tests">AN 8.53；AN 7.83；Cv 10.5</a> <a class="src" href="#s-direction">來源索引</a></p>
    <div class="table-wrap"><table role="table"><caption>八組修行方向對照（AN 8.53）</caption><thead><tr><th>✓ 趨向解脫方向</th><th>× 相反方向</th></tr></thead><tbody>
      <tr><th data-label="✓ 趨向解脫方向">離貪（virāga）</th><td data-label="× 相反方向">增長貪染（sarāga）</td></tr>
      <tr><th data-label="✓ 趨向解脫方向">離繫縛（visaṁyoga）</th><td data-label="× 相反方向">增加束縛（saṁyoga）</td></tr>
      <tr><th data-label="✓ 趨向解脫方向">拆解／減少積聚（apacaya）</th><td data-label="× 相反方向">追逐積聚（ācaya）</td></tr>
      <tr><th data-label="✓ 趨向解脫方向">少欲（appicchatā）</th><td data-label="× 相反方向">擴張欲求（mahicchatā）</td></tr>
      <tr><th data-label="✓ 趨向解脫方向">知足（santuṭṭhi）</th><td data-label="× 相反方向">不滿足（asantuṭṭhi）</td></tr>
      <tr><th data-label="✓ 趨向解脫方向">遠離紛擾（paviveka）</th><td data-label="× 相反方向">沉迷群聚紛擾（saṅgaṇikā）</td></tr>
      <tr><th data-label="✓ 趨向解脫方向">精勤（vīriyārambha）</th><td data-label="× 相反方向">懈怠（kosajja）</td></tr>
      <tr><th data-label="✓ 趨向解脫方向">易於供養／不造成負擔（subharatā）</th><td data-label="× 相反方向">難以供養／增加負擔（dubbharatā）</td></tr>
    </tbody></table></div>
    <div class="play">
      <span class="kicker">方向羅盤練習 · 生活情境與重要反例</span>
      <h3>用日常情境測試「修行方向」，也要看清這把尺不能測什麼</h3>
      <div class="controls js-only" role="group" aria-label="生活方向情境">
        <button type="button" data-dir="d1" aria-pressed="true">情境 A：不藏私分享正確知識</button>
        <button type="button" data-dir="d2" aria-pressed="false">情境 B：不斷推銷高價改運課程</button>
        <button type="button" data-dir="d3" aria-pressed="false">情境 C：正常上班養家</button>
        <button type="button" data-dir="d_counter" aria-pressed="false">反例：外表樸素就能看穿證量嗎？</button>
      </div>
      <p id="s06-dir-out" class="result" role="status" aria-live="polite">【分享正確資訊而不藏私炫耀】方向趨向「少欲、不積聚（apacaya）、離貪」——減輕占有與攀比（生活比喻，非果位判定）。</p>
      <p class="small">提醒：此八項是用來檢驗「教法的修行實效方向」，不能用來鑑定某部經「是否為歷史佛陀親口原話」，也絕不否定在家人正當工作養家。</p>
    </div>
    <nav class="station-nav" aria-label="站點 6 導覽"><p class="small">目前第 6／22 站</p><div class="button-row"><a class="button secondary" href="#menu">↑ 四幕目錄</a><a class="button secondary" href="#rahula">← 上一站</a><a class="button secondary" href="./history-research.html#direction-tests">研究詳頁</a><a class="button" href="#truth">下一站 →</a></div></nav>
  </div></section>`,

  // S07
  `<section id="truth" class="chapter" data-station="7" tabindex="-1"><div class="container">
    <div class="kicker">第 07 站 · 護持真實</div>
    <h2>相信，和知道，差在哪？</h2>
    <p>《中部》MN 95《商伽經》指出五種常見依據——<strong>信仰、喜好、口傳、推理、見解忍可</strong>——在現實中都可能「誠信卻為空虛謬誤」，也可能「不信卻真實無誤」。因此經文提出三道階梯，第一階就叫「守護真理」：誠實說「這是我的信念」，而不獨斷宣告「只有我對，其他都是愚妄」。<a class="src" href="./history-research.html#truth-epistemology">MN 95:14, 19–21</a> <a class="src" href="#s-truth">來源索引</a></p>
    <div class="play">
      <span class="kicker">訊息分類桌（按鍵替代拖曳，無障礙操作）</span>
      <h3>同一種信念，證據不同，位置就不同</h3>
      <div class="tab-row js-only" role="group" aria-label="選擇主張">
        <button type="button" data-epitem="t1" aria-pressed="true">事例 1：神通預知樂透</button>
        <button type="button" data-epitem="t2" aria-pressed="false">事例 2：阿育王立藍毘尼柱</button>
        <button type="button" data-epitem="t3" aria-pressed="false">事例 3：佛陀精確生卒月日</button>
        <button type="button" data-epitem="t4" aria-pressed="false">事例 4：同主張不同證據（對照）</button>
      </div>
      <p id="s07-item-text" class="note">「某高僧有天眼通能預知大樂透」</p>
      <div class="controls js-only" role="group" aria-label="分類去向">
        <button type="button" data-epcat="belief" aria-pressed="false">歸類：個人信念／尚無獨立證據</button>
        <button type="button" data-epcat="supported" aria-pressed="false">歸類：有條件支持的實證事實</button>
        <button type="button" data-epcat="unknown" aria-pressed="false">歸類：目前未知</button>
        <button type="button" id="s07-reset">重設分類桌</button>
      </div>
      <p id="s07-result" class="result" role="status" aria-live="polite">請選擇這則主張目前較適合歸類於哪一層（MN 95 五依據皆可真可假）。</p>
    </div>
    <h3>從誠實表態到反覆實踐的三階梯（MN 95）</h3>
    <ol class="steps">
      <li><strong>守護真理（saccānurakkhaṇā）：</strong>如實承認自己依據的是信仰、口傳或推理，不下「唯此真實，餘皆愚妄」的獨斷結論。</li>
      <li><strong>覺悟／發現真理（saccānubodha）：</strong>審查導師是否受貪瞋癡驅使，親近、諦聽、憶持、審思並精進實踐。</li>
      <li><strong>究竟證達真理（saccānupatti）：</strong>經中強調反覆修習多作（非一次體驗就聲稱完成；屬宗教修習階段，不可冒充實驗室測量）。</li>
    </ol>
    <div class="table-wrap"><table role="table"><caption>不嚴謹 · 可查證的表達（對應 MN 95 守護真理）</caption><thead><tr><th>不嚴謹</th><th>可查證的表達</th></tr></thead><tbody>
      <tr><th data-label="不嚴謹">佛陀一定親口說過</th><td data-label="可查證的表達">某部經記載佛陀說過</td></tr>
      <tr><th data-label="不嚴謹">傳承絕對不變</th><td data-label="可查證的表達">目前可追溯記錄如此</td></tr>
      <tr><th data-label="不嚴謹">師父一定開悟</th><td data-label="可查證的表達">觀察到言行與教導相符，內心非我所能測</td></tr>
      <tr><th data-label="不嚴謹">法門一定有效</th><td data-label="可查證的表達">我在特定條件下觀察到部分效果，仍有條件限制</td></tr>
      <tr><th data-label="不嚴謹">感應到佛菩薩所以證明存在</th><td data-label="可查證的表達">我有主觀經驗，成因仍待查</td></tr>
      <tr><th data-label="不嚴謹">我的信仰是真理，其他都錯</th><td data-label="可查證的表達">這是目前信念，尚須查證</td></tr>
    </tbody></table></div>
    <nav class="station-nav" aria-label="站點 7 導覽"><p class="small">目前第 7／22 站 · 第一幕結束，可稍後繼續</p><div class="button-row"><a class="button secondary" href="#menu">↑ 四幕目錄</a><a class="button secondary" href="#direction">← 上一站</a><a class="button secondary" href="./history-research.html#truth-epistemology">研究詳頁</a><a class="button" href="#evidence">進入第二幕 →</a></div></nav>
  </div></section>`
];
