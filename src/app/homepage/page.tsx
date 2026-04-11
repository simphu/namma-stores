'use client';

import React, { useEffect, useState } from 'react';
import CustomerHeader from '@/components/CustomerHeader';
import HomepageClient from './components/HomepageClient';

const ADDRESS_KEY = "namma_addresses";

function getAddresses() {
  try {
    const raw = localStorage.getItem(ADDRESS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function HomepagePage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const stored = getAddresses();
    setAddresses(stored);

    if (stored.length > 0) {
      setSelectedAddress(stored[0]);
    }
  }, []);

  useEffect(() => {
  const dummyProducts = [
    { id: '1', name: 'Chicken (1kg)', price: 300 },
    { id: '2', name: 'Mutton (1kg)', price: 900 },
  ];

  setProducts(dummyProducts);
}, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <CustomerHeader
        cartCount={0}
        addresses={addresses}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        setAddresses={setAddresses}
        products={products}
      />

<HomepageClient
  selectedAddress={selectedAddress}
  products={products}
/>
    </div>
  );
}