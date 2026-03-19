import React from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackButton from "./BackButton";

export default function PolicyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Header />
            
            <main className="flex-grow py-8 md:py-16 px-4">
                <div className="max-w-3xl mx-auto space-y-6">
                    
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-gray-500 px-2">
                        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-gray-600 dark:text-gray-300">Policy</span>
                    </nav>

                    {/* Content Area */}
                    <div className="w-full">
                        {children}
                    </div>

                    {/* Bottom Action */}
                    <div className="flex justify-center pt-8">
                        <BackButton 
                            className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition-colors py-2 px-4 rounded-full hover:bg-white dark:hover:bg-gray-800"
                        >
                            <span>←</span> 메인 페이지로 돌아가기
                        </BackButton>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

