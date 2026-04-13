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
import Link from 'next/link';

export default function SellerDashboardClient({ activeTab, setOrderCount }: any) {

  const [shopOnline, setShopOnline] = useState(true);
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
.eq('seller_id', 'seller_1') // TEMP HARDCODE
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
        const pendingOrders = data.filter((o) => o.status === 'pending');
        setOrderCount?.(pendingOrders.length);
      }
    };

    fetchOrders();

    const channel = supabase
      .channel('seller-orders')

      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchOrders();
        }
      )

      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchOrders();
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [prevOrderIds]);

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

  const sellerOrders = orders;

  return (
    <>
      <Toaster position="top-right" richColors />

      <SellerTopbar
        shopOnline={shopOnline}
        onToggleShop={() => setShopOnline((p) => !p)}
      />

      <div className="px-4 lg:px-8 2xl:px-12 pb-8 max-w-screen-2xl mx-auto">
        
        {/* WALLET */}
        <div className="mb-6">
          <SellerWallet />
        </div>

        {/* ================= DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <>
            <SellerKPICards />

            <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
              
              <div className="xl:col-span-2">
                <SellerOrdersTable 
                  orders={sellerOrders} 
                  setOrders={setOrders}
                />
              </div>

              <div className="space-y-6">
                <SellerSalesChart />
                <SellerProductPanel />
              </div>

            </div>
          </>
        )}

        {/* ================= ORDERS ================= */}
        {activeTab === 'orders' && (
          <SellerOrdersTable 
            orders={sellerOrders} 
            setOrders={setOrders}
          />
        )}

        {/* ================= PRODUCTS ================= */}
        {activeTab === 'products' && (
          <SellerProductPanel />
        )}

        {/* ================= ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <SellerSalesChart />
        )}

        {/* ================= SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="p-6 bg-white rounded-xl shadow">
            Settings coming soon ⚙️
          </div>
        )}

      </div>
    </>
  );
}