'use client';

import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { CartItem } from './HomepageClient';

interface Props {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  open,
  onClose,
  items,
  onUpdateQty,
  onRemove,
  onClearCart,
}: Props) {
  const router = useRouter();

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  const handleCheckout = () => {
    onClose();
    router.push('/checkout'); // 🔥 DB-driven checkout
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white w-full max-w-sm h-full flex flex-col shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              🛒 Your cart is empty
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">

                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => onUpdateQty(item.id, item.qty - 1)}>
                    <Minus size={14} />
                  </button>

                  <span>{item.qty}</span>

                  <button onClick={() => onUpdateQty(item.id, item.qty + 1)}>
                    <Plus size={14} />
                  </button>

                  <button onClick={() => onRemove(item.id)}>
                    <X size={14} />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between mb-2 text-sm">
              <span>{totalItems} items</span>
              <span>₹{subtotal}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-2 rounded-lg"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={onClearCart}
              className="w-full mt-2 text-red-500 text-sm"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}