import { AlertTriangle, Clock, FileX, Eye, Scale, Users } from 'lucide-react';

const problems = [
  {
    icon: FileX,
    title: 'Burocracia Excessiva',
    description: 'Montanhas de documentos e processos manuais que consomem tempo precioso da sua equipe.',
  },
  {
    icon: Clock,
    title: 'Perda de Prazos',
    description: 'Atas que expiram sem aviso, forçando novas licitações demoradas e custosas.',
  },
  {
    icon: AlertTriangle,
    title: 'Desperdício de Recursos',
    description: 'Saldos não utilizados que se perdem ou compras emergenciais por falta de controle.',
  },
  {
    icon: Eye,
    title: 'Falta de Transparência',
    description: 'Dificuldade em visualizar saldos, consumos e status, complicando auditorias.',
  },
  {
    icon: Scale,
    title: 'Risco de Não Conformidade',
    description: 'Preocupação constante com multas e sanções dos órgãos de controle.',
  },
  {
    icon: Users,
    title: 'Sobrecarga de Trabalho',
    description: 'Equipes sobrecarregadas com inserção manual de dados e relatórios complexos.',
  },
];

const ProblemSection = () => {
  return (
    <section id="problema" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-medium text-sm uppercase tracking-wider mb-4">
            O Problema
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Você reconhece esses desafios na gestão de ATAs?
          </h2>
          <p className="text-muted-foreground text-lg">
            Gestores públicos enfrentam obstáculos diários que comprometem a eficiência e geram desperdício de recursos.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              className="group glass rounded-2xl p-6 hover:border-destructive/30 transition-all duration-300 hover:shadow-lg hover:shadow-destructive/5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                <problem.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-16">
          <p className="text-xl text-muted-foreground italic">
            "Se você enfrenta algum desses problemas, existe uma solução..."
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
