import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import { Crown, Zap, Sparkles, CheckCircle, Loader2, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  priceMonthly: number;
  maxAtas: number | null;
  maxRelatoriosMes: number | null;
  maxUsers: number | null;
  features: string[];
  stripePriceId: string | null;
}

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgradingToPlan, setUpgradingToPlan] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingPlanSlug, setPendingPlanSlug] = useState<string | null>(null);

  // Função para converter valores "ilimitados" (999999) em null
  const parseLimit = (value: number | null): number | null => {
    if (value === null || value >= 999999) return null;
    return value;
  };

  // Carregar planos do Supabase
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*');

        if (error) {
          console.error('❌ Erro ao carregar planos:', error);
          return;
        }

        if (data) {
          const mappedPlans = data
            .map(p => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              priceMonthly: parseFloat(p.price_monthly) || 0,
              maxAtas: parseLimit(p.max_atas),
              maxRelatoriosMes: parseLimit(p.max_relatorios_mes),
              maxUsers: parseLimit(p.max_users),
              features: Array.isArray(p.features) ? p.features : JSON.parse(p.features || '[]'),
              stripePriceId: p.stripe_price_id
            }))
            // Filtrar planos que devem aparecer na página de preços
            .filter(p => !['free', 'gratuito', 'promotor'].includes(p.slug))
            // Ordenar por preço
            .sort((a, b) => a.priceMonthly - b.priceMonthly);

          setPlans(mappedPlans);
          console.log('✅ Planos carregados:', mappedPlans.map(p => p.slug));
        }
      } catch (err) {
        console.error('❌ Erro inesperado:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const getPlanIcon = (slug: string) => {
    switch (slug) {
      case 'essential':
        return <Zap className="w-8 h-8 text-blue-400" />;
      case 'professional':
        return <Crown className="w-8 h-8 text-purple-400" />;
      case 'premium':
        return <Sparkles className="w-8 h-8 text-amber-400" />;
      default:
        return <Star className="w-8 h-8 text-gray-400" />;
    }
  };

  const getPlanColor = (slug: string) => {
    switch (slug) {
      case 'essential':
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30 hover:border-blue-400/50';
      case 'professional':
        return 'from-purple-500/20 to-purple-600/20 border-purple-500/30 hover:border-purple-400/50';
      case 'premium':
        return 'from-amber-500/20 to-amber-600/20 border-amber-500/30 hover:border-amber-400/50';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const getButtonColor = (slug: string) => {
    switch (slug) {
      case 'essential':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'professional':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white';
      case 'premium':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const handleSelectPlan = async (planSlug: string) => {
    // Se não está logado, abrir modal de autenticação
    if (!isAuthenticated) {
      setPendingPlanSlug(planSlug);
      setIsAuthModalOpen(true);
      return;
    }

    // Se está logado, redirecionar para checkout
    await proceedToCheckout(planSlug);
  };

  const proceedToCheckout = async (planSlug: string) => {
    setUpgradingToPlan(planSlug);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planSlug }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout não retornada');
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
      setUpgradingToPlan(null);
    }
  };

  const handleAuthSuccess = () => {
    // Após login/cadastro bem-sucedido, continuar para checkout se tinha plano pendente
    if (pendingPlanSlug) {
      setTimeout(() => {
        proceedToCheckout(pendingPlanSlug);
        setPendingPlanSlug(null);
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Escolha o Plano Perfeito para Você
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comece com <span className="text-indigo-400 font-semibold">14 dias grátis</span>. 
            Cancele quando quiser, sem compromisso.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const isRecommended = plan.slug === 'professional';
            
            return (
              <div
                key={plan.id}
                className={`relative bg-gradient-to-br ${getPlanColor(plan.slug)} backdrop-blur-sm border-2 rounded-2xl p-8 transition-all duration-300 ${
                  isRecommended 
                    ? 'ring-4 ring-purple-500/50 scale-105 shadow-2xl shadow-purple-500/30' 
                    : 'hover:scale-105 hover:shadow-2xl'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Recommended Badge */}
                {isRecommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    ⭐ MAIS POPULAR
                  </div>
                )}

                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white/5 mb-6 mx-auto">
                  {getPlanIcon(plan.slug)}
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white text-center mb-4">{plan.name}</h3>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-sm text-gray-400">R$</span>
                    <span className="text-5xl font-bold text-white">
                      {plan.priceMonthly.toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </span>
                    <span className="text-gray-400">/mês</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">14 dias grátis • Sem cartão de crédito</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">
                      {plan.maxAtas === null ? '🚀 ATAs ilimitadas' : `📄 ${plan.maxAtas} ATAs ativas`}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">
                      {plan.maxRelatoriosMes === null
                        ? '📊 Relatórios ilimitados'
                        : `📈 ${plan.maxRelatoriosMes} relatórios/mês`}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">
                      {plan.maxUsers === null ? '👥 Usuários ilimitados' : `👤 ${plan.maxUsers} usuários`}
                    </span>
                  </li>
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(plan.slug)}
                  disabled={upgradingToPlan !== null}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${getButtonColor(plan.slug)} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl`}
                >
                  {upgradingToPlan === plan.slug ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span>Começar Agora</span>
                      <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* FAQ / Questions */}
        <div className="mt-16 text-center">
          <p className="text-gray-400">
            Dúvidas? Entre em contato com nosso{' '}
            <a 
              href="mailto:suporte@gestorarp.com" 
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              suporte
            </a>
          </p>
        </div>

        {/* Garantia */}
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              ✅ Garantia de 14 dias
            </h3>
            <p className="text-gray-400 text-sm">
              Teste todas as funcionalidades sem compromisso. 
              Se não gostar, cancele a qualquer momento durante o período de trial.
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingPlanSlug(null);
        }}
        initialMode="signup"
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default PricingPage;
