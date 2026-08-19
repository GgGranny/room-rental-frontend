"use client";

import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-6">
                <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Access denied
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8">
                You don&apos;t have permission to view this page. If you think this is a
                mistake, contact support or sign in with an account that has access.
            </p>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                    Go back
                </button>
                <button
                    onClick={() => router.push("/login")}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
                >
                    Go to login
                </button>
            </div>
        </div>
    );
}
