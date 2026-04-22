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
      // 🔹 SHOP
      const { data: shopData } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', sellerId)
        .single();

      setShop(shopData);

      // 🔹 PRODUCTS (FIXED)
      let query = supabase
        .from('seller_products')
        .select(`*, categories(name)`)
        .eq('seller_id', sellerId)
        .eq('is_active', true);

      if (search) query = query.ilike('name', `%${search}%`);
      if (filter === 'veg') query = query.eq('food_type', 'veg');
      if (filter === 'non-veg') query = query.eq('food_type', 'non_veg');

      const { data } = await query;

      setProducts(data || []);
    };

    if (sellerId) fetchData();
  }, [sellerId, search, filter]);

  if (!shop) return <div className="p-4">Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-2xl mx-auto bg-white min-h-screen rounded-xl overflow-hidden shadow-sm">

        <ShopHeader shop={shop} />

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

        <DealsSection sellerId={sellerId as string} />

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