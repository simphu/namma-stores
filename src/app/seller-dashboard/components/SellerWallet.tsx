'use client';
import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SellerWallet() {

  const seller_id = 'seller_1'; // later dynamic

  const { data, isLoading } = useSWR(
    `/api/seller/wallet?seller_id=${seller_id}`,
    fetcher
  );

  if (isLoading) return <div>Loading wallet...</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <h2 className="text-sm font-bold mb-3">Wallet</h2>

      <div className="text-3xl font-bold text-green-600">
        ₹{data?.balance || 0}
      </div>

      <p className="text-xs text-gray-500 mt-1">
        Available balance
      </p>
    </div>
  );
}