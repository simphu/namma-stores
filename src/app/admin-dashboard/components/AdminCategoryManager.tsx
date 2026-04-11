'use client';
import React, { useState } from 'react';
import { Tag, Edit2, Plus, Leaf, Store, Users, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';


interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  shopCount: number;
  productCount: number;
  isActive: boolean;
  slug: string;
}

const initialCategories: Category[] = [
  {
    id: 'cat-namma-fresh',
    name: 'Namma Fresh',
    description: 'Controlled items: chicken, meat, fish, flowers',
    icon: Leaf,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    shopCount: 4,
    productCount: 48,
    isActive: true,
    slug: 'namma-fresh',
  },
  {
    id: 'cat-shops',
    name: 'Local Shops',
    description: 'Grocery, pharmacy, bakery and general stores',
    icon: Store,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    shopCount: 28,
    productCount: 1240,
    isActive: true,
    slug: 'shops',
  },
  {
    id: 'cat-catering',
    name: 'Catering & Bulk',
    description: 'Events, parties and large order catering',
    icon: Users,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    shopCount: 6,
    productCount: 34,
    isActive: true,
    slug: 'catering',
  },
];

export default function AdminCategoryManager() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const toggleCategory = (id: string) => {
    setCategories(prev => prev.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c, isActive: !c.isActive };
      toast.success(`${updated.name} ${updated.isActive ? 'enabled' : 'disabled'} on platform`);
      return updated;
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag size={15} className="text-stone-500" />
          <h3 className="font-display font-700 text-sm text-stone-800">Category Management</h3>
        </div>
        <button className="flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-display font-600 rounded-lg transition-colors">
          <Plus size={12} />
          Add
        </button>
      </div>

      <div className="divide-y divide-stone-50">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <div key={cat.id} className={`px-4 py-4 transition-colors hover:bg-stone-50/50 ${!cat.isActive ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 ${cat.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={16} className={cat.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-display font-700 text-stone-800">{cat.name}</p>
                    {!cat.isActive && (
                      <span className="px-1.5 py-0.5 bg-stone-100 text-stone-500 text-[10px] font-display font-600 rounded-md">Disabled</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 font-body mt-0.5 line-clamp-1">{cat.description}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-body text-stone-500 tabular-nums">
                      <span className="font-display font-700 text-stone-700">{cat.shopCount}</span> shops
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-[10px] font-body text-stone-500 tabular-nums">
                      <span className="font-display font-700 text-stone-700">{cat.productCount.toLocaleString('en-IN')}</span> products
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button className="p-1.5 rounded-lg text-stone-400 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Edit category">
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className={`transition-colors ${cat.isActive ? 'text-green-500 hover:text-green-600' : 'text-stone-400 hover:text-stone-600'}`}
                    title={cat.isActive ? 'Disable category' : 'Enable category'}
                  >
                    {cat.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}