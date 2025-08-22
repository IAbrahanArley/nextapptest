import type React from "react";
import ClienteLayoutClient from "./layout-client";

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClienteLayoutClient>{children}</ClienteLayoutClient>;
}
