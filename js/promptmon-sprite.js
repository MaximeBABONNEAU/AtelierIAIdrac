/* ==============================================
   PROMPTMON-SPRITE.JS — Générateur pixel-art des PromptMon (v2 : 25 ESPÈCES uniques)
   Chaque créature a désormais SA propre silhouette d'espèce (lézard, renard, hibou,
   pieuvre, axolotl, dragon, robot…) : grille 16x16 dédiée + palette de la créature.
   Légende : O=contour B=corps S=ventre/secondaire A=accent E=œil(blanc) P=pupille
             M=bouche W=translucide (ailes/nageoires)
   evoStage ajoute cornes (1) puis grandes cornes + ailes + gemme (2).
   Cosmétiques = overlays. opts.blink ferme les yeux (animation idle).
   IDRAC Business School — [AI-assisted]
   ============================================== */
(function () {
  'use strict';
  var SIZE = 16;

  function darken(hex, f) {
    f = f == null ? 0.7 : f;
    var h = (hex || '#888').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return 'rgb(' + Math.round(r * f) + ',' + Math.round(g * f) + ',' + Math.round(b * f) + ')';
  }

  /* ============ 25 ESPÈCES (16x16) ============ */
  var SPECIES = {
    // 🦎 salamandre/lézard — crête, longue queue
    lizard: [
      '................',
      '.....A...A......',
      '....OBO.OBO.....',
      '...OBBBBBBBO....',
      '..OBEPBBBEPBO...',
      '..OBBBBBBBBBO...',
      '..OBBMMMMBBBO...',
      '...OBBBBBBBO....',
      '..OBSSSSSBBO....',
      '..OBSSSSSBBBOO..',
      '..OBBSSSBBOOBBO.',
      '...OBBBBBO...OBO',
      '....OO.OO.....O.',
      '....OO.OO.......',
      '................',
      '................'
    ],
    // 🐻 ours — oreilles rondes, trapu
    bear: [
      '................',
      '..OBBO....OBBO..',
      '..OBSBO..OBSBO..',
      '...OBBBBBBBBO...',
      '..OBBBBBBBBBBO..',
      '..OBEPBBBBEPBO..',
      '..OBBBBSSBBBBO..',
      '..OBBBSMMSBBBO..',
      '...OBBBSSBBBO...',
      '..OBBSSSSSSBBO..',
      '..OBBSSSSSSBBO..',
      '..OBBBSSSSBBBO..',
      '...OBBBBBBBBO...',
      '...OBB....BBO...',
      '...OO......OO...',
      '................'
    ],
    // 🔥 flammèche-esprit — pointe vacillante
    flameghost: [
      '................',
      '.......A........',
      '......AA........',
      '.....ABBA.......',
      '....ABBBBA......',
      '...OBBBBBBO.....',
      '..OBBBBBBBBO....',
      '..OBEPBBEPBO....',
      '..OBBBBBBBBO....',
      '..OBBMMMBBBO....',
      '..OBSBBBBSBO....',
      '..OBBBBBBBBO....',
      '...OBOBBOBO.....',
      '....O.OO.O......',
      '................',
      '................'
    ],
    // 🐦‍🔥 phénix — huppe, plumes de queue
    phoenix: [
      '................',
      '......A.A.......',
      '.....AOAOA......',
      '....OBBBBBO.....',
      '...OBEPBBBBO....',
      '...OBBBBBAAO....',
      '....OBBBBBO.....',
      '.W.OBBBBBBBO.W..',
      'WW.OBSSSSBBO.WW.',
      'WW.OBSSSSBBO.WW.',
      '.W..OBSSBBO..W..',
      '....OBBBBO.AAA..',
      '.....OBBO.AA....',
      '.....O..O.AAA...',
      '................',
      '................'
    ],
    // 🐱 lynx — oreilles pointues à plumets
    lynx: [
      '................',
      '..A..........A..',
      '..OA........AO..',
      '..OBO......OBO..',
      '..OBBO....OBBO..',
      '..OBBBBBBBBBBO..',
      '..OBEPBBBBEPBO..',
      '..OBBBBSSBBBBO..',
      '...OBBSMMSBBO...',
      '....OBBBBBBO....',
      '...OBBSSSSBBO...',
      '...OBBSSSSBBO...',
      '...OBBBBBBBBO...',
      '...OBB....BBO...',
      '...OO......OO...',
      '................'
    ],
    // 🦎 axolotl — branchies externes
    axolotl: [
      '................',
      '.A...........A..',
      '.AA.........AA..',
      '..AOBBBBBBBOA...',
      '.AOBBBBBBBBBOA..',
      '..OBEPBBBEPBO...',
      '..OBBBBBBBBBO...',
      '..OBBSMMMSBBO...',
      '...OBBSSSBBO....',
      '...OBSSSSSBO....',
      '...OBSSSSSBOO...',
      '...OBBSSSBOBBO..',
      '....OBBBBO.OBO..',
      '....OO..OO..O...',
      '................',
      '................'
    ],
    // 🐡 poisson-globe — piquants tout autour
    pufferfish: [
      '................',
      '....A..A..A.....',
      '......OBBO......',
      '..A.OBBBBBBO.A..',
      '...OBBBBBBBBO...',
      '.A.OBEPBBEPBO.A.',
      '...OBBBBBBBBO...',
      '.A.OBBMMMMBBOA..',
      '...OBSSSSSSBO...',
      '..A.OBSSSSBO.A..',
      '.....OBBBBOWW...',
      '....A..AA..AW...',
      '................',
      '................',
      '................',
      '................'
    ],
    // 🐸 grenouille — yeux globuleux, large bouche
    frog: [
      '................',
      '...OBBO..OBBO...',
      '..OBEPBOOBEPBO..',
      '..OBBBBBBBBBBO..',
      '...OBBBBBBBBO...',
      '..OBBMMMMMMBBO..',
      '..OBBBBBBBBBBO..',
      '...OBSSSSSSBO...',
      '..OBBSSSSSSBBO..',
      '..OBBBSSSSBBBO..',
      '.OBBOBBBBBBOBBO.',
      '.OBO..OBBO..OBO.',
      '..O...O..O...O..',
      '................',
      '................',
      '................'
    ],
    // 🪼 méduse — dôme + tentacules
    jellyfish: [
      '................',
      '.....OBBBBO.....',
      '...OBBBBBBBBO...',
      '..OBBBBBBBBBBO..',
      '..OBEPBBBBEPBO..',
      '..OBBBBMMBBBBO..',
      '..OBSBSBBSBSBO..',
      '...OOOOOOOOOO...',
      '...S.S.S..S.S...',
      '...S.S.S..S.S...',
      '....S.S.S..S....',
      '...S.S..S.S.....',
      '....S...S..S....',
      '................',
      '................',
      '................'
    ],
    // 🐧 pingouin — ventre blanc, ailerons
    penguin: [
      '................',
      '.....OBBBBO.....',
      '....OBBBBBBO....',
      '...OBEPBBEPBO...',
      '...OBBBAABBBO...',
      '...OBSSSSSSBO...',
      '..OBBSSSSSSBBO..',
      '.OBOBSSSSSSBOBO.',
      '.OBOBSSSSSSBOBO.',
      '..OOBSSSSSSBOO..',
      '...OBSSSSSSBO...',
      '....OBBBBBBO....',
      '....OAA..AAO....',
      '................',
      '................',
      '................'
    ],
    // 🐰 lapin — longues oreilles dressées
    rabbit: [
      '................',
      '...OBO....OBO...',
      '..OBSBO..OBSBO..',
      '..OBSBO..OBSBO..',
      '..OBSBO..OBSBO..',
      '...OBBBBBBBBO...',
      '..OBBEPBBEPBBO..',
      '..OBBBBSSBBBBO..',
      '...OBBSMMSBBO...',
      '....OBBBBBBO....',
      '...OBSSSSSSBO...',
      '..OBBSSSSSSBBO..',
      '...OBBBBBBBBO...',
      '....OBO..OBO....',
      '................',
      '................'
    ],
    // 🦔 hérisson — dos de piquants
    hedgehog: [
      '................',
      '..A.A.A.A.A.A...',
      '.AAAAAAAAAAAAA..',
      '..AOBBBBBBBOA...',
      '.AOBBBBBBBBBOA..',
      '..OBEPBBBEPBO...',
      '..OBBBBBBBBBO...',
      '..OBBBSAASBBO...',
      '...OBBSMMSBBO...',
      '...OBSSSSSSBO...',
      '..OBBSSSSSSBBO..',
      '...OBBBBBBBBO...',
      '....OBO..OBO....',
      '................',
      '................',
      '................'
    ],
    // 🍄 champignon — chapeau à pois
    mushroom: [
      '................',
      '.....OOOOOO.....',
      '...OOBBBBBBOO...',
      '..OBBSBBSBBBBO..',
      '..OBBBBBBBSBBO..',
      '..OBSBBBBBBBBO..',
      '...OOOOOOOOOO...',
      '....OSSSSSSO....',
      '...OSEP..EPSO...',
      '...OSS.MM.SSO...',
      '....OSSSSSSO....',
      '.....OSSSSO.....',
      '.....OOOOOO.....',
      '................',
      '................',
      '................'
    ],
    // 🌵 cactus — bras + fleur
    cactus: [
      '................',
      '.......A........',
      '.....OBBBO......',
      '....OBEPBBO.....',
      '.OO.OBBBBBO.OO..',
      'OBBOOBMMBBOOBBO.',
      'OBBBBBBBBBBBBBO.',
      '.OOOBBBBBBBOOO..',
      '....OBSBSBO.....',
      '....OBBSBBO.....',
      '....OBSBSBO.....',
      '....OBBBBBO.....',
      '.....OOOOO......',
      '....OSSSSSO.....',
      '....OOOOOOO.....',
      '................'
    ],
    // 🐍 serpent — lové, langue tirée
    snake: [
      '................',
      '.....OBBBO......',
      '....OBEPBBO.....',
      '....OBBBBBO.....',
      '..A..OBBBO......',
      '...A.OBBO.......',
      '......OBBO......',
      '.......OBBO.....',
      '..OBBBBBBBBBO...',
      '.OBBSSSSSSBBBO..',
      '.OBSSBBBBBSSBO..',
      '.OBBSSSSSSSBBO..',
      '..OBBBBBBBBBO...',
      '...OOOOOOOOO....',
      '................',
      '................'
    ],
    // 🐭 souris — grandes oreilles rondes
    mouse: [
      '................',
      '..OBBBO..OBBBO..',
      '.OBSSSBOOBSSSBO.',
      '.OBSSSBBBBSSSBO.',
      '..OBBBBBBBBBBO..',
      '...OBEPBBEPBO...',
      '...OBBBAABBBO...',
      '....OBSMMSBO....',
      '.....OBBBBO.....',
      '....OBSSSSBO....',
      '...OBBSSSSBBO...',
      '...OBBSSSSBBO...',
      '....OBBBBBO.OO..',
      '.....OO.OO.O....',
      '................',
      '................'
    ],
    // 🤖 robot — antenne, tête carrée
    robot: [
      '................',
      '.......A........',
      '......OAO.......',
      '...OOOOOOOOO....',
      '..OBBBBBBBBBO...',
      '..OBEPBBBEPBO...',
      '..OBBBBBBBBBO...',
      '..OBSMMMMMSBO...',
      '...OOOOOOOOO....',
      '..OBBSSSSSBBO...',
      '.OBOBSASASBOBO..',
      '.OBOBSSSSSBOBO..',
      '..OOBBBBBBBOO...',
      '...OBO...OBO....',
      '...OBO...OBO....',
      '................'
    ],
    // 🦇 chauve-souris — ailes déployées
    bat: [
      '................',
      '..A..........A..',
      '..OA........AO..',
      '..OBO......OBO..',
      '...OBBBBBBBBO...',
      '..OBEPBBBBEPBO..',
      '..OBBBBBBBBBBO..',
      'W.OBBSEESBBBBOW.',
      'WW.OBSBBSBBO.WW.',
      'WWWOBBBBBBOWWW..',
      '.WWWOBBBBOWWW...',
      '..WWOBBBBOWW....',
      '....OB..BO......',
      '................',
      '................',
      '................'
    ],
    // 🐙 pieuvre — tentacules
    octopus: [
      '................',
      '....OBBBBBBO....',
      '..OBBBBBBBBBBO..',
      '..OBBEPBBEPBBO..',
      '..OBBBBBBBBBBO..',
      '..OBBBSMMSBBBO..',
      '..OBBBBBBBBBBO..',
      '...OBOBBBBOBO...',
      '..OBO.OBBO.OBO..',
      '..OB...OB...BO..',
      '.OBO..OBBO..OBO.',
      '.OB..OBO.BO..BO.',
      '..O..OB...O..O..',
      '................',
      '................',
      '................'
    ],
    // 🐝 abeille — rayures, dard, ailes
    bee: [
      '................',
      '...A......A.....',
      '....A....A......',
      '..WWOBBBBOWW....',
      '.WWWOBBBBOWWW...',
      '.WWOBEPBEPBOWW..',
      '..WOBBBBBBOW....',
      '...OBMMMMBO.....',
      '...OSSSSSSO.....',
      '..OAAAAAAAAO....',
      '...OSSSSSSO.....',
      '...OAAAAAAO.....',
      '....OSSSSO......',
      '.....OAAO.......',
      '......OO........',
      '................'
    ],
    // 🦋 papillon — grandes ailes à motifs
    butterfly: [
      '................',
      '.A.....OO.....A.',
      '..A...OEPO...A..',
      '.OBBO.OBBO.OBBO.',
      'OBSSBOOBBOOBSSBO',
      'OBSSSBOBBOBSSSBO',
      'OBSASBOBBOBSASBO',
      '.OBSBOOBBOOBSBO.',
      '..OBO.OBBO.OBO..',
      '.OBBBOOBBOOBBBO.',
      'OBSSSBOBBOBSSSBO',
      '.OBSBO.OO.OBSBO.',
      '..OO........OO..',
      '................',
      '................',
      '................'
    ],
    // 🦉 hibou — grands yeux, aigrettes
    owl: [
      '................',
      '..OBO......OBO..',
      '..OBBO....OBBO..',
      '...OBBBBBBBBO...',
      '..OBBBBBBBBBBO..',
      '..OBEEPBBEEPBO..',
      '..OBEPPBBEPPBO..',
      '..OBBBBAABBBBO..',
      '...OBSBBBBSBO...',
      '..OBBSSBBSSBBO..',
      '..OBSBSSSSBSBO..',
      '..OBBSSSSSSBBO..',
      '...OBBBBBBBBO...',
      '....OAA..AAO....',
      '................',
      '................'
    ],
    // ⭐ étoile de mer — 5 branches
    starfish: [
      '................',
      '.......A........',
      '......OBO.......',
      '......OBO.......',
      '.....OBBBO......',
      '.OOOOBBBBBOOOO..',
      '.OBBBBBBBBBBBO..',
      '..OBBEPBEPBBO...',
      '...OBBMMMBBO....',
      '....OBBBBBO.....',
      '....OBBOBBO.....',
      '...OBBO.OBBO....',
      '...OBO...OBO....',
      '..OBO.....OBO...',
      '..OO.......OO...',
      '................'
    ],
    // 🦊 renard — oreilles pointues, queue touffue
    fox: [
      '................',
      '..OBO......OBO..',
      '..OBBO....OBBO..',
      '..OBSBO..OBSBO..',
      '..OBBBBBBBBBBO..',
      '..OBEPBBBBEPBO..',
      '..OBBBSSSSBBBO..',
      '...OBSSAASSBO...',
      '....OBSMMSBO....',
      '.....OBBBBO.....',
      '....OBSSSSBO....',
      '...OBBSSSSBBOO..',
      '...OBBBBBBBOBAO.',
      '....OBO..OBO.A..',
      '................',
      '................'
    ],
    // 🐲 dragon — cornes, ailes, queue
    dragon: [
      '................',
      '..A..........A..',
      '.AA..........AA.',
      '..OBBBBBBBBBBO..',
      '..OBEPBBBBEPBO..',
      '..OBBBBBBBBBBO..',
      '..OBBSMMMMSBBO..',
      'W..OBBBBBBBBO.W.',
      'WW.OBSSSSSSBOWW.',
      'WWWOBSSSSSSBOWW.',
      '.WWOBSSSSSSBOW..',
      '..OBBBBBBBBBO...',
      '...OBO...OBOO...',
      '...OBO...OBOOBO.',
      '.............O..',
      '................'
    ],
    // 👅 bête-à-langue (boss du formateur, façon Excelangue) — rose, grande langue
    tonguebeast: [
      '................',
      '...OBBBBBBBO....',
      '..OBBBBBBBBBO...',
      '..OBEPBBBEPBO...',
      '..OBBBBBBBBBO...',
      '..OBBMMMMMBBO...',
      '...OBMSSSMBO....',
      '..OBBOSSSOBBO...',
      '.OBOBBSSSBBOBO..',
      '.OBOBBSSSBBOBO..',
      '..OBBBSSSBBBO...',
      '...OBBBSBBBO....',
      '....OO.SS.OO....',
      '.......SSS......',
      '........SS......',
      '................'
    ],
    // 🌟 esprit-constellation — corps étoilé
    starspirit: [
      '................',
      '....A.....A.....',
      '.....OBBBO......',
      '...OBBBBBBBO....',
      '..OBBABBBABBO...',
      '..OBEPBBBEPBO...',
      '..OBBBBBBBBBO...',
      '..OBABSMMSBBO...',
      '..OBBBSSSBABO...',
      '...OBBBBBBBO....',
      '..A.OBBABBO.A...',
      '.....OBBBO......',
      '....OBO.OBO.....',
      '....O.....O.....',
      '................',
      '................'
    ]
  };

  /* ---- Évolutions (overlays additifs, design travaillé par palier) ----
     ÉVO 1 : cornes + épaulières + étincelles latérales.
     ÉVO 2 : grandes cornes + ailes + gemme frontale + double gemmes d'épaule +
             couronne d'étincelles + aura scintillante (EVO2_AURA, dessinée derrière). */
  var EVO1 = [
    '................',
    '...A.........A..',
    '..AA.........AA.',
    '..A...........A.',
    '................',
    '................',
    '.G............G.',
    '.GG..........GG.',
    '..G..........G..',
    '................',
    '................',
    '.A............A.',
    '................',
    '................',
    '................',
    '................'];
  var EVO2_HORNS = [
    '.A.A........A.A.',
    '..AA.........AA.',
    '.AA...........AA',
    '.A.............A',
    'A...............',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '...............A'];
  var EVO2_WINGS = [
    '................',
    '................',
    '................',
    'W..............W',
    'WW............WW',
    'WWW..........WWW',
    '.WWW........WWW.',
    '..WW........WW..',
    '..W..........W..',
    '.W............W.',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................'];
  var EVO2_GEM = [
    '................',
    '................',
    '................',
    '.......G........',
    '......GAG.......',
    '.......G........',
    '................',
    '.Y............Y.',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................'];
  var EVO2_AURA = [
    '....A......A....',
    'A..............A',
    '................',
    '................',
    '................',
    'A..............A',
    '................',
    '................',
    '................',
    '................',
    'A..............A',
    '................',
    '................',
    '..A..........A..',
    '................',
    '................'];

  /* ---- Cosmétiques (overlays, achetables) ---- */
  var COSMETICS = {
    cap:    ['...HHHHHHHH.....', '..HHHHHHHHHH....', '...CCCCCCCC.....', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................'],
    crown:  ['....G.G.G.G.....', '....GGGGGGG.....', '....GYGYGYG.....', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................'],
    halo:   ['.....AAAAAA.....', '....A......A....', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................'],
    shades: ['................', '................', '................', '................', '................', '....KKKK.KKKK...', '....K..K.K..K...', '................', '................', '................', '................', '................', '................', '................', '................', '................'],
    bowtie: ['................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '......RRRR......', '......R..R......', '................', '................', '................', '................'],
    scarf:  ['................', '................', '................', '................', '................', '................', '................', '................', '................', '...CCCCCCCC.....', '....CCCCCCC.....', '................', '................', '................', '................', '................']
  };
  var COSMETIC_SHOP = [
    { id: 'cap', name: 'Casquette', icon: '🧢', cost: 60 },
    { id: 'scarf', name: 'Écharpe', icon: '🧣', cost: 80 },
    { id: 'shades', name: 'Lunettes cool', icon: '🕶️', cost: 100 },
    { id: 'bowtie', name: 'Nœud papillon', icon: '🎀', cost: 120 },
    { id: 'halo', name: 'Halo lumineux', icon: '😇', cost: 200 },
    { id: 'crown', name: 'Couronne royale', icon: '👑', cost: 350 }
  ];

  function drawGrid(ctx, grid, colors, scale, ox, oy) {
    for (var y = 0; y < SIZE; y++) {
      var row = grid[y]; if (!row) continue;
      for (var x = 0; x < SIZE; x++) {
        var ch = row[x];
        if (ch && ch !== '.' && colors[ch]) {
          ctx.fillStyle = colors[ch];
          ctx.fillRect(ox + x * scale, oy + y * scale, scale, scale);
        }
      }
    }
  }

  // Dessine une créature (espèce + palette + évolution + cosmétiques).
  // opts.blink : yeux fermés (animation idle).
  function drawCreature(ctx, creature, evoStage, equipped, scale, ox, oy, opts) {
    if (!creature) return;
    scale = scale || 8; ox = ox || 0; oy = oy || 0; evoStage = evoStage || 0; opts = opts || {};
    equipped = Array.isArray(equipped) ? equipped : [];
    var P = creature.palette || { p: '#888', s: '#ccc', a: '#fd0', o: '#222' };
    var grid = SPECIES[creature.species] || SPECIES.lizard;
    var colors = {
      O: P.o, B: P.p, S: P.s, A: P.a,
      E: opts.blink ? P.p : '#ffffff', P: opts.blink ? P.p : '#171430', M: darken(P.p, 0.45),
      W: 'rgba(255,255,255,0.45)',
      H: darken(P.a, 0.85), C: P.a, G: '#f5b731', Y: '#e74c3c', K: '#171430', R: '#e74c3c'
    };
    if (evoStage >= 2) { drawGrid(ctx, EVO2_AURA, colors, scale, ox, oy); drawGrid(ctx, EVO2_WINGS, colors, scale, ox, oy); }
    drawGrid(ctx, grid, colors, scale, ox, oy);
    if (evoStage >= 1) drawGrid(ctx, EVO1, colors, scale, ox, oy);
    if (evoStage >= 2) { drawGrid(ctx, EVO2_HORNS, colors, scale, ox, oy); drawGrid(ctx, EVO2_GEM, colors, scale, ox, oy); }
    equipped.forEach(function (id) { if (COSMETICS[id]) drawGrid(ctx, COSMETICS[id], colors, scale, ox, oy); });
  }

  function paintToCanvas(canvas, creature, evoStage, equipped, opts) {
    if (!canvas || !canvas.getContext) return;
    opts = opts || {};
    var ctx = canvas.getContext('2d');
    var scale = Math.floor(canvas.width / SIZE);
    var ox = Math.floor((canvas.width - scale * SIZE) / 2);
    var oy = Math.floor((canvas.height - scale * SIZE) / 2) + (opts.oyOffset || 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    if (opts.stage && creature) {
      // Halo de scène : s'intensifie avec l'évolution (évo 2 = double anneau accent)
      var ev = evoStage || 0;
      var g = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, scale, canvas.width / 2, canvas.height / 2, canvas.width / 1.4);
      g.addColorStop(0, hexA(creature.palette.a, 0.18 + ev * 0.12));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (ev >= 2) {
        var g2 = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width / 3.2, canvas.width / 2, canvas.height / 2, canvas.width / 2.1);
        g2.addColorStop(0, 'rgba(0,0,0,0)');
        g2.addColorStop(0.85, hexA(creature.palette.a, 0.22));
        g2.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g2; ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    drawCreature(ctx, creature, evoStage, equipped, scale, ox, oy, opts);
  }

  function hexA(hex, a) {
    var h = (hex || '#fff').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + a + ')';
  }

  window.AIA = window.AIA || {};
  window.AIA.PROMPTMON = window.AIA.PROMPTMON || {};
  window.AIA.PROMPTMON.SPECIES = SPECIES;
  window.AIA.PROMPTMON.drawCreature = drawCreature;
  window.AIA.PROMPTMON.paintToCanvas = paintToCanvas;
  window.AIA.PROMPTMON.COSMETICS = COSMETICS;
  window.AIA.PROMPTMON.COSMETIC_SHOP = COSMETIC_SHOP;
})();
