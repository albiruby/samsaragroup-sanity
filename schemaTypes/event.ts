import { defineField, defineType } from "sanity";
import { SuggestionTextInput } from "../components/SuggestionTextInput";

const CATEGORIES = [
  { title: "Music & Listening", value: "music" },
  { title: "Dining & Terroir", value: "dining" },
  { title: "Leisure & Community", value: "community" },
  { title: "Workshop & Craft", value: "workshop" },
];

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  description: "INPUT: title, date, category, image, dll. → OUTPUT: kartu event di halaman /events + detail /events/[slug].",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description:
        "Tampil sebagai label kecil di kartu event. Ketik bebas untuk kategori baru, atau pilih dari daftar.",
      components: { input: SuggestionTextInput },
      options: { list: CATEGORIES },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      options: { dateFormat: "DD MMM YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "time",
      title: "Time",
      type: "string",
      description: "e.g. 19:00 – 00:00",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. Svarga Estate, Canggu",
    }),
    defineField({
      name: "capacity",
      title: "Capacity",
      type: "string",
      description: "e.g. 24 guests",
    }),
    defineField({
      name: "entry",
      title: "Entry",
      type: "string",
      description: "e.g. By invitation only",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
      description: "External link (e.g. Instagram, ticketing, registration)",
      validation: (rule) => rule.uri({ allowRelative: false }),
    }),
  ],
  orderings: [
    {
      title: "Date, new",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "date", media: "image" },
  },
});
