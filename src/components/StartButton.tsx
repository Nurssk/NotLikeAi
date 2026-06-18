import WaitlistMorphButton from "./WaitlistMorphButton";

interface StartButtonProps {
  className?: string;
  size?: "sm" | "lg";
  showStatus?: boolean;
  variant?: "text" | "icon";
}

export default function StartButton({
  className,
  size = "lg",
}: StartButtonProps) {
  const isLarge = size === "lg";
  const wrapperClass = [
    "start-button-shell",
    `start-button-shell--${size}`,
    className ? `${className}-shell` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={wrapperClass}>
      <WaitlistMorphButton
        size={isLarge ? "lg" : "md"}
        buttonText={isLarge ? "Join waitlist" : "Waitlist"}
        placeholder="Enter your email"
        submitText="Join"
        successText="You're on the list"
      />
    </span>
  );
}
