# 🚀 Instruções de Implementação - Autenticação Site GestorARP

## 📦 Pacotes Necessários

Execute no terminal do projeto:

```bash
npm install react-hook-form @hookform/resolvers zod
```

Ou se estiver usando pnpm:

```bash
pnpm add react-hook-form @hookform/resolvers zod
```

## 📁 Estrutura de Arquivos

Copie os arquivos na seguinte estrutura:

```
src/
├── App.tsx                          # Atualizado
├── routes.tsx                       # NOVO
├── hooks/
│   └── useAuth.ts                   # NOVO
├── components/
│   ├── Header.tsx                   # Atualizado ou NOVO
│   └── auth/
│       └── AuthModal.tsx            # NOVO
└── pages/
    ├── Index.tsx                    # Existente (landing page)
    ├── PricingPage.tsx              # NOVO
    ├── AccountPage.tsx              # NOVO
    └── NotFound.tsx                 # NOVO
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente (já configuradas no Dyad)

Certifique-se que as variáveis estão no Dyad:
- `VITE_SUPABASE_URL=https://abspgzjessdcewkgxfzw.supabase.co`
- `VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. Cliente Supabase

Já deve existir em `src/integrations/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'sb-auth-token',
    flowType: 'pkce'
  }
});
```

### 3. Componentes shadcn-ui Necessários

Certifique-se que tem estes componentes:
- Dialog
- Button
- Input
- Label
- DropdownMenu

Se não tiver, instale via CLI:

```bash
npx shadcn-ui@latest add dialog button input label dropdown-menu
```

## 🔗 Rotas Disponíveis

Após implementação:

- `/` - Landing page (existente)
- `/precos` - Página de planos e preços
- `/conta` - Área do cliente (requer login)

## 🔐 Fluxo de Autenticação

1. **Usuário não logado:**
   - Header mostra "Entrar" e "Criar conta grátis"
   - Clica em qualquer botão → Abre modal de autenticação
   - Pode alternar entre Login/Cadastro/Esqueci senha

2. **Usuário logado:**
   - Header mostra avatar + dropdown
   - Opções: Minha Conta, Ir para App, Sair
   - Botão "Acessar App" redireciona para o GestorARP

3. **Fluxo de compra:**
   - Usuário clica em plano na página de preços
   - Se não logado → Abre modal de cadastro
   - Após cadastro → Redireciona automaticamente para checkout Stripe

## 🎨 Design

Todos os componentes seguem o design system dark do GestorARP:
- Cores principais: Indigo (#6366f1), Purple (#a855f7), Pink (#ec4899)
- Background: #0a0a0f, #12121a, #1a1a25
- Bordas: rgba(255,255,255,0.08)
- Gradientes e glassmorphism

## ✅ Checklist de Implementação

- [ ] Instalar pacotes (react-hook-form, zod, @hookform/resolvers)
- [ ] Copiar `src/hooks/useAuth.ts`
- [ ] Copiar `src/components/auth/AuthModal.tsx`
- [ ] Copiar ou atualizar `src/components/Header.tsx`
- [ ] Copiar `src/pages/PricingPage.tsx`
- [ ] Copiar `src/pages/AccountPage.tsx`
- [ ] Copiar `src/pages/NotFound.tsx`
- [ ] Copiar `src/routes.tsx`
- [ ] Atualizar `src/App.tsx`
- [ ] Testar login/cadastro
- [ ] Testar fluxo de checkout
- [ ] Testar SSO (site → app)

## 🐛 Possíveis Problemas

### "Missing Supabase environment variables"
- Verifique se as variáveis estão configuradas no Dyad

### "Email not confirmed"
- No Supabase, verifique se a confirmação de email está desabilitada para testes
- Ou confirme o email manualmente no painel do Supabase

### Modal não abre
- Verifique se o Dialog do shadcn-ui está instalado corretamente

### Checkout não funciona
- Verifique se a Edge Function `create-checkout` está deployada
- Verifique se os Price IDs do Stripe estão corretos

---

**Próximos passos após implementação:**
1. FASE 4: Testar SSO entre site e app
2. FASE 5: Implementar Stripe Customer Portal (já está no AccountPage)
3. FASE 6: Deploy em produção com domínios customizados
