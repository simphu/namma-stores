import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function SearchBar() {
  return (
    <div className="px-4 py-3">
  <input
    type="text"
    placeholder="Search for items..."
    className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
  />
</div>
  );
}
