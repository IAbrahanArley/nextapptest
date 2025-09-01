import { Suspense } from "react";
import { DashboardClient } from "./dashboard-client";
import DashboardLojaLoading from "./loading";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLojaLoading />}>
      <DashboardClient />
    </Suspense>
  );
}
