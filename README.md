# VALLEY.PEDIA

Platform gaming premium untuk jual beli akun, joki rank, room wangi, dan layanan Starlight. Dibangun dengan Next.js 14, Supabase, dan Tailwind CSS. Desain dark galaxy dengan nuansa hitam dan biru neon.

## Fitur

- Halaman produk: Buy/Sell Akun, Room Wangi (Basic/Premium/KYVIP), Joki Rank, Joki Akun, Starlight
- Sistem checkout dengan invoice manual dan konfirmasi via WhatsApp
- Admin panel dengan login terproteksi (tidak langsung ke dashboard)
- Bot Telegram untuk kelola order, produk, dan statistik tanpa buka browser
- Halaman FAQ, Testimonial, Syarat & Ketentuan, Developer, dan Contact
- Manajemen konten via admin: produk, order, banner, FAQ, testimonial, settings

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **Database:** Supabase (PostgreSQL)
- **Deploy:** Vercel (auto-deploy dari GitHub main)
- **Bot:** Telegram Bot API (webhook via Next.js API Route)

## Struktur Folder

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── admin/
│   │   ├── page.tsx          # Halaman login admin
│   │   ├── dashboard/        # Dashboard utama
│   │   ├── orders/           # Kelola order
│   │   ├── products/         # Kelola produk
│   │   ├── testimonials/     # Kelola testimoni
│   │   ├── banners/          # Kelola banner
│   │   ├── faqs/             # Kelola FAQ
│   │   ├── terms/            # Syarat & Ketentuan
│   │   └── settings/         # Pengaturan (WA, Telegram, dll)
│   ├── api/
│   │   └── telegram/
│   │       └── route.ts      # Webhook Telegram Bot
│   ├── checkout/             # Halaman checkout + invoice
│   ├── payment-success/      # Halaman sukses order
│   ├── buy-sell/             # Jual beli akun
│   ├── room-wangi/           # Room Wangi (basic/premium/kyvip)
│   ├── joki-rank/            # Joki Rank
│   ├── joki-akun/            # Joki Akun
│   ├── starlight/            # Starlight
│   ├── testimonial/          # Halaman testimoni
│   ├── faq/                  # FAQ
│   ├── contact/              # Contact
│   ├── developer/            # Info developer
│   └── syarat-ketentuan/     # Syarat & Ketentuan
├── components/
│   ├── layout/               # Komponen layout (Navbar, Footer)
│   └── ui/                   # Komponen UI reusable
└── lib/
    └── supabase.ts           # Supabase client
```

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/pediaboy/valley-pedia.git
cd valley-pedia
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka SQL Editor, jalankan file `supabase/schema.sql`
3. Copy URL dan Anon Key dari **Settings > API**

### 3. Environment Variables

Buat file `.env.local` dari `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# WhatsApp konfirmasi pembayaran
NEXT_PUBLIC_WA_NUMBER=6282172222494

# Admin login (default: admin / valleypedia2025)
NEXT_PUBLIC_ADMIN_USER=admin
NEXT_PUBLIC_ADMIN_PASS=gantipasswordini

# Telegram Bot
TELEGRAM_BOT_TOKEN=1234567890:ABCxxx...
```

> **Penting:** Ganti `NEXT_PUBLIC_ADMIN_PASS` dengan password yang kuat sebelum deploy ke production.

### 4. Jalankan di Lokal

```bash
npm run dev
# Buka http://localhost:3000
```

### 5. Deploy ke Vercel

1. Push ke GitHub (sudah otomatis terhubung)
2. Import project di [vercel.com](https://vercel.com)
3. Tambahkan semua environment variables di Vercel Dashboard
4. Deploy — auto-deploy aktif setiap push ke branch `main`

### 6. Setup Telegram Bot

1. Buat bot via [@BotFather](https://t.me/BotFather) di Telegram
2. Copy token dan masukkan ke env `TELEGRAM_BOT_TOKEN`
3. Set webhook setelah deploy:

```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://valley-pedia.vercel.app/api/telegram
```

Atau akses URL ini setelah deploy:
```
https://valley-pedia.vercel.app/api/telegram?action=setwebhook&url=https://valley-pedia.vercel.app/api/telegram
```

### Command Bot Telegram

| Command | Fungsi |
|---|---|
| `/help` | Tampilkan semua command |
| `/statistic` | Statistik order & pendapatan |
| `/revenue` | Pendapatan per status |
| `/listproduct` | Daftar semua produk |
| `/addproduct Nama\|Harga\|Deskripsi` | Tambah produk baru |
| `/orders` | 10 order terbaru |
| `/pendingorders` | Semua order pending |
| `/setstatus VP-xxx paid` | Ubah status order |
| `/cariorder Nama` | Cari order by nama pelanggan |
| `/addtestimonial Nama\|Rating\|Komentar` | Tambah testimoni |
| `/ping` | Cek bot aktif |

## Admin Panel

Akses di `/admin` — akan muncul halaman login sebelum masuk ke dashboard.

Default credentials (wajib diganti via env):
- Username: `admin`
- Password: `valleypedia2025`

## Sistem Pembayaran

Tidak menggunakan payment gateway eksternal. Pembayaran dilakukan via transfer bank/e-wallet manual dengan sistem invoice:

1. User isi form order → sistem buat invoice dengan nominal unik
2. User transfer ke rekening yang tertera (BCA / BRI / Dana / GoPay / OVO)
3. User konfirmasi via WhatsApp ke 082172222494 dengan format otomatis
4. Admin verifikasi dan ubah status order via panel atau bot Telegram

## Kontak

WhatsApp: 082172222494

---

*VALLEY.PEDIA — Premium Gaming Services*
