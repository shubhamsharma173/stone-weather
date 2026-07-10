const SHELL_CACHE = 'stone-shell-v1';
const DATA_CACHE = 'stone-data-v1';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL_CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== SHELL_CACHE && k !== DATA_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Weather + geocoding: network first, fall back to last cached response (offline mode)
  if (url.hostname.endsWith('open-meteo.com')) {
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(DATA_CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Fonts and shell: cache first
  e.respondWith(
    caches.match(e.request).then(hit => hit ||
      fetch(e.request).then(res => {
        if (e.request.method === 'GET' && res.ok && (url.origin === location.origin || url.hostname.includes('fonts.g'))) {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
    )
  );
});
