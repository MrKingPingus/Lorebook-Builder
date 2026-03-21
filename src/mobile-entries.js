
  // ── MOBILE: Entry State & Card Rendering ─────────────────────────────────

  var HL_MARK='background:#fef08a;color:#111827;border-radius:2px;padding:0 1px';
  var entries={};
  var entryOrder=[];
  var nextId=1;
  var currentEditId=null;
  var currentSyncDescHl=null;
  var saveTimer=null;

  function getState(){
    return{name:nameInp.value.trim(),entries:entryOrder.map(function(id){return entries[id];}),ts:Date.now()};
  }
  function saveNow(){
    try{
      var state=getState();localStorage.setItem(currentLBKey,JSON.stringify(state));
      var idx=lbIndex();var slot=idx.find(function(x){return x.key===currentLBKey;});
      if(slot){slot.name=state.name||'Untitled';slot.ts=state.ts;}lbSaveIndex(idx);
      updLBBtn();
      saveBadge.classList.add('show');clearTimeout(saveBadge._t);
      saveBadge._t=setTimeout(function(){saveBadge.classList.remove('show');},1800);
    }catch(e){}
  }
  function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(saveNow,400);}
  window.addEventListener('beforeunload',function(){saveNow();});
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')saveNow();});
  function updLBBtn(){var idx=lbIndex();var el=document.getElementById('_lbm_lb_count');if(el)el.textContent=idx.length;}

  function mkEntry(data){
    var id='e'+(nextId++);
    var d=data||{};
    entries[id]={
      id:id,
      name:d.name||'',
      type:d.type||'Character',
      triggers:Array.isArray(d.triggers)?d.triggers:(d.triggers?[d.triggers]:[]),
      description:d.description||'',
      delim:d.delim||','
    };
    entryOrder.push(id);
    return id;
  }

  function addEntry(data){
    var id=mkEntry(data);
    renderCard(id);
    updateEmpty();
    scheduleSave();
    return id;
  }

  function removeEntry(id){
    delete entries[id];
    entryOrder.splice(entryOrder.indexOf(id),1);
    var card=document.getElementById('_lbm_card_'+id);
    if(card)card.remove();
    updateEmpty();
    renumber();
    scheduleSave();
  }

  function mkStatEl(val, max, label){
    var el=document.createElement('div');el.className='_lbm_stat';
    el.textContent=val+'/'+max+' '+label;
    var ratio=val/max;
    el.classList.add(ratio>=1?'over':ratio>=0.8?'warn':'ok');
    return el;
  }

    function renderCard(id){
    var e=entries[id];
    var card=document.createElement('div');card.className='_lbm_card';card.id='_lbm_card_'+id;
    card._entryId=id;

    var stripe=document.createElement('div');stripe.className='_lbm_card_stripe';
    stripe.style.background=TYPE_COLORS[e.type]||'#334155';

    var cbody=document.createElement('div');cbody.className='_lbm_card_body';
    var cnum=document.createElement('div');cnum.className='_lbm_card_num';
    var cname=document.createElement('div');cname.className='_lbm_card_name'+(e.name?'':' empty');
    cname.textContent=e.name||'Untitled entry';
    var ctype=document.createElement('div');ctype.className='_lbm_card_type';ctype.textContent=e.type;
    cbody.appendChild(cnum);cbody.appendChild(cname);cbody.appendChild(ctype);

    var cstats=document.createElement('div');cstats.className='_lbm_card_stats';
    cstats.style.display=window._lbm_hide_stats?'none':'';
    cstats.appendChild(mkStatEl(e.triggers.length,25,'trg'));
    cstats.appendChild(mkStatEl((e.description||'').length,1500,'chr'));

    var arrow=document.createElement('div');arrow.className='_lbm_card_arrow';arrow.textContent='›';

    card.appendChild(stripe);card.appendChild(cbody);card.appendChild(cstats);card.appendChild(arrow);
    card._num=cnum;card._name=cname;card._type=ctype;card._stripe=stripe;card._stats=cstats;

    card.addEventListener('click',function(){openEditor(id);});
    entriesDiv.appendChild(card);
    renumber();
  }

  function updateCard(id){
    var card=document.getElementById('_lbm_card_'+id);
    if(!card)return;
    var e=entries[id];
    card._stripe.style.background=TYPE_COLORS[e.type]||'#334155';
    card._name.textContent=e.name||'Untitled entry';
    card._name.className='_lbm_card_name'+(e.name?'':' empty');
    card._type.textContent=e.type;
    if(card._stats){
      card._stats.style.display=window._lbm_hide_stats?'none':'';
      card._stats.innerHTML='';
      card._stats.appendChild(mkStatEl(e.triggers.length,25,'trg'));
      card._stats.appendChild(mkStatEl((e.description||'').length,1500,'chr'));
    }
  }

  function renumber(){
    entryOrder.forEach(function(id,i){
      var card=document.getElementById('_lbm_card_'+id);
      if(card&&card._num)card._num.textContent='#'+(i+1);
    });
  }

  function updateEmpty(){
    var hasAny=entryOrder.length>0;
    entriesDiv.style.display=hasAny?'':'none';
    emptyDiv.style.display=hasAny?'none':'block';
  }

  function applyFilter(){
    var q=searchInp.value.trim().toLowerCase();
    var isFnR=modeSel.value==='fnr';
    entryOrder.forEach(function(id){
      var e=entries[id];
      var card=document.getElementById('_lbm_card_'+id);
      if(!card)return;
      var typeOk=activeFilters.has('All')||activeFilters.has(e.type);
      var searchOk=!q||(
        e.name.toLowerCase().indexOf(q)!==-1||
        (e.description||'').toLowerCase().indexOf(q)!==-1||
        (e.triggers||[]).join(' ').toLowerCase().indexOf(q)!==-1
      );
      card.classList.toggle('hidden',!(typeOk&&searchOk));
      // Highlight match in card name
      if(card._name){
        if(q&&searchOk&&!isFnR){
          var hlRe=new RegExp('('+regexEscape(q)+')','gi');
          card._name.innerHTML=escHtml(e.name||'Untitled entry').replace(hlRe,'<mark style="'+HL_MARK+'">$1</mark>');
        } else {
          card._name.textContent=e.name||'Untitled entry';
        }
      }
    });
    // Sync description highlight overlay in the open editor
    if(currentSyncDescHl){
      var esc2=q?regexEscape(q):'';
      var hlRe2=esc2?new RegExp('('+esc2+')','gi'):null;
      var openEntry=currentEditId?entries[currentEditId]:null;
      var openMatch=openEntry&&hlRe2&&(
        (openEntry.name||'').toLowerCase().indexOf(q)!==-1||
        (openEntry.description||'').toLowerCase().indexOf(q)!==-1||
        (openEntry.triggers||[]).join(' ').toLowerCase().indexOf(q)!==-1
      );
      currentSyncDescHl(openMatch?hlRe2:null);
    }
    renumber();
    updMatchCount();
  }

  function countMatches(){
    var q=searchInp.value.trim().toLowerCase();
    if(!q)return{matches:0,entryCount:0};
    var matches=0;var entryCount=0;
    entryOrder.forEach(function(id){
      var e=entries[id];
      var found=0;
      var re=new RegExp(regexEscape(q),'gi');
      var hits=(e.description||'').match(re);if(hits)found+=hits.length;
      (e.triggers||[]).forEach(function(t){var th=t.toLowerCase().indexOf(q);if(th!==-1)found++;});
      if(found){matches+=found;entryCount++;}
    });
    return{matches:matches,entryCount:entryCount};
  }

  function updMatchCount(){
    var isFnR=modeSel.value==='fnr';
    var q=searchInp.value.trim();
    if(!isFnR||!q){matchCount.textContent='';replaceAllBtn.disabled=true;return;}
    var r=countMatches();
    if(!r.matches){
      matchCount.textContent='No matches';replaceAllBtn.disabled=true;
    } else {
      matchCount.textContent=r.matches+' match'+(r.matches!==1?'es':'')+' in '+r.entryCount+' entr'+(r.entryCount!==1?'ies':'y');
      replaceAllBtn.disabled=false;
    }
  }

  searchInp.addEventListener('input',function(){applyFilter();});
  replaceInp.addEventListener('input',function(){updMatchCount();});

  modeSel.addEventListener('change',function(){
    var isFnR=modeSel.value==='fnr';
    replaceRow.style.display=isFnR?'flex':'none';
    searchInp.placeholder=isFnR?'Find...':'Search entries...';
    // Clear highlights when switching back to search
    if(!isFnR){
      entryOrder.forEach(function(id){
        var card=document.getElementById('_lbm_card_'+id);
        var e=entries[id];
        if(card&&card._name)card._name.textContent=e.name||'Untitled entry';
      });
    }
    applyFilter();
  });

  replaceAllBtn.addEventListener('click',function(){
    var find=searchInp.value.trim();
    var repl=replaceInp.value;
    if(!find)return;
    var re=new RegExp(regexEscape(find),'gi');
    var changed=0;
    entryOrder.forEach(function(id){
      var e=entries[id];
      // Replace in description
      if(e.description){
        var nd=e.description.replace(re,repl);
        if(nd!==e.description){e.description=nd;changed++;}
      }
      // Replace in triggers
      e.triggers=e.triggers.map(function(t){
        var nt=t.replace(re,repl).trim();
        return nt;
      }).filter(Boolean);
      // Deduplicate triggers after replace
      var seen={};e.triggers=e.triggers.filter(function(t){
        var k=t.toLowerCase();if(seen[k])return false;seen[k]=true;return true;
      });
      updateCard(id);
    });
    // If editor is open, refresh it
    if(currentEditId){
      var edBodyEl=document.getElementById('_lbm_ed_body');
      if(edBodyEl)openEditor(currentEditId);
    }
    scheduleSave();
    applyFilter();
    // Flash feedback
    replaceAllBtn.textContent='Done ✓';
    setTimeout(function(){replaceAllBtn.textContent='Replace All';updMatchCount();},1500);
  });
