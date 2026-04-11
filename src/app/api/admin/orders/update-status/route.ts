import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { orderId, status } = await req.json();

    console.log("🔥 Incoming status:", status);

    // ✅ 1. Update order AND fetch row
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error || !order) {
      console.error("❌ Order fetch error:", error);
      throw new Error('Order update failed');
    }

    console.log("📦 Order data:", order);

    // 🔥 2. FIX: safer status check
    if (status?.toLowerCase() === 'delivered') {
      const seller_id = order.seller_id;
      const earning = Number(order.seller_earning || 0);

      console.log("💰 Wallet update triggered:", { seller_id, earning });

      // 🔥 FIX: don't use .single() directly
      const { data: wallet, error: walletError } = await supabase
        .from('seller_wallet')
        .select('*')
        .eq('seller_id', seller_id)
        .maybeSingle();

      if (walletError) {
        console.error("❌ Wallet fetch error:", walletError);
      }

      if (wallet) {
        console.log("🔄 Updating existing wallet");

        await supabase
          .from('seller_wallet')
          .update({
            balance: Number(wallet.balance || 0) + earning
          })
          .eq('seller_id', seller_id);

      } else {
        console.log("🆕 Creating new wallet");

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