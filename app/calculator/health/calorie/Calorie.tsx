"use client";

import { useState, useMemo } from "react";
import InstallBanner from "@/app/calculator/components/InstallBanner";

const EXERCISES = [
    { label: "걷기", mets: 3.5, icon: "🚶" },
    { label: "달리기", mets: 8.0, icon: "🏃" },
    { label: "계단 오르기", mets: 8.0, icon: "🧗" },
    { label: "수영", mets: 7.0, icon: "🏊" },
    { label: "자전거", mets: 7.5, icon: "🚴" },
    { label: "줄넘기", mets: 11.0, icon: "🪢" },
    { label: "등산", mets: 7.3, icon: "🏔️" },
    { label: "복싱", mets: 12.0, icon: "🥊" },
    { label: "배드민턴", mets: 4.5, icon: "🎾" },
    { label: "볼링", mets: 3.0, icon: "🎳" },
    { label: "탁구", mets: 4.0, icon: "🏓" },
    { label: "요가", mets: 2.5, icon: "🧘" },
    { label: "근력운동", mets: 5.0, icon: "🏋️" },
];

const FOODS = [
    { label: "쌀밥(한공기)", kcal: 313, icon: "🍚" },
    { label: "삶은달걀(1개)", kcal: 80, icon: "🥚" },
    { label: "사과(1개)", kcal: 52, icon: "🍎" },
    { label: "바나나(1개)", kcal: 93, icon: "🍌" },
    { label: "토마토(1개)", kcal: 18, icon: "🍅" },
    { label: "제육볶음(1인분)", kcal: 500, icon: "🥘" },
    { label: "아메리카노", kcal: 10, icon: "☕" },
    { label: "닭가슴살(100g)", kcal: 165, icon: "🐔" },
    { label: "치킨(1조각)", kcal: 250, icon: "🍗" },
    { label: "떡볶이(1인분)", kcal: 350, icon: "🍢" },
    { label: "피자(1조각)", kcal: 250, icon: "🍕" },
    { label: "라면", kcal: 500, icon: "🍜" },
    { label: "맥주(500cc)", kcal: 240, icon: "🍺" },
    { label: "소주(1병)", kcal: 400, icon: "🍶" },
];

const INTENSITIES = [
    { label: "낮음", factor: 0.8 },
    { label: "보통", factor: 1.0 },
    { label: "높음", factor: 1.25 }
];

export default function Calorie() {
    const [weight, setWeight] = useState<string>("");
    const [exerciseTime, setExerciseTime] = useState<string>("");
    
    // Exercise
    const [selectedExerciseIdx, setSelectedExerciseIdx] = useState<number | "custom">(0);
    const [customMets, setCustomMets] = useState<string>("");
    const [intensityFactor, setIntensityFactor] = useState<number>(1.0);
    
    // Food
    const [foodCounts, setFoodCounts] = useState<{ [key: number]: number }>(
        FOODS.reduce((acc, _, i) => ({ ...acc, [i]: 0 }), {})
    );
    // Custom Food List
    const [customFoods, setCustomFoods] = useState<{ label: string, kcal: number, count: number }[]>([]);
    const [newFoodLabel, setNewFoodLabel] = useState("");
    const [newFoodKcal, setNewFoodKcal] = useState("");

    const [result, setResult] = useState<{
        burned: number;
        intake: number;
        balance: number;
    } | null>(null);

    const [isShaking, setIsShaking] = useState(false);

    const handleFoodChange = (idx: number, delta: number) => {
        setFoodCounts(prev => ({
            ...prev,
            [idx]: Math.max(0, prev[idx] + delta)
        }));
    };

    const handleCustomFoodChange = (idx: number, delta: number) => {
        setCustomFoods(prev => {
            const next = [...prev];
            next[idx].count = Math.max(0, next[idx].count + delta);
            return next;
        });
    };

    const addCustomFood = () => {
        const kcal = parseInt(newFoodKcal);
        if (!newFoodLabel || isNaN(kcal)) return;
        setCustomFoods(prev => [...prev, { label: newFoodLabel, kcal, count: 1 }]);
        setNewFoodLabel("");
        setNewFoodKcal("");
    };

    const handleCalculate = () => {
        const w = parseFloat(weight);
        const time = parseFloat(exerciseTime);

        if (isNaN(w) || w <= 0) {
            alert("체중을 입력해주세요.");
            return;
        }

        let mets = 0;
        if (selectedExerciseIdx === "custom") {
            mets = parseFloat(customMets) || 0;
        } else {
            mets = EXERCISES[selectedExerciseIdx].mets;
        }

        const burned = mets * w * ((time || 0) / 60) * intensityFactor;
        
        // Burned vs Intake
        let intake = 0;
        Object.entries(foodCounts).forEach(([idx, count]) => {
            intake += FOODS[parseInt(idx)].kcal * count;
        });
        customFoods.forEach(cf => {
            intake += cf.kcal * cf.count;
        });

        setResult({
            burned: Math.round(burned),
            intake: Math.round(intake),
            balance: Math.round(intake - burned)
        });
    };

    const handleReset = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setWeight("");
        setExerciseTime("");
        setSelectedExerciseIdx(0);
        setCustomMets("");
        setIntensityFactor(1.0);
        setFoodCounts(FOODS.reduce((acc, _, i) => ({ ...acc, [i]: 0 }), {}));
        setCustomFoods([]);
        setResult(null);
    };

    const handleCopy = () => {
        if (result) {
            const text = `[JIKO 칼로리 계산기 결과]\n소모: ${result.burned.toLocaleString()}kcal | 섭취: ${result.intake.toLocaleString()}kcal\n순 밸런스: ${result.balance > 0 ? '+' : ''}${result.balance.toLocaleString()}kcal`;
            navigator.clipboard.writeText(text);
            alert("복사되었습니다.");
        }
    };

    const extraTimeNeeded = useMemo(() => {
        if (!result || result.intake === 0 || !weight) return 0;
        const w = parseFloat(weight);
        return Math.round((result.intake / (8.0 * w)) * 60);
    }, [result, weight]);

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex justify-center flex-wrap gap-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
                        🏃‍♂️ 칼로리 계산기
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="space-y-10">
                    {/* 체중 입력 */}
                    <section>
                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">나의 체중</label>
                        <div className="relative">
                            <input type="number" className="w-full p-5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/20 dark:text-gray-100 text-xl font-bold transition-all" placeholder="0.0" value={weight} onChange={(e) => setWeight(e.target.value)} />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">kg</span>
                        </div>
                    </section>

                    {/* 운동 종류 (이쁜 디자인) */}
                    <section>
                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">운동 종류 선택</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {EXERCISES.map((ex, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setSelectedExerciseIdx(i)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 ${selectedExerciseIdx === i ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 scale-105 shadow-md" : "border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800"}`}
                                >
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl mb-1">{ex.icon}</span>
                                    <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200 break-keep text-center leading-tight">{ex.label}</span>
                                    <span className="text-[9px] text-orange-500 font-medium mt-0.5">METs {ex.mets.toFixed(1)}</span>
                                </div>
                                </button>
                            ))}
                            <button 
                                onClick={() => setSelectedExerciseIdx("custom")}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 ${selectedExerciseIdx === "custom" ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 scale-105 shadow-md" : "border-gray-100 dark:border-gray-700 hover:border-orange-200"}`}
                            >
                                <span className="text-2xl mb-1">✏️</span>
                                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200">직접 입력</span>
                            </button>
                        </div>

                        {selectedExerciseIdx === "custom" && (
                            <div className="mt-4 p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/40 animate-in fade-in slide-in-from-top-2">
                                <label className="block text-xs font-bold text-orange-600 mb-2">운동 강도지수 (METs) 직접 입력</label>
                                <div className="flex items-center gap-3">
                                    <input type="number" step="0.1" className="flex-1 p-3 bg-white dark:bg-gray-800 rounded-lg outline-none border border-orange-200 dark:border-orange-800 text-sm" placeholder="예: 5.5" value={customMets} onChange={(e) => setCustomMets(e.target.value)} />
                                    <span className="text-xs text-orange-400 font-medium whitespace-nowrap">* 운동 백과사전 등을 참고하세요</span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">운동 시간 (분)</label>
                                <input type="number" className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 dark:text-gray-100" placeholder="0" value={exerciseTime} onChange={(e) => setExerciseTime(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">운동 강도</label>
                                <div className="flex gap-1 h-[56px]">
                                    {INTENSITIES.map((level, i) => (
                                        <button key={i} className={`flex-1 rounded-xl text-xs font-bold transition-all ${intensityFactor === level.factor ? "bg-orange-500 text-white shadow-lg" : "bg-gray-100 text-gray-400 dark:bg-gray-700/50 dark:text-gray-500"}`} onClick={() => setIntensityFactor(level.factor)}>
                                            {level.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 음식 섭취 */}
                    <section>
                        <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">주요 음식 섭취량</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {FOODS.map((food, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-50 dark:border-gray-600 group hover:border-orange-200 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{food.icon}</span>
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-bold text-gray-700 dark:text-gray-200">{food.label}</span>
                                            <span className="text-[10px] text-orange-500 font-medium">{food.kcal} kcal</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handleFoodChange(i, -1)} className="w-8 h-8 rounded-full bg-white dark:bg-gray-600 shadow-sm flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors">－</button>
                                        <span className="w-5 text-center font-bold text-gray-800 dark:text-gray-100">{foodCounts[i]}</span>
                                        <button onClick={() => handleFoodChange(i, 1)} className="w-8 h-8 rounded-full bg-orange-500 text-white shadow-md flex items-center justify-center font-bold hover:bg-orange-600 transition-colors">＋</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 음식 직접 추가 */}
                        <div className="mt-8 p-5 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <h4 className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2">
                                <span className="text-sm">🥗</span> 목록에 없는 음식 직접 추가
                            </h4>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <input type="text" className="p-3 bg-white dark:bg-gray-800 rounded-xl outline-none border border-gray-100 dark:border-gray-700 text-xs" placeholder="음식명 (예: 떡볶이)" value={newFoodLabel} onChange={(e) => setNewFoodLabel(e.target.value)} />
                                <input type="number" className="p-3 bg-white dark:bg-gray-800 rounded-xl outline-none border border-gray-100 dark:border-gray-700 text-xs" placeholder="kcal" value={newFoodKcal} onChange={(e) => setNewFoodKcal(e.target.value)} />
                            </div>
                            <button onClick={addCustomFood} className="w-full py-3 bg-white dark:bg-gray-800 text-orange-500 hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white rounded-xl text-xs font-black border border-orange-200 transition-all">음식 추가하기</button>

                            {customFoods.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {customFoods.map((cf, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                                            <span className="text-[12px] font-bold text-gray-600 dark:text-gray-300">🌟 {cf.label} ({cf.kcal}kcal)</span>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => handleCustomFoodChange(i, -1)} className="text-gray-400 hover:text-red-500 font-bold px-2">－</button>
                                                <span className="text-xs font-black text-orange-600">{cf.count}</span>
                                                <button onClick={() => handleCustomFoodChange(i, 1)} className="text-orange-500 hover:text-orange-700 font-bold px-2">＋</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="flex gap-4 pt-4">
                        <button onClick={handleReset} className={`flex-1 py-5 bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 rounded-2xl font-bold transition-all hover:bg-gray-200 ${isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""}`}>초기화</button>
                        <button onClick={handleCalculate} className="flex-[2] py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-lg transition-all shadow-lg shadow-orange-500/20 active:scale-95">결과 확인하기</button>
                    </div>

                    {result && (
                        <div className="mt-12 animate-in zoom-in-95 duration-300">
                            <div className="p-10 bg-gradient-to-br from-orange-400 to-amber-500 dark:from-orange-600 dark:to-amber-700 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="relative z-10 text-center">
                                    <p className="text-sm font-bold opacity-80 mb-2">순 칼로리 밸런스</p>
                                    <div className="text-6xl font-black mb-10 tracking-tighter">
                                        {result.balance > 0 ? `+${result.balance.toLocaleString()}` : result.balance.toLocaleString()}
                                        <span className="text-xl ml-2 opacity-70">kcal</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-10">
                                        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-5 border border-white/20">
                                            <p className="text-[11px] font-bold opacity-70 mb-1 uppercase tracking-widest">Burned</p>
                                            <p className="text-2xl font-black">{result.burned.toLocaleString()} <span className="text-xs">kcal</span></p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-5 border border-white/20">
                                            <p className="text-[11px] font-bold opacity-70 mb-1 uppercase tracking-widest">Intake</p>
                                            <p className="text-2xl font-black">{result.intake.toLocaleString()} <span className="text-xs">kcal</span></p>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-black/10 rounded-3xl mb-10">
                                        <div className="flex items-center justify-center gap-3 mb-2">
                                            <span className="text-3xl">👟</span>
                                            <div className="text-left">
                                                <p className="text-xs font-medium opacity-80">먹은 만큼 태우려면?</p>
                                                <p className="text-lg font-black text-amber-100">달리기 {extraTimeNeeded}분 추가!</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={handleCopy} className="w-full py-4 bg-white text-orange-600 rounded-2xl font-black text-sm shadow-xl hover:bg-gray-50 transition-colors">분석 결과 공유하기</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <section className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-[32px] border border-gray-100 dark:border-gray-700">
                        <h4 className="font-black text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                            <span className="text-2xl">🥗</span> WHO 권장 올바른 식생활 지침
                        </h4>
                        <ul className="space-y-4">
                            {[
                                ["나트륨 섭취 줄이기", "하루 5g(소금 1큰술) 미만 섭취 권장"],
                                ["채소와 과일", "하루 400g 이상 다양한 색상의 채소 섭취"],
                                ["적정 당분", "총 에너지 섭취량의 10% 미만으로 당분 제한"],
                                ["규칙적인 식사", "폭식을 피하고 일정한 시간에 정량 식사"]
                            ].map(([title, desc], i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center text-[10px] font-black shrink-0">✓</div>
                                    <div className="text-sm">
                                        <strong className="text-gray-800 dark:text-gray-100">{title} :</strong> <span className="text-gray-500 dark:text-gray-400">{desc}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
            <InstallBanner />
        </div>
    );
}
