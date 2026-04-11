'use client';

import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import CategorySection from './CategorySection';
import ActiveOrderBanner from './ActiveOrderBanner';
import NammaFreshSection from './NammaFreshSection';
import ShopsGrid from './ShopsGrid';
import CateringSection from './CateringSection';
import CartDrawer from './CartDrawer';
import BottomTabBar from './BottomTabBar';

// ✅ USE AUTH CONTEXT
import { useAuth } from '@/contexts/AuthContext';
const ADDRESS_KEY = "namma_addresses";
function getAddresses() {
  try {
    const raw = localStorage.getItem(ADDRESS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAddresses(addresses: any[]) {
  localStorage.setItem(ADDRESS_KEY, JSON.stringify(addresses));
}

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  shopId: string;
  shopName: string;
};

export default function HomepageClient({ selectedAddress, products }: any) {
  const [addresses, setAddresses] = useState([]);
  
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeSection, setActiveSection] = useState<'all' | 'fresh' | 'shops' | 'catering'>('all');

  

  // ✅ GET SUPABASE FROM CONTEXT
  const { getUserProfile } = useAuth();


  const addToCart = (item: Omit<CartItem, 'qty'>) => {
    const existingShopId = cartItems[0]?.shopId;

    if (existingShopId && existingShopId !== item.shopId) {
      toast.error('Cart conflict', {
        description: 'You can only order from one shop at a time.',
        action: { label: 'Clear Cart', onClick: () => setCartItems([]) },
      });
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(ci => ci.id === item.id);

      if (existing) {
        return prev.map(ci =>
          ci.id === item.id ? { ...ci, qty: ci.qty + 1 } : ci
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(ci => ci.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prev =>
      prev.map(ci => (ci.id === id ? { ...ci, qty } : ci))
    );
  };
  const clearCart = () => {
  setCartItems([]);
};
  return (
    <>
      <Toaster position="bottom-center" richColors />

      <main className="max-w-screen-2xl mx-auto pb-24 lg:pb-8">
        <ActiveOrderBanner />

        <CategorySection
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {(activeSection === 'all' || activeSection === 'fresh') && (
          <NammaFreshSection
          products={products}
          cartItems={cartItems}
          onAddToCart={(item) => {
          addToCart(item);
          setCartOpen(true);
  }}
/>
        )}

        {(activeSection === 'all' || activeSection === 'shops') && (
          <ShopsGrid onAddToCart={addToCart} />
        )}

        {(activeSection === 'all' || activeSection === 'catering') && (
          <CateringSection />
        )}
      </main>

<CartDrawer
  open={cartOpen}
  onClose={() => setCartOpen(false)}
  items={cartItems}
  onUpdateQty={updateQty}
  onRemove={removeFromCart}
  onClearCart={clearCart} // ✅ NEW
/>

      <BottomTabBar
        cartCount={cartItems.reduce((s, i) => s + i.qty, 0)}
        onCartOpen={() => setCartOpen(true)}
      />
    </>
  );
}