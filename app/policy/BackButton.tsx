"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BackButton({ children, className }: { children: React.ReactNode, className?: string }) {
    const [backUrl, setBackUrl] = useState("/");

    useEffect(() => {
        if (typeof document !== "undefined" && document.referrer && document.referrer.includes("/calculator")) {
            setBackUrl("/calculator");
        }
    }, []);

    return (
        <Link href={backUrl} className={className}>
            {children}
        </Link>
    );
}
