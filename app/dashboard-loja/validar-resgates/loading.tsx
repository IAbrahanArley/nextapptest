import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <Skeleton className="h-7 sm:h-9 w-48 sm:w-64 mb-2" />
          <Skeleton className="h-5 sm:h-6 w-80 sm:w-96" />
        </div>

        {/* Validation Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-80" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
