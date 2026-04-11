'use client';
import React, { useState } from 'react';
import { Search, ExternalLink, Bike, Store as StoreIcon } from 'lucide-react';

interface PlatformOrder {
  id: string;
  orderNo: string;
  customer: string;
  shopName: string;
  shopCategory: string;
  amount: number;
  itemCount: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'rejected';
  deliveryMode: 'delivery' | 'pickup';
  placedAt: string;
  area: string;
}

const platformOrders: PlatformOrder[] = [
  { id: 'po-001', orderNo: 'NS-2847', customer: 'Priya Sharma', shopName: 'Fresh Basket Store', shopCategory: 'Grocery', amount: 546, itemCount: 3, status: 'preparing', deliveryMode: 'delivery', placedAt: '10:02 AM', area: 'Whitefield' },
  { id: 'po-002', orderNo: 'NS-2846', customer: 'Karthik Reddy', shopName: 'Ravi Bakery', shopCategory: 'Bakery', amount: 421, itemCount: 2, status: 'out_for_delivery', deliveryMode: 'delivery', placedAt: '9:48 AM', area: 'Kadugodi' },
  { id: 'po-003', orderNo: 'NS-2845', customer: 'Ananya Krishnan', shopName: 'Whitefield Medical', shopCategory: 'Pharmacy', amount: 460, itemCount: 4, status: 'accepted', deliveryMode: 'delivery', placedAt: '9:31 AM', area: 'ITPL Road' },
  { id: 'po-004', orderNo: 'NS-2844', customer: 'Suresh Babu', shopName: 'Namma Fresh Whitefield', shopCategory: 'Namma Fresh', amount: 536, itemCount: 2, status: 'delivered', deliveryMode: 'delivery', placedAt: '9:15 AM', area: 'Varthur' },
  { id: 'po-005', orderNo: 'NS-2843', customer: 'Meena Iyer', shopName: 'Spice Garden', shopCategory: 'Spices', amount: 460, itemCount: 3, status: 'pending', deliveryMode: 'pickup', placedAt: '8:55 AM', area: 'Brookefield' },
  { id: 'po-006', orderNo: 'NS-2842', customer: 'Rajesh Nair', shopName: 'Daily Needs Mart', shopCategory: 'Supermarket', amount: 892, itemCount: 6, status: 'delivered', deliveryMode: 'delivery', placedAt: '8:30 AM', area: 'Whitefield' },
  { id: 'po-007', orderNo: 'NS-2841', customer: 'Divya Menon', shopName: 'HomeStyle Tiffin', shopCategory: 'Home Food', amount: 180, itemCount: 2, status: 'rejected', deliveryMode: 'delivery', placedAt: '8:10 AM', area: 'Hoodi' },
  { id: 'po-008', orderNo: 'NS-2840', customer: 'Venkat Rao', shopName: 'Fresh Basket Store', shopCategory: 'Grocery', amount: 347, itemCount: 4, status: 'delivered', deliveryMode: 'pickup', placedAt: '7:50 AM', area: 'Whitefield' },
  { id: 'po-009', orderNo: 'NS-2839', customer: 'Shalini Patel', shopName: 'Naturals Ice Cream', shopCategory: 'Desserts', amount: 220, itemCount: 2, status: 'delivered', deliveryMode: 'delivery', placedAt: '7:30 AM', area: 'Kadugodi' },
  { id: 'po-010', orderNo: 'NS-2838', customer: 'Arjun Menon', shopName: 'Whitefield Medical', shopCategory: 'Pharmacy', amount: 685, itemCount: 5, status: 'delivered', deliveryMode: 'delivery', placedAt: '7:15 AM', area: 'ITPL Road' },
];

type StatusKey = PlatformOrder['status'];

const STATUS_CONFIG: Record<
  'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled',
  { label: string; bg: string; color: string; border: string }
> = {
  pending: {
    label: 'Pending',
    bg: 'bg-gray-100',
    color: 'text-gray-600',
    border: 'border-gray-200',
  },
  accepted: {
    label: 'Accepted',
    bg: 'bg-blue-100',
    color: 'text-blue-600',
    border: 'border-blue-200',
  },
  preparing: {
    label: 'Preparing',
    bg: 'bg-yellow-100',
    color: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  ready: {
    label: 'Ready',
    bg: 'bg-indigo-100',
    color: 'text-indigo-600',
    border: 'border-indigo-200',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    bg: 'bg-purple-100',
    color: 'text-purple-600',
    border: 'border-purple-200',
  },
  delivered: {
    label: 'Delivered',
    bg: 'bg-green-100',
    color: 'text-green-600',
    border: 'border-green-200',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-red-100',
    color: 'text-red-600',
    border: 'border-red-200',
  },
};

type Props = {
  orders: any;
  loading: boolean;
};

export default function AdminOrdersOverview({ orders, loading }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | StatusKey>('all');
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = (orders || []).filter((o: any) => {
    const matchSearch = !search ||
      o.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.shopName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const res = await fetch('/api/admin/orders/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status })
    });

    const data = await res.json();

    if (data.success) {
      alert('Updated!');
      location.reload();
    }
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-700 text-base text-stone-800">Platform Orders</h3>
          <span className="text-xs text-stone-400 font-body tabular-nums">{filtered.length} orders shown</span>
        </div>
        <div className="flex gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by order, customer, shop..."
              className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-body text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as 'all' | StatusKey); setPage(1); }}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-body text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
          >
            <option value="all">All Statuses</option>
            {(Object.keys(STATUS_CONFIG) as Array<keyof typeof STATUS_CONFIG>).map(s => (
              <option key={`so-${s}`} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              {['Order', 'Customer', 'Shop', 'Mode', 'Amount', 'Status', 'Time', ''].map((col, i) => (
                <th key={`th-${i}`} className="px-4 py-3 text-left text-[10px] font-display font-700 text-stone-500 uppercase tracking-wider whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <p className="font-display font-600 text-stone-500 text-sm">No orders found</p>
                  <p className="text-xs text-stone-400 font-body mt-1">Try adjusting your search or filter</p>
                </td>
              </tr>
            ) : (
              paged.map((order: any) => {
                const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
                
return (
  <tr key={order.id} className="hover:bg-stone-50/50 transition-colors group">

    {/* Order ID */}
    <td className="px-4 py-3 whitespace-nowrap">
      <span className="text-xs font-display font-700 text-stone-800">
        #{order.id.slice(0, 6)}
      </span>
    </td>

    {/* Customer */}
    <td className="px-4 py-3 whitespace-nowrap">
      <p className="text-xs font-display font-600 text-stone-700">Customer</p>
      <p className="text-[10px] text-stone-400 font-body">{order.area}</p>
    </td>

    {/* Seller */}
    <td className="px-4 py-3 whitespace-nowrap">
      <p className="text-xs font-display font-600 text-stone-700 max-w-[120px] truncate">
        Seller: {order.seller_id}
      </p>
      <p className="text-[10px] text-stone-400 font-body">
        {order.shopCategory || '—'}
      </p>
    </td>

    {/* Delivery Mode */}
    <td className="px-4 py-3 whitespace-nowrap">
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body border ${
          order.deliveryMode === 'delivery'
            ? 'bg-blue-50 text-blue-600 border-blue-100'
            : 'bg-stone-100 text-stone-500 border-stone-200'
        }`}
      >
        {order.deliveryMode === 'delivery' ? <Bike size={9} /> : <StoreIcon size={9} />}
        {order.deliveryMode === 'delivery' ? 'Delivery' : 'Pickup'}
      </span>
    </td>

    {/* Amount */}
    <td className="px-4 py-3 whitespace-nowrap">
      <p className="text-xs font-display font-700 text-stone-900 tabular-nums">
        ₹{order.total}
      </p>
      <p className="text-[10px] text-stone-400 font-body tabular-nums">
        {order.itemCount || 0} items
      </p>
    </td>

    {/* Status */}
    <td className="px-4 py-3 whitespace-nowrap">
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-display font-600 border ${cfg.bg} ${cfg.color} ${cfg.border}`}
      >
        {cfg.label}
      </span>
    </td>

    {/* Time */}
    <td className="px-4 py-3 whitespace-nowrap">
      <span className="text-xs text-stone-500 font-body">
        {new Date(order.created_at).toLocaleTimeString()}
      </span>
    </td>

    {/* ACTIONS (FIXED PROPERLY) */}
    <td className="px-4 py-3 whitespace-nowrap">
      <div className="flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition">

        <button
          onClick={() => updateOrderStatus(order.id, 'accepted')}
          className="px-2 py-1 text-[10px] bg-blue-100 text-blue-700 rounded"
        >
          Accept
        </button>

        <button
          onClick={() => updateOrderStatus(order.id, 'preparing')}
          className="px-2 py-1 text-[10px] bg-yellow-100 text-yellow-700 rounded"
        >
          Prep
        </button>

        <button
          onClick={() => updateOrderStatus(order.id, 'ready')}
          className="px-2 py-1 text-[10px] bg-indigo-100 text-indigo-700 rounded"
        >
          Ready
        </button>

        <button
          onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
          className="px-2 py-1 text-[10px] bg-purple-100 text-purple-700 rounded"
        >
          Out
        </button>

        <button
          onClick={() => updateOrderStatus(order.id, 'delivered')}
          className="px-2 py-1 text-[10px] bg-green-100 text-green-700 rounded"
        >
          Done
        </button>

        <button
          onClick={() => updateOrderStatus(order.id, 'cancelled')}
          className="px-2 py-1 text-[10px] bg-red-100 text-red-700 rounded"
        >
          Cancel
        </button>

      </div>
    </td>

  </tr>
);
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-stone-100 flex items-center justify-between">
          <p className="text-xs text-stone-500 font-body tabular-nums">
            Showing {((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-display font-600 border border-stone-200 rounded-lg disabled:opacity-40 hover:bg-stone-50 transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={`pg-${p}`}
                onClick={() => setPage(p)}
                className={`w-7 h-7 text-xs font-display font-700 rounded-lg transition-colors ${
                  page === p ? 'bg-orange-500 text-white' : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs font-display font-600 border border-stone-200 rounded-lg disabled:opacity-40 hover:bg-stone-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}