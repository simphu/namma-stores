import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    console.log("✅ UPDATE CONFIG API HIT");
  try {
    const { type, value, mode } = await req.json();
    console.log("Incoming:", { type, value, mode });

    if (mode === 'commission') {
      const { error } = await supabase
        .from('commission_config')
        .update({ commission_rate: value })
        .eq('type', type);

      if (error) throw error;
    }

    if (mode === 'margin') {
      const { error } = await supabase
        .from('margin_config')
        .update({ margin_rate: value })
        .eq('type', type);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}