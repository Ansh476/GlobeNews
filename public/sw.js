const CACHE_NAME = 'news-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/newspaperlogo.png',
  '/randomnews.png',
  '/newspaperlogo-removebg-preview.png'
];

// Install event: Cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching assets...');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event: Cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Cache-first strategy
// Fetch event: Cache-first strategy with logging
self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetching:', event.request.url);
  
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return cachedResponse;
        }
  
        return fetch(event.request)
          .then((networkResponse) => {
            console.log('[Service Worker] Fetch successful!', event.request.url);
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);
            return new Response('Network error!', { status: 408 });
          });
      })
    );
  });

// Handle Push Notifications
self.addEventListener('push', (event) => {
    if (!event.data) {
      console.error('[Service Worker] Push event has NO data!');
      return;
    }
  
    const data = event.data.json();
    console.log('[Service Worker] Push received:', data); // Log full push data
    console.log('[Service Worker] Notification Message:', data.message); // Log message only
  
    const options = {
      body: data.message || 'Breaking News!',
      icon: '/newspaperlogo.png',
      badge: '/newspaperlogo-removebg-preview.png'
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title || 'News Alert', options)
    );
  });

// Handle Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'syncNews') {
    console.log('[Service Worker] Sync successful!');
  }
});
