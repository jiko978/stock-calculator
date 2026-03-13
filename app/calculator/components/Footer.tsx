import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-gray-500 py-8 text-center text-sm mt-auto transition-colors">
            <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-3">
                <p>© {new Date().getFullYear()} JIKO calculator. All rights reserved.</p>
                <div className="flex gap-4 text-xs">
                    <span className="text-gray-300 dark:text-gray-700">|</span>
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                        JIKO Platform
                    </Link>
                    <span className="text-gray-300 dark:text-gray-700">|</span>
                    <Link href="mailto:njiko@naver.com" className="hover:text-blue-600 dark:hover:text-blue-400">
                        문의하기
                    </Link>
                    <span className="text-gray-300 dark:text-gray-700">|</span>
                </div>
            </div>
        </footer>
    );
}