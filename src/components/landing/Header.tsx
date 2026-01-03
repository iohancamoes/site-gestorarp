import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, User, LogOut, ChevronDown, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  
  const { user, isAuthenticated, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const goToApp = () => {
    // SSO: Redireciona para o app (sessão já compartilhada via Supabase)
    window.location.href = 'https://gestor-de-arp.vercel.app';
  };

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Recursos', href: '/#features' },
    { name: 'Preços', href: '/precos' },
    { name: 'FAQ', href: '/#faq' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.05)]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-purple-500 bg-clip-text text-transparent">
                GestorARP
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
              ) : isAuthenticated ? (
                <>
                  {/* Botão Acessar App */}
                  <Button
                    onClick={goToApp}
                    variant="outline"
                    className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                  >
                    Acessar App
                    <ExternalLink size={16} className="ml-2" />
                  </Button>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1a25] border border-[rgba(255,255,255,0.08)] text-white hover:border-indigo-500/30 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <User size={16} className="text-white" />
                        </div>
                        <span className="text-sm max-w-[120px] truncate">
                          {user?.email?.split('@')[0]}
                        </span>
                        <ChevronDown size={16} className="text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-[#1a1a25] border-[rgba(255,255,255,0.08)] text-white"
                    >
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium">{user?.user_metadata?.full_name || 'Usuário'}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.08)]" />
                      <DropdownMenuItem
                        onClick={() => navigate('/conta')}
                        className="cursor-pointer hover:bg-white/5"
                      >
                        <User size={16} className="mr-2" />
                        Minha Conta
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={goToApp}
                        className="cursor-pointer hover:bg-white/5"
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Ir para o App
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.08)]" />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => openAuthModal('login')}
                    className="text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    Entrar
                  </Button>
                  <Button
                    onClick={() => openAuthModal('signup')}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                  >
                    Criar conta grátis
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-[rgba(255,255,255,0.05)]">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="h-px bg-[rgba(255,255,255,0.08)] my-2" />
                
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2">
                      <p className="text-sm text-gray-400">Logado como</p>
                      <p className="text-white truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        goToApp();
                      }}
                      className="mx-4 px-4 py-3 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center gap-2"
                    >
                      <ExternalLink size={18} />
                      Acessar App
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/conta');
                      }}
                      className="mx-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-left"
                    >
                      Minha Conta
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                      className="mx-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg text-left"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        openAuthModal('login');
                      }}
                      className="mx-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-left"
                    >
                      Entrar
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        openAuthModal('signup');
                      }}
                      className="mx-4 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-center font-medium"
                    >
                      Criar conta grátis
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
};

export default Header;
