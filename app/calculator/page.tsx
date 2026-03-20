import Link from "next/link";
import SiteQR from "./components/SiteQR";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../utils/seo";

const mainCalculators = [
    { title: "📈 주식 계산기", description: "주식 평균단가, 수익률, 배당금, 수수료 계산기", href: "/calculator/stock" },
    { title: "💵 금융 계산기", description: "예금 이자, 적금 이자, 대출 이자 계산기", href: "/calculator/finance" },
    { title: "🏢 부동산 계산기", description: "LTV, DTI, DSR 중도상환수수료 계산기", href: "/calculator/realstate" },
    { title: "🏠 생활 계산기", description: "나이/띠, 디데이/날짜수, 급여 계산기", href: "/calculator/life" },
    { title: "💪 건강 계산기", description: "칼로리, 체지방률, 기초대사량, BMI, BMR 계산기", href: "/calculator/health" },
    { title: "🧾 세금 계산기", description: "부가세, 양도세, 자동차세, 종소세 계산기", href: "/calculator/tax" }
];

export default function Home() {
  const breadcrumbLd = generateBreadcrumbJsonLd([
    COMMON_BREADCRUMBS.HOME,
    COMMON_BREADCRUMBS.CALC_HOME
  ]);

  return (
    <main className="bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-items-start min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="flex-grow px-4 py-8 w-full">
        <h1 className="text-4xl md:text-4xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">🧮 JIKO 계산기</h1>
        <p className="text-xl font-semibold mb-8 text-center text-gray-500 dark:text-gray-400">필요한 계산기를 선택하세요.</p>
        <div className="grid gap-4 w-full max-w-3xl mx-auto md:grid-cols-2">
            {mainCalculators.map((calc) => (
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
                            바로 지금 계산하기
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
        <div className="mt-12 flex justify-center">
            <SiteQR />
        </div>
      </div>
    </main>
  );
}