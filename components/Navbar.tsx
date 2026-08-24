"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ToggleTheme";
import ProfileDropdown from "./ProfileDropdown";
import NotificationBell from "./NotificationBell";

const NAV_LINKS = [
    { label: "Explore", href: "/home" },
    { label: "My Viewings", href: "/booking" },
];

// Main user navbar. Profile/Settings/KYC/Sign-out live in ProfileDropdown;
// notifications live in NotificationBell. No duplicated KYC entry point here.
export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <nav className="w-full bg-white border-b border-slate-100 px-6 py-3.5 fixed top-0 z-50 flex items-center justify-between shadow-sm shadow-slate-100/40 dark:bg-slate-900 dark:border-slate-700/50 dark:shadow-slate-900/20">
            {/* <ThemeToggle /> */}
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
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:bg-slate-100 rounded-full transition-colors" aria-label="Search filters">
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Mid & Right Nav elements */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                        return (
                            <button
                                key={link.href}
                                onClick={() => router.push(link.href)}
                                aria-current={isActive ? "page" : undefined}
                                className={`relative py-1 transition-colors ${isActive
                                    ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600 dark:text-indigo-300 dark:after:bg-indigo-400"
                                    : "hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"}
                                `}
                            >
                                {link.label}
                            </button>
                        );
                    })}
                </div>

                <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

                <div className="flex items-center gap-2">
                    <NotificationBell />
                    <ProfileDropdown />
                </div>
            </div>
        </nav>
    );
}
