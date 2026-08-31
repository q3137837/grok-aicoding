import type { PartnerId, PartnerMood } from "@/lib/types";
import { partnerById } from "@/lib/content/partners";
import { cn } from "@/lib/utils";

export function PartnerPortrait({
  id,
  mood = "idle",
  size = "md",
  className,
}: {
  id: PartnerId;
  mood?: PartnerMood;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const p = partnerById(id);
  const dim =
    size === "sm" ? "h-16 w-16" : size === "md" ? "h-28 w-28" : size === "lg" ? "h-40 w-40" : "h-56 w-56";
  const asleep = mood === "sleep";
  const confused = mood === "confused" || mood === "yawn";

  return (
    <div className={cn("relative inline-flex items-end justify-center", dim, className)}>
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-[28%]",
          asleep ? "" : "bob",
          confused && "wiggle",
        )}
        style={{ background: p.bg }}
      >
        <img
          src={`/partners/${id}.jpg`}
          alt={p.name}
          className={cn(
            "h-full w-full object-cover object-top transition-[filter,transform] duration-500",
            asleep && "grayscale contrast-75 brightness-90",
          )}
        />
        {asleep && (
          <div className="absolute inset-0 bg-navy/25" />
        )}
      </div>
      {asleep && (
        <span className="absolute -top-2 right-1 text-star text-lg font-bold">?</span>
      )}
      {mood === "hold-box" && (
        <span className="absolute -right-2 bottom-3 rounded-xl bg-rag px-2 py-1 text-[10px] font-bold text-foam">
          百宝箱
        </span>
      )}
      {mood === "hold-card" && (
        <span className="absolute -right-1 top-4 rounded-xl bg-skill px-2 py-1 text-[10px] font-bold text-foam">
          举牌
        </span>
      )}
      {mood === "proud" && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-star">✦</span>
      )}
    </div>
  );
}

export function Fairy({ className }: { className?: string }) {
  return (
    <img
      src="/partners/fairy.jpg"
      alt="闪闪"
      className={cn("h-14 w-14 rounded-full object-cover bob", className)}
    />
  );
}
