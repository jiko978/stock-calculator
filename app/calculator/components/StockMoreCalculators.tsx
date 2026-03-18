"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const CALCULATORS = [
    { name: "평균 단가 계산기", href: "/calculator/stock/avg-price", emoji: "📈", description: "물타기·불타기 평단가 계산" },
    { name: "수익률 계산기", href: "/calculator/stock/profit-rate", emoji: "💰", description: "매수·매도가 기반 수익률 확인" },
    { name: "배당금 계산기", href: "/calculator/stock/dividend", emoji: "💸", description: "주식 배당수익률 및 실수령액" },
    { name: "수수료 계산기", href: "/calculator/stock/fee", emoji: "📊", description: "거래 수수료·세금 반영 순이익" },
];

export default function StockMoreCalculators() {
    const pathname = usePathname();
    const otherCalculators = CALCULATORS.filter(calc => !pathname.includes(calc.href));

    return (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                📂 주식 계산기 더 보기
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {otherCalculators.map((calc) => (
                    <Link
                        key={calc.href}
                        href={calc.href}
                        className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform shrink-0">{calc.emoji}</span>
                        <div>
                            <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">
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
}
