/* ==============================================
   SPRITES.JS — Pixel Art Avatar Editor
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  var SIZE = 16;
  var SCALE = 12;

  var PALETTES = {
    skin: ['#fce4c0','#f5d0a0','#d4a06a','#b07840','#8b5e3c','#5c3a1e'],
    hair: ['#2c1b0e','#4a3220','#8b6f47','#c9a96e','#e8d5a3','#d44','#e67e22','#9b59b6','#3498db','#1abc9c'],
    eyes: ['#2c3e50','#2980b9','#27ae60','#8b6914','#6c3483','#c0392b'],
    outfit: ['#A71F28','#d4343f','#2c3e50','#1a1a2e','#f5b731','#ecf0f1','#8e44ad','#2ecc71','#e67e22','#3498db'],
    accessory: ['none','#f5b731','#e74c3c','#3498db','#2ecc71','#ecf0f1','#8e44ad']
  };

  /* --- RPG ITEM OVERLAYS --- */
  var ITEM_TEMPLATES = {
    crown: { pixels: [
      '................','....G.GG.G......','....GGGGGG......','....GYYGGG......',
      '................','................','................','................',
      '................','................','................','................',
      '................','................','................','................'
    ], colors: { G: '#f5b731', Y: '#e74c3c' } },
    staff: { pixels: [
      '................','..............R.','..............G.','..............G.',
      '..............G.','..............G.','..............G.','..............G.',
      '..............G.','..............G.','..............G.','..............G.',
      '................','................','................','................'
    ], colors: { G: '#f5b731', R: '#e74c3c' } },
    gold_sword: { pixels: [
      '................','..G.............','..GG............','...GY...........',
      '....GY..........','......GG........','.......RR.......','........R.......',
      '................','................','................','................',
      '................','................','................','................'
    ], colors: { G: '#f5b731', Y: '#ffeaa7', R: '#e74c3c' } },
    sword: { pixels: [
      '................','..W.............','..WW............','...WW...........',
      '....WW..........','......WW........','.......BB.......','........B.......',
      '................','................','................','................',
      '................','................','................','................'
    ], colors: { W: '#bdc3c7', B: '#8b6914' } },
    shield: { pixels: [
      '................','................','................','................',
      '................','................','................','..SSSSS.........',
      '..SBSBS.........',  '..SSSSS.........',  '..SBSBS.........',  '..SSSSS.........',
      '...SSS..........','....S...........','................','................'
    ], colors: { S: '#95a5a6', B: '#2980b9' } },
    cape: { pixels: [
      '................','................','................','................',
      '................','................','................','...CC....CC.....',
      '...CC....CC.....','...CC....CC.....','...CC....CC.....','...CC....CC.....',
      '...CCC..CCC.....','....CCCCCC......','......CC........','................'
    ], colors: { C: '#8e44ad' } },
    wings: { pixels: [
      '................','................','................','................',
      '................','................','................','.WW......WW.....',
      'WW........WW....','W..........W....','................','................',
      '................','................','................','................'
    ], colors: { W: 'rgba(245,183,49,0.55)' } }
  };

  var RANK_ITEMS = { 1: ['gold_sword','crown','wings'], 2: ['sword','shield'], 3: ['shield','cape'], top10: ['cape'] };

  function getItemsForRank(rank, isAdmin) {
    if (isAdmin) return ['crown','staff'];
    if (rank === 1) return RANK_ITEMS[1];
    if (rank === 2) return RANK_ITEMS[2];
    if (rank === 3) return RANK_ITEMS[3];
    if (rank >= 4 && rank <= 10) return RANK_ITEMS.top10;
    return [];
  }

  function renderItemOverlay(ctx, itemName, scale, ox, oy) {
    var item = ITEM_TEMPLATES[itemName];
    if (!item) return;
    for (var y = 0; y < SIZE; y++) {
      var row = item.pixels[y];
      for (var x = 0; x < SIZE; x++) {
        var ch = row[x];
        if (ch !== '.' && item.colors[ch]) {
          ctx.fillStyle = item.colors[ch];
          ctx.fillRect(ox + x * scale, oy + y * scale, scale, scale);
        }
      }
    }
  }

  var TEMPLATES = {
    body: [
      '................',
      '................',
      '......SSSS......',
      '.....SSSSSS.....',
      '.....SEESSE.....',
      '.....SSMMSS.....',
      '......SSSS......',
      '.....OOOOOO.....',
      '....OOOOOOOO....',
      '....OOOOOOOO....',
      '....OO....OO....',
      '....OO....OO....',
      '................',
      '....LL....LL....',
      '....LL....LL....',
      '....LL....LL....'
    ],
    hair_short: [
      '................',
      '.....HHHHHH.....',
      '....HHHHHHHH....',
      '....HH....HH....',
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
      '................',
      '................'
    ],
    hair_long: [
      '................',
      '.....HHHHHH.....',
      '....HHHHHHHH....',
      '....HH....HH....',
      '....H......H....',
      '....H......H....',
      '....H......H....',
      '....HH....HH....',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................'
    ],
    hair_spiky: [
      '....H..HH..H....',
      '...HHHHHHHHHH...',
      '....HHHHHHHH....',
      '....HH....HH....',
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
      '................',
      '................'
    ],
    hair_curly: [
      '.....HH..HH.....',
      '....HHHHHHHH....',
      '...HHHHHHHHHH...',
      '...HHH....HHH..',
      '...HH......HH..',
      '...HH......HH..',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................'
    ],
    hat: [
      '...AAAAAAAAAA...',
      '....AAAAAAAA....',
      '.....AAAAAA.....',
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
      '................',
      '................',
      '................'
    ],
    glasses: [
      '................',
      '................',
      '................',
      '................',
      '...AAAA.AAAA....',
      '...A..A.A..A....',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................'
    ],
    headband: [
      '................',
      '................',
      '...AAAAAAAAAA...',
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
      '................',
      '................',
      '................'
    ]
  };

  var HAIR_STYLES = ['none','hair_short','hair_long','hair_spiky','hair_curly'];
  var HAIR_LABELS = ['Chauve','Court','Long','Spike','Boucle'];
  var ACCESSORY_TYPES = ['none','hat','glasses','headband'];
  var ACCESSORY_LABELS = ['Aucun','Chapeau','Lunettes','Bandeau'];

  var current = {
    skin: 0, hair: 0, hairStyle: 1, eyes: 0, outfit: 0, accessory: 0, accessoryType: 0
  };

  function renderSprite(ctx, cfg, scale, ox, oy) {
    ox = ox || 0; oy = oy || 0;
    var skinC = PALETTES.skin[cfg.skin] || PALETTES.skin[0];
    var eyeC = PALETTES.eyes[cfg.eyes] || PALETTES.eyes[0];
    var outfitC = PALETTES.outfit[cfg.outfit] || PALETTES.outfit[0];
    var mouthC = '#c0392b';
    var legC = '#34495e';
    var body = TEMPLATES.body;

    for (var y = 0; y < SIZE; y++) {
      var row = body[y];
      for (var x = 0; x < SIZE; x++) {
        var ch = row[x];
        var c = null;
        if (ch === 'S') c = skinC;
        else if (ch === 'E') c = eyeC;
        else if (ch === 'M') c = mouthC;
        else if (ch === 'O') c = outfitC;
        else if (ch === 'L') c = legC;
        if (c) {
          ctx.fillStyle = c;
          ctx.fillRect(ox + x * scale, oy + y * scale, scale, scale);
        }
      }
    }

    var hs = HAIR_STYLES[cfg.hairStyle];
    if (hs && hs !== 'none' && TEMPLATES[hs]) {
      var hairC = PALETTES.hair[cfg.hair] || PALETTES.hair[0];
      var tmpl = TEMPLATES[hs];
      for (var y2 = 0; y2 < SIZE; y2++) {
        var row2 = tmpl[y2];
        for (var x2 = 0; x2 < SIZE; x2++) {
          if (row2[x2] === 'H') {
            ctx.fillStyle = hairC;
            ctx.fillRect(ox + x2 * scale, oy + y2 * scale, scale, scale);
          }
        }
      }
    }

    var at = ACCESSORY_TYPES[cfg.accessoryType];
    if (at && at !== 'none' && TEMPLATES[at]) {
      var accIdx = cfg.accessory;
      if (accIdx === 0) return;
      var accC = PALETTES.accessory[accIdx];
      if (!accC || accC === 'none') return;
      var tmplA = TEMPLATES[at];
      for (var y3 = 0; y3 < SIZE; y3++) {
        var row3 = tmplA[y3];
        for (var x3 = 0; x3 < SIZE; x3++) {
          if (row3[x3] === 'A') {
            ctx.fillStyle = accC;
            ctx.fillRect(ox + x3 * scale, oy + y3 * scale, scale, scale);
          }
        }
      }
    }
  }

  function buildSwatches(palName, selectedIdx, onChange) {
    var pal = PALETTES[palName];
    var wrap = document.createElement('div');
    wrap.className = 'sprite-swatches';
    for (var i = 0; i < pal.length; i++) {
      (function (idx) {
        var sw = document.createElement('div');
        sw.className = 'sprite-swatch' + (idx === selectedIdx ? ' active' : '');
        if (pal[idx] === 'none') {
          sw.style.background = 'repeating-conic-gradient(#555 0% 25%, #333 0% 50%) 50%/12px 12px';
        } else {
          sw.style.background = pal[idx];
        }
        sw.addEventListener('click', function () { onChange(idx); });
        wrap.appendChild(sw);
      })(i);
    }
    return wrap;
  }

  function buildOptionRow(labels, selectedIdx, onChange) {
    var wrap = document.createElement('div');
    wrap.className = 'sprite-options';
    for (var i = 0; i < labels.length; i++) {
      (function (idx) {
        var btn = document.createElement('button');
        btn.className = 'sprite-option-btn' + (idx === selectedIdx ? ' active' : '');
        btn.textContent = labels[idx];
        btn.addEventListener('click', function () { onChange(idx); });
        wrap.appendChild(btn);
      })(i);
    }
    return wrap;
  }

  function initSpriteEditor() {
    var root = document.getElementById('sprite-editor-root');
    if (!root) return;

    var AIA = window.AIA;
    var st = AIA.getState();
    if (st.avatar) {
      current.skin = st.avatar.skin || 0;
      current.hair = st.avatar.hair || 0;
      current.hairStyle = st.avatar.hairStyle || 1;
      current.eyes = st.avatar.eyes || 0;
      current.outfit = st.avatar.outfit || 0;
      current.accessory = st.avatar.accessory || 0;
      current.accessoryType = st.avatar.accessoryType || 0;
    }

    root.innerHTML = '';
    var container = document.createElement('div');
    container.className = 'sprite-editor';

    var previewWrap = document.createElement('div');
    previewWrap.className = 'sprite-preview-wrap';
    var canvas = document.createElement('canvas');
    canvas.width = SIZE * SCALE;
    canvas.height = SIZE * SCALE;
    canvas.className = 'sprite-canvas';
    canvas.id = 'sprite-main-canvas';
    previewWrap.appendChild(canvas);

    var nameTag = document.createElement('div');
    nameTag.className = 'sprite-name-tag';
    nameTag.textContent = st.user || 'Etudiant';
    previewWrap.appendChild(nameTag);
    container.appendChild(previewWrap);

    var controls = document.createElement('div');
    controls.className = 'sprite-controls';

    function refresh() {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderSprite(ctx, current, SCALE, 0, 0);
    }

    function addSection(title, content) {
      var sec = document.createElement('div');
      sec.className = 'sprite-section';
      var h = document.createElement('div');
      h.className = 'sprite-section-title';
      h.textContent = title;
      sec.appendChild(h);
      sec.appendChild(content);
      controls.appendChild(sec);
    }

    function rebuild() {
      controls.innerHTML = '';

      addSection('Peau', buildSwatches('skin', current.skin, function (i) {
        current.skin = i; rebuild(); refresh();
      }));

      addSection('Coiffure', buildOptionRow(HAIR_LABELS, current.hairStyle, function (i) {
        current.hairStyle = i; rebuild(); refresh();
      }));

      if (current.hairStyle > 0) {
        addSection('Couleur cheveux', buildSwatches('hair', current.hair, function (i) {
          current.hair = i; rebuild(); refresh();
        }));
      }

      addSection('Yeux', buildSwatches('eyes', current.eyes, function (i) {
        current.eyes = i; rebuild(); refresh();
      }));

      addSection('Tenue', buildSwatches('outfit', current.outfit, function (i) {
        current.outfit = i; rebuild(); refresh();
      }));

      addSection('Accessoire', buildOptionRow(ACCESSORY_LABELS, current.accessoryType, function (i) {
        current.accessoryType = i; rebuild(); refresh();
      }));

      if (current.accessoryType > 0) {
        addSection('Couleur accessoire', buildSwatches('accessory', current.accessory, function (i) {
          current.accessory = i; rebuild(); refresh();
        }));
      }

      var saveBtn = document.createElement('button');
      saveBtn.className = 'btn-primary';
      saveBtn.style.marginTop = '1rem';
      saveBtn.style.width = '100%';
      saveBtn.textContent = 'Sauvegarder mon avatar';
      saveBtn.addEventListener('click', function () {
        var s = AIA.getState();
        var isFirst = !s.avatar;
        s.avatar = {
          skin: current.skin, hair: current.hair, hairStyle: current.hairStyle,
          eyes: current.eyes, outfit: current.outfit,
          accessory: current.accessory, accessoryType: current.accessoryType
        };
        AIA.saveState();
        if (isFirst) AIA.awardBadge('avatar-custom');
        AIA.showToast('Avatar sauvegarde !', 'success');
      });
      controls.appendChild(saveBtn);

      var randomBtn = document.createElement('button');
      randomBtn.className = 'btn-outline';
      randomBtn.style.marginTop = '0.5rem';
      randomBtn.style.width = '100%';
      randomBtn.textContent = 'Aleatoire';
      randomBtn.addEventListener('click', function () {
        current.skin = Math.floor(Math.random() * PALETTES.skin.length);
        current.hair = Math.floor(Math.random() * PALETTES.hair.length);
        current.hairStyle = Math.floor(Math.random() * HAIR_STYLES.length);
        current.eyes = Math.floor(Math.random() * PALETTES.eyes.length);
        current.outfit = Math.floor(Math.random() * PALETTES.outfit.length);
        current.accessoryType = Math.floor(Math.random() * ACCESSORY_TYPES.length);
        current.accessory = current.accessoryType > 0 ? 1 + Math.floor(Math.random() * (PALETTES.accessory.length - 1)) : 0;
        rebuild(); refresh();
      });
      controls.appendChild(randomBtn);
    }

    container.appendChild(controls);
    root.appendChild(container);
    rebuild();
    refresh();
  }

  function getDefaultAvatar() {
    return { skin: 0, hair: 0, hairStyle: 1, eyes: 0, outfit: 0, accessory: 0, accessoryType: 0 };
  }

  window.AIA = window.AIA || {};
  window.AIA.initSpriteEditor = initSpriteEditor;
  window.AIA.renderMiniSprite = renderSprite;
  window.AIA.renderItemOverlay = renderItemOverlay;
  window.AIA.getItemsForRank = getItemsForRank;
  window.AIA.getDefaultAvatar = getDefaultAvatar;
  window.AIA.SPRITE_SIZE = SIZE;
  window.AIA.RANK_ITEMS = RANK_ITEMS;
  window.AIA.ITEM_TEMPLATES = ITEM_TEMPLATES;
})();
