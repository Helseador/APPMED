const CACHE = 'appmed-v3';

self.addEventListener('install', function(e){
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Sin cache - todo va directo a la red siempre
self.addEventListener('fetch', function(e){
  // Dejar pasar todo sin interceptar
  return;
});
