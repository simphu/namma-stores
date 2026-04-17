'use client';

import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { supabase } from '@/lib/supabase';

import SellerSidebar from './SellerSidebar'; // ✅ FIXED
import SellerTopbar from './SellerTopbar';
import SellerKPICards from './SellerKPICards';
import SellerOrdersTable from './SellerOrdersTable';
import SellerProductPanel from './SellerProductPanel';
import SellerSalesChart from './SellerSalesChart';
import SellerWallet from './SellerWallet';

export default function SellerDashboardClient({
  activeTab,
  setActiveTab,
  setOrderCount,
  orderCount,
}: any) {

  const [sellerId, setSellerId] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [profileName, setProfileName] = useState<string>('Loading...');
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [isAcceptingOrders, setIsAcceptingOrders] = useState<boolean | null>(null);
  const [shopName, setShopName] = useState('');

  const [orders, setOrders] = useState<any[]>([]);
  const [prevOrderIds, setPrevOrderIds] = useState<string[]>([]);

// 🔥 INIT (Auth + Profile + Seller)
useEffect(() => {
  const init = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = '/login';
      return;
    }

    const userId = userData.user.id;

    // ✅ Fetch profile + seller in parallel (better performance)
    const [profileRes, sellerRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('name')
        .eq('id', userId)
        .maybeSingle(),

      supabase
        .from('sellers')
        .select('id, is_open, is_accepting_orders, is_onboarded, shop_name')
        .eq('id', userId)
        .maybeSingle(),
    ]);

    const profile = profileRes.data;
    const seller = sellerRes.data;

    if (profile?.name) setProfileName(profile.name);

    if (!seller) {
      alert('Seller row missing');
      return;
    }

    if (!seller.is_onboarded) {
      window.location.href = '/onboarding/seller';
      return;
    }

    setSellerId(seller.id);
    setIsOpen(seller.is_open);
    setIsAcceptingOrders(seller.is_accepting_orders);
    setShopName(seller.shop_name || '');
  };

  init();
}, []);


// 🔥 REALTIME (Seller status sync)
useEffect(() => {
  if (!sellerId) return;

  const channel = supabase
    .channel('seller-self')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'sellers',
        filter: `id=eq.${sellerId}`,
      },
      (payload) => {
        setIsOpen(payload.new.is_open);
        setIsAcceptingOrders(payload.new.is_accepting_orders);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [sellerId]);


// 🔥 ORDERS (Fetch + Realtime)
useEffect(() => {
  if (!sellerId) return;

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select(`*, order_items (*)`)
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (data) {
      const ids = data.map((o) => o.id);

      if (
        prevOrderIds.length > 0 &&
        ids.some((id) => !prevOrderIds.includes(id))
      ) {
        toast.success('New order 🔥');
      }

      setPrevOrderIds(ids);
      setOrders(data);

      const pending = data.filter((o) => o.status === 'pending');
      setOrderCount?.(pending.length);
    }
  };

  // initial fetch
  fetchOrders();

  // ✅ UNIQUE CHANNEL NAME (important)
  const channel = supabase.channel(`orders-${sellerId}`);

  // ✅ attach BEFORE subscribe
  channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'orders',
      filter: `seller_id=eq.${sellerId}`,
    },
    () => {
      fetchOrders();
    }
  );

  channel.subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [sellerId]);


// 🔥 ACTIONS (Optimistic UI + DB sync)

// Toggle store open/close
const toggleOpen = async () => {
  if (!sellerId || isOpen === null) return;

  setToggleLoading(true); // 🔥 start loading

  const newOpen = !isOpen;

  setIsOpen(newOpen);
  setIsAcceptingOrders(newOpen);

  await supabase
    .from('sellers')
    .update({
      is_open: newOpen,
      is_accepting_orders: newOpen,
    })
    .eq('id', sellerId);

  setToggleLoading(false); // 🔥 stop loading
};


// Toggle accepting orders
const toggleAccepting = async () => {
  if (!sellerId || isAcceptingOrders === null || !isOpen) return;

  setToggleLoading(true);

  const newStatus = !isAcceptingOrders;

  setIsAcceptingOrders(newStatus);

  await supabase
    .from('sellers')
    .update({ is_accepting_orders: newStatus })
    .eq('id', sellerId);

  setToggleLoading(false);
};

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <SellerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        orderCount={orderCount}
        isAcceptingOrders={isAcceptingOrders ?? false}
        onToggleAccepting={toggleAccepting}
        profileName={profileName}
      />

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto">

        <Toaster position="top-right" richColors />

        <SellerTopbar
          isOpen={isOpen ?? false}
          isAcceptingOrders={isAcceptingOrders ?? false}
          onToggleOpen={toggleOpen}
          onToggleAccepting={toggleAccepting}
          profileName={profileName}
          shopName={shopName}
          isLoading={toggleLoading} 
        />

        <div className="px-4 lg:px-8 pb-8 max-w-screen-2xl mx-auto">

          <div className="mb-6">
            <SellerWallet />
          </div>

          {activeTab === 'dashboard' && (
            <>
              <SellerKPICards />

              <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <SellerOrdersTable orders={orders} setOrders={setOrders} />
                </div>

                <div className="space-y-6">
                  <SellerSalesChart />
                  <SellerProductPanel />
                </div>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <SellerOrdersTable orders={orders} setOrders={setOrders} />
          )}

          {activeTab === 'products' && <SellerProductPanel />}
          {activeTab === 'analytics' && <SellerSalesChart />}

        </div>
      </div>
    </div>
  );
}