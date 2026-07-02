import { e as createComponent, g as addAttribute, k as renderHead, l as renderComponent, n as renderScript, r as renderTemplate } from '../../chunks/astro/server_BvoF-d3F.mjs';
import 'piccolore';
/* empty css                                        */
import { $ as $$AmplitudeAnalytics, a as $$Index } from '../../chunks/AmplitudeAnalytics_CPxam5Nc.mjs';
/* empty css                                        */
export { renderers } from '../../renderers.mjs';

const $$Authorize = createComponent(async ($$result, $$props, $$slots) => {
  const pageTitle = "Authorize Chrome Extension | BeUniq Design";
  const pageDescription = "Authorize the BeUniq Design Chrome extension with a short one-time code.";
  return renderTemplate`<html lang="en" data-astro-cid-anc4ye4m> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${pageTitle}</title><meta name="description"${addAttribute(pageDescription, "content")}><meta name="robots" content="noindex, nofollow"><link rel="icon" type="image/svg+xml" href="/logo/icon-d.svg"><link rel="apple-touch-icon" href="/logo/app-icon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Inter+Tight:wght@400;500;600;700;800&display=swap" rel="stylesheet">${renderHead()}</head> <body class="extension-authorize-body" data-astro-cid-anc4ye4m> <main class="extension-authorize-page" data-extension-authorize data-astro-cid-anc4ye4m> <section class="extension-authorize-shell" aria-labelledby="extension-authorize-title" data-astro-cid-anc4ye4m> <aside class="extension-authorize-summary" aria-label="Extension authorization summary" data-astro-cid-anc4ye4m> <div class="extension-authorize-logo" data-astro-cid-anc4ye4m> <img src="/logo/icon-d-light.svg" alt="BeUniq Design" data-astro-cid-anc4ye4m> </div> <div data-astro-cid-anc4ye4m> <h1 id="extension-authorize-title" data-astro-cid-anc4ye4m>Authorize extension</h1> <p data-astro-cid-anc4ye4m>
Sign in with Google or verify your email, then copy the one-time code into the Chrome extension.
</p> </div> <div class="extension-authorize-steps" aria-label="Authorization steps" data-astro-cid-anc4ye4m> <div data-astro-cid-anc4ye4m> <span data-astro-cid-anc4ye4m>1</span> <strong data-astro-cid-anc4ye4m>Log in on the website</strong> <p data-astro-cid-anc4ye4m>Google and email sign-in stay in the browser where they work normally.</p> </div> <div data-astro-cid-anc4ye4m> <span data-astro-cid-anc4ye4m>2</span> <strong data-astro-cid-anc4ye4m>Use the short code</strong> <p data-astro-cid-anc4ye4m>Codes expire in 10 minutes and can only be exchanged once.</p> </div> </div> </aside> <div class="extension-authorize-card" data-authorize-card data-astro-cid-anc4ye4m> <div class="extension-authorize-card-head" data-astro-cid-anc4ye4m> <h2 data-auth-heading data-astro-cid-anc4ye4m>Log in</h2> <p data-auth-subtitle data-astro-cid-anc4ye4m>Access the account you want to connect to the Chrome extension.</p> </div> <button class="extension-google-button" type="button" data-google-auth data-astro-cid-anc4ye4m> <svg viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-anc4ye4m> <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" data-astro-cid-anc4ye4m></path> <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" data-astro-cid-anc4ye4m></path> <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z" data-astro-cid-anc4ye4m></path> <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38Z" data-astro-cid-anc4ye4m></path> </svg> <span data-astro-cid-anc4ye4m>Continue with Google</span> </button> <div class="extension-auth-divider" role="separator" data-astro-cid-anc4ye4m> <span data-astro-cid-anc4ye4m>or use email</span> </div> <div class="extension-auth-switch" role="tablist" aria-label="Account action" data-astro-cid-anc4ye4m> <button class="is-active" type="button" data-auth-mode="login" aria-pressed="true" data-astro-cid-anc4ye4m>Log in</button> <button type="button" data-auth-mode="register" aria-pressed="false" data-astro-cid-anc4ye4m>Register</button> </div> <form class="extension-auth-form" data-auth-form data-astro-cid-anc4ye4m> <div class="extension-auth-field" data-astro-cid-anc4ye4m> <label for="extension-email" data-astro-cid-anc4ye4m>Email</label> <input id="extension-email" type="email" autocomplete="email" placeholder="you@gmail.com" required data-astro-cid-anc4ye4m> </div> <div class="extension-auth-field" data-astro-cid-anc4ye4m> <label for="extension-password" data-astro-cid-anc4ye4m>Password</label> <input id="extension-password" type="password" autocomplete="current-password" minlength="6" placeholder="6 characters minimum" required data-astro-cid-anc4ye4m> </div> <button class="btn btn-primary extension-auth-submit" type="submit" data-auth-submit data-astro-cid-anc4ye4m>
Log in
</button> <button class="extension-forgot-button" type="button" data-forgot-password data-astro-cid-anc4ye4m>
Forgot password?
</button> </form> <p class="extension-auth-message" data-auth-message aria-live="polite" data-astro-cid-anc4ye4m>
Log in or register with email and password. Verification is required before generating a code.
</p> </div> </section> </main> ${renderComponent($$result, "AmplitudeAnalytics", $$AmplitudeAnalytics, { "data-astro-cid-anc4ye4m": true })} ${renderComponent($$result, "Analytics", $$Index, { "data-astro-cid-anc4ye4m": true })}  ${renderScript($$result, "/Users/nursultansarsenbay/dev/polish/src/pages/extension/authorize.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/Users/nursultansarsenbay/dev/polish/src/pages/extension/authorize.astro", void 0);

const $$file = "/Users/nursultansarsenbay/dev/polish/src/pages/extension/authorize.astro";
const $$url = "/extension/authorize";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Authorize,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
