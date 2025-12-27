import { useState } from 'react';
import { FileText, BarChart3, Bell, Shield, Users, Zap } from 'lucide-react';
import atasPreview from '@/assets/atas-preview.png';
import chartPreview from '@/assets/chart-preview.png';
import detailsPreview from '@/assets/details-preview.png';

const features = [
  {
    id: 'gestao',
    icon: FileText,
    title: 'Gestão Centralizada de ATAs',
    description: 'Nunca mais perca uma ata! Controle prazos, status e fornecedores em um único lugar. Visualize todas as suas atas ativas, suspensas e encerradas.',
    image: atasPreview,
  },
  {
    id: 'controle',
    icon: BarChart3,
    title: 'Controle Detalhado de Saldos',
    description: 'Saiba exatamente o que foi contratado e o que resta, anual e mensalmente, para cada item. Acompanhe o consumo por secretaria em tempo real.',
    image: chartPreview,
  },
  {
    id: 'consumo',
    icon: Zap,
    title: 'Registro de Consumo Simplificado',
    description: 'Lance consumos por secretaria de forma rápida e intuitiva, com atualização automática de saldos e histórico completo de movimentações.',
    image: detailsPreview,
  },
  {
    id: 'alertas',
    icon: Bell,
    title: 'Alertas Proativos',
    description: 'Receba avisos sobre saldos baixos e atas próximas do vencimento, evitando surpresas e perdas. Configure alertas personalizados.',
    image: chartPreview,
  },
  {
    id: 'relatorios',
    icon: Shield,
    title: 'Relatórios Inteligentes',
    description: 'Tenha uma visão 360º com gráficos claros e relatórios exportáveis para auditoria e planejamento estratégico.',
    image: atasPreview,
  },
  {
    id: 'usuarios',
    icon: Users,
    title: 'Gestão de Usuários',
    description: 'Garanta que cada usuário acesse apenas o que precisa, com perfis de permissão personalizáveis (Admin, Master, Viewer).',
    image: detailsPreview,
  },
];

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <section id="recursos" className="section-padding relative overflow-hidden bg-card/30">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-medium text-sm uppercase tracking-wider mb-4">
            Recursos
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Tudo o que você precisa para
            <span className="gradient-text"> gerenciar suas ATAs</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Funcionalidades poderosas projetadas para simplificar a gestão pública.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Feature Tabs */}
          <div className="space-y-4">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature)}
                className={`w-full text-left p-5 rounded-xl transition-all duration-300 ${
                  activeFeature.id === feature.id
                    ? 'glass-strong border-primary/50 shadow-lg shadow-primary/10'
                    : 'hover:bg-card/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      activeFeature.id === feature.id
                        ? 'bg-gradient-to-br from-primary to-accent'
                        : 'bg-card'
                    }`}
                  >
                    <feature.icon
                      className={`w-6 h-6 ${
                        activeFeature.id === feature.id ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed transition-all duration-300 ${
                        activeFeature.id === feature.id
                          ? 'text-muted-foreground max-h-24 opacity-100'
                          : 'text-muted-foreground/60 max-h-0 opacity-0 overflow-hidden'
                      }`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Feature Preview */}
          <div className="lg:sticky lg:top-32">
            <div className="glass rounded-2xl p-2 shadow-2xl shadow-primary/10">
              <img
                src={activeFeature.image}
                alt={activeFeature.title}
                className="rounded-xl w-full transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
