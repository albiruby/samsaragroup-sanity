# Sanity Studio — Samsara Group

[![CI](https://github.com/albiruby/samsaragroup-sanity/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/albiruby/samsaragroup-sanity/actions/workflows/ci.yml)

Studio pengelola konten website **Samsara Group** (Samsara, Svarga, Acasa, Outpace, Grove).
Situsnya ada di repo terpisah: [`samsaragroup-website`](https://github.com/albiruby/samsaragroup-website).

**Produksi:** https://samsaragroup.sanity.studio

## Workspace

| Workspace | Alamat | Dataset |
|---|---|---|
| Samsara Group | `/production` | `production` |
| Samsara Group (Staging) | `/staging` | `staging` |

Root `/` menampilkan pemilih workspace; bookmark langsung ke `/production` atau `/staging`.
Dataset `staging` bersifat publik — jangan unggah dokumen pribadi ke sana.
Vision hanya aktif di workspace staging, supaya query GROQ bebas tidak berjalan di atas data produksi.

## Menjalankan lokal

Prasyarat: **Node.js 24.22.1** (tercatat di `.nvmrc`) dan npm 11+.

```bash
npm ci
npm run dev        # http://localhost:3333
```

## Skrip

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Studio lokal |
| `npm run build` | Build bundle Studio ke `dist/` |
| `npm run deploy` | Deploy kedua workspace ke Sanity hosting |
| `npm run start` | Menjalankan hasil build secara lokal |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run deploy-graphql` | Deploy ulang GraphQL API |

## Isi repo

| Path | Isi |
|---|---|
| `schemaTypes/` | sembilan schema dokumen dan objek, diekspor lewat `index.ts` |
| `components/` | input kustom, mis. `SuggestionTextInput` untuk saran teks |
| `scripts/` | backup dataset (`backup-dataset.ps1`, `backup-and-upload.ps1`) |
| `sanity.config.ts` | dua workspace, struktur panel "Content by Page", template dokumen |
| `static/` | aset statis Studio |

## Backup dataset

`scripts/backup-and-upload.ps1` mengekspor dataset `production`, menyimpannya di folder
`backups/`, lalu mengunggahnya ke Google Drive. Arsip **tidak boleh** masuk repo ini karena
repositori bersifat publik. Prosedur lengkap, jadwal, dan verifikasi hash ada di
`docs/DOCUMENTATIONS.md` §12 pada repo website.

## Lisensi

Proprietary — seluruh hak dilindungi. Lihat [`LICENSE`](LICENSE).
