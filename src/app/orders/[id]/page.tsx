'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface OrderItem {
  id: number;
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  storeName: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  date: string;
}

const STATUS_STEPS = [
  'accepted',
  'Preparing',
  'Ready',
  'Out for Delivery',
  'Delivered',
];

function getStatusIndex(status?: string): number {
  if (!status) return 0;

  return STATUS_STEPS.findIndex(
    (s) => s.toLowerCase() === status.toLowerCase()
  );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const currentStatusIndex = order ? getStatusIndex(order?.status) : 0;

useEffect(() => {
  if (!orderId) return;

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // 🔥 Format data to match your UI
    const formatted = {
      id: data.id,
      storeName: data.shop_name || "Namma Fresh",
      totalAmount: data.total,
      status: data.status,
      date: new Date(data.created_at).toLocaleString(),
      items: data.order_items.map((item: any) => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
    };

    setOrder(formatted);
    setLoading(false);
  };

  // 🔹 Initial load
  fetchOrder();

  // 🚀 REALTIME SUBSCRIPTION
  const channel = supabase
    .channel('order-details-live')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`, // 🎯 VERY IMPORTANT
      },
      () => {
        fetchOrder(); // instant update
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [orderId]);

  if (loading) return <div className="p-4">Loading order...</div>;
  if (!order) return <div className="p-4">Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            <h1 className="text-lg font-semibold">Order Details</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Summary */}
        <div className="bg-white rounded-2xl p-5">
          <h2 className="text-sm font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Order ID</span>
              <span>#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Store</span>
              <span>{order.storeName}</span>
            </div>
            <div className="flex justify-between">
              <span>Date</span>
              <span>{order.date}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-green-600">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl p-5">
          <h2 className="text-sm font-semibold mb-5">Order Status</h2>

          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;

            return (
              <div key={step} className="flex items-center gap-3 mb-4">
                <div
                  className={`w-4 h-4 rounded-full ${
                    isCurrent
                      ? 'bg-green-500'
                      : isCompleted
                      ? 'bg-green-400'
                      : 'bg-gray-300'
                  }`}
                />
                <span className={isCurrent ? 'text-green-600' : ''}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* 🔥 Seller Simulation */}
        <div className="bg-white rounded-2xl p-4">
          <p className="text-sm font-semibold mb-2">Seller Test Panel</p>

          <div className="flex gap-2 flex-wrap">
            {STATUS_STEPS.map((status) => (
              <button
                key={status}
               onClick={async () => {
  await fetch(`/api/orders/${order.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  // ✅ instant refresh
  const res = await fetch(`/api/orders/${order.id}`);
  const data = await res.json();
  setOrder(data);
}}
                className="px-3 py-1 text-xs bg-gray-100 rounded"
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl p-5">
          <h2 className="text-sm font-semibold mb-4">Items</h2>

{order?.items?.map((item) => (
  <div key={item.id} className="flex justify-between mb-2">
    <div>
      {item.name}
      <div className="text-xs text-gray-400">
        Qty: {item.qty}
      </div>
    </div>
    <span>₹{(item.price || 0) * (item.qty || 0)}</span>
  </div>
))}
        </div>

      </div>
    </div>
  );
}