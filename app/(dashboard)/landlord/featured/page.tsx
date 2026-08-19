"use client";

import React, { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
    Sparkles,
    Building2,
    Loader2,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Receipt,
    MapPin,
} from "lucide-react";
import { useGetAllProperty } from "@/app/hooks/useProperty";
import { usePaymentHistory } from "@/app/hooks/usePayment";
import { PaymentStatus, PaymentSummary } from "@/app/services/paymentService";
import FeaturePaymentModal from "@/components/FeaturePaymentModal";

type PropertyRow = {
    id: string;
    propertyName: string;
    city?: string;
    district?: string;
    thumbnailUrl?: string;
    featured?: boolean;
    featuredUntil?: string;
};

const paymentStatusBadge: Record<PaymentStatus, { text: string; cls: string }> = {
    SUCCESS: { text: "Paid", cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
    INITIATED: { text: "Pending", cls: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
    FAILED: { text: "Failed", cls: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400" },
};

function formatDate(iso?: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return format(d, "PPP");
}

function isActiveFeature(p: PropertyRow) {
    if (!p.featured || !p.featuredUntil) return false;
    const until = new Date(p.featuredUntil).getTime();
    return !Number.isNaN(until) && until > Date.now();
}

export default function FeaturedPage() {
    const { data: response, isLoading, isError } = useGetAllProperty();
    const history = usePaymentHistory();
    const [target, setTarget] = useState<{ id: string; name: string } | null>(null);

    const properties: PropertyRow[] = response?.data ?? [];
    const payments = (history.data as PaymentSummary[] | undefined) ?? [];

    return (
        <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <main className="mx-auto max-w-5xl space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-500" /> Featured Listings
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Boost a property to the top of tenant search results. Listing rooms is always free — featuring is optional.
                    </p>
                </div>

                {/* PROPERTIES */}
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="h-24 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 animate-pulse" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center py-14 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                        <AlertTriangle className="w-9 h-9 text-rose-400 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">Could not load your properties. Please try again.</p>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="text-center py-14 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                        <Building2 className="w-9 h-9 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No properties yet</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Add a property first, then you can feature it.</p>
                        <Link href="/landlord/properties/add" className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors">
                            Add Property
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {properties.map((p) => {
                            const active = isActiveFeature(p);
                            return (
                                <div
                                    key={p.id}
                                    className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4"
                                >
                                    <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800">
                                        {p.thumbnailUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={p.thumbnailUrl} alt={p.propertyName} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-slate-300"><Building2 className="w-5 h-5" /></div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Link href={`/landlord/properties/${p.id}`} className="text-sm font-bold text-slate-900 dark:text-white truncate hover:text-indigo-600">
                                                {p.propertyName}
                                            </Link>
                                            {active && (
                                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center gap-1 uppercase tracking-wider">
                                                    <Sparkles className="w-3 h-3" /> Featured
                                                </span>
                                            )}
                                        </div>
                                        <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {[p.city, p.district].filter(Boolean).join(", ") || "—"}
                                        </p>
                                        {active && (
                                            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                                                <Clock className="w-3.5 h-3.5" /> Featured until {formatDate(p.featuredUntil)}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setTarget({ id: p.id, name: p.propertyName })}
                                        className="shrink-0 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-600/10"
                                    >
                                        <Sparkles className="w-4 h-4" /> {active ? "Extend feature" : "Feature"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* PAYMENT HISTORY */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-slate-400" />
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Payment history</h2>
                    </div>
                    {history.isPending ? (
                        <div className="p-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-indigo-500" /></div>
                    ) : payments.length === 0 ? (
                        <div className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No featuring payments yet.</div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {payments.map((pay) => {
                                const badge = paymentStatusBadge[pay.status] ?? paymentStatusBadge.INITIATED;
                                return (
                                    <div key={pay.paymentId} className="px-5 py-3.5 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{pay.propertyName || "Property"}</p>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                                {pay.gateway} · {pay.featureDays} days · {formatDate(pay.paidAt || pay.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-sm font-black text-slate-900 dark:text-white font-mono">Rs {Number(pay.amount).toLocaleString("en-IN")}</span>
                                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-wider uppercase flex items-center gap-1 ${badge.cls}`}>
                                                {pay.status === "SUCCESS" && <CheckCircle2 className="w-3 h-3" />} {badge.text}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>

            <FeaturePaymentModal
                propertyId={target?.id ?? null}
                propertyName={target?.name}
                open={!!target}
                onClose={() => setTarget(null)}
            />
        </div>
    );
}
