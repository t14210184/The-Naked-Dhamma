(() => {
  "use strict";
  const root = document.documentElement;
  const $ = s => document.querySelector(s);
  const allNodes = s => [...document.querySelectorAll(s)];
  const get = k => { try { return localStorage.getItem("dhamma-history-" + k); } catch { return null; } };
  const put = (k, v) => { try { if (v === null) localStorage.removeItem("dhamma-history-" + k); else localStorage.setItem("dhamma-history-" + k, v); } catch {} };
  const reducedMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    if (fs) fs.textContent = "現在字級 " + size + "px";
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
      tb.textContent = dark ? "換成暖紙淺色" : "換成柔光深色";
    }
    put("theme", dark ? "dark" : "light");
  }
  $("#theme")?.addEventListener("click", () => applyTheme(root.dataset.theme !== "dark"));
  applyFont();
  applyTheme(get("theme") === "dark");

  // Optional speech reader (OFF by default)
  const ttsBtn = $("#tts-toggle"), ttsStatus = $("#tts-status");
  if (ttsBtn && "speechSynthesis" in window) {
    ttsBtn.hidden = false;
    const stopSpeech = () => {
      try { window.speechSynthesis.cancel(); } catch {}
      ttsBtn.setAttribute("aria-pressed", "false");
      ttsBtn.textContent = "唸這頁給我聽";
      if (ttsStatus) ttsStatus.textContent = "已停止唸讀。";
    };
    ttsBtn.addEventListener("click", () => {
      if (window.speechSynthesis.speaking) { stopSpeech(); return; }
      const activeView = views.find(v => !v.hidden) || $("#top");
      const text = (activeView?.innerText || "").replace(/\s+/g, " ").slice(0, 2400);
      if (!text) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-TW";
      u.rate = 0.92;
      u.onend = stopSpeech;
      u.onerror = stopSpeech;
      ttsBtn.setAttribute("aria-pressed", "true");
      ttsBtn.textContent = "停止唸讀";
      if (ttsStatus) ttsStatus.textContent = "正在幫您唸出目前畫面的故事。";
      window.speechSynthesis.speak(u);
    });
    window.addEventListener("hashchange", () => { if (window.speechSynthesis.speaking) stopSpeech(); });
  }

  // Resume bookmark
  const resume = $("#resume"), resumeLink = $("#resume-link");
  let backSource = null;
  function resumeUpdate() {
    if (!resume || !resumeLink) return;
    const saved = stations.find(s => s.id === get("last"));
    resume.hidden = !saved;
    if (saved) {
      resumeLink.href = "#" + saved.id;
      resumeLink.textContent = "繼續第 " + String(saved.dataset.station).padStart(2, "0") + " 關：" + saved.querySelector("h2").textContent;
    }
  }
  $("#resume-close")?.addEventListener("click", () => { put("last", null); resumeUpdate(); });

  // Library search & filter
  const search = $("#source-search"), cards = allNodes("[data-source]");
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
        ? "找不到跟「" + search.value.trim() + "」有關的資料（代表這裡沒收進這幾個字，不是說歷史上不存在喔）。"
        : "目前顯示 " + n + "／" + cards.length + " 組資料。";
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
        routeNotice.textContent = "找不到這個位置的標籤，先帶您回到故事館首頁地圖。";
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
      const src = backSource && stations.find(s => s.id === backSource);
      sb.hidden = !src || view.id !== "library";
      if (src) {
        sb.href = "#" + src.id;
        sb.textContent = "← 回到第 " + String(src.dataset.station).padStart(2, "0") + " 關繼續玩";
      }
    }
    if (scroll) {
      const focusTarget = all ? ($("#all")?.nextElementSibling || view) : (target || view);
      if (target && !all && target !== view) target.scrollIntoView();
      else window.scrollTo(0, 0);
      focusTarget?.focus?.({ preventScroll: true });
    }
  }
  window.addEventListener("hashchange", () => route(true));
  route(false);
  resumeUpdate();

  // Image failure graceful message
  allNodes("img[data-fallback]").forEach(img => {
    img.addEventListener("error", () => {
      img.hidden = true;
      const box = img.parentElement?.querySelector(".img-fallback");
      if (box) box.hidden = false;
    });
  });

  // Generic multiple-choice helper (inside optional collapsible extras)
  allNodes("button[data-feedback]").forEach(b => {
    b.addEventListener("click", () => {
      const out = document.getElementById(b.getAttribute("aria-controls"));
      const box = b.closest("[role=group]");
      if (!out || !box) return;
      box.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      out.textContent = b.dataset.feedback;
    });
  });

  // S01: Four Visitors Interactive Gate
  (() => {
    const visitors = {
      v1: { tag: "1. 說親耳聽過的人", quote: "第一位客人開口：「我在佛陀面前親耳聽到這段話！」", ok: "就算搬出親耳聽見佛陀，一樣先不直接點頭或趕走，把句子記下來送去跟公認的經和律核對！" },
      v2: { tag: "2. 代表一整座大寺的人", quote: "第二位客人拿出印章：「我們整座大寺院的長老都同意這段說法！」", ok: "整間廟人多勢眾也不能跳過檢查，照樣比對經典與生活規範。" },
      v3: { tag: "3. 三位博學前輩代表", quote: "第三位客人說：「好幾位最會背經典、最懂戒規的老前輩都背書了！」", ok: "幾位老專家一致推薦一樣要拿上桌面核對，不合的就客氣放下。" },
      v4: { tag: "4. 最受敬重的老師傳人", quote: "第四位客人自信滿滿：「我那位非常有名的師父親自這樣教我！」", ok: "不管師父名氣多響亮，查證程序跟其他人完全一模一樣。" }
    };
    let curV = "v1";
    const tested = new Set();
    const vText = $("#s01-visitor-text"), vOut = $("#s01-result"), vCount = $("#s01-progress");
    const badge = $("#s01-stage-badge"), stamp = $("#s01-desk-stamp");
    const renderV = (actText) => {
      allNodes("[data-visitor]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.visitor === curV)));
      if (vText && visitors[curV]) vText.textContent = visitors[curV].quote;
      if (badge && visitors[curV]) badge.textContent = "目前站在桌前：" + visitors[curV].tag;
      if (vCount) vCount.textContent = "已經盤問過的來客：" + tested.size + "／4 位（四位裡面沒有半個可以跳過比對！）";
      Object.keys(visitors).forEach(k => {
        const chk = $("#s01-chk-" + k);
        if (chk) chk.textContent = tested.has(k) ? "已查 ✓" : "未查";
      });
      if (stamp && actText) stamp.textContent = actText;
    };
    allNodes("[data-visitor]").forEach(b => b.addEventListener("click", () => {
      curV = b.dataset.visitor;
      allNodes("[data-vaction]").forEach(x => x.setAttribute("aria-pressed", "false"));
      if (vOut) vOut.textContent = "輪到這位客人了！試著點下面三種回應看看桌面反應。";
      renderV("桌上狀態：等著聽清楚他說的話");
    }));
    allNodes("[data-vaction]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-vaction]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const act = b.dataset.vaction;
      tested.add(curV);
      if (act === "believe") {
        if (vOut) vOut.textContent = "哎呀，不能這樣就直接相信！" + visitors[curV].ok;
        renderV("桌上警示：不能只靠搬出權威就點頭！");
      } else if (act === "reject") {
        if (vOut) vOut.textContent = "先別急著趕走或罵人！故事說「不要急著誇，也不要急著斥責」，先把每句話記下來看仔細。";
        renderV("桌上提醒：不先入為主反對，先把話記下");
      } else {
        if (vOut) vOut.textContent = "✓ 做得好！" + visitors[curV].ok;
        renderV("桌上印章：已放上經律桌仔細比對 ✓");
      }
    }));
    $("#s01-reset")?.addEventListener("click", () => {
      curV = "v1"; tested.clear();
      allNodes("[data-vaction]").forEach(x => x.setAttribute("aria-pressed", "false"));
      if (vOut) vOut.textContent = "重設完成！再讓四位客人輪流走上前試試看。";
      renderV("桌上狀態：還沒決定怎麼處理");
    });
    renderV("桌上狀態：還沒決定怎麼處理");
  })();

  // S02: Ancient Drum Workshop
  (() => {
    let mode = "pali", step = 0, soundOn = false;
    const patches = allNodes(".drum-patch"), status = $("#drum-status"), patch = $("#patch"), soundBtn = $("#drum-sound");
    function beep(pitch, damp) {
      if (!soundOn) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        const ctx = new AC(), osc = ctx.createOscillator(), g = ctx.createGain();
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
      const body = $("#drum-body"), leather = $("#leather"), peel = $("#leather-peel");
      if (body) body.setAttribute("fill-opacity", pali ? String(Math.max(0.15, 1 - step * 0.17)) : (step >= 2 ? "0.2" : "1"));
      if (leather) leather.setAttribute("opacity", String(!pali && step >= 1 ? 1 : 0));
      if (peel) peel.setAttribute("opacity", String(!pali && step >= 2 ? 1 : 0));
      patch.disabled = step >= max;
      $("#mode-pali")?.setAttribute("aria-pressed", String(pali));
      $("#mode-han")?.setAttribute("aria-pressed", String(!pali));
      const dm = $("#drum-mode");
      if (dm) dm.textContent = pali
        ? "故事 A（補新木片）：每裂開一次就塞進一塊新木頭，原木越來越少。"
        : "故事 B（改繃牛皮）：裂開後改用牛皮繃緊纏補，聲音卻再也不像從前響亮。";
      if (pali) {
        status.textContent = step ? ("已經塞入第 " + step + "／5 塊新木片。" + (step === 5 ? "整面鼓幾乎找不回原本那塊木頭，只剩一排木片補丁了！" : "看得出原鼓木色正一塊塊消失。")) : "還沒有動手修補，原木鼓身看得到一條裂痕。";
      } else {
        status.textContent = step === 0 ? "剛拿到鼓（這版說本來敲一聲可以傳幾十里遠！）。"
          : (step === 1 ? "步驟 1／2：用牛皮把鼓面緊緊纏補一圈，雖然補起來了，美妙響聲卻再也回不來。" : "步驟 2／2：日子一久牛皮整片脫落爛掉，地上只剩下碎掉的木堆！");
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
      soundBtn.textContent = soundOn ? "鼓聲示範：已開啟（只是模擬音色）" : "鼓聲示範：目前靜音";
    });
    drum();
  })();

  // S03: Teacher Diary Across 3 Timepoints
  (() => {
    const pages = {
      early: {
        badge: "📅 第一頁｜剛認識前兩週",
        title: "看起來簡單樸素、講課也很清楚",
        metrics: "👀 看得到的：每天穿很樸素、說話輕聲細語。<br>❓ 還看不到的：沒看過他生氣、遇到錢或被人批評會怎麼樣。",
        quote: "「才相處兩個禮拜，課講得很順，可是他平常真的都這樣嗎？」"
      },
      famous: {
        badge: "📅 第二頁｜突然紅起來、捐款變多之後",
        title: "人前很溫和，私下對問問題的人發火",
        metrics: "👀 看得到的：舞台上還是笑咪咪，但私下被看到責罵發問的學生、又開口要高額捐款。<br>⚖️ 線索改變了：前面好印象不代表後面可以不用看！",
        quote: "「奇怪，有錢跟名氣進來之後，怎麼跟兩個禮拜前不太一樣？」"
      },
      critic: {
        badge: "📅 第三頁｜被人公開抓出引用錯誤時",
        title: "坦白承認講錯了並向對方說謝謝",
        metrics: "👀 看得到的：沒生氣、沒叫粉絲去罵人，當場認錯修正。<br>🔍 還是記得分寸：這只能證明他願意改錯，還是不能猜測他心裡有沒有開悟。",
        quote: "「他被挑毛病的時候能這麼平靜道歉，這部分滿值得敬佩，不過還是繼續觀察最穩妥。」"
      }
    };
    let cur = "early";
    const sOut = $("#s03-stage-text"), jOut = $("#s03-judge-result");
    const bEl = $("#s03-time-badge"), tEl = $("#s03-scene-title"), mEl = $("#s03-scene-metrics");
    const renderS = () => {
      const p = pages[cur];
      allNodes("[data-tstage]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.tstage === cur)));
      if (bEl) bEl.textContent = p.badge;
      if (tEl) tEl.textContent = p.title;
      if (mEl) mEl.innerHTML = p.metrics;
      if (sOut) sOut.textContent = p.quote;
    };
    allNodes("[data-tstage]").forEach(b => b.addEventListener("click", () => {
      cur = b.dataset.tstage;
      allNodes("[data-tjudge]").forEach(x => x.setAttribute("aria-pressed", "false"));
      if (jOut) jOut.textContent = "換到這一頁了，點下方決定你現在怎麼看他！";
      renderS();
    }));
    allNodes("[data-tjudge]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-tjudge]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const j = b.dataset.tjudge;
      if (!jOut) return;
      if (j === "mind") {
        jOut.textContent = "超過我們能看得到的範圍囉！人的腦袋裡面在想什麼、有沒有全知開悟，不是看表面幾件事就能猜到的。";
      } else if (j === "insufficient") {
        jOut.textContent = cur === "early"
          ? "✓ 很準！相處才兩週資料太少，故事裡本來就說要長時間慢慢觀察才算數。"
          : "✓ 很公道！當線索還不夠時，留下觀察記錄而不亂下定論最誠實。";
      } else {
        jOut.textContent = cur === "famous"
          ? "✓ 記下這些實際看得到的行為：紅起來之後出現貪心或發脾氣，正是這則故事最提醒我們留意的時刻。"
          : "✓ 你看得很仔細！記下看得到的言行、又不斷言人家的心靈境界，就是最踏實的態度。";
      }
    }));
    $("#s03-reset")?.addEventListener("click", () => {
      cur = "early";
      allNodes("[data-tjudge]").forEach(x => x.setAttribute("aria-pressed", "false"));
      if (jOut) jOut.textContent = "筆記本重設完成，從第一頁重新翻起。";
      renderS();
    });
    renderS();
  })();

  // S04: PRIORITY REWORK — Game A (10 Town Villagers) + Game B (4 Hypothetical Worlds)
  (() => {
    const npcs = {
      n1: {
        tag: "1. 愛講古的村口阿伯（世代口傳）",
        quote: "村口阿伯笑著說：「我們從祖父那時候就是這樣一直講下來的，還能錯嗎？」",
        clue: "【打開線索】老人家的口述記憶很珍貴，有時候真的保存了老祖先的生活智慧；可是口耳相傳好幾代，也可能漏字、記錯年代或把後來的事誤當成老規矩。",
        scale: "⚖️ 放上天平：光靠「大家都一直這樣講」不能直接確定它是對是錯，還要看照這樣做會不會帶來貪心、怒氣或傷害別人。"
      },
      n2: {
        tag: "2. 謹慎的大廟小師兄（一代傳一代）",
        quote: "小師兄說：「這套方法是我師公傳給師父、代代一脈單傳下來的規矩！」",
        clue: "【打開線索】有師徒代代交接通常代表有系統的訓練，值得尊重；但哪怕是很有歷史的傳統，每一代在流傳過程中仍可能自己加料或改寫。",
        scale: "⚖️ 放上天平：「傳了十代」不自動等於完全沒出錯，還是要看教法實際上讓人更善良還是更愛爭吵。"
      },
      n3: {
        tag: "3. 熱心的茶館老闆娘（大家都在轉傳）",
        quote: "老闆娘倒茶說：「整條街跟聊天群組都在轉傳這句名言，沒聽過就落伍啦！」",
        clue: "【打開線索】街坊瘋狂轉傳的消息有時確實反映當下重要的事，但也最容易「一人傳一句」變成走樣消息。",
        scale: "⚖️ 放上天平：一百萬人轉傳跟這句話是不是真的、對人有沒有好處，其實是兩回事！"
      },
      n4: {
        tag: "4. 認真的捧書先生（書本或經典有寫）",
        quote: "書生翻開書本：「你別不信，我手裡這本古老書卷上真的白紙黑字這樣寫！」",
        clue: "【打開線索】書裡寫著代表這套說法確實有文字來源、不是隨便編的；但書也會經過抄錯、翻譯差異或不同年代整理，還得對別本跟看脈絡。",
        scale: "⚖️ 放上天平：「書上寫了」是很好的開始，但仍不能單憑書裡一句話就停止檢查它造成的行為結果。"
      },
      n5: {
        tag: "5. 聰明的年輕辯論員（邏輯推理起來很通）",
        quote: "辯論員自信說：「你聽我的前提一、二、三推下去，邏輯完美無缺對吧？」",
        clue: "【打開線索】思考有條理超棒，能幫忙抓出矛盾！但如果最開始的前提本身就錯了，越合邏輯的推論反而會把人帶往錯得更遠的地方。",
        scale: "⚖️ 放上天平：想起來很有道理只是其中一個線索，還要走出紙上談兵，看現實做出來結果怎麼樣。"
      },
      n6: {
        tag: "6. 精明的市集算帳人（看過類似例子就類推）",
        quote: "算帳人敲敲算盤：「我遇過三次這種事都長一樣，所以第四次一定也是這樣！」",
        clue: "【打開線索】從經驗找規律很好用，可是把少數例子直接套用到全部情況，很容易漏掉剛好不一樣的例外。",
        scale: "⚖️ 放上天平：類推幫我們假設，但假設之後一樣需要看這件事是不是真的讓人減苦不害人。"
      },
      n7: {
        tag: "7. 愛動腦筋的學生（自己想通的漂亮想法）",
        quote: "學生興奮跑來：「我昨晚邊散步邊想，突然把所有人生大事想通成一套圓滿理論！」",
        clue: "【打開線索】反覆思考幫助整理頭緒，但一個人覺得自己想得無懈可擊，不代表世界現實跟那套想法長得一模一樣。",
        scale: "⚖️ 放上天平：想得通順不等於事實已經驗證過，還要經得起日常生活跟明理人的檢驗。"
      },
      n8: {
        tag: "8. 直爽的挑水大姊（剛好符合我原本想法）",
        quote: "大姊點頭說：「這一位講的跟我想的完全一樣！不用再比了，我就選這個！」",
        clue: "【打開線索】碰到跟自己胃口一樣的看法會特別開心很正常——但危險就在這裡：人最容易「剛好順我意就當成真理」，直接跳過反省。",
        scale: "⚖️ 放上天平：我喜歡 ≠ 這是對的！越符合自己原本胃口的說法，越要問自己「這有沒有助長我的私心跟偏見？」"
      },
      n9: {
        tag: "9. 穿體面長袍的大講者（看起來很有風度、有學問）",
        quote: "穿長袍的先生微笑：「看我的氣質、頭銜跟說話風範，我是騙人的人嗎？」",
        clue: "【打開線索】態度溫和有教養會讓人安心；但有才華、口才好、穿得莊嚴的人，也可能教錯方向或偶爾看錯事情。",
        scale: "⚖️ 放上天平：外表風度跟這句話是否真實、是否叫人更少貪氣是分開的兩件事。"
      },
      n10: {
        tag: "10. 敬愛老師的忠實徒弟（因為他是我敬重的師父）",
        quote: "徒弟恭敬說：「他平常對我們那麼好、又是我的老師，他說的話我就照收！」",
        clue: "【打開線索】尊重與感謝用心教導的好老師非常美；但真正的好老師也希望學生看清楚道理，而不是因為人情壓力閉眼睛照單全收。",
        scale: "⚖️ 放上天平：尊重老師和替自己做的選擇負起責任，一點都不衝突！"
      }
    };
    const keys = Object.keys(npcs);
    let curN = "n1";
    const pinned = new Set();
    const nTag = $("#s04-speaker-tag"), nQuote = $("#s04-npc-quote"), nOut = $("#s04-clue-out"), savedBadge = $("#s04-saved-badge");
    const renderNpc = () => {
      const info = npcs[curN];
      allNodes("[data-kalama-npc]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.kalamaNpc === curN)));
      if (nTag) nTag.textContent = "目前走到廣場中間：" + info.tag;
      if (nQuote) nQuote.textContent = info.quote;
      if (savedBadge) savedBadge.textContent = "已放進「先保留不亂定案」板：" + pinned.size + "／10 則";
      $("#s04-flip-clue")?.setAttribute("aria-pressed", "false");
      $("#s04-weigh-harm")?.setAttribute("aria-pressed", "false");
      $("#s04-pin-hold")?.setAttribute("aria-pressed", String(pinned.has(curN)));
    };
    allNodes("[data-kalama-npc]").forEach(b => b.addEventListener("click", () => {
      curN = b.dataset.kalamaNpc;
      if (nOut) nOut.textContent = "聽完這個人說的話了！按下面按鈕打開線索，或放上天平量一量。";
      renderNpc();
    }));
    $("#s04-flip-clue")?.addEventListener("click", e => {
      e.currentTarget.setAttribute("aria-pressed", "true");
      if (nOut) nOut.textContent = npcs[curN].clue;
    });
    $("#s04-weigh-harm")?.addEventListener("click", e => {
      e.currentTarget.setAttribute("aria-pressed", "true");
      if (nOut) nOut.textContent = npcs[curN].scale;
    });
    $("#s04-pin-hold")?.addEventListener("click", e => {
      pinned.add(curN);
      e.currentTarget.setAttribute("aria-pressed", "true");
      if (savedBadge) savedBadge.textContent = "已放進「先保留不亂定案」板：" + pinned.size + "／10 則";
      if (nOut) nOut.textContent = "✓ 記下這條線索先擱著！現在已經留待繼續查對 " + pinned.size + "／10 位居民的話。不急著馬上選邊站就是好習慣。";
    });
    $("#s04-next-npc")?.addEventListener("click", () => {
      const idx = (keys.indexOf(curN) + 1) % keys.length;
      curN = keys[idx];
      if (nOut) nOut.textContent = "換下一位街坊站上來講他的理由了！";
      renderNpc();
    });
    renderNpc();

    // Game B: Four Hypothetical Worlds
    const worlds = {
      a1: {
        badge: "假設世界 1／4｜假如有下輩子，好壞也有報應",
        title: "阿明幫助鄰居，心安理得走下去",
        scene: "🌤️ <strong>眼前生活：</strong>街坊喜歡他，他每天睡得安穩。<br>🚶 <strong>未來路徑：</strong>照這個世界的假設，不傷人的人走到未來也會走向好地方。",
        txt: "世界 1：如果真的有死後世界和善惡報應，阿明因為平常不害人、心裡善良，死後也能安心。（這是故事裡推想的安慰，並不是用動畫證明真有來世喔！）"
      },
      a2: {
        badge: "假設世界 2／4｜假如根本沒有下輩子，也沒有報應",
        title: "沒有天堂獎賞，阿明今天依然過得好好的！",
        scene: "🏡 <strong>眼前生活：</strong>今天在村裡不怨恨、少紛爭、晚上不怕有人上門討債。<br>😌 <strong>當下收穫：</strong>明理的鄰居也喜歡跟他做朋友，根本不用等到死後才有用。",
        txt: "世界 2：就算什麼下輩子跟神明算帳都不存在，阿明靠著不故意傷人、放掉嫉妒怨氣，光是在今天這輩子就過得平靜受尊重，完全不虧！"
      },
      a3: {
        badge: "假設世界 3／4｜假如做壞事會帶來不好的後果（不只死後！）",
        title: "不害人的阿明，自然避開那些因作惡招來的麻煩",
        scene: "🛡️ <strong>真實人際：</strong>不說謊、不偷搶、不騙人，自然不容易惹上官司、報復或眾叛親離。<br>🌿 <strong>心裡狀態：</strong>不用每天提心吊膽怕東窗事發。",
        txt: "世界 3：如果做壞事在今生或之後真的會招來苦果——阿明根本沒有去做那些害人的事，當然也就避開了做惡帶來的苦頭！"
      },
      a4: {
        badge: "假設世界 4／4｜假如做壞事不會帶來這種惡果（包含這輩子沒抓到！）",
        title: "就算做壞事都不會挨罰，阿明還是站在乾淨清白這邊",
        scene: "✨ <strong>乾淨的心：</strong>不用靠害怕挨罰才做個好人！<br>💛 <strong>人際信任：</strong>自己問心無愧、不用躲躲藏藏，兩邊（現在與心安）都站得住。",
        txt: "世界 4：就算在一個「壞人做壞事好像也不會被罰」的世界，阿明不靠害怕報應才守規矩——因為不害人讓他現在心裡乾乾淨淨、坦然面對自己和鄰居。（再次提醒：做好人並不保證完全免於天災或別人的惡意，但至少對得起自己的心。）"
      }
    };
    allNodes("[data-assasa]").forEach(b => b.addEventListener("click", () => {
      const w = worlds[b.dataset.assasa] || worlds.a1;
      allNodes("[data-assasa]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if ($("#s04-world-badge")) $("#s04-world-badge").textContent = w.badge;
      if ($("#s04-world-title")) $("#s04-world-title").textContent = w.title;
      if ($("#s04-world-scene")) $("#s04-world-scene").innerHTML = w.scene;
      if ($("#s04-assasa-out")) $("#s04-assasa-out").textContent = w.txt;
    }));
  })();

  // S05: TEMPLATE FLAGSHIP — Three Full Storybook Scenes (Basin, Elephant, Mirror)
  (() => {
    const bOut = $("#s05-basin-out"), water = $("#basin-water"), surface = $("#basin-surface"), bowl = $("#basin-bowl"), drops = $("#basin-drops"), puddle = $("#basin-puddle"), lbl = $("#basin-svg-label");
    const states = {
      full: { y: 66, h: 86, surfY: 66, surfOp: 0.88, flip: false, drop: 0, pud: 0, lbl: "盆裡原本裝滿乾淨的水", txt: "銅盆剛洗完腳、裡面還裝滿水。請照故事順序點點看下面的按鈕！" },
      little: { y: 124, h: 28, surfY: 124, surfOp: 0.8, flip: false, drop: 1, pud: 0.45, lbl: "只剩下淺淺一點水", txt: "1. 倒掉一些水：師父指著幾乎倒空的小盆問小羅睺羅：「如果一個人故意說謊卻一點也不覺得難為情，他的修行就只像這剩下的一點點水！」" },
      empty: { y: 152, h: 0, surfY: 152, surfOp: 0, flip: false, drop: 0.7, pud: 0.85, lbl: "裡頭水全倒乾了", txt: "2. 把水全部倒光：剩下的那一點也全潑出來了——「故意說謊不認錯，就等於把原本的好意全倒光。」" },
      flipped: { y: 152, h: 0, surfY: 152, surfOp: 0, flip: true, drop: 0, pud: 0.9, lbl: "盆口朝下蓋在石地上", txt: "3. 把盆子倒過來：空盆整個蓋住地面，上面什麼都裝不進去，提醒「固執說謊的人連好話也聽不進去了」。" },
      upright: { y: 152, h: 0, surfY: 152, surfOp: 0, flip: false, drop: 0, pud: 0.9, lbl: "翻回來還是空空的盆", txt: "4. 把盆子翻回來：看一看那裡面空空如也！只要人自己不想誠實，就算翻正了裡頭也裝不進實實在在的好修行。" }
    };
    allNodes("[data-basin]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-basin]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const st = states[b.dataset.basin] || states.full;
      if (water) { water.setAttribute("y", String(st.y)); water.setAttribute("height", String(st.h)); }
      if (surface) { surface.setAttribute("cy", String(st.surfY)); surface.setAttribute("opacity", String(st.surfOp)); }
      if (bowl) bowl.setAttribute("transform", st.flip ? "rotate(180 150 108)" : "");
      if (drops) drops.setAttribute("opacity", String(st.drop));
      if (puddle) puddle.setAttribute("opacity", String(st.pud));
      if (lbl) lbl.textContent = st.lbl;
      if (bOut) bOut.textContent = st.txt;
    }));

    const elBadge = $("#s05-el-badge"), elOut = $("#s05-el-out");
    const elSteps = {
      look: { badge: "目前聚焦：看清楚這頭真實的亞洲大象", txt: "古印度國王的戰象身高體壯，前面走著四條粗壯像柱子的腿、有堅硬的象牙和大耳朵——但牠最寶貝的其實是敏感又不能受傷的長鼻子。" },
      protect: { badge: "目前聚焦：鼻子捲進象牙後面保護起來！", txt: "馴象師看戰象上戰場時，看到牠雖然全身用力衝鋒，卻死死把軟軟的長鼻子捲起來藏好；一旦連最重要的長鼻子都不保護了，代表這頭象已經失控了。" },
      meaning: { badge: "目前聚焦：這跟說話誠實有什麼關係？", txt: "故事以此告訴羅睺羅：一個人如果連「故意講假話欺騙別人」都不在乎、也不覺害臊，那就像大象連最要緊的鼻子都放棄保護了，什麼事情都可能幹得出來。" }
    };
    allNodes("[data-elstep]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-elstep]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const e = elSteps[b.dataset.elstep] || elSteps.look;
      if (elBadge) elBadge.textContent = e.badge;
      if (elOut) elOut.textContent = e.txt;
    }));

    const mTag = $("#s05-mirror-tag"), mOut = $("#s05-mirror-out");
    const mTexts = {
      before: { tag: "故事定格：左邊畫面｜準備講出口前先照一下", txt: "【做之前先想一想】小安差點把同學的糗事發到班群，拿起銅鏡想了一秒：「這句話發出去會害別人受傷嗎？」想通了就決定先不講，省下一場傷害。" },
      during: { tag: "故事定格：中間畫面｜話講到一半看見朋友臉色不對", txt: "【正在做的時候留意】小安原本想開個玩笑，講到一半看到朋友眼神慌了、自己也有點愧疚——趕快像中間畫面這樣喊卡剎車，不硬撐把傷害說完！" },
      after: { tag: "故事定格：右邊畫面｜做錯之後主動跟朋友道歉修補", txt: "【做錯了之後怎麼辦】如果話已經傳錯或傷了朋友的心，就像右邊畫面這樣不逃避、坦坦白白跟受影響的人認錯更正，以後不要再犯。" }
    };
    allNodes("[data-mirror]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-mirror]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const m = mTexts[b.dataset.mirror] || mTexts.before;
      if (mTag) mTag.textContent = m.tag;
      if (mOut) mOut.textContent = m.txt;
    }));
  })();

  // S06: Two Lifestyle Paths
  (() => {
    const badge = $("#s06-path-badge"), out = $("#s06-dir-out");
    const cases = {
      d1: { b: "🚶 旅人腳步：走上左邊清爽森林路", t: "【不藏私分享正確知識】這條路讓人越走越輕快：不需要拼命佔有、炫耀或綁住別人，心裡更安定。" },
      d2: { b: "🏋️ 旅人腳步：被拖上右邊背大金袋的累人路", t: "【一直推銷花錢消災課程】一直鼓吹花更多錢去買福報或怕錯失好處，只會增加慾望和心頭沉重，跟經典建議的方向正好相反。" },
      d3: { b: "🚶 旅人腳步：走在左邊踏實不誇張的小路", t: "【正常上班賺錢養家、量力幫助人】在家人好好工作照顧家庭完全合情合理；經典反對的是被貪心綁死，不是叫大家不能謀生！" },
      d_counter: { b: "⚠️ 小心這個看走眼的陷阱！", t: "就算有人穿得很破舊、住深山，也不代表他內心真的不貪不氣；而且這八個生活方向只能量「身心健康」，絕對不能拿來鑑定「這部佛經是不是公元前寫的」！"}
    };
    allNodes("[data-dir]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-dir]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const c = cases[b.dataset.dir] || cases.d1;
      if (badge) badge.textContent = c.b;
      if (out) out.textContent = c.t;
    }));
  })();

  // S07: Three Drawers
  (() => {
    const items = {
      t1: { text: "卡片 1：「聽說某位師父會神通，能算準下次樂透頭獎號碼。」", rec: "belief", why: "這沒有公開可檢驗的紀錄，只能算個人相不相信（別忘記故事第一步：承認這是個人信念，不要宣稱全世界沒信的人都是傻瓜）。" },
      t2: { text: "卡片 2：「西元前三世紀阿育王曾走訪藍毘尼村並立石柱紀念佛陀出生地。」", rec: "supported", why: "這找得到實實在在的石頭刻字跟考古紀錄！只要不多猜出石頭上沒寫的神話，就是有憑有據的歷史事實。" },
      t3: { text: "卡片 3：「釋迦牟尼佛確切是在公元前幾年幾月幾號出生的？」", rec: "unknown", why: "當時並沒有現代戶政機關或生日紀錄，今天全世界的學者對他過世年份都還有好幾十年的差距——老實放進「現在還不知道」最對！" },
      t4: { text: "卡片 4：「朋友說『每天靜坐十分鐘比較不焦慮』，一開始只有網路傳聞，後來看到醫院做了幾百人的對照試驗！」", rec: "supported", why: "這就是故事最妙的地方：同一句話一開始只有傳聞，放抽屜一；等真的出現嚴謹實驗證據（仍有適用條件），就可以誠實移動到抽屜二！" }
    };
    let cur = "t1";
    const drawers = { belief: $("#s07-dr-belief"), supported: $("#s07-dr-supported"), unknown: $("#s07-dr-unknown") };
    const activateDrawer = k => Object.entries(drawers).forEach(([id, el]) => el?.classList.toggle("is-active", id === k));
    allNodes("[data-epitem]").forEach(b => b.addEventListener("click", () => {
      cur = b.dataset.epitem;
      allNodes("[data-epitem]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      allNodes("[data-epcat]").forEach(x => x.setAttribute("aria-pressed", "false"));
      if ($("#s07-item-text")) $("#s07-item-text").textContent = items[cur].text;
      if ($("#s07-result")) $("#s07-result").textContent = "這張卡片應該收進上面哪一個抽屜呢？";
    }));
    allNodes("[data-epcat]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-epcat]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const pick = b.dataset.epcat, info = items[cur];
      activateDrawer(pick);
      if ($("#s07-result")) {
        $("#s07-result").textContent = (pick === info.rec ? "✓ 放得很對！" : "換個抽屜想想看：") + info.why;
      }
    }));
    $("#s07-reset")?.addEventListener("click", () => {
      cur = "t1";
      allNodes("[data-epitem]").forEach((x, i) => x.setAttribute("aria-pressed", String(i === 0)));
      allNodes("[data-epcat]").forEach(x => x.setAttribute("aria-pressed", "false"));
      activateDrawer("belief");
      if ($("#s07-item-text")) $("#s07-item-text").textContent = items.t1.text;
      if ($("#s07-result")) $("#s07-result").textContent = "抽屜重整完畢！挑張卡片重新收收看。";
    });
  })();

  // S08: Museum Artifact Magnifier (synchronous UI feedback before async image decode)
  (() => {
    const artifacts = {
      lumbini: {
        src: "assets/history/evidence/img01-rummindei-inscription.jpg",
        alt: "1896年印度考古調查局拍攝的藍毘尼阿育王石柱五行古代石刻文字近照",
        title: "藍毘尼石柱上的刻字（約兩千兩百多年前，真實古物照片未修圖）",
        obs: "先自己看圖找線索：石頭表面刻了五排整齊的古代文字，從上往下數第二排右邊，看得出「釋迦牟尼佛」的古老寫法。",
        cue: "放大提示：點下面「放大細節 ＋」到 140%–180%，看第二排右半段的石刻筆畫。",
        trans: "上面刻了什麼意思？國王登基第二十年親自來這裡禮敬，寫說因為「釋迦牟尼佛生在這個村子」，所以立柱紀念，並減免村裡稅金剩八分之一。",
        limit: "來源與限度：1896 年老檔案照片（已無版權限制）。證明公元前三世紀人們已認定這裡是佛陀誕生地，但沒有證明生在哪一年或出生走七步的神話。"
      },
      bhabra: {
        src: "assets/history/evidence/img01-bhabra-edict.jpg",
        alt: "1925年阿育王碑銘書籍刊印的加爾各答－拜拉特八行石刻拓片",
        title: "加爾各答－拜拉特石刻拓片（約兩千兩百多年前，真實拓片）",
        obs: "先自己看圖找線索：黑白色拓片上一共有八行密集的古代婆羅米文。",
        cue: "放大提示：中間偏右第六行提到了我們剛剛第 05 關玩的「教導羅睺羅不要故意說謊」！",
        trans: "上面刻了什麼意思？阿育王向大家致敬並推薦七段最值得反覆學習的經法，其中一段點名就是「關於羅睺羅不說假話的教誡」。",
        limit: "來源與限度：1925 年公開古文圖版（已無版權限制）。證實第 05 關那個教導主題早於公元前三世紀已流傳，但不代表今天看到的整篇長文一字未變。"
      },
      nigali: {
        src: "assets/history/evidence/img01-nigali-sagar.jpg",
        alt: "尼泊爾尼迦利薩格爾斷裂阿育王石柱表面的四行石刻照片",
        title: "尼迦利薩格爾阿育王石柱（約兩千兩百多年前，實景照片）",
        obs: "先自己看圖找線索：石柱斷段上保留了四行清楚刻痕跟風化痕跡。",
        cue: "放大提示：四排字直直對齊在石柱表面左下方位置。",
        trans: "上面刻了什麼意思？寫著國王即位第 14 年幫「更早以前出現過的佛（拘那含佛）」把佛塔擴建成兩倍大，第 20 年再親自來看並立石柱。",
        limit: "來源與限度：攝影作品分享（CC BY 2.0）。證明那時人們已經相信過去還有更早的古佛與建塔紀念，但石柱本身不能證明過去古佛神話為真。"
      },
      sarnath: {
        src: "assets/history/evidence/img01-sarnath-edict.jpg",
        alt: "1925年印行的鹿野苑阿育王石柱告示拓片，上方破損下方五行完整",
        title: "鹿野苑防止分裂石柱（約兩千兩百多年前，真實拓片）",
        obs: "先自己看圖找線索：上方幾行破損掉字了，底下連續五行刻得非常清楚。",
        cue: "放大提示：拉近看底下完整五行裡嚴整的官方文告格式。",
        trans: "上面刻了什麼意思？國王下令誰要是企圖把出家僧團拆裂分裂，就要請他穿回一般白衣離開寺院住處，顯示當時王權也直接介入維持團體秩序。",
        limit: "來源與限度：1925 年公開古文圖版（已無版權限制）。顯示王權確實介入維護僧團秩序，但沒有寫後世史書記的所有「第三次大集會」細節。"
      },
      gandhara: {
        src: "assets/history/evidence/img02-gandhara-bl-or14915.jpg",
        alt: "大英圖書館收藏的西元一世紀犍陀羅語佉盧文樺樹皮手稿六片殘卷",
        title: "大英圖書館一世紀樺樹皮古卷（約兩千歲真實寫本）",
        obs: "先自己看圖找線索：六條脆弱捲曲的淺褐色樹皮條上，一行一行用黑墨寫著由右往左唸的古文字。",
        cue: "放大提示：放大後可以看清樺樹皮天然的橫向纖維和兩千年黑墨水滲透進去的樣子！",
        trans: "這卷古書是什麼？目前人類真的拿得到手裡測年代、還找得出字的早期佛經實物（相關藏品經碳十四測年也落在西元前 1 世紀到西元 1、2 世紀左右）。",
        limit: "來源與限度：大英圖書館公版免授權影像；美國國會圖書館亦有類似藏品（該官網擋自動化抓取，已附網址供親自點開瀏覽）。這早於許多傳世紙本，但仍晚於佛陀好幾百年。"
      }
    };
    let curA = "lumbini", zoom = 1, px = 0, py = 0, showOverlay = true, showTrans = false;
    const img = $("#viewer-img"), fb = $("#viewer-fallback"), ov = $("#viewer-overlay");
    const infoObs = $("#viewer-obs"), infoCue = $("#viewer-cue"), infoTrans = $("#viewer-trans"), infoLim = $("#viewer-limit"), zStat = $("#viewer-zoom-status");
    const renderImg = () => {
      const a = artifacts[curA];
      if (!a || !img) return;
      img.style.transform = `translate(${px}px, ${py}px) scale(${zoom})`;
      if (ov) {
        ov.hidden = !showOverlay;
        ov.querySelector(".overlay-pill").textContent = a.title;
      }
      if (infoObs) infoObs.textContent = a.obs;
      if (infoCue) infoCue.textContent = a.cue;
      if (infoTrans) { infoTrans.textContent = a.trans; infoTrans.hidden = !showTrans; }
      if (infoLim) infoLim.textContent = a.limit;
      if (zStat) zStat.textContent = "目前大小：" + Math.round(zoom * 100) + "%";
      allNodes("[data-artifact]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.artifact === curA)));
      $("#viewer-toggle-overlay")?.setAttribute("aria-pressed", String(showOverlay));
      $("#viewer-toggle-trans")?.setAttribute("aria-pressed", String(showTrans));
      if (img.getAttribute("src") !== a.src) {
        img.decoding = "async";
        img.hidden = false;
        if (fb) fb.hidden = true;
        img.alt = a.alt;
        img.src = a.src;
      }
    };
    allNodes("[data-artifact]").forEach(b => b.addEventListener("click", () => { curA = b.dataset.artifact; zoom = 1; px = 0; py = 0; showTrans = false; renderImg(); }));
    $("#viewer-zoom-in")?.addEventListener("click", () => { zoom = Math.min(2.4, +(zoom + 0.4).toFixed(1)); renderImg(); });
    $("#viewer-zoom-out")?.addEventListener("click", () => { zoom = Math.max(1, +(zoom - 0.4).toFixed(1)); if (zoom === 1) { px = 0; py = 0; } renderImg(); });
    $("#viewer-pan-left")?.addEventListener("click", () => { px += 28; renderImg(); });
    $("#viewer-pan-right")?.addEventListener("click", () => { px -= 28; renderImg(); });
    $("#viewer-reset")?.addEventListener("click", () => { zoom = 1; px = 0; py = 0; showOverlay = true; showTrans = false; renderImg(); });
    $("#viewer-toggle-overlay")?.addEventListener("click", () => { showOverlay = !showOverlay; renderImg(); });
    $("#viewer-toggle-trans")?.addEventListener("click", () => { showTrans = !showTrans; renderImg(); });
    renderImg();
  })();

  // S09: Oral Transmission Circle
  (() => {
    const out = $("#s09-out"), pill = $("#s09-mode-pill"), n1 = $("#s09-n1-txt"), n2 = $("#s09-n2-txt"), n3 = $("#s09-n3-txt");
    const demos = {
      whisper: {
        pill: "測試一｜悄悄一個人傳給一個人",
        n1: "「不要看誰面子，要拿經典查」",
        n2: "靠單一個人記憶往下傳",
        n3: "「聽說大師講只要靠自己心裡感受」",
        txt: "【只有一個人悄悄往下傳】經過五六個人之後，本來最重要的幾句話常會漏字、甚至意思被改得面目全非！"
      },
      chorus: {
        pill: "測試二｜一大群人定期大聲一起對詞",
        n1: "「一切現象無常、苦、非我」",
        n2: "數十位僧團固定集體合誦檢查",
        n3: "重要大骨幹穩穩留了下來 ✓",
        txt: "【大家一起定期大聲對詞】研究口傳的學者發現，古代僧團像合唱團定期對唱互抓漏字一樣，確實把重要教義穩穩保住！但要小心：有時念起來非常整齊對稱，反而是後來的人整理編輯出來的喔。"
      },
      translate: {
        pill: "測試三｜換成不同國家的語言",
        n1: "古印度原語「Dhamma / Dharma」",
        n2: "翻成中文、藏文或英文",
        n3: "變成「法 / 真理 / Teaching」",
        txt: "【翻譯到外地語言】不同國家本來就用不同文化詞彙來思考，同一個詞翻過去，常會自然帶入新文化的理解角度。"
      },
      expand: {
        pill: "測試四｜遇到新疑問時補進說明",
        n1: "原本標準：對照經跟律兩件事",
        n2: "後來整理三藏分類的人加進新條目",
        n3: "多出了「阿毘曇跟戒」四項標準",
        txt: "【因應教學需要補進去新內容】譬如第 01 關提到同一標題的另一部漢譯經典《增壹阿含》，就在原本兩項後面加上了後來才整理完整的「阿毘曇」分類！"
      }
    };
    allNodes("[data-txmode]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-txmode]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const d = demos[b.dataset.txmode];
      if (!d) return;
      if (pill) pill.textContent = d.pill;
      if (n1) n1.textContent = d.n1;
      if (n2) n2.textContent = d.n2;
      if (n3) n3.textContent = d.n3;
      if (out) out.textContent = d.txt;
    }));
    $("#s09-reset")?.addEventListener("click", () => {
      allNodes("[data-txmode]").forEach(x => x.setAttribute("aria-pressed", "false"));
      if (pill) pill.textContent = "目前測試：還沒有開始傳話";
      if (n1) n1.textContent = "「這句教導很重要」";
      if (n2) n2.textContent = "點下方選傳遞方式";
      if (n3) n3.textContent = "結果會出現在這裡";
      if (out) out.textContent = "重設好了！再點點看不同傳法有什麼差別。";
    });
  })();

  // S10: TEMPLATE FLAGSHIP — Natural Earth Asia Interactive Explorer
  (() => {
    const pts = {
      lumbini: [198, 205.9], magadha: [215.3, 228.3], gandhara: [88.6, 133.2],
      anuradhapura: [171.2, 418.8], samye: [274.4, 185.2], dunhuang: [303.8, 65.1],
      mandalay: [317.1, 267.1], ayutthaya: [358.7, 351.6], changan: [436.7, 130.4],
      nanjing: [528.4, 154.9], taipei: [554, 232.9], kyoto: [686.2, 122.1]
    };
    const periods = [
      { time: "西元前 600–400 年", title: "北印恆河流域｜歷史上的佛陀誕生與教學", p1: pts.lumbini, p2: pts.magadha, note: "真的確定有個叫喬達摩的老師在北印度教導離苦的方法；但確切生日跟早年細節還沒辦法逐條證實。" },
      { time: "西元前 400–300 年", title: "摩揭陀一帶｜靠大家一起背誦跟早期分家", p1: pts.magadha, note: "僧侶開始把故事背下來互相對詞；這時還沒寫成一本書，也開始因日常規矩看法不同分成不同小組。" },
      { time: "西元前 268–232 年左右", title: "印度全境至海島｜阿育王在石柱刻字支持", p1: pts.lumbini, p2: pts.anuradhapura, route: "sea", note: "這是目前最早摸得到的實體大證據！阿育王把石柱立在藍毘尼等地，也派使者往西北與南方斯里蘭卡交流。" },
      { time: "西元前 300–100 年", title: "印度各地・大犍陀羅・斯里蘭卡｜各部派各自發展", p1: pts.gandhara, p2: pts.anuradhapura, route: "nw", note: "各地距離遠又靠口傳，慢慢分化出不同流派（傳說常講十八派，但各地列出的名單彼此還打架）。" },
      { time: "西元前 100–西元 200 年", title: "大犍陀羅・絲路起點｜最早寫在樹皮上的古經出現了！", p1: pts.gandhara, p2: pts.magadha, route: "nw", note: "目前挖出來最早的手稿（包括大英圖書館跟約西元 75 年的大乘樹皮殘卷）出現在這個時期的西北大犍陀羅地區！" },
      { time: "西元 100–500 年", title: "印度・斯里蘭卡・長安｜大哲學書和大量中文翻譯同時發生", p1: pts.magadha, p2: pts.changan, route: "nw", note: "印度出現重要哲學大師、中國長安如火如荼翻譯阿含與大乘經、同時斯里蘭卡也完成大部頭巴利語註釋書。" },
      { time: "西元 100–600 年", title: "經過中亞絲路與海路｜走進長安、建康(南京)、韓國日本", p1: pts.dunhuang, p2: pts.nanjing, route: "nw", note: "西元 429 與 433 年斯里蘭卡女出家人還坐船來南京幫忙傳戒！海路跟絲路一起把文化帶進東亞。" },
      { time: "西元 500–1000 年", title: "西藏高原與唐宋中國｜桑耶寺、敦煌藏書、宋朝印《開寶藏》", p1: pts.samye, p2: pts.changan, route: "him", note: "約 779 年西藏建立桑耶寺；中國經歷唐武宗拆廟後，北宋花了十幾年雕刻第一套木板大藏經《開寶藏》。" },
      { time: "西元 1000–1300 年", title: "斯里蘭卡重整與北印大寺院衰退｜一邊消失一邊整合", p1: pts.anuradhapura, p2: pts.magadha, route: "sea", note: "北印那爛陀等大寺院因為戰火、王權贊助轉移和民間疏離而漸漸沒落；斯里蘭卡則由國王統合出大寺派主導。" },
      { time: "西元 1200–1600 年", title: "東南亞跟日本｜南傳主流定型・日本親鸞開創成家先例", p1: pts.ayutthaya, p2: pts.kyoto, route: "sea", note: "緬甸、泰國、柬埔寨等國陸續確立巴利語傳統；同時期的日本也長出淨土真宗和各種地方宗派。" },
      { time: "西元 1600–1900 年", title: "斯里蘭卡・緬甸・日本・清代臺灣｜求戒・刻碑・解禁", p1: pts.mandalay, p2: pts.taipei, route: "sea", note: "1753 年從泰國搭船幫斯里蘭卡恢復僧團；1868 年緬甸刻完 729 塊大石碑；1872 年日本撤銷和尚結婚罰則。" },
      { time: "西元 1900 年至今", title: "臺灣・亞洲・全世界｜百年大變身、人間佛教與現代正念", p1: pts.taipei, p2: pts.samye, route: "him", note: "這百年亞洲佛教開始跟現代教育、心理學與公共醫療慈善結合，同時 2022／2025 年不丹也完成大型女性受戒！" }
    ];
    const slider = $("#s10-slider"), prev = $("#s10-prev"), next = $("#s10-next"), playBtn = $("#s10-autoplay");
    const outTime = $("#s10-time"), outTitle = $("#s10-title"), outInfo = $("#s10-info");
    const dot = $("#s10-map-dot"), dot2 = $("#s10-map-dot2"), ring = $("#s10-map-ring"), noteSvg = $("#s10-era-note-svg");
    const rNw = $("#s10-route-nw"), rSea = $("#s10-route-sea"), rHim = $("#s10-route-him");
    let idx = 0, timer = null;
    const stopAuto = () => {
      if (timer) { clearInterval(timer); timer = null; }
      if (playBtn) { playBtn.setAttribute("aria-pressed", "false"); playBtn.textContent = "▶ 沿時間軸播放"; }
    };
    const render = () => {
      const e = periods[idx];
      if (!e) return;
      if (slider) slider.value = String(idx);
      if (outTime) outTime.textContent = e.time + "（第 " + (idx + 1) + "／12 站）";
      if (outTitle) outTitle.textContent = e.title;
      if (outInfo) outInfo.textContent = e.note;
      if (dot) { dot.setAttribute("cx", String(e.p1[0])); dot.setAttribute("cy", String(e.p1[1])); }
      if (ring) { ring.setAttribute("cx", String(e.p1[0])); ring.setAttribute("cy", String(e.p1[1])); }
      if (dot2) {
        if (e.p2) { dot2.setAttribute("cx", String(e.p2[0])); dot2.setAttribute("cy", String(e.p2[1])); dot2.setAttribute("opacity", "1"); }
        else dot2.setAttribute("opacity", "0");
      }
      if (rNw) rNw.setAttribute("stroke-opacity", e.route === "nw" ? "0.95" : "0.22");
      if (rSea) rSea.setAttribute("stroke-opacity", e.route === "sea" ? "0.95" : "0.22");
      if (rHim) rHim.setAttribute("stroke-opacity", e.route === "him" ? "0.95" : "0.22");
      if (noteSvg) noteSvg.textContent = e.time + "（橘點與綠點代表同一時代多地一起發生，非單一直線）";
      if (prev) prev.disabled = idx <= 0;
      if (next) next.disabled = idx >= periods.length - 1;
      allNodes("[data-era]").forEach(b => b.setAttribute("aria-pressed", String(Number(b.dataset.era) === idx)));
    };
    slider?.addEventListener("input", () => { stopAuto(); idx = Number(slider.value); render(); });
    prev?.addEventListener("click", () => { stopAuto(); if (idx > 0) { idx--; render(); } });
    next?.addEventListener("click", () => { stopAuto(); if (idx < periods.length - 1) { idx++; render(); } });
    allNodes("[data-era]").forEach(b => b.addEventListener("click", () => { stopAuto(); idx = Number(b.dataset.era); render(); }));
    playBtn?.addEventListener("click", () => {
      if (timer) { stopAuto(); return; }
      if (reducedMotion()) { idx = (idx + 1) % periods.length; render(); return; }
      playBtn.setAttribute("aria-pressed", "true");
      playBtn.textContent = "⏸ 暫停播放";
      timer = setInterval(() => {
        idx = (idx + 1) % periods.length;
        render();
        if (idx === periods.length - 1) stopAuto();
      }, 2400);
    });
    render();
  })();

  // S11: Shared Puzzle & 5-Language
  (() => {
    const vTxt = $("#s11-pz-vinaya-txt"), dTxt = $("#s11-pz-dev-txt"), vBox = $("#s11-pz-vinaya"), dBox = $("#s11-pz-dev"), out = $("#s11-trad-out");
    const info = {
      south: {
        v: "帶走「上座部」生活戒本跟整套巴利語經藏。",
        d: "加上十二世紀斯里蘭卡整合、十八世紀泰國幫接棒，以及東南亞王室傳統。",
        txt: "南傳保存了一整套完整的巴利語早期經律，但中間也經歷過十二世紀國王整理、十八世紀從外國請僧人重新傳戒，並不是兩千多年一動也不動。"
      },
      east: {
        v: "帶走古代「法藏部」的四分律生活戒規，以及大量的阿含早期經典。",
        d: "加上印度傳來的大乘經典，並在中國長出禪宗、淨土、天台、華嚴、全面吃素。",
        txt: "漢傳跟東亞佛教保存了很多早期阿含翻譯（跟南傳巴利語很像但有不同細節），同時又融合中華文化與後代哲學，成為非常豐富的多層傳統。"
      },
      tibet: {
        v: "帶走「根本說一切有部」戒規跟大量印度晚期大學院的論典。",
        d: "保存了很多印度本國燒光的梵文經典翻本，並融入雪域苯教互動與密續傳統。",
        txt: "藏傳佛教是把八世紀以後印度大寺院與密續整個保存下來的寶庫，同時也保有轉世制度與雪山文化自己的歷史演變。"
      },
      lost: {
        v: "古代還有十幾個重要流派（像說一切有部、大眾部等）後來消失了。",
        d: "今天只能從別人書本或沙漠挖出來的樹皮碎片拼出他們原本的樣子。",
        txt: "只看到今天還活著的三大傳承，不代表當年原本就只有這三種講法！很多早期派別是在戰火和改朝換代中消失不見的。"
      }
    };
    allNodes("[data-trad]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-trad]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const d = info[b.dataset.trad] || info.south;
      if (vTxt) vTxt.textContent = d.v;
      if (dTxt) dTxt.textContent = d.d;
      vBox?.classList.add("snapped");
      dBox?.classList.add("snapped");
      if (out) out.textContent = d.txt;
    }));
    const l5Out = $("#s11-lang5-out");
    const langs = {
      pli: "【巴利語本（完整對讀）】講身體不是永遠不變的我：「這不是我的，這不是我，這不是我的真我。」",
      lzh: "【古代漢語《雜阿含》譯本（對讀完成）】同樣反覆分析身體與心裡五樣感受都在變，不能抓著當成永恆的我——用詞順序和巴利本略有差異。",
      pgd: "【兩千歲大犍陀羅樹皮殘卷（部分殘缺）】已經看得到這篇早年核心經文的片段，證明西北印度古代也背過同一套教法。",
      san: "【古印度梵語線索】在其他印度古律典跟論書裡常被引到類似句子，可見各派早期都很重視。",
      xct: "【古藏語翻譯狀況】《無我相經》等後來也有譯進藏文系統（因多處對讀目錄與版本散見甘珠爾不同部冊，保留版本對照邊界）。"
    };
    allNodes("[data-lang5]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-lang5]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (l5Out) l5Out.textContent = langs[b.dataset.lang5] || "";
    }));
  })();

  // S12: South Theravada
  (() => {
    const sOut = $("#s12-out"), arc = $("#s12-sea-arc"), sl = $("#s12-pin-sl"), mm = $("#s12-pin-mm"), th = $("#s12-pin-th");
    const items = {
      maha: { p: "sl", arcOp: "0.3", txt: "【大寺派】五世紀時在這裡把古老巴利三藏跟詳細註解整理下來；十二世紀國王下令把三座大寺院統一起來，才定出今天南傳的主要系統。" },
      abhaya: { p: "sl", arcOp: "0.3", txt: "【無畏山寺】規模曾經超級龐大，而且比大寺派更願意接納大乘和各地新想法；後來十二世紀統合時被收併，歷史常常只剩贏的一方來寫。" },
      jeta: { p: "sl", arcOp: "0.3", txt: "【祇陀林寺】在古代斯里蘭卡也是重要大中心，有自己的規矩和傳承；十二世紀王權統合之後便沒有再獨立下去。" },
      relay1753: { p: "th", arcOp: "0.95", txt: "【1753 跨海接力救命】當時斯里蘭卡戰亂連連，島上居然湊不齊規定人數的正式比丘來幫新手受戒！國王派人坐船去泰國阿瑜陀耶請來二十位高僧接續傳承；另外注意這批新建立的宗派後來在斯里蘭卡還受到種姓制度限制影響。" },
      kuthodaw: { p: "mm", arcOp: "0.3", txt: "【緬甸 729 塊大石碑】1860–1868 年敏東王為了怕英國殖民戰亂讓經書遺失，把整部巴利三藏刻在整整 729 塊白色大理石經碑上（另加上 1 塊記錄建碑過程的紀念碑，總計常見報導 730 塊，實為 729 經碑＋1 記碑）。" }
    };
    allNodes("[data-south]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-south]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const d = items[b.dataset.south] || items.maha;
      if (arc) arc.setAttribute("stroke-opacity", d.arcOp);
      if (sl) sl.setAttribute("fill", d.p === "sl" ? "#d97706" : "#fffdf7");
      if (mm) mm.setAttribute("fill", d.p === "mm" ? "#d97706" : "#fffdf7");
      if (th) th.setAttribute("fill", d.p === "th" ? "#d97706" : "#fffdf7");
      if (sOut) sOut.textContent = d.txt;
    }));
  })();

  // S13: Mahayana Idea Tree
  (() => {
    const cOut = $("#s13-concept-out"), sTxt = $("#s13-seed-txt"), bTxt = $("#s13-bloom-txt");
    const concepts = {
      compassion: { s: "最早的經典本來就一再教大家對所有生命友善不害人（四無量心）。", b: "大乘把它拉成整條修行大道最核心的出發點。", t: "「對大家友善不害人（慈悲）」：這顆種子最早在跨傳承古書裡就已經有了！" },
      bodhisattva: { s: "早年古書通常用這個詞稱呼「還沒覺悟前的釋迦牟尼過去世故事」。", b: "大乘鼓勵每個人都可以自己發願走這條幫別人的成佛之路。", t: "「想成佛幫大家（菩薩）」：名稱早就有了，但把這變成大家共同目標是後來的展開。" },
      sunyata: { s: "早年就很重視「東西沒有永遠不變的靈魂或本體（無我・緣起）」。", b: "龍樹等大乘哲學家把這套道理分析得像大學哲學課一樣嚴謹。", t: "「一切都在變、沒有固定本體（空性）」：跟早期想法相通，後來哲學化非常精細。" },
      paramita: { s: "布施、守規矩、忍耐、打坐和智慧，在早年全部都分開講過。", b: "把它們整齊排成一組「六種修練清單」，是後來整理出的好記套餐。", t: "「六項日常修練」：零件都很早就有，組成六項套餐是後來整理。" },
      fields: { s: "早期已經相信過去有過好幾位佛，未來還會有別的佛出現。", b: "大乘把它想像擴展成宇宙十個方向同時有無數佛的世界。", t: "「其他世界也有佛」：從「過去未來有別的佛」延伸成了浩瀚宇宙圖景。" },
      amitabha: { s: "早年印度阿含與尼柯耶經典裡找不到阿彌陀佛西方極樂世界。", b: "這是西元前後逐步在印度與中亞興起的淨土信仰，在東亞影響極大。", t: "「阿彌陀佛淨土世界」：屬於後來慢慢成熟長出來的重要信仰分支。" },
      tathagata: { s: "早年重點在人人有機會靠練習止息煩惱，很少講每個人本來內藏「佛性」。", b: "較後期印度與東亞大乘強調每個人本來都有成佛的潛能。", t: "「人人都有成佛潛力」：是比較後期才完整發展出來的鼓勵與理論。" },
      yogacara: { s: "早年已經分析「六根接觸外境會產生心念感受」。", b: "大約西元四、五世紀左右才寫成細膩完整的唯識心理學系統。", t: "「心如何認識世界」：到了四、五世紀才變成一套高度系統的哲學。" },
      trikaya: { s: "早年經典就把佛看成「人身的老師」與「教導本身的化身」。", b: "後世哲學才完整整理成「法身、報身、應化身」三種身分的理論。", t: "「佛的三種呈現方式」：是後世學者思考佛陀究竟是什麼的哲學總結。" }
    };
    allNodes("[data-mahac]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-mahac]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const c = concepts[b.dataset.mahac];
      if (!c) return;
      if (sTxt) sTxt.textContent = c.s;
      if (bTxt) bTxt.textContent = c.b;
      if (cOut) cOut.textContent = c.t;
    }));
    const vOut = $("#s13-bvacana-out");
    allNodes("[data-bvacana]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-bvacana]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (vOut) vOut.textContent = b.dataset.bvacana === "hist"
        ? "【歷史學問法】問的是公元前五世紀喬達摩有沒有親口說過這些成套理論。照歷史手邊看得到的證據，成熟的系統大多是數百年後才慢慢形成的。"
        : "【信徒傳統裡的感受】許多大乘傳統認為：只要教導真的讓人減少自私痛苦、合於佛法智慧精神，就能尊稱為廣義的佛說——兩種問法定義不同，不該互相拿來罵人。";
    }));
  })();

  // S14: Ancient Scripture ID Desk & Heart Sutra Side-by-Side
  (() => {
    const texts = {
      nikaya: { title: "巴利文四部早期大經集", clues: ["線索 1：以南亞古巴利語保存下來，是南傳佛教最核心的經藏。", "線索 2：裡面有很多地方跟中國翻譯的《阿含經》對得上，很可能是佛滅後早期口傳留下來的主要骨幹。", "線索 3：但現存抄寫在貝葉上的古本也是後代整理，並不是公元前五世紀的錄音帶。"] },
      agama: { title: "中國保存的四阿含經", clues: ["線索 1：四、五世紀時從印度和西域多種語言陸續翻成中文，保存了原本已經失傳的幾個古印度派別版本。", "線索 2：跟巴利本互相對照時，看得到相同的核心架構，也常發現不同的細節與排比。"] },
      dhp: { title: "法句經", clues: ["線索 1：一首首好背的四句話人生短詩，巴利文、中文、大犍陀羅樹皮跟梵文都有不同編排本。", "線索 2：短詩本身非常古老，但旁邊寫的故事背景解釋多是幾百年後補進來的。"] },
      snp: { title: "經集", clues: ["線索 1：裡面〈犀牛角經〉〈義品〉〈彼岸道品〉的古語言非常古老。", "線索 2：研究顯示同一本書裡仍然混了早一點和晚一點編入的篇章。"] },
      diamond: { title: "金剛經", clues: ["線索 1：屬於印度早期大乘智慧系統的代表經典，在東亞影響超級大。", "線索 2：歷史上目前找不到直接出自公元前五世紀佛陀親口的實物證據。"] },
      lotus: { title: "法華經", clues: ["線索 1：印度早期大乘經典，有幾品看得出是不同階段接續寫上去的。", "線索 2：像「觀世音菩薩普門品」就是很多中國信徒最熟悉也單獨流通的段落。"] },
      avatamsaka: { title: "華嚴經", clues: ["線索 1：原本在印度是好幾部各自獨立的小經（例如〈十地經〉〈入法界品〉），後來才漸漸合編成大部頭。", "線索 2：裡面描寫了非常壯闊重重無盡的宇宙觀念。"] },
      amitabha: { title: "阿彌陀經", clues: ["線索 1：出身印度西北部與中亞淨土思想傳統，講求念阿彌陀佛名號往生西方淨土。", "線索 2：找不到早年阿含經或公元前五世紀史料的直接記載。"] },
      sukh: { title: "無量壽經", clues: ["線索 1：中文就有好幾種差很大的不同年代譯本（24願到48願數量都有變化！），還保存有梵文本。", "線索 2：這正好顯示古經在流傳跟翻譯途中是可以慢慢加長改寫的。"] },
      heart: { title: "心經", clues: ["線索 1：這本才兩百六十個字的短經，爭議卻是整個佛學史數一數二大的！", "線索 2：下面「特別對比桌」幫你把幾個關鍵證據直接攤開看個仔細！"] },
      surangama: { title: "楞嚴經（注意：編號 T945，千萬別跟羅什譯的另一部同名經 T642 搞混！）", clues: ["線索 1：八世紀初唐代才出現的十卷大經《大佛頂首楞嚴經》（T945），內容提到很多中國本土陰陽五行跟神仙概念，歷史爭議很大。", "線索 2：早三百年鳩摩羅什確實從印度翻譯過一部叫《首楞嚴三昧經》（T642）的經——那是完全不同內容的兩本書，只是名字裡都有「楞嚴」兩個字！", "線索 3：2022 年研究也提醒要留意當年宰相房融在廣州參與文字潤色的跨文化故事，不能單靠罵「一定是偽經」一句帶過。"] },
      qixin: { title: "大乘起信論", clues: ["線索 1：這本來就自稱是「論書」（後人寫的哲學研究心得），從來沒說是佛陀親自講的經。", "線索 2：唐代早年的疑經錄就懷疑它的印度作者真假，近代很多學者認為更像六世紀中國出家哲學家寫出的精彩思想傑作（目前仍在學術討論，沒有把所有書都看過一次定案）。"] },
      yulanpen: { title: "盂蘭盆經", clues: ["線索 1：故事講目連救母親跟七月十五供僧，跟中國人重視祭祖孝道非常合拍。", "線索 2：印度找不回對應古本，加上行文習慣帶有濃厚中文與西域改編色彩，學者高度懷疑是在中國整理成書。"] },
      fumu: { title: "父母恩重難報經", clues: ["線索 1：整篇用傳統中式孝順故事書寫懷胎十月之苦，文字風格非常在地化。", "線索 2：連古代中國僧人自己編的《出三藏記集》《開元釋教錄》早期錄本裡，很多學者早就把它歸類成疑偽或本土作品了。"] },
      platform: { title: "六祖壇經", clues: ["線索 1：這是中國唯一一部非由印度人講、卻被後世尊稱為「經」的中國祖師著作！主角是唐代六祖慧能。", "線索 2：看第 16 關你就知道：八、九世紀的敦煌手寫本，跟 1310 年木刻板內容增加了將近一倍多！"] },
      tantras: { title: "佛教密續", clues: ["線索 1：早年確實有一點點護身短咒，但有本尊觀想、曼荼羅壇城和灌頂儀式的成熟密教經典，大約在西元七世紀以後才在印度成熟發展。", "線索 2：用歷史眼光看，這屬於較後期的印度文化產物，不是公元前五世紀佛陀親口當面傳授的錄音。"] }
    };
    const sel = $("#s14-text-select"), out = $("#s14-desk-out");
    let curT = texts.nikaya, clueIdx = 1;
    const renderDesk = () => {
      if (!out || !curT) return;
      out.innerHTML = `<strong>${curT.title}</strong><ul style="margin:6px 0 0;padding-left:1.3em">${curT.clues.slice(0, clueIdx).map(c => `<li>${c}</li>`).join("")}</ul>`;
    };
    sel?.addEventListener("change", () => { curT = texts[sel.value] || texts.nikaya; clueIdx = 1; renderDesk(); });
    $("#s14-next-clue")?.addEventListener("click", () => { clueIdx = Math.min(curT.clues.length, clueIdx + 1); renderDesk(); });
    $("#s14-all-clues")?.addEventListener("click", () => { clueIdx = curT.clues.length; renderDesk(); });
    $("#s14-reset-desk")?.addEventListener("click", () => { clueIdx = 1; renderDesk(); });
    renderDesk();

    const p223 = $("#s14-p-t223"), p250 = $("#s14-p-t250"), p251 = $("#s14-p-t251"), pSkt = $("#s14-p-skt");
    const segData = {
      seg1: {
        t223: "這一大段裡面找不到「觀自在菩薩行深…度一切苦厄」這幾句開頭。",
        t250: "寫作「觀世音菩薩…照見五陰空，度一切苦厄」（有學者懷疑這版其實較晚才寫上舊翻譯家的名字）。",
        t251: "寫作「觀自在菩薩…照見五蘊皆空，度一切苦厄」。",
        skt: "通行梵文原本沒有「度一切苦厄」這一句！目前只有在另一部漢譯經典裡看得到類似話，表示《心經》開頭不像整段直接照現存梵文翻譯。"
      },
      seg2: {
        t223: "早兩百多年翻譯的這段就已經寫著：「色不異空，空不異色；色即是空，空即是色；受想行識亦復如是…無苦集滅道，亦無智亦無得」——用字幾乎和後來玄奘《心經》一樣！",
        t250: "用字同樣緊緊貼著這套羅什 404 年翻譯的老句型。",
        t251: "照理玄奘法師習慣把羅什舊詞都改成新譯法（比如「蘊」換「陰」），但最核心這一大段卻只微調虛字、幾乎照搬羅什舊文！",
        skt: "關鍵疑點（Attwood 2020）：原本梵文說「用無執著的方式修行」，羅什很自然翻出「無智亦無得」；結果後來的《心經》梵文本卻被寫成像是從中文句子再反推回去的意思。"
      },
      seg3: {
        t223: "接續前面脈絡講「以無所執著（anupalambhayogena）的方式」修行而不害怕。",
        t250: "寫成「以無所得故，依般若波羅蜜，心無罣礙」。",
        t251: "同樣是把「以無所得故」接在前面當「因為沒有得到…」的原因。",
        skt: "顯著異常處：通行《心經》梵文本在這裡寫了「aprāptitvāt（因為沒有得到東西）」，跟它原本母經《大品》用字大不相同，反而很像看中文「以無所得故」翻回去的！"
      },
      seg4: {
        t223: "大部長篇經文這裡講完智慧道理後，完全沒有後面的「大神咒、大明咒」與「揭諦揭諦…」短咒。",
        t250: "書名本身就叫《摩訶般若波羅蜜大明咒經》，直接收束在神咒讚嘆上。",
        t251: "把整段核心跟「是大神咒…即說咒曰」合在一起唸完。",
        skt: "日本學者福井文雅等則提醒：在印度跟東亞宗教現場，「心（hṛdaya）」字本來常被當成整部大經的本質或保護短咒使用，這也跟古代修持課誦習慣有關。"
      }
    };
    allNodes("[data-heartseg]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-heartseg]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const s = segData[b.dataset.heartseg];
      if (!s) return;
      if (p223) p223.textContent = s.t223;
      if (p250) p250.textContent = s.t250;
      if (p251) p251.textContent = s.t251;
      if (pSkt) pSkt.textContent = s.skt;
    }));

    const hOut = $("#s14-heart-out");
    const hTexts = {
      trad: "【傳統一直認為的說法：印度原本寫好 → 玄奘翻成中文】困難點是：這樣很難解釋為什麼《心經》最有名那段跟早兩百多年羅什翻的大經字句幾乎一樣，也解釋不了為什麼現在看到的梵文原本缺了開頭的「度一切苦厄」。",
      nattier: "【先在中國整理再回譯的看法】有研究者對字句發現《心經》中段跟早兩百多年翻譯的《大品般若經》幾乎一樣，連古文裡一處特別的詞「以無所得故」轉成梵文時也留下一樣的小疙瘩（Attwood 2020 完整論文看得出這些文字證據；另兩篇 1992 與 2021 詳細論文因網站防抓取或付費牆還沒拿到全本核對）。另外要分開：有些學者覺得這只是當時常見的重點摘錄，另一位學者個人則推論部分舊本可能屬故意托名——這點學者間還在吵，沒有定論！",
      alt: "【日本學者的不同反對意見】福井文雅早在 1987 年（比 Nattier 1992 還早五年！）就出版專書考察印度與漢地般若神咒傳統；1994 年也曾針對回譯說提出反對論文；2000 年把 1987 年那本書修訂擴編再版（所以 2000 年不是第三個全新證據）。因這批日文專書我們目前只查到圖書館書目、還沒讀過全書，這場學術辯論目前完全沒有誰一家獨勝的最後結論。"
    };
    allNodes("[data-heart]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-heart]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (hOut) hOut.textContent = hTexts[b.dataset.heart] || "";
    }));
  })();

  // S15: China Arrival
  (() => {
    const out = $("#s15-out"), badge = $("#s15-scene-badge");
    const scenes = {
      filial: { b: "目前生活話題：1. 父母與家族怎麼辦？", t: "【孝親與家族】其實最早的印度古經早就非常看重照顧爸爸媽媽；但面對中國「無後為大」的壓力，後來發展出了「出家修好幫助全家人」「盂蘭盆追思祖先」這些接地氣的說法與法會。" },
      work: { b: "目前生活話題：2. 吃飯和種田怎麼辦？", t: "【托缽 vs 寺院莊園】早期印度出家人禁止自己種田、完全靠每天早上沿門乞討食物；到了中國被士大夫批評「不種田吃白飯」，才漸漸發展出寺院自己開墾種菜、「一日不作，一日不食」的農禪生活。" },
      food: { b: "目前生活話題：3. 為什麼漢傳佛教吃全素？", t: "【三淨肉到十世紀全面素食】早年印度律藏禁止大象等十種肉但允許「沒見、沒聞、沒懷疑為自己而殺」的三淨肉；到中國後加上大乘不殺生經典跟六世紀梁武帝帶頭戒酒肉，一路演變到約十世紀才變成漢地出家人全面吃素的規矩。" }
    };
    allNodes("[data-cscene]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-cscene]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const s = scenes[b.dataset.cscene] || scenes.filial;
      if (badge) badge.textContent = s.b;
      if (out) out.textContent = s.t;
    }));
  })();

  // S16: Chan Bookshelf
  (() => {
    const out = $("#s16-out");
    const books = {
      early: "【早年大藏經與唐代敦煌手抄本】沒有記「佛陀拿一朵花、迦葉微笑」的故事；這時期的寫本看得出文字比較單純，跟後來印刷的厚版書差很多。",
      baolin: "【西元 801 年《寶林傳》（現在只剩下殘缺部分）】書裡已經講到佛陀把「微妙法門」交給大迦葉，但現存看得見的殘片裡還沒寫出舉起一朵花的畫面（不過沒看到的那幾卷不敢百分百亂猜）。",
      jingde: "【西元 1004 年《景德傳燈錄》】這本超有名的禪宗大家譜把各位祖師名單全排出來了，不過裡面依然沒把「拈花微笑」這段故事完整寫上去。",
      tiansheng: "【西元 1029 年編好／約 1036 年印行的《天聖廣燈錄》】在北宋禪宗興盛的環境下，我們第一次在正經出版的大部頭書裡，清清楚楚看見完整的「佛陀拈花、迦葉微笑」登場了！",
      dafan: "【宋代才流傳的《大梵天王問佛決疑經》】後來還多出了一整部據說記載這段問答的經典，但近代許多禪史研究者檢查發現，它更像是宋代中國本地寫成的作品。故事晚出不代表沒意義，哲學上「有些體會光靠嘴講不出來」的比喻依然很有韻味。"
    };
    allNodes("[data-chan]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-chan]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (out) out.textContent = books[b.dataset.chan] || "";
    }));
  })();

  // S17: Tibet Three Boxes
  (() => {
    const items = {
      tb1: { label: "「西元八世紀後期赤松德贊國王支持建立了桑耶寺，石碑也還留在現場。」", rec: "archive", why: "實地留有那個時代刻好的石碑和官方建築檔案，放進「歷史檔案箱」完全成立！" },
      tb2: { label: "「西藏用藏文保存了好大批印度本土已經燒毀找不到的古老佛學大書。」", rec: "archive", why: "現存藏文《大藏經》裡面找得到原本、還可以跟零碎梵文殘片逐句對照，這是貨真價實的歷史寶庫！" },
      tb3: { label: "「十一世紀起有些藏傳宗派說，祖師早就預先將經典埋在土地或心中等待幾百年後出土。」", rec: "lineage", why: "這種發現最早被記錄出來的時代往往比傳說晚很多百年，而且連古代藏傳大學者（薩迦班智達）自己也曾提出質疑——這是宗派內的傳統講法，無法由歷史考古證明！" },
      tb4: { label: "「活佛轉世出來的那位小朋友，真的就是上一輩子同一個心識人物再生嗎？」", rec: "belief", why: "十三世紀出現轉世傳承、1792 年清廷金瓶掣籤這些是寫進歷史檔案的制度；但「前世再生」本身屬於宗教信仰，用歷史或科學儀器是查不出來也推翻不了的。" }
    };
    let cur = "tb1";
    const tText = $("#s17-item-text"), tOut = $("#s17-result");
    const boxes = { archive: $("#s17-box-archive"), lineage: $("#s17-box-lineage"), belief: $("#s17-box-belief") };
    const activateBox = k => Object.entries(boxes).forEach(([id, el]) => el?.classList.toggle("is-active", id === k));
    allNodes("[data-tibet-item]").forEach(b => b.addEventListener("click", () => {
      cur = b.dataset.tibetItem;
      allNodes("[data-tibet-item]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      allNodes("[data-tbox]").forEach(x => x.setAttribute("aria-pressed", "false"));
      if (tText) tText.textContent = items[cur].label;
      if (tOut) tOut.textContent = "這件事比較適合收進哪一個木箱？點下面箱子試試看。";
    }));
    allNodes("[data-tbox]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-tbox]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const k = b.dataset.tbox;
      activateBox(k);
      if (tOut) tOut.textContent = (k === items[cur].rec ? "✓ 分得很對！" : "換個箱子想想看：") + items[cur].why;
    }));
  })();

  // S18: Vanishing Libraries
  (() => {
    const out = $("#s18-out"), stIn = $("#s18-st-india"), stSl = $("#s18-st-sl"), stCn = $("#s18-st-china"), stDh = $("#s18-st-dunhuang");
    const setSt = (el, cls, txt) => { if (el) { el.className = "badge " + cls; el.textContent = txt; } };
    function calc() {
      const checks = allNodes("[data-pol]:checked").map(c => c.dataset.pol);
      const war = checks.includes("war"), elite = checks.includes("elite"), canon = checks.includes("canon"), copy = checks.includes("copy");
      const msg = [];
      if (war) msg.push("戰火或皇帝拆廟，讓好幾座古代木造圖書館一把火燒個精光");
      if (elite) msg.push("大寺太靠國王供養土地卻疏遠了老百姓，贊助一換人很快便垮了");
      if (canon) msg.push("朝廷印《大藏經》只挑特定書目去刻板（被挑上的留下，沒挑進去的就失傳了）");
      if (copy) msg.push("多抄幾本、刻在石頭上或跨國翻譯，大大救回了原本可能會消失的古籍");

      if (war && elite) setSt(stIn, "warn", "戰亂＋斷援重創");
      else if (war) setSt(stIn, "warn", "戰火摧毀風險");
      else if (elite) setSt(stIn, "", "少掉民間支持");
      else setSt(stIn, "ok", "局部暫時保存");

      if (copy) setSt(stSl, "ok", "抄傳與跨區救回");
      else if (war) setSt(stSl, "warn", "海島單點也脆危");
      else setSt(stSl, "", "看條件變化");

      if (canon && copy) setSt(stCn, "ok", "刻藏＋石經雙重護身");
      else if (canon) setSt(stCn, "ok", "進了正典書單得救");
      else if (war) setSt(stCn, "warn", "沒進官方書單恐失傳");
      else setSt(stCn, "", "零散抄本流傳");

      if (copy) setSt(stDh, "ok", "沙漠封洞＋外地留存");
      else setSt(stDh, "", "無複本一燒全無");

      if (out) out.textContent = msg.length
        ? "目前看到：" + msg.join("；") + "。所以後人找得到的古書，永遠只是當年存在過的一部分！"
        : "勾選上面的選項看看，古時候的書有多不容易才活到今天。";
    }
    allNodes("[data-pol]").forEach(c => c.addEventListener("change", calc));
    $("#s18-reset")?.addEventListener("click", () => { allNodes("[data-pol]").forEach(c => { c.checked = false; }); calc(); });
    calc();
  })();

  // S19: Japan Time Machine
  (() => {
    const out = $("#s19-out"), eb = $("#s19-era-badge"), et = $("#s19-era-title");
    const eras = {
      india: { b: "⏳ 時代一｜兩千多年前古印度", ti: "離開家庭生活、靠大家一起守規矩", t: "古印度出家人的理想是離開自己原本的家、不結婚、不靠血緣把廟傳給親生兒子，跟國王保持一點獨立距離。" },
      medieval: { b: "⏳ 時代二｜13世紀與江戶幕府", ti: "淨土真宗親鸞開先例＋政府規定的寺院戶口制度", t: "早在明治時代好幾百年前，淨土真宗祖師親鸞就採取「非僧非俗」公開成家；到了江戶時期，政府規定百姓都在特定寺院登記戶口辦喪事，家業制逐漸常見。" },
      meiji: { b: "⏳ 時代三｜1872年明治政府取消禁止罰則", ti: "不是強迫每個和尚都得結婚，而是撤銷國家懲罰！", t: "1872 年日本政府撤除「和尚吃肉結婚要被官方治罪」的規定，並沒有強迫全部僧人都要結婚；今天日本各宗派、各個出家人之間做法依然很不同，不能一句話蓋過全部。" }
    };
    allNodes("[data-jpera]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-jpera]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const e = eras[b.dataset.jpera] || eras.india;
      if (eb) eb.textContent = e.b;
      if (et) et.textContent = e.ti;
      if (out) out.textContent = e.t;
    }));
  })();

  // S20: Women Ordination Relay Map
  (() => {
    const rOut = $("#s20-relay-out"), baton = $("#s20-baton");
    const pts = { early: [198, 140.9], nanjing: [528.4, 89.9], revival96: [215.3, 163.3], bhutan: [259.3, 139.6] };
    const relays = {
      early: "【早年記載與各派規矩】最早的經典記載女性出家一樣能修成大成就；至於要求尼眾從屬男眾的「八條特別規定」，研究各派古律的學者發現不同派別寫得不太一樣，可能有後來慢慢加進來的歷史痕跡。",
      nanjing: "【西元 429 與 433 年｜從斯里蘭卡坐船來到南京！】古代史書記載 429 年第一批斯里蘭卡尼眾來華人數不足十人，433 年又來第二批補足法定人數在建康(南京)南林寺行大戒，一直延續成為今天漢傳尼眾傳承！",
      revival96: "【1996 鹿野苑／1998 菩提伽耶｜跨國合作復戒】當代南傳佛教透過跨國請師幫忙（1998 年有臺灣佛光山等法師參與協助）舉辦復戒大典，但東南亞各國承認程度至今仍有差別。",
      bhutan: "【2022 與 2025 不丹大型比丘尼授戒】2022 年不丹首度替 144 位女眾授具足戒；2025 年 11 月舉辦第二屆，主辦單位公布有來自 14 國的 265 位女眾受戒（部分新聞寫近 270 位）。"
    };
    allNodes("[data-wrelay]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-wrelay]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const k = b.dataset.wrelay, pt = pts[k] || pts.early;
      if (baton) { baton.setAttribute("cx", String(pt[0])); baton.setAttribute("cy", String(pt[1])); }
      if (rOut) rOut.textContent = relays[k] || "";
    }));
    const vOut = $("#s20-view-out");
    allNodes("[data-wview]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-wview]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (vOut) vOut.textContent = b.dataset.wview === "open"
        ? "支持跨派別協力恢復的一方指出：古戒本裡也曾記錄過特殊情況的變通做法，而且現存東亞法脈當年正是靠斯里蘭卡幫忙跨海接起來的！"
        : "照本派舊律條嚴守的一方認為：既然本派原本的尼眾傳承在該地已經中斷，就不能隨便拿別派戒規來算數——兩派立場各有所本，本館不代為裁判誰對誰錯。";
    }));
  })();

  // S21: Taiwan Eras & Modern Myths
  (() => {
    const tOut = $("#s21-tw-out"), mOut = $("#s21-mod-out");
    const eras = {
      qing: "【清代到近代早期】觀音菩薩、祖先祭祀跟地方神明常常同在一座廟裡（看下面約百年前的艋舺龍山寺老照片！）。",
      jp: "【1895–1945 日本時代】日本佛教宗派來臺蓋佛寺、興辦教育、成立南瀛佛教會，帶來新式的組織運作（見下圖西本願寺臺灣別院老照片）。",
      postwar: "【1945 戰後重建與人間佛教】來臺法師建立規範傳戒、太虛與印順法師推動貼近人群的「人間佛教」（配圖為高雄佛光山當代實景，特別註明創立於 1967 年，不是戰後初期老照片）。",
      modern: "【20 世紀後期至今的多元現場】解嚴後大型慈善、醫療、環保與大學迅速開展，南傳、藏傳修行團體也走進街坊（見下圖 2011 臺北慈濟醫院外觀，不拍路人臉孔保護隱私）。"
    };
    allNodes("[data-twera]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-twera]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (tOut) tOut.textContent = eras[b.dataset.twera] || "";
    }));
    const myths = {
      phil: "把佛教講成純哲學或心理學，其實是近一百多年亞洲改革者面對西方科學跟殖民衝擊時，重新找出來的介紹方式——早年古書裡照樣有寫到諸天鬼神跟脫離生死的宗教追求。",
      science: "古代修行思考有深刻的地方，但並不是早年每一條宇宙觀跟宗教信念都能用現代科學實驗室驗證。",
      mindfulness: "只抽出呼吸減壓的「現代正念」，常拿掉了原本的倫理要求；近年心理與歷史研究也提醒，有些人不當打坐可能出現強烈焦慮或抽離感等不適，有身心問題時務必看醫生，不能把正念當成醫療替代品！",
      charity: "投入救災跟辦醫院是很讓人敬佩的現代實踐，但不能反過來以為兩千五百年前的印度托缽僧人原本也是這樣運作。"
    };
    allNodes("[data-modclaim]").forEach(b => b.addEventListener("click", () => {
      allNodes("[data-modclaim]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      if (mOut) mOut.textContent = myths[b.dataset.modclaim] || "";
    }));
  })();

  // S22: Final Detective Desk
  (() => {
    const checks = allNodes(".audit-check"), sample = $("#audit-case");
    let selected = "";
    const cases = {
      "拈花微笑是否有早期文獻？": "先回到第 16 關《一朵花的秘密時光書架》：早年古書沒出現，一直到 1029／1036 年的宋代書籍才首度寫完整——晚出不減哲學比喻價值，但不是現場筆錄！",
      "《伽藍經》是否叫人只相信自己？": "先回到第 04 關《小鎮傳聞偵探》：不是只要順我心意就好，還要檢查行為是不是令人更貪、更氣、更糊塗、害人，以及明理人認不認同！",
      "「佛陀說過」的網路語錄圖卡": "先問自己找得到出自哪一部經、哪一頁嗎？查不到具體出處時，先放進「目前還不知道」抽屜最聰明！"
    };
    function audit() {
      if (!checks.length) return;
      const n = checks.filter(x => x.checked).length, as = $("#audit-status");
      if (as) as.textContent = "目前進度：" + n + "／7（只是自己看的筆記進度，不是什麼聰明或功德分數喔！）";
      put("checks", JSON.stringify(checks.map(x => x.checked)));
      put("case", selected);
    }
    try {
      const saved = JSON.parse(get("checks") || "[]");
      checks.forEach((c, i) => { c.checked = !!saved[i]; });
      selected = get("case") || "";
      if (sample && cases[selected]) {
        sample.value = selected;
        if ($("#case-status")) $("#case-status").textContent = cases[selected];
      }
    } catch {}
    checks.forEach(c => c.addEventListener("change", audit));
    $("#load-case")?.addEventListener("click", () => {
      if (!sample) return;
      selected = sample.value;
      checks.forEach(c => { c.checked = false; });
      if ($("#case-status")) $("#case-status").textContent = cases[selected] || "自己在心裡想好要查的一句話，跟著下面清單檢查一遍！";
      audit();
    });
    $("#reset-audit")?.addEventListener("click", () => {
      selected = "";
      if (sample) sample.value = "";
      checks.forEach(c => { c.checked = false; });
      if ($("#case-status")) $("#case-status").textContent = "清單已清空，隨時可以拿來檢驗下一個聽來的故事。";
      const box = $("#notes-output");
      if (box) { box.hidden = true; box.value = ""; }
      if ($("#copy-status")) $("#copy-status").textContent = "";
      audit();
    });
    $("#copy-notes")?.addEventListener("click", async () => {
      const lines = checks.map((c, i) => (c.checked ? "[x] " : "[ ] ") + c.parentElement.textContent.trim());
      const out = "《看見更多》歷史偵探查證筆記（僅供個人備忘，非真偽評分）\n題目：" + (selected || "自選主張") + "\n" + lines.join("\n");
      const box = $("#notes-output"), st = $("#copy-status");
      if (box) { box.hidden = false; box.value = out; }
      try {
        await navigator.clipboard.writeText(out);
        if (st) st.textContent = "✓ 筆記已經複製進剪貼簿了，可以直接貼給朋友參考。";
      } catch {
        if (st) st.textContent = "已把純文字筆記顯示在下方框裡，請全選複製即可。";
      }
    });
    audit();
  })();
})();
