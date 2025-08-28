import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function HistoricoLoading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 dark:bg-gray-800">
          <Skeleton className="h-7 sm:h-9 w-60 sm:w-80 mb-2" />
          <Skeleton className="h-5 sm:h-6 w-72 sm:w-96" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[1, 2, 3, 4].map((i) => (
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

        <div className="flex justify-end mb-6">
          <Skeleton className="h-9 w-full sm:w-24" />
        </div>

        <div className="grid w-full grid-cols-2 shadow-sm rounded-lg p-1 mb-6 dark:bg-gray-800 dark:border-gray-700">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="rounded-t-lg">
            <Skeleton className="h-5 sm:h-6 w-48 sm:w-64 mb-2" />
            <Skeleton className="h-4 w-72 sm:w-96" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Skeleton className="h-5 w-28 sm:w-32" />
                        <Skeleton className="h-5 w-14 sm:w-16" />
                      </div>
                      <Skeleton className="h-4 w-36 sm:w-48 mb-2" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 rounded-full flex-shrink-0" />
                        <Skeleton className="h-3 w-20 sm:w-24" />
                      </div>
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
