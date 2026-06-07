import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const ADMIN_CHAT_USERNAME = 'riqqboy'; // admin Telegram
const WA_CONFIRM = '6282172222494';

async function sendMsg(chatId: string | number, text: string) {
  if (!BOT_TOKEN) return;
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
  return res.json();
}

async function getDB() {
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

    const db = await getDB();

    switch (cmd) {
      case '/start':
      case '/help':
        await sendMsg(chatId,
          `🎮 <b>VALLEY.PEDIA BOT</b>\n` +
          `by @${ADMIN_CHAT_USERNAME}\n` +
          `━━━━━━━━━━━━━━━━━━━\n\n` +
          `📊 <b>STATISTIK</b>\n` +
          `/statistic — Ringkasan lengkap\n` +
          `/revenue — Pendapatan per status\n\n` +
          `📦 <b>PRODUK</b>\n` +
          `/listproduct — Semua produk\n` +
          `/addproduct Nama|Harga|Desc — Tambah\n` +
          `/deleteproduct NamaProduk — Hapus\n\n` +
          `🛍️ <b>ORDER</b>\n` +
          `/orders — 10 order terbaru\n` +
          `/pendingorders — Order pending\n` +
          `/setstatus VP-xxx paid — Ubah status\n` +
          `/cariorder Nama — Cari order\n\n` +
          `⭐ <b>TESTIMONI</b>\n` +
          `/testilist — Lihat testimoni terbaru\n` +
          `/addtesti Nama|Rating|Komentar\n` +
          `/deletetesti ID\n\n` +
          `⚙️ <b>SETTINGS</b>\n` +
          `/setwa NomorBaru — Ganti nomor WA\n` +
          `/setsetting key|value — Simpan setting\n` +
          `/getsettings — Lihat semua settings\n\n` +
          `📝 <b>FAQ & KONTEN</b>\n` +
          `/addfaq Pertanyaan|Jawaban\n` +
          `/listfaq — Lihat semua FAQ\n\n` +
          `/ping — Cek bot aktif`
        );
        break;

      case '/ping':
        await sendMsg(chatId, `✅ <b>VALLEY.PEDIA Bot aktif!</b>\nWA Admin: ${WA_CONFIRM}`);
        break;

      // ===== STATISTIK =====
      case '/statistic': {
        const [tot, paid, pend, prod] = await Promise.all([
          db.from('orders').select('*', { count: 'exact', head: true }),
          db.from('orders').select('total_amount').eq('status', 'paid'),
          db.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          db.from('products').select('*', { count: 'exact', head: true }),
        ]);
        const rev = (paid.data || []).reduce((a: number, b: any) => a + (b.total_amount || 0), 0);
        await sendMsg(chatId,
          `📊 <b>STATISTIK VALLEY.PEDIA</b>\n━━━━━━━━━━━━━━━\n\n` +
          `🛍️ Total Order: <b>${tot.count || 0}</b>\n` +
          `⏳ Pending: <b>${pend.count || 0}</b>\n` +
          `✅ Paid: <b>${paid.data?.length || 0}</b>\n` +
          `📦 Produk Aktif: <b>${prod.count || 0}</b>\n` +
          `💰 Pendapatan: <b>Rp ${rev.toLocaleString('id-ID')}</b>\n\n` +
          `🕐 ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB`
        );
        break;
      }

      case '/revenue': {
        const { data } = await db.from('orders').select('status, total_amount');
        const byStatus: Record<string, number> = {};
        (data || []).forEach((o: any) => { byStatus[o.status] = (byStatus[o.status] || 0) + (o.total_amount || 0); });
        const lines = Object.entries(byStatus).map(([s, v]) => `• ${s}: Rp ${v.toLocaleString('id-ID')}`).join('\n');
        await sendMsg(chatId, `💰 <b>PENDAPATAN PER STATUS</b>\n━━━━━━━━━━\n\n${lines || 'Belum ada data.'}`);
        break;
      }

      // ===== PRODUK =====
      case '/listproduct': {
        const { data } = await db.from('products').select('id, name, price, status').order('created_at', { ascending: false }).limit(15);
        if (!data?.length) { await sendMsg(chatId, '📦 Belum ada produk.'); break; }
        const list = data.map((p: any, i: number) =>
          `${i+1}. <b>${p.name}</b>\n   Rp ${p.price?.toLocaleString('id-ID')} [${p.status}]\n   ID: <code>${p.id}</code>`
        ).join('\n\n');
        await sendMsg(chatId, `📦 <b>DAFTAR PRODUK</b>\n━━━━━━━━━━\n\n${list}`);
        break;
      }

      case '/addproduct': {
        const raw = args.join(' ');
        const [name, priceStr, ...descP] = raw.split('|');
        if (!name || !priceStr) { await sendMsg(chatId, '❌ Format: /addproduct Nama|Harga|Deskripsi'); break; }
        const { error } = await db.from('products').insert({ name: name.trim(), price: parseInt(priceStr.trim()), description: descP.join('|').trim(), status: 'active' });
        await sendMsg(chatId, error ? `❌ ${error.message}` : `✅ Produk <b>${name.trim()}</b> ditambahkan!`);
        break;
      }

      case '/deleteproduct': {
        const name = args.join(' ').trim();
        if (!name) { await sendMsg(chatId, '❌ Format: /deleteproduct NamaProduk'); break; }
        const { error } = await db.from('products').delete().ilike('name', `%${name}%`);
        await sendMsg(chatId, error ? `❌ ${error.message}` : `✅ Produk dengan nama "<b>${name}</b>" dihapus.`);
        break;
      }

      // ===== ORDER =====
      case '/orders': {
        const { data } = await db.from('orders').select('order_id, customer_name, customer_whatsapp, total_amount, status, payment_method, created_at').order('created_at', { ascending: false }).limit(10);
        if (!data?.length) { await sendMsg(chatId, '🛍️ Belum ada order.'); break; }
        const list = data.map((o: any) =>
          `• <code>${o.order_id}</code>\n  👤 ${o.customer_name} | 📱 ${o.customer_whatsapp}\n  💰 Rp ${o.total_amount?.toLocaleString('id-ID')} | <b>${o.status}</b>`
        ).join('\n\n');
        await sendMsg(chatId, `🛍️ <b>10 ORDER TERBARU</b>\n━━━━━━━━━━\n\n${list}`);
        break;
      }

      case '/pendingorders': {
        const { data } = await db.from('orders').select('order_id, customer_name, customer_whatsapp, total_amount, payment_method').eq('status', 'pending').order('created_at', { ascending: false });
        if (!data?.length) { await sendMsg(chatId, '✅ Tidak ada order pending!'); break; }
        const list = data.map((o: any) =>
          `• <code>${o.order_id}</code>\n  👤 ${o.customer_name} | 📱 ${o.customer_whatsapp}\n  Rp ${o.total_amount?.toLocaleString('id-ID')} via ${o.payment_method}`
        ).join('\n\n');
        await sendMsg(chatId, `⏳ <b>PENDING (${data.length})</b>\n━━━━━━━━━━\n\n${list}`);
        break;
      }

      case '/setstatus': {
        const [orderId, newStatus] = args;
        const valid = ['paid','completed','cancelled','pending','expired','failed'];
        if (!orderId || !newStatus) { await sendMsg(chatId, '❌ Format: /setstatus VP-xxx paid'); break; }
        if (!valid.includes(newStatus)) { await sendMsg(chatId, `❌ Status valid: ${valid.join(' | ')}`); break; }
        const { error } = await db.from('orders').update({ status: newStatus }).eq('order_id', orderId);
        await sendMsg(chatId, error ? `❌ ${error.message}` : `✅ <code>${orderId}</code> → <b>${newStatus}</b>`);
        break;
      }

      case '/cariorder': {
        const kw = args.join(' ').trim();
        if (!kw) { await sendMsg(chatId, '❌ Format: /cariorder Nama'); break; }
        const { data } = await db.from('orders').select('order_id, customer_name, customer_whatsapp, total_amount, status').ilike('customer_name', `%${kw}%`).limit(5);
        if (!data?.length) { await sendMsg(chatId, `🔍 Tidak ada order untuk "${kw}"`); break; }
        const list = data.map((o: any) =>
          `• <code>${o.order_id}</code> — ${o.customer_name}\n  📱 ${o.customer_whatsapp} | Rp ${o.total_amount?.toLocaleString('id-ID')} | <b>${o.status}</b>`
        ).join('\n\n');
        await sendMsg(chatId, `🔍 <b>Hasil: "${kw}"</b>\n\n${list}`);
        break;
      }

      // ===== TESTIMONI =====
      case '/testilist': {
        const { data } = await db.from('testimonials').select('id, name, rating, comment').order('created_at', { ascending: false }).limit(10);
        if (!data?.length) { await sendMsg(chatId, '⭐ Belum ada testimoni.'); break; }
        const list = data.map((t: any) =>
          `• <b>${t.name}</b> ⭐${t.rating}\n  "${t.comment?.slice(0,80)}..."\n  ID: <code>${t.id}</code>`
        ).join('\n\n');
        await sendMsg(chatId, `⭐ <b>TESTIMONI TERBARU</b>\n━━━━━━━━━━\n\n${list}`);
        break;
      }

      case '/addtesti': {
        const raw = args.join(' ');
        const [name, ratingStr, ...cP] = raw.split('|');
        if (!name || !ratingStr || !cP.length) { await sendMsg(chatId, '❌ Format: /addtesti Nama|Rating|Komentar'); break; }
        const rating = parseInt(ratingStr.trim());
        if (isNaN(rating) || rating < 1 || rating > 5) { await sendMsg(chatId, '❌ Rating 1-5'); break; }
        const { error } = await db.from('testimonials').insert({ name: name.trim(), rating, comment: cP.join('|').trim() });
        await sendMsg(chatId, error ? `❌ ${error.message}` : `✅ Testimoni <b>${name.trim()}</b> (⭐${rating}) ditambahkan!`);
        break;
      }

      case '/deletetesti': {
        const id = args[0];
        if (!id) { await sendMsg(chatId, '❌ Format: /deletetesti ID'); break; }
        const { error } = await db.from('testimonials').delete().eq('id', id);
        await sendMsg(chatId, error ? `❌ ${error.message}` : `✅ Testimoni <code>${id}</code> dihapus.`);
        break;
      }

      // ===== SETTINGS =====
      case '/getsettings': {
        const { data } = await db.from('settings').select('key, value').order('key');
        if (!data?.length) { await sendMsg(chatId, '⚙️ Belum ada settings.'); break; }
        const list = data.map((s: any) => `• <b>${s.key}</b>: ${s.value}`).join('\n');
        await sendMsg(chatId, `⚙️ <b>SETTINGS</b>\n━━━━━━━━━━\n\n${list}`);
        break;
      }

      case '/setsetting': {
        const raw = args.join(' ');
        const sepIdx = raw.indexOf('|');
        if (sepIdx === -1) { await sendMsg(chatId, '❌ Format: /setsetting key|value'); break; }
        const key = raw.slice(0, sepIdx).trim();
        const value = raw.slice(sepIdx + 1).trim();
        const { error } = await db.from('settings').upsert({ key, value }, { onConflict: 'key' });
        await sendMsg(chatId, error ? `❌ ${error.message}` : `✅ Setting <b>${key}</b> = ${value}`);
        break;
      }

      case '/setwa': {
        const newWa = args[0];
        if (!newWa) { await sendMsg(chatId, '❌ Format: /setwa 628xxx'); break; }
        const { error } = await db.from('settings').upsert({ key: 'wa_number', value: newWa }, { onConflict: 'key' });
        await sendMsg(chatId, error ? `❌ ${error.message}` : `✅ Nomor WA diubah ke <b>${newWa}</b>`);
        break;
      }

      // ===== FAQ =====
      case '/addfaq': {
        const raw = args.join(' ');
        const sepIdx = raw.indexOf('|');
        if (sepIdx === -1) { await sendMsg(chatId, '❌ Format: /addfaq Pertanyaan|Jawaban'); break; }
        const question = raw.slice(0, sepIdx).trim();
        const answer = raw.slice(sepIdx + 1).trim();
        const { error } = await db.from('faqs').insert({ question, answer, order: 99 });
        await sendMsg(chatId, error ? `❌ ${error.message}` : `✅ FAQ ditambahkan: <b>${question}</b>`);
        break;
      }

      case '/listfaq': {
        const { data } = await db.from('faqs').select('id, question').order('order', { ascending: true }).limit(15);
        if (!data?.length) { await sendMsg(chatId, '📝 Belum ada FAQ.'); break; }
        const list = data.map((f: any, i: number) => `${i+1}. ${f.question}\n   ID: <code>${f.id}</code>`).join('\n\n');
        await sendMsg(chatId, `📝 <b>DAFTAR FAQ</b>\n━━━━━━━━━━\n\n${list}`);
        break;
      }

      default:
        if (text.startsWith('/')) {
          await sendMsg(chatId, `❓ Command tidak dikenali. Ketik /help`);
        }
    }
  } catch (err: any) {
    console.error('Bot error:', err?.message || err);
  }
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  if (url.searchParams.get('action') === 'setwebhook') {
    const wUrl = url.searchParams.get('url');
    if (!wUrl || !BOT_TOKEN) return NextResponse.json({ error: 'Missing params' }, { status: 400 });
    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: wUrl, allowed_updates: ['message'] }),
    });
    return NextResponse.json(await r.json());
  }
  return NextResponse.json({ status: 'VALLEY.PEDIA Bot active', admin: `@${ADMIN_CHAT_USERNAME}` });
}
