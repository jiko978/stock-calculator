import { Metadata } from "next";
import { notFound } from "next/navigation";
import Deposits from "../Deposits";
import NavBar from "@/app/calculator/components/NavBar";
import FAQ from "@/app/calculator/components/FAQ";
import FinanceMoreCalculators from "@/app/calculator/components/FinanceMoreCalculators";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import productsData from "../../data/products.json";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return productsData.deposits.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = productsData.deposits.find(p => p.slug === slug);
    if (!product) return {};

    return {
        title: `${product.name} 예금 이자 계산기 | 만기 수령액 확인 - JIKO calculator`,
        description: `${product.name} 상품의 예상 이자와 만기 수령액을 지금 바로 계산해보세요. 단리, 복리 및 세금 우대 혜택을 반영한 정확한 결과값을 제공합니다.`,
        keywords: [product.name, "예금 계산기", "이자 계산", "만기 수령액", "금융 계산기"],
    };
}

const faqList = [
    {
        question: "예금 이자 계산 시 실제 수령액과 차이가 날 수 있나요?",
        answer: "본 계산기는 표준적인 금융 공식을 사용하지만, 실제 은행의 이자 계산 방식(일수 계산 등)이나 우대 금리 조건에 따라 몇 원 단위의 오차가 발생할 수 있습니다."
    },
    {
        question: "과세 유형은 어떤 것을 선택해야 하나요?",
        answer: "가입하신 상품이 비과세 종합저축이거나 세금우대 혜택이 있는 상품이라면 해당 옵션을 선택하시고, 일반적인 예금 상품이라면 일반과세(15.4%)를 선택하시면 됩니다."
    }
];

export default async function DepositSlugPage({ params }: Props) {
    const { slug } = await params;
    const product = productsData.deposits.find(p => p.slug === slug);
    if (!product) notFound();

    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        { name: "금융 계산기", item: "https://jiko.kr/calculator/finance" },
        { name: "예금 계산기", item: "https://jiko.kr/calculator/finance/deposits" },
        { name: product.name, item: `https://jiko.kr/calculator/finance/deposits/${product.slug}` }
    ]);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            <NavBar title={product.name} description="상품 조건에 맞춘 정확한 이자 계산" />

            <Deposits productName={product.name} />

            <div className="max-w-3xl mx-auto px-4 pb-16 space-y-4 pt-2">
                {/* 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🏦</span> {product.name} 예금 계산기
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        선택하신 <strong>{product.name}</strong> 상품에 최적화된 계산 환경입니다.
                        은행에서 안내받은 금리와 기간을 입력하여 세후 실제 수령액을 미리 확인하고 자산 관리 계획을 세워보세요.
                    </p>
                </section>

                {/* 사용 방법 & 계산 예시 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>예치할 <strong>금액</strong>을 단위 버튼으로 편리하게 입력하세요.</li>
                            <li>예금 <strong>기간(개월)</strong>과 <strong>연 이자율(%)</strong>을 입력합니다.</li>
                            <li>이자 방식과 <strong>과세 유형</strong>을 선택합니다.</li>
                            <li><strong>계산하기</strong>를 누르면 세후 만기 수령액을 확인합니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                            <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">1,000만원 · 12개월 · 연 5.0% (단리)</p>
                            <p>• 세전 이자: <strong>500,000원</strong></p>
                            <p>• 이자 과세(15.4%): 77,000원</p>
                            <p className="mt-2 font-bold text-blue-600 dark:text-blue-400">만기 수령액: 10,423,000원</p>
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
