"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Bell, BellOff, Loader2, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import {
    isPushPreferenceEnabled,
    setPushPreference,
    usePushNotification,
} from "@/app/hooks/usePushNotification";
import { notificationService } from "@/app/services/notificationService";

// Settings → Preferences. Theme integrates with the existing next-themes
// provider; push notifications integrate with the existing FCM hook
// (register/remove token) — no second notification implementation.
export default function SettingsPreferencesPage() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [pushEnabled, setPushEnabled] = useState(true);
    const [busy, setBusy] = useState(false);
    const { requestPermission } = usePushNotification();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe mount flag + one-time local preference read
        setMounted(true);
        setPushEnabled(isPushPreferenceEnabled());
    }, []);

    const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

    const togglePush = async () => {
        if (busy) return;
        setBusy(true);
        try {
            if (!pushEnabled) {
                // Turning ON: clear the opt-out flag, ask permission only when
                // appropriate and register/refresh the FCM token.
                setPushPreference(true);
                const ok = await requestPermission();
                if (!ok && typeof Notification !== "undefined" && Notification.permission === "denied") {
                    // Permission blocked — keep the toggle off but remember intent.
                    toast.error("Notifications are blocked in your browser settings.");
                    setPushPreference(false);
                    setPushEnabled(false);
                    return;
                }
                setPushEnabled(true);
            } else {
                // Turning OFF: remove this device's FCM token and stop using push.
                setPushPreference(false);
                setPushEnabled(false);
                await notificationService.removeToken().catch(() => undefined);
                toast.success("Push notifications turned off");
            }
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            {/* APPEARANCE */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Appearance</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose how the application looks.</p>

                <div className="mt-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                            {mounted && resolvedTheme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                {mounted ? (resolvedTheme === "dark" ? "Dark theme" : "Light theme") : "Theme"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Applies immediately across the app.</p>
                        </div>
                    </div>

                    {/* Light / Dark switch */}
                    <button
                        type="button"
                        role="switch"
                        aria-checked={mounted ? resolvedTheme === "dark" : false}
                        aria-label="Toggle dark mode"
                        disabled={!mounted}
                        onClick={toggleTheme}
                        className={`relative w-12 h-7 rounded-full transition-colors shrink-0 cursor-pointer ${mounted && resolvedTheme === "dark" ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"}`}
                    >
                        <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${mounted && resolvedTheme === "dark" ? "left-6" : "left-1"}`} />
                    </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    {(["light", "dark"] as const).map((mode) => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => setTheme(mode)}
                            className={`rounded-2xl border p-3 text-left transition-colors cursor-pointer ${(mounted ? theme === mode : mode === "light")
                                ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30"
                                : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800"}`}
                        >
                            <span className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                                {mode === "light" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                {mode === "light" ? "Light" : "Dark"}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* PUSH NOTIFICATIONS */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notifications</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Receive important updates from the application.</p>

                <div className="mt-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${pushEnabled ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                            {pushEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Push notifications</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {pushEnabled ? "On for this device." : "Off for this device."}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        role="switch"
                        aria-checked={pushEnabled}
                        aria-label="Toggle push notifications"
                        onClick={togglePush}
                        disabled={busy || !mounted}
                        className="relative shrink-0 cursor-pointer disabled:opacity-60"
                    >
                        <span className={`block w-12 h-7 rounded-full transition-colors ${pushEnabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`} />
                        <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${pushEnabled ? "left-6" : "left-1"}`} />
                        {busy && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                            </span>
                        )}
                    </button>
                </div>

                <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                    In-app notification history is always available under Settings → Notifications.
                </p>
            </section>
        </>
    );
}
