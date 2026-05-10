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

    root.innerHTML =
      '<div class="admin-tabs">' +
      '<button class="admin-tab active" data-tab="overview">Vue d\'ensemble</button>' +
      '<button class="admin-tab" data-tab="students">Etudiants</button>' +
      '<button class="admin-tab" data-tab="course">Cours</button>' +
      '<button class="admin-tab" data-tab="analytics">Analytics</button>' +
      '<button class="admin-tab" data-tab="settings">Parametres</button>' +
      '</div>' +
      '<div id="admin-content"></div>';

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
      if (tab === 'overview') renderOverview(content);
      else if (tab === 'students') renderStudents(content);
      else if (tab === 'course') renderCourse(content);
      else if (tab === 'analytics') renderAnalytics(content);
      else if (tab === 'settings') renderSettings(content);
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
      var dayLocks = AIA.Storage.get('dayLocks', { day1: false, day2: true, day3: true, day4: true });

      el.innerHTML =
        '<div class="admin-section glass-card">' +
        '<h3>Controle des jours</h3>' +
        '<p style="color:var(--text-muted);margin-bottom:1rem">Verrouillez ou deverrouillez les jours du programme</p>' +
        '<div class="day-locks">' +
        CONFIG.dateLabels.map(function (label, i) {
          var key = 'day' + (i + 1);
          var locked = !!dayLocks[key];
          return '<div class="day-lock-row">' +
            '<span class="day-label">' + label + '</span>' +
            '<button class="btn-sm ' + (locked ? 'btn-outline' : 'btn-primary') + '" data-lockday="' + key + '">' +
            (locked ? '🔒 Verrouille' : '🔓 Deverrouille') + '</button></div>';
        }).join('') +
        '</div></div>' +

        '<div class="admin-section glass-card">' +
        '<h3>Programme detaille</h3>' +
        PROGRAM.map(function (day, di) {
          return '<div class="admin-day-block">' +
            '<h4>Jour ' + (di + 1) + ' — ' + day.title + '</h4>' +
            '<div class="admin-activities">' +
            day.activities.map(function (a) {
              return '<div class="admin-activity-row">' +
                '<span class="act-time">' + a.time + '</span>' +
                '<span class="act-title">' + escapeHtml(a.title) + '</span>' +
                '<span class="act-type badge-' + a.type + '">' + a.type + '</span>' +
                '<span class="act-xp">+' + a.xp + ' XP</span></div>';
            }).join('') + '</div></div>';
        }).join('') + '</div>';

      document.querySelectorAll('[data-lockday]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = this.getAttribute('data-lockday');
          dayLocks[key] = !dayLocks[key];
          AIA.Storage.set('dayLocks', dayLocks);
          if (AIA.db) {
            AIA.db.ref('config/dayLocks').set(dayLocks);
          }
          AIA.showToast(CONFIG.dateLabels[parseInt(key.replace('day', '')) - 1] + ' ' + (dayLocks[key] ? 'verrouille' : 'deverrouille'), 'info');
          renderCourse(el);
        });
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

    /* ======== SETTINGS ======== */
    function renderSettings(el) {
      var fbConfig = AIA.Storage.get('firebaseConfig', null);

      el.innerHTML =
        '<div class="admin-section glass-card">' +
        '<h3>Configuration Firebase</h3>' +
        '<p style="color:var(--text-muted);margin-bottom:1rem">Collez votre config Firebase pour activer la synchronisation temps reel</p>' +
        '<textarea id="firebase-config-input" class="demo-textarea" rows="6" placeholder=\'{"apiKey":"...","authDomain":"...","databaseURL":"...","projectId":"..."}\'>' +
        (fbConfig ? JSON.stringify(fbConfig, null, 2) : '') + '</textarea>' +
        '<button class="btn-primary" id="btn-save-firebase" style="margin-top:0.8rem">Sauvegarder la config</button>' +
        '<div id="firebase-status" style="margin-top:0.5rem;font-size:0.82rem;color:' + (fbConfig ? '#2ecc71' : '#e74c3c') + '">' +
        (fbConfig ? 'Firebase configure' : 'Firebase non configure — mode local') + '</div></div>' +

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

      document.getElementById('btn-save-firebase').addEventListener('click', function () {
        var raw = document.getElementById('firebase-config-input').value.trim();
        if (!raw) {
          AIA.Storage.set('firebaseConfig', null);
          AIA.showToast('Config Firebase supprimee', 'info');
          renderSettings(el);
          return;
        }
        try {
          var cfg = JSON.parse(raw);
          if (!cfg.apiKey || !cfg.databaseURL) throw new Error('Missing fields');
          AIA.Storage.set('firebaseConfig', cfg);
          AIA.showToast('Config Firebase sauvegardee — rechargez la page', 'success');
          renderSettings(el);
        } catch (e) {
          AIA.showToast('JSON invalide — verifiez le format', 'error');
        }
      });

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
