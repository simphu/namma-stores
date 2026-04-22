'use client';

import { useState } from 'react';
import ProductRow from './ProductRow';

export default function MenuCategories({
  products,
  shopId,
  shopName,
  isAcceptingOrders,
  isOpen,
}: any) {

  // 🔥 GROUP BY CATEGORY NAME
  const grouped = products.reduce((acc: any, product: any) => {
    const category = product.categories?.name || 'Recommended';

    if (!acc[category]) acc[category] = [];
    acc[category].push(product);

    return acc;
  }, {});

  const categories = Object.keys(grouped);
  const [openCategory, setOpenCategory] = useState(categories[0]);

  return (
    <div className="px-4 py-3 pb-40">

      {categories.map((cat) => {
        const isOpenCat = openCategory === cat;

        return (
          <div key={cat} className="mb-4 border rounded-xl overflow-hidden">

            <button
              onClick={() => setOpenCategory(isOpenCat ? '' : cat)}
              className="w-full flex justify-between px-4 py-3 bg-gray-50"
            >
              <span className="font-semibold">
                {cat} ({grouped[cat].length})
              </span>
              <span>{isOpenCat ? '▲' : '▼'}</span>
            </button>

            {isOpenCat && (
              <div className="divide-y">
                {grouped[cat].map((p: any) => (
                  <ProductRow
                    key={p.id}
                    product={{
                      id: p.id,
                      name: p.name,
                      description: p.description,
                      price: p.price,
                      originalPrice: p.price,
                      image: p.image_url,
                      imageAlt: p.name,
                      tag: p.is_best_seller ? 'Bestseller' : undefined,
                      isVeg: p.food_type === 'veg',
                      rating: 4.2,
                    }}
                    shopId={shopId}
                    shopName={shopName}
                    isAcceptingOrders={isAcceptingOrders}
                    isOpen={isOpen}
                  />
                ))}
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}