'use client';

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Box, BarChart3, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  orderCount: number;
  isAcceptingOrders: boolean;
  onToggleAccepting: () => void;
  profileName: string; // ✅ NEW
}

export default function SellerSidebar({
  activeTab,
  setActiveTab,
  orderCount,
  isAcceptingOrders,
  onToggleAccepting,
  profileName, // ✅ ADD THIS
}: Props) {

  // ✅ MENU CONFIG
  const menu = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: Package },
    { id: "products", label: "Products", icon: Box },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  


  return (
    <div className="w-64 bg-[#f8f8f8] h-screen flex flex-col justify-between p-4">

      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-2 mb-5">
          <img src="/logo.png" className="w-6 h-6" />
          <div>
            <p className="text-orange-500 font-semibold">Namma Stores</p>
            <p className="text-xs text-gray-500">Seller Portal</p>
          </div>
        </div>

        {/* 🔥 ACCEPT ORDERS TOGGLE */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex justify-between items-center mb-5">
          <div>
            <p className="text-green-700 font-medium">Accept Orders</p>
            <p className="text-xs text-gray-500">
              {isAcceptingOrders ? 'Receiving orders' : 'Paused'}
            </p>
          </div>

          <button
            onClick={onToggleAccepting}
            className={`relative w-10 h-5 rounded-full transition ${
              isAcceptingOrders ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${
                isAcceptingOrders ? "left-5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* MENU */}
        <div className="flex flex-col gap-3">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition
                ${
                  activeTab === item.id
                    ? "bg-orange-100 text-orange-600"
                    : "bg-[#f3ebe5] text-orange-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.id === "orders" && orderCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {orderCount}
                    </span>
                  )}
                  <span>›</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM */}
      <div>
        <div className="text-gray-600 mb-3 cursor-pointer">
          🔔 Notifications
        </div>

        <div className="text-red-500 mb-4 cursor-pointer">
          ↩ Sign Out
        </div>

        <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-xl">
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
            N
          </div>
          <div>
<p className="text-sm font-medium">
  {profileName}
</p>

<p className="text-xs text-gray-500">
  Seller
</p>
          </div>
        </div>
      </div>
    </div>
  );
}