"use client";
import { useState, useEffect  } from "react";

export default function Header() {
    const [isDark, setIsDark] = useState(false);

    // ✅ 브라우저에서만 실행 - localStorage 복원
    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        }
    }, []);

    const toggleDark = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", next ? "dark" : "light"); // 저장
    };

    return (
        <header className="bg-blue-600 text-white p-4">
            <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="font-bold text-lg">
                    <a href="/" className="hover:text-red-500">
                        JIKO 계산기
                    </a>
                </div>

                <nav className="flex gap-6 text-sm font-medium">
                    <a href="/stock" className="hover:text-red-500">
                        📈 주식
                    </a>
                    <a href="/stock" className="hover:text-red-500">
                        💰 금융
                    </a>
                    <a href="/stock" className="hover:text-red-500">
                        🏢 부동산
                    </a>
                    <a href="/stock" className="hover:text-red-500">
                        🏠 생활
                    </a>
                    <a href="/stock" className="hover:text-red-500">
                        💪 건강
                    </a>
                    <a href="/stock" className="hover:text-red-500">
                        🧮 기타
                    </a>
                </nav>

                <button onClick={toggleDark} className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 hover:bg-white/30 transition">
                    {isDark ? "☀️ 라이트" : "🌙 다크"}
                </button>

            </div>
        </header>
    )
}