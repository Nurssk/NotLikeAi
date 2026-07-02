import { e as createComponent, m as maybeRenderHead, g as addAttribute, r as renderTemplate } from './astro/server_BvoF-d3F.mjs';
import 'piccolore';
import 'clsx';

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const links = [
    { label: "Q&A", href: "/#qa" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy", href: "/privacy" },
    { label: "GitHub", href: "https://github.com/Nurssk/NotLikeAi" }
  ];
  const contactEmail = "sarsennbaj.n@gmail.com";
  return renderTemplate`${maybeRenderHead()}<footer id="contact" class="site-footer"> <div class="site-footer-inner"> <a class="footer-statement" href="/#product" aria-label="Design Humanizer home">
Design Humanizer · Built for AI app builders.
</a> <nav class="footer-nav" aria-label="Footer"> ${links.map((link) => renderTemplate`<a${addAttribute(link.href, "href")}>${link.label}</a>`)} <a${addAttribute(`mailto:${contactEmail}`, "href")}>${contactEmail}</a> </nav> </div> </footer>`;
}, "/Users/nursultansarsenbay/dev/polish/src/components/Footer.astro", void 0);

export { $$Footer as $ };
