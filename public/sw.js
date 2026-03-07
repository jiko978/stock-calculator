// ─────────────────────────────────────────────────────────
// public/sw.js — Service Worker (next-pwa 없이 직접 구현)
// ─────────────────────────────────────────────────────────

const CACHE_NAME = "jiko-calculator-v1";

const STATIC_ASSETS = [
    "/",
    "/stock/avg-price",
    "/stock/profit-rate",
    "/manifest.json",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
];

// 설치: 정적 파일 사전 캐시
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// 활성화: 이전 캐시 정리
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// fetch: Network First (온라인 우선, 실패 시 캐시)
self.addEventListener("fetch", (event) => {
    // GET 요청만 처리, chrome-extension 등 외부 스킴 제외
    if (event.request.method !== "GET") return;
    if (!event.request.url.startsWith("http")) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // 성공 시 캐시에도 저장
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                return response;
            })
            .catch(() => {
                // 오프라인 시 캐시에서 응답
                return caches.match(event.request);
            })
    );
});