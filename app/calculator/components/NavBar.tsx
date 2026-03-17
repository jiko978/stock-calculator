"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ShareSheet from "@/app/calculator/components/ShareSheet";

interface NavBarProps {
    title: string;        // 스크롤 후 중앙에 표시될 현재 페이지 제목
    shareTitle?: string;  // 공유 시트에 전달할 제목 (생략 시 title 사용)
    description: string;
    shareDescription?: string;
    position?: "top" | "bottom" | "static";
}

export default function NavBar({ title, shareTitle, description, shareDescription, position = "top" }: NavBarProps) {
    const router = useRouter();

    const [scrolled,   setScrolled]   = useState(false);
    const [showShare,  setShowShare]  = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const isBottom = position === "bottom";
    const isStatic = position === "static";

    return (
        <>
            <header
                className={`${
                    isStatic
                        ? "w-full z-10 bg-transparent border-t border-gray-200/50 dark:border-gray-700/50 mt-8"
                        : isBottom 
                            ? "fixed bottom-0 left-0 right-0 z-[100] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
                            : `sticky top-0 z-[100] transition-all duration-300 ${
                                scrolled
                                    ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50"
                                    : "bg-transparent"
                            }`
                }`}
            >
                <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">

                    {/* ← 뒤로가기 */}
                    <button
                        onClick={() => router.back()}
                        aria-label="뒤로가기"
                        className="flex items-center gap-0.5 text-blue-500 dark:text-blue-400 hover:opacity-70 active:opacity-50 transition-opacity duration-150"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 shrink-0"
                            fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" strokeWidth={2.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">뒤로가기</span>
                    </button>

                    {/* 현재 페이지 타이틀 (스크롤 후 페이드인) */}
                    <span
                        className={`text-sm font-semibold text-gray-800 dark:text-gray-100 absolute left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none ${
                            (scrolled || isBottom || isStatic) ? "opacity-100" : "opacity-0"
                        }`}
                    >
            {title}
          </span>

                    {/* 공유 아이콘 */}
                    <button
                        onClick={() => setShowShare(true)}
                        aria-label="공유"
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-90 transition-all duration-150"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-gray-700 dark:text-gray-300"
                            fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                </div>
            </header>

            {showShare && (
                <ShareSheet
                    url={typeof window !== "undefined" ? window.location.href : ""}
                    title={shareTitle ?? title}
                    description={shareDescription ?? description}
                    onClose={() => setShowShare(false)}
                />
            )}
        </>
    );
}