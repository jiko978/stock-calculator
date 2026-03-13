"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PWAInstallContextType {
    deferredPrompt: any;
    canInstall: boolean;
    showInstallPrompt: () => Promise<void>;
}

const PWAInstallContext = createContext<PWAInstallContextType | undefined>(undefined);

export function PWAInstallProvider({ children }: { children: React.ReactNode }) {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [canInstall, setCanInstall] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            setCanInstall(true);
            console.log("PWA install prompt captured");
        };

        const handleAppInstalled = () => {
            setCanInstall(false);
            setDeferredPrompt(null);
            console.log("PWA was installed");
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    const showInstallPrompt = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA install outcome: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setCanInstall(false);
    };

    return (
        <PWAInstallContext.Provider value={{ deferredPrompt, canInstall, showInstallPrompt }}>
            {children}
        </PWAInstallContext.Provider>
    );
}

export function usePWAInstall() {
    const context = useContext(PWAInstallContext);
    if (context === undefined) {
        throw new Error("usePWAInstall must be used within a PWAInstallProvider");
    }
    return context;
}
