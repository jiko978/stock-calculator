import { Metadata } from "next";
import Loans from "./Loans";
import NavBar from "@/app/calculator/components/NavBar";
import FAQ from "@/app/calculator/components/FAQ";
import FinanceMoreCalculators from "@/app/calculator/components/FinanceMoreCalculators";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";

export const metadata: Metadata = {
    title: "대출 이자 계산기 | 원리금균등 및 원금균등 상환 계산기 - JIKO 계산기",
    description: "대출 금액, 이자율, 상환 방식을 선택하여 월 상환액과 총 대출 이자를 정확하게 계산하세요. 거치 기간 설정을 지원합니다.",
    keywords: ["대출이자 계산기", "원리금균등상환", "원금균등상환", "만기일시상환", "대출금리", "금융 계산기"],
    openGraph: {
        title: "대출 이자 계산기 | 원리금균등 및 원금균등 상환 계산기 - JIKO 계산기",
        description: "다양한 상환 방식별 이자 차이를 한눈에 비교해보세요.",
        type: "website",
    }
};

const faqList = [
    {
        question: "원리금균등과 원금균등 상환 중 무엇이 유리한가요?",
        answer: "지출 관리 측면에서는 매월 동일한 금액을 내는 '원리금균등'이 유리하지만, 전체 대출 이자를 줄이는 측면에서는 초기에 원금을 더 많이 갚는 '원금균등' 방식이 총 이자 비용이 적게 듭니다."
    },
    {
        question: "거치 기간이란 무엇인가요?",
        answer: "대출 원금은 갚지 않고 일정 기간 동안 이자만 납부하는 기간을 말합니다. 초기 부담은 적지만, 거치 기간이 길어질수록 나중에 갚아야 할 원금에 대한 이자 총액은 늘어나게 됩니다."
    },
    {
        question: "계산 결과가 실제 은행 고지서와 다를 수 있나요?",
        answer: "대부분의 경우 일치하지만, 은행마다 월 이자 계산 시 일수 계산 방식(365일 vs 366일 등)이나 단수 처리 방식에 따라 몇 원 정도의 오차가 발생할 수 있습니다."
    }
];

export default function LoansPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.FINANCE_HOME,
        COMMON_BREADCRUMBS.LOANS
    ]);

    const softwareLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "대출 이자 계산기",
        "operatingSystem": "Any",
        "applicationCategory": "FinanceApplication",
        "offers": { "@type": "Offer", "price": "0" }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }} />

            <NavBar title="대출 이자 계산기" description="대출 금액, 이자율, 상환 방식을 선택하여 월 상환액과 총 대출 이자를 정확하게 계산하세요. 거치 기간 설정을 지원합니다." />

            <Loans />

            <div className="max-w-3xl mx-auto px-4 pb-16 space-y-4 pt-0">
                {/* 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">📊</span> 대출 이자 계산기
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        주택담보대출·신용대출 등 다양한 대출 상품의 월 상환액과 총 이자를 계산합니다. 원리금균등·원금균등·만기일시 상환 방식과 거치 기간 설정을 지원하여 최적의 상환 플랜을 설계할 수 있습니다.
                    </p>
                </section>

                {/* 사용 방법 & 계산 예시 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>대출 <strong>금액</strong>을 단위 버튼으로 편리하게 입력합니다.</li>
                            <li>대출 <strong>기간(개월)</strong>과 <strong>연 이자율(%)</strong>을 설정합니다.</li>
                            <li>원하는 <strong>상환 방식</strong>과 <strong>거치 기간</strong>을 선택합니다.</li>
                            <li><strong>계산하기</strong>를 누르면 월 납입액 및 총 상환액을 확인합니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-amber-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
                            <p className="font-semibold text-amber-700 dark:text-amber-300 mb-2">1억원 · 30년 · 연 4.0% (원리금균등)</p>
                            <p>• 매월 납입액 : <strong>477,415원</strong></p>
                            <p>• 총 대출 이자 : 71,869,400원</p>
                            <p className="mt-2 font-bold text-amber-600 dark:text-amber-400">총 상환 금액 : 171,869,400원</p>
                        </div>
                    </section>
                </div>

                {/* 상환 방식 비교 */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        ⚖️ 상환 방식 비교
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl space-y-1">
                            <p className="font-bold text-amber-600">원리금균등</p>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">매월 같은 금액을 냅니다. 지출 계획 세우기에 가장 편리합니다.</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl space-y-1">
                            <p className="font-bold text-amber-600">원금균등</p>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">매월 원금을 똑같이 갚습니다. 전체 이자가 가장 적습니다.</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl space-y-1">
                            <p className="font-bold text-amber-600">만기일시</p>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">중간엔 이자만 내고, 마지막에 원금을 전액 상환합니다.</p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <FAQ faqList={faqList} />

                {/* 계산기 더 보기 */}
                <FinanceMoreCalculators />
            </div>
        </main>
    );
}
