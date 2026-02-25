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

  // ——— Buck/Boost 合併：Vout = Vref×(1+R1/R2)；反算 R2 = R1×Vref/(Vout−Vref) ———
  function updateBuckBoost() {
    const vref = num(byId('bb-vref').value);
    const r1 = num(byId('bb-r1').value);
    const r2 = num(byId('bb-r2').value);
    const voutTarget = num(byId('bb-vout-in').value);

    let voutResult = null;
    let r2Result = null;

    if (vref != null && vref >= 0 && r1 != null && r1 >= 0 && r2 != null && r2 > 0) {
      voutResult = vref * (1 + r1 / r2);
    }

    if (voutTarget != null && voutTarget > vref && vref != null && vref > 0 && r1 != null && r1 >= 0) {
      r2Result = (r1 * vref) / (voutTarget - vref);
    }

    byId('bb-vout-result').textContent = voutResult != null ? formatNum(voutResult, 3) : '—';
    byId('bb-r2-result').textContent = r2Result != null ? formatNum(r2Result, 2) : '—';
  }

  ['bb-vref', 'bb-r1', 'bb-r2', 'bb-vout-in'].forEach(function (id) {
    byId(id).addEventListener('input', updateBuckBoost);
  });
  updateBuckBoost();

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

  // ——— 線纜壓降與電阻 R = ρ·L/A，V_drop = I·R（可選來回×2） ———
  function updateCableDrop() {
    const len = num(byId('cable-len').value);
    const csa = num(byId('cable-csa').value);
    const cur = num(byId('cable-i').value);
    const rho = num(byId('cable-rho').value);
    const roundTrip = byId('cable-roundtrip').checked;

    if (len == null || len < 0 || csa == null || csa <= 0 || cur == null || cur < 0 || rho == null || rho < 0) {
      byId('cable-r').textContent = '—';
      byId('cable-vdrop').textContent = '—';
      return;
    }

    const A_m2 = csa * 1e-6;
    let R = (rho * len) / A_m2;
    if (roundTrip) R *= 2;
    const vDrop = cur * R;

    byId('cable-r').textContent = formatNum(R, 4);
    byId('cable-vdrop').textContent = formatNum(vDrop, 4);
  }

  ['cable-len', 'cable-csa', 'cable-i', 'cable-rho'].forEach(function (id) {
    byId(id).addEventListener('input', updateCableDrop);
  });
  byId('cable-roundtrip').addEventListener('change', updateCableDrop);
  updateCableDrop();

  // ——— AWG 與電流：直徑 d = 0.127×92^((36-n)/39) mm，A = π·d²/4 ———
  function awgToArea(awg) {
    const dMm = 0.127 * Math.pow(92, (36 - awg) / 39);
    const aMm2 = (Math.PI / 4) * dMm * dMm;
    return { d: dMm, a: aMm2 };
  }

  function updateAwgCurrent() {
    const awg = num(byId('awg-n').value);
    const cur = num(byId('awg-i').value);
    const len = num(byId('awg-len').value) || 0;
    const rhoCu = 1.68e-8;

    if (awg == null || awg < 0 || cur == null || cur < 0) {
      byId('awg-dia').textContent = '—';
      byId('awg-rpm').textContent = '—';
      byId('awg-vdrop').textContent = '—';
      return;
    }

    const { d, a } = awgToArea(awg);
    const aM2 = a * 1e-6;
    const RperM = rhoCu / aM2;
    const Rtotal = 2 * RperM * Math.max(0, len);
    const vDrop = cur * Rtotal;

    byId('awg-dia').textContent = formatNum(d, 3) + ' / ' + formatNum(a, 3);
    byId('awg-rpm').textContent = formatNum(RperM * 2, 5);
    byId('awg-vdrop').textContent = formatNum(vDrop, 4);
  }

  ['awg-n', 'awg-i', 'awg-len'].forEach(function (id) {
    byId(id).addEventListener('input', updateAwgCurrent);
  });
  updateAwgCurrent();

  // ——— ADC 讀數 → 實際電壓 V = Vref × (counts / (2^bits - 1)) ———
  function updateAdcVoltage() {
    const bits = num(byId('adc-v-bits').value);
    const counts = num(byId('adc-v-value').value);
    const vref = num(byId('adc-v-ref').value);

    if (bits == null || counts == null || counts < 0 || vref == null || vref < 0) {
      byId('adc-v-result').textContent = '—';
      return;
    }

    const maxCount = Math.pow(2, Math.min(16, Math.max(8, Math.round(bits)))) - 1;
    const v = vref * (counts / maxCount);

    byId('adc-v-result').textContent = formatNum(v, 4);
  }

  ['adc-v-bits', 'adc-v-value', 'adc-v-ref'].forEach(function (id) {
    byId(id).addEventListener('input', updateAdcVoltage);
  });
  updateAdcVoltage();

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
