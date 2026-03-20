"use client";

import { useState, useRef, useEffect } from "react";
import { ANIMATION } from "@/app/config/animationConfig";
import InstallBanner from "@/app/calculator/components/InstallBanner";

interface DepositsProps {
    productName?: string;
}

const Deposits = ({ productName }: DepositsProps) => {
    const [amount, setAmount] = useState(""); // 예치금액
    const [term, setTerm] = useState(""); // 예금기간
    const [termUnit, setTermUnit] = useState<"month" | "year">("month"); // 기간 단위
    const [rate, setRate] = useState(""); // 연이자율
    const [interestType, setInterestType] = useState<"simple" | "compound">("simple"); // 이자계산방식
    const [taxType, setTaxType] = useState<"normal" | "preferential" | "none">("normal"); // 과세유형

    const [calculated, setCalculated] = useState(false);
    const [shaking, setShaking] = useState(false);
    const [copied, setCopied] = useState(false);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [errorMessage, setErrorMessage] = useState("");

    const n = (v: string) => Number(v.replace(/[^0-9.]/g, ""));
    const formatComma = (raw: string) => raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "").replace(/^0+/, "");
        if (raw.length > 13) return;
        setAmount(raw === "" ? "" : formatComma(raw));
        setCalculated(false);
        if (raw) {
            setErrorMessage("");
            setErrors(prev => {
                const next = new Set(prev);
                next.delete("amount");
                return next;
            });
        }
    };

    const addAmount = (val: number) => {
        const current = n(amount);
        const next = current + val;
        if (next.toString().length > 13) return;
        setAmount(formatComma(next.toString()));
        setCalculated(false);
        setErrors(prev => {
            const nextSet = new Set(prev);
            nextSet.delete("amount");
            setErrorMessage("");
            return nextSet;
        });
    };

    const addTerm = (val: number) => {
        const current = n(term);
        const next = current + val;
        if (next > 999) return;
        setTerm(next.toString());
        setCalculated(false);
        setErrors(prev => {
            const nextSet = new Set(prev);
            nextSet.delete("term");
            setErrorMessage("");
            return nextSet;
        });
    };

    const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        if (raw.length > 3) return;
        setTerm(raw);
        setCalculated(false);
        if (raw) {
            setErrorMessage("");
            setErrors(prev => {
                const next = new Set(prev);
                next.delete("term");
                return next;
            });
        }
    };

    const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let raw = e.target.value.replace(/[^0-9.]/g, "");
        const parts = raw.split(".");
        if (parts.length > 2) raw = parts[0] + "." + parts.slice(1).join("");
        if (parts[1] && parts[1].length > 2) raw = parts[0] + "." + parts[1].substring(0, 2);
        if (n(raw) > 100) raw = "100";
        setRate(raw);
        setCalculated(false);
        if (raw) {
            setErrorMessage("");
            setErrors(prev => {
                const next = new Set(prev);
                next.delete("rate");
                return next;
            });
        }
    };

    const handleReset = () => {
        setAmount("");
        setTerm("");
        setTermUnit("month");
        setRate("");
        setInterestType("simple");
        setTaxType("normal");
        setCalculated(false);
        setErrors(new Set());
        setErrorMessage("");
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
    };

    const handleCalculate = () => {
        const newErrors = new Set<string>();
        if (!amount) newErrors.add("amount");
        if (!term) newErrors.add("term");
        if (!rate) newErrors.add("rate");

        setErrors(newErrors);

        if (newErrors.size > 0) {
            setErrorMessage("필수 항목을 모두 입력해주세요.");
            setCalculated(false);
            setShaking(true);
            setTimeout(() => setShaking(false), 400);
            return;
        }

        setErrorMessage("");
        setCalculated(true);
    };

    // 계산 로직
    const principal = n(amount);
    const annualRate = n(rate) / 100;
    const months = termUnit === "year" ? n(term) * 12 : n(term);

    let preTaxInterest = 0;
    if (interestType === "simple") {
        // 단리: 원금 * 이율 * (기간/12)
        preTaxInterest = principal * annualRate * (months / 12);
    } else {
        // 월복리: 원금 * (1 + 이율/12)^기간 - 원금
        preTaxInterest = principal * Math.pow(1 + annualRate / 12, months) - principal;
    }

    const taxRates = { normal: 0.154, preferential: 0.095, none: 0 };
    const taxRate = taxRates[taxType];
    const taxAmount = Math.floor(preTaxInterest * taxRate);
    const postTaxInterest = Math.floor(preTaxInterest - taxAmount);
    const totalMaturity = principal + postTaxInterest;

    const handleCopy = async () => {
        const text = [
            `[예금 계산 결과]`,
            `예치금액: ${amount}원`,
            `예금기간: ${term}${termUnit === "month" ? "개월" : "년"}`,
            `연이자율: ${rate}% (${interestType === "simple" ? "단리" : "월복리"})`,
            `과세유형: ${taxType === "normal" ? "일반과세(15.4%)" : taxType === "preferential" ? "세금우대(9.5%)" : "비과세"}`,
            `-------------------`,
            `세전이자: ${Math.floor(preTaxInterest).toLocaleString()}원`,
            `이자과세: -${taxAmount.toLocaleString()}원`,
            `세후이자: ${postTaxInterest.toLocaleString()}원`,
            `만기수령액: ${totalMaturity.toLocaleString()}원`
        ].join("\n");
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <div className={`max-w-3xl mx-auto px-4 py-6 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>

                {/* 헤더 배지 */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="flex justify-center items-center gap-2 flex-wrap text-sm">
                        {productName && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full font-bold border border-blue-200 dark:border-blue-800">
                                🏦 {productName}
                            </span>
                        )}
                        <span className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-full font-semibold shadow-sm border border-gray-100 dark:border-gray-700">📊 예금 이자 계산기</span>
                    </div>
                </div>

                {/* 입력 카드 */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 space-y-6">

                    {/* 예치금액 */}
                    <div className="space-y-3">
                        <label htmlFor="deposit-amount" className={`block text-sm font-bold transition-colors ${errors.has("amount") ? "text-red-500" : "text-gray-700 dark:text-gray-200"}`}>예치금액</label>
                        <div className="relative">
                            <input
                                id="deposit-amount"
                                type="text"
                                inputMode="numeric"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="0"
                                className={`w-full h-16 px-5 pr-12 text-2xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl transition-all outline-none text-right dark:text-white ${
                                    errors.has("amount") ? "border-red-500 focus:border-red-500 ring-4 ring-red-500/10" : "border-transparent focus:border-blue-500"
                                }`}
                            />
                            <span className={`absolute right-5 top-1/2 -translate-y-1/2 font-bold ${errors.has("amount") ? "text-red-500" : "text-gray-600"}`}>원</span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {[5, 10, 50, 100, 1000, 10000].map(v => (
                                <button
                                    key={v}
                                    onClick={() => addAmount(v * 10000)}
                                    className="py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all active:scale-95"
                                >
                                    +{v >= 10000 ? `${v / 10000}억원` : v >= 1000 ? `${v / 1000}천만원` : `${v}만원`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* 예금기간 */}
                        <div className="space-y-3">
                            <label htmlFor="deposit-term" className={`block text-sm font-bold transition-colors ${errors.has("term") ? "text-red-500" : "text-gray-700 dark:text-gray-200"}`}>예금기간</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        id="deposit-term"
                                        type="text"
                                        inputMode="numeric"
                                        value={term}
                                        onChange={handleTermChange}
                                        placeholder="0"
                                        className={`w-full h-14 px-4 pr-12 text-xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl transition-all outline-none text-right dark:text-white ${
                                            errors.has("term") ? "border-red-500 focus:border-red-500 ring-4 ring-red-500/10" : "border-transparent focus:border-blue-500"
                                        }`}
                                    />
                                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-bold ${errors.has("term") ? "text-red-500" : "text-gray-600"}`}>
                                        {termUnit === "month" ? "개월" : "년"}
                                    </span>
                                </div>
                                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-2xl shrink-0">
                                    <button
                                        onClick={() => setTermUnit("month")}
                                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${termUnit === "month" ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
                                    >
                                        월
                                    </button>
                                    <button
                                        onClick={() => setTermUnit("year")}
                                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${termUnit === "year" ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
                                    >
                                        년
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[6, 12, 24, 36].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => { setTermUnit("month"); addTerm(v); }}
                                        className="py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300 rounded-xl transition-all active:scale-95"
                                    >
                                        {v}개월
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 연이자율 */}
                        <div className="space-y-3">
                            <label htmlFor="deposit-rate" className={`block text-sm font-bold transition-colors ${errors.has("rate") ? "text-red-500" : "text-gray-700 dark:text-gray-200"}`}>연이자율</label>
                            <div className="relative">
                                <input
                                    id="deposit-rate"
                                    type="text"
                                    inputMode="decimal"
                                    value={rate}
                                    onChange={handleRateChange}
                                    placeholder="0.0"
                                    className={`w-full h-14 px-4 pr-12 text-xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl transition-all outline-none text-right dark:text-white ${
                                        errors.has("rate") ? "border-red-500 focus:border-red-500 ring-4 ring-red-500/10" : "border-transparent focus:border-blue-500"
                                    }`}
                                />
                                <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-bold ${errors.has("rate") ? "text-red-500" : "text-gray-600"}`}>%</span>
                            </div>
                            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-2xl">
                                <button
                                    onClick={() => setInterestType("simple")}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${interestType === "simple" ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
                                >
                                    단리
                                </button>
                                <button
                                    onClick={() => setInterestType("compound")}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${interestType === "compound" ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
                                >
                                    월복리
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 이자 과세 유형 */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">이자 과세</label>
                        <div className="flex bg-gray-100 dark:bg-gray-700 p-1.5 rounded-2xl gap-1">
                            {[
                                { id: "normal", label: "일반과세 (15.4%)" },
                                { id: "preferential", label: "세금우대 (9.5%)" },
                                { id: "none", label: "비과세 (0%)" }
                            ].map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setTaxType(t.id as any)}
                                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${taxType === t.id ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 제어 버튼 */}
                    <div className="space-y-3 pt-4">
                        <div className="flex gap-3">
                            <button
                                onClick={handleReset}
                                className={`flex-1 h-14 border-2 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all active:scale-95 ${shaking ? "animate-shake" : ""}`}
                            >
                                초기화
                            </button>
                            <button
                                onClick={handleCalculate}
                                className="flex-[2] h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                            >
                                계산하기
                            </button>
                        </div>
                        {errorMessage && (
                            <p className="text-center text-red-500 text-sm font-bold flex items-center justify-center gap-1 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {errorMessage}
                            </p>
                        )}
                    </div>
                </div>

                {/* 결과 영역 */}
                {calculated && (
                    <div className={`mt-8 space-y-4 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>

                        {/* 메인 결과 카드 */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>

                            <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">만기 시 실제로 받는 금액</p>
                            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 break-all">
                                {totalMaturity.toLocaleString()}
                                <span className="text-2xl ml-1 text-gray-600 dark:text-gray-400">원</span>
                            </h2>

                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100 dark:border-gray-700/50">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400">원금 합계</p>
                                    <p className="text-lg font-bold text-gray-700 dark:text-gray-200">{principal.toLocaleString()}원</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">세후 이자</p>
                                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">+{postTaxInterest.toLocaleString()}원</p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">세전 이자</span>
                                    <span className="text-gray-800 dark:text-gray-200 font-bold">{Math.floor(preTaxInterest).toLocaleString()}원</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">이자 과세 ({taxRate * 100}%)</span>
                                    <span className="text-red-500 dark:text-red-400 font-bold">-{taxAmount.toLocaleString()}원</span>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={handleCopy}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 ${copied ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                                >
                                    {copied ? (
                                        <><span className="text-lg">✅</span> 복사되었습니다</>
                                    ) : (
                                        <><span className="text-lg">📋</span> 결과 복사하기</>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* 비중 차트 카드 */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                만기 수령액 상세 구성
                            </h3>

                            <div className="flex flex-col md:flex-row items-center justify-around gap-12">
                                {/* 도넛 차트 */}
                                <div className="relative w-48 h-48">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <circle
                                            cx="18" cy="18" r="15.915"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="3.5"
                                            className="text-gray-100 dark:text-gray-700"
                                        />
                                        <circle
                                            cx="18" cy="18" r="15.915"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="3.5"
                                            strokeDasharray={`${(principal / totalMaturity) * 100} ${100 - (principal / totalMaturity) * 100}`}
                                            className="text-blue-500 transition-all duration-1000 ease-out"
                                        />
                                        <circle
                                            cx="18" cy="18" r="15.915"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="3.5"
                                            strokeDasharray={`${(postTaxInterest / totalMaturity) * 100} ${100 - (postTaxInterest / totalMaturity) * 100}`}
                                            strokeDashoffset={`-${(principal / totalMaturity) * 100}`}
                                            className="text-indigo-400 dark:text-indigo-500 transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">이자 비중</p>
                                        <p className="text-2xl font-black text-indigo-500 leading-none">{((postTaxInterest / totalMaturity) * 100).toFixed(1)}%</p>
                                    </div>
                                </div>

                                {/* 범례 */}
                                <div className="space-y-5 w-full max-w-[200px]">
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/30"></div>
                                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">총 원금</span>
                                        </div>
                                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">{((principal / totalMaturity) * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-indigo-400 dark:bg-indigo-500 shadow-sm shadow-indigo-500/30"></div>
                                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">세후 이자</span>
                                        </div>
                                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">{((postTaxInterest / totalMaturity) * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-50 dark:border-gray-700/50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xl">💡</span>
                                            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">투자 분석</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                            만기 시 원금 대비 <span className="text-indigo-500 font-bold">{((postTaxInterest / principal) * 100).toFixed(2)}%</span>의 이자 수익이 발생합니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <InstallBanner />
            </div>
        </div>
    );
};

export default Deposits;
