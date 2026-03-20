"use client";

import { useState, useRef, useEffect } from "react";
import { ANIMATION } from "@/app/config/animationConfig";

interface LoansProps {
    productName?: string;
}

const Loans = ({ productName }: LoansProps) => {
    const [loanAmount, setLoanAmount] = useState(""); // 대출 금액
    const [loanTerm, setLoanTerm] = useState(""); // 대출 기간
    const [termUnit, setTermUnit] = useState<"month" | "year">("year");
    const [interestRate, setInterestRate] = useState(""); // 연 이자율
    const [repaymentMethod, setRepaymentMethod] = useState<"pmt" | "ppmt" | "bullet">("pmt"); // 원리금균등, 원금균등, 만기일시
    const [defermentPeriod, setDefermentPeriod] = useState("0"); // 거치 기간

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
        setLoanAmount(raw === "" ? "" : formatComma(raw));
        setCalculated(false);
        if (raw) {
            setErrorMessage("");
            setErrors(prev => {
                const next = new Set(prev);
                next.delete("loanAmount");
                return next;
            });
        }
    };

    const addAmount = (val: number) => {
        const current = n(loanAmount);
        const next = current + val;
        if (next.toString().length > 13) return;
        setLoanAmount(formatComma(next.toString()));
        setCalculated(false);
        setErrors(prev => {
            const nextSet = new Set(prev);
            nextSet.delete("loanAmount");
            return nextSet;
        });
    };

    const addTerm = (val: number) => {
        const current = termUnit === "month" ? n(loanTerm) : n(loanTerm) * 12;
        const next = current + val;
        setLoanTerm(next.toString());
        setCalculated(false);
        setErrors(prev => {
            const nextSet = new Set(prev);
            nextSet.delete("loanTerm");
            setErrorMessage("");
            return nextSet;
        });
    };

    const handleReset = () => {
        setLoanAmount("");
        setLoanTerm("");
        setTermUnit("year");
        setInterestRate("");
        setRepaymentMethod("pmt");
        setDefermentPeriod("0");
        setCalculated(false);
        setErrors(new Set());
        setErrorMessage("");
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
    };

    const handleCalculate = () => {
        const newErrors = new Set<string>();
        if (!loanAmount) newErrors.add("loanAmount");
        if (!loanTerm) newErrors.add("loanTerm");
        if (!interestRate) newErrors.add("interestRate");

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

    // 대출 계산 로직
    const principal = n(loanAmount);
    const annualRate = n(interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = termUnit === "year" ? n(loanTerm) * 12 : n(loanTerm);
    const deferMonths = n(defermentPeriod);
    const repaymentMonths = totalMonths - deferMonths;

    const schedule = [];
    let remainingPrincipal = principal;
    let totalInterest = 0;
    let firstMonthPayment = 0;

    if (totalMonths > 0 && repaymentMonths >= 0) {
        for (let i = 1; i <= totalMonths; i++) {
            let interest = Math.floor(remainingPrincipal * monthlyRate);
            let principalRepayment = 0;
            let monthlyPayment = 0;

            if (i <= deferMonths) {
                // 거치 기간: 이자만 납부
                monthlyPayment = interest;
            } else {
                if (repaymentMethod === "pmt") {
                    // 원리금균등: [원금 * r * (1+r)^n] / [(1+r)^n - 1]
                    monthlyPayment = Math.round(principal * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths) / (Math.pow(1 + monthlyRate, repaymentMonths) - 1));
                    interest = Math.floor(remainingPrincipal * monthlyRate);
                    principalRepayment = monthlyPayment - interest;
                } else if (repaymentMethod === "ppmt") {
                    // 원금균등: (원금 / n) + (잔액 * r)
                    principalRepayment = Math.floor(principal / repaymentMonths);
                    interest = Math.floor(remainingPrincipal * monthlyRate);
                    monthlyPayment = principalRepayment + interest;
                } else {
                    // 만기일시: 기간 내내 이자만, 마지막에 원금 상환
                    interest = Math.floor(remainingPrincipal * monthlyRate);
                    principalRepayment = (i === totalMonths) ? remainingPrincipal : 0;
                    monthlyPayment = principalRepayment + interest;
                }
            }

            if (i === totalMonths && repaymentMethod !== "bullet") {
                // 마지막 회차 오차 조정 (원금균등 등에서)
                if (repaymentMethod === "ppmt") {
                    principalRepayment = remainingPrincipal;
                    monthlyPayment = principalRepayment + interest;
                }
            }

            remainingPrincipal -= principalRepayment;
            totalInterest += interest;
            if (i === 1) firstMonthPayment = monthlyPayment;

            if (i <= 12 || i === totalMonths) { // 리스트 표시용 샘플링
                schedule.push({ month: i, payment: monthlyPayment, principal: principalRepayment, interest, remaining: Math.max(0, remainingPrincipal) });
            }
        }
    }

    const totalRepayment = principal + totalInterest;

    const handleCopy = async () => {
        const text = [
            `[대출 계산 결과]`,
            `대출금액: ${loanAmount}원`,
            `대출기간: ${loanTerm}${termUnit === "year" ? "년" : "개월"}`,
            `연이자율: ${interestRate}%`,
            `상환방식: ${repaymentMethod === "pmt" ? "원리금균등" : repaymentMethod === "ppmt" ? "원금균등" : "만기일시상환"}`,
            `거치기간: ${defermentPeriod}개월`,
            `-------------------`,
            `총 상환금액: ${totalRepayment.toLocaleString()}원`,
            `총 대출이자: ${totalInterest.toLocaleString()}원`,
            `1회차 상환액: ${firstMonthPayment.toLocaleString()}원`
        ].join("\n");
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <div className={`max-w-3xl mx-auto px-4 py-6 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>

                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="flex justify-center items-center gap-2 flex-wrap text-sm">
                        {productName && (
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 rounded-full font-bold border border-amber-200 dark:border-amber-800">
                                💰 {productName}
                            </span>
                        )}
                        <span className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-full font-semibold shadow-sm border border-gray-100 dark:border-gray-700">📊 대출 이자 계산기</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 space-y-6">
                    <div className="space-y-3">
                        <label htmlFor="loan-amount" className={`block text-sm font-bold transition-colors ${errors.has("loanAmount") ? "text-red-500" : "text-gray-700 dark:text-gray-200"}`}>대출 금액</label>
                        <div className="relative">
                            <input
                                id="loan-amount"
                                type="text"
                                inputMode="numeric"
                                value={loanAmount}
                                onChange={handleAmountChange}
                                placeholder="0"
                                className={`w-full h-16 px-5 pr-12 text-2xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl transition-all outline-none text-right dark:text-white ${
                                    errors.has("loanAmount") ? "border-red-500 focus:border-red-500 ring-4 ring-red-500/10" : "border-transparent focus:border-amber-500"
                                }`}
                            />
                            <span className={`absolute right-5 top-1/2 -translate-y-1/2 font-bold ${errors.has("loanAmount") ? "text-red-500" : "text-gray-600"}`}>원</span>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {[100, 1000, 5000, 10000, 50000, 100000].map(v => (
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
                        <div className="space-y-3">
                            <label htmlFor="loan-term" className={`block text-sm font-bold transition-colors ${errors.has("loanTerm") ? "text-red-500" : "text-gray-700 dark:text-gray-200"}`}>대출 기간</label>
                            <div className="flex gap-2">
                                <input
                                    id="loan-term"
                                    type="text"
                                    inputMode="numeric"
                                    value={loanTerm}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, "");
                                        setLoanTerm(val);
                                        setCalculated(false);
                                        if (val) setErrors(prev => { const next = new Set(prev); next.delete("loanTerm"); return next; });
                                    }}
                                    placeholder="0"
                                    className={`w-full h-14 px-4 pr-12 text-xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl transition-all outline-none text-right dark:text-white ${
                                        errors.has("loanTerm") ? "border-red-500 focus:border-red-500 ring-4 ring-red-500/10" : "border-transparent focus:border-amber-500"
                                    }`}
                                />
                                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-2xl shrink-0">
                                    {["month", "year"].map((u) => (
                                        <button
                                            key={u}
                                            onClick={() => setTermUnit(u as any)}
                                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${termUnit === u ? "bg-white dark:bg-gray-600 text-amber-600 dark:text-amber-400 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
                                        >
                                            {u === "month" ? "월" : "년"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                                {[6, 12, 24, 36].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => { setTermUnit("month"); addTerm(v); }}
                                        className="py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-amber-50 dark:hover:bg-amber-900/30 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl transition-all active:scale-95"
                                    >
                                        {v}개월
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="loan-rate" className={`block text-sm font-bold transition-colors ${errors.has("interestRate") ? "text-red-500" : "text-gray-700 dark:text-gray-200"}`}>연 이자율</label>
                            <div className="relative">
                                <input
                                    id="loan-rate"
                                    type="text"
                                    inputMode="decimal"
                                    value={interestRate}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9.]/g, "");
                                        setInterestRate(val);
                                        setCalculated(false);
                                        if (val) {
                                            setErrorMessage("");
                                            setErrors(prev => { const next = new Set(prev); next.delete("interestRate"); return next; });
                                        }
                                    }}
                                    placeholder="0.0"
                                    className={`w-full h-14 px-4 pr-12 text-xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl transition-all outline-none text-right dark:text-white ${
                                        errors.has("interestRate") ? "border-red-500 focus:border-red-500 ring-4 ring-red-500/10" : "border-transparent focus:border-amber-500"
                                    }`}
                                />
                                <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-bold ${errors.has("interestRate") ? "text-red-500" : "text-gray-600"}`}>%</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">상환 방식</label>
                        <div className="flex bg-gray-100 dark:bg-gray-700 p-1.5 rounded-2xl gap-1">
                            {[
                                { id: "pmt", label: "원리금균등" },
                                { id: "ppmt", label: "원금균등" },
                                { id: "bullet", label: "만기일시" }
                            ].map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setRepaymentMethod(t.id as any)}
                                    className={`flex-1 py-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${repaymentMethod === t.id ? "bg-white dark:bg-gray-600 text-amber-600 dark:text-amber-400 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="loan-defer" className="block text-sm font-bold text-gray-700 dark:text-gray-200 flex justify-between">
                            거치 기간
                            <span className="text-[10px] font-normal text-gray-500 dark:text-gray-400 mt-0.5">(이자만 납부하는 기간)</span>
                        </label>
                        <div className="relative">
                            <input
                                id="loan-defer"
                                type="text"
                                inputMode="numeric"
                                value={defermentPeriod}
                                onChange={(e) => { setDefermentPeriod(e.target.value.replace(/[^0-9]/g, "")); setCalculated(false); }}
                                className="w-full h-12 px-4 pr-12 text-lg font-bold bg-gray-50 dark:bg-gray-900/50 border-2 border-transparent focus:border-amber-500 rounded-2xl transition-all outline-none text-right dark:text-white"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-600 dark:text-gray-400 text-sm">개월</span>
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
                                className="flex-[2] h-14 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
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

                {calculated && (
                    <div className={`mt-8 space-y-6 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>

                            <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">총 상환 금액 (원금+이자)</p>
                            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 break-all">
                                {totalRepayment.toLocaleString()}
                                <span className="text-2xl ml-1 text-gray-600 dark:text-gray-400">원</span>
                            </h2>

                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100 dark:border-gray-700/50">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400">총 대출 이자</p>
                                    <p className="text-lg font-bold text-red-500 dark:text-red-400">{totalInterest.toLocaleString()}원</p>
                                </div>
                                <div className="space-y-1 border-l border-gray-100 dark:border-gray-700/50">
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400">1회차 상환액</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{firstMonthPayment.toLocaleString()}원</p>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={handleCopy}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 ${copied ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                                >
                                    {copied ? "✅ 복사되었습니다" : "📋 결과 복사하기"}
                                </button>
                            </div>
                        </div>

                        {/* 비중 차트 카드 추가 */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50">
                            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-8 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                총 상환금액 구성 비중
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
                                            strokeDasharray={`${(principal / totalRepayment) * 100} ${100 - (principal / totalRepayment) * 100}`}
                                            className="text-amber-500 transition-all duration-1000 ease-out"
                                        />
                                        <circle
                                            cx="18" cy="18" r="15.915"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="3.5"
                                            strokeDasharray={`${(totalInterest / totalRepayment) * 100} ${100 - (totalInterest / totalRepayment) * 100}`}
                                            strokeDashoffset={`-${(principal / totalRepayment) * 100}`}
                                            className="text-red-400 dark:text-red-500 transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tighter">이자 비중</p>
                                        <p className="text-2xl font-black text-red-500 leading-none">{((totalInterest / totalRepayment) * 100).toFixed(1)}%</p>
                                    </div>
                                </div>

                                {/* 범례 */}
                                <div className="space-y-5 w-full max-w-[200px]">
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/30"></div>
                                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">대출 원금</span>
                                        </div>
                                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">{((principal / totalRepayment) * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500 shadow-sm shadow-red-500/30"></div>
                                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">총 이자</span>
                                        </div>
                                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">{((totalInterest / totalRepayment) * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-50 dark:border-gray-700/50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xl">⚠️</span>
                                            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">금융 비용 분석</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                            대출 원금 대비 약 <span className="text-red-500 font-bold">{((totalInterest / principal) * 100).toFixed(2)}%</span>의 추가 이자 비용이 발생합니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50">
                            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                대출 상환 상세 (주요 회차)
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-[11px] sm:text-xs text-left border-collapse">
                                    <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                                        <th className="p-3 pr-1 sm:pr-3 w-10 sm:w-14 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-500 text-left whitespace-nowrap">회차</th>
                                        <th className="p-3 pl-1 sm:pl-3 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-500 text-right">상환액</th>
                                        <th className="p-3 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-500 text-right">원금</th>
                                        <th className="p-3 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-500 text-right">이자</th>
                                        <th className="p-3 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-500 text-right">잔액</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {schedule.map((row) => (
                                        <tr key={row.month} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                                            <td className="p-3 pr-1 sm:pr-3 border-b border-gray-50 dark:border-gray-700/50 text-gray-500 dark:text-gray-400 whitespace-nowrap">{row.month}회</td>
                                            <td className="p-3 pl-1 sm:pl-3 border-b border-gray-50 dark:border-gray-700/50 text-right font-bold text-gray-700 dark:text-gray-300">{row.payment.toLocaleString()}</td>
                                            <td className="p-3 border-b border-gray-50 dark:border-gray-700/50 text-right text-gray-700 dark:text-gray-200">{row.principal.toLocaleString()}</td>
                                            <td className="p-3 border-b border-gray-50 dark:border-gray-700/50 text-right text-amber-600/80">{row.interest.toLocaleString()}</td>
                                            <td className="p-3 border-b border-gray-50 dark:border-gray-700/50 text-right text-gray-500 dark:text-gray-400">{row.remaining.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-4 text-center">* 1~12회차 및 최종회차 요약 정보입니다.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Loans;
