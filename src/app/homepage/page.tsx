'use client';

import React, { useEffect, useState } from 'react';
import CustomerHeader from '@/components/CustomerHeader';
import HomepageClient from './components/HomepageClient';
import { supabase } from '@/lib/supabase';



export default function HomepagePage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  
  useEffect(() => {
  const loadAddresses = async () => {
    const { data, error } = await supabase
  .from('addresses')
  .select('*')
  .eq('user_id', 'user_1');

if (error) {
  console.error(error);
  return;
}

const safeData = data || [];

setAddresses(safeData);

if (safeData.length > 0) {
  setSelectedAddress(safeData[0]);
}
  };

  loadAddresses();
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