import { NextRequest, NextResponse } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
    ROLE_LANDLORD: [
        "/landlord",
        "/landlord/properties/all",
        "/profile",
        "/landlord/properties",
        "/landlord/bookings",
        "/landlord/schedule",
        "/landlord/properties/:id/rooms/new",
        "/landlord/kyc"
    ],

    ROLE_ADMIN: [
        "/admin",
        "/profile",
    ],

    ROLE_USER: [
        "/home",
        "/booking",
        "/profile",
        "/kyc",
        "/room",
    ],
};

const PUBLIC_PATHS = [
    "/login",
    "/signup",
    "/unauthorized",
    "/home",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/complete-profile",
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const role = request.cookies.get("role")?.value;

    // Ignore Next.js internals, API routes and static files
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Public routes
    if (PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.next();
    }

    // User is not authenticated
    if (!role) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    const allowedPaths = ROLE_ROUTES[role] ?? [];

    const isAuthorized = allowedPaths.some((path) => {
        return (
            pathname === path ||
            pathname.startsWith(`${path}/`)
        );
    });

    if (!isAuthorized) {
        return NextResponse.redirect(
            new URL("/unauthorized", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};