import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ClientesLoading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-7 sm:h-9 w-32 sm:w-40 mb-2" />
            <Skeleton className="h-5 sm:h-6 w-64 sm:w-80" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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

        {/* Search Filters */}
        <Card className="shadow-sm mb-6">
          <CardHeader>
            <Skeleton className="h-5 w-16" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>

        {/* Clients List */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-28" />
                    </div>
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
