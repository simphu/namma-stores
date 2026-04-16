'use client';

import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageAlt: string;
  tag?: 'Bestseller' | 'Popular' | 'New' | 'Offer';
  isVeg: boolean;
  weight?: string;
  rating?: number;
}

interface ProductRowProps {
  product: Product;
  shopId: string;
  shopName: string;
  isAcceptingOrders: boolean;
  isOpen: boolean;
}

export default function ProductRow({
  product,
  shopId,
  shopName,
  isAcceptingOrders,
  isOpen,
}: ProductRowProps) {

  const { items, addItem, updateQty } = useCart();

  const cartItem = items.find((i) => String(i.id) === String(product.id));
  const qty = cartItem?.qty || 0;

  const disabled = !isOpen || !isAcceptingOrders;

  // 🔥 DISCOUNT
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) * 100
        )
      : null;

  // 🔥 SYNC WITH DB
  const syncCart = async (newQty: number) => {
  try {
    console.log('SYNC CART', product.id, newQty);

    if (newQty <= 0) {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('product_id', product.id);

      if (error) console.error('DELETE ERROR', error);
      return;
    }

    const { data: existing, error: fetchError } = await supabase
      .from('cart')
      .select('*')
      .eq('product_id', product.id)
      .maybeSingle(); // ✅ FIX

    if (fetchError) {
      console.error('FETCH ERROR', fetchError);
      return;
    }

    if (existing) {
      const { error } = await supabase
        .from('cart')
        .update({ quantity: newQty })
        .eq('product_id', product.id);

      if (error) console.error('UPDATE ERROR', error);
    } else {
      const { error } = 
      await supabase.from('cart').insert({
      product_id: product.id,
      quantity: newQty,
      product_name: product.name,
      price: product.price,
      seller_id: shopId,

  // TEMP (until auth added)
  user_id: 'guest_user',
});

      if (error) console.error('INSERT ERROR', error);
    }

  } catch (err) {
    console.error('SYNC FAILED', err);
  }
};

  // 🔥 HANDLERS
  const handleAdd = async () => {
    console.log('ADDING ITEM', product.id);
    if (disabled) return;

    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      shopId,
      shopName,
    });

    await syncCart(1);
  };

  const handleIncrease = async () => {
    if (disabled) return;

    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      shopId,
      shopName,
    });

    await syncCart(qty + 1);
  };

  const handleDecrease = async () => {
    if (disabled) return;

    updateQty(String(product.id), qty - 1);

    await syncCart(qty - 1);
  };

  return (
    <article className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0">

      {/* LEFT */}
      <div className="flex-1 flex flex-col gap-1.5">

        <span className={`w-4 h-4 border-2 flex items-center justify-center ${
          product.isVeg ? 'border-green-600' : 'border-red-600'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            product.isVeg ? 'bg-green-600' : 'bg-red-600'
          }`} />
        </span>

        {product.tag === 'Bestseller' && (
          <span className="text-xs bg-amber-100 px-2 py-0.5 rounded">
            Bestseller
          </span>
        )}

        <h3 className="text-sm font-bold">{product.name}</h3>

        {product.rating && (
          <span className="text-xs bg-green-600 text-white px-1 rounded">
            {product.rating}
          </span>
        )}

        <div className="flex gap-2">
          <span>₹{product.price}</span>
          {product.originalPrice && (
            <span className="line-through text-gray-400 text-xs">
              ₹{product.originalPrice}
            </span>
          )}
          {discount && <span className="text-green-600">{discount}%</span>}
        </div>

        <p className="text-xs text-gray-500">{product.description}</p>
      </div>

      {/* RIGHT */}
      <div className="relative w-24 h-24">

        <AppImage
          src={product.image}
          alt={product.imageAlt}
          fill
          className="object-cover rounded-lg"
        />

        {qty === 0 ? (
          <button
            onClick={handleAdd}
            disabled={disabled}
            className={`absolute bottom-2 right-2 px-3 py-1 rounded ${
              disabled ? 'bg-gray-300' : 'bg-orange-500 text-white'
            }`}
          >
            {disabled ? 'Closed' : 'ADD'}
          </button>
        ) : (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex border bg-white rounded">

            <button onClick={handleDecrease} className="px-2">-</button>
            <span className="px-2">{qty}</span>
            <button onClick={handleIncrease} className="px-2">+</button>

          </div>
        )}

      </div>
    </article>
  );
}