// sw.js — Service Worker
// Caches app files for offline use
// Runs in the background, separate from the main app

const CACHE_NAME = 'bpk-cfms-v1';

// Files to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo.png',
  '/bpk-logo.png',
  '/icon192.png',
  '/icon512.png',
  '/background_login.jpg',
];

// ─── Install Event ─────────────────────────────────────────
// Runs when service worker is first installed
// Caches all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('BPK CFMS: Caching static assets...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Activate immediately without waiting
  self.skipWaiting();
});

// ─── Activate Event ────────────────────────────────────────
// Runs when service worker takes control
// Cleans up old caches from previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('BPK CFMS: Removing old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// ─── Fetch Event ───────────────────────────────────────────
// Intercepts all network requests
// Returns cached version if available, otherwise fetches from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if found
      if (cachedResponse) {
        return cachedResponse;
      }
      // Otherwise fetch from network
      return fetch(event.request).catch(() => {
        // If network fails too, return the cached index.html
        return caches.match('/index.html');
      });
    })
  );
});