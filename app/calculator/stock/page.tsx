import { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../utils/seo";

export const metadata: Metadata = {
    title: "주식 계산기 | 주식 평균단가, 수익률, 배당금, 수수료 계산기 - JIKO 계산기",
    description: "주식 평균 단가, 수익률, 배당금, 수수료 계산까지 투자에 필요한 모든 계산기를 한곳에서 이용하세요.",
    keywords: ["주식 계산기", "주식 평균단가 계산기", "주식 수익률 계산기", "주식 배당금 계산기", "주식 수수료 계산기"],
};

const stockCalculators = [
    {
        title: "💧🔥 주식 평균단가 계산기",
        description: "물타기, 불타기 시 주식 평균 매입 단가를 최대 10회에 걸쳐 간편하게 계산합니다.",
        href: "/calculator/stock/avg-price",
    },
    {
        title: "💰 주식 수익률 계산기",
        description: "매수가와 매도가를 입력해 수익률과 순이익을 한눈에 확인하세요.",
        href: "/calculator/stock/profit-rate",
    },
    {
        title: "💸 주식 배당금 계산기",
        description: "보유 주식수와 배당금을 입력하면 배당수익률 및 실수령액을 계산합니다.",
        href: "/calculator/stock/dividend",
    },
    {
        title: "💳️ 주식 수수료 계산기",
        description: "매매 수수료와 세금을 반영한 실제 거래 비용과 순이익을 계산합니다.",
        href: "/calculator/stock/fee",
    },
];

export default function StockHubPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.STOCK_HOME
    ]);

    return (
        <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            <NavBar title="주식 계산기" description="주식 평균단가, 수익률, 배당금, 수수료 계산기 - JIKO 계산기" />

            <div className="flex-grow px-4 py-6">
                <h1 className="text-4xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">📈 주식 계산기</h1>
                <p className="text-xl font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">필요한 계산기를 선택하세요.</p>

                <div className="grid gap-4 w-full max-w-3xl mx-auto md:grid-cols-2">
                    {stockCalculators.map((calc) => (
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
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5">JIKO 주식 계산기만의 특징</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-xl">📈</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">실전 투자 맞춤 계산</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">물타기·불타기 등 실제 투자 시나리오에 최적화된 계산 방식을 제공합니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center shrink-0 text-xl">💸</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">세금 및 수수료 반영</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">증권거래세와 매매 수수료를 반영한 실제 순이익을 계산해 드립니다.</p>
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
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">입력하신 모든 투자 정보는 서버에 저장되지 않고 브라우저 내에서만 처리됩니다.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </main>
    );
}