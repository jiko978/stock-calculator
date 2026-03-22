"use client";

import { useState } from "react";
import InstallBanner from "@/app/calculator/components/InstallBanner";

export default function Bmr() {
    const [gender, setGender] = useState<"M" | "F">("M");
    const [age, setAge] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [resultBmr, setResultBmr] = useState<number | null>(null);
    const [isShaking, setIsShaking] = useState(false);

    const handleCalculate = () => {
        if (!age || !height || !weight) return;

        const a = parseInt(age);
        const h = parseFloat(height);
        const w = parseFloat(weight);

        if (a > 0 && h > 0 && w > 0) {
            // 미플린-세인트 주어(Mifflin-St Jeor) 공식
            let bmr = (10 * w) + (6.25 * h) - (5 * a);
            if (gender === "M") {
                bmr += 5;
            } else {
                bmr -= 161;
            }
            setResultBmr(Math.round(bmr));
        }
    };

    const handleReset = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setAge("");
        setHeight("");
        setWeight("");
        setResultBmr(null);
    };

    const handleCopy = () => {
        if (resultBmr !== null) {
            const text = `내 기초대사량(BMR)은 ${resultBmr.toLocaleString()} kcal 입니다.`;
            navigator.clipboard.writeText(text);
            alert("복사되었습니다.");
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
            {/* 헤더 섹션 */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex justify-center flex-wrap gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                        🔥 기초대사량 계산기
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">성별</label>
                            <div className="flex gap-2">
                                <button
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-colors ${gender === "M" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
                                    onClick={() => setGender("M")}
                                >
                                    남성
                                </button>
                                <button
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-colors ${gender === "F" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
                                    onClick={() => setGender("F")}
                                >
                                    여성
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">나이 (만)</label>
                            <input
                                type="number"
                                className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-red-500 dark:text-gray-100 text-right"
                                placeholder="예: 30"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">키 (cm)</label>
                            <input
                                type="number"
                                className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-red-500 dark:text-gray-100 text-right"
                                placeholder="예: 175"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">체중 (kg)</label>
                            <input
                                type="number"
                                className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-red-500 dark:text-gray-100 text-right"
                                placeholder="예: 70"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleReset}
                            className={`flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
                        >
                            초기화
                        </button>
                        <button
                            onClick={handleCalculate}
                            className="flex-[2] py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-sm"
                        >
                            계산하기
                        </button>
                    </div>

                    {resultBmr !== null && (
                        <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800">
                            <h3 className="text-center text-sm font-semibold text-red-800 dark:text-red-300 mb-2">하루 기초대사량 (BMR)</h3>
                            <div className="text-center mb-6">
                                <span className="text-4xl font-black text-red-600 dark:text-red-400">{resultBmr.toLocaleString()}</span>
                                <span className="text-lg font-bold text-red-800 dark:text-red-300 ml-2">kcal</span>
                            </div>
                            
                            <button
                                onClick={handleCopy}
                                className="w-full py-3 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 font-bold rounded-xl border border-red-200 dark:border-red-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                결과 복사하기
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            <InstallBanner />
        </div>
    );
}
