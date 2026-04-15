import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Search items..."
      className="w-full p-3 outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
