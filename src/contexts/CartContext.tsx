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
  image?: string | null;
};

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  addItem: (item: Omit<CartItem, 'qty'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQty: (id: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('CartContext missing');
  return ctx;
};

export const CartProvider = ({ children }: any) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 GET USER
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
      } else {
        setLoading(false);
      }
    };
    init();
  }, []);

  // 🔥 FETCH CART (JOIN FIX)
  const fetchCart = async (uid: string) => {
    setLoading(true);

    const { data, error } = await supabase
      .from('cart')
      .select(`
        *,
        seller_products (
          image_url
        )
      `)
      .eq('user_id', uid)
      .order('created_at', { ascending: true });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const formatted = (data || []).map((item: any) => ({
      id: item.product_id,
      name: item.product_name,
      price: Number(item.price),
      qty: Number(item.quantity),
      shopId: item.seller_id,
      shopName: item.shop_name,
      image: item.seller_products?.image_url || null, // ✅ JOIN FIX
    }));

    setItems(formatted);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) fetchCart(userId);
  }, [userId]);

  // 🔥 ADD ITEM (NO IMAGE STORAGE)
  const addItem = async (item: Omit<CartItem, 'qty'>) => {
    if (!userId) return;

    const { data: existing } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', item.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('cart')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id);
    } else {
      await supabase.from('cart').insert({
        user_id: userId,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: 1,
        seller_id: item.shopId,
        shop_name: item.shopName,
      });
    }

    fetchCart(userId);
  };

  // 🔥 REMOVE
  const removeItem = async (id: string) => {
    if (!userId) return;

    await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', id);

    fetchCart(userId);
  };

  // 🔥 UPDATE QTY
  const updateQty = async (id: string, qty: number) => {
    if (!userId) return;

    if (qty <= 0) {
      await removeItem(id);
      return;
    }

    await supabase
      .from('cart')
      .update({ quantity: qty })
      .eq('user_id', userId)
      .eq('product_id', id);

    fetchCart(userId);
  };

  // 🔥 CLEAR CART
  const clearCart = async () => {
    if (!userId) return;

    await supabase.from('cart').delete().eq('user_id', userId);
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        refreshCart: () => userId ? fetchCart(userId) : Promise.resolve(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};