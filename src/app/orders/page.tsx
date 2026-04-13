'use client';

import React, { useEffect, useState,useRef } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, ShoppingBag, ChefHat, Bell, Ban } from 'lucide-react';
import CustomerHeader from '@/components/CustomerHeader';
import BottomTabBar from '@/app/homepage/components/BottomTabBar';
import { supabase } from '@/lib/supabase';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  shopName: string;
  image?: string;
}

interface Order {
  id: string;
  _id?: string;
  items: OrderItem[];
  total: number;
  status:
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';
  shopName: string;
  createdAt: string;
}

const STATUS_FLOW = [
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

const STATUS_CONFIG: Record<Order['status'], { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  accepted: { label: 'Accepted', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  preparing: { label: 'Preparing', icon: ChefHat, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  ready: { label: 'Ready', icon: Bell, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  out_for_delivery: {
  label: 'Out for Delivery',
  icon: ShoppingBag,
  color: 'text-indigo-600',
  bg: 'bg-indigo-50',
  border: 'border-indigo-200',
},
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
};

const STATUS_FLOW_INDEX = {
  pending: 0,
  accepted: 1,
  preparing: 2,
  ready: 3,
  out_for_delivery: 4,
  delivered: 5,
  cancelled:0,
};

function OrderCard({ order, onCancel }: { order: Order; onCancel: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG['pending'];
  const StatusIcon = status.icon;
  const date = new Date(order.createdAt);
  const formattedDate = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const orderId = String(order?.id || order?._id || '000000').slice(-6).toUpperCase();
  const isCancelled = order.status === 'cancelled';
  const isPending = order.status === 'pending';
  const currentStep = STATUS_FLOW_INDEX[order.status] ?? 0;

  const handleCancel = () => {
    setCancelling(true);
    setTimeout(() => {
      onCancel(order.id || order._id || '');
      setCancelling(false);
    }, 300);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-stone-800 text-sm truncate">{order.shopName}</p>
            <p className="text-xs text-stone-400 mt-0.5">{formattedDate} · {formattedTime}</p>
            <p className="text-xs text-stone-500 mt-0.5">Order #{orderId}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${status.bg} ${status.border} flex-shrink-0`}>
            <StatusIcon size={12} className={status.color} />
            <span className={`text-xs font-semibold ${status.color}`}>{status.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3">
  <img
  src={order.items?.[0]?.image || "/placeholder.png"}
    className="w-12 h-12 rounded-lg object-cover"
  />

  <div className="flex-1">
    <p className="text-sm font-medium text-stone-800">
      {order.items?.[0]?.name || "Item"}
    </p>
    <p className="text-xs text-stone-400">
      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
    </p>
  </div>

  <p className="font-bold text-stone-800">
    ₹{order.total.toFixed(2)}
  </p>
</div>
      </div>

      {/* Status progress bar (only for non-cancelled orders) */}
      {!isCancelled && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-0">
            {STATUS_FLOW.map((step, idx) => {
              const isCompleted = currentStep > idx;
              const isActive = currentStep === idx;
              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${
                        isCompleted
                          ? 'bg-orange-500 border-orange-500'
                          : isActive
                          ? 'bg-white border-orange-500 ring-2 ring-orange-200' :'bg-white border-stone-300'
                      }`}
                    />
                    <span
                      className={`text-[9px] mt-1 font-medium whitespace-nowrap ${
                        isActive ? 'text-orange-600' : isCompleted ? 'text-orange-400' : 'text-stone-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < STATUS_FLOW.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mb-3 transition-all ${
                        currentStep > idx ? 'bg-orange-400' : 'bg-stone-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Cancel button for pending orders */}
      {isPending && (
        <div className="px-4 pb-4">
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-60"
          >
            <Ban size={13} />
            {cancelling ? 'Cancelling…' : 'Cancel Order'}
          </button>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1 py-2 border-t border-stone-100 text-xs font-semibold text-stone-500 hover:bg-stone-50 transition-colors"
      >
        {expanded ? 'Hide items' : 'View items'}
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {/* Items list */}
      {expanded && (
        <div className="border-t border-stone-100 divide-y divide-stone-100">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {item.qty}
                </span>
                <span className="text-sm text-stone-700">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-stone-700">₹{(item.price * item.qty).toFixed(2)}</span>
                {item.qty > 1 && (
                  <p className="text-[10px] text-stone-400">₹{item.price.toFixed(2)} each</p>
                )}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-2.5 bg-stone-50">
            <span className="text-xs font-semibold text-stone-500">Order Total</span>
            <span className="text-sm font-bold text-orange-600">₹{order.total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'history'>('all');
  const lastStatusRef = React.useRef<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const prevOrderIdsRef = useRef<string[]>([]);
  



useEffect(() => {
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    console.log("Orders from DB:", data);

    if (error) {
      console.error('Error fetching orders:', error);
      return;
    }

    if (data) {
      const formatted = data.map((o: any) => ({
        id: o.id,
        items: o.order_items?.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
        })) || [],
        total: o.total,
        status: o.status,
        shopName: o.shop_name || "Namma Fresh",
        createdAt: o.created_at,
        instructions: o.instructions,
      }));

      const currentIds = formatted.map((o) => o.id);

      // 🔥 NEW ORDER SOUND
      const hasNewOrder = currentIds.some(
        (id) => !prevOrderIdsRef.current.includes(id)
      );

      if (prevOrderIdsRef.current.length > 0 && hasNewOrder) {
        toast.success('New order placed 🛒');

        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {});
      }

      // 🔔 STATUS CHANGE
      formatted.forEach((order) => {
        const prevStatus = lastStatusRef.current[order.id];

        if (prevStatus && prevStatus !== order.status) {
          toast.success('Order Updated', {
            description: `Now: ${order.status}`,
          });
        }

        lastStatusRef.current[order.id] = order.status;
      });

      prevOrderIdsRef.current = currentIds;

      setOrders(formatted);
      setLoaded(true); // ✅ IMPORTANT FIX
    }
  };

  fetchOrders();

  const channel = supabase
    .channel('orders-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
      },
      () => {
        fetchOrders();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

useEffect(() => {
  const interval = setInterval(() => {
    console.log("Backup polling...");
    
    // call same fetch logic
    supabase
      .from('orders')
      .select(`*, order_items (*)`)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!data) return;

        const formatted = data.map((o: any) => ({
          id: o.id,
          items: o.order_items || [],
          total: o.total,
          status: o.status,
          shopName: o.shop_name || "Namma Fresh",
          createdAt: o.created_at,
        }));

        setOrders(formatted);
      });

  }, 2000); // ⏱ every 2 sec

  return () => clearInterval(interval);
}, []);


  const filteredOrders = orders.filter(order => {
  if (filter === 'active') {
    return order.status !== 'delivered' && order.status !== 'cancelled';
  }
  if (filter === 'history') {
    return order.status === 'delivered' || order.status === 'cancelled';
  }
  return true;
});

const handleCancel = async (orderId: string) => {
  const { error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', orderId);

  if (error) {
    console.error(error);
    toast.error("Failed to cancel order");
  } else {
    toast.success("Order cancelled");
  }
};

  return (
    <div className="min-h-screen bg-stone-50">
      <main className="max-w-screen-sm mx-auto px-4 pt-4 pb-28">
        {/* Page title */}
        <div className="flex items-center gap-3 mb-5">
          <Link
            href="/homepage"
            className="p-2 rounded-xl hover:bg-stone-100 transition-colors text-stone-600"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-bold text-xl text-stone-800">My Orders</h1>
            <p className="text-xs text-stone-400">Your order history</p>
          </div>
        </div>

        {/* Content */}
        {!loaded ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-200 h-32 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-5">
              <ShoppingBag size={40} className="text-orange-300" />
            </div>
            <h2 className="font-bold text-stone-700 text-lg mb-2">No orders yet</h2>
            <p className="text-sm text-stone-400 mb-6 max-w-xs">
              Looks like you haven't placed any orders. Start exploring shops and order something delicious!
            </p>
            <Link
              href="/homepage"
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
          <div className="flex gap-2 mb-4">
  {[
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'history', label: 'History' }
  ].map(btn => (
    <button
      key={btn.key}
      onClick={() => setFilter(btn.key as any)}
      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
        filter === btn.key
          ? 'bg-black text-white'
          : 'bg-stone-100 text-stone-600'
      }`}
    >
      {btn.label}
    </button>
  ))}
</div>
           <p className="text-xs text-stone-400 mb-1">
  {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
</p>

{filteredOrders.map((order) => (
  <OrderCard
    key={order.id || order._id}
    order={order}
    onCancel={handleCancel}
  />
))}
          </div>
        )}
      </main>

      <BottomTabBar cartCount={0} onCartOpen={() => {}} />
    </div>
  );
}
