/* Libro del estudio — light offline shell for Annie's phone home screen */
const CACHE = "studio-ledger-v3";
const PRECACHE = [
  "./",
  "./index.html",
  "./libro.html",
  "./portal-hero.jpg",
  "./manifest.webmanifest",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",
  "./fairs/casas-ecuador-2026/site-save.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Never cache API writes/reads as shell assets
  if (url.pathname.startsWith("/api/")) return;
  // Leave the Cosas fair SW scope alone when that app is installed separately
  if (url.pathname.includes("/fairs/casas-ecuador-2026/") && !url.pathname.endsWith("site-save.js")) {
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (
            res &&
            res.ok &&
            (req.destination === "document" ||
              req.destination === "image" ||
              req.url.endsWith(".webmanifest") ||
              req.url.endsWith(".js") ||
              req.url.endsWith(".html") ||
              req.url.endsWith(".png") ||
              req.url.endsWith(".css"))
          ) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
