'use client';

import { useState } from 'react';
import ProductRow from './ProductRow';

interface Props {
  products: any[];
  shopId: string;
  shopName: string;
}

export default function MenuCategories({ products, shopId, shopName }: Props) {

  // 🔥 GROUP BY CATEGORY
  const grouped = products.reduce((acc: any, product: any) => {
    const category = product.category || 'Recommended';

    if (!acc[category]) acc[category] = [];
    acc[category].push(product);

    return acc;
  }, {});

  const categories = Object.keys(grouped);

  // 🔥 STATE: which category is open
  const [openCategory, setOpenCategory] = useState(categories[0]);

  return (
    <div className="px-4 py-3 pb-40">

      {categories.map((cat) => {
        const isOpen = openCategory === cat;

        return (
          <div key={cat} className="mb-4 border rounded-xl overflow-hidden">

            {/* 🔥 CATEGORY HEADER */}
            <button
              onClick={() =>
                setOpenCategory(isOpen ? '' : cat)
              }
              className="w-full flex justify-between items-center px-4 py-3 bg-gray-50"
            >
              <span className="font-semibold text-gray-800">
                {cat} ({grouped[cat].length})
              </span>

              <span className="text-sm">
                {isOpen ? '▲' : '▼'}
              </span>
            </button>

            {/* 🔥 PRODUCTS */}
            {isOpen && (
              <div className="divide-y">
                {grouped[cat].map((p: any) => (
                  <ProductRow
                    key={p.id}
                    product={{
                      id: p.id,
                      name: p.name,
                      description: p.description || '',
                      price: p.price,
                      originalPrice: p.original_price || p.price,
                      image: p.image || '',
                      imageAlt: p.name,
                      tag: p.is_best_seller ? 'Bestseller' : undefined,
                      isVeg: p.type === 'veg',
                      rating: p.rating || 4.2,
                    }}
                    shopId={shopId}
                    shopName={shopName}
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