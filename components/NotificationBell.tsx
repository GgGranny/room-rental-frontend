"use client";

import { Bell } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { notificationService, AppNotification } from "@/app/services/notificationService";
import { useEffect, useRef, useState } from "react";

const key = ["notifications"];

// Navigate to the resource a notification refers to, using existing routes.
// Mirrors the backend NotificationType → action mapping.
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
        case "ROOMMATE_REQUEST":
        case "ROOMMATE_REQUEST_ACCEPTED":
        case "ROOMMATE_REQUEST_REJECTED":
            return "/roommates";
        default:
            return "/home";
    }
}

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const box = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const router = useRouter();
    const { data = [], refetch } = useQuery({ queryKey: key, queryFn: async () => (await notificationService.getAll()).data, retry: false });
    const markRead = useMutation({ mutationFn: notificationService.markRead, onSuccess: () => queryClient.invalidateQueries({ queryKey: key }) });
    const markAllRead = useMutation({ mutationFn: notificationService.markAllRead, onSuccess: () => queryClient.invalidateQueries({ queryKey: key }) });
    const unread = data.filter(item => !item.read).length;
    useEffect(() => { const refresh = () => { queryClient.invalidateQueries({ queryKey: key }); }; window.addEventListener("room-notification", refresh); return () => window.removeEventListener("room-notification", refresh); }, [queryClient]);
    useEffect(() => { const close = (event: MouseEvent) => { if (!box.current?.contains(event.target as Node)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
    const openMenu = () => { setOpen(value => !value); if (!open) refetch(); };
    const view = (item: AppNotification) => {
        if (!item.read) markRead.mutate(item.id);
        setOpen(false);
        router.push(routeFor(item));
    };
    return (
        <div ref={box} className="relative">
            <button
                onClick={openMenu}
                aria-label="Notifications"
                className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                    <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">
                        {unread > 9 ? "9+" : unread}
                    </span>
                )}
            </button>
            {open && (
                <div className="absolute right-0 top-11 z-[60] w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                        <p className="text-sm font-semibold">Notifications</p>
                        {unread > 0 && (
                            <button
                                onClick={() => markAllRead.mutate()}
                                disabled={markAllRead.isPending}
                                className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                                Mark all as read
                            </button>
                        )}
                        {unread === 0 && <span className="text-xs text-slate-500">All caught up</span>}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {data.length === 0 ? (
                            <p className="p-6 text-center text-sm text-slate-500">No notifications yet.</p>
                        ) : (
                            data.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => view(item)}
                                    className={`block w-full border-b border-slate-100 px-4 py-3 text-left last:border-0 dark:border-slate-800 ${item.read ? "" : "bg-indigo-50/70 dark:bg-indigo-950/20"}`}
                                >
                                    <p className="text-xs font-semibold flex items-center gap-2">
                                        {!item.read && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />}
                                        {item.title}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">{item.body}</p>
                                    <p className="mt-1 text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
                                </button>
                            ))
                        )}
                    </div>
                    <div className="border-t border-slate-100 bg-slate-50/50 p-2.5 text-center dark:border-slate-800 dark:bg-slate-900/50">
                        <button
                            onClick={() => {
                                setOpen(false);
                                router.push("/notifications");
                            }}
                            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                            View all notifications →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
