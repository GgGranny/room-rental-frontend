"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, FileCheck2, Settings as SettingsIcon, UserRound } from "lucide-react";

const SECTIONS = [
    { href: "/settings/profile", label: "Profile", icon: UserRound },
    { href: "/settings/preferences", label: "Preferences", icon: SettingsIcon },
    { href: "/settings/kyc", label: "KYC", icon: FileCheck2 },
    { href: "/settings/notifications", label: "Notifications", icon: Bell },
];

// Settings shell with its own sidebar. On mobile the sidebar becomes a
// horizontal tab bar so it never breaks the content layout.
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    return (
        <div className="pt-20 pb-16">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-6">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Settings</h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your account, appearance and notifications.</p>
                </header>

                {/* Mobile: horizontal tabs */}
                <nav aria-label="Settings sections" className="lg:hidden flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
                    {SECTIONS.map((section) => {
                        const active = isActive(section.href);
                        return (
                            <Link
                                key={section.href}
                                href={section.href}
                                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition-colors ${active
                                    ? "bg-indigo-600 border-indigo-600 text-white"
                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                            >
                                <section.icon className="w-3.5 h-3.5" />
                                {section.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex gap-8">
                    {/* Desktop sidebar */}
                    <aside className="hidden lg:block w-56 shrink-0">
                        <nav aria-label="Settings sections" className="sticky top-24 space-y-1">
                            {SECTIONS.map((section) => {
                                const active = isActive(section.href);
                                return (
                                    <Link
                                        key={section.href}
                                        href={section.href}
                                        aria-current={active ? "page" : undefined}
                                        className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${active
                                            ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"}`}
                                    >
                                        <section.icon className={`w-4 h-4 ${active ? "text-indigo-600 dark:text-indigo-300" : "text-slate-400"}`} />
                                        {section.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    <section className="min-w-0 flex-1 space-y-6">{children}</section>
                </div>
            </main>
        </div>
    );
}
