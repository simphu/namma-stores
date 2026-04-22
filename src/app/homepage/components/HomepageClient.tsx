'use client';

import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';

import CategorySection from './CategorySection';
import ActiveOrderBanner from './ActiveOrderBanner';
import NammaFreshSection from './NammaFreshSection';
import ShopsGrid from './ShopsGrid';
import CateringSection from './CateringSection';
import CartDrawer from './CartDrawer';
import BottomTabBar from './BottomTabBar';

import { useCart } from '@/contexts/CartContext';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  shopId: string;
  shopName: string;
};

export default function HomepageClient({ selectedAddress, products }: any) {
  const [cartOpen, setCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'fresh' | 'shops' | 'catering'>('all');

  const { items, addItem, updateQty, removeItem, clearCart } = useCart();

  // 🔥 PRODUCTION: SINGLE SHOP LOCK
  const handleAddToCart = async (item: Omit<CartItem, 'qty'>) => {
    if (!item.shopId) {
      toast.error("Invalid product");
      return;
    }

    const existingShopId = items[0]?.shopId;

    if (existingShopId && existingShopId !== item.shopId) {
      toast.error('Cart conflict', {
        description: 'You can only order from one shop at a time.',
        action: {
          label: 'Clear Cart',
          onClick: () => clearCart(),
        },
      });
      return;
    }

    await addItem(item);
    setCartOpen(true);
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
            cartItems={items}
            onAddToCart={handleAddToCart}
          />
        )}

        {(activeSection === 'all' || activeSection === 'shops') && (
          <ShopsGrid onAddToCart={handleAddToCart} />
        )}

        {(activeSection === 'all' || activeSection === 'catering') && (
          <CateringSection />
        )}

      </main>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        onUpdateQty={updateQty}
        onRemove={removeItem}
        onClearCart={clearCart}
      />

      <BottomTabBar
        cartCount={items.reduce((s, i) => s + i.qty, 0)}
        onCartOpen={() => setCartOpen(true)}
      />
    </>
  );
}