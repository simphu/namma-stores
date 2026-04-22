'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function NammaFreshSetup() {
  const [products, setProducts] = useState<any[]>([]);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) return;

      setSellerId(userId);

      const { data: master } = await supabase
        .from('master_products')
        .select('*');

      const { data: mapping } = await supabase
        .from('seller_product_mapping')
        .select('master_product_id')
        .eq('seller_id', userId);

      setProducts(master || []);
      setSelectedIds(mapping?.map(m => m.master_product_id) || []);
    };

    init();
  }, []);

  const toggleProduct = async (productId: string) => {
    if (!sellerId) return;

    const isSelected = selectedIds.includes(productId);

    if (isSelected) {
      await supabase
        .from('seller_product_mapping')
        .delete()
        .eq('seller_id', sellerId)
        .eq('master_product_id', productId);

      setSelectedIds(prev => prev.filter(id => id !== productId));
    } else {
      await supabase
        .from('seller_product_mapping')
        .insert({
          seller_id: sellerId,
          master_product_id: productId,
          is_available: true,
        });

      setSelectedIds(prev => [...prev, productId]);
    }
  };

  return (
    <div className="space-y-3 p-4">

      {products.map((p) => {
        const isSelected = selectedIds.includes(p.id);

        return (
          <div
            key={p.id}
            className="flex justify-between items-center border p-3 rounded-lg"
          >
            <span className="font-medium">{p.name}</span>

            <button
              onClick={() => toggleProduct(p.id)}
              className={`px-3 py-1 rounded ${
                isSelected
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {isSelected ? 'Selected' : 'Select'}
            </button>
          </div>
        );
      })}

    </div>
  );
}