/* ==============================================
   BATTLE.JS — Arena Multijoueur & Quiz
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function backBtn() {
    return '<a href="#" data-navigate="arena" style="color:var(--text-muted);font-size:0.78rem;text-decoration:none;display:inline-flex;align-items:center;gap:0.3rem;margin-bottom:0.5rem">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Arena</a>';
  }

  var QUIZ_QUESTIONS = [
    { q: 'Quel est le role principal du prompt engineering ?', options: ['Coder des algorithmes','Formuler des instructions optimales pour l\'IA','Designer des interfaces','Analyser des donnees'], correct: 1 },
    { q: 'Que signifie "few-shot prompting" ?', options: ['Utiliser peu de mots','Donner quelques exemples au modele','Limiter les reponses','Accelerer la generation'], correct: 1 },
    { q: 'Quel KPI mesure le pourcentage de visiteurs qui effectuent une action ?', options: ['CTR','CPC','Taux de conversion','Impressions'], correct: 2 },
    { q: 'Quelle technique IA genere des images a partir de texte ?', options: ['NLP','Computer Vision','Diffusion Models','Reinforcement Learning'], correct: 2 },
    { q: 'Que signifie E-E-A-T en SEO ?', options: ['Experience, Expertise, Autorite, Fiabilite','Engagement, Efficacite, Analyse, Tracking','Email, E-commerce, Ads, Targeting','Aucune de ces reponses'], correct: 0 },
    { q: 'Quel est l\'avantage principal de l\'A/B testing ?', options: ['Reduire les couts','Prendre des decisions basees sur les donnees','Accelerer le site','Ameliorer le design'], correct: 1 },
    { q: 'Qu\'est-ce qu\'un persona marketing ?', options: ['Un logo de marque','Un profil fictif du client ideal','Un type de publicite','Un outil d\'analyse'], correct: 1 },
    { q: 'Quelle plateforme est specialisee dans le contenu video court ?', options: ['LinkedIn','Twitter','TikTok','Pinterest'], correct: 2 },
    { q: 'Que mesure le ROAS en marketing digital ?', options: ['Le trafic organique','Le retour sur investissement publicitaire','La satisfaction client','Le taux de rebond'], correct: 1 },
    { q: 'Quel modele IA est connu pour la generation de texte conversationnel ?', options: ['DALL-E','Stable Diffusion','GPT / Claude','YOLO'], correct: 2 },
    { q: 'Qu\'est-ce que le "Zero-shot prompting" ?', options: ['Ne donner aucun exemple au modele','Utiliser zero token','Desactiver l\'IA','Supprimer l\'historique'], correct: 0 },
    { q: 'Quel est le format publicitaire le plus engage sur Instagram ?', options: ['Photo statique','Carrousel','Stories','IGTV'], correct: 1 },
    { q: 'Que signifie UGC en marketing ?', options: ['Universal Growth Campaign','User Generated Content','Unified Global Commerce','Ultra Graphics Creator'], correct: 1 },
    { q: 'Quel outil IA est specialise dans la creation de videos avec avatars ?', options: ['Canva','HeyGen','Mailchimp','Hootsuite'], correct: 1 },
    { q: 'Quelle metrique SEO mesure la vitesse de chargement ?', options: ['Domain Authority','Backlinks','Core Web Vitals','Meta Description'], correct: 2 }
  ];

  var CHALLENGE_BRIEFS = [
    { title: 'Slogan de lancement', brief: 'Creez un slogan percutant pour le lancement d\'une application de livraison eco-responsable. Max 15 mots.' },
    { title: 'Post LinkedIn viral', brief: 'Redigez un post LinkedIn de 3 lignes pour annoncer un nouveau produit IA. Objectif : engagement maximum.' },
    { title: 'Objet d\'email', brief: 'Ecrivez 3 variantes d\'objet d\'email pour une campagne Black Friday. Objectif : taux d\'ouverture > 30%.' },
    { title: 'Prompt IA creatif', brief: 'Formulez le meilleur prompt possible pour generer une affiche publicitaire pour un restaurant vegan haut de gamme.' },
    { title: 'Pitch elevator', brief: 'Presentez votre startup IA en 30 secondes (3-4 phrases). Probleme, solution, marche, differenciateur.' }
  ];

  /* ======== BATTLE DE PROMPTS ======== */
  function renderBattle(main) {
    var AIA = window.AIA;
    var st = AIA.getState();

    main.innerHTML = '<div class="page-header">' + backBtn() +
      '<h1>Battle de <span class="gradient-text">Prompts</span></h1>' +
      '<p class="page-subtitle">Soumettez votre prompt, comparez et votez</p></div>' +
      '<div class="battle-zone glass-card">' +
      '<div class="battle-brief">' +
      '<h3>Brief du duel</h3>' +
      '<p id="battle-brief-text">Ecrivez le meilleur prompt possible pour generer un slogan pour une marque de sneakers eco-responsables.</p>' +
      '<button class="btn-ghost btn-sm" id="btn-new-brief">Nouveau brief</button>' +
      '</div>' +
      '<div class="battle-submit">' +
      '<h3>Votre prompt</h3>' +
      '<textarea id="battle-prompt" class="demo-textarea" rows="4" placeholder="Tapez votre meilleur prompt ici..."></textarea>' +
      '<button class="btn-primary" id="btn-battle-submit">Soumettre</button>' +
      '</div>' +
      '<div id="battle-arena" class="battle-arena-result"></div></div>';

    var briefs = [
      'Ecrivez le meilleur prompt pour generer un slogan pour une marque de sneakers eco-responsables.',
      'Formulez un prompt pour creer une description produit irresistible pour un serum anti-age.',
      'Creez le prompt ideal pour generer 5 idees de posts Instagram pour un cafe artisanal.',
      'Ecrivez un prompt pour obtenir un script de publicite video de 30 secondes pour une appli fitness.',
      'Formulez un prompt pour creer un email de bienvenue personalise pour un service de box mensuelle.'
    ];

    document.getElementById('btn-new-brief').addEventListener('click', function () {
      document.getElementById('battle-brief-text').textContent = briefs[Math.floor(Math.random() * briefs.length)];
    });

    document.getElementById('btn-battle-submit').addEventListener('click', function () {
      var prompt = document.getElementById('battle-prompt').value.trim();
      if (!prompt) { AIA.showToast('Ecrivez votre prompt d\'abord', 'error'); return; }

      var arena = document.getElementById('battle-arena');
      arena.innerHTML = '<div class="loading-pulse">Recherche d\'un adversaire...</div>';

      setTimeout(function () {
        var opponents = ['Alice','Bob','Clara','David','Emma','Felix','Grace','Hugo'];
        var opp = opponents[Math.floor(Math.random() * opponents.length)];
        var oppPrompt = 'En tant que copywriter senior specialise ' + (prompt.length > 30 ? 'dans le branding' : 'en marketing digital') +
          ', cree un message percutant et memorable qui capture l\'essence de la marque.';

        var scoreA = Math.min(98, 35 + prompt.length + Math.floor(Math.random() * 15));
        var scoreB = 50 + Math.floor(Math.random() * 40);
        var userWins = scoreA >= scoreB;

        arena.innerHTML = '<div class="battle-versus">' +
          '<div class="battle-player">' +
          '<div class="player-name">' + escapeHtml(st.user || 'Vous') + '</div>' +
          '<div class="player-prompt">' + escapeHtml(prompt.substring(0, 120)) + (prompt.length > 120 ? '...' : '') + '</div>' +
          '<div class="player-score" style="color:' + (userWins ? '#2ecc71' : '#e74c3c') + '">' + scoreA + ' pts</div>' +
          '</div>' +
          '<div class="battle-vs">VS</div>' +
          '<div class="battle-player">' +
          '<div class="player-name">' + escapeHtml(opp) + '</div>' +
          '<div class="player-prompt">' + escapeHtml(oppPrompt) + '</div>' +
          '<div class="player-score" style="color:' + (!userWins ? '#2ecc71' : '#e74c3c') + '">' + scoreB + ' pts</div>' +
          '</div></div>' +
          '<div class="battle-result">' +
          '<div class="result-icon">' + (userWins ? '🏆' : '💪') + '</div>' +
          '<div class="result-text">' + (userWins ? 'Victoire ! Votre prompt est plus detaille et precis.' : 'Defaite — mais un bon prompt est un prompt ameliore !') + '</div>' +
          '</div>' +
          '<div class="battle-feedback glass-card" style="margin-top:1rem">' +
          '<h4>Analyse du prompt</h4>' +
          '<div class="feedback-item"><strong>Longueur :</strong> ' + prompt.split(/\s+/).length + ' mots ' + (prompt.split(/\s+/).length > 15 ? '(bon)' : '(court — ajoutez des details)') + '</div>' +
          '<div class="feedback-item"><strong>Role :</strong> ' + (prompt.toLowerCase().indexOf('en tant que') !== -1 ? 'Present (bien !)' : 'Absent — essayez "En tant que..."') + '</div>' +
          '<div class="feedback-item"><strong>Contraintes :</strong> ' + (prompt.match(/\d/) ? 'Presentes' : 'Absentes — ajoutez format, longueur, ton') + '</div>' +
          '</div>';

        if (userWins) {
          AIA.awardBadge('battle-win');
          AIA.addXP(50);
        } else {
          AIA.addXP(20);
        }
      }, 2000);
    });
  }

  /* ======== QUIZ INTERACTIF ======== */
  function startQuiz(main) {
    var AIA = window.AIA;
    var questions = [];
    var used = {};
    while (questions.length < 10 && questions.length < QUIZ_QUESTIONS.length) {
      var idx = Math.floor(Math.random() * QUIZ_QUESTIONS.length);
      if (!used[idx]) { used[idx] = true; questions.push(QUIZ_QUESTIONS[idx]); }
    }

    var currentQ = 0;
    var score = 0;
    var answered = false;
    var timerInterval = null;

    function renderQuestion() {
      answered = false;
      var q = questions[currentQ];
      main.innerHTML = '<div class="page-header">' + backBtn() +
        '<h1>Quiz <span class="gradient-text">Interactif</span></h1></div>' +
        '<div class="quiz-container glass-card">' +
        '<div class="quiz-header">' +
        '<div class="quiz-progress">Question ' + (currentQ + 1) + '/' + questions.length + '</div>' +
        '<div class="quiz-score">Score: ' + score + '</div>' +
        '<div class="quiz-timer" id="quiz-timer">15</div>' +
        '</div>' +
        '<div class="quiz-question">' + escapeHtml(q.q) + '</div>' +
        '<div class="quiz-options">' + q.options.map(function (opt, i) {
          return '<button class="quiz-option" data-idx="' + i + '">' + escapeHtml(opt) + '</button>';
        }).join('') + '</div>' +
        '<div id="quiz-feedback" class="quiz-feedback"></div></div>';

      var timeLeft = 15;
      var timerEl = document.getElementById('quiz-timer');

      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(function () {
        timeLeft--;
        if (timerEl) timerEl.textContent = timeLeft;
        if (timeLeft <= 5 && timerEl) timerEl.style.color = '#e74c3c';
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          handleAnswer(-1);
        }
      }, 1000);

      document.querySelectorAll('.quiz-option').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (answered) return;
          clearInterval(timerInterval);
          handleAnswer(parseInt(this.getAttribute('data-idx')));
        });
      });
    }

    function handleAnswer(idx) {
      if (answered) return;
      answered = true;
      var q = questions[currentQ];
      var correct = idx === q.correct;
      if (correct) score++;

      document.querySelectorAll('.quiz-option').forEach(function (btn) {
        var bIdx = parseInt(btn.getAttribute('data-idx'));
        if (bIdx === q.correct) btn.classList.add('correct');
        else if (bIdx === idx) btn.classList.add('wrong');
        btn.style.pointerEvents = 'none';
      });

      var fb = document.getElementById('quiz-feedback');
      if (idx === -1) {
        fb.innerHTML = '<div class="fb-wrong">Temps ecoule ! Reponse : ' + escapeHtml(q.options[q.correct]) + '</div>';
      } else if (correct) {
        fb.innerHTML = '<div class="fb-correct">Correct ! +1 point</div>';
      } else {
        fb.innerHTML = '<div class="fb-wrong">Incorrect. Reponse : ' + escapeHtml(q.options[q.correct]) + '</div>';
      }

      setTimeout(function () {
        currentQ++;
        if (currentQ < questions.length) {
          renderQuestion();
        } else {
          showQuizResults();
        }
      }, 2000);
    }

    function showQuizResults() {
      if (timerInterval) clearInterval(timerInterval);
      var pct = Math.round(score / questions.length * 100);
      var grade = pct >= 90 ? 'Excellent !' : pct >= 70 ? 'Tres bien !' : pct >= 50 ? 'Pas mal !' : 'A retravailler';
      var emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🌟' : pct >= 50 ? '👍' : '📚';

      main.innerHTML = '<div class="page-header">' + backBtn() +
        '<h1>Resultats du <span class="gradient-text">Quiz</span></h1></div>' +
        '<div class="quiz-results glass-card">' +
        '<div class="result-emoji">' + emoji + '</div>' +
        '<div class="result-score">' + score + '/' + questions.length + '</div>' +
        '<div class="result-pct">' + pct + '%</div>' +
        '<div class="result-grade">' + grade + '</div>' +
        '<div style="margin-top:1.5rem">' +
        '<button class="btn-primary" id="btn-quiz-retry">Recommencer</button>' +
        '<button class="btn-outline" data-navigate="arena" style="margin-left:0.5rem">Retour Arena</button>' +
        '</div></div>';

      if (score === questions.length) {
        AIA.awardBadge('quiz-perfect');
        AIA.addXP(100);
        AIA.showToast('Quiz parfait ! +100 XP', 'success');
      } else {
        AIA.addXP(10 + score * 5);
      }

      var retry = document.getElementById('btn-quiz-retry');
      if (retry) retry.addEventListener('click', function () { startQuiz(main); });
    }

    renderQuestion();
  }

  /* ======== CHALLENGE COLLECTIF ======== */
  function startChallenge(main) {
    var AIA = window.AIA;
    var challenge = CHALLENGE_BRIEFS[Math.floor(Math.random() * CHALLENGE_BRIEFS.length)];

    main.innerHTML = '<div class="page-header">' + backBtn() +
      '<h1>Challenge <span class="gradient-text">Collectif</span></h1>' +
      '<p class="page-subtitle">Meme brief pour tous — soumettez votre meilleure solution</p></div>' +
      '<div class="challenge-container glass-card">' +
      '<div class="challenge-brief">' +
      '<div class="challenge-icon">🏆</div>' +
      '<h3>' + escapeHtml(challenge.title) + '</h3>' +
      '<p>' + escapeHtml(challenge.brief) + '</p></div>' +
      '<textarea id="challenge-response" class="demo-textarea" rows="5" placeholder="Votre reponse au challenge..."></textarea>' +
      '<button class="btn-primary" id="btn-challenge-submit" style="margin-top:1rem">Soumettre ma reponse</button>' +
      '<div id="challenge-results" class="demo-results"></div></div>';

    document.getElementById('btn-challenge-submit').addEventListener('click', function () {
      var response = document.getElementById('challenge-response').value.trim();
      if (!response) { AIA.showToast('Ecrivez votre reponse', 'error'); return; }

      var res = document.getElementById('challenge-results');
      res.innerHTML = '<div class="loading-pulse">Soumission et analyse...</div>';

      setTimeout(function () {
        var fakeSubmissions = [
          { name: 'Alice', score: 72 + Math.floor(Math.random() * 20), excerpt: 'Solution creative avec focus storytelling...' },
          { name: 'Bob', score: 65 + Math.floor(Math.random() * 25), excerpt: 'Approche data-driven et KPIs clairs...' },
          { name: 'Clara', score: 70 + Math.floor(Math.random() * 20), excerpt: 'Branding emotionnel et experience client...' },
          { name: 'David', score: 60 + Math.floor(Math.random() * 30), excerpt: 'Strategie multicanale integree...' }
        ];
        var userName = AIA.getState().user || 'Vous';
        var userScore = Math.min(95, 50 + response.length / 2 + Math.floor(Math.random() * 20));
        fakeSubmissions.push({ name: userName, score: Math.round(userScore), excerpt: response.substring(0, 50) + '...' });
        fakeSubmissions.sort(function (a, b) { return b.score - a.score; });

        var userRank = 0;
        for (var i = 0; i < fakeSubmissions.length; i++) {
          if (fakeSubmissions[i].name === userName) { userRank = i + 1; break; }
        }

        res.innerHTML = '<div class="challenge-leaderboard">' +
          '<h3>Classement du challenge</h3>' +
          fakeSubmissions.map(function (s, i) {
            var isUser = s.name === userName;
            var medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
            return '<div class="challenge-entry' + (isUser ? ' highlight' : '') + '">' +
              '<span class="rank">' + (medal || (i + 1)) + '</span>' +
              '<span class="name">' + escapeHtml(s.name) + (isUser ? ' (vous)' : '') + '</span>' +
              '<span class="excerpt">' + escapeHtml(s.excerpt) + '</span>' +
              '<span class="score">' + s.score + ' pts</span></div>';
          }).join('') + '</div>' +
          '<div class="challenge-verdict">' +
          (userRank <= 2 ? 'Bravo, vous etes sur le podium !' : 'Continuez a pratiquer pour monter au classement !') +
          '</div>';

        AIA.addXP(20 + (6 - userRank) * 10);
        AIA.showToast('Challenge termine ! Rang #' + userRank, 'success');
      }, 2500);
    });
  }

  /* ======== RPG PvP — MINI JEU DE ROLE ======== */

  var RPG_CLASSES = [
    { id: 'prompt-mage', name: 'Prompt Mage', icon: '🧙', desc: 'Maitre des prompts — attaques puissantes',
      baseHP: 100, baseATK: 18, baseDEF: 8,
      skills: [
        { name: 'CRAC Attack', icon: '✍️', dmg: 25, cost: 20, desc: 'Prompt structure devastateur' },
        { name: 'Few-Shot Burst', icon: '⚡', dmg: 18, cost: 12, desc: 'Rafale d\'exemples' },
        { name: 'Chain-of-Thought', icon: '🔗', heal: 15, cost: 15, desc: 'Raisonnement regeneratif' }
      ] },
    { id: 'visual-knight', name: 'Visual Knight', icon: '🎨', desc: 'Createur visuel — defense solide',
      baseHP: 120, baseATK: 14, baseDEF: 12,
      skills: [
        { name: 'Pixel Slash', icon: '⚔️', dmg: 22, cost: 18, desc: 'Attaque creative tranchante' },
        { name: 'Brand Shield', icon: '🛡️', defBuff: 8, cost: 15, desc: 'Bouclier de marque (+8 DEF)' },
        { name: 'Color Heal', icon: '🌈', heal: 20, cost: 18, desc: 'Regeneration chromatique' }
      ] },
    { id: 'data-ranger', name: 'Data Ranger', icon: '📊', desc: 'Analyste — equilibre et precision',
      baseHP: 110, baseATK: 16, baseDEF: 10,
      skills: [
        { name: 'A/B Strike', icon: '📈', dmg: 20, cost: 15, desc: 'Attaque test statistique' },
        { name: 'SEO Snipe', icon: '🎯', dmg: 28, cost: 22, desc: 'Tir SEO de precision' },
        { name: 'Analytics Regen', icon: '💚', heal: 18, cost: 16, desc: 'Regeneration par les data' }
      ] },
    { id: 'content-bard', name: 'Content Bard', icon: '📝', desc: 'Copywriter — heal puissant',
      baseHP: 95, baseATK: 15, baseDEF: 9,
      skills: [
        { name: 'Viral Hook', icon: '🪝', dmg: 24, cost: 18, desc: 'Accroche virale devastatrice' },
        { name: 'Story Shield', icon: '📖', defBuff: 6, heal: 10, cost: 16, desc: 'Storytelling protecteur' },
        { name: 'UGC Surge', icon: '💬', heal: 25, cost: 20, desc: 'Vague de contenu generatif' }
      ] }
  ];

  var MAX_BATTLES_PER_DAY = 5;
  var PVP_WIN_POINTS = 30;
  var PVP_LOSE_POINTS = 5;
  var MANA_PER_TURN = 8;

  function getPvpStats(callback) {
    var AIA = window.AIA, st = AIA.getState();
    if (!AIA.db || !st.user || !st.user.accountKey) { callback({ wins: 0, losses: 0, points: 0, battlesToday: 0, lastBattleDate: '' }); return; }
    AIA.db.ref('pvp/' + st.user.accountKey).once('value', function (snap) {
      callback(snap.val() || { wins: 0, losses: 0, points: 0, battlesToday: 0, lastBattleDate: '' });
    });
  }

  function savePvpStats(stats) {
    var AIA = window.AIA, st = AIA.getState();
    if (!AIA.db || !st.user || !st.user.accountKey) return;
    AIA.db.ref('pvp/' + st.user.accountKey).set(stats);
  }

  function renderRPG(main) {
    var AIA = window.AIA;
    main.innerHTML = '<div class="page-header">' + backBtn() +
      '<h1>RPG <span class="gradient-text">PvP Arena</span></h1>' +
      '<p class="page-subtitle">Combats tour par tour — 5 combats/jour max</p></div>' +
      '<div id="rpg-root" class="glass-card" style="padding:1.5rem"><div class="loading-pulse">Chargement...</div></div>';

    getPvpStats(function (pvp) {
      var today = new Date().toISOString().split('T')[0];
      if (pvp.lastBattleDate !== today) { pvp.battlesToday = 0; pvp.lastBattleDate = today; }
      var remaining = MAX_BATTLES_PER_DAY - pvp.battlesToday;
      var root = document.getElementById('rpg-root');
      if (!root) return;

      root.innerHTML =
        '<div class="rpg-stats-bar">' +
        '<div class="rpg-stat"><span class="rpg-stat-val">' + pvp.points + '</span><span class="rpg-stat-lbl">PvP Points</span></div>' +
        '<div class="rpg-stat"><span class="rpg-stat-val">' + pvp.wins + '</span><span class="rpg-stat-lbl">Victoires</span></div>' +
        '<div class="rpg-stat"><span class="rpg-stat-val">' + pvp.losses + '</span><span class="rpg-stat-lbl">Defaites</span></div>' +
        '<div class="rpg-stat"><span class="rpg-stat-val">' + remaining + '/' + MAX_BATTLES_PER_DAY + '</span><span class="rpg-stat-lbl">Combats restants</span></div></div>' +
        (remaining <= 0 ?
          '<div class="rpg-limit-msg"><h3>Limite atteinte</h3><p>Revenez demain pour 5 nouveaux combats !</p></div>' :
          '<h3 style="margin:1.5rem 0 1rem;font-size:1rem">Choisissez votre classe</h3>' +
          '<div class="rpg-class-grid">' + RPG_CLASSES.map(function (cls) {
            return '<div class="rpg-class-card glass-card" data-class="' + cls.id + '">' +
              '<div class="rpg-class-icon">' + cls.icon + '</div>' +
              '<h4>' + cls.name + '</h4><p>' + cls.desc + '</p>' +
              '<div class="rpg-class-stats"><span>HP ' + cls.baseHP + '</span><span>ATK ' + cls.baseATK + '</span><span>DEF ' + cls.baseDEF + '</span></div>' +
              '<div class="rpg-skills-preview">' + cls.skills.map(function (sk) {
                return '<span title="' + escapeHtml(sk.desc) + '">' + sk.icon + ' ' + sk.name + '</span>';
              }).join('') + '</div></div>';
          }).join('') + '</div>');

      document.querySelectorAll('.rpg-class-card').forEach(function (card) {
        card.addEventListener('click', function () {
          var classId = this.getAttribute('data-class');
          var cls = RPG_CLASSES.find(function (c) { return c.id === classId; });
          if (cls) startRPGBattle(main, cls, pvp);
        });
      });
    });
  }

  function startRPGBattle(main, playerClass, pvp) {
    var AIA = window.AIA, st = AIA.getState();
    var lvl = AIA.getLevelInfo ? AIA.getLevelInfo(st.xp.total) : { level: 1 };

    var oppClass = RPG_CLASSES[Math.floor(Math.random() * RPG_CLASSES.length)];
    var oppNames = ['Alice','Bob','Clara','David','Emma','Felix','Grace','Hugo','Iris','Jules','Kenza','Leo'];
    var oppName = oppNames[Math.floor(Math.random() * oppNames.length)];
    var sf = 0.85 + Math.random() * 0.3;

    var player = { name: st.user ? st.user.name : 'Vous', cls: playerClass, icon: playerClass.icon,
      hp: playerClass.baseHP + lvl.level * 5, maxHP: playerClass.baseHP + lvl.level * 5,
      atk: playerClass.baseATK + Math.floor(lvl.level * 1.5), def: playerClass.baseDEF + lvl.level,
      mana: 50, maxMana: 50, tempDef: 0 };
    var enemy = { name: oppName, cls: oppClass, icon: oppClass.icon,
      hp: Math.round((oppClass.baseHP + lvl.level * 5) * sf), maxHP: Math.round((oppClass.baseHP + lvl.level * 5) * sf),
      atk: Math.round((oppClass.baseATK + lvl.level * 1.5) * sf), def: Math.round((oppClass.baseDEF + lvl.level) * sf),
      mana: 50, maxMana: 50, tempDef: 0 };

    var log = [], turn = 1, battleOver = false;

    function renderUI() {
      var root = document.getElementById('rpg-root'); if (!root) return;
      root.innerHTML =
        '<div class="rpg-battle-header">Tour ' + turn + '</div>' +
        '<div class="rpg-arena">' + renderFighter(player, 'left') + '<div class="rpg-vs">VS</div>' + renderFighter(enemy, 'right') + '</div>' +
        (!battleOver ? '<div class="rpg-actions">' +
          '<button class="rpg-btn attack" id="rpg-attack">Attaque<span class="rpg-btn-sub">(' + player.atk + ' ATK)</span></button>' +
          '<button class="rpg-btn defend" id="rpg-defend">Defense<span class="rpg-btn-sub">(+50% DEF)</span></button>' +
          player.cls.skills.map(function (sk, i) {
            var dis = player.mana < sk.cost;
            return '<button class="rpg-btn skill' + (dis ? ' disabled' : '') + '" data-skill="' + i + '"' + (dis ? ' disabled' : '') + '>' +
              sk.icon + ' ' + sk.name + '<span class="rpg-btn-sub">(' + sk.cost + ' MP)</span></button>';
          }).join('') + '</div>' : '') +
        '<div class="rpg-log">' + log.slice(-6).map(function (l) { return '<div class="rpg-log-entry">' + l + '</div>'; }).join('') + '</div>';

      if (!battleOver) {
        document.getElementById('rpg-attack').addEventListener('click', function () { doTurn('attack'); });
        document.getElementById('rpg-defend').addEventListener('click', function () { doTurn('defend'); });
        document.querySelectorAll('.rpg-btn.skill:not(.disabled)').forEach(function (b) {
          b.addEventListener('click', function () { doTurn('skill', parseInt(this.getAttribute('data-skill'))); });
        });
      }
    }

    function renderFighter(f, side) {
      var hpPct = Math.max(0, Math.round(f.hp / f.maxHP * 100));
      var mpPct = Math.round(f.mana / f.maxMana * 100);
      var hpC = hpPct > 50 ? '#2ecc71' : hpPct > 25 ? '#f5b731' : '#e74c3c';
      return '<div class="rpg-fighter ' + side + '">' +
        '<div class="rpg-fighter-icon">' + f.icon + '</div>' +
        '<div class="rpg-fighter-name">' + escapeHtml(f.name) + '</div>' +
        '<div class="rpg-fighter-class">' + f.cls.name + '</div>' +
        '<div class="rpg-bar"><div class="rpg-bar-fill" style="width:' + hpPct + '%;background:' + hpC + '"></div></div>' +
        '<div class="rpg-bar-label">HP ' + Math.max(0, f.hp) + '/' + f.maxHP + '</div>' +
        '<div class="rpg-bar"><div class="rpg-bar-fill" style="width:' + mpPct + '%;background:#3498db"></div></div>' +
        '<div class="rpg-bar-label">MP ' + f.mana + '/' + f.maxMana + '</div>' +
        '<div class="rpg-fighter-stats">ATK ' + f.atk + ' DEF ' + (f.def + f.tempDef) + '</div></div>';
    }

    function calcDmg(a, d) { return Math.max(1, Math.round((a - Math.floor(d * 0.6)) * (0.85 + Math.random() * 0.3))); }

    function doTurn(action, si) {
      if (battleOver) return;
      player.tempDef = 0;
      if (action === 'attack') {
        var d = calcDmg(player.atk, enemy.def + enemy.tempDef);
        enemy.hp -= d; log.push('<strong>' + escapeHtml(player.name) + '</strong> attaque — ' + d + ' dmg');
        player.mana = Math.min(player.maxMana, player.mana + MANA_PER_TURN);
      } else if (action === 'defend') {
        player.tempDef = Math.floor(player.def * 0.5);
        log.push('<strong>' + escapeHtml(player.name) + '</strong> se defend (+' + player.tempDef + ' DEF)');
        player.mana = Math.min(player.maxMana, player.mana + MANA_PER_TURN + 5);
      } else {
        var sk = player.cls.skills[si]; if (!sk || player.mana < sk.cost) return;
        player.mana -= sk.cost;
        if (sk.dmg) { var sd = calcDmg(sk.dmg, enemy.def + enemy.tempDef); enemy.hp -= sd; log.push(sk.icon + ' <strong>' + escapeHtml(player.name) + '</strong> lance ' + sk.name + ' — ' + sd + ' dmg'); }
        if (sk.heal) { player.hp = Math.min(player.maxHP, player.hp + sk.heal); log.push(escapeHtml(player.name) + ' recupere ' + sk.heal + ' HP'); }
        if (sk.defBuff) { player.tempDef += sk.defBuff; }
        player.mana = Math.min(player.maxMana, player.mana + MANA_PER_TURN);
      }
      if (enemy.hp <= 0) { endBattle(true); return; }

      /* Enemy AI */
      enemy.tempDef = 0;
      var hpRatio = enemy.hp / enemy.maxHP;
      var aiAct = 'attack', aiSi = -1;
      if (hpRatio < 0.35) { var hi = enemy.cls.skills.findIndex(function (s) { return s.heal && enemy.mana >= s.cost; }); if (hi >= 0) { aiAct = 'skill'; aiSi = hi; } }
      if (aiAct === 'attack' && Math.random() < 0.15) aiAct = 'defend';
      if (aiAct === 'attack') { var us = []; enemy.cls.skills.forEach(function (s, i) { if (s.dmg && enemy.mana >= s.cost) us.push(i); }); if (us.length && Math.random() < 0.5) { aiAct = 'skill'; aiSi = us[Math.floor(Math.random() * us.length)]; } }

      if (aiAct === 'attack') {
        var ed = calcDmg(enemy.atk, player.def + player.tempDef);
        player.hp -= ed; log.push('<strong>' + escapeHtml(enemy.name) + '</strong> attaque — ' + ed + ' dmg');
        enemy.mana = Math.min(enemy.maxMana, enemy.mana + MANA_PER_TURN);
      } else if (aiAct === 'defend') {
        enemy.tempDef = Math.floor(enemy.def * 0.5);
        log.push('<strong>' + escapeHtml(enemy.name) + '</strong> se defend');
        enemy.mana = Math.min(enemy.maxMana, enemy.mana + MANA_PER_TURN + 5);
      } else {
        var esk = enemy.cls.skills[aiSi]; enemy.mana -= esk.cost;
        if (esk.dmg) { var esd = calcDmg(esk.dmg, player.def + player.tempDef); player.hp -= esd; log.push(esk.icon + ' <strong>' + escapeHtml(enemy.name) + '</strong> lance ' + esk.name + ' — ' + esd + ' dmg'); }
        if (esk.heal) { enemy.hp = Math.min(enemy.maxHP, enemy.hp + esk.heal); log.push(escapeHtml(enemy.name) + ' recupere ' + esk.heal + ' HP'); }
        if (esk.defBuff) enemy.tempDef += esk.defBuff;
        enemy.mana = Math.min(enemy.maxMana, enemy.mana + MANA_PER_TURN);
      }
      if (player.hp <= 0) { endBattle(false); return; }
      turn++; if (turn > 30) { endBattle(player.hp > enemy.hp); return; }
      renderUI();
    }

    function endBattle(won) {
      battleOver = true;
      var xpGain = won ? 50 : 15, ptsGain = won ? PVP_WIN_POINTS : PVP_LOSE_POINTS;
      pvp.battlesToday++; if (won) pvp.wins++; else pvp.losses++;
      pvp.points += ptsGain; pvp.lastBattleDate = new Date().toISOString().split('T')[0];
      savePvpStats(pvp);
      AIA.addXP(xpGain, won ? 'Victoire PvP' : 'Combat PvP');
      if (won && pvp.wins === 1) AIA.awardBadge('battle-win');
      log.push(won ? '<strong>VICTOIRE !</strong> +' + ptsGain + ' PvP, +' + xpGain + ' XP' : '<strong>DEFAITE</strong> +' + ptsGain + ' PvP, +' + xpGain + ' XP');
      renderUI();
      var root = document.getElementById('rpg-root'); if (!root) return;
      var rem = MAX_BATTLES_PER_DAY - pvp.battlesToday;
      root.innerHTML += '<div class="rpg-result ' + (won ? 'win' : 'lose') + '">' +
        '<div class="rpg-result-icon">' + (won ? '🏆' : '💪') + '</div>' +
        '<h3>' + (won ? 'Victoire !' : 'Defaite') + '</h3>' +
        '<p>+' + ptsGain + ' PvP &bull; +' + xpGain + ' XP</p>' +
        '<div class="rpg-result-stats"><span>Total: ' + pvp.points + ' pts</span><span>W/L: ' + pvp.wins + '/' + pvp.losses + '</span><span>Restants: ' + rem + '/' + MAX_BATTLES_PER_DAY + '</span></div>' +
        (rem > 0 ? '<button class="btn-primary" id="rpg-rematch">Nouveau combat</button>' : '') +
        '<button class="btn-outline" data-navigate="arena" style="margin-left:0.5rem">Retour Arena</button></div>';
      var rm = document.getElementById('rpg-rematch');
      if (rm) rm.addEventListener('click', function () { renderRPG(main); });
    }

    renderUI();
  }

  window.AIA = window.AIA || {};
  window.AIA.renderBattle = renderBattle;
  window.AIA.startQuiz = startQuiz;
  window.AIA.startChallenge = startChallenge;
  window.AIA.renderRPG = renderRPG;
  window.AIA.RPG_CLASSES = RPG_CLASSES;
})();
