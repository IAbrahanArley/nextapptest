import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Store, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

type UserType = "customer" | "merchant";

interface VerifyAccountFormProps {
  userType: UserType;
}

export default function VerifyAccountForm({
  userType,
}: VerifyAccountFormProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Código inválido",
        description: "Por favor, digite um código de 6 dígitos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implementar verificação OTP com NextAuth ou API customizada
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "Verificação OTP será implementada em breve",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      // TODO: Implementar reenvio OTP com NextAuth ou API customizada
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "Reenvio OTP será implementado em breve",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const title =
    userType === "merchant"
      ? "Verificar Conta - Loja"
      : "Verificar Conta - Cliente";
  const icon =
    userType === "merchant" ? (
      <Store className="h-6 w-6" />
    ) : (
      <Users className="h-6 w-6" />
    );

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-background/95">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">{icon}</div>
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>
            Digite o código de 6 dígitos enviado para
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value: string) => setOtp(value)}
              disabled={isLoading}
            >
              <InputOTPGroup>
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleVerifyOTP}
            className="w-full"
            variant="gradient"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? "Verificando..." : "Verificar Conta"}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Não recebeu o código?
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResendOTP}
              disabled={isResending}
            >
              {isResending ? "Reenviando..." : "Reenviar código"}
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/cadastro?type=${userType}`)}
            >
              Usar outro email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
