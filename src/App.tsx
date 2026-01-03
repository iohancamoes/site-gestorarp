import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import AppRoutes from '@/routes';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        {/* Header Global */}
        <Header />
        
        {/* Conteúdo Principal */}
        <main>
          <AppRoutes />
        </main>
        
        {/* Toaster para notificações */}
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
