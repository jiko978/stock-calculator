"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"

export default function Header() {

    const [isDark, setIsDark] = useState(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDark]);

    const toggleDark = () => {
        const next = !isDark;
        setIsDark(next);
        localStorage.setItem("theme", next ? "dark" : "light");
    };

    return (
        <header className="bg-blue-600 text-white p-4">
            <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">

                <div className="text-sm font-bold">
                    <Link href="/calculator" className="hover:text-red-500">JIKO
                        <Image
                            src="/icons/icon-512x512.png"
                            alt="JIKO 계산기 로고"
                            width={30}
                            height={30}
                        />
                    </Link>
                </div>

                <nav className="flex gap-6 text-sm font-medium">
                    <Link href="/calculator/stock">📈 주식</Link>
                    <Link href="/calculator/stock">💰 금융</Link>
                    <Link href="/calculator/stock">🏢 부동산</Link>
                    <Link href="/calculator/stock">🏠 생활</Link>
                    <Link href="/calculator/stock">💪 건강</Link>
                    <Link href="/calculator/stock">🧮 기타</Link>
                </nav>

                <button
                    onClick={toggleDark}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 hover:bg-white/30 transition"
                >
                    {isDark ? "☀️ 라이트" : "🌙 다크"}
                </button>

            </div>
        </header>
    );
}