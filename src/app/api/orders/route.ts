import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, total, address, instructions, seller_id, user_id } = body;

    // 1. Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          status: 'pending',
          total,
          address,
          instructions,
          seller_id,    
           user_id,
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Insert order items
    const itemsToInsert = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    return NextResponse.json({
      success: true,
      orderId: order.id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}