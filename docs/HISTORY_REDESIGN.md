# 第三篇 v2.0 重建設計與研究契約（公開摘要）

**版本**：v2.0 候選工程｜**基準 main SHA**：`6c8cc58ea42107aa6cb7bbe7133ba5dbadf380bb`｜**日期**：2026-11-27

## 1. 雙層同一證據鏈架構

- **大眾互動探索館（`history.html`）**：保持原網址與 v1.1 全部既有錨點（`#top`, `#quick`, `#all`, `#menu`, `#library` 與 22 站 `#four`–`#lab`），採用暖紙淺色（預設）與柔光深色（切換）雙主題、16–28px 字級、四幕導覽、續讀書籤與無 JS 完整可讀設計。22 站各自實作對應故事場景、具象原創 SVG、真圖放大鏡、歷史地圖、雙版古鼓、文本鑑定桌、口傳／保存沙盒等互動。
- **專業研究延伸頁（`history-research.html`）**：公開研究方法與檢索紀錄、22 站命題級證據（`claim_id`）、材料型態／證據強度／取得狀態三軸分立（`PRIMARY_CHECKED`、`FULLTEXT_CHECKED`、`ABSTRACT_ONLY`、`CATALOG_ONLY` 等）、跨語文對讀、學術爭議正反假說、完整書目（可複製）及限制／勘誤。
- **雙向精確錨點**：`history.html` 每段實質主張就地標出簡短出處與研究錨點（例如 `./history-research.html#four-authority`），研究頁每段提供返回大眾站點的直連（例如 `./history.html#four`）。
- **單一靜態權威資料源**：由 `scripts/data/history-data.mjs` 與 `scripts/build-history.mjs` 產生兩頁靜態 HTML 的結構化研究區塊與交叉索引，不引入前端執行期框架、資料庫、追蹤腳本或外部管理後台。

## 2. 內容覆蓋與影像權利原則

- 原始輸入單元（22 章、23 表 185 筆資料列、12 圖像主題、5 組圖解、非表格段落及 20 頁稽核藍圖）以 `docs/HISTORY_COVERAGE.tsv` 逐項對應至 `claim_id`、`evidence_id` 與兩頁錨點。
- 歷史實物與合法影像清冊以 `docs/HISTORY_IMAGES_RIGHTS.tsv` 管理：僅嵌入經逐檔查證為 Public Domain、CC0、CC BY 或 CC BY-SA 且不侵害個人隱私的館藏／實景照片，並於網站清楚區分「考古實物照片」「後世藝術想像」「當代遺址／機構實景」與「現代原創示意」。受反爬蟲或授權障礙者（如國會圖書館 2018305008、大英圖書館敦煌 S.5475）設為 `RIGHTS_LINK_ONLY` 並提供正式館藏直連。

## 3. 無障礙、Safari/WebKit 防護與品管

- 落實 `overflow-x: clip`、`min-height: 100svh`、`font-size: max(16px, 1rem)`、`env(safe-area-inset-bottom)`、雙色 `:focus-visible`、非文字邊框對比 ≥ 3:1、44×44px 觸控目標與 ≥ 8px 間距、`prefers-reduced-motion` 與 `forced-colors` 支援、`@media print` 潔淨列印，以及 `data-font-scale="large"` 窄螢幕卡片展開。
- 測試以 `scripts/verify-history.mjs` 涵蓋 22 站互動、7 種寬度（320/375/390/430/768/1024/1440）× 雙主題 × 20/28px（含 16px 與 200% 縮放）、無 JS、localStorage 拒絕、壞圖降級、錯誤 hash、axe-core WCAG 2.2 AA 掃描、逐張截圖檢視與反例驗證。真機與跨年齡真人測試未執行前誠實標記 `NOT_RUN`。
