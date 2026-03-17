// ─────────────────────────────────────────────────────────
// ShareSheet.tsx — 공통 공유 바텀 시트
// ─────────────────────────────────────────────────────────

"use client";

import { useState } from "react";

interface ShareSheetProps {
    url:         string;
    title:       string;
    description?: string;  // 카카오 공유 설명 (선택)
    onClose:     () => void;
}

export default function ShareSheet({ url, title, description, onClose }: ShareSheetProps) {
    const [linkCopied, setLinkCopied] = useState(false);
    const [kakaoError, setKakaoError] = useState(false);

    // ── 카카오톡 링크형 공유 ──────────────────────────────────
    const shareKakao = () => {
        if (typeof window === "undefined") return;

        // window.Kakao 자체가 없거나 초기화되지 않은 경우 처리
        if (!window.Kakao || typeof window.Kakao.isInitialized !== 'function' || !window.Kakao.isInitialized()) {
            // SDK 미초기화 시 링크 복사로 fallback
            setKakaoError(true);
            copyLink();
            return;
        }

        // 썸네일 이미지 경로 — 로컬 테스트 시에도 이미지를 보여주기 위해 실제 서버 주소 사용
        const thumbnailUrl = `https://jiko.kr/calculator/jiko-calculator-icon2.png`;

        // 로컬 주소인 경우 jiko.kr로 강제 치환 (상단 이미지/텍스트/버튼 링크 통일)
        const shareUrl = url.includes("localhost") 
            ? url.replace(/http:\/\/localhost:\d+/, "https://jiko.kr") 
            : url;

        try {
            window.Kakao.Share.sendDefault({
                objectType: "feed",
                content: {
                    title,
                    description: description ?? "JIKO 계산기 - 계산은 정확히 해야해요",
                    imageUrl: thumbnailUrl,
                    link: {
                        mobileWebUrl: shareUrl,
                        webUrl: shareUrl,
                    },
                },
                buttons: [
                    {
                        title: "정확히 계산하러 가기",
                        link: {
                            mobileWebUrl: shareUrl,
                            webUrl: shareUrl,
                        },
                    },
                ],
            });
            onClose();
        } catch (e) {
            console.error("Kakao share execution failed:", e);
            setKakaoError(true);
            copyLink();
        }
    };

    // ── 링크 복사 ─────────────────────────────────────────────
    const copyLink = async () => {
        await navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => { setLinkCopied(false); onClose(); }, 1500);
    };

    // ── X (트위터) ────────────────────────────────────────────
    const shareTwitter = () => {
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            "_blank"
        );
        onClose();
    };

    // ── 네이티브 공유 (모바일) ────────────────────────────────
    const shareNative = async () => {
        if (navigator.share) {
            await navigator.share({ title, url });
            onClose();
        }
    };

    const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

    return (
        <>
            {/* 딤 배경 */}
            <div className="fixed inset-0 bg-black/40 z-[9998]" onClick={onClose} />

            {/* 시트 */}
            <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
                <div className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl px-5 pt-5 pb-10 max-w-lg mx-auto">

                    {/* 핸들 바 */}
                    <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-5" />

                    <p className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 mb-6">
                        공유하기
                    </p>

                    {/* 카카오 SDK 오류 안내 */}
                    {kakaoError && (
                        <p className="text-center text-xs text-red-400 mb-4">
                            카카오 SDK 초기화 실패 — 링크가 복사되었습니다.
                        </p>
                    )}

                    {/* 아이콘 그리드 */}
                    <div className="flex justify-center gap-8 mb-7">

                        {/* 카카오톡 */}
                        <ShareIcon label="카카오톡" onClick={shareKakao} bg="bg-[#FEE500]">
                            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#3C1E1E">
                                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.556 5.08 3.923 6.537L5 21l4.13-2.406A11.3 11.3 0 0012 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
                            </svg>
                        </ShareIcon>

                        {/* X (트위터) */}
                        <ShareIcon label="X(트위터)" onClick={shareTwitter} bg="bg-black">
                            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </ShareIcon>

                        {/* 링크 복사 */}
                        <ShareIcon
                            label={linkCopied ? "복사됨!" : "링크 복사"}
                            onClick={copyLink}
                            bg={linkCopied ? "bg-green-500" : "bg-gray-100 dark:bg-gray-700"}
                        >
                            {linkCopied ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            )}
                        </ShareIcon>

                        {/* 더보기 — 네이티브 공유 지원 기기만 */}
                        {hasNativeShare && (
                            <ShareIcon label="더보기" onClick={shareNative} bg="bg-gray-100 dark:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                            </ShareIcon>
                        )}
                    </div>

                    {/* 취소 */}
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-[0.98] transition-all"
                    >
                        취소
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.28s cubic-bezier(0.32, 0.72, 0, 1);
        }
      `}</style>
        </>
    );
}

// ── 아이콘 버튼 서브 컴포넌트 ─────────────────────────────
function ShareIcon({
                       label, onClick, bg, children,
                   }: {
    label:    string;
    onClick:  () => void;
    bg:       string;
    children: React.ReactNode;
}) {
    return (
        <button onClick={onClick} className="flex flex-col items-center gap-2 group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-active:scale-90 transition-transform duration-150 ${bg}`}>
                {children}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{label}</span>
        </button>
    );
}