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
    { id: 1, type: 'pyro', names: ['Braizou', 'Flammiraptor', 'Infernaxis'],
      palette: pal('#e8503a', '#ffb347', '#ffe66d'), recipe: { body: 0, ears: 1, eyes: 0, belly: 1, tail: 1 },
      lore: 'Une braise vivante qui s’enflamme quand un prompt l’inspire.', signature: 'Affinité : logos chauds & marques énergiques.' },
    { id: 2, type: 'pyro', names: ['Tisorel', 'Brasieur', 'Vulcanor'],
      palette: pal('#d6402e', '#ff7a45', '#ffd24d'), recipe: { body: 2, ears: 2, eyes: 1, belly: 0, tail: 2 },
      lore: 'Forgeron miniature, il martèle des idées au feu.', signature: 'Bonus de créativité sur les visuels industriels.' },
    { id: 3, type: 'pyro', names: ['Pyttle', 'Ignivore', 'Solficus'],
      palette: pal('#ff6b3d', '#ffae63', '#fff1a8'), recipe: { body: 1, ears: 0, eyes: 2, belly: 2, tail: 0 },
      lore: 'Petite flammèche gourmande de couleurs vives.', signature: 'Excelle dans les palettes saturées.' },
    { id: 4, type: 'pyro', names: ['Charbi', 'Embrasor', 'Cendraxia'],
      palette: pal('#c0392b', '#e8703a', '#f5b731'), recipe: { body: 3, ears: 3, eyes: 0, belly: 1, tail: 3 },
      lore: 'Né d’un charbon, il renaît plus fort de ses cendres.', signature: 'Résilience : meilleure remontée après défaite.' },
    { id: 5, type: 'pyro', names: ['Flamûle', 'Pyrolynx', 'Magmadon'],
      palette: pal('#e74c3c', '#ff9248', '#ffe066'), recipe: { body: 4, ears: 4, eyes: 1, belly: 3, tail: 1 },
      lore: 'Félin de magma, rapide comme une étincelle.', signature: 'Affinité : mascottes dynamiques.' },

    // ---------- AQUA (Eau) ----------
    { id: 6, type: 'aqua', names: ['Gouttiz', 'Ondulor', 'Tsunamira'],
      palette: pal('#3aa0e8', '#9be3ff', '#e0f7ff'), recipe: { body: 1, ears: 0, eyes: 0, belly: 2, tail: 2 },
      lore: 'Une goutte curieuse qui reflète tout ce qu’elle voit.', signature: 'Affinité : interfaces fluides & apaisantes.' },
    { id: 7, type: 'aqua', names: ['Bullin', 'Aquariel', 'Abyssodon'],
      palette: pal('#2d7fc4', '#6fc6ff', '#cdeeff'), recipe: { body: 0, ears: 1, eyes: 2, belly: 1, tail: 1 },
      lore: 'Bulle des profondeurs, calme mais insondable.', signature: 'Bonus sur les ambiances nocturnes.' },
    { id: 8, type: 'aqua', names: ['Flaquo', 'Ruisselin', 'Cascadrak'],
      palette: pal('#2bb5d9', '#7fe0ef', '#dafaff'), recipe: { body: 2, ears: 2, eyes: 1, belly: 0, tail: 3 },
      lore: 'Petit torrent espiègle, jamais immobile.', signature: 'Vitesse : combats résolus plus vite.' },
    { id: 9, type: 'aqua', names: ['Méduzi', 'Coralisk', 'Nautilux'],
      palette: pal('#4aa8d8', '#a6e6ff', '#eafaff'), recipe: { body: 4, ears: 0, eyes: 0, belly: 3, tail: 0 },
      lore: 'Créature corallienne lumineuse des récifs.', signature: 'Affinité : visuels organiques & motifs.' },
    { id: 10, type: 'aqua', names: ['Givrette', 'Banquor', 'Cryotitan'],
      palette: pal('#7ec8e8', '#c9f0ff', '#ffffff'), recipe: { body: 3, ears: 3, eyes: 2, belly: 1, tail: 2 },
      lore: 'Esprit de banquise, glacial et majestueux.', signature: 'Affinité : design minimaliste & froid.' },

    // ---------- FLORA (Nature) ----------
    { id: 11, type: 'flora', names: ['Boutonet', 'Fougaïa', 'Sylvanthe'],
      palette: pal('#4caf50', '#a5d66a', '#ffe66d'), recipe: { body: 0, ears: 4, eyes: 0, belly: 2, tail: 0 },
      lore: 'Un bourgeon qui éclot au rythme de tes idées.', signature: 'Affinité : marques éco & naturelles.' },
    { id: 12, type: 'flora', names: ['Glandou', 'Liéronce', 'Chênodryade'],
      palette: pal('#3e9142', '#8cc663', '#d4a843'), recipe: { body: 3, ears: 3, eyes: 1, belly: 1, tail: 3 },
      lore: 'Petit gland tenace devenu gardien des forêts.', signature: 'Résilience : encaisse mieux les revers.' },
    { id: 13, type: 'flora', names: ['Sporelle', 'Mycélio', 'Champsuzerain'],
      palette: pal('#6aa84f', '#bcd99a', '#e86a8e'), recipe: { body: 1, ears: 0, eyes: 2, belly: 3, tail: 0 },
      lore: 'Champignon facétieux relié à tout le réseau racinaire.', signature: 'Affinité : motifs répétitifs & patterns.' },
    { id: 14, type: 'flora', names: ['Cactin', 'Épinor', 'Saguaron'],
      palette: pal('#57a05a', '#9ed46f', '#f2c14e'), recipe: { body: 2, ears: 2, eyes: 0, belly: 0, tail: 1 },
      lore: 'Cactus du désert, piquant mais fidèle.', signature: 'Affinité : styles bold & contrastés.' },
    { id: 15, type: 'flora', names: ['Lianou', 'Vrillette', 'Kudzilla'],
      palette: pal('#46a047', '#8fcf6a', '#ffe066'), recipe: { body: 4, ears: 1, eyes: 1, belly: 2, tail: 2 },
      lore: 'Liane vive qui grimpe vers la lumière.', signature: 'Croissance rapide : XP créature optimisé.' },

    // ---------- VOLT (Data / Électrique) ----------
    { id: 16, type: 'volt', names: ['Bitsy', 'Voltracé', 'Datastryx'],
      palette: pal('#7c5cff', '#b39cff', '#ffe066'), recipe: { body: 1, ears: 1, eyes: 2, belly: 1, tail: 2 },
      lore: 'Un bit espiègle qui danse dans les circuits.', signature: 'Affinité : UI tech & dashboards.' },
    { id: 17, type: 'volt', names: ['Pixou', 'Glitchar', 'Mégabyton'],
      palette: pal('#6a47e0', '#a78bff', '#3ad6c8'), recipe: { body: 0, ears: 0, eyes: 0, belly: 3, tail: 0 },
      lore: 'Pixel rebelle qui adore le glitch art.', signature: 'Affinité : esthétiques cyber & glitch.' },
    { id: 18, type: 'volt', names: ['Étincel', 'Fulguron', 'Tonnerax'],
      palette: pal('#8e6bff', '#c0aaff', '#ffd84d'), recipe: { body: 4, ears: 4, eyes: 1, belly: 2, tail: 1 },
      lore: 'Petite étincelle qui rêve d’orages.', signature: 'Affinité : visuels à fort contraste.' },
    { id: 19, type: 'volt', names: ['Cabolt', 'Circuial', 'Réseaurus'],
      palette: pal('#5d52d6', '#9a8cf0', '#43e0a0'), recipe: { body: 2, ears: 2, eyes: 2, belly: 0, tail: 3 },
      lore: 'Né d’un câble, il relie toutes les idées.', signature: 'Affinité : schémas & infographies.' },
    { id: 20, type: 'volt', names: ['Watto', 'Ampèros', 'Dynastryke'],
      palette: pal('#7b5bf0', '#b6a3ff', '#ffe066'), recipe: { body: 3, ears: 3, eyes: 0, belly: 1, tail: 2 },
      lore: 'Boule d’énergie qui ne dort jamais.', signature: 'Endurance : plus de combats par jour.' },

    // ---------- LUMEN (Lumière / IA) ----------
    { id: 21, type: 'lumen', names: ['Lumini', 'Éclaïon', 'Prismatra'],
      palette: pal('#f5c542', '#fff3c4', '#ffffff'), recipe: { body: 0, ears: 1, eyes: 0, belly: 2, tail: 0 },
      lore: 'Un éclat de lumière né d’une bonne idée.', signature: 'Affinité : marques premium & lumineuses.' },
    { id: 22, type: 'lumen', names: ['Halone', 'Auréor', 'Solsage'],
      palette: pal('#f0b429', '#ffe08a', '#fffbe6'), recipe: { body: 3, ears: 3, eyes: 1, belly: 1, tail: 1 },
      lore: 'Sage auréolé qui éclaire les chemins créatifs.', signature: 'Sagesse : meilleurs conseils de prompt.' },
    { id: 23, type: 'lumen', names: ['Brilou', 'Lustria', 'Astralux'],
      palette: pal('#ffd24d', '#fff0b0', '#9be3ff'), recipe: { body: 1, ears: 0, eyes: 2, belly: 3, tail: 2 },
      lore: 'Petite étoile filante toujours pressée de briller.', signature: 'Affinité : effets scintillants & glow.' },
    { id: 24, type: 'lumen', names: ['Néonet', 'Hologram', 'Spectraxis'],
      palette: pal('#f5c542', '#ffe89a', '#e86a8e'), recipe: { body: 2, ears: 2, eyes: 0, belly: 0, tail: 3 },
      lore: 'Lueur néon qui projette des hologrammes.', signature: 'Affinité : esthétiques néon & futuristes.' },
    { id: 25, type: 'lumen', names: ['Étoilin', 'Constella', 'Galaxianthe'],
      palette: pal('#ffcf4d', '#fff1bf', '#b39cff'), recipe: { body: 4, ears: 4, eyes: 1, belly: 2, tail: 1 },
      lore: 'Né d’une constellation, il porte un ciel en lui.', signature: 'Affinité : compositions cosmiques.' }
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
