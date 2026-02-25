(function () {
  'use strict';

  function byId(id) {
    return document.getElementById(id);
  }

  function num(val) {
    const n = parseFloat(val);
    return isNaN(n) ? null : n;
  }

  function formatNum(x, decimals) {
    if (x == null || isNaN(x)) return '—';
    if (decimals != null) return Number(x).toFixed(decimals);
    if (Math.abs(x) >= 1000 || (Math.abs(x) < 0.01 && x !== 0))
      return x.toExponential(2);
    return Number(x).toFixed(2);
  }

  // ——— 電壓分壓 ———
  function updateVoltageDivider() {
    const vin = num(byId('vin').value);
    const r1 = num(byId('r1').value);
    const r2 = num(byId('r2').value);

    if (vin == null || r1 == null || r2 == null || r1 + r2 <= 0) {
      byId('vout').textContent = '—';
      byId('divider-current').textContent = '—';
      return;
    }

    const vout = vin * r2 / (r1 + r2);
    const currentMa = (vin / (r1 + r2)) * 1000; // A -> mA

    byId('vout').textContent = formatNum(vout, 3);
    byId('divider-current').textContent = formatNum(currentMa, 2);
  }

  ['vin', 'r1', 'r2'].forEach(function (id) {
    byId(id).addEventListener('input', updateVoltageDivider);
  });
  updateVoltageDivider();

  // ——— Buck 輸出電壓 Vout = Vref × (1 + R1/R2) ———
  function updateBuckVout() {
    const vref = num(byId('buck-vref').value);
    const r1 = num(byId('buck-r1').value);
    const r2 = num(byId('buck-r2').value);

    if (vref == null || vref < 0 || r1 == null || r2 == null || r2 <= 0) {
      byId('buck-vout-result').textContent = '—';
      return;
    }

    const vout = vref * (1 + r1 / r2);
    byId('buck-vout-result').textContent = formatNum(vout, 3);
  }

  ['buck-vref', 'buck-r1', 'buck-r2'].forEach(function (id) {
    byId(id).addEventListener('input', updateBuckVout);
  });
  updateBuckVout();

  // ——— Boost 輸出電壓 Vout = Vref × (1 + R1/R2) ———
  function updateBoostVout() {
    const vref = num(byId('boost-vref').value);
    const r1 = num(byId('boost-r1').value);
    const r2 = num(byId('boost-r2').value);

    if (vref == null || vref < 0 || r1 == null || r2 == null || r2 <= 0) {
      byId('boost-vout-result').textContent = '—';
      return;
    }

    const vout = vref * (1 + r1 / r2);
    byId('boost-vout-result').textContent = formatNum(vout, 3);
  }

  ['boost-vref', 'boost-r1', 'boost-r2'].forEach(function (id) {
    byId(id).addEventListener('input', updateBoostVout);
  });
  updateBoostVout();

  // ——— 熱敏電阻 ADC → 溫度（分壓 + Beta 方程） ———
  function updateThermistorTemp() {
    const vcc = num(byId('th-vcc').value);
    const rSeries = num(byId('th-r-series').value);
    const adcBits = num(byId('th-adc-bits').value);
    const adcValue = num(byId('th-adc-value').value);
    const r0 = num(byId('th-r0').value);
    const beta = num(byId('th-beta').value);

    if (vcc == null || vcc <= 0 || rSeries == null || rSeries <= 0 ||
        adcBits == null || adcValue == null || adcValue < 0 || r0 == null || r0 <= 0 || beta == null || beta <= 0) {
      byId('th-temp').textContent = '—';
      byId('th-r-ntc').textContent = '—';
      return;
    }

    const maxCount = Math.pow(2, Math.min(16, Math.max(8, Math.round(adcBits)))) - 1;
    if (adcValue >= maxCount) {
      byId('th-temp').textContent = '—';
      byId('th-r-ntc').textContent = '∞';
      return;
    }
    if (adcValue <= 0) {
      byId('th-temp').textContent = '—';
      byId('th-r-ntc').textContent = '0';
      return;
    }

    // V_adc = Vcc * (adc / maxCount), R_ntc = R_series * V_adc / (Vcc - V_adc) = R_series * adc / (maxCount - adc)
    const rNtc = rSeries * adcValue / (maxCount - adcValue);

    // Beta: 1/T = 1/T0 + (1/beta)*ln(R/R0), T0 = 298.15 K (25°C)
    const T0 = 298.15;
    const invT = 1 / T0 + (1 / beta) * Math.log(rNtc / r0);
    const tempC = invT > 0 ? (1 / invT) - 273.15 : null;

    byId('th-r-ntc').textContent = formatNum(rNtc, 0);
    byId('th-temp').textContent = tempC != null && isFinite(tempC) ? formatNum(tempC, 1) : '—';
  }

  ['th-vcc', 'th-r-series', 'th-adc-bits', 'th-adc-value', 'th-r0', 'th-beta'].forEach(function (id) {
    byId(id).addEventListener('input', updateThermistorTemp);
  });
  updateThermistorTemp();

  // ——— 電池續航 ———
  function updateBatteryLife() {
    const capacity = num(byId('capacity').value);
    const currentDraw = num(byId('current-draw').value);
    const factor = num(byId('discharge-factor').value);
    const k = factor != null && factor > 0 ? factor : 1;

    if (capacity == null || capacity <= 0 || currentDraw == null || currentDraw <= 0) {
      byId('runtime').textContent = '—';
      byId('runtime-days').textContent = '—';
      return;
    }

    const hours = (capacity * k) / currentDraw;
    const days = hours / 24;

    byId('runtime').textContent = formatNum(hours, 2);
    byId('runtime-days').textContent = formatNum(days, 2);
  }

  ['capacity', 'current-draw', 'discharge-factor'].forEach(function (id) {
    byId(id).addEventListener('input', updateBatteryLife);
  });
  updateBatteryLife();

  // ——— 歐姆定律 / 功率 ———
  function updateOhmsPower() {
    const v = num(byId('v').value);
    const i = num(byId('i').value);
    const r = num(byId('r').value);

    let power = null;
    let rCalc = null;

    if (v != null && i != null && v >= 0 && i >= 0) {
      power = v * i;
    }
    if (v != null && i != null && i > 0) {
      rCalc = v / i;
    } else if (v != null && r != null && r > 0) {
      rCalc = r;
    }
    if (r != null && r > 0 && i != null && i >= 0) {
      power = power == null ? i * i * r : power;
    }
    if (v != null && r != null && r > 0) {
      power = power == null ? (v * v) / r : power;
    }

    byId('power').textContent = power != null ? formatNum(power, 4) : '—';
    byId('r-calc').textContent = rCalc != null ? formatNum(rCalc, 2) : '—';
  }

  ['v', 'i', 'r'].forEach(function (id) {
    byId(id).addEventListener('input', updateOhmsPower);
  });
  updateOhmsPower();
})();
