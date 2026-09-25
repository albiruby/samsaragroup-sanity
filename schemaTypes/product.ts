import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  description: "INPUT: name, price, image, world. → OUTPUT: carousel produk 'Best Sellers' di halaman /svvara (world = svvara).",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      description: "e.g. IDR 48,000,000",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "world",
      title: "World",
      type: "string",
      options: {
        layout: "dropdown",
        list: [
          { title: "Svvara", value: "svvara" },
          { title: "Samsara", value: "samsara" },
        ],
      },
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "price", media: "image" },
  },
});
