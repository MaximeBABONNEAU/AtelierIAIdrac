/* ==============================================
   ROOM.JS — Virtual Classroom (Canvas)
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  var W = 960, H = 540;
  var TILE = 32;
  var SPRITE_SCALE = 2;
  var animFrame = null;

  var FURNITURE = [
    { type: 'desk', x: 80, y: 140, w: 120, h: 50 },
    { type: 'desk', x: 280, y: 140, w: 120, h: 50 },
    { type: 'desk', x: 480, y: 140, w: 120, h: 50 },
    { type: 'desk', x: 680, y: 140, w: 120, h: 50 },
    { type: 'desk', x: 80, y: 270, w: 120, h: 50 },
    { type: 'desk', x: 280, y: 270, w: 120, h: 50 },
    { type: 'desk', x: 480, y: 270, w: 120, h: 50 },
    { type: 'desk', x: 680, y: 270, w: 120, h: 50 },
    { type: 'desk', x: 80, y: 400, w: 120, h: 50 },
    { type: 'desk', x: 280, y: 400, w: 120, h: 50 },
    { type: 'desk', x: 480, y: 400, w: 120, h: 50 },
    { type: 'desk', x: 680, y: 400, w: 120, h: 50 },
    { type: 'board', x: 300, y: 20, w: 360, h: 80 }
  ];

  var STATUS_COLORS = {
    online: '#2ecc71',
    busy: '#f5b731',
    idle: '#95a5a6'
  };

  var PAGE_LABELS = {
    dashboard: 'Dashboard',
    program: 'Programme',
    demos: 'Demos IA',
    arena: 'Arena',
    room: 'Salle',
    avatar: 'Avatar',
    game: 'Business Game',
    leaderboard: 'Classement',
    tools: 'Outils',
    profile: 'Profil'
  };

  function getStudentStatus(student) {
    if (!student.online) return 'idle';
    var p = student.page || '';
    if (p.indexOf('demo') === 0 || p === 'arena' || p === 'game') return 'busy';
    return 'online';
  }

  function drawBackground(ctx) {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(167,31,40,0.08)';
    ctx.lineWidth = 1;
    for (var x = 0; x < W; x += TILE) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (var y = 0; y < H; y += TILE) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function drawFurniture(ctx) {
    for (var i = 0; i < FURNITURE.length; i++) {
      var f = FURNITURE[i];
      if (f.type === 'board') {
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(f.x, f.y, f.w, f.h);
        ctx.strokeStyle = '#f5b731';
        ctx.lineWidth = 2;
        ctx.strokeRect(f.x, f.y, f.w, f.h);
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '14px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('IDRAC — AI Marketing Academy', f.x + f.w / 2, f.y + f.h / 2 + 5);
        ctx.textAlign = 'left';
      } else {
        ctx.fillStyle = '#16213e';
        ctx.fillRect(f.x, f.y, f.w, f.h);
        ctx.strokeStyle = 'rgba(212,52,63,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(f.x, f.y, f.w, f.h);
      }
    }
  }

  function seatPosition(index) {
    var desks = FURNITURE.filter(function (f) { return f.type === 'desk'; });
    var perDesk = 3;
    var deskIdx = Math.floor(index / perDesk) % desks.length;
    var seatInDesk = index % perDesk;
    var desk = desks[deskIdx];
    var spacing = desk.w / (perDesk + 1);
    return {
      x: desk.x + spacing * (seatInDesk + 1) - 8,
      y: desk.y + desk.h + 4
    };
  }

  function drawStudent(ctx, student, pos, tick) {
    var AIA = window.AIA;
    var avatar = student.avatar || (AIA.getDefaultAvatar ? AIA.getDefaultAvatar() : null);
    var spriteSize = AIA.SPRITE_SIZE || 16;
    var bounce = Math.sin(tick * 0.05 + pos.x) * 2;

    if (avatar && AIA.renderMiniSprite) {
      AIA.renderMiniSprite(ctx, avatar, SPRITE_SCALE, pos.x, pos.y + bounce);
    } else {
      ctx.fillStyle = '#A71F28';
      ctx.fillRect(pos.x, pos.y + bounce, spriteSize * SPRITE_SCALE, spriteSize * SPRITE_SCALE);
    }

    // Render RPG item overlays (admin crown/staff, top-ranked items)
    if (AIA.renderItemOverlay && AIA.getItemsForRank) {
      var items = [];
      if (student.isAdmin) {
        items = AIA.getItemsForRank(0, true);
      } else if (typeof student.rank === 'number' && student.rank > 0) {
        items = AIA.getItemsForRank(student.rank, false);
      }
      for (var ii = 0; ii < items.length; ii++) {
        AIA.renderItemOverlay(ctx, items[ii], SPRITE_SCALE, pos.x, pos.y + bounce);
      }
    }

    var status = getStudentStatus(student);
    var dotX = pos.x + spriteSize * SPRITE_SCALE + 2;
    var dotY = pos.y + bounce;
    ctx.fillStyle = STATUS_COLORS[status];
    ctx.beginPath();
    ctx.arc(dotX, dotY + 4, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ecf0f1';
    ctx.font = '10px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    var nameX = pos.x + (spriteSize * SPRITE_SCALE) / 2;
    ctx.fillText(student.name || '?', nameX, pos.y + spriteSize * SPRITE_SCALE + bounce + 14);

    if (status === 'busy') {
      var label = PAGE_LABELS[student.page] || student.page || '';
      if (label) {
        ctx.fillStyle = 'rgba(245,183,49,0.85)';
        ctx.font = '8px Montserrat, sans-serif';
        ctx.fillText(label, nameX, pos.y + spriteSize * SPRITE_SCALE + bounce + 24);
      }
    }
    ctx.textAlign = 'left';
  }

  function drawStats(ctx, students) {
    var online = 0, busy = 0, idle = 0;
    for (var k in students) {
      var s = getStudentStatus(students[k]);
      if (s === 'online') online++;
      else if (s === 'busy') busy++;
      else idle++;
    }
    ctx.fillStyle = 'rgba(26,26,46,0.85)';
    ctx.fillRect(W - 200, H - 40, 195, 35);
    ctx.strokeStyle = 'rgba(167,31,40,0.4)';
    ctx.strokeRect(W - 200, H - 40, 195, 35);
    ctx.font = '11px Montserrat, sans-serif';
    ctx.fillStyle = STATUS_COLORS.online;
    ctx.fillText(online + ' en ligne', W - 190, H - 18);
    ctx.fillStyle = STATUS_COLORS.busy;
    ctx.fillText(busy + ' actifs', W - 120, H - 18);
    ctx.fillStyle = STATUS_COLORS.idle;
    ctx.fillText(idle + ' absents', W - 55, H - 18);
  }

  function initRoom() {
    var canvas = document.getElementById('room-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var AIA = window.AIA;
    var tick = 0;
    var students = {};

    var st = AIA.getState();
    if (st.user) {
      students[st.user] = {
        name: st.user,
        online: true,
        page: st.currentPage || 'room',
        avatar: st.avatar
      };
    }

    if (AIA.db) {
      var ref = AIA.db.ref('students');
      ref.on('value', function (snap) {
        var data = snap.val();
        if (!data) return;
        for (var k in data) {
          students[k] = data[k];
          if (!students[k].name) students[k].name = k;
        }
      });
    } else {
      var FAKE_NAMES = [
        'Alice','Bob','Clara','David','Emma','Felix','Grace','Hugo',
        'Iris','Jules','Kenza','Leo','Manon','Nathan','Olivia','Paul',
        'Quinn','Rose','Simon','Theo','Ursula','Victor','Wendy','Xavier',
        'Yasmine','Zoe','Adam','Bea','Cyril','Dana'
      ];
      for (var i = 0; i < 30; i++) {
        var nm = FAKE_NAMES[i];
        var pages = ['dashboard','program','demos','arena','game','room','leaderboard','tools','profile'];
        students[nm] = {
          name: nm,
          online: Math.random() > 0.3,
          page: pages[Math.floor(Math.random() * pages.length)],
          avatar: {
            skin: Math.floor(Math.random() * 6),
            hair: Math.floor(Math.random() * 10),
            hairStyle: Math.floor(Math.random() * 5),
            eyes: Math.floor(Math.random() * 6),
            outfit: Math.floor(Math.random() * 10),
            accessory: Math.floor(Math.random() * 7),
            accessoryType: Math.floor(Math.random() * 4)
          }
        };
      }
    }

    var refreshBtn = document.getElementById('btn-room-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function () {
        if (!AIA.db) {
          for (var k in students) {
            if (k === st.user) continue;
            students[k].online = Math.random() > 0.3;
            var pages = ['dashboard','program','demos','arena','game','room','leaderboard'];
            students[k].page = pages[Math.floor(Math.random() * pages.length)];
          }
        }
        AIA.showToast('Salle actualisee', 'info');
      });
    }

    function render() {
      tick++;
      ctx.clearRect(0, 0, W, H);
      drawBackground(ctx);
      drawFurniture(ctx);

      var keys = Object.keys(students);
      for (var i = 0; i < keys.length; i++) {
        var s = students[keys[i]];
        if (!s.online && !AIA.db) continue;
        var pos = seatPosition(i);
        drawStudent(ctx, s, pos, tick);
      }

      drawStats(ctx, students);
      animFrame = requestAnimationFrame(render);
    }

    if (animFrame) cancelAnimationFrame(animFrame);
    render();
  }

  window.AIA = window.AIA || {};
  window.AIA.initRoom = initRoom;
})();
