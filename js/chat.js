/* ==============================================
   CHAT.JS — Chat de classe temps reel + TICKETS DE FEEDBACK (fenetre a cote)
   - Chat : un canal classe (/chat).
   - Tickets : l'etudiant cree lui-meme un ticket (BUG / NAVIGATION / IDEE / RESSENTI)
     dans /feedback. Tous les tickets sont REPERTORIES et visibles par toute la classe :
       * statut Ouvert / En cours / Resolu (le formateur fait avancer le statut),
       * upvote "moi aussi" (👍) pour prioriser,
       * filtres par categorie.
     -> aide a ameliorer la navigation, le dev de la plateforme et a regler les bugs.
   IDRAC Business School — [AI-assisted]
   ============================================== */
(function () {
  'use strict';

  function esc(t) { var d = document.createElement('div'); d.textContent = (t == null ? '' : String(t)); return d.innerHTML; }
  function fmtTime(ts) { try { var d = new Date(ts); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); } catch (e) { return ''; } }
  function starStr(n) { n = n || 0; var s = ''; for (var i = 1; i <= 5; i++) s += i <= n ? '★' : '☆'; return s; }

  // Categories de ticket (orientees amelioration de la plateforme)
  var CATS = [
    { id: 'bug', icon: '🐞', label: 'Bug', ph: 'Decris le bug : ou ca arrive, ce qui se passe, comment le reproduire...' },
    { id: 'nav', icon: '🧭', label: 'Navigation', ph: 'Qu\'est-ce qui te gene ou te perd dans la navigation ?' },
    { id: 'idea', icon: '💡', label: 'Idee', ph: 'Ton idee pour ameliorer la plateforme...' },
    { id: 'feel', icon: '🙂', label: 'Ressenti', ph: 'Ton ressenti sur la session / le rythme...' }
  ];
  function catOf(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i]; return CATS[3]; }
  var STATUS = {
    open:     { l: 'Ouvert',  bg: 'rgba(255,255,255,0.12)' },
    progress: { l: 'En cours', bg: 'rgba(245,183,49,0.28)' },
    done:     { l: 'Resolu',  bg: 'rgba(46,204,113,0.28)' }
  };
  function nextStatus(s) { return s === 'open' ? 'progress' : (s === 'progress' ? 'done' : 'open'); }

  var _listener = null, _fbListener = null, _lastSend = 0, _lastFb = 0;
  var _fbData = [], _fbFilter = 'all', _formCat = 'bug', _formStars = 0;

  function stopChat() {
    var A = window.AIA;
    if (A && A.db) {
      if (_listener) { try { A.db.ref('chat').off('value', _listener); } catch (e) {} }
      if (_fbListener) { try { A.db.ref('feedback').off('value', _fbListener); } catch (e) {} }
    }
    _listener = null; _fbListener = null;
  }

  function renderClassChat(main) {
    var AIA = window.AIA, st = AIA.getState();
    main = main || document.getElementById('main-content');
    var isAdmin = !!(st.user && st.user.isAdmin);
    var meKey = (st.user && st.user.accountKey) || (isAdmin ? '__formateur' : '__me');
    var meName = (st.user && st.user.name) || (isAdmin ? 'Formateur' : 'Moi');

    main.innerHTML = '<div class="page-header"><h1>Chat <span class="gradient-text">de classe</span></h1>' +
      '<p class="page-subtitle">Discussion temps reel + tickets de feedback (bugs, navigation, idees)</p></div>' +
      '<div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:stretch">' +
        // ----- Colonne CHAT -----
        '<div class="chat-wrap glass-card" style="flex:2 1 380px;display:flex;flex-direction:column;height:62vh;max-height:640px;overflow:hidden;padding:0">' +
          '<div style="padding:.55rem .9rem;border-bottom:1px solid var(--border-glass);font-weight:700">💬 Chat classe</div>' +
          '<div id="chat-messages" style="flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.45rem"><div class="loading-pulse" style="text-align:center;padding:2rem">Chargement...</div></div>' +
          '<div style="display:flex;gap:.5rem;padding:.7rem;border-top:1px solid var(--border-glass)">' +
            '<input id="chat-input" class="demo-input" style="flex:1" maxlength="300" placeholder="Ecris un message a la classe...">' +
            '<button class="btn-primary" id="chat-send">Envoyer</button>' +
          '</div>' +
        '</div>' +
        // ----- Colonne TICKETS -----
        '<div class="glass-card" style="flex:1 1 300px;display:flex;flex-direction:column;height:62vh;max-height:640px;overflow:hidden;padding:0">' +
          '<div style="padding:.55rem .9rem;border-bottom:1px solid var(--border-glass)"><strong>🎫 Tickets &amp; bugs</strong>' +
            '<div style="font-size:.7rem;color:var(--text-muted)">Repertories &amp; visibles par toute la classe</div></div>' +
          '<div id="fb-body" style="flex:1;overflow-y:auto;padding:.8rem"></div>' +
        '</div>' +
      '</div>';

    var box = document.getElementById('chat-messages');
    if (!AIA.db) { box.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem">Chat indisponible (hors-ligne).</p>'; return; }

    stopChat();
    _listener = AIA.db.ref('chat').limitToLast(120).on('value', function (snap) {
      var msgs = snap.val() || {};
      var arr = Object.keys(msgs).map(function (id) { return msgs[id]; }).sort(function (a, b) { return (a.ts || 0) - (b.ts || 0); });
      if (!arr.length) { box.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem">Aucun message. Lance la conversation ! 👋</p>'; return; }
      box.innerHTML = arr.map(function (m) {
        var mine = m.key === meKey, adminMsg = !!m.admin;
        var align = mine ? 'flex-end' : 'flex-start';
        var bg = adminMsg ? 'rgba(167,31,40,0.18)' : (mine ? 'rgba(245,183,49,0.14)' : 'rgba(255,255,255,0.05)');
        var nameTag = adminMsg ? ('👨‍🏫 ' + esc(m.name || 'Formateur')) : esc(m.name || 'Etudiant');
        return '<div style="align-self:' + align + ';max-width:82%">' +
          '<div style="font-size:.68rem;color:var(--text-muted);margin-bottom:.1rem;text-align:' + (mine ? 'right' : 'left') + '">' + nameTag + ' &bull; ' + fmtTime(m.ts) + '</div>' +
          '<div style="background:' + bg + ';border:1px solid var(--border-glass);border-radius:12px;padding:.4rem .7rem;font-size:.9rem;white-space:pre-wrap;word-break:break-word">' + esc(m.text) + '</div>' +
        '</div>';
      }).join('');
      box.scrollTop = box.scrollHeight;
    });

    function send() {
      var inp = document.getElementById('chat-input'); if (!inp) return;
      var txt = (inp.value || '').trim(); if (!txt) return;
      var now = Date.now();
      if (now - _lastSend < 700) { if (AIA.showToast) AIA.showToast('Doucement 🙂', 'warning'); return; }
      _lastSend = now;
      AIA.db.ref('chat').push({ key: meKey, name: meName, text: txt.slice(0, 300), ts: now, admin: isAdmin }, function () { inp.value = ''; inp.focus(); });
    }
    var sb = document.getElementById('chat-send'); if (sb) sb.addEventListener('click', send);
    var ci = document.getElementById('chat-input'); if (ci) ci.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });

    renderTickets(isAdmin, meKey, meName);
  }

  /* ---------- TICKETS DE FEEDBACK (repertories, visibles par tous) ---------- */
  function renderTickets(isAdmin, meKey, meName) {
    var AIA = window.AIA, body = document.getElementById('fb-body'); if (!body || !AIA.db) return;
    var canCreate = meKey && meKey.indexOf('__') !== 0; // etudiant inscrit (a une accountKey)
    _formCat = 'bug'; _formStars = 0; _fbFilter = 'all';

    var formHtml = canCreate ? (
      '<div style="font-size:.8rem;font-weight:700;margin-bottom:.35rem">➕ Nouveau ticket</div>' +
      '<div id="tk-cats" style="display:flex;gap:.3rem;flex-wrap:wrap;margin-bottom:.45rem">' +
        CATS.map(function (x) { return '<span class="tk-cat btn-outline btn-xs' + (x.id === _formCat ? ' btn-primary' : '') + '" data-c="' + x.id + '" style="cursor:pointer">' + x.icon + ' ' + x.label + '</span>'; }).join('') +
      '</div>' +
      '<textarea id="tk-text" rows="3" class="demo-input" style="width:100%" maxlength="400" placeholder="' + esc(catOf(_formCat).ph) + '"></textarea>' +
      '<div id="tk-stars" style="font-size:1.4rem;margin:.3rem 0">' +
        [1, 2, 3, 4, 5].map(function (s) { return '<span class="tk-star" data-s="' + s + '" style="cursor:pointer;color:rgba(255,255,255,0.35)">★</span>'; }).join('') +
        ' <span style="font-size:.64rem;color:var(--text-muted)">(note optionnelle)</span></div>' +
      '<button class="btn-primary" id="tk-send" style="width:100%">Creer le ticket</button>' +
      '<div id="tk-msg" style="font-size:.78rem;margin-top:.3rem"></div>'
    ) : (
      '<div style="font-size:.78rem;color:var(--text-muted);margin-bottom:.4rem">' +
        (isAdmin ? '👨‍🏫 Gestion : clique le badge de statut pour le faire avancer (Ouvert → En cours → Resolu).' : 'Connecte-toi avec ton compte pour creer un ticket.') +
      '</div>'
    );

    body.innerHTML = formHtml +
      '<div style="border-top:1px solid var(--border-glass);margin:.6rem 0 .5rem"></div>' +
      '<div style="font-size:.8rem;font-weight:700;margin-bottom:.4rem">📋 Tickets repertories</div>' +
      '<div id="tk-filters" style="display:flex;gap:.3rem;flex-wrap:wrap;margin-bottom:.5rem"></div>' +
      '<div id="tk-list"><div class="loading-pulse" style="text-align:center;padding:1rem">Chargement...</div></div>';

    if (canCreate) wireTicketForm(meKey, meName);

    _fbListener = AIA.db.ref('feedback').limitToLast(150).on('value', function (snap) {
      var o = snap.val() || {};
      _fbData = Object.keys(o).map(function (k) { var t = o[k]; if (t && typeof t === 'object') { t._id = k; return t; } return null; }).filter(Boolean).sort(function (a, b) {
        var sa = a.status === 'done' ? 1 : 0, sb = b.status === 'done' ? 1 : 0;     // non resolus d'abord
        if (sa !== sb) return sa - sb;
        var va = a.votes ? Object.keys(a.votes).length : 0, vb = b.votes ? Object.keys(b.votes).length : 0;
        if (vb !== va) return vb - va;                                              // plus de votes d'abord
        return (b.ts || 0) - (a.ts || 0);                                           // puis recents
      });
      paintTicketList(isAdmin, meKey);
    });
  }

  function wireTicketForm(meKey, meName) {
    var catsEl = document.getElementById('tk-cats'), starsEl = document.getElementById('tk-stars');
    if (catsEl) catsEl.querySelectorAll('.tk-cat').forEach(function (el) {
      el.addEventListener('click', function () {
        _formCat = this.getAttribute('data-c');
        catsEl.querySelectorAll('.tk-cat').forEach(function (x) { x.classList.toggle('btn-primary', x.getAttribute('data-c') === _formCat); });
        var ta = document.getElementById('tk-text'); if (ta) ta.placeholder = catOf(_formCat).ph;
      });
    });
    if (starsEl) starsEl.querySelectorAll('.tk-star').forEach(function (el) {
      el.addEventListener('click', function () {
        _formStars = parseInt(this.getAttribute('data-s'), 10);
        starsEl.querySelectorAll('.tk-star').forEach(function (x) { x.style.color = parseInt(x.getAttribute('data-s'), 10) <= _formStars ? '#F5B731' : 'rgba(255,255,255,0.35)'; });
      });
    });
    var sendBtn = document.getElementById('tk-send');
    if (sendBtn) sendBtn.addEventListener('click', function () {
      var ta = document.getElementById('tk-text'), msg = document.getElementById('tk-msg');
      var txt = ((ta && ta.value) || '').trim();
      if (!txt) { if (msg) msg.innerHTML = '<span style="color:var(--red)">Decris ton ticket.</span>'; return; }
      var now = Date.now();
      if (now - _lastFb < 1500) { if (msg) msg.innerHTML = '<span style="color:var(--text-muted)">Patiente un instant...</span>'; return; }
      _lastFb = now;
      window.AIA.db.ref('feedback').push({ key: meKey, name: meName, category: _formCat, rating: _formStars || 0, text: txt.slice(0, 400), ts: now, status: 'open' }, function (err) {
        if (err) { if (msg) msg.innerHTML = '<span style="color:var(--red)">Echec d\'envoi.</span>'; return; }
        if (ta) ta.value = '';
        _formStars = 0; if (starsEl) starsEl.querySelectorAll('.tk-star').forEach(function (x) { x.style.color = 'rgba(255,255,255,0.35)'; });
        if (msg) msg.innerHTML = '<span style="color:var(--green)">✅ Ticket cree ! Il est maintenant repertorie ci-dessous.</span>';
      });
    });
  }

  function paintTicketList(isAdmin, meKey) {
    var fEl = document.getElementById('tk-filters'), listEl = document.getElementById('tk-list');
    if (!listEl) return;
    var counts = { bug: 0, nav: 0, idea: 0, feel: 0 };
    _fbData.forEach(function (t) { var c = t.category || 'feel'; if (counts[c] != null) counts[c]++; });
    if (fEl) {
      fEl.innerHTML = '<span class="tk-filter btn-outline btn-xs' + (_fbFilter === 'all' ? ' btn-primary' : '') + '" data-f="all" style="cursor:pointer">Tout (' + _fbData.length + ')</span>' +
        CATS.map(function (c) { return '<span class="tk-filter btn-outline btn-xs' + (_fbFilter === c.id ? ' btn-primary' : '') + '" data-f="' + c.id + '" style="cursor:pointer">' + c.icon + ' ' + counts[c.id] + '</span>'; }).join('');
      fEl.querySelectorAll('.tk-filter').forEach(function (el) { el.addEventListener('click', function () { _fbFilter = this.getAttribute('data-f'); paintTicketList(isAdmin, meKey); }); });
    }
    var list = _fbData.filter(function (t) { return _fbFilter === 'all' || (t.category || 'feel') === _fbFilter; });
    listEl.innerHTML = list.length ? list.map(function (t) { return ticketCard(t, isAdmin, meKey); }).join('') :
      '<p style="text-align:center;color:var(--text-muted);padding:1rem">Aucun ticket ici. Sois le premier a en creer un ! 🎫</p>';

    listEl.querySelectorAll('.tk-vote').forEach(function (el) {
      el.addEventListener('click', function () { toggleVote(this.getAttribute('data-id'), meKey, this.getAttribute('data-voted') === '1'); });
    });
    listEl.querySelectorAll('.tk-status').forEach(function (el) {
      el.addEventListener('click', function () { window.AIA.db.ref('feedback/' + this.getAttribute('data-id') + '/status').set(nextStatus(this.getAttribute('data-st'))); });
    });
  }

  function ticketCard(t, isAdmin, meKey) {
    var c = catOf(t.category), st = t.status || 'open', sti = STATUS[st] || STATUS.open;
    var votes = t.votes ? Object.keys(t.votes).length : 0;
    var iVoted = !!(t.votes && meKey && t.votes[meKey]);
    var canVote = meKey && meKey.indexOf('__') !== 0;
    var statusBadge = isAdmin
      ? '<span class="tk-status" data-id="' + t._id + '" data-st="' + st + '" style="cursor:pointer;font-size:.62rem;padding:.05rem .4rem;border-radius:5px;background:' + sti.bg + '" title="Cliquer pour faire avancer">' + sti.l + ' ⟳</span>'
      : '<span style="font-size:.62rem;padding:.05rem .4rem;border-radius:5px;background:' + sti.bg + '">' + sti.l + '</span>';
    var voteBtn = canVote
      ? '<span class="tk-vote" data-id="' + t._id + '" data-voted="' + (iVoted ? 1 : 0) + '" style="cursor:pointer;font-size:.72rem;' + (iVoted ? 'color:#F5B731;font-weight:700' : 'color:var(--text-muted)') + '" title="Moi aussi">👍 ' + votes + '</span>'
      : '<span style="font-size:.72rem;color:var(--text-muted)">👍 ' + votes + '</span>';
    return '<div class="glass-card" style="padding:.45rem .6rem;margin-bottom:.4rem' + (st === 'done' ? ';opacity:.65' : '') + '">' +
      '<div style="display:flex;justify-content:space-between;gap:.4rem;align-items:center;font-size:.66rem;color:var(--text-muted);margin-bottom:.1rem">' +
        '<span>' + c.icon + ' <strong>' + c.label + '</strong></span>' + statusBadge + '</div>' +
      '<div style="font-size:.86rem;white-space:pre-wrap;word-break:break-word;margin:.1rem 0">' + esc(t.text || '') + '</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;font-size:.66rem;color:var(--text-muted)">' +
        '<span>' + esc(t.name || 'Etudiant') + (t.rating ? ' &bull; <span style="color:#F5B731">' + starStr(t.rating) + '</span>' : '') + ' &bull; ' + fmtTime(t.ts) + '</span>' + voteBtn + '</div>' +
    '</div>';
  }

  function toggleVote(id, meKey, voted) {
    if (!id || !meKey) return;
    var ref = window.AIA.db.ref('feedback/' + id + '/votes/' + meKey);
    if (voted) ref.remove(); else ref.set(true);
  }

  window.AIA = window.AIA || {};
  window.AIA.renderClassChat = renderClassChat;
  window.AIA.stopChat = stopChat;
})();
