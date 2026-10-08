import { defineField, defineType } from "sanity";

export default defineType({
  name: "careerPage",
  title: "Career Page",
  type: "document",
  description:
    "Isi halaman /career. SATU dokumen untuk seluruh halaman — teks bagian atas, judul daftar lowongan, dan Google Form default. Lowongannya sendiri ada di dokumen Career.",
  groups: [
    { name: "hero", title: "1 - Hero", default: true },
    { name: "listings", title: "2 - Listings" },
    { name: "apply", title: "3 - Apply" },
    { name: "seo", title: "4 - SEO" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "hero",
      description: "Label kecil di atas judul, e.g. We're hiring.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      group: "hero",
      description: "Judul besar halaman.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      group: "hero",
      description: "Paragraf pendek tepat di bawah judul.",
      validation: (rule) => rule.max(320),
    }),
    defineField({
      name: "theme",
      title: "Theme",
      type: "string",
      group: "hero",
      description: "Mode warna halaman.",
      initialValue: "light",
      options: {
        layout: "radio",
        direction: "horizontal",
        list: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
        ],
      },
    }),
    defineField({
      name: "showBrandStrip",
      title: "Tampilkan strip logo brand",
      type: "boolean",
      group: "listings",
      initialValue: true,
      description: "Matikan untuk menyembunyikan blok logo lima brand di atas daftar lowongan.",
    }),
    defineField({
      name: "positionsHeading",
      title: "Judul daftar lowongan",
      type: "string",
      group: "listings",
      description: "e.g. Currently open positions.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "emptyHeadline",
      title: "Judul saat tidak ada lowongan",
      type: "string",
      group: "listings",
      description:
        "Tampil besar menggantikan 'Judul daftar lowongan' kalau tidak ada lowongan aktif sama sekali. e.g. No open positions right now.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "emptyMessage",
      title: "Pesan saat lowongan kosong",
      type: "string",
      group: "listings",
      description:
        "Tampil kalau tidak ada lowongan yang cocok dengan filter, atau saat CMS tidak dapat dihubungi.",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "applyUrl",
      title: "Google Form default",
      type: "url",
      group: "apply",
      description:
        "Dipakai lowongan yang applyUrl-nya kosong. Sebaiknya satu form untuk semua brand.",
      validation: (rule) => rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "applyNote",
      title: "Catatan di bawah daftar",
      type: "string",
      group: "apply",
      description:
        "Satu kalimat penutup, e.g. Don't see the right role? Send us a note. Kosongkan untuk menyembunyikan.",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description: "Kosongkan untuk memakai '<Headline> — Samsara Group'.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "string",
      group: "seo",
      description: "Ideal 140-160 karakter.",
      validation: (rule) => rule.max(160),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Career Page" }),
  },
});