import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isAuthPage =
    nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  // Las páginas de autenticación deben ser accesibles sin sesión.
  // Si el usuario ya está autenticado, lo enviamos al dashboard.
  if (isAuthPage) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    return NextResponse.next();
  }

  // El resto de rutas incluidas en el matcher son privadas.
  if (!session) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (nextUrl.pathname.startsWith("/admin") && session.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
