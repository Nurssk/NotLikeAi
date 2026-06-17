import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  homeHref?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className = "",
  ease = "power3.easeOut",
  baseColor = "#101112",
  pillColor = "#ffffff",
  hoveredPillTextColor = "#101112",
  pillTextColor,
  homeHref = "/#product",
  onMobileMenuClick,
  initialLoadAnimation = true,
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const radius = ((w * w) / 4 + h * h) / (2 * h);
        const diameter = Math.ceil(2 * radius) + 2;
        const delta =
          Math.ceil(radius - Math.sqrt(Math.max(0, radius * radius - (w * w) / 4))) + 1;
        const originY = diameter - delta;

        circle.style.width = `${diameter}px`;
        circle.style.height = `${diameter}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector<HTMLElement>(".pill-nav-label");
        const hoverLabel = pill.querySelector<HTMLElement>(".pill-nav-label-hover");
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
    document.fonts?.ready.then(layout).catch(() => {});

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
          },
        });
      }
    }

    return () => {
      window.removeEventListener("resize", onResize);
      tlRefs.current.forEach((tl) => tl?.kill());
      activeTweenRefs.current.forEach((tween) => tween?.kill());
      logoTweenRef.current?.kill();
    };
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (index: number) => {
    const tl = tlRefs.current[index];
    if (!tl) return;

    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = (index: number) => {
    const tl = tlRefs.current[index];
    if (!tl) return;

    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const handleLogoEnter = () => {
    if (!logoImgRef.current) return;

    logoTweenRef.current?.kill();
    gsap.set(logoImgRef.current, { rotate: 0 });
    logoTweenRef.current = gsap.to(logoImgRef.current, {
      rotate: 360,
      duration: 0.28,
      ease,
      overwrite: "auto",
    });
  };

  const animateMobileMenu = (open: boolean) => {
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
        overwrite: "auto",
      });
    } else {
      gsap.to(menu, {
        opacity: 0,
        y: 10,
        duration: 0.22,
        ease,
        overwrite: "auto",
        onComplete: () => gsap.set(menu, { visibility: "hidden" }),
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

  const cssVars: CSSVars = {
    "--pill-nav-base": baseColor,
    "--pill-nav-pill": pillColor,
    "--pill-nav-hover-text": hoveredPillTextColor,
    "--pill-nav-text": resolvedPillTextColor,
  };

  return (
    <div className={`pill-nav-shell ${className}`} style={cssVars}>
      <nav className="pill-nav" aria-label="Primary navigation">
        <a
          ref={logoRef}
          className="pill-nav-logo"
          href={homeHref}
          aria-label="Design Humanizer home"
          onMouseEnter={handleLogoEnter}
        >
          <img src={logo} alt={logoAlt} ref={logoImgRef} />
        </a>

        <div ref={navItemsRef} className="pill-nav-items">
          <ul role="menubar">
            {items.map((item, index) => {
              const isActive = activeHref === item.href;

              return (
                <li key={item.href} role="none">
                  <a
                    className="pill-nav-link"
                    href={item.href}
                    role="menuitem"
                    aria-label={item.ariaLabel || item.label}
                    onMouseEnter={() => handleEnter(index)}
                    onMouseLeave={() => handleLeave(index)}
                  >
                    <span
                      ref={(element) => {
                        circleRefs.current[index] = element;
                      }}
                      className="pill-nav-hover-circle"
                      aria-hidden="true"
                    />
                    <span className="pill-nav-label-stack">
                      <span className="pill-nav-label">{item.label}</span>
                      <span className="pill-nav-label-hover" aria-hidden="true">
                        {item.label}
                      </span>
                    </span>
                    {isActive && <span className="pill-nav-active-dot" aria-hidden="true" />}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          ref={hamburgerRef}
          type="button"
          className="pill-nav-menu-button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={toggleMobileMenu}
        >
          <span className="pill-nav-hamburger-line" />
          <span className="pill-nav-hamburger-line" />
        </button>
      </nav>

      <div
        ref={mobileMenuRef}
        className={`pill-nav-mobile-menu${isMobileMenuOpen ? " is-open" : ""}`}
      >
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={closeMobileMenu} aria-label={item.ariaLabel || item.label}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
