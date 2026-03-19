import { Metadata } from "next";
import { notFound } from "next/navigation";
import Savings from "../Savings";
import NavBar from "@/app/calculator/components/NavBar";
import FAQ from "@/app/calculator/components/FAQ";
import FinanceMoreCalculators from "@/app/calculator/components/FinanceMoreCalculators";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import productsData from "../../data/products.json";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return productsData.savings.map(p => ({ slug: encodeURIComponent(p.slug) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug).normalize('NFC');
    const product = productsData.savings.find(p => p.slug.normalize('NFC') === decodedSlug);
    if (!product) return {};

    return {
        title: `${product.name} 적금 이자 계산기 | 정기적금 만기 수령액 및 이자 계산기 - JIKO 계산기`,
        description: `${product.name} 상품의 월 적립액 기준 만기 수령액을 계산해드립니다. 목돈 마련 계획을 위해 정확한 세후 이자를 지금 확인하세요.`,
        keywords: [product.name, "적금 계산기", "목돈 마련", "적금 금리", "금융 계산기"],
    };
}

const faqList = [
    {
        question: "적금도 복리 상품이 있나요?",
        answer: "네, 일부 저축은행이나 협동조합 상품 중에는 이자가 다시 원금에 가산되는 복리 방식을 택하는 적금 상품이 있습니다. 가입하신 상품의 약관을 확인하시어 월복리 옵션을 선택해 보세요."
    },
    {
        question: "중도해지 시 이자는 어떻게 되나요?",
        answer: "중도해지 시에는 약정한 이율보다 훨씬 낮은 중도해지 이율이 적용됩니다. 본 계산기는 만기까지 유지했을 때의 결과를 기준으로 합니다."
    }
];

export default async function SavingsSlugPage({ params }: Props) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug).normalize('NFC');
    const product = productsData.savings.find(p => p.slug.normalize('NFC') === decodedSlug);
    if (!product) notFound();

    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        { name: "금융 계산기", item: "https://jiko.kr/calculator/finance" },
        { name: "적금 계산기", item: "https://jiko.kr/calculator/finance/savings" },
        { name: product.name, item: `https://jiko.kr/calculator/finance/savings/${product.slug}` }
    ]);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            <NavBar title={product.name} description="종목 특성에 맞춘 스마트한 적금 계산" />

            <Savings productName={product.name} />

            <div className="max-w-3xl mx-auto px-4 pb-16 space-y-4 pt-2">
                {/* 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">💰</span> {product.name} 적금 이자 계산기
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        <strong>{product.name}</strong> 상품의 월 납입액과 이율을 입력하여 미래의 목돈을 미리 설계해보세요.
                        금융 상품마다 다른 이자 계산 방식과 세금 혜택을 반영하여 가장 정확한 만기 수령액을 보여드립니다.
                    </p>
                </section>

                {/* 사용 방법 & 계산 예시 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>매달 저축할 <strong>납입 금액</strong>을 설정합니다.</li>
                            <li>적금 <strong>기간(개월)</strong>과 <strong>연 이자율(%)</strong>을 입력합니다.</li>
                            <li>이자 방식과 <strong>과세 유형</strong>을 선택합니다.</li>
                            <li><strong>계산하기</strong>를 누르면 총 납입액과 만기 수령액을 확인합니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                            <p className="font-semibold text-green-700 dark:text-green-300 mb-2">월 100만원 · 12개월 · 연 5.0% (단리)</p>
                            <p>• 원금 합계 : <strong>12,000,000원</strong></p>
                            <p>• 세전 이자 : 325,000원</p>
                            <p>• 이자 과세(15.4%) : 50,050원</p>
                            <p className="mt-2 font-bold text-green-600 dark:text-green-400">만기 수령액 : 12,274,950원</p>
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
