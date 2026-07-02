import { e as createComponent, r as renderTemplate, n as renderScript, l as renderComponent, g as addAttribute, k as renderHead, u as unescapeHTML } from '../chunks/astro/server_BvoF-d3F.mjs';
import 'piccolore';
/* empty css                                     */
import { a as $$Index, $ as $$AmplitudeAnalytics } from '../chunks/AmplitudeAnalytics_CPxam5Nc.mjs';
import { $ as $$FAQAccordion } from '../chunks/FAQAccordion_CBbY1Zm1.mjs';
import { $ as $$Footer } from '../chunks/Footer_Dd9SNgrx.mjs';
import { G as GlobalClickSpark } from '../chunks/GlobalClickSpark_BnXKgZJU.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Faq = createComponent(($$result, $$props, $$slots) => {
  const faqItems = [
    {
      id: "q1",
      number: "01",
      category: "Product",
      question: "What does Design Humanizer actually do?",
      answer: "It analyzes an AI-generated interface and shows what feels generic: weak hierarchy, repeated cards, unclear focus, poor spacing, and low visual priority. Then it suggests how to make the same content feel more intentional."
    },
    {
      id: "q2",
      number: "02",
      category: "Product",
      question: "Is Design Humanizer a design generator?",
      answer: "Not exactly. It is closer to a design critique layer. It does not create a random new website from scratch; it helps improve the interface you already have."
    },
    {
      id: "q3",
      number: "03",
      category: "Product",
      question: "Does it replace a designer?",
      answer: "No. It helps non-designers make better design decisions faster. A designer can still make deeper brand and product decisions."
    },
    {
      id: "q4",
      number: "04",
      category: "Workflow",
      question: "Does it change my content?",
      answer: "No. The goal is to keep your original content and improve how it is presented visually."
    },
    {
      id: "q5",
      number: "05",
      category: "Workflow",
      question: "What problems does it detect?",
      answer: "It detects weak hierarchy, repeated cards, unclear CTA focus, generic layout rhythm, poor grouping, spacing issues, and visual sameness."
    },
    {
      id: "q6",
      number: "06",
      category: "Workflow",
      question: "Can I preview changes before applying them?",
      answer: "Yes. The goal is to show a clearer design direction before you change the actual page."
    },
    {
      id: "q7",
      number: "07",
      category: "Chrome Extension",
      question: "How does the Chrome extension work?",
      answer: "The extension runs directly on the current page, reads the visible layout, detects weak design patterns, and shows suggestions in a side panel."
    },
    {
      id: "q8",
      number: "08",
      category: "Chrome Extension",
      question: "What kinds of pages can it analyze?",
      answer: "Landing pages, MVP screens, dashboards, generated frontend pages, and product interfaces that run in the browser."
    },
    {
      id: "q9",
      number: "09",
      category: "Privacy",
      question: "Is my page data stored?",
      answer: "For the MVP, Design Humanizer should avoid storing page content unless the user explicitly chooses to submit or save it."
    },
    {
      id: "q10",
      number: "10",
      category: "Privacy",
      question: "Will it edit my code automatically?",
      answer: "The first version focuses on analysis and preview. Apply/copy features can be added later depending on the product roadmap."
    },
    {
      id: "q11",
      number: "11",
      category: "Access",
      question: "When will it be available?",
      answer: "Click Start to sign in with Google and open the Chrome Web Store listing."
    }
  ];
  const categories = ["All", "Product", "Workflow", "Chrome Extension", "Privacy", "Access"];
  const siteUrl = "https://www.beuniq.design";
  const pageUrl = `${siteUrl}/faq`;
  const pageTitle = "FAQ | BeUniq Design UI Humanizer";
  const pageDescription = "Questions and answers about Design Humanizer, a Chrome extension for humanizing AI-generated UI, reviewing screenshots, and improving product design.";
  const pageKeywords = [
    "humanize design UI FAQ",
    "AI UI design FAQ",
    "Design Humanizer questions",
    "UI screenshot analysis",
    "AI-generated interface feedback"
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>', '</title><meta name="description"', '><meta name="keywords"', '><meta name="robots" content="index, follow"><link rel="canonical"', '><meta property="og:type" content="website"><meta property="og:site_name" content="BeUniq Design"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:url"', '><meta name="twitter:card" content="summary"><meta name="twitter:title"', '><meta name="twitter:description"', '><link rel="icon" type="image/svg+xml" href="/logo/icon-d.svg"><link rel="apple-touch-icon" href="/logo/app-icon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Inter+Tight:wght@400;500;600;700;800&display=swap" rel="stylesheet"><script type="application/ld+json">', "<\/script>", '</head> <body> <main class="faq-page"> <section class="faq-body-section" aria-labelledby="faq-list-heading" data-faq-filter-root> <div class="lp-container faq-body-grid"> <aside class="faq-nav-card" aria-label="FAQ navigation"> <h2>Navigation</h2> <div class="faq-category-list"> ', ' </div> <a class="faq-nav-action" href="mailto:sarsennbaj.n@gmail.com">Ask your question &rarr;</a> </aside> <div id="faq-list" class="faq-list-column"> <h1 id="faq-list-heading" class="faq-list-title">Questions &amp; answers</h1> ', ' <p class="faq-empty-state" data-faq-empty hidden>No questions in this category yet.</p> </div> </div> </section> </main> ', " ", " ", " ", " ", " </body> </html>"])), pageTitle, addAttribute(pageDescription, "content"), addAttribute(pageKeywords.join(", "), "content"), addAttribute(pageUrl, "href"), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), addAttribute(pageUrl, "content"), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), unescapeHTML(JSON.stringify(faqSchema)), renderHead(), categories.map((category, i) => renderTemplate`<button${addAttribute(i === 0 ? "is-active" : "", "class")} type="button"${addAttribute(category, "data-faq-filter")}${addAttribute(i === 0 ? "true" : "false", "aria-pressed")}> ${category} </button>`), renderComponent($$result, "FAQAccordion", $$FAQAccordion, { "items": faqItems, "className": "faq-accordion--full" }), renderComponent($$result, "Footer", $$Footer, {}), renderComponent($$result, "GlobalClickSpark", GlobalClickSpark, { "client:load": true, "sparkColor": "#111111", "sparkSize": 12, "sparkRadius": 22, "sparkCount": 10, "duration": 520, "client:component-hydration": "load", "client:component-path": "/Users/nursultansarsenbay/dev/polish/src/components/GlobalClickSpark", "client:component-export": "default" }), renderComponent($$result, "AmplitudeAnalytics", $$AmplitudeAnalytics, {}), renderComponent($$result, "Analytics", $$Index, {}), renderScript($$result, "/Users/nursultansarsenbay/dev/polish/src/pages/faq.astro?astro&type=script&index=0&lang.ts"));
}, "/Users/nursultansarsenbay/dev/polish/src/pages/faq.astro", void 0);

const $$file = "/Users/nursultansarsenbay/dev/polish/src/pages/faq.astro";
const $$url = "/faq";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Faq,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
