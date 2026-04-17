'use client';

import React, { useState } from 'react';
import SellerDashboardClient from './components/SellerDashboardClient';

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orderCount, setOrderCount] = useState(0);

  return (
    <SellerDashboardClient
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      setOrderCount={setOrderCount}
      orderCount={orderCount}
    />
  );
}