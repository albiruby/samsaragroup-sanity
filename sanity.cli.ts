import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'p5zu5azj',
    dataset: 'production'
  },
  /**
   * Hostname the Studio is served from once deployed. Sanity hosts the Studio
   * itself, so only the schema is uploaded and this URL stays valid until the
   * Studio is deleted. Editing content never requires a redeploy -- only
   * changing the schema does.
   */
  studioHost: 'samsaragroup',
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})