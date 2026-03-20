"use client";

import { useState, useEffect } from "react";
import { ANIMATION } from "@/app/config/animationConfig";

interface DividendProps {
    stockName?: string;
    initialCode?: string;
}

const CYCLES = [
    { label: "년", value: 12 },
    { label: "반기", value: 6 },
    { label: "분기", value: 3 },
    { label: "월", value: 1 },
];

export default function Dividend({ stockName, initialCode }: DividendProps) {
    const [buyPrice, setBuyPrice] = useState("");
    const [currentPrice, setCurrentPrice] = useState("");
    const [dividendPerShare, setDividendPerShare] = useState("");
    const [dividendCycle, setDividendCycle] = useState(12); // Default to yearly
    const [quantity, setQuantity] = useState("");
    const [targetMonthlyDividend, setTargetMonthlyDividend] = useState("");
    const [stockCode, setStockCode] = useState(initialCode || "");
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [errorMessage, setErrorMessage] = useState("");

    const [result, setResult] = useState<{
        yearlyTaxPre: number;
        yearlyTaxPost: number;
        monthlyTaxPost: number;
        yieldOnCost: string;
        currentYield: string;
        targetProgress: number;
        neededQty: number;
        neededCapital: number;
    } | null>(null);

    const [shaking, setShaking] = useState(false);

    const formatComma = (raw: string) =>
        raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const handleChange = (setter: (v: string) => void, fieldKey?: string) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (fieldKey) {
                setErrors((prev) => {
                    const next = new Set(prev);
                    next.delete(fieldKey);
                    return next;
                });
                setErrorMessage("");
            }
            const raw = e.target.value.replace(/[^0-9]/g, "");
            const noLeadingZero = raw.replace(/^0+/, "");
            setter(noLeadingZero === "" ? "" : formatComma(noLeadingZero));
        };

    const handleCalculate = () => {
        const newErrors = new Set<string>();
        const buy = Number(buyPrice.replace(/[^0-9]/g, ""));
        const current = Number(currentPrice.replace(/[^0-9]/g, ""));
        const div = Number(dividendPerShare.replace(/[^0-9]/g, ""));
        const qty = Number(quantity.replace(/[^0-9]/g, ""));
        const targetMonthly = Number(targetMonthlyDividend.replace(/[^0-9]/g, "")) || 0;

        if (!buyPrice) newErrors.add("buyPrice");
        if (!currentPrice) newErrors.add("currentPrice");
        if (!dividendPerShare) newErrors.add("dividendPerShare");
        if (!quantity) newErrors.add("quantity");

        if (newErrors.size > 0) {
            setErrors(newErrors);
            setErrorMessage("필수 항목을 모두 입력해 주세요.");
            setShaking(true);
            setTimeout(() => setShaking(false), 400);
            return;
        }

        const multiplier = 12 / dividendCycle;
        const yearlyTaxPre = div * qty * multiplier;
        const yearlyTaxPost = yearlyTaxPre * (1 - 0.154);
        const monthlyTaxPost = yearlyTaxPost / 12;

        const yieldOnCost = buy > 0 ? ((div * multiplier / buy) * 100).toFixed(2) : "0";
        const currentYield = current > 0 ? ((div * multiplier / current) * 100).toFixed(2) : "0";

        // 목표 계산
        const yearlyTaxPostPerShare = (div * multiplier) * (1 - 0.154);
        const targetProgress = targetMonthly > 0 ? Math.min(100, (monthlyTaxPost / targetMonthly) * 100) : 0;
        const neededQty = yearlyTaxPostPerShare > 0 ? Math.max(0, Math.ceil((targetMonthly * 12) / yearlyTaxPostPerShare) - qty) : 0;
        const neededCapital = neededQty * current;

        setResult({
            yearlyTaxPre,
            yearlyTaxPost,
            monthlyTaxPost,
            yieldOnCost,
            currentYield,
            targetProgress,
            neededQty,
            neededCapital
        });
        setErrors(new Set());
        setErrorMessage("");
    };

    const handleReset = () => {
        setBuyPrice("");
        setCurrentPrice("");
        setDividendPerShare("");
        setDividendCycle(12);
        setQuantity("");
        setTargetMonthlyDividend("");
        setResult(null);
        setErrors(new Set());
        setErrorMessage("");
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
    };

    // 생활 밀착형 비유 데이터
    const getLifeMetaphor = (monthlyIncome: number) => {
        if (monthlyIncome >= 2000000) return { label: "월세/생활비 걱정 끝!", icon: "🏡" };
        if (monthlyIncome >= 1000000) return { label: "매달 아이패드 한 대값!", icon: "📱" };
        if (monthlyIncome >= 500000) return { label: "품격 있는 취미 생활 가능!", icon: "🎨" };
        if (monthlyIncome >= 200000) return { label: "매달 최고급 한우 파티!", icon: "🥩" };
        if (monthlyIncome >= 100000) return { label: "통신비+보험료 해결!", icon: "📞" };
        if (monthlyIncome >= 50000) return { label: "치킨 2마리 공짜!", icon: "🍗" };
        if (monthlyIncome >= 10000) return { label: "스타벅스 커피 2잔!", icon: "☕" };
        return { label: "배당금 차곡차곡 모으기!", icon: "💰" };
    };

    return (
        <div className={`max-w-3xl mx-auto px-4 py-6 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>

                {/* 헤더 섹션 */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="flex justify-center flex-wrap gap-2">
                        {stockName && (
                            <span className="px-3 py-1 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-bold border border-green-100 dark:border-green-800">
                                📊 {stockName} {stockCode ? `(${stockCode})` : ""}
                            </span>
                        )}
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm font-semibold">
                            💸 주식 배당금 계산기
                        </span>
                    </div>
                </div>

                {/* 입력 카드 */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 sm:p-8 space-y-6 border border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {[
                                { label: "매수가", unit: "원", value: buyPrice, setter: setBuyPrice, placeholder: "평균 매입 단가", key: "buyPrice", id: "dividend-buy-price" },
                                { label: "현재가", unit: "원", value: currentPrice, setter: setCurrentPrice, placeholder: "현재 주식 가격", key: "currentPrice", id: "dividend-current-price" },
                                { label: "수량", unit: "주", value: quantity, setter: setQuantity, placeholder: "보유 주식 수", key: "quantity", id: "dividend-quantity" },
                            ].map(({ label, unit, value, setter, placeholder, key, id }) => (
                                <div key={label} className="flex flex-col gap-1">
                                    <label htmlFor={id} className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
                                    <div className="flex items-center relative">
                                        <input
                                            id={id}
                                            type="text" inputMode="numeric" placeholder={placeholder}
                                            value={value} onChange={handleChange(setter, key)}
                                            className={`w-full border rounded-xl px-4 py-3 text-right focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 dark:text-white transition-all ${
                                                errors.has(key) ? "border-red-500 ring-2 ring-red-200 dark:ring-red-900/30" : "border-gray-200 dark:border-gray-700 focus:ring-green-400"
                                            }`}
                                        />
                                        <span className={`ml-2 text-sm w-4 shrink-0 ${errors.has(key) ? "text-red-500 font-bold" : "text-gray-600 dark:text-gray-400"}`}>{unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="dividend-per-share" className="text-sm font-semibold text-gray-700 dark:text-gray-300">주당 배당금</label>
                                <div className="flex items-center relative">
                                    <input
                                        id="dividend-per-share"
                                        type="text" inputMode="numeric" placeholder="1주당 배당액"
                                        value={dividendPerShare} onChange={handleChange(setDividendPerShare, "dividendPerShare")}
                                        className={`w-full border rounded-xl px-4 py-3 text-right focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 dark:text-white transition-all ${
                                            errors.has("dividendPerShare") ? "border-red-500 ring-2 ring-red-200 dark:ring-red-900/30" : "border-gray-200 dark:border-gray-700 focus:ring-green-400"
                                        }`}
                                    />
                                    <span className={`ml-2 text-sm w-4 shrink-0 ${errors.has("dividendPerShare") ? "text-red-500 font-bold" : "text-gray-600 dark:text-gray-400"}`}>원</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">배당 주기</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {CYCLES.map((cycle) => (
                                        <button
                                            key={cycle.value}
                                            onClick={() => setDividendCycle(cycle.value)}
                                            className={`py-2 rounded-xl text-sm font-medium transition-all ${
                                                dividendCycle === cycle.value
                                                    ? "bg-green-500 text-white shadow-sm"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            }`}
                                        >
                                            {cycle.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 pt-2">
                                <label htmlFor="target-monthly-dividend" className="text-sm font-semibold text-orange-600 dark:text-orange-400 flex justify-between items-center gap-1">
                                    🚩 목표 월 배당금
                                    <span className="text-[10px] font-normal text-gray-600 dark:text-gray-400 ml-auto whitespace-nowrap">(선택)</span>
                                </label>
                                <div className="flex items-center relative">
                                    <input
                                        id="target-monthly-dividend"
                                        type="text" inputMode="numeric" placeholder="받고 싶은 월 배당금"
                                        value={targetMonthlyDividend} onChange={handleChange(setTargetMonthlyDividend)}
                                        className="w-full border border-orange-100 dark:border-orange-900/30 rounded-xl px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50/30 dark:bg-orange-900/10 dark:text-white"
                                    />
                                    <span className="ml-2 text-sm text-orange-500 w-4 shrink-0 font-bold">원</span>
                                </div>
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
                                    className="flex-[2] py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200 dark:shadow-none transition-all active:scale-95">
                                배당 계산하기
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

                {/* 결과 섹션 */}
                {result && (
                    <div className={`mt-8 space-y-6 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>
                        
                        {/* 1. 메인 결과 카드: 세후 배당액 */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border-t-4 border-green-500">
                            <div className="flex flex-col items-center py-4">
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-bold mb-1">실제 받는 세후 월 배당금</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-green-600 dark:text-green-400">
                                        {Math.floor(result.monthlyTaxPost).toLocaleString()}
                                    </span>
                                    <span className="text-xl font-bold text-gray-800 dark:text-gray-200">원</span>
                                </div>
                                <div className="mt-4 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center gap-2">
                                    <span className="text-xl">{getLifeMetaphor(result.monthlyTaxPost).icon}</span>
                                    <span className="text-sm font-bold text-green-700 dark:text-green-300">
                                        {getLifeMetaphor(result.monthlyTaxPost).label}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-1">연간 세전</p>
                                    <p className="font-bold text-gray-800 dark:text-gray-100">{Math.floor(result.yearlyTaxPre).toLocaleString()}원</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-1">연간 세후(15.4%)</p>
                                    <p className="font-bold text-gray-800 dark:text-gray-100">{Math.floor(result.yearlyTaxPost).toLocaleString()}원</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. 수익률 상세 정보 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                                <p className="text-xs text-gray-500 mb-2">나의 실제 수익률 (YoC)</p>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-gray-400">매수가 대비</span>
                                    <span className="text-2xl font-black text-blue-500">{result.yieldOnCost}%</span>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                                <p className="text-xs text-gray-500 mb-2">현재 시가 배당률</p>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-gray-400">현재가 대비</span>
                                    <span className="text-2xl font-black text-purple-500">{result.currentYield}%</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. 목표 달성 대시보드 */}
                        {Number(targetMonthlyDividend.replace(/[^0-9]/g, "")) > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 overflow-hidden relative">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-800 dark:text-gray-100">목표 달성 현황</h3>
                                    <span className="text-orange-500 font-black text-lg">{result.targetProgress.toFixed(1)}%</span>
                                </div>
                                
                                {/* 프로그레스 바 */}
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 mb-6">
                                    <div 
                                        className="h-full bg-orange-400 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-orange-200"
                                        style={{ width: `${result.targetProgress}%` }}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400 font-medium">목표까지 남은 수량</span>
                                        <span className="font-bold text-gray-800 dark:text-gray-100">{result.neededQty.toLocaleString()} 주</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400 font-medium">필요 추가 투자금</span>
                                        <span className="font-bold text-orange-600 dark:text-orange-400">{result.neededCapital.toLocaleString()} 원</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 text-right mt-2">* 세후 실수령액 기준 및 현재 주가 기준 계산</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
    );
}
