import { Button } from "@/components/ui/button";
import {
  Gift,
  BarChart3,
  Users,
  Smartphone,
  Zap,
  Target,
  Shield,
  Settings,
  CreditCard,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import growthChart from "@/assets/growth-chart.jpg";
import metricsDashboard from "@/assets/metrics-dashboard.jpg";
import Image from "next/image";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Controle Total",
      description:
        "Sua loja tem autonomia completa para configurar regras, valores e condições de pontuação",
    },
    {
      icon: CreditCard,
      title: "Pontos por Nota Fiscal",
      description:
        "Sistema simples que coleta pontos automaticamente baseado no valor da compra",
    },
    {
      icon: Settings,
      title: "Configuração Flexível",
      description:
        "Defina quantos pontos por real, validade dos pontos e regras de resgate",
    },
    {
      icon: Gift,
      title: "Prêmios Personalizados",
      description:
        "Crie recompensas exclusivas que fazem sentido para seu negócio e clientes",
    },
    {
      icon: Zap,
      title: "Setup em 5 Minutos",
      description:
        "Interface intuitiva que permite configurar todo o sistema rapidamente",
    },
    {
      icon: TrendingUp,
      title: "Resultados Visíveis",
      description:
        "Acompanhe o crescimento da fidelização e o retorno sobre investimento em tempo real",
    },
  ];

  return (
    <section id="recursos" className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Simplicidade e
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {" "}
              Autonomia Total
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Um sistema feito para lojistas que querem controle total sobre seu
            programa de fidelidade, sem complicações desnecessárias
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="group h-full">
                  <div className="bg-background rounded-xl p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 w-full px-8">
            <div className="relative">
              <Image
                src="/image1.png"
                alt="Dashboard de Controle"
                className="w-full h-2/5 rounded-2xl shadow-hero object-cover"
                width={200}
                height={100}
              />
            </div>
            <div className="relative">
              <Image
                src="/image2.png"
                alt="Configuração Simples"
                className="w-full h-2/5 rounded-2xl shadow-hero"
                width={200}
                height={100}
              />
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            <span className="font-semibold text-white">
              Sem contratos longos
            </span>{" "}
            •
            <span className="font-semibold text-white">
              {" "}
              Sem mensalidades ocultas
            </span>{" "}
            •
            <span className="font-semibold text-white">
              {" "}
              Cancele quando quiser
            </span>
          </p>
          <Button size="lg" className="group">
            Teste por 14 dias
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
