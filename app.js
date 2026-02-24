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
