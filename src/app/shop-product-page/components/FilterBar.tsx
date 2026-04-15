'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const filters = [
  { key: 'all', label: 'All', icon: 'Squares2X2Icon' },
  { key: 'veg', label: 'Veg', icon: 'LeafIcon' },
  { key: 'non-veg', label: 'Non-Veg', icon: 'FireIcon' },
  { key: 'best', label: 'Bestseller', icon: 'TrophyIcon' },
];

export default function FilterBar({ value, onChange }: Props) {
  return (
    <div className="sticky top-[57px] z-40 bg-white border-b border-border shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((f) => {
            const isActive = value === f.key;

            return (
              <button
                key={f.key}
                onClick={() => onChange(f.key)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 whitespace-nowrap
                  ${isActive
  ? 'bg-green-600 text-white border-green-600 shadow-md scale-105'
  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
}`}
              >
                <Icon
                  name={f.icon as any}
                  size={13}
                  className={isActive ? 'text-white' : 'text-muted'}
                  variant="outline"
                />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}