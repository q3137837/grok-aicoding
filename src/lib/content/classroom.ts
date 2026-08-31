import type { Classmate, PartnerId } from "@/lib/types";

const NAMES = [
  "小米",
  "乐乐",
  "团团",
  "果果",
  "豆豆",
  "圆圆",
  "糖糖",
  "皮皮",
  "朵朵",
  "晨晨",
  "安安",
  "明明",
  "可可",
  "跳跳",
  "芽芽",
  "月亮",
  "阳光",
  "石头",
  "木木",
  "星河",
];

const PARTNER_CYCLE: PartnerId[] = ["cat", "dog", "rabbit", "parrot", "turtle", "owl"];
const STATUSES: Classmate["status"][] = [
  "done",
  "active",
  "active",
  "idle",
  "stuck",
  "active",
  "done",
  "error",
  "active",
  "idle",
  "done",
  "active",
  "stuck",
  "active",
  "done",
  "idle",
  "active",
  "done",
  "active",
  "idle",
];

export function seedClass(youName: string, youPartner: PartnerId | null): Classmate[] {
  return NAMES.map((name, i) => {
    const isYou = i === 0;
    return {
      id: isYou ? "you" : `stu-${i}`,
      name: isYou ? youName || "实习驯养员" : name,
      partnerId: isYou ? (youPartner ?? "cat") : PARTNER_CYCLE[i % 6],
      blocks: isYou ? 4 : 2 + ((i * 3) % 8),
      status: isYou ? "active" : STATUSES[i],
      stars: isYou ? 0 : i % 4 === 0 ? 3 : i % 3,
      isYou,
    };
  });
}

export const CLASS_CODE = "8821";
export const TEACHER_NAME = "王老师";
