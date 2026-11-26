# Changelog

All notable changes to the Samsara Group Studio are recorded here.
Format: keep the newest release on top. Dates are ISO (`YYYY-MM-DD`).

## 1.0.2 — 2026-11-26

### Added

- **Lihat Staging** tool in the staging workspace, opening the stable Vercel
  preview branch alias.
- SEO Title and SEO Description fields on `homePage`.

### Changed

- Standardized page, section, and field labels; em dash separators for
  structure items and field groups.
- Clearer Indonesian descriptions for editors, including input/output context.

## 1.0.1 — 2026-11-21

### Added

- `aboutPage` schema.
- `whatsapp` field on the world schema.

### Changed

- Removed unused menu panel fields (`layout`, `downloadUrl`).
- Lockfile refreshed. CI now fails on high or critical dependency advisories;
  14 moderate production advisories remain and need breaking upgrades.

## 1.0.0 — 2026-11-12

- Baseline release: two workspaces (`production`, `staging`), schemas, custom
  input components, and dataset backup scripts.
