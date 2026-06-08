/* ==============================================
   NOTEBOOK.JS — Notebook / Portfolio complet (lecture seule)
   Consolide TOUTES les realisations de l'etudiant :
   12 livrables (contenu reel + scores), 7 sections carnet, reflexions,
   demos, badges, XP. Imprimable / exportable. Vue formateur incluse.
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  function esc(t) { var d = document.createElement('div'); d.textContent = (t == null ? '' : String(t)); return d.innerHTML; }
  function nl2br(t) { return esc(t).replace(/\n/g, '<br>'); }
  function scClass(sc) { return sc >= 80 ? 'a' : sc >= 60 ? 'b' : sc >= 40 ? 'c' : 'd'; }

  var WB_TITLES = {
    execSummary: 'Resume executif', p1: 'Phase 1 — Ideation & Marche', p2: 'Phase 2 — Branding & Identite',
    p3: 'Phase 3 — Campagne Marketing', p4: 'Phase 4 — Pitch & Lancement', learnings: 'Apprentissages cles', nextSteps: 'Prochaines etapes'
  };
  var WB_ORDER = ['execSummary', 'p1', 'p2', 'p3', 'p4', 'learnings', 'nextSteps'];

  function brickCounts(s, PG) {
    var done = 0, total = 0;
    Object.keys(PG).forEach(function (pk) { PG[pk].steps.forEach(function (st) { total++; if (s.gameDeliverables && s.gameDeliverables[st.id]) done++; }); });
    return { done: done, total: total };
  }

  // Construit le HTML complet du notebook a partir d'un objet state (le sien ou celui d'un eleve).
  function buildNotebookHTML(s) {
    s = s || {};
    var A = window.AIA, PG = A.PHASES_GUIDE || {};
    var theme = s.productTheme || { emoji: '🎯', name: '(projet non choisi)', category: '', tagline: '' };
    var xpTotal = (s.xp && s.xp.total) || 0;
    var info = A.getLevelInfo ? A.getLevelInfo(xpTotal) : { level: '?', title: '' };
    var cd = s.campaignData || {}, gv = s.gameValidation || {};
    var bc = brickCounts(s, PG);
    var badges = s.badges || [];
    var SM = A.STEP_META || {}, ATL = A.ASSET_TYPE_LABELS || {};
    // Recap par type d'asset (mise en forme auto du projet)
    var typeCounts = {};
    Object.keys(PG).forEach(function (pk) {
      PG[pk].steps.forEach(function (stp) {
        var m = SM[stp.id] || {}; if (!m.type) return;
        var has = stp.fields.some(function (f) { return ((cd[stp.id] || {})[f.name] || '').trim(); });
        if (has) typeCounts[m.type] = (typeCounts[m.type] || 0) + 1;
      });
    });

    var html = '<div class="nb-cover">' +
      '<div class="nb-cover-emoji">' + theme.emoji + '</div>' +
      '<div class="nb-cover-info"><div class="nb-cover-cat">' + esc(theme.category) + ' &bull; Projet</div>' +
      '<h2 class="nb-cover-name">' + esc(theme.name) + '</h2>' +
      '<p class="nb-cover-tag">' + esc(theme.tagline) + '</p>' +
      '<div class="nb-cover-author">par <strong>' + esc((s.user && s.user.name) || '—') + '</strong></div></div></div>';

    html += '<div class="nb-stats">' +
      '<div class="nb-stat"><b>' + xpTotal + '</b><span>XP</span></div>' +
      '<div class="nb-stat"><b>' + info.level + '</b><span>Niveau</span></div>' +
      '<div class="nb-stat"><b>' + bc.done + '/' + bc.total + '</b><span>Livrables</span></div>' +
      '<div class="nb-stat"><b>' + badges.length + '</b><span>Badges</span></div></div>';

    // Recap visuel par type d'asset produit
    var tcKeys = Object.keys(typeCounts);
    if (tcKeys.length) {
      html += '<div class="nb-type-recap" style="display:flex;flex-wrap:wrap;gap:.4rem;margin:.2rem 0 1rem">' +
        tcKeys.map(function (k) { return '<span style="background:rgba(255,255,255,0.05);border:1px solid var(--border-glass);border-radius:999px;padding:.2rem .7rem;font-size:.8rem">' + (ATL[k] || k) + ' &times; ' + typeCounts[k] + '</span>'; }).join('') +
        '</div>';
    }

    // Livrables par phase (contenu reel)
    Object.keys(PG).forEach(function (pk) {
      var ph = PG[pk];
      html += '<section class="nb-phase"><h3 class="nb-phase-title">' + ph.icon + ' ' + esc(ph.title) + '</h3>';
      ph.steps.forEach(function (step) {
        var data = cd[step.id] || {}, v = gv[step.id] || {};
        var hasContent = step.fields.some(function (f) { return (data[f.name] || '').trim(); });
        var badge = (v.score != null)
          ? '<span class="nb-score sc-' + scClass(v.score) + '">' + v.score + '/100</span>'
          : (hasContent ? '<span class="nb-badge draft">brouillon</span>' : '<span class="nb-badge empty">non rempli</span>');
        var smeta = SM[step.id] || {};
        var typeChip = smeta.type && ATL[smeta.type] ? '<span class="nb-type-chip" style="font-size:.72rem;font-weight:600;background:rgba(255,255,255,0.06);border:1px solid var(--border-glass);border-radius:6px;padding:.05rem .4rem;margin-left:.4rem;vertical-align:middle">' + ATL[smeta.type] + '</span>' : '';
        var solution = (smeta.tech || []).map(function (t) { return t.label; }).join(' · ');
        html += '<div class="nb-brick"><div class="nb-brick-head"><h4>' + esc(step.title) + typeChip + '</h4>' + badge + '</div>';
        if (solution) html += '<div class="nb-solution" style="font-size:.78rem;color:var(--text-muted);margin:-.2rem 0 .4rem">🛠️ Solution envisagee : ' + esc(solution) + '</div>';
        step.fields.forEach(function (f) {
          var val = (data[f.name] || '').trim();
          if (val) html += '<div class="nb-field"><div class="nb-flabel">' + esc(f.label) + '</div><div class="nb-fval">' + nl2br(val) + '</div></div>';
        });
        if ((data.assets || []).length) html += '<div class="nb-assets">📎 ' + data.assets.length + ' asset(s) attache(s)</div>';
        if (!hasContent) html += '<div class="nb-noctnt"><em>Livrable non encore realise.</em></div>';
        html += '</div>';
      });
      html += '</section>';
    });

    // Carnet de bord
    var wb = s.workbook || { fields: {}, scores: {} };
    var wbFields = wb.fields || {}, wbScores = wb.scores || {};
    var wbHas = WB_ORDER.some(function (id) { return (wbFields[id] || '').trim(); });
    if (wbHas) {
      html += '<section class="nb-phase"><h3 class="nb-phase-title">📔 Carnet de bord</h3>';
      WB_ORDER.forEach(function (id) {
        var t = (wbFields[id] || '').trim(); if (!t) return;
        var sc = wbScores[id];
        html += '<div class="nb-brick"><div class="nb-brick-head"><h4>' + esc(WB_TITLES[id] || id) + '</h4>' +
          (sc != null ? '<span class="nb-score sc-' + scClass(sc) + '">' + sc + '/100</span>' : '') + '</div>' +
          '<div class="nb-fval">' + nl2br(t) + '</div></div>';
      });
      html += '</section>';
    }

    // Reflexions
    var refl = s.reflections || {};
    var rKeys = Object.keys(refl);
    if (rKeys.length) {
      html += '<section class="nb-phase"><h3 class="nb-phase-title">🪞 Reflexions personnelles</h3>';
      rKeys.forEach(function (k) { var tx = (refl[k] && refl[k].text) || ''; if (tx) html += '<div class="nb-brick"><div class="nb-fval">' + nl2br(tx) + '</div></div>'; });
      html += '</section>';
    }

    // Activites / demos / badges
    var demos = s.demosCompleted || [];
    html += '<section class="nb-phase"><h3 class="nb-phase-title">🎒 Activites & recompenses</h3>' +
      '<div class="nb-tags-row"><span class="nb-tags-lbl">Demos testees (' + demos.length + ') :</span> ' +
      (demos.length ? demos.map(function (d) { return '<span class="nb-tag">' + esc(d) + '</span>'; }).join('') : '<em>aucune</em>') + '</div>' +
      '<div class="nb-tags-row"><span class="nb-tags-lbl">Badges (' + badges.length + ') :</span> ' +
      (badges.length ? badges.map(function (b) { return '<span class="nb-tag">' + esc(b) + '</span>'; }).join('') : '<em>aucun</em>') + '</div></section>';

    return html;
  }

  // Page "Mon Notebook" (etudiant) avec barre d'outils
  function renderNotebook(main) {
    var A = window.AIA, s = A.getState();
    var name = (s.productTheme && s.productTheme.name) || 'projet';
    main.innerHTML = '<div class="page-header">' +
      '<h1>Mon <span class="gradient-text">Notebook</span></h1>' +
      '<p class="page-subtitle">Toutes vos realisations consolidees — ' + esc(name) + '</p>' +
      '<div class="nb-toolbar no-print">' +
      '<button class="btn-outline btn-sm" id="nb-print">🖨️ Imprimer / PDF</button>' +
      '<button class="btn-outline btn-sm" id="nb-export">⬇️ Exporter (.md)</button>' +
      '<a class="btn-ghost btn-sm" href="#" data-navigate="business-game">↗ Continuer le projet</a>' +
      '</div></div>' +
      '<div id="notebook-root" class="nb-root">' + buildNotebookHTML(s) + '</div>';
    var p = document.getElementById('nb-print'); if (p) p.addEventListener('click', function () { window.print(); });
    var e = document.getElementById('nb-export'); if (e) e.addEventListener('click', function () { exportNotebookMarkdown(s); });
  }

  // Modale "Notebook complet" pour le formateur (lecture d'un eleve)
  function renderNotebookModal(s) {
    var ov = document.createElement('div');
    ov.className = 'boss-modal-overlay nb-modal-overlay';
    ov.innerHTML = '<div class="boss-modal nb-modal glass-card">' +
      '<div class="nb-modal-head no-print"><h3>📓 Notebook — ' + esc((s.user && s.user.name) || '') + '</h3>' +
      '<div><button class="btn-outline btn-sm" id="nb-modal-print">🖨️ Imprimer</button> ' +
      '<button class="btn-ghost btn-sm" id="nb-modal-close">✕ Fermer</button></div></div>' +
      '<div id="notebook-root" class="nb-root nb-modal-body">' + buildNotebookHTML(s) + '</div></div>';
    document.body.appendChild(ov);
    function close() { if (ov.parentNode) ov.parentNode.removeChild(ov); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    var c = ov.querySelector('#nb-modal-close'); if (c) c.addEventListener('click', close);
    var pr = ov.querySelector('#nb-modal-print'); if (pr) pr.addEventListener('click', function () { window.print(); });
    return { close: close };
  }

  // Export Markdown telechargeable
  function buildNotebookMarkdown(s) {
    var A = window.AIA, PG = A.PHASES_GUIDE || {};
    var theme = s.productTheme || { emoji: '', name: 'Projet', category: '', tagline: '' };
    var cd = s.campaignData || {}, gv = s.gameValidation || {};
    var md = '# Notebook — ' + theme.name + ' ' + (theme.emoji || '') + '\n\n';
    md += '**Etudiant** : ' + ((s.user && s.user.name) || '') + '  \n';
    md += '**Categorie** : ' + (theme.category || '') + '  \n';
    md += '**Promesse** : ' + (theme.tagline || '') + '  \n';
    md += '**XP** : ' + ((s.xp && s.xp.total) || 0) + ' — **Badges** : ' + ((s.badges || []).length) + '\n\n---\n\n';
    Object.keys(PG).forEach(function (pk) {
      var ph = PG[pk]; md += '## ' + ph.title + '\n\n';
      ph.steps.forEach(function (step) {
        var data = cd[step.id] || {}, v = gv[step.id] || {};
        md += '### ' + step.title + (v.score != null ? ' (' + v.score + '/100)' : '') + '\n\n';
        var any = false;
        step.fields.forEach(function (f) { var val = (data[f.name] || '').trim(); if (val) { any = true; md += '**' + f.label + '**\n\n' + val + '\n\n'; } });
        if (!any) md += '_(non rempli)_\n\n';
      });
    });
    var wb = (s.workbook && s.workbook.fields) || {};
    var wbAny = WB_ORDER.some(function (id) { return (wb[id] || '').trim(); });
    if (wbAny) { md += '## Carnet de bord\n\n'; WB_ORDER.forEach(function (id) { var t = (wb[id] || '').trim(); if (t) md += '### ' + (WB_TITLES[id] || id) + '\n\n' + t + '\n\n'; }); }
    return md;
  }

  function exportNotebookMarkdown(s) {
    try {
      var md = buildNotebookMarkdown(s);
      var blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      var nm = ((s.productTheme && s.productTheme.name) || 'projet').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      a.href = url; a.download = 'notebook-' + nm + '.md';
      document.body.appendChild(a); a.click();
      setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
      if (window.AIA.showToast) window.AIA.showToast('Notebook exporte (.md)', 'success');
    } catch (e) { if (window.AIA.showToast) window.AIA.showToast('Export impossible sur ce navigateur', 'error'); }
  }

  window.AIA = window.AIA || {};
  window.AIA.renderNotebook = renderNotebook;
  window.AIA.buildNotebookHTML = buildNotebookHTML;
  window.AIA.renderNotebookModal = renderNotebookModal;
  window.AIA.exportNotebookMarkdown = exportNotebookMarkdown;
})();
