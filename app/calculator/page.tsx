import Link from "next/link";
import SiteQR from "./components/SiteQR";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../utils/seo";

export default function Home() {
  const breadcrumbLd = generateBreadcrumbJsonLd([
    COMMON_BREADCRUMBS.HOME,
    COMMON_BREADCRUMBS.CALC_HOME
  ]);

  return (
    <main className="bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-items-start">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="flex-grow px-4 py-12">
        <h1 className="text-4xl md:text-4xl font-bold mb-10 text-center text-gray-800 dark:text-gray-100">🧠 JIKO 계산기 🧰 </h1>
        <p className="text-2xl md:text-2xl font-bold mb-10 text-center text-gray-800 dark:text-gray-100">필요한 계산기를 선택하세요.</p>
        <div className="grid gap-6 w-full max-w-3xl mx-auto md:grid-cols-2">
          <Link href="/calculator/stock"
            className="bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center text-lg font-semibold">
            📈 주식
          </Link>
          <Link href="/calculator/finance"
            className="bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center text-lg font-semibold">
            💵 금융
          </Link>
          <Link href="/calculator/realstate"
            className="bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center text-lg font-semibold">
            🏢 부동산
          </Link>
          <Link href="/calculator/life"
            className="bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center text-lg font-semibold">
            🏠 생활
          </Link>
          <Link href="/calculator/health"
            className="bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center text-lg font-semibold">
            💪 건강
          </Link>
          <Link href="/calculator/tax"
            className="bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center text-lg font-semibold">
            🧾 세금
          </Link>
        </div>
        <SiteQR />
      </div>
    </main>
  );
}