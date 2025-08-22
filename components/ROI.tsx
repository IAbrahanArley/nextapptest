import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";
import Image from "next/image";

const ROI = () => {
  return (
    <section id="resultados" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Aumente o
                <span className="bg-gradient-secondary bg-clip-text text-transparent">
                  {" "}
                  ROI{" "}
                </span>
                do Seu Negócio
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Veja quanto sua empresa pode economizar e ganhar com nossa
                plataforma de fidelidade
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 bg-gradient-subtle rounded-xl">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Aumento de 85% na Retenção
                  </h3>
                  <p className="text-muted-foreground">
                    Clientes fiéis compram 67% mais frequentemente e gastam 300%
                    mais ao longo do tempo
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-subtle rounded-xl">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    ROI de 300% em 6 meses
                  </h3>
                  <p className="text-muted-foreground">
                    Para cada R$ 1 investido, nossos clientes recuperam R$ 3 em
                    receita adicional
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-subtle rounded-xl">
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calculator className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Redução de 40% no CAC
                  </h3>
                  <p className="text-muted-foreground">
                    Indicações de clientes satisfeitos reduzem drasticamente o
                    custo de aquisição
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/grafico1.png"
              alt="Gráfico de ROI"
              className="w-full rounded-2xl shadow-hero"
              width={600}
              height={400}
            />
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-gradient-secondary rounded-2xl opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROI;
