import type { Metadata, ResolvingMetadata } from "next";
import AvgPrice from "../AvgPrice";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../../utils/seo";
import StockMoreCalculators from "@/app/calculator/components/StockMoreCalculators";
import FAQ from "@/app/calculator/components/FAQ";

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
        title: `${name} 주식 평균단가 계산기 | ${code || ""} 주식 투자 수익 계산기 - JIKO 계산기`,
        description: `${name} 평균단가 시뮬레이션. ${code || ""} 종목의 여러 매수 시점에 따른 최종 평단가와 수익률을 계산해보세요. 물타기/불타기 필수 도구.`,
        keywords: [name, code, "평균단가", "물타기", "주식 계산기", `${name} 평단가`, `${code} 계산기`].filter(Boolean) as string[],
        alternates: { canonical: `${BASE_URL}/calculator/stock/avg-price/${slug}` },
        openGraph: {
            title: `${name}${displayCode} 주식 평균단가 계산기`,
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

    const faqList = [
        {
            question: `${name}의 평단가를 낮추려면 얼마나 더 사야 하나요?`,
            answer: "현재가 입력 시 '본전 탈출을 위한 추가 매수량' 기능을 통해 시스템이 자동으로 필요 수량을 계산해 드립니다."
        },
        {
            question: "물타기 계산 결과가 실제와 다를 수 있나요?",
            answer: "증권사별로 소수점 처리 방식이나 수수료 가산 방식에 따라 미세한 오차가 발생할 수 있으나, 비율상으로는 매우 정확합니다."
        }
    ];

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
             <NavBar title="주식 평균단가 계산기" description="주식 보유 평균단가와 수익률을 계산해보세요" />
             <AvgPrice stockName={name} initialCode={code} />

             <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                {/* [공통 카드세션] 1. 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        📈 {name} {code ? `(${code})` : ""} 평균단가 분석 리포트
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                         {name} {code ? `종목(기호: ${code})` : ""}의 물타기 또는 불타기 시점의 
                        정확한 평균단가를 계산하고 계신가요? 보유 주식 수와 가격을 입력하여
                        최적의 투자 시점을 분석해 보세요.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* [공통 카드세션] 2. 사용 방법 */}
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>{name}의 <strong>매수 회차별</strong> 가격과 수량을 입력합니다.</li>
                            <li><strong>현재가</strong>를 입력하면 본전 탈출을 위한 목표치를 알려드립니다.</li>
                            <li>'계산하기'를 통해 <strong>최종 평균 단가</strong>를 확인하세요.</li>
                            <li>막대 차트로 각 매수 시점별 비중을 시각적으로 파악할 수 있습니다.</li>
                        </ul>
                    </section>

                    {/* [공통 카드세션] 3. 계산 예시 */}
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-1">
                            <p>1차 매수 : <strong>10,000원</strong> (100주)</p>
                            <p>2차 매수 : <strong>8,000원</strong> (100주) - <strong>물타기</strong></p>
                            <p className="border-t border-gray-200 dark:border-gray-600 pt-1 mt-1 text-red-500 font-bold">
                                최종 평단가 : 9,000원
                            </p>
                            <p className="text-blue-600 font-semibold text-xs animate-pulse">평단가 하락 효과 : -10%</p>
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
