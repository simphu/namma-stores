'use client';
import React from 'react';
import { Bell, RefreshCw, Sun } from 'lucide-react';

interface Props {
  isOpen: boolean;
  isAcceptingOrders: boolean;
  onToggleOpen: () => void;
  onToggleAccepting: () => void;
}

export default function SellerTopbar({
  isOpen,
  isAcceptingOrders,
  onToggleOpen,
  onToggleAccepting,
}: Props) {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 lg:px-8 2xl:px-12">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between h-16">
        
        {/* LEFT */}
        <div>
          <h1 className="font-display font-700 text-xl text-stone-800">
            Seller Dashboard
          </h1>
          <p className="text-xs text-stone-500 font-body flex items-center gap-1">
            <Sun size={11} className="text-amber-400" />
            Wednesday, 1 April 2026 · Fresh Basket Store
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* 🔥 STORE VISIBILITY TOGGLE */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition ${
            isOpen ? 'bg-green-50 border-green-200' : 'bg-stone-100'
          }`}>
            <span className={`text-xs font-semibold ${
              isOpen ? 'text-green-700' : 'text-stone-600'
            }`}>
              {isOpen ? 'Online' : 'Offline'}
            </span>

            <button
              onClick={onToggleOpen}
              className={`relative w-9 h-5 rounded-full ${
                isOpen ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${
                isOpen ? 'left-4' : 'left-0.5'
              }`} />
            </button>
          </div>

          

          {/* 🔔 NOTIFICATIONS */}
          <button className="relative p-2 rounded-xl hover:bg-stone-100">
            <Bell size={18} className="text-stone-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>

          {/* 🔄 REFRESH */}
          <button className="p-2 rounded-xl hover:bg-stone-100">
            <RefreshCw size={18} className="text-stone-600" />
          </button>

          {/* 👤 USER */}
          <div className="flex items-center gap-2 pl-2 border-l">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-orange-600">RK</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-stone-800">Rajan Kumar</p>
              <p className="text-xs text-stone-500">Shop Owner</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}