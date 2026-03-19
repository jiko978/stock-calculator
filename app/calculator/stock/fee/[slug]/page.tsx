import type { Metadata, ResolvingMetadata } from "next";
import StockFee from "../StockFee";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../../utils/seo";
import StockMoreCalculators from "@/app/calculator/components/StockMoreCalculators";
import FAQ from "@/app/calculator/components/FAQ";
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

    const title = `${stockCode ? `${stockCode} ` : ""}${stockName} 주식 수수료 계산기 | ${stockName} 세금 수수료 확인 - JIKO 계산기`;
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
        COMMON_BREADCRUMBS.FEE,
        { name: `${stockName} 주식 수수료 계산기`, item: `/calculator/stock/fee/${slug}` }
    ]);

    const faqList = [
        {
            question: `${stockName}의 최소 익절가는 왜 중요한가요?`,
            answer: "매도가에서 수수료와 거래세를 제외한 실질 수익이 발생하는 지점이 바로 최소 익절가입니다. 이를 미리 파악해야 손해 없는 매매 시점을 잡을 수 있습니다."
        },
        {
            question: "해외 주식 250만 원 공제는 어떻게 적용되나요?",
            answer: "연간 실현 손익에서 250만 원까지는 양도소득세가 면제되며, 이를 넘는 수익에 대해서만 22%의 세율이 적용됩니다."
        }
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <NavBar title={`${stockName} 수수료 계산기`} description={`${stockName} 주식 매수/매도 시 발생하는 수수료와 세금을 확인하세요.`} position="top" />
            <StockFee stockName={stockName} initialCode={stockCode} />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-8">
                {/* [공통 카드세션] 1. 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">📊</span> {stockName} 주식 수수료 계산기
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        {stockName}({stockCode}) 종목 거래 시 발생하는 모든 수수료와 세금을 계산해 드립니다. 
                        단순히 사고파는 가격 차이를 넘어, 실제 수익에 영향을 주는 모든 비용을 미리 모의계산하여 성공적인 투자 전략을 세워보세요.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* [공통 카드세션] 2. 사용 방법 */}
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>거래하고자 하는 <strong>시장(국내/해외)</strong>을 선택합니다.</li>
                            <li><strong>매수가, 매도가, 수량</strong> 등의 기본 거래 정보를 입력하세요.</li>
                            <li>이용 중인 증권사의 <strong>수수료율</strong>이 있다면 수정하여 반영할 수 있습니다.</li>
                            <li>'계산하기'를 클릭하면 수수료를 포함한 손익분기점과 최적의 매도 시점을 안내해 드립니다.</li>
                        </ul>
                    </section>

                    {/* [공통 카드세션] 3. 계산 예시 */}
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-1">
                            <p>{stockName} 매도 금액 : <strong>1,000,000원</strong></p>
                            <p>거래세(0.18%) : <strong>1,800원</strong> / 수수료(0.01%) : <strong>100원</strong></p>
                            <p className="border-t border-gray-200 dark:border-gray-600 pt-1 mt-1 text-red-500 font-bold">
                                최종 차감 비용 : 1,900원
                            </p>
                            <p className="text-blue-600 font-semibold text-xs leading-relaxed">
                                * 매수 시 수수료도 합산되어 체결 단가에 반영됩니다.
                            </p>
                        </div>
                    </section>
                </div>

                {/* [공통 카드세션] 4. FAQ */}
                <FAQ faqList={faqList} />

                {/* [개별 카드세션] 1. 수수료와 세금 투자 지식 섹션 */}
                <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                        📊 주식 매매 시 꼭 알아야 할 수수료 및 세금 상식
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-medium">
                        주식 투자에서 가장 중요한 것은 '벌었을 때 얼마나 지키느냐'입니다. 
                        수익이 났더라도 수수료와 세금을 고려하지 않으면 실질적인 이익이 생각보다 작을 수 있습니다.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-3">
                            <h3 className="font-bold text-blue-600 flex items-center gap-1">
                                <span className="w-1 h-3 bg-blue-600 rounded-full" /> {stockName} 국내 거래 (거래세)
                            </h3>
                            <ul className="list-disc list-inside text-gray-500 space-y-1">
                                <li>매도 시점에 즉시 부과됩니다.</li>
                                <li>2026년 기준 코스피/코스닥 공통 0.18%</li>
                                <li>손실이 나더라도 수수료와 세금은 발생합니다.</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-bold text-orange-600 flex items-center gap-1">
                                <span className="w-1 h-3 bg-orange-600 rounded-full" /> {stockName} 해외 거래 (양도세)
                            </h3>
                            <ul className="list-disc list-inside text-gray-500 space-y-1">
                                <li>수익이 발생했을 때만 납부합니다.</li>
                                <li>연간 합산 수익 250만 원까지 공제</li>
                                <li>공제액 초과 수익에 대해 22% 부과</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 주식 계산기 더 보기 */}
                <StockMoreCalculators />
            </main>
        </div>
    );
}
