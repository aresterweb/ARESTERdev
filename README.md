# ARESTERdev Website

Website statis multi-halaman untuk brand ARESTERdev. Desain: elegant minimalis, latar navy gelap, aksen cyan/blue secukupnya, animasi halus, responsif, dan semua CTA konsultasi/pemesanan disiapkan untuk WhatsApp Business.

## Isi
- Beranda, Tentang Kami, Layanan, Portofolio, Produk Digital, FAQ, Kontak
- Kebijakan Privasi, Syarat Layanan, Disclaimer
- Artikel panduan awal
- SEO dasar: metadata, Open Graph, robots.txt, sitemap.xml, schema organisasi
- Aset logo sumber asli disimpan sebagai `assets/aresterdev-logo-original.png` tanpa perubahan.

## WAJIB sebelum publikasi
1. Edit `assets/site.js`, ganti `ISI_NOMOR_WA_BUSINESS_DI_SINI` dengan nomor WhatsApp Business internasional tanpa `+`, spasi, atau tanda baca.
2. Ganti seluruh `https://aresterdev.vercel.app` pada `index.html`, `robots.txt`, dan `sitemap.xml` dengan URL final yang benar.
3. Isi sendiri kontak resmi pada `contact.html`: WhatsApp Business, email bisnis, Facebook, dan Instagram. Jangan memakai kontak yang ditebak.
4. Periksa semua informasi, nama bisnis, layanan, dan klaim agar sesuai praktik aktual.
5. Tambahkan hanya portofolio dan testimoni yang nyata. Halaman portofolio dan produk saat ini sengaja menjelaskan bahwa katalog belum diisi, bukan mengarang karya/produk.
6. Tinjau halaman legal agar cocok dengan cara bisnis benar-benar mengumpulkan/menggunakan data dan dengan hukum yang berlaku.
7. Uji seluruh tautan di HP dan desktop setelah deploy.

## Google AdSense
Struktur ini menyediakan beberapa fondasi dasar (konten, navigasi, halaman privasi, dan informasi bisnis), tetapi **tidak menjamin persetujuan AdSense**. Sebelum mendaftar, isi kontak yang valid, terbitkan konten orisinal yang bermanfaat secara konsisten, pastikan tidak ada halaman placeholder yang tidak relevan, sesuaikan kebijakan privasi dengan praktik aktual termasuk cookie/iklan jika digunakan, dan ikuti kebijakan Google terbaru. Tidak ada `ads.txt` dengan publisher ID palsu. Tambahkan file itu hanya jika Google memberikan instruksi dan ID yang benar.

## Deploy GitHub Pages
Upload isi folder ke repository GitHub (root branch yang dipakai Pages). Setelah domain/URL Pages ditentukan, perbarui canonical, Open Graph, robots, sitemap, lalu aktifkan Pages di Settings → Pages. GitHub Pages menyediakan hosting statis; custom domain dan ketersediaan fitur mengikuti ketentuan GitHub saat digunakan.
