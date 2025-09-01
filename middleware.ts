import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret:
      process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
  });
  const { pathname } = request.nextUrl;

  console.log("=== DEBUG MIDDLEWARE ===");
  console.log("Pathname:", pathname);
  console.log("Token exists:", !!token);
  console.log("Token role:", token?.role);
  console.log("Token completo:", token);

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/cadastro");
  const isDashboardPage =
    pathname.startsWith("/dashboard-loja") || pathname.startsWith("/cliente");

  // Páginas que não requerem autenticação
  const isPublicPage =
    pathname === "/dashboard-loja/success" ||
    pathname === "/dashboard-loja/failed" ||
    pathname === "/pagamento-sucesso";

  // Página inicial
  const isHomePage = pathname === "/";

  console.log("Is auth page:", isAuthPage);
  console.log("Is dashboard page:", isDashboardPage);
  console.log("Is public page:", isPublicPage);
  console.log("Is home page:", isHomePage);

  // Se o usuário está em uma página de auth e tem token, redireciona para dashboard apropriado
  if (isAuthPage && token) {
    console.log(
      "Usuário autenticado em auth page, redirecionando para dashboard"
    );
    const redirectPath =
      token.role === "merchant" ? "/dashboard-loja" : "/cliente";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Se o usuário está tentando acessar dashboard sem token
  if (isDashboardPage && !token && !isPublicPage) {
    console.log(
      "Usuário não autenticado tentando acessar dashboard, redirecionando para login"
    );
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Para todas as outras situações, permitir acesso
  console.log("Permitindo acesso");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard-loja/:path*", "/cliente/:path*", "/login", "/cadastro"],
};
