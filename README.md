# 🌌 VALLEY.PEDIA

Platform gaming premium modern dengan desain Black Galaxy Luxury.

## Tech Stack
- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Backend/DB**: Supabase (PostgreSQL)
- **Payment**: Midtrans + Xendit
- **Deploy**: Vercel
- **Bot**: Telegram Bot

## Setup

### 1. Clone repo
```bash
git clone https://github.com/pediaboy/valley-pedia.git
cd valley-pedia
npm install
```

### 2. Setup Supabase
1. Buat project baru di [supabase.com](https://supabase.com)
2. Pergi ke SQL Editor
3. Jalankan isi file `supabase/schema.sql`
4. Copy URL dan Anon Key dari Settings > API

### 3. Environment Variables
Copy `.env.example` ke `.env.local` dan isi:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_WA_NUMBER=628xxxxxxxxxx
MIDTRANS_SERVER_KEY=...
XENDIT_SECRET_KEY=...
TELEGRAM_BOT_TOKEN=...
```

### 4. Run Development
```bash
npm run dev
```

### 5. Deploy ke Vercel
1. Push ke GitHub (sudah otomatis via agent)
2. Import project di [vercel.com](https://vercel.com)
3. Tambahkan environment variables
4. Deploy!

### 6. Setup Telegram Bot
1. Buat bot via @BotFather
2. Set webhook: `https://your-domain.vercel.app/api/telegram`
3. Token masukkan ke Supabase Settings atau .env

## Pages
- `/` - Homepage
- `/buy-sell` - Jual beli akun
- `/room-wangi/basic|premium|kyvip` - Room Wangi
- `/joki-rank` - Joki Rank
- `/joki-akun` - Joki Akun
- `/starlight` - Starlight
- `/testimonial` - Testimoni
- `/faq` - FAQ
- `/checkout` - Checkout
- `/payment-success` - Payment Success
- `/developer` - Developer Info
- `/contact` - Contact
- `/admin/dashboard` - Admin Panel

## Admin Panel
Akses di `/admin/dashboard` untuk mengelola semua konten.
