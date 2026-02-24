# 電子計算器 · Electronics Calculator

簡單的網頁版電子計算器：分壓、Buck/Boost、熱敏電阻、電池續航、歐姆定律。純前端，可放上 GitHub Pages 或 Netlify 隨處開啟。

## 功能

- **電壓分壓**：輸入 Vin、R1、R2，計算 Vout 與流經電流
- **電池續航**：輸入容量 (mAh)、耗電電流 (mA)，可選放電係數，得到小時與天數
- **Buck 輸出電壓**：依 Vref、R1、R2 計算 Vout = Vref×(1+R1/R2)
- **Boost 輸出電壓**：同上，依反饋電阻計算輸出電壓
- **熱敏電阻 ADC → 溫度**：分壓電路 + Beta 方程，由 ADC 讀數推算溫度
- **歐姆定律／功率**：輸入 V、I 或 R 其中幾項，計算功率 P 與電阻 R

版面為一排 3 個計算器（響應式），標示為中英雙語。

## 本地預覽

在專案目錄下用任意靜態伺服器開啟，例如：

```bash
cd electronics-calculator
python3 -m http.server 8080
```

瀏覽器打開 http://localhost:8080 即可。

或直接用瀏覽器開啟 `index.html` 檔案。

## 推上 GitHub

1. 在 GitHub 建立新倉庫（若尚未建立），Repository name 例如 `EE-Calculated-Tools`。
2. 在專案目錄執行：

```bash
git remote add origin https://github.com/你的帳號/EE-Calculated-Tools.git
git push -u origin main
```

3. **GitHub Pages**：該倉庫 → **Settings** → **Pages** → Source 選 **Deploy from a branch**，Branch 選 **main**，資料夾選 **/ (root)**。網站會出現在 `https://你的帳號.github.io/EE-Calculated-Tools/`。

## 部署到網路（其他方式）

- **Netlify**：把專案拖到 [Netlify Drop](https://app.netlify.com/drop) 或連動 GitHub 倉庫，根目錄即為網站根目錄。無需 build，上傳後即可使用。
