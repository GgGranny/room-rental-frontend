"use client";

import {
    AlertCircle,
    BedDouble,
    Loader2,
    MoonStar,
    PawPrint,
    Sparkles,
    Sun,
    User as UserIcon,
    Wallet,
    X,
} from "lucide-react";

import { useRequestProfile } from "@/app/hooks/useRoommate";
import type { RoommateProfile, RoommateRequestItem } from "@/app/services/roommateService";

// "Click a request → view the tenant's details" step. The counterpart's PUBLIC
// roommate-matching fields are fetched from an authenticated, participant-only
// endpoint (the backend returns 403 for non-participants and never exposes
// phone/email/KYC/private data). Header info comes from the request itself so it
// paints instantly while the profile loads.
export default function RoommateRequestDetailModal({
    open,
    onClose,
    request,
    perspective,
    children,
}: {
    open: boolean;
    onClose: () => void;
    request: RoommateRequestItem | null;
    perspective: "sent" | "received";
    children?: React.ReactNode;
}) {
    // Only fetch while the modal is actually open for a real request.
    const activeId = open && request ? request.id : undefined;
    const { data, isLoading, isError, error } = useRequestProfile(activeId);

    if (!open || !request) return null;

    const other = perspective === "sent" ? request.recipient : request.requester;
    const profile = data?.profile;
    const name = profile?.name || other.name;
    const avatar = profile?.profilePictureUrl || other.profilePictureUrl;
    const forbidden = isError && /403|not have|permission|forbidden/i.test(errorMessage(error));
    const lifestyle = profile ? lifestyleChips(profile) : [];
    const hasDetails = Boolean(profile && (profile.bio || profile.budget != null || lifestyle.length > 0 || profile.preferredMoveIn || profile.preferredLocation));

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                            {avatar ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={avatar} alt={name} className="h-full w-full object-cover" />
                            ) : (
                                <UserIcon className="h-6 w-6" />
                            )}
                        </span>
                        <div className="min-w-0">
                            <h3 className="truncate text-base font-extrabold text-slate-900 dark:text-white">{name}</h3>
                            <p className="flex items-center gap-1 truncate text-xs text-slate-500 dark:text-slate-400">
                                <BedDouble className="h-3 w-3 shrink-0" /> {request.roomTitle}
                            </p>
                            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${statusBadge[request.status]}`}>
                                {request.status}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                        aria-label="Close details"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {isLoading ? (
                        <div className="flex h-40 items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                        </div>
                    ) : forbidden ? (
                        <Notice title="You don't have access to this request." subtitle="Only the two tenants involved can view these details." />
                    ) : isError ? (
                        <Notice title="Couldn't load this tenant's details." subtitle="Please try again in a moment." />
                    ) : (
                        <div className="space-y-4">
                            {/* Compatibility + budget summary */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    <Sparkles className="h-3.5 w-3.5" /> {data?.compatibilityScore ?? 0}% Match
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    <Wallet className="h-3.5 w-3.5" /> Budget: {formatNpr(profile?.budget)}
                                </span>
                            </div>

                            {/* Message they sent with the request (received perspective) */}
                            {request.message && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Message</p>
                                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700 dark:text-slate-200">{request.message}</p>
                                </div>
                            )}

                            {profile?.bio && (
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">About</p>
                                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 dark:text-slate-200">{profile.bio}</p>
                                </div>
                            )}

                            {lifestyle.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lifestyle</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {lifestyle.map((chip) => (
                                            <span key={chip.label} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                                                {chip.icon} {chip.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(profile?.preferredMoveIn || profile?.preferredLocation) && (
                                <div className="grid gap-2 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-2">
                                    {profile?.preferredMoveIn && <p><span className="font-bold text-slate-600 dark:text-slate-300">Move-in:</span> {profile.preferredMoveIn}</p>}
                                    {profile?.preferredLocation && <p><span className="font-bold text-slate-600 dark:text-slate-300">Preferred area:</span> {profile.preferredLocation}</p>}
                                </div>
                            )}

                            {!hasDetails && (
                                <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                    This tenant hasn&apos;t completed their roommate profile yet.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer actions (Accept/Reject/Cancel/Message provided by the tab) */}
                {children && (
                    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3 dark:border-slate-800 dark:bg-slate-950/40">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}

type Chip = { label: string; icon: React.ReactNode };

// Only the tenant's PUBLIC matching preferences — never private data.
function lifestyleChips(profile: RoommateProfile): Chip[] {
    const chips: Chip[] = [];
    if (profile.smoker === true) chips.push({ label: "Smoker", icon: <span className="text-slate-400">🚬</span> });
    else if (profile.smoker === false) chips.push({ label: "Non-smoker", icon: <span className="text-slate-400">🚭</span> });
    if (profile.petsOk === true) chips.push({ label: "OK with pets", icon: <PawPrint className="h-3 w-3" /> });
    else if (profile.petsOk === false) chips.push({ label: "No pets", icon: <PawPrint className="h-3 w-3" /> });
    if (profile.sleepSchedule === "EARLY_BIRD") chips.push({ label: "Early bird", icon: <Sun className="h-3 w-3" /> });
    else if (profile.sleepSchedule === "NIGHT_OWL") chips.push({ label: "Night owl", icon: <MoonStar className="h-3 w-3" /> });
    else if (profile.sleepSchedule === "FLEXIBLE") chips.push({ label: "Flexible sleep", icon: <MoonStar className="h-3 w-3" /> });
    if (profile.cleanliness) chips.push({ label: `${titleCase(profile.cleanliness)} cleanliness`, icon: <Sparkles className="h-3 w-3" /> });
    return chips;
}

function titleCase(value: string) {
    return value.charAt(0) + value.slice(1).toLowerCase();
}

const statusBadge: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    ACCEPTED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    REJECTED: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    CANCELLED: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

function formatNpr(price?: number | null) {
    if (price == null) return "—";
    return `Rs ${new Intl.NumberFormat("en-IN").format(price)}`;
}

function Notice({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="flex h-40 flex-col items-center justify-center text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <AlertCircle className="h-7 w-7" />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{title}</p>
            {subtitle && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
    );
}

function errorMessage(error: unknown): string {
    const raw = error instanceof Error ? error.message.replace(/^Error fetching .*: /, "") : "";
    return raw || "Something went wrong.";
}
