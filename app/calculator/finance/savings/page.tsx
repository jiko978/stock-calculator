import { Metadata } from "next";
import Savings from "./Savings";
import NavBar from "@/app/calculator/components/NavBar";
import FAQ from "@/app/calculator/components/FAQ";
import FinanceMoreCalculators from "@/app/calculator/components/FinanceMoreCalculators";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";

export const metadata: Metadata = {
    title: "적금 계산기 | 정기적금 만기 수령액 및 이자 계산 - JIKO calculator",
    description: "매월 일정액을 저축하는 정기적금의 만기 수령액을 정확하게 계산하세요. 단리/복리와 과세 유형에 따른 세후 이자 확인이 가능합니다.",
    keywords: ["적금 계산기", "정기적금 계산", "만기 수령액", "적금 이자", "목돈 마련", "금융 계산기"],
    openGraph: {
        title: "적금 계산기 | 목돈 마련을 위한 정확한 가이드",
        description: "매월 쌓이는 목돈의 가치를 확인해보세요.",
        type: "website",
    }
};

const faqList = [
    {
        question: "적금 이자가 예금보다 적게 느껴지는 이유는 무엇인가요?",
        answer: "예금은 전체 원금을 처음부터 끝까지 예치하지만, 적금은 매월 납입할 때마다 해당 금액이 남아있는 기간만큼만 이자가 붙기 때문입니다. 예를 들어 1년 적금의 마지막 달 납입액은 단 1개월치 이자만 발생합니다."
    },
    {
        question: "단리와 월복리 중 무엇을 선택해야 할까요?",
        answer: "적금 상품의 약관에 따라 다릅니다. 대부분의 시중 은행 적금은 단리를 적용하지만, 일부 복리 적금 상품의 경우 월복리를 선택하여 계산하시면 더 정확한 결과를 얻을 수 있습니다."
    },
    {
        question: "세금우대 혜택은 누구나 받을 수 있나요?",
        answer: "세금우대(보통 저율과세)는 만 65세 이상 고령자나 장애인 등을 대상으로 하는 비과세 종합저축 또는 특정 협동조합 상품 등 조건에 부합해야 받을 수 있습니다."
    }
];

export default function SavingsPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        { name: "금융 계산기", item: "https://jiko.kr/calculator/finance" },
        { name: "적금 계산기", item: "https://jiko.kr/calculator/finance/savings" }
    ]);

    const softwareLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "JIKO 적금 계산기",
        "operatingSystem": "Any",
        "applicationCategory": "FinanceApplication",
        "offers": { "@type": "Offer", "price": "0" }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }} />

            <NavBar title="적금 계산기" description="꾸준한 저축으로 만들어가는 미래의 자산을 계산합니다." />

            <Savings />

            <div className="max-w-3xl mx-auto px-4 pb-16 space-y-4 pt-0">
                {/* 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">💰</span> 적금 계산기
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        매월 일정액을 납입하는 정기적금의 만기 수령액을 계산합니다. 적금은 납입 시점마다 남은 기간에 따라 이자가 다르게 적용되므로, 본 계산기로 정확한 세후 금액을 미리 파악하세요.
                    </p>
                </section>

                {/* 사용 방법 & 계산 예시 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>매달 저축할 <strong>납입 금액</strong>을 설정합니다.</li>
                            <li>적금 <strong>기간(개월)</strong>과 <strong>연 이자율(%)</strong>을 입력합니다.</li>
                            <li>이자 방식과 <strong>과세 유형</strong>을 선택합니다.</li>
                            <li><strong>계산하기</strong>를 누르면 총 납입액과 만기 수령액을 확인합니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                            <p className="font-semibold text-green-700 dark:text-green-300 mb-2">월 100만원 · 12개월 · 연 5.0% (단리)</p>
                            <p>• 원금 합계: <strong>12,000,000원</strong></p>
                            <p>• 세전 이자: 325,000원</p>
                            <p>• 이자 과세(15.4%): 50,050원</p>
                            <p className="mt-2 font-bold text-green-600 dark:text-green-400">만기 수령액: 12,274,950원</p>
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
