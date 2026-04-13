'use client';

import React, { useState } from 'react';
import SellerDashboardClient from './components/SellerDashboardClient';

export default function SellerDashboardPage() {

  // ✅ MAIN STATE
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">

      {/* ✅ SIDEBAR (YOU ALREADY HAVE UI — JUST ADD onClick) */}
      <div className="w-64 bg-white border-r p-4 space-y-3">

        <div onClick={() => setActiveTab('dashboard')}>
          Dashboard
        </div>

        <div onClick={() => setActiveTab('orders')}>
          Orders
        </div>

        <div onClick={() => setActiveTab('products')}>
          Products
        </div>

        <div onClick={() => setActiveTab('analytics')}>
          Analytics
        </div>

        <div onClick={() => setActiveTab('settings')}>
          Settings
        </div>

      </div>

      {/* ✅ MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <SellerDashboardClient activeTab={activeTab} />
      </main>

    </div>
  );
}