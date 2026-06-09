/* ==============================================
   HIGHLIGHTS.JS — Temps Forts du cours
   Boss Challenges, Lightning Rounds, Showcase Moments
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  /* ============ HIGHLIGHTS TIMELINE ============
     Each highlight = a "temps fort" - a special moment during the course
     Types:
       - lightning  : 5-15min warm-up at start of session
       - showcase   : mid-session share & vote moment
       - boss       : end-of-day combined challenge (high XP)
       - wrapup     : daily retrospective + leaderboard reveal
  ============================================== */
  var HIGHLIGHTS = [
    // ===== DAY 1 =====
    { id: 'lightning-d1-am', day: 1, session: 'matin', timeStart: '09:30', timeEnd: '09:45',
      type: 'lightning', icon: '⚡', title: 'Lightning : Prompt Speed-Run',
      desc: 'En 15 minutes, ecrivez 3 prompts pour 3 sujets imposes. Mode chrono active !',
      xp: 30, action: 'battle',
      brief: 'Sujets : (1) slogan eco, (2) email panier abandonne, (3) post LinkedIn B2B. 3 minutes par sujet.' },

    { id: 'showcase-d1-pm', day: 1, session: 'aprem', timeStart: '15:00', timeEnd: '15:30',
      type: 'showcase', icon: '🎪', title: 'Showcase : Persona Battle',
      desc: 'Chaque etudiant presente son persona en 90 sec. La classe vote le plus convaincant.',
      xp: 40, action: 'business-game',
      brief: 'Phase 1 > Persona cible. Apres 20 min de travail, presentation + votes.' },

    { id: 'boss-d1', day: 1, session: 'aprem', timeStart: '17:00', timeEnd: '17:30',
      type: 'boss', icon: '👑', title: 'Boss J1 : Phase Ideation complete',
      desc: 'Validez les 3 etapes de la Phase 1 (Concept + Persona + Marche) avant 17h30 !',
      xp: 100, action: 'business-game',
      brief: 'Toutes les etapes Phase 1 validees = +100 XP bonus + badge "Stratege"' },

    // ===== DAY 2 =====
    { id: 'wrapup-d1', day: 2, session: 'matin', timeStart: '09:00', timeEnd: '09:15',
      type: 'wrapup', icon: '📊', title: 'Retro J1 : Top 3 Personas',
      desc: 'Reveal des 3 meilleurs personas votes hier. Leur secret + apprentissages cles.',
      xp: 15, action: 'showcase',
      brief: 'Inspirez-vous des meilleures approches pour iterer sur votre projet.' },

    { id: 'lightning-d2-am', day: 2, session: 'matin', timeStart: '10:30', timeEnd: '10:45',
      type: 'lightning', icon: '⚡', title: 'Lightning : Logo Sprint',
      desc: 'Generez 10 variantes de logo via FLUX en 15 minutes. Selection des 3 meilleures.',
      xp: 30, action: 'demo-logo',
      brief: 'Prompt : "Minimalist logo for [VOTRE_PROJET], geometric, vector, flat design". Iterez !' },

    { id: 'showcase-d2-pm', day: 2, session: 'aprem', timeStart: '15:00', timeEnd: '15:30',
      type: 'showcase', icon: '🎨', title: 'Showcase : Brand Reveal',
      desc: 'Presentez votre identite de marque (logo + palette + ton) en 60 sec.',
      xp: 40, action: 'business-game',
      brief: 'Phase 2 complete + assets logo attaches. La classe vote la marque la plus memorable.' },

    { id: 'boss-d2', day: 2, session: 'aprem', timeStart: '17:00', timeEnd: '17:30',
      type: 'boss', icon: '👑', title: 'Boss J2 : Phase Branding complete',
      desc: 'Validez Phase 2 (Nom + Logo + Charte) AVEC au moins 2 assets attaches !',
      xp: 120, action: 'business-game',
      brief: '+120 XP bonus + badge "Brand Builder" pour les premiers a finir.' },

    { id: 'livebattle-d2', day: 2, session: 'aprem', timeStart: '16:00', timeEnd: '16:45',
      type: 'livebattle', icon: '🎤', title: 'Live Battle : Son & Image',
      desc: 'Associe une image de marque a un jingle (ou rends une video). Presentation live au tableau, la classe vote en etoiles ⭐.',
      xp: 40, action: 'livebattle',
      brief: 'Prepare ton image + jingle (ou MP4) en avance dans le menu "Live Battle". Au top, presentation pour tous + vote 1-5 etoiles.' },

    { id: 'livechat-d2', day: 2, session: 'aprem', timeStart: '15:00', timeEnd: '15:20',
      type: 'livechat', icon: '💬', title: 'Live Chat : Battle de punchlines',
      desc: 'En lien avec la journee Creation de Contenu : poste ta meilleure accroche/slogan genere par IA, reagis a ceux des autres.',
      xp: 25, action: 'chat',
      brief: 'Tout le monde dans le Chat : balance ta punchline (slogan, hook, headline marketing). Commente 2 autres. Entraide creative en direct !' },

    // ===== DAY 3 =====
    { id: 'wrapup-d2', day: 3, session: 'matin', timeStart: '09:00', timeEnd: '09:15',
      type: 'wrapup', icon: '📊', title: 'Retro J2 : Top Marques',
      desc: 'Top 3 des marques creees hier. Decryptage des techniques de naming + visuels.',
      xp: 15, action: 'showcase' },

    { id: 'lightning-d3-am', day: 3, session: 'matin', timeStart: '10:45', timeEnd: '11:00',
      type: 'lightning', icon: '⚡', title: 'Lightning : Headlines x3',
      desc: '15 minutes pour ecrire 3 headlines + 1 body copy + 2 CTAs sur votre produit.',
      xp: 35, action: 'demo-prompt',
      brief: 'Format A : emotion / B : data-driven / C : urgence. Comparez ce qui fonctionne.' },

    { id: 'showcase-d3-pm', day: 3, session: 'aprem', timeStart: '14:30', timeEnd: '15:00',
      type: 'showcase', icon: '🎬', title: 'Showcase : Pub Video 30 sec',
      desc: 'Diffusion en classe des 5 meilleures videos pub generees (MusicGen + TTS + visuels).',
      xp: 50, action: 'demo-tts',
      brief: 'Script TTS + bande son MusicGen + 3 visuels. Combinez les 3 outils !' },

    { id: 'boss-d3', day: 3, session: 'aprem', timeStart: '17:00', timeEnd: '17:30',
      type: 'boss', icon: '👑', title: 'Boss J3 : Campagne Pub complete',
      desc: 'Phase 3 validee + visuels + textes + plan media. Vous avez une vraie campagne !',
      xp: 140, action: 'business-game',
      brief: '+140 XP bonus + badge "Campaigner". Top 5 vote prix "Meilleure Campagne".' },

    { id: 'livebattle-d3', day: 3, session: 'aprem', timeStart: '16:00', timeEnd: '16:45',
      type: 'livebattle', icon: '🎤', title: 'Live Battle : Son & Image #2',
      desc: 'Deuxieme manche : la meilleure asso image de marque + jingle (ou video). Presentation live + vote etoiles ⭐.',
      xp: 40, action: 'livebattle',
      brief: 'Upload ton contenu dans le menu "Live Battle". Presentation pour tous + vote 1-5 etoiles, classement par moyenne.' },

    { id: 'livechat-d3', day: 3, session: 'matin', timeStart: '09:15', timeEnd: '09:35',
      type: 'livechat', icon: '💬', title: 'Live Chat : SEO & mots-cles en direct',
      desc: 'En lien avec la journee Strategie Marketing : brainstorm collectif de mots-cles et d\'idees SEO pour vos marques.',
      xp: 25, action: 'chat',
      brief: 'Dans le Chat : poste 3 mots-cles SEO + 1 question strategie pour ta marque. On s\'entraide en direct.' },

    // ===== DAY 4 =====
    { id: 'wrapup-d3', day: 4, session: 'matin', timeStart: '09:00', timeEnd: '09:15',
      type: 'wrapup', icon: '📊', title: 'Retro J3 : Top Campagnes',
      desc: 'Reveal des campagnes les plus completes. Quoi reutiliser dans votre vie pro.',
      xp: 15, action: 'showcase' },

    { id: 'lightning-d4-am', day: 4, session: 'matin', timeStart: '10:30', timeEnd: '10:45',
      type: 'lightning', icon: '⚡', title: 'Lightning : Pitch en 60 sec',
      desc: 'Pitch elevator de votre produit en 60 sec, enregistre via TTS ou voix reelle.',
      xp: 40, action: 'demo-tts',
      brief: 'Hook 5s + probleme 15s + solution 20s + preuve 10s + CTA 10s' },

    { id: 'showcase-d4-pm', day: 4, session: 'aprem', timeStart: '14:30', timeEnd: '15:30',
      type: 'showcase', icon: '🏆', title: 'Grand Final : Pitchs en Live',
      desc: 'Chaque etudiant presente sa campagne complete en 3 min. Jury (formateur + pairs).',
      xp: 100, action: 'showcase',
      brief: 'Slide deck + video pitch + landing mockup. Vote final pour les awards.' },

    { id: 'boss-d4', day: 4, session: 'aprem', timeStart: '16:30', timeEnd: '17:30',
      type: 'boss', icon: '🏆', title: 'BOSS FINAL : Campagne 100%',
      desc: 'Validez la 12eme et derniere etape ! Ceremonie de remise des trophees.',
      xp: 250, action: 'business-game',
      brief: 'Top 3 final : trophees IDRAC + badge "Master of AI Marketing"' }
  ];

  /* ============ TIME / STATE UTILITIES ============ */
  function nowDayTime() {
    var AIA = window.AIA;
    var CFG = AIA && AIA.CONFIG;
    if (!CFG || !CFG.dates) return null;
    var today = new Date().toISOString().split('T')[0];
    var dayIdx = CFG.dates.indexOf(today);
    var n = new Date();
    var hh = String(n.getHours()).padStart(2, '0');
    var mm = String(n.getMinutes()).padStart(2, '0');
    if (dayIdx === -1) {
      var firstDate = new Date(CFG.dates[0] + 'T00:00:00');
      if (n < firstDate) return { dayNum: 1, hhmm: '08:00', isUpcoming: true };
      return { dayNum: 4, hhmm: '18:00', isPast: true };
    }
    return { dayNum: dayIdx + 1, hhmm: hh + ':' + mm };
  }

  function isHighlightActive(h, dayTime) {
    if (!dayTime) return false;
    if (h.day !== dayTime.dayNum) return false;
    return dayTime.hhmm >= h.timeStart && dayTime.hhmm < h.timeEnd;
  }

  function isHighlightUpcoming(h, dayTime) {
    if (!dayTime) return false;
    if (h.day > dayTime.dayNum) return true;
    if (h.day < dayTime.dayNum) return false;
    return dayTime.hhmm < h.timeStart;
  }

  function getNextHighlight(dayTime) {
    if (!dayTime) return null;
    for (var i = 0; i < HIGHLIGHTS.length; i++) {
      if (isHighlightActive(HIGHLIGHTS[i], dayTime)) return { highlight: HIGHLIGHTS[i], status: 'active' };
    }
    for (var j = 0; j < HIGHLIGHTS.length; j++) {
      if (isHighlightUpcoming(HIGHLIGHTS[j], dayTime)) return { highlight: HIGHLIGHTS[j], status: 'upcoming' };
    }
    return null;
  }

  function minutesUntil(targetHhmm, currentHhmm) {
    var ts = targetHhmm.split(':');
    var cs = currentHhmm.split(':');
    return (parseInt(ts[0]) * 60 + parseInt(ts[1])) - (parseInt(cs[0]) * 60 + parseInt(cs[1]));
  }

  /* ============ DISPONIBILITE MIXTE (auto par horaire + override admin) ============ */
  // Retourne l'etat explicite pose par l'admin (true/false) ou null si aucun.
  function adminUnlockOverride(id) {
    var AIA = window.AIA;
    var u = AIA && AIA.getUnlocks ? AIA.getUnlocks() : null;
    if (u && u.highlights && Object.prototype.hasOwnProperty.call(u.highlights, id)) return !!u.highlights[id];
    return null;
  }
  // Ouverture automatique : le temps fort s'ouvre des que son horaire est atteint (jour courant ou passe).
  function isHighlightAutoOpen(h, dayTime) {
    if (!dayTime) return false;
    if (h.day < dayTime.dayNum) return true;
    if (h.day > dayTime.dayNum) return false;
    return dayTime.hhmm >= h.timeStart;
  }
  // MIXTE : si l'admin a pose un override explicite, il prime ; sinon ouverture auto par horaire.
  function isHighlightAvailable(h, dayTime) {
    var ov = adminUnlockOverride(h.id);
    if (ov !== null) return ov;
    return isHighlightAutoOpen(h, dayTime || nowDayTime());
  }
  // Compat : ancienne signature par id (utilisee par wireHighlightCTAs).
  function isHighlightUnlocked(id) {
    var h = HIGHLIGHTS.find(function (x) { return x.id === id; });
    return h ? isHighlightAvailable(h, nowDayTime()) : true;
  }

  function renderHighlightsBanner() {
    var AIA = window.AIA;
    var dt = nowDayTime();
    if (!dt) return '';
    var next = getNextHighlight(dt);
    if (next && !isHighlightAvailable(next.highlight, dt)) {
      var h0 = next.highlight;
      return '<div class="highlights-banner locked type-' + h0.type + '">' +
        '<div class="hb-icon">🔒</div>' +
        '<div class="hb-info">' +
        '<div class="hb-label">⏸️ TEMPS FORT A VENIR</div>' +
        '<h3>' + escapeHtml(h0.title) + '</h3>' +
        '<p>S\'ouvre automatiquement a ' + h0.timeStart + (h0.day > dt.dayNum ? ' (Jour ' + h0.day + ')' : '') + '. Le formateur peut aussi l\'ouvrir en avance.</p>' +
        '</div>' +
        '<div class="hb-actions"><div class="hb-time">⏰ ' + h0.timeStart + '</div></div>' +
        '</div>';
    }
    if (!next) {
      return '<div class="highlights-banner past">' +
        '<div class="hb-icon">🎉</div>' +
        '<div class="hb-info"><h3>Atelier termine</h3>' +
        '<p>Bravo pour votre parcours ! Consultez le Showcase pour revivre les moments forts.</p></div>' +
        '<a class="btn-outline" href="#" data-navigate="showcase">Voir Showcase</a>' +
        '</div>';
    }
    var h = next.highlight;
    var st = AIA.getState();
    var doneMap = (st && st.highlightsCompleted) || {};
    var alreadyDone = !!doneMap[h.id];

    var typeLabels = {
      lightning: 'LIGHTNING ROUND',
      showcase: 'SHOWCASE',
      boss: 'BOSS CHALLENGE',
      wrapup: 'WRAP-UP',
      livebattle: 'LIVE BATTLE',
      livechat: 'LIVE CHAT'
    };

    if (next.status === 'active') {
      return '<div class="highlights-banner active type-' + h.type + (alreadyDone ? ' done' : '') + '">' +
        '<div class="hb-pulse"></div>' +
        '<div class="hb-icon">' + h.icon + '</div>' +
        '<div class="hb-info">' +
        '<div class="hb-label">🔥 EN COURS &bull; ' + typeLabels[h.type] + (alreadyDone ? ' &bull; VALIDE' : '') + '</div>' +
        '<h3>' + escapeHtml(h.title) + '</h3>' +
        '<p>' + escapeHtml(h.desc) + '</p>' +
        (h.brief ? '<p class="hb-brief">📋 ' + escapeHtml(h.brief) + '</p>' : '') +
        '</div>' +
        '<div class="hb-actions">' +
        '<div class="hb-xp">+' + h.xp + ' XP</div>' +
        (alreadyDone
          ? '<div class="hb-done">✅ Valide</div>'
          : '<button class="btn-primary hb-cta" data-highlight-action="' + h.action + '" data-highlight-id="' + h.id + '">Demarrer →</button>') +
        '</div>' +
        '</div>';
    }
    var min = minutesUntil(h.timeStart, dt.hhmm);
    var minLabel = h.day > dt.dayNum ? 'Demain' : (min < 60 ? 'Dans ' + min + ' min' : 'Dans ' + Math.round(min / 60) + 'h');
    return '<div class="highlights-banner upcoming type-' + h.type + '">' +
      '<div class="hb-icon">' + h.icon + '</div>' +
      '<div class="hb-info">' +
      '<div class="hb-label">⏳ PROCHAIN TEMPS FORT &bull; ' + typeLabels[h.type] + ' &bull; ' + minLabel + '</div>' +
      '<h3>' + escapeHtml(h.title) + '</h3>' +
      '<p>' + escapeHtml(h.desc) + '</p>' +
      '</div>' +
      '<div class="hb-actions">' +
      '<div class="hb-time">⏰ ' + h.timeStart + '</div>' +
      '<div class="hb-xp">+' + h.xp + ' XP</div>' +
      '</div>' +
      '</div>';
  }

  /* ============ HIGHLIGHTS FULL PAGE ============ */
  function renderHighlightsPage(main) {
    var AIA = window.AIA;
    var dt = nowDayTime() || { dayNum: 1, hhmm: '00:00' };
    var st = AIA.getState();
    var doneMap = (st && st.highlightsCompleted) || {};

    var html = '<div class="page-header"><h1>Temps <span class="gradient-text">Forts</span> de l\'Atelier</h1>' +
      '<p class="page-subtitle">15 moments cles repartis sur 4 jours. Chacun rapporte des XP bonus + badges exclusifs.</p></div>';

    [1, 2, 3, 4].forEach(function (day) {
      var dayHighlights = HIGHLIGHTS.filter(function (h) { return h.day === day; });
      if (!dayHighlights.length) return;
      var isCurrent = day === dt.dayNum;
      html += '<div class="highlights-day' + (isCurrent ? ' current' : '') + '">' +
        '<h2>Jour ' + day + (isCurrent ? ' &bull; Aujourd\'hui' : '') + '</h2>' +
        '<div class="highlights-list">' +
        dayHighlights.map(function (h) {
          var isLocked = !isHighlightAvailable(h, dt);
          var status = isLocked ? 'locked' : (doneMap[h.id] ? 'done' : (isHighlightActive(h, dt) ? 'active' : (isHighlightUpcoming(h, dt) ? 'upcoming' : 'past')));
          var statusIcon = status === 'locked' ? '🔒' : status === 'done' ? '✅' : status === 'active' ? '🔥' : status === 'upcoming' ? '⏳' : '⏸️';
          return '<div class="highlight-card type-' + h.type + ' status-' + status + '">' +
            '<div class="hc-time">' + h.timeStart + ' &bull; ' + h.timeEnd + ' <span class="hc-status">' + statusIcon + '</span></div>' +
            '<div class="hc-header">' +
            '<div class="hc-icon">' + h.icon + '</div>' +
            '<div class="hc-title-block">' +
            '<h3>' + escapeHtml(h.title) + '</h3>' +
            '<div class="hc-type-label">' + h.type.toUpperCase() + ' &bull; +' + h.xp + ' XP</div>' +
            '</div>' +
            '</div>' +
            '<p class="hc-desc">' + escapeHtml(h.desc) + '</p>' +
            (h.brief ? '<p class="hc-brief"><strong>📋 Brief :</strong> ' + escapeHtml(h.brief) + '</p>' : '') +
            (status === 'locked'
              ? '<div class="hc-locked">🔒 S\'ouvre a ' + h.timeStart + (h.day > dt.dayNum ? ' (Jour ' + h.day + ')' : '') + ' — ou debloque par le formateur</div>'
              : status === 'active' && !doneMap[h.id]
                ? '<button class="btn-primary hc-cta" data-highlight-action="' + h.action + '" data-highlight-id="' + h.id + '">Demarrer maintenant →</button>'
                : status === 'past' && !doneMap[h.id]
                  ? '<div class="hc-missed">Moment passe</div>'
                  : doneMap[h.id]
                    ? '<div class="hc-done">✅ Valide &bull; +' + h.xp + ' XP gagne</div>'
                    : '<div class="hc-upcoming">⏳ Demarre a ' + h.timeStart + '</div>') +
            '</div>';
        }).join('') +
        '</div></div>';
    });

    main.innerHTML = html;
    wireHighlightCTAs(main);
  }

  function wireHighlightCTAs(scope) {
    var AIA = window.AIA;
    scope.querySelectorAll('[data-highlight-action]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var action = this.getAttribute('data-highlight-action');
        var hid = this.getAttribute('data-highlight-id');
        if (!isHighlightUnlocked(hid)) {
          if (AIA.showToast) AIA.showToast('🔒 Verrouille — l\'admin debloquera bientot', 'warning');
          return;
        }
        var h = HIGHLIGHTS.find(function (x) { return x.id === hid; });
        // Lightning : experience competitive dediee (chrono + classement). XP donnee a la fin du defi.
        if (h && h.type === 'lightning') {
          _activeLightningId = hid;
          if (AIA.navigateTo) AIA.navigateTo('lightning');
          return;
        }
        // Boss : experience dediee (quiz de synthese chrono + classement). XP a la fin du defi.
        if (h && h.type === 'boss') {
          _activeBossId = hid;
          if (AIA.navigateTo) AIA.navigateTo('boss');
          return;
        }
        // Live Battle : page dediee (upload preemptif + scene live + vote etoiles). XP donnee aux resultats (idempotente).
        if (h && h.type === 'livebattle') {
          if (AIA.navigateTo) AIA.navigateTo('livebattle');
          return;
        }
        if (h) {
          var st = AIA.getState();
          st.highlightsCompleted = st.highlightsCompleted || {};
          if (!st.highlightsCompleted[hid]) {
            st.highlightsCompleted[hid] = true;
            if (AIA.addXP) AIA.addXP(h.xp, 'Temps fort : ' + h.title);
            if (AIA.saveState) AIA.saveState();
          }
        }
        // Showcase : ouvrir la page de vote de classe (au lieu de l'action generique).
        var dest = (h && h.type === 'showcase') ? 'showcase' : action;
        if (AIA.navigateTo) AIA.navigateTo(dest);
      });
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  /* ============ LIGHTNING CHALLENGE (competitif : chrono + classement live) ============ */
  var _activeLightningId = null;
  var _lightningTimer = null;
  var LIGHTNING_SECONDS = 180;

  function currentLightning() {
    if (_activeLightningId) {
      var byId = HIGHLIGHTS.find(function (x) { return x.id === _activeLightningId; });
      if (byId) return byId;
    }
    var dt = nowDayTime();
    var act = HIGHLIGHTS.find(function (h) { return h.type === 'lightning' && isHighlightActive(h, dt); });
    if (act) return act;
    var avail = HIGHLIGHTS.filter(function (h) { return h.type === 'lightning' && isHighlightAvailable(h, dt); });
    if (avail.length) return avail[avail.length - 1];
    return HIGHLIGHTS.find(function (h) { return h.type === 'lightning'; });
  }

  // Score transparent 0-100 base sur la structure du prompt (role/cible/action/contraintes/chiffres/longueur).
  function scoreLightning(text) {
    if (!text) return 0;
    var t = String(text).trim(); var lower = t.toLowerCase();
    var s = 0;
    if (/(en tant que|tu es|vous etes|expert|specialis|agis comme|ton role)/.test(lower)) s += 15;
    if (/(cible|audience|pour les|clients?|persona|b2b|b2c|millennial|gen ?z|prospect)/.test(lower)) s += 15;
    if (/(cree|genere|redige|ecris|analyse|compare|propose|liste|optimise|decris|imagine)/.test(lower)) s += 15;
    if (/(ton |format|max |mots|caracteres|style|structure|bullet|emoji|nombre de)/.test(lower)) s += 15;
    var nums = (t.match(/\d+/g) || []).length; s += Math.min(nums * 5, 20);
    var words = t.split(/\s+/).length; s += words > 60 ? 20 : words > 40 ? 15 : words > 25 ? 10 : words > 12 ? 5 : 2;
    return Math.min(100, s);
  }

  function lightningFeedback(score) {
    if (score >= 80) return { grade: 'A', label: 'Excellent prompt, tres structure !', color: '#2ecc71' };
    if (score >= 60) return { grade: 'B', label: 'Bon prompt — encore un cran possible.', color: '#f5b731' };
    if (score >= 40) return { grade: 'C', label: 'Correct, mais a enrichir (cible, contraintes).', color: '#e67e22' };
    return { grade: 'D', label: 'Trop vague — ajoute role, cible, contraintes, chiffres.', color: '#e74c3c' };
  }

  function fmtTime(s) { var m = Math.floor(s / 60); var ss = s % 60; return m + ':' + (ss < 10 ? '0' : '') + ss; }

  function postLightningScore(hid, score, cb) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var db = AIA.db, key = st.user && st.user.accountKey;
    if (!db || !key) { if (cb) cb(false); return; }
    var name = (st.user && (st.user.name || ((st.user.firstName || '') + ' ' + (st.user.lastName || '')).trim())) || 'Etudiant';
    var ref = db.ref('highlight_scores/' + hid + '/' + key);
    ref.once('value', function (snap) {
      var prev = snap.val();
      if (prev && prev.score >= score) { if (cb) cb(true); return; }
      var done = false;
      var to = setTimeout(function () { if (!done) { done = true; if (cb) cb(true); } }, 4000);
      ref.set({ name: name, score: score, ts: new Date().toISOString() }, function () {
        if (done) return; done = true; clearTimeout(to); if (cb) cb(true);
      });
    }, function () { if (cb) cb(false); });
  }

  function renderLightningChallenge(main) {
    var AIA = window.AIA;
    if (_lightningTimer) { clearInterval(_lightningTimer); _lightningTimer = null; }
    var h = currentLightning();
    _activeLightningId = null; // id consomme : un retour ulterieur repart sur la detection auto (le retry le repose explicitement)
    if (!h) { main.innerHTML = '<div class="page-header"><h1>Lightning</h1></div><div class="glass-card" style="padding:2rem;text-align:center">Aucun Lightning disponible pour le moment.</div>'; return; }
    var dt = nowDayTime();
    if (!isHighlightAvailable(h, dt)) {
      main.innerHTML = '<div class="page-header"><h1>⚡ ' + escapeHtml(h.title) + '</h1></div>' +
        '<div class="glass-card" style="text-align:center;padding:2rem">🔒 Ce Lightning s\'ouvre a ' + h.timeStart +
        '. Reviens quand le formateur lance le defi !<div style="margin-top:1rem"><button class="btn-outline" data-navigate="highlights">← Temps Forts</button></div></div>';
      return;
    }
    main.innerHTML =
      '<div class="page-header"><h1>⚡ <span class="gradient-text">' + escapeHtml(h.title) + '</span></h1>' +
      '<p class="page-subtitle">Defi chrono competitif — ton score entre au classement live de la classe.</p></div>' +
      '<div class="ltn-card glass-card">' +
      '<div class="ltn-brief"><strong>📋 Brief :</strong> ' + escapeHtml(h.brief || h.desc) + '</div>' +
      '<div class="ltn-rules">⏱️ ' + LIGHTNING_SECONDS + 's &bull; 🏆 score = qualite du prompt &bull; 📈 classement en direct &bull; +' + h.xp + ' XP</div>' +
      '<div class="ltn-actions"><button class="btn-primary ltn-start" id="ltn-start">🚀 Lancer le chrono</button>' +
      '<button class="btn-ghost btn-sm" id="ltn-see-rank">📊 Voir le classement</button></div>' +
      '</div>';
    document.getElementById('ltn-start').addEventListener('click', function () { startLightningRound(main, h); });
    document.getElementById('ltn-see-rank').addEventListener('click', function () { showLightningRanking(main, h, false); });
  }

  function startLightningRound(main, h) {
    if (_lightningTimer) { clearInterval(_lightningTimer); _lightningTimer = null; } // anti double-interval
    var remaining = LIGHTNING_SECONDS;
    main.innerHTML =
      '<div class="page-header"><h1>⚡ ' + escapeHtml(h.title) + '</h1></div>' +
      '<div class="ltn-card glass-card">' +
      '<div class="ltn-timer" id="ltn-timer">' + fmtTime(remaining) + '</div>' +
      '<div class="ltn-brief"><strong>📋 :</strong> ' + escapeHtml(h.brief || h.desc) + '</div>' +
      '<textarea id="ltn-input" class="ltn-input" rows="8" placeholder="Ecris ton meilleur prompt... (role + cible + action + contraintes + chiffres)"></textarea>' +
      '<div class="ltn-actions"><button class="btn-primary" id="ltn-submit">✅ Soumettre</button>' +
      '<span class="ltn-wc" id="ltn-wc">0 mots</span></div>' +
      '</div>';
    var input = document.getElementById('ltn-input');
    var wc = document.getElementById('ltn-wc');
    if (input) {
      input.focus();
      input.addEventListener('input', function () { wc.textContent = (this.value.trim() ? this.value.trim().split(/\s+/).length : 0) + ' mots'; });
    }
    var submitted = false;
    var submit = function () {
      if (submitted) return; submitted = true;
      if (_lightningTimer) { clearInterval(_lightningTimer); _lightningTimer = null; }
      finishLightning(main, h, input ? input.value : '', LIGHTNING_SECONDS - remaining);
    };
    var sb = document.getElementById('ltn-submit');
    if (sb) sb.addEventListener('click', submit);
    _lightningTimer = setInterval(function () {
      remaining--;
      var el = document.getElementById('ltn-timer');
      if (!el) { clearInterval(_lightningTimer); _lightningTimer = null; return; } // page quittee
      el.textContent = fmtTime(remaining);
      if (remaining <= 15) el.classList.add('urgent');
      if (remaining <= 0) submit();
    }, 1000);
  }

  function finishLightning(main, h, txt, elapsed) {
    var AIA = window.AIA;
    var score = scoreLightning(txt);
    var fb = lightningFeedback(score);
    var st = AIA.getState();
    st.highlightsCompleted = st.highlightsCompleted || {};
    if (!st.highlightsCompleted[h.id]) {
      st.highlightsCompleted[h.id] = true;
      if (AIA.addXP) AIA.addXP(h.xp, 'Lightning : ' + h.title);
    }
    if (AIA.saveState) AIA.saveState();
    main.innerHTML =
      '<div class="page-header"><h1>⚡ Resultat</h1></div>' +
      '<div class="ltn-card glass-card">' +
      '<div class="ltn-result"><div class="ltn-grade" style="color:' + fb.color + '">' + fb.grade + '</div>' +
      '<div class="ltn-score">' + score + '<span>/100</span></div></div>' +
      '<p class="ltn-fb">' + fb.label + ' &bull; soumis en ' + elapsed + 's</p>' +
      '<div class="ltn-yourprompt"><strong>Ton prompt :</strong><br>' + (txt && txt.trim() ? escapeHtml(txt).replace(/\n/g, '<br>') : '<em>(vide)</em>') + '</div>' +
      '<div class="ltn-rank-zone" id="ltn-rank-zone">📊 Envoi au classement...</div>' +
      '<div class="ltn-actions"><button class="btn-outline btn-sm" id="ltn-retry">🔁 Reessayer</button>' +
      (AIA.pinToCarnet ? '<button class="btn-outline btn-sm" id="ltn-pin">📌 Epingler au Carnet</button>' : '') +
      '<button class="btn-ghost btn-sm" data-navigate="highlights">← Temps Forts</button></div>' +
      '</div>';
    var retry = document.getElementById('ltn-retry');
    if (retry) retry.addEventListener('click', function () { _activeLightningId = h.id; renderLightningChallenge(main); });
    var pin = document.getElementById('ltn-pin');
    if (pin) pin.addEventListener('click', function () {
      AIA.pinToCarnet({ kind: 'highlight', source: h.id, sourceLabel: 'Lightning : ' + h.title, title: 'Prompt (score ' + score + '/100)', content: txt });
    });
    // Effet de bord non-critique : ne doit jamais casser l'affichage du resultat.
    try { if (AIA.pushFeed) AIA.pushFeed({ action: 'highlight-done', target: h.title }); } catch (e) {}
    postLightningScore(h.id, score, function () { showLightningRanking(main, h, true); });
  }

  function showLightningRanking(main, h, inline) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var db = AIA.db, myKey = st.user && st.user.accountKey;
    var zone = inline ? document.getElementById('ltn-rank-zone') : null;
    var render = function (rows) {
      if (inline && !zone) return; // l'etudiant a quitte la page avant le retour Firebase : ne pas ecraser la page courante
      rows.sort(function (a, b) { return b.score - a.score || (a.ts < b.ts ? -1 : 1); });
      var medals = ['🥇', '🥈', '🥉'];
      var html = '<div class="ltn-rank"><h3 class="ltn-rank-title">🏆 Classement live — ' + escapeHtml(h.title) + '</h3>';
      if (!rows.length) {
        html += '<p class="ltn-empty">Personne n\'a encore soumis. Sois le premier !</p>';
      } else {
        html += '<div class="ltn-podium">' + rows.slice(0, 3).map(function (r, i) {
          var me = myKey && r.key === myKey;
          return '<div class="ltn-pod ltn-pod-' + (i + 1) + (me ? ' me' : '') + '"><div class="ltn-pod-medal">' + medals[i] + '</div>' +
            '<div class="ltn-pod-name">' + escapeHtml(r.name || 'Etudiant') + (me ? ' (toi)' : '') + '</div>' +
            '<div class="ltn-pod-score">' + r.score + '</div></div>';
        }).join('') + '</div>';
        if (myKey) {
          var myIdx = rows.findIndex(function (r) { return r.key === myKey; });
          if (myIdx >= 3) html += '<div class="ltn-myrank">Ton rang : <strong>#' + (myIdx + 1) + '</strong> / ' + rows.length + ' &bull; ' + rows[myIdx].score + ' pts</div>';
          else if (myIdx >= 0) html += '<div class="ltn-myrank">🎉 Tu es sur le podium !</div>';
        }
        html += '<div class="ltn-rank-list">' + rows.slice(0, 10).map(function (r, i) {
          var me = myKey && r.key === myKey;
          return '<div class="ltn-rank-row' + (me ? ' me' : '') + '"><span class="ltn-rk">#' + (i + 1) + '</span><span class="ltn-rn">' + escapeHtml(r.name || 'Etudiant') + '</span><span class="ltn-rs">' + r.score + '</span></div>';
        }).join('') + '</div>';
      }
      html += '<p class="ltn-rank-foot">Les meilleurs scores sont mis a l\'honneur par le formateur. Ameliore ton prompt et reessaie !</p></div>';
      if (zone) { zone.innerHTML = html; }
      else {
        main.innerHTML = '<div class="page-header"><h1>⚡ ' + escapeHtml(h.title) + '</h1></div><div class="ltn-card glass-card">' + html +
          '<div class="ltn-actions"><button class="btn-primary btn-sm" id="ltn-go">🚀 Tenter le defi</button>' +
          '<button class="btn-ghost btn-sm" data-navigate="highlights">← Temps Forts</button></div></div>';
        var go = document.getElementById('ltn-go');
        if (go) go.addEventListener('click', function () { _activeLightningId = h.id; renderLightningChallenge(main); });
      }
    };
    if (!db) { render([]); return; }
    db.ref('highlight_scores/' + h.id).once('value', function (snap) {
      var val = snap.val() || {};
      render(Object.keys(val).map(function (k) { return { key: k, name: val[k].name, score: val[k].score || 0, ts: val[k].ts || '' }; }));
    }, function () { render([]); });
  }

  function setActiveLightning(id) { _activeLightningId = id; }

  /* ============ BOSS DU JOUR (quiz de synthese chrono + classement) ============ */
  var BOSS_QUIZZES = {
    1: [
      { q: 'Que structure la methode CRAC d\'un bon prompt ?', o: ['Contexte, Role, Action, Contraintes', 'Copier, Relire, Analyser, Coller', 'Creer, Repeter, Ajuster, Comparer'], a: 0 },
      { q: 'Qu\'est-ce qui ameliore le PLUS un prompt vague ?', o: ['Le rendre plus court', 'Donner un role + une cible + des contraintes precises', 'Mettre des majuscules'], a: 1 },
      { q: 'A quoi sert un persona marketing ?', o: ['Definir precisement la cible', 'Choisir une couleur', 'Calculer le prix'], a: 0 },
      { q: 'Le "few-shot prompting" consiste a...', o: ['Ecrire le moins possible', 'Donner quelques exemples du resultat attendu', 'Poser une seule question'], a: 1 },
      { q: 'Quel outil pour generer/raffiner du TEXTE marketing ?', o: ['Un tableur', 'Un LLM (ChatGPT, Claude)', 'Un logiciel de retouche photo'], a: 1 }
    ],
    2: [
      { q: 'Stable Diffusion et FLUX servent a...', o: ['Generer des images', 'Ecrire du code', 'Analyser du son'], a: 0 },
      { q: 'Une charte de marque coherente inclut...', o: ['Uniquement un logo', 'Logo + palette + ton de voix', 'Le chiffre d\'affaires'], a: 1 },
      { q: 'Pour detourer une photo produit, on utilise...', o: ['La suppression de fond (RMBG)', 'La traduction', 'Un A/B test'], a: 0 },
      { q: 'Un bon nom de marque est avant tout...', o: ['Long et complexe', 'Memorable et disponible', 'En latin'], a: 1 },
      { q: 'La palette de couleurs influence surtout...', o: ['La vitesse du site', 'La perception emotionnelle de la marque', 'Le prix de revient'], a: 1 }
    ],
    3: [
      { q: 'A quoi sert l\'A/B testing ?', o: ['Comparer 2 variantes pour optimiser', 'Traduire un texte', 'Generer un logo'], a: 0 },
      { q: 'MusicGen permet de generer...', o: ['Des images', 'De la musique / des jingles', 'Des tableaux'], a: 1 },
      { q: 'Un plan media repartit principalement...', o: ['Le budget entre les canaux', 'Les couleurs de marque', 'Les mots de passe'], a: 0 },
      { q: 'Le CTR (Click-Through Rate) mesure...', o: ['Le taux de clic', 'Le cout de production', 'La taille du fichier'], a: 0 },
      { q: 'Un bon headline publicitaire est...', o: ['Long et technique', 'Court, accrocheur, oriente benefice', 'Sans verbe'], a: 1 }
    ],
    4: [
      { q: 'Le SEO optimise...', o: ['La musique de la pub', 'Le referencement sur Google', 'Le logo'], a: 1 },
      { q: 'Un pitch de 30s efficace contient...', o: ['Uniquement le prix', 'La liste des fonctionnalites brutes', 'Hook + probleme + solution + preuve + CTA'], a: 2 },
      { q: 'Une meta description fait idealement...', o: ['1000 mots', '~155 caracteres', '3 caracteres'], a: 1 },
      { q: 'Une landing page convertit grace a...', o: ['Beaucoup de texte gris', 'Aucun bouton', 'Un CTA clair + preuve sociale'], a: 2 },
      { q: 'Whisper (OpenAI) sert a...', o: ['Generer des images', 'La transcription audio -> texte', 'Calculer le ROAS'], a: 1 }
    ]
  };
  var _activeBossId = null;
  var _bossTimer = null;
  var BOSS_SECONDS = 120;
  var BOSS_PASS_PCT = 60;

  function currentBoss() {
    if (_activeBossId) { var byId = HIGHLIGHTS.find(function (x) { return x.id === _activeBossId; }); if (byId) return byId; }
    var dt = nowDayTime();
    var act = HIGHLIGHTS.find(function (h) { return h.type === 'boss' && isHighlightActive(h, dt); });
    if (act) return act;
    var avail = HIGHLIGHTS.filter(function (h) { return h.type === 'boss' && isHighlightAvailable(h, dt); });
    if (avail.length) return avail[avail.length - 1];
    return HIGHLIGHTS.find(function (h) { return h.type === 'boss'; });
  }
  function bossQuestions(h) { return BOSS_QUIZZES[h.day] || BOSS_QUIZZES[1]; }

  function renderBossChallenge(main) {
    var AIA = window.AIA;
    if (_bossTimer) { clearInterval(_bossTimer); _bossTimer = null; }
    var h = currentBoss();
    _activeBossId = null;
    if (!h) { main.innerHTML = '<div class="page-header"><h1>Boss</h1></div><div class="glass-card" style="padding:2rem;text-align:center">Aucun Boss disponible.</div>'; return; }
    var dt = nowDayTime();
    if (!isHighlightAvailable(h, dt)) {
      main.innerHTML = '<div class="page-header"><h1>' + (h.icon || '👑') + ' ' + escapeHtml(h.title) + '</h1></div>' +
        '<div class="glass-card" style="text-align:center;padding:2rem">🔒 Ce Boss s\'ouvre a ' + h.timeStart + '. Reviens quand le formateur lance le defi !' +
        '<div style="margin-top:1rem"><button class="btn-outline" data-navigate="highlights">← Temps Forts</button></div></div>';
      return;
    }
    var qs = bossQuestions(h);
    main.innerHTML =
      '<div class="page-header"><h1>' + (h.icon || '👑') + ' <span class="gradient-text">' + escapeHtml(h.title) + '</span></h1>' +
      '<p class="page-subtitle">Defi de synthese chrono — valide tes acquis du jour. Ton score entre au classement.</p></div>' +
      '<div class="ltn-card glass-card">' +
      '<div class="ltn-brief"><strong>🎯 Objectif :</strong> ' + escapeHtml(h.desc || '') + '</div>' +
      '<div class="ltn-rules">⏱️ ' + BOSS_SECONDS + 's &bull; ' + qs.length + ' questions &bull; ✅ ' + BOSS_PASS_PCT + '% pour vaincre le Boss &bull; +' + h.xp + ' XP</div>' +
      '<div class="ltn-actions"><button class="btn-primary" id="boss-start">⚔️ Affronter le Boss</button>' +
      '<button class="btn-ghost btn-sm" id="boss-see-rank">📊 Voir le classement</button></div>' +
      '</div>';
    document.getElementById('boss-start').addEventListener('click', function () { startBossQuiz(main, h); });
    document.getElementById('boss-see-rank').addEventListener('click', function () { showBossRanking(main, h, false); });
  }

  function startBossQuiz(main, h) {
    if (_bossTimer) { clearInterval(_bossTimer); _bossTimer = null; }
    var qs = bossQuestions(h);
    var remaining = BOSS_SECONDS;
    var html = '<div class="page-header"><h1>' + (h.icon || '👑') + ' ' + escapeHtml(h.title) + '</h1></div>' +
      '<div class="ltn-card glass-card"><div class="ltn-timer" id="boss-timer">' + fmtTime(remaining) + '</div>' +
      '<div class="boss-quiz">';
    qs.forEach(function (item, qi) {
      html += '<div class="boss-q" data-qi="' + qi + '"><div class="boss-q-text">' + (qi + 1) + '. ' + escapeHtml(item.q) + '</div><div class="boss-opts">';
      item.o.forEach(function (opt, oi) {
        html += '<label class="boss-opt"><input type="radio" name="boss-q-' + qi + '" value="' + oi + '"> <span>' + escapeHtml(opt) + '</span></label>';
      });
      html += '</div></div>';
    });
    html += '</div><div class="ltn-actions"><button class="btn-primary" id="boss-submit">✅ Valider mes reponses</button></div></div>';
    main.innerHTML = html;
    var submitted = false;
    var submit = function () {
      if (submitted) return; submitted = true;
      if (_bossTimer) { clearInterval(_bossTimer); _bossTimer = null; }
      var correct = 0;
      qs.forEach(function (item, qi) {
        var sel = main.querySelector('input[name="boss-q-' + qi + '"]:checked');
        if (sel && parseInt(sel.value, 10) === item.a) correct++;
      });
      finishBoss(main, h, correct, qs.length, BOSS_SECONDS - remaining);
    };
    document.getElementById('boss-submit').addEventListener('click', submit);
    _bossTimer = setInterval(function () {
      remaining--;
      var el = document.getElementById('boss-timer');
      if (!el) { clearInterval(_bossTimer); _bossTimer = null; return; }
      el.textContent = fmtTime(remaining);
      if (remaining <= 20) el.classList.add('urgent');
      if (remaining <= 0) submit();
    }, 1000);
  }

  function finishBoss(main, h, correct, total, elapsed) {
    var AIA = window.AIA;
    var pct = total > 0 ? Math.round(correct * 100 / total) : 0;
    var passed = pct >= BOSS_PASS_PCT;
    var st = AIA.getState();
    st.highlightsCompleted = st.highlightsCompleted || {};
    st.bossTried = st.bossTried || {};
    var firstClear = passed && !st.highlightsCompleted[h.id];
    if (firstClear) {
      st.highlightsCompleted[h.id] = true;
      if (AIA.addXP) AIA.addXP(h.xp, 'Boss vaincu : ' + h.title);
      if (AIA.awardBadge) AIA.awardBadge('boss-slayer');
    } else if (!passed && !st.highlightsCompleted[h.id] && !st.bossTried[h.id] && AIA.addXP) {
      AIA.addXP(15, 'Boss tente : ' + h.title); // consolation une seule fois (anti-farming)
    }
    st.bossTried[h.id] = true;
    if (AIA.saveState) AIA.saveState();
    var color = passed ? '#2ecc71' : '#e67e22';
    main.innerHTML =
      '<div class="page-header"><h1>' + (h.icon || '👑') + ' ' + (passed ? 'Boss vaincu !' : 'Boss resiste...') + '</h1></div>' +
      '<div class="ltn-card glass-card">' +
      '<div class="ltn-result"><div class="ltn-grade" style="color:' + color + '">' + (passed ? '🏆' : '💪') + '</div>' +
      '<div class="ltn-score">' + correct + '<span>/' + total + '</span></div></div>' +
      '<p class="ltn-fb">' + pct + '% &bull; ' + (passed ? 'Bravo, tu maitrises les acquis du jour ! +' + h.xp + ' XP + badge.' : 'Il faut ' + BOSS_PASS_PCT + '%. Revois et reessaie ! (+15 XP)') + ' &bull; ' + elapsed + 's</p>' +
      '<div class="ltn-rank-zone" id="boss-rank-zone">📊 Envoi au classement...</div>' +
      '<div class="ltn-actions"><button class="btn-outline btn-sm" id="boss-retry">🔁 Reessayer</button>' +
      '<button class="btn-ghost btn-sm" data-navigate="highlights">← Temps Forts</button></div>' +
      '</div>';
    var retry = document.getElementById('boss-retry');
    if (retry) retry.addEventListener('click', function () { _activeBossId = h.id; renderBossChallenge(main); });
    try { if (AIA.pushFeed) AIA.pushFeed({ action: 'highlight-done', target: h.title }); } catch (e) {}
    postBossScore(h.id, pct, function () { showBossRanking(main, h, true); });
  }

  function postBossScore(bid, score, cb) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var db = AIA.db, key = st.user && st.user.accountKey;
    if (!db || !key) { if (cb) cb(false); return; }
    var name = (st.user && (st.user.name || ((st.user.firstName || '') + ' ' + (st.user.lastName || '')).trim())) || 'Etudiant';
    var ref = db.ref('boss_scores/' + bid + '/' + key);
    ref.once('value', function (snap) {
      var prev = snap.val();
      if (prev && prev.score >= score) { if (cb) cb(true); return; }
      var done = false;
      var to = setTimeout(function () { if (!done) { done = true; if (cb) cb(true); } }, 4000);
      ref.set({ name: name, score: score, ts: new Date().toISOString() }, function () { if (done) return; done = true; clearTimeout(to); if (cb) cb(true); });
    }, function () { if (cb) cb(false); });
  }

  function showBossRanking(main, h, inline) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var db = AIA.db, myKey = st.user && st.user.accountKey;
    var zone = inline ? document.getElementById('boss-rank-zone') : null;
    var render = function (rows) {
      if (inline && !zone) return; // l'etudiant a quitte la page avant le retour Firebase : ne pas ecraser la page courante
      rows.sort(function (a, b) { return b.score - a.score || (a.ts < b.ts ? -1 : 1); });
      var medals = ['🥇', '🥈', '🥉'];
      var html = '<div class="ltn-rank"><h3 class="ltn-rank-title">🏆 Classement Boss — ' + escapeHtml(h.title) + '</h3>';
      if (!rows.length) { html += '<p class="ltn-empty">Personne n\'a encore affronte ce Boss. A toi de jouer !</p>'; }
      else {
        html += '<div class="ltn-podium">' + rows.slice(0, 3).map(function (r, i) {
          var me = myKey && r.key === myKey;
          return '<div class="ltn-pod ltn-pod-' + (i + 1) + (me ? ' me' : '') + '"><div class="ltn-pod-medal">' + medals[i] + '</div>' +
            '<div class="ltn-pod-name">' + escapeHtml(r.name || 'Etudiant') + (me ? ' (toi)' : '') + '</div>' +
            '<div class="ltn-pod-score">' + r.score + '%</div></div>';
        }).join('') + '</div>';
        if (myKey) {
          var myIdx = rows.findIndex(function (r) { return r.key === myKey; });
          if (myIdx >= 3) html += '<div class="ltn-myrank">Ton rang : <strong>#' + (myIdx + 1) + '</strong> / ' + rows.length + ' &bull; ' + rows[myIdx].score + '%</div>';
          else if (myIdx >= 0) html += '<div class="ltn-myrank">🎉 Tu es sur le podium !</div>';
        }
        html += '<div class="ltn-rank-list">' + rows.slice(0, 10).map(function (r, i) {
          var me = myKey && r.key === myKey;
          return '<div class="ltn-rank-row' + (me ? ' me' : '') + '"><span class="ltn-rk">#' + (i + 1) + '</span><span class="ltn-rn">' + escapeHtml(r.name || 'Etudiant') + '</span><span class="ltn-rs">' + r.score + '%</span></div>';
        }).join('') + '</div>';
      }
      html += '<p class="ltn-rank-foot">Le score = % de bonnes reponses. Reessaie pour grimper au classement !</p></div>';
      if (zone) { zone.innerHTML = html; }
      else {
        main.innerHTML = '<div class="page-header"><h1>' + (h.icon || '👑') + ' ' + escapeHtml(h.title) + '</h1></div><div class="ltn-card glass-card">' + html +
          '<div class="ltn-actions"><button class="btn-primary btn-sm" id="boss-go">⚔️ Affronter le Boss</button>' +
          '<button class="btn-ghost btn-sm" data-navigate="highlights">← Temps Forts</button></div></div>';
        var go = document.getElementById('boss-go');
        if (go) go.addEventListener('click', function () { _activeBossId = h.id; renderBossChallenge(main); });
      }
    };
    if (!db) { render([]); return; }
    db.ref('boss_scores/' + h.id).once('value', function (snap) {
      var val = snap.val() || {};
      render(Object.keys(val).map(function (k) { return { key: k, name: val[k].name, score: val[k].score || 0, ts: val[k].ts || '' }; }));
    }, function () { render([]); });
  }

  function setActiveBoss(id) { _activeBossId = id; }

  /* ============ EXPORTS ============ */
  window.AIA = window.AIA || {};
  window.AIA.HIGHLIGHTS = HIGHLIGHTS;
  window.AIA.renderHighlightsBanner = renderHighlightsBanner;
  window.AIA.renderHighlightsPage = renderHighlightsPage;
  window.AIA.wireHighlightCTAs = wireHighlightCTAs;
  window.AIA.getNextHighlight = function () { return getNextHighlight(nowDayTime()); };
  window.AIA.renderLightningChallenge = renderLightningChallenge;
  window.AIA.setActiveLightning = setActiveLightning;
  window.AIA.renderBossChallenge = renderBossChallenge;
  window.AIA.setActiveBoss = setActiveBoss;
})();
