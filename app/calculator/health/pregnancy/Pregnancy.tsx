"use client";

import { useState } from "react";
import InstallBanner from "@/app/calculator/components/InstallBanner";

type CalcType = "A" | "B" | "C";

export default function Pregnancy() {
    const [calcType, setCalcType] = useState<CalcType>("A");

    // Inputs
    const [lastPeriod, setLastPeriod] = useState<string>("");
    
    // For type B
    const [refDate, setRefDate] = useState<string>("");
    const [inputWeeks, setInputWeeks] = useState<number>(0);
    const [inputDays, setInputDays] = useState<number>(0);
    
    // For type C
    const [expectedDueDate, setExpectedDueDate] = useState<string>("");

    const [resultDueDate, setResultDueDate] = useState<string | null>(null);
    const [resultCurrentWeeks, setResultCurrentWeeks] = useState<number>(0);
    const [resultCurrentDays, setResultCurrentDays] = useState<number>(0);
    const [resultProgress, setResultProgress] = useState<number>(0);
    const [resultTrimester, setResultTrimester] = useState<string>("");
    const [resultDDay, setResultDDay] = useState<number>(0);

    const [isShaking, setIsShaking] = useState(false);

    const handleCalculate = () => {
        let day1: Date | null = null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (calcType === "A") {
            if (!lastPeriod) return;
            day1 = new Date(lastPeriod);
            if (isNaN(day1.getTime())) return;
        } else if (calcType === "B") {
            if (!refDate) return;
            const ref = new Date(refDate);
            if (isNaN(ref.getTime())) return;
            const diffDays = (inputWeeks * 7) + inputDays;
            day1 = new Date(ref.getTime());
            day1.setDate(day1.getDate() - diffDays);
        } else if (calcType === "C") {
            if (!expectedDueDate) return;
            const due = new Date(expectedDueDate);
            if (isNaN(due.getTime())) return;
            day1 = new Date(due.getTime());
            day1.setDate(day1.getDate() - 280);
        }

        if (day1) {
            // Due date is 280 days from day1
            const dueDate = new Date(day1.getTime());
            dueDate.setDate(dueDate.getDate() + 280);

            // Current elapsed days
            const diffTime = today.getTime() - day1.getTime();
            let elapsedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (elapsedDays < 0) elapsedDays = 0;
            if (elapsedDays > 290) elapsedDays = 290; // Exceeds slightly is fine, but cap it.

            const currentW = Math.floor(elapsedDays / 7);
            const currentD = elapsedDays % 7;
            const progress = (elapsedDays / 280) * 100;

            const dueDiffTime = dueDate.getTime() - today.getTime();
            const dDay = Math.ceil(dueDiffTime / (1000 * 60 * 60 * 24));

            let trimester = "";
            if (currentW < 14) trimester = "임신 초기 (1분기)";
            else if (currentW < 28) trimester = "임신 중기 (2분기)";
            else trimester = "임신 후기 (3분기)";

            const formatDate = (d: Date) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

            setResultDueDate(formatDate(dueDate));
            setResultCurrentWeeks(currentW);
            setResultCurrentDays(currentD);
            setResultProgress(Math.min(100, Math.max(0, progress)));
            setResultDDay(dDay);
            setResultTrimester(trimester);
        }
    };

    const handleReset = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setLastPeriod("");
        setRefDate("");
        setInputWeeks(0);
        setInputDays(0);
        setExpectedDueDate("");
        setResultDueDate(null);
    };

    const handleCopy = () => {
        if (resultDueDate) {
            const text = `출산 예정일: ${resultDueDate}\n현재 임신기간: ${resultCurrentWeeks}주 ${resultCurrentDays}일차 (${resultTrimester})\n진행률: ${resultProgress.toFixed(1)}%`;
            navigator.clipboard.writeText(text);
            alert("복사되었습니다.");
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
            {/* 헤더 섹션 */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex justify-center flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
                        👶 임신주수 계산기
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="space-y-6">
                    {/* 탭 헤더 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button onClick={() => setCalcType("A")} className={`py-3 px-2 rounded-xl text-sm font-bold transition-colors ${calcType === "A" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>마지막 생리일 기준</button>
                        <button onClick={() => setCalcType("B")} className={`py-3 px-2 rounded-xl text-sm font-bold transition-colors ${calcType === "B" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>초음파 주수 기준</button>
                        <button onClick={() => setCalcType("C")} className={`py-3 px-2 rounded-xl text-sm font-bold transition-colors ${calcType === "C" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>출산 예정일 기준</button>
                    </div>

                    <div className="pt-2">
                        {calcType === "A" && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">마지막 생리 시작일</label>
                                <input type="date" className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-100" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} />
                            </div>
                        )}
                        {calcType === "B" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">초음파 기준 날짜</label>
                                    <input type="date" className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-100" value={refDate} onChange={(e) => setRefDate(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">진단 주수 (주)</label>
                                        <input type="number" className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-100" placeholder="0" value={inputWeeks || ""} onChange={(e) => setInputWeeks(parseInt(e.target.value) || 0)} min="0" max="42" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">진단 일수 (일)</label>
                                        <input type="number" className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-100" placeholder="0" value={inputDays || ""} onChange={(e) => setInputDays(parseInt(e.target.value) || 0)} min="0" max="6" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {calcType === "C" && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">출산 예정일</label>
                                <input type="date" className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-gray-100" value={expectedDueDate} onChange={(e) => setExpectedDueDate(e.target.value)} />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button onClick={handleReset} className={`flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-colors ${isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""}`}>초기화</button>
                        <button onClick={handleCalculate} className="flex-[2] py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors shadow-sm">계산하기</button>
                    </div>

                    {resultDueDate && (
                        <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
                            
                            <div className="flex flex-col items-center justify-center mb-6">
                                <span className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-1">우리 아기 만나는 날 👶</span>
                                <span className="text-2xl font-black text-purple-700 dark:text-purple-400">{resultDueDate}</span>
                                <span className="mt-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-purple-700 dark:text-purple-300 font-bold text-sm shadow-sm border border-purple-100 dark:border-purple-800">
                                    {resultDDay > 0 ? `D-${resultDDay}` : resultDDay === 0 ? "D-Day (오늘)" : `D+${Math.abs(resultDDay)} (예정일 지남)`}
                                </span>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <p className="text-center text-gray-500 dark:text-gray-400 text-xs mb-1">오늘 기준 진행 상황</p>
                                <p className="text-center font-bold text-lg text-gray-800 dark:text-gray-100 mb-3 text-purple-600 dark:text-purple-400">
                                    {resultCurrentWeeks}주 {resultCurrentDays}일차 ({resultTrimester})
                                </p>
                                
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2 overflow-hidden">
                                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-4 rounded-full transition-all duration-1000 ease-out" style={{ width: `${resultProgress}%` }}></div>
                                </div>
                                <p className="text-right text-xs font-bold text-purple-600 dark:text-purple-400">{resultProgress.toFixed(1)}%</p>
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 text-center">
                                * 초음파 진단과 생리학적 편차가 있을 수 있습니다.
                            </p>

                            <button onClick={handleCopy} className="w-full py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-bold rounded-xl border border-purple-200 dark:border-purple-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">결과 복사하기</button>
                        </div>
                    )}
                </div>
            </div>
            <InstallBanner />
        </div>
    );
}
