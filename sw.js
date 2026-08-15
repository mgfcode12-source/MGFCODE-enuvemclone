const CACHE_NAME = 'enuvemgf-v1';
const APP_SHELL = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){ return cache.addAll(APP_SHELL); })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// Network-first para não travar os dados do Supabase; cache só como respaldo do "casco" do app
self.addEventListener('fetch', function(event){
  if(event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(function(){ return caches.match(event.request); })
  );
});
