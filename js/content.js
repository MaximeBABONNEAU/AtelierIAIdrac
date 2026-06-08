/* ==============================================
   CONTENT.JS — Course Content & Activity Detail
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  var COURSE_CONTENT = {
    'd1-accueil': {
      slides: [
        { title: 'Bienvenue a l\'Atelier IA & Marketing', points: [
          'Objectif : maitriser les outils IA pour le marketing digital en 4 jours',
          'Approche gamifiee : XP, badges, classement — chaque activite rapporte des points',
          'Methode : 70% pratique (ateliers, demos) / 30% theorie',
          'Tous les outils presentes sont gratuits ou freemium'
        ], exercise: 'Ice Breaker : Presentez-vous en 30s et partagez votre experience avec l\'IA.' },
        { title: 'Regles du Jeu & Equipes', points: [
          'Formez des equipes de 3-4 pour le Business Game (Jours 3-4)',
          'Les XP s\'accumulent individuellement mais le projet final est en equipe',
          'Creez votre avatar pixel art pour personnaliser votre experience',
          'Le classement final determine les Awards du Jour 4'
        ] }
      ],
      keyTakeaways: ['L\'IA est un outil, pas un remplacement — votre creativite reste essentielle', 'Experimentez sans crainte, l\'echec fait partie de l\'apprentissage']
    },
    'd1-intro-ia': {
      slides: [
        { title: 'Qu\'est-ce que l\'IA Generative ?', points: [
          'IA Generative = modeles capables de creer du contenu nouveau (texte, image, video, audio)',
          'Modeles de langage (LLM) : ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google)',
          'Modeles d\'image : Midjourney, DALL-E 3, Stable Diffusion, Flux',
          'Modeles video/audio : HeyGen, ElevenLabs, Runway, Sora'
        ] },
        { title: 'Impact sur le Marketing Digital', points: [
          'Creation de contenu x10 plus rapide : articles, posts sociaux, emails',
          'Personnalisation a grande echelle : chaque client recoit un message adapte',
          'Analyse de donnees automatisee : sentiment, tendances, segmentation',
          'Chatbots intelligents : service client 24/7 avec comprehension contextuelle',
          'A/B testing accelere : generation et test de variantes en temps reel'
        ] },
        { title: 'Limites et Ethique', points: [
          'Hallucinations : l\'IA peut generer des informations fausses avec assurance',
          'Biais : les modeles reproduisent les biais presents dans leurs donnees d\'entrainement',
          'Droits d\'auteur : zone grise juridique sur le contenu genere par IA',
          'Transparence : obligation ethique de signaler l\'utilisation de l\'IA',
          'RGPD : attention aux donnees personnelles envoyees aux modeles'
        ] }
      ],
      keyTakeaways: ['L\'IA generative accelere la creation mais necessite une supervision humaine', 'Le marketing IA performant combine automatisation et expertise metier', 'Toujours verifier les faits generes par l\'IA (fact-checking)']
    },
    'd1-premier-prompt': {
      slides: [
        { title: 'Anatomie d\'un Bon Prompt', points: [
          'Un prompt = une instruction donnee a l\'IA pour obtenir un resultat',
          'Structure CRAC : Contexte + Role + Action + Contraintes',
          'Plus le prompt est precis, plus le resultat est pertinent',
          'Iterez : affinez votre prompt en fonction des resultats obtenus'
        ], exercise: 'Ecrivez un prompt pour generer un slogan pour une marque de cafe bio. Comparez un prompt vague vs. un prompt structure.' },
        { title: 'Exemples Concrets Marketing', points: [
          'Slogan : "En tant que copywriter senior, cree 5 slogans pour [marque], ton [adj], cible [persona]"',
          'Email : "Redige un email de relance panier abandonne, ton amical, max 100 mots, avec CTA clair"',
          'Post social : "Cree un post LinkedIn pour annoncer [produit], format storytelling, avec emojis"',
          'Analyse : "Analyse ces 10 avis clients et identifie les 3 themes positifs et negatifs principaux"'
        ], exercise: 'Utilisez le Prompt Playground (onglet Demos) pour comparer vos formulations.' }
      ],
      keyTakeaways: ['Le prompt engineering est LA competence cle pour utiliser l\'IA efficacement', 'Toujours donner un role, un contexte et des contraintes precises']
    },
    'd1-prompt-avance': {
      slides: [
        { title: 'Techniques Avancees', points: [
          'Chain-of-Thought : "Reflechis etape par etape avant de repondre"',
          'Few-Shot Learning : fournir 2-3 exemples du format attendu',
          'Role Prompting : "Tu es un expert en [domaine] avec 15 ans d\'experience"',
          'Self-Consistency : demander plusieurs reponses puis choisir la meilleure',
          'Tree of Thought : explorer plusieurs pistes de reflexion en parallele'
        ] },
        { title: 'Frameworks Marketing avec IA', points: [
          'AIDA via IA : generer Attention / Interet / Desir / Action pour chaque campagne',
          'Persona Generation : creer des personas detailles a partir de donnees',
          'Competitor Analysis : analyser le positionnement concurrent avec un prompt structure',
          'Content Calendar : generer un calendrier editorial mensuel complet'
        ], exercise: 'Creez un persona marketing complet en utilisant le chain-of-thought. Comparez avec un prompt simple.' }
      ],
      keyTakeaways: ['Le chain-of-thought ameliore la qualite de 30-50% sur les taches complexes', 'Le few-shot learning permet de controler precisement le format de sortie']
    },
    'd1-defi': {
      slides: [
        { title: 'Prompt Battle — Regles', points: [
          'Chaque duel : meme brief marketing, 2 concurrents, la classe vote',
          'Criteres : creativite, pertinence, respect du brief, qualite du prompt',
          'Le gagnant remporte des XP bonus et avance dans le tournoi',
          'Astuce : utilisez les techniques vues ce matin pour vous demarquer'
        ], exercise: 'Rendez-vous dans l\'Arena pour participer aux Prompt Battles !' }
      ],
      keyTakeaways: ['La competence prompt se perfectionne par la pratique et la comparaison']
    },
    'd1-debrief': {
      slides: [
        { title: 'Bilan du Jour 1', points: [
          'Concepts cles : IA generative, LLM, prompt engineering, chain-of-thought',
          'Outils decouverts : ChatGPT, Claude, Perplexity',
          'Competence acquise : savoir formuler un prompt efficace pour le marketing',
          'Demain : Creation de contenu (visuels, copywriting, video)'
        ], exercise: 'Quiz interactif : testez vos connaissances du Jour 1 dans l\'Arena !' }
      ],
      keyTakeaways: ['Le prompt engineering est la base de toute utilisation efficace de l\'IA']
    },
    'd2-visuel': {
      slides: [
        { title: 'Panorama des Outils Visuels IA', points: [
          'Midjourney : qualite artistique premium, ideal pour branding et concepts',
          'DALL-E 3 (ChatGPT) : integre a ChatGPT, excellent pour iterations rapides',
          'Canva AI (Magic Studio) : templates marketing + generation IA integree',
          'Adobe Firefly : integre a Photoshop/Illustrator, usage commercial safe',
          'Stable Diffusion : open-source, personnalisable, gratuit'
        ] },
        { title: 'Bonnes Pratiques', points: [
          'Etre precis sur le style : "flat design", "photorealiste", "isometrique"',
          'Specifier le format : "16:9 pour banner", "1:1 pour Instagram", "9:16 pour Story"',
          'Indiquer l\'ambiance : "eclairage studio", "lumiere naturelle", "neon cyberpunk"',
          'Pour les logos : toujours re-vectoriser le resultat IA',
          'Droits : verifier les conditions d\'usage commercial de chaque outil'
        ] }
      ],
      keyTakeaways: ['L\'IA genere des drafts — le designer affine et valide', 'Midjourney pour le branding, Canva AI pour le quotidien']
    },
    'd2-atelier-image': {
      slides: [
        { title: 'Atelier Creation Visuelle', points: [
          'Mission : creer 3 visuels pour une campagne fictive (post social, banner, pub)',
          'Etape 1 : definir le brief (marque, cible, message, ton)',
          'Etape 2 : generer des variantes avec differents prompts',
          'Etape 3 : selectionner et affiner les meilleurs resultats',
          'Etape 4 : adapter aux formats requis (Instagram, LinkedIn, Display)'
        ], exercise: 'Creez une serie de 3 visuels coherents. Utilisez la demo Generation d\'Images pour experimenter.' }
      ],
      keyTakeaways: ['La coherence visuelle est plus importante que la perfection individuelle']
    },
    'd2-copywriting': {
      slides: [
        { title: 'Copywriting Assiste par IA', points: [
          'L\'IA excelle pour : premiers jets, variations, adaptation de ton, traduction',
          'L\'humain reste indispensable pour : strategie, emotion authentique, validation',
          'Frameworks : AIDA, PAS (Problem-Agitation-Solution), BAB (Before-After-Bridge)',
          'Ton de voix : toujours specifier le ton dans le prompt'
        ], exercise: 'Redigez 3 versions d\'un email marketing (formel, amical, urgence) avec l\'IA.' },
        { title: 'Templates Marketing', points: [
          'Email de bienvenue : accueil + valeur + CTA clair',
          'Post LinkedIn : hook (1ere ligne) + storytelling + takeaway + CTA',
          'Fiche produit : benefices > features, preuve sociale, urgence',
          'Landing page : titre impactant + sous-titre + 3 benefices + CTA'
        ] }
      ],
      keyTakeaways: ['Le copywriting IA est un accelerateur, pas un remplacement du stratege']
    },
    'd2-video': {
      slides: [
        { title: 'Video et Voix avec l\'IA', points: [
          'HeyGen : videos avec avatars IA realistes (presentations, formations)',
          'ElevenLabs : synthese vocale ultra-realiste en 30+ langues',
          'Runway Gen-3 : generation de clips video a partir de texte ou d\'images',
          'CapCut AI : montage video automatise avec sous-titres et effets',
          'Cas d\'usage : temoignages, tutoriels, publicites, UGC synthetique'
        ], exercise: 'Creez un script de 30s pour une pub produit. Imaginez la transformation en video IA.' }
      ],
      keyTakeaways: ['La video IA democratise la production audiovisuelle pour les petites equipes']
    },
    'd2-demo-sentiment': {
      slides: [
        { title: 'Analyse de Sentiment — Theorie', points: [
          'Le NLP (Natural Language Processing) analyse la tonalite d\'un texte',
          'Applications : avis clients, social listening, reputation, support client',
          'Niveaux : positif/negatif/neutre, emotions, intentions, themes',
          'Outils pro : Brandwatch, Meltwater, Sprout Social, MonkeyLearn'
        ], exercise: 'Testez l\'analyseur de sentiment avec de vrais avis clients.' }
      ],
      keyTakeaways: ['L\'analyse automatisee traite des milliers d\'avis en minutes']
    },
    'd2-challenge': {
      slides: [
        { title: 'Challenge Creatif — Brief', points: [
          'Mission : creer une mini-campagne marketing complete en equipe (1h)',
          'Livrables : 1 visuel + 1 texte publicitaire + 1 concept video',
          'Tous les outils IA sont autorises',
          'Criteres : creativite, coherence, pertinence cible, qualite d\'execution'
        ], exercise: 'En equipe, creez une campagne pour un produit fictif. Presentez en 3 min.' }
      ],
      keyTakeaways: ['La force d\'une campagne reside dans la coherence visuels/texte/message']
    },
    'd3-seo': {
      slides: [
        { title: 'SEO & IA en 2026', points: [
          'Google SGE (Search Generative Experience) change la donne du SEO',
          'E-E-A-T : Experience, Expertise, Authoritativeness, Trustworthiness',
          'L\'IA aide : recherche mots-cles, optimisation contenu, meta descriptions',
          'Core Web Vitals : performance technique reste cruciale',
          'Outils IA-SEO : Surfer SEO, Clearscope, SEMrush AI, Frase'
        ] },
        { title: 'Strategie SEO Assistee par IA', points: [
          'Recherche de mots-cles avec clustering semantique',
          'Analyse de la SERP et des intentions de recherche',
          'Generation de briefs de contenu optimises',
          'Redaction assistee avec verification SEO en temps reel',
          'Monitoring et optimisation continue'
        ] }
      ],
      keyTakeaways: ['Le SEO 2026 privilegie le contenu d\'expert avec valeur ajoutee']
    },
    'd3-demo-seo': {
      slides: [
        { title: 'SEO Analyzer — Pratique', points: [
          'Analysez : URL, meta description, densite de mots-cles',
          'Score SEO base sur les bonnes pratiques Google 2026',
          'Recommandations actionnables pour ameliorer chaque element'
        ], exercise: 'Analysez 3 pages differentes avec le SEO Analyzer.' }
      ],
      keyTakeaways: ['Un bon SEO on-page est la fondation de toute strategie de visibilite']
    },
    'd3-abtest': {
      slides: [
        { title: 'A/B Testing Automatise par IA', points: [
          'A/B testing classique : 2 variantes, 50/50 traffic, mesure statistique',
          'Bandit multi-bras : alloue plus de traffic a la variante gagnante en temps reel',
          'Elements a tester : CTA, titres, couleurs, images, prix, layout',
          'Outils : Google Optimize, VWO, Evolv AI, Eppo'
        ], exercise: 'Lancez une simulation A/B. Analysez les resultats et le niveau de confiance.' }
      ],
      keyTakeaways: ['Testez une seule variable a la fois pour des resultats fiables']
    },
    'd3-chatbot': {
      slides: [
        { title: 'Chatbots Marketing Conversationnels', points: [
          'Evolution : regle -> NLP -> LLM (chatbots IA generative)',
          'Cas d\'usage : qualification de leads, support client, recommandation produit',
          'Cles : persona clair, ton coherent avec la marque, escalation humaine',
          'Plateformes : Intercom Fin, Drift, Tidio AI, custom API'
        ], exercise: 'Testez le chatbot marketing. Evaluez la qualite des reponses.' }
      ],
      keyTakeaways: ['Un bon chatbot qualifie les leads et repond 24/7']
    },
    'd3-game-launch': {
      slides: [
        { title: 'Business Game — Lancement', points: [
          'Mission : creer une startup de A a Z avec l\'IA en 2 jours',
          'Phase 1 : Ideation & Etude de marche (ChatGPT/Perplexity)',
          'Phase 2 : Branding & Identite visuelle (Midjourney/Canva)',
          'Phase 3 : Campagne marketing (Copy.ai/ChatGPT)',
          'Phase 4 : Pitch & Presentation (HeyGen/Canva)'
        ], exercise: 'En equipe : brainstormez 5 idees, utilisez l\'IA pour evaluer le potentiel, selectionnez la meilleure.' }
      ],
      keyTakeaways: ['L\'IA accelere chaque phase mais la vision strategique reste humaine']
    },
    'd3-arena': {
      slides: [
        { title: 'Arena — Quiz & Battles', points: [
          'Quiz interactif : 15 questions, 15 secondes par question',
          'Themes : IA generative, marketing digital, outils, strategie, ethique',
          'Prompt Battles : affrontez un autre etudiant sur un brief commun',
          'Les points Arena comptent pour le classement general'
        ], exercise: 'Participez au quiz et aux battles dans l\'onglet Arena !' }
      ],
      keyTakeaways: ['La competition amicale accelere l\'apprentissage']
    },
    'd4-finalize': {
      slides: [
        { title: 'Sprint Final — Livrables', points: [
          'Finalisez TOUS les livrables du Business Game (12 au total)',
          'Verifiez la coherence globale : identite, message, visuels, ton',
          'Preparez vos preuves d\'utilisation de l\'IA (screenshots, prompts)',
          'Deadline : tout doit etre pret pour le pitch de l\'apres-midi'
        ], exercise: 'Checklist finale : passez en revue chaque livrable dans le Business Game.' }
      ],
      keyTakeaways: ['La qualite du pitch depend de la qualite des livrables']
    },
    'd4-demo-playground': {
      slides: [
        { title: 'Playground Libre', points: [
          'Explorez librement tous les outils IA vus pendant la formation',
          'Testez des cas d\'usage de votre propre secteur/entreprise',
          'Comparez les resultats entre differents outils',
          'Notez les prompts qui fonctionnent le mieux pour votre usage'
        ], exercise: 'Explorez les 6 demos et experimentez avec vos propres cas d\'usage.' }
      ],
      keyTakeaways: ['L\'experimentation libre est le meilleur moyen de trouver vos outils']
    },
    'd4-prep-pitch': {
      slides: [
        { title: 'Preparation du Pitch', points: [
          'Structure : Probleme > Solution > Marche > Demo > Equipe > Ask',
          'Duree : 5 min de presentation + 3 min de questions',
          'Montrez comment l\'IA a ete utilisee a chaque etape',
          'Conseil : repetez au moins 2 fois avant le passage'
        ], exercise: 'Preparez votre pitch en equipe. Designez un presentateur et repartissez les slides.' }
      ],
      keyTakeaways: ['Un bon pitch raconte une histoire, pas une liste de features']
    },
    'd4-pitch': {
      slides: [
        { title: 'Pitchs & Votes', points: [
          'Chaque equipe presente son projet devant la classe',
          'La classe vote sur : innovation, execution, utilisation IA, pitch',
          'Les votes determinent le classement final du Business Game',
          'Ecoutez activement : les feedbacks sont precieux'
        ] }
      ],
      keyTakeaways: ['Presentez avec conviction et montrez votre maitrise des outils IA']
    },
    'd4-awards': {
      slides: [
        { title: 'Ceremonie des Awards', points: [
          'Classement final base sur XP accumules + vote Business Game',
          'Awards speciaux : Meilleur Prompt, Meilleur Visuel, Meilleur Pitch, MVP',
          'Remise des badges et certificats de completion'
        ] }
      ],
      keyTakeaways: ['Chaque participant repart avec des competences concretes en IA marketing']
    },
    'd4-closing': {
      slides: [
        { title: 'Cloture & Perspectives', points: [
          'Bilan : en 4 jours, vous avez explore 9+ outils IA pour le marketing',
          'Competences : prompt engineering, creation visuelle, copywriting, strategie',
          'Pour aller plus loin : pratiquez quotidiennement, suivez l\'actualite IA',
          'Ressources : newsletters (The Rundown AI, Ben\'s Bites), communautes',
          'L\'IA evolue vite — restez curieux et experimentez'
        ] }
      ],
      keyTakeaways: ['L\'IA est un levier de productivite enorme', 'La competence IA sera un differentiant majeur sur le marche de l\'emploi']
    }
  };

  function renderActivityDetail(main, actId) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var activity = null, dayIdx = -1;
    ['day1','day2','day3','day4'].forEach(function(k, i) {
      var d = AIA.PROGRAM[k];
      d.matin.concat(d.aprem).forEach(function(a) { if (a.id === actId) { activity = a; dayIdx = i; } });
    });
    if (!activity) { main.innerHTML = '<p>Activite introuvable</p>'; return; }

    var content = COURSE_CONTENT[actId];
    var done = st.progress[actId];
    var icons = {cours:'📖',atelier:'🛠️',defi:'⚡',game:'🎮',demo:'🔬'};
    var status = AIA.getActivityStatus ? AIA.getActivityStatus(activity) : 'upcoming';

    var ref = AIA.getActivityRef ? AIA.getActivityRef(actId) : '';
    var countdown = AIA.getActivityCountdown ? AIA.getActivityCountdown(activity, dayIdx) : null;
    var timerBlock = countdown
      ? '<div class="activity-timer ' + countdown.css + '" data-timer-id="' + actId + '" data-timer-day="' + dayIdx + '" style="margin:0.5rem 0 1rem">' +
        '<div class="timer-label">' + countdown.label + '</div>' +
        (countdown.pct !== undefined ? '<div class="timer-progress"><div class="timer-progress-fill" style="width:' + countdown.pct + '%"></div></div>' : '') +
        '</div>' : '';

    var html = '<div class="page-header">' +
      '<a href="#" data-navigate="day' + (dayIdx+1) + '" class="back-link">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Jour ' + (dayIdx+1) + '</a>' +
      '<div class="activity-ref-row" style="margin-bottom:0.5rem">' +
        (ref ? '<span class="activity-ref">' + ref + '</span>' : '') +
        '<button class="activity-share-btn" onclick="window.AIA.copyActivityLink(\'' + actId + '\')">🔗 Copier le lien direct</button>' +
      '</div>' +
      '<h1>' + (icons[activity.type]||'📌') + ' <span class="gradient-text">' + activity.title + '</span></h1>' +
      '<p class="page-subtitle">' + AIA.CONFIG.dateLabels[dayIdx] + ' &bull; ' + activity.time + ' &bull; +' + activity.xp + ' XP</p></div>' +
      timerBlock;

    if (done) {
      html += '<div class="auto-badge done" style="display:inline-flex;margin-bottom:1rem">✓ Termine</div>';
    } else if (status === 'live') {
      html += '<div class="auto-badge live" style="display:inline-flex;margin-bottom:1rem">● EN DIRECT</div>';
    } else if (status === 'upcoming') {
      html += '<div class="auto-badge upcoming" style="display:inline-flex;margin-bottom:1rem">A venir</div>';
    }

    // Linked interactive elements (demos / game / arena / resources) for this activity
    if (activity.links && activity.links.length && AIA.renderActivityLinks) {
      html += '<div class="activity-detail-links glass-card">' +
        '<h4>🔗 Elements lies a cette session</h4>' +
        AIA.renderActivityLinks(activity.links, true) +
        '</div>';
    }

    // Videos du cours embarquees (modale au clic)
    if (AIA.renderActivityVideos) {
      html += AIA.renderActivityVideos(actId);
    }

    if (content && content.slides) {
      html += '<div class="course-content">';
      content.slides.forEach(function(slide, idx) {
        html += '<div class="course-slide glass-card"><h3>' + (idx + 1) + '. ' + slide.title + '</h3>';
        if (slide.points) {
          html += '<ul>';
          slide.points.forEach(function(p) { html += '<li>' + p + '</li>'; });
          html += '</ul>';
        }
        if (slide.exercise) {
          html += '<div class="course-exercise"><h4>Exercice pratique</h4><p>' + slide.exercise + '</p></div>';
        }
        html += '</div>';
      });
      if (content.keyTakeaways) {
        html += '<div class="course-takeaways glass-card"><h4>A retenir</h4><ul>';
        content.keyTakeaways.forEach(function(t) { html += '<li>' + t + '</li>'; });
        html += '</ul></div>';
      }
      html += '</div>';
    } else {
      html += '<div class="course-slide glass-card"><h3>Contenu</h3><p>' + activity.desc + '</p></div>';
    }

    /* --- Corrige formateur (visible UNIQUEMENT en vue formateur, cache aux etudiants) --- */
    if (AIA.isFormateurView && AIA.isFormateurView() && AIA.CORRIGES && AIA.CORRIGES.exercises) {
      var _esc = function (s) { return String(s == null ? '' : s).replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
      var _cor = AIA.CORRIGES.exercises[actId];
      var _cor2 = AIA.CORRIGES.exercises[actId + '-2'];
      if (_cor || _cor2) {
        html += '<div class="formateur-corrige glass-card" style="border-left:3px solid #2ecc71;background:rgba(46,204,113,0.06);margin-top:1rem">' +
          '<h4 style="color:#2ecc71">&#127891; Corrige formateur <span style="font-size:.72rem;color:var(--text-muted);font-weight:500">(visible par vous seul)</span></h4>' +
          (_cor ? '<p style="white-space:pre-line;font-size:.86rem;margin:.3rem 0">' + _esc(_cor) + '</p>' : '') +
          (_cor2 ? '<p style="white-space:pre-line;font-size:.86rem;margin:.3rem 0">' + _esc(_cor2) + '</p>' : '') +
          '</div>';
      }
    }

    /* --- Inline demo embed map (expanded) --- */
    var inlineDemoMap = {
      'd1-premier-prompt':'renderDemoPrompt', 'd1-prompt-avance':'renderDemoPrompt',
      'd2-demo-sentiment':'renderDemoSentiment', 'd2-visuel':'renderDemoImage',
      'd2-atelier-image':'renderDemoImage', 'd2-copywriting':'renderDemoChatbot',
      'd3-demo-seo':'renderDemoSEO', 'd3-abtest':'renderDemoABTest',
      'd3-chatbot':'renderDemoChatbot', 'd4-demo-playground':'renderDemoPrompt',
      'd1-defi':'renderDemoPrompt', 'd3-seo':'renderDemoSEO'
    };
    var inlineRenderer = inlineDemoMap[actId];
    if (inlineRenderer && AIA[inlineRenderer]) {
      html += '<div class="activity-demo-inline"><h4>&#128300; Atelier Pratique Interactif</h4>' +
        '<div id="inline-demo-target"></div></div>';
    }

    /* --- Exercise submission --- */
    var hasExercise = content && content.slides && content.slides.some(function(s){ return !!s.exercise; });
    if (hasExercise && !done) {
      html += '<div class="exercise-submission">' +
        '<h4>&#9999;&#65039; Soumettez votre travail</h4>' +
        '<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.8rem">Decrivez ce que vous avez fait, collez vos prompts ou vos resultats. Votre formateur pourra voir votre soumission.</p>' +
        '<textarea id="exercise-submission-text" placeholder="Collez vos prompts, resultats ou reflexions ici..."></textarea>' +
        '<button class="btn-submit" id="btn-submit-exercise">Soumettre mon travail</button></div>';
    }

    var reactions = st.reactions[actId] || {};
    html += '<div class="reactions-bar" style="margin-top:1.5rem;justify-content:center">';
    ['👍','❤️','🔥','💡','🤔'].forEach(function(em) {
      var cnt = reactions[em] || 0;
      var active = reactions['_my_' + em] ? ' active' : '';
      html += '<button class="reaction-btn' + active + '" onclick="window.AIA.toggleReaction(\'' + actId + '\',\'' + em + '\')">' + em + (cnt > 0 ? ' <span class="count">' + cnt + '</span>' : '') + '</button>';
    });
    html += '</div>';

    if (!done) {
      html += '<div style="margin-top:1.5rem;text-align:center">' +
        '<button class="btn-primary" onclick="window.AIA.completeActivity(\'' + actId + '\',' + activity.xp + ',\'' + activity.title.replace(/'/g, "\\'") + '\');window.AIA.navigateTo(\'activity-' + actId + '\')">Valider cette activite (+' + activity.xp + ' XP)</button></div>';
    }

    main.innerHTML = html;

    /* --- Render inline demo after DOM is set --- */
    if (inlineRenderer && AIA[inlineRenderer]) {
      var target = document.getElementById('inline-demo-target');
      if (target) AIA[inlineRenderer](target, true);
    }

    /* --- Wire exercise submission button --- */
    var submitBtn = document.getElementById('btn-submit-exercise');
    if (submitBtn) {
      submitBtn.addEventListener('click', function() {
        var textarea = document.getElementById('exercise-submission-text');
        var text = textarea ? textarea.value.trim() : '';
        if (!text) { AIA.showToast('Ecrivez quelque chose avant de soumettre', 'warning'); return; }
        if (AIA.submitActivity) {
          AIA.submitActivity(actId, { type: 'exercise-submission', text: text.substring(0, 2000) });
        }
        AIA.showToast('Travail soumis ! Votre formateur peut le voir.', 'success');
        submitBtn.textContent = 'Soumis !';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
      });
    }
  }

  window.AIA = window.AIA || {};
  window.AIA.renderActivityDetail = renderActivityDetail;
  window.AIA.COURSE_CONTENT = COURSE_CONTENT;
})();
