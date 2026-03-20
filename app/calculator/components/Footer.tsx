"use client";

import Link from "next/link";
import { usePWAInstall } from "./PWAInstallProvider";

export default function Footer() {
    const { canInstall, showInstallPrompt } = usePWAInstall();
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-gray-500 py-6 text-center text-xs mt-auto transition-colors">
            <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-3">
                
                {/* Line 1: Policy Links */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 font-medium text-gray-600 dark:text-gray-400">
                    <Link href="/policy/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
                    <Link href="/policy/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</Link>
                    <Link href="/policy/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</Link>
                    <Link href="/policy/disclaimer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Disclaimer</Link>
                </div>

                {/* Line 2: Support & App */}
                <div className="flex items-center gap-3">
                    <Link href="/policy/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Contact</Link>
                    {canInstall && (
                        <>
                            <span className="text-gray-300 dark:text-gray-700">|</span>
                            <button
                                onClick={showInstallPrompt}
                                className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                            >
                                <span className="text-sm">💻</span> 앱 설치하기
                            </button>
                        </>
                    )}
                </div>

                {/* Line 3: Copyright */}
                <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wider font-semibold">
                    © 2026 JIKO Platform. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
