# 電子計算器

簡單的網頁版電子計算器：分壓、電池續航、歐姆定律／功率。純前端，可放上 GitHub Pages 或 Netlify 隨處開啟。

## 功能

- **電壓分壓**：輸入 Vin、R1、R2，計算 Vout 與流經電流
- **電池續航**：輸入容量 (mAh)、耗電電流 (mA)，可選放電係數，得到小時與天數
- **歐姆定律／功率**：輸入 V、I 或 R 其中幾項，計算功率 P 與電阻 R

## 本地預覽

在專案目錄下用任意靜態伺服器開啟，例如：

```bash
cd electronics-calculator
python3 -m http.server 8080
```

瀏覽器打開 http://localhost:8080 即可。

或直接用瀏覽器開啟 `index.html` 檔案。

## 推上 GitHub

1. **在 GitHub 建立新倉庫**
   - 打開 [github.com/new](https://github.com/new)
   - Repository name 填例如 `electronics-calculator`
   - 選 **Public**，不要勾 "Add a README"（本地已有）
   - 按 **Create repository**

2. **在終端機執行（專案目錄 `electronics-calculator` 下）：**

```bash
cd /Users/tony.wang/electronics-calculator
git init
git add .
git commit -m "Initial commit: 分壓、電池續航、歐姆定律計算器"
git branch -M main
git remote add origin https://github.com/你的帳號/electronics-calculator.git
git push -u origin main
```

把 `你的帳號` 換成你的 GitHub 使用者名稱；若倉庫名稱不同，`electronics-calculator` 也要改成你設定的名稱。

3. **開啟 GitHub Pages（讓網站可從網址開啟）**
   - 進該倉庫 → **Settings** → 左側 **Pages**
   - 在 **Source** 選 **Deploy from a branch**
   - Branch 選 **main**，資料夾選 **/ (root)**，Save
   - 幾分鐘後網站會出現在：`https://你的帳號.github.io/electronics-calculator/`

## 部署到網路（其他方式）

- **Netlify**：把專案拖到 [Netlify Drop](https://app.netlify.com/drop) 或連動 GitHub 倉庫，根目錄即為網站根目錄。

無需 build，上傳後即可使用。
