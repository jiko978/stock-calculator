import type { Metadata } from "next";
import Dividend from "./Dividend";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../utils/seo";
import StockMoreCalculators from "@/app/calculator/components/StockMoreCalculators";
import FAQ from "@/app/calculator/components/FAQ";
import highDividendData from "../data/high-dividend.json";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "주식 배당금 계산기 | 배당 수익률, 수익금 목표 달성 계산기 - JIKO 계산기",
    description: "주식 배당금과 배당 수익률을 정확하게 계산해 보세요. 내가 받은 배당금이 생활비로 얼마나 충당되는지, 목표 배당금을 위해 얼마가 더 필요한지 한눈에 보여드립니다.",
    keywords: ["주식 배당금 계산기", "배당 수익률 계산", "배당금 세금 계산", "목표 배당금", "배당금 시뮬레이션", "주식 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/stock/dividend` },
    openGraph: {
        title: "주식 배당금 계산기 | 배당 수익률, 수익금 목표 달성 계산기 - JIKO 계산기",
        description: "나의 주식 배당금, 생활비로 환산하면 얼마일까?",
        url: `${BASE_URL}/calculator/stock/dividend`,
        images: [
            {
                url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`,
                width: 1200,
                height: 630,
                alt: "주식 배당금 계산기",
            },
        ],
    },
    twitter: {
        title: "주식 배당금 계산기 | 배당 수익률, 수익금 목표 달성 계산기 - JIKO 계산기",
        description:
            "주식 배당금과 배당 수익률을 정확하게 계산해 보세요. 내가 받은 배당금이 생활비로 얼마나 충당되는지, 목표 배당금을 위해 얼마가 더 필요한지 한눈에 보여드립니다.",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "주식 배당금 계산기",
    description: "주식 배당금과 배당 수익률을 정확하게 계산해 보세요. 내가 받은 배당금이 생활비로 얼마나 충당되는지, 목표 배당금을 위해 얼마가 더 필요한지 한눈에 보여드립니다.",
    url: `${BASE_URL}/calculator/stock/dividend`,
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
            name: "주식 배당 수익률은 어떻게 계산하나요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "배당 수익률은 (주당 배당금 ÷ 현재 주가) × 100 공식으로 계산됩니다.",
            },
        },
        {
            "@type": "Question",
            name: "배당소득세는 얼마인가요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "국내 주식의 경우 일반적인 배당소득세율은 15.4%(소득세 14% + 지방소득세 1.4%)입니다.",
            },
        },
    ],
};

const schema = {
    "@context": "https://schema.org",
    "name": "주식 배당금 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/stock/dividend`,
    "description": "주식 배당금과 배당 수익률을 정확하게 계산해 보세요."
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.STOCK_HOME,
        COMMON_BREADCRUMBS.DIVIDEND
    ]);

    const faqList = [
        {
            question: "주식 배당 수익률은 어떻게 계산하나요?",
            answer: "배당 수익률은 (주당 배당금 ÷ 현재 주가) × 100 공식으로 계산됩니다."
        },
        {
            question: "배당소득세는 얼마인가요?",
            answer: "국내 주식의 경우 일반적인 배당소득세율은 15.4%(소득세 14% + 지방소득세 1.4%)입니다."
        }
    ];

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

            <NavBar title="주식 배당금 계산기" description="주식 배당금과 배당 수익률을 정확하게 계산해 보세요." position="top" />

            <Dividend />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-8">

                {/* [공통 카드세션] 1. 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">💰</span> 주식 배당금 계산기
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        내가 보유한 주식의 배당금과 배당 수익률을 정확하게 시뮬레이션 해볼 수 있는 계산기입니다. 
                        단순한 수익 계산을 넘어, 배당금이 나의 월 생활비에 얼마나 기여하는지, 목표 배당을 위해 얼마나 더 투자해야 하는지 직관적으로 보여드립니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* [공통 카드세션] 2. 사용 방법 */}
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li><strong>매수가</strong>와 <strong>현재가</strong>, 그리고 보유 중인 <strong>수량</strong>을 입력합니다.</li>
                            <li>기업이 공시한 <strong>주당 배당금</strong>과 <strong>배당 주기</strong>를 선택하세요.</li>
                            <li>원하는 <strong>목표 월 배당금</strong>을 입력하면 목표 달성률을 확인할 수 있습니다.</li>
                            <li>'계산하기'를 누르면 세후 실수령액과 추가 필요 수량이 즉시 계산됩니다.</li>
                        </ul>
                    </section>

                    {/* [공통 카드세션] 3. 계산 예시 */}
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-1">
                            <p>매수가 : <strong>50,000원</strong> / 주당 배당금 : <strong>2,500원</strong></p>
                            <p>보유 수량 : <strong>100주</strong> (연 배당금 25만원)</p>
                            <p className="border-t border-gray-200 dark:border-gray-600 pt-1 mt-1 text-red-500 font-bold">
                                세후 실수령액 : 약 211,500원
                            </p>
                            <p className="text-blue-600 font-semibold">나의 배당 수익률 : 5.0%</p>
                        </div>
                    </section>
                </div>

                {/* [공통 카드세션] 4. FAQ */}
                <FAQ faqList={faqList} />

                {/* [개별 카드세션] 1. 투자 가이드 섹션 */}
                <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                        💰 제 2의 월급 지도 : 한국 주식 배당 투자 가이드
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-xs">
                        안정적인 현금 흐름을 만드는 배당 투자는 단순히 수익률만 보는 것이 아니라, 
                        **기업의 이익 체력**과 **배당 지속성**을 확인하는 것이 핵심입니다. 
                        특히 한국 시장에서는 낮은 PBR과 높은 배당 수익률을 가진 종목들이 '밸류업'의 중심에 있습니다.
                    </p>

                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">✅ 필수 체크리스트</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 text-xs">
                        <li><strong>배당성향(Payout Ratio)</strong> : 벌어들인 돈 대비 배당금을 과하지 않게 주는지 확인하세요.</li>
                        <li><strong>PBR(주가순자산비율)</strong> : 자산 가치 대비 저평가된 기업일수록 향후 주가 상승과 배당 확대를 기대할 수 있습니다.</li>
                        <li><strong>배당락 관리</strong> : 배당을 받기 위해선 배당기준일 2거래일 전까지 매수해야 함을 잊지 마세요.</li>
                    </ul>
                </section>

                {/* [개별 카드세션] 2. 산업별 고배당주 섹션 */}
                <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            🏦 한국 KOSPI 산업별 고배당주
                        </h2>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">업데이트 : 2026.03.18</span>
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
                                        <div key={stock.code} className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-700 group hover:border-green-400 transition-colors">
                                            <div className="flex justify-between items-start gap-x-4">
                                                {/* 좌측 */}
                                                <div>
                                                    <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-green-600 transition-colors">
                                                        {stock.name}
                                                    </p>
                                                    <p className="text-[12px] text-red-400 mt-0.5">
                                                        {stock.desc}
                                                    </p>
                                                </div>

                                                {/* 우측 */}
                                                <div className="text-right text-[12px] text-gray-400 space-y-0.5 shrink-0">
                                                    <p className="text-green-600 dark:text-green-400 font-extrabold text-sm mb-1">
                                                        {stock.dividend}
                                                    </p>
                                                    <p>주당 배당금 : {stock.dps}</p>
                                                    <p>배당 주기 : {stock.freq}</p>
                                                    <p>배당 성향 : {stock.payout}</p>
                                                    <p>안정성 : {stock.stability}</p>
                                                </div>
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

                {/* 주식 계산기 더 보기 */}
                <StockMoreCalculators />
            </main>
        </div>
    );
}
