import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { orderId, status } = await req.json();

    // ✅ 1. Update order AND get updated row
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    // 🔥 2. IF ORDER DELIVERED → UPDATE WALLET
    if (status === 'delivered') {
      const seller_id = order.seller_id;
      const earning = order.seller_earning;

      console.log("💰 Wallet update triggered:", { seller_id, earning });

      // Check if wallet already exists
      const { data: wallet } = await supabase
        .from('seller_wallet')
        .select('*')
        .eq('seller_id', seller_id)
        .single();

      if (wallet) {
        // ✅ Update existing wallet
        await supabase
          .from('seller_wallet')
          .update({
            balance: wallet.balance + earning
          })
          .eq('seller_id', seller_id);
      } else {
        // ✅ Create new wallet
        await supabase
          .from('seller_wallet')
          .insert({
            seller_id,
            balance: earning
          });
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Update Status Error:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}