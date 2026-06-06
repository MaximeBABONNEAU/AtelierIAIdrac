/* ==============================================
   GAME.JS — Business Game (Campaign Builder)
   Product theme selection + Guided 4-phase workflow
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  /* ============ PRODUCT THEMES DATABASE ============ */
  var PRODUCT_THEMES = [
    { id: 'ecomush', name: 'EcoMush', emoji: '🍄', category: 'Food / Eco', tagline: 'Kits de culture de champignons bio',
      description: 'Kits domestiques pour cultiver des champignons gourmets bio en 14 jours. Eco-emballage compostable.',
      target: 'Urbains 25-40 ans, eco-conscients, fans de cuisine maison', price: '29-49 EUR', usp: 'Bio, ludique, pedagogique' },
    { id: 'neurofit', name: 'NeuroFit', emoji: '🧠', category: 'Health / Tech', tagline: 'App de meditation & neurofeedback',
      description: 'Application mobile qui combine meditation guidee, biofeedback cardiaque et exercices cognitifs.',
      target: 'Cadres stresses 30-50 ans, sportifs, professions a forte charge mentale', price: '12,99 EUR/mois', usp: 'Science + IA personnalisee' },
    { id: 'pawmatch', name: 'PawMatch', emoji: '🐾', category: 'Pets / Service', tagline: 'Concierge IA pour animaux',
      description: 'Service premium qui combine garde, soins, alimentation personnalisee et IA de detection comportementale.',
      target: 'Proprietaires d\'animaux CSP+, urbains 30-55 ans', price: '49 EUR/mois', usp: 'Sante predictive et concierge 24/7' },
    { id: 'verdoo', name: 'Verdoo', emoji: '🌱', category: 'Garden / Tech', tagline: 'Jardin connecte intelligent',
      description: 'Capteurs IoT + app qui transforme balcon ou terrasse en potager auto-gere. Recommandations IA.',
      target: 'Citadins 28-45 ans avec balcon, eco-conscients debutants', price: '149 EUR + 4,99/mois', usp: 'Zero perte, recoltes 365j/an' },
    { id: 'lumio', name: 'Lumio', emoji: '💡', category: 'Education / Kids', tagline: 'Plateforme d\'eveil enfants 6-12',
      description: 'Cours en ligne ludiques sur les sciences, l\'art et l\'IA — animes par des avatars personnalises.',
      target: 'Parents CSP+ avec enfants 6-12 ans, sensibles a l\'education alternative', price: '19,99 EUR/mois', usp: 'IA pedagogique adaptative' },
    { id: 'nomadcup', name: 'NomadCup', emoji: '☕', category: 'Food / Lifestyle', tagline: 'Cafe de specialite en kit nomade',
      description: 'Kit barista portable + cafe single-origin livre chaque mois. Pour digital nomads et voyageurs.',
      target: 'Telecommuteurs 25-40 ans, freelances, voyageurs', price: '24,90 EUR/mois', usp: 'Cafe haut de gamme partout' },
    { id: 'mythik', name: 'Mythik', emoji: '⚔️', category: 'Gaming / Tabletop', tagline: 'JdR narratif genere par IA',
      description: 'Jeu de role en boite avec une IA qui genere quetes, PNJs et histoires uniques a chaque partie.',
      target: 'Geeks 18-35 ans, joueurs occasionnels, communautes Discord', price: '59 EUR + 9,99 EUR/extension', usp: 'Infinies aventures, jamais 2 fois la meme partie' },
    { id: 'zenra', name: 'Zenra', emoji: '🧘', category: 'Wellness / Cosmetic', tagline: 'Cosmetique adaptogenique',
      description: 'Gamme de soins visage formules avec des plantes adaptogenes (ashwagandha, ginseng, rhodiola).',
      target: 'Femmes 28-50 ans, sensibles au naturel, anti-stress', price: '34-79 EUR', usp: 'Beaute holistique stress-tested' },
    { id: 'urbeat', name: 'Urbeat', emoji: '🎧', category: 'Lifestyle / Audio', tagline: 'Casque a annulation contextuelle',
      description: 'Casque audio premium avec IA contextuelle : laisse passer la voix d\'un proche, bloque tout le reste.',
      target: 'Cadres urbains 25-45 ans, parents, voyageurs', price: '349 EUR', usp: 'IA qui apprend votre entourage' },
    { id: 'kookoo', name: 'Kookoo', emoji: '🍔', category: 'Food / Quick', tagline: 'Robot de cuisine IA familial',
      description: 'Petit robot connecte qui propose des recettes en fonction du contenu du frigo (scan + IA).',
      target: 'Familles 30-45 ans, cuisiniers presses, anti-gaspi', price: '299 EUR + 6,99 EUR/mois', usp: 'Zero gaspillage, recettes hyper-personnalisees' },
    { id: 'orbi', name: 'Orbi', emoji: '🪐', category: 'Travel / Tech', tagline: 'Travel planner IA premium',
      description: 'App qui planifie des voyages sur-mesure (vols + hotels + activites) selon votre profil et budget.',
      target: 'Voyageurs CSP+ 30-55 ans, couples, familles', price: '12,99 EUR/mois ou 1% du budget voyage', usp: 'Voyages sur-mesure en 5 minutes' },
    { id: 'fablab', name: 'FabLab Home', emoji: '🛠️', category: 'DIY / Tech', tagline: 'Mini-imprimante 3D salon',
      description: 'Imprimante 3D ultra-compacte + app IA qui transforme une photo en modele 3D imprimable.',
      target: 'Geeks creatifs 25-50 ans, parents, makers debutants', price: '249 EUR + 19 EUR/mois (filaments)', usp: 'Imprimer une idee en 5 minutes' },
    { id: 'glowup', name: 'GlowUp', emoji: '✨', category: 'Cosmetic / GenZ', tagline: 'Skincare Gen Z personnalise',
      description: 'Routine skincare creee par IA a partir d\'un selfie + questionnaire. Livre tous les 2 mois.',
      target: 'Gen Z 16-25 ans, sensibles aux reseaux sociaux', price: '29,90 EUR/box bimestrielle', usp: 'Diagnostic IA + ingredients K-Beauty' },
    { id: 'kintech', name: 'Kintech', emoji: '👨‍👩‍👧', category: 'FamTech / IoT', tagline: 'Hub familial intelligent',
      description: 'Ecran connecte salon qui centralise calendrier famille, courses, IA conversationnelle pour les enfants.',
      target: 'Familles avec enfants 4-15 ans, classes moyennes/sup', price: '249 EUR + 7,99 EUR/mois', usp: 'L\'IA familiale qui simplifie la vie' },
    { id: 'sportia', name: 'SportIA', emoji: '⚽', category: 'Sport / Coach', tagline: 'Coach sportif IA video',
      description: 'App qui analyse vos mouvements en video (squat, course, yoga) et donne des feedbacks en temps reel.',
      target: 'Sportifs amateurs 20-45 ans, debutants au gym', price: '14,99 EUR/mois', usp: 'Coach 24/7 a prix abordable' },
    { id: 'biblio', name: 'Bibliophil', emoji: '📚', category: 'Books / Subscription', tagline: 'Box livres curatee par IA',
      description: '2 livres/mois selectionnes par IA selon vos lectures passees + journal de lecture papier.',
      target: 'Lecteurs 25-55 ans, curieux, cadeaux', price: '32 EUR/mois', usp: 'Recommendations ultra-personnalisees + bel objet' },
    { id: 'cleanwave', name: 'CleanWave', emoji: '🧼', category: 'Home / Eco', tagline: 'Produits menagers en recharge solide',
      description: 'Recharges concentrees solides (lessive, vaisselle, sol) a diluer chez soi. Zero plastique jetable.',
      target: 'Familles eco-conscientes 28-50 ans', price: '14-24 EUR / kit', usp: 'Zero plastique, -80% transport' },
    { id: 'doxa', name: 'Doxa', emoji: '🎓', category: 'EdTech / Adult', tagline: 'MicroMasters IA pour cadres',
      description: 'Parcours certifiants 8 semaines sur IA appliquee a un metier (HR, marketing, finance) avec mentors humains.',
      target: 'Cadres 30-55 ans en reskilling, RH d\'entreprise', price: '890 EUR / programme', usp: 'IA + mentor humain, certif reconnue' },
    { id: 'gigogne', name: 'Gigogne', emoji: '🛋️', category: 'Furniture / DTC', tagline: 'Mobilier modulaire studios',
      description: 'Meubles transformables (canape-lit-bureau-rangement) pour petits espaces urbains. Livraison plat.',
      target: 'Citadins 25-40 ans, studios <40m2', price: '299-799 EUR', usp: 'Un meuble = 4 fonctions, design francais' },
    { id: 'plouf', name: 'Plouf', emoji: '🏊', category: 'Sport / Leisure', tagline: 'Piscines partagees a la demande',
      description: 'Marketplace pour louer la piscine d\'un particulier a l\'heure. Type Airbnb mais pour piscines.',
      target: 'Familles citadines, etudiants, ete', price: '15-40 EUR / heure', usp: 'Locale, abordable, communautaire' },
    { id: 'mirage', name: 'Mirage', emoji: '🕶️', category: 'AR / Tech', tagline: 'Lunettes AR for everyday life',
      description: 'Lunettes AR fines proposant traduction live, prompteur invisible, navigation, sous-titres reels.',
      target: 'Early adopters tech 25-45 ans', price: '599 EUR + 9,99/mois', usp: 'Style + utilite, pas un casque VR' },
    { id: 'roots', name: 'Roots', emoji: '🌳', category: 'Travel / Slow', tagline: 'Sejours nature regeneratifs',
      description: 'Week-ends en ecolodges chez agriculteurs, ferme bio, randonnees guidees. Anti-overtourisme.',
      target: 'Cadres urbains stresses 30-55 ans', price: '290-650 EUR / week-end', usp: 'Deconnexion totale, soutien rural' },
    { id: 'caretag', name: 'CareTag', emoji: '⛑️', category: 'Health / IoT', tagline: 'Bracelet medical urgence IA',
      description: 'Bracelet qui detecte chute / malaise / desorientation chez les seniors et alerte famille + secours.',
      target: 'Seniors 70+, leurs enfants (acheteurs)', price: '129 EUR + 19/mois', usp: 'Detection IA + reseau famille' },
    { id: 'verba', name: 'Verba', emoji: '🗣️', category: 'EdTech / Language', tagline: 'App langues conversationnelle IA',
      description: 'Apprenez une langue en discutant avec une IA qui s\'adapte a votre niveau et corrige en live.',
      target: 'Pros 20-45 ans, business travel, expats', price: '14,99 EUR/mois', usp: 'Conversations realistes, pas du Duolingo' },
    { id: 'frugy', name: 'Frugy', emoji: '🍅', category: 'Food / B2B', tagline: 'Bourse anti-gaspi pour restos',
      description: 'Plateforme B2B qui vend les invendus de gros (-50%) entre producteurs / grossistes / restos.',
      target: 'Restaurateurs, traiteurs, cantines', price: 'Commission 7%', usp: 'Marge + anti-gaspi (loi AGEC)' },
    { id: 'auralis', name: 'Auralis', emoji: '🌙', category: 'Wellness / Sleep', tagline: 'Casque sommeil + IA bien-etre',
      description: 'Bandeau ultra-fin avec biofeedback EEG qui induit le sommeil + meditation guidee personnalisee.',
      target: 'Insomniaques 30-55 ans, cadres', price: '299 EUR + 9,99/mois', usp: 'Scientifique, lifestyle, design' },
    { id: 'crayon', name: 'Crayon Studio', emoji: '✏️', category: 'Design / SaaS', tagline: 'Outil de design IA pour PME',
      description: 'Web app qui genere logos, mockups, presentations, cartes de visite a partir d\'un brief court.',
      target: 'TPE/PME 1-20 employes, freelances', price: '19,99 EUR/mois', usp: 'Pas de DA, pas de Photoshop' },
    { id: 'odyssee', name: 'Odyssee', emoji: '🎮', category: 'Gaming / VR', tagline: 'Escape games VR a domicile',
      description: 'Cartouches escape games VR de 60 min livrees a domicile. Marche avec n\'importe quel casque.',
      target: 'Geeks 18-40 ans, amateurs jeux de societe', price: '24,90 EUR / scenario', usp: 'Immersif sans deplacement' },
    { id: 'pottee', name: 'Pottee', emoji: '🪴', category: 'Plants / Service', tagline: 'Plantes en location & soin',
      description: 'Plantes en location : livraison, rempotage, remplacement des mortes inclus.',
      target: 'Urbains 28-45 ans, anti-cycle d\'achat', price: '9-29 EUR/mois selon plante', usp: 'Jamais sans plante' },
    { id: 'pixelpup', name: 'PixelPup', emoji: '🐕', category: 'Pets / SaaS', tagline: 'Portrait IA de votre chien',
      description: 'Service en ligne qui transforme la photo de votre animal en portrait artistique IA (pop art, peinture, manga).',
      target: 'Proprietaires d\'animaux 25-55 ans, cadeaux', price: '19-49 EUR / portrait', usp: 'Souvenir personnalise haut de gamme' }
  ];

  /* ============ PHASES STRUCTURE (Guided Workflow) ============ */
  var PHASES_GUIDE = {
    phase1: {
      title: 'Phase 1 : Ideation & Marche',
      icon: '💡',
      color: 'cyan',
      desc: 'Validez votre idee produit, definissez votre persona cible et analysez le marche',
      steps: [
        {
          id: 'product-idea',
          title: 'Concept produit affine',
          desc: 'Reformulez le concept dans VOS mots, ajoutez votre touche unique',
          aiTool: 'ChatGPT / Claude',
          prompt: 'En tant que strategiste produit, aide-moi a affiner le concept "{theme}" pour le distinguer de la concurrence. Donne 3 axes de differenciation et un pitch elevator de 30 secondes.',
          fields: [
            { name: 'description', label: 'Description produit (50-100 mots)', rows: 4, placeholder: 'Decrivez le produit, sa promesse principale et ce qui le rend unique...' },
            { name: 'differentiation', label: 'Axes de differenciation (3 points)', rows: 3, placeholder: '1. ...\n2. ...\n3. ...' }
          ]
        },
        {
          id: 'target-persona',
          title: 'Persona cible detaille',
          desc: 'Creez un buyer persona ultra-precis (1 a 2 personas max)',
          aiTool: 'ChatGPT + DALL-E (portrait)',
          prompt: 'Cree un persona detaille pour "{theme}". Format : Nom, age, profession, hobbies, freins d\'achat, motivations d\'achat, ou il s\'informe, citations type. Sois realiste et precis.',
          fields: [
            { name: 'personaName', label: 'Nom & age du persona', placeholder: 'Ex: Sarah, 32 ans' },
            { name: 'personaProfil', label: 'Profil et habitudes', rows: 3, placeholder: 'Profession, lieu de vie, hobbies, comportement d\'achat...' },
            { name: 'personaMotivations', label: 'Motivations et freins', rows: 3, placeholder: 'Ce qui pousse a acheter / ce qui bloque...' }
          ]
        },
        {
          id: 'market-analysis',
          title: 'Analyse marche (concurrence + tendances)',
          desc: 'Identifiez 3 concurrents, leurs forces/faiblesses et les tendances cles',
          aiTool: 'Perplexity / ChatGPT',
          prompt: 'Analyse le marche de "{theme}" en France. Donne 3 concurrents principaux avec leurs forces et faiblesses. Quelles sont les 3 tendances cles a surfer ?',
          fields: [
            { name: 'competitors', label: 'Top 3 concurrents (forces + faiblesses)', rows: 4, placeholder: '1. Marque X — Forces : ... / Faiblesses : ...\n2. ...\n3. ...' },
            { name: 'trends', label: '3 tendances marche a exploiter', rows: 3, placeholder: '1. ...\n2. ...\n3. ...' },
            { name: 'positioning', label: 'Notre positionnement (1 phrase)', placeholder: 'Ex: "Le seul kit de champignons 100% francais, certifie bio et livre sous 24h"' }
          ]
        }
      ]
    },
    phase2: {
      title: 'Phase 2 : Branding & Identite',
      icon: '🎨',
      color: 'purple',
      desc: 'Creez le nom, le logo et la charte graphique de votre marque',
      steps: [
        {
          id: 'brand-name',
          title: 'Nom de marque & baseline',
          desc: 'Generez 10 noms candidats avec l\'IA, gardez le meilleur + une baseline',
          aiTool: 'ChatGPT / Claude / Namelix',
          prompt: 'Genere 10 noms de marque memorables pour "{theme}". Criteres : court (2-3 syllabes), facile a prononcer, evocateur, domaine .com plausible. Pour chaque nom, donne le sens evoque et une baseline en 5 mots max.',
          fields: [
            { name: 'finalName', label: 'Nom final choisi', placeholder: 'Ex: MushiBox' },
            { name: 'baseline', label: 'Baseline / slogan court (5-8 mots)', placeholder: 'Ex: "Cultivez vos saveurs en 14 jours"' },
            { name: 'nameRationale', label: 'Pourquoi ce nom ?', rows: 2, placeholder: 'Justifiez votre choix...' }
          ]
        },
        {
          id: 'logo',
          title: 'Logo & univers visuel',
          desc: 'Generez votre logo avec Midjourney/DALL-E et definissez la palette',
          aiTool: 'Midjourney / DALL-E / Canva',
          prompt: 'Logo design for "{theme}" brand. Modern, minimal, [3 mots cles]. Style : flat design, vector, single color on white. --ar 1:1 --v 6',
          fields: [
            { name: 'logoPrompt', label: 'Prompt Midjourney/DALL-E utilise', rows: 3, placeholder: 'Collez votre prompt final ici...' },
            { name: 'palette', label: 'Palette de couleurs (3-5 hex)', placeholder: 'Ex: #2D5F3F, #F4E5BC, #D4624A' },
            { name: 'typography', label: 'Typographie principale', placeholder: 'Ex: Montserrat Bold pour titres, Open Sans pour texte' }
          ]
        },
        {
          id: 'brand-guide',
          title: 'Tone of voice & charte',
          desc: 'Definissez le ton, les valeurs et les do/don\'t de communication',
          aiTool: 'ChatGPT',
          prompt: 'Cree une charte de tone of voice pour "{theme}". Format : 3 valeurs cles, 5 adjectifs de ton, 5 mots "yes", 5 mots "no", exemple de phrase type.',
          fields: [
            { name: 'values', label: '3 valeurs de marque', rows: 2, placeholder: '1. ... 2. ... 3. ...' },
            { name: 'tone', label: 'Tone of voice (5 adjectifs)', placeholder: 'Ex: convivial, expert, optimiste, ludique, premium' },
            { name: 'doDont', label: 'Mots a utiliser / a eviter', rows: 3, placeholder: 'YES : ... / NO : ...' }
          ]
        }
      ]
    },
    phase3: {
      title: 'Phase 3 : Campagne Marketing',
      icon: '📢',
      color: 'gold',
      desc: 'Creez les visuels publicitaires, les textes et le plan media',
      steps: [
        {
          id: 'ad-visuals',
          title: 'Visuels publicitaires (3 formats)',
          desc: 'Generez 3 visuels pour Instagram, LinkedIn et display avec l\'IA',
          aiTool: 'Midjourney / DALL-E / Adobe Firefly',
          prompt: 'Hero shot for "{theme}" campaign. [Persona] using product in [lieu/contexte]. Mood : [3 adjectifs]. Photography style, natural light, --ar 4:5 (Instagram) / --ar 16:9 (LinkedIn) / --ar 1.91:1 (Display)',
          fields: [
            { name: 'visualConcept', label: 'Concept creatif central', rows: 2, placeholder: 'Quelle scene, quelle emotion, quel message principal...' },
            { name: 'visualPrompt', label: 'Prompts utilises (3 formats)', rows: 4, placeholder: '1. Instagram : ...\n2. LinkedIn : ...\n3. Display : ...' }
          ]
        },
        {
          id: 'copy',
          title: 'Textes marketing (headlines + body)',
          desc: 'Redigez 3 accroches + texte d\'annonce + CTAs',
          aiTool: 'Copy.ai / ChatGPT / Jasper',
          prompt: 'Redige 3 headlines accrocheuses pour "{theme}" (cible : [persona]). Pour chaque headline, propose 1 body copy de 50 mots et 2 CTAs. Ton : [adjectifs charte].',
          fields: [
            { name: 'headlines', label: '3 headlines candidates', rows: 4, placeholder: '1. ...\n2. ...\n3. ...' },
            { name: 'bodyCopy', label: 'Texte d\'annonce principal (50-80 mots)', rows: 4, placeholder: 'Le corps de votre annonce...' },
            { name: 'ctas', label: 'Call-to-action principal & secondaire', placeholder: 'Ex: "Commander maintenant" / "En savoir plus"' }
          ]
        },
        {
          id: 'media-plan',
          title: 'Plan media & budget',
          desc: 'Definissez canaux, budget, KPIs et timing',
          aiTool: 'ChatGPT (raisonnement) + Meta Ads Library',
          prompt: 'Construis un plan media pour le lancement de "{theme}" avec un budget de 10 000 EUR. Repartis sur Meta Ads, Google Ads, Influencer, Email. Donne objectifs et KPIs.',
          fields: [
            { name: 'channels', label: 'Canaux & repartition budget', rows: 4, placeholder: 'Meta Ads : 4000 EUR (40%) — Objectif ...\nGoogle Ads : 3000 EUR (30%) — ...\nInfluencer : 2000 EUR (20%) — ...\nEmail : 1000 EUR (10%) — ...' },
            { name: 'kpis', label: 'KPIs cibles', rows: 2, placeholder: 'Ex: 500k impressions, CPM < 8 EUR, 3000 clics, 80 conversions, ROAS > 2.5' },
            { name: 'timing', label: 'Calendrier (4-6 semaines)', rows: 2, placeholder: 'S1 : teasing / S2-3 : launch peak / S4-5 : retargeting / S6 : repush + UGC' }
          ]
        }
      ]
    },
    phase4: {
      title: 'Phase 4 : Pitch & Lancement',
      icon: '🚀',
      color: 'pink',
      desc: 'Construisez landing page, video pitch et deck final',
      steps: [
        {
          id: 'landing-page',
          title: 'Landing page mockup',
          desc: 'Designez la landing page (structure + wireframe + sections)',
          aiTool: 'Figma + ChatGPT (copy)',
          prompt: 'Structure d\'une landing page haute conversion pour "{theme}". Liste les sections (hero, social proof, features, pricing, FAQ, CTA final) avec contenu suggere pour chacune.',
          fields: [
            { name: 'lpStructure', label: 'Structure de la page (sections)', rows: 5, placeholder: '1. Hero : headline + visuel + CTA\n2. Social proof : 3 logos clients\n3. Features : 3 colonnes\n4. Pricing : 2-3 plans\n5. FAQ : 6 questions\n6. CTA final' },
            { name: 'lpUrl', label: 'URL ou lien Figma (optionnel)', placeholder: 'https://figma.com/...' }
          ]
        },
        {
          id: 'pitch-video',
          title: 'Video pitch (60-90 sec)',
          desc: 'Creez une video pitch avec HeyGen ou avatar IA',
          aiTool: 'HeyGen / Synthesia / ElevenLabs',
          prompt: 'Script video pitch 60 secondes pour "{theme}". Structure : hook 5s, probleme 15s, solution 20s, preuve 10s, CTA 10s. Ton conversationnel.',
          fields: [
            { name: 'videoScript', label: 'Script complet (8-10 phrases)', rows: 6, placeholder: 'HOOK : ...\nPROBLEME : ...\nSOLUTION : ...\nPREUVE : ...\nCTA : ...' },
            { name: 'videoUrl', label: 'URL de la video produite', placeholder: 'https://...' }
          ]
        },
        {
          id: 'final-deck',
          title: 'Deck de presentation finale',
          desc: 'Construisez le pitch deck en 10 slides max',
          aiTool: 'Gamma / Tome / PowerPoint + IA',
          prompt: 'Plan d\'un pitch deck en 10 slides pour "{theme}". Slides : couverture, probleme, solution, marche, produit, business model, traction, equipe, demande, contact.',
          fields: [
            { name: 'deckPlan', label: 'Plan des 10 slides', rows: 6, placeholder: '1. Couverture : ...\n2. Probleme : ...\n3. Solution : ...\n...\n10. Contact : ...' },
            { name: 'deckUrl', label: 'URL du deck final', placeholder: 'https://gamma.app/...' }
          ]
        }
      ]
    }
  };

  /* ============ THEME SELECTION (At Registration) ============ */
  function pickRandomThemes(n) {
    var pool = PRODUCT_THEMES.slice();
    var picks = [];
    for (var i = 0; i < n && pool.length > 0; i++) {
      var idx = Math.floor(Math.random() * pool.length);
      picks.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return picks;
  }

  function showThemeSelection(onConfirm) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var choices = st.themeChoices && st.themeChoices.length === 3 ? st.themeChoices : pickRandomThemes(3);

    st.themeChoices = choices;
    if (AIA.saveState) AIA.saveState();

    var existing = document.querySelector('.theme-selection-overlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.className = 'theme-selection-overlay';
    overlay.innerHTML =
      '<div class="theme-selection-modal">' +
      '<h2>🎯 Choisissez votre projet d\'atelier</h2>' +
      '<p class="theme-selection-subtitle">3 produits fictifs ont ete generes au hasard. Choisissez celui que vous voulez transformer en campagne marketing complete pendant l\'atelier. <strong>Ce choix est definitif</strong>.</p>' +
      '<div class="theme-choices">' +
      choices.map(function (t) {
        return '<div class="theme-choice-card" data-theme-id="' + t.id + '">' +
          '<div class="theme-emoji">' + t.emoji + '</div>' +
          '<div class="theme-category">' + t.category + '</div>' +
          '<h3>' + t.name + '</h3>' +
          '<p class="theme-tagline">' + t.tagline + '</p>' +
          '<p class="theme-desc">' + t.description + '</p>' +
          '<div class="theme-meta">' +
          '<div><strong>Cible :</strong> ' + t.target + '</div>' +
          '<div><strong>Prix :</strong> ' + t.price + '</div>' +
          '<div><strong>USP :</strong> ' + t.usp + '</div>' +
          '</div>' +
          '<button class="btn-primary btn-choose-theme">Je choisis ' + t.name + '</button>' +
          '</div>';
      }).join('') +
      '</div>' +
      '<p class="theme-selection-hint">💡 Astuce : choisissez celui qui vous inspire le plus — vous allez y passer 4 jours !</p>' +
      '</div>';

    document.body.appendChild(overlay);

    overlay.querySelectorAll('.btn-choose-theme').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.theme-choice-card');
        var id = card.getAttribute('data-theme-id');
        var theme = PRODUCT_THEMES.find(function (t) { return t.id === id; });
        if (!theme) return;
        if (!confirm('Confirmer le choix : ' + theme.name + ' ? Ce choix sera definitif pour tout l\'atelier.')) return;
        st.productTheme = theme;
        st.campaignData = st.campaignData || {};
        if (AIA.saveState) AIA.saveState();
        overlay.remove();
        AIA.showToast('Projet choisi : ' + theme.name + ' ' + theme.emoji + ' — bonne campagne !', 'success');
        try { if (AIA.pushFeed) AIA.pushFeed({ action: 'theme-picked', target: theme.name + ' ' + (theme.emoji || '') }); } catch (e) {}
        _guideFirstStep = true; // declenche le guidage vers la 1ere etape au prochain rendu
        if (typeof onConfirm === 'function') onConfirm(theme);
      });
    });
  }

  /* ============ TIMING CONTEXT (where the cohort should be NOW) ============ */
  // Maps current day/session to recommended phase + demos
  var TIMING_MAP = {
    1: {
      matin: { phase: 'phase1', step: 'product-idea', label: 'Fondations IA + Ideation produit', demos: ['demo-prompt', 'demo-chatbot'] },
      aprem: { phase: 'phase1', step: 'target-persona', label: 'Personas & analyse marche', demos: ['demo-chatbot', 'demo-vqa'] }
    },
    2: {
      matin: { phase: 'phase2', step: 'brand-name', label: 'Branding : nom de marque', demos: ['demo-chatbot', 'demo-prompt'] },
      aprem: { phase: 'phase2', step: 'logo', label: 'Identite visuelle : logo & palette', demos: ['demo-image', 'demo-bg-remove'] }
    },
    3: {
      matin: { phase: 'phase3', step: 'ad-visuals', label: 'Visuels publicitaires', demos: ['demo-image', 'demo-bg-remove'] },
      aprem: { phase: 'phase3', step: 'copy', label: 'Copywriting & plan media', demos: ['demo-chatbot', 'demo-music', 'demo-tts', 'demo-abtest'] }
    },
    4: {
      matin: { phase: 'phase4', step: 'landing-page', label: 'Landing page & SEO', demos: ['demo-seo', 'demo-image'] },
      aprem: { phase: 'phase4', step: 'pitch-video', label: 'Pitch video + deck final', demos: ['demo-tts', 'demo-speech'] }
    }
  };

  function getCurrentTiming() {
    var AIA = window.AIA;
    var CFG = AIA.CONFIG;
    if (!CFG || !CFG.dates) return null;
    var today = new Date().toISOString().split('T')[0];
    var dayIdx = CFG.dates.indexOf(today);
    if (dayIdx === -1) {
      // Use simulated current day (first date or based on now)
      var now = new Date();
      var firstDate = new Date(CFG.dates[0] + 'T00:00:00');
      if (now < firstDate) return { dayNum: 1, session: 'matin', isUpcoming: true };
      // After course: stay on day 4
      return { dayNum: 4, session: 'aprem', isPast: true };
    }
    var hour = new Date().getHours();
    var session = hour < 13 ? 'matin' : 'aprem';
    return { dayNum: dayIdx + 1, session: session };
  }

  function renderTimingWidget() {
    var t = getCurrentTiming();
    if (!t) return '';
    var ctx = TIMING_MAP[t.dayNum] && TIMING_MAP[t.dayNum][t.session];
    if (!ctx) return '';
    var st = window.AIA.getState();
    var phase = PHASES_GUIDE[ctx.phase];
    var step = phase ? phase.steps.find(function (s) { return s.id === ctx.step; }) : null;
    var stepDone = st.gameDeliverables && st.gameDeliverables[ctx.step];
    var DEMOS_META = {
      'demo-prompt': { icon: '✍️', title: 'Prompt Playground' },
      'demo-chatbot': { icon: '💬', title: 'Chatbot Marketing' },
      'demo-vqa': { icon: '👁️', title: 'Analyse Visuelle' },
      'demo-image': { icon: '🎨', title: 'Generation Images' },
      'demo-bg-remove': { icon: '🖼️', title: 'Suppression de Fond' },
      'demo-music': { icon: '🎵', title: 'Generation Musicale' },
      'demo-tts': { icon: '🗣️', title: 'Voix Off IA' },
      'demo-speech': { icon: '🎙️', title: 'Transcription Vocale' },
      'demo-abtest': { icon: '📊', title: 'A/B Testing' },
      'demo-seo': { icon: '🔍', title: 'SEO Analyzer' },
      'demo-sentiment': { icon: '😊', title: 'Sentiment' }
    };
    var sessionLabel = t.session === 'matin' ? '☀️ Matin' : '🌙 Apres-midi';
    var statusBadge = t.isUpcoming ? '<span class="timing-badge upcoming">Atelier a venir</span>'
      : t.isPast ? '<span class="timing-badge past">Atelier termine</span>'
      : '<span class="timing-badge now">EN COURS</span>';
    return '<div class="timing-widget glass-card">' +
      '<div class="timing-header">' +
      '<div class="timing-pulse"></div>' +
      '<div class="timing-title">📍 Vous etes ici : <strong>Jour ' + t.dayNum + ' &bull; ' + sessionLabel + '</strong></div>' +
      statusBadge +
      '</div>' +
      '<div class="timing-context">' +
      '<div class="timing-context-label">' + ctx.label + '</div>' +
      (step ? '<div class="timing-suggested-step ' + (stepDone ? 'done' : '') + '">' +
        '<span class="timing-step-icon">' + (stepDone ? '✅' : '🎯') + '</span>' +
        '<div class="timing-step-info">' +
        '<div class="timing-step-label">Etape suggeree maintenant :</div>' +
        '<div class="timing-step-name">' + step.title + (stepDone ? ' (deja validee !)' : '') + '</div>' +
        '</div>' +
        '<button class="btn-primary btn-sm timing-step-cta" data-jump-step="' + ctx.step + '">' + (stepDone ? 'Revoir' : 'Demarrer →') + '</button>' +
        '</div>' : '') +
      '<div class="timing-demos">' +
      '<div class="timing-demos-label">🛠️ Demos IA recommandees pour cette session :</div>' +
      '<div class="timing-demos-list">' +
      ctx.demos.map(function (did) {
        var meta = DEMOS_META[did] || { icon: '🤖', title: did };
        var doneDemo = st.demosCompleted && st.demosCompleted.indexOf(did) !== -1;
        return '<a href="#" class="timing-demo-chip" data-navigate="' + did + '">' +
          '<span class="timing-demo-icon">' + meta.icon + '</span>' +
          '<span>' + meta.title + (doneDemo ? ' ✓' : '') + '</span>' +
          '</a>';
      }).join('') +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  /* ============ ENHANCED BUSINESS GAME PAGE ============ */
  var _suggestNextStepId = null, _justCompletedTitle = '', _guideFirstStep = false;
  function highlightStepCard(main, stepId, focusField) {
    var card = main.querySelector('.game-step-card[data-step-id="' + stepId + '"]');
    if (!card) return;
    var body = card.querySelector('.game-step-body');
    if (body) body.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.transition = 'box-shadow 0.5s';
    card.style.boxShadow = '0 0 30px rgba(245,183,49,0.6)';
    setTimeout(function () { card.style.boxShadow = ''; }, 2000);
    if (focusField) { var ta = card.querySelector('textarea, input'); if (ta) { try { ta.focus(); } catch (e) {} } }
  }
  function isPhaseUnlocked(pk) { var AIA = window.AIA; return !AIA.isItemUnlocked || AIA.isItemUnlocked('phases', pk); }
  function orderedSteps(unlockedOnly) {
    var arr = [];
    Object.keys(PHASES_GUIDE).forEach(function (pk) {
      if (unlockedOnly && !isPhaseUnlocked(pk)) return;
      PHASES_GUIDE[pk].steps.forEach(function (s) { arr.push(s); });
    });
    return arr;
  }
  function hasLockedPhases() {
    return Object.keys(PHASES_GUIDE).some(function (pk) { return !isPhaseUnlocked(pk); });
  }

  /* ===== Auto-evaluation d'une brique (reponse IA collee) — 0-100 ===== */
  function scoreBrick(step, data) {
    data = data || {};
    var fields = (step && step.fields) || [];
    var total = fields.length || 1;
    var filled = 0, allText = '';
    fields.forEach(function (f) { var v = (data[f.name] || '').trim(); if (v) filled++; allText += ' ' + v; });
    allText = allText.trim();
    var s = 0;
    s += Math.round((filled / total) * 40);                                  // completude : 0-40
    var words = allText ? allText.split(/\s+/).length : 0;
    s += words >= 120 ? 25 : words >= 70 ? 18 : words >= 35 ? 12 : words >= 15 ? 6 : 0; // longueur : 0-25
    var struct = 0;
    if (/\n/.test(allText)) struct += 5;
    if (/(^|\n)\s*(\d+[\.\)]|[-•*])/.test(allText)) struct += 5;
    if (allText.indexOf(':') !== -1) struct += 5;
    s += Math.min(struct, 15);                                               // structure : 0-15
    var nums = (allText.match(/\d+/g) || []).length;
    s += Math.min(nums * 4, 20);                                             // specificite : 0-20
    return Math.max(0, Math.min(100, s));
  }
  function scoreClass(score) { return score >= 80 ? 'sc-a' : score >= 60 ? 'sc-b' : score >= 40 ? 'sc-c' : 'sc-d'; }
  function brickBonus(score) { return score >= 80 ? 15 : score >= 60 ? 10 : score >= 40 ? 5 : 0; }
  // Feedback non bloquant (boucle d'iteration) : score actuel + conseils concrets, sans verrouiller.
  function gameBrickTips(step, data) {
    data = data || {}; var fields = (step && step.fields) || []; var tips = [], allText = '';
    fields.forEach(function (f) { var v = (data[f.name] || '').trim(); if (!v) tips.push('Remplir le champ : ' + f.label); allText += ' ' + v; });
    allText = allText.trim(); var words = allText ? allText.split(/\s+/).length : 0;
    if (words < 70) tips.push('Developper davantage (viser 120+ mots, actuellement ' + words + ').');
    if (!/\n/.test(allText) && !/(\d+[\.\)]|[-•*])/.test(allText)) tips.push('Structurer avec des listes ou des sauts de ligne.');
    if ((allText.match(/\d+/g) || []).length < 3) tips.push('Ajouter des chiffres concrets (prix, %, KPIs, dates).');
    if (allText.indexOf(':') === -1) tips.push('Utiliser des libelles (ex. "Objectif : ...").');
    return { score: scoreBrick(step, data), tips: tips };
  }
  function renderBusinessGame(main) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var theme = st.productTheme;

    if (!theme) {
      main.innerHTML = '<div class="page-header"><h1>Business <span class="gradient-text">Game</span></h1>' +
        '<p class="page-subtitle">Construisez la campagne marketing d\'un produit fictif en 4 phases</p></div>' +
        '<div class="glass-card" style="text-align:center;padding:3rem">' +
        '<div style="font-size:3rem;margin-bottom:1rem">🎯</div>' +
        '<h3>Vous n\'avez pas encore choisi votre projet</h3>' +
        '<p style="color:var(--text-muted);margin-bottom:1.5rem">Selectionnez 1 produit fictif parmi 3 propositions generees au hasard. Ce produit sera votre fil rouge pendant les 4 jours.</p>' +
        '<button class="btn-primary" id="btn-pick-theme">🎲 Choisir mon projet</button>' +
        '</div>';
      var btn = document.getElementById('btn-pick-theme');
      if (btn) btn.addEventListener('click', function () { showThemeSelection(function () { renderBusinessGame(main); }); });
      return;
    }

    st.campaignData = st.campaignData || {};
    st.gameDeliverables = st.gameDeliverables || {};

    var allSteps = 0, doneSteps = 0;
    Object.keys(PHASES_GUIDE).forEach(function (pk) {
      PHASES_GUIDE[pk].steps.forEach(function (s) {
        allSteps++;
        if (st.gameDeliverables[s.id]) doneSteps++;
      });
    });
    var globalPct = Math.round((doneSteps / allSteps) * 100);

    var html = renderTimingWidget() +
      '<div class="page-header">' +
      '<div class="game-header-banner">' +
      '<div class="game-theme-banner">' +
      '<div class="game-theme-emoji">' + theme.emoji + '</div>' +
      '<div class="game-theme-info">' +
      '<div class="game-theme-category">' + theme.category + ' &bull; Projet choisi</div>' +
      '<h1 class="game-theme-name">' + theme.name + '</h1>' +
      '<p class="game-theme-tagline">' + theme.tagline + '</p>' +
      '</div>' +
      '<div class="game-theme-progress-block">' +
      '<div class="game-theme-progress-num">' + globalPct + '%</div>' +
      '<div class="game-theme-progress-lbl">' + doneSteps + '/' + allSteps + ' etapes</div>' +
      '</div>' +
      '</div>' +
      '<div class="game-progress-master">' +
      '<div class="game-progress-fill" style="width:' + globalPct + '%"></div>' +
      '</div>' +
      '</div>' +
      '</div>';

    Object.keys(PHASES_GUIDE).forEach(function (pkey, pIdx) {
      var phase = PHASES_GUIDE[pkey];
      var doneInPhase = phase.steps.filter(function (s) { return st.gameDeliverables[s.id]; }).length;
      var phasePct = Math.round((doneInPhase / phase.steps.length) * 100);
      var phaseUnlocked = !AIA.isItemUnlocked || AIA.isItemUnlocked('phases', pkey);

      if (!phaseUnlocked) {
        html += '<div class="game-phase-card glass-card phase-color-' + phase.color + ' phase-locked">' +
          '<div class="game-phase-header">' +
          '<div class="game-phase-num">🔒</div>' +
          '<div class="game-phase-icon">' + phase.icon + '</div>' +
          '<div class="game-phase-title-block">' +
          '<h2>' + phase.title + '</h2>' +
          '<p style="color:var(--text-muted)">Phase verrouillee — l\'admin la debloquera pendant le cours.</p>' +
          '</div>' +
          '</div>' +
          '</div>';
        return;
      }

      html += '<div class="game-phase-card glass-card phase-color-' + phase.color + '">' +
        '<div class="game-phase-header">' +
        '<div class="game-phase-num">' + (pIdx + 1) + '</div>' +
        '<div class="game-phase-icon">' + phase.icon + '</div>' +
        '<div class="game-phase-title-block">' +
        '<h2>' + phase.title + '</h2>' +
        '<p>' + phase.desc + '</p>' +
        '</div>' +
        '<div class="game-phase-progress">' +
        '<div class="game-phase-pct">' + phasePct + '%</div>' +
        '<div class="game-phase-count">' + doneInPhase + '/' + phase.steps.length + '</div>' +
        '</div>' +
        '</div>' +
        '<div class="game-progress-bar"><div class="game-progress-fill" style="width:' + phasePct + '%"></div></div>' +
        '<div class="game-steps">' +
        phase.steps.map(function (step, sIdx) {
          var valInfo = st.gameValidation && st.gameValidation[step.id];
          var locked = !!(valInfo && valInfo.locked);
          var score = valInfo ? valInfo.score : null;
          var done = !!st.gameDeliverables[step.id];
          var data = st.campaignData[step.id] || {};
          var promptText = step.prompt.replace(/{theme}/g, theme.name + ' (' + theme.description + ')');
          var statusIcon = locked ? '🔒' : (done ? '✅' : '⬜');
          var scoreBadge = (locked && score != null) ? '<span class="game-step-scorebadge ' + scoreClass(score) + '">' + score + '/100</span>' : '';
          var headerHtml = '<div class="game-step-header">' +
            '<div class="game-step-checkbox">' + statusIcon + '</div>' +
            '<div class="game-step-title"><h4>Etape ' + (sIdx + 1) + ' : ' + step.title + '</h4><p>' + step.desc + '</p></div>' +
            scoreBadge +
            '<button class="btn-ghost btn-xs game-step-toggle" data-step-id="' + step.id + '">' + (locked ? 'Revoir' : (done ? 'Modifier' : 'Demarrer')) + '</button>' +
            '</div>';
          if (locked) {
            return '<div class="game-step-card locked" data-step-id="' + step.id + '">' + headerHtml +
              '<div class="game-step-body" style="display:none">' +
              '<div class="game-step-validated">🔒 <strong>Validee definitivement</strong> &bull; score ' + score + '/100. Pour corriger, demandez au formateur de rouvrir cette brique.</div>' +
              step.fields.map(function (f) {
                var v = data[f.name] || '';
                return '<div class="game-locked-field"><div class="game-locked-label">' + escapeHtml(f.label) + '</div>' +
                  '<div class="game-locked-val">' + (v ? escapeHtml(v).replace(/\n/g, '<br>') : '<em>(vide)</em>') + '</div></div>';
              }).join('') +
              renderAssetsBlock(step.id, data.assets || []) +
              '</div></div>';
          }
          return '<div class="game-step-card' + (done ? ' done' : '') + '" data-step-id="' + step.id + '">' + headerHtml +
            '<div class="game-step-body" style="display:' + (done ? 'none' : 'block') + '">' +
            '<div class="game-step-tool">🛠️ <strong>Outil suggere :</strong> ' + step.aiTool + '</div>' +
            '<details class="game-step-method"><summary>🧭 Methode guidee en 4 etapes</summary>' +
            '<ol class="game-method-list">' +
            '<li><strong>Recherche</strong> : reunis les infos cles sur ' + escapeHtml(theme.name) + ' (cible, concurrents, chiffres).</li>' +
            '<li><strong>Brouillon IA</strong> : copie le prompt ci-dessous dans ChatGPT/Claude et genere une 1ere version.</li>' +
            '<li><strong>Critique</strong> : demande a l\'IA d\'ameliorer sa reponse, puis clique sur 🔍 <em>Tester ma brique</em>.</li>' +
            '<li><strong>Finalisation</strong> : ajoute ta touche perso, puis 🔒 <em>Valide definitivement</em>.</li>' +
            '</ol></details>' +
            '<div class="game-step-prompt">' +
            '<div class="game-step-prompt-label">📝 Prompt suggere (a copier dans votre outil IA) :</div>' +
            '<div class="game-step-prompt-text">' + escapeHtml(promptText) + '</div>' +
            '<div class="game-step-prompt-actions">' +
            '<button class="btn-outline btn-xs btn-copy-prompt" data-prompt="' + encodeURIComponent(promptText) + '">📋 Copier le prompt</button>' +
            '<a class="btn-outline btn-xs ia-tool-link" href="https://chatgpt.com/" target="_blank" rel="noopener">💬 Ouvrir ChatGPT ↗</a>' +
            '<a class="btn-outline btn-xs ia-tool-link" href="https://claude.ai/" target="_blank" rel="noopener">🧠 Ouvrir Claude ↗</a>' +
            '</div>' +
            '<p class="game-step-howto">1) Copiez le prompt &bull; 2) Ouvrez un outil IA &bull; 3) <strong>Collez la VRAIE reponse de l\'IA ci-dessous</strong> &bull; 4) Validez pour la noter</p>' +
            '</div>' +
            '<div class="game-step-fields">' +
            step.fields.map(function (f) {
              var val = data[f.name] || '';
              if (f.rows) {
                return '<div class="form-group"><label>' + f.label + '</label>' +
                  '<textarea data-step="' + step.id + '" data-field="' + f.name + '" rows="' + f.rows + '" placeholder="' + (f.placeholder || '') + '">' + escapeHtml(val) + '</textarea></div>';
              } else {
                return '<div class="form-group"><label>' + f.label + '</label>' +
                  '<input type="text" data-step="' + step.id + '" data-field="' + f.name + '" placeholder="' + (f.placeholder || '') + '" value="' + escapeHtml(val) + '"></div>';
              }
            }).join('') +
            '</div>' +
            renderAssetsBlock(step.id, data.assets || []) +
            '<p class="game-step-validate-note">⚠️ <strong>Valider definitivement</strong> note votre brique (auto-evaluation) et la verrouille comme rendu officiel. Vous gagnez les points + un bonus selon la qualite.</p>' +
            '<div class="game-step-actions">' +
            '<button class="btn-primary btn-validate-step" data-step-id="' + step.id + '">🔒 Valider definitivement</button>' +
            '<button class="btn-outline btn-sm btn-feedback-step" data-step-id="' + step.id + '">🔍 Tester ma brique</button>' +
            '<button class="btn-ghost btn-sm btn-save-draft" data-step-id="' + step.id + '">💾 Sauvegarder brouillon</button>' +
            '</div>' +
            '<div class="game-step-feedback" id="fb-' + step.id + '"></div>' +
            '</div>' +
            '</div>';
        }).join('') +
        '</div>' +
        (doneInPhase === phase.steps.length ?
          '<div class="phase-review"><h4>🧐 Bilan de phase</h4>' +
          '<p class="phase-review-hint">Que retiens-tu de cette phase ? Qu\'est-ce qui a le mieux marche avec l\'IA, et qu\'ameliorerais-tu ?</p>' +
          '<textarea class="phase-review-ta" data-phase="' + pkey + '" rows="3" placeholder="Ton bilan en 2-3 phrases...">' + escapeHtml((st.phaseReviews && st.phaseReviews[pkey]) || '') + '</textarea>' +
          '<button class="btn-outline btn-sm btn-phase-review" data-phase="' + pkey + '">💾 Enregistrer le bilan (+15 XP)</button></div>'
          : '') +
        '</div>';
    });

    html += '<div class="game-final-cta glass-card">' +
      '<h3>🏆 Projet final</h3>' +
      '<p>Quand toutes les etapes sont validees, exportez votre campagne complete et presentez-la au Jour 4 !</p>' +
      '<button class="btn-primary" id="btn-export-campaign">📤 Exporter ma campagne (JSON)</button>' +
      '<button class="btn-outline" id="btn-change-theme">🔄 Changer de projet</button>' +
      '</div>';

    main.innerHTML = html;

    main.querySelectorAll('.game-step-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = this.closest('.game-step-card');
        var body = card.querySelector('.game-step-body');
        body.style.display = body.style.display === 'none' ? 'block' : 'none';
      });
    });

    // Asset attachments handlers (URL add, file upload, remove)
    attachAssetHandlers(main);

    // Timing widget: jump to step button
    main.querySelectorAll('[data-jump-step]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var sid = this.getAttribute('data-jump-step');
        var card = main.querySelector('.game-step-card[data-step-id="' + sid + '"]');
        if (card) {
          var body = card.querySelector('.game-step-body');
          if (body) body.style.display = 'block';
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.style.transition = 'box-shadow 0.5s';
          card.style.boxShadow = '0 0 30px rgba(245,183,49,0.6)';
          setTimeout(function () { card.style.boxShadow = ''; }, 2000);
        }
      });
    });

    main.querySelectorAll('.btn-copy-prompt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var txt = decodeURIComponent(this.getAttribute('data-prompt'));
        if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { AIA.showToast('Prompt copie !', 'success'); });
        else AIA.showToast('Copiez manuellement', 'info');
      });
    });

    main.querySelectorAll('.btn-save-draft').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var stepId = this.getAttribute('data-step-id');
        saveStepData(stepId, main);
        AIA.showToast('Brouillon sauvegarde', 'info');
      });
    });

    // Boucle d'iteration : feedback non bloquant (score + conseils) avant la validation
    main.querySelectorAll('.btn-feedback-step').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var stepId = this.getAttribute('data-step-id');
        saveStepData(stepId, main); // capture le brouillon sans verrouiller
        var stepObj = orderedSteps().find(function (s) { return s.id === stepId; }) || { fields: [] };
        var fb = gameBrickTips(stepObj, st.campaignData[stepId] || {});
        var el = document.getElementById('fb-' + stepId); if (!el) return;
        var cls = fb.score >= 80 ? 'a' : fb.score >= 60 ? 'b' : fb.score >= 40 ? 'c' : 'd';
        el.innerHTML = '<div class="fb-box fb-' + cls + '">' +
          '<div class="fb-score">Score actuel : <strong>' + fb.score + '/100</strong></div>' +
          (fb.tips.length
            ? '<div class="fb-tips"><strong>Pour gagner des points :</strong><ul>' + fb.tips.map(function (t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('') + '</ul></div>'
            : '<div class="fb-ok">✅ Excellent — prêt à valider !</div>') +
          '<div class="fb-note">💡 Ce test ne verrouille rien : améliore puis re-teste autant que tu veux.</div></div>';
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });

    // Revue de fin de phase (bilan + auto-evaluation)
    main.querySelectorAll('.btn-phase-review').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pk = this.getAttribute('data-phase');
        var ta = main.querySelector('.phase-review-ta[data-phase="' + pk + '"]'); if (!ta) return;
        st.phaseReviews = st.phaseReviews || {};
        var firstTime = !((st.phaseReviews[pk] || '').trim());
        st.phaseReviews[pk] = ta.value.trim();
        if (AIA.saveState) AIA.saveState();
        if (firstTime && ta.value.trim() && AIA.addXP) AIA.addXP(15, 'Bilan de phase');
        AIA.showToast('Bilan de phase enregistre', 'success');
      });
    });

    main.querySelectorAll('.btn-validate-step').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var stepId = this.getAttribute('data-step-id');
        var ok = saveStepData(stepId, main, true);
        if (!ok) { AIA.showToast('Collez votre reponse IA (au moins 1 champ) avant de valider', 'warning'); return; }
        if (!confirm('Valider DEFINITIVEMENT cette brique ? Elle sera notee puis verrouillee comme rendu officiel (le formateur pourra la rouvrir si besoin).')) return;
        // Reset systematique des indices de guidage (evite une banniere obsolete)
        _suggestNextStepId = null; _justCompletedTitle = '';
        var wasDone = !!st.gameDeliverables[stepId];
        // Auto-evaluation + verrouillage de la brique
        var stepObj = orderedSteps().find(function (s) { return s.id === stepId; }) || { fields: [] };
        var bScore = scoreBrick(stepObj, st.campaignData[stepId] || {});
        st.gameValidation = st.gameValidation || {};
        st.gameValidation[stepId] = { locked: true, score: bScore, ts: new Date().toISOString() };
        st.gameDeliverables[stepId] = true;
        if (!wasDone) {
          var bonus = brickBonus(bScore);
          AIA.addXP(15 + bonus, 'Brique validee (' + bScore + '/100)');
          AIA.showToast('🔒 Brique validee ! Score ' + bScore + '/100 — +' + (15 + bonus) + ' XP', 'success');
        } else { AIA.showToast('🔒 Brique verrouillee — score ' + bScore + '/100', 'success'); }
        // Phase-completion badge check
        Object.keys(PHASES_GUIDE).forEach(function (pk) {
          var allDone = PHASES_GUIDE[pk].steps.every(function (s) { return st.gameDeliverables[s.id]; });
          if (allDone && AIA.awardBadge) AIA.awardBadge(pk + '-done');
        });
        // Asset collector badge
        var totalAssets = 0;
        Object.keys(st.campaignData || {}).forEach(function (sid) {
          var arr = st.campaignData[sid] && st.campaignData[sid].assets;
          if (Array.isArray(arr)) totalAssets += arr.length;
        });
        if (totalAssets >= 10 && AIA.awardBadge) AIA.awardBadge('asset-collector');
        if (AIA.saveState) AIA.saveState();
        // Auto-check + suggestion de l'etape suivante (fil conducteur sans rupture)
        if (!wasDone) {
          var nextStep = orderedSteps(true).find(function (s) { return !st.gameDeliverables[s.id]; });
          _suggestNextStepId = nextStep ? nextStep.id : null;
          _justCompletedTitle = (orderedSteps().find(function (s) { return s.id === stepId; }) || {}).title || '';
          try { if (AIA.pushFeed) AIA.pushFeed({ action: 'step-done', target: _justCompletedTitle }); } catch (e) {}
        }
        renderBusinessGame(main);
      });
    });

    var btnExport = document.getElementById('btn-export-campaign');
    if (btnExport) btnExport.addEventListener('click', function () {
      var data = { theme: theme, campaign: st.campaignData, completed: st.gameDeliverables, exportedAt: new Date().toISOString() };
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'campagne-' + theme.id + '-' + Date.now() + '.json';
      a.click();
      URL.revokeObjectURL(url);
      AIA.showToast('Campagne exportee !', 'success');
    });

    var btnChange = document.getElementById('btn-change-theme');
    if (btnChange) btnChange.addEventListener('click', function () {
      if (!confirm('Reinitialiser votre projet ? Vous reperdez votre choix (le travail des etapes reste sauvegarde).')) return;
      st.productTheme = null;
      st.themeChoices = null;
      if (AIA.saveState) AIA.saveState();
      renderBusinessGame(main);
    });

    // ===== Fil conducteur guide (micro-etape 2) =====
    // Cas A : suggestion explicite de l'etape suivante apres une validation
    if (_suggestNextStepId) {
      var nextId = _suggestNextStepId; _suggestNextStepId = null;
      var doneTitle = _justCompletedTitle; _justCompletedTitle = '';
      var ns = orderedSteps().find(function (s) { return s.id === nextId; });
      var nextTitle = ns ? ns.title : 'la suite';
      var banner = document.createElement('div');
      banner.className = 'game-next-banner';
      banner.innerHTML =
        '<span class="gnb-check">✅</span>' +
        '<span class="gnb-text"><strong>' + escapeHtml(doneTitle) + '</strong> validee !' +
        ' Prochaine etape : <strong>' + escapeHtml(nextTitle) + '</strong></span>' +
        '<button class="btn-primary btn-xs" id="gnb-continue">Continuer →</button>';
      if (main.firstChild) main.insertBefore(banner, main.firstChild); else main.appendChild(banner);
      var cont = banner.querySelector('#gnb-continue');
      if (cont) cont.addEventListener('click', function () {
        highlightStepCard(main, nextId, true);
        if (banner.parentNode) banner.parentNode.removeChild(banner);
      });
      banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (_justCompletedTitle) {
      _justCompletedTitle = '';
      var bannerDone = document.createElement('div');
      if (hasLockedPhases()) {
        // Cas B1 : toutes les etapes DEBLOQUEES faites, mais des phases restent verrouillees
        bannerDone.className = 'game-next-banner';
        bannerDone.innerHTML =
          '<span class="gnb-check">⏳</span>' +
          '<span class="gnb-text"><strong>Phase terminee !</strong>' +
          ' La phase suivante sera debloquee par le formateur pendant le cours.' +
          ' En attendant, structurez votre travail dans le Carnet.</span>' +
          '<button class="btn-primary btn-xs" id="gnb-workbook">Ouvrir le Carnet →</button>';
      } else {
        // Cas B2 : toutes les phases validees -> orienter vers le Carnet de campagne
        bannerDone.className = 'game-next-banner done';
        bannerDone.innerHTML =
          '<span class="gnb-check">🎉</span>' +
          '<span class="gnb-text"><strong>Toutes les etapes sont validees !</strong>' +
          ' Structurez votre rendu dans le Carnet de campagne.</span>' +
          '<button class="btn-primary btn-xs" id="gnb-workbook">Ouvrir le Carnet →</button>';
      }
      if (main.firstChild) main.insertBefore(bannerDone, main.firstChild); else main.appendChild(bannerDone);
      var wb = bannerDone.querySelector('#gnb-workbook');
      if (wb) wb.addEventListener('click', function () { if (AIA.navigateTo) AIA.navigateTo('workbook'); });
      bannerDone.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (_guideFirstStep) {
      // Cas C : juste apres le choix du projet -> guider vers la 1ere etape disponible
      _guideFirstStep = false;
      var first = orderedSteps(true).find(function (s) { return !st.gameDeliverables[s.id]; });
      if (first) setTimeout(function () { highlightStepCard(main, first.id, true); }, 250);
    }
  }

  /* ============ ASSETS BLOCK (per step) ============ */
  function renderAssetsBlock(stepId, assets) {
    assets = Array.isArray(assets) ? assets : [];
    var thumbsHtml = assets.map(function (a, i) {
      var label = escapeHtml(a.label || '');
      var url = escapeHtml(a.url || '');
      if (a.type === 'image' || (a.url && /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(a.url))) {
        return '<div class="asset-chip image-chip" data-step-id="' + stepId + '" data-asset-idx="' + i + '">' +
          '<img src="' + url + '" alt="' + label + '" loading="lazy" />' +
          '<div class="asset-chip-label">' + label + '</div>' +
          '<button class="asset-chip-remove" title="Supprimer" data-remove-asset="' + i + '" data-step="' + stepId + '">✕</button>' +
          '</div>';
      } else if (a.type === 'file') {
        return '<div class="asset-chip file-chip" data-step-id="' + stepId + '" data-asset-idx="' + i + '">' +
          '<div class="asset-file-icon">📎</div>' +
          '<div class="asset-chip-label">' + label + '</div>' +
          '<a href="' + url + '" target="_blank" class="asset-chip-link">Ouvrir ↗</a>' +
          '<button class="asset-chip-remove" title="Supprimer" data-remove-asset="' + i + '" data-step="' + stepId + '">✕</button>' +
          '</div>';
      } else {
        return '<div class="asset-chip link-chip" data-step-id="' + stepId + '" data-asset-idx="' + i + '">' +
          '<div class="asset-link-icon">🔗</div>' +
          '<div class="asset-chip-label">' + label + '</div>' +
          '<a href="' + url + '" target="_blank" class="asset-chip-link">Ouvrir ↗</a>' +
          '<button class="asset-chip-remove" title="Supprimer" data-remove-asset="' + i + '" data-step="' + stepId + '">✕</button>' +
          '</div>';
      }
    }).join('');
    return '<div class="assets-block" data-step-id="' + stepId + '">' +
      '<div class="assets-block-header">' +
      '<strong>📎 Assets generes par l\'IA (' + assets.length + ')</strong>' +
      '<span class="assets-block-hint">Joignez ici vos images, audio, urls Gamma/Figma generes via les demos IA</span>' +
      '</div>' +
      '<div class="assets-list">' + (assets.length === 0 ? '<div class="assets-empty">Aucun asset attache pour le moment</div>' : thumbsHtml) + '</div>' +
      '<div class="asset-add-controls">' +
      '<input type="text" class="asset-url-input" placeholder="URL image / Gamma / Figma..." data-asset-url="' + stepId + '" />' +
      '<input type="text" class="asset-label-input" placeholder="Nom (ex: Logo v2)" data-asset-label="' + stepId + '" />' +
      '<button class="btn-outline btn-sm btn-add-asset-url" data-step-id="' + stepId + '">+ Ajouter</button>' +
      '<label class="btn-ghost btn-sm asset-file-label">📁 Fichier' +
      '<input type="file" accept="image/*" data-asset-file="' + stepId + '" style="display:none" />' +
      '</label>' +
      '</div>' +
      '</div>';
  }

  function attachAssetHandlers(main) {
    var st = window.AIA.getState();

    main.querySelectorAll('.btn-add-asset-url').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var stepId = this.getAttribute('data-step-id');
        var urlInput = main.querySelector('[data-asset-url="' + stepId + '"]');
        var labelInput = main.querySelector('[data-asset-label="' + stepId + '"]');
        var url = (urlInput.value || '').trim();
        var label = (labelInput.value || '').trim() || 'Asset';
        if (!url) { window.AIA.showToast('URL requise', 'warning'); return; }
        var type = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url) ? 'image' : 'link';
        addAsset(stepId, { type: type, url: url, label: label, addedAt: new Date().toISOString() });
        urlInput.value = ''; labelInput.value = '';
        window.AIA.renderBusinessGameNew(main);
      });
    });

    main.querySelectorAll('[data-asset-file]').forEach(function (input) {
      input.addEventListener('change', function () {
        var stepId = this.getAttribute('data-asset-file');
        var file = this.files[0];
        if (!file) return;
        if (file.size > 800000) { window.AIA.showToast('Fichier trop gros (max 800 Ko). Compressez ou utilisez une URL.', 'warning'); return; }
        var reader = new FileReader();
        reader.onload = function (e) {
          addAsset(stepId, { type: 'image', url: e.target.result, label: file.name, addedAt: new Date().toISOString() });
          window.AIA.renderBusinessGameNew(main);
        };
        reader.readAsDataURL(file);
      });
    });

    main.querySelectorAll('[data-remove-asset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var stepId = this.getAttribute('data-step');
        var idx = parseInt(this.getAttribute('data-remove-asset'));
        if (!st.campaignData || !st.campaignData[stepId] || !st.campaignData[stepId].assets) return;
        if (!confirm('Supprimer cet asset ?')) return;
        st.campaignData[stepId].assets.splice(idx, 1);
        if (window.AIA.saveState) window.AIA.saveState();
        window.AIA.renderBusinessGameNew(main);
      });
    });

    function addAsset(stepId, asset) {
      st.campaignData = st.campaignData || {};
      st.campaignData[stepId] = st.campaignData[stepId] || {};
      st.campaignData[stepId].assets = st.campaignData[stepId].assets || [];
      st.campaignData[stepId].assets.push(asset);
      if (window.AIA.saveState) window.AIA.saveState();
      window.AIA.showToast('Asset ajoute !', 'success');
      // XP bonus first asset of the step
      if (st.campaignData[stepId].assets.length === 1 && window.AIA.addXP) window.AIA.addXP(5, 'Premier asset ajoute');
    }
  }

  function saveStepData(stepId, main, requireOne) {
    var AIA = window.AIA;
    var st = AIA.getState();
    st.campaignData = st.campaignData || {};
    st.campaignData[stepId] = st.campaignData[stepId] || {};
    var inputs = main.querySelectorAll('[data-step="' + stepId + '"]');
    var filled = 0;
    inputs.forEach(function (el) {
      var f = el.getAttribute('data-field');
      var v = el.value.trim();
      st.campaignData[stepId][f] = v;
      if (v.length > 0) filled++;
    });
    if (requireOne && filled === 0) return false;
    if (AIA.saveState) AIA.saveState();
    return true;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  /* ============ CAMPAIGN SHOWCASE (Competition + Voting) ============ */
  // Temps fort Showcase pertinent pour le jour courant (pour le bandeau de contexte).
  function currentShowcaseHighlight() {
    var AIA = window.AIA;
    var HL = AIA.HIGHLIGHTS || [];
    var sc = AIA.getSessionContext ? AIA.getSessionContext() : null;
    var day = sc ? sc.dayNum : 1;
    var todays = HL.filter(function (h) { return h.type === 'showcase' && h.day === day; });
    return todays.length ? todays[0] : HL.filter(function (h) { return h.type === 'showcase'; })[0] || null;
  }

  function showcaseContextBanner() {
    var h = currentShowcaseHighlight();
    if (!h) return '';
    return '<div class="showcase-context glass-card">' +
      '<div class="sc-ctx-icon">' + (h.icon || '🎪') + '</div>' +
      '<div class="sc-ctx-body"><div class="sc-ctx-label">🎪 SHOWCASE DU JOUR</div>' +
      '<div class="sc-ctx-title">' + escapeHtml(h.title) + '</div>' +
      '<div class="sc-ctx-desc">' + escapeHtml(h.desc || '') + ' Votez (3 max) — le top 3 gagne un bonus automatique.</div>' +
      '</div></div>';
  }

  // Recompense AUTO du podium : self-appliquee une seule fois quand je suis dans le top 3.
  // Seuil : >=3 votes ET >=4 campagnes, pour eviter qu'un seul vote sur un champ a egalite (0-0)
  // ne donne un faux rang #1 (anti-inflation XP). Garde module = anti double-award cross-onglet.
  var _podiumAwarded = false;
  var SHOWCASE_MIN_VOTES = 3;
  var SHOWCASE_MIN_CAMPAIGNS = 4;
  function awardShowcasePodium(sortedCampaigns, myKey) {
    var AIA = window.AIA;
    if (!myKey || _podiumAwarded) return;
    var st = AIA.getState();
    if (st.showcaseRewarded) { _podiumAwarded = true; return; } // deja recompense (etat persiste)
    if (sortedCampaigns.length < SHOWCASE_MIN_CAMPAIGNS) return;
    var myIdx = -1;
    for (var i = 0; i < sortedCampaigns.length; i++) { if (sortedCampaigns[i].key === myKey) { myIdx = i; break; } }
    if (myIdx < 0 || myIdx > 2) return;
    if (!sortedCampaigns[myIdx] || sortedCampaigns[myIdx].votes < SHOWCASE_MIN_VOTES) return;
    _podiumAwarded = true;
    var rank = myIdx + 1;
    var bonus = rank === 1 ? 50 : rank === 2 ? 30 : 20;
    st.showcaseRewarded = { rank: rank, ts: new Date().toISOString() };
    if (AIA.addXP) AIA.addXP(bonus, 'Podium Showcase (#' + rank + ')');
    if (AIA.awardBadge) AIA.awardBadge('crowd-favorite');
    if (AIA.saveState) AIA.saveState();
    if (AIA.showToast) AIA.showToast('🏆 Tu es #' + rank + ' du Showcase ! +' + bonus + ' XP', 'success');
  }

  function renderCampaignShowcase(main) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var myKey = st.user && st.user.accountKey;

    main.innerHTML = '<div class="page-header">' +
      '<h1>🏆 Showcase des <span class="gradient-text">Campagnes</span></h1>' +
      '<p class="page-subtitle">Decouvrez les campagnes de toute la classe et votez pour vos preferees</p></div>' +
      '<div id="showcase-content"><div class="loading-pulse" style="padding:2rem;text-align:center">Chargement des campagnes...</div></div>';

    if (!AIA.db) {
      document.getElementById('showcase-content').innerHTML = '<div class="glass-card" style="text-align:center;padding:2rem"><p>Firebase non connecte — showcase indisponible.</p></div>';
      return;
    }

    AIA.db.ref('states').once('value', function (snap) {
      var allStates = snap.val() || {};
      AIA.db.ref('votes').once('value', function (vsnap) {
        var allVotes = vsnap.val() || {};
        renderShowcaseGrid(allStates, allVotes, myKey, main);
      });
    });
  }

  function computeCampaignStats(s) {
    var total = 0, done = 0, assetCount = 0;
    Object.keys(PHASES_GUIDE).forEach(function (pk) {
      PHASES_GUIDE[pk].steps.forEach(function (step) {
        total++;
        if (s.gameDeliverables && s.gameDeliverables[step.id]) done++;
        if (s.campaignData && s.campaignData[step.id] && Array.isArray(s.campaignData[step.id].assets)) {
          assetCount += s.campaignData[step.id].assets.length;
        }
      });
    });
    return { total: total, done: done, pct: total > 0 ? Math.round(done * 100 / total) : 0, assetCount: assetCount };
  }

  function countVotesFor(targetKey, allVotes) {
    var count = 0;
    for (var voter in allVotes) {
      if (allVotes[voter] && allVotes[voter][targetKey]) count++;
    }
    return count;
  }

  function renderShowcaseGrid(allStates, allVotes, myKey, main) {
    var campaigns = [];
    Object.keys(allStates).forEach(function (k) {
      var s = allStates[k];
      if (!s || !s.productTheme) return; // only show campaigns with a chosen theme
      var stats = computeCampaignStats(s);
      var votes = countVotesFor(k, allVotes);
      campaigns.push({
        key: k,
        name: s.user && s.user.name ? s.user.name : k,
        theme: s.productTheme,
        stats: stats,
        votes: votes,
        isMe: k === myKey
      });
    });

    if (campaigns.length === 0) {
      document.getElementById('showcase-content').innerHTML =
        '<div class="glass-card" style="text-align:center;padding:3rem">' +
        '<div style="font-size:3rem;margin-bottom:1rem">🎯</div>' +
        '<h3>Aucune campagne pour le moment</h3>' +
        '<p style="color:var(--text-muted)">Les campagnes apparaitront ici des qu\'un etudiant choisit son projet d\'atelier.</p>' +
        '</div>';
      return;
    }

    // Sort by votes desc, then by pct desc, then by name
    campaigns.sort(function (a, b) {
      if (b.votes !== a.votes) return b.votes - a.votes;
      if (b.stats.pct !== a.stats.pct) return b.stats.pct - a.stats.pct;
      return a.name.localeCompare(b.name);
    });

    var myVotes = (allVotes[myKey] || {});
    var myVoteCount = Object.keys(myVotes).filter(function (k) { return myVotes[k]; }).length;
    var MAX_VOTES = 3;

    // Recompense podium AUTO (self-appliquee, une seule fois) : si je suis dans le top 3 avec >=1 vote.
    awardShowcasePodium(campaigns, myKey);

    var html = showcaseContextBanner() +
      '<div class="showcase-stats glass-card">' +
      '<div><strong>' + campaigns.length + '</strong> campagnes actives</div>' +
      '<div><strong>' + myVoteCount + '/' + MAX_VOTES + '</strong> de vos votes utilises</div>' +
      '<div>Cliquez sur ♥ pour soutenir les meilleures campagnes !</div>' +
      '</div>' +
      '<div class="showcase-grid">';

    campaigns.forEach(function (c, idx) {
      var medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '';
      var hasVoted = !!myVotes[c.key];
      var canVote = !c.isMe && (hasVoted || myVoteCount < MAX_VOTES);
      html += '<div class="showcase-card glass-card' + (c.isMe ? ' is-me' : '') + (idx < 3 ? ' top-rank' : '') + '" data-campaign-key="' + c.key + '">' +
        (medal ? '<div class="showcase-medal">' + medal + '</div>' : '') +
        '<div class="showcase-emoji">' + c.theme.emoji + '</div>' +
        '<div class="showcase-category">' + c.theme.category + '</div>' +
        '<h3 class="showcase-name">' + c.theme.name + '</h3>' +
        '<p class="showcase-tagline">' + c.theme.tagline + '</p>' +
        '<div class="showcase-author">par <strong>' + escapeHtml(c.name) + (c.isMe ? ' (vous)' : '') + '</strong></div>' +
        '<div class="showcase-progress">' +
        '<div class="progress-bar"><div class="progress-fill" style="width:' + c.stats.pct + '%"></div></div>' +
        '<div class="showcase-progress-meta"><span>' + c.stats.pct + '% &bull; ' + c.stats.done + '/' + c.stats.total + ' etapes</span><span>📎 ' + c.stats.assetCount + ' assets</span></div>' +
        '</div>' +
        '<div class="showcase-actions">' +
        '<button class="btn-ghost btn-sm btn-view-campaign" data-campaign-key="' + c.key + '">👀 Voir</button>' +
        (c.isMe ? '<span class="showcase-self-tag">Votre campagne</span>' :
          '<button class="btn-vote-campaign' + (hasVoted ? ' voted' : '') + (canVote ? '' : ' disabled') + '" data-campaign-key="' + c.key + '" data-voted="' + hasVoted + '">' +
          (hasVoted ? '♥' : '♡') + ' ' + c.votes + '</button>') +
        '</div>' +
        '</div>';
    });

    html += '</div>';
    document.getElementById('showcase-content').innerHTML = html;

    // Vote handlers
    main.querySelectorAll('.btn-vote-campaign').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (this.classList.contains('disabled') && !this.classList.contains('voted')) {
          window.AIA.showToast('Limite : ' + MAX_VOTES + ' votes max. Retirez un vote pour en ajouter un autre.', 'warning');
          return;
        }
        var targetKey = this.getAttribute('data-campaign-key');
        var hasVoted = this.getAttribute('data-voted') === 'true';
        if (!window.AIA.db || !myKey) return;
        var ref = window.AIA.db.ref('votes/' + myKey + '/' + targetKey);
        if (hasVoted) {
          ref.remove(function () {
            window.AIA.showToast('Vote retire', 'info');
            renderCampaignShowcase(main);
          });
        } else {
          ref.set(true, function () {
            window.AIA.showToast('Vote enregistre ! ♥', 'success');
            if (window.AIA.addXP) window.AIA.addXP(2, 'Vote campagne');
            // Voter badge when 3 votes used
            window.AIA.db.ref('votes/' + myKey).once('value', function (vs) {
              var vv = vs.val() || {};
              var count = Object.keys(vv).filter(function (k) { return vv[k]; }).length;
              if (count >= 3 && window.AIA.awardBadge) window.AIA.awardBadge('voter');
            });
            // Top-voted badge for target if they hit 3 votes
            window.AIA.db.ref('votes').once('value', function (allVS) {
              var avs = allVS.val() || {};
              var cnt = 0;
              for (var v in avs) { if (avs[v] && avs[v][targetKey]) cnt++; }
              if (cnt >= 3 && window.AIA.db) {
                window.AIA.db.ref('states/' + targetKey + '/badges').once('value', function (bs) {
                  var badges = bs.val() || [];
                  if (Array.isArray(badges) && badges.indexOf('top-voted') === -1) {
                    badges.push('top-voted');
                    window.AIA.db.ref('states/' + targetKey + '/badges').set(badges);
                  }
                });
              }
            });
            renderCampaignShowcase(main);
          });
        }
      });
    });

    // View campaign handlers (read-only)
    main.querySelectorAll('.btn-view-campaign').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = this.getAttribute('data-campaign-key');
        renderCampaignDetail(key, allStates[key], main);
      });
    });
  }

  function renderCampaignDetail(key, s, main) {
    if (!s || !s.productTheme) return;
    var stats = computeCampaignStats(s);
    var html = '<div class="page-header">' +
      '<a href="#" class="back-to-showcase" style="color:var(--text-muted);font-size:0.78rem;text-decoration:none">← Retour au showcase</a>' +
      '<h1>' + s.productTheme.emoji + ' ' + s.productTheme.name + '</h1>' +
      '<p class="page-subtitle">par ' + escapeHtml(s.user && s.user.name ? s.user.name : key) + ' &bull; ' + stats.pct + '% complete &bull; ' + stats.assetCount + ' assets</p></div>' +
      '<div class="glass-card" style="padding:1.2rem;margin-bottom:1rem">' +
      '<p style="font-size:0.92rem">' + escapeHtml(s.productTheme.tagline) + '</p>' +
      '<p style="font-size:0.82rem;color:var(--text-muted);margin-top:0.4rem">' + escapeHtml(s.productTheme.description) + '</p>' +
      '</div>';

    Object.keys(PHASES_GUIDE).forEach(function (pk, pIdx) {
      var phase = PHASES_GUIDE[pk];
      html += '<div class="glass-card phase-color-' + phase.color + '" style="padding:1.2rem;margin-bottom:1rem;border-left:4px solid">' +
        '<h2>' + phase.icon + ' ' + phase.title + '</h2>';
      phase.steps.forEach(function (step) {
        var data = (s.campaignData && s.campaignData[step.id]) || {};
        var done = s.gameDeliverables && s.gameDeliverables[step.id];
        var assets = data.assets || [];
        var hasContent = Object.keys(data).some(function (k) { return k !== 'assets' && data[k]; });
        if (!hasContent && assets.length === 0) return;
        html += '<div class="showcase-step ' + (done ? 'done' : '') + '">' +
          '<h4>' + (done ? '✅ ' : '⬜ ') + step.title + '</h4>';
        step.fields.forEach(function (f) {
          if (data[f.name]) {
            html += '<div class="showcase-field"><strong>' + f.label + ' :</strong> <div class="showcase-field-val">' + escapeHtml(data[f.name]).replace(/\n/g, '<br>') + '</div></div>';
          }
        });
        if (assets.length > 0) {
          html += '<div class="showcase-assets-row">';
          assets.forEach(function (a) {
            if (a.type === 'image' || (a.url && /\.(png|jpe?g|gif|webp|svg)/i.test(a.url))) {
              html += '<a href="' + escapeHtml(a.url) + '" target="_blank" class="showcase-asset-thumb"><img src="' + escapeHtml(a.url) + '" alt="' + escapeHtml(a.label || '') + '" /></a>';
            } else {
              html += '<a href="' + escapeHtml(a.url) + '" target="_blank" class="showcase-asset-link">🔗 ' + escapeHtml(a.label || a.url) + '</a>';
            }
          });
          html += '</div>';
        }
        html += '</div>';
      });
      html += '</div>';
    });

    main.innerHTML = html;
    var back = main.querySelector('.back-to-showcase');
    if (back) back.addEventListener('click', function (e) { e.preventDefault(); renderCampaignShowcase(main); });
  }

  window.AIA = window.AIA || {};
  window.AIA.PRODUCT_THEMES = PRODUCT_THEMES;
  window.AIA.PHASES_GUIDE = PHASES_GUIDE;
  // Contexte de la session courante (jour/demi-journee + phase/demos recommandees) pour le fil conducteur du dashboard.
  window.AIA.getSessionContext = function () {
    var t = getCurrentTiming();
    if (!t) return null;
    var ctx = (TIMING_MAP[t.dayNum] && TIMING_MAP[t.dayNum][t.session]) || null;
    return {
      dayNum: t.dayNum, session: t.session,
      phase: ctx ? ctx.phase : null, step: ctx ? ctx.step : null,
      label: ctx ? ctx.label : '', demos: (ctx && ctx.demos) ? ctx.demos.slice() : []
    };
  };
  window.AIA.showThemeSelection = showThemeSelection;
  window.AIA.renderBusinessGameNew = renderBusinessGame;
  window.AIA.pickRandomThemes = pickRandomThemes;
  window.AIA.getCurrentTiming = getCurrentTiming;
  window.AIA.renderTimingWidget = renderTimingWidget;
  window.AIA.renderCampaignShowcase = renderCampaignShowcase;
  window.AIA.computeCampaignStats = computeCampaignStats;
  window.AIA.TIMING_MAP = TIMING_MAP;
})();
