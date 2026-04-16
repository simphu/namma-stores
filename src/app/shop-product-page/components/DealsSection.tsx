'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';

interface Props {
  sellerId: string;
}

export default function DealsSection({ sellerId }: Props) {
  const [deals, setDeals] = useState<any[]>([]);

  // 🔥 FETCH OFFERS
  useEffect(() => {
    const fetchDeals = async () => {
      const { data } = await supabase
        .from('offers')
        .select('*')
        .eq('seller_id', sellerId)
        .eq('is_active', true);

      setDeals(data || []);
    };

    if (sellerId) fetchDeals();
  }, [sellerId]);

  if (!deals.length) return null;

  return (
    <div className="bg-white border-b px-4 py-3">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">

        {deals.map((deal) => (
          <div
            key={deal.id}
            className="min-w-[170px] flex items-center gap-3 bg-gray-50 border rounded-xl px-4 py-3"
          >
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Icon name="TagIcon" size={14} className="text-orange-600" />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                {deal.title}
              </p>
              <p className="text-xs text-gray-500">{deal.code}</p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}