self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('kinobox-cache').then((cache) => {
        return cache.addAll([
          '/rep/newkbox/',
          '/rep/newkbox/index.html',
          '/rep/newkbox/film.html',
          '/rep/newkbox/player.html',
          '/rep/newkbox/search.html',
          '/rep/newkbox/css/styles.css',
          '/rep/newkbox/js/script.js',
          '/rep/newkbox/img/icon-192x192.png',
          '/rep/newkbox/img/icon-512x512.png'
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
  