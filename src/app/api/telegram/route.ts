import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

async function sendMessage(chatId: string, text: string) {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

export async function POST(req: NextRequest) {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const body = await req.json();
  const message = body?.message;
  if (!message) return NextResponse.json({ ok: true });

  const chatId = String(message.chat.id);
  const text = message.text || '';
  const [cmd, ...args] = text.split(' ');

  try {
    switch (cmd) {
      case '/statistic': {
        const [{ count: orderCount }, { count: productCount }] = await Promise.all([
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }),
        ]);
        const { data: revenue } = await supabase.from('orders').select('total_amount').eq('status', 'paid');
        const totalRev = revenue?.reduce((a: number, b: any) => a + (b.total_amount || 0), 0) || 0;
        await sendMessage(chatId, `📊 <b>STATISTIK VALLEY.PEDIA</b>\n\n📦 Total Order: ${orderCount}\n🛍️ Total Produk: ${productCount}\n💰 Pendapatan: Rp ${totalRev.toLocaleString('id-ID')}`);
        break;
      }
      case '/listproduct': {
        const { data } = await supabase.from('products').select('name, price, status').limit(10);
        const list = data?.map((p: any) => `• ${p.name} - Rp ${p.price?.toLocaleString('id-ID')} [${p.status}]`).join('\n') || 'Tidak ada produk';
        await sendMessage(chatId, `🛍️ <b>DAFTAR PRODUK</b>\n\n${list}`);
        break;
      }
      case '/addtestimonial': {
        const [name, rating, ...commentParts] = args.join(' ').split('|');
        if (name && rating && commentParts.length) {
          await supabase.from('testimonials').insert({ name: name.trim(), rating: Number(rating), comment: commentParts.join('|').trim() });
          await sendMessage(chatId, `✅ Testimoni dari <b>${name}</b> berhasil ditambahkan!`);
        } else {
          await sendMessage(chatId, '❌ Format: /addtestimonial Nama|Rating|Komentar');
        }
        break;
      }
      case '/setstatus': {
        const [orderId, newStatus] = args;
        if (orderId && newStatus) {
          await supabase.from('orders').update({ status: newStatus }).eq('order_id', orderId);
          await sendMessage(chatId, `✅ Status order <b>${orderId}</b> diubah ke <b>${newStatus}</b>`);
        } else {
          await sendMessage(chatId, '❌ Format: /setstatus VP-xxx status');
        }
        break;
      }
      case '/start':
      case '/help':
      default:
        await sendMessage(chatId, `🌌 <b>VALLEY.PEDIA BOT</b>\n\n/statistic - Statistik\n/listproduct - Daftar produk\n/addtestimonial Nama|Rating|Komentar\n/setstatus ORDER_ID status\n/help - Bantuan`);
    }
  } catch {
    await sendMessage(chatId, '❌ Terjadi error. Coba lagi.');
  }

  return NextResponse.json({ ok: true });
}
