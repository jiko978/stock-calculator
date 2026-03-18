import { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";

export const metadata: Metadata = {
    title: "금융 계산기 | 예금, 적금, 대출 이자 계산 모음 - JIKO calculator",
    description: "목돈 마련을 위한 예금/적금 이자 계산부터 대출 상환 계획까지, JIKO의 금융 계산기로 스마트한 자산 관리를 시작해보세요.",
    keywords: ["금융 계산기", "예금 계산기", "적금 계산기", "대출 계산기", "이자 계산", "자산 관리"],
};

const financeCalculators = [
    {
        title: "🏦 예금 계산기",
        description: "목돈을 예치했을 때 만기 시 받을 수 있는 이자와 수령액을 계산합니다.",
        href: "/calculator/finance/deposits",
    },
    {
        title: "💰 적금 계산기",
        description: "매월 일정 금액을 저축하여 목돈을 만들 때의 만기 수령액을 확인하세요.",
        href: "/calculator/finance/savings",
    },
    {
        title: "📊 대출 계산기",
        description: "원리금균등, 원금균등 등 상환 방식에 따른 월 납입액과 총 이자를 분석합니다.",
        href: "/calculator/finance/loans",
    },
];

export default function FinanceHubPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        { name: "금융 계산기", item: "https://jiko.kr/calculator/finance" }
    ]);

    return (
        <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            <NavBar title="금융 계산기" description="정확한 계산으로 세우는 스마트한 금융 계획" />

            <div className="flex-grow px-4 py-6">
                <h1 className="text-4xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">💵 금융 계산기</h1>
                <p className="text-xl font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">필요한 계산기를 선택하세요.</p>

                <div className="grid gap-4 w-full max-w-3xl mx-auto md:grid-cols-2">
                    {financeCalculators.map((calc) => (
                        <Link
                            key={calc.href}
                            href={calc.href}
                            className="group block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="h-full flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {calc.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-grow">
                                    {calc.description}
                                </p>
                                <div className="flex items-center text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                    계산하기
                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <section className="mt-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 blur-2xl"></div>
                    <div className="relative">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5">JIKO 금융 계산기만의 특징</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-xl">🏙️</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">정확한 법정 이율 반영</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">이자소득세(15.4%) 및 세금우대 세율을 정확히 반영하여 실수령액을 보여줍니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center shrink-0 text-xl">📉</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">시각화 차트 제공</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">원금과 이자 비중을 한눈에 파악할 수 있는 다이내믹 차트를 제공합니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0 text-xl">📱</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">모바일 최적화 UX</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">어떤 기기에서도 편리하게 입력하고 결과를 확인할 수 있는 반응형 디자인입니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0 text-xl">🔒</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">개인정보 보호</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">입력하신 모든 금융 정보는 서버에 저장되지 않고 브라우저 내에서만 처리됩니다.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </main>
    );
}
