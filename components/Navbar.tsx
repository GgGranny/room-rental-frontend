"use client";

import { Bell, Search, SlidersHorizontal, User as UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ToggleTheme";
import LogoutButton from "./LogoutButton";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    return (
        <nav>
            <nav className="w-full bg-white border-b border-slate-100 px-6 py-3.5 fixed top-0 z-50 flex items-center justify-between shadow-sm shadow-slate-100/40 dark:bg-slate-900 dark:border-slate-700/50 dark:shadow-slate-900/20 ">
                <ThemeToggle />
                <div className="flex items-center gap-12 flex-1">
                    {/* Logo */}
                    <button onClick={() => router.push("/home")} className="text-xl font-bold text-indigo-600 tracking-tight dark:text-indigo-400">RoomEase</button>

                    {/* Search Bar Container */}
                    <div className="relative w-full max-w-md hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Start your search..."
                            className="w-full pl-11 pr-12 py-2.5 bg-slate-50 border border-slate-200/80 rounded-full text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-slate-800 dark:border-slate-700/80 dark:placeholder:text-slate-500 dark:focus:ring-indigo-500/30 dark:focus:border-indigo-500 dark:text-slate-200"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:bg-slate-100 rounded-full transition-colors">
                            <SlidersHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Mid & Right Nav elements */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
                        <button onClick={() => router.push("/home")} className="text-indigo-600 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600 dark:text-slate-300 dark:after:bg-indigo-400 dark:hover:text-white">Explore</button>
                        <button onClick={() => router.push("/booking")} className="hover:text-slate-800 transition-colors dark:text-slate-300 dark:after:bg-indigo-400 dark:hover:text-white">My Viewings</button>
                        <button onClick={() => router.push("/kyc")} className="hover:text-slate-800 transition-colors dark:text-slate-300 dark:after:bg-indigo-400 dark:hover:text-white">Verify KYC</button>
                    </div>

                    <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

                    <div className="flex items-center gap-2">
                        <NotificationBell />

                        {/* Profile dropdown */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen((prev) => !prev)}
                                className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer"
                            >
                                <UserIcon className="w-4 h-4 text-slate-500 dark:text-slate-300" />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-11 w-48 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-lg z-40 overflow-hidden">
                                    <div className="py-1">
                                        <button
                                            onClick={() => { setMenuOpen(false); router.push("/profile"); }}
                                            className="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        >
                                            Profile & Settings
                                        </button>
                                        <button
                                            onClick={() => { setMenuOpen(false); router.push("/kyc"); }}
                                            className="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        >
                                            KYC Verification
                                        </button>
                                        <div className="border-t border-slate-100 dark:border-slate-800">
                                            <LogoutButton
                                                label="Sign Out"
                                                showIcon={false}
                                                className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </nav>
    )
}
