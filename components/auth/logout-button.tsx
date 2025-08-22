"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-muted text-foreground cursor-pointer"
    >
      <LogOut className="h-5 w-5" />
      <span>Sair</span>
    </button>
  );
}
