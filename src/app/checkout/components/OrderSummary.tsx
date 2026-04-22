'use client';

import { useRouter } from 'next/navigation';

export default function OrderSummary({
  items,
  onUpdateQty,
  deliveryFee,
  total,
  deliveryMode,
}: any) {
  const router = useRouter();

  const subtotal = items.reduce((s: number, i: any) => s + i.price * i.qty, 0);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4">

      <p className="text-xs font-bold text-stone-500 uppercase mb-3">
        Order Summary
      </p>

      <div className="space-y-3">

        {items.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-3">

              <img
                src={item.image || '/placeholder.png'}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg"
              />

              <div>
                <p className="text-sm font-semibold text-stone-800">
                  {item.name}
                </p>
                <p className="text-xs text-stone-500">
                  ₹{item.price}
                </p>
              </div>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => onUpdateQty(item.id, item.qty - 1)}
                  className="px-2"
                >-</button>

                <span className="px-3">{item.qty}</span>

                <button
                  onClick={() => onUpdateQty(item.id, item.qty + 1)}
                  className="px-2"
                >+</button>
              </div>

              <span className="w-14 text-right">
                ₹{item.price * item.qty}
              </span>

            </div>
          </div>
        ))}

      </div>

      {/* 💰 BILL BREAKDOWN */}
      <div className="border-t mt-4 pt-3 text-sm space-y-1">

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        {deliveryMode === 'delivery' && (
          <div className="flex justify-between text-orange-600">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

      </div>

      {/* ADD MORE */}
      <button
        onClick={() => router.push(`/shop/${items[0]?.shopId}`)}
        className="mt-4 w-full border border-dashed border-orange-400 text-orange-600 py-2 rounded-xl font-semibold"
      >
        + Add more items
      </button>

    </div>
  );
}