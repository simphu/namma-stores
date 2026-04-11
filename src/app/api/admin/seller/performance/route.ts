import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {

    const { data: orders } = await supabase
      .from('orders')
      .select('seller_id, total, status');

    if (!orders) {
      return NextResponse.json([]);
    }

    const sellerMap: any = {};

    orders.forEach((order) => {
      const seller = order.seller_id || 'unknown';

      if (!sellerMap[seller]) {
        sellerMap[seller] = {
          sellerId: seller,
          totalOrders: 0,
          gmv: 0,
          completedOrders: 0,
          cancelledOrders: 0,
        };
      }

      sellerMap[seller].totalOrders += 1;
      sellerMap[seller].gmv += order.total || 0;

      if (order.status === 'delivered') {
        sellerMap[seller].completedOrders += 1;
      }

      if (order.status === 'cancelled') {
        sellerMap[seller].cancelledOrders += 1;
      }
    });

    const result = Object.values(sellerMap).map((seller: any) => ({
      ...seller,
      cancellationRate:
        seller.totalOrders > 0
          ? Math.round((seller.cancelledOrders / seller.totalOrders) * 100)
          : 0,
    }));

    return NextResponse.json(result);

  } catch (error) {
    console.error('Seller Performance API Error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch seller performance' },
      { status: 500 }
    );
  }
}