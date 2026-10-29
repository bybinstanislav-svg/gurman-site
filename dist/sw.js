const CACHE_NAME = 'gurman-cache-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)));
    }).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // запросы к API никогда не кэшируем — заказы и стоп-лист всегда свежие
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // только свои GET-запросы
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // СЕТЬ В ПРИОРИТЕТЕ: сначала пробуем сервер, кэш — только если сервер недоступен.
  // Так обновления сайта доходят до пользователей без ручной чистки кэша.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
