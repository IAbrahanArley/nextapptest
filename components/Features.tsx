import { Button } from "@/components/ui/button";
import { Gift, BarChart3, Users, Smartphone, Zap, Target } from "lucide-react";
import growthChart from "@/assets/growth-chart.jpg";
import metricsDashboard from "@/assets/metrics-dashboard.jpg";
import Image from "next/image";

const Features = () => {
  const features = [
    {
      icon: Gift,
      title: "Programa de Pontos",
      description:
        "Sistema flexível de recompensas que mantém seus clientes engajados",
    },
    {
      icon: BarChart3,
      title: "Analytics Avançado",
      description: "Dashboards em tempo real para acompanhar performance e ROI",
    },
    {
      icon: Users,
      title: "Segmentação Inteligente",
      description:
        "IA que identifica padrões e personaliza ofertas automaticamente",
    },

    {
      icon: Smartphone,
      title: "Sistema de pontos",
      description:
        "Escolha como seus clientes ganham e resgatam pontos, com opções de descontos e prêmios",
    },
    {
      icon: Zap,
      title: "Simplicidade de Uso",
      description:
        "Interface intuitiva que facilita a gestão do programa de fidelidade",
    },

    {
      icon: Target,
      title: "Campanhas Personalizadas",
      description:
        "Crie campanhas segmentadas para aumentar o engajamento e as vendas",
    },
  ];

  return (
    <section id="recursos" className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Recursos que
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {" "}
              Geram Resultados
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tudo que você precisa para criar um programa de fidelidade que
            realmente funciona
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
            <Image
              src="/image1.png"
              alt="Gráfico de Crescimento"
              className="w-full h-2/5 rounded-2xl shadow-hero object-cover"
              width={200}
              height={100}
            />
            <Image
              src="/image2.png"
              alt="Dashboard de Métricas"
              className="w-full h-2/5 rounded-2xl shadow-hero"
              width={200}
              height={100}
            />
          </div>
        </div>

        <div className="text-center">
          <Button size="lg">Teste Todos os Recursos Grátis</Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
