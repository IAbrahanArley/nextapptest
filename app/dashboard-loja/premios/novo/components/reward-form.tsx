"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import Link from "next/link";

interface RewardFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  defaultValues?: any;
}

export function RewardForm({
  onSubmit,
  isLoading,
  defaultValues,
}: RewardFormProps) {
  const [formData, setFormData] = useState({
    title: defaultValues?.title || "Teste Prêmio",
    description: defaultValues?.description || "Descrição de teste",
    cost_points: defaultValues?.cost_points || 100,
    type: defaultValues?.type || "product",
    active: defaultValues?.active ?? true,
    quantity: defaultValues?.quantity || undefined,
    redemption_validity_days: defaultValues?.redemption_validity_days || 30,
  });

  console.log("=== DEBUG FORM RENDER ===");
  console.log("formData:", formData);
  console.log("onSubmit prop:", onSubmit);
  console.log("onSubmit type:", typeof onSubmit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("=== DEBUG FORM SUBMIT ===");
    console.log("Form data:", formData);
    console.log("onSubmit function:", onSubmit);
    console.log("onSubmit type:", typeof onSubmit);

    try {
      onSubmit(formData);
      console.log("onSubmit executado com sucesso");
    } catch (error) {
      console.error("Erro ao executar onSubmit:", error);
    }
  };

  const handleButtonClick = () => {
    console.log("=== DEBUG BUTTON CLICK ===");
    console.log("Botão clicado!");
    console.log("formData:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Nome do Prêmio *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Ex: Desconto 10%"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="cost_points"
            className="text-sm font-medium text-gray-700"
          >
            Pontos Necessários *
          </Label>
          <Input
            id="cost_points"
            type="number"
            min="1"
            value={formData.cost_points}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                cost_points: parseInt(e.target.value),
              }))
            }
            placeholder="100"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="text-sm font-medium text-gray-700"
        >
          Descrição *
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Descreva o prêmio e como utilizá-lo..."
          rows={3}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium text-gray-700">
            Tipo de Prêmio
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">Produto</SelectItem>
              <SelectItem value="discount">Desconto</SelectItem>
              <SelectItem value="coupon">Cupom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="quantity"
            className="text-sm font-medium text-gray-700"
          >
            Quantidade Disponível (Opcional)
          </Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity || ""}
            onChange={(e) => {
              const value = e.target.value;
              setFormData((prev) => ({
                ...prev,
                quantity: value === "" ? undefined : parseInt(value),
              }));
            }}
            placeholder="Deixe em branco para ilimitado"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">
            Deixe em branco se o prêmio não tiver limite de quantidade
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="redemption_validity_days"
            className="text-sm font-medium text-gray-700"
          >
            Validade para Resgate (Dias)
          </Label>
          <Input
            id="redemption_validity_days"
            type="number"
            min="1"
            max="365"
            value={formData.redemption_validity_days}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                redemption_validity_days: parseInt(e.target.value),
              }))
            }
            placeholder="30"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">
            Quantos dias o cliente tem para resgatar o prêmio após a compra
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, active: checked }))
          }
        />
        <Label htmlFor="active" className="text-sm font-medium text-gray-700">
          Prêmio disponível para resgate
        </Label>
      </div>

      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          disabled={isLoading}
          onClick={handleButtonClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Salvando..." : "Salvar Prêmio"}
        </Button>
        <Link href="/dashboard-loja/premios">
          <Button
            variant="outline"
            type="button"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2.5"
          >
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  );
}
