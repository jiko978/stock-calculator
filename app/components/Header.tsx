"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
        { href: "/calculator", label: "📊 JIKO 계산기" },
    ];

    return (
        <header className="w-full bg-blue-600 text-white shadow-sm border-b border-gray-700 transition-colors">
            <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                
                {/* 로고 영역 */}
                <div className="text-lg font-bold tracking-tight shrink-0 flex items-center gap-2">
                    <Link href="/" className="hover:text-blue-400 flex items-center gap-2">
                        JIKO Platform
                    </Link>
                </div>

                {/* 데스크탑 Nav */}
                <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link key={link.label} href={link.href} className="hover:text-blue-300 transition-colors">
                            {link.label}
                        </Link>
                    ))}
                    <button
                        onClick={toggleDark}
                        className="ml-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 transition"
                    >
                        {isDark ? "☀️ 라이트" : "🌙 다크"}
                    </button>
                </nav>

                {/* 모바일 햄버거 메뉴 묶음 */}
                <div className="md:hidden flex items-center gap-3">
                    <button
                        onClick={toggleDark}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 transition"
                    >
                        {isDark ? "☀️" : "🌙"}
                    </button>
                    <button
                        className="text-2xl p-1"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* 모바일 화면 Nav Sheet */}
            {menuOpen && (
                <div className="md:hidden mt-4 pt-4 border-t flex flex-col gap-4 text-sm font-medium max-w-5xl mx-auto">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="block hover:text-blue-300 pl-2"
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
