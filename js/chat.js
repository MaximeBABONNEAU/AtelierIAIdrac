/* ==============================================
   CHAT.JS — Chat de classe temps reel (Firebase /chat)
   Page dediee : tous les etudiants + formateur, un seul canal.
   IDRAC Business School — [AI-assisted]
   ============================================== */
(function () {
  'use strict';

  function esc(t) { var d = document.createElement('div'); d.textContent = (t == null ? '' : String(t)); return d.innerHTML; }
  function fmtTime(ts) { try { var d = new Date(ts); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); } catch (e) { return ''; } }

  var _listener = null, _lastSend = 0;

  function stopChat() {
    if (_listener && window.AIA && window.AIA.db) { try { window.AIA.db.ref('chat').off('value', _listener); } catch (e) {} }
    _listener = null;
  }

  function renderClassChat(main) {
    var AIA = window.AIA, st = AIA.getState();
    main = main || document.getElementById('main-content');
    main.innerHTML = '<div class="page-header"><h1>Chat <span class="gradient-text">de classe</span></h1>' +
      '<p class="page-subtitle">Discussion en temps reel avec la classe et le formateur</p></div>' +
      '<div class="chat-wrap glass-card" style="display:flex;flex-direction:column;height:62vh;max-height:640px;overflow:hidden;padding:0">' +
        '<div id="chat-messages" style="flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.45rem"><div class="loading-pulse" style="text-align:center;padding:2rem">Chargement du chat...</div></div>' +
        '<div style="display:flex;gap:.5rem;padding:.7rem;border-top:1px solid var(--border-glass)">' +
          '<input id="chat-input" class="demo-input" style="flex:1" maxlength="300" placeholder="Ecris un message a la classe...">' +
          '<button class="btn-primary" id="chat-send">Envoyer</button>' +
        '</div>' +
      '</div>';

    var box = document.getElementById('chat-messages');
    if (!AIA.db) { box.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem">Chat indisponible (hors-ligne).</p>'; return; }

    var isAdmin = !!(st.user && st.user.isAdmin);
    var meKey = (st.user && st.user.accountKey) || (isAdmin ? '__formateur' : '__me');
    var meName = (st.user && st.user.name) || (isAdmin ? 'Formateur' : 'Moi');

    stopChat();
    _listener = AIA.db.ref('chat').limitToLast(120).on('value', function (snap) {
      var msgs = snap.val() || {};
      var arr = Object.keys(msgs).map(function (id) { return msgs[id]; }).sort(function (a, b) { return (a.ts || 0) - (b.ts || 0); });
      if (!arr.length) { box.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem">Aucun message. Lance la conversation ! 👋</p>'; return; }
      box.innerHTML = arr.map(function (m) {
        var mine = m.key === meKey;
        var adminMsg = !!m.admin;
        var align = mine ? 'flex-end' : 'flex-start';
        var bg = adminMsg ? 'rgba(167,31,40,0.18)' : (mine ? 'rgba(245,183,49,0.14)' : 'rgba(255,255,255,0.05)');
        var nameTag = adminMsg ? ('👨‍🏫 ' + esc(m.name || 'Formateur')) : esc(m.name || 'Etudiant');
        return '<div style="align-self:' + align + ';max-width:80%">' +
          '<div style="font-size:.68rem;color:var(--text-muted);margin-bottom:.1rem;text-align:' + (mine ? 'right' : 'left') + '">' + nameTag + ' &bull; ' + fmtTime(m.ts) + '</div>' +
          '<div style="background:' + bg + ';border:1px solid var(--border-glass);border-radius:12px;padding:.4rem .7rem;font-size:.9rem;white-space:pre-wrap;word-break:break-word">' + esc(m.text) + '</div>' +
        '</div>';
      }).join('');
      box.scrollTop = box.scrollHeight;
    });

    function send() {
      var inp = document.getElementById('chat-input'); if (!inp) return;
      var txt = (inp.value || '').trim();
      if (!txt) return;
      var now = Date.now();
      if (now - _lastSend < 700) { if (AIA.showToast) AIA.showToast('Doucement 🙂', 'warning'); return; } // anti-spam
      _lastSend = now;
      AIA.db.ref('chat').push({ key: meKey, name: meName, text: txt.slice(0, 300), ts: now, admin: isAdmin }, function () { inp.value = ''; inp.focus(); });
    }
    var sb = document.getElementById('chat-send'); if (sb) sb.addEventListener('click', send);
    var ci = document.getElementById('chat-input'); if (ci) ci.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
  }

  window.AIA = window.AIA || {};
  window.AIA.renderClassChat = renderClassChat;
  window.AIA.stopChat = stopChat;
})();
