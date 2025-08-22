const Stats = () => {
  const stats = [
    {
      number: "85%",
      label: "Aumento na Retenção",
      description: "Clientes ficam mais tempo",
    },
    {
      number: "300%",
      label: "ROI Médio",
      description: "Retorno sobre investimento",
    },
    {
      number: "150%",
      label: "Mais Compras",
      description: "Frequência de compra",
    },
    {
      number: "24h",
      label: "Implementação",
      description: "Sistema funcionando",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Resultados que
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              {" "}
              Impressionam
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Veja os números reais dos nossos clientes que transformaram seus
            negócios
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gradient-subtle rounded-2xl p-8 transition-all duration-300 hover:shadow-card hover:-translate-y-2">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-muted-foreground">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
