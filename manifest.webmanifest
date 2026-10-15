(function () {
  var stage = document.getElementById('stage');
  var cv = document.getElementById('cv');
  var ctx = cv.getContext('2d');
  var elScore = document.getElementById('score');
  var elBest = document.getElementById('best');
  var elCoins = document.getElementById('coins');
  var shop = document.getElementById('shop');
  var shopList = document.getElementById('shopList');
  var shopCoins = document.getElementById('shopCoins');
  var shopBtn = document.getElementById('shopBtn');
  var shopBack = document.getElementById('shopBack');
  var shopTabs = document.getElementById('shopTabs');
  var lb = document.getElementById('lb');
  var lbBtn = document.getElementById('lbBtn');
  var lbBack = document.getElementById('lbBack');
  var lbList = document.getElementById('lbList');
  var lbNote = document.getElementById('lbNote');
  var nickInput = document.getElementById('nick');
  var ovText = document.getElementById('ovText');
  var ovStats = document.getElementById('ovStats');
  var ovRecord = document.getElementById('ovRecord');
  var playBtn = document.getElementById('playBtn');
  var againBtn = document.getElementById('againBtn');
  var overShopBtn = document.getElementById('overShopBtn');
  var overMenuBtn = document.getElementById('overMenuBtn');
  var resumeBtn = document.getElementById('resumeBtn');
  var pauseMenuBtn = document.getElementById('pauseMenuBtn');
  var pauseBtn = document.getElementById('pauseBtn');

  var WW = 360, BH = 26, BASE_W = 170, TOL = 5;
  var W = 0, H = 0, S = 1, HW = 0, DPR = 1, groundY = 0;
  var state = 'idle', blocks = [], cur = null, debris = [], pops = [];
  var cam = 0, streak = 0, best = 0, last = 0, fromLeft = true;
  var coins = 0, runCoins = 0, upg = { coin: 0, prec: 0, slow: 0 };
  var own = { skin: ['classic'], bg: ['night'] }, sel = { skin: 'classic', bg: 'night' }, shopTab = 'up', clock = 0;

  function hsl(h, s, l) { return 'hsl(' + h + ' ' + s + '% ' + l + '%)'; }
  function mk(h, s, l) { return [hsl(h, s, l + 14), hsl(h, s, l), hsl(h, s, l - 14)]; }
  function withEdge(c, e) { c.push(e); return c; }

  // Скины блоков: c(hue) возвращает [верх, лицо, низ, необязательная рамка]
  var SKINS = [
    { id: 'classic', name: 'Классика', price: 0, c: function (h) { return [hsl(h, 74, 70), hsl(h, 68, 56), hsl(h, 60, 42)]; } },
    { id: 'green', name: 'Зелёный', price: 40, c: function () { return mk(140, 55, 44); } },
    { id: 'yellow', name: 'Жёлтый', price: 40, c: function () { return mk(50, 95, 54); } },
    { id: 'red', name: 'Красный', price: 60, c: function () { return mk(2, 78, 52); } },
    { id: 'blue', name: 'Синий', price: 60, c: function () { return mk(214, 80, 55); } },
    { id: 'black', name: 'Чёрный', price: 80, c: function () { return withEdge(mk(230, 12, 16), 'rgba(255,255,255,0.3)'); } },
    { id: 'white', name: 'Белый', price: 80, c: function () { return ['#ffffff', hsl(210, 15, 93), hsl(215, 12, 76), 'rgba(30,50,90,0.4)']; } },
    { id: 'gold', name: 'Золото', price: 200, c: function () { return [hsl(50, 100, 80), hsl(44, 92, 54), hsl(36, 80, 34)]; } },
    { id: 'rainbow', name: 'Радуга', price: 250, c: function (h) { return mk((h * 4) % 360, 75, 56); }, pv: 'linear-gradient(90deg,#e5484d,#f5a524,#46c46a,#3b82f6,#a855f7)' },
    { id: 'neon', name: 'Неон', price: 300, c: function () { return [hsl(180, 100, 75), hsl(235, 45, 14), hsl(235, 45, 9), hsl(180, 100, 60)]; } }
  ];

  function fillGrad(stops) {
    var g = ctx.createLinearGradient(0, 0, 0, HW);
    stops.forEach(function (s) { g.addColorStop(s[0], s[1]); });
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, WW, HW);
  }
  function nebula(x, y, r, rgb) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(' + rgb + ',0.28)');
    g.addColorStop(1, 'rgba(' + rgb + ',0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Фоны: draw() рисует небо, ground задаёт цвет земли
  var BGS = [
    { id: 'night', name: 'Ночь', price: 0, ground: '#080b16', pv: 'linear-gradient(#0e1226,#23305a)',
      draw: function () {
        var h = (225 + blocks.length * 2) % 360;
        var g = ctx.createLinearGradient(0, 0, 0, HW);
        g.addColorStop(0, 'hsl(' + h + ' 45% 10%)');
        g.addColorStop(1, 'hsl(' + ((h + 25) % 360) + ' 50% 24%)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, WW, HW);
        ctx.fillStyle = '#ffffff';
        for (var i = 0; i < stars.length; i++) {
          var s = stars[i];
          var sy = (s.y * HW + cam * 0.12 * s.r) % HW;
          ctx.globalAlpha = 0.25 + s.r * 0.18;
          ctx.beginPath(); ctx.arc(s.x, sy, s.r, 0, 6.2832); ctx.fill();
        }
        ctx.globalAlpha = 1;
      } },
    { id: 'sunset', name: 'Закат', price: 100, ground: '#2a0c2e', pv: 'linear-gradient(#2b1055,#c2408a 55%,#ff9a3c)',
      draw: function () {
        fillGrad([[0, '#2b1055'], [0.55, '#c2408a'], [1, '#ff9a3c']]);
        ctx.fillStyle = 'rgba(255,226,140,0.95)';
        ctx.beginPath(); ctx.arc(WW * 0.7, HW * 0.66 + cam * 0.1, 46, 0, 6.2832); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.16)';
        for (var i = 0; i < 4; i++) {
          var cx = ((i * 150 + clock * (6 + i * 3)) % (WW + 200)) - 100;
          var cy = (HW * (0.12 + 0.2 * i) + cam * 0.06 * (i + 1)) % HW;
          ctx.beginPath(); ctx.ellipse(cx, cy, 52, 9, 0, 0, 6.2832); ctx.fill();
          ctx.beginPath(); ctx.ellipse(cx + 22, cy - 7, 30, 8, 0, 0, 6.2832); ctx.fill();
        }
      } },
    { id: 'ocean', name: 'Океан', price: 120, ground: '#01141f', pv: 'linear-gradient(#02223a,#0a7a94)',
      draw: function () {
        fillGrad([[0, '#02223a'], [1, '#0a7a94']]);
        ctx.fillStyle = 'rgba(180,240,255,0.06)';
        for (var k = 0; k < 3; k++) {
          var x0 = 60 + k * 120 + Math.sin(clock * 0.4 + k) * 14;
          ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0 + 40, 0); ctx.lineTo(x0 + 110, HW); ctx.lineTo(x0 - 10, HW); ctx.closePath(); ctx.fill();
        }
        ctx.strokeStyle = 'rgba(200,240,255,0.4)';
        ctx.lineWidth = 1;
        for (var i = 0; i < stars.length; i++) {
          var s = stars[i];
          var by = HW - ((clock * (14 + s.r * 12) + i * 61 + cam * 0.1) % HW);
          var bx = s.x + Math.sin(clock * 1.2 + i) * 6;
          ctx.beginPath(); ctx.arc(bx, by, s.r * 1.6, 0, 6.2832); ctx.stroke();
        }
      } },
    { id: 'winter', name: 'Зима', price: 120, ground: '#cfe3f2', pv: 'linear-gradient(#7fb8e6,#e9f6ff)',
      draw: function () {
        fillGrad([[0, '#7fb8e6'], [1, '#e9f6ff']]);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath(); ctx.ellipse(WW * 0.15, HW * 0.9 + cam * 0.05, 190, 70, 0, 0, 6.2832); ctx.fill();
        ctx.beginPath(); ctx.ellipse(WW * 0.9, HW * 0.95 + cam * 0.05, 210, 80, 0, 0, 6.2832); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.85;
        for (var i = 0; i < stars.length; i++) {
          var s = stars[i];
          var sx = (s.x + Math.sin(clock * 0.8 + i) * 10 + WW) % WW;
          var sy = (s.y * HW + clock * (16 + s.r * 14) + cam * 0.1 * s.r) % HW;
          ctx.beginPath(); ctx.arc(sx, sy, s.r * 1.3, 0, 6.2832); ctx.fill();
        }
        ctx.globalAlpha = 1;
      } },
    { id: 'space', name: 'Космос', price: 180, ground: '#05010f', pv: 'radial-gradient(circle at 30% 30%,#7a2fc4,#04010c 70%)',
      draw: function () {
        fillGrad([[0, '#04010c'], [1, '#1a0b3d']]);
        nebula(WW * 0.25, HW * 0.3 + cam * 0.05, 150, '180,60,255');
        nebula(WW * 0.85, HW * 0.72 + cam * 0.08, 170, '40,200,255');
        ctx.fillStyle = '#ffffff';
        for (var i = 0; i < stars.length; i++) {
          var s = stars[i];
          var sy = (s.y * HW + cam * 0.2 * s.r) % HW;
          ctx.globalAlpha = 0.45 + 0.45 * Math.sin(clock * 2 + s.x);
          ctx.beginPath(); ctx.arc(s.x, sy, s.r * 1.1, 0, 6.2832); ctx.fill();
        }
        ctx.globalAlpha = 1;
      } },
    { id: 'synth', name: 'Синтвейв', price: 250, ground: '#0a0018', pv: 'linear-gradient(#0c0022,#5a0f7a 60%,#14002e 60%)',
      draw: function () {
        var y0 = HW * 0.62;
        fillGrad([[0, '#0c0022'], [0.62, '#5a0f7a'], [0.62, '#14002e'], [1, '#14002e']]);
        var sg = ctx.createLinearGradient(0, y0 - 70, 0, y0);
        sg.addColorStop(0, '#ffe36e');
        sg.addColorStop(1, '#ff3fa4');
        ctx.save();
        ctx.beginPath(); ctx.rect(0, 0, WW, y0); ctx.clip();
        ctx.fillStyle = sg;
        ctx.beginPath(); ctx.arc(WW / 2, y0 - 8, 62, 0, 6.2832); ctx.fill();
        ctx.restore();
        ctx.strokeStyle = 'rgba(255,70,200,0.55)';
        ctx.lineWidth = 1;
        for (var k = -9; k <= 9; k++) {
          ctx.beginPath(); ctx.moveTo(WW / 2 + k * 14, y0); ctx.lineTo(WW / 2 + k * 90, HW); ctx.stroke();
        }
        for (var j = 0; j < 10; j++) {
          var t = (j + ((clock * 0.5 + cam * 0.004) % 1)) / 10;
          var yy = y0 + t * t * (HW - y0);
          ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(WW, yy); ctx.stroke();
        }
      } }
  ];

  var SKIN_MAP = {}, BG_MAP = {};
  SKINS.forEach(function (s) { SKIN_MAP[s.id] = s; });
  BGS.forEach(function (b) { BG_MAP[b.id] = b; });
  function byId(k) { return k === 'skin' ? SKIN_MAP : BG_MAP; }

  try { best = parseInt(localStorage.getItem('bashnya-best'), 10) || 0; } catch (e) {}
  try {
    var sv = JSON.parse(localStorage.getItem('bashnya-save') || 'null');
    if (sv && typeof sv === 'object') {
      coins = Math.max(0, Math.floor(+sv.coins) || 0);
      var su = sv.upg || {};
      upg.coin = Math.max(0, Math.floor(+su.coin) || 0);
      upg.prec = Math.min(8, Math.max(0, Math.floor(+su.prec) || 0));
      upg.slow = Math.min(8, Math.max(0, Math.floor(+su.slow) || 0));
      if (sv.own && typeof sv.own === 'object') {
        ['skin', 'bg'].forEach(function (k) {
          var list = Array.isArray(sv.own[k]) ? sv.own[k] : [];
          list.forEach(function (id) {
            if (byId(k)[id] && own[k].indexOf(id) < 0) own[k].push(id);
          });
        });
      }
      if (sv.sel && typeof sv.sel === 'object') {
        if (sv.sel.skin && own.skin.indexOf(sv.sel.skin) >= 0) sel.skin = sv.sel.skin;
        if (sv.sel.bg && own.bg.indexOf(sv.sel.bg) >= 0) sel.bg = sv.sel.bg;
      }
    }
  } catch (e) {}

  var stars = [];
  for (var i = 0; i < 46; i++) stars.push({ x: Math.random() * WW, y: Math.random(), r: 0.6 + Math.random() * 1.4 });

  function plural(n, f) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return f[0];
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return f[1];
    return f[2];
  }
  function floorsWord(n) { return plural(n, ['этаж', 'этажа', 'этажей']); }
  function hueFor(i) { return (190 + i * 8) % 360; }
  function speed(n) { return Math.min(130 + n * 5, 330) * (1 - 0.05 * upg.slow); }
  function tol() { return TOL + 1.5 * upg.prec; }
  function gain() { return 1 + upg.coin; }
  function fmt(n) { return n.toLocaleString('ru-RU'); }

  function resize() {
    var r = stage.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    S = W / WW; HW = H / S; groundY = HW - 64;
  }

  function updateHud() {
    elScore.textContent = String(Math.max(0, blocks.length - 1));
    elBest.textContent = String(best);
    elCoins.textContent = fmt(coins);
  }

  function spawn() {
    var n = blocks.length, top = blocks[n - 1], w = top.w;
    cur = { w: w, x: fromLeft ? 0 : WW - w, dir: fromLeft ? 1 : -1, hue: hueFor(n) };
    fromLeft = !fromLeft;
  }

  function reset() {
    blocks = [{ x: (WW - BASE_W) / 2, w: BASE_W, hue: hueFor(0) }];
    debris = []; pops = []; cam = 0; streak = 0;
    spawn(); updateHud();
  }

  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  function drop() {
    if (state !== 'play' || !cur) return;
    var n = blocks.length, top = blocks[n - 1];
    var left = Math.max(cur.x, top.x), right = Math.min(cur.x + cur.w, top.x + top.w);
    var ov = right - left;
    var y = groundY - (n + 1) * BH;
    if (ov <= 0) {
      debris.push({ x: cur.x, w: cur.w, y: y, vx: cur.dir * 40, vy: 0, rot: 0, vr: cur.dir * 1.5, hue: cur.hue, a: 1 });
      gameOver();
      return;
    }
    var nx, nw, text;
    if (Math.abs(cur.x - top.x) <= tol()) {
      streak++;
      nw = top.w; nx = top.x;
      if (streak >= 3) {
        nw = Math.min(BASE_W, top.w + 8);
        nx = Math.max(0, Math.min(WW - nw, top.x - (nw - top.w) / 2));
      }
      text = streak > 1 ? 'Идеально ×' + streak : 'Идеально';
      buzz(15);
    } else {
      streak = 0;
      nx = left; nw = ov; text = '';
      var px, pw;
      if (cur.x < top.x) { px = cur.x; pw = top.x - cur.x; }
      else { px = right; pw = cur.x + cur.w - right; }
      debris.push({ x: px, w: pw, y: y, vx: (px < nx ? -1 : 1) * 30, vy: 0, rot: 0, vr: (px < nx ? -1 : 1) * 1.2, hue: cur.hue, a: 1 });
    }
    blocks.push({ x: nx, w: nw, hue: cur.hue });
    var g = gain();
    coins += g; runCoins += g; save();
    pops.push({ text: (text ? text + '  ' : '') + '+' + g, y: y, t: 0 });
    spawn();
    updateHud();
  }

  function save() {
    try { localStorage.setItem('bashnya-save', JSON.stringify({ coins: coins, upg: upg, own: own, sel: sel })); } catch (e) {}
  }

  var nick = '', lbRows = [], lbMine = null, lbState = 'idle', lastSent = 0, sending = false, queued = 0;
  var lbRefresh = document.getElementById('lbRefresh');
  var lbMeEl = document.getElementById('lbMe');
  try { nick = localStorage.getItem('bashnya-name') || ''; } catch (e) {}
  try { lastSent = parseInt(localStorage.getItem('bashnya-lb-sent'), 10) || 0; } catch (e) {}

  function cleanName(s) { return String(s || '').replace(/\s+/g, ' ').trim().slice(0, 16); }
  function myName() { return cleanName(nick) || 'Игрок'; }
  function noop() {}

  function readCache() {
    try {
      var c = JSON.parse(localStorage.getItem('bashnya-lb-cache') || 'null');
      if (c && Array.isArray(c.rows)) return c;
    } catch (e) {}
    return null;
  }
  function writeCache(rows, mine) {
    try { localStorage.setItem('bashnya-lb-cache', JSON.stringify({ rows: rows, mine: mine, t: Date.now() })); } catch (e) {}
  }

  function rowEl(rank, name, best, mine) {
    var row = el('div', 'lb' + (mine ? ' me' : '') + (rank <= 3 ? ' r' + rank : ''));
    row.appendChild(el('div', 'rk', String(rank)));
    row.appendChild(el('div', 'pn', (name || 'Игрок') + (mine ? ' (ты)' : '')));
    row.appendChild(el('div', 'pf', String(best)));
    return row;
  }

  function renderBoard() {
    lbList.textContent = '';
    lbMeEl.textContent = '';
    lbNote.hidden = true;
    var LB = window.LB;
    if (!LB || !LB.enabled) {
      lbRefresh.hidden = true;
      lbNote.hidden = false;
      lbNote.textContent = 'Рейтинг не настроен: добавь ключи Firebase в файл config.js.';
      return;
    }
    lbRefresh.hidden = false;
    lbRefresh.disabled = (lbState === 'loading');
    if (lbMine && lbMine.rank) lbMeEl.appendChild(rowEl(lbMine.rank, lbMine.name, lbMine.best, true));
    if (lbState === 'loading' && !lbRows.length) {
      lbList.appendChild(el('div', 'note', 'Загрузка…'));
      return;
    }
    if (lbState === 'error') {
      lbNote.hidden = false;
      lbNote.textContent = lbRows.length
        ? 'Нет связи с сервером. Показан сохранённый список.'
        : 'Нет связи с сервером. Проверь интернет и нажми «Обновить».';
    }
    if (!lbRows.length) {
      if (lbState !== 'error') lbList.appendChild(el('div', 'note', 'Пока никого. Построй башню и стань первым.'));
      return;
    }
    var me = LB.uid();
    lbRows.forEach(function (r, i) {
      lbList.appendChild(rowEl(i + 1, r.name, r.best, !!me && r.id === me));
    });
  }

  function refreshBoard() {
    var LB = window.LB;
    if (!LB || !LB.enabled) { renderBoard(); return; }
    var cached = readCache();
    if (!lbRows.length && cached) { lbRows = cached.rows; lbMine = cached.mine || null; }
    lbState = 'loading';
    renderBoard();
    Promise.all([LB.top(50), LB.mine().catch(function () { return null; })]).then(function (r) {
      lbRows = r[0]; lbMine = r[1]; lbState = 'ready';
      writeCache(lbRows, lbMine);
      renderBoard();
    }, function () {
      lbState = 'error';
      renderBoard();
    });
  }

  function sendBest(cand) {
    var LB = window.LB;
    if (!LB || !LB.enabled) return;
    if (sending) { queued = Math.max(queued, cand); return; }
    sending = true;
    LB.submit(cand, myName()).then(function () {
      lastSent = Math.max(lastSent, cand);
      try { localStorage.setItem('bashnya-lb-sent', String(lastSent)); } catch (e) {}
      if (!lb.hidden) refreshBoard();
    }, noop).then(function () {
      sending = false;
      var q = queued; queued = 0;
      if (q > lastSent) sendBest(q);
    });
  }

  function submitScore(floors) {
    var cand = Math.max(best, floors);
    if (cand < 1 || cand <= lastSent) return;
    sendBest(cand);
  }

  var UP = [
    { id: 'coin', name: 'Монеты за блок', max: Infinity, base: 10, k: 1.5,
      lvl: function () { return 'Ур. ' + (upg.coin + 1); },
      desc: function () { return 'Сейчас ' + gain() + ' за блок, станет ' + (gain() + 1) + '. Прокачка без предела.'; } },
    { id: 'prec', name: 'Зона идеала', max: 8, base: 25, k: 1.6,
      lvl: function () { return 'Ур. ' + upg.prec + ' из 8'; },
      desc: function () { return 'Идеальное попадание прощает больше. Сейчас ±' + tol().toFixed(1).replace('.', ',') + '.'; } },
    { id: 'slow', name: 'Медленные блоки', max: 8, base: 30, k: 1.6,
      lvl: function () { return 'Ур. ' + upg.slow + ' из 8'; },
      desc: function () { return 'Блок скользит медленнее. Сейчас −' + (5 * upg.slow) + '%.'; } }
  ];

  function cost(u) { return Math.round(u.base * Math.pow(u.k, upg[u.id])); }

  function previewCss(kind, it) {
    if (kind === 'bg') return it.pv;
    if (it.pv) return it.pv;
    var c = it.c(200);
    return 'linear-gradient(to bottom, ' + c[0] + ' 0 22%, ' + c[1] + ' 22% 78%, ' + c[2] + ' 78% 100%)';
  }

  function buyCosmetic(kind, it) {
    if (own[kind].indexOf(it.id) >= 0 || coins < it.price) return;
    coins -= it.price;
    own[kind].push(it.id);
    sel[kind] = it.id;
    save(); updateHud(); renderShop();
  }

  function renderCosmetics(kind) {
    var list = kind === 'skin' ? SKINS : BGS;
    list.forEach(function (it) {
      var owned = own[kind].indexOf(it.id) >= 0;
      var active = sel[kind] === it.id;
      var row = el('div', 'up');
      var info = el('div', 'info withsw');
      var sw = el('div', 'sw ' + (kind === 'bg' ? 'bgsw' : 'blsw'));
      sw.style.background = previewCss(kind, it);
      if (kind === 'skin') {
        var edge = it.c(200)[3];
        if (edge) sw.style.boxShadow = 'inset 0 0 0 1.5px ' + edge;
      }
      info.appendChild(sw);
      var txt = el('div', 'txt');
      txt.appendChild(el('div', 'nm', it.name));
      txt.appendChild(el('div', 'lv', active ? 'Выбрано' : owned ? 'Куплено' : 'Не куплено'));
      info.appendChild(txt);
      var btn = el('button', 'buy', active ? 'Выбрано' : owned ? 'Выбрать' : fmt(it.price) + ' мон.');
      btn.type = 'button';
      if (active) {
        btn.disabled = true;
      } else if (owned) {
        btn.addEventListener('click', function () { sel[kind] = it.id; save(); renderShop(); });
      } else {
        btn.disabled = coins < it.price;
        btn.addEventListener('click', function () { buyCosmetic(kind, it); });
      }
      row.appendChild(info); row.appendChild(btn);
      shopList.appendChild(row);
    });
  }

  function buy(u) {
    var c = cost(u);
    if (coins < c || upg[u.id] >= u.max) return;
    coins -= c; upg[u.id]++;
    save(); updateHud(); renderShop();
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderShop() {
    shopCoins.textContent = fmt(coins);
    shopList.textContent = '';
    var tabBtns = shopTabs.querySelectorAll('.tab');
    for (var q = 0; q < tabBtns.length; q++) {
      tabBtns[q].classList.toggle('on', tabBtns[q].getAttribute('data-tab') === shopTab);
    }
    if (shopTab !== 'up') { renderCosmetics(shopTab); return; }
    UP.forEach(function (u) {
      var row = el('div', 'up');
      var info = el('div', 'info');
      info.appendChild(el('div', 'nm', u.name));
      info.appendChild(el('div', 'lv', u.lvl()));
      var maxed = upg[u.id] >= u.max;
      info.appendChild(el('div', 'ds', maxed ? 'Достигнут максимум.' : u.desc()));
      var btn = el('button', 'buy', maxed ? 'Макс.' : fmt(cost(u)) + ' мон.');
      btn.type = 'button';
      btn.disabled = maxed || coins < cost(u);
      btn.addEventListener('click', function () { buy(u); });
      row.appendChild(info); row.appendChild(btn);
      shopList.appendChild(row);
    });
  }

  function show(name) {
    ['menu', 'over', 'pause', 'shop', 'lb'].forEach(function (k) {
      var n = document.getElementById(k);
      if (n) n.hidden = (k !== name);
    });
  }

  function setState(s) {
    state = s;
    pauseBtn.hidden = (s !== 'play');
    if (s === 'play' && document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }

  // Записывает итог попытки: рекорд, сохранение, отправка в рейтинг.
  function settle(floors) {
    var isNew = floors > best;
    if (isNew) {
      best = floors;
      try { localStorage.setItem('bashnya-best', String(best)); } catch (e) {}
    }
    updateHud();
    submitScore(floors);
    return isNew;
  }

  function gameOver() {
    setState('over'); cur = null;
    var floors = blocks.length - 1;
    var isNew = settle(floors);
    buzz(60);
    setTimeout(function () {
      if (state !== 'over') return;
      ovText.textContent = floors === 0 ? 'Мимо с первого раза. Бывает.' : 'Построено: ' + floors + ' ' + floorsWord(floors) + '. Заработано: ' + fmt(runCoins) + ' мон.';
      ovStats.textContent = 'Рекорд: ' + best + ' ' + floorsWord(best);
      ovRecord.hidden = !(isNew && floors > 0);
      show('over');
    }, 650);
  }

  function start() {
    reset();
    runCoins = 0;
    setState('play');
    show(null);
  }

  function pause() {
    if (state !== 'play') return;
    setState('pause');
    show('pause');
  }

  function resume() {
    if (state !== 'pause') return;
    setState('play');
    show(null);
  }

  function toMenu(finishRun) {
    if (finishRun) settle(blocks.length - 1);
    reset();
    setState('idle');
    show('menu');
  }

  function update(dt) {
    if (state === 'pause') return;
    if (cur && state !== 'over') {
      cur.x += cur.dir * speed(blocks.length) * dt;
      if (cur.x < 0) { cur.x = 0; cur.dir = 1; }
      if (cur.x + cur.w > WW) { cur.x = WW - cur.w; cur.dir = -1; }
    }
    for (var i = debris.length - 1; i >= 0; i--) {
      var d = debris[i];
      d.vy += 900 * dt; d.y += d.vy * dt; d.x += d.vx * dt; d.rot += d.vr * dt; d.a -= dt * 0.7;
      if (d.a <= 0) debris.splice(i, 1);
    }
    for (var j = pops.length - 1; j >= 0; j--) {
      pops[j].t += dt;
      if (pops[j].t > 1) pops.splice(j, 1);
    }
    var topY = groundY - blocks.length * BH;
    var target = Math.max(0, HW * 0.5 - topY);
    cam += (target - cam) * Math.min(1, dt * 5);
  }

  function drawBlock(x, y, w, hue) {
    var c = SKIN_MAP[sel.skin].c(hue);
    ctx.fillStyle = c[1];
    ctx.fillRect(x, y, w, BH - 2);
    ctx.fillStyle = c[0];
    ctx.fillRect(x, y, w, 5);
    ctx.fillStyle = c[2];
    ctx.fillRect(x, y + BH - 6, w, 4);
    if (c[3]) {
      ctx.strokeStyle = c[3];
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 0.75, y + 0.75, w - 1.5, BH - 3.5);
    }
  }

  function draw() {
    ctx.setTransform(DPR * S, 0, 0, DPR * S, 0, 0);
    BG_MAP[sel.bg].draw();

    if (groundY + cam < HW) {
      ctx.fillStyle = BG_MAP[sel.bg].ground;
      ctx.fillRect(-5, groundY + cam, WW + 10, HW);
    }

    for (var b = 0; b < blocks.length; b++) {
      var by = groundY - (b + 1) * BH + cam;
      if (by > HW || by < -BH) continue;
      drawBlock(blocks[b].x, by, blocks[b].w, blocks[b].hue);
    }

    if (cur) {
      var n = blocks.length, top = blocks[n - 1];
      var cy = groundY - (n + 1) * BH + cam;
      ctx.strokeStyle = 'rgba(255,255,255,0.14)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.moveTo(top.x, cy + BH); ctx.lineTo(top.x, cy - 40);
      ctx.moveTo(top.x + top.w, cy + BH); ctx.lineTo(top.x + top.w, cy - 40);
      ctx.stroke();
      ctx.setLineDash([]);
      drawBlock(cur.x, cy, cur.w, cur.hue);
    }

    for (var k = 0; k < debris.length; k++) {
      var d = debris[k];
      ctx.save();
      ctx.globalAlpha = Math.max(0, d.a);
      ctx.translate(d.x + d.w / 2, d.y + cam + BH / 2);
      ctx.rotate(d.rot);
      drawBlock(-d.w / 2, -BH / 2, d.w, d.hue);
      ctx.restore();
    }

    ctx.textAlign = 'center';
    ctx.font = '700 15px Unbounded, system-ui, sans-serif';
    for (var p = 0; p < pops.length; p++) {
      var pp = pops[p];
      ctx.globalAlpha = 1 - pp.t;
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(8,11,22,0.55)';
      ctx.strokeText(pp.text, WW / 2, pp.y + cam - 12 - pp.t * 28);
      ctx.fillStyle = '#ffc857';
      ctx.fillText(pp.text, WW / 2, pp.y + cam - 12 - pp.t * 28);
    }
    ctx.globalAlpha = 1;
  }

  function loop(t) {
    var dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    clock += dt;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  stage.addEventListener('pointerdown', function (e) {
    if (state === 'play') { e.preventDefault(); drop(); }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.code === 'Space' || e.code === 'ArrowDown') && state === 'play') { e.preventDefault(); drop(); }
    if (e.code === 'Escape') {
      if (state === 'play') pause();
      else if (state === 'pause') resume();
    }
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); });
  playBtn.addEventListener('click', start);
  againBtn.addEventListener('click', start);
  pauseBtn.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
  pauseBtn.addEventListener('click', pause);
  resumeBtn.addEventListener('click', resume);
  pauseMenuBtn.addEventListener('click', function () { toMenu(true); });
  overMenuBtn.addEventListener('click', function () { toMenu(false); });
  shopTabs.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('.tab') : null;
    if (!t) return;
    shopTab = t.getAttribute('data-tab');
    renderShop();
  });
  var shopFrom = 'menu';
  function openShop(from) {
    shopFrom = from;
    renderShop();
    show('shop');
  }
  shopBtn.addEventListener('click', function () { openShop('menu'); });
  overShopBtn.addEventListener('click', function () { openShop('over'); });
  shopBack.addEventListener('click', function () { show(shopFrom); });
  lbBtn.addEventListener('click', function () {
    refreshBoard();
    nickInput.value = nick;
    show('lb');
  });
  lbBack.addEventListener('click', function () { show('menu'); });
  nickInput.addEventListener('change', function () {
    nick = cleanName(nickInput.value);
    nickInput.value = nick;
    try { localStorage.setItem('bashnya-name', nick); } catch (e) {}
    if (lastSent > 0) sendBest(lastSent);
  });
  lbRefresh.addEventListener('click', refreshBoard);

  // Кнопка «Назад» на Android (плагин @capacitor/app); в браузере этого нет.
  function onBack() {
    if (state === 'play') pause();
    else if (state === 'pause') resume();
    else if (state === 'over') toMenu(false);
    else if (!document.getElementById('shop').hidden) show(shopFrom);
    else if (!lb.hidden) show('menu');
    else {
      var A = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
      if (A && A.exitApp) A.exitApp();
    }
  }
  try {
    var CapApp = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (CapApp && CapApp.addListener) CapApp.addListener('backButton', onBack);
  } catch (e) {}
  window.addEventListener('resize', resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);

  resize();
  reset();
  submitScore(0);
  requestAnimationFrame(function (t) { last = t; requestAnimationFrame(loop); });
})();
