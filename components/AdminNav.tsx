"use client"

import { HelpCircle, Search } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useLogout } from '@/app/hooks/useAuth'
import NotificationBell from '@/components/NotificationBell'

type PopupTypes = "profile"

export default function AdminNav() {
    const [popup, setPopup] = useState<PopupTypes | null>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const profileBtnRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();
    const logoutMutation = useLogout();

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
            toast.success("Signed out");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            router.push("/login");
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            const clickedInsidePopup = popupRef.current?.contains(target);
            const clickedProfileBtn = profileBtnRef.current?.contains(target);

            if (!clickedInsidePopup && !clickedProfileBtn) {
                setPopup(null);
            }
        }

        if (popup) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popup]);

    const togglePopup = (type: PopupTypes) => {
        setPopup((prev) => (prev === type ? null : type));
    };

    return (
        <div>
            <header className="h-16 border-b border-slate-200/60 bg-white dark:border-slate-900 dark:bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-30">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search portfolio, bookings, or guests..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                </div>

                <div className="flex items-center gap-4 shrink-0 relative">
                    <NotificationBell />

                    <button className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 transition-all">
                        <HelpCircle className="w-4 h-4" />
                    </button>

                    <div className="relative">
                        <button
                            ref={profileBtnRef}
                            onClick={() => togglePopup("profile")}
                            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                                alt="Account Holder Avatar"
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                            />
                        </button>

                        {popup === "profile" && (
                            <div
                                ref={popupRef}
                                className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-lg z-40 overflow-hidden"
                            >
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Account Holder</p>
                                    <p className="text-xs text-slate-400 mt-0.5">admin@example.com</p>
                                </div>
                                <div className="py-1">
                                    <button
                                        onClick={() => { setPopup(null); router.push("/profile"); }}
                                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                                    >
                                        Profile Settings
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        disabled={logoutMutation.isPending}
                                        className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-t border-slate-100 dark:border-slate-800 disabled:opacity-50"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </div>
    )
}
