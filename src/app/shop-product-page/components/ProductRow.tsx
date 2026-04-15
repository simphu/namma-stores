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

  // 🔥 CART STATE
  const cartItem = items.find((i) => String(i.id) === String(product.id));
  const qty = cartItem?.qty || 0;

  // 🔥 GLOBAL DISABLE CONDITION
  const disabled = !isOpen || !isAcceptingOrders;

  // 🔥 DISCOUNT
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : null;

  // 🔥 HANDLERS
  const handleAdd = () => {
    if (disabled) return;

    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      shopId,
      shopName,
    });
  };

  const handleIncrease = () => {
    if (disabled) return;

    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      shopId,
      shopName,
    });
  };

  const handleDecrease = () => {
    if (disabled) return;

    updateQty(String(product.id), qty - 1);
  };

  return (
    <article className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0">

      {/* LEFT */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">

        {/* Veg / Non-veg */}
        <span
          className={`inline-flex w-4 h-4 rounded-sm border-2 items-center justify-center ${
            product.isVeg ? 'border-green-600' : 'border-red-600'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              product.isVeg ? 'bg-green-600' : 'bg-red-600'
            }`}
          />
        </span>

        {/* Tag */}
        {product.tag === 'Bestseller' && (
          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 w-fit">
            🏆 Bestseller
          </span>
        )}

        {/* Name */}
        <h3 className="text-sm font-bold">{product.name}</h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-0.5 bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded">
              <Icon name="StarIcon" size={9} />
              {product.rating}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold">₹{product.price}</span>

          {product.originalPrice && (
            <span className="text-xs line-through text-gray-400">
              ₹{product.originalPrice}
            </span>
          )}

          {discount && (
            <span className="text-xs text-green-600 font-semibold">
              {discount}% OFF
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

      {/* RIGHT */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">

        <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100">
          <AppImage
            src={product.image}
            alt={product.imageAlt}
            fill
            className="object-cover"
          />
        </div>

        {/* 🔥 ADD BUTTON */}
        {qty === 0 ? (
          <button
            onClick={handleAdd}
            disabled={disabled}
            className={`absolute bottom-2 right-2 px-3 py-1 rounded-lg text-sm font-semibold transition ${
              disabled
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {!isOpen
              ? 'Closed'
              : !isAcceptingOrders
              ? 'Paused'
              : 'ADD'}
          </button>
        ) : (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center bg-white border rounded-lg shadow-md overflow-hidden">

            <button
              onClick={handleDecrease}
              disabled={disabled}
              className="px-2 py-1 font-bold disabled:opacity-40"
            >
              -
            </button>

            <span className="px-3 text-sm font-bold">
              {qty}
            </span>

            <button
              onClick={handleIncrease}
              disabled={disabled}
              className="px-2 py-1 font-bold disabled:opacity-40"
            >
              +
            </button>

          </div>
        )}

      </div>
    </article>
  );
}