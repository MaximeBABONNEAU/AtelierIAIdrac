/* ==============================================
   DEMOS.JS — 6 Interactive AI Demos
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  var ALL_DEMO_IDS = ['demo-prompt','demo-sentiment','demo-image','demo-chatbot','demo-abtest','demo-seo'];

  function markDemoComplete(demoId) {
    var AIA = window.AIA;
    var st = AIA.getState();
    if (st.demosCompleted.indexOf(demoId) === -1) {
      st.demosCompleted.push(demoId);
      AIA.addXP(25);
      AIA.saveState();
      AIA.showToast('Demo completee ! +25 XP', 'success');
      if (st.demosCompleted.length >= ALL_DEMO_IDS.length) {
        AIA.awardBadge('demo-all');
      }
    }
  }

  function backBtn(label) {
    return '<a href="#" data-navigate="demos" style="color:var(--text-muted);font-size:0.78rem;text-decoration:none;display:inline-flex;align-items:center;gap:0.3rem;margin-bottom:0.5rem">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> ' + (label || 'Demos') + '</a>';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ======== DEMO 1: PROMPT PLAYGROUND ======== */
  function renderDemoPrompt(main) {
    main.innerHTML = '<div class="page-header">' + backBtn() +
      '<h1>Prompt <span class="gradient-text">Playground</span></h1>' +
      '<p class="page-subtitle">Comparez differentes formulations de prompt</p></div>' +
      '<div class="demo-workspace glass-card">' +
      '<div class="demo-split">' +
      '<div class="demo-panel">' +
      '<h3>Prompt A</h3>' +
      '<textarea id="prompt-a" class="demo-textarea" rows="4" placeholder="Ex: Ecris un slogan pour une marque de cafe bio"></textarea>' +
      '</div>' +
      '<div class="demo-panel">' +
      '<h3>Prompt B</h3>' +
      '<textarea id="prompt-b" class="demo-textarea" rows="4" placeholder="Ex: En tant qu\'expert copywriter, cree un slogan percutant pour une marque de cafe bio premium"></textarea>' +
      '</div></div>' +
      '<div style="text-align:center;margin:1rem 0">' +
      '<button class="btn-primary" id="btn-prompt-go">Comparer les resultats</button></div>' +
      '<div id="prompt-results" class="demo-results"></div>' +
      '<div class="demo-tips glass-card" style="margin-top:1.5rem">' +
      '<h4>Techniques de Prompt Engineering</h4>' +
      '<div class="tips-grid">' +
      '<div class="tip"><strong>Role Playing</strong><br>Donner un role : "En tant que..."</div>' +
      '<div class="tip"><strong>Contraintes</strong><br>Preciser format, longueur, ton</div>' +
      '<div class="tip"><strong>Exemples</strong><br>Fournir des exemples (few-shot)</div>' +
      '<div class="tip"><strong>Chain of Thought</strong><br>"Reflechis etape par etape"</div>' +
      '</div></div></div>';

    document.getElementById('btn-prompt-go').addEventListener('click', function () {
      var a = document.getElementById('prompt-a').value.trim();
      var b = document.getElementById('prompt-b').value.trim();
      if (!a && !b) { window.AIA.showToast('Ecrivez au moins un prompt', 'error'); return; }
      var res = document.getElementById('prompt-results');
      res.innerHTML = '<div class="loading-pulse">Generation en cours...</div>';

      setTimeout(function () {
        var scoreA = Math.min(95, 40 + a.length);
        var scoreB = Math.min(95, 40 + b.length);
        var html = '<div class="demo-split">';
        if (a) html += '<div class="demo-result-panel"><h4>Resultat A</h4><p>Reponse generee pour votre prompt ' +
          (a.length > 50 ? 'detaille' : 'court') + '. Un prompt plus structure produit des resultats plus precis.</p>' +
          '<div class="prompt-score">Score: ' + scoreA + '/100</div></div>';
        if (b) html += '<div class="demo-result-panel"><h4>Resultat B</h4><p>Reponse generee pour votre prompt ' +
          (b.length > 50 ? 'detaille et contextualise' : 'concis') + '. La longueur et la precision impactent la qualite.</p>' +
          '<div class="prompt-score">Score: ' + scoreB + '/100</div></div>';
        html += '</div>';
        if (a && b) {
          var winner = scoreA >= scoreB ? 'A' : 'B';
          html += '<div class="prompt-verdict">Le prompt ' + winner + ' est plus detaille et produit generalement de meilleurs resultats.</div>';
        }
        res.innerHTML = html;
        markDemoComplete('demo-prompt');
      }, 1200);
    });
  }

  /* ======== DEMO 2: SENTIMENT ANALYSIS ======== */
  function renderDemoSentiment(main) {
    main.innerHTML = '<div class="page-header">' + backBtn() +
      '<h1>Analyse de <span class="gradient-text">Sentiment</span></h1>' +
      '<p class="page-subtitle">Analysez la tonalite emotionnelle de textes marketing</p></div>' +
      '<div class="demo-workspace glass-card">' +
      '<textarea id="sentiment-input" class="demo-textarea" rows="4" placeholder="Collez un avis client, un commentaire ou un texte marketing..."></textarea>' +
      '<div class="demo-presets">' +
      '<button class="btn-ghost btn-sm" data-preset="J\'adore ce produit, la qualite est exceptionnelle ! Je recommande a 100%">Positif</button>' +
      '<button class="btn-ghost btn-sm" data-preset="Le produit est correct, rien de special. Le prix est un peu eleve.">Neutre</button>' +
      '<button class="btn-ghost btn-sm" data-preset="Tres decu, le produit ne correspond pas du tout a la description. Service client inexistant.">Negatif</button>' +
      '</div>' +
      '<button class="btn-primary" id="btn-sentiment-go" style="margin-top:1rem">Analyser le sentiment</button>' +
      '<div id="sentiment-results" class="demo-results"></div></div>';

    document.querySelectorAll('[data-preset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.getElementById('sentiment-input').value = this.getAttribute('data-preset');
      });
    });

    document.getElementById('btn-sentiment-go').addEventListener('click', function () {
      var text = document.getElementById('sentiment-input').value.trim();
      if (!text) { window.AIA.showToast('Entrez un texte a analyser', 'error'); return; }
      var res = document.getElementById('sentiment-results');
      res.innerHTML = '<div class="loading-pulse">Analyse NLP en cours...</div>';

      setTimeout(function () {
        var lexPos = {
          'adore':3,'adorer':3,'aime':2,'aimer':2,'apprecie':2,'bravo':2,'brillant':3,'captivant':2,
          'charmant':2,'chouette':1,'confortable':1,'content':1,'convivial':1,
          'delicieux':2,'efficace':2,'elegant':2,'emerveillement':3,'enchante':2,
          'enthousiaste':2,'epoustouflant':3,'excellent':3,'exceptionnel':3,'extraordinaire':3,
          'fabuleux':3,'facile':1,'fantastique':3,'felicitations':2,'fiable':2,
          'formidable':3,'genial':3,'gratifiant':2,'heureux':2,'ideal':2,
          'impressionnant':3,'incroyable':3,'innovant':2,'inspire':2,'interessant':1,
          'irresistible':2,'joli':1,'joyeux':2,'magnifique':3,'merci':1,'merveilleux':3,
          'moderne':1,'motivant':2,'parfait':3,'passion':2,'performant':2,'plaisant':1,
          'positif':1,'pratique':1,'premium':2,'professionnel':2,'qualite':2,'rapide':1,
          'ravissant':2,'recommande':2,'remarquable':3,'reussi':2,'revolutionnaire':3,
          'satisfait':2,'seduisant':2,'sensationnel':3,'simple':1,'solide':1,
          'spectaculaire':3,'splendide':3,'sublime':3,'super':2,'superbe':3,
          'top':2,'unique':2,'utile':1,'victoire':2,'wow':3,'best':2,'love':2
        };
        var lexNeg = {
          'affreux':3,'agacant':2,'arnaque':3,'atroce':3,'casse':2,
          'catastrophe':3,'cauchemar':3,'cher':1,'complique':1,'confus':1,'couteux':2,
          'dangereux':2,'decevant':2,'decu':2,'defaillant':2,'defaut':1,
          'degoute':3,'deplorable':3,'desagreable':2,'desastreux':3,
          'detestable':3,'deteste':3,'difficile':1,'dommage':1,'douteux':1,'ennuyeux':1,
          'epouvantable':3,'erreur':2,'escroquerie':3,'fade':1,'faible':1,'faux':2,
          'fragile':1,'frustrant':2,'gaspillage':2,'horrible':3,'horreur':3,'honte':2,
          'ignoble':3,'impossible':2,'inacceptable':3,'inadmissible':3,
          'incompetent':3,'inefficace':2,'infect':3,'insatisfait':2,
          'insupportable':3,'inutile':2,'lamentable':3,'lent':1,
          'mauvais':2,'mediocre':2,'mensonge':3,'minable':3,'moche':2,
          'naze':2,'negatif':1,'negligent':2,'nul':3,'odieux':3,'penible':2,'pire':3,
          'pitoyable':3,'probleme':2,'pourri':3,'regrettable':2,'retard':1,'ridicule':2,
          'scandaleux':3,'terrible':3,'toxique':3,'triste':1,'vulgaire':2,
          'zero':2,'inexistant':2
        };
        var negations = ['ne','pas','plus','jamais','rien','aucun','sans','ni','non','guere'];
        var intensifiers = {'tres':1.5,'vraiment':1.5,'tellement':1.6,'absolument':1.8,'completement':1.7,'totalement':1.7,'extremement':1.8,'particulierement':1.4,'super':1.5,'trop':1.4};
        var diminishers = {'peu':0.5,'presque':0.7,'legerement':0.5,'moyennement':0.6,'assez':0.8};

        var lower = text.toLowerCase().replace(/['']/g,"'").replace(/[.,!?;:()"""«»\[\]]/g,' ');
        var words = lower.split(/\s+/).filter(function(w){return w.length>0;});
        var posScore=0, negScore=0, posWords=[], negWords=[];

        for(var i=0;i<words.length;i++){
          var w=words[i], score=0, type=null;
          if(lexPos[w]){ score=lexPos[w]; type='pos'; }
          else if(lexNeg[w]){ score=lexNeg[w]; type='neg'; }
          else { continue; }

          var negated=false;
          for(var j=Math.max(0,i-3);j<i;j++){
            if(negations.indexOf(words[j])!==-1){ negated=true; break; }
          }
          var mult=1.0;
          if(i>0 && intensifiers[words[i-1]]) mult=intensifiers[words[i-1]];
          if(i>0 && diminishers[words[i-1]]) mult=diminishers[words[i-1]];

          var final=score*mult;
          if(negated){ type=(type==='pos')?'neg':'pos'; final=final*0.8; }
          if(type==='pos'){ posScore+=final; posWords.push({word:w,score:final}); }
          else { negScore+=final; negWords.push({word:w,score:final}); }
        }

        var totalScore=posScore+negScore||1;
        var pPct=Math.round((posScore/totalScore)*100);
        var nPct=Math.round((negScore/totalScore)*100);
        if(posWords.length===0&&negWords.length===0){ pPct=0; nPct=0; }
        var neuPct=Math.max(0,100-pPct-nPct);
        var sentiment=pPct>nPct?'POSITIF':nPct>pPct?'NEGATIF':'NEUTRE';
        var emoji=sentiment==='POSITIF'?'😊':sentiment==='NEGATIF'?'😤':'😐';
        var color=sentiment==='POSITIF'?'#2ecc71':sentiment==='NEGATIF'?'#e74c3c':'#f5b731';
        var conf=Math.abs(pPct-nPct);
        var confLabel=conf>40?'Forte':conf>15?'Moderee':'Faible';

        var highlightHtml='<div class="sentiment-highlights"><h4>Mots detectes</h4><div class="highlight-words">';
        posWords.forEach(function(pw){highlightHtml+='<span class="highlight-word pos" title="Score: +'+pw.score.toFixed(1)+'">'+pw.word+'</span>';});
        negWords.forEach(function(nw){highlightHtml+='<span class="highlight-word neg" title="Score: -'+nw.score.toFixed(1)+'">'+nw.word+'</span>';});
        if(posWords.length===0&&negWords.length===0) highlightHtml+='<span style="color:var(--text-muted)">Aucun mot-cle detecte</span>';
        highlightHtml+='</div></div>';

        res.innerHTML = '<div class="sentiment-result">' +
          '<div class="sentiment-emoji">' + emoji + '</div>' +
          '<div class="sentiment-label" style="color:' + color + '">' + sentiment + '</div>' +
          '<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:1rem">Confiance: ' + confLabel + ' (' + conf + '%) &bull; ' + (posWords.length+negWords.length) + ' mots analyses</div>' +
          '<div class="sentiment-bars">' +
          '<div class="bar-row"><span>Positif</span><div class="bar-track"><div class="bar-fill" style="width:' + pPct + '%;background:#2ecc71"></div></div><span>' + pPct + '%</span></div>' +
          '<div class="bar-row"><span>Neutre</span><div class="bar-track"><div class="bar-fill" style="width:' + neuPct + '%;background:#f5b731"></div></div><span>' + neuPct + '%</span></div>' +
          '<div class="bar-row"><span>Negatif</span><div class="bar-track"><div class="bar-fill" style="width:' + nPct + '%;background:#e74c3c"></div></div><span>' + nPct + '%</span></div>' +
          '</div>' + highlightHtml + '</div>';
        markDemoComplete('demo-sentiment');
      }, 1500);
    });
  }

  /* ======== DEMO 3: IMAGE GENERATION ======== */
  function renderDemoImage(main) {
    main.innerHTML = '<div class="page-header">' + backBtn() +
      '<h1>Generation d\'<span class="gradient-text">Images</span></h1>' +
      '<p class="page-subtitle">Creez des visuels marketing a partir de descriptions textuelles</p></div>' +
      '<div class="demo-workspace glass-card">' +
      '<textarea id="image-prompt" class="demo-textarea" rows="3" placeholder="Decrivez votre visuel : ex. Un packaging minimaliste pour un parfum de luxe, fond dore"></textarea>' +
      '<div class="demo-presets">' +
      '<button class="btn-ghost btn-sm" data-imgp="Flat design logo for a sustainable fashion brand, green tones">Logo eco</button>' +
      '<button class="btn-ghost btn-sm" data-imgp="Product photography of premium coffee beans, dramatic lighting">Photo produit</button>' +
      '<button class="btn-ghost btn-sm" data-imgp="Social media banner for a tech startup, futuristic blue neon">Banner tech</button>' +
      '</div>' +
      '<div class="demo-options" style="margin:1rem 0">' +
      '<label>Style : <select id="image-style"><option>Photorealiste</option><option>Illustration</option><option>Flat Design</option><option>3D Render</option><option>Aquarelle</option></select></label>' +
      '<label style="margin-left:1rem">Format : <select id="image-ratio"><option>1:1 (Carre)</option><option>16:9 (Paysage)</option><option>9:16 (Portrait)</option></select></label>' +
      '</div>' +
      '<button class="btn-primary" id="btn-image-go">Generer le visuel</button>' +
      '<div id="image-results" class="demo-results"></div></div>';

    document.querySelectorAll('[data-imgp]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.getElementById('image-prompt').value = this.getAttribute('data-imgp');
      });
    });

    document.getElementById('btn-image-go').addEventListener('click', function () {
      var prompt = document.getElementById('image-prompt').value.trim();
      if (!prompt) { window.AIA.showToast('Decrivez le visuel souhaite', 'error'); return; }
      var style = document.getElementById('image-style').value;
      var ratio = document.getElementById('image-ratio').value;
      var res = document.getElementById('image-results');
      res.innerHTML = '<div class="loading-pulse">Generation en cours (simulation)...</div>';

      setTimeout(function () {
        var c = document.createElement('canvas');
        var w = ratio.indexOf('9:16') !== -1 ? 256 : ratio.indexOf('16:9') !== -1 ? 512 : 320;
        var h = ratio.indexOf('9:16') !== -1 ? 455 : ratio.indexOf('16:9') !== -1 ? 288 : 320;
        c.width = w; c.height = h;
        var cx = c.getContext('2d');

        var hue = 0;
        for (var i = 0; i < prompt.length; i++) hue = (hue + prompt.charCodeAt(i) * 7) % 360;
        var grad = cx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, 'hsl(' + hue + ',70%,25%)');
        grad.addColorStop(0.5, 'hsl(' + ((hue + 60) % 360) + ',60%,35%)');
        grad.addColorStop(1, 'hsl(' + ((hue + 120) % 360) + ',50%,20%)');
        cx.fillStyle = grad;
        cx.fillRect(0, 0, w, h);

        for (var s = 0; s < 8; s++) {
          cx.fillStyle = 'rgba(255,255,255,' + (0.03 + Math.random() * 0.06) + ')';
          var sz = 20 + Math.random() * 80;
          cx.beginPath();
          cx.arc(Math.random() * w, Math.random() * h, sz, 0, Math.PI * 2);
          cx.fill();
        }

        cx.fillStyle = 'rgba(0,0,0,0.4)';
        cx.fillRect(0, h - 60, w, 60);
        cx.fillStyle = '#fff';
        cx.font = 'bold 14px Montserrat, sans-serif';
        cx.textAlign = 'center';
        cx.fillText('[Simulation] ' + style, w / 2, h - 35);
        cx.font = '10px Montserrat, sans-serif';
        var shortPrompt = prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt;
        cx.fillText(shortPrompt, w / 2, h - 15);

        res.innerHTML = '<div class="image-result">' +
          '<img src="' + c.toDataURL() + '" alt="Generated visual" style="max-width:100%;border-radius:8px;border:1px solid var(--glass-border)">' +
          '<p style="margin-top:0.8rem;color:var(--text-muted);font-size:0.82rem">Visuel en simulation — en production, connectez DALL-E, Midjourney ou Stable Diffusion via API.</p></div>';
        markDemoComplete('demo-image');
      }, 2000);
    });
  }

  /* ======== DEMO 4: MARKETING CHATBOT ======== */
  function renderDemoChatbot(main) {
    main.innerHTML = '<div class="page-header">' + backBtn() +
      '<h1>Chatbot <span class="gradient-text">Marketing</span></h1>' +
      '<p class="page-subtitle">Discutez avec un chatbot specialise marketing</p></div>' +
      '<div class="demo-workspace glass-card">' +
      '<div id="chat-messages" class="chat-messages"></div>' +
      '<div class="chat-input-row">' +
      '<input type="text" id="chat-input" class="demo-input" placeholder="Posez une question marketing...">' +
      '<button class="btn-primary" id="btn-chat-send">Envoyer</button>' +
      '</div>' +
      '<div class="demo-presets" style="margin-top:0.8rem">' +
      '<button class="btn-ghost btn-sm" data-chatq="Comment definir un persona marketing ?">Persona</button>' +
      '<button class="btn-ghost btn-sm" data-chatq="Quelle strategie pour les reseaux sociaux en 2026 ?">Social Media</button>' +
      '<button class="btn-ghost btn-sm" data-chatq="Comment ameliorer mon taux de conversion ?">Conversion</button>' +
      '</div></div>';

    var messages = document.getElementById('chat-messages');
    var input = document.getElementById('chat-input');

    function addMsg(text, isUser) {
      var div = document.createElement('div');
      div.className = 'chat-msg ' + (isUser ? 'user' : 'bot');
      div.innerHTML = '<div class="chat-bubble">' + escapeHtml(text) + '</div>';
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    addMsg('Bonjour ! Je suis votre assistant marketing IA. Posez-moi vos questions sur le marketing digital, la strategie de contenu, les reseaux sociaux ou le branding.', false);

    var RESPONSES = {
      persona: 'Un persona marketing est un portrait semi-fictif de votre client ideal. Pour le definir : 1) Analysez vos donnees clients, 2) Menez des interviews, 3) Identifiez demographics, motivations et pain points, 4) Creez une fiche complete. L\'IA accelere cette analyse avec le clustering.',
      social: 'En 2026 : 1) Video court (Reels, TikTok), 2) Authenticite et UGC, 3) Social commerce integre, 4) Chatbots IA sur les DMs, 5) Personnalisation via IA. Concentrez-vous sur 2-3 plateformes max.',
      conversion: 'Pour ameliorer votre taux de conversion : 1) Optimisez vos CTA, 2) Simplifiez les formulaires, 3) Ajoutez des preuves sociales, 4) A/B testing systematique, 5) Personnalisez avec l\'IA, 6) Reduisez la friction checkout.',
      seo: 'Le SEO en 2026 repose sur l\'E-E-A-T, le contenu de qualite, les Core Web Vitals, et l\'optimisation pour la recherche vocale/IA. Les outils IA comme Surfer SEO aident a optimiser le contenu.',
      branding: 'Branding solide : 1) Mission et valeurs claires, 2) Identite visuelle coherente, 3) Tone of voice distinctif, 4) Storytelling authentique, 5) Experience client uniforme. L\'IA generative accelere la creation d\'assets.',
      default: 'Excellente question ! En marketing digital, analysez votre audience, definissez des KPIs clairs et testez differentes approches. L\'IA peut automatiser l\'analyse, generer du contenu et personnaliser l\'experience client.'
    };

    function getResponse(q) {
      var lower = q.toLowerCase();
      if (lower.indexOf('persona') !== -1) return RESPONSES.persona;
      if (lower.indexOf('social') !== -1 || lower.indexOf('reseau') !== -1 || lower.indexOf('tiktok') !== -1) return RESPONSES.social;
      if (lower.indexOf('conversion') !== -1 || lower.indexOf('taux') !== -1 || lower.indexOf('cta') !== -1) return RESPONSES.conversion;
      if (lower.indexOf('seo') !== -1 || lower.indexOf('referencement') !== -1 || lower.indexOf('google') !== -1) return RESPONSES.seo;
      if (lower.indexOf('brand') !== -1 || lower.indexOf('marque') !== -1 || lower.indexOf('identite') !== -1) return RESPONSES.branding;
      return RESPONSES.default;
    }

    function sendMessage() {
      var q = input.value.trim();
      if (!q) return;
      addMsg(q, true);
      input.value = '';
      setTimeout(function () {
        addMsg(getResponse(q), false);
        markDemoComplete('demo-chatbot');
      }, 800 + Math.random() * 700);
    }

    document.getElementById('btn-chat-send').addEventListener('click', sendMessage);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') sendMessage(); });
    document.querySelectorAll('[data-chatq]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        input.value = this.getAttribute('data-chatq');
        sendMessage();
      });
    });
  }

  /* ======== DEMO 5: A/B TESTING ======== */
  function renderDemoABTest(main) {
    main.innerHTML = '<div class="page-header">' + backBtn() +
      '<h1>A/B Testing <span class="gradient-text">IA</span></h1>' +
      '<p class="page-subtitle">Simulez un test A/B automatise sur des elements marketing</p></div>' +
      '<div class="demo-workspace glass-card">' +
      '<h3>Choisissez un element a tester</h3>' +
      '<div class="ab-tabs">' +
      '<button class="ab-tab active" data-abtab="cta">CTA (Bouton)</button>' +
      '<button class="ab-tab" data-abtab="headline">Titre</button>' +
      '<button class="ab-tab" data-abtab="color">Couleur</button>' +
      '</div>' +
      '<div id="ab-config"></div>' +
      '<button class="btn-primary" id="btn-ab-run" style="margin-top:1rem">Lancer la simulation (1000 visiteurs)</button>' +
      '<div id="ab-results" class="demo-results"></div></div>';

    var tabType = 'cta';
    var configs = {
      cta: { a: 'Acheter maintenant', b: 'Decouvrir l\'offre' },
      headline: { a: 'La revolution IA pour votre marketing', b: 'Boostez vos ventes avec l\'intelligence artificielle' },
      color: { a: '#A71F28 (Rouge IDRAC)', b: '#2ecc71 (Vert)' }
    };

    function renderConfig() {
      var cfg = configs[tabType];
      document.getElementById('ab-config').innerHTML =
        '<div class="demo-split" style="margin-top:1rem">' +
        '<div class="ab-variant"><div class="ab-label">Variante A</div>' +
        '<input type="text" class="demo-input" id="ab-val-a" value="' + cfg.a + '"></div>' +
        '<div class="ab-variant"><div class="ab-label">Variante B</div>' +
        '<input type="text" class="demo-input" id="ab-val-b" value="' + cfg.b + '"></div></div>';
    }

    document.querySelectorAll('.ab-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.ab-tab').forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');
        tabType = this.getAttribute('data-abtab');
        renderConfig();
      });
    });
    renderConfig();

    document.getElementById('btn-ab-run').addEventListener('click', function () {
      var res = document.getElementById('ab-results');
      res.innerHTML = '<div class="loading-pulse">Simulation en cours... 1000 visiteurs</div>';

      setTimeout(function () {
        var crA = (3 + Math.random() * 8).toFixed(1);
        var crB = (3 + Math.random() * 8).toFixed(1);
        var convA = Math.round(500 * crA / 100);
        var convB = Math.round(500 * crB / 100);
        var winner = parseFloat(crA) >= parseFloat(crB) ? 'A' : 'B';
        var confidence = (85 + Math.random() * 14).toFixed(1);
        var lift = Math.abs(parseFloat(crA) - parseFloat(crB)).toFixed(1);

        res.innerHTML = '<div class="ab-results-grid">' +
          '<div class="ab-result-card ' + (winner === 'A' ? 'winner' : '') + '">' +
          '<h4>Variante A</h4><div class="ab-metric">' + crA + '%</div><div>Taux de conversion</div>' +
          '<div class="ab-detail">' + convA + ' / 500 visiteurs</div></div>' +
          '<div class="ab-result-card ' + (winner === 'B' ? 'winner' : '') + '">' +
          '<h4>Variante B</h4><div class="ab-metric">' + crB + '%</div><div>Taux de conversion</div>' +
          '<div class="ab-detail">' + convB + ' / 500 visiteurs</div></div></div>' +
          '<div class="ab-conclusion">' +
          '<div class="ab-winner">Gagnant : Variante ' + winner + '</div>' +
          '<div>Uplift : +' + lift + '% | Confiance : ' + confidence + '%</div>' +
          '<p style="margin-top:0.8rem;color:var(--text-muted);font-size:0.82rem">En production, utilisez Google Optimize, VWO ou Evolv AI pour des tests automatises.</p></div>';
        markDemoComplete('demo-abtest');
      }, 2500);
    });
  }

  /* ======== DEMO 6: SEO ANALYZER ======== */
  function renderDemoSEO(main) {
    main.innerHTML = '<div class="page-header">' + backBtn() +
      '<h1>SEO <span class="gradient-text">Analyzer</span></h1>' +
      '<p class="page-subtitle">Analysez et optimisez votre contenu pour le referencement</p></div>' +
      '<div class="demo-workspace glass-card">' +
      '<div class="seo-form">' +
      '<label>URL ou titre de la page :</label>' +
      '<input type="text" id="seo-url" class="demo-input" placeholder="Ex: mon-produit-bio-premium">' +
      '<label style="margin-top:0.8rem">Meta description :</label>' +
      '<textarea id="seo-meta" class="demo-textarea" rows="2" placeholder="Decrivez votre page en 155 caracteres max"></textarea>' +
      '<label style="margin-top:0.8rem">Mot-cle principal :</label>' +
      '<input type="text" id="seo-keyword" class="demo-input" placeholder="Ex: cafe bio premium">' +
      '<label style="margin-top:0.8rem">Contenu de la page :</label>' +
      '<textarea id="seo-content" class="demo-textarea" rows="5" placeholder="Collez ou ecrivez votre contenu ici..."></textarea>' +
      '</div>' +
      '<button class="btn-primary" id="btn-seo-go" style="margin-top:1rem">Analyser le SEO</button>' +
      '<div id="seo-results" class="demo-results"></div></div>';

    document.getElementById('btn-seo-go').addEventListener('click', function () {
      var url = document.getElementById('seo-url').value.trim();
      var meta = document.getElementById('seo-meta').value.trim();
      var keyword = document.getElementById('seo-keyword').value.trim();
      var content = document.getElementById('seo-content').value.trim();

      if (!keyword) { window.AIA.showToast('Entrez un mot-cle principal', 'error'); return; }

      var res = document.getElementById('seo-results');
      res.innerHTML = '<div class="loading-pulse">Analyse SEO en cours...</div>';

      setTimeout(function () {
        var checks = [];
        var score = 0, maxScore = 0;

        function addCheck(label, ok, detail) {
          maxScore += 10;
          if (ok) score += 10;
          checks.push({ label: label, ok: ok, detail: detail });
        }

        var kwFirst = keyword.split(' ')[0].toLowerCase();
        addCheck('Mot-cle dans l\'URL', url.toLowerCase().indexOf(kwFirst) !== -1,
          url ? 'URL: ' + escapeHtml(url) : 'URL non renseignee');
        addCheck('Meta description presente', meta.length > 0, meta.length + ' caracteres');
        addCheck('Meta description < 160 car.', meta.length > 0 && meta.length <= 160, meta.length + '/160');
        addCheck('Mot-cle dans la meta', meta.toLowerCase().indexOf(kwFirst) !== -1, 'Recherche de "' + escapeHtml(kwFirst) + '"');
        var wordCount = content.split(/\s+/).filter(function (w) { return w.length > 0; }).length;
        addCheck('Contenu > 300 mots', wordCount >= 300, wordCount + ' mots');
        addCheck('Contenu > 100 mots', wordCount >= 100, wordCount + ' mots');
        addCheck('Mot-cle dans le contenu', content.toLowerCase().indexOf(kwFirst) !== -1, 'Presence du mot-cle');

        var kwCount = 0;
        var words = content.toLowerCase().split(/\s+/);
        words.forEach(function (w) { if (w.indexOf(kwFirst) !== -1) kwCount++; });
        var density = words.length > 0 ? (kwCount / words.length * 100).toFixed(1) : '0.0';
        addCheck('Densite mot-cle 1-3%', parseFloat(density) >= 1 && parseFloat(density) <= 3, 'Densite : ' + density + '%');

        var pct = Math.round(score / maxScore * 100);
        var grade = pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D';
        var gradeColor = pct >= 80 ? '#2ecc71' : pct >= 60 ? '#f5b731' : pct >= 40 ? '#e67e22' : '#e74c3c';

        res.innerHTML = '<div class="seo-score-header">' +
          '<div class="seo-grade" style="color:' + gradeColor + '">' + grade + '</div>' +
          '<div class="seo-pct">' + pct + '/100</div></div>' +
          '<div class="seo-checks">' + checks.map(function (c) {
            return '<div class="seo-check ' + (c.ok ? 'pass' : 'fail') + '">' +
              '<span class="check-icon">' + (c.ok ? '✅' : '❌') + '</span>' +
              '<span class="check-label">' + c.label + '</span>' +
              '<span class="check-detail">' + c.detail + '</span></div>';
          }).join('') + '</div>' +
          '<div class="seo-recommendations"><h4>Recommandations</h4><ul>' +
          (!url ? '<li>Ajoutez une URL contenant votre mot-cle principal</li>' : '') +
          (meta.length === 0 ? '<li>Redigez une meta description de 120-155 caracteres</li>' : '') +
          (meta.length > 160 ? '<li>Raccourcissez votre meta description (155 car. max)</li>' : '') +
          (wordCount < 300 ? '<li>Enrichissez votre contenu (objectif : 300+ mots)</li>' : '') +
          (parseFloat(density) < 1 ? '<li>Integrez davantage votre mot-cle naturellement</li>' : '') +
          (parseFloat(density) > 3 ? '<li>Reduisez la repetition du mot-cle (sur-optimisation)</li>' : '') +
          '<li>Structurez avec des H2/H3 contenant des variantes du mot-cle</li>' +
          '<li>Ajoutez des liens internes et externes pertinents</li></ul></div>';
        markDemoComplete('demo-seo');
      }, 1800);
    });
  }

  window.AIA = window.AIA || {};
  window.AIA.renderDemoPrompt = renderDemoPrompt;
  window.AIA.renderDemoSentiment = renderDemoSentiment;
  window.AIA.renderDemoImage = renderDemoImage;
  window.AIA.renderDemoChatbot = renderDemoChatbot;
  window.AIA.renderDemoABTest = renderDemoABTest;
  window.AIA.renderDemoSEO = renderDemoSEO;
})();
