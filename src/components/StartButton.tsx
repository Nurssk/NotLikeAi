import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, initFirebaseAnalytics } from "../lib/firebase";

const CHROME_WEBSTORE_URL =
  "https://chromewebstore.google.com/detail/mbbhjpbbehelagdnlmppgdhheceijfmm?utm_source=item-share-cb";

interface StartButtonProps {
  className?: string;
  size?: "sm" | "lg";
  showStatus?: boolean;
  variant?: "text" | "icon";
}

export default function StartButton({
  className,
  size = "lg",
  showStatus = true,
  variant = "text",
}: StartButtonProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [status, setStatus] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    void initFirebaseAnalytics();
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setIsAuthorized(Boolean(nextUser));
    });
  }, []);

  const openChromeStore = () => {
    const link = document.createElement("a");
    link.href = CHROME_WEBSTORE_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    link.remove();

    return true;
  };

  const start = async () => {
    if (isStarting) return;

    setIsStarting(true);
    setStatus("");

    try {
      if (!isAuthorized) {
        await signInWithPopup(auth, googleProvider);
      }

      const opened = openChromeStore();

      if (!opened) {
        setStatus("New tab blocked. Open the Chrome Web Store from your browser.");
      }
    } catch (err) {
      const code = (err as { code?: string } | null)?.code ?? "";

      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        setStatus("Sign in was cancelled.");
      } else if (code === "auth/popup-blocked") {
        setStatus("Allow popups to continue with Google sign-in.");
      } else {
        console.error("[auth] Google sign-in failed:", code || (err as Error)?.message || err);
        setStatus("Google sign-in failed. Please try again.");
      }
    } finally {
      setIsStarting(false);
    }
  };

  const isIcon = variant === "icon";
  const buttonClasses = className
    ? `${className} start-button--${size}${isIcon ? " start-button--icon" : ""}`
    : `start-button start-button--${size}${isIcon ? " start-button--icon" : ""}`;

  return (
    <span ref={rootRef} className={`start-button-shell start-button-shell--${size}`}>
      <button
        type="button"
        className={buttonClasses}
        onClick={start}
        disabled={isStarting}
        aria-label={isStarting ? "Signing in with Google" : "Sign in with Google and open Chrome extension"}
      >
        {isIcon ? (
          <>
            <img className="start-button-chrome-logo" src="/logo/chrome-logo.png" alt="" aria-hidden="true" />
            <span className="sr-only">{isStarting ? "Signing in..." : "Go to Chrome extension"}</span>
          </>
        ) : (
          <span>{isStarting ? "Signing in..." : "Go to Chrome extension"}</span>
        )}
      </button>
      {showStatus && status ? (
        <span className="start-button-status" role="status" aria-live="polite">
          {status}
        </span>
      ) : null}
    </span>
  );
}
