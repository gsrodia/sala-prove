// Tiene l'app in cache così si apre senza internet. Cambia VERSIONE quando aggiorni i file.
const VERSIONE = "sala-prove-1";
const FILE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-512.png",
  "fonts/saira-condensed-700.woff2",
  "fonts/ibm-plex-sans.woff2",
  "fonts/ibm-plex-mono-500.woff2",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSIONE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit =>
      hit || fetch(req).catch(() => req.mode === "navigate" ? caches.match("index.html") : Response.error())
    )
  );
});
