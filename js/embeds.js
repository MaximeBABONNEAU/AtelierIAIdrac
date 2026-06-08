/* ==============================================
   EMBEDS.JS — Videos & aper&ccedil;us int&eacute;gr&eacute;s (modale au clic)
   IDRAC Business School — Maxime BABONNEAU
   - Videos YouTube curated par activite (modale lecteur)
   - Apercu iframe des ressources (article/outil) avec repli "ouvrir en grand"
   ============================================== */
(function () {
  'use strict';

  /* ============ VIDEOS CURATED PAR ACTIVITE ============ */
  /* Vraies videos YouTube FR selectionnees pour chaque session du Programme. */
  var ACTIVITY_VIDEOS = {
    'd1-intro-ia': [
      { id: 'tklaXJGWMMs', title: "L'IA g&eacute;n&eacute;rative en marketing digital (webinar)", dur: '45 min' }
    ],
    'd1-premier-prompt': [
      { id: '4t9-r97j31E', title: 'Utiliser les prompts ChatGPT — guide complet', dur: '18 min' }
    ],
    'd1-prompt-avance': [
      { id: 'H89bSRvuY14', title: 'Formation au Prompt Engineering (FR)', dur: '35 min' }
    ],
    'd1-defi': [
      { id: 'R2jdPmrirgE', title: 'R&eacute;diger le PROMPT PARFAIT', dur: '20 min' }
    ],
    'd2-visuel': [
      { id: 'k3t3S9V3OlQ', title: 'Midjourney — le guide ultime pour d&eacute;butants', dur: '25 min' }
    ],
    'd2-atelier-image': [
      { id: 'h-54HxTNb-k', title: 'Midjourney — toutes les fonctionnalit&eacute;s d&eacute;cortiqu&eacute;es', dur: '40 min' }
    ],
    'd2-copywriting': [
      { id: 'mbq-bjxwSTY', title: "Tripler son efficacit&eacute; en copywriting avec l'IA", dur: '22 min' }
    ],
    'd2-video': [
      { id: 'VWLnvrVwzCg', title: 'Guide complet HeyGen — avatar, voix, vid&eacute;os multilingues', dur: '30 min' },
      { id: 'e1ISAuI5484', title: 'Avatar IA : HeyGen + ElevenLabs', dur: '15 min' }
    ],
    'd3-seo': [
      { id: 'RiMV_y9oqag', title: "Faire du SEO avec l'IA en 2025", dur: '20 min' }
    ],
    'd3-demo-seo': [
      { id: 'nebEY9KD-Yc', title: 'IA &amp; SEO : r&eacute;volutions, strat&eacute;gies et avenir', dur: '28 min' }
    ],
    'd3-game-launch': [
      { id: '52ugVWsRLjQ', title: "Cr&eacute;er une pr&eacute;sentation impactante en 1h gr&acirc;ce &agrave; l'IA", dur: '24 min' }
    ],
    'd4-prep-pitch': [
      { id: '52ugVWsRLjQ', title: "Pitch deck avec l'IA — pr&eacute;sentation en 1h", dur: '24 min' }
    ],
    'd4-closing': [
      { id: 'tklaXJGWMMs', title: "R&eacute;cap : l'IA g&eacute;n&eacute;rative en marketing", dur: '45 min' }
    ]
  };

  /* ============ INJECTION CSS (self-contained) ============ */
  function injectStyles() {
    if (document.getElementById('aia-embeds-style')) return;
    var css =
      '.embed-modal-overlay{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(8,8,12,0.86);backdrop-filter:blur(6px);padding:1.2rem;animation:embedFade .18s ease}' +
      '@keyframes embedFade{from{opacity:0}to{opacity:1}}' +
      '.embed-modal{position:relative;width:100%;max-width:980px;background:#14141b;border:1px solid rgba(255,255,255,0.1);' +
      'border-radius:16px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.6);display:flex;flex-direction:column;max-height:92vh}' +
      '.embed-modal-head{display:flex;align-items:center;gap:.8rem;padding:.85rem 1rem;border-bottom:1px solid rgba(255,255,255,0.08)}' +
      '.embed-modal-head h3{font-size:.95rem;font-weight:700;margin:0;flex:1;line-height:1.3;color:#fff}' +
      '.embed-modal-close{background:rgba(255,255,255,0.08);border:none;color:#fff;width:34px;height:34px;border-radius:9px;' +
      'cursor:pointer;font-size:1.1rem;line-height:1;flex-shrink:0;transition:background .15s}' +
      '.embed-modal-close:hover{background:var(--red-light,#e3454f)}' +
      '.embed-modal-open{display:inline-flex;align-items:center;gap:.3rem;font-size:.74rem;color:#f5b731;text-decoration:none;' +
      'border:1px solid rgba(245,183,49,0.4);padding:.3rem .6rem;border-radius:8px;white-space:nowrap;transition:background .15s}' +
      '.embed-modal-open:hover{background:rgba(245,183,49,0.12)}' +
      '.embed-frame-wrap{position:relative;background:#000;flex:1;min-height:0}' +
      '.embed-frame-wrap.is-video{aspect-ratio:16/9}' +
      '.embed-frame-wrap.is-site{height:72vh}' +
      '.embed-frame-wrap iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff}' +
      '.embed-frame-wrap.is-video iframe{background:#000}' +
      '.embed-fallback{padding:.6rem 1rem;font-size:.76rem;color:var(--text-muted,#9aa);background:rgba(255,255,255,0.03);' +
      'border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}' +
      '.embed-fallback a{color:#f5b731;font-weight:600;text-decoration:none}' +
      /* ---- Galerie de vignettes video dans une activite ---- */
      '.activity-videos{margin:1.2rem 0}' +
      '.activity-videos h4{font-size:.95rem;font-weight:700;margin:0 0 .7rem}' +
      '.video-thumb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.8rem}' +
      '.video-thumb{position:relative;cursor:pointer;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);' +
      'background:#0d0d12;transition:transform .15s,border-color .15s}' +
      '.video-thumb:hover{transform:translateY(-3px);border-color:var(--red-light,#e3454f)}' +
      '.video-thumb-img{position:relative;aspect-ratio:16/9;background-size:cover;background-position:center}' +
      '.video-thumb-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}' +
      '.video-thumb-play span{width:48px;height:48px;border-radius:50%;background:rgba(227,69,79,0.92);display:flex;' +
      'align-items:center;justify-content:center;color:#fff;font-size:1.1rem;padding-left:3px;box-shadow:0 4px 16px rgba(0,0,0,0.4)}' +
      '.video-thumb-meta{padding:.55rem .65rem}' +
      '.video-thumb-meta p{font-size:.78rem;font-weight:600;margin:0;line-height:1.35;color:#f0f0f4}' +
      '.video-thumb-meta .vt-dur{font-size:.68rem;color:var(--text-muted,#9aa);margin-top:.25rem;display:inline-block}' +
      '.res-preview-btn{margin-top:.4rem}' +
      '@media(max-width:600px){.embed-frame-wrap.is-site{height:64vh}.video-thumb-grid{grid-template-columns:1fr 1fr}}';
    var s = document.createElement('style');
    s.id = 'aia-embeds-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ============ MODALE GENERIQUE ============ */
  var keyHandler = null;
  function closeModal() {
    var ex = document.getElementById('aia-embed-modal');
    if (ex) ex.remove();
    if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
    document.body.style.overflow = '';
  }

  function buildModal(headHtml, bodyHtml) {
    closeModal();
    injectStyles();
    var overlay = document.createElement('div');
    overlay.className = 'embed-modal-overlay';
    overlay.id = 'aia-embed-modal';
    overlay.innerHTML =
      '<div class="embed-modal" role="dialog" aria-modal="true">' +
        '<div class="embed-modal-head">' + headHtml +
          '<button class="embed-modal-close" aria-label="Fermer">&times;</button>' +
        '</div>' + bodyHtml +
      '</div>';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    overlay.querySelector('.embed-modal-close').addEventListener('click', closeModal);
    keyHandler = function (e) { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', keyHandler);
    return overlay;
  }

  /* ============ MODALE VIDEO YOUTUBE ============ */
  function openVideoModal(youtubeId, title) {
    var safeTitle = title || 'Vid&eacute;o';
    var watchUrl = 'https://www.youtube.com/watch?v=' + youtubeId;
    var embedUrl = 'https://www.youtube-nocookie.com/embed/' + youtubeId + '?autoplay=1&rel=0&modestbranding=1';
    buildModal(
      '<h3>&#127909; ' + safeTitle + '</h3>' +
      '<a class="embed-modal-open" href="' + watchUrl + '" target="_blank" rel="noopener noreferrer">YouTube &#8599;</a>',
      '<div class="embed-frame-wrap is-video">' +
        '<iframe src="' + embedUrl + '" title="' + safeTitle + '" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>' +
      '</div>'
    );
  }

  /* ============ MODALE APERCU SITE (article / outil) ============ */
  function openIframeModal(url, title) {
    var safeTitle = title || 'Aper&ccedil;u';
    buildModal(
      '<h3>&#128279; ' + safeTitle + '</h3>' +
      '<a class="embed-modal-open" href="' + url + '" target="_blank" rel="noopener noreferrer">Ouvrir en grand &#8599;</a>',
      '<div class="embed-frame-wrap is-site">' +
        '<iframe src="' + url + '" title="' + safeTitle + '" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups allow-forms"></iframe>' +
      '</div>' +
      '<div class="embed-fallback">&#9888;&#65039; Certains sites bloquent l\'affichage int&eacute;gr&eacute;. ' +
        'Si la page reste blanche, <a href="' + url + '" target="_blank" rel="noopener noreferrer">ouvrez-la dans un nouvel onglet &#8599;</a>.' +
      '</div>'
    );
  }

  /* ============ MODALE DEMO HUGGING FACE (login HF requis pour le quota GPU) ============ */
  function openHfDemo(url, title) {
    var safeTitle = title || 'D&eacute;mo Hugging Face';
    var banner =
      '<div class="hf-login-banner" style="background:linear-gradient(90deg,rgba(255,209,102,0.16),rgba(255,159,0,0.10));border:1px solid rgba(255,159,0,0.35);border-radius:12px;padding:.7rem .9rem;margin-bottom:.7rem">' +
        '<div style="font-weight:700;margin-bottom:.25rem">&#128273; Connecte-toi &agrave; Hugging Face (gratuit) pour g&eacute;n&eacute;rer</div>' +
        '<div style="font-size:.85rem;color:var(--text-secondary,#cbd);margin-bottom:.55rem">Les d&eacute;mos GPU (FLUX, Stable Diffusion&hellip;) ont besoin d\'un <strong>compte gratuit Hugging Face</strong> pour d&eacute;bloquer ton quota GPU quotidien. Sans connexion, la g&eacute;n&eacute;ration est en file d\'attente ou bloqu&eacute;e.</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:.45rem;align-items:center">' +
          '<a class="btn-primary btn-xs" href="https://huggingface.co/join" target="_blank" rel="noopener noreferrer">Cr&eacute;er un compte gratuit &#8599;</a>' +
          '<a class="btn-outline btn-xs" href="https://huggingface.co/login" target="_blank" rel="noopener noreferrer">Se connecter &#8599;</a>' +
          '<a class="btn-outline btn-xs" href="' + url + '" target="_blank" rel="noopener noreferrer" style="margin-left:auto">&#128194; Ouvrir le Space dans un onglet (connect&eacute; HF) &#8599;</a>' +
        '</div>' +
        '<div style="font-size:.76rem;color:var(--text-muted,#9aa);margin-top:.45rem">Astuce : pour vraiment <strong>g&eacute;n&eacute;rer</strong>, ouvre le Space dans un onglet o&ugrave; tu es connect&eacute; &agrave; HF (l\'aper&ccedil;u int&eacute;gr&eacute; ci-dessous limite la connexion).</div>' +
      '</div>';
    buildModal(
      '<h3>&#129303; ' + safeTitle + ' <span style="font-size:.7rem;font-weight:500;color:var(--text-muted,#9aa)">(Hugging Face)</span></h3>' +
      '<a class="embed-modal-open" href="' + url + '" target="_blank" rel="noopener noreferrer">Ouvrir en grand &#8599;</a>',
      banner +
      '<div class="embed-frame-wrap is-site">' +
        '<iframe src="' + url + '" title="' + safeTitle + '" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"></iframe>' +
      '</div>' +
      '<div class="embed-fallback">&#9888;&#65039; Page blanche ou &laquo; Sign in &raquo; ? <a href="' + url + '" target="_blank" rel="noopener noreferrer">Ouvre le Space dans un onglet &#8599;</a> apr&egrave;s t\'&ecirc;tre connect&eacute; &agrave; Hugging Face.</div>'
    );
  }

  /* ============ GALERIE VIGNETTES POUR UNE ACTIVITE ============ */
  function renderActivityVideos(actId) {
    var vids = ACTIVITY_VIDEOS[actId];
    if (!vids || !vids.length) return '';
    var cards = vids.map(function (v) {
      var thumb = 'https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg';
      return '<div class="video-thumb" onclick="window.AIA.openVideoModal(\'' + v.id + '\',\'' + String(v.title).replace(/'/g, "\\'") + '\')">' +
        '<div class="video-thumb-img" style="background-image:url(' + thumb + ')">' +
          '<div class="video-thumb-play"><span>&#9658;</span></div>' +
        '</div>' +
        '<div class="video-thumb-meta"><p>' + v.title + '</p>' +
          (v.dur ? '<span class="vt-dur">&#9201;&#65039; ' + v.dur + '</span>' : '') +
        '</div></div>';
    }).join('');
    return '<div class="activity-videos">' +
      '<h4>&#127909; Vid&eacute;os du cours <span style="font-size:.72rem;color:var(--text-muted,#9aa);font-weight:500">(lecture int&eacute;gr&eacute;e)</span></h4>' +
      '<div class="video-thumb-grid">' + cards + '</div></div>';
  }

  window.AIA = window.AIA || {};
  window.AIA.ACTIVITY_VIDEOS = ACTIVITY_VIDEOS;
  window.AIA.openVideoModal = openVideoModal;
  window.AIA.openIframeModal = openIframeModal;
  window.AIA.openHfDemo = openHfDemo;
  window.AIA.closeEmbedModal = closeModal;
  window.AIA.renderActivityVideos = renderActivityVideos;
})();
