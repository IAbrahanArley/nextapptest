import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Pronto para Transformar
            <br />
            Seu Negócio?
          </h2>

          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Junte-se a nós e aumente sua receita em até 300% com nosso sistema
            de fidelidade inteligente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="group bg-white text-black hover:bg-white/90"
            >
              Comece Seu Teste Grátis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-white/30 hover:text-white  hover:bg-white/10 text-white"
            >
              Agendar Demonstração
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-white/80 text-sm">
            <div>✓ 30 dias grátis</div>
            <div>✓ Sem compromisso</div>
            <div>✓ Setup em 5 minutos</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
