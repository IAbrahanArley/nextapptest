import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Sua Loja,
            <br />
            Seu Controle Total
          </h2>

          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Experimente a liberdade de gerenciar seu próprio sistema de
            fidelidade. Simples, rápido e 100% sob seu controle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="group bg-white text-black hover:bg-white/90"
            >
              Teste Grátis por 14 Dias
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-white/30 hover:text-white  hover:bg-white/10 text-white"
            >
              Ver Como Funciona
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-white/80 text-sm">
            <div>✓ 14 dias grátis</div>
            <div>✓ Controle total da loja</div>
            <div>✓ Setup em 5 minutos</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
