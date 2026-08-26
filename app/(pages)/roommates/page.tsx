"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowRight,
    BedDouble,
    Check,
    HeartHandshake,
    Inbox,
    Loader2,
    MailX,
    Search,
    ShieldCheck,
    User as UserIcon,
    Users,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { useMyProfile } from "@/app/hooks/useAuth";
import {
    useCancelRoommateRequest,
    useExpressInterest,
    useMyInterests,
    useMyRoommateProfile,
    useReceivedRequests,
    useRemoveInterest,
    useRespondRoommateRequest,
    useRoommateMap,
    useSaveRoommateProfile,
    useSentRequests,
    useSendRoommateRequest,
} from "@/app/hooks/useRoommate";
import { useRoommateEvents } from "@/app/hooks/useRoommateRealtime";
import type {
    Cleanliness,
    MapOpportunity,
    RoommateRequestItem,
    SleepSchedule,
} from "@/app/services/roommateService";

// Leaflet touches window — client-only, same pattern as components/Map.tsx.
const RoommateMap = dynamic(() => import("@/components/RoommateMap"), {
    ssr: false,
    loading: () => <div className="h-[380px] w-full animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800 md:h-[480px]" />,
});

const NEPAL_CENTER = { lat: 27.7172, lng: 85.324 };

type Tab = "find" | "profile" | "sent" | "received";

const tabs: Array<{ key: Tab; label: string }> = [
    { key: "find", label: "Find Roommate" },
    { key: "profile", label: "My Profile" },
    { key: "sent", label: "Sent Requests" },
    { key: "received", label: "Received Requests" },
];

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

export default function RoommatesPage() {
    return (
        <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>}>
            <RoommatesInner />
        </Suspense>
    );
}

function RoommatesInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomIdParam = searchParams.get("roomId") || "";
    const [tab, setTab] = useState<Tab>("find");
    const [selectedRoomId, setSelectedRoomId] = useState<string>(roomIdParam);

    useEffect(() => {
        if (roomIdParam) setSelectedRoomId(roomIdParam);
    }, [roomIdParam]);

    const { data: profileData } = useMyProfile();
    const user = profileData?.data;
    const isKycApproved =
        user?.role === "ROLE_ADMIN" || (user?.kycSubmitted && user?.kycStatus === "APPROVED");
    // Tenant-only feature; landlords are redirected like other tenant-only areas.
    useEffect(() => {
        if (user && user.role !== "ROLE_USER" && user.role !== "ROLE_ADMIN") {
            router.replace("/unauthorized");
        }
    }, [user, router]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <main className="max-w-7xl mx-auto space-y-6">
                <header className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Roommate Finder</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
                        Find compatible tenants for shared rooms. Express interest in a shared room, compare preferences and send roommate requests.
                    </p>
                </header>

                {!isKycApproved && <KycNotice kycStatus={user?.kycStatus} kycSubmitted={user?.kycSubmitted} />}

                <nav className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    {tabs.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setTab(item.key)}
                            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                                tab === item.key
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {tab === "find" && <FindTab selectedRoomId={selectedRoomId} onSelectRoom={setSelectedRoomId} kycApproved={!!isKycApproved} user={{ kycStatus: user?.kycStatus, kycSubmitted: user?.kycSubmitted }} />}
                {tab === "profile" && <ProfileTab />}
                {tab === "sent" && <SentRequestsTab kycApproved={!!isKycApproved} />}
                {tab === "received" && <ReceivedRequestsTab />}
            </main>
        </div>
    );
}

function KycNotice({ kycStatus, kycSubmitted }: { kycStatus?: string | null; kycSubmitted?: boolean }) {
    const message = !kycSubmitted || !kycStatus
        ? "KYC verification is required before you can send roommate requests. Please complete your KYC."
        : kycStatus === "PENDING"
            ? "Your KYC is under review. You can send roommate requests once your KYC is approved."
            : "Your KYC was rejected. Please resubmit your KYC before sending roommate requests.";
    return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5 dark:border-amber-900/60 dark:bg-amber-950/30">
            <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div className="space-y-2">
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Approved KYC required</p>
                    <p className="text-xs text-amber-700/90 dark:text-amber-400/90">{message}</p>
                    <Link href="/kyc" className="inline-flex items-center gap-1 rounded-xl bg-amber-600 px-3 py-2 text-xs font-bold text-white hover:bg-amber-700">
                        Go to KYC <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function FindTab({
    selectedRoomId,
    onSelectRoom,
    kycApproved,
    user,
}: {
    selectedRoomId: string;
    onSelectRoom: (roomId: string) => void;
    kycApproved: boolean;
    user?: { kycStatus?: string | null; kycSubmitted?: boolean };
}) {
    const { data: interests = [], isLoading: interestsLoading } = useMyInterests();
    const expressInterest = useExpressInterest();
    const removeInterest = useRemoveInterest();
    // New API: one call returns the room summary + active opportunities for the map.
    const { data: mapData, isLoading: mapLoading } = useRoommateMap(selectedRoomId || undefined);
    const sendRequest = useSendRoommateRequest();
    const acceptIncoming = useRespondRoommateRequest("accept");
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [busyUserId, setBusyUserId] = useState<string | null>(null);

    // Real-time sync for this room's map. Events only refresh caches / inform —
    // the REST response of my own action stays authoritative.
    useRoommateEvents(selectedRoomId || undefined, (event) => {
        if (event.type === "ROOM_STATUS_CHANGED") {
            toast("Room availability changed", {
                description: "This shared room is no longer available for roommate matching.",
            });
        } else if (event.type === "ROOMMATE_REQUEST_ACCEPTED") {
            toast.info("A roommate request on this map was just accepted.");
        }
    });

    useEffect(() => {
        setSelectedUserId(null);
    }, [selectedRoomId]);

    const room = mapData?.room;
    const opportunities = mapData?.opportunities ?? [];
    const isInterested = interests.some((i) => i.roomId === selectedRoomId);
    const isRoomAvailable = room?.status === "AVAILABLE";
    const selected = useMemo(
        () => opportunities.find((opportunity) => opportunity.userId === selectedUserId) ?? null,
        [opportunities, selectedUserId],
    );

    const markers = useMemo<React.ComponentProps<typeof RoommateMap>["markers"]>(() => {
        // Person markers must render even if the room has no coordinates —
        // they spread around whatever center the map uses.
        const list: React.ComponentProps<typeof RoommateMap>["markers"] = [];
        if (room?.latitude && room?.longitude) {
            list.push({ id: `room-${room.roomId}`, kind: "room", label: room.roomTitle, lat: room.latitude, lng: room.longitude });
        }
        opportunities.forEach((opportunity) => {
            list.push({ id: opportunity.userId, kind: "person", label: opportunity.name, lat: 0, lng: 0 });
        });
        return list;
    }, [room, opportunities]);

    const toggleInterest = async () => {
        if (!selectedRoomId) return;
        try {
            if (isInterested) {
                await removeInterest.mutateAsync(selectedRoomId);
                toast.success("Interest removed for this room.");
            } else {
                await expressInterest.mutateAsync(selectedRoomId);
                toast.success("You are now looking for a roommate for this room.");
            }
        } catch (error) {
            toast.error(errorMessage(error));
        }
    };

    const handleSend = async (opportunity: MapOpportunity) => {
        // Frontend KYC guard mirrors the backend rule — never send without approval.
        if (!kycApproved) return showKycBlock(user);
        if (!confirm(`Send ${opportunity.name} a roommate request for this shared room?`)) return;
        setBusyUserId(opportunity.userId);
        try {
            await sendRequest.mutateAsync({ recipientId: opportunity.userId, roomId: selectedRoomId });
            toast.success("Roommate request sent.");
        } catch (error) {
            toast.error(errorMessage(error));
        } finally {
            setBusyUserId(null);
        }
    };

    const handleAccept = async (opportunity: MapOpportunity) => {
        if (!kycApproved) return showKycBlock(user);
        if (!opportunity.pendingIncomingRequestId) return;
        if (!confirm(`Accept ${opportunity.name}'s roommate request?`)) return;
        setBusyUserId(opportunity.userId);
        try {
            await acceptIncoming.mutateAsync(opportunity.pendingIncomingRequestId);
            toast.success("Roommate request accepted.");
        } catch (error) {
            // 409 from the backend ("no longer available") surfaces here verbatim.
            toast.error(errorMessage(error));
        } finally {
            setBusyUserId(null);
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr] items-start">
            <aside className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Shared rooms you&apos;re interested in</h2>
                {interestsLoading ? (
                    <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-indigo-600" /></div>
                ) : interests.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                        No interest yet. Open a shared room and tap &ldquo;Find a Roommate&rdquo; to add it here.
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {interests.map((interest) => (
                            <li key={interest.roomId}>
                                <button
                                    onClick={() => onSelectRoom(interest.roomId)}
                                    className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                                        selectedRoomId === interest.roomId
                                            ? "border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/50"
                                            : "border-slate-200 hover:border-indigo-200 dark:border-slate-800"
                                    }`}
                                >
                                    <span className="block truncate text-sm font-bold">{interest.roomTitle}</span>
                                    <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                                        {formatNpr(interest.price)} · {interest.location}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </aside>

            <section className="space-y-4">
                {!selectedRoomId ? (
                    <EmptyState
                        icon={<Search className="h-8 w-8" />}
                        title="Select a shared room"
                        description='Open a room marked "Shared Room" and press "Find a Roommate", or pick one of your interested rooms.'
                        action={<Link href="/home" className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700">Browse rooms <ArrowRight className="h-3.5 w-3.5" /></Link>}
                    />
                ) : (
                    <>
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Shared Room</p>
                                        {room && (
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isRoomAvailable ? statusBadge.ACCEPTED : statusBadge.CANCELLED}`}>
                                                {room.status}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="truncate text-lg font-extrabold text-slate-900 dark:text-white">{room?.roomTitle ?? "Loading..."}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Rent: {formatNpr(room?.price)} · {room?.location ?? ""}
                                    </p>
                                </div>
                                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                    {isInterested ? (
                                        <button onClick={toggleInterest} disabled={removeInterest.isPending} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-60 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                                            <X className="h-3.5 w-3.5" /> Remove my interest
                                        </button>
                                    ) : (
                                        <button onClick={toggleInterest} disabled={expressInterest.isPending} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
                                            <HeartHandshake className="h-3.5 w-3.5" /> I want to share this room
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!isRoomAvailable && (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                                This room is no longer available — roommate matching is closed for it.
                            </div>
                        )}

                        {/* ROSTER — makes it explicit that MULTIPLE tenants have
                            requested to find a roommate for this same room. */}
                        {isRoomAvailable && opportunities.length > 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                    <Users className="h-3.5 w-3.5" />
                                    {opportunities.length} tenant{opportunities.length === 1 ? " has" : "s have"} requested to share this room
                                </p>
                                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                                    {opportunities.map((opportunity) => {
                                        const active = selectedUserId === opportunity.userId;
                                        return (
                                            <button
                                                key={opportunity.userId}
                                                onClick={() => setSelectedUserId(opportunity.userId)}
                                                className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-left transition ${
                                                    active
                                                        ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200 dark:border-emerald-400 dark:bg-emerald-950/40 dark:ring-emerald-900"
                                                        : "border-slate-200 hover:border-emerald-300 dark:border-slate-700"
                                                }`}
                                            >
                                                <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                                                    {opportunity.profilePictureUrl ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={opportunity.profilePictureUrl} alt={opportunity.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <UserIcon className="h-3.5 w-3.5" />
                                                    )}
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block max-w-[120px] truncate text-xs font-bold text-slate-800 dark:text-slate-200">{opportunity.name}</span>
                                                    <span className="block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{opportunity.compatibilityScore}% match</span>
                                                </span>
                                                {opportunity.pendingIncomingRequestId && !opportunity.myRequestStatus && (
                                                    <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">New</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* MAP — tied to this shared room only; markers cluster around
                            the ROOM's coordinates (no personal tenant locations). */}
                        <div className="relative">
                            <RoommateMap
                                center={room?.latitude && room?.longitude ? { lat: room.latitude, lng: room.longitude } : NEPAL_CENTER}
                                markers={markers}
                                selectedId={selectedUserId}
                                onSelect={(id) => setSelectedUserId(id === `room-${selectedRoomId}` ? null : id)}
                                heightClassName="h-[380px] md:h-[480px]"
                            />

                            {mapLoading && (
                                <div className="absolute inset-0 z-[500] flex items-center justify-center rounded-3xl bg-white/70 backdrop-blur-sm dark:bg-slate-950/60">
                                    <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                                </div>
                            )}

                            {!mapLoading && isRoomAvailable && opportunities.length === 0 && (
                                <div className="pointer-events-none absolute inset-x-0 top-3 z-[500] mx-auto w-fit rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-bold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-300">
                                    No nearby roommates are looking for this room yet.
                                </div>
                            )}
                        </div>

                        {selected && (
                            <OpportunityCard
                                opportunity={selected}
                                busy={busyUserId === selected.userId}
                                onSend={() => void handleSend(selected)}
                                onAccept={() => void handleAccept(selected)}
                            />
                        )}
                    </>
                )}
            </section>
        </div>
    );
}

// Frontend KYC guard mirrors the backend rule — clicking without APPROVED KYC
// never sends an API call.
function showKycBlock(user?: { kycStatus?: string | null; kycSubmitted?: boolean }) {
    const submitted = user?.kycSubmitted;
    const status = user?.kycStatus;
    const needsAction = !submitted || !status || status === "REJECTED";
    const message = !submitted || !status
        ? "KYC verification is required before you can send a roommate request."
        : status === "PENDING"
            ? "Your KYC is currently under review. You can send a roommate request after it is approved."
            : status === "REJECTED"
                ? "Your KYC was rejected. Please resubmit your KYC before sending a roommate request."
                : "Your KYC is not approved. Please complete KYC verification before continuing.";
    toast.error(message, {
        action: needsAction ? { label: "Complete KYC", onClick: () => (window.location.href = "/kyc") } : undefined,
        duration: 6000,
    });
}

function errorMessage(error: unknown): string {
    const raw = error instanceof Error ? error.message.replace(/^Error fetching .*: /, "") : "";
    return raw || "Something went wrong.";
}

function OpportunityCard({
    opportunity,
    busy,
    onSend,
    onAccept,
}: {
    opportunity: MapOpportunity;
    busy: boolean;
    onSend: () => void;
    onAccept: () => void;
}) {
    const hasIncoming = Boolean(opportunity.pendingIncomingRequestId);
    return (
        <article className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start dark:border-emerald-900/50 dark:bg-slate-900">
            <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                    {opportunity.profilePictureUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={opportunity.profilePictureUrl} alt={opportunity.name} className="h-full w-full object-cover" />
                    ) : (
                        <UserIcon className="h-5 w-5" />
                    )}
                </div>
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h4 className="truncate text-sm font-extrabold text-slate-900 dark:text-white">{opportunity.name}</h4>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            {opportunity.compatibilityScore}% Match
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Budget: {formatNpr(opportunity.budget)}</p>
                    {opportunity.bio && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{opportunity.bio}</p>}
                    {!opportunity.bio && !opportunity.budget && (
                        <p className="mt-1 text-[11px] text-slate-400">This tenant hasn&apos;t completed their roommate profile yet.</p>
                    )}
                    {opportunity.myRequestStatus === "PENDING" && (
                        <p className="mt-2 text-[11px] font-bold text-amber-600">Request already sent — waiting for their response.</p>
                    )}
                    {opportunity.myRequestStatus === "ACCEPTED" && (
                        <p className="mt-2 text-[11px] font-bold text-emerald-600">You are matched with this tenant.</p>
                    )}
                </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:w-44">
                {hasIncoming && !opportunity.myRequestStatus ? (
                    <button onClick={onAccept} disabled={busy} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60">
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Accept Request
                    </button>
                ) : opportunity.myRequestStatus === "PENDING" ? (
                    <button disabled className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-100 px-4 py-2.5 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                        Request Sent
                    </button>
                ) : opportunity.myRequestStatus === "ACCEPTED" ? (
                    <button disabled className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-100 px-4 py-2.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        Accepted
                    </button>
                ) : (
                    <button onClick={onSend} disabled={busy} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-60">
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <HeartHandshake className="h-3.5 w-3.5" />} Send Request
                    </button>
                )}
            </div>
        </article>
    );
}

function ProfileTab() {
    const { data: profile, isLoading } = useMyRoommateProfile();
    const saveProfile = useSaveRoommateProfile();
    const [form, setForm] = useState({
        bio: "",
        budget: "",
        preferredLocation: "",
        preferredMoveIn: "",
        smoker: "no",
        petsOk: "yes",
        sleepSchedule: "FLEXIBLE" as SleepSchedule,
        cleanliness: "MEDIUM" as Cleanliness,
    });

    useEffect(() => {
        if (!profile) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm({
            bio: profile.bio ?? "",
            budget: profile.budget != null ? String(profile.budget) : "",
            preferredLocation: profile.preferredLocation ?? "",
            preferredMoveIn: profile.preferredMoveIn ?? "",
            smoker: profile.smoker ? "yes" : "no",
            petsOk: profile.petsOk === false ? "no" : "yes",
            sleepSchedule: profile.sleepSchedule ?? "FLEXIBLE",
            cleanliness: profile.cleanliness ?? "MEDIUM",
        });
    }, [profile]);

    if (isLoading) {
        return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>;
    }

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await saveProfile.mutateAsync({
                mode: profile?.profileId ? "update" : "create",
                body: {
                    bio: form.bio.trim() || undefined,
                    budget: form.budget ? Number(form.budget) : undefined,
                    preferredLocation: form.preferredLocation.trim() || undefined,
                    preferredMoveIn: form.preferredMoveIn.trim() || undefined,
                    smoker: form.smoker === "yes",
                    petsOk: form.petsOk === "yes",
                    sleepSchedule: form.sleepSchedule,
                    cleanliness: form.cleanliness,
                },
            });
            toast.success(profile?.profileId ? "Preferences updated." : "Roommate profile created.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message.replace(/^Error fetching .*: /, "") : "Unable to save profile.");
        }
    };

    return (
        <form onSubmit={submit} className="grid max-w-3xl gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {!profile?.profileId && (
                <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    Create your roommate profile to find compatible roommates.
                </p>
            )}

            <label className="text-sm font-semibold">About me
                <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={500} placeholder="Tell potential roommates a little about yourself." className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal dark:border-slate-700 dark:bg-slate-950" />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-semibold">Monthly budget (Rs)
                    <input type="number" min="0" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="10000" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal dark:border-slate-700 dark:bg-slate-950" />
                </label>
                <label className="text-sm font-semibold">Preferred move-in
                    <input value={form.preferredMoveIn} onChange={(e) => setForm({ ...form, preferredMoveIn: e.target.value })} placeholder="e.g. September 2026 / ASAP" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal dark:border-slate-700 dark:bg-slate-950" />
                </label>
                <label className="text-sm font-semibold">Preferred location
                    <input value={form.preferredLocation} onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })} placeholder="e.g. Kathmandu" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal dark:border-slate-700 dark:bg-slate-950" />
                </label>
                <label className="text-sm font-semibold">Smoking
                    <select value={form.smoker} onChange={(e) => setForm({ ...form, smoker: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal dark:border-slate-700 dark:bg-slate-950">
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </label>
                <label className="text-sm font-semibold">Pets
                    <select value={form.petsOk} onChange={(e) => setForm({ ...form, petsOk: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal dark:border-slate-700 dark:bg-slate-950">
                        <option value="yes">OK with pets</option>
                        <option value="no">No pets</option>
                    </select>
                </label>
                <label className="text-sm font-semibold">Sleep schedule
                    <select value={form.sleepSchedule} onChange={(e) => setForm({ ...form, sleepSchedule: e.target.value as SleepSchedule })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal dark:border-slate-700 dark:bg-slate-950">
                        <option value="FLEXIBLE">Flexible</option>
                        <option value="EARLY_BIRD">Early bird</option>
                        <option value="NIGHT_OWL">Night owl</option>
                    </select>
                </label>
                <label className="text-sm font-semibold">Cleanliness
                    <select value={form.cleanliness} onChange={(e) => setForm({ ...form, cleanliness: e.target.value as Cleanliness })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal dark:border-slate-700 dark:bg-slate-950">
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </label>
            </div>

            <div className="flex justify-end">
                <button type="submit" disabled={saveProfile.isPending} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60">
                    {saveProfile.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {profile?.profileId ? "Update Preferences" : "Save Preferences"}
                </button>
            </div>
        </form>
    );
}

function SentRequestsTab({ kycApproved }: { kycApproved: boolean }) {
    const { data: requests = [], isLoading } = useSentRequests();
    const cancelRequest = useCancelRoommateRequest();

    const cancel = async (id: string) => {
        if (!confirm("Cancel this pending roommate request?")) return;
        try {
            await cancelRequest.mutateAsync(id);
            toast.success("Request cancelled.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message.replace(/^Error fetching .*: /, "") : "Unable to cancel.");
        }
    };

    if (isLoading) {
        return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>;
    }
    if (requests.length === 0) {
        return <EmptyState icon={<MailX className="h-8 w-8" />} title="You haven't sent any roommate requests yet." description={kycApproved ? "Find a shared room and send your first request." : "Approved KYC is required before sending requests."} />;
    }
    return (
        <div className="space-y-3">
            {requests.map((request) => (
                <RequestRow key={request.id} request={request} perspective="sent">
                    {request.status === "PENDING" && (
                        <button onClick={() => cancel(request.id)} disabled={cancelRequest.isPending} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60 dark:border-red-900/60 dark:hover:bg-red-950/30">
                            Cancel
                        </button>
                    )}
                </RequestRow>
            ))}
        </div>
    );
}

function ReceivedRequestsTab() {
    const { data: requests = [], isLoading } = useReceivedRequests();
    const acceptRequest = useRespondRoommateRequest("accept");
    const rejectRequest = useRespondRoommateRequest("reject");

    const respond = async (action: "accept" | "reject", id: string) => {
        if (!confirm(action === "accept" ? "Accept this roommate request?" : "Reject this roommate request?")) return;
        try {
            await (action === "accept" ? acceptRequest.mutateAsync(id) : rejectRequest.mutateAsync(id));
            toast.success(action === "accept" ? "Roommate request accepted." : "Roommate request rejected.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message.replace(/^Error fetching .*: /, "") : "Unable to update request.");
        }
    };

    if (isLoading) {
        return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>;
    }
    if (requests.length === 0) {
        return <EmptyState icon={<Inbox className="h-8 w-8" />} title="You don't have any roommate requests." description='Express interest in shared rooms so other tenants can find and request you.' />;
    }
    return (
        <div className="space-y-3">
            {requests.map((request) => (
                <RequestRow key={request.id} request={request} perspective="received">
                    {request.status === "PENDING" && (
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => respond("accept", request.id)} disabled={acceptRequest.isPending} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"><Check className="h-3.5 w-3.5" /> Accept</button>
                            <button onClick={() => respond("reject", request.id)} disabled={rejectRequest.isPending} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60 dark:border-red-900/60 dark:hover:bg-red-950/30"><X className="h-3.5 w-3.5" /> Reject</button>
                        </div>
                    )}
                </RequestRow>
            ))}
        </div>
    );
}

// Shows the other tenant first depending on whether I sent or received the request.
function RequestRow({ request, perspective, children }: { request: RoommateRequestItem; perspective: "sent" | "received"; children?: React.ReactNode }) {
    const other = perspective === "sent" ? request.recipient : request.requester;
    return (
        <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
            <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                    {other.profilePictureUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={other.profilePictureUrl} alt={other.name} className="h-full w-full object-cover" />
                    ) : (
                        <UserIcon className="h-5 w-5" />
                    )}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-slate-900 dark:text-white">{other.name}</p>
                    <p className="flex items-center gap-1 truncate text-xs text-slate-500 dark:text-slate-400"><BedDouble className="h-3 w-3 shrink-0" /> {request.roomTitle}</p>
                    <p className="text-[11px] text-slate-400">{new Date(request.createdAt).toLocaleDateString()} · {formatNpr(request.roomPrice)}/mo</p>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusBadge[request.status]}`}>{request.status}</span>
                {children}
            </div>
        </article>
    );
}

function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }) {
    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">{icon}</div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{title}</h3>
            <p className="mx-auto mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">{description}</p>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

