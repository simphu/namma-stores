import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function CheckoutHeader({ shopName }: any) {
  return (
    <div className="sticky top-0 bg-orange-500 text-white p-4 flex items-center gap-3">
      <Link href="/homepage">
        <ArrowLeft />
      </Link>

      <div>
        <h1 className="font-bold text-lg">Checkout</h1>
        <p className="text-xs opacity-90">{shopName}</p>
      </div>
    </div>
  );
}