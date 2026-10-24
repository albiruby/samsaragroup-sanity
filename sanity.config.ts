import {defineConfig} from 'sanity'
import {structureTool, type StructureBuilder} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const carouselList = (
  S: StructureBuilder,
  opts: {id: string; title: string; placement: string; templateId: string},
) =>
  S.documentList()
    .id(opts.id)
    .title(opts.title)
    .filter('_type == "carouselImage" && placement == $placement')
    .params({placement: opts.placement})
    .initialValueTemplates(S.initialValueTemplateItem(opts.templateId))

const sharedConfig = {
  projectId: 'p5zu5azj',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content by Page')
          .items([
            S.listItem()
              .id('home-page-item')
              .title('Home Page — teks & gambar (→ /)')
              .child(
                S.document()
                  .schemaType('homePage')
                  .documentId('homePage')
                  .title('Home Page — hero, About Us, Our Brands'),
              ),
            S.divider(),
            S.listItem()
              .id('home-marquee')
              .title('Home Page — Rolling Gallery (marquee homepage)')
              .child(
                carouselList(S, {
                  id: 'home-rolling',
                  title: 'Home Page — Rolling Gallery',
                  placement: 'home',
                  templateId: 'carouselImage-home',
                }),
              ),
            S.divider(),
            S.listItem()
              .id('world-item')
              .title('Brands & Brand Pages — World (Thumbnail, Hero Carousel, Teks)')
              .child(
                S.documentTypeList('world')
                  .id('world-list')
                  .title('World — isi field Image (Thumbnail), Gallery (Hero Carousel), Tagline/Description/Specs'),
              ),
            S.divider(),
            S.listItem()
              .id('brand-nav-item')
              .title('Header Menu — BRANDS Dropdown (→ semua halaman)')
              .child(
                S.document()
                  .schemaType('brandNav')
                  .documentId('brandNav')
                  .title('BRANDS Dropdown — baris & urutan menu BRANDS'),
              ),
            S.divider(),
            S.listItem()
              .id('events-item')
              .title('Events Page — Event (→ /events)')
              .child(S.documentTypeList('event').id('events-list').title('Event — Events Page')),
            S.listItem()
              .id('events-page-item')
              .title('Events Page — teks halaman (→ /events)')
              .child(
                S.document()
                  .schemaType('eventsPage')
                  .documentId('eventsPage')
                  .title('Events Page — judul, pesan saat kosong, SEO'),
              ),
            S.divider(),
            S.listItem()
              .id('career-item')
              .title('Career Page — Career (→ /career)')
              .child(
                S.documentTypeList('career')
                  .id('career-list')
                  .title('Career — daftar lowongan (1 dokumen = 1 lowongan)'),
              ),
            S.listItem()
              .id('career-page-item')
              .title('Career Page — teks halaman (→ /career)')
              .child(
                S.document()
                  .schemaType('careerPage')
                  .documentId('careerPage')
                  .title('Career Page — hero, judul daftar, Google Form, SEO'),
              ),
            S.divider(),
            S.listItem()
              .id('contact-item')
              .title('Contact Page — Contact Info (→ /contact)')
              .child(
                S.document()
                  .schemaType('contactInfo')
                  .documentId('contactInfo')
                  .title('Contact Info — WhatsApp, alamat, jam'),
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: [
      {
        id: 'carouselImage-home',
        title: 'Home Page — Rolling Gallery Image',
        schemaType: 'carouselImage',
        value: {placement: 'home', active: true, order: 100},
      },
      {
        id: 'brandNav-default',
        title: 'BRANDS Dropdown',
        schemaType: 'brandNav',
        value: {seeAllLabel: 'See All Brands →', emptyLabel: 'Hover a brand', rows: []},
      },
    ],
  },
}

export default defineConfig([
  {
    ...sharedConfig,
    name: 'default',
    title: 'Sams Sams',
    dataset: 'production',
  },
  {
    ...sharedConfig,
    name: 'staging',
    title: 'Sams Sams (Staging)',
    dataset: 'staging',
    basePath: '/staging',
  },
])
