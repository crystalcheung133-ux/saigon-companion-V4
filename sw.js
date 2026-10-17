importScripts('./theme-config.js', './asset-config.js', './locale-config.js', './formatter.js', './navigation-config.js', './trip-config.js', './storage-config.js');
const CACHE_NAME = `travel-engine-${TRIP_CONFIG.storageNamespace}-${TRIP_CONFIG.version}-rc29135-weather5-fx100k`;
const CRITICAL_EXTENSIONS = /\.(?:css|js)$/i;
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './core-runtime.js',
  './trip-runtime.js',
  './moments-compat.js',
  './currency-runtime.js',
  './analytics-runtime.js',
  './home-runtime.js',
  './script.js',
  './guide-runtime.js',
  './guide-authority.js',
  './guide-sync-runtime.js',
  './guide-sync-status-ui.js',
  './generation-selection-adapter.js',
  './expense-notification-runtime.js',
  './shopping-directory-data.js',
  './vendor-supabase-js-2.117.2.umd.js',
  './vendor-pdfjs-3.11.174.min.js',
  './vendor-pdfjs-worker-3.11.174.min.js',
  './guide-navigation-runtime.js',
  './expenses.js',
  './supabase-client-runtime.js',
  './expense-sync-runtime.js',
  './moment-sync-runtime.js',
  './generation-runtime.js',
  './moments.js',
  './admin.js',
  './reset-runtime.js',
  './publication-runtime.js',
  './complete-runtime.js',
  './export-runtime.js',
  './pwa.js',
  './app-runtime.js',
  './theme-config.js',
  './asset-config.js',
  './locale-config.js',
  './geo-config.js',
  './party-render-runtime.js',
  './formatter.js',
  './money-config.js',
  './money.js',
  './navigation-config.js',
  './navigation.js',
  './storage-config.js',
  './storage.js',
  './sync-config.js',
  './sync-runtime.js',
  './trip-config.js',
  './engine-integrity.js',
  './data.js',
  './booking-authority.js',
  './booking-permissions.js',
  './booking-sync-runtime.js',
  './booking-sync-status-ui.js',
  './itinerary-authority.js',
  './timeline-sync-journal.js',
  './timeline-trip-journal.js',
  './timeline-journal-migration.js',
  './timeline-trip-journal.js',
  './timeline-journal-cutover.js',
  './timeline-save-journal-selector.js',
  './timeline-sync-status-ui.js',
  './timeline-staging-client.js',
  './timeline-staging-retry.js',
  './timeline-staging-bridge.js',
  './place.html',
  './day.html',
  './offline.html',
  './manifest.webmanifest',
  './' + ASSET_CONFIG.icons.icon192,
  './' + ASSET_CONFIG.icons.icon512,
  './' + ASSET_CONFIG.branding.secondaryMark,
  './' + ASSET_CONFIG.branding.splashLogo,
  './' + ASSET_CONFIG.branding.splashMark,
  './guide.html',
  './itinerary.html',
  './memory.html',
  './moments.html',
  './documents.html',
  './documents-runtime.js',
  './documents-folder-ui.js',
  './documents.js',
  './expenses.html',
  './trip.html'
];


self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(ASSETS.map(asset => cache.add(new Request(asset,{cache:'reload'})))))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function looksLikeHtmlDocument(text) {
  const sample = String(text || '').replace(/^\uFEFF/, '').trimStart().slice(0, 512).toLowerCase();
  return sample.startsWith('<!doctype html') || sample.startsWith('<html') || sample.includes('<html ');
}

async function validateHtmlResponse(response) {
  if (!response || !response.ok) return false;
  try {
    const body = await response.clone().text();
    return looksLikeHtmlDocument(body);
  } catch (error) {
    return false;
  }
}

async function fetchValidHtml(request) {
  try {
    const response = await fetch(request, { cache: 'no-store', redirect: 'follow' });
    return await validateHtmlResponse(response) ? response : null;
  } catch (error) {
    return null;
  }
}

async function cachedValidHtml(request) {
  const candidates = [
    request,
    new Request('./index.html', { headers: { accept: 'text/html' } }),
    new Request('./offline.html', { headers: { accept: 'text/html' } })
  ];
  for (const candidate of candidates) {
    const response = await caches.match(candidate, { ignoreSearch: true });
    if (await validateHtmlResponse(response)) return response;
  }
  return null;
}

// The installed PWA launches at the home document. Serve an already verified
// home shell immediately, then refresh it in the background. Other HTML routes
// retain network-first semantics to avoid stale booking/guide pages.
function isHomeNavigation(request) {
  const url = new URL(request.url);
  const homePath = new URL('./index.html', self.location.href).pathname;
  const directoryPath = new URL('./', self.location.href).pathname;
  return url.pathname === homePath || url.pathname === directoryPath;
}

function reportNavigation(event, source, startedAt) {
  if (!event || !event.clientId) return;
  const durationMs = Math.round(performance.now() - startedAt);
  event.waitUntil(self.clients.get(event.clientId).then(client => {
    if (client) client.postMessage({ type: 'VN_STARTUP_NAV', source, durationMs });
  }).catch(() => {}));
}

async function navigationResponse(request, event) {
  const startedAt = performance.now();
  const cache = await caches.open(CACHE_NAME);
  if (isHomeNavigation(request)) {
    const cached = await cache.match('./index.html', { ignoreSearch: true });
    if (await validateHtmlResponse(cached)) {
      reportNavigation(event, 'home-cache', startedAt);
      // Never hold up first paint for a network update or a cache write.
      const refresh = fetchValidHtml(new Request(new URL('./index.html', self.location.href), {
        credentials: 'same-origin', headers: { accept: 'text/html' }
      })).then(async response => {
        if (response) await cache.put('./index.html', response.clone());
      }).catch(() => {});
      if (event) event.waitUntil(refresh);
      return cached;
    }
  }

  const direct = await fetchValidHtml(request);
  if (direct) {
    reportNavigation(event, 'network', startedAt);
    await cache.put(request, direct.clone());
    return direct;
  }

  const indexRequest = new Request(new URL('./index.html', self.location.href), {
    method: 'GET', headers: { accept: 'text/html' }, cache: 'no-store',
    credentials: 'same-origin', redirect: 'follow'
  });
  const indexResponse = await fetchValidHtml(indexRequest);
  if (indexResponse) {
    reportNavigation(event, 'network-fallback', startedAt);
    await cache.put('./index.html', indexResponse.clone());
    return indexResponse;
  }
  reportNavigation(event, 'offline-fallback', startedAt);
  return await cachedValidHtml(request) || new Response(
    '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title></head><body><p>This page is temporarily unavailable.</p></body></html>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    let cached = await caches.match(request, { ignoreSearch: true });
    if (!cached) {
      const url = new URL(request.url);
      cached = await caches.match(url.pathname.split('/').pop() || './index.html', { ignoreSearch: true });
    }
    return cached || caches.match('./offline.html');
  }
}

async function cacheFirstMedia(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, {ignoreSearch:true});
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    return caches.match('./offline.html');
  }
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const acceptsHtml = event.request.headers.get('accept')?.includes('text/html');
  if (event.request.mode === 'navigate' || acceptsHtml) {
    event.respondWith(navigationResponse(event.request, event));
  } else if (CRITICAL_EXTENSIONS.test(url.pathname)) {
    event.respondWith(networkFirst(event.request));
  } else {
    event.respondWith(cacheFirstMedia(event.request));
  }
});
