"use client";

import {
  BarChart3,
  Users,
  CreditCard,
  Settings,
  QrCode,
  Play,
  CheckCircle,
} from "lucide-react";

const HowItWorks = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Dashboard dos Pontos",
      keywords: [
        "Métricas em tempo real",
        "Relatórios detalhados",
        "Visão geral completa",
        "Indicadores de fidelidade",
      ],
      videoPlaceholder: "Vídeo: Dashboard dos Pontos",
      videoSrc: "/videos/dashboard-pontos.mp4",
    },
    {
      icon: Users,
      title: "Criação de Clientes",
      keywords: [
        "Busca por CPF",
        "Gestão de contatos",
        "Cadastro rápido",
        "Histórico de compras",
      ],
      videoPlaceholder: "Vídeo: Criação de Clientes",
      videoSrc: "/videos/criacao-clientes.mkv",
    },
    {
      icon: CreditCard,
      title: "Transações de Pontos",
      keywords: [
        "Pontos por nota fiscal",
        "Regras personalizadas",
        "Movimentações automáticas",
        "Acompanhamento em tempo real",
      ],
      videoPlaceholder: "Vídeo: Transações de Pontos",
      videoSrc: "/videos/transacoes-pontos.mp4",
    },
    {
      icon: Settings,
      title: "Configuração das Regras",
      keywords: [
        "Pontos por real",
        "Validade configurável",
        "Condições de resgate",
        "Regras flexíveis",
      ],
      videoPlaceholder: "Vídeo: Configuração das Regras",
      videoSrc: "/videos/configuracao-regras.mp4",
    },
    {
      icon: QrCode,
      title: "Validação por QR Code",
      keywords: [
        "QR codes únicos",
        "Validação instantânea",
        "Segurança garantida",
        "Rastreamento completo",
      ],
      videoPlaceholder: "Vídeo: Validação por QR Code",
      videoSrc: "/videos/validacao-qr-code.mp4",
    },
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Como
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {" "}
              Funciona
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubra como nossa plataforma simplifica o gerenciamento de
            fidelidade da sua loja em poucos passos
          </p>
        </div>

        <div className="space-y-12">
          {features.map((feature, index) => (
            <div key={index} className="group">
              {/* Layout responsivo: empilhado em mobile, lado a lado em desktop */}
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Left Side - Feature Card */}
                <div className="h-56">
                  <div className="bg-background rounded-xl p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 border border-white/10 h-full flex flex-col">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <feature.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 text-foreground">
                          {feature.title}
                        </h3>
                      </div>
                    </div>

                    {/* Keywords com checkmarks */}
                    <div className="space-y-2 flex-1">
                      {feature.keywords.map((keyword, keywordIndex) => (
                        <div
                          key={keywordIndex}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {keyword}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="h-56">
                  <div className="relative bg-gradient-subtle rounded-lg h-full overflow-hidden border border-white/20 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-xl flex items-center justify-center">
                    <video
                      className="w-3/4 h-full shadow-lg"
                      controls
                      preload="metadata"
                      onError={(e) => console.error("Erro no vídeo:", e)}
                      onLoadStart={() =>
                        console.log("Vídeo carregando:", feature.videoSrc)
                      }
                      onCanPlay={() =>
                        console.log(
                          "Vídeo pronto para reproduzir:",
                          feature.videoSrc
                        )
                      }
                    >
                      <source src={feature.videoSrc} type="video/mp4" />
                      Seu navegador não suporta vídeos.
                    </video>

                    {/* Título que desce do canto superior no hover */}
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="text-left">
                        <h5 className="text-lg font-bold text-white mb-2">
                          {feature.title}
                        </h5>
                        <p className="text-white/80 text-sm">
                          Clique para assistir
                        </p>
                      </div>
                    </div>

                    {/* Sombra que desce do canto superior */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
