import { NextRequest, NextResponse } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
    ROLE_LANDLORD: ["/landlord"],
    ROLE_ADMIN: ["/home", "/admin"],
    ROLE_USER: ["/home", "/booking"],
};

const PUBLIC_PATHS = ["/login", "/signup", "/unauthorized", "/home"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const role = request.cookies.get("role")?.value;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    if (PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.next();
    }

    if (!role) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const allowedPaths = ROLE_ROUTES[role] ?? [];
    const isAuthorized = allowedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

    if (!isAuthorized) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
