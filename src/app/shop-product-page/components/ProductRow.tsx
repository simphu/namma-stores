'use client';

import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/contexts/CartContext';


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
}

export default function ProductRow({ product, shopId, shopName }: ProductRowProps) {
  const { items, addItem, updateQty } = useCart();

  // 🔥 Find item in cart
  const cartItem = items.find((i) => String(i.id) === String(product.id));
  const qty = cartItem?.qty || 0;

  // ✅ Safe discount calculation
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null;

  return (
    <article className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0">
      
      {/* LEFT: Product Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        
        {/* Veg/Non-veg indicator */}
        <span
          className={`inline-flex w-4 h-4 rounded-sm border-2 items-center justify-center flex-shrink-0 ${
            product.isVeg ? 'border-green-600' : 'border-red-600'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              product.isVeg ? 'bg-green-600' : 'bg-red-600'
            }`}
          />
        </span>

        {/* Bestseller tag */}
        {product.tag === 'Bestseller' && (
          <span className="inline-flex items-center gap-1 text-[10px] font-700 text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 self-start">
            🏆 Bestseller
          </span>
        )}

        {/* Name */}
        <h3 className="text-sm font-bold leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-0.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              <Icon name="StarIcon" size={9} className="text-white" variant="solid" />
              {product.rating}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold">₹{product.price}</span>

          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}

          {discount && (
            <span className="text-[10px] font-semibold text-green-600">
              {discount}% off
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2">
          {product.description}
        </p>

        {/* Weight */}
        {product.weight && (
          <span className="text-[11px] text-gray-400">
            {product.weight}
          </span>
        )}
      </div>

      {/* RIGHT: Image + ADD / QUANTITY */}
      <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 z-10">
        
        <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100">
          <AppImage
            src={product.image}
            alt={product.imageAlt}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>

        {/* 🔥 BUTTON SWITCH */}
        {qty === 0 ? (
          <button
            onClick={() => {
  console.log("ADD CLICKED:", product);

  addItem({
    id: String(product.id),
    name: product.name,
    price: product.price,
    shopId,
    shopName,
  });
}}
            className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20
bg-white text-orange-500 border border-orange-500 
text-xs font-bold px-5 py-1.5 rounded-lg shadow-md 
hover:bg-orange-500 hover:text-white transition"
          >
            ADD
          </button>
        ) : (
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex items-center bg-white border border-primary rounded-lg shadow-md overflow-hidden">
            
            {/* MINUS */}
            <button
              onClick={() =>
                updateQty(String(product.id), qty - 1)
              }
              className="px-2 py-1 text-primary font-bold"
            >
              -
            </button>

            {/* QTY */}
            <span className="px-3 text-sm font-bold">
              {qty}
            </span>

            {/* PLUS */}
            <button
              onClick={() => {
                 console.log("ADDING:", product);
                  addItem({
              id: String(product.id),
               name: product.name,
              price: product.price,
              shopId,
             shopName,
             });
            }}
              className="px-2 py-1 text-primary font-bold"
            >
              +
            </button>

          </div>
        )}

      </div>
    </article>
  );
}