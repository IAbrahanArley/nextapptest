import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  console.log("=== DEBUG MIDDLEWARE ===");
  console.log("Pathname:", pathname);
  console.log("Token:", token);
  console.log("Token exists:", !!token);
  console.log("Token role:", token?.role);

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/cadastro");
  const isDashboardPage =
    pathname.startsWith("/dashboard-loja") || pathname.startsWith("/cliente");

  // Páginas que não requerem autenticação (sucesso/falha de pagamento)
  const isPublicPage =
    pathname === "/dashboard-loja/success" ||
    pathname === "/dashboard-loja/failed" ||
    pathname === "/pagamento-sucesso";

  // Página inicial não deve ter redirecionamento automático
  const isHomePage = pathname === "/";

  console.log("Is auth page:", isAuthPage);
  console.log("Is dashboard page:", isDashboardPage);
  console.log("Is public page:", isPublicPage);
  console.log("Is home page:", isHomePage);

  // Se o usuário está em uma página de auth e tem token, só redireciona se for merchant
  if (isAuthPage && token) {
    console.log(
      "Usuário autenticado tentando acessar auth page, redirecionando para dashboard apropriado"
    );

    // Redireciona para o dashboard apropriado baseado no role
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

  // Se o usuário está na página inicial e tem token, não redireciona automaticamente
  // Deixa o usuário escolher onde quer ir
  if (isHomePage && token) {
    console.log("Usuário autenticado na página inicial - permitindo acesso");
    return NextResponse.next();
  }

  console.log("Permitindo acesso");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard-loja/:path*", "/cliente/:path*", "/login", "/cadastro"],
};
