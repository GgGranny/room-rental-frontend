"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
    CalendarClock,
    Clock,
    MapPin,
    Building2,
    X,
    Loader2,
    MessageSquare,
    CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useMyTenantSchedules, useCancelSchedule } from "@/app/hooks/useSchedule";
import { ScheduleStatus, ViewingSchedule } from "@/app/services/scheduleService";

const statusBadge: Record<ScheduleStatus, { text: string; cls: string; dot: string }> = {
    PENDING: { text: "Pending", cls: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400", dot: "bg-amber-500" },
    APPROVED: { text: "Approved", cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400", dot: "bg-emerald-500" },
    REJECTED: { text: "Rejected", cls: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400", dot: "bg-red-500" },
    CANCELLED: { text: "Cancelled", cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", dot: "bg-slate-400" },
};

const TABS: { id: "ALL" | ScheduleStatus; label: string }[] = [
    { id: "ALL", label: "All" },
    { id: "PENDING", label: "Pending" },
    { id: "APPROVED", label: "Approved" },
    { id: "REJECTED", label: "Rejected" },
    { id: "CANCELLED", label: "Cancelled" },
];

function formatWhen(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return format(d, "PPP 'at' p");
}

export default function MyViewingRequests() {
    const { data, isPending, isError } = useMyTenantSchedules();
    const cancel = useCancelSchedule();
    const [tab, setTab] = useState<"ALL" | ScheduleStatus>("ALL");

    const schedules = useMemo(() => (data as ViewingSchedule[] | undefined) ?? [], [data]);
    const filtered = useMemo(
        () => (tab === "ALL" ? schedules : schedules.filter((s) => s.status === tab)),
        [schedules, tab],
    );

    const onCancel = async (scheduleId: string) => {
        try {
            await cancel.mutateAsync(scheduleId);
            toast.success("Viewing request cancelled.");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not cancel this request.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">My Viewing Requests</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Track the room tours you&apos;ve requested and the host&apos;s responses.</p>
                </div>

                {/* FILTER TABS */}
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-full sm:w-auto sm:inline-flex overflow-x-auto">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                tab === t.id
                                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* LIST STATES */}
                {isPending ? (
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-28 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 animate-pulse" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Could not load your viewing requests. Please try again.</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                        <CalendarClock className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {tab === "ALL" ? "No viewing requests yet" : `No ${statusBadge[tab as ScheduleStatus].text.toLowerCase()} requests`}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Browse rooms and schedule a tour to get started.</p>
                        <Link
                            href="/home"
                            className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
                        >
                            Explore Rooms
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((s) => {
                            const badge = statusBadge[s.status] ?? statusBadge.CANCELLED;
                            const place = s.roomLocation || s.propertyName || "Nepal";
                            return (
                                <div
                                    key={s.scheduleId}
                                    className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div className="space-y-2 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Link
                                                    href={`/room/${s.roomId}`}
                                                    className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate"
                                                >
                                                    {s.roomTitle || "Room viewing"}
                                                </Link>
                                                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-wider uppercase flex items-center gap-1.5 ${badge.cls}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} /> {badge.text}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {place}</span>
                                                {s.propertyName && <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" /> {s.propertyName}</span>}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                                                <Clock className="w-4 h-4 text-indigo-500" /> {formatWhen(s.scheduledAt)}
                                            </div>
                                            {s.note && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5 max-w-xl">
                                                    <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                                                    <span className="italic">&ldquo;{s.note}&rdquo;</span>
                                                </p>
                                            )}
                                            {s.responseNote && (s.status === "APPROVED" || s.status === "REJECTED") && (
                                                <p className={`text-xs flex items-start gap-1.5 max-w-xl font-medium ${s.status === "APPROVED" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                                                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                                    <span>Host: {s.responseNote}</span>
                                                </p>
                                            )}
                                        </div>

                                        {s.status === "PENDING" && (
                                            <button
                                                onClick={() => onCancel(s.scheduleId)}
                                                disabled={cancel.isPending}
                                                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 rounded-xl transition-all disabled:opacity-60"
                                            >
                                                {cancel.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
