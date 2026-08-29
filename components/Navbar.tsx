"use client";

import { useCurrentUser } from "@/app/hooks/useAuth";
import TenantNavbar from "./TenantNavbar";
import LandlordNavbar from "./LandlordNavbar";
import AdminNavbar from "./AdminNavbar";

// Role-based navbar dispatcher. Resolves the authenticated user's actual role
// from the existing auth system (useCurrentUser → GET /auth/me) and renders the
// matching navbar. Falls back to the tenant navbar only for the authenticated
// "ROLE_USER" role; during initial load (or when unauthenticated), it renders
// nothing so we never flash the wrong role's navbar.
export default function Navbar() {
    const { data, isLoading, isError } = useCurrentUser();
    const role = (data as { data?: { role?: string } } | undefined)?.data?.role;

    // While the role is unknown, avoid rendering any navbar to prevent a
    // hydration/role flash (e.g. showing the tenant nav to a landlord/admin).
    if (isLoading || isError || !role) {
        return null;
    }

    if (role === "ROLE_LANDLORD") {
        return <LandlordNavbar />;
    }

    if (role === "ROLE_ADMIN") {
        return <AdminNavbar />;
    }

    return <TenantNavbar />;
}