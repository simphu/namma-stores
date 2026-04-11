import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { user_id, seller_id, total, order_type } = await req.json();

    let commission_rate = 0;
    let platform_earning = 0;
    let seller_earning = 0;
    let margin = 0;

    if (order_type === 'store' || order_type === 'catering' || order_type === 'bulk') {
      const { data, error } = await supabase
        .from('commission_config')
        .select('commission_rate')
        .eq('type', order_type)
        .single();

      if (error || !data) throw new Error('Commission config missing');

      commission_rate = data.commission_rate;
      platform_earning = total * commission_rate;
      seller_earning = total - platform_earning;
    }

    else if (order_type === 'namma_fresh') {
      const { data, error } = await supabase
        .from('margin_config')
        .select('margin_rate')
        .eq('type', 'namma_fresh')
        .single();

      if (error || !data) throw new Error('Margin config missing');

      margin = total * data.margin_rate;
      platform_earning = margin;
      seller_earning = 0;
    }

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
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}