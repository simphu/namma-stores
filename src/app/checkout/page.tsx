'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Bike, Store, MessageSquare, CreditCard, Wallet, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';



interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  shopId:string,
  shopName: string;
}

type DeliveryMode = 'delivery' | 'pickup';
type PaymentMode = 'cod' | 'online';
type Address = {
  full_address: string;
  area: string;
};



export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('delivery');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cod');
  const [instructions, setInstructions] = useState('');
  const [placing, setPlacing] = useState(false);

useEffect(() => {
  try {
    // Load cart
    const storedCart = localStorage.getItem('checkout_cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }

    // Load addresses
    const storedAddresses = localStorage.getItem(ADDRESS_KEY);
    const parsed = storedAddresses ? JSON.parse(storedAddresses) : [];

    setAddresses(parsed);

    if (parsed.length > 0) {
      setSelectedAddress(parsed[0].id);
    }

  } catch {
    setItems([]);
    setAddresses([]);
  }

  setLoaded(true);
}, []);
  const ADDRESS_KEY = "namma_addresses";

const [addresses, setAddresses] = useState<any[]>([]);
const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const deliveryFee = deliveryMode === 'delivery' ? (subtotal > 299 ? 0 : 25) : 0;
  const total = subtotal + deliveryFee;
  const selectedAddr = addresses.find(a => a.id === selectedAddress);


const handleAddAddress = () => {
  const label = prompt("Enter address name (Home, Work, etc)");
  const address = prompt("Enter full address");

  if (!label || !address) return;

  const newAddress = {
    id: Date.now().toString(),
    label,
    address,
  };

  const updated = [...addresses, newAddress];

  setAddresses(updated);
  localStorage.setItem(ADDRESS_KEY, JSON.stringify(updated));
};


const handlePlaceOrder = async () => {
  if (!items || items.length === 0) return;

  if (deliveryMode === 'delivery' && !selectedAddr) {
    alert('Please select an address');
    return;
  }

  setPlacing(true);

  try {
    const res = await fetch('/api/orders/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  user_id: 'user_1',
  seller_id: items[0]?.shopId,
  total: total,
  order_type: 'store',
  address: selectedAddr?.address || 'Whitefield',
  delivery_mode: deliveryMode || 'delivery',
  item_count: items.reduce((sum, i) => sum + i.qty, 0),
  area: selectedAddr?.label || 'Whitefield',
  items: items,
  instructions: instructions || '',
}),
});

    const data = await res.json();

    if (data.success) {
      localStorage.removeItem('checkout_cart');
      localStorage.removeItem('namma_cart');

      toast.success('Order placed successfully 🎉');

      setTimeout(() => {
        router.push('/orders');
      }, 800);
    } else {
      alert(data.error || 'Order failed');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong');
  } finally {
    setPlacing(false);
  }
};

  if (!loaded) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6 text-center">
        <span className="text-6xl mb-4">🛒</span>
        <h2 className="font-bold text-xl text-stone-800 mb-2">No items to checkout</h2>
        <p className="text-stone-500 text-sm mb-6">Your cart is empty. Add items before checking out.</p>
        <Link href="/homepage" className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-colors">
          Browse Shops
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-3">
        <Link href="/homepage" className="p-2 rounded-xl hover:bg-stone-100 transition-colors text-stone-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-bold text-lg text-stone-800">Checkout</h1>
          <p className="text-xs text-stone-400">{items[0]?.shopName}</p>
        </div>
      </div>

      <div className="max-w-screen-sm mx-auto px-4 py-5 pb-36 space-y-4">

        {/* Delivery / Pickup Toggle */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Delivery Options</p>
          <div className="grid grid-cols-2 gap-2">
            {(['delivery', 'pickup'] as DeliveryMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setDeliveryMode(mode)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  deliveryMode === mode ? 'border-orange-500 bg-orange-50' : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                {mode === 'delivery'
                  ? <Bike size={16} className={deliveryMode === mode ? 'text-orange-600' : 'text-stone-500'} />
                  : <Store size={16} className={deliveryMode === mode ? 'text-orange-600' : 'text-stone-500'} />
                }
                <span className={`text-sm font-semibold capitalize ${deliveryMode === mode ? 'text-orange-700' : 'text-stone-600'}`}>
                  {mode === 'delivery' ? 'Delivery' : 'Pickup'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Address Selection (delivery only) */}
        {deliveryMode === 'delivery' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-4">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin size={11} />
              Delivery Address
            </p>
            <div className="space-y-2">
              {addresses.map(addr => (
                <button
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    selectedAddress === addr.id ? 'border-orange-500 bg-orange-50' : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${
                    selectedAddress === addr.id ? 'border-orange-500 bg-orange-500' : 'border-stone-300'
                  }`}>
                    {selectedAddress === addr.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${selectedAddress === addr.id ? 'text-orange-700' : 'text-stone-700'}`}>{addr.label}</p>
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{addr.address}</p>
                  </div>
                </button>
              ))}
              <button
  onClick={handleAddAddress}
  className="w-full flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-stone-300 text-stone-500 hover:border-orange-300 hover:text-orange-600 transition-all"
>
                <Plus size={14} />
                <span className="text-sm font-semibold">Add new address</span>
              </button>
            </div>
          </div>
        )}

        {/* Instructions for Seller */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MessageSquare size={11} />
            Instructions for Seller
          </p>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="E.g. Please clean the chicken well, extra spicy, no onions..."
            rows={3}
            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 resize-none font-body"
          />
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Payment Method</p>
          <div className="space-y-2">
            {([
              { key: 'cod' as const, label: 'Cash on Delivery', icon: Wallet, desc: 'Pay when order arrives' },
              { key: 'online' as const, label: 'Pay Online', icon: CreditCard, desc: 'UPI, Cards, Net Banking' },
            ]).map(pm => (
              <button
                key={pm.key}
                onClick={() => setPaymentMode(pm.key)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  paymentMode === pm.key ? 'border-orange-500 bg-orange-50' : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <pm.icon size={16} className={paymentMode === pm.key ? 'text-orange-600' : 'text-stone-500'} />
                <div className="text-left flex-1">
                  <p className={`text-sm font-semibold ${paymentMode === pm.key ? 'text-orange-700' : 'text-stone-700'}`}>{pm.label}</p>
                  <p className="text-xs text-stone-500">{pm.desc}</p>
                </div>
                {paymentMode === pm.key && (
                  <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Order Summary</p>
          <div className="space-y-2 mb-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {item.qty}
                  </span>
                  <span className="text-sm text-stone-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-stone-700 tabular-nums">₹{(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-100 pt-3 space-y-2">
            <div className="flex justify-between text-sm text-stone-600">
              <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
              <span className="tabular-nums font-semibold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-600">
              <span>Delivery fee</span>
              {deliveryFee === 0
                ? <span className="text-green-600 font-semibold">Free</span>
                : <span className="tabular-nums font-semibold">₹{deliveryFee}</span>
              }
            </div>
            {deliveryMode === 'delivery' && subtotal < 299 && (
              <p className="text-xs text-green-600">Add ₹{299 - subtotal} more for free delivery</p>
            )}
            <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Total</span>
              <span className="tabular-nums text-orange-600">₹{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 z-10">
        <div className="max-w-screen-sm mx-auto">
          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 active:scale-[0.99] text-white py-3.5 rounded-2xl font-bold text-base transition-all duration-150 shadow-lg flex items-center justify-center gap-2"
          >
            {placing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Placing Order...
              </>
            ) : (
              <>
                Place Order · ₹{total}
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
