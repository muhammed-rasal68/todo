const CACHE_NAME = "todo-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request)
      .then(r => r || fetch(e.request))
  );
});

const CACHE_NAME = "todo-cache-v1";

const urlsToCache = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/manifest.json",
    "/images/favicon.png",
    "/images/icon-192.png",
    "/images/icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});