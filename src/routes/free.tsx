import { createFileRoute } from "@tanstack/react-router";
import { LEVELS } from "@/lib/content/levels";
import { LevelStudio } from "@/components/editor/Editor";
import { StudentChrome, StudentDock } from "@/components/StudentChrome";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/free")({ component: FreePage });

function FreePage() {
  const saveFree = useApp((s) => s.saveFree);
  const works = useApp((s) => s.freeWorks);
  const template = {
    ...LEVELS[7],
    id: "free",
    name: "自由创作星球",
    mission: "没有影子，没有清单。全部已解锁积木开放。做出你的伙伴 2.0。",
    shadow: "S0" as const,
  };

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <div className="bg-navy">
        <StudentChrome title="自由创作星球" />
      </div>
      <div className="flex items-center justify-between gap-3 bg-foam px-4 py-2 text-ink">
        <p className="text-sm">课后还能回来的地方。提交进班级创意广场。</p>
        <Button
          size="sm"
          tone="mint"
          onClick={() => {
            const w = useApp.getState().works.free ?? { blocks: [] };
            saveFree("我的伙伴 2.0", w);
            toast("已提交创意广场 · 能量 +10");
          }}
        >
          提交广场
        </Button>
      </div>
      <LevelStudio level={template} free />
      {works.length > 0 && (
        <div className="bg-cream px-4 py-3 text-ink">
          <p className="text-xs font-semibold text-ink-soft">广场作品</p>
          <ul className="mt-2 space-y-1 text-sm">
            {works.map((w) => (
              <li key={w.id} className="rounded-xl bg-foam px-3 py-2">
                {w.title} · {w.work.blocks.length} 块积木
              </li>
            ))}
          </ul>
        </div>
      )}
      <StudentDock active="free" />
    </div>
  );
}
