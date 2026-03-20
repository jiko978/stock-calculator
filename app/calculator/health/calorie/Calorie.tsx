"use client";

import { useState } from "react";
import InstallBanner from "@/app/calculator/components/InstallBanner";

const ACTIVITY_LEVELS = [
    { id: 1.2, label: "활동 안 함", desc: "앉아서 주로 생활, 운동 거의 안 함" },
    { id: 1.375, label: "가벼운 활동", desc: "주 1~3회 가벼운 운동" },
    { id: 1.55, label: "보통 수준", desc: "주 3~5회 적당한 운동" },
    { id: 1.725, label: "활동적", desc: "주 6~7회 강도 높은 운동" },
    { id: 1.9, label: "매우 활동적", desc: "매일 고강도 운동 및 체력 소모가 큰 직업" }
];

export default function Calorie() {
    const [gender, setGender] = useState<"M" | "F">("M");
    const [age, setAge] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [activity, setActivity] = useState<number>(1.2);

    const [resultTdee, setResultTdee] = useState<number | null>(null);
    const [isShaking, setIsShaking] = useState(false);

    const handleCalculate = () => {
        if (!age || !height || !weight) return;
        const a = parseInt(age);
        const h = parseFloat(height);
        const w = parseFloat(weight);

        if (a > 0 && h > 0 && w > 0) {
            let bmr = (10 * w) + (6.25 * h) - (5 * a);
            if (gender === "M") bmr += 5;
            else bmr -= 161;

            const tdee = bmr * activity;
            setResultTdee(Math.round(tdee));
        }
    };

    const handleReset = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setAge("");
        setHeight("");
        setWeight("");
        setActivity(1.2);
        setResultTdee(null);
    };

    const handleCopy = () => {
        if (resultTdee !== null) {
            const text = `나의 하루 권장 칼로리(TDEE)는 ${resultTdee.toLocaleString()} kcal 입니다.`;
            navigator.clipboard.writeText(text);
            alert("복사되었습니다.");
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">성별</label>
                            <div className="flex gap-2">
                                <button className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-colors ${gender === "M" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`} onClick={() => setGender("M")}>남성</button>
                                <button className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-colors ${gender === "F" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`} onClick={() => setGender("F")}>여성</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">나이 (만)</label>
                            <input type="number" className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 dark:text-gray-100 text-right" placeholder="예: 30" value={age} onChange={(e) => setAge(e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">키 (cm)</label>
                            <input type="number" className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 dark:text-gray-100 text-right" placeholder="예: 175" value={height} onChange={(e) => setHeight(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">체중 (kg)</label>
                            <input type="number" className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 dark:text-gray-100 text-right" placeholder="예: 70" value={weight} onChange={(e) => setWeight(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">평소 활동량</label>
                        <select 
                            className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 dark:text-gray-100"
                            value={activity}
                            onChange={(e) => setActivity(parseFloat(e.target.value))}
                        >
                            {ACTIVITY_LEVELS.map(level => (
                                <option key={level.id} value={level.id}>{level.label} - {level.desc}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button onClick={handleReset} className={`flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-colors ${isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""}`}>초기화</button>
                        <button onClick={handleCalculate} className="flex-[2] py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors shadow-sm">계산하기</button>
                    </div>

                    {resultTdee !== null && (
                        <div className="mt-8 p-6 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800">
                            <h3 className="text-center text-sm font-semibold text-orange-800 dark:text-orange-300 mb-2">나의 하루 권장 칼로리 (유지 칼로리)</h3>
                            <div className="text-center mb-6">
                                <span className="text-4xl font-black text-orange-600 dark:text-orange-400">{resultTdee.toLocaleString()}</span>
                                <span className="text-lg font-bold text-orange-800 dark:text-orange-300 ml-2">kcal</span>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl mb-6 shadow-sm border border-gray-100 dark:border-gray-700 text-sm text-center">
                                <p className="text-gray-600 dark:text-gray-300">다이어트를 원한다면 여기서 <strong>-300 ~ -500 kcal</strong></p>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">벌크업을 원한다면 <strong>+300 ~ +500 kcal</strong></p>
                            </div>
                            <button onClick={handleCopy} className="w-full py-3 bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 font-bold rounded-xl border border-orange-200 dark:border-orange-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">결과 복사하기</button>
                        </div>
                    )}
                </div>
            </div>
            <InstallBanner />
        </div>
    );
}
