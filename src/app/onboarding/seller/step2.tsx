export default function Step2({ formData, setFormData, next, back }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">

      <h2 className="text-xl font-bold mb-4">Store Info</h2>

      <input
        placeholder="Shop Name"
        className="w-full mb-3 p-2 border rounded"
        value={formData.shop_name}
        onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
      />

      <input
        placeholder="Category (e.g Grocery, Bakery)"
        className="w-full mb-3 p-2 border rounded"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      />

      <textarea
        placeholder="Address"
        className="w-full mb-3 p-2 border rounded"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />

      <textarea
        placeholder="Description"
        className="w-full mb-4 p-2 border rounded"
        value={formData.shop_description}
        onChange={(e) => setFormData({ ...formData, shop_description: e.target.value })}
      />

      <div className="flex gap-2">
        <button onClick={back} className="flex-1 border py-2 rounded">← Back</button>
        <button onClick={next} className="flex-1 bg-black text-white py-2 rounded">Next →</button>
      </div>

    </div>
  );
}