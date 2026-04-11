import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {

    // ✅ Get today's start time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Fetch today's orders with status
    const { data: ordersData } = await supabase
      .from('orders')
      .select('total, status, created_at')
      .gte('created_at', today.toISOString());

    // ✅ Total Orders
    const totalOrdersCount = ordersData?.length || 0;

    // ✅ GMV
    const gmvToday =
      ordersData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

    // ✅ AOV
    const aov =
      totalOrdersCount > 0 ? Math.round(gmvToday / totalOrdersCount) : 0;

    // 🔥 ORDER QUALITY METRICS

    const completedOrders =
      ordersData?.filter(o => o.status === 'delivered').length || 0;

    const cancelledOrders =
      ordersData?.filter(o => o.status === 'cancelled').length || 0;

    const rejectedOrders =
      ordersData?.filter(o => o.status === 'rejected').length || 0;

    const failedOrders =
      ordersData?.filter(o => o.status === 'failed').length || 0;

    const cancellationRate =
      totalOrdersCount > 0
        ? Math.round((cancelledOrders / totalOrdersCount) * 100)
        : 0;

    // ✅ TEMP (we will fix later)
    const activeSellers = 5;
    const pendingApprovals = 2;
    const activeCustomers = 10;

    return NextResponse.json({
      gmvToday,
      totalOrders: totalOrdersCount,
      activeSellers,
      pendingApprovals,
      activeCustomers,
      aov,

      // 🔥 NEW METRICS
      completedOrders,
      cancelledOrders,
      rejectedOrders,
      failedOrders,
      cancellationRate,
    });

  } catch (error) {
    console.error('KPI API Error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch KPIs' },
      { status: 500 }
    );
  }
}