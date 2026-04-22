import { useRouter } from 'next/navigation';

export default function OrderSummary({
  items,
  onUpdateQty,
}: any) {
  const router = useRouter();

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

              {/* IMAGE (fallback) */}
             <img
  src={item.image}
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
                  className="px-2 py-1"
                >
                  -
                </button>

                <span className="px-3 text-sm font-bold">
                  {item.qty}
                </span>

                <button
                  onClick={() => onUpdateQty(item.id, item.qty + 1)}
                  className="px-2 py-1"
                >
                  +
                </button>
              </div>

              <span className="text-sm font-semibold w-14 text-right">
                ₹{item.price * item.qty}
              </span>

            </div>

          </div>
        ))}

      </div>

      {/* 🔥 ADD MORE ITEMS */}
      <button
        onClick={() => router.push(`/shop/${items[0]?.shopId}`)}
        className="mt-4 w-full border border-dashed border-orange-400 text-orange-600 py-2 rounded-xl font-semibold"
      >
        + Add more items
      </button>

    </div>
  );
}