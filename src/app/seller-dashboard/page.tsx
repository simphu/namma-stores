'use client';

import React, { useState, useEffect } from 'react';
import SellerDashboardClient from './components/SellerDashboardClient';
import SellerSidebar from './components/SellerSidebar';
import { supabase } from '@/lib/supabase';

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orderCount, setOrderCount] = useState(0);

  const [isAcceptingOrders, setIsAcceptingOrders] = useState<boolean | null>(null);

  // ✅ FETCH INITIAL STATUS
  useEffect(() => {
    const fetchStatus = async () => {
      const { data } = await supabase
        .from('sellers')
        .select('is_accepting_orders')
        .eq('id', 'seller_1')
        .single();

      if (data) {
        setIsAcceptingOrders(data.is_accepting_orders);
      }
    };

    fetchStatus();
  }, []);

  // ✅ TOGGLE ACCEPTING ORDERS
  const toggleAccepting = async () => {
    if (isAcceptingOrders === null) return;

    const newStatus = !isAcceptingOrders;

    setIsAcceptingOrders(newStatus);

    await supabase
      .from('sellers')
      .update({ is_accepting_orders: newStatus })
      .eq('id', 'seller_1');
  };

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">

      {/* ✅ SIDEBAR */}
      <SellerSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        orderCount={orderCount}
        isAcceptingOrders={isAcceptingOrders ?? false}
        onToggleAccepting={toggleAccepting}
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