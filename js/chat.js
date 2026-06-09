/* ==============================================
   CHAT.JS — Chat de classe temps reel + panneau FEEDBACK (fenetre a cote)
   - Chat : un canal classe (/chat).
   - Feedback : l'etudiant signale un BUG, un souci de NAVIGATION, une IDEE
     d'amelioration ou son RESSENTI (/feedback) -> aide a faire evoluer la plateforme.
     Le formateur voit les retours categorises + filtrables en direct.
   IDRAC Business School — [AI-assisted]
   ============================================== */
(function () {
  'use strict';

  function esc(t) { var d = document.createElement('div'); d.textContent = (t == null ? '' : String(t)); return d.innerHTML; }
  function fmtTime(ts) { try { var d = new Date(ts); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); } catch (e) { return ''; } }
  function starStr(n) { n = n || 0; var s = ''; for (var i = 1; i <= 5; i++) s += i <= n ? '★' : '☆'; return s; }

  // Categories de feedback (orientees amelioration de la plateforme)
  var CATS = [
    { id: 'bug', icon: '🐞', label: 'Bug', ph: 'Decris le bug : ou ca arrive, ce qui se passe, comment le reproduire...' },
    { id: 'nav', icon: '🧭', label: 'Navigation', ph: 'Qu\'est-ce qui te gene ou te perd dans la navigation ?' },
    { id: 'idea', icon: '💡', label: 'Idee', ph: 'Ton idee pour ameliorer la plateforme...' },
    { id: 'feel', icon: '🙂', label: 'Ressenti', ph: 'Ton ressenti sur la session / le rythme...' }
  ];
  function catOf(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i]; return CATS[3]; }

  var _listener = null, _fbListener = null, _lastSend = 0, _lastFb = 0, _fbData = [], _fbFilter = 'all';

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
      '<p class="page-subtitle">Discussion temps reel + boite a feedback (bugs, navigation, idees)</p></div>' +
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
        // ----- Colonne FEEDBACK -----
        '<div class="glass-card" style="flex:1 1 290px;display:flex;flex-direction:column;height:62vh;max-height:640px;overflow:hidden;padding:0">' +
          '<div style="padding:.55rem .9rem;border-bottom:1px solid var(--border-glass)"><strong>🛠️ Feedback &amp; bugs</strong>' +
            '<div style="font-size:.7rem;color:var(--text-muted)">' + (isAdmin ? 'Retours de la classe en direct (categorises)' : 'Aide a ameliorer la plateforme — lu par l\'equipe') + '</div></div>' +
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

    renderFeedback(isAdmin, meKey, meName);
  }

  /* ---------- FEEDBACK ---------- */
  function renderFeedback(isAdmin, meKey, meName) {
    var AIA = window.AIA, body = document.getElementById('fb-body'); if (!body || !AIA.db) return;

    if (isAdmin) { _fbFilter = 'all'; renderAdminFeedback(body); return; }
    renderStudentFeedback(body, meKey, meName);
  }

  // --- Formateur : flux categorise + filtre ---
  function renderAdminFeedback(body) {
    var AIA = window.AIA;
    _fbListener = AIA.db.ref('feedback').limitToLast(120).on('value', function (snap) {
      var o = snap.val() || {};
      _fbData = Object.keys(o).map(function (k) { return o[k]; }).filter(Boolean).sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
      paintAdmin(body);
    });
  }
  function paintAdmin(body) {
    var counts = { bug: 0, nav: 0, idea: 0, feel: 0 };
    _fbData.forEach(function (f) { var c = f.category || 'feel'; if (counts[c] != null) counts[c]++; });
    var chips = '<div style="display:flex;gap:.3rem;flex-wrap:wrap;margin-bottom:.6rem">' +
      '<span class="fb-filter btn-outline btn-xs' + (_fbFilter === 'all' ? ' btn-primary' : '') + '" data-f="all" style="cursor:pointer">Tout (' + _fbData.length + ')</span>' +
      CATS.map(function (c) { return '<span class="fb-filter btn-outline btn-xs' + (_fbFilter === c.id ? ' btn-primary' : '') + '" data-f="' + c.id + '" style="cursor:pointer">' + c.icon + ' ' + counts[c.id] + '</span>'; }).join('') +
      '</div>';
    var list = _fbData.filter(function (f) { return _fbFilter === 'all' || (f.category || 'feel') === _fbFilter; });
    var rows = list.length ? list.map(function (f) {
      var c = catOf(f.category);
      return '<div class="glass-card" style="padding:.4rem .6rem;margin-bottom:.4rem">' +
        '<div style="font-size:.7rem;color:var(--text-muted)">' + c.icon + ' <strong>' + c.label + '</strong> &bull; ' + esc(f.name || 'Etudiant') + (f.rating ? ' &bull; <span style="color:#F5B731">' + starStr(f.rating) + '</span>' : '') + ' &bull; ' + fmtTime(f.ts) + '</div>' +
        (f.text ? '<div style="font-size:.86rem;white-space:pre-wrap;word-break:break-word">' + esc(f.text) + '</div>' : '') +
      '</div>';
    }).join('') : '<p style="text-align:center;color:var(--text-muted);padding:1.2rem">Aucun retour dans cette categorie.</p>';
    body.innerHTML = chips + rows;
    body.querySelectorAll('.fb-filter').forEach(function (el) {
      el.addEventListener('click', function () { _fbFilter = this.getAttribute('data-f'); paintAdmin(body); });
    });
  }

  // --- Etudiant : formulaire categorise ---
  function renderStudentFeedback(body, meKey, meName) {
    var AIA = window.AIA, cat = 'bug', stars = 0;
    function paint() {
      var c = catOf(cat);
      body.innerHTML = '<div style="font-size:.82rem;margin-bottom:.4rem">Aide-nous a ameliorer la plateforme 🚀</div>' +
        '<div style="display:flex;gap:.3rem;flex-wrap:wrap;margin-bottom:.6rem">' +
          CATS.map(function (x) { return '<span class="fb-cat btn-outline btn-xs' + (x.id === cat ? ' btn-primary' : '') + '" data-c="' + x.id + '" style="cursor:pointer">' + x.icon + ' ' + x.label + '</span>'; }).join('') +
        '</div>' +
        '<textarea id="fb-text" rows="4" class="demo-input" style="width:100%" maxlength="400" placeholder="' + esc(c.ph) + '"></textarea>' +
        '<div style="font-size:.72rem;color:var(--text-muted);margin:.5rem 0 .2rem">Note (optionnel) :</div>' +
        '<div id="fb-stars" style="font-size:1.7rem;letter-spacing:.08rem;margin-bottom:.4rem">' +
          [1, 2, 3, 4, 5].map(function (s) { return '<span class="fb-star" data-s="' + s + '" style="cursor:pointer;color:' + (s <= stars ? '#F5B731' : 'rgba(255,255,255,0.35)') + '">★</span>'; }).join('') +
        '</div>' +
        '<button class="btn-primary" id="fb-send" style="width:100%">Envoyer</button>' +
        '<div id="fb-msg" style="font-size:.8rem;margin-top:.4rem"></div>';

      body.querySelectorAll('.fb-cat').forEach(function (el) { el.addEventListener('click', function () { cat = this.getAttribute('data-c'); paint(); }); });
      document.getElementById('fb-stars').querySelectorAll('.fb-star').forEach(function (el) { el.addEventListener('click', function () { stars = parseInt(this.getAttribute('data-s'), 10); paint(); }); });
      var sendBtn = document.getElementById('fb-send');
      if (sendBtn) sendBtn.addEventListener('click', function () {
        var txt = (document.getElementById('fb-text').value || '').trim();
        if (!txt && !stars) { document.getElementById('fb-msg').innerHTML = '<span style="color:var(--red)">Decris le souci ou mets une note.</span>'; return; }
        var now = Date.now();
        if (now - _lastFb < 1500) { document.getElementById('fb-msg').innerHTML = '<span style="color:var(--text-muted)">Patiente un instant...</span>'; return; }
        _lastFb = now;
        AIA.db.ref('feedback').push({ key: meKey, name: meName, category: cat, rating: stars || 0, text: txt.slice(0, 400), ts: now }, function (err) {
          var m = document.getElementById('fb-msg');
          if (err) { if (m) m.innerHTML = '<span style="color:var(--red)">Echec d\'envoi.</span>'; return; }
          stars = 0; paint();
          var m2 = document.getElementById('fb-msg'); if (m2) m2.innerHTML = '<span style="color:var(--green)">✅ Merci ! Ton retour aide a ameliorer la plateforme.</span>';
        });
      });
    }
    paint();
  }

  window.AIA = window.AIA || {};
  window.AIA.renderClassChat = renderClassChat;
  window.AIA.stopChat = stopChat;
})();
