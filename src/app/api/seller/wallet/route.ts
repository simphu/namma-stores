import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const seller_id = searchParams.get('seller_id');

    if (!seller_id) {
      return NextResponse.json({ error: 'Missing seller_id' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('seller_wallet')
      .select('*')
      .eq('seller_id', seller_id)
      .single();

    if (error) {
      return NextResponse.json({ balance: 0 });
    }

    return NextResponse.json(data);

  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}