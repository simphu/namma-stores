'use client';

import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export default function Step3({ formData, back }: any) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  const handleSubmit = async () => {
    if (!userId) return;

    setLoading(true);

    const { error } = await supabase.from('sellers').upsert({
      id: userId,
      ...formData,
      is_open: false,
      is_accepting_orders: false,
      is_onboarded: true,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    window.location.href = '/seller-dashboard';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">

      <h2 className="text-xl font-bold mb-4">Operations</h2>

      <input
        placeholder="Opening Time (9 AM)"
        className="w-full mb-3 p-2 border rounded"
        onChange={(e) => formData.opening_time = e.target.value}
      />

      <input
        placeholder="Closing Time (10 PM)"
        className="w-full mb-3 p-2 border rounded"
        onChange={(e) => formData.closing_time = e.target.value}
      />

      <input
        placeholder="Delivery Time (30 mins)"
        className="w-full mb-3 p-2 border rounded"
        onChange={(e) => formData.delivery_time = e.target.value}
      />

      <input
        type="number"
        placeholder="Delivery Fee"
        className="w-full mb-3 p-2 border rounded"
        onChange={(e) => formData.delivery_fee = Number(e.target.value)}
      />

      <input
        type="number"
        placeholder="Minimum Order"
        className="w-full mb-4 p-2 border rounded"
        onChange={(e) => formData.min_order = Number(e.target.value)}
      />

      <div className="flex gap-2">
        <button onClick={back} className="flex-1 border py-2 rounded">← Back</button>
        <button onClick={handleSubmit} className="flex-1 bg-black text-white py-2 rounded">
          {loading ? 'Saving...' : 'Finish'}
        </button>
      </div>

    </div>
  );
}