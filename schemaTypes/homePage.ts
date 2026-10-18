import { defineField, defineType } from "sanity";

/**
 * The homepage copy and the two images above the fold.
 *
 * Every field here maps to something the page already renders — nothing was added
 * for its own sake. The images and every string keep a built-in fallback in the
 * code, so leaving a field empty never breaks the page.
 */
export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  description:
    "Teks dan gambar halaman depan. SATU dokumen untuk seluruh halaman. Beberapa field punya dua bagian judul karena di halaman tampil sebagai dua baris dengan warna berbeda. Field yang dikosongkan otomatis memakai nilai bawaan di kode.",
  groups: [
    { name: "hero", title: "1 - Hero", default: true },
    { name: "about", title: "2 - About Us" },
    { name: "brands", title: "3 - Our Brands" },
  ],
  fields: [
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      description:
        "Gambar latar penuh layar di bagian paling atas. Kosongkan untuk memakai gambar bawaan website.",
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
      name: "heroLine1",
      title: "Hero Title — Baris 1",
      type: "string",
      group: "hero",
      description: "Baris pertama judul besar, tampil putih penuh.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "heroLine2",
      title: "Hero Title — Baris 2",
      type: "string",
      group: "hero",
      description: "Baris kedua judul besar, tampil putih sedikit transparan.",
      validation: (rule) => rule.max(60),
    }),

    defineField({
      name: "aboutEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "about",
      description: "Label kecil di atas judul, e.g. ABOUT US.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "aboutHeadingLine1",
      title: "Heading — Baris 1",
      type: "string",
      group: "about",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "aboutHeadingLine2",
      title: "Heading — Baris 2",
      type: "string",
      group: "about",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "aboutBody",
      title: "Paragraph",
      type: "text",
      rows: 4,
      group: "about",
    }),
    defineField({
      name: "aboutCtaLabel",
      title: "Button Label",
      type: "string",
      group: "about",
      description: "e.g. MORE ABOUT US",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "aboutCtaHref",
      title: "Button Link",
      type: "string",
      group: "about",
      description: "Alamat tujuan tombol, e.g. /about",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "aboutImage",
      title: "Image",
      type: "image",
      group: "about",
      options: { hotspot: true },
      description:
        "Gambar di kolom kanan. Kosongkan untuk memakai gambar bawaan website.",
    }),
    defineField({
      name: "aboutImageAlt",
      title: "Image Alt Text",
      type: "string",
      group: "about",
      validation: (rule) => rule.max(120),
    }),

    defineField({
      name: "brandsEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "brands",
      description: "Label kecil di atas judul, e.g. OUR BRANDS.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "brandsHeading",
      title: "Heading",
      type: "string",
      group: "brands",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "brandsBody",
      title: "Paragraph",
      type: "text",
      rows: 3,
      group: "brands",
    }),
    defineField({
      name: "brandsCounterLabel",
      title: "Counter Label",
      type: "string",
      group: "brands",
      description:
        "Keterangan di samping angka jumlah brand. Angkanya dihitung otomatis dari daftar brand, jadi cukup tulis kalimatnya, e.g. worlds under one group.",
      validation: (rule) => rule.max(60),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
