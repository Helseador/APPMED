const CACHE = 'appmed-v1';
const ASSETS = [
  '/',
  '/index.html',
  'https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.1/firebase-database-compat.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
];

// Instalar - cachear assets principales
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(cache){
      return cache.addAll(ASSETS).catch(function(){});
    })
  );
  self.skipWaiting();
});

// Activar - limpiar caches viejos
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){return k!==CACHE;})
          .map(function(k){return caches.delete(k);})
      );
    })
  );
  self.clients.claim();
});

// Fetch - cache first para assets, network first para Firebase
self.addEventListener('fetch', function(e){
  var url = e.request.url;
  
  // Firebase siempre va a la red (datos en tiempo real)
  if(url.includes('firebaseio.com') || url.includes('googleapis.com/identitytoolkit')){
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(response){
        // Cachear solo respuestas validas
        if(response&&response.status===200&&response.type==='basic'){
          var clone = response.clone();
          caches.open(CACHE).then(function(cache){
            cache.put(e.request, clone);
          });
        }
        return response;
      }).catch(function(){
        // Sin red y sin cache - retornar index.html como fallback
        if(e.request.mode==='navigate'){
          return caches.match('/index.html');
        }
      });
    })
  );
});
