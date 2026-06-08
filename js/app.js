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
    adminHash: 'b3deac97220109d7fef1afb62b195a710933e4d3a71291037bcf6099371b1c3d', // SHA-256 sale (mdp : IDRAC-Atelier-IA-2026!) — change-le en regenerant le hash
    disablePublicRegistration: true, // Admin must create accounts via admin panel
    allowedHosts: ALLOWED_HOSTS,
    storagePrefix: 'aia_',
    dates: ['2026-06-08','2026-06-09','2026-06-10','2026-06-12'],
    dateLabels: ['Lundi 8 Juin','Mardi 9 Juin','Mercredi 10 Juin','Vendredi 12 Juin'],
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
    { id: 'boss-slayer', icon: '🐉', name: 'Boss Slayer', desc: 'Vaincre un Boss du jour', rarity: 'epic' },
    { id: 'showcase-star', icon: '🎪', name: 'Showcase Star', desc: 'Participer a 3 Showcases', rarity: 'rare' },
    { id: 'crowd-favorite', icon: '🏆', name: 'Crowd Favorite', desc: 'Top 3 du Showcase de classe', rarity: 'epic' },
    { id: 'top-voted', icon: '❤️', name: 'Coup de Coeur', desc: 'Recevoir 3 votes sur sa campagne', rarity: 'rare' },
    { id: 'perfectionist', icon: '💯', name: 'Perfectionniste', desc: 'Valider 12/12 etapes Business Game', rarity: 'epic' },
    { id: 'early-bird', icon: '🌅', name: 'Early Bird', desc: 'Se connecter avant 9h le jour J', rarity: 'common' },
    { id: 'night-owl', icon: '🌙', name: 'Night Owl', desc: 'Activite enregistree apres 22h', rarity: 'common' },
    { id: 'helper', icon: '🤝', name: 'Aidant', desc: 'Commenter / encourager 5 pairs', rarity: 'rare' },
    { id: 'rpg-winner', icon: '⚔️', name: 'Duelliste', desc: 'Premiere victoire en RPG PvP', rarity: 'common' },
    { id: 'campaign-shipper', icon: '🚢', name: 'Campaign Shipper', desc: 'Exporter sa campagne en JSON', rarity: 'common' },
    { id: 'prof-slayer', icon: '🧠', name: 'Tombeur du Prof', desc: 'Battre le Prof (IA quasi imbattable) en duel', rarity: 'legendary' },
    { id: 'boss-hunter', icon: '👹', name: 'Chasseur de Boss', desc: 'Vaincre les 4 boss solo des mini-jeux', rarity: 'epic' },
    { id: 'legend', icon: '🦄', name: 'Legende IDRAC', desc: 'Tous les badges epic + 1000 XP', rarity: 'legendary' }
  ];

  var PROGRAM = {
    day1: {
      title: 'Decouverte de l\'IA Generative', subtitle: 'Introduction et premiers pas avec l\'IA en marketing', xp: 200,
      matin: [
        { id: 'd1-accueil', type: 'cours', time: '9h00-9h30', title: 'Accueil & Ice Breaker', desc: 'Presentation, objectifs, creation de votre avatar', xp: 15, links: ['avatar','assessment-pre'] },
        { id: 'd1-intro-ia', type: 'cours', time: '9h30-10h30', title: 'L\'IA Generative : Revolution Marketing', desc: 'Comprendre ChatGPT, Claude, Midjourney et leur impact', xp: 25, links: ['demo-chatbot','resources'] },
        { id: 'd1-premier-prompt', type: 'atelier', time: '10h45-12h00', title: 'Premiers Prompts', desc: 'Atelier pratique : ecrire ses premiers prompts efficaces', xp: 40, links: ['demo-prompt'] }
      ],
      aprem: [
        { id: 'd1-prompt-avance', type: 'atelier', time: '13h30-15h00', title: 'Prompt Engineering Avance', desc: 'Chain-of-thought, few-shot, role prompting', xp: 50, links: ['demo-prompt','demo-translate','demo-vqa'] },
        { id: 'd1-defi', type: 'defi', time: '15h15-16h30', title: 'Defi Prompt Battle', desc: 'Battle de prompts entre etudiants avec vote', xp: 50, links: ['battle'] },
        { id: 'd1-debrief', type: 'cours', time: '16h30-17h00', title: 'Debrief & Quiz du Jour', desc: 'Retour sur les apprentissages et quiz interactif', xp: 20, links: ['arena','journal'] }
      ]
    },
    day2: {
      title: 'Creation de Contenu IA', subtitle: 'Visuels, copywriting et video avec l\'IA', xp: 250,
      matin: [
        { id: 'd2-visuel', type: 'cours', time: '9h00-9h45', title: 'Generation Visuelle IA', desc: 'Midjourney, DALL-E, Canva AI : panorama et bonnes pratiques', xp: 20, links: ['demo-image','resources'] },
        { id: 'd2-atelier-image', type: 'atelier', time: '9h45-11h00', title: 'Atelier Creation Visuelle', desc: 'Creer des visuels marketing avec l\'IA generative', xp: 45, links: ['demo-image','demo-logo','demo-bg-remove','demo-upscale'] },
        { id: 'd2-copywriting', type: 'atelier', time: '11h15-12h30', title: 'Copywriting IA', desc: 'Rediger des textes marketing percutants avec l\'IA', xp: 45, links: ['demo-chatbot','demo-translate'] }
      ],
      aprem: [
        { id: 'd2-video', type: 'atelier', time: '13h30-15h00', title: 'Video & Voix IA', desc: 'HeyGen, ElevenLabs : creer des videos et voix off IA', xp: 50, links: ['demo-tts','demo-avatar','demo-music'] },
        { id: 'd2-demo-sentiment', type: 'demo', time: '15h15-16h00', title: 'Demo : Analyse de Sentiment', desc: 'Tester l\'analyse de sentiment sur des avis clients', xp: 40, links: ['demo-sentiment'] },
        { id: 'd2-challenge', type: 'defi', time: '16h00-17h00', title: 'Challenge Creatif', desc: 'Creer une campagne complete en equipe', xp: 50, links: ['business-game','arena'] }
      ]
    },
    day3: {
      title: 'Strategie Marketing IA', subtitle: 'SEO, analytics, chatbots et automatisation', xp: 280,
      matin: [
        { id: 'd3-seo', type: 'cours', time: '9h00-10h00', title: 'SEO & Analytics IA', desc: 'Optimisation SEO avec l\'IA, analyse de donnees marketing', xp: 30, links: ['demo-seo','resources'] },
        { id: 'd3-demo-seo', type: 'demo', time: '10h00-11h00', title: 'Demo : SEO Analyzer', desc: 'Analyser et optimiser le SEO d\'une page en temps reel', xp: 40, links: ['demo-seo'] },
        { id: 'd3-abtest', type: 'demo', time: '11h15-12h30', title: 'Demo : A/B Testing IA', desc: 'Simuler des tests A/B automatises par l\'IA', xp: 40, links: ['demo-abtest'] }
      ],
      aprem: [
        { id: 'd3-chatbot', type: 'demo', time: '13h30-14h30', title: 'Demo : Chatbot Marketing', desc: 'Construire un chatbot marketing conversationnel', xp: 45, links: ['demo-chatbot'] },
        { id: 'd3-game-launch', type: 'game', time: '14h30-16h00', title: 'Business Game : Lancement', desc: 'Former les equipes et demarrer le Business Game', xp: 50, links: ['business-game'] },
        { id: 'd3-arena', type: 'defi', time: '16h00-17h00', title: 'Arena : Quiz & Battles', desc: 'Quiz interactif et battles entre equipes', xp: 75, links: ['arena','rpg'] }
      ]
    },
    day4: {
      title: 'Projet Final & Pitch', subtitle: 'Finalisation, presentations et awards', xp: 300,
      matin: [
        { id: 'd4-finalize', type: 'game', time: '9h00-11h00', title: 'Business Game : Sprint Final', desc: 'Finaliser les livrables avec l\'aide de l\'IA', xp: 60, links: ['business-game'] },
        { id: 'd4-demo-playground', type: 'demo', time: '11h00-12h00', title: 'Demo : Playground Libre', desc: 'Experimenter librement avec les modeles IA', xp: 40, links: ['demo-prompt','demo-speech'] },
        { id: 'd4-prep-pitch', type: 'atelier', time: '12h00-12h30', title: 'Preparation Pitch', desc: 'Structurer votre Carnet de Campagne et preparer la presentation finale', xp: 20, links: ['workbook','business-game'] }
      ],
      aprem: [
        { id: 'd4-pitch', type: 'game', time: '14h00-16h00', title: 'Pitchs & Votes', desc: 'Chaque equipe presente, la classe vote', xp: 80, links: ['showcase','wall'] },
        { id: 'd4-awards', type: 'cours', time: '16h00-16h30', title: 'Ceremonie des Awards', desc: 'Remise des badges, classement final, diplomes', xp: 50, links: ['leaderboard','assessment-post','certificate'] },
        { id: 'd4-closing', type: 'cours', time: '16h30-17h00', title: 'Cloture & Perspectives', desc: 'Bilan, export du Carnet de Campagne, ressources et prochaines etapes', xp: 50, links: ['workbook','skilltree','resources','certificate'] }
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
    reactions: {},
    // Duel contre le Prof (IA quasi imbattable) : tentative unique pour tout le seminaire.
    bossDuel: null,            // { used:true, result:'win'|'loss', ts:'...' }
    pvpPenaltyUntil: 0,        // timestamp ms : malus 0,75x sur les gains XP jusqu'a cette heure
    // Boss SOLO (PvE) des mini-jeux : debloques apres 3 parties reussies, 1 victoire = bossDone.
    gameProgress: {
      rpg:       { wins: 0, bossDone: false },
      quiz:      { wins: 0, bossDone: false },
      battle:    { wins: 0, bossDone: false },
      challenge: { wins: 0, bossDone: false }
    }
  };

  var Storage = {
    get: function (key, fb) { try { var v = localStorage.getItem(CONFIG.storagePrefix + key); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } },
    set: function (key, val) { try { localStorage.setItem(CONFIG.storagePrefix + key, JSON.stringify(val)); } catch (e) {} }
  };

  var db = null;

  function getAccountKey(lastName, firstName) {
    return (lastName.trim() + '_' + firstName.trim()).toLowerCase().replace(/[^a-z0-9_]/g, '');
  }

  function createAccount(lastName, firstName, passwordHash, callback, extra) {
    var key = getAccountKey(lastName, firstName);
    db.ref('accounts/' + key).once('value', function (snap) {
      if (snap.exists()) return callback({ error: 'Ce compte existe deja. Connectez-vous.' });
      var acct = { firstName: firstName.trim(), lastName: lastName.trim(), passwordHash: passwordHash, createdAt: new Date().toISOString(), lastLogin: null };
      if (extra) { for (var ek in extra) acct[ek] = extra[ek]; }
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

  // Changement de mot de passe force a la 1ere connexion (compte cree par le formateur).
  function forcePasswordChange(key, account, onDone) {
    var safeFirst = String(account.firstName || '').replace(/[<>&"]/g, '');
    var ov = document.createElement('div');
    ov.className = 'pw-change-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(8,10,22,0.82);display:flex;align-items:center;justify-content:center;z-index:99999;padding:1rem';
    var inStyle = 'width:100%;padding:0.7rem 0.9rem;margin-bottom:0.6rem;border-radius:10px;border:1px solid rgba(255,255,255,0.18);background:rgba(255,255,255,0.06);color:inherit;font-size:0.95rem';
    ov.innerHTML = '<div class="glass-card" style="max-width:420px;width:100%;padding:1.6rem">' +
      '<div style="font-size:2rem;margin-bottom:0.2rem">🔐</div>' +
      '<h2 style="margin:0 0 0.3rem">Premiere connexion</h2>' +
      '<p style="color:var(--text-muted);font-size:0.88rem;margin:0 0 1rem">Bienvenue ' + safeFirst + ' ! Pour securiser ton compte, choisis un nouveau mot de passe personnel (le mot de passe par defaut ne fonctionnera plus).</p>' +
      '<input type="password" id="pwc-new" autocomplete="new-password" placeholder="Nouveau mot de passe (min. 6 caracteres)" style="' + inStyle + '">' +
      '<input type="password" id="pwc-confirm" autocomplete="new-password" placeholder="Confirme le mot de passe" style="' + inStyle + '">' +
      '<div id="pwc-msg" style="font-size:0.8rem;color:#e74c3c;min-height:1.1rem;margin-bottom:0.5rem"></div>' +
      '<button class="btn-primary" id="pwc-submit" style="width:100%">Valider et entrer</button>' +
      '</div>';
    document.body.appendChild(ov);
    var msg = ov.querySelector('#pwc-msg');
    function submit() {
      var p1 = ov.querySelector('#pwc-new').value;
      var p2 = ov.querySelector('#pwc-confirm').value;
      if (!p1 || p1.length < 6) { msg.textContent = 'Au moins 6 caracteres.'; return; }
      if (p1 !== p2) { msg.textContent = 'Les deux mots de passe ne correspondent pas.'; return; }
      if (p1 === 'Idrac2026!' || p1.toLowerCase() === 'idrac2026') { msg.textContent = 'Choisis un mot de passe different du mot de passe par defaut.'; return; }
      var btn = ov.querySelector('#pwc-submit'); btn.disabled = true; btn.textContent = 'Enregistrement...';
      hashAccountPass(key, p1).then(function (ph) {
        db.ref('accounts/' + key).update({ passwordHash: ph, mustChangePassword: null, passwordChangedAt: new Date().toISOString() }, function (err) {
          if (err) { msg.textContent = 'Erreur, reessaie.'; btn.disabled = false; btn.textContent = 'Valider et entrer'; return; }
          if (ov.parentNode) ov.parentNode.removeChild(ov);
          showToast('Mot de passe mis a jour ✅', 'success');
          onDone();
        });
      });
    }
    ov.querySelector('#pwc-submit').addEventListener('click', submit);
    ov.querySelector('#pwc-confirm').addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    setTimeout(function () { var f = ov.querySelector('#pwc-new'); if (f) f.focus(); }, 50);
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
  // Default : Jour 1 deverrouille (evite le mur vide), J2-J4 sous controle admin
  var unlocks = {
    demos: { 'demo-prompt': true, 'demo-chatbot': true, 'demo-vqa': true, 'demo-translate': true },
    highlights: { 'lightning-d1-am': true, 'showcase-d1-pm': true, 'boss-d1': true },
    phases: { 'phase1': true },
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
  // Vue formateur : connecte en admin ET pas en mode "voir comme un etudiant".
  // Sert a reveler les corriges (caches aux etudiants).
  function isFormateurView() { return !!(state.user && state.user.isAdmin && !adminAsStudent); }

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
      // Restaure l'INTEGRALITE de l'etat sauvegarde (campaignData, productTheme, gameValidation,
      // workbook, reflections, journal...). NE PAS filtrer par hasOwnProperty : ces cles sont
      // ajoutees dynamiquement et seraient sinon perdues a la reconnexion -> "realisations vides".
      if (s && typeof s === 'object') {
        Object.keys(s).forEach(function (k) {
          if (k === 'user' && state.user) return; // garder l'utilisateur fraichement connecte
          state[k] = s[k];
        });
      }
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
      // Auth anonyme : donne un uid par appareil pour la propriete des comptes (regles Firebase).
      // Si l'auth anonyme n'est pas (encore) activee dans la console, on continue sans bloquer l'app.
      if (firebase.auth) {
        firebase.auth().signInAnonymously().catch(function (e) {
          console.warn('Auth anonyme indisponible (activez-la dans la console Firebase) :', e && e.code);
        });
      }
    } catch (e) { console.error('Firebase init error:', e); }
  }

  function initParticles() {
    var c = document.getElementById('particles-canvas');
    if (!c) return;
    // UX#7 : respecter prefers-reduced-motion (perf laptops + confort) -> pas d'animation
    try { if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { c.style.display = 'none'; return; } } catch (e) {}
    var ctx = c.getContext('2d'), pts = [], n = 50, raf = null;
    function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    for (var i = 0; i < n; i++) pts.push({ x: Math.random()*c.width, y: Math.random()*c.height, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4, r: Math.random()*2+0.5 });
    function draw() {
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(function(p){ p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=c.width; if(p.x>c.width)p.x=0; if(p.y<0)p.y=c.height; if(p.y>c.height)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='rgba(167,31,40,0.25)'; ctx.fill(); });
      for(var i=0;i<pts.length;i++) for(var j=i+1;j<pts.length;j++){
        var dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle='rgba(167,31,40,'+(0.08*(1-d/120))+')'; ctx.lineWidth=0.5; ctx.stroke(); }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    // Pause quand l'onglet est masque (economie CPU/batterie sur les laptops)
    document.addEventListener('visibilitychange', function(){ if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } } else if (!raf) { draw(); } });
  }

  function showToast(msg, type) {
    var c = document.getElementById('toast-container'), t = document.createElement('div');
    t.className = 'toast ' + (type||'info'); t.textContent = msg; c.appendChild(t);
    setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 3200);
  }

  function hashPass(str) { var h=0; for(var i=0;i<str.length;i++){h=((h<<5)-h+str.charCodeAt(i))|0;} return (h>>>0).toString(16); }
  // Hachage fort SHA-256 (Web Crypto, contexte securise https/localhost). Sel par compte = anti rainbow-table.
  function sha256Hex(str) {
    try {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function (buf) {
        var v = new Uint8Array(buf), out = '';
        for (var i = 0; i < v.length; i++) out += ('0' + v[i].toString(16)).slice(-2);
        return out;
      });
    } catch (e) {
      return Promise.resolve('legacy:' + hashPass(str)); // fallback (vieux navigateur / contexte non securise)
    }
  }
  function hashAccountPass(accountKey, pw) { return sha256Hex('aia2|' + accountKey + '|' + pw); }
  function hashAdminPass(pw) { return sha256Hex('aia2-admin|' + pw); }
  // Revendication de propriete : lie le compte a l'uid (auth anonyme) du 1er appareil. Les regles empechent un autre de l'ecraser.
  function claimOwnership(accountKey) {
    try {
      var u = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
      if (!db || !u || !accountKey) return;
      db.ref('owners/' + accountKey).transaction(function (cur) { return (cur === null || cur === undefined) ? u.uid : cur; });
    } catch (e) {}
  }

  function getLevelInfo(xp) {
    var lvl=LEVELS[0];
    for(var i=LEVELS.length-1;i>=0;i--){ if(xp>=LEVELS[i].xpNeeded){lvl=LEVELS[i];break;} }
    var next=LEVELS[lvl.level]||null;
    var pct=next?((xp-lvl.xpNeeded)/(next.xpNeeded-lvl.xpNeeded))*100:100;
    return {level:lvl.level,title:lvl.title,xpNeeded:lvl.xpNeeded,nextXp:next?next.xpNeeded:lvl.xpNeeded,progress:Math.min(100,pct)};
  }

  var PVP_PENALTY_FACTOR = 0.75; // malus apres defaite contre l'IA Supreme
  function isPvpPenaltyActive() { return !!(state.pvpPenaltyUntil && Date.now() < state.pvpPenaltyUntil); }
  function pvpPenaltyMinutesLeft() { return isPvpPenaltyActive() ? Math.ceil((state.pvpPenaltyUntil - Date.now()) / 60000) : 0; }
  // Demarre le malus 0,75x pendant `ms` (defaite contre l'admin)
  function startPvpPenalty(ms) { state.pvpPenaltyUntil = Date.now() + ms; saveStateNow(); }
  // Enregistre que la tentative unique de duel admin est consommee
  function recordBossDuel(result) { state.bossDuel = { used: true, result: result, ts: new Date().toISOString() }; saveStateNow(); }
  function getBossDuel() { return state.bossDuel; }

  // Boss SOLO des mini-jeux : suivi des parties reussies + statut "boss vaincu".
  var BOSS_UNLOCK_WINS = 3;
  function getGameProgress() {
    if (!state.gameProgress) state.gameProgress = { rpg:{wins:0,bossDone:false}, quiz:{wins:0,bossDone:false}, battle:{wins:0,bossDone:false}, challenge:{wins:0,bossDone:false} };
    return state.gameProgress;
  }
  function bumpGameProgress(game) {
    var gp = getGameProgress(); if (!gp[game]) gp[game] = { wins:0, bossDone:false };
    gp[game].wins = (gp[game].wins || 0) + 1; saveState(); return gp[game].wins;
  }
  function markGameBoss(game) {
    var gp = getGameProgress(); if (!gp[game]) gp[game] = { wins:0, bossDone:false };
    gp[game].bossDone = true;
    var all = ['rpg','quiz','battle','challenge'].every(function (g) { return gp[g] && gp[g].bossDone; });
    if (all) awardBadge('boss-hunter');
    saveState();
  }

  function addXP(amount, reason) {
    if (!state.xp) state.xp = { total: 0, history: [] };
    if (!Array.isArray(state.xp.history)) state.xp.history = [];
    // Malus PvP : 0,75x sur les gains positifs tant que le malus est actif (defaite contre l'IA Supreme)
    var applied = amount;
    if (amount > 0 && isPvpPenaltyActive()) {
      applied = Math.round(amount * PVP_PENALTY_FACTOR);
      reason = (reason || '') + ' ⚠️ malus -25%';
    }
    var _prevLvl = getLevelInfo(state.xp.total || 0).level;
    state.xp.total = (state.xp.total || 0) + applied;
    state.xp.history.unshift({amount:applied,reason:reason||'',date:new Date().toISOString()});
    if(state.xp.history.length>50) state.xp.history.length=50;
    updateXPDisplay(); showXPPopup(applied,reason);
    if(applied>0 && getLevelInfo(state.xp.total).level>_prevLvl) showLevelUp(getLevelInfo(state.xp.total).level);
    if(state.xp.total>=500) awardBadge('xp-500');
    saveState();
  }
  // Celebration de passage de niveau (moment de fierte, effet "waouh" en salle)
  function showLevelUp(level){
    var info = getLevelInfo(state.xp.total);
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:99998;pointer-events:none';
    ov.innerHTML = '<div class="levelup-box" style="background:linear-gradient(135deg,#A71F28,#f5b731);color:#fff;padding:1.6rem 2.6rem;border-radius:18px;text-align:center;box-shadow:0 14px 55px rgba(167,31,40,0.55)">'+
      '<div style="font-size:2.6rem;line-height:1">🎉</div><div style="font-weight:800;font-size:1.45rem;margin-top:.3rem">Niveau '+level+' !</div>'+
      '<div style="opacity:.95;font-size:0.95rem">'+(info.title||'')+'</div></div>';
    document.body.appendChild(ov);
    var box = ov.querySelector('.levelup-box');
    box.style.transition = 'transform .45s cubic-bezier(0.22,1,0.36,1),opacity .45s'; box.style.transform = 'scale(0.6)'; box.style.opacity = '0';
    requestAnimationFrame(function(){ box.style.transform = 'scale(1)'; box.style.opacity = '1'; });
    setTimeout(function(){ if(box){ box.style.transform = 'scale(0.9)'; box.style.opacity = '0'; } }, 2300);
    setTimeout(function(){ if(ov.parentNode) ov.parentNode.removeChild(ov); }, 2800);
  }
  function updateXPDisplay(){ var el=document.getElementById('nav-xp-amount'); if(el) el.textContent=state.xp.total; }
  function showXPPopup(amount,reason){
    var p=document.getElementById('xp-popup');
    document.getElementById('xp-popup-amount').textContent='+'+amount;
    document.getElementById('xp-popup-reason').textContent=reason;
    p.classList.remove('hidden'); setTimeout(function(){p.classList.add('hidden');},1600);
  }

  // Prime XP par rarete : relie les badges (le plus gros gisement de contenu) a la progression + la boutique.
  var BADGE_XP = { common: 10, rare: 25, epic: 60, legendary: 120 };
  function awardBadge(id){
    if(state.badges.indexOf(id)!==-1) return;
    state.badges.push(id);
    var b=BADGES.find(function(x){return x.id===id;});
    if(b){ document.getElementById('badge-popup-icon').textContent=b.icon; document.getElementById('badge-popup-name').textContent=b.name; document.getElementById('badge-popup').classList.remove('hidden'); }
    try { if(window.AIA && window.AIA.pushFeed && state.user && !state.user.isAdmin) window.AIA.pushFeed({ action:'badge-unlocked', target: (b?b.name:id) }); } catch(e){}
    saveState();
    // Recompense XP selon la rarete (awardBadge('xp-500') rappele depuis addXP s'arrete car badge deja possede -> pas de boucle)
    var _bxp = BADGE_XP[(b && b.rarity) || 'common'] || 10;
    if (_bxp > 0) addXP(_bxp, 'Badge debloque : ' + (b ? b.name : id));
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
    // Bonus de connexion quotidienne (rituel "reviens demain") — escalade J1->J4
    var _dayBonus = [10,20,30,50][Math.min(getCurrentDay()-1,3)] || 10;
    addXP(_dayBonus, '🔥 Connexion jour ' + getCurrentDay() + ' (serie ' + state.streak.count + ')');
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
      lightning:function(){if(window.AIA&&window.AIA.renderLightningChallenge)window.AIA.renderLightningChallenge(main);},
      boss:function(){if(window.AIA&&window.AIA.renderBossChallenge)window.AIA.renderBossChallenge(main);},
      resources:function(){if(window.AIA&&window.AIA.renderResources)window.AIA.renderResources(main);},
      journal:function(){if(window.AIA&&window.AIA.renderJournal)window.AIA.renderJournal(main);},
      workbook:function(){if(window.AIA&&window.AIA.renderWorkbook)window.AIA.renderWorkbook(main);},
      notebook:function(){if(window.AIA&&window.AIA.renderNotebook)window.AIA.renderNotebook(document.getElementById('main-content'));},
      exercices:function(){if(window.AIA&&window.AIA.renderExercises)window.AIA.renderExercises(document.getElementById('main-content'));},
      checkins:function(){if(window.AIA&&window.AIA.renderCheckinsPage)window.AIA.renderCheckinsPage(main);},
      'assessment-pre':function(){if(window.AIA&&window.AIA.renderAssessment)window.AIA.renderAssessment(main,'pre');},
      'assessment-post':function(){if(window.AIA&&window.AIA.renderAssessment)window.AIA.renderAssessment(main,'post');},
      certificate:function(){if(window.AIA&&window.AIA.renderCertificate)window.AIA.renderCertificate(main);},
      skilltree:function(){if(window.AIA&&window.AIA.renderSkillTree)window.AIA.renderSkillTree(main);},
      'peer-review':function(){if(window.AIA&&window.AIA.renderPeerReview)window.AIA.renderPeerReview(main);},
      wall:function(){if(window.AIA&&window.AIA.renderWall)window.AIA.renderWall(main);},
      inbox:function(){if(window.AIA&&window.AIA.renderInbox)window.AIA.renderInbox(main);},
      shop:function(){if(window.AIA&&window.AIA.renderShop)window.AIA.renderShop(main);},
      arena:renderArena,
      'business-game':function(){if(window.AIA&&window.AIA.renderBusinessGameNew){window.AIA.renderBusinessGameNew(document.getElementById('main-content'));}else{renderBusinessGame();}},
      showcase:function(){if(window.AIA&&window.AIA.renderCampaignShowcase)window.AIA.renderCampaignShowcase(document.getElementById('main-content'));},
      leaderboard:renderLeaderboard,
      tools:renderTools, profile:renderProfile, admin:renderAdmin
    };
    // Gate: demos & highlights require admin unlock (admin bypasses unless in student mode)
    if (page && page.indexOf('demo-') === 0 && !isItemUnlocked('demos', page)) {
      showToast('🔒 Demo verrouillee — l\'admin l\'a pas encore debloquee', 'warning');
      page = 'demos';
      state.currentPage = page; // keep saved page in sync with the redirect
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

  // === REFERENCE + LIVE TIMER HELPERS ===
  function getActivityRef(actId){
    for(var d=1;d<=4;d++){
      var p=PROGRAM['day'+d]; if(!p) continue;
      var idxM=p.matin.findIndex(function(a){return a.id===actId;});
      if(idxM>=0) return 'REF-J'+d+'-AM-'+String(idxM+1).padStart(2,'0');
      var idxA=p.aprem.findIndex(function(a){return a.id===actId;});
      if(idxA>=0) return 'REF-J'+d+'-PM-'+String(idxA+1).padStart(2,'0');
    }
    return 'REF-?';
  }

  function getActivityShareUrl(actId){
    var base = location.origin + location.pathname;
    return base + '#activity-' + actId;
  }

  // === LINKED ELEMENTS (demos / game / arena / resources...) per activity ===
  var LINK_LABELS = {
    'avatar': { icon:'🎨', label:'Creer mon avatar' },
    'assessment-pre': { icon:'📋', label:'Pre-test' },
    'assessment-post': { icon:'🎓', label:'Post-test' },
    'certificate': { icon:'🏆', label:'Mon certificat' },
    'resources': { icon:'📚', label:'Ressources' },
    'journal': { icon:'📔', label:'Journal' },
    'workbook': { icon:'📓', label:'Carnet de campagne' },
    'skilltree': { icon:'🌳', label:'Skill Tree' },
    'battle': { icon:'⚔️', label:'Battle de Prompts' },
    'arena': { icon:'🏟️', label:'Arena (Quiz/Defis)' },
    'rpg': { icon:'🎮', label:'RPG PvP' },
    'business-game': { icon:'🎯', label:'Business Game' },
    'showcase': { icon:'🖼️', label:'Showcase campagnes' },
    'wall': { icon:'📡', label:'Mur live' },
    'leaderboard': { icon:'🏅', label:'Classement' },
    'demo-prompt': { icon:'✍️', label:'Demo Prompt Playground' },
    'demo-chatbot': { icon:'💬', label:'Demo Chatbot' },
    'demo-vqa': { icon:'👁️', label:'Demo Analyse Visuelle' },
    'demo-translate': { icon:'🌍', label:'Demo Traduction' },
    'demo-image': { icon:'🎨', label:'Demo Generation Images' },
    'demo-logo': { icon:'🆎', label:'Demo Generateur Logos' },
    'demo-bg-remove': { icon:'🖼️', label:'Demo Suppression Fond' },
    'demo-upscale': { icon:'🔍', label:'Demo Upscaler' },
    'demo-sentiment': { icon:'😊', label:'Demo Sentiment' },
    'demo-music': { icon:'🎵', label:'Demo Generation Musicale' },
    'demo-tts': { icon:'🗣️', label:'Demo Voix Off' },
    'demo-avatar': { icon:'🎬', label:'Demo Avatar Video' },
    'demo-abtest': { icon:'📊', label:'Demo A/B Testing' },
    'demo-seo': { icon:'🔍', label:'Demo SEO Analyzer' },
    'demo-speech': { icon:'🎙️', label:'Demo Transcription' }
  };

  function renderActivityLinks(links, unlocked){
    if(!links || !links.length) return '';
    var h = '<div class="activity-links">';
    links.forEach(function(route){
      var meta = LINK_LABELS[route] || { icon:'▶', label:route };
      if(unlocked){
        h += '<a class="activity-link-btn" href="#'+route+'" onclick="event.stopPropagation();window.AIA.navigateTo(\''+route+'\');return false;">'+meta.icon+' '+meta.label+' →</a>';
      } else {
        h += '<span class="activity-link-btn disabled" title="Disponible une fois l\'activite debloquee">'+meta.icon+' '+meta.label+'</span>';
      }
    });
    return h + '</div>';
  }

  function pad2(n){ return String(n).padStart(2,'0'); }

  function parseTimes(timeStr){
    var m = timeStr && timeStr.match(/(\d+)h(\d+)\s*[-–]\s*(\d+)h(\d+)/);
    if(!m) return null;
    return { sH:parseInt(m[1]), sM:parseInt(m[2]), eH:parseInt(m[3]), eM:parseInt(m[4]) };
  }

  function getActivityCountdown(act, dayIdx){
    var t = parseTimes(act.time);
    if(!t) return { label:'⏰ '+act.time, css:'upcoming' };
    var dateStr = CONFIG.dates[dayIdx]; if(!dateStr) return { label:'⏰ '+act.time, css:'upcoming' };
    var start = new Date(dateStr+'T'+pad2(t.sH)+':'+pad2(t.sM)+':00');
    var end   = new Date(dateStr+'T'+pad2(t.eH)+':'+pad2(t.eM)+':00');
    var now = new Date();
    if(now >= end){
      var hoursAgo = Math.floor((now-end)/3600000);
      var d_ago = Math.floor(hoursAgo/24);
      var lbl = d_ago>0?'il y a '+d_ago+'j':hoursAgo>0?'il y a '+hoursAgo+'h':'a l\'instant';
      return { label:'✓ Termine '+lbl, css:'past' };
    }
    if(now >= start){
      var remMs = end - now;
      var remMin = Math.ceil(remMs/60000);
      var totalMs = end - start;
      var pct = Math.min(100, Math.round((1 - remMs/totalMs)*100));
      return { label:'🔴 EN COURS · '+remMin+' min restantes', css:'live', pct:pct };
    }
    var diffMs = start - now;
    var totalMin = Math.floor(diffMs/60000);
    var days = Math.floor(totalMin/(60*24));
    var hours = Math.floor((totalMin - days*60*24)/60);
    var mins = totalMin - days*60*24 - hours*60;
    var lbl2;
    if(days>0) lbl2 = 'Dans '+days+'j '+hours+'h';
    else if(hours>0) lbl2 = 'Dans '+hours+'h '+(mins>0?mins+'min':'');
    else lbl2 = 'Dans '+mins+' min';
    return { label:'⏳ '+lbl2.trim(), css:'upcoming' };
  }

  function renderTimerCell(act, dayIdx){
    var c = getActivityCountdown(act, dayIdx);
    var bar = c.pct!==undefined ? '<div class="timer-progress"><div class="timer-progress-fill" style="width:'+c.pct+'%"></div></div>' : '';
    return '<div class="activity-timer '+c.css+'" data-timer-id="'+act.id+'" data-timer-day="'+dayIdx+'">' +
      '<div class="timer-label">'+c.label+'</div>' + bar + '</div>';
  }

  function refreshAllTimers(){
    document.querySelectorAll('[data-timer-id]').forEach(function(el){
      var actId = el.getAttribute('data-timer-id');
      var dayIdx = parseInt(el.getAttribute('data-timer-day'));
      var act = null;
      for(var d=1;d<=4;d++){
        var p=PROGRAM['day'+d]; if(!p) continue;
        act = p.matin.concat(p.aprem).find(function(a){return a.id===actId;});
        if(act) break;
      }
      if(!act) return;
      var c = getActivityCountdown(act, dayIdx);
      el.className = 'activity-timer '+c.css;
      var lbl = el.querySelector('.timer-label'); if(lbl) lbl.textContent = c.label;
      var fill = el.querySelector('.timer-progress-fill');
      if(c.pct!==undefined){
        if(!fill){
          var bar = document.createElement('div'); bar.className='timer-progress';
          bar.innerHTML='<div class="timer-progress-fill" style="width:'+c.pct+'%"></div>';
          el.appendChild(bar);
        } else fill.style.width = c.pct+'%';
      } else if(fill){
        var par = fill.parentNode; if(par && par.parentNode) par.parentNode.removeChild(par);
      }
    });
  }

  function copyActivityLink(actId){
    var url = getActivityShareUrl(actId);
    if(navigator.clipboard) navigator.clipboard.writeText(url).then(function(){
      showToast('Lien copie : '+url,'success');
    }); else {
      try{
        var ta=document.createElement('textarea'); ta.value=url; document.body.appendChild(ta);
        ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
        showToast('Lien copie','success');
      }catch(e){ showToast(url,'info'); }
    }
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

  // ===== Fil conducteur : prochaine action + checklist du jour (micro-etape 3) =====
  var DEMO_LABELS = {
    'demo-prompt':'✍️ Prompt Playground','demo-chatbot':'💬 Chatbot Marketing','demo-vqa':'👁️ Analyse Visuelle IA',
    'demo-translate':'🌍 Traduction','demo-image':"🎨 Generation d'Images",'demo-logo':'🆎 Generateur de Logos',
    'demo-bg-remove':'🖼️ Suppression de Fond','demo-upscale':'🔍 Upscaler','demo-sentiment':'😊 Analyse de Sentiment',
    'demo-music':'🎵 Generation Musicale','demo-tts':'🗣️ Voix Off IA','demo-avatar':'🎬 Avatar Video',
    'demo-abtest':'📊 A/B Testing','demo-seo':'🔍 SEO Analyzer','demo-speech':'🎙️ Transcription'
  };
  function gamePhaseProgress(){
    var PG = (window.AIA && window.AIA.PHASES_GUIDE) || {};
    var done=0,total=0;
    Object.keys(PG).forEach(function(pk){
      var unlocked = !window.AIA.isItemUnlocked || window.AIA.isItemUnlocked('phases',pk);
      if(!unlocked) return;
      (PG[pk].steps||[]).forEach(function(s){ total++; if(state.gameDeliverables && state.gameDeliverables[s.id]) done++; });
    });
    return {done:done,total:total};
  }
  function workbookFilledCount(){
    var wb = state.workbook;
    if(!wb || !wb.fields) return 0;
    var secs = (window.AIA && window.AIA.WORKBOOK_SECTIONS) || [];
    return secs.filter(function(s){ return wb.fields[s.id] && wb.fields[s.id].trim().length>20; }).length;
  }
  function computeDayChecklist(){
    var today = new Date().toISOString().split('T')[0];
    var sc = (window.AIA && window.AIA.getSessionContext) ? window.AIA.getSessionContext() : null;
    var recDemos = (sc && sc.demos) || [];
    var demosDone = recDemos.filter(function(id){ return state.demosCompleted.indexOf(id)!==-1; });
    var gp = gamePhaseProgress();
    var wbCount = workbookFilledCount();
    var gameComplete = gp.total>0 && gp.done>=gp.total;
    var list = [
      { key:'avatar', icon:'🎨', label:'Creer ton avatar', done: !!state.avatar, route:'avatar' },
      { key:'checkin', icon:'☀️', label:'Faire ton check-in du jour', done: !!(state.streak && state.streak.lastDate===today), action:'checkin' },
      { key:'project', icon:'🎯', label:'Choisir ton projet fil rouge', done: !!state.productTheme, route:'business-game' },
      { key:'game', icon:'🎮', label:'Business Game — etapes ('+gp.done+'/'+gp.total+')', done: gameComplete, route:'business-game' },
      { key:'demos', icon:'🛠️', label:'Tester les demos du jour ('+demosDone.length+'/'+(recDemos.length||0)+')', done: recDemos.length>0 && demosDone.length>=recDemos.length, route:'demos' },
      { key:'carnet', icon:'📓', label:'Structurer ton Carnet ('+wbCount+' section'+(wbCount>1?'s':'')+')', done: wbCount>=1, route:'workbook' }
    ];
    // Livrable final : generer le site vitrine (debloque quand le Business Game est complet)
    if (gameComplete) {
      list.push({ key:'vitrine', icon:'🌐', label:'Generer ton site vitrine (livrable final)', done: !!state.vitrineGenerated, route:'workbook' });
    }
    return list;
  }
  function computeNextAction(){
    var items = computeDayChecklist();
    var pending = items.filter(function(i){ return !i.done; });
    return pending.length ? pending[0] : null;
  }
  function actionAttr(i){ return i.action ? ' data-action="'+i.action+'"' : ' data-navigate="'+i.route+'"'; }
  function renderNextActionBanner(){
    var next = computeNextAction();
    if(!next){
      return '<div class="next-action done glass-card"><span class="na-icon">🎉</span>'+
        '<div class="na-body"><div class="na-label">Tout est fait pour aujourd\'hui — bravo !</div>'+
        '<div class="na-sub">Continue ton Carnet ou explore les demos bonus.</div></div>'+
        '<button class="btn-outline btn-sm" data-navigate="workbook">📓 Carnet</button></div>';
    }
    return '<div class="next-action glass-card">'+
      '<span class="na-icon">'+next.icon+'</span>'+
      '<div class="na-body"><div class="na-eyebrow">👉 Ta prochaine action</div>'+
      '<div class="na-label">'+next.label+'</div></div>'+
      '<button class="btn-primary btn-sm na-cta"'+actionAttr(next)+'>Y aller →</button></div>';
  }
  function renderDayChecklist(){
    var items = computeDayChecklist();
    var doneCount = items.filter(function(i){return i.done;}).length;
    var h = '<details class="day-checklist glass-card"'+(doneCount<items.length?' open':'')+'>'+
      '<summary><span class="dc-title">✅ Checklist du jour</span><span class="dc-count">'+doneCount+'/'+items.length+'</span></summary>'+
      '<div class="dc-items">';
    items.forEach(function(i){
      h += '<div class="dc-item'+(i.done?' done':'')+'"'+actionAttr(i)+'>'+
        '<span class="dc-check">'+(i.done?'✅':'⬜')+'</span>'+
        '<span class="dc-icon">'+i.icon+'</span>'+
        '<span class="dc-label">'+i.label+'</span>'+
        (i.done?'':'<span class="dc-go">→</span>')+
        '</div>';
    });
    h += '</div></details>';
    return h;
  }
  function wireCheckinTriggers(main){
    main.querySelectorAll('[data-action="checkin"]').forEach(function(el){
      el.addEventListener('click', function(e){
        e.preventDefault();
        if(window.AIA && window.AIA.showMorningCheckin) window.AIA.showMorningCheckin();
      });
    });
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
      renderNextActionBanner()+
      renderDayChecklist()+
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
    wireCheckinTriggers(main);
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

  function parseStartMin(timeStr){
    if(!timeStr) return 9999;
    var hm = timeStr.match(/(\d+)h(\d+)/);
    if(hm) return parseInt(hm[1])*60+parseInt(hm[2]);
    var cm = timeStr.match(/(\d+):(\d+)/);
    if(cm) return parseInt(cm[1])*60+parseInt(cm[2]);
    return 9999;
  }

  function renderTimelineHighlight(hl, dayIdx){
    var unlocked = !window.AIA.isItemUnlocked || window.AIA.isItemUnlocked('highlights', hl.id);
    var typeLabels = { lightning:'⚡ Lightning Round', showcase:'🎪 Showcase', boss:'👑 Boss Challenge', wrapup:'📊 Wrap-up' };
    var actionBtn = '';
    if(hl.action && LINK_LABELS[hl.action]){
      var meta = LINK_LABELS[hl.action];
      actionBtn = unlocked
        ? '<a class="activity-link-btn" href="#'+hl.action+'" onclick="event.stopPropagation();window.AIA.navigateTo(\''+hl.action+'\');return false;">'+meta.icon+' '+meta.label+' →</a>'
        : '<span class="activity-link-btn disabled">'+meta.icon+' '+meta.label+'</span>';
    }
    return '<div class="timeline-item temps-fort type-'+hl.type+'">'+
      '<div class="timeline-time">'+hl.timeStart+' - '+hl.timeEnd+'</div>'+
      '<div class="tf-badge-row"><span class="tf-type-badge tf-'+hl.type+'">'+(typeLabels[hl.type]||'Temps fort')+'</span>'+
        '<span class="tf-xp">+'+hl.xp+' XP</span>'+
        (!unlocked?'<span class="activity-locked-tag">🔒 Verrouille</span>':'')+
      '</div>'+
      '<h4>'+hl.icon+' '+hl.title+'</h4><p>'+hl.desc+'</p>'+
      (hl.brief?'<p class="tf-brief">📋 '+hl.brief+'</p>':'')+
      (actionBtn?'<div class="activity-links">'+actionBtn+'</div>':'')+
      '</div>';
  }

  function renderTimeline(){
    var h='';
    var HIGHLIGHTS = (window.AIA && window.AIA.HIGHLIGHTS) || [];
    ['day1','day2','day3','day4'].forEach(function(k,i){
      var d=PROGRAM[k];
      h+='<div class="timeline-item"><h4 style="color:var(--red-light)">'+CONFIG.dateLabels[i]+' — '+d.title+'</h4></div>';
      var items = [];
      d.matin.concat(d.aprem).forEach(function(a){
        items.push({ kind:'activity', start: parseStartMin(a.time), data: a });
      });
      HIGHLIGHTS.filter(function(hl){ return hl.day === (i+1); }).forEach(function(hl){
        items.push({ kind:'highlight', start: parseStartMin(hl.timeStart), data: hl });
      });
      items.sort(function(a,b){ return a.start - b.start; });
      items.forEach(function(it){
        if(it.kind === 'highlight'){
          h += renderTimelineHighlight(it.data, i);
          return;
        }
        var a = it.data;
        var ref=getActivityRef(a.id);
        var locked=!isActivityUnlocked(a.id, i);
        h+='<div class="timeline-item'+(state.progress[a.id]?' completed':'')+'">'+
          '<div class="timeline-time">'+a.time+'</div>'+
          '<div class="timeline-ref-row">'+
            '<span class="activity-ref" title="Reference unique">'+ref+'</span>'+
            (!locked?'<button class="activity-share-btn" title="Copier le lien direct" onclick="window.AIA.copyActivityLink(\''+a.id+'\')">🔗</button>':'<span class="activity-locked-tag">🔒 Verrouille</span>')+
          '</div>'+
          '<h4>'+a.title+'</h4><p>'+a.desc+'</p>'+
          (!locked?renderTimerCell(a, i):'')+
          renderActivityLinks(a.links, !locked)+
          '</div>';
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
    var di = dayIdx!==undefined?dayIdx:getCurrentDay()-1;
    var h='<div class="activity-list">';
    acts.forEach(function(a){
      var done=state.progress[a.id];
      var st=getActivityStatus(a, di);
      var badgeClass=done||st==='past'?'done':st==='live'?'live':'upcoming';
      var userReaction=state.reactions?state.reactions[a.id]:null;
      var locked=!isActivityUnlocked(a.id, di);
      var ref=getActivityRef(a.id);
      h+='<div class="activity-item glass-card'+(locked?' locked':' clickable')+(done?' completed':'')+'"'+(locked?'':' data-navigate="activity-'+a.id+'"')+'>'+
        '<div class="activity-icon '+a.type+'">'+(locked?'🔒':(icons[a.type]||'📌'))+'</div>'+
        '<div class="activity-info">'+
        '<div class="activity-ref-row">'+
          '<span class="activity-ref" title="Reference unique">'+ref+'</span>'+
          (!locked?'<button class="activity-share-btn" title="Copier le lien direct" onclick="event.stopPropagation();window.AIA.copyActivityLink(\''+a.id+'\')">🔗 Lien</button>':'')+
        '</div>'+
        '<h4'+(locked?' style="opacity:0.5"':'')+'>'+a.title+'</h4>'+(locked?'<p style="color:var(--text-muted);font-size:0.75rem">Completez l\'activite precedente pour debloquer</p>':'<p>'+a.desc+'</p>')+
        (!locked?renderTimerCell(a, di):'')+
        renderActivityLinks(a.links, !locked)+
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

    // Bandeau : demos recommandees pour la session en cours (fil conducteur)
    var sc = (window.AIA && window.AIA.getSessionContext) ? window.AIA.getSessionContext() : null;
    var recIds = (sc && sc.demos) || [];
    if (recIds.length) {
      var recDone = recIds.filter(function(id){ return state.demosCompleted.indexOf(id)!==-1; }).length;
      html += '<div class="demos-reco glass-card">'+
        '<div class="demos-reco-head">🎯 <strong>A faire maintenant</strong> &bull; '+(sc.label||'')+' <span class="demos-reco-count">'+recDone+'/'+recIds.length+'</span></div>'+
        '<p class="demos-reco-sub">Testez ces demos puis <strong>📌 epinglez vos resultats au Carnet</strong> pour nourrir votre projet.</p>'+
        '<div class="demos-reco-chips">'+
        recIds.map(function(id){
          var dn = state.demosCompleted.indexOf(id)!==-1;
          var unlocked = isItemUnlocked('demos', id);
          var lbl = DEMO_LABELS[id] || id;
          var attr = unlocked ? ' data-navigate="'+id+'"' : '';
          return '<button class="demos-reco-chip'+(dn?' done':'')+(unlocked?'':' locked')+'"'+attr+'>'+(dn?'✅ ':(unlocked?'':'🔒 '))+lbl+'</button>';
        }).join('')+
        '</div></div>';
    }
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
      '<div class="arena-mode-card glass-card rpg-card" id="btn-start-rpg"><div class="mode-icon">🐉</div><h3>RPG PvP</h3><p>Choisissez votre classe, affrontez la classe ou <strong>d&eacute;fiez le Prof</strong> !</p><div style="font-size:0.7rem;color:var(--accent)">5 combats / jour &bull; Boss solo &bull; Duel du Prof</div></div>'+
      '</div>';
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

  // ===== Annonces formateur -> classe (micro-etape 6) =====
  var _announcementsListener = null;
  var _sessionStartTs = Date.now();
  function escA(s){ var d=document.createElement('div'); d.textContent = s==null?'':String(s); return d.innerHTML; }
  function initAnnouncements(){
    if(!db || _announcementsListener) return;
    _announcementsListener = db.ref('announcements').limitToLast(1).on('child_added', function(snap){
      var a = snap.val(); if(!a || !a.message) return;
      var id = snap.key;
      var lastSeen = null;
      try { lastSeen = localStorage.getItem('aia_last_announcement'); } catch(e){}
      if(id === lastSeen) return; // deja vue / rejetee
      // ignorer les annonces anterieures a l'ouverture de session (pas de spam d'historique)
      if(a.ts && a.ts < _sessionStartTs - 60000) return;
      showAnnouncementBanner(a.message, a.from || 'Formateur', id);
    });
  }
  function showAnnouncementBanner(message, from, id){
    var existing = document.getElementById('announce-banner'); if(existing) existing.remove();
    var b = document.createElement('div');
    b.id = 'announce-banner'; b.className = 'announce-banner';
    b.innerHTML = '<span class="announce-icon">📣</span>' +
      '<span class="announce-text"><strong>'+escA(from)+' :</strong> '+escA(message)+'</span>' +
      '<button class="announce-close" aria-label="Fermer">✕</button>';
    document.body.appendChild(b);
    var markSeen = function(){ try{ localStorage.setItem('aia_last_announcement', id); }catch(e){} };
    b.querySelector('.announce-close').addEventListener('click', function(){ markSeen(); b.remove(); });
    setTimeout(function(){ if(document.getElementById('announce-banner')===b){ markSeen(); b.classList.add('hiding'); setTimeout(function(){ if(b.parentNode) b.remove(); }, 400); } }, 12000);
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
    },function(err){
      var el=document.getElementById('leaderboard-content');
      if(el) el.innerHTML='<div class="glass-card" style="text-align:center;padding:2rem">⚠️ Connexion interrompue.<br><span style="color:var(--text-muted);font-size:0.85rem">Le classement se mettra a jour des le retour du reseau.</span><br><button class="btn-outline btn-sm" data-navigate="leaderboard" style="margin-top:0.8rem">Reessayer</button></div>';
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
    // Couronne or/argent/bronze selon le RANG reel (1=or, 2=argent, 3=bronze) — corrige l'ancien mapping inverse
    function crownFor(rk){
      var st={1:'filter:drop-shadow(0 0 6px #FFD700) saturate(1.3)',2:'filter:grayscale(1) brightness(1.5) drop-shadow(0 0 6px #C0C0C0)',3:'filter:sepia(1) saturate(2.4) hue-rotate(-18deg) brightness(0.92) drop-shadow(0 0 6px #CD7F32)'};
      var lbl={1:'1re place — couronne d\'or',2:'2e place — couronne d\'argent',3:'3e place — couronne de bronze'};
      return '<span class="lb-crown" title="'+(lbl[rk]||'')+'" style="font-size:1.7rem;display:inline-block;line-height:1;'+(st[rk]||'')+'">👑</span>';
    }
    var order=[1,0,2],podH='';
    order.forEach(function(idx){var s=students[idx];if(!s)return;var rk=idx+1;/* rank = sorted position +1 */
      podH+='<div class="podium-item'+(s.isMe?' is-me':'')+'"><div class="rank">'+crownFor(rk)+'</div>'+
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

  // Guided first-run banner (tres guide)
  function showGuideBanner(title, sub){
    hideGuideBanner();
    var b = document.createElement('div');
    b.id = 'guide-banner';
    b.innerHTML = '<div class="gb-text"><strong>' + title + '</strong><span>' + sub + '</span></div>' +
      '<button class="btn-primary btn-sm" id="gb-continue">Continuer le parcours →</button>';
    document.body.appendChild(b);
    var btn = document.getElementById('gb-continue');
    if (btn) btn.addEventListener('click', function () {
      if (window.AIA && typeof window.AIA._firstRunSequence === 'function') window.AIA._firstRunSequence();
    });
  }
  function hideGuideBanner(){
    var b = document.getElementById('guide-banner'); if (b) b.remove();
  }

  function enterApp(name, isAdmin, accountKey) {
    var _welcome = document.getElementById('page-welcome'); if (_welcome) _welcome.style.display = 'none';
    document.getElementById('page-login').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    if (!isAdmin) {
      awardBadge('first-login'); updateStreak();
    }
    saveState(); listenDayLocks();
    showToast('Bienvenue ' + name + ' !', 'success'); initFirebase();
    // Revendiquer la propriete du compte des que l'auth anonyme est prete (lie le compte a cet appareil)
    if (!isAdmin && accountKey && typeof firebase !== 'undefined' && firebase.auth) {
      var _claim = function () { claimOwnership(accountKey); };
      if (firebase.auth().currentUser) _claim();
      else firebase.auth().onAuthStateChanged(function (u) { if (u) _claim(); });
    }
    if (!isAdmin) initAnnouncements();
    renderNavAvatar();
    // Sync admin student-mode banner visibility
    var banner = document.getElementById('admin-as-student-banner');
    if (banner) banner.style.display = (isAdmin && adminAsStudent) ? 'flex' : 'none';

    var isFirstLogin = !isAdmin && !state.onboardingDone;
    if (isFirstLogin) {
      // MICRO-PARCOURS J1 : Avatar -> Tour -> Check-in -> Projet (tres guide)
      navigateTo('avatar');
      showGuideBanner('Etape 1/4 — Creez votre avatar', 'Personnalisez votre personnage, puis cliquez sur "Continuer le parcours".');
      window.AIA._firstRunSequence = function () {
        hideGuideBanner();
        if (window.AIA.maybeStartOnboarding) window.AIA.maybeStartOnboarding(); // Etape 2 : Tour
      };
    } else {
      navigateTo(state.currentPage || 'dashboard');
      setTimeout(function () {
        if (window.AIA && window.AIA.maybeShowCheckin) window.AIA.maybeShowCheckin();
      }, 900);
    }
    if (!isAdmin) checkAutoComplete();
    // Intervals lances UNE SEULE FOIS (enterApp peut etre rappele apres logout/login)
    if (!isAdmin && !_loopsStarted) {
      _loopsStarted = true;
      setInterval(checkAutoComplete, 60000);
      // Popups check-in/exit-ticket selon l'horaire du seminaire (auto-fire a l'heure de fin)
      setInterval(function () { if (window.AIA && window.AIA.maybeShowCheckin) window.AIA.maybeShowCheckin(); }, 60000);
      setInterval(saveState, 30000);
    }
    window.addEventListener('beforeunload', function () { saveStateNow(); });
  }
  var _loopsStarted = false;

  function resetLoginUI() {
    document.getElementById('role-picker').classList.remove('hidden');
    document.getElementById('student-login-panel').classList.add('hidden');
    document.getElementById('admin-login-panel').classList.add('hidden');
    document.getElementById('student-login-form').classList.remove('hidden');
    document.getElementById('student-register-form').classList.add('hidden');
  }

  function populateNameList(){
    var sel = document.getElementById('login-name-select');
    if (!sel) return;
    if (!db) {
      sel.innerHTML = '<option value="">— Hors-ligne : utilisez la saisie manuelle —</option>';
      var ml = document.getElementById('login-manual-group'); var nl = document.getElementById('login-namelist-group');
      if (ml && nl) { ml.classList.remove('hidden'); nl.classList.add('hidden'); }
      return;
    }
    db.ref('accounts').once('value', function (snap) {
      var accts = snap.val() || {};
      var list = Object.keys(accts).map(function (k) {
        return { ln: accts[k].lastName || '', fn: accts[k].firstName || '' };
      }).filter(function (a) { return a.ln || a.fn; });
      list.sort(function (a, b) { return (a.lastName + a.fn).localeCompare ? (a.ln + a.fn).localeCompare(b.ln + b.fn) : 0; });
      if (!list.length) {
        sel.innerHTML = '<option value="">— Aucun compte : demandez au formateur —</option>';
        return;
      }
      sel.innerHTML = '<option value="">— Choisissez votre nom —</option>' +
        list.map(function (a) {
          return '<option value="' + escapeAttr(JSON.stringify({ ln: a.ln, fn: a.fn })) + '">' + (a.fn + ' ' + a.ln).trim() + '</option>';
        }).join('');
    }, function (err) {
      // WiFi salle instable : ne pas bloquer sur "Chargement..." -> bascule en saisie manuelle
      sel.innerHTML = '<option value="">— Connexion impossible : utilisez la saisie manuelle —</option>';
      var ml = document.getElementById('login-manual-group'); var nl = document.getElementById('login-namelist-group');
      if (ml && nl) { ml.classList.remove('hidden'); nl.classList.add('hidden'); }
    });
  }
  function escapeAttr(s){ return String(s).replace(/"/g, '&quot;'); }

  function initAuth(){
    // Welcome screen -> reveal login
    var welcome = document.getElementById('page-welcome');
    var startBtn = document.getElementById('btn-welcome-start');
    if (startBtn) startBtn.addEventListener('click', function () {
      if (welcome) welcome.style.display = 'none';
      var login = document.getElementById('page-login'); if (login) login.style.display = '';
    });

    document.getElementById('role-student').addEventListener('click', function () {
      document.getElementById('role-picker').classList.add('hidden');
      document.getElementById('student-login-panel').classList.remove('hidden');
      populateNameList();
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

    // Toggle between name dropdown and manual entry
    var toggleManual = document.getElementById('btn-toggle-manual');
    if (toggleManual) toggleManual.addEventListener('click', function () {
      var nl = document.getElementById('login-namelist-group');
      var ml = document.getElementById('login-manual-group');
      var manualVisible = !ml.classList.contains('hidden');
      if (manualVisible) {
        ml.classList.add('hidden'); nl.classList.remove('hidden');
        this.textContent = 'Mon nom n\'est pas dans la liste';
      } else {
        ml.classList.remove('hidden'); nl.classList.add('hidden');
        this.textContent = '← Revenir a la liste des noms';
      }
    });

    document.getElementById('btn-student-login').addEventListener('click', function () {
      var ln, fn;
      var manualGroup = document.getElementById('login-manual-group');
      var usingManual = manualGroup && !manualGroup.classList.contains('hidden');
      if (usingManual) {
        ln = document.getElementById('login-lastname').value.trim();
        fn = document.getElementById('login-firstname').value.trim();
      } else {
        var sel = document.getElementById('login-name-select');
        var opt = sel && sel.value ? JSON.parse(sel.value) : null;
        if (opt) { ln = opt.ln; fn = opt.fn; }
      }
      var pw = document.getElementById('login-password').value;
      if (!ln || !fn) return showToast('Selectionnez votre nom dans la liste', 'warning');
      if (!pw) return showToast('Mot de passe requis', 'warning');
      showToast('Connexion...', 'info');
      hashAccountPass(getAccountKey(ln, fn), pw).then(function (ph) {
      loginAccount(ln, fn, ph, function (result) {
        if (result.error) return showToast(result.error, 'error');
        var displayName = result.account.firstName + ' ' + result.account.lastName;
        function proceed() {
          state.user = { name: displayName, firstName: result.account.firstName, lastName: result.account.lastName, isAdmin: false, accountKey: result.key, loginDate: new Date().toISOString().split('T')[0] };
          loadAccountState(result.key, function () {
            state.user = { name: displayName, firstName: result.account.firstName, lastName: result.account.lastName, isAdmin: false, accountKey: result.key, loginDate: new Date().toISOString().split('T')[0] };
            enterApp(result.account.firstName, false, result.key);
          });
        }
        if (result.account.mustChangePassword) { forcePasswordChange(result.key, result.account, proceed); }
        else { proceed(); }
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
      hashAccountPass(getAccountKey(ln, fn), pw).then(function (ph) {
      createAccount(ln, fn, ph, function (result) {
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
    });

    document.getElementById('btn-admin-login').addEventListener('click', function () {
      var pw = document.getElementById('admin-password').value;
      if (!pw) return showToast('Mot de passe requis', 'warning');
      hashAdminPass(pw).then(function (ph) {
        if (ph !== CONFIG.adminHash) return showToast('Mot de passe incorrect', 'error');
        state.user = { name: CONFIG.mentorName, isAdmin: true, loginDate: new Date().toISOString().split('T')[0] };
        enterApp(CONFIG.mentorName, true, null);
      });
    });

    document.getElementById('btn-logout').addEventListener('click', function () {
      saveStateNow();
      if (db && state.user && state.user.accountKey) {
        db.ref('students/' + state.user.accountKey + '/online').set(false);
      }
      // Detacher le listener d'annonces + reinitialiser la fenetre de session (re-login propre)
      if (db && _announcementsListener) { try { db.ref('announcements').off('child_added', _announcementsListener); } catch (e) {} }
      _announcementsListener = null; _sessionStartTs = Date.now();
      var _ab = document.getElementById('announce-banner'); if (_ab) _ab.remove();
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
  window.AIA.hashAccountPass=hashAccountPass; // SHA-256 sale par compte (async)
  window.AIA.getAccountKey=getAccountKey; window.AIA.saveStateNow=saveStateNow;
  // Duel Prof (IA quasi imbattable) + boss solo des mini-jeux
  window.AIA.startPvpPenalty=startPvpPenalty; window.AIA.recordBossDuel=recordBossDuel;
  window.AIA.getBossDuel=getBossDuel; window.AIA.isPvpPenaltyActive=isPvpPenaltyActive;
  window.AIA.pvpPenaltyMinutesLeft=pvpPenaltyMinutesLeft;
  window.AIA.getGameProgress=getGameProgress; window.AIA.bumpGameProgress=bumpGameProgress;
  window.AIA.markGameBoss=markGameBoss; window.AIA.BOSS_UNLOCK_WINS=BOSS_UNLOCK_WINS;
  window.AIA.createAccount=createAccount; window.AIA.loginAccount=loginAccount;
  window.AIA.getActivityRef=getActivityRef;
  window.AIA.getActivityShareUrl=getActivityShareUrl;
  window.AIA.getActivityCountdown=getActivityCountdown;
  window.AIA.copyActivityLink=copyActivityLink;
  window.AIA.refreshAllTimers=refreshAllTimers;
  window.AIA.renderActivityLinks=renderActivityLinks;
  window.AIA.LINK_LABELS=LINK_LABELS;
  window.AIA.showGuideBanner=showGuideBanner;
  window.AIA.hideGuideBanner=hideGuideBanner;
  window.AIA.submitActivity=submitActivity; window.AIA.isActivityUnlocked=isActivityUnlocked;
  window.AIA.dayLocks=dayLocks; window.AIA.db=null;
  window.AIA.isItemUnlocked=isItemUnlocked;
  window.AIA.setUnlock=setUnlock;
  window.AIA.setUnlocksBulk=setUnlocksBulk;
  window.AIA.setAdminAsStudent=setAdminAsStudent;
  window.AIA.getAdminAsStudent=getAdminAsStudent;
  window.AIA.isFormateurView=isFormateurView;
  window.AIA.getUnlocks=function(){return unlocks;};

  function init(){
    initParticles(); initFirebase(); initAuth(); initNavigation();
    // Hash deep-link : if URL ends with #activity-foo or #/route, navigate after login
    function applyHashRoute(){
      var h = (location.hash || '').replace(/^#\/?/, '');
      if (!h) return;
      // Wait for app shell visible (post-login)
      if (document.getElementById('app-shell') && !document.getElementById('app-shell').classList.contains('hidden')) {
        navigateTo(h);
      }
    }
    window.addEventListener('hashchange', applyHashRoute);
    // Initial hash apply once user enters app
    var hashWatcher = setInterval(function(){
      if (document.getElementById('app-shell') && !document.getElementById('app-shell').classList.contains('hidden') && location.hash) {
        applyHashRoute(); clearInterval(hashWatcher);
      }
    }, 500);
    // Live timer refresh every 30s
    setInterval(function(){
      if (typeof refreshAllTimers === 'function') refreshAllTimers();
    }, 30000);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
