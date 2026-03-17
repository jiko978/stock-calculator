import Link from "next/link";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../utils/seo";

export default function Home() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.STOCK_HOME
    ]);

    return (
        <main className="bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-items-start">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <div className="flex-grow px-4 py-12">
                <h1 className="text-4xl md:text-4xl font-bold mb-10 text-center text-gray-800 dark:text-gray-100">📈 주식 계산기</h1>
                <p className="text-2xl md:text-2xl font-bold mb-10 text-center text-gray-800 dark:text-gray-100">필요한 계산기를 선택하세요.</p>

                <div className="grid gap-6 w-full max-w-3xl mx-auto md:grid-cols-2">
                    <Link href="/calculator/stock/avg-price"
                        className="bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center text-lg font-semibold">
                        💧🔥 평균 단가
                    </Link>
                    <Link href="/calculator/stock/profit-rate"
                        className="bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center text-lg font-semibold">
                        💰 수익률
                    </Link>
                    <Link href="/calculator/stock/dividend"
                        className="bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center text-lg font-semibold sm:col-span-2 md:col-span-1">
                        💸 배당금
                    </Link>
                    <Link href="/calculator/stock/fee"
                        className="bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center text-lg font-semibold sm:col-span-2 md:col-span-1">
                        💳️ 수수료
                    </Link>
                </div>

                <NavBar title="주식 계산기" description="주식 평균단가, 수익률, 배당금, 수수료, 세금 등 필수 계산기 모음" position="static" />
            </div>
        </main>
    );
}