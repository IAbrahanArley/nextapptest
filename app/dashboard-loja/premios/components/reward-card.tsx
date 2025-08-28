import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RewardCardProps {
  reward: any;
  onDelete: (id: string) => void;
}

export function RewardCard({ reward, onDelete }: RewardCardProps) {
  const getStatusBadge = (active: boolean) => {
    return active
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-700"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-700";
  };

  const getStatusText = (active: boolean) => {
    return active ? "Disponível" : "Indisponível";
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {reward.title}
          </CardTitle>
          <Badge variant="outline" className={getStatusBadge(reward.active)}>
            {getStatusText(reward.active)}
          </Badge>
        </div>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {reward.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Pontos necessários:
          </span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {reward.cost_points}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Tipo:
          </span>
          <Badge
            variant="outline"
            className="capitalize border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          >
            {reward.type}
          </Badge>
        </div>

        {reward.quantity && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Quantidade:
            </span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {reward.quantity}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Resgates:
          </span>
          <span className="font-bold text-green-600 dark:text-green-400">
            {reward.redemptions_count || 0}
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          <Link href={`/dashboard-loja/premios/editar/${reward.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Prêmio</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o prêmio "{reward.title}"? Esta
                  ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(reward.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
