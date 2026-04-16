'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  shopId: string;
  shopName: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQty: (id: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('CartContext missing');
  return ctx;
};

export const CartProvider = ({ children }: any) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // ✅ LOAD CART FROM DB
  const fetchCart = async () => {
    const { data, error } = await supabase.from('cart').select('*');

    if (error) {
      console.error(error);
      return;
    }

    const formatted = data.map((item) => ({
      id: item.product_id,
      name: item.product_name,
      price: item.price,
      qty: item.quantity,
      shopId: item.seller_id,
      shopName: item.shop_name || 'Store',
    }));

    setItems(formatted);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ ADD ITEM (DB FIRST)
  const addItem = async (item: Omit<CartItem, 'qty'>) => {
    // 🔥 CHECK EXISTING
    const { data: existing } = await supabase
      .from('cart')
      .select('*')
      .eq('product_id', item.id)
      .single();

    if (existing) {
      await supabase
        .from('cart')
        .update({ quantity: existing.quantity + 1 })
        .eq('product_id', item.id);
    } else {
      await supabase.from('cart').insert({
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: 1,
        seller_id: item.shopId,
        shop_name: item.shopName,
      });
    }

    await fetchCart();
  };

  // ✅ REMOVE ITEM
  const removeItem = async (id: string) => {
    await supabase.from('cart').delete().eq('product_id', id);
    await fetchCart();
  };

  // ✅ UPDATE QTY
  const updateQty = async (id: string, qty: number) => {
    if (qty <= 0) {
      await removeItem(id);
      return;
    }

    await supabase
      .from('cart')
      .update({ quantity: qty })
      .eq('product_id', id);

    await fetchCart();
  };

  // ✅ CLEAR CART
  const clearCart = async () => {
    await supabase.from('cart').delete();
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};