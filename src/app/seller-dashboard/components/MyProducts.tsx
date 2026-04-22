'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function MyProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [sellerId, setSellerId] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // form fields
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) return;

      setSellerId(userId);

      // fetch products
      const { data: prodData } = await supabase
        .from('seller_products')
        .select(`*, categories(name)`)
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

      setProducts(prodData || []);

      // fetch categories
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('type', 'store')
        .eq('is_active', true);

      setCategories(catData || []);
    };

    fetchData();
  }, []);

  // 🔥 IMAGE UPLOAD
  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) {
      toast.error('Image upload failed');
      return null;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // 🔥 SAVE PRODUCT
  const handleSaveProduct = async () => {
    if (!newName || !newPrice || !sellerId) {
      toast.error('Fill required fields');
      return;
    }

    let imageUrl = null;

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    let response;

    if (editingProduct) {
      response = await supabase
        .from('seller_products')
        .update({
          name: newName,
          price: parseInt(newPrice),
          description: newDescription,
          stock: parseInt(newStock) || 0,
          unit: newUnit,
          category_id: newCategory || null,
          image_url: imageUrl || editingProduct.image_url,
        })
        .eq('id', editingProduct.id)
        .select()
        .single();
    } else {
      response = await supabase
        .from('seller_products')
        .insert({
          seller_id: sellerId,
          name: newName,
          price: parseInt(newPrice),
          description: newDescription,
          stock: parseInt(newStock) || 0,
          unit: newUnit,
          category_id: newCategory || null,
          is_active: true,
          image_url: imageUrl,
        })
        .select()
        .single();
    }

    const { data, error } = response;

    if (error) {
      toast.error('Save failed');
      return;
    }

    if (editingProduct) {
      setProducts(prev =>
        prev.map(p => (p.id === data.id ? data : p))
      );
      toast.success('Updated');
    } else {
      setProducts(prev => [data, ...prev]);
      toast.success('Added');
    }

    // reset
    setEditingProduct(null);
    setNewName('');
    setNewPrice('');
    setNewDescription('');
    setNewStock('');
    setNewUnit('');
    setNewCategory('');
    setImageFile(null);
    setPreviewUrl(null);
    setShowAddModal(false);
  };

  // 🔥 TOGGLE ACTIVE
  const toggleStock = async (id: string, current: boolean) => {
    await supabase
      .from('seller_products')
      .update({ is_active: !current })
      .eq('id', id);

    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, is_active: !current } : p
      )
    );
  };

  // 🔥 DELETE
  const deleteProduct = async (id: string) => {
    await supabase.from('seller_products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.error('Product deleted');
  };

  return (
    <div className="bg-white rounded-2xl border shadow overflow-hidden">

      {/* HEADER */}
      <div className="p-4 flex justify-between">
        <h3 className="font-bold">Products</h3>

        <button
          onClick={() => {
            setEditingProduct(null);
            setShowAddModal(true);
            setNewCategory('');
          }}
          className="bg-orange-500 text-white px-3 py-1 rounded flex items-center gap-1"
        >
          <Plus size={14}/> Add
        </button>
      </div>

      {/* LIST */}
      <div className="divide-y">
        {products.map(product => (
          <div key={product.id} className="flex gap-4 p-4 items-center">

            <img
              src={product.image_url || '/placeholder.png'}
              className="w-16 h-16 object-cover rounded"
            />

            <div className="flex-1">
              <p className="font-semibold">{product.name}</p>

              <p className="text-sm text-gray-500">
                ₹{product.price} • {product.unit || 'unit'}
              </p>

              <p className="text-xs text-gray-400">
                {product.categories?.name || 'No category'}
              </p>

              <p className="text-xs text-gray-400 line-clamp-1">
                {product.description}
              </p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => toggleStock(product.id, product.is_active)}>
                {product.is_active ? <ToggleRight/> : <ToggleLeft/>}
              </button>

              <button
                onClick={() => {
                  setEditingProduct(product);
                  setNewName(product.name);
                  setNewPrice(product.price);
                  setNewDescription(product.description || '');
                  setNewStock(product.stock || '');
                  setNewUnit(product.unit || '');
                  setNewCategory(product.category_id || '');
                  setPreviewUrl(product.image_url);
                  setShowAddModal(true);
                }}
              >
                <Pencil size={14}/>
              </button>

              <button onClick={() => deleteProduct(product.id)}>
                <Trash2 size={14}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-5 rounded w-96">

            <h3 className="font-bold mb-3">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h3>

            {previewUrl && (
              <img src={previewUrl} className="w-full h-32 object-cover mb-3 rounded"/>
            )}

            <input
              placeholder="Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="border p-2 w-full mb-2"
            />

            <input
              placeholder="Price"
              type="number"
              value={newPrice}
              onChange={e => setNewPrice(e.target.value)}
              className="border p-2 w-full mb-2"
            />

            <textarea
              placeholder="Description"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              className="border p-2 w-full mb-2"
            />

            <input
              placeholder="Stock"
              type="number"
              value={newStock}
              onChange={e => setNewStock(e.target.value)}
              className="border p-2 w-full mb-2"
            />

            <input
              placeholder="Unit"
              value={newUnit}
              onChange={e => setNewUnit(e.target.value)}
              className="border p-2 w-full mb-2"
            />

            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border p-2 w-full mb-2"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setImageFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }}
              className="mb-3"
            />

            <button
              onClick={handleSaveProduct}
              className="bg-orange-500 text-white w-full py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setShowAddModal(false)}
              className="mt-2 border w-full py-2 rounded"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}