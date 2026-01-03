import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Index from '@/pages/Index';
import PricingPage from '@/pages/PricingPage';
import AccountPage from '@/pages/AccountPage';
import NotFound from '@/pages/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/precos" element={<PricingPage />} />
      <Route path="/conta" element={<AccountPage />} />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
