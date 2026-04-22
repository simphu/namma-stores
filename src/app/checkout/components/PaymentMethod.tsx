'use client';

import { CreditCard } from 'lucide-react';

export default function PaymentMethod({ value, onChange }: any) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4">

      <p className="text-xs font-bold text-stone-500 uppercase mb-3">
        Payment Method
      </p>

      <button
        onClick={() => onChange('online')}
        className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-orange-500 bg-orange-50"
      >
        <CreditCard size={16} className="text-orange-600" />

        <div className="text-left flex-1">
          <p className="text-sm font-semibold text-orange-700">
            Pay Online
          </p>
          <p className="text-xs text-stone-500">
            UPI, Cards, Net Banking
          </p>
        </div>

        <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
      </button>

    </div>
  );
}