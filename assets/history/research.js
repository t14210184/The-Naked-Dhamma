(() => {
  "use strict";
  const root = document.documentElement;
  const $ = s => document.querySelector(s);
  const all = s => [...document.querySelectorAll(s)];
  const get = k => { try { return localStorage.getItem("dhamma-history-" + k); } catch { return null; } };
  const put = (k, v) => { try { if (v === null) localStorage.removeItem("dhamma-history-" + k); else localStorage.setItem("dhamma-history-" + k, v); } catch {} };

  root.classList.add("enhanced");

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

  // Bibliography & Evidence filter
  const qInput = $("#res-search");
  const typeSel = $("#res-type");
  const accSel = $("#res-access");
  const evCards = all("[data-evidence-card]");
  const norm = s => s.normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, "");

  function filterRes() {
    const q = norm(qInput?.value.trim() || "");
    const tp = typeSel?.value || "";
    const ac = accSel?.value || "";
    let shown = 0;
    evCards.forEach(c => {
      const okQ = !q || norm(c.textContent).includes(q);
      const okT = !tp || (c.dataset.type || "").includes(tp);
      const okA = !ac || (c.dataset.access || "") === ac;
      c.hidden = !(okQ && okT && okA);
      if (!c.hidden) shown++;
    });
    const stat = $("#res-filter-status");
    if (stat) stat.textContent = "顯示 " + shown + "／" + evCards.length + " 筆證據與書目。";
  }
  qInput?.addEventListener("input", filterRes);
  typeSel?.addEventListener("change", filterRes);
  accSel?.addEventListener("change", filterRes);
  $("#res-clear")?.addEventListener("click", () => {
    if (qInput) qInput.value = "";
    if (typeSel) typeSel.value = "";
    if (accSel) accSel.value = "";
    filterRes();
  });

  // Copy full bibliography
  $("#copy-bib")?.addEventListener("click", async () => {
    const text = all("[data-bib-line]").map(el => el.textContent.trim()).join("\n");
    const box = $("#bib-output");
    const st = $("#bib-copy-status");
    if (box) box.value = text;
    try {
      await navigator.clipboard.writeText(text);
      if (st) st.textContent = "已複製完整書目（" + all("[data-bib-line]").length + " 筆）。";
      if (box) box.hidden = true;
    } catch {
      if (box) { box.hidden = false; box.focus(); box.select(); }
      if (st) st.textContent = "無法自動複製；請手動選取下方書目文字。";
    }
  });

  // Bad image graceful fallback
  all("img[data-fallback]").forEach(img => {
    img.addEventListener("error", () => {
      img.hidden = true;
      const fb = img.closest(".artifact-stage")?.querySelector(".img-fallback");
      if (fb) fb.hidden = false;
    });
  });

  filterRes();
})();
