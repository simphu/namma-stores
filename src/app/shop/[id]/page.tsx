// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { supabase } from '@/lib/supabase';
// import { useCart } from '@/contexts/CartContext';

// export default function ShopPage() {
//   const params = useParams();
//   const id = Array.isArray(params.id) ? params.id[0] : params.id;

//   const [shop, setShop] = useState<any>(null);
//   const [products, setProducts] = useState<any[]>([]);

//   // 🔍 NEW STATES
//   const [search, setSearch] = useState('');
//   const [filter, setFilter] = useState('all');

//   const { addItem } = useCart();

//   useEffect(() => {
//     const fetchData = async () => {
//       // 🔹 FETCH SHOP
//       const { data: shopData, error: shopError } = await supabase
//         .from('sellers')
//         .select('*')
//         .eq('id', id)
//         .single();

//       if (shopError) {
//         console.error('SHOP ERROR:', shopError);
//       }

//       setShop(shopData);

//       // 🔹 FETCH PRODUCTS
//       const { data: allProducts, error: productError } = await supabase
//         .from('product')
//         .select('*');

//       if (productError) {
//         console.error('PRODUCT ERROR:', productError);
//       }

//       // 🔹 FILTER PRODUCTS BY SELLER
//       const filteredProducts =
//         allProducts?.filter((p: any) => p.seller_id === id) || [];

//       setProducts(filteredProducts);
//     };

//     if (id) fetchData();
//   }, [id]);

//   // 🔥 FINAL FILTER LOGIC
//   const finalProducts = products
//     .filter((p) =>
//       p.name?.toLowerCase().includes(search.toLowerCase())
//     )
//     .filter((p) => {
//       if (filter === 'veg') return p.type === 'veg';
//       if (filter === 'non-veg') return p.type === 'non-veg';
//       if (filter === 'best') return p.is_best_seller === true;
//       return true;
//     });

//   if (!shop) return <div className="p-4">Loading...</div>;

//   return (
//     <div className="p-4">

//       {/* 🔹 SHOP NAME */}
//       <h1 className="text-xl font-bold mb-4">
//         {shop.shop_name}
//       </h1>

//       {/* 🔍 SEARCH */}
//       <input
//         type="text"
//         placeholder="Search items..."
//         className="border p-2 w-full mb-4 rounded"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {/* 🔘 FILTERS */}
//       <div className="flex gap-2 mb-4">
//         <button onClick={() => setFilter('all')} className="px-2 py-1 border rounded">
//           All
//         </button>
//         <button onClick={() => setFilter('veg')} className="px-2 py-1 border rounded">
//           Veg
//         </button>
//         <button onClick={() => setFilter('non-veg')} className="px-2 py-1 border rounded">
//           Non Veg
//         </button>
//         <button onClick={() => setFilter('best')} className="px-2 py-1 border rounded">
//           Best Sellers
//         </button>
//       </div>

//       {/* 🔹 OFFLINE */}
//       {!shop.is_online && (
//         <div className="bg-red-100 text-red-600 p-2 rounded mb-4">
//           Store is currently offline
//         </div>
//       )}

//       {/* 🔹 PRODUCTS */}
//       <div className="grid grid-cols-2 gap-4">
//         {finalProducts.length === 0 ? (
//           <p>No products found</p>
//         ) : (
//           finalProducts.map((p) => (
//             <div key={p.id} className="border p-3 rounded-lg shadow-sm">

//               <p className="font-medium">{p.name}</p>
//               <p className="text-gray-600">₹{p.price}</p>

//               <button
//                 className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
//                 onClick={() => {
//                   addItem({
//                     id: p.id,
//                     name: p.name,
//                     price: Number(p.price),
//                     shopId: id as string,
//                     shopName: shop.shop_name,
//                   });
//                 }}
//               >
//                 Add
//               </button>

//             </div>
//           ))
//         )}
//       </div>

//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import ShopHeader from '@/app/shop-product-page/components/ShopHeader';
import DealsSection from '@/app/shop-product-page/components/DealsSection';
import SearchBar from '@/app/shop-product-page/components/SearchBar';
import FilterBar from '@/app/shop-product-page/components/FilterBar';
import MenuCategories from '@/app/shop-product-page/components/MenuCategories';
import StickyCartBar from '@/app/shop-product-page/components/StickyCartBar';

export default function ShopPage() {
  const params = useParams();
  const sellerId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [products, setProducts] = useState<any[]>([]);
  const [shop, setShop] = useState<any>(null);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
  const fetchData = async () => {
    // 🔹 FETCH SHOP
    const { data: shopData } = await supabase
      .from('sellers')
      .select('*')
      .eq('id', sellerId)
      .single();

    setShop(shopData);

    // 🔥 DYNAMIC QUERY
    let query = supabase
      .from('product')
      .select('*')
      .eq('seller_id', sellerId);

    // 🔍 SEARCH
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // 🔘 FILTERS
    if (filter === 'veg') {
      query = query.eq('type', 'veg');
    }

    if (filter === 'non-veg') {
      query = query.eq('type', 'non-veg');
    }

    if (filter === 'best') {
      query = query.eq('is_best_seller', true);
    }

    const { data } = await query;

    setProducts(data || []);
  };

  if (sellerId) fetchData();
}, [sellerId, search, filter]); // 🔥 IMPORTANT


  if (!shop) return <div className="p-4">Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-2xl mx-auto bg-white min-h-screen rounded-xl overflow-hidden shadow-sm">

        <ShopHeader shop={shop} />
        <DealsSection />

        <SearchBar value={search} onChange={setSearch} />
        <FilterBar value={filter} onChange={setFilter} />

        {/* 🔥 USE DYNAMIC MENU */}
        <MenuCategories
          products={products}
          shopId={sellerId as string}
          shopName={shop.shop_name}
        />

        <StickyCartBar />

      </div>
    </div>
  );
}