"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ClienteLoading from "./loading";

export default function ClienteDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login?type=customer");
      return;
    }

    if (session?.user?.role !== "customer") {
      router.push("/login?type=customer");
      return;
    }

    router.push("/cliente/pontos");
  }, [session, status, router]);

  return <ClienteLoading />;
}
