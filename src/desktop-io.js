
  // ── DESKTOP: Import/Export, Lorebook Switching & Event Wiring ───────────────
  function parseImportText(text){
    text=text.replace(/\r\n/g,'\n').replace(/\r/g,'\n').replace(/\*\*/g,'');
    var blocks=[];var TRIPLE=/^===\s*.+\s*===/;var KV_NAME=/^(?:Entry\s+)?(?:Name|Title|Label)\s*:/i;
    var lines=text.split('\n');var cur=null;
    lines.forEach(function(line){
      if(TRIPLE.test(line.trim())||KV_NAME.test(line)){if(cur!==null)blocks.push(cur);cur=[line];}
      else{if(cur!==null)cur.push(line);}
    });
    if(cur!==null)blocks.push(cur);
    return blocks.map(function(blines){
      var entry={name:'',type:'Character',triggers:[],description:'',delim:','};
      var descLines=[];var m;
      blines.forEach(function(line){
        if((m=line.trim().match(/^===\s*(.+?)\s*===$/)))                                       {entry.name=m[1].trim();return;}
        if((m=line.match(/^(?:Entry\s+)?(?:Name|Title|Label)\s*:\s*(.+)/i)))                   {entry.name=m[1].trim();return;}
        if((m=line.match(/^(?:Entry\s+)?(?:Type|Category|Kind|Classification)\s*:\s*(.+)/i)))  {entry.type=m[1].trim();return;}
        if((m=line.match(/^(?:Triggers?|Keywords?|Aliases?|Tags?|Keys?)\s*:\s*(.+)/i))){
          var raw=m[1];var semi=raw.indexOf(';')!==-1;
          entry.delim=semi?';':',';entry.triggers=raw.split(semi?';':',').map(function(t){return t.trim();}).filter(Boolean);
          return;
        }
        var dm=line.match(/^Description\s*:\s*(.*)/i);
        descLines.push(dm?dm[1]:line);
      });
      if(descLines.length)entry.description=descLines.join('\n').trim();
      return entry;
    }).filter(function(e){return e.name;});
  }
  function loadState(state){
    document.getElementById('_lb_nm').value=state.name||'';resizeNi();
    eDiv.innerHTML='';ec=0;
    var entries=state.entries||Object.values(state.entries_obj||{});
    entries.forEach(function(e){eDiv.appendChild(mkEntry(e));});
    renumberEntries();
  }


  currentLBKey=lbEnsureKey(null);
  updLBCount();
  try{
    var saved=currentLBKey&&localStorage.getItem(currentLBKey);
    if(saved){
      var parsed=JSON.parse(saved);
      if(parsed.name||(parsed.entries&&parsed.entries.length>0)){loadState(parsed);}
      else{addEntry();}
    } else {addEntry();}
  }catch(e){addEntry();}

  // Desktop lorebook switcher dropdown
  var lbSwitchBtn=document.createElement('button');
  lbSwitchBtn.id='_lb_lb_switcher';
  lbSwitchBtn.style.cssText='background:none;border:1px solid #374151;border-radius:6px;color:#9ca3af;font-size:.72rem;cursor:pointer;padding:4px 9px;font-family:system-ui,sans-serif;display:flex;align-items:center;gap:4px;white-space:nowrap;flex-shrink:0';
  lbSwitchBtn.innerHTML='📚 <span id="_lb_lb_count"></span>';
  lbSwitchBtn.title='Switch lorebook';
  hr.insertBefore(lbSwitchBtn,hr.firstChild);
  updLBCount();

  var lbDropdown=null;
  function openLBDropdown(){
    if(lbDropdown){lbDropdown.remove();lbDropdown=null;return;}
    lbDropdown=document.createElement('div');
    lbDropdown.style.cssText='position:fixed;background:#1f2937;border:1px solid #374151;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.5);z-index:2147483648;min-width:220px;overflow:hidden;font-family:system-ui,sans-serif';
    var rect=lbSwitchBtn.getBoundingClientRect();
    lbDropdown.style.top=(rect.bottom+6)+'px';lbDropdown.style.right=(window.innerWidth-rect.right)+'px';
    function renderDD(){
      lbDropdown.innerHTML='';
      lbIndex().forEach(function(slot){
        var isCur=slot.key===currentLBKey;
        var row=document.createElement('div');
        row.style.cssText='display:flex;align-items:center;padding:10px 14px;cursor:pointer;border-bottom:1px solid #374151;gap:8px'+(isCur?';background:#111827;border-left:3px solid #f87171':'');
        var info=document.createElement('div');info.style.cssText='flex:1;min-width:0';
        var nm=document.createElement('div');nm.style.cssText='font-size:.83rem;font-weight:600;color:#e5e7eb;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';nm.textContent=slot.name||'Untitled';
        var meta=document.createElement('div');meta.style.cssText='font-size:.68rem;color:#6b7280;margin-top:1px';
        var m=Math.round((Date.now()-slot.ts)/60000);
        meta.textContent=(isCur?'\u25cf Current \u00b7 ':'')+'Saved '+(m<1?'just now':m<60?m+'m ago':Math.round(m/60)+'h ago');
        info.appendChild(nm);info.appendChild(meta);
        var del=document.createElement('button');del.style.cssText='background:none;border:none;color:#4b5563;cursor:pointer;font-size:.9rem;padding:2px 4px;flex-shrink:0';
        del.textContent='\u{1F5D1}';
        del.addEventListener('click',function(e){
          e.stopPropagation();
          if(!confirm('Delete "'+slot.name+'"?'))return;
          localStorage.removeItem(slot.key);
          var idx2=lbIndex().filter(function(x){return x.key!==slot.key;});lbSaveIndex(idx2);
          if(isCur){
            lbDropdown.remove();lbDropdown=null;
            if(idx2.length){deskDoSwitch(idx2[0].key);}
            else{currentLBKey=lbNewKey();lbSaveIndex([{key:currentLBKey,name:'My Lorebook',ts:Date.now()}]);loadState({name:'',entries:[]});addEntry();}
          } else {updLBCount();renderDD();}
        });
        if(!isCur){
          row.addEventListener('click',function(){
            lbDropdown.remove();lbDropdown=null;deskPromptSave(slot.key);
          });
        }
        row.appendChild(info);row.appendChild(del);lbDropdown.appendChild(row);
      });
      var newRow=document.createElement('div');
      newRow.style.cssText='padding:10px 14px;cursor:pointer;color:#34d399;font-size:.83rem;font-weight:600;display:flex;align-items:center;gap:6px';
      newRow.textContent='+ New lorebook';
      newRow.addEventListener('click',function(){lbDropdown.remove();lbDropdown=null;deskPromptSave(null);});
      lbDropdown.appendChild(newRow);
    }
    renderDD();
    bx.appendChild(lbDropdown);
    setTimeout(function(){
      document.addEventListener('click',function closeDd(e){
        if(lbDropdown&&!lbDropdown.contains(e.target)&&e.target!==lbSwitchBtn){
          lbDropdown.remove();lbDropdown=null;document.removeEventListener('click',closeDd);
        }
      });
    },50);
  }
  lbSwitchBtn.addEventListener('click',function(e){e.stopPropagation();openLBDropdown();});

  function deskPromptSave(targetKey){
    var d=document.createElement('div');
    d.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:2147483649;display:flex;align-items:center;justify-content:center';
    var box=document.createElement('div');
    box.style.cssText='background:#1f2937;border:1px solid #4b5563;border-radius:14px;padding:24px 28px;max-width:380px;width:90%;font-family:system-ui,sans-serif';
    var h3=document.createElement('h3');h3.style.cssText='margin:0 0 8px;font-size:.95rem;color:#e5e7eb';h3.textContent='Save current lorebook?';
    var p=document.createElement('p');p.style.cssText='margin:0 0 16px;font-size:.82rem;color:#9ca3af;line-height:1.5';p.textContent='Download before switching to keep a copy?';
    var btns=document.createElement('div');btns.style.cssText='display:flex;flex-direction:column;gap:8px';
    function dismiss(){d.remove();}
    function mkBtn(txt,bg,fn){var b=document.createElement('button');b.style.cssText='padding:10px;border-radius:8px;font-size:.85rem;cursor:pointer;font-family:system-ui,sans-serif;border:1px solid;text-align:center;'+bg;b.textContent=txt;b.addEventListener('click',fn);return b;}
    function dlAndSwitch(getData,ext,mime){
      var n=(document.getElementById('_lb_nm').value.trim()||'lorebook').toLowerCase().replace(/\s+/g,'-');
      var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([getData()],{type:mime}));a.download=n+'.'+ext;a.click();
      dismiss();deskDoSwitch(targetKey);
    }
    btns.appendChild(mkBtn('\u2b07 Download .json first','background:#059669;border-color:#059669;color:#fff',function(){dlAndSwitch(buildJSON,'json','application/json');}));
    btns.appendChild(mkBtn('\u2b07 Download .txt first','background:transparent;border-color:#374151;color:#9ca3af',function(){dlAndSwitch(buildTXT,'txt','text/plain');}));
    btns.appendChild(mkBtn('Believe in autosave \u2014 just switch','background:#ef4444;border-color:#ef4444;color:#fff;font-weight:600',function(){dismiss();deskDoSwitch(targetKey);}));
    btns.appendChild(mkBtn('Cancel','background:transparent;border-color:#374151;color:#9ca3af',dismiss));
    box.appendChild(h3);box.appendChild(p);box.appendChild(btns);
    d.appendChild(box);bx.appendChild(d);
    d.addEventListener('click',function(e){if(e.target===d)dismiss();});
  }

  function deskDoSwitch(targetKey){
    saveNow();
    if(targetKey===null){
      var key=lbNewKey();var idx=lbIndex();
      idx.unshift({key:key,name:'New Lorebook',ts:Date.now()});
      if(idx.length>LB_MAX)idx=idx.slice(0,LB_MAX);
      lbSaveIndex(idx);currentLBKey=key;
      loadState({name:'',entries:[]});addEntry();
    } else {
      currentLBKey=targetKey;
      lbMoveToFront(targetKey);
      try{
        var sv=localStorage.getItem(targetKey);
        if(sv){loadState(JSON.parse(sv));}else{loadState({name:'',entries:[]});addEntry();}
      }catch(e){loadState({name:'',entries:[]});addEntry();}
    }
    updLBCount();switchTab('build');
  }


  var panels={build:pBuild,impexp:pImpExp,settings:pSettings};
  var tabs={build:tBuild,impexp:tImpExp,settings:tSettings};
  function switchTab(p){
    if(p==='conv'||p==='saveload')p='impexp';
    Object.keys(tabs).forEach(function(k){tabs[k].classList.remove('_on');panels[k].classList.remove('_on');});
    tabs[p].classList.add('_on');panels[p].classList.add('_on');
    searchFilterBar.style.display=p==='build'?'':'none';
  }
  tBuild.addEventListener('click',function(e){e.stopPropagation();switchTab('build');});
  tImpExp.addEventListener('click',function(e){e.stopPropagation();switchTab('impexp');});
  tSettings.addEventListener('click',function(e){e.stopPropagation();switchTab('settings');});
  aeBtn.addEventListener('click',function(e){e.stopPropagation();addEntry();});
  ni.addEventListener('input',function(){resizeNi();scheduleSave();});
  setTimeout(resizeNi,0);

  function buildJSON(){return lbBuildJSON(getState());}

  genBtn.addEventListener('click',function(e){e.stopPropagation();jout.value=buildJSON();});
  cpyBtn.addEventListener('click',function(e){
    e.stopPropagation();var j=buildJSON();jout.value=j;
    navigator.clipboard.writeText(j).then(function(){
      okSp.style.opacity='1';setTimeout(function(){okSp.style.opacity='0';},2000);
    });
  });
  dlBtn.addEventListener('click',function(e){
    e.stopPropagation();var j=buildJSON();
    var name=(document.getElementById('_lb_nm').value.trim()||'lorebook').toLowerCase().replace(/\s+/g,'-');
    var blob=new Blob([j],{type:'application/json'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name+'.json';a.click();
  });

  ibtn.addEventListener('click',function(e){
    e.stopPropagation();jerr.textContent='';
    var raw=jin.value.trim();var p;
    try{p=JSON.parse(raw);}catch(err){jerr.textContent='Invalid JSON: '+err.message;return;}
    if(!p.entries){jerr.textContent='No "entries" key found — is this a lorebook JSON?';return;}
    var entryArr=Array.isArray(p.entries)?p.entries:Object.values(p.entries);
    if(!entryArr.length){jerr.textContent='No entries found in this JSON.';return;}
    if(!confirm('Load this lorebook? Your current work will be replaced (export it first if needed).'))return;
    pushUndo();
    loadState({name:p.name,entries:entryArr});
    jin.value='';
    scheduleSave();
    switchTab('build');
  });

  clrBtn.addEventListener('click',function(e){
    e.stopPropagation();
    if(!confirm('Clear everything and start fresh?'))return;
    pushUndo();
    document.getElementById('_lb_nm').value='';resizeNi();eDiv.innerHTML='';ec=0;
    jin.value='';jout.value='';
    if(currentLBKey)localStorage.removeItem(currentLBKey);
    currentLBKey=lbNewKey();var ni=[{key:currentLBKey,name:'My Lorebook',ts:Date.now()}];lbSaveIndex(ni);
    addEntry();switchTab('build');
  });

  function parseTXT(text){
    var lorebookName='';
    var lnMatch=text.match(/^LOREBOOK:\s*(.+)/m);
    if(lnMatch)lorebookName=lnMatch[1].trim();
    var blocks=text.split(/(?=^===\s)/m).filter(function(b){return b.trim().startsWith('===');});
    if(!blocks.length){return{lorebookName:lorebookName,entries:parseImportText(text)};}
    var entries=blocks.map(function(block){
      var lines=block.split('\n');
      var nameLine=lines[0].replace(/^===\s*/,'').replace(/\s*===\s*$/,'').trim();
      var entry={name:nameLine,type:'Character',triggers:[],description:'',delim:','};
      var descLines=[];
      lines.slice(1).forEach(function(line){
        var tm=line.match(/^(?:Entry\s+)?(?:Type|Category|Kind|Classification)\s*:\s*(.+)/i);if(tm){entry.type=tm[1].trim();return;}
        var trm=line.match(/^(?:Triggers?|Keywords?|Aliases?|Tags?|Keys?)\s*:\s*(.+)/i);
        if(trm){
          var raw=trm[1];
          var usesSemi=raw.indexOf(';')!==-1;
          entry.delim=usesSemi?';':',';
          entry.triggers=raw.split(usesSemi?';':',').map(function(t){return t.trim();}).filter(Boolean);
          return;
        }
        var dm=line.match(/^Description\s*:\s*(.*)/i);
        descLines.push(dm?dm[1]:line);
      });
      entry.description=descLines.join('\n').trim();
      return entry;
    }).filter(function(e){return e.name;});
    return{lorebookName:lorebookName,entries:entries};
  }

  function showPreview(parsed){
    parseErr.textContent='';
    if(!parsed.entries||!parsed.entries.length){parseErr.textContent='No entries found. Does your file match the template format?';previewDiv.style.display='none';return;}
    previewList.innerHTML='';
    parsed.entries.forEach(function(e){
      var row=document.createElement('div');row.className='_lb_prev_entry';
      row.innerHTML='<div><span class="_lb_prev_name">'+e.name+'</span><span class="_lb_prev_type">'+e.type+'</span></div>'
        +'<div class="_lb_prev_trigs">Triggers: '+(e.triggers.join(', ')||'(none)')+'</div>'
        +'<div class="_lb_prev_desc">'+e.description.substring(0,120)+(e.description.length>120?'…':'')+'</div>';
      previewList.appendChild(row);
    });
    previewDiv.style.display='block';
    importPreviewBtn.style.display='block';
    importPreviewBtn._parsed=parsed;
  }

  importPreviewBtn.addEventListener('click',function(e){
    e.stopPropagation();
    var p=importPreviewBtn._parsed;if(!p)return;
    if(p.lorebookName)document.getElementById('_lb_nm').value=p.lorebookName;
    eDiv.innerHTML='';ec=0;
    p.entries.forEach(function(entry){eDiv.appendChild(mkEntry(entry));});
    previewDiv.style.display='none';importPreviewBtn.style.display='none';
    scheduleSave();
    switchTab('build');
  });

  function handleFile(file){
    parseErr.textContent='';previewDiv.style.display='none';importPreviewBtn.style.display='none';
    if(file.name.endsWith('.txt')){
      var r=new FileReader();
      r.onload=function(ev){try{showPreview(parseTXT(ev.target.result));}catch(err){parseErr.textContent='Parse error: '+err.message;}};
      r.readAsText(file);
    } else if(file.name.endsWith('.docx')){
      var r2=new FileReader();
      r2.onload=function(ev){
        var buf=ev.target.result;
        if(typeof mammoth==='undefined'){
          var s=document.createElement('script');
          s.src='https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
          s.onload=function(){doMammoth(buf);};
          s.onerror=function(){parseErr.textContent='Could not load .docx parser. Try saving as .txt instead.';};
          document.head.appendChild(s);
        } else {doMammoth(buf);}
      };
      r2.readAsArrayBuffer(file);
    } else {parseErr.textContent='Unsupported file type. Use .txt or .docx';}
  }

  function doMammoth(buf){
    mammoth.extractRawText({arrayBuffer:buf}).then(function(result){
      try{showPreview(parseTXT(result.value));}
      catch(err){parseErr.textContent='Parse error: '+err.message;}
    }).catch(function(err){parseErr.textContent='Could not read .docx: '+err.message;});
  }

  dropZone.addEventListener('click',function(e){e.stopPropagation();fileInp.click();});
  fileInp.addEventListener('change',function(){if(fileInp.files[0])handleFile(fileInp.files[0]);});
  dropZone.addEventListener('dragover',function(e){e.preventDefault();e.stopPropagation();dropZone.classList.add('_drag');});
  dropZone.addEventListener('dragleave',function(e){e.stopPropagation();dropZone.classList.remove('_drag');});
  dropZone.addEventListener('drop',function(e){e.preventDefault();e.stopPropagation();dropZone.classList.remove('_drag');if(e.dataTransfer.files[0])handleFile(e.dataTransfer.files[0]);});

  xb.addEventListener('click',function(){
    var bxEl=document.getElementById('_lb_bx');
    if(bxEl)bxEl.remove();
    var s=document.getElementById('_lb_st');if(s)s.remove();
    document.getElementById('_lb_install').style.display='';
    document.removeEventListener('keydown',hotkeyHandler);
  });
  bx.addEventListener('click',function(e){e.stopPropagation();});





  function buildTXT(){return lbBuildTXT(getState());}
  function downloadDOCX(filename,okEl){lbDownloadDOCX(getState(),filename,okEl);}

  function hotkeyHandler(e){
    var isMac=(navigator.platform||navigator.userAgentData&&navigator.userAgentData.platform||'').toLowerCase().indexOf('mac')!==-1;
    var ctrl=isMac?e.metaKey:e.ctrlKey;
    if(ctrl&&!e.altKey&&e.key==='z'&&document.getElementById('_lb_bx')){
      e.preventDefault();if(e.shiftKey)doRedo();else doUndo();return;
    }
    if(ctrl&&!e.altKey&&!e.shiftKey&&e.key==='y'&&document.getElementById('_lb_bx')){
      e.preventDefault();doRedo();return;
    }
    if(e.altKey&&e.key===(window._lb_hotkey_new||'n')&&document.getElementById('_lb_bx')){
      e.preventDefault();
      addEntryAndFocus();
    }
  }
  document.addEventListener('keydown',hotkeyHandler);
}

