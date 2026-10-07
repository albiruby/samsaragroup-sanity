import { defineArrayMember, defineField, defineType } from "sanity";

const CTA_LIST = [
  { title: "Reservation", value: "reservation" },
  { title: "Menu", value: "menu" },
  { title: "Location", value: "location" },
  { title: "Career", value: "career" },
  { title: "All Links", value: "links" },
];

/**
 * These five brands are hand-tuned pages in src/app, and a static route wins over
 * the dynamic [slug] template. A new brand reusing one of these slugs would publish
 * successfully and then render the old hardcoded page instead.
 */
const RESERVED_SLUGS = ["samsara", "svarga", "acasa", "outpace", "grove"];

const SPEC_ROW = defineArrayMember({
  name: "specRow",
  title: "Row",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Kiri tabel, e.g. Concept, Hours, Heritage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      description: "Kanan tabel, e.g. Culinary & Hearth",
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
      title: "Tab Label",
      type: "string",
      description: "Label tab di desktop, e.g. Food, Beverages, Page 1",
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
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      initialValue: "zoomable",
      options: {
        layout: "radio",
        direction: "horizontal",
        list: [
          { title: "Zoomable viewer (klik untuk zoom)", value: "zoomable" },
          { title: "Full page (tanpa border)", value: "fullpage" },
        ],
      },
    }),
    defineField({
      name: "downloadUrl",
      title: "Download / Open URL",
      type: "url",
      description: "Opsional. Untuk tombol unduh menu PDF (mis. Google Drive).",
    }),
  ],
  preview: {
    select: { title: "tabLabel", media: "image", layout: "layout" },
    prepare({ title, media, layout }: { title?: string; media?: unknown; layout?: string }) {
      return {
        title: title || "Menu Panel",
        subtitle: layout === "fullpage" ? "Full page" : "Zoomable",
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
      description: "e.g. PROTEIN",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "copy",
      title: "Copy",
      type: "text",
      rows: 3,
      description: "Paragraf pendek di bawah judul",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      description: "Opsional. Tampil di atas kartu pada layout dua kolom.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "copy", media: "image" },
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

const SECTION_LABELS: Record<string, string> = {
  text: "Text Block",
  specs: "Specifications",
  features: "Feature Cards",
  menu: "Menu",
  map: "Map",
};

const CTA_LABELS: Record<string, string> = {
  reservation: "RESERVATION",
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
    "Satu dokumen = satu brand. SEMUA elemen halaman brand diatur dari sini: teks, gambar, peta, menu, tombol. Tambah brand baru cukup buat dokumen lalu isi - tidak perlu ubah kode.",
  groups: [
    { name: "identity", title: "1 - Identity", default: true },
    { name: "listing", title: "2 - Listing & Navigation" },
    { name: "hero", title: "3 - Hero & Copy" },
    { name: "sections", title: "4 - Sections" },
    { name: "menu", title: "5 - Menu" },
    { name: "location", title: "6 - Location & Map" },
    { name: "contact", title: "7 - Contact & Links" },
    { name: "seo", title: "8 - SEO" },
    { name: "publishing", title: "9 - Publishing" },
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
        "Alamat halaman. samsara menjadi /samsara. Jangan diubah setelah live tanpa redirect. Lima slug di bawah dipakai route statis di kode, jadi jangan dipakai untuk brand baru.",
      options: { source: "name", maxLength: 96 },
      validation: (rule) =>
        rule.required().custom((value) => {
          const current = (value as { current?: string } | undefined)?.current;
          if (!current) return true;
          return RESERVED_SLUGS.includes(current)
            ? `Slug "${current}" dipakai halaman statis di website. Buat brand baru dengan slug lain.`
            : true;
        }),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "listing",
      description:
        "e.g. The Listening Room. Jadi judul baris di dropdown navigasi BRANDS, dan tampil di kartu /brands serta di bawah judul halaman brand. Wajib diisi agar brand punya judul sendiri di navigasi.",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "speciality",
      title: "Speciality",
      type: "string",
      group: "listing",
      description: "Baris kecil di dropdown navigasi BRANDS. e.g. Vinyl - Dining - Culture.",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "image",
      title: "Card Image",
      type: "image",
      group: "listing",
      options: { hotspot: true },
      description:
        "THUMBNAIL kartu di /brands. Rasio ideal potret 4:5 — potret, bukan landscape. BEDA dari hero carousel di bawah.",
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
      name: "theme",
      title: "Theme",
      type: "string",
      group: "hero",
      description: "Mode warna halaman saat header closed.",
      initialValue: "dark",
      options: {
        layout: "radio",
        list: [
          { title: "Dark", value: "dark" },
          { title: "Light", value: "light" },
        ],
      },
    }),
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      group: "hero",
      description: "Label kecil di atas judul. Kosongkan untuk memakai WORLDS.",
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
      name: "heroIntro",
      title: "Hero Intro",
      type: "text",
      rows: 3,
      group: "hero",
      description: "Paragraf pendek tepat di bawah judul hero.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery (Hero Carousel)",
      type: "array",
      group: "hero",
      description:
        "Slider besar di atas halaman brand. Hanya 1 gambar? Tampil sebagai gambar lebar tunggal. Kosongkan untuk menyembunyikan carousel.",
      of: [GALLERY_ITEM, GALLERY_SLIDE],
      validation: (rule) => rule.max(20),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "hero",
      description:
        "Ringkasan singkat brand. Dipakai untuk SEO description bila SEO Description kosong.",
    }),
    defineField({
      name: "sections",
      title: "Content Sections",
      type: "array",
      group: "sections",
      description:
        "Blok konten di bawah carousel, urut dari atas ke bawah. Section kosong disembunyikan otomatis.",
      of: [
        defineArrayMember({
          name: "section",
          title: "Section",
          type: "object",
          fields: [
            defineField({
              name: "type",
              title: "Section Type",
              type: "string",
              options: {
                layout: "dropdown",
                list: [
                  { title: "Text Block - judul + paragraf", value: "text" },
                  { title: "Specifications - tabel label/value", value: "specs" },
                  { title: "Feature Cards - grid kartu", value: "features" },
                  { title: "Menu - viewer halaman menu", value: "menu" },
                  { title: "Map - peta lokasi", value: "map" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              description: "e.g. THE VISION, AT A GLANCE, FIND US",
              validation: (rule) => rule.max(40),
            }),
            defineField({
              name: "body",
              title: "Body Text",
              type: "text",
              rows: 5,
              description: "Dipakai oleh section Text Block. Pisahkan paragraf dengan baris kosong.",
            }),
            defineField({
              name: "specifications",
              title: "Specifications",
              type: "array",
              description: "Dipakai oleh section Specifications.",
              of: [SPEC_ROW],
            }),
            defineField({
              name: "features",
              title: "Feature Cards",
              type: "array",
              description: "Dipakai oleh section Feature Cards.",
              of: [FEATURE_CARD],
            }),
            defineField({
              name: "image",
              title: "Section Image",
              type: "image",
              options: { hotspot: true },
              description: "Opsional. Tampil di kolom kanan section Text Block.",
            }),
            defineField({
              name: "menuPanels",
              title: "Menu Panels",
              type: "array",
              description:
                "Dipakai oleh section Menu. 1 panel = gambar tunggal, 2 panel = dua kolom, 3+ = pager.",
              of: [MENU_PANEL],
            }),
            defineField({
              name: "mapLat",
              title: "Map Latitude",
              type: "number",
              description: "Dipakai oleh section Map. Contoh: -6.6167",
              validation: (rule) => rule.min(-90).max(90),
            }),
            defineField({
              name: "mapLng",
              title: "Map Longitude",
              type: "number",
              description: "Dipakai oleh section Map. Contoh: 106.85",
              validation: (rule) => rule.min(-180).max(180),
            }),
            defineField({
              name: "mapZoom",
              title: "Map Zoom",
              type: "number",
              description: "1 = dunia, 19 = bangunan. Default 16.",
              initialValue: 16,
              validation: (rule) => rule.integer().min(1).max(19),
            }),
          ],
          preview: {
            select: { title: "heading", type: "type" },
            prepare({ title, type }: { title?: string; type?: string }) {
              const label = type ? SECTION_LABELS[type] : undefined;
              return { title: title || label || "Section", subtitle: label };
            },
          },
        }),
      ],
      validation: (rule) => rule.max(12),
    }),
    defineField({
      name: "menuPanels",
      title: "Standalone Menu Panels",
      type: "array",
      group: "menu",
      description:
        "Alternatif cepat: menu tanpa section. Section Menu dipakai otomatis bila diisi.",
      of: [MENU_PANEL],
    }),
    defineField({
      name: "menuHeading",
      title: "Menu Heading",
      type: "string",
      group: "menu",
      description: "Judul section menu untuk Standalone Menu Panels. Default: MENU.",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
      group: "location",
      description: "Alamat fisik brand. Tampil di section paling akhir.",
    }),
    defineField({
      name: "hours",
      title: "Opening Hours",
      type: "array",
      group: "location",
      description: "Jam buka-tutup per hari.",
      of: [
        defineArrayMember({
          name: "hoursRow",
          title: "Row",
          type: "object",
          fields: [
            defineField({
              name: "day",
              title: "Day",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Hours",
              type: "string",
              description: "e.g. 10:00 - 22:00",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "day", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      group: "contact",
      description: "Tampil sebagai tombol INSTAGRAM full-width di halaman brand.",
    }),
    defineField({
      name: "ctas",
      title: "Action Buttons",
      type: "array",
      group: "contact",
      description:
        "Tombol aksi di halaman brand. Urutan tampil mengikuti urutan di sini.",
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
                "Kosongkan untuk memakai label default (RESERVATION, MENU, LOCATION, CAREER, LINKS).",
              validation: (rule) => rule.max(20),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
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
      name: "order",
      title: "Order",
      type: "number",
      group: "publishing",
      description: "Urutan tampil di /brands dan navigasi. Angka kecil tampil lebih dulu.",
      validation: (rule) => rule.integer().min(1).max(999),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "publishing",
      description:
        "Active = tampil di website. Draft = hanya terlihat di Studio. Archived = disembunyikan dari navigasi tapi URL tetap hidup.",
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
        "Brand unggulan. Tampil di /brands, sebagai baris sendiri di dropdown navigasi (semua halaman), dan di sitemap. PENTING: Featured = false membuat halaman /<slug> mengembalikan 404 — brand hilang total dari situs, bukan hanya dari daftar. Gunakan status Draft jika hanya ingin menyembunyikan tanpaapus dokumen.",
      initialValue: true,
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description: "Kosongkan untuk memakai '<Nama> - Samsara Group'.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Ringkasan untuk mesin pencari. Ideal 140-160 karakter.",
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