import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import KakaoInit from "./components/KakaoInit";
import "./globals.css";
import GoogleAnalytics from "./components/analytics/GoogleAnalytics";
import PageViewTracker from "./components/analytics/PageViewTracker";
import UnregisterRootSW from "./components/UnregisterRootSW";
import Script from "next/script";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const BASE_URL = "https://jiko.kr";

// safe-area-inset 활성화 (아이폰 노치/홈바 대응)
export const viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: "JIKO Platform",
        template: "%s | JIKO Platform",
    },
    description: "JIKO Platform",
    keywords: ["계산기", "JIKO 계산기", "주식 계산기", "금융 계산기", "부동산 계산기", "건강 계산기", "생활 계산기", "세금 계산기"],
    authors: [{ name: "JIKO Platform" }],
    creator: "JIKO Platform",

    icons: {
        icon: [
            { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        ],
        apple: "/icons/apple-touch-icon.png",
    },

    // ── Open Graph ──
    openGraph: {
        type: "website",
        locale: "ko_KR",
        url: BASE_URL,
        siteName: "JIKO Platform",
        title: "JIKO Platform",
        description: "JIKO Platform",
        images: [
            {
                url: "/calculator/jiko-calculator-icon2.png",
                width: 1200,
                height: 630,
                alt: "JIKO Platform",
            },
        ],
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
        </head>

        <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-black dark:text-white">

        <GoogleAnalytics />
        <PageViewTracker />

        <KakaoInit />
        <UnregisterRootSW />

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

        <main className="flex-grow w-full">
            {children}
        </main>

        </body>

        </html>
    );
}