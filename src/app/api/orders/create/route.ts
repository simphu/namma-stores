import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user_id = body.user_id || 'user_1';
    const seller_id = body.seller_id || 'seller_1'; // 🔥 FORCE FIX
    const total = Number(body.total || 0);
    const order_type = body.order_type || 'store';

    console.log("📥 Incoming order:", { user_id, seller_id, total, order_type });

    let commission_rate = 0;
    let platform_earning = 0;
    let seller_earning = 0;
    let margin = 0;

    // ✅ COMMISSION FLOW
    if (['store', 'catering', 'bulk'].includes(order_type)) {
      const { data, error } = await supabase
        .from('commission_config')
        .select('commission_rate')
        .eq('type', order_type)
        .single();

      if (error || !data) throw new Error('Commission config missing');

      commission_rate = Number(data.commission_rate || 0);

      platform_earning = total * commission_rate;
      seller_earning = total - platform_earning;
    }

    // ✅ NAMMA FRESH FLOW
    else if (order_type === 'namma_fresh') {
      const { data, error } = await supabase
        .from('margin_config')
        .select('margin_rate')
        .eq('type', 'namma_fresh')
        .single();

      if (error || !data) throw new Error('Margin config missing');

      margin = total * Number(data.margin_rate || 0);
      platform_earning = margin;
      seller_earning = 0;
    }

    console.log("💰 Earnings:", {
      commission_rate,
      platform_earning,
      seller_earning
    });

    const { error: insertError } = await supabase.from('orders').insert({
      user_id,
      seller_id,
      total,
      order_type,
      commission_rate,
      platform_earning,
      seller_earning,
      margin,
      status: 'pending',
      delivery_status: 'pending',
      payment_status: 'pending'
    });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Create Order Error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}