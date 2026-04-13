import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    // ✅ READ BODY ONLY ONCE (IMPORTANT FIX)
    const body = await req.json();

    const {
      user_id,
      seller_id,
      total,
      order_type,
      address,
      delivery_mode,
      item_count,
      area,
      items,           // ✅ NEW
      instructions     // ✅ NEW
    } = body;

    // 🚨 VALIDATION
    if (!user_id || !seller_id || !total || !order_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let commission_rate = 0;
    let platform_earning = 0;
    let seller_earning = 0;
    let margin = 0;

    // ✅ COMMISSION LOGIC
    if (['store', 'catering', 'bulk'].includes(order_type)) {
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

    // ✅ NAMMA FRESH (MARGIN MODEL)
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

    console.log("📦 Creating Order:", {
      user_id,
      seller_id,
      total,
      order_type,
      seller_earning
    });

    // ✅ 1. INSERT ORDER + GET ID
    const { data: orderData, error: insertError } = await supabase
      .from('orders')
      .insert({
        user_id,
        seller_id,
        total,
        order_type,
        commission_rate,
        platform_earning,
        seller_earning,
        margin,
        address,
        delivery_mode,
        item_count,
        area,
        instructions,

        status: 'pending',
        delivery_status: 'pending',
        payment_status: 'pending',

        // ⚠️ TEMP STATIC (later replace with real user data)
        customer_name: 'Rajan Kumar',
        customer_phone: '9876543210',
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // ✅ 2. INSERT ORDER ITEMS (VERY IMPORTANT)
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: orderData.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error("❌ Order items insert error:", itemsError);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Create Order Error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}