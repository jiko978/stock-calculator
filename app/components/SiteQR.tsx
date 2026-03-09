"use client";

import { QRCodeSVG } from "qrcode.react";

export default function SiteQR() {
    return (
        <div className="flex flex-col items-center gap-2 mt-6">
            <QRCodeSVG
                value="https://jiko-calculator.vercel.app"
                size={100}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
            </p>
        </div>
    );
}