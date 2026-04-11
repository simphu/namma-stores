'use client';
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  emoji: string;
}

const initialProducts: Product[] = [
  { id: 'prod-s-001', name: 'Tata Salt (1kg)', price: 22, category: 'Staples', inStock: true, emoji: '🧂' },
  { id: 'prod-s-002', name: 'Amul Butter (500g)', price: 275, category: 'Dairy', inStock: true, emoji: '🧈' },
  { id: 'prod-s-003', name: 'Aashirvaad Atta (5kg)', price: 249, category: 'Staples', inStock: true, emoji: '🌾' },
  { id: 'prod-s-004', name: 'Tata Tea Gold (500g)', price: 265, category: 'Beverages', inStock: true, emoji: '🍵' },
  { id: 'prod-s-005', name: 'Maggi Noodles (12 pack)', price: 156, category: 'Snacks', inStock: false, emoji: '🍜' },
  { id: 'prod-s-006', name: 'Surf Excel (1kg)', price: 185, category: 'Household', inStock: true, emoji: '🧺' },
];

export default function SellerProductPanel() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const toggleStock = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const updated = { ...p, inStock: !p.inStock };
      toast.success(`${updated.name} marked as ${updated.inStock ? 'in stock' : 'out of stock'}`);
      return updated;
    }));
  };

  const deleteProduct = (id: string, name: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.error(`${name} removed from catalog`);
  };

  const handleAddProduct = () => {
    if (!newName || !newPrice) return;
    const newProd: Product = {
      id: `prod-s-${Date.now()}`,
      name: newName,
      price: parseInt(newPrice),
      category: newCategory || 'General',
      inStock: true,
      emoji: '📦',
    };
    setProducts(prev => [newProd, ...prev]);
    setNewName('');
    setNewPrice('');
    setNewCategory('');
    setShowAddModal(false);
    toast.success(`${newProd.name} added to catalog`);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h3 className="font-display font-700 text-sm text-stone-800">Product Catalog</h3>
          <p className="text-xs text-stone-500 font-body mt-0.5">
            {products.filter(p => p.inStock).length} active · {products.filter(p => !p.inStock).length} out of stock
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-display font-700 rounded-xl transition-all duration-150"
        >
          <Plus size={13} />
          Add Product
        </button>
      </div>

      <div className="divide-y divide-stone-50 max-h-72 overflow-y-auto">
        {products.map(product => (
          <div key={product.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-stone-50/50 transition-colors ${!product.inStock ? 'opacity-60' : ''}`}>
            <div className="w-9 h-9 bg-stone-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
              {product.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-display font-600 text-stone-800 line-clamp-1">{product.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-display font-700 text-stone-900 tabular-nums">₹{product.price}</span>
                <span className="text-[10px] text-stone-400 font-body">{product.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => toggleStock(product.id)}
                className={`p-1.5 rounded-lg transition-colors ${product.inStock ? 'text-green-500 hover:bg-green-50' : 'text-stone-400 hover:bg-stone-100'}`}
                title={product.inStock ? 'Mark out of stock' : 'Mark in stock'}
              >
                {product.inStock ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              </button>
              <button className="p-1.5 rounded-lg text-stone-400 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Edit product">
                <Pencil size={13} />
              </button>
              <button
                onClick={() => deleteProduct(product.id, product.name)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Delete product — this cannot be undone"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 p-6 shadow-2xl animate-fade-in">
            <h3 className="font-display font-700 text-lg text-stone-800 mb-4">Add New Product</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-display font-700 text-stone-600 mb-1.5">Product Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Parle-G Biscuits (500g)"
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm font-body focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                />
              </div>
              <div>
                <label className="block text-xs font-display font-700 text-stone-600 mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm font-body focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                />
              </div>
              <div>
                <label className="block text-xs font-display font-700 text-stone-600 mb-1.5">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm font-body focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                >
                  <option value="">Select category</option>
                  {['Staples', 'Dairy', 'Beverages', 'Snacks', 'Household', 'Personal Care', 'General'].map(cat => (
                    <option key={`opt-${cat}`} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-display font-600 text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={!newName || !newPrice}
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-200 text-white text-sm font-display font-700 rounded-xl transition-colors"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}