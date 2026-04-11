'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, Package, User } from 'lucide-react';

interface Props {
  cartCount: number;
  onCartOpen: () => void;
}

export default function BottomTabBar({ cartCount, onCartOpen }: Props) {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-bottom-bar">
      <div className="flex items-center justify-around px-2 py-2 max-w-screen-sm mx-auto">
        {/* Home */}
        <Link
          href="/homepage"
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-150 ${
            pathname === '/homepage' ? 'text-orange-600' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <Home size={20} />
          <span className="text-[10px] font-display font-600">Home</span>
        </Link>

        {/* Search */}
        <button className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-150 text-stone-400 hover:text-stone-600">
          <Search size={20} />
          <span className="text-[10px] font-display font-600">Search</span>
        </button>

        {/* Orders */}
        <Link
          href="/orders"
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-150 ${
            pathname === '/orders' ? 'text-orange-600' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <Package size={20} />
          <span className="text-[10px] font-display font-600">Orders</span>
        </Link>

        {/* Profile */}
        <button className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-150 text-stone-400 hover:text-stone-600">
          <User size={20} />
          <span className="text-[10px] font-display font-600">Profile</span>
        </button>

        {/* Cart tab (special) */}
        <button
          onClick={onCartOpen}
          className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-150 text-stone-400 hover:text-orange-600 relative"
        >
          <div className="relative">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-orange-500 text-white text-[9px] font-display font-700 rounded-full flex items-center justify-center px-0.5 tabular-nums">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-display font-600">Cart</span>
        </button>
      </div>
    </nav>
  );
}