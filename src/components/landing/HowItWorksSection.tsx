import { UserPlus, FileUp, BarChart2, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Crie sua Conta',
    description: 'Cadastre sua organização em poucos minutos. Configure usuários e permissões de acesso.',
  },
  {
    number: '02',
    icon: FileUp,
    title: 'Importe suas ATAs',
    description: 'Cadastre suas Atas de Registro de Preços com todos os itens, valores e prazos de vigência.',
  },
  {
    number: '03',
    icon: BarChart2,
    title: 'Acompanhe o Consumo',
    description: 'Registre os consumos por secretaria e acompanhe os saldos em tempo real nos dashboards.',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Tome Decisões',
    description: 'Utilize os relatórios e alertas para otimizar recursos e garantir a conformidade.',
  },
];

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="section-padding relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-medium text-sm uppercase tracking-wider mb-4">
            Como Funciona
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Simples de usar,{' '}
            <span className="gradient-text">poderoso nos resultados</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Em apenas 4 passos, sua organização estará com a gestão de ATAs otimizada.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="glass rounded-2xl p-6 text-center group hover:border-primary/30 transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-primary to-accent text-primary-foreground font-display font-bold text-sm px-3 py-1 rounded-full shadow-lg shadow-primary/30">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mt-4 rounded-2xl bg-card flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display font-semibold text-lg text-foreground mt-6 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (hidden on last item and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 text-primary/50">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
