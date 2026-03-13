// ─────────────────────────────────────────────────────────
// app/components/RegisterSW.tsx
// Service Worker 등록 전용 Client Component
// ─────────────────────────────────────────────────────────

"use client";

import { useEffect } from "react";

export default function RegisterSW() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return;

        // 개발 환경: SW 비활성화 및 기존 등록 해제
        if (process.env.NODE_ENV === "development") {
            navigator.serviceWorker.getRegistrations().then((regs) => {
                regs.forEach((reg) => reg.unregister());
                console.log("SW unregistered (dev mode)");
            });
            return;
        }

        // 운영 환경: SW 등록
        navigator.serviceWorker
            .register("/calculator/sw.js", {
                scope: "/calculator",
            })
            .then((reg) => console.log("SW registered:", reg.scope))
            .catch((err) => console.error("SW registration failed:", err));
    }, []);

    return null;
}