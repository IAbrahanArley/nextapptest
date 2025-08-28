import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  cancelAtPeriodEnd: boolean;
}

export function CancelSubscriptionDialog({
  open,
  onOpenChange,
  onConfirm,
  cancelAtPeriodEnd,
}: CancelSubscriptionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
            Cancelar Assinatura
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
            Tem certeza que deseja cancelar sua assinatura?
            {cancelAtPeriodEnd
              ? " Ela será cancelada no final do período atual."
              : " Ela será cancelada imediatamente."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white"
          >
            Confirmar Cancelamento
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
