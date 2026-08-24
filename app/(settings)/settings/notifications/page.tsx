"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BellOff, CheckCheck } from "lucide-react";
import { notificationService, AppNotification } from "@/app/services/notificationService";

const key = ["notifications"];

// Route a notification to the resource it refers to (existing routes only).
function routeFor(item: AppNotification): string {
    switch (item.type) {
        case "VIEWING_REQUEST":
        case "VIEWING_CANCELLED":
            return "/landlord/schedules";
        case "VIEWING_ACCEPTED":
        case "VIEWING_REJECTED":
            return "/booking";
        case "PROPERTY_APPROVED":
        case "PROPERTY_REJECTED":
            return "/landlord/properties";
        case "KYC_APPROVED":
        case "KYC_REJECTED":
            return "/settings/kyc";
        case "PAYMENT_SUCCESS":
        case "PAYMENT_FAILED":
            return "/landlord/featured";
        default:
            return "/home";
    }
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

// Settings → Notifications. In-app notification history from the backend
// (the same store the FCM pushes originate from), with read/unread support.
export default function SettingsNotificationsPage() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { data = [], isPending } = useQuery({
        queryKey: key,
        queryFn: async () => (await notificationService.getAll()).data,
        retry: false,
    });
    const markRead = useMutation({
        mutationFn: notificationService.markRead,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
    });
    const markAllRead = useMutation({
        mutationFn: notificationService.markAllRead,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
    });

    const unread = data.filter((item) => !item.read).length;

    const openNotification = (item: AppNotification) => {
        if (!item.read) markRead.mutate(item.id);
        router.push(routeFor(item));
    };

    return (
        <section className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notification History</h2>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {unread > 0 ? `${unread} unread notification${unread === 1 ? "" : "s"}` : "You're all caught up."}
                    </p>
                </div>
                {unread > 0 && (
                    <button
                        onClick={() => markAllRead.mutate()}
                        disabled={markAllRead.isPending}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50"
                    >
                        <CheckCheck className="w-4 h-4" /> Mark all as read
                    </button>
                )}
            </div>

            {isPending ? (
                <div className="p-6 space-y-4" aria-busy="true">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : data.length === 0 ? (
                <div className="p-12 text-center">
                    <BellOff className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No notifications yet.</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Updates about viewings, properties and KYC will appear here.
                    </p>
                </div>
            ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => openNotification(item)}
                                className={`w-full text-left px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${item.read ? "" : "bg-indigo-50/60 dark:bg-indigo-950/20"}`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        {!item.read && <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" aria-label="Unread" />}
                                        {item.title}
                                    </p>
                                    <time className="text-[11px] text-slate-400 shrink-0 whitespace-nowrap" dateTime={item.createdAt}>
                                        {formatTime(item.createdAt)}
                                    </time>
                                </div>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.body}</p>
                                <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full px-2 py-0.5">
                                    {item.type.replaceAll("_", " ").toLowerCase()}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
