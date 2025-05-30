const CACHE_NAME = 'calculadora-facens-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.svg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async cache => {
                console.log('Cache aberto');
                try {
                    return await cache.addAll(urlsToCache);
                } catch (error) {
                    console.log('Erro ao cachear alguns recursos:', error);
                    return await Promise.allSettled(
                        urlsToCache.map(url => cache.add(url))
                    );
                }
            })
            .catch(error => {
                console.log('Erro ao fazer cache:', error);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }

                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(() => {
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});