import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "coral" | "mint" | "navy" | "star" | "ghost" | "cream";

const tones: Record<Tone, string> = {
  coral:
    "bg-coral text-navy [--press-shadow:var(--color-coral-deep)] shadow-[0_5px_0_var(--color-coral-deep)]",
  mint: "bg-mint text-navy [--press-shadow:var(--color-mint-deep)] shadow-[0_5px_0_var(--color-mint-deep)]",
  navy: "bg-navy-2 text-cream [--press-shadow:#0a1228] shadow-[0_5px_0_#0a1228] border border-white/10",
  star: "bg-star text-navy [--press-shadow:var(--color-star-deep)] shadow-[0_5px_0_var(--color-star-deep)]",
  cream:
    "bg-foam text-ink [--press-shadow:var(--color-cream-3)] shadow-[0_5px_0_var(--color-cream-3)]",
  ghost:
    "bg-white/10 text-cream border border-white/15 shadow-none hover:bg-white/16",
};

export function Button({
  className,
  tone = "coral",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: Tone;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      className={cn(
        "pressable inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide select-none",
        size === "sm" && "h-10 px-4 text-sm",
        size === "md" && "h-12 px-5 text-base",
        size === "lg" && "h-14 px-7 text-lg",
        tones[tone],
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-y-0",
        className,
      )}
      {...props}
    />
  );
}
