import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      id: "basico",
      name: "Básico",
      price: "R$ 29,90",
      period: "/mês",
      description: "Perfeito para começar",
      features: [
        "Até 100 clientes",
        "Até 5 promoções ativas",
        "Programa de pontos básico",
        "Analytics essenciais",
        "Suporte por email",
      ],
      cta: "Começar Grátis",
      popular: false,
    },
    {
      id: "premium",
      name: "Premium",
      price: "R$ 79,90",
      period: "/mês",
      description: "Para empresas em crescimento",
      features: [
        "Até 500 clientes",
        "Até 10 promoções ativas",
        "Até 2 Estabelecimentos",
        "Programa de pontos básico",
        "Analytics essenciais",
        "Suporte prioritário",
      ],
      cta: "Teste 7 Dias",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Customizado",
      period: "",
      description: "Para grandes empresas",
      features: [
        "Clientes ilimitados",
        "IA personalizada",
        "Gerente dedicado",
        "SLA garantido",
        "Implementação assistida",
        "Treinamento da equipe",
        "Relatórios customizados",
      ],
      cta: "Falar com Vendas",
      popular: false,
    },
  ];

  return (
    <section id="precos" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Planos que
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {" "}
              Crescem{" "}
            </span>
            com Você
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Escolha o plano ideal para o tamanho do seu negócio. Todos incluem
            teste grátis de 7 dias
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group ${plan.popular ? "scale-105" : ""}`}
            >
              <div
                className={`bg-gradient-subtle rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-glow hover:-translate-y-2 ${
                  plan.popular
                    ? "ring-2 ring-secondary shadow-glow"
                    : "shadow-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Mais Popular</span>
                    </div>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center space-x-3"
                    >
                      <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={plan.popular ? "cta" : "outline"}
                  size="lg"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            💳 Planos sem consumir seu limite • ⚡ Comece em 5 minutos • 🛡️
            Teste grátis por 7 dias
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
