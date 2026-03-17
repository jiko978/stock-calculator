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

            <NavBar title="주식 수수료 계산기 | 국내/해외 주식 수수료 및 세금 계산 - JIKO" description="주식 매도 시 발생하는 수수료와 세금을 계산해보세요" position="top" />
            <StockFee />

            <div className="max-w-2xl mx-auto px-4 pb-16 space-y-8">
                {/* 1. 수수료와 세금 투자 지식 섹션 */}
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
                                <li>2026년 기준 코스피/코스닥 공통 0.20%</li>
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

                {/* 2. 최소 익절가 활용법 */}
                <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">💡 최소 익절가는 왜 중요한가요?</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        많은 투자자들이 매수가보다 높은 가격에 팔면 무조건 수익이라고 생각합니다.
                        하지만 **매수 수수료 + 매도 수수료 + 거래세**를 합치면 약 0.2~0.3% 이상의 비용이 발생합니다.
                        JIKO의 '최소 익절가' 안내 기능은 이 모든 비용을 자동으로 역산하여, 여러분의 자산이 실질적으로 늘어나는 정확한 매도 시점을 알려드립니다.
                    </p>
                </section>
            </div>
        </div>
    );
}
