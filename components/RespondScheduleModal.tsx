"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useRespondToSchedule } from "@/app/hooks/useSchedule";
import { ViewingSchedule } from "@/app/services/scheduleService";

// Landlord-facing modal to approve or reject a tenant's viewing request.
// `decision` fixes which action the modal confirms; the response note is optional.
export default function RespondScheduleModal({
    schedule,
    decision,
    open,
    onClose,
}: {
    schedule: ViewingSchedule | null;
    decision: "APPROVED" | "REJECTED";
    open: boolean;
    onClose: () => void;
}) {
    const [responseNote, setResponseNote] = useState("");
    const respond = useRespondToSchedule();

    if (!open || !schedule) return null;

    const isApprove = decision === "APPROVED";

    const submit = async () => {
        try {
            await respond.mutateAsync({
                scheduleId: schedule.scheduleId,
                status: decision,
                responseNote: responseNote.trim() || undefined,
            });
            toast.success(isApprove ? "Viewing approved." : "Viewing request rejected.");
            setResponseNote("");
            onClose();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not submit your response.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                isApprove
                                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                                    : "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                            }`}
                        >
                            {isApprove ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                {isApprove ? "Approve viewing" : "Reject request"}
                            </h3>
                            {schedule.roomTitle && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{schedule.roomTitle}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                    {isApprove
                        ? `Confirm the tour with ${schedule.tenantName || "the tenant"}. They'll be notified it's approved.`
                        : `Let ${schedule.tenantName || "the tenant"} know this time doesn't work. You can suggest another time in the note.`}
                </p>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                        Message to tenant (optional)
                    </label>
                    <textarea
                        value={responseNote}
                        onChange={(e) => setResponseNote(e.target.value)}
                        rows={3}
                        placeholder={
                            isApprove
                                ? "e.g. See you then! Please call when you arrive at the gate."
                                : "e.g. Sorry, I'm away that day — could you do the following weekend?"
                        }
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 resize-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onClose}
                        className="h-11 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        disabled={respond.isPending}
                        className={`h-11 rounded-xl text-sm font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 ${
                            isApprove
                                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10"
                                : "bg-red-600 hover:bg-red-700 shadow-red-600/10"
                        }`}
                    >
                        {respond.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isApprove ? "Approve" : "Reject"}
                    </button>
                </div>
            </div>
        </div>
    );
}
