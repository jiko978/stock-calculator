"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_ID = "G-VHLZBZWZC8";

export default function PageViewTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = pathname + searchParams.toString();

        window.gtag("config", GA_ID, {
            page_path: url,
        });
    }, [pathname, searchParams]);

    return null;
}