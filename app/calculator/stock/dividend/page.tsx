import type { Metadata } from "next";
import Dividend from "./Dividend";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../utils/seo";
import highDividendData from "../data/high-dividend.json";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "주식 배당금 계산기 | 배당 수익률 목표 달성 계산 - JIKO",
    description: "주식 배당금과 배당 수익률을 정확하게 계산해 보세요. 내가 받은 배당금이 생활비로 얼마나 충당되는지, 목표 배당금을 위해 얼마가 더 필요한지 한눈에 보여드립니다.",
    keywords: ["주식 배당금 계산기", "배당 수익률 계산", "배당금 세금 계산", "목표 배당금", "배당금 시뮬레이션", "주식 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/stock/dividend` },
    openGraph: {
        title: "주식 배당금 계산기 | JIKO",
        description: "나의 주식 배당금, 생활비로 환산하면 얼마일까?",
        url: `${BASE_URL}/calculator/stock/dividend`,
        images: [`${BASE_URL}/calculator/jiko-calculator-icon2.png`],
    },
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.STOCK_HOME,
        { name: "배당금 계산기", item: "/calculator/stock/dividend" }
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />

            <NavBar title="주식 배당금 계산기 | JIKO" description="배당금과 배당 수익률을 한눈에 확인하세요" position="top" />

            <main className="space-y-4">
                <Dividend />

                <div className="max-w-2xl mx-auto px-4 pb-16 space-y-8">
                    {/* 1. 투자 가이드 섹션 */}
                    <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            💰 제 2의 월급 지도: 한국 주식 배당 투자 가이드
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                            안정적인 현금 흐름을 만드는 배당 투자는 단순히 수익률만 보는 것이 아니라,
                            **기업의 이익 체력**과 **배당 지속성**을 확인하는 것이 핵심입니다.
                            특히 한국 시장에서는 낮은 PBR과 높은 배당 수익률을 가진 종목들이 '밸류업'의 중심에 있습니다.
                        </p>

                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">✅ 필수 체크리스트</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                            <li><strong>배당성향(Payout Ratio)</strong>: 벌어들인 돈 대비 배당금을 과하지 않게 주는지 확인하세요.</li>
                            <li><strong>PBR(주가순자산비율)</strong>: 자산 가치 대비 저평가된 기업일수록 향후 주가 상승과 배당 확대를 기대할 수 있습니다.</li>
                            <li><strong>배당락 관리</strong>: 배당을 받기 위해선 배당기준일 2거래일 전까지 매수해야 함을 잊지 마세요.</li>
                        </ul>
                    </section>

                    {/* 2. 산업별 고배당주 섹션 */}
                    <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                🏦 한국 KOSPI 산업별 고배당주
                            </h2>
                            <span className="text-[11px] text-gray-400 dark:text-gray-500">업데이트 : 2026.03.16</span>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {highDividendData.map((item) => (
                                <div key={item.category} className="space-y-3">
                                    <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 flex items-center gap-2">
                                        <span className="w-1 h-3 bg-green-500 rounded-full" />
                                        {item.category}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {item.stocks.map((stock) => (
                                            <div key={stock.code} className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center group hover:border-green-400 transition-colors">
                                                <div>
                                                    <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-green-600 transition-colors">{stock.name}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">{stock.desc}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-green-600 dark:text-green-400 font-extrabold">{stock.dividend}</p>
                                                    <p className="text-[10px] text-gray-400">{stock.code}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="mt-8 text-xs text-gray-400 dark:text-gray-500 text-center italic">
                            * 위 종목 리스트는 투자 권유가 아니며, 과거 데이터를 바탕으로 한 참고용입니다.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
