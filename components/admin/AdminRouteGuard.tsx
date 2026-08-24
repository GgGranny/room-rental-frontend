"use client";

import { useCurrentUser } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
    const { data, isLoading, isError } = useCurrentUser();
    const router = useRouter();
    const user = (data as { data?: { role?: string } })?.data;
    useEffect(() => { if (!isLoading && (isError || user?.role !== "ROLE_ADMIN")) router.replace(isError ? "/login" : "/unauthorized"); }, [isLoading, isError, user?.role, router]);
    if (isLoading || isError || user?.role !== "ROLE_ADMIN") return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Verifying administrator access…</div>;
    return <>{children}</>;
}
