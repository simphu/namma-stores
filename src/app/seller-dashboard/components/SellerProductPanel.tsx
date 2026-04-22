'use client';

import React, { useState } from 'react';
import MyProducts from './MyProducts';
import NammaFreshSetup from './NammaFreshSetup';

export default function SellerProductPanel() {
  const [tab, setTab] = useState<'namma' | 'products'>('namma');

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden">

      {/* Tabs */}
      <div className="flex gap-6 px-5 py-3 border-b">
        <button
          onClick={() => setTab('namma')}
          className={tab === 'namma' ? 'font-bold text-orange-500' : 'text-gray-500'}
        >
          Namma Fresh Setup
        </button>

        <button
          onClick={() => setTab('products')}
          className={tab === 'products' ? 'font-bold text-orange-500' : 'text-gray-500'}
        >
          My Products
        </button>
      </div>

      {/* Content */}
      {tab === 'namma' && <NammaFreshSetup />}
      {tab === 'products' && <MyProducts />}

    </div>
  );
}