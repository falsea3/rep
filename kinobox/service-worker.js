const CACHE_NAME = 'kinobox-cache-v1.3.1';

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
                '/rep/kinobox/scripts/script.js',
                '/rep/kinobox/scripts/film.js',
                '/rep/kinobox/scripts/saved.js',
                '/rep/kinobox/scripts/search.js',
                '/rep/kinobox/scripts/main.js',
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
