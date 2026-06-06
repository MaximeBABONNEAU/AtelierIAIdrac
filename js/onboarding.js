/* ==============================================
   ONBOARDING.JS — Tour guide + Check-in / Exit ticket
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  /* ============ ONBOARDING TOUR STEPS ============ */
  var TOUR_STEPS = [
    {
      title: 'Bienvenue dans AI Marketing Academy 🎓',
      body: '4 jours pour maitriser l\'IA generative appliquee au marketing digital. Cet atelier est <strong>100% pratique</strong> — vous allez construire votre campagne complete avec l\'IA.',
      target: null
    },
    {
      title: '🎯 Le Business Game = votre fil rouge',
      body: 'Vous choisissez 1 produit fictif (parmi 3 propositions) et construisez sa <strong>campagne marketing complete</strong> en 4 phases × 3 etapes. Ce menu est mis en avant en or — c\'est votre projet du debut a la fin.',
      target: '.nav-link-game, .mobile-link-game'
    },
    {
      title: '🛠️ 15 demos IA interactives',
      body: 'Testez en direct les meilleurs outils IA : ChatGPT-style, image gen (FLUX, Stable Diffusion), musique (MusicGen), voix (Whisper, Parler-TTS), traduction (NLLB). Tout est integre, aucune inscription externe.',
      target: '[data-navigate="demos"]'
    },
    {
      title: '⚡ Temps Forts du cours',
      body: '15 moments cles cadences sur les 4 jours : <strong>Lightning Rounds</strong> (warm-up rapide), <strong>Showcases</strong> (vous presentez), <strong>Boss Challenges</strong> (XP bonus). Vous gagnez des points a chaque participation.',
      target: '[data-navigate="highlights"]'
    },
    {
      title: '📔 Journal & 🪞 Reflexions',
      body: 'Notez vos idees, prompts qui marchent, doutes dans le <strong>Journal</strong>. Apres chaque demo, une <strong>question de reflexion</strong> vous aide a ancrer l\'apprentissage. Vous pouvez exporter tout en fin d\'atelier.',
      target: '[data-navigate="journal"]'
    },
    {
      title: '📚 Bibliotheque ressources',
      body: '23 outils, articles, videos curated par jour de cours. Filtres par theme et niveau. Consultez-en 10 pour debloquer le badge <strong>Explorateur</strong>.',
      target: '[data-navigate="resources"]'
    },
    {
      title: '🎮 Et plein d\'autres choses...',
      body: '<strong>Battle de Prompts</strong> avec evaluateur reel, <strong>RPG PvP</strong> avec 4 classes marketing, <strong>Quiz</strong> en direct, <strong>Showcase</strong> de toutes les campagnes votees par la classe. Plus de 46 badges a debloquer. Have fun ! 🚀',
      target: null
    }
  ];

  var MOODS = ['😴', '😐', '🙂', '😀', '🔥'];

  /* ============ STATE HELPERS ============ */
  function isOnboardingDone() {
    var st = window.AIA && window.AIA.getState ? window.AIA.getState() : {};
    return !!st.onboardingDone;
  }

  function markOnboardingDone() {
    var AIA = window.AIA;
    var st = AIA.getState();
    st.onboardingDone = true;
    if (AIA.saveState) AIA.saveState();
  }

  function todayISO() {
    return new Date().toISOString().split('T')[0];
  }

  function hasCheckin(type, date) {
    try { return localStorage.getItem('aia_checkin_' + type + '_' + (date || todayISO())) === '1'; }
    catch (e) { return false; }
  }
  function markCheckin(type, date) {
    try { localStorage.setItem('aia_checkin_' + type + '_' + (date || todayISO()), '1'); }
    catch (e) {}
  }
  // Compat (ancienne signature)
  function hasCheckinToday(type) { return hasCheckin(type, todayISO()); }

  /* ===== Calendrier du seminaire : fenetres horaires des popups ===== */
  function seminarDates() {
    var CFG = window.AIA && window.AIA.CONFIG;
    return (CFG && CFG.dates) || [];
  }
  // Fin de journee : lundi 16h45, sinon 15h45 (mar/mer/ven). Jeudi off (hors dates).
  function dayEndTime(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    return d.getDay() === 1 ? '16:45' : '15:45';
  }
  function dtAt(dateStr, hhmm) { return new Date(dateStr + 'T' + hhmm + ':00'); }
  function withinWindow(now, dateStr, startHHMM, endHHMM) {
    return now >= dtAt(dateStr, startHHMM) && now < dtAt(dateStr, endHHMM);
  }
  var MORNING_START = '08:00', MORNING_END = '13:00';
  // Retourne la popup a afficher maintenant ({type,date}) selon l'horaire + report, ou null.
  function pendingCheckin(now) {
    now = now || new Date();
    var dates = seminarDates();
    var todayStr = todayISO();
    var todayIdx = dates.indexOf(todayStr);
    var inTodayMorning = todayIdx >= 0 && withinWindow(now, todayStr, MORNING_START, MORNING_END);
    var out = [];
    dates.forEach(function (dateStr) {
      var isToday = dateStr === todayStr;
      var eveAt = dtAt(dateStr, dayEndTime(dateStr));
      // MATIN
      if (!hasCheckin('morning', dateStr)) {
        if (isToday && inTodayMorning) out.push({ type: 'morning', date: dateStr, at: dtAt(dateStr, MORNING_START) });
        else if (!isToday && dtAt(dateStr, MORNING_END) <= now && inTodayMorning) out.push({ type: 'morning', date: dateStr, at: dtAt(dateStr, MORNING_START) }); // report
      }
      // SOIR (exit ticket) : des l'heure de fin, le jour meme ; sinon report au prochain matin
      if (!hasCheckin('evening', dateStr)) {
        if (isToday && now >= eveAt && now < dtAt(dateStr, '23:00')) out.push({ type: 'evening', date: dateStr, at: eveAt });
        else if (eveAt <= now && !isToday && inTodayMorning) out.push({ type: 'evening', date: dateStr, at: eveAt }); // report
      }
    });
    out.sort(function (a, b) { return a.at - b.at; }); // plus ancien d'abord (les reports passent avant)
    return out[0] || null;
  }

  function saveCheckin(entry) {
    var AIA = window.AIA;
    var st = AIA.getState();
    if (!Array.isArray(st.checkins)) st.checkins = [];
    st.checkins.push(entry);
    if (AIA.saveState) AIA.saveState();
    if (AIA.addXP) AIA.addXP(5, (entry.type === 'morning' ? 'Check-in matin' : 'Exit ticket'));
  }

  /* ============ ONBOARDING TOUR ============ */
  var _tourIdx = 0;

  function startOnboardingTour(force) {
    if (!force && isOnboardingDone()) return;
    _tourIdx = 0;
    renderTourStep();
  }

  function renderTourStep() {
    var step = TOUR_STEPS[_tourIdx];
    if (!step) { closeTour(true); return; }
    var existing = document.querySelector('.onboarding-overlay');
    if (existing) existing.remove();
    // Remove any previous highlights
    document.querySelectorAll('.onboarding-highlight').forEach(function (el) { el.classList.remove('onboarding-highlight'); });

    var overlay = document.createElement('div');
    overlay.className = 'onboarding-overlay';
    overlay.innerHTML =
      '<div class="onboarding-card">' +
      '<div class="ob-progress">' +
      TOUR_STEPS.map(function (_, i) {
        return '<span class="ob-dot' + (i === _tourIdx ? ' active' : '') + (i < _tourIdx ? ' done' : '') + '"></span>';
      }).join('') +
      '</div>' +
      '<h2 class="ob-title">' + step.title + '</h2>' +
      '<div class="ob-body">' + step.body + '</div>' +
      '<div class="ob-footer">' +
      '<button class="btn-outline btn-sm ob-skip">Passer le tour</button>' +
      '<div class="ob-nav">' +
      (_tourIdx > 0 ? '<button class="btn-outline btn-sm ob-prev">← Precedent</button>' : '') +
      (_tourIdx < TOUR_STEPS.length - 1
        ? '<button class="btn-primary ob-next">Suivant →</button>'
        : '<button class="btn-primary ob-finish">🚀 Commencer l\'atelier !</button>') +
      '</div>' +
      '</div>' +
      '<div class="ob-step-count">' + (_tourIdx + 1) + ' / ' + TOUR_STEPS.length + '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    if (step.target) {
      var target = document.querySelector(step.target);
      if (target) target.classList.add('onboarding-highlight');
    }

    overlay.querySelector('.ob-skip').addEventListener('click', function () { closeTour(true); });
    var nextBtn = overlay.querySelector('.ob-next');
    if (nextBtn) nextBtn.addEventListener('click', function () { _tourIdx++; renderTourStep(); });
    var prevBtn = overlay.querySelector('.ob-prev');
    if (prevBtn) prevBtn.addEventListener('click', function () { _tourIdx--; renderTourStep(); });
    var finishBtn = overlay.querySelector('.ob-finish');
    if (finishBtn) finishBtn.addEventListener('click', function () { closeTour(true); });
  }

  function closeTour(markDone) {
    document.querySelectorAll('.onboarding-highlight').forEach(function (el) { el.classList.remove('onboarding-highlight'); });
    var overlay = document.querySelector('.onboarding-overlay');
    if (overlay) overlay.remove();
    if (markDone) {
      var wasFirstRun = !isOnboardingDone();
      markOnboardingDone();
      if (window.AIA && window.AIA.showToast) window.AIA.showToast('Tour termine ! Profitez de l\'atelier 🚀', 'success');
      // MICRO-PARCOURS J1 (suite) : Etape 3 Check-in, puis Etape 4 Projet
      if (wasFirstRun && window.AIA) {
        setTimeout(function () {
          showMorningCheckin();
          if (window.AIA.showGuideBanner) {
            window.AIA.showGuideBanner('Etape 4/4 — Choisissez votre projet', 'Apres le check-in, lancez votre Business Game (le fil rouge des 4 jours).');
            window.AIA._firstRunSequence = function () {
              if (window.AIA.hideGuideBanner) window.AIA.hideGuideBanner();
              if (window.AIA.navigateTo) window.AIA.navigateTo('business-game');
            };
          }
        }, 600);
      }
    }
  }

  /* ============ MORNING / EVENING CHECK-INS ============ */
  var _checkinSnoozeUntil = 0; // "Plus tard" repousse la verif periodique
  function maybeShowCheckin() {
    if (document.querySelector('.checkin-overlay') || document.querySelector('.onboarding-overlay')) return;
    if (Date.now() < _checkinSnoozeUntil) return; // snooze actif (l'etudiant a clique "Plus tard")
    var pending = pendingCheckin();
    if (!pending) return;
    setTimeout(function () {
      if (pending.type === 'morning') showMorningCheckin(pending.date);
      else showEveningCheckin(pending.date);
    }, 1200);
  }

  function showMorningCheckin(forDate) {
    if (document.querySelector('.checkin-overlay') || document.querySelector('.onboarding-overlay')) return;
    forDate = forDate || todayISO();
    var isLate = forDate !== todayISO(); // report d'un jour precedent non repondu
    var overlay = document.createElement('div');
    overlay.className = 'checkin-overlay';
    overlay.innerHTML =
      '<div class="checkin-card">' +
      '<div class="checkin-header">' +
      '<span class="checkin-icon">☀️</span>' +
      '<div><h2>Bonjour ! Check-in du matin</h2>' +
      '<p>Prenez 30 secondes pour cadrer votre journee. +5 XP</p></div>' +
      '</div>' +
      '<div class="checkin-form">' +
      '<label>Comment vous sentez-vous ce matin ?</label>' +
      '<div class="mood-picker" id="mood-picker-morning">' +
      MOODS.map(function (m) { return '<button class="mood-btn" data-mood="' + m + '">' + m + '</button>'; }).join('') +
      '</div>' +
      '<label>Quel est votre objectif principal aujourd\'hui ?</label>' +
      '<textarea id="checkin-goal" rows="2" placeholder="Ex: comprendre les prompts CRAC, valider phase 1 du Game..."></textarea>' +
      '<label>Une question ou un doute a clarifier ?</label>' +
      '<textarea id="checkin-question" rows="2" placeholder="(optionnel) Ce qui vous laisse perplexe..."></textarea>' +
      '</div>' +
      '<div class="checkin-actions">' +
      '<button class="btn-outline btn-sm checkin-skip">Plus tard</button>' +
      '<button class="btn-primary checkin-save">Valider (+5 XP)</button>' +
      '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var selectedMood = null;
    overlay.querySelectorAll('.mood-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        overlay.querySelectorAll('.mood-btn').forEach(function (b) { b.classList.remove('selected'); });
        this.classList.add('selected');
        selectedMood = this.getAttribute('data-mood');
      });
    });
    overlay.querySelector('.checkin-skip').addEventListener('click', function () { _checkinSnoozeUntil = Date.now() + 15 * 60000; overlay.remove(); });
    overlay.querySelector('.checkin-save').addEventListener('click', function () {
      var goal = overlay.querySelector('#checkin-goal').value.trim();
      if (!selectedMood) { window.AIA.showToast('Choisissez votre humeur', 'warning'); return; }
      if (goal.length < 5) { window.AIA.showToast('Decrivez votre objectif (5+ caracteres)', 'warning'); return; }
      saveCheckin({
        id: 'ck_' + Date.now(),
        type: 'morning',
        day: (seminarDates().indexOf(forDate) + 1) || ((window.AIA.getCurrentTiming ? (window.AIA.getCurrentTiming() || {}).dayNum : null) || 1),
        forDate: forDate,
        ts: new Date().toISOString(),
        mood: selectedMood,
        goal: goal,
        question: overlay.querySelector('#checkin-question').value.trim()
      });
      markCheckin('morning', forDate);
      window.AIA.showToast('Check-in enregistre ! Bonne journee 🌟', 'success');
      overlay.remove();
    });
  }

  function showEveningCheckin(forDate) {
    if (document.querySelector('.checkin-overlay') || document.querySelector('.onboarding-overlay')) return;
    forDate = forDate || todayISO();
    var overlay = document.createElement('div');
    overlay.className = 'checkin-overlay';
    overlay.innerHTML =
      '<div class="checkin-card">' +
      '<div class="checkin-header">' +
      '<span class="checkin-icon">🌙</span>' +
      '<div><h2>Exit ticket du soir</h2>' +
      '<p>2 questions rapides pour ancrer votre apprentissage. +5 XP</p></div>' +
      '</div>' +
      '<div class="checkin-form">' +
      '<label>Comment vous sentez-vous ce soir ?</label>' +
      '<div class="mood-picker">' +
      MOODS.map(function (m) { return '<button class="mood-btn" data-mood="' + m + '">' + m + '</button>'; }).join('') +
      '</div>' +
      '<label>Qu\'avez-vous appris d\'important aujourd\'hui ?</label>' +
      '<textarea id="checkin-learned" rows="3" placeholder="Une idee, un outil, une technique, un insight..."></textarea>' +
      '<label>Qu\'est-ce qui reste flou ou que vous voulez creuser ?</label>' +
      '<textarea id="checkin-unclear" rows="2" placeholder="(optionnel) Ce sur quoi vous aimeriez revenir..."></textarea>' +
      '</div>' +
      '<div class="checkin-actions">' +
      '<button class="btn-outline btn-sm checkin-skip">Plus tard</button>' +
      '<button class="btn-primary checkin-save">Valider (+5 XP)</button>' +
      '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var selectedMood = null;
    overlay.querySelectorAll('.mood-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        overlay.querySelectorAll('.mood-btn').forEach(function (b) { b.classList.remove('selected'); });
        this.classList.add('selected');
        selectedMood = this.getAttribute('data-mood');
      });
    });
    overlay.querySelector('.checkin-skip').addEventListener('click', function () { _checkinSnoozeUntil = Date.now() + 15 * 60000; overlay.remove(); });
    overlay.querySelector('.checkin-save').addEventListener('click', function () {
      var learned = overlay.querySelector('#checkin-learned').value.trim();
      if (!selectedMood) { window.AIA.showToast('Choisissez votre humeur', 'warning'); return; }
      if (learned.length < 10) { window.AIA.showToast('Decrivez ce que vous avez appris (10+ caracteres)', 'warning'); return; }
      saveCheckin({
        id: 'ck_' + Date.now(),
        type: 'evening',
        day: (seminarDates().indexOf(forDate) + 1) || ((window.AIA.getCurrentTiming ? (window.AIA.getCurrentTiming() || {}).dayNum : null) || 1),
        forDate: forDate,
        ts: new Date().toISOString(),
        mood: selectedMood,
        learned: learned,
        unclear: overlay.querySelector('#checkin-unclear').value.trim()
      });
      markCheckin('evening', forDate);
      window.AIA.showToast('Exit ticket enregistre ! A demain 🌙', 'success');
      overlay.remove();
    });
  }

  /* ============ CHECK-INS DISPLAY PAGE ============ */
  function renderCheckinsPage(main) {
    var st = window.AIA.getState();
    var checkins = Array.isArray(st.checkins) ? st.checkins : [];
    var morning = checkins.filter(function (c) { return c.type === 'morning'; });
    var evening = checkins.filter(function (c) { return c.type === 'evening'; });

    var html = '<div class="page-header"><h1>Mes <span class="gradient-text">Check-ins</span></h1>' +
      '<p class="page-subtitle">' + checkins.length + ' check-in' + (checkins.length > 1 ? 's' : '') + ' &bull; matin: ' + morning.length + ' &bull; soir: ' + evening.length + '</p></div>' +
      '<div style="margin-bottom:1rem">' +
      '<button class="btn-outline" id="btn-tour-restart">🎓 Refaire le tour</button> ' +
      '<button class="btn-outline" id="btn-manual-morning">☀️ Check-in matin maintenant</button> ' +
      '<button class="btn-outline" id="btn-manual-evening">🌙 Exit ticket maintenant</button>' +
      '</div>';

    if (checkins.length === 0) {
      html += '<div class="glass-card" style="text-align:center;padding:3rem">' +
        '<div style="font-size:3rem;margin-bottom:0.5rem">☀️🌙</div>' +
        '<h3>Pas encore de check-in</h3>' +
        '<p style="color:var(--text-muted)">Les check-ins du matin et du soir apparaissent automatiquement selon l\'heure. Vous pouvez aussi les ouvrir manuellement avec les boutons ci-dessus.</p>' +
        '</div>';
    } else {
      html += '<div class="checkins-list">' +
        checkins.slice().reverse().map(function (c) {
          var dt = new Date(c.ts);
          var when = dt.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
          if (c.type === 'morning') {
            return '<div class="checkin-entry glass-card morning">' +
              '<div class="ce-header"><span class="ce-icon">☀️</span><span class="ce-mood">' + c.mood + '</span>' +
              '<span class="ce-day">J' + c.day + '</span><span class="ce-date">' + when + '</span></div>' +
              '<div class="ce-row"><strong>Objectif :</strong> ' + escapeHtml(c.goal || '') + '</div>' +
              (c.question ? '<div class="ce-row"><strong>Question :</strong> ' + escapeHtml(c.question) + '</div>' : '') +
              '</div>';
          }
          return '<div class="checkin-entry glass-card evening">' +
            '<div class="ce-header"><span class="ce-icon">🌙</span><span class="ce-mood">' + c.mood + '</span>' +
            '<span class="ce-day">J' + c.day + '</span><span class="ce-date">' + when + '</span></div>' +
            '<div class="ce-row"><strong>Appris :</strong> ' + escapeHtml(c.learned || '') + '</div>' +
            (c.unclear ? '<div class="ce-row"><strong>A creuser :</strong> ' + escapeHtml(c.unclear) + '</div>' : '') +
            '</div>';
        }).join('') +
        '</div>';
    }

    main.innerHTML = html;

    var btnTour = document.getElementById('btn-tour-restart');
    if (btnTour) btnTour.addEventListener('click', function () { startOnboardingTour(true); });
    var btnM = document.getElementById('btn-manual-morning');
    if (btnM) btnM.addEventListener('click', function () {
      try { localStorage.removeItem('aia_checkin_morning_' + todayISO()); } catch (e) {}
      showMorningCheckin();
    });
    var btnE = document.getElementById('btn-manual-evening');
    if (btnE) btnE.addEventListener('click', function () {
      try { localStorage.removeItem('aia_checkin_evening_' + todayISO()); } catch (e) {}
      showEveningCheckin();
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  /* ============ EXPORTS ============ */
  window.AIA = window.AIA || {};
  window.AIA.startOnboardingTour = function (force) { startOnboardingTour(force === undefined ? true : force); };
  window.AIA.maybeStartOnboarding = function () { startOnboardingTour(false); };
  window.AIA.maybeShowCheckin = maybeShowCheckin;
  window.AIA.showMorningCheckin = showMorningCheckin;
  window.AIA.showEveningCheckin = showEveningCheckin;
  window.AIA.renderCheckinsPage = renderCheckinsPage;
  window.AIA.TOUR_STEPS = TOUR_STEPS;
})();
