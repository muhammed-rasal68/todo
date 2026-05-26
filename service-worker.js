const CACHE_NAME = 'todo-cache-v1';
const OFFLINE_URL = '/offline.html';

const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/images/favicon.png',
  '/images/icon-192.png',
  '/images/icon-512.png',
  OFFLINE_URL
];

// Install: cache app shell and offline page
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate: remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))).then(() => self.clients.claim())
  );
});

// Fetch: respond with cache, network, or offline page for navigations
self.addEventListener('fetch', event => {
  const request = event.request;

  // For navigation requests, serve offline page when both cache and network fail
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(response => {
        // Optionally update the cache with the latest navigation response
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      }).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // For other requests, try cache first then network
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).catch(() => {
      // If request is for an image, optionally return a fallback image
      if (request.destination === 'image') return caches.match('/images/favicon.png');
      return caches.match(OFFLINE_URL);
    }))
  );
});