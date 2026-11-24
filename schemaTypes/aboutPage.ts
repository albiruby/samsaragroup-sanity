import { defineField, defineType } from "sanity";

/**
 * The About page.
 *
 * SATU dokumen untuk seluruh halaman. Philosophy sengaja dikunci ke tepat 6 kartu
 * — halaman dirancang sebagai grid 3 kolom x 2 baris, jadi jumlahnya tidak bisa
 * diubah. Teks tiap kartu bebas diedit. Field yang dikosongkan otomatis memakai
 * nilai bawaan di kode.
 */
export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  description:
    "Isi halaman /about. Satu dokumen untuk seluruh halaman — Hero, Vision, enam kartu Philosophy, dan SEO.",
  groups: [
    { name: "hero", title: "1 — Hero", default: true },
    { name: "vision", title: "2 — Vision" },
    { name: "philosophy", title: "3 — Philosophy" },
    { name: "seo", title: "4 — SEO" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "hero",
      description: "Label kecil di atas judul. Kosongkan untuk memakai ABOUT US.",
      initialValue: "ABOUT US",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "titleLine1",
      title: "Headline — Baris 1",
      type: "string",
      group: "hero",
      description: "Baris pertama headline halaman About.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "titleLine2",
      title: "Headline — Baris 2",
      type: "string",
      group: "hero",
      description: "Baris kedua headline halaman About.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "intro",
      title: "Paragraf",
      type: "array",
      group: "hero",
      of: [{ type: "text", rows: 2 }],
      description: "Paragraf di bawah headline. Kosongkan untuk memakai dua paragraf bawaan.",
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      description:
        "Gambar di kolom kiri. Kosongkan untuk memakai gambar bawaan website.",
    }),
    defineField({
      name: "heroImageAlt",
      title: "Hero Image Alt Text",
      type: "string",
      group: "hero",
      description: "Deskripsi gambar untuk pembaca layar dan SEO.",
      validation: (rule) => rule.max(120),
    }),

    defineField({
      name: "visionEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "vision",
      description: "Label kecil di atas judul. Kosongkan untuk memakai VISION.",
      initialValue: "VISION",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "visionHeading",
      title: "Headline",
      type: "string",
      group: "vision",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "visionBody",
      title: "Paragraf",
      type: "text",
      rows: 3,
      group: "vision",
      description: "Paragraf bagian Vision. Kosongkan untuk memakai teks bawaan website.",
    }),

    defineField({
      name: "philosophyEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "philosophy",
      description: "Label kecil di atas judul. Kosongkan untuk memakai PHILOSOPHY.",
      initialValue: "PHILOSOPHY",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "philosophyHeading",
      title: "Headline",
      type: "string",
      group: "philosophy",
      initialValue: "APPROACH & PRINCIPLES",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "philosophy",
      title: "Enam Kartu",
      type: "array",
      group: "philosophy",
      description:
        "Tepat 6 kartu — halaman dirancang sebagai grid 3 kolom × 2 baris. Teks tiap kartu bebas diubah, jumlah kartunya tidak.",
      validation: (rule) => rule.required().length(6),
      of: [
        {
          type: "object",
          name: "philosophyCard",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required().max(240),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "body" },
          },
        },
      ],
    }),

    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description: "Kosongkan untuk memakai 'About — Samsara Group'.",
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
    prepare: () => ({ title: "About Page" }),
  },
});
