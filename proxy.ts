import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/", "/add", "/report", "/clients", "/transactions", "/settings"];
const managerRoutes = ["/", "/add", "/report"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  const publicRoutes = ["/login", "/signup", "/api"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get token safely using NextAuth helper
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Check role
  const role = token.role as string | undefined;

  if (role === "admin") return NextResponse.next();

  if (role === "manager") {
    if (managerRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Other users → block protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/add", "/report", "/clients", "/transactions", "/settings"],
};
