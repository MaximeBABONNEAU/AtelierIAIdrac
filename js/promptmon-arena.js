/* ==============================================
   PROMPTMON-ARENA.JS — Phase 2 du PokePrompt : combats d'images async
   - Brief du jour (auto par date, le formateur peut le remplacer).
   - L'étudiant crée son image (logo/visuel) hors-app puis l'upload (compression
     canvas -> Firebase Storage, path livebattle/<key>/promptmon_* : règle existante).
   - MATCHMAKING INDIRECT : à la soumission, on s'apparie avec la plus ancienne
     soumission libre du même brief (transactions sur `matched`) — personne n'a
     besoin d'être en ligne en même temps.
   - JUGE IA : le formateur colle une clé Gemini (localStorage UNIQUEMENT, jamais
     en base) ; sa session juge les combats en attente (gemini-2.0-flash, 2 images
     + brief, réponse JSON {winner,scoreA,scoreB,reason}). Repli : jugement manuel.
   - Récompenses idempotentes (claimed/<key> transactionnel).
   IDRAC Business School — [AI-assisted]
   ============================================== */
(function () {
  'use strict';

  var IMG_MAX_PX = 1400, IMG_QUALITY = 0.85;
  var WIN_XP = 20, LOSE_XP = 8, WIN_PTS = 30, LOSE_PTS = 8;
  var GKEY_LS = 'promptmon_gemini_key';

  /* ---------- BRIEFS (rotation quotidienne) ---------- */
  var BRIEFS = [
    { id: 'logo-eco', title: 'Logo éco-responsable', desc: 'Crée le meilleur LOGO pour « Verdoya », une marque de cosmétiques éco-responsables. Style épuré, nature, premium.' },
    { id: 'mascotte-snack', title: 'Mascotte de snack', desc: 'Crée la MASCOTTE de « Croustix », une marque de snacks pour étudiants. Fun, mémorable, déclinable.' },
    { id: 'logo-fintech', title: 'Logo fintech', desc: 'Crée le LOGO de « Klyro », une app de gestion de budget pour jeunes actifs. Moderne, confiance, minimaliste.' },
    { id: 'affiche-festival', title: 'Affiche festival', desc: 'Crée le VISUEL clé de « Sonic Bloom », un festival de musique électro en plein air. Énergie, couleurs, nuit d\'été.' },
    { id: 'logo-coffee', title: 'Logo coffee shop', desc: 'Crée le LOGO de « Brume », un coffee shop artisanal de centre-ville. Chaleureux, artisanal, instagrammable.' },
    { id: 'packaging-jus', title: 'Packaging jus', desc: 'Crée le PACKAGING d\'un jus détox « Vitao » : bouteille face avant. Frais, fruité, sain.' },
    { id: 'logo-sport', title: 'Logo club e-sport', desc: 'Crée le LOGO de « Nova Wolves », une équipe e-sport. Agressif, emblème, déclinable en maillot.' },
    { id: 'visuel-voyage', title: 'Visuel agence de voyage', desc: 'Crée le VISUEL hero de « Horizons », agence de voyages sur-mesure. Évasion, premium, grand format.' },
    { id: 'logo-bakery', title: 'Logo boulangerie', desc: 'Crée le LOGO de « Mie Câline 2.0 », boulangerie nouvelle génération. Tradition + modernité.' },
    { id: 'mascotte-ia', title: 'Mascotte assistant IA', desc: 'Crée la MASCOTTE de « Pixel », un assistant IA pour étudiants. Sympathique, futé, pas effrayant.' }
  ];
  function todayISO() { return new Date().toISOString().split('T')[0]; }
  function autoBrief() {
    var d = new Date(); var start = Date.UTC(d.getUTCFullYear(), 0, 0);
    var day = Math.floor((Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - start) / 86400000);
    var b = BRIEFS[day % BRIEFS.length];
    return { id: 'auto-' + todayISO() + '-' + b.id, title: b.title, desc: b.desc, auto: true };
  }
  function getActiveBrief(cb) {
    var A = window.AIA;
    if (!A.db) { cb(autoBrief()); return; }
    A.db.ref('promptmon/briefs/current').once('value', function (s) {
      var b = s.val();
      cb(b && b.id && b.title ? b : autoBrief());
    }, function () { cb(autoBrief()); });
  }

  /* ---------- Upload helpers (répliqués de livebattle.js, privés là-bas) ---------- */
  function ext(file) { var n = file.name || ''; var i = n.lastIndexOf('.'); return i > -1 ? n.slice(i + 1).toLowerCase() : 'jpg'; }
  function uploadFile(file, key, onProgress, cb) {
    var A = window.AIA;
    if (!A.storage) { cb('Storage indisponible'); return; }
    var ref = A.storage.ref('livebattle/' + key + '/promptmon_' + Date.now() + '.' + ext(file));
    var task = ref.put(file, { contentType: file.type });
    task.on('state_changed',
      function (s) { if (onProgress) onProgress(Math.round(s.bytesTransferred * 100 / s.totalBytes)); },
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

  function esc(t) { var d = document.createElement('div'); d.textContent = (t == null ? '' : String(t)); return d.innerHTML; }
  function me() { var st = window.AIA.getState(); return st.user || {}; }

  /* ---------- MATCHMAKING INDIRECT ---------- */
  // Après ma soumission : claim transactionnel de la plus ancienne soumission adverse libre.
  function tryMatchmake(briefObj, meKey, done, _attempt) {
    var attempt = (_attempt || 0) + 1;
    if (attempt > 5) { done('waiting'); return; } // garde-fou anti-boucle (course perdue répétée)
    var A = window.AIA, db = A.db;
    db.ref('promptmon/submissions/' + briefObj.id).once('value', function (snap) {
      var subs = snap.val() || {};
      var mine = subs[meKey];
      if (!mine || mine.matched) { done(mine && mine.matched ? 'already' : 'no-sub'); return; }
      var candidates = Object.keys(subs)
        .filter(function (k) { return k !== meKey && subs[k] && !subs[k].matched && subs[k].imageUrl; })
        .sort(function (a, b) { return (subs[a].ts || 0) - (subs[b].ts || 0); });
      if (!candidates.length) { done('waiting'); return; }
      var oppKey = candidates[0];
      var matchRef = db.ref('promptmon/matches').push();
      var matchId = matchRef.key;
      // 1) claim l'adversaire (ne s'applique que si encore libre)
      db.ref('promptmon/submissions/' + briefObj.id + '/' + oppKey + '/matched').transaction(function (cur) {
        if (cur) return; // abort : déjà pris
        return matchId;
      }, function (err, committed) {
        if (err || !committed) { tryMatchmake(briefObj, meKey, done, attempt); return; } // candidat pris -> réessayer
        // 2) me claim moi-même (si je me suis fait matcher entre-temps, on libère l'adversaire)
        db.ref('promptmon/submissions/' + briefObj.id + '/' + meKey + '/matched').transaction(function (cur) {
          return cur || matchId;
        }, function (err2, committed2, snap2) {
          var myMatch = snap2 && snap2.val();
          if (myMatch !== matchId) {
            db.ref('promptmon/submissions/' + briefObj.id + '/' + oppKey + '/matched').set(null);
            done('already'); return;
          }
          var opp = subs[oppKey];
          matchRef.set({
            briefId: briefObj.id, briefTitle: briefObj.title || '', briefDesc: briefObj.desc || '',
            a: { key: oppKey, name: opp.name || oppKey, img: opp.imageUrl, creatureId: opp.creatureId || 0 },
            b: { key: meKey, name: mine.name || meKey, img: mine.imageUrl, creatureId: mine.creatureId || 0 },
            status: 'pending', winner: '', createdAt: Date.now()
          }, function (err3) {
            if (err3) { // échec d'écriture : libère les 2 pointeurs pour éviter des soumissions orphelines
              db.ref('promptmon/submissions/' + briefObj.id + '/' + oppKey + '/matched').set(null);
              db.ref('promptmon/submissions/' + briefObj.id + '/' + meKey + '/matched').set(null);
              done('error'); return;
            }
            done('matched');
          });
        });
      });
    });
  }

  /* ---------- JUGE IA (Gemini, clé locale formateur) ---------- */
  function fetchAsBase64(url, cb) {
    fetch(url).then(function (r) { return r.blob(); }).then(function (blob) {
      var fr = new FileReader();
      fr.onload = function () { cb(null, String(fr.result).split(',')[1], blob.type || 'image/jpeg'); };
      fr.onerror = function () { cb('read-error'); };
      fr.readAsDataURL(blob);
    }).catch(function (e) { cb(String(e)); });
  }
  function judgeWithGemini(match, key, cb) {
    fetchAsBase64(match.a.img, function (e1, b64a, mtA) {
      if (e1) { cb('imgA: ' + e1); return; }
      fetchAsBase64(match.b.img, function (e2, b64b, mtB) {
        if (e2) { cb('imgB: ' + e2); return; }
        var prompt = 'Tu es juge d\'un concours de création d\'images en école de commerce (marketing). Brief : "' +
          (match.briefTitle || '') + ' — ' + (match.briefDesc || '') + '". ' +
          'Compare l\'IMAGE 1 (candidat A) et l\'IMAGE 2 (candidat B) sur : adéquation au brief, impact visuel, qualité d\'exécution, créativité. ' +
          'Réponds UNIQUEMENT en JSON strict : {"winner":"a"|"b","scoreA":0-100,"scoreB":0-100,"reason":"explication courte en français (2 phrases max)"}';
        var body = {
          contents: [{ parts: [
            { text: prompt },
            { inline_data: { mime_type: mtA, data: b64a } },
            { inline_data: { mime_type: mtB, data: b64b } }
          ] }],
          generationConfig: { temperature: 0.2, response_mime_type: 'application/json' }
        };
        fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(key), {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        }).then(function (r) { return r.json(); }).then(function (j) {
          try {
            var txt = j.candidates[0].content.parts[0].text;
            var m = txt.match(/\{[\s\S]*\}/);
            var verdict = JSON.parse(m ? m[0] : txt);
            if (verdict.winner !== 'a' && verdict.winner !== 'b') throw new Error('winner invalide');
            cb(null, verdict);
          } catch (e) {
            cb('parse: ' + (j.error && j.error.message ? j.error.message : e.message));
          }
        }).catch(function (e) { cb(String(e)); });
      });
    });
  }
  // Boucle de jugement : claim transactionnel (pending->judging) puis Gemini puis done.
  function judgePending(statusEl, done) {
    var A = window.AIA, key = localStorage.getItem(GKEY_LS);
    if (!key) { if (statusEl) statusEl.textContent = 'Pas de clé Gemini — jugement manuel ci-dessous.'; if (done) done(0); return; }
    A.db.ref('promptmon/matches').orderByChild('status').equalTo('pending').once('value', function (snap) {
      var all = snap.val() || {}; var ids = Object.keys(all);
      if (!ids.length) { if (statusEl) statusEl.textContent = 'Aucun combat en attente.'; if (done) done(0); return; }
      var judged = 0, i = 0;
      (function next() {
        if (i >= ids.length) { if (statusEl) statusEl.textContent = '✅ ' + judged + ' combat(s) jugé(s) par l\'IA.'; if (done) done(judged); return; }
        var id = ids[i++]; var match = all[id];
        A.db.ref('promptmon/matches/' + id + '/status').transaction(function (cur) {
          if (cur !== 'pending') return; return 'judging';
        }, function (err, committed) {
          if (err || !committed) { next(); return; }
          if (statusEl) statusEl.textContent = '🤖 Jugement IA du combat ' + (judged + 1) + '…';
          if (!match.a || !match.a.img || !match.b || !match.b.img) { // images manquantes -> repli manuel
            A.db.ref('promptmon/matches/' + id + '/status').set('pending'); next(); return;
          }
          var rollback = function () { A.db.ref('promptmon/matches/' + id + '/status').set('pending'); };
          try {
            judgeWithGemini(match, key, function (jerr, v) {
              if (jerr) {
                rollback(); // libère pour repli manuel
                if (statusEl) statusEl.textContent = '⚠️ Échec IA (' + String(jerr).slice(0, 120) + ') — combat laissé en manuel.';
                next(); return;
              }
              A.db.ref('promptmon/matches/' + id).update({
                status: 'done', winner: v.winner, scoreA: v.scoreA || 0, scoreB: v.scoreB || 0,
                reason: String(v.reason || '').slice(0, 300), judgedBy: 'ai', judgedAt: Date.now()
              }, function () { judged++; next(); });
            });
          } catch (syncErr) { rollback(); next(); } // jamais bloqué en 'judging' sur exception synchrone
        });
      })();
    });
  }

  /* ---------- RÉCOMPENSES (idempotent) ---------- */
  function claimReward(matchId, match, meKey, cb) {
    var A = window.AIA;
    A.db.ref('promptmon/matches/' + matchId + '/claimed/' + meKey).transaction(function (cur) {
      return cur || true;
    }, function (err, committed, snap) {
      if (err || !committed) { if (cb) cb(false); return; }
      var iAmA = match.a.key === meKey;
      var won = (match.winner === 'a' && iAmA) || (match.winner === 'b' && !iAmA);
      if (A.addXP) A.addXP(won ? WIN_XP : LOSE_XP, won ? 'Victoire PromptMon Arena 🏆' : 'Combat PromptMon');
      var st = A.getState();
      if (st.promptmon) {
        st.promptmon.battles = (st.promptmon.battles || 0) + 1;
        if (won) st.promptmon.wins = (st.promptmon.wins || 0) + 1;
        if (A.saveState) A.saveState();
      }
      if (won && A.awardBadge) A.awardBadge('promptmon-arena-win');
      A.db.ref('pvp/' + meKey).transaction(function (p) {
        p = p || {};
        p.points = (p.points || 0) + (won ? WIN_PTS : LOSE_PTS);
        return p;
      }, function (pvpErr, pvpCommitted) {
        if (pvpErr || !pvpCommitted) console.warn('[promptmon] pvp tx echouee', meKey, pvpErr);
        if (cb) cb(true, won);
      });
    });
  }

  /* ===================== UI ===================== */
  function renderArena(body) {
    if (!body) return;
    var A = window.AIA, u = me();
    if (!A.db) { body.innerHTML = '<div class="glass-card" style="padding:1rem">Arène indisponible hors-ligne.</div>'; return; }
    if (u.isAdmin) { renderJudgePanel(body); return; }
    if (!u.accountKey) { body.innerHTML = '<div class="glass-card" style="padding:1rem">Connecte-toi pour combattre.</div>'; return; }
    getActiveBrief(function (brief) {
      A.db.ref('promptmon/submissions/' + brief.id + '/' + u.accountKey).once('value', function (s) {
        renderStudentArena(body, brief, s.val());
      }, function () { renderStudentArena(body, brief, null); });
    });
  }

  function renderStudentArena(body, brief, mySub) {
    var A = window.AIA, u = me();
    var st = A.getState(); var creatureId = (st.promptmon && st.promptmon.creatureId) || 0;
    body.innerHTML =
      '<div class="glass-card" style="padding:1rem;margin-bottom:.8rem">' +
        '<div style="font-size:.72rem;color:var(--text-muted);font-weight:700">🎯 BRIEF DU COMBAT</div>' +
        '<div style="font-size:1.05rem;font-weight:800;margin:.15rem 0">' + esc(brief.title) + '</div>' +
        '<div style="font-size:.85rem">' + esc(brief.desc) + '</div>' +
        '<div style="font-size:.74rem;color:var(--text-muted);margin-top:.4rem">Crée ton image avec l\'outil de ton choix (Ideogram, FLUX, Leonardo, MS Designer…) puis upload-la. Tu seras opposé à un autre étudiant — une IA jugera. 🤖</div>' +
      '</div>' +
      '<div class="glass-card" style="padding:1rem;margin-bottom:.8rem">' +
        (mySub && mySub.imageUrl
          ? '<div style="display:flex;gap:.8rem;align-items:center;flex-wrap:wrap"><img src="' + esc(mySub.imageUrl) + '" alt="ma soumission" style="width:110px;height:110px;object-fit:cover;border-radius:12px;border:1px solid var(--border-glass)">' +
            '<div style="flex:1;min-width:180px"><div style="font-weight:700">✅ Image soumise</div>' +
            '<div style="font-size:.78rem;color:var(--text-muted)">' + (mySub.matched ? '⚔️ Adversaire trouvé — combat en cours de jugement.' : '🕐 En attente d\'un adversaire (matchmaking automatique dès qu\'un autre étudiant soumet).') + '</div>' +
            (!mySub.matched ? '<label class="btn-outline btn-sm" style="cursor:pointer;display:inline-block;margin-top:.4rem">Remplacer l\'image<input type="file" id="pma-file" accept="image/*" style="display:none"></label>' : '') +
            '</div></div>'
          : '<div style="text-align:center;padding:.4rem">' +
            '<label class="btn-primary" style="cursor:pointer;display:inline-block">📤 Uploader mon image<input type="file" id="pma-file" accept="image/*" style="display:none"></label>' +
            '<div id="pma-up-msg" style="font-size:.78rem;color:var(--text-muted);margin-top:.4rem"></div></div>') +
        '<div id="pma-up-msg2" style="font-size:.78rem;margin-top:.3rem"></div>' +
      '</div>' +
      '<div style="font-weight:700;font-size:.9rem;margin:.6rem 0">⚔️ Mes combats</div>' +
      '<div id="pma-matches"><div class="loading-pulse" style="text-align:center;padding:.8rem">Chargement…</div></div>';

    var fi = document.getElementById('pma-file');
    if (fi) fi.addEventListener('change', function () {
      var f = this.files && this.files[0]; if (!f) return;
      var msg = document.getElementById('pma-up-msg') || document.getElementById('pma-up-msg2');
      if (msg) msg.textContent = 'Compression…';
      compressImage(f, function (cf) {
        uploadFile(cf, u.accountKey, function (pct) { if (msg) msg.textContent = 'Upload ' + pct + '%'; }, function (err, url) {
          if (err) { if (msg) msg.innerHTML = '<span style="color:var(--red)">Échec : ' + esc(err) + '</span>'; return; }
          A.db.ref('promptmon/submissions/' + brief.id + '/' + u.accountKey).update({
            imageUrl: url, name: u.name || u.accountKey, creatureId: creatureId, ts: Date.now()
          }, function () {
            if (msg) msg.textContent = 'Recherche d\'un adversaire…';
            tryMatchmake(brief, u.accountKey, function () { renderArena(body.parentNode ? body : document.getElementById('pm-tabbody')); });
          });
        });
      });
    });

    renderMyMatches(document.getElementById('pma-matches'), u.accountKey);
  }

  function renderMyMatches(el, meKey) {
    var A = window.AIA;
    if (!el) return;
    A.db.ref('promptmon/matches').limitToLast(100).once('value', function (snap) {
      var all = snap.val() || {};
      var mine = Object.keys(all).filter(function (id) {
        var m = all[id]; return m && ((m.a && m.a.key === meKey) || (m.b && m.b.key === meKey));
      }).sort(function (x, y) { return (all[y].createdAt || 0) - (all[x].createdAt || 0); });
      if (!mine.length) { el.innerHTML = '<p style="color:var(--text-muted);font-size:.84rem;text-align:center">Aucun combat pour l\'instant. Soumets ton image ! 🎨</p>'; return; }
      el.innerHTML = mine.map(function (id) { return matchCard(id, all[id], meKey); }).join('');
      wireClaims(el, all, meKey);
    }, function () { el.innerHTML = '<p style="color:var(--text-muted);font-size:.84rem;text-align:center">Combats indisponibles pour le moment.</p>'; });
  }
  function wireClaims(el, all, meKey) {
      el.querySelectorAll('.pma-claim').forEach(function (b) {
        b.addEventListener('click', function () {
          var id = this.getAttribute('data-id'); var btn = this; btn.disabled = true;
          claimReward(id, all[id], meKey, function (ok, won) {
            if (ok && window.AIA.showToast) window.AIA.showToast(won ? '🏆 +' + WIN_XP + ' XP !' : '+' + LOSE_XP + ' XP (combat)', won ? 'success' : 'info');
            renderMyMatches(el, meKey);
          });
        });
      });
  }

  function matchCard(id, m, meKey) {
    var iAmA = m.a.key === meKey;
    var mySide = iAmA ? m.a : m.b, oppSide = iAmA ? m.b : m.a;
    var won = m.status === 'done' && ((m.winner === 'a' && iAmA) || (m.winner === 'b' && !iAmA));
    var claimed = m.claimed && m.claimed[meKey];
    var statusHtml = m.status === 'done'
      ? '<span class="pm-chip" style="background:' + (won ? 'rgba(46,204,113,.2)' : 'rgba(231,76,60,.18)') + '">' + (won ? '🏆 Victoire' : '💪 Défaite') + '</span>'
      : '<span class="pm-chip" style="background:rgba(245,183,49,.15)">🕐 En attente du juge' + (m.status === 'judging' ? ' (IA en cours…)' : '') + '</span>';
    return '<div class="glass-card pm-card" style="padding:.7rem;margin-bottom:.6rem">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.4rem;margin-bottom:.4rem">' +
        '<div style="font-size:.78rem;font-weight:700">' + esc(m.briefTitle || 'Brief') + '</div>' + statusHtml + '</div>' +
      '<div style="display:flex;gap:.6rem;align-items:center;justify-content:center;flex-wrap:wrap">' +
        '<div style="text-align:center"><img src="' + esc(mySide.img) + '" alt="moi" style="width:96px;height:96px;object-fit:cover;border-radius:10px;border:2px solid ' + (m.status === 'done' ? (won ? '#2ecc71' : 'rgba(231,76,60,.6)') : 'var(--border-glass)') + '"><div style="font-size:.68rem;margin-top:.15rem">Toi</div></div>' +
        '<div style="font-weight:900;color:var(--text-muted)">VS</div>' +
        '<div style="text-align:center"><img src="' + esc(oppSide.img) + '" alt="adversaire" style="width:96px;height:96px;object-fit:cover;border-radius:10px;border:2px solid ' + (m.status === 'done' ? (!won ? '#2ecc71' : 'rgba(231,76,60,.6)') : 'var(--border-glass)') + '"><div style="font-size:.68rem;margin-top:.15rem">' + esc(oppSide.name) + '</div></div>' +
      '</div>' +
      (m.status === 'done'
        ? '<div style="font-size:.76rem;color:var(--text-muted);margin-top:.4rem;text-align:center">' +
          (m.scoreA || m.scoreB ? '<strong>' + (iAmA ? m.scoreA : m.scoreB) + '</strong> – ' + (iAmA ? m.scoreB : m.scoreA) + ' &bull; ' : '') +
          (m.judgedBy === 'ai' ? '🤖 Jugé par IA' : '👨‍🏫 Jugé par le formateur') +
          (m.reason ? '<br>« ' + esc(m.reason) + ' »' : '') + '</div>' +
          (!claimed ? '<div style="text-align:center;margin-top:.5rem"><button class="btn-primary btn-sm pma-claim" data-id="' + id + '" style="cursor:pointer">🎁 Récupérer ' + (won ? WIN_XP : LOSE_XP) + ' XP</button></div>'
                    : '<div style="text-align:center;font-size:.72rem;color:var(--green);margin-top:.3rem">✓ Récompense récupérée</div>')
        : '') +
    '</div>';
  }

  /* ---------- PANNEAU FORMATEUR ---------- */
  function renderJudgePanel(body) {
    var A = window.AIA;
    var hasKey = !!localStorage.getItem(GKEY_LS);
    getActiveBrief(function (brief) {
      body.innerHTML =
        '<div class="glass-card" style="padding:1rem;margin-bottom:.8rem">' +
          '<div style="font-weight:800">👨‍🏫 Panneau juge — PromptMon Arena</div>' +
          '<div style="font-size:.8rem;color:var(--text-muted);margin:.3rem 0">Brief actif : <strong>' + esc(brief.title) + '</strong>' + (brief.auto ? ' (auto du jour)' : ' (custom)') + '</div>' +
          '<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem">' +
            '<input id="pma-brief-title" class="demo-input" style="flex:1;min-width:140px" placeholder="Titre brief custom">' +
            '<input id="pma-brief-desc" class="demo-input" style="flex:2;min-width:200px" placeholder="Consigne (ex: Crée le logo de…)">' +
            '<button class="btn-outline btn-sm" id="pma-brief-set" style="cursor:pointer">Lancer ce brief</button>' +
            '<button class="btn-outline btn-sm" id="pma-brief-reset" style="cursor:pointer">Revenir au brief auto</button>' +
          '</div>' +
        '</div>' +
        '<div class="glass-card" style="padding:1rem;margin-bottom:.8rem">' +
          '<div style="font-weight:700;margin-bottom:.4rem">🤖 Juge IA (Gemini)</div>' +
          '<div style="display:flex;gap:.5rem;flex-wrap:wrap;align-items:center">' +
            '<input id="pma-gkey" type="password" class="demo-input" style="flex:1;min-width:220px" placeholder="' + (hasKey ? 'Clé enregistrée ✓ (coller pour remplacer)' : 'Coller la clé API Gemini (reste sur CET appareil)') + '">' +
            '<button class="btn-outline btn-sm" id="pma-gkey-save" style="cursor:pointer">Enregistrer</button>' +
            '<button class="btn-primary btn-sm" id="pma-judge-now" style="cursor:pointer">⚖️ Juger les combats en attente</button>' +
          '</div>' +
          '<div id="pma-judge-status" style="font-size:.8rem;color:var(--text-muted);margin-top:.4rem">' + (hasKey ? 'Clé prête. Lance le jugement quand tu veux.' : 'Sans clé : jugement manuel ci-dessous (boutons A/B).') + '</div>' +
        '</div>' +
        '<div style="font-weight:700;font-size:.9rem;margin:.6rem 0">⚔️ Combats</div>' +
        '<div id="pma-admin-matches"><div class="loading-pulse" style="text-align:center;padding:.8rem">Chargement…</div></div>';

      var bs = document.getElementById('pma-brief-set');
      if (bs) bs.addEventListener('click', function () {
        var t = (document.getElementById('pma-brief-title').value || '').trim();
        var d2 = (document.getElementById('pma-brief-desc').value || '').trim();
        if (!t || !d2) { if (A.showToast) A.showToast('Titre + consigne requis', 'warning'); return; }
        A.db.ref('promptmon/briefs/current').set({ id: 'custom-' + Date.now(), title: t.slice(0, 80), desc: d2.slice(0, 400), ts: Date.now() }, function () {
          if (A.showToast) A.showToast('Brief lancé ✓', 'success'); renderJudgePanel(body);
        });
      });
      var br = document.getElementById('pma-brief-reset');
      if (br) br.addEventListener('click', function () {
        A.db.ref('promptmon/briefs/current').set(null, function () { if (A.showToast) A.showToast('Brief auto restauré', 'info'); renderJudgePanel(body); });
      });
      var gs = document.getElementById('pma-gkey-save');
      if (gs) gs.addEventListener('click', function () {
        var k = (document.getElementById('pma-gkey').value || '').trim();
        if (!k) { localStorage.removeItem(GKEY_LS); if (A.showToast) A.showToast('Clé effacée', 'info'); }
        else { localStorage.setItem(GKEY_LS, k); if (A.showToast) A.showToast('Clé enregistrée (cet appareil uniquement) ✓', 'success'); }
        document.getElementById('pma-gkey').value = '';
      });
      var jn = document.getElementById('pma-judge-now');
      if (jn) jn.addEventListener('click', function () {
        jn.disabled = true;
        judgePending(document.getElementById('pma-judge-status'), function () { jn.disabled = false; renderAdminMatches(); });
      });

      function renderAdminMatches() {
        var el = document.getElementById('pma-admin-matches'); if (!el) return;
        A.db.ref('promptmon/matches').limitToLast(60).once('value', function (snap) {
          var all = snap.val() || {};
          var ids = Object.keys(all).sort(function (x, y) { return (all[y].createdAt || 0) - (all[x].createdAt || 0); });
          if (!ids.length) { el.innerHTML = '<p style="color:var(--text-muted);font-size:.84rem">Aucun combat. Les matches se créent automatiquement quand 2 étudiants soumettent.</p>'; return; }
          el.innerHTML = ids.map(function (id) {
            var m = all[id]; var pending = m.status !== 'done';
            return '<div class="glass-card pm-card" style="padding:.7rem;margin-bottom:.6rem">' +
              '<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:.3rem;font-size:.78rem;margin-bottom:.4rem"><strong>' + esc(m.briefTitle || '') + '</strong>' +
                '<span>' + (pending ? '🕐 ' + esc(m.status) : '✅ done — ' + (m.judgedBy === 'ai' ? '🤖 IA' : '👨‍🏫 manuel')) + '</span></div>' +
              '<div style="display:flex;gap:.6rem;align-items:center;justify-content:center;flex-wrap:wrap">' +
                '<div style="text-align:center"><img src="' + esc(m.a.img) + '" style="width:110px;height:110px;object-fit:cover;border-radius:10px;border:2px solid ' + (m.winner === 'a' ? '#2ecc71' : 'var(--border-glass)') + '" alt="A"><div style="font-size:.7rem">A — ' + esc(m.a.name) + '</div>' +
                (pending ? '<button class="btn-outline btn-sm pma-win" data-id="' + id + '" data-w="a" style="cursor:pointer;margin-top:.25rem">A gagne</button>' : '') + '</div>' +
                '<div style="font-weight:900;color:var(--text-muted)">VS</div>' +
                '<div style="text-align:center"><img src="' + esc(m.b.img) + '" style="width:110px;height:110px;object-fit:cover;border-radius:10px;border:2px solid ' + (m.winner === 'b' ? '#2ecc71' : 'var(--border-glass)') + '" alt="B"><div style="font-size:.7rem">B — ' + esc(m.b.name) + '</div>' +
                (pending ? '<button class="btn-outline btn-sm pma-win" data-id="' + id + '" data-w="b" style="cursor:pointer;margin-top:.25rem">B gagne</button>' : '') + '</div>' +
              '</div>' +
              (m.reason ? '<div style="font-size:.74rem;color:var(--text-muted);text-align:center;margin-top:.35rem">« ' + esc(m.reason) + ' »</div>' : '') +
            '</div>';
          }).join('');
          el.querySelectorAll('.pma-win').forEach(function (b) {
            b.addEventListener('click', function () {
              var id = this.getAttribute('data-id'), w = this.getAttribute('data-w');
              A.db.ref('promptmon/matches/' + id).update({ status: 'done', winner: w, judgedBy: 'formateur', judgedAt: Date.now() }, function () { renderAdminMatches(); });
            });
          });
        });
      }
      renderAdminMatches();
    });
  }

  window.AIA = window.AIA || {};
  window.AIA.PROMPTMON_ARENA = { renderArena: renderArena, judgePending: judgePending, getActiveBrief: getActiveBrief };
})();
