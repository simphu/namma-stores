import React from 'react';
import Icon from '@/components/ui/AppIcon';

const filters = [
  { label: 'All', icon: 'Squares2X2Icon' as const, active: true },
  { label: 'Veg', icon: 'LeafIcon' as const, active: false },
  { label: 'Non-Veg', icon: 'FireIcon' as const, active: false },
  { label: 'Bestseller', icon: 'TrophyIcon' as const, active: false },
  { label: 'Fast Delivery', icon: 'BoltIcon' as const, active: false },
  { label: 'Offers', icon: 'TagIcon' as const, active: false },
];

export default function FilterBar() {
  return (
    <div className="sticky top-[57px] z-40 bg-white border-b border-border shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.label}
              aria-label={`Filter by ${f.label}`}
              className={`filter-pill flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-display font-600 border transition-all whitespace-nowrap
                ${f.active
                  ? 'bg-primary text-white border-primary shadow-orange-glow'
                  : 'bg-white text-darker border-border hover:border-primary/40 hover:bg-primary-light hover:text-primary'
                }`}
            >
              <Icon
                name={f.icon}
                size={13}
                className={f.active ? 'text-white' : 'text-muted'}
                variant="outline"
              />
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}