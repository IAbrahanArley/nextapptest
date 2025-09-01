import { Button } from "@/components/ui/button";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Shield,
  Zap,
  Target,
} from "lucide-react";
import Image from "next/image";

const ROI = () => {
  return (
    <section id="resultados" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Autonomia que
                <span className="bg-gradient-secondary bg-clip-text text-transparent">
                  {" "}
                  Gera Resultados{" "}
                </span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Sua loja tem controle total sobre o sistema de pontos,
                permitindo criar estratégias personalizadas que realmente
                funcionam para seu negócio
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 bg-gradient-subtle rounded-xl">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Controle Total da Loja
                  </h3>
                  <p className="text-muted-foreground">
                    Configure regras de pontuação, validade dos pontos e
                    condições de resgate exatamente como sua loja precisa
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-subtle rounded-xl">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Pontos por Nota Fiscal
                  </h3>
                  <p className="text-muted-foreground">
                    Sistema automático que coleta pontos baseado no valor da
                    compra, sem complicações ou configurações complexas
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-subtle rounded-xl">
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Setup em 5 Minutos
                  </h3>
                  <p className="text-muted-foreground">
                    Interface intuitiva que permite configurar todo o sistema
                    rapidamente, sem necessidade de treinamentos ou suporte
                    técnico
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-subtle rounded-xl">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    ROI de 300% em 6 Meses
                  </h3>
                  <p className="text-muted-foreground">
                    Para cada R$ 1 investido, nossas lojas recuperam R$ 3 em
                    receita adicional, com controle total sobre a estratégia
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/grafico1.png"
              alt="Dashboard de Controle"
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
