"use client";

import { Bell } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService, AppNotification } from "@/app/services/notificationService";
import { useEffect, useRef, useState } from "react";

const key = ["notifications"];

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const box = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const { data = [], refetch } = useQuery({ queryKey: key, queryFn: async () => (await notificationService.getAll()).data, retry: false });
    const markRead = useMutation({ mutationFn: notificationService.markRead, onSuccess: () => queryClient.invalidateQueries({ queryKey: key }) });
    const unread = data.filter(item => !item.read).length;
    useEffect(() => { const refresh = () => { queryClient.invalidateQueries({ queryKey: key }); }; window.addEventListener("room-notification", refresh); return () => window.removeEventListener("room-notification", refresh); }, [queryClient]);
    useEffect(() => { const close = (event: MouseEvent) => { if (!box.current?.contains(event.target as Node)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
    const openMenu = () => { setOpen(value => !value); if (!open) refetch(); };
    const view = (item: AppNotification) => { if (!item.read) markRead.mutate(item.id); };
    return <div ref={box} className="relative"><button onClick={openMenu} aria-label="Notifications" className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"><Bell className="h-5 w-5" />{unread > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">{unread > 9 ? "9+" : unread}</span>}</button>{open && <div className="absolute right-0 top-11 z-[60] w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800"><p className="text-sm font-semibold">Notifications</p><span className="text-xs text-slate-500">{unread} unread</span></div><div className="max-h-96 overflow-y-auto">{data.length === 0 ? <p className="p-6 text-center text-sm text-slate-500">No notifications yet.</p> : data.map(item => <button key={item.id} onClick={() => view(item)} className={`block w-full border-b border-slate-100 px-4 py-3 text-left last:border-0 dark:border-slate-800 ${item.read ? "" : "bg-indigo-50/70 dark:bg-indigo-950/20"}`}><p className="text-xs font-semibold">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.body}</p><p className="mt-1 text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</p></button>)}</div></div>}</div>;
}
