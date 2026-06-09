/* ==============================================
   PROMPTMON.JS — Écran du méta-jeu "PokePrompt" (Phase 1)
   - Attribue à chaque étudiant 1 des 25 créatures (roster partagé, réparti).
   - Profil créature : sprite (forme courante), type, niveau, jauge, lore.
   - Entraîner (dépense XP dispo -> +1 niveau), Évoluer aux paliers (niv. 5 et 10),
     boutique de cosmétiques (payée en XP), vue "Classe / Pokédex".
   Monnaie = porte-monnaie XP existant (getAvailableXP = xp.total - xpSpent ; dépense via xpSpent).
   IDRAC Business School — [AI-assisted]
   ============================================== */
(function () {
  'use strict';

  var _classListener = null;

  function esc(t) { var d = document.createElement('div'); d.textContent = (t == null ? '' : String(t)); return d.innerHTML; }
  function PM() { return window.AIA.PROMPTMON; }

  function ensureStyles() {
    if (document.getElementById('pm-styles')) return;
    var s = document.createElement('style');
    s.id = 'pm-styles';
    s.textContent = [
      '.pm-stage{position:relative;display:flex;align-items:center;justify-content:center;border-radius:18px;background:radial-gradient(circle at 50% 45%,rgba(255,255,255,0.06),rgba(0,0,0,0.25));border:1px solid var(--border-glass);overflow:hidden}',
      '.pm-stage canvas{image-rendering:pixelated;image-rendering:crisp-edges}',
      '.pm-reveal{animation:pmReveal .9s cubic-bezier(.2,.8,.2,1)}',
      '@keyframes pmReveal{0%{transform:scale(.2) rotate(-12deg);opacity:0;filter:brightness(3)}60%{transform:scale(1.12);opacity:1;filter:brightness(1.6)}100%{transform:scale(1);filter:brightness(1)}}',
      '.pm-evolve{animation:pmEvolve 1.1s ease}',
      '@keyframes pmEvolve{0%{filter:brightness(1)}30%{filter:brightness(3) saturate(2)}55%{filter:brightness(5)}100%{filter:brightness(1)}}',
      '.pm-bar{height:12px;border-radius:8px;background:rgba(255,255,255,.08);overflow:hidden;border:1px solid var(--border-glass)}',
      '.pm-bar>i{display:block;height:100%;background:linear-gradient(90deg,#f5b731,#ffd86b);transition:width .5s ease}',
      '.pm-chip{display:inline-flex;align-items:center;gap:.3rem;font-size:.72rem;font-weight:700;padding:.12rem .5rem;border-radius:999px;border:1px solid var(--border-glass)}',
      '.pm-card{transition:border-color .2s ease,box-shadow .2s ease,transform .2s ease}',
      '.pm-card:hover{border-color:rgba(245,183,49,.5);box-shadow:0 6px 22px rgba(0,0,0,.25)}',
      '.pm-dex{display:grid;grid-template-columns:repeat(auto-fill,minmax(108px,1fr));gap:.6rem}',
      '.pm-dex .pm-card{cursor:default;text-align:center;padding:.5rem .3rem}',
      '.pm-tab{cursor:pointer;padding:.4rem .9rem;border-radius:10px;font-weight:700;font-size:.85rem;border:1px solid var(--border-glass);color:var(--text-muted)}',
      '.pm-tab.active{background:rgba(245,183,49,.16);color:#fff;border-color:rgba(245,183,49,.5)}'
    ].join('');
    document.head.appendChild(s);
  }

  function getPM() {
    var st = window.AIA.getState();
    if (!st.promptmon || typeof st.promptmon !== 'object') {
      st.promptmon = { creatureId: null, level: 1, cxp: 0, evoStage: 0, cosmetics: [], equipped: [], assignedAt: 0 };
    }
    var p = st.promptmon;
    if (!Array.isArray(p.cosmetics)) p.cosmetics = [];
    if (!Array.isArray(p.equipped)) p.equipped = [];
    if (typeof p.level !== 'number' || p.level < 1) p.level = 1;
    if (typeof p.evoStage !== 'number') p.evoStage = 0;
    // garde-fou : evoStage ne peut pas dépasser le palier autorisé par le niveau
    var pm = window.AIA.PROMPTMON;
    if (pm && pm.evoStageForLevel) { var maxEvo = pm.evoStageForLevel(p.level); if (p.evoStage > maxEvo) p.evoStage = maxEvo; }
    return p;
  }
  function save() { var A = window.AIA; if (A.saveState) A.saveState(); }

  function hashKey(k) { var h = 0; k = String(k || ''); for (var i = 0; i < k.length; i++) { h = (h * 31 + k.charCodeAt(i)) >>> 0; } return h; }

  // Attribue une créature (roster partagé, créature la moins prise ; repli hash hors-ligne).
  function assignCreature(done) {
    var A = window.AIA, st = A.getState(), p = getPM();
    if (p.creatureId) { done(p.creatureId, false); return; }
    var meKey = st.user && st.user.accountKey;
    var total = PM().totalCreatures();
    function finalize(id, isNew) {
      p.creatureId = id; p.level = 1; p.cxp = 0; p.evoStage = 0;
      if (!p.assignedAt) p.assignedAt = 1;
      save(); done(id, isNew);
    }
    if (!A.db || !meKey) { finalize((hashKey(meKey) % total) + 1, true); return; }
    A.db.ref('promptmon/roster').once('value', function (snap) {
      var roster = snap.val() || {};
      if (roster[meKey]) { finalize(roster[meKey], false); return; }
      var counts = {}; for (var i = 1; i <= total; i++) counts[i] = 0;
      Object.keys(roster).forEach(function (k) { var c = roster[k]; if (counts[c] != null) counts[c]++; });
      var best = 1, bestC = Infinity;
      for (var id = 1; id <= total; id++) { if (counts[id] < bestC) { bestC = counts[id]; best = id; } }
      A.db.ref('promptmon/roster/' + meKey).transaction(function (cur) { return cur || best; }, function (err, committed, s2) {
        var assigned = (s2 && s2.val()) || best;
        finalize(assigned, true);
      });
    }, function () { finalize((hashKey(meKey) % total) + 1, true); });
  }

  /* ===================== RENDER ===================== */
  function renderPromptmon(main) {
    ensureStyles();
    main = main || document.getElementById('main-content');
    var A = window.AIA, st = A.getState();
    if (st.user && st.user.isAdmin && !st.user.accountKey) {
      // Formateur : accès direct au panneau juge de l'Arena
      main.innerHTML = headerHtml() + '<div id="pm-tabbody"></div>';
      if (A.PROMPTMON_ARENA) A.PROMPTMON_ARENA.renderArena(document.getElementById('pm-tabbody'));
      return;
    }
    if (!st.user || !st.user.accountKey) {
      main.innerHTML = headerHtml() + '<div class="glass-card" style="text-align:center;padding:2rem">Connecte-toi pour rencontrer ta créature PromptMon.</div>';
      return;
    }
    var p = getPM();
    if (!p.creatureId) {
      main.innerHTML = headerHtml() + '<div class="glass-card" style="text-align:center;padding:2rem"><div class="loading-pulse">✨ Ta créature se réveille…</div></div>';
      assignCreature(function () { renderProfile(main, true); });
      return;
    }
    renderProfile(main, false);
  }

  function headerHtml() {
    return '<div class="page-header"><h1>Prompt<span class="gradient-text">Mon</span></h1>' +
      '<p class="page-subtitle">Ta créature évolue avec ton XP — entraîne-la, fais-la évoluer, personnalise-la</p></div>';
  }

  function walletHtml() {
    var st = window.AIA.getState();
    var total = (st.xp && st.xp.total) || 0, spent = st.xpSpent || 0, avail = window.AIA.getAvailableXP ? window.AIA.getAvailableXP() : Math.max(0, total - spent);
    return '<div class="shop-wallet glass-card"><div class="wallet-row">' +
      '<div class="wallet-stat"><div class="wn">' + total + '</div><div class="wl">XP total</div></div>' +
      '<div class="wallet-stat"><div class="wn">' + spent + '</div><div class="wl">XP dépensés</div></div>' +
      '<div class="wallet-stat primary"><div class="wn">' + avail + '</div><div class="wl">XP disponibles 💰</div></div>' +
      '</div></div>';
  }

  function renderProfile(main, justAssigned) {
    var A = window.AIA, p = getPM();
    var pm = PM();
    var creature = pm.getCreature(p.creatureId);
    if (!creature) { main.innerHTML = headerHtml() + '<div class="glass-card">Créature introuvable.</div>'; return; }
    var type = pm.getType(creature.type);
    var name = pm.creatureName(creature, p.evoStage);
    var cost = pm.levelUpCost(p.level);
    var avail = A.getAvailableXP ? A.getAvailableXP() : 0;
    var canEvolve = pm.evoStageForLevel(p.level) > p.evoStage;
    var atMax = p.level >= pm.MAX_LEVEL;
    var nextEvoLevel = p.evoStage === 0 ? pm.EVO_LEVELS[0] : (p.evoStage === 1 ? pm.EVO_LEVELS[1] : null);
    var nextEvoName = p.evoStage < 2 ? creature.names[p.evoStage + 1] : null;
    var levelPct = Math.round((p.level / pm.MAX_LEVEL) * 100);

    main.innerHTML = headerHtml() + walletHtml() +
      '<div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:stretch">' +
        // --- showcase ---
        '<div class="glass-card pm-card" style="flex:1 1 320px;min-width:280px;display:flex;flex-direction:column;align-items:center;gap:.6rem;padding:1rem">' +
          '<div class="pm-stage" style="width:240px;height:240px"><canvas id="pm-canvas" width="240" height="240" role="img" aria-label="' + esc(name) + ', créature ' + esc(type ? type.tag : '') + '"></canvas></div>' +
          '<div style="text-align:center">' +
            '<div style="font-size:1.4rem;font-weight:800">' + esc(name) + '</div>' +
            '<div style="margin:.25rem 0"><span class="pm-chip" style="background:' + (type ? hexA(type.color, .18) : 'rgba(255,255,255,.1)') + ';color:#fff">' + (type ? type.emoji + ' ' + type.tag : '') + '</span> ' +
            '<span class="pm-chip" style="background:rgba(245,183,49,.16)">⭐ Niveau ' + p.level + '/' + pm.MAX_LEVEL + '</span></div>' +
            '<div style="font-size:.82rem;color:var(--text-muted);max-width:280px;margin:.3rem auto 0">' + esc(creature.lore) + '</div>' +
          '</div>' +
        '</div>' +
        // --- actions ---
        '<div class="glass-card pm-card" style="flex:1 1 320px;min-width:280px;padding:1rem;display:flex;flex-direction:column;gap:.8rem">' +
          '<div><div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:.25rem"><span>Niveau ' + p.level + '</span><span style="color:var(--text-muted)">' + (atMax ? 'MAX' : 'palier évo : niv. ' + nextEvoLevel) + '</span></div>' +
            '<div class="pm-bar"><i style="width:' + levelPct + '%"></i></div></div>' +

          (canEvolve
            ? '<button class="btn-primary" id="pm-evolve" style="width:100%;font-size:1rem">✨ Faire évoluer en ' + esc(nextEvoName) + ' !</button>'
            : (atMax
                ? '<div class="pm-chip" style="justify-content:center;padding:.5rem;background:rgba(46,204,113,.18)">🏆 Niveau maximum atteint</div>'
                : '<button class="btn-primary" id="pm-train" style="width:100%' + (avail < cost ? ';opacity:.55' : '') + '"' + (avail < cost ? ' disabled' : '') + '>💪 Entraîner — ' + cost + ' XP ' + (avail < cost ? '(il manque ' + (cost - avail) + ')' : '') + '</button>')) +

          '<div style="font-size:.78rem;color:var(--text-muted)">' +
            (nextEvoName && p.evoStage < 2 ? '🔒 Prochaine évolution : <strong>' + esc(nextEvoName) + '</strong> au niveau ' + nextEvoLevel + '.' : '🌟 Forme finale atteinte.') +
            '<br>' + esc(creature.signature) +
          '</div>' +

          '<div id="pm-msg" style="font-size:.82rem;min-height:1em"></div>' +
        '</div>' +
      '</div>' +

      // --- tabs : combats / cosmetics / class ---
      '<div style="display:flex;gap:.5rem;margin:1.2rem 0 .8rem;flex-wrap:wrap"><span class="pm-tab active" data-tab="arena">⚔️ Combats</span><span class="pm-tab" data-tab="cos">🎨 Cosmétiques</span><span class="pm-tab" data-tab="dex">👥 Classe</span></div>' +
      '<div id="pm-tabbody"></div>';

    // paint sprite
    paint(justAssigned ? 'pm-reveal' : '');

    // wire train / evolve
    var trainBtn = document.getElementById('pm-train');
    if (trainBtn) trainBtn.addEventListener('click', function () { doTrain(main); });
    var evolveBtn = document.getElementById('pm-evolve');
    if (evolveBtn) evolveBtn.addEventListener('click', function () { doEvolve(main); });

    // tabs
    var tabbody = document.getElementById('pm-tabbody');
    function openTab(name) {
      if (name === 'arena' && A.PROMPTMON_ARENA) A.PROMPTMON_ARENA.renderArena(tabbody);
      else if (name === 'dex') renderClass(tabbody);
      else renderCosmetics(tabbody);
    }
    openTab(A.PROMPTMON_ARENA ? 'arena' : 'cos');
    main.querySelectorAll('.pm-tab').forEach(function (t) {
      t.addEventListener('click', function () {
        main.querySelectorAll('.pm-tab').forEach(function (x) { x.classList.toggle('active', x === t); });
        openTab(t.getAttribute('data-tab'));
      });
    });
  }

  function paint(animClass) {
    var p = getPM(), pm = PM(), creature = pm.getCreature(p.creatureId);
    var canvas = document.getElementById('pm-canvas');
    if (!canvas || !creature) return;
    pm.paintToCanvas(canvas, creature, p.evoStage, p.equipped, { stage: true });
    if (animClass) { canvas.classList.remove('pm-reveal', 'pm-evolve'); void canvas.offsetWidth; canvas.classList.add(animClass); }
  }

  function doTrain(main) {
    var tb = document.getElementById('pm-train'); if (tb) { if (tb.disabled) return; tb.disabled = true; } // anti double-clic
    var A = window.AIA, st = A.getState(), p = getPM(), pm = PM();
    var cost = pm.levelUpCost(p.level);
    if (cost == null) return;
    var avail = A.getAvailableXP ? A.getAvailableXP() : 0;
    var msg = document.getElementById('pm-msg');
    if (avail < cost) { if (msg) msg.innerHTML = '<span style="color:var(--red)">XP insuffisant.</span>'; return; }
    st.xpSpent = (st.xpSpent || 0) + cost; // dépense (l'XP total reste intact)
    p.level += 1;
    save();
    renderProfile(main, false);
    var m2 = document.getElementById('pm-msg');
    if (m2) m2.innerHTML = '<span style="color:var(--green)">💪 Niveau ' + p.level + ' ! ' + cost + ' XP dépensés.</span>';
    if (pm.evoStageForLevel(p.level) > p.evoStage && A.showToast) A.showToast('Ta créature peut évoluer ! ✨', 'success');
  }

  function doEvolve(main) {
    var A = window.AIA, p = getPM(), pm = PM();
    var target = pm.evoStageForLevel(p.level);
    if (target <= p.evoStage) return;
    p.evoStage = target; save();
    renderProfile(main, false);
    paint('pm-evolve');
    var creature = pm.getCreature(p.creatureId);
    if (A.showToast) A.showToast('✨ Évolution ! Voici ' + pm.creatureName(creature, p.evoStage) + ' !', 'success');
    if (A.awardBadge) A.awardBadge('promptmon-evolve');
    var m = document.getElementById('pm-msg');
    if (m) m.innerHTML = '<span style="color:var(--green)">✨ Évolution réussie : ' + esc(pm.creatureName(creature, p.evoStage)) + ' !</span>';
  }

  /* ----- Cosmétiques ----- */
  function renderCosmetics(body) {
    if (!body) return;
    var A = window.AIA, p = getPM(), pm = PM();
    var shop = pm.COSMETIC_SHOP || [];
    var avail = A.getAvailableXP ? A.getAvailableXP() : 0;
    body.innerHTML = '<div class="glass-card" style="padding:1rem">' +
      '<div style="font-weight:700;margin-bottom:.6rem">🎨 Cosmétiques pour ' + esc(pm.creatureName(pm.getCreature(p.creatureId), p.evoStage)) + '</div>' +
      '<div class="shop-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:.7rem">' +
      shop.map(function (it) {
        var owned = p.cosmetics.indexOf(it.id) !== -1;
        var equipped = p.equipped.indexOf(it.id) !== -1;
        var can = avail >= it.cost;
        return '<div class="glass-card pm-card" style="padding:.6rem;text-align:center">' +
          '<div style="font-size:1.6rem">' + it.icon + '</div>' +
          '<div style="font-weight:700;font-size:.85rem">' + esc(it.name) + '</div>' +
          '<div style="font-size:.78rem;color:var(--text-muted);margin:.2rem 0">' + it.cost + ' XP</div>' +
          (owned
            ? (equipped
                ? '<button class="btn-outline btn-sm pm-unequip" data-id="' + it.id + '" style="cursor:pointer">✓ Équipé</button>'
                : '<button class="btn-primary btn-sm pm-equip" data-id="' + it.id + '" style="cursor:pointer">Équiper</button>')
            : '<button class="btn-primary btn-sm pm-buy" data-id="' + it.id + '" style="cursor:pointer' + (can ? '' : ';opacity:.5') + '"' + (can ? '' : ' disabled') + '>' + (can ? 'Acheter' : '🔒 ' + (it.cost - avail)) + '</button>') +
          '</div>';
      }).join('') +
      '</div></div>';

    body.querySelectorAll('.pm-buy').forEach(function (b) {
      b.addEventListener('click', function () { buyCosmetic(this.getAttribute('data-id'), body); });
    });
    body.querySelectorAll('.pm-equip').forEach(function (b) {
      b.addEventListener('click', function () { var id = this.getAttribute('data-id'); var p2 = getPM(); if (p2.equipped.indexOf(id) === -1) p2.equipped.push(id); save(); paint(''); renderCosmetics(body); });
    });
    body.querySelectorAll('.pm-unequip').forEach(function (b) {
      b.addEventListener('click', function () { var id = this.getAttribute('data-id'); var p2 = getPM(); p2.equipped = p2.equipped.filter(function (x) { return x !== id; }); save(); paint(''); renderCosmetics(body); });
    });
  }

  function buyCosmetic(id, body) {
    var A = window.AIA, st = A.getState(), p = getPM(), pm = PM();
    var it = (pm.COSMETIC_SHOP || []).find(function (x) { return x.id === id; });
    if (!it) return;
    if (p.cosmetics.indexOf(id) !== -1) return;
    var avail = A.getAvailableXP ? A.getAvailableXP() : 0;
    if (avail < it.cost) { if (A.showToast) A.showToast('XP insuffisant', 'error'); return; }
    st.xpSpent = (st.xpSpent || 0) + it.cost;
    p.cosmetics.push(id);
    p.equipped.push(id); // équipe direct
    save(); paint('');
    if (A.showToast) A.showToast('Acheté : ' + it.name + ' ✓', 'success');
    renderCosmetics(body);
  }

  /* ----- Vue classe / Pokédex ----- */
  function renderClass(body) {
    if (!body) return;
    var A = window.AIA, pm = PM();
    body.innerHTML = '<div class="glass-card" style="padding:1rem"><div style="font-weight:700;margin-bottom:.6rem">👥 Les PromptMon de la classe</div>' +
      '<div id="pm-dex" class="pm-dex"><div class="loading-pulse" style="grid-column:1/-1;text-align:center;padding:1rem">Chargement…</div></div></div>';
    if (!A.db) { document.getElementById('pm-dex').innerHTML = '<p style="color:var(--text-muted)">Hors-ligne.</p>'; return; }
    // Lecture ponctuelle (pas de listener persistant -> aucune fuite ; rechargé à chaque ouverture de l'onglet)
    A.db.ref('promptmon/roster').once('value', function (snap) {
      var roster = snap.val() || {};
      A.db.ref('students').once('value', function (ss) {
        var students = ss.val() || {};
        var grid = document.getElementById('pm-dex'); if (!grid) return;
        var keys = Object.keys(roster);
        if (!keys.length) { grid.innerHTML = '<p style="grid-column:1/-1;color:var(--text-muted);text-align:center">Personne n’a encore de créature.</p>'; return; }
        grid.innerHTML = keys.map(function (k, i) {
          var cid = roster[k]; var creature = pm.getCreature(cid); if (!creature) return '';
          var nm = (students[k] && students[k].name) || k;
          return '<div class="glass-card pm-card"><canvas id="pm-dx-' + i + '" width="84" height="84" style="image-rendering:pixelated"></canvas>' +
            '<div style="font-weight:700;font-size:.8rem">' + esc(creature.names[0]) + '</div>' +
            '<div style="font-size:.7rem;color:var(--text-muted)">' + esc(nm) + '</div></div>';
        }).join('');
        keys.forEach(function (k, i) {
          var creature = pm.getCreature(roster[k]); var cv = document.getElementById('pm-dx-' + i);
          if (creature && cv) pm.paintToCanvas(cv, creature, 0, [], { stage: false });
        });
      });
    });
  }

  function hexA(hex, a) {
    var h = (hex || '#fff').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + a + ')';
  }

  function stopPromptmon() {
    var A = window.AIA;
    if (_classListener && A && A.db) { try { A.db.ref('promptmon/roster').off('value', _classListener); } catch (e) {} }
    _classListener = null;
  }

  /* ===================== COMPAGNON NAV (haut gauche, animation idle) =====================
     - Dès la connexion : la créature est AFFECTÉE automatiquement (sans ouvrir l'écran).
     - Affichée à côté de l'avatar étudiant (#nav-pet), animée en idle :
       respiration (bob 1px) + clignement des yeux. Clic -> écran PromptMon. */
  var _petWatch = null, _petAnim = null, _petT = 0, _assigning = false;

  function paintNavPet(tOverride) {
    var c = document.getElementById('nav-pet'); if (!c || c.style.display === 'none') return;
    var A = window.AIA, pm = PM(); if (!pm || !pm.drawCreature) return;
    var st = A.getState(); var p = st.promptmon; if (!p || !p.creatureId) return;
    var cr = pm.getCreature(p.creatureId); if (!cr) return;
    var ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, c.width, c.height);
    // Phase dérivée de l'horloge : robuste au throttling des onglets cachés (et testable)
    var t = (typeof tOverride === 'number') ? tOverride : Date.now();
    var bob = Math.floor(t / 720) % 2;            // respiration : 2 positions (720ms)
    var blink = (t % 4700) >= 4340;               // clignement ~360ms toutes les 4,7s
    pm.drawCreature(ctx, cr, p.evoStage || 0, p.equipped || [], 2, 2, 2 + bob, { blink: blink });
  }
  function startIdle() { if (_petAnim) return; _petAnim = setInterval(function () { paintNavPet(); }, 180); }
  function stopIdle() { if (_petAnim) { clearInterval(_petAnim); _petAnim = null; } }

  function petWatcher() {
    var A = window.AIA, c = document.getElementById('nav-pet');
    var st = A.getState && A.getState(); var u = st && st.user;
    if (!u || !u.accountKey) { // déconnecté ou formateur sans compte
      if (c) c.style.display = 'none';
      stopIdle(); return;
    }
    var p = getPM();
    if (!p.creatureId) {       // AFFECTATION AUTOMATIQUE à la connexion
      if (_assigning) return;
      _assigning = true;
      assignCreature(function (id, isNew) {
        _assigning = false;
        if (isNew && A.showToast) {
          var cr = PM().getCreature(id);
          if (cr) A.showToast('🐾 ' + cr.names[0] + ' t\'a choisi ! Retrouve-le en haut à gauche.', 'success');
        }
      });
      return;
    }
    if (c && c.style.display !== 'block') { c.style.display = 'block'; }
    startIdle();
  }
  function startPetWatcher() {
    if (_petWatch) return;
    petWatcher();
    _petWatch = setInterval(petWatcher, 1500);
  }
  // Démarre dès le chargement (scripts en fin de body : DOM prêt)
  try { startPetWatcher(); } catch (e) {}

  window.AIA = window.AIA || {};
  window.AIA.renderPromptmon = renderPromptmon;
  window.AIA.stopPromptmon = stopPromptmon;
  window.AIA.paintNavPet = paintNavPet;
})();
