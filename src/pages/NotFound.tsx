import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-400 mb-8 max-w-md">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Button
            asChild
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-white/5"
          >
            <Link to="/">
              <ArrowLeft size={18} className="mr-2" />
              Voltar
            </Link>
          </Button>
          
          <Button
            asChild
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
          >
            <Link to="/">
              <Home size={18} className="mr-2" />
              Ir para Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
