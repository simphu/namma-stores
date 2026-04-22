'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type DeliveryMode = 'delivery' | 'pickup';
type PaymentMode = 'cod' | 'online';

export const useCheckout = () => {
  const [items, setItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('delivery');
  const [paymentMode, setPaymentMode] = useState<'online'>('online');
  const [instructions, setInstructions] = useState('');
  const [seller, setSeller] = useState<any>(null);
  const [placing, setPlacing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  // 🔥 INIT
  useEffect(() => {
  const init = async () => {
    const { data } = await supabase.auth.getUser();
    const uid = data.user?.id || null;

    setUserId(uid);

    if (uid) {
      await fetchCart(uid); // ✅ PASS UID
      await fetchAddresses(uid);
    }

    setLoaded(true);
  };

  init();
}, []);

  const fetchSeller = async (sellerId: string) => {
  const { data } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', sellerId)
    .single();

  setSeller(data);
};

  // 🔥 FETCH CART
  const fetchCart = async (uid: string) => {
  const { data } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: true });

  const formatted = (data || []).map((item) => ({
    id: item.product_id,
    name: item.product_name,
    price: Number(item.price) || 0,
    qty: Number(item.quantity) || 0,
    shopId: item.seller_id,
    shopName: item.shop_name,
    image: item.product_image,
  }));

  setItems(formatted);

  if (data?.length) {
    await fetchSeller(data[0].seller_id);
  }
};

  // 🔥 FETCH ADDRESS
  const fetchAddresses = async (uid: string | null) => {
    if (!uid) return;

    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', uid);

    setAddresses(data || []);

    if (data?.length) {
      setSelectedAddress(data[0].id);
    }
  };

  // 🔥 ADD ADDRESS
  const handleAddAddress = async () => {
    if (!userId) {
      alert('Login required');
      return;
    }

    const label = prompt('Enter address name');
    const address = prompt('Enter full address');

    if (!label || !address) return;

    const { data } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        label,
        address,
      })
      .select()
      .single();

    setAddresses((prev) => [...prev, data]);
    setSelectedAddress(data.id);
  };

  // 🔥 UPDATE QTY
  const updateQty = async (id: string, qty: number) => {
  if (!userId) return;

  if (qty <= 0) {
    await supabase
      .from('cart')
      .delete()
      .eq('product_id', id)
      .eq('user_id', userId); // ✅ FIX
  } else {
    await supabase
      .from('cart')
      .update({ quantity: qty })
      .eq('product_id', id)
      .eq('user_id', userId); // ✅ FIX
  }

  fetchCart(userId);
};

  // 🔥 CALCULATIONS
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const deliveryFee =
    deliveryMode === 'delivery' ? (subtotal > 299 ? 0 : 25) : 0;
  const total = subtotal + deliveryFee;

  // 🔥 PLACE ORDER
  const handlePlaceOrder = async () => {
    if (!userId) {
      alert('Login required');
      return;
    }

    setPlacing(true);

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          seller_id: items[0]?.shopId,
          total,
          order_type: 'store',
          delivery_mode: deliveryMode,
          item_count: totalItems,
          address: 'Whitefield',
          area: 'Whitefield',
          items,
          instructions,
        }),
      });

      const data = await res.json();

      if (data.success) {
        await supabase.from('cart').delete();
        toast.success('Order placed 🎉');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed');
    } finally {
      setPlacing(false);
    }
  };

  return {
    // data
    items,
    addresses,
    selectedAddress,
    userId,

    // setters
    setSelectedAddress,
    setDeliveryMode,
    setPaymentMode,
    setInstructions,

    // states
    deliveryMode,
    paymentMode,
    instructions,
    placing,
    loaded,

    // calculations
    subtotal,
    total,
    totalItems,
    deliveryFee,

    // actions
    handleAddAddress,
    updateQty,
    handlePlaceOrder,
    seller,
  };
};