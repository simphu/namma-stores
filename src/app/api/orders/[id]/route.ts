import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!order) return NextResponse.json(null);

  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id);

  return NextResponse.json({
    id: order.id,
    storeName: order.store_name,
    totalAmount: order.total_amount,
    status: order.status,
    date: order.created_at,
    items: items || [],
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();

  const { status } = body;

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}