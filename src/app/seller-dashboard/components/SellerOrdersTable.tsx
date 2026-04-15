'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
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
  order_items?: OrderItem[];
  customer_name?: string;
  customer_phone?: string;
  instructions?: string;
}

type Props = {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function SellerOrdersTable({ orders, setOrders }: Props) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');

  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        async () => {
          const { data } = await supabase
            .from('orders')
            .select(`*, order_items (*)`)
            .order('created_at', { ascending: false });

          if (data) setOrders(data);
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
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: newStatus } : o
      )
    );

    try {
      const res = await fetch('/api/admin/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id, status: newStatus }),
      });

      if (!res.ok) throw new Error();

      toast.success(`Order ${newStatus}`);
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="bg-white rounded-2xl border shadow-card">
      {/* HEADER */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Orders</h2>

        <div className="flex gap-2 mt-3">
          {['all', 'pending', 'accepted', 'preparing', 'ready', 'delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 text-sm rounded ${
                statusFilter === tab
                  ? 'bg-black text-white'
                  : 'bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS */}
      <div className="p-4 space-y-4">
        {filteredOrders.map((order) => {
          const isExpanded = expandedOrder === order.id;

          return (
            <div
              key={order.id}
              className={`p-4 rounded-xl border shadow-sm ${getStatusStyle(order.status)}`}
            >
              {/* TOP */}
              <div className="flex justify-between">
                {/* LEFT */}
                <div>
                  <p className="font-semibold">
                    Order #{order.id.slice(-5).toUpperCase()}
                  </p>

                  {/* ITEM */}
{Array.isArray(order.order_items) && order.order_items.length > 0 && (
  <div className="mt-1 space-y-1">
    {order.order_items.map((item, index) => (
      <p key={index} className="text-sm font-medium text-stone-800">
        {item.name} × {item.qty}
      </p>
    ))}
  </div>
)}

                  {/* NOTE */}
                  {order.instructions && (
                    <p className="text-orange-600 text-xs mt-1">
                      📝 {order.instructions}
                    </p>
                  )}

                  {/* TIME */}
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleString('en-IN')}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded">
                    {order.status}
                  </span>

                  <p className="font-semibold mt-2">
                    ₹{order.total}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
<div className="flex justify-between items-center mt-3 flex-wrap gap-2">

  <div className="flex gap-2 flex-wrap">

    {/* PENDING */}
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

    {/* ACCEPTED */}
    {order.status === 'accepted' && (
      <button
        onClick={() => handleStatusChange(order.id, 'preparing')}
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
      >
        Start Preparing
      </button>
    )}

    {/* PREPARING */}
    {order.status === 'preparing' && (
      <button
        onClick={() => handleStatusChange(order.id, 'ready')}
        className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
      >
        Mark Ready
      </button>
    )}

    {/* READY */}
    {order.status === 'ready' && (
      <button
        onClick={() => handleStatusChange(order.id, 'out_for_delivery')}
        className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
      >
        Out for Delivery
      </button>
    )}

    {/* OUT FOR DELIVERY */}
    {order.status === 'out_for_delivery' && (
      <button
        onClick={() => handleStatusChange(order.id, 'delivered')}
        className="bg-green-700 text-white px-3 py-1 rounded text-sm"
      >
        Delivered
      </button>
    )}

  </div>

  {/* DROPDOWN */}
  <button
    onClick={() =>
      setExpandedOrder(isExpanded ? null : order.id)
    }
    className="text-gray-600"
  >
    <ChevronDown
      size={18}
      className={`transition ${isExpanded ? 'rotate-180' : ''}`}
    />
  </button>

</div>

              {/* EXPANDED */}
              {isExpanded && (
                <div className="mt-3 bg-gray-50 p-3 rounded">
Customer Information 
                  {/* CUSTOMER */}
                  <div className="mt-3 border-t pt-2">
                    <p>👤 {order.customer_name}</p>
                    <p>📞 {order.customer_phone}</p>
                    <p>📍 {order.address}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}