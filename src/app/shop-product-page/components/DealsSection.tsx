import React from 'react';
import Icon from '@/components/ui/AppIcon';

const deals = [
  {
    id: 1,
    icon: 'TagIcon' as const,
    title: 'Extra ₹50 OFF',
    subtitle: 'On orders above ₹299',
    code: 'SAVE50',
    color: 'bg-orange-50 border-orange-200',
    iconColor: 'text-primary',
  },
  {
    id: 2,
    icon: 'ShoppingBagIcon' as const,
    title: 'Items at ₹89',
    subtitle: 'Selected daily essentials',
    code: 'DAILY89',
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600',
  },
  {
    id: 3,
    icon: 'TruckIcon' as const,
    title: 'Free Delivery',
    subtitle: 'On orders above ₹99',
    code: 'FREEDEL',
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
  },
  {
    id: 4,
    icon: 'BoltIcon' as const,
    title: '20% OFF',
    subtitle: 'First order discount',
    code: 'NAMMA20',
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
  },
  {
    id: 5,
    icon: 'GiftIcon' as const,
    title: 'Buy 2 Get 1',
    subtitle: 'On snacks & beverages',
    code: 'B2G1',
    color: 'bg-pink-50 border-pink-200',
    iconColor: 'text-pink-600',
  },
];

export default function DealsSection() {
  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 mb-2.5">
          <Icon name="TagIcon" size={14} className="text-primary" variant="solid" />
          <span className="font-display text-sm font-700 text-darker">Deals &amp; Offers</span>
        </div>
        <div className="flex items-stretch gap-3 overflow-x-auto scrollbar-hide pb-1">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className={`flex-shrink-0 flex flex-col gap-1.5 border rounded-xl px-3.5 py-3 min-w-[140px] cursor-pointer hover:shadow-sm transition-shadow ${deal.color}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Icon name={deal.icon} size={14} className={deal.iconColor} variant="solid" />
                </div>
                <span className="font-display text-sm font-700 text-darker leading-tight">
                  {deal.title}
                </span>
              </div>
              <p className="text-xs text-muted font-body leading-snug">{deal.subtitle}</p>
              <span className="text-[10px] font-display font-700 text-muted border border-dashed border-muted/40 rounded px-1.5 py-0.5 self-start tracking-wide">
                {deal.code}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
