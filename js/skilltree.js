/* ==============================================
   SKILLTREE.JS — Arbre de competences IA visuel
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  /* ============ SKILL DEFINITIONS ============ */
  // Each skill computes its level (0-4) from completed activities.
  // Levels: 0=locked, 1=Novice, 2=Apprenti, 3=Pratiquant, 4=Expert
  var SKILLS = [
    {
      id: 'prompt', name: 'Prompt Engineering', icon: '✍️', color: '#3498db',
      desc: 'Maitriser la structure CRAC, few-shot, chain-of-thought.',
      compute: function (st) {
        var pts = 0;
        if (didDemo(st, 'demo-prompt')) pts += 2;
        if (didDemo(st, 'demo-chatbot')) pts += 1;
        if (hasReflection(st, 'demo-prompt')) pts += 1;
        if (hasBadge(st, 'first-prompt')) pts += 1;
        if (hasBadge(st, 'grade-a')) pts += 2;
        if (hasBadge(st, 'prompt-master')) pts += 1;
        return Math.min(4, Math.floor(pts / 2));
      },
      unlocks: 'N1 Comprendre CRAC. N2 Few-shot fluide. N3 Chain-of-thought. N4 Prompt engineering avance + meta-prompts.'
    },
    {
      id: 'visual', name: 'Image AI', icon: '🎨', color: '#e74c3c',
      desc: 'Generation et retouche d\'images avec FLUX, SD, DALL-E.',
      compute: function (st) {
        var pts = 0;
        if (didDemo(st, 'demo-image')) pts += 2;
        if (didDemo(st, 'demo-logo')) pts += 1;
        if (didDemo(st, 'demo-bg-remove')) pts += 1;
        if (didDemo(st, 'demo-upscale')) pts += 1;
        if (didGameStep(st, 'ad-visuals')) pts += 2;
        if (didGameStep(st, 'logo')) pts += 1;
        if (hasBadge(st, 'visual-master')) pts += 2;
        return Math.min(4, Math.floor(pts / 2));
      },
      unlocks: 'N1 Premier visuel. N2 Prompts visuels efficaces. N3 Branding coherent. N4 Maitrise pipeline FLUX + post-prod.'
    },
    {
      id: 'audio', name: 'Audio & Video AI', icon: '🎵', color: '#9b59b6',
      desc: 'Musique, voix-off, transcription, avatars video.',
      compute: function (st) {
        var pts = 0;
        if (didDemo(st, 'demo-music')) pts += 1;
        if (didDemo(st, 'demo-tts')) pts += 1;
        if (didDemo(st, 'demo-speech')) pts += 1;
        if (didDemo(st, 'demo-avatar')) pts += 1;
        if (didGameStep(st, 'pitch-video')) pts += 2;
        if (hasBadge(st, 'audio-wizard')) pts += 2;
        return Math.min(4, Math.floor(pts / 2));
      },
      unlocks: 'N1 1 outil audio teste. N2 Pipeline son+image+texte. N3 Video pitch produite. N4 Studio AI complet.'
    },
    {
      id: 'copywriting', name: 'Copywriting AI', icon: '📝', color: '#2ecc71',
      desc: 'Headlines, body copy, CTAs, emails optimises.',
      compute: function (st) {
        var pts = 0;
        if (didDemo(st, 'demo-chatbot')) pts += 1;
        if (didDemo(st, 'demo-translate')) pts += 1;
        if (didDemo(st, 'demo-sentiment')) pts += 1;
        if (didGameStep(st, 'copy')) pts += 2;
        if (didGameStep(st, 'brand-name')) pts += 1;
        if (hasBadge(st, 'copywriter')) pts += 1;
        if (hasBadge(st, 'grade-a')) pts += 1;
        return Math.min(4, Math.floor(pts / 2));
      },
      unlocks: 'N1 Premier copy AI. N2 Headlines structurees. N3 Body + CTAs convaincants. N4 Transcreation multi-langue.'
    },
    {
      id: 'strategy', name: 'Strategie Marketing', icon: '🎯', color: '#f5b731',
      desc: 'Persona, marche, positionnement, plan media.',
      compute: function (st) {
        var pts = 0;
        if (didGameStep(st, 'product-idea')) pts += 1;
        if (didGameStep(st, 'target-persona')) pts += 1;
        if (didGameStep(st, 'market-analysis')) pts += 1;
        if (didGameStep(st, 'brand-guide')) pts += 1;
        if (didGameStep(st, 'media-plan')) pts += 1;
        if (hasBadge(st, 'phase1-done')) pts += 1;
        if (hasBadge(st, 'phase2-done')) pts += 1;
        if (hasBadge(st, 'phase3-done')) pts += 1;
        return Math.min(4, Math.floor(pts / 2));
      },
      unlocks: 'N1 Idee produit posee. N2 Persona + marche. N3 Branding aligne. N4 Strategie 360 prete a executer.'
    },
    {
      id: 'analytics', name: 'Analytics & A/B', icon: '📊', color: '#1abc9c',
      desc: 'KPIs, A/B testing, sentiment, mesure ROI.',
      compute: function (st) {
        var pts = 0;
        if (didDemo(st, 'demo-abtest')) pts += 2;
        if (didDemo(st, 'demo-sentiment')) pts += 1;
        if (didDemo(st, 'demo-vqa')) pts += 1;
        if (didGameStep(st, 'media-plan')) pts += 2;
        if (hasReflection(st, 'demo-abtest')) pts += 1;
        return Math.min(4, Math.floor(pts / 2));
      },
      unlocks: 'N1 Comprendre A/B. N2 Significativite statistique. N3 Analyse sentiment + visuel. N4 Tableau de bord ROAS complet.'
    },
    {
      id: 'seo', name: 'SEO & Pitch', icon: '🚀', color: '#e67e22',
      desc: 'SEO, landing, pitch, lancement produit.',
      compute: function (st) {
        var pts = 0;
        if (didDemo(st, 'demo-seo')) pts += 2;
        if (didGameStep(st, 'landing-page')) pts += 2;
        if (didGameStep(st, 'final-deck')) pts += 2;
        if (didGameStep(st, 'pitch-video')) pts += 1;
        if (hasBadge(st, 'phase4-done')) pts += 1;
        if (hasBadge(st, 'pitcher')) pts += 1;
        return Math.min(4, Math.floor(pts / 2));
      },
      unlocks: 'N1 Bases SEO. N2 Landing structuree. N3 Pitch deck complet. N4 Lancement campagne reel.'
    },
    {
      id: 'ethics', name: 'Ethique & RGPD', icon: '⚖️', color: '#34495e',
      desc: 'Deepfake, biais, consentement, RGPD, fact-checking.',
      compute: function (st) {
        var pts = 0;
        if (didDemo(st, 'demo-avatar')) pts += 1;
        if (hasReflection(st, 'demo-avatar')) pts += 2;
        if (hasReflection(st, 'demo-chatbot')) pts += 1;
        if ((st.resourcesViewed || []).indexOf('r4') !== -1) pts += 2;
        return Math.min(4, Math.floor(pts / 2));
      },
      unlocks: 'N1 Sensibilise aux risques. N2 Connait RGPD. N3 Consentement + transparence. N4 Cadre ethique IA d\'entreprise.'
    }
  ];

  /* ============ HELPERS ============ */
  function didDemo(st, id) { return Array.isArray(st.demosCompleted) && st.demosCompleted.indexOf(id) !== -1; }
  function didGameStep(st, id) { return !!(st.gameDeliverables && st.gameDeliverables[id]); }
  function hasReflection(st, id) { return !!(st.reflections && st.reflections[id]); }
  function hasBadge(st, id) { return Array.isArray(st.badges) && st.badges.indexOf(id) !== -1; }

  var LEVEL_NAMES = ['Verrouille', 'Novice', 'Apprenti', 'Pratiquant', 'Expert'];

  /* ============ RENDER ============ */
  function renderSkillTree(main) {
    var st = window.AIA.getState();
    var skills = SKILLS.map(function (s) {
      return { def: s, level: s.compute(st) };
    });
    var totalLevel = skills.reduce(function (sum, s) { return sum + s.level; }, 0);
    var maxLevel = SKILLS.length * 4;
    var pct = Math.round(totalLevel * 100 / maxLevel);

    var html = '<div class="page-header"><h1>Skill <span class="gradient-text">Tree IA</span></h1>' +
      '<p class="page-subtitle">Votre progression sur 8 axes de competences IA. Niveau global : <strong>' + totalLevel + ' / ' + maxLevel + '</strong> (' + pct + '%)</p>' +
      '</div>' +

      '<div class="skill-global glass-card">' +
      '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '<p style="font-size:0.78rem;color:var(--text-muted);margin-top:0.5rem">Faites des demos, validez des etapes Game, ecrivez des reflexions et explorez les ressources pour debloquer chaque niveau.</p>' +
      '</div>' +

      '<div class="skill-grid">' +
      skills.map(function (s) {
        var def = s.def, lvl = s.level;
        var bars = '';
        for (var i = 0; i < 4; i++) {
          bars += '<div class="skill-bar' + (i < lvl ? ' filled' : '') + '" style="' + (i < lvl ? 'background:' + def.color : '') + '"></div>';
        }
        return '<div class="skill-card glass-card' + (lvl === 0 ? ' locked' : '') + '" style="border-left:4px solid ' + def.color + '">' +
          '<div class="skill-header">' +
          '<span class="skill-icon">' + def.icon + '</span>' +
          '<div class="skill-title-block">' +
          '<h3>' + escapeHtml(def.name) + '</h3>' +
          '<div class="skill-level-name" style="color:' + (lvl > 0 ? def.color : 'var(--text-muted)') + '">' + LEVEL_NAMES[lvl] + ' &bull; Lvl ' + lvl + '/4</div>' +
          '</div>' +
          '</div>' +
          '<p class="skill-desc">' + escapeHtml(def.desc) + '</p>' +
          '<div class="skill-bars">' + bars + '</div>' +
          '<p class="skill-unlocks">' + escapeHtml(def.unlocks) + '</p>' +
          '</div>';
      }).join('') +
      '</div>' +

      '<div class="glass-card" style="padding:1rem;margin-top:1rem">' +
      '<h3 style="margin-bottom:0.5rem">💡 Comment monter de niveau ?</h3>' +
      '<ul style="font-size:0.85rem;line-height:1.7;padding-left:1.2rem;color:var(--text-secondary)">' +
      '<li>🛠️ <strong>Demos IA</strong> : chaque demo testee augmente un ou plusieurs skills</li>' +
      '<li>🎯 <strong>Etapes Business Game</strong> : valider les 12 etapes booste fortement Strategie + SEO/Pitch</li>' +
      '<li>🪞 <strong>Reflexions ecrites</strong> : ancrer ce qui a ete vu donne des points (Ethique notamment)</li>' +
      '<li>📚 <strong>Ressources</strong> : consultez l\'article CNIL pour debloquer Ethique avance</li>' +
      '<li>🏅 <strong>Badges</strong> : grade-a, visual-master, audio-wizard donnent des bonus de niveau</li>' +
      '</ul></div>';

    main.innerHTML = html;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  /* ============ EXPORTS ============ */
  window.AIA = window.AIA || {};
  window.AIA.SKILLS = SKILLS;
  window.AIA.renderSkillTree = renderSkillTree;
})();
