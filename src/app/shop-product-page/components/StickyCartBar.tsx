'use client';

import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

export default function StickyCartBar() {
  const { items } = useCart();
  const router = useRouter();

  // 🔥 CALCULATE TOTALS
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  // ❌ hide if empty
  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-[#0f172a] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Icon name="ShoppingBagIcon" size={15} className="text-white" />
            </div>

            <div>
              <p className="text-white text-sm font-semibold">
                {totalItems} items · ₹{totalPrice}
              </p>
              <p className="text-gray-400 text-xs">
                Extra charges may apply
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <button
            onClick={() => {
  localStorage.setItem('checkout_cart', JSON.stringify(items)); // 🔥 FIX
  router.push('/checkout');
}}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold"
          >
            View Cart →
          </button>

        </div>
      </div>
    </div>
  );
}