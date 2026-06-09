import type { CSSProperties, ReactNode } from "react";

export const PRODUCT_NAME = "Design Humanizer";
export const TAGLINE = "AI UI polish assistant";

type ExtensionPanelMockupProps = {
  productName?: string;
  tagline?: string;
  style?: CSSProperties;
};

const demoLayouts = [
  {
    name: "Bento feature grid",
    label: "best for product sections",
    selected: true
  }
];

const demoAnimations = ["Stagger cards"];

export function ExtensionPanelMockup({
  productName = PRODUCT_NAME,
  tagline = TAGLINE,
  style
}: ExtensionPanelMockupProps) {
  return (
    <aside
      aria-label={`${productName} extension panel mockup`}
      data-export-target="extension-panel-mockup"
      style={{ ...styles.shell, ...style }}
    >
      <div style={styles.panelGlow} />
      <div style={styles.panelChrome}>
        <header style={styles.header}>
          <div style={styles.brandRow}>
            <div style={styles.logo}>DH</div>
            <div style={styles.brandText}>
              <h2 style={styles.productName}>{productName}</h2>
              <p style={styles.tagline}>{tagline}</p>
            </div>
          </div>
          <Pill tone="success">Simple</Pill>
        </header>

        <button style={styles.primaryButton} type="button">
          <span style={styles.plus}>+</span>
          New Screenshot
        </button>

        <Card>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Selected Area</h3>
              <p style={styles.mutedText}>428 x 312 captured</p>
            </div>
            <Pill>Screenshot ready</Pill>
          </div>
          <div style={styles.previewFrame}>
            <div style={styles.previewCanvas}>
              <div style={styles.previewHeader} />
              <div style={styles.previewHero}>
                <div style={styles.previewCopy}>
                  <span style={styles.previewLineLong} />
                  <span style={styles.previewLine} />
                  <span style={styles.previewCta} />
                </div>
                <div style={styles.previewMedia} />
              </div>
              <div style={styles.previewGrid}>
                <span style={styles.previewGridCard} />
                <span style={styles.previewGridCard} />
                <span style={styles.previewGridCard} />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 style={styles.cardTitle}>Understanding</h3>
          <div style={styles.chipRow}>
            <Pill>hero</Pill>
            <Pill>two_column</Pill>
            <Pill>weak_hierarchy</Pill>
          </div>
          <p style={styles.bodyText}>
            AI detected a conversion hero with weak hierarchy and flat visual rhythm.
          </p>
        </Card>

        <Card>
          <h3 style={styles.cardTitle}>Design layouts</h3>
          <p style={styles.mutedText}>Local layout patterns matched from AI signals.</p>
          <div style={styles.layoutStack}>
            {demoLayouts.map((layout) => (
              <LayoutSuggestion key={layout.name} {...layout} />
            ))}
          </div>
        </Card>

        <Card>
          <h3 style={styles.cardTitle}>Animation ideas</h3>
          <div style={styles.animationList}>
            {demoAnimations.map((animation) => (
              <div key={animation} style={styles.animationItem}>
                <span style={styles.animationDot} />
                <span>{animation}</span>
              </div>
            ))}
          </div>
          <h3 style={styles.previewSubTitle}>Preview</h3>
          <div style={styles.actionGrid}>
            <button style={styles.primaryTinyButton} type="button">
              Generate AI Preview
            </button>
            <button style={styles.secondaryButton} type="button">
              Open Gallery
            </button>
          </div>
        </Card>
      </div>

      <footer style={styles.footer}>
        <button style={styles.footerPrimaryButton} type="button">
          Copy Cursor Prompt
        </button>
      </footer>
    </aside>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <section style={styles.card}>{children}</section>;
}

function Pill({ children, tone }: { children: ReactNode; tone?: "success" }) {
  return (
    <span style={{ ...styles.pill, ...(tone === "success" ? styles.successPill : null) }}>
      {tone === "success" ? <span style={styles.statusDot} /> : null}
      {children}
    </span>
  );
}

function LayoutSuggestion({
  name,
  label,
  selected
}: {
  name: string;
  label: string;
  selected: boolean;
}) {
  return (
    <article style={{ ...styles.layoutCard, ...(selected ? styles.layoutCardSelected : null) }}>
        <div style={styles.layoutPreview}>
          <div style={styles.layoutPreviewLeft}>
          <span style={styles.layoutPreviewLineStrong} />
          <span style={styles.layoutPreviewLine} />
          <span style={styles.layoutPreviewButton} />
          </div>
          <div style={styles.layoutPreviewRight} />
      </div>
      <div style={styles.layoutContent}>
        <h4 style={styles.layoutName}>{name}</h4>
        <p style={styles.layoutLabel}>{label}</p>
      </div>
      <span style={selected ? styles.selectedBadge : styles.useBadge}>
        {selected ? "Selected" : "Use"}
      </span>
    </article>
  );
}

const colors = {
  bg: "#0E0A05",
  panel: "#171007",
  card: "#1F160A",
  cardElevated: "#2A1B0A",
  border: "rgba(255, 176, 0, 0.24)",
  borderStrong: "rgba(255, 176, 0, 0.42)",
  text: "#FFF8E8",
  muted: "#D8C7A5",
  soft: "#8F7A55",
  primary: "#FFB000",
  primaryBright: "#FFC857",
  primaryDeep: "#FF7A00",
  secondary: "#FF9F1C",
  success: "#63E6BE"
};

const styles = {
  shell: {
    position: "relative",
    width: 408,
    height: 760,
    overflow: "hidden",
    borderRadius: 30,
    border: `1px solid ${colors.border}`,
    background:
      "radial-gradient(circle at 18% 0%, rgba(255,176,0,0.22), transparent 310px), radial-gradient(circle at 82% 18%, rgba(255,122,0,0.14), transparent 260px), linear-gradient(180deg, #0E0A05 0%, #171007 58%, #090603 100%)",
    boxShadow:
      "0 40px 120px rgba(0,0,0,0.55), 0 0 70px rgba(255,176,0,0.26)",
    color: colors.text,
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  panelGlow: {
    position: "absolute",
    inset: "-80px -70px auto auto",
    width: 220,
    height: 220,
    borderRadius: "999px",
    background: "rgba(255,176,0,0.22)",
    filter: "blur(38px)",
    pointerEvents: "none"
  },
  panelChrome: {
    position: "absolute",
    inset: "0 0 58px 0",
    overflow: "hidden auto",
    padding: "16px 16px 12px"
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    paddingBottom: 12,
    borderBottom: `1px solid ${colors.border}`
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    minWidth: 0,
    gap: 12
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    flex: "0 0 auto",
    borderRadius: 14,
    background: "linear-gradient(135deg, #FF7A00 0%, #FFB000 100%)",
    color: "#120B03",
    fontSize: 14,
    fontWeight: 900,
    boxShadow: "0 12px 26px rgba(255,122,0,0.38)"
  },
  brandText: {
    minWidth: 0
  },
  productName: {
    margin: 0,
    fontSize: 16,
    lineHeight: "20px",
    fontWeight: 900,
    letterSpacing: 0
  },
  tagline: {
    margin: "2px 0 0",
    fontSize: 12,
    lineHeight: "16px",
    color: colors.muted
  },
  segmented: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 4,
    marginTop: 12,
    padding: 4,
    borderRadius: 14,
    border: `1px solid ${colors.border}`,
    background: "rgba(255,176,0,0.1)"
  },
  segmentActive: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 30,
    borderRadius: 10,
    background: "linear-gradient(90deg, #FF7A00 0%, #FFB000 100%)",
    boxShadow: "0 0 28px rgba(255,176,0,0.35)",
    color: "#120B03",
    fontSize: 12,
    fontWeight: 800
  },
  segment: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 30,
    borderRadius: 10,
    color: colors.muted,
    fontSize: 12,
    fontWeight: 800
  },
  primaryButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    height: 44,
    marginTop: 12,
    border: 0,
    borderRadius: 14,
    background: "linear-gradient(90deg, #FF7A00 0%, #FFB000 100%)",
    color: "#120B03",
    fontSize: 14,
    fontWeight: 900,
    boxShadow: "0 18px 40px rgba(255,122,0,0.34)",
    fontFamily: "inherit"
  },
  plus: {
    fontSize: 20,
    lineHeight: 1,
    marginTop: -1
  },
  card: {
    marginTop: 9,
    padding: 10,
    borderRadius: 14,
    border: `1px solid ${colors.border}`,
    background: "rgba(31,22,10,0.9)",
    boxShadow: "0 18px 60px rgba(255,122,0,0.12)",
    backdropFilter: "blur(12px)"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10
  },
  cardTitle: {
    margin: 0,
    fontSize: 13,
    lineHeight: "17px",
    fontWeight: 900,
    color: colors.text
  },
  mutedText: {
    margin: "4px 0 0",
    fontSize: 11,
    lineHeight: "17px",
    color: colors.muted
  },
  bodyText: {
    margin: "8px 0 0",
    fontSize: 11,
    lineHeight: "16px",
    color: colors.muted
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    width: "fit-content",
    whiteSpace: "nowrap",
    borderRadius: 999,
    border: `1px solid ${colors.border}`,
    background: "rgba(255,176,0,0.12)",
    padding: "5px 9px",
    color: colors.muted,
    fontSize: 11,
    lineHeight: "13px",
    fontWeight: 800
  },
  successPill: {
    color: colors.muted
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    background: colors.success,
    boxShadow: "0 0 12px rgba(99,230,190,0.7)"
  },
  previewFrame: {
    marginTop: 8,
    minHeight: 62,
    borderRadius: 11,
    border: `1px solid ${colors.border}`,
    background: "rgba(42,27,10,0.55)",
    padding: 8
  },
  previewCanvas: {
    height: 62,
    borderRadius: 9,
    overflow: "hidden",
    background:
      "linear-gradient(135deg, rgba(255,248,232,0.96), rgba(255,200,87,0.24))",
    padding: 8
  },
  previewHeader: {
    height: 6,
    width: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, rgba(23,16,7,0.78), rgba(255,176,0,0.38))"
  },
  previewHero: {
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: 10,
    marginTop: 6
  },
  previewCopy: {
    display: "flex",
    flexDirection: "column",
    gap: 4
  },
  previewLineLong: {
    height: 9,
    width: "86%",
    borderRadius: 999,
    background: "rgba(23,16,7,0.76)"
  },
  previewLine: {
    height: 6,
    width: "64%",
    borderRadius: 999,
    background: "rgba(23,16,7,0.28)"
  },
  previewCta: {
    height: 11,
    width: 68,
    marginTop: 4,
    borderRadius: 7,
    background: "linear-gradient(90deg, #FF7A00, #FFB000)"
  },
  previewMedia: {
    minHeight: 28,
    borderRadius: 10,
    background:
      "radial-gradient(circle at 70% 22%, rgba(255,200,87,0.72), transparent 30px), linear-gradient(135deg, #2A1B0A, #FF7A00)"
  },
  previewGrid: {
    display: "none",
    marginTop: 0
  },
  previewGridCard: {
    display: "block",
    height: 14,
    borderRadius: 7,
    background: "rgba(23,16,7,0.2)"
  },
  metrics: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 7,
    marginTop: 7
  },
  metric: {
    borderRadius: 10,
    border: `1px solid ${colors.border}`,
    background: "rgba(42,27,10,0.7)",
    padding: 7
  },
  metricLabel: {
    display: "block",
    color: colors.soft,
    fontSize: 10,
    lineHeight: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em"
  },
  metricValue: {
    display: "block",
    marginTop: 3,
    color: colors.text,
    fontSize: 12,
    lineHeight: "14px",
    fontWeight: 900
  },
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 7
  },
  layoutStack: {
    display: "grid",
    gap: 6,
    marginTop: 7
  },
  layoutCard: {
    display: "grid",
    gridTemplateColumns: "50px 1fr auto",
    alignItems: "center",
    gap: 10,
    borderRadius: 11,
    border: `1px solid ${colors.border}`,
    background: "rgba(42,27,10,0.62)",
    padding: 7
  },
  layoutCardSelected: {
    borderColor: colors.borderStrong,
    background: "rgba(255,176,0,0.14)",
    boxShadow: "0 0 28px rgba(255,176,0,0.32)"
  },
  layoutPreview: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 4,
    height: 32,
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    background: "rgba(14,10,5,0.72)",
    padding: 4
  },
  layoutPreviewLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 3
  },
  layoutPreviewLineStrong: {
    display: "block",
    width: "86%",
    height: 4,
    borderRadius: 999,
    background: "rgba(255,248,232,0.56)"
  },
  layoutPreviewLine: {
    display: "block",
    width: "64%",
    height: 3,
    borderRadius: 999,
    background: "rgba(255,248,232,0.25)"
  },
  layoutPreviewButton: {
    display: "block",
    width: 24,
    height: 8,
    marginTop: 2,
    borderRadius: 4,
    background: "rgba(255,176,0,0.72)"
  },
  layoutPreviewRight: {
    borderRadius: 6,
    background: "rgba(255,159,28,0.36)"
  },
  layoutContent: {
    minWidth: 0
  },
  layoutName: {
    margin: 0,
    color: colors.text,
    fontSize: 12,
    lineHeight: "15px",
    fontWeight: 900
  },
  layoutLabel: {
    margin: "2px 0 0",
    color: colors.muted,
    fontSize: 10,
    lineHeight: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em"
  },
  selectedBadge: {
    borderRadius: 999,
    border: "1px solid rgba(255,176,0,0.45)",
    background: "rgba(255,176,0,0.18)",
    padding: "3px 6px",
    color: "#FFF8E8",
    fontSize: 10,
    fontWeight: 800
  },
  useBadge: {
    borderRadius: 999,
    border: `1px solid ${colors.border}`,
    padding: "3px 7px",
    color: colors.muted,
    fontSize: 10,
    fontWeight: 800
  },
  animationList: {
    display: "grid",
    gap: 5,
    marginTop: 7
  },
  animationItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    border: `1px solid ${colors.border}`,
    background: "rgba(42,27,10,0.62)",
    padding: "6px 8px",
    color: colors.muted,
    fontSize: 11,
    fontWeight: 800
  },
  animationDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    background: "linear-gradient(135deg, #FF7A00, #FFB000)",
    boxShadow: "0 0 12px rgba(255,176,0,0.6)"
  },
  primarySmallButton: {
    width: "100%",
    marginTop: 8,
    border: 0,
    borderRadius: 12,
    background: "linear-gradient(90deg, #FF7A00 0%, #FFB000 100%)",
    color: "#120B03",
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 900,
    boxShadow: "0 16px 32px rgba(255,122,0,0.34)",
    fontFamily: "inherit"
  },
  primaryTinyButton: {
    border: 0,
    borderRadius: 10,
    background: "linear-gradient(90deg, #FF7A00 0%, #FFB000 100%)",
    color: "#120B03",
    padding: "7px 9px",
    fontSize: 11,
    fontWeight: 900,
    boxShadow: "0 12px 24px rgba(255,122,0,0.28)",
    fontFamily: "inherit"
  },
  previewSubTitle: {
    margin: "9px 0 0",
    color: colors.text,
    fontSize: 12,
    lineHeight: "15px",
    fontWeight: 900
  },
  actionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginTop: 8
  },
  secondaryButton: {
    border: `1px solid ${colors.border}`,
    borderRadius: 10,
    background: "rgba(42,27,10,0.7)",
    color: colors.muted,
    padding: "7px 9px",
    fontSize: 11,
    fontWeight: 800,
    fontFamily: "inherit"
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    display: "grid",
    gap: 8,
    padding: "8px 16px 10px",
    borderTop: `1px solid ${colors.border}`,
    background:
      "linear-gradient(0deg, #0E0A05 0%, rgba(14,10,5,0.98) 72%, rgba(14,10,5,0.82) 100%)",
    backdropFilter: "blur(14px)"
  },
  footerPrimaryButton: {
    width: "100%",
    border: 0,
    borderRadius: 13,
    background: "linear-gradient(90deg, #FF7A00 0%, #FFB000 100%)",
    color: "#120B03",
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 900,
    boxShadow: "0 16px 32px rgba(255,122,0,0.34)",
    fontFamily: "inherit"
  },
  footerSecondaryButton: {
    width: "100%",
    border: `1px solid ${colors.border}`,
    borderRadius: 11,
    background: "rgba(42,27,10,0.7)",
    color: colors.muted,
    padding: "8px 12px",
    fontSize: 11,
    fontWeight: 800,
    fontFamily: "inherit"
  }
} satisfies Record<string, CSSProperties>;
