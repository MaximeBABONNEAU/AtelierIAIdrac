/* ==============================================
   SOCIAL.JS — Peer Review + Mur live + Mentor Inbox
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  /* ============ PEER REVIEW ============ */
  var REVIEW_CRITERIA = [
    { id: 'clarity', label: 'Clarte du concept', desc: 'Le pitch est comprehensible en 30s ?' },
    { id: 'creativity', label: 'Creativite', desc: 'Originalite et angle differenciant ?' },
    { id: 'feasibility', label: 'Faisabilite marche', desc: 'Le produit pourrait reellement exister ?' }
  ];

  function loadAllReviews(callback) {
    if (!window.AIA.db) { callback({}); return; }
    window.AIA.db.ref('reviews').once('value', function (snap) {
      callback(snap.val() || {});
    });
  }

  function saveReview(reviewerKey, targetKey, scores, comment, callback) {
    var AIA = window.AIA;
    if (!AIA.db) { if (callback) callback({ error: 'Firebase indisponible' }); return; }
    var overall = Math.round((scores.clarity + scores.creativity + scores.feasibility) / 3 * 10) / 10;
    var entry = {
      ts: new Date().toISOString(),
      clarity: scores.clarity, creativity: scores.creativity, feasibility: scores.feasibility,
      comment: comment, overall: overall, reviewerKey: reviewerKey
    };
    AIA.db.ref('reviews/' + reviewerKey + '/' + targetKey).set(entry, function (err) {
      if (err) { if (callback) callback({ error: String(err) }); return; }
      if (AIA.addXP) AIA.addXP(2, 'Peer review ecrite');
      pushFeed({ actorKey: reviewerKey, action: 'reviewed', target: targetKey, overall: overall });
      var st = AIA.getState();
      st.reviewsGiven = (st.reviewsGiven || 0) + 1;
      if (st.reviewsGiven >= 5 && AIA.awardBadge) AIA.awardBadge('helper');
      if (AIA.saveState) AIA.saveState();
      if (callback) callback({ success: true });
    });
  }

  function renderPeerReview(main) {
    var AIA = window.AIA;
    var st = AIA.getState();
    if (!AIA.db) {
      main.innerHTML = '<div class="page-header"><h1>Peer <span class="gradient-text">Review</span></h1></div>' +
        '<div class="glass-card" style="padding:2rem;text-align:center">Firebase indisponible.</div>';
      return;
    }
    main.innerHTML = '<div class="page-header"><h1>Peer <span class="gradient-text">Review</span></h1>' +
      '<p class="page-subtitle">Reviewez 5 campagnes anonymes de vos camarades pour debloquer le badge Aidant (+2 XP par review)</p></div>' +
      '<div id="peer-content"><div class="loading-pulse" style="padding:2rem;text-align:center">Chargement...</div></div>';
    var content = document.getElementById('peer-content');

    AIA.db.ref('states').once('value', function (snap) {
      var all = snap.val() || {};
      var myKey = st.user && st.user.accountKey;
      var pool = [];
      Object.keys(all).forEach(function (k) {
        if (k === myKey) return;
        var s = all[k];
        if (!s.productTheme) return;
        var done = s.gameDeliverables ? Object.keys(s.gameDeliverables).filter(function (x) { return s.gameDeliverables[x]; }).length : 0;
        if (done < 3) return;
        pool.push({ key: k, name: (s.user && s.user.name) || k, theme: s.productTheme, done: done, campaignData: s.campaignData || {} });
      });

      loadAllReviews(function (allReviews) {
        var myReviews = allReviews[myKey] || {};
        var html = '';
        if (pool.length === 0) {
          html = '<div class="glass-card" style="padding:2rem;text-align:center"><div style="font-size:2.5rem">⏳</div>' +
            '<h3>Pas encore assez de campagnes a reviewer</h3>' +
            '<p style="color:var(--text-muted)">Vos camarades doivent d\'abord valider au moins 3 etapes Game pour apparaitre ici. Revenez plus tard !</p></div>';
        } else {
          var reviewed = pool.filter(function (p) { return myReviews[p.key]; });
          var pending = pool.filter(function (p) { return !myReviews[p.key]; });
          html += '<div class="peer-stats glass-card">' +
            '<div class="pstat"><div class="pn">' + reviewed.length + '</div><div class="pl">Reviewes</div></div>' +
            '<div class="pstat"><div class="pn">' + pending.length + '</div><div class="pl">Disponibles</div></div>' +
            '<div class="pstat"><div class="pn">' + (st.reviewsGiven || 0) + '</div><div class="pl">Total XP : +' + ((st.reviewsGiven || 0) * 2) + '</div></div>' +
            '</div>';
          html += '<div class="peer-grid">' +
            pool.map(function (p) {
              var alreadyDone = !!myReviews[p.key];
              return '<div class="peer-card glass-card' + (alreadyDone ? ' done' : '') + '" data-target="' + p.key + '">' +
                '<div class="peer-card-header">' +
                '<span class="peer-emoji">' + (p.theme.emoji || '🎯') + '</span>' +
                '<div><h3>' + escapeHtml(p.theme.name) + '</h3>' +
                '<div class="peer-cat">' + escapeHtml(p.theme.category || '') + '</div></div>' +
                (alreadyDone ? '<span class="peer-done-badge">✓ Reviewe</span>' : '') +
                '</div>' +
                '<p class="peer-tagline">' + escapeHtml(p.theme.tagline || '') + '</p>' +
                '<div class="peer-meta">📊 ' + p.done + '/12 etapes &bull; Anonyme</div>' +
                '<button class="btn-primary peer-open" data-target="' + p.key + '">' + (alreadyDone ? 'Modifier' : 'Reviewer →') + '</button>' +
                '</div>';
            }).join('') +
            '</div>';
        }
        content.innerHTML = html;
        wirePeerCards(pool, myReviews);
      });
    });
  }

  function wirePeerCards(pool, myReviews) {
    document.querySelectorAll('.peer-open').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tkey = this.getAttribute('data-target');
        var target = pool.find(function (p) { return p.key === tkey; });
        if (target) openReviewModal(target, myReviews[tkey]);
      });
    });
  }

  function openReviewModal(target, existing) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var myKey = st.user.accountKey;
    var overlay = document.createElement('div');
    overlay.className = 'review-overlay';
    overlay.innerHTML = '<div class="review-modal">' +
      '<button class="review-close">✕</button>' +
      '<h2>' + (target.theme.emoji || '🎯') + ' ' + escapeHtml(target.theme.name) + '</h2>' +
      '<p class="review-tagline">' + escapeHtml(target.theme.tagline || '') + '</p>' +
      '<div class="review-form">' +
      REVIEW_CRITERIA.map(function (c) {
        var current = existing ? existing[c.id] : 0;
        return '<div class="review-crit">' +
          '<label>' + escapeHtml(c.label) + ' <span class="rev-desc">' + escapeHtml(c.desc) + '</span></label>' +
          '<div class="star-row" data-crit="' + c.id + '">' +
          [1,2,3,4,5].map(function (n) {
            return '<button class="star-btn' + (n <= current ? ' on' : '') + '" data-val="' + n + '">★</button>';
          }).join('') +
          '</div>' +
          '</div>';
      }).join('') +
      '<label>Commentaire (constructif !)</label>' +
      '<textarea id="review-comment" rows="3" placeholder="Ce qui marche / piste d\'amelioration / ce que vous garderiez...">' + (existing ? escapeHtml(existing.comment || '') : '') + '</textarea>' +
      '<div class="review-actions">' +
      '<button class="btn-outline review-skip">Plus tard</button>' +
      '<button class="btn-primary review-submit">' + (existing ? 'Mettre a jour' : 'Soumettre (+2 XP)') + '</button>' +
      '</div>' +
      '</div></div>';
    document.body.appendChild(overlay);

    var scores = { clarity: existing ? existing.clarity : 0, creativity: existing ? existing.creativity : 0, feasibility: existing ? existing.feasibility : 0 };
    overlay.querySelectorAll('.star-row').forEach(function (row) {
      var crit = row.getAttribute('data-crit');
      row.querySelectorAll('.star-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var v = parseInt(this.getAttribute('data-val'));
          scores[crit] = v;
          row.querySelectorAll('.star-btn').forEach(function (b) {
            b.classList.toggle('on', parseInt(b.getAttribute('data-val')) <= v);
          });
        });
      });
    });
    overlay.querySelector('.review-close').addEventListener('click', function () { overlay.remove(); });
    overlay.querySelector('.review-skip').addEventListener('click', function () { overlay.remove(); });
    overlay.querySelector('.review-submit').addEventListener('click', function () {
      if (!scores.clarity || !scores.creativity || !scores.feasibility) {
        AIA.showToast('Notez les 3 criteres', 'warning'); return;
      }
      var comment = overlay.querySelector('#review-comment').value.trim();
      if (comment.length < 10) { AIA.showToast('Commentaire trop court (10+ caracteres)', 'warning'); return; }
      saveReview(myKey, target.key, scores, comment, function (res) {
        if (res.error) AIA.showToast(res.error, 'error');
        else {
          AIA.showToast('Review enregistree !', 'success');
          overlay.remove();
          AIA.navigateTo('peer-review');
        }
      });
    });
  }

  /* ============ ACTIVITY FEED — Mur de campagne live ============ */
  function pushFeed(entry) {
    var AIA = window.AIA;
    if (!AIA.db) return;
    var st = AIA.getState();
    // Robustesse : actorKey/actorName toujours definis (Firebase rejette les valeurs undefined).
    var actorKey = entry.actorKey || (st.user && st.user.accountKey) || 'anon';
    var actorName = entry.actorName || (st.user && st.user.name) ||
      (st.user && ((st.user.firstName || '') + ' ' + (st.user.lastName || '')).trim()) || actorKey;
    var item = {
      id: 'act_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      actorKey: actorKey,
      actorName: actorName || 'Etudiant',
      action: entry.action || 'activity',
      target: entry.target || '',
      overall: (entry.overall == null ? null : entry.overall),
      ts: new Date().toISOString()
    };
    AIA.db.ref('activity_feed/' + item.id).set(item);
  }

  function renderWall(main) {
    var AIA = window.AIA;
    if (!AIA.db) {
      main.innerHTML = '<div class="page-header"><h1>Mur <span class="gradient-text">live</span></h1></div>' +
        '<div class="glass-card" style="padding:2rem;text-align:center">Firebase indisponible.</div>';
      return;
    }
    main.innerHTML = '<div class="page-header"><h1>Mur <span class="gradient-text">Live</span></h1>' +
      '<p class="page-subtitle">Feed temps reel des productions de la classe</p></div>' +
      '<div id="wall-feed"><div class="loading-pulse" style="padding:2rem;text-align:center">Chargement...</div></div>';

    AIA.db.ref('activity_feed').limitToLast(50).on('value', function (snap) {
      var data = snap.val() || {};
      var items = Object.values(data).sort(function (a, b) { return (b.ts || '').localeCompare(a.ts || ''); });
      var feedEl = document.getElementById('wall-feed');
      if (!feedEl) return;
      if (items.length === 0) {
        feedEl.innerHTML = '<div class="glass-card" style="padding:2rem;text-align:center"><div style="font-size:2.5rem">📡</div>' +
          '<h3>Le mur est vide pour l\'instant</h3>' +
          '<p style="color:var(--text-muted)">Les actions de vos camarades apparaitront ici en temps reel (validations, badges, votes, reviews).</p></div>';
        return;
      }
      var ACT_ICONS = {
        'reviewed': '⭐', 'step-done': '✅', 'badge-unlocked': '🏅',
        'voted': '♥️', 'demo-done': '🛠️', 'highlight-done': '⚡',
        'campaign-export': '📤', 'theme-picked': '🎯',
        'boss-win': '🏆', 'boss-try': '🤖', 'boss-solo': '👹'
      };
      feedEl.innerHTML = '<div class="wall-feed">' +
        items.map(function (item) {
          var icon = ACT_ICONS[item.action] || '✨';
          var msg = renderActionMessage(item);
          var ago = relativeTime(item.ts);
          return '<div class="wall-item">' +
            '<div class="wall-icon">' + icon + '</div>' +
            '<div class="wall-body">' +
            '<div class="wall-actor">' + escapeHtml(item.actorName) + '</div>' +
            '<div class="wall-msg">' + msg + '</div>' +
            '<div class="wall-time">' + ago + '</div>' +
            '</div></div>';
        }).join('') +
        '</div>';
    });
  }

  function renderActionMessage(item) {
    switch (item.action) {
      case 'reviewed': return 'a review une campagne (' + escapeHtml(String(item.overall == null ? '?' : item.overall)) + '/5)';
      case 'step-done': return 'a valide une etape Business Game : <strong>' + escapeHtml(item.target) + '</strong>';
      case 'badge-unlocked': return 'a debloque le badge <strong>' + escapeHtml(item.target) + '</strong>';
      case 'voted': return 'a vote pour une campagne';
      case 'demo-done': return 'a teste la demo <strong>' + escapeHtml(item.target) + '</strong>';
      case 'highlight-done': return 'a complete <strong>' + escapeHtml(item.target) + '</strong>';
      case 'campaign-export': return 'a exporte sa campagne 🚢';
      case 'theme-picked': return 'a choisi son projet : <strong>' + escapeHtml(item.target) + '</strong>';
      case 'boss-win': return 'a <strong>BATTU le Prof</strong> 🏆 — exploit l&eacute;gendaire !';
      case 'boss-try': return 'a os&eacute; d&eacute;fier <strong>le Prof</strong> 🤖';
      case 'boss-solo': return 'a vaincu un boss solo : <strong>' + escapeHtml(item.target) + '</strong> 👹';
      default: return 'a fait quelque chose...';
    }
  }

  function relativeTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    var diff = Date.now() - d.getTime();
    if (diff < 60000) return 'il y a quelques secondes';
    if (diff < 3600000) return 'il y a ' + Math.floor(diff / 60000) + ' min';
    if (diff < 86400000) return 'il y a ' + Math.floor(diff / 3600000) + 'h';
    return 'il y a ' + Math.floor(diff / 86400000) + ' j';
  }

  /* ============ MENTOR INBOX ============ */
  function renderInbox(main) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var myKey = st.user && st.user.accountKey;
    var isAdmin = st.user && st.user.isAdmin;
    if (!AIA.db) {
      main.innerHTML = '<div class="page-header"><h1>Inbox</h1></div><div class="glass-card" style="padding:2rem">Firebase indisponible.</div>';
      return;
    }
    if (isAdmin) return renderAdminInbox(main);

    main.innerHTML = '<div class="page-header"><h1>Mentor <span class="gradient-text">Inbox</span></h1>' +
      '<p class="page-subtitle">Messages async entre vous et le formateur</p></div>' +
      '<div id="inbox-thread"><div class="loading-pulse" style="padding:2rem;text-align:center">Chargement...</div></div>';

    AIA.db.ref('inbox/' + myKey).on('value', function (snap) {
      var data = snap.val() || {};
      var msgs = Object.values(data).sort(function (a, b) { return (a.ts || '').localeCompare(b.ts || ''); });
      renderThread(myKey, msgs, 'student');
    });
  }

  function renderThread(targetKey, msgs, viewer) {
    var thread = document.getElementById('inbox-thread') || document.getElementById('admin-inbox-thread');
    if (!thread) return;
    var html = '<div class="inbox-thread">';
    if (msgs.length === 0) {
      html += '<p style="text-align:center;color:var(--text-muted);padding:1rem">Aucun message pour le moment. Ecrivez ci-dessous pour demarrer !</p>';
    } else {
      msgs.forEach(function (m) {
        var mine = (viewer === 'student' && m.from === 'student') || (viewer === 'admin' && m.from === 'admin');
        html += '<div class="msg-bubble ' + (mine ? 'mine' : 'theirs') + '">' +
          '<div class="msg-text">' + escapeHtml(m.text).replace(/\n/g, '<br>') + '</div>' +
          '<div class="msg-meta">' + (m.from === 'admin' ? '🎓 Formateur' : '👤 Etudiant') + ' &bull; ' + relativeTime(m.ts) + '</div>' +
          '</div>';
      });
    }
    html += '</div>' +
      '<div class="inbox-composer">' +
      '<textarea id="inbox-input" rows="2" placeholder="Votre message..."></textarea>' +
      '<button class="btn-primary inbox-send" data-target="' + targetKey + '">Envoyer</button>' +
      '</div>';
    thread.innerHTML = html;

    var send = thread.querySelector('.inbox-send');
    if (send) send.addEventListener('click', function () {
      var input = document.getElementById('inbox-input');
      var txt = input.value.trim();
      if (txt.length < 3) { window.AIA.showToast('Message trop court', 'warning'); return; }
      var st = window.AIA.getState();
      var from = (st.user && st.user.isAdmin) ? 'admin' : 'student';
      var msg = { id: 'msg_' + Date.now(), from: from, text: txt, ts: new Date().toISOString() };
      window.AIA.db.ref('inbox/' + targetKey + '/' + msg.id).set(msg, function () {
        input.value = '';
        window.AIA.showToast('Message envoye', 'success');
      });
    });
  }

  function renderAdminInbox(main) {
    var AIA = window.AIA;
    main.innerHTML = '<div class="page-header"><h1>Mentor <span class="gradient-text">Inbox</span> &bull; Admin</h1>' +
      '<p class="page-subtitle">Conversations avec tous les etudiants</p></div>' +
      '<div class="admin-inbox-layout">' +
      '<div class="inbox-list" id="inbox-list"><div class="loading-pulse" style="padding:1rem">Chargement...</div></div>' +
      '<div class="inbox-detail" id="admin-inbox-thread"><p style="padding:2rem;text-align:center;color:var(--text-muted)">Selectionnez un etudiant a gauche pour voir la conversation.</p></div>' +
      '</div>';

    AIA.db.ref('inbox').on('value', function (snap) {
      var allInbox = snap.val() || {};
      var list = document.getElementById('inbox-list');
      if (!list) return;
      var keys = Object.keys(allInbox);
      if (keys.length === 0) {
        list.innerHTML = '<p style="padding:1rem;color:var(--text-muted);font-size:0.85rem">Pas encore de conversation. Les etudiants peuvent vous ecrire depuis leur page Inbox.</p>';
        return;
      }
      AIA.db.ref('accounts').once('value', function (accSnap) {
        var accts = accSnap.val() || {};
        list.innerHTML = keys.map(function (k) {
          var msgs = allInbox[k] || {};
          var msgArr = Object.values(msgs);
          var lastMsg = msgArr.length ? msgArr[msgArr.length - 1] : null;
          var acc = accts[k] || {};
          var name = ((acc.firstName || '') + ' ' + (acc.lastName || '')).trim() || k;
          var unread = msgArr.filter(function (m) { return m.from === 'student'; }).length;
          return '<div class="inbox-item" data-student-key="' + k + '">' +
            '<div class="ii-name">' + escapeHtml(name) + '</div>' +
            '<div class="ii-snippet">' + (lastMsg ? escapeHtml(lastMsg.text.substring(0, 40)) + '...' : '') + '</div>' +
            (unread > 0 ? '<span class="ii-badge">' + unread + '</span>' : '') +
            '</div>';
        }).join('');

        document.querySelectorAll('.inbox-item').forEach(function (it) {
          it.addEventListener('click', function () {
            var key = this.getAttribute('data-student-key');
            document.querySelectorAll('.inbox-item').forEach(function (i) { i.classList.remove('active'); });
            this.classList.add('active');
            var msgArr = Object.values(allInbox[key] || {}).sort(function (a, b) { return (a.ts || '').localeCompare(b.ts || ''); });
            renderThread(key, msgArr, 'admin');
          });
        });
      });
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  window.AIA = window.AIA || {};
  window.AIA.renderPeerReview = renderPeerReview;
  window.AIA.renderWall = renderWall;
  window.AIA.renderInbox = renderInbox;
  window.AIA.pushFeed = pushFeed;
  window.AIA.REVIEW_CRITERIA = REVIEW_CRITERIA;
})();
