self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('music-app').then((cache) => {
            return cache.addAll([
                './',
                './index.html',
                './styles.css',
                './images/favicon-192.png',
                './images/favicon-512.png',
                './images/logo.webp',
                './manifest.json',
                './service-worker.js'
                // Add more files to cache as needed
            ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    return cacheName !== 'music-app';
                }).map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
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
