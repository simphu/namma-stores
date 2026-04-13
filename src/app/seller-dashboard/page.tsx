'use client';

import React, { useState } from 'react';
import SellerDashboardClient from './components/SellerDashboardClient';
import SellerSidebar from './components/SellerSidebar';

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orderCount, setOrderCount] = useState(0);

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">

      {/* ✅ SIDEBAR */}
      <SellerSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        orderCount={orderCount}
      />

      {/* ✅ MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <SellerDashboardClient 
          activeTab={activeTab} 
          setOrderCount={setOrderCount}
        />
      </main>

    </div>
  );
}