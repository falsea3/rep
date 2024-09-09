const CACHE_NAME = 'kinobox-cache-v1.2';

// Установка (install) нового кэша
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Немедленно активируем новый Service Worker
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all([
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
            ].map((url) => {
                return cache.add(url).catch((error) => {
                    console.error(`Не удалось кэшировать ${url}:`, error);
                });
            }));
        })
    );
});

// Удаление старых кэшей при активации нового сервис-воркера
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim(); // Обновляем все клиенты после активации
});

// Перехват запросов и их обработка
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // Здесь можно добавить обработку в случае неудачного fetch
                console.error(`Не удалось загрузить: ${event.request.url}`);
            });
        })
    );
});
