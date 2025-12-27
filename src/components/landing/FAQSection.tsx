import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'O GestorARP é seguro para dados governamentais?',
    answer: 'Sim! Utilizamos criptografia de ponta a ponta, autenticação robusta e Row-Level Security (RLS) que garante o isolamento total dos dados de cada organização. O sistema é multi-tenant, ou seja, cada prefeitura, câmara ou autarquia tem seus dados completamente separados e protegidos.',
  },
  {
    question: 'Quanto tempo leva para implementar o sistema?',
    answer: 'A implementação é rápida! Em apenas 1 dia sua organização já pode estar operando com o GestorARP. Oferecemos suporte completo para importação de dados existentes e treinamento da equipe.',
  },
  {
    question: 'Preciso instalar algo no computador?',
    answer: 'Não! O GestorARP é 100% online (SaaS). Basta acessar pelo navegador de qualquer dispositivo. Funciona em computadores, tablets e smartphones, sem necessidade de instalação.',
  },
  {
    question: 'Como funciona o suporte técnico?',
    answer: 'Oferecemos suporte técnico por chat, e-mail e telefone em horário comercial. Clientes do plano Premium têm acesso a suporte prioritário 24/7 e um gerente de sucesso dedicado.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim! Não há fidelidade mínima. Você pode cancelar sua assinatura a qualquer momento e terá acesso ao sistema até o final do período pago. Seus dados podem ser exportados antes do cancelamento.',
  },
  {
    question: 'O sistema gera relatórios para o TCE/TCM?',
    answer: 'Sim! O GestorARP gera relatórios detalhados e dashboards que facilitam a prestação de contas aos órgãos de controle como TCE e TCM. Os relatórios podem ser exportados em PDF e Excel.',
  },
  {
    question: 'Quantos usuários posso cadastrar?',
    answer: 'Depende do plano escolhido. O plano Essencial permite até 5 usuários, o Profissional até 15, e o Premium tem usuários ilimitados. Cada usuário pode ter perfil personalizado (Admin, Master ou Viewer).',
  },
  {
    question: 'Vocês oferecem período de teste?',
    answer: 'Sim! Oferecemos 14 dias de teste gratuito com acesso a todas as funcionalidades. Não é necessário cartão de crédito para começar. Ao final do período, você escolhe o plano que melhor atende sua organização.',
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding relative overflow-hidden bg-card/30">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-medium text-sm uppercase tracking-wider mb-4">
            FAQ
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Perguntas{' '}
            <span className="gradient-text">Frequentes</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Tire suas dúvidas sobre o GestorARP.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-card/50 transition-colors"
              >
                <span className="font-display font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
