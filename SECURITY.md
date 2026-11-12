# Kebijakan Keamanan

## Melaporkan celah

**Jangan** membuka issue publik untuk masalah keamanan.

Gunakan **Security → Report a vulnerability** pada tab Security repo ini. Laporan masuk
sebagai private security advisory dan hanya terlihat oleh pemilik repositori.

Kami berusaha membalas dalam 7 hari kerja.

## Cakupan

Berlaku untuk Studio di https://samsaragroup.sanity.studio dan seluruh kode di repo ini:
schema, komponen input kustom, konfigurasi workspace, serta skrip backup di `scripts/`.

Perhatikan bahwa dataset `production` dan `staging` bersifat **public-read** — dokumen yang
diunggah dapat dibaca siapa pun yang mengetahui project ID. Jangan pernah menyimpan kredensial,
data pribadi pelanggan, atau berkas internal di dalam dokumen CMS.

## Di luar cakupan

- Kerentanan pada Sanity beserta infrastrukturnya — laporkan ke Sanity.
- Konten editorial yang sudah terbit.
- Kerentanan pada dependensi pihak ketiga yang hanya dipakai saat build; kami menindaklanjuti
  lewat pembaruan dependensi.
