'use client';
import React from 'react';
import { X, Plus, Minus, ChevronRight } from 'lucide-react';
import type { CartItem } from './HomepageClient';
import { useRouter } from 'next/navigation';

interface Props {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({ open, onClose, items, onUpdateQty, onRemove, onClearCart }: Props) {
  const router = useRouter();

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  const handleProceedToCheckout = () => {
  // 🔍 Ensure every item has shopId (critical for backend)
  const validatedItems = items.map(item => {
    if (!item.shopId) {
      console.error("❌ Missing shopId in item:", item);
    }

    return {
      ...item,
      shopId: item.shopId || '', // fallback to prevent crash
    };
  });

  // 🧪 Debug (check once in console)
  console.log("🛒 Saving cart to checkout:", validatedItems);

  // 🚀 Save to localStorage
  localStorage.setItem('checkout_cart', JSON.stringify(validatedItems));

  onClose();
  router.push('/checkout');
};

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm h-full flex flex-col shadow-2xl animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 flex-shrink-0">
          <div>
            <h2 className="font-display font-700 text-lg text-stone-800">Your Cart</h2>
            
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 transition-colors">
            <X size={18} className="text-stone-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center">
              <span className="text-6xl mb-4">🛒</span>
              <p className="font-display font-700 text-stone-700 text-lg">Your cart is empty</p>
              <p className="text-sm text-stone-500 font-body mt-2">Add items from a nearby shop to get started</p>
              <button onClick={onClose} className="mt-6 px-5 py-2.5 bg-orange-500 text-white font-display font-600 rounded-xl hover:bg-orange-600 transition-colors">
                Browse Shops
              </button>
            </div>
          ) : (
            <div className="px-4 py-4 space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-600 text-stone-800 line-clamp-1">{item.name}</p>
                    <p className="text-sm font-display font-700 text-orange-600 mt-0.5 tabular-nums">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => onUpdateQty(item.id, item.qty - 1)} className="w-7 h-7 bg-white border border-stone-200 hover:border-orange-300 text-stone-600 rounded-lg flex items-center justify-center transition-colors">
                      <Minus size={11} />
                    </button>
                    <span className="w-5 text-center text-sm font-display font-700 tabular-nums">{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="w-7 h-7 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors">
                      <Plus size={11} />
                    </button>
                    <button onClick={() => onRemove(item.id)} className="w-7 h-7 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors ml-1">
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Quick summary */}
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                <div className="flex justify-between text-sm font-body text-stone-600">
                  <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                  <span className="tabular-nums font-display font-600">₹{subtotal}</span>
                </div>
                <p className="text-xs text-stone-400 mt-1 font-body">Delivery fee & taxes calculated at checkout</p>
              </div>
            </div>
          )}
        </div>

        {/* Proceed to Checkout */}
        {items.length > 0 && (
          <div className="flex-shrink-0 p-4 border-t border-stone-200 bg-white">
<button
  onClick={handleProceedToCheckout}
>
  Proceed to Checkout · ₹{subtotal}
</button>
          </div>
        )}
      </div>
    </div>
  );
}