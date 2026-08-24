"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";

// Small confirmation dialog following the app's existing modal styling
// (see ScheduleViewingModal). Used e.g. for sign-out confirmation.
export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    destructive = false,
    pending = false,
    onConfirm,
    onCancel,
    confirmSlot,
}: {
    open: boolean;
    title: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    pending?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    /** Optional custom confirm action (e.g. LogoutButton) replacing the built-in button. */
    confirmSlot?: React.ReactNode;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${destructive ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400" : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"}`}>
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{title}</h3>
                    </div>
                    <button
                        onClick={onCancel}
                        aria-label="Close"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                {message && <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={pending}
                        className="text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    {confirmSlot ?? (
                        <button
                            onClick={onConfirm}
                            disabled={pending}
                            className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl text-white transition-all disabled:opacity-60 ${destructive ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
                        >
                            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {confirmLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
