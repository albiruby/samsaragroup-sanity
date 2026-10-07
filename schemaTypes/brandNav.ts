import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * One row = one line in the BRANDS dropdown. The site renders these in array
 * order, so reordering here is what moves a row in the header.
 */
const ROW = defineArrayMember({
  name: "navRow",
  title: "Row",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Row Title",
      type: "string",
      description:
        "Judul di kolom kiri dropdown, mis. The Listening Room. Kosongkan untuk memakai Tagline brand pertama di baris ini.",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "brands",
      title: "Brands",
      type: "array",
      description:
        "Brand di bawah judul ini. Urutan tampil mengikuti urutan di sini. Brand harus Status = Active, kalau tidak tidak muncul di situs.",
      of: [{ type: "reference", to: [{ type: "world" }] }],
      validation: (rule) => rule.required().min(1).unique(),
    }),
  ],
  preview: {
    select: { title: "title", brands: "brands" },
    prepare({ title, brands }: { title?: string; brands?: unknown[] }) {
      const count = Array.isArray(brands) ? brands.length : 0;
      return {
        title: title || "Row (judul kosong — pakai Tagline brand)",
        subtitle: count ? `${count} brand` : "Belum ada brand",
      };
    },
  },
});

export default defineType({
  name: "brandNav",
  title: "BRANDS Dropdown",
  type: "document",
  description:
    "Isi dropdown BRANDS di header (desktop & popup mobile). Dokumen ini yang menentukan urutan baris dan brand apa saja yang tampil. Hanya perlu satu dokumen.",
  groups: [
    { name: "rows", title: "1 - Dropdown Rows", default: true },
    { name: "labels", title: "2 - Labels" },
  ],
  fields: [
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      group: "rows",
      description: "Urutan array = urutan baris di dropdown.",
      of: [ROW],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "seeAllLabel",
      title: "See All Brands Link",
      type: "string",
      group: "labels",
      initialValue: "See All Brands →",
      description: "Tautan di bawah panel dropdown. Kosongkan untuk menyembunyikannya.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "emptyLabel",
      title: "Empty State Label",
      type: "string",
      group: "labels",
      initialValue: "Hover a brand",
      description: "Tampil kalau tidak ada baris yang aktif.",
      validation: (rule) => rule.max(40),
    }),
  ],
  orderings: [
    {
      title: "Document order",
      name: "docOrder",
      by: [{ field: "_createdAt", direction: "asc" }],
    },
  ],
  preview: {
    prepare() {
      return { title: "BRANDS Dropdown" };
    },
  },
});