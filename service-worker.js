const cacheName = 'comptia-flashcards-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/icons/icon-192x192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return Promise.all(
        assetsToCache.map(url => {
          return fetch(url).then(response => {
            if (!response.ok) {
              throw new Error('Request failed: ' + url);
            }
            return cache.put(url, response);
          }).catch(error => {
            console.error('Failed to cache:', url, error);
          });
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});