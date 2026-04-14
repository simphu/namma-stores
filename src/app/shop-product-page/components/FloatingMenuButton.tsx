import React from 'react';
import Icon from '@/components/ui/AppIcon';

export default function FloatingMenuButton() {
  return (
    <button
      aria-label="Open menu categories"
      className="fixed bottom-24 right-4 z-40 flex flex-col items-center justify-center w-14 h-14 bg-darker text-white rounded-full shadow-xl hover:bg-dark transition-colors"
    >
      <Icon name="Bars3Icon" size={18} className="text-white" />
      <span className="text-[9px] font-display font-700 tracking-widest mt-0.5">MENU</span>
    </button>
  );
}
