import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function StickyCartBar() {
  return (
    <div
      className="cart-bar fixed bottom-0 left-0 right-0 z-50"
      role="region"
      aria-label="Cart summary"
    >
      <div className="bg-[#0f172a] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* Cart info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="ShoppingBagIcon" size={15} className="text-white" variant="solid" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-sm font-700 text-white">
                2 items &nbsp;·&nbsp; ₹450
              </span>
              <span className="text-xs text-gray-400 font-body">Extra charges may apply</span>
            </div>
          </div>

          {/* View Cart CTA */}
          <button
  className="bg-orange-500 hover:bg-orange-600 transition 
  text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg"
>
  View Cart →
</button>
        </div>
      </div>
    </div>
  );
}