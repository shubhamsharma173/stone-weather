// Bump this string on every deploy to force clients onto fresh code.
const VERSION = 'v5';
const SHELL_CACHE = 'stone-shell-' + VERSION;
const DATA_CACHE  = 'stone-data-' + VERSION;
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL_CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== SHELL_CACHE && k !== DATA_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Weather + geocoding: network first, fall back to last cached response (offline).
  if (url.hostname.endsWith('open-meteo.com')) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(DATA_CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // App HTML + JS (navigations and same-origin docs): NETWORK FIRST so new deploys always win,
  // with cache fallback only when offline.
  const isNav = req.mode === 'navigate';
  const isAppCode = url.origin === location.origin && /\.(html|js|json)$/.test(url.pathname);
  if (isNav || isAppCode) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(SHELL_CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

  // Everything else (icons, fonts): cache first.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok && (url.origin === location.origin || url.hostname.includes('fonts.g'))) {
        const copy = res.clone();
        caches.open(SHELL_CACHE).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
