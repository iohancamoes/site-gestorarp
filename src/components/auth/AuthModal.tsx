import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, User, Loader2, ArrowRight, Sparkles, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Schemas de validação
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const signUpSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

type AuthMode = 'login' | 'signup' | 'forgot-password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  onSuccess 
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { signIn, signUp, resetPassword, loading } = useAuth();

  // Forms
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const forgotForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  // Handlers
  const handleLogin = async (data: LoginFormData) => {
    setMessage(null);
    const result = await signIn(data.email, data.password);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Login realizado com sucesso!' });
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Erro ao fazer login' });
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    setMessage(null);
    const result = await signUp(data.email, data.password, data.fullName);
    
    if (result.success) {
      if (result.error) {
        // Precisa confirmar email
        setMessage({ type: 'success', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Conta criada com sucesso!' });
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 1000);
      }
    } else {
      setMessage({ type: 'error', text: result.error || 'Erro ao criar conta' });
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setMessage(null);
    const result = await resetPassword(data.email);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Email de recuperação enviado! Verifique sua caixa de entrada.' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Erro ao enviar email' });
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setMessage(null);
    loginForm.reset();
    signUpForm.reset();
    forgotForm.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#12121a]/95 backdrop-blur-2xl border-[rgba(255,255,255,0.08)] text-white p-0 overflow-hidden">
        {/* Header com gradiente */}
        <div className="relative bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-6 pb-8">
          <DialogHeader>
            {/* Logo */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/30">
                <Sparkles size={24} className="text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-white text-center">
                {mode === 'login' && 'Bem-vindo de volta'}
                {mode === 'signup' && 'Criar sua conta'}
                {mode === 'forgot-password' && 'Recuperar senha'}
              </DialogTitle>
              <p className="text-sm text-gray-400 mt-1 text-center">
                {mode === 'login' && 'Entre com suas credenciais'}
                {mode === 'signup' && 'Preencha os dados para começar'}
                {mode === 'forgot-password' && 'Enviaremos um link para seu email'}
              </p>
            </div>
          </DialogHeader>
        </div>

        {/* Form Content */}
        <div className="p-6 pt-4">
          {/* Messages */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400">Email</Label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input
                    {...loginForm.register('email')}
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 bg-[#1a1a25] border-[rgba(255,255,255,0.08)] text-white placeholder-gray-500 focus:border-indigo-500/50"
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-red-400">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400">Senha</Label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input
                    {...loginForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-[#1a1a25] border-[rgba(255,255,255,0.08)] text-white placeholder-gray-500 focus:border-indigo-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-red-400">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchMode('forgot-password')}
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 font-semibold"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* SignUp Form */}
          {mode === 'signup' && (
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400">Nome completo</Label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input
                    {...signUpForm.register('fullName')}
                    type="text"
                    placeholder="Seu nome"
                    className="pl-10 bg-[#1a1a25] border-[rgba(255,255,255,0.08)] text-white placeholder-gray-500 focus:border-indigo-500/50"
                  />
                </div>
                {signUpForm.formState.errors.fullName && (
                  <p className="text-xs text-red-400">{signUpForm.formState.errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400">Email</Label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input
                    {...signUpForm.register('email')}
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 bg-[#1a1a25] border-[rgba(255,255,255,0.08)] text-white placeholder-gray-500 focus:border-indigo-500/50"
                  />
                </div>
                {signUpForm.formState.errors.email && (
                  <p className="text-xs text-red-400">{signUpForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400">Senha</Label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input
                    {...signUpForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    className="pl-10 pr-10 bg-[#1a1a25] border-[rgba(255,255,255,0.08)] text-white placeholder-gray-500 focus:border-indigo-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {signUpForm.formState.errors.password && (
                  <p className="text-xs text-red-400">{signUpForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400">Confirmar senha</Label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input
                    {...signUpForm.register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repita a senha"
                    className="pl-10 pr-10 bg-[#1a1a25] border-[rgba(255,255,255,0.08)] text-white placeholder-gray-500 focus:border-indigo-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {signUpForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-400">{signUpForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 font-semibold"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Criar conta
                    <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Forgot Password Form */}
          {mode === 'forgot-password' && (
            <form onSubmit={forgotForm.handleSubmit(handleForgotPassword)} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-400">Email</Label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input
                    {...forgotForm.register('email')}
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 bg-[#1a1a25] border-[rgba(255,255,255,0.08)] text-white placeholder-gray-500 focus:border-indigo-500/50"
                  />
                </div>
                {forgotForm.formState.errors.email && (
                  <p className="text-xs text-red-400">{forgotForm.formState.errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 font-semibold"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  'Enviar email de recuperação'
                )}
              </Button>

              <button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full text-center text-sm text-gray-400 hover:text-white"
              >
                ← Voltar para login
              </button>
            </form>
          )}

          {/* Footer - Toggle mode */}
          {mode !== 'forgot-password' && (
            <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)] text-center">
              <p className="text-gray-400 text-sm">
                {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                  className="ml-2 text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  {mode === 'login' ? 'Criar conta' : 'Entrar'}
                </button>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
