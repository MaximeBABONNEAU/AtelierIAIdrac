/* ==============================================
   EXERCICES.JS — Cas pratiques quotidiens (depth/activite)
   Mini-exercices d'IA marketing repartis sur les 4 jours.
   Reponse libre, validation a l'effort, petite XP, marque comme fait.
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  function esc(t) { var d = document.createElement('div'); d.textContent = (t == null ? '' : String(t)); return d.innerHTML; }

  var XP_PER = 8;          // XP modeste (mini-jeu / activite annexe)
  var MIN_WORDS = 18;      // effort minimal pour valider

  var EXERCISES = [
    { id: 'ex-prompt-fix', day: 1, icon: '✍️', title: 'Reparer un prompt faible',
      scenario: 'Un collegue a ecrit ce prompt : "fais moi un texte pour vendre des chaussures".',
      question: 'Reecris ce prompt en y ajoutant : un role, un contexte/cible, un format de sortie et 2 contraintes.' },
    { id: 'ex-bias', day: 1, icon: '🧐', title: 'Reperer un biais IA',
      scenario: 'Tu demandes a une IA "donne le profil type d\'un bon developpeur" et elle decrit uniquement des hommes jeunes.',
      question: 'Quel biais est en jeu ? Comment reformuler ta demande pour l\'eviter ?' },
    { id: 'ex-name', day: 2, icon: '🏷️', title: '3 noms de marque',
      scenario: 'Tu lances une marque de cosmetiques solides zero-dechet pour la Gen Z.',
      question: 'Propose 3 noms (2-3 syllabes) + une baseline de 5 mots pour chacun, et justifie ton prefere.' },
    { id: 'ex-tone', day: 2, icon: '🎙️', title: 'Tone of voice',
      scenario: 'Une banque en ligne veut paraitre plus humaine et accessible sans perdre en serieux.',
      question: 'Definis 5 adjectifs de ton, 5 mots a privilegier et 5 mots a bannir.' },
    { id: 'ex-hook', day: 3, icon: '🪝', title: 'Accroche publicitaire',
      scenario: 'Campagne Instagram pour une appli de meditation, cible 25-35 ans stresses.',
      question: 'Ecris 3 accroches (max 8 mots) orientees benefice, puis explique laquelle tu testerais en premier et pourquoi.' },
    { id: 'ex-channel', day: 3, icon: '📡', title: 'Choisir le bon canal',
      scenario: 'Budget de 5000 EUR pour lancer un kit de jardinage urbain aupres de citadins 30-45 ans.',
      question: 'Repartis le budget sur 2-3 canaux pertinents (avec %) et donne 1 KPI cible par canal.' },
    { id: 'ex-pitch', day: 4, icon: '🚀', title: 'Pitch en 2 phrases',
      scenario: 'Tu as 10 secondes dans un ascenseur avec un investisseur.',
      question: 'Pitch ton projet en 2 phrases : probleme + solution + ce qui te rend unique.' },
    { id: 'ex-hallu', day: 4, icon: '🛑', title: 'Detecter une hallucination',
      scenario: 'Une IA affirme : "selon l\'etude Nielsen 2023, 87% des Francais cultivent des champignons chez eux".',
      question: 'Pourquoi se mefier de cette affirmation ? Liste 2 reflexes pour verifier une donnee fournie par une IA.' }
  ];

  function renderExercises(main) {
    var A = window.AIA, st = A.getState();
    st.exercisesDone = st.exercisesDone || {};
    var done = Object.keys(st.exercisesDone).filter(function (k) { return st.exercisesDone[k]; }).length;

    var html = '<div class="page-header"><h1>Cas <span class="gradient-text">pratiques</span></h1>' +
      '<p class="page-subtitle">Mini-exercices d\'IA marketing — ' + done + '/' + EXERCISES.length + ' faits &bull; +' + XP_PER + ' XP chacun</p></div>' +
      '<div class="ex-grid">';

    EXERCISES.forEach(function (ex) {
      var isDone = !!st.exercisesDone[ex.id];
      html += '<div class="ex-card glass-card' + (isDone ? ' done' : '') + '" data-ex="' + ex.id + '">' +
        '<div class="ex-head"><span class="ex-icon">' + ex.icon + '</span>' +
        '<div><div class="ex-day">Jour ' + ex.day + '</div><h3>' + esc(ex.title) + '</h3></div>' +
        (isDone ? '<span class="ex-badge">✅ Fait</span>' : '') + '</div>' +
        '<p class="ex-scenario">' + esc(ex.scenario) + '</p>' +
        '<p class="ex-question"><strong>' + esc(ex.question) + '</strong></p>' +
        '<textarea class="ex-answer" data-ex="' + ex.id + '" rows="4" placeholder="Ta reponse...">' + esc((st.exerciseAnswers && st.exerciseAnswers[ex.id]) || '') + '</textarea>' +
        '<div class="ex-actions"><button class="btn-primary btn-sm btn-ex-validate" data-ex="' + ex.id + '">' + (isDone ? 'Mettre a jour' : 'Valider (+' + XP_PER + ' XP)') + '</button>' +
        '<span class="ex-fb" id="exfb-' + ex.id + '"></span></div>' +
        '</div>';
    });
    html += '</div>';
    main.innerHTML = html;

    main.querySelectorAll('.btn-ex-validate').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-ex');
        var ta = main.querySelector('.ex-answer[data-ex="' + id + '"]'); if (!ta) return;
        var val = ta.value.trim();
        var words = val ? val.split(/\s+/).length : 0;
        var fb = document.getElementById('exfb-' + id);
        st.exerciseAnswers = st.exerciseAnswers || {};
        st.exerciseAnswers[id] = val;
        if (words < MIN_WORDS) {
          if (fb) fb.innerHTML = '<span class="ex-warn">Developpe un peu plus (' + words + '/' + MIN_WORDS + ' mots min).</span>';
          if (A.saveState) A.saveState();
          return;
        }
        var firstTime = !st.exercisesDone[id];
        st.exercisesDone[id] = true;
        if (A.saveState) A.saveState();
        if (firstTime && A.addXP) A.addXP(XP_PER, 'Cas pratique : ' + ((EXERCISES.find(function (e) { return e.id === id; }) || {}).title || ''));
        if (fb) fb.innerHTML = '<span class="ex-ok">✅ Valide ! ' + (firstTime ? '+' + XP_PER + ' XP' : 'mis a jour') + '</span>';
        var card = main.querySelector('.ex-card[data-ex="' + id + '"]'); if (card) card.classList.add('done');
      });
    });
  }

  window.AIA = window.AIA || {};
  window.AIA.renderExercises = renderExercises;
})();
