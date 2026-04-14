import React from 'react';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

export default function PageHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          aria-label="Go back"
          className="icon-btn w-10 h-10 flex items-center justify-center rounded-full bg-appbg"
        >
          <Icon name="ArrowLeftIcon" size={20} className="text-darker" />
        </button>

        {/* Logo + Brand */}
        <Link href="/shop-product-page" className="flex items-center gap-2">
          <AppLogo size={32} />
          <span className="font-display text-base font-700 text-darker tracking-tight">
            NammaStores
          </span>
        </Link>

        {/* Search Icon */}
        <button
          aria-label="Search products"
          className="icon-btn w-10 h-10 flex items-center justify-center rounded-full bg-appbg"
        >
          <Icon name="MagnifyingGlassIcon" size={20} className="text-darker" />
        </button>
      </div>
    </header>
  );
}