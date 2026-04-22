// /src/app/api/orders/create/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ✅ SERVER-SIDE SUPABASE (IMPORTANT)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔥 MUST ADD IN ENV
);

export async function POST(req: Request) {
  try {
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
      items,
      instructions
    } = body;

    // 🔒 STRICT VALIDATION
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

    // ================================
    // 💰 COMMISSION / MARGIN LOGIC
    // ================================

    if (['store', 'catering', 'bulk'].includes(order_type)) {
      const { data, error } = await supabase
        .from('commission_config')
        .select('commission_rate')
        .eq('type', order_type)
        .single();

      if (error || !data) {
        console.error("❌ Commission config missing:", error);
        throw new Error('Commission config missing');
      }

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

      if (error || !data) {
        console.error("❌ Margin config missing:", error);
        throw new Error('Margin config missing');
      }

      margin = total * data.margin_rate;
      platform_earning = margin;
      seller_earning = 0;
    }

    console.log("📦 Creating Order:", {
      user_id,
      seller_id,
      total,
      order_type,
    });

    // ================================
    // 🧾 1. INSERT ORDER
    // ================================

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

        customer_name: 'Guest User',
        customer_phone: '9999999999',
      })
      .select()
      .single();

    if (insertError) {
      console.error("❌ ORDER INSERT ERROR:", insertError);
      throw insertError;
    }

    // ================================
    // 🧾 2. INSERT ORDER ITEMS
    // ================================

    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: orderData.id,
        product_id: item.id, // 🔥 IMPORTANT FIX
        name: item.name,
        price: item.price,
        qty: item.qty,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error("❌ ORDER ITEMS ERROR:", itemsError);
      }
    }

    return NextResponse.json({
      success: true,
      order_id: orderData.id,
    });

  } catch (error: any) {
    console.error('🔥 CREATE ORDER ERROR:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to create order',
      },
      { status: 500 }
    );
  }
}