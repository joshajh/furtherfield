import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";

function isAuthenticated(request: NextRequest): boolean {
  const authCookie = request.cookies.get("admin_auth");
  if (!authCookie) return false;

  const expectedValue = Buffer.from(
    `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`
  ).toString("base64");

  return authCookie.value === expectedValue;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Don't protect login/logout API routes
  if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") {
    return NextResponse.next();
  }

  // Only protect /api/admin routes (pages handle their own auth via layout)
  if (!pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Check cookie-based auth for API routes
  if (!isAuthenticated(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
