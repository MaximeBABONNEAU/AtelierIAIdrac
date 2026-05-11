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
      '<button class="admin-tab" data-tab="accounts">Comptes</button>' +
      '<button class="admin-tab" data-tab="students">Etudiants</button>' +
      '<button class="admin-tab" data-tab="course">Cours</button>' +
      '<button class="admin-tab" data-tab="submissions">Activites</button>' +
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
      else if (tab === 'accounts') renderAccounts(content);
      else if (tab === 'students') renderStudents(content);
      else if (tab === 'course') renderCourse(content);
      else if (tab === 'submissions') renderSubmissions(content);
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
              accts[key].passwordHash = AIA.hashPass(newPw);
              AIA.saveAccountsToFirebase(accts);
              AIA.showToast('MDP reinitialise pour ' + a.firstName, 'success');
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
              AIA.saveAccountsToFirebase(accts);
              AIA.deleteStudentState(key);
              AIA.showToast('Compte supprime : ' + a.firstName + ' ' + a.lastName, 'info');
              renderAccounts(el);
            });
          });

          var btnResetAllPw = document.getElementById('btn-reset-all-pw');
          if (btnResetAllPw) {
            btnResetAllPw.addEventListener('click', function () {
              if (!confirm('Reinitialiser TOUS les mots de passe ? Le nouveau MDP sera "idrac2026".')) return;
              var defaultHash = AIA.hashPass('idrac2026');
              for (var k in accts) { accts[k].passwordHash = defaultHash; }
              AIA.saveAccountsToFirebase(accts);
              AIA.showToast('Tous les MDP reinitialises a "idrac2026"', 'success');
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
              for (var k in accts) { AIA.deleteStudentState(k); }
              AIA.saveAccountsToFirebase({});
              AIA.showToast('Tous les comptes supprimes', 'info');
              renderAccounts(el);
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
