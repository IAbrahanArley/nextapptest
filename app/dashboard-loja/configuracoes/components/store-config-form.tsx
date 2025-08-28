"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Save, Store, Percent, Bell, Globe, Phone, MapPin } from "lucide-react";
import { useUpdateStoreConfig } from "@/hooks/mutations/use-update-store-config";
import {
  storeConfigSchema,
  type StoreConfigFormData,
} from "@/actions/store-config/schema";
import { useToast } from "@/hooks/use-toast";

interface StoreConfigFormProps {
  storeId: string;
  initialData: StoreConfigFormData;
}

export function StoreConfigForm({
  storeId,
  initialData,
}: StoreConfigFormProps) {
  const { toast } = useToast();
  const updateConfig = useUpdateStoreConfig(storeId);

  const form = useForm<StoreConfigFormData>({
    resolver: zodResolver(storeConfigSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: StoreConfigFormData) => {
    try {
      await updateConfig.mutateAsync(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Dados da Loja */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Dados da Loja
          </CardTitle>
          <CardDescription>Informações básicas da sua loja</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Loja *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Nome da sua loja"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                {...form.register("cnpj")}
                placeholder="00.000.000/0000-00"
                required
              />
              <p className="text-xs text-muted-foreground">
                O CNPJ é obrigatório para receber notas fiscais eletrônicas e
                atribuir pontos automaticamente.
              </p>
              {form.formState.errors.cnpj && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.cnpj.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Descreva sua loja..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="contato@loja.com"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                {...form.register("phone")}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              {...form.register("address")}
              placeholder="Endereço completo da loja"
            />
          </div>
        </CardContent>
      </Card>

      {/* Redes Sociais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Redes Sociais e Website
          </CardTitle>
          <CardDescription>
            Links para suas redes sociais e site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                {...form.register("website")}
                placeholder="https://www.loja.com"
              />
              {form.formState.errors.website && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.website.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                {...form.register("instagram")}
                placeholder="@loja ou https://instagram.com/loja"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                {...form.register("facebook")}
                placeholder="https://facebook.com/loja"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                {...form.register("whatsapp")}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Pontos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Configurações de Pontos
          </CardTitle>
          <CardDescription>
            Configure as regras de acumulação e validade dos pontos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points_per_currency_unit">
                Pontos por Real Gasto *
              </Label>
              <Input
                id="points_per_currency_unit"
                type="number"
                step="0.01"
                min="0.01"
                max="100"
                {...form.register("points_per_currency_unit", {
                  valueAsNumber: true,
                })}
                placeholder="1.00"
              />
              <p className="text-xs text-gray-500">
                Quantos pontos o cliente ganha por R$ 1,00 gasto
              </p>
              {form.formState.errors.points_per_currency_unit && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.points_per_currency_unit.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_purchase_value_to_award">
                Valor Mínimo para Ganhar Pontos
              </Label>
              <Input
                id="min_purchase_value_to_award"
                type="number"
                step="0.01"
                min="0"
                {...form.register("min_purchase_value_to_award", {
                  valueAsNumber: true,
                })}
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500">
                Valor mínimo da compra para começar a acumular pontos
              </p>
              {form.formState.errors.min_purchase_value_to_award && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.min_purchase_value_to_award.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="points_validity_days">
              Validade dos Pontos (dias) *
            </Label>
            <Input
              id="points_validity_days"
              type="number"
              min="1"
              max="3650"
              {...form.register("points_validity_days", {
                valueAsNumber: true,
              })}
              placeholder="365"
            />
            <p className="text-xs text-gray-500">
              Quantos dias os pontos ficam válidos antes de expirarem
            </p>
            {form.formState.errors.points_validity_days && (
              <p className="text-sm text-red-500">
                {form.formState.errors.points_validity_days.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure como e quando notificar seus clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <Label htmlFor="notification_whatsapp">
                  Notificações via WhatsApp
                </Label>
              </div>
              <p className="text-sm text-gray-500">
                Enviar mensagens automáticas via WhatsApp quando o cliente
                ganhar pontos
              </p>
            </div>
            <Switch
              id="notification_whatsapp"
              checked={form.watch("notification_whatsapp")}
              onCheckedChange={(checked) =>
                form.setValue("notification_whatsapp", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notification_email">
                Notificações via E-mail
              </Label>
              <p className="text-sm text-gray-500">
                Enviar e-mails quando o cliente ganhar pontos ou houver
                promoções
              </p>
            </div>
            <Switch
              id="notification_email"
              checked={form.watch("notification_email")}
              onCheckedChange={(checked) =>
                form.setValue("notification_email", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notification_expiration">
                Avisos de Vencimento
              </Label>
              <p className="text-sm text-gray-500">
                Notificar clientes sobre pontos que estão prestes a vencer
              </p>
            </div>
            <Switch
              id="notification_expiration"
              checked={form.watch("notification_expiration")}
              onCheckedChange={(checked) =>
                form.setValue("notification_expiration", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Botão de salvar */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={updateConfig.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {updateConfig.isPending ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </form>
  );
}
