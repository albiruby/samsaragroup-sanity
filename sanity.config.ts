import {defineConfig, definePlugin} from 'sanity'
import {structureTool, type StructureBuilder} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {LaunchIcon} from '@sanity/icons/Launch'
import {StagingPreviewTool} from './components/StagingPreviewTool'
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
              .title('Home Page — Hero, About Us, Our Brands')
              .child(
                S.document()
                  .schemaType('homePage')
                  .documentId('homePage')
                  .title('Home Page — Hero, About Us, Our Brands'),
              ),
            S.divider(),
            S.listItem()
              .id('home-marquee')
              .title('Home Page — Rolling Gallery')
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
              .title('Brands & Brand Pages — World')
              .child(
                S.documentTypeList('world')
                  .id('world-list')
                  .title('World — Thumbnail, Hero Carousel & Konten Halaman'),
              ),
            S.divider(),
            S.listItem()
              .id('brand-nav-item')
              .title('Header Menu — BRANDS Dropdown')
              .child(
                S.document()
                  .schemaType('brandNav')
                  .documentId('brandNav')
                  .title('BRANDS Dropdown — Baris & Urutan Menu'),
              ),
            S.divider(),
            S.listItem()
              .id('events-item')
              .title('Events Page — Event')
              .child(S.documentTypeList('event').id('events-list').title('Events — Daftar Event')),
            S.listItem()
              .id('events-page-item')
              .title('Events Page — Teks Halaman')
              .child(
                S.document()
                  .schemaType('eventsPage')
                  .documentId('eventsPage')
                  .title('Events Page — Hero, Empty State & SEO'),
              ),
            S.divider(),
            S.listItem()
              .id('career-item')
              .title('Career Page — Career')
              .child(
                S.documentTypeList('career')
                  .id('career-list')
                  .title('Career — Daftar Lowongan'),
              ),
            S.listItem()
              .id('career-page-item')
              .title('Career Page — Teks Halaman')
              .child(
                S.document()
                  .schemaType('careerPage')
                  .documentId('careerPage')
                  .title('Career Page — Hero, Listings, Apply & SEO'),
              ),
            S.divider(),
            S.listItem()
              .id('contact-item')
              .title('Contact Page — Contact Info')
              .child(
                S.document()
                  .schemaType('contactInfo')
                  .documentId('contactInfo')
                  .title('Contact Info — WhatsApp, Alamat & Jam Operasional'),
              ),
          ]),
    }),
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

const stagingPreviewPlugin = definePlugin({
  name: 'staging-preview',
  tools: [
    {
      name: 'staging-preview',
      title: 'Lihat Staging',
      icon: LaunchIcon,
      component: StagingPreviewTool,
    },
  ],
})

export default defineConfig([
  {
    ...sharedConfig,
    name: 'default',
    title: 'Samsara Group',
    dataset: 'production',
    basePath: '/production',
  },
  {
    ...sharedConfig,
    name: 'staging',
    title: 'Samsara Group (Staging)',
    dataset: 'staging',
    basePath: '/staging',
    // Vision lets a signed-in editor run arbitrary GROQ, including against
    // drafts, so it stays out of the production workspace and lives here only.
    plugins: [...sharedConfig.plugins, visionTool(), stagingPreviewPlugin()],
  },
])
