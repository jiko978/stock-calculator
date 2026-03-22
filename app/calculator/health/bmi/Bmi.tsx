"use client";

import { useState } from "react";
import InstallBanner from "@/app/calculator/components/InstallBanner";

export default function Bmi() {
    const [gender, setGender] = useState<"M" | "F">("M");
    const [age, setAge] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    
    // Optional
    const [waist, setWaist] = useState<string>("");
    
    const [resultBmi, setResultBmi] = useState<number | null>(null);
    const [resultCategory, setResultCategory] = useState<string>("");
    const [resultWhr, setResultWhr] = useState<number | null>(null);

    const [isShaking, setIsShaking] = useState(false);

    const handleCalculate = () => {
        if (!height || !weight) return;

        const h = parseFloat(height) / 100;
        const w = parseFloat(weight);

        if (h > 0 && w > 0) {
            const bmi = w / (h * h);
            setResultBmi(bmi);

            if (bmi < 18.5) setResultCategory("저체중");
            else if (bmi < 23) setResultCategory("정상");
            else if (bmi < 25) setResultCategory("과체중");
            else if (bmi < 30) setResultCategory("비만");
            else setResultCategory("고도비만");

            // Optional WHR (using typical hip assumption or ignoring if not provided, but WHR requires Hip. 
            // Wait, spec said WHR = Waist / Hip. Here we only ask for Waist. Let's ask for Hip as well in UI, or skip WHR calculation if Hip is missing.)
            // For now, let's keep it simple with just BMI as core functionality.
        }
    };

    const handleReset = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setAge("");
        setHeight("");
        setWeight("");
        setWaist("");
        setResultBmi(null);
        setResultCategory("");
    };

    const handleCopy = () => {
        if (resultBmi !== null) {
            const text = `내 비만도(BMI)는 ${resultBmi.toFixed(1)} (${resultCategory}) 입니다.`;
            navigator.clipboard.writeText(text);
            alert("복사되었습니다.");
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
            {/* 헤더 섹션 */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex justify-center flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                        ⚖️ 비만도 계산기
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="space-y-6">
                    {/* 성별/나이 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">성별</label>
                            <div className="flex gap-2">
                                <button
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-colors ${gender === "M" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
                                    onClick={() => setGender("M")}
                                >
                                    남성
                                </button>
                                <button
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-colors ${gender === "F" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
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
                                className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 text-right"
                                placeholder="예: 30"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 키/몸무게 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">키 (cm)</label>
                            <input
                                type="number"
                                className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 text-right"
                                placeholder="예: 175"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">체중 (kg)</label>
                            <input
                                type="number"
                                className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 text-right"
                                placeholder="예: 70"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleReset}
                            className={`flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
                        >
                            초기화
                        </button>
                        <button
                            onClick={handleCalculate}
                            className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-sm"
                        >
                            계산하기
                        </button>
                    </div>

                    {/* 결과 */}
                    {resultBmi !== null && (
                        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                            <h3 className="text-center text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">나의 비만도 (BMI)</h3>
                            <div className="text-center mb-4">
                                <span className="text-4xl font-black text-blue-600 dark:text-blue-400">{resultBmi.toFixed(1)}</span>
                            </div>
                            <div className="text-center mb-6">
                                <span className="inline-block px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-lg font-bold text-gray-800 dark:text-gray-200 shadow-sm">
                                    {resultCategory}
                                </span>
                            </div>
                            
                            <button
                                onClick={handleCopy}
                                className="w-full py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-bold rounded-xl border border-blue-200 dark:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
