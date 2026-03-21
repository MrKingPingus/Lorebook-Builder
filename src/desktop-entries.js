
  // ── DESKTOP: Entry Factory ──────────────────────────────────────────────────
  var ec=0;
  function mkEntry(data){
    var d=data||{};
    var el=document.createElement('div');el.className='_lb_entry'+(window._lb_expand_default?'':' _lb_collapsed');
    el.dataset.type=d.type||'Character';

    var ehead=document.createElement('div');ehead.className='_lb_ehead';
    var eleft=document.createElement('div');eleft.style.cssText='display:flex;align-items:center;gap:8px;min-width:0;overflow:hidden';
    var dragHandle=document.createElement('span');
    if(IS_MOBILE){
      dragHandle.style.cssText='display:flex;gap:3px;flex-shrink:0';
      var upBtn=document.createElement('button');upBtn.className='_lb_ebtn';upBtn.textContent='↑';upBtn.title='Move up';
      var dnBtn=document.createElement('button');dnBtn.className='_lb_ebtn';dnBtn.textContent='↓';dnBtn.title='Move down';
      upBtn.addEventListener('click',function(e){e.stopPropagation();var prev=el.previousElementSibling;if(prev&&prev.classList.contains('_lb_entry')){eDiv.insertBefore(el,prev);renumberEntries();scheduleSave();}});
      dnBtn.addEventListener('click',function(e){e.stopPropagation();var next=el.nextElementSibling;if(next&&next.classList.contains('_lb_entry')){eDiv.insertBefore(next,el);renumberEntries();scheduleSave();}});
      dragHandle.appendChild(upBtn);dragHandle.appendChild(dnBtn);
    } else {
      dragHandle.className='_lb_drag';dragHandle.textContent='⠿';dragHandle.title='Drag to reorder';
      dragHandle.addEventListener('mousedown',function(){el.draggable=true;});
    }
    var typeDot=document.createElement('span');typeDot.className='_lb_type_dot';
    var enumEl=document.createElement('span');enumEl.className='_lb_enum';
    var eStatWrap=document.createElement('span');eStatWrap.style.cssText='display:flex;gap:6px;align-items:center;flex-shrink:0;';
    var eStat1=document.createElement('span');eStat1.style.cssText='font-size:.65rem;font-weight:600;color:#34d399;white-space:nowrap';
    var eStat2=document.createElement('span');eStat2.style.cssText='font-size:.65rem;font-weight:600;color:#34d399;white-space:nowrap';
    eStatWrap.appendChild(eStat1);eStatWrap.appendChild(eStat2);
    var ebtns=document.createElement('div');ebtns.className='_lb_ebtns';
    var colBtn=document.createElement('button');colBtn.className='_lb_ebtn';colBtn.textContent=window._lb_expand_default?'▲ Collapse':'▼ Expand';
    var delBtn=document.createElement('button');delBtn.className='_lb_ebtn';delBtn.textContent='Remove';
    ebtns.appendChild(eStatWrap);ebtns.appendChild(colBtn);ebtns.appendChild(delBtn);
    eleft.style.flex='1';
    eleft.appendChild(dragHandle);eleft.appendChild(typeDot);eleft.appendChild(enumEl);
    ehead.appendChild(eleft);ehead.appendChild(ebtns);
    function updStats(){
      var hide=window._lb_hide_stats;
      eStatWrap.style.display=hide?'none':'flex';
      if(hide)return;
      var tc=el._triggers?el._triggers.length:0;
      var dc=el._gd?el._gd().description.length:0;
      function sc(v,max){return v>=max?'#ef4444':v>=max*.8?'#f59e0b':'#34d399';}
      eStat1.textContent=tc+'/25 trg';eStat1.style.color=sc(tc,25);
      eStat2.textContent=dc+'/1500 chr';eStat2.style.color=sc(dc,1500);
    }
    el._updStats=updStats;

    var ebody=document.createElement('div');ebody.className='_lb_ebody';
    var grid=document.createElement('div');grid.className='_lb_grid';

    function fld(lbl,inp,hint){
      var w=document.createElement('div');
      var l=document.createElement('label');l.className='_lb_lbl';l.textContent=lbl;
      w.appendChild(l);w.appendChild(inp);
      if(hint){var h=document.createElement('div');h.className='_lb_hint';h.textContent=hint;w.appendChild(h);}
      return w;
    }

    var nameI=document.createElement('input');nameI.type='text';nameI.className='_lb_inp';nameI.placeholder='Character, place, item...';nameI.value=d.name||'';
    var typeS=document.createElement('select');typeS.className='_lb_sel';
    TYPES.forEach(function(t){var o=document.createElement('option');o.value=t;o.textContent=t;if((d.type||'Character')===t)o.selected=true;typeS.appendChild(o);});
    var delim=d.delim||',';
    // ── Desktop trigger field: tag chips (default) or compact text (setting) ──
    var trigCounter=document.createElement('div');trigCounter.className='_lb_trig_counter';
    function updTrigCounter(){
      var count=Array.isArray(d.triggers)?d.triggers.length:0;
      // keep in sync with live array after edits
      count=el._triggers?el._triggers.length:count;
      trigCounter.textContent=count+' / 25 triggers';
      trigCounter.className='_lb_trig_counter'+(count>=25?' _over':count>=20?' _warn':'');
    }

    // live trigger array stored on element
    el._triggers=Array.isArray(d.triggers)?d.triggers.slice():(d.triggers?[d.triggers]:[]);

    // ── TAG CHIP MODE ──
    var tagRow=document.createElement('div');
    tagRow.style.cssText='display:flex;align-items:center;flex-wrap:wrap;gap:5px;background:#111827;border:1px solid #374151;border-radius:6px;padding:6px 8px;min-height:34px;cursor:text';
    var tagInp=document.createElement('input');
    tagInp.type='text';tagInp.style.cssText='background:none;border:none;outline:none;color:#e5e7eb;font-size:.87rem;font-family:system-ui,sans-serif;min-width:80px;flex:1;padding:0';
    tagInp.placeholder='Add trigger...';tagInp.setAttribute('autocomplete','off');

    function renderTags(){
      Array.from(tagRow.children).forEach(function(c){if(c!==tagInp)tagRow.removeChild(c);});
      el._triggers.forEach(function(t,i){
        var tag=document.createElement('span');
        tag.style.cssText='display:inline-flex;align-items:center;gap:3px;background:#1f2937;border:1px solid #374151;border-radius:10px;padding:2px 6px 2px 8px;font-size:.75rem;color:#e5e7eb;white-space:nowrap';
        var lbl=document.createElement('span');lbl.className='_lb_trig_lbl';lbl.textContent=t;
        var x=document.createElement('button');
        x.style.cssText='background:none;border:none;color:#6b7280;font-size:.8rem;cursor:pointer;padding:0 0 0 2px;line-height:1;font-family:system-ui,sans-serif';
        x.textContent='\u00d7';
        x.addEventListener('click',function(ev){
          ev.stopPropagation();el._triggers.splice(i,1);
          renderTags();updTrigCounter();renderSugs();scheduleSave();
        });
        // Click label to edit inline
        lbl.style.cssText='cursor:text;user-select:text';
        lbl.addEventListener('dblclick',function(ev){
          ev.stopPropagation();
          tag.style.cssText='display:inline-flex;align-items:center;background:#111827;border:1px solid #ef4444;border-radius:10px;padding:0';
          tag.innerHTML='';
          var ei=document.createElement('input');
          ei.type='text';ei.value=t;
          ei.style.cssText='background:none;border:none;outline:none;color:#e5e7eb;font-size:.75rem;font-family:system-ui,sans-serif;padding:2px 8px;min-width:60px;max-width:140px;width:'+(Math.max(60,t.length*8))+'px';
          tag.appendChild(ei);
          setTimeout(function(){ei.focus();ei.select();},20);
          function commitEdit(){
            var val=ei.value.trim();
            if(!val){el._triggers.splice(i,1);}
            else if(val===t){}
            else if(el._triggers.indexOf(val)!==-1){
              tag.style.cssText='display:inline-flex;align-items:center;gap:3px;background:#2d0a0a;border:1px solid #ef4444;border-radius:10px;padding:2px 6px 2px 8px;font-size:.75rem;color:#e5e7eb';
              tag.innerHTML='';tag.appendChild(lbl);tag.appendChild(x);
              setTimeout(function(){tag.style.cssText='display:inline-flex;align-items:center;gap:3px;background:#1f2937;border:1px solid #374151;border-radius:10px;padding:2px 6px 2px 8px;font-size:.75rem;color:#e5e7eb';},500);
              return;
            } else {el._triggers[i]=val;}
            renderTags();updTrigCounter();renderSugs();scheduleSave();
          }
          ei.addEventListener('keydown',function(ev){
            if(ev.key==='Enter'){ev.preventDefault();commitEdit();}
            if(ev.key==='Escape'){ev.preventDefault();renderTags();}
          });
          ei.addEventListener('blur',commitEdit);
        });
        tag.appendChild(lbl);tag.appendChild(x);
        tagRow.insertBefore(tag,tagInp);
      });
    }

    function commitTagInp(){
      var val=tagInp.value.trim().replace(/[,;]+$/,'').trim();
      if(val&&el._triggers.indexOf(val)===-1&&el._triggers.length<25){
        el._triggers.push(val);renderTags();updTrigCounter();updStats();renderSugs();scheduleSave();
      }
      tagInp.value='';
    }
    tagInp.addEventListener('keydown',function(ev){
      if(ev.key==='Enter'||ev.key===','||ev.key===';'){ev.preventDefault();commitTagInp();}
      else if(ev.key==='Backspace'&&tagInp.value===''&&el._triggers.length>0){
        el._triggers.pop();renderTags();updTrigCounter();renderSugs();scheduleSave();
      }
    });
    tagInp.addEventListener('paste',function(ev){
      var text=(ev.clipboardData||window.clipboardData).getData('text');
      var parts=text.split(/[,;]+/).map(function(t){return t.trim();}).filter(Boolean);
      if(parts.length<=1)return;
      ev.preventDefault();
      parts.forEach(function(p){if(p&&el._triggers.indexOf(p)===-1&&el._triggers.length<25)el._triggers.push(p);});
      renderTags();updTrigCounter();renderSugs();scheduleSave();
    });
    tagInp.addEventListener('blur',function(){if(tagInp.value.trim())commitTagInp();});
    tagRow.addEventListener('click',function(){tagInp.focus();});
    tagRow.appendChild(tagInp);
    renderTags();

    // ── COMPACT TEXT MODE ──
    var trigI=document.createElement('input');trigI.type='text';trigI.className='_lb_inp';
    trigI.placeholder=delim===','?'keyword, another, etc.':'keyword; another; etc.';
    trigI.value=el._triggers.join(delim===','?', ':'; ');
    var trigWrapInner=document.createElement('div');trigWrapInner.style.cssText='display:flex;gap:6px;align-items:center';
    trigWrapInner.appendChild(trigI);
    var trigHint=document.createElement('div');trigHint.className='_lb_hint';
    trigHint.textContent='Use semicolons instead if any trigger contains a comma';
    var trigOuter=document.createElement('div');
    trigOuter.appendChild(trigWrapInner);trigOuter.appendChild(trigHint);trigOuter.appendChild(trigCounter);
    trigI.addEventListener('input',function(){
      el._triggers=trigI.value.split(delim).map(function(t){return t.trim();}).filter(Boolean);
      updTrigCounter();renderSugs();scheduleSave();
    });

    var descTA=document.createElement('textarea');descTA.className='_lb_ta';descTA.placeholder='Describe this entry...';descTA.value=d.description||'';
    var descHlDiv=document.createElement('div');descHlDiv.className='_lb_desc_hl';
    var descHlWrap=document.createElement('div');descHlWrap.className='_lb_desc_hl_wrap';
    descHlWrap.appendChild(descHlDiv);descHlWrap.appendChild(descTA);
    function syncDescHl(re){
      var safe=escHtml(descTA.value);
      if(re)safe=safe.replace(re,'<mark style="'+HL_MARK+'">$1</mark>');
      descHlDiv.innerHTML=safe+' ';
    }
    syncDescHl(null);
    el._syncDescHl=syncDescHl;
    function autoGrow(){descTA.style.height='auto';var h=Math.max(descTA._minH||70,descTA.scrollHeight);descTA.style.height=h+'px';}
    requestAnimationFrame(autoGrow);
    var descTab=document.createElement('div');descTab.className='_lb_ta_tab';
    descTab.addEventListener('mousedown',function(e){
      e.preventDefault();var sy=e.clientY,sh=descTA.offsetHeight;
      function mv(e){var h=Math.max(70,sh+(e.clientY-sy));descTA._minH=h;descTA.style.height=h+'px';}
      function up(){document.removeEventListener('mousemove',mv);document.removeEventListener('mouseup',up);}
      document.addEventListener('mousemove',mv);document.addEventListener('mouseup',up);
    });
    var cc=document.createElement('div');cc.className='_lb_cc';
    function updCC(){var n=descTA.value.length;cc.textContent=n+' / 1500';if(window._lb_tiered_counter){cc.className='_lb_cc'+(n>1250?' _over':n>750?' _warn':' _good');}else{cc.className='_lb_cc'+(n>1500?' _over':n>1200?' _warn':'');}}
    updCC();

    var descWrap=document.createElement('div');descWrap.className='_lb_full';
    var dLbl=document.createElement('label');dLbl.className='_lb_lbl';dLbl.textContent='Description';
    var dNote=document.createElement('span');dNote.style.cssText='text-transform:none;letter-spacing:0;font-weight:400;color:#4b5563';dNote.textContent=' (1500 char limit)';
    dLbl.appendChild(dNote);descWrap.appendChild(dLbl);descWrap.appendChild(descHlWrap);descWrap.appendChild(descTab);descWrap.appendChild(cc);

    var delimSel=document.createElement('select');
    delimSel.style.cssText='background:#111827;border:1px solid #374151;border-radius:5px;color:#9ca3af;padding:2px 6px;font-size:.72rem;outline:none;font-family:system-ui,sans-serif;cursor:pointer';
    [{v:',',l:', comma'},{v:';',l:'; semicolon'}].forEach(function(o){var opt=document.createElement('option');opt.value=o.v;opt.textContent=o.l;delimSel.appendChild(opt);});
    delimSel.value=delim;
    delimSel.addEventListener('change',function(e){
      e.stopPropagation();var oldDelim=delim;delim=delimSel.value;
      if(window._lb_compact_triggers){
        var cur=trigI.value.split(oldDelim).map(function(t){return t.trim();}).filter(Boolean);
        el._triggers=cur;trigI.value=cur.join(delim===','?', ':'; ');
        trigI.placeholder=delim===','?'keyword, another, etc.':'keyword; another; etc.';
      }
      scheduleSave();
    });

    var trigFieldWrap=document.createElement('div');trigFieldWrap.className='_lb_full';
    var trigLbl=document.createElement('label');trigLbl.className='_lb_lbl';trigLbl.style.marginBottom='0';trigLbl.textContent='Trigger Keywords';
    var trigLblRow=document.createElement('div');trigLblRow.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:4px';
    trigLblRow.appendChild(trigLbl);trigLblRow.appendChild(delimSel);

    if(window._lb_compact_triggers){
      trigFieldWrap.appendChild(trigLblRow);trigFieldWrap.appendChild(trigOuter);
    } else {
      var tagWrap=document.createElement('div');tagWrap.appendChild(tagRow);tagWrap.appendChild(trigCounter);
      trigFieldWrap.appendChild(trigLblRow);trigFieldWrap.appendChild(tagWrap);
    }

    // ── Suggestions tray ──
    var sugOffset=0;
    var phraseQueue=[];var phraseMode=false;var selectedPhraseIdx=-1;

    var sugTray=document.createElement('div');sugTray.className='_lb_sug_tray';sugTray.style.cssText='margin-top:6px';sugTray.style.display='none';
    var sugTrayHd=document.createElement('div');sugTrayHd.style.cssText='display:flex;align-items:center;justify-content:space-between;cursor:pointer;padding:3px 0;user-select:none';
    var sugTrayTitle=document.createElement('span');sugTrayTitle.style.cssText='font-size:.68rem;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;display:flex;align-items:center;gap:4px';
    var rerollBtn=document.createElement('button');rerollBtn.style.cssText='background:none;border:none;color:#4b5563;font-size:.9rem;cursor:pointer;padding:1px 3px;line-height:1;border-radius:3px;transition:color .15s';rerollBtn.textContent='\u21ba';rerollBtn.title='Show different suggestions';
    var phraseToggle=document.createElement('button');phraseToggle.style.cssText='padding:2px 8px;border-radius:10px;border:1px solid #374151;background:transparent;color:#6b7280;font-size:.68rem;cursor:pointer;font-family:system-ui,sans-serif;white-space:nowrap';phraseToggle.textContent='\uff0b Phrase';
    var trayRight=document.createElement('div');trayRight.style.cssText='display:flex;align-items:center;gap:5px';
    trayRight.appendChild(rerollBtn);trayRight.appendChild(phraseToggle);
    sugTrayHd.appendChild(sugTrayTitle);sugTrayHd.appendChild(trayRight);

    var sugTrayBody=document.createElement('div');sugTrayBody.style.cssText='overflow:hidden;transition:max-height .2s ease';
    var sugRow=document.createElement('div');sugRow.className='_lb_sug_row';sugRow.style.marginTop='4px';
    sugTrayBody.appendChild(sugRow);
    sugTray.appendChild(sugTrayHd);sugTray.appendChild(sugTrayBody);

    var trayCollapsed=!!window._lb_sugs_collapsed;
    function applyTrayState(){
      var icon=trayCollapsed?'\u25b8':'\u25be';
      sugTrayTitle.innerHTML='';
      var ic=document.createElement('span');ic.textContent=icon;
      var tx=document.createElement('span');tx.textContent='Trigger Word Suggestions';
      sugTrayTitle.appendChild(ic);sugTrayTitle.appendChild(tx);
      if(trayCollapsed){sugTrayBody.style.maxHeight='0';}
      else{sugTrayBody.style.maxHeight=sugTrayBody.scrollHeight+200+'px';}
    }
    sugTray._setCollapsed=function(v){trayCollapsed=!!v;applyTrayState();};
    applyTrayState();
    sugTrayHd.addEventListener('click',function(ev){
      if(ev.target===rerollBtn||ev.target===phraseToggle)return;
      trayCollapsed=!trayCollapsed;applyTrayState();
    });
    rerollBtn.addEventListener('click',function(ev){
      ev.stopPropagation();sugOffset+=12;
      rerollBtn.style.transform='rotate(360deg)';
      setTimeout(function(){rerollBtn.style.transform='';},300);
      renderSugs();
    });
    phraseToggle.addEventListener('click',function(ev){
      ev.stopPropagation();phraseMode=!phraseMode;
      phraseToggle.style.cssText=phraseMode
        ?'padding:2px 8px;border-radius:10px;border:1px solid #6ee7b7;background:#0d2618;color:#6ee7b7;font-size:.68rem;cursor:pointer;font-family:system-ui,sans-serif;white-space:nowrap'
        :'padding:2px 8px;border-radius:10px;border:1px solid #374151;background:transparent;color:#6b7280;font-size:.68rem;cursor:pointer;font-family:system-ui,sans-serif;white-space:nowrap';
      if(!phraseMode){phraseQueue=[];selectedPhraseIdx=-1;renderPhrasePills();renderSugs();}
    });

    // Phrase pill row
    var phrasePillRow=document.createElement('div');phrasePillRow.style.cssText='display:none;flex-wrap:wrap;gap:5px;margin-top:5px';
    var phraseActions=document.createElement('div');phraseActions.style.cssText='display:none;align-items:center;gap:6px;margin-top:5px';
    var phraseConfirm=document.createElement('button');phraseConfirm.style.cssText='font-size:.75rem;padding:3px 9px;border-radius:8px;border:1px solid #34d399;background:#0d2618;color:#34d399;cursor:pointer;font-family:system-ui,sans-serif';phraseConfirm.textContent='\u2713 Add phrase';
    var phraseCancel=document.createElement('button');phraseCancel.style.cssText='font-size:.75rem;padding:3px 9px;border-radius:8px;border:1px solid #374151;background:transparent;color:#6b7280;cursor:pointer;font-family:system-ui,sans-serif';phraseCancel.textContent='\u2715 Cancel';
    var phraseHint=document.createElement('span');phraseHint.style.cssText='font-size:.65rem;color:#4b5563';phraseHint.textContent='Click two words to swap';
    phraseActions.appendChild(phraseConfirm);phraseActions.appendChild(phraseCancel);phraseActions.appendChild(phraseHint);

    function renderPhrasePills(){
      phrasePillRow.innerHTML='';
      if(!phraseQueue.length){phrasePillRow.style.display='none';phraseActions.style.display='none';return;}
      phrasePillRow.style.display='flex';phraseActions.style.display='flex';
      phraseQueue.forEach(function(word,i){
        var pill=document.createElement('span');
        var isSel=selectedPhraseIdx===i;
        pill.style.cssText='display:inline-flex;align-items:center;gap:3px;background:'+(isSel?'#0a3d22':'#0d2618')+';border:1px solid '+(isSel?'#6ee7b7':'#334155')+';border-radius:10px;padding:2px 6px 2px 9px;font-size:.75rem;color:#6ee7b7;cursor:pointer;white-space:nowrap'+(isSel?';box-shadow:0 0 0 2px #6ee7b7':'');
        var ws=document.createElement('span');ws.textContent=word;
        var px=document.createElement('button');px.style.cssText='background:none;border:none;color:#34d399;font-size:.8rem;cursor:pointer;padding:0 0 0 2px;line-height:1';px.textContent='\u00d7';
        px.addEventListener('click',function(ev){
          ev.stopPropagation();phraseQueue.splice(i,1);
          if(selectedPhraseIdx>=phraseQueue.length)selectedPhraseIdx=-1;
          renderPhrasePills();
          if(!phraseQueue.length){phraseMode=false;phraseToggle.style.cssText='padding:2px 8px;border-radius:10px;border:1px solid #374151;background:transparent;color:#6b7280;font-size:.68rem;cursor:pointer;font-family:system-ui,sans-serif;white-space:nowrap';renderSugs();}
        });
        pill.addEventListener('click',function(ev){
          ev.stopPropagation();
          if(selectedPhraseIdx===-1){selectedPhraseIdx=i;}
          else if(selectedPhraseIdx===i){selectedPhraseIdx=-1;}
          else{var tmp=phraseQueue[selectedPhraseIdx];phraseQueue[selectedPhraseIdx]=phraseQueue[i];phraseQueue[i]=tmp;selectedPhraseIdx=-1;}
          renderPhrasePills();
        });
        pill.appendChild(ws);pill.appendChild(px);phrasePillRow.appendChild(pill);
      });
    }

    phraseConfirm.addEventListener('click',function(ev){
      ev.stopPropagation();
      var phrase=phraseQueue.join(' ').trim();
      if(phrase){
        if(window._lb_compact_triggers){
          var cur=trigI.value.trim();var s=delim===','?', ':'; ';
          trigI.value=cur?cur+s+phrase:phrase;
          el._triggers=trigI.value.split(delim).map(function(t){return t.trim();}).filter(Boolean);
        } else {
          if(el._triggers.indexOf(phrase)===-1&&el._triggers.length<25){el._triggers.push(phrase);renderTags();}
        }
        updTrigCounter();scheduleSave();
      }
      phraseQueue=[];selectedPhraseIdx=-1;phraseMode=false;
      phraseToggle.style.cssText='padding:2px 8px;border-radius:10px;border:1px solid #374151;background:transparent;color:#6b7280;font-size:.68rem;cursor:pointer;font-family:system-ui,sans-serif;white-space:nowrap';
      renderPhrasePills();renderSugs();
    });
    phraseCancel.addEventListener('click',function(ev){
      ev.stopPropagation();phraseQueue=[];selectedPhraseIdx=-1;phraseMode=false;
      phraseToggle.style.cssText='padding:2px 8px;border-radius:10px;border:1px solid #374151;background:transparent;color:#6b7280;font-size:.68rem;cursor:pointer;font-family:system-ui,sans-serif;white-space:nowrap';
      renderPhrasePills();renderSugs();
    });

    var _lastSugKey='';
    function renderSugs(){
      var nm=nameI.value.trim(),ty=typeS.value,de=descTA.value.trim();
      var sugKey=nm+'|'+ty+'|'+de+'|'+sugOffset+'|'+el._triggers.join('\0');
      if(sugKey===_lastSugKey)return;
      _lastSugKey=sugKey;
      var raw=getSuggestions(nm,ty,de);
      var existing=el._triggers.map(function(t){return t.toLowerCase();});
      var filtered=raw.filter(function(s){return existing.indexOf(s)===-1;});
      sugRow.innerHTML='';
      if(!filtered.length){sugTray.style.display='none';return;}
      sugTray.style.display='';
      if(sugOffset>=filtered.length)sugOffset=0;
      var page=filtered.slice(sugOffset,sugOffset+12);
      if(page.length<12&&filtered.length>12){
        var extra=filtered.slice(0,12-page.length).filter(function(s){return page.indexOf(s)===-1;});
        page=page.concat(extra);
      }
      if(!trayCollapsed)sugTrayBody.style.maxHeight=sugTrayBody.scrollHeight+200+'px';
      page.forEach(function(sug){
        var chip=document.createElement('button');chip.className='_lb_sug_chip';chip.textContent=sug;
        chip.addEventListener('click',function(ev){
          ev.stopPropagation();
          if(phraseMode){
            phraseQueue.push(sug);selectedPhraseIdx=-1;
            renderPhrasePills();chip.style.opacity='0.4';chip.style.pointerEvents='none';
          } else {
            if(window._lb_compact_triggers){
              var s=delim===','?', ':'; ';var cur=trigI.value.trim();
              trigI.value=cur?cur+s+sug:sug;
              el._triggers=trigI.value.split(delim).map(function(t){return t.trim();}).filter(Boolean);
            } else {
              if(el._triggers.indexOf(sug)===-1&&el._triggers.length<25){el._triggers.push(sug);renderTags();}
            }
            updTrigCounter();renderSugs();scheduleSave();
          }
        });
        sugRow.appendChild(chip);
      });
    }
    renderSugs();

    trigFieldWrap.appendChild(sugTray);
    trigFieldWrap.appendChild(phrasePillRow);
    trigFieldWrap.appendChild(phraseActions);

    grid.appendChild(fld('Entry Name',nameI));
    grid.appendChild(fld('Entry Type',typeS));
    grid.appendChild(trigFieldWrap);
    grid.appendChild(descWrap);
    ebody.appendChild(grid);
    el.appendChild(ehead);el.appendChild(ebody);

    el._gd=function(){
      return{name:nameI.value.trim(),type:typeS.value,triggers:el._triggers.slice(),description:descTA.value.trim(),delim:delim};
    };

    function updEnum(){
      var idx=Array.from(eDiv.querySelectorAll('._lb_entry')).indexOf(el)+1;
      var n=nameI.value.trim();
      enumEl.textContent='#'+idx+(n?': '+n:'');
      delete enumEl.dataset.origText;delete enumEl.dataset.hl;
      typeDot.style.background=TYPE_COLORS[typeS.value]||'#9ca3af';
      el.dataset.type=typeS.value;
      updStats();
    }
    updEnum();
    nameI.addEventListener('input',function(){updEnum();sugOffset=0;renderSugs();scheduleSave();});

    el.draggable=false;
    el.addEventListener('dragstart',function(e){
      e.dataTransfer.effectAllowed='move';
      e.dataTransfer.setData('text/plain',ec);
      el.classList.add('_lb_dragging');
      window._lb_drag=el;
    });
    el.addEventListener('dragend',function(){
      el.draggable=false;
      el.classList.remove('_lb_dragging');
      document.querySelectorAll('._lb_entry').forEach(function(e){e.classList.remove('_lb_dragover');});
      window._lb_drag=null;
      renumberEntries();
      scheduleSave();
    });
    el.addEventListener('dragover',function(e){
      e.preventDefault();e.stopPropagation();
      if(window._lb_drag&&window._lb_drag!==el){el.classList.add('_lb_dragover');}
    });
    el.addEventListener('dragleave',function(){el.classList.remove('_lb_dragover');});
    el.addEventListener('drop',function(e){
      e.preventDefault();e.stopPropagation();
      el.classList.remove('_lb_dragover');
      var src=window._lb_drag;
      if(src&&src!==el){
        var allEntries=Array.from(eDiv.querySelectorAll('._lb_entry'));
        var si=allEntries.indexOf(src);var ti=allEntries.indexOf(el);
        if(si<ti){el.after(src);}else{el.before(src);}
      }
    });
    trigI.addEventListener('input',function(){updTrigCounter();scheduleSave();});
    typeS.addEventListener('change',function(){updEnum();sugOffset=0;renderSugs();scheduleSave();applyFilter();});
    typeS.addEventListener('wheel',function(e){
      if(!e.shiftKey)return;
      e.preventDefault();e.stopPropagation();
      var dir=e.deltaY>0?1:-1;
      var next=(typeS.selectedIndex+dir+TYPES.length)%TYPES.length;
      typeS.selectedIndex=next;
      updEnum();sugOffset=0;renderSugs();scheduleSave();applyFilter();
    },{passive:false});
    descTA.addEventListener('input',function(){autoGrow();updCC();updStats();sugOffset=0;renderSugs();scheduleSave();var _q=searchInp.value.trim().toLowerCase();var _e=_q?regexEscape(_q):'';syncDescHl(_e?new RegExp('('+_e+')','gi'):null);});

    delBtn.addEventListener('click',function(e){e.stopPropagation();pushUndo();el.remove();scheduleSave();});
    colBtn.addEventListener('click',function(e){e.stopPropagation();var c=el.classList.toggle('_lb_collapsed');colBtn.textContent=c?'▼ Expand':'▲ Collapse';if(!c)setTimeout(autoGrow,0);});
    return el;
  }

  function addEntry(data){pushUndo();eDiv.appendChild(mkEntry(data));renumberEntries();scheduleSave();}

  function renumberEntries(){
    eDiv.querySelectorAll('._lb_entry').forEach(function(el,i){
      var enumEl=el.querySelector('._lb_enum');
      var inp=el.querySelector('._lb_inp');
      var sel=el.querySelector('._lb_sel');
      if(enumEl){
        var n=inp?inp.value.trim():'';
        enumEl.textContent='#'+(i+1)+(n?': '+n:'');
        delete enumEl.dataset.origText;delete enumEl.dataset.hl;
      }
      var dot=el.querySelector('._lb_type_dot');
      if(dot&&sel)dot.style.background=TYPE_COLORS[sel.value]||'#9ca3af';
    });
  }
