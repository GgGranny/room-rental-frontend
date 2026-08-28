"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Building2, Calendar, LayoutDashboard, Sparkles } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import NotificationBell from "./NotificationBell";

const NAV_LINKS = [
    { label: "Dashboard", href: "/landlord", icon: LayoutDashboard },
    { label: "Properties", href: "/landlord/properties", icon: Building2 },
    { label: "Schedules", href: "/landlord/schedules", icon: Calendar },
    { label: "Featured", href: "/landlord/featured", icon: Sparkles },
];

// Landlord top navigation. Reuses the shared ProfileDropdown/NotificationBell
// so profile, settings, KYC and notifications behave identically to the tenant
// navbar — only the role-specific nav links differ.
export default function LandlordNavbar() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <nav className="w-full bg-white border-b border-slate-100 px-6 py-3.5 fixed top-0 z-50 flex items-center justify-between shadow-sm shadow-slate-100/40 dark:bg-slate-900 dark:border-slate-700/50 dark:shadow-slate-900/20">
            <div className="flex items-center gap-12 flex-1">
                {/* Logo */}
                <button onClick={() => router.push("/landlord")} className="text-xl font-bold text-indigo-600 tracking-tight dark:text-indigo-400">RoomEase</button>
            </div>

            {/* Mid & Right Nav elements */}
            <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-6 text-xs font-medium text-slate-500">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                        return (
                            <button
                                key={link.href}
                                onClick={() => router.push(link.href)}
                                aria-current={isActive ? "page" : undefined}
                                className={`relative py-1 transition-colors inline-flex items-center gap-1.5 ${isActive
                                    ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600 dark:text-indigo-300 dark:after:bg-indigo-400"
                                    : "hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"}
                                `}
                            >
                                <link.icon className="w-3.5 h-3.5" />
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