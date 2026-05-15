/* ==============================================
   ASSESSMENT.JS — Pre/Post-test + Certificat IDRAC
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  /* ============ 15-QUESTION ASSESSMENT BANK ============ */
  var QUESTIONS = [
    {
      id: 'q1', theme: 'Prompt', q: 'Quelle est la structure recommandee d\'un prompt efficace pour LLM ?',
      options: ['Texte libre + esperer le meilleur', 'CRAC : Contexte + Role + Action + Contraintes', 'Mots-cles separes par virgules', 'Question fermee oui/non uniquement'],
      correct: 1
    },
    {
      id: 'q2', theme: 'Prompt', q: 'Que signifie "few-shot prompting" ?',
      options: ['Limiter le nombre de tokens', 'Donner quelques exemples au modele dans le prompt', 'Faire plusieurs essais', 'Accelerer la generation'],
      correct: 1
    },
    {
      id: 'q3', theme: 'Image AI', q: 'Quel modele est reconnu pour bien gerer la typographie dans les images en 2025 ?',
      options: ['DALL-E 2', 'Stable Diffusion 1.5', 'FLUX.1', 'Midjourney v3'],
      correct: 2
    },
    {
      id: 'q4', theme: 'Branding', q: 'Combien de variantes de logo IA conseiller a un client avant selection finale ?',
      options: ['1 seule (gain de temps)', '3-5 (deja choisi)', '10-20 (eventail large)', '50+ (saturation)'],
      correct: 2
    },
    {
      id: 'q5', theme: 'Marketing', q: 'Qu\'est-ce qu\'un buyer persona detaille doit absolument contenir ?',
      options: ['Uniquement age + genre', 'Demographics + motivations + freins + canaux preferes', 'Liste exhaustive de produits aimes', 'Score de credit'],
      correct: 1
    },
    {
      id: 'q6', theme: 'Copywriting', q: 'Quelle est la difference entre une feature et un benefice ?',
      options: ['Aucune', 'Feature = caracteristique technique / Benefice = resultat pour le client', 'Feature est plus court', 'Benefice est obligatoire en B2B uniquement'],
      correct: 1
    },
    {
      id: 'q7', theme: 'SEO', q: 'Que signifie E-E-A-T en SEO Google ?',
      options: ['Email-Engagement-Analytics-Tracking', 'Experience-Expertise-Autorite-Fiabilite (Trust)', 'Easy-Effective-Adaptable-Trustworthy', 'Acronyme marketing pas SEO'],
      correct: 1
    },
    {
      id: 'q8', theme: 'A/B Testing', q: 'Quelle confiance statistique minimum pour declarer un gagnant en A/B test ?',
      options: ['70%', '80%', '95%', '99,99%'],
      correct: 2
    },
    {
      id: 'q9', theme: 'Video AI', q: 'Quelle precaution ethique avec un avatar video IA (type HeyGen / SadTalker) ?',
      options: ['Aucune, c\'est public', 'Obtenir consentement ecrit + mention IA explicite', 'Juste flouter le visage', 'Seulement en interne'],
      correct: 1
    },
    {
      id: 'q10', theme: 'Audio AI', q: 'Quel outil IA permet de generer une voix-off marketing pro ?',
      options: ['Photoshop', 'ElevenLabs / Parler-TTS', 'Excel', 'Notion'],
      correct: 1
    },
    {
      id: 'q11', theme: 'RGPD', q: 'Qu\'arrive-t-il quand on envoie des donnees clients a ChatGPT API ?',
      options: ['C\'est anonyme automatiquement', 'OpenAI peut les conserver — RGPD a respecter (anonymisation, contrat DPA)', 'Ce n\'est plus une donnee personnelle', 'Aucune obligation legale'],
      correct: 1
    },
    {
      id: 'q12', theme: 'Hallucinations', q: 'Comment se proteger des "hallucinations" d\'un LLM en marketing ?',
      options: ['Faire confiance, l\'IA verifie elle-meme', 'Fact-check humain systematique + sources citees', 'Augmenter la temperature', 'Utiliser des prompts plus courts'],
      correct: 1
    },
    {
      id: 'q13', theme: 'Translation', q: 'Pourquoi la traduction IA ne remplace-t-elle pas un traducteur humain en marketing premium ?',
      options: ['C\'est equivalent', 'Manque de transcreation (ton + culture + idiomes locaux)', 'Trop lent', 'Trop cher'],
      correct: 1
    },
    {
      id: 'q14', theme: 'Pitch', q: 'Quelle structure recommandee pour un pitch deck startup en 10 slides ?',
      options: ['Couverture + 9 slides random', 'Probleme > Solution > Marche > Produit > Business model > Traction > Equipe > Demande > Contact', 'Tout en 1 slide', 'Uniquement screenshots'],
      correct: 1
    },
    {
      id: 'q15', theme: 'Strategie', q: 'Quel est le ROI typique attendu d\'une campagne digitale apres optimisation ?',
      options: ['x1 (break-even)', 'ROAS 2.5x-4x sur Meta/Google Ads', 'x100 garanti', 'Negatif les 6 premiers mois'],
      correct: 1
    }
  ];

  /* ============ STATE HELPERS ============ */
  function getPre() { var st = window.AIA.getState(); return st.preTest || null; }
  function getPost() { var st = window.AIA.getState(); return st.postTest || null; }

  function savePre(score, answers) {
    var AIA = window.AIA;
    var st = AIA.getState();
    st.preTest = { ts: new Date().toISOString(), score: score, total: QUESTIONS.length, answers: answers };
    if (AIA.saveState) AIA.saveState();
    if (AIA.addXP) AIA.addXP(10, 'Pre-test complete');
  }

  function savePost(score, answers) {
    var AIA = window.AIA;
    var st = AIA.getState();
    st.postTest = { ts: new Date().toISOString(), score: score, total: QUESTIONS.length, answers: answers };
    if (AIA.saveState) AIA.saveState();
    if (AIA.addXP) AIA.addXP(30, 'Post-test complete');
    var pct = Math.round(score * 100 / QUESTIONS.length);
    if (pct >= 80 && AIA.addXP) AIA.addXP(50, 'Score post-test >= 80%');
    if (pct >= 90 && AIA.awardBadge) AIA.awardBadge('grade-a');
    if (pct >= 100 && AIA.awardBadge) AIA.awardBadge('perfectionist');
  }

  /* ============ RENDER ASSESSMENT ============ */
  function renderAssessment(main, mode) {
    var isPost = mode === 'post';
    var existing = isPost ? getPost() : getPre();
    if (existing) {
      return renderResult(main, mode, existing);
    }

    var html = '<div class="page-header">' +
      '<h1>' + (isPost ? 'Post-test ' : 'Pre-test ') + '<span class="gradient-text">de validation</span></h1>' +
      '<p class="page-subtitle">' + QUESTIONS.length + ' questions &bull; ~5 minutes &bull; ' +
      (isPost ? '+30 XP base, jusqu\'a +80 XP avec un score >= 80%' : '+10 XP a la completion') + '</p>' +
      '</div>' +
      '<div class="glass-card" style="padding:1rem;margin-bottom:1rem">' +
      '<p style="font-size:0.85rem;line-height:1.5;color:var(--text-secondary)">' +
      (isPost
        ? '🎓 <strong>Post-test final</strong> : evalue ce que vous avez appris pendant les 4 jours. Comparaison automatique avec votre pre-test pour mesurer votre progression. Genere votre certificat IDRAC personnalise.'
        : '📋 <strong>Pre-test d\'entree</strong> : evaluez votre niveau initial pour mesurer votre progression. Pas de stress — il sert de point de reference. Vous referez le post-test apres l\'atelier pour voir votre evolution !') +
      '</p></div>' +
      '<form id="assessment-form" class="assessment-form">' +
      QUESTIONS.map(function (q, i) {
        return '<div class="assessment-q glass-card" data-q-id="' + q.id + '">' +
          '<div class="aq-num">Q' + (i + 1) + ' / ' + QUESTIONS.length + ' <span class="aq-theme">#' + q.theme + '</span></div>' +
          '<div class="aq-text">' + escapeHtml(q.q) + '</div>' +
          '<div class="aq-options">' +
          q.options.map(function (opt, j) {
            return '<label class="aq-option">' +
              '<input type="radio" name="' + q.id + '" value="' + j + '">' +
              '<span class="aq-radio"></span>' +
              '<span class="aq-label">' + escapeHtml(opt) + '</span>' +
              '</label>';
          }).join('') +
          '</div>' +
          '</div>';
      }).join('') +
      '<button type="button" class="btn-primary" id="btn-submit-assessment" style="margin-top:1rem;width:100%">📝 Soumettre mes reponses</button>' +
      '</form>';

    main.innerHTML = html;

    document.getElementById('btn-submit-assessment').addEventListener('click', function () {
      var answers = {};
      var unanswered = 0;
      QUESTIONS.forEach(function (q) {
        var radio = document.querySelector('input[name="' + q.id + '"]:checked');
        if (radio) answers[q.id] = parseInt(radio.value);
        else unanswered++;
      });
      if (unanswered > 0) {
        window.AIA.showToast('Repondez aux ' + unanswered + ' question' + (unanswered > 1 ? 's' : '') + ' restante' + (unanswered > 1 ? 's' : ''), 'warning');
        return;
      }
      var score = 0;
      QUESTIONS.forEach(function (q) { if (answers[q.id] === q.correct) score++; });
      if (isPost) savePost(score, answers); else savePre(score, answers);
      renderResult(main, mode, isPost ? getPost() : getPre());
    });
  }

  /* ============ RENDER RESULT ============ */
  function renderResult(main, mode, result) {
    var isPost = mode === 'post';
    var pct = Math.round(result.score * 100 / result.total);
    var grade = pct >= 90 ? 'A' : pct >= 75 ? 'B' : pct >= 60 ? 'C' : pct >= 40 ? 'D' : 'E';
    var gradeColor = pct >= 90 ? '#2ecc71' : pct >= 75 ? '#3498db' : pct >= 60 ? '#f5b731' : pct >= 40 ? '#e67e22' : '#e74c3c';

    var pre = getPre(), post = getPost();
    var delta = (pre && post) ? (post.score - pre.score) : null;

    var themeStats = {};
    QUESTIONS.forEach(function (q) {
      themeStats[q.theme] = themeStats[q.theme] || { total: 0, correct: 0 };
      themeStats[q.theme].total++;
      if (result.answers[q.id] === q.correct) themeStats[q.theme].correct++;
    });

    var html = '<div class="page-header"><h1>' + (isPost ? 'Post-test' : 'Pre-test') + ' <span class="gradient-text">resultat</span></h1></div>' +

      '<div class="assessment-result glass-card">' +
      '<div class="ar-grade" style="color:' + gradeColor + '">' + grade + '</div>' +
      '<div class="ar-score">' + result.score + ' / ' + result.total + '</div>' +
      '<div class="ar-pct" style="color:' + gradeColor + '">' + pct + '%</div>' +
      '<p class="ar-date">Complete le ' + new Date(result.ts).toLocaleDateString('fr-FR') + '</p>' +
      '</div>';

    if (isPost && pre) {
      var deltaPct = Math.round(delta * 100 / result.total);
      html += '<div class="assessment-progression glass-card">' +
        '<h3>📈 Votre progression</h3>' +
        '<div class="progression-row">' +
        '<div class="prog-cell"><div class="prog-label">Pre-test</div><div class="prog-val">' + pre.score + '/' + pre.total + '</div></div>' +
        '<div class="prog-arrow">→</div>' +
        '<div class="prog-cell"><div class="prog-label">Post-test</div><div class="prog-val">' + post.score + '/' + post.total + '</div></div>' +
        '<div class="prog-cell"><div class="prog-label">Gain</div><div class="prog-val" style="color:' + (delta > 0 ? '#2ecc71' : delta < 0 ? '#e74c3c' : 'var(--gold)') + '">' + (delta >= 0 ? '+' : '') + delta + (deltaPct ? ' (' + (deltaPct >= 0 ? '+' : '') + deltaPct + '%)' : '') + '</div></div>' +
        '</div>' +
        '</div>';
    }

    html += '<div class="assessment-breakdown glass-card">' +
      '<h3>📊 Detail par theme</h3>' +
      '<div class="theme-rows">';
    Object.keys(themeStats).sort(function (a, b) {
      return themeStats[b].correct / themeStats[b].total - themeStats[a].correct / themeStats[a].total;
    }).forEach(function (t) {
      var s = themeStats[t];
      var p = Math.round(s.correct * 100 / s.total);
      var c = p >= 75 ? '#2ecc71' : p >= 50 ? '#f5b731' : '#e74c3c';
      html += '<div class="theme-row"><span class="tr-theme">#' + t + '</span>' +
        '<div class="tr-bar"><div class="tr-fill" style="width:' + p + '%;background:' + c + '"></div></div>' +
        '<span class="tr-score">' + s.correct + '/' + s.total + '</span></div>';
    });
    html += '</div></div>';

    html += '<div class="assessment-review glass-card">' +
      '<h3>📝 Vos reponses</h3>' +
      QUESTIONS.map(function (q, i) {
        var userAns = result.answers[q.id];
        var isOk = userAns === q.correct;
        return '<div class="rev-q">' +
          '<div class="rev-q-text"><strong>Q' + (i + 1) + ' #' + q.theme + ' :</strong> ' + escapeHtml(q.q) + '</div>' +
          '<div class="rev-ans ' + (isOk ? 'correct' : 'wrong') + '">' +
          (isOk ? '✅ ' : '❌ ') + 'Votre reponse : ' + escapeHtml(q.options[userAns] || '?') +
          (!isOk ? '<br>💡 Bonne reponse : <strong>' + escapeHtml(q.options[q.correct]) + '</strong>' : '') +
          '</div></div>';
      }).join('') +
      '</div>';

    html += '<div class="assessment-cta-block">';
    if (isPost) {
      html += '<button class="btn-primary" id="btn-certificate">🏆 Voir mon certificat IDRAC</button> ';
    } else if (!post) {
      html += '<p style="color:var(--text-muted);margin:1rem 0">Vous avez complete le pre-test ! Profitez de l\'atelier puis revenez faire le <strong>post-test</strong> en fin de Jour 4 pour voir votre progression.</p>';
    }
    html += '<a href="#" data-navigate="dashboard" class="btn-outline">Retour au dashboard</a></div>';

    main.innerHTML = html;

    var btnCert = document.getElementById('btn-certificate');
    if (btnCert) btnCert.addEventListener('click', function () { window.AIA.navigateTo('certificate'); });
  }

  /* ============ CERTIFICATE IDRAC ============ */
  function renderCertificate(main) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var post = getPost();
    var pre = getPre();
    var user = st.user || {};
    var fullName = (user.firstName || '') + ' ' + (user.lastName || '');
    if (!post) {
      main.innerHTML = '<div class="page-header"><h1>Certificat <span class="gradient-text">IDRAC</span></h1></div>' +
        '<div class="glass-card" style="text-align:center;padding:3rem">' +
        '<div style="font-size:3rem">🎓</div>' +
        '<h3>Certificat non encore disponible</h3>' +
        '<p style="color:var(--text-muted);margin-bottom:1rem">Completez le <strong>post-test</strong> pour debloquer votre certificat personnalise.</p>' +
        '<a href="#" data-navigate="assessment-post" class="btn-primary">📝 Passer le post-test</a>' +
        '</div>';
      return;
    }
    var pct = Math.round(post.score * 100 / post.total);
    var badgeCount = (st.badges && st.badges.length) || 0;
    var totalXp = (st.xp && st.xp.total) || 0;
    var theme = st.productTheme;
    var deliverables = st.gameDeliverables ? Object.keys(st.gameDeliverables).filter(function (k) { return st.gameDeliverables[k]; }).length : 0;
    var dateStr = new Date(post.ts).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

    var html = '<div class="page-header" style="text-align:center">' +
      '<h1>Certificat <span class="gradient-text">IDRAC</span></h1>' +
      '<p class="page-subtitle">Bravo pour votre parcours ! Imprimez ou exportez en PDF (Cmd/Ctrl+P).</p>' +
      '</div>' +

      '<div class="certificate-print-actions">' +
      '<button class="btn-primary" id="btn-print-cert">🖨️ Imprimer / Exporter PDF</button>' +
      '<a href="#" data-navigate="dashboard" class="btn-outline">Retour</a>' +
      '</div>' +

      '<div class="certificate" id="certificate-doc">' +
      '<div class="cert-corner top-left">★</div>' +
      '<div class="cert-corner top-right">★</div>' +
      '<div class="cert-corner bottom-left">★</div>' +
      '<div class="cert-corner bottom-right">★</div>' +
      '<div class="cert-header">' +
      '<div class="cert-logo">IDRAC</div>' +
      '<div class="cert-school">IDRAC Business School</div>' +
      '<div class="cert-program">AI Marketing Academy &bull; Atelier 2026</div>' +
      '</div>' +
      '<h2 class="cert-title">Certificat de Reussite</h2>' +
      '<p class="cert-presented">Decerne avec fierte a</p>' +
      '<h1 class="cert-name">' + escapeHtml(fullName.trim() || user.name || '—') + '</h1>' +
      '<p class="cert-text">pour avoir complete avec succes les <strong>4 jours d\'atelier</strong> sur l\'intelligence artificielle generative appliquee au marketing digital, et avoir obtenu un score de</p>' +
      '<div class="cert-score-block">' +
      '<div class="cert-score">' + pct + '%</div>' +
      '<div class="cert-score-detail">(' + post.score + '/' + post.total + ' au post-test)</div>' +
      '</div>' +
      (pre ? '<p class="cert-progression">📈 Progression depuis le pre-test : <strong>+' + (post.score - pre.score) + ' points</strong></p>' : '') +
      '<div class="cert-stats">' +
      '<div class="cert-stat"><div class="cs-num">' + totalXp + '</div><div class="cs-lbl">XP gagnes</div></div>' +
      '<div class="cert-stat"><div class="cs-num">' + badgeCount + '</div><div class="cs-lbl">Badges</div></div>' +
      '<div class="cert-stat"><div class="cs-num">' + deliverables + '/12</div><div class="cs-lbl">Etapes Game</div></div>' +
      '</div>' +
      (theme ? '<p class="cert-project">Projet realise : <strong>' + theme.emoji + ' ' + escapeHtml(theme.name) + '</strong> &mdash; ' + escapeHtml(theme.tagline || '') + '</p>' : '') +
      '<div class="cert-footer">' +
      '<div class="cert-date">Fait le ' + dateStr + '</div>' +
      '<div class="cert-signature">' +
      '<div class="cert-sig-line"></div>' +
      '<div class="cert-sig-name">Maxime BABONNEAU</div>' +
      '<div class="cert-sig-role">Formateur AI Marketing &bull; IDRAC</div>' +
      '</div>' +
      '</div>' +
      '<div class="cert-id">ID : ' + (user.accountKey || 'demo').substring(0, 12) + '-' + Date.parse(post.ts).toString(36) + '</div>' +
      '</div>';

    main.innerHTML = html;

    var btnPrint = document.getElementById('btn-print-cert');
    if (btnPrint) btnPrint.addEventListener('click', function () { window.print(); });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  /* ============ EXPORTS ============ */
  window.AIA = window.AIA || {};
  window.AIA.QUESTIONS = QUESTIONS;
  window.AIA.renderAssessment = renderAssessment;
  window.AIA.renderCertificate = renderCertificate;
  window.AIA.getPreTest = getPre;
  window.AIA.getPostTest = getPost;
})();
