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

  /* ======== BATTLE DE PROMPTS — Real Evaluator + Curated Briefs ======== */
  var PROMPT_BRIEFS = [
    {
      id: 'slogan-sneakers',
      title: 'Slogan sneakers eco-responsables',
      brief: 'Generer un slogan memorable pour "GreenStride", marque de sneakers fabriquees a partir de plastique recycle des oceans. Cible : urbains 25-40 ans, conscients de leur impact ecologique. Ton : optimiste, moderne, engage.',
      criteria: {
        role: ['copywriter', 'expert', 'specialiste', 'createur', 'redacteur'],
        context: ['greenstride', 'sneakers', 'eco', 'recycle', 'plastique', 'oceans', 'cible', 'urbains'],
        action: ['genere', 'cree', 'redige', 'propose', 'invente'],
        format: ['slogan', 'court', 'mots', 'phrase', 'baseline', 'maximum', 'punchy'],
        tone: ['optimiste', 'moderne', 'engage', 'ton'],
        constraints: ['nombre', 'variantes', 'caracteres', 'syllabes']
      },
      modelAnswer: 'En tant que copywriter senior specialise en marques engagees, cree 5 slogans pour "GreenStride", sneakers fabriquees a partir de plastique recycle des oceans. Cible : urbains 25-40 ans eco-conscients. Ton : optimiste, moderne, engage. Contraintes : max 6 mots, vocabulaire positif, evite les cliches ("ecolo", "vert", "nature"). Format : 5 slogans + justification de 10 mots pour chaque.',
      tips: ['Donnez un role expert', 'Specifiez le nombre exact de variantes', 'Ajoutez des contraintes negatives (mots a eviter)', 'Demandez une justification pour chaque proposition']
    },
    {
      id: 'desc-serum',
      title: 'Description produit serum anti-age',
      brief: 'Rediger la description d\'un serum anti-age "AgeLess" pour un site e-commerce. Cible : femmes 45-65 ans, recherchent efficacite prouvee. Doit convertir le visiteur en client.',
      criteria: {
        role: ['copywriter', 'redacteur', 'expert', 'specialiste'],
        context: ['ageless', 'serum', 'anti-age', 'e-commerce', 'femmes', 'cible'],
        action: ['redige', 'cree', 'ecris'],
        format: ['description', 'mots', 'paragraphes', 'sections', 'benefices', 'caracteristiques'],
        tone: ['premium', 'rassurant', 'expert', 'professionnel'],
        constraints: ['ingredients', 'preuves', 'resultats', 'sans']
      },
      modelAnswer: 'En tant que copywriter beaute specialise e-commerce premium, redige la fiche produit du serum AgeLess (150-200 mots). Cible : femmes 45-65 ans. Structure : (1) accroche emotionnelle 15 mots, (2) 3 benefices cles formules en "resultats" (pas en caracteristiques), (3) 3 ingredients actifs et leur fonction, (4) preuve sociale chiffree, (5) CTA. Ton : premium, rassurant, expert. Evite : "miracle", "anti-rides", "magique". Mots-cles SEO : serum anti-age, raffermissant, fermete.',
      tips: ['Structurez votre prompt en sections claires', 'Demandez benefices > caracteristiques', 'Ajoutez des contraintes SEO', 'Specifiez la longueur en mots']
    },
    {
      id: 'instagram-cafe',
      title: '5 idees posts Instagram cafe artisanal',
      brief: 'Generer 5 idees de posts Instagram pour "L\'Atelier du Cafe", torrefacteur artisanal a Lyon. Objectif : faire grandir la communaute et faire connaitre le savoir-faire.',
      criteria: {
        role: ['community manager', 'social media', 'expert', 'createur', 'specialiste'],
        context: ['atelier', 'cafe', 'torrefacteur', 'artisanal', 'lyon', 'communaute'],
        action: ['genere', 'propose', 'cree', 'suggere'],
        format: ['idees', 'posts', 'instagram', 'reel', 'carrousel', 'story', 'caption', 'hashtags'],
        tone: ['authentique', 'engageant', 'artisanal'],
        constraints: ['format', 'cta', 'objectif', 'engagement']
      },
      modelAnswer: 'En tant que community manager specialise dans les marques artisanales, propose 5 idees de posts Instagram pour "L\'Atelier du Cafe" (torrefacteur Lyon). Pour chaque post : (1) format (reel / carrousel / single image / story), (2) angle storytelling, (3) caption complete avec CTA, (4) 5 hashtags pertinents (mix tres / peu utilises). Objectif : engagement + decouverte. Ton : authentique, expert, chaleureux. Varier les formats.',
      tips: ['Demandez plusieurs formats (reel, carrousel, story)', 'Exigez la caption complete avec CTA', 'Demandez des hashtags strategiques', 'Variez les angles narratifs']
    },
    {
      id: 'video-fitness',
      title: 'Script publicite video appli fitness',
      brief: 'Ecrire un script de publicite video de 30 secondes pour "FitPulse", appli de fitness personnalisee avec coach IA. Cible : 25-45 ans, sportifs amateurs presses.',
      criteria: {
        role: ['scenariste', 'concepteur', 'redacteur', 'expert', 'createur'],
        context: ['fitpulse', 'appli', 'fitness', 'coach', 'ia', 'cible', 'sportifs'],
        action: ['ecris', 'redige', 'cree'],
        format: ['script', 'secondes', 'scenes', 'plans', 'voix off', 'visuel', 'cta'],
        tone: ['dynamique', 'motivant', 'energique', 'inspirant'],
        constraints: ['duree', 'plans', 'hook', 'budget']
      },
      modelAnswer: 'En tant que concepteur-redacteur publicitaire, ecris un script video 30 secondes pour "FitPulse" (appli fitness avec coach IA personnalise). Cible : 25-45 ans, sportifs amateurs presses. Structure : hook 3s (probleme) / 12s solution-produit / 10s preuve sociale / 5s CTA. Format : colonne 1 = visuel (descr.), colonne 2 = voix off, colonne 3 = timing. Ton : dynamique, motivant. Eviter cliches gym ("no pain no gain"). Inclure 1 effet visuel signature.',
      tips: ['Structurez le script en timing precis (hook/solution/preuve/CTA)', 'Format en colonnes : visuel + voix + timing', 'Specifiez les contraintes negatives', 'Pensez a un effet signature reconnaissable']
    },
    {
      id: 'email-box',
      title: 'Email de bienvenue box mensuelle',
      brief: 'Rediger un email de bienvenue pour les nouveaux abonnes a "GoutBox", box mensuelle de produits gastronomiques francais. Doit convertir au premier achat additionnel.',
      criteria: {
        role: ['copywriter', 'email marketer', 'specialiste', 'expert'],
        context: ['goutbox', 'box', 'bienvenue', 'abonnes', 'gastronomique', 'francais'],
        action: ['redige', 'ecris', 'cree'],
        format: ['email', 'objet', 'preheader', 'corps', 'cta', 'signature', 'mots'],
        tone: ['chaleureux', 'gourmand', 'authentique', 'premium'],
        constraints: ['variables', 'longueur', 'sections', 'a/b']
      },
      modelAnswer: 'En tant qu\'email marketer specialise lifestyle premium, redige l\'email de bienvenue de "GoutBox" (box gastronomique francaise mensuelle). Format complet : (1) 3 objets A/B-testables max 50 car., (2) preheader 80 car., (3) corps 150 mots structure en hero + 3 sections + CTA, (4) variables personnalisees {{firstName}}, (5) signature humanisee. Objectif : convertir au premier achat additionnel (e-shop). Ton : chaleureux, gourmand, authentique. Inclure 1 offre exclusive limitee.',
      tips: ['Demandez objet + preheader (souvent oublies)', 'Specifiez la structure de l\'email', 'Demandez plusieurs objets A/B-testables', 'Ajoutez variables et CTA mesurables']
    },
    {
      id: 'landing-saas',
      title: 'Hero section landing page SaaS B2B',
      brief: 'Creer le hero d\'une landing page pour "Synaptik", SaaS de gestion de projets pour agences creatives. Cible : directeurs d\'agence 30-50 ans qui perdent du temps avec Excel.',
      criteria: {
        role: ['copywriter', 'expert', 'specialiste', 'redacteur'],
        context: ['synaptik', 'saas', 'b2b', 'agences', 'cible', 'directeurs'],
        action: ['cree', 'redige', 'ecris'],
        format: ['hero', 'h1', 'sous-titre', 'cta', 'bullets', 'social proof'],
        tone: ['professionnel', 'rassurant', 'expert'],
        constraints: ['benefices', 'longueur', 'mots-cles']
      },
      modelAnswer: 'En tant que copywriter SaaS B2B, cree le hero d\'une landing page pour Synaptik (gestion de projets pour agences creatives). Cible : directeurs d\'agence 30-50 ans, frustres par Excel. Format : (1) H1 12 mots max axe sur le benefice principal, (2) sous-titre 25 mots qui clarifie le quoi/pour qui, (3) 3 bullets benefices chiffres, (4) CTA principal + CTA secondaire, (5) social proof (logos clients ou metrique). Ton : professionnel mais punchy. Eviter "revolutionnaire", "leader", "best-in-class".',
      tips: ['Hero = H1 + sous-titre + bullets + CTA + social proof', 'Limitez le nombre de mots du H1', 'Demandez des benefices chiffres', 'Specifiez le CTA principal ET secondaire']
    }
  ];

  function evaluatePrompt(text, brief) {
    if (!text) return { total: 0, breakdown: {}, hits: {}, missing: [], wordCount: 0 };
    var lower = text.toLowerCase();
    var words = text.split(/\s+/).filter(Boolean);
    var hits = {};
    var breakdown = {};
    var maxPerCat = { role: 18, context: 18, action: 12, format: 18, tone: 12, constraints: 12 };

    Object.keys(brief.criteria).forEach(function (cat) {
      var keywords = brief.criteria[cat];
      var found = keywords.filter(function (kw) { return lower.indexOf(kw) !== -1; });
      hits[cat] = found;
      var pct = found.length / keywords.length;
      breakdown[cat] = Math.round(pct * (maxPerCat[cat] || 10));
    });

    // Length bonus
    var lengthBonus = words.length > 60 ? 8 : words.length > 40 ? 6 : words.length > 25 ? 4 : words.length > 15 ? 2 : 0;
    breakdown.length = lengthBonus;

    // Structure bonus (numbered lists, sections, colons)
    var structureSignals = 0;
    if (/\b\d+[\.\)]/g.test(text)) structureSignals += 2;
    if (text.indexOf(':') !== -1) structureSignals += 1;
    if (/\n/.test(text) || /\([1-9]\)/.test(text)) structureSignals += 2;
    breakdown.structure = Math.min(structureSignals, 5);

    var total = Object.keys(breakdown).reduce(function (s, k) { return s + breakdown[k]; }, 0);
    total = Math.min(100, total);

    // Missing categories suggestions
    var missing = [];
    Object.keys(brief.criteria).forEach(function (cat) {
      if (!hits[cat] || hits[cat].length === 0) {
        var labels = { role: 'Role expert', context: 'Contexte (marque/cible)', action: 'Verbe d\'action', format: 'Format de sortie', tone: 'Ton de communication', constraints: 'Contraintes/quantites' };
        missing.push(labels[cat] || cat);
      }
    });

    return { total: total, breakdown: breakdown, hits: hits, missing: missing, wordCount: words.length };
  }

  var BATTLE_BOSS_TARGET = 85; // score requis pour vaincre le Brief Legendaire (boss)
  function renderBattle(main, bossMode) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var currentBriefIdx = bossMode ? (PROMPT_BRIEFS.length - 1) : Math.floor(Math.random() * PROMPT_BRIEFS.length);

    function renderUI() {
      var brief = PROMPT_BRIEFS[currentBriefIdx];
      main.innerHTML = '<div class="page-header">' + backBtn() +
        '<h1>' + (bossMode ? 'Battle <span class="gradient-text">BOSS</span> 🔥' : 'Battle de <span class="gradient-text">Prompts</span>') + '</h1>' +
        '<p class="page-subtitle">' + (bossMode ? 'Brief l&eacute;gendaire &bull; score &ge; ' + BATTLE_BOSS_TARGET + '/100 pour vaincre le boss' : 'Sujet impose, evaluation objective, correction de reference') + '</p></div>' +
        (bossMode ? '' : bossZoneHtml('battle', 'Le Brief L&eacute;gendaire', '🔥')) +
        '<div class="battle-zone glass-card' + (bossMode ? ' boss-battle' : '') + '">' +
        '<div class="battle-brief enhanced">' +
        '<div class="battle-brief-header">' +
        '<span class="battle-brief-num">' + (bossMode ? '🔥 BRIEF BOSS' : 'Brief ' + (currentBriefIdx + 1) + '/' + PROMPT_BRIEFS.length) + '</span>' +
        '<h3>' + escapeHtml(brief.title) + '</h3>' +
        '</div>' +
        '<p class="battle-brief-text">' + escapeHtml(brief.brief) + '</p>' +
        '<div class="battle-brief-meta">' +
        '<details><summary>💡 4 tips pour un excellent prompt sur ce sujet</summary>' +
        '<ul>' + brief.tips.map(function (t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('') + '</ul>' +
        '</details>' +
        '</div>' +
        (bossMode ? '' : '<button class="btn-ghost btn-sm" id="btn-new-brief">🎲 Autre sujet</button>') +
        '</div>' +

        '<div class="battle-ai-tools" style="margin:0.2rem 0 0.6rem">' +
        '<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.2rem">🤖 Ouvre un vrai modèle IA, teste ton prompt, affine — puis colle/écris ta version ici pour l\'évaluer :</div>' +
        aiToolsBar(brief.brief) + '</div>' +

        '<div class="battle-submit">' +
        '<h3>Votre prompt (objectif : score &gt; ' + (bossMode ? BATTLE_BOSS_TARGET : 75) + '/100)</h3>' +
        '<textarea id="battle-prompt" class="demo-textarea" rows="6" placeholder="En tant que [role], pour [contexte/marque/cible], [action] [format]. Ton : [ton]. Contraintes : [nombre, longueur, eviter]..."></textarea>' +
        '<div class="battle-submit-actions">' +
        '<button class="btn-primary" id="btn-battle-submit">⚔️ Soumettre & Evaluer</button>' +
        '<span class="battle-counter" id="battle-counter">0 mots</span>' +
        '</div>' +
        '</div>' +
        '<div id="battle-arena" class="battle-arena-result"></div></div>';

      var ta = document.getElementById('battle-prompt');
      var counter = document.getElementById('battle-counter');
      if (ta && counter) {
        ta.addEventListener('input', function () {
          var n = ta.value.trim().split(/\s+/).filter(Boolean).length;
          counter.textContent = n + ' mots';
        });
      }

      if (!bossMode) {
        var nb = document.getElementById('btn-new-brief');
        if (nb) nb.addEventListener('click', function () { currentBriefIdx = (currentBriefIdx + 1) % PROMPT_BRIEFS.length; renderUI(); });
        wireBossZone('battle', function () { renderBattle(main, true); });
      }
      var cpB = document.getElementById('pc-copy');
      if (cpB) cpB.addEventListener('click', function () { try { navigator.clipboard.writeText(brief.brief); AIA.showToast('Brief copié — colle-le dans ton IA', 'success'); } catch (e) {} });

      document.getElementById('btn-battle-submit').addEventListener('click', function () {
        var prompt = ta.value.trim();
        if (!prompt) { AIA.showToast('Ecrivez votre prompt d\'abord', 'error'); return; }
        if (prompt.length < 15) { AIA.showToast('Trop court — minimum 15 caracteres', 'warning'); return; }
        var arena = document.getElementById('battle-arena');
        arena.innerHTML = '<div class="loading-pulse">Evaluation en cours par notre IA d\'analyse...</div>';

        setTimeout(function () { showResult(prompt, brief, arena); }, 1200);
      });
    }

    function showResult(prompt, brief, arena) {
      var evalResult = evaluatePrompt(prompt, brief);
      var modelEval = evaluatePrompt(brief.modelAnswer, brief);
      var grade = evalResult.total >= 80 ? 'A' : evalResult.total >= 65 ? 'B' : evalResult.total >= 50 ? 'C' : evalResult.total >= 35 ? 'D' : 'E';
      var gradeColor = evalResult.total >= 80 ? '#2ecc71' : evalResult.total >= 65 ? '#3498db' : evalResult.total >= 50 ? '#f5b731' : evalResult.total >= 35 ? '#e67e22' : '#e74c3c';
      var userWins = evalResult.total >= modelEval.total - 15; // win if within 15 pts of model

      var labels = { role: 'Role expert', context: 'Contexte', action: 'Action', format: 'Format', tone: 'Ton', constraints: 'Contraintes', length: 'Longueur', structure: 'Structure' };

      var html = '<div class="battle-result-card glass-card">' +
        '<div class="battle-score-block">' +
        '<div class="battle-grade" style="color:' + gradeColor + '">' + grade + '</div>' +
        '<div class="battle-score-num">' + evalResult.total + '<span>/100</span></div>' +
        '<div class="battle-score-meta">vs modele : ' + modelEval.total + '/100 &bull; ' + evalResult.wordCount + ' mots</div>' +
        '</div>' +
        '<div class="battle-breakdown">' +
        Object.keys(evalResult.breakdown).map(function (k) {
          var v = evalResult.breakdown[k];
          var max = ({ role: 18, context: 18, action: 12, format: 18, tone: 12, constraints: 12, length: 8, structure: 5 })[k] || 10;
          var pct = Math.round((v / max) * 100);
          var color = pct >= 70 ? '#2ecc71' : pct >= 40 ? '#f5b731' : '#e74c3c';
          return '<div class="bar-row"><span style="min-width:90px;font-size:0.75rem">' + (labels[k] || k) + '</span>' +
            '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
            '<span style="font-size:0.75rem;color:var(--text-muted)">' + v + '/' + max + '</span></div>';
        }).join('') +
        '</div>' +
        '</div>' +

        '<div class="battle-feedback glass-card">' +
        '<h4>📊 Analyse detaillee</h4>' +
        (evalResult.missing.length > 0 ?
          '<div class="feedback-section warning"><strong>⚠️ Manques detectes :</strong><ul>' +
          evalResult.missing.map(function (m) { return '<li>' + m + '</li>'; }).join('') +
          '</ul></div>' :
          '<div class="feedback-section success"><strong>✅ Toutes les categories couvertes !</strong></div>') +
        (evalResult.wordCount < 25 ? '<div class="feedback-section warning"><strong>⚠️ Prompt court (' + evalResult.wordCount + ' mots) :</strong> un bon prompt detaille fait 40-80 mots</div>' : '') +
        '<div class="feedback-section success"><strong>✓ Categories detectees :</strong> ' +
        Object.keys(evalResult.hits).filter(function (k) { return evalResult.hits[k].length > 0; })
          .map(function (k) { return (labels[k] || k) + ' (' + evalResult.hits[k].length + ')'; }).join(' &bull; ') +
        '</div>' +
        '</div>' +

        '<div class="battle-model-answer glass-card">' +
        '<h4>🎯 Correction de reference (' + modelEval.total + '/100)</h4>' +
        '<p style="color:var(--text-muted);font-size:0.78rem;margin-bottom:0.6rem">Voici un prompt expert pour ce sujet. Comparez avec le votre et identifiez les techniques manquantes.</p>' +
        '<div class="model-prompt-box">' + escapeHtml(brief.modelAnswer) + '</div>' +
        '<details style="margin-top:0.6rem"><summary style="cursor:pointer;color:var(--cyan)">💡 Techniques mobilisees dans la correction</summary>' +
        '<ul>' + brief.tips.map(function (t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('') + '</ul>' +
        '</details>' +
        '</div>' +

        '<div class="battle-result">' +
        '<div class="result-icon">' + (bossMode ? (evalResult.total >= BATTLE_BOSS_TARGET ? '🏆' : '💀') : (userWins ? '🏆' : '💪')) + '</div>' +
        '<div class="result-text">' +
        (bossMode
          ? (evalResult.total >= BATTLE_BOSS_TARGET
              ? 'BOSS VAINCU ! Score ' + evalResult.total + '/100 — +' + SOLO_BOSS_XP + ' XP + badge 🔥'
              : 'Le boss r&eacute;siste (score ' + evalResult.total + '/100, il en faut ' + BATTLE_BOSS_TARGET + '). +20 XP — r&eacute;essaie !')
          : (userWins ? 'Excellent ! Votre prompt est proche de la qualite reference (+12 XP)' : 'Continuez a vous entrainer ! Analysez la correction et reessayez (+5 XP)')) +
        '</div>' +
        '<button class="btn-outline" id="btn-battle-retry">🔄 ' + (bossMode ? 'Réessayer le boss' : 'Reessayer avec ce sujet') + '</button>' +
        (bossMode ? '' : '<button class="btn-primary" id="btn-battle-next">➡️ Sujet suivant</button>') +
        '</div>';

      arena.innerHTML = html;

      // XP, badge & progression
      if (bossMode) {
        if (evalResult.total >= BATTLE_BOSS_TARGET) {
          if (AIA.markGameBoss) AIA.markGameBoss('battle');
          AIA.addXP(SOLO_BOSS_XP, 'Battle Boss vaincu');
          if (AIA.awardBadge) AIA.awardBadge('boss-slayer');
          try { if (AIA.pushFeed) AIA.pushFeed({ action: 'boss-solo', target: 'Le Brief Legendaire' }); } catch (e) {}
        } else {
          AIA.addXP(5, 'Battle Boss tente');
        }
      } else {
        var xpEarned = userWins ? 12 : 5;
        AIA.addXP(xpEarned, 'Battle de prompts');
        if (userWins && evalResult.total >= 80) AIA.awardBadge('battle-win');
        if (AIA.bumpGameProgress) AIA.bumpGameProgress('battle'); // progression vers le Brief Legendaire
      }

      if (AIA.submitActivity) {
        AIA.submitActivity('battle-prompt', {
          briefId: brief.id, briefTitle: brief.title,
          promptLength: prompt.length, score: evalResult.total,
          grade: grade, missing: evalResult.missing.join(', ')
        });
      }

      document.getElementById('btn-battle-retry').addEventListener('click', function () {
        renderUI();
        setTimeout(function () { var ta = document.getElementById('battle-prompt'); if (ta) { ta.value = prompt; ta.focus(); } }, 50);
      });
      var nx = document.getElementById('btn-battle-next');
      if (nx) nx.addEventListener('click', function () {
        currentBriefIdx = (currentBriefIdx + 1) % PROMPT_BRIEFS.length;
        renderUI();
      });
    }

    renderUI();
  }

  /* ======== QUIZ INTERACTIF (+ boss solo) ======== */
  // Landing : intro + zone boss + bouton "Commencer"
  function startQuiz(main) {
    main.innerHTML = '<div class="page-header">' + backBtn() +
      '<h1>Quiz <span class="gradient-text">Interactif</span></h1>' +
      '<p class="page-subtitle">10 questions &bull; 15s par question</p></div>' +
      '<div class="glass-card" style="padding:1.5rem;text-align:center">' +
      bossZoneHtml('quiz', 'Le Quiz Ma&icirc;tre', '🧠') +
      '<div style="margin:1.2rem 0 0.3rem"><button class="btn-primary" id="btn-quiz-start">▶️ Commencer le quiz</button></div>' +
      '<p style="font-size:0.74rem;color:var(--text-muted)">3 quiz r&eacute;ussis d&eacute;bloquent le Quiz Ma&icirc;tre (manche express tr&egrave;s difficile).</p>' +
      '</div>';
    var s = document.getElementById('btn-quiz-start');
    if (s) s.addEventListener('click', function () { runQuiz(main, false); });
    wireBossZone('quiz', function () { runQuiz(main, true); });
  }

  function runQuiz(main, bossMode) {
    var AIA = window.AIA;
    var perQ = bossMode ? 8 : 15;                 // boss = chrono serre
    var winThreshold = 8;                          // boss vaincu si >= 8/10
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
        '<h1>' + (bossMode ? 'Quiz <span class="gradient-text">BOSS</span> 🧠' : 'Quiz <span class="gradient-text">Interactif</span>') + '</h1>' +
        (bossMode ? '<p class="page-subtitle" style="color:#ff9db0">Manche express &bull; ' + perQ + 's / question &bull; objectif ' + winThreshold + '/10</p>' : '') + '</div>' +
        '<div class="quiz-container glass-card' + (bossMode ? ' boss-battle' : '') + '">' +
        '<div class="quiz-header">' +
        '<div class="quiz-progress">Question ' + (currentQ + 1) + '/' + questions.length + '</div>' +
        '<div class="quiz-score">Score: ' + score + '</div>' +
        '<div class="quiz-timer" id="quiz-timer">' + perQ + '</div>' +
        '</div>' +
        '<div class="quiz-question">' + escapeHtml(q.q) + '</div>' +
        '<div class="quiz-options">' + q.options.map(function (opt, i) {
          return '<button class="quiz-option" data-idx="' + i + '">' + escapeHtml(opt) + '</button>';
        }).join('') + '</div>' +
        '<div id="quiz-feedback" class="quiz-feedback"></div></div>';

      var timeLeft = perQ;
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
      }, bossMode ? 1200 : 2000);
    }

    function showQuizResults() {
      if (timerInterval) clearInterval(timerInterval);
      var pct = Math.round(score / questions.length * 100);

      if (bossMode) {
        var won = score >= winThreshold;
        if (won) {
          if (AIA.markGameBoss) AIA.markGameBoss('quiz');
          AIA.addXP(SOLO_BOSS_XP, 'Quiz Boss vaincu');
          if (AIA.awardBadge) AIA.awardBadge('boss-slayer');
          try { if (AIA.pushFeed) AIA.pushFeed({ action: 'boss-solo', target: 'Le Quiz Maitre' }); } catch (e) {}
        } else {
          AIA.addXP(5, 'Quiz Boss tente');
        }
        main.innerHTML = '<div class="page-header">' + backBtn() +
          '<h1>Quiz <span class="gradient-text">BOSS</span></h1></div>' +
          '<div class="quiz-results glass-card boss-battle">' +
          '<div class="result-emoji">' + (won ? '🏆' : '💀') + '</div>' +
          '<div class="result-score">' + score + '/' + questions.length + '</div>' +
          '<div class="result-grade">' + (won ? 'Quiz Maître VAINCU ! +' + SOLO_BOSS_XP + ' XP + badge' : 'Raté (' + winThreshold + '/10 requis). +20 XP') + '</div>' +
          '<div style="margin-top:1.5rem">' +
          (won ? '' : '<button class="btn-primary" id="btn-quiz-retry">Réessayer le boss</button>') +
          '<button class="btn-outline" data-navigate="arena" style="margin-left:0.5rem">Retour Arena</button>' +
          '</div></div>';
        var rb = document.getElementById('btn-quiz-retry');
        if (rb) rb.addEventListener('click', function () { runQuiz(main, true); });
        return;
      }

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

      if (AIA.bumpGameProgress) AIA.bumpGameProgress('quiz'); // progression vers le Quiz Maitre
      if (score === questions.length) {
        AIA.awardBadge('quiz-perfect');
        AIA.addXP(20, 'Quiz parfait');
        AIA.showToast('Quiz parfait ! +20 XP', 'success');
      } else {
        AIA.addXP(5 + score, 'Quiz termine');
      }

      var retry = document.getElementById('btn-quiz-retry');
      if (retry) retry.addEventListener('click', function () { startQuiz(main); });
    }

    renderQuestion();
  }

  /* ======== CHALLENGE COLLECTIF (+ boss solo) ======== */
  var CHALLENGE_BOSS = { title: 'D&Eacute;FI PI&Egrave;GE : le brief impossible', brief: 'Concevez une campagne pour un produit a la fois PREMIUM et ULTRA pas cher, eco-responsable MAIS jetable, ciblant ados ET retraites. Transformez chaque contradiction en argument de vente. Reponse structuree et convaincante.' };
  var CHALLENGE_BOSS_MINLEN = 180;
  function startChallenge(main, bossMode) {
    var AIA = window.AIA;
    var challenge = bossMode ? CHALLENGE_BOSS : CHALLENGE_BRIEFS[Math.floor(Math.random() * CHALLENGE_BRIEFS.length)];

    main.innerHTML = '<div class="page-header">' + backBtn() +
      '<h1>' + (bossMode ? 'Challenge <span class="gradient-text">BOSS</span> 🎭' : 'Challenge <span class="gradient-text">Collectif</span>') + '</h1>' +
      '<p class="page-subtitle">' + (bossMode ? 'Brief pi&egrave;ge &bull; r&eacute;ponse argument&eacute;e (&ge; ' + CHALLENGE_BOSS_MINLEN + ' caract&egrave;res)' : 'Meme brief pour tous — soumettez votre meilleure solution') + '</p></div>' +
      (bossMode ? '' : bossZoneHtml('challenge', 'Le D&eacute;fi Pi&egrave;ge', '🎭')) +
      '<div class="challenge-container glass-card' + (bossMode ? ' boss-battle' : '') + '">' +
      '<div class="challenge-brief">' +
      '<div class="challenge-icon">' + (bossMode ? '🎭' : '🏆') + '</div>' +
      '<h3>' + escapeHtml(challenge.title) + '</h3>' +
      '<p>' + escapeHtml(challenge.brief) + '</p></div>' +
      '<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.2rem">🤖 Sers-toi d\'un vrai modèle IA pour générer et affiner ta réponse, puis colle ta meilleure version ici :</div>' +
      aiToolsBar(challenge.brief) +
      '<textarea id="challenge-response" class="demo-textarea" rows="5" placeholder="Génère avec l\'IA, affine le résultat, puis colle ta meilleure réponse ici..."></textarea>' +
      '<button class="btn-primary" id="btn-challenge-submit" style="margin-top:1rem">Soumettre ma reponse</button>' +
      '<div id="challenge-results" class="demo-results"></div></div>';

    if (!bossMode) wireBossZone('challenge', function () { startChallenge(main, true); });
    var cpC = document.getElementById('pc-copy');
    if (cpC) cpC.addEventListener('click', function () { try { navigator.clipboard.writeText(challenge.brief); if (window.AIA.showToast) window.AIA.showToast('Brief copié — colle-le dans ton IA', 'success'); } catch (e) {} });

    document.getElementById('btn-challenge-submit').addEventListener('click', function () {
      var response = document.getElementById('challenge-response').value.trim();
      if (!response) { AIA.showToast('Ecrivez votre reponse', 'error'); return; }

      var res = document.getElementById('challenge-results');
      res.innerHTML = '<div class="loading-pulse">Soumission et analyse...</div>';

      if (bossMode) {
        setTimeout(function () {
          var won = response.length >= CHALLENGE_BOSS_MINLEN;
          if (won) {
            if (AIA.markGameBoss) AIA.markGameBoss('challenge');
            AIA.addXP(SOLO_BOSS_XP, 'Challenge Boss vaincu');
            if (AIA.awardBadge) AIA.awardBadge('boss-slayer');
            try { if (AIA.pushFeed) AIA.pushFeed({ action: 'boss-solo', target: 'Le Defi Piege' }); } catch (e) {}
          } else { AIA.addXP(5, 'Challenge Boss tente'); }
          res.innerHTML = '<div class="rpg-result ' + (won ? 'win' : 'lose') + '">' +
            '<div class="rpg-result-icon">' + (won ? '🏆' : '💀') + '</div>' +
            '<h3>' + (won ? 'D&eacute;fi Pi&egrave;ge relev&eacute; !' : 'Pas encore...') + '</h3>' +
            '<p>' + (won ? '+' + SOLO_BOSS_XP + ' XP + badge 🎭 — tu as dompt&eacute; le brief impossible !' : 'R&eacute;ponse trop courte (&ge; ' + CHALLENGE_BOSS_MINLEN + ' caract&egrave;res requis, ' + response.length + ' actuellement). +20 XP.') + '</p>' +
            '<div style="margin-top:0.6rem">' + (won ? '' : '<button class="btn-primary" id="btn-chal-retry">R&eacute;essayer</button> ') +
            '<button class="btn-outline" data-navigate="arena">Retour Arena</button></div></div>';
          var rb = document.getElementById('btn-chal-retry');
          if (rb) rb.addEventListener('click', function () { startChallenge(main, true); });
        }, 1200);
        return;
      }

      setTimeout(function () {
        var fakeSubmissions = [
          { name: 'Alice', score: 72 + Math.floor(Math.random() * 20), excerpt: 'Solution creative avec focus storytelling...' },
          { name: 'Bob', score: 65 + Math.floor(Math.random() * 25), excerpt: 'Approche data-driven et KPIs clairs...' },
          { name: 'Clara', score: 70 + Math.floor(Math.random() * 20), excerpt: 'Branding emotionnel et experience client...' },
          { name: 'David', score: 60 + Math.floor(Math.random() * 30), excerpt: 'Strategie multicanale integree...' }
        ];
        var u = AIA.getState().user;
        var userName = (u && u.name) ? u.name : 'Vous';
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

        if (AIA.bumpGameProgress) AIA.bumpGameProgress('challenge'); // progression vers le Defi Piege
        AIA.addXP(8 + (6 - userRank) * 2, 'Challenge collectif');
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

      // Zone boss : Prof (PvP, quasi imbattable) + boss PvE du RPG
      var bd = AIA.getBossDuel ? AIA.getBossDuel() : null;
      var profEntry;
      if (bd && bd.used) {
        profEntry = '<div class="rpg-boss-card prof done ' + (bd.result === 'win' ? 'won' : 'lost') + '"><span class="sbz-ic">🤖</span><div class="sbz-txt"><strong>Le Prof</strong><br><span class="sbz-sub">' + (bd.result === 'win' ? '🏆 battu — l&eacute;gende !' : 'tentative utilis&eacute;e') + '</span></div></div>';
      } else {
        profEntry = '<div class="rpg-boss-card prof challenge"><span class="sbz-ic">🤖</span><div class="sbz-txt"><strong>D&eacute;fier le Prof</strong><br><span class="sbz-sub">IA quasi imbattable &bull; gros risque / grosse r&eacute;compense</span></div><button class="btn-primary btn-sm" id="btn-prof">D&eacute;fier</button></div>';
      }

      root.innerHTML =
        '<div class="rpg-stats-bar">' +
        '<div class="rpg-stat"><span class="rpg-stat-val">' + pvp.points + '</span><span class="rpg-stat-lbl">PvP Points</span></div>' +
        '<div class="rpg-stat"><span class="rpg-stat-val">' + pvp.wins + '</span><span class="rpg-stat-lbl">Victoires</span></div>' +
        '<div class="rpg-stat"><span class="rpg-stat-val">' + pvp.losses + '</span><span class="rpg-stat-lbl">Defaites</span></div>' +
        '<div class="rpg-stat"><span class="rpg-stat-val">' + remaining + '/' + MAX_BATTLES_PER_DAY + '</span><span class="rpg-stat-lbl">Combats restants</span></div></div>' +
        '<div class="rpg-boss-bar">' + profEntry + bossZoneHtml('rpg', CREATURE_CONF.name, '🐲') + '</div>' +
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
          if (cls) promptBattle(main, cls, null, { rootId: 'rpg-root', isPvp: true, pvp: pvp });
        });
      });
      // Boss : Prof (popup pros/cons) + boss PvE (si debloque)
      var bp = document.getElementById('btn-prof');
      if (bp) bp.addEventListener('click', function () { showProfPopup(main); });
      wireBossZone('rpg', function () { renderPveBossSelect(main); });
    });
  }

  /* =====================================================================
     COMBAT PAR PROMPTS — force l'usage reel de modeles IA (ChatGPT/Claude/...)
     Chaque tour : une mission marketing -> ecrire un VRAI prompt -> score = degats.
     Utilise par le PvP (entrainement) ET les boss (Prof, creature).
     ===================================================================== */
  var AI_TOOLS = [
    { name: 'ChatGPT', icon: '🤖', pre: true, base: 'https://chatgpt.com/?q=' },
    { name: 'Claude', icon: '🧠', pre: true, base: 'https://claude.ai/new?q=' },
    { name: 'Gemini', icon: '✨', pre: false, base: 'https://gemini.google.com/app' },
    { name: 'Le Chat', icon: '🐱', pre: false, base: 'https://chat.mistral.ai/chat' }
  ];
  var COMBAT_MULT = { 'prompt-mage': 1.25, 'data-ranger': 1.15, 'content-bard': 1.0, 'visual-knight': 0.95 };

  function aiToolsBar(seed) {
    return '<div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin:0.5rem 0">' +
      AI_TOOLS.map(function (t) {
        var href = t.pre ? t.base + encodeURIComponent(seed) : t.base;
        return '<a class="btn-outline btn-sm" href="' + href + '" target="_blank" rel="noopener noreferrer" style="text-decoration:none">' + t.icon + ' ' + t.name + '</a>';
      }).join('') +
      '<button type="button" class="btn-outline btn-sm" id="pc-copy">📋 Copier la mission</button></div>';
  }

  function promptBattle(main, playerClass, enemyConf, opts) {
    opts = opts || {};
    var AIA = window.AIA, st = AIA.getState();
    var rootId = opts.rootId || 'rpg-root';
    var boss = !!opts.boss;
    var lvl = AIA.getLevelInfo ? AIA.getLevelInfo(st.xp.total) : { level: 1 };
    var mult = COMBAT_MULT[playerClass.id] || 1;

    var player = { name: st.user ? st.user.name : 'Vous', cls: playerClass, icon: playerClass.icon,
      hp: playerClass.baseHP + lvl.level * 5, maxHP: playerClass.baseHP + lvl.level * 5,
      atk: playerClass.baseATK + Math.floor(lvl.level * 1.5), def: playerClass.baseDEF + lvl.level, tempDef: 0 };

    var enemy, aggr;
    if (boss) {
      var diff = enemyConf.diffMult || 1;
      enemy = { name: enemyConf.name, icon: enemyConf.icon, isBoss: true, skills: enemyConf.skills,
        hp: Math.round((enemyConf.baseHP + lvl.level * 6) * diff), maxHP: Math.round((enemyConf.baseHP + lvl.level * 6) * diff),
        atk: Math.round((enemyConf.baseATK + lvl.level * 1.8) * diff), def: Math.round((enemyConf.baseDEF + lvl.level * 1.2) * diff), tempDef: 0 };
      aggr = enemyConf.aggression || { defend: 0.08, skill: 0.6, healAt: 0.3 };
    } else {
      var oc = RPG_CLASSES[Math.floor(Math.random() * RPG_CLASSES.length)];
      var names = ['Alice', 'Bob', 'Clara', 'David', 'Emma', 'Felix', 'Grace', 'Hugo', 'Iris', 'Jules', 'Kenza', 'Leo'];
      var sf = 0.85 + Math.random() * 0.3;
      enemy = { name: names[Math.floor(Math.random() * names.length)], icon: oc.icon, isBoss: false, skills: oc.skills, clsName: oc.name,
        hp: Math.round((oc.baseHP + lvl.level * 5) * sf), maxHP: Math.round((oc.baseHP + lvl.level * 5) * sf),
        atk: Math.round((oc.baseATK + lvl.level * 1.5) * sf), def: Math.round((oc.baseDEF + lvl.level) * sf), tempDef: 0 };
      aggr = { defend: 0.15, skill: 0.5, healAt: 0.35 };
    }

    var log = [], turn = 1, over = false, lastEval = null;
    var mission = PROMPT_BRIEFS[Math.floor(Math.random() * PROMPT_BRIEFS.length)];

    function calcDmg(a, d) { return Math.max(1, Math.round((a - Math.floor(d * 0.6)) * (0.85 + Math.random() * 0.3))); }
    function pickMission() { mission = PROMPT_BRIEFS[Math.floor(Math.random() * PROMPT_BRIEFS.length)]; lastEval = null; }

    function fighter(f, side) {
      var hpPct = Math.max(0, Math.round(f.hp / f.maxHP * 100));
      var hpC = hpPct > 50 ? '#2ecc71' : hpPct > 25 ? '#f5b731' : '#e74c3c';
      return '<div class="rpg-fighter ' + side + (f.isBoss ? ' boss-fighter' : '') + '">' +
        '<div class="rpg-fighter-icon">' + f.icon + '</div>' +
        '<div class="rpg-fighter-name">' + escapeHtml(f.name) + '</div>' +
        '<div class="rpg-fighter-class">' + (f.isBoss ? 'BOSS' : (f.cls ? f.cls.name : f.clsName || '')) + '</div>' +
        '<div class="rpg-bar"><div class="rpg-bar-fill" style="width:' + hpPct + '%;background:' + hpC + '"></div></div>' +
        '<div class="rpg-bar-label">HP ' + Math.max(0, f.hp) + '/' + f.maxHP + '</div>' +
        '<div class="rpg-fighter-stats">ATK ' + f.atk + ' DEF ' + (f.def + f.tempDef) + '</div></div>';
    }

    function ui() {
      var root = document.getElementById(rootId); if (!root) return;
      var missionHtml = !over ?
        '<div class="pc-mission glass-card" style="padding:1rem;margin-top:0.8rem;border-left:3px solid var(--accent,#6c5ce7)">' +
        '<div style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.04em;color:var(--text-muted)">🎯 Mission de prompt — ta seule arme : l\'IA</div>' +
        '<h4 style="margin:0.3rem 0">' + escapeHtml(mission.title) + '</h4>' +
        '<p style="font-size:0.85rem;color:var(--text-secondary,#cfd2dc);margin:0.2rem 0 0.4rem">' + escapeHtml(mission.brief) + '</p>' +
        '<div style="font-size:0.72rem;color:var(--text-muted)">Ouvre un modèle IA ci-dessous, teste, puis écris TON meilleur prompt (rôle + contexte + action + format + ton + contraintes) :</div>' +
        aiToolsBar(mission.brief) +
        '<textarea id="pc-input" class="demo-textarea" rows="4" placeholder="En tant que [rôle expert], pour [cible/marque], [action] [format]. Ton : [...]. Contraintes : [...]"></textarea>' +
        '<details style="margin-top:0.4rem"><summary style="cursor:pointer;color:var(--accent,#6c5ce7);font-size:0.8rem">💡 Astuces de prompt</summary><ul style="font-size:0.8rem;margin:0.4rem 0 0;padding-left:1.1rem">' + mission.tips.map(function (t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('') + '</ul></details>' +
        (lastEval ? '<div style="font-size:0.78rem;margin-top:0.4rem;color:var(--text-muted)">Dernier prompt : <strong>' + lastEval.total + '/100</strong>' + (lastEval.missing.length ? ' — il manque : ' + lastEval.missing.slice(0, 3).join(', ') : ' — excellent !') + '</div>' : '') +
        '</div>' : '';
      root.innerHTML =
        '<div class="rpg-battle-header">' + (boss ? '⚔️ ' + escapeHtml(enemy.name).toUpperCase() + ' &bull; ' : '') + 'Tour ' + turn + '</div>' +
        '<div class="rpg-arena">' + fighter(player, 'left') + '<div class="rpg-vs">VS</div>' + fighter(enemy, 'right') + '</div>' +
        missionHtml +
        (!over ? '<div class="rpg-actions" style="margin-top:0.6rem">' +
          '<button class="btn-primary" id="pc-send">⚔️ Lancer le prompt</button>' +
          '<button class="rpg-btn defend" id="pc-defend">🛡️ Se concentrer</button>' +
          '<button class="btn-outline btn-sm" id="pc-skip">🎲 Autre mission</button></div>' : '') +
        '<div class="rpg-log">' + log.slice(-6).map(function (l) { return '<div class="rpg-log-entry">' + l + '</div>'; }).join('') + '</div>';
      if (!over) {
        var se = document.getElementById('pc-send'); if (se) se.addEventListener('click', sendPrompt);
        var de = document.getElementById('pc-defend'); if (de) de.addEventListener('click', defend);
        var sk = document.getElementById('pc-skip'); if (sk) sk.addEventListener('click', function () { pickMission(); ui(); });
        var cp = document.getElementById('pc-copy'); if (cp) cp.addEventListener('click', function () { try { navigator.clipboard.writeText(mission.brief); if (AIA.showToast) AIA.showToast('Mission copiée — colle-la dans ton IA', 'success'); } catch (e) {} });
      }
    }

    function enemyTurn() {
      enemy.tempDef = 0;
      var hpRatio = enemy.hp / enemy.maxHP, act = 'attack', si = -1;
      if (hpRatio < aggr.healAt) { var hi = enemy.skills.findIndex(function (s) { return s.heal; }); if (hi >= 0 && Math.random() < 0.7) { act = 'skill'; si = hi; } }
      if (act === 'attack' && Math.random() < aggr.defend) act = 'defend';
      if (act === 'attack') { var us = []; enemy.skills.forEach(function (s, i) { if (s.dmg) us.push(i); }); if (us.length && Math.random() < aggr.skill) { act = 'skill'; si = us[Math.floor(Math.random() * us.length)]; } }
      if (act === 'attack') { var ed = calcDmg(enemy.atk, player.def + player.tempDef); player.hp -= ed; log.push('<strong>' + escapeHtml(enemy.name) + '</strong> attaque — ' + ed + ' dmg'); }
      else if (act === 'defend') { enemy.tempDef = Math.floor(enemy.def * 0.5); log.push('<strong>' + escapeHtml(enemy.name) + '</strong> se protège'); }
      else { var esk = enemy.skills[si]; if (esk.dmg) { var esd = calcDmg(esk.dmg, player.def + player.tempDef); player.hp -= esd; log.push((esk.icon || '✨') + ' <strong>' + escapeHtml(enemy.name) + '</strong> ' + esk.name + ' — ' + esd + ' dmg'); } if (esk.heal) { enemy.hp = Math.min(enemy.maxHP, enemy.hp + esk.heal); log.push((esk.icon || '💚') + ' ' + escapeHtml(enemy.name) + ' +' + esk.heal + ' HP'); } if (esk.defBuff) enemy.tempDef += esk.defBuff; }
    }

    function resolveAndAdvance() {
      if (enemy.hp <= 0) { finish(true); return; }
      enemyTurn();
      player.tempDef = 0;
      if (player.hp <= 0) { finish(false); return; }
      turn++; if (turn > 30) { finish(player.hp > enemy.hp); return; }
      pickMission(); ui();
    }

    function sendPrompt() {
      if (over) return;
      var inp = document.getElementById('pc-input'); if (!inp) return;
      var txt = (inp.value || '').trim();
      if (txt.length < 15) { if (AIA.showToast) AIA.showToast('Prompt trop court — min 15 caractères', 'warning'); return; }
      var ev = evaluatePrompt(txt, mission); lastEval = ev;
      var dmg = Math.max(1, Math.round((ev.total / 100) * player.atk * 1.8 * mult));
      var crit = ev.total >= 85; if (crit) dmg = Math.round(dmg * 1.25);
      enemy.hp -= dmg;
      log.push((crit ? '🔥 <strong>PROMPT CRITIQUE</strong> ' : '✍️ Prompt ') + '(' + ev.total + '/100) — ' + dmg + ' dmg');
      if (playerClass.id === 'content-bard' && ev.total >= 70) { player.hp = Math.min(player.maxHP, player.hp + 8); log.push('📝 Content Bard : +8 HP'); }
      resolveAndAdvance();
    }

    function defend() {
      if (over) return;
      player.tempDef = Math.floor(player.def * 0.6);
      player.hp = Math.min(player.maxHP, player.hp + 6);
      log.push('🛡️ <strong>' + escapeHtml(player.name) + '</strong> se concentre (+DEF, +6 HP) — aucun dégât');
      resolveAndAdvance();
    }

    function pvpFinish(won) {
      var pvp = opts.pvp || { battlesToday: 0, wins: 0, losses: 0, points: 0 };
      var xpGain = won ? 10 : 3, ptsGain = won ? PVP_WIN_POINTS : PVP_LOSE_POINTS;
      pvp.battlesToday++; if (won) pvp.wins++; else pvp.losses++;
      pvp.points += ptsGain; pvp.lastBattleDate = new Date().toISOString().split('T')[0];
      if (typeof savePvpStats === 'function') savePvpStats(pvp);
      if (won && AIA.bumpGameProgress) AIA.bumpGameProgress('rpg');
      AIA.addXP(xpGain, won ? 'Victoire PvP (prompt)' : 'Combat PvP (prompt)');
      if (won && pvp.wins === 1 && AIA.awardBadge) AIA.awardBadge('battle-win');
      var rem = MAX_BATTLES_PER_DAY - pvp.battlesToday;
      return { title: won ? 'Victoire !' : 'Défaite', rematch: rem > 0,
        html: '<p>+' + ptsGain + ' PvP &bull; +' + xpGain + ' XP</p><div class="rpg-result-stats"><span>Total: ' + pvp.points + ' pts</span><span>W/L: ' + pvp.wins + '/' + pvp.losses + '</span><span>Restants: ' + rem + '/' + MAX_BATTLES_PER_DAY + '</span></div>' };
    }

    function finish(won) {
      over = true; ui();
      var res = opts.isPvp ? pvpFinish(won) : (opts.onEnd ? opts.onEnd(won) : { title: won ? 'Victoire' : 'Défaite', html: '' });
      var root = document.getElementById(rootId); if (!root) return;
      root.innerHTML += '<div class="rpg-result ' + (won ? 'win' : 'lose') + '">' +
        '<div class="rpg-result-icon">' + (won ? '🏆' : (boss ? '💀' : '💪')) + '</div>' +
        '<h3>' + res.title + '</h3>' + (res.html || '') +
        '<div style="margin-top:0.9rem">' +
        (opts.isPvp && res.rematch ? '<button class="btn-primary" id="pc-rematch">Nouveau combat</button> ' : '') +
        '<button class="btn-outline" data-navigate="' + (opts.backTo || 'arena') + '">Retour Arena</button></div></div>';
      var rm = document.getElementById('pc-rematch'); if (rm) rm.addEventListener('click', function () { renderRPG(main); });
    }

    ui();
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
      var xpGain = won ? 10 : 3, ptsGain = won ? PVP_WIN_POINTS : PVP_LOSE_POINTS;
      pvp.battlesToday++; if (won) pvp.wins++; else pvp.losses++;
      pvp.points += ptsGain; pvp.lastBattleDate = new Date().toISOString().split('T')[0];
      savePvpStats(pvp);
      if (won && AIA.bumpGameProgress) AIA.bumpGameProgress('rpg'); // progression vers le boss PvE
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

  /* =====================================================================
     BOSS — moteur generique + Prof (PvP, quasi imbattable) + boss solo (PvE)
     ===================================================================== */

  // XP des mini-jeux volontairement MINIME vs le projet (Business Game). La vraie recompense
  // des boss = les badges (legendaire/epic) + le temps fort Live, pas l'XP.
  var BOSS_WIN_XP = 25;                         // x2 => 50 XP si on bat le Prof
  var BOSS_LOSS_XP = 5;                         // consolation defaite Prof (avant malus)
  var BOSS_PENALTY_MS = 2 * 60 * 60 * 1000;     // malus 0,75x pendant 2h si defaite contre le Prof
  var SOLO_BOSS_XP = 25;                        // recompense boss solo PvE

  // Le Prof : IA quasi imbattable (~10% de reussite). En realite un ordinateur tres dur.
  // Tune par simulation Monte-Carlo (cf. tests) : ~10% de victoire pour un bon joueur de haut niveau,
  // quasi 0% a bas niveau. Le scaling (level*6 HP / *1.8 ATK / *1.2 DEF) le rend dominant en fin de partie.
  var PROF_CONF = {
    name: 'Le Prof', icon: '🤖', baseHP: 128, baseATK: 17, baseDEF: 10,
    diffMult: 1.05, manaRegenBonus: 4, aggression: { defend: 0.06, skill: 0.65, healAt: 0.35 },
    skills: [
      { name: 'Correction Impitoyable', icon: '📕', dmg: 26, cost: 18 },
      { name: 'Examen Surprise', icon: '⚡', dmg: 18, cost: 11 },
      { name: 'Cours Magistral', icon: '🧠', heal: 24, cost: 20 },
      { name: 'Autorite', icon: '🛡️', defBuff: 9, cost: 14 }
    ]
  };
  // Boss PvE du RPG : rejouable et battable (~35-50% pour un bon joueur). Pas de malus.
  var CREATURE_CONF = {
    name: 'Le Gardien Algorithmique', icon: '🐲', baseHP: 115, baseATK: 15, baseDEF: 9,
    diffMult: 1.0, manaRegenBonus: 3, aggression: { defend: 0.1, skill: 0.55, healAt: 0.3 },
    skills: [
      { name: 'Souffle de Donnees', icon: '🔥', dmg: 20, cost: 16 },
      { name: 'Griffe Binaire', icon: '⚔️', dmg: 15, cost: 11 },
      { name: 'Regen Cloud', icon: '💚', heal: 18, cost: 16 },
      { name: 'Carapace', icon: '🛡️', defBuff: 7, cost: 14 }
    ]
  };

  /* ---- Helpers partages ---- */
  function rpgModal(html) {
    var ov = document.createElement('div');
    ov.className = 'boss-modal-overlay';
    ov.innerHTML = '<div class="boss-modal glass-card">' + html + '</div>';
    document.body.appendChild(ov);
    function close() { if (ov.parentNode) ov.parentNode.removeChild(ov); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    return { el: ov, close: close };
  }
  function classCard(cls) {
    return '<div class="rpg-class-card glass-card" data-class="' + cls.id + '">' +
      '<div class="rpg-class-icon">' + cls.icon + '</div>' +
      '<h4>' + cls.name + '</h4><p>' + cls.desc + '</p>' +
      '<div class="rpg-class-stats"><span>HP ' + cls.baseHP + '</span><span>ATK ' + cls.baseATK + '</span><span>DEF ' + cls.baseDEF + '</span></div></div>';
  }
  function wireClassCards(scope, cb) {
    document.querySelectorAll(scope + ' .rpg-class-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var cls = RPG_CLASSES.find(function (c) { return c.id === this.getAttribute('data-class'); }.bind(this));
        if (cls) cb(cls);
      });
    });
  }
  // Banniere "boss solo" d'un mini-jeu (verrouille / debloque / vaincu).
  function bossZoneHtml(gameKey, bossName, bossIcon) {
    var AIA = window.AIA;
    var gp = AIA.getGameProgress ? AIA.getGameProgress() : {};
    var g = gp[gameKey] || { wins: 0, bossDone: false };
    var need = AIA.BOSS_UNLOCK_WINS || 3;
    if (g.bossDone) {
      return '<div class="solo-boss-zone done"><span class="sbz-ic">' + bossIcon + '</span><div class="sbz-txt"><strong>' + bossName + '</strong><br><span class="sbz-sub">✅ Boss vaincu</span></div></div>';
    }
    if ((g.wins || 0) >= need) {
      return '<div class="solo-boss-zone ready"><span class="sbz-ic">' + bossIcon + '</span><div class="sbz-txt"><strong>BOSS D&Eacute;BLOQU&Eacute; : ' + bossName + '</strong><br><span class="sbz-sub">Boss solo tr&egrave;s difficile &bull; +' + SOLO_BOSS_XP + ' XP + badge</span></div><button class="btn-primary btn-sm" id="solobtn-' + gameKey + '">Affronter</button></div>';
    }
    return '<div class="solo-boss-zone locked"><span class="sbz-ic">🔒</span><div class="sbz-txt"><strong>Boss verrouill&eacute; : ' + bossName + '</strong><br><span class="sbz-sub">Gagne encore ' + (need - (g.wins || 0)) + ' partie(s) pour le d&eacute;bloquer (' + (g.wins || 0) + '/' + need + ')</span></div></div>';
  }
  function wireBossZone(gameKey, onFight) {
    var b = document.getElementById('solobtn-' + gameKey);
    if (b) b.addEventListener('click', onFight);
  }

  /* ---- Moteur de combat generique (Prof + boss PvE) ----
     conf: {name,icon,baseHP,baseATK,baseDEF,skills,diffMult,manaRegenBonus,aggression:{defend,skill,healAt}}
     opts: {rootId, backTo, onEnd:function(won){return {title,html};}} */
  function runBossBattle(main, playerClass, conf, opts) {
    var AIA = window.AIA, st = AIA.getState();
    var rootId = opts.rootId || 'boss-root';
    var diff = conf.diffMult || 1;
    var regen = MANA_PER_TURN + (conf.manaRegenBonus || 4);
    var aggr = conf.aggression || { defend: 0.08, skill: 0.6, healAt: 0.3 };
    var lvl = AIA.getLevelInfo ? AIA.getLevelInfo(st.xp.total) : { level: 1 };

    var player = { name: st.user ? st.user.name : 'Vous', cls: playerClass, icon: playerClass.icon,
      hp: playerClass.baseHP + lvl.level * 5, maxHP: playerClass.baseHP + lvl.level * 5,
      atk: playerClass.baseATK + Math.floor(lvl.level * 1.5), def: playerClass.baseDEF + lvl.level,
      mana: 50, maxMana: 50, tempDef: 0 };
    var enemy = { name: conf.name, cls: conf, icon: conf.icon,
      hp: Math.round((conf.baseHP + lvl.level * 6) * diff), maxHP: Math.round((conf.baseHP + lvl.level * 6) * diff),
      atk: Math.round((conf.baseATK + lvl.level * 1.8) * diff), def: Math.round((conf.baseDEF + lvl.level * 1.2) * diff),
      mana: 60, maxMana: 60, tempDef: 0 };

    var log = [], turn = 1, over = false;

    function fighter(f, side, boss) {
      var hpPct = Math.max(0, Math.round(f.hp / f.maxHP * 100));
      var mpPct = Math.round(f.mana / f.maxMana * 100);
      var hpC = hpPct > 50 ? '#2ecc71' : hpPct > 25 ? '#f5b731' : '#e74c3c';
      return '<div class="rpg-fighter ' + side + (boss ? ' boss-fighter' : '') + '">' +
        '<div class="rpg-fighter-icon">' + f.icon + '</div>' +
        '<div class="rpg-fighter-name">' + escapeHtml(f.name) + '</div>' +
        '<div class="rpg-fighter-class">' + (boss ? 'BOSS' : f.cls.name) + '</div>' +
        '<div class="rpg-bar"><div class="rpg-bar-fill" style="width:' + hpPct + '%;background:' + hpC + '"></div></div>' +
        '<div class="rpg-bar-label">HP ' + Math.max(0, f.hp) + '/' + f.maxHP + '</div>' +
        '<div class="rpg-bar"><div class="rpg-bar-fill" style="width:' + mpPct + '%;background:#3498db"></div></div>' +
        '<div class="rpg-bar-label">MP ' + f.mana + '/' + f.maxMana + '</div>' +
        '<div class="rpg-fighter-stats">ATK ' + f.atk + ' DEF ' + (f.def + f.tempDef) + '</div></div>';
    }
    function calcDmg(a, d) { return Math.max(1, Math.round((a - Math.floor(d * 0.6)) * (0.85 + Math.random() * 0.3))); }

    function ui() {
      var root = document.getElementById(rootId); if (!root) return;
      root.innerHTML =
        '<div class="rpg-battle-header">⚔️ ' + escapeHtml(conf.name).toUpperCase() + ' &bull; Tour ' + turn + '</div>' +
        '<div class="rpg-arena">' + fighter(player, 'left', false) + '<div class="rpg-vs">VS</div>' + fighter(enemy, 'right', true) + '</div>' +
        (!over ? '<div class="rpg-actions">' +
          '<button class="rpg-btn attack" id="' + rootId + '-attack">Attaque<span class="rpg-btn-sub">(' + player.atk + ' ATK)</span></button>' +
          '<button class="rpg-btn defend" id="' + rootId + '-defend">Defense<span class="rpg-btn-sub">(+50% DEF)</span></button>' +
          player.cls.skills.map(function (sk, i) {
            var dis = player.mana < sk.cost;
            return '<button class="rpg-btn skill' + (dis ? ' disabled' : '') + '" data-skill="' + i + '"' + (dis ? ' disabled' : '') + '>' +
              sk.icon + ' ' + sk.name + '<span class="rpg-btn-sub">(' + sk.cost + ' MP)</span></button>';
          }).join('') + '</div>' : '') +
        '<div class="rpg-log">' + log.slice(-6).map(function (l) { return '<div class="rpg-log-entry">' + l + '</div>'; }).join('') + '</div>';
      if (!over) {
        document.getElementById(rootId + '-attack').addEventListener('click', function () { step('attack'); });
        document.getElementById(rootId + '-defend').addEventListener('click', function () { step('defend'); });
        document.querySelectorAll('#' + rootId + ' .rpg-btn.skill:not(.disabled)').forEach(function (b) {
          b.addEventListener('click', function () { step('skill', parseInt(this.getAttribute('data-skill'))); });
        });
      }
    }

    function step(action, si) {
      if (over) return;
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
      if (enemy.hp <= 0) { finish(true); return; }

      // IA du boss
      enemy.tempDef = 0;
      var hpRatio = enemy.hp / enemy.maxHP;
      var aiAct = 'attack', aiSi = -1;
      if (hpRatio < aggr.healAt) { var hi = conf.skills.findIndex(function (s) { return s.heal && enemy.mana >= s.cost; }); if (hi >= 0) { aiAct = 'skill'; aiSi = hi; } }
      if (aiAct === 'attack' && Math.random() < aggr.defend) aiAct = 'defend';
      if (aiAct === 'attack') { var us = []; conf.skills.forEach(function (s, i) { if (s.dmg && enemy.mana >= s.cost) us.push(i); }); if (us.length && Math.random() < aggr.skill) { aiAct = 'skill'; aiSi = us[Math.floor(Math.random() * us.length)]; } }

      if (aiAct === 'attack') {
        var ed = calcDmg(enemy.atk, player.def + player.tempDef);
        player.hp -= ed; log.push('<strong>' + escapeHtml(enemy.name) + '</strong> attaque — ' + ed + ' dmg');
        enemy.mana = Math.min(enemy.maxMana, enemy.mana + regen);
      } else if (aiAct === 'defend') {
        enemy.tempDef = Math.floor(enemy.def * 0.5);
        log.push('<strong>' + escapeHtml(enemy.name) + '</strong> se prot&egrave;ge');
        enemy.mana = Math.min(enemy.maxMana, enemy.mana + regen + 5);
      } else {
        var esk = conf.skills[aiSi]; enemy.mana -= esk.cost;
        if (esk.dmg) { var esd = calcDmg(esk.dmg, player.def + player.tempDef); player.hp -= esd; log.push(esk.icon + ' <strong>' + escapeHtml(enemy.name) + '</strong> lance ' + esk.name + ' — ' + esd + ' dmg'); }
        if (esk.heal) { enemy.hp = Math.min(enemy.maxHP, enemy.hp + esk.heal); log.push(esk.icon + ' ' + escapeHtml(enemy.name) + ' recupere ' + esk.heal + ' HP'); }
        if (esk.defBuff) enemy.tempDef += esk.defBuff;
        enemy.mana = Math.min(enemy.maxMana, enemy.mana + regen);
      }
      if (player.hp <= 0) { finish(false); return; }
      turn++; if (turn > 40) { finish(player.hp > enemy.hp); return; }
      ui();
    }

    function finish(won) {
      over = true; ui();
      var res = opts.onEnd ? opts.onEnd(won) : { title: won ? 'Victoire' : 'Defaite', html: '' };
      var root = document.getElementById(rootId); if (!root) return;
      root.innerHTML += '<div class="rpg-result ' + (won ? 'win' : 'lose') + '">' +
        '<div class="rpg-result-icon">' + (won ? '🏆' : '💀') + '</div>' +
        '<h3>' + res.title + '</h3>' + (res.html || '') +
        '<div style="margin-top:0.9rem"><button class="btn-primary" data-navigate="' + (opts.backTo || 'rpg') + '">Retour</button></div></div>';
    }

    ui();
  }

  /* ---- Prof (PvP) : pop-up pros/cons -> selection de classe -> combat ---- */
  function showProfPopup(main) {
    var AIA = window.AIA;
    var bd = AIA.getBossDuel ? AIA.getBossDuel() : null;
    if (bd && bd.used) {
      var m0 = rpgModal('<div class="boss-modal-head">🤖 Le Prof</div>' +
        '<p style="color:var(--text-muted)">' + (bd.result === 'win' ?
          'Vous avez d&eacute;j&agrave; <strong>battu le Prof</strong> 🏆 — exploit accompli !' :
          'Vous avez d&eacute;j&agrave; tent&eacute; votre chance. <strong>Une seule tentative</strong> par s&eacute;minaire.') + '</p>' +
        '<div class="boss-modal-actions"><button class="btn-primary" id="bm-close">Compris</button></div>');
      m0.el.querySelector('#bm-close').addEventListener('click', m0.close);
      return;
    }
    var html = '<div class="boss-modal-head">🤖 D&eacute;fier le Prof ?</div>' +
      '<p class="boss-modal-warn">En face : une <strong>IA experte, quasi imbattable (~10% de r&eacute;ussite)</strong>. Ce n\'est pas vraiment le prof, mais un ordinateur tr&egrave;s dur.</p>' +
      '<div class="boss-pros-cons">' +
        '<div class="bpc pros"><h4>✅ Avantages</h4><ul>' +
          '<li>Victoire = gains du duel <strong>x2</strong> (+' + (BOSS_WIN_XP * 2) + ' XP)</li>' +
          '<li>Badge l&eacute;gendaire <strong>Tombeur du Prof</strong></li>' +
          '<li>Temps fort affich&eacute; dans le Live</li></ul></div>' +
        '<div class="bpc cons"><h4>⚠️ Inconv&eacute;nients</h4><ul>' +
          '<li>D&eacute;faite = <strong>-25%</strong> sur vos gains XP pendant <strong>2h</strong></li>' +
          '<li><strong>Une seule tentative</strong> pour tout le s&eacute;minaire</li>' +
          '<li>Compte d&egrave;s que vous lancez (pas de retour arri&egrave;re)</li></ul></div>' +
      '</div>' +
      '<div class="boss-modal-actions"><button class="btn-ghost" id="bm-cancel">Annuler</button>' +
      '<button class="btn-primary" id="bm-accept">J\'accepte le d&eacute;fi ⚔️</button></div>';
    var m = rpgModal(html);
    m.el.querySelector('#bm-cancel').addEventListener('click', m.close);
    m.el.querySelector('#bm-accept').addEventListener('click', function () { m.close(); renderProfClassSelect(main); });
  }

  function renderProfClassSelect(main) {
    main.innerHTML = '<div class="page-header">' + backBtn() +
      '<h1>Duel : <span class="gradient-text">Le Prof</span></h1>' +
      '<p class="page-subtitle">IA quasi imbattable &bull; tentative unique</p></div>' +
      '<div id="boss-root" class="glass-card boss-battle" style="padding:1.5rem">' +
      '<div class="boss-intro"><div class="boss-portrait">🤖</div>' +
      '<p class="boss-pitch">Choisissez votre classe. Bonne chance... vous en aurez besoin.</p>' +
      '<div class="rpg-class-grid">' + RPG_CLASSES.map(classCard).join('') + '</div></div></div>';
    wireClassCards('#boss-root', function (cls) {
      var AIA = window.AIA;
      if (AIA.getBossDuel && AIA.getBossDuel() && AIA.getBossDuel().used) { showProfPopup(main); return; }
      if (AIA.recordBossDuel) AIA.recordBossDuel('pending'); // consomme des le lancement (anti-refresh)
      promptBattle(main, cls, PROF_CONF, { rootId: 'boss-root', backTo: 'rpg', boss: true, onEnd: profOnEnd });
    });
  }

  function profOnEnd(won) {
    var AIA = window.AIA, st = AIA.getState();
    if (AIA.recordBossDuel) AIA.recordBossDuel(won ? 'win' : 'loss');
    if (won) {
      AIA.addXP(BOSS_WIN_XP * 2, 'Victoire vs le Prof (x2)');
      if (AIA.awardBadge) AIA.awardBadge('prof-slayer');
      try { if (AIA.pushFeed && st.user && !st.user.isAdmin) AIA.pushFeed({ action: 'boss-win', target: 'Le Prof' }); } catch (e) {}
      if (AIA.saveStateNow) AIA.saveStateNow();
      return { title: 'Vous avez BATTU le Prof !', html: '<p>Exploit l&eacute;gendaire 🏆 Bonus <strong>x2 : +' + (BOSS_WIN_XP * 2) + ' XP</strong> + badge <strong>Tombeur du Prof</strong>.</p><div style="font-size:0.78rem;color:var(--text-muted)">Tentative unique utilis&eacute;e.</div>' };
    }
    AIA.addXP(BOSS_LOSS_XP, 'Duel vs le Prof');
    if (AIA.startPvpPenalty) AIA.startPvpPenalty(BOSS_PENALTY_MS);
    try { if (AIA.pushFeed && st.user && !st.user.isAdmin) AIA.pushFeed({ action: 'boss-try', target: 'Le Prof' }); } catch (e) {}
    if (AIA.saveStateNow) AIA.saveStateNow();
    return { title: 'Le Prof vous a corrig&eacute;...', html: '<p>L\'IA du Prof est redoutable, comme pr&eacute;vu. Malus <strong>-25%</strong> sur vos gains XP pendant <strong>2h</strong>. +' + BOSS_LOSS_XP + ' XP.</p><div style="font-size:0.78rem;color:var(--text-muted)">Tentative unique utilis&eacute;e.</div>' };
  }

  /* ---- Boss PvE du RPG (rejouable) ---- */
  function renderPveBossSelect(main) {
    main.innerHTML = '<div class="page-header">' + backBtn() +
      '<h1>Boss : <span class="gradient-text">' + escapeHtml(CREATURE_CONF.name) + '</span></h1>' +
      '<p class="page-subtitle">Boss PvE du RPG &bull; r&eacute;essayable</p></div>' +
      '<div id="boss-root" class="glass-card boss-battle" style="padding:1.5rem">' +
      '<div class="boss-intro"><div class="boss-portrait">🐲</div>' +
      '<p class="boss-pitch">Le gardien des donn&eacute;es. Choisissez votre classe.</p>' +
      '<div class="rpg-class-grid">' + RPG_CLASSES.map(classCard).join('') + '</div></div></div>';
    wireClassCards('#boss-root', function (cls) {
      promptBattle(main, cls, CREATURE_CONF, { rootId: 'boss-root', backTo: 'rpg', boss: true, onEnd: pveOnEnd });
    });
  }

  function pveOnEnd(won) {
    var AIA = window.AIA, st = AIA.getState();
    if (won) {
      if (AIA.markGameBoss) AIA.markGameBoss('rpg');
      AIA.addXP(SOLO_BOSS_XP, 'Boss PvE vaincu');
      if (AIA.awardBadge) AIA.awardBadge('boss-slayer');
      try { if (AIA.pushFeed && st.user && !st.user.isAdmin) AIA.pushFeed({ action: 'boss-solo', target: CREATURE_CONF.name }); } catch (e) {}
      return { title: CREATURE_CONF.name + ' terrass&eacute; !', html: '<p>+' + SOLO_BOSS_XP + ' XP + badge <strong>Boss Slayer</strong> 🐲</p>' };
    }
    AIA.addXP(5, 'Combat boss PvE');
    return { title: 'Le boss r&eacute;siste...', html: '<p>+5 XP. Reviens plus fort — tu peux le r&eacute;affronter quand tu veux.</p>' };
  }

  window.AIA = window.AIA || {};
  window.AIA.aiToolsBar = aiToolsBar;
  window.AIA.AI_TOOLS = AI_TOOLS;
  window.AIA.promptBattle = promptBattle;
  window.AIA.renderBattle = renderBattle;
  window.AIA.startQuiz = startQuiz;
  window.AIA.startChallenge = startChallenge;
  window.AIA.renderRPG = renderRPG;
  window.AIA.RPG_CLASSES = RPG_CLASSES;
  window.AIA.showProfPopup = showProfPopup;
  window.AIA.renderProfClassSelect = renderProfClassSelect;
  window.AIA.renderPveBossSelect = renderPveBossSelect;
  window.AIA.runBossBattle = runBossBattle;
  window.AIA.PROF_CONF = PROF_CONF;
  window.AIA.CREATURE_CONF = CREATURE_CONF;
})();
