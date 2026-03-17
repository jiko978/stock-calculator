import type { Metadata, ResolvingMetadata } from "next";
import Dividend from "../Dividend";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../../utils/seo";
import NavBar from "@/app/calculator/components/NavBar";
import stocksData from "../../data/stocks.json";

const BASE_URL = "https://jiko.kr";

interface Props {
    params: Promise<{ slug: string }>;
}

function findStock(slug: string): { name: string; code?: string } {
    const decoded = decodeURIComponent(slug);

    // 1. 하이브리드 패턴 (삼성전자-005930)
    if (decoded.includes("-")) {
        const [name, code] = decoded.split("-");
        return { name, code };
    }

    // 2. 종목 코드 패턴 (005930)
    if (/^\d{6}$/.test(decoded)) {
        const stock = stocksData.find(s => s.code === decoded);
        return stock ? { name: stock.name, code: stock.code } : { name: decoded };
    }

    // 3. 종목명 패턴 (삼성전자)
    const stockByName = stocksData.find(s => s.name === decoded);
    return stockByName ? { name: stockByName.name, code: stockByName.code } : { name: decoded };
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const { name, code } = findStock(slug);
    const displayCode = code ? `(${code})` : "";

    return {
        title: `${code || ""} ${name} 배당금 계산기 | ${name} 배당 수익률 계산 - JIKO`,
        description: `${name} 배당금 및 배당 수익률 시뮬레이션. ${code || ""} 종목을 보유했을 때 세후 실수령액과 월 평균 배당금을 확인하세요. 목표 배당금을 위한 필요 수량까지 계산해 드립니다.`,
        keywords: [name, code, "배당금", "배당 수익률", "주식 계산기", `${name} 배당`, `${code} 배당`].filter(Boolean) as string[],
        alternates: { canonical: `${BASE_URL}/calculator/stock/dividend/${slug}` },
        openGraph: {
            title: `${name}${displayCode} 배당금 계산기`,
            description: `${name} 배당 수익 현황 및 목표 달성 리포트`,
            url: `${BASE_URL}/calculator/stock/dividend/${slug}`,
            images: [`${BASE_URL}/calculator/jiko-calculator-icon2.png`],
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const { name, code } = findStock(slug);

    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.STOCK_HOME,
        { name: "배당금 계산기", item: "/calculator/stock/dividend" },
        { name: name, item: `/calculator/stock/dividend/${slug}` }
    ]);

    const stockSchema = code ? {
        "@context": "https://schema.org",
        "@type": "InvestmentOrDeposit",
        "name": name,
        "tickerSymbol": code,
        "url": `${BASE_URL}/calculator/stock/dividend/${slug}`
    } : null;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            {stockSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(stockSchema) }}
                />
            )}

            <NavBar title={`${name} 배당금 계산기 | JIKO`} description={`${name} 종목의 배당 수익률과 목표 달성을 시뮬레이션 하세요.`} position="top" />

            <Dividend stockName={name} initialCode={code} />

            <main className="max-w-2xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        💹 {name} {code ? `(${code})` : ""} 배당 투자 가치 분석 리포트
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        {name} 종목의 배당 매력을 확인해 보세요. {code ? `티커 ${code}` : "해당 종목"}의 주당 배당금을 입력하면
                        나의 매수가 대비 배당 수익률(YoC)과 현재가 대비 배당률을 즉시 비교할 수 있습니다.
                        {name} 배당금으로 꿈꾸는 경제적 자유에 한 걸음 더 다가가세요.
                    </p>
                </section>
            </main>
        </div>
    );
}
