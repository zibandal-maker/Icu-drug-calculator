/* ICU 약물 계산기 — Service Worker
   단일 HTML 앱이라 캐시 전략 단순:
   - install 시 핵심 자산 캐시
   - fetch는 "네트워크 우선, 실패시 캐시" (앱 업데이트 즉시 반영 + 오프라인 작동)
   배포(웹 업데이트)마다 CACHE_VER만 올리면 캐시 갱신됨.
*/
var CACHE_VER = 'icucalc-v1';
var CORE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_VER).then(function(c){
      return c.addAll(CORE).catch(function(){ /* 아이콘 누락 등 무시 */ });
    })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k!==CACHE_VER) return caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  if(e.request.method!=='GET') return;
  // assetlinks 등 .well-known은 항상 네트워크 (검증 신선도)
  if(e.request.url.indexOf('/.well-known/')>=0) return;
  e.respondWith(
    fetch(e.request).then(function(res){
      // 성공 시 캐시 갱신
      var copy=res.clone();
      caches.open(CACHE_VER).then(function(c){ c.put(e.request, copy); }).catch(function(){});
      return res;
    }).catch(function(){
      // 오프라인 → 캐시 폴백, 없으면 루트
      return caches.match(e.request).then(function(m){
        return m || caches.match('/index.html') || caches.match('/');
      });
    })
  );
});
