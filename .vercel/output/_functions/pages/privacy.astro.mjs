import { e as createComponent, g as addAttribute, k as renderHead, r as renderTemplate, l as renderComponent } from '../chunks/astro/server_BvoF-d3F.mjs';
import 'piccolore';
/* empty css                                     */
import { $ as $$AmplitudeAnalytics, a as $$Index } from '../chunks/AmplitudeAnalytics_CPxam5Nc.mjs';
import { $ as $$Footer } from '../chunks/Footer_Dd9SNgrx.mjs';
import { G as GlobalClickSpark } from '../chunks/GlobalClickSpark_BnXKgZJU.mjs';
/* empty css                                   */
export { renderers } from '../renderers.mjs';

const $$Privacy = createComponent(($$result, $$props, $$slots) => {
  const lastUpdated = "June 15, 2026";
  const contactEmail = "sarsennbaj.n@gmail.com";
  const siteUrl = "https://www.beuniq.design";
  const pageUrl = `${siteUrl}/privacy`;
  const pageTitle = "Privacy Policy | BeUniq Design";
  const pageDescription = "Privacy Policy for Design Humanizer by BeUniq Design, including waitlist, Firebase, website analytics, and future Chrome extension data handling.";
  const sections = [
    {
      title: "1. Information we collect",
      body: [
        { type: "p", text: "We may collect the following information:" },
        {
          type: "ul",
          items: [
            "email address when you join the waitlist;",
            "basic technical information such as browser type, device type, and page URL;",
            "information you choose to submit through forms or feedback;",
            "limited page/interface data if you explicitly use the Chrome extension analysis features in the future."
          ]
        },
        { type: "p", text: "We do not intentionally collect sensitive personal information." }
      ]
    },
    {
      title: "2. How we use information",
      body: [
        { type: "p", text: "We use collected information to:" },
        {
          type: "ul",
          items: [
            "manage the waitlist;",
            "send product updates or early access invitations;",
            "improve Design Humanizer;",
            "understand how users interact with the product;",
            "debug technical issues;",
            "prevent abuse or duplicate submissions."
          ]
        }
      ]
    },
    {
      title: "3. Waitlist data",
      body: [
        { type: "p", text: "When you submit your email, it may be stored in Firebase Firestore." },
        { type: "p", text: "The waitlist record may include:" },
        {
          type: "ul",
          items: [
            "email address;",
            "normalized email;",
            "submission time;",
            "source page;",
            "basic browser information."
          ]
        },
        { type: "p", text: "We use this only for waitlist and product communication purposes." }
      ]
    },
    {
      title: "4. Chrome extension data",
      body: [
        {
          type: "p",
          text: "Design Humanizer is intended to analyze visible UI structure, such as layout, spacing, cards, buttons, and visual hierarchy."
        },
        {
          type: "p",
          text: "The extension should not collect passwords, payment information, private messages, or sensitive form data."
        },
        {
          type: "p",
          text: "If future versions send page analysis data to a server, users should be informed clearly before that happens."
        }
      ]
    },
    {
      title: "5. Cookies and analytics",
      body: [
        {
          type: "p",
          text: "The website may use basic analytics or technical tools to understand usage and improve performance."
        },
        {
          type: "p",
          text: "If analytics are added, they should be used only to measure general product usage and not to sell personal data."
        }
      ]
    },
    {
      title: "6. Data sharing",
      body: [
        { type: "p", text: "We do not sell your personal information." },
        {
          type: "p",
          text: "We may use trusted service providers such as Firebase or hosting platforms to operate the website and store waitlist data."
        },
        {
          type: "p",
          text: "We may disclose information if required by law or necessary to protect the security of the product."
        }
      ]
    },
    {
      title: "7. Data retention",
      body: [
        {
          type: "p",
          text: "We keep waitlist information only as long as needed for product updates, early access, and related communication."
        },
        { type: "p", text: "You can request deletion of your email from the waitlist." }
      ]
    },
    {
      title: "8. Your choices",
      body: [
        { type: "p", text: "You may:" },
        {
          type: "ul",
          items: [
            "request deletion of your waitlist email;",
            "unsubscribe from product emails;",
            "choose not to submit the waitlist form;",
            "avoid using extension features that require analysis."
          ]
        }
      ]
    },
    {
      title: "9. Security",
      body: [
        { type: "p", text: "We take reasonable steps to protect collected information." },
        {
          type: "p",
          text: "However, no online service is completely secure, and we cannot guarantee absolute security."
        }
      ]
    },
    {
      title: "10. Children\u2019s privacy",
      body: [
        { type: "p", text: "Design Humanizer is not intended to collect personal information from children." },
        {
          type: "p",
          text: "If we learn that we collected information from a child without appropriate consent, we will delete it."
        }
      ]
    },
    {
      title: "11. Changes to this policy",
      body: [
        { type: "p", text: "We may update this Privacy Policy from time to time." },
        {
          type: "p",
          text: "If we make significant changes, we will update the \u201CLast updated\u201D date on this page."
        }
      ]
    }
  ];
  return renderTemplate`<html lang="en" data-astro-cid-fb3qbcs3> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${pageTitle}</title><meta name="description"${addAttribute(pageDescription, "content")}><meta name="robots" content="index, follow"><link rel="canonical"${addAttribute(pageUrl, "href")}><meta property="og:type" content="website"><meta property="og:site_name" content="BeUniq Design"><meta property="og:title"${addAttribute(pageTitle, "content")}><meta property="og:description"${addAttribute(pageDescription, "content")}><meta property="og:url"${addAttribute(pageUrl, "content")}><meta name="twitter:card" content="summary"><meta name="twitter:title"${addAttribute(pageTitle, "content")}><meta name="twitter:description"${addAttribute(pageDescription, "content")}><link rel="icon" type="image/svg+xml" href="/logo/icon-d.svg"><link rel="apple-touch-icon" href="/logo/app-icon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Inter+Tight:wght@400;500;600;700;800&display=swap" rel="stylesheet">${renderHead()}</head> <body data-astro-cid-fb3qbcs3> <main class="privacy-page" data-astro-cid-fb3qbcs3> <div class="lp-container privacy-shell" data-astro-cid-fb3qbcs3> <a class="privacy-back" href="/" data-astro-cid-fb3qbcs3>&larr; Back to home</a> <header class="privacy-head" data-astro-cid-fb3qbcs3> <span class="lp-label" data-astro-cid-fb3qbcs3>Privacy Policy</span> <h1 class="privacy-title" data-astro-cid-fb3qbcs3>Privacy Policy</h1> <p class="privacy-intro" data-astro-cid-fb3qbcs3>
Design Humanizer respects your privacy. This Privacy Policy explains what information we collect,
            how we use it, and what choices you have when using our website, waitlist, and future Chrome extension.
</p> <p class="privacy-updated" data-astro-cid-fb3qbcs3>Last updated: ${lastUpdated}</p> </header> <div class="privacy-body" data-astro-cid-fb3qbcs3> ${sections.map((section) => renderTemplate`<section class="privacy-block" data-astro-cid-fb3qbcs3> <h2 data-astro-cid-fb3qbcs3>${section.title}</h2> ${section.body.map(
    (part) => part.type === "ul" ? renderTemplate`<ul data-astro-cid-fb3qbcs3> ${part.items.map((item) => renderTemplate`<li data-astro-cid-fb3qbcs3>${item}</li>`)} </ul>` : renderTemplate`<p data-astro-cid-fb3qbcs3>${part.text}</p>`
  )} </section>`)} <section class="privacy-block" data-astro-cid-fb3qbcs3> <h2 data-astro-cid-fb3qbcs3>12. Contact</h2> <p data-astro-cid-fb3qbcs3>For privacy questions or deletion requests, contact us at:</p> <p data-astro-cid-fb3qbcs3><a class="privacy-email"${addAttribute(`mailto:${contactEmail}`, "href")} data-astro-cid-fb3qbcs3>${contactEmail}</a></p> </section> </div> <a class="btn btn-primary privacy-back-btn" href="/" data-astro-cid-fb3qbcs3>&larr; Back to home</a> </div> </main> ${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-fb3qbcs3": true })} ${renderComponent($$result, "GlobalClickSpark", GlobalClickSpark, { "client:load": true, "sparkColor": "#111111", "sparkSize": 12, "sparkRadius": 22, "sparkCount": 10, "duration": 520, "client:component-hydration": "load", "client:component-path": "/Users/nursultansarsenbay/dev/polish/src/components/GlobalClickSpark", "client:component-export": "default", "data-astro-cid-fb3qbcs3": true })} ${renderComponent($$result, "AmplitudeAnalytics", $$AmplitudeAnalytics, { "data-astro-cid-fb3qbcs3": true })} ${renderComponent($$result, "Analytics", $$Index, { "data-astro-cid-fb3qbcs3": true })} </body></html>`;
}, "/Users/nursultansarsenbay/dev/polish/src/pages/privacy.astro", void 0);

const $$file = "/Users/nursultansarsenbay/dev/polish/src/pages/privacy.astro";
const $$url = "/privacy";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Privacy,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
