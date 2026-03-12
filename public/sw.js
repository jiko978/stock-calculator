// ─────────────────────────────────────────────────────────
// public/sw.js — Legacy Service Worker Kill-Switch
// ─────────────────────────────────────────────────────────
// 과거에 jiko.kr (루트) 경로에 실수로 설치된 서비스 워커가 
// 새로운 업데이트(React 컴포넌트)를 가로막고 렌더링을 방해하는 것을 막기 위해
// 이 파일이 스스로를 파괴(Unregister)하고 모든 캐시를 비우도록 강제합니다.

self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 계산기용(jiko-calculator-v*) 제외하고 모두 삭제하거나, 
                    // 안전하게 전체 캐시를 초기화합니다.
                    console.log('Deleting legacy cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        })
    );

    self.registration.unregister().then(() => {
        console.log('Legacy root ServiceWorker unregistered successfully.');
    });

    self.clients.claim().then(() => {
        // 클라이언트(열려있는 브라우저 탭들)에게 즉시 새로고침 명령을 보냅니다.
        self.clients.matchAll({ type: 'window' }).then((clients) => {
            for (const client of clients) {
                client.navigate(client.url);
            }
        });
    });
});
