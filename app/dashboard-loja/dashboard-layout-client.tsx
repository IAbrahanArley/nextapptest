"use client";

import type React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="border-b border-border bg-card px-4 py-3 shadow-sm flex-shrink-0">
            <SidebarTrigger className="h-8 w-8" />
          </div>
          <div className="flex-1 p-6 overflow-y-auto overflow-x-hidden bg-background w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
