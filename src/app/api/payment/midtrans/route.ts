import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { order_id, transaction_status, fraud_status } = body;

  let status = 'pending';
  if (transaction_status === 'capture' && fraud_status === 'accept') status = 'paid';
  else if (transaction_status === 'settlement') status = 'paid';
  else if (['cancel', 'deny', 'failure'].includes(transaction_status)) status = 'failed';
  else if (transaction_status === 'expire') status = 'expired';

  await supabase.from('orders').update({ status }).eq('order_id', order_id);
  return NextResponse.json({ ok: true });
}
