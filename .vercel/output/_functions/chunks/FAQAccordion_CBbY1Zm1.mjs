import { e as createComponent, m as maybeRenderHead, g as addAttribute, r as renderTemplate, n as renderScript, h as createAstro } from './astro/server_BvoF-d3F.mjs';
import 'piccolore';
import 'clsx';

const $$Astro = createAstro();
const $$FAQAccordion = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FAQAccordion;
  const { items, className = "", startOpenIndex = 0, featuredIndex } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`faq-accordion ${className}`, "class")} data-faq-accordion> ${items.map((item, i) => renderTemplate`<details${addAttribute(["faq-item", { "is-featured": featuredIndex === i }], "class:list")} data-faq-item${addAttribute(featuredIndex === i ? "true" : void 0, "data-featured")}${addAttribute(item.category, "data-category")}${addAttribute(item.id, "data-id")}${addAttribute(i === startOpenIndex, "open")}> <summary> <span class="faq-item-number">${item.number ?? String(i + 1).padStart(2, "0")}</span> <span class="faq-item-question">${item.question ?? item.q}</span> <span class="faq-item-toggle" aria-hidden="true"></span> </summary> <div class="faq-item-panel"> <div class="faq-item-panel-inner"> <p>${item.answer ?? item.a}</p> </div> </div> </details>`)} </div> ${renderScript($$result, "/Users/nursultansarsenbay/dev/polish/src/components/FAQAccordion.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/nursultansarsenbay/dev/polish/src/components/FAQAccordion.astro", void 0);

export { $$FAQAccordion as $ };
