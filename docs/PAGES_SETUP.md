# GitHub Pages 發布與驗收

本專案已準備 `.github/workflows/pages.yml` 使用 GitHub 官方 Pages Actions。但空白新儲存庫的 Pages 可能尚未啟用。

## 開啟 Pages

1. 造訪 [這個儲存庫的 Pages 設定](https://github.com/t14210184/The-Naked-Dhamma/settings/pages)。
2. 在 **Build and deployment → Source** 選擇 **GitHub Actions**。
3. 在 [Actions](https://github.com/t14210184/The-Naked-Dhamma/actions) 查看 `Publish website to GitHub Pages` 工作。若前次因未啟用 Pages 失敗，可在 workflow 頁面使用 **Run workflow** 或對受影響的工作重新執行。
4. 等工作確實成功後，使用 GitHub 顯示的網站網址；不要只因預估網址可寫出就稱已上線。

標準的使用者／專案站點網址形式預期為 `https://t14210184.github.io/The-Naked-Dhamma/`，**但這是候選，不代表實際 HTTP 200，也不保證當下已啟用**。

## 驗收證據

- Pages 發布來源／公開網址的 GitHub 讀回；
- 工作流程 run/job `conclusion=success`；
- 公開 URL 實際 HTML 讀回，且與當次 `main` 的頁面內容及 SHA 對應；
- 真實 iPhone 與長者操作需另行測試。

參考 GitHub 官方： https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site 。
