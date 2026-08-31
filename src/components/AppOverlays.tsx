import { useEffect } from "react";
import { useApp } from "@/lib/store";
import { PartnerPortrait } from "@/components/PartnerPortrait";

export function AppOverlays() {
  const locked = useApp((s) => s.classLocked);
  const praise = useApp((s) => s.praise);
  const partnerId = useApp((s) => s.partnerId) ?? "cat";
  const clearPraise = useApp((s) => s.clearPraise);

  useEffect(() => {
    if (!praise) return;
    const t = setTimeout(clearPraise, 10000);
    return () => clearTimeout(t);
  }, [praise, clearPraise]);

  return (
    <>
      {locked && (
        <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-cream text-ink">
          <PartnerPortrait id={partnerId} mood="idle" size="lg" />
          <p className="mt-6 text-3xl font-semibold">请抬头看老师</p>
          <p className="mt-2 text-ink-soft">屏幕先休息一下，耳朵张开。</p>
        </div>
      )}
      {praise && (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-navy/80">
          <Confetti />
          <div className="relative rounded-[28px] bg-cream px-10 py-8 text-center text-ink shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <p className="text-sm font-semibold text-coral">闪电点赞</p>
            <p className="mt-2 text-3xl font-semibold">{praise.name}</p>
            <p className="mt-1 text-ink-soft">上大屏啦 · 全班一起鼓掌</p>
          </div>
        </div>
      )}
    </>
  );
}

function Confetti() {
  const bits = Array.from({ length: 28 }, (_, i) => i);
  const colors = ["#FF8A4C", "#3ECFB4", "#F5C15A", "#E56B9A", "#7B63C8"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {bits.map((i) => (
        <span
          key={i}
          className="absolute top-0 h-3 w-2 rounded-sm"
          style={{
            left: `${(i * 13) % 100}%`,
            background: colors[i % colors.length],
            animation: `confetti-fall ${2.4 + (i % 5) * 0.2}s linear ${i * 0.05}s both`,
          }}
        />
      ))}
    </div>
  );
}
