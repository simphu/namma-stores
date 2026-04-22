'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useCheckout = () => {
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const [instructions, setInstructions] = useState('');
  const [seller, setSeller] = useState<any>(null);

  const [placing, setPlacing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // INIT
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id || null;

      setUserId(uid);

      if (uid) {
        await fetchCart(uid);
        await fetchAddresses(uid);
      }

      setLoaded(true);
    };

    init();
  }, []);

  // FETCH CART
  const fetchCart = async (uid: string) => {
    const { data } = await supabase
      .from('cart')
      .select(`
        *,
        seller_products ( image_url )
      `)
      .eq('user_id', uid);

    const formatted = (data || []).map((item: any) => ({
      id: item.product_id,
      name: item.product_name,
      price: Number(item.price),
      qty: Number(item.quantity),
      shopId: item.seller_id,
      shopName: item.shop_name,
      image: item.seller_products?.image_url || null,
    }));

    setItems(formatted);

    if (data?.length) {
      const { data: sellerData } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', data[0].seller_id)
        .single();

      setSeller(sellerData);
    }
  };

  // FETCH ADDRESS
  const fetchAddresses = async (uid: string) => {
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', uid);

    setAddresses(data || []);
    if (data?.length) setSelectedAddress(data[0].id);
  };

  // UPDATE QTY
  const updateQty = async (id: string, qty: number) => {
    if (!userId) return;

    if (qty <= 0) {
      await supabase.from('cart').delete().eq('product_id', id).eq('user_id', userId);
    } else {
      await supabase
        .from('cart')
        .update({ quantity: qty })
        .eq('product_id', id)
        .eq('user_id', userId);
    }

    fetchCart(userId);
  };

  // CALCULATIONS
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = deliveryMode === 'delivery' ? 25 : 0;
  const total = subtotal + deliveryFee;
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  // PLACE ORDER
  const handlePlaceOrder = async () => {
    if (!userId) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (!items.length) {
      toast.error('Cart is empty');
      return;
    }

    if (deliveryMode === 'delivery' && !selectedAddress) {
      toast.error('Select address');
      return;
    }

    const addressText =
      addresses.find((a) => a.id === selectedAddress)?.address || 'Pickup';

    setPlacing(true);

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          seller_id: items[0]?.shopId,
          total,
          order_type: 'store', // ✅ FIX
          delivery_mode: deliveryMode,
          item_count: totalItems,
          address: addressText, // ✅ FIX
          area: 'Whitefield',
          items,
          instructions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Order failed');
      }

      await supabase.from('cart').delete().eq('user_id', userId);

      toast.success(`Order placed 🎉`);

      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed');
    } finally {
      setPlacing(false);
    }
  };

  return {
    items,
    addresses,
    selectedAddress,
    userId,
    setSelectedAddress,
    setDeliveryMode,
    setInstructions,
    deliveryMode,
    instructions,
    placing,
    loaded,
    subtotal,
    total,
    totalItems,
    deliveryFee,
    updateQty,
    handlePlaceOrder,
    seller,
  };
};