// sw.js — Service Worker (Fixed Version)
// Uses network-first strategy for better reliability

const CACHE_NAME = 'bpk-cfms-v2';

const STATIC_ASSETS = [
  '/logo.png',
  '/bpk-logo.png',
  '/icon192.png',
  '/icon512.png',
  '/background_login.jpg',
];

// ─── Install ───────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Only cache images, NOT HTML or JS
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ─── Activate ──────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// ─── Fetch ─────────────────────────────────────────────────
// NETWORK FIRST strategy:
// → Always try network first
// → Only use cache if network fails
// → HTML/Navigation requests ALWAYS go to network
self.addEventListener('fetch', (event) => {

  // ── For navigation requests (page loads) ──────────────
  // Always fetch fresh from network — never serve cached HTML
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  // ── For static assets (images, fonts) ─────────────────
  // Try cache first, then network
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        });
      })
    );
    return;
  }

  // ── For everything else → network first ───────────────
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});