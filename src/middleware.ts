import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/signin" || path === "/signup";

  const token = request.cookies.get("token")?.value;

  console.log("[Middleware] Path:", path, "IsPublic:", isPublicPath, "Token:", !!token);

  if (isPublicPath && token) {
    console.log("[Middleware] Redirecting authenticated user to /home");
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isPublicPath && !token) {
    console.log("[Middleware] Redirecting unauthenticated user to /signin");
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  console.log("[Middleware] Allowing request to proceed");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/signin/:path*",
    "/signup/:path*",
    "/home/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/leaderboard/:path*",
  ],
};