/* ==============================================
   RESOURCES.JS — Bibliotheque de ressources curated
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  /* ============ CURATED RESOURCES LIBRARY ============ */
  var RESOURCES = [
    // ===== DAY 1 — Fondations IA =====
    { id: 'r1', day: 1, theme: 'prompt', type: 'article', title: 'Anthropic — Prompt Engineering Overview',
      url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview',
      desc: 'Guide officiel Anthropic : structure CRAC, few-shot, chain-of-thought.', duration: '15 min', level: 'debutant' },
    { id: 'r2', day: 1, theme: 'prompt', type: 'article', title: 'OpenAI — Prompt Engineering Playbook',
      url: 'https://platform.openai.com/docs/guides/prompt-engineering',
      desc: 'Bonnes pratiques OpenAI : decomposer, formats structures, contraintes.', duration: '20 min', level: 'debutant' },
    { id: 'r3', day: 1, theme: 'llm', type: 'tool', title: 'Compare LLM : Artificial Analysis',
      url: 'https://artificialanalysis.ai/',
      desc: 'Benchmarks et prix actualises des principaux modeles LLM.', duration: '10 min', level: 'tous' },
    { id: 'r4', day: 1, theme: 'ethique', type: 'article', title: 'CNIL — IA & RGPD',
      url: 'https://www.cnil.fr/fr/intelligence-artificielle',
      desc: 'CNIL France : reglementation IA generative et donnees personnelles.', duration: '15 min', level: 'pro' },
    { id: 'r5', day: 1, theme: 'persona', type: 'tool', title: 'HubSpot — Generateur de Persona',
      url: 'https://www.hubspot.com/make-my-persona',
      desc: 'Outil gratuit pour creer un buyer persona complet en 7 etapes.', duration: '20 min', level: 'debutant' },

    // ===== DAY 2 — Visuel & Marque =====
    { id: 'r6', day: 2, theme: 'image-ia', type: 'video', title: 'Comparatif Midjourney vs DALL-E vs Flux',
      url: 'https://www.youtube.com/results?search_query=midjourney+vs+dalle+vs+flux+2025',
      desc: 'Analyse comparative des principaux generateurs d\'image en 2025.', duration: '15 min', level: 'tous' },
    { id: 'r7', day: 2, theme: 'image-ia', type: 'tool', title: 'Midjourney Prompt Helper',
      url: 'https://prompt.noonshot.com/midjourney',
      desc: 'Builder de prompts visuel : styles, eclairages, compositions.', duration: '10 min', level: 'debutant' },
    { id: 'r8', day: 2, theme: 'branding', type: 'article', title: '12 Brand Archetypes (Jung)',
      url: 'https://iconicfox.com.au/brand-archetypes/',
      desc: 'Modele Jung des 12 archetypes pour positionner votre marque.', duration: '20 min', level: 'pro' },
    { id: 'r9', day: 2, theme: 'color', type: 'tool', title: 'Coolors — Generateur Palettes',
      url: 'https://coolors.co/',
      desc: 'Generez et exportez des palettes de marque coherentes.', duration: '10 min', level: 'debutant' },
    { id: 'r10', day: 2, theme: 'logo', type: 'tool', title: 'Vector Magic — PNG vers SVG',
      url: 'https://vectormagic.com/',
      desc: 'Convertir logo IA (PNG) en vectoriel SVG editable.', duration: '5 min', level: 'tous' },
    { id: 'r11', day: 2, theme: 'design', type: 'article', title: 'Refactoring UI — Free Tips',
      url: 'https://www.refactoringui.com/previews',
      desc: 'Bonnes pratiques visuelles ultra-applicables (Tailwind founders).', duration: '30 min', level: 'tous' },

    // ===== DAY 3 — Campagne Pub =====
    { id: 'r12', day: 3, theme: 'copy', type: 'article', title: 'Copy.ai — 50 Headline Formulas',
      url: 'https://www.copy.ai/blog/headlines',
      desc: '50 formules d\'accroches testees pour ads / landings / emails.', duration: '20 min', level: 'tous' },
    { id: 'r13', day: 3, theme: 'social', type: 'tool', title: 'Meta Ads Library',
      url: 'https://www.facebook.com/ads/library/',
      desc: 'Voir toutes les pubs de vos concurrents en temps reel.', duration: '15 min', level: 'pro' },
    { id: 'r14', day: 3, theme: 'video', type: 'tool', title: 'HeyGen — Avatar Video',
      url: 'https://www.heygen.com/',
      desc: 'Generer videos pub avec avatar IA (qualite broadcast).', duration: '10 min', level: 'tous' },
    { id: 'r15', day: 3, theme: 'video', type: 'tool', title: 'ElevenLabs — Voix IA Premium',
      url: 'https://elevenlabs.io/',
      desc: 'La meilleure synthese vocale IA pour voix-off pub.', duration: '10 min', level: 'tous' },
    { id: 'r16', day: 3, theme: 'analytics', type: 'tool', title: 'A/B Sample Size Calculator',
      url: 'https://www.evanmiller.org/ab-testing/sample-size.html',
      desc: 'Calculer la taille d\'echantillon minimum pour un A/B test.', duration: '5 min', level: 'pro' },
    { id: 'r17', day: 3, theme: 'audio', type: 'tool', title: 'Suno — Musique IA',
      url: 'https://suno.com/',
      desc: 'Generer chansons completes avec voix et paroles (jingles pub).', duration: '15 min', level: 'tous' },

    // ===== DAY 4 — Pitch & Lancement =====
    { id: 'r18', day: 4, theme: 'seo', type: 'tool', title: 'Google Search Console',
      url: 'https://search.google.com/search-console/',
      desc: 'Pilotage SEO : requetes, clicks, indexation, Core Web Vitals.', duration: '20 min', level: 'pro' },
    { id: 'r19', day: 4, theme: 'seo', type: 'article', title: 'Ahrefs — Beginner SEO Guide',
      url: 'https://ahrefs.com/blog/seo-basics/',
      desc: 'Guide complet SEO 2025 : technique, content, backlinks.', duration: '45 min', level: 'debutant' },
    { id: 'r20', day: 4, theme: 'pitch', type: 'article', title: 'Sequoia Pitch Deck Template',
      url: 'https://www.sequoiacap.com/article/writing-a-business-plan/',
      desc: 'Template pitch deck utilise par Airbnb, Stripe, etc.', duration: '15 min', level: 'pro' },
    { id: 'r21', day: 4, theme: 'pitch', type: 'tool', title: 'Gamma — Pitch deck IA',
      url: 'https://gamma.app/',
      desc: 'Generer un pitch deck complet a partir d\'un prompt.', duration: '15 min', level: 'tous' },
    { id: 'r22', day: 4, theme: 'landing', type: 'tool', title: 'Framer — Landing Pages',
      url: 'https://www.framer.com/',
      desc: 'Builder no-code de landing pages animees, niveau pro.', duration: '20 min', level: 'tous' },
    { id: 'r23', day: 4, theme: 'analytics', type: 'article', title: 'Plausible vs GA4 — Privacy-friendly',
      url: 'https://plausible.io/vs-google-analytics',
      desc: 'Analytics RGPD-friendly sans cookies banner.', duration: '10 min', level: 'pro' }
  ];

  /* ============ STATE TRACKING ============ */
  function markViewed(id) {
    var AIA = window.AIA;
    var st = AIA.getState();
    if (!Array.isArray(st.resourcesViewed)) st.resourcesViewed = [];
    if (st.resourcesViewed.indexOf(id) === -1) {
      st.resourcesViewed.push(id);
      if (AIA.saveState) AIA.saveState();
      if (st.resourcesViewed.length >= 10 && AIA.awardBadge) AIA.awardBadge('resource-explorer');
    }
  }

  /* ============ RENDER ============ */
  function renderResources(main) {
    var AIA = window.AIA;
    var st = AIA.getState();
    var viewed = Array.isArray(st.resourcesViewed) ? st.resourcesViewed : [];
    var stats = {
      total: RESOURCES.length,
      viewed: viewed.length,
      pct: Math.round((viewed.length / RESOURCES.length) * 100)
    };
    var typeIcons = { article: '📄', video: '🎬', tool: '🛠️', course: '🎓' };
    var levelColors = { debutant: '#2ecc71', tous: '#3498db', pro: '#e74c3c' };

    var html = '<div class="page-header"><h1>Bibliotheque <span class="gradient-text">Ressources</span></h1>' +
      '<p class="page-subtitle">' + stats.total + ' ressources curated par jour de cours &bull; ' + stats.viewed + ' consultees (' + stats.pct + '%)</p></div>' +
      '<div class="resources-progress glass-card">' +
      '<div class="progress-bar"><div class="progress-fill" style="width:' + stats.pct + '%"></div></div>' +
      '<p style="font-size:0.78rem;color:var(--text-muted);margin-top:0.4rem">Consultez 10 ressources pour debloquer le badge <strong>📚 Explorateur</strong>.</p>' +
      '</div>' +
      '<div class="resources-filters">' +
      '<button class="res-filter-btn active" data-filter="all">Toutes</button>' +
      '<button class="res-filter-btn" data-filter="day-1">📅 J1</button>' +
      '<button class="res-filter-btn" data-filter="day-2">📅 J2</button>' +
      '<button class="res-filter-btn" data-filter="day-3">📅 J3</button>' +
      '<button class="res-filter-btn" data-filter="day-4">📅 J4</button>' +
      '<button class="res-filter-btn" data-filter="type-article">📄 Articles</button>' +
      '<button class="res-filter-btn" data-filter="type-video">🎬 Videos</button>' +
      '<button class="res-filter-btn" data-filter="type-tool">🛠️ Outils</button>' +
      '</div>' +
      '<div class="resources-grid" id="resources-grid">' +
      RESOURCES.map(function (r) {
        var done = viewed.indexOf(r.id) !== -1;
        return '<div class="resource-card glass-card' + (done ? ' viewed' : '') + '" ' +
          'data-day="' + r.day + '" data-type="' + r.type + '">' +
          '<div class="resource-header">' +
          '<span class="resource-type-icon">' + (typeIcons[r.type] || '📌') + '</span>' +
          '<span class="resource-day-badge">J' + r.day + '</span>' +
          '<span class="resource-level-badge" style="background:' + (levelColors[r.level] || '#888') + '">' + r.level + '</span>' +
          (done ? '<span class="resource-viewed">✓ vu</span>' : '') +
          '</div>' +
          '<h3>' + escapeHtml(r.title) + '</h3>' +
          '<p class="resource-desc">' + escapeHtml(r.desc) + '</p>' +
          '<div class="resource-footer">' +
          '<span class="resource-duration">⏱️ ' + r.duration + '</span>' +
          '<span class="resource-theme">#' + r.theme + '</span>' +
          '</div>' +
          '<a href="' + r.url + '" target="_blank" rel="noopener noreferrer" class="btn-primary resource-open" data-res-id="' + r.id + '">Ouvrir →</a>' +
          '</div>';
      }).join('') +
      '</div>';

    main.innerHTML = html;

    main.querySelectorAll('.res-filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        main.querySelectorAll('.res-filter-btn').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        var f = this.getAttribute('data-filter');
        main.querySelectorAll('.resource-card').forEach(function (card) {
          var show = f === 'all';
          if (!show && f.indexOf('day-') === 0) show = card.getAttribute('data-day') === f.split('-')[1];
          if (!show && f.indexOf('type-') === 0) show = card.getAttribute('data-type') === f.split('-')[1];
          card.style.display = show ? '' : 'none';
        });
      });
    });

    main.querySelectorAll('.resource-open').forEach(function (link) {
      link.addEventListener('click', function () {
        var id = this.getAttribute('data-res-id');
        markViewed(id);
        var card = this.closest('.resource-card');
        if (card && !card.classList.contains('viewed')) {
          card.classList.add('viewed');
          var hdr = card.querySelector('.resource-header');
          if (hdr && !hdr.querySelector('.resource-viewed')) {
            var span = document.createElement('span');
            span.className = 'resource-viewed';
            span.textContent = '✓ vu';
            hdr.appendChild(span);
          }
        }
      });
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  window.AIA = window.AIA || {};
  window.AIA.RESOURCES = RESOURCES;
  window.AIA.renderResources = renderResources;
  window.AIA.markResourceViewed = markViewed;
})();
