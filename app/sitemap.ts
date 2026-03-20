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
        { url: "/calculator/stock",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/stock/avg-price",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/stock/profit-rate", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/stock/dividend", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/stock/fee", priority: 0.8, changeFrequency: "monthly" as const },

        // ── 금융 ──
        { url: "/calculator/finance",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/finance/deposits",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/finance/savings", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/finance/loans", priority: 0.8, changeFrequency: "monthly" as const },

        // ── policy ──
        { url: "/policy/about", priority: 0.5, changeFrequency: "monthly" as const },
        { url: "/policy/contact", priority: 0.5, changeFrequency: "monthly" as const },
        { url: "/policy/privacy", priority: 0.3, changeFrequency: "monthly" as const },
        { url: "/policy/terms", priority: 0.3, changeFrequency: "monthly" as const },
        { url: "/policy/disclaimer", priority: 0.3, changeFrequency: "monthly" as const },

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