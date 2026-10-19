# 最小架構與部署

## 實際架構

```
GitHub main
  ├── index.html            首頁，最新版單檔可直接離線閱讀
  ├── assets/               原圖備份（首頁已內嵌圖片，離線仍可顯示）
  ├── versions/             對話中的八個主要可還原歷史 HTML
  ├── docs/                 使命、證據、演進、計畫與查證
  ├── CONTRIBUTING.md
  └── .github/workflows/pages.yml
                             main 更新 → Actions → Pages
```

初期**不用 Astro、Next.js、D3、React Flow、資料庫、登入、外部分析服務**。最新頁面已是可運作的單檔 HTML，新增打包層會增加維護成本；等內容或元件重用真的需要時才引入靜態產生器。

## 部署來源

建議在 `Settings → Pages → Build and deployment → Source` 選擇 **GitHub Actions**，使用已附的 `pages.yml`，僅發布根目錄的 `index.html`。GitHub Pages 公開站點為 GitHub 回傳為準，不能憑推測的網址就宣稱正式部署。

## 變更流程

一般內容勘誤：開 Issue → 提出原文、平行經、翻譯及可視化說明 → 修改 → 本機/CI 檢查 → 對應版本提交。公開網站的 LIVE 與研究文稿的接受狀態分開。

## 最低測試

- HTML 主文無外部腳本必需依賴。
- 歷史版本不覆蓋首頁。
- 調整字級後不水平溢出，按鈕不擋正文。
- 主文無經號、宗教或科學暗示的過度斷言；頁尾精確連結。
- GitHub Actions 若失敗須讀真實 job logs；不可當作部署成功。
- 每次公開驗收寫出 repo/ref/exact SHA、公網時間與頁面結果。