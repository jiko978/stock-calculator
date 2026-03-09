"use client";

import { QRCodeSVG } from "qrcode.react";

export default function SiteQR() {
    return (
        <div className="flex flex-col items-center gap-2 mt-6">
            <QRCodeSVG
                value="https://jiko-calculator-nine.vercel.app/?utm_source=qr&utm_medium=offline&utm_campaign=site_qr"
                size={120}
                level="H"
                imageSettings={{
                    src: "jiko-calculator-icon2.png",
                    height: 30,
                    width: 30,
                    excavate: true,
                }}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
                JIKO Calculator
            </p>
        </div>
    );
}