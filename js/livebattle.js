/* ==============================================
   LIVEBATTLE.JS — Live Battle "Son & Image" (moment cle de la journee)
   - Upload PREEMPTIF (a tout moment) vers Firebase Storage : Image+Jingle OU Video MP4.
   - Le formateur lance le LIVE "presentation pour tous" : rotation auto, avatar au tableau,
     image+jingle OU lecteur video en grand.
   - VOTE en direct : popup ETOILES 1-5 (modifiable) sur l'ecran de chaque etudiant.
   - Classement final par MOYENNE d'etoiles.
   Firebase RTDB : /livebattle_content/<key>, /livebattle/current, /livebattle/<id>/{meta,content,ratings}
   Firebase Storage : livebattle/<key>/<kind>_<ts>.<ext>
   IDRAC Business School — [AI-assisted]
   ============================================== */
(function () {
  'use strict';

  function esc(t) { var d = document.createElement('div'); d.textContent = (t == null ? '' : String(t)); return d.innerHTML; }
  function fmtSize(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + ' Mo' : Math.round(b / 1024) + ' Ko'; }
  function me() { var st = window.AIA.getState(); return st.user || {}; }
  function isAdmin() { return !!(me().isAdmin); }

  var PER_SECS = 25, IMG_MAX_PX = 1400, IMG_QUALITY = 0.85;
  var AUDIO_MAX = 15 * 1048576, VIDEO_MAX = 55 * 1048576;

  var IMG_TOOLS = [
    { label: 'FLUX (HuggingFace)', url: 'https://black-forest-labs-flux-1-schnell.hf.space', a: 'account' },
    { label: 'Ideogram', url: 'https://ideogram.ai/', a: 'account' },
    { label: 'Leonardo.ai', url: 'https://leonardo.ai/', a: 'account' },
    { label: 'Microsoft Designer', url: 'https://designer.microsoft.com/', a: 'account' }
  ];
  var SND_TOOLS = [
    { label: 'Suno', url: 'https://suno.com/', a: 'account' },
    { label: 'Udio', url: 'https://www.udio.com/', a: 'account' },
    { label: 'Mubert', url: 'https://mubert.com/', a: 'account' },
    { label: 'ElevenLabs', url: 'https://elevenlabs.io/', a: 'trial' }
  ];
  var VID_TOOLS = [
    { label: 'HeyGen (avatar)', url: 'https://www.heygen.com/', a: 'trial' },
    { label: 'ElevenLabs (voix)', url: 'https://elevenlabs.io/', a: 'trial' },
    { label: 'Kling', url: 'https://klingai.com/', a: 'account' },
    { label: 'CapCut', url: 'https://www.capcut.com/', a: 'account' }
  ];
  function toolBtns(list) {
    var badge = { free: '🆓', account: '🔑', trial: '🎁' };
    return list.map(function (t) { return '<a class="btn-outline btn-xs ia-tool-link" href="' + t.url + '" target="_blank" rel="noopener">' + esc(t.label) + ' ' + (badge[t.a] || '') + ' ↗</a>'; }).join(' ');
  }

  /* ---------- Storage upload ---------- */
  function ext(file) { var n = file.name || ''; var i = n.lastIndexOf('.'); return i > -1 ? n.slice(i + 1).toLowerCase() : 'bin'; }
  function uploadFile(file, key, kind, onProgress, cb) {
    var A = window.AIA;
    if (!A.storage) { cb('Storage indisponible'); return; }
    var ref = A.storage.ref('livebattle/' + key + '/' + kind + '_' + Date.now() + '.' + ext(file));
    var task = ref.put(file, { contentType: file.type });
    task.on('state_changed', function (s) { if (onProgress) onProgress(Math.round(s.bytesTransferred * 100 / s.totalBytes)); },
      function (err) { cb(String(err && err.code || err)); },
      function () { ref.getDownloadURL().then(function (url) { cb(null, url); }).catch(function (e) { cb(String(e)); }); });
  }
  function compressImage(file, cb) {
    var r = new FileReader();
    r.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        var s = Math.min(1, IMG_MAX_PX / Math.max(img.width, img.height));
        var cw = Math.round(img.width * s), ch = Math.round(img.height * s);
        var c = document.createElement('canvas'); c.width = cw; c.height = ch;
        c.getContext('2d').drawImage(img, 0, 0, cw, ch);
        c.toBlob(function (blob) { cb(blob ? new File([blob], 'image.jpg', { type: 'image/jpeg' }) : file); }, 'image/jpeg', IMG_QUALITY);
      };
      img.onerror = function () { cb(file); };
      img.src = e.target.result;
    };
    r.readAsDataURL(file);
  }

  /* ---------- ETAT ---------- */
  var _curRef = null, _battleRef = null, _ticker = null, _curIdx = -1, _rewardClaimed = {};
  function stopLive() {
    var A = window.AIA;
    try { if (_curRef && A.db) A.db.ref('livebattle/current').off('value', _curRef); } catch (e) {}
    try { if (_battleRef) _battleRef.off(); } catch (e) {}
    if (_ticker) { clearInterval(_ticker); _ticker = null; }
    _curRef = null; _battleRef = null; _curIdx = -1;
  }

  function renderLiveBattle(main) {
    var A = window.AIA;
    main = main || document.getElementById('main-content');
    stopLive();
    if (!A.db) { main.innerHTML = '<div class="page-header"><h1>Live <span class="gradient-text">Battle</span></h1></div><div class="glass-card" style="padding:2rem;text-align:center">Indisponible hors-ligne.</div>'; return; }
    _curRef = A.db.ref('livebattle/current').on('value', function (snap) {
      var id = snap.val();
      if (id) subscribeBattle(main, id); else renderPrep(main);
    });
  }

  /* ---------- abonnement au live actif ---------- */
  function subscribeBattle(main, id) {
    var A = window.AIA;
    if (_battleRef) { try { _battleRef.off(); } catch (e) {} }
    _battleRef = A.db.ref('livebattle/' + id);
    _curIdx = -1; _stageKey = null; _stageOrderLen = 0;
    _battleRef.on('value', function (snap) {
      var b = snap.val() || {}; var meta = b.meta || {};
      if (meta.phase === 'results') { if (_ticker) { clearInterval(_ticker); _ticker = null; } renderResults(main, id, b); }
      else if (meta.phase === 'live') runStage(main, id, b);
      else renderPrep(main);
    });
  }

  /* ====================================================
     PHASE PREP — "Ma soumission Live" (preemptif, persistant)
     ==================================================== */
  // Theme du jour : J2 = slogan voix + avatar video ; J3 = son + image ; sinon generique.
  function seminarDay() {
    try {
      var dates = (window.AIA.CONFIG && window.AIA.CONFIG.dates) || [];
      var today = new Date().toISOString().split('T')[0];
      var i = dates.indexOf(today);
      if (i >= 0) return i + 1;
      if (dates.length && today > dates[dates.length - 1]) return 4;
      return 0;
    } catch (e) { return 0; }
  }
  var BATTLE_THEMES = {
    2: { title: 'Slogan : Voix & Avatar', consigne: 'Donne vie a ton slogan : une VOIX IA (ElevenLabs) + un AVATAR VIDEO anime (HeyGen) qui le declame. Rends une video MP4.', prefer: 'video' },
    3: { title: 'Son & Image', consigne: 'Associe une IMAGE de marque a un JINGLE qui la represente (ou rends une video).', prefer: 'media' }
  };
  function currentTheme() {
    return BATTLE_THEMES[seminarDay()] || { title: 'Son & Image', consigne: 'Associe une image de marque a un jingle, ou rends une video MP4. La classe vote en direct.', prefer: 'media' };
  }

  function renderPrep(main) {
    var A = window.AIA, u = me();
    A.db.ref('livebattle_content').once('value', function (snap) {
      var all = snap.val() || {}; var count = Object.keys(all).length; var mine = all[u.accountKey];
      var adminBar = isAdmin() ? '<div class="glass-card" style="padding:.9rem 1.1rem;margin-bottom:1rem;display:flex;gap:.6rem;flex-wrap:wrap;align-items:center">' +
        '<strong>👨‍🏫 Formateur</strong><span>' + count + ' soumission(s) prete(s)</span>' +
        '<button class="btn-primary btn-sm" id="lb-launch" style="margin-left:auto">🚀 Lancer le Live (presentation pour tous)</button></div>' : '';

      var form = u.accountKey ? (
        '<div class="glass-card" style="padding:1.2rem">' +
        '<h3 style="margin-top:0">🎨 Ma soumission</h3>' +
        (mine ? '<div style="color:var(--green);margin-bottom:.6rem">✅ Soumission enregistree (' + (mine.type === 'video' ? 'Video' : 'Image + Jingle') + '). Tu peux la remplacer ci-dessous.</div>' : '<div style="color:var(--text-muted);margin-bottom:.6rem">Prepare ton contenu en avance — tu pourras le modifier jusqu\'au lancement.</div>') +
        '<div style="display:flex;gap:.5rem;margin-bottom:1rem">' +
          '<button class="btn-outline btn-sm lb-type" data-type="media">🖼️+🔊 Image + Jingle</button>' +
          '<button class="btn-outline btn-sm lb-type" data-type="video">🎬 Video MP4</button>' +
        '</div>' +
        '<div id="lb-form-media" style="display:none">' +
          '<div style="margin-bottom:.7rem"><strong>🖼️ Image de marque</strong> <span style="font-size:.78rem;color:var(--text-muted)">(compressee auto)</span><div style="font-size:.76rem;color:var(--text-muted);margin:.2rem 0">' + toolBtns(IMG_TOOLS) + '</div><input type="file" id="lb-img" accept="image/*"></div>' +
          '<div style="margin-bottom:.7rem"><strong>🔊 Jingle</strong> <span style="font-size:.78rem;color:var(--text-muted)">(mp3/wav, ' + fmtSize(AUDIO_MAX) + ' max)</span><div style="font-size:.76rem;color:var(--text-muted);margin:.2rem 0">' + toolBtns(SND_TOOLS) + '</div><input type="file" id="lb-aud" accept="audio/*"></div>' +
        '</div>' +
        '<div id="lb-form-video" style="display:none">' +
          '<div style="margin-bottom:.7rem"><strong>🎬 Video MP4</strong> <span style="font-size:.78rem;color:var(--text-muted)">(' + fmtSize(VIDEO_MAX) + ' max, ~15-30s)</span><div style="font-size:.76rem;color:var(--text-muted);margin:.2rem 0">' + toolBtns(VID_TOOLS) + '</div><input type="file" id="lb-vid" accept="video/*"></div>' +
        '</div>' +
        '<div id="lb-prev" style="margin:.6rem 0"></div>' +
        '<button class="btn-primary" id="lb-save" disabled>Enregistrer ma soumission</button>' +
        '<div id="lb-msg" style="margin-top:.5rem;font-size:.85rem"></div>' +
        '</div>'
      ) : '<div class="glass-card" style="padding:1rem">Connecte-toi en etudiant pour preparer ta soumission.</div>';

      var TH = currentTheme();
      main.innerHTML = '<div class="page-header"><h1>🎤 Live Battle <span class="gradient-text">' + esc(TH.title) + '</span></h1>' +
        '<p class="page-subtitle"><strong>Consigne :</strong> ' + esc(TH.consigne) + ' La classe vote en direct ⭐</p></div>' +
        adminBar + form;

      if (isAdmin()) { var lb = document.getElementById('lb-launch'); if (lb) lb.addEventListener('click', function () { launchLive(all); }); }
      if (u.accountKey) wirePrepForm(u, mine);
    });
  }

  function wirePrepForm(u, mine) {
    var pending = { type: mine ? mine.type : currentTheme().prefer, imageUrl: mine && mine.imageUrl, audioUrl: mine && mine.audioUrl, videoUrl: mine && mine.videoUrl };
    var fMedia = document.getElementById('lb-form-media'), fVideo = document.getElementById('lb-form-video');
    var prev = document.getElementById('lb-prev'), msg = document.getElementById('lb-msg'), saveBtn = document.getElementById('lb-save');
    function showType(t) { pending.type = t; fMedia.style.display = t === 'media' ? 'block' : 'none'; fVideo.style.display = t === 'video' ? 'block' : 'none'; refresh(); }
    function ready() { return pending.type === 'video' ? !!pending.videoUrl : (!!pending.imageUrl && !!pending.audioUrl); }
    function refresh() {
      prev.innerHTML = pending.type === 'video'
        ? (pending.videoUrl ? '<video src="' + pending.videoUrl + '" controls style="max-width:280px;border-radius:8px"></video>' : '')
        : ((pending.imageUrl ? '<img src="' + pending.imageUrl + '" style="max-width:160px;border-radius:8px;border:1px solid var(--border-glass)">' : '') + (pending.audioUrl ? '<audio src="' + pending.audioUrl + '" controls style="display:block;margin-top:.4rem;width:100%"></audio>' : ''));
      saveBtn.disabled = !ready();
    }
    document.querySelectorAll('.lb-type').forEach(function (b) { b.addEventListener('click', function () { document.querySelectorAll('.lb-type').forEach(function (x) { x.classList.remove('btn-primary'); }); this.classList.add('btn-primary'); showType(this.getAttribute('data-type')); }); });
    // type initial
    var initBtn = document.querySelector('.lb-type[data-type="' + pending.type + '"]'); if (initBtn) initBtn.classList.add('btn-primary');
    showType(pending.type);

    function doUpload(file, kind, after) {
      msg.textContent = 'Upload ' + kind + '... 0%';
      uploadFile(file, u.accountKey, kind, function (pct) { msg.textContent = 'Upload ' + kind + '... ' + pct + '%'; }, function (err, url) {
        if (err) { msg.innerHTML = '<span style="color:var(--red)">Echec upload (' + esc(err) + ').</span>'; return; }
        msg.innerHTML = '<span style="color:var(--green)">' + kind + ' uploade ✅</span>'; after(url); refresh();
      });
    }
    var imgIn = document.getElementById('lb-img'); if (imgIn) imgIn.addEventListener('change', function () { var f = this.files[0]; if (!f) return; compressImage(f, function (cf) { doUpload(cf, 'image', function (url) { pending.imageUrl = url; }); }); });
    var audIn = document.getElementById('lb-aud'); if (audIn) audIn.addEventListener('change', function () { var f = this.files[0]; if (!f) return; if (f.size > AUDIO_MAX) { msg.innerHTML = '<span style="color:var(--red)">Jingle trop lourd (' + fmtSize(f.size) + ').</span>'; this.value = ''; return; } doUpload(f, 'audio', function (url) { pending.audioUrl = url; }); });
    var vidIn = document.getElementById('lb-vid'); if (vidIn) vidIn.addEventListener('change', function () { var f = this.files[0]; if (!f) return; if (f.size > VIDEO_MAX) { msg.innerHTML = '<span style="color:var(--red)">Video trop lourde (' + fmtSize(f.size) + ' > ' + fmtSize(VIDEO_MAX) + '). Raccourcis-la.</span>'; this.value = ''; return; } doUpload(f, 'video', function (url) { pending.videoUrl = url; }); });

    if (saveBtn) saveBtn.addEventListener('click', function () {
      if (!ready()) return;
      var st = window.AIA.getState();
      var data = { name: u.name || 'Etudiant', avatar: st.avatar || (window.AIA.getDefaultAvatar ? window.AIA.getDefaultAvatar() : null), type: pending.type, ts: Date.now() };
      if (pending.type === 'video') data.videoUrl = pending.videoUrl; else { data.imageUrl = pending.imageUrl; data.audioUrl = pending.audioUrl; }
      window.AIA.db.ref('livebattle_content/' + u.accountKey).set(data, function (err) { msg.innerHTML = err ? '<span style="color:var(--red)">Echec enregistrement.</span>' : '<span style="color:var(--green)">✅ Soumission enregistree ! Tu peux la modifier jusqu\'au lancement.</span>'; });
    });
  }

  /* ---------- FORMATEUR : lancer / terminer / fermer ---------- */
  function launchLive(contents) {
    var A = window.AIA;
    var keys = Object.keys(contents || {}).filter(function (k) { var c = contents[k]; return c && (c.videoUrl || (c.imageUrl && c.audioUrl)); });
    if (!keys.length) { if (A.showToast) A.showToast('Aucune soumission complete a presenter', 'warning'); return; }
    // melange l'ordre
    for (var i = keys.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = keys[i]; keys[i] = keys[j]; keys[j] = t; }
    var ref = A.db.ref('livebattle').push(); var id = ref.key;
    var content = {}; keys.forEach(function (k) { content[k] = contents[k]; });
    var TH = currentTheme();
    ref.set({ meta: { phase: 'live', order: keys, currentIdx: 0, createdAt: Date.now(), title: TH.title, consigne: TH.consigne }, content: content }, function () {
      A.db.ref('livebattle/current').set(id);
    });
  }
  function endBattle(id) { window.AIA.db.ref('livebattle/' + id + '/meta').update({ phase: 'results' }); }
  function closeBattle() { window.AIA.db.ref('livebattle/current').set(null); }

  /* ---------- avatar -> img ---------- */
  function avatarImg(cfg, px) {
    var c = document.createElement('canvas'); c.width = px; c.height = px; var ctx = c.getContext('2d');
    try { if (window.AIA.renderMiniSprite) window.AIA.renderMiniSprite(ctx, cfg || (window.AIA.getDefaultAvatar && window.AIA.getDefaultAvatar()), Math.max(2, Math.round(px / 16)), 0, 0); } catch (e) {}
    try { return '<img src="' + c.toDataURL() + '" width="' + px + '" height="' + px + '" style="image-rendering:pixelated;vertical-align:middle">'; } catch (e) { return '<span style="font-size:' + px + 'px">👤</span>'; }
  }

  /* ====================================================
     PHASE LIVE — pilotage MANUEL par le formateur, scene STABLE.
     Le bloc media (#lb-stage-media) n'est RECONSTRUIT qu'au changement de presentateur
     -> une video lue ne se coupe JAMAIS sur un vote ou un rafraichissement de donnees.
     ==================================================== */
  var _stageKey = null, _stageOrderLen = 0, _stageCtx = null;

  function setCurrentIdx(id, order, n) {
    var clamped = Math.max(0, Math.min(order.length - 1, n));
    window.AIA.db.ref('livebattle/' + id + '/meta/currentIdx').set(clamped);
  }

  function runStage(main, id, b) {
    var meta = b.meta || {}, content = b.content || {}, ratings = b.ratings || {};
    var order = (meta.order || []).filter(function (k) { return content[k]; });
    if (!order.length) { main.innerHTML = '<div class="glass-card" style="padding:2rem;text-align:center">Aucune soumission a presenter.' + (isAdmin() ? ' <button class="btn-outline" id="lb-end">Resultats</button>' : '') + '</div>'; var e0 = document.getElementById('lb-end'); if (e0) e0.addEventListener('click', function () { endBattle(id); }); return; }
    var idx = Math.max(0, Math.min(order.length - 1, meta.currentIdx || 0));
    var presenterKey = order[idx];
    _stageCtx = { main: main, id: id, order: order, content: content, ratings: ratings, idx: idx };
    if (presenterKey !== _stageKey || _stageOrderLen !== order.length) {
      _stageKey = presenterKey; _stageOrderLen = order.length;
      renderStageFull(main, id, order, content, ratings, idx);
    } else {
      updateVotePanel();
    }
  }

  function presenterMedia(cur) {
    if (cur.type === 'video' && cur.videoUrl) {
      return '<video id="lb-media" src="' + cur.videoUrl + '" controls autoplay playsinline style="max-width:min(640px,94%);max-height:50vh;border-radius:12px;border:2px solid var(--gold);box-shadow:0 10px 40px rgba(0,0,0,.5)"></video>';
    }
    return '<img src="' + (cur.imageUrl || '') + '" alt="brand" style="max-width:min(560px,90%);max-height:44vh;border-radius:12px;border:2px solid var(--gold);box-shadow:0 10px 40px rgba(0,0,0,.5)">' +
      '<div style="margin-top:.5rem"><audio id="lb-media" src="' + (cur.audioUrl || '') + '" controls autoplay style="width:min(560px,90%)"></audio></div>';
  }

  function votePanelHtml(curKey, curName, ratings, u) {
    var st = avgOf(ratings[curKey]);
    var canVote = u.accountKey && curKey !== u.accountKey;
    var body;
    if (canVote) {
      var mine = (ratings[curKey] || {})[u.accountKey] || 0, stars = '';
      for (var s = 1; s <= 5; s++) stars += '<span class="lb-star" data-star="' + s + '" style="cursor:pointer;font-size:2.1rem;line-height:1;color:' + (s <= mine ? '#F5B731' : 'rgba(255,255,255,0.35)') + '">★</span>';
      body = '<div style="font-size:.8rem;color:var(--text-secondary)">Note la creation de <strong>' + esc((curName || '').split(' ')[0]) + '</strong></div>' +
        '<div id="lb-stars">' + stars + '</div>' +
        '<div style="font-size:.68rem;color:var(--text-muted);margin-top:.15rem">' + (mine ? 'Ta note : ' + mine + '/5 (modifiable)' : 'Touche une etoile') + ' &bull; ' + st.n + ' vote(s) &bull; moy ' + st.avg.toFixed(1) + ' ★</div>';
    } else {
      body = '<div style="font-size:.85rem">' + (u.accountKey && curKey === u.accountKey ? '🎤 C\'est ton passage !' : (isAdmin() ? '👨‍🏫 Pilotage de la scene' : '')) + '</div>' +
        '<div style="font-size:.72rem;color:var(--text-muted)">' + st.n + ' vote(s) &bull; moyenne ' + st.avg.toFixed(1) + ' ★</div>';
    }
    return '<div class="lb-vote-popup" style="position:fixed;left:50%;bottom:1.1rem;transform:translateX(-50%);z-index:9000;background:rgba(20,20,35,0.96);border:1px solid var(--gold);border-radius:16px;padding:.7rem 1.2rem;box-shadow:0 12px 50px rgba(0,0,0,.6);text-align:center;backdrop-filter:blur(6px);max-width:92vw">' + body + '</div>';
  }

  // Mise a jour LEGERE : reconstruit uniquement le panneau de vote (le media n'est PAS touche).
  function updateVotePanel() {
    var c = _stageCtx; if (!c) return; var u = me();
    var curKey = c.order[c.idx], cur = c.content[curKey] || {};
    var wrap = document.getElementById('lb-vote-wrap'); if (!wrap) return;
    wrap.innerHTML = votePanelHtml(curKey, cur.name, c.ratings, u);
    wireStars(c.id, curKey, u);
  }
  function wireStars(id, curKey, u) {
    var sw = document.getElementById('lb-stars'); if (!sw) return;
    sw.querySelectorAll('.lb-star').forEach(function (st) {
      st.addEventListener('click', function () { window.AIA.db.ref('livebattle/' + id + '/ratings/' + curKey + '/' + u.accountKey).set(parseInt(this.getAttribute('data-star'), 10)); });
    });
  }

  function renderStageFull(main, id, order, content, ratings, idx) {
    var u = me(); var curKey = order[idx], cur = content[curKey] || {};
    var controls = isAdmin() ? '<div style="display:flex;gap:.4rem;justify-content:center;flex-wrap:wrap;margin-bottom:.5rem">' +
      '<button class="btn-outline btn-sm" id="lb-prev"' + (idx <= 0 ? ' disabled' : '') + '>⏮ Precedent</button>' +
      '<button class="btn-primary btn-sm" id="lb-next"' + (idx >= order.length - 1 ? ' disabled' : '') + '>Suivant ⏭</button>' +
      '<button class="btn-outline btn-sm" id="lb-end">⏹ Terminer</button>' +
      '</div><div style="text-align:center;font-size:.72rem;color:var(--text-muted);margin-bottom:.4rem">Tu passes a un etudiant quand tu veux : boutons, ou clique un avatar ci-dessous.</div>' : '';
    var audience = order.map(function (k) {
      var c = content[k] || {}, on = k === curKey;
      return '<div class="lb-aud' + (isAdmin() ? ' lb-jump' : '') + '" data-key="' + k + '" style="text-align:center;cursor:' + (isAdmin() ? 'pointer' : 'default') + ';opacity:' + (on ? '1' : '0.5') + ';transform:scale(' + (on ? '1.15' : '1') + ');transition:.3s">' +
        avatarImg(c.avatar, 38) + '<div style="font-size:.58rem;max-width:54px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc((c.name || '').split(' ')[0]) + '</div></div>';
    }).join('');

    main.innerHTML = '<div class="page-header" style="margin-bottom:.4rem"><h1>🎤 Live <span class="gradient-text">Battle</span></h1>' +
      '<p class="page-subtitle">Passage ' + (idx + 1) + '/' + order.length + ' &bull; vote en direct ⭐</p></div>' + controls +
      '<div class="glass-card" style="padding:0;overflow:hidden">' +
        '<div id="lb-stage-media" style="background:linear-gradient(180deg,#1a1a2e,#16213e);padding:1rem;text-align:center">' +
          '<div style="display:flex;align-items:center;justify-content:center;gap:.6rem;margin-bottom:.5rem">' + avatarImg(cur.avatar, 54) +
            '<div style="text-align:left"><div style="font-size:.72rem;color:var(--text-muted)">AU TABLEAU</div><div style="font-size:1.2rem;font-weight:800">' + esc(cur.name || 'Etudiant') + '</div></div></div>' +
          presenterMedia(cur) +
        '</div>' +
      '</div>' +
      '<div class="glass-card" style="margin-top:1rem;padding:.6rem;display:flex;gap:.5rem;overflow-x:auto;justify-content:center;flex-wrap:wrap">' + audience + '</div>' +
      '<div id="lb-vote-wrap">' + votePanelHtml(curKey, cur.name, ratings, u) + '</div>';

    var media = document.getElementById('lb-media'); if (media && media.play) { var p = media.play(); if (p && p.catch) p.catch(function () {}); }
    var pb = document.getElementById('lb-prev'); if (pb) pb.addEventListener('click', function () { setCurrentIdx(id, order, idx - 1); });
    var nb = document.getElementById('lb-next'); if (nb) nb.addEventListener('click', function () { setCurrentIdx(id, order, idx + 1); });
    var eb = document.getElementById('lb-end'); if (eb) eb.addEventListener('click', function () { endBattle(id); });
    if (isAdmin()) main.querySelectorAll('.lb-jump').forEach(function (el) { el.addEventListener('click', function () { var k = this.getAttribute('data-key'); var ni = order.indexOf(k); if (ni > -1) setCurrentIdx(id, order, ni); }); });
    wireStars(id, curKey, u);
  }

  /* ====================================================
     PHASE RESULTS — moyenne d'etoiles
     ==================================================== */
  function avgOf(rmap) { var ks = Object.keys(rmap || {}); if (!ks.length) return { avg: 0, n: 0 }; var s = 0; ks.forEach(function (k) { s += rmap[k] || 0; }); return { avg: s / ks.length, n: ks.length }; }

  function renderResults(main, id, b) {
    var content = b.content || {}, ratings = b.ratings || {}; var u = me();
    var keys = Object.keys(content);
    var stats = {}; keys.forEach(function (k) { stats[k] = avgOf(ratings[k]); });
    keys.sort(function (a, c) { return (stats[c].avg - stats[a].avg) || (stats[c].n - stats[a].n); });

    if (u.accountKey && content[u.accountKey] && !_rewardClaimed[id]) {
      _rewardClaimed[id] = true;
      _battleRef.child('claimed/' + u.accountKey).once('value', function (s) {
        if (s.val()) return; _battleRef.child('claimed/' + u.accountKey).set(true);
        var won = keys[0] === u.accountKey && stats[keys[0]].n > 0;
        if (window.AIA.addXP) window.AIA.addXP(won ? 40 : 15, won ? 'Live Battle gagnee 🏆' : 'Live Battle (participation)');
        if (won && window.AIA.awardBadge) window.AIA.awardBadge('battle-win');
      });
    }

    var medals = ['🥇', '🥈', '🥉'];
    var rows = keys.map(function (k, i) {
      var c = content[k] || {}, stt = stats[k]; var meRow = k === u.accountKey;
      // Relecture des assets : video jouable, ou image (clic = plein ecran) + audio jouable.
      var replay = c.type === 'video'
        ? '<video src="' + (c.videoUrl || '') + '" controls playsinline preload="metadata" style="width:160px;max-height:100px;border-radius:6px;background:#000"></video>'
        : '<a href="' + (c.imageUrl || '') + '" target="_blank" rel="noopener" title="Voir en grand"><img src="' + (c.imageUrl || '') + '" style="width:50px;height:50px;object-fit:cover;border-radius:6px;border:1px solid var(--border-glass)"></a>' +
          (c.audioUrl ? '<audio src="' + c.audioUrl + '" controls preload="none" style="height:32px;max-width:170px"></audio>' : '');
      return '<div class="glass-card" style="display:flex;align-items:center;gap:.7rem;padding:.6rem .9rem;margin-bottom:.5rem;flex-wrap:wrap' + (meRow ? ';border:1px solid var(--gold)' : '') + '">' +
        '<div style="font-size:1.3rem;width:2rem;text-align:center">' + (medals[i] || (i + 1)) + '</div>' + avatarImg(c.avatar, 38) +
        '<div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap">' + replay + '</div>' +
        '<div style="flex:1;min-width:120px"><strong>' + esc(c.name || 'Etudiant') + '</strong>' + (meRow ? ' (toi)' : '') + '<div style="font-size:.7rem;color:var(--text-muted)">' + stt.n + ' vote(s)</div></div>' +
        '<div style="font-weight:800;color:var(--gold);min-width:78px;text-align:right">' + stt.avg.toFixed(2) + ' ★</div></div>';
    }).join('');

    main.innerHTML = '<div class="page-header"><h1>🏆 Resultats <span class="gradient-text">Live Battle</span></h1>' +
      '<p class="page-subtitle">Classement par moyenne d\'etoiles</p></div>' +
      (keys.length ? rows : '<div class="glass-card" style="padding:2rem;text-align:center">Aucune soumission.</div>') +
      (isAdmin() ? '<div style="text-align:center;margin-top:1rem"><button class="btn-outline" id="lb-close-res">Fermer la Live Battle</button></div>' : '');
    var cb = document.getElementById('lb-close-res'); if (cb) cb.addEventListener('click', closeBattle);
  }

  window.AIA = window.AIA || {};
  window.AIA.renderLiveBattle = renderLiveBattle;
  window.AIA.stopLiveBattle = stopLive;
})();
