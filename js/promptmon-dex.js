/* ==============================================
   PROMPTMON-DEX.JS — Le Pokédex des 25 PromptMon (75 formes)
   Méta-jeu "PokePrompt" de l'AtelierIAIdrac.
   5 types inventés × 5 créatures. Chaque créature : base + 2 évolutions (paliers niv. 5 et 10).
   Données pures (aucun asset externe) : noms, type, palette, recipe (pour le générateur pixel),
   lore et signature. Le rendu est fait par promptmon-sprite.js.
   IDRAC Business School — [AI-assisted]
   ============================================== */
(function () {
  'use strict';

  // Paliers d'évolution (niveau de la créature requis)
  var EVO_LEVELS = [5, 10]; // evoStage 0->1 au niveau 5, 1->2 au niveau 10
  var MAX_LEVEL = 10;

  // Types : couleur d'accent + emoji + libellé
  var TYPES = {
    pyro:  { label: 'Pyro',  emoji: '🔥', color: '#e8503a', tag: 'Feu' },
    aqua:  { label: 'Aqua',  emoji: '💧', color: '#3aa0e8', tag: 'Eau' },
    flora: { label: 'Flora', emoji: '🌿', color: '#4caf50', tag: 'Nature' },
    volt:  { label: 'Volt',  emoji: '⚡', color: '#7c5cff', tag: 'Data' },
    lumen: { label: 'Lumen', emoji: '✨', color: '#f5c542', tag: 'Lumière' }
  };

  // Palette helper : p=primaire (corps), s=secondaire (ventre/ombre), a=accent (détails), o=outline
  function pal(p, s, a, o) { return { p: p, s: s, a: a, o: o || '#20143a' }; }

  /* === LES 25 CRÉATURES === */
  // recipe : body(0-4) ears(0-4) eyes(0-2) belly(0-3) tail(0-3)
  var DEX = [
    // ---------- PYRO (Feu) ----------
    { id: 1, type: 'pyro', species: 'lizard', names: ['Braizou', 'Flammiraptor', 'Infernaxis'],
      palette: pal('#e8503a', '#ffb347', '#ffe66d'), recipe: { body: 0, ears: 1, eyes: 0, belly: 1, tail: 1 },
      lore: 'Salamandre de braise dont la crête s’enflamme quand un prompt l’inspire.', signature: 'Affinité : logos chauds & marques énergiques.' },
    { id: 2, type: 'pyro', species: 'bear', names: ['Tisorel', 'Brasieur', 'Vulcanor'],
      palette: pal('#d6402e', '#ff7a45', '#ffd24d'), recipe: { body: 2, ears: 2, eyes: 1, belly: 0, tail: 2 },
      lore: 'Ours forgeron : il martèle les idées au feu de sa forge.', signature: 'Bonus de créativité sur les visuels industriels.' },
    { id: 3, type: 'pyro', species: 'flameghost', names: ['Pyttle', 'Ignivore', 'Solficus'],
      palette: pal('#ff6b3d', '#ffae63', '#fff1a8'), recipe: { body: 1, ears: 0, eyes: 2, belly: 2, tail: 0 },
      lore: 'Esprit-flammèche espiègle, gourmand de couleurs vives.', signature: 'Excelle dans les palettes saturées.' },
    { id: 4, type: 'pyro', species: 'phoenix', names: ['Charbi', 'Embrasor', 'Cendraxia'],
      palette: pal('#c0392b', '#e8703a', '#f5b731'), recipe: { body: 3, ears: 3, eyes: 0, belly: 1, tail: 3 },
      lore: 'Phénix né d’un charbon : il renaît plus fort de ses cendres.', signature: 'Résilience : meilleure remontée après défaite.' },
    { id: 5, type: 'pyro', species: 'lynx', names: ['Flamûle', 'Pyrolynx', 'Magmadon'],
      palette: pal('#e74c3c', '#ff9248', '#ffe066'), recipe: { body: 4, ears: 4, eyes: 1, belly: 3, tail: 1 },
      lore: 'Lynx de magma aux oreilles à plumets, rapide comme une étincelle.', signature: 'Affinité : mascottes dynamiques.' },

    // ---------- AQUA (Eau) ----------
    { id: 6, type: 'aqua', species: 'axolotl', names: ['Gouttiz', 'Ondulor', 'Tsunamira'],
      palette: pal('#3aa0e8', '#9be3ff', '#e0f7ff'), recipe: { body: 1, ears: 0, eyes: 0, belly: 2, tail: 2 },
      lore: 'Axolotl souriant : ses branchies frémissent devant une bonne idée.', signature: 'Affinité : interfaces fluides & apaisantes.' },
    { id: 7, type: 'aqua', species: 'pufferfish', names: ['Bullin', 'Aquariel', 'Abyssodon'],
      palette: pal('#2d7fc4', '#6fc6ff', '#cdeeff'), recipe: { body: 0, ears: 1, eyes: 2, belly: 1, tail: 1 },
      lore: 'Poisson-globe des profondeurs : calme, jusqu’à ce qu’il se gonfle.', signature: 'Bonus sur les ambiances nocturnes.' },
    { id: 8, type: 'aqua', species: 'frog', names: ['Flaquo', 'Ruisselin', 'Cascadrak'],
      palette: pal('#2bb5d9', '#7fe0ef', '#dafaff'), recipe: { body: 2, ears: 2, eyes: 1, belly: 0, tail: 3 },
      lore: 'Grenouille de torrent : bondit d’une idée à l’autre, jamais immobile.', signature: 'Vitesse : combats résolus plus vite.' },
    { id: 9, type: 'aqua', species: 'jellyfish', names: ['Méduzi', 'Coralisk', 'Nautilux'],
      palette: pal('#4aa8d8', '#a6e6ff', '#eafaff'), recipe: { body: 4, ears: 0, eyes: 0, belly: 3, tail: 0 },
      lore: 'Méduse luminescente des récifs, hypnotique en pleine eau.', signature: 'Affinité : visuels organiques & motifs.' },
    { id: 10, type: 'aqua', species: 'penguin', names: ['Givrette', 'Banquor', 'Cryotitan'],
      palette: pal('#7ec8e8', '#c9f0ff', '#ffffff'), recipe: { body: 3, ears: 3, eyes: 2, belly: 1, tail: 2 },
      lore: 'Pingouin de banquise, élégant smoking et sang-froid légendaire.', signature: 'Affinité : design minimaliste & froid.' },

    // ---------- FLORA (Nature) ----------
    { id: 11, type: 'flora', species: 'rabbit', names: ['Boutonet', 'Fougaïa', 'Sylvanthe'],
      palette: pal('#4caf50', '#a5d66a', '#ffe66d'), recipe: { body: 0, ears: 4, eyes: 0, belly: 2, tail: 0 },
      lore: 'Lapin des bourgeons : ses oreilles poussent comme des pousses au printemps.', signature: 'Affinité : marques éco & naturelles.' },
    { id: 12, type: 'flora', species: 'hedgehog', names: ['Glandou', 'Liéronce', 'Chênodryade'],
      palette: pal('#3e9142', '#8cc663', '#d4a843'), recipe: { body: 3, ears: 3, eyes: 1, belly: 1, tail: 3 },
      lore: 'Hérisson tenace : ses piquants protègent les meilleures idées.', signature: 'Résilience : encaisse mieux les revers.' },
    { id: 13, type: 'flora', species: 'mushroom', names: ['Sporelle', 'Mycélio', 'Champsuzerain'],
      palette: pal('#6aa84f', '#bcd99a', '#e86a8e'), recipe: { body: 1, ears: 0, eyes: 2, belly: 3, tail: 0 },
      lore: 'Champignon facétieux relié à tout le réseau racinaire de la classe.', signature: 'Affinité : motifs répétitifs & patterns.' },
    { id: 14, type: 'flora', species: 'cactus', names: ['Cactin', 'Épinor', 'Saguaron'],
      palette: pal('#57a05a', '#9ed46f', '#f2c14e'), recipe: { body: 2, ears: 2, eyes: 0, belly: 0, tail: 1 },
      lore: 'Cactus du désert en pot : piquant mais d’une fidélité absolue.', signature: 'Affinité : styles bold & contrastés.' },
    { id: 15, type: 'flora', species: 'snake', names: ['Lianou', 'Vrillette', 'Kudzilla'],
      palette: pal('#46a047', '#8fcf6a', '#ffe066'), recipe: { body: 4, ears: 1, eyes: 1, belly: 2, tail: 2 },
      lore: 'Serpent-liane : il s’enroule autour des concepts et grimpe vers la lumière.', signature: 'Croissance rapide : XP créature optimisé.' },

    // ---------- VOLT (Data / Électrique) ----------
    { id: 16, type: 'volt', species: 'mouse', names: ['Bitsy', 'Voltracé', 'Datastryx'],
      palette: pal('#7c5cff', '#b39cff', '#ffe066'), recipe: { body: 1, ears: 1, eyes: 2, belly: 1, tail: 2 },
      lore: 'Souris-bit : grandes oreilles paraboliques, elle capte toutes les données.', signature: 'Affinité : UI tech & dashboards.' },
    { id: 17, type: 'volt', species: 'robot', names: ['Pixou', 'Glitchar', 'Mégabyton'],
      palette: pal('#6a47e0', '#a78bff', '#3ad6c8'), recipe: { body: 0, ears: 0, eyes: 0, belly: 3, tail: 0 },
      lore: 'Petit robot rebelle, antenne frémissante, fan de glitch art.', signature: 'Affinité : esthétiques cyber & glitch.' },
    { id: 18, type: 'volt', species: 'bat', names: ['Étincel', 'Fulguron', 'Tonnerax'],
      palette: pal('#8e6bff', '#c0aaff', '#ffd84d'), recipe: { body: 4, ears: 4, eyes: 1, belly: 2, tail: 1 },
      lore: 'Chauve-souris d’orage : ses ailes crépitent d’électricité statique.', signature: 'Affinité : visuels à fort contraste.' },
    { id: 19, type: 'volt', species: 'octopus', names: ['Cabolt', 'Circuial', 'Réseaurus'],
      palette: pal('#5d52d6', '#9a8cf0', '#43e0a0'), recipe: { body: 2, ears: 2, eyes: 2, belly: 0, tail: 3 },
      lore: 'Pieuvre câblée : huit tentacules, huit connexions simultanées.', signature: 'Affinité : schémas & infographies.' },
    { id: 20, type: 'volt', species: 'bee', names: ['Watto', 'Ampèros', 'Dynastryke'],
      palette: pal('#7b5bf0', '#b6a3ff', '#ffe066'), recipe: { body: 3, ears: 3, eyes: 0, belly: 1, tail: 2 },
      lore: 'Abeille dynamo : ses rayures stockent l’énergie, son dard la libère.', signature: 'Endurance : plus de combats par jour.' },

    // ---------- LUMEN (Lumière / IA) ----------
    { id: 21, type: 'lumen', species: 'butterfly', names: ['Lumini', 'Éclaïon', 'Prismatra'],
      palette: pal('#f5c542', '#fff3c4', '#ffffff'), recipe: { body: 0, ears: 1, eyes: 0, belly: 2, tail: 0 },
      lore: 'Papillon de lumière : ses ailes irisées s’ouvrent sur les bonnes idées.', signature: 'Affinité : marques premium & lumineuses.' },
    { id: 22, type: 'lumen', species: 'owl', names: ['Halone', 'Auréor', 'Solsage'],
      palette: pal('#f0b429', '#ffe08a', '#fffbe6'), recipe: { body: 3, ears: 3, eyes: 1, belly: 1, tail: 1 },
      lore: 'Hibou sage aux grands yeux : il voit les chemins créatifs dans le noir.', signature: 'Sagesse : meilleurs conseils de prompt.' },
    { id: 23, type: 'lumen', species: 'starfish', names: ['Brilou', 'Lustria', 'Astralux'],
      palette: pal('#ffd24d', '#fff0b0', '#9be3ff'), recipe: { body: 1, ears: 0, eyes: 2, belly: 3, tail: 2 },
      lore: 'Étoile de mer filante, cinq branches toujours pressées de briller.', signature: 'Affinité : effets scintillants & glow.' },
    { id: 24, type: 'lumen', species: 'fox', names: ['Néonet', 'Hologram', 'Spectraxis'],
      palette: pal('#f5c542', '#ffe89a', '#e86a8e'), recipe: { body: 2, ears: 2, eyes: 0, belly: 0, tail: 3 },
      lore: 'Renard néon : sa queue laisse une traînée d’hologrammes.', signature: 'Affinité : esthétiques néon & futuristes.' },
    { id: 25, type: 'lumen', species: 'dragon', names: ['Étoilin', 'Constella', 'Galaxianthe'],
      palette: pal('#ffcf4d', '#fff1bf', '#b39cff'), recipe: { body: 4, ears: 4, eyes: 1, belly: 2, tail: 1 },
      lore: 'Dragon céleste né d’une constellation : il porte un ciel entier en lui.', signature: 'Affinité : compositions cosmiques.' }
  ];

  function getCreature(id) {
    id = parseInt(id, 10);
    return DEX.find(function (c) { return c.id === id; }) || null;
  }
  function getType(typeId) { return TYPES[typeId] || null; }
  function totalCreatures() { return DEX.length; }
  // Nom de la forme courante (evoStage 0/1/2)
  function creatureName(creature, evoStage) {
    if (!creature) return '???';
    var s = Math.max(0, Math.min(2, evoStage || 0));
    return creature.names[s] || creature.names[0];
  }
  // evoStage attendu pour un niveau donné (paliers 5 et 10)
  function evoStageForLevel(level) {
    level = level || 1;
    if (level >= EVO_LEVELS[1]) return 2;
    if (level >= EVO_LEVELS[0]) return 1;
    return 0;
  }
  // Coût XP pour passer de `level` à `level+1`
  function levelUpCost(level) {
    level = level || 1;
    if (level >= MAX_LEVEL) return null; // niveau max
    return 20 + (level - 1) * 10; // 20,30,40,... ,110 (niv9->10)
  }

  window.AIA = window.AIA || {};
  window.AIA.PROMPTMON = {
    DEX: DEX, TYPES: TYPES, EVO_LEVELS: EVO_LEVELS, MAX_LEVEL: MAX_LEVEL,
    getCreature: getCreature, getType: getType, totalCreatures: totalCreatures,
    creatureName: creatureName, evoStageForLevel: evoStageForLevel, levelUpCost: levelUpCost
  };
})();
