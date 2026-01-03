import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Crown, 
  Loader2, 
  ExternalLink, 
  CreditCard, 
  Calendar,
  FileText,
  Users,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionData {
  id: string;
  status: string;
  plan: {
    name: string;
    slug: string;
    priceMonthly: number;
    maxAtas: number | null;
    maxRelatoriosMes: number | null;
    maxUsers: number | null;
  };
  trial_ends_at: string | null;
  current_period_end: string | null;
  relatorios_usados_mes: number;
  stripe_customer_id: string | null;
}

interface UsageData {
  atasCount: number;
  usersCount: number;
}

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openingPortal, setOpeningPortal] = useState(false);

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Carregar dados da assinatura
  useEffect(() => {
    const loadSubscriptionData = async () => {
      if (!user) return;

      try {
        // Buscar profile do usuário para pegar organization_id
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();

        if (profileError || !profile?.organization_id) {
          console.error('❌ Erro ao buscar profile:', profileError);
          setLoading(false);
          return;
        }

        const organizationId = profile.organization_id;

        // Buscar assinatura
        const { data: subData, error: subError } = await supabase
          .from('organization_subscriptions')
          .select(`
            *,
            plan:subscription_plans(*)
          `)
          .eq('organization_id', organizationId)
          .maybeSingle();

        if (subError) {
          console.error('❌ Erro ao buscar assinatura:', subError);
        } else if (subData && subData.plan) {
          const parseLimit = (value: number | null): number | null => {
            if (value === null || value >= 999999) return null;
            return value;
          };

          setSubscription({
            id: subData.id,
            status: subData.status,
            plan: {
              name: subData.plan.name,
              slug: subData.plan.slug,
              priceMonthly: parseFloat(subData.plan.price_monthly) || 0,
              maxAtas: parseLimit(subData.plan.max_atas),
              maxRelatoriosMes: parseLimit(subData.plan.max_relatorios_mes),
              maxUsers: parseLimit(subData.plan.max_users),
            },
            trial_ends_at: subData.trial_ends_at,
            current_period_end: subData.current_period_end,
            relatorios_usados_mes: subData.relatorios_usados_mes || 0,
            stripe_customer_id: subData.stripe_customer_id,
          });
        }

        // Buscar uso
        const { count: atasCount } = await supabase
          .from('atas')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', organizationId);

        const { count: usersCount } = await supabase
          .from('organization_users')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', organizationId);

        setUsage({
          atasCount: atasCount ?? 0,
          usersCount: usersCount ?? 1,
        });

      } catch (err) {
        console.error('❌ Erro inesperado:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadSubscriptionData();
    }
  }, [user]);

  const handleOpenBillingPortal = async () => {
    if (!subscription?.stripe_customer_id) {
      alert('Você não possui uma assinatura ativa para gerenciar.');
      return;
    }

    setOpeningPortal(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-billing-portal', {
        body: { 
          returnUrl: window.location.href 
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL do portal não retornada');
      }
    } catch (error) {
      console.error('Erro ao abrir portal:', error);
      alert('Erro ao abrir portal de pagamento. Tente novamente.');
      setOpeningPortal(false);
    }
  };

  const goToApp = () => {
    window.location.href = 'https://gestor-de-arp.vercel.app';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle size={14} />
            Ativo
          </span>
        );
      case 'trialing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Clock size={14} />
            Período de Teste
          </span>
        );
      case 'canceled':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
            <AlertCircle size={14} />
            Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (authLoading || loading) {
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

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Minha Conta</h1>
          <p className="text-gray-400">{user?.email}</p>
        </div>

        {/* Grid de Cards */}
        <div className="grid gap-6">
          {/* Card de Assinatura */}
          <div className="bg-gradient-to-br from-[#1a1a25]/80 to-[#12121a]/80 backdrop-blur-sm border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Crown size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {subscription?.plan.name || 'Plano Gratuito'}
                  </h2>
                  <p className="text-gray-400 text-sm">Sua assinatura atual</p>
                </div>
              </div>
              {subscription && getStatusBadge(subscription.status)}
            </div>

            {subscription && (
              <>
                {/* Preço */}
                <div className="mb-6 pb-6 border-b border-[rgba(255,255,255,0.08)]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">
                      R$ {subscription.plan.priceMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-gray-400">/mês</span>
                  </div>
                  
                  {subscription.status === 'trialing' && subscription.trial_ends_at && (
                    <p className="text-blue-400 text-sm mt-2">
                      ⏱️ Período de teste termina em {formatDate(subscription.trial_ends_at)}
                    </p>
                  )}
                  
                  {subscription.current_period_end && subscription.status === 'active' && (
                    <p className="text-gray-400 text-sm mt-2">
                      Próxima cobrança: {formatDate(subscription.current_period_end)}
                    </p>
                  )}
                </div>

                {/* Uso */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#0a0a0f]/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <FileText size={16} />
                      <span className="text-sm">ATAs</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {usage?.atasCount ?? 0}
                      <span className="text-sm text-gray-400 font-normal">
                        /{subscription.plan.maxAtas === null ? '∞' : subscription.plan.maxAtas}
                      </span>
                    </p>
                  </div>

                  <div className="bg-[#0a0a0f]/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Calendar size={16} />
                      <span className="text-sm">Relatórios</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {subscription.relatorios_usados_mes}
                      <span className="text-sm text-gray-400 font-normal">
                        /{subscription.plan.maxRelatoriosMes === null ? '∞' : subscription.plan.maxRelatoriosMes}
                      </span>
                    </p>
                  </div>

                  <div className="bg-[#0a0a0f]/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Users size={16} />
                      <span className="text-sm">Usuários</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {usage?.usersCount ?? 1}
                      <span className="text-sm text-gray-400 font-normal">
                        /{subscription.plan.maxUsers === null ? '∞' : subscription.plan.maxUsers}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex flex-wrap gap-3">
                  {subscription.stripe_customer_id && (
                    <Button
                      onClick={handleOpenBillingPortal}
                      disabled={openingPortal}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      {openingPortal ? (
                        <Loader2 size={18} className="animate-spin mr-2" />
                      ) : (
                        <CreditCard size={18} className="mr-2" />
                      )}
                      Gerenciar Assinatura
                    </Button>
                  )}
                  
                  {!subscription.stripe_customer_id && (
                    <Button
                      onClick={() => navigate('/precos')}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                    >
                      Fazer Upgrade
                    </Button>
                  )}
                </div>
              </>
            )}

            {!subscription && (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Você ainda não possui uma assinatura.</p>
                <Button
                  onClick={() => navigate('/precos')}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                >
                  Ver Planos
                </Button>
              </div>
            )}
          </div>

          {/* Card de Acesso ao App */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Pronto para usar o GestorARP?
                </h3>
                <p className="text-gray-400 text-sm">
                  Acesse o sistema e comece a gerenciar suas Atas de Registro de Preços
                </p>
              </div>
              <Button
                onClick={goToApp}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              >
                Acessar App
                <ExternalLink size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
