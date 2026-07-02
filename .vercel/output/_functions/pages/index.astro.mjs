import { e as createComponent, m as maybeRenderHead, l as renderComponent, n as renderScript, r as renderTemplate, h as createAstro, g as addAttribute, u as unescapeHTML, k as renderHead } from '../chunks/astro/server_BvoF-d3F.mjs';
import 'piccolore';
/* empty css                                     */
import { a as $$Index$1, $ as $$AmplitudeAnalytics } from '../chunks/AmplitudeAnalytics_CPxam5Nc.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import 'clsx';
/* empty css                                 */
import { $ as $$FAQAccordion } from '../chunks/FAQAccordion_CBbY1Zm1.mjs';
import { $ as $$Footer } from '../chunks/Footer_Dd9SNgrx.mjs';
export { renderers } from '../renderers.mjs';

const PillNav = ({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className = "",
  ease = "power3.easeOut",
  baseColor = "#111111",
  pillColor = "#111111",
  hoveredPillTextColor = "#FAF7F3",
  pillTextColor,
  homeHref = "/#product",
  onMobileMenuClick,
  initialLoadAnimation = true
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const gsapRef = useRef(null);
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);
  useEffect(() => {
    let cleanup;
    let cancelled = false;
    void (async () => {
      const gsapModule = await import('gsap');
      if (cancelled) return;
      const gsap = gsapModule.gsap ?? gsapModule.default;
      gsapRef.current = gsap;
      const layout = () => {
        circleRefs.current.forEach((circle) => {
          if (!circle?.parentElement) return;
          const pill = circle.parentElement;
          const rect = pill.getBoundingClientRect();
          const { width: w, height: h } = rect;
          const radius = (w * w / 4 + h * h) / (2 * h);
          const diameter = Math.ceil(2 * radius) + 2;
          const delta = Math.ceil(radius - Math.sqrt(Math.max(0, radius * radius - w * w / 4))) + 1;
          const originY = diameter - delta;
          circle.style.width = `${diameter}px`;
          circle.style.height = `${diameter}px`;
          circle.style.bottom = `-${delta}px`;
          gsap.set(circle, {
            xPercent: -50,
            scale: 0,
            transformOrigin: `50% ${originY}px`
          });
          const label = pill.querySelector(".pill-nav-label");
          const hoverLabel = pill.querySelector(".pill-nav-label-hover");
          const index = circleRefs.current.indexOf(circle);
          if (label) gsap.set(label, { y: 0 });
          if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });
          if (index === -1) return;
          tlRefs.current[index]?.kill();
          const tl = gsap.timeline({ paused: true });
          tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" }, 0);
          if (label) {
            tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: "auto" }, 0);
          }
          if (hoverLabel) {
            gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 });
            tl.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" }, 0);
          }
          tlRefs.current[index] = tl;
        });
      };
      layout();
      const onResize = () => layout();
      window.addEventListener("resize", onResize);
      document.fonts?.ready.then(layout).catch(() => {
      });
      if (mobileMenuRef.current) {
        gsap.set(mobileMenuRef.current, { visibility: "hidden", opacity: 0, y: 10 });
      }
      if (initialLoadAnimation) {
        if (logoRef.current) {
          gsap.set(logoRef.current, { scale: 0 });
          gsap.to(logoRef.current, { scale: 1, duration: 0.6, ease });
        }
        if (navItemsRef.current) {
          gsap.set(navItemsRef.current, { width: 0, overflow: "hidden" });
          gsap.to(navItemsRef.current, {
            width: "auto",
            duration: 0.6,
            ease,
            onComplete: () => {
              if (!navItemsRef.current) return;
              navItemsRef.current.style.width = "";
              navItemsRef.current.style.overflow = "";
            }
          });
        }
      }
      cleanup = () => {
        window.removeEventListener("resize", onResize);
        tlRefs.current.forEach((tl) => tl?.kill());
        activeTweenRefs.current.forEach((tween) => tween?.kill());
        logoTweenRef.current?.kill();
      };
    })().catch((error) => {
      console.error("[PillNav] Failed to load GSAP:", error);
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [items, ease, initialLoadAnimation]);
  const handleEnter = (index) => {
    const tl = tlRefs.current[index];
    if (!tl) return;
    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto"
    });
  };
  const handleLeave = (index) => {
    const tl = tlRefs.current[index];
    if (!tl) return;
    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto"
    });
  };
  const handleLogoEnter = () => {
    if (!logoImgRef.current) return;
    const gsap = gsapRef.current;
    if (!gsap) return;
    logoTweenRef.current?.kill();
    gsap.set(logoImgRef.current, { rotate: 0 });
    logoTweenRef.current = gsap.to(logoImgRef.current, {
      rotate: 360,
      duration: 0.28,
      ease,
      overwrite: "auto"
    });
  };
  const animateMobileMenu = (open) => {
    const gsap = gsapRef.current;
    if (!gsap) return;
    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;
    if (hamburger) {
      const lines = hamburger.querySelectorAll(".pill-nav-hamburger-line");
      gsap.to(lines[0], { rotation: open ? 45 : 0, y: open ? 3 : 0, duration: 0.3, ease });
      gsap.to(lines[1], { rotation: open ? -45 : 0, y: open ? -3 : 0, duration: 0.3, ease });
    }
    if (!menu) return;
    if (open) {
      gsap.set(menu, { visibility: "visible" });
      gsap.to(menu, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease,
        overwrite: "auto"
      });
    } else {
      gsap.to(menu, {
        opacity: 0,
        y: 10,
        duration: 0.22,
        ease,
        overwrite: "auto",
        onComplete: () => gsap.set(menu, { visibility: "hidden" })
      });
    }
  };
  const toggleMobileMenu = () => {
    const nextState = !isMobileMenuOpen;
    setIsMobileMenuOpen(nextState);
    animateMobileMenu(nextState);
    onMobileMenuClick?.();
  };
  const closeMobileMenu = () => {
    if (!isMobileMenuOpen) return;
    setIsMobileMenuOpen(false);
    animateMobileMenu(false);
  };
  const cssVars = {
    "--pill-nav-base": baseColor,
    "--pill-nav-pill": pillColor,
    "--pill-nav-hover-text": hoveredPillTextColor,
    "--pill-nav-text": resolvedPillTextColor
  };
  return /* @__PURE__ */ jsxs("div", { className: `pill-nav-shell ${className}`, style: cssVars, children: [
    /* @__PURE__ */ jsxs("nav", { className: "pill-nav", "aria-label": "Primary navigation", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          ref: logoRef,
          className: "pill-nav-logo",
          href: homeHref,
          "aria-label": "Design Humanizer home",
          onMouseEnter: handleLogoEnter,
          children: /* @__PURE__ */ jsx("img", { src: logo, alt: logoAlt, ref: logoImgRef })
        }
      ),
      /* @__PURE__ */ jsx("div", { ref: navItemsRef, className: "pill-nav-items", children: /* @__PURE__ */ jsx("ul", { role: "menubar", children: items.map((item, index) => {
        const isActive = activeHref === item.href;
        return /* @__PURE__ */ jsx("li", { role: "none", children: /* @__PURE__ */ jsxs(
          "a",
          {
            className: "pill-nav-link",
            href: item.href,
            role: "menuitem",
            "aria-label": item.ariaLabel || item.label,
            onMouseEnter: () => handleEnter(index),
            onMouseLeave: () => handleLeave(index),
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  ref: (element) => {
                    circleRefs.current[index] = element;
                  },
                  className: "pill-nav-hover-circle",
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsxs("span", { className: "pill-nav-label-stack", children: [
                /* @__PURE__ */ jsx("span", { className: "pill-nav-label", children: item.label }),
                /* @__PURE__ */ jsx("span", { className: "pill-nav-label-hover", "aria-hidden": "true", children: item.label })
              ] }),
              isActive && /* @__PURE__ */ jsx("span", { className: "pill-nav-active-dot", "aria-hidden": "true" })
            ]
          }
        ) }, item.href);
      }) }) }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          ref: hamburgerRef,
          type: "button",
          className: "pill-nav-menu-button",
          "aria-label": "Toggle navigation menu",
          "aria-expanded": isMobileMenuOpen,
          onClick: toggleMobileMenu,
          children: [
            /* @__PURE__ */ jsx("span", { className: "pill-nav-hamburger-line" }),
            /* @__PURE__ */ jsx("span", { className: "pill-nav-hamburger-line" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: mobileMenuRef,
        className: `pill-nav-mobile-menu${isMobileMenuOpen ? " is-open" : ""}`,
        children: /* @__PURE__ */ jsx("ul", { children: items.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: item.href, onClick: closeMobileMenu, "aria-label": item.ariaLabel || item.label, children: item.label }) }, item.href)) })
      }
    )
  ] });
};

const Magnet = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  wrapperClassName = "",
  innerClassName = "",
  ...props
}) => {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetRef = useRef(null);
  useEffect(() => {
    if (disabled) {
      setPosition({ x: 0, y: 0 });
      return;
    }
    const handleMouseMove = (event) => {
      if (!magnetRef.current) return;
      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distX = Math.abs(centerX - event.clientX);
      const distY = Math.abs(centerY - event.clientY);
      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setIsActive(true);
        const offsetX = (event.clientX - centerX) / magnetStrength;
        const offsetY = (event.clientY - centerY) / magnetStrength;
        setPosition({ x: offsetX, y: offsetY });
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [padding, disabled, magnetStrength]);
  const transitionStyle = isActive ? activeTransition : inactiveTransition;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: magnetRef,
      className: wrapperClassName,
      style: { position: "relative", display: "inline-block" },
      ...props,
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: innerClassName,
          style: {
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            transition: transitionStyle,
            willChange: "transform"
          },
          children
        }
      )
    }
  );
};

function RollingButtonText({ text, className }) {
  const classes = ["rolling-button-text", className].filter(Boolean).join(" ");
  const characters = Array.from(text);
  return /* @__PURE__ */ jsx("span", { className: classes, "aria-label": text, children: /* @__PURE__ */ jsx("span", { className: "rolling-button-text__chars", "aria-hidden": "true", children: characters.map((character, index) => {
    const glyph = character === " " ? " " : character;
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: "rolling-button-text__char",
        style: { "--rolling-index": index },
        children: /* @__PURE__ */ jsxs("span", { className: "rolling-button-text__track", children: [
          /* @__PURE__ */ jsx("span", { className: "rolling-button-text__line", children: glyph }),
          /* @__PURE__ */ jsx("span", { className: "rolling-button-text__line", children: glyph })
        ] })
      },
      `${character}-${index}`
    );
  }) }) });
}

const CHROME_EXTENSION_URL = "https://chromewebstore.google.com/detail/mbbhjpbbehelagdnlmppgdhheceijfmm?utm_source=item-share-cb";
function StartButton({
  className,
  size = "lg",
  variant = "text"
}) {
  const isLarge = size === "lg";
  const isIcon = variant === "icon";
  const wrapperClass = [
    "start-button-shell",
    `start-button-shell--${size}`,
    className ? `${className}-shell` : ""
  ].filter(Boolean).join(" ");
  const buttonClass = [
    "start-button",
    `start-button--${size}`,
    isIcon ? "start-button--icon" : "",
    className || ""
  ].filter(Boolean).join(" ");
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("waitlist:morph-ready"));
    window.dispatchEvent(new CustomEvent("extension:cta-ready"));
  }, []);
  return /* @__PURE__ */ jsx("span", { className: wrapperClass, children: /* @__PURE__ */ jsx(
    Magnet,
    {
      padding: isLarge ? 70 : 48,
      magnetStrength: 5,
      wrapperClassName: "start-button-magnet",
      innerClassName: "start-button-magnet-inner",
      children: /* @__PURE__ */ jsxs(
        "a",
        {
          className: buttonClass,
          href: CHROME_EXTENSION_URL,
          target: "_blank",
          rel: "noopener noreferrer",
          "data-extension-start": true,
          "data-extension-destination": "chrome_web_store",
          "data-extension-size": size,
          "data-extension-variant": variant,
          "aria-label": isIcon ? "Start with Chrome extension" : void 0,
          children: [
            /* @__PURE__ */ jsx("img", { className: "start-button-chrome-logo", src: "/logo/chrome-logo.png", alt: "", "aria-hidden": "true" }),
            !isIcon && /* @__PURE__ */ jsx(RollingButtonText, { text: isLarge ? "Start" : "Start" })
          ]
        }
      )
    }
  ) });
}

const $$Astro = createAstro();
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Header;
  const navItems = [
    { label: "How it works", href: "/#how" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Q&A", href: "/#qa" },
    { label: "FAQ", href: "/faq" }
  ];
  const activeHref = Astro2.url.pathname === "/faq" ? "/faq" : void 0;
  return renderTemplate`${maybeRenderHead()}<header class="site-header" data-header> <div class="container header-inner"> ${renderComponent($$result, "PillNav", PillNav, { "client:load": true, "logo": "/logo/icon-d.svg", "logoAlt": "Design Humanizer logo", "items": navItems, "activeHref": activeHref, "homeHref": "/#product", "baseColor": "#111111", "pillColor": "#111111", "hoveredPillTextColor": "#FAF7F3", "pillTextColor": "#FAF7F3", "className": "site-pill-nav", "client:component-hydration": "load", "client:component-path": "/Users/nursultansarsenbay/dev/polish/src/components/PillNav", "client:component-export": "default" })} ${renderComponent($$result, "StartButton", StartButton, { "client:load": true, "className": "header-start-button", "size": "sm", "client:component-hydration": "load", "client:component-path": "/Users/nursultansarsenbay/dev/polish/src/components/StartButton", "client:component-export": "default" })} </div> </header> ${renderScript($$result, "/Users/nursultansarsenbay/dev/polish/src/components/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/nursultansarsenbay/dev/polish/src/components/Header.astro", void 0);

const $$Preloader = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="site-preloader" data-preloader aria-live="polite" aria-label="Loading beuniq.design"> <div class="preloader-lockup" aria-hidden="true"> <img class="preloader-logo" src="/logo/icon-d.svg" alt="" width="56" height="56"> <div class="preloader-wordmark"> <span class="preloader-bracket preloader-bracket--left">[</span> <span class="preloader-name">beuniq.design</span> <span class="preloader-bracket preloader-bracket--right">]</span> </div> </div> <div class="preloader-progress" aria-hidden="true"> <span class="preloader-progress-fill" data-preloader-bar></span> <span class="preloader-progress-count" data-preloader-count>1%</span> </div> </div> ${renderScript($$result, "/Users/nursultansarsenbay/dev/polish/src/components/Preloader.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/nursultansarsenbay/dev/polish/src/components/Preloader.astro", void 0);

const $$Hero = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section id="product" class="hero-mvp-scroll"> <div class="hero-sticky"> <div class="hero-bg hero-skiper-bg" aria-hidden="true"> ${renderComponent($$result, "CrowdCanvasWrapper", null, { "client:only": "react", "rows": 15, "cols": 7, "client:component-hydration": "only", "client:component-path": "/Users/nursultansarsenbay/dev/polish/src/components/CrowdCanvasWrapper", "client:component-export": "default" })} </div> <div class="hero-overlay" aria-hidden="true"></div> <!--
      Single walking peep. Horizontal movement is JS-driven (below) so it can
      fully STOP at 25% and 75% of its path, swap to wink_peep for 2s, then
      resume. The up/down walking bounce stays CSS on .hero-peeps-walker.
    --> <div class="hero-peeps-y" aria-hidden="true"> <div class="hero-peeps-runner"> <div class="hero-peeps-walker"> <img class="hero-peep-sprite" src="/images/peeps/peeps.png" alt="" loading="eager" decoding="async" fetchpriority="high"> </div> </div> </div> <div class="hero-content"> <h1 class="hero-title"> <span class="hero-title-word">Fix your UI</span> </h1> <p class="hero-subtitle">
Design Humanizer helps turn generic AI-generated interfaces into cleaner,
        more intentional product screens.
</p> <div class="hero-actions"> ${renderComponent($$result, "StartButton", StartButton, { "client:load": true, "size": "lg", "client:component-hydration": "load", "client:component-path": "/Users/nursultansarsenbay/dev/polish/src/components/StartButton", "client:component-export": "default" })} </div> </div> </div> </section> ${renderScript($$result, "/Users/nursultansarsenbay/dev/polish/src/components/Hero.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/nursultansarsenbay/dev/polish/src/components/Hero.astro", void 0);

const $$HowItWorks = createComponent(($$result, $$props, $$slots) => {
  const steps = [
    {
      title: "Create screenshot",
      detail: "Design Humanizer captures the page, parses its HTML and CSS, and scans the visible structure of your interface.",
      bullets: ["sections and cards", "buttons and CTAs", "spacing and repeated patterns"],
      icon: "scan"
    },
    {
      title: "Find what feels generic",
      detail: "It detects the patterns that make AI-generated UI feel unfinished.",
      bullets: ["weak hierarchy", "repeated cards", "unclear visual focus"],
      icon: "find"
    },
    {
      title: "Suggest improvements",
      detail: "It gives practical design recommendations without changing your content.",
      bullets: ["stronger grouping", "better rhythm", "clearer CTA priority"],
      icon: "suggest"
    },
    {
      title: "Preview the result",
      detail: "You compare the same content with a cleaner, more intentional structure.",
      bullets: ["before and after view", "improved composition", "ready-to-apply direction"],
      icon: "preview"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="how" class="how-it-works-section"${addAttribute(`--how-pin-height: ${steps.length + 1}00vh;`, "style")} data-how-section data-astro-cid-kojs5727> <div class="how-inner" data-astro-cid-kojs5727> <div class="how-layout" data-astro-cid-kojs5727> <div class="how-copy" data-astro-cid-kojs5727> <div class="how-head" data-astro-cid-kojs5727> <h2 class="how-title" data-astro-cid-kojs5727>How it works</h2> </div> <div class="how-cards" aria-label="How Design Humanizer works" data-astro-cid-kojs5727> ${steps.map((step) => renderTemplate`<article class="how-card" data-how-card data-astro-cid-kojs5727> <span class="how-card-ico" aria-hidden="true" data-astro-cid-kojs5727> ${step.icon === "scan" && renderTemplate`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" data-astro-cid-kojs5727> <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" data-astro-cid-kojs5727></path> <path d="M3 12h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" data-astro-cid-kojs5727></path> </svg>`} ${step.icon === "find" && renderTemplate`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" data-astro-cid-kojs5727> <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8" data-astro-cid-kojs5727></circle> <path d="m20 20-3.2-3.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" data-astro-cid-kojs5727></path> </svg>`} ${step.icon === "suggest" && renderTemplate`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" data-astro-cid-kojs5727> <path d="M9 18h6M10 21h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" data-astro-cid-kojs5727></path> <path d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.9 1 1 1.7l.1.5h5l.1-.5c.1-.7.5-1.3 1-1.7A6 6 0 0 0 12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" data-astro-cid-kojs5727></path> </svg>`} ${step.icon === "preview" && renderTemplate`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" data-astro-cid-kojs5727> <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" stroke-width="1.8" data-astro-cid-kojs5727></rect> <path d="M12 4v16" stroke="currentColor" stroke-width="1.8" stroke-dasharray="2 2.4" data-astro-cid-kojs5727></path> </svg>`} </span> <div class="how-card-copy" data-astro-cid-kojs5727> <h3 class="how-card-title" data-astro-cid-kojs5727>${step.title}</h3> <div class="how-card-details" data-astro-cid-kojs5727> <p class="how-card-detail" data-astro-cid-kojs5727>${step.detail}</p> <ul class="how-card-bullets" data-astro-cid-kojs5727> ${step.bullets.map((b) => renderTemplate`<li data-astro-cid-kojs5727>${b}</li>`)} </ul> </div> </div> </article>`)} </div> </div> <div class="how-demo-stack" data-astro-cid-kojs5727> <figure class="how-demo" aria-label="Design Humanizer demo video" data-astro-cid-kojs5727> <video class="how-demo-video" src="/demo/demoview.mp4" autoplay muted loop playsinline controls preload="metadata" data-astro-cid-kojs5727></video> </figure> <div class="how-extension-action" data-astro-cid-kojs5727> ${renderComponent($$result, "StartButton", StartButton, { "client:visible": true, "size": "lg", "client:component-hydration": "visible", "client:component-path": "/Users/nursultansarsenbay/dev/polish/src/components/StartButton", "client:component-export": "default", "data-astro-cid-kojs5727": true })} </div> </div> </div> </div> </section> ${renderScript($$result, "/Users/nursultansarsenbay/dev/polish/src/components/sections/HowItWorks.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/nursultansarsenbay/dev/polish/src/components/sections/HowItWorks.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$PricingSection = createComponent(($$result, $$props, $$slots) => {
  const creditPricing = {
    minCredits: 3,
    maxCredits: 200,
    minAmount: 100,
    maxAmount: 6500,
    defaultCredits: 3
  };
  const amountForCredits = (credits) => {
    const progress = (credits - creditPricing.minCredits) / (creditPricing.maxCredits - creditPricing.minCredits);
    return Math.round(creditPricing.minAmount + progress * (creditPricing.maxAmount - creditPricing.minAmount));
  };
  const formatAmount = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 100 === 0 ? 0 : 2
  }).format(amount / 100);
  const defaultAmount = amountForCredits(creditPricing.defaultCredits);
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<section id="pricing" class="lp-section pricing-section" aria-labelledby="pricing-title"> <div class="pricing-shell"> <div class="pricing-flow" data-pricing-flow', '> <script type="application/json" data-pricing-data>', '<\/script> <div class="pricing-flow-view is-active" data-flow-view="plans"> <div class="pricing-flow-main"> <div class="pricing-main-copy"> <h2 id="pricing-title">Buy screenshots</h2> </div> <div class="pricing-choice-stack"> <div class="pricing-credit-control"> <div class="pricing-credit-head"> <span>Screenshots selected</span> <strong><span data-credit-count', ">", '</span></strong> </div> <div class="pricing-free-plan" aria-label="Free plan allowance"> <span>Free plan</span> <strong>3 screenshots included</strong> <p>Start reviewing your UI before buying more screenshots.</p> </div> <div class="pricing-credit-inputs" aria-label="Custom screenshot purchase"> <label class="pricing-credit-input"> <span>Screenshots</span> <input type="number"', "", ' step="1" inputmode="numeric"', ' data-credit-input> </label> <label class="pricing-credit-input"> <span>Budget</span> <div class="pricing-money-input"> <span aria-hidden="true">$</span> <input type="number"', "", ' step="0.01" inputmode="decimal"', ' data-amount-input> </div> </label> </div> <div class="pricing-credit-slider-shell"> <input class="pricing-credit-range" type="range"', "", ' step="1"', ' aria-label="Screenshot amount" data-credit-slider> <div class="pricing-credit-slider-track" aria-hidden="true"> <span data-credit-progress></span> </div> <div class="pricing-credit-balance" aria-hidden="true" data-credit-balance> <span data-credit-balance-value>', '</span> </div> </div> <div class="pricing-credit-bounds"> <span>', " screenshots for ", "</span> <span>", " screenshots for ", '</span> </div> </div> <div class="pricing-summary-card" aria-live="polite"> <div class="pricing-summary-copy"> <span>Total today</span> <span>one-time purchase</span> </div> <div class="pricing-summary-count"> <strong data-credit-price>', "</strong> <span data-credit-rate> ", ' per screenshot\n</span> </div> </div> <button class="btn btn-primary pricing-buy-button" type="button" data-buy-now> <span data-buy-credits-label> ', " </span> <small data-buy-price-label>", " today</small> </button> </div> </div> </div> </div> </div> </section> ", ""])), maybeRenderHead(), addAttribute(creditPricing.defaultCredits, "data-selected-credits"), unescapeHTML(JSON.stringify({ creditPricing })), addAttribute(creditPricing.defaultCredits, "data-current-value"), creditPricing.defaultCredits, addAttribute(creditPricing.minCredits, "min"), addAttribute(creditPricing.maxCredits, "max"), addAttribute(creditPricing.defaultCredits, "value"), addAttribute((creditPricing.minAmount / 100).toFixed(2), "min"), addAttribute((creditPricing.maxAmount / 100).toFixed(2), "max"), addAttribute((defaultAmount / 100).toFixed(2), "value"), addAttribute(creditPricing.minCredits, "min"), addAttribute(creditPricing.maxCredits, "max"), addAttribute(creditPricing.defaultCredits, "value"), creditPricing.defaultCredits, creditPricing.minCredits, formatAmount(creditPricing.minAmount), creditPricing.maxCredits, formatAmount(creditPricing.maxAmount), formatAmount(defaultAmount), (defaultAmount / creditPricing.defaultCredits / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }), renderComponent($$result, "RollingButtonText", RollingButtonText, { "text": `Buy ${creditPricing.defaultCredits} screenshots` }), formatAmount(defaultAmount), renderScript($$result, "/Users/nursultansarsenbay/dev/polish/src/components/sections/PricingSection.astro?astro&type=script&index=0&lang.ts"));
}, "/Users/nursultansarsenbay/dev/polish/src/components/sections/PricingSection.astro", void 0);

const $$QASection = createComponent(($$result, $$props, $$slots) => {
  const qa = [
    {
      q: "What does Design Humanizer actually do?",
      a: "It analyzes an AI-generated interface and shows what feels generic: weak hierarchy, repeated cards, unclear focus, poor spacing, and low visual priority. Then it suggests how to make the same content feel more intentional."
    },
    {
      q: "Does it change my content?",
      a: "No. Design Humanizer is focused on presentation, not rewriting your product. It helps improve structure, layout, hierarchy, spacing, and visual rhythm while keeping your original content."
    },
    {
      q: "Who is it for?",
      a: "It is built for developers, indie hackers, no-code builders, students, and startup teams who use AI to generate interfaces but do not want to ship something that looks like a default AI template."
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="qa" class="lp-section qa-preview-section"> <div class="lp-container qa-preview-shell"> <div class="qa-preview-copy"> <h2 class="qa-preview-title"> <span>Answers before</span> <span>you join</span> </h2> <div class="qa-preview-actions"> <a class="btn btn-primary" href="mailto:sarsennbaj.n@gmail.com">${renderComponent($$result, "RollingButtonText", RollingButtonText, { "text": "Ask a question" })}</a> <a class="qa-preview-link" href="/faq">${renderComponent($$result, "RollingButtonText", RollingButtonText, { "text": "Open full FAQ" })}</a> </div> </div> <div class="qa-preview-list"> ${renderComponent($$result, "FAQAccordion", $$FAQAccordion, { "items": qa, "className": "faq-accordion--preview", "startOpenIndex": 0, "featuredIndex": 0 })} </div> </div> </section>`;
}, "/Users/nursultansarsenbay/dev/polish/src/components/sections/QASection.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const siteUrl = "https://www.beuniq.design";
  const pageTitle = "BeUniq Design | Humanize AI-Generated UI Design";
  const pageDescription = "Humanize AI-generated UI with Design Humanizer. Analyze screenshots, detect generic layouts, and improve visual hierarchy, spacing, and product design quality.";
  const pageKeywords = [
    "humanize design UI",
    "humanize UI",
    "AI UI design",
    "AI-generated UI",
    "design humanizer",
    "UI design feedback",
    "screenshot UI analysis",
    "Chrome extension for UI design",
    "improve AI design",
    "product design review"
  ];
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Design Humanizer",
    alternateName: "BeUniq Design",
    applicationCategory: "DesignApplication",
    operatingSystem: "Chrome",
    url: siteUrl,
    description: pageDescription,
    offers: [
      {
        "@type": "Offer",
        name: "Minimal",
        price: "10",
        priceCurrency: "USD",
        availability: "https://schema.org/PreOrder"
      },
      {
        "@type": "Offer",
        name: "Popular",
        price: "25",
        priceCurrency: "USD",
        availability: "https://schema.org/PreOrder"
      },
      {
        "@type": "Offer",
        name: "Maximum",
        price: "40",
        priceCurrency: "USD",
        availability: "https://schema.org/PreOrder"
      }
    ]
  };
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BeUniq Design",
    url: siteUrl,
    description: pageDescription
  };
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>', '</title><meta name="description"', '><meta name="keywords"', '><meta name="author" content="BeUniq Design"><meta name="robots" content="index, follow"><link rel="canonical"', '><meta property="og:type" content="website"><meta property="og:site_name" content="BeUniq Design"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:url"', '><meta name="twitter:card" content="summary"><meta name="twitter:title"', '><meta name="twitter:description"', '><link rel="icon" type="image/svg+xml" href="/logo/icon-d.svg"><link rel="apple-touch-icon" href="/logo/app-icon.svg"><link rel="preload" as="image" href="/logo/icon-d.svg"><link rel="preload" as="image" href="/images/peeps/all-peeps.png"><link rel="preload" as="image" href="/images/peeps/peeps.png"><link rel="preload" as="image" href="/images/peeps/wink_peep.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Inter+Tight:wght@400;500;600;700;800&display=swap" rel="stylesheet"><script type="application/ld+json">', '<\/script><script type="application/ld+json">', "<\/script>", "</head> <body> ", " ", " <main> ", " ", " ", " ", " </main> ", " ", " ", " </body></html>"])), pageTitle, addAttribute(pageDescription, "content"), addAttribute(pageKeywords.join(", "), "content"), addAttribute(siteUrl, "href"), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), addAttribute(siteUrl, "content"), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), unescapeHTML(JSON.stringify(softwareSchema)), unescapeHTML(JSON.stringify(websiteSchema)), renderHead(), renderComponent($$result, "Preloader", $$Preloader, {}), renderComponent($$result, "Header", $$Header, {}), renderComponent($$result, "Hero", $$Hero, {}), renderComponent($$result, "HowItWorks", $$HowItWorks, {}), renderComponent($$result, "PricingSection", $$PricingSection, {}), renderComponent($$result, "QASection", $$QASection, {}), renderComponent($$result, "Footer", $$Footer, {}), renderComponent($$result, "AmplitudeAnalytics", $$AmplitudeAnalytics, {}), renderComponent($$result, "Analytics", $$Index$1, {}));
}, "/Users/nursultansarsenbay/dev/polish/src/pages/index.astro", void 0);

const $$file = "/Users/nursultansarsenbay/dev/polish/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
