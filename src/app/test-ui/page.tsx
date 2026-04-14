'use client';

import ShopHeader from '@/app/shop-product-page/components/ShopHeader';
import DealsSection from '@/app/shop-product-page/components/DealsSection';
import SearchBar from '@/app/shop-product-page/components/SearchBar';
import FilterBar from '@/app/shop-product-page/components/FilterBar';
import MenuCategories from '@/app/shop-product-page/components/MenuCategories';
import ProductRow from '@/app/shop-product-page/components/ProductRow';
import StickyCartBar from '@/app/shop-product-page/components/StickyCartBar';

export default function TestUI() {
  const products = [
  {
    id: 1,
    name: 'Chicken',
    description: 'Fresh chicken',
    price: 300,
    originalPrice: 350,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d',
    imageAlt: 'Chicken',
    tag: 'Bestseller' as const,
    isVeg: false,
    rating: 4.3,
  },
  {
    id: 2,
    name: 'Mutton',
    description: 'Fresh mutton',
    price: 900,
    originalPrice: 1000,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d',
    imageAlt: 'Mutton',
    isVeg: false,
    rating: 4.5,
  },
];
  const shop = {
  id: 'seller_1',
  name: 'Fresh Basket Store',
    };

  return (
    <div className="bg-gray-100 min-h-screen py-6">

      {/* 🔥 CENTERED APP CONTAINER */}
      <div className="max-w-2xl mx-auto bg-white min-h-screen rounded-xl overflow-hidden shadow-sm">

        {/* HEADER */}
        <ShopHeader />

        {/* DEALS */}
        <DealsSection />

        {/* SEARCH */}
        <div className="border-t border-gray-100">
          <SearchBar />
        </div>

        {/* FILTERS */}
        <div className="border-t border-gray-100">
          <FilterBar />
        </div>

        {/* MENU CATEGORY */}
        <div className="border-t border-gray-100">
          <MenuCategories />
        </div>

        {/* PRODUCTS */}
        <div className="px-4 py-3 pb-28">

          {/* SECTION TITLE */}
          <h2 className="text-base font-semibold mb-3">
            Recommended <span className="text-gray-400 text-sm">(2)</span>
          </h2>

          {/* PRODUCT LIST */}
          <div className="divide-y divide-gray-100">
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                shopId={shop.id}
                shopName={shop.name}
/>
            ))}
          </div>

        </div>

        {/* STICKY CART */}
        <StickyCartBar />

      </div>
    </div>
  );
}