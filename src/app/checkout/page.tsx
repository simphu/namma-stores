'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// 🔥 HOOK
import { useCheckout } from './hooks/useCheckout';

// 🔥 UI COMPONENTS
import CheckoutHeader from './components/CheckoutHeader';
import DeliveryToggle from './components/DeliveryToggle';
import AddressSection from './components/AddressSection';
import InstructionsBox from './components/InstructionsBox';
import PaymentMethod from './components/PaymentMethod';
import OrderSummary from './components/OrderSummary';
import PlaceOrderBar from './components/PlaceOrderBar';

export default function CheckoutPage() {
  const router = useRouter();
  const checkout = useCheckout();

  // 🔄 LOADING
  if (!checkout.loaded) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 🛒 EMPTY CART
  if (checkout.items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6 text-center">
        <span className="text-6xl mb-4">🛒</span>

        <h2 className="font-bold text-xl text-stone-800 mb-2">
          No items to checkout
        </h2>

        <p className="text-stone-500 text-sm mb-6">
          Your cart is empty. Add items before checking out.
        </p>

        <button
          onClick={() => router.push('/homepage')}
          className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600"
        >
          Browse Shops
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">

      {/* 🔝 HEADER */}
      <CheckoutHeader shopName={checkout.items[0]?.shopName} />

      {/* 📦 MAIN CONTENT */}
      <div className="max-w-screen-sm mx-auto px-4 py-5 pb-36 space-y-4">

        {/* 🚚 DELIVERY / PICKUP TOGGLE */}
        <DeliveryToggle
          value={checkout.deliveryMode}
          onChange={checkout.setDeliveryMode}
        />

        {/* 📍 ADDRESS OR PICKUP */}
        {checkout.deliveryMode === 'delivery' ? (
          <AddressSection
            addresses={checkout.addresses}
            selectedAddress={checkout.selectedAddress}
            onSelect={checkout.setSelectedAddress}
            onAdd={checkout.handleAddAddress}
          />
        ) : (
          checkout.seller && (
            <div className="bg-white p-4 rounded-2xl border border-stone-200">
              <p className="text-xs font-bold mb-2">Pickup Details</p>

              <p className="font-semibold text-stone-800">
                {checkout.seller.shop_name}
              </p>

              <p className="text-sm text-stone-500">
                📍 {checkout.seller.location}
              </p>

              <p className="text-sm text-stone-500">
                📞 {checkout.seller.phone}
              </p>

              <p className="text-xs text-orange-600 mt-2">
                Show your order ID at store to collect
              </p>
            </div>
          )
        )}

        {/* 📝 INSTRUCTIONS */}
        <InstructionsBox
          value={checkout.instructions}
          onChange={checkout.setInstructions}
        />

        {/* 💳 PAYMENT */}
        <PaymentMethod
          value={checkout.paymentMode}
          onChange={checkout.setPaymentMode}
        />

        {/* 🧾 ORDER SUMMARY */}
        <OrderSummary
          items={checkout.items}
          subtotal={checkout.subtotal}
          total={checkout.total}
          deliveryFee={checkout.deliveryFee}
          totalItems={checkout.totalItems}
          onUpdateQty={checkout.updateQty}
          deliveryMode={checkout.deliveryMode}
        />

      </div>

      {/* 🚀 PLACE ORDER BAR */}
      <PlaceOrderBar
        total={checkout.total}
        placing={checkout.placing}
        onPlaceOrder={checkout.handlePlaceOrder}
      />

    </div>
  );
}