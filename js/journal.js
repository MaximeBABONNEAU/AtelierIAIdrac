/* ==============================================
   JOURNAL.JS — Journal de bord + Self-reflection prompts
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  /* ============ REFLECTION PROMPTS PER ITEM ============ */
  var REFLECTION_PROMPTS = {
    'demo-prompt': 'Quel use case marketing concret pourriez-vous resoudre avec un prompt structure CRAC ? Ecrivez en 2-3 lignes.',
    'demo-chatbot': 'Quelle limite des chatbots LLM avez-vous identifiee ? Comment la contourner dans un cas pro ?',
    'demo-vqa': 'Quel scenario d\'usage de l\'analyse visuelle IA pourriez-vous integrer dans votre veille concurrentielle ?',
    'demo-translate': 'Pourquoi une traduction IA ne suffit-elle pas pour le marketing international ? Donnez un exemple.',
    'demo-image': 'Quels prompts visuels marchent bien pour votre marque ? Notez votre formule gagnante.',
    'demo-logo': 'Combien d\'iterations IA avez-vous fait avant un logo satisfaisant ? Que retenir du processus ?',
    'demo-bg-remove': 'Sur quels visuels de votre campagne ce detourage IA serait-il le plus utile ?',
    'demo-upscale': 'Avez-vous des anciens visuels que vous pourriez upscaler pour votre projet ?',
    'demo-sentiment': 'Sur quels textes appliqueriez-vous l\'analyse de sentiment dans votre marketing ?',
    'demo-music': 'Quelle ambiance sonore correspond a l\'identite de votre marque ? Decrivez en 5 adjectifs.',
    'demo-tts': 'Pour quels formats video votre marque utiliserait-elle une voix-off IA plutot qu\'humaine ?',
    'demo-avatar': 'Comment garantir l\'ethique en utilisant un avatar video IA en marketing ? 3 regles a respecter.',
    'demo-abtest': 'Quel element de votre futur landing testeriez-vous en A/B en premier ? Pourquoi ?',
    'demo-seo': 'Quels sont les 3 mots-cles principaux que vous viseriez pour votre projet ?',
    'demo-speech': 'Comment integrer la transcription IA dans votre workflow marketing (verbatim, podcast, video) ?',
    // Business Game steps
    'product-idea': 'Quelle est la chose la plus surprenante que vous avez decouverte sur votre produit ?',
    'target-persona': 'Decrivez votre persona en 1 phrase comme s\'il etait votre meilleur ami.',
    'market-analysis': 'Quel concurrent vous inquiete le plus et pourquoi ?',
    'brand-name': 'Pourquoi ce nom plutot qu\'un autre ? Quelle emotion suscite-t-il ?',
    'logo': 'Quel message votre logo doit-il transmettre instantanement ?',
    'brand-guide': 'Si votre marque etait une personne, comment parlerait-elle ?',
    'ad-visuals': 'Quelle image votre cible doit-elle voir en pensant a votre marque ?',
    'copy': 'Quel mot ou phrase declenche le clic chez votre persona ?',
    'media-plan': 'Quelle est votre repartition budget ideale et pourquoi ?',
    'landing-page': 'Quelle section de la landing est la plus critique pour convertir ?',
    'pitch-video': 'Quelle est la promesse principale de votre pitch en 1 phrase ?',
    'final-deck': 'Si vous avez 30 secondes en pitch live, que dites-vous ?'
  };

  /* ============ REFLECTION HELPERS ============ */
  function getReflection(stepId) {
    var st = window.AIA.getState();
    return (st.reflections && st.reflections[stepId]) || null;
  }

  function saveReflection(stepId, text) {
    var AIA = window.AIA;
    var st = AIA.getState();
    if (!st.reflections) st.reflections = {};
    var existed = !!st.reflections[stepId];
    st.reflections[stepId] = { text: text, ts: new Date().toISOString() };
    if (AIA.saveState) AIA.saveState();
    if (!existed) {
      if (AIA.awardBadge) AIA.awardBadge('reflective');
      if (AIA.addXP) AIA.addXP(5, 'Reflexion ecrite');
      var count = Object.keys(st.reflections).length;
      if (count >= 10 && AIA.awardBadge) AIA.awardBadge('deep-thinker');
    }
  }

  function renderReflection(stepId) {
    if (!REFLECTION_PROMPTS[stepId]) return '';
    var existing = getReflection(stepId);
    var prompt = REFLECTION_PROMPTS[stepId];
    return '<div class="reflection-block glass-card">' +
      '<h3 class="reflection-title">🪞 Reflexion personnelle</h3>' +
      '<p class="reflection-prompt">' + escapeHtml(prompt) + '</p>' +
      '<textarea class="reflection-input" data-reflection-id="' + stepId + '" rows="3" placeholder="Vos pensees ici (5 XP a la 1ere sauvegarde)...">' + (existing ? escapeHtml(existing.text) : '') + '</textarea>' +
      '<div class="reflection-footer">' +
      '<span class="reflection-status">' + (existing ? '✓ Sauvegarde le ' + new Date(existing.ts).toLocaleDateString('fr-FR') : 'Pas encore ecrit') + '</span>' +
      '<button class="btn-primary btn-sm reflection-save" data-reflection-save="' + stepId + '">' + (existing ? 'Mettre a jour' : 'Sauvegarder (+5 XP)') + '</button>' +
      '</div>' +
      '</div>';
  }

  function wireReflections(scope) {
    var root = scope || document;
    root.querySelectorAll('[data-reflection-save]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-reflection-save');
        var input = root.querySelector('.reflection-input[data-reflection-id="' + id + '"]');
        if (!input) return;
        var txt = input.value.trim();
        if (txt.length < 5) {
          window.AIA.showToast('Ecrivez au moins 5 caracteres', 'warning');
          return;
        }
        saveReflection(id, txt);
        window.AIA.showToast('Reflexion sauvegardee', 'success');
        var card = btn.closest('.reflection-block');
        var status = card ? card.querySelector('.reflection-status') : null;
        if (status) status.textContent = '✓ Sauvegarde le ' + new Date().toLocaleDateString('fr-FR');
        btn.textContent = 'Mettre a jour';
      });
    });
  }

  /* ============ JOURNAL DE BORD ============ */
  function genId() {
    return 'je_' + Date.now() + '_' + Math.floor(Math.random() * 9999);
  }

  function getEntries() {
    var st = window.AIA.getState();
    return Array.isArray(st.journal) ? st.journal : [];
  }

  function saveEntry(entry) {
    var AIA = window.AIA;
    var st = AIA.getState();
    if (!Array.isArray(st.journal)) st.journal = [];
    var isFirst = st.journal.length === 0;
    st.journal.unshift(entry);
    if (AIA.saveState) AIA.saveState();
    if (isFirst && AIA.awardBadge) AIA.awardBadge('journaler');
    if (AIA.addXP) AIA.addXP(10, 'Entree journal');
    var byDay = {};
    st.journal.forEach(function (e) {
      var d = e.day || (new Date(e.ts)).toISOString().split('T')[0];
      byDay[d] = true;
    });
    if (Object.keys(byDay).length >= 4 && AIA.awardBadge) AIA.awardBadge('journal-streak');
  }

  function deleteEntry(id) {
    var AIA = window.AIA;
    var st = AIA.getState();
    st.journal = (st.journal || []).filter(function (e) { return e.id !== id; });
    if (AIA.saveState) AIA.saveState();
  }

  function renderJournal(main) {
    var entries = getEntries();
    var day = (window.AIA.getCurrentTiming ? (window.AIA.getCurrentTiming() || {}).dayNum : null) || 1;

    var html = '<div class="page-header"><h1>Journal <span class="gradient-text">de bord</span></h1>' +
      '<p class="page-subtitle">Vos notes personnelles, idees, questions du cours. ' + entries.length + ' entree' + (entries.length > 1 ? 's' : '') + ' &bull; +10 XP par entree</p></div>' +

      '<div class="journal-new glass-card">' +
      '<h3>✍️ Nouvelle entree</h3>' +
      '<select id="journal-day" class="demo-input" style="margin-bottom:0.5rem">' +
      [1, 2, 3, 4].map(function (d) {
        return '<option value="' + d + '"' + (d === day ? ' selected' : '') + '>Jour ' + d + '</option>';
      }).join('') +
      '</select>' +
      '<input type="text" id="journal-title" class="demo-input" placeholder="Titre court (ex: Mes notes du matin)" style="margin-bottom:0.5rem">' +
      '<textarea id="journal-content" class="demo-textarea" rows="6" placeholder="Idees, questions, prompts qui marchent, doutes... C\'est votre espace.&#10;&#10;Astuce : exportez votre journal complet en fin d\'atelier pour le garder."></textarea>' +
      '<div class="journal-actions">' +
      '<button class="btn-primary" id="btn-journal-save">💾 Sauvegarder (+10 XP)</button>' +
      '<button class="btn-outline btn-sm" id="btn-journal-export">📤 Exporter tout (JSON)</button>' +
      '</div>' +
      '</div>';

    if (entries.length === 0) {
      html += '<div class="glass-card" style="text-align:center;padding:2rem;margin-top:1rem">' +
        '<div style="font-size:3rem;margin-bottom:0.5rem">📔</div>' +
        '<h3>Votre journal est vide</h3>' +
        '<p style="color:var(--text-muted)">Sauvegardez votre 1ere entree pour debloquer le badge <strong>📔 Chroniqueur</strong>.</p>' +
        '</div>';
    } else {
      html += '<h2 style="font-size:1.1rem;margin:1.5rem 0 0.8rem">Vos entrees</h2>' +
        '<div class="journal-entries">' +
        entries.map(function (e) {
          var date = new Date(e.ts);
          return '<div class="journal-entry glass-card" data-entry-id="' + e.id + '">' +
            '<div class="je-header">' +
            '<span class="je-day">📅 J' + e.day + '</span>' +
            '<span class="je-date">' + date.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) + '</span>' +
            '<button class="je-delete" data-delete-entry="' + e.id + '" title="Supprimer">🗑️</button>' +
            '</div>' +
            '<h4>' + escapeHtml(e.title || '(sans titre)') + '</h4>' +
            '<div class="je-content">' + escapeHtml(e.content).replace(/\n/g, '<br>') + '</div>' +
            '</div>';
        }).join('') +
        '</div>';
    }

    main.innerHTML = html;

    var btnSave = document.getElementById('btn-journal-save');
    if (btnSave) btnSave.addEventListener('click', function () {
      var d = parseInt(document.getElementById('journal-day').value);
      var t = document.getElementById('journal-title').value.trim();
      var c = document.getElementById('journal-content').value.trim();
      if (c.length < 10) {
        window.AIA.showToast('Ecrivez au moins 10 caracteres', 'warning');
        return;
      }
      saveEntry({ id: genId(), day: d, ts: new Date().toISOString(), title: t || '(sans titre)', content: c });
      window.AIA.showToast('Entree sauvegardee ! +10 XP', 'success');
      renderJournal(main);
    });

    var btnExport = document.getElementById('btn-journal-export');
    if (btnExport) btnExport.addEventListener('click', function () {
      var all = getEntries();
      var blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'journal-' + Date.now() + '.json';
      a.click();
      URL.revokeObjectURL(url);
      window.AIA.showToast('Journal exporte', 'success');
    });

    main.querySelectorAll('[data-delete-entry]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!confirm('Supprimer cette entree ?')) return;
        deleteEntry(this.getAttribute('data-delete-entry'));
        renderJournal(main);
      });
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  window.AIA = window.AIA || {};
  window.AIA.REFLECTION_PROMPTS = REFLECTION_PROMPTS;
  window.AIA.renderReflection = renderReflection;
  window.AIA.wireReflections = wireReflections;
  window.AIA.saveReflection = saveReflection;
  window.AIA.getReflection = getReflection;
  window.AIA.renderJournal = renderJournal;
})();
