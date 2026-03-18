import { Metadata } from "next";
import { notFound } from "next/navigation";
import Loans from "../Loans";
import NavBar from "@/app/calculator/components/NavBar";
import FAQ from "@/app/calculator/components/FAQ";
import FinanceMoreCalculators from "@/app/calculator/components/FinanceMoreCalculators";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import productsData from "../../data/products.json";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return productsData.loans.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = productsData.loans.find(p => p.slug === slug);
    if (!product) return {};

    return {
        title: `${product.name} 이자 계산기 | 상환 플랜 및 총 이자 확인 - JIKO calculator`,
        description: `${product.name} 상품의 정확한 이자와 월 상환액을 계산해드립니다. 원리금균등, 원금균등 등 다양한 방식별 차이를 지금 확인하세요.`,
        keywords: [product.name, "대출 이자 계산", "상환 플랜", "월 납입액", "금융 계산기"],
    };
}

const faqList = [
    {
        question: "중도상환 시 수수료도 계산할 수 있나요?",
        answer: "본 계산기는 기본적인 상환 스케줄을 제공하며, 은행마다 다른 중도상환 수수료율은 포함되지 않습니다. 대출 실행 시점과 잔여 기간에 따라 달라질 수 있으므로 해당 상품 설명서를 별도로 참고해 주세요."
    },
    {
        question: "변동 금리인 경우 어떻게 입력하나요?",
        answer: "현재 적용받고 있는 금리를 기준으로 계산하시고, 향후 금리 변동이 예상된다면 예상치를 입력하여 상환액 변화를 시뮬레이션해 보실 수 있습니다."
    }
];

export default async function LoanSlugPage({ params }: Props) {
    const { slug } = await params;
    const product = productsData.loans.find(p => p.slug === slug);
    if (!product) notFound();

    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        { name: "금융 계산기", item: "https://jiko.kr/calculator/finance" },
        { name: "대출 계산기", item: "https://jiko.kr/calculator/finance/loans" },
        { name: product.name, item: `https://jiko.kr/calculator/finance/loans/${product.slug}` }
    ]);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            <NavBar title={product.name} description="대출 상품 조건에 최적화된 상환 분석" />

            <Loans productName={product.name} />

            <div className="max-w-3xl mx-auto px-4 pb-16 space-y-4 pt-2">
                {/* 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">📊</span> {product.name} 대출 계산기
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        <strong>{product.name}</strong> 대출 이용 시 발생하는 월 상환액과 총 이자 비용을 미리 확인해보세요.
                        상환 방식에 따라 가계 지출에 미치는 영향이 달라지므로, 본 계산기를 통해 본인에게 가장 유리한 상환 플랜을 설계하실 수 있습니다.
                    </p>
                </section>

                {/* 사용 방법 & 계산 예시 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>대출 <strong>금액</strong>을 단위 버튼으로 편리하게 입력합니다.</li>
                            <li>대출 <strong>기간(개월)</strong>과 <strong>연 이자율(%)</strong>을 설정합니다.</li>
                            <li>원하는 <strong>상환 방식</strong>과 <strong>거치 기간</strong>을 선택합니다.</li>
                            <li><strong>계산하기</strong>를 누르면 월 납입액 및 총 상환액을 확인합니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-amber-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
                            <p className="font-semibold text-amber-700 dark:text-amber-300 mb-2">1억원 · 30년 · 연 4.0% (원리금균등)</p>
                            <p>• 매월 납입액: <strong>477,415원</strong></p>
                            <p>• 총 대출 이자: 71,869,400원</p>
                            <p className="mt-2 font-bold text-amber-600 dark:text-amber-400">총 상환 금액: 171,869,400원</p>
                        </div>
                    </section>
                </div>

                {/* FAQ */}
                <FAQ faqList={faqList} />

                {/* 계산기 더 보기 */}
                <FinanceMoreCalculators />
            </div>
        </main>
    );
}
