import { defineField, defineType } from "sanity";

export default defineType({
  name: "world",
  title: "World",
  type: "document",
  description:
    "Satu dokumen = satu brand. INPUT → OUTPUT: Image → kartu thumbnail di halaman /brands; Gallery → hero carousel di halaman brand; Tagline/Description/Specifications → teks halaman brand.",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Nama brand → judul kartu di /brands dan judul dokumen ini",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "→ alamat halaman brand, contoh: samsara → /samsara",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "e.g. THE SANCTUARY → teks tagline di bawah judul halaman brand & kartu /brands",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "→ paragraf deskripsi di halaman brand (mis. 'THE V110' di /svvara)",
    }),
    defineField({
      name: "image",
      title: "Image (Thumbnail)",
      type: "image",
      options: { hotspot: true },
      description: "THUMBNAIL → gambar kartu di halaman /brands (OUR WORLDS). Bukan carousel.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery (Hero Carousel)",
      type: "array",
      description:
        "HERO CAROUSEL → slider besar di bagian atas halaman brand ini (mis. dokumen Samsara → /samsara). Tambah item untuk menambah slide.",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "array",
      description: "→ daftar spesifikasi (Label + Value) di halaman brand",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "value", title: "Value", type: "string" },
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "tagline", media: "image" },
  },
});
