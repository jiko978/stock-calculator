import type { Metadata, ResolvingMetadata } from "next";
import Dividend from "../Dividend";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../../utils/seo";
import NavBar from "@/app/calculator/components/NavBar";
import StockMoreCalculators from "@/app/calculator/components/StockMoreCalculators";
import FAQ from "@/app/calculator/components/FAQ";
import stocksData from "../../data/stocks.json";
import highDividendData from "../../data/high-dividend.json";

const BASE_URL = "https://jiko.kr";

interface Props {
    params: Promise<{ slug: string }>;
}

function findStock(slug: string): { name: string; code?: string } {
    const normalized = decodeURIComponent(slug).normalize('NFC');

    // 1. 하이브리드 패턴 (삼성전자-005930)
    if (normalized.includes("-")) {
        const [name, code] = normalized.split("-");
        return { name, code };
    }

    // 2. 종목 코드 패턴 (005930)
    if (/^\d{6}$/.test(normalized)) {
        const stock = stocksData.find(s => s.code === normalized);
        return stock ? { name: stock.name, code: stock.code } : { name: normalized };
    }

    // 3. 종목명 패턴 (삼성전자)
    const stockByName = stocksData.find(s => s.name.normalize('NFC') === normalized);
    return stockByName ? { name: stockByName.name, code: stockByName.code } : { name: normalized };
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const { name, code } = findStock(slug);
    const displayCode = code ? `(${code})` : "";

    return {
        title: `${code || ""} ${name} 배당금 계산기 | ${name} 배당 수익률 계산기 - JIKO 계산기`,
        description: `${name} 배당금 및 배당 수익률 시뮬레이션. ${code || ""} 종목을 보유했을 때 세후 실수령액과 월 평균 배당금을 확인하세요. 목표 배당금을 위한 필요 수량까지 계산해 드립니다.`,
        keywords: [name, code, "배당금", "배당 수익률", "주식 계산기", `${name} 배당`, `${code} 배당`].filter(Boolean) as string[],
        alternates: { canonical: `${BASE_URL}/calculator/stock/dividend/${slug}` },
        openGraph: {
            title: `${name}${displayCode} 배당금 계산기`,
            description: `${name} 배당 수익 현황 및 목표 달성 리포트`,
            url: `${BASE_URL}/calculator/stock/dividend/${slug}`,
            images: [`${BASE_URL}/calculator/jiko-calculator-icon2.png`],
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const { name, code } = findStock(slug);

    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.STOCK_HOME,
        COMMON_BREADCRUMBS.DIVIDEND,
        { name: name, item: `/calculator/stock/dividend/${slug}` }
    ]);

    const faqList = [
        {
            question: `${name}의 배당 기준일은 언제인가요?`,
            answer: "보통 연배당은 12월 말, 분기배당은 3, 6, 9월 말일이 기준인 경우가 많습니다. 정확한 공시를 확인하여 2거래일 전까지는 결제가 완료되어야 배당을 받을 수 있습니다."
        },
        {
            question: "배당 수익률 대비 주가가 떨어지면 어떻게 하나요?",
            answer: "주가 하락폭이 배당 수익보다 크면 전체 손실이 발생할 수 있습니다. 따라서 배당 지속 가능성과 기업의 이익 성장을 함께 고려하는 것이 중요합니다."
        }
    ];

    const stockSchema = code ? {
        "@context": "https://schema.org",
        "@type": "InvestmentOrDeposit",
        "name": name,
        "tickerSymbol": code,
        "url": `${BASE_URL}/calculator/stock/dividend/${slug}`
    } : null;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            {stockSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(stockSchema) }}
                />
            )}

            <NavBar title={`${name} 주식 배당금 계산기`} description={`${name} 종목의 배당 수익률과 목표 달성을 시뮬레이션 하세요.`} position="top" />

            <Dividend stockName={name} initialCode={code} />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-8">
                {/* [공통 카드세션] 1. 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        💹 {name} {code ? `(${code})` : ""} 배당 투자 가치 분석 리포트
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        {name} 종목의 배당 매력을 확인해 보세요. {code ? `티커 ${code}` : "해당 종목"}의 주당 배당금을 입력하면
                        나의 매수가 대비 배당 수익률(YoC)과 현재가 대비 배당률을 즉시 비교할 수 있습니다.
                        {name} 배당금으로 꿈꾸는 경제적 자유에 한 걸음 더 다가가세요.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* [공통 카드세션] 2. 사용 방법 */}
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li><strong>매수가</strong>와 <strong>현재가</strong>, 그리고 {name} <strong>보유 수량</strong>을 입력합니다.</li>
                            <li><strong>주당 배당금</strong>과 지급 주기를 선택하세요.</li>
                            <li>나의 <strong>목표 월 배당금</strong>을 설정하여 달성 상태를 시뮬레이션 합니다.</li>
                            <li>'계산하기'를 클릭하면 세후 실수령액과 추가 매수 필요량을 보여드립니다.</li>
                        </ul>
                    </section>

                    {/* [공통 카드세션] 3. 계산 예시 */}
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-1">
                            <p>{name} 매수가 : <strong>100,000원</strong></p>
                            <p>주당 배당금 : <strong>5,000원</strong> / 보유 : <strong>100주</strong></p>
                            <p className="border-t border-gray-200 dark:border-gray-600 pt-1 mt-1 text-red-500 font-bold">
                                세후 예상 배당금 : 약 423,000원
                            </p>
                            <p className="text-blue-600 font-semibold text-xs leading-relaxed">
                                * 소득세(14%) + 지방소득세(1.4%)를 제외한 실수령 기준
                            </p>
                        </div>
                    </section>
                </div>

                {/* [공통 카드세션] 4. FAQ */}
                <FAQ faqList={faqList} />

                {/* [개별 카드세션] 1. 투자 가이드 섹션 */}
                <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                        💰 제 2의 월급 지도 : 한국 주식 배당 투자 가이드
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-xs">
                        안정적인 현금 흐름을 만드는 배당 투자는 단순히 수익률만 보는 것이 아니라, 
                        **기업의 이익 체력**과 **배당 지속성**을 확인하는 것이 핵심입니다.
                    </p>

                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">✅ 필수 체크리스트</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 text-xs">
                        <li><strong>배당성향(Payout Ratio)</strong> : 벌어들인 돈 대비 배당금을 과하지 않게 주는지 확인하세요.</li>
                        <li><strong>PBR(주가순자산비율)</strong> : 자산 가치 대비 저평가된 기업일수록 향후 주가 상승과 배당 확대를 기대할 수 있습니다.</li>
                        <li><strong>배당락 관리</strong> : 배당을 받기 위해선 배당기준일 2거래일 전까지 매수해야 함을 잊지 마세요.</li>
                    </ul>
                </section>

                {/* [개별 카드세션] 2. 산업별 고배당주 섹션 */}
                <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            🏦 한국 KOSPI 산업별 고배당주
                        </h2>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">업데이트 : 2026.03.18</span>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {highDividendData.map((item) => (
                            <div key={item.category} className="space-y-3">
                                <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 flex items-center gap-2">
                                    <span className="w-1 h-3 bg-green-500 rounded-full" />
                                    {item.category}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {item.stocks.map((stock) => (
                                        <div key={stock.code} className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-700 group hover:border-green-400 transition-colors">
                                            <div className="flex justify-between items-start gap-x-4">
                                                {/* 좌측 */}
                                                <div>
                                                    <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-green-600 transition-colors">
                                                        {stock.name}
                                                    </p>
                                                    <p className="text-[12px] text-red-400 mt-0.5">
                                                        {stock.desc}
                                                    </p>
                                                </div>

                                                {/* 우측 */}
                                                <div className="text-right text-[12px] text-gray-400 space-y-0.5 shrink-0">
                                                    <p className="text-green-600 dark:text-green-400 font-extrabold text-sm mb-1">
                                                        {stock.dividend}
                                                    </p>
                                                    <p>주당 배당금 : {stock.dps}</p>
                                                    <p>배당 주기 : {stock.freq}</p>
                                                    <p>배당 성향 : {stock.payout}</p>
                                                    <p>안정성 : {stock.stability}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 text-xs text-gray-400 dark:text-gray-500 text-center italic">
                        * 위 종목 리스트는 투자 권유가 아니며, 과거 데이터를 바탕으로 한 참고용입니다.
                    </p>
                </section>

                {/* 주식 계산기 더 보기 */}
                <StockMoreCalculators />
            </main>
        </div>
    );
}
