// ─────────────────────────────────────────────────────────
// app/sitemap.ts
// 새 페이지 추가 시 routes 배열에만 추가하면 됩니다.
// ─────────────────────────────────────────────────────────

import { MetadataRoute } from "next";

const BASE_URL = "https://jiko.kr";

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        // ── 홈 ──
        { url: "/", priority: 1.0, changeFrequency: "weekly" as const },

        // ── 주식 ──
        { url: "/calculator/stock/avg-price",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/stock/profit-rate", priority: 0.8, changeFrequency: "monthly" as const },

        // ── 추가 예정 카테고리 (페이지 추가 시 여기에 등록) ──
        // { url: "/health/bmi",         priority: 0.8, changeFrequency: "monthly" as const },
        // { url: "/investment/...",     priority: 0.8, changeFrequency: "monthly" as const },
        // { url: "/life/...",           priority: 0.8, changeFrequency: "monthly" as const },
        // { url: "/etc/...",            priority: 0.8, changeFrequency: "monthly" as const },
    ];

    return routes.map(({ url, priority, changeFrequency }) => ({
        url: `${BASE_URL}${url}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
    }));
}