import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { levelById } from "@/lib/content/levels";
import { useApp } from "@/lib/store";
import { Cutscene } from "@/components/Cutscene";
import { LevelStudio } from "@/components/editor/Editor";
import { StudentChrome } from "@/components/StudentChrome";

export const Route = createFileRoute("/level/$levelId")({ component: LevelPage });

function LevelPage() {
  const { levelId } = Route.useParams();
  const level = useMemo(() => levelById(levelId), [levelId]);
  const partnerId = useApp((s) => s.partnerId) ?? "cat";
  const seen = useApp((s) => s.seenCutscene[levelId]);
  const mark = useApp((s) => s.markCutscene);
  const onboarded = useApp((s) => s.onboarded);
  const [playCut, setPlayCut] = useState(!seen);

  if (!level) {
    return (
      <main className="grid min-h-dvh place-items-center bg-navy">
        <Link to="/map">关卡走丢了，回星图</Link>
      </main>
    );
  }
  if (!onboarded) {
    return (
      <main className="grid min-h-dvh place-items-center bg-navy">
        <Link to="/onboard">先选一只伙伴</Link>
      </main>
    );
  }

  if (playCut) {
    return (
      <Cutscene
        beats={level.cutscene}
        partnerId={partnerId}
        onDone={() => {
          mark(level.id);
          setPlayCut(false);
        }}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <div className="bg-navy">
        <StudentChrome title={`${level.id} ${level.name}`} backTo="/map" />
      </div>
      <LevelStudio level={level} />
    </div>
  );
}
