# 電子計算器 · Electronics Calculator

簡單的網頁版電子計算器：分壓、Buck/Boost、熱敏電阻、電池續航、歐姆定律、單位換算、誤差與 dB 計算。純前端，可放上 GitHub Pages 或 Netlify 隨處開啟。

**Made by tony.wang@samsara.com**

## 功能

- **電壓分壓**：輸入 Vin、R1、R2，計算 Vout 與流經電流
- **電池續航**：輸入容量 (mAh)、耗電電流 (mA)，可選放電係數，得到小時與天數
- **Buck 輸出電壓**：依 Vref、R1、R2 計算 Vout = Vref×(1+R1/R2)
- **Boost 輸出電壓**：同上，依反饋電阻計算輸出電壓
- **熱敏電阻 ADC → 溫度**：分壓電路 + Beta 方程，由 ADC 讀數推算溫度
- **歐姆定律／功率**：輸入 V、I 或 R 其中幾項，計算功率 P 與電阻 R
- **mm / mil / inch 換算**：輸入任一單位數值，換算成另外兩種（含反算）
- **誤差範圍計算**：輸入標稱值與誤差（± %），得到最大值與最小值
- **dBm / dBmV 換算**：功率 dBm ↔ 電壓 dBmV（可選 50Ω / 75Ω）；含 mW、mV 反算
- **dBm + 頻寬 → 功率密度**：輸入 dBm 與 BW (MHz)，得到 dBm/MHz、dBm/KHz
- **理想電感／電容阻抗**：輸入頻率 (MHz)、電感 (nH)、電容 (µF／nF／pF)，得 |X_L|、|X_C|（Ω）
- **LC 截止／諧振**：f₀ = 1/(2π√(LC))、√(LC) 與週期 T
- **RC 延遲與截止**：τ = RC、一階低通 −3 dB 截止 f_c = 1/(2πRC)
- **Antenna Gain Budget**：RF link budget（Friis），含 FSPL、EIRP、Noise floor、Sensitivity 與 Link margin（另開新分頁）
- **Board Power Estimator**：PCB 功耗估算（多 operating modes + 元件電流/效率 + Rail breakdown + 匯出 JSON/CSV；另開新分頁）

版面為一排 3 個計算器（響應式），標示為中英雙語。
