'use client';
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

const salesData = [
  { day: 'Mon', orders: 18, revenue: 6240 },
  { day: 'Tue', orders: 24, revenue: 8910 },
  { day: 'Wed', orders: 21, revenue: 7650 },
  { day: 'Thu', orders: 29, revenue: 10340 },
  { day: 'Fri', orders: 35, revenue: 12800 },
  { day: 'Sat', orders: 42, revenue: 15600 },
  { day: 'Sun', orders: 38, revenue: 13900 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-lg">
        <p className="text-xs font-display font-700 text-stone-700 mb-1">{label}</p>
        <p className="text-sm font-display font-700 text-orange-600 tabular-nums">₹{payload[0]?.value?.toLocaleString('en-IN')}</p>
        <p className="text-xs text-stone-500 font-body tabular-nums">{salesData.find(d => d.day === label)?.orders} orders</p>
      </div>
    );
  }
  return null;
};

export default function SellerSalesChart() {
  const today = 'Wed';

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-700 text-sm text-stone-800">Weekly Revenue</h3>
          <p className="text-xs text-stone-500 font-body mt-0.5">Mon – Sun this week</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-display font-700 text-stone-900 tabular-nums">₹75,440</p>
          <p className="text-xs text-green-600 font-body">↑ 18% vs last week</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={salesData} barSize={24} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#78716c' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fontFamily: 'DM Sans', fill: '#a8a29e' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fafaf9', radius: 6 }} />
          <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
            {salesData.map((entry) => (
              <Cell
                key={`cell-${entry.day}`}
                fill={entry.day === today ? '#f97316' : '#fed7aa'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}