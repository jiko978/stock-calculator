import Link from "next/link";
import { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PlatformQR from "./components/PlatformQR";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "./utils/seo";

export const metadata: Metadata = {
    title: "JIKO Platform",
    description: "다양한 계산기와 투자 도구를 제공하는 JIKO Platform 입니다.",
};

type ServiceLink = {
    label: string;
    href: string;
    disabled?: boolean;
};

type Service = {
    title: string;
    href: string;
    bgColor: string;
    borderColor: string;
    links: ServiceLink[];
};

const services: Service[] = [
    {
        title: "📈 주식",
        href: "/calculator/stock",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        borderColor: "border-blue-100 dark:border-blue-800",
        links: [
            { label: "✔ 주식 평균단가 계산기", href: "/calculator/stock/avg-price" },
            { label: "✔ 주식 수익률 계산기", href: "/calculator/stock/profit-rate" },
            { label: "✔ 주식 배당금 계산기", href: "/calculator/stock/dividend" },
            { label: "✔ 주식 수수료 계산기", href: "/calculator/stock/fee" }
        ]
    },
    {
        title: "💵 금융",
        href: "/calculator/finance",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-100 dark:border-green-800",
        links: [
            { label: "✔ 예금 이자 계산기", href: "/calculator/finance/deposits" },
            { label: "✔ 적금 이자 계산기", href: "/calculator/finance/savings" },
            { label: "✔ 대출 이자 계산기", href: "/calculator/finance/loans" }
        ]
    },
    {
        title: "🏢 부동산",
        href: "/calculator/realestate",
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
        borderColor: "border-amber-100 dark:border-amber-800",
        links: [
            { label: "서비스 준비 중", href: "#", disabled: true }
        ]
    },
    {
        title: "🏠 생활",
        href: "/calculator/life",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        borderColor: "border-purple-100 dark:border-purple-800",
        links: [
            { label: "서비스 준비 중", href: "#", disabled: true }
        ]
    },
    {
        title: "💪 건강",
        href: "/calculator/health",
        bgColor: "bg-rose-50 dark:bg-rose-900/20",
        borderColor: "border-rose-100 dark:border-rose-800",
        links: [
            { label: "서비스 준비 중", href: "#", disabled: true }
        ]
    },
    {
        title: "🧾 세금",
        href: "/calculator/tax",
        bgColor: "bg-gray-50 dark:bg-gray-800/50",
        borderColor: "border-gray-200 dark:border-gray-700",
        links: [
            { label: "서비스 준비 중", href: "#", disabled: true }
        ]
    }
];

export default function Home() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME
    ]);

    return (
        <div className="flex flex-col min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <Header />

            <div className="w-full bg-white dark:bg-gray-900 flex-grow py-6 px-6 transition-colors">
                <div className="max-w-5xl mx-auto flex flex-col items-center">
                    
                    {/* 메인 타이틀 영역 */}
                    <div className="text-center mb-14 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                            <Link href="/calculator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                🧮 JIKO 계산기
                            </Link>
                        </h1>
                        <p className="text-sm font-bold md:text-xl text-gray-600 dark:text-gray-300">
                            일상에 필요한 모든 계산기를 한 곳에서 만나보세요.
                        </p>
                    </div>

                    {/* 카드 그리드 영역 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {services.map((service, idx) => (
                            <div 
                                key={idx}
                                className={`flex flex-col rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-200 ${service.bgColor} ${service.borderColor}`}
                            >
                                <h2 className="text-2xl font-bold mb-4 border-b border-black/5 dark:border-white/10 pb-3">
                                    <Link 
                                        href={service.href} 
                                        className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {service.title}
                                    </Link>
                                </h2>
                                
                                <div className="flex flex-col gap-3 flex-grow mt-2">
                                    {service.links.map((link, lIdx) => (
                                        link.disabled ? (
                                            <span key={lIdx} className="text-sm font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed flex items-center gap-2">
                                                ⏳ {link.label}
                                            </span>
                                        ) : (
                                            <Link 
                                                key={lIdx} 
                                                href={link.href}
                                                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center transition"
                                            >
                                                {link.label}
                                            </Link>
                                        )
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 루트 플랫폼 QR 코드 영역 */}
                    <PlatformQR />
                </div>
            </div>

            <Footer />
        </div>
    );
}