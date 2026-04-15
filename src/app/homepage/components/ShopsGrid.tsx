'use client';

import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import type { CartItem } from './HomepageClient';
import { supabase } from '@/lib/supabase';

type FilterType = 'all' | 'open' | 'fast' | 'free-delivery';
type Seller = {
  id: string;

  // core
  shop_name: string;
  is_open: boolean;
  is_accepting_orders: boolean;

  // optional UI fields
  rating?: number;
  delivery_time?: string;
  location?: string;

  // pricing
  deliveryFee?: number;
  minOrder?: number;

  // future-safe
  image?: string;
  category?: string;
};

interface Props {
  onAddToCart: (item: Omit<CartItem, 'qty'>) => void;
}

export default function ShopsGrid({ onAddToCart }: Props) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [shops, setShops] = useState<Seller[]>([]);

  // ✅ INITIAL FETCH
  const fetchShops = async () => {
    const { data, error } = await supabase
      .from('sellers')
      .select('*');

    if (!error && data) {
      setShops(data);
    }
  };

  useEffect(() => {
  const fetchShops = async () => {
    const { data } = await supabase
      .from('sellers')
      .select('*');

    setShops(data || []);
  };

  fetchShops();

  // ✅ REALTIME LISTENER
  const channel = supabase
    .channel('shops-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'sellers',
      },
      (payload) => {
        console.log('SHOP UPDATE:', payload);

        setShops((prev: Seller[]) => {
  const updated = payload.new as Seller;

  if (!updated || !updated.id) return prev;

  return prev.map((shop) =>
    shop.id === updated.id
      ? { ...shop, ...updated }
      : shop
  );
});
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  // ✅ FILTER LOGIC
  const filteredShops = shops.filter((shop) => {
    if (filter === 'open') return shop.is_open === true;
    return true;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Shops' },
    { key: 'open', label: '🟢 Open Now' },
    { key: 'fast', label: '⚡ Fast Delivery' },
    { key: 'free-delivery', label: '🆓 Free Delivery' },
  ];

  return (
    <section className="px-4 lg:px-8 mt-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-700 text-lg text-stone-800">
            Local Shops Near You
          </h2>
          <p className="text-xs text-stone-500">
            Showing shops within 5km · Whitefield, Bangalore
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-xl text-sm">
          <Filter size={13} />
          Filter
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs border ${
              filter === f.key
                ? 'bg-black text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {filteredShops.map((shop) => (
          <button
            key={shop.id}
            onClick={() => window.location.href = `/shop/${shop.id}`}
            className="bg-white rounded-xl border overflow-hidden text-left transition hover:shadow-md"
          >

            {/* IMAGE */}
            <div className="relative h-28 bg-gray-100 flex items-center justify-center">

              <span className="text-4xl">🏪</span>

              {/* 🔴 CLOSED */}
              {!shop.is_open && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-bold">Closed</span>
                </div>
              )}

              {/* 🟡 NOT ACCEPTING */}
              {shop.is_open && !shop.is_accepting_orders && (
                <div className="absolute inset-0 bg-yellow-500/80 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    Not Accepting Orders
                  </span>
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="p-3">

              <h3 className="font-semibold">
                {shop.shop_name}
              </h3>

              <div className="flex gap-3 text-xs mt-2 text-gray-500">
                <span>⭐ {shop.rating || 4.2}</span>
                <span>⏱ {shop.delivery_time || '20-30 min'}</span>
                <span>📍 {shop.location || 'Nearby'}</span>
              </div>

              {/* DELIVERY */}
              <div className="flex justify-between mt-2 text-xs">
                <span>
                  {shop.deliveryFee === 0
                    ? 'Free delivery'
                    : `₹${shop.deliveryFee || 20}`}
                </span>
                <span>Min ₹{shop.minOrder || 100}</span>
              </div>

            </div>

          </button>
        ))}

      </div>

      {/* EMPTY STATE */}
      {filteredShops.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No shops found
        </div>
      )}

    </section>
  );
}