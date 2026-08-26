"use client";

import { useState } from "react";
import { Calendar, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useCreateSchedule } from "@/app/hooks/useSchedule";

// Tenant-facing modal to request a room viewing (replaces the old booking flow).
// The landlord later approves or rejects the request.
export default function ScheduleViewingModal({
    roomId,
    roomTitle,
    open,
    onClose,
}: {
    roomId: string;
    roomTitle?: string;
    open: boolean;
    onClose: () => void;
}) {
    const [scheduledAt, setScheduledAt] = useState("");
    const [note, setNote] = useState("");
    const createSchedule = useCreateSchedule();

    if (!open) return null;

    const submit = async () => {
        if (!scheduledAt) {
            toast.error("Please pick a date and time for your visit.");
            return;
        }
        // Guard against past times before hitting the API.
        if (new Date(scheduledAt).getTime() < Date.now()) {
            toast.error("Please choose a time in the future.");
            return;
        }
        try {
            await createSchedule.mutateAsync({ roomId, scheduledAt, note: note.trim() || undefined });
            toast.success("Viewing request sent! The landlord will respond soon.");
            setScheduledAt("");
            setNote("");
            onClose();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not send your viewing request.");
        }
    };

    // z-[1100] keeps the dialog above Leaflet map controls (z-index 1000) on
    // pages like /nearby and /room/[id] that render a map behind it.
    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Schedule a Viewing</h3>
                        {roomTitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{roomTitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Preferred date & time
                    </label>
                    <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                        Note to landlord (optional)
                    </label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        placeholder="e.g. I'd like to see the room this weekend if possible."
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 resize-none"
                    />
                </div>

                <button
                    onClick={submit}
                    disabled={createSchedule.isPending}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 px-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
                >
                    {createSchedule.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Send Viewing Request
                </button>
                <p className="text-[11px] text-slate-400 text-center font-medium">
                    You're requesting a tour — no payment is required.
                </p>
            </div>
        </div>
    );
}
