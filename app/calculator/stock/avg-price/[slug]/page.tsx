import type { Metadata, ResolvingMetadata } from "next";
import AvgPrice from "../AvgPrice";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../../utils/seo";

const BASE_URL = "https://jiko.kr";

interface Props {
    params: Promise<{ slug: string }>;
}

import stocksData from "../../data/stocks.json";

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
        title: `${name} 평균단가 계산기 | ${code || ""} 투자 수익 계산 - JIKO`,
        description: `${name} 평균단가 시ミュ레이션. ${code || ""} 종목의 여러 매수 시점에 따른 최종 평단가와 수익률을 계산해보세요. 물타기/불타기 필수 도구.`,
        keywords: [name, code, "평균단가", "물타기", "주식 계산기", `${name} 평단가`, `${code} 계산기`].filter(Boolean) as string[],
        alternates: { canonical: `${BASE_URL}/calculator/stock/avg-price/${slug}` },
        openGraph: {
            title: `${name}${displayCode} 평균단가 계산기`,
            description: `${name} 보유 주식 평균 단가 및 수익률 시뮬레이션`,
            url: `${BASE_URL}/calculator/stock/avg-price/${slug}`,
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
        COMMON_BREADCRUMBS.AVG_PRICE,
        { name: name, item: `/calculator/stock/avg-price/${slug}` }
    ]);

    const stockSchema = code ? {
        "@context": "https://schema.org",
        "@type": "InvestmentOrDeposit",
        "name": name,
        "tickerSymbol": code,
        "url": `${BASE_URL}/calculator/stock/avg-price/${slug}`
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
             <NavBar title="주식 평균 단가 계산기 | JIKO" description="주식 보유 평단가와 수익률을 계산해보세요" />
             <AvgPrice stockName={name} initialCode={code} />

             <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        📈 {name} {code ? `(${code})` : ""} 평균단가 분석 리포트
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                         {name} {code ? `종목(기호: ${code})` : ""}의 물타기 또는 불타기 시점의 
                        정확한 평균 단가를 계산하고 계신가요? 보유 주식 수와 가격을 입력하여 
                        최적의 투자 시점을 분석해 보세요.
                    </p>
                </section>
             </main>
        </div>
    );
}
