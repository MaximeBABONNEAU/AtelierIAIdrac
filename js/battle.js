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

  window.AIA = window.AIA || {};
  window.AIA.renderBattle = renderBattle;
  window.AIA.startQuiz = startQuiz;
  window.AIA.startChallenge = startChallenge;
})();
