// ─────────────────────────────────────────────────────────
// app/calculator/stock/profit-rate/page.tsx
// ─────────────────────────────────────────────────────────

import type { Metadata } from "next";
import ProfitRatePage from "./ProfitRate";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../utils/seo";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
  title: "주식 수익률 계산기",
  description: "매수가, 현재가, 수량을 입력하면 수익금과 수익률을 자동으로 계산해드립니다.",
  keywords: ["주식 수익률 계산기", "주식 수익률", "수익금 계산", "투자 수익률"],
  alternates: { canonical: `${BASE_URL}/calculator/stock/profit-rate` },
  openGraph: {
    title: "주식 수익률 계산기",
    description: "매수가, 현재가, 수량을 입력하면 수익금과 수익률을 자동으로 계산해드립니다.",
    url: `${BASE_URL}/calculator/stock/profit-rate`,
    images: [
      {
        url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`,
        width: 1200,
        height: 630,
        alt: "주식 수익률 계산기",
      },
    ],
  },
  twitter: {
    title: "주식 수익률 계산기",
    description: "매수가, 현재가, 수량을 입력하면 수익금과 수익률을 자동으로 계산해드립니다.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "주식 수익률 계산기",
  description: "매수가, 현재가, 수량을 입력하면 수익금과 수익률을 자동으로 계산해드립니다.",
  url: `${BASE_URL}/calculator/stock/profit-rate`,
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
      name: "주식 수익률은 어떻게 계산하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "수익률은 (현재가 - 매수가) ÷ 매수가 × 100 공식으로 계산할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "수익금은 어떻게 계산하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "수익금은 (현재가 - 매수가) × 보유 수량으로 계산됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "주식 수익률 계산기에 어떤 값을 입력해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "매수가, 현재가, 보유 수량을 입력하면 자동으로 수익금과 수익률이 계산됩니다.",
      },
    },
  ],
};

const schema = {
  "@context": "https://schema.org",
  "name": "주식 수익률 계산기",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "url": `${BASE_URL}/calculator/stock/profit-rate`,
  "description": "매수가, 현재가, 수량을 입력하면 수익금과 수익률을 자동으로 계산해드립니다."
};

export default function Page() {
  const breadcrumbLd = generateBreadcrumbJsonLd([
    COMMON_BREADCRUMBS.HOME,
    COMMON_BREADCRUMBS.CALC_HOME,
    COMMON_BREADCRUMBS.STOCK_HOME,
    COMMON_BREADCRUMBS.PROFIT_RATE
  ]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
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
      <ProfitRatePage />

      {/* SEO 및 정보 영역 (계산기 하단에 자연스럽게 배치) */}
      <main className="max-w-2xl mx-auto px-4 pb-16 space-y-6">

        {/* H1 및 소개문 (검색엔진 최적화 및 사용자 안내) */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-2">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <span className="text-2xl">💰</span> 주식 수익률 계산기
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
            매수가, 현재가, 보유 수량을 입력하면 주식 투자 수익금과 수익률을
            자동으로 상세하게 계산할 수 있는 계산기입니다. 손쉬운 모의계산으로 투자 성과를 빠르고 직관적으로 확인해보세요.
          </p>
        </section>

        {/* 사용 방법 및 예시 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-blue-500">💡</span> 사용 방법
            </h2>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>보유 중인 주식의 <strong>매수가</strong>와 <strong>보유 수량</strong>을 입력합니다.</li>
              <li>최근가 또는 목표가인 <strong>현재가</strong>를 입력합니다.</li>
              <li><strong>'계산하기'</strong> 버튼을 클릭하여 즉각적인 수익금과 수익률 결과를 확인하세요.</li>
              <li>결과 비교 막대 그래프로 투자 비중을 한눈에 파악할 수 있습니다.</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-green-500">📊</span> 계산 예시
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-2">
              <p>매수가: <strong>10,000원</strong></p>
              <p>현재가: <strong>12,000원</strong></p>
              <p className="border-b border-gray-200 dark:border-gray-600 pb-2 mb-2">보유 수량: <strong>100주</strong></p>
              <p className="text-red-500 dark:text-red-400 font-bold">수익률 결과: 20%</p>
              <p className="text-red-500 dark:text-red-400 font-semibold">총 수익금: 200,000원</p>
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
                Q. 주식 수익률은 어떤 공식으로 계산되나요?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-purple-300 dark:border-purple-600">
                A. <strong>(현재가 - 매수가) ÷ 매수가 × 100</strong> 공식을 사용하여 정확한 퍼센티지(%) 수익률을 제공해 드립니다.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">
                Q. 여기서 계산한 수익금은 실제 계좌와 똑같나요?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-purple-300 dark:border-purple-600">
                A. 본 계산기는 수수료 및 제세금(거래세)을 제외한 <strong>단순 가격 차등 기반</strong>의 수익금입니다. 실제 증권사 결제 대금과는 수수료율에 따라 미세한 차이가 발생할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}