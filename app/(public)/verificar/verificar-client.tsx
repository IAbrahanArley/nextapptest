"use client";

import { useSearchParams } from "next/navigation";
import VerifyAccountForm from "@/components/auth/verify-account";
import { useEffect, useState } from "react";

type UserType = "customer" | "merchant";

export default function VerifyAccountClient() {
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<UserType>("customer");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const type = (searchParams.get("type") as UserType) || "customer";
    setUserType(type);
    setIsMounted(true);
  }, [searchParams]);

  if (!isMounted) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-muted rounded-md"></div>
        <div className="h-10 bg-muted rounded-md"></div>
        <div className="h-10 bg-muted rounded-md"></div>
      </div>
    );
  }

  return <VerifyAccountForm userType={userType} />;
}
