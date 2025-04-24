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

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  const requestURL = new URL(event.request.url);

  if (requestURL.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log("[Service Worker] Fetch successful:", event.request.url);
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              console.log("[Service Worker] Fetch successful:", event.request.url);
              return networkResponse;
            });
          });
      })
    );
  }
  // No log for external requests
});

// Handle Push Notifications
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.error('[Service Worker] Push event has NO data!');
    return;
  }

  const data = event.data.json();
  console.log('[Service Worker] Push received:', data);
  console.log('[Service Worker] Notification Message:', data.message);

  const options = {
    body: data.message || 'Breaking News!',
    icon: '/globicon.svg',
    badge: '/globicon.svg'
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
