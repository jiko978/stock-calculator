"use client";

import { useState, useEffect } from "react";
import { ANIMATION } from "@/app/config/animationConfig";

const MARKETS = [
    { label: "코스피", value: "KOSPI", tax: 0.0020 }, // 0.20% (거래세 0.05% + 농특세 0.15%)
    { label: "코스닥", value: "KOSDAQ", tax: 0.0020 }, // 0.20%
    { label: "해외(미국 등)", value: "OVERSEAS", tax: 0.22, exemption: 2500000 }, // 양도세 22%, 공제 250만
];

interface StockFeeProps {
    stockName?: string;
    initialCode?: string;
}

export default function StockFee({ stockName, initialCode }: StockFeeProps) {
    const [market, setMarket] = useState(MARKETS[0]);
    const [buyPrice, setBuyPrice] = useState("");
    const [sellPrice, setSellPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [buyCommission, setBuyCommission] = useState("0.015");
    const [sellCommission, setSellCommission] = useState("0.015");

    useEffect(() => {
        if (market.value === "OVERSEAS") {
            setBuyCommission("0.1");
            setSellCommission("0.1");
        } else {
            setBuyCommission("0.015");
            setSellCommission("0.015");
        }
        setResult(null);
    }, [market.value]);

    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [errorMessage, setErrorMessage] = useState("");
    const [shaking, setShaking] = useState(false);

    const [result, setResult] = useState<{
        grossProfit: number;
        totalCommission: number;
        totalTax: number;
        netProfit: number;
        profitRate: string;
        minSellPrice: number;
    } | null>(null);

    const formatComma = (raw: string) =>
        raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const handleChange = (setter: (v: string) => void, fieldKey?: string, isFloat = false) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (fieldKey) {
                setErrors((prev) => {
                    const next = new Set(prev);
                    next.delete(fieldKey);
                    return next;
                });
                setErrorMessage("");
            }
            let raw = e.target.value;
            if (isFloat) {
                raw = raw.replace(/[^0-9.]/g, "");
                setter(raw);
            } else {
                raw = raw.replace(/[^0-9]/g, "").replace(/^0+/, "");
                setter(raw === "" ? "" : formatComma(raw));
            }
        };

    const handleCalculate = () => {
        const newErrors = new Set<string>();
        const buy = Number(buyPrice.replace(/[^0-9]/g, ""));
        const sell = Number(sellPrice.replace(/[^0-9]/g, ""));
        const qty = Number(quantity.replace(/[^0-9]/g, ""));
        const bComm = Number(buyCommission) / 100;
        const sComm = Number(sellCommission) / 100;

        if (!buyPrice) newErrors.add("buyPrice");
        if (!sellPrice) newErrors.add("sellPrice");
        if (!quantity) newErrors.add("quantity");

        if (newErrors.size > 0) {
            setErrors(newErrors);
            setErrorMessage("필수 항목을 모두 입력해 주세요.");
            setShaking(true);
            setTimeout(() => setShaking(false), 400);
            return;
        }

        const buyAmt = buy * qty;
        const sellAmt = sell * qty;
        const grossProfit = sellAmt - buyAmt;

        const buyCommTotal = buyAmt * bComm;
        const sellCommTotal = sellAmt * sComm;
        const totalCommission = buyCommTotal + sellCommTotal;

        let totalTax = 0;
        if (market.value === "OVERSEAS") {
            const taxableProfit = grossProfit - totalCommission - market.exemption!;
            if (taxableProfit > 0) {
                totalTax = taxableProfit * market.tax;
            }
        } else {
            // 국내 거래세는 매도 시 발생
            totalTax = sellAmt * market.tax;
        }

        const netProfit = grossProfit - totalCommission - totalTax;
        const profitRate = buyAmt > 0 ? ((netProfit / buyAmt) * 100).toFixed(2) : "0";

        // 최소 익절가 계산 (수수료와 세금을 고려해 본전이 되는 가격)
        // SellAmt - BuyAmt - BuyComm - (SellAmt * sComm) - (SellAmt * Tax) = 0
        // SellAmt * (1 - sComm - Tax) = BuyAmt + BuyComm
        // SellPrice * Qty = (BuyAmt + BuyComm) / (1 - sComm - Tax)
        let minSellPrice = 0;
        if (market.value === "OVERSEAS") {
            // 해외는 양도세가 수익 발생 시 사후 계산되므로 보통 거래 시점 본전은 거래 수수료만 고려
            minSellPrice = (buyAmt + buyCommTotal) / (qty * (1 - sComm));
        } else {
            minSellPrice = (buyAmt + buyCommTotal) / (qty * (1 - sComm - market.tax));
        }

        setResult({
            grossProfit,
            totalCommission,
            totalTax,
            netProfit,
            profitRate,
            minSellPrice: Math.ceil(minSellPrice)
        });
        setErrors(new Set());
        setErrorMessage("");
    };

    const handleReset = () => {
        setBuyPrice("");
        setSellPrice("");
        setQuantity("");
        setResult(null);
        setErrors(new Set());
        setErrorMessage("");
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900">

            <div className={`max-w-3xl mx-auto px-4 py-6 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>

                <div className="flex flex-col items-center gap-4 mb-8 text-center">
                    <div className="flex justify-center flex-wrap gap-2">
                        {stockName && (
                            <span className="px-3 py-1 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full text-sm font-bold border border-red-100 dark:border-red-800">
                                📊 {stockName} {initialCode ? `(${initialCode})` : ""}
                            </span>
                        )}
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm font-semibold">
                            💳️️ 주식 수수료 계산기
                        </span>
                    </div>
                </div>

                {/* 입력 카드 */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 sm:p-8 space-y-6 border border-gray-100 dark:border-gray-700">

                    {/* 시장 선택 */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">거래 시장</label>
                        <div className="grid grid-cols-3 gap-2">
                            {MARKETS.map((m) => (
                                <button
                                    key={m.value}
                                    onClick={() => { setMarket(m); setResult(null); }}
                                    className={`py-3 rounded-xl text-sm font-bold transition-all ${market.value === m.value
                                        ? "bg-blue-500 text-white shadow-md shadow-blue-200 dark:shadow-none"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-4">
                            {[
                                { label: "매수가", unit: "원", value: buyPrice, setter: setBuyPrice, placeholder: "1주당 매수 가격", key: "buyPrice" },
                                { label: "매도가", unit: "원", value: sellPrice, setter: setSellPrice, placeholder: "1주당 매도 가격", key: "sellPrice" },
                                { label: "수량", unit: "주", value: quantity, setter: setQuantity, placeholder: "보유/매매 수량", key: "quantity" },
                            ].map(({ label, unit, value, setter, placeholder, key }) => (
                                <div key={label} className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{label}</label>
                                    <div className="flex items-center relative">
                                        <input
                                            type="text" inputMode="numeric" placeholder={placeholder}
                                            value={value} onChange={handleChange(setter, key)}
                                            className={`w-full border rounded-xl px-4 py-3 text-right focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 dark:text-white transition-all ${errors.has(key) ? "border-red-500 ring-2 ring-red-200 dark:ring-red-900/30" : "border-gray-200 dark:border-gray-700 focus:ring-blue-400"
                                                }`}
                                        />
                                        <span className={`ml-2 text-sm w-4 shrink-0 font-bold ${errors.has(key) ? "text-red-500" : "text-gray-500"}`}>{unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">수수료 (매수/매도 각각)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative flex items-center">
                                        <input
                                            type="text" placeholder="매수 (%)"
                                            value={buyCommission} onChange={handleChange(setBuyCommission, undefined, true)}
                                            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 dark:text-white text-sm"
                                        />
                                        <span className="absolute right-3 text-[10px] text-gray-400 pointer-events-none mt-7">매수</span>
                                    </div>
                                    <div className="relative flex items-center">
                                        <input
                                            type="text" placeholder="매도 (%)"
                                            value={sellCommission} onChange={handleChange(setSellCommission, undefined, true)}
                                            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 dark:text-white text-sm"
                                        />
                                        <span className="absolute right-3 text-[10px] text-gray-400 pointer-events-none mt-7">매도</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 ml-1 text-right">* 단위: % (기본 {market.value === "OVERSEAS" ? "0.1" : "0.015"}%)</p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 mb-2">시장별 세부 정보</h3>
                                <ul className="space-y-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                                    <li className="flex justify-between">
                                        <span>거래세율</span>
                                        <span className="text-gray-800 dark:text-gray-200 font-bold">{(market.tax * 100).toFixed(2)}%</span>
                                    </li>
                                    {market.value === "OVERSEAS" && (
                                        <li className="flex justify-between">
                                            <span>기본 수익 공제</span>
                                            <span className="text-gray-800 dark:text-gray-200 font-bold">2,500,000 원</span>
                                        </li>
                                    )}
                                    <li className="flex justify-between">
                                        <span>세금 종류</span>
                                        <span className="text-gray-800 dark:text-gray-200 font-bold">
                                            {market.value === "OVERSEAS" ? "양도소득세" : "증권거래세"}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 버튼 섹션 */}
                    <div className="pt-4 space-y-3">
                        <div className="flex gap-3">
                            <button onClick={handleReset}
                                className={`flex-1 py-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-all ${shaking ? "animate-shake" : ""}`}>
                                초기화
                            </button>
                            <button onClick={handleCalculate}
                                className="flex-[2] py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95">
                                수수료 계산하기
                            </button>
                        </div>
                        {errorMessage && (
                            <p className="text-center text-red-500 text-sm font-bold flex items-center justify-center gap-1 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {errorMessage}
                            </p>
                        )}
                    </div>
                </div>

                {/* 결과 영역 */}
                {result && (
                    <div className={`mt-8 space-y-6 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>

                        {/* 메인 결과 카드 */}
                        <div className={`bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border-t-8 ${Number(result.profitRate) >= 0 ? "border-red-500 shadow-red-100 dark:shadow-none" : "border-blue-500 shadow-blue-100 dark:shadow-none"}`}>
                            <div className="text-center mb-6">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">세후 최종 순이익</p>
                                <h2 className={`text-4xl sm:text-5xl font-black ${Number(result.profitRate) >= 0 ? "text-red-500" : "text-blue-500"}`}>
                                    {result.netProfit >= 0 ? "+" : ""}{result.netProfit.toLocaleString()} <span className="text-2xl">원</span>
                                </h2>
                                <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mt-4 text-base font-black ${Number(result.profitRate) >= 0 ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}`}>
                                    {Number(result.profitRate) >= 0 ? "📈" : "📉"} {Number(result.profitRate) >= 0 ? "+" : ""}{result.profitRate}%
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center group">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">세전 손익</span>
                                        <span className="font-bold text-gray-800 dark:text-gray-100">{result.grossProfit.toLocaleString()} 원</span>
                                    </div>
                                    <div className="flex justify-between items-center group">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">총 수수료</span>
                                        <span className="font-bold text-gray-800 dark:text-gray-100">{result.totalCommission.toLocaleString()} 원</span>
                                    </div>
                                    <div className="flex justify-between items-center group">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm font-bold text-red-500">지불할 세금</span>
                                        <span className="font-black text-red-500">-{result.totalTax.toLocaleString()} 원</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex flex-col justify-center items-center text-center">
                                    <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1">
                                        ✅ 최소 익절가 가이드
                                        <span className="relative group/tip">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-gray-300 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-[10px] rounded leading-relaxed opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-50">
                                                수수료와 세금을 계산했을 때 손해가 나지 않는 최소 매도 가격입니다.
                                            </span>
                                        </span>
                                    </p>
                                    <p className="text-lg font-black text-blue-600 dark:text-blue-400">
                                        {result.minSellPrice.toLocaleString()} 원
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-1">이 가격 이상으로 팔아야 수익입니다!</p>
                                </div>
                            </div>
                        </div>

                        {/* 안내 문구 */}
                        <div className="text-center opacity-50 px-4">
                            <p className="text-xs text-gray-400 leading-relaxed">
                                * 위 계산 결과는 최신 세율(2026년 기준)을 바탕으로 한 시뮬레이션이며,<br />
                                증권사별 우대 수수료나 기타 제세금 차이에 따라 실제 금액과 다를 수 있습니다.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
