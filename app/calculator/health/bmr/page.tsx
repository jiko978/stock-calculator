// app/calculator/health/bmr/page.tsx
import type { Metadata } from "next";
import Bmr from "./Bmr";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import HealthMoreCalculators from "@/app/calculator/components/HealthMoreCalculators";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "기초대사량(BMR) 계산기 | 나의 기초대사량과 소모 칼로리 계산 - JIKO 계산기",
    description: "생명 유지에 필요한 최소한의 에너지, 기초대사량(BMR)을 계산하여 하루 권장 칼로리를 알아보세요.",
    keywords: ["기초대사량 계산기", "BMR 계산기", "다이어트", "기초대사량", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/health/bmr` },
    openGraph: {
        title: "기초대사량(BMR) 계산기 | 나의 하루 숨만 쉬어도 소모되는 칼로리",
        description: "나는 아무것도 안 해도 하루에 몇 칼로리를 소모할까요? 기초대사량을 계산해보세요.",
        url: `${BASE_URL}/calculator/health/bmr`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "기초대사량 계산기" }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "기초대사량(BMR) 계산기",
    description: "나의 성별, 나이, 키, 체중을 입력하여 하루 기초대사량을 계산합니다.",
    url: `${BASE_URL}/calculator/health/bmr`,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "기초대사량(BMR)이 무엇인가요?",
            acceptedAnswer: { "@type": "Answer", text: "숨을 쉬거나 심장이 뛰는 등 생명 활동을 유지하기 위해 최소한으로 필요한 에너지를 기초대사량이라고 합니다." }
        },
        {
            "@type": "Question",
            name: "기초대사량을 알면 왜 좋은가요?",
            acceptedAnswer: { "@type": "Answer", text: "다이어트 시 본인의 기초대사량을 알면 기준이 되는 최저 칼로리 섭취량을 알 수 있어 요요현상을 방지하고 체중 관리에 도움이 됩니다." }
        }
    ]
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.HEALTH_HOME,
        COMMON_BREADCRUMBS.BMR
    ]);

    const faqList = [
        { question: "기초대사량(BMR)이 무엇인가요?", answer: "기초대사량은 우리 몸이 휴식 상태에서도 체온 유지, 심장 박동 등 생명 유지를 위해 소모하는 최소한의 에너지(kcal)입니다. 아무것도 안 해도 기본적으로 빠지는 칼로리를 뜻합니다." },
        { question: "어떤 공식을 쓰나요?", answer: "본 계산기는 현대인에게 가장 정확도가 높다고 알려진 미플린-세인트 주어(Mifflin-St Jeor) 공식을 사용하여 계산됩니다." }
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

            <NavBar title="기초대사량(BMR) 계산기" description="하루 필수 에너지 소모량 파악" position="top" />
            <Bmr />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🔥</span> 기초대사량(BMR) 계산기
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        다이어트의 핵심은 자신의 기초대사량을 아는 것부터 시작됩니다. 굶기만 하는 다이어트는 근손실을 가져오고 결국 기초대사량을 낮춰 요요현상의 원인이 됩니다.
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
                            <li>[계산하기] 버튼을 눌러 하루 필수 소모 칼로리를 확인하세요.</li>
                        </ul>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <HealthMoreCalculators />
            </main>
        </div>
    );
}
