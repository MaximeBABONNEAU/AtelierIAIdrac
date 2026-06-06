/* ==============================================
   ADMIN.JS — Dashboard Formateur
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function initAdmin() {
    var root = document.getElementById('admin-root');
    if (!root) return;
    var AIA = window.AIA;
    var CONFIG = AIA.CONFIG;
    var PROGRAM = AIA.PROGRAM;

    var adminAsStudent = AIA.getAdminAsStudent ? AIA.getAdminAsStudent() : false;
    root.innerHTML =
      '<div class="admin-mode-bar">' +
      '<label class="admin-student-mode">' +
      '<input type="checkbox" id="admin-student-toggle"' + (adminAsStudent ? ' checked' : '') + '>' +
      '<span class="admin-toggle-slider"></span>' +
      '<span class="admin-toggle-label">👁️ Mode etudiant <small>(voir comme un etudiant)</small></span>' +
      '</label>' +
      '</div>' +
      '<div class="admin-tabs">' +
      '<button class="admin-tab active" data-tab="overview">Vue d\'ensemble</button>' +
      '<button class="admin-tab" data-tab="cockpit">🛰️ Cockpit live</button>' +
      '<button class="admin-tab" data-tab="unlocks">🔓 Deverrouillage</button>' +
      '<button class="admin-tab" data-tab="accounts">Comptes</button>' +
      '<button class="admin-tab" data-tab="campaigns">🎯 Campagnes</button>' +
      '<button class="admin-tab" data-tab="students">Etudiants</button>' +
      '<button class="admin-tab" data-tab="course">Cours</button>' +
      '<button class="admin-tab" data-tab="submissions">Activites</button>' +
      '<button class="admin-tab" data-tab="analytics">Analytics</button>' +
      '<button class="admin-tab" data-tab="settings">Parametres</button>' +
      '</div>' +
      '<div id="admin-content"></div>';

    var modeToggle = document.getElementById('admin-student-toggle');
    if (modeToggle) {
      modeToggle.addEventListener('change', function () {
        if (AIA.setAdminAsStudent) AIA.setAdminAsStudent(this.checked);
      });
    }

    var currentTab = 'overview';
    var students = {};

    if (AIA.db) {
      AIA.db.ref('students').on('value', function (snap) {
        var data = snap.val();
        if (data) {
          students = data;
          if (currentTab === 'overview' || currentTab === 'students' || currentTab === 'analytics') {
            renderTab(currentTab);
          }
        }
      });
    } else {
      var FAKE = ['Alice','Bob','Clara','David','Emma','Felix','Grace','Hugo','Iris','Jules',
        'Kenza','Leo','Manon','Nathan','Olivia','Paul','Quinn','Rose','Simon','Theo',
        'Ursula','Victor','Wendy','Xavier','Yasmine','Zoe','Adam','Bea','Cyril','Dana'];
      var pages = ['dashboard','program','demos','arena','game','room','leaderboard','tools','profile'];
      for (var i = 0; i < 30; i++) {
        var nm = FAKE[i];
        students[nm.toLowerCase()] = {
          name: nm,
          online: Math.random() > 0.35,
          xp: Math.floor(Math.random() * 1200),
          badges: Math.floor(Math.random() * 12),
          page: pages[Math.floor(Math.random() * pages.length)],
          progress: Math.floor(Math.random() * 24)
        };
      }
    }

    document.querySelectorAll('.admin-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.admin-tab').forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');
        currentTab = this.getAttribute('data-tab');
        renderTab(currentTab);
      });
    });

    function renderTab(tab) {
      var content = document.getElementById('admin-content');
      // Clean up any previous live listener from the campaigns / cockpit tabs
      if (_campaignsListener && AIA.db) { try { AIA.db.ref('states').off('value', _campaignsListener); } catch(e){} _campaignsListener = null; }
      if (_cockpitListener && AIA.db) { try { AIA.db.ref('students').off('value', _cockpitListener); } catch(e){} _cockpitListener = null; }
      if (tab === 'overview') renderOverview(content);
      else if (tab === 'cockpit') renderCockpit(content);
      else if (tab === 'unlocks') renderUnlocks(content);
      else if (tab === 'accounts') renderAccounts(content);
      else if (tab === 'campaigns') renderCampaigns(content);
      else if (tab === 'students') renderStudents(content);
      else if (tab === 'course') renderCourse(content);
      else if (tab === 'submissions') renderSubmissions(content);
      else if (tab === 'analytics') renderAnalytics(content);
      else if (tab === 'settings') renderSettings(content);
    }

    var _campaignsListener = null;
    var _cockpitListener = null;

    /* ======== COCKPIT TAB — pilotage live (monitoring + communication) ======== */
    function fmtAgo(ts) {
      if (!ts) return 'jamais';
      var m = Math.floor((Date.now() - ts) / 60000);
      if (m < 1) return "a l'instant";
      if (m < 60) return 'il y a ' + m + ' min';
      return 'il y a ' + Math.floor(m / 60) + 'h';
    }
    function pageLabel(p) {
      var map = { dashboard: 'Accueil', 'business-game': 'Business Game', demos: 'Demos', workbook: 'Carnet', lightning: 'Lightning', showcase: 'Showcase', highlights: 'Temps Forts', leaderboard: 'Classement', arena: 'Arene', journal: 'Journal', avatar: 'Avatar', profile: 'Profil', resources: 'Ressources' };
      return map[p] || p || '?';
    }
    function renderCockpit(el) {
      if (!AIA.db) { el.innerHTML = '<div class="glass-card" style="padding:2rem;text-align:center">Firebase non connecte.</div>'; return; }
      el.innerHTML =
        '<div class="admin-section glass-card cockpit-live-launch">' +
        '<div><h3 style="margin:0">📺 Mode Live (partage d\'ecran)</h3>' +
        '<p style="color:var(--text-muted);margin:0.3rem 0 0">Vue plein ecran immersive a projeter : classement, activite en direct, dernieres creations, temps fort. (Echap pour quitter)</p></div>' +
        '<button class="btn-primary" id="cockpit-live-btn">🚀 Lancer le Mode Live</button>' +
        '</div>' +
        '<div class="admin-section glass-card">' +
        '<h3>📣 Annonce a toute la classe</h3>' +
        '<div class="cockpit-announce-row">' +
        '<input type="text" id="cockpit-msg" class="demo-input" placeholder="Ex: On passe au Showcase dans 5 min, finalisez votre persona !" maxlength="180">' +
        '<button class="btn-primary" id="cockpit-send">Envoyer</button></div>' +
        '<div id="cockpit-announce-status" class="cockpit-status"></div>' +
        '</div>' +
        '<div class="admin-section glass-card">' +
        '<h3>🛰️ Suivi live de la classe <span id="cockpit-count" class="cockpit-count"></span></h3>' +
        '<p style="color:var(--text-muted)">Les etudiants en difficulte (inactifs &gt; 6 min ou en retard) remontent en haut.</p>' +
        '<div id="cockpit-live"><div class="loading-pulse" style="padding:2rem;text-align:center">Chargement...</div></div>' +
        '</div>';
      var liveBtn = document.getElementById('cockpit-live-btn');
      if (liveBtn) liveBtn.addEventListener('click', function () { if (AIA.renderLiveMode) AIA.renderLiveMode(); });
      var send = document.getElementById('cockpit-send');
      if (send) send.addEventListener('click', function () {
        var inp = document.getElementById('cockpit-msg');
        var msg = (inp.value || '').trim();
        if (msg.length < 2) { AIA.showToast('Ecrivez une annonce', 'warning'); return; }
        AIA.db.ref('announcements').push({ message: msg, ts: Date.now(), from: 'Formateur' }, function () {
          inp.value = '';
          var st = document.getElementById('cockpit-announce-status');
          if (st) st.textContent = '✅ Annonce envoyee a toute la classe';
          AIA.showToast('Annonce envoyee', 'success');
        });
      });
      // Detacher tout listener cockpit precedent (meme issu d'une closure initAdmin anterieure) pour eviter l'orphelin.
      if (window.__aiaCockpitOff) { try { window.__aiaCockpitOff(); } catch (e) {} }
      _cockpitListener = AIA.db.ref('students').on('value', function (snap) { renderCockpitLive(snap.val() || {}); });
      window.__aiaCockpitOff = function () { try { AIA.db.ref('students').off('value', _cockpitListener); } catch (e) {} _cockpitListener = null; };
    }

    function renderCockpitLive(students) {
      var liveEl = document.getElementById('cockpit-live');
      if (!liveEl) return;
      var rows = Object.keys(students).map(function (k) {
        var s = students[k] || {};
        return { key: k, name: s.name || k, xp: s.xp || 0, progress: s.progress || 0, page: s.page || '?', online: !!s.online, lastSeen: s.lastSeen || 0 };
      });
      if (!rows.length) { liveEl.innerHTML = '<div class="glass-card" style="padding:2rem;text-align:center">Aucun etudiant connecte pour le moment.</div>'; return; }
      var progs = rows.map(function (r) { return r.progress; }).sort(function (a, b) { return a - b; });
      var median = progs[Math.floor((progs.length - 1) / 2)] || 0; // mediane basse (non biaisee pour n pair)
      var IDLE_MS = 6 * 60000;
      rows.forEach(function (r) {
        // En ligne sans lastSeen encore ecrit (connexion toute fraiche) = pas inactif.
        var idle = !r.online || (!!r.lastSeen && (Date.now() - r.lastSeen) > IDLE_MS);
        var behind = median >= 2 && r.progress < median / 2;
        r.flag = idle ? 'idle' : (behind ? 'behind' : '');
        r.attention = !!r.flag;
      });
      rows.sort(function (a, b) {
        if (a.attention !== b.attention) return a.attention ? -1 : 1;
        return (b.lastSeen || 0) - (a.lastSeen || 0);
      });
      var nAttention = rows.filter(function (r) { return r.attention; }).length;
      var cnt = document.getElementById('cockpit-count');
      if (cnt) cnt.textContent = rows.length + ' connectes' + (nAttention ? ' • ' + nAttention + ' a surveiller' : '');
      var html = '<table class="admin-table full"><thead><tr><th></th><th>Etudiant</th><th>Statut</th><th>Page</th><th>Progression</th><th>XP</th><th>Vu</th><th></th></tr></thead><tbody>';
      rows.forEach(function (r) {
        var flagIcon = r.flag === 'idle' ? '<span class="cockpit-flag idle" title="Inactif">⚠️</span>' : r.flag === 'behind' ? '<span class="cockpit-flag behind" title="En retard">🐢</span>' : '';
        var dot = r.online ? '<span class="dot online"></span>' : '<span class="dot idle"></span>';
        html += '<tr class="' + (r.attention ? 'cockpit-attention' : '') + '">' +
          '<td>' + flagIcon + '</td>' +
          '<td><strong>' + escapeHtml(r.name) + '</strong></td>' +
          '<td>' + dot + ' ' + (r.online ? 'en ligne' : 'hors ligne') + '</td>' +
          '<td>' + escapeHtml(pageLabel(r.page)) + '</td>' +
          '<td><div class="phase-progress-bar"><div class="phase-progress-fill" style="width:' + Math.min(100, r.progress * 8) + '%"></div></div><span style="font-size:0.68rem;color:var(--text-muted)">' + r.progress + ' act.</span></td>' +
          '<td>' + r.xp + '</td>' +
          '<td style="font-size:0.72rem;color:var(--text-muted)">' + fmtAgo(r.lastSeen) + '</td>' +
          '<td><button class="btn-ghost btn-xs cockpit-msg-btn" data-key="' + escapeHtml(r.key) + '" data-name="' + escapeHtml(r.name) + '">💬</button></td>' +
          '</tr>';
      });
      html += '</tbody></table>';
      liveEl.innerHTML = html;
      liveEl.querySelectorAll('.cockpit-msg-btn').forEach(function (btn) {
        btn.addEventListener('click', function () { openQuickMessage(this.getAttribute('data-key'), this.getAttribute('data-name')); });
      });
    }

    function openQuickMessage(key, name) {
      // Fermer + detacher un thread deja ouvert (evite l'accumulation de listeners /inbox).
      if (window.__aiaThreadOff) { try { window.__aiaThreadOff(); } catch (e) {} }
      var overlay = document.createElement('div');
      overlay.className = 'sd-overlay';
      overlay.innerHTML = '<div class="sd-modal" style="max-width:520px">' +
        '<div class="sd-head"><h3>💬 ' + escapeHtml(name) + '</h3><button class="sd-close">✕</button></div>' +
        '<div class="cockpit-thread" id="cockpit-thread"><div class="loading-pulse">Chargement...</div></div>' +
        '<div class="cockpit-thread-input"><input type="text" id="cockpit-thread-msg" class="demo-input" placeholder="Votre message..." maxlength="300"><button class="btn-primary" id="cockpit-thread-send">Envoyer</button></div>' +
        '</div>';
      document.body.appendChild(overlay);
      var threadListener = null;
      var close = function () { if (threadListener && AIA.db) { try { AIA.db.ref('inbox/' + key).off('value', threadListener); } catch (e) {} } if (window.__aiaThreadOff === close) window.__aiaThreadOff = null; overlay.remove(); };
      window.__aiaThreadOff = close;
      overlay.querySelector('.sd-close').addEventListener('click', close);
      overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
      var threadEl = overlay.querySelector('#cockpit-thread');
      if (AIA.db) {
        threadListener = AIA.db.ref('inbox/' + key).on('value', function (snap) {
          var msgs = snap.val() || {};
          var arr = Object.keys(msgs).map(function (id) { return msgs[id]; }).sort(function (a, b) { return (a.ts || 0) - (b.ts || 0); });
          threadEl.innerHTML = arr.length ? arr.map(function (m) {
            return '<div class="cockpit-bubble ' + (m.from === 'admin' ? 'mine' : 'theirs') + '">' + escapeHtml(m.text || '') + '</div>';
          }).join('') : '<p style="color:var(--text-muted);text-align:center;padding:1rem">Aucun message. Demarrez la conversation.</p>';
          threadEl.scrollTop = threadEl.scrollHeight;
        });
      }
      var sendMsg = function () {
        var inp = overlay.querySelector('#cockpit-thread-msg');
        var txt = (inp.value || '').trim();
        if (!txt || !AIA.db) return;
        AIA.db.ref('inbox/' + key).push({ from: 'admin', text: txt, ts: Date.now() }, function () { inp.value = ''; });
      };
      overlay.querySelector('#cockpit-thread-send').addEventListener('click', sendMsg);
      overlay.querySelector('#cockpit-thread-msg').addEventListener('keydown', function (e) { if (e.key === 'Enter') sendMsg(); });
    }

    /* ======== UNLOCKS TAB — Admin controls the timeline ======== */
    var DEMOS_LIST = [
      // Day 1
      { id: 'demo-prompt', icon: '✍️', title: 'Prompt Playground', day: 1 },
      { id: 'demo-chatbot', icon: '💬', title: 'Chatbot Marketing', day: 1 },
      { id: 'demo-vqa', icon: '👁️', title: 'Analyse Visuelle', day: 1 },
      { id: 'demo-translate', icon: '🌍', title: 'Traduction', day: 1 },
      // Day 2
      { id: 'demo-image', icon: '🎨', title: 'Generation Images', day: 2 },
      { id: 'demo-logo', icon: '🆎', title: 'Generateur Logos', day: 2 },
      { id: 'demo-bg-remove', icon: '🖼️', title: 'Suppression Fond', day: 2 },
      { id: 'demo-upscale', icon: '🔍', title: 'Upscaler', day: 2 },
      { id: 'demo-sentiment', icon: '😊', title: 'Sentiment', day: 2 },
      // Day 3
      { id: 'demo-music', icon: '🎵', title: 'Generation Musicale', day: 3 },
      { id: 'demo-tts', icon: '🗣️', title: 'Voix Off TTS', day: 3 },
      { id: 'demo-avatar', icon: '🎬', title: 'Avatar Video', day: 3 },
      { id: 'demo-abtest', icon: '📊', title: 'A/B Testing', day: 3 },
      // Day 4
      { id: 'demo-seo', icon: '🔍', title: 'SEO Analyzer', day: 4 },
      { id: 'demo-speech', icon: '🎙️', title: 'Transcription Vocale', day: 4 }
    ];

    function renderUnlocks(el) {
      var unlocks = (AIA.getUnlocks ? AIA.getUnlocks() : {}) || {};
      var demosUL = unlocks.demos || {};
      var hlsUL = unlocks.highlights || {};
      var phasesUL = unlocks.phases || {};
      var HIGHLIGHTS = AIA.HIGHLIGHTS || [];
      var PHASES = AIA.PHASES_GUIDE || {};

      function chip(type, id, label, unlocked) {
        return '<label class="unlock-row' + (unlocked ? ' on' : '') + '">' +
          '<input type="checkbox"' + (unlocked ? ' checked' : '') + ' data-unlock-type="' + type + '" data-unlock-id="' + id + '">' +
          '<span class="unlock-slider"></span>' +
          '<span class="unlock-label">' + label + '</span>' +
          '</label>';
      }

      var html =
        '<div class="admin-section glass-card">' +
        '<h3>🔓 Deverrouillage du parcours</h3>' +
        '<p style="color:var(--text-muted)">Activez chaque element au bon moment du cours. Les etudiants voient les changements en temps reel.</p>' +
        '<div class="unlocks-bulk">' +
        '<button class="btn-outline btn-sm" data-bulk-all="on">🔓 Tout deverrouiller</button> ' +
        '<button class="btn-outline btn-sm" data-bulk-all="off">🔒 Tout verrouiller</button>' +
        '</div>' +
        '</div>';

      // BUSINESS GAME PHASES
      html += '<div class="admin-section glass-card">' +
        '<h3>🎯 Phases Business Game</h3>';
      Object.keys(PHASES).forEach(function (pk) {
        var p = PHASES[pk];
        html += chip('phases', pk, p.icon + ' ' + p.title, !!phasesUL[pk]);
      });
      html += '</div>';

      // HIGHLIGHTS (grouped by day)
      html += '<div class="admin-section glass-card">' +
        '<h3>⚡ Temps Forts (' + HIGHLIGHTS.length + ')</h3>' +
        '<div class="unlocks-bulk">' +
        [1, 2, 3, 4].map(function (d) {
          return '<button class="btn-outline btn-sm" data-bulk-day-hl="' + d + '">Tout J' + d + '</button>';
        }).join(' ') +
        '</div>';
      [1, 2, 3, 4].forEach(function (day) {
        var dayHL = HIGHLIGHTS.filter(function (h) { return h.day === day; });
        if (!dayHL.length) return;
        html += '<h4 style="margin-top:1rem">Jour ' + day + '</h4>';
        dayHL.forEach(function (h) {
          html += chip('highlights', h.id, h.icon + ' ' + h.timeStart + ' &mdash; ' + h.title + ' <span class="unlock-xp">+' + h.xp + ' XP</span>', !!hlsUL[h.id]);
        });
      });
      html += '</div>';

      // DEMOS (grouped by day)
      html += '<div class="admin-section glass-card">' +
        '<h3>🛠️ Demos IA (' + DEMOS_LIST.length + ')</h3>' +
        '<div class="unlocks-bulk">' +
        [1, 2, 3, 4].map(function (d) {
          return '<button class="btn-outline btn-sm" data-bulk-day-demo="' + d + '">Tout J' + d + '</button>';
        }).join(' ') +
        '</div>';
      [1, 2, 3, 4].forEach(function (day) {
        var dayDemos = DEMOS_LIST.filter(function (d) { return d.day === day; });
        if (!dayDemos.length) return;
        html += '<h4 style="margin-top:1rem">Jour ' + day + '</h4>';
        dayDemos.forEach(function (d) {
          html += chip('demos', d.id, d.icon + ' ' + d.title, !!demosUL[d.id]);
        });
      });
      html += '</div>';

      el.innerHTML = html;

      // === Wire toggles ===
      el.querySelectorAll('[data-unlock-type]').forEach(function (input) {
        input.addEventListener('change', function () {
          var t = this.getAttribute('data-unlock-type');
          var id = this.getAttribute('data-unlock-id');
          var on = this.checked;
          if (AIA.setUnlock) AIA.setUnlock(t, id, on, function (res) {
            if (res.error) AIA.showToast(res.error, 'error');
            else AIA.showToast((on ? '✅ Debloque : ' : '🔒 Verrouille : ') + id, 'success');
          });
          var row = input.closest('.unlock-row');
          if (row) row.classList.toggle('on', on);
        });
      });

      // === Bulk all on/off ===
      el.querySelectorAll('[data-bulk-all]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var on = this.getAttribute('data-bulk-all') === 'on';
          if (!confirm(on ? 'Deverrouiller TOUT le parcours ?' : 'Verrouiller TOUT le parcours ?')) return;
          if (AIA.setUnlocksBulk) {
            AIA.setUnlocksBulk('demos', DEMOS_LIST.map(function (d) { return d.id; }), on);
            AIA.setUnlocksBulk('highlights', HIGHLIGHTS.map(function (h) { return h.id; }), on);
            AIA.setUnlocksBulk('phases', Object.keys(PHASES), on);
          }
          renderUnlocks(el);
        });
      });

      // === Bulk per-day demos ===
      el.querySelectorAll('[data-bulk-day-demo]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var day = parseInt(this.getAttribute('data-bulk-day-demo'));
          var ids = DEMOS_LIST.filter(function (d) { return d.day === day; }).map(function (d) { return d.id; });
          if (AIA.setUnlocksBulk) AIA.setUnlocksBulk('demos', ids, true, function () {
            AIA.showToast('Demos J' + day + ' debloquees', 'success');
            renderUnlocks(el);
          });
        });
      });

      // === Bulk per-day highlights ===
      el.querySelectorAll('[data-bulk-day-hl]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var day = parseInt(this.getAttribute('data-bulk-day-hl'));
          var ids = HIGHLIGHTS.filter(function (h) { return h.day === day; }).map(function (h) { return h.id; });
          if (AIA.setUnlocksBulk) AIA.setUnlocksBulk('highlights', ids, true, function () {
            AIA.showToast('Temps forts J' + day + ' debloques', 'success');
            renderUnlocks(el);
          });
        });
      });
    }

    function renderCampaigns(el) {
      if (!AIA.db) {
        el.innerHTML = '<div class="glass-card" style="text-align:center;padding:2rem"><p>Firebase non connecte.</p></div>';
        return;
      }
      el.innerHTML = '<div class="admin-section glass-card"><h3>🎯 Campagnes etudiants (live)</h3>' +
        '<p style="color:var(--text-muted)">Les selections de produits et la progression apparaissent ici en temps reel</p>' +
        '<div id="campaigns-live"><div class="loading-pulse" style="padding:2rem;text-align:center">Chargement...</div></div></div>';

      _campaignsListener = AIA.db.ref('states').on('value', function (snap) {
        renderCampaignsLive(snap.val() || {});
      });
    }

    var _campaignStates = {};
    function renderCampaignsLive(allStates) {
      _campaignStates = allStates || {};
      var liveEl = document.getElementById('campaigns-live');
      if (!liveEl) return;
      var PHASES = (AIA.PHASES_GUIDE) || {};
      var phaseKeys = Object.keys(PHASES);
      var totalSteps = phaseKeys.reduce(function (n, pk) { return n + PHASES[pk].steps.length; }, 0) || 12;

      // Build rows
      var rows = [];
      Object.keys(allStates).forEach(function (k) {
        var s = allStates[k];
        if (!s) return;
        var name = (s.user && s.user.name) || k;
        var theme = s.productTheme;
        var done = 0, assetCount = 0;
        var phaseProgress = {};
        phaseKeys.forEach(function (pk) {
          var pdone = 0;
          PHASES[pk].steps.forEach(function (step) {
            if (s.gameDeliverables && s.gameDeliverables[step.id]) { pdone++; done++; }
            if (s.campaignData && s.campaignData[step.id] && Array.isArray(s.campaignData[step.id].assets)) {
              assetCount += s.campaignData[step.id].assets.length;
            }
          });
          phaseProgress[pk] = { done: pdone, total: PHASES[pk].steps.length, pct: Math.round(pdone * 100 / PHASES[pk].steps.length) };
        });
        var pct = totalSteps > 0 ? Math.round(done * 100 / totalSteps) : 0;
        var lastSeen = (s.user && s.user.lastSeen) || (s.streak && s.streak.lastDate) || null;
        rows.push({
          key: k, name: name, theme: theme, done: done, total: totalSteps, pct: pct,
          assetCount: assetCount, phases: phaseProgress, lastSeen: lastSeen,
          hasTheme: !!theme
        });
      });

      // Categorize : with theme vs without
      var withTheme = rows.filter(function (r) { return r.hasTheme; });
      var withoutTheme = rows.filter(function (r) { return !r.hasTheme; });

      // Sort with-theme by progress desc, then by name
      withTheme.sort(function (a, b) { return b.pct - a.pct || a.name.localeCompare(b.name); });

      // Summary stats
      var totalStudents = rows.length;
      var totalWithTheme = withTheme.length;
      var allCompleted = withTheme.filter(function (r) { return r.pct === 100; }).length;
      var avgPct = totalWithTheme > 0 ? Math.round(withTheme.reduce(function (s, r) { return s + r.pct; }, 0) / totalWithTheme) : 0;
      var totalAssets = rows.reduce(function (s, r) { return s + r.assetCount; }, 0);

      var html = '<div class="admin-campaigns-summary">' +
        '<div class="acs-stat"><div class="acs-num">' + totalStudents + '</div><div class="acs-lbl">Etudiants total</div></div>' +
        '<div class="acs-stat"><div class="acs-num">' + totalWithTheme + '</div><div class="acs-lbl">Avec projet choisi</div></div>' +
        '<div class="acs-stat"><div class="acs-num">' + avgPct + '%</div><div class="acs-lbl">Progression moyenne</div></div>' +
        '<div class="acs-stat"><div class="acs-num">' + allCompleted + '</div><div class="acs-lbl">Campagnes 100%</div></div>' +
        '<div class="acs-stat"><div class="acs-num">' + totalAssets + '</div><div class="acs-lbl">Assets totaux</div></div>' +
        '</div>';

      if (withTheme.length === 0) {
        html += '<div class="glass-card" style="text-align:center;padding:2rem;margin-top:1rem"><p style="color:var(--text-muted)">Aucun etudiant n\'a encore choisi son projet.</p></div>';
      } else {
        html += '<table class="admin-table full" style="margin-top:1rem">' +
          '<thead><tr><th>Etudiant</th><th>Projet</th><th>Phase 1</th><th>Phase 2</th><th>Phase 3</th><th>Phase 4</th><th>Total</th><th>Assets</th><th></th></tr></thead><tbody>';
        withTheme.forEach(function (r) {
          var t = r.theme;
          html += '<tr>' +
            '<td><strong>' + escapeHtml(r.name) + '</strong></td>' +
            '<td><span class="campaign-cell">' + (t.emoji || '🎯') + ' <strong>' + escapeHtml(t.name || '') + '</strong>' +
            '<div style="font-size:0.68rem;color:var(--text-muted)">' + escapeHtml(t.category || '') + '</div></span></td>';
          ['phase1','phase2','phase3','phase4'].forEach(function (pk) {
            var p = r.phases[pk] || { done: 0, total: 3, pct: 0 };
            var color = p.pct === 100 ? '#2ecc71' : p.pct > 0 ? 'var(--gold)' : 'var(--text-muted)';
            html += '<td><div class="phase-progress-cell" style="color:' + color + '">' +
              '<div class="phase-progress-bar"><div class="phase-progress-fill" style="width:' + p.pct + '%;background:' + color + '"></div></div>' +
              '<span>' + p.done + '/' + p.total + '</span></div></td>';
          });
          html += '<td><div class="total-progress-cell">' +
            '<div class="phase-progress-bar"><div class="phase-progress-fill" style="width:' + r.pct + '%;background:linear-gradient(90deg,var(--gold),var(--accent))"></div></div>' +
            '<strong>' + r.pct + '%</strong></div></td>' +
            '<td>📎 ' + r.assetCount + '</td>' +
            '<td><button class="btn-ghost btn-xs btn-student-detail" data-detail-key="' + r.key + '">🔍 Detail</button></td>' +
            '</tr>';
        });
        html += '</tbody></table>';
      }

      if (withoutTheme.length > 0) {
        html += '<div class="glass-card" style="margin-top:1rem;padding:1rem;background:rgba(245,183,49,0.05);border-color:rgba(245,183,49,0.3)">' +
          '<h4>⚠️ ' + withoutTheme.length + ' etudiant(s) sans projet choisi</h4>' +
          '<p style="font-size:0.82rem;color:var(--text-muted)">Ils n\'ont pas encore selectionne leur produit fictif :</p>' +
          '<ul style="font-size:0.85rem">' +
          withoutTheme.map(function (r) { return '<li>' + escapeHtml(r.name) + ' (' + r.key + ')</li>'; }).join('') +
          '</ul></div>';
      }

      // Theme distribution
      if (withTheme.length > 0) {
        var themeCount = {};
        withTheme.forEach(function (r) {
          var k = r.theme.name + ' ' + r.theme.emoji;
          themeCount[k] = (themeCount[k] || 0) + 1;
        });
        var themeEntries = Object.keys(themeCount).map(function (k) { return { name: k, count: themeCount[k] }; });
        themeEntries.sort(function (a, b) { return b.count - a.count; });
        html += '<div class="glass-card" style="margin-top:1rem;padding:1rem">' +
          '<h4>📊 Distribution des projets choisis</h4>' +
          '<div class="theme-distribution">' +
          themeEntries.map(function (e) {
            return '<div class="theme-dist-row"><span>' + escapeHtml(e.name) + '</span>' +
              '<div class="theme-dist-bar"><div class="theme-dist-fill" style="width:' + Math.round(e.count * 100 / withTheme.length) + '%"></div></div>' +
              '<strong>' + e.count + '</strong></div>';
          }).join('') +
          '</div></div>';
      }

      liveEl.innerHTML = html;
      liveEl.querySelectorAll('.btn-student-detail').forEach(function (btn) {
        btn.addEventListener('click', function () {
          renderStudentDetail(this.getAttribute('data-detail-key'));
        });
      });
    }

    /* ======== DETAIL ETUDIANT — ce qu'il a fait, en detail ======== */
    function renderStudentDetail(key) {
      var s = _campaignStates[key] || {};
      var PHASES = AIA.PHASES_GUIDE || {};
      var name = (s.user && s.user.name) || key;
      function esc(x){ return escapeHtml(x == null ? '' : String(x)); }
      function fmtDate(iso){ try { return new Date(iso).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'}); } catch(e){ return iso || ''; } }

      var xpTotal = (s.xp && s.xp.total) || 0;
      var badges = Array.isArray(s.badges) ? s.badges : [];
      var demos = Array.isArray(s.demosCompleted) ? s.demosCompleted : [];
      var reflections = s.reflections || {};
      var journal = Array.isArray(s.journal) ? s.journal : [];
      var checkins = Array.isArray(s.checkins) ? s.checkins : [];
      var wb = s.workbook || { fields:{}, finalized:{} };
      var cd = s.campaignData || {};
      var gd = s.gameDeliverables || {};

      var html = '<div class="sd-overlay"><div class="sd-modal">' +
        '<button class="sd-close">✕</button>' +
        '<div class="sd-header">' +
        '<div class="sd-avatar">' + (s.productTheme ? s.productTheme.emoji : '👤') + '</div>' +
        '<div><h2>' + esc(name) + '</h2>' +
        '<div class="sd-sub">' + (s.productTheme ? esc(s.productTheme.name) + ' &bull; ' + esc(s.productTheme.category||'') : 'Pas de projet choisi') + '</div></div>' +
        '<div class="sd-xp">' + xpTotal + ' XP</div>' +
        '<button class="btn-primary btn-sm sd-notebook-btn" style="margin-left:0.6rem">📓 Notebook complet</button>' +
        '</div>' +
        '<div class="sd-body">';

      // Synthese rapide
      var gameDone = Object.keys(gd).filter(function(k){return gd[k];}).length;
      html += '<div class="sd-stats">' +
        '<div class="sd-stat"><b>' + demos.length + '/15</b><span>Demos</span></div>' +
        '<div class="sd-stat"><b>' + gameDone + '/12</b><span>Etapes Game</span></div>' +
        '<div class="sd-stat"><b>' + Object.keys(reflections).length + '</b><span>Reflexions</span></div>' +
        '<div class="sd-stat"><b>' + journal.length + '</b><span>Journal</span></div>' +
        '<div class="sd-stat"><b>' + badges.length + '</b><span>Badges</span></div>' +
        '<div class="sd-stat"><b>' + checkins.length + '</b><span>Check-ins</span></div>' +
        '</div>';

      // Tests
      if (s.preTest || s.postTest) {
        html += '<div class="sd-section"><h3>📊 Evaluations</h3>';
        if (s.preTest) html += '<div class="sd-line">Pre-test : <strong>' + s.preTest.score + '/' + s.preTest.total + '</strong> (' + fmtDate(s.preTest.ts) + ')</div>';
        if (s.postTest) html += '<div class="sd-line">Post-test : <strong>' + s.postTest.score + '/' + s.postTest.total + '</strong> (' + fmtDate(s.postTest.ts) + ')</div>';
        html += '</div>';
      }

      // Demos
      html += '<div class="sd-section"><h3>🛠️ Demos testees (' + demos.length + ')</h3>' +
        (demos.length ? '<div class="sd-chips">' + demos.map(function(d){return '<span class="sd-chip">'+esc(d)+'</span>';}).join('') + '</div>' : '<div class="sd-empty">Aucune demo testee</div>') +
        '</div>';

      // Business Game detail (steps + content)
      html += '<div class="sd-section"><h3>🎯 Business Game — productions</h3>';
      var anyGame = false;
      Object.keys(PHASES).forEach(function(pk){
        var phase = PHASES[pk];
        var stepsHtml = '';
        phase.steps.forEach(function(step){
          var data = cd[step.id] || {};
          var done = !!gd[step.id];
          var fieldsHtml = '';
          (step.fields||[]).forEach(function(f){
            var v = data[f.name];
            if (v && String(v).trim()) { fieldsHtml += '<div class="sd-field"><span class="sd-flabel">'+esc(f.label)+'</span><div class="sd-fval">'+esc(v).replace(/\n/g,'<br>')+'</div></div>'; }
          });
          if (fieldsHtml || done) {
            anyGame = true;
            stepsHtml += '<div class="sd-step">'+(done?'✅':'⬜')+' <strong>'+esc(step.title)+'</strong>'+fieldsHtml+'</div>';
          }
        });
        if (stepsHtml) html += '<div class="sd-phase"><h4>'+phase.icon+' '+esc(phase.title)+'</h4>'+stepsHtml+'</div>';
      });
      if (!anyGame) html += '<div class="sd-empty">Aucune production Business Game</div>';
      html += '</div>';

      // Workbook
      var wbFields = wb.fields || {};
      var wbKeys = Object.keys(wbFields).filter(function(k){return wbFields[k] && wbFields[k].trim();});
      html += '<div class="sd-section"><h3>📓 Carnet de Campagne (' + wbKeys.length + ' sections)</h3>';
      if (wbKeys.length) {
        wbKeys.forEach(function(k){
          html += '<div class="sd-field"><span class="sd-flabel">'+esc(k)+(wb.finalized&&wb.finalized[k]?' ✅':'')+'</span><div class="sd-fval">'+esc(wbFields[k]).replace(/\n/g,'<br>')+'</div></div>';
        });
      } else html += '<div class="sd-empty">Carnet vide</div>';
      html += '</div>';

      // Briques verrouillees -> reouverture admin
      var gv = s.gameValidation || {};
      var lockedItems = [];
      Object.keys(PHASES).forEach(function (pk) {
        PHASES[pk].steps.forEach(function (step) {
          if (gv[step.id] && gv[step.id].locked) lockedItems.push({ kind: 'game', id: step.id, label: step.title, score: gv[step.id].score });
        });
      });
      if (wb.finalized) Object.keys(wb.finalized).forEach(function (sid) {
        if (wb.finalized[sid]) lockedItems.push({ kind: 'carnet', id: sid, label: 'Carnet — ' + sid, score: (wb.scores && wb.scores[sid]) });
      });
      html += '<div class="sd-section"><h3>🔒 Briques verrouillees (' + lockedItems.length + ')</h3>';
      if (lockedItems.length) {
        lockedItems.forEach(function (it) {
          html += '<div class="sd-line">🔒 ' + esc(it.label) + (it.score != null ? ' &middot; ' + it.score + '/100' : '') +
            ' <button class="btn-ghost btn-xs sd-reopen" data-kind="' + it.kind + '" data-id="' + esc(it.id) + '">🔓 Rouvrir</button></div>';
        });
      } else html += '<div class="sd-empty">Aucune brique verrouillee</div>';
      html += '</div>';

      // Reflections
      html += '<div class="sd-section"><h3>🪞 Reflexions</h3>';
      var rKeys = Object.keys(reflections);
      if (rKeys.length) {
        rKeys.forEach(function(k){ html += '<div class="sd-field"><span class="sd-flabel">'+esc(k)+'</span><div class="sd-fval">'+esc(reflections[k].text).replace(/\n/g,'<br>')+'</div></div>'; });
      } else html += '<div class="sd-empty">Aucune reflexion</div>';
      html += '</div>';

      // Journal
      html += '<div class="sd-section"><h3>📔 Journal</h3>';
      if (journal.length) {
        journal.forEach(function(e){ html += '<div class="sd-field"><span class="sd-flabel">J'+(e.day||'?')+' &bull; '+esc(e.title||'')+' &bull; '+fmtDate(e.ts)+'</span><div class="sd-fval">'+esc(e.content||'').replace(/\n/g,'<br>')+'</div></div>'; });
      } else html += '<div class="sd-empty">Journal vide</div>';
      html += '</div>';

      // Check-ins
      html += '<div class="sd-section"><h3>☀️🌙 Check-ins</h3>';
      if (checkins.length) {
        checkins.forEach(function(c){
          html += '<div class="sd-field"><span class="sd-flabel">'+(c.type==='morning'?'☀️ Matin':'🌙 Soir')+' J'+(c.day||'?')+' '+(c.mood||'')+' &bull; '+fmtDate(c.ts)+'</span><div class="sd-fval">'+
            (c.goal?'Objectif : '+esc(c.goal):'')+(c.learned?'Appris : '+esc(c.learned):'')+(c.question?'<br>Question : '+esc(c.question):'')+(c.unclear?'<br>Flou : '+esc(c.unclear):'')+'</div></div>';
        });
      } else html += '<div class="sd-empty">Aucun check-in</div>';
      html += '</div>';

      // Badges
      html += '<div class="sd-section"><h3>🏅 Badges (' + badges.length + ')</h3>' +
        (badges.length ? '<div class="sd-chips">' + badges.map(function(b){return '<span class="sd-chip">'+esc(b)+'</span>';}).join('') + '</div>' : '<div class="sd-empty">Aucun badge</div>') +
        '</div>';

      // XP history
      var hist = (s.xp && Array.isArray(s.xp.history)) ? s.xp.history : [];
      html += '<div class="sd-section"><h3>⚡ Historique XP (' + hist.length + ')</h3>';
      if (hist.length) {
        html += '<div class="sd-history">' + hist.slice(0,30).map(function(h){return '<div class="sd-hline">+'+h.amount+' XP &bull; '+esc(h.reason||'')+' <span class="sd-htime">'+fmtDate(h.date)+'</span></div>';}).join('') + '</div>';
      } else html += '<div class="sd-empty">Aucun historique</div>';
      html += '</div>';

      html += '</div></div></div>';

      var existing = document.querySelector('.sd-overlay');
      if (existing) existing.remove();
      var wrap = document.createElement('div');
      wrap.innerHTML = html;
      document.body.appendChild(wrap.firstChild);
      var ov = document.querySelector('.sd-overlay');
      ov.querySelector('.sd-close').addEventListener('click', function(){ ov.remove(); });
      ov.addEventListener('click', function(e){ if(e.target===ov) ov.remove(); });
      // Notebook complet (lecture seule) de l'eleve, pour le formateur
      var nbBtn = ov.querySelector('.sd-notebook-btn');
      if (nbBtn && AIA.renderNotebookModal) nbBtn.addEventListener('click', function(){ AIA.renderNotebookModal(s); });
      // Reouverture d'une brique verrouillee (ecrit dans l'etat de l'etudiant)
      ov.querySelectorAll('.sd-reopen').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var kind = this.getAttribute('data-kind'), id = this.getAttribute('data-id');
          if (!AIA.db) { AIA.showToast('Firebase indisponible', 'warning'); return; }
          if (!confirm('Rouvrir cette brique pour ' + name + ' ? Il/elle pourra la re-editer.')) return;
          var path = kind === 'game' ? ('states/' + key + '/gameValidation/' + id + '/locked') : ('states/' + key + '/workbook/finalized/' + id);
          AIA.db.ref(path).set(false, function () {
            if (kind === 'game') { if (_campaignStates[key] && _campaignStates[key].gameValidation && _campaignStates[key].gameValidation[id]) _campaignStates[key].gameValidation[id].locked = false; }
            else { if (_campaignStates[key] && _campaignStates[key].workbook && _campaignStates[key].workbook.finalized) _campaignStates[key].workbook.finalized[id] = false; }
            AIA.showToast('🔓 Brique rouverte pour ' + name, 'success');
            renderStudentDetail(key);
          });
        });
      });
    }


    function getStudentList() {
      var list = [];
      for (var k in students) {
        var s = students[k];
        list.push({
          key: k,
          name: s.name || k,
          online: !!s.online,
          xp: s.xp || 0,
          badges: typeof s.badges === 'number' ? s.badges : (Array.isArray(s.badges) ? s.badges.length : 0),
          page: s.page || 'offline',
          progress: s.progress || 0
        });
      }
      return list;
    }

    /* ======== OVERVIEW ======== */
    function renderOverview(el) {
      var list = getStudentList();
      var totalStudents = list.length;
      var online = list.filter(function (s) { return s.online; }).length;
      var avgXP = totalStudents > 0 ? Math.round(list.reduce(function (sum, s) { return sum + s.xp; }, 0) / totalStudents) : 0;
      var avgBadges = totalStudents > 0 ? (list.reduce(function (sum, s) { return sum + s.badges; }, 0) / totalStudents).toFixed(1) : 0;

      var pageCounts = {};
      list.forEach(function (s) {
        if (s.online) {
          var p = s.page || 'autre';
          pageCounts[p] = (pageCounts[p] || 0) + 1;
        }
      });

      el.innerHTML =
        '<div class="admin-stats-grid">' +
        '<div class="admin-stat glass-card"><div class="stat-value">' + totalStudents + '</div><div class="stat-label">Etudiants inscrits</div></div>' +
        '<div class="admin-stat glass-card"><div class="stat-value" style="color:#2ecc71">' + online + '</div><div class="stat-label">En ligne maintenant</div></div>' +
        '<div class="admin-stat glass-card"><div class="stat-value" style="color:#f5b731">' + avgXP + '</div><div class="stat-label">XP moyen</div></div>' +
        '<div class="admin-stat glass-card"><div class="stat-value" style="color:#A71F28">' + avgBadges + '</div><div class="stat-label">Badges moyen</div></div>' +
        '</div>' +

        '<div class="admin-section glass-card">' +
        '<h3>Activite en direct</h3>' +
        '<div class="admin-activity-map">' +
        Object.keys(pageCounts).sort(function (a, b) { return pageCounts[b] - pageCounts[a]; }).map(function (page) {
          var pct = Math.round(pageCounts[page] / Math.max(1, online) * 100);
          return '<div class="activity-bar-row">' +
            '<span class="bar-label">' + escapeHtml(page) + '</span>' +
            '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:var(--gradient-main)"></div></div>' +
            '<span class="bar-count">' + pageCounts[page] + '</span></div>';
        }).join('') +
        '</div></div>' +

        '<div class="admin-section glass-card">' +
        '<h3>Top 5 Etudiants</h3>' +
        '<table class="admin-table"><thead><tr><th>#</th><th>Nom</th><th>XP</th><th>Badges</th><th>Statut</th></tr></thead><tbody>' +
        list.sort(function (a, b) { return b.xp - a.xp; }).slice(0, 5).map(function (s, i) {
          return '<tr><td>' + (i + 1) + '</td><td>' + escapeHtml(s.name) + '</td><td>' + s.xp + '</td><td>' + s.badges + '</td>' +
            '<td><span class="dot ' + (s.online ? 'online' : 'idle') + '"></span> ' + (s.online ? s.page : 'Hors ligne') + '</td></tr>';
        }).join('') +
        '</tbody></table></div>';
    }

    /* ======== STUDENTS ======== */
    function renderStudents(el) {
      var list = getStudentList();
      var sortKey = 'xp';

      function render() {
        list.sort(function (a, b) {
          if (sortKey === 'name') return a.name.localeCompare(b.name);
          if (sortKey === 'online') return (b.online ? 1 : 0) - (a.online ? 1 : 0);
          return b[sortKey] - a[sortKey];
        });

        el.innerHTML =
          '<div class="admin-toolbar">' +
          '<span>Trier par : </span>' +
          '<button class="btn-ghost btn-sm' + (sortKey === 'xp' ? ' active' : '') + '" data-sort="xp">XP</button>' +
          '<button class="btn-ghost btn-sm' + (sortKey === 'name' ? ' active' : '') + '" data-sort="name">Nom</button>' +
          '<button class="btn-ghost btn-sm' + (sortKey === 'badges' ? ' active' : '') + '" data-sort="badges">Badges</button>' +
          '<button class="btn-ghost btn-sm' + (sortKey === 'online' ? ' active' : '') + '" data-sort="online">Statut</button>' +
          '<button class="btn-outline btn-sm" id="btn-export-csv" style="margin-left:auto">Exporter CSV</button>' +
          '</div>' +
          '<table class="admin-table full"><thead><tr>' +
          '<th>#</th><th>Nom</th><th>XP</th><th>Niveau</th><th>Badges</th><th>Progression</th><th>Statut</th><th>Page</th>' +
          '</tr></thead><tbody>' +
          list.map(function (s, i) {
            var lvl = AIA.getLevelInfo(s.xp);
            var progPct = Math.min(100, Math.round(s.progress / 24 * 100));
            return '<tr>' +
              '<td>' + (i + 1) + '</td>' +
              '<td><strong>' + escapeHtml(s.name) + '</strong></td>' +
              '<td>' + s.xp + '</td>' +
              '<td>' + lvl.title + '</td>' +
              '<td>' + s.badges + '</td>' +
              '<td><div class="mini-bar"><div class="mini-fill" style="width:' + progPct + '%"></div></div> ' + progPct + '%</td>' +
              '<td><span class="dot ' + (s.online ? 'online' : 'idle') + '"></span></td>' +
              '<td>' + (s.online ? escapeHtml(s.page) : '-') + '</td></tr>';
          }).join('') +
          '</tbody></table>';

        document.querySelectorAll('[data-sort]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            sortKey = this.getAttribute('data-sort');
            render();
          });
        });

        var csvBtn = document.getElementById('btn-export-csv');
        if (csvBtn) {
          csvBtn.addEventListener('click', function () {
            var csv = 'Nom,XP,Badges,Progression,En ligne,Page\n';
            list.forEach(function (s) {
              csv += escapeHtml(s.name) + ',' + s.xp + ',' + s.badges + ',' +
                Math.round(s.progress / 24 * 100) + '%,' + (s.online ? 'Oui' : 'Non') + ',' + s.page + '\n';
            });
            var blob = new Blob([csv], { type: 'text/csv' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'etudiants_export.csv';
            a.click();
            AIA.showToast('CSV exporte !', 'success');
          });
        }
      }

      render();
    }

    /* ======== COURSE CONTROL ======== */
    function renderCourse(el) {
      el.innerHTML = '<div class="admin-section glass-card"><p style="text-align:center;padding:2rem;color:var(--text-muted)">Chargement...</p></div>';

      var dayLocks = { day1: false, day2: true, day3: true, day4: true };

      function build(locks) {
        dayLocks = locks;
        var dayKeys = ['day1','day2','day3','day4'];

        var locksHtml = CONFIG.dateLabels.map(function (label, i) {
          var key = dayKeys[i];
          var locked = !!dayLocks[key];
          return '<div class="day-lock-row">' +
            '<div><span class="day-label">Jour ' + (i + 1) + '</span>' +
            '<span style="font-size:0.78rem;color:var(--text-muted);margin-left:0.5rem">' + label + '</span></div>' +
            '<div style="display:flex;align-items:center;gap:0.8rem">' +
            '<span style="font-size:0.78rem;color:' + (locked ? 'var(--text-muted)' : 'var(--green)') + '">' + (locked ? 'Verrouille' : 'Ouvert') + '</span>' +
            '<label class="toggle-switch"><input type="checkbox" data-lockday="' + key + '"' + (locked ? '' : ' checked') + '>' +
            '<span class="toggle-slider"></span></label></div></div>';
        }).join('');

        var programHtml = dayKeys.map(function (key, di) {
          var day = PROGRAM[key];
          if (!day) return '';
          var activities = day.matin.concat(day.aprem);
          return '<div class="admin-day-block" style="margin-top:1rem">' +
            '<h4 style="color:var(--gold);margin-bottom:0.5rem">Jour ' + (di + 1) + ' — ' + CONFIG.dateLabels[di] + '</h4>' +
            '<div class="admin-activities" style="display:flex;flex-direction:column;gap:0.3rem">' +
            activities.map(function (a) {
              var icons = {cours:'📖',atelier:'🛠️',defi:'⚡',game:'🎮',demo:'🔬'};
              return '<div style="display:flex;align-items:center;gap:0.8rem;padding:0.4rem 0.6rem;background:var(--bg-secondary);border-radius:var(--radius-xs);font-size:0.82rem">' +
                '<span style="min-width:60px;color:var(--text-muted)">' + a.time + '</span>' +
                '<span>' + (icons[a.type] || '📌') + '</span>' +
                '<span style="flex:1">' + escapeHtml(a.title) + '</span>' +
                '<span style="color:var(--text-muted);font-size:0.72rem">' + a.type + '</span>' +
                '<span style="color:var(--gold);font-size:0.72rem;font-weight:700">+' + a.xp + ' XP</span></div>';
            }).join('') + '</div></div>';
        }).join('');

        el.innerHTML =
          '<div class="admin-section glass-card">' +
          '<h3>Controle des jours</h3>' +
          '<p style="color:var(--text-muted);margin-bottom:1rem">Activez/desactivez l\'acces aux jours du programme. Les etudiants ne voient que les jours ouverts.</p>' +
          '<div class="day-locks">' + locksHtml + '</div></div>' +
          '<div class="admin-section glass-card">' +
          '<h3>Programme detaille (' + dayKeys.reduce(function(s, k){ var d=PROGRAM[k]; return s + (d ? d.matin.length + d.aprem.length : 0); }, 0) + ' activites)</h3>' +
          programHtml + '</div>';

        document.querySelectorAll('[data-lockday]').forEach(function (toggle) {
          toggle.addEventListener('change', function () {
            var key = this.getAttribute('data-lockday');
            dayLocks[key] = !this.checked;
            if (AIA.db) { AIA.db.ref('config/dayLocks').set(dayLocks); }
            AIA.showToast('Jour ' + key.replace('day','') + ' ' + (dayLocks[key] ? 'verrouille' : 'ouvert'), 'info');
            renderCourse(el);
          });
        });
      }

      if (AIA.db) {
        AIA.db.ref('config/dayLocks').once('value', function (snap) {
          build(snap.val() || dayLocks);
        });
      } else {
        build(dayLocks);
      }
    }

    /* ======== SUBMISSIONS VIEWER ======== */
    function renderSubmissions(el) {
      if (!AIA.db) {
        el.innerHTML = '<div class="admin-section glass-card"><p style="text-align:center;padding:2rem;color:var(--text-muted)">Firebase non connecte</p></div>';
        return;
      }
      el.innerHTML = '<div class="admin-section glass-card"><p style="text-align:center;padding:2rem;color:var(--text-muted)">Chargement des soumissions...</p></div>';

      AIA.db.ref('submissions').once('value', function (snap) {
        var allSubs = snap.val() || {};
        var actIds = Object.keys(allSubs);

        if (actIds.length === 0) {
          el.innerHTML = '<div class="admin-section glass-card"><p style="text-align:center;padding:2rem;color:var(--text-muted)">Aucune soumission etudiant pour le moment. Les soumissions apparaitront ici quand les etudiants utiliseront les demos et exercices.</p></div>';
          return;
        }

        /* Build activity title map */
        var titleMap = {};
        ['day1','day2','day3','day4'].forEach(function (k) {
          var d = PROGRAM[k]; if (!d) return;
          d.matin.concat(d.aprem).forEach(function (a) { titleMap[a.id] = a.title; });
        });
        titleMap['demo-prompt'] = 'Demo: Prompt Playground';
        titleMap['demo-sentiment'] = 'Demo: Analyse Sentiment';
        titleMap['demo-image'] = 'Demo: Generation Images';
        titleMap['demo-chatbot'] = 'Demo: Chatbot Marketing';
        titleMap['demo-abtest'] = 'Demo: A/B Testing';
        titleMap['demo-seo'] = 'Demo: SEO Analyzer';

        var html = '<div class="admin-section glass-card">' +
          '<h3>Soumissions etudiants (' + actIds.length + ' activites)</h3>' +
          '<p style="color:var(--text-muted);margin-bottom:1rem">Consultez ce que les etudiants ont soumis pour chaque activite et demo.</p>' +
          '<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1rem">';

        actIds.forEach(function (actId) {
          var count = Object.keys(allSubs[actId] || {}).length;
          html += '<button class="btn-ghost btn-sm" data-view-act="' + actId + '">' +
            (titleMap[actId] || actId) + ' <span style="background:var(--red);color:#fff;padding:0.1rem 0.4rem;border-radius:8px;font-size:0.65rem;margin-left:0.3rem">' + count + '</span></button>';
        });
        html += '</div><div id="submissions-detail"></div></div>';
        el.innerHTML = html;

        /* Default: show first activity */
        function showActivity(actId) {
          var subs = allSubs[actId] || {};
          var detail = document.getElementById('submissions-detail');
          var entries = [];
          for (var studentKey in subs) {
            var s = subs[studentKey];
            entries.push({ key: studentKey, name: s.studentName || studentKey, type: s.type || 'unknown', text: s.text || '', timestamp: s.timestamp || '', data: s });
          }
          entries.sort(function (a, b) { return (b.timestamp || '').localeCompare(a.timestamp || ''); });

          var dHtml = '<h4 style="color:var(--gold);margin-bottom:0.8rem">' + (titleMap[actId] || actId) + ' — ' + entries.length + ' soumission(s)</h4>';
          if (entries.length === 0) {
            dHtml += '<p style="color:var(--text-muted)">Aucune soumission</p>';
          } else {
            entries.forEach(function (e) {
              var time = e.timestamp ? new Date(e.timestamp).toLocaleString('fr-FR') : '-';
              dHtml += '<div class="submission-card">' +
                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                '<span class="student-name">' + escapeHtml(e.name) + '</span>' +
                '<span class="submission-time">' + time + '</span></div>' +
                '<div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.2rem">Type: ' + escapeHtml(e.type) + '</div>';
              if (e.text) {
                dHtml += '<div class="submission-text">' + escapeHtml(e.text).substring(0, 500) + '</div>';
              }
              /* Show extra data fields for demo submissions */
              var extra = [];
              if (e.data.scoreA !== undefined) extra.push('Score A: ' + e.data.scoreA);
              if (e.data.scoreB !== undefined) extra.push('Score B: ' + e.data.scoreB);
              if (e.data.sentiment) extra.push('Sentiment: ' + e.data.sentiment);
              if (e.data.grade) extra.push('Grade SEO: ' + e.data.grade);
              if (e.data.keyword) extra.push('Mot-cle: ' + e.data.keyword);
              if (e.data.winner) extra.push('Gagnant: ' + e.data.winner);
              if (e.data.confidence) extra.push('Confiance: ' + e.data.confidence + '%');
              if (extra.length > 0) {
                dHtml += '<div style="margin-top:0.4rem;display:flex;gap:0.4rem;flex-wrap:wrap">' +
                  extra.map(function (x) { return '<span style="padding:0.15rem 0.4rem;background:rgba(167,31,40,0.1);border-radius:4px;font-size:0.68rem;color:var(--text-secondary)">' + x + '</span>'; }).join('') +
                  '</div>';
              }
              dHtml += '</div>';
            });
          }
          detail.innerHTML = dHtml;
        }

        document.querySelectorAll('[data-view-act]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            document.querySelectorAll('[data-view-act]').forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            showActivity(this.getAttribute('data-view-act'));
          });
        });

        /* Show first by default */
        if (actIds.length > 0) {
          var firstBtn = document.querySelector('[data-view-act]');
          if (firstBtn) firstBtn.classList.add('active');
          showActivity(actIds[0]);
        }
      });
    }

    /* ======== ANALYTICS ======== */
    function renderAnalytics(el) {
      var list = getStudentList();

      var xpBuckets = [0, 0, 0, 0, 0];
      list.forEach(function (s) {
        if (s.xp < 100) xpBuckets[0]++;
        else if (s.xp < 300) xpBuckets[1]++;
        else if (s.xp < 600) xpBuckets[2]++;
        else if (s.xp < 1000) xpBuckets[3]++;
        else xpBuckets[4]++;
      });
      var maxBucket = Math.max.apply(null, xpBuckets) || 1;
      var bucketLabels = ['0-99','100-299','300-599','600-999','1000+'];

      var levelDist = {};
      list.forEach(function (s) {
        var lvl = AIA.getLevelInfo(s.xp);
        levelDist[lvl.title] = (levelDist[lvl.title] || 0) + 1;
      });

      var onlineByPage = {};
      list.forEach(function (s) {
        if (s.online) {
          onlineByPage[s.page] = (onlineByPage[s.page] || 0) + 1;
        }
      });

      el.innerHTML =
        '<div class="admin-section glass-card">' +
        '<h3>Distribution XP</h3>' +
        '<div class="chart-bars">' +
        xpBuckets.map(function (count, i) {
          var h = Math.round(count / maxBucket * 120);
          return '<div class="chart-col">' +
            '<div class="chart-bar" style="height:' + h + 'px"></div>' +
            '<div class="chart-label">' + bucketLabels[i] + '</div>' +
            '<div class="chart-count">' + count + '</div></div>';
        }).join('') +
        '</div></div>' +

        '<div class="admin-analytics-grid">' +
        '<div class="admin-section glass-card">' +
        '<h3>Repartition par niveau</h3>' +
        '<div class="level-dist">' +
        Object.keys(levelDist).map(function (lvl) {
          var pct = Math.round(levelDist[lvl] / list.length * 100);
          return '<div class="dist-row"><span>' + escapeHtml(lvl) + '</span>' +
            '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:var(--red)"></div></div>' +
            '<span>' + levelDist[lvl] + '</span></div>';
        }).join('') +
        '</div></div>' +

        '<div class="admin-section glass-card">' +
        '<h3>Heatmap activite</h3>' +
        '<div class="heatmap">' +
        Object.keys(onlineByPage).sort(function (a, b) { return (onlineByPage[b] || 0) - (onlineByPage[a] || 0); }).map(function (page) {
          var count = onlineByPage[page];
          var intensity = Math.min(1, count / 8);
          return '<div class="heat-cell" style="background:rgba(167,31,40,' + (0.2 + intensity * 0.8) + ')">' +
            '<div class="heat-label">' + escapeHtml(page) + '</div>' +
            '<div class="heat-count">' + count + '</div></div>';
        }).join('') +
        '</div></div></div>' +

        '<div class="admin-section glass-card">' +
        '<h3>Statistiques globales</h3>' +
        '<div class="global-stats">' +
        '<div class="gstat"><div class="gstat-val">' + list.length + '</div><div>Inscrits</div></div>' +
        '<div class="gstat"><div class="gstat-val">' + list.filter(function (s) { return s.online; }).length + '</div><div>En ligne</div></div>' +
        '<div class="gstat"><div class="gstat-val">' + Math.round(list.reduce(function (s, x) { return s + x.xp; }, 0) / Math.max(1, list.length)) + '</div><div>XP moyen</div></div>' +
        '<div class="gstat"><div class="gstat-val">' + Math.max.apply(null, list.map(function (s) { return s.xp; })) + '</div><div>XP max</div></div>' +
        '<div class="gstat"><div class="gstat-val">' + list.reduce(function (s, x) { return s + x.badges; }, 0) + '</div><div>Total badges</div></div>' +
        '</div></div>';
    }

    /* ======== ACCOUNTS ======== */
    function renderAccounts(el) {
      el.innerHTML = '<div class="admin-section glass-card"><p style="text-align:center;padding:2rem;color:var(--text-muted)">Chargement des comptes...</p></div>';

      AIA.getAccountsFromFirebase(function (accts) {
        if (!accts) accts = {};
        AIA.db.ref('states').once('value', function (statesSnap) {
          var allStates = statesSnap.val() || {};
          var keys = Object.keys(accts);
          var now = Date.now();

          var rows = keys.map(function (k) {
            var a = accts[k];
            var st = allStates[k] || null;
            var xp = st && st.xp ? st.xp.total : 0;
            var badges = st && st.badges ? (Array.isArray(st.badges) ? st.badges.length : 0) : 0;
            var progressCount = 0;
            if (st && st.progress) { for (var p in st.progress) { if (st.progress[p]) progressCount++; } }
            var lastLogin = a.lastLogin ? new Date(a.lastLogin) : null;
            var isRecent = lastLogin && (now - lastLogin.getTime()) < 3600000;
            var createdAt = a.createdAt ? new Date(a.createdAt).toLocaleDateString('fr-FR') : '-';
            var lastLoginStr = lastLogin ? lastLogin.toLocaleDateString('fr-FR') + ' ' + lastLogin.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'Jamais';

            return {
              key: k, firstName: a.firstName || '', lastName: a.lastName || '',
              xp: xp, badges: badges, progress: progressCount,
              lastLogin: lastLoginStr, isRecent: isRecent, createdAt: createdAt
            };
          });

          rows.sort(function (a, b) { return (a.lastName + a.firstName).localeCompare(b.lastName + b.firstName); });

          el.innerHTML =
            '<div class="admin-section glass-card">' +
            '<h3>➕ Creer un compte etudiant</h3>' +
            '<p style="color:var(--text-muted);margin-bottom:1rem">Creez un compte directement. Mot de passe par defaut : <code>idrac2026</code>.</p>' +
            '<div class="create-account-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:0.6rem;align-items:end">' +
            '<div class="form-group" style="margin:0"><label>Nom</label><input type="text" id="new-acct-lastname" placeholder="Dupont"></div>' +
            '<div class="form-group" style="margin:0"><label>Prenom</label><input type="text" id="new-acct-firstname" placeholder="Jean"></div>' +
            '<div class="form-group" style="margin:0"><label>Mot de passe</label><input type="text" id="new-acct-password" placeholder="idrac2026" value="idrac2026"></div>' +
            '<button class="btn-primary" id="btn-create-account">Creer le compte</button>' +
            '</div>' +
            '<details style="margin-top:0.8rem"><summary style="cursor:pointer;color:var(--cyan);font-size:0.78rem">📋 Creation par lot (CSV)</summary>' +
            '<p style="font-size:0.75rem;color:var(--text-muted);margin:0.5rem 0">Format : <code>NOM;Prenom;motdepasse</code> (un par ligne). Mot de passe optionnel (defaut : idrac2026).</p>' +
            '<textarea id="batch-accounts" rows="5" placeholder="DUPONT;Jean;jean123\nMARTIN;Marie\nDURAND;Paul;paul2026"></textarea>' +
            '<button class="btn-outline" id="btn-batch-create" style="margin-top:0.5rem">Importer le lot</button>' +
            '</details>' +
            '</div>' +

            '<div class="admin-section glass-card">' +
            '<h3>Gestion des comptes etudiants (' + keys.length + ')</h3>' +
            '<p style="color:var(--text-muted);margin-bottom:1rem">Gerez les comptes, reinitialiser les mots de passe et supprimez les sessions</p>' +
            (rows.length === 0 ? '<p style="color:var(--text-muted);text-align:center;padding:2rem">Aucun compte etudiant enregistre</p>' :
              '<table class="admin-table full"><thead><tr>' +
              '<th>Nom</th><th>Prenom</th><th>XP</th><th>Progression</th><th>Derniere connexion</th><th>Cree le</th><th>Actions</th>' +
              '</tr></thead><tbody>' +
              rows.map(function (r) {
                return '<tr>' +
                  '<td><strong>' + escapeHtml(r.lastName) + '</strong></td>' +
                  '<td>' + escapeHtml(r.firstName) + '</td>' +
                  '<td>' + r.xp + '</td>' +
                  '<td>' + r.progress + '/24</td>' +
                  '<td><span class="dot ' + (r.isRecent ? 'online' : 'idle') + '"></span> ' + r.lastLogin + '</td>' +
                  '<td>' + r.createdAt + '</td>' +
                  '<td class="actions-cell">' +
                  '<button class="btn-ghost btn-xs" data-reset-pw="' + r.key + '" title="Reinitialiser MDP">🔑</button>' +
                  '<button class="btn-ghost btn-xs" data-reset-progress="' + r.key + '" title="Reinitialiser progression">🔄</button>' +
                  '<button class="btn-ghost btn-xs btn-danger" data-delete-acct="' + r.key + '" title="Supprimer le compte">🗑️</button>' +
                  '</td></tr>';
              }).join('') +
              '</tbody></table>') +
            '</div>' +

            '<div class="admin-section glass-card">' +
            '<h3>Actions globales</h3>' +
            '<div style="display:flex;gap:0.8rem;flex-wrap:wrap">' +
            '<button class="btn-outline" id="btn-reset-all-pw">Reinitialiser tous les MDP</button>' +
            '<button class="btn-outline" id="btn-reset-all-progress">Reinitialiser toutes les progressions</button>' +
            '<button class="btn-outline btn-danger" id="btn-delete-all-accts">Supprimer tous les comptes</button>' +
            '</div></div>';

          document.querySelectorAll('[data-reset-pw]').forEach(function (btn) {
            btn.addEventListener('click', function () {
              var key = this.getAttribute('data-reset-pw');
              var a = accts[key];
              if (!a) return;
              var newPw = prompt('Nouveau mot de passe pour ' + a.firstName + ' ' + a.lastName + ' :');
              if (!newPw || newPw.length < 4) { AIA.showToast('MDP annule ou trop court (4 car. min)', 'warning'); return; }
              AIA.hashAccountPass(key, newPw).then(function (ph) {
                accts[key].passwordHash = ph;
                AIA.db.ref('accounts/' + key).update({ passwordHash: ph }); // ecriture par-compte (regles)
                AIA.showToast('MDP reinitialise pour ' + a.firstName, 'success');
              });
            });
          });

          document.querySelectorAll('[data-reset-progress]').forEach(function (btn) {
            btn.addEventListener('click', function () {
              var key = this.getAttribute('data-reset-progress');
              var a = accts[key];
              if (!a) return;
              if (!confirm('Reinitialiser la progression de ' + a.firstName + ' ' + a.lastName + ' ? XP, badges et activites seront remis a zero.')) return;
              AIA.deleteStudentState(key);
              AIA.showToast('Progression reinitialise pour ' + a.firstName, 'success');
              renderAccounts(el);
            });
          });

          document.querySelectorAll('[data-delete-acct]').forEach(function (btn) {
            btn.addEventListener('click', function () {
              var key = this.getAttribute('data-delete-acct');
              var a = accts[key];
              if (!a) return;
              if (!confirm('Supprimer le compte de ' + a.firstName + ' ' + a.lastName + ' ? Cette action est irreversible.')) return;
              delete accts[key];
              AIA.db.ref('accounts/' + key).remove(); // suppression par-compte (regles)
              AIA.deleteStudentState(key);
              AIA.showToast('Compte supprime : ' + a.firstName + ' ' + a.lastName, 'info');
              renderAccounts(el);
            });
          });

          var btnResetAllPw = document.getElementById('btn-reset-all-pw');
          if (btnResetAllPw) {
            btnResetAllPw.addEventListener('click', function () {
              if (!confirm('Reinitialiser TOUS les mots de passe ? Le nouveau MDP sera "idrac2026".')) return;
              var keys = Object.keys(accts);
              Promise.all(keys.map(function (k) { return AIA.hashAccountPass(k, 'idrac2026').then(function (ph) { accts[k].passwordHash = ph; return AIA.db.ref('accounts/' + k).update({ passwordHash: ph }); }); })).then(function () {
                AIA.showToast('Tous les MDP reinitialises a "idrac2026"', 'success');
              });
            });
          }

          var btnResetAllProg = document.getElementById('btn-reset-all-progress');
          if (btnResetAllProg) {
            btnResetAllProg.addEventListener('click', function () {
              if (!confirm('Reinitialiser TOUTES les progressions etudiantes ?')) return;
              for (var k in accts) { AIA.deleteStudentState(k); }
              AIA.showToast('Toutes les progressions reinitialises', 'info');
              renderAccounts(el);
            });
          }

          var btnDeleteAll = document.getElementById('btn-delete-all-accts');
          if (btnDeleteAll) {
            btnDeleteAll.addEventListener('click', function () {
              if (!confirm('SUPPRIMER TOUS les comptes etudiants ? Cette action est IRREVERSIBLE.')) return;
              for (var k in accts) { AIA.deleteStudentState(k); AIA.db.ref('accounts/' + k).remove(); } // par-compte (regles)
              AIA.showToast('Tous les comptes supprimes', 'info');
              renderAccounts(el);
            });
          }

          /* ======== CREATE NEW ACCOUNT ======== */
          var btnCreate = document.getElementById('btn-create-account');
          if (btnCreate) {
            btnCreate.addEventListener('click', function () {
              var ln = document.getElementById('new-acct-lastname').value.trim();
              var fn = document.getElementById('new-acct-firstname').value.trim();
              var pw = document.getElementById('new-acct-password').value.trim() || 'idrac2026';
              if (!ln || !fn) return AIA.showToast('Nom et prenom requis', 'warning');
              if (pw.length < 4) return AIA.showToast('Mot de passe trop court (4 car. min)', 'warning');
              AIA.hashAccountPass(AIA.getAccountKey(ln, fn), pw).then(function (ph) {
              AIA.createAccount(ln, fn, ph, function (result) {
                if (result.error) return AIA.showToast(result.error, 'error');
                AIA.showToast('Compte cree : ' + fn + ' ' + ln + ' (MDP: ' + pw + ')', 'success');
                document.getElementById('new-acct-lastname').value = '';
                document.getElementById('new-acct-firstname').value = '';
                document.getElementById('new-acct-password').value = 'idrac2026';
                renderAccounts(el);
              });
              });
            });
          }

          var btnBatch = document.getElementById('btn-batch-create');
          if (btnBatch) {
            btnBatch.addEventListener('click', function () {
              var raw = document.getElementById('batch-accounts').value.trim();
              if (!raw) return AIA.showToast('Collez des lignes CSV d\'abord', 'warning');
              var lines = raw.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
              var ok = 0, fail = 0, pending = lines.length;
              if (!pending) return;
              lines.forEach(function (line) {
                var parts = line.split(';').map(function (p) { return p.trim(); });
                var ln = parts[0], fn = parts[1], pw = parts[2] || 'idrac2026';
                if (!ln || !fn) { fail++; pending--; if (!pending) finishBatch(); return; }
                AIA.hashAccountPass(AIA.getAccountKey(ln, fn), pw).then(function (ph) {
                  AIA.createAccount(ln, fn, ph, function (res) {
                    if (res.error) fail++; else ok++;
                    pending--;
                    if (!pending) finishBatch();
                  });
                });
              });
              function finishBatch() {
                AIA.showToast('Import : ' + ok + ' crees, ' + fail + ' echecs', ok ? 'success' : 'warning');
                document.getElementById('batch-accounts').value = '';
                renderAccounts(el);
              }
            });
          }
        });
      });
    }

    /* ======== SETTINGS ======== */
    function renderSettings(el) {
      var fbConnected = !!AIA.db;

      el.innerHTML =
        '<div class="admin-section glass-card">' +
        '<h3>Firebase</h3>' +
        '<div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1rem">' +
        '<span class="dot ' + (fbConnected ? 'online' : 'idle') + '"></span>' +
        '<span style="color:' + (fbConnected ? '#2ecc71' : '#e74c3c') + ';font-weight:600">' +
        (fbConnected ? 'Firebase connecte' : 'Firebase non connecte') + '</span>' +
        '</div>' +
        '<p style="color:var(--text-muted);font-size:0.85rem">Projet : idrac-ai-academy | Region : europe-west1</p>' +
        '<p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.3rem">Donnees synchronisees en temps reel sur tous les appareils</p>' +
        '</div>' +

        '<div class="admin-section glass-card">' +
        '<h3>Notifications</h3>' +
        '<div class="notif-form">' +
        '<input type="text" id="notif-message" class="demo-input" placeholder="Message a envoyer a tous les etudiants">' +
        '<button class="btn-primary" id="btn-send-notif" style="margin-top:0.5rem">Envoyer la notification</button>' +
        '</div></div>' +

        '<div class="admin-section glass-card">' +
        '<h3>Actions rapides</h3>' +
        '<div style="display:flex;gap:0.8rem;flex-wrap:wrap">' +
        '<button class="btn-outline" id="btn-reset-all">Reinitialiser tous les XP</button>' +
        '<button class="btn-outline" id="btn-export-full">Export complet JSON</button>' +
        '</div></div>';

      document.getElementById('btn-send-notif').addEventListener('click', function () {
        var msg = document.getElementById('notif-message').value.trim();
        if (!msg) { AIA.showToast('Ecrivez un message', 'error'); return; }
        if (AIA.db) {
          AIA.db.ref('notifications').push({ message: msg, timestamp: Date.now() });
        }
        AIA.showToast('Notification envoyee : ' + msg, 'success');
        document.getElementById('notif-message').value = '';
      });

      document.getElementById('btn-export-full').addEventListener('click', function () {
        var data = { students: students, exportDate: new Date().toISOString() };
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'academy_export.json';
        a.click();
        AIA.showToast('Export JSON telecharge', 'success');
      });

      document.getElementById('btn-reset-all').addEventListener('click', function () {
        if (!confirm('Reinitialiser les XP de TOUS les etudiants ? Cette action est irreversible.')) return;
        if (AIA.db) {
          AIA.db.ref('students').once('value', function (snap) {
            var data = snap.val();
            if (!data) return;
            var updates = {};
            for (var k in data) { updates[k + '/xp'] = 0; }
            AIA.db.ref('students').update(updates);
          });
        }
        AIA.showToast('XP reinitialises', 'info');
      });
    }

    renderTab('overview');
  }

  window.AIA = window.AIA || {};
  window.AIA.initAdmin = initAdmin;
})();
