'use client';
import React, { useState } from 'react';
import { Star, Clock, MapPin, ChevronRight, Filter, Zap } from 'lucide-react';
import type { CartItem } from './HomepageClient';
import ShopDetailModal from './ShopDetailModal';

export const shops = [
  {
    id: 'shop-001',
    name: 'Fresh Basket Store',
    category: 'Grocery & Essentials',
    rating: 4.6,
    reviewCount: 234,
    distance: '0.4 km',
    deliveryTime: '15–25 min',
    deliveryFee: 20,
    minOrder: 99,
    isOpen: true,
    isFeatured: true,
    offerText: '10% off on orders above ₹299',
    tags: ['Grocery', 'Dairy', 'Snacks'],
    emoji: '🛒',
    bgColor: 'from-green-400 to-emerald-500',
  },
  {
    id: 'shop-002',
    name: 'Whitefield Medical',
    category: 'Pharmacy',
    rating: 4.8,
    reviewCount: 189,
    distance: '0.7 km',
    deliveryTime: '20–30 min',
    deliveryFee: 0,
    minOrder: 0,
    isOpen: true,
    isFeatured: false,
    offerText: 'Free delivery on all orders',
    tags: ['Medicines', 'Healthcare', 'Baby Care'],
    emoji: '💊',
    bgColor: 'from-blue-400 to-blue-600',
  },
  {
    id: 'shop-003',
    name: 'Ravi Bakery',
    category: 'Bakery & Sweets',
    rating: 4.5,
    reviewCount: 312,
    distance: '1.1 km',
    deliveryTime: '25–35 min',
    deliveryFee: 25,
    minOrder: 149,
    isOpen: true,
    isFeatured: true,
    offerText: 'Buy 2 get 1 on pastries',
    tags: ['Bread', 'Cakes', 'Sweets'],
    emoji: '🧁',
    bgColor: 'from-amber-400 to-orange-500',
  },
  {
    id: 'shop-004',
    name: 'Sri Venkateshwara Flowers',
    category: 'Flowers & Puja',
    rating: 4.3,
    reviewCount: 98,
    distance: '1.4 km',
    deliveryTime: '20–30 min',
    deliveryFee: 30,
    minOrder: 80,
    isOpen: false,
    isFeatured: false,
    offerText: null,
    tags: ['Flowers', 'Puja Items', 'Garlands'],
    emoji: '🌺',
    bgColor: 'from-pink-400 to-rose-500',
  },
  {
    id: 'shop-005',
    name: 'Daily Needs Mart',
    category: 'Supermarket',
    rating: 4.4,
    reviewCount: 456,
    distance: '1.8 km',
    deliveryTime: '30–45 min',
    deliveryFee: 15,
    minOrder: 199,
    isOpen: true,
    isFeatured: false,
    offerText: '₹30 off on first order',
    tags: ['Grocery', 'Household', 'Personal Care'],
    emoji: '🏪',
    bgColor: 'from-violet-400 to-purple-500',
  },
  {
    id: 'shop-006',
    name: 'Spice Garden',
    category: 'Spices & Dry Goods',
    rating: 4.7,
    reviewCount: 167,
    distance: '2.2 km',
    deliveryTime: '35–50 min',
    deliveryFee: 20,
    minOrder: 149,
    isOpen: true,
    isFeatured: false,
    offerText: null,
    tags: ['Spices', 'Pulses', 'Oils'],
    emoji: '🌶️',
    bgColor: 'from-red-400 to-red-600',
  },
  {
    id: 'shop-007',
    name: 'Naturals Ice Cream',
    category: 'Ice Cream & Desserts',
    rating: 4.9,
    reviewCount: 521,
    distance: '2.6 km',
    deliveryTime: '25–35 min',
    deliveryFee: 25,
    minOrder: 99,
    isOpen: true,
    isFeatured: true,
    offerText: 'Free cone on orders ₹199+',
    tags: ['Ice Cream', 'Shakes', 'Desserts'],
    emoji: '🍦',
    bgColor: 'from-teal-400 to-cyan-500',
  },
  {
    id: 'shop-008',
    name: 'HomeStyle Tiffin',
    category: 'Home Food',
    rating: 4.6,
    reviewCount: 203,
    distance: '3.1 km',
    deliveryTime: '40–55 min',
    deliveryFee: 30,
    minOrder: 120,
    isOpen: false,
    isFeatured: false,
    offerText: null,
    tags: ['Tiffin', 'Lunch', 'South Indian'],
    emoji: '🍛',
    bgColor: 'from-yellow-400 to-amber-500',
  },
];

type FilterType = 'all' | 'open' | 'fast' | 'free-delivery';

interface Props {
  onAddToCart: (item: Omit<CartItem, 'qty'>) => void;
}

export default function ShopsGrid({ onAddToCart }: Props) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedShop, setSelectedShop] = useState<typeof shops[0] | null>(null);

  const filteredShops = shops.filter(shop => {
    if (filter === 'open') return shop.isOpen;
    if (filter === 'fast') return parseInt(shop.deliveryTime) <= 25;
    if (filter === 'free-delivery') return shop.deliveryFee === 0;
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-700 text-lg text-stone-800">Local Shops Near You</h2>
          <p className="text-xs text-stone-500 font-body">Showing shops within 5km · Whitefield, Bangalore</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-sm font-display font-500 text-stone-600 transition-colors">
          <Filter size={13} />
          Filter
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-4 -mx-4 px-4 lg:-mx-8 lg:px-8">
        {filters.map(f => (
          <button
            key={`filter-${f.key}`}
            onClick={() => setFilter(f.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-display font-600 border transition-all duration-150 ${
              filter === f.key
                ? 'bg-stone-800 text-white border-stone-800' :'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Shop grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {filteredShops.map(shop => (
          <button
            key={shop.id}
            onClick={() => setSelectedShop(shop)}
            className="bg-white rounded-2xl border border-stone-200 shadow-card hover:shadow-card-hover transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] text-left overflow-hidden group"
          >
            {/* Shop banner */}
            <div className={`relative h-28 bg-gradient-to-br ${shop.bgColor} flex items-center justify-center overflow-hidden`}>
              <span className="text-5xl opacity-80">{shop.emoji}</span>
              {shop.isFeatured && (
                <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-white/90 text-orange-600 text-[10px] font-display font-700 rounded-full">
                  <Zap size={9} className="fill-orange-500" />
                  Featured
                </span>
              )}
              {!shop.isOpen && (
                <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center">
                  <span className="text-white text-sm font-display font-700 bg-stone-800/80 px-3 py-1 rounded-full">Closed</span>
                </div>
              )}
            </div>

            <div className="p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-display font-700 text-sm text-stone-800 line-clamp-1">{shop.name}</h3>
                  <p className="text-xs text-stone-500 font-body mt-0.5">{shop.category}</p>
                </div>
                <ChevronRight size={14} className="text-stone-400 flex-shrink-0 mt-0.5 group-hover:text-orange-500 transition-colors" />
              </div>

              {/* Tags */}
              <div className="flex gap-1 mt-2 flex-wrap">
                {shop.tags.slice(0, 2).map(tag => (
                  <span key={`${shop.id}-tag-${tag}`} className="px-1.5 py-0.5 bg-stone-100 text-stone-500 text-[10px] font-body rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-3 mt-2.5">
                <div className="flex items-center gap-0.5">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-display font-600 text-stone-700 tabular-nums">{shop.rating}</span>
                  <span className="text-xs text-stone-400 font-body tabular-nums">({shop.reviewCount})</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Clock size={11} className="text-stone-400" />
                  <span className="text-xs text-stone-500 font-body">{shop.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <MapPin size={11} className="text-stone-400" />
                  <span className="text-xs text-stone-500 font-body">{shop.distance}</span>
                </div>
              </div>

              {/* Offer */}
              {shop.offerText && (
                <div className="mt-2.5 px-2 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-[10px] font-display font-600 text-green-700 line-clamp-1">🎁 {shop.offerText}</p>
                </div>
              )}

              {/* Delivery info */}
              <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-stone-100">
                <span className="text-xs text-stone-500 font-body">
                  {shop.deliveryFee === 0 ? (
                    <span className="text-green-600 font-display font-600">Free delivery</span>
                  ) : (
                    <>₹{shop.deliveryFee} delivery</>
                  )}
                </span>
                <span className="text-xs text-stone-400 font-body">Min ₹{shop.minOrder}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredShops.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl">🔍</span>
          <p className="font-display font-600 text-stone-600 mt-3">No shops match this filter</p>
          <p className="text-sm text-stone-400 font-body mt-1">Try removing filters to see all nearby shops</p>
          <button
            onClick={() => setFilter('all')}
            className="mt-4 px-4 py-2 bg-orange-500 text-white text-sm font-display font-600 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Show All Shops
          </button>
        </div>
      )}

      {/* Shop detail modal */}
      {selectedShop && (
        <ShopDetailModal
          shop={selectedShop}
          onClose={() => setSelectedShop(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </section>
  );
}