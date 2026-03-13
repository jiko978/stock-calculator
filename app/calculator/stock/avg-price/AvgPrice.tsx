"use client";

import { useState, useRef, useEffect } from "react";
import NavBar from "@/app/calculator/components/NavBar";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import { ANIMATION } from "@/app/config/animationConfig";

const MAX_ROWS = 10;

interface Row {
    id: number;
    price: string;
    qty: string;
}

const createRow = (id: number): Row => ({ id, price: "", qty: "" });

// 수익률 기준 등급 (현재가 있을 때만)
const getGrade = (rate: number) => {
    if (rate >= 30) return { label: "주식 고수", emoji: "🏆", color: "text-yellow-500 dark:text-yellow-400" };
    if (rate >= 20) return { label: "주식 달인", emoji: "👑", color: "text-amber-500 dark:text-amber-400" };
    if (rate >= 10) return { label: "손절 불가자", emoji: "✨", color: "text-blue-500 dark:text-blue-400" };
    if (rate >= 5) return { label: "주식 초보", emoji: "😅", color: "text-gray-500 dark:text-gray-400" };
    if (rate >= 0) return { label: "주식 호구", emoji: "🐥", color: "text-gray-400 dark:text-gray-500" };
    if (rate >= -10) return { label: "묻지마 투자자", emoji: "🤷", color: "text-orange-400 dark:text-orange-500" };
    return { label: "야수의 심장", emoji: "🔥", color: "text-red-500 dark:text-red-400" };
};

interface AvgPriceProps {
    stockName?: string;
}

export default function AvgPrice({ stockName }: AvgPriceProps) {
    const [rows, setRows] = useState<Row[]>([
        createRow(1), createRow(2), createRow(3),
    ]);
    const [currentPrice, setCurrentPrice] = useState("");
    const [calculated, setCalculated] = useState(false);
    const [copied, setCopied] = useState(false);
    const [shaking, setShaking] = useState(false);
    const currentPriceRef = useRef<HTMLInputElement>(null);
    const [placeholderFontSize, setPlaceholderFontSize] = useState(16);

    // input 너비에 맞게 placeholder 폰트 크기 계산 (ResizeObserver 적용)
    useEffect(() => {
        const inputEl = currentPriceRef.current;
        if (!inputEl) return;

        const calcSize = () => {
            const w = inputEl.offsetWidth;
            // "현재가를 입력하면 수익률을 계산해드려요" 문구: 한글 17자 + 공백 4자 = 약 18.5em
            // padding(px-3: 좌우 24px) 고려하여 폰트 크기 계산
            let size = Math.floor((w - 24) / 18.5);
            if (size > 15) size = 15;
            if (size < 8) size = 8;
            setPlaceholderFontSize(size);
        };

        calcSize();
        const observer = new ResizeObserver(calcSize);
        observer.observe(inputEl);

        return () => observer.disconnect();
    }, []);

    const n = (v: string) => Number(v.replace(/[^0-9]/g, ""));
    const formatComma = (raw: string) => raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // 입력 길이에 따라 폰트 크기 조절 (최대 10자리 기준)
    const getFontSize = (value: string): number => {
        // 640px(sm 사이즈) 이상의 PC/태블릿 화면에서는 항상 14px 고정
        if (typeof window !== "undefined" && window.innerWidth >= 640) {
            return 14;
        }
        // 모바일 환경(640px 미만)에서는 기존처럼 길이에 따라 폰트 축소
        const len = value.replace(/[^0-9]/g, "").length;
        if (len >= 9) return 10;
        if (len >= 7) return 12;
        return 14;
    };

    const validAmounts = rows.map(r => (n(r.price) > 0 && n(r.qty) > 0) ? n(r.price) * n(r.qty) : 0);
    const totalCost = validAmounts.reduce((s, a) => s + a, 0);
    const totalQty = rows.reduce((s, r) => (n(r.price) > 0 && n(r.qty) > 0) ? s + n(r.qty) : s, 0);
    const avgPrice = totalQty ? totalCost / totalQty : 0;

    const firstPrice = n(rows[0].price);
    const maxPrice = Math.max(...rows.map(r => n(r.price)));
    const reducedRate = firstPrice > 0 && avgPrice > 0
        ? ((firstPrice - avgPrice) / firstPrice) * 100
        : 0;
    const isUp = avgPrice > firstPrice && firstPrice > 0;

    const curPrice = n(currentPrice);
    const hasCurrent = curPrice > 0 && calculated;
    const evalTotal = curPrice * totalQty;
    const profitAmt = evalTotal - totalCost;
    const profitRate = totalCost > 0 ? ((profitAmt / totalCost) * 100).toFixed(2) : "0";
    const isProfit = profitAmt >= 0;

    const grade = hasCurrent ? getGrade(Number(profitRate)) : null;

    const maxAmount = Math.max(...validAmounts, 1);
    const validRows = rows.filter((_, i) => validAmounts[i] > 0);

    const barColors = [
        "bg-blue-400 dark:bg-blue-500",
        "bg-indigo-400 dark:bg-indigo-500",
        "bg-violet-400 dark:bg-violet-500",
        "bg-purple-400 dark:bg-purple-500",
        "bg-fuchsia-400 dark:bg-fuchsia-500",
        "bg-pink-400 dark:bg-pink-500",
        "bg-rose-400 dark:bg-rose-500",
        "bg-orange-400 dark:bg-orange-500",
        "bg-amber-400 dark:bg-amber-500",
        "bg-teal-400 dark:bg-teal-500",
    ];

    const handleChange = (id: number, field: "price" | "qty") =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setCalculated(false); setCopied(false);
            const raw = e.target.value.replace(/[^0-9]/g, "").replace(/^0+/, "");
            if (raw.length > 9) return; // 10자리 초과 입력 차단
            setRows(prev => prev.map(r =>
                r.id === id ? { ...r, [field]: raw === "" ? "" : formatComma(raw) } : r
            ));
        };

    const handleCurrentPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCalculated(false);
        const raw = e.target.value.replace(/[^0-9]/g, "").replace(/^0+/, "");
        if (raw.length > 9) return; // 9자리 초과 입력 차단
        setCurrentPrice(raw === "" ? "" : formatComma(raw));
    };

    const handleAddRow = () => {
        if (rows.length >= MAX_ROWS) return;
        const newId = Math.max(...rows.map(r => r.id)) + 1;
        setRows(prev => [...prev, createRow(newId)]);
        setCalculated(false);
    };

    const handleRemoveRow = (id: number) => {
        if (rows.length <= 1) return;
        setRows(prev => prev.filter(r => r.id !== id));
        setCalculated(false); setCopied(false);
    };

    const handleReset = () => {
        setRows([createRow(1), createRow(2), createRow(3)]);
        setCurrentPrice("");
        setCalculated(false); setCopied(false);
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
    };

    const breakevenQty = hasCurrent && curPrice < avgPrice && curPrice > 0
        ? Math.ceil(totalCost / curPrice - totalQty)
        : null;

    const handleCopyResult = async () => {
        const lines = [
            `평균 단가       : ${avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원`,
            `합계 수량       : ${totalQty.toLocaleString()} 개`,
            `매수 합계 금액  : ${totalCost.toLocaleString()} 원`,
        ];
        if (hasCurrent) {
            lines.push(`현재 평가금액   : ${evalTotal.toLocaleString()} 원`);
            lines.push(`수익금          : ${profitAmt >= 0 ? "+" : ""}${profitAmt.toLocaleString()} 원`);
            lines.push(`수익률          : ${Number(profitRate) >= 0 ? "+" : ""}${profitRate} %`);
            if (breakevenQty !== null) lines.push(`본전 추가매수    : ${breakevenQty.toLocaleString()} 개`);
        }
        await navigator.clipboard.writeText(lines.join("\n"));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const priceBarMax = Math.max(maxPrice, curPrice, avgPrice, 1);
    const avgBarPct = Math.round((avgPrice / priceBarMax) * 100);
    const curBarPct = Math.round((curPrice / priceBarMax) * 100);
    const maxBarPct = Math.round((maxPrice / priceBarMax) * 100);

    // sticky 공통 스타일
    const stickyTh = (left: number, width: number, extra = "") =>
        `border border-gray-400 dark:border-gray-600 py-2 text-center text-gray-800 dark:text-gray-100 text-xs bg-gray-100 dark:bg-gray-700 z-20 ${extra}`
        + ` sticky`;
    const stickyTd = (bgClass: string, extra = "") =>
        `border border-gray-400 dark:border-gray-600 ${bgClass} z-10 sticky ${extra}`;

    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <NavBar title="주식 평균 단가 계산기 | 물타기/불타기 평단 계산 - JIKO calculator" description={"주식 평균 단가를 정확히 계산해보세요"} />

            <div className={`max-w-3xl mx-auto px-4 py-6 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>

                <div className="flex justify-center items-center gap-3 mb-6 flex-wrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">💧 물타기</span>
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">🔥 불타기</span>
                    <h1 className="px-3 py-1 font-bold text-gray-800 dark:text-gray-100 italic">
                        {stockName ? `[${stockName}] ` : ""}평균 단가 계산기
                    </h1>
                </div>

                {/* 입력 테이블 */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md overflow-x-auto">
                    <table className="border-collapse border border-gray-400 dark:border-gray-600 text-sm w-full" style={{ minWidth: "250px" }}>
                        <colgroup>
                            <col className="w-[35px] min-w-[35px] sm:w-[50px] sm:min-w-[50px]" />
                            <col className="w-[90px] min-w-[90px] sm:w-[25%] sm:min-w-[140px]" />
                            <col className="w-[90px] min-w-[90px] sm:w-[25%] sm:min-w-[140px]" />
                            <col />
                            <col className="w-[35px] min-w-[35px] sm:w-[50px] sm:min-w-[50px]" />
                        </colgroup>
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="border border-gray-400 dark:border-gray-600 py-2 text-center text-gray-800 dark:text-gray-100 text-xs">차수</th>
                                <th className="border border-gray-400 dark:border-gray-600 py-2 text-center text-gray-800 dark:text-gray-100 text-xs">매수가</th>
                                <th className="border border-gray-400 dark:border-gray-600 py-2 text-center text-gray-800 dark:text-gray-100 text-xs">수량</th>
                                <th className="border border-gray-400 dark:border-gray-600 py-2 text-center text-gray-800 dark:text-gray-100 text-xs">매수금액</th>
                                <th className="border border-gray-400 dark:border-gray-600 py-2 text-center text-gray-800 dark:text-gray-100 text-xs">삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, idx) => (
                                <tr key={row.id}>
                                    <td className="border border-gray-400 dark:border-gray-600 py-2 text-center text-gray-800 dark:text-gray-100 font-medium text-xs">
                                        {idx + 1}차
                                    </td>
                                    <td className="border border-gray-400 dark:border-gray-600 px-1 py-1 text-center">
                                        <input type="text" inputMode="numeric" placeholder="0" value={row.price}
                                            onChange={handleChange(row.id, "price")}
                                            style={{ fontSize: getFontSize(row.price), width: "100%" }}
                                            className="p-1 text-right border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 min-w-0" />
                                    </td>
                                    <td className="border border-gray-400 dark:border-gray-600 px-1 py-1 text-center">
                                        <input type="text" inputMode="numeric" placeholder="0" value={row.qty}
                                            onChange={handleChange(row.id, "qty")}
                                            style={{ fontSize: getFontSize(row.qty), width: "100%" }}
                                            className="p-1 text-right border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 min-w-0" />
                                    </td>
                                    <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-right text-gray-800 dark:text-gray-100 text-base whitespace-nowrap">
                                        {validAmounts[idx] > 0 ? validAmounts[idx].toLocaleString() : "-"}
                                    </td>
                                    <td className="border border-gray-400 dark:border-gray-600 py-2 text-center">
                                        {idx === rows.length - 1 && rows.length > 1 && (
                                            <button onClick={() => handleRemoveRow(row.id)}
                                                className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gray-100 hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-red-900/40 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-150 active:scale-90"
                                                aria-label="행 삭제">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                                                </svg>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 dark:bg-gray-700 font-semibold">
                                <td colSpan={2} className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-center text-gray-800 dark:text-gray-100 text-xs">합계</td>
                                <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-right text-gray-800 dark:text-gray-100 text-xs whitespace-nowrap">
                                    {totalQty > 0 ? totalQty.toLocaleString() : "-"}
                                </td>
                                <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-right text-gray-800 dark:text-gray-100 text-sm whitespace-nowrap">
                                    {totalCost > 0 ? totalCost.toLocaleString() : "-"}
                                </td>
                                <td className="border border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-700" />
                            </tr>
                        </tbody>
                    </table>

                    {rows.length < MAX_ROWS && (
                        <button onClick={handleAddRow}
                            className="mt-3 w-full py-2 flex items-center justify-center gap-1 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-150">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            {rows.length + 1}차 추가 ({rows.length}/{MAX_ROWS})
                        </button>
                    )}
                    {rows.length >= MAX_ROWS && (
                        <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">최대 {MAX_ROWS}차까지 추가 가능합니다.</p>
                    )}
                </div>

                {/* 현재가 입력 (선택) */}
                <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md px-5 py-4">
                    <div className="flex items-center gap-4">
                        <label className="shrink-0 text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                            현재가
                            <span className="text-xs font-normal text-gray-400 dark:text-gray-500">(선택)</span>
                        </label>
                        <div className="flex items-center flex-1">
                            <input
                                ref={currentPriceRef}
                                type="text" inputMode="numeric"
                                placeholder="현재가를 입력하면 수익률을 계산해드려요"
                                value={currentPrice}
                                onChange={handleCurrentPrice}
                                style={{
                                    fontSize: currentPrice ? getFontSize(currentPrice) : placeholderFontSize
                                }}
                                className="w-full border rounded-lg px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 placeholder:text-left transition-all duration-150" />                            <span className="ml-2 text-gray-800 dark:text-gray-100 shrink-0 text-sm">원</span>
                        </div>
                    </div>
                </div>

                {/* 버튼 */}
                <div className="mt-4 flex justify-center gap-3">
                    <button onClick={handleReset}
                        className={`px-6 py-3 min-h-[44px] border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 transition-colors duration-150 text-base ${ANIMATION.resetShake && shaking ? "animate-shake" : ""}`}>
                        초기화
                    </button>
                    <button onClick={() => setCalculated(true)}
                        className="px-8 py-3 min-h-[44px] bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors duration-150 text-base">
                        계산하기
                    </button>
                </div>

                {/* 결과 — 모바일: 상하 / PC: 좌우 */}
                {calculated && (
                    <div className={`mt-6 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>
                        <div className="flex flex-col sm:flex-row gap-4">

                            {/* 좌측: 결과 수치 */}
                            <div className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md space-y-3">
                                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">계산 결과</h2>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">평균 단가</span>
                                    <strong className="text-blue-600 dark:text-blue-400 text-lg">
                                        {avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원
                                    </strong>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">합계 수량</span>
                                    <strong className="text-gray-800 dark:text-gray-100">{totalQty.toLocaleString()} 개</strong>
                                </div>
                                <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3">
                                    <span className="text-gray-600 dark:text-gray-300">매수 합계 금액</span>
                                    <strong className="text-red-500 dark:text-red-400">{totalCost.toLocaleString()} 원</strong>
                                </div>

                                {hasCurrent && (
                                    <>
                                        <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3">
                                            <span className="text-gray-600 dark:text-gray-300">현재 평가금액</span>
                                            <strong className="text-gray-800 dark:text-gray-100">{evalTotal.toLocaleString()} 원</strong>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-300">수익금</span>
                                            <strong className={isProfit ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400"}>
                                                {profitAmt >= 0 ? "+" : ""}{profitAmt.toLocaleString()} 원
                                            </strong>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-300">수익률</span>
                                            <strong className={`text-xl ${isProfit ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400"}`}>
                                                {Number(profitRate) >= 0 ? "+" : ""}{profitRate} %
                                            </strong>
                                        </div>
                                        {breakevenQty !== null && (
                                            <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2">
                                                <span className="text-xs text-amber-600 dark:text-amber-400">본전되려면 추가매수</span>
                                                <strong className="text-amber-600 dark:text-amber-400 text-sm">{breakevenQty.toLocaleString()} 개</strong>
                                            </div>
                                        )}
                                        {curPrice >= avgPrice && (
                                            <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2">
                                                <span className="text-xs text-green-600 dark:text-green-400">손익분기</span>
                                                <strong className="text-green-600 dark:text-green-400 text-sm">이미 본전 이상 ✅</strong>
                                            </div>
                                        )}
                                    </>
                                )}

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
                            <div className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md flex flex-col">
                                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">차수별 매수 비중</h2>

                                <div className="text-center mb-5">
                                    <div className="flex items-center justify-center gap-2 flex-wrap">
                                        <span className={`text-3xl font-bold ${hasCurrent ? (isProfit ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400") : "text-blue-600 dark:text-blue-400"}`}>
                                            {hasCurrent
                                                ? `${Number(profitRate) >= 0 ? "▲" : "▼"} ${Math.abs(Number(profitRate)).toFixed(2)}%`
                                                : `${isUp ? "▲" : "▼"} ${Math.abs(reducedRate).toFixed(1)}%`
                                            }
                                        </span>
                                        {grade && (
                                            <span className={`text-sm font-bold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 ${grade.color}`}>
                                                {grade.emoji} {grade.label}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        {hasCurrent
                                            ? (isProfit ? "현재가 대비 수익 중" : "현재가 대비 손실 중")
                                            : (isUp ? "불타기 — 1차 대비 단가 상승" : "1차 대비 단가 절감률")
                                        }
                                    </p>
                                    {grade && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                            등급 기준: 수익률 {Number(profitRate) >= 0 ? "+" : ""}{profitRate}%
                                        </p>
                                    )}
                                    {!grade && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            현재가를 입력하면 등급을 알 수 있어요 👆
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    {rows.map((row, idx) => {
                                        const amount = validAmounts[idx];
                                        const barWidth = maxAmount > 0 ? Math.round((amount / maxAmount) * 100) : 0;
                                        const ratio = totalCost > 0 ? ((amount / totalCost) * 100).toFixed(1) : "0";
                                        if (amount === 0) return null;
                                        return (
                                            <div key={row.id}>
                                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                    <span>{idx + 1}차 ({n(row.price).toLocaleString()}원 × {n(row.qty).toLocaleString()}개)</span>
                                                    <span className="font-medium">{ratio}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                                                    <div className={`h-4 rounded-full transition-all duration-700 ease-out ${barColors[idx % barColors.length]}`}
                                                        style={{ width: `${barWidth}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {hasCurrent && validRows.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">단가 위치 비교</p>
                                        <div className="space-y-2">
                                            {[
                                                { label: "최고 매수가", value: maxPrice, pct: maxBarPct, color: "bg-gray-400 dark:bg-gray-500" },
                                                { label: "평균 단가", value: avgPrice, pct: avgBarPct, color: "bg-blue-400 dark:bg-blue-500" },
                                                { label: "현재가", value: curPrice, pct: curBarPct, color: isProfit ? "bg-red-400 dark:bg-red-500" : "bg-blue-300 dark:bg-blue-400" },
                                            ].map(({ label, value, pct, color }) => (
                                                <div key={label}>
                                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                        <span>{label}</span>
                                                        <span className="font-medium">{value.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                                        <div className={`h-3 rounded-full transition-all duration-700 ease-out ${color}`}
                                                            style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!hasCurrent && validRows.length > 1 && (
                                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400 dark:text-gray-500">1차 매수가</span>
                                            <span className="text-gray-600 dark:text-gray-300 font-medium">{firstPrice.toLocaleString()} 원</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400 dark:text-gray-500">평균 단가</span>
                                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                {avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원
                                            </span>
                                        </div>
                                    </div>
                                )}
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