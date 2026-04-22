export default function PlaceOrderBar({ total, onPlaceOrder, placing }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg">
      <button
        onClick={onPlaceOrder}
        disabled={placing}
        className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold text-lg disabled:opacity-50"
      >
        {placing ? 'Placing...' : `Place Order ₹${total}`}
      </button>
    </div>
  );
}