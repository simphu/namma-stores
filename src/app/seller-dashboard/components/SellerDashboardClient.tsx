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
import SellerSidebar from './SellerSidebar';

export default function SellerDashboardClient({ activeTab, setActiveTab, setOrderCount }: any) {

  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [isAcceptingOrders, setIsAcceptingOrders] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [prevOrderIds, setPrevOrderIds] = useState<string[]>([]);

  useEffect(() => {
  const fetchShopStatus = async () => {
    const { data } = await supabase
      .from('sellers')
      .select('is_open, is_accepting_orders')
      .eq('id', 'seller_1')
      .single();

    if (data) {
      setIsOpen(data.is_open);
      setIsAcceptingOrders(data.is_accepting_orders);
    }
  };

  fetchShopStatus();
}, []);

useEffect(() => {
  const channel = supabase
    .channel('seller-self')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'sellers',
        filter: 'id=eq.seller_1',
      },
      (payload) => {
        console.log('SELF UPDATE:', payload);

        // 🔥 instant sync with DB
        setIsOpen(payload.new.is_open);
        setIsAcceptingOrders(payload.new.is_accepting_orders);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

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
  const toggleOpen = async () => {
  if (isOpen === null) return;

  const newOpen = !isOpen;
  const newAccepting = newOpen ? true : false; // 🔥 always sync

  setIsOpen(newOpen);
  setIsAcceptingOrders(newAccepting);

  const { data, error } = await supabase
    .from('sellers')
    .update({
      is_open: newOpen,
      is_accepting_orders: newAccepting,
    })
    .eq('id', 'seller_1')
    .select();

  console.log("UPDATE RESULT:", data, error);
};

const toggleAccepting = async () => {
  if (isAcceptingOrders === null || !isOpen) return;

  const newStatus = !isAcceptingOrders;

  setIsAcceptingOrders(newStatus);

  const { data, error } = await supabase
    .from('sellers')
    .update({ is_accepting_orders: newStatus })
    .eq('id', 'seller_1')
    .select();

  console.log("ACCEPTING UPDATE:", data, error);
};

  return (
  <div className="flex h-screen">

    {/* ✅ MAIN CONTENT */}
    <div className="flex-1 overflow-y-auto">

      <Toaster position="top-right" richColors />

      <SellerTopbar
        isOpen={isOpen ?? false}
        isAcceptingOrders={isAcceptingOrders ?? false}
        onToggleOpen={toggleOpen}
        onToggleAccepting={toggleAccepting}
      />

      <div className="px-4 lg:px-8 2xl:px-12 pb-8 max-w-screen-2xl mx-auto">
        
        {/* WALLET */}
        <div className="mb-6">
          <SellerWallet />
        </div>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            <SellerKPICards />

            <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              <div className="xl:col-span-2">
                <SellerOrdersTable 
                  orders={orders} 
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

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <SellerOrdersTable 
            orders={orders} 
            setOrders={setOrders}
          />
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && <SellerProductPanel />}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && <SellerSalesChart />}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-6 bg-white rounded-xl shadow">
            Settings coming soon ⚙️
          </div>
        )}

      </div>
    </div>

  </div>
);
}