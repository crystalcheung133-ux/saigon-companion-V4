/* Stage E Runtime Diagnostic Patch 2 — plain-script module loader. Read-only. */
(function(root){
  'use strict';
  root.CCMV_STAGE_E_DIAGNOSTIC_ONLY=true;
  const state={
    build:'VN Stage E · Runtime Diagnostic Patch 3',
    loader:'loaded',
    current:'waiting for DOM',
    modules:{},
    error:null,
    stack:null,
    startedAt:new Date().toISOString()
  };
  const moduleList=[
    ['./sync-core/index.js','sync-core/index.js'],
    ['./sync-core/sync-queue.js','sync-core/sync-queue.js'],
    ['./sync-core/sync-indexeddb-store.js','sync-core/sync-indexeddb-store.js'],
    ['./booking-sync-adapter.js','booking-sync-adapter.js'],
    ['./supabase-sync-provider.mjs','supabase-sync-provider.mjs'],
    ['./sync-bootstrap.js','sync-bootstrap.js']
  ];
  function ensurePanel(){
    let p=document.getElementById('ccmvStageEDiagnosticLoader');
    if(p) return p;
    p=document.createElement('section');
    p.id='ccmvStageEDiagnosticLoader';
    p.setAttribute('aria-live','assertive');
    p.style.cssText='position:fixed;right:12px;bottom:92px;z-index:2147483647;width:min(430px,calc(100vw - 24px));max-height:58vh;overflow:auto;background:#fffdf8;border:2px solid #8a5b32;border-radius:16px;box-shadow:0 14px 40px rgba(30,20,14,.35);padding:13px;color:#2f241d;font:600 12px/1.45 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif';
    p.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><strong>Stage E Module Loader Diagnostic</strong><button id="ccmvDiag2Close" type="button" style="border:0;background:transparent;font-size:21px;cursor:pointer">×</button></div><p style="margin:6px 0;color:#80542f">Read-only: sync writes are paused.</p><pre id="ccmvDiag2Text" style="white-space:pre-wrap;word-break:break-word;margin:8px 0 10px;font:600 11px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace"></pre><button id="ccmvDiag2Copy" type="button" style="border:1px solid #7a5135;border-radius:999px;background:#fff;padding:7px 11px;font-weight:700;cursor:pointer">Copy diagnostic</button>';
    document.body.appendChild(p);
    p.querySelector('#ccmvDiag2Close').onclick=()=>p.remove();
    p.querySelector('#ccmvDiag2Copy').onclick=async()=>{try{await navigator.clipboard.writeText(format());}catch(_){}};
    return p;
  }
  function format(){
    const rows=[
      `Build: ${state.build}`,
      `Loader: ${state.loader}`,
      `Current: ${state.current}`,
      `Page: ${location.pathname}`,
      `Online: ${navigator.onLine}`,
      `Repository: ${root.CCMV_BOOKING_REPOSITORY?'present':'missing'}`,
      `Trip config: ${root.TRIP_CONFIG?.version||'missing'}`,
      '', 'Modules:'
    ];
    for(const [,name] of moduleList) rows.push(`- ${name}: ${state.modules[name]||'not tested'}`);
    rows.push('',`Error: ${state.error||'none'}`);
    if(state.stack) rows.push(`Stack: ${state.stack}`);
    return rows.join('\n');
  }
  function render(){
    const p=ensurePanel();
    const t=p.querySelector('#ccmvDiag2Text');
    if(t)t.textContent=format();
    root.CCMV_STAGE_E_LOADER_DIAGNOSTICS=Object.freeze(JSON.parse(JSON.stringify(state)));
  }
  async function probe(){
    render();
    for(const [path,name] of moduleList){
      state.current=`importing ${name}`; state.modules[name]='loading'; render();
      try{
        const mod=await import(`${path}?v=vn-stage-e-runtime-diag-3`);
        state.modules[name]=`loaded (${Object.keys(mod).join(', ')||'no exports'})`;
      }catch(error){
        state.modules[name]='FAILED';
        state.error=`${name}: ${error?.name||'Error'}: ${error?.message||String(error)}`;
        state.stack=error?.stack||null;
        state.current='stopped at failed import';
        render();
        console.error('[CCMV Stage E Diagnostic 2]',error);
        return;
      }
      render();
    }
    state.current='all module imports passed; sync intentionally not started';
    render();
  }
  root.addEventListener('error',e=>{if(!state.error){state.error=`window error: ${e.message||'unknown'}`;state.stack=e.error?.stack||null;state.current='window error';render();}});
  root.addEventListener('unhandledrejection',e=>{state.error=`unhandled rejection: ${e.reason?.message||String(e.reason)}`;state.stack=e.reason?.stack||null;state.current='unhandled rejection';render();});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',probe,{once:true});else probe();
})(globalThis);
