import { defineArrayMember, defineField, defineType } from "sanity";
import { DepartmentInput } from "../components/DepartmentInput";

const DEPARTMENTS = [
  { title: "Kitchen", value: "Kitchen" },
  { title: "Barista", value: "Barista" },
  { title: "Front of House", value: "Front of House" },
  { title: "Guest Experience", value: "Guest Experience" },
  { title: "Events", value: "Events" },
  { title: "Operations", value: "Operations" },
  { title: "Marketing", value: "Marketing" },
];

const EMPLOYMENT_TYPES = [
  { title: "Full-time", value: "full-time" },
  { title: "Part-time", value: "part-time" },
  { title: "Contract", value: "contract" },
  { title: "Internship", value: "internship" },
];

const TYPE_LABELS: Record<string, string> = {
  "full-time": "Full Time",
  "part-time": "Part Time",
  contract: "Contract",
  internship: "Internship",
};

const REQUIREMENT = defineArrayMember({
  name: "requirement",
  title: "Requirement",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "string",
      validation: (rule) => rule.required().max(160),
    }),
  ],
  preview: {
    select: { title: "text" },
  },
});

export default defineType({
  name: "career",
  title: "Career",
  type: "document",
  description:
    "Satu dokumen = satu lowongan. INPUT: title, department, location, type, description → OUTPUT: kartu di /career + filter departemen. Link Apply diarahkan ke Google Form.",
  groups: [
    { name: "role", title: "1 - Role", default: true },
    { name: "detail", title: "2 - Description" },
    { name: "apply", title: "3 - Apply" },
    { name: "publishing", title: "4 - Publishing" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
      group: "role",
      description: "e.g. Barista. Tampil besar di kartu lowongan.",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "role",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
      group: "role",
      description:
        "Chip filter di /career. Ketik bebas untuk departemen baru — nilainya jadi chip filter tersendiri di /career. Pilih dari daftar bila mau ikut template.",
      components: { input: DepartmentInput },
      options: { list: DEPARTMENTS },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "string",
      group: "role",
      description: "Brand tempat lowongan ini berada. Kosongkan untuk lowongan grup.",
      options: {
        layout: "dropdown",
        list: [
          { title: "Samsara", value: "samsara" },
          { title: "Svarga", value: "svarga" },
          { title: "Acasa", value: "acasa" },
          { title: "Outpace", value: "outpace" },
          { title: "Grove", value: "grove" },
          { title: "Samsara Group (all brands)", value: "group" },
        ],
      },
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "role",
      description: "e.g. Bogor. Tampil sebagai chip di kartu.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "employmentType",
      title: "Employment Type",
      type: "string",
      group: "role",
      initialValue: "full-time",
      options: { layout: "radio", direction: "horizontal", list: EMPLOYMENT_TYPES },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "string",
      group: "detail",
      description: "Satu kalimat. Tampil di bawah judul pada kartu lowongan.",
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: "description",
      title: "Job Description",
      type: "text",
      rows: 6,
      group: "detail",
      description: "Paragraf pembuka posisi. Tampil penuh di kartu lowongan.",
      validation: (rule) => rule.required().min(40).max(900),
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "array",
      group: "detail",
      of: [REQUIREMENT],
      description: "Syarat Qualifications. Kosongkan jika lowongan tidak punya daftar syarat.",
    }),
    defineField({
      name: "applyUrl",
      title: "Apply URL",
      type: "url",
      group: "apply",
      description:
        "Kosongkan untuk memakai Google Form grup yang diset di /career. Isi bila lowongan ini punya form sendiri.",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "isUrgent",
      title: "Urgent",
      type: "boolean",
      group: "publishing",
      initialValue: false,
      description: "Tandai lowongan yang perlu segera diisi.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "publishing",
      description:
        "Active = tampil di /career. Draft = hanya terlihat di Studio. Archived = disembunyikan.",
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
      name: "order",
      title: "Order",
      type: "number",
      group: "publishing",
      description: "Angka kecil tampil lebih dulu.",
      initialValue: 10,
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "postedAt",
      title: "Posted At",
      type: "date",
      group: "publishing",
      description: "Tanggal lowongan tayang. Kosongkan untuk memakai tanggal hari ini.",
    }),
  ],
  preview: {
    select: { title: "title", department: "department", location: "location", status: "status" },
    prepare: ({ title, department, location, status }) => ({
      title: title || "Lowongan",
      subtitle: [department, location, status !== "active" ? status : null].filter(Boolean).join(" — "),
    }),
  },
  orderings: [
    {
      title: "Order lalu judul",
      name: "orderAsc",
      by: [
        { field: "order", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
});

export { DEPARTMENTS, TYPE_LABELS };