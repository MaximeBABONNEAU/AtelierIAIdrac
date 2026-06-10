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
      target: 'Proprietaires d\'animaux 25-55 ans, cadeaux', price: '19-49 EUR / portrait', usp: 'Souvenir personnalise haut de gamme' },
    { id: 'penny', name: 'Penny', emoji: '🐷', category: 'Fintech / Budget', tagline: 'Coach budget IA pour jeunes',
      description: 'App qui categorise les depenses, predit les fins de mois difficiles et coache vers l\'epargne via micro-defis.',
      target: 'Etudiants & jeunes actifs 18-30 ans', price: 'Gratuit + premium 4,99/mois', usp: 'Pedagogique, sans jugement, gamifie' },
    { id: 'reverie', name: 'Reverie', emoji: '👗', category: 'Fashion / Location', tagline: 'Dressing de luxe en location',
      description: 'Location de pieces de createurs pour evenements : robe, costume, accessoires livres et nettoyes.',
      target: 'CSP+ 25-45 ans, mariages & galas', price: '39-149 EUR / piece / 4 jours', usp: 'Luxe accessible, zero achat impulsif' },
    { id: 'volt', name: 'Volt', emoji: '🔌', category: 'Mobility / Energy', tagline: 'Recharge VE entre particuliers',
      description: 'Marketplace pour recharger sa voiture electrique sur la borne d\'un particulier, moins cher qu\'en station.',
      target: 'Proprietaires de VE urbains/peri-urbains', price: 'Commission 12% par recharge', usp: 'Maillage dense, prix imbattable' },
    { id: 'hestia', name: 'Hestia', emoji: '🏡', category: 'PropTech / Social', tagline: 'Colocation intergenerationnelle',
      description: 'Plateforme qui met en relation seniors avec chambre libre et etudiants, contre loyer doux + presence.',
      target: 'Seniors isoles + etudiants en tension de logement', price: 'Abonnement 19 EUR/mois', usp: 'Lien social + logement abordable' },
    { id: 'confetti', name: 'Confetti', emoji: '🎉', category: 'EventTech / SaaS', tagline: 'Organisateur d\'evenements IA',
      description: 'Assistant qui planifie un evenement de A a Z : retro-planning, prestataires, budget, invitations, pilote par IA.',
      target: 'Offices managers, assos, particuliers debordes', price: '29-99 EUR / evenement', usp: 'Tout-en-un, zero tableur Excel' },
    { id: 'talently', name: 'Talently', emoji: '🧑‍💼', category: 'HRTech / B2B', tagline: 'Pre-selection candidats par IA',
      description: 'Outil RH qui trie les CV, genere des questions d\'entretien sur-mesure et resume les soft-skills sans biais.',
      target: 'PME & cabinets de recrutement', price: 'SaaS 99-499 EUR/mois', usp: 'Gain de temps + reduction des biais' },
    { id: 'riffai', name: 'RiffAI', emoji: '🎸', category: 'MusicTech / Creator', tagline: 'Compositeur de jingles IA',
      description: 'Genere une musique libre de droits sur-mesure (jingle, fond de podcast, pub) a partir d\'un brief texte.',
      target: 'Createurs de contenu, TPE, podcasters', price: '9,99 EUR/mois illimite', usp: '100% libre de droits, instantane' },
    { id: 'heritage', name: 'Heritage', emoji: '💎', category: 'Luxe / Resale', tagline: 'Authentification de luxe par IA',
      description: 'Service qui authentifie sacs et montres de luxe d\'occasion par photo + expert, avec certificat blockchain.',
      target: 'Acheteurs/vendeurs seconde main premium', price: '29 EUR / authentification', usp: 'Confiance + tracabilite anti-contrefacon' }
  ];

  /* ============ META PAR ETAPE : attendu concret + technos recommandees (HF / LLM) ============ */
  // kind 'hf' -> ouvre la demo HuggingFace en modale (window.AIA.openIframeModal) ; 'llm' -> lien externe.
  // type : strategy | image | audio | video | copy | web | deck  (sert au formatage auto du Notebook)
  var ASSET_TYPE_LABELS = { strategy: '🧭 Stratégie', image: '🎨 Image', audio: '🔊 Audio', video: '🎬 Vidéo', copy: '✍️ Copy', web: '🌐 Web', deck: '📊 Deck' };
  var LLM_CHATGPT = { label: 'ChatGPT', kind: 'llm', url: 'https://chatgpt.com/' };
  var LLM_CLAUDE = { label: 'Claude', kind: 'llm', url: 'https://claude.ai/' };
  var HF_FLUX = { label: 'FLUX (HuggingFace)', kind: 'hf', url: 'https://black-forest-labs-flux-1-schnell.hf.space' };
  var HF_SD35 = { label: 'Stable Diffusion 3.5 (HF)', kind: 'hf', url: 'https://stabilityai-stable-diffusion-3-5-large.hf.space' };
  var STEP_META = {
    // --- Phase 1 : Strategie ---
    'product-idea':    { type: 'strategy', expected: 'Un concept clair en 50-100 mots + 3 axes de differenciation concrets. On doit comprendre QUOI, POUR QUI, et POURQUOI c\'est unique.', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'consumer-insight':{ type: 'strategy', expected: '1 insight consommateur fort (verbatim a la 1ere personne) + 3 tensions a resoudre (envie vs frein).', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'target-persona':  { type: 'strategy', expected: '1 persona incarne : prenom + age + metier, 3 motivations, 3 freins, canaux ou il s\'informe. Evite les generalites ("jeunes actifs").', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'market-analysis': { type: 'strategy', expected: '3 concurrents (forces/faiblesses) + 3 tendances cles + 1 phrase de positionnement differenciant + 1 carte de positionnement.', tech: [ { label: 'Perplexity', kind: 'llm', url: 'https://www.perplexity.ai/' }, LLM_CHATGPT ] },
    'brand-platform':  { type: 'strategy', expected: 'Mission, vision, promesse (1 phrase), raison d\'y croire (RTB), ennemi de marque, 5 traits de personnalite.', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'marketing-mix':   { type: 'strategy', expected: 'Les 4P : Product (coeur + 2 extensions), Price (positionnement + mecaniques), Place (3 vagues), Promotion (canaux cles).', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'swot':                { type: 'strategy', expected: 'Matrice SWOT complete (Forces/Faiblesses/Opportunites/Menaces, 3-5 items chacun) + 2 axes strategiques croises (SO/ST/WO/WT).', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'value-proposition':   { type: 'strategy', expected: 'Value Proposition Canvas : jobs/pains/gains du client + pain relievers/gain creators/produits cote offre + 1 phrase de proposition de valeur.', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'segmentation':        { type: 'strategy', expected: '3-4 segments (criteres + taille/attractivite) + choix de la cible prioritaire justifie.', tech: [ LLM_CHATGPT, { label: 'Perplexity', kind: 'llm', url: 'https://www.perplexity.ai/' } ] },
    'objectives-okr':      { type: 'strategy', expected: 'Objectifs SMART par etage de funnel (notoriete->retention) + KPIs chiffres + 1-2 OKR.', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'customer-journey':    { type: 'strategy', expected: 'Parcours client : 5 etapes (awareness->advocacy), emotions, points de contact, frictions, opportunites IA.', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'positioning-statement':{ type: 'strategy', expected: 'Enonce de positionnement formel (Pour X qui Y, [marque] est Z qui B, car preuve) + carte perceptuelle 2 axes.', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    // --- Phase 2 : Identite & branding ---
    'brand-name':      { type: 'strategy', expected: '1 nom final court + baseline 5-8 mots + justification. Prononcable, evocateur, .com plausible.', tech: [ LLM_CHATGPT, { label: 'Namelix', kind: 'llm', url: 'https://namelix.com/' } ] },
    'logo':            { type: 'image', expected: '1 prompt de logo abouti + 3 variantes generees + palette 3-5 couleurs (hex) + typo.', tech: [ HF_FLUX, { label: 'Ideogram (texte)', kind: 'llm', url: 'https://ideogram.ai/' }, { label: 'Leonardo.ai', kind: 'llm', url: 'https://leonardo.ai/' } ] },
    'brand-guide':     { type: 'strategy', expected: '3 valeurs + 5 adjectifs de ton + mots YES/NO + 2 exemples Do/Don\'t. Doit guider la redaction de tous les textes.', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'art-direction':   { type: 'image', expected: 'Direction artistique : 3 adjectifs de style, references, lumiere, textures + 1 moodboard genere.', tech: [ HF_FLUX, { label: 'Leonardo.ai', kind: 'llm', url: 'https://leonardo.ai/' } ] },
    'packaging-main':  { type: 'image', expected: '1 concept de packaging du produit phare + mockup studio genere (contenant, couleurs, wordmark).', tech: [ HF_FLUX, { label: 'Leonardo.ai', kind: 'llm', url: 'https://leonardo.ai/' } ] },
    'packaging-range': { type: 'image', expected: '2-3 variantes de gamme coherentes (codes couleur/saveur) + visuel des SKU cote a cote.', tech: [ HF_FLUX, HF_SD35 ] },
    'social-templates':{ type: 'image', expected: 'Template Story 9:16 + banniere 16:9 + sticker/picto, palette de marque, typo ronde. Reutilisables.', tech: [ HF_FLUX, { label: 'Canva', kind: 'llm', url: 'https://www.canva.com/' } ] },
    'brand-archetype':     { type: 'strategy', expected: 'Archetype principal + secondaire (parmi les 12 de Jung), traits, ton, marques de reference, implications creatives (couleur/typo/copy).', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'brand-story':         { type: 'copy', expected: 'Recit fondateur + ennemi de marque + golden circle (why/how/what) + manifeste de marque (100-150 mots).', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'tagline-system':      { type: 'copy', expected: 'Tagline principale + 3-5 variantes par canal/usage + regles d\'emploi.', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'iconography':         { type: 'image', expected: 'Style des icones + grille + set de 8-12 pictos cles coherents + regles d\'usage. Visuels generes.', tech: [ { label: 'Recraft', kind: 'llm', url: 'https://www.recraft.com/' }, HF_FLUX ] },
    'photo-style':         { type: 'image', expected: 'Direction imagee : sujets, cadrage, lumiere, couleurs, do/don\'t + 3 visuels de reference generes.', tech: [ HF_SD35, HF_FLUX ] },
    'brand-applications':  { type: 'image', expected: 'Papeterie (carte de visite, signature mail), merch (tote/tshirt/sticker), avatars & bannieres reseaux. Mockups generes.', tech: [ HF_FLUX, { label: 'Canva', kind: 'llm', url: 'https://www.canva.com/' } ] },
    // --- Phase 3 : Contenus & assets ---
    'ad-visuals':      { type: 'image', expected: '1 concept creatif + 3 visuels generes (IG 4:5 / LinkedIn 16:9 / Display 1.91:1) coherents.', tech: [ HF_SD35, HF_FLUX ] },
    'copy':            { type: 'copy', expected: '3 headlines + 1 body de 50-80 mots + 1 CTA principal. Benefices avant features.', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'social-content':  { type: 'copy', expected: '5 captions IG + 5 hooks TikTok (3 premieres sec) + 5 posts X + 5 microcopies UI, au ton de la charte.', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'jingle':          { type: 'audio', expected: '1 brief de jingle (ambiance, tempo, instruments, voix) + jingle 10-15s + sonic logo 2s generes (lien).', tech: [ { label: 'Suno', kind: 'llm', url: 'https://suno.com/' }, { label: 'Udio', kind: 'llm', url: 'https://www.udio.com/' } ] },
    'voiceover':       { type: 'audio', expected: 'Script voix-off 20s (ton charte) + variante ASMR + voix FR generee (lien ElevenLabs).', tech: [ { label: 'ElevenLabs', kind: 'llm', url: 'https://elevenlabs.io/' } ] },
    'manifesto-video': { type: 'video', expected: 'Script + storyboard d\'un manifeste 30-60s (intention, plans, texte ecran, musique) + quelques plans generes (lien).', tech: [ { label: 'Runway', kind: 'llm', url: 'https://runwayml.com/' }, { label: 'Kling', kind: 'llm', url: 'https://klingai.com/' } ] },
    'social-video':    { type: 'video', expected: '1 Reel/TikTok 15-20s (hook, plans, son) + 1 concept de challenge UGC (hashtag, mecanique, incentive) + demo (lien).', tech: [ { label: 'Kling', kind: 'llm', url: 'https://klingai.com/' }, { label: 'CapCut', kind: 'llm', url: 'https://www.capcut.com/' } ] },
    'retail-plv':      { type: 'image', expected: 'Affiche OOH + stop-rayon lisibles a 3m : gros wordmark, punchline, palette. Visuels generes.', tech: [ HF_FLUX, { label: 'Ideogram (texte)', kind: 'llm', url: 'https://ideogram.ai/' } ] },
    'media-plan':      { type: 'strategy', expected: 'Repartition du budget par canal (%/EUR) + KPIs chiffres + calendrier 4-6 semaines.', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    // --- Phase 4 : Lancement & pitch ---
    'landing-page':    { type: 'web', expected: 'Structure de page (hero > preuve > features > pricing > FAQ > CTA) + contenu par section + (option) page generee.', tech: [ { label: 'Framer', kind: 'llm', url: 'https://www.framer.com/' }, { label: 'v0', kind: 'llm', url: 'https://v0.dev/' }, LLM_CHATGPT ] },
    'email-sequence':  { type: 'copy', expected: 'Sequence de 6 emails (waitlist > J-7 > drop > preuve > abo > bilan) : objet + message + CTA.', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'gtm-plan':        { type: 'strategy', expected: 'GTM 12 semaines en 3 temps (pre-lancement / lancement / post) + KPIs par etage de funnel.', tech: [ LLM_CHATGPT, LLM_CLAUDE ] },
    'display-ads':     { type: 'image', expected: 'Set display 3 formats (300x250 / 728x90 / 320x50) + ad copy acquisition/retargeting/challenge + visuels.', tech: [ HF_FLUX, LLM_CHATGPT ] },
    'pitch-video':     { type: 'video', expected: 'Script 60s structure (hook / probleme / solution / preuve / CTA), 8-10 phrases pretes a filmer + video (lien).', tech: [ { label: 'HeyGen', kind: 'llm', url: 'https://www.heygen.com/' }, { label: 'ElevenLabs', kind: 'llm', url: 'https://elevenlabs.io/' } ] },
    'final-deck':      { type: 'deck', expected: 'Deck slide ANIME de 10-12 slides assemblant TOUS les assets produits (visuels, audio, video, copy). Lien partageable.', tech: [ { label: 'Gamma', kind: 'llm', url: 'https://gamma.app/' }, { label: 'Canva', kind: 'llm', url: 'https://www.canva.com/' } ] }
  };

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
          id: 'consumer-insight',
          title: 'Insight & tensions consommateur',
          desc: 'Formulez l\'insight central + 3 tensions a resoudre (envie vs frein)',
          aiTool: 'ChatGPT / Claude',
          prompt: 'Pour "{theme}", formule 1 insight consommateur fort, ecrit comme un verbatim a la 1ere personne (cible : [persona]). Puis liste 3 tensions a resoudre, chacune sous la forme "envie de X mais frein Y".',
          fields: [
            { name: 'insight', label: 'Insight central (verbatim)', rows: 3, placeholder: '"J\'ai 28 ans, je vis en ville... le soir je veux manger bon, sain et rapide, mais..."' },
            { name: 'tensions', label: '3 tensions a resoudre', rows: 3, placeholder: '1. Envie de ... mais frein ...\n2. ...\n3. ...' }
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
        },
        {
          id: 'brand-platform',
          title: 'Plateforme de marque',
          desc: 'Mission, vision, promesse, raison d\'y croire, ennemi, personnalite',
          aiTool: 'ChatGPT / Claude',
          prompt: 'Construis la plateforme de marque de "{theme}" : mission, vision, promesse (1 phrase memorable), raison d\'y croire (RTB, preuves concretes), ennemi de marque (ce qu\'on combat), et 5 traits de personnalite.',
          fields: [
            { name: 'mission', label: 'Mission & vision', rows: 2, placeholder: 'Mission : ... / Vision : ...' },
            { name: 'promise', label: 'Promesse (1 phrase) + tagline', rows: 2, placeholder: 'Promesse : ... / Tagline : ...' },
            { name: 'rtb', label: 'Raison d\'y croire (preuves)', rows: 2, placeholder: 'Recette courte, origine, 0 additif, petites series...' },
            { name: 'personality', label: 'Personnalite (5 traits) + ennemi', rows: 2, placeholder: 'Espiegle, genereuse... / Ennemi : la soupe triste, l\'industriel sans ame' }
          ]
        },
        {
          id: 'marketing-mix',
          title: 'Marketing mix (4P)',
          desc: 'Product, Price, Place, Promotion',
          aiTool: 'ChatGPT / Claude',
          prompt: 'Definis le marketing mix 4P de "{theme}" : Product (coeur de gamme + 2 extensions de lancement), Price (positionnement de valeur + mecaniques de lancement), Place (3 vagues de distribution), Promotion (canaux cles).',
          fields: [
            { name: 'product4p', label: 'Product (coeur + 2 extensions)', rows: 2, placeholder: 'Coeur : ... / Extension 1 : ... / Extension 2 : ...' },
            { name: 'price4p', label: 'Price (positionnement + mecaniques)', rows: 2, placeholder: 'Premium accessible ; pre-commande -20%, pack decouverte, abonnement...' },
            { name: 'place4p', label: 'Place (3 vagues de distribution)', rows: 2, placeholder: '1. DTC (site) 2. Retail selectif 3. Food service / OOH' },
            { name: 'promotion4p', label: 'Promotion (canaux cles)', rows: 2, placeholder: 'Social-first, influence, UGC, echantillonnage, RP...' }
          ]
        },
        {
          id: 'swot',
          title: 'Analyse SWOT',
          desc: 'Forces / Faiblesses / Opportunites / Menaces + axes strategiques croises',
          aiTool: 'ChatGPT / Claude',
          prompt: 'Realise une analyse SWOT complete pour "{theme}". Donne 3-5 items par quadrant (Forces, Faiblesses, Opportunites, Menaces), puis croise-les en axes strategiques (SO : forces x opportunites ; ST ; WO ; WT : faiblesses x menaces).',
          fields: [
            { name: 'swotSF', label: 'Forces & Faiblesses (internes)', rows: 3, placeholder: 'Forces : ...\nFaiblesses : ...' },
            { name: 'swotOM', label: 'Opportunites & Menaces (externes)', rows: 3, placeholder: 'Opportunites : ...\nMenaces : ...' },
            { name: 'swotAxes', label: 'Axes strategiques croises (SO/ST/WO/WT)', rows: 2, placeholder: 'SO : ... / ST : ... / WO : ... / WT : ...' }
          ]
        },
        {
          id: 'value-proposition',
          title: 'Proposition de valeur (canvas)',
          desc: 'Value Proposition Canvas : jobs / pains / gains',
          aiTool: 'ChatGPT / Claude',
          prompt: 'Construis le Value Proposition Canvas de "{theme}" pour [persona]. Cote client : 3 jobs (taches/besoins), 3 pains (frustrations), 3 gains (benefices attendus). Cote offre : pain relievers, gain creators, produits/services. Termine par 1 phrase de proposition de valeur.',
          fields: [
            { name: 'vpClient', label: 'Profil client (jobs / pains / gains)', rows: 3, placeholder: 'Jobs : ...\nPains : ...\nGains : ...' },
            { name: 'vpOffer', label: 'Offre (pain relievers / gain creators / produits)', rows: 3, placeholder: 'Pain relievers : ...\nGain creators : ...\nProduits : ...' },
            { name: 'vpStatement', label: 'Proposition de valeur (1 phrase)', placeholder: 'Nous aidons [cible] a [job] en [benefice] sans [pain].' }
          ]
        },
        {
          id: 'segmentation',
          title: 'Segmentation & ciblage',
          desc: '3-4 segments + choix de la cible prioritaire',
          aiTool: 'ChatGPT / Perplexity',
          prompt: 'Segmente le marche de "{theme}" en 3-4 segments (criteres demographiques, comportementaux, besoins). Pour chacun : taille/attractivite et accessibilite. Recommande la cible prioritaire avec justification.',
          fields: [
            { name: 'segSegments', label: '3-4 segments (criteres + attractivite)', rows: 4, placeholder: '1. Segment ... — critere ... — attractivite ...' },
            { name: 'segTarget', label: 'Cible prioritaire + justification', rows: 2, placeholder: 'On cible ... parce que ...' }
          ]
        },
        {
          id: 'objectives-okr',
          title: 'Objectifs SMART / OKR',
          desc: 'Objectifs par etage de funnel + KPIs chiffres',
          aiTool: 'ChatGPT / Claude',
          prompt: 'Definis les objectifs marketing de "{theme}" par etage de funnel (notoriete, acquisition, conversion, retention). Formule-les en SMART (chiffres + echeance) et propose 1-2 OKR (Objective + 3 Key Results).',
          fields: [
            { name: 'okrObjectives', label: 'Objectifs SMART par etage', rows: 4, placeholder: 'Notoriete : ... / Acquisition : ... / Conversion : ... / Retention : ...' },
            { name: 'okrKrs', label: 'OKR (Objective + Key Results)', rows: 3, placeholder: 'O : ... | KR1 : ... | KR2 : ... | KR3 : ...' }
          ]
        },
        {
          id: 'customer-journey',
          title: 'Parcours client (journey map)',
          desc: 'Awareness -> advocacy : emotions, touchpoints, frictions',
          aiTool: 'ChatGPT / Claude',
          prompt: 'Cartographie le parcours client de "{theme}" pour [persona] en 5 etapes (awareness, consideration, purchase, retention, advocacy). Pour chaque etape : etat d\'esprit/emotion, points de contact, frictions, et 1 opportunite d\'amelioration (idealement avec l\'IA).',
          fields: [
            { name: 'journeySteps', label: 'Les 5 etapes (emotion + touchpoints + friction)', rows: 5, placeholder: 'Awareness : emotion ... touchpoints ... friction ...\nConsideration : ...' },
            { name: 'journeyOps', label: 'Opportunites d\'amelioration (IA)', rows: 2, placeholder: '1. ... 2. ...' }
          ]
        },
        {
          id: 'positioning-statement',
          title: 'Enonce de positionnement',
          desc: 'Formule de positionnement + carte perceptuelle',
          aiTool: 'ChatGPT / Claude',
          prompt: 'Redige l\'enonce de positionnement de "{theme}" avec la formule : "Pour [cible] qui [besoin], [marque] est [categorie] qui [benefice cle], car [preuve/RTB]." Propose aussi 2 axes pour une carte perceptuelle et place la marque + 3 concurrents.',
          fields: [
            { name: 'posStatement', label: 'Enonce de positionnement', rows: 3, placeholder: 'Pour ... qui ..., [marque] est ... qui ..., car ...' },
            { name: 'posMap', label: 'Carte perceptuelle (2 axes + placement)', rows: 2, placeholder: 'Axe X : ... / Axe Y : ... — Nous : ... vs concurrents : ...' }
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
          desc: 'Generez votre logo avec FLUX/Ideogram et definissez la palette',
          aiTool: 'FLUX (HF) / Ideogram / Canva',
          prompt: 'Logo design for "{theme}" brand. Modern, minimal, [3 mots cles]. Style : flat design, vector, single color on white. --ar 1:1 --v 6',
          fields: [
            { name: 'logoPrompt', label: 'Prompt image utilise (FLUX/Ideogram)', rows: 3, placeholder: 'Collez votre prompt final ici...' },
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
        },
        {
          id: 'art-direction',
          title: 'Direction artistique / moodboard',
          desc: 'Definissez l\'univers visuel puis generez un moodboard',
          aiTool: 'FLUX (HF) / Leonardo.ai',
          prompt: 'Moodboard for "{theme}" brand. Visual style: [3 adjectifs charte], color palette [palette hex], lighting (warm/natural), textures, art direction references, mood. Cohesive, modern. --ar 16:9',
          fields: [
            { name: 'artStyle', label: 'Direction artistique (style, lumiere, references)', rows: 3, placeholder: 'Style : bold pop / flat-lay ; lumiere chaude ; accents dessines a la main ; references...' },
            { name: 'moodboardPrompt', label: 'Prompt moodboard utilise', rows: 2, placeholder: 'Collez le prompt image utilise...' }
          ]
        },
        {
          id: 'packaging-main',
          title: 'Packaging produit (mockup principal)',
          desc: 'Generez le mockup du packaging du produit phare',
          aiTool: 'FLUX (HF) / Leonardo.ai',
          prompt: 'Product packaging mockup for "{theme}", [type de contenant], brand colors [palette], big wordmark "{name}", premium yet [ton charte]. Studio shot, soft light, appetizing. --ar 4:5',
          fields: [
            { name: 'packagingConcept', label: 'Concept packaging (forme, codes, message au dos)', rows: 2, placeholder: 'Brique collector rouge/creme, gros wordmark, picto, punchline au dos...' },
            { name: 'packagingPrompt', label: 'Prompt mockup utilise', rows: 2, placeholder: 'Collez le prompt image utilise...' }
          ]
        },
        {
          id: 'packaging-range',
          title: 'Declinaison gamme (variations)',
          desc: 'Declinez le packaging sur 2-3 variantes de gamme',
          aiTool: 'FLUX (HF) / SD3.5 (HF)',
          prompt: 'Product range variations for "{theme}": 3 SKUs side by side, consistent design system, different flavor/color codes, same wordmark. Studio shot. --ar 16:9',
          fields: [
            { name: 'rangeVariations', label: '2-3 variantes (nom + code couleur)', rows: 3, placeholder: '1. L\'Originale (rouge)\n2. Basilic Punch (vert)\n3. Feu Doux (orange)' },
            { name: 'rangePrompt', label: 'Prompt declinaison utilise', rows: 2, placeholder: 'Collez le prompt image utilise...' }
          ]
        },
        {
          id: 'social-templates',
          title: 'Templates social (Story + banniere)',
          desc: 'Story 9:16, banniere 16:9 et sticker/picto reutilisables',
          aiTool: 'FLUX (HF) / Canva',
          prompt: 'Social media templates for "{theme}": Instagram Story 9:16 + cover banner 16:9, brand palette [palette hex], bold rounded type, hand-drawn sticker accents. Editable, on-brand.',
          fields: [
            { name: 'templatesConcept', label: 'Concept templates (format, elements recurrents)', rows: 2, placeholder: 'Bandeau couleur, zone titre, picto, espace produit...' },
            { name: 'templatesPrompt', label: 'Prompt / liens des templates', rows: 2, placeholder: 'Collez prompts ou liens des visuels generes...' }
          ]
        },
        {
          id: 'brand-archetype',
          title: 'Archetype de marque',
          desc: 'Archetype principal + secondaire (parmi les 12 de Jung)',
          aiTool: 'ChatGPT / Claude',
          prompt: 'Choisis l\'archetype de marque de "{theme}" parmi les 12 de Jung (Innocent, Sage, Explorateur, Hors-la-loi, Magicien, Heros, Amoureux, Bouffon, Monsieur-tout-le-monde, Soignant, Createur, Souverain). Donne 1 archetype principal + 1 secondaire, leurs traits, le ton de voix, 2 marques de reference, et les implications creatives (couleurs, typo, style de copy).',
          fields: [
            { name: 'archMain', label: 'Archetype principal + secondaire', placeholder: 'Ex: Le Bouffon (principal) + Le Createur (secondaire)' },
            { name: 'archTraits', label: 'Traits, ton, marques de reference', rows: 3, placeholder: 'Traits : ... / Ton : ... / Marques : ...' },
            { name: 'archImplications', label: 'Implications creatives (couleur/typo/copy)', rows: 2, placeholder: 'Couleurs : ... / Typo : ... / Copy : ...' }
          ]
        },
        {
          id: 'brand-story',
          title: 'Storytelling / manifeste de marque',
          desc: 'Recit fondateur, ennemi, golden circle, manifeste',
          aiTool: 'ChatGPT / Claude',
          prompt: 'Ecris le storytelling de marque de "{theme}" : 1) recit fondateur (origine, declic), 2) l\'ennemi que la marque combat, 3) le golden circle (why / how / what), 4) un manifeste de marque de 100-150 mots, percutant et incarnant le ton.',
          fields: [
            { name: 'storyOrigin', label: 'Recit fondateur + ennemi', rows: 3, placeholder: 'Origine : ... / Declic : ... / Ennemi : ...' },
            { name: 'storyGolden', label: 'Golden circle (why / how / what)', rows: 2, placeholder: 'Why : ... / How : ... / What : ...' },
            { name: 'storyManifesto', label: 'Manifeste de marque (100-150 mots)', rows: 4, placeholder: 'Nous croyons que ...' }
          ]
        },
        {
          id: 'tagline-system',
          title: 'Systeme de slogans',
          desc: 'Tagline principale + variantes par canal',
          aiTool: 'ChatGPT / Claude',
          prompt: 'Cree le systeme de slogans de "{theme}" (ton [adjectifs charte]) : 1 tagline principale (signature de marque) + 3-5 variantes selon l\'usage (pub courte, packaging, reseaux, accroche site). Ajoute les regles d\'emploi (quand utiliser quoi).',
          fields: [
            { name: 'taglineMain', label: 'Tagline principale', placeholder: 'Ex: "La tomate qui a du peps."' },
            { name: 'taglineVariants', label: '3-5 variantes par usage', rows: 3, placeholder: 'Pub : ... / Packaging : ... / Reseaux : ... / Site : ...' },
            { name: 'taglineRules', label: 'Regles d\'emploi', rows: 2, placeholder: 'Quand utiliser la principale vs les variantes...' }
          ]
        },
        {
          id: 'iconography',
          title: 'Iconographie / systeme de pictos',
          desc: 'Style des icones + set de 8-12 pictos cles',
          aiTool: 'Recraft / FLUX (HF)',
          prompt: 'Set of brand icons / pictograms for "{theme}", consistent line style, [palette], rounded, friendly, flat vector, same grid and stroke. 8-12 key icons (livraison, qualite, eco, communaute...).',
          fields: [
            { name: 'iconStyle', label: 'Style des icones (trait, grille, regles)', rows: 2, placeholder: 'Style : ligne 2px arrondie, grille 24px, couleur unique...' },
            { name: 'iconSet', label: 'Liste des 8-12 pictos cles', rows: 2, placeholder: '1. livraison 2. qualite 3. eco 4. communaute ...' },
            { name: 'iconPrompt', label: 'Prompt / liens des pictos generes', rows: 2, placeholder: 'Collez prompts ou liens...' }
          ]
        },
        {
          id: 'photo-style',
          title: 'Style photo / illustration',
          desc: 'Direction imagee : sujets, lumiere, couleurs, do/don\'t',
          aiTool: 'Stable Diffusion 3.5 (HF) / FLUX (HF)',
          prompt: 'Photography / illustration style guide for "{theme}": subjects, framing, lighting, color grading, mood, do and don\'t. Generate 3 reference visuals that exemplify the style. [palette], [3 adjectifs charte].',
          fields: [
            { name: 'photoDirection', label: 'Direction imagee (sujets, cadrage, lumiere, couleurs)', rows: 3, placeholder: 'Sujets : ... / Cadrage : ... / Lumiere : ... / Couleurs : ...' },
            { name: 'photoDoDont', label: 'Do / Don\'t images', rows: 2, placeholder: 'YES : lumiere chaude, gros plans... / NO : fonds gris, stock photo...' },
            { name: 'photoPrompt', label: 'Prompt / liens des 3 visuels de reference', rows: 2, placeholder: 'Collez prompts ou liens...' }
          ]
        },
        {
          id: 'brand-applications',
          title: 'Applications de marque',
          desc: 'Papeterie, merch, signature mail, avatars reseaux',
          aiTool: 'Canva / FLUX (HF) / Mockey.ai',
          prompt: 'Decline l\'identite de "{theme}" sur ses applications : carte de visite, signature email, merch (tote bag, t-shirt, sticker), avatar + banniere pour les reseaux. Donne le concept de chaque application + genere les mockups.',
          fields: [
            { name: 'appStationery', label: 'Papeterie (carte de visite, signature mail)', rows: 2, placeholder: 'Carte : ... / Signature : ...' },
            { name: 'appMerch', label: 'Merch (tote, t-shirt, sticker)', rows: 2, placeholder: 'Tote : ... / T-shirt : ... / Sticker : ...' },
            { name: 'appSocial', label: 'Avatars & bannieres reseaux + liens mockups', rows: 2, placeholder: 'Avatar : ... / Banniere : ... / liens : ...' }
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
          aiTool: 'Stable Diffusion 3.5 (HF) / FLUX (HF)',
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
        },
        {
          id: 'social-content',
          title: 'Contenus social (captions, hooks, posts)',
          desc: '5 captions IG + 5 hooks TikTok + 5 posts X + microcopy',
          aiTool: 'ChatGPT / Claude',
          prompt: 'Pour "{theme}" (ton [adjectifs charte]), ecris : 5 captions Instagram, 5 hooks TikTok (3 premieres secondes, accrocheurs), 5 posts X courts et taquins, et 5 microcopies UI (bouton, email capture, confirmation, rupture, 404).',
          fields: [
            { name: 'captionsIG', label: '5 captions Instagram', rows: 3, placeholder: '1. ...\n2. ...\n3. ...\n4. ...\n5. ...' },
            { name: 'hooksTikTok', label: '5 hooks TikTok (3 sec)', rows: 3, placeholder: '1. POV : ...\n2. ...' },
            { name: 'postsX', label: '5 posts X', rows: 2, placeholder: '1. ...\n2. ...' },
            { name: 'microcopy', label: 'Microcopy UI (5)', rows: 2, placeholder: 'Bouton : ... / Email capture : ... / Confirmation : ...' }
          ]
        },
        {
          id: 'jingle',
          title: 'Jingle / sonic branding',
          desc: 'Composez un jingle court + une signature sonore (sonic logo)',
          aiTool: 'Suno / Udio',
          prompt: 'Brief de jingle pour "{theme}" : ambiance [3 adjectifs charte], tempo, instruments, voix (oui/non), duree 10-15s, + un sonic logo de 2s. Genere avec Suno, ecoute, garde la meilleure version et colle le lien.',
          fields: [
            { name: 'jingleBrief', label: 'Brief du jingle (ambiance, tempo, instruments)', rows: 3, placeholder: 'Ambiance pop joyeuse, tempo 110 bpm, ukulele + claps, voix "la la"...' },
            { name: 'jingleUrl', label: 'Lien du jingle genere (Suno)', placeholder: 'https://suno.com/song/...' }
          ]
        },
        {
          id: 'voiceover',
          title: 'Voix-off pub / ASMR',
          desc: 'Voix-off de la pub + variante ASMR sensorielle',
          aiTool: 'ElevenLabs',
          prompt: 'Ecris un script de voix-off de 20s pour la pub de "{theme}" (ton [charte]) + une variante ASMR/sensorielle (gros plans, sons du produit). Genere la voix en francais avec ElevenLabs et colle le lien.',
          fields: [
            { name: 'voiceoverScript', label: 'Script voix-off (20s) + variante ASMR', rows: 4, placeholder: 'PUB : ...\nASMR : ...' },
            { name: 'voiceoverUrl', label: 'Lien de la voix generee (ElevenLabs)', placeholder: 'https://elevenlabs.io/...' }
          ]
        },
        {
          id: 'manifesto-video',
          title: 'Video manifeste de lancement',
          desc: 'Film manifeste 30-60s qui pose la marque',
          aiTool: 'Runway / Kling / Sora',
          prompt: 'Ecris le script + storyboard d\'une video manifeste de 30-60s pour "{theme}" : intention, 5-6 plans cles (description visuelle), textes a l\'ecran, musique/voix. Genere quelques plans avec Runway ou Kling et colle le lien.',
          fields: [
            { name: 'manifestoStoryboard', label: 'Script + storyboard (plans, texte ecran)', rows: 5, placeholder: 'Plan 1 (0-5s) : ... | Texte : ...\nPlan 2 : ...' },
            { name: 'manifestoUrl', label: 'Lien de la video / des plans generes', placeholder: 'https://...' }
          ]
        },
        {
          id: 'social-video',
          title: 'Reel / TikTok + challenge UGC',
          desc: 'Reel produit/recette + concept de challenge UGC',
          aiTool: 'Kling / CapCut / HeyGen',
          prompt: 'Concois 1 Reel/TikTok de 15-20s pour "{theme}" (hook 3s, plans, son/musique, texte) + 1 concept de challenge UGC (hashtag, mecanique, incentive). Genere une demo video et colle le lien.',
          fields: [
            { name: 'reelConcept', label: 'Concept Reel/TikTok (hook, plans, son)', rows: 3, placeholder: 'Hook : ... | Plans : ... | Son : ...' },
            { name: 'ugcChallenge', label: 'Challenge UGC (hashtag, mecanique, incentive)', rows: 2, placeholder: '#TonHashtag — montre ... — a gagner : ...' },
            { name: 'reelUrl', label: 'Lien de la video generee', placeholder: 'https://...' }
          ]
        },
        {
          id: 'retail-plv',
          title: 'Affiche PLV / stop-rayon (retail)',
          desc: 'Affiche OOH + stop-rayon lisibles a 3 metres',
          aiTool: 'FLUX (HF) / Ideogram (texte)',
          prompt: 'Retail poster + shelf stopper for "{theme}", big wordmark "{name}", punchline, brand palette [palette hex], readable at 3 meters, bold pop style, high contrast. --ar 3:4',
          fields: [
            { name: 'plvConcept', label: 'Concept PLV (message, accroche, format)', rows: 2, placeholder: 'Stop-rayon qui "crie" avec humour, punchline courte, gros visuel produit...' },
            { name: 'plvPrompt', label: 'Prompt / liens des visuels PLV', rows: 2, placeholder: 'Collez prompts ou liens des visuels generes...' }
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
          id: 'email-sequence',
          title: 'Sequence email de lancement (6)',
          desc: 'Teasing -> drop -> preuve sociale -> abonnement -> bilan retail',
          aiTool: 'ChatGPT / Claude',
          prompt: 'Ecris une sequence de 6 emails de lancement pour "{theme}" (ton [adjectifs charte]) : 1) bienvenue waitlist, 2) J-7, 3) drop officiel, 4) preuve sociale J+5, 5) lancement abonnement, 6) bilan + arrivee retail. Pour chacun : objet + coeur du message + CTA.',
          fields: [
            { name: 'emailSequence', label: 'Les 6 emails (objet + message + CTA)', rows: 6, placeholder: 'Email 1 (waitlist) — Objet : ... | Message : ... | CTA : ...\nEmail 2 (J-7) — ...' }
          ]
        },
        {
          id: 'gtm-plan',
          title: 'Go-to-market 12 semaines & KPIs',
          desc: '3 temps (pre-lancement / lancement / post) + KPIs funnel',
          aiTool: 'ChatGPT / Claude',
          prompt: 'Construis le go-to-market 12 semaines de "{theme}" en 3 temps : PRE-LANCEMENT (S1-4, intriguer), LANCEMENT (S5-8, exploser), POST-LANCEMENT (S9-12, fideliser). Pour chaque temps : objectif, 3-4 actions cles, KPIs. Puis des KPIs par etage de funnel (notoriete -> retention).',
          fields: [
            { name: 'gtmPhases', label: '3 temps (objectif + actions cles)', rows: 5, placeholder: 'PRE-LANCEMENT : objectif ... actions ...\nLANCEMENT : ...\nPOST-LANCEMENT : ...' },
            { name: 'gtmKpis', label: 'KPIs par etage du funnel', rows: 3, placeholder: 'Notoriete : reach... / Acquisition : emails, CPL... / Conversion : ROAS... / Retention : taux abo, NPS...' }
          ]
        },
        {
          id: 'display-ads',
          title: 'Bannieres display & ad copy',
          desc: 'Set display 3 formats + ad copy acquisition/retargeting',
          aiTool: 'FLUX (HF) + ChatGPT',
          prompt: 'Cree un set de bannieres display pour "{theme}" (300x250, 728x90, 320x50) : 1 concept visuel coherent avec la charte + ad copy court pour 3 usages (acquisition, retargeting, challenge). Genere les visuels et colle les liens.',
          fields: [
            { name: 'displayConcept', label: 'Concept visuel (3 formats)', rows: 2, placeholder: 'Visuel produit + accroche + CTA Jaune Soleil, decline en 300x250 / 728x90 / 320x50...' },
            { name: 'adCopy', label: 'Ad copy (acquisition / retargeting / challenge)', rows: 3, placeholder: 'Acquisition : Titre ... Texte ... CTA ...\nRetargeting : ...\nChallenge : ...' },
            { name: 'displayUrl', label: 'Liens des bannieres generees', placeholder: 'https://...' }
          ]
        },
        {
          id: 'final-deck',
          title: 'Deck slide anime (livrable final)',
          desc: 'Assemblez TOUS vos contenus (strategie, visuels, audio, video, copy) en un deck slide anime presentable',
          aiTool: 'Gamma / Canva / Tome',
          prompt: 'Construis un deck slide ANIME de 10-12 slides pour "{theme}" qui raconte toute la campagne en integrant les assets produits (logo, packaging, visuels, jingle, video manifeste, copy, plan media). Slides : couverture, insight, marche & positionnement, plateforme de marque, identite (logo/packaging), contenus & assets (visuels/audio/video), plan media & GTM, KPIs, demande, contact. Utilise Gamma ou Canva pour les animations.',
          fields: [
            { name: 'deckPlan', label: 'Plan des slides (avec les assets integres)', rows: 6, placeholder: '1. Couverture (logo)\n2. Insight\n3. Marche & positionnement\n4. Plateforme de marque\n5. Identite (logo + packaging)\n6. Contenus (visuels + jingle + video)\n7. Plan media & GTM\n8. KPIs\n9. Demande\n10. Contact' },
            { name: 'deckUrl', label: 'Lien du deck anime final (partageable)', placeholder: 'https://gamma.app/... ou https://canva.com/...' }
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
      '<p class="theme-selection-subtitle">3 produits fictifs tires au hasard parmi ' + PRODUCT_THEMES.length + '. Choisissez celui que vous voulez transformer en campagne marketing complete. Pas de stress : vous pourrez <strong>changer de sujet a tout moment</strong> depuis le Game.</p>' +
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
      '<div style="text-align:center;margin:.6rem 0"><button class="btn-outline" id="btn-reroll-themes">🎲 Voir 3 autres sujets</button></div>' +
      '<p class="theme-selection-hint">💡 Astuce : choisissez celui qui vous inspire le plus — et changez-en quand vous voulez.</p>' +
      '</div>';

    document.body.appendChild(overlay);

    var rerollBtn = overlay.querySelector('#btn-reroll-themes');
    if (rerollBtn) rerollBtn.addEventListener('click', function () {
      st.themeChoices = pickRandomThemes(3);
      if (AIA.saveState) AIA.saveState();
      showThemeSelection(onConfirm);
    });

    overlay.querySelectorAll('.btn-choose-theme').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.theme-choice-card');
        var id = card.getAttribute('data-theme-id');
        var theme = PRODUCT_THEMES.find(function (t) { return t.id === id; });
        if (!theme) return;
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
  // Badge de statut d'acces d'un outil (gratuit / compte / essai) d'apres window.AIA.TOOL_ACCESS (par domaine).
  function toolAccessBadge(url) {
    try {
      var TA = (window.AIA && window.AIA.TOOL_ACCESS) || {};
      var host = '';
      try { host = new URL(url).hostname.replace(/^www\./, ''); } catch (e) { host = ''; }
      if (/\.hf\.space$/.test(host)) host = 'huggingface.co'; // les Spaces -> compte HF
      var info = TA[host];
      if (!info) { for (var k in TA) { if (url.indexOf(k) > -1) { info = TA[k]; break; } } }
      if (!info || !info.access) return '';
      var m = { free: ['🆓', 'Gratuit'], account: ['🔑', 'Compte gratuit'], trial: ['🎁', 'Essai gratuit'], paid: ['💳', 'Payant'] };
      var b = m[info.access]; if (!b) return '';
      return '<span class="tool-access-badge" title="' + escapeHtml(info.note || '') + '" style="font-size:.66rem;font-weight:700;margin-left:.25rem;padding:.02rem .3rem;border-radius:5px;background:rgba(255,255,255,0.08);white-space:nowrap">' + b[0] + ' ' + b[1] + '</span>';
    } catch (e) { return ''; }
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
      '<button class="btn-ghost btn-xs" id="btn-change-theme-top" style="margin-top:.35rem">🔄 Changer de sujet</button>' +
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

    // Cahier des charges du projet — debloque apres la selection, explique tous les attendus
    html += '<details class="game-brief glass-card" open style="margin-bottom:1rem;padding:1rem 1.2rem;border-left:3px solid var(--red)">' +
      '<summary style="cursor:pointer;font-weight:700">📋 Cahier des charges — ce qui est attendu pour ' + escapeHtml(theme.name) + '</summary>' +
      // Fiche du sujet choisi — consultable a tout moment (rappel du brief produit)
      '<div class="game-project-fiche" style="margin:.6rem 0;padding:.7rem .9rem;background:rgba(255,255,255,0.03);border:1px solid var(--border-glass);border-radius:10px">' +
        '<div style="font-weight:700;font-size:.9rem;margin-bottom:.2rem">' + theme.emoji + ' ' + escapeHtml(theme.name) + ' <span style="color:var(--text-muted);font-weight:500">&bull; ' + escapeHtml(theme.category || '') + '</span></div>' +
        '<p style="font-size:.84rem;margin:.2rem 0">' + escapeHtml(theme.description || theme.tagline || '') + '</p>' +
        '<ul style="margin:.3rem 0 0 1.1rem;font-size:.82rem;color:var(--text-secondary)">' +
          (theme.target ? '<li>🎯 <strong>Cible</strong> : ' + escapeHtml(theme.target) + '</li>' : '') +
          (theme.price ? '<li>💶 <strong>Prix</strong> : ' + escapeHtml(theme.price) + '</li>' : '') +
          (theme.usp ? '<li>⭐ <strong>Atout cle (USP)</strong> : ' + escapeHtml(theme.usp) + '</li>' : '') +
        '</ul>' +
      '</div>' +
      '<p style="color:var(--text-muted);font-size:.85rem;margin:.5rem 0">Mission : construire la <strong>campagne marketing complete</strong> de ' + escapeHtml(theme.name) + ' en 4 phases (12 livrables) puis un <strong>site vitrine</strong>. Pour chaque brique : utilise un vrai outil IA, colle ta production, puis valide (notee). <em>Tout se sauvegarde automatiquement.</em></p>' +
      Object.keys(PHASES_GUIDE).map(function (pk) { var ph = PHASES_GUIDE[pk]; return '<div style="margin:.4rem 0"><strong>' + ph.icon + ' ' + escapeHtml(ph.title) + '</strong><ul style="margin:.2rem 0 .2rem 1.1rem;font-size:.84rem">' + ph.steps.map(function (s) { return '<li>' + escapeHtml(s.title) + ' — <span style="color:var(--text-muted)">' + escapeHtml(s.desc) + '</span></li>'; }).join('') + '</ul></div>'; }).join('') +
      '<div style="font-size:.84rem;margin-top:.4rem">🌐 <strong>Livrable final</strong> : genere ton <strong>site vitrine</strong> depuis le Carnet. &bull; <a href="consignes.html" target="_blank" rel="noopener" style="color:var(--red-light)">📄 Tous les attendus &amp; criteres detailles ↗</a></div>' +
      '</details>';

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
          // Plus de verrou dur : une brique finalisee reste TOUJOURS editable et re-finalisable (ecrase le score).
          var locked = false;
          var score = valInfo ? valInfo.score : null;
          var done = !!st.gameDeliverables[step.id];
          var data = st.campaignData[step.id] || {};
          // Chainage des livrables : injecter le travail amont (persona/ton/positionnement/nom) dans les prompts aval,
          // au lieu de laisser des placeholders [persona]/[adjectifs charte] jamais remplis -> campagnes coherentes.
          var _cd = st.campaignData || {};
          var _cv = function (s, f, fb) { return (_cd[s] && _cd[s][f] && String(_cd[s][f]).trim()) || fb; };
          var _persona = _cv('target-persona', 'personaName', 'votre persona cible (defini en Phase 1)');
          var _tone = _cv('brand-guide', 'tone', 'le ton de votre charte (defini en Phase 2)');
          var _posi = _cv('market-analysis', 'positioning', '');
          var _bname = _cv('brand-name', 'finalName', theme.name);
          var promptText = step.prompt
            .replace(/{theme}/g, theme.name + ' (' + theme.description + ')')
            .replace(/\[persona\]/gi, _persona)
            .replace(/\[adjectifs charte\]/gi, _tone)
            .replace(/{persona}/g, _persona).replace(/{tone}/g, _tone)
            .replace(/{positioning}/g, _posi).replace(/{name}/g, _bname);
          // "Noter par l'IA" : prompt d'auto-critique a coller dans une vraie IA (feedback qualitatif reel)
          var critiquePrompt = 'Tu es un jury marketing exigeant (atelier IDRAC). Evalue mon livrable pour l etape "' + step.title + '". Donne : une note sur 100, 3 points forts, 3 axes d amelioration concrets et actionnables, puis une version amelioree. Mon livrable :\n[colle ici ta production]';
          var statusIcon = done ? '✅' : '⬜';
          var scoreBadge = (score != null) ? '<span class="game-step-scorebadge ' + scoreClass(score) + '">' + score + '/100</span>' : '';
          // Meta etape : attendu concret + technos recommandees (HF en modale / LLM en lien)
          var _meta = STEP_META[step.id] || {};
          var expectedHtml = _meta.expected ? '<div class="game-step-expected" style="background:rgba(245,183,49,0.08);border-left:3px solid var(--gold);padding:.5rem .7rem;border-radius:8px;margin:.5rem 0;font-size:.84rem"><strong>&#127919; Attendu :</strong> ' + escapeHtml(_meta.expected) + '</div>' : '';
          var techHtml = (_meta.tech || []).map(function (t) {
            var badge = toolAccessBadge(t.url);
            if (t.kind === 'hf') return '<button class="btn-outline btn-xs btn-test-tech" data-url="' + t.url + '" data-label="' + escapeHtml(t.label) + '">&#129514; Tester : ' + escapeHtml(t.label) + '</button>' + badge;
            return '<a class="btn-outline btn-xs ia-tool-link" href="' + t.url + '" target="_blank" rel="noopener">&#129514; ' + escapeHtml(t.label) + ' &#8599;</a>' + badge;
          }).join(' ');
          // Guide enrichi (outil gratuit + checklist "avoir tout" + pas-a-pas + prompt exemple)
          var _guide = (window.AIA.STEP_GUIDE && window.AIA.STEP_GUIDE[step.id]) || null;
          var guideHtml = '';
          if (_guide) {
            var _ft = _guide.freeTool || null;
            var ftBtn = _ft ? '<a class="btn-primary btn-xs" href="' + _ft.url + '" target="_blank" rel="noopener">🆓 ' + escapeHtml(_ft.label) + ' ↗</a>' + toolAccessBadge(_ft.url) + (_ft.why ? ' <span style="font-size:.8rem;color:var(--text-muted)">' + escapeHtml(_ft.why) + '</span>' : '') : '';
            var altBtns = (_guide.altTools || []).map(function (t) { return '<a class="btn-outline btn-xs ia-tool-link" href="' + t.url + '" target="_blank" rel="noopener">' + escapeHtml(t.label) + ' ↗</a>' + toolAccessBadge(t.url); }).join(' ');
            var clHtml = (_guide.checklist || []).map(function (c) { return '<li>' + escapeHtml(c) + '</li>'; }).join('');
            var gsHtml = (_guide.guide || []).map(function (g) { return '<li>' + escapeHtml(g) + '</li>'; }).join('');
            var pex = _guide.promptExample ? '<div style="margin:.4rem 0"><strong>📝 Prompt exemple :</strong><div class="game-step-prompt-text" style="margin:.2rem 0">' + escapeHtml(_guide.promptExample) + '</div><button class="btn-outline btn-xs btn-copy-prompt" data-prompt="' + encodeURIComponent(_guide.promptExample) + '">📋 Copier ce prompt</button></div>' : '';
            guideHtml = '<details class="game-step-guide" style="margin:.5rem 0;border:1px solid var(--border-glass);border-radius:10px;padding:.4rem .8rem;background:rgba(46,204,113,0.05)">' +
              '<summary style="cursor:pointer;font-weight:700">📚 Guide complet + outil IA gratuit — tout ce qu\'il faut produire</summary>' +
              (ftBtn ? '<div style="margin:.5rem 0"><strong>🆓 Outil gratuit recommande :</strong><div style="margin:.25rem 0">' + ftBtn + '</div>' + (altBtns ? '<div style="font-size:.78rem;color:var(--text-muted);margin-top:.2rem">Alternatives gratuites : ' + altBtns + '</div>' : '') + '</div>' : '') +
              (clHtml ? '<div style="margin:.4rem 0"><strong>✅ A produire (avoir TOUT) :</strong><ul style="margin:.2rem 0 .2rem 1.1rem;font-size:.83rem">' + clHtml + '</ul></div>' : '') +
              (gsHtml ? '<div style="margin:.4rem 0"><strong>🧭 Pas a pas avec l\'outil :</strong><ol style="margin:.2rem 0 .2rem 0;font-size:.83rem;list-style:none;padding-left:.2rem">' + gsHtml + '</ol></div>' : '') +
              pex +
              '</details>';
          }
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
            expectedHtml +
            guideHtml +
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
            techHtml +
            '<button class="btn-outline btn-xs btn-copy-prompt" data-prompt="' + encodeURIComponent(critiquePrompt) + '">🤖 Prompt de notation IA</button>' +
            '</div>' +
            '<p class="game-step-howto">1) Copiez le prompt &bull; 2) Ouvrez un outil IA &bull; 3) <strong>Collez la VRAIE reponse de l\'IA ci-dessous</strong> &bull; 4) Validez pour la noter</p>' +
            '</div>' +
            '<div class="game-step-fields">' +
            step.fields.map(function (f) {
              var val = data[f.name] || '';
              if (f.rows) {
                return '<div class="form-group"><label>' + f.label + '</label>' +
                  '<textarea data-step="' + step.id + '" data-field="' + f.name + '" rows="' + f.rows + '" maxlength="4000" placeholder="' + (f.placeholder || '') + '">' + escapeHtml(val) + '</textarea></div>';
              } else {
                return '<div class="form-group"><label>' + f.label + '</label>' +
                  '<input type="text" data-step="' + step.id + '" data-field="' + f.name + '" maxlength="500" placeholder="' + (f.placeholder || '') + '" value="' + escapeHtml(val) + '"></div>';
              }
            }).join('') +
            '</div>' +
            // Reponse de reference (EcoMush) — visible UNIQUEMENT en vue formateur
            ((AIA.isFormateurView && AIA.isFormateurView() && AIA.CORRIGES && AIA.CORRIGES.gameRef && AIA.CORRIGES.gameRef[step.id]) ?
              '<details class="formateur-corrige" style="border-left:3px solid #2ecc71;background:rgba(46,204,113,0.06);padding:.55rem .8rem;border-radius:8px;margin:.6rem 0">' +
              '<summary style="cursor:pointer;color:#2ecc71;font-weight:700;font-size:.85rem">&#127891; Reponse de reference (EcoMush) — formateur</summary>' +
              step.fields.map(function (f) { var rv = AIA.CORRIGES.gameRef[step.id][f.name]; return rv ? '<div style="margin:.35rem 0;font-size:.83rem"><strong>' + escapeHtml(f.label) + ' :</strong><br>' + escapeHtml(rv).replace(/\n/g, '<br>') + '</div>' : ''; }).join('') +
              '</details>' : '') +
            renderAssetsBlock(step.id, data.assets || []) +
            '<p class="game-step-validate-note">✅ <strong>Marquer comme finalise</strong> note votre brique (auto-evaluation) et la compte comme rendu. Vous pouvez la <strong>modifier et re-finaliser a tout moment</strong> — tout est sauvegarde en continu dans votre Notebook.</p>' +
            '<div class="game-step-actions">' +
            '<button class="btn-primary btn-validate-step" data-step-id="' + step.id + '">' + (done ? '🔄 Mettre a jour le rendu' : '✅ Marquer comme finalise') + '</button>' +
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
      '<div style="display:flex;gap:.5rem;flex-wrap:wrap;align-items:center;margin:.5rem 0">' +
        '<span style="font-size:.85rem;color:var(--text-muted)">📤 Exporter ma campagne :</span>' +
        '<button class="btn-primary btn-sm" id="btn-export-json">{ } JSON</button>' +
        '<button class="btn-outline btn-sm" id="btn-export-pdf">📄 PDF</button>' +
        '<button class="btn-outline btn-sm" id="btn-export-zip">🗜️ ZIP</button>' +
      '</div>' +
      '<button class="btn-outline" id="btn-change-theme">🔄 Changer de projet</button>' +
      '<div id="case-study-link" style="margin-top:.6rem"></div>' +
      '</div>';

    main.innerHTML = html;

    // Bouton « Cas complet » (exemple importe par le formateur) — visible par tous si publie
    if (AIA.db) AIA.db.ref('config/caseStudy').once('value', function (s) {
      var c = s.val(); var el = document.getElementById('case-study-link');
      if (c && c.url && el) {
        el.innerHTML = '<a class="btn-outline btn-sm" href="' + escapeHtml(c.url) + '" target="_blank" rel="noopener">📚 Voir un cas complet (exemple)' + (c.name ? ' — ' + escapeHtml(c.name) : '') + '</a>';
      }
    });

    main.querySelectorAll('.game-step-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = this.closest('.game-step-card');
        var body = card.querySelector('.game-step-body');
        if (!body) return;
        var willShow = body.style.display === 'none';
        body.style.display = willShow ? 'block' : 'none';
        // Étape validée : libellé dynamique + focus du 1er champ pour modifier tout de suite
        if (card.classList.contains('done')) this.textContent = willShow ? 'Replier' : 'Modifier';
        if (willShow) {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          var first = body.querySelector('textarea, input[type="text"]');
          if (first) setTimeout(function () { try { first.focus(); } catch (e) {} }, 220);
        }
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

    // Tester une techno HuggingFace directement dans le site (modale)
    main.querySelectorAll('.btn-test-tech').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var url = this.getAttribute('data-url'), label = this.getAttribute('data-label') || 'Demo';
        if (AIA.openHfDemo) AIA.openHfDemo(url, label); // demos HF : banniere login + apercu + ouvrir onglet
        else if (AIA.openIframeModal) AIA.openIframeModal(url, label);
        else window.open(url, '_blank', 'noopener');
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

    // Auto-sauvegarde : tout champ rempli est persiste en DB (debounce via saveState), sans clic ni validation
    main.querySelectorAll('[data-step][data-field]').forEach(function (el) {
      el.addEventListener('input', function () {
        var sid = this.getAttribute('data-step'), fld = this.getAttribute('data-field');
        st.campaignData = st.campaignData || {}; st.campaignData[sid] = st.campaignData[sid] || {};
        st.campaignData[sid][fld] = this.value;
        if (AIA.saveState) AIA.saveState();
      });
    });

    main.querySelectorAll('.btn-validate-step').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var stepId = this.getAttribute('data-step-id');
        var ok = saveStepData(stepId, main, true);
        if (!ok) { AIA.showToast('Collez votre reponse IA (au moins 1 champ) avant de finaliser', 'warning'); return; }
        // Reset systematique des indices de guidage (evite une banniere obsolete)
        _suggestNextStepId = null; _justCompletedTitle = '';
        var wasDone = !!st.gameDeliverables[stepId];
        // Auto-evaluation — brique finalisee mais TOUJOURS re-editable / re-finalisable (ecrase le score)
        var stepObj = orderedSteps().find(function (s) { return s.id === stepId; }) || { fields: [] };
        var bScore = scoreBrick(stepObj, st.campaignData[stepId] || {});
        st.gameValidation = st.gameValidation || {};
        st.gameValidation[stepId] = { finalized: true, score: bScore, ts: new Date().toISOString() };
        st.gameDeliverables[stepId] = true;
        if (!wasDone) {
          var bonus = brickBonus(bScore);
          AIA.addXP(15 + bonus, 'Brique finalisee (' + bScore + '/100)');
          AIA.showToast('✅ Brique finalisee ! Score ' + bScore + '/100 — +' + (15 + bonus) + ' XP &bull; sauvegardee dans ton Notebook', 'success');
        } else { AIA.showToast('🔄 Rendu mis a jour — nouveau score ' + bScore + '/100', 'success'); }
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
        if (AIA.saveStateNow) AIA.saveStateNow(); else if (AIA.saveState) AIA.saveState(); // anti-rollback : finalisation persistée tout de suite
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

    var bJson = document.getElementById('btn-export-json');
    if (bJson) bJson.addEventListener('click', exportCampaignJSON);
    var bPdf = document.getElementById('btn-export-pdf');
    if (bPdf) bPdf.addEventListener('click', exportCampaignPDF);
    var bZip = document.getElementById('btn-export-zip');
    if (bZip) bZip.addEventListener('click', exportCampaignZIP);

    function changeTheme() {
      // Changer de sujet a tout moment : le travail deja saisi reste sauvegarde (campaignData), seul le choix est reinitialise.
      if (!confirm('Changer de sujet ? Votre travail deja saisi reste sauvegarde dans votre Notebook ; vous choisirez un nouveau projet.')) return;
      st.productTheme = null;
      st.themeChoices = null;
      if (AIA.saveState) AIA.saveState();
      showThemeSelection(function () { renderBusinessGame(main); });
    }
    var btnChange = document.getElementById('btn-change-theme');
    if (btnChange) btnChange.addEventListener('click', changeTheme);
    var btnChangeTop = document.getElementById('btn-change-theme-top');
    if (btnChangeTop) btnChangeTop.addEventListener('click', changeTheme);

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
      // Ne PAS remonter en haut de la liste : on défile DOUCEMENT vers l'étape suivante (progression naturelle)
      setTimeout(function () { try { highlightStepCard(main, nextId, true); } catch (e) {} }, 80);
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
      // Pas de scroll automatique vers le haut : on laisse l'étudiant où il est (la bannière reste accessible en haut).
    } else if (_guideFirstStep) {
      // Cas C : juste apres le choix du projet -> guider vers la 1ere etape disponible
      _guideFirstStep = false;
      var first = orderedSteps(true).find(function (s) { return !st.gameDeliverables[s.id]; });
      if (first) setTimeout(function () { highlightStepCard(main, first.id, true); }, 250);
    }
  }

  /* ============ ASSETS BLOCK (per step) ============ */
  // Étapes où l'upload de média lourd vers le serveur (Firebase Storage) est ouvert,
  // en plus des formats de base (image/url) :
  //  - AUDIO (mp3/wav/ogg) sur les étapes son ; VIDEO (mp4/webm/mov) sur les étapes vidéo.
  var AUDIO_STEPS = ['jingle', 'voiceover'];
  var VIDEO_STEPS = ['manifesto-video', 'social-video'];
  var AUDIO_MAX_BYTES = 10 * 1024 * 1024;  // 10 Mo
  var VIDEO_MAX_BYTES = 55 * 1024 * 1024;  // 55 Mo (sous la limite Storage 60 Mo)

  function isAudioAsset(a) { return a && (a.type === 'audio' || (a.url && /\.(mp3|wav|ogg|m4a)(\?.*)?$/i.test(a.url))); }
  function isVideoAsset(a) { return a && (a.type === 'video' || (a.url && /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(a.url))); }
  function stepMediaKind(stepId) { return VIDEO_STEPS.indexOf(stepId) !== -1 ? 'video' : (AUDIO_STEPS.indexOf(stepId) !== -1 ? 'audio' : null); }

  function renderAssetsBlock(stepId, assets) {
    assets = Array.isArray(assets) ? assets : [];
    var thumbsHtml = assets.map(function (a, i) {
      var label = escapeHtml(a.label || '');
      var url = escapeHtml(a.url || '');
      if (isAudioAsset(a)) {
        return '<div class="asset-chip audio-chip" data-step-id="' + stepId + '" data-asset-idx="' + i + '" style="display:flex;flex-direction:column;gap:.25rem;padding:.5rem;min-width:230px">' +
          '<div class="asset-chip-label">🎵 ' + label + '</div>' +
          '<audio controls preload="none" src="' + url + '" style="width:100%;height:32px"></audio>' +
          '<button class="asset-chip-remove" title="Supprimer" data-remove-asset="' + i + '" data-step="' + stepId + '">✕</button>' +
          '</div>';
      } else if (isVideoAsset(a)) {
        return '<div class="asset-chip video-chip" data-step-id="' + stepId + '" data-asset-idx="' + i + '" style="display:flex;flex-direction:column;gap:.25rem;padding:.5rem;min-width:230px">' +
          '<div class="asset-chip-label">🎬 ' + label + '</div>' +
          '<video controls preload="metadata" src="' + url + '" style="width:100%;max-height:160px;border-radius:8px;background:#000"></video>' +
          '<button class="asset-chip-remove" title="Supprimer" data-remove-asset="' + i + '" data-step="' + stepId + '">✕</button>' +
          '</div>';
      } else if (a.type === 'image' || (a.url && /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(a.url))) {
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
    var mediaKind = stepMediaKind(stepId);
    var hint = mediaKind === 'video' ? '🎬 Joignez votre vidéo en MP4 (bouton Fichier, max 55 Mo) ou collez le lien'
      : (mediaKind === 'audio' ? '🎵 Joignez votre audio en MP3 (bouton Fichier, max 10 Mo) ou collez le lien'
        : 'Joignez ici vos images, audio, urls Gamma/Figma generes via les demos IA');
    var accept = mediaKind === 'video' ? 'image/*,video/*,.mp4' : (mediaKind === 'audio' ? 'image/*,audio/*,.mp3' : 'image/*');
    var fileLabel = mediaKind === 'video' ? ' (image ou MP4)' : (mediaKind === 'audio' ? ' (image ou MP3)' : '');
    return '<div class="assets-block" data-step-id="' + stepId + '">' +
      '<div class="assets-block-header">' +
      '<strong>📎 Assets generes par l\'IA (' + assets.length + ')</strong>' +
      '<span class="assets-block-hint">' + hint + '</span>' +
      '</div>' +
      '<div class="assets-list">' + (assets.length === 0 ? '<div class="assets-empty">Aucun asset attache pour le moment</div>' : thumbsHtml) + '</div>' +
      '<div class="asset-add-controls">' +
      '<input type="text" class="asset-url-input" placeholder="URL image / Gamma / Figma..." data-asset-url="' + stepId + '" maxlength="600" />' +
      '<input type="text" class="asset-label-input" placeholder="Nom (ex: Logo v2)" data-asset-label="' + stepId + '" maxlength="80" />' +
      '<button class="btn-outline btn-sm btn-add-asset-url" data-step-id="' + stepId + '">+ Ajouter</button>' +
      '<label class="btn-ghost btn-sm asset-file-label">📁 Fichier' + fileLabel +
      '<input type="file" accept="' + accept + '" data-asset-file="' + stepId + '" style="display:none" />' +
      '</label>' +
      '<span class="asset-upload-progress" data-asset-prog="' + stepId + '" style="font-size:.72rem;color:var(--text-muted)"></span>' +
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
        if (!/^https?:\/\//i.test(url)) { window.AIA.showToast('URL invalide (http(s):// requis)', 'warning'); return; } // anti-XSS (pas de javascript:)
        var type = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url) ? 'image'
          : (/\.(mp3|wav|ogg|m4a)(\?.*)?$/i.test(url) ? 'audio'
            : (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) ? 'video' : 'link'));
        addAsset(stepId, { type: type, url: url, label: label.slice(0, 80), addedAt: new Date().toISOString() });
        urlInput.value = ''; labelInput.value = '';
        window.AIA.renderBusinessGameNew(main);
      });
    });

    main.querySelectorAll('[data-asset-file]').forEach(function (input) {
      input.addEventListener('change', function () {
        var stepId = this.getAttribute('data-asset-file');
        var file = this.files[0];
        if (!file) return;
        var isAudio = /^audio\//.test(file.type) || /\.(mp3|wav|ogg|m4a)$/i.test(file.name || '');
        var isVideo = /^video\//.test(file.type) || /\.(mp4|webm|mov|m4v)$/i.test(file.name || '');
        if (isAudio || isVideo) {
          // MÉDIA lourd (jingle MP3 / vidéo MP4...) : upload sur le serveur Storage (dataURL trop lourd pour la base)
          var kind = isVideo ? 'video' : 'audio';
          var maxB = isVideo ? VIDEO_MAX_BYTES : AUDIO_MAX_BYTES;
          var maxLbl = isVideo ? '55 Mo' : '10 Mo';
          if (file.size > maxB) { window.AIA.showToast((isVideo ? 'Vidéo' : 'Audio') + ' trop gros (max ' + maxLbl + ').', 'warning'); return; }
          var st2 = window.AIA.getState();
          var key = st2.user && st2.user.accountKey;
          var storage = window.AIA.storage;
          if (!key || !storage) { window.AIA.showToast('Upload média indisponible (connexion requise).', 'error'); return; }
          var prog = main.querySelector('[data-asset-prog="' + stepId + '"]');
          var ALLOWED_EXT = isVideo ? ['mp4', 'webm', 'mov', 'm4v'] : ['mp3', 'wav', 'ogg', 'm4a'];
          var rawExt = (file.name && file.name.indexOf('.') > -1) ? file.name.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') : '';
          var ext = ALLOWED_EXT.indexOf(rawExt) !== -1 ? rawExt : (isVideo ? 'mp4' : 'mp3'); // whitelist : pas de chemin/extension exotique
          var emoji = isVideo ? '🎬' : '🎵';
          var ref = storage.ref('livebattle/' + key + '/game' + kind + '_' + Date.now() + '.' + ext);
          var task = ref.put(file, { contentType: file.type || (isVideo ? 'video/mp4' : 'audio/mpeg') });
          task.on('state_changed',
            function (s) { if (prog) prog.textContent = emoji + ' Upload ' + Math.round(s.bytesTransferred * 100 / s.totalBytes) + '%'; },
            function (err) { if (prog) prog.textContent = ''; window.AIA.showToast('Échec upload : ' + String(err && err.code || err), 'error'); },
            function () {
              ref.getDownloadURL().then(function (url) {
                if (prog) prog.textContent = '';
                addAsset(stepId, { type: kind, url: url, label: (file.name || (isVideo ? 'video.mp4' : 'audio.mp3')).slice(0, 80), addedAt: new Date().toISOString() });
                window.AIA.renderBusinessGameNew(main);
              }).catch(function () { if (prog) prog.textContent = ''; window.AIA.showToast('Échec de récupération du lien média.', 'error'); });
            });
          return;
        }
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
        var st = window.AIA.getState(); // état frais (évite d'écraser un état plus récent post-upload async)
        var stepId = this.getAttribute('data-step');
        var idx = parseInt(this.getAttribute('data-remove-asset'));
        if (!st.campaignData || !st.campaignData[stepId] || !Array.isArray(st.campaignData[stepId].assets)) return;
        if (!confirm('Supprimer cet asset ?')) return;
        st.campaignData[stepId].assets = st.campaignData[stepId].assets.filter(function (_, i) { return i !== idx; });
        if (window.AIA.saveStateNow) window.AIA.saveStateNow(); else if (window.AIA.saveState) window.AIA.saveState();
        window.AIA.renderBusinessGameNew(main);
      });
    });

    function addAsset(stepId, asset) {
      var st = window.AIA.getState(); // état frais : l'upload peut être asynchrone -> ne pas écraser un état plus récent
      st.campaignData = st.campaignData || {};
      st.campaignData[stepId] = st.campaignData[stepId] || {};
      st.campaignData[stepId].assets = st.campaignData[stepId].assets || [];
      st.campaignData[stepId].assets.push(asset);
      if (window.AIA.saveStateNow) window.AIA.saveStateNow(); else if (window.AIA.saveState) window.AIA.saveState();
      window.AIA.showToast('Asset ajoute !', 'success');
      // XP bonus first asset of the step
      if (st.campaignData[stepId].assets.length === 1 && window.AIA.addXP) window.AIA.addXP(5, 'Premier asset ajoute');
    }
  }

  /* ============ EXPORT CAMPAGNE : JSON corrigé + PDF (impression) + ZIP ============ */
  function _downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  // JSON structuré & propre : pas de dataURL géant (remplacé par un marqueur), scores + bilans inclus.
  function buildCampaignExport() {
    var st = window.AIA.getState();
    var theme = st.productTheme || {};
    var totalScore = 0, scored = 0;
    var phases = Object.keys(PHASES_GUIDE).map(function (pk) {
      var ph = PHASES_GUIDE[pk];
      var steps = (ph.steps || []).map(function (step) {
        var data = (st.campaignData && st.campaignData[step.id]) || {};
        var fields = {};
        (step.fields || []).forEach(function (f) { var v = data[f.name]; if (v && String(v).trim()) fields[f.label] = String(v); });
        var assets = (Array.isArray(data.assets) ? data.assets : []).map(function (a) {
          var u = a.url || '';
          return { type: a.type || (isVideoAsset(a) ? 'video' : (isAudioAsset(a) ? 'audio' : 'link')),
            label: a.label || '', url: (u.indexOf('data:') === 0) ? '[image intégrée — voir campagne.html / dossier assets du ZIP]' : u };
        });
        var val = (st.gameValidation && st.gameValidation[step.id]) || {};
        var validated = !!(st.gameDeliverables && st.gameDeliverables[step.id]);
        if (validated && typeof val.score === 'number') { totalScore += val.score; scored++; }
        return { id: step.id, title: step.title, validated: validated,
          score: (typeof val.score === 'number' ? val.score : null), fields: fields, assets: assets };
      }).filter(function (s) { return s.validated || Object.keys(s.fields).length || s.assets.length; });
      return { phase: ph.title, review: (st.phaseReviews && st.phaseReviews[pk]) || '', steps: steps };
    }).filter(function (p) { return p.steps.length; });
    return {
      meta: {
        student: (st.user && st.user.name) || '', theme: theme.name || '',
        themeDesc: theme.description || theme.desc || '',
        avgScore: scored ? Math.round(totalScore / scored) : null,
        exportedAt: new Date().toISOString(), app: 'AtelierIAIdrac — Campagne marketing IA'
      },
      phases: phases
    };
  }

  // Document HTML imprimable (PDF via "Enregistrer en PDF") + contenu du ZIP — images inline.
  function buildCampaignHTML() {
    var st = window.AIA.getState();
    var theme = st.productTheme || {};
    var avg = buildCampaignExport().meta.avgScore;
    var phasesHtml = Object.keys(PHASES_GUIDE).map(function (pk) {
      var ph = PHASES_GUIDE[pk];
      var stepsHtml = (ph.steps || []).map(function (step) {
        var data = (st.campaignData && st.campaignData[step.id]) || {};
        var val = (st.gameValidation && st.gameValidation[step.id]) || {};
        var validated = !!(st.gameDeliverables && st.gameDeliverables[step.id]);
        var fieldsHtml = (step.fields || []).map(function (f) {
          var v = data[f.name]; if (!v || !String(v).trim()) return '';
          return '<div class="f"><div class="fl">' + escapeHtml(f.label) + '</div><div class="fv">' + escapeHtml(String(v)).replace(/\n/g, '<br>') + '</div></div>';
        }).join('');
        var assetsHtml = (Array.isArray(data.assets) ? data.assets : []).map(function (a) {
          var u = escapeHtml(a.url || ''), lbl = escapeHtml(a.label || '');
          if (isAudioAsset(a)) return '<div class="lk">🎵 <a href="' + u + '">' + (lbl || 'audio') + '</a></div>';
          if (isVideoAsset(a)) return '<div class="lk">🎬 <a href="' + u + '">' + (lbl || 'vidéo') + '</a></div>';
          if (a.type === 'image' || /\.(png|jpe?g|gif|webp|svg)/i.test(a.url || '') || (a.url || '').indexOf('data:image') === 0) return '<img src="' + u + '" alt="' + lbl + '">';
          return '<div class="lk">🔗 <a href="' + u + '">' + (lbl || u) + '</a></div>';
        }).join('');
        if (!validated && !fieldsHtml && !assetsHtml) return '';
        return '<div class="step"><h3>' + (validated ? '✅ ' : '⬜ ') + escapeHtml(step.title) +
          (typeof val.score === 'number' ? ' <span class="sc">' + val.score + '/100</span>' : '') + '</h3>' +
          fieldsHtml + (assetsHtml ? '<div class="assets">' + assetsHtml + '</div>' : '') + '</div>';
      }).join('');
      if (!stepsHtml.replace(/\s/g, '')) return '';
      var review = (st.phaseReviews && st.phaseReviews[pk]) || '';
      return '<section><h2>' + escapeHtml(ph.title) + '</h2>' + stepsHtml +
        (review ? '<div class="review"><strong>🧐 Bilan :</strong> ' + escapeHtml(review).replace(/\n/g, '<br>') + '</div>' : '') + '</section>';
    }).join('');
    var css = 'body{font-family:Helvetica,Arial,sans-serif;color:#1d2433;max-width:820px;margin:0 auto;padding:24px;line-height:1.5}' +
      'header{border-bottom:3px solid #A71F28;padding-bottom:12px;margin-bottom:20px}h1{font-size:1.6rem;margin:0}' +
      'h2{color:#A71F28;border-left:4px solid #f5b731;padding-left:8px;margin-top:26px}h3{font-size:1rem;margin:14px 0 6px}' +
      '.sc{background:#f5b731;color:#1d2433;border-radius:6px;padding:1px 6px;font-size:.75rem}.f{margin:6px 0}' +
      '.fl{font-weight:700;font-size:.85rem;color:#555}.fv{font-size:.9rem;white-space:pre-wrap}' +
      '.assets{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}.assets img{max-width:230px;max-height:170px;border-radius:8px;border:1px solid #ddd}' +
      '.lk{font-size:.85rem}.review{background:#fff7e6;border:1px solid #f0d9a8;border-radius:8px;padding:8px 10px;font-size:.85rem;margin-top:10px}' +
      '.meta{color:#666;font-size:.8rem}@media print{a{color:#1d2433;text-decoration:none}}';
    return '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Campagne ' + escapeHtml(theme.name || 'projet') + '</title><style>' + css + '</style></head><body>' +
      '<header><h1>📢 Campagne marketing — ' + escapeHtml(theme.name || 'Projet') + '</h1>' +
      '<div class="meta">' + escapeHtml((st.user && st.user.name) || '') + (avg != null ? ' &bull; Score moyen : ' + avg + '/100' : '') + ' &bull; ' + new Date().toLocaleDateString('fr-FR') + ' &bull; AtelierIAIdrac</div></header>' +
      (phasesHtml || '<p>Aucune étape complétée pour le moment.</p>') + '</body></html>';
  }

  function exportCampaignJSON() {
    var theme = (window.AIA.getState().productTheme) || {};
    _downloadBlob(new Blob([JSON.stringify(buildCampaignExport(), null, 2)], { type: 'application/json' }), 'campagne-' + (theme.id || 'projet') + '.json');
    window.AIA.showToast('JSON exporté ✓', 'success');
  }

  function exportCampaignPDF() {
    var w = window.open('', '_blank');
    if (!w) { window.AIA.showToast('Autorise les pop-ups pour générer le PDF', 'warning'); return; }
    w.document.open(); w.document.write(buildCampaignHTML()); w.document.close();
    setTimeout(function () { try { w.focus(); w.print(); } catch (e) {} }, 500);
    window.AIA.showToast('PDF : choisis « Enregistrer au format PDF » dans l\'impression', 'info');
  }

  function _loadJSZip(cb) {
    if (window.JSZip) { cb(window.JSZip); return; }
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    s.onload = function () { cb(window.JSZip || null); };
    s.onerror = function () { cb(null); };
    document.head.appendChild(s);
  }

  function exportCampaignZIP() {
    window.AIA.showToast('Préparation du ZIP…', 'info');
    _loadJSZip(function (JSZip) {
      if (!JSZip) { window.AIA.showToast('ZIP indisponible (connexion requise pour charger JSZip)', 'error'); return; }
      var st = window.AIA.getState(); var theme = st.productTheme || {};
      var zip = new JSZip();
      zip.file('campagne.json', JSON.stringify(buildCampaignExport(), null, 2));
      zip.file('campagne.html', buildCampaignHTML());
      var n = 0; // images dataURL -> fichiers réels dans /assets
      Object.keys(st.campaignData || {}).forEach(function (sid) {
        var arr = (st.campaignData[sid] && st.campaignData[sid].assets) || [];
        arr.forEach(function (a) {
          var m = (a.url || '').match(/^data:image\/(\w+);base64,(.+)$/);
          if (m) { n++; zip.file('assets/' + sid + '_' + n + '.' + (m[1] === 'jpeg' ? 'jpg' : m[1]), m[2], { base64: true }); }
        });
      });
      zip.generateAsync({ type: 'blob' }).then(function (blob) {
        _downloadBlob(blob, 'campagne-' + (theme.id || 'projet') + '.zip');
        window.AIA.showToast('ZIP exporté ✓', 'success');
      }).catch(function () { window.AIA.showToast('Échec génération ZIP', 'error'); });
    });
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
      if (!f) return;
      var v = (el.value || '').trim();
      if (v.length > 4000) { v = v.slice(0, 4000); el.value = v; } // sécurisation : cap des saisies étudiants
      st.campaignData[stepId][f] = v;
      if (v.length > 0) filled++;
    });
    if (requireOne && filled === 0) return false;
    // Sauvegarde IMMÉDIATE (anti-rollback : la donnée d'étape ne dépend pas du debounce)
    if (AIA.saveStateNow) AIA.saveStateNow(); else if (AIA.saveState) AIA.saveState();
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
            // Anti-farm : +2 XP une seule fois par cible (re-voter apres avoir retire ne re-recompense pas)
            var _vst = window.AIA.getState();
            if (!Array.isArray(_vst.votedRewarded)) _vst.votedRewarded = [];
            if (_vst.votedRewarded.indexOf(targetKey) === -1) {
              _vst.votedRewarded.push(targetKey);
              if (window.AIA.saveState) window.AIA.saveState();
              if (window.AIA.addXP) window.AIA.addXP(2, 'Vote campagne');
            }
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
            if (isAudioAsset(a)) {
              html += '<div class="showcase-asset-audio" style="display:flex;flex-direction:column;gap:.2rem;min-width:230px"><span style="font-size:.75rem">🎵 ' + escapeHtml(a.label || 'audio') + '</span><audio controls preload="none" src="' + escapeHtml(a.url) + '" style="width:100%;height:32px"></audio></div>';
            } else if (isVideoAsset(a)) {
              html += '<div class="showcase-asset-video" style="display:flex;flex-direction:column;gap:.2rem;min-width:230px"><span style="font-size:.75rem">🎬 ' + escapeHtml(a.label || 'video') + '</span><video controls preload="metadata" src="' + escapeHtml(a.url) + '" style="width:100%;max-height:160px;border-radius:8px;background:#000"></video></div>';
            } else if (a.type === 'image' || (a.url && /\.(png|jpe?g|gif|webp|svg)/i.test(a.url))) {
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
  window.AIA.STEP_META = STEP_META;
  window.AIA.ASSET_TYPE_LABELS = ASSET_TYPE_LABELS;
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
