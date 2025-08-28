import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";

export function NotificationsSettings() {
  return (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Bell className="h-5 w-5" />
          Configurações de Notificações
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Configure como e quando notificar seus clientes (implementação futura)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Label className="text-gray-700 dark:text-gray-300">
                  Notificações via WhatsApp
                </Label>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enviar mensagens automáticas via WhatsApp quando o cliente
                ganhar pontos
              </p>
            </div>
            <Switch disabled />
          </div>

          <Separator className="dark:bg-gray-600" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-gray-700 dark:text-gray-300">
                Notificações via E-mail
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enviar e-mails quando o cliente ganhar pontos ou houver
                promoções
              </p>
            </div>
            <Switch disabled />
          </div>

          <Separator className="dark:bg-gray-600" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-gray-700 dark:text-gray-300">
                Avisos de Vencimento
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Notificar clientes sobre pontos que estão prestes a vencer
              </p>
            </div>
            <Switch disabled />
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              Funcionalidade em Desenvolvimento
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              As configurações de notificações serão implementadas em uma versão
              futura do sistema.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
