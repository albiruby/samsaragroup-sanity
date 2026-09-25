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
            S.listItem()
              .id('svvara-partners-item')
              .title('Svvara Page — Store Partners (carousel /svvara)')
              .child(
                carouselList(S, {
                  id: 'svvara-partners',
                  title: 'Svvara Page — Store Partners',
                  placement: 'svvaraPartners',
                  templateId: 'carouselImage-svvara-partners',
                }),
              ),
            S.divider(),
            S.listItem()
              .id('world-thumbnail-item')
              .title('Brands Page — World Thumbnail (→ kartu /brands)')
              .child(
                S.documentTypeList('world')
                  .id('world-thumbnails')
                  .title('Thumbnail per Brand — isi field Image'),
              ),
            S.listItem()
              .id('world-hero-item')
              .title('Brand Pages — Hero Carousel & Teks (isi field Gallery)')
              .child(
                S.documentTypeList('world')
                  .id('world-hero')
                  .title('Hero Carousel per Brand — isi field Gallery + Tagline/Description/Specs'),
              ),
            S.divider(),
            S.listItem()
              .id('events-item')
              .title('Events Page — Event (→ /events)')
              .child(S.documentTypeList('event').id('events-list').title('Event — Events Page')),
            S.listItem()
              .id('products-item')
              .title('Svvara Page — Product (→ carousel produk)')
              .child(S.documentTypeList('product').id('products-list').title('Product — Svvara Page')),
            S.listItem()
              .id('contact-item')
              .title('Contact Page — Contact Info (→ /contact)')
              .child(
                S.documentTypeList('contactInfo')
                  .id('contact-list')
                  .title('Contact Info — Contact Page'),
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
        id: 'carouselImage-svvara-partners',
        title: 'Svvara Page — Store Partner Image',
        schemaType: 'carouselImage',
        value: {placement: 'svvaraPartners', active: true, order: 100},
      },
    ],
  },
})
