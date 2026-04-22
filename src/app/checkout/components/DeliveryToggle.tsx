export default function DeliveryToggle({ value, onChange }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-stone-200">
      <p className="text-xs font-bold text-stone-500 mb-3 uppercase">
        Delivery Options
      </p>

      <div className="grid grid-cols-2 gap-3">
        {['delivery', 'pickup'].map((mode) => {
          const active = value === mode;

          return (
            <button
              key={mode}
              onClick={() => onChange(mode)}
              className={`p-3 rounded-xl border-2 font-semibold capitalize transition-all
                ${
                  active
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300'
                }
              `}
            >
              {mode}
            </button>
          );
        })}
      </div>
    </div>
  );
}