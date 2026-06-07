import { NextRequest, NextResponse } from 'next/server';

const testimonials = [
  { name: "Aldi Pratama", rating: 5, comment: "Room wangi basic udah 2 bulan langganan, MMR naik drastis. Worth it banget, admin fast respon juga!" },
  { name: "Siti Rahayu", rating: 5, comment: "Pertama ragu tapi coba dulu, ternyata legit. Aktivasi cuma 10 menit setelah bayar. Recommended!" },
  { name: "Rizky Aditya", rating: 5, comment: "Udah joki rank sampe Mythic, prosesnya lancar dan aman. Nggak ada masalah sama sekali." },
  { name: "Dewi Lestari", rating: 4, comment: "Starlight pass dapet, harga murah dibanding beli sendiri. Pengiriman cepet, next order lagi." },
  { name: "Bagas Saputro", rating: 5, comment: "Room wangi premium keren banget, game jadi lebih enjoy. Admin selalu fast respon di WA." },
  { name: "Nadia Putri", rating: 5, comment: "Joki akun beres dalam 2 hari, rank naik 3 tier. Puas banget, harga juga masuk akal!" },
  { name: "Fajar Nugroho", rating: 5, comment: "Sudah 3x order di Valley Pedia, selalu aman dan on time. Nggak bakalan pindah ke tempat lain." },
  { name: "Ratna Sari", rating: 4, comment: "Room wangi basic bagus, sempet ada kendala kecil dan langsung dibantu admin. Overall oke!" },
  { name: "Dimas Wahyu", rating: 5, comment: "Trusted! Udah rekomendasiin ke temen-temen, semuanya puas. Harga terjangkau, kualitas mantap." },
  { name: "Anggi Fitriani", rating: 5, comment: "Admin ramah, respon cepat. Layanan room wangi premium bener-bener beda, game makin gampang." },
  { name: "Hendri Susanto", rating: 5, comment: "Udah langganan 4 bulan. Konsisten dan nggak pernah ada masalah. Definitely worth it!" },
  { name: "Yuli Andriani", rating: 4, comment: "Joki rank bagus, rank naik sesuai target. Prosesnya transparan dan admin selalu update progress." },
  { name: "Agus Prabowo", rating: 5, comment: "Valley Pedia terbaik! Room wangi KYVIP bikin farming MMR jadi gampang banget. 10/10!" },
  { name: "Mira Handayani", rating: 5, comment: "Beli starlight lewat sini, proses cuma 5 menit. Murah dan terpercaya, nggak perlu ragu." },
  { name: "Teguh Santoso", rating: 5, comment: "Layanan profesional, harga reasonable. Sudah jadi pelanggan setia hampir setahun." },
  { name: "Linda Kusuma", rating: 4, comment: "Room wangi premium oke banget, tapi kadang butuh waktu lebih lama aktivasi. Overall satisfied!" },
  { name: "Wahyu Pratama", rating: 5, comment: "Gue udah coba banyak layanan gaming, Valley Pedia yang paling reliable. Aman 100%!" },
  { name: "Fitri Rahayu", rating: 5, comment: "Joki akun selesai lebih cepat dari estimasi. Admin profesional dan komunikatif. Top!" },
  { name: "Budi Setiawan", rating: 5, comment: "Room wangi basic murah tapi hasilnya maksimal. Langsung order premium bulan depan!" },
  { name: "Rina Susanti", rating: 5, comment: "Pertama kali order, langsung kecanduan. Fast respon, aman, dan harga bersahabat. 5 bintang!" },
  { name: "Arif Hidayat", rating: 4, comment: "Joki rank profesional banget. Rank gue naik dari Epic ke Legend dalam seminggu. Mantap!" },
  { name: "Sari Dewi", rating: 5, comment: "Udah 6 bulan langganan room wangi. Nggak pernah kecewa, pelayanan selalu top notch!" },
  { name: "Rendi Kusuma", rating: 5, comment: "Konfirmasi bayar gampang banget, langsung via WA. Aktivasi cepat, nggak pakai lama." },
  { name: "Heni Marlina", rating: 5, comment: "Room wangi KYVIP premium banget rasanya. MMR gue naik signifikan dalam sebulan. Love it!" },
  { name: "Fauzi Rahman", rating: 5, comment: "Gue skeptis awalnya, tapi ternyata legit dan aman. Admin nggak pernah ngilang, selalu respon." },
  { name: "Tari Wulandari", rating: 4, comment: "Layanan starlight bagus, cuma harga naik dikit dari sebelumnya. Tapi masih worth it kok!" },
  { name: "Eko Prasetyo", rating: 5, comment: "Best gaming service! Udah nyoba joki rank dan room wangi, dua-duanya memuaskan. GG!" },
  { name: "Nurul Hidayah", rating: 5, comment: "Admin super helpful. Waktu ada masalah teknis, langsung dibantu sampai kelar. Recommended!" },
  { name: "Gilang Ramadhan", rating: 5, comment: "Room wangi premium bikin game jadi jauh lebih enjoyable. Harga terjangkau, hasil nyata!" },
  { name: "Ayu Permata", rating: 4, comment: "Joki akun hasilnya bagus, sesuai request. Sedikit lebih lama dari estimasi tapi masih oke." },
  { name: "Dani Setiawan", rating: 5, comment: "Udah sering order disini, nggak pernah ada yang bikin kecewa. Terpercaya dan profesional!" },
  { name: "Mega Puspita", rating: 5, comment: "Starlight pass gue dapet dalam hitungan menit. Murah, cepat, dan aman. Perfect!" },
  { name: "Iwan Hermawan", rating: 5, comment: "Room wangi membantu banget buat grinding rank. Udah bulan ke-3, nggak ada niat pindah!" },
  { name: "Cindy Pratiwi", rating: 5, comment: "Admin selalu update progress joki. Transparansi bagus banget, bikin tenang. Top service!" },
  { name: "Hendra Gunawan", rating: 4, comment: "Puas sama room wangi basic. Efektif buat grinding. Next bulan upgrade ke premium deh!" },
  { name: "Reza Saputra", rating: 5, comment: "Nggak pernah khawatir soal keamanan akun. Admin profesional dan layanan selalu on point!" },
  { name: "Dewi Anggraeni", rating: 5, comment: "Room wangi KYVIP worth every penny. MMR naik drastis dan game makin seru. Best invest!" },
  { name: "Anton Wijaya", rating: 5, comment: "Beli joki rank + room wangi sekaligus, dua-duanya memuaskan. Valley Pedia emang juara!" },
  { name: "Sri Lestari", rating: 4, comment: "Layanan bagus, admin ramah. Cuma waktu konfirmasi agak lama tapi hasilnya tetap oke." },
  { name: "Joni Pratama", rating: 5, comment: "Udah recommend ke 5 teman, semuanya satisfied. Valley Pedia memang yang paling terpercaya!" },
  { name: "Putri Maharani", rating: 5, comment: "First order dan langsung impressed. Fast respon, aktivasi cepat, no drama. 5 stars!" },
  { name: "Yoga Firmansyah", rating: 5, comment: "Joki rank dari Warrior ke Mythic, beres dalam 10 hari. Amazing! Next order joki akun nih." },
  { name: "Bella Safitri", rating: 5, comment: "Room wangi premium udah 2 bulan, rank naik terus. Admin selalu ada kalau ada pertanyaan." },
  { name: "Ridwan Hakim", rating: 4, comment: "Layanan oke, harga competitive. Wish ada lebih banyak pilihan paket tapi overall satisfied!" },
  { name: "Tyas Kusuma", rating: 5, comment: "Beli starlight murah dan prosesnya kilat. Admin nggak pelit informasi, everything clear!" },
  { name: "Dodi Santoso", rating: 5, comment: "Udah setahun jadi pelanggan. Konsisten bagus dari awal sampai sekarang. Nggak pindah!" },
  { name: "Lina Amelia", rating: 5, comment: "Room wangi bikin quality of life gaming naik drastis. Invest terbaik buat gamer mobile!" },
  { name: "Farid Maulana", rating: 5, comment: "Joki akun selesai on schedule, hasil akurat sesuai request. Admin profesional banget!" },
  { name: "Vina Oktavia", rating: 4, comment: "Puas sama semua layanan. Room wangi dan starlight dua-duanya bagus. Langganan terus deh!" },
  { name: "Wahid Sulaiman", rating: 5, comment: "Valley Pedia one stop solution buat gaming needs. Aman, cepat, murah. Ga ada saingannya!" },
  { name: "Nita Permatasari", rating: 5, comment: "Admin @riqqboy fast banget respon. Order malem, aktivasi pagi. Pelayanan 24 jam keren!" },
];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');
  
  // Simple guard
  if (secret !== 'vp_seed_2025') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await db.from('testimonials').insert(testimonials);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    return NextResponse.json({ success: true, inserted: testimonials.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
