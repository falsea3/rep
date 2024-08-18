const CACHE_NAME = 'kinobox-cache-v1.2'; // Обновите имя кэша для новой версии

// Установка (install) нового кэша
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
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

// Удаление старых кэшей при активации нового сервис-воркера
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]; // Список кэшей, которые нужно оставить

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        // Удаляем старые кэши
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Перехват запросов и их обработка (fetch)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});