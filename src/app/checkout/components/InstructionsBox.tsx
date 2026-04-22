'use client';

import { MessageSquare } from 'lucide-react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function InstructionsBox({ value, onChange }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4">

      <p className="text-xs font-bold text-stone-500 uppercase mb-3 flex items-center gap-1">
        <MessageSquare size={12} />
        Instructions for Seller
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="E.g. Less spicy, no onions, clean properly..."
        rows={3}
        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
      />

    </div>
  );
}