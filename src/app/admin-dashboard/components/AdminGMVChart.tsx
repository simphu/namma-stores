'use client';
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weeklyData = [
  { date: '26 Mar', gmv: 98400, orders: 289, sellers: 35 },
  { date: '27 Mar', gmv: 112600, orders: 318, sellers: 36 },
  { date: '28 Mar', gmv: 87300, orders: 261, sellers: 34 },
  { date: '29 Mar', gmv: 134200, orders: 378, sellers: 38 },
  { date: '30 Mar', gmv: 119800, orders: 342, sellers: 37 },
  { date: '31 Mar', gmv: 156400, orders: 421, sellers: 40 },
  { date: '1 Apr', gmv: 124680, orders: 347, sellers: 38 },
];

const monthlyData = [
  { date: 'Week 1', gmv: 624000, orders: 1820, sellers: 32 },
  { date: 'Week 2', gmv: 718000, orders: 2140, sellers: 35 },
  { date: 'Week 3', gmv: 683000, orders: 1980, sellers: 36 },
  { date: 'Week 4', gmv: 792000, orders: 2310, sellers: 38 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-lg min-w-[160px]">
        <p className="text-xs font-display font-700 text-stone-600 mb-2">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <div key={`tt-entry-${idx}`} className="flex items-center justify-between gap-4 mb-1">
            <span className="text-xs font-body text-stone-500 capitalize">{entry.name}</span>
            <span className="text-xs font-display font-700 tabular-nums" style={{ color: entry.color }}>
              {entry.name === 'gmv' ? `₹${entry.value.toLocaleString('en-IN')}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminGMVChart() {
  const [range, setRange] = useState<'week' | 'month'>('week');
  const data = range === 'week' ? weeklyData : monthlyData;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-700 text-base text-stone-800">Platform GMV Trend</h3>
          <p className="text-xs text-stone-500 font-body mt-0.5">Gross merchandise value across all sellers</p>
        </div>
        <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
          {(['week', 'month'] as const).map(r => (
            <button
              key={`range-${r}`}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-display font-600 transition-all duration-150 ${
                range === r ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {r === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gmvGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#78716c' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="gmv"
            orientation="left"
            tick={{ fontSize: 10, fontFamily: 'DM Sans', fill: '#a8a29e' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            yAxisId="orders"
            orientation="right"
            tick={{ fontSize: 10, fontFamily: 'DM Sans', fill: '#a8a29e' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            yAxisId="gmv"
            type="monotone"
            dataKey="gmv"
            stroke="#f97316"
            strokeWidth={2.5}
            fill="url(#gmvGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }}
          />
          <Area
            yAxisId="orders"
            type="monotone"
            dataKey="orders"
            stroke="#16a34a"
            strokeWidth={2}
            fill="url(#ordersGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-5 mt-3 pt-3 border-t border-stone-100">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1.5 bg-orange-500 rounded-full"></div>
          <span className="text-xs font-body text-stone-500">GMV</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1.5 bg-green-600 rounded-full"></div>
          <span className="text-xs font-body text-stone-500">Orders</span>
        </div>
        <div className="ml-auto text-xs text-stone-400 font-body">All amounts in INR</div>
      </div>
    </div>
  );
}