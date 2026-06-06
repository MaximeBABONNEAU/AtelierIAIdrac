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
    if (!st.workbook) st.workbook = { fields: {}, finalized: {} };
    if (!st.workbook.fields) st.workbook.fields = {};
    if (!st.workbook.finalized) st.workbook.finalized = {};
    return st.workbook;
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }
  function nl2br(s) { return escapeHtml(s).replace(/\n/g, '<br>'); }

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
      html += '<div class="wb-section glass-card' + (isFinal ? ' finalized' : '') + '" data-section="' + s.id + '">' +
        '<div class="wb-section-head">' +
        '<h3>' + s.icon + ' ' + escapeHtml(s.title) + '</h3>' +
        (isFinal ? '<span class="wb-final-badge">✅ Finalise</span>' : '') +
        '</div>';

      if (compiled && compiled.html) {
        html += '<details class="wb-compiled" open><summary>📥 Vos productions Business Game (' + compiled.filledCount + '/' + compiled.totalFields + ' champs remplis)</summary>' +
          compiled.html + '</details>';
      } else if (compiled) {
        html += '<div class="wb-empty-note">⚠️ Aucune donnee dans le Business Game pour cette phase. Completez les etapes correspondantes d\'abord.</div>';
      }

      html += '<div class="wb-redaction">' +
        '<label>✍️ Votre redaction structuree</label>' +
        '<p class="wb-hint"><strong>Consigne :</strong> ' + escapeHtml(s.hint) + '</p>' +
        '<textarea class="wb-textarea" data-section="' + s.id + '" data-starter="' + encodeURIComponent(s.starter || '') + '" rows="7" placeholder="' + escapeHtml(s.starter || 'Redigez ici votre version finale, claire et ordonnee...') + '">' + escapeHtml(fieldVal) + '</textarea>' +
        '<div class="wb-section-actions">' +
        '<button class="btn-primary btn-sm wb-save" data-section="' + s.id + '">💾 Enregistrer</button>' +
        (s.starter ? '<button class="btn-ghost btn-sm wb-use-template" data-section="' + s.id + '">📝 Utiliser le modele</button>' : '') +
        '<button class="btn-ghost btn-sm wb-finalize" data-section="' + s.id + '">' + (isFinal ? 'Rouvrir' : '✅ Marquer finalise') + '</button>' +
        (s.id === 'learnings' ? '<button class="btn-ghost btn-sm" id="wb-import-reflections">↧ Importer mes reflexions</button>' : '') +
        '</div>' +
        '</div>';
      html += '</div>';
    });

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

    html += '</div>';

    main.innerHTML = html;
    wireWorkbook(main);
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
        if (!wb.finalized[id] && ta && ta.value.trim().length < 20) { AIA.showToast('Redigez la section avant de la finaliser', 'warning'); return; }
        if (ta && ta.value.trim().length >= 20) saveField(id, ta.value);
        wb.finalized[id] = !wb.finalized[id];
        if (AIA.saveState) AIA.saveState();
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
      var data = { theme: st.productTheme, workbook: getWB(), campaignData: st.campaignData, exportedAt: new Date().toISOString() };
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'carnet-' + (st.productTheme ? st.productTheme.id : 'campagne') + '.json';
      a.click(); URL.revokeObjectURL(url);
      AIA.showToast('Carnet exporte', 'success');
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
      if (val) doc += '<div class="wb-doc-text">' + nl2br(val) + '</div>';
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
})();
