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

export default defineConfig({
  name: 'default',
  title: 'Sams Sams',

  projectId: 'p5zu5azj',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content by Page')
          .items([
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
              .id('events-item')
              .title('Events Page — Event (→ /events)')
              .child(S.documentTypeList('event').id('events-list').title('Event — Events Page')),
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
                S.documentTypeList('careerPage')
                  .id('career-page-list')
                  .title('Career Page — hero, judul daftar, Google Form, SEO'),
              ),
            S.divider(),
            S.listItem()
              .id('contact-item')
              .title('Contact Page — Contact Info (→ /contact)')
              .child(
                S.documentTypeList('contactInfo')
                  .id('contact-list')
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
    ],
  },
})
