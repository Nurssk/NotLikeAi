import { e as createComponent, g as addAttribute, k as renderHead, l as renderComponent, n as renderScript, r as renderTemplate } from '../../chunks/astro/server_BvoF-d3F.mjs';
import 'piccolore';
/* empty css                                        */
import { $ as $$AmplitudeAnalytics, a as $$Index } from '../../chunks/AmplitudeAnalytics_CPxam5Nc.mjs';
/* empty css                                   */
export { renderers } from '../../renderers.mjs';

const $$Code = createComponent(async ($$result, $$props, $$slots) => {
  const pageTitle = "Extension Code | BeUniq Design";
  const pageDescription = "Copy your one-time BeUniq Design Chrome extension authorization code.";
  return renderTemplate`<html lang="en" data-astro-cid-4fftkoxe> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${pageTitle}</title><meta name="description"${addAttribute(pageDescription, "content")}><meta name="robots" content="noindex, nofollow"><link rel="icon" type="image/svg+xml" href="/logo/icon-d.svg"><link rel="apple-touch-icon" href="/logo/app-icon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Inter+Tight:wght@400;500;600;700;800&display=swap" rel="stylesheet">${renderHead()}</head> <body class="extension-code-body" data-astro-cid-4fftkoxe> <main class="extension-code-page" data-extension-code-page data-astro-cid-4fftkoxe> <section class="extension-code-shell" aria-labelledby="extension-code-title" data-astro-cid-4fftkoxe> <aside class="extension-code-summary" aria-label="Extension code summary" data-astro-cid-4fftkoxe> <div class="extension-code-logo" aria-hidden="true" data-astro-cid-4fftkoxe> <img src="/logo/icon-d-light.svg" alt="" data-astro-cid-4fftkoxe> </div> <div data-astro-cid-4fftkoxe> <h1 id="extension-code-title" data-astro-cid-4fftkoxe>Your extension code</h1> <p data-astro-cid-4fftkoxe>
Copy this one-time code into the Chrome extension with the same email.
</p> </div> <div class="extension-code-steps" aria-label="Code requirements" data-astro-cid-4fftkoxe> <div data-astro-cid-4fftkoxe> <span data-astro-cid-4fftkoxe>1</span> <strong data-astro-cid-4fftkoxe>Use the same email</strong> <p data-astro-cid-4fftkoxe>The extension checks that the email matches this signed-in account.</p> </div> <div data-astro-cid-4fftkoxe> <span data-astro-cid-4fftkoxe>2</span> <strong data-astro-cid-4fftkoxe>Use it once</strong> <p data-astro-cid-4fftkoxe>The code expires in 10 minutes and is marked used after exchange.</p> </div> </div> </aside> <div class="extension-code-card" data-astro-cid-4fftkoxe> <div class="extension-code-card-head" data-astro-cid-4fftkoxe> <h2 data-code-heading data-astro-cid-4fftkoxe>Generating code</h2> <p data-code-subtitle data-astro-cid-4fftkoxe>Checking your signed-in account...</p> </div> <div class="extension-code-panel" data-code-panel aria-live="polite" data-astro-cid-4fftkoxe> <span data-astro-cid-4fftkoxe>One-time code</span> <strong data-extension-code data-astro-cid-4fftkoxe>----</strong> <p data-code-expiry data-astro-cid-4fftkoxe>Generating...</p> </div> <div class="extension-code-actions" data-astro-cid-4fftkoxe> <button class="btn btn-primary extension-copy-button" type="button" data-copy-code disabled data-astro-cid-4fftkoxe>
Copy code
</button> <button class="extension-secondary-button" type="button" data-regenerate-code disabled data-astro-cid-4fftkoxe>
New code
</button> <button class="extension-secondary-button" type="button" data-sign-out data-astro-cid-4fftkoxe>
Sign out
</button> </div> <p class="extension-code-email" data-code-email data-astro-cid-4fftkoxe></p> <p class="extension-code-message" data-code-message aria-live="polite" data-astro-cid-4fftkoxe>
Keep this page open until you finish signing in from the Chrome extension.
</p> </div> </section> </main> ${renderComponent($$result, "AmplitudeAnalytics", $$AmplitudeAnalytics, { "data-astro-cid-4fftkoxe": true })} ${renderComponent($$result, "Analytics", $$Index, { "data-astro-cid-4fftkoxe": true })}  ${renderScript($$result, "/Users/nursultansarsenbay/dev/polish/src/pages/extension/code.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/Users/nursultansarsenbay/dev/polish/src/pages/extension/code.astro", void 0);

const $$file = "/Users/nursultansarsenbay/dev/polish/src/pages/extension/code.astro";
const $$url = "/extension/code";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Code,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
