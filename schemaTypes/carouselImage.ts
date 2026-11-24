import { defineField, defineType } from "sanity";
import { suggestionInput } from "../components/SuggestionTextInput";

const BRANDS = ["Samsara", "Svarga", "Acasa", "Outpace", "Grove"];

const BRAND_FIELD = suggestionInput(BRANDS);

export default defineType({
  name: "carouselImage",
  title: "Carousel Image",
  type: "document",
  description:
    "Satu slide carousel. Input → Output: 'Shown On' = Home Page → marquee gambar di homepage.",
  fields: [
    defineField({
      name: "placement",
      title: "Shown On",
      type: "string",
      description: "Halaman tujuan slide ini. Home Page = marquee homepage.",
      options: {
        layout: "radio",
        list: [{ title: "Home Page — Rolling Gallery", value: "home" }],
      },
      validation: (rule) => rule.required(),
      initialValue: "home",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Label internal slide ini (tidak tampil di website).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      description: "Gambar slide yang tampil di carousel.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      description: "Deskripsi gambar untuk aksesibilitas dan SEO. Muncul sebagai alt tag <img>.",
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "string",
      description: "Samsara/Svarga/Acasa/Grove/Outpace → label alt slide di homepage.",
      components: { input: BRAND_FIELD },
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Urutan tampil. Angka kecil tampil lebih dulu.",
      validation: (rule) => rule.required().integer(),
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      description: "Matikan untuk menyembunyikan slide dari website tanpa menghapus dokumen.",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", media: "image", subtitle: "brand" },
  },
});
