import type { Metadata, ResolvingMetadata } from "next";
import ProfitRate from "../ProfitRate";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../../utils/seo";

const BASE_URL = "https://jiko.kr";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const stockName = decodeURIComponent(slug);

    return {
        title: `${stockName} 수익률 계산기 | 매수가 현재가 수익 계산 - JIKO`,
        description: `${stockName}의 수익률과 수익금을 빠르고 정확하게 계산하세요. 코스피/코스닥 전 종목 대응.`,
        keywords: [stockName, "수익률", "수익금", "주식 계산기", `${stockName} 수익률`, `${stockName} 계산기`].filter(Boolean),
        alternates: { canonical: `${BASE_URL}/calculator/stock/profit-rate/${slug}` },
        openGraph: {
            title: `${stockName} 수익률 계산기`,
            description: `${stockName} 매수 수익률 및 수익금 계산기`,
            url: `${BASE_URL}/calculator/stock/profit-rate/${slug}`,
            images: [`${BASE_URL}/calculator/jiko-calculator-icon2.png`],
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const stockName = decodeURIComponent(slug);

    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.STOCK_HOME,
        COMMON_BREADCRUMBS.PROFIT_RATE,
        { name: stockName, item: `/calculator/stock/profit-rate/${slug}` }
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
             <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
             <ProfitRate stockName={stockName} />

             <main className="max-w-2xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        💰 {stockName} 수익 현황 리포트
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        현재 {stockName} 종목의 수익금이 궁금하신가요? 매수가와 현재가, 그리고 수량을 입력하여 
                        실시간 {stockName} 투자 현황을 한눈에 확인해 보세요.
                    </p>
                </section>
             </main>
        </div>
    );
}
