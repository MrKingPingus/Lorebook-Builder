// ── DESKTOP BUILDER ────────────────────────────────────────────────────────
function launchBuilder(){
  if(!IS_MOBILE){var EX=document.getElementById('_lb_bx');if(EX){EX.remove();var es=document.getElementById('_lb_st');if(es)es.remove();return;}}
  var currentLBKey=null;
  var TYPES=['Character','Item','PlotEvent','Location','Other'];
  var TYPE_COLORS={Character:'#c084fc',Item:'#60a5fa',Location:'#fbbf24',PlotEvent:'#f87171',Other:'#0d9488'};

  var CSS=_DESKTOP_CSS;

  var st=document.createElement('style');st.id='_lb_st';st.textContent=CSS;document.head.appendChild(st);
  var ov=document.createElement('div');ov.id='_lb_ov';
  var bx=document.createElement('div');bx.id='_lb_bx';

  var hd=document.createElement('div');hd.id='_lb_hd';
  var ttl=document.createElement('h2');ttl.textContent='📖 LOREBOOK BUILDER';
  var hr=document.createElement('div');hr.style.cssText='display:flex;align-items:center;gap:10px';
  var tbr=document.createElement('div');tbr.className='_lb_tabbar';
  function mkTab(label,panel,active){var t=document.createElement('button');t.className='_lb_tab'+(active?' _on':'');t.textContent=label;t.dataset.p=panel;return t;}
  var tBuild=mkTab('Build','build',true);
  var tImpExp=mkTab('Import / Export','impexp',false);
  var tSettings=mkTab('Settings','settings',false);
  tbr.appendChild(tBuild);tbr.appendChild(tImpExp);tbr.appendChild(tSettings);
  var saveBadge=document.createElement('span');saveBadge.id='_lb_savebadge';saveBadge.textContent='✓ Saved';
  var xb=document.createElement('button');xb.id='_lb_xb';xb.textContent='✕';
  hr.appendChild(tbr);hr.appendChild(saveBadge);hr.appendChild(xb);
  var ni=document.createElement('input');ni.type='text';ni.id='_lb_nm';ni.placeholder='My Lorebook';
  var niMirror=document.createElement('span');niMirror.style.cssText='visibility:hidden;position:absolute;white-space:pre;font-size:.85rem;font-family:system-ui,sans-serif;padding:3px 6px;pointer-events:none';
  hd.appendChild(niMirror);
  function resizeNi(){niMirror.textContent=ni.value||ni.placeholder;ni.style.width=Math.max(60,Math.min(niMirror.offsetWidth+4,300))+'px';}
  hd.appendChild(ttl);hd.appendChild(ni);hd.appendChild(hr);

  var bd=document.createElement('div');bd.id='_lb_bd';

  var pBuild=document.createElement('div');pBuild.id='_lb_p_build';pBuild.className='_lb_pnl _on';
  var restoreBanner=document.createElement('div');restoreBanner.className='_lb_restore_banner';restoreBanner.style.display='none';
  var restoreMsg=document.createElement('p');
  var restoreActions=document.createElement('div');restoreActions.style.cssText='display:flex;gap:8px;flex-shrink:0';
  var restoreYes=document.createElement('button');restoreYes.className='_lb_btn _lb_btng';restoreYes.style.padding='5px 12px';restoreYes.textContent='Restore';
  var restoreNo=document.createElement('button');restoreNo.className='_lb_btn _lb_btns';restoreNo.style.padding='5px 12px';restoreNo.textContent='Discard';
  restoreActions.appendChild(restoreYes);restoreActions.appendChild(restoreNo);
  restoreBanner.appendChild(restoreMsg);restoreBanner.appendChild(restoreActions);
  var eDiv=document.createElement('div');eDiv.id='_lb_entries';

  var searchWrap=document.createElement('div');searchWrap.style.cssText='margin-bottom:10px';
  var searchTopRow=document.createElement('div');searchTopRow.style.cssText='display:flex;gap:6px;align-items:center';
  var searchInp=document.createElement('input');searchInp.type='text';searchInp.id='_lb_search';searchInp.placeholder='Search entries...';
  searchInp.style.cssText='width:100%;background:#111827;border:1px solid #374151;border-radius:6px;color:#e5e7eb;padding:6px 28px 6px 10px;font-size:.83rem;outline:none;font-family:system-ui,sans-serif';
  var searchClearBtn=document.createElement('button');searchClearBtn.className='_lb_search_clear';searchClearBtn.textContent='×';searchClearBtn.title='Clear search';
  searchClearBtn.addEventListener('click',function(e){e.stopPropagation();searchInp.value='';searchClearBtn.style.display='none';applyFilter();searchInp.focus();});
  var searchInpWrap=document.createElement('div');searchInpWrap.className='_lb_search_inp_wrap';
  searchInpWrap.appendChild(searchInp);searchInpWrap.appendChild(searchClearBtn);
  var searchMode=document.createElement('select');
  searchMode.style.cssText='background:#111827;border:1px solid #374151;border-radius:6px;color:#9ca3af;padding:6px 8px;font-size:.75rem;outline:none;font-family:system-ui,sans-serif;cursor:pointer';
  var smSearch=document.createElement('option');smSearch.value='search';smSearch.textContent='Search';
  var smFnR=document.createElement('option');smFnR.value='fnr';smFnR.textContent='Find & Replace';
  searchMode.appendChild(smSearch);searchMode.appendChild(smFnR);
  searchTopRow.appendChild(searchInpWrap);searchTopRow.appendChild(searchMode);
  var replaceRow=document.createElement('div');replaceRow.style.cssText='display:none;gap:6px;margin-top:6px;align-items:center';
  var replaceInp=document.createElement('input');replaceInp.type='text';
  replaceInp.style.cssText='flex:1;background:#111827;border:1px solid #374151;border-radius:6px;color:#e5e7eb;padding:6px 10px;font-size:.83rem;outline:none;font-family:system-ui,sans-serif';
  replaceInp.placeholder='Replace with...';
  var replaceAllBtn=document.createElement('button');replaceAllBtn.className='_lb_btn _lb_btnp';replaceAllBtn.style.cssText='padding:5px 12px;font-size:.78rem;white-space:nowrap;opacity:.5;cursor:default';
  replaceAllBtn.textContent='Replace All';replaceAllBtn.disabled=true;
  var matchCountEl=document.createElement('span');matchCountEl.style.cssText='font-size:.72rem;color:#6b7280;white-space:nowrap';
  replaceRow.appendChild(replaceInp);replaceRow.appendChild(replaceAllBtn);replaceRow.appendChild(matchCountEl);
  searchWrap.appendChild(searchTopRow);searchWrap.appendChild(replaceRow);
  var goBtn=document.createElement('button');goBtn.style.display='none';
  var searchRow=searchWrap;

  try{var s_ed0=localStorage.getItem('_lb_expand_default');window._lb_expand_default=(s_ed0==='1');}catch(e){window._lb_expand_default=false;}
  var filterBar=document.createElement('div');filterBar.id='_lb_filterbar';
  var filterLabel=document.createElement('span');filterLabel.style.cssText='font-size:.7rem;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;flex-shrink:0';filterLabel.textContent='Filter:';
  var filterBtns=document.createElement('div');filterBtns.style.cssText='display:flex;gap:4px;flex-wrap:wrap;align-items:center';
  var shiftHint=document.createElement('span');shiftHint.style.cssText='font-size:.68rem;color:#4b5563';shiftHint.textContent='Shift+click for multi';

  var activeFilters=new Set(['All']);
  ['All'].concat(TYPES).forEach(function(type){
    var fb=document.createElement('button');fb.className='_lb_fbtn'+(type==='All'?' _on':'');
    fb.textContent=type;fb.dataset.type=type;
    fb.addEventListener('click',function(e){
      e.stopPropagation();
      if(e.shiftKey){
        if(type==='All'){activeFilters=new Set(['All']);}
        else{
          activeFilters.delete('All');
          if(activeFilters.has(type)){activeFilters.delete(type);}else{activeFilters.add(type);}
          if(activeFilters.size===0)activeFilters.add('All');
        }
      } else {activeFilters=new Set([type]);}
      filterBar.querySelectorAll('._lb_fbtn').forEach(function(b){b.classList.toggle('_on',activeFilters.has(b.dataset.type));});
      applyFilter();
    });
    filterBtns.appendChild(fb);
  });
  var groupBtn=document.createElement('button');groupBtn.className='_lb_btn _lb_btns';groupBtn.style.cssText='padding:3px 10px;font-size:.73rem';groupBtn.textContent='Group by type';
  var colAllBtn=document.createElement('button');colAllBtn.className='_lb_btn _lb_btns';colAllBtn.style.cssText='padding:3px 10px;font-size:.73rem';colAllBtn.textContent=window._lb_expand_default?'Collapse All':'Expand All';
  colAllBtn.addEventListener('click',function(e){
    e.stopPropagation();
    var entries=Array.from(eDiv.querySelectorAll('._lb_entry'));
    var collapse=!entries.every(function(el){return el.classList.contains('_lb_collapsed');});
    entries.forEach(function(el){
      el.classList.toggle('_lb_collapsed',collapse);
      var cb=el.querySelector('._lb_ebtn');if(cb)cb.textContent=collapse?'▼ Expand':'▲ Collapse';
    });
    colAllBtn.textContent=collapse?'Expand All':'Collapse All';
  });
  var filterRight=document.createElement('div');filterRight.className='_lb_filter_right';
  filterRight.appendChild(groupBtn);filterRight.appendChild(colAllBtn);
  filterBar.appendChild(filterLabel);filterBar.appendChild(filterBtns);filterBar.appendChild(shiftHint);filterBar.appendChild(filterRight);

  var aeBtn=document.createElement('button');aeBtn.id='_lb_ae';aeBtn.className='_lb_btn _lb_btns';aeBtn.textContent='+ Add Entry';
  var searchFilterBar=document.createElement('div');searchFilterBar.id='_lb_searchbar';
  var searchBarInner=document.createElement('div');searchBarInner.id='_lb_searchbar_inner';
  searchBarInner.appendChild(searchRow);searchBarInner.appendChild(filterBar);
  var searchBarTab=document.createElement('div');searchBarTab.id='_lb_searchbar_tab';
  searchBarTab.innerHTML='<span></span>';
  var sbCollapsed=false;
  searchBarTab.addEventListener('click',function(){sbCollapsed=!sbCollapsed;searchBarInner.style.display=sbCollapsed?'none':'';});
  searchFilterBar.appendChild(searchBarInner);searchFilterBar.appendChild(searchBarTab);
  pBuild.appendChild(restoreBanner);pBuild.appendChild(eDiv);

  var TPL_TXT="LOREBOOK: My Lorebook Name\n\n--- DELETE FROM HERE ---\nInstructions: Replace \"My Lorebook Name\" above with your lorebook title.\nCopy the entry block below to add more entries.\nValid Type values: Character, Item, PlotEvent, Location, Other\nTriggers note: separate triggers with commas by default. If any trigger contains a comma, use semicolons instead (e.g. \"sword of light; old, rusted blade\" would need semicolons).\n\n=== Example Character ===\nType: Character\nTriggers: example, sample character, test name\nDescription: Write your entry description here. Up to 1500 characters.\n\n=== Example Location ===\nType: Location\nTriggers: the keep, northern fortress\nDescription: A frost-covered fortress in the northern cliffs.\n--- TO HERE ---\n\n=== Your Entry Name Here ===\nType: Character\nTriggers: trigger one, trigger two\nDescription: Your description here.";
  var TPL_DOCX_B64="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";

  var pImpExp=document.createElement('div');pImpExp.id='_lb_p_impexp';pImpExp.className='_lb_pnl';
  var impSecHead=document.createElement('p');impSecHead.className='_lb_section_label';impSecHead.style.cssText='font-size:.7rem;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin:0 0 10px';impSecHead.textContent='Import';

  var tplStrip=document.createElement('div');tplStrip.className='_lb_section_box';tplStrip.style.marginBottom='14px';
  var tplLabel=document.createElement('p');tplLabel.className='_lb_section_label';tplLabel.textContent='Step 1 — Download a template';
  var tplDesc=document.createElement('p');tplDesc.className='_lb_section_desc';tplDesc.style.marginBottom='8px';tplDesc.textContent='Fill it out in any text editor or Word, then upload it below.';
  var tplBtns=document.createElement('div');tplBtns.style.cssText='display:flex;gap:8px;flex-wrap:wrap';
  var dlTxt=document.createElement('button');dlTxt.className='_lb_btn _lb_btns';dlTxt.textContent='⬇ .txt template';
  var dlDocx=document.createElement('button');dlDocx.className='_lb_btn _lb_btns';dlDocx.textContent='⬇ .docx template';
  tplBtns.appendChild(dlTxt);tplBtns.appendChild(dlDocx);
  tplStrip.appendChild(tplLabel);tplStrip.appendChild(tplDesc);tplStrip.appendChild(tplBtns);

  dlTxt.addEventListener('click',function(e){
    e.stopPropagation();
    var b=new Blob([TPL_TXT],{type:'text/plain'});
    var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='lorebook-template.txt';a.click();
  });
  dlDocx.addEventListener('click',function(e){
    e.stopPropagation();
    var bin=atob(TPL_DOCX_B64);var arr=new Uint8Array(bin.length);
    for(var i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
    var b=new Blob([arr],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
    var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='lorebook-template.docx';a.click();
  });

  var upLabel=document.createElement('p');upLabel.className='_lb_section_label';upLabel.style.marginBottom='6px';upLabel.textContent='Step 2 — Upload your filled template';
  var dropZone=document.createElement('div');dropZone.className='_lb_conv_drop';
  var dropTxt=document.createElement('p');dropTxt.textContent='Drop a .txt or .docx file here, or click to browse';
  var fileInp=document.createElement('input');fileInp.type='file';fileInp.accept='.txt,.docx';fileInp.style.display='none';
  dropZone.appendChild(dropTxt);dropZone.appendChild(fileInp);
  var parseErr=document.createElement('div');parseErr.className='_lb_parse_err';
  var previewDiv=document.createElement('div');previewDiv.id='_lb_preview';previewDiv.className='_lb_preview';previewDiv.style.display='none';
  var previewTitle=document.createElement('div');previewTitle.className='_lb_section_label';previewTitle.textContent='Preview — confirm before importing';
  var previewList=document.createElement('div');previewList.id='_lb_prev_list';
  var importPreviewBtn=document.createElement('button');importPreviewBtn.className='_lb_btn _lb_btnp';importPreviewBtn.textContent='Import These Entries →';importPreviewBtn.style.cssText='margin-top:10px;display:none';
  previewDiv.appendChild(previewTitle);previewDiv.appendChild(previewList);previewDiv.appendChild(importPreviewBtn);
  var expSecHead=document.createElement('p');expSecHead.className='_lb_section_label';expSecHead.style.cssText='font-size:.7rem;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin:16px 0 10px';expSecHead.textContent='Export';

  var exportBox=document.createElement('div');exportBox.className='_lb_section_box';
  var expLabel=document.createElement('p');expLabel.className='_lb_section_label';expLabel.textContent='Export — save your work';
  var expDesc=document.createElement('p');expDesc.className='_lb_section_desc';expDesc.textContent='Copy or download your lorebook as a JSON file. Keep it somewhere safe — you can load it back here later to continue editing.';
  var jout=document.createElement('textarea');jout.id='_lb_jout';jout.readOnly=true;jout.placeholder='Click "Generate" to preview your JSON...';
  var expBtns=document.createElement('div');expBtns.style.cssText='display:flex;gap:8px;margin-top:10px;flex-wrap:wrap';
  var genBtn=document.createElement('button');genBtn.className='_lb_btn _lb_btns';genBtn.textContent='Generate';
  var cpyBtn=document.createElement('button');cpyBtn.className='_lb_btn _lb_btnp';cpyBtn.textContent='Copy JSON';
  var dlBtn=document.createElement('button');dlBtn.className='_lb_btn _lb_btns';dlBtn.textContent='Download .json';
  expBtns.appendChild(genBtn);expBtns.appendChild(cpyBtn);expBtns.appendChild(dlBtn);
  exportBox.appendChild(expLabel);exportBox.appendChild(expDesc);exportBox.appendChild(jout);exportBox.appendChild(expBtns);

  var loadBox=document.createElement('div');loadBox.className='_lb_section_box';
  var loadLabel=document.createElement('p');loadLabel.className='_lb_section_label';loadLabel.textContent='Load — continue working on a previous lorebook';
  var loadDesc=document.createElement('p');loadDesc.className='_lb_section_desc';loadDesc.textContent='Paste a lorebook JSON you exported before. This will replace your current work — export first if you need to keep it.';
  var jin=document.createElement('textarea');jin.id='_lb_jin';jin.placeholder='Paste your previously exported lorebook JSON here...';
  var jerr=document.createElement('div');jerr.className='_lb_jerr';
  var deskJsonFileInp=document.createElement('input');deskJsonFileInp.type='file';deskJsonFileInp.accept='.json';deskJsonFileInp.style.display='none';
  var deskUploadJsonBtn=document.createElement('button');deskUploadJsonBtn.className='_lb_btn _lb_btns';deskUploadJsonBtn.textContent='⬆ Upload .json file';
  deskUploadJsonBtn.addEventListener('click',function(e){e.stopPropagation();deskJsonFileInp.click();});
  deskJsonFileInp.addEventListener('change',function(){
    var file=deskJsonFileInp.files[0];if(!file)return;
    var r=new FileReader();r.onload=function(ev){jin.value=ev.target.result;};
    r.readAsText(file);deskJsonFileInp.value='';
  });
  var ibtn=document.createElement('button');ibtn.className='_lb_btn _lb_btnp';ibtn.textContent='Load Lorebook';ibtn.style.marginTop='8px';
  loadBox.appendChild(loadLabel);loadBox.appendChild(loadDesc);loadBox.appendChild(deskUploadJsonBtn);loadBox.appendChild(deskJsonFileInp);loadBox.appendChild(jin);loadBox.appendChild(jerr);loadBox.appendChild(ibtn);

  var okSp=document.createElement('span');okSp.id='_lb_ok';okSp.style.cssText='font-size:.78rem;color:#34d399;opacity:0;transition:opacity .3s;font-family:system-ui,sans-serif';okSp.textContent='Copied!';

  var exportTplBox=document.createElement('div');exportTplBox.className='_lb_section_box';
  var expTplLabel=document.createElement('p');expTplLabel.className='_lb_section_label';expTplLabel.textContent='Export as Template';
  var expTplDesc=document.createElement('p');expTplDesc.className='_lb_section_desc';expTplDesc.textContent='Download your lorebook in template format — compatible with the Import tool and readable in any text editor or word processor.';
  var expTplBtns=document.createElement('div');expTplBtns.style.cssText='display:flex;gap:8px;margin-top:10px;flex-wrap:wrap';
  var dlTplTxt=document.createElement('button');dlTplTxt.className='_lb_btn _lb_btns';dlTplTxt.textContent='\u2b07 Download .txt';
  var dlTplDocx=document.createElement('button');dlTplDocx.className='_lb_btn _lb_btns';dlTplDocx.textContent='\u2b07 Download .docx';
  var expTplOk=document.createElement('span');expTplOk.style.cssText='font-size:.78rem;color:#34d399;font-family:system-ui,sans-serif';
  expTplBtns.appendChild(dlTplTxt);expTplBtns.appendChild(dlTplDocx);expTplBtns.appendChild(expTplOk);
  exportTplBox.appendChild(expTplLabel);exportTplBox.appendChild(expTplDesc);exportTplBox.appendChild(expTplBtns);
  dlTplTxt.addEventListener('click',function(e){
    e.stopPropagation();
    var txt=buildTXT();
    var name=(document.getElementById('_lb_nm').value.trim()||'lorebook').toLowerCase().replace(/\s+/g,'-');
    var blob=new Blob([txt],{type:'text/plain'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name+'.txt';a.click();
    expTplOk.textContent='\u2713 Downloaded!';setTimeout(function(){expTplOk.textContent='';},2000);
  });
  dlTplDocx.addEventListener('click',function(e){
    e.stopPropagation();
    var name=(document.getElementById('_lb_nm').value.trim()||'lorebook').toLowerCase().replace(/\s+/g,'-');
    downloadDOCX(name+'.docx',expTplOk);
  });

  pImpExp.appendChild(impSecHead);pImpExp.appendChild(loadBox);pImpExp.appendChild(tplStrip);pImpExp.appendChild(upLabel);pImpExp.appendChild(dropZone);pImpExp.appendChild(parseErr);pImpExp.appendChild(previewDiv);
  pImpExp.appendChild(expSecHead);pImpExp.appendChild(exportBox);pImpExp.appendChild(exportTplBox);

  // Desktop Settings panel
  var pSettings=document.createElement('div');pSettings.id='_lb_p_settings';pSettings.className='_lb_pnl';
  var setBox=document.createElement('div');setBox.style.cssText='padding:4px 0;display:flex;flex-direction:column;gap:14px';

  function mkDeskToggle(title,desc,key,onChange){
    var wrap=document.createElement('div');wrap.className='_lb_section_box';
    var row=document.createElement('div');row.style.cssText='display:flex;align-items:flex-start;justify-content:space-between;gap:12px';
    var info=document.createElement('div');
    var h=document.createElement('div');h.style.cssText='font-size:.8rem;color:#e5e7eb;font-weight:600;margin-bottom:3px';h.textContent=title;
    var p=document.createElement('div');p.style.cssText='font-size:.75rem;color:#6b7280;line-height:1.4';p.textContent=desc;
    info.appendChild(h);info.appendChild(p);
    var tog=document.createElement('button');
    tog.style.cssText='width:38px;height:22px;border-radius:11px;background:'+(window[key]?'#4f46e5':'#374151')+';border:none;cursor:pointer;position:relative;flex-shrink:0;transition:background .2s;padding:0';
    var knob=document.createElement('span');
    knob.style.cssText='position:absolute;top:2px;left:'+(window[key]?'18px':'2px')+';width:18px;height:18px;border-radius:50%;background:#fff;transition:left .2s;display:block';
    tog.appendChild(knob);
    tog.addEventListener('click',function(){
      window[key]=!window[key];
      tog.style.background=window[key]?'#4f46e5':'#374151';
      knob.style.left=window[key]?'18px':'2px';
      try{localStorage.setItem(key,window[key]?'1':'0');}catch(e){}
      if(onChange)onChange();
    });
    row.appendChild(info);row.appendChild(tog);wrap.appendChild(row);return wrap;
  }
  var deskFab;

  // Load settings
  try{var s_tc=localStorage.getItem('_lb_tiered_counter');window._lb_tiered_counter=(s_tc===null)?true:(s_tc==='1');}catch(e){window._lb_tiered_counter=true;}
  try{var s_ct=localStorage.getItem('_lb_compact_triggers');window._lb_compact_triggers=(s_ct==='1');}catch(e){window._lb_compact_triggers=false;}
  try{var s_sc=localStorage.getItem('_lb_sugs_collapsed');window._lb_sugs_collapsed=(s_sc==='1');}catch(e){window._lb_sugs_collapsed=false;}
  try{var s_hs=localStorage.getItem('_lb_hide_stats');window._lb_hide_stats=(s_hs==='1');}catch(e){window._lb_hide_stats=false;}
  try{var s_hk=localStorage.getItem('_lb_hotkey_new');window._lb_hotkey_new=(s_hk&&s_hk.length===1)?s_hk:'n';}catch(e){window._lb_hotkey_new='n';}
  try{var s_ds=localStorage.getItem('_lb_default_size');window._lb_default_size=(s_ds==='fullpage')?'fullpage':'column';}catch(e){window._lb_default_size='column';}
  try{var s_ed=localStorage.getItem('_lb_expand_default');window._lb_expand_default=(s_ed==='1');}catch(e){window._lb_expand_default=false;}
  setBox.appendChild(mkDeskToggle('Tiered character counter','Green 0–750 · Yellow 750–1250 · Red 1250–1500. Turn off for a simple red-at-1500 warning.','_lb_tiered_counter'));
  setBox.appendChild(mkDeskToggle('Compact trigger input','Use a single text field for triggers instead of individual tag chips.','_lb_compact_triggers',function(){loadState(getState());}));
  setBox.appendChild(mkDeskToggle('Hide suggestions by default','Start with the Trigger Word Suggestions tray collapsed.','_lb_sugs_collapsed',function(){eDiv.querySelectorAll('._lb_sug_tray').forEach(function(t){if(t._setCollapsed)t._setCollapsed(!!window._lb_sugs_collapsed);});}));
  setBox.appendChild(mkDeskToggle('Hide entry stats','Hide the trigger count and character count from collapsed entry headers.','_lb_hide_stats',function(){eDiv.querySelectorAll('._lb_entry').forEach(function(el){if(el._updStats)el._updStats();});}));
  setBox.appendChild(mkDeskToggle('Expand entries on open','Show all entries expanded when opening the builder. By default entries start collapsed.','_lb_expand_default'));

  // Hotkey setting
  var hkBox=document.createElement('div');hkBox.className='_lb_section_box';
  var hkRow=document.createElement('div');hkRow.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:12px';
  var hkInfo=document.createElement('div');
  var hkTitle=document.createElement('div');hkTitle.style.cssText='font-size:.8rem;color:#e5e7eb;font-weight:600;margin-bottom:3px';hkTitle.textContent='New entry hotkey';
  var hkDesc=document.createElement('div');hkDesc.style.cssText='font-size:.75rem;color:#6b7280;line-height:1.4';hkDesc.textContent='Key used with Alt to add a new entry. Single letter only.';
  hkInfo.appendChild(hkTitle);hkInfo.appendChild(hkDesc);
  var hkRight=document.createElement('div');hkRight.style.cssText='display:flex;align-items:center;gap:8px;flex-shrink:0';
  var hkLabel=document.createElement('span');hkLabel.style.cssText='font-size:.75rem;color:#6b7280';hkLabel.textContent='Alt+';
  var hkInp=document.createElement('input');hkInp.type='text';hkInp.maxLength=1;hkInp.value=window._lb_hotkey_new.toUpperCase();
  hkInp.style.cssText='width:36px;text-align:center;background:#111827;border:1px solid #374151;border-radius:6px;color:#e5e7eb;padding:5px;font-size:.85rem;outline:none;font-family:system-ui,sans-serif;text-transform:uppercase';
  hkInp.addEventListener('focus',function(){hkInp.select();});
  hkInp.addEventListener('keydown',function(e){e.stopPropagation();});
  hkInp.addEventListener('input',function(){
    var v=hkInp.value.replace(/[^a-zA-Z]/g,'');
    hkInp.value=v.toUpperCase();
    if(v.length===1){window._lb_hotkey_new=v.toLowerCase();try{localStorage.setItem('_lb_hotkey_new',v.toLowerCase());}catch(e){}if(deskFab)deskFab.title='Add Entry (Alt+'+v.toUpperCase()+')';}
  });
  hkInp.addEventListener('focus',function(){hkInp.style.borderColor='#ef4444';});
  hkInp.addEventListener('blur',function(){hkInp.style.borderColor='#374151';if(!hkInp.value){hkInp.value=window._lb_hotkey_new.toUpperCase();}});
  hkRight.appendChild(hkLabel);hkRight.appendChild(hkInp);
  hkRow.appendChild(hkInfo);hkRow.appendChild(hkRight);hkBox.appendChild(hkRow);
  setBox.appendChild(hkBox);

  // Default window size dropdown
  var dsBox=document.createElement('div');dsBox.className='_lb_section_box';
  var dsRow=document.createElement('div');dsRow.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:12px';
  var dsInfo=document.createElement('div');
  var dsTitle=document.createElement('div');dsTitle.style.cssText='font-size:.8rem;color:#e5e7eb;font-weight:600;margin-bottom:3px';dsTitle.textContent='Default window size';
  var dsDesc=document.createElement('div');dsDesc.style.cssText='font-size:.75rem;color:#6b7280;line-height:1.4';dsDesc.textContent='Size applied when the app first opens or is reset.';
  dsInfo.appendChild(dsTitle);dsInfo.appendChild(dsDesc);
  var dsSel=document.createElement('select');dsSel.className='_lb_sel';dsSel.style.cssText='width:auto;flex-shrink:0';
  [['column','Column'],['fullpage','Full Page']].forEach(function(opt){
    var o=document.createElement('option');o.value=opt[0];o.textContent=opt[1];
    if(window._lb_default_size===opt[0])o.selected=true;
    dsSel.appendChild(o);
  });
  dsSel.addEventListener('change',function(){
    window._lb_default_size=dsSel.value;
    try{localStorage.setItem('_lb_default_size',dsSel.value);}catch(e){}
  });
  dsRow.appendChild(dsInfo);dsRow.appendChild(dsSel);dsBox.appendChild(dsRow);
  setBox.appendChild(dsBox);

  // Reset window button
  var rstBox=document.createElement('div');rstBox.className='_lb_section_box';
  var rstBtn=document.createElement('button');rstBtn.className='_lb_btn _lb_btns';rstBtn.textContent='Reset window to default size';
  rstBtn.addEventListener('click',function(e){e.stopPropagation();applyDefaultSize();try{localStorage.removeItem('_lb_window_pos');}catch(e){}});
  rstBox.appendChild(rstBtn);setBox.appendChild(rstBox);

  pSettings.appendChild(setBox);

  bd.appendChild(pBuild);bd.appendChild(pImpExp);bd.appendChild(pSettings);

  var undoBtn,redoBtn;
  var ft=document.createElement('div');ft.id='_lb_ft';
  var clrBtn=document.createElement('button');clrBtn.className='_lb_btn _lb_btns';clrBtn.textContent='Clear All';
  var ftLeft=document.createElement('div');ftLeft.style.cssText='display:flex;align-items:center;gap:10px';
  ftLeft.appendChild(clrBtn);
  var rfr=document.createElement('div');rfr.style.cssText='display:flex;align-items:center;gap:8px';
  undoBtn=document.createElement('button');undoBtn.className='_lb_btn _lb_btns';undoBtn.title='Undo (Ctrl+Z / Cmd+Z)';undoBtn.textContent='\u21a9 Undo';undoBtn.disabled=true;if(IS_MOBILE)undoBtn.style.display='none';
  redoBtn=document.createElement('button');redoBtn.className='_lb_btn _lb_btns';redoBtn.title='Redo (Ctrl+Y)';redoBtn.textContent='\u21aa Redo';redoBtn.disabled=true;if(IS_MOBILE)redoBtn.style.display='none';
  undoBtn.addEventListener('click',function(e){e.stopPropagation();doUndo();});
  redoBtn.addEventListener('click',function(e){e.stopPropagation();doRedo();});
  rfr.appendChild(undoBtn);rfr.appendChild(redoBtn);
  rfr.appendChild(okSp);
  var importEntriesBtn=document.createElement('button');importEntriesBtn.className='_lb_btn _lb_btns';importEntriesBtn.textContent='\u2b07 Import Entries';
  importEntriesBtn.addEventListener('click',function(e){
    e.stopPropagation();
    var modal=document.createElement('div');
    modal.style.cssText='position:absolute;inset:0;background:rgba(0,0,0,.7);z-index:10;display:flex;align-items:center;justify-content:center;border-radius:14px;overflow:hidden';
    var box=document.createElement('div');
    box.style.cssText='background:#1f2937;border:1px solid #4b5563;border-radius:12px;padding:20px;width:90%;max-width:480px;max-height:80vh;display:flex;flex-direction:column;gap:10px;font-family:system-ui,sans-serif';
    var mh=document.createElement('div');mh.style.cssText='display:flex;align-items:center;justify-content:space-between';
    var mt=document.createElement('h3');mt.style.cssText='margin:0;font-size:.9rem;color:#e5e7eb';mt.textContent='Import Entries';
    var mc=document.createElement('button');mc.style.cssText='background:none;border:none;color:#6b7280;font-size:1.2rem;cursor:pointer';mc.textContent='\u2715';
    mc.addEventListener('click',function(){modal.remove();});
    mh.appendChild(mt);mh.appendChild(mc);
    var hint=document.createElement('div');hint.style.cssText='font-size:.75rem;color:#6b7280;line-height:1.5';
    hint.innerHTML='Paste entries using <code style="color:#6ee7b7;background:#111827;padding:1px 4px;border-radius:3px">=== Name ===</code> or <code style="color:#6ee7b7;background:#111827;padding:1px 4px;border-radius:3px">Entry Name: XXX</code> format.';
    var ta=document.createElement('textarea');
    ta.style.cssText='width:100%;background:#111827;border:1px solid #374151;border-radius:6px;color:#e5e7eb;padding:10px;font-size:.82rem;font-family:system-ui,sans-serif;resize:none;outline:none;min-height:140px;box-sizing:border-box;line-height:1.5';
    ta.placeholder='=== Elara Voss ===\nType: Character\nTriggers: elara\n\nEntry Name: The Keep\nEntry Type: Location';
    var errEl=document.createElement('div');errEl.style.cssText='font-size:.75rem;color:#ef4444;min-height:16px';
    var prevEl=document.createElement('div');prevEl.style.cssText='max-height:150px;overflow-y:auto;display:none;background:#111827;border:1px solid #374151;border-radius:6px;padding:8px';
    var mbtns=document.createElement('div');mbtns.style.cssText='display:flex;gap:8px';
    var prevBtn=document.createElement('button');prevBtn.className='_lb_btn _lb_btns';prevBtn.style.cssText='flex:1;padding:8px';prevBtn.textContent='Preview';
    var confBtn=document.createElement('button');confBtn.className='_lb_btn _lb_btnp';confBtn.style.cssText='flex:1;padding:8px;display:none';confBtn.textContent='Import All \u2192';
    mbtns.appendChild(prevBtn);mbtns.appendChild(confBtn);
    prevBtn.addEventListener('click',function(){
      errEl.textContent='';
      var parsed=parseImportText(ta.value);
      if(!parsed.length){errEl.textContent='No entries found.';prevEl.style.display='none';confBtn.style.display='none';return;}
      prevEl.innerHTML='';prevEl.style.display='block';confBtn.style.display='block';
      parsed.forEach(function(e){
        var row=document.createElement('div');row.style.cssText='padding:5px 0;border-bottom:1px solid #374151;font-size:.78rem';
        var parts=[e.type];
        if(e.triggers.length)parts.push(e.triggers.length+' trigger'+(e.triggers.length!==1?'s':''));
        if(e.description)parts.push(e.description.length+' char desc');
        row.innerHTML='<strong style="color:#f87171">'+e.name+'</strong> <span style="color:#6b7280">'+parts.join(' · ')+'</span>';
        prevEl.appendChild(row);
      });
      confBtn._parsed=parsed;
    });
    confBtn.addEventListener('click',function(){
      var p=confBtn._parsed;if(!p)return;
      pushUndo();
      p.forEach(function(e){eDiv.appendChild(mkEntry(e));});
      renumberEntries();scheduleSave();
      modal.remove();switchTab('build');
    });
    box.appendChild(mh);box.appendChild(hint);box.appendChild(ta);box.appendChild(errEl);box.appendChild(prevEl);box.appendChild(mbtns);
    modal.appendChild(box);bx.appendChild(modal);
    modal.addEventListener('click',function(e){if(e.target===modal)modal.remove();});
    setTimeout(function(){ta.focus();},50);
  });
  rfr.appendChild(importEntriesBtn);
  ft.appendChild(ftLeft);
  if(!IS_MOBILE){var deskFab=document.createElement('button');deskFab.style.cssText='width:46px;height:46px;border-radius:50%;background:#ef4444;border:none;color:#fff;font-size:1.6rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,.4);position:absolute;left:50%;transform:translateX(-50%);flex-shrink:0';deskFab.textContent='+';deskFab.title='Add Entry (Alt+'+(window._lb_hotkey_new||'n').toUpperCase()+')';deskFab.addEventListener('click',function(e){e.stopPropagation();addEntryAndFocus();});ft.appendChild(deskFab);}
  ft.appendChild(rfr);


  var resizeHandle=document.createElement('div');resizeHandle.id='_lb_resize';resizeHandle.textContent='⤡';if(IS_MOBILE)resizeHandle.style.display='none';
  var fab=document.createElement('button');fab.id='_lb_fab';fab.textContent='+';fab.title='New entry (mobile)';
  function addEntryAndFocus(){switchTab('build');addEntry();var entries=eDiv.querySelectorAll('._lb_entry');var last=entries[entries.length-1];if(last){last.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(function(){var inp=last.querySelector('._lb_inp');if(inp)inp.focus();},80);}}
  fab.addEventListener('click',function(e){e.stopPropagation();addEntryAndFocus();});

  if(!IS_MOBILE){
    var MIN_W=480,MIN_H=320;
    function applyDefaultSize(){
      var vw=window.innerWidth,vh=window.innerHeight;
      var nw,nh;
      if(window._lb_default_size==='fullpage'){nw=vw;nh=vh;}
      else{nw=Math.max(MIN_W,Math.round(vw/3));nh=Math.max(MIN_H,Math.round(vh*0.85));}
      bx._desiredW=nw;bx._desiredH=nh;
      bx.style.left=Math.round((vw-nw)/2)+'px';bx.style.top=Math.round((vh-nh)/2)+'px';
      bx.style.width=nw+'px';bx.style.height=nh+'px';
      bx.style.borderRadius='8px';bx.style.boxShadow='0 8px 40px rgba(0,0,0,.6)';bx.style.border='1px solid #374151';
    }
    [['_tl','nw'],['_tr','ne'],['_bl','sw'],['_br','se']].forEach(function(cfg){
      var c=document.createElement('div');c.className='_lb_corner '+cfg[0];
      c.addEventListener('mousedown',function(e){
        e.preventDefault();e.stopPropagation();
        var r=bx.getBoundingClientRect();
        var sx=e.clientX,sy=e.clientY,sl=r.left,st=r.top,sw=r.width,sh=r.height;
        bx.style.borderRadius='8px';bx.style.boxShadow='0 8px 40px rgba(0,0,0,.6)';bx.style.border='1px solid #374151';
        function onMove(e){
          var dx=e.clientX-sx,dy=e.clientY-sy,nw=sw,nh=sh;
          var dir=cfg[1],cx=sl+sw/2,cy=st+sh/2;
          var vw=window.innerWidth,vh=window.innerHeight;
          if(dir==='ne'||dir==='se') nw=Math.max(MIN_W,sw+dx);
          if(dir==='nw'||dir==='sw') nw=Math.max(MIN_W,sw-dx);
          if(dir==='se'||dir==='sw') nh=Math.max(MIN_H,sh+dy);
          if(dir==='ne'||dir==='nw') nh=Math.max(MIN_H,sh-dy);
          nw=Math.min(nw,vw);nh=Math.min(nh,vh);
          bx._desiredW=nw;bx._desiredH=nh;
          var nl=Math.max(0,Math.min(cx-nw/2,vw-nw));
          var nt=Math.max(0,Math.min(cy-nh/2,vh-nh));
          bx.style.left=nl+'px';bx.style.top=nt+'px';bx.style.width=nw+'px';bx.style.height=nh+'px';
        }
        function onUp(){
          document.removeEventListener('mousemove',onMove);document.removeEventListener('mouseup',onUp);
          try{var r=bx.getBoundingClientRect();localStorage.setItem('_lb_window_pos',JSON.stringify({l:Math.round(r.left),t:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height)}));}catch(e){}
        }
        document.addEventListener('mousemove',onMove);document.addEventListener('mouseup',onUp);
      });
      bx.appendChild(c);
    });
  }

  bx.appendChild(hd);bx.appendChild(searchFilterBar);bx.appendChild(bd);bx.appendChild(ft);bx.appendChild(resizeHandle);if(IS_MOBILE)bx.appendChild(fab);
  if(IS_MOBILE){document.body.appendChild(bx);}else{
    document.body.appendChild(bx);
    var _sizeRestored=false;
    try{
      var _p=JSON.parse(localStorage.getItem('_lb_window_pos')||'null');
      if(_p&&_p.w>=MIN_W&&_p.h>=MIN_H){
        var _vw=window.innerWidth,_vh=window.innerHeight;
        var _pw=Math.max(MIN_W,Math.min(_p.w,_vw)),_ph=Math.max(MIN_H,Math.min(_p.h,_vh));
        bx._desiredW=_pw;bx._desiredH=_ph;
        bx.style.left=Math.round((_vw-_pw)/2)+'px';bx.style.top=Math.round((_vh-_ph)/2)+'px';
        bx.style.width=_pw+'px';bx.style.height=_ph+'px';
        bx.style.borderRadius='8px';bx.style.boxShadow='0 8px 40px rgba(0,0,0,.6)';bx.style.border='1px solid #374151';
        _sizeRestored=true;
      }
    }catch(e){}
    if(!_sizeRestored)applyDefaultSize();
    window.addEventListener('resize',function(){
      var vw=window.innerWidth,vh=window.innerHeight;
      var dw=bx._desiredW||bx.offsetWidth,dh=bx._desiredH||bx.offsetHeight;
      var nw=Math.max(MIN_W,Math.min(dw,vw)),nh=Math.max(MIN_H,Math.min(dh,vh));
      bx.style.left=Math.round((vw-nw)/2)+'px';bx.style.top=Math.round((vh-nh)/2)+'px';
      bx.style.width=nw+'px';bx.style.height=nh+'px';
    });
  }

  var saveTimer=null;

  function getState(){
    var name=document.getElementById('_lb_nm').value.trim();
    var entries=[];
    eDiv.querySelectorAll('._lb_entry').forEach(function(el){if(el._gd)entries.push(el._gd());});
    return {name:name,entries:entries,ts:Date.now()};
  }
  function saveNow(){
    if(!currentLBKey)return;
    var state=getState();
    lbSaveState(currentLBKey,state);
    updLBCount();
    var b=document.getElementById('_lb_savebadge');
    if(b){b.classList.add('_show');clearTimeout(b._t);b._t=setTimeout(function(){b.classList.remove('_show');},1800);}
  }
  function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(saveNow,900);}
  window.addEventListener('beforeunload',function(){saveNow();});

  var undoStack=[],redoStack=[],_inUndoRedo=false;
  function updUndoButtons(){if(undoBtn)undoBtn.disabled=!undoStack.length;if(redoBtn)redoBtn.disabled=!redoStack.length;}
  function pushUndo(){if(_inUndoRedo)return;undoStack.push(JSON.stringify(getState()));if(undoStack.length>50)undoStack.shift();redoStack=[];updUndoButtons();}
  function doUndo(){if(!undoStack.length)return;_inUndoRedo=true;redoStack.push(JSON.stringify(getState()));if(redoStack.length>50)redoStack.shift();loadState(JSON.parse(undoStack.pop()));scheduleSave();_inUndoRedo=false;updUndoButtons();}
  function doRedo(){if(!redoStack.length)return;_inUndoRedo=true;undoStack.push(JSON.stringify(getState()));if(undoStack.length>50)undoStack.shift();loadState(JSON.parse(redoStack.pop()));scheduleSave();_inUndoRedo=false;updUndoButtons();}
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')saveNow();});
  function updLBCount(){
    var idx=lbIndex();
    var el=document.getElementById('_lb_lb_count');
    if(el)el.textContent=idx.length;
  }

