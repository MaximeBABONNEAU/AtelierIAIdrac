/* ==============================================
   DUEL.JS — Vrai duel de prompts etudiant-vs-etudiant
   Matchmaking (file d'attente) + tour par tour (timer 30s) + auto-score + 10 duels/jour.
   Firebase : /duel_queue, /duels/<id>, /duel_notify/<key>, compteur dans /pvp/<key>.
   IDRAC Business School — [AI-assisted]
   ============================================== */
(function () {
  'use strict';

  function esc(t) { var d = document.createElement('div'); d.textContent = (t == null ? '' : String(t)); return d.innerHTML; }
  function todayISO() { return new Date().toISOString().split('T')[0]; }

  var DUEL_MAX_PER_DAY = 10, TURN_SECONDS = 30, WIN_PTS = 30, LOSE_PTS = 8, WIN_XP = 10, LOSE_XP = 3;

  var BRIEFS = [
    'Ecris le MEILLEUR prompt pour generer un SLOGAN percutant pour une marque de cafe bio.',
    'Ecris le MEILLEUR prompt pour creer un PERSONA marketing detaille d\'une app de fitness.',
    'Ecris le MEILLEUR prompt pour une IMAGE de packaging premium d\'une eau aromatisee.',
    'Ecris le MEILLEUR prompt pour un EMAIL de relance client chaleureux et efficace.',
    'Ecris le MEILLEUR prompt pour un POST LinkedIn viral sur l\'IA en marketing.',
    'Ecris le MEILLEUR prompt pour un SCRIPT video TikTok de 15s pour des baskets eco-responsables.',
    'Ecris le MEILLEUR prompt pour une ANALYSE concurrentielle d\'un nouveau soda artisanal.',
    'Ecris le MEILLEUR prompt pour un PLAN media de lancement avec 10 000 EUR de budget.'
  ];

  // Auto-score heuristique d'un prompt (0-100) : effort, structure CRAC, specificite.
  function scoreDuel(text) {
    text = (text || '').trim(); if (!text) return 0;
    var words = text.split(/\s+/).length;
    var s = Math.min(40, Math.round(words * 1.1));
    var low = text.toLowerCase();
    ['role', 'agis', 'expert', 'contexte', 'objectif', 'format', 'ton', 'style', 'contrainte', 'etape', 'exemple', 'cible', 'audience', 'public'].forEach(function (k) { if (low.indexOf(k) > -1) s += 4; });
    if (/\d/.test(text)) s += 6;
    if (/\n|[-•*]|\d[\.\)]/.test(text)) s += 8;
    if (text.indexOf(':') > -1) s += 4;
    if (words >= 40) s += 8;
    return Math.max(1, Math.min(100, s));
  }

  function me() { var st = window.AIA.getState(); return st.user || {}; }

  /* ---------- Compteur quotidien (dans /pvp/<key>) ---------- */
  function getDuelCount(cb) {
    var A = window.AIA, u = me();
    if (!A.db || !u.accountKey) { cb(0); return; }
    A.db.ref('pvp/' + u.accountKey).once('value', function (s) {
      var p = s.val() || {}; cb(p.duelsDate === todayISO() ? (p.duelsToday || 0) : 0);
    });
  }

  /* ---------- ETAT module ---------- */
  var _queueRef = null, _notifyRef = null, _duelRef = null, _timer = null, _rewardedLocal = {};

  function cleanup() {
    var A = window.AIA; if (!A || !A.db) return;
    var u = me();
    try { if (_queueRef) _queueRef.off(); } catch (e) {}
    try { if (_notifyRef) _notifyRef.off(); } catch (e) {}
    try { if (_duelRef) _duelRef.off(); } catch (e) {}
    if (_timer) { clearInterval(_timer); _timer = null; }
    if (u.accountKey) { try { A.db.ref('duel_queue/' + u.accountKey).remove(); } catch (e) {} }
    _queueRef = _notifyRef = _duelRef = null;
  }
  function stopDuel() { cleanup(); }

  function renderDuel(main) {
    var A = window.AIA, u = me();
    main = main || document.getElementById('main-content');
    cleanup();
    if (!A.db || !u.accountKey) {
      main.innerHTML = '<div class="page-header"><h1>Duel de <span class="gradient-text">Prompts</span></h1></div>' +
        '<div class="glass-card" style="text-align:center;padding:2rem">Le duel necessite une connexion etudiant.</div>';
      return;
    }
    getDuelCount(function (count) {
      var remaining = DUEL_MAX_PER_DAY - count;
      main.innerHTML = '<div class="page-header">' +
        '<a href="#" data-navigate="arena" style="color:var(--text-muted);font-size:.78rem;text-decoration:none">&larr; Arena</a>' +
        '<h1>Duel de <span class="gradient-text">Prompts</span></h1>' +
        '<p class="page-subtitle">Matchmaking en classe &bull; chacun son tour &bull; ' + TURN_SECONDS + 's par prompt &bull; auto-score</p></div>' +
        '<div class="glass-card" style="text-align:center;padding:2rem">' +
        '<div style="font-size:3rem;margin-bottom:.4rem">⚔️</div>' +
        '<h3>Affronte un autre etudiant</h3>' +
        '<p style="color:var(--text-muted);max-width:520px;margin:.4rem auto">Tu es mis en relation avec un adversaire. Chacun a <strong>' + TURN_SECONDS + ' secondes</strong> pour ecrire son meilleur prompt sur le brief. Les 2 prompts sont notes automatiquement : le meilleur gagne.</p>' +
        '<div style="margin:1rem 0;font-weight:700">Duels aujourd\'hui : ' + count + ' / ' + DUEL_MAX_PER_DAY + '</div>' +
        (remaining > 0
          ? '<button class="btn-primary" id="btn-find-duel">🔍 Trouver un adversaire</button>'
          : '<div style="color:var(--gold)">Limite quotidienne atteinte (' + DUEL_MAX_PER_DAY + ' duels). Reviens demain !</div>') +
        '</div>';
      var btn = document.getElementById('btn-find-duel');
      if (btn) btn.addEventListener('click', function () { startMatchmaking(main); });
    });
  }

  /* ---------- MATCHMAKING (file d'attente) ---------- */
  function showSearching(main) {
    main.innerHTML = '<div class="page-header"><h1>Recherche d\'<span class="gradient-text">adversaire</span></h1></div>' +
      '<div class="glass-card" style="text-align:center;padding:2.5rem">' +
      '<div class="loading-pulse" style="font-size:2.4rem;margin-bottom:.6rem">🔎</div>' +
      '<h3>Recherche d\'un adversaire en ligne...</h3>' +
      '<p style="color:var(--text-muted)">Le duel demarre des qu\'un autre etudiant rejoint la file.</p>' +
      '<button class="btn-outline" id="btn-cancel-duel" style="margin-top:1rem">Annuler</button>' +
      '</div>';
    var c = document.getElementById('btn-cancel-duel');
    if (c) c.addEventListener('click', function () { cleanup(); renderDuel(main); });
  }

  function startMatchmaking(main) {
    var A = window.AIA, u = me(), meKey = u.accountKey, meName = u.name || 'Etudiant';
    getDuelCount(function (count) {
      if (count >= DUEL_MAX_PER_DAY) { renderDuel(main); return; }
      showSearching(main);
      // 1) inscription dans la file
      A.db.ref('duel_queue/' + meKey).set({ name: meName, ts: Date.now() });
      try { A.db.ref('duel_queue/' + meKey).onDisconnect().remove(); } catch (e) {}
      // 2) ecoute d'une notification de match (apparie par un autre client)
      _notifyRef = A.db.ref('duel_notify/' + meKey);
      _notifyRef.on('value', function (s) {
        var did = s.val();
        if (did) { try { _notifyRef.off(); } catch (e) {} _notifyRef = null; A.db.ref('duel_notify/' + meKey).remove(); openDuel(main, did); }
      });
      // 3) ecoute de la file : le "host" (plus petite cle des 2 plus anciens) cree le duel
      _queueRef = A.db.ref('duel_queue');
      _queueRef.on('value', function (s) {
        var q = s.val() || {};
        var keys = Object.keys(q).filter(function (k) { return q[k] && q[k].ts; }).sort(function (a, b) { return (q[a].ts || 0) - (q[b].ts || 0); });
        if (keys.length < 2) return;
        var a = keys[0], b = keys[1];
        if (meKey !== a && meKey !== b) return;
        var host = a < b ? a : b, opp = host === a ? b : a;
        if (meKey !== host) return;
        if (_queueRef) { try { _queueRef.off(); } catch (e) {} _queueRef = null; }
        createDuel(main, host, q[host].name, opp, q[opp].name);
      });
    });
  }

  function createDuel(main, hostKey, hostName, oppKey, oppName) {
    var A = window.AIA;
    var brief = BRIEFS[Math.floor(Math.random() * BRIEFS.length)];
    var order = Math.random() < 0.5 ? [hostKey, oppKey] : [oppKey, hostKey];
    var ref = A.db.ref('duels').push();
    var did = ref.key;
    var names = {}; names[hostKey] = hostName; names[oppKey] = oppName;
    ref.set({
      brief: brief, names: names, order: order, turn: order[0],
      prompts: {}, scores: {}, status: 'playing', winner: '', claimed: {},
      deadline: Date.now() + TURN_SECONDS * 1000, createdAt: Date.now()
    }, function () {
      A.db.ref('duel_queue/' + hostKey).remove();
      A.db.ref('duel_queue/' + oppKey).remove();
      A.db.ref('duel_notify/' + oppKey).set(did);
      openDuel(main, did);
    });
  }

  /* ---------- DUEL (tour par tour) ---------- */
  function openDuel(main, did) {
    var A = window.AIA, meKey = me().accountKey;
    if (_duelRef) { try { _duelRef.off(); } catch (e) {} }
    _duelRef = A.db.ref('duels/' + did);
    _duelRef.on('value', function (s) {
      var d = s.val();
      if (_timer) { clearInterval(_timer); _timer = null; }
      if (!d) { main.innerHTML = '<div class="glass-card" style="padding:2rem;text-align:center">Duel introuvable. <button class="btn-outline" data-navigate="arena">Arena</button></div>'; return; }
      var bothIn = d.order && d.order.every(function (k) { return d.prompts && d.prompts[k] != null; });
      if (d.status === 'playing' && bothIn && meKey === d.order[1]) finalizeDuel(_duelRef, d);
      renderDuelState(main, did, d, meKey);
    });
  }

  function submitPrompt(ref, d, meKey, text) {
    var other = d.order[0] === meKey ? d.order[1] : d.order[0];
    var updates = {};
    updates['prompts/' + meKey] = (text && text.trim()) ? text.trim().slice(0, 1200) : '(pas de reponse a temps)';
    if (d.prompts && d.prompts[other] != null) {
      updates['status'] = 'scoring';
    } else {
      updates['turn'] = other;
      updates['deadline'] = Date.now() + TURN_SECONDS * 1000;
    }
    ref.update(updates);
  }

  function finalizeDuel(ref, d) {
    var k = d.order;
    var s0 = scoreDuel(d.prompts[k[0]]), s1 = scoreDuel(d.prompts[k[1]]);
    var scores = {}; scores[k[0]] = s0; scores[k[1]] = s1;
    var winner = s0 === s1 ? 'draw' : (s0 > s1 ? k[0] : k[1]);
    ref.update({ scores: scores, winner: winner, status: 'done', endedAt: Date.now() });
  }

  function claimResult(ref, d, did, meKey) {
    if (_rewardedLocal[did]) return;
    if (d.claimed && d.claimed[meKey]) { _rewardedLocal[did] = true; return; }
    _rewardedLocal[did] = true;
    var A = window.AIA;
    ref.child('claimed/' + meKey).set(true);
    var won = d.winner === meKey, draw = d.winner === 'draw';
    var pts = won ? WIN_PTS : (draw ? Math.round((WIN_PTS + LOSE_PTS) / 2) : LOSE_PTS);
    var xp = won ? WIN_XP : LOSE_XP;
    A.db.ref('pvp/' + meKey).transaction(function (p) {
      p = p || { wins: 0, losses: 0, points: 0 };
      if (p.duelsDate !== todayISO()) { p.duelsDate = todayISO(); p.duelsToday = 0; }
      p.duelsToday = (p.duelsToday || 0) + 1;
      p.points = (p.points || 0) + pts;
      if (won) p.wins = (p.wins || 0) + 1; else if (!draw) p.losses = (p.losses || 0) + 1;
      return p;
    });
    if (A.addXP) A.addXP(xp, won ? 'Victoire duel de prompts' : 'Duel de prompts');
  }

  function renderDuelState(main, did, d, meKey) {
    var other = d.order[0] === meKey ? d.order[1] : d.order[0];
    var meName = (d.names && d.names[meKey]) || 'Moi';
    var oppName = (d.names && d.names[other]) || 'Adversaire';
    var header = '<div class="page-header"><h1>Duel de <span class="gradient-text">Prompts</span></h1>' +
      '<p class="page-subtitle">' + esc(meName) + ' &nbsp;⚔️&nbsp; ' + esc(oppName) + '</p></div>';
    var briefBox = '<div class="glass-card" style="padding:.8rem 1rem;margin-bottom:1rem;border-left:3px solid var(--gold)"><strong>📋 Brief :</strong> ' + esc(d.brief) + '</div>';

    if (d.status === 'done') {
      claimResult(_duelRef, d, did, meKey);
      var myScore = (d.scores && d.scores[meKey]) || 0, oppScore = (d.scores && d.scores[other]) || 0;
      var won = d.winner === meKey, draw = d.winner === 'draw';
      var verdict = draw ? '🤝 Egalite !' : (won ? '🏆 Victoire !' : '😕 Defaite');
      main.innerHTML = header + briefBox +
        '<div class="glass-card" style="text-align:center;padding:1.5rem">' +
        '<div style="font-size:1.6rem;font-weight:800;margin-bottom:.4rem">' + verdict + '</div>' +
        '<div style="display:flex;justify-content:center;gap:2rem;margin:1rem 0">' +
          '<div><div style="font-size:.8rem;color:var(--text-muted)">' + esc(meName) + ' (toi)</div><div style="font-size:1.8rem;font-weight:800;color:var(--gold)">' + myScore + '</div></div>' +
          '<div style="align-self:center;color:var(--text-muted)">vs</div>' +
          '<div><div style="font-size:.8rem;color:var(--text-muted)">' + esc(oppName) + '</div><div style="font-size:1.8rem;font-weight:800">' + oppScore + '</div></div>' +
        '</div>' +
        '<div style="text-align:left;display:grid;gap:.6rem;margin:1rem 0">' +
          '<div class="glass-card" style="padding:.6rem .8rem"><div style="font-size:.75rem;color:var(--text-muted)">Ton prompt (' + myScore + '/100)</div><div style="white-space:pre-wrap">' + esc((d.prompts && d.prompts[meKey]) || '') + '</div></div>' +
          '<div class="glass-card" style="padding:.6rem .8rem"><div style="font-size:.75rem;color:var(--text-muted)">Prompt de ' + esc(oppName) + ' (' + oppScore + '/100)</div><div style="white-space:pre-wrap">' + esc((d.prompts && d.prompts[other]) || '') + '</div></div>' +
        '</div>' +
        '<button class="btn-primary" id="btn-new-duel">⚔️ Nouveau duel</button> ' +
        '<button class="btn-outline" data-navigate="arena">Retour Arena</button>' +
        '</div>';
      var nb = document.getElementById('btn-new-duel');
      if (nb) nb.addEventListener('click', function () { if (_duelRef) { try { _duelRef.off(); } catch (e) {} _duelRef = null; } renderDuel(main); });
      return;
    }

    var iAlreadySubmitted = d.prompts && d.prompts[meKey] != null;
    if (d.turn === meKey && !iAlreadySubmitted) {
      var secsLeft = Math.max(0, Math.ceil(((d.deadline || 0) - Date.now()) / 1000));
      main.innerHTML = header + briefBox +
        '<div class="glass-card" style="padding:1.2rem">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem">' +
          '<strong>✍️ A toi de jouer !</strong>' +
          '<span id="duel-timer" style="font-size:1.4rem;font-weight:800;color:var(--gold)">' + secsLeft + 's</span>' +
        '</div>' +
        '<textarea id="duel-prompt" rows="6" class="demo-input" style="width:100%" placeholder="Ecris ton meilleur prompt (role + contexte + objectif + format + contraintes)..."></textarea>' +
        '<button class="btn-primary" id="btn-submit-duel" style="margin-top:.6rem">Soumettre mon prompt</button>' +
        '</div>';
      var submitted = false;
      var doSubmit = function () {
        if (submitted) return; submitted = true;
        if (_timer) { clearInterval(_timer); _timer = null; }
        var ta = document.getElementById('duel-prompt');
        submitPrompt(_duelRef, d, meKey, ta ? ta.value : '');
      };
      var sb = document.getElementById('btn-submit-duel');
      if (sb) sb.addEventListener('click', doSubmit);
      var tEl = document.getElementById('duel-timer');
      _timer = setInterval(function () {
        var left = Math.max(0, Math.ceil(((d.deadline || 0) - Date.now()) / 1000));
        if (tEl) { tEl.textContent = left + 's'; if (left <= 5) tEl.style.color = 'var(--red)'; }
        if (left <= 0) { doSubmit(); }
      }, 250);
      return;
    }

    var waitMsg = (d.status === 'scoring' || (iAlreadySubmitted && d.prompts[other] != null)) ? 'Calcul des scores...' : ('En attente du prompt de ' + esc(oppName) + '...');
    var oppSecs = Math.max(0, Math.ceil(((d.deadline || 0) - Date.now()) / 1000));
    main.innerHTML = header + briefBox +
      '<div class="glass-card" style="text-align:center;padding:2rem">' +
      '<div class="loading-pulse" style="font-size:2rem;margin-bottom:.5rem">⏳</div>' +
      '<h3>' + waitMsg + '</h3>' +
      (iAlreadySubmitted ? '<p style="color:var(--green)">✅ Ton prompt est envoye.</p>' : '') +
      (d.turn === other && !(d.prompts && d.prompts[other]) ? '<p style="color:var(--text-muted)">' + esc(oppName) + ' a ' + oppSecs + 's pour repondre.</p>' : '') +
      '</div>';
  }

  window.AIA = window.AIA || {};
  window.AIA.renderDuel = renderDuel;
  window.AIA.stopDuel = stopDuel;
  window.AIA.scoreDuel = scoreDuel;
  window.AIA.DUEL_MAX_PER_DAY = DUEL_MAX_PER_DAY;
})();
