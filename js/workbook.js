/* ==============================================
   WORKBOOK.JS — Carnet de Campagne (support structure exportable)
   Compile, note et ordonne tout ce que l'etudiant a genere.
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  // Sections du carnet, dans l'ordre logique d'une campagne.
  var SECTIONS = [
    { id: 'execSummary', icon: '📌', title: 'Resume executif',
      hint: 'En 4-5 phrases : le produit, la cible, la promesse, l\'objectif de campagne.', phaseKey: null,
      starter: 'Notre produit [NOM] est un(e) [categorie] qui aide [cible] a [benefice principal].\nA la difference de [concurrents], nous proposons [differenciation].\nObjectif de la campagne : [ex. 5000 telechargements / 200 ventes au lancement].' },
    { id: 'p1', icon: '💡', title: 'Phase 1 — Ideation & Marche', phaseKey: 'phase1',
      hint: 'Synthetisez votre concept, votre persona et votre analyse de marche en un texte structure.',
      starter: 'CONCEPT : ...\nPERSONA CIBLE : [nom, age, profession], motive par ..., freine par ...\nMARCHE : 3 concurrents = ... ; tendances a surfer = ... ; notre positionnement = ...' },
    { id: 'p2', icon: '🎨', title: 'Phase 2 — Branding & Identite', phaseKey: 'phase2',
      hint: 'Presentez le nom, le logo, la palette et le ton de votre marque de facon coherente.',
      starter: 'NOM DE MARQUE : ... (pourquoi : ...)\nBASELINE : "..."\nLOGO : decrire le concept visuel\nPALETTE : 3 couleurs (hex)\nTON DE VOIX : 5 adjectifs' },
    { id: 'p3', icon: '📢', title: 'Phase 3 — Campagne Marketing', phaseKey: 'phase3',
      hint: 'Decrivez vos visuels, vos textes et votre plan media comme dans un vrai brief d\'agence.',
      starter: 'CONCEPT CREATIF : ...\n3 HEADLINES : 1) ... 2) ... 3) ...\nCANAUX & BUDGET : Meta % / Google % / Influence % / Email %\nKPIs : impressions, CTR, conversions, ROAS' },
    { id: 'p4', icon: '🚀', title: 'Phase 4 — Pitch & Lancement', phaseKey: 'phase4',
      hint: 'Resumez votre landing, votre video pitch et votre deck — preparez votre prise de parole.',
      starter: 'LANDING : sections cles (hero, preuve sociale, pricing, CTA)\nPITCH VIDEO (script 30s) : hook / probleme / solution / preuve / CTA\nDECK : plan en 10 slides' },
    { id: 'learnings', icon: '🎓', title: 'Apprentissages cles', phaseKey: null,
      hint: 'Qu\'avez-vous appris sur l\'IA generative et le marketing ? 3 a 5 points concrets.',
      starter: '1. ...\n2. ...\n3. ...\n(Astuce : cliquez sur "Importer mes reflexions" pour partir de vos notes.)' },
    { id: 'nextSteps', icon: '🧭', title: 'Prochaines etapes', phaseKey: null,
      hint: 'Si vous lanciez vraiment ce produit, quelles seraient vos 3 prochaines actions ?',
      starter: '1. ...\n2. ...\n3. ...' }
  ];

  function getWB() {
    var st = window.AIA.getState();
    if (!st.workbook) st.workbook = { fields: {}, finalized: {}, pinned: [] };
    if (!st.workbook.fields) st.workbook.fields = {};
    if (!st.workbook.finalized) st.workbook.finalized = {};
    if (!Array.isArray(st.workbook.pinned)) st.workbook.pinned = [];
    return st.workbook;
  }

  /* ===== Epinglage : centralise toute production (demo, asset, jeu) dans le Carnet ===== */
  // item = { kind, source, sourceLabel, title, content }
  function pinToCarnet(item) {
    var AIA = window.AIA;
    if (!item || (!item.content && !item.title)) return false;
    var wb = getWB();
    var key = (item.source || '') + '|' + (item.title || '') + '|' + (item.content || '').slice(0, 40);
    var exists = wb.pinned.some(function (p) { return p.key === key; });
    if (exists) { if (AIA.showToast) AIA.showToast('Deja epingle dans le Carnet', 'info'); return false; }
    wb.pinned.push({
      id: 'pin-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      key: key,
      kind: item.kind || 'note',
      source: item.source || '',
      sourceLabel: item.sourceLabel || 'Production',
      title: item.title || '',
      content: item.content || '',
      time: new Date().toISOString()
    });
    if (AIA.saveState) AIA.saveState();
    if (AIA.addXP) AIA.addXP(5, 'Production epinglee au Carnet');
    if (AIA.showToast) AIA.showToast('📌 Epingle au Carnet ! (+5 XP)', 'success');
    return true;
  }

  function removePinned(id) {
    var wb = getWB();
    wb.pinned = wb.pinned.filter(function (p) { return p.id !== id; });
    if (window.AIA.saveState) window.AIA.saveState();
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }
  function nl2br(s) { return escapeHtml(s).replace(/\n/g, '<br>'); }

  /* ===== Mise en forme légère (markdown-lite) : ## titres, - listes, **gras** ===== */
  function mdLite(s) {
    var rows = String(s || '').split(/\n/);
    var out = [], inList = false;
    function inline(t) { return escapeHtml(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'); }
    rows.forEach(function (ln) {
      var m;
      if ((m = ln.match(/^\s*#{1,6}\s+(.*)$/))) { if (inList) { out.push('</ul>'); inList = false; } out.push('<h4 style="margin:.6rem 0 .2rem;color:var(--red,#a71f28)">' + inline(m[1]) + '</h4>'); }
      else if ((m = ln.match(/^\s*[-•]\s+(.*)$/))) { if (!inList) { out.push('<ul style="margin:.2rem 0 .2rem 1.1rem">'); inList = true; } out.push('<li>' + inline(m[1]) + '</li>'); }
      else { if (inList) { out.push('</ul>'); inList = false; } out.push(ln.trim() === '' ? '<br>' : '<div>' + inline(ln) + '</div>'); }
    });
    if (inList) out.push('</ul>');
    return out.join('');
  }

  /* ===== Exemple « rempli » (démo EcoMush) par section, pour montrer le niveau attendu ===== */
  var CARNET_EXAMPLES = {
    execSummary: "EcoMush est un kit de culture de champignons gourmets bio qui aide les citadins foodies à récolter chez eux en 14 jours. À la différence de Prêt à Pousser, nous garantissons une récolte rapide et un emballage 100% compostable. Objectif : 120 ventes au lancement, ROAS > 2.5.",
    p1: "## Concept\nKit de champignons gourmets bio, récolte garantie en 14 jours.\n## Persona\nSarah, 32 ans, Lyon, foodie éco — motivée par sain + ludique, freinée par « trop compliqué ».\n## Marché\n3 concurrents (Prêt à Pousser, Radis & Co, La Boîte à Champignons) ; tendances DIY food + zéro-déchet ; **positionnement** : récolte 14j garantie, 100% compostable.",
    p2: "## Nom & baseline\n**EcoMush** — « Cultivez vos saveurs en 14 jours ».\n## Logo\nChampignon stylisé en feuille, flat.\n## Palette\n#2D5F3F / #F4E5BC / #D4624A.\n## Ton\nconvivial, expert, optimiste, ludique, sincère.",
    p3: "## Concept créatif\nÉmerveillement du vivant à la maison.\n## Headlines\n- Vos champignons gourmets, récoltés sur votre plan de travail\n- 14 jours pour épater vos invités\n## Plan média\nMeta 40% / Google 30% / Influence 20% / Email 10% — **ROAS > 2.5**.",
    p4: "## Landing\nHero promesse + preuve sociale (4.8/5) + 3 étapes + pricing + FAQ + CTA garanti.\n## Pitch vidéo (60s)\nhook → problème → solution → preuve → CTA.\n## Deck\n10 slides (problème → demande).",
    learnings: "- Un bon prompt = rôle + contexte + format + contraintes.\n- Le persona guide TOUTES les décisions créatives.\n- L'IA accélère, mais le tri humain et la cohérence de marque restent décisifs.",
    nextSteps: "- Produire la vraie landing (Framer) + tracking.\n- Tourner 3 vidéos UGC pour Meta.\n- Lancer une pré-commande pour valider la demande."
  };

  /* ===== P1 : Générateur de SITE VITRINE — un vrai landing HTML depuis la campagne ===== */
  function generateVitrineHTML() {
    var st = window.AIA.getState();
    var cd = st.campaignData || {};
    var theme = st.productTheme || {};
    function g(step, field) { return (cd[step] && cd[step][field] && String(cd[step][field]).trim()) || ''; }
    function lines(s) { return String(s || '').split(/\n+/).map(function (x) { return x.replace(/^\s*\d+[.)\-]\s*/, '').trim(); }).filter(Boolean); }
    var name = g('brand-name', 'finalName') || theme.name || 'Ma marque';
    var baseline = g('brand-name', 'baseline') || theme.tagline || '';
    var desc = g('product-idea', 'description') || theme.description || '';
    var positioning = g('market-analysis', 'positioning') || theme.usp || '';
    var heads = lines(g('copy', 'headlines'));
    var hero = heads[0] ? heads[0].replace(/[«»"]/g, '') : (baseline || name);
    var body = g('copy', 'bodyCopy') || desc;
    var ctaRaw = g('copy', 'ctas');
    var cta = ((ctaRaw.split(/[\/\n]|Secondaire|secondaire/)[0] || 'Découvrir').replace(/^Principal\s*:?\s*/i, '').replace(/[«»"]/g, '').trim()) || 'Découvrir';
    var feats = lines(g('product-idea', 'differentiation'));
    if (!feats.length) feats = lines(positioning).slice(0, 3);
    var persona = g('target-persona', 'personaName');
    var price = theme.price || '';
    var hex = (g('logo', 'palette').match(/#[0-9a-fA-F]{3,6}/g) || ['#1f6f54', '#e0653a', '#f4efe6']);
    var primary = hex[0] || '#1f6f54', accent = hex[1] || '#e0653a', soft = hex[2] || '#f4efe6';
    var esc = escapeHtml;
    var icons = ['✨', '⚡', '🌿'];
    var featCards = (feats.length ? feats : ['Qualité premium', 'Simple et rapide', 'Conçu pour vous']).slice(0, 3).map(function (f, i) {
      var parts = f.split(/[:\-—]/); var t = parts[0].trim(); var d = parts.slice(1).join(' ').trim();
      return '<div class="feat"><div class="feat-ic">' + icons[i % 3] + '</div><h3>' + esc(t) + '</h3>' + (d ? '<p>' + esc(d) + '</p>' : '') + '</div>';
    }).join('');
    return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>' + esc(name) + (baseline ? ' — ' + esc(baseline) : '') + '</title>' +
      '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap" rel="stylesheet">' +
      '<style>:root{--p:' + primary + ';--a:' + accent + ';--s:' + soft + '}' +
      '*{margin:0;padding:0;box-sizing:border-box}body{font-family:Montserrat,system-ui,sans-serif;color:#1c1c1c;line-height:1.6}.wrap{max-width:1080px;margin:0 auto;padding:0 24px}' +
      'header{display:flex;justify-content:space-between;align-items:center;padding:20px 0}.logo{font-weight:800;font-size:1.4rem;color:var(--p)}' +
      '.btn{display:inline-block;background:var(--p);color:#fff;padding:14px 28px;border-radius:999px;text-decoration:none;font-weight:600;border:none;cursor:pointer}' +
      '.hero{background:linear-gradient(135deg,var(--s),#fff);padding:80px 0;text-align:center}.hero h1{font-size:3rem;line-height:1.1;margin-bottom:18px}.hero p{font-size:1.2rem;max-width:660px;margin:0 auto 28px;color:#444}' +
      '.eyebrow{color:var(--a);font-weight:600;letter-spacing:.08em;text-transform:uppercase;font-size:.8rem;margin-bottom:12px}' +
      'section{padding:64px 0}.feats{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px}.feat{background:#fff;border:1px solid #eee;border-radius:16px;padding:28px;box-shadow:0 6px 24px rgba(0,0,0,.04)}.feat-ic{font-size:2rem}.feat h3{margin:10px 0 6px;font-size:1.15rem}.feat p{color:#555;font-size:.95rem}' +
      '.h2{font-size:2rem;text-align:center;margin-bottom:36px}.proof{text-align:center}.stars{color:var(--a);font-size:1.4rem}' +
      '.price{text-align:center;background:var(--s);border-radius:24px;padding:48px}.price .amt{font-size:2.6rem;font-weight:800;color:var(--p);margin:10px 0}' +
      '.band{background:var(--p);color:#fff;text-align:center;border-radius:24px;padding:56px 24px}.band h2{font-size:2rem;margin-bottom:10px}.band .btn{background:#fff;color:var(--p);margin-top:18px}' +
      'footer{padding:40px 0;text-align:center;color:#888;font-size:.85rem}@media(max-width:600px){.hero h1{font-size:2.1rem}}</style></head><body>' +
      '<div class="wrap"><header><div class="logo">' + (theme.emoji || '◆') + ' ' + esc(name) + '</div><a class="btn" href="#cta">' + esc(cta) + '</a></header></div>' +
      '<div class="hero"><div class="wrap">' + (baseline ? '<div class="eyebrow">' + esc(baseline) + '</div>' : '') + '<h1>' + esc(hero) + '</h1><p>' + esc(body || positioning) + '</p><a class="btn" href="#cta">' + esc(cta) + '</a></div></div>' +
      '<section class="wrap"><div class="h2">Pourquoi ' + esc(name) + ' ?</div><div class="feats">' + featCards + '</div></section>' +
      (positioning ? '<section class="wrap proof"><div class="stars">★★★★★</div><p style="max-width:680px;margin:14px auto;font-size:1.2rem">' + esc(positioning) + '</p>' + (persona ? '<p style="color:#888">— ' + esc(persona) + '</p>' : '') + '</section>' : '') +
      (price ? '<section class="wrap"><div class="price"><div class="eyebrow">Offre de lancement</div><div class="amt">' + esc(price) + '</div><a class="btn" href="#cta">' + esc(cta) + '</a></div></section>' : '') +
      '<section class="wrap"><div class="band" id="cta"><h2>' + esc(hero) + '</h2><p>' + esc(baseline || positioning) + '</p><a class="btn" href="#">' + esc(cta) + '</a></div></section>' +
      '<footer>© ' + esc(name) + ' — Site vitrine généré dans AI Marketing Academy (IDRAC). Démo pédagogique.</footer></body></html>';
  }

  /* ===== Auto-evaluation d'une section du Carnet — 0-100 ===== */
  function scoreSectionText(text) {
    var t = (text || '').trim();
    if (!t) return 0;
    var s = 0;
    var words = t.split(/\s+/).length;
    s += words >= 140 ? 50 : words >= 80 ? 38 : words >= 45 ? 26 : words >= 20 ? 14 : 6; // longueur : 0-50
    var struct = 0;
    if (/\n/.test(t)) struct += 8;
    if (/(^|\n)\s*(\d+[\.\)]|[-•*])/.test(t)) struct += 9;
    if (t.indexOf(':') !== -1) struct += 8;
    s += Math.min(struct, 25);                                              // structure : 0-25
    var nums = (t.match(/\d+/g) || []).length;
    s += Math.min(nums * 5, 25);                                            // specificite : 0-25
    return Math.max(0, Math.min(100, s));
  }
  function wbScoreClass(score) { return score == null ? '' : score >= 80 ? 'sc-a' : score >= 60 ? 'sc-b' : score >= 40 ? 'sc-c' : 'sc-d'; }

  /* ===== Compile Business Game data for a phase ===== */
  function compilePhase(phaseKey) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var phase = AIA.PHASES_GUIDE && AIA.PHASES_GUIDE[phaseKey];
    if (!phase) return { html: '', filledCount: 0, totalFields: 0, assets: [] };
    var html = '', filled = 0, total = 0, assets = [];
    phase.steps.forEach(function (step) {
      var data = (st.campaignData && st.campaignData[step.id]) || {};
      var stepHtml = '';
      (step.fields || []).forEach(function (f) {
        total++;
        var val = data[f.name];
        if (val && String(val).trim()) {
          filled++;
          stepHtml += '<div class="wb-field"><div class="wb-field-label">' + escapeHtml(f.label) + '</div>' +
            '<div class="wb-field-val">' + nl2br(val) + '</div></div>';
        }
      });
      if (Array.isArray(data.assets)) {
        data.assets.forEach(function (a) { assets.push({ step: step.title, asset: a }); });
      }
      if (stepHtml) {
        html += '<div class="wb-step"><h4 class="wb-step-title">' + escapeHtml(step.title) + '</h4>' + stepHtml + '</div>';
      }
    });
    return { html: html, filledCount: filled, totalFields: total, assets: assets };
  }

  function allAssets() {
    var st = window.AIA.getState();
    var out = [];
    if (st.campaignData) {
      Object.keys(st.campaignData).forEach(function (sid) {
        var d = st.campaignData[sid];
        if (d && Array.isArray(d.assets)) d.assets.forEach(function (a) { out.push(a); });
      });
    }
    return out;
  }

  function compileReflections() {
    var st = window.AIA.getState();
    if (!st.reflections) return [];
    return Object.keys(st.reflections).map(function (k) {
      return { id: k, text: st.reflections[k].text };
    }).filter(function (x) { return x.text && x.text.trim(); });
  }

  /* ===== P2 : compile les Cas pratiques (exercices) faits dans le Carnet ===== */
  function compileExercises() {
    var st = window.AIA.getState();
    var ans = st.exerciseAnswers || {};
    var done = st.exercisesDone || {};
    var EX = window.AIA.EXERCISES || [];
    var out = [];
    EX.forEach(function (ex) {
      var a = ans[ex.id];
      if (a && String(a).trim()) out.push({ id: ex.id, title: ex.title, day: ex.day, answer: a, done: !!done[ex.id] });
    });
    return out;
  }

  function completion() {
    var wb = getWB();
    var done = SECTIONS.filter(function (s) { return wb.fields[s.id] && wb.fields[s.id].trim().length > 20; }).length;
    return { done: done, total: SECTIONS.length, pct: Math.round(done * 100 / SECTIONS.length) };
  }

  function saveField(sectionId, value) {
    var AIA = window.AIA;
    var wb = getWB();
    var wasEmpty = !wb.fields[sectionId] || wb.fields[sectionId].trim().length <= 20;
    wb.fields[sectionId] = value;
    if (AIA.saveState) AIA.saveState();
    var nowFilled = value && value.trim().length > 20;
    if (wasEmpty && nowFilled && AIA.addXP) AIA.addXP(10, 'Carnet : section redigee');
    var c = completion();
    if (c.pct === 100 && !wb.bonusAwarded) {
      wb.bonusAwarded = true;
      if (AIA.addXP) AIA.addXP(50, 'Carnet de campagne complet !');
      if (AIA.awardBadge) AIA.awardBadge('campaign-shipper');
      if (AIA.saveState) AIA.saveState();
    }
  }

  /* ===== RENDER ===== */
  function renderWorkbook(main) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var theme = st.productTheme;
    var wb = getWB();

    if (!theme) {
      main.innerHTML = '<div class="page-header"><h1>Carnet de <span class="gradient-text">Campagne</span></h1>' +
        '<p class="page-subtitle">Compilez et structurez tout votre travail en un support presentable</p></div>' +
        '<div class="glass-card" style="text-align:center;padding:3rem">' +
        '<div style="font-size:3rem;margin-bottom:1rem">📓</div>' +
        '<h3>Choisissez d\'abord votre projet</h3>' +
        '<p style="color:var(--text-muted);margin-bottom:1.5rem">Le carnet compile automatiquement le travail de votre Business Game. Commencez par selectionner votre produit fil rouge.</p>' +
        '<button class="btn-primary" data-navigate="business-game">🎯 Aller au Business Game</button>' +
        '</div>';
      return;
    }

    var c = completion();
    var user = st.user || {};
    var fullName = ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || user.name || 'Etudiant';
    var dateStr = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

    var html = '<div class="page-header"><h1>Carnet de <span class="gradient-text">Campagne</span></h1>' +
      '<p class="page-subtitle">Votre support structure : ' + theme.emoji + ' ' + escapeHtml(theme.name) + ' &bull; ' + c.done + '/' + c.total + ' sections (' + c.pct + '%)</p></div>' +

      '<div class="wb-toolbar glass-card">' +
      '<div class="wb-progress"><div class="progress-bar"><div class="progress-fill" style="width:' + c.pct + '%"></div></div></div>' +
      '<div class="wb-toolbar-actions">' +
      '<button class="btn-outline btn-sm" id="wb-toggle-preview">👁️ Apercu support</button>' +
      '<button class="btn-outline btn-sm" id="wb-print">🖨️ Exporter PDF</button>' +
      '<button class="btn-outline btn-sm" id="wb-export-json">📦 Export JSON</button>' +
      '<button class="btn-primary btn-sm" id="wb-vitrine">🌐 Générer le site vitrine</button>' +
      '<a class="btn-outline btn-sm" href="consignes.html" target="_blank" rel="noopener" style="text-decoration:none">📋 Attendus & criteres</a>' +
      '</div></div>' +

      '<p class="wb-help">💡 Chaque section recompile automatiquement ce que vous avez produit dans le Business Game. Redigez en dessous votre <strong>version structuree et soignee</strong> — c\'est votre livrable final (+10 XP par section, +50 XP carnet complet).</p>' +

      '<div id="wb-editor">';

    html += '<div class="wb-cover glass-card">' +
      '<div class="wb-cover-emoji">' + theme.emoji + '</div>' +
      '<div><div class="wb-cover-eyebrow">Carnet de campagne &bull; ' + escapeHtml(theme.category || '') + '</div>' +
      '<h2 class="wb-cover-title">' + escapeHtml(theme.name) + '</h2>' +
      '<div class="wb-cover-tagline">' + escapeHtml(theme.tagline || '') + '</div>' +
      '<div class="wb-cover-meta">Par <strong>' + escapeHtml(fullName) + '</strong> &bull; ' + dateStr + '</div></div>' +
      '</div>';

    SECTIONS.forEach(function (s) {
      var compiled = s.phaseKey ? compilePhase(s.phaseKey) : null;
      var fieldVal = wb.fields[s.id] || '';
      var isFinal = !!wb.finalized[s.id];
      var secScore = (wb.scores && wb.scores[s.id] != null) ? wb.scores[s.id] : null;
      html += '<div class="wb-section glass-card' + (isFinal ? ' finalized' : '') + '" data-section="' + s.id + '">' +
        '<div class="wb-section-head">' +
        '<h3>' + s.icon + ' ' + escapeHtml(s.title) + '</h3>' +
        (isFinal ? '<span class="wb-final-badge ' + wbScoreClass(secScore) + '">🔒 Valide' + (secScore != null ? ' &middot; ' + secScore + '/100' : '') + '</span>' : '') +
        '</div>';

      if (compiled && compiled.html) {
        html += '<details class="wb-compiled" open><summary>📥 Vos productions Business Game (' + compiled.filledCount + '/' + compiled.totalFields + ' champs remplis)</summary>' +
          compiled.html + '</details>';
      } else if (compiled) {
        html += '<div class="wb-empty-note">⚠️ Aucune donnee dans le Business Game pour cette phase. Completez les etapes correspondantes d\'abord.</div>';
      }

      if (CARNET_EXAMPLES[s.id]) {
        html += '<details class="wb-compiled"><summary>💡 Exemple rempli (demo EcoMush) — le niveau attendu</summary>' +
          '<div class="wb-field-val" style="padding:6px 2px">' + mdLite(CARNET_EXAMPLES[s.id]) + '</div></details>';
      }

      if (isFinal) {
        html += '<div class="wb-redaction">' +
          '<label>✍️ Votre redaction (validee)</label>' +
          '<div class="wb-locked-text">' + (fieldVal ? mdLite(fieldVal) : '<em>(vide)</em>') + '</div>' +
          '<p class="wb-hint">🔒 Section validee definitivement' + (secScore != null ? ' (score ' + secScore + '/100)' : '') + '. Demandez au formateur pour la rouvrir.</p>' +
          '</div>';
      } else {
        html += '<div class="wb-redaction">' +
          '<label>✍️ Votre redaction structuree</label>' +
          '<p class="wb-hint"><strong>Consigne :</strong> ' + escapeHtml(s.hint) + ' &bull; <em>Mise en forme : <code>## titre</code>, <code>- liste</code>, <code>**gras**</code></em></p>' +
          '<textarea class="wb-textarea" data-section="' + s.id + '" data-starter="' + encodeURIComponent(s.starter || '') + '" rows="7" placeholder="' + escapeHtml(s.starter || 'Redigez ici votre version finale, claire et ordonnee...') + '">' + escapeHtml(fieldVal) + '</textarea>' +
          '<p class="wb-validate-note">⚠️ <strong>Valider definitivement</strong> note la section (auto-evaluation) et la verrouille comme rendu officiel (+ points/bonus selon la qualite).</p>' +
          '<div class="wb-section-actions">' +
          '<button class="btn-primary btn-sm wb-save" data-section="' + s.id + '">💾 Enregistrer brouillon</button>' +
          (s.starter ? '<button class="btn-ghost btn-sm wb-use-template" data-section="' + s.id + '">📝 Utiliser le modele</button>' : '') +
          '<button class="btn-outline btn-sm wb-finalize" data-section="' + s.id + '">🔒 Valider definitivement</button>' +
          (s.id === 'learnings' ? '<button class="btn-ghost btn-sm" id="wb-import-reflections">↧ Importer mes reflexions</button>' : '') +
          '</div>' +
          '</div>';
      }
      html += '</div>';
    });

    var exos = compileExercises();
    if (exos.length) {
      html += '<div class="wb-section glass-card"><div class="wb-section-head"><h3>🎯 Cas pratiques realises (' + exos.length + ')</h3></div>' +
        '<p class="wb-hint">Vos reponses aux cas pratiques de l\'Arene, compilees automatiquement.</p>';
      exos.forEach(function (e) {
        html += '<div class="wb-field"><div class="wb-field-label">Jour ' + e.day + ' — ' + escapeHtml(e.title) + (e.done ? ' ✅' : '') + '</div><div class="wb-field-val">' + nl2br(e.answer) + '</div></div>';
      });
      html += '</div>';
    }

    var assets = allAssets();
    html += '<div class="wb-section glass-card"><div class="wb-section-head"><h3>🖼️ Galerie d\'assets generes</h3></div>';
    if (assets.length) {
      html += '<div class="wb-assets">' + assets.map(function (a) {
        var url = a.url || a;
        var label = a.label || a.name || 'Asset';
        var isImg = /\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/i.test(url);
        return '<div class="wb-asset">' + (isImg ? '<img src="' + escapeHtml(url) + '" alt="' + escapeHtml(label) + '">' : '<div class="wb-asset-link">🔗</div>') +
          '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener">' + escapeHtml(label) + '</a></div>';
      }).join('') + '</div>';
    } else {
      html += '<div class="wb-empty-note">Aucun asset attache pour le moment. Ajoutez-en depuis les etapes du Business Game (boutons d\'upload / lien).</div>';
    }
    html += '</div>';

    // Productions epinglees (depuis les demos, le jeu, etc.)
    html += renderPinnedSection(wb);

    html += '</div>';

    main.innerHTML = html;
    wireWorkbook(main);
  }

  function renderPinnedSection(wb) {
    var pins = wb.pinned || [];
    var sectionOptions = SECTIONS.map(function (s) {
      return '<option value="' + s.id + '">' + escapeHtml(s.title) + '</option>';
    }).join('');
    var h = '<div class="wb-section glass-card"><div class="wb-section-head"><h3>📌 Productions epinglees</h3>' +
      '<span class="wb-pin-count">' + pins.length + '</span></div>' +
      '<p class="wb-hint">Tout ce que vous avez epingle depuis les <strong>demos IA</strong> et le <strong>Business Game</strong>. Reutilisez-le dans vos sections.</p>';
    if (!pins.length) {
      h += '<div class="wb-empty-note">Rien d\'epingle pour le moment. Dans une demo IA, cliquez sur <strong>📌 Epingler au Carnet</strong> pour sauvegarder un resultat ici.</div>';
    } else {
      h += '<div class="wb-pins">';
      // Plus recent en premier
      pins.slice().reverse().forEach(function (p) {
        h += '<div class="wb-pin" data-pin-id="' + p.id + '">' +
          '<div class="wb-pin-head">' +
          '<span class="wb-pin-source">' + escapeHtml(p.sourceLabel || 'Production') + '</span>' +
          '<button class="wb-pin-remove" data-pin-remove="' + p.id + '" title="Retirer">✕</button>' +
          '</div>' +
          (p.title ? '<div class="wb-pin-title">' + escapeHtml(p.title) + '</div>' : '') +
          '<div class="wb-pin-content">' + nl2br(p.content || '') + '</div>' +
          '<div class="wb-pin-actions">' +
          '<select class="wb-pin-target" data-pin-target="' + p.id + '">' + sectionOptions + '</select>' +
          '<button class="btn-ghost btn-sm wb-pin-insert" data-pin-insert="' + p.id + '">↳ Inserer dans la section</button>' +
          '</div>' +
          '</div>';
      });
      h += '</div>';
    }
    h += '</div>';
    return h;
  }

  function wireWorkbook(main) {
    var AIA = window.AIA;

    main.querySelectorAll('.wb-save').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-section');
        var ta = main.querySelector('.wb-textarea[data-section="' + id + '"]');
        if (!ta) return;
        if (ta.value.trim().length < 20) { AIA.showToast('Redigez au moins 20 caracteres', 'warning'); return; }
        saveField(id, ta.value);
        AIA.showToast('Section enregistree', 'success');
        renderWorkbook(main);
      });
    });

    main.querySelectorAll('.wb-textarea').forEach(function (ta) {
      ta.addEventListener('blur', function () {
        var id = this.getAttribute('data-section');
        if (this.value.trim().length >= 20) saveField(id, this.value);
      });
    });

    main.querySelectorAll('.wb-finalize').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-section');
        var wb = getWB();
        var ta = main.querySelector('.wb-textarea[data-section="' + id + '"]');
        if (!ta || ta.value.trim().length < 20) { AIA.showToast('Redigez au moins 20 caracteres avant de valider', 'warning'); return; }
        if (!confirm('Valider DEFINITIVEMENT cette section ? Elle sera notee puis verrouillee comme rendu officiel (le formateur pourra la rouvrir).')) return;
        saveField(id, ta.value);
        var sc = scoreSectionText(ta.value);
        wb.scores = wb.scores || {};
        wb.scores[id] = sc;
        wb.finalized[id] = true;
        var bonus = sc >= 80 ? 15 : sc >= 60 ? 10 : sc >= 40 ? 5 : 0;
        if (AIA.addXP) AIA.addXP(10 + bonus, 'Carnet : section validee (' + sc + '/100)');
        if (AIA.saveState) AIA.saveState();
        AIA.showToast('🔒 Section validee ! Score ' + sc + '/100 — +' + (10 + bonus) + ' XP', 'success');
        renderWorkbook(main);
      });
    });

    main.querySelectorAll('.wb-use-template').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-section');
        var ta = main.querySelector('.wb-textarea[data-section="' + id + '"]');
        if (!ta) return;
        var starter = decodeURIComponent(ta.getAttribute('data-starter') || '');
        if (ta.value.trim() && !confirm('Remplacer le contenu actuel par le modele ?')) return;
        ta.value = starter;
        ta.focus();
        AIA.showToast('Modele insere — completez-le avec vos infos', 'info');
      });
    });

    var importBtn = document.getElementById('wb-import-reflections');
    if (importBtn) importBtn.addEventListener('click', function () {
      var refs = compileReflections();
      if (!refs.length) { AIA.showToast('Aucune reflexion ecrite a importer', 'info'); return; }
      var ta = main.querySelector('.wb-textarea[data-section="learnings"]');
      var compiled = refs.map(function (r, i) { return (i + 1) + '. ' + r.text; }).join('\n');
      ta.value = (ta.value ? ta.value + '\n' : '') + compiled;
      saveField('learnings', ta.value);
      AIA.showToast(refs.length + ' reflexion(s) importee(s)', 'success');
    });

    var togglePreview = document.getElementById('wb-toggle-preview');
    if (togglePreview) togglePreview.addEventListener('click', function () { renderPreview(main); });

    var printBtn = document.getElementById('wb-print');
    if (printBtn) printBtn.addEventListener('click', function () {
      renderPreview(main, true);
      setTimeout(function () { window.print(); }, 400);
    });

    var exportBtn = document.getElementById('wb-export-json');
    if (exportBtn) exportBtn.addEventListener('click', function () {
      var st = AIA.getState();
      var data = { theme: st.productTheme, workbook: getWB(), campaignData: st.campaignData, exercises: st.exerciseAnswers || {}, reflections: st.reflections || {}, exportedAt: new Date().toISOString() };
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'carnet-' + (st.productTheme ? st.productTheme.id : 'campagne') + '.json';
      a.click(); URL.revokeObjectURL(url);
      AIA.showToast('Carnet exporte', 'success');
    });

    var vitrineBtn = document.getElementById('wb-vitrine');
    if (vitrineBtn) vitrineBtn.addEventListener('click', function () {
      var st = AIA.getState();
      if (!st.campaignData || !st.campaignData['brand-name'] || !((st.campaignData['brand-name'].finalName) || '').trim()) {
        AIA.showToast('Renseigne au moins le nom de marque (Business Game, Phase 2) pour generer la vitrine', 'warning');
        return;
      }
      var htmlStr = generateVitrineHTML();
      var blob = new Blob([htmlStr], { type: 'text/html;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      var a = document.createElement('a');
      a.href = url; a.download = 'site-vitrine-' + (st.productTheme ? st.productTheme.id : 'campagne') + '.html';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
      st.vitrineGenerated = true; if (AIA.saveState) AIA.saveState();
      AIA.showToast('Site vitrine genere : apercu ouvert + telecharge (.html). Affine-le ensuite dans Framer / Gamma / Claude.', 'success');
    });

    // Productions epinglees : retirer
    main.querySelectorAll('.wb-pin-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        removePinned(this.getAttribute('data-pin-remove'));
        AIA.showToast('Epingle retire', 'info');
        renderWorkbook(main);
      });
    });

    // Productions epinglees : inserer dans une section de redaction
    main.querySelectorAll('.wb-pin-insert').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pinId = this.getAttribute('data-pin-insert');
        var wb = getWB();
        var pin = wb.pinned.filter(function (p) { return p.id === pinId; })[0];
        if (!pin) return;
        var sel = main.querySelector('.wb-pin-target[data-pin-target="' + pinId + '"]');
        var targetId = sel ? sel.value : 'execSummary';
        var ta = main.querySelector('.wb-textarea[data-section="' + targetId + '"]');
        if (!ta) return;
        var addition = (pin.title ? pin.title + '\n' : '') + (pin.content || '');
        ta.value = (ta.value ? ta.value + '\n\n' : '') + addition;
        saveField(targetId, ta.value);
        ta.scrollIntoView({ behavior: 'smooth', block: 'center' });
        ta.style.transition = 'box-shadow 0.5s';
        ta.style.boxShadow = '0 0 20px rgba(245,183,49,0.6)';
        setTimeout(function () { ta.style.boxShadow = ''; }, 1800);
        AIA.showToast('Insere dans la section', 'success');
      });
    });
  }

  /* ===== PREVIEW (clean printable support) ===== */
  function renderPreview(main, forPrint) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var theme = st.productTheme || {};
    var wb = getWB();
    var user = st.user || {};
    var fullName = ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || user.name || 'Etudiant';
    var dateStr = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

    var doc = '<div class="wb-doc" id="wb-doc">' +
      '<div class="wb-doc-cover">' +
      '<div class="wb-doc-logo">IDRAC &bull; AI Marketing Academy</div>' +
      '<div class="wb-doc-emoji">' + (theme.emoji || '🎯') + '</div>' +
      '<h1 class="wb-doc-title">' + escapeHtml(theme.name || 'Campagne') + '</h1>' +
      '<div class="wb-doc-tagline">' + escapeHtml(theme.tagline || '') + '</div>' +
      '<div class="wb-doc-author">Carnet de campagne par <strong>' + escapeHtml(fullName) + '</strong></div>' +
      '<div class="wb-doc-date">' + dateStr + '</div>' +
      '</div>';

    SECTIONS.forEach(function (s) {
      var val = wb.fields[s.id];
      var compiled = s.phaseKey ? compilePhase(s.phaseKey) : null;
      if (!val && !(compiled && compiled.html)) return;
      doc += '<div class="wb-doc-section"><h2>' + s.icon + ' ' + escapeHtml(s.title) + '</h2>';
      if (val) doc += '<div class="wb-doc-text">' + mdLite(val) + '</div>';
      if (compiled && compiled.html && !val) doc += '<div class="wb-doc-compiled">' + compiled.html + '</div>';
      doc += '</div>';
    });

    var assets = allAssets();
    if (assets.length) {
      doc += '<div class="wb-doc-section"><h2>🖼️ Assets</h2><div class="wb-assets">' +
        assets.map(function (a) {
          var url = a.url || a; var label = a.label || a.name || 'Asset';
          var isImg = /\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/i.test(url);
          return '<div class="wb-asset">' + (isImg ? '<img src="' + escapeHtml(url) + '">' : '🔗 ') + '<a href="' + escapeHtml(url) + '" target="_blank">' + escapeHtml(label) + '</a></div>';
        }).join('') + '</div></div>';
    }
    var pins = wb.pinned || [];
    if (pins.length) {
      doc += '<div class="wb-doc-section"><h2>📌 Productions epinglees</h2>' +
        pins.map(function (p) {
          return '<div class="wb-doc-pin">' +
            '<div class="wb-doc-pin-src">' + escapeHtml(p.sourceLabel || 'Production') + (p.title ? ' — ' + escapeHtml(p.title) : '') + '</div>' +
            '<div class="wb-doc-text">' + nl2br(p.content || '') + '</div></div>';
        }).join('') + '</div>';
    }
    doc += '<div class="wb-doc-footer">Genere sur AI Marketing Academy &bull; IDRAC Business School &bull; ' + dateStr + '</div>';
    doc += '</div>';

    main.innerHTML = '<div class="page-header no-print"><h1>Apercu <span class="gradient-text">Support</span></h1>' +
      '<p class="page-subtitle">Voici votre carnet tel qu\'il sera exporte</p></div>' +
      '<div class="wb-preview-actions no-print">' +
      '<button class="btn-outline btn-sm" id="wb-back-edit">← Retour edition</button>' +
      '<button class="btn-primary btn-sm" id="wb-print2">🖨️ Imprimer / PDF</button>' +
      '</div>' + doc;

    var back = document.getElementById('wb-back-edit');
    if (back) back.addEventListener('click', function () { renderWorkbook(main); });
    var p2 = document.getElementById('wb-print2');
    if (p2) p2.addEventListener('click', function () { window.print(); });
  }

  window.AIA = window.AIA || {};
  window.AIA.renderWorkbook = renderWorkbook;
  window.AIA.WORKBOOK_SECTIONS = SECTIONS;
  window.AIA.pinToCarnet = pinToCarnet;
})();
