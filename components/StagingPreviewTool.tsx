import type {CSSProperties} from "react";

/**
 * Staging preview tool.
 *
 * The staging dataset is only useful if an editor can see the result. The site
 * reads NEXT_PUBLIC_SANITY_DATASET=staging on Vercel Preview, so this tool opens
 * the stable branch alias in a new tab. It intentionally does not embed the site
 * in an iframe: that would need a CSP frame-ancestors exception and would still
 * only show published content.
 */
const STAGING_URL =
  "https://samsaragroup-git-staging-janalbireo123-3375s-projects.vercel.app";

const page: CSSProperties = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "40px 32px 56px",
  lineHeight: 1.6,
};

const heading: CSSProperties = {
  margin: 0,
  fontSize: 24,
  fontWeight: 700,
  letterSpacing: "-0.01em",
};

const muted: CSSProperties = {
  margin: "8px 0 0",
  color: "var(--card-muted-fg-color, #6b7280)",
};

const panel: CSSProperties = {
  marginTop: 24,
  padding: 20,
  border: "1px solid var(--card-border-color, #e5e7eb)",
  borderRadius: 8,
  background: "var(--card-bg-color, transparent)",
};

const label: CSSProperties = {
  margin: 0,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--card-muted-fg-color, #6b7280)",
};

const code: CSSProperties = {
  display: "block",
  marginTop: 8,
  padding: "10px 12px",
  borderRadius: 6,
  background: "var(--card-code-bg-color, rgba(127, 127, 127, 0.12))",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 12,
  overflowWrap: "anywhere",
};

const actions: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 14,
};

const primaryButton: CSSProperties = {
  appearance: "none",
  border: "none",
  borderRadius: 6,
  padding: "9px 14px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  background: "var(--card-focus-ring-color, #2276fc)",
  color: "#fff",
};

const secondaryButton: CSSProperties = {
  ...primaryButton,
  background: "transparent",
  color: "var(--card-fg-color, inherit)",
  border: "1px solid var(--card-border-color, #d1d5db)",
};

const steps: CSSProperties = {
  marginTop: 28,
  paddingLeft: 20,
  color: "var(--card-muted-fg-color, #4b5563)",
};

export function StagingPreviewTool() {
  const openPreview = () => {
    window.open(STAGING_URL, "_blank", "noopener,noreferrer");
  };

  const copyUrl = () => {
    void navigator.clipboard?.writeText(STAGING_URL);
  };

  return (
    <div style={page}>
      <h1 style={heading}>Lihat Staging</h1>
      <p style={muted}>
        Halaman ini membuka website yang membaca dataset <code>staging</code>.
        Setelah menekan Publish di Studio, tunggu sekitar 60 detik lalu refresh.
        Production tidak berubah.
      </p>

      <div style={panel}>
        <p style={label}>URL staging</p>
        <code style={code}>{STAGING_URL}</code>
        <div style={actions}>
          <button type="button" style={primaryButton} onClick={openPreview}>
            Buka Website Staging
          </button>
          <button type="button" style={secondaryButton} onClick={copyUrl}>
            Copy URL
          </button>
        </div>
      </div>

      <ol style={steps}>
        <li>Edit konten di workspace Samsara Group (Staging).</li>
        <li>Klik Publish.</li>
        <li>Buka website staging, tunggu ±60 detik, lalu refresh.</li>
        <li>URL ini bisa dibuka tanpa login Vercel; preview lain tetap terkunci.</li>
      </ol>
    </div>
  );
}
