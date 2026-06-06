/* ==============================================
   DEMOS.JS — Interactive AI Demos + HuggingFace
   IDRAC Business School — Maxime BABONNEAU
   ============================================== */
(function () {
  'use strict';

  var ALL_DEMO_IDS = ['demo-prompt','demo-sentiment','demo-image','demo-chatbot','demo-abtest','demo-seo'];

  /* ---------- HuggingFace Space embed utility ---------- */
  function createHFEmbed(spaceUrl, label, opts) {
    opts = opts || {};
    var cls = 'hf-embed-container' + (opts.tall ? ' tall' : '');
    // Lien de secours : si le Space dort, bloque l'iframe ou sature (30 etudiants en meme temps),
    // l'etudiant peut toujours ouvrir l'outil dans un nouvel onglet (sa propre session).
    return '<div class="' + cls + '">' +
      '<div class="hf-embed-label">' +
      '<span style="font-size:1.1rem">&#129303;</span> ' + label +
      '<a class="hf-embed-open" href="' + spaceUrl + '" target="_blank" rel="noopener">Ouvrir dans un onglet &#8599;</a>' +
      '</div>' +
      '<iframe src="' + spaceUrl + '" ' +
      'loading="lazy" ' +
      'sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox" ' +
      'allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone">' +
      '</iframe></div>';
  }

  function markDemoComplete(demoId) {
    var AIA = window.AIA;
    var st = AIA.getState();
    if (st.demosCompleted.indexOf(demoId) === -1) {
      st.demosCompleted.push(demoId);
      AIA.addXP(25);
      AIA.saveState();
      AIA.showToast('Demo completee ! +25 XP', 'success');
      try { if (AIA.pushFeed) AIA.pushFeed({ action: 'demo-done', target: demoId }); } catch (e) {}
      if (st.demosCompleted.length >= ALL_DEMO_IDS.length) {
        AIA.awardBadge('demo-all');
      }
    }
    // Auto-inject reflection block at the bottom of the demo page (if not already there)
    setTimeout(function () {
      var main = document.getElementById('main-content');
      if (!main || !AIA.renderReflection) return;
      if (main.querySelector('[data-reflection-id="' + demoId + '"]')) return;
      var reflectionHtml = AIA.renderReflection(demoId);
      if (reflectionHtml) {
        var wrap = document.createElement('div');
        wrap.innerHTML = reflectionHtml;
        main.appendChild(wrap.firstChild);
        if (AIA.wireReflections) AIA.wireReflections(main);
      }
    }, 50);
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

  /* ---------- Pin-to-Carnet : bouton + handler delegue (micro-etape 3) ---------- */
  // Genere un bouton "Epingler au Carnet" pour un resultat de demo.
  // SECURITE : title/content peuvent contenir du texte saisi par l'etudiant.
  // encodeURIComponent les rend surs en attribut HTML (encode " < > & en %xx) ;
  // le handler delegue fait decodeURIComponent puis passe a pinToCarnet, qui stocke
  // brut ; le rendu (workbook nl2br -> escapeHtml) re-echappe a l'affichage.
  // NE PAS remplacer par escapeHtml ici : cela casserait le round-trip decodeURIComponent.
  function pinBtn(source, sourceLabel, title, content) {
    return '<button class="btn-outline btn-xs demo-pin-btn" ' +
      'data-pin-source="' + escapeHtml(source) + '" ' +
      'data-pin-label="' + escapeHtml(sourceLabel) + '" ' +
      'data-pin-title="' + encodeURIComponent(title || '') + '" ' +
      'data-pin-content="' + encodeURIComponent(content || '') + '">📌 Epingler au Carnet</button>';
  }
  // Enveloppe standard : bouton + lien vers le Carnet, sous un resultat de demo.
  function pinBar(source, sourceLabel, title, content) {
    return '<div class="demo-pin-bar">' +
      '<span class="demo-pin-hint">💡 Gardez ce resultat pour votre projet :</span> ' +
      pinBtn(source, sourceLabel, title, content) +
      ' <a class="btn-ghost btn-xs" href="#" data-navigate="workbook">📓 Voir le Carnet</a>' +
      '</div>';
  }
  // Handler delegue (attache une seule fois) : tout .demo-pin-btn epingle au Carnet.
  if (!window.__aiaDemoPinWired) {
    window.__aiaDemoPinWired = true;
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.demo-pin-btn') : null;
      if (!btn) return;
      e.preventDefault();
      if (btn.disabled) return;
      var item = {
        kind: 'demo',
        source: btn.getAttribute('data-pin-source') || '',
        sourceLabel: btn.getAttribute('data-pin-label') || 'Demo IA',
        title: decodeURIComponent(btn.getAttribute('data-pin-title') || ''),
        content: decodeURIComponent(btn.getAttribute('data-pin-content') || '')
      };
      var ok = window.AIA && window.AIA.pinToCarnet && window.AIA.pinToCarnet(item);
      if (ok) { btn.textContent = '📌 Epingle ✓'; btn.disabled = true; btn.classList.add('pinned'); }
    });
  }

  /* ======== DEMO 1: PROMPT PLAYGROUND ======== */
  function renderDemoPrompt(main, inline) {
    var header = inline ? '' : '<div class="page-header">' + backBtn() +
      '<h1>Prompt <span class="gradient-text">Playground</span></h1>' +
      '<p class="page-subtitle">Comparez differentes formulations de prompt et mesurez leur efficacite</p></div>';

    main.innerHTML = header +
      '<div class="demo-workspace glass-card">' +
      '<div class="demo-split">' +
      '<div class="demo-panel">' +
      '<h3>&#9888;&#65039; Prompt Basique</h3>' +
      '<textarea id="prompt-a" class="demo-textarea" rows="4" placeholder="Ex: Ecris un slogan pour une marque de cafe bio"></textarea>' +
      '</div>' +
      '<div class="demo-panel">' +
      '<h3>&#10024; Prompt Structure (CRAC)</h3>' +
      '<textarea id="prompt-b" class="demo-textarea" rows="4" placeholder="Ex: En tant qu\'expert copywriter specialise luxe, cree 3 slogans percutants pour une marque de cafe bio premium. Cible : millennials urbains. Ton : sophistique et authentique. Max 8 mots par slogan."></textarea>' +
      '</div></div>' +
      '<div style="text-align:center;margin:1rem 0">' +
      '<button class="btn-primary" id="btn-prompt-go">&#9889; Analyser & Comparer</button></div>' +
      '<div id="prompt-results" class="demo-results"></div>' +
      '<div class="demo-tips glass-card" style="margin-top:1.5rem">' +
      '<h4>&#128218; Methode CRAC — Prompt Engineering</h4>' +
      '<div class="tips-grid">' +
      '<div class="tip"><strong>C — Contexte</strong><br>Definir la situation : marque, secteur, objectif</div>' +
      '<div class="tip"><strong>R — Role</strong><br>Donner un persona : "En tant que copywriter senior..."</div>' +
      '<div class="tip"><strong>A — Action</strong><br>Preciser la tache : generer, analyser, comparer</div>' +
      '<div class="tip"><strong>C — Contraintes</strong><br>Format, longueur, ton, cible, nombre de variantes</div>' +
      '</div>' +
      '<div style="margin-top:1rem;padding:1rem;background:var(--bg-secondary);border-radius:var(--radius-xs)">' +
      '<h4 style="color:var(--cyan);margin-bottom:0.5rem">&#128161; Techniques Avancees</h4>' +
      '<div class="tips-grid">' +
      '<div class="tip"><strong>Chain of Thought</strong><br>"Reflechis etape par etape avant de repondre"</div>' +
      '<div class="tip"><strong>Few-Shot</strong><br>Donner 2-3 exemples du format attendu</div>' +
      '<div class="tip"><strong>Self-Consistency</strong><br>Demander N variantes et choisir la meilleure</div>' +
      '<div class="tip"><strong>Negative Prompting</strong><br>"Ne fais PAS : cliches, jargon, plus de 8 mots"</div>' +
      '</div></div></div></div>';

    document.getElementById('btn-prompt-go').addEventListener('click', function () {
      var a = document.getElementById('prompt-a').value.trim();
      var b = document.getElementById('prompt-b').value.trim();
      if (!a && !b) { window.AIA.showToast('Ecrivez au moins un prompt', 'error'); return; }
      var res = document.getElementById('prompt-results');
      res.innerHTML = '<div class="loading-pulse">Analyse des prompts en cours...</div>';

      setTimeout(function () {
        function scorePrompt(txt) {
          if (!txt) return { total: 0, breakdown: {} };
          var s = { context: 0, role: 0, action: 0, constraints: 0, specificity: 0, length: 0 };
          var lower = txt.toLowerCase();
          if (lower.indexOf('en tant que') !== -1 || lower.indexOf('tu es') !== -1 || lower.indexOf('expert') !== -1 || lower.indexOf('specialise') !== -1) s.role = 20;
          else if (lower.indexOf('comme') !== -1) s.role = 10;
          if (lower.indexOf('cible') !== -1 || lower.indexOf('audience') !== -1 || lower.indexOf('pour') !== -1 || lower.indexOf('millennials') !== -1 || lower.indexOf('b2b') !== -1) s.context = 15;
          if (lower.indexOf('cree') !== -1 || lower.indexOf('genere') !== -1 || lower.indexOf('redige') !== -1 || lower.indexOf('analyse') !== -1 || lower.indexOf('compare') !== -1) s.action = 15;
          if (lower.indexOf('ton') !== -1 || lower.indexOf('max') !== -1 || lower.indexOf('format') !== -1 || lower.indexOf('mots') !== -1 || lower.indexOf('caracteres') !== -1) s.constraints = 15;
          var words = txt.split(/\s+/).length;
          s.length = words > 30 ? 15 : words > 15 ? 10 : words > 8 ? 5 : 2;
          s.specificity = (txt.match(/\d+/g) || []).length * 5;
          s.specificity = Math.min(s.specificity, 20);
          var total = Math.min(100, s.role + s.context + s.action + s.constraints + s.length + s.specificity);
          return { total: total, breakdown: s };
        }

        var sA = scorePrompt(a), sB = scorePrompt(b);
        var html = '<div class="demo-split">';
        function renderScore(label, sc, txt) {
          if (!txt) return '';
          var grade = sc.total >= 75 ? 'A' : sc.total >= 55 ? 'B' : sc.total >= 35 ? 'C' : 'D';
          var gradeColor = sc.total >= 75 ? '#2ecc71' : sc.total >= 55 ? '#f5b731' : sc.total >= 35 ? '#e67e22' : '#e74c3c';
          return '<div class="demo-result-panel">' +
            '<h4>' + label + '</h4>' +
            '<div style="text-align:center;margin:0.5rem 0"><span style="font-size:2rem;font-weight:800;color:' + gradeColor + '">' + grade + '</span>' +
            '<div style="font-size:0.8rem;color:var(--text-muted)">' + sc.total + '/100</div></div>' +
            '<div class="sentiment-bars" style="margin-top:0.8rem">' +
            '<div class="bar-row"><span style="font-size:0.75rem">Role</span><div class="bar-track"><div class="bar-fill" style="width:' + (sc.breakdown.role * 5) + '%;background:var(--cyan)"></div></div><span style="font-size:0.75rem">' + sc.breakdown.role + '</span></div>' +
            '<div class="bar-row"><span style="font-size:0.75rem">Contexte</span><div class="bar-track"><div class="bar-fill" style="width:' + (sc.breakdown.context * 6.6) + '%;background:var(--purple)"></div></div><span style="font-size:0.75rem">' + sc.breakdown.context + '</span></div>' +
            '<div class="bar-row"><span style="font-size:0.75rem">Action</span><div class="bar-track"><div class="bar-fill" style="width:' + (sc.breakdown.action * 6.6) + '%;background:var(--gold)"></div></div><span style="font-size:0.75rem">' + sc.breakdown.action + '</span></div>' +
            '<div class="bar-row"><span style="font-size:0.75rem">Contraintes</span><div class="bar-track"><div class="bar-fill" style="width:' + (sc.breakdown.constraints * 6.6) + '%;background:var(--green)"></div></div><span style="font-size:0.75rem">' + sc.breakdown.constraints + '</span></div>' +
            '<div class="bar-row"><span style="font-size:0.75rem">Specificite</span><div class="bar-track"><div class="bar-fill" style="width:' + (sc.breakdown.specificity * 5) + '%;background:var(--pink)"></div></div><span style="font-size:0.75rem">' + sc.breakdown.specificity + '</span></div>' +
            '</div></div>';
        }
        if (a) html += renderScore('Prompt A', sA, a);
        if (b) html += renderScore('Prompt B', sB, b);
        html += '</div>';

        if (a && b) {
          var winner = sA.total >= sB.total ? 'A' : 'B';
          var diff = Math.abs(sA.total - sB.total);
          html += '<div class="prompt-verdict" style="margin-top:1rem;padding:1rem;background:var(--bg-secondary);border-radius:var(--radius-xs);text-align:center">' +
            '<strong style="color:var(--gold)">Prompt ' + winner + ' gagne</strong> avec ' + diff + ' points d\'avance.<br>' +
            '<span style="font-size:0.8rem;color:var(--text-muted)">Un prompt structure CRAC produit des resultats 3-5x plus pertinents avec les LLM.</span></div>';
        }

        if (window.AIA.submitActivity) {
          window.AIA.submitActivity('demo-prompt', {
            type: 'prompt-comparison',
            promptA: a ? a.substring(0, 200) : '',
            promptB: b ? b.substring(0, 200) : '',
            scoreA: sA.total,
            scoreB: sB.total
          });
        }

        var bestTxt = (sA.total >= sB.total ? a : b) || a || b;
        var bestScore = Math.max(sA.total, sB.total);
        html += pinBar('demo-prompt', 'Prompt Playground', 'Meilleur prompt (' + bestScore + '/100)', bestTxt);

        res.innerHTML = html;
        markDemoComplete('demo-prompt');
      }, 1200);
    });
  }

  /* ======== DEMO 2: SENTIMENT ANALYSIS ======== */
  function renderDemoSentiment(main, inline) {
    var header = inline ? '' : '<div class="page-header">' + backBtn() +
      '<h1>Analyse de <span class="gradient-text">Sentiment</span></h1>' +
      '<p class="page-subtitle">Analysez la tonalite emotionnelle de textes marketing avec le NLP</p></div>';

    main.innerHTML = header +
      '<div class="demo-workspace glass-card">' +
      '<textarea id="sentiment-input" class="demo-textarea" rows="4" placeholder="Collez un avis client, un commentaire ou un texte marketing..."></textarea>' +
      '<div class="demo-presets">' +
      '<button class="btn-ghost btn-sm" data-preset="J\'adore ce produit, la qualite est exceptionnelle et le service client remarquable ! Je recommande a 100%">&#128077; Positif</button>' +
      '<button class="btn-ghost btn-sm" data-preset="Le produit est correct, rien de special. Le prix est un peu eleve pour ce que c\'est. Livraison dans les temps.">&#128528; Neutre</button>' +
      '<button class="btn-ghost btn-sm" data-preset="Tres decu, le produit ne correspond pas du tout a la description. Qualite mediocre et service client inexistant. A fuir !">&#128078; Negatif</button>' +
      '<button class="btn-ghost btn-sm" data-preset="Le design est magnifique mais la batterie est catastrophique. Bon ecran, mauvaise autonomie. Mitige.">&#129300; Mixte</button>' +
      '</div>' +
      '<button class="btn-primary" id="btn-sentiment-go" style="margin-top:1rem">&#128300; Analyser le sentiment</button>' +
      '<div id="sentiment-results" class="demo-results"></div>' +
      '<div style="margin-top:1.5rem;padding:1rem;background:var(--bg-secondary);border-radius:var(--radius-xs)">' +
      '<h4 style="color:var(--cyan);margin-bottom:0.5rem">&#128218; Comment ca marche ?</h4>' +
      '<p style="font-size:0.8rem;color:var(--text-secondary);line-height:1.6">Cette demo utilise un <strong>lexique de sentiment francais</strong> (200+ mots) avec detection de negations, intensificateurs et diminuteurs. En production, des modeles comme <strong>CamemBERT</strong> ou <strong>FlauBERT</strong> offrent une precision de 90%+ sur le francais. Outils pro : Brandwatch, Meltwater, Sprout Social.</p>' +
      '</div></div>';

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
          'catastrophe':3,'catastrophique':3,'cauchemar':3,'cher':1,'complique':1,'confus':1,'couteux':2,
          'dangereux':2,'decevant':2,'decu':2,'defaillant':2,'defaut':1,
          'degoute':3,'deplorable':3,'desagreable':2,'desastreux':3,
          'detestable':3,'deteste':3,'difficile':1,'dommage':1,'douteux':1,'ennuyeux':1,
          'epouvantable':3,'erreur':2,'escroquerie':3,'fade':1,'faible':1,'faux':2,
          'fragile':1,'frustrant':2,'gaspillage':2,'horrible':3,'horreur':3,'honte':2,
          'ignoble':3,'impossible':2,'inacceptable':3,'inadmissible':3,
          'incompetent':3,'inefficace':2,'infect':3,'insatisfait':2,
          'insupportable':3,'inutile':2,'lamentable':3,'lent':1,
          'mauvais':2,'mauvaise':2,'mediocre':2,'mensonge':3,'minable':3,'moche':2,
          'naze':2,'negatif':1,'negligent':2,'nul':3,'odieux':3,'penible':2,'pire':3,
          'pitoyable':3,'probleme':2,'pourri':3,'regrettable':2,'retard':1,'ridicule':2,
          'scandaleux':3,'terrible':3,'toxique':3,'triste':1,'vulgaire':2,
          'zero':2,'inexistant':2,'fuir':3,'mitige':1
        };
        var negations = ['ne','pas','plus','jamais','rien','aucun','sans','ni','non','guere'];
        var intensifiers = {'tres':1.5,'vraiment':1.5,'tellement':1.6,'absolument':1.8,'completement':1.7,'totalement':1.7,'extremement':1.8,'particulierement':1.4,'super':1.5,'trop':1.4};
        var diminishers = {'peu':0.5,'presque':0.7,'legerement':0.5,'moyennement':0.6,'assez':0.8};

        var lower = text.toLowerCase().replace(/['']/g,"'").replace(/[.,!?;:()"""'«»\[\]]/g,' ');
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
        var emoji=sentiment==='POSITIF'?'&#128522;':sentiment==='NEGATIF'?'&#128548;':'&#128528;';
        var color=sentiment==='POSITIF'?'#2ecc71':sentiment==='NEGATIF'?'#e74c3c':'#f5b731';
        var conf=Math.abs(pPct-nPct);
        var confLabel=conf>40?'Forte':conf>15?'Moderee':'Faible';

        var highlightHtml='<div class="sentiment-highlights"><h4>Mots detectes</h4><div class="highlight-words">';
        posWords.forEach(function(pw){highlightHtml+='<span class="highlight-word pos" title="Score: +'+pw.score.toFixed(1)+'">'+pw.word+'</span>';});
        negWords.forEach(function(nw){highlightHtml+='<span class="highlight-word neg" title="Score: -'+nw.score.toFixed(1)+'">'+nw.word+'</span>';});
        if(posWords.length===0&&negWords.length===0) highlightHtml+='<span style="color:var(--text-muted)">Aucun mot-cle detecte</span>';
        highlightHtml+='</div></div>';

        res.innerHTML = '<div class="sentiment-result">' +
          '<div class="sentiment-emoji" style="font-size:3rem;text-align:center">' + emoji + '</div>' +
          '<div class="sentiment-label" style="color:' + color + ';text-align:center;font-size:1.3rem;font-weight:800;margin:0.5rem 0">' + sentiment + '</div>' +
          '<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:1rem;text-align:center">Confiance: ' + confLabel + ' (' + conf + '%) &bull; ' + (posWords.length+negWords.length) + ' mots-cles detectes sur ' + words.length + ' mots</div>' +
          '<div class="sentiment-bars">' +
          '<div class="bar-row"><span>Positif</span><div class="bar-track"><div class="bar-fill" style="width:' + pPct + '%;background:#2ecc71"></div></div><span>' + pPct + '%</span></div>' +
          '<div class="bar-row"><span>Neutre</span><div class="bar-track"><div class="bar-fill" style="width:' + neuPct + '%;background:#f5b731"></div></div><span>' + neuPct + '%</span></div>' +
          '<div class="bar-row"><span>Negatif</span><div class="bar-track"><div class="bar-fill" style="width:' + nPct + '%;background:#e74c3c"></div></div><span>' + nPct + '%</span></div>' +
          '</div>' + highlightHtml + '</div>' +
          pinBar('demo-sentiment', 'Analyse de sentiment',
            'Sentiment : ' + sentiment + ' (' + pPct + '% pos / ' + nPct + '% neg)',
            'Texte analyse : "' + text + '"\nResultat : ' + sentiment + ' — confiance ' + confLabel + ' (' + conf + '%)');

        if (window.AIA.submitActivity) {
          window.AIA.submitActivity('demo-sentiment', {
            type: 'sentiment-analysis', textLength: text.length,
            sentiment: sentiment, posScore: pPct, negScore: nPct
          });
        }
        markDemoComplete('demo-sentiment');
      }, 1500);
    });
  }

  /* ======== DEMO 3: IMAGE GENERATION (HuggingFace) ======== */
  function renderDemoImage(main, inline) {
    var header = inline ? '' : '<div class="page-header">' + backBtn() +
      '<h1>Generation d\'<span class="gradient-text">Images IA</span></h1>' +
      '<p class="page-subtitle">Creez des visuels marketing avec Stable Diffusion et explorez Midjourney</p></div>';

    main.innerHTML = header +
      '<div class="demo-workspace glass-card">' +
      '<h3 style="margin-bottom:0.5rem">&#127912; Stable Diffusion 3 — Generation en temps reel</h3>' +
      '<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem">Generez des visuels marketing directement depuis HuggingFace. Essayez des prompts comme : <em>"Product photography of premium coffee beans, dramatic studio lighting, dark background"</em></p>' +
      createHFEmbed('https://stabilityai-stable-diffusion-3-medium.hf.space', 'Stable Diffusion 3 Medium', { tall: true }) +
      '</div>' +

      '<div class="demo-workspace glass-card" style="margin-top:1.5rem">' +
      '<h3 style="margin-bottom:0.8rem">&#128218; Guide Prompt pour Images Marketing</h3>' +
      '<div class="tips-grid">' +
      '<div class="tip"><strong>Style</strong><br>"photorealistic", "flat design", "isometric", "watercolor", "3D render"</div>' +
      '<div class="tip"><strong>Eclairage</strong><br>"studio lighting", "golden hour", "neon", "dramatic shadows"</div>' +
      '<div class="tip"><strong>Composition</strong><br>"close-up", "bird\'s eye view", "centered", "rule of thirds"</div>' +
      '<div class="tip"><strong>Marketing</strong><br>"product photography", "social media post", "banner ad", "logo design"</div>' +
      '</div>' +

      '<div style="margin-top:1.5rem;padding:1rem;background:var(--bg-secondary);border-radius:var(--radius-xs)">' +
      '<h4 style="color:var(--gold);margin-bottom:0.5rem">&#127775; Templates Prompts Marketing</h4>' +
      '<div id="prompt-templates" style="display:flex;flex-direction:column;gap:0.5rem">' +
      '<div class="tip" style="cursor:pointer" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Prompt copie !\',\'success\')" data-p="Professional product photography of [your product], clean white background, soft studio lighting, high resolution, commercial quality">' +
      '<strong>Photo Produit</strong><br><code style="font-size:0.72rem;color:var(--cyan)">Professional product photography of [your product], clean white background, soft studio lighting, high resolution</code></div>' +
      '<div class="tip" style="cursor:pointer" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Prompt copie !\',\'success\')" data-p="Modern minimalist logo for a sustainable brand, flat design, green and earth tones, vector style, clean lines">' +
      '<strong>Logo Eco</strong><br><code style="font-size:0.72rem;color:var(--cyan)">Modern minimalist logo for a sustainable brand, flat design, green and earth tones, vector style</code></div>' +
      '<div class="tip" style="cursor:pointer" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Prompt copie !\',\'success\')" data-p="Eye-catching social media banner for tech startup, futuristic blue and purple gradient, geometric shapes, bold typography space">' +
      '<strong>Banner Social</strong><br><code style="font-size:0.72rem;color:var(--cyan)">Eye-catching social media banner for tech startup, futuristic blue and purple gradient, geometric shapes</code></div>' +
      '</div></div>' +

      '<div style="margin-top:1.5rem;padding:1rem;background:rgba(167,31,40,0.08);border-radius:var(--radius-xs);border:1px solid rgba(167,31,40,0.2)">' +
      '<h4 style="color:var(--red-light);margin-bottom:0.5rem">&#128736;&#65039; Outils Pro pour la Production</h4>' +
      '<p style="font-size:0.8rem;color:var(--text-secondary);line-height:1.6">' +
      '<strong>Midjourney</strong> — Qualite artistique premium, ideal branding ($10/mois)<br>' +
      '<strong>DALL-E 3</strong> — Integre a ChatGPT, excellent pour iterations rapides<br>' +
      '<strong>Adobe Firefly</strong> — Integre Photoshop, usage commercial safe<br>' +
      '<strong>Canva AI</strong> — Templates marketing + generation IA integree</p>' +
      '</div></div>';

    markDemoComplete('demo-image');
    if (window.AIA.submitActivity) {
      window.AIA.submitActivity('demo-image', { type: 'image-gen-explored', timestamp: new Date().toISOString() });
    }
  }

  /* ======== DEMO 4: CHATBOT MARKETING (HuggingFace) ======== */
  function renderDemoChatbot(main, inline) {
    var header = inline ? '' : '<div class="page-header">' + backBtn() +
      '<h1>Chatbot <span class="gradient-text">Marketing IA</span></h1>' +
      '<p class="page-subtitle">Testez un LLM en direct et evaluez ses capacites marketing</p></div>';

    main.innerHTML = header +
      '<div class="demo-workspace glass-card">' +
      '<h3 style="margin-bottom:0.5rem">&#129302; Chat IA — testez vos prompts marketing</h3>' +
      '<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem">Discutez avec un grand modele de langage. Testez vos prompts marketing : persona, copywriting, strategie, analyse.</p>' +
      '<div class="demo-launch">' +
      '<div class="demo-launch-icon">&#128172;</div>' +
      '<p class="demo-launch-txt">Le chat IA s\'ouvre dans un <strong>nouvel onglet</strong> — chacun sa propre session (ideal a 30 en classe, pas de file d\'attente). Choisis un outil, puis copie une mission ci-dessous et colle-la dedans.</p>' +
      '<div class="demo-launch-btns">' +
      '<a class="btn-primary" href="https://huggingface.co/chat/" target="_blank" rel="noopener">&#129303; HuggingChat (gratuit) &#8599;</a>' +
      '<a class="btn-outline" href="https://chatgpt.com/" target="_blank" rel="noopener">&#128172; ChatGPT &#8599;</a>' +
      '<a class="btn-outline" href="https://claude.ai/" target="_blank" rel="noopener">&#129504; Claude &#8599;</a>' +
      '<a class="btn-outline" href="https://gemini.google.com/" target="_blank" rel="noopener">&#10024; Gemini &#8599;</a>' +
      '</div></div>' +
      '</div>' +

      '<div class="demo-workspace glass-card" style="margin-top:1.5rem">' +
      '<h3 style="margin-bottom:0.8rem">&#127919; Missions a Tester</h3>' +
      '<div style="display:flex;flex-direction:column;gap:0.6rem" id="chatbot-missions">' +

      '<div class="tip" style="padding:0.8rem;cursor:pointer;border:1px solid var(--border-glass)" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Prompt copie ! Collez-le dans l\'outil IA ouvert\',\'success\')" ' +
      'data-p="En tant que directeur marketing d\'une startup de cosmetiques bio, cree un persona detaille de mon client ideal. Inclus : demographics, motivations, pain points, canaux preferes, et un parcours d\'achat type.">' +
      '<strong style="color:var(--cyan)">Mission 1 : Persona Marketing</strong><br>' +
      '<span style="font-size:0.78rem;color:var(--text-secondary)">Generer un persona client complet pour une marque de cosmetiques bio</span></div>' +

      '<div class="tip" style="padding:0.8rem;cursor:pointer;border:1px solid var(--border-glass)" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Prompt copie ! Collez-le dans l\'outil IA ouvert\',\'success\')" ' +
      'data-p="Redige 3 versions d\'un email de relance panier abandonne pour un e-commerce de mode. Version 1 : ton amical. Version 2 : urgence (stock limite). Version 3 : offre speciale. Max 100 mots chacun. Inclus l\'objet et le CTA.">' +
      '<strong style="color:var(--gold)">Mission 2 : Email Copywriting</strong><br>' +
      '<span style="font-size:0.78rem;color:var(--text-secondary)">3 versions d\'un email de relance panier abandonne (amical, urgent, promo)</span></div>' +

      '<div class="tip" style="padding:0.8rem;cursor:pointer;border:1px solid var(--border-glass)" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Prompt copie ! Collez-le dans l\'outil IA ouvert\',\'success\')" ' +
      'data-p="Analyse la strategie marketing de Netflix en 2025. Structure ton analyse avec : 1) Positionnement, 2) Canaux de communication, 3) Strategie de contenu, 4) Forces et faiblesses, 5) Recommandations d\'amelioration. Sois concis et factuel.">' +
      '<strong style="color:var(--green)">Mission 3 : Analyse Strategique</strong><br>' +
      '<span style="font-size:0.78rem;color:var(--text-secondary)">Analyser la strategie marketing de Netflix avec un framework structure</span></div>' +

      '<div class="tip" style="padding:0.8rem;cursor:pointer;border:1px solid var(--border-glass)" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Prompt copie ! Collez-le dans l\'outil IA ouvert\',\'success\')" ' +
      'data-p="Cree un calendrier editorial pour le compte Instagram d\'une boulangerie artisanale pour le mois de juin. 4 posts par semaine. Pour chaque post inclus : jour, type de contenu (photo/reel/carousel), legende, hashtags (5 max), et hook de la premiere ligne.">' +
      '<strong style="color:var(--pink)">Mission 4 : Calendrier Editorial</strong><br>' +
      '<span style="font-size:0.78rem;color:var(--text-secondary)">Creer un calendrier editorial Instagram complet pour une boulangerie</span></div>' +
      '</div>' +

      '<div style="margin-top:1.5rem;padding:1rem;background:var(--bg-secondary);border-radius:var(--radius-xs)">' +
      '<h4 style="color:var(--purple);margin-bottom:0.5rem">&#128161; Comparatif LLM pour le Marketing</h4>' +
      '<table style="width:100%;font-size:0.78rem;color:var(--text-secondary);border-collapse:collapse">' +
      '<tr style="border-bottom:1px solid var(--border-glass)"><th style="text-align:left;padding:0.4rem;color:var(--text-primary)">Modele</th><th style="padding:0.4rem">Copy</th><th style="padding:0.4rem">Analyse</th><th style="padding:0.4rem">Code</th><th style="padding:0.4rem">Prix</th></tr>' +
      '<tr style="border-bottom:1px solid var(--border-glass)"><td style="padding:0.4rem;font-weight:600">ChatGPT 4o</td><td style="padding:0.4rem;text-align:center">&#11088;&#11088;&#11088;&#11088;&#11088;</td><td style="padding:0.4rem;text-align:center">&#11088;&#11088;&#11088;&#11088;</td><td style="padding:0.4rem;text-align:center">&#11088;&#11088;&#11088;&#11088;&#11088;</td><td style="padding:0.4rem;text-align:center">$20/m</td></tr>' +
      '<tr style="border-bottom:1px solid var(--border-glass)"><td style="padding:0.4rem;font-weight:600">Claude 4</td><td style="padding:0.4rem;text-align:center">&#11088;&#11088;&#11088;&#11088;&#11088;</td><td style="padding:0.4rem;text-align:center">&#11088;&#11088;&#11088;&#11088;&#11088;</td><td style="padding:0.4rem;text-align:center">&#11088;&#11088;&#11088;&#11088;&#11088;</td><td style="padding:0.4rem;text-align:center">$20/m</td></tr>' +
      '<tr style="border-bottom:1px solid var(--border-glass)"><td style="padding:0.4rem;font-weight:600">Gemini 2.5</td><td style="padding:0.4rem;text-align:center">&#11088;&#11088;&#11088;&#11088;</td><td style="padding:0.4rem;text-align:center">&#11088;&#11088;&#11088;&#11088;&#11088;</td><td style="padding:0.4rem;text-align:center">&#11088;&#11088;&#11088;&#11088;</td><td style="padding:0.4rem;text-align:center">Gratuit</td></tr>' +
      '<tr><td style="padding:0.4rem;font-weight:600">Mistral Large</td><td style="padding:0.4rem;text-align:center">&#11088;&#11088;&#11088;&#11088;</td><td style="padding:0.4rem;text-align:center">&#11088;&#11088;&#11088;</td><td style="padding:0.4rem;text-align:center">&#11088;&#11088;&#11088;&#11088;</td><td style="padding:0.4rem;text-align:center">Gratuit</td></tr>' +
      '</table></div></div>';

    markDemoComplete('demo-chatbot');
    if (window.AIA.submitActivity) {
      window.AIA.submitActivity('demo-chatbot', { type: 'chatbot-explored', timestamp: new Date().toISOString() });
    }
  }

  /* ======== DEMO 5: A/B TESTING SIMULATOR ======== */
  function renderDemoABTest(main, inline) {
    var header = inline ? '' : '<div class="page-header">' + backBtn() +
      '<h1>A/B Testing <span class="gradient-text">Simulator</span></h1>' +
      '<p class="page-subtitle">Simulez un test A/B et analysez la significativite statistique</p></div>';

    main.innerHTML = header +
      '<div class="demo-workspace glass-card">' +
      '<h3>Choisissez un element a tester</h3>' +
      '<div class="ab-tabs">' +
      '<button class="ab-tab active" data-abtab="cta">CTA (Bouton)</button>' +
      '<button class="ab-tab" data-abtab="headline">Titre</button>' +
      '<button class="ab-tab" data-abtab="color">Couleur</button>' +
      '<button class="ab-tab" data-abtab="email">Objet Email</button>' +
      '</div>' +
      '<div id="ab-config"></div>' +
      '<div style="display:flex;gap:0.5rem;align-items:center;margin-top:1rem">' +
      '<label style="font-size:0.82rem;color:var(--text-secondary)">Visiteurs :</label>' +
      '<select id="ab-visitors" style="padding:0.3rem;background:var(--bg-secondary);border:1px solid var(--border-glass);border-radius:var(--radius-xs);color:var(--text-primary);font-size:0.82rem">' +
      '<option value="500">500</option><option value="1000" selected>1 000</option><option value="5000">5 000</option><option value="10000">10 000</option></select>' +
      '</div>' +
      '<button class="btn-primary" id="btn-ab-run" style="margin-top:1rem">&#9889; Lancer la simulation</button>' +
      '<div id="ab-results" class="demo-results"></div>' +
      '<div style="margin-top:1.5rem;padding:1rem;background:var(--bg-secondary);border-radius:var(--radius-xs)">' +
      '<h4 style="color:var(--cyan);margin-bottom:0.5rem">&#128218; Regles du A/B Testing</h4>' +
      '<ul style="font-size:0.8rem;color:var(--text-secondary);line-height:1.8;list-style:none;padding:0">' +
      '<li>&#9989; Tester UNE seule variable a la fois</li>' +
      '<li>&#9989; Minimum 1000 visiteurs par variante pour la significativite</li>' +
      '<li>&#9989; Duree minimum : 1 semaine (cycles hebdomadaires)</li>' +
      '<li>&#9989; Confiance >95% avant de declarer un gagnant</li>' +
      '<li>&#10060; Ne PAS arreter le test des les premiers resultats</li>' +
      '</ul></div></div>';

    var tabType = 'cta';
    var configs = {
      cta: { a: 'Acheter maintenant', b: 'Decouvrir l\'offre' },
      headline: { a: 'La revolution IA pour votre marketing', b: 'Boostez vos ventes avec l\'intelligence artificielle' },
      color: { a: '#A71F28 (Rouge IDRAC)', b: '#2ecc71 (Vert)' },
      email: { a: 'Votre offre exclusive vous attend', b: '[Prenom], ne manquez pas -30% aujourd\'hui' }
    };

    function renderConfig() {
      var cfg = configs[tabType];
      document.getElementById('ab-config').innerHTML =
        '<div class="demo-split" style="margin-top:1rem">' +
        '<div class="ab-variant"><div class="ab-label">Variante A (Controle)</div>' +
        '<input type="text" class="demo-input" id="ab-val-a" value="' + cfg.a + '"></div>' +
        '<div class="ab-variant"><div class="ab-label">Variante B (Test)</div>' +
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
      var totalVisitors = parseInt(document.getElementById('ab-visitors').value);
      var half = Math.floor(totalVisitors / 2);
      res.innerHTML = '<div class="loading-pulse">Simulation en cours... ' + totalVisitors.toLocaleString() + ' visiteurs</div>';

      setTimeout(function () {
        var baseRate = tabType === 'email' ? 20 + Math.random() * 15 : 3 + Math.random() * 5;
        var crA = baseRate + (Math.random() - 0.5) * 3;
        var crB = baseRate + (Math.random() - 0.3) * 4;
        crA = Math.max(0.5, crA).toFixed(2);
        crB = Math.max(0.5, crB).toFixed(2);
        var convA = Math.round(half * crA / 100);
        var convB = Math.round(half * crB / 100);
        var winner = parseFloat(crA) >= parseFloat(crB) ? 'A' : 'B';
        var lift = ((Math.abs(parseFloat(crA) - parseFloat(crB)) / Math.min(parseFloat(crA), parseFloat(crB))) * 100).toFixed(1);

        var pA = convA / half, pB = convB / half;
        var pPool = (convA + convB) / totalVisitors;
        var se = Math.sqrt(pPool * (1 - pPool) * (2 / half));
        var zScore = se > 0 ? Math.abs(pA - pB) / se : 0;
        var confidence = zScore > 2.576 ? 99 : zScore > 1.96 ? 95 : zScore > 1.645 ? 90 : Math.round(zScore / 1.96 * 95);
        confidence = Math.min(99.9, confidence);
        var significant = confidence >= 95;

        var valA = (document.getElementById('ab-val-a') || {}).value || 'Variante A';
        var valB = (document.getElementById('ab-val-b') || {}).value || 'Variante B';
        res.innerHTML = '<div class="ab-results-grid">' +
          '<div class="ab-result-card ' + (winner === 'A' ? 'winner' : '') + '">' +
          '<h4>Variante A</h4><div class="ab-metric">' + crA + '%</div><div>Taux de conversion</div>' +
          '<div class="ab-detail">' + convA.toLocaleString() + ' / ' + half.toLocaleString() + ' visiteurs</div></div>' +
          '<div class="ab-result-card ' + (winner === 'B' ? 'winner' : '') + '">' +
          '<h4>Variante B</h4><div class="ab-metric">' + crB + '%</div><div>Taux de conversion</div>' +
          '<div class="ab-detail">' + convB.toLocaleString() + ' / ' + half.toLocaleString() + ' visiteurs</div></div></div>' +
          '<div class="ab-conclusion">' +
          '<div class="ab-winner" style="color:' + (significant ? 'var(--green)' : 'var(--gold)') + '">' +
          (significant ? 'Gagnant : Variante ' + winner : 'Resultat non significatif') + '</div>' +
          '<div>Uplift : +' + lift + '% | Confiance : ' + confidence + '% | Z-score : ' + zScore.toFixed(2) + '</div>' +
          (significant ? '' : '<p style="margin-top:0.5rem;color:var(--gold);font-size:0.82rem">&#9888;&#65039; Confiance < 95%. Continuez le test avec plus de visiteurs avant de conclure.</p>') +
          '<p style="margin-top:0.8rem;color:var(--text-muted);font-size:0.82rem">Outils pro : Google Optimize, VWO, Evolv AI, Eppo, LaunchDarkly</p></div>' +
          pinBar('demo-abtest', 'A/B Test (' + tabType + ')',
            'Gagnant : Variante ' + winner + ' (+' + lift + '%, conf. ' + confidence + '%)',
            'A : "' + valA + '" -> ' + crA + '%\nB : "' + valB + '" -> ' + crB + '%\nGagnant : ' + winner + ' (uplift +' + lift + '%, confiance ' + confidence + '%)');

        if (window.AIA.submitActivity) {
          window.AIA.submitActivity('demo-abtest', {
            type: 'ab-test-simulation', element: tabType,
            crA: crA, crB: crB, winner: winner, confidence: confidence,
            visitors: totalVisitors
          });
        }
        markDemoComplete('demo-abtest');
      }, 2500);
    });
  }

  /* ======== DEMO 6: SEO ANALYZER ======== */
  function renderDemoSEO(main, inline) {
    var header = inline ? '' : '<div class="page-header">' + backBtn() +
      '<h1>SEO <span class="gradient-text">Analyzer</span></h1>' +
      '<p class="page-subtitle">Analysez et optimisez votre contenu pour le referencement Google</p></div>';

    main.innerHTML = header +
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
      '<button class="btn-primary" id="btn-seo-go" style="margin-top:1rem">&#128269; Analyser le SEO</button>' +
      '<div id="seo-results" class="demo-results"></div>' +
      '<div style="margin-top:1.5rem;padding:1rem;background:var(--bg-secondary);border-radius:var(--radius-xs)">' +
      '<h4 style="color:var(--cyan);margin-bottom:0.5rem">&#128218; Checklist SEO 2026</h4>' +
      '<ul style="font-size:0.8rem;color:var(--text-secondary);line-height:1.8;list-style:none;padding:0">' +
      '<li>&#9989; E-E-A-T : Experience, Expertise, Autorite, Confiance</li>' +
      '<li>&#9989; Core Web Vitals : LCP < 2.5s, FID < 100ms, CLS < 0.1</li>' +
      '<li>&#9989; Contenu original et expertise demontree</li>' +
      '<li>&#9989; Schema markup (FAQ, Product, HowTo, Review)</li>' +
      '<li>&#9989; Optimisation pour SGE (Search Generative Experience)</li>' +
      '</ul></div></div>';

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

        function addCheck(label, ok, detail, weight) {
          weight = weight || 10;
          maxScore += weight;
          if (ok) score += weight;
          checks.push({ label: label, ok: ok, detail: detail });
        }

        var kwLower = keyword.toLowerCase();
        var kwFirst = kwLower.split(' ')[0];
        var contentLower = content.toLowerCase();
        var wordCount = content.split(/\s+/).filter(function (w) { return w.length > 0; }).length;

        addCheck('Mot-cle dans l\'URL', url.toLowerCase().indexOf(kwFirst) !== -1, url ? 'URL: ' + escapeHtml(url) : 'URL non renseignee', 10);
        addCheck('Meta description presente', meta.length > 0, meta.length + ' caracteres', 10);
        addCheck('Meta description optimale (120-155 car.)', meta.length >= 120 && meta.length <= 155, meta.length + '/155 caracteres', 10);
        addCheck('Mot-cle dans la meta', meta.toLowerCase().indexOf(kwFirst) !== -1, 'Recherche de "' + escapeHtml(kwFirst) + '"', 10);
        addCheck('Contenu > 300 mots', wordCount >= 300, wordCount + ' mots', 15);
        addCheck('Mot-cle en debut de contenu', contentLower.indexOf(kwFirst) !== -1 && contentLower.indexOf(kwFirst) < 200, 'Position dans les 200 premiers caracteres', 10);

        var kwCount = 0;
        var words = contentLower.split(/\s+/);
        words.forEach(function (w) { if (w.indexOf(kwFirst) !== -1) kwCount++; });
        var density = words.length > 0 ? (kwCount / words.length * 100).toFixed(1) : '0.0';
        addCheck('Densite mot-cle 1-3%', parseFloat(density) >= 1 && parseFloat(density) <= 3, 'Densite : ' + density + '%', 10);

        var hasHeadings = content.indexOf('##') !== -1 || content.indexOf('H2') !== -1 || content.indexOf('h2') !== -1;
        addCheck('Structure H2/H3 suggeree', hasHeadings || wordCount > 300, wordCount > 300 ? 'Contenu long = necessaire' : 'Ajoutez des sous-titres', 5);

        var readability = wordCount > 0 ? Math.min(100, Math.round(wordCount / 5 + (content.match(/\./g) || []).length * 3)) : 0;
        addCheck('Lisibilite adequate', readability > 30, 'Score lisibilite: ' + readability, 10);

        var hasCTA = contentLower.indexOf('decouvr') !== -1 || contentLower.indexOf('achet') !== -1 || contentLower.indexOf('essaye') !== -1 || contentLower.indexOf('inscri') !== -1;
        addCheck('Appel a l\'action (CTA)', hasCTA, hasCTA ? 'CTA detecte' : 'Ajoutez un CTA', 10);

        var pct = Math.round(score / maxScore * 100);
        var grade = pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D';
        var gradeColor = pct >= 80 ? '#2ecc71' : pct >= 60 ? '#f5b731' : pct >= 40 ? '#e67e22' : '#e74c3c';

        res.innerHTML = '<div class="seo-score-header">' +
          '<div class="seo-grade" style="color:' + gradeColor + '">' + grade + '</div>' +
          '<div class="seo-pct">' + pct + '/100</div></div>' +
          '<div class="seo-checks">' + checks.map(function (c) {
            return '<div class="seo-check ' + (c.ok ? 'pass' : 'fail') + '">' +
              '<span class="check-icon">' + (c.ok ? '&#9989;' : '&#10060;') + '</span>' +
              '<span class="check-label">' + c.label + '</span>' +
              '<span class="check-detail">' + c.detail + '</span></div>';
          }).join('') + '</div>' +
          '<div class="seo-recommendations"><h4>Recommandations</h4><ul>' +
          (!url ? '<li>Ajoutez une URL SEO-friendly contenant votre mot-cle principal (ex: <code>cafe-bio-premium-equitable</code>)</li>' : '') +
          (meta.length === 0 ? '<li>Redigez une meta description de 120-155 caracteres avec votre mot-cle et un CTA</li>' : '') +
          (meta.length > 155 ? '<li>Raccourcissez votre meta description (Google coupe a 155 caracteres)</li>' : '') +
          (wordCount < 300 ? '<li>Enrichissez votre contenu (objectif : 800-1500 mots pour un article SEO performant)</li>' : '') +
          (parseFloat(density) < 1 ? '<li>Integrez davantage votre mot-cle naturellement (objectif : 1-2%)</li>' : '') +
          (parseFloat(density) > 3 ? '<li>&#9888;&#65039; Sur-optimisation detectee ! Reduisez la repetition du mot-cle</li>' : '') +
          '<li>Ajoutez des liens internes (3-5 par article) et 1-2 liens externes de qualite</li>' +
          '<li>Utilisez des variantes semantiques : synonymes, questions, expressions longue traine</li>' +
          '<li>Ajoutez des images avec des attributs alt contenant le mot-cle</li></ul></div>' +
          pinBar('demo-seo', 'Analyse SEO',
            'SEO ' + grade + ' (' + pct + '/100) — ' + keyword,
            'Mot-cle : ' + keyword + '\nScore : ' + pct + '/100 (' + grade + ')\nMeta description : ' + (meta || '(vide)') + '\nDensite : ' + density + '% sur ' + wordCount + ' mots');

        if (window.AIA.submitActivity) {
          window.AIA.submitActivity('demo-seo', {
            type: 'seo-analysis', keyword: keyword, score: pct, grade: grade,
            wordCount: wordCount, density: density
          });
        }
        markDemoComplete('demo-seo');
      }, 1800);
    });
  }

  /* ======== DEMO 7: BACKGROUND REMOVAL (HuggingFace) ======== */
  function renderDemoBgRemove(main, inline) {
    var header = inline ? '' : '<div class="page-header">' + backBtn() +
      '<h1>Suppression de <span class="gradient-text">Fond Auto</span></h1>' +
      '<p class="page-subtitle">Detourez vos visuels produits en 1 clic — ideal e-commerce et social media</p></div>';
    main.innerHTML = header +
      '<div class="demo-workspace glass-card">' +
      '<h3 style="margin-bottom:0.5rem">🖼️ Background Remover — BRIA RMBG 1.4</h3>' +
      '<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem">Uploadez une photo produit, l\'IA detoure le sujet automatiquement et retourne un PNG transparent. Parfait pour catalogues, A/B tests visuels, banner ads.</p>' +
      createHFEmbed('https://briaai-bria-rmbg-1-4.hf.space', 'BRIA RMBG 1.4 — Background Removal', { tall: true }) +
      '</div>' +
      '<div class="demo-workspace glass-card" style="margin-top:1.5rem">' +
      '<h3>💡 Use cases marketing</h3>' +
      '<div class="tips-grid">' +
      '<div class="tip"><strong>E-commerce</strong><br>Fonds blancs uniformes (Amazon, Shopify, Etsy)</div>' +
      '<div class="tip"><strong>Social media</strong><br>Coller un produit sur des fonds creatifs</div>' +
      '<div class="tip"><strong>Banner ads</strong><br>Tester plusieurs arriere-plans rapidement</div>' +
      '<div class="tip"><strong>Print/Catalogue</strong><br>Workflow accelere x10 vs Photoshop manuel</div>' +
      '</div>' +
      '<p style="margin-top:1rem;font-size:0.8rem;color:var(--text-muted)"><strong>Alternatives pro :</strong> remove.bg, Adobe Express, Canva Pro, PhotoRoom (mobile)</p>' +
      '</div>';
    markDemoComplete('demo-bg-remove');
    if (window.AIA.submitActivity) window.AIA.submitActivity('demo-bg-remove', { type: 'bg-remove-explored', timestamp: new Date().toISOString() });
  }

  /* ======== DEMO 8: MUSIC GENERATION (HuggingFace) ======== */
  function renderDemoMusic(main, inline) {
    var header = inline ? '' : '<div class="page-header">' + backBtn() +
      '<h1>Generation <span class="gradient-text">Musicale IA</span></h1>' +
      '<p class="page-subtitle">Composez jingles publicitaires et bandes-son pour vos campagnes</p></div>';
    main.innerHTML = header +
      '<div class="demo-workspace glass-card">' +
      '<h3 style="margin-bottom:0.5rem">🎵 MusicGen — Meta AI</h3>' +
      '<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem">Generez de la musique a partir d\'un prompt texte. Ideal pour jingles, bandes-son video, ambiances podcast. Royalty-free pour usage personnel.</p>' +
      createHFEmbed('https://facebook-musicgen.hf.space', 'MusicGen — Meta AI', { tall: true }) +
      '</div>' +
      '<div class="demo-workspace glass-card" style="margin-top:1.5rem">' +
      '<h3>🎯 Templates de prompts musicaux</h3>' +
      '<div id="music-templates" style="display:flex;flex-direction:column;gap:0.5rem">' +
      '<div class="tip" style="cursor:pointer" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Prompt copie !\',\'success\')" data-p="Upbeat corporate background music, energetic synth, motivational, 120 BPM, suitable for product launch video"><strong>Pub corporate</strong><br><code style="font-size:0.72rem;color:var(--cyan)">Upbeat corporate, energetic synth, 120 BPM, product launch</code></div>' +
      '<div class="tip" style="cursor:pointer" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Prompt copie !\',\'success\')" data-p="Calm minimalist piano, warm pads, relaxing wellness brand, 70 BPM, spa music"><strong>Brand wellness</strong><br><code style="font-size:0.72rem;color:var(--cyan)">Calm piano, warm pads, wellness, 70 BPM, spa</code></div>' +
      '<div class="tip" style="cursor:pointer" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Prompt copie !\',\'success\')" data-p="Trendy lo-fi hip hop beat, urban, Gen Z vibe, 90 BPM, casual social media ad"><strong>Gen Z social</strong><br><code style="font-size:0.72rem;color:var(--cyan)">Lo-fi hip hop, urban, Gen Z, 90 BPM, social ad</code></div>' +
      '<div class="tip" style="cursor:pointer" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Prompt copie !\',\'success\')" data-p="Cinematic orchestral intro, epic strings, premium luxury brand, 110 BPM"><strong>Luxe cinematic</strong><br><code style="font-size:0.72rem;color:var(--cyan)">Cinematic orchestral, strings, luxury, 110 BPM</code></div>' +
      '</div>' +
      '<p style="margin-top:1rem;font-size:0.8rem;color:var(--text-muted)"><strong>Outils pro :</strong> Suno, Udio (chansons completes), AIVA (orchestral), Mubert (royalty-free)</p>' +
      '</div>';
    markDemoComplete('demo-music');
    if (window.AIA.submitActivity) window.AIA.submitActivity('demo-music', { type: 'music-gen-explored', timestamp: new Date().toISOString() });
  }

  /* ======== DEMO 9: SPEECH-TO-TEXT (HuggingFace Whisper) ======== */
  function renderDemoSpeech(main, inline) {
    var header = inline ? '' : '<div class="page-header">' + backBtn() +
      '<h1>Transcription <span class="gradient-text">Vocale IA</span></h1>' +
      '<p class="page-subtitle">Transcrivez podcasts, interviews, video clients — Whisper d\'OpenAI</p></div>';
    main.innerHTML = header +
      '<div class="demo-workspace glass-card">' +
      '<h3 style="margin-bottom:0.5rem">🎙️ Whisper Large V3 — OpenAI</h3>' +
      '<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem">Uploadez un fichier audio (mp3/wav) ou enregistrez votre voix. Whisper transcrit en 100+ langues avec ponctuation. Precision ~95% sur le francais.</p>' +
      createHFEmbed('https://openai-whisper.hf.space', 'Whisper Large V3 — Speech to Text', { tall: true }) +
      '</div>' +
      '<div class="demo-workspace glass-card" style="margin-top:1.5rem">' +
      '<h3>💡 Use cases marketing</h3>' +
      '<div class="tips-grid">' +
      '<div class="tip"><strong>Verbatims clients</strong><br>Transcrire interviews UX pour extraire insights</div>' +
      '<div class="tip"><strong>Podcasts SEO</strong><br>Sous-titrer + reposter le texte sur le blog</div>' +
      '<div class="tip"><strong>Reels/TikTok</strong><br>Generer les sous-titres SRT automatiquement</div>' +
      '<div class="tip"><strong>Calls equipe</strong><br>Comptes-rendus auto de reunions Zoom/Meet</div>' +
      '</div>' +
      '<p style="margin-top:1rem;font-size:0.8rem;color:var(--text-muted)"><strong>Outils pro :</strong> Otter.ai (collaboratif), Descript (edition video par texte), Rev (humain premium), Notta</p>' +
      '</div>';
    markDemoComplete('demo-speech');
    if (window.AIA.submitActivity) window.AIA.submitActivity('demo-speech', { type: 'speech-explored', timestamp: new Date().toISOString() });
  }

  /* ======== DEMO 10: VISUAL ANALYSIS / CAPTIONING (HuggingFace BLIP) ======== */
  function renderDemoVqa(main, inline) {
    var header = inline ? '' : '<div class="page-header">' + backBtn() +
      '<h1>Analyse Visuelle <span class="gradient-text">par IA</span></h1>' +
      '<p class="page-subtitle">Decortiquez les pubs concurrentes — l\'IA decrit ce qu\'elle voit (alt-text SEO, benchmark)</p></div>';
    main.innerHTML = header +
      '<div class="demo-workspace glass-card">' +
      '<h3 style="margin-bottom:0.5rem">👁️ BLIP — Image Captioning</h3>' +
      '<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem">Uploadez une image (capture d\'une pub concurrente, votre visuel, un meme). L\'IA decrit ce qu\'elle voit — utile pour SEO, accessibilite, benchmark visuel.</p>' +
      createHFEmbed('https://salesforce-blip.hf.space', 'BLIP — Image Captioning', { tall: true }) +
      '</div>' +
      '<div class="demo-workspace glass-card" style="margin-top:1.5rem">' +
      '<h3>🎯 Comment exploiter ces descriptions</h3>' +
      '<div class="tips-grid">' +
      '<div class="tip"><strong>Alt-text SEO</strong><br>Generer en masse les ALT de toutes vos images produit</div>' +
      '<div class="tip"><strong>Veille concurrentielle</strong><br>Analyser les visuels Meta Ads Library</div>' +
      '<div class="tip"><strong>Accessibilite</strong><br>Conformite RGAA / WCAG pour lecteurs d\'ecran</div>' +
      '<div class="tip"><strong>Tagging produit</strong><br>Auto-categorisation catalogue e-commerce</div>' +
      '</div>' +
      '<p style="margin-top:1rem;font-size:0.8rem;color:var(--text-muted)"><strong>Modeles avances :</strong> GPT-4 Vision, Claude Vision, Gemini Vision — pour analyses fines avec questions ouvertes</p>' +
      '</div>';
    markDemoComplete('demo-vqa');
    if (window.AIA.submitActivity) window.AIA.submitActivity('demo-vqa', { type: 'vqa-explored', timestamp: new Date().toISOString() });
  }

  /* ======== DEMO 11: TEXT-TO-SPEECH (HuggingFace) ======== */
  function renderDemoTts(main, inline) {
    var header = inline ? '' : '<div class="page-header">' + backBtn() +
      '<h1>Voix Off <span class="gradient-text">par IA</span></h1>' +
      '<p class="page-subtitle">Generez voix-off pro pour vos videos publicitaires en secondes</p></div>';
    main.innerHTML = header +
      '<div class="demo-workspace glass-card">' +
      '<h3 style="margin-bottom:0.5rem">🗣️ Parler-TTS — Voix Off Realiste</h3>' +
      '<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem">Tapez votre script, choisissez le style de voix (genre, ton, vitesse) et generez une voix-off de qualite broadcast. Royalty-free pour usages perso/educatifs.</p>' +
      createHFEmbed('https://parler-tts-parler-tts-expresso.hf.space', 'Parler-TTS Expresso — Voix Off', { tall: true }) +
      '</div>' +
      '<div class="demo-workspace glass-card" style="margin-top:1.5rem">' +
      '<h3>🎯 Scripts marketing a tester</h3>' +
      '<div id="tts-scripts" style="display:flex;flex-direction:column;gap:0.5rem">' +
      '<div class="tip" style="cursor:pointer" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Script copie !\',\'success\')" data-p="Decouvrez le futur du marketing digital. Avec notre solution IA, automatisez vos campagnes et multipliez vos resultats par 3. Essai gratuit 14 jours, sans engagement."><strong>Pub SaaS B2B (15 sec)</strong><br><code style="font-size:0.72rem;color:var(--cyan)">Voix-off video LinkedIn / YouTube preroll</code></div>' +
      '<div class="tip" style="cursor:pointer" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Script copie !\',\'success\')" data-p="Ah si seulement quelqu un m avait dit ca avant. Imagine pouvoir cuisiner sain en 10 minutes chrono... C est exactement ce que fait Kookoo. Le robot intelligent qui transforme ton frigo en chef etoile."><strong>Pub Instagram Reel (20 sec)</strong><br><code style="font-size:0.72rem;color:var(--cyan)">Ton conversationnel Gen Z + storytelling</code></div>' +
      '<div class="tip" style="cursor:pointer" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Script copie !\',\'success\')" data-p="Un produit, une histoire. Chaque kit EcoMush est elabore dans notre atelier de Lyon par des passionnes. Cultivez vos saveurs, respectez la planete."><strong>Storytelling marque (15 sec)</strong><br><code style="font-size:0.72rem;color:var(--cyan)">Ton premium, posement</code></div>' +
      '</div>' +
      '<p style="margin-top:1rem;font-size:0.8rem;color:var(--text-muted)"><strong>Outils pro :</strong> ElevenLabs (le meilleur), Murf.ai (200+ voix), Play.ht, Resemble.ai (clone vocal)</p>' +
      '</div>';
    markDemoComplete('demo-tts');
    if (window.AIA.submitActivity) window.AIA.submitActivity('demo-tts', { type: 'tts-explored', timestamp: new Date().toISOString() });
  }

  /* ======== DEMO 12: IMAGE UPSCALE (HuggingFace) ======== */
  function renderDemoUpscale(main, inline) {
    var header = inline ? '' : '<div class="page-header">' + backBtn() +
      '<h1>Upscaling <span class="gradient-text">d\'Images</span></h1>' +
      '<p class="page-subtitle">Augmentez la resolution de vos visuels x4 — sauvez vieilles photos produits</p></div>';
    main.innerHTML = header +
      '<div class="demo-workspace glass-card">' +
      '<h3 style="margin-bottom:0.5rem">🔍 Real-ESRGAN — Upscaler IA x4</h3>' +
      '<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem">Uploadez une image basse resolution. L\'IA reconstruit les details et la rend 4x plus grande, nette, exploitable en print/web.</p>' +
      createHFEmbed('https://akhaliq-real-esrgan.hf.space', 'Real-ESRGAN — Image Upscaler', { tall: true }) +
      '</div>' +
      '<div class="demo-workspace glass-card" style="margin-top:1.5rem">' +
      '<h3>💡 Insight pedagogique</h3>' +
      '<p style="font-size:0.85rem;line-height:1.6">L\'upscaling IA est un cas pratique de <strong>super-resolution</strong> par reseau neuronal convolutionnel. Le modele a appris des millions de paires "petit/grand" et hallucine des details plausibles. Limite : pas de creation d\'info inexistante (texte flou reste illisible). Use cases marketing : recyclage de vieux visuels, conversion 72→300 DPI pour print, restauration de logos historiques.</p>' +
      '<h3 style="margin-top:1rem">🎯 Use cases marketing</h3>' +
      '<div class="tips-grid">' +
      '<div class="tip"><strong>Print catalogue</strong><br>Reutiliser visuels web en 4K</div>' +
      '<div class="tip"><strong>Vieilles archives</strong><br>Restaurer photos produits anciennes</div>' +
      '<div class="tip"><strong>UGC haute def</strong><br>Upscale photos clients</div>' +
      '<div class="tip"><strong>Affiches</strong><br>Banner 4K depuis screenshot HD</div>' +
      '</div>' +
      '<p style="margin-top:1rem;font-size:0.8rem;color:var(--text-muted)"><strong>Alternatives :</strong> Topaz Gigapixel (pro), Adobe Super Resolution, Let\'s Enhance, Upscayl (open-source)</p>' +
      '</div>';
    markDemoComplete('demo-upscale');
    if (window.AIA.submitActivity) window.AIA.submitActivity('demo-upscale', { type: 'upscale-explored', timestamp: new Date().toISOString() });
  }

  /* ======== DEMO 13: TRANSLATION (HuggingFace) ======== */
  function renderDemoTranslate(main, inline) {
    var header = inline ? '' : '<div class="page-header">' + backBtn() +
      '<h1>Traduction <span class="gradient-text">Marketing Multi-langue</span></h1>' +
      '<p class="page-subtitle">Internationalisez votre campagne en 200 langues — NLLB de Meta</p></div>';
    main.innerHTML = header +
      '<div class="demo-workspace glass-card">' +
      '<h3 style="margin-bottom:0.5rem">🌍 NLLB-200 — No Language Left Behind</h3>' +
      '<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem">Traduisez slogans, descriptions produit, emails en 200 langues. Qualite native sur les langues majeures (EN, ES, DE, IT, ZH, AR, JA, PT, NL, RU).</p>' +
      createHFEmbed('https://facebook-nllb-translation.hf.space', 'NLLB-200 — Translation', { tall: true }) +
      '</div>' +
      '<div class="demo-workspace glass-card" style="margin-top:1.5rem">' +
      '<h3>💡 Insight pedagogique : Traduction vs Transcreation</h3>' +
      '<p style="font-size:0.85rem;line-height:1.6">Modeles encoder-decoder transformer couvrant 200 langues. Pour le marketing pro : <strong>relisez par un locuteur natif</strong>. Le ton et les references culturelles ne se traduisent jamais parfaitement — c\'est la difference entre <strong>traduction</strong> et <strong>transcreation</strong>.</p>' +
      '<h3 style="margin-top:1rem">🎯 Workflow professionnel</h3>' +
      '<ol style="font-size:0.85rem;line-height:1.7;padding-left:1.5rem">' +
      '<li>Premier jet IA (NLLB / DeepL)</li>' +
      '<li>Relecture native pour transcreation (idiomes, jeux de mots)</li>' +
      '<li>A/B test entre 2 versions sur cible reelle</li>' +
      '<li>Iteration sur la version gagnante</li>' +
      '</ol>' +
      '<p style="margin-top:1rem;font-size:0.8rem;color:var(--text-muted)"><strong>Outils pro :</strong> DeepL (premium FR/EN/DE), Google Translate (volume), Smartling/Lokalise (gestion projets)</p>' +
      '</div>';
    markDemoComplete('demo-translate');
    if (window.AIA.submitActivity) window.AIA.submitActivity('demo-translate', { type: 'translate-explored', timestamp: new Date().toISOString() });
  }

  /* ======== DEMO 14: AI LOGO GENERATOR (HuggingFace FLUX) ======== */
  function renderDemoLogo(main, inline) {
    var header = inline ? '' : '<div class="page-header">' + backBtn() +
      '<h1>Generation de <span class="gradient-text">Logos IA</span></h1>' +
      '<p class="page-subtitle">Creez 50 variantes de logo en 5 minutes — FLUX.1 Black Forest Labs</p></div>';
    main.innerHTML = header +
      '<div class="demo-workspace glass-card">' +
      '<h3 style="margin-bottom:0.5rem">🎨 FLUX.1 [schnell] — Logo & branding</h3>' +
      '<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem">FLUX excelle sur typographie + visuels vectoriels (probleme classique des autres modeles). Ideal pour logos, icones, picto.</p>' +
      createHFEmbed('https://black-forest-labs-flux-1-schnell.hf.space', 'FLUX.1 schnell — Image Generator', { tall: true }) +
      '</div>' +
      '<div class="demo-workspace glass-card" style="margin-top:1.5rem">' +
      '<h3>💡 Insight pedagogique</h3>' +
      '<p style="font-size:0.85rem;line-height:1.6">FLUX.1 (Black Forest Labs) est en 2025 le meilleur modele open-source pour <strong>typographie + coherence iconographique</strong>. Architecture : flow matching. Force : sait dessiner du texte lisible (impossible pour DALL-E 2 / SD 1.5). Limite : ne sort pas du SVG vectoriel — il faut convertir avec Vector Magic ou Illustrator Trace.</p>' +
      '<h3 style="margin-top:1rem">🎯 Prompts logo magiques</h3>' +
      '<div style="display:flex;flex-direction:column;gap:0.5rem">' +
      '<div class="tip" style="cursor:pointer" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Prompt copie !\',\'success\')" data-p="Minimalist logo design for [BRAND], single bold letter, geometric shape, vector style, flat design, black on white background, professional, modern, simple"><strong>Logo monogramme</strong><br><code style="font-size:0.72rem;color:var(--cyan)">Minimalist logo, single bold letter, geometric, vector flat</code></div>' +
      '<div class="tip" style="cursor:pointer" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Prompt copie !\',\'success\')" data-p="Modern brand logo for eco-friendly startup [BRAND], leaf icon integrated with text, green earth tones, sans-serif typography, flat vector design"><strong>Logo eco</strong><br><code style="font-size:0.72rem;color:var(--cyan)">Eco brand, leaf icon, green earth, flat vector</code></div>' +
      '<div class="tip" style="cursor:pointer" onclick="navigator.clipboard.writeText(this.getAttribute(\'data-p\'));window.AIA.showToast(\'Prompt copie !\',\'success\')" data-p="Tech startup logo [BRAND], abstract geometric symbol, gradient blue to purple, modern sans-serif font, vector style, isolated on white"><strong>Logo tech SaaS</strong><br><code style="font-size:0.72rem;color:var(--cyan)">Tech logo, gradient blue purple, geometric</code></div>' +
      '</div>' +
      '<p style="margin-top:1rem;font-size:0.8rem;color:var(--text-muted)"><strong>Workflow pro :</strong> FLUX (variantes) → Vector Magic (vectorisation) → Adobe Illustrator (raffinement)</p>' +
      '</div>';
    markDemoComplete('demo-logo');
    if (window.AIA.submitActivity) window.AIA.submitActivity('demo-logo', { type: 'logo-explored', timestamp: new Date().toISOString() });
  }

  /* ======== DEMO 15: TALKING HEAD AVATAR VIDEO (HuggingFace) ======== */
  function renderDemoAvatar(main, inline) {
    var header = inline ? '' : '<div class="page-header">' + backBtn() +
      '<h1>Avatars Video <span class="gradient-text">Animes IA</span></h1>' +
      '<p class="page-subtitle">Animez une photo statique avec audio — ideal pitch fondateur, FAQ video</p></div>';
    main.innerHTML = header +
      '<div class="demo-workspace glass-card">' +
      '<h3 style="margin-bottom:0.5rem">🗣️ SadTalker — Photo + Audio → Video parlante</h3>' +
      '<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem">Uploadez photo + audio (ou TTS). L\'IA genere une video courte ou la personne semble dire le texte. Workflow accelere x100 vs studio video.</p>' +
      createHFEmbed('https://vinthony-sadtalker.hf.space', 'SadTalker — Talking Head Generator', { tall: true }) +
      '</div>' +
      '<div class="demo-workspace glass-card" style="margin-top:1.5rem">' +
      '<h3 style="color:#f5b731">⚠️ Insight pedagogique + ETHIQUE</h3>' +
      '<p style="font-size:0.85rem;line-height:1.6">Meme techno que les <strong>deepfakes malveillants</strong>. Toujours :</p>' +
      '<ul style="font-size:0.85rem;line-height:1.7;padding-left:1.5rem">' +
      '<li><strong>Consentement ecrit</strong> de la personne dont vous utilisez l\'image</li>' +
      '<li><strong>Mention explicite</strong> qu\'il s\'agit d\'un avatar IA</li>' +
      '<li>Jamais d\'utilisation pour declarations non approuvees</li>' +
      '<li>RGPD : l\'image d\'une personne = donnee personnelle</li>' +
      '</ul>' +
      '<h3 style="margin-top:1rem">🎯 Use cases marketing ethiques</h3>' +
      '<div class="tips-grid">' +
      '<div class="tip"><strong>Pitch fondateur</strong><br>Animer votre propre photo en video corporate</div>' +
      '<div class="tip"><strong>FAQ video</strong><br>Reponses pre-enregistrees depuis 1 photo</div>' +
      '<div class="tip"><strong>Multilingue</strong><br>Meme presentateur en 10 langues</div>' +
      '<div class="tip"><strong>Avatar de marque</strong><br>Personnage 100% IA evite RGPD</div>' +
      '</div>' +
      '<p style="margin-top:1rem;font-size:0.8rem;color:var(--text-muted)"><strong>Outils pro :</strong> HeyGen ($30/mo broadcast), Synthesia ($30/mo), D-ID (avatars custom)</p>' +
      '</div>';
    markDemoComplete('demo-avatar');
    if (window.AIA.submitActivity) window.AIA.submitActivity('demo-avatar', { type: 'avatar-explored', timestamp: new Date().toISOString() });
  }

  /* ---------- Expose to AIA ---------- */
  window.AIA = window.AIA || {};
  window.AIA.renderDemoPrompt = renderDemoPrompt;
  window.AIA.renderDemoSentiment = renderDemoSentiment;
  window.AIA.renderDemoImage = renderDemoImage;
  window.AIA.renderDemoChatbot = renderDemoChatbot;
  window.AIA.renderDemoABTest = renderDemoABTest;
  window.AIA.renderDemoSEO = renderDemoSEO;
  window.AIA.renderDemoBgRemove = renderDemoBgRemove;
  window.AIA.renderDemoMusic = renderDemoMusic;
  window.AIA.renderDemoSpeech = renderDemoSpeech;
  window.AIA.renderDemoVqa = renderDemoVqa;
  window.AIA.renderDemoTts = renderDemoTts;
  window.AIA.renderDemoUpscale = renderDemoUpscale;
  window.AIA.renderDemoTranslate = renderDemoTranslate;
  window.AIA.renderDemoLogo = renderDemoLogo;
  window.AIA.renderDemoAvatar = renderDemoAvatar;
  window.AIA.createHFEmbed = createHFEmbed;
})();
