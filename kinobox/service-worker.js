const CACHE_NAME = 'kinobox-cache-v1.2'; // Обновите имя кэша для новой версии

// Установка (install) нового кэша
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/rep/kinobox/',
                '/rep/kinobox/index.html',
                '/rep/kinobox/film.html',
                '/rep/kinobox/saved.html',
                '/rep/kinobox/search.html',
                '/rep/kinobox/player.html',
                '/rep/kinobox/styles/style.css',
                '/rep/kinobox/js/script.js',
                '/rep/kinobox/js/film.js',
                '/rep/kinobox/js/saved.js',
                '/rep/kinobox/js/search.js',
                '/rep/kinobox/js/main.js',
                '/rep/kinobox/img/logo.svg'
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