function launchMobile(){
  if(document.getElementById('_lbm_app'))return;

  var currentLBKey=null;
  var TYPES=['Character','Item','PlotEvent','Location','Other'];
  var TYPE_COLORS={Character:'#c084fc',Item:'#60a5fa',Location:'#fbbf24',PlotEvent:'#f87171',Other:'#0d9488'};
  var TYPE_BG={Character:'#2e1065',Item:'#172554',Location:'#1c1200',PlotEvent:'#2d0a0a',Other:'#1a1a1a'};

  var CSS=[
    '*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}',
    '#_lbm_app{position:fixed;top:0;left:0;width:100%;height:100%;background:#111827;display:flex;flex-direction:column;font-family:system-ui,sans-serif;color:#e5e7eb;z-index:2147483647;overflow:hidden}',
    '#_lbm_hd{background:#0f172a;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #1e293b;flex-shrink:0;min-height:52px}',
    '#_lbm_hd h1{margin:0;font-size:.95rem;color:#f87171;letter-spacing:.06em;font-weight:700}',
    '#_lbm_hd_right{display:flex;align-items:center;gap:10px}',
    '#_lbm_savebadge{font-size:.72rem;color:#34d399;opacity:0;transition:opacity .4s}',
    '#_lbm_savebadge.show{opacity:1}',
    '#_lbm_lb_btn{background:none;border:1px solid #334155;border-radius:7px;color:#94a3b8;font-size:.72rem;cursor:pointer;padding:4px 10px;font-family:system-ui,sans-serif;white-space:nowrap;display:flex;align-items:center;gap:5px}',
    '#_lbm_lb_btn:active{border-color:#f87171;color:#f87171}',
    '#_lbm_lb_sheet{position:fixed;bottom:0;left:0;width:100%;background:#1e293b;border-radius:20px 20px 0 0;border-top:1px solid #334155;z-index:2147483650;transform:translateY(100%);transition:transform .25s ease;padding-bottom:env(safe-area-inset-bottom,0px);max-height:75vh;display:flex;flex-direction:column}',
    '#_lbm_lb_sheet.open{transform:translateY(0)}',
    '#_lbm_lb_sheet_hd{padding:16px 18px 8px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;border-bottom:1px solid #1e293b}',
    '#_lbm_lb_sheet_hd h3{margin:0;font-size:.95rem;color:#e5e7eb;font-weight:600}',
    '#_lbm_lb_sheet_body{flex:1;overflow-y:auto;padding:8px 0 16px}',
    '._lbm_lb_item{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;cursor:pointer;border-bottom:1px solid #0f172a}',
    '._lbm_lb_item:active{background:#334155}',
    '._lbm_lb_item.current{border-left:3px solid #f87171;padding-left:15px}',
    '._lbm_lb_item_info{flex:1;min-width:0}',
    '._lbm_lb_item_name{font-size:.9rem;font-weight:600;color:#e5e7eb;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '._lbm_lb_item_meta{font-size:.7rem;color:#475569;margin-top:2px}',
    '._lbm_lb_item_del{background:none;border:none;color:#374151;font-size:1rem;cursor:pointer;padding:4px 8px;flex-shrink:0}',
    '._lbm_lb_item_del:active{color:#ef4444}',
    '#_lbm_lb_new{display:flex;align-items:center;gap:10px;padding:14px 18px;cursor:pointer;color:#34d399;font-size:.9rem;font-family:system-ui,sans-serif;border:none;background:none;width:100%;text-align:left;margin-top:4px}',
    '#_lbm_lb_new:active{opacity:.7}',
    '#_lbm_save_prompt{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:2147483651;display:flex;align-items:flex-end}',
    '#_lbm_save_prompt_box{background:#1e293b;border-radius:20px 20px 0 0;width:100%;padding:20px 18px calc(20px + env(safe-area-inset-bottom,0px));border-top:1px solid #334155}',
    '#_lbm_save_prompt_box h3{margin:0 0 6px;font-size:.95rem;color:#e5e7eb}',
    '#_lbm_save_prompt_box p{margin:0 0 16px;font-size:.82rem;color:#64748b;line-height:1.5}',
    '#_lbm_save_prompt_btns{display:flex;flex-direction:column;gap:8px}',
    '._lbm_sp_btn{padding:13px;border-radius:10px;border:1px solid #334155;background:#111827;color:#e5e7eb;font-size:.88rem;cursor:pointer;font-family:system-ui,sans-serif;text-align:center}',
    '._lbm_sp_btn.primary{background:#ef4444;border-color:#ef4444;font-weight:600}',
    '._lbm_sp_btn.green{background:#059669;border-color:#059669;font-weight:600}',
    '#_lbm_savebadge.show{opacity:1}',
    '#_lbm_xbtn{background:none;border:none;color:#6b7280;font-size:1.3rem;cursor:pointer;padding:4px;line-height:1}',
    '#_lbm_body{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;min-height:0}',
    '._lbm_panel{display:none;width:100%;min-height:100%}',
    '._lbm_panel.active{display:block}',
    '#_lbm_nav{background:#0f172a;border-top:1px solid #1e293b;display:flex;flex-shrink:0;padding-bottom:env(safe-area-inset-bottom,0px)}',
    '._lbm_navbtn{flex:1;background:none;border:none;color:#6b7280;padding:10px 4px 8px;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;font-family:system-ui,sans-serif;font-size:.65rem;letter-spacing:.03em;text-transform:uppercase;transition:color .15s}',
    '._lbm_navbtn.active{color:#f87171}',
    '._lbm_navicon{font-size:1.2rem;line-height:1}',
    '#_lbm_list_header{padding:12px 16px 8px;display:flex;align-items:center;gap:8px}',
    '#_lbm_search{flex:1;background:#1e293b;border:1px solid #334155;border-radius:8px;color:#e5e7eb;padding:8px 12px;font-size:16px;outline:none;font-family:system-ui,sans-serif}',
    '#_lbm_search:focus{border-color:#f87171}',
    '#_lbm_search::placeholder{color:#475569}',
    '#_lbm_filter_row{padding:8px 16px 10px;display:flex;gap:6px;flex-wrap:wrap}',
    '#_lbm_filter_row_inner{display:flex;gap:6px;flex-wrap:wrap;align-items:center}',
    '._lbm_fbtn{flex-shrink:0;padding:5px 12px;border-radius:16px;border:1px solid #334155;background:transparent;color:#64748b;font-size:.75rem;cursor:pointer;font-family:system-ui,sans-serif;white-space:nowrap}',
    '._lbm_fbtn.on{color:#fff;border-color:transparent}',
    '._lbm_fbtn[data-t="All"].on{background:#475569}',
    '._lbm_fbtn[data-t="Character"].on{background:#9333ea}',
    '._lbm_fbtn[data-t="Item"].on{background:#1d4ed8}',
    '._lbm_fbtn[data-t="Location"].on{background:#d97706}',
    '._lbm_fbtn[data-t="PlotEvent"].on{background:#dc2626}',
    '._lbm_fbtn[data-t="Other"].on{background:#0d9488}',
    '#_lbm_entries{padding:0 12px 100px}',
    '._lbm_card{display:flex;align-items:center;background:#1e293b;border-radius:10px;margin-bottom:8px;overflow:hidden;cursor:pointer;border:1px solid #334155;transition:border-color .15s;-webkit-user-select:none}',
    '._lbm_card:active{background:#263548}',
    '._lbm_card.hidden{display:none}',
    '._lbm_card_stripe{width:4px;align-self:stretch;flex-shrink:0}',
    '._lbm_card_body{flex:1;padding:12px 10px;min-width:0}',
    '._lbm_card_num{font-size:.68rem;color:#64748b;font-weight:600;letter-spacing:.06em;margin-bottom:2px}',
    '._lbm_card_name{font-size:.95rem;font-weight:600;color:#e5e7eb;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '._lbm_card_name.empty{color:#475569;font-style:italic}',
    '._lbm_card_type{font-size:.7rem;color:#64748b;margin-top:2px}',
    '._lbm_card_arrow{color:#475569;font-size:1rem;padding:0 8px;flex-shrink:0}',
    '._lbm_card_stats{display:flex;flex-direction:column;align-items:flex-end;gap:3px;padding:0 4px;flex-shrink:0;justify-content:center}',
    '._lbm_stat{font-size:.62rem;font-weight:600;letter-spacing:.02em;white-space:nowrap;opacity:.85}',
    '._lbm_stat.ok{color:#34d399}',
    '._lbm_stat.warn{color:#f59e0b}',
    '._lbm_stat.over{color:#ef4444}',
    '#_lbm_empty{text-align:center;padding:60px 32px;color:#475569}',
    '#_lbm_empty p{margin:.5rem 0;font-size:.9rem}',
    '#_lbm_empty .big{font-size:2rem;margin-bottom:8px}',
    '#_lbm_fab{position:fixed;bottom:calc(64px + env(safe-area-inset-bottom,0px) + 16px);right:18px;width:52px;height:52px;border-radius:50%;background:#ef4444;border:none;color:#fff;font-size:1.6rem;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10;box-shadow:0 4px 14px rgba(239,68,68,.4);user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}',
    '#_lbm_editor{position:fixed;top:0;left:0;width:100%;height:100%;background:#111827;display:flex;flex-direction:column;z-index:2147483648;transform:translateX(100%);transition:transform .25s ease}',
    '#_lbm_editor.open{transform:translateX(0)}',
    '#_lbm_ed_hd{background:#0f172a;padding:12px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #1e293b;flex-shrink:0}',
    '#_lbm_back{background:none;border:none;color:#f87171;font-size:1rem;cursor:pointer;padding:4px;display:flex;align-items:center;gap:6px;font-family:system-ui,sans-serif;font-weight:600}',
    '#_lbm_ed_title{flex:1;font-size:.9rem;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '#_lbm_ed_del{background:none;border:1px solid #374151;border-radius:6px;color:#6b7280;padding:5px 10px;font-size:.78rem;cursor:pointer;font-family:system-ui,sans-serif}',
    '#_lbm_ed_del:active{border-color:#ef4444;color:#ef4444}',
    '#_lbm_ed_body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:16px}',
    '._lbm_field{margin-bottom:16px}',
    '._lbm_label{display:block;font-size:.72rem;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}',
    '._lbm_inp,._lbm_ta{width:100%;background:#1e293b;border:1px solid #334155;border-radius:8px;color:#e5e7eb;padding:12px;font-size:16px;outline:none;font-family:system-ui,sans-serif}',
    '._lbm_inp:focus,._lbm_ta:focus{border-color:#f87171}',
    '._lbm_ta{resize:none;min-height:120px;line-height:1.6;overflow:hidden}',
    '._lbm_ta_tab{display:flex;justify-content:center;align-items:center;cursor:ns-resize;padding:4px 0;user-select:none;touch-action:none}',
    '._lbm_ta_tab::before{content:"";width:40px;height:4px;background:#334155;border-radius:2px;transition:background .15s}',
    '._lbm_ta_tab:active::before{background:#64748b}',
    '._lbm_cc{font-size:.72rem;text-align:right;margin-top:4px;color:#475569}',
    '._lbm_cc.warn{color:#f59e0b}',
    '._lbm_cc.over{color:#ef4444;font-weight:700}',
    '#_lbm_type_row{display:flex;gap:6px;flex-wrap:wrap}',
    '._lbm_typebtn{flex:1;min-width:80px;padding:10px 6px;border-radius:8px;border:2px solid #334155;background:#1e293b;color:#64748b;font-size:.78rem;font-weight:600;cursor:pointer;text-align:center;font-family:system-ui,sans-serif;transition:all .15s}',
    '._lbm_typebtn.sel{color:#fff;border-color:transparent}',
    '._lbm_typebtn[data-t="Character"].sel{background:#9333ea}',
    '._lbm_typebtn[data-t="Item"].sel{background:#1d4ed8}',
    '._lbm_typebtn[data-t="Location"].sel{background:#d97706}',
    '._lbm_typebtn[data-t="PlotEvent"].sel{background:#dc2626}',
    '._lbm_typebtn[data-t="Other"].sel{background:#0d9488}',
    '#_lbm_delim_row{display:flex;gap:8px;margin-top:8px}',
    '._lbm_delimbtn{flex:1;padding:8px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#64748b;font-size:.8rem;cursor:pointer;font-family:system-ui,sans-serif;text-align:center}',
    '._lbm_delimbtn.sel{background:#1e293b;border-color:#f87171;color:#f87171}',
    '._lbm_hint{font-size:.72rem;color:#475569;margin-top:4px}',
    '#_lbm_move_row{display:flex;gap:8px;margin-top:16px}',
    '._lbm_movebtn{flex:1;padding:10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#94a3b8;font-size:.85rem;cursor:pointer;font-family:system-ui,sans-serif;text-align:center}',
    '._lbm_movebtn:active{border-color:#f87171;color:#f87171}',
    '._lbm_section{margin:16px;background:#1e293b;border-radius:12px;padding:16px;border:1px solid #334155}',
    '._lbm_section h3{margin:0 0 4px;font-size:.8rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;font-weight:600}',
    '._lbm_section p{margin:0 0 12px;font-size:.85rem;color:#64748b;line-height:1.5}',
    '._lbm_btn{width:100%;padding:12px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#94a3b8;font-size:.9rem;cursor:pointer;font-family:system-ui,sans-serif;text-align:center;margin-bottom:8px;display:block}',
    '._lbm_btn:last-child{margin-bottom:0}',
    '._lbm_btn.primary{background:#ef4444;border-color:#ef4444;color:#fff}',
    '._lbm_btn:active{opacity:.8}',
    '._lbm_drop{border:2px dashed #334155;border-radius:10px;padding:32px 16px;text-align:center;cursor:pointer;margin-top:4px}',
    '._lbm_drop p{margin:0;color:#475569;font-size:.88rem;pointer-events:none}',
    '._lbm_drop.drag{border-color:#f87171}',
    '._lbm_parse_err{color:#f87171;font-size:.8rem;margin-top:8px;min-height:16px}',
    '._lbm_preview_card{background:#111827;border-radius:8px;padding:10px;margin-top:6px;border-left:3px solid #334155}',
    '._lbm_preview_name{font-size:.85rem;font-weight:600;color:#f87171}',
    '._lbm_preview_trigs{font-size:.72rem;color:#34d399;margin-top:2px}',
    '._lbm_preview_desc{font-size:.75rem;color:#64748b;margin-top:2px}',
    '._lbm_preview_list{max-height:260px;overflow-y:auto;margin-top:8px}',
    '._lbm_ta_mono{width:100%;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#6ee7b7;padding:12px;font-family:monospace;font-size:.78rem;min-height:140px;resize:none;outline:none;margin-bottom:8px}',
    '._lbm_jerr{color:#f87171;font-size:.8rem;margin-top:4px;min-height:16px}',
    '._lbm_ok{font-size:.8rem;color:#34d399;text-align:center;margin:6px 0;min-height:18px}',
    '#_lbm_restore{margin:12px 12px 0;background:#0d2618;border:1px solid #34d399;border-radius:10px;padding:12px 14px}',
    '#_lbm_restore p{margin:0 0 10px;font-size:.85rem;color:#6ee7b7;line-height:1.4}',
    '#_lbm_restore_btns{display:flex;gap:8px}',
    '._lbm_restore_btn{flex:1;padding:9px;border-radius:7px;font-size:.85rem;cursor:pointer;font-family:system-ui,sans-serif;border:1px solid}',
    '._lbm_restore_btn.yes{background:#059669;border-color:#059669;color:#fff}',
    '._lbm_restore_btn.no{background:transparent;border-color:#334155;color:#94a3b8}',
    '#_lbm_name_row{padding:12px 16px 0;display:flex;flex-direction:column;gap:4px}',
    '._lbm_name_label{font-size:.7rem;color:#64748b;text-transform:uppercase;letter-spacing:.05em}',
    '#_lbm_bookname{width:100%;background:#1e293b;border:1px solid #334155;border-radius:8px;color:#e5e7eb;padding:10px 12px;font-size:16px;outline:none;font-family:system-ui,sans-serif;font-weight:600}',
    '#_lbm_bookname:focus{border-color:#f87171}',
    '._lbm_trig_counter{font-size:.72rem;text-align:right;margin-top:3px;color:#475569}',
    '._lbm_trig_counter.warn{color:#f59e0b;font-weight:500}',
    '._lbm_trig_counter.over{color:#ef4444;font-weight:700}',
    '._lbm_tag_row{display:flex;align-items:center;gap:6px;flex-wrap:wrap;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:8px 10px;min-height:46px;cursor:text}',
    '._lbm_tag_row:focus-within{border-color:#f87171}',
    '._lbm_tag{display:inline-flex;align-items:center;gap:4px;background:#0f172a;border:1px solid #334155;border-radius:12px;padding:3px 8px 3px 10px;font-size:.78rem;color:#e5e7eb;white-space:nowrap;max-width:200px}',
    '._lbm_tag span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '._lbm_tag_x{background:none;border:none;color:#64748b;font-size:.85rem;cursor:pointer;padding:0 0 0 2px;line-height:1;font-family:system-ui,sans-serif;flex-shrink:0}',
    '._lbm_tag_x:active{color:#f87171}',
    '._lbm_tag_inp{background:none;border:none;outline:none;color:#e5e7eb;font-size:16px;font-family:system-ui,sans-serif;min-width:80px;flex:1;padding:0}',
    '._lbm_tag_inp::placeholder{color:#475569}',
    '._lbm_phrase_preview{display:inline-flex;align-items:center;gap:4px;background:#0d2618;border:1px solid #34d399;border-radius:12px;padding:3px 10px;font-size:.78rem;color:#6ee7b7;white-space:nowrap}',
    '._lbm_phrase_confirm{background:none;border:none;color:#34d399;font-size:1rem;cursor:pointer;padding:0 2px;line-height:1}',
    '._lbm_phrase_cancel{background:none;border:none;color:#ef4444;font-size:1rem;cursor:pointer;padding:0 2px;line-height:1}',
    '._lbm_sug_header{display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:5px}',
    '._lbm_phrase_toggle{padding:3px 10px;border-radius:12px;border:1px solid #334155;background:transparent;color:#64748b;font-size:.72rem;cursor:pointer;font-family:system-ui,sans-serif;white-space:nowrap}',
    '._lbm_phrase_toggle.on{border-color:#6ee7b7;color:#6ee7b7;background:#0d2618}',
    '._lbm_reroll{background:none;border:none;color:#475569;font-size:.9rem;cursor:pointer;padding:2px 4px;line-height:1;border-radius:4px;transition:transform .3s,color .15s;flex-shrink:0}',
    '._lbm_reroll:active{color:#6ee7b7;transform:rotate(180deg)}',
    '._lbm_sug_tray{margin-top:8px}',
    '#_lbm_searchbar{padding:10px 14px 6px;display:flex;flex-direction:column;gap:6px}',
    '#_lbm_search_row{display:flex;gap:6px;align-items:center}',
    '#_lbm_search{flex:1;background:#1e293b;border:1px solid #334155;border-radius:8px;color:#e5e7eb;padding:9px 12px;font-size:16px;outline:none;font-family:system-ui,sans-serif}',
    '#_lbm_search:focus{border-color:#f87171}',
    '#_lbm_search::placeholder{color:#475569}',
    '#_lbm_mode_sel{background:#1e293b;border:1px solid #334155;border-radius:8px;color:#94a3b8;padding:9px 8px;font-size:.78rem;outline:none;font-family:system-ui,sans-serif;cursor:pointer;flex-shrink:0}',
    '#_lbm_replace_row{display:flex;gap:6px;align-items:center}',
    '#_lbm_replace{flex:1;background:#1e293b;border:1px solid #334155;border-radius:8px;color:#e5e7eb;padding:9px 12px;font-size:16px;outline:none;font-family:system-ui,sans-serif}',
    '#_lbm_replace:focus{border-color:#f87171}',
    '#_lbm_replace::placeholder{color:#475569}',
    '#_lbm_replace_all{flex-shrink:0;padding:9px 14px;border-radius:8px;border:none;background:#ef4444;color:#fff;font-size:.82rem;font-weight:600;cursor:pointer;font-family:system-ui,sans-serif;white-space:nowrap}',
    '#_lbm_replace_all:disabled{background:#374151;color:#6b7280;cursor:default}',
    '#_lbm_match_count{font-size:.72rem;color:#475569;padding:0 2px}',
    '._lbm_card_name mark{background:#854d0e;color:#fef3c7;border-radius:2px;padding:0 1px}',
    '#_lbm_fab_menu{position:fixed;border-radius:14px;background:#1e293b;border:1px solid #334155;box-shadow:0 8px 32px rgba(0,0,0,.5);overflow:hidden;z-index:2147483649;opacity:0;transform:scale(.92) translateY(8px);transition:opacity .15s,transform .15s;pointer-events:none}',
    '#_lbm_fab_menu.open{opacity:1;transform:scale(1) translateY(0);pointer-events:all}',
    '._lbm_fab_item{display:flex;align-items:center;gap:12px;padding:14px 18px;cursor:pointer;font-size:.9rem;color:#e5e7eb;font-family:system-ui,sans-serif;border:none;background:none;width:100%;text-align:left;white-space:nowrap}',
    '._lbm_fab_item:active{background:#334155}',
    '._lbm_fab_item+._lbm_fab_item{border-top:1px solid #1e293b}',
    '._lbm_fab_icon{font-size:1.1rem;width:24px;text-align:center;flex-shrink:0}',
    '#_lbm_import_sheet{position:fixed;bottom:0;left:0;width:100%;background:#1e293b;border-radius:20px 20px 0 0;border-top:1px solid #334155;z-index:2147483649;transform:translateY(100%);transition:transform .25s ease;padding-bottom:env(safe-area-inset-bottom,0px);max-height:80vh;display:flex;flex-direction:column}',
    '#_lbm_import_sheet.open{transform:translateY(0)}',
    '#_lbm_import_sheet_hd{padding:16px 18px 10px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}',
    '#_lbm_import_sheet_hd h3{margin:0;font-size:.95rem;color:#e5e7eb;font-weight:600}',
    '#_lbm_import_sheet_body{flex:1;overflow-y:auto;padding:0 16px 16px}',
    '#_lbm_import_ta{width:100%;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#e5e7eb;padding:12px;font-size:15px;font-family:system-ui,sans-serif;resize:none;outline:none;min-height:160px;box-sizing:border-box;line-height:1.6}',
    '#_lbm_import_ta:focus{border-color:#f87171}',
    '#_lbm_import_ta::placeholder{color:#475569}',
    '#_lbm_import_hint{font-size:.75rem;color:#475569;margin:6px 0 12px;line-height:1.5}',
    '#_lbm_import_preview{background:#111827;border-radius:8px;padding:10px;margin-bottom:12px;display:none}',
    '._lbm_import_prev_entry{padding:6px 0;border-bottom:1px solid #1e293b;font-size:.82rem}',
    '._lbm_import_prev_entry:last-child{border-bottom:none}',
    '._lbm_import_prev_name{color:#f87171;font-weight:600}',
    '._lbm_import_prev_meta{color:#475569;font-size:.72rem;margin-top:2px}',
    '#_lbm_import_err{color:#f87171;font-size:.8rem;min-height:16px;margin-bottom:8px}',
    '#_lbm_import_btns{display:flex;gap:8px}',
    '._lbm_sug_tray_hd{display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none;padding:4px 0}',
    '._lbm_sug_tray_title{font-size:.7rem;color:#64748b;text-transform:uppercase;letter-spacing:.05em;display:flex;align-items:center;gap:5px}',
    '._lbm_sug_tray_chevron{font-size:.7rem;color:#475569;transition:transform .2s;display:inline-block}',
    '._lbm_sug_tray_body{overflow:hidden;transition:max-height .2s ease}',
    '._lbm_sug_tray_body.collapsed{max-height:0!important}',
    '._lbm_phrase_pill_row{display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-top:6px;min-height:0}',
    '._lbm_phrase_pill{display:inline-flex;align-items:center;gap:4px;background:#0d2618;border:1px solid #334155;border-radius:12px;padding:3px 8px 3px 10px;font-size:.78rem;color:#6ee7b7;cursor:pointer;transition:all .15s;white-space:nowrap;user-select:none}',
    '._lbm_phrase_pill.selected{border-color:#6ee7b7;background:#0a3d22;box-shadow:0 0 0 2px #6ee7b7}',
    '._lbm_phrase_pill_x{background:none;border:none;color:#34d399;font-size:.85rem;cursor:pointer;padding:0 0 0 3px;line-height:1;font-family:system-ui,sans-serif}',
    '._lbm_phrase_pill_x:active{color:#ef4444}',
    '._lbm_phrase_actions{display:flex;align-items:center;gap:6px;margin-top:6px}',
    '._lbm_tag.editing{background:#0f172a;border-color:#f87171;padding:0}',
    '._lbm_tag_edit_inp{background:none;border:none;outline:none;color:#e5e7eb;font-size:.78rem;font-family:system-ui,sans-serif;padding:3px 8px;min-width:60px;max-width:160px}',
    '._lbm_tag.flash_err{border-color:#ef4444;background:#2d0a0a;animation:_lbm_flash .4s}',
    '@keyframes _lbm_flash{0%,100%{opacity:1}50%{opacity:.3}}',
    '._lbm_sug_row{display:flex;flex-wrap:wrap;gap:5px;margin-top:7px;min-height:0}',
    '._lbm_sug_chip{padding:4px 12px;border-radius:14px;border:1px solid #334155;background:#1e293b;color:#6ee7b7;font-size:.75rem;cursor:pointer;font-family:system-ui,sans-serif;white-space:nowrap}',
    '._lbm_sug_chip:active{background:#0d2618;border-color:#6ee7b7}',
    '._lbm_sug_label{font-size:.7rem;color:#475569;margin-top:5px;width:100%}',
    '._lbm_cc.good{color:#34d399}',
    '._lbm_cc.warn{color:#f59e0b;font-weight:500}',
    '._lbm_cc.over{color:#ef4444;font-weight:700}',
    '._lbm_toggle{width:44px;height:26px;border-radius:13px;background:#334155;border:none;cursor:pointer;position:relative;flex-shrink:0;transition:background .2s;padding:0}',
    '._lbm_toggle.on{background:#4f46e5}',
    '._lbm_tog_knob{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left .2s;display:block}',
    '._lbm_toggle.on ._lbm_tog_knob{left:21px}',
  ].join('');

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
  var grpBtn=document.createElement('button');grpBtn.className='_lbm_fbtn';grpBtn.style.cssText='border-style:dashed';grpBtn.textContent='Group by type';
  grpBtn.addEventListener('click',function(){
    var order=['Character','Item','PlotEvent','Location','Other'];
    var sorted=entryOrder.slice().sort(function(a,b){return order.indexOf(entriesData[a].type)-order.indexOf(entriesData[b].type);});
    entryOrder.length=0;sorted.forEach(function(id){entryOrder.push(id);});
    renderList();scheduleSave();
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

  pConv.appendChild(convSec1);pConv.appendChild(convSec2);

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

  pSave.appendChild(saveSec);pSave.appendChild(exportSec);pSave.appendChild(loadSec);

  var pSettings=document.createElement('div');pSettings.id='_lbm_p_settings';pSettings.className='_lbm_panel';

  var setScroll=document.createElement('div');setScroll.style.cssText='padding:16px;display:flex;flex-direction:column;gap:14px';

  function mkToggle(title,desc,key,defaultVal){
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
    false
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

    // ── Detect and split into raw blocks ──
    // Supports two block-start markers:
    //   1. === Entry Name ===   (template format)
    //   2. Entry Name: XXX      (key-value format — splits on blank line or next Entry Name:)
    var blocks=[];

    // Strategy: split on lines that look like a block opener
    var TRIPLE=  /^===\s*.+\s*===/;
    var KV_NAME= /^Entry Name\s*:/i;

    var lines=text.split('\n');
    var cur=null;
    lines.forEach(function(line){
      if(TRIPLE.test(line.trim())||KV_NAME.test(line)){
        if(cur!==null)blocks.push(cur);
        cur=[line];
      } else {
        if(cur!==null)cur.push(line);
        // Lines before any block opener are ignored
      }
    });
    if(cur!==null)blocks.push(cur);

    // ── Parse each block ──
    return blocks.map(function(blines){
      var entry={name:'',type:'Character',triggers:[],description:'',delim:','};
      var descLines=[];var inDesc=false;

      blines.forEach(function(line){
        // Block title: === Name ===
        var tripleM=line.trim().match(/^===\s*(.+?)\s*===$/);
        if(tripleM){entry.name=tripleM[1].trim();inDesc=false;return;}

        // Key-value lines — all case-insensitive, colon separator
        // Entry Name / Name
        var nameM=line.match(/^(?:Entry\s+)?Name\s*:\s*(.+)/i);
        if(nameM){entry.name=nameM[1].trim();inDesc=false;return;}

        // Entry Type / Type
        var typeM=line.match(/^(?:Entry\s+)?Type\s*:\s*(.+)/i);
        if(typeM){entry.type=typeM[1].trim();inDesc=false;return;}

        // Triggers
        var trigM=line.match(/^Triggers?\s*:\s*(.+)/i);
        if(trigM){
          var raw=trigM[1];
          var semi=raw.indexOf(';')!==-1;
          entry.delim=semi?';':',';
          entry.triggers=raw.split(semi?';':',').map(function(t){return t.trim();}).filter(Boolean);
          inDesc=false;return;
        }

        // Description (may continue on following lines)
        var descM=line.match(/^Description\s*:\s*([\s\S]*)/i);
        if(descM){descLines=[descM[1]];inDesc=true;return;}

        // Continuation of description
        if(inDesc){
          // A blank line after description content ends it; a recognised key also ends it
          if(line.match(/^(?:Entry\s+)?(?:Name|Type)\s*:/i)||line.match(/^Triggers?\s*:/i)){
            inDesc=false;
            // Re-process this line as a key (recurse via falling through — handled above already)
          } else {
            descLines.push(line);
          }
        }
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

  var entries={};
  var entryOrder=[];
  var nextId=1;
  var currentEditId=null;
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
    var visible=entryOrder.filter(function(id){
      var c=document.getElementById('_lbm_card_'+id);
      return c&&!c.classList.contains('hidden');
    });
    entryOrder.forEach(function(id,i){
      var card=document.getElementById('_lbm_card_'+id);
      if(card&&card._num)card._num.textContent='ENTRY #'+(i+1);
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
          var raw=e.name||'Untitled entry';
          var re=new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
          card._name.innerHTML=raw.replace(re,'<mark>$1</mark>');
        } else {
          card._name.textContent=e.name||'Untitled entry';
        }
      }
    });
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
      var re=new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi');
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
    var re=new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi');
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
    descTA.addEventListener('input',function(){autoGrow();e.description=descTA.value.trim();updCC();sugOffset=0;renderSugs();scheduleSave();});
    var descWrap=document.createElement('div');descWrap.className='_lbm_field';
    var descLbl=document.createElement('label');descLbl.className='_lbm_label';descLbl.textContent='Description (1500 char limit)';
    descWrap.appendChild(descLbl);descWrap.appendChild(descTA);descWrap.appendChild(descTab);descWrap.appendChild(cc);
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
  }

  backBtn.addEventListener('click',closeEditor);
  edDel.addEventListener('click',function(){
    if(!currentEditId)return;
    if(!confirm('Remove this entry?'))return;
    var id=currentEditId;
    closeEditor();
    setTimeout(function(){removeEntry(id);},250);
  });

  var panels={build:pBuild,impexp:pConv,settings:pSettings};
  function switchTab(t){
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

  function buildJSON(){
    var name=nameInp.value.trim()||'Untitled Lorebook';
    var result={name:name,entries:{}};
    entryOrder.forEach(function(id,i){
      result.entries[String(i+1)]=entries[id];
    });
    return JSON.stringify(result,null,4);
  }

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
  function buildTXT(){
    var lbName=nameInp.value.trim()||'My Lorebook';
    var lines=['LOREBOOK: '+lbName,''];
    entryOrder.forEach(function(id){
      var e=entries[id];
      lines.push('=== '+e.name+' ===');
      lines.push('Type: '+e.type);
      if(e.triggers&&e.triggers.length){
        var sep=e.delim===';'?'; ':' ,';
        lines.push('Triggers: '+e.triggers.join(sep));
      }
      if(e.description)lines.push('Description: '+e.description);
      lines.push('');
    });
    return lines.join('\n');
  }

  function buildDOCX(){
    // Build a minimal .docx (Office Open XML) with proper heading styles
    // Heading 1 = lorebook name, Heading 2 = entry name, Normal = body text
    var lbName=nameInp.value.trim()||'My Lorebook';

    function esc(s){
      return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
    function para(text,style){
      return '<w:p><w:pPr><w:pStyle w:val="'+style+'"/></w:pPr><w:r><w:t xml:space="preserve">'+esc(text)+'</w:t></w:r></w:p>';
    }
    function boldPara(label,value){
      if(!value)return'';
      return '<w:p><w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">'+esc(label)+'</w:t></w:r>'
        +'<w:r><w:t xml:space="preserve"> '+esc(value)+'</w:t></w:r></w:p>';
    }
    function emptyPara(){return'<w:p><w:r><w:t></w:t></w:r></w:p>';}

    var bodyXML=para(lbName,'Heading1');
    bodyXML+=emptyPara();

    entryOrder.forEach(function(id){
      var e=entries[id];
      bodyXML+=para(e.name,'Heading2');
      bodyXML+=boldPara('Type:',e.type);
      if(e.triggers&&e.triggers.length){
        var sep=e.delim===';'?'; ':' ,';
        bodyXML+=boldPara('Triggers:',e.triggers.join(sep));
      }
      if(e.description){
        // Bold "Description:" label then description text as normal paragraph
        bodyXML+='<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Description:</w:t></w:r></w:p>';
        // Split description on newlines → separate paragraphs
        e.description.split('\n').forEach(function(line){
          bodyXML+=para(line,'Normal');
        });
      }
      bodyXML+=emptyPara();
    });

    var docXML='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      +'<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"'
      +' xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"'
      +' xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
      +'<w:body>'+bodyXML
      +'<w:sectPr><w:pgSz w:w="12240" w:h="15840"/></w:sectPr>'
      +'</w:body></w:document>';

    var stylesXML='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      +'<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
      // Normal
      +'<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/>'
      +'<w:rPr><w:sz w:val="24"/></w:rPr></w:style>'
      // Heading 1
      +'<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/>'
      +'<w:basedOn w:val="Normal"/>'
      +'<w:pPr><w:outlineLvl w:val="0"/></w:pPr>'
      +'<w:rPr><w:b/><w:sz w:val="40"/><w:color w:val="C0392B"/></w:rPr></w:style>'
      // Heading 2
      +'<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/>'
      +'<w:basedOn w:val="Normal"/>'
      +'<w:pPr><w:outlineLvl w:val="1"/></w:pPr>'
      +'<w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="2C3E50"/></w:rPr></w:style>'
      +'</w:styles>';

    var relsXML='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      +'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
      +'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
      +'</Relationships>';

    var docRelsXML='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      +'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
      +'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
      +'</Relationships>';

    var contentTypesXML='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      +'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
      +'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
      +'<Default Extension="xml" ContentType="application/xml"/>'
      +'<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
      +'<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
      +'</Types>';

    // Build zip using JSZip if available, else fall back to a stored minimal zip
    // We'll use a simple approach: encode each file and build the zip binary manually
    // Since JSZip isn't guaranteed, we'll use the Blob URL approach with fflate via CDN
    return {docXML:docXML,stylesXML:stylesXML,relsXML:relsXML,docRelsXML:docRelsXML,contentTypesXML:contentTypesXML};
  }

  // ── Pure-JS minimal ZIP builder (no external deps) ──
  function _u32(n){return[n&0xff,(n>>8)&0xff,(n>>16)&0xff,(n>>24)&0xff];}
  function _u16(n){return[n&0xff,(n>>8)&0xff];}

  function _crc32(bytes){
    var c=0xFFFFFFFF;
    var t;
    for(var i=0;i<bytes.length;i++){
      t=(c^bytes[i])&0xff;
      for(var j=0;j<8;j++){t=t&1?(t>>>1)^0xEDB88320:(t>>>1);}
      c=(c>>>8)^t;
    }
    return(c^0xFFFFFFFF)>>>0;
  }

  function _buildZip(files){
    // files: array of {name:string, data:Uint8Array}
    var enc=new TextEncoder();
    var localHeaders=[];
    var centralDir=[];
    var offset=0;

    files.forEach(function(f){
      var nameBytes=enc.encode(f.name);
      var data=f.data;
      var crc=_crc32(data);
      var sz=data.length;

      // Local file header
      var lh=[0x50,0x4B,0x03,0x04, // signature
        0x14,0x00,             // version needed: 2.0
        0x00,0x00,             // flags
        0x00,0x00,             // compression: stored
        0x00,0x00,0x00,0x00,   // mod time/date
      ].concat(_u32(crc))
       .concat(_u32(sz))
       .concat(_u32(sz))
       .concat(_u16(nameBytes.length))
       .concat(_u16(0));      // extra field length

      var lhBytes=new Uint8Array(lh.length+nameBytes.length+sz);
      lhBytes.set(lh,0);
      lhBytes.set(nameBytes,lh.length);
      lhBytes.set(data,lh.length+nameBytes.length);
      localHeaders.push(lhBytes);

      // Central directory entry
      var cd=[0x50,0x4B,0x01,0x02, // signature
        0x14,0x00,             // version made by
        0x14,0x00,             // version needed
        0x00,0x00,             // flags
        0x00,0x00,             // compression: stored
        0x00,0x00,0x00,0x00,   // mod time/date
      ].concat(_u32(crc))
       .concat(_u32(sz))
       .concat(_u32(sz))
       .concat(_u16(nameBytes.length))
       .concat(_u16(0))       // extra
       .concat(_u16(0))       // comment
       .concat(_u16(0))       // disk start
       .concat(_u16(0))       // internal attr
       .concat(_u32(0))       // external attr
       .concat(_u32(offset)); // local header offset

      var cdBytes=new Uint8Array(cd.length+nameBytes.length);
      cdBytes.set(cd,0);
      cdBytes.set(nameBytes,cd.length);
      centralDir.push(cdBytes);
      offset+=lhBytes.length;
    });

    // End of central directory
    var cdSize=centralDir.reduce(function(a,b){return a+b.length;},0);
    var eocd=[0x50,0x4B,0x05,0x06,
      0x00,0x00,             // disk number
      0x00,0x00,             // disk with cd
    ].concat(_u16(files.length))
     .concat(_u16(files.length))
     .concat(_u32(cdSize))
     .concat(_u32(offset))
     .concat(_u16(0));       // comment length

    // Assemble
    var total=offset+cdSize+eocd.length;
    var out=new Uint8Array(total);
    var pos=0;
    localHeaders.forEach(function(b){out.set(b,pos);pos+=b.length;});
    centralDir.forEach(function(b){out.set(b,pos);pos+=b.length;});
    out.set(new Uint8Array(eocd),pos);
    return out;
  }

  function downloadDOCX(filename){
    var parts=buildDOCX();
    var enc=new TextEncoder();
    var files=[
      {name:'[Content_Types].xml', data:enc.encode(parts.contentTypesXML)},
      {name:'_rels/.rels',         data:enc.encode(parts.docRelsXML)},
      {name:'word/document.xml',   data:enc.encode(parts.docXML)},
      {name:'word/styles.xml',     data:enc.encode(parts.stylesXML)},
      {name:'word/_rels/document.xml.rels', data:enc.encode(parts.relsXML)},
    ];
    try{
      var zip=_buildZip(files);
      var blob=new Blob([zip],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
      var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();
      exOk.textContent='\u2713 Downloaded!';setTimeout(function(){exOk.textContent='';},2000);
    }catch(err){
      exOk.textContent='Export error: '+err.message;
      setTimeout(function(){exOk.textContent='';},4000);
    }
  }

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
    var result=blocks.map(function(block){
      var lines=block.split('\n');
      var name=lines[0].replace(/^===\s*/,'').replace(/\s*===\s*$/,'').trim();
      var entry={name:name,type:'Character',triggers:[],description:'',delim:','};
      lines.slice(1).forEach(function(line){
        var tm=line.match(/^Type:\s*(.+)/i);if(tm)entry.type=tm[1].trim();
        var trm=line.match(/^Triggers:\s*(.+)/i);
        if(trm){var raw=trm[1];var semi=raw.indexOf(';')!==-1;entry.delim=semi?';':',';entry.triggers=raw.split(semi?';':',').map(function(t){return t.trim();}).filter(Boolean);}
        var dm=line.match(/^Description:\s*([\s\S]*)/i);if(dm)entry.description=dm[1].trim();
      });
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
  try{
    var saved=localStorage.getItem(currentLBKey);
    if(saved){var parsed=JSON.parse(saved);if(parsed.name||(parsed.entries&&parsed.entries.length>0)){loadState(parsed);}else{updateEmpty();}}
    else{updateEmpty();}
  }catch(e){updateEmpty();}

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
      var idx=lbIndex();var slot=idx.find(function(x){return x.key===targetKey;});
      if(slot){idx=[slot].concat(idx.filter(function(x){return x.key!==targetKey;}));lbSaveIndex(idx);}
      try{var sv=localStorage.getItem(targetKey);if(sv){loadState(JSON.parse(sv));}else{loadState({name:'',entries:[]});updateEmpty();}}
      catch(e){loadState({name:'',entries:[]});updateEmpty();}
    }
    updLBBtn();switchTab('build');
  }

}


