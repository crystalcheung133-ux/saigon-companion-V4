const CACHE='companion-mero-family-seoul-2027-25610-logo-r3';
const PRECACHE=['./','./index.html','./styles.css','./seoul-dashboard-boot.js','./mero-seoul-winter-logo.png','./theme-config.js','./trip-config.js','./data.js'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)))});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('companion-mero-family-seoul-2027-')&&k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>{
 const req=e.request; if(req.method!=='GET') return;
 const url=new URL(req.url); if(url.origin!==self.location.origin)return;
 const isBrand=url.pathname.endsWith('/mero-seoul-winter-logo.png');
 if(req.mode==='navigate'||isBrand){
   e.respondWith(fetch(req).then(res=>{if(res.ok){let copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return res}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
   return;
 }
 e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{if(res.ok){let copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return res})));
});
