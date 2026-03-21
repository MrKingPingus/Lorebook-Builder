
  // ── MOBILE: Import/Export, Lorebook Switching & Navigation ───────────────
  var panels={build:pBuild,impexp:pConv,settings:pSettings};
  function switchTab(t){
    closeFabMenu();
    Object.keys(panels).forEach(function(k){
      panels[k].classList.toggle('active',k===t);
      navBtns[k].classList.toggle('active',k===t);
    });
    fab.style.display=t==='build'?'flex':'none';
  }

  xbtn.addEventListener('click',function(){
    app.remove();
    var s=document.getElementById('_lbm_st');if(s)s.remove();
    document.getElementById('_lb_install').style.display='';
  });

  function buildJSON(){return lbBuildJSON(getState());}

  genBtn.addEventListener('click',function(){jout.value=buildJSON();});
  cpyBtn.addEventListener('click',function(){
    var j=buildJSON();jout.value=j;
    navigator.clipboard.writeText(j).then(function(){
      okMsg.textContent='Copied!';setTimeout(function(){okMsg.textContent='';},2000);
    });
  });
  dlJsonBtn.addEventListener('click',function(){
    var j=buildJSON();
    var name=(nameInp.value.trim()||'lorebook').toLowerCase().replace(/\s+/g,'-');
    var blob=new Blob([j],{type:'application/json'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name+'.json';a.click();
  });

  // ── Template export helpers ──
  function buildTXT(){return lbBuildTXT(getState());}

  function downloadDOCX(filename){lbDownloadDOCX(getState(),filename,exOk);}

  dlTxtBtn2.addEventListener('click',function(){
    var txt=buildTXT();
    var name=(nameInp.value.trim()||'lorebook').toLowerCase().replace(/\s+/g,'-');
    var blob=new Blob([txt],{type:'text/plain'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name+'.txt';a.click();
    exOk.textContent='✓ Downloaded!';setTimeout(function(){exOk.textContent='';},2000);
  });

  dlDocxBtn2.addEventListener('click',function(){
    var name=(nameInp.value.trim()||'lorebook').toLowerCase().replace(/\s+/g,'-');
    downloadDOCX(name+'.docx');
  });


  loadBtn.addEventListener('click',function(){
    jerr.textContent='';
    var raw=jin.value.trim();var p;
    try{p=JSON.parse(raw);}catch(err){jerr.textContent='Invalid JSON: '+err.message;return;}
    if(!p.entries){jerr.textContent='No "entries" key found.';return;}
    var arr=Array.isArray(p.entries)?p.entries:Object.values(p.entries);
    if(!arr.length){jerr.textContent='No entries found.';return;}
    if(!confirm('Load this lorebook? Current work will be replaced.'))return;
    loadState({name:p.name,entries:arr});
    jin.value='';
    switchTab('build');
  });

  clearBtn.addEventListener('click',function(){
    if(!confirm('Clear everything and start fresh?'))return;
    nameInp.value='';entriesDiv.innerHTML='';entries={};entryOrder=[];nextId=1;
    jin.value='';jout.value='';
    localStorage.removeItem(LS_KEY);
    updateEmpty();switchTab('build');
  });

  nameInp.addEventListener('input',scheduleSave);

  dlTxtBtn.addEventListener('click',function(){
    var b=new Blob([TPL_TXT],{type:'text/plain'});
    var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='lorebook-template.txt';a.click();
  });
  dlDocxBtn.addEventListener('click',function(){
    var bin=atob(TPL_DOCX_B64);var arr=new Uint8Array(bin.length);
    for(var i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
    var b=new Blob([arr],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
    var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='lorebook-template.docx';a.click();
  });

  dropZone.addEventListener('click',function(){fileInp.click();});
  fileInp.addEventListener('change',function(){if(fileInp.files[0])handleFile(fileInp.files[0]);});
  dropZone.addEventListener('dragover',function(e){e.preventDefault();dropZone.classList.add('drag');});
  dropZone.addEventListener('dragleave',function(){dropZone.classList.remove('drag');});
  dropZone.addEventListener('drop',function(e){e.preventDefault();dropZone.classList.remove('drag');if(e.dataTransfer.files[0])handleFile(e.dataTransfer.files[0]);});

  function parseTXT(text){
    var lorebookName='';
    var lnMatch=text.match(/^LOREBOOK:\s*(.+)/m);
    if(lnMatch)lorebookName=lnMatch[1].trim();
    var blocks=text.split(/(?=^===\s)/m).filter(function(b){return b.trim().startsWith('===');});
    if(!blocks.length){return{lorebookName:lorebookName,entries:parseImportText(text)};}
    var result=blocks.map(function(block){
      var lines=block.split('\n');
      var name=lines[0].replace(/^===\s*/,'').replace(/\s*===\s*$/,'').trim();
      var entry={name:name,type:'Character',triggers:[],description:'',delim:','};
      var descLines=[];
      lines.slice(1).forEach(function(line){
        var tm=line.match(/^(?:Entry\s+)?(?:Type|Category|Kind|Classification)\s*:\s*(.+)/i);if(tm){entry.type=tm[1].trim();return;}
        var trm=line.match(/^(?:Triggers?|Keywords?|Aliases?|Tags?|Keys?)\s*:\s*(.+)/i);
        if(trm){var raw=trm[1];var semi=raw.indexOf(';')!==-1;entry.delim=semi?';':',';entry.triggers=raw.split(semi?';':',').map(function(t){return t.trim();}).filter(Boolean);return;}
        var dm=line.match(/^Description\s*:\s*(.*)/i);
        descLines.push(dm?dm[1]:line);
      });
      entry.description=descLines.join('\n').trim();
      return entry;
    }).filter(function(e){return e.name;});
    return{lorebookName:lorebookName,entries:result};
  }

  function showPreview(parsed){
    parseErr.textContent='';
    if(!parsed.entries.length){parseErr.textContent='No entries found. Check your file format.';return;}
    previewList.innerHTML='';
    parsed.entries.forEach(function(e){
      var c=document.createElement('div');c.className='_lbm_preview_card';
      c.style.borderLeftColor=TYPE_COLORS[e.type]||'#334155';
      c.innerHTML='<div class="_lbm_preview_name">'+e.name+' <span style="color:#64748b;font-weight:400">'+e.type+'</span></div>'
        +'<div class="_lbm_preview_trigs">'+(e.triggers.join(', ')||'(no triggers)')+'</div>'
        +'<div class="_lbm_preview_desc">'+e.description.substring(0,100)+(e.description.length>100?'…':'')+'</div>';
      previewList.appendChild(c);
    });
    previewList.style.display='block';
    importBtn.style.display='block';
    importBtn._parsed=parsed;
  }

  importBtn.addEventListener('click',function(){
    var p=importBtn._parsed;if(!p)return;
    if(p.lorebookName)nameInp.value=p.lorebookName;
    entriesDiv.innerHTML='';entries={};entryOrder=[];nextId=1;
    p.entries.forEach(function(e){addEntry(e);});
    previewList.style.display='none';importBtn.style.display='none';
    scheduleSave();switchTab('build');
  });

  function handleFile(file){
    parseErr.textContent='';previewList.style.display='none';importBtn.style.display='none';
    if(file.name.endsWith('.txt')){
      var r=new FileReader();
      r.onload=function(ev){try{showPreview(parseTXT(ev.target.result));}catch(err){parseErr.textContent='Parse error: '+err.message;}};
      r.readAsText(file);
    } else if(file.name.endsWith('.docx')){
      var r2=new FileReader();
      r2.onload=function(ev){
        var buf=ev.target.result;
        if(typeof mammoth==='undefined'){
          var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
          s.onload=function(){mammoth.extractRawText({arrayBuffer:buf}).then(function(res){try{showPreview(parseTXT(res.value));}catch(err){parseErr.textContent='Parse error: '+err.message;}});};
          s.onerror=function(){parseErr.textContent='Could not load .docx parser. Try .txt instead.';};
          document.head.appendChild(s);
        } else {mammoth.extractRawText({arrayBuffer:buf}).then(function(res){try{showPreview(parseTXT(res.value));}catch(err){parseErr.textContent='Parse error: '+err.message;}});}
      };
      r2.readAsArrayBuffer(file);
    } else {parseErr.textContent='Unsupported file type. Use .txt or .docx';}
  }

  function loadState(state){
    nameInp.value=state.name||'';
    entriesDiv.innerHTML='';entries={};entryOrder=[];nextId=1;
    var arr=state.entries||[];
    arr.forEach(function(e){addEntry(e);});
    updateEmpty();
  }

  currentLBKey=lbEnsureKey(currentLBKey);updLBBtn();
  var _initState=lbLoadState(currentLBKey);
  if(_initState&&(_initState.name||(_initState.entries&&_initState.entries.length>0))){loadState(_initState);}
  else{updateEmpty();}

  var lbSheet=document.createElement('div');lbSheet.id='_lbm_lb_sheet';
  var lbSheetHd=document.createElement('div');lbSheetHd.id='_lbm_lb_sheet_hd';
  var lbSheetTitle=document.createElement('h3');lbSheetTitle.textContent='My Lorebooks';
  var lbSheetClose=document.createElement('button');
  lbSheetClose.style.cssText='background:none;border:none;color:#6b7280;font-size:1.3rem;cursor:pointer;padding:4px;line-height:1';
  lbSheetClose.textContent='\u2715';lbSheetClose.addEventListener('click',closeLBSheet);
  lbSheetHd.appendChild(lbSheetTitle);lbSheetHd.appendChild(lbSheetClose);
  var lbSheetBody=document.createElement('div');lbSheetBody.id='_lbm_lb_sheet_body';
  lbSheet.appendChild(lbSheetHd);lbSheet.appendChild(lbSheetBody);
  app.appendChild(lbSheet);

  function openLBSheet(){renderLBSheet();lbSheet.classList.add('open');document.addEventListener('click',closeLBSheetOut,{once:true});}
  function closeLBSheet(){lbSheet.classList.remove('open');}
  function closeLBSheetOut(e){if(!lbSheet.contains(e.target))closeLBSheet();}
  function agoFmt(ts){var m=Math.round((Date.now()-ts)/60000);return m<1?'just now':m<60?m+'m ago':Math.round(m/60)+'h ago';}

  function renderLBSheet(){
    lbSheetBody.innerHTML='';
    lbIndex().forEach(function(slot){
      var isCur=slot.key===currentLBKey;
      var item=document.createElement('div');item.className='_lbm_lb_item'+(isCur?' current':'');
      var info=document.createElement('div');info.className='_lbm_lb_item_info';
      var nm=document.createElement('div');nm.className='_lbm_lb_item_name';nm.textContent=slot.name||'Untitled';
      var meta=document.createElement('div');meta.className='_lbm_lb_item_meta';
      meta.textContent=(isCur?'\u25cf Current \u00b7 ':'')+'Saved '+agoFmt(slot.ts);
      info.appendChild(nm);info.appendChild(meta);
      var del=document.createElement('button');del.className='_lbm_lb_item_del';del.textContent='\u{1F5D1}';del.title='Delete';
      del.addEventListener('click',function(e){
        e.stopPropagation();
        if(!confirm('Delete "'+slot.name+'"?'))return;
        localStorage.removeItem(slot.key);
        var idx2=lbIndex().filter(function(x){return x.key!==slot.key;});lbSaveIndex(idx2);
        if(isCur){
          if(idx2.length){doSwitch(idx2[0].key);}
          else{currentLBKey=lbNewKey();lbSaveIndex([{key:currentLBKey,name:'My Lorebook',ts:Date.now()}]);loadState({name:'',entries:[]});updateEmpty();}
        }
        updLBBtn();renderLBSheet();
      });
      if(!isCur){item.addEventListener('click',function(){closeLBSheet();promptSaveBeforeSwitch(slot.key);});}
      item.appendChild(info);item.appendChild(del);lbSheetBody.appendChild(item);
    });
    var newBtn=document.createElement('button');newBtn.id='_lbm_lb_new';newBtn.textContent='+ New lorebook';
    newBtn.addEventListener('click',function(){closeLBSheet();promptSaveBeforeSwitch(null);});
    lbSheetBody.appendChild(newBtn);
  }

  function promptSaveBeforeSwitch(targetKey){
    var prompt=document.createElement('div');prompt.id='_lbm_save_prompt';
    var box=document.createElement('div');box.id='_lbm_save_prompt_box';
    var h3=document.createElement('h3');h3.textContent='Save current lorebook?';
    var p=document.createElement('p');p.textContent='Download before switching to keep a copy?';
    var btns=document.createElement('div');btns.id='_lbm_save_prompt_btns';
    function dismiss(){prompt.remove();}
    function dlAndSwitch(getData,ext,mime){
      var n=(nameInp.value.trim()||'lorebook').toLowerCase().replace(/\s+/g,'-');
      var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([getData()],{type:mime}));a.download=n+'.'+ext;a.click();
      dismiss();doSwitch(targetKey);
    }
    var b1=document.createElement('button');b1.className='_lbm_sp_btn green';b1.textContent='\u2b07 Download .json first';
    b1.addEventListener('click',function(){dlAndSwitch(buildJSON,'json','application/json');});
    var b2=document.createElement('button');b2.className='_lbm_sp_btn';b2.textContent='\u2b07 Download .txt first';
    b2.addEventListener('click',function(){dlAndSwitch(buildTXT,'txt','text/plain');});
    var b3=document.createElement('button');b3.className='_lbm_sp_btn primary';b3.textContent='Believe in autosave \u2014 just switch';
    b3.addEventListener('click',function(){dismiss();doSwitch(targetKey);});
    var b4=document.createElement('button');b4.className='_lbm_sp_btn';b4.textContent='Cancel';
    b4.addEventListener('click',dismiss);
    btns.appendChild(b1);btns.appendChild(b2);btns.appendChild(b3);btns.appendChild(b4);
    box.appendChild(h3);box.appendChild(p);box.appendChild(btns);prompt.appendChild(box);app.appendChild(prompt);
    prompt.addEventListener('click',function(e){if(e.target===prompt)dismiss();});
  }

  function doSwitch(targetKey){
    saveNow();
    if(targetKey===null){
      var key=lbNewKey();var idx=lbIndex();
      idx.unshift({key:key,name:'New Lorebook',ts:Date.now()});
      if(idx.length>LB_MAX)idx=idx.slice(0,LB_MAX);
      lbSaveIndex(idx);currentLBKey=key;loadState({name:'',entries:[]});updateEmpty();
    }else{
      currentLBKey=targetKey;
      lbMoveToFront(targetKey);
      var sv=lbLoadState(targetKey);
      if(sv){loadState(sv);}else{loadState({name:'',entries:[]});updateEmpty();}
    }
    updLBBtn();switchTab('build');
  }

}



