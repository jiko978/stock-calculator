import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import KakaoInit from "./components/KakaoInit";
import RegisterSW from "./components/RegisterSW";
import Script from "next/script";
import GoogleAnalytics from "./components/analytics/GoogleAnalytics";
import PageViewTracker from "./components/analytics/PageViewTracker";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const BASE_URL = "https://jiko-calculator-nine.vercel.app";

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
    description: "주식, 금융, 건강, 생활 등 다양한 계산기를 한 곳에서 사용하세요.",
    keywords: ["계산기", "주식 계산기", "평단가 계산기", "수익률 계산기"],
    authors: [{ name: "JIKO calculator" }],
    creator: "JIKO calculator",

    // ── Open Graph (카카오/페이스북/링크 미리보기) ──
    openGraph: {
        type: "website",
        locale: "ko_KR",
        url: BASE_URL,
        siteName: "JIKO calculator",
        title: "JIKO calculator",
        description: "주식, 금융, 건강, 생활 등 다양한 계산기를 한 곳에서 사용하세요.",
        images: [
            {
                url: "${BASE_URL}/jiko-calculator-icon2.png",
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
        description: "주식, 금융, 건강, 생활 등 다양한 계산기를 한 곳에서 사용하세요.",
        images: ["${BASE_URL}/jiko-calculator-icon2.png"],
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
        <html lang="ko" suppressHydrationWarning>

        <head>
            {/* 다크모드 깜빡임 방지 */}
            <script dangerouslySetInnerHTML={{
                __html: `
            const theme = localStorage.getItem('theme');
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            }
          `
            }} />
            {/* PWA */}
            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="JIKO 계산기" />
            <meta name="theme-color" content="#3b82f6" />
        </head>

        <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-black dark:text-white">

        <GoogleAnalytics />
        <PageViewTracker />

        <KakaoInit />
        <RegisterSW />

        {/* Google Analytics GA4 */}
        <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-VHLZBZWZC8"
            strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-VHLZBZWZC8');
            `}
        </Script>

        <Header />

        <main className="flex-grow">
            {children}
        </main>
        <Footer />
        </body>

        </html>
    );
}