// app/calculator/health/calorie/page.tsx
import type { Metadata } from "next";
import Calorie from "./Calorie";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import HealthMoreCalculators from "@/app/calculator/components/HealthMoreCalculators";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "칼로리 계산기 | 하루 권장 섭취 칼로리 및 TDEE 계산 - JIKO 계산기",
    description: "내 몸에 딱 맞는 하루 권장 칼로리를 활동량과 엮어서 계산해드립니다. 다이어트와 건강 관리를 칼로리 계산으로 시작하세요.",
    keywords: ["칼로리 계산기", "TDEE 계산기", "하루 권장 칼로리", "다이어트", "유지 에너지", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/health/calorie` },
    openGraph: {
        title: "칼로리 계산기 | 하루 권장 섭취 칼로리 계산",
        description: "나는 하루에 얼마나 먹어야 할까? 적정 섭취 칼로리 알아보기",
        url: `${BASE_URL}/calculator/health/calorie`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "칼로리 계산기" }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "칼로리 계산기",
    description: "내 몸에 딱 맞는 하루 권장 칼로리와 다이어트 칼로리를 활동량 기준으로 계산해드립니다.",
    url: `${BASE_URL}/calculator/health/calorie`,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "하루 권장 칼로리(TDEE)는 어떻게 계산되나요?",
            acceptedAnswer: { "@type": "Answer", text: "기초대사량에 자신의 평소 활동량에 해당하는 배수를 곱하여 산출됩니다." }
        },
        {
            "@type": "Question",
            name: "다이어트를 하려면 칼로리를 얼마나 줄여야 하나요?",
            acceptedAnswer: { "@type": "Answer", text: "본인의 하루 유지 칼로리를 기준으로 보통 300~500kcal를 덜 섭취해야 건강한 다이어트가 가능합니다." }
        }
    ]
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.HEALTH_HOME,
        COMMON_BREADCRUMBS.CALORIE
    ]);

    const faqList = [
        { question: "권장 칼로리(TDEE)가 중요한 이유가 뭔가요?", answer: "기초대사량이 몸을 가만히 둘 때 쓰는 에너지라면, 유지 칼로리(TDEE)는 걷고, 직장생활하고, 운동하는 모든 활동대사량을 합친 총 소모 에너지입니다. 이보다 덜 먹으면 살이 빠지고, 더 먹으면 살이 찌게 됩니다." },
        { question: "다이어트를 하려면 얼마나 줄여야 하나요?", answer: "하루 권장 에너지에서 300 ~ 500 kcal 정도를 줄이는 것이 몸에 무리가 가지 않으면서 근손실을 최소화하는 정석적인 방법입니다. 너무 급격한 단식은 피해주세요." }
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

            <NavBar title="칼로리 계산기" description="하루 권장 식사 칼로리 및 목적별 섭취량 파악" position="top" />
            <Calorie />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🏃‍♂️</span> 칼로리 계산기
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        기초대사량에 평소 생활 패턴 및 운동 활동량을 반영하여, 내가 하루 종일 섭취해야 할 최적의 칼로리를 산출합니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>성별과 나이, 신체정보를 입력합니다.</li>
                            <li>본인의 **평소 활동량**을 최대한 솔직하게 선택해 주세요.</li>
                            <li>[계산하기] 버튼을 누르면 목표에 따른 식단 조절 플랜 기준점이 나타납니다.</li>
                        </ul>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <HealthMoreCalculators />
            </main>
        </div>
    );
}
