"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Store, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { plans } from "@/lib/plans";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
    plan: z
      .enum(["basico", "premium", "enterprise"], {
        required_error: "Selecione um plano",
      })
      .optional(),
    storeName: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value) return true; // Opcional
          // Permitir caracteres comuns em português, incluindo acentos
          return /^[a-zA-ZÀ-ÿ0-9\s\-\.]+$/.test(value);
        },
        {
          message:
            "Nome da loja deve conter apenas letras, números, espaços, hífens e pontos",
        }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.plan === "enterprise") {
        return data.storeName && data.storeName.length > 0;
      }
      return true;
    },
    {
      message: "Nome da loja é obrigatório para o plano Enterprise",
      path: ["storeName"],
    }
  );

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  userType: UserRole;
}

export default function RegisterForm({ userType }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      storeName: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      console.log("Dados do formulário:", data);
      console.log("Tipo de usuário:", userType);
      console.log("Plano selecionado:", data.plan);

      // Validação adicional para lojistas
      if (userType === "merchant" && !data.plan) {
        toast({
          title: "Erro de validação",
          description: "Plano é obrigatório para lojistas",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Validação adicional para garantir que o plano seja válido para lojistas
      if (userType === "merchant" && data.plan) {
        const validPlans = ["basico", "premium", "enterprise"];
        if (!validPlans.includes(data.plan)) {
          toast({
            title: "Erro de validação",
            description: "Plano selecionado é inválido para lojistas",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      // Chamar API de cadastro
      const requestBody = {
        name: data.fullName,
        email: data.email,
        password: data.password,
        userType,
        storeName: data.storeName
          ? encodeURIComponent(data.storeName)
          : undefined,
        plan: data.plan,
      };

      console.log("Dados sendo enviados para a API:", requestBody);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log("Resposta da API de registro:", result);

      if (!response.ok) {
        throw new Error(result.error || "Erro no cadastro");
      }

      if (result.redirectToStripe) {
        console.log("Redirecionando para Stripe com plano:", data.plan);
        // Redirecionar para checkout do Stripe
        const stripeResponse = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            plan: data.plan,
            storeName: data.storeName
              ? encodeURIComponent(data.storeName)
              : undefined,
            userId: result.userId,
          }),
        });

        const stripeResult = await stripeResponse.json();
        console.log("Resposta do Stripe:", stripeResult);

        if (!stripeResponse.ok) {
          throw new Error(stripeResult.error || "Erro ao criar checkout");
        }

        // Redirecionar para Stripe
        window.location.href = stripeResult.sessionUrl;
      } else {
        // Cadastro direto (cliente ou enterprise)
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Redirecionando...",
        });

        // Redirecionar baseado no tipo de usuário
        if (userType === "merchant") {
          router.push("/dashboard-loja");
        } else {
          router.push("/cliente");
        }
      }
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle(userType);
    } finally {
      setIsLoading(false);
    }
  };

  const title =
    userType === "merchant" ? "Cadastro - Dono da Loja" : "Cadastro - Cliente";
  const icon =
    userType === "merchant" ? (
      <Store className="h-6 w-6" />
    ) : (
      <Users className="h-6 w-6" />
    );

  const availablePlans = plans.filter((plan) =>
    userType === "merchant" ? true : plan.id === "basico"
  );

  // Verificação adicional de segurança
  if (!plans || plans.length === 0) {
    console.error("ERRO: Nenhum plano encontrado em lib/plans.ts");
  }

  // Verificar estrutura dos planos
  plans.forEach((plan, index) => {
    if (!plan.id || !plan.name || typeof plan.price !== "number") {
      console.error(`ERRO: Plano ${index} com estrutura inválida:`, plan);
    }
  });

  if (
    userType === "merchant" &&
    (!availablePlans || availablePlans.length === 0)
  ) {
    console.error("ERRO: Nenhum plano disponível para lojistas");
  }

  console.log("=== DEBUG PLANOS ===");
  console.log("Tipo de usuário:", userType);
  console.log("Todos os planos disponíveis:", plans);
  console.log(
    "Planos filtrados para lojistas:",
    plans.filter((plan) => plan.id !== "basico")
  );
  console.log(
    "Planos filtrados para clientes:",
    plans.filter((plan) => plan.id === "basico")
  );
  console.log("Planos disponíveis no formulário:", availablePlans);
  console.log("=== FIM DEBUG ===");

  return (
    <Card className="w-full max-w-md backdrop-blur-sm bg-background/95">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">{icon}</div>
        </div>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>
          Crie sua conta para começar a usar nossa plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Seu nome completo"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="seu@email.com"
                      type="email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(11) 99999-9999"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {userType === "merchant" && (
              <>
                <FormField
                  control={form.control}
                  name="storeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Loja</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome da sua loja"
                          {...field}
                          disabled={isLoading}
                          onChange={(e) => {
                            // Permitir apenas caracteres seguros
                            const value = e.target.value;
                            // Permitir acentos e caracteres especiais comuns
                            const cleanValue = value.replace(
                              /[^\w\s\-\.À-ÿ]/g,
                              ""
                            );
                            field.onChange(cleanValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        Use letras, números, espaços, hífens, pontos e acentos
                      </p>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plano *</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          disabled={isLoading}
                          className={`w-full rounded-md border px-3 py-2 ${
                            form.formState.errors.plan
                              ? "border-red-500"
                              : "border-input"
                          } bg-background`}
                          onChange={(e) => {
                            console.log("Plano selecionado:", e.target.value);
                            field.onChange(e);
                          }}
                        >
                          <option value="">Selecione um plano</option>
                          {availablePlans && availablePlans.length > 0 ? (
                            availablePlans.map((plan) => (
                              <option key={plan.id} value={plan.id}>
                                {plan.name} - R${plan.price}/mês
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              Nenhum plano disponível
                            </option>
                          )}
                        </select>
                      </FormControl>
                      <FormMessage />
                      {field.value && (
                        <p className="text-sm text-primary">
                          Plano selecionado:{" "}
                          {
                            availablePlans.find((p) => p.id === field.value)
                              ?.name
                          }
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {availablePlans.length} plano(s) disponível(is)
                      </p>
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              variant="gradient"
              disabled={
                isLoading || (userType === "merchant" && !form.watch("plan"))
              }
            >
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>
        </Form>

        <div className="relative my-6">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-background px-2 text-muted-foreground text-sm">
              ou
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignup}
          disabled={isLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continuar com Google
        </Button>

        <div className="mt-6 text-center">
          <span className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link
              href={`/login?type=${userType}`}
              className="text-primary hover:text-primary/80 underline-offset-4 hover:underline font-medium"
            >
              Faça login
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
