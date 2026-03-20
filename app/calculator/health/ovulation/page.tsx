// app/calculator/health/ovulation/page.tsx
import type { Metadata } from "next";
import Ovulation from "./Ovulation";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import HealthMoreCalculators from "@/app/calculator/components/HealthMoreCalculators";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "배란일 계산기 | 나의 가임기, 다음 달 생리 예정일 계산 - JIKO 계산기",
    description: "마지막 생리 시작일과 평균 주기를 통하여 다음 생리 예정일, 임신 가능성이 높은 가임기 및 배란일 캘린더를 간단히 계산해드립니다.",
    keywords: ["배란일 계산기", "생리달력", "임신 가임기", "생리주기 계산", "다음 생리일", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/health/ovulation` },
    openGraph: {
        title: "배란일 및 가임기 계산기",
        description: "마지막 생리 주기 정보를 통해 예측되는 가임기, 생리일을 캘린더로 직관적으로 확인하세요.",
        url: `${BASE_URL}/calculator/health/ovulation`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "배란일 생리주기 계산기" }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "배란일 및 생리주기 계산기",
    description: "생리 시작일과 주기를 통하여 가임기 및 배란 예정일을 산출합니다.",
    url: `${BASE_URL}/calculator/health/ovulation`,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "배란일은 어떻게 계산되나요?",
            acceptedAnswer: { "@type": "Answer", text: "다음 생리 예정일로부터 14일 전을 배란 예정일로 계산합니다." }
        },
        {
            "@type": "Question",
            name: "이 결과만으로 피임을 해도 되나요?",
            acceptedAnswer: { "@type": "Answer", text: "스트레스, 컨디션에 따라 주기는 변동될 수 있습니다. 단순 알고리즘에 기반한 계산기이므로 완벽한 의학적 피임이나 진단을 대체할 수 없습니다. 항상 이중 피임을 권장합니다." }
        }
    ]
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.HEALTH_HOME,
        COMMON_BREADCRUMBS.OVULATION
    ]);

    const faqList = [
        { question: "배란일은 어떤 기준으로 떨어지나요?", answer: "개인의 생리 주기와 무관하게 황체기는 보통 14일로 고정되어 있습니다. 따라서 다음 생리 예정일을 구한 뒤 14일 전으로 역산하는 것이 배란일 계산의 원리입니다." },
        { question: "가임기는 며칠인가요?", answer: "배란 전 정자의 생존기간(약 3~5일)과 배란 후 난자의 생존기간(약 1~2일)을 더하여 넉넉히 배란일 전 5일, 후 2일을 모두 임신 가임기 확률이 높은 안전하지 않은 구간으로 설정합니다." }
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

            <NavBar title="배란일 계산기" description="다음 생리일 및 가임기 주기를 확인하세요" position="top" />
            <Ovulation />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">📅</span> 배란일/생리주기 계산기
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        여성 건강 증진을 도모하고 임신 준비를 위해 자신의 신체 사이클을 달력처럼 날짜별로 직관적으로 파악해볼 수 있는 계산 모델입니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>가장 최근에 했던 생리의 <strong>시작일</strong>을 입력합니다.</li>
                            <li>나의 <strong>평균 생리 주기</strong>(20일~45일)를 입력합니다. (기본 28일)</li>
                            <li>[계산하기] 버튼을 누르면 다음 생리 예정일과 가임기를 안내해 드립니다.</li>
                        </ul>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <HealthMoreCalculators />
            </main>
        </div>
    );
}
