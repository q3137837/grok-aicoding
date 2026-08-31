import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  EventName,
  PartnerId,
  Role,
  Work,
} from "@/lib/types";
import { LEVELS } from "@/lib/content/levels";
import { CODEX } from "@/lib/content/blocks";
import { uid } from "@/lib/utils";

export interface AppState {
  hydrated: boolean;
  role: Role;
  studentName: string;
  teacherName: string;
  partnerId: PartnerId | null;
  classCode: string;
  familyCode: string;
  energy: number;
  silentMode: boolean;
  lowGrade: boolean;
  previewAll: boolean;
  onboarded: boolean;
  parentBound: boolean;

  unlocked: string[];
  stars: Record<string, number>;
  collected: string[];
  lit: string[];
  events: Record<string, Record<string, number>>;
  works: Record<string, Work>;
  freeWorks: { id: string; title: string; work: Work; at: number }[];
  hintsUsed: Record<string, number>;
  quizPassed: Record<string, boolean>;
  askedBeforeFeed: Record<string, boolean>;
  seenCutscene: Record<string, boolean>;
  gachaPity: number;
  cosmetics: string[];
  currentLesson: string;
  classLocked: boolean;
  praise: { name: string; at: number } | null;
  voicePhrase: Record<string, string>;

  setHydrated: () => void;
  setRole: (r: Role) => void;
  onboardStudent: (name: string, partnerId: PartnerId) => void;
  onboardTeacher: (name: string) => void;
  bindParent: (code: string) => boolean;
  setSilent: (v: boolean) => void;
  setLowGrade: (v: boolean) => void;
  enablePreviewAll: () => void;
  resetDemo: () => void;

  bump: (levelId: string, ev: EventName, n?: number) => void;
  setWork: (levelId: string, work: Work) => void;
  useHint: (levelId: string) => number;
  passQuiz: (levelId: string, cardIds: string[]) => void;
  awardStars: (levelId: string, n: number) => void;
  collectCard: (id: string) => void;
  lightCard: (id: string) => void;
  addEnergy: (n: number) => void;
  pullGacha: () => { item: string; rare: boolean } | null;
  saveFree: (title: string, work: Work) => void;
  markAsked: (levelId: string) => void;
  markCutscene: (levelId: string) => void;
  setVoicePhrase: (levelId: string, phrase: string) => void;
  setLesson: (id: string) => void;
  setLocked: (v: boolean) => void;
  lightningPraise: (name: string) => void;
  clearPraise: () => void;
}

const INITIAL = {
  role: "guest" as Role,
  studentName: "",
  teacherName: "王老师",
  partnerId: null as PartnerId | null,
  classCode: "8821",
  familyCode: "",
  energy: 12,
  silentMode: true,
  lowGrade: true,
  previewAll: false,
  onboarded: false,
  parentBound: false,
  unlocked: ["L1"],
  stars: {} as Record<string, number>,
  collected: [] as string[],
  lit: [] as string[],
  events: {} as Record<string, Record<string, number>>,
  works: {} as Record<string, Work>,
  freeWorks: [] as AppState["freeWorks"],
  hintsUsed: {} as Record<string, number>,
  quizPassed: {} as Record<string, boolean>,
  askedBeforeFeed: {} as Record<string, boolean>,
  seenCutscene: {} as Record<string, boolean>,
  gachaPity: 0,
  cosmetics: [] as string[],
  currentLesson: "L1",
  classLocked: false,
  praise: null as AppState["praise"],
  voicePhrase: {} as Record<string, string>,
};

function familyCodeFrom(name: string) {
  const n = (name || "星").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return String(1000 + (n % 9000));
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      ...INITIAL,
      hydrated: true,
      setHydrated: () => set({ hydrated: true }),
      setRole: (role) => set({ role }),
      onboardStudent: (studentName, partnerId) =>
        set({
          role: "student",
          studentName,
          partnerId,
          onboarded: true,
          familyCode: familyCodeFrom(studentName),
        }),
      onboardTeacher: (teacherName) =>
        set({ role: "teacher", teacherName, onboarded: true }),
      bindParent: (code) => {
        const ok = code.trim() === get().familyCode || code.trim() === "8821";
        if (ok) set({ role: "parent", parentBound: true });
        return ok;
      },
      setSilent: (silentMode) => set({ silentMode }),
      setLowGrade: (lowGrade) => set({ lowGrade }),
      enablePreviewAll: () =>
        set({
          previewAll: true,
          unlocked: LEVELS.map((l) => l.id),
          onboarded: true,
          role: get().role === "guest" ? "student" : get().role,
          studentName: get().studentName || "小星",
          partnerId: get().partnerId ?? "cat",
          familyCode: get().familyCode || familyCodeFrom("小星"),
        }),
      resetDemo: () => set({ ...INITIAL, hydrated: true, familyCode: "" }),

      bump: (levelId, ev, n = 1) =>
        set((s) => {
          const cur = s.events[levelId] ?? {};
          return {
            events: {
              ...s.events,
              [levelId]: { ...cur, [ev]: (cur[ev] ?? 0) + n },
            },
          };
        }),
      setWork: (levelId, work) =>
        set((s) => ({ works: { ...s.works, [levelId]: work } })),
      useHint: (levelId) => {
        const next = (get().hintsUsed[levelId] ?? 0) + 1;
        set((s) => ({ hintsUsed: { ...s.hintsUsed, [levelId]: next } }));
        return next;
      },
      passQuiz: (levelId, cardIds) => {
        set((s) => ({ quizPassed: { ...s.quizPassed, [levelId]: true } }));
        get().bump(levelId, "EVT_QUIZ_PASS");
        cardIds.forEach((id) => get().lightCard(id));
      },
      awardStars: (levelId, n) => {
        const prev = get().stars[levelId] ?? 0;
        const stars = Math.max(prev, n);
        const idx = LEVELS.findIndex((l) => l.id === levelId);
        const unlocked = new Set(get().unlocked);
        unlocked.add(levelId);
        if (stars >= 1 && idx >= 0 && idx < LEVELS.length - 1) {
          unlocked.add(LEVELS[idx + 1].id);
        }
        const level = LEVELS[idx];
        if (stars >= 1 && level) {
          level.quiz.cardIds.forEach((id) => get().collectCard(id));
        }
        if (stars >= 2 && level) {
          level.quiz.cardIds.forEach((id) => get().lightCard(id));
        }
        set({
          stars: { ...get().stars, [levelId]: stars },
          unlocked: Array.from(unlocked),
        });
        if (stars > prev) get().addEnergy(stars === 1 ? 10 : stars === 2 ? 8 : 8);
      },
      collectCard: (id) =>
        set((s) =>
          s.collected.includes(id) ? s : { collected: [...s.collected, id] },
        ),
      lightCard: (id) =>
        set((s) => {
          if (s.lit.includes(id)) return s;
          const collected = s.collected.includes(id) ? s.collected : [...s.collected, id];
          return { lit: [...s.lit, id], collected, energy: s.energy + 8 };
        }),
      addEnergy: (n) => set((s) => ({ energy: Math.max(0, s.energy + n) })),
      pullGacha: () => {
        const s = get();
        if (s.energy < 40) return null;
        const pity = s.gachaPity + 1;
        const rare = pity >= 4 || Math.random() < 0.18;
        const pool = rare
          ? ["星光相框", "彩虹披风", "铃铛徽章", "夜空皮肤"]
          : ["贴纸·星", "贴纸·贝壳", "卡套·暖橙", "卡套·薄荷", "小旗"];
        const item = pool[Math.floor(Math.random() * pool.length)];
        set({
          energy: s.energy - 40,
          gachaPity: rare ? 0 : pity,
          cosmetics: [...s.cosmetics, item],
        });
        const card = CODEX[Math.floor(Math.random() * (CODEX.length - 1))];
        get().collectCard(card.id);
        return { item, rare };
      },
      saveFree: (title, work) =>
        set((s) => ({
          freeWorks: [
            { id: uid("free"), title, work, at: Date.now() },
            ...s.freeWorks,
          ].slice(0, 12),
          energy: s.energy + 10,
        })),
      markAsked: (levelId) =>
        set((s) => ({
          askedBeforeFeed: { ...s.askedBeforeFeed, [levelId]: true },
        })),
      markCutscene: (levelId) =>
        set((s) => ({ seenCutscene: { ...s.seenCutscene, [levelId]: true } })),
      setVoicePhrase: (levelId, phrase) =>
        set((s) => ({ voicePhrase: { ...s.voicePhrase, [levelId]: phrase } })),
      setLesson: (currentLesson) => set({ currentLesson }),
      setLocked: (classLocked) => set({ classLocked }),
      lightningPraise: (name) => set({ praise: { name, at: Date.now() } }),
      clearPraise: () => set({ praise: null }),
    }),
    {
      name: "xingyu-hao-v1",
      partialize: (s) => {
        const { hydrated, praise, classLocked, ...rest } = s;
        void hydrated;
        void praise;
        void classLocked;
        return rest;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

export function ev(levelId: string, name: EventName): number {
  return useApp.getState().events[levelId]?.[name] ?? 0;
}
