// ── DESKTOP BUILDER ────────────────────────────────────────────────────────
function launchBuilder(){
  if(!IS_MOBILE){var EX=document.getElementById('_lb_bx');if(EX){EX.remove();var es=document.getElementById('_lb_st');if(es)es.remove();return;}}
  var currentLBKey=null;
  var TYPES=['Character','Item','PlotEvent','Location','Other'];
  var TYPE_COLORS={Character:'#c084fc',Item:'#60a5fa',Location:'#fbbf24',PlotEvent:'#f87171',Other:'#0d9488'};

  var CSS='#_lb_ov{display:none}'
  +'#_lb_bx{position:fixed;top:0;left:0;width:100vw;height:100vh;background:#1f2937;border:none;border-radius:0;display:flex;flex-direction:column;font-family:system-ui,sans-serif;color:#e5e7eb;overflow:hidden;pointer-events:all;box-sizing:border-box}'
  +'#_lb_hd{background:#111827;padding:13px 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #374151;flex-shrink:0}'
  +'#_lb_hd h2{margin:0;font-size:.95rem;color:#f87171;letter-spacing:.07em;pointer-events:none}'
  +'._lb_tabbar{display:flex;background:#0d1520;border-radius:8px;padding:3px;gap:2px;border:1px solid #1f2d40}'
  +'._lb_tab{padding:5px 13px;border-radius:6px;border:none;background:transparent;color:#6b7280;cursor:pointer;font-size:.78rem;font-family:system-ui,sans-serif;transition:color .15s}'
  +'._lb_tab:hover{color:#9ca3af}'
  +'._lb_tab._on{background:#1f2937;color:#e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,.4)}'
  +'#_lb_xb{background:none;border:none;color:#9ca3af;font-size:1.25rem;cursor:pointer;line-height:1;padding:2px 5px;font-family:system-ui,sans-serif}'
  +'#_lb_xb:hover{color:#f87171}'
  +'._lb_corner{position:absolute;width:18px;height:18px;z-index:10}'
  +'._lb_corner._tl{top:0;left:0;cursor:nw-resize}'
  +'._lb_corner._tr{top:0;right:0;cursor:ne-resize}'
  +'._lb_corner._bl{bottom:0;left:0;cursor:sw-resize}'
  +'._lb_corner._br{bottom:0;right:0;cursor:se-resize}'
  +'._lb_corner::after{content:"";position:absolute;width:8px;height:8px;border-color:#eab308;border-style:solid;border-width:0}'
  +'._lb_corner._tl::after{top:4px;left:4px;border-top-width:2px;border-left-width:2px;border-radius:1px 0 0 0}'
  +'._lb_corner._tr::after{top:4px;right:4px;border-top-width:2px;border-right-width:2px;border-radius:0 1px 0 0}'
  +'._lb_corner._bl::after{bottom:4px;left:4px;border-bottom-width:2px;border-left-width:2px;border-radius:0 0 0 1px}'
  +'._lb_corner._br::after{bottom:4px;right:4px;border-bottom-width:2px;border-right-width:2px;border-radius:0 0 1px 0}'
  +'._lb_corner:hover::after{border-color:#fde047}'
  +'#_lb_searchbar{background:#1f2937;border-bottom:1px solid #374151;flex-shrink:0;padding:8px 16px 0}'
  +'#_lb_searchbar_tab{display:flex;justify-content:center;align-items:center;padding:4px 0;cursor:pointer;user-select:none}'
  +'#_lb_searchbar_tab span{display:block;width:36px;height:4px;background:#374151;border-radius:2px;transition:background .15s}'
  +'#_lb_searchbar_tab:hover span{background:#6b7280}'
  +'#_lb_bd{padding:9px 16px 16px;overflow-y:auto;flex:1;min-height:0}'
  +'#_lb_resize{display:none}'
  +'#_lb_resize:hover{color:#9ca3af}'
  +'#_lb_hotkey_hint{font-size:.68rem;color:#374151;position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;pointer-events:none}'
  +'._lb_pnl{display:none}'
  +'._lb_pnl._on{display:block}'
  +'._lb_lbl{display:block;font-size:.7rem;color:#6b7280;margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em}'
  +'._lb_inp,._lb_ta{width:100%;background:#111827;border:1px solid #374151;border-radius:6px;color:#e5e7eb;padding:7px 10px;font-size:.87rem;outline:none;font-family:system-ui,sans-serif;box-sizing:border-box}'
  +'._lb_inp:focus,._lb_ta:focus{border-color:#ef4444}'
  +'._lb_sel{width:100%;background:#111827;border:1px solid #374151;border-radius:6px;color:#e5e7eb;padding:7px 10px;font-size:.87rem;outline:none;font-family:system-ui,sans-serif;box-sizing:border-box;cursor:pointer}'
  +'._lb_sel:focus{border-color:#ef4444}'
  +'._lb_ta{resize:none;min-height:70px;overflow:hidden;background:transparent!important;position:relative;z-index:1;line-height:1.5;color:transparent!important;caret-color:#e5e7eb}'
  +'._lb_ta::placeholder{color:#4b5563}'
  +'._lb_desc_hl_wrap{position:relative}'
  +'._lb_desc_hl{position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;overflow:hidden;color:#e5e7eb;white-space:pre-wrap;word-wrap:break-word;word-break:break-word;box-sizing:border-box;padding:7px 10px;font-size:.87rem;font-family:system-ui,sans-serif;line-height:1.5;border:1px solid transparent;border-radius:6px;background:#111827;z-index:0}'
  +'._lb_ta_tab{display:flex;justify-content:center;align-items:center;cursor:ns-resize;padding:3px 0;user-select:none}'
  +'._lb_ta_tab::before{content:"";width:36px;height:4px;background:#374151;border-radius:2px;transition:background .15s}'
  +'._lb_ta_tab:hover::before{background:#6b7280}'
  +'._lb_entry{background:#111827;border:1px solid #374151;border-radius:10px;padding:13px;margin-bottom:9px;border-left:3px solid #374151}'
  +'._lb_entry[data-type="Character"]{border-left-color:#c084fc}'
  +'._lb_entry[data-type="Item"]{border-left-color:#60a5fa}'
  +'._lb_entry[data-type="Location"]{border-left-color:#fbbf24}'
  +'._lb_entry[data-type="PlotEvent"]{border-left-color:#f87171}'
  +'._lb_entry[data-type="Other"]{border-left-color:#0d9488}'
  +'._lb_entry._lb_search_match{outline:2px solid #9ca3af}'
  +'._lb_entry._lb_search_match[data-type="Character"]{outline-color:#c084fc}'
  +'._lb_entry._lb_search_match[data-type="Item"]{outline-color:#60a5fa}'
  +'._lb_entry._lb_search_match[data-type="Location"]{outline-color:#fbbf24}'
  +'._lb_entry._lb_search_match[data-type="PlotEvent"]{outline-color:#f87171}'
  +'._lb_entry._lb_search_match[data-type="Other"]{outline-color:#0d9488}'
  +'._lb_entry._lb_search_dim{opacity:.3}'
  +'._lb_ehead{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px}'
  +'._lb_enum{font-size:.82rem;color:#f87171;font-weight:700;letter-spacing:.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:340px;user-select:text;cursor:text}'
  +'._lb_type_dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:5px;vertical-align:middle;flex-shrink:0}'
  +'._lb_ebtns{display:flex;gap:6px}'
  +'._lb_ebtn{background:none;border:1px solid #374151;border-radius:5px;color:#9ca3af;cursor:pointer;padding:3px 9px;font-size:.75rem;font-family:system-ui,sans-serif}'
  +'._lb_ebtn:hover{border-color:#ef4444;color:#ef4444}'
  +'._lb_grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}'
  +'._lb_full{grid-column:1/-1}'
  +'._lb_hint{font-size:.7rem;color:#4b5563;margin-top:2px}'
  +'._lb_cc{font-size:.7rem;text-align:left;margin-top:2px;color:#4b5563}'
  +'._lb_cc._good{color:#34d399}'
  +'._lb_cc._warn{color:#f59e0b;font-weight:500}'
  +'._lb_cc._over{color:#ef4444;font-weight:700}'
  +'._lb_collapsed ._lb_ebody{display:none}'
  +'#_lb_ft{padding:12px 18px;border-top:1px solid #374151;background:#111827;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;position:relative}'
  +'._lb_btn{padding:7px 15px;border-radius:7px;border:1px solid;cursor:pointer;font-size:.83rem;font-weight:500;font-family:system-ui,sans-serif}'
  +'._lb_btnp{background:#ef4444;border-color:#ef4444;color:#fff}'
  +'._lb_btnp:hover{background:#dc2626}'
  +'._lb_btns{background:transparent;border-color:#374151;color:#9ca3af}'
  +'._lb_btns:hover{border-color:#ef4444;color:#ef4444}'
  +'._lb_btng{background:transparent;border-color:#374151;color:#34d399}'
  +'._lb_btng:hover{border-color:#34d399}'
  +'#_lb_jin,#_lb_jout{width:100%;background:#0f172a;border:1px solid #374151;border-radius:7px;color:#6ee7b7;padding:10px;font-family:monospace;font-size:.77rem;min-height:150px;resize:vertical;outline:none;box-sizing:border-box}'
  +'#_lb_jin:focus{border-color:#ef4444}'
  +'._lb_jerr{color:#f87171;font-size:.78rem;margin-top:5px;min-height:14px}'
  +'#_lb_savebadge{font-size:.72rem;color:#34d399;opacity:0;transition:opacity .4s;margin-left:8px}'
  +'#_lb_savebadge._show{opacity:1}'
  +'#_lb_nm{background:transparent;border:none;border-bottom:1px solid #374151;color:#e5e7eb;padding:3px 6px;font-size:.85rem;outline:none;font-family:system-ui,sans-serif;min-width:60px;width:60px;max-width:300px;margin:0 12px}'
  +'#_lb_nm:focus{border-bottom-color:#ef4444}'
  +'#_lb_nm::placeholder{color:#4b5563}'
  +'._lb_restore_banner{background:#1a3a2a;border:1px solid #34d399;border-radius:8px;padding:11px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:10px}'
  +'._lb_restore_banner p{margin:0;font-size:.82rem;color:#6ee7b7}'
  +'._lb_restore_banner p span{color:#9ca3af;font-size:.75rem;margin-left:6px}'
  +'._lb_conv_drop{border:2px dashed #374151;border-radius:10px;padding:28px;text-align:center;cursor:pointer;transition:border-color .15s;margin-bottom:12px}'
  +'._lb_conv_drop:hover,._lb_conv_drop._drag{border-color:#ef4444}'
  +'._lb_conv_drop p{margin:0;color:#6b7280;font-size:.88rem;pointer-events:none}'
  +'._lb_parse_err{color:#f87171;font-size:.8rem;margin-top:6px;min-height:14px}'
  +'._lb_preview{background:#0f172a;border:1px solid #374151;border-radius:8px;padding:12px;margin-top:10px;max-height:220px;overflow-y:auto}'
  +'._lb_prev_entry{border-bottom:1px solid #1e293b;padding:8px 0}'
  +'._lb_prev_entry:last-child{border-bottom:none}'
  +'._lb_prev_name{font-size:.82rem;font-weight:600;color:#f87171}'
  +'._lb_prev_type{font-size:.72rem;color:#6b7280;margin-left:8px}'
  +'._lb_prev_trigs{font-size:.72rem;color:#34d399;margin-top:2px}'
  +'._lb_prev_desc{font-size:.75rem;color:#9ca3af;margin-top:3px}'
  +'._lb_trig_counter{font-size:.7rem;text-align:right;margin-top:2px;color:#4b5563}'
  +'._lb_trig_counter._warn{color:#f59e0b;font-weight:500}'
  +'._lb_trig_counter._over{color:#ef4444;font-weight:700}'
  +'._lb_sug_row{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px;min-height:0}'
  +'._lb_sug_chip{padding:3px 10px;border-radius:12px;border:1px solid #334155;background:#1e293b;color:#6ee7b7;font-size:.72rem;cursor:pointer;font-family:system-ui,sans-serif;transition:all .15s;white-space:nowrap}'
  +'._lb_sug_chip:hover{border-color:#6ee7b7;background:#0d2618}'
  +'._lb_sug_label{font-size:.68rem;color:#475569;margin-top:4px;width:100%}'
  +'._lb_drag{color:#374151;cursor:grab;font-size:1rem;line-height:1;flex-shrink:0;user-select:none;padding:0 2px}'
  +'._lb_trig_match{background:#fef08a!important;color:#111827!important;border-color:#ca8a04!important}'
  +'._lb_drag:active{cursor:grabbing}'
  +'._lb_dragging{opacity:.4;border-style:dashed}'
  +'._lb_dragover{border-color:#ef4444;border-style:dashed}'
  +'._lb_fbtn{padding:3px 10px;border-radius:20px;border:1px solid #374151;background:transparent;color:#6b7280;cursor:pointer;font-size:.73rem;font-family:system-ui,sans-serif;transition:all .1s}'
  +'._lb_fbtn:hover{border-color:#6b7280;color:#e5e7eb}'
  +'._lb_fbtn._on{color:#fff;border-color:transparent}'
  +'._lb_fbtn[data-type="All"]._on{background:#4b5563}'
  +'._lb_fbtn[data-type="Character"]._on{background:#9333ea}'
  +'._lb_fbtn[data-type="Item"]._on{background:#1d4ed8}'
  +'._lb_fbtn[data-type="Location"]._on{background:#d97706}'
  +'._lb_fbtn[data-type="PlotEvent"]._on{background:#dc2626}'
  +'._lb_fbtn[data-type="Other"]._on{background:#0d9488}'
  +'#_lb_searchrow{display:flex;gap:6px;margin-bottom:10px}'
  +'#_lb_search{flex:1;background:#111827;border:1px solid #374151;border-radius:6px;color:#e5e7eb;padding:6px 10px;font-size:.83rem;outline:none;font-family:system-ui,sans-serif}'
  +'#_lb_search:focus{border-color:#ef4444}'
  +'#_lb_search::placeholder{color:#4b5563}'
  +'._lb_search_inp_wrap{position:relative;flex:1;display:flex;align-items:center}'
  +'._lb_search_clear{position:absolute;right:8px;background:none;border:none;color:#6b7280;cursor:pointer;font-size:1rem;padding:0;line-height:1;display:none}'
  +'._lb_search_clear:hover{color:#e5e7eb}'
  +'#_lb_filterbar{display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap}'
  +'._lb_filter_right{display:flex;gap:6px;align-items:center;flex-shrink:0;margin-left:auto}'
  +'#_lb_bd::-webkit-scrollbar{width:7px}'
  +'#_lb_bd::-webkit-scrollbar-track{background:#111827}'
  +'#_lb_bd::-webkit-scrollbar-thumb{background:#374151;border-radius:4px}'
  +'#_lb_bd::-webkit-scrollbar-thumb:hover{background:#4b5563}'
  +'#_lb_bd{scrollbar-color:#374151 #111827;scrollbar-width:thin}'
  +'._lb_section_box{background:#111827;border:1px solid #374151;border-radius:10px;padding:14px;margin-bottom:16px}'
  +'._lb_section_desc{font-size:.8rem;color:#6b7280;margin:0 0 10px;line-height:1.5}'+'#_lb_fab{display:none;position:fixed;bottom:80px;right:18px;width:52px;height:52px;border-radius:50%;background:#ef4444;border:none;color:#fff;font-size:1.6rem;cursor:pointer;align-items:center;justify-content:center;z-index:2147483648;box-shadow:0 4px 12px rgba(0,0,0,.4);}'+'@media(max-width:700px){#_lb_bx{position:fixed;top:0;left:0;width:100vw!important;max-width:100vw!important;height:100vh!important;border-radius:0;transform:none!important;overflow-x:hidden!important;}#_lb_hd{cursor:default;padding:10px 12px;flex-wrap:wrap;gap:6px;}#_lb_hd h2{font-size:.8rem;}._lb_tabbar{order:2;flex:1;}._lb_tab{padding:4px 8px;font-size:.72rem;}#_lb_xb{order:3;}#_lb_bd{padding:12px;}._lb_grid{grid-template-columns:1fr!important;}._lb_inp,._lb_ta,._lb_sel{font-size:16px!important;padding:10px 12px!important;}._lb_btn{padding:10px 16px!important;font-size:.9rem!important;}._lb_ebtn{padding:6px 12px!important;font-size:.8rem!important;}#_lb_ae{padding:14px!important;font-size:.9rem!important;}._lb_fbtn{padding:6px 14px!important;font-size:.8rem!important;}#_lb_search{font-size:16px!important;padding:10px!important;}#_lb_fab{display:flex!important;}._lb_enum{font-size:1rem!important;max-width:calc(100vw - 140px)!important;}._lb_ehead{flex-wrap:wrap;gap:6px;}}';

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
  setBox.appendChild(mkDeskToggle('Hide entry stats','Hide the trigger count and character count from collapsed entry headers.','_lb_hide_stats'));
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
    if(v.length===1){window._lb_hotkey_new=v.toLowerCase();try{localStorage.setItem('_lb_hotkey_new',v.toLowerCase());}catch(e){}hotkeyHint.textContent='Alt+'+v.toUpperCase()+'\u2014add entry';}
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
  var hotkeyHint=document.createElement('span');hotkeyHint.id='_lb_hotkey_hint';hotkeyHint.textContent='Alt+'+(window._lb_hotkey_new||'n').toUpperCase()+'—add entry';hotkeyHint.style.cssText='font-size:.68rem;color:#6b7280;white-space:nowrap';
  var ftLeft=document.createElement('div');ftLeft.style.cssText='display:flex;align-items:center;gap:10px';
  ftLeft.appendChild(clrBtn);if(!IS_MOBILE)ftLeft.appendChild(hotkeyHint);
  var rfr=document.createElement('div');rfr.style.cssText='display:flex;align-items:center;gap:8px';
  undoBtn=document.createElement('button');undoBtn.className='_lb_btn _lb_btns';undoBtn.title='Undo (Ctrl+Z / Cmd+Z)';undoBtn.textContent='\u21a9 Undo';undoBtn.disabled=true;if(IS_MOBILE)undoBtn.style.display='none';
  redoBtn=document.createElement('button');redoBtn.className='_lb_btn _lb_btns';redoBtn.title='Redo (Ctrl+Shift+Z / Cmd+Shift+Z)';redoBtn.textContent='\u21aa Redo';redoBtn.disabled=true;if(IS_MOBILE)redoBtn.style.display='none';
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
  if(!IS_MOBILE){var deskFab=document.createElement('button');deskFab.style.cssText='width:46px;height:46px;border-radius:50%;background:#ef4444;border:none;color:#fff;font-size:1.6rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,.4);position:absolute;left:50%;transform:translateX(-50%);flex-shrink:0';deskFab.textContent='+';deskFab.title='Add Entry';deskFab.addEventListener('click',function(e){e.stopPropagation();addEntryAndFocus();});ft.appendChild(deskFab);}
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
    try{
      var state=getState();
      localStorage.setItem(currentLBKey,JSON.stringify(state));
      var idx=lbIndex();var slot=idx.find(function(x){return x.key===currentLBKey;});
      if(slot){slot.name=state.name||'Untitled';slot.ts=state.ts;}lbSaveIndex(idx);
      updLBCount();
      var b=document.getElementById('_lb_savebadge');
      if(b){b.classList.add('_show');clearTimeout(b._t);b._t=setTimeout(function(){b.classList.remove('_show');},1800);}
    }catch(e){}
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
    descTA.addEventListener('input',function(){autoGrow();updCC();sugOffset=0;renderSugs();scheduleSave();var _q=searchInp.value.trim().toLowerCase();var _e=_q?regexEscape(_q):'';syncDescHl(_e?new RegExp('('+_e+')','gi'):null);});

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

  var HL_MARK='background:#fef08a;color:#111827;border-radius:2px;padding:0 1px';
  function applyFilter(){
    var q=searchInp.value.trim().toLowerCase();
    var isFnR=searchMode.value==='fnr';
    searchClearBtn.style.display=searchInp.value?'block':'none';
    var esc=q?regexEscape(q):'';
    var hlRe=esc?new RegExp('('+esc+')','gi'):null;
    function hlText(str){return escHtml(str).replace(hlRe,'<mark style="'+HL_MARK+'">$1</mark>');}
    eDiv.querySelectorAll('._lb_entry').forEach(function(el){
      var type=el.dataset.type||'Character';
      var typeOk=activeFilters.has('All')||activeFilters.has(type);
      var gd=el._gd?el._gd():{triggers:[],description:'',name:''};
      var trigs=gd.triggers.join(' ').toLowerCase();
      var desc=(gd.description||'').toLowerCase();
      var nm=(gd.name||'').toLowerCase();
      var searchOk=!q||(nm.indexOf(q)!==-1||desc.indexOf(q)!==-1||trigs.indexOf(q)!==-1);
      el.style.display=(typeOk&&searchOk)?'':'none';
      el.classList.remove('_lb_search_match','_lb_search_dim');
      if(q&&typeOk){
        if(searchOk)el.classList.add('_lb_search_match');
        else el.classList.add('_lb_search_dim');
      }
      var isMatch=hlRe&&el.classList.contains('_lb_search_match');
      var enumEl=el.querySelector('._lb_enum');
      if(enumEl){
        if(isMatch){
          enumEl.innerHTML=hlText(enumEl.dataset.origText||enumEl.textContent);
          if(!enumEl.dataset.origText)enumEl.dataset.origText=enumEl.textContent;
          enumEl.dataset.hl='1';
        } else if(enumEl.dataset.hl){
          enumEl.textContent=enumEl.dataset.origText||enumEl.textContent;
          delete enumEl.dataset.hl;delete enumEl.dataset.origText;
        }
      }
      el.querySelectorAll('._lb_trig_lbl').forEach(function(lbl){
        var orig=lbl.dataset.origText||(lbl.dataset.origText=lbl.textContent);
        lbl.textContent=orig;
        lbl.parentNode.classList.toggle('_lb_trig_match',isMatch&&orig.toLowerCase().indexOf(q)!==-1);
      });
      if(el._syncDescHl)el._syncDescHl(isMatch?hlRe:null);
    });
    updMatchCount();
  }
  function countMatches(){
    var q=searchInp.value.trim().toLowerCase();
    if(!q)return{matches:0,entryCount:0};
    var matches=0;var entryCount=0;
    var re=new RegExp(regexEscape(q),'gi');
    eDiv.querySelectorAll('._lb_entry').forEach(function(el){
      if(!el._gd)return;
      var d=el._gd();var found=0;
      var dh=(d.description||'').match(re);if(dh)found+=dh.length;re.lastIndex=0;
      (d.triggers||[]).forEach(function(t){if(t.toLowerCase().indexOf(q)!==-1)found++;});
      if(found){matches+=found;entryCount++;}
    });
    return{matches:matches,entryCount:entryCount};
  }
  function updMatchCount(){
    var isFnR=searchMode.value==='fnr';
    var q=searchInp.value.trim();
    if(!isFnR||!q){matchCountEl.textContent='';replaceAllBtn.disabled=true;replaceAllBtn.style.cssText='padding:5px 12px;font-size:.78rem;white-space:nowrap;opacity:.5;cursor:default';return;}
    var r=countMatches();
    if(!r.matches){
      matchCountEl.textContent='No matches';replaceAllBtn.disabled=true;replaceAllBtn.style.cssText='padding:5px 12px;font-size:.78rem;white-space:nowrap;opacity:.5;cursor:default';
    } else {
      matchCountEl.textContent=r.matches+' match'+(r.matches!==1?'es':'')+' in '+r.entryCount+' entr'+(r.entryCount!==1?'ies':'y');
      replaceAllBtn.disabled=false;replaceAllBtn.style.cssText='padding:5px 12px;font-size:.78rem;white-space:nowrap;opacity:1;cursor:pointer';
    }
  }


  searchInp.addEventListener('input',function(e){e.stopPropagation();applyFilter();});
  searchInp.addEventListener('keydown',function(e){
    if(e.key==='Enter'){
      e.stopPropagation();
      var first=eDiv.querySelector('._lb_search_match');
      if(first)first.scrollIntoView({behavior:'smooth',block:'center'});
    }
  });
  replaceInp.addEventListener('input',function(){updMatchCount();});
  replaceInp.addEventListener('keydown',function(e){if(e.key==='Tab'&&e.shiftKey){e.preventDefault();searchInp.focus();}});
  searchMode.addEventListener('change',function(){
    var isFnR=searchMode.value==='fnr';
    replaceRow.style.display=isFnR?'flex':'none';
    searchInp.placeholder=isFnR?'Find...':'Search entries...';
    if(!isFnR){
      eDiv.querySelectorAll('._lb_entry').forEach(function(el){
        el.classList.remove('_lb_search_match','_lb_search_dim');el.style.display='';
      });
    }
    applyFilter();
  });
  replaceAllBtn.addEventListener('click',function(e){
    e.stopPropagation();
    var find=searchInp.value.trim();var repl=replaceInp.value;if(!find)return;
    var re=new RegExp(regexEscape(find),'gi');
    eDiv.querySelectorAll('._lb_entry').forEach(function(el){
      if(!el._triggers)return;
      el._triggers=el._triggers.map(function(t){return t.replace(re,repl).trim();}).filter(Boolean);
      var seen={};el._triggers=el._triggers.filter(function(t){var k=t.toLowerCase();if(seen[k])return false;seen[k]=true;return true;});
      var ta=el.querySelector('textarea._lb_ta');
      if(ta){ta.value=ta.value.replace(re,repl);ta.dispatchEvent(new Event('input'));}
    });
    scheduleSave();applyFilter();
    replaceAllBtn.textContent='Done \u2713';
    setTimeout(function(){replaceAllBtn.textContent='Replace All';updMatchCount();},1500);
  });


  groupBtn.addEventListener('click',function(e){
    e.stopPropagation();
    var order=['Character','Item','PlotEvent','Location','Other'];
    var groups={};order.forEach(function(t){groups[t]=[];});groups['_other']=[];
    eDiv.querySelectorAll('._lb_entry').forEach(function(el){
      var t=el.dataset.type;
      if(groups[t])groups[t].push(el);else groups['_other'].push(el);
    });
    order.forEach(function(t){
      groups[t].forEach(function(el){eDiv.appendChild(el);});
    });
    groups['_other'].forEach(function(el){eDiv.appendChild(el);});
    renumberEntries();scheduleSave();
  });

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

  function buildJSON(){
    var name=document.getElementById('_lb_nm').value.trim()||'Untitled Lorebook';
    var entries={};var i=1;
    eDiv.querySelectorAll('._lb_entry').forEach(function(el){if(el._gd){entries[String(i)]=el._gd();i++;}});
    return JSON.stringify({name:name,entries:entries},null,4);
  }

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





  function buildTXT(){
    var state=getState();
    var lines=['LOREBOOK: '+(state.name||'My Lorebook'),''];
    state.entries.forEach(function(e){
      lines.push('=== '+e.name+' ===');
      lines.push('Type: '+e.type);
      if(e.triggers&&e.triggers.length){var sep=e.delim===';'?'; ':',';lines.push('Triggers: '+e.triggers.join(sep));}
      if(e.description)lines.push('Description: '+e.description);
      lines.push('');
    });
    return lines.join('\n');
  }
  function _dsk_u32(n){return[n&0xff,(n>>8)&0xff,(n>>16)&0xff,(n>>24)&0xff];}
  function _dsk_u16(n){return[n&0xff,(n>>8)&0xff];}
  function _dsk_crc32(bytes){var c=0xFFFFFFFF,t;for(var i=0;i<bytes.length;i++){t=(c^bytes[i])&0xff;for(var j=0;j<8;j++){t=t&1?(t>>>1)^0xEDB88320:(t>>>1);}c=(c>>>8)^t;}return(c^0xFFFFFFFF)>>>0;}
  function _dsk_buildZip(files){
    var enc=new TextEncoder();var localHeaders=[];var centralDir=[];var offset=0;
    files.forEach(function(f){
      var nameBytes=enc.encode(f.name);var data=f.data;var crc=_dsk_crc32(data);var sz=data.length;
      var lh=[0x50,0x4B,0x03,0x04,0x14,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00].concat(_dsk_u32(crc)).concat(_dsk_u32(sz)).concat(_dsk_u32(sz)).concat(_dsk_u16(nameBytes.length)).concat(_dsk_u16(0));
      var lhBytes=new Uint8Array(lh.length+nameBytes.length+sz);lhBytes.set(lh,0);lhBytes.set(nameBytes,lh.length);lhBytes.set(data,lh.length+nameBytes.length);localHeaders.push(lhBytes);
      var cd=[0x50,0x4B,0x01,0x02,0x14,0x00,0x14,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00].concat(_dsk_u32(crc)).concat(_dsk_u32(sz)).concat(_dsk_u32(sz)).concat(_dsk_u16(nameBytes.length)).concat(_dsk_u16(0)).concat(_dsk_u16(0)).concat(_dsk_u16(0)).concat(_dsk_u16(0)).concat(_dsk_u32(0)).concat(_dsk_u32(offset));
      var cdBytes=new Uint8Array(cd.length+nameBytes.length);cdBytes.set(cd,0);cdBytes.set(nameBytes,cd.length);centralDir.push(cdBytes);offset+=lhBytes.length;
    });
    var cdSize=centralDir.reduce(function(a,b){return a+b.length;},0);
    var eocd=[0x50,0x4B,0x05,0x06,0x00,0x00,0x00,0x00].concat(_dsk_u16(files.length)).concat(_dsk_u16(files.length)).concat(_dsk_u32(cdSize)).concat(_dsk_u32(offset)).concat(_dsk_u16(0));
    var total=offset+cdSize+eocd.length;var out=new Uint8Array(total);var pos=0;
    localHeaders.forEach(function(b){out.set(b,pos);pos+=b.length;});centralDir.forEach(function(b){out.set(b,pos);pos+=b.length;});out.set(new Uint8Array(eocd),pos);return out;
  }
  function downloadDOCX(filename,okEl){
    var state=getState();var lbName=state.name||'My Lorebook';
    function esc(s){return escHtml(s).replace(/"/g,'&quot;');}
    function para(text,style){return'<w:p><w:pPr><w:pStyle w:val="'+style+'"/></w:pPr><w:r><w:t xml:space="preserve">'+esc(text)+'</w:t></w:r></w:p>';}
    function boldPara(label,value){if(!value)return'';return'<w:p><w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">'+esc(label)+'</w:t></w:r><w:r><w:t xml:space="preserve"> '+esc(value)+'</w:t></w:r></w:p>';}
    function emptyPara(){return'<w:p><w:r><w:t></w:t></w:r></w:p>';}
    var bodyXML=para(lbName,'Heading1')+emptyPara();
    state.entries.forEach(function(e){
      bodyXML+=para(e.name,'Heading2');bodyXML+=boldPara('Type:',e.type);
      if(e.triggers&&e.triggers.length){var sep=e.delim===';'?'; ':',';bodyXML+=boldPara('Triggers:',e.triggers.join(sep));}
      if(e.description){bodyXML+='<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Description:</w:t></w:r></w:p>';e.description.split('\n').forEach(function(line){bodyXML+=para(line,'Normal');});}
      bodyXML+=emptyPara();
    });
    var docXML='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+bodyXML+'<w:sectPr><w:pgSz w:w="12240" w:h="15840"/></w:sectPr></w:body></w:document>';
    var stylesXML='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:sz w:val="24"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:sz w:val="40"/><w:color w:val="C0392B"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:pPr><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="2C3E50"/></w:rPr></w:style></w:styles>';
    var relsXML='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
    var docRelsXML='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
    var contentTypesXML='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>';
    var enc=new TextEncoder();
    try{
      var zip=_dsk_buildZip([
        {name:'[Content_Types].xml',data:enc.encode(contentTypesXML)},
        {name:'_rels/.rels',data:enc.encode(docRelsXML)},
        {name:'word/document.xml',data:enc.encode(docXML)},
        {name:'word/styles.xml',data:enc.encode(stylesXML)},
        {name:'word/_rels/document.xml.rels',data:enc.encode(relsXML)},
      ]);
      var blob=new Blob([zip],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
      var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();
      if(okEl){okEl.textContent='\u2713 Downloaded!';setTimeout(function(){okEl.textContent='';},2000);}
    }catch(err){if(okEl){okEl.textContent='Export error: '+err.message;setTimeout(function(){okEl.textContent='';},4000);}}
  }

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
