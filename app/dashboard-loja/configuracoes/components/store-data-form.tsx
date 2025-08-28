import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Store, Globe, Phone, MapPin } from "lucide-react";
import { useUpdateStoreData } from "@/hooks/mutations/use-update-store-data";
import { useToast } from "@/hooks/use-toast";

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

type StoreDataForm = z.infer<typeof storeDataSchema>;

interface StoreDataFormProps {
  initialData: StoreDataForm;
  onSuccess?: () => void;
}

export function StoreDataForm({ initialData, onSuccess }: StoreDataFormProps) {
  const { toast } = useToast();
  const updateStoreDataMutation = useUpdateStoreData();

  const form = useForm<StoreDataForm>({
    resolver: zodResolver(storeDataSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: StoreDataForm) => {
    try {
      await updateStoreDataMutation.mutateAsync(data);
      toast({
        title: "Sucesso",
        description: "Dados da loja atualizados com sucesso!",
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar dados da loja",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Store className="h-5 w-5" />
            Dados da Loja
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Informações básicas da sua loja
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dados Básicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Dados Básicos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Nome da Loja *
                </Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Nome da sua loja"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 dark:text-red-400">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="cnpj"
                  className="text-gray-700 dark:text-gray-300"
                >
                  CNPJ
                </Label>
                <Input
                  id="cnpj"
                  {...form.register("cnpj")}
                  placeholder="00.000.000/0000-00"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
                />
                {form.formState.errors.cnpj && (
                  <p className="text-sm text-red-500 dark:text-red-400">
                    {form.formState.errors.cnpj.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-gray-700 dark:text-gray-300"
              >
                Descrição
              </Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Descreva sua loja..."
                rows={3}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
              />
            </div>
          </div>

          <Separator className="dark:bg-gray-600" />

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Contato
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300"
                >
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="contato@sualoja.com"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500 dark:text-red-400">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Telefone
                </Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  placeholder="(11) 99999-9999"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="text-gray-700 dark:text-gray-300"
              >
                Endereço
              </Label>
              <Input
                id="address"
                {...form.register("address")}
                placeholder="Rua, número, bairro, cidade - UF"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
              />
            </div>
          </div>

          <Separator className="dark:bg-gray-600" />

          {/* Redes Sociais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Redes Sociais
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="website"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Website
                </Label>
                <Input
                  id="website"
                  {...form.register("website")}
                  placeholder="https://www.sualoja.com"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
                />
                {form.formState.errors.website && (
                  <p className="text-sm text-red-500 dark:text-red-400">
                    {form.formState.errors.website.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="instagram"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  {...form.register("instagram")}
                  placeholder="@sualoja"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="facebook"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  {...form.register("facebook")}
                  placeholder="facebook.com/sualoja"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="whatsapp"
                  className="text-gray-700 dark:text-gray-300"
                >
                  WhatsApp
                </Label>
                <Input
                  id="whatsapp"
                  {...form.register("whatsapp")}
                  placeholder="(11) 99999-9999"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={updateStoreDataMutation.isPending}
              className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white hover:bg-blue-700"
            >
              {updateStoreDataMutation.isPending
                ? "Salvando..."
                : "Salvar Dados"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
