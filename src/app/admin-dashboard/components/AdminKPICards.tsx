'use client';
import React from 'react';
import {
  IndianRupee,
  ShoppingBag,
  Store,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users
} from 'lucide-react';

type Props = {
  data: any;
  loading: boolean;
};

export default function AdminKPICards({ data, loading }: Props) {

  // ✅ Loading state
  if (loading) {
    return <div className="mt-6">Loading KPIs...</div>;
  }

  // ✅ IMPORTANT: kpis INSIDE component
  const kpis = [
    {
      id: 'gmv',
      label: 'Platform GMV Today',
      value: `₹${data?.gmvToday || 0}`,
      sub: 'Today revenue',
      trend: 'up',
      icon: IndianRupee,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      cardBg: 'bg-white',
      border: 'border-stone-200',
    },
    {
      id: 'orders',
      label: 'Total Orders Today',
      value: data?.totalOrders || 0,
      sub: 'Orders placed',
      trend: 'up',
      icon: ShoppingBag,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      cardBg: 'bg-white',
      border: 'border-stone-200',
    },
    {
      id: 'sellers',
      label: 'Active Sellers',
      value: data?.activeSellers || 0,
      sub: 'Currently active',
      trend: 'neutral',
      icon: Store,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      cardBg: 'bg-white',
      border: 'border-stone-200',
    },
    {
      id: 'pending',
      label: 'Pending Approvals',
      value: data?.pendingApprovals || 0,
      sub: 'Awaiting approval',
      trend: 'alert',
      icon: Clock,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      cardBg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      id: 'customers',
      label: 'Active Customers',
      value: data?.activeCustomers || 0,
      sub: 'Using platform',
      trend: 'up',
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      cardBg: 'bg-white',
      border: 'border-stone-200',
    },
    {
  id: 'aov',
  label: 'Avg Order Value',
  value: `₹${data?.aov || 0}`,
  sub: 'Per order revenue',
  trend: 'neutral',
  icon: IndianRupee,
  iconBg: 'bg-indigo-100',
  iconColor: 'text-indigo-600',
  cardBg: 'bg-white',
  border: 'border-stone-200',
},
{
  id: 'cancel-rate',
  label: 'Cancellation Rate',
  value: `${data?.cancellationRate || 0}%`,
  sub: 'Order cancellations',
  trend: 'alert',
  icon: AlertTriangle,
  iconBg: 'bg-red-100',
  iconColor: 'text-red-600',
  cardBg: 'bg-white',
  border: 'border-stone-200',
},
{
  id: 'completed',
  label: 'Completed Orders',
  value: data?.completedOrders || 0,
  sub: 'Successfully delivered',
  trend: 'up',
  icon: ShoppingBag,
  iconBg: 'bg-green-100',
  iconColor: 'text-green-600',
  cardBg: 'bg-white',
  border: 'border-stone-200',
},
{
  id: 'failed',
  label: 'Failed Orders',
  value: data?.failedOrders || 0,
  sub: 'Delivery failures',
  trend: 'alert',
  icon: AlertTriangle,
  iconBg: 'bg-red-100',
  iconColor: 'text-red-600',
  cardBg: 'bg-white',
  border: 'border-stone-200',
},
  ];

  return (
    <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.id} className={`${kpi.cardBg} rounded-2xl border ${kpi.border} p-4 shadow-card`}>
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 ${kpi.iconBg} rounded-xl flex items-center justify-center`}>
                <Icon size={18} className={kpi.iconColor} />
              </div>

              {kpi.trend === 'up' && <TrendingUp size={14} className="text-green-500 mt-1" />}
              {kpi.trend === 'down' && <TrendingDown size={14} className="text-red-500 mt-1" />}
              {kpi.trend === 'alert' && (
                <AlertTriangle size={14} className="text-amber-500 mt-1 animate-pulse-soft" />
              )}
            </div>

            <p className="mt-3 text-2xl font-display font-700 text-stone-900 tabular-nums">
              {kpi.value}
            </p>
            <p className="text-xs font-display font-600 text-stone-600 mt-0.5">
              {kpi.label}
            </p>
            <p
              className={`text-xs font-body mt-1 ${
                kpi.trend === 'up'
                  ? 'text-green-600'
                  : kpi.trend === 'alert'
                  ? 'text-amber-600'
                  : 'text-stone-500'
              }`}
            >
              {kpi.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}