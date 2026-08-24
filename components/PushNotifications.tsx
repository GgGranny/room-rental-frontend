"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { usePushNotification } from "@/app/hooks/usePushNotification";

// Non-intrusive opt-in banner: shown only when the browser's notification
// permission is still "default" and the user is authenticated. Dismissable.
export default function PushNotifications() {
    const { permission, requestPermission } = usePushNotification();
    const [dismissed, setDismissed] = useState(false);

    if (permission !== "default" || dismissed) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex max-w-xs items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="rounded-full bg-indigo-50 p-2 dark:bg-indigo-950">
                <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                    Get notified
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                    Enable push notifications for viewing requests, approvals and KYC updates.
                </p>
                <div className="mt-3 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => requestPermission()}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-700"
                    >
                        Enable
                    </button>
                    <button
                        type="button"
                        onClick={() => setDismissed(true)}
                        className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
}