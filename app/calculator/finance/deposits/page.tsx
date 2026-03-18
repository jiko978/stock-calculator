import { Metadata } from "next";
import Deposits from "./Deposits";
import NavBar from "@/app/calculator/components/NavBar";
import FAQ from "@/app/calculator/components/FAQ";
import FinanceMoreCalculators from "@/app/calculator/components/FinanceMoreCalculators";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";

export const metadata: Metadata = {
    title: "예금 계산기 | 정기예금 이자 및 만기 수령액 계산 - JIKO calculator",
    description: "정기예금의 원금, 기간, 이율을 입력하여 세전/세후 이자와 만기 수령액을 정확하게 계산하세요. 단리 및 월복리, 과세 유형별 계산을 지원합니다.",
    keywords: ["예금 계산기", "정기예금 이자 계산", "만기 수령액", "예금이율", "복리 예금", "금융 계산기"],
    openGraph: {
        title: "예금 계산기 | 만기 수령액 및 이자 계산",
        description: "정확한 예금 이자 계산으로 목돈 굴리기 계획을 세워보세요.",
        type: "website",
    }
};

const faqList = [
    {
        question: "단리와 월복리의 차이는 무엇인가요?",
        answer: "단리는 원금에 대해서만 이자가 붙는 방식이며, 월복리는 매월 발생한 이자가 원금에 더해져 다음 달 이자를 더 많이 발생시키는 방식입니다. 기간이 길수록 월복리가 유리합니다."
    },
    {
        question: "일반과세, 세금우대, 비과세의 세율은 어떻게 되나요?",
        answer: "일반과세는 이자소득세 14%와 지방소득세 1.4%를 합친 15.4%가 적용됩니다. 세금우대는 보통 9.5%가 적용되며, 비과세는 세금이 전혀 붙지 않는 0%입니다."
    },
    {
        question: "예금 이자 계산 시 실제 수령액과 차이가 날 수 있나요?",
        answer: "본 계산기는 표준적인 금융 공식을 사용하지만, 실제 은행의 이자 계산 방식(일수 계산 등)이나 우대 금리 조건에 따라 몇 원 단위의 오차가 발생할 수 있습니다."
    }
];

export default function DepositsPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        { name: "금융 계산기", item: "https://jiko.kr/calculator/finance" },
        { name: "예금 계산기", item: "https://jiko.kr/calculator/finance/deposits" }
    ]);

    const softwareLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "JIKO 예금 계산기",
        "operatingSystem": "Any",
        "applicationCategory": "FinanceApplication",
        "offers": { "@type": "Offer", "price": "0" }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }} />

            <NavBar title="예금 계산기" description="원금과 이율을 기반으로 미래의 목돈을 확인하세요." />

            <Deposits />

            <div className="max-w-3xl mx-auto px-4 pb-16 space-y-4 pt-0">
                {/* 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🏦</span> 예금 계산기
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        목돈을 한 번에 맡기는 정기예금의 만기 수령액을 계산합니다. 단리·월복리 선택은 물론, 일반과세·세금우대·비과세 등 과세 유형별 세후 실수령액을 확인할 수 있습니다.
                    </p>
                </section>

                {/* 사용 방법 & 계산 예시 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>예치할 <strong>금액</strong>을 단위 버튼으로 편리하게 입력하세요.</li>
                            <li>예금 <strong>기간(개월)</strong>과 <strong>연 이자율(%)</strong>을 입력합니다.</li>
                            <li>이자 방식(단리 / 월복리)과 <strong>과세 유형</strong>을 선택합니다.</li>
                            <li><strong>계산하기</strong>를 누르면 세후 만기 수령액을 확인할 수 있습니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                            <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">1,000만원 · 12개월 · 연 5.0% (단리)</p>
                            <p>• 세전 이자: <strong>500,000원</strong></p>
                            <p>• 이자 과세(15.4%): 77,000원</p>
                            <p className="mt-2 font-bold text-blue-600 dark:text-blue-400">만기 수령액: 10,423,000원</p>
                        </div>
                    </section>
                </div>

                {/* FAQ */}
                <FAQ faqList={faqList} />

                {/* 계산기 더 보기 */}
                <FinanceMoreCalculators />
            </div>
        </main>
    );
}
