'use client';
import React, { useState } from 'react';
import { X, Star, Clock, MapPin, Plus, Minus, Search } from 'lucide-react';
import type { CartItem } from './HomepageClient';

const shopProducts: Record<string, Array<{
  id: string; name: string; description: string; price: number; category: string; emoji: string; inStock: boolean; isVeg: boolean;
}>> = {
  'shop-001': [
    { id: 'p-001-1', name: 'Tata Salt (1kg)', description: 'Iodized table salt', price: 22, category: 'Staples', emoji: '🧂', inStock: true, isVeg: true },
    { id: 'p-001-2', name: 'Amul Butter (500g)', description: 'Pasteurized table butter', price: 275, category: 'Dairy', emoji: '🧈', inStock: true, isVeg: true },
    { id: 'p-001-3', name: 'Aashirvaad Atta (5kg)', description: 'Whole wheat flour', price: 249, category: 'Staples', emoji: '🌾', inStock: true, isVeg: true },
    { id: 'p-001-4', name: 'Tata Tea Gold (500g)', description: 'Premium blend tea', price: 265, category: 'Beverages', emoji: '🍵', inStock: true, isVeg: true },
    { id: 'p-001-5', name: 'Maggi Noodles (12 pack)', description: 'Instant masala noodles', price: 156, category: 'Snacks', emoji: '🍜', inStock: false, isVeg: true },
    { id: 'p-001-6', name: 'Surf Excel (1kg)', description: 'Detergent powder', price: 185, category: 'Household', emoji: '🧺', inStock: true, isVeg: true },
  ],
  'shop-003': [
    { id: 'p-003-1', name: 'Butter Croissant', description: 'Freshly baked, flaky croissant', price: 55, category: 'Breads', emoji: '🥐', inStock: true, isVeg: true },
    { id: 'p-003-2', name: 'Chocolate Truffle Cake (500g)', description: 'Rich dark chocolate ganache', price: 380, category: 'Cakes', emoji: '🎂', inStock: true, isVeg: true },
    { id: 'p-003-3', name: 'Kaju Katli (250g)', description: 'Cashew barfi, festival special', price: 220, category: 'Sweets', emoji: '🍬', inStock: true, isVeg: true },
  ],
};

const defaultProducts = [
  { id: 'p-def-1', name: 'Product A', description: 'Available at this store', price: 99, category: 'General', emoji: '📦', inStock: true, isVeg: true },
  { id: 'p-def-2', name: 'Product B', description: 'Available at this store', price: 149, category: 'General', emoji: '📦', inStock: true, isVeg: true },
];

interface Props {
  shop: {
    id: string; name: string; category: string; rating: number; reviewCount: number;
    distance: string; deliveryTime: string; deliveryFee: number; minOrder: number;
    isOpen: boolean; offerText: string | null; emoji: string; bgColor: string;
  };
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, 'qty'>) => void;
}

export default function ShopDetailModal({ shop, onClose, onAddToCart }: Props) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const products = shopProducts[shop.id] || defaultProducts;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(products.map(p => p.category))];

  const handleAdd = (product: typeof products[0]) => {
    setQuantities(prev => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
    onAddToCart({ id: product.id, name: product.name, price: product.price, shopId: shop.id, shopName: shop.name });
  };

  const handleDecrement = (id: string) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));
  };

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[92vh] flex flex-col shadow-2xl animate-slide-up overflow-hidden">
        {/* Shop header */}
        <div className={`relative bg-gradient-to-br ${shop.bgColor} p-6 text-white flex-shrink-0`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
              {shop.emoji}
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-700 text-xl">{shop.name}</h2>
              <p className="text-white/80 text-sm font-body mt-0.5">{shop.category}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star size={12} className="fill-white" />
                  <span className="text-sm font-display font-600 tabular-nums">{shop.rating}</span>
                  <span className="text-white/70 text-xs tabular-nums">({shop.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span className="text-sm font-body">{shop.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  <span className="text-sm font-body">{shop.distance}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-display font-700 ${shop.isOpen ? 'bg-green-400/30 text-green-100' : 'bg-red-400/30 text-red-100'}`}>
                  {shop.isOpen ? '● Open' : '● Closed'}
                </span>
                {shop.deliveryFee === 0 ? (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-display font-600">Free delivery</span>
                ) : (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-body">₹{shop.deliveryFee} delivery</span>
                )}
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-body">Min ₹{shop.minOrder}</span>
              </div>
            </div>
          </div>
          {shop.offerText && (
            <div className="mt-3 px-3 py-2 bg-white/20 rounded-xl">
              <p className="text-sm font-display font-600">🎁 {shop.offerText}</p>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-stone-100 flex-shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-8 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-body focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
        </div>

        {/* Products */}
        <div className="flex-1 overflow-y-auto">
          {categories.map(cat => {
            const catProducts = filteredProducts.filter(p => p.category === cat);
            if (catProducts.length === 0) return null;
            return (
              <div key={`cat-section-${cat}`}>
                <div className="px-4 py-2 bg-stone-50 border-y border-stone-100">
                  <h3 className="text-xs font-display font-700 text-stone-500 uppercase tracking-wider">{cat}</h3>
                </div>
                {catProducts.map(product => {
                  const qty = quantities[product.id] || 0;
                  return (
                    <div key={product.id} className={`flex items-center gap-3 px-4 py-3 border-b border-stone-50 hover:bg-stone-50/50 transition-colors ${!product.inStock ? 'opacity-50' : ''}`}>
                      <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        {product.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-3 h-3 border-2 rounded-sm flex items-center justify-center flex-shrink-0 ${product.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${product.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                          </div>
                          <p className="text-sm font-display font-600 text-stone-800 line-clamp-1">{product.name}</p>
                        </div>
                        <p className="text-xs text-stone-500 font-body mt-0.5 line-clamp-1">{product.description}</p>
                        <p className="text-sm font-display font-700 text-stone-900 mt-1 tabular-nums">₹{product.price}</p>
                      </div>
                      {product.inStock ? (
                        qty === 0 ? (
                          <button
                            onClick={() => handleAdd(product)}
                            className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-display font-600 rounded-xl transition-all duration-150 flex-shrink-0"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => handleDecrement(product.id)} className="w-7 h-7 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-lg flex items-center justify-center transition-colors">
                              <Minus size={12} />
                            </button>
                            <span className="w-5 text-center text-sm font-display font-700 tabular-nums">{qty}</span>
                            <button onClick={() => handleAdd(product)} className="w-7 h-7 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors">
                              <Plus size={12} />
                            </button>
                          </div>
                        )
                      ) : (
                        <span className="text-xs font-body text-stone-400 flex-shrink-0">Unavailable</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-display font-600 text-stone-600">No products found</p>
              <p className="text-sm text-stone-400 font-body mt-1">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Cart summary bar */}
        {totalItems > 0 && (
          <div className="flex-shrink-0 p-4 border-t border-stone-200 bg-white animate-slide-up">
            <button
              onClick={onClose}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white py-3.5 rounded-2xl font-display font-700 text-base flex items-center justify-between px-5 transition-all duration-150 shadow-lg"
            >
              <span className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-sm font-700 tabular-nums">{totalItems}</span>
              <span>View Cart</span>
              <span className="tabular-nums">₹{Object.entries(quantities).reduce((sum, [id, qty]) => {
                const p = products.find(p => p.id === id);
                return sum + (p ? p.price * qty : 0);
              }, 0)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}