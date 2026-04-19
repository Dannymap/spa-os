import { auth } from "@/auth";
import { NextResponse } from "next/server";

const ADMIN_ROUTES = ["/agenda", "/clientas", "/caja", "/gastos", "/balance", "/configuracion"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;
  const isAdminRoute = ADMIN_ROUTES.some((r) => path.startsWith(r));

  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
