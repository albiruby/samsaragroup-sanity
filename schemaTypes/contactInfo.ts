import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactInfo",
  title: "Contact Info",
  type: "document",
  description: "INPUT: emails, addresses, hours, inquiryTypes. → OUTPUT: info kontak di halaman /contact.",
  __experimental_repeatable: false,
  fields: [
    defineField({
      name: "emails",
      title: "Emails",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              name: "email",
              title: "Email",
              type: "string",
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^[^\s?@]+@[^\s?@]+\.[^\s?@]+$/, {
                    name: "email",
                    invert: false,
                  }),
            },
          ],
          preview: {
            select: { title: "label", subtitle: "email" },
          },
        },
      ],
    }),
    defineField({
      name: "addresses",
      title: "Addresses",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "address", title: "Address", type: "text" },
          ],
          preview: {
            select: { title: "label", subtitle: "address" },
          },
        },
      ],
    }),
    defineField({
      name: "hours",
      title: "Office Hours",
      type: "string",
      description: "e.g. Mon-Sat: 09:00-18:00, Sun: By appointment",
    }),
    defineField({
      name: "inquiryTypes",
      title: "Inquiry Type Options",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: { title: "hours" },
    prepare: () => ({ title: "Contact Information" }),
  },
});
