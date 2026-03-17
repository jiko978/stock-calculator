import type { Metadata, ResolvingMetadata } from "next";
import StockFee from "../StockFee";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../../utils/seo";
import stocksData from "../../data/stocks.json";

const BASE_URL = "https://jiko.kr";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = (await params).slug;
    const decodedSlug = decodeURIComponent(slug);

    let stockName = decodedSlug;
    let stockCode = "";

    // 하이브리드 패턴 처리 (이름-코드)
    if (decodedSlug.includes("-")) {
        const parts = decodedSlug.split("-");
        stockCode = parts[parts.length - 1];
        stockName = parts.slice(0, -1).join("-");
    } else if (/^\d{6}$/.test(decodedSlug)) {
        // 코드 패턴
        const found = stocksData.find(s => s.code === decodedSlug);
        if (found) {
            stockName = found.name;
            stockCode = found.code;
        }
    } else {
        // 이름 패턴
        const found = stocksData.find(s => s.name === decodedSlug);
        if (found) {
            stockName = found.name;
            stockCode = found.code;
        }
    }

    const title = `${stockCode ? `${stockCode} ` : ""}${stockName} 주식 수수료 계산기 | ${stockName} 세금 수수료 확인 - JIKO`;
    const description = `${stockName}(${stockCode}) 매매 시 발생하는 세금과 수수료를 계산해 보세요. 코스피/코스닥 거래세와 해외주식 양도세 공제 혜택을 반영한 정확한 세후 순이익을 도출합니다.`;

    return {
        title,
        description,
        alternates: { canonical: `${BASE_URL}/calculator/stock/fee/${slug}` },
        openGraph: {
            title,
            description,
            url: `${BASE_URL}/calculator/stock/fee/${slug}`,
            images: [`${BASE_URL}/calculator/jiko-calculator-icon2.png`],
        },
    };
}

export default async function Page({ params }: Props) {
    const slug = (await params).slug;
    const decodedSlug = decodeURIComponent(slug);

    let stockName = decodedSlug;
    let stockCode = "";

    if (decodedSlug.includes("-")) {
        const parts = decodedSlug.split("-");
        stockCode = parts[parts.length - 1];
        stockName = parts.slice(0, -1).join("-");
    } else if (/^\d{6}$/.test(decodedSlug)) {
        const found = stocksData.find(s => s.code === decodedSlug);
        if (found) {
            stockName = found.name;
            stockCode = found.code;
        }
    } else {
        const found = stocksData.find(s => s.name === decodedSlug);
        if (found) {
            stockName = found.name;
            stockCode = found.code;
        }
    }

    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.STOCK_HOME,
        { name: "수수료 계산기", item: "/calculator/stock/fee" },
        { name: `${stockName} 수수료 계산`, item: `/calculator/stock/fee/${slug}` }
    ]);

    const stockSchema = stockCode ? {
        "@context": "https://schema.org",
        "@type": "InvestmentOrDeposit",
        "name": stockName,
        "tickerSymbol": stockCode,
        "url": `${BASE_URL}/calculator/stock/fee/${slug}`
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
            <NavBar title={`${stockName} 수수료 계산기 | JIKO`} description={`${stockName} 주식 매수/매도 시 발생하는 수수료와 세금을 확인하세요.`} position="top" />
            <StockFee stockName={stockName} initialCode={stockCode} />

            <main className="max-w-2xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        📜 {stockName} 세금 및 실전 투자 분석 리포트
                    </h2>
                    <div className="space-y-6">
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                            <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2 text-sm flex items-center gap-1">
                                🏢 {stockName} 국내 거래 시 유의사항
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                                {stockName}({stockCode}) 종목을 국내 시장에서 매도할 경우, 2026년 기준 0.20%의 거래비용(증권거래세+농특세)이 발생합니다.
                                손실 중이더라도 세금은 원천징수되므로 '최소 익절가'를 반드시 확인하여 실질 수익을 지키는 전략이 필요합니다.
                            </p>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-800/50">
                            <h3 className="font-bold text-orange-700 dark:text-orange-400 mb-2 text-sm flex items-center gap-1">
                                🌍 해외 투자 및 양도세 전략
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                                만약 {stockName} 관련 해외 ETF나 ADR에 투자하신다면 연간 250만 원까지의 양도소득 공제 혜택을 활용하세요.
                                수익이 250만 원을 초과할 경우 22%의 세율이 적용되므로, 연말에 손실 종목을 매도하여 수익을 상계하는 'Tax Loss Harvesting' 전략이 유효할 수 있습니다.
                            </p>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-800/50">
                            <h3 className="font-bold text-green-700 dark:text-green-400 mb-2 text-sm flex items-center gap-1">
                                💡 스마트한 매도 타이밍 잡기
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                                {stockName}의 변동성에 대비하여 단순 매수가가 아닌 수수료를 포함한 **Break-even Point(손익분기점)**를 아는 것이 중요합니다.
                                JIKO가 제공하는 최소 익절가 가이드를 통해 세금 떼고도 남는 진짜 수익 구간에서 현명한 결정을 내리세요.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
