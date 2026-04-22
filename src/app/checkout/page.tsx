'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from './hooks/useCheckout';

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

  if (!checkout.loaded) return <div className="flex justify-center mt-20">Loading...</div>;

  if (checkout.items.length === 0) {
    return (
      <div className="text-center mt-20">
        <p>Cart is empty</p>
        <button onClick={() => router.push('/homepage')}>Browse Shops</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">

      <CheckoutHeader shopName={checkout.items[0]?.shopName} />

      <div className="max-w-screen-sm mx-auto p-4 space-y-4 pb-32">

        <DeliveryToggle
          value={checkout.deliveryMode}
          onChange={checkout.setDeliveryMode}
        />

        {checkout.deliveryMode === 'delivery' ? (
          <AddressSection
            addresses={checkout.addresses}
            selectedAddress={checkout.selectedAddress}
            onSelect={checkout.setSelectedAddress}
            onAdd={() => {}}
          />
        ) : (
          checkout.seller && (
            <div className="bg-white p-4 rounded-xl">
              <p className="font-bold">{checkout.seller.shop_name}</p>
              <p>📍 {checkout.seller.address || checkout.seller.location}</p>
              <p>📞 {checkout.seller.phone}</p>
            </div>
          )
        )}

        <InstructionsBox
          value={checkout.instructions}
          onChange={checkout.setInstructions}
        />

        <OrderSummary
          items={checkout.items}
          onUpdateQty={checkout.updateQty}
          deliveryFee={checkout.deliveryFee}
          total={checkout.total}
          deliveryMode={checkout.deliveryMode}
        />

      </div>

      <PlaceOrderBar
        total={checkout.total}
        placing={checkout.placing}
        onPlaceOrder={checkout.handlePlaceOrder}
      />
    </div>
  );
}