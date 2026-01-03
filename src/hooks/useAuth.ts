import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  // Verificar sessão inicial e escutar mudanças
  useEffect(() => {
    // Obter sessão atual
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
          setState(prev => ({ ...prev, loading: false, error: error.message }));
          return;
        }

        setState({
          user: session?.user ?? null,
          session: session ?? null,
          loading: false,
          error: null,
        });

        if (session) {
          console.log('✅ Sessão encontrada:', session.user.email);
        }
      } catch (err) {
        console.error('❌ Erro inesperado:', err);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    getSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        
        setState({
          user: session?.user ?? null,
          session: session ?? null,
          loading: false,
          error: null,
        });

        if (event === 'SIGNED_IN') {
          console.log('✅ Usuário logou:', session?.user?.email);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 Usuário deslogou');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login com email e senha
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro no login:', error);
        
        // Mensagens de erro mais amigáveis
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
        }

        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        return { success: false, error: errorMessage };
      }

      console.log('✅ Login bem-sucedido:', data.user?.email);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro inesperado ao fazer login';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Cadastro com email e senha
  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
        },
      });

      if (error) {
        console.error('❌ Erro no cadastro:', error);
        
        let errorMessage = error.message;
        if (error.message.includes('already registered')) {
          errorMessage = 'Este email já está cadastrado.';
        } else if (error.message.includes('password')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        }

        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        return { success: false, error: errorMessage };
      }

      // Verificar se precisa confirmar email
      if (data.user && !data.session) {
        console.log('📧 Email de confirmação enviado');
        setState(prev => ({ ...prev, loading: false }));
        return { 
          success: true, 
          error: 'Verifique seu email para confirmar o cadastro.' 
        };
      }

      console.log('✅ Cadastro bem-sucedido:', data.user?.email);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro inesperado ao criar conta';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout
  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Erro ao sair:', error);
      } else {
        console.log('👋 Logout realizado');
      }
      
      setState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error('❌ Erro inesperado ao sair:', err);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Recuperação de senha
  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('❌ Erro ao enviar email de recuperação:', error);
        return { success: false, error: error.message };
      }

      console.log('📧 Email de recuperação enviado');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao enviar email' };
    }
  }, []);

  return {
    ...state,
    isAuthenticated: !!state.session,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
};

export default useAuth;
