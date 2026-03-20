"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const CALCULATORS = [
    { name: "비만도(BMI) 계산기", href: "/calculator/health/bmi", emoji: "⚖️", description: "체질량지수를 통한 비만도 진단" },
    { name: "기초대사량(BMR) 계산기", href: "/calculator/health/bmr", emoji: "🔥", description: "숨만 쉬어도 소모되는 칼로리" },
    { name: "칼로리 계산기", href: "/calculator/health/calorie", emoji: "🏃‍♂️", description: "활동량에 따른 일일 권장 칼로리" },
    { name: "배란일 계산기", href: "/calculator/health/ovulation", emoji: "📅", description: "가임기 및 배란일 예측" },
    { name: "임신주수 계산기", href: "/calculator/health/pregnancy", emoji: "👶", description: "출산 예정일 및 임신 주수 산정" },
];

export default function HealthMoreCalculators() {
    const pathname = usePathname();
    const otherCalculators = CALCULATORS.filter(calc => !pathname.includes(calc.href));

    return (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                📂 건강 계산기 더 보기
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
