import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Rotas públicas
  const isPublicRoute =
    nextUrl.pathname === "/" ||
    nextUrl.pathname === "/login";

  // Redirecionar /cadastro para /login (registro público desativado)
  if (nextUrl.pathname === "/cadastro") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Rotas protegidas por role
  const isAlunoRoute = nextUrl.pathname.startsWith("/aluno");
  const isInstrutorRoute = nextUrl.pathname.startsWith("/instrutor");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  // Se não está logado e tenta acessar rota protegida
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Se está logado e tenta acessar login/cadastro, redireciona para dashboard
  if (isLoggedIn && nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL(`/${userRole}`, nextUrl));
  }

  // Verificação de permissão por role
  if (isLoggedIn) {
    if (isAlunoRoute && userRole !== "aluno") {
      return NextResponse.redirect(new URL(`/${userRole}`, nextUrl));
    }

    if (isInstrutorRoute && userRole !== "instrutor" && userRole !== "admin") {
      return NextResponse.redirect(new URL(`/${userRole}`, nextUrl));
    }

    if (isAdminRoute && userRole !== "admin") {
      return NextResponse.redirect(new URL(`/${userRole}`, nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
