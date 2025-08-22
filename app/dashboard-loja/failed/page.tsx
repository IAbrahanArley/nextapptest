"use client";

import { Suspense } from "react";
import { XCircle, RefreshCw, Home, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import FailedPageClient from "./failed-page-client";

export default function FailedPage() {
  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-background/95">
        <Suspense fallback={<div>Carregando...</div>}>
          <FailedPageClient />
        </Suspense>
      </Card>
    </div>
  );
}
