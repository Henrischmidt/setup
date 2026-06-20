/* Network-first service worker — the installed app always pulls the latest
   version when online, falling back to cache only when offline.
   (Replaces the old cache-first worker that was serving stale content.) */
const CACHE = 'wineabout-v4';
const APP = '/franschhoek-wine-map.html';

self.addEventListener('install', (e) => { self.skipWaiting(); });

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // leave Leaflet / fonts / Supabase alone
  e.respondWith((async () => {
    try {
      const fresh = await fetch(req);               // network first → always up to date
      const cache = await caches.open(CACHE);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {                                 // offline → cache fallback
      const cached = await caches.match(req);
      return cached || (await caches.match(APP));
    }
  })());
});
