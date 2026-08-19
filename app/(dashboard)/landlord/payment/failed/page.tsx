"use client";

import Link from "next/link";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";

// Payment failure/cancel landing. The gateway sends the browser here when a
// payment is cancelled or fails; nothing is charged and no property is featured.
export default function PaymentFailedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl p-8 space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                    <XCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Payment not completed</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Your payment was cancelled or didn&apos;t go through. You haven&apos;t been charged, and your property was not featured.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link href="/landlord" className="h-11 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link href="/landlord/featured" className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-bold text-white transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Try again
                    </Link>
                </div>
            </div>
        </div>
    );
}
