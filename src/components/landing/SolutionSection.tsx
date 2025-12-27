import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import dashboardPreview from '@/assets/dashboard-preview.png';

const benefits = [
  'Controle total de todas as suas ATAs em um só lugar',
  'Alertas automáticos de vencimentos e saldos baixos',
  'Relatórios prontos para auditoria e prestação de contas',
  'Acesso seguro por perfil de usuário (RBAC)',
  'Dados isolados por organização (multi-tenant)',
];

const SolutionSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <span className="inline-block text-primary font-medium text-sm uppercase tracking-wider mb-4">
              A Solução
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Apresentamos o{' '}
              <span className="gradient-text">GestorARP</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              O sistema inteligente que transforma a gestão de Atas de Registro de Preços. 
              Desenvolvido especialmente para organizações públicas que buscam eficiência, 
              transparência e economia.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg" className="group">
              Conhecer a Solução
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="relative z-10 glass rounded-2xl p-2 shadow-2xl shadow-primary/10">
              <img
                src={dashboardPreview}
                alt="Dashboard do GestorARP mostrando controle de ATAs"
                className="rounded-xl w-full"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-2xl blur-sm opacity-60" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-accent to-primary rounded-2xl blur-sm opacity-40" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
