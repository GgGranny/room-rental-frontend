"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, FileCheck2, RefreshCcw, ShieldCheck, XCircle } from "lucide-react";
import { useMyProfile } from "@/app/hooks/useAuth";

// Settings → KYC. Reflects the actual backend statuses: no record =
// not submitted; otherwise PENDING / APPROVED / REJECTED (KycStatus enum).
export default function SettingsKycPage() {
    const { data, isPending } = useMyProfile();
    const user = data?.data;
    const isAdmin = user?.role === "ROLE_ADMIN";
    // Landlords submit/manage KYC under their dashboard; tenants use /kyc.
    const kycHref = user?.role === "ROLE_LANDLORD" ? "/landlord/kyc" : "/kyc";

    return (
        <section className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">KYC Status</h2>

            {isPending && (
                <div className="mt-4 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" aria-busy="true" />
            )}

            {!isPending && isAdmin && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 p-4">
                    <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-300 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Super Admin account</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Super Admin accounts do not require KYC verification.
                        </p>
                    </div>
                </div>
            )}

            {!isPending && !isAdmin && user && !user.kycSubmitted && (
                <NotSubmitted kycHref={kycHref} />
            )}

            {!isPending && !isAdmin && user?.kycSubmitted && user.kycStatus === "PENDING" && (
                <StateBlock
                    icon={<Clock3 className="w-6 h-6 text-amber-600 dark:text-amber-300" />}
                    badge="Under Review"
                    badgeClass="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                    title="Your verification is in progress."
                    message="Our team is reviewing your documents. You will be notified once a decision is made."
                />
            )}

            {!isPending && !isAdmin && user?.kycSubmitted && user.kycStatus === "APPROVED" && (
                <StateBlock
                    icon={<CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />}
                    badge="Verified"
                    badgeClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                    title="Your identity has been verified."
                    message="You have full access to all features that require verification."
                    action={
                        <Link href={kycHref} className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                            View verification details
                        </Link>
                    }
                />
            )}

            {!isPending && !isAdmin && user?.kycSubmitted && user.kycStatus === "REJECTED" && (
                <StateBlock
                    icon={<XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />}
                    badge="Rejected"
                    badgeClass="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"
                    title="Your verification was rejected."
                    message="Please review your submitted documents and resubmit with correct information."
                    action={
                        <Link href={kycHref} className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all">
                            <RefreshCcw className="w-4 h-4" /> Resubmit KYC
                        </Link>
                    }
                />
            )}
        </section>
    );
}

function NotSubmitted({ kycHref }: { kycHref: string }) {
    return (
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 p-4">
            <FileCheck2 className="w-6 h-6 text-slate-400 shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Not submitted</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Verify your identity to unlock landlord features such as posting rooms.
                    </p>
                </div>
                <Link
                    href={kycHref}
                    className="shrink-0 inline-flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
                >
                    Complete KYC
                </Link>
            </div>
        </div>
    );
}

function StateBlock({
    icon,
    badge,
    badgeClass,
    title,
    message,
    action,
}: {
    icon: React.ReactNode;
    badge: string;
    badgeClass: string;
    title: string;
    message: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="mt-4 flex items-start gap-3 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 p-4">
            {icon}
            <div className="space-y-2 w-full">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${badgeClass}`}>{badge}</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{message}</p>
                {action}
            </div>
        </div>
    );
}
