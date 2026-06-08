/* ==============================================
   STEP-GUIDES.JS — Guides enrichis par livrable + statut d acces des outils
   STEP_GUIDE : {freeTool, altTools, checklist, guide, promptExample}
   TOOL_ACCESS : statut par domaine (free/account/trial/paid) pour badges
   IDRAC — [AI-assisted]
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
    "label": "Canva (Presentations, gratuit)",
    "url": "https://www.canva.com/"
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
 },
 "swot": {
  "freeTool": {
   "label": "ChatGPT (GPT gratuit)",
   "url": "https://chatgpt.com",
   "why": "Ideal pour brainstormer et structurer les 4 quadrants SWOT en quelques minutes, croiser les facteurs pour generer des axes strategiques (SO/ST/WO/WT) et challenger votre analyse. Le tier gratuit suffit largement pour produire une matrice complete et hierarchisee."
  },
  "altTools": [
   {
    "label": "Miro (plan gratuit + template SWOT)",
    "url": "https://miro.com/templates/swot-analysis/"
   },
   {
    "label": "Canva (templates SWOT gratuits)",
    "url": "https://www.canva.com/fr_fr/graphiques/modeles-swot/"
   }
  ],
  "checklist": [
   "4 Forces internes concretes et factuelles (ressources, brevets, savoir-faire, marque)",
   "4 Faiblesses internes assumees (cout, notoriete, dependance, lacunes produit)",
   "4 Opportunites externes du marche (tendances, reglementation, technologie, niches non couvertes)",
   "4 Menaces externes (concurrents, substituts, evolution des usages, contexte economique)",
   "Chaque facteur priorise (haute/moyenne/faible importance pour le produit)",
   "Sources ou hypotheses citees pour chaque facteur externe (credibilite)",
   "Distinction nette interne (S/W) vs externe (O/T) verifiee",
   "Matrice visuelle 2x2 propre et lisible (couleurs par quadrant)",
   "Axe strategique 1 : croisement Forces x Opportunites (strategie offensive SO)",
   "Axe strategique 2 : croisement Faiblesses x Menaces (strategie defensive WT)",
   "1 action concrete decoulant de chaque axe strategique",
   "Synthese de 3 lignes : quel est le principal levier strategique du produit ?"
  ],
  "guide": [
   "1. Ouvre chatgpt.com et decris ton produit fictif en 4-5 lignes (categorie, cible, prix, contexte de marche).",
   "2. Demande de generer 4 forces, 4 faiblesses, 4 opportunites et 4 menaces, en les classant interne/externe.",
   "3. Challenge chaque facteur : demande de retirer les banalites et de garder les elements specifiques et factuels.",
   "4. Priorise : demande de noter chaque facteur de 1 a 3 selon son impact strategique sur le produit.",
   "5. Demande de croiser les quadrants pour produire une matrice TOWS (SO, ST, WO, WT) avec 1 strategie par croisement.",
   "6. Selectionne les 2 axes strategiques les plus pertinents (typiquement 1 offensif SO + 1 defensif WT).",
   "7. Recopie le contenu dans un template SWOT gratuit sur Canva ou Miro pour la mise en forme visuelle 2x2.",
   "8. Redige une synthese de 3 lignes designant le principal levier strategique a exploiter."
  ],
  "promptExample": "Tu es consultant en strategie marketing. Pour le produit fictif suivant : {theme}. Realise une analyse SWOT complete et factuelle. 1) Donne exactement 4 Forces et 4 Faiblesses (facteurs INTERNES), 4 Opportunites et 4 Menaces (facteurs EXTERNES) ; evite les banalites, sois specifique au produit. 2) Note chaque facteur de 1 a 3 selon son impact strategique. 3) Croise les quadrants en matrice TOWS et propose 1 strategie par croisement (SO offensive, ST, WO, WT defensive). 4) Selectionne les 2 axes strategiques prioritaires et donne pour chacun 1 action concrete. 5) Termine par une synthese de 3 lignes sur le principal levier strategique. Presente le tout en tableaux clairs."
 },
 "value-proposition": {
  "freeTool": {
   "label": "Claude (claude.ai, tier gratuit)",
   "url": "https://claude.ai",
   "why": "Excellent pour structurer un Value Proposition Canvas rigoureux : il distingue proprement les jobs/pains/gains du client du cote produit (gain creators/pain relievers/products & services) et verifie la coherence de l'adequation (fit). Sa qualite de raisonnement evite les propositions de valeur creuses."
  },
  "altTools": [
   {
    "label": "Miro (template Value Proposition Canvas gratuit)",
    "url": "https://miro.com/templates/value-proposition-canvas/"
   },
   {
    "label": "Canva (templates Value Proposition Canvas gratuits)",
    "url": "https://www.canva.com/fr_fr/graphiques/"
   }
  ],
  "checklist": [
   "3-5 Customer Jobs (taches fonctionnelles, sociales et emotionnelles du client)",
   "3-5 Pains (frustrations, risques, obstacles vecus par le client)",
   "3-5 Gains (benefices recherches, resultats attendus, surprises positives)",
   "Pains et gains hierarchises (du plus critique au moins important)",
   "3-5 Products & Services proposes par votre offre",
   "3-4 Pain Relievers (comment le produit soulage chaque douleur cle)",
   "3-4 Gain Creators (comment le produit cree chaque benefice attendu)",
   "Lien explicite entre chaque pain reliever et un pain client (verification du fit)",
   "Lien explicite entre chaque gain creator et un gain client (verification du fit)",
   "Identification du job principal (le plus important pour le client)",
   "Phrase de proposition de valeur synthetique (1 phrase qui resume le fit)",
   "Score de fit auto-evalue (faible/moyen/fort) avec justification"
  ],
  "guide": [
   "1. Ouvre claude.ai et decris ton client cible (profil, contexte d'usage) puis ton produit.",
   "2. Cote CLIENT (cercle) : demande la liste des Customer Jobs, Pains et Gains, hierarchises par importance.",
   "3. Demande d'identifier le job principal et les 3 pains/gains les plus critiques.",
   "4. Cote PRODUIT (carre) : liste tes Products & Services, puis demande les Pain Relievers et Gain Creators correspondants.",
   "5. Demande de mapper chaque pain reliever a un pain et chaque gain creator a un gain (table de fit).",
   "6. Fais evaluer le niveau d'adequation (fit) et identifier les pains/gains non couverts a combler.",
   "7. Demande une phrase unique de proposition de valeur resumant l'ensemble.",
   "8. Reporte les 6 blocs dans le template Value Proposition Canvas gratuit de Miro pour la presentation visuelle."
  ],
  "promptExample": "Tu es expert en strategie produit (methode Strategyzer). Pour le produit {theme} et son client cible, construis un Value Proposition Canvas complet. PARTIE CLIENT : liste 3 a 5 Customer Jobs (fonctionnels, sociaux, emotionnels), 3 a 5 Pains, 3 a 5 Gains ; hierarchise pains et gains par importance et identifie le job principal. PARTIE PRODUIT : liste mes Products & Services, puis 3 a 4 Pain Relievers et 3 a 4 Gain Creators. ADEQUATION : presente un tableau qui relie chaque pain reliever a un pain precis et chaque gain creator a un gain precis ; signale les pains/gains non couverts. Termine par une phrase unique de proposition de valeur et un score de fit (faible/moyen/fort) justifie."
 },
 "segmentation": {
  "freeTool": {
   "label": "Perplexity (recherche gratuite)",
   "url": "https://www.perplexity.ai",
   "why": "Parfait pour la segmentation car il combine raisonnement et recherche web sourcee : il aide a construire des segments realistes appuyes sur des donnees de marche reelles (taille, comportements, tendances) plutot que des personas inventes, et justifie le choix de la cible prioritaire avec des criteres chiffres."
  },
  "altTools": [
   {
    "label": "HubSpot Make My Persona (gratuit)",
    "url": "https://www.hubspot.com/make-my-persona"
   },
   {
    "label": "Google Sheets (matrice de scoring des segments)",
    "url": "https://sheets.google.com"
   }
  ],
  "checklist": [
   "Criteres de segmentation choisis et justifies (demographiques, geographiques, psychographiques, comportementaux)",
   "3 a 4 segments distincts et nommes (nom evocateur + 1 phrase de description)",
   "Profil de chaque segment : besoins, motivations, freins, budget",
   "Taille estimee ou poids relatif de chaque segment (chiffre ou ordre de grandeur)",
   "Comportement d'achat et canaux preferes par segment",
   "Niveau d'accessibilite du segment (peut-on l'atteindre facilement ?)",
   "Attractivite de chaque segment evaluee (potentiel de croissance, rentabilite)",
   "Matrice de scoring : segments x criteres (attractivite vs capacite a servir)",
   "Choix explicite de la cible prioritaire (1 segment principal)",
   "Justification chiffree du choix (pourquoi ce segment plutot qu'un autre)",
   "Mention d'un segment secondaire eventuel (cible de second rang)",
   "1 persona synthetique du segment prioritaire (HubSpot Make My Persona)"
  ],
  "guide": [
   "1. Sur Perplexity, decris ton produit {theme} et demande quels criteres de segmentation sont les plus pertinents pour ce marche.",
   "2. Demande de generer 3 a 4 segments distincts, avec pour chacun profil, besoins, taille estimee et canaux preferes, sources a l'appui.",
   "3. Verifie les sources citees par Perplexity pour valider les ordres de grandeur (taille de marche, tendances).",
   "4. Demande une matrice de scoring evaluant chaque segment sur attractivite et capacite a le servir.",
   "5. Fais recommander la cible prioritaire avec une justification chiffree, et un segment secondaire eventuel.",
   "6. Reporte la matrice de scoring dans Google Sheets pour la rendre lisible et ajustable.",
   "7. Construis le persona du segment prioritaire avec HubSpot Make My Persona (gratuit).",
   "8. Redige la decision de ciblage finale : segment retenu + 2-3 raisons cles."
  ],
  "promptExample": "Tu es strategiste marketing data-driven. Pour le produit {theme}, realise une segmentation et un ciblage. 1) Recommande les criteres de segmentation les plus pertinents pour ce marche (demographiques, geographiques, psychographiques, comportementaux) et justifie. 2) Definis 3 a 4 segments distincts : nom evocateur, description en 1 phrase, besoins/motivations/freins, budget, taille estimee (avec sources), canaux preferes. 3) Construis une matrice de scoring notant chaque segment sur attractivite (potentiel, rentabilite) et capacite a le servir (accessibilite, fit produit). 4) Recommande LA cible prioritaire avec une justification chiffree et mentionne un segment secondaire. Cite tes sources pour toutes les donnees de marche."
 },
 "objectives-okr": {
  "freeTool": {
   "label": "ChatGPT (GPT gratuit)",
   "url": "https://chatgpt.com",
   "why": "Tres efficace pour decliner des objectifs SMART et des OKR par etage du funnel (notoriete, consideration, conversion, retention) avec KPIs chiffres realistes et coherents entre eux. Il aide a calibrer les valeurs cibles et a relier chaque Key Result a un objectif mesurable."
  },
  "altTools": [
   {
    "label": "Notion (templates OKR gratuits)",
    "url": "https://www.notion.com/templates/category/okr"
   },
   {
    "label": "Google Sheets (tableau OKR / KPI)",
    "url": "https://sheets.google.com"
   }
  ],
  "checklist": [
   "1 objectif par etage de funnel : notoriete, consideration, conversion, retention (4 minimum)",
   "Chaque objectif redige au format SMART (Specifique, Mesurable, Atteignable, Realiste, Temporel)",
   "Un horizon temporel precise pour chaque objectif (ex : a 3, 6 ou 12 mois)",
   "2 a 3 Key Results chiffres par Objectif (structure OKR)",
   "KPI de notoriete chiffre (ex : reach, impressions, taux de notoriete assistee)",
   "KPI de consideration chiffre (ex : trafic site, taux d'engagement, leads)",
   "KPI de conversion chiffre (ex : taux de conversion, CAC, nombre de ventes)",
   "KPI de retention chiffre (ex : taux de retention, churn, NPS, repeat rate)",
   "Valeurs cibles realistes et coherentes entre les etages (entonnoir logique)",
   "Outil/source de mesure indique pour chaque KPI (ou et comment on mesure)",
   "Distinction claire entre metrique de vanite et metrique actionnable",
   "Tableau de bord recapitulatif (Objectif > KR > KPI > cible > echeance)"
  ],
  "guide": [
   "1. Sur chatgpt.com, rappelle le produit {theme}, sa cible prioritaire et l'horizon temporel (ex : 12 mois).",
   "2. Demande 1 objectif SMART par etage du funnel : notoriete, consideration, conversion, retention.",
   "3. Pour chaque objectif, demande 2 a 3 Key Results chiffres (format OKR) avec valeurs cibles realistes.",
   "4. Fais preciser le KPI associe a chaque KR et l'outil de mesure (Google Analytics, CRM, sondage...).",
   "5. Demande de verifier la coherence de l'entonnoir (les chiffres se suivent logiquement d'un etage a l'autre).",
   "6. Fais distinguer les metriques de vanite des metriques actionnables et ajuste si besoin.",
   "7. Demande un tableau de bord recapitulatif (Objectif > KR > KPI > cible > echeance).",
   "8. Reporte le tableau dans Notion ou Google Sheets pour le suivi."
  ],
  "promptExample": "Tu es responsable marketing growth. Pour le produit {theme} et sa cible prioritaire, sur un horizon de 12 mois, definis des objectifs SMART et OKR par etage du funnel. Donne 1 objectif par etage : NOTORIETE, CONSIDERATION, CONVERSION, RETENTION. Pour chaque objectif : 1) redige-le au format SMART avec une echeance ; 2) ajoute 2 a 3 Key Results chiffres et realistes ; 3) precise le KPI principal et l'outil de mesure ; 4) verifie que les chiffres forment un entonnoir coherent d'un etage a l'autre. Distingue les metriques de vanite des metriques actionnables. Presente le resultat dans un tableau : Objectif | Key Results | KPI | Valeur cible | Echeance | Outil de mesure."
 },
 "customer-journey": {
  "freeTool": {
   "label": "Miro (plan gratuit + template Customer Journey Map)",
   "url": "https://miro.com/templates/customer-journey-map/",
   "why": "Le meilleur outil gratuit pour cartographier visuellement un parcours client multi-etapes : le template gratuit propose deja les colonnes (etapes), les lignes (actions, emotions, points de contact, frictions) et permet de tracer la courbe emotionnelle. Combine avec une IA pour generer le contenu, le rendu est professionnel."
  },
  "altTools": [
   {
    "label": "Canva (templates Customer Journey Map gratuits)",
    "url": "https://www.canva.com/fr_fr/graphiques/"
   },
   {
    "label": "ChatGPT (generation du contenu du parcours)",
    "url": "https://chatgpt.com"
   }
  ],
  "checklist": [
   "5 etapes du parcours definies : awareness, consideration, purchase, retention, advocacy",
   "Objectif du client a chaque etape (que cherche-t-il a accomplir ?)",
   "Actions concretes du client a chaque etape",
   "Points de contact (touchpoints) listes par etape (site, reseaux sociaux, email, SAV, magasin...)",
   "Emotion du client a chaque etape (positive/neutre/negative)",
   "Courbe emotionnelle tracee visuellement le long du parcours",
   "Moments de friction / points de douleur identifies par etape",
   "Pensees ou questions du client a chaque etape (verbatim type)",
   "Au moins 2 opportunites d'amelioration par friction identifiee",
   "Identification du moment de verite (moment cle determinant pour la conversion ou la fidelite)",
   "Canaux owned/earned/paid distingues sur les touchpoints",
   "Synthese : les 2-3 frictions prioritaires a corriger en premier"
  ],
  "guide": [
   "1. Genere d'abord le contenu avec ChatGPT : decris {theme} et sa cible, demande le parcours en 5 etapes (awareness > advocacy).",
   "2. Pour chaque etape, demande : objectif client, actions, touchpoints, emotion (note de -2 a +2), frictions et pensees du client.",
   "3. Demande d'identifier le moment de verite et les 2-3 frictions prioritaires a corriger.",
   "4. Ouvre le template Customer Journey Map gratuit de Miro.",
   "5. Reporte les 5 etapes en colonnes et les lignes (actions, touchpoints, emotions, frictions) du contenu IA.",
   "6. Trace la courbe emotionnelle en reliant les notes d'emotion d'une etape a l'autre.",
   "7. Surligne visuellement les moments de friction (rouge) et le moment de verite.",
   "8. Ajoute une zone de synthese listant les opportunites d'amelioration prioritaires."
  ],
  "promptExample": "Tu es UX strategist. Pour le produit {theme} et sa cible prioritaire, construis une Customer Journey Map detaillee en 5 etapes : AWARENESS, CONSIDERATION, PURCHASE, RETENTION, ADVOCACY. Pour CHAQUE etape, donne dans un tableau : 1) l'objectif du client, 2) ses actions concretes, 3) les points de contact (en distinguant owned/earned/paid), 4) son emotion notee de -2 a +2, 5) ses pensees/questions (verbatim type), 6) les moments de friction. Ensuite : identifie le moment de verite du parcours, decris la courbe emotionnelle globale, et liste les 2 a 3 frictions prioritaires avec 2 opportunites d'amelioration chacune. Format tableau clair, pret a etre reporte dans Miro."
 },
 "positioning-statement": {
  "freeTool": {
   "label": "Claude (claude.ai, tier gratuit)",
   "url": "https://claude.ai",
   "why": "Le meilleur pour rediger un enonce de positionnement precis et distinctif au format Geoffrey Moore (Pour... qui... est... qui... car...). Sa finesse redactionnelle produit des formulations claires et credibles, et il aide a poser 2 axes pertinents pour la carte perceptuelle en evitant les axes correles."
  },
  "altTools": [
   {
    "label": "ChatGPT (variantes de formulation)",
    "url": "https://chatgpt.com"
   },
   {
    "label": "Canva (carte perceptuelle / graphique a points gratuit)",
    "url": "https://www.canva.com/fr_fr/graphiques/"
   }
  ],
  "checklist": [
   "Cible clairement nommee (Pour [cible]...)",
   "Besoin ou occasion d'usage precis (qui [besoin/probleme]...)",
   "Nom de marque/produit (la marque [nom]...)",
   "Categorie de reference identifiee (est [categorie de marche]...)",
   "Benefice cle differenciant et unique (qui [benefice cle]...)",
   "Preuve credible / reason to believe (car [preuve/raison d'y croire])",
   "Enonce complet redige en 1 a 2 phrases fluides",
   "2 a 3 variantes de l'enonce testees et comparees",
   "2 axes pertinents et non correles choisis pour la carte perceptuelle",
   "Positionnement de la marque place sur la carte perceptuelle",
   "3 a 5 concurrents positionnes sur la meme carte (espace concurrentiel)",
   "Identification d'un espace blanc / territoire de differenciation defendable"
  ],
  "guide": [
   "1. Sur claude.ai, rappelle le produit {theme}, sa cible prioritaire, sa proposition de valeur et son SWOT.",
   "2. Demande de remplir la formule : Pour [cible] qui [besoin], [marque] est [categorie] qui [benefice cle], car [preuve].",
   "3. Verifie chaque element : la cible est-elle precise, le benefice est-il unique, la preuve est-elle credible ?",
   "4. Demande 2 a 3 variantes de l'enonce et choisis la plus claire et distinctive.",
   "5. Demande de proposer 2 axes pertinents et NON correles pour une carte perceptuelle (ex : prix vs sophistication).",
   "6. Fais positionner ta marque et 3 a 5 concurrents sur ces 2 axes (coordonnees relatives).",
   "7. Identifie l'espace blanc (zone peu occupee) qui constitue ton territoire de differenciation.",
   "8. Reproduis la carte perceptuelle dans un graphique a points (scatter) gratuit sur Canva."
  ],
  "promptExample": "Tu es expert en strategie de marque. Pour le produit {theme} (cible prioritaire et proposition de valeur connues), redige un enonce de positionnement au format Geoffrey Moore : 'Pour [cible] qui [besoin/occasion], [marque] est [categorie] qui [benefice cle differenciant], car [preuve / reason to believe].' 1) Remplis chaque crochet de facon precise et credible. 2) Propose 3 variantes de l'enonce et recommande la meilleure en justifiant. 3) Propose 2 axes pertinents et NON correles pour une carte perceptuelle. 4) Place ma marque et 3 a 5 concurrents types sur ces 2 axes (donne des coordonnees relatives de 0 a 10). 5) Identifie l'espace blanc / territoire de differenciation defendable. Presente la carte perceptuelle sous forme de tableau de coordonnees pret a tracer."
 },
 "brand-archetype": {
  "freeTool": {
   "label": "ChatGPT (GPT-4o / o-series, tier gratuit)",
   "url": "https://chat.openai.com",
   "why": "Modèle conversationnel gratuit le plus polyvalent pour raisonner sur les 12 archétypes de Jung, croiser traits de personnalité, ton de voix et exemples de marques. Idéal pour itérer en dialogue (challenge ton choix d'archétype, propose un secondaire complémentaire, déduit les implications créatives couleur/typo/copy)."
  },
  "altTools": [
   {
    "label": "Claude (Anthropic, tier gratuit)",
    "url": "https://claude.ai"
   },
   {
    "label": "Google Gemini (tier gratuit)",
    "url": "https://gemini.google.com"
   }
  ],
  "checklist": [
   "Archétype PRINCIPAL choisi parmi les 12 de Jung (ex : Le Héros, Le Créateur, Le Sage, L'Explorateur, Le Magicien, L'Innocent, Le Rebelle, L'Amoureux, Le Bouffon, Le Souverain, Le Protecteur, L'Homme ordinaire)",
   "Archétype SECONDAIRE complémentaire choisi (nuance la personnalité, évite le cliché)",
   "Justification du choix en 3-4 phrases reliée au positionnement du produit et à la cible",
   "Liste de 5-7 TRAITS de personnalité de marque (adjectifs) découlant de l'archétype",
   "Définition du TON DE VOIX en 3 axes (ex : chaleureux vs distant, formel vs familier, sérieux vs ludique) avec curseur",
   "Le désir/motivation fondamental de l'archétype et la peur qu'il combat (moteur narratif)",
   "3-5 exemples de MARQUES réelles incarnant ce même archétype (preuve et inspiration)",
   "3 mots à DIRE et 3 mots à BANNIR dans la communication (vocabulaire de marque)",
   "Implications CRÉATIVES couleur : 2-3 directions chromatiques cohérentes avec l'archétype",
   "Implications CRÉATIVES typo : style de caractères suggéré (serif/sans, géométrique/humaniste)",
   "Implications CRÉATIVES imagerie : registre visuel (épuré, brut, onirique, premium...)",
   "Une phrase-promesse de marque qui résume l'archétype en une ligne mémorable"
  ],
  "guide": [
   "1. Ouvre ChatGPT et colle un prompt décrivant ton produit {theme}, sa cible et sa promesse, en demandant les 3 archétypes de Jung les plus pertinents avec arguments.",
   "2. Lis les propositions, puis demande à l'IA de comparer les 2 meilleurs et de t'aider à trancher selon ta différenciation concurrentielle.",
   "3. Fixe l'archétype PRINCIPAL et demande un SECONDAIRE qui le nuance sans le contredire ; valide la combinaison.",
   "4. Demande la fiche de personnalité : traits, désir fondamental, peur combattue, ton de voix sur 3 curseurs.",
   "5. Demande 5 marques réelles incarnant cet archétype et ce qu'elles font concrètement (pour t'inspirer sans copier).",
   "6. Demande le vocabulaire de marque : mots à dire / mots à bannir, et la phrase-promesse en une ligne.",
   "7. Demande les implications créatives (couleur, typo, imagerie) pour préparer les étapes suivantes de la Phase 2.",
   "8. Compile le tout dans une fiche d'une page ; relis et corrige les formulations génériques de l'IA pour qu'elles collent à TON produit."
  ],
  "promptExample": "Tu es un stratège de marque expert des 12 archétypes de Carl Jung. Mon produit est {theme}. Cible : [décris ta cible]. Promesse : [ta promesse]. 1) Propose les 3 archétypes de Jung les plus pertinents avec un argument chacun. 2) Recommande UN archétype principal + UN secondaire qui le nuance. 3) Donne la fiche de personnalité : 6 traits, le désir fondamental, la peur combattue, et le ton de voix sur 3 curseurs. 4) Cite 5 marques réelles incarnant cet archétype. 5) Liste 3 mots à dire et 3 mots à bannir. 6) Déduis les implications créatives (couleur, typo, imagerie). Termine par une phrase-promesse mémorable en une ligne."
 },
 "brand-story": {
  "freeTool": {
   "label": "Claude (Anthropic, tier gratuit)",
   "url": "https://claude.ai",
   "why": "Excellent en écriture longue et structurée : Claude excelle à tenir un fil narratif émotionnel, respecter une contrainte de longueur (manifeste 100-150 mots) et produire une copy avec rythme et voix de marque. Parfait pour le récit fondateur, le Golden Circle et le manifeste."
  },
  "altTools": [
   {
    "label": "ChatGPT (tier gratuit)",
    "url": "https://chat.openai.com"
   },
   {
    "label": "Google Gemini (tier gratuit)",
    "url": "https://gemini.google.com"
   }
  ],
  "checklist": [
   "Récit FONDATEUR : l'origine de la marque (déclencheur, problème vécu, étincelle) en 4-6 phrases",
   "Le CONFLIT / l'ENNEMI que la marque combat (statu quo, frustration client, injustice du marché)",
   "Le HÉROS de l'histoire = le client (la marque est le guide/mentor, pas le héros)",
   "La MISSION : ce que la marque veut changer dans le monde, formulée en une phrase",
   "La VISION : à quoi ressemble le monde si la marque réussit",
   "Golden Circle — WHY (la croyance/cause profonde, le pourquoi qui inspire)",
   "Golden Circle — HOW (ce qui rend l'approche unique, le processus distinctif)",
   "Golden Circle — WHAT (le produit/service concret livré)",
   "MANIFESTE de marque rédigé en 100-150 mots, ton incarné, rythme et punch",
   "Un arc émotionnel clair (tension → résolution) lisible dans le récit",
   "Cohérence avec l'archétype défini à l'étape précédente (ton, vocabulaire)",
   "Une phrase d'accroche / signature qui pourrait clôturer le manifeste"
  ],
  "guide": [
   "1. Ouvre Claude et fournis le contexte : produit {theme}, cible, archétype principal/secondaire, ton de voix défini précédemment.",
   "2. Demande d'abord le Golden Circle (Why/How/What) pour ancrer la cause profonde avant de raconter.",
   "3. Demande le récit fondateur en identifiant clairement le déclencheur et l'ennemi/conflit que la marque combat.",
   "4. Vérifie que le CLIENT est le héros et la marque le guide ; demande une réécriture si l'IA met la marque en avant.",
   "5. Demande le manifeste de marque en respectant STRICTEMENT 100-150 mots, ton incarné, phrases courtes et rythmées.",
   "6. Demande 3 variantes de la phrase de signature finale et choisis la plus mémorable.",
   "7. Fais relire à l'IA pour traquer le jargon creux et les clichés (synergie, leader, innovant) et les remplacer.",
   "8. Lis le manifeste à voix haute : si une phrase ne sonne pas, demande une reformulation ciblée."
  ],
  "promptExample": "Tu es copywriter de marque, spécialiste du storytelling à la Simon Sinek et Donald Miller (StoryBrand). Produit : {theme}. Cible : [ta cible]. Archétype : [principal + secondaire]. Ton de voix : [tes curseurs]. Livre dans l'ordre : 1) Le Golden Circle (Why = la croyance profonde, How = l'approche unique, What = le produit). 2) Le récit fondateur en 5 phrases avec un déclencheur clair et un ENNEMI/conflit que la marque combat. 3) Positionne le CLIENT comme héros et la marque comme guide. 4) La mission en une phrase et la vision en une phrase. 5) Un MANIFESTE de marque de 100 à 150 mots EXACTEMENT, incarné, phrases courtes et rythmées, avec un arc émotionnel tension→résolution. 6) Une phrase de signature finale, en 3 variantes. Bannis le jargon creux (synergie, leader, disruptif)."
 },
 "tagline-system": {
  "freeTool": {
   "label": "ChatGPT (tier gratuit)",
   "url": "https://chat.openai.com",
   "why": "Très fort pour générer en rafale des accroches courtes, jouer sur les figures de style (allitération, antithèse, rime), et décliner une tagline par canal et par usage. Idéal pour explorer beaucoup d'options puis filtrer selon des règles d'emploi."
  },
  "altTools": [
   {
    "label": "Claude (tier gratuit)",
    "url": "https://claude.ai"
   },
   {
    "label": "Google Gemini (tier gratuit)",
    "url": "https://gemini.google.com"
   }
  ],
  "checklist": [
   "TAGLINE PRINCIPALE (signature de marque) en 2-6 mots, mémorable et différenciante",
   "Justification : pourquoi cette tagline, quel bénéfice/émotion elle porte",
   "Variante COURTE (logo lockup / favicon / app icon) ≤ 3 mots",
   "Variante PUBLICITÉ / campagne (accroche plus émotionnelle ou aspirationnelle)",
   "Variante RÉSEAUX SOCIAUX (bio Instagram/LinkedIn, ton plus direct)",
   "Variante SITE WEB / hero (orientée bénéfice clair pour le visiteur)",
   "Variante PACKAGING / point de vente (concise, lisible de loin)",
   "Test de la figure de style employée (rime, allitération, antithèse, rythme)",
   "RÈGLES D'EMPLOI : quand utiliser la principale vs une variante",
   "Règle de PLACEMENT par rapport au logo (à côté / dessous / jamais séparé)",
   "Liste de 3-4 taglines REJETÉES avec la raison du rejet (pédagogie du choix)",
   "Vérification d'unicité : la tagline n'est pas déjà utilisée par une marque connue"
  ],
  "guide": [
   "1. Ouvre ChatGPT, donne le produit {theme}, l'archétype, le manifeste et la promesse définis avant.",
   "2. Demande 20 propositions de tagline principale variées en angle (bénéfice, émotion, jeu de mots, défi).",
   "3. Sélectionne 3 favorites et demande à l'IA d'évaluer mémorabilité, clarté et unicité de chacune.",
   "4. Choisis LA principale, puis demande de la décliner par canal : courte, pub, réseaux, site, packaging.",
   "5. Demande quelle figure de style est utilisée et propose une variante alternative par canal.",
   "6. Demande les règles d'emploi (quand utiliser quelle variante, placement vs logo).",
   "7. Demande 4 taglines volontairement écartées avec la raison, pour documenter ton raisonnement.",
   "8. Vérifie l'unicité par une recherche web rapide pour éviter une accroche déjà déposée."
  ],
  "promptExample": "Tu es directeur de création publicitaire spécialiste des accroches. Produit : {theme}. Archétype : [le tien]. Promesse : [ta promesse]. 1) Génère 20 taglines principales (2 à 6 mots) en variant l'angle : bénéfice rationnel, émotion, jeu de mots, défi, vision. 2) Sélectionne les 3 meilleures et note chacune sur mémorabilité, clarté et unicité (/10). 3) Pour la meilleure, crée un SYSTÈME : variante courte (≤3 mots pour logo), variante pub/campagne, variante réseaux sociaux, variante site web/hero, variante packaging. 4) Indique la figure de style de chaque. 5) Donne les RÈGLES D'EMPLOI (quel canal → quelle variante, placement par rapport au logo). 6) Liste 4 taglines rejetées avec la raison. Tout en français."
 },
 "iconography": {
  "freeTool": {
   "label": "Recraft (tier gratuit)",
   "url": "https://www.recraft.com",
   "why": "Recraft génère des icônes vectorielles cohérentes en série, avec contrôle du style (line, solid, duotone) et export SVG — rare et précieux pour un set de pictos exploitable. Son tier gratuit suffit pour produire un set cohérent de marque, là où les générateurs raster classiques peinent sur la régularité d'un système d'icônes."
  },
  "altTools": [
   {
    "label": "Ideogram (tier gratuit, fort sur formes nettes/texte)",
    "url": "https://ideogram.ai"
   },
   {
    "label": "Microsoft Designer (gratuit avec compte Microsoft)",
    "url": "https://designer.microsoft.com"
   }
  ],
  "checklist": [
   "STYLE d'icône défini : line / solid / duotone / rounded (cohérent avec l'archétype)",
   "GRILLE de construction définie (ex : 24x24 px, zone de sécurité, padding)",
   "Épaisseur de TRAIT (stroke) constante sur tout le set (ex : 2 px)",
   "Coins (arrondis vs vifs) cohérents avec la typo et le logo",
   "Set de 8 à 12 PICTOS clés couvrant les fonctions du produit/parcours utilisateur",
   "Chaque picto immédiatement reconnaissable à petite taille (test 16-24 px)",
   "PALETTE limitée appliquée (mono ou 1-2 couleurs de marque max)",
   "Cohérence d'optique : tailles visuelles harmonisées (pas un picto énorme à côté d'un petit)",
   "Export en SVG (vectoriel) ou à défaut PNG transparent haute résolution",
   "Règles d'USAGE : taille minimale, espace de respiration, fonds autorisés/interdits",
   "Do / Don't illustrés (ne pas déformer, ne pas mélanger les styles, ne pas recolorer hors palette)",
   "Planche-contact (icon sheet) regroupant tous les pictos avec leur nom"
  ],
  "guide": [
   "1. Définis d'abord le style sur ChatGPT/Claude (line vs solid, arrondi, palette) en cohérence avec l'archétype, puis liste les 10 fonctions à iconifier.",
   "2. Ouvre Recraft, choisis le mode Icon et fixe un style de référence (ex : line, stroke 2px, coins arrondis).",
   "3. Génère le premier picto comme RÉFÉRENCE de style, ajuste jusqu'à validation.",
   "4. Réutilise EXACTEMENT le même prompt de style en ne changeant que le sujet, pour garder la cohérence du set.",
   "5. Génère les 8-12 pictos un par un, en gardant la même grille, épaisseur et palette.",
   "6. Vérifie la lisibilité de chaque picto en l'affichant à 16-24 px ; régénère ceux qui deviennent illisibles.",
   "7. Exporte en SVG (ou PNG transparent), nomme chaque fichier par sa fonction.",
   "8. Assemble une planche-contact dans Canva avec les règles d'usage et un bloc Do/Don't."
  ],
  "promptExample": "A flat {style} icon of [sujet], for the brand {theme}, consistent icon-system style: 2px uniform stroke weight, rounded corners, monochrome [couleur de marque] on transparent background, 24x24 grid with safe padding, minimal and geometric, instantly recognizable at small size, no text, no shadow, vector clean. Keep the exact same line weight and corner radius as the other icons in the set."
 },
 "photo-style": {
  "freeTool": {
   "label": "Leonardo.ai (tier gratuit, ~150 crédits/jour)",
   "url": "https://leonardo.ai",
   "why": "Leonardo offre un vrai tier gratuit quotidien généreux, des modèles photoréalistes (Phoenix, Lightning XL) et surtout des contrôles de direction artistique (style references, presets) parfaits pour fixer une direction imagée reproductible : sujets, cadrage, lumière, palette."
  },
  "altTools": [
   {
    "label": "FLUX.1 [schnell] sur Hugging Face (gratuit, photoréalisme fort)",
    "url": "https://huggingface.co/black-forest-labs/FLUX.1-schnell"
   },
   {
    "label": "Ideogram (tier gratuit)",
    "url": "https://ideogram.ai"
   }
  ],
  "checklist": [
   "DIRECTION définie : photo réaliste, illustration, 3D, mixte (et pourquoi)",
   "SUJETS récurrents (personnes, produit en situation, environnements, détails macro)",
   "CADRAGE privilégié (plans larges/serrés, règle des tiers, espace négatif pour la copy)",
   "LUMIÈRE caractéristique (naturelle douce, contrastée, golden hour, studio...)",
   "PALETTE chromatique de l'imagerie alignée sur les couleurs de marque",
   "AMBIANCE / mood en 3 adjectifs (ex : authentique, lumineux, optimiste)",
   "TRAITEMENT : grain, saturation, contraste, profondeur de champ",
   "Représentation et DIVERSITÉ des personnes (inclusivité, réalisme)",
   "Liste de 4-6 DO (ce qu'on montre toujours)",
   "Liste de 4-6 DON'T (ce qu'on ne montre jamais : stock cliché, fonds chargés...)",
   "3 IMAGES exemples générées illustrant la direction (héros, produit, lifestyle)",
   "Une moodboard / planche assemblant les exemples + annotations de la direction"
  ],
  "guide": [
   "1. Définis la direction imagée par écrit (sujets, lumière, mood, palette) avec ChatGPT/Claude en cohérence avec l'archétype.",
   "2. Ouvre Leonardo.ai, choisis un modèle photoréaliste (Phoenix/Lightning XL) et règle le format adapté (16:9 héros, 1:1 social).",
   "3. Rédige un prompt détaillé encodant sujet + cadrage + lumière + palette + mood ; génère la première image héros.",
   "4. Active une Style Reference ou réutilise les mêmes mots-clés de style pour garantir la cohérence entre images.",
   "5. Génère une 2e image (produit en situation) et une 3e (lifestyle/détail) avec le MÊME bloc de style.",
   "6. Trie : garde les 3 images qui respectent le mieux la direction, régénère celles qui dérivent.",
   "7. Formalise les règles DO / DON'T à partir de ce qui marche et de ce qui sonne faux (stock cliché).",
   "8. Assemble une moodboard annotée dans Canva (3 images + description de la direction imagée)."
  ],
  "promptExample": "Editorial brand photography for {theme}, [sujet : a young person using the product in a bright modern kitchen], shot on 50mm, shallow depth of field, soft natural golden-hour light from a window, color palette dominated by [couleurs de marque], authentic candid mood, optimistic and warm, subtle film grain, negative space on the right for copy, photorealistic, high detail, no text, no logo, 16:9. Keep this exact lighting and color grading consistent across the whole image series."
 },
 "brand-applications": {
  "freeTool": {
   "label": "Canva (tier gratuit)",
   "url": "https://www.canva.com",
   "why": "Canva gratuit couvre TOUTES les applications de marque dans un seul outil : cartes de visite (gabarits + impression), signatures mail, mockups de tote bag/t-shirt/sticker, avatars et bannières aux bons formats par réseau, et templates réutilisables. Insertion directe du logo, des couleurs et de la typo définis dans les étapes précédentes."
  },
  "altTools": [
   {
    "label": "Mockey.ai (mockups produits/merch gratuits, sans watermark)",
    "url": "https://mockey.ai"
   },
   {
    "label": "Microsoft Designer (bannières & visuels, gratuit)",
    "url": "https://designer.microsoft.com"
   }
  ],
  "checklist": [
   "CARTE DE VISITE recto/verso (logo, nom, fonction, contacts, couleurs de marque)",
   "SIGNATURE MAIL HTML/image (nom, fonction, logo, liens, cohérente avec la charte)",
   "Mockup TOTE BAG avec le logo/tagline positionné correctement",
   "Mockup T-SHIRT (placement et taille du visuel validés)",
   "Planche de STICKERS (2-3 déclinaisons : logo, picto, tagline)",
   "AVATAR / photo de profil réseaux (format carré, lisible en petit cercle)",
   "BANNIÈRE LinkedIn (1584x396) aux couleurs de marque",
   "BANNIÈRE / cover réseau secondaire (ex : YouTube 2560x1440 ou X 1500x500)",
   "Au moins 1 TEMPLATE de post social réutilisable (citation/annonce)",
   "Respect strict de la charte : couleurs HEX exactes, typo, zone de protection du logo",
   "Versions sur fond clair ET fond foncé pour la lisibilité",
   "Fichiers exportés aux bons formats (PNG/PDF), nommés clairement, regroupés dans un dossier"
  ],
  "guide": [
   "1. Crée un Kit de marque dans Canva (ou un projet) : importe le logo, saisis les couleurs HEX et la typo définis avant.",
   "2. Pars d'un gabarit Carte de visite, remplace le contenu, applique tes couleurs/typo, exporte recto/verso en PDF.",
   "3. Crée la signature mail (gabarit email signature), insère logo + liens, exporte en image ou copie le bloc HTML.",
   "4. Utilise les gabarits de mockups (ou Mockey.ai) pour appliquer le logo sur tote bag, t-shirt et stickers.",
   "5. Conçois l'avatar (format 1:1) en testant sa lisibilité dans un petit cercle, puis exporte en PNG.",
   "6. Crée les bannières aux formats exacts par réseau (LinkedIn 1584x396, etc.) avec couleurs de marque.",
   "7. Construis 1 template de post réutilisable (placeholders modifiables) pour la cohérence future.",
   "8. Décline chaque application en version fond clair et fond foncé, puis exporte et range tout dans un dossier nommé."
  ],
  "promptExample": "Agis comme directeur artistique. Pour la marque {theme} (couleurs : [HEX], typo : [nom], logo : [description]), liste-moi pour CHAQUE application de marque les spécifications de design précises à reproduire dans Canva : 1) carte de visite recto/verso (hiérarchie, infos, placement logo), 2) signature mail (structure, liens), 3) mockups tote bag / t-shirt / sticker (placement et taille du visuel), 4) avatar réseaux (lisibilité en petit), 5) bannières LinkedIn 1584x396 et X 1500x500 (composition), 6) template de post social réutilisable. Pour chacune : format/dimensions exacts, couleurs à utiliser, zone de protection du logo, et 2 erreurs à éviter. Donne aussi pour chaque application une version fond clair et une version fond foncé."
 }
};
window.AIA.TOOL_ACCESS = {
 "huggingface.co": {
  "access": "account",
  "note": "Compte gratuit = inference, datasets et quota GPU quotidien (ZeroGPU)"
 },
 "chatgpt.com": {
  "access": "account",
  "note": "Compte gratuit = acces GPT avec limites; modeles avances payants"
 },
 "claude.ai": {
  "access": "account",
  "note": "Compte gratuit = usage quotidien limite de Claude"
 },
 "perplexity.ai": {
  "access": "account",
  "note": "Compte gratuit = recherches illimitees; recherche Pro limitee/jour"
 },
 "gemini.google.com": {
  "access": "account",
  "note": "Gratuit avec compte Google, quotas sur les modeles avances"
 },
 "ideogram.ai": {
  "access": "account",
  "note": "Freemium : ~10 credits lents/semaine, generations publiques"
 },
 "leonardo.ai": {
  "access": "account",
  "note": "Freemium : 150 tokens/jour + mode Relaxed illimite sur certains modeles"
 },
 "recraft.com": {
  "access": "account",
  "note": "Freemium : 30 credits/jour, images publiques et possedees par Recraft"
 },
 "looka.com": {
  "access": "trial",
  "note": "Design gratuit, mais telechargement du logo payant des 20$"
 },
 "canva.com": {
  "access": "account",
  "note": "Compte gratuit genereux; fonctions Magic/Pro et certains assets payants"
 },
 "namelix.com": {
  "access": "free",
  "note": "Generateur de noms gratuit; logo associe (Brandmark) payant"
 },
 "suno.com": {
  "access": "account",
  "note": "Freemium : 50 credits/jour (~10 chansons), usage non-commercial"
 },
 "udio.com": {
  "access": "account",
  "note": "Freemium : 10 credits/jour + 100/mois, morceaux publics, pas de droits commerciaux"
 },
 "elevenlabs.io": {
  "access": "account",
  "note": "Freemium : 10 000 credits/mois (~10 min TTS), attribution requise"
 },
 "mubert.com": {
  "access": "account",
  "note": "Freemium Ambassador : 25 pistes/mois, perso non-commercial avec attribution"
 },
 "runwayml.com": {
  "access": "trial",
  "note": "Freemium : 125 credits one-time (non renouveles), videos filigranees"
 },
 "klingai.com": {
  "access": "account",
  "note": "Freemium : 66 credits/jour, 720p, filigrane"
 },
 "lumalabs.ai": {
  "access": "account",
  "note": "Freemium : ~1 video courte 720p/jour, filigranee, non-commercial"
 },
 "pika.art": {
  "access": "account",
  "note": "Freemium : credits mensuels (~80-150), 480p avec filigrane"
 },
 "capcut.com": {
  "access": "account",
  "note": "Editeur gratuit avec compte; effets/exports premium payants"
 },
 "heygen.com": {
  "access": "account",
  "note": "Freemium : 3 videos/mois (1 min, 720p), filigrane, 1 avatar"
 },
 "framer.com": {
  "access": "account",
  "note": "Plan gratuit (sous-domaine framer.website); domaine perso et CMS payants"
 },
 "v0.dev": {
  "access": "trial",
  "note": "Freemium : 5$ de credits/mois, 7 messages/jour"
 },
 "gamma.app": {
  "access": "trial",
  "note": "Freemium : 400 credits a vie (non renouveles), filigrane 'Made with Gamma'"
 },
 "tome.app": {
  "access": "paid",
  "note": "Outil de presentation arrete (avril 2025), pivot vers Lightfield/sales"
 },
 "beautiful.ai": {
  "access": "paid",
  "note": "Pas de plan gratuit, essai 14 jours avec carte requise puis payant"
 },
 "designer.microsoft.com": {
  "access": "account",
  "note": "Gratuit avec compte Microsoft : 15 credits IA/mois"
 },
 "mockey.ai": {
  "access": "account",
  "note": "Freemium : mockups gratuits, telechargements HD/sans filigrane et IA payants"
 },
 "pacdora.com": {
  "access": "account",
  "note": "Freemium : mockups packaging gratuits, exports HD et 3D premium payants"
 },
 "milanote.com": {
  "access": "account",
  "note": "Plan gratuit : 100 notes/images et 10 fichiers; illimite payant"
 },
 "realtimecolors.com": {
  "access": "free",
  "note": "Gratuit, aucun compte requis pour tester palettes/typographies"
 },
 "fontjoy.com": {
  "access": "free",
  "note": "Gratuit, sans compte : appariement de polices Google Fonts"
 },
 "adobe.com/express": {
  "access": "account",
  "note": "Plan gratuit avec compte Adobe; Firefly/credits generatifs limites"
 },
 "answerthepublic.com": {
  "access": "account",
  "note": "Freemium : quelques recherches gratuites/jour, illimite payant"
 },
 "brevo.com": {
  "access": "account",
  "note": "Plan gratuit : jusqu'a 300 emails/jour, CRM de base"
 },
 "carrd.co": {
  "access": "account",
  "note": "Gratuit : jusqu'a 3 sites en sous-domaine; domaine perso et formulaires payants"
 },
 "copy.ai": {
  "access": "account",
  "note": "Freemium : credits/mots gratuits limites par mois"
 },
 "create.vista.com": {
  "access": "account",
  "note": "Freemium : edition gratuite, telechargements premium et sans filigrane payants"
 },
 "durable.co": {
  "access": "account",
  "note": "Plan gratuit : sous-domaine, IA et edition; domaine perso payant"
 },
 "sheets.google.com": {
  "access": "account",
  "note": "Gratuit avec compte Google, tableur en ligne complet"
 },
 "trends.google.com": {
  "access": "free",
  "note": "Gratuit, sans compte : tendances de recherche"
 },
 "hubspot.com": {
  "access": "account",
  "note": "CRM et outils gratuits avec compte; fonctions avancees payantes"
 },
 "mailchimp.com": {
  "access": "account",
  "note": "Plan gratuit : jusqu'a 500 contacts, 1 000 emails/mois"
 },
 "mailerlite.com": {
  "access": "account",
  "note": "Plan gratuit : 1 000 abonnes, 12 000 emails/mois"
 },
 "napkin.ai": {
  "access": "account",
  "note": "Freemium : 500 credits IA/semaine, exports avec filigrane"
 },
 "notion.so": {
  "access": "account",
  "note": "Plan gratuit perso genereux; IA et collaboration avancee payantes"
 },
 "pinterest.com": {
  "access": "account",
  "note": "Gratuit avec compte; inspiration/moodboards"
 },
 "reddit.com": {
  "access": "free",
  "note": "Lecture libre sans compte; publier/voter necessite un compte gratuit"
 },
 "shopify.com": {
  "access": "trial",
  "note": "Pas de plan gratuit permanent : essai (~3 j puis 1$/mois 3 mois), puis abonnement"
 },
 "ttsmaker.com": {
  "access": "free",
  "note": "Gratuit sans compte : TTS et telechargement, usage commercial autorise"
 },
 "miro.com": {
  "access": "account",
  "note": "Plan gratuit : 3 tableaux editables, modeles de base"
 },
 "midjourney.com": {
  "access": "paid",
  "note": "Payant, plus d'essai gratuit; abonnement requis des 10$/mois"
 }
};
