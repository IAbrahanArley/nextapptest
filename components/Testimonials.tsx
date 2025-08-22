import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      role: "CEO, Loja Fashion",
      content:
        "Em 3 meses aumentamos a retenção em 70% e o faturamento em 250%. O FideliSaaS transformou nosso negócio!",
      rating: 5,
      growth: "+250% faturamento",
    },
    {
      name: "João Santos",
      role: "Diretor, Rede de Farmácias",
      content:
        "A automação é incrível! Nossos clientes adoram o programa de pontos e compramos muito mais.",
      rating: 5,
      growth: "+180% frequência",
    },
    {
      name: "Ana Costa",
      role: "Gerente, Restaurante",
      content:
        "Implementação super rápida e suporte excepcional. ROI positivo já no primeiro mês!",
      rating: 5,
      growth: "+320% ROI",
    },
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            O que Nossos
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {" "}
              Clientes{" "}
            </span>
            Dizem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Histórias reais de empresas que transformaram seus resultados
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group">
              <div className="bg-background rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2 h-full">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-accent fill-current"
                    />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold text-secondary">
                      {testimonial.growth}
                    </div>
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

export default Testimonials;
