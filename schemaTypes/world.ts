import { defineArrayMember, defineField, defineType } from "sanity";

const CTA_LIST = [
  { title: "Reservation", value: "reservation" },
  { title: "Room Rate", value: "roomrate" },
  { title: "Instagram", value: "instagram" },
];

/**
 * These five brands are hand-tuned pages in src/app, and a static route wins over
 * the dynamic [slug] template. A new brand reusing one of these slugs would publish
 * successfully and then render the old hardcoded page instead.
 */
const RESERVED_SLUGS = ["samsara", "svarga", "acasa", "outpace", "grove"];

const LOCAL_BUSINESS_TYPES = [
  { title: "None — no LocalBusiness schema", value: "none" },
  { title: "LocalBusiness (generic)", value: "LocalBusiness" },
  { title: "Restaurant", value: "Restaurant" },
  { title: "Resort", value: "Resort" },
  { title: "Hotel", value: "Hotel" },
  { title: "CafeOrCoffeeShop", value: "CafeOrCoffeeShop" },
];

const SPEC_ROW = defineArrayMember({
  name: "specRow",
  title: "Row",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Kiri tabel. Contoh: Concept, Hours, Heritage.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      description: "Kanan tabel. Contoh: Culinary & Hearth.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
  },
});

const MENU_PANEL = defineArrayMember({
  name: "menuPanel",
  title: "Menu Panel",
  type: "object",
  fields: [
    defineField({
      name: "tabLabel",
      title: "Page Label",
      type: "string",
      description:
        "Dipakai sebagai alt text gambar dan label di Studio. Website tidak menampilkan tab.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Menu Image",
      type: "image",
      options: { hotspot: true },
      description: "Gambar halaman menu. Bisa di-zoom dengan klik.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "tabLabel", media: "image" },
    prepare({ title, media }: { title?: string; media?: unknown }) {
      return {
        title: title || "Menu Panel",
        media: media as never,
      };
    },
  },
});

const FEATURE_CARD = defineArrayMember({
  name: "featureCard",
  title: "Feature Card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Contoh: PROTEIN.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "copy",
      title: "Copy",
      type: "text",
      rows: 3,
      description: "Paragraf pendek di bawah judul.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "copy" },
  },
});

const GALLERY_ITEM = defineArrayMember({
  title: "Image",
  type: "image",
  options: { hotspot: true },
});

const GALLERY_SLIDE = defineArrayMember({
  name: "galleryItem",
  title: "Slide",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      description: "Deskripsi gambar untuk aksesibilitas. Kosongkan untuk memakai nama brand.",
    }),
  ],
  preview: {
    select: { title: "alt", media: "image" },
    prepare: ({ title, media }) => ({ title: title || "Slide", media }),
  },
});

const CTA_LABELS: Record<string, string> = {
  reservation: "RESERVATION",
  roomrate: "ROOM RATE",
  instagram: "INSTAGRAM",
  menu: "MENU",
  location: "LOCATION",
  career: "CAREER",
  links: "LINKS",
};

export default defineType({
  name: "world",
  title: "World",
  type: "document",
  description:
    "Satu dokumen = satu brand. Form ini mengikuti urutan halaman brand: Hero → Intro & Specifications → Feature Cards → Menu → Location. Setiap field punya tempat tetap; tidak ada page builder.",
  groups: [
    { name: "identity", title: "1 — Identity", default: true },
    { name: "listing", title: "2 — Listing & Navigation" },
    { name: "hero", title: "3 — Hero" },
    { name: "intro", title: "4 — Intro & Specifications" },
    { name: "features", title: "5 — Feature Cards" },
    { name: "menu", title: "6 — Menu" },
    { name: "location", title: "7 — Location & Map" },
    { name: "contact", title: "8 — Contact & Links" },
    { name: "seo", title: "9 — SEO" },
    { name: "publishing", title: "10 — Publishing" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "identity",
      description: "Nama brand. Tampil sebagai judul besar di halaman brand & kartu /brands.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "identity",
      description:
        "Alamat halaman. Contoh: samsara menjadi /samsara. Jangan diubah setelah live tanpa redirect. Lima slug di bawah dipakai route statis di kode, jadi jangan dipakai untuk brand baru.",
      options: { source: "name", maxLength: 96 },
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const current = (value as { current?: string } | undefined)?.current;
          if (!current) return true;
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)) {
            return 'Slug hanya boleh huruf kecil, angka, dan tanda hubung (contoh: "nama-brand").';
          }
          if (!RESERVED_SLUGS.includes(current)) return true;
          const id = context?.document?._id?.replace(/^drafts\./, "");
          return id === `world-${current}`
            ? true
            : `Slug "${current}" dipakai halaman statis di website. Buat brand baru dengan slug lain.`;
        }),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "listing",
      description:
        "Contoh: The Listening Room. Jadi judul baris di dropdown navigasi BRANDS, dan tampil di kartu /brands serta di bawah judul halaman brand. Juga fallback meta description.",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "speciality",
      title: "Speciality",
      type: "string",
      group: "listing",
      description:
        "Baris kecil di dropdown navigasi BRANDS. Contoh: Vinyl — Dining — Culture. Juga fallback meta description.",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "image",
      title: "Card Image",
      type: "image",
      group: "listing",
      options: { hotspot: true },
      description:
        "Thumbnail kartu di /brands. Rasio ideal potret 4:5, bukan landscape. Berbeda dari hero carousel di bawah.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Brand Logo",
      type: "image",
      group: "listing",
      options: { hotspot: true },
      description:
        "Logo monochrome (PNG/SVG, transparan). Tampil putih di tengah kartu /brands dan di logo marquee footer. Kosongkan untuk memakai teks nama.",
    }),

    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      group: "hero",
      description: "Label kecil di atas judul. Kosongkan untuk memakai BRANDS.",
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      group: "hero",
      description: "Judul besar. Kosongkan untuk memakai nama brand (uppercase).",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "gallery",
      title: "Gallery (Hero Carousel)",
      type: "array",
      group: "hero",
      description:
        "Slider besar di atas halaman brand. Maks 20. Satu gambar tampil sebagai gambar lebar tunggal; dua atau lebih menjadi carousel. Kosongkan untuk menyembunyikan carousel.",
      of: [GALLERY_ITEM, GALLERY_SLIDE],
      validation: (rule) => rule.max(20),
    }),

    defineField({
      name: "description",
      title: "Intro Paragraph",
      type: "text",
      rows: 5,
      group: "intro",
      description:
        "Paragraf pembuka di blok dua kolom, di atas Specifications. Bukan meta description — isi SEO Description untuk itu.",
    }),
    defineField({
      name: "specsHeading",
      title: "Specifications Heading",
      type: "string",
      group: "intro",
      description: "Kosongkan untuk memakai SPECIFICATIONS.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "array",
      group: "intro",
      description: "Tabel label/nilai. Kosongkan untuk menyembunyikan tabel.",
      of: [SPEC_ROW],
      validation: (rule) => rule.max(12),
    }),

    defineField({
      name: "featuresHeading",
      title: "Features Heading",
      type: "string",
      group: "features",
      description: "Judul kecil di atas kartu. Kosongkan untuk menyembunyikan judul.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "features",
      title: "Feature Cards",
      type: "array",
      group: "features",
      description: "Maks 8 kartu. Grid 4 kolom di desktop, 2 di tablet.",
      of: [FEATURE_CARD],
      validation: (rule) => rule.max(8),
    }),

    defineField({
      name: "menuHeading",
      title: "Menu Heading",
      type: "string",
      group: "menu",
      description: "Judul section menu. Kosongkan untuk memakai MENU.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "menuPanels",
      title: "Menu Panels",
      type: "array",
      group: "menu",
      description:
        "1 panel = gambar tunggal, 2 panel = dua kolom, 3+ = pager. Panel tanpa gambar diabaikan.",
      of: [MENU_PANEL],
    }),

    defineField({
      name: "mapHeading",
      title: "Map Heading",
      type: "string",
      group: "location",
      description: "Kosongkan untuk memakai FIND US.",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "mapLat",
      title: "Map Latitude",
      type: "number",
      group: "location",
      description: "Contoh: -6.6167",
      validation: (rule) => rule.min(-90).max(90),
    }),
    defineField({
      name: "mapLng",
      title: "Map Longitude",
      type: "number",
      group: "location",
      description: "Contoh: 106.85",
      validation: (rule) => rule.min(-180).max(180),
    }),
    defineField({
      name: "mapZoom",
      title: "Map Zoom",
      type: "number",
      group: "location",
      description: "1 = dunia, 19 = bangunan. Default 16.",
      initialValue: 16,
      validation: (rule) => rule.integer().min(1).max(19),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
      group: "location",
      description: "Alamat fisik brand. Tampil di section paling akhir (FIND US).",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp Number",
      type: "string",
      group: "location",
      description:
        "Nomor WhatsApp brand seperti yang ditampilkan, mis. 0812-3456-7890 atau +62 812-3456-7890. Tampil di section FIND US.",
    }),
    defineField({
      name: "hours",
      title: "Opening Hours",
      type: "array",
      group: "location",
      description:
        "Jam buka, dikelompokkan singkat. Contoh label: Weekdays dan Weekend. Kosongkan untuk menyembunyikan blok ini di halaman brand.",
      of: [
        defineArrayMember({
          name: "hoursRow",
          title: "Row",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "Contoh: Weekdays, Weekend, Mon–Fri.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Hours",
              type: "string",
              description: "Contoh: 10:00 – 22:00.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),

    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      group: "contact",
      description: "Tampil sebagai tombol INSTAGRAM full-width di halaman brand.",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "ctas",
      title: "Action Buttons",
      type: "array",
      group: "contact",
      description: "Tombol aksi di halaman brand. Urutan tampil mengikuti urutan di sini.",
      of: [
        defineArrayMember({
          name: "cta",
          title: "Button",
          type: "object",
          fields: [
            defineField({
              name: "kind",
              title: "Button Type",
              type: "string",
              options: { layout: "dropdown", list: CTA_LIST },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Custom Label",
              type: "string",
              description:
                "Kosongkan untuk memakai label default (RESERVATION, ROOM RATE, INSTAGRAM).",
              validation: (rule) => rule.max(20),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required().uri({ scheme: ["https"] }),
            }),
          ],
          preview: {
            select: { title: "label", kind: "kind", url: "url" },
            prepare({
              title,
              kind,
              url,
            }: {
              title?: string;
              kind?: string;
              url?: string;
            }) {
              const fallback = kind ? CTA_LABELS[kind] : undefined;
              return { title: title || fallback || "Button", subtitle: url };
            },
          },
        }),
      ],
    }),

    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description: "Kosongkan untuk memakai '<Nama> — Samsara Group'.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
      description:
        "Ringkasan untuk mesin pencari. Ideal 140–160 karakter. Juga dipakai sebagai meta description.",
      validation: (rule) => rule.max(165),
    }),
    defineField({
      name: "socialImage",
      title: "Social Share Image",
      type: "image",
      group: "seo",
      description:
        "Gambar saat link dibagikan di WhatsApp/Instagram. Ideal 1200x630. Kosongkan untuk memakai card image.",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from Search Engines",
      type: "boolean",
      group: "seo",
      description: "Aktifkan untuk halaman arsip atau draft yang belum siap.",
      initialValue: false,
    }),
    defineField({
      name: "localBusinessType",
      title: "LocalBusiness Type (JSON-LD)",
      type: "string",
      group: "seo",
      description:
        "Tipe schema.org untuk structured data. Pilih None bila alamat/telepon belum lengkap. Hanya dipakai bila Address atau WhatsApp terisi.",
      initialValue: "none",
      options: { layout: "dropdown", list: LOCAL_BUSINESS_TYPES },
      validation: (rule) =>
        rule.custom((value) =>
          !value || LOCAL_BUSINESS_TYPES.some((type) => type.value === value)
            ? true
            : "Pilih tipe LocalBusiness yang tersedia."
        ),
    }),

    defineField({
      name: "order",
      title: "Order",
      type: "number",
      group: "publishing",
      description:
        "Urutan tampil di /brands, navigasi, dan sitemap. Angka kecil tampil lebih dulu. Kosong = paling akhir. Default 100.",
      initialValue: 100,
      validation: (rule) => rule.integer().min(1).max(999),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "publishing",
      description:
        "Active = tampil di website. Draft = 404, hanya terlihat di Studio. Archived = 404, disimpan sebagai arsip.",
      initialValue: "active",
      options: {
        layout: "radio",
        direction: "horizontal",
        list: [
          { title: "Active", value: "active" },
          { title: "Draft", value: "draft" },
          { title: "Archived", value: "archived" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "publishing",
      description:
        "Brand unggulan. Tampil di /brands, sebagai baris sendiri di dropdown navigasi (semua halaman), dan di sitemap. Penting: Featured = false membuat halaman /<slug> mengembalikan 404 — brand hilang total dari situs, bukan hanya dari daftar. Gunakan status Draft jika hanya ingin menyembunyikan tanpa menghapus dokumen.",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Order, then name",
      name: "orderAsc",
      by: [
        { field: "order", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      tagline: "tagline",
      media: "image",
      status: "status",
      order: "order",
    },
    prepare({
      title,
      tagline,
      media,
      status,
      order,
    }: {
      title?: string;
      tagline?: string;
      media?: unknown;
      status?: string;
      order?: number;
    }) {
      const dot = status === "active" ? "●" : status === "draft" ? "◐" : "○";
      return {
        title: `${dot} ${title || "Untitled"}`,
        subtitle: [order ? `#${order}` : null, tagline].filter(Boolean).join(" - "),
        media: media as never,
      };
    },
  },
});
