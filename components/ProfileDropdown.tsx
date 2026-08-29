"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Settings, ShieldCheck, User as UserIcon } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { useMyProfile } from "@/app/hooks/useAuth";

// Shared avatar dropdown used by the main Navbar and the landlord/admin navs.
// Shows the authenticated user's own name/email/avatar and links to their
// profile, settings and KYC pages. Sign Out reuses the existing logout flow.
export default function ProfileDropdown() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { data } = useMyProfile();
    const profile = data?.data;
    const role = profile?.role;
    const fullName = [profile?.fname, profile?.lname].filter(Boolean).join(" ") || "Your account";
    const initials =
        [profile?.fname?.[0], profile?.lname?.[0]].filter(Boolean).join("").toUpperCase() || "U";

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    const go = (path: string) => {
        setOpen(false);
        router.push(path);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="flex items-center gap-1.5 cursor-pointer"
            >
                <span className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                    {profile?.profilePictureUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={profile.profilePictureUrl}
                            alt={fullName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-300">{initials}</span>
                    )}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-11 w-60 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-lg z-40 overflow-hidden"
                >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center shrink-0">
                            {profile?.profilePictureUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={profile.profilePictureUrl}
                                    alt={fullName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserIcon className="w-4 h-4 text-indigo-500" />
                            )}
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{fullName}</p>
                            <p className="text-xs text-slate-400 truncate">{profile?.email ?? ""}</p>
                        </div>
                    </div>
                    <div className="py-1">
                        <button
                            role="menuitem"
                            onClick={() => go("/profile")}
                            className="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                            <UserIcon className="w-3.5 h-3.5 text-slate-400" /> Profile
                        </button>
                        <button
                            role="menuitem"
                            onClick={() => go("/settings")}
                            className="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                            <Settings className="w-3.5 h-3.5 text-slate-400" /> Settings
                        </button>
                        {role !== "ROLE_ADMIN" && (
                            <button
                                role="menuitem"
                                onClick={() => go(role === "ROLE_LANDLORD" ? "/landlord/kyc" : "/settings/kyc")}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                            >
                                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> My KYC
                            </button>
                        )}
                        <div className="border-t border-slate-100 dark:border-slate-800">
                            <LogoutButton
                                label="Sign Out"
                                showIcon={false}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
