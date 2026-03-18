"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const FinanceMoreCalculators = () => {
    const pathname = usePathname();

    const calculators = [
        {
            name: "예금 계산기",
            href: "/calculator/finance/deposits",
            emoji: "🏦",
            description: "만기 수령액 및 이자 계산"
        },
        {
            name: "적금 계산기",
            href: "/calculator/finance/savings",
            emoji: "💰",
            description: "목돈 마련을 위한 적립 계산"
        },
        {
            name: "대출 계산기",
            href: "/calculator/finance/loans",
            emoji: "📊",
            description: "이자 및 원리금 상환 계산"
        }
    ];

    // 현재 페이지는 제외하고 필터링
    const filteredCalculators = calculators.filter(calc => pathname !== calc.href && !pathname.startsWith(`${calc.href}/`));

    return (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-8">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="text-blue-500">➕</span> 금융 계산기 더 보기
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCalculators.map((calc) => (
                    <Link
                        key={calc.href}
                        href={calc.href}
                        className="flex items-center justify-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform">{calc.emoji}</span>
                        <div>
                            <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {calc.name}
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500">
                                {calc.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default FinanceMoreCalculators;
