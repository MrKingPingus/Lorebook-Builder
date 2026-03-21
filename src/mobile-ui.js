function launchMobile(){
  if(document.getElementById('_lbm_app'))return;

  var currentLBKey=null;
  var TYPES=['Character','Item','PlotEvent','Location','Other'];
  var TYPE_COLORS={Character:'#c084fc',Item:'#60a5fa',Location:'#fbbf24',PlotEvent:'#f87171',Other:'#0d9488'};
  var TYPE_BG={Character:'#2e1065',Item:'#172554',Location:'#1c1200',PlotEvent:'#2d0a0a',Other:'#1a1a1a'};

  var CSS=_MOBILE_CSS;

  var st=document.createElement('style');st.id='_lbm_st';st.textContent=CSS;
  document.head.appendChild(st);

  var app=document.createElement('div');app.id='_lbm_app';

  var hd=document.createElement('div');hd.id='_lbm_hd';
  var h1=document.createElement('h1');h1.textContent='📖 LOREBOOK BUILDER';
  var hdr=document.createElement('div');hdr.id='_lbm_hd_right';
  var saveBadge=document.createElement('span');saveBadge.id='_lbm_savebadge';saveBadge.textContent='✓ Saved';
  var lbBtn=document.createElement('button');lbBtn.id='_lbm_lb_btn';lbBtn.title='Switch lorebook';
  lbBtn.innerHTML='📚 <span id="_lbm_lb_count"></span>';
  lbBtn.addEventListener('click',function(e){e.stopPropagation();openLBSheet();});
  var xbtn=document.createElement('button');xbtn.id='_lbm_xbtn';xbtn.textContent='✕';xbtn.title='Close';
  hdr.appendChild(saveBadge);hdr.appendChild(lbBtn);hdr.appendChild(xbtn);
  hd.appendChild(h1);hd.appendChild(hdr);

  var body=document.createElement('div');body.id='_lbm_body';

  var pBuild=document.createElement('div');pBuild.id='_lbm_p_build';pBuild.className='_lbm_panel active';

  var restoreDiv=document.createElement('div');restoreDiv.id='_lbm_restore';restoreDiv.style.display='none';
  var restoreP=document.createElement('p');
  var restoreBtns=document.createElement('div');restoreBtns.id='_lbm_restore_btns';
  var restoreYes=document.createElement('button');restoreYes.className='_lbm_restore_btn yes';restoreYes.textContent='Restore session';
  var restoreNo=document.createElement('button');restoreNo.className='_lbm_restore_btn no';restoreNo.textContent='Discard';
  restoreBtns.appendChild(restoreYes);restoreBtns.appendChild(restoreNo);
  restoreDiv.appendChild(restoreP);restoreDiv.appendChild(restoreBtns);

  var nameRow=document.createElement('div');nameRow.id='_lbm_name_row';
  var nameLbl=document.createElement('span');nameLbl.className='_lbm_name_label';nameLbl.textContent='Lorebook Name';
  var nameInp=document.createElement('input');nameInp.type='text';nameInp.id='_lbm_bookname';nameInp.placeholder='My Lorebook';
  nameRow.appendChild(nameLbl);nameRow.appendChild(nameInp);

  // ── Search / Find+Replace bar ──
  var listHd=document.createElement('div');listHd.id='_lbm_searchbar';

  var searchRow=document.createElement('div');searchRow.id='_lbm_search_row';
  var searchInp=document.createElement('input');searchInp.type='search';searchInp.id='_lbm_search';searchInp.placeholder='Search entries...';searchInp.setAttribute('autocomplete','off');
  var modeSel=document.createElement('select');modeSel.id='_lbm_mode_sel';
  var optSearch=document.createElement('option');optSearch.value='search';optSearch.textContent='Search';
  var optFnR=document.createElement('option');optFnR.value='fnr';optFnR.textContent='Find & Replace';
  modeSel.appendChild(optSearch);modeSel.appendChild(optFnR);
  searchRow.appendChild(searchInp);searchRow.appendChild(modeSel);

  var replaceRow=document.createElement('div');replaceRow.id='_lbm_replace_row';replaceRow.style.display='none';
  var replaceInp=document.createElement('input');replaceInp.type='text';replaceInp.id='_lbm_replace';replaceInp.placeholder='Replace with...';replaceInp.setAttribute('autocomplete','off');
  var replaceAllBtn=document.createElement('button');replaceAllBtn.id='_lbm_replace_all';replaceAllBtn.textContent='Replace All';replaceAllBtn.disabled=true;
  replaceRow.appendChild(replaceInp);replaceRow.appendChild(replaceAllBtn);

  var matchCount=document.createElement('div');matchCount.id='_lbm_match_count';

  listHd.appendChild(searchRow);listHd.appendChild(replaceRow);listHd.appendChild(matchCount);

  var filterRow=document.createElement('div');filterRow.id='_lbm_filter_row';
  var activeFilters=new Set(['All']);
  ['All','Character','Item','PlotEvent','Location','Other'].forEach(function(t){
    var b=document.createElement('button');b.className='_lbm_fbtn'+(t==='All'?' on':'');
    b.textContent=t;b.dataset.t=t;
    b.addEventListener('click',function(e){
      e.stopPropagation();
      if(e.shiftKey||t!=='All'&&activeFilters.has('All')){
        if(t==='All'){activeFilters=new Set(['All']);}
        else{activeFilters.delete('All');if(activeFilters.has(t))activeFilters.delete(t);else activeFilters.add(t);if(!activeFilters.size)activeFilters.add('All');}
      } else {activeFilters=new Set([t]);}
      filterRow.querySelectorAll('._lbm_fbtn').forEach(function(b){b.classList.toggle('on',activeFilters.has(b.dataset.t));});
      applyFilter();
    });
    filterRow.appendChild(b);
  });
  var grpBtn=document.createElement('button');grpBtn.className='_lbm_fbtn';grpBtn.id='_lbm_grp_btn';grpBtn.style.cssText='border-style:dashed';grpBtn.textContent='Group by type';
  grpBtn.addEventListener('click',function(){
    var order=['Character','Item','PlotEvent','Location','Other'];
    var sorted=entryOrder.slice().sort(function(a,b){return order.indexOf(entries[a].type)-order.indexOf(entries[b].type);});
    entryOrder.length=0;sorted.forEach(function(id){entryOrder.push(id);});
    sorted.forEach(function(id,i){var card=document.getElementById('_lbm_card_'+id);if(card){entriesDiv.appendChild(card);if(card._num)card._num.textContent='#'+(i+1);}});
    scheduleSave();
    grpBtn.classList.add('on');setTimeout(function(){grpBtn.classList.remove('on');},800);
  });
  filterRow.appendChild(grpBtn);

  var entriesDiv=document.createElement('div');entriesDiv.id='_lbm_entries';

  var emptyDiv=document.createElement('div');emptyDiv.id='_lbm_empty';emptyDiv.style.display='none';
  emptyDiv.innerHTML='<div class="big">📭</div><p>No entries yet</p><p>Tap + to add your first entry</p>';

  pBuild.appendChild(restoreDiv);
  pBuild.appendChild(nameRow);
  pBuild.appendChild(listHd);
  pBuild.appendChild(filterRow);
  pBuild.appendChild(entriesDiv);
  pBuild.appendChild(emptyDiv);

  var pConv=document.createElement('div');pConv.id='_lbm_p_impexp';pConv.className='_lbm_panel';

  var impSecLabel=document.createElement('p');impSecLabel.style.cssText='font-size:.7rem;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin:0 0 10px;padding:0 16px;padding-top:16px';impSecLabel.textContent='Import';
  pConv.appendChild(impSecLabel);

  var convSec1=document.createElement('div');convSec1.className='_lbm_section';
  var cs1h=document.createElement('h3');cs1h.textContent='Step 1 — Download a template';
  var cs1p=document.createElement('p');cs1p.textContent='Fill it out in any text editor or word processor, then upload it below.';
  var dlTxtBtn=document.createElement('button');dlTxtBtn.className='_lbm_btn';dlTxtBtn.textContent='⬇ Download .txt template';
  var dlDocxBtn=document.createElement('button');dlDocxBtn.className='_lbm_btn';dlDocxBtn.textContent='⬇ Download .docx template';
  convSec1.appendChild(cs1h);convSec1.appendChild(cs1p);convSec1.appendChild(dlTxtBtn);convSec1.appendChild(dlDocxBtn);

  var convSec2=document.createElement('div');convSec2.className='_lbm_section';
  var cs2h=document.createElement('h3');cs2h.textContent='Step 2 — Upload your template';
  var dropZone=document.createElement('div');dropZone.className='_lbm_drop';
  var dropP=document.createElement('p');dropP.textContent='Tap to browse for a .txt or .docx file';
  var fileInp=document.createElement('input');fileInp.type='file';fileInp.accept='.txt,.docx';fileInp.style.display='none';
  dropZone.appendChild(dropP);dropZone.appendChild(fileInp);
  var parseErr=document.createElement('div');parseErr.className='_lbm_parse_err';
  var previewList=document.createElement('div');previewList.className='_lbm_preview_list';previewList.style.display='none';
  var importBtn=document.createElement('button');importBtn.className='_lbm_btn primary';importBtn.textContent='Import These Entries →';importBtn.style.display='none';
  convSec2.appendChild(cs2h);convSec2.appendChild(dropZone);convSec2.appendChild(parseErr);convSec2.appendChild(previewList);convSec2.appendChild(importBtn);

  var loadSec=document.createElement('div');loadSec.className='_lbm_section';
  var lsh=document.createElement('h3');lsh.textContent='Load — continue a previous lorebook';
  var lsp=document.createElement('p');lsp.textContent='Paste a previously exported JSON to pick up where you left off.';
  var jin=document.createElement('textarea');jin.className='_lbm_ta_mono';jin.placeholder='Paste lorebook JSON here...';
  var jsonFileInp=document.createElement('input');jsonFileInp.type='file';jsonFileInp.accept='.json';jsonFileInp.style.display='none';
  var uploadJsonBtn=document.createElement('button');uploadJsonBtn.className='_lbm_btn';uploadJsonBtn.textContent='⬆ Upload .json file';
  uploadJsonBtn.addEventListener('click',function(){jsonFileInp.click();});
  jsonFileInp.addEventListener('change',function(){
    var file=jsonFileInp.files[0];if(!file)return;
    var r=new FileReader();r.onload=function(ev){jin.value=ev.target.result;};
    r.readAsText(file);jsonFileInp.value='';
  });
  var loadBtn=document.createElement('button');loadBtn.className='_lbm_btn primary';loadBtn.textContent='Load Lorebook';
  var jerr=document.createElement('div');jerr.className='_lbm_jerr';
  var clearBtn=document.createElement('button');clearBtn.className='_lbm_btn';clearBtn.style.marginTop='8px';clearBtn.textContent='Clear All & Start Fresh';
  loadSec.appendChild(lsh);loadSec.appendChild(lsp);loadSec.appendChild(uploadJsonBtn);loadSec.appendChild(jsonFileInp);loadSec.appendChild(jin);loadSec.appendChild(loadBtn);loadSec.appendChild(jerr);loadSec.appendChild(clearBtn);

  pConv.appendChild(convSec1);pConv.appendChild(convSec2);pConv.appendChild(loadSec);

  var pSave=pConv;

  var expSecLabel=document.createElement('p');expSecLabel.style.cssText='font-size:.7rem;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin:16px 0 10px;padding:0 16px';expSecLabel.textContent='Export';
  pSave.appendChild(expSecLabel);

  var saveSec=document.createElement('div');saveSec.className='_lbm_section';
  var ssh=document.createElement('h3');ssh.textContent='Export — save your work';
  var ssp=document.createElement('p');ssp.textContent='Copy or download your lorebook JSON. Load it back here later to keep editing.';
  var jout=document.createElement('textarea');jout.className='_lbm_ta_mono';jout.readOnly=true;jout.placeholder='Tap Generate to preview...';
  var genBtn=document.createElement('button');genBtn.className='_lbm_btn';genBtn.textContent='Generate JSON';
  var cpyBtn=document.createElement('button');cpyBtn.className='_lbm_btn primary';cpyBtn.textContent='Copy JSON';
  var dlJsonBtn=document.createElement('button');dlJsonBtn.className='_lbm_btn';dlJsonBtn.textContent='Download .json file';
  var okMsg=document.createElement('div');okMsg.className='_lbm_ok';
  saveSec.appendChild(ssh);saveSec.appendChild(ssp);saveSec.appendChild(jout);saveSec.appendChild(genBtn);saveSec.appendChild(cpyBtn);saveSec.appendChild(dlJsonBtn);saveSec.appendChild(okMsg);

  // ── Template Export section ──
  var exportSec=document.createElement('div');exportSec.className='_lbm_section';
  var exh=document.createElement('h3');exh.textContent='Export as Template';
  var exp=document.createElement('p');exp.textContent='Download the lorebook in template format — compatible with the Import tool and readable in any text editor or word processor.';
  var dlTxtBtn2=document.createElement('button');dlTxtBtn2.className='_lbm_btn';dlTxtBtn2.textContent='⬇ Download .txt';
  var dlDocxBtn2=document.createElement('button');dlDocxBtn2.className='_lbm_btn';dlDocxBtn2.textContent='⬇ Download .docx';
  var exOk=document.createElement('div');exOk.className='_lbm_ok';
  exportSec.appendChild(exh);exportSec.appendChild(exp);exportSec.appendChild(dlTxtBtn2);exportSec.appendChild(dlDocxBtn2);exportSec.appendChild(exOk);

  pSave.appendChild(saveSec);pSave.appendChild(exportSec);

  var pSettings=document.createElement('div');pSettings.id='_lbm_p_settings';pSettings.className='_lbm_panel';

  var setScroll=document.createElement('div');setScroll.style.cssText='padding:16px;display:flex;flex-direction:column;gap:14px';

  function mkToggle(title,desc,key,defaultVal,onChange){
    var wrap=document.createElement('div');wrap.className='_lbm_section';
    var row=document.createElement('div');row.style.cssText='display:flex;align-items:flex-start;justify-content:space-between;gap:12px';
    var info=document.createElement('div');
    var h=document.createElement('h3');h.textContent=title;
    var p=document.createElement('p');p.textContent=desc;p.style.cssText='font-size:.8rem;color:#64748b;margin:4px 0 0';
    info.appendChild(h);info.appendChild(p);
    var tog=document.createElement('button');tog.className='_lbm_toggle'+(window[key]?' on':'');
    tog.setAttribute('aria-checked',window[key]?'true':'false');
    var knob=document.createElement('span');knob.className='_lbm_tog_knob';
    tog.appendChild(knob);
    tog.addEventListener('click',function(){
      window[key]=!window[key];
      tog.classList.toggle('on',window[key]);
      tog.setAttribute('aria-checked',window[key]?'true':'false');
      try{localStorage.setItem(key,window[key]?'1':'0');}catch(e){}
      document.querySelectorAll('._lbm_cc').forEach(function(el){
        var n=parseInt(el.textContent)||0;
        if(window._lbm_tiered_counter){el.className='_lbm_cc'+(n>1250?' over':n>750?' warn':' good');}
        else{el.className='_lbm_cc'+(n>1500?' over':n>1200?' warn':'');}
      });
      if(onChange)onChange();
    });
    row.appendChild(info);row.appendChild(tog);
    wrap.appendChild(row);
    return wrap;
  }

  try{
    var saved_tc=localStorage.getItem('_lbm_tiered_counter');
    window._lbm_tiered_counter=(saved_tc===null)?true:(saved_tc==='1');
  }catch(e){window._lbm_tiered_counter=true;}
  try{
    var saved_ct=localStorage.getItem('_lbm_compact_triggers');
    window._lbm_compact_triggers=(saved_ct==='1');
  }catch(e){window._lbm_compact_triggers=false;}
  try{
    var saved_sc=localStorage.getItem('_lbm_sugs_collapsed');
    window._lbm_sugs_collapsed=(saved_sc==='1');
  }catch(e){window._lbm_sugs_collapsed=false;}
  try{
    var saved_hs=localStorage.getItem('_lbm_hide_stats');
    window._lbm_hide_stats=(saved_hs==='1');
  }catch(e){window._lbm_hide_stats=false;}

  setScroll.appendChild(mkToggle(
    'Tiered character counter',
    'Green 0–750 · Yellow 750–1250 · Red 1250–1500. Turn off for a simple red-at-1500 warning.',
    '_lbm_tiered_counter',
    true
  ));
  setScroll.appendChild(mkToggle(
    'Compact trigger input',
    'Use a single text field for triggers instead of individual tag chips.',
    '_lbm_compact_triggers',
    false
  ));
  setScroll.appendChild(mkToggle(
    'Hide suggestions by default',
    'Start with the Trigger Word Suggestions tray collapsed. You can still expand it manually per entry.',
    '_lbm_sugs_collapsed',
    false
  ));
  setScroll.appendChild(mkToggle(
    'Hide entry stats',
    'Hide the trigger count and character count shown on each entry.',
    '_lbm_hide_stats',
    false,
    function(){document.querySelectorAll('._lbm_card_stats').forEach(function(el){el.style.display=window._lbm_hide_stats?'none':'';});}
  ));

  pSettings.appendChild(setScroll);

  body.appendChild(pBuild);body.appendChild(pConv);body.appendChild(pSave);body.appendChild(pSettings);

  var nav=document.createElement('div');nav.id='_lbm_nav';
  var navData=[
    {id:'build',icon:'📋',label:'Build'},
    {id:'impexp',icon:'📤',label:'Import / Export'},
    {id:'settings',icon:'⚙',label:'Settings'}
  ];
  var navBtns={};
  navData.forEach(function(nd){
    var b=document.createElement('button');b.className='_lbm_navbtn'+(nd.id==='build'?' active':'');
    b.innerHTML='<span class="_lbm_navicon">'+nd.icon+'</span>'+nd.label;
    b.addEventListener('click',function(e){e.stopPropagation();switchTab(nd.id);});
    nav.appendChild(b);navBtns[nd.id]=b;
  });

  var fab=document.createElement('button');fab.id='_lbm_fab';fab.textContent='+';

  // ── FAB long-press menu ──
  var fabMenu=document.createElement('div');fabMenu.id='_lbm_fab_menu';

  function mkFabItem(icon, label, fn){
    var btn=document.createElement('button');btn.className='_lbm_fab_item';
    var ic=document.createElement('span');ic.className='_lbm_fab_icon';ic.textContent=icon;
    var lb=document.createElement('span');lb.textContent=label;
    btn.appendChild(ic);btn.appendChild(lb);
    btn.addEventListener('click',function(e){e.stopPropagation();closeFabMenu();fn();});
    return btn;
  }

  function openFabMenu(){
    var rect=fab.getBoundingClientRect();
    fabMenu.style.bottom=(window.innerHeight-rect.top+8)+'px';
    fabMenu.style.right=(window.innerWidth-rect.right)+'px';
    fabMenu.classList.add('open');
    document.addEventListener('click',closeFabMenuOutside,{once:true});
  }
  function closeFabMenu(){fabMenu.classList.remove('open');}
  function closeFabMenuOutside(e){if(!fabMenu.contains(e.target))closeFabMenu();}

  function doAddEntry(){
    switchTab('build');
    addEntry({});
    var cards=entriesDiv.querySelectorAll('._lbm_card:not(.hidden)');
    if(cards.length){
      var last=cards[cards.length-1];
      last.scrollIntoView({behavior:'smooth',block:'center'});
      setTimeout(function(){openEditor(last._entryId);},300);
    }
  }

  fabMenu.appendChild(mkFabItem('✦','New entry',doAddEntry));
  fabMenu.appendChild(mkFabItem('⬇','Import entries',function(){openImportSheet();}));
  fabMenu.appendChild(mkFabItem('📚','New lorebook',function(){promptSaveBeforeSwitch(null);}));
  app.appendChild(fabMenu);

  // Long-press: 450ms hold opens menu; short tap adds entry as before
  var fabPressTimer=null;var fabDidLongPress=false;
  fab.addEventListener('touchstart',function(e){
    e.preventDefault();e.stopPropagation();fabDidLongPress=false;
    fabPressTimer=setTimeout(function(){
      fabDidLongPress=true;
      openFabMenu();
      if(navigator.vibrate)navigator.vibrate(30);
    },450);
  },{passive:false});
  fab.addEventListener('touchend',function(e){
    e.preventDefault();e.stopPropagation();
    clearTimeout(fabPressTimer);
    if(!fabDidLongPress){doAddEntry();}
  },{passive:false});
  fab.addEventListener('touchcancel',function(){clearTimeout(fabPressTimer);});
  fab.addEventListener('contextmenu',function(e){e.preventDefault();});
  // Mouse fallback for desktop
  fab.addEventListener('mousedown',function(e){
    e.stopPropagation();fabDidLongPress=false;
    fabPressTimer=setTimeout(function(){
      fabDidLongPress=true;openFabMenu();
    },450);
  });
  fab.addEventListener('mouseup',function(e){
    clearTimeout(fabPressTimer);
    if(!fabDidLongPress){e.stopPropagation();doAddEntry();}
  });

  // ── Import sheet ──
  var importSheet=document.createElement('div');importSheet.id='_lbm_import_sheet';

  var importHd=document.createElement('div');importHd.id='_lbm_import_sheet_hd';
  var importTitle=document.createElement('h3');importTitle.textContent='Import Entries';
  var importClose=document.createElement('button');importClose.style.cssText='background:none;border:none;color:#6b7280;font-size:1.3rem;cursor:pointer;padding:4px;line-height:1';importClose.textContent='✕';
  importClose.addEventListener('click',function(){closeImportSheet();});
  importHd.appendChild(importTitle);importHd.appendChild(importClose);

  var importBody=document.createElement('div');importBody.id='_lbm_import_sheet_body';

  var importHint=document.createElement('div');importHint.id='_lbm_import_hint';
  importHint.innerHTML='Paste one or more entries. Two formats are supported:<br><code style="color:#6ee7b7;background:#0f172a;padding:1px 5px;border-radius:3px">=== Entry Name ===</code> or <code style="color:#6ee7b7;background:#0f172a;padding:1px 5px;border-radius:3px">Entry Name: XXX</code><br>Type, Triggers and Description are optional in both.';

  var importTA=document.createElement('textarea');importTA.id='_lbm_import_ta';
  importTA.placeholder='=== Elara Voss ===\nType: Character\nTriggers: elara, pale flame\nDescription: A battle-worn sorceress...\n\nEntry Name: The Iron Keep\nEntry Type: Location\nTriggers: the keep, iron keep\nDescription: A frost-covered fortress.';

  var importErr=document.createElement('div');importErr.id='_lbm_import_err';

  var importPreview=document.createElement('div');importPreview.id='_lbm_import_preview';
  var importPreviewTitle=document.createElement('div');importPreviewTitle.style.cssText='font-size:.7rem;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px';importPreviewTitle.textContent='Detected entries:';
  importPreview.appendChild(importPreviewTitle);

  var importBtns=document.createElement('div');importBtns.id='_lbm_import_btns';
  var importPreviewBtn=document.createElement('button');importPreviewBtn.className='_lbm_btn';importPreviewBtn.style.cssText='flex:1;padding:12px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#94a3b8;font-size:.9rem;cursor:pointer;font-family:system-ui,sans-serif;text-align:center';importPreviewBtn.textContent='Preview';
  var importConfirmBtn=document.createElement('button');importConfirmBtn.style.cssText='flex:1;padding:12px;border-radius:8px;border:none;background:#ef4444;color:#fff;font-size:.9rem;font-weight:600;cursor:pointer;font-family:system-ui,sans-serif;display:none';importConfirmBtn.textContent='Import All →';

  importBtns.appendChild(importPreviewBtn);importBtns.appendChild(importConfirmBtn);

  importBody.appendChild(importHint);
  importBody.appendChild(importTA);
  importBody.appendChild(importErr);
  importBody.appendChild(importPreview);
  importBody.appendChild(importBtns);
  importSheet.appendChild(importHd);importSheet.appendChild(importBody);
  app.appendChild(importSheet);

  function openImportSheet(){
    importTA.value='';importErr.textContent='';
    importPreview.style.display='none';importConfirmBtn.style.display='none';
    importSheet.classList.add('open');
    setTimeout(function(){importTA.focus();},300);
  }
  function closeImportSheet(){
    importSheet.classList.remove('open');
  }

  function parseImportText(text){
    // Normalise line endings
    text=text.replace(/\r\n/g,'\n').replace(/\r/g,'\n').replace(/\*\*/g,'');

    var blocks=[];
    var TRIPLE=  /^===\s*.+\s*===/;
    var KV_NAME= /^(?:Entry\s+)?(?:Name|Title|Label)\s*:/i;

    var lines=text.split('\n');
    var cur=null;
    lines.forEach(function(line){
      if(TRIPLE.test(line.trim())||KV_NAME.test(line)){
        if(cur!==null)blocks.push(cur);
        cur=[line];
      } else {
        if(cur!==null)cur.push(line);
      }
    });
    if(cur!==null)blocks.push(cur);

    return blocks.map(function(blines){
      var entry={name:'',type:'Character',triggers:[],description:'',delim:','};
      var descLines=[];var m;

      blines.forEach(function(line){
        if((m=line.trim().match(/^===\s*(.+?)\s*===$/))){entry.name=m[1].trim();return;}
        if((m=line.match(/^(?:Entry\s+)?(?:Name|Title|Label)\s*:\s*(.+)/i)))                  {entry.name=m[1].trim();return;}
        if((m=line.match(/^(?:Entry\s+)?(?:Type|Category|Kind|Classification)\s*:\s*(.+)/i))) {entry.type=m[1].trim();return;}
        if((m=line.match(/^(?:Triggers?|Keywords?|Aliases?|Tags?|Keys?)\s*:\s*(.+)/i))){
          var raw=m[1];var semi=raw.indexOf(';')!==-1;
          entry.delim=semi?';':',';
          entry.triggers=raw.split(semi?';':',').map(function(t){return t.trim();}).filter(Boolean);
          return;
        }
        var dm=line.match(/^Description\s*:\s*(.*)/i);
        descLines.push(dm?dm[1]:line);
      });

      if(descLines.length)entry.description=descLines.join('\n').trim();
      return entry;
    }).filter(function(e){return e.name;});
  }

  importPreviewBtn.addEventListener('click',function(){
    importErr.textContent='';
    var parsed=parseImportText(importTA.value);
    if(!parsed.length){
      importErr.textContent='No entries found. Make sure each entry starts with === Entry Name ===';
      importPreview.style.display='none';importConfirmBtn.style.display='none';
      return;
    }
    // Render preview
    var rows=importPreview.querySelectorAll('._lbm_import_prev_entry');
    rows.forEach(function(r){r.remove();});
    parsed.forEach(function(e){
      var row=document.createElement('div');row.className='_lbm_import_prev_entry';
      var nm=document.createElement('div');nm.className='_lbm_import_prev_name';nm.textContent=e.name;
      var meta=document.createElement('div');meta.className='_lbm_import_prev_meta';
      var parts=[e.type];
      if(e.triggers.length)parts.push(e.triggers.length+' trigger'+(e.triggers.length>1?'s':''));
      if(e.description)parts.push(e.description.length+' char desc');
      meta.textContent=parts.join(' · ');
      row.appendChild(nm);row.appendChild(meta);
      importPreview.appendChild(row);
    });
    importPreview.style.display='block';
    importConfirmBtn.style.display='block';
    importConfirmBtn._parsed=parsed;
  });

  importConfirmBtn.addEventListener('click',function(){
    var parsed=importConfirmBtn._parsed;if(!parsed)return;
    parsed.forEach(function(e){addEntry(e);});
    closeImportSheet();
    switchTab('build');
    // Scroll to first imported entry
    setTimeout(function(){
      var cards=entriesDiv.querySelectorAll('._lbm_card:not(.hidden)');
      if(cards.length){cards[cards.length-parsed.length].scrollIntoView({behavior:'smooth',block:'center'});}
    },300);
  });

  // Dismiss sheet on backdrop tap
  importSheet.addEventListener('click',function(e){if(e.target===importSheet)closeImportSheet();});

  var editor=document.createElement('div');editor.id='_lbm_editor';
  var edHd=document.createElement('div');edHd.id='_lbm_ed_hd';
  var backBtn=document.createElement('button');backBtn.id='_lbm_back';backBtn.innerHTML='← Back';
  var edTitle=document.createElement('div');edTitle.id='_lbm_ed_title';edTitle.textContent='Entry';
  var edDel=document.createElement('button');edDel.id='_lbm_ed_del';edDel.textContent='Remove';
  edHd.appendChild(backBtn);edHd.appendChild(edTitle);edHd.appendChild(edDel);
  var edBody=document.createElement('div');edBody.id='_lbm_ed_body';
  editor.appendChild(edHd);editor.appendChild(edBody);

  app.appendChild(hd);app.appendChild(body);app.appendChild(nav);app.appendChild(fab);app.appendChild(editor);
  document.body.appendChild(app);
