import html from "../../assets/majd-owned-original.html?raw";

const headerStyles = String.raw`<style id="owned-majd-header-style">
  .owned-majd-menu,
  .owned-majd-menu * {
    box-sizing: border-box;
  }

  html,
  body {
    width: 100vw !important;
    min-width: 100vw !important;
    max-width: none !important;
    margin: 0 !important;
    overflow-x: hidden !important;
    background: rgb(250, 247, 243) !important;
  }

  :root {
    --owned-majd-source-height: 9071.04px;
  }

  body {
    height: calc(var(--owned-majd-source-height, 9071.04px) * var(--owned-majd-scale, 1)) !important;
    min-height: calc(var(--owned-majd-source-height, 9071.04px) * var(--owned-majd-scale, 1)) !important;
  }

  #main {
    width: 1279px !important;
    height: var(--owned-majd-source-height, 9071.04px) !important;
    max-width: none !important;
    transform: scale(var(--owned-majd-scale, 1)) !important;
    transform-origin: top left !important;
  }

  #main > [data-layout-template="true"] {
    height: var(--owned-majd-source-height, 9071.04px) !important;
    min-height: var(--owned-majd-source-height, 9071.04px) !important;
  }

  nav[data-framer-name="Closed"],
  [data-framer-name="Navigation Bar"] {
    display: none !important;
  }

  .owned-majd-hidden {
    display: none !important;
  }

  .owned-majd-hero-title {
    transform: translateY(474px) !important;
  }

  .owned-majd-hero-star {
    transform: translate(22px, 484px) !important;
    transform-origin: center !important;
  }

  .owned-majd-hero-bolt {
    transform: translate(-42px, 520px) !important;
    transform-origin: center !important;
  }

  .owned-majd-chrome-cta,
  .owned-majd-secondary-cta {
    position: fixed !important;
    top: auto !important;
    left: auto !important;
    right: 26px !important;
    width: 300px !important;
    height: 72px !important;
    min-width: 300px !important;
    min-height: 72px !important;
    padding: 0 28px !important;
    border-radius: 13px !important;
    gap: 8px !important;
    z-index: 1000000 !important;
    color: rgb(250, 247, 243) !important;
    text-decoration: none !important;
    transform: none !important;
  }

  .owned-majd-chrome-cta {
    bottom: 112px !important;
  }

  .owned-majd-secondary-cta {
    bottom: 28px !important;
  }

  .owned-majd-chrome-logo {
    display: block !important;
    width: 40px !important;
    height: 40px !important;
    flex: 0 0 40px !important;
    object-fit: contain !important;
    transform-origin: 50% 50% !important;
    will-change: transform;
  }

  .owned-majd-chrome-cta:hover .owned-majd-chrome-logo,
  .owned-majd-chrome-cta:focus-visible .owned-majd-chrome-logo {
    animation: owned-majd-chrome-spin 860ms linear infinite;
  }

  @keyframes owned-majd-chrome-spin {
    to {
      transform: rotate(360deg);
    }
  }

  .owned-majd-cta-label {
    display: inline-flex !important;
    align-items: center !important;
    color: rgb(250, 247, 243) !important;
    font-family: Archivo, "Archivo Placeholder", sans-serif !important;
    font-size: 31px !important;
    font-weight: 500 !important;
    line-height: 37px !important;
    white-space: nowrap !important;
  }

  .rolling-button-text {
    display: inline-flex;
    height: 1em;
    overflow: hidden;
    line-height: 1;
    vertical-align: -0.08em;
    white-space: nowrap;
  }

  .rolling-button-text__chars {
    display: inline-flex;
    height: 1em;
    line-height: 1;
  }

  .rolling-button-text__char {
    display: inline-block;
    height: 1em;
    overflow: hidden;
    line-height: 1;
  }

  .rolling-button-text__track {
    display: flex;
    flex-direction: column;
    transform: translateY(0);
    transition: transform 740ms cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: calc(var(--rolling-index, 0) * 44ms);
    will-change: transform;
  }

  .rolling-button-text__line {
    display: block;
    height: 1em;
    line-height: 1;
  }

  .owned-majd-copyright {
    position: absolute;
    left: 35px;
    bottom: 252px;
    z-index: 20;
    color: rgb(17, 17, 17);
    font-family: "Archivo", "Archivo Placeholder", sans-serif;
    font-size: 62px;
    font-weight: 800;
    line-height: 0.9;
    letter-spacing: -2px;
    pointer-events: none;
    transform: translateY(600px);
    white-space: nowrap;
  }

  .owned-majd-menu__item:hover .rolling-button-text__track,
  .owned-majd-menu__item:focus-visible .rolling-button-text__track,
  .owned-majd-chrome-cta:hover .rolling-button-text__track,
  .owned-majd-chrome-cta:focus-visible .rolling-button-text__track,
  .owned-majd-secondary-cta:hover .rolling-button-text__track,
  .owned-majd-secondary-cta:focus-visible .rolling-button-text__track {
    transform: translateY(-50%);
  }

  .owned-majd-menu {
    --menu-black: #0e0e0e;
    --menu-white: #fbf7ef;
    --menu-ease: cubic-bezier(0.19, 1, 0.22, 1);
    position: fixed;
    top: 34px;
    left: 50%;
    z-index: 2147483647;
    width: 320px;
    color: var(--menu-white);
    font-family: "Archivo", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    transform: translateX(-50%);
    pointer-events: none;
  }

  .owned-majd-menu__panel {
    width: 100%;
    height: 252px;
    padding: 8px 8px 8px 24px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    background: var(--menu-black);
    box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
    overflow: hidden;
    pointer-events: auto;
    transform: translateZ(0);
    will-change: height, border-radius;
    transition:
      height 1100ms var(--menu-ease),
      border-radius 1100ms var(--menu-ease),
      box-shadow 1100ms var(--menu-ease);
  }

  .owned-majd-menu__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    min-height: 44px;
  }

  .owned-majd-menu__brand {
    display: inline-flex;
    align-items: center;
    color: var(--menu-white);
    font-size: 22px;
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    white-space: nowrap;
    transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .owned-majd-menu__button {
    position: relative;
    display: block;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    place-items: center;
    border: 0;
    border-radius: 9px;
    background: var(--menu-white);
    color: var(--menu-black);
    cursor: pointer;
    font: inherit;
    line-height: 1;
    transition:
      transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 240ms ease,
      border-radius 360ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .owned-majd-menu__button:hover {
    transform: none;
  }

  .owned-majd-menu__button:focus-visible,
  .owned-majd-menu__item:focus-visible,
  .owned-majd-menu__brand:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 3px;
  }

  .owned-majd-menu__dot {
    position: absolute;
    top: 50%;
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: var(--menu-black);
    transform-origin: center;
    transform: translateY(-50%);
    transition:
      left 760ms cubic-bezier(0.16, 1, 0.3, 1),
      top 760ms cubic-bezier(0.16, 1, 0.3, 1),
      width 760ms cubic-bezier(0.16, 1, 0.3, 1),
      height 760ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 460ms ease,
      transform 760ms cubic-bezier(0.16, 1, 0.3, 1),
      border-radius 760ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .owned-majd-menu__dot:nth-child(1) {
    left: 13px;
  }

  .owned-majd-menu__dot:nth-child(2) {
    left: 20px;
  }

  .owned-majd-menu__dot:nth-child(3) {
    left: 27px;
  }

  .owned-majd-menu.is-open .owned-majd-menu__dot:nth-child(1),
  .owned-majd-menu.is-open .owned-majd-menu__dot:nth-child(3) {
    top: 50%;
    width: 14px;
    height: 3px;
    border-radius: 3px;
  }

  .owned-majd-menu.is-open .owned-majd-menu__dot:nth-child(1) {
    left: 15px;
    transform: translateY(-50%) rotate(45deg);
  }

  .owned-majd-menu.is-open .owned-majd-menu__dot:nth-child(2) {
    top: 58%;
    left: 20px;
    opacity: 0;
    transform: translateY(10px) scale(0.18);
  }

  .owned-majd-menu.is-open .owned-majd-menu__dot:nth-child(3) {
    left: 15px;
    transform: translateY(-50%) rotate(-45deg);
  }

  .owned-majd-menu__items {
    display: grid;
    justify-items: start;
    gap: 9px;
    max-height: 170px;
    margin-top: 20px;
    opacity: 1;
    overflow: visible;
    transform: translateY(0);
    will-change: opacity, transform, max-height;
    transition:
      max-height 1020ms var(--menu-ease),
      margin-top 1020ms var(--menu-ease),
      opacity 520ms ease 280ms,
      transform 900ms var(--menu-ease) 170ms;
  }

  .owned-majd-menu__item {
    position: relative;
    isolation: isolate;
    display: inline-flex;
    align-items: center;
    min-height: 34px;
    padding: 0 16px;
    border-radius: 8px;
    background: var(--menu-white);
    color: var(--menu-black);
    font-size: 15px;
    font-weight: 600;
    line-height: 1;
    text-decoration: none;
    white-space: nowrap;
    opacity: 1;
    transform: translateX(0);
    overflow: visible;
    will-change: opacity, transform;
    transition:
      opacity 620ms ease,
      transform 920ms var(--menu-ease),
      background-color 160ms ease;
  }

  .owned-majd-menu__item::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: 8px;
    background: #ffffff;
    opacity: 0;
    transform: scale(0.82);
    transition:
      opacity 300ms ease,
      transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .owned-majd-menu__item.is-gooey-active::after {
    animation: owned-majd-gooey-pill 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
    opacity: 1;
    transform: scale(1);
  }

  @keyframes owned-majd-gooey-pill {
    0% {
      opacity: 0;
      transform: scale(0.78);
    }
    42% {
      opacity: 1;
      transform: scale(1.12, 0.88);
    }
    72% {
      transform: scale(0.96, 1.05);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .owned-majd-gooey-particle,
  .owned-majd-gooey-point {
    display: block;
    border-radius: 999px;
    pointer-events: none;
    transform-origin: center;
  }

  .owned-majd-gooey-particle {
    position: absolute;
    top: calc(50% - 8px);
    left: calc(50% - 8px);
    z-index: 2;
    width: 13px;
    height: 13px;
    filter: blur(0.5px) contrast(1.35);
    animation: owned-majd-particle var(--gooey-time, 900ms) ease-out forwards;
  }

  .owned-majd-gooey-point {
    width: 13px;
    height: 13px;
    background: var(--gooey-color, #ffffff);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.28);
    animation: owned-majd-point var(--gooey-time, 900ms) ease-out forwards;
  }

  @keyframes owned-majd-particle {
    0% {
      opacity: 1;
      transform: rotate(0deg) translate(var(--start-x), var(--start-y));
      animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
    }
    70% {
      opacity: 1;
      transform: rotate(calc(var(--gooey-rotate) * 0.55)) translate(calc(var(--end-x) * 1.14), calc(var(--end-y) * 1.14));
      animation-timing-function: ease;
    }
    100% {
      opacity: 0;
      transform: rotate(var(--gooey-rotate)) translate(calc(var(--end-x) * 0.44), calc(var(--end-y) * 0.44));
    }
  }

  @keyframes owned-majd-point {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    28% {
      opacity: 1;
      transform: scale(calc(var(--gooey-scale) * 0.35));
    }
    68% {
      opacity: 1;
      transform: scale(var(--gooey-scale));
    }
    100% {
      opacity: 0;
      transform: scale(0);
    }
  }

  .owned-majd-menu__item:hover {
    background: #ffffff;
    transform: translateX(3px);
  }

  .owned-majd-menu.is-open .owned-majd-menu__item:nth-child(1) {
    transition-delay: 260ms, 210ms, 0ms;
  }

  .owned-majd-menu.is-open .owned-majd-menu__item:nth-child(2) {
    transition-delay: 340ms, 270ms, 0ms;
  }

  .owned-majd-menu.is-open .owned-majd-menu__item:nth-child(3) {
    transition-delay: 420ms, 330ms, 0ms;
  }

  .owned-majd-menu.is-open .owned-majd-menu__item:nth-child(4) {
    transition-delay: 500ms, 390ms, 0ms;
  }

  .owned-majd-menu:not(.is-open) {
    width: 320px;
  }

  .owned-majd-menu:not(.is-open) .owned-majd-menu__panel {
    height: 60px;
    border-radius: 22px;
  }

  .owned-majd-menu:not(.is-open) .owned-majd-menu__brand {
    font-weight: 700;
  }

  .owned-majd-menu:not(.is-open) .owned-majd-menu__items {
    max-height: 0;
    margin-top: 0;
    opacity: 0;
    pointer-events: none;
    transform: translateX(-18px);
    overflow: hidden;
    transition:
      max-height 1020ms var(--menu-ease),
      margin-top 1020ms var(--menu-ease),
      opacity 520ms ease 280ms,
      transform 900ms var(--menu-ease) 170ms;
  }

  .owned-majd-menu:not(.is-open) .owned-majd-menu__item {
    opacity: 0;
    transform: translateX(-18px);
  }

  .owned-majd-menu:not(.is-open) .owned-majd-menu__item:nth-child(1) {
    transition-delay: 500ms, 390ms, 0ms;
  }

  .owned-majd-menu:not(.is-open) .owned-majd-menu__item:nth-child(2) {
    transition-delay: 420ms, 330ms, 0ms;
  }

  .owned-majd-menu:not(.is-open) .owned-majd-menu__item:nth-child(3) {
    transition-delay: 340ms, 270ms, 0ms;
  }

  .owned-majd-menu:not(.is-open) .owned-majd-menu__item:nth-child(4) {
    transition-delay: 260ms, 210ms, 0ms;
  }

  .owned-majd-demo-media {
    --owned-demo-x: 0px;
    --owned-demo-y: 0px;
    --owned-demo-scale: 1;
    --owned-demo-radius: 8px;
    --owned-demo-shadow: none;
    position: relative !important;
    z-index: 30 !important;
    overflow: hidden !important;
    border-radius: var(--owned-demo-radius) !important;
    background: transparent !important;
    box-shadow: var(--owned-demo-shadow) !important;
    transform: translate3d(var(--owned-demo-x), var(--owned-demo-y), 0) scale(var(--owned-demo-scale)) !important;
    transform-origin: center center !important;
    will-change: transform, border-radius, box-shadow;
  }

  .owned-majd-demo-media.is-fullscreening {
    z-index: 999999 !important;
  }

  .owned-majd-demo-source-hidden {
    opacity: 0 !important;
  }

  .owned-majd-demo-video {
    --owned-demo-left: 0px;
    --owned-demo-top: 0px;
    --owned-demo-width: 0px;
    --owned-demo-height: 0px;
    --owned-demo-radius: 8px;
    --owned-demo-opacity: 0;
    position: fixed !important;
    left: var(--owned-demo-left) !important;
    top: var(--owned-demo-top) !important;
    display: block !important;
    width: var(--owned-demo-width) !important;
    height: var(--owned-demo-height) !important;
    z-index: 35 !important;
    opacity: var(--owned-demo-opacity) !important;
    object-fit: cover !important;
    border: 0 !important;
    border-radius: var(--owned-demo-radius) !important;
    background: transparent !important;
    box-shadow: var(--owned-demo-shadow, none) !important;
    cursor: pointer !important;
    pointer-events: auto !important;
    transition:
      left 720ms cubic-bezier(0.19, 1, 0.22, 1),
      top 720ms cubic-bezier(0.19, 1, 0.22, 1),
      width 720ms cubic-bezier(0.19, 1, 0.22, 1),
      height 720ms cubic-bezier(0.19, 1, 0.22, 1),
      border-radius 720ms cubic-bezier(0.19, 1, 0.22, 1),
      box-shadow 720ms cubic-bezier(0.19, 1, 0.22, 1),
      opacity 260ms ease;
    will-change: left, top, width, height, border-radius, box-shadow;
  }

  .owned-majd-demo-video.is-loaded {
    --owned-demo-opacity: 1;
  }

  .owned-majd-demo-video.is-fullscreening {
    z-index: 999998 !important;
  }

  .owned-majd-demo-video.is-expanded {
    z-index: 1000002 !important;
    cursor: default !important;
  }

  .owned-majd-demo-close {
    position: fixed;
    z-index: 1000003;
    display: grid;
    width: 42px;
    height: 42px;
    place-items: center;
    border: 0;
    border-radius: 10px;
    background: rgba(14, 14, 14, 0.92);
    color: rgb(250, 247, 243);
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transform: translate3d(0, 8px, 0) scale(0.96);
    transition:
      opacity 360ms cubic-bezier(0.19, 1, 0.22, 1),
      transform 360ms cubic-bezier(0.19, 1, 0.22, 1);
  }

  .owned-majd-demo-close::before,
  .owned-majd-demo-close::after {
    content: "";
    position: absolute;
    width: 18px;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
  }

  .owned-majd-demo-close::before {
    transform: rotate(45deg);
  }

  .owned-majd-demo-close::after {
    transform: rotate(-45deg);
  }

  .owned-majd-demo-close.is-visible {
    opacity: 1;
    pointer-events: auto;
    transform: translate3d(0, 0, 0) scale(1);
  }

  .owned-majd-how {
    position: absolute;
    top: 922px;
    left: 0;
    z-index: 12;
    width: 1279px;
    min-height: 1200px;
    padding: 130px 54px 120px;
    box-sizing: border-box;
    background: rgb(250, 247, 243);
    color: rgb(17, 17, 17);
    font-family: Archivo, "Archivo Placeholder", sans-serif;
    overflow: hidden;
  }

  #bio-section {
    margin-top: 1200px !important;
  }

  .owned-majd-how::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image: url("https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png");
    background-size: 161px;
    opacity: 0.04;
    pointer-events: none;
  }

  .owned-majd-how__inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 0.92fr 1.08fr;
    gap: 70px;
    align-items: start;
    width: 100%;
  }

  .owned-majd-how__title {
    margin: 0 0 34px;
    color: rgb(17, 17, 17);
    font-size: 74px;
    font-weight: 900;
    line-height: 0.95;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  .owned-majd-how__cards {
    display: grid;
    gap: 10px;
  }

  .owned-majd-how__card {
    display: grid;
    grid-template-columns: 54px minmax(0, 1fr);
    gap: 17px;
    min-height: 112px;
    padding: 18px;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 1px 5px rgba(17, 17, 17, 0.08);
    box-sizing: border-box;
  }

  .owned-majd-how__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    border-radius: 8px;
    background: rgb(17, 17, 17);
    color: rgb(250, 247, 243);
  }

  .owned-majd-how__card-title {
    margin: 0;
    color: rgb(17, 17, 17);
    font-size: 22px;
    font-weight: 800;
    line-height: 1.18;
  }

  .owned-majd-how__detail {
    margin: 8px 0 12px;
    max-width: 44ch;
    color: rgb(17, 17, 17);
    font-size: 15px;
    line-height: 1.55;
  }

  .owned-majd-how__bullets {
    display: grid;
    gap: 7px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .owned-majd-how__bullets li {
    position: relative;
    padding-left: 18px;
    color: rgb(17, 17, 17);
    font-size: 14px;
    font-weight: 700;
    line-height: 1.3;
  }

  .owned-majd-how__bullets li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.45em;
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: rgb(17, 17, 17);
  }

  .owned-majd-how__media-column {
    display: grid;
    gap: 16px;
    justify-items: end;
    padding-top: 12px;
  }

  .owned-majd-how__video-frame {
    width: 100%;
    max-width: 710px;
    margin: 0;
    overflow: hidden;
    border-radius: 12px;
    background: rgb(17, 17, 17);
    box-shadow: 0 18px 52px rgba(17, 17, 17, 0.18);
  }

  .owned-majd-how__video {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    background: rgb(17, 17, 17);
  }

  .owned-majd-how__video-frame.is-owned-demo-carried .owned-majd-how__video {
    opacity: 0;
  }

  .owned-majd-how__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 260px;
    height: 58px;
    border-radius: 11px;
    background: rgb(17, 17, 17);
    color: rgb(250, 247, 243);
    font-size: 22px;
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .owned-majd-menu,
    .owned-majd-menu__panel,
    .owned-majd-menu__brand,
    .owned-majd-menu__button,
    .owned-majd-menu__dot,
    .owned-majd-menu__items,
    .owned-majd-menu__item {
      transition-duration: 1ms !important;
      transition-delay: 0ms !important;
    }
  }

  @media (max-width: 600px) {
    .owned-majd-menu {
      top: 20px;
      width: min(320px, calc(100vw - 36px));
    }

    .owned-majd-menu:not(.is-open) {
      width: min(320px, calc(100vw - 36px));
    }
  }
</style>`;

const headerMarkup = String.raw`<nav class="owned-majd-menu" data-owned-majd-menu aria-label="Primary">
  <div class="owned-majd-menu__panel">
    <div class="owned-majd-menu__top">
      <a class="owned-majd-menu__brand" href="#hero-section">BeUinq</a>
      <button class="owned-majd-menu__button" type="button" aria-label="Open menu" aria-expanded="false">
        <span class="owned-majd-menu__dot" aria-hidden="true"></span>
        <span class="owned-majd-menu__dot" aria-hidden="true"></span>
        <span class="owned-majd-menu__dot" aria-hidden="true"></span>
      </button>
    </div>
    <div class="owned-majd-menu__items">
      <a class="owned-majd-menu__item" href="#about">About Me</a>
      <a class="owned-majd-menu__item" href="#services">Services</a>
      <a class="owned-majd-menu__item" href="#projects">Projects</a>
      <a class="owned-majd-menu__item" href="#contact">Contact</a>
    </div>
  </div>
</nav>`;

const howSectionMarkup = String.raw`<section id="how" class="owned-majd-how" data-owned-majd-how>
  <div class="owned-majd-how__inner">
    <div class="owned-majd-how__copy">
      <h2 class="owned-majd-how__title">How it works</h2>
      <div class="owned-majd-how__cards" aria-label="How Design Humanizer works">
        <article class="owned-majd-how__card">
          <span class="owned-majd-how__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M3 12h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </span>
          <div>
            <h3 class="owned-majd-how__card-title">Create screenshot</h3>
            <p class="owned-majd-how__detail">Design Humanizer captures the page, parses its HTML and CSS, and scans the visible structure of your interface.</p>
            <ul class="owned-majd-how__bullets">
              <li>sections and cards</li>
              <li>buttons and CTAs</li>
              <li>spacing and repeated patterns</li>
            </ul>
          </div>
        </article>

        <article class="owned-majd-how__card">
          <span class="owned-majd-how__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/>
              <path d="m20 20-3.2-3.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </span>
          <div>
            <h3 class="owned-majd-how__card-title">Find what feels generic</h3>
            <p class="owned-majd-how__detail">It detects the patterns that make AI-generated UI feel unfinished.</p>
            <ul class="owned-majd-how__bullets">
              <li>weak hierarchy</li>
              <li>repeated cards</li>
              <li>unclear visual focus</li>
            </ul>
          </div>
        </article>

        <article class="owned-majd-how__card">
          <span class="owned-majd-how__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18h6M10 21h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.9 1 1 1.7l.1.5h5l.1-.5c.1-.7.5-1.3 1-1.7A6 6 0 0 0 12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            </svg>
          </span>
          <div>
            <h3 class="owned-majd-how__card-title">Suggest improvements</h3>
            <p class="owned-majd-how__detail">It gives practical design recommendations without changing your content.</p>
            <ul class="owned-majd-how__bullets">
              <li>stronger grouping</li>
              <li>better rhythm</li>
              <li>clearer CTA priority</li>
            </ul>
          </div>
        </article>

        <article class="owned-majd-how__card">
          <span class="owned-majd-how__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" stroke-width="1.8"/>
              <path d="M12 4v16" stroke="currentColor" stroke-width="1.8" stroke-dasharray="2 2.4"/>
            </svg>
          </span>
          <div>
            <h3 class="owned-majd-how__card-title">Preview the result</h3>
            <p class="owned-majd-how__detail">You compare the same content with a cleaner, more intentional structure.</p>
            <ul class="owned-majd-how__bullets">
              <li>before and after view</li>
              <li>improved composition</li>
              <li>ready-to-apply direction</li>
            </ul>
          </div>
        </article>
      </div>
    </div>

    <div class="owned-majd-how__media-column">
      <figure class="owned-majd-how__video-frame" aria-label="Design Humanizer demo video">
        <video class="owned-majd-how__video" src="/demo/demoview.mp4" autoplay muted loop playsinline controls preload="metadata"></video>
      </figure>
    </div>
  </div>
</section>`;

const headerScript = String.raw`<script id="owned-majd-header-script">
  (() => {
    const menu = document.querySelector("[data-owned-majd-menu]");
    if (!menu) return;

    const toggleButton = menu.querySelector(".owned-majd-menu__button");
    const navItems = Array.from(menu.querySelectorAll(".owned-majd-menu__item"));
    const sourceWidth = 1279;
    const chromeExtensionUrl = "https://chromewebstore.google.com/detail/mbbhjpbbehelagdnlmppgdhheceijfmm?utm_source=item-share-cb";
    const demoVideoUrl = "/demo/demoview.mp4";
    const howSectionMarkup = ${JSON.stringify(howSectionMarkup)};
    const gooeyColors = ["#ffffff", "#fbf7ef", "#0e0e0e", "#2a2a2a"];
    const particleCount = 18;
    const chromeLogo = '<img class="owned-majd-chrome-logo" src="/chrome_logo_PNG.png" alt="" aria-hidden="true" loading="eager" decoding="async">';
    let demoMedia = null;
    let demoVideo = null;
    let demoCloseButton = null;
    let demoExpanded = false;
    let demoFrame = 0;

    const noise = (n = 1) => n / 2 - Math.random() * n;
    const getXY = (distance, pointIndex, totalPoints) => {
      const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
      return [distance * Math.cos(angle), distance * Math.sin(angle)];
    };

    const clearParticles = (element) => {
      element.querySelectorAll(".owned-majd-gooey-particle").forEach((particle) => particle.remove());
    };

    const makeGooeyParticles = (element) => {
      clearParticles(element);

      for (let index = 0; index < particleCount; index += 1) {
        const start = getXY(34, particleCount - index, particleCount);
        const end = getXY(7 + noise(5), particleCount - index, particleCount);
        const time = 820 + noise(240);
        const particle = document.createElement("span");
        const point = document.createElement("span");

        particle.className = "owned-majd-gooey-particle";
        point.className = "owned-majd-gooey-point";
        particle.style.setProperty("--start-x", start[0] + "px");
        particle.style.setProperty("--start-y", start[1] + "px");
        particle.style.setProperty("--end-x", end[0] + "px");
        particle.style.setProperty("--end-y", end[1] + "px");
        particle.style.setProperty("--gooey-time", time + "ms");
        particle.style.setProperty("--gooey-scale", String(0.8 + Math.random() * 0.42));
        particle.style.setProperty("--gooey-rotate", noise(86) + "deg");
        particle.style.setProperty("--gooey-color", gooeyColors[Math.floor(Math.random() * gooeyColors.length)]);
        particle.appendChild(point);
        element.appendChild(particle);
        window.setTimeout(() => particle.remove(), Math.max(850, time + 80));
      }
    };

    const setOpen = (isOpen) => {
      menu.classList.toggle("is-open", isOpen);
      toggleButton?.setAttribute("aria-expanded", String(isOpen));
      toggleButton?.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    };

    const fitPageToWindow = () => {
      document.documentElement.style.setProperty("--owned-majd-scale", String(window.innerWidth / sourceWidth));
    };

    const escapeHtml = (value) => {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    };

    const makeRollingText = (label, className = "") => {
      const safeLabel = escapeHtml(label);
      const characters = Array.from(label).map((character, index) => {
        const glyph = escapeHtml(character === " " ? "\u00a0" : character);

        return '<span class="rolling-button-text__char" style="--rolling-index: ' + index + '">' +
          '<span class="rolling-button-text__track">' +
            '<span class="rolling-button-text__line">' + glyph + '</span>' +
            '<span class="rolling-button-text__line">' + glyph + '</span>' +
          '</span>' +
        '</span>';
      }).join("");

      return '<span class="rolling-button-text ' + className + '" aria-label="' + safeLabel + '">' +
        '<span class="rolling-button-text__chars" aria-hidden="true">' + characters + '</span>' +
      '</span>';
    };

    const setRollingText = (element, label, className = "") => {
      element.setAttribute("aria-label", label);
      element.innerHTML = makeRollingText(label, className);
    };

    const setCtaContent = (link, label, className, withChromeLogo = false) => {
      link.classList.add(className);
      link.setAttribute("aria-label", label);
      link.innerHTML = (withChromeLogo ? chromeLogo : "") + makeRollingText(label, "owned-majd-cta-label");
    };

    const floatCta = (link) => {
      if (link.parentElement !== document.body) {
        document.body.appendChild(link);
      }
    };

    const insertHowSection = () => {
      if (document.querySelector("[data-owned-majd-how]")) return;

      const heroSection = document.querySelector("#hero-section");
      if (!(heroSection instanceof HTMLElement)) return;

      heroSection.insertAdjacentHTML("afterend", howSectionMarkup);
      document.documentElement.style.setProperty("--owned-majd-source-height", "9071.04px");
    };

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const getDemoPortraitImages = () => {
      return Array.from(document.images).filter((image) => {
        const source = image.currentSrc || image.src || "";
        const alt = image.getAttribute("alt") || "";

        return source.includes("haSjyjpt7FyCjJUBvXtmzCMSEQg") ||
          alt.includes("Portrait of portfolio creator");
      });
    };

    const findDemoSourceImage = () => {
      const portraitImages = getDemoPortraitImages();
      const visiblePortraitImages = portraitImages.filter((image) => {
        const rect = image.getBoundingClientRect();

        return rect.width > 0 && rect.height > 0 && getComputedStyle(image).opacity !== "0";
      });

      return visiblePortraitImages.find((image) => {
        return (image.getAttribute("alt") || "").includes("front view");
      }) || visiblePortraitImages[visiblePortraitImages.length - 1] || portraitImages[portraitImages.length - 1];
    };

    const ensureDemoVideo = () => {
      if (demoMedia && demoVideo) return true;

      const sourceImage = findDemoSourceImage();
      if (!sourceImage) return false;

      const wrapper = sourceImage.closest("[data-framer-background-image-wrapper]") || sourceImage.parentElement;
      if (!(wrapper instanceof HTMLElement)) return false;

      demoMedia = wrapper;
      demoVideo = document.querySelector(".owned-majd-demo-video");
      demoMedia.classList.add("owned-majd-demo-media");
      getDemoPortraitImages().forEach((image) => image.classList.add("owned-majd-demo-source-hidden"));

      if (!demoVideo) {
        demoVideo = document.createElement("video");
        demoVideo.className = "owned-majd-demo-video";
        demoVideo.src = demoVideoUrl;
        demoVideo.muted = true;
        demoVideo.loop = true;
        demoVideo.playsInline = true;
        demoVideo.preload = "auto";
        demoVideo.setAttribute("aria-label", "Design Humanizer demo video");
        demoVideo.addEventListener("click", () => {
          if (!demoExpanded) setDemoExpanded(true);
        });
        demoVideo.addEventListener("loadedmetadata", () => {
          if (!demoVideo) return;

          try {
            if (demoVideo.currentTime < 0.12) demoVideo.currentTime = 0.12;
          } catch {
            demoVideo.classList.add("is-loaded");
          }
        }, { once: true });
        demoVideo.addEventListener("loadeddata", () => {
          demoVideo?.classList.add("is-loaded");
        }, { once: true });
        demoVideo.addEventListener("seeked", () => {
          demoVideo?.classList.add("is-loaded");
        }, { once: true });
        document.body.appendChild(demoVideo);
      }

      if (!demoCloseButton) {
        demoCloseButton = document.createElement("button");
        demoCloseButton.className = "owned-majd-demo-close";
        demoCloseButton.type = "button";
        demoCloseButton.setAttribute("aria-label", "Close demo video");
        demoCloseButton.addEventListener("click", () => setDemoExpanded(false));
        document.body.appendChild(demoCloseButton);
      }

      return true;
    };

    const setDemoVideoBox = (left, top, width, height, radius, shadow = "none") => {
      if (!demoVideo) return;

      demoVideo.style.setProperty("--owned-demo-left", left + "px");
      demoVideo.style.setProperty("--owned-demo-top", top + "px");
      demoVideo.style.setProperty("--owned-demo-width", width + "px");
      demoVideo.style.setProperty("--owned-demo-height", height + "px");
      demoVideo.style.setProperty("--owned-demo-radius", radius + "px");
      demoVideo.style.setProperty("--owned-demo-shadow", shadow);
    };

    const getDemoExpandedRect = () => {
      const width = Math.min(window.innerWidth - 48, 980);
      const height = Math.min(window.innerHeight - 72, width * 0.5625);
      const finalWidth = Math.min(width, height / 0.5625);
      const finalHeight = finalWidth * 0.5625;

      return {
        left: (window.innerWidth - finalWidth) / 2,
        top: (window.innerHeight - finalHeight) / 2,
        width: finalWidth,
        height: finalHeight,
      };
    };

    const positionDemoCloseButton = (rect) => {
      if (!demoCloseButton || !rect) return;

      demoCloseButton.style.left = Math.min(window.innerWidth - 58, rect.left + rect.width - 26) + "px";
      demoCloseButton.style.top = Math.max(18, rect.top - 18) + "px";
    };

    const getDemoRestingRect = () => {
      if (!demoMedia) return null;

      const sourceRect = demoMedia.getBoundingClientRect();
      const width = Math.min(window.innerWidth - 48, Math.max(360, sourceRect.width * 1.8));
      const height = width * 0.5625;
      const centerX = sourceRect.left + sourceRect.width / 2;
      const left = clamp(centerX - width / 2, 24, window.innerWidth - width - 24);

      return {
        left,
        top: sourceRect.top,
        width,
        height,
      };
    };

    const setDemoResting = () => {
      if (!demoMedia || !demoVideo) return;

      const rect = getDemoRestingRect();
      if (!rect) return;

      demoMedia.style.setProperty("--owned-demo-x", "0px");
      demoMedia.style.setProperty("--owned-demo-y", "0px");
      demoMedia.style.setProperty("--owned-demo-scale", "1");
      demoMedia.style.setProperty("--owned-demo-radius", "8px");
      demoMedia.style.setProperty("--owned-demo-shadow", "none");
      demoMedia.classList.remove("is-fullscreening");
      demoVideo.classList.remove("is-fullscreening");
      setDemoVideoBox(rect.left, rect.top, rect.width, rect.height, 8);
      positionDemoCloseButton(rect);
      if (!demoExpanded) demoVideo?.pause();
    };

    const setDemoExpanded = (isExpanded) => {
      if (!ensureDemoVideo() || !demoVideo) return;

      demoExpanded = isExpanded;
      demoVideo.classList.toggle("is-expanded", isExpanded);
      demoCloseButton?.classList.toggle("is-visible", isExpanded);

      if (isExpanded) {
        const rect = getDemoExpandedRect();
        const shadow = "0 32px 90px rgba(0, 0, 0, 0.28)";

        setDemoVideoBox(rect.left, rect.top, rect.width, rect.height, 14, shadow);
        positionDemoCloseButton(rect);
        const playPromise = demoVideo.play();
        playPromise?.catch(() => {});
        return;
      }

      setDemoResting();
      window.setTimeout(() => {
        if (!demoExpanded) demoVideo?.pause();
      }, 720);
    };

    const syncDemoVideo = () => {
      demoFrame = 0;

      if (!ensureDemoVideo() || !demoMedia) return;

      if (demoExpanded) {
        setDemoExpanded(true);
        return;
      }

      demoVideo?.style.removeProperty("--owned-demo-opacity");
      setDemoResting();
    };

    const requestDemoSync = () => {
      if (demoFrame) return;
      demoFrame = window.requestAnimationFrame(syncDemoVideo);
    };

    const customizeHero = () => {
      const heroSection = document.querySelector("#hero-section");

      if (heroSection instanceof HTMLElement) {
        heroSection.style.position = "relative";

        if (!heroSection.querySelector(".owned-majd-copyright")) {
          const copyright = document.createElement("div");
          copyright.className = "owned-majd-copyright";
          copyright.setAttribute("aria-hidden", "true");
          copyright.textContent = "©2026";
          heroSection.appendChild(copyright);
        }
      }

      const heroTitle = Array.from(document.querySelectorAll("h1")).find((title) => {
        return title.textContent?.replace(/\s+/g, " ").trim() === "SOFTWARE ENGINEER";
      });

      if (heroTitle) {
        const spans = Array.from(heroTitle.querySelectorAll("span"));
        heroTitle.classList.add("owned-majd-hero-title");

        if (spans.length >= 2) {
          spans[0].textContent = "FIX YOUR";
          spans[1].textContent = "DESIGN";
        } else {
          heroTitle.textContent = "FIX YOUR DESIGN";
        }
      }

      Array.from(document.images).forEach((image) => {
        const source = image.currentSrc || image.src;

        if (source.includes("OLDYsHB9RMavvQrkVRNy08ZXYE")) {
          image.classList.add("owned-majd-hero-star");
        }

        if (source.includes("lIIjRX5gxRdY7UWw5wqIXicPOA")) {
          image.classList.add("owned-majd-hero-bolt");
        }
      });

      Array.from(document.querySelectorAll("mark")).forEach((node) => {
        if (node.textContent?.includes("CREATING SINCE 2020")) {
          const positionedParent = node.closest("[style*='position: absolute']") || node;
          positionedParent.classList.add("owned-majd-hidden");
        }
      });

      const primaryCta = document.querySelector("a.owned-majd-chrome-cta") || document.querySelector('a[href="https://framer.link/bsFvFjY"]');
      const secondaryCta = document.querySelector("a.owned-majd-secondary-cta") || document.querySelector('a[href="https://framer.link/5Wi1vkP"]');

      if (primaryCta instanceof HTMLAnchorElement) {
        primaryCta.href = chromeExtensionUrl;
        primaryCta.target = "_blank";
        primaryCta.rel = "noopener noreferrer";
        setCtaContent(primaryCta, "Use for Free", "owned-majd-chrome-cta", true);
        floatCta(primaryCta);
      }

      if (secondaryCta instanceof HTMLAnchorElement) {
        setCtaContent(secondaryCta, "Buy screenshots", "owned-majd-secondary-cta");
        floatCta(secondaryCta);
      }

      ensureDemoVideo();
      requestDemoSync();
    };

    const scheduleHeroCustomization = () => {
      insertHowSection();
      customizeHero();
      window.requestAnimationFrame(customizeHero);
      window.setTimeout(customizeHero, 120);
      window.setTimeout(customizeHero, 900);
    };

    fitPageToWindow();
    navItems.forEach((item) => {
      setRollingText(item, item.textContent?.trim() || "");
    });
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", scheduleHeroCustomization, { once: true });
    } else {
      scheduleHeroCustomization();
    }
    window.addEventListener("scroll", requestDemoSync, { passive: true });
    window.addEventListener("resize", () => {
      fitPageToWindow();
      requestDemoSync();
    }, { passive: true });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && demoExpanded) {
        setDemoExpanded(false);
      }
    });
    toggleButton?.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
    navItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        const href = item.getAttribute("href");

        if (href?.startsWith("#")) {
          event.preventDefault();
        }

        navItems.forEach((navItem) => navItem.classList.remove("is-gooey-active"));
        item.classList.add("is-gooey-active");
        makeGooeyParticles(item);

        if (href?.startsWith("#")) {
          window.setTimeout(() => {
            const target = document.querySelector(href);

            if (target) {
              target.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
              window.location.hash = href;
            }
          }, 620);
        }
      });
    });
  })();
</script>`;

const injectedHeader = `${headerStyles}${headerMarkup}${headerScript}`;
const page = /<body[^>]*>/i.test(html)
  ? html.replace(/<body[^>]*>/i, (bodyTag) => `${bodyTag}${injectedHeader}`)
  : html.includes("</body>")
    ? html.replace("</body>", `${injectedHeader}</body>`)
    : `${html}${injectedHeader}`;

export function GET() {
  return new Response(page, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
