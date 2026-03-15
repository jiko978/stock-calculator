import type { Metadata, ResolvingMetadata } from "next";
import AvgPrice from "../AvgPrice";
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
        title: `${stockName} 평균단가 계산기 | 물타기 평단 계산 - JIKO`,
        description: `${stockName}의 평균 단가와 수익률을 계산해보세요. 주식 물타기/불타기 필수 도구.`,
        keywords: [stockName, "평균단가", "물타기", "주식 계산기", `${stockName} 평단가`, `${stockName} 계산기`].filter(Boolean),
        alternates: { canonical: `${BASE_URL}/calculator/stock/avg-price/${slug}` },
        openGraph: {
            title: `${stockName} 평균단가 계산기`,
            description: `${stockName} 평균 단 가 및 수익률 시뮬레이션`,
            url: `${BASE_URL}/calculator/stock/avg-price/${slug}`,
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
        COMMON_BREADCRUMBS.AVG_PRICE,
        { name: stockName, item: `/calculator/stock/avg-price/${slug}` }
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
             <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
             <AvgPrice stockName={stockName} />

             <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        📈 {stockName} 평균단가 분석 리포트
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                         {stockName}의 물타기 또는 불타기 시점의 
                        정확한 평균 단가를 계산하고 계신가요? 보유 주식 수와 가격을 입력하여 
                        최적의 투자 시점을 분석해 보세요.
                    </p>
                </section>
             </main>
        </div>
    );
}
