import { defineField, defineType } from "sanity";

export default defineType({
  name: "careerPage",
  title: "Career Page",
  type: "document",
  description:
    "Isi halaman /career. Satu dokumen untuk seluruh halaman — teks bagian atas, judul daftar lowongan, dan Google Form default. Lowongannya sendiri ada di dokumen Career.",
  groups: [
    { name: "hero", title: "1 — Hero", default: true },
    { name: "listings", title: "2 — Listings" },
    { name: "empty", title: "3 — Empty State" },
    { name: "apply", title: "4 — Apply" },
    { name: "seo", title: "5 — SEO" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "hero",
      description: "Label kecil di atas judul. Contoh: We're hiring.",
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
      title: "Tampilkan Strip Logo Brand",
      type: "boolean",
      group: "listings",
      initialValue: true,
      description: "Matikan untuk menyembunyikan blok logo lima brand di atas daftar lowongan.",
    }),
    defineField({
      name: "positionsHeading",
      title: "Judul Daftar Lowongan",
      type: "string",
      group: "listings",
      description: "Contoh: Currently open positions.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "emptyEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "empty",
      description:
        "Label kecil di atas headline empty state. Contoh: No Open Positions. Kosongkan untuk menyembunyikan.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "emptyHeadline",
      title: "Headline",
      type: "string",
      group: "empty",
      description:
        "Judul besar saat tidak ada lowongan aktif. Contoh: No open positions right now.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "emptyMessage",
      title: "Paragraph",
      type: "string",
      group: "empty",
      description:
        "Paragraf saat tidak ada lowongan aktif. Juga dipakai saat filter departemen tidak menemukan hasil.",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "emptyCtaLabel",
      title: "CTA Label",
      type: "string",
      group: "empty",
      description:
        "Contoh: Send us a note. Kosongkan label dan URL untuk menyembunyikan tombol.",
      initialValue: "Send us a note",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "emptyCtaUrl",
      title: "CTA URL",
      type: "url",
      group: "empty",
      description:
        "Tujuan tombol CTA. Hanya https. Kosongkan untuk memakai Google Form default di grup Apply.",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "applyUrl",
      title: "Google Form Default",
      type: "url",
      group: "apply",
      description:
        "Dipakai lowongan yang applyUrl-nya kosong. Sebaiknya satu form untuk semua brand.",
      validation: (rule) => rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "applyNote",
      title: "Catatan di Bawah Daftar",
      type: "string",
      group: "apply",
      description:
        "Satu kalimat penutup. Contoh: Don't see the right role? Send us a note. Kosongkan untuk menyembunyikan.",
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