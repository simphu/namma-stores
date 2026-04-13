'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';

export default function ShopPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  const { addItem } = useCart(); // ✅ CART HOOK

  useEffect(() => {
    const fetchData = async () => {
      // 🔹 FETCH SHOP
      const { data: shopData, error: shopError } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', id)
        .single();

      if (shopError) {
        console.error('SHOP ERROR:', shopError);
      }

      setShop(shopData);

      // 🔹 FETCH PRODUCTS
      const { data: allProducts, error: productError } = await supabase
        .from('product')
        .select('*');

      if (productError) {
        console.error('PRODUCT ERROR:', productError);
      }

      // 🔹 FILTER PRODUCTS
      const filteredProducts =
        allProducts?.filter((p: any) => p.seller_id === id) || [];

      console.log('FILTERED PRODUCTS:', filteredProducts);

      setProducts(filteredProducts);
    };

    if (id) fetchData();
  }, [id]);

  if (!shop) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">

      {/* 🔹 SHOP NAME */}
      <h1 className="text-xl font-bold mb-4">
        {shop.shop_name}
      </h1>

      {/* 🔹 OFFLINE */}
      {!shop.is_online && (
        <div className="bg-red-100 text-red-600 p-2 rounded mb-4">
          Store is currently offline
        </div>
      )}

      {/* 🔹 PRODUCTS */}
      <div className="grid grid-cols-2 gap-4">
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((p) => (
            <div key={p.id} className="border p-3 rounded-lg shadow-sm">

              <p className="font-medium">{p.name}</p>
              <p className="text-gray-600">₹{p.price}</p>

              {/* 🔥 FINAL FIXED BUTTON */}
              <button
                className="mt-2 bg-orange-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  console.log('ADDING:', p);

                  addItem({
                    id: p.id,
                    name: p.name,
                    price: Number(p.price), // ✅ IMPORTANT
                    shopId: id as string,
                    shopName: shop.shop_name,
                  });
                }}
              >
                Add
              </button>

            </div>
          ))
        )}
      </div>

    </div>
  );
}