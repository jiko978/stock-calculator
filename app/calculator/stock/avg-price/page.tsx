// ─────────────────────────────────────────────────────────
// app/calculator/stock/avg-price/page.tsx
// ─────────────────────────────────────────────────────────

import type { Metadata } from "next";
import AvgPriceCalculator from "./AvgPrice";
import NavBar from "@/app/calculator/components/NavBar";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "주식 평균 단가 계산기 | 투자 물타기 불타기 평균단가 계산 - JIKO",
    description:
        "주식 물타기, 불타기 시 평균 매입 단가를 최대 10회에 걸쳐 간편하게 계산해드립니다.",
    keywords: ["평단가 계산기", "주식 물타기", "주식 불타기", "평균 매입 단가"],
    alternates: { canonical: `${BASE_URL}/calculator/stock/avg-price` },
    openGraph: {
        title: "주식 평균 단가 계산기 | 투자 물타기 불타기 평균단가 계산 - JIKO",
        description:
            "주식 물타기, 불타기 시 평균 매입 단가를 최대 10회에 걸쳐 간편하게 계산해드립니다.",
        url: `${BASE_URL}/calculator/stock/avg-price`,
        images: [
            {
                url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`,
                width: 1200,
                height: 630,
                alt: "주식 평균 단가 계산기",
            },
        ],
    },
    twitter: {
        title: "주식 평균 단가 계산기 | 투자 물타기 불타기 평균단가 계산 - JIKO",
        description:
            "주식 물타기, 불타기 시 평균 매입 단가를 최대 10회에 걸쳐 간편하게 계산해드립니다.",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "주식 평균 단가 계산기",
    description:
        "주식 물타기, 불타기 시 평균 매입 단가를 최대 10회에 걸쳐 간편하게 계산해드립니다.",
    url: `${BASE_URL}/calculator/stock/avg-price`,
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
            name: "주식 평균 단가는 어떻게 계산하나요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "총 매수 금액을 총 주식 수로 나누면 평균 매입 단가를 계산할 수 있습니다."
            }
        },
        {
            "@type": "Question",
            name: "물타기와 불타기는 무엇인가요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "물타기는 주가 하락 시 추가 매수로 평균 단가를 낮추는 전략이며 불타기는 상승 중 추가 매수를 의미합니다."
            }
        }
    ]
};

const schema = {
    "@context": "https://schema.org",
    "name": "주식 평균 단가 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/stock/avg-price`,
    "description": "주식 물타기, 불타기 시 평균 매입 단가를 최대 10회에 걸쳐 간편하게 계산해드립니다."
};

export default function Page() {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* JSON-LD */}
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

            {/* 계산기 UI */}
            <NavBar title="주식 평균 단가 계산기 | 투자 물타기 불타기 평균단가 계산 - JIKO" description="주식 평균 매입 단가를 간편하게 계산해보세요" position="top" />
            <AvgPriceCalculator />

            {/* SEO 및 정보 영역 (계산기 하단에 자연스럽게 배치) */}
            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">

                {/* H1 및 소개문 (검색엔진 최적화 및 사용자 안내) */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">📈</span> 주식 평균 단가 계산기 (평단가 계산기)
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        주식을 여러 번 나누어 매수했을 때 평균 매입 단가를 계산할 수 있는 계산기입니다.
                        물타기나 불타기를 할 때 현재 보유 주식의 전체 평균 단가를 손쉽게 확인할 수 있습니다.
                    </p>
                </section>

                {/* 사용 방법 및 예시 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>각 회차별 <strong>매수가</strong>와 <strong>수량</strong>을 입력하세요.</li>
                            <li>자동으로 전체 평균 단가가 계산되어 출력됩니다.</li>
                            <li>최대 <strong>10회차</strong>까지 매수 기록 추가가 가능합니다.</li>
                            <li><strong>현재가</strong>를 입력하면 수익률과 수익금을 추가로 계산합니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                            <p>1차: <strong>10,000원</strong>에 <strong>100주</strong> 매수</p>
                            <p className="border-b border-gray-200 dark:border-gray-600 pb-2 mb-2">2차: <strong>12,000원</strong>에 <strong>100주</strong> 매수 (불타기)</p>
                            <p className="text-blue-600 dark:text-blue-400 font-semibold">총 투자금: 2,200,000원</p>
                            <p className="text-red-500 dark:text-red-400 font-bold">최종 평균 단가: 11,000원</p>
                        </div>
                    </section>
                </div>

                {/* FAQ */}
                <section id="faq" className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <span className="text-purple-500">❓</span> 자주 묻는 질문 (FAQ)
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">
                                Q. 주식 평균 단가는 어떻게 계산하나요?
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-purple-300 dark:border-purple-600">
                                A. (총 매수 금액)을 (총 보유 주식 수)로 나누면 정확한 평균 단가가 계산됩니다.
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">
                                Q. 물타기와 불타기는 무엇인가요?
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-purple-300 dark:border-purple-600">
                                A. <strong>물타기</strong>는 주가가 하락했을 때 추가 매수하여 평균 단가를 낮추는 방어적 전략입니다. 반대로 <strong>불타기</strong>는 주가가 상승 중에 추가 매수하여 비중을 늘리는 공격적 전략을 의미합니다.
                            </p>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}