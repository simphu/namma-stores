export default function PlaceOrderBar({ total, onPlace, loading }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
      <button
        onClick={onPlace}
        disabled={loading}
        className="w-full bg-orange-500 text-white py-3 rounded-xl"
      >
        {loading ? 'Placing...' : `Place Order ₹${total}`}
      </button>
    </div>
  );
}