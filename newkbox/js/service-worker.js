self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('kinobox-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/film.html',
          '/player.html',
          '/search.html',
          '/css/styles.css',
          '/js/script.js',
          '/img/icon-192x192.png',
          '/img/icon-512x512.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  