"use client";

import { useState } from "react";
import NavBar from "@/app/calculator/components/NavBar";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import { ANIMATION } from "@/app/config/animationConfig";

interface ProfitRateProps {
    stockName?: string;
}

export default function ProfitRate({ stockName }: ProfitRateProps) {
    const [buyPrice, setBuyPrice] = useState("");
    const [currentPrice, setCurrentPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [result, setResult] = useState<{ profit: number; rate: string; buyTotal: number; currentTotal: number } | null>(null);
    const [copied, setCopied] = useState(false);
    const [shaking, setShaking] = useState(false);

    const formatComma = (raw: string) =>
        raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const handleChange = (setter: (v: string) => void) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setResult(null);
            const raw = e.target.value.replace(/[^0-9]/g, "");
            const noLeadingZero = raw.replace(/^0+/, "");
            setter(noLeadingZero === "" ? "" : formatComma(noLeadingZero));
        };

    const handleCalculate = () => {
        const buy = Number(buyPrice.replace(/[^0-9]/g, ""));
        const current = Number(currentPrice.replace(/[^0-9]/g, ""));
        const qty = Number(quantity.replace(/[^0-9]/g, ""));
        const buyTotal = buy * qty;
        const currentTotal = current * qty;
        const profit = currentTotal - buyTotal;
        const rate = buy > 0 ? (((current - buy) / buy) * 100).toFixed(2) : "0";
        setResult({ profit, rate, buyTotal, currentTotal });
    };

    const handleReset = () => {
        setBuyPrice(""); setCurrentPrice(""); setQuantity("");
        setResult(null); setCopied(false);
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
    };

    const handleCopyResult = async () => {
        if (!result) return;
        const text = [
            `매수 금액 : ${result.buyTotal.toLocaleString()} 원`,
            `현재 금액 : ${result.currentTotal.toLocaleString()} 원`,
            `수익금   : ${result.profit.toLocaleString()} 원`,
            `수익률   : ${result.rate} %`,
        ].join("\n");
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // 그래프 계산
    const getBarWidths = () => {
        if (!result) return { buyWidth: 0, currentWidth: 0 };
        const max = Math.max(result.buyTotal, result.currentTotal);
        if (max === 0) return { buyWidth: 0, currentWidth: 0 };
        return {
            buyWidth: Math.round((result.buyTotal / max) * 100),
            currentWidth: Math.round((result.currentTotal / max) * 100),
        };
    };

    const { buyWidth, currentWidth } = getBarWidths();
    const isProfit = result ? result.profit >= 0 : true;

    return (
        <div className="bg-gray-50 dark:bg-gray-900">

            <NavBar title="주식 수익률 계산기 | 매수가 현재가 수익 계산 - JIKO calculator" description={"주식 수익률을 정확히 계산해보세요"} />

            <div className={`max-w-2xl mx-auto px-4 py-6 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>

                <div className="flex justify-center mb-6">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm font-semibold italic">
                        💰 {stockName ? `[${stockName}] ` : ""}수익률 계산기
                    </span>
                </div>

                {/* 입력 영역 */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8">
                    <div className="space-y-6">
                        {[
                            { label: "매수가", unit: "원", value: buyPrice, setter: setBuyPrice },
                            { label: "현재가", unit: "원", value: currentPrice, setter: setCurrentPrice },
                            { label: "수량", unit: "개", value: quantity, setter: setQuantity },
                        ].map(({ label, unit, value, setter }) => (
                            <div key={label} className="flex items-center gap-4">
                                <label className="w-20 font-semibold text-gray-800 dark:text-gray-100 shrink-0">{label}</label>
                                <div className="flex items-center flex-1">
                                    <input
                                        type="text" inputMode="numeric" placeholder="0"
                                        value={value}
                                        onChange={handleChange(setter)}
                                        className="w-full border rounded-lg px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-base"
                                    />
                                    <span className="ml-2 w-8 text-gray-800 dark:text-gray-100 shrink-0">{unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 버튼 */}
                <div className="mt-6 flex justify-center gap-3">
                    <button onClick={handleReset}
                        className={`px-6 py-3 min-h-[44px] border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 transition-colors duration-150 text-base ${ANIMATION.resetShake && shaking ? "animate-shake" : ""}`}>
                        초기화
                    </button>
                    <button onClick={handleCalculate}
                        className="px-8 py-3 min-h-[44px] bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors duration-150 text-base">
                        계산하기
                    </button>
                </div>

                {/* 결과 영역 — 모바일: 상하 / PC: 좌우 */}
                {result && (
                    <div className={`mt-6 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>
                        <div className="flex flex-col sm:flex-row gap-4">

                            {/* 좌측: 결과 수치 */}
                            <div className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md space-y-3">
                                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">계산 결과</h2>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">매수 금액</span>
                                    <strong className="text-gray-800 dark:text-gray-100">{result.buyTotal.toLocaleString()} 원</strong>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">현재 금액</span>
                                    <strong className="text-gray-800 dark:text-gray-100">{result.currentTotal.toLocaleString()} 원</strong>
                                </div>
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">수익금</span>
                                    <strong className={isProfit ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400"}>
                                        {result.profit >= 0 ? "+" : ""}{result.profit.toLocaleString()} 원
                                    </strong>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">수익률</span>
                                    <strong className={`text-xl ${isProfit ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400"}`}>
                                        {Number(result.rate) >= 0 ? "+" : ""}{result.rate} %
                                    </strong>
                                </div>

                                {/* 복사 버튼 */}
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-center">
                                    <button onClick={handleCopyResult}
                                        className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${copied ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                            }`}>
                                        {copied ? (
                                            <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>복사 완료!</>
                                        ) : (
                                            <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>결과 복사</>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* 우측: 그래프 */}
                            <div className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md flex flex-col justify-center">
                                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-5">금액 비교</h2>

                                {/* 수익률 % 크게 표시 */}
                                <div className="text-center mb-5">
                                    <span className={`text-4xl font-bold ${isProfit ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400"}`}>
                                        {Number(result.rate) >= 0 ? "+" : ""}{result.rate}%
                                    </span>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        {isProfit ? "수익" : "손실"}
                                    </p>
                                </div>

                                {/* 가로 막대 그래프 */}
                                <div className="space-y-3">
                                    {/* 매수금액 바 */}
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            <span>매수 금액</span>
                                            <span>{result.buyTotal.toLocaleString()} 원</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                                            <div
                                                className="h-4 rounded-full bg-gray-400 dark:bg-gray-500 transition-all duration-700 ease-out"
                                                style={{ width: `${buyWidth}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* 현재금액 바 */}
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            <span>현재 금액</span>
                                            <span>{result.currentTotal.toLocaleString()} 원</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                                            <div
                                                className={`h-4 rounded-full transition-all duration-700 ease-out ${isProfit ? "bg-red-400 dark:bg-red-500" : "bg-blue-400 dark:bg-blue-500"}`}
                                                style={{ width: `${currentWidth}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 범례 */}
                                <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400 dark:text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-500 inline-block" />
                                        매수
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className={`w-3 h-3 rounded-full inline-block ${isProfit ? "bg-red-400" : "bg-blue-400"}`} />
                                        현재
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* PWA 설치 유도 배너 */}
                <InstallBanner />
            </div>
        </div>
    );
}