"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-9 h-9 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse" />;
    }

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
            aria-label="Toggle theme"
        >
            {resolvedTheme === "dark" ? (
                <span>🌙 Mode: Dark</span>
            ) : (
                <span>☀️ Mode: Light</span>
            )}
        </button>
    )
}