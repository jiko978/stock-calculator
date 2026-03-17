import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RegisterSW from "./components/RegisterSW";
import { PWAInstallProvider } from "./components/PWAInstallProvider";
import Script from "next/script";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const BASE_URL = "https://jiko.kr/calculator";

// safe-area-inset 활성화 (아이폰 노치/홈바 대응)
export const viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: "JIKO calculator",
        template: "%s | JIKO calculator",
    },
    description: "주식, 금융, 부동산, 건강, 생활, 세금 등 다양한 계산기를 한 곳에서 사용하세요.",
    keywords: ["계산기", "JIKO 계산기", "주식 계산기", "금융 계산기", "부동산 계산기", "건강 계산기", "생활 계산기", "세금 계산기"],
    authors: [{ name: "JIKO calculator" }],
    creator: "JIKO calculator",

    // ── Open Graph (카카오/페이스북/링크 미리보기) ──
    openGraph: {
        type: "website",
        locale: "ko_KR",
        url: BASE_URL,
        siteName: "JIKO calculator",
        title: "JIKO calculator",
        description: "주식, 금융, 부동산, 건강, 생활, 세금 등 다양한 계산기를 한 곳에서 사용하세요.",
        images: [
            {
                url: "/calculator/jiko-calculator-icon2.png",
                width: 1200,
                height: 630,
                alt: "JIKO calculator",
            },
        ],
    },

    // ── Twitter Card ──
    twitter: {
        card: "summary_large_image",
        title: "JIKO calculator",
        description: "주식, 금융, 부동산, 건강, 생활, 세금 등 다양한 계산기를 한 곳에서 사용하세요.",
        images: ["/calculator/jiko-calculator-icon2.png"],
    },

    // ── robots ──
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    // ── canonical (기본값, 각 페이지에서 override 가능) ──
    alternates: {
        canonical: BASE_URL,
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
            <>
                {/* PWA - Only for Calculator Hub */}
                <link rel="manifest" href="/calculator/manifest.json" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="JIKO 계산기" />
                <meta name="theme-color" content="#3b82f6" />

                <RegisterSW />
                <Header />

                <PWAInstallProvider>
                    <main className="flex-grow">
                        {children}
                    </main>
                    <Footer />
                </PWAInstallProvider>
            </>
    );
}