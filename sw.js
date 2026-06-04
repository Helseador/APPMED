const CACHE = 'appmed-v1';

// Instalar - cachear el index.html principal
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(cache){
      return cache.addAll([
        self.registration.scope,
        self.registration.scope + 'index.html'
      ]).catch(function(){});
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

// Fetch - cache first para assets, red para Firebase
self.addEventListener('fetch', function(e){
  var url = e.request.url;
  
  // Firebase y APIs externas siempre van a la red
  if(url.includes('firebaseio.com') || 
     url.includes('googleapis.com') || 
     url.includes('firebaseapp.com') ||
     url.includes('cdnjs') ||
     url.includes('cdn.') ||
     url.includes('unpkg.com')){
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(response){
        if(response&&response.status===200){
          var clone = response.clone();
          caches.open(CACHE).then(function(cache){
            cache.put(e.request, clone);
          });
        }
        return response;
      }).catch(function(){
        if(e.request.mode==='navigate'){
          return caches.match(self.registration.scope);
        }
      });
    })
  );
});
