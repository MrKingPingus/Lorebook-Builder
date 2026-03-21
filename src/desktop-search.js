
  // ── DESKTOP: Search, Filter & Find-Replace ──────────────────────────────────
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
