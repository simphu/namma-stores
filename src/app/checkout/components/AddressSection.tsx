export default function AddressSection({
  addresses,
  selectedAddress,
  onSelect,
  onAdd,
}: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-stone-200">
      <p className="text-xs font-bold mb-3">Delivery Address</p>

      {addresses.map((a: any) => (
        <button
          key={a.id}
          onClick={() => onSelect(a.id)}
          className={`block w-full text-left p-3 border rounded-xl mb-2 ${
            selectedAddress === a.id
              ? 'border-orange-500 bg-orange-50'
              : 'border-stone-200'
          }`}
        >
          <p className="font-semibold">{a.label}</p>
          <p className="text-xs text-gray-500">{a.address}</p>
        </button>
      ))}

      <button
        onClick={onAdd}
        className="flex items-center gap-2 text-orange-500 mt-2"
      >
        + Add address
      </button>
    </div>
  );
}