import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function RelatoriosLoading() {
  return (
    <div className="space-y-6">
      {/* Header Loading */}
      <div className="text-center">
        <Skeleton className="h-9 w-80 mx-auto mb-2" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      {/* Card Principal Loading */}
      <Card className="text-center py-16 max-w-4xl mx-auto">
        <CardContent className="space-y-6">
          {/* Ícone do Cadeado Loading */}
          <div className="relative inline-block">
            <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
            <div className="absolute -top-2 -right-2">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>

          {/* Título e Descrição Loading */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-96 mx-auto" />
            <Skeleton className="h-6 w-2xl mx-auto" />
          </div>

          {/* Recursos Futuros Loading */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-left space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>

          {/* Call to Action Loading */}
          <div className="pt-6 border-t">
            <Skeleton className="h-4 w-80 mx-auto mb-4" />
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Informações Adicionais Loading */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="w-2 h-2 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Recursos Temporários Loading */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-64" />
          </div>
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 text-center">
                <Skeleton className="h-8 w-8 rounded mx-auto mb-2" />
                <Skeleton className="h-5 w-24 mx-auto mb-1" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

