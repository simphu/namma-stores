'use client';
import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminSellerPerformance() {
  const { data, isLoading } = useSWR('/api/admin/seller/performance', fetcher);

  if (isLoading) return <div>Loading seller performance...</div>;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Top Sellers</h2>

      <div className="space-y-3">
        {data?.map((seller: any) => (
          <div
            key={seller.sellerId}
            className="flex items-center justify-between p-3 border rounded-xl"
          >
            <div>
              <p className="font-medium">{seller.sellerId}</p>
              <p className="text-xs text-gray-500">
                {seller.totalOrders} orders
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">₹{seller.gmv}</p>
              <p className="text-xs text-red-500">
                {seller.cancellationRate}% cancel
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}