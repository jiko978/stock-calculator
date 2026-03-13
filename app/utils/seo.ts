/**
 * SEO BreadcrumbList JSON-LD Generator
 */

interface BreadcrumbItem {
    name: string;
    item: string;
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.item.startsWith("http") ? item.item : `https://jiko.kr${item.item}`,
        })),
    };
}

export const COMMON_BREADCRUMBS = {
    HOME: { name: "홈", item: "/" },
    CALC_HOME: { name: "계산기 홈", item: "/calculator" },
    STOCK_HOME: { name: "주식 계산기", item: "/calculator/stock" },
    AVG_PRICE: { name: "평단가 계산기", item: "/calculator/stock/avg-price" },
    PROFIT_RATE: { name: "수익률 계산기", item: "/calculator/stock/profit-rate" },
};
