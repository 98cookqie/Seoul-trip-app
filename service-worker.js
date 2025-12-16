const CACHE_NAME = 'seoul-trip-cache-v4';
const urlsToCache = [
    './S_index.html',
    './manifest.json',
    './service-worker.js'
];

self.addEventListener('install', (event) => {
    // 強制讓新的 Service Worker 進入等待狀態，以便立即啟用
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 如果快取中有，就用快取的
                if (response) {
                    return response;
                }
                // 如果沒有，就從網路抓取
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 刪除舊版本的快取
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
