import React from 'react';
import SellerSidebar from '@/components/SellerSidebar';
import SellerDashboardClient from './components/SellerDashboardClient';

export default function SellerDashboardPage() {
  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <SellerSidebar />
      <main className="flex-1 overflow-y-auto">
        <SellerDashboardClient />
      </main>
    </div>
  );
}