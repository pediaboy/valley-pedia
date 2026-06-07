import { NextRequest, NextResponse } from 'next/server';

// Token diambil dari env — pasang di Vercel environment variables
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const WA_NUMBER = '6282172222494';

async function sendMessage(chatId: string | number, text: string, parseMode: string = 'HTML') {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode }),
  });
}

async function getSupabase() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;
    if (!message) return NextResponse.json({ ok: true });

    const chatId = String(message.chat.id);
    const text = (message.text || '').trim();
    const parts = text.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    const supabase = await getSupabase();

    switch (cmd) {
      // ===== INFO =====
      case '/start':
      case '/help': {
        await sendMessage(chatId,
          `🌌 <b>VALLEY.PEDIA BOT</b>\n` +
          `━━━━━━━━━━━━━━━━━━\n\n` +
          `Halo, Admin! Ini daftar command yang tersedia:\n\n` +
          `📊 <b>STATISTIK</b>\n` +
          `/statistic — Ringkasan order & pendapatan\n` +
          `/revenue — Pendapatan detail per status\n\n` +
          `📦 <b>PRODUK</b>\n` +
          `/listproduct — Semua produk aktif\n` +
          `/addproduct Nama|Harga|Deskripsi — Tambah produk\n\n` +
          `🛍️ <b>ORDER</b>\n` +
          `/orders — 10 order terbaru\n` +
          `/pendingorders — Semua order pending\n` +
          `/setstatus VP-xxx [paid|completed|cancelled] — Ubah status\n` +
          `/cariorder NamaPelanggan — Cari order by nama\n\n` +
          `⭐ <b>TESTIMONI</b>\n` +
          `/addtestimonial Nama|Rating|Komentar\n\n` +
          `ℹ️ <b>LAINNYA</b>\n` +
          `/ping — Cek bot aktif\n` +
          `/help — Tampilkan pesan ini\n\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `WA Admin: <code>${WA_NUMBER}</code>`
        );
        break;
      }

      case '/ping': {
        await sendMessage(chatId, '✅ <b>Bot aktif!</b> VALLEY.PEDIA online.');
        break;
      }

      // ===== STATISTIK =====
      case '/statistic': {
        const [{ count: totalOrder }, { count: totalProduct }, paidRes] = await Promise.all([
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('total_amount').eq('status', 'paid'),
        ]);
        const { count: pendingCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending');
        const totalRev = (paidRes.data || []).reduce((a: number, b: any) => a + (b.total_amount || 0), 0);
        await sendMessage(chatId,
          `📊 <b>STATISTIK VALLEY.PEDIA</b>\n━━━━━━━━━━━━━━━\n\n` +
          `🛍️ Total Order: <b>${totalOrder}</b>\n` +
          `⏳ Order Pending: <b>${pendingCount}</b>\n` +
          `📦 Total Produk: <b>${totalProduct}</b>\n` +
          `💰 Pendapatan (paid): <b>Rp ${totalRev.toLocaleString('id-ID')}</b>\n\n` +
          `Update: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB`
        );
        break;
      }

      case '/revenue': {
        const { data: orders } = await supabase.from('orders').select('status, total_amount');
        const byStatus: Record<string, number> = {};
        (orders || []).forEach((o: any) => {
          byStatus[o.status] = (byStatus[o.status] || 0) + (o.total_amount || 0);
        });
        const lines = Object.entries(byStatus).map(([s, v]) => `• ${s}: Rp ${v.toLocaleString('id-ID')}`).join('\n');
        await sendMessage(chatId, `💰 <b>PENDAPATAN PER STATUS</b>\n━━━━━━━━━━━━━\n\n${lines || 'Belum ada data.'}`);
        break;
      }

      // ===== PRODUK =====
      case '/listproduct': {
        const { data } = await supabase.from('products').select('name, price, status').order('created_at', { ascending: false }).limit(15);
        if (!data?.length) { await sendMessage(chatId, '📦 Belum ada produk.'); break; }
        const list = data.map((p: any, i: number) =>
          `${i + 1}. <b>${p.name}</b> — Rp ${p.price?.toLocaleString('id-ID')} [${p.status}]`
        ).join('\n');
        await sendMessage(chatId, `📦 <b>DAFTAR PRODUK</b>\n━━━━━━━━━━━━━\n\n${list}`);
        break;
      }

      case '/addproduct': {
        // Format: /addproduct Nama Produk|50000|Deskripsi produk
        const raw = args.join(' ');
        const [name, priceStr, ...descParts] = raw.split('|');
        if (!name || !priceStr) {
          await sendMessage(chatId, '❌ Format: /addproduct Nama|Harga|Deskripsi');
          break;
        }
        const { error } = await supabase.from('products').insert({
          name: name.trim(),
          price: parseInt(priceStr.trim()),
          description: descParts.join('|').trim() || '',
          status: 'active',
        });
        await sendMessage(chatId, error ? `❌ Gagal: ${error.message}` : `✅ Produk <b>${name.trim()}</b> berhasil ditambahkan!`);
        break;
      }

      // ===== ORDER =====
      case '/orders': {
        const { data } = await supabase.from('orders').select('order_id, customer_name, total_amount, status, payment_method, created_at').order('created_at', { ascending: false }).limit(10);
        if (!data?.length) { await sendMessage(chatId, '🛍️ Belum ada order.'); break; }
        const list = data.map((o: any) =>
          `• <code>${o.order_id}</code>\n  👤 ${o.customer_name} | Rp ${o.total_amount?.toLocaleString('id-ID')} | <b>${o.status}</b>`
        ).join('\n\n');
        await sendMessage(chatId, `🛍️ <b>10 ORDER TERBARU</b>\n━━━━━━━━━━━━━\n\n${list}`);
        break;
      }

      case '/pendingorders': {
        const { data } = await supabase.from('orders').select('order_id, customer_name, customer_whatsapp, total_amount, payment_method, created_at').eq('status', 'pending').order('created_at', { ascending: false });
        if (!data?.length) { await sendMessage(chatId, '✅ Tidak ada order pending saat ini!'); break; }
        const list = data.map((o: any) =>
          `• <code>${o.order_id}</code>\n  👤 ${o.customer_name} | 📱 ${o.customer_whatsapp}\n  💰 Rp ${o.total_amount?.toLocaleString('id-ID')} via ${o.payment_method}`
        ).join('\n\n');
        await sendMessage(chatId, `⏳ <b>ORDER PENDING (${data.length})</b>\n━━━━━━━━━━━━━\n\n${list}`);
        break;
      }

      case '/setstatus': {
        const [orderId, newStatus] = args;
        const validStatus = ['paid', 'completed', 'cancelled', 'pending', 'expired', 'failed'];
        if (!orderId || !newStatus) {
          await sendMessage(chatId, '❌ Format: /setstatus VP-xxxx paid\n\nStatus valid: paid | completed | cancelled | pending | expired | failed');
          break;
        }
        if (!validStatus.includes(newStatus)) {
          await sendMessage(chatId, `❌ Status tidak valid. Pilih: ${validStatus.join(' | ')}`);
          break;
        }
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('order_id', orderId);
        await sendMessage(chatId, error
          ? `❌ Gagal update: ${error.message}`
          : `✅ Order <code>${orderId}</code> berhasil diubah ke <b>${newStatus}</b>`
        );
        break;
      }

      case '/cariorder': {
        const keyword = args.join(' ').trim();
        if (!keyword) { await sendMessage(chatId, '❌ Format: /cariorder NamaPelanggan'); break; }
        const { data } = await supabase.from('orders').select('order_id, customer_name, customer_whatsapp, total_amount, status').ilike('customer_name', `%${keyword}%`).limit(5);
        if (!data?.length) { await sendMessage(chatId, `🔍 Tidak ada order dengan nama "${keyword}"`); break; }
        const list = data.map((o: any) =>
          `• <code>${o.order_id}</code> — ${o.customer_name}\n  📱 ${o.customer_whatsapp} | Rp ${o.total_amount?.toLocaleString('id-ID')} | <b>${o.status}</b>`
        ).join('\n\n');
        await sendMessage(chatId, `🔍 <b>Hasil Pencarian: "${keyword}"</b>\n\n${list}`);
        break;
      }

      // ===== TESTIMONI =====
      case '/addtestimonial': {
        const raw = args.join(' ');
        const [name, ratingStr, ...commentParts] = raw.split('|');
        if (!name || !ratingStr || !commentParts.length) {
          await sendMessage(chatId, '❌ Format: /addtestimonial Nama|Rating(1-5)|Komentar kamu di sini');
          break;
        }
        const rating = parseInt(ratingStr.trim());
        if (isNaN(rating) || rating < 1 || rating > 5) {
          await sendMessage(chatId, '❌ Rating harus angka 1–5');
          break;
        }
        const { error } = await supabase.from('testimonials').insert({
          name: name.trim(),
          rating,
          comment: commentParts.join('|').trim(),
        });
        await sendMessage(chatId, error
          ? `❌ Gagal: ${error.message}`
          : `✅ Testimoni dari <b>${name.trim()}</b> (⭐${rating}) berhasil ditambahkan!`
        );
        break;
      }

      default: {
        if (text.startsWith('/')) {
          await sendMessage(chatId, `❓ Command tidak dikenali.\n\nKetik /help untuk lihat daftar command.`);
        }
      }
    }
  } catch (err: any) {
    console.error('Telegram bot error:', err);
  }

  return NextResponse.json({ ok: true });
}

// Endpoint GET untuk set webhook via URL (opsional, bisa juga manual)
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');
  if (action === 'setwebhook') {
    const webhookUrl = url.searchParams.get('url');
    if (!webhookUrl || !BOT_TOKEN) return NextResponse.json({ error: 'Missing url or token' }, { status: 400 });
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  }
  return NextResponse.json({ status: 'Valley.Pedia Telegram Bot active' });
}
