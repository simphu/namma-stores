'use client';
import React from 'react';
import { Users, ChevronRight, Star, Phone } from 'lucide-react';

const cateringOptions = [
  {
    id: 'cat-001',
    name: 'Sri Venkateshwara Catering',
    speciality: 'South Indian Veg Thali',
    minGuests: 50,
    pricePerPlate: 180,
    rating: 4.7,
    reviewCount: 89,
    tags: ['South Indian', 'Veg', 'Events'],
    emoji: '🍽️',
    turnaround: '48 hrs advance',
  },
  {
    id: 'cat-002',
    name: 'Mughal Biryani Catering',
    speciality: 'Hyderabadi Dum Biryani',
    minGuests: 30,
    pricePerPlate: 250,
    rating: 4.8,
    reviewCount: 142,
    tags: ['Biryani', 'Non-Veg', 'Parties'],
    emoji: '🍛',
    turnaround: '24 hrs advance',
  },
  {
    id: 'cat-003',
    name: 'Annapoorna Sweets & Catering',
    speciality: 'Sweets & Savouries Bulk',
    minGuests: 100,
    pricePerPlate: 120,
    rating: 4.5,
    reviewCount: 67,
    tags: ['Sweets', 'Bulk Orders', 'Weddings'],
    emoji: '🧁',
    turnaround: '72 hrs advance',
  },
];

export default function CateringSection() {
  return (
    <section className="px-4 lg:px-8 mt-8 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users size={16} className="text-purple-600" />
          </div>
          <div>
            <h2 className="font-display font-700 text-lg text-stone-800">Catering & Bulk Orders</h2>
            <p className="text-xs text-stone-500 font-body">For events, parties & large gatherings</p>
          </div>
        </div>
        <button className="text-sm font-display font-600 text-orange-600 hover:text-orange-700 transition-colors">
          View all
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cateringOptions?.map(option => (
          <div
            key={option?.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden group cursor-pointer hover:scale-[1.01]"
          >
            <div className="h-24 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center relative">
              <span className="text-5xl">{option?.emoji}</span>
              <span className="absolute top-2 right-2 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-display font-700 rounded-full">
                {option?.turnaround}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-display font-700 text-sm text-stone-800">{option?.name}</h3>
              <p className="text-xs text-stone-500 font-body mt-0.5">{option?.speciality}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-display font-600 text-stone-700 tabular-nums">{option?.rating}</span>
                <span className="text-xs text-stone-400 tabular-nums">({option?.reviewCount})</span>
              </div>
              <div className="flex gap-1 mt-2 flex-wrap">
                {option?.tags?.map(tag => (
                  <span key={`${option?.id}-tag-${tag}`} className="px-1.5 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-body rounded-md border border-purple-100">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                <div>
                  <p className="text-xs text-stone-500 font-body">Starting from</p>
                  <p className="text-base font-display font-700 text-stone-900 tabular-nums">₹{option?.pricePerPlate}<span className="text-xs font-400 text-stone-500">/plate</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-500 font-body">Min. guests</p>
                  <p className="text-sm font-display font-700 text-stone-800 tabular-nums">{option?.minGuests}+</p>
                </div>
              </div>
              <button className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-sm font-display font-600 rounded-xl transition-colors group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600">
                <Phone size={13} />
                Request Quote
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}