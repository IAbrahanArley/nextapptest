"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import Link from "next/link";
import {
  createClientSchema,
  type CreateClientInput,
} from "@/actions/clients/schema";

interface ClientFormProps {
  onSubmit: (data: CreateClientInput) => void;
  isLoading?: boolean;
}

export function ClientForm({ onSubmit, isLoading }: ClientFormProps) {
  const form = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      cpf: "",
    },
  });

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7
      )}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
      7,
      11
    )}`;
  };

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9)
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
        6
      )}`;
    if (numbers.length <= 11)
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
        6,
        9
      )}-${numbers.slice(9)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
      6,
      9
    )}-${numbers.slice(9, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    form.setValue("phone", formatted);

    // Validação em tempo real
    const numbers = formatted.replace(/\D/g, "");
    if (numbers.length < 10) {
      form.setError("phone", {
        type: "manual",
        message: "Telefone deve ter pelo menos 10 dígitos",
      });
    } else if (numbers.length > 11) {
      form.setError("phone", {
        type: "manual",
        message: "Telefone deve ter no máximo 11 dígitos",
      });
    } else {
      form.clearErrors("phone");
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    form.setValue("cpf", formatted);

    // Validação em tempo real
    const numbers = formatted.replace(/\D/g, "");
    if (numbers.length < 11) {
      form.setError("cpf", {
        type: "manual",
        message: "CPF deve ter pelo menos 11 dígitos",
      });
    } else if (numbers.length > 11) {
      form.setError("cpf", {
        type: "manual",
        message: "CPF deve ter exatamente 11 dígitos",
      });
    } else {
      form.clearErrors("cpf");
    }
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Ex: Maria Silva"
            className={form.formState.errors.name ? "border-red-500" : ""}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            {...form.register("phone")}
            placeholder="(11) 99999-9999"
            className={form.formState.errors.phone ? "border-red-500" : ""}
            onChange={handlePhoneChange}
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-red-500">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="cliente@email.com"
            className={form.formState.errors.email ? "border-red-500" : ""}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            {...form.register("cpf")}
            placeholder="000.000.000-00"
            className={form.formState.errors.cpf ? "border-red-500" : ""}
            onChange={handleCpfChange}
          />
          {form.formState.errors.cpf && (
            <p className="text-sm text-red-500">
              {form.formState.errors.cpf.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Salvando..." : "Salvar Cliente"}
        </Button>
        <Link href="/dashboard-loja/clientes">
          <Button variant="outline" type="button">
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  );
}
