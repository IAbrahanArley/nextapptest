import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              <Image
                src="/branlyclubLogo.svg"
                alt="BranlyClub"
                width={150}
                height={150}
              />
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#recursos"
                className="text-foreground hover:text-primary transition-colors"
              >
                Recursos
              </a>
              <a
                href="#resultados"
                className="text-foreground hover:text-primary transition-colors"
              >
                Resultados
              </a>
              <a
                href="#precos"
                className="text-foreground hover:text-primary transition-colors"
              >
                Preços
              </a>
              <a
                href="#contato"
                className="text-foreground hover:text-primary transition-colors"
              >
                Contato
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login?type=merchant">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/cadastro?type=merchant">
              <Button variant="hero" size="sm">
                Teste Grátis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
