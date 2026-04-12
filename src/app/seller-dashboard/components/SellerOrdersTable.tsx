'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

type OrderStatus =
  | 'placed'
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'rejected';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  address?: string;
  payment_mode?: string;
  order_items?: OrderItem[];
  customer_name?: string;
  customer_phone?: string;
}

type Props = {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function SellerOrdersTable({ orders, setOrders }: Props) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [highlighted, setHighlighted] = useState<string | null>(null);

useEffect(() => {
  const channel = supabase
    .channel('orders-realtime')
    .on(
      'postgres_changes',
      {
        event: '*', // listen to INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'orders',
      },
      async (payload) => {
        console.log('Realtime change:', payload);

        // 🔥 Fetch latest orders
        const { data } = await supabase
          .from('orders')
          .select(`*, order_items (*)`)
          .order('created_at', { ascending: false });

        if (data) {
          setOrders(data);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter(
          (o) => o.status?.toLowerCase() === statusFilter.toLowerCase()
        );


const getStatusStyle = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-50 border-l-4 border-yellow-400';
    case 'accepted':
      return 'bg-blue-50 border-l-4 border-blue-400';
    case 'preparing':
      return 'bg-orange-50 border-l-4 border-orange-400';
    case 'ready':
      return 'bg-purple-50 border-l-4 border-purple-400';
    case 'delivered':
      return 'bg-green-50 border-l-4 border-green-500';
    case 'rejected':
      return 'bg-red-50 border-l-4 border-red-500';
    case 'cancelled':
      return 'bg-gray-100 border-l-4 border-gray-400';
    default:
      return '';
  }
};

const handleStatusChange = async (id: string, newStatus: string) => {
  // 🔥 1. Optimistic UI update
  setOrders((prev) =>
    prev.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    )
  );

  try {
    // 🔥 2. CALL BACKEND API (IMPORTANT CHANGE)
    const res = await fetch('/api/admin/orders/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: id,
        status: newStatus
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Update failed');
    }

    toast.success(`Order ${newStatus}`);

  } catch (error) {
    console.error(error);
    toast.error('Failed to update');

    // 🔥 rollback
    const { data } = await supabase
      .from('orders')
      .select(`*, order_items (*)`)
      .order('created_at', { ascending: false });

    if (data) setOrders(data);
  }
};

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b">
        <h2 className="font-semibold text-lg">Orders</h2>

        {/* Filters */}
        <div className="flex gap-2 mt-3">
          {['all', 'pending', 'accepted', 'preparing', 'ready', 'delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 text-sm rounded ${
                statusFilter === tab
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="p-4 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No orders yet
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order.id;

            return (
  <div
    key={order.id}
    className={`p-4 ${getStatusStyle(order.status)}`}
    >
    {/* Top row */}
    <div className="flex justify-between items-start">
  {/* LEFT SIDE */}
  <div>
    {/* ✅ Order ID */}
    <p className="font-semibold">
      Order #{order.id.slice(-5).toUpperCase()}
    </p>
  
    {/* ✅ Item Preview (VERY IMPORTANT) */}
    {order.order_items && order.order_items.length > 0 && (
      <p className="text-sm text-gray-600 mt-1">
        {order.order_items?.[0]?.name} × {order.order_items?.[0]?.qty}
        {(order.order_items?.length || 0) > 1 &&
  ` +${(order.order_items?.length || 0) - 1} more`}
      </p>
    )}

    {/* ✅ Price */}
    <p className="text-sm text-gray-500 mt-1">
      ₹{order.total}
    </p>

    {/* ✅ Time */}
    <p className="text-xs text-gray-400">
      {new Date(order.created_at).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric',
      })}
    </p>
  </div>

  {/* ✅ RIGHT SIDE STATUS BADGE */}
  <span
    className={`px-3 py-1 text-xs font-bold rounded-full ${
      order.status === 'delivered'
        ? 'bg-green-100 text-green-700'
        : order.status === 'rejected'
        ? 'bg-red-100 text-red-700'
        : order.status === 'cancelled'
        ? 'bg-gray-200 text-gray-600'
        : order.status === 'preparing'
        ? 'bg-orange-100 text-orange-700'
        : order.status === 'ready'
        ? 'bg-purple-100 text-purple-700'
        : order.status === 'accepted'
        ? 'bg-blue-100 text-blue-700'
        : 'bg-yellow-100 text-yellow-700'
    }`}
  >
    {order.status}
  </span>
</div>
                
{/* ACTION BUTTONS */}
<div className="flex gap-2 flex-wrap mt-3">
  {(order.status === 'placed' || order.status === 'pending') && (
    <>
      <button
        onClick={() => handleStatusChange(order.id, 'accepted')}
        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
      >
        Accept
      </button>

      <button
        onClick={() => handleStatusChange(order.id, 'rejected')}
        className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm"
      >
        Reject
      </button>
    </>
  )}

  {order.status === 'accepted' && (
    <button
      onClick={() => handleStatusChange(order.id, 'preparing')}
      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
    >
      Start Preparing
    </button>
  )}

  {order.status === 'preparing' && (
    <button
      onClick={() => handleStatusChange(order.id, 'ready')}
      className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
    >
      Mark Ready
    </button>
  )}

  {order.status === 'ready' && (
    <button
      onClick={() => handleStatusChange(order.id, 'out_for_delivery')}
      className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
    >
      Out for Delivery
    </button>
  )}

  {order.status === 'out_for_delivery' && (
    <button
      onClick={() => handleStatusChange(order.id, 'delivered')}
      className="bg-green-700 text-white px-3 py-1 rounded text-sm"
    >
      Delivered
    </button>
  )}

  <button
    onClick={() =>
      setExpandedOrder(isExpanded ? null : order.id)
    }
  >
    <ChevronDown
      size={16}
      className={`transition ${
        isExpanded ? 'rotate-180' : ''
      }`}
    />
  </button>
</div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="mt-3 bg-gray-50 p-3 rounded">
                    {/* Items */}
                    <div className="space-y-1">
                      {/* Items */}
{order.order_items?.map((item) => (
  <div
    key={item.id}
    className="flex justify-between text-sm"
  >
    <span>
      {item.name} × {item.qty}
    </span>

    <span>
      ₹{(item.price || 0) * (item.qty || 0)}
    </span>
  </div>
))}

{/* ✅ Customer Info (OUTSIDE LOOP) */}
{order.customer_name && (
  <p className="text-sm text-gray-700 mt-2">
    👤 {order.customer_name}
  </p>
)}

{order.customer_phone && (
  <p className="text-sm text-gray-600">
    📞 {order.customer_phone}
  </p>
)}
                    </div>

                    {/* Address */}
                    {order.address && (
                      <p className="text-xs mt-2 text-gray-600">
                        📍 {order.address}
                      </p>
                    )}

                    {/* Payment */}
                    {order.payment_mode && (
                      <p className="text-xs text-gray-500">
                        Payment: {order.payment_mode}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}