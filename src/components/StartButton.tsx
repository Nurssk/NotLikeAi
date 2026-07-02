import { useEffect } from "react";
import Magnet from "./Magnet";
import RollingButtonText from "./RollingButtonText";

interface StartButtonProps {
  className?: string;
  size?: "sm" | "lg";
  showStatus?: boolean;
  variant?: "text" | "icon";
}

const CHROME_EXTENSION_URL =
  "https://chromewebstore.google.com/detail/mbbhjpbbehelagdnlmppgdhheceijfmm?utm_source=item-share-cb";

export default function StartButton({
  className,
  size = "lg",
  variant = "text",
}: StartButtonProps) {
  const isLarge = size === "lg";
  const isIcon = variant === "icon";
  const wrapperClass = [
    "start-button-shell",
    `start-button-shell--${size}`,
    className ? `${className}-shell` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const buttonClass = [
    "start-button",
    `start-button--${size}`,
    isIcon ? "start-button--icon" : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("waitlist:morph-ready"));
    window.dispatchEvent(new CustomEvent("extension:cta-ready"));
  }, []);

  return (
    <span className={wrapperClass}>
      <Magnet
        padding={isLarge ? 70 : 48}
        magnetStrength={5}
        wrapperClassName="start-button-magnet"
        innerClassName="start-button-magnet-inner"
      >
        <a
          className={buttonClass}
          href={CHROME_EXTENSION_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-extension-start
          data-extension-destination="chrome_web_store"
          data-extension-size={size}
          data-extension-variant={variant}
          aria-label={isIcon ? "Start with Chrome extension" : undefined}
        >
          <img className="start-button-chrome-logo" src="/logo/chrome-logo.png" alt="" aria-hidden="true" />
          {!isIcon && <RollingButtonText text={isLarge ? "Start" : "Start"} />}
        </a>
      </Magnet>
    </span>
  );
}
