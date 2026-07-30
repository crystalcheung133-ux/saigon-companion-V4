/* Stage E Runtime Patch 4 — module verification and explicit certification bootstrap. */
(function(root){
  'use strict';

  root.CCMV_STAGE_E_DIAGNOSTIC_ONLY = true;

  const VERSION = 'vn-stage-e-stack-trace-8';
  const state = {
    build: 'VN Stage E · Stack Trace Patch 8',
    loader: 'loaded',
    current: 'waiting for DOM',
    modules: {},
    error: null,
    stack: null,
    startedAt: new Date().toISOString()
  };

  const moduleList = [
    ['./sync-core/index.js', 'sync-core/index.js'],
    ['./sync-core/sync-queue.js', 'sync-core/sync-queue.js'],
    ['./sync-core/sync-indexeddb-store.js', 'sync-core/sync-indexeddb-store.js'],
    ['./booking-sync-adapter.js', 'booking-sync-adapter.js'],
    ['./supabase-sync-provider.mjs', 'supabase-sync-provider.mjs'],
    ['./sync-bootstrap.js', 'sync-bootstrap.js']
  ];

  function ensurePanel(){
    let panel = document.getElementById('ccmvStageEDiagnosticLoader');
    if (panel) return panel;

    panel = document.createElement('section');
    panel.id = 'ccmvStageEDiagnosticLoader';
    panel.setAttribute('aria-live', 'assertive');
    panel.style.cssText =
      'position:fixed;right:12px;bottom:92px;z-index:2147483647;' +
      'width:min(430px,calc(100vw - 24px));max-height:58vh;overflow:auto;' +
      'background:#fffdf8;border:2px solid #8a5b32;border-radius:16px;' +
      'box-shadow:0 14px 40px rgba(30,20,14,.35);padding:13px;color:#2f241d;' +
      'font:600 12px/1.45 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif';

    panel.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px">' +
      '<strong>Stage E Configuration Fix</strong>' +
      '<button id="ccmvDiag4Close" type="button" style="border:0;background:transparent;font-size:21px;cursor:pointer">×</button>' +
      '</div>' +
      '<p style="margin:6px 0;color:#80542f">Certification mode: modules are checked before Sync starts.</p>' +
      '<pre id="ccmvDiag4Text" style="white-space:pre-wrap;word-break:break-word;margin:8px 0 10px;font:600 11px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace"></pre>' +
      '<button id="ccmvDiag4Copy" type="button" style="border:1px solid #7a5135;border-radius:999px;background:#fff;padding:7px 11px;font-weight:700;cursor:pointer">Copy diagnostic</button>';

    document.body.appendChild(panel);
    panel.querySelector('#ccmvDiag4Close').onclick = () => panel.remove();
    panel.querySelector('#ccmvDiag4Copy').onclick = async () => {
      try { await navigator.clipboard.writeText(format()); } catch (_) {}
    };
    return panel;
  }

  function format(){
    const rows = [
      `Build: ${state.build}`,
      `Loader: ${state.loader}`,
      `Current: ${state.current}`,
      `Page: ${location.pathname}`,
      `Online: ${navigator.onLine}`,
      `Repository: ${root.CCMV_BOOKING_REPOSITORY ? 'present' : 'missing'}`,
      `Trip config: ${root.TRIP_CONFIG?.version || 'missing'}`,
      '',
      'Modules:'
    ];

    for (const [, name] of moduleList) {
      rows.push(`- ${name}: ${state.modules[name] || 'not tested'}`);
    }

    rows.push('', `Error: ${state.error || 'none'}`);
    if (state.stack) rows.push(`Stack: ${state.stack}`);
    return rows.join('\n');
  }

  function render(){
    const panel = ensurePanel();
    const text = panel.querySelector('#ccmvDiag4Text');
    if (text) text.textContent = format();
    root.CCMV_STAGE_E_LOADER_DIAGNOSTICS =
      Object.freeze(JSON.parse(JSON.stringify(state)));
  }

  async function start(){
    render();
    let bootstrapModule = null;

    for (const [path, name] of moduleList) {
      state.current = `importing ${name}`;
      state.modules[name] = 'loading';
      render();

      try {
        const module = await import(`${path}?v=${VERSION}`);
        state.modules[name] =
          `loaded (${Object.keys(module).join(', ') || 'no exports'})`;
        if (name === 'sync-bootstrap.js') bootstrapModule = module;
      } catch (error) {
        state.modules[name] = 'FAILED';
        state.error =
          `${name}: ${error?.name || 'Error'}: ${error?.message || String(error)}`;
        state.stack = error?.stack || null;
        state.current = 'stopped at failed import';
        render();
        console.error('[CCMV Stage E Patch 4]', error);
        return;
      }

      render();
    }

    if (typeof bootstrapModule?.initialiseStageE !== 'function') {
      state.current = 'bootstrap export missing';
      state.error = 'sync-bootstrap.js did not export initialiseStageE()';
      render();
      return;
    }

    state.current = 'starting certification sync';
    render();

    try {
      root.CCMV_STAGE_E_DIAGNOSTIC_ONLY = false;
      await bootstrapModule.initialiseStageE();
      const live = root.CCMV_SYNC_STAGE_E || {};
      if (live.error) {
        state.current = 'bootstrap completed with error';
        state.error = live.error;
      } else if (live.started) {
        state.current = 'certification sync started';
      } else {
        state.current = `bootstrap completed · ${live.lastAction || 'not started'}`;
      }
      render();
    } catch (error) {
      state.current = 'bootstrap start failed';
      state.error = error?.message || String(error);
      state.stack = error?.stack || null;
      render();
    }
  }

  root.addEventListener('error', event => {
    if (!state.error) {
      state.error = `window error: ${event.message || 'unknown'}`;
      state.stack = event.error?.stack || null;
      state.current = 'window error';
      render();
    }
  });

  root.addEventListener('unhandledrejection', event => {
    state.error =
      `unhandled rejection: ${event.reason?.message || String(event.reason)}`;
    state.stack = event.reason?.stack || null;
    state.current = 'unhandled rejection';
    render();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    void start();
  }
})(globalThis);
