import Image from "next/image";

const Footer = () => {
  return (
    <footer id="contato" className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Image
              src="/branlyclubLogo.svg"
              alt="BranlyClub"
              width={200}
              height={200}
            />
            <p className="text-background/80 mb-6 max-w-md">
              A plataforma mais completa para criar programas de fidelidade que
              realmente funcionam. Transforme seus clientes em fãs da sua marca.
            </p>
            <div className="space-y-2 text-background/80">
              <div>📧 contato@branly.com.br</div>
              <div>📞 (83) 98902-8095</div>
              <div>📍 João Pessoa, PB</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Produto</h3>
            <div className="space-y-2 text-background/80">
              <div>
                <a
                  href="#recursos"
                  className="hover:text-background transition-colors"
                >
                  Recursos
                </a>
              </div>
              <div>
                <a
                  href="#precos"
                  className="hover:text-background transition-colors"
                >
                  Preços
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-background transition-colors">
                  Integrações
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-background transition-colors">
                  API
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <div className="space-y-2 text-background/80">
              <div>
                <a href="#" className="hover:text-background transition-colors">
                  Sobre
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-background transition-colors">
                  Blog
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-background transition-colors">
                  Carreiras
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-background transition-colors">
                  Contato
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center text-background/60">
          <p>&copy; 2025 BranlyClub. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
