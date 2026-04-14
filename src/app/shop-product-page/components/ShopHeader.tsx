import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function ShopHeader() {
  return (
    <section className="relative w-full">
      {/* Banner Image */}
      <div className="relative w-full h-60 sm:h-72 overflow-hidden">
        <AppImage
          src="https://images.unsplash.com/photo-1563377225929-7084bcef8e24"
          alt="Bright well-stocked grocery store interior with colourful fresh produce shelves and warm overhead lighting"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Strong gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/80" />

        {/* Share button — top right */}
        <button
          aria-label="Share shop"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
        >
          <Icon name="ShareIcon" size={16} className="text-white" />
        </button>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-6">
          <h1 className="font-display text-2xl sm:text-3xl font-800 text-white leading-tight tracking-tight drop-shadow-sm">
            Namma Fresh Mart
          </h1>
          <p className="text-white/80 text-sm font-body mt-0.5">
            Groceries, Snacks, Dairy &amp; Daily Essentials
          </p>

          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mt-2.5">
            {/* Rating */}
            <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-display font-700 px-2.5 py-1 rounded-full">
              <Icon name="StarIcon" size={11} className="text-white" variant="solid" />
              4.3
              <span className="font-400 opacity-80">(2.1k)</span>
            </span>

            {/* Delivery time */}
            <span className="flex items-center gap-1 text-white/90 text-xs font-body">
              <Icon name="ClockIcon" size={13} className="text-orange-400" />
              20–30 mins
            </span>

            {/* Location */}
            <span className="flex items-center gap-1 text-white/90 text-xs font-body">
              <Icon name="MapPinIcon" size={13} className="text-orange-400" />
              Koramangala 5th Block, Bengaluru
            </span>
          </div>
        </div>
      </div>

      {/* Offer strip below banner */}
      <div className="bg-orange-50 border-b border-orange-100 px-4 py-2.5 flex items-center gap-2">
        <Icon name="TagIcon" size={14} className="text-primary flex-shrink-0" variant="solid" />
        <span className="text-xs font-display font-600 text-primary">
          Free delivery above ₹99 &nbsp;·&nbsp; Use code <strong>NAMMA20</strong> for 20% off
        </span>
      </div>
    </section>
  );
}