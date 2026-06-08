/* ==============================================
   STEP-GUIDES.JS — Guides enrichis par livrable du Business Game
   freeTool + altTools + checklist (avoir tout) + guide pas-a-pas + promptExample
   Genere par agents (4 phases). IDRAC — [AI-assisted]
   ============================================== */
window.AIA = window.AIA || {};
window.AIA.STEP_GUIDE = {
 "product-idea": {
  "freeTool": {
   "label": "ChatGPT (gratuit)",
   "url": "https://chatgpt.com",
   "why": "Idéal pour affiner un concept produit : reformule, challenge la différenciation et génère un pitch clair en quelques échanges."
  },
  "altTools": [
   {
    "label": "Claude (gratuit)",
    "url": "https://claude.ai"
   },
   {
    "label": "Google Gemini",
    "url": "https://gemini.google.com"
   }
  ],
  "checklist": [
   "Nom de travail du produit (provisoire mais mémorable)",
   "Phrase d'accroche en 1 ligne (elevator pitch)",
   "Description du produit en 3 à 5 phrases",
   "Catégorie de marché et sous-catégorie",
   "Problème principal résolu (job-to-be-done)",
   "3 bénéfices clés pour l'utilisateur",
   "Différenciation : ce qui le rend unique vs l'existant",
   "Format / forme du produit (physique, app, service, abonnement)",
   "Cas d'usage concret n°1 (situation réelle)",
   "Raison de croire (pourquoi ça marcherait)",
   "Une faiblesse / limite assumée du concept",
   "Version courte (tweet 280 caractères) du concept"
  ],
  "guide": [
   "1. Ouvre chatgpt.com et connecte-toi (compte gratuit suffisant).",
   "2. Décris en 2-3 phrases ton idée brute de produit {theme} et le public visé.",
   "3. Demande à ChatGPT de reformuler ton idée en un pitch clair de 5 phrases.",
   "4. Demande-lui 3 axes de différenciation crédibles face aux produits existants.",
   "5. Demande une liste de 3 bénéfices clés classés par impact pour l'utilisateur.",
   "6. Fais-toi challenger : demande la principale faiblesse du concept et comment la corriger.",
   "7. Demande une version courte (1 ligne) et une version tweet du concept final.",
   "8. Copie le résultat dans ton livrable et ajuste le ton/vocabulaire à ta cible."
  ],
  "promptExample": "Tu es directeur de l'innovation produit. Voici mon idée de produit : {theme}. 1) Reformule-la en un pitch clair de 5 phrases (nom de travail + problème résolu + bénéfices). 2) Donne-moi 3 axes de différenciation crédibles vs les produits existants. 3) Liste 3 bénéfices clés classés par impact. 4) Identifie la principale faiblesse du concept et propose une correction. 5) Termine par une version tweet (280 caractères max). Réponds en français, ton clair et actionnable."
 },
 "consumer-insight": {
  "freeTool": {
   "label": "AnswerThePublic",
   "url": "https://answerthepublic.com",
   "why": "Révèle les vraies questions, peurs et frustrations que les gens tapent sur Google autour d'un thème : matière première idéale pour un insight authentique."
  },
  "altTools": [
   {
    "label": "Perplexity",
    "url": "https://www.perplexity.ai"
   },
   {
    "label": "Reddit (recherche communautés)",
    "url": "https://www.reddit.com/search"
   }
  ],
  "checklist": [
   "Verbatims réels collectés (citations de vrais consommateurs)",
   "Liste des frustrations / pain points dominants",
   "Liste des désirs / aspirations profondes",
   "Tension centrale formulée (X mais Y / je veux... cependant...)",
   "Insight rédigé à la 1re personne ('Je...')",
   "Contexte / déclencheur de la tension (quand survient-elle ?)",
   "Croyance limitante ou idée reçue à déboulonner",
   "Émotion dominante associée (peur, honte, fierté, FOMO...)",
   "Lien explicite entre l'insight et le produit {theme}",
   "Vérification que l'insight n'est pas un simple besoin fonctionnel",
   "1 insight principal + 2 insights secondaires de réserve"
  ],
  "guide": [
   "1. Va sur answerthepublic.com et choisis la langue Français + pays France.",
   "2. Tape un mot-clé central lié à ton produit {theme} et lance la recherche.",
   "3. Explore les questions en 'pourquoi', 'comment', 'est-ce que' : note les frustrations récurrentes.",
   "4. Récupère 8 à 10 formulations réelles qui expriment un besoin ou une peur.",
   "5. Regroupe-les en 2-3 thèmes de tension (ex. envie vs culpabilité).",
   "6. Avec ChatGPT/Claude, transforme un thème en insight à la 1re personne ('Je veux... mais...').",
   "7. Vérifie que l'insight révèle une tension émotionnelle, pas un simple besoin produit.",
   "8. Garde 1 insight principal et formule 2 alternatives de secours."
  ],
  "promptExample": "Tu es planneur stratégique en agence de publicité. Voici des verbatims et frustrations réels de consommateurs autour du thème {theme} : [COLLE ICI tes 8-10 verbatims]. 1) Identifie la tension émotionnelle centrale (formule : 'Je veux X, mais Y'). 2) Rédige l'insight principal à la première personne, percutant et humain (2-3 phrases). 3) Précise l'émotion dominante et le déclencheur de cette tension. 4) Explique en 1 phrase comment le produit {theme} résout cette tension. 5) Propose 2 insights alternatifs. Réponds en français, ton incarné et sensible."
 },
 "target-persona": {
  "freeTool": {
   "label": "Claude (gratuit)",
   "url": "https://claude.ai",
   "why": "Excellent pour construire un persona riche et nuancé (psychologie, comportements, citations) à partir de quelques données de cadrage."
  },
  "altTools": [
   {
    "label": "ChatGPT (gratuit)",
    "url": "https://chatgpt.com"
   },
   {
    "label": "HubSpot Make My Persona",
    "url": "https://www.hubspot.com/make-my-persona"
   }
  ],
  "checklist": [
   "Prénom + âge + photo-type (description) du persona",
   "Situation socio-pro (métier, revenus, lieu de vie)",
   "Situation familiale et style de vie",
   "Objectifs personnels et professionnels",
   "Frustrations / freins / points de douleur",
   "Motivations d'achat profondes",
   "Comportement digital (réseaux, apps, supports favoris)",
   "Marques aimées / références culturelles",
   "Parcours type d'une journée (day in the life)",
   "Objection principale face au produit {theme}",
   "Citation signature qui résume le persona",
   "Critère de réussite : 'ce persona achète si...'"
  ],
  "guide": [
   "1. Va sur claude.ai et ouvre une nouvelle conversation.",
   "2. Donne le contexte : produit {theme}, marché, et l'insight consommateur trouvé à l'étape précédente.",
   "3. Demande la création d'un persona principal complet (identité, vie, objectifs, freins).",
   "4. Demande d'ajouter le comportement digital (réseaux, apps, supports) et les marques aimées.",
   "5. Demande une 'journée type' et une citation signature qui incarne le persona.",
   "6. Fais préciser l'objection n°1 du persona face au produit {theme}.",
   "7. Demande une fiche synthétique prête à coller dans un document (format structuré).",
   "8. Relis et ajuste pour que le persona reste réaliste et cohérent avec ta cible française."
  ],
  "promptExample": "Tu es responsable études consommateur. Crée un persona cible détaillé pour le produit {theme}, en t'appuyant sur cet insight : [COLLE TON INSIGHT]. Structure la fiche ainsi : 1) Identité (prénom, âge, métier, lieu, situation familiale). 2) Style de vie et journée type. 3) Objectifs et motivations profondes. 4) Frustrations et freins. 5) Comportement digital (réseaux, apps, médias) et marques aimées. 6) Objection principale face à {theme}. 7) Citation signature en une phrase. 8) Phrase 'Ce persona achète si...'. Réponds en français, réaliste et incarné, format fiche structurée."
 },
 "market-analysis": {
  "freeTool": {
   "label": "Perplexity",
   "url": "https://www.perplexity.ai",
   "why": "Recherche en temps réel avec sources citées : parfait pour cartographier concurrents, tendances et chiffres de marché vérifiables."
  },
  "altTools": [
   {
    "label": "Google Trends",
    "url": "https://trends.google.com"
   },
   {
    "label": "ChatGPT (recherche web)",
    "url": "https://chatgpt.com"
   }
  ],
  "checklist": [
   "Taille et dynamique du marché (chiffres + sources)",
   "Tableau des 4 à 6 concurrents directs",
   "Concurrents indirects / substituts identifiés",
   "Forces et faiblesses de chaque concurrent clé",
   "Positionnement prix de la concurrence (gammes)",
   "3 à 5 tendances de fond du secteur (avec preuves)",
   "Tendances émergentes / signaux faibles",
   "Opportunités de marché non couvertes (white space)",
   "Menaces et barrières à l'entrée",
   "Mapping de positionnement (2 axes pertinents)",
   "Positionnement recommandé pour {theme}",
   "Sources et liens vérifiables listés en bas"
  ],
  "guide": [
   "1. Ouvre perplexity.ai et pose une question précise sur le marché de {theme} en France.",
   "2. Demande la liste des 5 principaux concurrents avec leur positionnement et prix.",
   "3. Vérifie les sources citées par Perplexity (clique sur les liens en bas des réponses).",
   "4. Lance une 2e recherche sur les tendances du secteur des 2-3 dernières années.",
   "5. Croise avec Google Trends : tape les mots-clés clés pour valider l'intérêt dans le temps.",
   "6. Demande à Perplexity un mapping de positionnement sur 2 axes (ex. prix / innovation).",
   "7. Identifie les espaces vides (white space) où {theme} pourrait se positionner.",
   "8. Compile concurrence + tendances + positionnement recommandé, en gardant les sources."
  ],
  "promptExample": "Tu es analyste marché senior. Réalise une analyse du marché de {theme} en France. 1) Donne la taille et la dynamique du marché avec chiffres récents et sources. 2) Présente un tableau des 5 concurrents directs (positionnement, prix, force, faiblesse). 3) Liste 4 tendances de fond et 2 signaux faibles, avec preuves. 4) Identifie 2 opportunités non couvertes (white space). 5) Propose un mapping de positionnement sur 2 axes pertinents et place les concurrents. 6) Recommande un positionnement pour {theme}. Cite toutes tes sources avec liens. Réponds en français, structuré, factuel."
 },
 "brand-platform": {
  "freeTool": {
   "label": "Claude (gratuit)",
   "url": "https://claude.ai",
   "why": "Très fort pour articuler une plateforme de marque cohérente (mission, vision, RTB, personnalité) avec un raisonnement nuancé et un ton ajustable."
  },
  "altTools": [
   {
    "label": "ChatGPT (gratuit)",
    "url": "https://chatgpt.com"
   },
   {
    "label": "Napkin AI (visualisation)",
    "url": "https://www.napkin.ai"
   }
  ],
  "checklist": [
   "Mission (la raison d'être au quotidien)",
   "Vision (le monde idéal visé à long terme)",
   "Promesse de marque (le bénéfice central garanti)",
   "Reason To Believe (RTB) : preuves concrètes de la promesse",
   "Ennemi de la marque (ce contre quoi elle se bat)",
   "Personnalité de marque (3 à 5 traits)",
   "Valeurs fondamentales (3 à 5)",
   "Ton de voix (comment la marque parle)",
   "Territoire d'expression (univers, codes)",
   "Tagline / signature de marque",
   "Cohérence vérifiée avec l'insight et le persona",
   "Visuel de synthèse de la plateforme (1 schéma)"
  ],
  "guide": [
   "1. Va sur claude.ai et rappelle le contexte : produit {theme}, insight et persona définis.",
   "2. Demande de rédiger la mission et la vision (en distinguant bien les deux).",
   "3. Demande la promesse de marque et 3 Reasons To Believe concrètes.",
   "4. Fais définir 'l'ennemi' de la marque (le statu quo ou la frustration combattue).",
   "5. Demande 3 à 5 traits de personnalité et un ton de voix cohérents avec le persona.",
   "6. Demande une tagline mémorable et 2 alternatives.",
   "7. Vérifie la cohérence d'ensemble : chaque élément doit servir l'insight consommateur.",
   "8. Mets en forme sur Napkin AI pour obtenir un schéma visuel de la plateforme."
  ],
  "promptExample": "Tu es directeur de marque (brand strategist). Construis la plateforme de marque du produit {theme}, en cohérence avec cet insight : [INSIGHT] et ce persona : [PERSONA]. Livre : 1) Mission (raison d'être). 2) Vision (ambition long terme). 3) Promesse de marque. 4) 3 Reasons To Believe concrètes. 5) L'ennemi de la marque (ce contre quoi elle se bat). 6) Personnalité (3-5 traits). 7) Valeurs (3-5). 8) Ton de voix. 9) Tagline + 2 alternatives. Assure-toi que chaque élément serve l'insight. Réponds en français, ton inspirant mais précis, format structuré."
 },
 "marketing-mix": {
  "freeTool": {
   "label": "ChatGPT (gratuit)",
   "url": "https://chatgpt.com",
   "why": "Structure rapidement un marketing mix 4P complet et cohérent à partir du concept, du persona et du positionnement définis."
  },
  "altTools": [
   {
    "label": "Claude (gratuit)",
    "url": "https://claude.ai"
   },
   {
    "label": "Notion AI",
    "url": "https://www.notion.so/product/ai"
   }
  ],
  "checklist": [
   "PRODUIT : caractéristiques et bénéfices clés",
   "PRODUIT : gamme / déclinaisons / packaging",
   "PRODUIT : niveau de qualité et services associés",
   "PRIX : stratégie tarifaire (écrémage, pénétration, alignement)",
   "PRIX : prix de vente cible et justification",
   "PRIX : remises / offres / modèle (abonnement, à l'unité)",
   "PLACE : canaux de distribution (online / offline)",
   "PLACE : zone géographique et logistique",
   "PROMOTION : leviers de communication (médias, social, RP)",
   "PROMOTION : message clé et plan d'activation",
   "Cohérence des 4P entre eux et avec le positionnement",
   "Tableau de synthèse 4P prêt à présenter"
  ],
  "guide": [
   "1. Ouvre chatgpt.com et fournis le concept {theme}, le persona et le positionnement choisi.",
   "2. Demande de détailler le P 'Produit' (caractéristiques, gamme, packaging, services).",
   "3. Demande le P 'Prix' avec une stratégie justifiée et un prix cible chiffré.",
   "4. Demande le P 'Place' : canaux de distribution adaptés à ton persona.",
   "5. Demande le P 'Promotion' : leviers de com, message clé et idées d'activation.",
   "6. Fais vérifier la cohérence des 4P entre eux et avec le positionnement de marque.",
   "7. Demande un tableau de synthèse clair des 4P prêt à présenter.",
   "8. Ajuste les détails (prix, canaux) pour qu'ils soient réalistes sur le marché français."
  ],
  "promptExample": "Tu es chef de produit marketing. Construis le marketing mix 4P du produit {theme}, cohérent avec ce persona : [PERSONA] et ce positionnement : [POSITIONNEMENT]. Détaille : 1) PRODUIT (caractéristiques, bénéfices, gamme, packaging, services). 2) PRIX (stratégie tarifaire justifiée, prix cible chiffré, modèle de revenu). 3) PLACE (canaux de distribution online/offline adaptés au persona, logistique). 4) PROMOTION (leviers de communication, message clé, idées d'activation). Vérifie la cohérence des 4P entre eux. Termine par un tableau de synthèse. Réponds en français, concret et actionnable."
 },
 "brand-name": {
  "freeTool": {
   "label": "Namelix",
   "url": "https://namelix.com/",
   "why": "Generateur de noms de marque par IA, gratuit, qui propose instantanement des noms courts, mémorables et brandables avec apercu de logo et disponibilite de domaine."
  },
  "altTools": [
   {
    "label": "Shopify Business Name Generator",
    "url": "https://www.shopify.com/tools/business-name-generator"
   },
   {
    "label": "ChatGPT (OpenAI)",
    "url": "https://chat.openai.com/"
   }
  ],
  "checklist": [
   "Liste de 15-20 propositions de noms generees puis filtrees a 5 finalistes",
   "1 nom principal retenu (court, prononcable, mémorable, < 3 syllabes idealement)",
   "Verification linguistique (pas de sens negatif en FR/EN, pas d'homophonie genante)",
   "Test de disponibilite du domaine .com / .fr (Namecheap, Gandi)",
   "Verification rapide marque deposee (recherche INPI / EUIPO TMview)",
   "Disponibilite des handles reseaux sociaux (Instagram, TikTok, LinkedIn)",
   "Baseline / slogan principal (3 a 7 mots, benefice client clair)",
   "2-3 variantes de baseline (emotionnelle, fonctionnelle, aspirationnelle)",
   "Justification du nom : sens, sonorite, lien avec le positionnement",
   "Test de prononciation a voix haute et au telephone (clarte orale)",
   "Declinaison du nom : nom legal vs nom commercial vs nom de produit",
   "Mini argumentaire d'1 phrase expliquant nom + baseline ensemble"
  ],
  "guide": [
   "1. Sur namelix.com, saisis 2-3 mots-cles decrivant {theme} (univers, benefice, emotion).",
   "2. Choisis le style de nom (court, evocateur, mots reels, composes) et le degre de creativite (randomness).",
   "3. Lance la generation et parcours les propositions ; mets en favori 15-20 noms qui sonnent bien.",
   "4. Filtre a 5 finalistes selon : memorabilite, prononciation, absence de connotation negative.",
   "5. Pour chaque finaliste, verifie le domaine (.com/.fr) et les handles sociaux directement depuis la fiche.",
   "6. Fais une recherche marque sur INPI (data.inpi.fr) et EUIPO TMview pour ecarter les conflits.",
   "7. Choisis le nom principal puis demande a ChatGPT 5 baselines alignees sur ton positionnement.",
   "8. Documente le nom + baseline retenus avec une justification d'1 phrase (sens et sonorite)."
  ],
  "promptExample": "Tu es un naming strategist senior. Mon produit est {theme}, destine a [cible]. Genere 15 noms de marque courts (1-2 mots, < 3 syllabes), faciles a prononcer en francais, sans connotation negative, evocateurs du benefice principal. Pour chacun : le nom, sa logique en 5 mots, et une baseline de 4-7 mots. Puis classe le top 5 selon memorabilite et disponibilite probable de domaine."
 },
 "logo": {
  "freeTool": {
   "label": "Recraft",
   "url": "https://www.recraft.com/",
   "why": "Generateur IA specialise en design vectoriel (logos, icones) avec export SVG gratuit, controle du style et coherence de marque — le seul a sortir du vrai vectoriel editable en tier gratuit."
  },
  "altTools": [
   {
    "label": "Looka",
    "url": "https://looka.com/"
   },
   {
    "label": "Ideogram",
    "url": "https://ideogram.ai/"
   }
  ],
  "checklist": [
   "Logo principal (version couleur, format horizontal ou compact)",
   "Version monochrome noir et version monochrome blanc (pour fonds variables)",
   "Version en niveaux de gris (impression N&B)",
   "Icone / symbole seul (favicon, avatar reseaux, app icon)",
   "Logotype seul (nom en typo, sans symbole)",
   "Declinaison horizontale ET verticale (lockups)",
   "Export vectoriel SVG (scalable, editable)",
   "Exports raster PNG transparents en plusieurs tailles (512, 1024, 2048 px)",
   "Favicon 32x32 et icone app 1024x1024",
   "Zone de protection (espace de respiration minimal autour du logo)",
   "Taille minimale d'utilisation lisible definie (ex : 24 px de haut)",
   "Tests du logo sur 3 fonds (clair, sombre, photo) pour valider la lisibilite"
  ],
  "guide": [
   "1. Sur recraft.com, cree un projet et choisis le style 'Logo' ou 'Vector / Icon' dans les styles d'image.",
   "2. Redige un prompt decrivant {theme}, le symbole souhaite, le style (flat, line, geometrique) et 2-3 couleurs.",
   "3. Genere plusieurs variantes, fais varier le prompt sur la forme du symbole jusqu'a une piste forte.",
   "4. Selectionne le logo retenu et utilise l'export SVG pour obtenir un vectoriel editable.",
   "5. Recree les versions monochrome (noir, blanc, gris) en ajustant les couleurs dans Recraft ou un editeur SVG.",
   "6. Genere le symbole seul et le logotype seul pour constituer les differents lockups.",
   "7. Exporte tous les formats : SVG, PNG transparents (512/1024/2048), favicon 32px, icone 1024px.",
   "8. Teste le logo sur fond clair, fond sombre et photo, puis definis la zone de protection et la taille mini."
  ],
  "promptExample": "Logo vectoriel minimaliste pour {theme}, style [flat / line art / geometrique], symbole representant [idee centrale], palette [couleur 1] et [couleur 2], formes simples et memorables, fond transparent, equilibre et lisible meme en petite taille, esthetique moderne et premium, vectoriel propre sans degrade complexe."
 },
 "brand-guide": {
  "freeTool": {
   "label": "Canva (Brand Kit gratuit)",
   "url": "https://www.canva.com/brand/",
   "why": "Permet de centraliser logo, palette, typographies et templates dans un Brand Kit partageable, et de mettre en page une charte graphique complete avec des modeles gratuits."
  },
  "altTools": [
   {
    "label": "Realtime Colors",
    "url": "https://www.realtimecolors.com/"
   },
   {
    "label": "Fontjoy",
    "url": "https://fontjoy.com/"
   }
  ],
  "checklist": [
   "Logo et toutes ses declinaisons (principal, mono, icone) avec regles d'usage",
   "Palette complete : roles (primaire, secondaire, accent, neutres) + codes HEX/RGB",
   "Verification des contrastes WCAG AA (ratio >= 4.5:1 pour le texte courant)",
   "Systeme typographique : police titre, police corps, eventuelle police script/accent",
   "Echelle typographique (tailles H1>H2>H3>corps>legende) et interlignages",
   "Iconographie : style des icones (line / solid), epaisseur, grille de construction",
   "Grille et systeme de mise en page (colonnes, marges, espacements)",
   "Voix de marque / tone of voice : 3-5 adjectifs + exemples a dire / a eviter",
   "Lexique de marque (mots a privilegier, mots interdits, ton selon canal)",
   "Do / Don't visuels (deformations logo, mauvaises couleurs, etc.)",
   "Applications par canal (post Instagram, bandeau LinkedIn, carte de visite, email)",
   "Section accessibilite (contrastes, tailles mini, alternatives textuelles)"
  ],
  "guide": [
   "1. Dans Canva, ouvre 'Brand Hub' > Brand Kit et importe le logo (toutes versions) de {theme}.",
   "2. Definis la palette : ajoute primaire, secondaire, accent et neutres avec leurs codes HEX.",
   "3. Verifie chaque combinaison texte/fond sur realtimecolors.com pour valider le contraste WCAG AA.",
   "4. Choisis le couple de polices titre + corps (teste l'harmonie sur fontjoy.com) et fixe l'echelle de tailles.",
   "5. Cree un document Canva multi-pages 'Charte graphique' a partir d'un modele de brand guidelines.",
   "6. Remplis les sections : logo + zones de protection, palette + roles, typo + echelle, iconographie, grille.",
   "7. Redige la voix de marque (3-5 adjectifs, exemples a dire/eviter) et ajoute une page Do/Don't.",
   "8. Ajoute les pages applications par canal + accessibilite, puis exporte la charte en PDF partageable."
  ],
  "promptExample": "Agis comme directeur artistique. Pour la marque {theme} (positionnement : [...], cible : [...]), redige le contenu d'une charte graphique : 1) palette de 5 couleurs avec role et HEX, 2) systeme typographique (titre, corps, accent) avec justification, 3) tone of voice en 4 adjectifs + 5 phrases 'a dire' et 5 'a eviter', 4) 6 regles Do/Don't, 5) recommandations d'accessibilite (contrastes, tailles mini)."
 },
 "art-direction": {
  "freeTool": {
   "label": "Milanote",
   "url": "https://milanote.com/",
   "why": "Outil de moodboard gratuit concu pour les directeurs artistiques : board visuel infini pour assembler images, couleurs, typos, references et notes de direction artistique."
  },
  "altTools": [
   {
    "label": "Canva (moodboard gratuit)",
    "url": "https://www.canva.com/create/mood-boards/"
   },
   {
    "label": "Pinterest",
    "url": "https://www.pinterest.com/"
   }
  ],
  "checklist": [
   "Concept directeur en 1 phrase (le 'big idea' visuel de la marque)",
   "3-5 mots-cles d'ambiance (ex : epure, audacieux, chaleureux, futuriste)",
   "Planche d'inspiration : 12-20 images de reference cohérentes",
   "Palette d'ambiance extraite des visuels (au-dela de la palette logo)",
   "Reference de style photographique (lumiere, cadrage, post-traitement)",
   "Reference d'univers graphique (textures, formes, motifs)",
   "References typographiques en contexte (titrages, accroches)",
   "References de mise en scene / casting / decors si produit physique",
   "Exemples 'a la maniere de' : 2-3 marques inspirantes (et pourquoi)",
   "Anti-references : 2-3 styles a eviter absolument",
   "Note de direction artistique (1 paragraphe expliquant l'intention)",
   "Validation de la coherence moodboard <-> positionnement de marque"
  ],
  "guide": [
   "1. Cree un board Milanote nomme 'DA {theme}' et ajoute en haut le concept directeur en 1 phrase.",
   "2. Liste 3-5 mots-cles d'ambiance qui guideront toutes les recherches visuelles.",
   "3. Collecte 12-20 images de reference (Pinterest, Unsplash) et glisse-les sur le board.",
   "4. Regroupe les images par theme : photographie, couleurs, typo, textures, mise en scene.",
   "5. Extrais une palette d'ambiance a partir des visuels dominants (color picker).",
   "6. Ajoute 2-3 marques 'a la maniere de' et 2-3 anti-references avec une note du pourquoi.",
   "7. Redige une note de direction artistique d'un paragraphe expliquant l'intention globale.",
   "8. Verifie la coherence avec le positionnement, puis partage le board en lecture pour validation."
  ],
  "promptExample": "Tu es directeur artistique. Pour {theme} (positionnement : [...], cible : [...]), propose une direction artistique : 1) un concept directeur en une phrase, 2) 5 mots-cles d'ambiance, 3) une description du style photographique (lumiere, cadrage, traitement), 4) un univers de couleurs et textures, 5) 3 marques de reference 'a la maniere de' et pourquoi, 6) 2 anti-references a eviter."
 },
 "packaging-main": {
  "freeTool": {
   "label": "Mockey.ai",
   "url": "https://mockey.ai/",
   "why": "Bibliotheque de mockups produits gratuits (packaging, boites, bouteilles, etiquettes) ou l'on applique son design en quelques clics pour un rendu pro sans Photoshop."
  },
  "altTools": [
   {
    "label": "Pacdora",
    "url": "https://www.pacdora.com/"
   },
   {
    "label": "Microsoft Designer",
    "url": "https://designer.microsoft.com/"
   }
  ],
  "checklist": [
   "Choix du format de packaging adapte au produit (boite, etui, bouteille, pochette)",
   "Face avant : logo, nom produit, baseline, visuel cle bien positionnes",
   "Hierarchie visuelle claire (l'oeil lit nom > benefice > details)",
   "Respect de la charte (couleurs HEX, typos, iconographie)",
   "Zone de mentions obligatoires simulee (contenance, ingredients, code-barres factice)",
   "Mockup 3D realiste avec ombres et lumiere coherentes",
   "Vue principale (3/4 ou face) en haute resolution",
   "Fond contextualise OU fond neutre selon usage (e-commerce vs pub)",
   "Lisibilite testee a taille vignette (comme sur une fiche produit en ligne)",
   "Export PNG haute resolution (>= 2000 px) avec et sans fond",
   "Verification accessibilite : contraste texte/packaging suffisant",
   "Coherence avec la direction artistique definie (moodboard)"
  ],
  "guide": [
   "1. Prepare ton artwork de face (logo, nom de {theme}, visuel) dans Canva aux bonnes proportions.",
   "2. Sur mockey.ai, choisis la categorie de mockup correspondant a ton type de produit.",
   "3. Selectionne un template de packaging dont l'angle et la lumiere conviennent.",
   "4. Importe ton artwork et applique-le sur la surface du mockup ; ajuste echelle et position.",
   "5. Verifie la hierarchie (nom > benefice > details) et la lisibilite a taille vignette.",
   "6. Controle que couleurs et typos respectent la charte ; ajuste l'artwork si besoin.",
   "7. Choisis un fond contextualise (pub) ou neutre (e-commerce) selon l'usage prevu.",
   "8. Exporte en PNG haute resolution (>= 2000 px), versions avec et sans fond."
  ],
  "promptExample": "Cree le visuel de la face avant d'un packaging pour {theme} : nom de marque en grand, baseline en dessous, un visuel produit central, palette [couleurs charte], typo [police titre]. Style : [premium / fun / naturel], hierarchie claire (nom puis benefice puis details), format [boite / bouteille / etui], rendu propre et lisible meme en vignette e-commerce."
 },
 "packaging-range": {
  "freeTool": {
   "label": "Pacdora",
   "url": "https://www.pacdora.com/",
   "why": "Specialiste du packaging avec templates 3D parametrables : ideal pour decliner une gamme coherente (memes formes, variantes de couleur/parfum/taille) et exporter des mockups serie."
  },
  "altTools": [
   {
    "label": "Mockey.ai",
    "url": "https://mockey.ai/"
   },
   {
    "label": "Canva (gratuit)",
    "url": "https://www.canva.com/"
   }
  ],
  "checklist": [
   "Systeme de declinaison defini (par variante : parfum, taille, gamme, edition)",
   "Element constant identifie (structure, logo, mise en page = ADN de gamme)",
   "Element variable identifie (couleur d'accent, pictogramme, nom de variante)",
   "Minimum 3 variantes produites pour montrer la logique de gamme",
   "Code couleur par variante coherent et differenciable au premier coup d'oeil",
   "Nom / mention de chaque variante clairement lisible",
   "Coherence visuelle : on reconnait la meme marque sur toutes les variantes",
   "Differenciation suffisante : on ne confond pas deux variantes en rayon",
   "Rendu de la gamme alignee (vue ensemble facon lineaire / packshot serie)",
   "Mockups individuels haute resolution pour chaque variante",
   "Visuel 'famille' regroupant toutes les variantes cote a cote",
   "Verification contraste/lisibilite sur chaque variante de couleur"
  ],
  "guide": [
   "1. Reprends le packaging principal de {theme} comme gabarit de reference (structure et mise en page).",
   "2. Definis ce qui reste constant (logo, layout) et ce qui varie (couleur d'accent, nom de variante).",
   "3. Sur Pacdora, choisis le meme template 3D que le produit principal pour garantir la coherence.",
   "4. Cree la variante 1 en changeant uniquement les elements variables (couleur, picto, mention).",
   "5. Duplique et produis au moins 3 variantes en gardant l'ADN visuel identique.",
   "6. Verifie au premier coup d'oeil que chaque variante se distingue tout en restant 'meme marque'.",
   "7. Exporte chaque variante en mockup haute resolution individuel.",
   "8. Compose un visuel 'famille' alignant toutes les variantes cote a cote (effet lineaire)."
  ],
  "promptExample": "A partir du packaging de {theme}, cree 3 declinaisons de gamme. Garde identiques : structure, logo, mise en page et typo. Fais varier uniquement : la couleur d'accent et le nom de variante ([variante 1], [variante 2], [variante 3]). Chaque variante doit etre instantanement reconnaissable comme la meme marque mais distincte des autres. Donne pour chacune le code couleur d'accent (HEX) recommande."
 },
 "social-templates": {
  "freeTool": {
   "label": "Canva (templates gratuits)",
   "url": "https://www.canva.com/",
   "why": "Reference des templates social media : formats predefinis Story/post/banniere, Brand Kit applicable, et resize multi-format en 1 clic dans le tier gratuit."
  },
  "altTools": [
   {
    "label": "Microsoft Designer",
    "url": "https://designer.microsoft.com/"
   },
   {
    "label": "Crello / VistaCreate",
    "url": "https://create.vista.com/"
   }
  ],
  "checklist": [
   "Template Story / Reel vertical (1080 x 1920 px) aux couleurs de la marque",
   "Template post carre / feed (1080 x 1080 px)",
   "Banniere LinkedIn (1584 x 396 px) et/ou couverture Facebook",
   "Sticker / badge de marque transparent (PNG) reutilisable",
   "Zone de titre + zone de sous-titre clairement structurees",
   "Emplacement logo coherent (taille et position fixes)",
   "Palette et typos de la charte appliquees (Brand Kit)",
   "Hierarchie de lecture (accroche > message > call-to-action)",
   "Call-to-action visible (bouton ou mention 'swipe up / lien en bio')",
   "Zone de securite respectee (texte hors des bords coupes par l'UI)",
   "Versions modifiables (template reutilisable) + exports PNG/JPG finaux",
   "Coherence visuelle entre Story, banniere et sticker (meme univers)"
  ],
  "guide": [
   "1. Dans Canva, configure le Brand Kit de {theme} (logo, couleurs, polices) pour les appliquer partout.",
   "2. Cree un design 'Story Instagram' (1080x1920) et pars d'un template proche de ton univers.",
   "3. Structure-le : zone titre, zone message, logo en position fixe, call-to-action en bas.",
   "4. Applique palette et typos de la charte, et verifie la zone de securite (pas de texte aux bords).",
   "5. Utilise 'Redimensionner' pour decliner le design en post carre (1080x1080) et banniere (1584x396).",
   "6. Cree un sticker/badge de marque sur fond transparent et exporte-le en PNG.",
   "7. Verifie la coherence visuelle entre Story, banniere et sticker (meme ambiance).",
   "8. Enregistre les templates comme reutilisables, puis exporte les versions finales PNG/JPG."
  ],
  "promptExample": "Cree un kit de templates social media pour {theme} aux couleurs [palette charte] et typo [police titre]. Inclure : 1) une Story verticale 1080x1920 avec zone titre, message et call-to-action, 2) une banniere LinkedIn 1584x396, 3) un sticker/badge de marque sur fond transparent. Style coherent et reconnaissable, hierarchie de lecture claire, logo en position fixe, lisible sur mobile."
 },
 "ad-visuals": {
  "freeTool": {
   "label": "Microsoft Designer (Image Creator)",
   "url": "https://designer.microsoft.com/",
   "why": "Gratuit avec compte Microsoft, generation d'images haute qualite (DALL-E 3) ET templates publicitaires multi-formats integres : on genere le visuel puis on le decline en 1:1, 9:16 et 16:9 sans changer d'outil. Ideal debutants car interface guidee en francais."
  },
  "altTools": [
   {
    "label": "Leonardo.ai (free tier)",
    "url": "https://leonardo.ai/"
   },
   {
    "label": "FLUX.1 [schnell] sur Hugging Face",
    "url": "https://huggingface.co/black-forest-labs/FLUX.1-schnell"
   }
  ],
  "checklist": [
   "Format carre 1:1 (1080x1080) pour feed Instagram/Facebook",
   "Format vertical 9:16 (1080x1920) pour Stories/Reels/TikTok",
   "Format paysage 16:9 (1200x628) pour bandeau web/display/LinkedIn",
   "Version avec produit en hero shot (gros plan produit)",
   "Version lifestyle (produit en situation d'usage)",
   "Espace reserve (zone vide) pour integrer le logo et le claim",
   "Palette couleurs coherente avec l'identite de marque sur les 3 formats",
   "Version fond clair + version fond sombre (adaptation supports)",
   "Export PNG haute resolution (sans compression visible)",
   "Variante sans texte (visuel pur) pour reutilisation libre",
   "Zone de securite respectee (elements cles non coupes au recadrage)",
   "Nom de fichier normalise (produit_format_version.png)"
  ],
  "guide": [
   "1. Connectez-vous sur designer.microsoft.com avec un compte Microsoft gratuit.",
   "2. Cliquez sur 'Image Creator' (ou 'Creer une image') et saisissez votre prompt decrivant le produit {theme}.",
   "3. Generez 4 variations, telechargez la meilleure en haute resolution.",
   "4. Retournez sur l'accueil Designer, choisissez 'Creation personnalisee' et reglez la taille sur 1080x1080.",
   "5. Importez votre visuel, ajoutez le logo, le claim et le CTA dans la zone reservee.",
   "6. Utilisez 'Redimensionner' (menu Design) pour decliner automatiquement en 9:16 puis 16:9.",
   "7. Ajustez le recadrage de chaque format pour que le produit et le texte restent visibles.",
   "8. Exportez chaque format en PNG haute qualite et nommez les fichiers de maniere normalisee."
  ],
  "promptExample": "Photographie publicitaire studio professionnelle de {theme}, eclairage doux trois points, fond degrade pastel, produit centre net et detaille, composition epuree avec espace negatif a droite pour texte, rendu commercial haut de gamme, couleurs vives saturees, 8k, --ar 1:1"
 },
 "copy": {
  "freeTool": {
   "label": "Claude (Anthropic)",
   "url": "https://claude.ai/",
   "why": "Tier gratuit genereux, excellente maitrise du francais nuance et du copywriting marketing (tone of voice, declinaisons, formats courts). Comprend les frameworks publicitaires (AIDA, PAS) et produit des variantes calibrees pour A/B test, ce qui en fait l'outil le plus fiable pour des textes prets a l'emploi."
  },
  "altTools": [
   {
    "label": "ChatGPT (free)",
    "url": "https://chatgpt.com/"
   },
   {
    "label": "Copy.ai (free plan)",
    "url": "https://www.copy.ai/"
   }
  ],
  "checklist": [
   "3 headlines courtes (moins de 8 mots) percutantes",
   "2 headlines longues / accroche developpee",
   "1 body court (40-60 mots) pour social/display",
   "1 body long (100-150 mots) pour landing page",
   "3 CTA variantes (action, urgence, benefice)",
   "1 proposition de valeur unique (USP) en une phrase",
   "Liste de 5 mots-cles emotionnels alignes sur la cible",
   "Declinaison ton formel ET ton decontracte du meme message",
   "1 baseline / claim de marque memorisable",
   "Version anglaise du headline principal (si cible internationale)",
   "Verification longueur conforme aux limites par canal (ex: titre Google Ads 30 caracteres)",
   "2 angles differents (rationnel vs emotionnel) pour A/B test"
  ],
  "guide": [
   "1. Ouvrez claude.ai et donnez le contexte : produit {theme}, cible, ton de marque, benefice principal.",
   "2. Demandez d'abord 1 proposition de valeur unique (USP) en une phrase, validez-la.",
   "3. Demandez 5 headlines courtes en framework AIDA, puis selectionnez les 3 meilleures.",
   "4. Generez le body court (social) et le body long (landing) en gardant le meme angle.",
   "5. Demandez 3 CTA distincts : un orient action, un orient urgence, un orient benefice.",
   "6. Demandez une declinaison ton formel et ton decontracte pour comparer.",
   "7. Faites verifier les longueurs par canal (Google Ads, Meta, X) et raccourcir si besoin.",
   "8. Compilez le tout dans un tableau headline / body / CTA pret a copier."
  ],
  "promptExample": "Tu es copywriter senior. Produit : {theme}. Cible : [decris ta cible]. Benefice cle : [benefice]. Ton de marque : [ex: complice et premium]. Genere : 3 headlines courtes (<8 mots) en framework AIDA, 1 body court (50 mots) et 1 body long (130 mots), et 3 CTA variantes (action / urgence / benefice). Donne une version emotionnelle et une version rationnelle. Format tableau, francais."
 },
 "media-plan": {
  "freeTool": {
   "label": "ChatGPT (free)",
   "url": "https://chatgpt.com/",
   "why": "Tier gratuit capable de raisonner sur une repartition budgetaire multi-canal, de generer un tableau d'allocation realiste (CPM/CPC indicatifs, repartition %) et de l'exporter directement en format tableur. Pour un public debutant, c'est le moyen le plus rapide d'obtenir un plan media structure et chiffre sans tableur complexe."
  },
  "altTools": [
   {
    "label": "Gemini (free)",
    "url": "https://gemini.google.com/"
   },
   {
    "label": "Google Sheets (modele + IA)",
    "url": "https://sheets.google.com/"
   }
  ],
  "checklist": [
   "Budget total defini et reparti en pourcentage par canal",
   "Tableau d'allocation : canal / objectif / budget / KPI / format",
   "Choix des canaux justifie selon la cible (Meta, TikTok, Google, etc.)",
   "Repartition des phases (notoriete / consideration / conversion)",
   "Calendrier de diffusion (flighting) sur la duree de campagne",
   "Estimation de reach / impressions par canal (CPM indicatif)",
   "Estimation de clics / trafic (CPC indicatif)",
   "Definition des KPI principaux par canal (CTR, CPA, ROAS)",
   "Split organique vs paye clairement identifie",
   "Budget de reserve / test (10-15%) prevu",
   "Hypotheses de calcul documentees (sources des CPM/CPC)",
   "Synthese visuelle (camembert de repartition budgetaire)"
  ],
  "guide": [
   "1. Ouvrez chatgpt.com et donnez : produit {theme}, budget total, duree, cible et objectif principal.",
   "2. Demandez la liste des canaux les plus pertinents pour cette cible, avec justification.",
   "3. Demandez un tableau d'allocation budgetaire par canal (budget, % , objectif, format, KPI).",
   "4. Demandez d'ajouter des CPM/CPC indicatifs et d'estimer reach + clics par canal.",
   "5. Demandez un decoupage en 3 phases : notoriete, consideration, conversion.",
   "6. Demandez un calendrier de diffusion (semaine par semaine) sur la duree.",
   "7. Faites lister les hypotheses de calcul et reservez 10-15% en budget test.",
   "8. Exportez le tableau (copier dans Google Sheets) et ajoutez un camembert de repartition."
  ],
  "promptExample": "Construis un plan media pour le lancement de {theme}. Budget total : [montant] EUR sur [duree]. Cible : [decris]. Objectif : [notoriete/ventes]. Donne un tableau (canal | objectif | budget EUR | % | format | CPM ou CPC indicatif | reach estime | KPI). Repartis en 3 phases (notoriete/consideration/conversion), ajoute un calendrier hebdomadaire et reserve 12% en budget test. Liste tes hypotheses de CPM/CPC."
 },
 "social-content": {
  "freeTool": {
   "label": "Claude (Anthropic)",
   "url": "https://claude.ai/",
   "why": "Tier gratuit, maitrise des codes specifiques de chaque plateforme (hooks TikTok, captions IG avec emojis et hashtags, format thread X, microcopy). Genere en une passe des contenus calibres par canal avec le bon ton, ce qui evite de jongler entre plusieurs outils."
  },
  "altTools": [
   {
    "label": "ChatGPT (free)",
    "url": "https://chatgpt.com/"
   },
   {
    "label": "Copy.ai (free plan)",
    "url": "https://www.copy.ai/"
   }
  ],
  "checklist": [
   "5 captions Instagram (accroche + corps + CTA + emojis)",
   "2 jeux de hashtags IG (10-15 hashtags : mix populaires + niche)",
   "5 hooks TikTok (3 premieres secondes percutantes)",
   "3 scripts TikTok courts (structure hook / valeur / CTA)",
   "5 posts X (moins de 280 caracteres, 1 punchline chacun)",
   "1 thread X (5-7 tweets) racontant le produit",
   "Microcopy boutons et notifications (5-8 phrases courtes)",
   "Bio / description de profil optimisee pour le produit",
   "Variantes de ton (fun, premium, communautaire)",
   "Call-to-action adapte par plateforme",
   "Liste d'emojis recommandes par canal",
   "Calendrier d'idees de posts sur 1 semaine"
  ],
  "guide": [
   "1. Ouvrez claude.ai et donnez le contexte produit {theme}, cible et ton de marque.",
   "2. Demandez 5 captions Instagram completes (accroche, corps, CTA, emojis).",
   "3. Demandez 2 sets de hashtags (un grand public, un de niche).",
   "4. Demandez 5 hooks TikTok orientes 'scroll-stop' + 3 scripts courts structures.",
   "5. Demandez 5 posts X percutants puis 1 thread storytelling de 5-7 tweets.",
   "6. Demandez la microcopy (boutons, notifications) et une bio de profil.",
   "7. Demandez des variantes de ton (fun / premium / communautaire) sur 1 caption.",
   "8. Demandez un planning d'idees de posts sur 7 jours et compilez le tout."
  ],
  "promptExample": "Tu es social media manager. Produit : {theme}. Cible : [decris]. Ton : [ex: fun et complice]. Genere pour le lancement : 5 captions Instagram (accroche + corps + CTA + emojis) avec 2 sets de hashtags, 5 hooks TikTok ultra accrocheurs (3 premieres secondes) + 3 scripts courts (hook/valeur/CTA), 5 posts X (<280 car.) et 1 thread X de 6 tweets, plus la microcopy de 6 boutons/notifications. Francais."
 },
 "jingle": {
  "freeTool": {
   "label": "Suno (tier gratuit)",
   "url": "https://suno.com/",
   "why": "Tier gratuit (credits quotidiens) qui genere une piste musicale complete avec parole et melodie a partir d'un simple texte. Parfait pour un jingle de marque : on decrit le mood, le style et le claim chante, et on obtient un sonic branding utilisable en quelques minutes, sans competence musicale."
  },
  "altTools": [
   {
    "label": "Udio (free tier)",
    "url": "https://www.udio.com/"
   },
   {
    "label": "Mubert (free)",
    "url": "https://mubert.com/"
   }
  ],
  "checklist": [
   "Jingle complet 15-30 secondes (version diffusion radio/web)",
   "Version courte 5-7 secondes (logo sonore / sting de fin)",
   "Version instrumentale (sans voix) pour habillage",
   "Version avec claim chante (paroles = baseline de marque)",
   "Mood/style coherent avec l'identite (energique, premium, ludique...)",
   "Tempo et tonalite identifiables / memorisables",
   "Motif melodique recurrent (signature de 3-5 notes)",
   "2 a 3 variations de style pour comparer",
   "Export audio qualite correcte (MP3/WAV)",
   "Fade-in / fade-out propres",
   "Version loop-able pour reseaux sociaux",
   "Fiche descriptive (BPM, mood, usage prevu)"
  ],
  "guide": [
   "1. Creez un compte gratuit sur suno.com et reperez vos credits quotidiens.",
   "2. Cliquez sur 'Create' et activez le mode 'Custom' pour controler le style et les paroles.",
   "3. Dans 'Lyrics', ecrivez le claim de marque (1-2 lignes chantees) lie a {theme}.",
   "4. Dans 'Style of Music', decrivez le mood (ex: 'upbeat pop, brand jingle, catchy, 15s').",
   "5. Generez 2 versions, ecoutez et selectionnez la signature melodique la plus memorisable.",
   "6. Regenerez en mode instrumental pour obtenir la version sans voix.",
   "7. Telechargez le MP3, puis coupez une version courte 5-7s (sting) avec un editeur audio.",
   "8. Documentez BPM, mood et usages, et exportez une version loop pour les reseaux."
  ],
  "promptExample": "Style of Music : upbeat modern pop brand jingle, catchy and memorable, bright synths, claps, 15 seconds, radio-ready, energetic and friendly mood for {theme}. Lyrics : un claim court et chantant qui repete le nom du produit {theme} sur un motif de 4 notes facile a retenir."
 },
 "voiceover": {
  "freeTool": {
   "label": "ElevenLabs (tier gratuit)",
   "url": "https://elevenlabs.io/",
   "why": "Tier gratuit (10 000 caracteres/mois) avec les voix synthetiques les plus naturelles du marche, dont des voix francaises de qualite. Controle du ton, du rythme et du style (ASMR, pub energique, narration), ce qui permet de produire une voix-off pro sans studio ni comedien."
  },
  "altTools": [
   {
    "label": "Microsoft Edge - lecture vocale (Read Aloud)",
    "url": "https://www.microsoft.com/edge"
   },
   {
    "label": "TTSMaker (gratuit)",
    "url": "https://ttsmaker.com/"
   }
  ],
  "checklist": [
   "Script voix-off ecrit et minute (ex: 20s, 30s)",
   "Version pub energique (debit dynamique)",
   "Version ASMR / douce (debit lent, voix proche)",
   "Choix d'une voix francaise coherente avec la marque",
   "Test de 2-3 voix differentes avant validation",
   "Reglage de la stabilite / expressivite de la voix",
   "Pauses et respirations placees pour le naturel",
   "Prononciation correcte du nom du produit (verifiee)",
   "Export audio propre (MP3/WAV, sans saturation)",
   "Niveau sonore normalise (pas trop fort/faible)",
   "Version avec et sans musique de fond",
   "Sous-titres / transcription du script pour accessibilite"
  ],
  "guide": [
   "1. Creez un compte gratuit sur elevenlabs.io et ouvrez 'Text to Speech'.",
   "2. Collez votre script voix-off (idealement 20-30s, soit 50-80 mots) pour {theme}.",
   "3. Parcourez la bibliotheque de voix et selectionnez 2-3 voix francaises a tester.",
   "4. Reglez les curseurs Stability et Style selon le ton voulu (pub punchy vs ASMR doux).",
   "5. Generez chaque version, ecoutez et comparez le rendu et la prononciation du produit.",
   "6. Ajustez le script (ajout de virgules/points pour les pauses) si le debit est trop rapide.",
   "7. Telechargez la meilleure version en MP3 et verifiez le niveau sonore.",
   "8. Creez une variante ASMR en baissant le debit et en choisissant une voix proche/chuchotee."
  ],
  "promptExample": "Script voix-off pub 25s pour {theme}, ton chaleureux et confiant : 'Et si le quotidien devenait plus simple ? Decouvrez {theme}, pense pour vous, concu pour durer. Une experience nouvelle, des aujourd'hui. {theme} - faites le premier pas.' (Reglages ElevenLabs : voix francaise, Stability 50%, Style 35%, ajouter des pauses aux points.)"
 },
 "manifesto-video": {
  "freeTool": {
   "label": "Luma Dream Machine",
   "url": "https://lumalabs.ai/dream-machine",
   "why": "Tier gratuit avec generations quotidiennes, produit des plans video cinematiques fluides a partir de texte ou d'image. Ideal pour une video manifeste de lancement : on genere plusieurs plans esthetiques (5s chacun) qu'on assemble en montage emotionnel, sans tournage."
  },
  "altTools": [
   {
    "label": "Kling AI (free tier)",
    "url": "https://klingai.com/"
   },
   {
    "label": "CapCut (montage gratuit)",
    "url": "https://www.capcut.com/"
   }
  ],
  "checklist": [
   "Storyboard / script manifeste (intro, montee, climax, signature)",
   "5 a 8 plans video generes (cinematiques, coherents)",
   "Plan d'ouverture fort (hook visuel des 3 premieres secondes)",
   "Plan de signature finale avec logo + claim",
   "Format 16:9 (YouTube/site) ET 9:16 (Reels/TikTok)",
   "Voix-off ou texte a l'ecran integre (le manifeste)",
   "Musique de fond (libre de droits ou generee)",
   "Transitions fluides entre les plans",
   "Etalonnage couleur coherent sur tous les plans",
   "Duree maitrisee (30-60s)",
   "Sous-titres incrustes (lecture sans son)",
   "Export final haute qualite (1080p minimum)"
  ],
  "guide": [
   "1. Ecrivez le texte du manifeste (4-6 phrases) et un storyboard de 6 plans pour {theme}.",
   "2. Sur lumalabs.ai/dream-machine, generez chaque plan via un prompt texte (ou image de depart).",
   "3. Variez les plans (gros plan produit, plan large lifestyle, detail, plan de signature).",
   "4. Telechargez les 6-8 clips retenus (5s chacun).",
   "5. Importez les clips dans CapCut et assemblez-les selon le storyboard (intro->climax->signature).",
   "6. Ajoutez la voix-off (ou le texte a l'ecran phrase par phrase) et la musique de fond.",
   "7. Soignez les transitions, l'etalonnage et incrustez le logo + claim sur le plan final.",
   "8. Generez les sous-titres automatiques, puis exportez en 16:9 et redimensionnez en 9:16."
  ],
  "promptExample": "Cinematic launch manifesto shot for {theme} : slow elegant camera push-in on the product bathed in warm golden light, dramatic depth of field, dust particles floating, premium mood, inspiring and hopeful atmosphere, smooth motion, film grain, 4k, 5 seconds."
 },
 "social-video": {
  "freeTool": {
   "label": "CapCut",
   "url": "https://www.capcut.com/",
   "why": "Gratuit, c'est l'outil de reference pour les Reels/TikTok : templates tendance, sous-titres automatiques, effets, musiques et formats verticaux natifs. Permet d'assembler clips IA + sequences telephone en un montage UGC viral, avec export 9:16 optimise pour chaque plateforme."
  },
  "altTools": [
   {
    "label": "Kling AI (free tier)",
    "url": "https://klingai.com/"
   },
   {
    "label": "Pika (free)",
    "url": "https://pika.art/"
   }
  ],
  "checklist": [
   "Reel/TikTok vertical 9:16 de 15-30s",
   "Hook visuel + textuel dans les 3 premieres secondes",
   "Concept de challenge UGC clair et reproductible",
   "Hashtag de challenge dedie (#nomDuChallenge)",
   "Regles du challenge expliquees en overlay texte",
   "Musique tendance / son original integre",
   "Sous-titres automatiques styles (lecture sans son)",
   "CTA final (participer / suivre / acheter)",
   "Demonstration produit en action",
   "Variante 'exemple de participation' (modele a imiter)",
   "Cadrage et rythme de montage dynamiques (cuts rapides)",
   "Export optimise par plateforme (TikTok, Reels, Shorts)"
  ],
  "guide": [
   "1. Definissez le concept du challenge UGC autour de {theme} (geste simple a reproduire) et son hashtag.",
   "2. Generez 2-3 plans produit avec Kling ou Pika (free) si besoin de visuels IA.",
   "3. Ouvrez CapCut, creez un projet 9:16 et importez vos clips.",
   "4. Placez le hook (texte + visuel fort) sur les 3 premieres secondes.",
   "5. Montez la demonstration du challenge avec des cuts rapides et une musique tendance.",
   "6. Activez les sous-titres automatiques et stylisez-les (police, couleur, animation).",
   "7. Ajoutez un overlay expliquant les regles du challenge et le CTA final + hashtag.",
   "8. Exportez en 1080p 9:16 et declinez pour TikTok, Reels et Shorts."
  ],
  "promptExample": "Vertical 9:16 TikTok shot for a UGC challenge about {theme} : a young person playfully using the product, energetic handheld camera feel, bright natural lighting, vibrant colors, dynamic and fun mood, trendy social-media aesthetic, 5 seconds. (Concept challenge : montre ta facon d'utiliser {theme} en 1 geste, hashtag #Defi{theme}.)"
 },
 "retail-plv": {
  "freeTool": {
   "label": "Ideogram",
   "url": "https://ideogram.ai/",
   "why": "Tier gratuit, c'est le meilleur generateur d'images pour integrer du TEXTE lisible et net dans le visuel - indispensable pour une affiche PLV ou un stop-rayon qui doivent afficher prix, claim et nom de produit directement dans l'image, ce que les autres generateurs ratent souvent."
  },
  "altTools": [
   {
    "label": "Microsoft Designer",
    "url": "https://designer.microsoft.com/"
   },
   {
    "label": "Canva (free)",
    "url": "https://www.canva.com/"
   }
  ],
  "checklist": [
   "Affiche PLV format portrait (A3/A2) haute resolution",
   "Stop-rayon format reduit (forme decoupee / rectangle pendu)",
   "Titre / claim lisible a distance (gros, contraste fort)",
   "Nom du produit clairement affiche dans le visuel",
   "Zone prix ou offre promotionnelle visible",
   "Visuel produit en hero shot",
   "Logo de marque integre",
   "Palette de couleurs vives attirant l'oeil en rayon",
   "Hierarchie visuelle claire (titre > visuel > prix > CTA)",
   "Zone de fond / marge pour impression (fond perdu)",
   "Mention legale / asterisque offre (si promo)",
   "Versions en 2 tailles + fichier export imprimable (PNG/PDF haute def)"
  ],
  "guide": [
   "1. Connectez-vous sur ideogram.ai et choisissez le ratio portrait (ex: 9:16 ou 2:3 pour A3).",
   "2. Redigez un prompt incluant le texte exact a afficher (claim, nom produit {theme}, prix).",
   "3. Generez 4 variations et selectionnez celle ou le texte est le plus net et lisible.",
   "4. Verifiez la hierarchie : titre lisible a distance, produit en hero, prix bien visible.",
   "5. Si le texte est imparfait, regenerez ou finalisez le texte dans Canva/Designer par-dessus.",
   "6. Ajoutez le logo de marque et la mention legale de l'offre si necessaire.",
   "7. Creez une version reduite 'stop-rayon' a partir du meme visuel.",
   "8. Exportez en haute resolution (PNG/PDF) avec une marge de fond perdu pour l'impression."
  ],
  "promptExample": "Retail point-of-sale poster (PLV) for {theme}, portrait A3, the product as hero shot center, bold large readable headline at top, brand name '{theme}' clearly visible, a bright price tag badge with '-20%', vibrant eye-catching colors, high contrast, clean retail advertising layout, professional print quality, the text must be crisp and legible."
 },
 "landing-page": {
  "freeTool": {
   "label": "Carrd",
   "url": "https://carrd.co",
   "why": "Builder de landing one-page ultra-simple, 100% gratuit pour 3 sites (responsive, formulaires de capture email, comptes à rebours, sections pré-commande). Parfait pour débutants : on construit une page de pré-commande crédible en 30 min sans code, avec un formulaire d'emails qui se connecte à Mailchimp ou Brevo."
  },
  "altTools": [
   {
    "label": "Framer (free)",
    "url": "https://www.framer.com"
   },
   {
    "label": "Durable",
    "url": "https://durable.co"
   }
  ],
  "checklist": [
   "Headline (proposition de valeur en 1 phrase) + sous-titre clair",
   "Visuel hero du produit (packaging/mockup) au-dessus de la ligne de flottaison",
   "Bouton CTA unique et répété : 'Pré-commander' / 'Rejoindre la liste'",
   "Section bénéfices (3 à 5 bénéfices client, pas des features)",
   "Preuve sociale (témoignage, logos, '+500 inscrits', avis)",
   "Section 'Comment ça marche' en 3 étapes",
   "Offre de lancement / urgence (prix early-bird, compte à rebours, stock limité)",
   "Formulaire de capture email (prénom + email) connecté à un outil d'emailing",
   "FAQ (4 à 6 questions : livraison, prix, garantie, date de sortie)",
   "Footer avec mentions légales, contact et liens réseaux sociaux",
   "Optimisation mobile vérifiée (90%+ du trafic de lancement est mobile)",
   "Balise titre + meta description + favicon pour le partage et le SEO"
  ],
  "guide": [
   "1. Crée un compte gratuit sur carrd.co et choisis un template 'Landing' ou 'Form' proche de ton besoin.",
   "2. Remplace le headline et le sous-titre par ta proposition de valeur générée avec ChatGPT (formule : bénéfice + pour qui + différenciateur).",
   "3. Importe ton visuel hero (mockup packaging) dans la section principale et ajoute le bouton CTA 'Pré-commander'.",
   "4. Ajoute les sections bénéfices, preuve sociale, 'Comment ça marche' et FAQ en glissant des blocs depuis le menu '+'.",
   "5. Insère un élément 'Form' (prénom + email) et connecte-le à Mailchimp/Brevo via l'onglet Form > Receive (Mailchimp ou webhook).",
   "6. Ajoute un compte à rebours et une mention 'offre de lancement limitée' pour créer l'urgence.",
   "7. Règle les paramètres SEO (Settings > SEO) : titre, description, favicon et image de partage.",
   "8. Vérifie le rendu mobile (icône smartphone dans l'éditeur), publie sur l'URL gratuite carrd.co et teste l'envoi du formulaire."
  ],
  "promptExample": "Tu es copywriter spécialisé en pages de pré-commande. Rédige le contenu complet d'une landing page de pré-commande pour {theme}. Donne : 1 headline (max 10 mots), 1 sous-titre, 5 bénéfices clients formulés en 'tu', une section 'Comment ça marche' en 3 étapes, 3 témoignages crédibles, une offre de lancement avec urgence, et 5 questions/réponses de FAQ. Ton : enthousiaste mais crédible, public francophone débutant. Donne le tout structuré section par section."
 },
 "pitch-video": {
  "freeTool": {
   "label": "CapCut",
   "url": "https://www.capcut.com",
   "why": "Éditeur vidéo gratuit complet (desktop + web) avec sous-titres auto, voix off IA (text-to-speech), bibliothèque de musiques libres, templates de pitch et transitions. Idéal pour monter une vidéo pitch de 60-90s à partir de captures produit, slides et voix off, sans watermark et sans budget."
  },
  "altTools": [
   {
    "label": "Canva (Video, free)",
    "url": "https://www.canva.com"
   },
   {
    "label": "Pika Labs",
    "url": "https://pika.art"
   }
  ],
  "checklist": [
   "Script de 130-200 mots (≈ 60-90s) avec structure Hook > Problème > Solution > Preuve > CTA",
   "Hook percutant dans les 3 premières secondes",
   "Présentation claire du produit/service et de sa valeur unique",
   "Démonstration visuelle du produit (mockup, packaging, écran, usage)",
   "Voix off (réelle ou IA) claire et au bon rythme",
   "Sous-titres incrustés (85% des vidéos sont vues sans son)",
   "Musique de fond libre de droits, volume mixé sous la voix",
   "Logo et nom de marque visibles (intro et/ou outro)",
   "Call-to-action final explicite (URL de pré-commande, 'Rejoignez-nous')",
   "Format adapté : 16:9 pour pitch jury, 9:16 pour réseaux sociaux",
   "Durée respectée (60-90s) et exportée en 1080p",
   "Cohérence visuelle avec la charte (couleurs, typo, logo)"
  ],
  "guide": [
   "1. Génère ton script de 60-90s avec ChatGPT en suivant la structure Hook/Problème/Solution/Preuve/CTA.",
   "2. Ouvre CapCut, crée un nouveau projet et choisis le format (16:9 jury ou 9:16 réseaux).",
   "3. Importe tes assets : mockups produit, captures d'écran, visuels de campagne et logo.",
   "4. Pose les visuels sur la timeline dans l'ordre du script et ajuste leur durée pour tenir en 90s.",
   "5. Ajoute la voix off : enregistre la tienne ou utilise Text-to-speech (colle ton script, choisis une voix française).",
   "6. Active les sous-titres automatiques (Captions > Auto captions, langue française) et corrige les erreurs.",
   "7. Ajoute une musique de la bibliothèque libre de droits, baisse son volume sous la voix, et insère 2-3 transitions sobres.",
   "8. Place le logo en intro/outro et le CTA final, puis exporte en 1080p sans watermark."
  ],
  "promptExample": "Tu es scénariste de vidéos pitch. Écris un script de vidéo pitch de 75 secondes (≈170 mots) pour {theme}. Structure obligatoire : (1) Hook choc en 1 phrase dès la 1ère seconde, (2) le problème vécu par la cible, (3) notre solution et son bénéfice clé, (4) une preuve/chiffre rassurant, (5) un call-to-action final avec l'URL de pré-commande. Indique entre crochets les plans visuels à montrer à chaque ligne. Ton dynamique, français, public débutant."
 },
 "email-sequence": {
  "freeTool": {
   "label": "Brevo (ex-Sendinblue)",
   "url": "https://www.brevo.com",
   "why": "Plateforme emailing avec vrai tier gratuit : jusqu'à 300 emails/jour, contacts illimités, éditeur drag-and-drop, automatisation de séquences et templates. Plus généreux que Mailchimp sur les contacts gratuits — parfait pour programmer une séquence de lancement de 6 emails sans payer."
  },
  "altTools": [
   {
    "label": "Mailchimp (free)",
    "url": "https://mailchimp.com"
   },
   {
    "label": "MailerLite (free)",
    "url": "https://www.mailerlite.com"
   }
  ],
  "checklist": [
   "Email 1 — Teaser / annonce (objet curiosité, on annonce que quelque chose arrive)",
   "Email 2 — Révélation du produit (valeur, problème résolu, visuels)",
   "Email 3 — Preuve sociale & bénéfices (témoignages, cas d'usage, FAQ rapide)",
   "Email 4 — Offre de lancement (early-bird, bonus, prix limité)",
   "Email 5 — Urgence / rareté (compte à rebours, stock ou délai qui se termine)",
   "Email 6 — Dernière chance / clôture (deadline imminente, récap de l'offre)",
   "Objet (subject line) optimisé + preheader pour chacun des 6 emails",
   "CTA unique et clair dans chaque email (1 bouton, 1 action)",
   "Personnalisation avec le prénom ({{prénom}}) et signature de marque",
   "Visuel/header cohérent avec la charte dans chaque email",
   "Calendrier d'envoi défini (J-7, J-4, J-2, J0, J+1, J+2 par ex.)",
   "Lien de désinscription et mentions légales (RGPD) dans le pied de page"
  ],
  "guide": [
   "1. Crée un compte gratuit sur Brevo et importe ou crée ta liste de contacts (inscrits de la landing page).",
   "2. Rédige les 6 emails avec ChatGPT en suivant la trame teaser > révélation > preuve > offre > urgence > clôture.",
   "3. Dans Brevo, crée un template réutilisable (header logo, couleurs de charte, footer légal) via l'éditeur drag-and-drop.",
   "4. Crée chaque email à partir du template, colle le contenu, soigne l'objet + le preheader et place 1 seul bouton CTA.",
   "5. Personnalise avec {{contact.PRENOM}} et vérifie le rendu mobile dans l'aperçu Brevo.",
   "6. Va dans Automations, crée un scénario 'séquence de bienvenue/lancement' déclenché à l'inscription.",
   "7. Ajoute les 6 emails avec des délais d'attente entre chacun (ex. +2 jours) pour caler le calendrier de lancement.",
   "8. Envoie-toi un test pour chaque email, vérifie liens et anti-spam, puis active l'automatisation."
  ],
  "promptExample": "Tu es expert en email marketing de lancement. Rédige une séquence de 6 emails pour le lancement de {theme}. Pour chaque email donne : un objet (max 50 caractères), un preheader, le corps (120-180 mots, ton 'tu', personnalisé avec {{prénom}}) et un seul call-to-action. Les 6 emails suivent cette progression : 1) teaser mystère, 2) révélation produit, 3) preuve sociale + bénéfices, 4) offre de lancement early-bird, 5) urgence/rareté, 6) dernière chance avec deadline. Public francophone débutant."
 },
 "gtm-plan": {
  "freeTool": {
   "label": "ChatGPT",
   "url": "https://chat.openai.com",
   "why": "Idéal pour structurer un plan go-to-market sur 12 semaines : il génère un rétroplanning semaine par semaine, propose des canaux d'acquisition, définit des KPIs SMART et un funnel AARRR. On obtient un plan complet et personnalisable, puis on le met en forme dans Google Sheets (gratuit) pour le suivi."
  },
  "altTools": [
   {
    "label": "Google Sheets (Drive free)",
    "url": "https://sheets.google.com"
   },
   {
    "label": "Notion (free)",
    "url": "https://www.notion.so"
   }
  ],
  "checklist": [
   "Objectif SMART du lancement (ex. X pré-commandes / X inscrits en 12 semaines)",
   "Définition de la cible (persona) et de la proposition de valeur",
   "Rétroplanning 12 semaines découpé en phases (pré-lancement, lancement, post-lancement)",
   "Liste des canaux d'acquisition priorisés (organique, social, ads, partenariats, email)",
   "Funnel AARRR (Acquisition, Activation, Rétention, Revenu, Recommandation)",
   "KPIs par étape du funnel (visiteurs, taux de conversion, CAC, pré-commandes, NPS)",
   "Budget estimé par canal (même si 0€ : temps, outils gratuits)",
   "Plan de contenu / calendrier éditorial associé au planning",
   "Cibles chiffrées par semaine (objectifs intermédiaires)",
   "Responsable / rôle assigné par action (RACI simplifié si équipe)",
   "Tableau de bord de suivi des KPIs (Google Sheets)",
   "Plan de risques et plan B (que faire si un canal ne performe pas)"
  ],
  "guide": [
   "1. Décris à ChatGPT ton produit, ta cible et ton objectif de lancement, puis demande un plan go-to-market sur 12 semaines.",
   "2. Demande un rétroplanning en 3 phases (pré-lancement S1-4, lancement S5-8, post-lancement S9-12) avec actions par semaine.",
   "3. Fais lister et prioriser les canaux d'acquisition adaptés à ta cible et à un budget gratuit.",
   "4. Demande la définition de KPIs SMART pour chaque étape du funnel AARRR, avec des cibles chiffrées réalistes.",
   "5. Crée un Google Sheet : un onglet 'Planning' (12 colonnes semaines x lignes canaux/actions) et un onglet 'KPIs'.",
   "6. Reporte le plan de ChatGPT dans le Sheet et ajoute une colonne 'responsable' et 'statut'.",
   "7. Construis le tableau de bord KPIs avec des formules simples (taux de conversion, CAC) et un mini-graphique de suivi.",
   "8. Ajoute un onglet 'Risques & plan B' et relis l'ensemble pour vérifier la cohérence objectifs/moyens."
  ],
  "promptExample": "Tu es Head of Growth. Construis un plan go-to-market complet sur 12 semaines pour le lancement de {theme}. Inclus : (1) un objectif SMART de lancement, (2) le persona cible, (3) un rétroplanning semaine par semaine en 3 phases (pré-lancement, lancement, post-lancement) avec actions concrètes, (4) les canaux d'acquisition priorisés pour un budget gratuit/faible, (5) le funnel AARRR avec un KPI chiffré par étape et des cibles intermédiaires, (6) un plan de risques avec plan B. Présente le rétroplanning sous forme de tableau Markdown. Public francophone débutant."
 },
 "display-ads": {
  "freeTool": {
   "label": "Canva",
   "url": "https://www.canva.com",
   "why": "Outil de design gratuit avec des centaines de formats de bannières display prêts à l'emploi (300x250, 728x90, 160x600, 1080x1080...), un kit de marque (logo, couleurs, typo) et l'export PNG/JPG. On décline une campagne display cohérente en quelques minutes, et on combine avec la Meta Ads Library pour s'inspirer des meilleures pubs réelles."
  },
  "altTools": [
   {
    "label": "Meta Ads Library",
    "url": "https://www.facebook.com/ads/library"
   },
   {
    "label": "Adobe Express (free)",
    "url": "https://www.adobe.com/express"
   }
  ],
  "checklist": [
   "Au moins 3 formats display clés : 300x250 (medium rectangle), 728x90 (leaderboard), 160x600 (skyscraper)",
   "Format social carré 1080x1080 et story 1080x1920 pour Meta/Instagram",
   "Accroche (headline publicitaire) courte et percutante (< 8 mots)",
   "Sous-texte / bénéfice secondaire lisible",
   "CTA visible et contrasté ('Pré-commander', 'Découvrir', 'J'en profite')",
   "Logo et nom de marque présents sur chaque bannière",
   "Visuel produit (packaging/mockup) intégré",
   "Respect de la charte : couleurs, typo, ton cohérents sur tous les formats",
   "3 à 5 variantes d'ad copy (accroches) pour A/B testing",
   "Lisibilité vérifiée en petit (texte assez gros, contraste suffisant)",
   "Poids des fichiers optimisé (< 150 Ko par bannière pour le display)",
   "Mention de l'offre de lancement (réduction, early-bird) si pertinent"
  ],
  "guide": [
   "1. Va dans la Meta Ads Library, recherche ton secteur et note 3-4 publicités qui marchent (accroches, visuels, CTA) pour t'inspirer.",
   "2. Génère 5 variantes d'ad copy (headline + sous-texte + CTA) avec ChatGPT.",
   "3. Dans Canva, configure ton Kit de marque (logo, couleurs, polices) si disponible, sinon crée un design vierge.",
   "4. Choisis un premier format (ex. 1080x1080), place le visuel produit, l'accroche, le bénéfice, le logo et le bouton CTA.",
   "5. Utilise 'Redimensionner' (ou recrée) pour décliner ce design en 300x250, 728x90, 160x600 et 1080x1920.",
   "6. Vérifie la lisibilité de chaque format en petit et ajuste la taille de texte et le contraste du CTA.",
   "7. Crée 2-3 variantes d'accroche par format pour pouvoir A/B tester.",
   "8. Exporte chaque bannière en PNG/JPG optimisé et range-les par format dans un dossier 'display-ads'."
  ],
  "promptExample": "Tu es directeur de création publicitaire. Génère 5 variantes d'ad copy pour une campagne display de lancement de {theme}. Pour chaque variante donne : un headline (max 8 mots), un sous-texte bénéfice (max 12 mots) et un CTA (max 3 mots). Varie les angles : urgence, bénéfice émotionnel, preuve sociale, prix de lancement, curiosité. Précise pour chaque variante l'angle utilisé. Français, percutant, public débutant."
 },
 "final-deck": {
  "freeTool": {
   "label": "Gamma",
   "url": "https://gamma.app",
   "why": "Générateur de présentations par IA avec tier gratuit : on décrit la campagne et Gamma génère un deck animé complet (transitions, apparitions, mise en page automatique) où l'on injecte TOUS les assets produits — logo, packaging, visuels, bannières, vignette vidéo, copy. Animations natives à la lecture, export web/PDF, idéal pour un livrable final pro sans maîtriser de logiciel de slides."
  },
  "altTools": [
   {
    "label": "Canva (Presentations, free)",
    "url": "https://www.canva.com"
   },
   {
    "label": "Beautiful.ai",
    "url": "https://www.beautiful.ai"
   }
  ],
  "checklist": [
   "Slide de titre avec logo, nom de marque et baseline",
   "Slide problème / insight marché (le besoin que la campagne adresse)",
   "Slide proposition de valeur / positionnement",
   "Slide identité de marque : logo + packaging + palette + typo (assets phases précédentes)",
   "Slide produit avec visuels/mockups intégrés",
   "Slide campagne créative : bannières display + visuels social + ad copy",
   "Slide vidéo pitch : vignette cliquable ou vidéo embarquée (60-90s)",
   "Slide jingle / audio de marque (lien d'écoute ou note)",
   "Slide landing page de pré-commande (capture + URL)",
   "Slide go-to-market : rétroplanning 12 semaines + KPIs",
   "Slide résultats attendus / objectifs chiffrés",
   "Slide de clôture avec CTA, contacts et logo",
   "Animations/transitions cohérentes sur toutes les slides (apparitions, fondu)",
   "Charte visuelle homogène (mêmes couleurs/typo que tous les assets)"
  ],
  "guide": [
   "1. Rassemble TOUS tes assets dans un dossier : logo, packaging, visuels produit, bannières display, vignette + lien de la vidéo pitch, jingle, capture de la landing page, copy et plan GTM.",
   "2. Sur gamma.app, clique 'Create new' > 'Generate', et décris ta campagne (produit, cible, structure du deck) pour générer une première trame animée.",
   "3. Vérifie la structure : titre, problème, valeur, identité de marque, produit, campagne, vidéo, GTM, résultats, clôture — ajoute/supprime des cartes si besoin.",
   "4. Injecte chaque asset à sa slide : glisse le logo, le packaging, les bannières, les visuels ; intègre la vignette/vidéo pitch via 'Embed'.",
   "5. Applique ta charte (Theme/couleurs/polices) pour que le deck soit ISO avec tous les assets produits.",
   "6. Ajoute la slide go-to-market (rétroplanning 12 semaines + KPIs) sous forme de tableau ou de timeline animée.",
   "7. Règle les animations : active les transitions de slide et les apparitions d'éléments (Gamma anime nativement à la lecture), garde un style cohérent.",
   "8. Lance le mode présentation pour vérifier les animations et la fluidité, puis partage le lien web (animé) et exporte aussi un PDF de secours."
  ],
  "promptExample": "Tu génères un deck de présentation final ANIMÉ pour une campagne marketing complète sur {theme}. Crée une présentation structurée avec ces slides : 1) titre + baseline, 2) problème/insight marché, 3) proposition de valeur, 4) identité de marque (logo, packaging, couleurs), 5) produit, 6) campagne créative (bannières + social + ad copy), 7) vidéo pitch, 8) jingle de marque, 9) landing page de pré-commande, 10) go-to-market 12 semaines + KPIs, 11) résultats attendus, 12) clôture + call-to-action. Pour chaque slide : un titre court, 2-4 puces percutantes et une suggestion de visuel/asset à placer. Style moderne et animé, charte cohérente, français, public débutant."
 }
};
