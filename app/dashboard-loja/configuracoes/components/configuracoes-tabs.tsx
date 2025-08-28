import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Percent, Lock, Bell } from "lucide-react";
import { StoreDataForm } from "./store-data-form";
import { PointsRulesForm } from "./points-rules-form";
import { ChangePasswordForm } from "./change-password-form";
import { NotificationsSettings } from "./notifications-settings";
import { ProfileImageUpload } from "./profile-image-upload";
import { Separator } from "@/components/ui/separator";

interface ConfiguracoesTabsProps {
  storeData: any;
  pointsData: any;
  onStoreDataSuccess?: () => void;
  onPointsDataSuccess?: () => void;
  onPasswordSuccess?: () => void;
  onImageUpload: (file: File) => Promise<void>;
}

export function ConfiguracoesTabs({
  storeData,
  pointsData,
  onStoreDataSuccess,
  onPointsDataSuccess,
  onPasswordSuccess,
  onImageUpload,
}: ConfiguracoesTabsProps) {
  return (
    <Tabs defaultValue="store" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4 dark:bg-gray-800 dark:border-gray-700">
        <TabsTrigger
          value="store"
          className="dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
        >
          <Store className="h-4 w-4 mr-2" />
          Loja
        </TabsTrigger>
        <TabsTrigger
          value="points"
          className="dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
        >
          <Percent className="h-4 w-4 mr-2" />
          Pontos
        </TabsTrigger>
        <TabsTrigger
          value="security"
          className="dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
        >
          <Lock className="h-4 w-4 mr-2" />
          Segurança
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          className="dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
        >
          <Bell className="h-4 w-4 mr-2" />
          Notificações
        </TabsTrigger>
      </TabsList>

      {/* Aba: Dados da Loja */}
      <TabsContent value="store" className="space-y-6">
        <ProfileImageUpload
          currentImageUrl={storeData?.profileImageUrl}
          onImageUpload={onImageUpload}
        />

        <Separator className="dark:bg-gray-600" />

        <StoreDataForm initialData={storeData} onSuccess={onStoreDataSuccess} />
      </TabsContent>

      {/* Aba: Regras de Pontuação */}
      <TabsContent value="points" className="space-y-6">
        <PointsRulesForm
          initialData={pointsData}
          onSuccess={onPointsDataSuccess}
        />
      </TabsContent>

      {/* Aba: Segurança */}
      <TabsContent value="security" className="space-y-6">
        <ChangePasswordForm onSuccess={onPasswordSuccess} />
      </TabsContent>

      {/* Aba: Notificações */}
      <TabsContent value="notifications" className="space-y-6">
        <NotificationsSettings />
      </TabsContent>
    </Tabs>
  );
}
