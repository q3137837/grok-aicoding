import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StudentChrome, StudentDock } from "@/components/StudentChrome";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/chest")({ component: ChestPage });

function ChestPage() {
  const energy = useApp((s) => s.energy);
  const pull = useApp((s) => s.pullGacha);
  const cosmetics = useApp((s) => s.cosmetics);
  const pity = useApp((s) => s.gachaPity);
  const [last, setLast] = useState<{ item: string; rare: boolean } | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col bg-navy">
      <StudentChrome title="许愿开盒" />
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center px-5 py-8 pb-24 text-center">
        <img
          src="/scenes/chest.jpg"
          alt="百宝箱"
          className={`h-56 w-56 rounded-[32px] object-cover ${open ? "jelly" : "bob"}`}
        />
        <p className="mt-6 text-cream/70">40 能量开一次。连续 3 次落空，第 4 次必出稀有。</p>
        <p className="mt-1 text-sm text-star">当前能量 {energy} · 保底进度 {pity}/4</p>
        <Button
          className="mt-6"
          size="lg"
          disabled={energy < 40}
          onClick={() => {
            const r = pull();
            if (!r) {
              toast("能量不够哦");
              return;
            }
            setLast(r);
            setOpen(true);
            toast(r.rare ? `稀有！${r.item}` : r.item);
          }}
        >
          许愿开盒
        </Button>
        {last && (
          <div className="mt-6 rounded-[24px] bg-white/10 px-6 py-4">
            <p className="text-xs text-star">{last.rare ? "稀有" : "普通"}</p>
            <p className="text-xl font-semibold">{last.item}</p>
            <p className="mt-1 text-xs text-cream/50">装饰与卡面收藏，不会直接点亮图鉴。</p>
          </div>
        )}
        {cosmetics.length > 0 && (
          <ul className="mt-6 w-full space-y-1 text-left text-sm text-cream/80">
            {cosmetics
              .slice()
              .reverse()
              .map((c, i) => (
                <li key={`${c}-${i}`} className="rounded-xl bg-white/5 px-3 py-2">
                  {c}
                </li>
              ))}
          </ul>
        )}
      </div>
      <StudentDock active="chest" />
    </div>
  );
}
