import type { Metadata, ResolvingMetadata } from "next";
import ProfitRate from "../ProfitRate";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../../utils/seo";
import StockMoreCalculators from "@/app/calculator/components/StockMoreCalculators";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

interface Props {
    params: Promise<{ slug: string }>;
}

import stocksData from "../../data/stocks.json";

interface Stock {
    name: string;
    code: string;
    market: string;
}

function findStock(slug: string): { name: string; code?: string } {
    const normalized = decodeURIComponent(slug).normalize('NFC');

    // 1. 하이브리드 패턴 (삼성전자-005930)
    if (normalized.includes("-")) {
        const [name, code] = normalized.split("-");
        return { name, code };
    }

    // 2. 종목 코드 패턴 (005930)
    if (/^\d{6}$/.test(normalized)) {
        const stock = stocksData.find(s => s.code === normalized);
        return stock ? { name: stock.name, code: stock.code } : { name: normalized };
    }

    // 3. 종목명 패턴 (삼성전자)
    const stockByName = stocksData.find(s => s.name === normalized);
    return stockByName ? { name: stockByName.name, code: stockByName.code } : { name: normalized };
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const { name, code } = findStock(slug);
    const displayCode = code ? `(${code})` : "";

    // 사용자 제안 기반 SEO 패턴 적용
    return {
        title: `${code || ""} ${name} 주식 수익률 계산기 | ${name} 투자 수익 계산기 - JIKO 계산기`,
        description: `${name} 수익률 계산기 | ${code || ""} 투자 수익 시뮬레이션. 매수가, 현재가, 수량만 입력하면 세금과 수수료를 제외한 실질 수익을 바로 확인하세요.`,
        keywords: [name, code, "수익률", "수익금", "주식 계산기", `${name} 수익률`, `${code} 수익률`].filter(Boolean) as string[],
        alternates: { canonical: `${BASE_URL}/calculator/stock/profit-rate/${slug}` },
        openGraph: {
            title: `${name}${displayCode} 수익률 계산기`,
            description: `${name} 수익 현황 및 투자 수익률 리포트`,
            url: `${BASE_URL}/calculator/stock/profit-rate/${slug}`,
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
        COMMON_BREADCRUMBS.PROFIT_RATE,
        { name: name, item: `/calculator/stock/profit-rate/${slug}` }
    ]);

    const faqList = [
        {
            question: `${name} 수익률 계산 시 세금이 포함되나요?`,
            answer: "본 기본 계산기는 수수료를 제외한 단순 차익 계산입니다. 자세한 세금 포함 수익은 '수수료 계산기'를 이용해 주세요."
        },
        {
            question: "수익률 등급(야수의 심장 등)은 무엇인가요?",
            answer: "투자자의 재미와 직관적인 성과 파악을 위해 수익률 구간별로 부여하는 재미있는 별칭입니다."
        }
    ];

    const stockSchema = code ? {
        "@context": "https://schema.org",
        "@type": "InvestmentOrDeposit",
        "name": name,
        "tickerSymbol": code,
        "url": `${BASE_URL}/calculator/stock/profit-rate/${slug}`
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
            <NavBar title={`${name} 주식 수익률 계산기`} description={`${name} 종목의 투자 수익 현황을 확인하세요.`} position="top" />
            <ProfitRate stockName={name} initialCode={code} />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                {/* [공통 카드세션] 1. 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        💰 {name} {code ? `(${code})` : ""} 투자 수익 분석 리포트
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        {name} 종목의 현재 수익금이 궁금하신가요? {code ? `티커 ${code}` : "해당 종목"}의 매수가와 현재가, 수량을 입력하여 
                        수수료를 제외한 실질 수익률을 한눈에 확인해 보세요.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* [공통 카드세션] 2. 사용 방법 */}
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>{name}의 <strong>매수가</strong>와 <strong>수량</strong>을 입력합니다.</li>
                            <li>목표가 또는 <strong>현재가</strong>를 입력하세요.</li>
                            <li>'계산하기'를 클릭하여 <strong>수익금</strong>과 <strong>수익률</strong>을 확인합니다.</li>
                            <li>결과 그래프를 통해 전체 투자 금액 대비 수익 비중을 파악하세요.</li>
                        </ul>
                    </section>

                    {/* [공통 카드세션] 3. 계산 예시 */}
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-2">
                            <p>{name} 매수가 : <strong>10,000원</strong></p>
                            <p>현재가 : <strong>12,000원</strong> (100주 보유시)</p>
                            <p className="border-t border-gray-200 dark:border-gray-600 pt-1 mt-1 text-red-500 font-bold">수익률 결과 : 20%</p>
                            <p className="text-red-500 font-semibold">총 수익금 : 200,000원</p>
                        </div>
                    </section>
                </div>

                {/* [공통 카드세션] 4. FAQ */}
                <FAQ faqList={faqList} />

                {/* 주식 계산기 더 보기 */}
                <StockMoreCalculators />
            </main>
        </div>
    );
}
