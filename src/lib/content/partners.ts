import type { PartnerId, PartnerMood } from "@/lib/types";

export interface PartnerDef {
  id: PartnerId;
  name: string;
  title: string;
  personality: string;
  catchphrase: string;
  opening: string;
  wake: string;
  confused: string;
  remember: string;
  skipSkill: string;
  lookDoor: string;
  bg: string;
  accent: string;
}

export const PARTNERS: PartnerDef[] = [
  {
    id: "cat",
    name: "铃铛",
    title: "傲娇猫",
    personality: "嘴硬心软，被夸会扭头，耳朵却竖着",
    catchphrase: "才、才不是！",
    opening: "你、你来啦。才不是在等你。",
    wake: "才、才不是在等你！我是铃铛。",
    confused: "哼，这和我有什么关系……我是谁来着？",
    remember: "……才不是高兴呢。我叫铃铛。",
    skipSkill: "哼，本来也不想唱。",
    lookDoor: "笼子里……还有谁？",
    bg: "#F4C9A3",
    accent: "#E07A3D",
  },
  {
    id: "dog",
    name: "来福",
    title: "捧场狗",
    personality: "全场最捧，别人作品运行时鼓掌",
    catchphrase: "好棒好棒！",
    opening: "你好你好！今天也要加油！",
    wake: "好棒好棒！我是来福！终于等到你啦！",
    confused: "好棒的问题！但是……我是谁来着？",
    remember: "我叫来福！！嘿嘿，我想起来啦！",
    skipSkill: "我把机会让给画画啦！",
    lookDoor: "里面还有新朋友？好棒！",
    bg: "#F3E0A8",
    accent: "#D4A017",
  },
  {
    id: "rabbit",
    name: "雪球",
    title: "害羞兔",
    personality: "声音小小，长时间没操作会打瞌睡",
    catchphrase: "……我在。",
    opening: "嗯……你好。",
    wake: "……我在。我叫雪球。",
    confused: "……对不起，我好像想不起来。",
    remember: "我想起来了……我叫雪球。谢谢你。",
    skipSkill: "……那我安静画画好了。",
    lookDoor: "……门开了。好亮。",
    bg: "#D9E7F5",
    accent: "#7BA3C9",
  },
  {
    id: "parrot",
    name: "彩虹",
    title: "话痨鹦鹉",
    personality: "说不完，通关后会复述孩子的操作",
    catchphrase: "然后然后！",
    opening: "然后然后！你来啦你来啦！",
    wake: "然后然后！我叫彩虹！我有好多话要说！",
    confused: "然后然后……咦？下一句是什么来着？",
    remember: "然后然后我叫彩虹！名字想起来啦！",
    skipSkill: "然后我不唱了改画画，可以吧！",
    lookDoor: "然后然后里面还有一个？！",
    bg: "#C8EDE4",
    accent: "#2BA38E",
  },
  {
    id: "turtle",
    name: "阿慢",
    title: "慢性子龟",
    personality: "一字一顿，加载时先伸头再出壳",
    catchphrase: "别急……",
    opening: "别急……我来了。",
    wake: "别急……我是阿慢。慢慢来，也很好。",
    confused: "别急……让我想想。嗯，想不起来。",
    remember: "别急……我想起来了。我叫阿慢。",
    skipSkill: "别急……这张牌，下次再用。",
    lookDoor: "别急……门会开的。看。",
    bg: "#D5E6C3",
    accent: "#6A8F4E",
  },
  {
    id: "owl",
    name: "咕咕",
    title: "博士猫头鹰",
    personality: "爱讲知识，喂错资料时扶眼镜叹气",
    catchphrase: "听我说！",
    opening: "听我说，今天有新发现。",
    wake: "听我说！我是咕咕博士。知识，会回来的。",
    confused: "听我说……这份资料，似乎不是关于我。",
    remember: "听我说！我叫咕咕。记忆校验完成。",
    skipSkill: "听我说，这张技能先归档。",
    lookDoor: "听我说……灰雾，也许也是星灵。",
    bg: "#E8D5B7",
    accent: "#8A5A2B",
  },
];

export function partnerById(id: PartnerId | null | undefined): PartnerDef {
  return PARTNERS.find((p) => p.id === id) ?? PARTNERS[0];
}

export function lineForMood(p: PartnerDef, mood: PartnerMood): string {
  if (mood === "sleep") return "……";
  if (mood === "confused") return p.confused;
  if (mood === "proud") return p.remember;
  if (mood === "yawn") return "呼啊……";
  if (mood === "look") return p.lookDoor;
  return p.catchphrase;
}
