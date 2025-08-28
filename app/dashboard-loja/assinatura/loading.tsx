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

        {/* Current Plan Card */}
        <Card className="shadow-sm mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <div>
                  <Skeleton className="h-4 w-36 mb-1" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Usage Card */}
        <Card className="shadow-sm mb-8">
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Plans Card */}
        <Card className="shadow-sm mb-8">
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-full border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-6">
                      <Skeleton className="h-6 w-24 mx-auto mb-2" />
                      <Skeleton className="h-4 w-32 mx-auto mb-4" />
                      <Skeleton className="h-8 w-20 mx-auto mb-4" />
                    </div>
                    <div className="space-y-3 mb-6">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="flex items-center space-x-3">
                          <Skeleton className="w-4 h-4 rounded" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      ))}
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment History Card */}
        <Card className="shadow-sm mb-8">
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg gap-4"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-5 w-5 rounded" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Actions Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-48" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
