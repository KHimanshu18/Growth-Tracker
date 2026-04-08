import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

const publicPaths = ["/login"];
const adminOnlyPaths = ["/add-visitor", "/visitors", "/follow-ups"];
const visitorAllowedPaths = ["/overview", "/personal-details"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (pathname === "/") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const user = await verifyAuthToken(token);
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.redirect(new URL("/overview", request.url));
  }

  if (publicPaths.includes(pathname)) {
    if (!token) return NextResponse.next();

    const user = await verifyAuthToken(token);
    if (!user) return NextResponse.next();

    return NextResponse.redirect(new URL("/overview", request.url));
  }

  const protectedPaths =
    pathname === "/overview" ||
    pathname === "/add-visitor" ||
    pathname === "/visitors" ||
    pathname === "/follow-ups" ||
    pathname === "/personal-details" ||
    pathname.startsWith("/personal-details/");

  if (!protectedPaths) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = await verifyAuthToken(token);
  if (!user) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  if (user.role === "ADMIN") {
    return NextResponse.next();
  }

  const visitorCanAccess =
    visitorAllowedPaths.includes(pathname) &&
    !adminOnlyPaths.some((path) => pathname.startsWith(path));

  if (!visitorCanAccess) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/overview",
    "/add-visitor",
    "/visitors",
    "/follow-ups",
    "/personal-details/:path*",
  ],
};
