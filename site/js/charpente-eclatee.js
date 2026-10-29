/* Charpente éclatée : vue isométrique d'une charpente traditionnelle qui s'assemble au défilement.
   Aucune dépendance. Les pièces sont des poutres (boîtes orientées) projetées en isométrie ;
   l'explosion est une simple translation 3D par pièce, donc une translation 2D du groupe SVG. */
(function () {
  'use strict';
  var racine = document.querySelector('[data-charpente]');
  if (!racine) return;
  var svg = racine.querySelector('svg.charpente-dessin');
  var piste = racine.querySelector('.eclatee-piste');
  var colle = racine.querySelector('.eclatee-colle');
  var etapes = Array.prototype.slice.call(racine.querySelectorAll('[data-etape]'));
  var NS = 'http://www.w3.org/2000/svg';
  var mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mini moteur isométrique ---------- */
  var ECH = 60, C30 = Math.sqrt(3) / 2, S30 = 0.5;
  function proj(p) { return [(p[0] - p[1]) * C30 * ECH, ((p[0] + p[1]) * S30 - p[2]) * ECH]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(a) { var l = Math.sqrt(dot(a, a)); return [a[0] / l, a[1] / l, a[2] / l]; }
  var VUE = norm([1, 1, 1]), LUMIERE = norm([0.25, 0.5, 0.83]);

  var TEINTES = {
    ferme:   { clair: [224, 185, 138], sombre: [104, 66, 34] },
    panne:   { clair: [230, 197, 156], sombre: [122, 82, 48] },
    chevron: { clair: [238, 216, 184], sombre: [142, 106, 71] }
  };
  function couleur(teinte, k) {
    var t = 0.2 + 0.8 * Math.max(0, Math.min(1, k)), c = TEINTES[teinte];
    return 'rgb(' + [0, 1, 2].map(function (i) { return Math.round(c.sombre[i] + (c.clair[i] - c.sombre[i]) * t); }).join(',') + ')';
  }

  /* Une poutre : axe A→B, largeur w centrée sur la direction u, hauteur h vers le haut (v = u ∧ axe). */
  function poutre(def) {
    var A = def.A, u = norm(def.u), AB = sub(def.B, A), L = Math.sqrt(dot(AB, AB)), axe = mul(AB, 1 / L);
    var v = cross(u, axe);
    if (v[2] < -1e-9 || (Math.abs(v[2]) < 1e-9 && v[1] < 0)) v = mul(v, -1);
    v = norm(v);
    var P = [];
    for (var t = 0; t < 2; t++) for (var a = 0; a < 2; a++) for (var b = 0; b < 2; b++)
      P.push(add(add(add(A, mul(axe, t * L)), mul(u, (a ? 0.5 : -0.5) * def.w)), mul(v, b * def.h)));
    var faces = [
      { i: [0, 1, 3, 2], n: mul(axe, -1) }, { i: [4, 5, 7, 6], n: axe },
      { i: [0, 1, 5, 4], n: mul(u, -1) },   { i: [2, 3, 7, 6], n: u },
      { i: [0, 2, 6, 4], n: mul(v, -1) },   { i: [1, 3, 7, 5], n: v }
    ];
    var g = document.createElementNS(NS, 'g');
    faces.forEach(function (f) {
      if (dot(f.n, VUE) <= 0.02) return;
      var d = f.i.map(function (k, j) { var q = proj(P[k]); return (j ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('') + 'Z';
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', couleur(def.teinte, dot(f.n, LUMIERE)));
      g.appendChild(path);
    });
    var centre = mul(P.reduce(add, [0, 0, 0]), 1 / 8);
    return { g: g, def: def, sommets: P, profondeur: centre[0] + centre[1] + centre[2] };
  }

  /* ---------- la charpente (mètres) : 2 fermes, 5 pannes, 24 chevrons, pente 3/4 ---------- */
  var defs = [];
  function hautArba(y) { var yy = y <= 4 ? y : 8 - y; return 0.67 + 0.75 * (yy - 0.15); }      /* dessus des arbalétriers */
  function ligneChevron(y) { return 0.92 + 0.75 * (y - 0.15); }                                  /* dessous des chevrons, versant gauche */

  [0, 6].forEach(function (xf, n) {
    var ferme = { dec: [n ? 1.2 : -1.2, 0, -0.5], fen: [0.42, 0.56] };   /* la ferme assemblée est ensuite levée sur les murs */
    var F = 'ferme';
    defs.push({ A: [xf, 0, 0],        B: [xf, 8, 0],          u: [1, 0, 0], w: 0.22, h: 0.32, teinte: F, dec: [0, 0, -1.0],   fen: [0.00, 0.20], ferme: ferme }); /* entrait */
    defs.push({ A: [xf, 3.89, 0.9],   B: [xf, 2.6, 2.16],     u: [1, 0, 0], w: 0.16, h: 0.16, teinte: F, dec: [0, -0.45, -0.3], fen: [0.30, 0.46], ferme: ferme }); /* contrefiche G */
    defs.push({ A: [xf, 4.11, 0.9],   B: [xf, 5.4, 2.16],     u: [1, 0, 0], w: 0.16, h: 0.16, teinte: F, dec: [0, 0.45, -0.3],  fen: [0.30, 0.46], ferme: ferme }); /* contrefiche D */
    defs.push({ A: [xf, 0.15, 0.32],  B: [xf, 3.89, 3.125],   u: [1, 0, 0], w: 0.22, h: 0.28, teinte: F, dec: [0, -0.8, 0.35], fen: [0.10, 0.32], ferme: ferme }); /* arbalétrier G */
    defs.push({ A: [xf, 7.85, 0.32],  B: [xf, 4.11, 3.125],   u: [1, 0, 0], w: 0.22, h: 0.28, teinte: F, dec: [0, 0.8, 0.35],  fen: [0.10, 0.32], ferme: ferme }); /* arbalétrier D */
    defs.push({ A: [xf, 3.89, 0.32],  B: [xf, 3.89, 3.5575],  u: [1, 0, 0], w: 0.22, h: 0.22, teinte: F, dec: [0, 0, 1.0],    fen: [0.22, 0.40], ferme: ferme }); /* poinçon */
  });
  [[0.3, [0, -0.7, 1.3], [0.54, 0.68]], [2.1, [0, -0.4, 1.7], [0.60, 0.74]], [4, [0, 0, 2.1], [0.66, 0.80]],
   [5.9, [0, 0.4, 1.7], [0.60, 0.74]], [7.7, [0, 0.7, 1.3], [0.54, 0.68]]].forEach(function (p) {
    defs.push({ A: [-0.6, p[0], hautArba(p[0])], B: [6.6, p[0], hautArba(p[0])], u: [0, 1, 0], w: 0.22, h: 0.25, teinte: 'panne', dec: p[1], fen: p[2] });
  });
  var chevrons = [];
  for (var i = 0; i < 12; i++) {
    var xc = -0.3 + i * 0.6, t0 = 0.72 + i * 0.014, fen = [t0, t0 + 0.12];
    chevrons.push({ A: [xc, -0.5, ligneChevron(-0.5)], B: [xc, 4.12, ligneChevron(4.12)], u: [1, 0, 0], w: 0.08, h: 0.2, teinte: 'chevron', dec: [0, -0.8, 3.3], fen: fen });
    chevrons.push({ A: [xc, 8.5, ligneChevron(-0.5)],  B: [xc, 3.88, ligneChevron(4.12)], u: [1, 0, 0], w: 0.08, h: 0.2, teinte: 'chevron', dec: [0, 0.8, 3.3],  fen: fen });
  }

  /* ---------- construction du SVG ---------- */
  var pieces = defs.map(poutre);
  var pc = chevrons.map(poutre).sort(function (a, b) { return a.profondeur - b.profondeur; });
  pieces = pieces.concat(pc);

  var sol = document.createElementNS(NS, 'path');
  var coins = [[-0.75, -0.65, 0], [6.75, -0.65, 0], [6.75, 8.65, 0], [-0.75, 8.65, 0]].map(proj);
  sol.setAttribute('d', coins.map(function (q, j) { return (j ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('') + 'Z');
  sol.setAttribute('class', 'sol');
  svg.appendChild(sol);
  var calque = document.createElementNS(NS, 'g');
  calque.setAttribute('class', 'pieces');
  pieces.forEach(function (p) { calque.appendChild(p.g); });
  svg.appendChild(calque);

  /* Cadrages : vue éclatée (début) et vue assemblée (fin), interpolés au défilement. */
  function boite(eclate) {
    var xs = [], ys = [];
    pieces.forEach(function (p) {
      var off = [0, 0, 0];
      if (eclate) { off = add(off, p.def.dec); if (p.def.ferme) off = add(off, p.def.ferme.dec); }
      p.sommets.forEach(function (s) { var q = proj(add(s, off)); xs.push(q[0]); ys.push(q[1]); });
    });
    coins.forEach(function (q) { xs.push(q[0]); ys.push(q[1]); });
    var m = 14, x0 = Math.min.apply(null, xs) - m, y0 = Math.min.apply(null, ys) - m;
    return [x0, y0, Math.max.apply(null, xs) + m - x0, Math.max.apply(null, ys) + m - y0];
  }
  var boiteEcl = boite(true), boiteAss = boite(false);

  /* ---------- animation ---------- */
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function avancement(fen, p) { return ease(Math.max(0, Math.min(1, (p - fen[0]) / (fen[1] - fen[0])))); }
  var SEUILS = [0, 0.10, 0.22, 0.54, 0.72];
  var dernier = -1;

  function rendu(p) {
    if (p === dernier) return;
    dernier = p;
    pieces.forEach(function (pc) {
      var d = pc.def, off = mul(d.dec, 1 - avancement(d.fen, p));
      if (d.ferme) off = add(off, mul(d.ferme.dec, 1 - avancement(d.ferme.fen, p)));
      var q = proj(off);
      pc.g.setAttribute('transform', 'translate(' + q[0].toFixed(2) + ' ' + q[1].toFixed(2) + ')');
    });
    sol.style.opacity = (0.15 + 0.85 * avancement([0.40, 0.60], p)).toFixed(3);
    var k = ease(p), vb = [0, 1, 2, 3].map(function (i) { return (boiteEcl[i] + (boiteAss[i] - boiteEcl[i]) * k).toFixed(1); });
    svg.setAttribute('viewBox', vb.join(' '));
    var actif = 0;
    SEUILS.forEach(function (s, i) { if (p >= s) actif = i; });
    etapes.forEach(function (li, i) { li.classList.toggle('active', i === actif); li.classList.toggle('faite', i < actif); });
    racine.classList.toggle('assemblee', p >= 0.995);
  }

  /* Hauteur des barres collantes en haut de page (menu brun sur grand écran, en-tête sur mobile). */
  function hauteurNav() {
    var h = 0;
    ['.entete', '.nav'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el && getComputedStyle(el).position === 'sticky') h += el.offsetHeight;
    });
    return h;
  }
  function progression() {
    var r = piste.getBoundingClientRect(), total = r.height - colle.offsetHeight;
    if (total <= 0) return 1;
    return Math.max(0, Math.min(1, (hauteurNav() - r.top) / total));
  }

  if (mouvementReduit) {
    racine.classList.add('statique');
    rendu(1);
    return;
  }
  var demande = false;
  function planifie() {
    if (demande) return;
    demande = true;
    requestAnimationFrame(function () { demande = false; rendu(progression()); });
  }
  function mesure() { racine.style.setProperty('--haut-nav', hauteurNav() + 'px'); planifie(); }
  window.addEventListener('scroll', planifie, { passive: true });
  window.addEventListener('resize', mesure);
  window.addEventListener('load', mesure);
  mesure();
})();
