"use client";

import { useState } from "react";
import { Loader2, X, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useInitiatePayment } from "@/app/hooks/usePayment";
import { PaymentGateway, redirectToGateway } from "@/app/services/paymentService";

// Landlord-facing modal to pay to feature a property. Picks a gateway, initiates
// the payment on the backend, then hands the browser off to eSewa/Khalti. The
// gateway redirects back to /landlord/payment/callback to confirm.
const GATEWAYS: { id: PaymentGateway; name: string; blurb: string; accent: string }[] = [
    { id: "ESEWA", name: "eSewa", blurb: "Pay with your eSewa wallet", accent: "border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30" },
    { id: "KHALTI", name: "Khalti", blurb: "Pay with your Khalti wallet", accent: "border-purple-300 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/30" },
];

export default function FeaturePaymentModal({
    propertyId,
    propertyName,
    open,
    onClose,
}: {
    propertyId: string | null;
    propertyName?: string;
    open: boolean;
    onClose: () => void;
}) {
    const [gateway, setGateway] = useState<PaymentGateway>("ESEWA");
    const initiate = useInitiatePayment();

    if (!open || !propertyId) return null;

    const pay = async () => {
        try {
            const init = await initiate.mutateAsync({ propertyId, gateway });
            // Persist the txn so the callback can still verify if query params are thin.
            try {
                sessionStorage.setItem("pendingPaymentTxn", init.transactionUuid);
            } catch {
                // sessionStorage may be unavailable; the gateway callback still carries the ids.
            }
            toast.info("Redirecting you to the payment gateway...");
            redirectToGateway(init);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not start the payment. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={initiate.isPending ? undefined : onClose} />
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Feature this property</h3>
                            {propertyName && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{propertyName}</p>}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={initiate.isPending}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Featured properties appear at the top of search results and get a highlighted badge, so more tenants
                    see them first. You'll confirm the exact amount on the gateway before paying.
                </div>

                <div className="space-y-2">
                    <p className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Choose a payment method</p>
                    <div className="grid grid-cols-2 gap-3">
                        {GATEWAYS.map((g) => (
                            <button
                                key={g.id}
                                onClick={() => setGateway(g.id)}
                                className={`text-left p-3.5 rounded-xl border-2 transition-all ${
                                    gateway === g.id
                                        ? g.accent
                                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                                }`}
                            >
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{g.name}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{g.blurb}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={pay}
                    disabled={initiate.isPending}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 px-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
                >
                    {initiate.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    {initiate.isPending ? "Starting payment..." : `Continue with ${gateway === "ESEWA" ? "eSewa" : "Khalti"}`}
                </button>
                <p className="text-[11px] text-slate-400 text-center font-medium">Sandbox mode — no real money is charged.</p>
            </div>
        </div>
    );
}
