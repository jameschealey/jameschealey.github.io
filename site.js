(function () {

  // ---------- Card graphics: each one shows what the project did ----------
  function svg(inner, w) {
    return '<svg viewBox="0 0 ' + (w || 400) + ' 250" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' + inner + '</svg>';
  }
  function text(x, y, s, anchor, extra) {
    return '<text class="g-text" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'start') + '"' + (extra || '') + '>' + s + '</text>';
  }
  function person(x, footY) {
    return '<circle class="g-egg" cx="' + x + '" cy="' + (footY - 44) + '" r="8"/>' +
      '<rect class="g-egg" x="' + (x - 8) + '" y="' + (footY - 33) + '" width="16" height="33" rx="7"/>';
  }
  function star(cx, cy, R, r) {
    var p = [];
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R;
      p.push((cx + rad * Math.cos(a)).toFixed(1) + ',' + (cy + rad * Math.sin(a)).toFixed(1));
    }
    return p.join(' ');
  }

  var GRAPHICS = {
    // Floor safety re-platform: a controller chip whose nine blocks consolidate into one simpler block
    platform: function () {
      var s = '<circle class="g-shade pop" style="--o:0" cx="200" cy="125" r="112"/>';
      var pins = '';
      [165, 187, 209, 231].forEach(function (p) {
        pins += '<rect x="' + p + '" y="56" width="6" height="14" rx="2"/><rect x="' + p + '" y="180" width="6" height="14" rx="2"/>' +
          '<rect x="131" y="' + (p - 74) + '" width="14" height="6" rx="2"/><rect x="255" y="' + (p - 74) + '" width="14" height="6" rx="2"/>';
      });
      s += '<g class="pop g-egg" style="--o:1">' + pins + '</g>';
      s += '<rect class="g-shade2 pop" style="--o:2" x="145" y="70" width="110" height="110" rx="14"/>';
      for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) {
        var x = 159 + c * 30, y = 84 + r * 30;
        s += '<g class="pop" style="--o:' + (3 + r + c) + '"><rect class="g-egg merge-sq" style="--mx:' + (189 - x) + 'px;--my:' + (114 - y) + 'px" x="' + x + '" y="' + y + '" width="22" height="22" rx="4"/></g>';
      }
      s += '<circle class="merge-dot" cx="200" cy="125" r="7" fill="var(--c)"/>';
      return svg(s);
    },

    // Self-healing fleet: devices fault one at a time, a ring draws as each recovers, then it goes green
    heal: function () {
      var s = '<rect class="g-shade pop" style="--o:0" x="106" y="32" width="188" height="186" rx="20"/>';
      var order = [4, 0, 7, 2, 8, 1, 6, 3, 5], k = 0;
      for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) {
        var x = 146 + c * 54, y = 72 + r * 53, d = order[k++] + 's';
        s += '<g class="pop" style="--o:' + (1 + r + c) + '">' +
          '<circle class="dev-ring" style="--d:' + d + '" cx="' + x + '" cy="' + y + '" r="29" pathLength="100"/>' +
          '<rect class="g-egg" x="' + (x - 16) + '" y="' + (y - 20) + '" width="32" height="40" rx="8"/>' +
          '<circle class="dev-led" style="--d:' + d + '" cx="' + x + '" cy="' + (y - 7) + '" r="5" fill="#5fc27a"/>' +
          '<rect class="g-shade2" x="' + (x - 8) + '" y="' + (y + 7) + '" width="16" height="4" rx="2"/></g>';
      }
      return svg(s);
    },

    // Retrofit: sites across the network light up as crews finish them
    network: function () {
      var s = '';
      for (var r = 0; r < 5; r++) for (var c = 0; c < 11; c++) {
        s += '<circle class="site-dot pop" style="--o:' + (c + r) + ';--d:' + ((c + r) * 0.22).toFixed(2) + 's" cx="' + (70 + c * 26) + '" cy="' + (46 + r * 25) + '" r="8.5"/>';
      }
      s += text(70, 186, 'BUILDINGS RETROFITTED') + text(330, 186, '300', 'end');
      s += '<rect class="g-shade2" x="70" y="196" width="260" height="10" rx="5"/><rect class="g-egg progress" x="70" y="196" width="260" height="10" rx="5"/>';
      return svg(s);
    },

    // Europe: EU flag ring of stars around a small top-down gate into a robot area
    gate: function () {
      var cx = 200, cy = 118, s = '';
      for (var i = 0; i < 12; i++) {
        var a = -Math.PI / 2 + i * Math.PI / 6;
        s += '<polygon class="pop" style="--o:' + i + '" fill="#f7c948" points="' + star(cx + 90 * Math.cos(a), cy + 90 * Math.sin(a), 9, 3.8) + '"/>';
      }
      // Robot area above the fence, walkway below (kept well inside the ring of stars)
      s += '<rect class="pop" style="--o:2" x="150" y="76" width="100" height="42" rx="4" fill="rgba(0,0,0,.22)"/>';
      s += '<path class="pop" style="--o:3" d="M150 118H186M214 118H250" stroke="#f3efd4" stroke-width="3" stroke-dasharray="5 3"/>';
      function bot(x, y, cls) {
        return '<g class="' + cls + '"><rect class="g-egg" x="' + (x - 6.5) + '" y="' + (y - 6.5) + '" width="13" height="13" rx="2.5"/>' +
          '<circle class="eu-light" cx="' + x + '" cy="' + y + '" r="2.5" fill="#5fc27a"/></g>';
      }
      s += bot(157, 104, 'eu-bot-a') + bot(243, 90, 'eu-bot-b');
      s += '<g class="eu-person"><ellipse cx="200" cy="164" rx="7.2" ry="4.7" fill="#e0533f"/><circle cx="200" cy="163.3" r="3.5" fill="#f6b9a8"/></g>';
      s += '<g class="eu-gate" style="transform-origin:186px 118px"><rect x="186" y="115.8" width="28" height="4.4" rx="2.2" fill="#f3efd4"/>' +
        '<rect x="194" y="115.8" width="4.3" height="4.4" fill="#e0442f"/><rect x="204" y="115.8" width="4.3" height="4.4" fill="#e0442f"/></g>';
      s += '<circle cx="186" cy="118" r="3.6" fill="#f3efd4"/><circle cx="214" cy="118" r="3.6" fill="#f3efd4"/><circle class="eu-light" cx="186" cy="118" r="1.8" fill="#5fc27a"/>';
      s += text(200, 240, 'GATE ACCESS PILOT, EU', 'middle');
      return svg(s);
    },

    // Three.js simulation: an isometric floor where robots drive and one waits near a person
    sim: function () {
      var tw = 44, th = 22, cx = 250, cy = 34, N = 8;
      function P(gx, gy) { return [cx + (gx - gy) * tw / 2, cy + (gx + gy) * th / 2]; }
      function pts(list) { return list.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); }
      function cube(gx, gy, cls, light, lightCls) {
        var c = P(gx + 0.5, gy + 0.5), x = c[0], y = c[1], a = tw / 2 * 0.62, b = th / 2 * 0.62, h = 14;
        return '<g class="' + cls + '">' +
          '<polygon fill="#cfc9ad" points="' + pts([[x - a, y - h], [x, y - h + b], [x, y + b], [x - a, y]]) + '"/>' +
          '<polygon fill="#e4dec3" points="' + pts([[x, y - h + b], [x + a, y - h], [x + a, y], [x, y + b]]) + '"/>' +
          '<polygon class="g-egg" points="' + pts([[x, y - h - b], [x + a, y - h], [x, y - h + b], [x - a, y - h]]) + '"/>' +
          '<circle class="' + (lightCls || '') + '" cx="' + x + '" cy="' + (y - h) + '" r="3.2" fill="' + light + '"/></g>';
      }
      var s = '<polygon class="g-shade2 pop" style="--o:0" points="' + pts([P(0, 0), P(N, 0), P(N, N), P(0, N)]) + '"/>';
      var gl = '';
      for (var i = 1; i < N; i++) {
        var a1 = P(i, 0), b1 = P(i, N), c1 = P(0, i), d1 = P(N, i);
        gl += 'M' + a1 + 'L' + b1 + 'M' + c1 + 'L' + d1;
      }
      s += '<path class="pop" style="--o:1" d="' + gl + '" stroke="rgba(243,239,212,.14)" stroke-width="1"/>';
      var pc = P(2.5, 5.5), px = pc[0], py = pc[1];
      s += '<ellipse cx="' + px + '" cy="' + py + '" rx="64" ry="32" fill="rgba(243,239,212,.14)" stroke="#f3efd4" stroke-width="2" stroke-dasharray="6 6"/>';
      s += '<ellipse class="loop-ring" cx="' + px + '" cy="' + py + '" rx="40" ry="20" fill="none" stroke="#f3efd4" stroke-width="2"/>';
      s += cube(1, 1, 'iso-a', '#5fc27a') + cube(6, 0, 'iso-b', '#5fc27a') + cube(6, 5, 'iso-c', '#5fc27a') + cube(4, 7, '', '#f0a020');
      s += '<ellipse cx="' + px + '" cy="' + (py + 1) + '" rx="8" ry="4" fill="rgba(0,0,0,.3)"/>' +
        '<rect x="' + (px - 5) + '" y="' + (py - 24) + '" width="10" height="24" rx="5" fill="#e0533f"/>' +
        '<circle cx="' + px + '" cy="' + (py - 30) + '" r="5.5" fill="#e0533f"/>';
      s += cube(3, 5, '', '#e0442f', 'blink-red');
      s += text(510, 64, 'THREE.JS SAFETY SIMULATION');
      s += '<circle cx="516" cy="98" r="5" fill="#5fc27a"/>' + text(532, 102, 'ROBOT MOVING');
      s += '<circle cx="516" cy="124" r="5" fill="#f0a020"/>' + text(532, 128, 'ROBOT SLOWING');
      s += '<circle class="blink-red" cx="516" cy="150" r="5" fill="#e0442f"/>' + text(532, 154, 'ROBOT STOPPED');
      s += '<rect x="510" y="170" width="12" height="12" rx="2" fill="#e0533f"/>' + text(532, 180, 'PERSON');
      s += '<ellipse cx="516" cy="204" rx="10" ry="5" fill="none" stroke="#f3efd4" stroke-width="1.5" stroke-dasharray="3 3"/>' + text(532, 208, 'SAFETY ZONES');
      return svg(s, 800);
    },

    // Insurer app: store rating goes from 2.2 to 4.8
    stars: function () {
      var st = '';
      for (var i = 0; i < 5; i++) {
        var pts = star(168 + i * 16, 150, 6.5, 2.8);
        st += i < 2 ? '<polygon class="g-egg" points="' + pts + '"/>' : '<polygon class="star-on" style="--o:' + (i - 2) + '" points="' + pts + '"/>';
      }
      return svg(
        '<circle class="g-shade pop" style="--o:0" cx="200" cy="125" r="112"/>' +
        '<g class="pop" style="--o:1"><rect class="g-egg" x="148" y="26" width="104" height="198" rx="18"/>' +
        '<rect x="158" y="44" width="84" height="150" rx="6" fill="var(--c)"/>' +
        text(200, 80, 'RATING', 'middle') +
        '<text class="g-num rate-old" x="200" y="128" text-anchor="middle">2.2</text>' +
        '<text class="g-num rate-new" x="200" y="128" text-anchor="middle">4.8</text>' +
        st + '<rect class="g-shade2" x="186" y="206" width="28" height="6" rx="3"/></g>'
      );
    },

    // Backlog: four intake flows feed one backlog
    merge: function () {
      var ys = [50, 98, 146, 194], s = '';
      ys.forEach(function (y, i) {
        s += '<path class="pop" style="--o:' + i + '" d="M86 ' + y + 'L262 125" stroke="rgba(0,0,0,.28)" stroke-width="3"/>';
        s += '<rect class="g-egg pop" style="--o:' + i + '" x="62" y="' + (y - 12) + '" width="24" height="24" rx="3"/>';
      });
      s += '<g class="pop" style="--o:4"><rect class="g-egg" x="262" y="62" width="78" height="126" rx="6"/>';
      for (var k = 0; k < 5; k++) s += '<rect x="274" y="' + (76 + k * 22) + '" width="54" height="9" rx="4" fill="var(--c)" opacity=".55"/>';
      s += '</g>';
      ys.forEach(function (y, i) {
        s += '<circle class="g-egg loop-merge" style="--o:' + i + ';--mx:168px;--my:' + (125 - y) + 'px" cx="94" cy="' + y + '" r="7"/>';
      });
      s += text(62, 232, '4 INTAKE FLOWS') + text(301, 212, '1 BACKLOG', 'middle');
      return svg(s);
    },

    // ERP work across three regions
    regions: function () {
      var R = [[104, 78, 'NA'], [200, 56, 'EMEA'], [296, 78, 'APAC']], s = '';
      R.forEach(function (r, i) {
        var d = 'M200 166L' + r[0] + ' ' + r[1];
        s += '<path d="' + d + '" stroke="rgba(0,0,0,.26)" stroke-width="3"/><path class="trace long" style="--o:' + i + '" d="' + d + '"/>';
      });
      R.forEach(function (r, i) {
        s += '<g class="pop" style="--o:' + (i + 1) + '"><circle class="g-shade2" cx="' + r[0] + '" cy="' + r[1] + '" r="32"/>' + text(r[0], r[1] + 4, r[2], 'middle') + '</g>';
      });
      s += '<circle class="loop-ring" cx="200" cy="166" r="32" fill="none" stroke="#f3efd4" stroke-width="3"/>';
      s += '<g class="pop" style="--o:4"><circle class="g-egg" cx="200" cy="166" r="32"/>' + text(200, 170, 'ERP', 'middle', ' style="fill:var(--c)"') + '</g>';
      return svg(s);
    }
  };

  document.querySelectorAll('[data-graphic]').forEach(function (el) {
    var fn = GRAPHICS[el.getAttribute('data-graphic')];
    if (fn) el.innerHTML = fn();
  });

  // ---------- Header, smooth in-page scrolling, active nav ----------
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function headerOffset() { return (header ? header.offsetHeight : 0) + 16; }
  var scrollAnim = 0;
  function smoothScrollTo(y) {
    var startY = window.scrollY, dist = y - startY;
    var dur = Math.min(1100, Math.max(500, Math.abs(dist) * 0.4));
    var t0 = performance.now(), id = ++scrollAnim;
    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    (function frame(now) {
      if (id !== scrollAnim) return;
      var t = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, startY + dist * ease(t));
      if (t < 1) requestAnimationFrame(frame);
    })(t0);
  }
  ['wheel', 'touchstart', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, function () { scrollAnim++; }, { passive: true });
  });

  var onHome = location.pathname === '/' || /index\.html$/.test(location.pathname);
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var href = a.getAttribute('href');
    var hash = href.charAt(0) === '#' ? href : (onHome && href.indexOf('/#') === 0 ? href.slice(1) : null);
    if (!hash || hash.length < 2) return;
    var target = document.getElementById(hash.slice(1));
    if (!target) return;
    e.preventDefault();
    smoothScrollTo(Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset()));
    if (history.pushState) history.pushState(null, '', hash);
  });

  var toTop = document.querySelector('.to-top');
  if (toTop) {
    var showTop = function () { toTop.classList.toggle('show', window.scrollY > 0); };
    showTop();
    window.addEventListener('scroll', showTop, { passive: true });
    toTop.addEventListener('click', function () {
      smoothScrollTo(0);
      if (history.replaceState) history.replaceState(null, '', location.pathname);
    });
  }

  var navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  if (navLinks.length) {
    var spy = function () {
      var current = null;
      navLinks.forEach(function (a) {
        var sec = document.getElementById(a.getAttribute('href').slice(1));
        if (sec && sec.getBoundingClientRect().top - headerOffset() <= window.innerHeight * 0.35) current = a;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = navLinks[navLinks.length - 1];
      navLinks.forEach(function (a) { a.classList.toggle('active', a === current); });
    };
    spy();
    window.addEventListener('scroll', spy, { passive: true });
  }

  document.querySelectorAll('.grid').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i % 3); });
  });

  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    var start = performance.now(), dur = 1400;
    (function frame(now) {
      var t = Math.min(1, (now - start) / dur);
      el.textContent = pre + Math.round(end * (1 - Math.pow(1 - t, 3))).toLocaleString('en-US') + suf;
      if (t < 1) requestAnimationFrame(frame);
    })(start);
  }

  var revealEls = document.querySelectorAll('.reveal');
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (e.target.hasAttribute('data-count')) countUp(e.target);
        else e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    counters.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // ---------- Hero: robot floor ----------
  // The person wanders on their own, or follows the cursor while it's over the floor.
  // Robots slow down inside the outer zone, stop inside the inner zone, and the person can't walk through them.
  var floorEl = document.querySelector('.floor');
  if (!floorEl) return;
  var canvas = floorEl.querySelector('canvas');
  var statStop = floorEl.querySelector('[data-paused]');
  var statSlow = floorEl.querySelector('[data-slowed]');
  var ctx = canvas.getContext('2d');

  var C = { egg: '#f3efd4', navy: '#22405a', stop: '#ef6a52', slow: '#f0a020', go: '#4f9b62', fid: 'rgba(243,239,212,.28)', line: 'rgba(243,239,212,.07)' };
  var TARGET_CELL = 40;
  var DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  var W, H, cell, cols, rows, ox, oy;
  var robots = [], occ = {}, person, pointer = null, trail = [];
  var running = false, visible = true, last = 0, t = 0, statTimer = 0, lastProgress = 0;

  function key(x, y) { return x + ',' + y; }
  function center(cx, cy) { return { x: ox + (cx + 0.5) * cell, y: oy + (cy + 0.5) * cell }; }
  function stopR() { return cell * 1.35; }
  function slowR() { return cell * 3; }
  function bodyR() { return cell * 0.38 + 7; }

  // 1 outside the slow zone, easing down to 0.2 at the edge of the stop zone, 0 inside it
  function speedFactor(d) {
    var a = stopR(), b = slowR();
    if (d <= a) return 0;
    if (d >= b) return 1;
    return 0.2 + 0.8 * (d - a) / (b - a);
  }

  function init() {
    robots = []; occ = {};
    person = { x: W * 0.35, y: H * 0.55, tx: W * 0.6, ty: H * 0.4 };
    var n = Math.max(6, Math.round(cols * rows * 0.085)), tries = 0;
    while (robots.length < n && tries++ < 500) {
      var cx = Math.floor(Math.random() * cols), cy = Math.floor(Math.random() * rows);
      var c0 = center(cx, cy);
      if (occ[key(cx, cy)] || Math.hypot(c0.x - person.x, c0.y - person.y) < slowR()) continue;
      var r = { cx: cx, cy: cy, tx: cx, ty: cy, p: 0, dir: Math.floor(Math.random() * 4), speed: 1.5 + Math.random() * 0.8, state: 'go', hold: Math.random() * 1.5 };
      occ[key(cx, cy)] = r;
      robots.push(r);
    }
    trail = [];
  }

  function size() {
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    W = rect.width; H = rect.height;
    var nc = Math.max(6, Math.floor(W / TARGET_CELL)), nr = Math.max(6, Math.floor(H / TARGET_CELL));
    cell = Math.min(W / nc, H / nr);
    ox = (W - cell * nc) / 2; oy = (H - cell * nr) / 2;
    if (nc !== cols || nr !== rows || !person) { cols = nc; rows = nr; init(); }
  }

  function robotPos(r) {
    var a = center(r.cx, r.cy), b = center(r.tx, r.ty);
    return { x: a.x + (b.x - a.x) * r.p, y: a.y + (b.y - a.y) * r.p };
  }

  function newWanderTarget() {
    var pad = cell * 1.2;
    person.tx = pad + Math.random() * (W - pad * 2);
    person.ty = pad + Math.random() * (H - pad * 2);
    lastProgress = t;
  }

  // Push the person out of any robot they overlap, so they slide around robots instead of through them
  function collide() {
    for (var pass = 0; pass < 2; pass++) {
      robots.forEach(function (r) {
        var p = robotPos(r), dx = person.x - p.x, dy = person.y - p.y, d = Math.hypot(dx, dy), m = bodyR();
        if (d >= m) return;
        if (d < 0.001) { dx = 1; dy = 0; d = 1; }
        person.x = p.x + dx / d * m;
        person.y = p.y + dy / d * m;
      });
    }
    person.x = Math.max(8, Math.min(W - 8, person.x));
    person.y = Math.max(8, Math.min(H - 8, person.y));
  }

  function step(dt) {
    t += dt;
    if (!pointer && Math.hypot(person.tx - person.x, person.ty - person.y) < 6) newWanderTarget();
    var gx = pointer ? pointer.x : person.tx, gy = pointer ? pointer.y : person.ty;
    var dx = gx - person.x, dy = gy - person.y, dist = Math.hypot(dx, dy);
    var sp = (pointer ? 170 : 36) * dt;
    var bx = person.x, by = person.y;
    if (dist > 0.5) { person.x += dx / dist * Math.min(sp, dist); person.y += dy / dist * Math.min(sp, dist); }
    collide();
    // If wandering gets stuck against a robot, pick somewhere else to go
    if (Math.hypot(person.x - bx, person.y - by) > sp * 0.3 || dist < 6) lastProgress = t;
    else if (!pointer && t - lastProgress > 1.2) newWanderTarget();

    var lt = trail[trail.length - 1];
    if (!lt || Math.hypot(lt.x - person.x, lt.y - person.y) > 7) trail.push({ x: person.x, y: person.y, t: t });
    while (trail.length && t - trail[0].t > 2.2) trail.shift();

    robots.forEach(function (r) {
      var pos = robotPos(r);
      var f = speedFactor(Math.hypot(pos.x - person.x, pos.y - person.y));
      r.state = f === 0 ? 'stop' : f < 1 ? 'slow' : 'go';
      if (f === 0) return;
      if (r.tx !== r.cx || r.ty !== r.cy) {
        r.p += r.speed * f * dt;
        if (r.p >= 1) {
          delete occ[key(r.cx, r.cy)];
          r.cx = r.tx; r.cy = r.ty; r.p = 0;
          r.hold = Math.random() < 0.12 ? 0.4 + Math.random() * 0.9 : 0;
        }
        return;
      }
      if (r.hold > 0) { r.hold -= dt; return; }
      var order = [r.dir];
      if (Math.random() < 0.3) order.unshift((r.dir + (Math.random() < 0.5 ? 1 : 3)) % 4);
      order.push((r.dir + 1) % 4, (r.dir + 3) % 4, (r.dir + 2) % 4);
      for (var i = 0; i < order.length; i++) {
        var d = order[i], nx = r.cx + DIRS[d][0], ny = r.cy + DIRS[d][1];
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || occ[key(nx, ny)]) continue;
        var c = center(nx, ny);
        if (Math.hypot(c.x - person.x, c.y - person.y) < stopR() + cell * 0.3) continue;
        r.dir = d; r.tx = nx; r.ty = ny; r.p = 0;
        occ[key(nx, ny)] = r;
        return;
      }
    });
  }

  function roundRect(x, y, w, h, rad) {
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  function circle(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = C.line; ctx.lineWidth = 1;
    ctx.beginPath();
    for (var i = 0; i <= cols; i++) { ctx.moveTo(ox + i * cell, oy); ctx.lineTo(ox + i * cell, oy + rows * cell); }
    for (var j = 0; j <= rows; j++) { ctx.moveTo(ox, oy + j * cell); ctx.lineTo(ox + cols * cell, oy + j * cell); }
    ctx.stroke();
    ctx.fillStyle = C.fid;
    for (var a = 0; a < cols; a++) for (var b = 0; b < rows; b++) {
      var c = center(a, b); circle(c.x, c.y, 1.6); ctx.fill();
    }

    // Slow zone (amber, dashed) and stop zone (red) around the person
    var S = slowR(), R = stopR();
    ctx.fillStyle = 'rgba(240,160,32,.08)';
    circle(person.x, person.y, S); ctx.fill();
    ctx.save();
    ctx.setLineDash([5, 6]); ctx.lineDashOffset = -t * 12;
    ctx.strokeStyle = 'rgba(240,160,32,.6)'; ctx.lineWidth = 1.5;
    circle(person.x, person.y, S); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = 'rgba(239,106,82,.2)';
    circle(person.x, person.y, R); ctx.fill();
    ctx.strokeStyle = 'rgba(239,106,82,.85)'; ctx.lineWidth = 1.5;
    circle(person.x, person.y, R); ctx.stroke();
    var ph = (t % 2) / 2;
    ctx.strokeStyle = 'rgba(239,106,82,' + (0.6 * (1 - ph)).toFixed(3) + ')';
    ctx.lineWidth = 2;
    circle(person.x, person.y, R * (0.3 + 0.7 * ph)); ctx.stroke();

    trail.forEach(function (p) {
      var age = (t - p.t) / 2.2;
      ctx.fillStyle = 'rgba(239,106,82,' + (0.5 * (1 - age)).toFixed(3) + ')';
      circle(p.x, p.y, 1.8); ctx.fill();
    });

    var s = cell * 0.6;
    robots.forEach(function (r) {
      var p = robotPos(r), d = DIRS[r.dir];
      if (r.state !== 'go') {
        ctx.strokeStyle = r.state === 'stop' ? C.stop : C.slow; ctx.lineWidth = 2;
        roundRect(p.x - s / 2 - 4, p.y - s / 2 - 4, s + 8, s + 8, 6); ctx.stroke();
      }
      ctx.fillStyle = C.egg;
      roundRect(p.x - s / 2, p.y - s / 2, s, s, 4); ctx.fill();
      ctx.fillStyle = C.navy;
      circle(p.x + d[0] * s * 0.26, p.y + d[1] * s * 0.26, s * 0.1); ctx.fill();
      ctx.fillStyle = r.state === 'stop' ? C.stop : r.state === 'slow' ? C.slow : C.go;
      circle(p.x - d[0] * s * 0.18, p.y - d[1] * s * 0.18, s * 0.11); ctx.fill();
    });

    ctx.fillStyle = C.stop; ctx.strokeStyle = C.egg; ctx.lineWidth = 3;
    circle(person.x, person.y, 7); ctx.fill(); ctx.stroke();
  }

  function updateStat() {
    var stopped = 0, slowed = 0;
    robots.forEach(function (r) { if (r.state === 'stop') stopped++; else if (r.state === 'slow') slowed++; });
    if (statStop) statStop.textContent = stopped;
    if (statSlow) statSlow.textContent = slowed;
  }

  function loop(now) {
    if (!running) return;
    var dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    step(dt); draw();
    statTimer -= dt;
    if (statTimer <= 0) { statTimer = 0.25; updateStat(); }
    requestAnimationFrame(loop);
  }
  function start() { if (running) return; running = true; last = performance.now(); requestAnimationFrame(loop); }
  function stop() { running = false; }

  size();
  start();

  window.addEventListener('resize', size);
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (visible) start(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting;
      if (visible && !document.hidden) start(); else stop();
    }).observe(floorEl);
  }

  // Hovering takes control; leaving hands the person back to wandering
  var touchTimer = 0;
  function setPointer(e) {
    var rect = canvas.getBoundingClientRect();
    pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
  canvas.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') setPointer(e); });
  canvas.addEventListener('pointerdown', function (e) {
    setPointer(e);
    if (e.pointerType !== 'mouse') {
      clearTimeout(touchTimer);
      touchTimer = setTimeout(function () { pointer = null; newWanderTarget(); }, 3500);
    }
  });
  canvas.addEventListener('pointerleave', function (e) {
    if (e.pointerType === 'mouse') { pointer = null; newWanderTarget(); }
  });
})();
