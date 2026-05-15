/* ==============================================
   ECONOMY.JS — Boutique XP + Avatar cosmetics
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  /* ============ SHOP CATALOG ============ */
  // Items have: id, name, icon, cost (XP), category, desc, rarity
  // Categories: hint (consumable), cosmetic (avatar), bonus (utility)
  var SHOP_ITEMS = [
    // === COSMETICS (equippable, permanent) ===
    { id: 'frame-bronze', name: 'Cadre Bronze', icon: '🥉', cost: 50, category: 'cosmetic', rarity: 'common',
      desc: 'Cadre bronze autour de votre avatar sur la salle de classe et le leaderboard.' },
    { id: 'frame-silver', name: 'Cadre Argent', icon: '🥈', cost: 150, category: 'cosmetic', rarity: 'rare',
      desc: 'Cadre argente etincelant.' },
    { id: 'frame-gold', name: 'Cadre Or', icon: '🥇', cost: 300, category: 'cosmetic', rarity: 'epic',
      desc: 'Cadre or pour les grands champions.' },
    { id: 'aura-cyan', name: 'Aura Cyan', icon: '🌀', cost: 100, category: 'cosmetic', rarity: 'rare',
      desc: 'Aura cyan pulsante autour de votre avatar.' },
    { id: 'aura-purple', name: 'Aura Violet', icon: '💜', cost: 100, category: 'cosmetic', rarity: 'rare',
      desc: 'Aura violette mystique.' },
    { id: 'aura-fire', name: 'Aura Feu', icon: '🔥', cost: 200, category: 'cosmetic', rarity: 'epic',
      desc: 'Flammes animees autour de votre avatar.' },
    { id: 'title-prompter', name: 'Titre "Prompt Master"', icon: '⌨️', cost: 80, category: 'cosmetic', rarity: 'rare',
      desc: 'Affiche un titre stylise sous votre nom : Prompt Master.' },
    { id: 'title-creator', name: 'Titre "AI Creator"', icon: '🎨', cost: 80, category: 'cosmetic', rarity: 'rare',
      desc: 'Affiche un titre stylise sous votre nom : AI Creator.' },
    { id: 'title-strategist', name: 'Titre "Stratege"', icon: '🎯', cost: 120, category: 'cosmetic', rarity: 'rare',
      desc: 'Affiche un titre stylise sous votre nom : Stratege.' },
    { id: 'title-legend', name: 'Titre "Legende IDRAC"', icon: '🦄', cost: 500, category: 'cosmetic', rarity: 'legendary',
      desc: 'Le titre ultime. Seuls les meilleurs peuvent l\'arborer.' },

    // === HINTS (consumable, single-use) ===
    { id: 'hint-battle', name: 'Astuce Battle', icon: '💡', cost: 30, category: 'hint', rarity: 'common',
      desc: 'Revele une astuce contextuelle pour ameliorer votre prochain prompt Battle.', consumable: true },
    { id: 'hint-quiz', name: 'Joker Quiz', icon: '🃏', cost: 40, category: 'hint', rarity: 'rare',
      desc: 'Elimine 2 mauvaises reponses dans le prochain Quiz interactif.', consumable: true },
    { id: 'reroll-theme', name: 'Re-roll de projet', icon: '🎲', cost: 200, category: 'bonus', rarity: 'rare',
      desc: 'Permet de re-tirer 3 nouveaux produits fictifs pour votre Business Game.', consumable: true },

    // === BONUS UTILITIES ===
    { id: 'extra-battle', name: '+1 Combat RPG', icon: '⚔️', cost: 50, category: 'bonus', rarity: 'common',
      desc: 'Augmente votre limite quotidienne de RPG PvP de 1 combat (max +3 par jour).', consumable: true },
    { id: 'bonus-xp-pack', name: 'Boost XP +25', icon: '⚡', cost: 100, category: 'bonus', rarity: 'rare',
      desc: 'Recoit immediatement +25 XP (avec un peu de RNG). Risque/recompense.', consumable: true },

    // === LEGENDARY ===
    { id: 'cape-legend', name: 'Cape Legendaire', icon: '🦸', cost: 1000, category: 'cosmetic', rarity: 'legendary',
      desc: 'La cape ultime — visible partout. Une legende vivante.' }
  ];

  /* ============ STATE HELPERS ============ */
  function getAvailableXP() {
    var st = window.AIA.getState();
    var total = (st.xp && st.xp.total) || 0;
    var spent = st.xpSpent || 0;
    return Math.max(0, total - spent);
  }

  function getPurchases() {
    var st = window.AIA.getState();
    return Array.isArray(st.purchases) ? st.purchases : [];
  }

  function getEquipped() {
    var st = window.AIA.getState();
    return Array.isArray(st.equippedCosmetics) ? st.equippedCosmetics : [];
  }

  function hasPurchased(itemId) {
    var item = SHOP_ITEMS.find(function (i) { return i.id === itemId; });
    if (!item) return false;
    // Consumable items can be re-bought
    if (item.consumable) return false;
    return getPurchases().indexOf(itemId) !== -1;
  }

  function purchase(item, callback) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var available = getAvailableXP();
    if (available < item.cost) { if (callback) callback({ error: 'XP insuffisant' }); return; }
    if (!item.consumable && hasPurchased(item.id)) { if (callback) callback({ error: 'Deja achete' }); return; }

    st.xpSpent = (st.xpSpent || 0) + item.cost;
    st.purchases = Array.isArray(st.purchases) ? st.purchases : [];
    if (!item.consumable) st.purchases.push(item.id);

    // Apply item effects
    if (item.id === 'bonus-xp-pack') {
      // RNG : 50% chance de +30, 30% de +20, 20% de +10
      var roll = Math.random();
      var gain = roll < 0.5 ? 30 : roll < 0.8 ? 20 : 10;
      if (AIA.addXP) AIA.addXP(gain, 'Boost XP achete');
    }
    if (item.id === 'extra-battle') {
      st.extraBattleAllowance = (st.extraBattleAllowance || 0) + 1;
    }

    if (AIA.saveState) AIA.saveState();
    if (callback) callback({ success: true });
  }

  function equip(itemId) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var item = SHOP_ITEMS.find(function (i) { return i.id === itemId; });
    if (!item || item.category !== 'cosmetic') return;
    st.equippedCosmetics = Array.isArray(st.equippedCosmetics) ? st.equippedCosmetics : [];

    // Frames are exclusive (only 1 frame at a time)
    if (item.id.indexOf('frame-') === 0) {
      st.equippedCosmetics = st.equippedCosmetics.filter(function (id) { return id.indexOf('frame-') !== 0; });
    }
    // Auras are exclusive
    if (item.id.indexOf('aura-') === 0) {
      st.equippedCosmetics = st.equippedCosmetics.filter(function (id) { return id.indexOf('aura-') !== 0; });
    }
    // Titles are exclusive
    if (item.id.indexOf('title-') === 0) {
      st.equippedCosmetics = st.equippedCosmetics.filter(function (id) { return id.indexOf('title-') !== 0; });
    }

    if (st.equippedCosmetics.indexOf(itemId) === -1) st.equippedCosmetics.push(itemId);
    if (AIA.saveState) AIA.saveState();
  }

  function unequip(itemId) {
    var AIA = window.AIA;
    var st = AIA.getState();
    if (Array.isArray(st.equippedCosmetics)) {
      st.equippedCosmetics = st.equippedCosmetics.filter(function (id) { return id !== itemId; });
    }
    if (AIA.saveState) AIA.saveState();
  }

  /* ============ RENDER SHOP ============ */
  function renderShop(main) {
    var available = getAvailableXP();
    var st = window.AIA.getState();
    var purchases = getPurchases();
    var equipped = getEquipped();

    var byCat = { cosmetic: [], hint: [], bonus: [] };
    SHOP_ITEMS.forEach(function (i) { (byCat[i.category] || []).push(i); });

    var html = '<div class="page-header"><h1>Boutique <span class="gradient-text">XP</span></h1>' +
      '<p class="page-subtitle">Depensez vos XP en cosmetiques exclusifs et bonus de gameplay</p></div>' +

      '<div class="shop-wallet glass-card">' +
      '<div class="wallet-row">' +
      '<div class="wallet-stat"><div class="wn">' + ((st.xp && st.xp.total) || 0) + '</div><div class="wl">XP total gagnes</div></div>' +
      '<div class="wallet-stat"><div class="wn">' + (st.xpSpent || 0) + '</div><div class="wl">XP depenses</div></div>' +
      '<div class="wallet-stat primary"><div class="wn">' + available + '</div><div class="wl">XP disponibles 💰</div></div>' +
      '<div class="wallet-stat"><div class="wn">' + purchases.length + '</div><div class="wl">Items possedes</div></div>' +
      '</div></div>';

    var CAT_LABELS = { cosmetic: '🎨 Cosmetiques (permanent)', hint: '💡 Astuces & jokers (consommables)', bonus: '⚡ Bonus utilites' };
    Object.keys(byCat).forEach(function (cat) {
      var items = byCat[cat];
      if (!items.length) return;
      html += '<div class="shop-section">' +
        '<h2>' + CAT_LABELS[cat] + '</h2>' +
        '<div class="shop-grid">' +
        items.map(function (item) {
          var owned = hasPurchased(item.id);
          var isEquipped = equipped.indexOf(item.id) !== -1;
          var canAfford = available >= item.cost;
          return '<div class="shop-card glass-card rarity-' + item.rarity + (owned ? ' owned' : '') + (isEquipped ? ' equipped' : '') + '" data-item-id="' + item.id + '">' +
            '<div class="shop-rarity">' + item.rarity + '</div>' +
            '<div class="shop-icon">' + item.icon + '</div>' +
            '<h3>' + escapeHtml(item.name) + '</h3>' +
            '<p class="shop-desc">' + escapeHtml(item.desc) + '</p>' +
            '<div class="shop-footer">' +
            '<div class="shop-cost">' + item.cost + ' XP</div>' +
            (owned
              ? (item.category === 'cosmetic'
                  ? (isEquipped
                      ? '<button class="btn-outline btn-sm shop-unequip" data-item-id="' + item.id + '">✓ Equipe</button>'
                      : '<button class="btn-primary btn-sm shop-equip" data-item-id="' + item.id + '">Equiper</button>')
                  : '<div class="shop-owned-label">✓ Possede</div>')
              : '<button class="btn-primary btn-sm shop-buy ' + (canAfford ? '' : 'disabled') + '" data-item-id="' + item.id + '"' + (canAfford ? '' : ' disabled') + '>' + (canAfford ? 'Acheter' : '🔒 ' + (item.cost - available) + ' XP manquants') + '</button>') +
            '</div></div>';
        }).join('') +
        '</div></div>';
    });

    main.innerHTML = html;

    // Wire purchase
    main.querySelectorAll('.shop-buy').forEach(function (btn) {
      if (btn.classList.contains('disabled')) return;
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-item-id');
        var item = SHOP_ITEMS.find(function (i) { return i.id === id; });
        if (!item) return;
        if (!confirm('Acheter "' + item.name + '" pour ' + item.cost + ' XP ?')) return;
        purchase(item, function (res) {
          if (res.error) { window.AIA.showToast(res.error, 'error'); return; }
          window.AIA.showToast('Achete : ' + item.name + ' ✓', 'success');
          renderShop(main);
        });
      });
    });

    // Wire equip / unequip
    main.querySelectorAll('.shop-equip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-item-id');
        equip(id);
        window.AIA.showToast('Equipe !', 'success');
        renderShop(main);
      });
    });
    main.querySelectorAll('.shop-unequip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-item-id');
        unequip(id);
        window.AIA.showToast('Retire', 'info');
        renderShop(main);
      });
    });
  }

  /* ============ HELPERS for other modules to read equipped items ============ */
  function getEquippedTitle() {
    var eq = getEquipped();
    var titleItem = SHOP_ITEMS.find(function (i) { return i.category === 'cosmetic' && i.id.indexOf('title-') === 0 && eq.indexOf(i.id) !== -1; });
    return titleItem ? titleItem.name.replace(/^Titre "/, '').replace(/"$/, '') : null;
  }

  function getEquippedFrame() {
    var eq = getEquipped();
    return eq.find(function (id) { return id.indexOf('frame-') === 0; }) || null;
  }

  function getEquippedAura() {
    var eq = getEquipped();
    return eq.find(function (id) { return id.indexOf('aura-') === 0; }) || null;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  window.AIA = window.AIA || {};
  window.AIA.SHOP_ITEMS = SHOP_ITEMS;
  window.AIA.renderShop = renderShop;
  window.AIA.getAvailableXP = getAvailableXP;
  window.AIA.getEquippedTitle = getEquippedTitle;
  window.AIA.getEquippedFrame = getEquippedFrame;
  window.AIA.getEquippedAura = getEquippedAura;
  window.AIA.shopPurchase = purchase;
  window.AIA.shopEquip = equip;
  window.AIA.shopUnequip = unequip;
})();
