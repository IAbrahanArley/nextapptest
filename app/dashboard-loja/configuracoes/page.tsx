"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Store,
  Lock,
  Percent,
  Upload,
  X,
  Image as ImageIcon,
  Bell,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useStoreData } from "@/hooks/queries/use-store-data";
import { useUpdateStoreData } from "@/hooks/mutations/use-update-store-data";
import { useUpdatePointsRules } from "@/hooks/mutations/use-update-points-rules";
import { useChangePassword } from "@/hooks/mutations/use-change-password";
import { useStoreId } from "@/hooks/queries/use-store-id";
import { ConfiguracoesSkeleton } from "@/components/ui/dashboard-skeleton";

// Schema de validação para dados da loja
const storeDataSchema = z.object({
  name: z
    .string()
    .min(1, "Nome da loja é obrigatório")
    .max(256, "Nome muito longo"),
  description: z.string().optional(),
  cnpj: z
    .string()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido")
    .optional(),
  email: z.string().email("E-mail inválido").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  whatsapp: z.string().optional(),
});

// Schema de validação para regras de pontuação
const pointsSchema = z.object({
  points_per_currency_unit: z
    .number()
    .min(0.01, "Valor mínimo é 0.01")
    .max(100, "Valor máximo é 100"),
  min_purchase_value_to_award: z
    .number()
    .min(0, "Valor mínimo é 0")
    .max(10000, "Valor máximo é R$ 10.000,00"),
  points_validity_days: z
    .number()
    .min(1, "Validade mínima é 1 dia")
    .max(3650, "Validade máxima é 10 anos"),
});

// Schema de validação para troca de senha
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(6, "Nova senha deve ter pelo menos 6 caracteres")
      .max(128, "Nova senha deve ter no máximo 128 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Nova senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número"
      ),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type StoreDataForm = z.infer<typeof storeDataSchema>;
type PointsForm = z.infer<typeof pointsSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ConfiguracoesPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Buscar storeId do usuário
  const { data: storeIdData, isLoading: isLoadingStoreId } = useStoreId();
  const storeId = storeIdData?.data?.storeId || `store-${user?.id}`;

  // Buscar dados da loja
  const { data: storeDataResult, isLoading: isLoadingStoreData } =
    useStoreData(storeId);

  // Hooks de mutação
  const updateStoreDataMutation = useUpdateStoreData();
  const updatePointsRulesMutation = useUpdatePointsRules();
  const changePasswordMutation = useChangePassword();

  // Formulário de dados da loja
  const storeForm = useForm<StoreDataForm>({
    resolver: zodResolver(storeDataSchema),
    defaultValues: {
      name: "",
      description: "",
      cnpj: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      instagram: "",
      facebook: "",
      whatsapp: "",
    },
  });

  // Formulário de regras de pontuação
  const pointsForm = useForm<PointsForm>({
    resolver: zodResolver(pointsSchema),
    defaultValues: {
      points_per_currency_unit: 1,
      min_purchase_value_to_award: 0,
      points_validity_days: 365,
    },
  });

  // Formulário de troca de senha
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Carregar dados da loja nos formulários
  useEffect(() => {
    if (storeDataResult?.success && storeDataResult.data) {
      const { store, points } = storeDataResult.data;

      // Preencher formulário de dados da loja
      storeForm.reset({
        name: store.name || "",
        description: store.description || "",
        cnpj: store.cnpj || "",
        email: store.email || "",
        phone: store.phone || "",
        address: store.address || "",
        website: store.website || "",
        instagram: store.instagram || "",
        facebook: store.facebook || "",
        whatsapp: store.whatsapp || "",
      });

      // Preencher formulário de pontuação
      pointsForm.reset({
        points_per_currency_unit: points.points_per_currency_unit || 1,
        min_purchase_value_to_award: points.min_purchase_value_to_award || 0,
        points_validity_days: points.points_validity_days || 365,
      });

      // Definir preview da imagem de perfil
      if (store.profileImageUrl) {
        setProfileImagePreview(store.profileImageUrl);
      }
    }
  }, [storeDataResult, storeForm, pointsForm]);

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Erro",
          description: "A imagem deve ter menos de 5MB",
          variant: "destructive",
        });
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setProfileImage(null);
    setProfileImagePreview("");
  };

  // Upload image to Google Cloud Storage
  const uploadImage = async () => {
    if (!profileImage) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", profileImage);

      const response = await fetch("/api/upload/profile-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        // Atualizar dados da loja com a nova URL da imagem
        if (data.success) {
          await updateStoreDataMutation.mutateAsync({
            storeId,
            name: storeForm.getValues("name"),
            profileImageUrl: data.url,
          });
        }

        toast({
          title: "Sucesso!",
          description: "Foto de perfil atualizada com sucesso",
        });

        // Reset form
        setProfileImage(null);
        setProfileImagePreview("");
      } else {
        throw new Error("Erro no upload");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Salvar dados da loja
  const onStoreSubmit = async (data: StoreDataForm) => {
    try {
      await updateStoreDataMutation.mutateAsync({
        storeId,
        ...data,
      });
    } catch (error) {
      console.error("Erro ao atualizar dados da loja:", error);
    }
  };

  // Salvar regras de pontuação
  const onPointsSubmit = async (data: PointsForm) => {
    try {
      console.log("Enviando dados de pontuação:", data);
      console.log("StoreId:", storeId);

      await updatePointsRulesMutation.mutateAsync({
        storeId,
        ...data,
      });
    } catch (error) {
      console.error("Erro ao atualizar regras de pontuação:", error);
    }
  };

  // Trocar senha
  const onPasswordSubmit = async (data: PasswordForm) => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não identificado",
        variant: "destructive",
      });
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        userId: user.id,
        ...data,
      });

      if (changePasswordMutation.isSuccess) {
        passwordForm.reset();
      }
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
    }
  };

  if (isLoadingStoreData || isLoadingStoreId) {
    return <ConfiguracoesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua loja e programa de fidelidade
        </p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Dados da Loja
          </TabsTrigger>
          <TabsTrigger value="points" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            Pontuação
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Senha
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        {/* Dados da Loja */}
        <TabsContent value="store" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Store className="h-5 w-5" />
                Informações da Loja
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure os dados básicos e de contato da sua loja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={storeForm.handleSubmit(onStoreSubmit)}
                className="space-y-6"
              >
                {/* Foto de Perfil */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Foto de Perfil
                  </h3>

                  <div className="flex items-center gap-6">
                    <div className="relative">
                      {profileImagePreview ? (
                        <div className="relative">
                          <img
                            src={profileImagePreview}
                            alt="Preview"
                            className="w-24 h-24 rounded-full object-cover border-2 border-border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                            onClick={removeImage}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <Label
                          htmlFor="profile-image"
                          className="cursor-pointer text-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Selecionar Imagem
                          </div>
                        </Label>
                        <Input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG ou WebP. Máximo 5MB.
                        </p>
                      </div>

                      {profileImage && (
                        <Button
                          type="button"
                          onClick={uploadImage}
                          disabled={isUploadingImage}
                          size="sm"
                        >
                          {isUploadingImage ? "Enviando..." : "Fazer Upload"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Dados Básicos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Dados Básicos
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground">
                        Nome da Loja *
                      </Label>
                      <Input
                        id="name"
                        {...storeForm.register("name")}
                        placeholder="Nome da sua loja"
                        className="bg-background border-border"
                      />
                      {storeForm.formState.errors.name && (
                        <p className="text-sm text-destructive">
                          {storeForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cnpj" className="text-foreground">
                        CNPJ
                      </Label>
                      <Input
                        id="cnpj"
                        {...storeForm.register("cnpj")}
                        placeholder="00.000.000/0000-00"
                        className="bg-background border-border"
                      />
                      {storeForm.formState.errors.cnpj && (
                        <p className="text-sm text-destructive">
                          {storeForm.formState.errors.cnpj.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground">
                      Descrição
                    </Label>
                    <Textarea
                      id="description"
                      {...storeForm.register("description")}
                      placeholder="Descreva sua loja..."
                      rows={3}
                      className="bg-background border-border"
                    />
                  </div>
                </div>

                <Separator />

                {/* Contato */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Informações de Contato
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...storeForm.register("email")}
                        placeholder="contato@loja.com"
                        className="bg-background border-border"
                      />
                      {storeForm.formState.errors.email && (
                        <p className="text-sm text-destructive">
                          {storeForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground">
                        Telefone
                      </Label>
                      <Input
                        id="phone"
                        {...storeForm.register("phone")}
                        placeholder="(11) 99999-9999"
                        className="bg-background border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-foreground">
                      Endereço
                    </Label>
                    <Input
                      id="address"
                      {...storeForm.register("address")}
                      placeholder="Endereço completo da loja"
                      className="bg-background border-border"
                    />
                  </div>
                </div>

                <Separator />

                {/* Redes Sociais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Redes Sociais e Website
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-foreground">
                        Website
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        {...storeForm.register("website")}
                        placeholder="https://www.loja.com"
                        className="bg-background border-border"
                      />
                      {storeForm.formState.errors.website && (
                        <p className="text-sm text-destructive">
                          {storeForm.formState.errors.website.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-foreground">
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        {...storeForm.register("instagram")}
                        placeholder="@loja ou https://instagram.com/loja"
                        className="bg-background border-border"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook" className="text-foreground">
                        Facebook
                      </Label>
                      <Input
                        id="facebook"
                        {...storeForm.register("facebook")}
                        placeholder="https://facebook.com/loja"
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp" className="text-foreground">
                        WhatsApp
                      </Label>
                      <Input
                        id="whatsapp"
                        {...storeForm.register("whatsapp")}
                        placeholder="(11) 99999-9999"
                        className="bg-background border-border"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={updateStoreDataMutation.isPending}
                  >
                    {updateStoreDataMutation.isPending
                      ? "Salvando..."
                      : "Salvar Dados da Loja"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regras de Pontuação */}
        <TabsContent value="points" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Percent className="h-5 w-5" />
                Regras de Pontuação
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure como os clientes ganham pontos na sua loja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={pointsForm.handleSubmit(onPointsSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="points_per_currency_unit"
                        className="text-foreground"
                      >
                        Pontos por Real Gasto *
                      </Label>
                      <Input
                        id="points_per_currency_unit"
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="100"
                        {...pointsForm.register("points_per_currency_unit", {
                          valueAsNumber: true,
                        })}
                        placeholder="1.00"
                        className="bg-background border-border"
                      />
                      <p className="text-xs text-muted-foreground">
                        Quantos pontos o cliente ganha por R$ 1,00 gasto
                      </p>
                      {pointsForm.formState.errors.points_per_currency_unit && (
                        <p className="text-sm text-destructive">
                          {
                            pointsForm.formState.errors.points_per_currency_unit
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="min_purchase_value_to_award"
                        className="text-foreground"
                      >
                        Valor Mínimo para Ganhar Pontos
                      </Label>
                      <Input
                        id="min_purchase_value_to_award"
                        type="number"
                        step="0.01"
                        min="0"
                        max="10000"
                        {...pointsForm.register("min_purchase_value_to_award", {
                          valueAsNumber: true,
                        })}
                        placeholder="0.00"
                        className="bg-background border-border"
                      />
                      <p className="text-xs text-muted-foreground">
                        Valor mínimo da compra para começar a acumular pontos
                      </p>
                      {pointsForm.formState.errors
                        .min_purchase_value_to_award && (
                        <p className="text-sm text-destructive">
                          {
                            pointsForm.formState.errors
                              .min_purchase_value_to_award.message
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="points_validity_days"
                        className="text-foreground"
                      >
                        Validade dos Pontos (dias) *
                      </Label>
                      <Input
                        id="points_validity_days"
                        type="number"
                        min="1"
                        max="3650"
                        {...pointsForm.register("points_validity_days", {
                          valueAsNumber: true,
                        })}
                        placeholder="365"
                        className="bg-background border-border"
                      />
                      <p className="text-xs text-muted-foreground">
                        Quantos dias os pontos ficam válidos antes de expirarem
                      </p>
                      {pointsForm.formState.errors.points_validity_days && (
                        <p className="text-sm text-destructive">
                          {
                            pointsForm.formState.errors.points_validity_days
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Exemplo de Pontuação
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Com a configuração atual, um cliente que gastar R$
                        100,00 ganhará{" "}
                        <span className="font-bold">
                          {pointsForm.watch("points_per_currency_unit") || 1} ×
                          100 ={" "}
                          {(pointsForm.watch("points_per_currency_unit") || 1) *
                            100}
                        </span>{" "}
                        pontos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={updatePointsRulesMutation.isPending}
                  >
                    {updatePointsRulesMutation.isPending
                      ? "Salvando..."
                      : "Salvar Regras de Pontuação"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Troca de Senha */}
        <TabsContent value="password" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Lock className="h-5 w-5" />
                Alterar Senha
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Altere sua senha de acesso ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPassword"
                      className="text-foreground"
                    >
                      Senha Atual *
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...passwordForm.register("currentPassword")}
                      placeholder="Digite sua senha atual"
                      className="bg-background border-border"
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-foreground">
                      Nova Senha *
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...passwordForm.register("newPassword")}
                      placeholder="Digite a nova senha"
                      className="bg-background border-border"
                    />
                    <p className="text-xs text-muted-foreground">
                      Mínimo de 6 caracteres, deve conter maiúscula, minúscula e
                      número
                    </p>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-foreground"
                    >
                      Confirmar Nova Senha *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...passwordForm.register("confirmPassword")}
                      placeholder="Confirme a nova senha"
                      className="bg-background border-border"
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending
                      ? "Alterando..."
                      : "Alterar Senha"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Bell className="h-5 w-5" />
                Configurações de Notificações
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure como e quando notificar seus clientes (implementação
                futura)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <Label className="text-foreground">
                        Notificações via WhatsApp
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enviar mensagens automáticas via WhatsApp quando o cliente
                      ganhar pontos
                    </p>
                  </div>
                  <Switch disabled />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">
                      Notificações via E-mail
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar e-mails quando o cliente ganhar pontos ou houver
                      promoções
                    </p>
                  </div>
                  <Switch disabled />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">
                      Avisos de Vencimento
                    </Label>
                    <p className="text-sm text-muted-foreground">
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
                    As configurações de notificações serão implementadas em uma
                    versão futura do sistema.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
