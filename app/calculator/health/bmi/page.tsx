// app/calculator/health/bmi/page.tsx
import type { Metadata } from "next";
import Bmi from "./Bmi";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import HealthMoreCalculators from "@/app/calculator/components/HealthMoreCalculators";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "비만도 계산기 | 나의 체질량지수 및 비만도 측정 - JIKO 계산기",
    description: "키와 체중을 입력하여 나의 체질량지수(BMI)와 비만도를 정확하게 측정해보세요.",
    keywords: ["비만도 계산기", "BMI 계산기", "체질량지수", "다이어트", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/health/bmi` },
    openGraph: {
        title: "비만도 계산기 | 나의 체질량지수 및 비만도 측정 - JIKO 계산기",
        description: "나의 체질량지수(BMI)와 비만도를 쉽게 측정하고 관리하세요.",
        url: `${BASE_URL}/calculator/health/bmi`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "비만도 계산기" }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "비만도 계산기",
    description: "키와 체중을 입력하여 나의 체질량지수(BMI)와 비만도를 정확하게 측정해보세요.",
    url: `${BASE_URL}/calculator/health/bmi`,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "BMI란 무엇인가요?",
            acceptedAnswer: { "@type": "Answer", text: "체질량지수(Body Mass Index)의 약자로, 체중(kg)을 키의 제곱(㎡)으로 나눈 값입니다. 비만도를 판정하는 객관적인 지표로 사용됩니다." }
        },
        {
            "@type": "Question",
            name: "정상 BMI 범위는 어떻게 되나요?",
            acceptedAnswer: { "@type": "Answer", text: "WHO 아시아 태평양 기준에 따르면 18.5 ~ 22.9 가 정상 범위에 속합니다." }
        }
    ]
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.HEALTH_HOME,
        COMMON_BREADCRUMBS.BMI
    ]);

    const faqList = [
        { question: "BMI란 무엇인가요?", answer: "체질량지수(Body Mass Index)의 약자로, 체중(kg)을 키의 제곱(㎡)으로 나눈 값입니다. 비만도를 판정하는 객관적인 기준이 됩니다." },
        { question: "정상 BMI 범위는 어떻게 되나요?", answer: "WHO 아시아 태평양 기준에 따르면 18.5 ~ 22.9 가 정상 범위에 속합니다. 23 이상은 과체중, 25 이상은 비만으로 분류됩니다." }
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

            <NavBar title="비만도 계산기" description="나의 체질량지수 측정" position="top" />
            <Bmi />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">⚖️</span> 비만도(BMI) 계산기
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        나의 키와 체중을 바탕으로 비만도를 간단하게 측정할 수 있습니다. 정상 범위 여부를 확인하고 건강을 관리해보세요.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>성별과 나이를 선택 및 입력합니다.</li>
                            <li>정확한 <strong>키(cm)</strong>와 <strong>체중(kg)</strong>을 입력합니다.</li>
                            <li>[계산하기] 버튼을 누르면 나의 체질량지수(BMI) 및 비만도 결과가 출력됩니다.</li>
                        </ul>
                    </section>
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 아시아 태평양 BMI 기준
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-1">
                            <p>저체중 : <strong>18.5 미만</strong></p>
                            <p>정상 : <strong>18.5 ~ 22.9</strong></p>
                            <p>과체중 : <strong>23.0 ~ 24.9</strong></p>
                            <p>비만 : <strong>25.0 ~ 29.9</strong></p>
                            <p>고도비만 : <strong>30.0 이상</strong></p>
                        </div>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <HealthMoreCalculators />
            </main>
        </div>
    );
}
