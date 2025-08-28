import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PontosLoading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 dark:bg-gray-800">
          <Skeleton className="h-7 sm:h-9 w-48 sm:w-64 mb-2" />
          <Skeleton className="h-5 sm:h-6 w-72 sm:w-96" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-sm mb-6 sm:mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="rounded-t-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <Skeleton className="h-5 sm:h-6 w-60 sm:w-80 mb-2" />
                <Skeleton className="h-4 w-72 sm:w-96" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Skeleton className="h-9 w-full sm:w-24" />
                <Skeleton className="h-9 w-full sm:w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
                      <div className="min-w-0">
                        <Skeleton className="h-5 sm:h-6 w-28 sm:w-32 mb-2" />
                        <Skeleton className="h-4 w-20 sm:w-24" />
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <Skeleton className="h-7 sm:h-8 w-16 sm:w-20 mb-1" />
                      <Skeleton className="h-4 w-12 sm:w-16" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3">
                    <Skeleton className="h-4 w-36 sm:w-48" />
                    <Skeleton className="h-4 w-32 sm:w-40" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Skeleton className="h-9 w-full sm:w-24" />
                    <Skeleton className="h-9 w-full sm:w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="rounded-t-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 mb-2" />
                <Skeleton className="h-4 w-60 sm:w-80" />
              </div>
              <Skeleton className="h-9 w-full sm:w-20" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                    <div className="min-w-0">
                      <Skeleton className="h-5 w-28 sm:w-32 mb-1" />
                      <Skeleton className="h-4 w-36 sm:w-48" />
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 mb-1" />
                    <Skeleton className="h-4 w-12 sm:w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
