"use client";

import React from "react";
import { usePWAInstall } from "./PWAInstallProvider";

export default function InstallBanner() {
    const { canInstall, showInstallPrompt } = usePWAInstall();

    if (!canInstall) return null;

    return (
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 shadow-sm animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30 text-2xl">
                        📱
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">JIKO 계산기를 앱으로 사용해보세요!</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">홈 화면에 추가하면 별도의 설치 없이 바로 편리하게 이용할 수 있습니다.</p>
                    </div>
                </div>
                <button
                    onClick={showInstallPrompt}
                    className="whitespace-nowrap px-6 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all duration-150 transform hover:scale-105"
                >
                    앱 설치하기
                </button>
            </div>
        </div>
    );
}
