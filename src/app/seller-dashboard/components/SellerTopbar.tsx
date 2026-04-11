'use client';
import React from 'react';
import { Bell, RefreshCw, Store, Sun } from 'lucide-react';

interface Props {
  shopOnline: boolean;
  onToggleShop: () => void;
}

export default function SellerTopbar({ shopOnline, onToggleShop }: Props) {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 lg:px-8 2xl:px-12">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between h-16">
        <div>
          <h1 className="font-display font-700 text-xl text-stone-800">Seller Dashboard</h1>
          <p className="text-xs text-stone-500 font-body flex items-center gap-1">
            <Sun size={11} className="text-amber-400" />
            Wednesday, 1 April 2026 · Fresh Basket Store
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Shop online toggle */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200 ${
            shopOnline ? 'bg-green-50 border-green-200' : 'bg-stone-100 border-stone-200'
          }`}>
            <Store size={14} className={shopOnline ? 'text-green-600' : 'text-stone-500'} />
            <span className={`text-xs font-display font-600 ${shopOnline ? 'text-green-700' : 'text-stone-600'}`}>
              {shopOnline ? 'Online' : 'Offline'}
            </span>
            <button
              onClick={onToggleShop}
              className={`relative w-9 h-5 rounded-full transition-all duration-200 ${shopOnline ? 'bg-green-500' : 'bg-stone-300'}`}
              aria-label={shopOnline ? 'Set shop offline' : 'Set shop online'}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${shopOnline ? 'left-4' : 'left-0.5'}`} />
            </button>
          </div>

          <button className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors">
            <Bell size={18} className="text-stone-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse-soft"></span>
          </button>

          <button className="p-2 rounded-xl hover:bg-stone-100 transition-colors" title="Refresh dashboard data">
            <RefreshCw size={18} className="text-stone-600" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-sm font-display font-700 text-orange-600">RK</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-display font-600 text-stone-800">Rajan Kumar</p>
              <p className="text-xs text-stone-500 font-body">Shop Owner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}