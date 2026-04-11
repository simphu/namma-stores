'use client';

import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import SellerTopbar from './SellerTopbar';
import SellerKPICards from './SellerKPICards';
import SellerOrdersTable from './SellerOrdersTable';
import SellerProductPanel from './SellerProductPanel';
import SellerSalesChart from './SellerSalesChart';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import SellerWallet from './SellerWallet';


export default function SellerDashboardClient() {
  const [shopOnline, setShopOnline] = useState(true);

  // ✅ NEW: Orders state
  const [orders, setOrders] = useState<any[]>([]);

const [prevOrderIds, setPrevOrderIds] = useState<string[]>([]);

useEffect(() => {
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
  const currentIds = data.map((o) => o.id);

  const hasNewOrder = currentIds.some(
    (id) => !prevOrderIds.includes(id)
  );

  if (prevOrderIds.length > 0 && hasNewOrder) {
    toast.success('New order received 🔥');

    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {});
  }

  setPrevOrderIds(currentIds);
  setOrders(data);
}
  };

  fetchOrders();

const channel = supabase
  .channel('seller-orders')

  // 🆕 NEW ORDER
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'orders',
    },
    (payload) => {
      console.log('🆕 New order:', payload);
      fetchOrders();
    }
  )

  // 🔄 STATUS UPDATE (THIS WAS WRONG BEFORE)
  .on(
    'postgres_changes',
    {
      event: 'UPDATE', // ✅ FIXED
      schema: 'public',
      table: 'orders',
    },
    (payload) => {
      console.log('🔄 Order updated:', payload);
      fetchOrders();
    }
  )

  .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

useEffect(() => {
  const unlockAudio = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {});
    document.removeEventListener('click', unlockAudio);
  };

  document.addEventListener('click', unlockAudio);

  return () => {
    document.removeEventListener('click', unlockAudio);
  };
}, []);

  // ✅ Filter orders for this seller
  const sellerOrders = orders;

  return (
    <>
      <Toaster position="top-right" richColors />

      <SellerTopbar
        shopOnline={shopOnline}
        onToggleShop={() => setShopOnline((p) => !p)}
      />

      <div className="px-4 lg:px-8 2xl:px-12 pb-8 max-w-screen-2xl mx-auto">
        
         {/* 🔥 ADD WALLET HERE */}
  <div className="mb-6">
    <SellerWallet />
  </div>
  
        {/* KPI cards */}
        <SellerKPICards />

        {/* Main content grid */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
          
          {/* Orders table */}
          <div className="xl:col-span-2">
            {/* ✅ PASS REAL DATA HERE */}
            <SellerOrdersTable 
  orders={sellerOrders} 
  setOrders={setOrders}
/>
          </div>

          {/* Right panel */}
          <div className="space-y-6">
            <SellerSalesChart />
            <SellerProductPanel />
          </div>

        </div>
      </div>
    </>
  );
}