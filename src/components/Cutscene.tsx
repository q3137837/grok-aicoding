import { useEffect, useRef, useState } from "react";
import type { CutBeat, PartnerId } from "@/lib/types";
import { PartnerPortrait } from "@/components/PartnerPortrait";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Cutscene({
  beats,
  partnerId,
  onDone,
}: {
  beats: CutBeat[];
  partnerId: PartnerId;
  onDone: () => void;
}) {
  const [i, setI] = useState(0);
  const beat = beats[i];
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const t = setTimeout(() => {
      if (i >= beats.length - 1) onDoneRef.current();
      else setI((x) => x + 1);
    }, 5200);
    return () => clearTimeout(t);
  }, [i, beats.length]);

  if (!beat) return null;

  return (
    <div
      className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-navy text-left"
      onClick={() => {
        if (i >= beats.length - 1) onDone();
        else setI((x) => x + 1);
      }}
    >
      <Scene scene={beat.scene} partnerId={partnerId} />
      <div className="relative z-10 mt-auto bg-gradient-to-t from-navy via-navy/90 to-transparent px-6 pb-10 pt-16">
        <div className="mx-auto max-w-xl">
          <p className="text-xs tracking-[0.2em] text-star">星语号</p>
          <p className="mt-3 text-2xl font-semibold leading-snug text-cream md:text-3xl">
            {beat.caption}
          </p>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-1.5">
              {beats.map((_, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    idx === i ? "w-8 bg-coral" : "w-3 bg-white/25",
                  )}
                />
              ))}
            </div>
            <Button
              tone="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDone();
              }}
            >
              跳过
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene({ scene, partnerId }: { scene: CutBeat["scene"]; partnerId: PartnerId }) {
  const bg =
    scene === "bridge" || scene === "night" || scene === "fire" || scene === "queue"
      ? "/scenes/rainbow.jpg"
      : scene === "ship" || scene === "door" || scene === "cape"
        ? "/scenes/hero.jpg"
        : "/scenes/echo.jpg";

  return (
    <div className="absolute inset-0">
      <img src={bg} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-navy/35" />
      {(scene === "fog" || scene === "wind") && (
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(200,210,230,0.35),transparent)] opacity-80"
          style={{ animation: "fog-drift 8s linear infinite" }}
        />
      )}
      <div className="absolute inset-x-0 top-[18%] flex justify-center">
        <div className="bob">
          <PartnerPortrait
            id={partnerId}
            size="xl"
            mood={
              scene === "beach" || scene === "tear"
                ? "sleep"
                : scene === "repeat"
                  ? "confused"
                  : scene === "badge" || scene === "equip"
                    ? "hold-card"
                    : scene === "feed" || scene === "album"
                      ? "hold-box"
                      : scene === "door"
                        ? "look"
                        : "idle"
            }
          />
        </div>
      </div>
    </div>
  );
}
