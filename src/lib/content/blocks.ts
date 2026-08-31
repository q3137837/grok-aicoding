import type { BlockDef, KnowledgeCard, PartnerId } from "@/lib/types";
import { PARTNERS } from "./partners";

const ECHO_LOC: KnowledgeCard = {
  id: "echo-loc",
  title: "岛的位置",
  body: "回声岛在星海东边，三颗暖星的正下面。",
  keywords: ["在哪", "位置", "哪里", "东边", "回声岛"],
};

const ECHO_FOOD: KnowledgeCard = {
  id: "echo-food",
  title: "岛的特产",
  body: "回声岛特产是回声贝壳：对着它喊一声，会响三声。",
  keywords: ["特产", "贝壳", "吃", "有什么"],
};

const ECHO_SONG: KnowledgeCard = {
  id: "echo-song",
  title: "岛的歌",
  body: "岛歌叫《亮晶晶》，第一句是：星光亮晶晶，伙伴在想你。",
  keywords: ["歌", "唱", "亮晶晶", "岛歌"],
};

const NEWS: KnowledgeCard = {
  id: "news",
  title: "过期新闻",
  body: "去年彗星集市取消了。这和伙伴自己没关系。",
  keywords: ["新闻", "彗星"],
  distractor: true,
};

const JOKE: KnowledgeCard = {
  id: "joke-card",
  title: "无关笑话",
  body: "为什么星星不说话？因为它在眨眼。这不是伙伴的记忆。",
  keywords: ["笑话"],
  distractor: true,
};

const OTHER_MAP: KnowledgeCard = {
  id: "other-map",
  title: "别岛地图",
  body: "雾珊瑚岛在西边。那不是我们的家。",
  keywords: ["珊瑚", "西边"],
  distractor: true,
};

const SHOW_LIST: KnowledgeCard = {
  id: "show-list",
  title: "节目单",
  body: "今晚节目：开场舞、伙伴合唱、最后放烟花。",
  keywords: ["节目", "合唱", "开场"],
};

const SHOW_TIME: KnowledgeCard = {
  id: "show-time",
  title: "时间表",
  body: "烟花八点整放。不要提前，不要迟到。",
  keywords: ["几点", "时间", "八点", "烟花"],
};

const SHOW_MENU: KnowledgeCard = {
  id: "show-menu",
  title: "菜单",
  body: "晚会菜单：星糖苹果、月亮饼、热可可。",
  keywords: ["菜单", "吃", "苹果", "月亮饼"],
};

function memoriesFor(id: PartnerId): KnowledgeCard[] {
  const map: Record<PartnerId, KnowledgeCard[]> = {
    cat: [
      {
        id: "mem-birth-cat",
        title: "出生纸",
        body: "铃铛出生在星光镇屋顶，生日是流星雨那天。脖子上的铃是妈妈留的。",
        keywords: ["名字", "你是谁", "你叫", "谁"],
        specific: true,
        partnerId: "cat",
      },
      {
        id: "mem-name-cat",
        title: "名字的故事",
        body: "它叫铃铛，因为走路会叮铃铃响。自己却说才不是故意的。",
        keywords: ["名字的故事", "为什么叫", "铃"],
        specific: true,
        partnerId: "cat",
      },
      {
        id: "mem-fav-cat",
        title: "最爱的歌",
        body: "铃铛最爱的歌是《月亮不肯睡》，只在没人时哼。",
        keywords: ["最爱", "喜欢", "歌"],
        specific: true,
        partnerId: "cat",
      },
    ],
    dog: [
      {
        id: "mem-birth-dog",
        title: "出生纸",
        body: "来福出生在星光镇面包店后巷，生日是星星雨那天。",
        keywords: ["名字", "你是谁", "你叫", "谁"],
        specific: true,
        partnerId: "dog",
      },
      {
        id: "mem-name-dog",
        title: "名字的故事",
        body: "店里的人说来了就有福，所以叫来福。",
        keywords: ["名字的故事", "为什么叫"],
        specific: true,
        partnerId: "dog",
      },
      {
        id: "mem-fav-dog",
        title: "最爱的歌",
        body: "来福最爱的歌是《好棒进行曲》，会跟着摇尾巴。",
        keywords: ["最爱", "喜欢", "歌"],
        specific: true,
        partnerId: "dog",
      },
    ],
    rabbit: [
      {
        id: "mem-birth-rabbit",
        title: "出生纸",
        body: "雪球出生在回声岛软沙坡，月亮特别圆的晚上。",
        keywords: ["名字", "你是谁", "你叫", "谁"],
        specific: true,
        partnerId: "rabbit",
      },
      {
        id: "mem-name-rabbit",
        title: "名字的故事",
        body: "它团起来像一颗雪球，大家就这么叫它。",
        keywords: ["名字的故事", "为什么叫"],
        specific: true,
        partnerId: "rabbit",
      },
      {
        id: "mem-fav-rabbit",
        title: "最爱的歌",
        body: "雪球最爱轻轻的摇篮曲，听着听着会睡着。",
        keywords: ["最爱", "喜欢", "歌"],
        specific: true,
        partnerId: "rabbit",
      },
    ],
    parrot: [
      {
        id: "mem-birth-parrot",
        title: "出生纸",
        body: "彩虹破壳于虹桥第三拱，那天天上有双彩虹。",
        keywords: ["名字", "你是谁", "你叫", "谁"],
        specific: true,
        partnerId: "parrot",
      },
      {
        id: "mem-name-parrot",
        title: "名字的故事",
        body: "羽毛七色，所以叫彩虹。它自己会补充：然后还有第八色。",
        keywords: ["名字的故事", "为什么叫"],
        specific: true,
        partnerId: "parrot",
      },
      {
        id: "mem-fav-parrot",
        title: "最爱的歌",
        body: "彩虹最爱把别人的话编成歌，唱个不停。",
        keywords: ["最爱", "喜欢", "歌"],
        specific: true,
        partnerId: "parrot",
      },
    ],
    turtle: [
      {
        id: "mem-birth-turtle",
        title: "出生纸",
        body: "阿慢出生在潮汐沙滩，用了三天三夜才出壳。",
        keywords: ["名字", "你是谁", "你叫", "谁"],
        specific: true,
        partnerId: "turtle",
      },
      {
        id: "mem-name-turtle",
        title: "名字的故事",
        body: "大家等它等得太久，笑着叫它阿慢。它觉得这名字刚刚好。",
        keywords: ["名字的故事", "为什么叫"],
        specific: true,
        partnerId: "turtle",
      },
      {
        id: "mem-fav-turtle",
        title: "最爱的歌",
        body: "阿慢最爱的歌只有两句，要唱一分钟。",
        keywords: ["最爱", "喜欢", "歌"],
        specific: true,
        partnerId: "turtle",
      },
    ],
    owl: [
      {
        id: "mem-birth-owl",
        title: "出生纸",
        body: "咕咕出生在星光镇图书馆塔顶，第一次叫就很有学问。",
        keywords: ["名字", "你是谁", "你叫", "谁"],
        specific: true,
        partnerId: "owl",
      },
      {
        id: "mem-name-owl",
        title: "名字的故事",
        body: "它叫咕咕，因为思考时会咕一声。博士是后来加上的。",
        keywords: ["名字的故事", "为什么叫"],
        specific: true,
        partnerId: "owl",
      },
      {
        id: "mem-fav-owl",
        title: "最爱的歌",
        body: "咕咕最爱的是知识口诀歌，唱完要提问。",
        keywords: ["最爱", "喜欢", "歌"],
        specific: true,
        partnerId: "owl",
      },
    ],
  };
  return map[id];
}

export const ALL_KNOWLEDGE: KnowledgeCard[] = [
  ECHO_LOC,
  ECHO_FOOD,
  ECHO_SONG,
  NEWS,
  JOKE,
  OTHER_MAP,
  SHOW_LIST,
  SHOW_TIME,
  SHOW_MENU,
  ...PARTNERS.flatMap((p) => memoriesFor(p.id)),
];

export function knowledgeById(id: string): KnowledgeCard | undefined {
  return ALL_KNOWLEDGE.find((k) => k.id === id);
}

export const BLOCKS: BlockDef[] = [
  ...PARTNERS.map(
    (p): BlockDef => ({
      id: `persona-${p.id}`,
      kind: "persona",
      label: `${p.title}·${p.name}`,
      motto: "换张卡，变个它",
      color: "persona",
      partnerId: p.id,
    }),
  ),
  {
    id: "trigger-tap",
    kind: "trigger-tap",
    label: "点一点",
    motto: "点一点，就说话",
    color: "trigger",
  },
  {
    id: "trigger-voice",
    kind: "trigger-voice",
    label: "喊暗号",
    motto: "喊暗号，本领到",
    color: "trigger",
    text: "小星星",
  },
  {
    id: "catchphrase",
    kind: "catchphrase",
    label: "口头禅",
    motto: "口头禅，挂嘴边",
    color: "persona",
  },
  {
    id: "opening",
    kind: "opening",
    label: "开场白",
    motto: "第一句话",
    color: "display",
    text: "你是谁？",
  },
  {
    id: "rag",
    kind: "rag",
    label: "百宝箱",
    motto: "喂资料，答得妙",
    color: "rag",
  },
  {
    id: "memory",
    kind: "memory",
    label: "记忆页",
    motto: "喂什么，答什么",
    color: "rag",
  },
  ...ALL_KNOWLEDGE.map(
    (k): BlockDef => ({
      id: `know-${k.id}`,
      kind: "knowledge",
      label: k.title,
      color: "rag",
      knowledge: k,
    }),
  ),
  { id: "skill-draw", kind: "skill", label: "画画", color: "skill", skill: "draw", motto: "装了技能牌，自己会安排" },
  { id: "skill-math", kind: "skill", label: "算数", color: "skill", skill: "math" },
  { id: "skill-sing", kind: "skill", label: "唱歌", color: "skill", skill: "sing" },
  { id: "skill-joke", kind: "skill", label: "讲笑话", color: "skill", skill: "joke" },
  { id: "skill-answer", kind: "skill", label: "举答案牌", color: "skill", skill: "answer" },
  { id: "speech", kind: "display-speech", label: "说话气泡", color: "display" },
  { id: "firework", kind: "display-firework", label: "放烟花", motto: "答得好，烟花冒", color: "display" },
  { id: "ribbon", kind: "display-ribbon", label: "彩带", color: "display" },
  { id: "script-if", kind: "script-if", label: "如果就", motto: "如果这样，就那样", color: "script", hidden: true },
];

export function blockById(id: string): BlockDef | undefined {
  return BLOCKS.find((b) => b.id === id);
}

export const CODEX = [
  { id: "persona", name: "角色卡 · 它是谁", motto: "换张卡，变个它", desc: "决定伙伴的性格和说话方式。", color: "persona" as const, lesson: "L1" },
  { id: "trigger", name: "触发器 · 点一点", motto: "点一点，就说话", desc: "让伙伴开始行动的开关。", color: "trigger" as const, lesson: "L2" },
  { id: "catchphrase", name: "口头禅 · 挂嘴边", motto: "口头禅，挂嘴边", desc: "伙伴最爱的那句话，会渗进每次回答。", color: "persona" as const, lesson: "L2" },
  { id: "rag", name: "百宝箱 · 喂知识", motto: "喂资料，答得妙", desc: "AI 不知道的事，可以喂给它。", color: "rag" as const, lesson: "L3" },
  { id: "memory", name: "记忆页 · 只属于它", motto: "喂什么，答什么", desc: "资料质量决定回答质量。", color: "rag" as const, lesson: "L4" },
  { id: "skill", name: "技能 · 它自己选", motto: "装了技能牌，自己会安排", desc: "孩子只说事，伙伴自己举牌。", color: "skill" as const, lesson: "L5" },
  { id: "voice", name: "触发器 · 喊暗号", motto: "喊暗号，本领到", desc: "听到那句话，本领立刻开始。", color: "trigger" as const, lesson: "L6" },
  { id: "firework", name: "展示 · 放烟花", motto: "答得好，烟花冒", desc: "答得好，天开花。", color: "display" as const, lesson: "L7" },
  { id: "combo", name: "组合技 · 查完举牌", motto: "先查箱，再举牌", desc: "先查百宝箱，再把答案举起来。", color: "display" as const, lesson: "L7" },
  { id: "script", name: "剧本 · 如果就", motto: "如果这样，就那样", desc: "答对时，放烟花。装不装都能毕业。", color: "script" as const, lesson: "L8" },
];
