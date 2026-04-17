'use client';

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { supabase } from '@/lib/supabase';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SellerWallet() {
  const [sellerId, setSellerId] = useState<string | null>(null);

  // ✅ 1. Get logged-in user
  useEffect(() => {
    const getUser = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) return;

      setSellerId(userData.user.id);
    };

    getUser();
  }, []);

  // ✅ 2. Fetch wallet only when sellerId exists
  const { data, isLoading } = useSWR(
    sellerId ? `/api/seller/wallet?seller_id=${sellerId}` : null,
    fetcher
  );

  // ✅ 3. Loading states
  if (!sellerId) return <div>Loading user...</div>;
  if (isLoading) return <div>Loading wallet...</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <h2 className="text-sm font-bold mb-3">Wallet</h2>

      <div className="text-3xl font-bold text-green-600">
        ₹{data?.balance ?? 0}
      </div>

      <p className="text-xs text-gray-500 mt-1">
        Available balance
      </p>
    </div>
  );
}