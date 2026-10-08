import { defineField, defineType } from "sanity";
import { SuggestionTextInput } from "../components/SuggestionTextInput";

const CITIES = ["Bogor", "Sukabumi", "Singapore"];

export default defineType({
  name: "contactInfo",
  title: "Contact Info",
  type: "document",
  description:
    "INPUT: WhatsApp, alamat, jam → OUTPUT: blok kontak di halaman /contact. Satu dokumen untuk seluruh halaman. Field yang dikosongkan otomatis memakai nilai bawaan website.",
  fields: [
    defineField({
      name: "whatsapp",
      title: "Nomor WhatsApp",
      type: "array",
      description:
        "Blok kiri halaman /contact. Tampil berurutan dari atas. Kosongkan untuk memakai 3 nomor bawaan website.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Nama Brand",
              type: "string",
              description: "e.g. Samsara",
              validation: (rule) => rule.required().max(40),
            },
            {
              name: "city",
              title: "Kota",
              type: "string",
              description: "Tampil kecil di samping nama, e.g. Bogor.",
              components: { input: SuggestionTextInput },
              options: { list: CITIES },
              validation: (rule) => rule.max(40),
            },
            {
              name: "display",
              title: "Nomor Tampil",
              type: "string",
              description:
                "Nomor yang dilihat pembaca, boleh pakai garis. e.g. 0812-8127-1988",
              validation: (rule) => rule.required().max(24),
            },
            {
              name: "phone",
              title: "Nomor untuk Link wa.me",
              type: "string",
              description:
                "Hanya angka, tanpa '+', tanpa spasi, tanpa garis. e.g. 6285281271988",
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^[0-9]{8,15}$/, { name: "digitsOnly", invert: false }),
            },
          ],
          preview: {
            select: { title: "label", city: "city", display: "display" },
            prepare: ({ title, city, display }) => ({
              title: city ? `${title} · ${city}` : title,
              subtitle: display,
            }),
          },
        },
      ],
    }),
    defineField({
      name: "addresses",
      title: "Alamat (Visit Us)",
      type: "array",
      description:
        "Blok kanan halaman /contact. Tampil berurutan dari atas. Kosongkan untuk memakai 3 alamat bawaan website.",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "address", title: "Alamat", type: "text" },
          ],
          preview: {
            select: { title: "label", subtitle: "address" },
          },
        },
      ],
    }),
    defineField({
      name: "hours",
      title: "Jam Operasional",
      type: "string",
      description: "e.g. Mon–Sat: 09:00–18:00 · Sun: By appointment",
    }),
  ],
  preview: {
    select: { whatsapp: "whatsapp", addresses: "addresses", hours: "hours" },
    prepare: ({ whatsapp, addresses, hours }) => ({
      title: "Contact Information",
      subtitle: [
        whatsapp?.length ? `${whatsapp.length} WhatsApp` : null,
        addresses?.length ? `${addresses.length} alamat` : null,
        hours || null,
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});