"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Gift,
  Settings,
  LogOut,
  Store,
  Crown,
  BarChart3,
  QrCode,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./auth/logout-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";
const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard-loja",
    icon: LayoutDashboard,
  },
  {
    title: "Clientes",
    url: "/dashboard-loja/clientes",
    icon: Users,
  },
  {
    title: "Transações",
    url: "/dashboard-loja/transacoes",
    icon: CreditCard,
  },
  {
    title: "Prêmios",
    url: "/dashboard-loja/premios",
    icon: Gift,
  },
  {
    title: "Validar Resgates",
    url: "/dashboard-loja/validar-resgates",
    icon: QrCode,
  },
  {
    title: "Relatórios",
    url: "/dashboard-loja/relatorios",
    icon: BarChart3,
  },
  {
    title: "Configurações",
    url: "/dashboard-loja/configuracoes",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border bg-card shadow-sm flex-shrink-0 overflow-hidden w-sidebar">
      <SidebarHeader className="border-b border-border bg-muted/50 flex-shrink-0">
        <div className="flex items-center space-x-2 ">
          <Image
            src="/branlyclubLogo.svg"
            alt="BranlyClub"
            width={120}
            height={120}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 overflow-y-auto overflow-x-hidden flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="w-full justify-start px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-muted data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:border-r-2 data-[active=true]:border-primary"
                  >
                    <Link
                      href={item.url}
                      className="flex items-center space-x-3"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
            Assinatura
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard-loja/assinatura"}
                  className="w-full justify-start px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-muted data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:border-r-2 data-[active=true]:border-primary"
                >
                  <Link
                    href="/dashboard-loja/assinatura"
                    className="flex items-center space-x-3"
                  >
                    <Crown className="h-5 w-5" />
                    <span>Meu Plano</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border bg-muted/50 px-3 py-4 flex-shrink-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between w-full px-3 py-2">
              <ThemeToggle />
              <LogoutButton />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
