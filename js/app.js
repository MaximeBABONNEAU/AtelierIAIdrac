/* ==============================================
   AI MARKETING ACADEMY — Application JavaScript
   ============================================== */

(function () {
  'use strict';

  const CONFIG = {
    classCode: 'AIMARK2026',
    adminCode: 'MENTOR2026',
    storagePrefix: 'aia_',
    dates: ['2026-06-08', '2026-06-09', '2026-06-10', '2026-06-11'],
    dateLabels: ['Lundi 8 Juin', 'Mardi 9 Juin', 'Mercredi 10 Juin', 'Jeudi 11 Juin'],
  };

  const LEVELS = [
    { level: 1, title: 'Novice IA', xpNeeded: 0 },
    { level: 2, title: 'Curieux Digital', xpNeeded: 100 },
    { level: 3, title: 'Apprenti Prompt', xpNeeded: 250 },
    { level: 4, title: 'Createur IA', xpNeeded: 450 },
    { level: 5, title: 'Stratege Marketing', xpNeeded: 700 },
    { level: 6, title: 'Expert IA', xpNeeded: 1000 },
    { level: 7, title: 'Maitre du Marketing IA', xpNeeded: 1400 },
  ];

  const BADGES = [
    { id: 'first-login', icon: '\u{1F680}', name: 'Premier Pas', desc: 'Premiere connexion a l\'Academy' },
    { id: 'prompt-master', icon: '\u{270D}️', name: 'Prompt Master', desc: 'Termine l\'atelier Prompt Engineering' },
    { id: 'visual-creator', icon: '\u{1F3A8}', name: 'Createur Visuel', desc: 'Termine l\'atelier generation visuelle' },
    { id: 'copywriter', icon: '\u{1F4DD}', name: 'Copywriter IA', desc: 'Termine l\'atelier copywriting' },
    { id: 'video-star', icon: '\u{1F3AC}', name: 'Video Star', desc: 'Termine l\'atelier video IA' },
    { id: 'team-player', icon: '\u{1F91D}', name: 'Team Player', desc: 'Rejoindre une equipe du Business Game' },
    { id: 'day1-complete', icon: '\u{2B50}', name: 'Jour 1 Complete', desc: 'Terminer toutes les activites du Jour 1' },
    { id: 'day2-complete', icon: '\u{1F31F}', name: 'Jour 2 Complete', desc: 'Terminer toutes les activites du Jour 2' },
    { id: 'day3-complete', icon: '\u{1F4AB}', name: 'Jour 3 Complete', desc: 'Terminer toutes les activites du Jour 3' },
    { id: 'day4-complete', icon: '\u{1F3C6}', name: 'Jour 4 Complete', desc: 'Terminer toutes les activites du Jour 4' },
    { id: 'streak-3', icon: '\u{1F525}', name: 'On Fire!', desc: '3 jours de suite sur la plateforme' },
    { id: 'xp-500', icon: '\u{1F48E}', name: 'Demi-Millier', desc: 'Atteindre 500 XP' },
    { id: 'all-tools', icon: '\u{1F9F0}', name: 'Toolbox Complete', desc: 'Explorer tous les outils IA' },
    { id: 'game-complete', icon: '\u{1F3AF}', name: 'Game Over', desc: 'Completer toutes les phases du Business Game' },
    { id: 'graduate', icon: '\u{1F393}', name: 'Diplome IA', desc: 'Terminer l\'integralite du programme' },
  ];

  const AI_TOOLS = [
    { id: 'chatgpt', name: 'ChatGPT', icon: '\u{1F916}', tag: 'freemium', desc: 'Assistant conversationnel d\'OpenAI. Ideal pour le brainstorming, la redaction, l\'analyse et la creation de contenu marketing.', uses: ['Brainstorming', 'Redaction', 'Analyse', 'SEO'] },
    { id: 'claude', name: 'Claude', icon: '\u{1F9E0}', tag: 'freemium', desc: 'Assistant IA d\'Anthropic. Excellent pour les analyses longues, la strategie et le raisonnement complexe.', uses: ['Strategie', 'Analyse', 'Redaction', 'Code'] },
    { id: 'midjourney', name: 'Midjourney', icon: '\u{1F3A8}', tag: 'paid', desc: 'Generation d\'images par IA. Creez des visuels marketing, logos, mockups et illustrations uniques.', uses: ['Visuels pubs', 'Logos', 'Mockups', 'Branding'] },
    { id: 'canva', name: 'Canva AI', icon: '\u{2728}', tag: 'freemium', desc: 'Design assiste par IA. Templates marketing, generation d\'images, edition de photos et creation de presentations.', uses: ['Design', 'Templates', 'Presentations', 'Social media'] },
    { id: 'copyai', name: 'Copy.ai', icon: '\u{1F4DD}', tag: 'freemium', desc: 'Copywriting automatise. Generez des textes marketing, emails, posts sociaux et descriptions produits.', uses: ['Copywriting', 'Emails', 'Social posts', 'Ads'] },
    { id: 'jasper', name: 'Jasper', icon: '\u{1F4A1}', tag: 'paid', desc: 'Plateforme de contenu IA pour les equipes marketing. Brand voice, campagnes et contenu a grande echelle.', uses: ['Brand voice', 'Campagnes', 'Blog', 'Contenu'] },
    { id: 'heygen', name: 'HeyGen', icon: '\u{1F3AC}', tag: 'freemium', desc: 'Creation de videos avec avatars IA. Parfait pour les pitchs, demos produits et contenus marketing video.', uses: ['Video pitch', 'Demos', 'Tutoriels', 'Ads video'] },
    { id: 'elevenlabs', name: 'ElevenLabs', icon: '\u{1F399}️', tag: 'freemium', desc: 'Synthese vocale IA ultra-realiste. Creez des voix-off pour vos videos, podcasts et publicites.', uses: ['Voix-off', 'Podcasts', 'Audio ads', 'Narration'] },
    { id: 'perplexity', name: 'Perplexity', icon: '\u{1F50D}', tag: 'free', desc: 'Moteur de recherche IA avec sources. Ideal pour la veille concurrentielle et la recherche de marche.', uses: ['Recherche', 'Veille', 'Analyse marche', 'Sources'] },
  ];

  const PROGRAM = {
    day1: {
      title: 'Jour 1 — EVEIL',
      subtitle: 'Decouverte de l\'IA Generative',
      xp: 200,
      matin: [
        { id: 'd1-accueil', type: 'cours', time: '9h00 - 9h30', title: 'Accueil & Ice-breaker IA', desc: 'Presentation du programme, formation des premiers contacts. Mini-jeu : devine si c\'est l\'IA ou l\'humain.', xp: 15, items: ['Presentation de la semaine', 'Regles du jeu et systeme XP', 'Ice-breaker : IA ou Humain ?'] },
        { id: 'd1-cours1', type: 'cours', time: '9h30 - 10h30', title: 'L\'IA Generative : comprendre la revolution', desc: 'Comment fonctionnent les LLMs, les modeles de diffusion. Panorama complet des outils IA pour le marketing.', xp: 30, items: ['Comment fonctionne ChatGPT (tokens, transformers)', 'Images IA : de DALL-E a Midjourney', 'Le paysage IA marketing en 2026', 'Cas concrets de marques utilisant l\'IA'] },
        { id: 'd1-atelier1', type: 'atelier', time: '10h45 - 12h30', title: 'Prompt Engineering : l\'art de parler aux machines', desc: 'Maitrisez les techniques de prompting pour obtenir exactement ce que vous voulez de l\'IA.', xp: 50, items: ['La structure d\'un prompt efficace', 'Techniques : role-play, few-shot, chain-of-thought', 'Exercices pratiques sur ChatGPT et Claude', 'Creer son prompt book personnel'] },
      ],
      aprem: [
        { id: 'd1-atelier2', type: 'atelier', time: '14h00 - 15h30', title: 'ChatGPT & Claude : vos assistants marketing', desc: 'Utilisez les chatbots IA pour des taches marketing concretes : analyse, redaction, brainstorming.', xp: 45, items: ['Analyser un brief marketing avec l\'IA', 'Generer des idees de campagne', 'Rediger un communique de presse', 'Comparer ChatGPT vs Claude sur un meme brief'] },
        { id: 'd1-defi', type: 'defi', time: '15h45 - 17h00', title: 'DEFI — Le Prompt Battle', desc: 'Competition individuelle ! Creez le meilleur prompt marketing en temps limite. Les meilleurs gagnent des XP bonus.', xp: 60, items: ['Brief mystere revele en direct', '30 minutes pour creer LE prompt parfait', 'Presentation des 5 meilleurs', 'Vote de la classe + XP bonus'] },
      ],
    },
    day2: {
      title: 'Jour 2 — CREATION',
      subtitle: 'Contenu Marketing avec l\'IA',
      xp: 250,
      matin: [
        { id: 'd2-cours1', type: 'cours', time: '9h00 - 10h30', title: 'Copywriting IA : de la pub au SEO', desc: 'Maitrisez l\'art de la redaction assistee par IA. Du slogan publicitaire a l\'article de blog optimise SEO.', xp: 35, items: ['Les frameworks de copywriting (AIDA, PAS, BAB)', 'Adapter le ton et la brand voice avec l\'IA', 'SEO : keywords et meta descriptions generees', 'Email marketing assiste par IA'] },
        { id: 'd2-atelier1', type: 'atelier', time: '10h45 - 12h30', title: 'Generation visuelle : Midjourney, DALL-E & Canva AI', desc: 'Creez des visuels marketing professionnels sans competences graphiques.', xp: 55, items: ['Maitriser les prompts visuels (style, composition, mood)', 'Creer une serie de visuels de campagne', 'Retouche et adaptation avec Canva AI', 'Constituer une banque de visuels coherente'] },
      ],
      aprem: [
        { id: 'd2-atelier2', type: 'atelier', time: '14h00 - 15h30', title: 'Brand Voice & Storytelling avec l\'IA', desc: 'Apprenez a creer une identite de marque coherente et un storytelling captivant avec l\'assistance IA.', xp: 45, items: ['Definir une brand voice avec l\'IA', 'Creer un manifeste de marque', 'Storytelling : le hero\'s journey marketing', 'Decliner la voice sur differents canaux'] },
        { id: 'd2-defi', type: 'defi', time: '15h45 - 17h00', title: 'DEFI — La campagne en 60 minutes', desc: 'Par binomes, creez une mini-campagne complete (visuel + copy + post social) pour un produit tire au sort.', xp: 65, items: ['Tirage au sort du produit', '60 minutes chrono : 1 visuel + 1 copy + 1 post', 'Presentation express (2 min/binome)', 'Vote + XP bonus pour le top 3'] },
      ],
    },
    day3: {
      title: 'Jour 3 — STRATEGIE',
      subtitle: 'IA Avancee & Business Game',
      xp: 300,
      matin: [
        { id: 'd3-cours1', type: 'cours', time: '9h00 - 10h30', title: 'Video, Voix & Automation Marketing', desc: 'Decouvrez les outils IA avances : creation video, synthese vocale et automation des workflows marketing.', xp: 35, items: ['HeyGen : creer des videos avec avatars IA', 'ElevenLabs : voix-off ultra-realistes', 'Automation : chatbots, email sequences, social scheduling', 'L\'IA dans le marketing predictif'] },
        { id: 'd3-atelier1', type: 'atelier', time: '10h45 - 12h30', title: 'HeyGen + ElevenLabs : le marketing augmente', desc: 'Creez votre premiere video marketing avec avatar IA et voix synthetique.', xp: 55, items: ['Configurer un avatar HeyGen', 'Ecrire un script de video marketing', 'Ajouter une voix ElevenLabs', 'Monter et exporter sa video'] },
      ],
      aprem: [
        { id: 'd3-brief', type: 'game', time: '14h00 - 14h30', title: 'BUSINESS GAME — Le Brief', desc: 'Presentation du challenge : lancer un produit fictif de A a Z avec l\'IA en equipe !', xp: 20, items: ['Presentation du challenge et des regles', 'Criteres d\'evaluation', 'Livrables attendus'] },
        { id: 'd3-teams', type: 'game', time: '14h30 - 15h00', title: 'Formation des equipes', desc: 'Constitution des equipes et attribution des roles.', xp: 15, items: ['Tirage au sort ou choix libre', 'Attribution des roles (CEO, CMO, CTO, Designer, Content)', 'Creation de l\'espace equipe'] },
        { id: 'd3-game1', type: 'game', time: '15h15 - 17h00', title: 'Phase 1 — Ideation & Recherche', desc: 'Brainstorming IA, analyse de marche et definition du produit.', xp: 50, items: ['Brainstorming assiste par ChatGPT/Claude', 'Recherche de marche avec Perplexity', 'Definition du produit et de la cible', 'Creation du persona client avec l\'IA'] },
      ],
    },
    day4: {
      title: 'Jour 4 — LANCEMENT',
      subtitle: 'Production & Pitchs Finals',
      xp: 350,
      matin: [
        { id: 'd4-game2', type: 'game', time: '9h00 - 10h00', title: 'Phase 2 — Branding & Identite', desc: 'Creez l\'identite visuelle de votre marque entierement avec l\'IA.', xp: 40, items: ['Generer le nom de marque (ChatGPT)', 'Creer le logo (Midjourney/Canva)', 'Definir la charte graphique', 'Ecrire le brand manifesto'] },
        { id: 'd4-game3', type: 'game', time: '10h15 - 11h30', title: 'Phase 3 — Campagne Marketing', desc: 'Produisez les contenus de votre campagne marketing.', xp: 50, items: ['Creer 3 visuels publicitaires', 'Rediger les textes de campagne', 'Elaborer le plan media', 'Creer un post social pret a publier'] },
        { id: 'd4-game4', type: 'game', time: '11h30 - 12h30', title: 'Phase 4 — Landing Page & Pitch', desc: 'Finalisez votre campagne avec une landing page et un pitch.', xp: 45, items: ['Prototyper une landing page (Canva/Gamma)', 'Creer la video pitch avec HeyGen', 'Preparer le deck de presentation', 'Repeter le pitch (5 min max)'] },
      ],
      aprem: [
        { id: 'd4-pitchs', type: 'pitch', time: '14h00 - 16h00', title: 'Pitchs des Equipes', desc: 'Chaque equipe presente sa campagne marketing devant la classe. 10 minutes par equipe + 5 min de questions.', xp: 80, items: ['Presentation du produit et du marche', 'Demonstration de la campagne', 'Video pitch et landing page', 'Q&A avec la classe et le mentor'] },
        { id: 'd4-awards', type: 'award', time: '16h30 - 17h30', title: 'Ceremonie des Awards & Cloture', desc: 'Vote, remise des prix, certification et cloture de la semaine.', xp: 50, items: ['Vote de la classe (meilleur produit, meilleur pitch, meilleur branding)', 'Remise des awards', 'Recap de la semaine et takeaways', 'Remise des certificats'] },
      ],
    },
  };

  // ─── STORAGE ───
  const Storage = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(CONFIG.storagePrefix + key);
        return raw ? JSON.parse(raw) : fallback;
      } catch { return fallback; }
    },
    set(key, value) {
      localStorage.setItem(CONFIG.storagePrefix + key, JSON.stringify(value));
    },
  };

  // ─── STATE ───
  let state = {
    user: Storage.get('user', null),
    xp: Storage.get('xp', { total: 0, history: [] }),
    progress: Storage.get('progress', {}),
    badges: Storage.get('badges', []),
    streak: Storage.get('streak', { count: 0, lastDate: null }),
    gameNotes: Storage.get('gameNotes', ''),
    gameDeliverables: Storage.get('gameDeliverables', {}),
    toolsExplored: Storage.get('toolsExplored', []),
  };

  function saveState() {
    Storage.set('user', state.user);
    Storage.set('xp', state.xp);
    Storage.set('progress', state.progress);
    Storage.set('badges', state.badges);
    Storage.set('streak', state.streak);
    Storage.set('gameNotes', state.gameNotes);
    Storage.set('gameDeliverables', state.gameDeliverables);
    Storage.set('toolsExplored', state.toolsExplored);
  }

  // ─── PARTICLES ───
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const count = 50;

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5, alpha: Math.random() * 0.4 + 0.1,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, ' + p.alpha + ')';
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(139, 92, 246, ' + (0.08 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ─── ROUTER ───
  let currentDay = null;

  function navigateTo(page) {
    if (!state.user && page !== 'login') return;
    document.querySelectorAll('#main-content .page, #page-login').forEach(function (p) {
      p.classList.add('hidden');
    });

    if (page === 'login') {
      document.getElementById('page-login').classList.remove('hidden');
      document.getElementById('app-shell').classList.add('hidden');
      return;
    }

    document.getElementById('app-shell').classList.remove('hidden');

    if (page.startsWith('day') && page !== 'day-current') {
      var dayNum = parseInt(page.replace('day', ''));
      currentDay = dayNum;
      renderDayView(dayNum);
      document.getElementById('page-day').classList.remove('hidden');
    } else if (page === 'day-current') {
      var today = getCurrentDay();
      currentDay = today;
      renderDayView(today);
      document.getElementById('page-day').classList.remove('hidden');
    } else {
      var el = document.getElementById('page-' + page);
      if (el) el.classList.remove('hidden');
    }

    updateNavActive(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'dashboard') renderDashboard();
    if (page === 'program') renderProgramProgress();
    if (page === 'leaderboard') renderLeaderboard();
    if (page === 'tools') renderTools();
    if (page === 'profile') renderProfile();
    if (page === 'admin') renderAdmin();
    if (page === 'business-game') renderBusinessGame();
  }

  function updateNavActive(page) {
    var base = page.startsWith('day') ? 'program' : page;
    document.querySelectorAll('.nav-link').forEach(function (l) {
      l.classList.toggle('active', l.dataset.navigate === base);
    });
    document.querySelectorAll('.mob-link').forEach(function (l) {
      l.classList.toggle('active', l.dataset.navigate === base);
    });
  }

  function getCurrentDay() {
    var today = new Date().toISOString().slice(0, 10);
    var idx = CONFIG.dates.indexOf(today);
    if (idx >= 0) return idx + 1;
    return 1;
  }

  // ─── AUTH ───
  function initAuth() {
    document.getElementById('login-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('login-name').value.trim();
      var code = document.getElementById('login-code').value.trim().toUpperCase();
      if (!name) return showToast('Entre ton prenom !', 'warning');

      var isAdmin = code === CONFIG.adminCode;
      if (code !== CONFIG.classCode && !isAdmin) {
        return showToast('Code d\'acces incorrect', 'error');
      }

      state.user = { name: name, isAdmin: isAdmin, loginDate: new Date().toISOString().slice(0, 10) };
      updateStreak();

      if (!state.badges.includes('first-login')) {
        awardBadge('first-login');
        addXP(10, 'Premiere connexion');
      }
      saveState();
      navigateTo('dashboard');
      showToast('Bienvenue ' + name + ' !', 'success');
    });

    document.getElementById('btn-logout').addEventListener('click', function () {
      navigateTo('login');
    });
  }

  function updateStreak() {
    var today = new Date().toISOString().slice(0, 10);
    if (state.streak.lastDate === today) return;
    var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (state.streak.lastDate === yesterday) {
      state.streak.count++;
    } else if (state.streak.lastDate !== today) {
      state.streak.count = 1;
    }
    state.streak.lastDate = today;
    if (state.streak.count >= 3 && !state.badges.includes('streak-3')) awardBadge('streak-3');
    saveState();
  }

  // ─── XP SYSTEM ───
  function addXP(amount, reason) {
    state.xp.total += amount;
    state.xp.history.unshift({ amount: amount, reason: reason, date: new Date().toISOString() });
    if (state.xp.history.length > 50) state.xp.history = state.xp.history.slice(0, 50);
    showXPPopup(amount, reason);
    updateXPDisplay();
    if (state.xp.total >= 500 && !state.badges.includes('xp-500')) awardBadge('xp-500');
    saveState();
  }

  function getLevelInfo(totalXP) {
    var current = LEVELS[0], next = LEVELS[1];
    for (var i = LEVELS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVELS[i].xpNeeded) {
        current = LEVELS[i];
        next = LEVELS[i + 1] || null;
        break;
      }
    }
    var xpInLevel = totalXP - current.xpNeeded;
    var xpForNext = next ? next.xpNeeded - current.xpNeeded : 1;
    var pct = next ? Math.min((xpInLevel / xpForNext) * 100, 100) : 100;
    return { level: current.level, title: current.title, pct: pct, nextXP: next ? next.xpNeeded : current.xpNeeded };
  }

  function updateXPDisplay() {
    var info = getLevelInfo(state.xp.total);
    var s = function (id, v) { var e = document.getElementById(id); if (e) e.textContent = v; };
    var w = function (id, v) { var e = document.getElementById(id); if (e) e.style.width = v; };
    s('xp-level-num', info.level);
    s('xp-level-title', info.title);
    s('xp-current', state.xp.total);
    s('xp-needed', info.nextXP);
    w('xp-bar-fill', info.pct + '%');
    s('nav-level', 'Nv.' + info.level);
    w('nav-xp-fill', info.pct + '%');
  }

  function showXPPopup(amount, reason) {
    var popup = document.getElementById('xp-popup');
    document.getElementById('xp-popup-amount').textContent = '+' + amount + ' XP';
    document.getElementById('xp-popup-reason').textContent = reason;
    popup.classList.remove('hidden');
    setTimeout(function () { popup.classList.add('hidden'); }, 1600);
  }

  // ─── BADGES ───
  function awardBadge(badgeId) {
    if (state.badges.includes(badgeId)) return;
    state.badges.push(badgeId);
    saveState();
    var badge = BADGES.find(function (b) { return b.id === badgeId; });
    if (!badge) return;
    setTimeout(function () {
      document.getElementById('badge-popup-icon').textContent = badge.icon;
      document.getElementById('badge-popup-name').textContent = badge.name;
      document.getElementById('badge-popup-desc').textContent = badge.desc;
      document.getElementById('badge-popup').classList.remove('hidden');
    }, 800);
  }

  // ─── ACTIVITY COMPLETION ───
  function completeActivity(activityId, xp, reason) {
    if (state.progress[activityId]) return;
    state.progress[activityId] = true;
    addXP(xp, reason);
    saveState();
    checkDayCompletion();
    if (currentDay) renderDayView(currentDay);
  }

  function checkDayCompletion() {
    [1, 2, 3, 4].forEach(function (d) {
      var dayData = PROGRAM['day' + d];
      if (!dayData) return;
      var all = dayData.matin.concat(dayData.aprem);
      var allDone = all.every(function (a) { return state.progress[a.id]; });
      if (allDone && !state.badges.includes('day' + d + '-complete')) awardBadge('day' + d + '-complete');
    });
    var allDays = [1, 2, 3, 4].every(function (d) { return state.badges.includes('day' + d + '-complete'); });
    if (allDays && !state.badges.includes('graduate')) awardBadge('graduate');
  }

  // ─── DASHBOARD ───
  function renderDashboard() {
    var day = getCurrentDay();
    document.getElementById('dash-username').textContent = state.user.name;
    document.getElementById('dash-date').textContent = 'Jour ' + day + ' • ' + CONFIG.dateLabels[day - 1];
    document.getElementById('streak-count').textContent = state.streak.count;
    document.getElementById('nav-avatar-letter').textContent = state.user.name.charAt(0).toUpperCase();
    updateXPDisplay();

    var dayData = PROGRAM['day' + day];
    if (dayData) {
      var allActs = dayData.matin.concat(dayData.aprem);
      var done = allActs.filter(function (a) { return state.progress[a.id]; }).length;
      var pct = Math.round((done / allActs.length) * 100);
      document.getElementById('dash-today-desc').textContent = dayData.subtitle;
      document.getElementById('dash-today-progress').style.width = pct + '%';
      document.getElementById('dash-today-pct').textContent = pct + '%';
    }

    var gameDone = Object.keys(state.gameDeliverables).filter(function (k) { return state.gameDeliverables[k]; }).length;
    var gamePct = Math.round((gameDone / 12) * 100);
    document.getElementById('dash-game-progress').style.width = gamePct + '%';
    document.getElementById('dash-game-pct').textContent = gamePct + '%';
    document.getElementById('dash-tools-count').textContent = state.toolsExplored.length + '/9';

    renderActivityFeed();

    if (state.user.isAdmin && !document.querySelector('.nav-link[data-navigate="admin"]')) {
      var adminNav = document.createElement('a');
      adminNav.href = '#';
      adminNav.className = 'nav-link';
      adminNav.dataset.navigate = 'admin';
      adminNav.title = 'Admin';
      adminNav.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Admin</span>';
      document.querySelector('.nav-links').appendChild(adminNav);
    }
  }

  function renderActivityFeed() {
    var feed = document.getElementById('activity-feed');
    if (state.xp.history.length === 0) {
      feed.innerHTML = '<p class="activity-empty">Aucune activite pour le moment. Commence le Jour 1 !</p>';
      return;
    }
    feed.innerHTML = state.xp.history.slice(0, 8).map(function (h) {
      var d = new Date(h.date);
      var time = d.getHours() + 'h' + String(d.getMinutes()).padStart(2, '0');
      return '<div class="activity-item"><div class="activity-icon" style="background:rgba(0,240,255,0.1)">⚡</div><div class="activity-text"><strong>+' + h.amount + ' XP</strong><p>' + h.reason + '</p></div><span class="activity-time">' + time + '</span></div>';
    }).join('');
  }

  // ─── PROGRAM PROGRESS ───
  function renderProgramProgress() {
    [1, 2, 3, 4].forEach(function (d) {
      var dayData = PROGRAM['day' + d];
      if (!dayData) return;
      var all = dayData.matin.concat(dayData.aprem);
      var done = all.filter(function (a) { return state.progress[a.id]; }).length;
      var pct = Math.round((done / all.length) * 100);
      var fillEl = document.getElementById('prog-day' + d + '-fill');
      var pctEl = document.getElementById('prog-day' + d + '-pct');
      if (fillEl) fillEl.style.width = pct + '%';
      if (pctEl) pctEl.textContent = pct + '%';
    });
  }

  // ─── DAY VIEW ───
  function renderDayView(dayNum) {
    var dayData = PROGRAM['day' + dayNum];
    if (!dayData) return;
    document.getElementById('day-title').textContent = dayData.title;
    document.getElementById('day-subtitle').textContent = dayData.subtitle;
    document.getElementById('day-xp-badge').textContent = '+' + dayData.xp + ' XP';

    var tabs = document.querySelectorAll('.day-tab');
    tabs.forEach(function (t) { t.classList.remove('active'); });
    tabs[0].classList.add('active');
    renderDayContent(dayNum, 'matin');

    tabs.forEach(function (t) {
      t.onclick = function () {
        tabs.forEach(function (t2) { t2.classList.remove('active'); });
        t.classList.add('active');
        renderDayContent(dayNum, t.dataset.tab);
      };
    });
  }

  function renderDayContent(dayNum, period) {
    var dayData = PROGRAM['day' + dayNum];
    var activities = dayData[period] || [];
    var container = document.getElementById('day-content');
    var typeIcons = { cours: '\u{1F4DA}', atelier: '\u{1F527}', defi: '⚔️', game: '\u{1F3AE}', pitch: '\u{1F3A4}', award: '\u{1F3C6}' };

    container.innerHTML = activities.map(function (act) {
      var isDone = state.progress[act.id];
      var icon = typeIcons[act.type] || '\u{1F4CB}';
      return '<div class="activity-card"><div class="activity-card-header"><div class="activity-type-icon ' + act.type + '-icon">' + icon + '</div><h3>' + act.title + '</h3><span class="act-xp">+' + act.xp + ' XP</span></div><span class="activity-time-slot">' + act.time + '</span><div class="activity-card-body"><p>' + act.desc + '</p><ul>' + act.items.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul></div><button class="btn-complete ' + (isDone ? 'done' : 'pending') + '" data-activity="' + act.id + '" data-xp="' + act.xp + '" data-reason="' + act.title + '"' + (isDone ? ' disabled' : '') + '>' + (isDone ? '✓ Termine' : 'Marquer comme termine') + '</button></div>';
    }).join('');

    container.querySelectorAll('.btn-complete.pending').forEach(function (btn) {
      btn.addEventListener('click', function () {
        completeActivity(btn.dataset.activity, parseInt(btn.dataset.xp), btn.dataset.reason);
        var badgeMap = { 'd1-atelier1': 'prompt-master', 'd2-atelier1': 'visual-creator', 'd2-atelier2': 'copywriter', 'd3-atelier1': 'video-star', 'd3-teams': 'team-player' };
        if (badgeMap[btn.dataset.activity]) awardBadge(badgeMap[btn.dataset.activity]);
      });
    });
  }

  // ─── BUSINESS GAME ───
  function renderBusinessGame() {
    document.getElementById('game-notes-input').value = state.gameNotes || '';

    document.querySelectorAll('.deliverable-check input').forEach(function (cb) {
      cb.checked = !!state.gameDeliverables[cb.dataset.del];
      cb.onchange = function () {
        state.gameDeliverables[cb.dataset.del] = cb.checked;
        saveState();
        updatePhaseStatuses();
        if (cb.checked) addXP(10, 'Livrable: ' + cb.parentElement.querySelector('span').textContent);
      };
    });

    document.getElementById('btn-save-notes').onclick = function () {
      state.gameNotes = document.getElementById('game-notes-input').value;
      saveState();
      showToast('Notes sauvegardees !', 'success');
    };
    updatePhaseStatuses();
  }

  function updatePhaseStatuses() {
    var phases = { 1: ['product-idea', 'target-persona', 'market-analysis'], 2: ['brand-name', 'logo', 'brand-guide'], 3: ['ad-visuals', 'copy', 'media-plan'], 4: ['landing-page', 'pitch-video', 'final-deck'] };
    var allComplete = true;

    Object.keys(phases).forEach(function (num) {
      var dels = phases[num];
      var done = dels.filter(function (d) { return state.gameDeliverables[d]; }).length;
      var el = document.getElementById('phase' + num + '-status');
      if (!el) return;
      if (done === dels.length) { el.textContent = 'Complete'; el.className = 'phase-status complete'; }
      else if (done > 0) { el.textContent = done + '/' + dels.length; el.className = 'phase-status in-progress'; allComplete = false; }
      else { el.textContent = 'A faire'; el.className = 'phase-status'; allComplete = false; }
    });

    var currentPhase = Object.keys(phases).find(function (num) { return phases[num].some(function (d) { return !state.gameDeliverables[d]; }); });
    document.getElementById('game-phase').textContent = currentPhase ? 'Phase ' + currentPhase : 'Termine !';
    if (allComplete && !state.badges.includes('game-complete')) awardBadge('game-complete');
  }

  // ─── LEADERBOARD ───
  function renderLeaderboard() {
    var students = getDemoLeaderboard().sort(function (a, b) { return b.xp - a.xp; });

    [1, 2, 3].forEach(function (pos) {
      var s = students[pos - 1];
      var el = document.getElementById('podium-' + pos);
      if (!el || !s) return;
      el.querySelector('.podium-name').textContent = s.name;
      el.querySelector('.podium-xp').textContent = s.xp + ' XP';
      el.querySelector('.podium-avatar').textContent = s.name.charAt(0);
    });

    document.getElementById('rankings-list').innerHTML = students.map(function (s, i) {
      var info = getLevelInfo(s.xp);
      var isMe = state.user && s.name === state.user.name;
      return '<div class="ranking-row' + (isMe ? ' me' : '') + '"><span class="rank-pos">' + (i + 1) + '</span><span class="rank-name">' + (isMe ? '→ ' : '') + s.name + '</span><span class="rank-xp">' + s.xp + '</span><span class="rank-level">Nv.' + info.level + '</span></div>';
    }).join('');

    document.querySelectorAll('.lb-toggle-btn').forEach(function (btn) {
      btn.onclick = function () {
        document.querySelectorAll('.lb-toggle-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      };
    });
  }

  function getDemoLeaderboard() {
    var names = ['Lea', 'Hugo', 'Camille', 'Lucas', 'Emma', 'Nathan', 'Chloe', 'Louis', 'Manon', 'Arthur', 'Jade', 'Raphael', 'Ines', 'Tom', 'Sarah', 'Theo', 'Lola', 'Maxime', 'Eva', 'Jules', 'Clara', 'Adam', 'Zoe', 'Paul', 'Louise', 'Noah', 'Alice', 'Ethan', 'Anna', 'Gabriel'];
    var students = names.map(function (name) {
      if (state.user && name === state.user.name) return { name: name, xp: state.xp.total };
      var seed = name.charCodeAt(0) * 13 + name.charCodeAt(name.length - 1) * 7;
      return { name: name, xp: Math.floor(((seed % 200) + 50) * (getCurrentDay() / 2)) };
    });
    if (state.user && !students.find(function (s) { return s.name === state.user.name; })) {
      students[0] = { name: state.user.name, xp: state.xp.total };
    }
    return students;
  }

  // ─── TOOLS ───
  function renderTools() {
    var grid = document.getElementById('tools-grid');
    grid.innerHTML = AI_TOOLS.map(function (tool) {
      var explored = state.toolsExplored.includes(tool.id);
      return '<div class="tool-card" data-tool="' + tool.id + '"><div class="tool-card-header"><div class="tool-logo">' + tool.icon + '</div><h3>' + tool.name + '</h3><span class="tool-tag ' + tool.tag + '">' + tool.tag + '</span></div><p>' + tool.desc + '</p><div class="tool-use-cases">' + tool.uses.map(function (u) { return '<span class="use-case">' + u + '</span>'; }).join('') + '</div>' + (explored ? '<p style="color:var(--green);font-size:0.8rem;margin-top:0.75rem">✓ Explore</p>' : '<button class="btn-secondary explore-tool-btn" style="margin-top:0.75rem" data-tool="' + tool.id + '">Marquer comme explore</button>') + '</div>';
    }).join('');

    grid.querySelectorAll('.explore-tool-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var toolId = btn.dataset.tool;
        if (!state.toolsExplored.includes(toolId)) {
          state.toolsExplored.push(toolId);
          var toolName = AI_TOOLS.find(function (t) { return t.id === toolId; }).name;
          addXP(15, 'Outil explore : ' + toolName);
          saveState();
          renderTools();
          if (state.toolsExplored.length >= 9 && !state.badges.includes('all-tools')) awardBadge('all-tools');
        }
      });
    });
  }

  // ─── PROFILE ───
  function renderProfile() {
    if (!state.user) return;
    var info = getLevelInfo(state.xp.total);
    document.getElementById('profile-avatar').textContent = state.user.name.charAt(0).toUpperCase();
    document.getElementById('profile-name').textContent = state.user.name;
    document.getElementById('profile-xp').textContent = state.xp.total;
    document.getElementById('profile-level').textContent = info.level;
    document.getElementById('profile-badges-count').textContent = state.badges.length;
    document.getElementById('profile-streak').textContent = state.streak.count;

    document.getElementById('profile-badges-grid').innerHTML = BADGES.map(function (b) {
      var unlocked = state.badges.includes(b.id);
      return '<div class="badge-item' + (unlocked ? '' : ' locked') + '"><span class="badge-icon">' + b.icon + '</span><span class="badge-name">' + b.name + '</span></div>';
    }).join('');

    document.getElementById('profile-xp-history').innerHTML = state.xp.history.slice(0, 20).map(function (h) {
      var d = new Date(h.date);
      var dateStr = d.getDate() + '/' + (d.getMonth() + 1) + ' ' + d.getHours() + 'h' + String(d.getMinutes()).padStart(2, '0');
      return '<div class="xp-history-item"><span class="xp-amount">+' + h.amount + '</span><span class="xp-reason">' + h.reason + '</span><span class="xp-date">' + dateStr + '</span></div>';
    }).join('');
  }

  // ─── ADMIN ───
  function renderAdmin() {
    if (!state.user || !state.user.isAdmin) { navigateTo('dashboard'); return; }
    var config = Storage.get('config', { classCode: CONFIG.classCode, teamCount: 5 });
    document.getElementById('admin-class-code').value = config.classCode;
    document.getElementById('admin-team-count').value = config.teamCount;

    document.getElementById('btn-save-config').onclick = function () {
      config.classCode = document.getElementById('admin-class-code').value.trim().toUpperCase();
      config.teamCount = parseInt(document.getElementById('admin-team-count').value);
      CONFIG.classCode = config.classCode;
      Storage.set('config', config);
      showToast('Configuration sauvegardee', 'success');
    };

    document.getElementById('btn-award-xp').onclick = function () {
      var amount = parseInt(document.getElementById('admin-xp-amount').value);
      var reason = document.getElementById('admin-xp-reason').value.trim();
      if (amount > 0 && reason) { addXP(amount, '[Mentor] ' + reason); showToast('+' + amount + ' XP attribues !', 'success'); }
    };

    document.getElementById('admin-students-list').innerHTML = getDemoLeaderboard().sort(function (a, b) { return a.name.localeCompare(b.name); }).map(function (s) {
      return '<div class="admin-student"><span>' + s.name + '</span><span style="color:var(--cyan)">' + s.xp + ' XP</span></div>';
    }).join('');
  }

  // ─── TOASTS ───
  function showToast(message, type) {
    var container = document.getElementById('toast-container');
    var icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    var toast = document.createElement('div');
    toast.className = 'toast ' + (type || 'info');
    toast.innerHTML = '<span>' + (icons[type] || 'ℹ️') + '</span><span>' + message + '</span>';
    container.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 4000);
  }

  // ─── EVENT DELEGATION ───
  function initNavigation() {
    document.addEventListener('click', function (e) {
      var navEl = e.target.closest('[data-navigate]');
      if (navEl) { e.preventDefault(); navigateTo(navEl.dataset.navigate); }
    });
    document.getElementById('badge-popup-close').addEventListener('click', function () {
      document.getElementById('badge-popup').classList.add('hidden');
    });
    document.getElementById('badge-popup').addEventListener('click', function (e) {
      if (e.target === document.getElementById('badge-popup')) document.getElementById('badge-popup').classList.add('hidden');
    });
  }

  // ─── INIT ───
  function init() {
    initParticles();
    initAuth();
    initNavigation();
    if (state.user) { updateStreak(); navigateTo('dashboard'); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
