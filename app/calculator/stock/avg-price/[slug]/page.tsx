import type { Metadata, ResolvingMetadata } from "next";
import AvgPrice from "../AvgPrice";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../../utils/seo";

interface Props {
    params: Promise<{ slug: string }>;
}

const BASE_URL = "https://jiko.kr";

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const stockName = decodeURIComponent(slug);

    return {
        title: `${stockName} 평균단가(평단) 계산기 | 물타기 불타기 평단가 - JIKO`,
        description: `${stockName}의 평단가, 물타기, 불타기를 빠르고 정확하게 계산하세요. 코스피/코스닥 종목 완벽 대응.`,
        keywords: [stockName, "평균단가", "평단", "물타기", "불타기", `${stockName} 평단`, `${stockName} 계산기`],
        alternates: { canonical: `${BASE_URL}/calculator/stock/avg-price/${slug}` },
        openGraph: {
            title: `${stockName} 평균단가 계산기`,
            description: `${stockName} 매수 평균 단가 및 물타기 계산기`,
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
                        📈 {stockName} 주식 투자 필수 도구
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        {stockName} 종목의 추가 매수(물타기) 또는 수익 극대화(불타기)를 계획 중이신가요? 
                        본 계산기를 통해 {stockName}의 정확한 평균 단가와 수익률을 미리 시뮬레이션해 보세요.
                    </p>
                </section>
             </main>
        </div>
    );
}
