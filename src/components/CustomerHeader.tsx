'use client';
import React, { useState } from 'react';
import AppLogo from '@/components/ui/AppLogo';
import { MapPin, Search, Bell, ChevronDown, X } from 'lucide-react';

interface CustomerHeaderProps {
  cartCount?: number;
  onCartOpen?: () => void;

  addresses: any[];
  selectedAddress: any;
  setSelectedAddress: (addr: any) => void;
  setAddresses: (addr: any[]) => void;
  products: any[];
}

export default function CustomerHeader({
  cartCount = 0,
  onCartOpen,
  addresses,
  selectedAddress,
  setSelectedAddress,
  setAddresses,
  products
}: CustomerHeaderProps) {
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredResults = (products || []).filter((item) =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
          {/* Top row */}
          <div className="flex items-center gap-3 h-14">
            <div className="flex items-center gap-2 flex-shrink-0">
              <AppLogo size={32} />
              <span className="font-display font-700 text-lg text-orange-600 hidden sm:block">
                Namma Stores
              </span>
            </div>

            {/* Location selector */}
            <button
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-1.5 flex-1 min-w-0 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl px-3 py-2 transition-colors duration-150 group max-w-xs"
            >
              <MapPin size={15} className="text-orange-500 flex-shrink-0" />
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs text-stone-500 font-body leading-none">Delivering to</span>
                <span className="text-sm font-display font-600 text-stone-800 truncate leading-tight">
                  {selectedAddress ? selectedAddress.address : "Select location"}
                </span>
              </div>
              <ChevronDown size={13} className="text-stone-400 flex-shrink-0 ml-auto group-hover:text-orange-500 transition-colors" />
            </button>

            <div className="flex items-center gap-2 ml-auto">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-xl hover:bg-stone-100 transition-colors duration-150 relative"
                aria-label="Search shops and products"
              >
                <Search size={20} className="text-stone-600" />
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-xl hover:bg-stone-100 transition-colors duration-150 relative">
                <Bell size={20} className="text-stone-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
              </button>

            </div>
          </div>

          {/* Search bar (expandable) */}
          {searchOpen && (
            <div className="pb-3 animate-fade-in">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shops, products, categories..."
                  autoFocus
                  className="w-full pl-9 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-body text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Location modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setLocationModalOpen(false)}
          />
          <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md p-6 animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-700 text-lg text-stone-800">Set Delivery Location</h3>
              <button
                onClick={() => setLocationModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X size={18} className="text-stone-500" />
              </button>
            </div>

            <button className="w-full flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-xl mb-4 hover:bg-orange-100 transition-colors">
              <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-orange-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-display font-600 text-orange-700">Use current location</p>
                <p className="text-xs text-stone-500 font-body">Detect via GPS</p>
              </div>
            </button>

            <div className="space-y-2">
  {addresses.length > 0 ? (
    addresses.map((loc) => (
      <button
        key={loc.id}
        onClick={() => {
          setSelectedAddress(loc);
          setLocationModalOpen(false);
        }}
        className="w-full flex items-center gap-3 p-3 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-left"
      >
        <span className="text-xl">📍</span>
        <div>
          <p className="text-sm font-display font-600 text-stone-800">
            {loc.label}
          </p>
          <p className="text-xs text-stone-500 font-body truncate">
            {loc.address}
          </p>
        </div>
      </button>
    ))
  ) : (
    <p className="text-sm text-gray-500 text-center py-3">
      "Add your first delivery address"
    </p>
  )}

  {/* ✅ ADD NEW ADDRESS */}
  <button
    onClick={() => {
      const label = prompt("Enter label (Home / Work)");
      const address = prompt("Enter full address");

      if (!address) return;

      const newAddress = {
        id: Date.now(),
        label: label || "New Address",
        address,
      };

      const updated = [...addresses, newAddress];

      setAddresses(updated);
      setSelectedAddress(newAddress);
      setLocationModalOpen(false);
      localStorage.setItem("namma_addresses", JSON.stringify(updated));
    }}
    className="w-full mt-2 border-dashed border p-3 rounded-xl text-sm text-stone-600 hover:bg-stone-50"
    >
    + Add new address
  </button>
</div>
          </div>
        </div>
      )}
    </>
  );
}