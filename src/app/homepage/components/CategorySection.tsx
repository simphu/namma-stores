'use client';
import React from 'react';


type Section = 'all' | 'fresh' | 'shops' | 'catering';

interface CategorySectionProps {
  activeSection: Section;
  onSectionChange: (s: Section) => void;
}

const categories = [
  {
    key: 'fresh' as Section,
    label: 'Namma Fresh',
    sublabel: 'Meat, Veg & Flowers',
    emoji: '🥩',
    bg: 'from-green-400 to-green-600',
    light: 'bg-green-50 border-green-200 text-green-700',
    active: 'bg-green-600 text-white border-green-600',
  },
  {
    key: 'shops' as Section,
    label: 'Local Shops',
    sublabel: 'Grocery, Pharmacy & More',
    emoji: '🏪',
    bg: 'from-orange-400 to-orange-600',
    light: 'bg-orange-50 border-orange-200 text-orange-700',
    active: 'bg-orange-500 text-white border-orange-500',
  },
  {
    key: 'catering' as Section,
    label: 'Catering & Bulk',
    sublabel: 'Events & Large Orders',
    emoji: '🍱',
    bg: 'from-purple-400 to-purple-600',
    light: 'bg-purple-50 border-purple-200 text-purple-700',
    active: 'bg-purple-600 text-white border-purple-600',
  },
];

export default function CategorySection({ activeSection, onSectionChange }: CategorySectionProps) {
  return (
    <section className="px-4 lg:px-8 mt-5">
      {/* All button */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => onSectionChange('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-display font-600 border transition-all duration-150 ${
            activeSection === 'all' ?'bg-stone-800 text-white border-stone-800' :'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={`cat-pill-${cat.key}`}
            onClick={() => onSectionChange(cat.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-display font-600 border transition-all duration-150 ${
              activeSection === cat.key ? cat.active : `${cat.light} hover:opacity-80`
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Category hero cards */}
      <div className="grid grid-cols-3 gap-3">
        {categories.map(cat => (
          <button
            key={`cat-card-${cat.key}`}
            onClick={() => onSectionChange(cat.key)}
            className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${cat.bg} text-white text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md ${
              activeSection === cat.key ? 'ring-2 ring-offset-2 ring-orange-400' : ''
            }`}
          >
            <div className="absolute right-2 top-2 text-3xl opacity-30">{cat.emoji}</div>
            <p className="text-base font-display font-700 leading-tight">{cat.label}</p>
            <p className="text-xs text-white/80 font-body mt-0.5 hidden sm:block">{cat.sublabel}</p>
          </button>
        ))}
      </div>
    </section>
  );
}