'use client';

import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Props {
  shop: any;
}

export default function ShopHeader({ shop }: Props) {
  return (
    <section className="relative w-full">
      {/* Banner Image */}
      <div className="relative w-full h-60 sm:h-72 overflow-hidden">
        <AppImage
          src={
            shop?.image ||
            'https://images.unsplash.com/photo-1563377225929-7084bcef8e24'
          }
          alt={shop?.shop_name || 'Shop'}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/80" />

        {/* Share button */}
        <button className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
          <Icon name="ShareIcon" size={16} className="text-white" />
        </button>

        {/* Shop Info */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-6">
          <h1 className="font-display text-2xl sm:text-3xl font-800 text-white">
            {shop?.shop_name || 'Shop'}
          </h1>

          <p className="text-white/80 text-sm mt-1">
            {shop?.category || 'Fresh items available'}
          </p>

          {/* Meta */}
          <div className="flex items-center flex-wrap gap-3 mt-2.5">
            <span className="flex items-center gap-1 bg-green-600 text-white text-xs px-2.5 py-1 rounded-full">
              <Icon name="StarIcon" size={11} className="text-white" />
              {shop?.rating ?? '—'}
            </span>

            <span className="flex items-center gap-1 text-white/90 text-xs">
              <Icon name="ClockIcon" size={13} className="text-orange-400" />
              {shop?.delivery_time ?? 'N/A'}
            </span>

            <span className="flex items-center gap-1 text-white/90 text-xs">
              <Icon name="MapPinIcon" size={13} className="text-orange-400" />
              {shop?.location ?? 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Offer Strip */}
      <div className="bg-orange-50 border-b border-orange-100 px-4 py-2.5 flex items-center gap-2">
        <Icon name="TagIcon" size={14} className="text-primary" />
        <span className="text-xs font-semibold text-primary">
          {shop?.offer_text || 'Free delivery above ₹99'}
        </span>
      </div>
    </section>
  );
}