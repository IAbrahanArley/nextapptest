import {
  Users,
  Gift,
  BarChart3,
  Settings,
  QrCode,
  CreditCard,
  Smartphone,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Award,
} from "lucide-react";

const PlatformFeatures = () => {
  const features = [
    {
      icon: Users,
      title: "Gestão de Clientes",
      description:
        "Cadastre e gerencie todos os seus clientes de forma simples",
    },
    {
      icon: Gift,
      title: "Sistema de Pontos",
      description: "Configure regras personalizadas de pontuação e recompensas",
    },
    {
      icon: CreditCard,
      title: "Transações Automáticas",
      description: "Pontos por nota fiscal com processamento automático",
    },
    {
      icon: QrCode,
      title: "Validação por QR Code",
      description: "Sistema seguro de validação para resgate de prêmios",
    },
    {
      icon: BarChart3,
      title: "Relatórios em Tempo Real",
      description: "Acompanhe o desempenho do seu programa de fidelidade",
    },
    {
      icon: Settings,
      title: "Configuração Flexível",
      description: "Personalize regras, validade e condições de resgate",
    },
    {
      icon: Smartphone,
      title: "App Mobile",
      description: "Acesso completo via smartphone para você e seus clientes",
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Dados protegidos com criptografia de ponta",
    },
    {
      icon: Zap,
      title: "Setup Rápido",
      description: "Configure todo o sistema em apenas 5 minutos",
    },
    {
      icon: Target,
      title: "Campanhas Personalizadas",
      description: "Crie promoções específicas para diferentes segmentos",
    },
    {
      icon: TrendingUp,
      title: "Analytics Avançado",
      description: "Métricas detalhadas para otimizar sua estratégia",
    },
    {
      icon: Award,
      title: "Programa de Fidelidade",
      description: "Sistema completo para reter e engajar clientes",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Recursos da
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {" "}
              Plataforma
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tudo que você precisa para criar um programa de fidelidade
            profissional e eficiente para sua loja
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-subtle rounded-xl p-6 h-full transition-all duration-300 hover:shadow-card hover:-translate-y-1 border border-white/10">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
