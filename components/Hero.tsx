import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Store,
  Shield,
  Zap,
  Target,
  Award,
  StarHalf,
  StarIcon,
} from "lucide-react";
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
                Sua Loja,
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  {" "}
                  Seu Sistema{" "}
                </span>
                de Pontos
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                <span className="font-bold text-white">100% de autonomia</span>{" "}
                para sua loja. Configure regras personalizadas, colete pontos
                por nota fiscal e gerencie tudo de forma simples e intuitiva.
              </p>
            </div>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Controle total da loja</span>
              </li>
              <li className="flex items-center space-x-3">
                <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span>Setup em 5 minutos</span>
              </li>
              <li className="flex items-center space-x-3">
                <Target className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Pontos por nota fiscal</span>
              </li>
              <li className="flex items-center space-x-3">
                <Award className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span>Sem mensalidades ocultas</span>
              </li>
            </ul>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/cadastro?type=merchant">
                  <Button size="lg" className="group w-full sm:w-auto">
                    <Store className="w-4 h-4 mr-2" />
                    Começar Agora
                  </Button>
                </Link>

                <Link href="/cadastro?type=customer">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <StarIcon className="w-4 h-4 mr-2" />
                    Ver planos
                  </Button>
                </Link>
              </div>
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
