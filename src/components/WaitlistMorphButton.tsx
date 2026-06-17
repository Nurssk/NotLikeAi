/**
 * WaitlistMorphButton.tsx
 *
 * Landing-styled adaptation of the watermelon.sh "morphing-button-base"
 * registry component (src/components/watermelon-ui/morphing-button-base.tsx).
 *
 * The original is built on `motion` (the dependency the shadcn registry
 * requires) and Tailwind utility classes. This project has no Tailwind, so the
 * morphing behavior is reused via `motion/react` while styling is done with the
 * landing's design tokens (milk-beige / yellow / Montserrat / pill radius).
 *
 * Adds email validation, Firestore persistence, inline error, success state,
 * autofocus, Enter to submit, Escape to close.
 */

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../lib/firestore";

interface WaitlistMorphButtonProps {
  buttonText?: string;
  placeholder?: string;
  submitText?: string;
  successText?: string;
  size?: "md" | "lg";
  onSubmit?: (email: string) => void;
}

/* Larger-size overrides (used when size="lg", e.g. the hero) */
const big = {
  cta: { padding: "17px 36px", fontSize: 18, minHeight: 56 } as React.CSSProperties,
  ctaSmall: { padding: "14px 28px", minHeight: 52 } as React.CSSProperties,
  input: { fontSize: 17 } as React.CSSProperties,
  success: { padding: "16px 30px 16px 18px", fontSize: 18, minHeight: 56 } as React.CSSProperties,
  shellOpen: { width: "min(440px, 88vw)", padding: 6 } as React.CSSProperties,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const spring = { type: "spring", stiffness: 260, damping: 22, mass: 1 } as const;

/* Theme-aware: reference CSS variables so the button follows dark/light. */
const COLORS = {
  accent: "var(--accent)",
  accentStrong: "var(--accent-hover)",
  text: "var(--text)",
  onAccent: "var(--on-accent, #05100E)",
  surface: "var(--card)",
  border: "var(--border)",
  muted: "var(--muted)",
  danger: "var(--danger, #FF6B6B)",
  success: "var(--text)",
};

export default function WaitlistMorphButton({
  buttonText = "Join waitlist",
  placeholder = "Enter your email",
  submitText = "Join",
  successText = "You're on the list",
  size = "md",
  onSubmit,
}: WaitlistMorphButtonProps) {
  const lg = size === "lg";
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [resolvedSuccessText, setResolvedSuccessText] = useState(successText);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside the form
  useEffect(() => {
    if (!isExpanded) return;
    const onDown = (e: MouseEvent) => {
      if (isSaving) return;
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
        setError("");
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [isExpanded, isSaving]);

  // Autofocus the input when the form opens
  useEffect(() => {
    if (isExpanded) inputRef.current?.focus();
  }, [isExpanded]);

  const open = () => {
    setIsExpanded(true);
    setError("");
  };

  const close = () => {
    setIsExpanded(false);
    setError("");
  };

  const submit = async () => {
    if (isSaving) return;

    const value = email.trim();
    if (!value || !EMAIL_RE.test(value)) {
      setError("Enter a valid email");
      inputRef.current?.focus();
      return;
    }

    const normalizedEmail = value.toLowerCase();
    // Safe Firestore doc id (no ".", "#", "$", "[", "]", "/")
    const docId = normalizedEmail.replace(/[.#$[\]/]/g, "_");
    const waitlistRef = doc(db, "waitlist", docId);

    setIsSaving(true);
    setError("");

    if (import.meta.env.DEV) {
      console.log("[waitlist] submitting", { normalizedEmail, path: `waitlist/${docId}` });
    }

    try {
      // Write only (no pre-read): the secure waitlist rules deny reads so emails
      // cannot be enumerated, so getDoc() would throw permission-denied. merge
      // makes re-submitting the same email a harmless re-confirmation.
      await setDoc(
        waitlistRef,
        {
          email: value,
          normalizedEmail,
          source: "landing",
          page: window.location.href,
          userAgent: window.navigator.userAgent,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      onSubmit?.(value);
      setResolvedSuccessText(successText);
      setIsExpanded(false);
      setEmail("");
      setIsDone(true);
    } catch (err) {
      const code = (err as { code?: string } | null)?.code ?? "";
      if (code === "permission-denied") {
        console.error("[waitlist] Firestore permission denied. Check firestore.rules", err);
        setError("Waitlist is not enabled yet. Please try again later.");
      } else {
        console.error("[waitlist] failed to save signup:", code || (err as Error)?.message || err);
        setError("Something went wrong. Please try again.");
      }
      inputRef.current?.focus();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div ref={containerRef} style={styles.root}>
      <AnimatePresence mode="popLayout" initial={false}>
        {isDone ? (
          /* ── Success state ─────────────────────────────────────────── */
          <motion.div
            key="done"
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring}
            style={{ ...styles.success, ...(lg ? big.success : null) }}
            role="status"
            aria-live="polite"
          >
            <span style={styles.check} aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7.5l3 3 6-6.5" stroke="#101112" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {resolvedSuccessText}
          </motion.div>
        ) : (
          /* ── Morphing button / form ────────────────────────────────── */
          <motion.div
            key="morph"
            layout
            transition={spring}
            style={{ ...styles.shell, ...(isExpanded ? styles.shellOpen : styles.shellClosed), ...(lg && isExpanded ? big.shellOpen : null) }}
          >
            <AnimatePresence mode="popLayout">
              {isExpanded && (
                <motion.div
                  key="field"
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={spring}
                  style={styles.field}
                >
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder={placeholder}
                    aria-label="Email address for the waitlist"
                    aria-invalid={!!error}
                    aria-describedby={error ? "waitlist-error" : undefined}
                    disabled={isSaving}
                    style={{ ...styles.input, ...(lg ? big.input : null) }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        submit();
                      } else if (e.key === "Escape") {
                        e.preventDefault();
                        close();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close waitlist form"
                    disabled={isSaving}
                    style={{
                      ...styles.closeBtn,
                      ...(isSaving ? styles.disabledControl : null),
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="#5F666A" strokeWidth="1.8"
                        strokeLinecap="round" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              layout
              type="button"
              onClick={() => (isExpanded ? submit() : open())}
              transition={spring}
              disabled={isSaving}
              style={{
                ...styles.cta,
                ...(isExpanded ? styles.ctaSmall : null),
                ...(lg ? (isExpanded ? big.ctaSmall : big.cta) : null),
                ...(isSaving ? styles.disabledCta : null),
              }}
              aria-expanded={isExpanded}
            >
              {!isExpanded && (
                <span style={styles.bell} aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1.6a3.3 3.3 0 0 0-3.3 3.3c0 3.2-1.2 4.3-1.2 4.3h9s-1.2-1.1-1.2-4.3A3.3 3.3 0 0 0 8 1.6Z"
                      stroke="#101112" strokeWidth="1.4" strokeLinejoin="round" />
                    <path d="M6.7 12.2a1.4 1.4 0 0 0 2.6 0" stroke="#101112" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </span>
              )}
              <motion.span layout="position">{isExpanded ? (isSaving ? "Joining..." : submitText) : buttonText}</motion.span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline error (no alert) */}
      <AnimatePresence>
        {error && (
          <motion.p
            id="waitlist-error"
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={styles.error}
            role="alert"
            aria-live="assertive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    fontFamily: 'var(--font-body, "Montserrat", system-ui, sans-serif)',
  },
  shell: {
    display: "flex",
    alignItems: "center",
    borderRadius: 999,
    overflow: "hidden",
  },
  shellClosed: {
    background: "transparent",
    padding: 0,
    width: "auto",
  },
  shellOpen: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    padding: 5,
    width: "min(360px, 78vw)",
    boxShadow: "0 2px 8px rgba(16, 17, 18, 0.08)",
  },
  field: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
    paddingLeft: 14,
    gap: 4,
  },
  input: {
    flex: 1,
    minWidth: 0,
    background: "transparent",
    border: "none",
    outline: "none",
    color: COLORS.text,
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "inherit",
  },
  closeBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    flex: "0 0 auto",
    border: "none",
    background: "transparent",
    borderRadius: 999,
    cursor: "pointer",
  },
  disabledControl: {
    cursor: "not-allowed",
    opacity: 0.52,
  },
  cta: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "1px solid rgba(129, 216, 208, 0.5)",
    borderRadius: 999,
    background: COLORS.accent,
    color: COLORS.onAccent,
    fontWeight: 700,
    fontSize: 15,
    fontFamily: "inherit",
    whiteSpace: "nowrap",
    cursor: "pointer",
    padding: "13px 26px",
    minHeight: 44,
    boxShadow: "0 2px 8px rgba(16, 17, 18, 0.08)",
  },
  disabledCta: {
    cursor: "wait",
    opacity: 0.78,
    transform: "none",
  },
  ctaSmall: {
    padding: "10px 20px",
    minHeight: 40,
  },
  success: {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
    borderRadius: 999,
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    color: COLORS.text,
    fontWeight: 700,
    fontSize: 15,
    padding: "12px 22px 12px 14px",
    minHeight: 44,
    boxShadow: "0 2px 8px rgba(16, 17, 18, 0.08)",
  },
  check: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 22,
    height: 22,
    borderRadius: 999,
    background: COLORS.accent,
    flex: "0 0 auto",
  },
  error: {
    margin: 0,
    paddingLeft: 6,
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: 600,
  },
};
