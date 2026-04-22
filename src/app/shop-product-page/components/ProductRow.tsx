'use client';

import React, { useEffect, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
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

  const [userId, setUserId] = useState<string | null>(null);

  const cartItem = items.find((i) => String(i.id) === String(product.id));
  const qty = cartItem?.qty || 0;
  const disabled = !isOpen || !isAcceptingOrders;

  // ✅ GET USER (CORRECT WAY)
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    getUser();
  }, []);

  // 🔥 DISCOUNT
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) * 100
        )
      : null;

  // ✅ SYNC CART (PRODUCTION SAFE)
  // const syncCart = async (newQty: number) => {
  //   try {
  //     if (!userId) {
  //       console.error('User not logged in');
  //       return;
  //     }

  //     // 🔥 DELETE
  //     if (newQty <= 0) {
  //       await supabase
  //         .from('cart')
  //         .delete()
  //         .eq('product_id', product.id)
  //         .eq('user_id', userId);

  //       return;
  //     }

  //     // 🔥 CHECK EXISTING
  //     const { data: existing } = await supabase
  //       .from('cart')
  //       .select('*')
  //       .eq('product_id', product.id)
  //       .eq('user_id', userId)
  //       .maybeSingle();

  //     if (existing) {
  //       // 🔥 UPDATE
  //       await supabase
  //         .from('cart')
  //         .update({ quantity: newQty })
  //         .eq('product_id', product.id)
  //         .eq('user_id', userId);
  //     } else {
  //       // 🔥 INSERT
  //       await supabase.from('cart').insert({
  //         product_id: product.id,
  //         quantity: newQty,
  //         product_name: product.name,
  //         price: product.price,
  //         seller_id: shopId,
  //         shop_name: shopName,
  //         product_image: product.image, // ✅ IMPORTANT
  //         user_id: userId,
  //       });
  //     }

  //   } catch (err) {
  //     console.error('SYNC FAILED', err);
  //   }
  // };

  // 🔥 HANDLERS
  const handleAdd = async () => {
  if (disabled) return;

  await addItem({
    id: String(product.id),
    name: product.name,
    price: product.price,
    shopId,
    shopName,
  });
};

const handleIncrease = async () => {
  if (disabled) return;

  await addItem({
    id: String(product.id),
    name: product.name,
    price: product.price,
    shopId,
    shopName,
  });
};

const handleDecrease = async () => {
  if (disabled) return;

  await updateQty(String(product.id), qty - 1);
};

  return (
    <article className="flex items-start gap-4 py-4 border-b border-gray-100">

      {/* LEFT */}
      <div className="flex-1 flex flex-col gap-1.5">

        <span className={`w-4 h-4 border-2 flex items-center justify-center ${
          product.isVeg ? 'border-green-600' : 'border-red-600'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            product.isVeg ? 'bg-green-600' : 'bg-red-600'
          }`} />
        </span>

        <h3 className="text-sm font-bold">{product.name}</h3>

        <div className="flex gap-2">
          <span>₹{product.price}</span>

          {product.originalPrice && (
            <span className="line-through text-gray-400 text-xs">
              ₹{product.originalPrice}
            </span>
          )}

          {discount && (
            <span className="text-green-600 text-xs">{discount}% OFF</span>
          )}
        </div>

        <p className="text-xs text-gray-500">{product.description}</p>
      </div>

      {/* RIGHT */}
      <div className="relative w-24 h-24">

        <AppImage
          src={product.image || '/placeholder.png'}
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
            ADD
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