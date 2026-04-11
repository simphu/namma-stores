import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: commission } = await supabase
      .from('commission_config')
      .select('*');

    const { data: margin } = await supabase
      .from('margin_config')
      .select('*');

    return NextResponse.json({
      commission,
      margin
    });

  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}