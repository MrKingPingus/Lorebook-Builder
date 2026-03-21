
  // ── MOBILE: Entry Editor ─────────────────────────────────────────────────

  function openEditor(id){
    currentEditId=id;
    var e=entries[id];
    edBody.innerHTML='';
    edTitle.textContent=e.name||'Untitled entry';

    function field(label,el,hint){
      var w=document.createElement('div');w.className='_lbm_field';
      var l=document.createElement('label');l.className='_lbm_label';l.textContent=label;
      w.appendChild(l);w.appendChild(el);
      if(hint){var h=document.createElement('div');h.className='_lbm_hint';h.textContent=hint;w.appendChild(h);}
      return w;
    }

    var nameI=document.createElement('input');nameI.type='text';nameI.className='_lbm_inp';
    nameI.placeholder='Character, place, item...';nameI.value=e.name;
    nameI.addEventListener('input',function(){
      e.name=nameI.value.trim();
      edTitle.textContent=e.name||'Untitled entry';
      sugOffset=0;updateCard(id);renderSugs();scheduleSave();
    });
    edBody.appendChild(field('Entry Name',nameI));

    var typeFieldDiv=document.createElement('div');typeFieldDiv.className='_lbm_field';
    var typeLbl=document.createElement('label');typeLbl.className='_lbm_label';typeLbl.textContent='Entry Type';
    var typeRow=document.createElement('div');typeRow.id='_lbm_type_row';
    var typeBtns={};
    TYPES.forEach(function(t){
      var b=document.createElement('button');b.className='_lbm_typebtn'+(e.type===t?' sel':'');
      b.textContent=t;b.dataset.t=t;
      b.addEventListener('click',function(){
        e.type=t;
        Object.values(typeBtns).forEach(function(x){x.classList.remove('sel');});
        b.classList.add('sel');
        sugOffset=0;updateCard(id);renderSugs();scheduleSave();
      });
      typeRow.appendChild(b);typeBtns[t]=b;
    });
    typeFieldDiv.appendChild(typeLbl);typeFieldDiv.appendChild(typeRow);
    edBody.appendChild(typeFieldDiv);

    // ── Trigger field: tag-chip mode (default) or compact text (setting) ──
    var trigWrap=document.createElement('div');trigWrap.className='_lbm_field';
    var trigLbl=document.createElement('label');trigLbl.className='_lbm_label';trigLbl.textContent='Trigger Keywords';
    trigWrap.appendChild(trigLbl);

    var trigCounter=document.createElement('div');trigCounter.className='_lbm_trig_counter';
    function updTrigCounter(){
      var count=e.triggers.length;
      trigCounter.textContent=count+' / 25 triggers';
      trigCounter.className='_lbm_trig_counter'+(count>=25?' over':count>=20?' warn':'');
    }
    updTrigCounter();

    // Phrase builder state
    var phraseQueue=[];
    var phraseMode=false;

    // ── TAG CHIP MODE ──
    var tagRow=document.createElement('div');tagRow.className='_lbm_tag_row';
    var tagInp=document.createElement('input');
    tagInp.type='text';tagInp.className='_lbm_tag_inp';
    tagInp.placeholder='Add trigger...';tagInp.setAttribute('autocomplete','off');

    function renderTags(){
      Array.from(tagRow.children).forEach(function(c){if(c!==tagInp)tagRow.removeChild(c);});
      e.triggers.forEach(function(t,i){
        var tag=document.createElement('span');tag.className='_lbm_tag';
        var lbl=document.createElement('span');lbl.textContent=t;
        var x=document.createElement('button');x.className='_lbm_tag_x';x.textContent='×';
        x.addEventListener('click',function(ev){
          ev.preventDefault();ev.stopPropagation();
          e.triggers.splice(i,1);
          renderTags();updTrigCounter();renderSugs();scheduleSave();
        });
        // Tap label to edit inline
        lbl.addEventListener('click',function(ev){
          ev.preventDefault();ev.stopPropagation();
          // Replace chip with inline input
          tag.className='_lbm_tag editing';
          tag.innerHTML='';
          var editInp=document.createElement('input');
          editInp.type='text';editInp.className='_lbm_tag_edit_inp';
          editInp.value=t;editInp.style.width=Math.max(60,t.length*9)+'px';
          tag.appendChild(editInp);
          setTimeout(function(){editInp.focus();editInp.select();},30);
          function commitEdit(){
            var val=editInp.value.trim();
            if(!val){
              // Empty → delete
              e.triggers.splice(i,1);
            } else if(val===t){
              // Unchanged → just re-render
            } else if(e.triggers.indexOf(val)!==-1){
              // Duplicate → flash and abort
              tag.className='_lbm_tag flash_err';
              tag.innerHTML='';tag.appendChild(lbl);tag.appendChild(x);
              setTimeout(function(){tag.className='_lbm_tag';},500);
              return;
            } else {
              e.triggers[i]=val;
            }
            renderTags();updTrigCounter();renderSugs();scheduleSave();
          }
          editInp.addEventListener('keydown',function(ev){
            if(ev.key==='Enter'){ev.preventDefault();commitEdit();}
            if(ev.key==='Escape'){ev.preventDefault();renderTags();}
          });
          editInp.addEventListener('blur',commitEdit);
        });
        tag.appendChild(lbl);tag.appendChild(x);
        tagRow.insertBefore(tag,tagInp);
      });
    }

    function commitTagInp(){
      var val=tagInp.value.trim().replace(/[,;]+$/,'').trim();
      if(val&&e.triggers.indexOf(val)===-1&&e.triggers.length<25){
        e.triggers.push(val);
        renderTags();updTrigCounter();renderSugs();scheduleSave();
      }
      tagInp.value='';
    }

    tagInp.addEventListener('keydown',function(ev){
      if(ev.key==='Enter'||ev.key===','||ev.key===';'){
        ev.preventDefault();commitTagInp();
      } else if(ev.key==='Backspace'&&tagInp.value===''&&e.triggers.length>0){
        e.triggers.pop();renderTags();updTrigCounter();renderSugs();scheduleSave();
      }
    });
    tagInp.addEventListener('blur',function(){if(tagInp.value.trim())commitTagInp();});
    tagRow.addEventListener('click',function(){tagInp.focus();});
    tagRow.appendChild(tagInp);
    renderTags();

    // ── COMPACT TEXT MODE ──
    var trigI=document.createElement('input');trigI.type='text';trigI.className='_lbm_inp';
    var sep=e.delim===','?', ':'; ';
    trigI.value=e.triggers.join(sep);
    trigI.placeholder=e.delim===','?'keyword, another':'keyword; another';
    var delimRow=document.createElement('div');delimRow.id='_lbm_delim_row';
    var dComma=document.createElement('button');dComma.className='_lbm_delimbtn'+(e.delim===','?' sel':'');dComma.textContent=', Comma';
    var dSemi=document.createElement('button');dSemi.className='_lbm_delimbtn'+(e.delim===';'?' sel':'');dSemi.textContent='; Semicolon';
    function setDelim(d){
      e.delim=d;
      var cur=trigI.value.split(d===','?';':',').map(function(t){return t.trim();}).filter(Boolean);
      trigI.value=cur.join(d===','?', ':'; ');
      trigI.placeholder=d===','?'keyword, another':'keyword; another';
      dComma.classList.toggle('sel',d===',');dSemi.classList.toggle('sel',d===';');
      scheduleSave();
    }
    dComma.addEventListener('click',function(){setDelim(',');});
    dSemi.addEventListener('click',function(){setDelim(';');});
    delimRow.appendChild(dComma);delimRow.appendChild(dSemi);
    trigI.addEventListener('input',function(){
      e.triggers=trigI.value.split(e.delim).map(function(t){return t.trim();}).filter(Boolean);
      updTrigCounter();renderSugs();scheduleSave();
    });

    // Mount correct mode
    if(window._lbm_compact_triggers){
      trigWrap.appendChild(trigI);trigWrap.appendChild(delimRow);
      trigWrap.appendChild((function(){var h=document.createElement('div');h.className='_lbm_hint';h.textContent='Use semicolons if any trigger contains a comma';return h;})());
    } else {
      trigWrap.appendChild(tagRow);
    }
    trigWrap.appendChild(trigCounter);

    // ── Phrase builder UI ──
    // phraseQueue is an array of words; selectedPhraseIdx tracks tap-to-swap selection
    var selectedPhraseIdx=-1;

    // Pill row container (shown during phrase building)
    var phrasePillRow=document.createElement('div');
    phrasePillRow.className='_lbm_phrase_pill_row';
    phrasePillRow.style.display='none';

    // Confirm / cancel row
    var phraseActions=document.createElement('div');
    phraseActions.className='_lbm_phrase_actions';
    phraseActions.style.display='none';
    var phraseConfirm=document.createElement('button');phraseConfirm.className='_lbm_phrase_confirm';phraseConfirm.textContent='✓ Add phrase';phraseConfirm.title='Add phrase as trigger';
    phraseConfirm.style.cssText='font-size:.8rem;padding:4px 10px;border-radius:10px;border:1px solid #34d399;background:#0d2618;color:#34d399;cursor:pointer;font-family:system-ui,sans-serif';
    var phraseCancel=document.createElement('button');phraseCancel.className='_lbm_phrase_cancel';phraseCancel.textContent='✕ Cancel';
    phraseCancel.style.cssText='font-size:.8rem;padding:4px 10px;border-radius:10px;border:1px solid #374151;background:transparent;color:#6b7280;cursor:pointer;font-family:system-ui,sans-serif';
    var phraseHint=document.createElement('span');phraseHint.style.cssText='font-size:.68rem;color:#475569;margin-left:4px';phraseHint.textContent='Tap two words to swap';
    phraseActions.appendChild(phraseConfirm);phraseActions.appendChild(phraseCancel);phraseActions.appendChild(phraseHint);

    function renderPhrasePills(){
      phrasePillRow.innerHTML='';
      if(!phraseQueue.length){phrasePillRow.style.display='none';phraseActions.style.display='none';return;}
      phrasePillRow.style.display='flex';phraseActions.style.display='flex';
      phraseQueue.forEach(function(word,i){
        var pill=document.createElement('span');pill.className='_lbm_phrase_pill'+(selectedPhraseIdx===i?' selected':'');
        var wordSpan=document.createElement('span');wordSpan.textContent=word;
        var px=document.createElement('button');px.className='_lbm_phrase_pill_x';px.textContent='×';px.title='Remove';
        px.addEventListener('click',function(ev){
          ev.preventDefault();ev.stopPropagation();
          phraseQueue.splice(i,1);
          if(selectedPhraseIdx>=phraseQueue.length)selectedPhraseIdx=-1;
          renderPhrasePills();
          if(!phraseQueue.length){phraseMode=false;phraseToggle.classList.remove('on');renderSugs();}
        });
        pill.addEventListener('click',function(ev){
          ev.preventDefault();ev.stopPropagation();
          if(selectedPhraseIdx===-1){
            // First tap: select
            selectedPhraseIdx=i;
          } else if(selectedPhraseIdx===i){
            // Tap same: deselect
            selectedPhraseIdx=-1;
          } else {
            // Second tap on different: swap
            var tmp=phraseQueue[selectedPhraseIdx];
            phraseQueue[selectedPhraseIdx]=phraseQueue[i];
            phraseQueue[i]=tmp;
            selectedPhraseIdx=-1;
          }
          renderPhrasePills();
        });
        pill.appendChild(wordSpan);pill.appendChild(px);
        phrasePillRow.appendChild(pill);
      });
    }

    // ── Suggestions tray (collapsible) ──
    var sugTray=document.createElement('div');sugTray.className='_lbm_sug_tray';sugTray.style.display='none';

    var sugTrayHd=document.createElement('div');sugTrayHd.className='_lbm_sug_tray_hd';
    var sugTrayTitle=document.createElement('span');sugTrayTitle.className='_lbm_sug_tray_title';
    var sugChevron=document.createElement('span');sugChevron.className='_lbm_sug_tray_chevron';
    var phraseToggle=document.createElement('button');phraseToggle.className='_lbm_phrase_toggle';phraseToggle.textContent='＋ Phrase';

    var sugTrayBody=document.createElement('div');sugTrayBody.className='_lbm_sug_tray_body';
    var sugRow=document.createElement('div');sugRow.className='_lbm_sug_row';sugRow.style.cssText='margin-top:6px';
    sugTrayBody.appendChild(sugRow);

    // Tray collapsed state — driven by setting, togglable per-entry
    var trayCollapsed=!!window._lbm_sugs_collapsed;
    function applyTrayState(){
      sugChevron.style.transform=trayCollapsed?'rotate(-90deg)':'rotate(0deg)';
      sugTrayTitle.innerHTML='';
      var icon=document.createElement('span');icon.textContent=trayCollapsed?'▸':'▾';
      var txt=document.createElement('span');txt.textContent='Trigger Word Suggestions';
      sugTrayTitle.appendChild(icon);sugTrayTitle.appendChild(txt);
      // Use max-height trick for smooth collapse
      if(trayCollapsed){
        sugTrayBody.style.maxHeight=sugTrayBody.scrollHeight+'px';
        requestAnimationFrame(function(){
          sugTrayBody.style.maxHeight='0';
          sugTrayBody.classList.add('collapsed');
        });
      } else {
        sugTrayBody.classList.remove('collapsed');
        sugTrayBody.style.maxHeight=sugTrayBody.scrollHeight+200+'px';
      }
    }
    applyTrayState();

    sugTrayHd.addEventListener('click',function(ev){
      ev.stopPropagation();
      trayCollapsed=!trayCollapsed;
      applyTrayState();
    });

    phraseToggle.addEventListener('click',function(ev){
      ev.preventDefault();ev.stopPropagation();
      phraseMode=!phraseMode;
      phraseToggle.classList.toggle('on',phraseMode);
      if(!phraseMode){
        phraseQueue=[];selectedPhraseIdx=-1;
        renderPhrasePills();
        renderSugs();
      }
    });

    var rerollBtn=document.createElement('button');rerollBtn.className='_lbm_reroll';rerollBtn.textContent='↺';rerollBtn.title='Show different suggestions';
    var sugOffset=0;
    rerollBtn.addEventListener('click',function(ev){
      ev.stopPropagation();
      sugOffset+=12;
      rerollBtn.style.transform='rotate(360deg)';
      setTimeout(function(){rerollBtn.style.transform='';},300);
      renderSugs();
    });
    var trayRight=document.createElement('div');trayRight.style.cssText='display:flex;align-items:center;gap:6px';
    trayRight.appendChild(rerollBtn);trayRight.appendChild(phraseToggle);
    sugTrayHd.appendChild(sugTrayTitle);sugTrayHd.appendChild(trayRight);
    sugTray.appendChild(sugTrayHd);sugTray.appendChild(sugTrayBody);

    phraseConfirm.addEventListener('click',function(ev){
      ev.preventDefault();ev.stopPropagation();
      var phrase=phraseQueue.join(' ').trim();
      if(phrase){
        if(window._lbm_compact_triggers){
          var cur=trigI.value.trim();var s=e.delim===','?', ':'; ';
          trigI.value=cur?cur+s+phrase:phrase;
          e.triggers=trigI.value.split(e.delim).map(function(t){return t.trim();}).filter(Boolean);
        } else {
          if(e.triggers.indexOf(phrase)===-1&&e.triggers.length<25){e.triggers.push(phrase);renderTags();}
        }
        updTrigCounter();scheduleSave();
      }
      phraseQueue=[];selectedPhraseIdx=-1;phraseMode=false;
      phraseToggle.classList.remove('on');
      renderPhrasePills();
      renderSugs();
    });

    phraseCancel.addEventListener('click',function(ev){
      ev.preventDefault();ev.stopPropagation();
      phraseQueue=[];selectedPhraseIdx=-1;phraseMode=false;
      phraseToggle.classList.remove('on');
      renderPhrasePills();
      renderSugs(); // clears chip highlights
    });

    function renderSugs(){
      var raw=getSuggestions(e.name||'',e.type||'Character',e.description||'');
      var existing=e.triggers.map(function(t){return t.toLowerCase();});
      var filtered=raw.filter(function(s){return existing.indexOf(s)===-1;});
      sugRow.innerHTML='';
      if(!filtered.length){
        sugTray.style.display='none';
        return;
      }
      sugTray.style.display='';
      // Recalc max-height after content change if expanded
      if(!trayCollapsed) sugTrayBody.style.maxHeight=sugTrayBody.scrollHeight+200+'px';
      // Wrap offset so it never goes out of bounds
      if(sugOffset>=filtered.length)sugOffset=0;
      var page=filtered.slice(sugOffset,sugOffset+12);
      // If we didn't get 12, wrap around and fill from start (deduplicated)
      if(page.length<12&&filtered.length>12){
        var extra=filtered.slice(0,12-page.length).filter(function(s){return page.indexOf(s)===-1;});
        page=page.concat(extra);
      }
      page.forEach(function(sug){
        var chip=document.createElement('button');chip.className='_lbm_sug_chip';chip.textContent=sug;
        chip.addEventListener('click',function(ev){
          ev.preventDefault();ev.stopPropagation();
          if(phraseMode){
            phraseQueue.push(sug);
            selectedPhraseIdx=-1;
            renderPhrasePills();
            chip.style.opacity='0.4';chip.style.pointerEvents='none';
          } else {
            if(window._lbm_compact_triggers){
              var s=e.delim===','?', ':'; ';var cur=trigI.value.trim();
              trigI.value=cur?cur+s+sug:sug;
              e.triggers=trigI.value.split(e.delim).map(function(t){return t.trim();}).filter(Boolean);
            } else {
              if(e.triggers.indexOf(sug)===-1&&e.triggers.length<25){e.triggers.push(sug);renderTags();}
            }
            updTrigCounter();renderSugs();scheduleSave();
          }
        });
        sugRow.appendChild(chip);
      });
    }
    renderSugs();

    trigWrap.appendChild(sugTray);
    trigWrap.appendChild(phrasePillRow);
    trigWrap.appendChild(phraseActions);
    edBody.appendChild(trigWrap);

    var descTA=document.createElement('textarea');descTA.className='_lbm_ta';
    descTA.placeholder='Describe this entry...';descTA.value=e.description;
    var descHlDiv=document.createElement('div');descHlDiv.className='_lbm_desc_hl';
    var descHlWrap=document.createElement('div');descHlWrap.className='_lbm_desc_hl_wrap';
    descHlWrap.appendChild(descHlDiv);descHlWrap.appendChild(descTA);
    function syncDescHl(re){var safe=escHtml(descTA.value);if(re)safe=safe.replace(re,'<mark style="'+HL_MARK+'">$1</mark>');descHlDiv.innerHTML=safe+' ';}
    var _iq=searchInp.value.trim().toLowerCase();var _ie=_iq?regexEscape(_iq):'';syncDescHl(_ie?new RegExp('('+_ie+')','gi'):null);
    currentSyncDescHl=syncDescHl;
    function autoGrow(){descTA.style.height='auto';descTA.style.height=Math.max(descTA._minH||120,descTA.scrollHeight)+'px';}
    setTimeout(autoGrow,0);
    var descTab=document.createElement('div');descTab.className='_lbm_ta_tab';
    function startTabDrag(startY,startH){
      function mv(y){var h=Math.max(120,startH+(y-startY));descTA._minH=h;descTA.style.height=h+'px';}
      function onMm(e){mv(e.clientY);}
      function onTm(e){if(e.touches[0])mv(e.touches[0].clientY);}
      function done(){document.removeEventListener('mousemove',onMm);document.removeEventListener('mouseup',done);document.removeEventListener('touchmove',onTm);document.removeEventListener('touchend',done);}
      document.addEventListener('mousemove',onMm);document.addEventListener('mouseup',done);document.addEventListener('touchmove',onTm,{passive:false});document.addEventListener('touchend',done);
    }
    descTab.addEventListener('mousedown',function(e){e.preventDefault();startTabDrag(e.clientY,descTA.offsetHeight);});
    descTab.addEventListener('touchstart',function(e){e.preventDefault();if(e.touches[0])startTabDrag(e.touches[0].clientY,descTA.offsetHeight);},{passive:false});
    var cc=document.createElement('div');cc.className='_lbm_cc';
    function updCC(){
      var n=descTA.value.length;
      cc.textContent=n+' / 1500';
      if(window._lbm_tiered_counter){
        cc.className='_lbm_cc'+(n>1250?' over':n>750?' warn':' good');
      } else {
        cc.className='_lbm_cc'+(n>1500?' over':n>1200?' warn':'');
      }
    }
    updCC();
    descTA.addEventListener('input',function(){autoGrow();e.description=descTA.value.trim();updCC();sugOffset=0;renderSugs();scheduleSave();var _q=searchInp.value.trim().toLowerCase();var _e=_q?regexEscape(_q):'';syncDescHl(_e?new RegExp('('+_e+')','gi'):null);});
    var descWrap=document.createElement('div');descWrap.className='_lbm_field';
    var descLbl=document.createElement('label');descLbl.className='_lbm_label';descLbl.textContent='Description (1500 char limit)';
    descWrap.appendChild(descLbl);descWrap.appendChild(descHlWrap);descWrap.appendChild(descTab);descWrap.appendChild(cc);
    edBody.appendChild(descWrap);

    var moveRow=document.createElement('div');moveRow.id='_lbm_move_row';
    var upB=document.createElement('button');upB.className='_lbm_movebtn';upB.textContent='↑ Move Up';
    var dnB=document.createElement('button');dnB.className='_lbm_movebtn';dnB.textContent='↓ Move Down';
    upB.addEventListener('click',function(){
      var i=entryOrder.indexOf(id);
      if(i>0){
        entryOrder.splice(i,1);entryOrder.splice(i-1,0,id);
        var prev=document.getElementById('_lbm_card_'+entryOrder[i]);
        if(prev)entriesDiv.insertBefore(document.getElementById('_lbm_card_'+id),prev);
        renumber();scheduleSave();
      }
    });
    dnB.addEventListener('click',function(){
      var i=entryOrder.indexOf(id);
      if(i<entryOrder.length-1){
        entryOrder.splice(i,1);entryOrder.splice(i+1,0,id);
        var next=document.getElementById('_lbm_card_'+entryOrder[i]);
        if(next)entriesDiv.insertBefore(document.getElementById('_lbm_card_'+id),next.nextSibling);
        renumber();scheduleSave();
      }
    });
    moveRow.appendChild(upB);moveRow.appendChild(dnB);
    edBody.appendChild(moveRow);

    editor.classList.add('open');
    setTimeout(function(){nameI.focus();},300);
  }

  function closeEditor(){
    editor.classList.remove('open');
    currentEditId=null;
    currentSyncDescHl=null;
  }

  backBtn.addEventListener('click',closeEditor);
  edDel.addEventListener('click',function(){
    if(!currentEditId)return;
    if(!confirm('Remove this entry?'))return;
    var id=currentEditId;
    closeEditor();
    setTimeout(function(){removeEntry(id);},250);
  });

