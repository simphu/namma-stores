'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import ShopHeader from '@/app/shop-product-page/components/ShopHeader';
import DealsSection from '@/app/shop-product-page/components/DealsSection';
import SearchBar from '@/app/shop-product-page/components/SearchBar';
import FilterBar from '@/app/shop-product-page/components/FilterBar';
import MenuCategories from '@/app/shop-product-page/components/MenuCategories';
import StickyCartBar from '@/app/shop-product-page/components/StickyCartBar';

export default function ShopPage() {
  const params = useParams();
  const sellerId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [products, setProducts] = useState<any[]>([]);
  const [shop, setShop] = useState<any>(null);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      // 🔹 FETCH SHOP
      const { data: shopData } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', sellerId)
        .single();

      setShop(shopData);

      // 🔹 FETCH PRODUCTS
      let query = supabase
        .from('product')
        .select('*')
        .eq('seller_id', sellerId);

      if (search) query = query.ilike('name', `%${search}%`);
      if (filter === 'veg') query = query.eq('type', 'veg');
      if (filter === 'non-veg') query = query.eq('type', 'non-veg');
      if (filter === 'best') query = query.eq('is_best_seller', true);

      const { data } = await query;
      setProducts(data || []);
    };

    if (sellerId) fetchData();

    // 🔥 REALTIME FIX (NO POLLING)
    const channel = supabase
      .channel(`shop-${sellerId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sellers',
          filter: `id=eq.${sellerId}`,
        },
        (payload) => {
          console.log('REALTIME UPDATE:', payload);

          // ✅ instantly update shop state
          setShop(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [sellerId, search, filter]);

  if (!shop) return <div className="p-4">Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-2xl mx-auto bg-white min-h-screen rounded-xl overflow-hidden shadow-sm">

        <ShopHeader shop={shop} />

        {/* 🔥 STORE STATUS */}
        {!shop.is_open && (
          <div className="bg-red-500 text-white text-center py-2 font-semibold">
            Store Closed
          </div>
        )}

        {shop.is_open && !shop.is_accepting_orders && (
          <div className="bg-yellow-500 text-white text-center py-2 font-semibold">
            Not accepting orders right now
          </div>
        )}

        <DealsSection />

        <SearchBar value={search} onChange={setSearch} />
        <FilterBar value={filter} onChange={setFilter} />

        <MenuCategories
          products={products}
          shopId={sellerId as string}
          shopName={shop.shop_name}
          isAcceptingOrders={shop.is_accepting_orders}
          isOpen={shop.is_open}
        />

        <StickyCartBar />

      </div>
    </div>
  );
}