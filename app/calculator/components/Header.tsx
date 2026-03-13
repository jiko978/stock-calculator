"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"

export default function Header() {

    const [isDark, setIsDark] = useState(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem("theme") === "dark";
    });

    const [menuOpen, setMenuOpen] = useState(false);

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

    const navLinks = [
        { href: "/", label: "🏠 JIKO Platform" },
        { href: "/calculator/stock", label: "📈 주식" },
        { href: "/calculator/finance", label: "💰 금융" },
        { href: "/calculator/realstate", label: "🏢 부동산" },
        { href: "/calculator/life", label: "🏠 생활" },
        { href: "/calculator/health", label: "💪 건강" },
        { href: "/calculator/other", label: "🧮 기타" },
    ];

    return (
        <header className="w-full bg-blue-600 text-white shadow-sm transition-colors">
            <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">

                {/* 로고 */}
                <div className="text-sm font-bold">
                    <Link href="/calculator" className="hover:text-red-500 flex items-center gap-1">
                        JIKO 계산기
                        <Image
                            src="/icons/icon-512x512.png"
                            alt="JIKO 계산기 로고"
                            width={30}
                            height={30}
                            className="mr-3"
                        />
                    </Link>
                </div>

                {/* 데스크탑 nav */}
                <nav className="hidden md:flex gap-6 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link key={link.label} href={link.href} className="hover:text-red-300">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {/* 다크모드 버튼 */}
                    <button
                        onClick={toggleDark}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 hover:bg-white/30 transition"
                    >
                        {isDark ? "☀️ 라이트" : "🌙 다크"}
                    </button>

                    {/* 햄버거 버튼 (모바일만 표시) */}
                    <button
                        className="md:hidden text-xl"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>

            </div>

            {/* 모바일 드롭다운 메뉴 */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 border-t flex flex-col gap-3 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="hover:text-red-300"
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}