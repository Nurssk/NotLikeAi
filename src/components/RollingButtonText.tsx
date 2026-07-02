import type { CSSProperties } from "react";

interface RollingButtonTextProps {
  text: string;
  className?: string;
}

export default function RollingButtonText({ text, className }: RollingButtonTextProps) {
  const classes = ["rolling-button-text", className].filter(Boolean).join(" ");
  const characters = Array.from(text);

  return (
    <span className={classes} aria-label={text}>
      <span className="rolling-button-text__chars" aria-hidden="true">
        {characters.map((character, index) => {
          const glyph = character === " " ? "\u00A0" : character;

          return (
            <span
              className="rolling-button-text__char"
              style={{ "--rolling-index": index } as CSSProperties}
              key={`${character}-${index}`}
            >
              <span className="rolling-button-text__track">
                <span className="rolling-button-text__line">{glyph}</span>
                <span className="rolling-button-text__line">{glyph}</span>
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
