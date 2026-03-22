// app/calculator/health/pregnancy/page.tsx
import type { Metadata } from "next";
import Pregnancy from "./Pregnancy";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import HealthMoreCalculators from "@/app/calculator/components/HealthMoreCalculators";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "임신주수 계산기 | 출산 예정일 및 현재 주수 계산 - JIKO 계산기",
    description: "마지막 생리일, 초음파 기준, 예정일 역산을 통해 현재 임신 N주차인지 알아보고 출산 예정일 D-Day를 확인하세요.",
    keywords: ["임신주수 계산기", "출산 예정일", "배란일", "임신 디데이", "임신주기", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/health/pregnancy` },
    openGraph: {
        title: "임신주수/출산 예정일 계산기",
        description: "우리 아기 만나는 날까지의 D-Day를 따뜻한 진행률 애니메이션과 함께 확인해보세요.",
        url: `${BASE_URL}/calculator/health/pregnancy`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "임신주수 출산예정일 계산기" }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "임신주수/출산 예정일 계산기",
    description: "아기의 280일간의 여정. 생리일 기반, 산부인과 초음파 기반으로 디테일하게 예정일과 주수를 도출합니다.",
    url: `${BASE_URL}/calculator/health/pregnancy`,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "출산 예정일은 어떤 기준으로 계산되나요?",
            acceptedAnswer: { "@type": "Answer", text: "의학적으로 널리 쓰이는 네겔레 공식(마지막 생리 시작일 + 280일)을 바탕으로 역산합니다." }
        },
        {
            "@type": "Question",
            name: "병원(초음파)에서 알려준 주수랑 다를 수 있나요?",
            acceptedAnswer: { "@type": "Answer", text: "태아의 발육 속도나 착상 일자에 따라 자연스럽게 조금씩 차이가 날 수 있습니다. 초음파상 기준을 탭에서 입력하면 초음파 진척도에 맞춰 정확한 디데이를 보정할 수 있습니다." }
        }
    ]
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.HEALTH_HOME,
        COMMON_BREADCRUMBS.PREGNANCY
    ]);

    const faqList = [
        { question: "출산 예정일은 어떤 기준으로 계산되나요?", answer: "마지막 생리 시작일에서 평균 임신 기간인 280일(40주)을 더하여 출산 예정일을 산출하게 됩니다(네겔레 법칙). 단순 달력 기준이므로 실상황과는 ±2주가량 편차가 존재합니다." },
        { question: "병원(초음파) 주수와 다를 수 있나요?", answer: "네, 아기의 크기 등 성장 상황에 따라 의사 선생님이 주수를 새롭게 정정해주기도 합니다. 이 경우 '초음파 주수 기준' 탭에 날짜/주수를 기입하시면 그에 맞춰 정확한 D-Day를 반영해 줍니다." }
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

            <NavBar title="임신주수 계산기" description="출산 디데이 및 우리 아이 N주차 여정" position="top" />
            <Pregnancy />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">👶</span> 임신주수(출산 예정일) 계산기
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        마지막 생리 시작일 또는 산부인과 초음파 기준일을 바탕으로 아기를 만나는 출산 예정일까지 얼마나 남았는지 D-DAY와 임신 주수(주/일차)를 계산하여 진행률 바를 통해 시각적으로 보여줍니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>총 3가지 탭(마지막 생리, 초음파, 예정일 기준)으로 내 상황에 맞게 입력기를 고릅니다.</li>
                            <li>날짜 또는 주수를 입력 후 [계산하기]를 클릭합니다.</li>
                            <li>퍼센트로 나타나는 귀여운 프로그레스 바를 통해 얼마나 아이가 크고 있는지 확인해보세요.</li>
                        </ul>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <HealthMoreCalculators />
            </main>
        </div>
    );
}
