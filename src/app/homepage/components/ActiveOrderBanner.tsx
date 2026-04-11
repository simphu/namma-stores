'use client';

import React, { useState, useEffect } from 'react';
import { Package, ChevronRight, X, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const ORDER_STAGES = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready',
  'Out for Delivery',
  'Delivered',
];

function getMinutesAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  return Math.floor(diff / 60000);
}

function mapStatus(status: string) {
  switch (status) {
    case 'pending':
    case 'placed':
      return 'Pending';
    case 'accepted':
      return 'Confirmed';
    case 'preparing':
      return 'Preparing';
    case 'ready':
      return 'Ready';
    case 'out_for_delivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    default:
      return 'Pending';
  }
}

export default function ActiveOrderBanner() {
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();


const [order, setOrder] = useState<any>(null);
useEffect(() => {
  const fetchLatestOrder = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .neq('status', 'delivered')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
  console.error('Banner fetch error:', error);
  return;
}

    if (data) {
      setOrder({
        id: data.id.slice(-6).toUpperCase(),
        store: data.shop_name || "Namma Fresh",
        amount: data.total,
        status: mapStatus(data.status),
        placedMinutesAgo: getMinutesAgo(data.created_at),
      });
    }
  };

  fetchLatestOrder();

  // 🔥 REALTIME
  const channel = supabase
    .channel('banner-orders')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
      },
      () => {
        fetchLatestOrder();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  const currentStage = order ? ORDER_STAGES.indexOf(order.status) : 0;

  if (!order || dismissed || order.status === 'Delivered') return null;

  // ✅ Better status message
  const getStatusMessage = () => {
    switch (order.status) {
      case 'Confirmed':
        return 'Order received';
      case 'Preparing':
        return 'Being prepared';
      case 'Ready':
        return 'Ready for pickup';
      case 'Out for Delivery':
        return 'On the way';
      case 'Delivered':
        return 'Delivered';
      default:
        return order.status;
    }
  };
  

  return (
    <div className="mx-4 mt-4 lg:mx-8 animate-fade-in">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute right-8 bottom-0 w-20 h-20 bg-white/10 rounded-full translate-y-6"></div>

        {/* Close button
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
        >
          <X size={14} />
        </button> */}

        <div className="flex items-start gap-3 relative">
          {/* Icon */}
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package size={20} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">
  {order.store}
</p>

<p className="text-xs text-orange-100 mb-3">
  ₹{order.amount} · {getStatusMessage()}
</p>

            {/* Progress Stepper */}
            <div className="flex items-center gap-1">
              {ORDER_STAGES.map((stage, idx) => (
                <React.Fragment key={stage}>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        idx < currentStage
                          ? 'bg-white'
                          : idx === currentStage
                          ? 'bg-white ring-2 ring-white/40'
                          : 'bg-white/30'
                      }`}
                    >
                      {idx < currentStage ? (
                        <svg
                          className="w-3 h-3 text-orange-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <div
                          className={`w-2 h-2 rounded-full ${
                            idx === currentStage ? 'bg-orange-500' : 'bg-white/40'
                          }`}
                        ></div>
                      )}
                    </div>

                    <span
                      className={`text-[9px] font-body whitespace-nowrap ${
                        idx <= currentStage ? 'text-white' : 'text-orange-200'
                      }`}
                    >
                      {stage}
                    </span>
                  </div>

                  {idx < ORDER_STAGES.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mb-4 ${
                        idx < currentStage ? 'bg-white' : 'bg-white/30'
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Track Order Button */}
        <button
          onClick={() => router.push(`/orders`)}
          className="mt-3 flex items-center gap-1 text-xs font-display font-600 text-white/90 hover:text-white transition-colors relative"
        >
          <Clock size={12} />
          Track your order
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}