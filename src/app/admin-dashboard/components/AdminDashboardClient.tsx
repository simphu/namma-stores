'use client';
import React from 'react';
import { Toaster } from 'sonner';
import AdminTopbar from './AdminTopbar';
import AdminKPICards from './AdminKPICards';
import AdminSellerApprovalQueue from './AdminSellerApprovalQueue';
import AdminCategoryManager from './AdminCategoryManager';
import AdminOrdersOverview from './AdminOrdersOverview';
import AdminGMVChart from './AdminGMVChart';
import useSWR, { mutate } from 'swr';
import AdminSellerPerformance from './AdminSellerPerformance';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminDashboardClient() {

  // ✅ Existing APIs
  const { data: kpis, isLoading: kpiLoading } = useSWR('/api/admin/kpis', fetcher);
  const { data: orders, isLoading: orderLoading } = useSWR('/api/admin/orders', fetcher);
  const { data: sellers, isLoading: sellerLoading } = useSWR('/api/admin/seller/pending', fetcher);

  // 🔥 NEW: Fetch config
  const { data: config } = useSWR('/api/admin/config', fetcher);

  // 🔥 STATE
  const [store, setStore] = React.useState(0);
  const [catering, setCatering] = React.useState(0);
  const [bulk, setBulk] = React.useState(0);
  const [fresh, setFresh] = React.useState(0);

  // 🔥 LOAD VALUES FROM DB
  React.useEffect(() => {
    if (config) {
      const c = config.commission || [];
      const m = config.margin || [];

      setStore(c.find((i:any) => i.type === 'store')?.commission_rate || 0);
      setCatering(c.find((i:any) => i.type === 'catering')?.commission_rate || 0);
      setBulk(c.find((i:any) => i.type === 'bulk')?.commission_rate || 0);
      setFresh(m.find((i:any) => i.type === 'namma_fresh')?.margin_rate || 0);
    }
  }, [config]);

  // 🔥 UPDATE API
  const updateConfig = async (type: string, value: number, mode: string) => {
    try {
      const res = await fetch('/api/admin/update-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value, mode })
      });

      const text = await res.text();

      if (!res.ok) {
        console.error("❌ API ERROR:", text);
        return;
      }

      const data = JSON.parse(text);
      console.log("✅ UPDATED:", data);

      // 🔥 Refresh UI
      mutate('/api/admin/config');

    } catch (err) {
      console.error("❌ Update error:", err);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <AdminTopbar />

      <div className="px-4 lg:px-8 2xl:px-12 pb-8 max-w-screen-2xl mx-auto">

        {/* TEST BUTTON */}
        <div className="mb-4">
          <button
            onClick={async () => {
              const res = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  user_id: 'user_1',
                  seller_id: 'seller_1',
                  total: 1000,
                  order_type: 'store'
                })
              });

              alert('Order Created!');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Test Create Order
          </button>
        </div>

        {/* KPI */}
        <AdminKPICards data={kpis} loading={kpiLoading} />

        {/* 🔥 NEW DYNAMIC REVENUE CONTROL */}
        <div className="mt-6 bg-white p-4 rounded-xl shadow-sm border">
          <h2 className="text-sm font-bold mb-3">Revenue Controls</h2>

          <div className="grid grid-cols-2 gap-4">

            {/* STORE */}
            <div>
              <p className="text-xs mb-1">Store Commission</p>
              <input
                value={store}
                onChange={(e)=>setStore(Number(e.target.value))}
                className="border p-2 w-full rounded"
              />
              <button
                onClick={()=>updateConfig('store', store, 'commission')}
                className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>

            {/* CATERING */}
            <div>
              <p className="text-xs mb-1">Catering Commission</p>
              <input
                value={catering}
                onChange={(e)=>setCatering(Number(e.target.value))}
                className="border p-2 w-full rounded"
              />
              <button
                onClick={()=>updateConfig('catering', catering, 'commission')}
                className="mt-2 text-xs bg-purple-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>

            {/* BULK */}
            <div>
              <p className="text-xs mb-1">Bulk Commission</p>
              <input
                value={bulk}
                onChange={(e)=>setBulk(Number(e.target.value))}
                className="border p-2 w-full rounded"
              />
              <button
                onClick={()=>updateConfig('bulk', bulk, 'commission')}
                className="mt-2 text-xs bg-indigo-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>

            {/* NAMMA FRESH */}
            <div>
              <p className="text-xs mb-1">Namma Fresh Margin</p>
              <input
                value={fresh}
                onChange={(e)=>setFresh(Number(e.target.value))}
                className="border p-2 w-full rounded"
              />
              <button
                onClick={()=>updateConfig('namma_fresh', fresh, 'margin')}
                className="mt-2 text-xs bg-green-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>

        {/* MAIN GRID */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 space-y-6">
            <AdminGMVChart />
            <AdminOrdersOverview orders={orders} loading={orderLoading} />
          </div>

          <div className="space-y-6">
            <AdminSellerPerformance />
            <AdminSellerApprovalQueue sellers={sellers} loading={sellerLoading} />
            <AdminCategoryManager />
          </div>

        </div>
      </div>
    </>
  );
}