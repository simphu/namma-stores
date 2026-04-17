export default function Step1({ formData, setFormData, next }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">

      <h2 className="text-xl font-bold mb-4">Basic Info</h2>

      <input
        placeholder="Owner Name"
        className="w-full mb-3 p-2 border rounded"
        value={formData.owner_name}
        onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
      />

      <input
        placeholder="Phone"
        className="w-full mb-4 p-2 border rounded"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />

      <button onClick={next} className="w-full bg-black text-white py-2 rounded">
        Next →
      </button>

    </div>
  );
}