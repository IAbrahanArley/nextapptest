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

        {/* Tabs */}
        <div className="space-y-6">
          <div className="grid w-full grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>

          {/* Content */}
          <Card className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="flex flex-col sm:flex-row gap-6">
                  <Skeleton className="w-32 h-32 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              </div>

              <Skeleton className="h-px w-full" />

              {/* Store Data Form */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>

              <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
