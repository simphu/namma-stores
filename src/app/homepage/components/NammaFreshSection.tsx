'use client';

import React, { useState } from 'react';
import { Star, Clock, Leaf, Plus, Minus } from 'lucide-react';
import type { CartItem } from './HomepageClient';

interface Props {
  products: any[];
  cartItems: CartItem[];
  onAddToCart: (item: Omit<CartItem, 'qty'>) => void;
}

export default function NammaFreshSection({ products, cartItems, onAddToCart }: Props) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleAdd = (product: any) => {
    const newQty = (quantities[product.id] || 0) + 1;

    setQuantities(prev => ({ ...prev, [product.id]: newQty }));

    onAddToCart({
  id: product.id,
  name: product.name,
  price: product.price,

  // ✅ TEMP FIX (USE REAL SELLER)
  shopId: 'seller_1',

  shopName: 'Namma Fresh',
});
  };

  const handleDecrement = (id: string) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));
  };

  return (
    <section className="px-4 lg:px-8 mt-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Leaf size={16} className="text-green-600" />
          </div>
          <div>
            <h2 className="font-display font-700 text-lg text-stone-800">
              Namma Fresh
            </h2>
            <p className="text-xs text-stone-500 font-body">
              Fresh cuts, flowers & more · Delivered in 20–30 min
            </p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:-mx-8 lg:px-8">
        {products.map((product: any) => {
          const cartItem = cartItems.find(ci => ci.id === product.id);
          const qty = cartItem ? cartItem.qty : 0;

          const discount = product.originalPrice
            ? Math.round((1 - product.price / product.originalPrice) * 100)
            : 0;

          return (
            <div
              key={product.id}
              className={`flex-shrink-0 w-40 sm:w-44 bg-white rounded-2xl border shadow-card overflow-hidden ${
                product.inStock === false ? 'opacity-60' : ''
              }`}
            >
              {/* Image */}
              <div className="relative h-28 flex items-center justify-center bg-gray-100">
                <span className="text-5xl">{product.emoji || '🛒'}</span>

                {product.tag && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-orange-500 text-white text-[10px] rounded-full">
                    {product.tag}
                  </span>
                )}

                {product.inStock === false && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <span className="text-xs font-bold text-gray-500">
                      Out of Stock
                    </span>
                  </div>
                )}

                {discount > 0 && product.inStock !== false && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-green-500 text-white text-[10px] rounded-full">
                    {discount}% off
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                <p className="text-sm font-semibold">{product.name}</p>

                {/* ✅ FIXED FALLBACK */}
                <p className="text-xs text-gray-500">
                  {product.weight || '1 unit'}
                </p>

                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>
                    <Star size={10} className="inline" /> {product.rating || 4.5}
                  </span>
                  <span>·</span>
                  <span>
                    <Clock size={10} className="inline" />{' '}
                    {product.prepTime || '20 min'}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="font-bold">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs line-through ml-1 text-gray-400">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {product.inStock !== false && (
                    qty === 0 ? (
                      <button
                        onClick={() => handleAdd(product)}
                        className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDecrement(product.id)}>
                          <Minus size={10} />
                        </button>
                        <span>{qty}</span>
                        <button onClick={() => handleAdd(product)}>
                          <Plus size={10} />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}