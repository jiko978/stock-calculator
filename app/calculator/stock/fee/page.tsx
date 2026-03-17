import type { Metadata } from "next";
import StockFee from "./StockFee";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../utils/seo";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "주식 수수료 계산기 | 국내/해외 주식 수수료 및 세금 계산 - JIKO",
    description: "국내 코스피, 코스닥 증권사 수수료부터 해외 주식 양도소득세까지 정확하게 계산해 보세요. 수수료를 포함한 세후 순수익과 손해 보지 않는 최소 익절가를 즉시 확인하실 수 있습니다.",
    keywords: ["주식 수수료 계산기", "주식 수수료", "증권거래세 계산", "해외주식 양도소득세 계산", "최소 익절가", "주식 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/stock/fee` },
    openGraph: {
        title: "주식 수수료 계산기 | 국내/해외 주식 수수료 및 세금 계산 - JIKO",
        description: "수수료와 세금을 떼고 남는 진짜 내 수익은 얼마일까? 수수료 포함 손익을 완벽 반영!",
        url: `${BASE_URL}/calculator/stock/fee`,
        images: [`${BASE_URL}/calculator/jiko-calculator-icon2.png`],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "주식 수수료 계산기",
    description: "국내 코스피, 코스닥 증권사 수수료부터 해외 주식 양도소득세까지 정확하게 계산해 보세요. 수수료를 포함한 세후 순수익과 손해 보지 않는 최소 익절가를 즉시 확인하실 수 있습니다.",
    url: `${BASE_URL}/calculator/stock/fee`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    inLanguage: "ko",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "국내 주식 거래세는 얼마인가요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "2026년 기준 코스피와 코스닥의 증권거래세는 동일하게 0.18%입니다. (단, 시장 상황에 따라 변동될 수 있습니다.)",
            },
        },
        {
            "@type": "Question",
            name: "해외 주식 양도세 공제 금액은 얼마인가요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "해외 주식의 경우 연간 합산 수익 중 250만 원까지는 기본 공제 대상입니다.",
            },
        },
    ],
};

const schema = {
    "@context": "https://schema.org",
    "name": "주식 수수료 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/stock/fee`,
    "description": "국내/해외 주식 세금 및 수수료 계산"
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.STOCK_HOME,
        { name: "수수료 계산기", item: "/calculator/stock/fee" }
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <NavBar title="주식 수수료 계산기 | 국내/해외 주식 수수료 및 세금 계산 - JIKO" description="주식 매도 시 발생하는 수수료와 세금을 계산해보세요" position="top" />
            <StockFee />

            <main className="max-w-2xl mx-auto px-4 pb-16 space-y-8">
                {/* [공통 카드세션] 1. 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">📊</span> 주식 수수료 계산기
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        국내 코스피/코스닥부터 해외 주식 거래 시 발생하는 모든 수수료와 세금을 계산해 드립니다. 
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
                            <p>코스피 매도 금액: <strong>1,000,000원</strong></p>
                            <p>거래세(0.18%): <strong>1,800원</strong> / 수수료(0.01%): <strong>100원</strong></p>
                            <p className="border-t border-gray-200 dark:border-gray-600 pt-1 mt-1 text-red-500 font-bold">
                                최종 차감 비용: 1,900원
                            </p>
                            <p className="text-blue-600 font-semibold text-xs leading-relaxed">
                                * 매수 시 수수료도 합산되어 체결 단가에 반영됩니다.
                            </p>
                        </div>
                    </section>
                </div>

                {/* [공통 카드세션] 4. FAQ */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <span className="text-purple-500">❓</span> 자주 묻는 질문 (FAQ)
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">
                                Q. 최소 익절가는 왜 중요한가요?
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-purple-300 dark:border-purple-600 text-xs leading-relaxed">
                                A. 매수가보다 조금이라도 높게 팔면 수익이라 생각하기 쉽지만, 매동/매수 수수료와 거래세를 합치면 약 0.2~0.3% 이상의 비용이 발생합니다. 이 비용을 제외하고도 내 자산이 실제로 늘어나는 지점이 바로 **최소 익절가**입니다.
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">
                                Q. 해외 주식 250만 원 공제는 어떻게 적용되나요?
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-purple-300 dark:border-purple-600 text-xs leading-relaxed">
                                A. 1월 1일부터 12월 31일까지 결제일 기준 전체 실현 손익에서 250만 원을 뺀 나머지 금액에 대해 22%의 양도소득세가 부과됩니다. 손실이 난 종목이 있다면 함께 매도하여 전체 수익을 낮추는 절세 전략이 가능합니다.
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="border-gray-100 dark:border-gray-800" />

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
                                <span className="w-1 h-3 bg-blue-600 rounded-full" /> 국내 주식 (거래세)
                            </h3>
                            <ul className="list-disc list-inside text-gray-500 space-y-1">
                                <li>매도 시점에 즉시 부과됩니다.</li>
                                <li>2026년 기준 코스피/코스닥 공통 0.18% (변동 가능)</li>
                                <li>손실이 나더라도 수수료와 세금은 발생합니다.</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-bold text-orange-600 flex items-center gap-1">
                                <span className="w-1 h-3 bg-orange-600 rounded-full" /> 해외 주식 (양도세)
                            </h3>
                            <ul className="list-disc list-inside text-gray-500 space-y-1">
                                <li>수익이 발생했을 때만 납부합니다.</li>
                                <li>연간 합산 수익 250만 원까지 공제</li>
                                <li>공제액 초과 수익에 대해 22% 부과</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
