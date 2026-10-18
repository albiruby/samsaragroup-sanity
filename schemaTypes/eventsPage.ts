import { defineField, defineType } from "sanity";

export default defineType({
  name: "eventsPage",
  title: "Events Page",
  type: "document",
  description:
    "Isi halaman /events. SATU dokumen untuk seluruh halaman — label kecil di atas judul, judul besar, pesan saat belum ada event, dan SEO. Event-nya sendiri ada di dokumen Event.",
  groups: [
    { name: "hero", title: "1 - Hero", default: true },
    { name: "empty", title: "2 - Saat Belum Ada Event" },
    { name: "seo", title: "3 - SEO" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "hero",
      description: "Label kecil di atas judul. Kosongkan untuk memakai UPCOMING.",
      initialValue: "UPCOMING",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      group: "hero",
      description: "Judul besar halaman.",
      initialValue: "EVENTS",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "emptyMessage",
      title: "Pesan saat belum ada event",
      type: "string",
      group: "empty",
      description:
        "Tampil menggantikan daftar kalau tidak ada satu pun Event berstatus Active. Kosongkan untuk memakai 'No upcoming events at this time.'",
      initialValue: "No upcoming events at this time.",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description: "Kosongkan untuk memakai 'Events — Samsara Group'.",
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
    prepare: () => ({ title: "Events Page" }),
  },
});
