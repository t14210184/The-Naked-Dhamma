(() => {
  "use strict";
  const root = document.documentElement;
  const $ = s => document.querySelector(s);
  const allNodes = s => [...document.querySelectorAll(s)];
  const get = k => { try { return localStorage.getItem("dhamma-history-" + k); } catch { return null; } };
  const put = (k, v) => { try { if (v === null) localStorage.removeItem("dhamma-history-" + k); else localStorage.setItem("dhamma-history-" + k, v); } catch {} };

  root.classList.add("enhanced");

  // Font & Theme
  const stations = allNodes("[data-station]");
  const views = [$("#top"), $("#quick"), ...stations, $("#library")].filter(Boolean);
  let size = Number(get("size")) || 20;
  size = Math.min(28, Math.max(16, size));

  function applyFont() {
    root.style.setProperty("--base", size + "px");
    root.dataset.fontScale = size >= 22 ? "large" : "normal";
    const fs = $("#font-status");
    if (fs) fs.textContent = "字級 " + size + "px";
    put("size", size);
  }
  $("#fontDown")?.addEventListener("click", () => { size = Math.max(16, size - 2); applyFont(); });
  $("#fontUp")?.addEventListener("click", () => { size = Math.min(28, size + 2); applyFont(); });

  function applyTheme(dark) {
    root.dataset.theme = dark ? "dark" : "light";
    const mc = document.querySelector("meta[name=theme-color]");
    if (mc) mc.content = dark ? "#14171a" : "#f8f5ee";
    const tb = $("#theme");
    if (tb) {
      tb.setAttribute("aria-pressed", String(dark));
      tb.textContent = dark ? "切換暖紙淺色" : "切換柔光深色";
    }
    put("theme", dark ? "dark" : "light");
  }
  $("#theme")?.addEventListener("click", () => applyTheme(root.dataset.theme !== "dark"));
  applyFont();
  applyTheme(get("theme") === "dark");

  // Optional browser speech synthesis (default OFF)
  const ttsBtn = $("#tts-toggle");
  const ttsStatus = $("#tts-status");
  if (ttsBtn && "speechSynthesis" in window) {
    ttsBtn.hidden = false;
    const stopSpeech = () => {
      try { window.speechSynthesis.cancel(); } catch {}
      ttsBtn.setAttribute("aria-pressed", "false");
      ttsBtn.textContent = "朗讀目前頁面";
      if (ttsStatus) ttsStatus.textContent = "語音導讀已停止。";
    };
    ttsBtn.addEventListener("click", () => {
      if (window.speechSynthesis.speaking) {
        stopSpeech();
        return;
      }
      const activeView = views.find(v => !v.hidden) || $("#top");
      const text = (activeView?.innerText || "").replace(/\s+/g, " ").slice(0, 2600);
      if (!text) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-TW";
      u.rate = 0.92;
      u.onend = stopSpeech;
      u.onerror = stopSpeech;
      ttsBtn.setAttribute("aria-pressed", "true");
      ttsBtn.textContent = "停止語音朗讀";
      if (ttsStatus) ttsStatus.textContent = "正在以瀏覽器原生語音朗讀目前畫面。";
      window.speechSynthesis.speak(u);
    });
    window.addEventListener("hashchange", () => { if (window.speechSynthesis.speaking) stopSpeech(); });
  }

  // Resume bookmark
  const resume = $("#resume");
  const resumeLink = $("#resume-link");
  let backSource = null;
  function resumeUpdate() {
    if (!resume || !resumeLink) return;
    const saved = stations.find(s => s.id === get("last"));
    resume.hidden = !saved;
    if (saved) {
      resumeLink.href = "#" + saved.id;
      resumeLink.textContent = "繼續第 " + saved.dataset.station + " 站：" + saved.querySelector("h2").textContent;
    }
  }
  $("#resume-close")?.addEventListener("click", () => { put("last", null); resumeUpdate(); });

  // Library search & filter (needed before route)
  const search = $("#source-search");
  const cards = allNodes("[data-source]");
  const norm = s => s.normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, "")
    .replace(/[蓝经释译传证觉伽罗门禅藏华严净]/g, x => ({
      "蓝": "藍", "经": "經", "释": "釋", "译": "譯", "传": "傳", "证": "證",
      "觉": "覺", "伽": "伽", "罗": "羅", "门": "門", "禅": "禪", "藏": "藏",
      "华": "華", "严": "嚴", "净": "淨"
    }[x] || x));

  function filterSources() {
    if (!search) return;
    const q = norm(search.value.trim());
    let n = 0;
    cards.forEach(c => {
      c.hidden = !!q && !norm(c.textContent).includes(q);
      if (!c.hidden) n++;
    });
    const sc = $("#source-count");
    if (sc) {
      sc.textContent = n === 0
        ? "查無符合「" + search.value.trim() + "」的來源（代表本站目前未收錄該關鍵詞，不等於歷史上不存在）。"
        : "顯示 " + n + "／" + cards.length + " 組來源。";
    }
  }
  search?.addEventListener("input", filterSources);
  allNodes("[data-filter]").forEach(b => b.addEventListener("click", () => {
    if (!search) return;
    search.value = b.dataset.filter;
    filterSources();
  }));
  $("#clear-search")?.addEventListener("click", () => {
    if (!search) return;
    search.value = "";
    filterSources();
  });

  // Routing
  const routeNotice = $("#route-notice");
  function route(scroll = true) {
    let id = "";
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = ""; }
    const all = id === "all";
    let target = id ? document.getElementById(id) : null;
    if (routeNotice) {
      if (id && !all && !target && id !== "main") {
        routeNotice.hidden = false;
        routeNotice.textContent = "找不到網址標籤「#" + id + "」，已為您回到探索館首頁目錄。";
      } else {
        routeNotice.hidden = true;
      }
    }
    if (!target && !all) target = $("#top");
    let view = views.find(v => v === target || v.contains(target)) || $("#top");
    if (id === "main") view = $("#top");
    if (target?.matches("[data-source]") && search) { search.value = ""; filterSources(); }
    views.forEach(v => { v.hidden = !all && v !== view; });
    const settings = $("#settings");
    if (settings) settings.open = false;
    if (view.dataset.station) {
      put("last", view.id);
      const bar = $("#reading");
      if (bar) bar.style.width = (Number(view.dataset.station) / 22 * 100) + "%";
      backSource = view.id;
    } else {
      const bar = $("#reading");
      if (bar) bar.style.width = all ? "100%" : "0%";
    }
    if (view.id === "top") {
      resumeUpdate();
      if (backSource) {
        const details = $(".station-list a[href='#" + backSource + "']")?.closest("details");
        if (details) details.open = true;
      }
    }
    const sb = $("#source-back");
    if (sb) {
      if (view.id === "library" && backSource) { sb.hidden = false; sb.href = "#" + backSource; }
      else sb.hidden = true;
    }
    if (scroll) {
      requestAnimationFrame(() => {
        const dest = all ? $("#top") : (target || view);
        if (dest === view || dest.id === "menu" || dest.matches("[data-source]")) {
          dest.setAttribute("tabindex", "-1");
          dest.focus({ preventScroll: true });
        }
        dest.scrollIntoView({ block: "start", behavior: "auto" });
      });
    }
  }
  window.addEventListener("hashchange", () => route());
  allNodes("a[href^='#']").forEach(a => a.addEventListener("click", () => {
    if (a.getAttribute("href") === location.hash) route();
  }));

  // Bad image graceful fallback
  allNodes("img[data-fallback]").forEach(img => {
    img.addEventListener("error", () => {
      img.hidden = true;
      const box = img.closest(".artifact-stage")?.querySelector(".img-fallback");
      if (box) box.hidden = false;
    });
  });

  // Generic [data-feedback] quiz handler (supports S01, S03, S04, S05, S08 & any quiz)
  allNodes("[data-feedback]").forEach(b => b.addEventListener("click", () => {
    b.closest(".choices").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    const out = document.getElementById(b.getAttribute("aria-controls"));
    if (out) out.textContent = b.dataset.feedback;
  }));

  // S01: Four Visitors Interactive Verification Table
  (() => {
    const visitors = {
      v1: { name: "第一位：聲稱親聞佛陀", desc: "「我在佛陀面前親耳聽到、親手領受這套法與律。」", ok: "即使宣稱親聞佛陀，仍須不急著信或斥責，先記清文句並比對經與律。" },
      v2: { name: "第二位：聲稱來自長老僧團", desc: "「我在某住處有上座領導的和合僧團面前親聞此法。」", ok: "整座寺院與多數長老的集體權威，仍須比對經與律（漢譯另列「依法」）。" },
      v3: { name: "第三位：聲稱來自多位博學長老", desc: "「多位博學持法、持律、持本母的長老如此教導我。」", ok: "多位專家長老背書仍不能免查；不相應於經律者須捨棄。" },
      v4: { name: "第四位：聲稱來自一位持律長老", desc: "「一位博學持法、持律的長老親自告訴我。」", ok: "單一權威名望高深者亦須經歷完全相同的比對程序。" }
    };
    let curV = "v1";
    const tested = new Set();
    const vText = $("#s01-visitor-text");
    const vOut = $("#s01-result");
    const vCount = $("#s01-progress");
    const renderV = () => {
      allNodes("[data-visitor]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.visitor === curV)));
      if (vText && visitors[curV]) vText.textContent = visitors[curV].name + " — " + visitors[curV].desc;
      if (vCount) vCount.textContent = "已檢驗來客：" + tested.size + "／4 位（無任何一位可免查）";
    };
    allNodes("[data-visitor]").forEach(b => b.addEventListener("click", () => {
      curV = b.dataset.visitor;
      allNodes("[data-vaction]").forEach(x => x.setAttribute("aria-pressed", "false"));
      if (vOut) vOut.textContent = "請選擇對這位來客的處理方式。";
      renderV();
    }));
    allNodes("[data-vaction]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-vaction]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const act = b.dataset.vaction;
      tested.add(curV);
      if (vOut) {
        if (act === "believe") vOut.textContent = "不能直接相信：" + visitors[curV].ok;
        else if (act === "reject") vOut.textContent = "不能直接斥責：經文要求「勿遽讚喜、勿遽斥責（不應不信，亦不應毀）」，應先聽清文句再核對。";
        else vOut.textContent = "✓ 符合經文程序：" + visitors[curV].ok;
      }
      renderV();
    }));
    $("#s01-reset")?.addEventListener("click", () => {
      curV = "v1"; tested.clear();
      allNodes("[data-vaction]").forEach(x => x.setAttribute("aria-pressed", "false"));
      if (vOut) vOut.textContent = "已重設查證桌。點選四位來客並測試三種處理方式。";
      renderV();
    });
    renderV();
  })();

  // S02: Drum (Pāli SN 20.7 vs Chinese SA 1258 + optional synthetic audio)
  (() => {
    let mode = "pali", step = 0, soundOn = false;
    const patches = allNodes(".drum-patch");
    const status = $("#drum-status");
    const patch = $("#patch");
    const soundBtn = $("#drum-sound");
    function beep(pitch, damp) {
      if (!soundOn) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        const ctx = new AC();
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(pitch, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(Math.max(45, pitch * 0.45), ctx.currentTime + (damp ? 0.14 : 0.34));
        g.gain.setValueAtTime(0.18, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (damp ? 0.15 : 0.35));
        osc.connect(g); g.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.36);
      } catch {}
    }
    function drum() {
      if (!patch || !status) return;
      const pali = mode === "pali", max = pali ? patches.length : 2;
      patches.forEach((p, i) => p.classList.toggle("visible", pali && i < step));
      const leather = $("#leather");
      const peel = $("#leather-peel");
      if (leather) leather.setAttribute("opacity", String(!pali && step >= 1 ? 1 : 0));
      if (peel) peel.setAttribute("opacity", String(!pali && step >= 2 ? 1 : 0));
      patch.disabled = step >= max;
      $("#mode-pali")?.setAttribute("aria-pressed", String(pali));
      $("#mode-han")?.setAttribute("aria-pressed", String(!pali));
      const dm = $("#drum-mode");
      if (dm) dm.textContent = pali
        ? "巴利版 SN 20.7：鼓身裂開後反覆打入木楔（āṇi），原木框逐漸消失。"
        : "漢譯版 SA 1258：原聲徹四十里，破後以牛皮纏補而失美聲，終致皮剝落唯餘聚木。";
      if (pali) {
        status.textContent = step ? (step + "／5 示意木楔已打入。" + (step === 5 ? "鼓名未變，原木框已全數消失，只剩木楔聚（示意）。" : "")) : "尚未修補（巴利版）。";
      } else {
        status.textContent = step === 0 ? "尚未以牛皮修補（漢譯版：原聲清越徹四十里）。"
          : (step === 1 ? "步驟 1／2：裁割牛皮周匝纏縛，但原本高美深聲已不復。" : "步驟 2／2：後時轉復朽壞，牛皮大剝落，唯有聚木（經文示意）。");
      }
    }
    $("#mode-pali")?.addEventListener("click", () => { mode = "pali"; step = 0; drum(); });
    $("#mode-han")?.addEventListener("click", () => { mode = "han"; step = 0; drum(); });
    patch?.addEventListener("click", () => {
      step = Math.min(mode === "pali" ? 5 : 2, step + 1);
      drum();
      beep(mode === "pali" ? 160 - step * 12 : 95, step > 0);
    });
    $("#reset-drum")?.addEventListener("click", () => { step = 0; drum(); });
    soundBtn?.addEventListener("click", () => {
      soundOn = !soundOn;
      soundBtn.setAttribute("aria-pressed", String(soundOn));
      soundBtn.textContent = soundOn ? "合成音效：已開啟（非古鼓原聲）" : "合成音效：預設關閉";
    });
    drum();
  })();

  // S03: Teacher Investigation (3 timepoints + observation vs mindreading)
  (() => {
    const stages = {
      early: "【情境一：成名前（虛構示範）】該老師生活簡樸、講解有條理，但你只相處兩週，尚未見過他面對金錢與衝突。",
      famous: "【情境二：成名得供養後（虛構示範）】粉絲與供養大增，公開課堂依然溫和，但有人反映他私下斥責提問者並要求高額供養。",
      critic: "【情境三：受公開批評時（虛構示範）】面對經文引用錯誤的指正，他選擇公開修正錯誤並致謝，而非咒罵提問者。"
    };
    let cur = "early";
    const sOut = $("#s03-stage-text"), jOut = $("#s03-judge-result");
    const renderS = () => {
      allNodes("[data-tstage]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.tstage === cur)));
      if (sOut) sOut.textContent = stages[cur];
    };
    allNodes("[data-tstage]").forEach(b => b.addEventListener("click", () => {
      cur = b.dataset.tstage;
      allNodes("[data-tjudge]").forEach(x => x.setAttribute("aria-pressed", "false"));
      if (jOut) jOut.textContent = "請依可觀察言行選擇判斷。";
      renderS();
    }));
    allNodes("[data-tjudge]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-tjudge]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const j = b.dataset.tjudge;
      if (!jOut) return;
      if (j === "mind") jOut.textContent = "超出證據範圍：MN 47 明言「不知他心者」只能由眼見耳聞查驗言行，外在禮貌不能直接證明全知或開悟。";
      else if (j === "insufficient") jOut.textContent = "✓ 誠實保留：兩週接觸或單一傳聞不足以定案，可繼續長期觀察身語與名利前後變化（MN 47／MA 186）。";
      else jOut.textContent = cur === "famous"
        ? "✓ 具體查證：發現成名後出現與教導衝突的可觀察言行，宜核實具體事實而非盲信名氣。"
        : (cur === "critic" ? "✓ 具體查證：能承認錯誤屬良好公開行為線索，仍可繼續長期觀察，並分開「行為誠懇」與「一切主張皆真」。"
        : "資料尚淺：目前雖無明顯雜染，但「時間仍短」，MN 47 提醒須觀察「長夜（長期）」與得名聞利養後是否變質。");
    }));
    $("#s03-reset")?.addEventListener("click", () => {
      cur = "early"; allNodes("[data-tjudge]").forEach(x => x.setAttribute("aria-pressed", "false"));
      if (jOut) jOut.textContent = "已重設。切換三個時點觀察「可觀察事實」與「內心猜想」的界線。";
      renderS();
    });
    renderS();
  })();

  // S04: Kalama version switcher & 4 assurances
  (() => {
    const kOut = $("#s04-version-out");
    allNodes("[data-kalama-ver]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-kalama-ver]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (!kOut) return;
      kOut.textContent = b.dataset.kalamaVer === "pali"
        ? "巴利 AN 3.65：先列「十種不應單憑的理由」，接著問貪瞋癡是否導致傷害、智者讚責何者，最後給出四種安穩。"
        : "漢譯《中阿含》16《伽藍經》：沒有十項清單，直接問「汝等自無淨智，為有後世…當知諸業有三：貪、恚、癡」，接續十善與四安隱住處。";
    }));
    const aOut = $("#s04-assasa-out");
    const aTexts = {
      a1: "第一安穩：若確有來世與善惡業報，不懷怨害、清淨行善者死後可生善處（經典觀點）。",
      a2: "第二安穩：若沒有來世與業報，今生依然無怨無惱、安樂自持，受智者稱譽（現世可觀察）。",
      a3: "第三安穩：若惡行有惡果報，因我不行惡、不念惡，故無須因恐懼受報而不安。",
      a4: "第四安穩：若惡行沒有死後報應，我在此生依然保持清白無過（兩面皆清淨，但不保證永不受他人外力傷害）。"
    };
    allNodes("[data-assasa]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-assasa]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (aOut) aOut.textContent = aTexts[b.dataset.assasa] || "";
    }));
  })();

  // S05: Rahula Water Basin + Mirror + Elephant
  (() => {
    const bOut = $("#s05-basin-out");
    const water = $("#basin-water"), bowl = $("#basin-bowl");
    const states = {
      full: { y: 48, h: 42, flip: false, txt: "初始盛滿水的洗腳盆：準備開始操作（MN 61／MA 14）。" },
      little: { y: 78, h: 12, flip: false, txt: "步驟 1（瀉留少水）：佛問羅睺羅：「故意妄語卻不知羞悔，他的沙門實質就像這剩餘的一點點水。」" },
      empty: { y: 90, h: 0, flip: false, txt: "步驟 2（盡瀉棄水）：「他的沙門實質就像這樣全部倒光。」" },
      flipped: { y: 90, h: 0, flip: true, txt: "步驟 3（覆盆著地）：「他的沙門實質就像這樣整個翻覆過來，無法容納善法。」" },
      upright: { y: 90, h: 0, flip: false, txt: "步驟 4（仰轉空器）：「看那空空洞洞的盆！故意說謊不悔改者就像這只空盆。」（MN 61 / MA 14 皆記）" }
    };
    allNodes("[data-basin]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-basin]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const st = states[b.dataset.basin] || states.full;
      if (water) { water.setAttribute("y", String(st.y)); water.setAttribute("height", String(st.h)); }
      if (bowl) bowl.setAttribute("transform", st.flip ? "rotate(180 120 75)" : "");
      if (bOut) bOut.textContent = st.txt;
    }));
    const mOut = $("#s05-mirror-out");
    const mTexts = {
      before: "做之前（鏡前自照）：先想這句話或行動會不會傷害自己、別人或雙方？若會傷害，盡力不做。",
      during: "做當中（及時止損）：發現正在造成傷害時，立即停止，不以「都說出口了」硬撐。",
      after: "做之後（發現出錯）：已經傷到人或傳錯消息時，依經文向善知識／受影響者坦承更正，避免再犯。"
    };
    allNodes("[data-mirror]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-mirror]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (mOut) mOut.textContent = mTexts[b.dataset.mirror] || "";
    }));
  })();

  // S06: Direction Compass
  (() => {
    const dOut = $("#s06-dir-out");
    const cases = {
      d1: "【分享正確資訊而不藏私炫耀】方向趨向「少欲、不積聚（apacaya）、離貪」——減輕占有與攀比（生活比喻，非果位判定）。",
      d2: "【課程不斷推銷高價開運法會】方向趨向「增長貪求、增加負擔（dubbharatā）」——與 AN 8.53「易養（subharatā）」相反。",
      d3: "【正當工作養家並量力布施】在家人正當生計不違反 AN 8.53；「少欲知足」指不被貪欲奴役，不是禁止謀生。",
      d_counter: "⚠️ 重要反例：單憑外表穿得樸素或獨居，無法判定一個人內心是否真的離貪，更不能用這八項標準去鑑定某部經「是不是佛陀親口說」的歷史年代。"
    };
    allNodes("[data-dir]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-dir]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (dOut) dOut.textContent = cases[b.dataset.dir] || "";
    }));
  })();

  // S07: Epistemic Sorter (MN 95)
  (() => {
    const items = [
      { id: "t1", label: "「某高僧有天眼通能預知大樂透」", rec: "belief", why: "屬超自然／個人信念，缺乏可獨立重現的公開證據（守護真理：不應宣稱唯此真實）。" },
      { id: "t2", label: "「西元前3世紀阿育王曾參訪藍毘尼並立柱」", rec: "supported", why: "有孔雀王朝藍毘尼石柱婆羅米文實物與考古脈絡支持（有條件支持的歷史事實）。" },
      { id: "t3", label: "「釋迦牟尼佛確切出生於西元前幾月幾日」", rec: "unknown", why: "無同時代文字檔案，當代學界對佛滅年份本身仍有數十年至逾百年爭議（目前未知）。" },
      { id: "t4", label: "「同一個信念『每日靜坐10分鐘能減壓』，有人靠網友口傳相信，有人看過臨床隨機對照試驗」", rec: "supported", why: "MN 95 核心洞見：同一主張可能來自『口傳』也可能來自『實證查驗』，須依證據強度與條件界線區分，而非只看信不信。" }
    ];
    let cur = items[0];
    const tLabel = $("#s07-item-text"), tOut = $("#s07-result");
    const renderItem = () => {
      allNodes("[data-epitem]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.epitem === cur.id)));
      if (tLabel) tLabel.textContent = cur.label;
    };
    allNodes("[data-epitem]").forEach(b => b.addEventListener("click", () => {
      cur = items.find(x => x.id === b.dataset.epitem) || items[0];
      allNodes("[data-epcat]").forEach(x => x.setAttribute("aria-pressed", "false"));
      if (tOut) tOut.textContent = "請選擇這則主張目前較適合歸類於哪一層（MN 95 五依據皆可真可假）。";
      renderItem();
    }));
    allNodes("[data-epcat]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-epcat]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const cat = b.dataset.epcat;
      if (tOut) {
        tOut.textContent = (cat === cur.rec ? "✓ 分類合理：" : "提示比較：") + cur.why;
      }
    }));
    $("#s07-reset")?.addEventListener("click", () => {
      cur = items[0]; allNodes("[data-epcat]").forEach(x => x.setAttribute("aria-pressed", "false"));
      if (tOut) tOut.textContent = "已重設分類桌。點選上方四則範例，比較「個人信念」「有條件支持」與「目前未知」。";
      renderItem();
    });
    renderItem();
  })();

  // S08: Real Artifact Magnifier (Zoom, Pan, Overlay, Step-1 Observation vs Step-2 Text)
  (() => {
    const artifacts = {
      lumbini: {
        src: "assets/history/evidence/img01-rummindei-inscription.jpg",
        alt: "1896年印度考古調查局拍攝的藍毘尼阿育王石柱五行婆羅米文石刻銘文近照",
        title: "藍毘尼（倫明代）阿育王石柱銘文（約前249年）",
        obs: "先看實物：石柱表面刻有五行垂直整齊的古代幾何筆畫字母（婆羅米文），第2行右段可見「Budha Sakyamunī」字跡。",
        trans: "轉寫與譯意：天愛喜見王登基第20年親自參訪禮敬，因『釋迦牟尼佛（Budha Sakyamunī）』生於此地而立石柱，減免藍毘尼村稅賦為八分之一。",
        limit: "權利與限制：Public Domain（ASI 1896）。證明前3世紀聖地認定；不證明出生走七步或出生年分。"
      },
      bhabra: {
        src: "assets/history/evidence/img01-bhabra-edict.jpg",
        alt: "1925年Hultzsch所刊加爾各答－拜拉特阿育王石刻八行婆羅米文拓印圖版",
        title: "拜拉特／加爾各答－拜拉特阿育王石刻（前3世紀）",
        obs: "先看實物：花崗岩塊上共刻八行婆羅米文，石面邊緣略有風化剝落，字距較藍毘尼石柱緊密。",
        trans: "轉寫與譯意：阿育王向僧團致敬並推薦七部法門，第6行見「Lāghulovāde musāvādaṁ adhigicya（對羅睺羅關於妄語的教誡）」。",
        limit: "權利與限制：Public Domain（Hultzsch 1925）。交叉佐證第5站教誡主題已流傳；不證明現存MN 61逐字未變。"
      },
      nigali: {
        src: "assets/history/evidence/img01-nigali-sagar.jpg",
        alt: "尼泊爾尼迦利薩格爾阿育王石柱表面四行婆羅米文石刻照片",
        title: "尼迦利薩格爾阿育王石柱銘文（約前249年）",
        obs: "先看實物：石柱斷段上保留四行清楚刻痕，表面有自然風化紋路。",
        trans: "轉寫與譯意：記載阿育王即位第14年將過去佛「拘那含佛（Konākamana）」佛塔擴建為兩倍，第20年親自參拜並立石柱。",
        limit: "權利與限制：CC BY 2.0（David Lowry）。證明前3世紀已有過去佛崇拜與佛塔制度，不證實過去佛神話傳記。"
      },
      sarnath: {
        src: "assets/history/evidence/img01-sarnath-edict.jpg",
        alt: "1925年Hultzsch所刊鹿野苑阿育王石柱僧團分裂詔令拓印圖版",
        title: "鹿野苑阿育王石柱分裂詔令（前3世紀）",
        obs: "先看實物：上方幾行嚴重殘損，下方五行較為完整，顯示石柱曾斷裂或受損。",
        trans: "轉寫與譯意：王權要求不得分裂僧團，違者須令還俗（著白衣）並遷離住處；反映王室以行政秩序介入僧團。",
        limit: "權利與限制：Public Domain（Hultzsch 1925）。支持王權介入僧團紀錄，但不獨立證實南傳第三次結集所有細節。"
      },
      gandhara: {
        src: "assets/history/evidence/img02-gandhara-bl-or14915.jpg",
        alt: "大英圖書館Or. 14915號西元1世紀犍陀羅語佉盧文樺樹皮手稿殘片實物影像",
        title: "犍陀羅語樺樹皮卷（BL Or. 14915，約西元1世紀前半葉）",
        obs: "先看實物：六條縱向捲曲殘損的淺褐色樺樹皮條片，表面有纖維紋理與黑色墨跡寫成的佉盧文字母。",
        trans: "館藏與斷代：大英圖書館藏本（研究歸屬多指向法藏部）；另有美國國會圖書館 2018305008 及 Split 藏本《八千頌般若》（C14 約 75 CE，2σ 47–147 CE）。",
        limit: "權利與限制：BL Or. 14915 為 CC0（British Library）；LOC 2018305008 為 Public Domain Mark 1.0，但對自動抓取回傳 HTTP 403（ACCESS_BLOCKED，技術存取受阻而非版權禁止），請讀者點研究頁官方連結查閱。均距佛陀數百年，非佛陀親筆。"
      }
    };
    let curA = "lumbini", zoom = 1, px = 0, py = 0, showOverlay = true, showTrans = false;
    const img = $("#viewer-img"), fb = $("#viewer-fallback"), ov = $("#viewer-overlay");
    const infoObs = $("#viewer-obs"), infoTrans = $("#viewer-trans"), infoLim = $("#viewer-limit"), zStat = $("#viewer-zoom-status");
    const renderImg = () => {
      const a = artifacts[curA];
      if (!a || !img) return;
      if (img.getAttribute("src") !== a.src) {
        img.hidden = false;
        if (fb) fb.hidden = true;
        img.src = a.src;
        img.alt = a.alt;
      }
      img.style.transform = `translate(${px}px, ${py}px) scale(${zoom})`;
      if (ov) {
        ov.hidden = !showOverlay;
        ov.querySelector(".overlay-pill").textContent = a.title + "（可關閉圖層，原圖像素未經AI修改）";
      }
      if (infoObs) infoObs.textContent = a.obs;
      if (infoTrans) { infoTrans.textContent = a.trans; infoTrans.hidden = !showTrans; }
      if (infoLim) infoLim.textContent = a.limit;
      if (zStat) zStat.textContent = "目前縮放：" + Math.round(zoom * 100) + "%";
      allNodes("[data-artifact]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.artifact === curA)));
      $("#viewer-toggle-overlay")?.setAttribute("aria-pressed", String(showOverlay));
      $("#viewer-toggle-trans")?.setAttribute("aria-pressed", String(showTrans));
    };
    allNodes("[data-artifact]").forEach(b => b.addEventListener("click", () => {
      curA = b.dataset.artifact; zoom = 1; px = 0; py = 0; showTrans = false; renderImg();
    }));
    $("#viewer-zoom-in")?.addEventListener("click", () => { zoom = Math.min(2.4, +(zoom + 0.4).toFixed(1)); renderImg(); });
    $("#viewer-zoom-out")?.addEventListener("click", () => { zoom = Math.max(1, +(zoom - 0.4).toFixed(1)); if (zoom === 1) { px = 0; py = 0; } renderImg(); });
    $("#viewer-pan-left")?.addEventListener("click", () => { px += 28; renderImg(); });
    $("#viewer-pan-right")?.addEventListener("click", () => { px -= 28; renderImg(); });
    $("#viewer-reset")?.addEventListener("click", () => { zoom = 1; px = 0; py = 0; showOverlay = true; showTrans = false; renderImg(); });
    $("#viewer-toggle-overlay")?.addEventListener("click", () => { showOverlay = !showOverlay; renderImg(); });
    $("#viewer-toggle-trans")?.addEventListener("click", () => { showTrans = !showTrans; renderImg(); });
    $("#viewer-stage")?.addEventListener("keydown", e => {
      if (e.key === "+" || e.key === "=") { zoom = Math.min(2.4, +(zoom + 0.4).toFixed(1)); renderImg(); }
      else if (e.key === "-") { zoom = Math.max(1, +(zoom - 0.4).toFixed(1)); if (zoom === 1) { px = 0; py = 0; } renderImg(); }
      else if (e.key === "0") { zoom = 1; px = 0; py = 0; renderImg(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); px += 24; renderImg(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); px -= 24; renderImg(); }
    });
    renderImg();
  })();

  // S09: Oral Transmission Sandbox (Toy demo, NOT real probability)
  (() => {
    const out = $("#s09-out");
    const demos = {
      whisper: "【單人耳語傳話（玩具示意）】原始短句：「不依人，只比對經律。」→ 第3人：「好像說不要亂聽別人的話。」→ 第6人：「聽說大師說只要信自己就好。」（個人記憶容易漏字變形。）",
      chorus: "【集體合誦與定型句校對（玩具示意）】原始短句：「色無常，無常即苦，苦即非我。」→ 三組僧人定期對誦戒本與固定句型 → 關鍵骨幹保持高度穩定（呼應 Wynne 2004 集體校對機制，並非一定失真）。",
      translate: "【跨語言翻譯轉換（玩具示意）】印度語詞「Dhamma / Dharma」譯為漢語「法」或英文「Teaching / Truth」，讀者依各自文化語境產生不同理解（Allon 2022 異文成因之一）。",
      expand: "【因應爭議或教學需要而編整（玩具示意）】如《增壹阿含》28.5 在「經、律」後再加入「阿毘曇、戒」，反映後代編輯層次與三藏分類系統化。"
    };
    allNodes("[data-txmode]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-txmode]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (out) out.textContent = demos[b.dataset.txmode] || "";
    }));
    $("#s09-reset")?.addEventListener("click", () => {
      allNodes("[data-txmode]").forEach(x => x.setAttribute("aria-pressed", "false"));
      if (out) out.textContent = "已重設傳承沙盒。請選擇上方情境，比較「集體穩定保存」與「邊緣異文增刪」（示範模擬，非歷史機率）。";
    });
  })();

  // S10: Interactive Historical Timeline Slider + Map
  (() => {
    const periods = [
      { time: "前600–400", title: "沙門運動與歷史佛陀", rel: "高；生平細節未定", region: "恒河中游（今北印／尼泊爾南）", mx: 185, my: 145, note: "喬達摩在多元沙門競爭環境中教導；佛滅確切年份仍有約前5世紀區間爭議。" },
      { time: "前400–300", title: "早期僧團、口傳與早期分化", rel: "中", region: "摩揭陀、毘舍離一帶", mx: 195, my: 150, note: "第二次結集具較強基礎；第一次結集細節與根本分裂確切年分仍有學界討論。" },
      { time: "前268–232左右", title: "阿育王政治支持與碑銘", rel: "極高（實物碑銘）", region: "華氏城至藍毘尼、拜拉特", mx: 175, my: 150, note: "目前最早實物檔案；第三次結集主要見於南傳律註與編年史。" },
      { time: "前300–100", title: "部派佛教發展", rel: "高（分裂細節未定）", region: "印度次大陸、犍陀羅、斯里蘭卡", mx: 150, my: 140, note: "十八／二十部派名單互有矛盾；部派各自傳承經律與論。" },
      { time: "前100–後200", title: "早期手稿與大乘經典萌芽", rel: "高（實物測年支持）", region: "大犍陀羅、印度多地", mx: 120, my: 110, note: "BL Or.14915 與 Split《八千頌般若》（C14約75 CE）提供最早寫本實物。" },
      { time: "100–500", title: "般若、中觀、瑜伽行派形成", rel: "高", region: "印度各地、漢地譯場", mx: 165, my: 165, note: "龍樹中觀與無著世親唯識系統成熟；巴利覺音於5世紀整理義註。" },
      { time: "100–600", title: "經中亞進入中國、朝鮮、日本", rel: "高", region: "絲路中亞、長安建康至東亞", mx: 320, my: 115, note: "429／433 斯里蘭卡比丘尼赴南京傳戒；中國漢譯大量阿含與大乘經典。" },
      { time: "500–1000", title: "印度密教、東亞宗派與藏傳形成", rel: "高", region: "印度東北部、唐宋中國、吐蕃", mx: 250, my: 125, note: "約779桑耶寺；801《寶林傳》；971–983《開寶藏》雕印；唐武宗會昌滅佛。" },
      { time: "1000–1300", title: "印度大寺衰退與斯里蘭卡重整", rel: "高", region: "那爛陀超戒寺；斯里蘭卡", mx: 205, my: 225, note: "12世紀波羅迦羅摩跋訶一世統合斯里蘭卡僧團；北印度大寺多重因素衰退。" },
      { time: "1200–1600", title: "上座部確立東南亞主流", rel: "高", region: "緬甸、泰國、柬埔寨、寮國", mx: 270, my: 195, note: "區域王權支持巴利三藏體系；日本親鸞開創淨土真宗婚配傳統。" },
      { time: "1600–1900", title: "王權、殖民與宗教改革", rel: "極高", region: "斯里蘭卡、緬泰、日本、清代臺灣", mx: 295, my: 175, note: "1753暹羅傳戒、1868–1871固都陶729碑、1872日本解禁、1895臺灣進入日治。" },
      { time: "1900至今", title: "現代化、人間佛教與全球正念", rel: "極高", region: "臺灣、亞洲至全球", mx: 375, my: 155, note: "居士內觀、人間佛教、世俗正念與2022／2025不丹比丘尼復戒。" }
    ];
    const slider = $("#s10-slider"), prev = $("#s10-prev"), next = $("#s10-next");
    const outTime = $("#s10-time"), outTitle = $("#s10-title"), outInfo = $("#s10-info");
    const dot = $("#s10-map-dot"), dotLabel = $("#s10-map-label");
    let idx = 0;
    const render = () => {
      const p = periods[idx];
      if (!p) return;
      if (slider) slider.value = String(idx);
      if (outTime) outTime.textContent = p.time + "（第 " + (idx + 1) + "／12 期）";
      if (outTitle) outTitle.textContent = p.title + "｜地區：" + p.region;
      if (outInfo) outInfo.textContent = "史料可信：" + p.rel + " — " + p.note;
      if (dot) { dot.setAttribute("cx", String(p.mx)); dot.setAttribute("cy", String(p.my)); }
      if (dotLabel) { dotLabel.setAttribute("x", String(p.mx)); dotLabel.setAttribute("y", String(Math.max(22, p.my - 14))); dotLabel.textContent = p.time; }
      if (prev) prev.disabled = idx <= 0;
      if (next) next.disabled = idx >= periods.length - 1;
      allNodes("[data-era]").forEach(b => b.setAttribute("aria-pressed", String(Number(b.dataset.era) === idx)));
    };
    slider?.addEventListener("input", () => { idx = Number(slider.value); render(); });
    prev?.addEventListener("click", () => { if (idx > 0) { idx--; render(); } });
    next?.addEventListener("click", () => { if (idx < periods.length - 1) { idx++; render(); } });
    allNodes("[data-era]").forEach(b => b.addEventListener("click", () => { idx = Number(b.dataset.era); render(); }));
    render();
  })();

  // S11: Braided River + 5-Language Anattalakkhaṇa Switcher
  (() => {
    const tOut = $("#s11-trad-out");
    const tInfo = {
      south: "南傳上座部：保存巴利尼柯耶與上座部律，但經12世紀統合與18世紀傳戒重建，非完全等同古代全體上座系。",
      east: "漢傳佛教：保存法藏部四分律、四阿含（出於不同部派）與大乘經論，融合儒道與地方宗教制度。",
      tibet: "藏傳佛教：保存根本說一切有部律與大量印度後期中觀、因明及密教文獻，並與藏地文化互動。",
      lost: "消失古部派（如犢子部、經量部等）：原典多半散佚，今日認識高度依賴其他派別的批評轉述（存活者偏差）。"
    };
    allNodes("[data-trad]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-trad]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (tOut) tOut.textContent = tInfo[b.dataset.trad] || "";
    }));

    const lOut = $("#s11-lang5-out");
    const langs = {
      pli: "【巴利文 SN 22.59（已完整核對）】Rūpaṁ, bhikkhave, anattā... ‘netaṁ mama, nesohamasmi, na meso attā’ti（色非我…這不是我、非我所）。",
      lzh: "【漢譯《雜阿含》34（已完整核對）】「色非有我。若色有我者，於色不應病、苦生…彼一切非我、非我所。」（求那跋陀羅譯，屬說一切有部系統）。",
      pgd: "【犍陀羅語 Senior 22（目錄／研究論文確認）】Mark Allon 刊布之 Aṇatvalakṣaṇa Sutra 樺樹皮殘卷，保存無我相主題平行段落，但屬殘卷而非完整大藏本。",
      san: "【梵文平行線索（《大事》Mahāvastu 等）】SuttaCentral 平行索引用 San Lo Mvu 95 等出處保存五比丘無我對答母題，細節與巴漢本不逐字等同。",
      xct: "【藏文平行狀況（缺獨立經藏對應，須誠實標界線）】藏文甘珠爾主要於《根本說一切有部毘奈耶破僧事》等律藏脈絡保存五比丘說法敘事，非如巴利 SN 22.59 獨立單經；不以 AI 翻譯冒充實證。"
    };
    allNodes("[data-lang5]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-lang5]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (lOut) lOut.textContent = langs[b.dataset.lang5] || "";
    }));
  })();

  // S12: South Restructuring
  (() => {
    const out = $("#s12-out");
    const items = {
      maha: "【大寺派（Mahāvihāra）】保存巴利三藏與覺音（約5世紀）《清淨道論》義註傳統，12世紀（約1165）在王權支持下取得主導。",
      abhaya: "【無畏山寺派（Abhayagiri）】曾容納大乘與多元思想，Max Deeg (2024) 指出大寺派編年史往往掩蓋無畏山寺的歷史影響力。",
      jeta: "【祇陀林寺派（Jetavana）】與無畏山寺並列古代三大僧團中心，12世紀統合後皆失去原本獨立機構地位。",
      relay1753: "【1753暹羅傳戒與種姓轉折】斯里蘭卡具足戒中斷後迎請暹羅優波離長老重建；1764年卻限於 Govigama 種姓，促成其他社群1801／1803赴緬甸另立阿摩羅補羅派。",
      kuthodaw: "【1860–1871緬甸固都陶碑林與1902泰國僧團法】敏東王刻成 729 塊經文大理石碑（1868完工、1871第五次結集）；泰國於1833法宗派與1902僧團法走向中央化。"
    };
    allNodes("[data-south]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-south]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (out) out.textContent = items[b.dataset.south] || "";
    }));
  })();

  // S13: Mahayana Concepts & Buddhavacana
  (() => {
    const cOut = $("#s13-concept-out");
    const concepts = {
      compassion: "慈悲：早期阿含／尼柯耶已有四無量心（慈悲喜捨），屬跨傳承共同基礎。",
      bodhisattva: "菩薩：早期多指釋迦牟尼成道前；大乘擴展為眾生皆可發願實踐的普遍道路。",
      sunyata: "般若、空性：與早期無我、緣起有思想關聯，但後來發展為系統化哲學體系（Split C14約75 CE）。",
      paramita: "六波羅蜜：布施持戒等實踐各有早期基礎，完整六度體系為後續發展。",
      fields: "無量佛與佛國：早期已有過去佛（如阿育王尼迦利薩格爾碑），大乘大幅擴充十方現在諸佛。",
      amitabha: "阿彌陀佛與極樂淨土：後來在印度與中亞發展起來的特定淨土信仰系統。",
      tathagata: "如來藏、佛性：後期印度大乘及東亞極為核心的思想發展。",
      yogacara: "唯識學：約西元4–5世紀在印度形成高度系統化哲學理論。",
      trikaya: "三身佛：後世對佛陀身分與存在形式的系統化哲學詮釋。"
    };
    allNodes("[data-mahac]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-mahac]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (cOut) cOut.textContent = concepts[b.dataset.mahac] || "";
    }));
    const vOut = $("#s13-bvacana-out");
    allNodes("[data-bvacana]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-bvacana]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (vOut) vOut.textContent = b.dataset.bvacana === "hist"
        ? "定義一（歷史學）：指西元前5世紀歷史上的釋迦牟尼本人實際說出的言論。依此標準，成熟大乘經典缺乏足夠直接證據。"
        : "定義二（宗教傳統）：指符合佛法智慧、被信仰社群承認具宗教權威的教導。史學不能代替信徒決定宗教正統，但第二定義不能拿來證明第一定義。";
    }));
  })();

  // S14: 16-Text Attribution Desk + Heart Sutra Hypothesis Sync
  (() => {
    const texts16 = [
      { id: "nikaya", name: "巴利四部尼柯耶", clues: ["線索1：以巴利語保存，構成南傳上座部核心經藏。", "線索2：與漢譯阿含共享大量結構平行，屬早期核心材料。", "結論：相對較強早期證據，但經口傳編輯，仍非佛陀逐字錄音。"] },
      { id: "agama", name: "漢譯四阿含經", clues: ["線索1：分別出自不同古印度部派（如法藏部、說一切有部等），於4–5世紀漢譯。", "線索2：與巴利尼柯耶具高度平行但也有明顯異文（如古鼓、伽藍經）。", "結論：相對較強早期證據，須逐篇跨語言比對，不能一概假定同源逐字相同。"] },
      { id: "dhp", name: "《法句經》", clues: ["線索1：有多語平行（巴利 Dhp、犍陀羅《法句》、梵文 Udānavarga、漢譯諸本）。", "線索2：部分偈頌具極古老語言特徵，但義註背景故事多晚數百年。", "結論：偈頌部分有強早期證據，附屬故事需分開查證。"] },
      { id: "snp", name: "《經集》（Suttanipāta）", clues: ["線索1：義品、彼岸道品等包含古奧詩體，且見阿育王拜拉特碑銘線索。", "線索2：全集為不同年代作品匯編。", "結論：部分篇章具較強早期證據，內部仍有明顯時代層次差異。"] },
      { id: "diamond", name: "《金剛經》T235", clues: ["線索1：屬印度早期般若經典脈絡。", "線索2：尚無考古實物證實為前5世紀佛陀親宣。", "結論：印度大乘般若經典；缺乏歷史佛陀逐字親說直接證據。"] },
      { id: "lotus", name: "《法華經》T262", clues: ["線索1：具備多部漢譯與梵文／中亞殘卷，內部呈現多層次形成跡象。", "線索2：成熟結構與佛壽無量思想屬大乘發展。", "結論：早期印度大乘重要經典；無歷史佛陀直接親說證據。"] },
      { id: "avatamsaka", name: "《華嚴經》T278／T279", clues: ["線索1：由〈十地品〉、〈入法界品〉等多種獨立大乘文獻漸次集合而成。", "線索2：西域與印度文化圈各有組編演變。", "結論：複合匯集型大乘經典；無直接出自歷史佛陀證據。"] },
      { id: "amitabha", name: "《阿彌陀經》T366", clues: ["線索1：反映印度西北及中亞淨土信仰傳統（有梵本與漢譯）。", "線索2：屬於佛滅數百年後逐步成形之他方佛土信仰。", "結論：印度及中亞淨土系統；缺乏直接出自歷史佛陀證據。"] },
      { id: "sukh", name: "《無量壽經》T360", clues: ["線索1：漢譯存在多種差異顯著之譯本（T360–T364 等），顯示文本仍在長期演變。", "線索2：亦見印度梵本傳本。", "結論：多語言多版本淨土經典；無直接出自歷史佛陀證據。"] },
      { id: "heart", name: "《心經》T251", clues: ["線索1：Nattier (1992) 與 Attwood (2021) 比對發現核心段直接承自羅什《大品般若》漢譯語詞。", "線索2：仍有日本學者解讀為般若要義摘錄與陀羅尼結合之修持本，非蓄意作偽。", "結論：漢地摘編並回譯假說證據強，出自歷史佛陀本人證據極弱。"] },
      { id: "surangama", name: "《楞嚴經》T945（勿混 T642）", clues: ["線索1：唐代以來即見來源爭議；須區分羅什譯《首楞嚴三昧經》T642（確有印度梵本）與 T945。", "線索2：Jia (2022) 重新考察房融潤色／翻譯互動，仍不證實全為單一中國人惡意偽造。", "結論：印度來源與漢地編集長期爭議，直接出自歷史佛陀證據極弱。"] },
      { id: "qixin", name: "《大乘起信論》T1666", clues: ["線索1：無可靠印度梵本，卻自稱馬鳴造、真諦譯。", "線索2：望月信亨（1922）至 Jorgensen 等牛津譯註（2019）多傾向判定為6世紀中國撰述。", "結論：本身屬論書而非佛經，作者與譯者歸屬高度存疑，具重要漢傳哲學價值。"] },
      { id: "yulanpen", name: "《盂蘭盆經》T685", clues: ["線索1：結合目連救母、夏安居自恣日與中國祖先孝道祭祀。", "線索2：印度已有餓鬼與施食迴向觀念，但現行經文具高度漢地文化編集疑慮。", "結論：重要中印宗教調適文本；直接出自歷史佛陀證據極弱。"] },
      { id: "fumu", name: "《父母恩重經》等", clues: ["線索1：敦煌與歷代經錄中存在多種版本，早期疑經錄多有存疑。", "線索2：具備鮮明漢地孝道倫理與本土撰述特徵。", "結論：漢地本土化重要文本；直接出自歷史佛陀證據極弱。"] },
      { id: "platform", name: "《六祖壇經》T2008", clues: ["線索1：為唐代禪宗六祖慧能說法記錄，後經宋元明多番增訂（敦煌 S.5475 與 1310 高麗本字數差異甚大）。", "線索2：本身即是中國祖師文獻，而非釋迦牟尼佛典。", "結論：研究中國禪宗演變核心史料，不冒充釋迦牟尼原說。"] },
      { id: "tantras", name: "佛教密續（Tantras）", clues: ["線索1：咒語護持雖早已有之，完整無上瑜伽灌頂、曼荼羅等成熟體系主要於西元7世紀後展開。", "線索2：藏傳保存大量印度失傳密續寫本，但無獨立證據支持為佛陀秘密親授未改。", "結論：中世紀印度與喜馬拉雅宗教史極重要文獻；出自歷史佛陀證據極弱。"] }
    ];
    let curT = texts16[0], clueIdx = 1;
    const sel = $("#s14-text-select"), out = $("#s14-desk-out");
    const renderDesk = () => {
      if (!out) return;
      const shown = curT.clues.slice(0, clueIdx);
      out.innerHTML = "<strong>" + curT.name + "</strong><br>" + shown.map(s => "• " + s).join("<br>");
      const nextBtn = $("#s14-next-clue");
      if (nextBtn) nextBtn.disabled = clueIdx >= curT.clues.length;
    };
    sel?.addEventListener("change", () => {
      curT = texts16.find(x => x.id === sel.value) || texts16[0];
      clueIdx = 1;
      renderDesk();
    });
    $("#s14-next-clue")?.addEventListener("click", () => { clueIdx = Math.min(curT.clues.length, clueIdx + 1); renderDesk(); });
    $("#s14-all-clues")?.addEventListener("click", () => { clueIdx = curT.clues.length; renderDesk(); });
    $("#s14-reset-desk")?.addEventListener("click", () => { clueIdx = 1; renderDesk(); });
    renderDesk();

    const hOut = $("#s14-heart-out");
    const hTexts = {
      trad: "【傳統假說：印度梵本 → 漢文翻譯】玄奘譯出梵本《心經》（T0251），為古印度般若精要。限制：難解釋《心經》核心空性段為何與羅什早期譯《大品般若經》（T0223 卷1〈習應品〉）措辭高度重疊，及「度一切苦厄」見於 T0250／T0251 而未見於常見梵本與 T0223〈習應品〉。",
      nattier: "【Nattier (1992) & Attwood (2021)：印度般若經 → 羅什漢譯 → 漢地摘編《心經》→ 回譯梵文】可逐句核對 T0223（T08, 0223a13–21）「非色異空、非空異色…無苦集滅道，亦無智亦無得」與 T0250／T0251 重疊，且「度一切苦厄」在 T0250／T0251 卻不在 T0223〈習應品〉；Attwood (2021) 另有 22 點細部分析（付費全文未逐點核對），此說不證成蓄意詐欺。",
      alt: "【替代解釋：福井文雅（1987, 1994, 2000）等】對「漢撰回譯說」提出反論，主張須評估印度梵文般若傳統延續性，以及漢譯《般若波羅蜜多心經》在陀羅尼／咒語課誦儀軌（dhāraṇī-sūtra）脈絡下的經題與修持重組，目前尚無單一假說能毫無保留地定案。"
    };
    allNodes("[data-heart]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-heart]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (hOut) hOut.textContent = hTexts[b.dataset.heart] || "";
    }));
  })();

  // S15: China Adaptation Scenarios
  (() => {
    const out = $("#s15-out");
    const scenes = {
      filial: "【孝親與家族張力（模擬比較）】早期印度經典（如 DN 31／DA 16《善生經》、AN 2.31）本已重視奉養父母，稱父母為「梵天、初師」；但中國宗法強調不婚無後之不孝，佛教遂發展出家大孝、四重恩、盂蘭盆超度等制度調適。",
      work: "【托缽與寺院生計】古印度律制禁止僧人耕作墾土並依賴托缽；進入中國後面對士大夫「不事生產」批評，逐漸形成寺院莊園經濟與「百丈清規／農禪」勞作傳統。",
      food: "【三淨肉與素食制度】巴利 MN 55 與早期律藏禁食十種特定肉類並允許「不見、不聞、不疑為己殺」之三淨肉；漢傳結合《大般涅槃經》不殺生教義及6世紀梁武帝推行，歷經數百年遲至約10世紀確立為僧尼全面素食正統。"
    };
    allNodes("[data-cscene]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-cscene]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (out) out.textContent = scenes[b.dataset.cscene] || "";
    }));
  })();

  // S16: Chan Chronicle Detective
  (() => {
    const out = $("#s16-out");
    const books = {
      early: "【早期大藏經與隋唐禪籍（含敦煌本《壇經》S.5475）】未載靈山拈花公案；敦煌本展現較早質樸面貌，與 1310 年高麗刻本字句增廣形成明顯對照。",
      baolin: "【801年《寶林傳》（現存殘卷）】記載佛陀付囑「清淨法眼、涅槃妙心」予迦葉，但現存殘本未載拈花情節（缺卷部分不可直接斷定原本絕無記載）。",
      jingde: "【1004年《景德傳燈錄》】整理禪宗世系與付法傳承，同樣沒有完整「拈花微笑」記錄。",
      tiansheng: "【1029年編／約1036年刊《天聖廣燈錄》】北宋臨濟宗脈絡下，首度完整記錄「拈花微笑」與付法迦葉相結合；1093年《宗門統要集》進一步定型。",
      dafan: "【宋代《大梵天王問佛決疑經》（見《人天眼目》王安石引）】近代禪學史多判定為宋代本土撰述之疑偽經。文獻斷層不減損其在哲學上象徵「離言體證」的隱喻意義。"
    };
    allNodes("[data-chan]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-chan]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (out) out.textContent = books[b.dataset.chan] || "";
    }));
  })();

  // S17: Tibet Source Box Sorter
  (() => {
    const items = [
      { id: "tb1", label: "約779年赤松德贊建桑耶寺及吐蕃王室碑銘", rec: "archive", why: "具同時代吐蕃碑銘與歷史檔案佐證（歷史檔案／實物）。" },
      { id: "tb2", label: "西藏譯存大量印度已失傳的中觀、因明與密續文獻", rec: "archive", why: "現存丹珠爾／甘珠爾及梵藏對勘可獨立驗證其極高史料價值。" },
      { id: "tb3", label: "寧瑪派11世紀起桑傑喇嘛等地伏藏與意伏藏傳統", rec: "lineage", why: "可考出現年代常晚於所稱隱藏年代數百年，且曾受薩迦班智達批判；屬宗派傳統敘事，須逐份考察。" },
      { id: "tb4", label: "活佛轉世者確實是前世同一心識人物再生", rec: "belief", why: "13世紀噶瑪巴世系與1792金瓶掣籤屬制度史實；但『前世再生』本身屬宗教信仰，歷史學無法證實或證偽。" }
    ];
    let cur = items[0];
    const tText = $("#s17-item-text"), tOut = $("#s17-result");
    const render = () => {
      allNodes("[data-tibet-item]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.tibetItem === cur.id)));
      if (tText) tText.textContent = cur.label;
    };
    allNodes("[data-tibet-item]").forEach(b => b.addEventListener("click", () => {
      cur = items.find(x => x.id === b.dataset.tibetItem) || items[0];
      allNodes("[data-tbox]").forEach(x => x.setAttribute("aria-pressed", "false"));
      if (tOut) tOut.textContent = "請把這項說法放入對應的來源盒。";
      render();
    }));
    allNodes("[data-tbox]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-tbox]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (tOut) tOut.textContent = (b.dataset.tbox === cur.rec ? "✓ 分類合宜：" : "參考分析：") + cur.why;
    }));
    render();
  })();

  // S18: Ancient Library Preservation Sandbox (Toy demo)
  (() => {
    const out = $("#s18-out");
    function calc() {
      const checks = allNodes("[data-pol]:checked").map(c => c.dataset.pol);
      let msg = [];
      if (checks.includes("war")) msg.push("戰亂與滅佛（如北魏、北周、會昌、突厥軍事破壞）造成區域寫本大量焚毀");
      if (checks.includes("elite")) msg.push("大寺過度依賴王室田產而疏離居士日常（Fogelin 模型），贊助一轉移即迅速萎縮");
      if (checks.includes("canon")) msg.push("《開寶藏》依《開元釋教錄》雕印，使入選經典長期存世，未入錄者易隨時代散佚（存活者偏差）");
      if (checks.includes("copy")) msg.push("跨區域抄寫、石經（如房山、固都陶）與外傳（如斯里蘭卡、漢藏轉譯）增加文本留存機會");
      if (out) out.textContent = msg.length
        ? "【模擬示意，非古代真實統計】目前勾選因素顯示：" + msg.join("；") + "。"
        : "請勾選上方影響保存的因素，觀察為何後人能見到的經典往往只是歷史上存在過的一部分。";
    }
    allNodes("[data-pol]").forEach(c => c.addEventListener("change", calc));
    $("#s18-reset")?.addEventListener("click", () => {
      allNodes("[data-pol]").forEach(c => { c.checked = false; });
      calc();
    });
    calc();
  })();

  // S19: Japan 3-Era Switcher
  (() => {
    const out = $("#s19-out");
    const eras = {
      india: "【早期印度出家理想】強調離家不婚、依律共同生活、不以血緣世襲寺院地位，與王權保持相對自主（與當代部分日本寺院制度形成鮮明對比）。",
      medieval: "【13世紀親鸞至德川時代】淨土真宗開祖親鸞（1173–1263）早於明治數百年即採「非僧非俗」婚配；德川幕府檀家制度使寺院承擔戶籍登記功能。",
      meiji: "【1868神佛分離與1872肉食妻帶解禁】1872年明治政府解除國家對僧侶婚食之刑罰禁制（並非強制結婚），經各宗派激烈辯論後逐步普遍化；今日不同日本宗派與僧侶間仍有差異，不可一概而論。"
    };
    allNodes("[data-jpera]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-jpera]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (out) out.textContent = eras[b.dataset.jpera] || "";
    }));
  })();

  // S20: Women Ordination Relay & Perspectives
  (() => {
    const rOut = $("#s20-relay-out");
    const relays = {
      early: "【早期經律與八敬法研究】早期經文記載女眾證果解脫；Anālayo 與 Hüsken 跨部派比較指出《八敬法》與《摩訶僧祇律》等各律記載不一，未必全為佛世初創原始定規。",
      nanjing: "【429／433 斯里蘭卡→南朝建康（南京）】《比丘尼傳》（T2063）載 429 年首批斯里蘭卡比丘尼來華未滿十人，433 年鐵薩羅（Devasāra）率第二批抵南林寺補足法定人數行二部僧授戒，建立延續至今之漢傳比丘尼法脈。",
      revival96: "【1996 鹿野苑／1998 菩提伽耶】當代南傳比丘尼透過跨傳承合作（1998 年獲臺灣佛光山等漢傳僧團參與）舉行大型復戒，惟南傳各國與宗派承認度不一。",
      bhutan: "【2022／2025 不丹比丘尼大戒】2022年6月23日不丹第70任傑堪布首度為144位女眾授具足戒；2025年11月15–19日第二屆大戒，主辦方 Bhutan Nuns Foundation 公布為來自14國之265位女眾授戒（媒體報導亦稱近270位）。"
    };
    allNodes("[data-wrelay]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-wrelay]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (rOut) rOut.textContent = relays[b.dataset.wrelay] || "";
    }));
    const vOut = $("#s20-view-out");
    allNodes("[data-wview]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-wview]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (vOut) vOut.textContent = b.dataset.wview === "open"
        ? "支持跨傳承復戒觀點：指出早期律藏有比丘單獨授戒或跨部派整合歷史，且《八敬法》文本層次有後期編輯跡象（例如 Anālayo 等學者討論）。"
        : "傳統律學保留觀點：依本派傳承律法，認為具足戒須由本派現存無間斷比丘尼僧團共同授受，中斷後不得任意援引他部派恢復。本站並陳雙方理據，不代為投票判定宗教正統。";
    }));
  })();

  // S21: Taiwan Eras & Modern Myths
  (() => {
    const tOut = $("#s21-tw-out");
    const eras = {
      qing: "【清代至近代：觀音、民間信仰與齋教】觀音信仰、祖先祭祀與地方神明共構（附 1895–1922 艋舺龍山寺歷史照片）。",
      jp: "【1895–1945 日治時期】日本宗派來臺、1922年南瀛佛教會成立，推動近代佛教教育與女性出家調適（附約 1932 年西本願寺臺灣別院歷史照片）。",
      postwar: "【1945年後：漢傳重建與人間佛教思想】戰後來臺僧侶建立規範傳戒制度，太虛與印順法師推動人間佛教與《阿含》結構研究（佛光山創於 1967 年；此處配當代園區實景並明標非戰後初期檔案）。",
      modern: "【20世紀後期至今：公民社會與多元傳承】1987解嚴後慈濟、佛光山、法鼓山等投入慈善醫療教育，並廣泛引進南傳、藏傳修行（附 2011 臺北慈濟醫院外觀照，兼顧個人隱私）。"
    };
    allNodes("[data-twera]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-twera]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (tOut) tOut.textContent = eras[b.dataset.twera] || "";
    }));

    const mOut = $("#s21-mod-out");
    const myths = {
      phil: "「佛教只是哲學或心理學」：McMahan (2008) 與 Braun (2013) 指出這是19–20世紀亞洲改革者與西方對話建構的現代詮釋，早期文獻確含神祇與出離生死目標。",
      science: "「所有佛教教義都已符合現代科學」：缺乏充分證據；早期內觀與宗教信念不能混同於控制實驗室證實。",
      mindfulness: "「現代正念＝完整八正道，且絕對安全」：世俗正念常抽離戒律與涅槃脈絡；Salguero (2026) 與 PMC11300403 均記錄禪修可能引發焦慮或解離等「禪病」風險，須視個人條件並勿代替醫療。",
      charity: "「慈善服務是佛教唯一核心」：人間佛教是現代社會極具價值的實踐取向之一，但不等於古印度早期僧團的全部生活形態。"
    };
    allNodes("[data-modclaim]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-modclaim]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (mOut) mOut.textContent = myths[b.dataset.modclaim] || "";
    }));
  })();

  // S22: 7-Step Workbench + Qualitative Burden Selector + Copy Notes
  const checks = allNodes(".audit-check");
  const sample = $("#audit-case");
  let selected = "";
  const cases = {
    "拈花微笑是否有早期文獻？": "先查站點16與研究頁 #flower-sermon（801《寶林傳》→1004《景德》→1029/1036《天聖廣燈錄》），區分歷史文獻斷層與哲學象徵。",
    "《伽藍經》是否叫人只相信自己？": "先查站點04與研究頁 #kalama-context（AN 3.65 與 MA 16），留意十條之外的智者讚責、貪瞋癡與四安穩。",
    "「佛陀說過」的網路語錄圖卡": "先追溯可定位之原典經號與最早版本；查無可靠出處時誠實保持「目前未知」。"
  };
  function audit() {
    if (!checks.length) return;
    const n = checks.filter(x => x.checked).length;
    const as = $("#audit-status");
    if (as) as.textContent = n + "／7 個步驟已勾選。" + (n === 7 ? "流程自填完成，仍須逐項核對證據品質與限制（絕非驗證通過分數）。" : "這是進度記錄，不是真偽分數。");
    put("checks", JSON.stringify(checks.map(x => x.checked)));
    put("case", selected);
  }
  try {
    const saved = JSON.parse(get("checks") || "[]");
    checks.forEach((c, i) => { c.checked = !!saved[i]; });
    selected = get("case") || "";
    if (sample && cases[selected]) {
      sample.value = selected;
      const cs = $("#case-status");
      if (cs) cs.textContent = cases[selected];
    }
  } catch {}
  checks.forEach(c => c.addEventListener("change", audit));
  $("#load-case")?.addEventListener("click", () => {
    if (!sample) return;
    selected = sample.value;
    checks.forEach(c => { c.checked = false; });
    const cs = $("#case-status");
    if (cs) cs.textContent = cases[selected] || "請自行輸入或選擇要查證的主張。";
    audit();
  });
  $("#reset-audit")?.addEventListener("click", () => {
    checks.forEach(c => { c.checked = false; });
    audit();
  });
  $("#copy-notes")?.addEventListener("click", async () => {
    const notes = "佛法查證筆記（僅作個人筆記，非真偽判定分數）\n主張：" + (selected || "自行選擇") + "\n" +
      checks.map(c => (c.checked ? "[已勾選] " : "[待查] ") + c.parentElement.innerText).join("\n") +
      "\n結論與未知：請註明在何種新證據出現時修正。\n" + location.origin + location.pathname + "#lab";
    const out = $("#notes-output");
    if (out) out.value = notes;
    const cs = $("#copy-status");
    try {
      await navigator.clipboard.writeText(notes);
      if (cs) cs.textContent = "已複製純文字筆記。";
      if (out) out.hidden = true;
    } catch {
      if (out) { out.hidden = false; out.focus(); out.select(); }
      if (cs) cs.textContent = "無法自動複製；請手動選取下方純文字筆記複製。";
    }
  });

  // S22: Qualitative Burden Selector (replaces 5-bar score)
  (() => {
    const out = $("#s22-risk-out");
    const burdens = {
      high: "【極高舉證負擔（非偽造百分比）】秘密未改傳承、神聖祖師世系、後世經典稱佛陀逐字親授、唯一正統、神通認證：須要求超越宗派自述之獨立同時代證據，缺證據時保持未知。",
      mid: "【中度審查（須比對版本脈絡）】後世祖師詮釋、單一部派保存的早期經文（P2）：確認其代表某時期或該傳承觀點，不直接等於全體早期共識或佛陀逐字原音。",
      low: "【較低來源風險（仍須界定證明範圍）】跨部派共同早期思想（P1）與可獨立查證碑銘實物（A）：支持「該時期已有此教法或聖地」，仍不等於超自然命題或全部故事為真。"
    };
    allNodes("[data-risk]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-risk]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (out) out.textContent = burdens[b.dataset.risk] || "";
    }));
  })();

  audit();
  filterSources();
  route(!!location.hash);
})();
