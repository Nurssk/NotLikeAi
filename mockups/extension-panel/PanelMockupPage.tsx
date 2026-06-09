import { ExtensionPanelMockup } from "./ExtensionPanelMockup";

export function PanelMockupPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 48,
        background:
          "radial-gradient(circle at 25% 10%, rgba(255,176,0,0.24), transparent 420px), radial-gradient(circle at 80% 20%, rgba(255,122,0,0.16), transparent 360px), linear-gradient(180deg, #0E0A05 0%, #070401 100%)",
        overflow: "hidden"
      }}
    >
      <ExtensionPanelMockup />
    </main>
  );
}
