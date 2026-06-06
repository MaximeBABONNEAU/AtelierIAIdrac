/* ==============================================
   LIVE.JS — Mode Live (broadcast formateur, plein ecran immersif esport)
   Reserve admin. Classement geant + feed d'activite + dernieres creations + temps fort + stats.
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  var _listeners = []; // {ref, event, cb} a detacher a la fermeture
  var _students = {};
  var _states = {};
  var _feed = [];
  var _keyHandler = null;
  var _tfInterval = null;

  function escLive(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }

  var FEED_META = {
    'theme-picked': { icon: '🎯', verb: 'a choisi son projet' },
    'step-done': { icon: '✅', verb: 'a valide' },
    'demo-done': { icon: '🛠️', verb: 'a teste' },
    'badge-unlocked': { icon: '🏅', verb: 'a debloque' },
    'highlight-done': { icon: '⚡', verb: 'a releve' },
    'reviewed': { icon: '💬', verb: 'a evalue une campagne' },
    'voted': { icon: '❤️', verb: 'a vote' },
    'campaign-export': { icon: '📦', verb: 'a exporte son Carnet' }
  };
  var DEMO_NAMES = {
    'demo-prompt': 'Prompt Playground', 'demo-chatbot': 'Chatbot Marketing', 'demo-vqa': 'Analyse Visuelle',
    'demo-translate': 'Traduction', 'demo-image': "Generation d'Images", 'demo-logo': 'Generateur de Logos',
    'demo-bg-remove': 'Suppression de Fond', 'demo-upscale': 'Upscaler', 'demo-sentiment': 'Analyse de Sentiment',
    'demo-music': 'Generation Musicale', 'demo-tts': 'Voix Off IA', 'demo-avatar': 'Avatar Video',
    'demo-abtest': 'A/B Testing', 'demo-seo': 'SEO Analyzer', 'demo-speech': 'Transcription'
  };
  function prettyTarget(action, target) {
    if (action === 'demo-done') return DEMO_NAMES[target] || target;
    return target;
  }

  /* ===== Donnees agregees ===== */
  function leaderboardRows() {
    return Object.keys(_students).map(function (k) {
      var s = _students[k] || {};
      return { key: k, name: s.name || k, xp: s.xp || 0, progress: s.progress || 0, online: !!s.online };
    }).filter(function (r) { return !/^admin/.test(r.key); }) // masquer comptes admin du classement
      .sort(function (a, b) { return b.xp - a.xp || a.name.localeCompare(b.name); });
  }
  function campaignRows() {
    var out = [];
    var PG = window.AIA.PHASES_GUIDE || {};
    Object.keys(_states).forEach(function (k) {
      var s = _states[k];
      if (!s || !s.productTheme) return;
      var done = 0, total = 0, assets = [];
      Object.keys(PG).forEach(function (pk) {
        (PG[pk].steps || []).forEach(function (step) {
          total++;
          if (s.gameDeliverables && s.gameDeliverables[step.id]) done++;
          var d = s.campaignData && s.campaignData[step.id];
          if (d && Array.isArray(d.assets)) d.assets.forEach(function (a) { assets.push(a); });
        });
      });
      out.push({
        key: k, name: (s.user && s.user.name) || k, theme: s.productTheme,
        pct: total ? Math.round(done * 100 / total) : 0, assets: assets,
        lastSeen: (s.user && s.user.lastSeen) || 0
      });
    });
    out.sort(function (a, b) { return (b.lastSeen || 0) - (a.lastSeen || 0); });
    return out;
  }

  /* ===== Panneaux ===== */
  function statBox(icon, num, lbl) {
    return '<div class="live-stat"><div class="live-stat-icon">' + icon + '</div>' +
      '<div class="live-stat-num">' + num + '</div><div class="live-stat-lbl">' + lbl + '</div></div>';
  }
  function renderStats() {
    var el = document.getElementById('live-stats'); if (!el) return;
    var lb = leaderboardRows();
    var online = lb.filter(function (r) { return r.online; }).length;
    var camps = campaignRows();
    var avg = camps.length ? Math.round(camps.reduce(function (s, r) { return s + r.pct; }, 0) / camps.length) : 0;
    var totalXp = lb.reduce(function (s, r) { return s + r.xp; }, 0);
    el.innerHTML = statBox('🟢', online, 'en ligne') + statBox('🎯', camps.length, 'campagnes') +
      statBox('📊', avg + '%', 'progression') + statBox('⭐', totalXp.toLocaleString(), 'XP classe');
  }

  function renderLeaderboardPanel() {
    var el = document.getElementById('live-lb'); if (!el) return;
    var rows = leaderboardRows();
    if (!rows.length) { el.innerHTML = '<div class="live-empty">En attente des premiers etudiants…</div>'; return; }
    var medals = ['🥇', '🥈', '🥉'];
    var top3 = rows.slice(0, 3), rest = rows.slice(3, 10);
    var html = '<div class="live-podium">' + top3.map(function (r, i) {
      return '<div class="live-pod live-pod-' + (i + 1) + '"><div class="live-pod-medal">' + medals[i] + '</div>' +
        '<div class="live-pod-name">' + escLive(r.name) + '</div>' +
        '<div class="live-pod-xp">' + r.xp.toLocaleString() + ' <span>XP</span></div></div>';
    }).join('') + '</div>';
    if (rest.length) {
      html += '<div class="live-lb-list">' + rest.map(function (r, i) {
        return '<div class="live-lb-row"><span class="live-lb-rk">#' + (i + 4) + '</span>' +
          '<span class="live-lb-name">' + (r.online ? '🟢 ' : '') + escLive(r.name) + '</span>' +
          '<span class="live-lb-xp">' + r.xp.toLocaleString() + '</span></div>';
      }).join('') + '</div>';
    }
    el.innerHTML = html;
  }

  function renderFeedPanel() {
    var el = document.getElementById('live-feed'); if (!el) return;
    if (!_feed.length) { el.innerHTML = '<div class="live-empty">Le feed s\'animera des les premieres actions…</div>'; return; }
    el.innerHTML = _feed.slice(0, 22).map(function (it) {
      var meta = FEED_META[it.action] || { icon: '•', verb: it.action };
      var tgt = prettyTarget(it.action, it.target);
      return '<div class="live-feed-item"><span class="live-feed-icon">' + meta.icon + '</span>' +
        '<span class="live-feed-txt"><strong>' + escLive(it.actorName || 'Etudiant') + '</strong> ' + escLive(meta.verb) +
        (tgt ? ' <span class="live-feed-tgt">' + escLive(tgt) + '</span>' : '') + '</span></div>';
    }).join('');
  }

  function renderCreationsPanel() {
    var el = document.getElementById('live-creations'); if (!el) return;
    var camps = campaignRows();
    if (!camps.length) { el.innerHTML = '<div class="live-empty">Les projets choisis apparaitront ici…</div>'; return; }
    el.innerHTML = camps.slice(0, 8).map(function (c) {
      var t = c.theme || {};
      var img = '';
      for (var i = 0; i < c.assets.length; i++) {
        var u = c.assets[i] && (c.assets[i].url || c.assets[i]);
        if (typeof u === 'string' && /\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/i.test(u)) { img = u; break; }
      }
      return '<div class="live-creation">' +
        (img ? '<div class="live-creation-img" style="background-image:url(' + JSON.stringify(img) + ')"></div>'
          : '<div class="live-creation-emoji">' + (t.emoji || '🎯') + '</div>') +
        '<div class="live-creation-body"><div class="live-creation-name">' + escLive(t.name || '') + '</div>' +
        '<div class="live-creation-author">' + escLive(c.name) + ' &bull; ' + c.pct + '%</div></div></div>';
    }).join('');
  }

  function paintTfScores(rows, unit) {
    var box = document.getElementById('live-tf-scores'); if (!box) return;
    rows.sort(function (a, b) { return b.score - a.score; });
    if (!rows.length) { box.innerHTML = '<div class="live-empty">Pas encore de participation…</div>'; return; }
    var medals = ['🥇', '🥈', '🥉'];
    box.innerHTML = rows.slice(0, 5).map(function (r, i) {
      return '<div class="live-tf-row"><span class="live-tf-rk">' + (medals[i] || ('#' + (i + 1))) + '</span>' +
        '<span class="live-tf-name">' + escLive(r.name || 'Etudiant') + '</span>' +
        '<span class="live-tf-score">' + r.score + ' ' + unit + '</span></div>';
    }).join('');
  }
  function loadTempsFortScores(h) {
    var AIA = window.AIA; if (!AIA.db) return;
    if (h.type === 'showcase') {
      AIA.db.ref('votes').once('value', function (snap) {
        var all = snap.val() || {}, counts = {};
        Object.keys(all).forEach(function (voter) { Object.keys(all[voter] || {}).forEach(function (t) { if (all[voter][t]) counts[t] = (counts[t] || 0) + 1; }); });
        var rows = Object.keys(counts).map(function (k) {
          var nm = (_states[k] && _states[k].user && _states[k].user.name) || (_states[k] && _states[k].productTheme && _states[k].productTheme.name) || k;
          return { key: k, name: nm, score: counts[k] };
        });
        paintTfScores(rows, '♥');
      });
    } else {
      var path = h.type === 'boss' ? 'boss_scores/' : 'highlight_scores/';
      AIA.db.ref(path + h.id).once('value', function (snap) {
        var v = snap.val() || {};
        var rows = Object.keys(v).map(function (k) { return { key: k, name: v[k].name, score: v[k].score || 0 }; });
        paintTfScores(rows, h.type === 'boss' ? '%' : 'pts');
      });
    }
  }
  function renderTempsFortPanel() {
    var el = document.getElementById('live-tf'); if (!el) return;
    var AIA = window.AIA;
    var next = AIA.getNextHighlight ? AIA.getNextHighlight() : null;
    if (!next) { el.innerHTML = '<div class="live-tf-idle">Aucun temps fort programme</div>'; return; }
    var h = next.highlight, active = next.status === 'active';
    el.innerHTML = '<div class="live-tf-head"><span class="live-tf-badge ' + (active ? 'on' : '') + '">' +
      (active ? '🔴 EN DIRECT' : '⏳ A VENIR') + '</span> <span class="live-tf-icon">' + (h.icon || '⭐') + '</span> ' +
      '<span class="live-tf-title">' + escLive(h.title) + '</span></div>' +
      '<div id="live-tf-scores" class="live-tf-scores"><div class="live-empty">' +
      (active ? 'Scores en direct…' : 'Demarre a ' + escLive(h.timeStart)) + '</div></div>';
    if (active) loadTempsFortScores(h);
  }

  function renderAll() { renderStats(); renderLeaderboardPanel(); renderFeedPanel(); renderCreationsPanel(); renderTempsFortPanel(); }

  /* ===== Cycle de vie ===== */
  function attach(ref, event, cb) { ref.on(event, cb); _listeners.push({ ref: ref, event: event, cb: cb }); }

  function renderLiveMode() {
    var AIA = window.AIA;
    if (document.getElementById('live-overlay')) return; // deja ouvert
    // Reset d'etat pour un cycle propre (evite tout residu d'une ouverture precedente)
    _listeners = []; _students = {}; _states = {}; _feed = [];
    if (_tfInterval) { clearInterval(_tfInterval); _tfInterval = null; }
    if (_keyHandler) { document.removeEventListener('keydown', _keyHandler); _keyHandler = null; }
    var ov = document.createElement('div');
    ov.id = 'live-overlay'; ov.className = 'live-overlay';
    ov.innerHTML =
      '<div class="live-header">' +
      '<div class="live-title"><span class="live-rec">●</span> LIVE <span class="live-sub">AI Marketing Academy &bull; IDRAC</span></div>' +
      '<div id="live-stats" class="live-stats"></div>' +
      '<button class="live-close" id="live-close" title="Quitter (Echap)">✕</button>' +
      '</div>' +
      '<div class="live-grid">' +
      '<section class="live-card live-col-lb"><h2>🏆 Classement</h2><div id="live-lb" class="live-panel"></div></section>' +
      '<section class="live-col-mid">' +
      '<div class="live-card live-tf-card"><h2>⚡ Temps fort</h2><div id="live-tf" class="live-panel"></div></div>' +
      '<div class="live-card live-creations-card"><h2>🎨 Dernieres creations</h2><div id="live-creations" class="live-panel live-creations-grid"></div></div>' +
      '</section>' +
      '<section class="live-card live-col-feed"><h2>📡 En direct</h2><div id="live-feed" class="live-panel"></div></section>' +
      '</div>';
    document.body.appendChild(ov);
    document.getElementById('live-close').addEventListener('click', closeLiveMode);
    _keyHandler = function (e) { if (e.key === 'Escape') closeLiveMode(); };
    document.addEventListener('keydown', _keyHandler);

    if (!AIA.db) { renderAll(); return; }
    attach(AIA.db.ref('students'), 'value', function (snap) { _students = snap.val() || {}; renderStats(); renderLeaderboardPanel(); });
    attach(AIA.db.ref('states'), 'value', function (snap) { _states = snap.val() || {}; renderStats(); renderCreationsPanel(); renderTempsFortPanel(); });
    attach(AIA.db.ref('activity_feed').limitToLast(40), 'value', function (snap) {
      var d = snap.val() || {};
      _feed = Object.keys(d).map(function (k) { return d[k]; }).sort(function (a, b) { return (b.ts || '').localeCompare(a.ts || ''); });
      renderFeedPanel();
    });
    _tfInterval = setInterval(renderTempsFortPanel, 20000); // statut horaire + scores rafraichis
    renderAll();
  }

  function closeLiveMode() {
    _listeners.forEach(function (l) { try { l.ref.off(l.event, l.cb); } catch (e) {} });
    _listeners = [];
    if (_tfInterval) { clearInterval(_tfInterval); _tfInterval = null; }
    if (_keyHandler) { document.removeEventListener('keydown', _keyHandler); _keyHandler = null; }
    var ov = document.getElementById('live-overlay'); if (ov) ov.remove();
  }

  window.AIA = window.AIA || {};
  window.AIA.renderLiveMode = renderLiveMode;
  window.AIA.closeLiveMode = closeLiveMode;
})();
