import { Button } from "@/components/ui/button";
import { ArrowRight, Star, TrendingUp, Users, Store } from "lucide-react";
import Link from "next/link";

import Image from "next/image";
const Hero = () => {
  return (
    <section className="pt-32 pb-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-accent fill-current" />
                <span>Plataforma #1 em Fidelidade</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Transforme
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  {" "}
                  Clientes{" "}
                </span>
                em Fãs Leais
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Aumente a retenção em até{" "}
                <span className="font-bold text-white">85%</span> e o
                faturamento em{" "}
                <span className="font-bold text-white">300%</span> com nossa
                plataforma de fidelidade inteligente.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/cadastro?type=merchant">
                  <Button size="lg" className="group w-full sm:w-auto">
                    <Store className="w-4 h-4 mr-2" />
                    Sou Lojista
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/cadastro?type=customer">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Sou Cliente
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span>ROI médio de 300%</span>
              </div>
              <div>✓ Sem cartão de crédito</div>
              <div>✓ Setup em 5 minutos</div>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full h-[500px] z-10">
              <Image
                src="/dashlaptop.png"
                alt="Dashboard de Fidelidade"
                fill
                className="rounded-2xl shadow-hero object-cover"
              />
            </div>

            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-primary rounded-2xl opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
