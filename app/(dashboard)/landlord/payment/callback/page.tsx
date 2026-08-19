"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { useVerifyPayment } from "@/app/hooks/usePayment";
import { PaymentSummary } from "@/app/services/paymentService";

function LoadingState() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
            <div className="text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Confirming your payment...</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Please wait while we verify with the gateway.</p>
            </div>
        </div>
    );
}

// Payment success callback: eSewa appends ?data=<base64 JSON with transaction_uuid>,
// Khalti appends ?pidx=...&purchase_order_id=<our uuid>&status=...
// We extract either transactionUuid or pidx, call verify (which re-checks the gateway),
// and show success if confirmed. Fallback to sessionStorage if query params are thin.
function PaymentCallbackInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const verify = useVerifyPayment();
    const [result, setResult] = useState<PaymentSummary | null>(null);

    useEffect(() => {
        const run = async () => {
            let transactionUuid: string | null = null;
            let pidx: string | null = null;

            // eSewa: ?data=base64(JSON) with transaction_uuid
            const dataParam = searchParams?.get("data");
            if (dataParam) {
                try {
                    const decoded = JSON.parse(atob(dataParam));
                    transactionUuid = decoded.transaction_uuid || null;
                } catch {
                    // malformed; fall through
                }
            }

            // Khalti: ?pidx=...&purchase_order_id=...
            pidx = searchParams?.get("pidx") || null;
            if (!transactionUuid && !pidx) {
                const fallback = searchParams?.get("purchase_order_id") || null;
                if (fallback) transactionUuid = fallback;
            }

            // Last resort: sessionStorage
            if (!transactionUuid && !pidx) {
                try {
                    const pending = sessionStorage.getItem("pendingPaymentTxn");
                    if (pending) transactionUuid = pending;
                } catch {
                    // unavailable
                }
            }

            if (!transactionUuid && !pidx) {
                router.replace("/landlord/payment/failed");
                return;
            }

            try {
                const summary = await verify.mutateAsync({ transactionUuid: transactionUuid || undefined, pidx: pidx || undefined });
                setResult(summary);
                try {
                    sessionStorage.removeItem("pendingPaymentTxn");
                } catch {
                    // unavailable
                }
            } catch (err) {
                console.error("Payment verification failed:", err);
                router.replace("/landlord/payment/failed");
            }
        };
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (verify.isPending || !result) {
        return <LoadingState />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl p-8 space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Payment successful!</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Your property <span className="font-bold text-slate-700 dark:text-slate-200">{result.propertyName}</span> is now featured.
                    </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-2 text-left">
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Amount paid</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">Rs {Number(result.amount).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Duration</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{result.featureDays} days</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Gateway</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{result.gateway}</span>
                    </div>
                    {result.propertyFeaturedUntil && (
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Featured until</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{new Date(result.propertyFeaturedUntil).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>Your property now appears at the top of search results</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link href="/landlord/featured" className="h-11 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center">
                        Payment history
                    </Link>
                    <Link href="/landlord" className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-bold text-white transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2">
                        Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// useSearchParams must be wrapped in a Suspense boundary for the app to build.
export default function PaymentCallbackPage() {
    return (
        <Suspense fallback={<LoadingState />}>
            <PaymentCallbackInner />
        </Suspense>
    );
}
