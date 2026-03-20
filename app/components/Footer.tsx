import Link from "next/link";

export default function Footer() {
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

                {/* Line 2: Support */}
                <div className="flex items-center gap-3">
                    <Link href="/policy/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Contact</Link>
                </div>

                {/* Line 3: Copyright */}
                <p className="text-[10px] text-gray-400 dark:text-gray-600 tracking-wider font-semibold">
                    © 2026 JIKO Platform. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
