"use client";

import { useEffect } from "react";

export default function UnregisterRootSW() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                for (const registration of registrations) {
                    // Check if the service worker is registered at the root scope
                    if (registration.scope.endsWith("/") && !registration.scope.includes("/calculator")) {
                        registration.unregister().then(async () => {
                            console.log("Unregistered legacy root Service Worker:", registration.scope);
                            
                            // Client 측에서도 강제 캐시 삭제
                            if ('caches' in window) {
                                const keys = await caches.keys();
                                await Promise.all(keys.map(key => caches.delete(key)));
                            }
                            
                            // 1회성 강력 새로고침
                            window.location.reload();
                        });
                    }
                }
            });
        }
    }, []);

    return null;
}
