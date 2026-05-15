/* ==============================================
   AI MARKETING ACADEMY — Core Application
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  // === SECURITY: Domain allowlist (protects against iframe embed / unauthorized hosting) ===
  var ALLOWED_HOSTS = ['maximebabonneau.github.io', 'localhost', '127.0.0.1', '0.0.0.0'];
  if (typeof location !== 'undefined' && location.hostname &&
      ALLOWED_HOSTS.indexOf(location.hostname) === -1 &&
      location.protocol !== 'file:') {
    // Refuse to initialize on unauthorized origins
    try {
      document.documentElement.innerHTML =
        '<div style="font-family:sans-serif;text-align:center;padding:3rem;color:#fff;background:#0d1117;height:100vh">' +
        '<h1 style="color:#f5b731">🔒 Acces restreint</h1>' +
        '<p>Cette application AI Marketing Academy est reservee aux etudiants de IDRAC Business School.</p>' +
        '<p style="color:#999;font-size:0.85rem;margin-top:1rem">Origine non autorisee : <code>' + location.hostname + '</code></p>' +
        '<p style="color:#999;font-size:0.85rem">Acces officiel : <a href="https://maximebabonneau.github.io/AtelierIAIdrac/" style="color:#f5b731">https://maximebabonneau.github.io/AtelierIAIdrac/</a></p>' +
        '</div>';
    } catch (e) {}
    throw new Error('Unauthorized origin: ' + location.hostname);
  }

  var CONFIG = {
    classCode: 'AIMARK2026',
    adminHash: '9d9e119b',
    disablePublicRegistration: true, // Admin must create accounts via admin panel
    allowedHosts: ALLOWED_HOSTS,
    storagePrefix: 'aia_',
    dates: ['2026-06-08','2026-06-09','2026-06-10','2026-06-11'],
    dateLabels: ['Lundi 8 Juin','Mardi 9 Juin','Mercredi 10 Juin','Jeudi 11 Juin'],
    mentorName: 'Maxime BABONNEAU',
    school: 'IDRAC Business School',
    firebaseConfig: {
      apiKey: 'AIzaSyAddL7QdGEb-ZCBTmRg_xElm_b-WdT7eHM',
      authDomain: 'idrac-ai-academy.firebaseapp.com',
      databaseURL: 'https://idrac-ai-academy-default-rtdb.europe-west1.firebasedatabase.app',
      projectId: 'idrac-ai-academy',
      storageBucket: 'idrac-ai-academy.firebasestorage.app',
      messagingSenderId: '1009333708897',
      appId: '1:1009333708897:web:da729ad1c2c6442eb8e220'
    }
  };

  var LEVELS = [
    { level: 1, title: 'Novice IA', xpNeeded: 0 },
    { level: 2, title: 'Curieux Digital', xpNeeded: 100 },
    { level: 3, title: 'Apprenti Prompt', xpNeeded: 250 },
    { level: 4, title: 'Createur IA', xpNeeded: 450 },
    { level: 5, title: 'Stratege Marketing', xpNeeded: 700 },
    { level: 6, title: 'Expert IA', xpNeeded: 1000 },
    { level: 7, title: 'Maitre du Marketing IA', xpNeeded: 1400 }
  ];

  var BADGES = [
    { id: 'first-login', icon: '🚀', name: 'Premier Pas', desc: 'Premiere connexion' },
    { id: 'prompt-master', icon: '✍️', name: 'Prompt Master', desc: 'Atelier Prompt Engineering' },
    { id: 'visual-creator', icon: '🎨', name: 'Createur Visuel', desc: 'Atelier generation visuelle' },
    { id: 'copywriter', icon: '📝', name: 'Copywriter IA', desc: 'Atelier copywriting' },
    { id: 'video-star', icon: '🎬', name: 'Video Star', desc: 'Atelier video IA' },
    { id: 'team-player', icon: '🤝', name: 'Team Player', desc: 'Rejoindre le Business Game' },
    { id: 'day1-complete', icon: '⭐', name: 'Jour 1', desc: 'Toutes activites Jour 1' },
    { id: 'day2-complete', icon: '🌟', name: 'Jour 2', desc: 'Toutes activites Jour 2' },
    { id: 'day3-complete', icon: '💫', name: 'Jour 3', desc: 'Toutes activites Jour 3' },
    { id: 'day4-complete', icon: '🏆', name: 'Jour 4', desc: 'Toutes activites Jour 4' },
    { id: 'streak-3', icon: '🔥', name: 'En Feu', desc: '3 jours consecutifs' },
    { id: 'xp-500', icon: '💎', name: 'Diamant', desc: 'Atteindre 500 XP' },
    { id: 'all-tools', icon: '🧰', name: 'Outille', desc: 'Explorer tous les outils' },
    { id: 'game-complete', icon: '🎯', name: 'Entrepreneur', desc: 'Terminer le Business Game' },
    { id: 'graduate', icon: '🎓', name: 'Diplome', desc: 'Terminer les 4 jours' },
    { id: 'battle-win', icon: '⚔️', name: 'Champion', desc: 'Gagner une battle' },
    { id: 'quiz-perfect', icon: '🧠', name: 'Genie', desc: 'Quiz parfait' },
    { id: 'avatar-custom', icon: '👾', name: 'Pixel Artist', desc: 'Customiser son avatar' },
    { id: 'demo-all', icon: '🔬', name: 'Scientifique', desc: 'Tester toutes les demos' },
    { id: 'phase1-done', icon: '💡', name: 'Stratege', desc: 'Phase 1 du Business Game completee' },
    { id: 'phase2-done', icon: '🎨', name: 'Brand Builder', desc: 'Phase 2 du Business Game completee' },
    { id: 'phase3-done', icon: '📢', name: 'Campaigner', desc: 'Phase 3 du Business Game completee' },
    { id: 'phase4-done', icon: '🚀', name: 'Pitcher', desc: 'Phase 4 du Business Game completee' },
    { id: 'asset-collector', icon: '📎', name: 'Asset Collector', desc: '10+ assets attaches a votre campagne' },
    { id: 'top-voted', icon: '👑', name: 'Top Voted', desc: 'Recevoir 3+ votes pour votre campagne' },
    { id: 'voter', icon: '♥️', name: 'Supporteur', desc: 'Voter pour 3 campagnes' },
    // === Phase A : 20 nouveaux badges ===
    { id: 'reflective', icon: '🪞', name: 'Reflechi', desc: 'Premiere reflexion ecrite apres une demo', rarity: 'common' },
    { id: 'deep-thinker', icon: '🧘', name: 'Penseur Profond', desc: '10 reflexions ecrites', rarity: 'rare' },
    { id: 'journaler', icon: '📔', name: 'Chroniqueur', desc: 'Premiere entree dans le journal de bord', rarity: 'common' },
    { id: 'journal-streak', icon: '✒️', name: 'Plume Quotidienne', desc: 'Une entree journal par jour pendant 4 jours', rarity: 'rare' },
    { id: 'resource-explorer', icon: '📚', name: 'Explorateur', desc: 'Consulter 10 ressources de la bibliotheque', rarity: 'common' },
    { id: 'hf-master', icon: '🤗', name: 'HF Master', desc: 'Tester les 11 demos HuggingFace', rarity: 'rare' },
    { id: 'audio-wizard', icon: '🎙️', name: 'Audio Wizard', desc: 'Demos Music + TTS + Speech testees', rarity: 'rare' },
    { id: 'visual-master', icon: '🖼️', name: 'Visual Master', desc: 'Demos Image + Logo + BgRemove + Upscale testees', rarity: 'rare' },
    { id: 'first-prompt', icon: '⌨️', name: 'First Prompt', desc: 'Premier prompt soumis dans Battle', rarity: 'common' },
    { id: 'grade-a', icon: '🏆', name: 'Grade A', desc: 'Obtenir un score A en Battle de Prompts', rarity: 'rare' },
    { id: 'speed-demon', icon: '⚡', name: 'Speed Demon', desc: 'Completer 3 Lightning Rounds', rarity: 'rare' },
    { id: 'boss-slayer', icon: '🐉', name: 'Boss Slayer', desc: 'Vaincre 2 Boss Challenges', rarity: 'epic' },
    { id: 'showcase-star', icon: '🎪', name: 'Showcase Star', desc: 'Participer a 3 Showcases', rarity: 'rare' },
    { id: 'perfectionist', icon: '💯', name: 'Perfectionniste', desc: 'Valider 12/12 etapes Business Game', rarity: 'epic' },
    { id: 'early-bird', icon: '🌅', name: 'Early Bird', desc: 'Se connecter avant 9h le jour J', rarity: 'common' },
    { id: 'night-owl', icon: '🌙', name: 'Night Owl', desc: 'Activite enregistree apres 22h', rarity: 'common' },
    { id: 'helper', icon: '🤝', name: 'Aidant', desc: 'Commenter / encourager 5 pairs', rarity: 'rare' },
    { id: 'rpg-winner', icon: '⚔️', name: 'Duelliste', desc: 'Premiere victoire en RPG PvP', rarity: 'common' },
    { id: 'campaign-shipper', icon: '🚢', name: 'Campaign Shipper', desc: 'Exporter sa campagne en JSON', rarity: 'common' },
    { id: 'legend', icon: '🦄', name: 'Legende IDRAC', desc: 'Tous les badges epic + 1000 XP', rarity: 'legendary' }
  ];

  var PROGRAM = {
    day1: {
      title: 'Decouverte de l\'IA Generative', subtitle: 'Introduction et premiers pas avec l\'IA en marketing', xp: 200,
      matin: [
        { id: 'd1-accueil', type: 'cours', time: '9h00-9h30', title: 'Accueil & Ice Breaker', desc: 'Presentation, objectifs, creation de votre avatar', xp: 15 },
        { id: 'd1-intro-ia', type: 'cours', time: '9h30-10h30', title: 'L\'IA Generative : Revolution Marketing', desc: 'Comprendre ChatGPT, Claude, Midjourney et leur impact', xp: 25 },
        { id: 'd1-premier-prompt', type: 'atelier', time: '10h45-12h00', title: 'Premiers Prompts', desc: 'Atelier pratique : ecrire ses premiers prompts efficaces', xp: 40 }
      ],
      aprem: [
        { id: 'd1-prompt-avance', type: 'atelier', time: '13h30-15h00', title: 'Prompt Engineering Avance', desc: 'Chain-of-thought, few-shot, role prompting', xp: 50 },
        { id: 'd1-defi', type: 'defi', time: '15h15-16h30', title: 'Defi Prompt Battle', desc: 'Battle de prompts entre etudiants avec vote', xp: 50 },
        { id: 'd1-debrief', type: 'cours', time: '16h30-17h00', title: 'Debrief & Quiz du Jour', desc: 'Retour sur les apprentissages et quiz interactif', xp: 20 }
      ]
    },
    day2: {
      title: 'Creation de Contenu IA', subtitle: 'Visuels, copywriting et video avec l\'IA', xp: 250,
      matin: [
        { id: 'd2-visuel', type: 'cours', time: '9h00-9h45', title: 'Generation Visuelle IA', desc: 'Midjourney, DALL-E, Canva AI : panorama et bonnes pratiques', xp: 20 },
        { id: 'd2-atelier-image', type: 'atelier', time: '9h45-11h00', title: 'Atelier Creation Visuelle', desc: 'Creer des visuels marketing avec l\'IA generative', xp: 45 },
        { id: 'd2-copywriting', type: 'atelier', time: '11h15-12h30', title: 'Copywriting IA', desc: 'Rediger des textes marketing percutants avec l\'IA', xp: 45 }
      ],
      aprem: [
        { id: 'd2-video', type: 'atelier', time: '13h30-15h00', title: 'Video & Voix IA', desc: 'HeyGen, ElevenLabs : creer des videos et voix off IA', xp: 50 },
        { id: 'd2-demo-sentiment', type: 'demo', time: '15h15-16h00', title: 'Demo : Analyse de Sentiment', desc: 'Tester l\'analyse de sentiment sur des avis clients', xp: 40 },
        { id: 'd2-challenge', type: 'defi', time: '16h00-17h00', title: 'Challenge Creatif', desc: 'Creer une campagne complete en equipe', xp: 50 }
      ]
    },
    day3: {
      title: 'Strategie Marketing IA', subtitle: 'SEO, analytics, chatbots et automatisation', xp: 280,
      matin: [
        { id: 'd3-seo', type: 'cours', time: '9h00-10h00', title: 'SEO & Analytics IA', desc: 'Optimisation SEO avec l\'IA, analyse de donnees marketing', xp: 30 },
        { id: 'd3-demo-seo', type: 'demo', time: '10h00-11h00', title: 'Demo : SEO Analyzer', desc: 'Analyser et optimiser le SEO d\'une page en temps reel', xp: 40 },
        { id: 'd3-abtest', type: 'demo', time: '11h15-12h30', title: 'Demo : A/B Testing IA', desc: 'Simuler des tests A/B automatises par l\'IA', xp: 40 }
      ],
      aprem: [
        { id: 'd3-chatbot', type: 'demo', time: '13h30-14h30', title: 'Demo : Chatbot Marketing', desc: 'Construire un chatbot marketing conversationnel', xp: 45 },
        { id: 'd3-game-launch', type: 'game', time: '14h30-16h00', title: 'Business Game : Lancement', desc: 'Former les equipes et demarrer le Business Game', xp: 50 },
        { id: 'd3-arena', type: 'defi', time: '16h00-17h00', title: 'Arena : Quiz & Battles', desc: 'Quiz interactif et battles entre equipes', xp: 75 }
      ]
    },
    day4: {
      title: 'Projet Final & Pitch', subtitle: 'Finalisation, presentations et awards', xp: 300,
      matin: [
        { id: 'd4-finalize', type: 'game', time: '9h00-11h00', title: 'Business Game : Sprint Final', desc: 'Finaliser les livrables avec l\'aide de l\'IA', xp: 60 },
        { id: 'd4-demo-playground', type: 'demo', time: '11h00-12h00', title: 'Demo : Playground Libre', desc: 'Experimenter librement avec les modeles IA', xp: 40 },
        { id: 'd4-prep-pitch', type: 'atelier', time: '12h00-12h30', title: 'Preparation Pitch', desc: 'Preparer sa presentation finale', xp: 20 }
      ],
      aprem: [
        { id: 'd4-pitch', type: 'game', time: '14h00-16h00', title: 'Pitchs & Votes', desc: 'Chaque equipe presente, la classe vote', xp: 80 },
        { id: 'd4-awards', type: 'cours', time: '16h00-16h30', title: 'Ceremonie des Awards', desc: 'Remise des badges, classement final, diplomes', xp: 50 },
        { id: 'd4-closing', type: 'cours', time: '16h30-17h00', title: 'Cloture & Perspectives', desc: 'Bilan, ressources et prochaines etapes', xp: 50 }
      ]
    }
  };

  var AI_TOOLS = [
    { id: 'chatgpt', name: 'ChatGPT', icon: '🤖', tag: 'freemium', desc: 'Assistant IA polyvalent d\'OpenAI', uses: ['Redaction','Brainstorming','Analyse'] },
    { id: 'claude', name: 'Claude', icon: '🧠', tag: 'freemium', desc: 'IA conversationnelle d\'Anthropic', uses: ['Analyse','Redaction','Code'] },
    { id: 'midjourney', name: 'Midjourney', icon: '🎨', tag: 'paid', desc: 'Generation d\'images artistiques', uses: ['Visuels','Branding','Concepts'] },
    { id: 'canva', name: 'Canva AI', icon: '✨', tag: 'freemium', desc: 'Design graphique assiste par IA', uses: ['Posts','Presentations','Videos'] },
    { id: 'copyai', name: 'Copy.ai', icon: '📝', tag: 'freemium', desc: 'Redaction marketing automatisee', uses: ['Emails','Ads','Social'] },
    { id: 'jasper', name: 'Jasper', icon: '💡', tag: 'paid', desc: 'Plateforme de contenu IA entreprise', uses: ['Blog','SEO','Brand voice'] },
    { id: 'heygen', name: 'HeyGen', icon: '🎬', tag: 'freemium', desc: 'Creation de videos avec avatars IA', uses: ['Videos','Formations','Ads'] },
    { id: 'elevenlabs', name: 'ElevenLabs', icon: '🎙️', tag: 'freemium', desc: 'Synthese vocale ultra-realiste', uses: ['Voix off','Podcast','Dubbing'] },
    { id: 'perplexity', name: 'Perplexity', icon: '🔍', tag: 'free', desc: 'Moteur de recherche IA avec sources', uses: ['Veille','Recherche','Fact-check'] }
  ];

  var GAME_DELIVERABLES = {
    phase1: [{ id: 'product-idea', label: 'Idee produit/service validee' },{ id: 'target-persona', label: 'Persona cible defini' },{ id: 'market-analysis', label: 'Analyse marche (via IA)' }],
    phase2: [{ id: 'brand-name', label: 'Nom de marque genere (IA)' },{ id: 'logo', label: 'Logo cree (Midjourney/Canva)' },{ id: 'brand-guide', label: 'Charte graphique' }],
    phase3: [{ id: 'ad-visuals', label: 'Visuels publicitaires (IA)' },{ id: 'copy', label: 'Textes marketing (Copy.ai)' },{ id: 'media-plan', label: 'Plan media' }],
    phase4: [{ id: 'landing-page', label: 'Landing page mockup' },{ id: 'pitch-video', label: 'Video pitch (HeyGen)' },{ id: 'final-deck', label: 'Deck de presentation' }]
  };

  var state = {
    user: null, xp: { total: 0, history: [] }, progress: {}, badges: [],
    streak: { count: 0, lastDate: null }, gameNotes: '', gameDeliverables: {},
    toolsExplored: [], avatar: null, currentPage: 'dashboard', demosCompleted: [],
    reactions: {}
  };

  var Storage = {
    get: function (key, fb) { try { var v = localStorage.getItem(CONFIG.storagePrefix + key); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } },
    set: function (key, val) { try { localStorage.setItem(CONFIG.storagePrefix + key, JSON.stringify(val)); } catch (e) {} }
  };

  var db = null;

  function getAccountKey(lastName, firstName) {
    return (lastName.trim() + '_' + firstName.trim()).toLowerCase().replace(/[^a-z0-9_]/g, '');
  }

  function createAccount(lastName, firstName, passwordHash, callback) {
    var key = getAccountKey(lastName, firstName);
    db.ref('accounts/' + key).once('value', function (snap) {
      if (snap.exists()) return callback({ error: 'Ce compte existe deja. Connectez-vous.' });
      var acct = { firstName: firstName.trim(), lastName: lastName.trim(), passwordHash: passwordHash, createdAt: new Date().toISOString(), lastLogin: null };
      db.ref('accounts/' + key).set(acct, function (err) {
        if (err) return callback({ error: 'Erreur de creation du compte.' });
        callback({ key: key, account: acct });
      });
    });
  }

  function loginAccount(lastName, firstName, passwordHash, callback) {
    var key = getAccountKey(lastName, firstName);
    db.ref('accounts/' + key).once('value', function (snap) {
      if (!snap.exists()) return callback({ error: 'Compte introuvable. Creez un compte.' });
      var acct = snap.val();
      if (acct.passwordHash !== passwordHash) return callback({ error: 'Mot de passe incorrect.' });
      acct.lastLogin = new Date().toISOString();
      db.ref('accounts/' + key).update({ lastLogin: acct.lastLogin });
      callback({ key: key, account: acct });
    });
  }

  var _saveDebounce = null;
  function _buildStudentSummary() {
    var pCount = 0; for (var p in state.progress) { if (state.progress[p]) pCount++; }
    return {
      name: state.user.name, xp: state.xp.total, level: getLevelInfo(state.xp.total).level,
      badges: state.badges.length, page: state.currentPage, avatar: state.avatar,
      lastSeen: Date.now(), online: true, progress: pCount,
      completedActivities: pCount, demosCompleted: state.demosCompleted ? state.demosCompleted.length : 0,
      streak: state.streak ? state.streak.count : 0
    };
  }

  function saveState() {
    if (!state.user || !state.user.accountKey || !db) return;
    if (_saveDebounce) clearTimeout(_saveDebounce);
    _saveDebounce = setTimeout(function () {
      db.ref('states/' + state.user.accountKey).set(state);
      db.ref('students/' + state.user.accountKey).set(_buildStudentSummary());
    }, 500);
  }

  function saveStateNow() {
    if (_saveDebounce) clearTimeout(_saveDebounce);
    if (!state.user || !state.user.accountKey || !db) return;
    db.ref('states/' + state.user.accountKey).set(state);
    db.ref('students/' + state.user.accountKey).set(_buildStudentSummary());
  }

  function submitActivity(actId, submission) {
    if (!state.user || !state.user.accountKey || !db) return;
    submission.timestamp = new Date().toISOString();
    submission.studentName = state.user.name;
    db.ref('submissions/' + actId + '/' + state.user.accountKey).set(submission);
  }

  var dayLocks = { day1: false, day2: true, day3: true, day4: true };
  var _dayLocksListener = null;

  // === Granular per-item locks managed by admin (Firebase /config/unlocks) ===
  // Default: EVERYTHING LOCKED. Admin progressively unlocks during the course.
  var unlocks = {
    demos: {},
    highlights: {},
    phases: {},
    activities: {}
  };
  var _unlocksListener = null;

  // Admin Student Mode — when ON, admin sees student view while keeping admin status
  var adminAsStudent = (function () {
    try { return localStorage.getItem('aia_admin_as_student') === '1'; } catch (e) { return false; }
  })();

  function listenDayLocks() {
    if (!db) return;
    _dayLocksListener = db.ref('config/dayLocks').on('value', function (snap) {
      var v = snap.val();
      if (v) dayLocks = v;
    });
    _unlocksListener = db.ref('config/unlocks').on('value', function (snap) {
      var v = snap.val();
      if (v) {
        unlocks = {
          demos: v.demos || {},
          highlights: v.highlights || {},
          phases: v.phases || {},
          activities: v.activities || {}
        };
      }
      if (window.AIA && window.AIA.onUnlocksChange) {
        try { window.AIA.onUnlocksChange(unlocks); } catch (e) {}
      }
    });
  }

  function isItemUnlocked(type, id) {
    if (state.user && state.user.isAdmin && !adminAsStudent) return true;
    if (!unlocks[type]) return false;
    return !!unlocks[type][id];
  }

  function setUnlock(type, id, value, callback) {
    if (!db) { if (callback) callback({ error: 'Firebase indisponible' }); return; }
    unlocks[type] = unlocks[type] || {};
    unlocks[type][id] = !!value;
    db.ref('config/unlocks/' + type + '/' + id).set(!!value, function (err) {
      if (callback) callback(err ? { error: String(err) } : { success: true });
    });
  }

  function setUnlocksBulk(type, ids, value, callback) {
    if (!db) { if (callback) callback({ error: 'Firebase indisponible' }); return; }
    unlocks[type] = unlocks[type] || {};
    var updates = {};
    ids.forEach(function (id) {
      unlocks[type][id] = !!value;
      updates['config/unlocks/' + type + '/' + id] = !!value;
    });
    db.ref().update(updates, function (err) {
      if (callback) callback(err ? { error: String(err) } : { success: true });
    });
  }

  function setAdminAsStudent(on) {
    adminAsStudent = !!on;
    try { localStorage.setItem('aia_admin_as_student', adminAsStudent ? '1' : '0'); } catch (e) {}
    var banner = document.getElementById('admin-as-student-banner');
    if (banner) banner.style.display = adminAsStudent ? 'flex' : 'none';
    var toggle = document.getElementById('admin-student-toggle');
    if (toggle) toggle.checked = adminAsStudent;
    if (state.currentPage) navigateTo(state.currentPage);
  }
  function getAdminAsStudent() { return adminAsStudent; }

  function isActivityUnlocked(actId, dayIdx) {
    if (state.user && state.user.isAdmin && !adminAsStudent) return true;
    if (unlocks.activities && unlocks.activities[actId] === false) return false;
    if (!(unlocks.activities && unlocks.activities[actId] === true)) {
      var dayKey0 = 'day' + (dayIdx + 1);
      if (dayLocks[dayKey0]) return false;
    }
    var d = PROGRAM['day' + (dayIdx + 1)];
    if (!d) return false;
    var all = d.matin.concat(d.aprem);
    var idx = -1;
    for (var i = 0; i < all.length; i++) { if (all[i].id === actId) { idx = i; break; } }
    if (idx <= 0) return true;
    return !!state.progress[all[idx - 1].id];
  }

  function loadAccountState(accountKey, callback) {
    db.ref('states/' + accountKey).once('value', function (snap) {
      var s = snap.val();
      if (s) Object.keys(s).forEach(function (k) { if (state.hasOwnProperty(k)) state[k] = s[k]; });
      if (callback) callback();
    });
  }

  function getAccountsFromFirebase(callback) {
    db.ref('accounts').once('value', function (snap) { callback(snap.val() || {}); });
  }

  function saveAccountsToFirebase(accts) { db.ref('accounts').set(accts); }

  function deleteStudentState(key) {
    db.ref('states/' + key).remove();
    db.ref('students/' + key).remove();
  }

  function initFirebase() {
    try {
      if (!firebase.apps.length) firebase.initializeApp(CONFIG.firebaseConfig);
      db = firebase.database();
      window.AIA = window.AIA || {};
      window.AIA.db = db;
    } catch (e) { console.error('Firebase init error:', e); }
  }

  function initParticles() {
    var c = document.getElementById('particles-canvas');
    if (!c) return;
    var ctx = c.getContext('2d'), pts = [], n = 50;
    function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    for (var i = 0; i < n; i++) pts.push({ x: Math.random()*c.width, y: Math.random()*c.height, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4, r: Math.random()*2+0.5 });
    (function draw() {
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(function(p){ p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=c.width; if(p.x>c.width)p.x=0; if(p.y<0)p.y=c.height; if(p.y>c.height)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='rgba(167,31,40,0.25)'; ctx.fill(); });
      for(var i=0;i<pts.length;i++) for(var j=i+1;j<pts.length;j++){
        var dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle='rgba(167,31,40,'+(0.08*(1-d/120))+')'; ctx.lineWidth=0.5; ctx.stroke(); }
      }
      requestAnimationFrame(draw);
    })();
  }

  function showToast(msg, type) {
    var c = document.getElementById('toast-container'), t = document.createElement('div');
    t.className = 'toast ' + (type||'info'); t.textContent = msg; c.appendChild(t);
    setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 3200);
  }

  function hashPass(str) { var h=0; for(var i=0;i<str.length;i++){h=((h<<5)-h+str.charCodeAt(i))|0;} return (h>>>0).toString(16); }

  function getLevelInfo(xp) {
    var lvl=LEVELS[0];
    for(var i=LEVELS.length-1;i>=0;i--){ if(xp>=LEVELS[i].xpNeeded){lvl=LEVELS[i];break;} }
    var next=LEVELS[lvl.level]||null;
    var pct=next?((xp-lvl.xpNeeded)/(next.xpNeeded-lvl.xpNeeded))*100:100;
    return {level:lvl.level,title:lvl.title,xpNeeded:lvl.xpNeeded,nextXp:next?next.xpNeeded:lvl.xpNeeded,progress:Math.min(100,pct)};
  }

  function addXP(amount, reason) {
    if (!state.xp) state.xp = { total: 0, history: [] };
    if (!Array.isArray(state.xp.history)) state.xp.history = [];
    state.xp.total = (state.xp.total || 0) + amount;
    state.xp.history.unshift({amount:amount,reason:reason||'',date:new Date().toISOString()});
    if(state.xp.history.length>50) state.xp.history.length=50;
    updateXPDisplay(); showXPPopup(amount,reason);
    if(state.xp.total>=500) awardBadge('xp-500');
    saveState();
  }
  function updateXPDisplay(){ var el=document.getElementById('nav-xp-amount'); if(el) el.textContent=state.xp.total; }
  function showXPPopup(amount,reason){
    var p=document.getElementById('xp-popup');
    document.getElementById('xp-popup-amount').textContent='+'+amount;
    document.getElementById('xp-popup-reason').textContent=reason;
    p.classList.remove('hidden'); setTimeout(function(){p.classList.add('hidden');},1600);
  }

  function awardBadge(id){
    if(state.badges.indexOf(id)!==-1) return;
    state.badges.push(id);
    var b=BADGES.find(function(x){return x.id===id;});
    if(b){ document.getElementById('badge-popup-icon').textContent=b.icon; document.getElementById('badge-popup-name').textContent=b.name; document.getElementById('badge-popup').classList.remove('hidden'); }
    saveState();
  }

  function completeActivity(actId,xp,reason){
    if(state.progress[actId]) return;
    state.progress[actId]=true; addXP(xp,reason); checkDayCompletion(); saveState();
    if(state.currentPage && state.currentPage.indexOf('day')===0) navigateTo(state.currentPage);
  }
  function checkDayCompletion(){
    ['day1','day2','day3','day4'].forEach(function(k,i){
      var d=PROGRAM[k], all=d.matin.concat(d.aprem);
      if(all.every(function(a){return state.progress[a.id];})) awardBadge('day'+(i+1)+'-complete');
    });
    if(['day1-complete','day2-complete','day3-complete','day4-complete'].every(function(b){return state.badges.indexOf(b)!==-1;})) awardBadge('graduate');
  }

  function updateStreak(){
    var today=new Date().toISOString().split('T')[0];
    if(state.streak.lastDate===today) return;
    var yest=new Date(Date.now()-86400000).toISOString().split('T')[0];
    state.streak.count = state.streak.lastDate===yest ? state.streak.count+1 : 1;
    state.streak.lastDate=today;
    if(state.streak.count>=3) awardBadge('streak-3');
    saveState();
  }

  function navigateTo(page){
    state.currentPage=page;
    var main=document.getElementById('main-content');
    main.classList.remove('page-transition'); void main.offsetWidth; main.classList.add('page-transition');
    if(page.indexOf('activity-')===0){
      var actId=page.replace('activity-','');
      var _dayIdx=-1;
      ['day1','day2','day3','day4'].forEach(function(k,i){var d=PROGRAM[k];d.matin.concat(d.aprem).forEach(function(a){if(a.id===actId)_dayIdx=i;});});
      if(_dayIdx>=0&&!isActivityUnlocked(actId,_dayIdx)){
        showToast('Completez l\'activite precedente d\'abord','warning');
        return;
      }
      if(window.AIA&&window.AIA.renderActivityDetail) window.AIA.renderActivityDetail(main,actId);
      updateNavActive('program'); window.scrollTo(0,0); saveState(); return;
    }
    var pages={
      dashboard:renderDashboard, program:renderProgram,
      day1:function(){renderDayView(1);}, day2:function(){renderDayView(2);}, day3:function(){renderDayView(3);}, day4:function(){renderDayView(4);},
      room:renderRoom, avatar:renderAvatarEditor, demos:renderDemos,
      'demo-prompt':function(){if(window.AIA&&window.AIA.renderDemoPrompt)window.AIA.renderDemoPrompt(main);},
      'demo-sentiment':function(){if(window.AIA&&window.AIA.renderDemoSentiment)window.AIA.renderDemoSentiment(main);},
      'demo-image':function(){if(window.AIA&&window.AIA.renderDemoImage)window.AIA.renderDemoImage(main);},
      'demo-chatbot':function(){if(window.AIA&&window.AIA.renderDemoChatbot)window.AIA.renderDemoChatbot(main);},
      'demo-abtest':function(){if(window.AIA&&window.AIA.renderDemoABTest)window.AIA.renderDemoABTest(main);},
      'demo-seo':function(){if(window.AIA&&window.AIA.renderDemoSEO)window.AIA.renderDemoSEO(main);},
      'demo-bg-remove':function(){if(window.AIA&&window.AIA.renderDemoBgRemove)window.AIA.renderDemoBgRemove(main);},
      'demo-music':function(){if(window.AIA&&window.AIA.renderDemoMusic)window.AIA.renderDemoMusic(main);},
      'demo-speech':function(){if(window.AIA&&window.AIA.renderDemoSpeech)window.AIA.renderDemoSpeech(main);},
      'demo-vqa':function(){if(window.AIA&&window.AIA.renderDemoVqa)window.AIA.renderDemoVqa(main);},
      'demo-tts':function(){if(window.AIA&&window.AIA.renderDemoTts)window.AIA.renderDemoTts(main);},
      'demo-upscale':function(){if(window.AIA&&window.AIA.renderDemoUpscale)window.AIA.renderDemoUpscale(main);},
      'demo-translate':function(){if(window.AIA&&window.AIA.renderDemoTranslate)window.AIA.renderDemoTranslate(main);},
      'demo-logo':function(){if(window.AIA&&window.AIA.renderDemoLogo)window.AIA.renderDemoLogo(main);},
      'demo-avatar':function(){if(window.AIA&&window.AIA.renderDemoAvatar)window.AIA.renderDemoAvatar(main);},
      battle:function(){if(window.AIA&&window.AIA.renderBattle)window.AIA.renderBattle(main);},
      rpg:function(){if(window.AIA&&window.AIA.renderRPG)window.AIA.renderRPG(main);},
      highlights:function(){if(window.AIA&&window.AIA.renderHighlightsPage)window.AIA.renderHighlightsPage(main);},
      resources:function(){if(window.AIA&&window.AIA.renderResources)window.AIA.renderResources(main);},
      journal:function(){if(window.AIA&&window.AIA.renderJournal)window.AIA.renderJournal(main);},
      checkins:function(){if(window.AIA&&window.AIA.renderCheckinsPage)window.AIA.renderCheckinsPage(main);},
      'assessment-pre':function(){if(window.AIA&&window.AIA.renderAssessment)window.AIA.renderAssessment(main,'pre');},
      'assessment-post':function(){if(window.AIA&&window.AIA.renderAssessment)window.AIA.renderAssessment(main,'post');},
      certificate:function(){if(window.AIA&&window.AIA.renderCertificate)window.AIA.renderCertificate(main);},
      skilltree:function(){if(window.AIA&&window.AIA.renderSkillTree)window.AIA.renderSkillTree(main);},
      'peer-review':function(){if(window.AIA&&window.AIA.renderPeerReview)window.AIA.renderPeerReview(main);},
      wall:function(){if(window.AIA&&window.AIA.renderWall)window.AIA.renderWall(main);},
      inbox:function(){if(window.AIA&&window.AIA.renderInbox)window.AIA.renderInbox(main);},
      shop:function(){if(window.AIA&&window.AIA.renderShop)window.AIA.renderShop(main);},
      arena:renderArena, 'business-game':function(){if(window.AIA&&window.AIA.renderBusinessGameNew){window.AIA.renderBusinessGameNew(document.getElementById('main-content'));}else{renderBusinessGame();}},
      showcase:function(){if(window.AIA&&window.AIA.renderCampaignShowcase)window.AIA.renderCampaignShowcase(document.getElementById('main-content'));},
      leaderboard:renderLeaderboard,
      tools:renderTools, profile:renderProfile, admin:renderAdmin
    };
    // Gate: demos & highlights require admin unlock (admin bypasses unless in student mode)
    if (page && page.indexOf('demo-') === 0 && !isItemUnlocked('demos', page)) {
      showToast('🔒 Demo verrouillee — l\'admin l\'a pas encore debloquee', 'warning');
      page = 'demos';
    }
    var fn=pages[page]; if(fn) fn();
    // Inject reflection block after demo pages render
    if (page && page.indexOf('demo-') === 0 && window.AIA && window.AIA.renderReflection) {
      setTimeout(function () {
        if (main.querySelector('[data-reflection-id="' + page + '"]')) return;
        var html = window.AIA.renderReflection(page);
        if (html) {
          var wrap = document.createElement('div');
          wrap.innerHTML = html;
          main.appendChild(wrap.firstChild);
          if (window.AIA.wireReflections) window.AIA.wireReflections(main);
        }
      }, 100);
    }
    updateNavActive(page); window.scrollTo(0,0); saveState();
  }

  function updateNavActive(page){
    document.querySelectorAll('.nav-link,.mobile-link').forEach(function(el){
      var t=el.getAttribute('data-navigate');
      el.classList.toggle('active',t===page||(page&&page.indexOf(t)===0));
    });
    if(state.user&&state.user.isAdmin&&!document.getElementById('nav-admin-link')){
      var nl=document.getElementById('nav-links'), a=document.createElement('a');
      a.href='#'; a.setAttribute('data-navigate','admin'); a.className='nav-link'; a.id='nav-admin-link';
      a.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Admin</span>';
      nl.appendChild(a);
    }
  }

  function getCurrentDay(){ var t=new Date().toISOString().split('T')[0]; var i=CONFIG.dates.indexOf(t); return i>=0?i+1:1; }

  function parseEndTime(timeStr){
    var parts=timeStr.split('-'); if(parts.length<2) return null;
    var end=parts[1].trim(), m=end.match(/(\d+)h(\d+)/);
    return m?{h:parseInt(m[1]),m:parseInt(m[2])}:null;
  }

  function getActivityStatus(act, dayIdx){
    if(state.progress[act.id]) return 'done';
    var today=new Date(), dateStr=CONFIG.dates[dayIdx];
    if(!dateStr) return 'upcoming';
    var actDate=new Date(dateStr+'T00:00:00');
    var todayDate=new Date(today.toISOString().split('T')[0]+'T00:00:00');
    if(actDate<todayDate) return 'past';
    if(actDate>todayDate) return 'upcoming';
    var end=parseEndTime(act.time);
    if(!end) return 'upcoming';
    var now=today.getHours()*60+today.getMinutes(), endMin=end.h*60+end.m;
    if(now>=endMin) return 'past';
    var start=act.time.match(/(\d+)h(\d+)/);
    if(start){var startMin=parseInt(start[1])*60+parseInt(start[2]); if(now>=startMin&&now<endMin) return 'live';}
    return 'upcoming';
  }

  function checkAutoComplete(){
    var changed=false;
    ['day1','day2','day3','day4'].forEach(function(k,i){
      var d=PROGRAM[k], all=d.matin.concat(d.aprem);
      all.forEach(function(a){
        if(!state.progress[a.id] && getActivityStatus(a,i)==='past'){
          state.progress[a.id]=true; changed=true;
          addXP(Math.round(a.xp*0.5),'Auto: '+a.title);
        }
      });
    });
    if(changed){ checkDayCompletion(); saveState(); if(state.currentPage&&state.currentPage.indexOf('day')===0) navigateTo(state.currentPage); }
  }

  function renderNavAvatar(){
    var c=document.getElementById('nav-avatar'); if(!c) return;
    var ctx=c.getContext('2d');
    var cfg=state.avatar||window.AIA.getDefaultAvatar();
    ctx.clearRect(0,0,32,32);
    if(window.AIA.renderMiniSprite) window.AIA.renderMiniSprite(ctx,cfg,2,0,0);
    c.classList.add('visible');
  }

  function toggleReaction(actId, emoji){
    if(!state.reactions) state.reactions={};
    state.reactions[actId] = state.reactions[actId]===emoji ? null : emoji;
    saveState();
    var bar=document.querySelector('.reactions-bar[data-act="'+actId+'"]');
    if(bar){
      bar.querySelectorAll('.reaction-btn').forEach(function(b){
        b.classList.toggle('active', b.getAttribute('data-emoji')===state.reactions[actId]);
      });
    }
  }

  function renderDashboard(){
    var main=document.getElementById('main-content'), info=getLevelInfo(state.xp.total);
    var tA=0,cA=0;
    ['day1','day2','day3','day4'].forEach(function(d){var p=PROGRAM[d],a=p.matin.concat(p.aprem);tA+=a.length;a.forEach(function(x){if(state.progress[x.id])cA++;});});
    var pct=tA>0?Math.round((cA/tA)*100):0;
    var highlightsBanner = (window.AIA && window.AIA.renderHighlightsBanner) ? window.AIA.renderHighlightsBanner() : '';
    main.innerHTML=
      '<div class="page-header"><h1>Bienvenue <span class="gradient-text">'+(state.user?state.user.name:'')+'</span> !</h1>'+
      '<p class="page-subtitle">Jour '+getCurrentDay()+' sur 4 &bull; '+CONFIG.school+'</p></div>'+
      highlightsBanner+
      '<div class="xp-card glass-card"><div class="xp-ring" style="--pct:'+info.progress+'%"><div class="xp-ring-inner">'+info.level+'</div></div>'+
      '<div class="xp-info"><div class="xp-title">'+state.xp.total+' XP</div><div class="xp-level-name">'+info.title+'</div>'+
      '<div class="progress-bar"><div class="progress-fill" style="width:'+info.progress+'%"></div></div>'+
      '<div class="xp-numbers"><span>Niv. '+info.level+'</span><span>'+(info.nextXp>info.xpNeeded?(info.nextXp-state.xp.total)+' XP restants':'MAX')+'</span></div></div></div>'+
      '<div class="stats-grid">'+
      '<div class="stat-card glass-card"><div class="stat-value red">'+pct+'%</div><div class="stat-label">Progression</div></div>'+
      '<div class="stat-card glass-card"><div class="stat-value gold">'+state.badges.length+'</div><div class="stat-label">Badges</div></div>'+
      '<div class="stat-card glass-card"><div class="stat-value cyan">'+state.streak.count+'</div><div class="stat-label">Streak</div></div>'+
      '<div class="stat-card glass-card"><div class="stat-value green">'+cA+'/'+tA+'</div><div class="stat-label">Activites</div></div></div>'+
      renderGameSpotlight()+
      '<h2 style="font-size:1.1rem;font-weight:700;margin-bottom:1rem">Programme</h2>'+
      '<div class="days-grid">'+renderDayCards()+'</div>'+
      '<h2 style="font-size:1.1rem;font-weight:700;margin-bottom:1rem">Activite Recente</h2>'+renderActivityFeed();
    if (window.AIA && window.AIA.wireHighlightCTAs) window.AIA.wireHighlightCTAs(main);
  }

  function renderGameSpotlight(){
    var theme = state.productTheme;
    var PHASES = (window.AIA && window.AIA.PHASES_GUIDE) ? window.AIA.PHASES_GUIDE : null;
    var allSteps = 0, doneSteps = 0;
    if (PHASES && state.gameDeliverables) {
      Object.keys(PHASES).forEach(function(pk){
        PHASES[pk].steps.forEach(function(s){
          allSteps++;
          if (state.gameDeliverables[s.id]) doneSteps++;
        });
      });
    }
    var pct = allSteps>0 ? Math.round((doneSteps/allSteps)*100) : 0;
    if (theme) {
      return '<div class="game-spotlight glass-card" data-navigate="business-game">'+
        '<div class="game-spotlight-badge">🎯 Fil rouge atelier</div>'+
        '<div class="game-spotlight-content">'+
        '<div class="game-spotlight-emoji">'+theme.emoji+'</div>'+
        '<div class="game-spotlight-info">'+
        '<div class="game-spotlight-label">Votre projet :</div>'+
        '<h2 class="game-spotlight-name">'+theme.name+'</h2>'+
        '<p class="game-spotlight-tagline">'+theme.tagline+'</p>'+
        '<div class="game-spotlight-progress">'+
        '<div class="progress-bar"><div class="progress-fill" style="width:'+pct+'%"></div></div>'+
        '<span class="game-spotlight-pct">'+pct+'% &bull; '+doneSteps+'/'+allSteps+' etapes</span>'+
        '</div>'+
        '</div>'+
        '<div class="game-spotlight-cta">Continuer →</div>'+
        '</div>'+
        '</div>';
    }
    return '<div class="game-spotlight glass-card no-theme" data-navigate="business-game">'+
      '<div class="game-spotlight-badge">🎯 Fil rouge atelier</div>'+
      '<div class="game-spotlight-content">'+
      '<div class="game-spotlight-emoji">🎲</div>'+
      '<div class="game-spotlight-info">'+
      '<h2 class="game-spotlight-name">Business Game</h2>'+
      '<p class="game-spotlight-tagline">Choisissez votre produit fictif et construisez sa campagne marketing complete en 4 phases</p>'+
      '</div>'+
      '<div class="game-spotlight-cta">Commencer →</div>'+
      '</div>'+
      '</div>';
  }

  function renderDayCards(){
    var h='';
    ['day1','day2','day3','day4'].forEach(function(k,i){
      var d=PROGRAM[k],all=d.matin.concat(d.aprem),done=all.filter(function(a){return state.progress[a.id];}).length;
      var pct=Math.round((done/all.length)*100), cur=getCurrentDay()===(i+1);
      h+='<div class="day-card glass-card'+(cur?' current':'')+'" data-navigate="day'+(i+1)+'">'+
        '<div class="day-num">J'+(i+1)+'</div><h3>'+CONFIG.dateLabels[i]+'</h3><p>'+d.title+'</p>'+
        '<div class="day-xp">⚡ '+d.xp+' XP</div>'+
        '<div class="progress-bar sm"><div class="progress-fill" style="width:'+pct+'%"></div></div>'+
        '<div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.3rem">'+done+'/'+all.length+'</div></div>';
    });
    return h;
  }

  function renderActivityFeed(){
    if(!state.xp.history.length) return '<p style="color:var(--text-muted);font-size:0.82rem">Aucune activite. Commence par explorer le programme !</p>';
    var h='<div class="activity-list">';
    state.xp.history.slice(0,8).forEach(function(e){
      var d=new Date(e.date);
      h+='<div class="activity-item glass-card"><div class="activity-icon cours">⚡</div>'+
        '<div class="activity-info"><h4>+'+e.amount+' XP</h4><p>'+e.reason+'</p></div>'+
        '<div class="activity-time">'+d.getHours()+'h'+String(d.getMinutes()).padStart(2,'0')+'</div></div>';
    });
    return h+'</div>';
  }

  function renderProgram(){
    var main=document.getElementById('main-content');
    main.innerHTML='<div class="page-header"><h1>Programme <span class="gradient-text">4 Jours</span></h1>'+
      '<p class="page-subtitle">8 demi-journees de formation IA & Marketing Digital</p></div>'+
      '<div class="days-grid">'+renderDayCards()+'</div>'+
      '<h2 style="font-size:1.1rem;font-weight:700;margin:1.5rem 0 1rem">Planning Detaille</h2>'+
      '<div class="timeline">'+renderTimeline()+'</div>';
  }

  function renderTimeline(){
    var h='';
    ['day1','day2','day3','day4'].forEach(function(k,i){
      var d=PROGRAM[k];
      h+='<div class="timeline-item"><h4 style="color:var(--red-light)">'+CONFIG.dateLabels[i]+' — '+d.title+'</h4></div>';
      d.matin.concat(d.aprem).forEach(function(a){
        h+='<div class="timeline-item'+(state.progress[a.id]?' completed':'')+'">'+
          '<div class="timeline-time">'+a.time+'</div><h4>'+a.title+'</h4><p>'+a.desc+'</p></div>';
      });
    });
    return h;
  }

  function renderDayView(n){
    var main=document.getElementById('main-content'),k='day'+n,d=PROGRAM[k];if(!d)return;
    main.innerHTML='<div class="page-header">'+
      '<a href="#" data-navigate="program" style="color:var(--text-muted);font-size:0.78rem;text-decoration:none;display:inline-flex;align-items:center;gap:0.3rem;margin-bottom:0.5rem">'+
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Programme</a>'+
      '<h1>Jour '+n+' — <span class="gradient-text">'+d.title+'</span></h1>'+
      '<p class="page-subtitle">'+CONFIG.dateLabels[n-1]+' &bull; '+d.subtitle+'</p></div>'+
      '<div class="tabs" id="day-tabs"><button class="tab-btn active" data-tab="matin">☀️ Matin</button>'+
      '<button class="tab-btn" data-tab="aprem">🌙 Apres-midi</button></div>'+
      '<div id="day-content">'+renderActivities(d.matin, n-1)+'</div>';
    document.getElementById('day-tabs').addEventListener('click',function(e){
      var b=e.target.closest('.tab-btn');if(!b)return;
      document.querySelectorAll('#day-tabs .tab-btn').forEach(function(x){x.classList.remove('active');});
      b.classList.add('active');
      document.getElementById('day-content').innerHTML=renderActivities(b.getAttribute('data-tab')==='matin'?d.matin:d.aprem, n-1);
    });
  }

  function renderActivities(acts, dayIdx){
    var icons={cours:'📖',atelier:'🛠️',defi:'⚡',game:'🎮',demo:'🔬'};
    var statusLabels={done:'Termine',past:'Termine',live:'En cours',upcoming:'A venir'};
    var emojis=['👍','❤️','🔥','💡','🤔'];
    var h='<div class="activity-list">';
    acts.forEach(function(a){
      var done=state.progress[a.id];
      var st=getActivityStatus(a, dayIdx!==undefined?dayIdx:getCurrentDay()-1);
      var badgeClass=done||st==='past'?'done':st==='live'?'live':'upcoming';
      var userReaction=state.reactions?state.reactions[a.id]:null;
      var locked=!isActivityUnlocked(a.id, dayIdx!==undefined?dayIdx:getCurrentDay()-1);
      h+='<div class="activity-item glass-card'+(locked?' locked':' clickable')+(done?' completed':'')+'"'+(locked?'':' data-navigate="activity-'+a.id+'"')+'>'+
        '<div class="activity-icon '+a.type+'">'+(locked?'🔒':(icons[a.type]||'📌'))+'</div>'+
        '<div class="activity-info"><h4'+(locked?' style="opacity:0.5"':'')+'>'+a.title+'</h4>'+(locked?'<p style="color:var(--text-muted);font-size:0.75rem">Completez l\'activite precedente pour debloquer</p>':'<p>'+a.desc+'</p>')+
        (!locked?'<div class="reactions-bar" data-act="'+a.id+'">'+
        emojis.map(function(e){return '<button class="reaction-btn'+(userReaction===e?' active':'')+'" data-emoji="'+e+'" onclick="event.stopPropagation();window.AIA.toggleReaction(\''+a.id+'\',\''+e+'\')">'+e+'</button>';}).join('')+
        '</div>':'')+
        '</div>'+
        '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.3rem">'+
        (locked?'<div class="auto-badge upcoming">Verrouille</div>':
        '<div class="auto-badge '+badgeClass+'">'+statusLabels[done?'done':st]+'</div>')+
        '<div class="activity-time">'+a.time+'</div><div class="activity-xp">+'+a.xp+' XP</div>'+
        '</div></div>';
    });
    return h+'</div>';
  }

  function renderDemos(){
    var main=document.getElementById('main-content');
    var demos=[
      // Day 1 — Fondations IA (prompt, comprehension texte)
      {id:'demo-prompt',icon:'✍️',title:'Prompt Playground',desc:'Comparer un prompt vague vs structure CRAC',tag:'Interactif',day:1,phase:'phase1'},
      {id:'demo-chatbot',icon:'💬',title:'Chatbot Marketing',desc:'Discuter avec un LLM open-source pour personas & strategie',tag:'HuggingFace',day:1,phase:'phase1'},
      {id:'demo-vqa',icon:'👁️',title:'Analyse Visuelle IA',desc:'Decortiquer les pubs concurrentes & generer alt-text SEO',tag:'HuggingFace',day:1,phase:'phase1'},
      {id:'demo-translate',icon:'🌍',title:'Traduction Multi-langue',desc:'NLLB-200 — internationaliser slogans et descriptions',tag:'HuggingFace',day:1,phase:'phase1'},
      // Day 2 — Contenu visuel & marque
      {id:'demo-image',icon:'🎨',title:'Generation d\'Images',desc:'Stable Diffusion 3 — visuels produit & logos',tag:'HuggingFace',day:2,phase:'phase2'},
      {id:'demo-logo',icon:'🆎',title:'Generateur de Logos',desc:'FLUX.1 — 50 variantes logo + branding en 5 min',tag:'HuggingFace',day:2,phase:'phase2'},
      {id:'demo-bg-remove',icon:'🖼️',title:'Suppression de Fond',desc:'Detourer photos produits en 1 clic (BRIA RMBG)',tag:'HuggingFace',day:2,phase:'phase2'},
      {id:'demo-upscale',icon:'🔍',title:'Upscaler d\'Images',desc:'Real-ESRGAN — 4x resolution sur vieux visuels',tag:'HuggingFace',day:2,phase:'phase2'},
      {id:'demo-sentiment',icon:'😊',title:'Analyse de Sentiment',desc:'Mesurer la tonalite emotionnelle de textes marketing',tag:'NLP',day:2,phase:'phase2'},
      // Day 3 — Campagne & creation pub
      {id:'demo-music',icon:'🎵',title:'Generation Musicale',desc:'MusicGen — jingles & bandes-son pour pubs video',tag:'HuggingFace',day:3,phase:'phase3'},
      {id:'demo-tts',icon:'🗣️',title:'Voix Off IA',desc:'Parler-TTS — voix-off broadcast pour videos pub',tag:'HuggingFace',day:3,phase:'phase3'},
      {id:'demo-avatar',icon:'🎬',title:'Avatar Video Anime',desc:'SadTalker — animer une photo avec audio pour video pitch',tag:'HuggingFace',day:3,phase:'phase3'},
      {id:'demo-abtest',icon:'📊',title:'A/B Testing',desc:'Simulateur statistique pour optimiser CTA & headlines',tag:'Analytics',day:3,phase:'phase3'},
      // Day 4 — Pitch, SEO, lancement
      {id:'demo-seo',icon:'🔍',title:'SEO Analyzer',desc:'Analyser & optimiser le SEO de votre landing page',tag:'SEO',day:4,phase:'phase4'},
      {id:'demo-speech',icon:'🎙️',title:'Transcription Vocale',desc:'Whisper — transcrire interviews & sous-titres video pitch',tag:'HuggingFace',day:4,phase:'phase4'}
    ];
    var currentDay=getCurrentDay();
    var DAY_TITLES={1:'Jour 1 — Fondations IA',2:'Jour 2 — Visuel & Marque',3:'Jour 3 — Campagne Pub',4:'Jour 4 — Pitch & Lancement'};
    var DAY_ICONS={1:'🌱',2:'🎨',3:'📢',4:'🚀'};
    var html='<div class="page-header"><h1>Demos <span class="gradient-text">IA Interactives</span></h1>'+
      '<p class="page-subtitle">'+demos.length+' outils IA — '+demos.filter(function(d){return d.tag==='HuggingFace';}).length+' embeds HuggingFace + outils integres. Organises par jour de formation.</p></div>';
    [1,2,3,4].forEach(function(day){
      var dayDemos=demos.filter(function(d){return d.day===day;});
      if(dayDemos.length===0) return;
      var isCurrent=day===currentDay;
      html+='<div class="demos-day-section'+(isCurrent?' current-day':'')+'">'+
        '<div class="demos-day-header"><span class="demos-day-icon">'+DAY_ICONS[day]+'</span>'+
        '<h2>'+DAY_TITLES[day]+'</h2>'+
        (isCurrent?'<span class="demos-day-badge">Aujourd\'hui</span>':'')+
        '</div>'+
        '<div class="demos-grid">'+dayDemos.map(function(d){
          var done=state.demosCompleted.indexOf(d.id)!==-1;
          var hfTag=d.tag==='HuggingFace'?'<span class="demo-hf-badge">🤗 HF</span>':'';
          var unlocked = isItemUnlocked('demos', d.id);
          var cardAttrs = unlocked ? ' data-navigate="'+d.id+'"' : '';
          var lockOverlay = unlocked ? '' : '<div class="demo-lock-overlay"><span class="demo-lock-icon">🔒</span><span class="demo-lock-label">Disponible apres le cours</span></div>';
          return '<div class="demo-card glass-card'+(unlocked?'':' locked')+'"'+cardAttrs+'><div class="demo-tag">'+d.tag+'</div>'+
            '<div class="demo-icon">'+d.icon+'</div><h3>'+d.title+(done?' ✅':'')+'</h3><p>'+d.desc+'</p>'+hfTag+lockOverlay+'</div>';
        }).join('')+'</div></div>';
    });
    main.innerHTML=html;
  }

  function renderArena(){
    var main=document.getElementById('main-content');
    main.innerHTML='<div class="page-header"><h1>Arena <span class="gradient-text">Multijoueur</span></h1>'+
      '<p class="page-subtitle">Battles, challenges et quiz en temps reel</p></div>'+
      '<div class="arena-modes">'+
      '<div class="arena-mode-card glass-card" data-navigate="battle"><div class="mode-icon">⚔️</div><h3>Battle de Prompts</h3><p>Affrontez un autre etudiant : soumettez vos prompts, la classe vote</p></div>'+
      '<div class="arena-mode-card glass-card" id="btn-start-challenge"><div class="mode-icon">🏆</div><h3>Challenge Collectif</h3><p>Meme brief pour tous, soumettez votre solution et votez</p></div>'+
      '<div class="arena-mode-card glass-card" id="btn-start-quiz"><div class="mode-icon">🧠</div><h3>Quiz Interactif</h3><p>Quiz en temps reel — 15 secondes par question</p></div>'+
      '<div class="arena-mode-card glass-card rpg-card" id="btn-start-rpg"><div class="mode-icon">🐉</div><h3>RPG PvP</h3><p>Choisissez votre classe marketing et combattez en tour par tour !</p><div style="font-size:0.7rem;color:var(--accent)">5 combats / jour &bull; Gagnez des points PvP</div></div></div>';
    var q=document.getElementById('btn-start-quiz');
    if(q) q.addEventListener('click',function(){if(window.AIA&&window.AIA.startQuiz)window.AIA.startQuiz(main);});
    var ch=document.getElementById('btn-start-challenge');
    if(ch) ch.addEventListener('click',function(){if(window.AIA&&window.AIA.startChallenge)window.AIA.startChallenge(main);});
    var rpg=document.getElementById('btn-start-rpg');
    if(rpg) rpg.addEventListener('click',function(){navigateTo('rpg');});
  }

  function renderRoom(){
    var main=document.getElementById('main-content');
    main.innerHTML='<div class="page-header"><h1>Salle de <span class="gradient-text">Classe Virtuelle</span></h1>'+
      '<p class="page-subtitle">Retrouvez les etudiants et voyez leur activite en direct</p></div>'+
      '<div class="room-info"><div class="room-info-item"><div class="dot online"></div> En ligne</div>'+
      '<div class="room-info-item"><div class="dot busy"></div> En activite</div>'+
      '<div class="room-info-item"><div class="dot idle"></div> Inactif</div></div>'+
      '<div class="room-canvas-wrap"><canvas id="room-canvas" width="960" height="540"></canvas>'+
      '<div class="room-toolbar"><button class="btn-ghost" data-navigate="avatar">👾 Personnaliser Avatar</button>'+
      '<button class="btn-ghost" id="btn-room-refresh">🔄 Rafraichir</button></div></div>';
    if(window.AIA&&window.AIA.initRoom) window.AIA.initRoom();
  }

  function renderAvatarEditor(){
    var main=document.getElementById('main-content');
    main.innerHTML='<div class="page-header">'+
      '<a href="#" data-navigate="room" style="color:var(--text-muted);font-size:0.78rem;text-decoration:none;display:inline-flex;align-items:center;gap:0.3rem;margin-bottom:0.5rem">'+
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Salle</a>'+
      '<h1>Editeur d\'<span class="gradient-text">Avatar Pixel Art</span></h1>'+
      '<p class="page-subtitle">Personnalise ton personnage</p></div>'+
      '<div id="sprite-editor-root"></div>';
    if(window.AIA&&window.AIA.initSpriteEditor) window.AIA.initSpriteEditor();
  }

  function renderBusinessGame(){
    var main=document.getElementById('main-content');
    var phases=[{key:'phase1',title:'Ideation & Marche',icon:'💡'},{key:'phase2',title:'Branding & Identite',icon:'🎨'},
      {key:'phase3',title:'Campagne Marketing',icon:'📢'},{key:'phase4',title:'Pitch & Lancement',icon:'🚀'}];
    main.innerHTML='<div class="page-header"><h1>Business <span class="gradient-text">Game</span></h1>'+
      '<p class="page-subtitle">Creez une startup de A a Z avec l\'IA — 4 phases, 12 livrables</p></div>'+
      '<div class="game-phases">'+phases.map(function(ph,i){
        var delivs=GAME_DELIVERABLES[ph.key],done=delivs.filter(function(d){return state.gameDeliverables[d.id];}).length;
        return '<div class="phase-card glass-card"><h3><span class="phase-num">'+(i+1)+'</span> '+ph.icon+' '+ph.title+'</h3>'+
          '<div class="progress-bar sm" style="margin-bottom:0.5rem"><div class="progress-fill" style="width:'+Math.round((done/delivs.length)*100)+'%"></div></div>'+
          '<div style="font-size:0.7rem;color:var(--text-muted);margin-bottom:0.5rem">'+done+'/'+delivs.length+'</div>'+
          delivs.map(function(d){var ch=state.gameDeliverables[d.id];
            return '<div class="deliverable-item'+(ch?' checked':'')+'"><input type="checkbox" '+(ch?'checked':'')+
              ' onchange="window.AIA.toggleDeliverable(\''+d.id+'\')"><span>'+d.label+'</span></div>';}).join('')+'</div>';
      }).join('')+'</div>'+
      '<div style="margin-top:1.5rem"><h3 style="font-size:0.92rem;font-weight:700;margin-bottom:0.5rem">📝 Notes d\'equipe</h3>'+
      '<div class="form-group"><textarea id="game-notes-area" placeholder="Notez vos idees ici...">'+(state.gameNotes||'')+'</textarea></div>'+
      '<button class="btn-outline" onclick="window.AIA.saveGameNotes()">Sauvegarder</button></div>';
    awardBadge('team-player');
  }

  var _leaderboardListener = null;

  function renderLeaderboard(){
    var main=document.getElementById('main-content');
    main.innerHTML='<div class="page-header"><h1>Classement <span class="gradient-text">General</span></h1>'+
      '<p class="page-subtitle">Leaderboard en temps reel</p></div>'+
      '<div id="leaderboard-content"><div class="loading-pulse" style="padding:2rem;text-align:center">Chargement du classement...</div></div>';
    if(_leaderboardListener) db.ref('students').off('value',_leaderboardListener);
    if(!db){_renderLeaderboardData([]);return;}
    _leaderboardListener=db.ref('students').on('value',function(snap){
      var data=snap.val()||{}, list=[];
      for(var k in data){
        var s=data[k];
        list.push({key:k,name:s.name||k,xp:s.xp||0,badges:typeof s.badges==='number'?s.badges:0,
          online:!!s.online,streak:s.streak||0,progress:s.progress||0,
          isMe:state.user&&state.user.accountKey===k});
      }
      _renderLeaderboardData(list);
    });
  }

  function _renderLeaderboardData(students){
    var el=document.getElementById('leaderboard-content');if(!el)return;
    students.sort(function(a,b){return b.xp-a.xp||a.name.localeCompare(b.name);});
    if(students.length===0){
      el.innerHTML='<div class="glass-card" style="text-align:center;padding:3rem"><h3>Soyez le premier au classement !</h3><p style="color:var(--text-muted)">Les XP gagnes pendant les activites apparaitront ici en temps reel.</p></div>';
      return;
    }
    var ITEM_ICONS={crown:'👑',staff:'🏛️',gold_sword:'🗡️',sword:'⚔️',shield:'🛡️',cape:'🦸',wings:'🪽'};
    function rankItems(r){
      if(window.AIA&&window.AIA.getItemsForRank){return window.AIA.getItemsForRank(r,false);}
      if(r===1)return['gold_sword','crown','wings'];if(r===2)return['sword','shield'];if(r===3)return['shield','cape'];if(r>=4&&r<=10)return['cape'];return[];
    }
    function itemBadges(rank){
      var items=rankItems(rank);if(!items.length)return'';
      return' <span class="rank-items" title="Items RPG rang '+rank+'">'+items.map(function(it){return ITEM_ICONS[it]||'';}).join('')+'</span>';
    }
    var medals=['🥈','🥇','🥉'],order=[1,0,2],podH='';
    order.forEach(function(idx){var s=students[idx];if(!s)return;var rk=idx+1;/* rank = sorted position +1 */
      podH+='<div class="podium-item'+(s.isMe?' is-me':'')+'"><div class="rank">'+medals[idx]+'</div>'+
        '<div class="avatar-small">'+(s.isMe?'⭐':'👤')+'</div><div class="name">'+s.name+(s.isMe?' (vous)':'')+itemBadges(rk)+'</div>'+
        '<div class="xp">'+s.xp+' XP</div>'+(s.streak>1?'<div style="font-size:0.7rem">🔥 '+s.streak+'j</div>':'')+
        '<div class="podium-bar"></div></div>';});
    var tH=students.slice(3).map(function(s,i){var rk=i+4;
      return '<tr class="'+(s.isMe?'is-me':'')+'"><td class="rank-cell">'+rk+'</td><td><div class="name-cell"><div class="avatar-tiny">'+(s.isMe?'⭐':'👤')+'</div>'+
        s.name+(s.isMe?' (vous)':'')+itemBadges(rk)+'</div></td><td class="xp-cell">'+s.xp+' XP</td><td>'+s.badges+' 🏅</td>'+
        '<td><span class="dot '+(s.online?'online':'idle')+'"></span></td></tr>';}).join('');
    el.innerHTML='<p class="page-subtitle" style="margin-bottom:1rem">'+students.length+' etudiants inscrits</p>'+
      '<div class="podium">'+podH+'</div>'+
      '<div class="glass-card" style="overflow:hidden"><table class="ranking-table"><thead><tr><th>#</th><th>Etudiant</th><th>XP</th><th>Badges</th><th>Statut</th></tr></thead>'+
      '<tbody>'+tH+'</tbody></table></div>';
  }

  function renderTools(){
    var main=document.getElementById('main-content');
    main.innerHTML='<div class="page-header"><h1>Boite a <span class="gradient-text">Outils IA</span></h1>'+
      '<p class="page-subtitle">'+state.toolsExplored.length+'/'+AI_TOOLS.length+' explores</p></div>'+
      '<div class="tools-grid">'+AI_TOOLS.map(function(t){
        var exp=state.toolsExplored.indexOf(t.id)!==-1;
        return '<div class="tool-card glass-card"><div class="tool-icon">'+t.icon+'</div><h3>'+t.name+(exp?' ✅':'')+'</h3>'+
          '<p>'+t.desc+'</p><div class="tool-tag '+t.tag+'">'+t.tag+'</div>'+
          '<div style="margin-top:0.6rem;font-size:0.7rem;color:var(--text-muted)">'+t.uses.join(' &bull; ')+'</div>'+
          (!exp?'<button class="btn-outline btn-sm" style="margin-top:0.6rem" onclick="window.AIA.exploreTool(\''+t.id+'\')">Explorer</button>':'')+
          '</div>';}).join('')+'</div>';
  }

  function renderProfile(){
    var main=document.getElementById('main-content'),info=getLevelInfo(state.xp.total);
    main.innerHTML='<div class="page-header"><h1>Mon <span class="gradient-text">Profil</span></h1></div>'+
      '<div class="xp-card glass-card"><div class="xp-ring" style="--pct:'+info.progress+'%"><div class="xp-ring-inner">'+info.level+'</div></div>'+
      '<div class="xp-info"><div class="xp-title">'+(state.user?state.user.name:'')+'</div>'+
      '<div class="xp-level-name">'+info.title+' &bull; '+state.xp.total+' XP</div>'+
      '<div class="progress-bar"><div class="progress-fill" style="width:'+info.progress+'%"></div></div></div></div>'+
      '<div style="display:flex;gap:0.5rem;margin-bottom:1.5rem">'+
      '<button class="btn-ghost" data-navigate="avatar">👾 Editer Avatar</button>'+
      '<button class="btn-ghost" data-navigate="leaderboard">🏆 Classement</button></div>'+
      '<h3 style="font-size:1rem;font-weight:700;margin-bottom:0.8rem">Badges ('+state.badges.length+'/'+BADGES.length+')</h3>'+
      '<div class="badges-grid">'+BADGES.map(function(b){
        var u=state.badges.indexOf(b.id)!==-1;
        return '<div class="badge-item '+(u?'unlocked':'locked')+'" title="'+b.desc+'"><div class="badge-icon">'+b.icon+'</div><div class="badge-name">'+b.name+'</div></div>';
      }).join('')+'</div>'+
      '<h3 style="font-size:1rem;font-weight:700;margin:1.5rem 0 0.8rem">Historique XP</h3>'+renderActivityFeed();
  }

  function renderAdmin(){
    if(!state.user||!state.user.isAdmin){navigateTo('dashboard');return;}
    var main=document.getElementById('main-content');
    main.innerHTML='<div class="page-header"><h1>Panel <span class="gradient-text">Formateur</span></h1>'+
      '<p class="page-subtitle">'+CONFIG.mentorName+' &bull; '+CONFIG.school+'</p>'+
      '<div class="admin-badge" style="margin-top:0.5rem"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Formateur</div></div>'+
      '<div id="admin-root"><p style="color:var(--text-muted)">Chargement du panel admin...</p></div>';
    if(window.AIA&&window.AIA.initAdmin) window.AIA.initAdmin();
  }

  function enterApp(name, isAdmin, accountKey) {
    document.getElementById('page-login').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    if (!isAdmin) {
      awardBadge('first-login'); updateStreak();
    }
    saveState(); listenDayLocks(); navigateTo(state.currentPage || 'dashboard');
    showToast('Bienvenue ' + name + ' !', 'success'); initFirebase();
    renderNavAvatar();
    // Sync admin student-mode banner visibility
    var banner = document.getElementById('admin-as-student-banner');
    if (banner) banner.style.display = (isAdmin && adminAsStudent) ? 'flex' : 'none';
    // Quick wins: first-time onboarding tour + morning/evening check-in
    setTimeout(function () {
      if (window.AIA && window.AIA.maybeStartOnboarding) window.AIA.maybeStartOnboarding();
      // Defer check-in slightly to avoid clashing with onboarding
      setTimeout(function () {
        if (window.AIA && window.AIA.maybeShowCheckin) window.AIA.maybeShowCheckin();
      }, 800);
    }, 600);
    if (!isAdmin) { checkAutoComplete(); setInterval(checkAutoComplete, 60000); }
    window.addEventListener('beforeunload', function () { saveStateNow(); });
    if (!isAdmin) { setInterval(saveState, 30000); }
  }

  function resetLoginUI() {
    document.getElementById('role-picker').classList.remove('hidden');
    document.getElementById('student-login-panel').classList.add('hidden');
    document.getElementById('admin-login-panel').classList.add('hidden');
    document.getElementById('student-login-form').classList.remove('hidden');
    document.getElementById('student-register-form').classList.add('hidden');
  }

  function initAuth(){
    document.getElementById('role-student').addEventListener('click', function () {
      document.getElementById('role-picker').classList.add('hidden');
      document.getElementById('student-login-panel').classList.remove('hidden');
    });
    document.getElementById('role-admin').addEventListener('click', function () {
      document.getElementById('role-picker').classList.add('hidden');
      document.getElementById('admin-login-panel').classList.remove('hidden');
    });
    document.getElementById('back-role-student').addEventListener('click', resetLoginUI);
    document.getElementById('back-role-admin').addEventListener('click', resetLoginUI);

    // Hide public registration when locked down (admin-only account creation)
    if (CONFIG.disablePublicRegistration) {
      var regBtn = document.getElementById('btn-show-register');
      if (regBtn) {
        regBtn.style.display = 'none';
        // Add a helper message in the login form
        var loginForm = document.getElementById('student-login-form');
        if (loginForm && !document.getElementById('reg-disabled-msg')) {
          var msg = document.createElement('div');
          msg.id = 'reg-disabled-msg';
          msg.style.cssText = 'margin-top:1rem;padding:0.6rem;background:rgba(245,183,49,0.08);border:1px solid rgba(245,183,49,0.3);border-radius:6px;font-size:0.78rem;color:var(--text-muted);text-align:center';
          msg.innerHTML = '🔐 Inscription fermee. Demandez vos identifiants au formateur (' + CONFIG.mentorName + ').';
          loginForm.appendChild(msg);
        }
      }
    }

    document.getElementById('btn-show-register').addEventListener('click', function () {
      if (CONFIG.disablePublicRegistration) {
        showToast('Inscription fermee — contactez le formateur', 'warning');
        return;
      }
      document.getElementById('student-login-form').classList.add('hidden');
      document.getElementById('student-register-form').classList.remove('hidden');
    });
    document.getElementById('btn-show-login').addEventListener('click', function () {
      document.getElementById('student-register-form').classList.add('hidden');
      document.getElementById('student-login-form').classList.remove('hidden');
    });

    document.getElementById('btn-student-login').addEventListener('click', function () {
      var ln = document.getElementById('login-lastname').value.trim();
      var fn = document.getElementById('login-firstname').value.trim();
      var pw = document.getElementById('login-password').value;
      if (!ln || !fn) return showToast('Entrez votre nom et prenom', 'warning');
      if (!pw) return showToast('Mot de passe requis', 'warning');
      showToast('Connexion...', 'info');
      loginAccount(ln, fn, hashPass(pw), function (result) {
        if (result.error) return showToast(result.error, 'error');
        var displayName = result.account.firstName + ' ' + result.account.lastName;
        state.user = { name: displayName, firstName: result.account.firstName, lastName: result.account.lastName, isAdmin: false, accountKey: result.key, loginDate: new Date().toISOString().split('T')[0] };
        loadAccountState(result.key, function () {
          state.user = { name: displayName, firstName: result.account.firstName, lastName: result.account.lastName, isAdmin: false, accountKey: result.key, loginDate: new Date().toISOString().split('T')[0] };
          enterApp(result.account.firstName, false, result.key);
        });
      });
    });

    document.getElementById('btn-student-register').addEventListener('click', function () {
      if (CONFIG.disablePublicRegistration) {
        showToast('Inscription publique desactivee. Contactez le formateur pour obtenir un compte.', 'error');
        return;
      }
      var ln = document.getElementById('reg-lastname').value.trim();
      var fn = document.getElementById('reg-firstname').value.trim();
      var pw = document.getElementById('reg-password').value;
      var pw2 = document.getElementById('reg-password2').value;
      var code = document.getElementById('reg-code').value.trim().toUpperCase();
      if (!ln || !fn) return showToast('Entrez votre nom et prenom (pas de pseudo)', 'warning');
      if (ln.length < 2 || fn.length < 2) return showToast('Nom et prenom doivent avoir au moins 2 caracteres', 'warning');
      if (!pw || pw.length < 4) return showToast('Mot de passe de 4 caracteres minimum', 'warning');
      if (pw !== pw2) return showToast('Les mots de passe ne correspondent pas', 'error');
      if (code !== CONFIG.classCode) return showToast('Code de formation incorrect', 'error');
      showToast('Creation du compte...', 'info');
      createAccount(ln, fn, hashPass(pw), function (result) {
        if (result.error) return showToast(result.error, 'error');
        var displayName = fn + ' ' + ln;
        state.user = { name: displayName, firstName: fn, lastName: ln, isAdmin: false, accountKey: result.key, loginDate: new Date().toISOString().split('T')[0] };
        enterApp(fn, false, result.key);
        showToast('Compte cree ! Choisissez maintenant votre projet d\'atelier.', 'success');
        // Trigger product theme selection (mandatory first step for new accounts)
        setTimeout(function () {
          if (window.AIA && window.AIA.showThemeSelection && !state.productTheme) {
            window.AIA.showThemeSelection(function () {
              if (state.currentPage !== 'business-game') navigateTo('business-game');
            });
          }
        }, 600);
      });
    });

    document.getElementById('btn-admin-login').addEventListener('click', function () {
      var pw = document.getElementById('admin-password').value;
      if (!pw) return showToast('Mot de passe requis', 'warning');
      if (hashPass(pw) !== CONFIG.adminHash) return showToast('Mot de passe incorrect', 'error');
      state.user = { name: CONFIG.mentorName, isAdmin: true, loginDate: new Date().toISOString().split('T')[0] };
      enterApp(CONFIG.mentorName, true, null);
    });

    document.getElementById('btn-logout').addEventListener('click', function () {
      saveStateNow();
      if (db && state.user && state.user.accountKey) {
        db.ref('students/' + state.user.accountKey + '/online').set(false);
      }
      state.user = null; state.xp = { total: 0, history: [] }; state.progress = {};
      state.badges = []; state.streak = { count: 0, lastDate: null }; state.gameNotes = '';
      state.gameDeliverables = {}; state.toolsExplored = []; state.avatar = null;
      state.currentPage = 'dashboard'; state.demosCompleted = []; state.reactions = {};
      document.getElementById('app-shell').classList.add('hidden');
      document.getElementById('page-login').classList.remove('hidden');
      resetLoginUI();
      var al = document.getElementById('nav-admin-link'); if (al) al.parentNode.removeChild(al);
      var nav = document.getElementById('nav-avatar'); if (nav) nav.classList.remove('visible');
    });
  }

  function initNavigation(){
    document.addEventListener('click',function(e){
      var el=e.target.closest('[data-navigate]'); if(el){e.preventDefault();navigateTo(el.getAttribute('data-navigate'));}
    });
    document.getElementById('badge-popup-close').addEventListener('click',function(){document.getElementById('badge-popup').classList.add('hidden');});

    // Wire "Revenir admin" button in the student-mode banner
    var exitBtn = document.getElementById('btn-exit-student-mode');
    if (exitBtn) {
      exitBtn.addEventListener('click', function () {
        setAdminAsStudent(false);
        showToast('Retour en mode admin', 'success');
      });
    }

    // Sync banner visibility on init when an admin reloads with student-mode active
    var banner = document.getElementById('admin-as-student-banner');
    if (banner) banner.style.display = (state.user && state.user.isAdmin && adminAsStudent) ? 'flex' : 'none';
  }

  window.AIA = window.AIA || {};
  window.AIA.completeActivity = completeActivity;
  window.AIA.toggleDeliverable = function(id){
    state.gameDeliverables[id]=!state.gameDeliverables[id];
    if(state.gameDeliverables[id]) addXP(10,'Livrable: '+id);
    var allDone=Object.keys(GAME_DELIVERABLES).every(function(p){return GAME_DELIVERABLES[p].every(function(d){return state.gameDeliverables[d.id];});});
    if(allDone) awardBadge('game-complete'); saveState();
  };
  window.AIA.saveGameNotes=function(){var el=document.getElementById('game-notes-area');if(el){state.gameNotes=el.value;saveState();showToast('Notes sauvegardees','success');}};
  window.AIA.exploreTool=function(id){
    if(state.toolsExplored.indexOf(id)===-1){state.toolsExplored.push(id);addXP(15,'Outil: '+id);
      if(state.toolsExplored.length>=AI_TOOLS.length)awardBadge('all-tools');saveState();renderTools();}
  };
  window.AIA.addXP=addXP; window.AIA.awardBadge=awardBadge; window.AIA.showToast=showToast;
  window.AIA.getState=function(){return state;}; window.AIA.navigateTo=navigateTo;
  window.AIA.CONFIG=CONFIG; window.AIA.PROGRAM=PROGRAM; window.AIA.BADGES=BADGES; window.AIA.LEVELS=LEVELS;
  window.AIA.getLevelInfo=getLevelInfo; window.AIA.saveState=saveState; window.AIA.Storage=Storage;
  window.AIA.renderNavAvatar=renderNavAvatar; window.AIA.checkAutoComplete=checkAutoComplete;
  window.AIA.getActivityStatus=getActivityStatus; window.AIA.toggleReaction=toggleReaction;
  window.AIA.getAccountsFromFirebase=getAccountsFromFirebase; window.AIA.saveAccountsToFirebase=saveAccountsToFirebase;
  window.AIA.deleteStudentState=deleteStudentState; window.AIA.hashPass=hashPass;
  window.AIA.getAccountKey=getAccountKey; window.AIA.saveStateNow=saveStateNow;
  window.AIA.createAccount=createAccount; window.AIA.loginAccount=loginAccount;
  window.AIA.submitActivity=submitActivity; window.AIA.isActivityUnlocked=isActivityUnlocked;
  window.AIA.dayLocks=dayLocks; window.AIA.db=null;
  window.AIA.isItemUnlocked=isItemUnlocked;
  window.AIA.setUnlock=setUnlock;
  window.AIA.setUnlocksBulk=setUnlocksBulk;
  window.AIA.setAdminAsStudent=setAdminAsStudent;
  window.AIA.getAdminAsStudent=getAdminAsStudent;
  window.AIA.getUnlocks=function(){return unlocks;};

  function init(){
    initParticles(); initFirebase(); initAuth(); initNavigation();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
