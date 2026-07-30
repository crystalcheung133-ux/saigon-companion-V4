const CACHE_NAME='ccmv-saigon-v4-vn-stage-e1-admin-booking-sync';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './theme-config.js',
  './asset-config.js',
  './trip-config.js',
  './storage-config.js',
  './storage.js',
  './navigation-config.js',
  './navigation.js',
  './core-runtime.js',
  './trip-runtime.js',
  './guide-runtime.js',
  './day-runtime.js',
  './supabase-config.js',
  './booking-repository.js',
  './booking-sync-adapter.js',
  './sync-bootstrap.js',
  './sync-core/index.js',
  './sync-core/sync-core.js',
  './sync-core/sync-provider.js',
  './sync-core/sync-queue.js',
  './sync-core/sync-reconciler.js',
  './sync-core/sync-reset-orchestrator.js',
  './sync-core/sync-state.js',
  './sync-core/sync-test-provider.js',
  './sync-core/sync-indexeddb-store.js',
  './supabase-sync-provider.mjs',
  './supabase-booking-provider.js',
  './bookings-runtime.js',
  './lifecycle-runtime.js',
  './itinerary-runtime.js',
  './moments-runtime.js',
  './expense-canonical-bootstrap.js',
  './expense-calculator.js',
  './legacy-expense-adapter.js',
  './canonical-expense-repository.js',
  './canonical-expense-core.js',
  './canonical-expense-local-provider.js',
  './expense-dual-write.js',
  './expense-read-shadow.js',
  './expenses-runtime.js',
  './app-runtime.js',
  './export-runtime.js',
  './admin.js',
  './pwa.js',
  './data.js',
  './canonical-core.js',
  './vietnam-canonical-data.js',
  './vietnam-presentation-adapter.js',
  './manifest.json',
  './place.html',
  './day.html',
  './offline.html',
  './icon-192.png',
  './icon-512.png',
  './logo-watermark-monogram.png',
  './logo-monogram-transparent.png',
  './ccmv-logo-calibrated.png',
  './guide.html',
  './bookings.html',
  './itinerary.html',
  './memory.html',
  './moments.html',
  './expenses.html',
  './trip.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key =>
        key !== CACHE_NAME &&
        (key.startsWith('ccmv-vn-') || key.startsWith('ccmv-vietnam-2026-') || key.startsWith('ccmv-saigon-companion-') || key.startsWith('ccmv-saigon-v4-'))
      ).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || caches.match('./offline.html');
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await caches.match(request);
  const fetched = fetch(request).then(response => {
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached || fetched || caches.match('./offline.html');
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const acceptsHtml = event.request.headers.get('accept')?.includes('text/html');
  const criticalUiAsset = /\/(styles\.css|admin\.js)$/.test(url.pathname);
  if (event.request.mode === 'navigate' || acceptsHtml || criticalUiAsset) {
    event.respondWith(networkFirst(event.request));
  } else {
    event.respondWith(staleWhileRevalidate(event.request));
  }
});
