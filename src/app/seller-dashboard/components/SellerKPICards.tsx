'use client';
import React from 'react';
import { ShoppingBag, IndianRupee, Clock, Package, TrendingUp } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const kpis = [
  {
    id: 'kpi-orders-today',
    label: "Today\'s Orders",
    value: '23',
    sub: '↑ 4 more than yesterday',
    trend: 'up',
    icon: ShoppingBag,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    cardBg: 'bg-white',
    border: 'border-stone-200',
  },
  {
    id: 'kpi-revenue',
    label: "Today\'s Revenue",
    value: '₹8,420',
    sub: '↑ 12% vs yesterday',
    trend: 'up',
    icon: IndianRupee,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    cardBg: 'bg-white',
    border: 'border-stone-200',
  },
  {
    id: 'kpi-pending',
    label: 'Pending Orders',
    value: '3',
    sub: 'Awaiting acceptance',
    trend: 'alert',
    icon: Clock,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    cardBg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    id: 'kpi-products',
    label: 'Active Products',
    value: '47',
    sub: '2 out of stock',
    trend: 'neutral',
    icon: Package,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    cardBg: 'bg-white',
    border: 'border-stone-200',
  },
];

export default function SellerKPICards() {
  return (
    <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis?.map(kpi => {
        const Icon = kpi?.icon;
        return (
          <div key={kpi?.id} className={`${kpi?.cardBg} rounded-2xl border ${kpi?.border} p-4 shadow-card`}>
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 ${kpi?.iconBg} rounded-xl flex items-center justify-center`}>
                <Icon size={18} className={kpi?.iconColor} />
              </div>
              {kpi?.trend === 'up' && <TrendingUp size={14} className="text-green-500 mt-1" />}
              {kpi?.trend === 'alert' && (
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse-soft mt-1.5"></span>
              )}
            </div>
            <p className="mt-3 text-2xl font-display font-700 text-stone-900 tabular-nums">{kpi?.value}</p>
            <p className="text-xs font-display font-600 text-stone-600 mt-0.5">{kpi?.label}</p>
            <p className={`text-xs font-body mt-1 ${
              kpi?.trend === 'up' ? 'text-green-600' : kpi?.trend === 'alert' ? 'text-amber-600' : 'text-stone-500'
            }`}>{kpi?.sub}</p>
          </div>
        );
      })}
    </div>
  );
}