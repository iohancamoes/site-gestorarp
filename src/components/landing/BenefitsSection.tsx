import { TrendingDown, Zap, Eye, FileCheck, Shield, LineChart } from 'lucide-react';

const benefits = [
  {
    icon: TrendingDown,
    title: 'Economia Comprovada',
    description: 'Otimize o uso dos saldos das atas, evite perdas e reduza custos com novas licitações desnecessárias.',
    stat: 'Até 40%',
    statLabel: 'de economia',
    color: 'success',
  },
  {
    icon: Zap,
    title: 'Eficiência Operacional',
    description: 'Automatize o controle, reduza a burocracia e libere sua equipe para tarefas mais estratégicas.',
    stat: '70%',
    statLabel: 'menos tempo',
    color: 'primary',
  },
  {
    icon: Eye,
    title: 'Controle em Tempo Real',
    description: 'Tenha uma visão clara e atualizada de todas as suas atas, itens, saldos e consumos.',
    stat: '100%',
    statLabel: 'visibilidade',
    color: 'accent',
  },
  {
    icon: FileCheck,
    title: 'Auditoria Simplificada',
    description: 'Gere relatórios detalhados e dashboards intuitivos para prestação de contas sem complicações.',
    stat: '5min',
    statLabel: 'para relatórios',
    color: 'warning',
  },
  {
    icon: Shield,
    title: 'Conformidade Garantida',
    description: 'Mantenha-se em dia com a legislação, evite multas e garanta a segurança jurídica.',
    stat: 'Zero',
    statLabel: 'não conformidades',
    color: 'success',
  },
  {
    icon: LineChart,
    title: 'Decisões Estratégicas',
    description: 'Acesse informações precisas para planejar, otimizar e maximizar o uso dos recursos.',
    stat: 'Data',
    statLabel: 'driven decisions',
    color: 'primary',
  },
];

const colorClasses = {
  success: {
    bg: 'bg-success/10',
    text: 'text-success',
    glow: 'shadow-success/20',
  },
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    glow: 'shadow-primary/20',
  },
  accent: {
    bg: 'bg-accent/10',
    text: 'text-accent',
    glow: 'shadow-accent/20',
  },
  warning: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    glow: 'shadow-warning/20',
  },
};

const BenefitsSection = () => {
  return (
    <section id="beneficios" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-card/30" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-medium text-sm uppercase tracking-wider mb-4">
            Benefícios
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Resultados que{' '}
            <span className="gradient-text">transformam</span>{' '}
            a gestão pública
          </h2>
          <p className="text-muted-foreground text-lg">
            Organizações que utilizam o GestorARP experimentam melhorias significativas em todos os indicadores.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const colors = colorClasses[benefit.color as keyof typeof colorClasses];
            return (
              <div
                key={benefit.title}
                className="group glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center group-hover:shadow-lg ${colors.glow} transition-shadow`}
                  >
                    <benefit.icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div className="text-right">
                    <div className={`font-display font-bold text-2xl ${colors.text}`}>
                      {benefit.stat}
                    </div>
                    <div className="text-xs text-muted-foreground">{benefit.statLabel}</div>
                  </div>
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
