export type Role = "guest" | "student" | "teacher" | "parent";

export type PartnerId = "cat" | "dog" | "rabbit" | "parrot" | "turtle" | "owl";

export type BlockKind =
  | "persona"
  | "trigger-tap"
  | "trigger-voice"
  | "catchphrase"
  | "opening"
  | "rag"
  | "memory"
  | "knowledge"
  | "skill"
  | "display-speech"
  | "display-firework"
  | "display-ribbon"
  | "script-if";

export type SkillId = "draw" | "math" | "sing" | "joke" | "answer";

export type ShadowTier = "S3" | "S2" | "S1" | "S1-lite" | "S0";

export type SlotShadow = "full" | "outline" | "hint" | "none";

export type PartnerMood =
  | "sleep"
  | "idle"
  | "talk"
  | "confused"
  | "happy"
  | "proud"
  | "hold-box"
  | "hold-card"
  | "yawn"
  | "look";

export type EventName =
  | "EVT_TRIGGER_TAP"
  | "EVT_PERSONA_SWAP"
  | "EVT_RAG_FEED"
  | "EVT_BADGE_RAG_HIT"
  | "EVT_RAG_HIT_SPECIFIC"
  | "EVT_TOOL_EQUIP"
  | "EVT_TOOL_AUTO_PICK"
  | "EVT_TRIGGER_VOICE"
  | "EVT_TOOL_EXEC"
  | "EVT_SHOW_FIREWORK"
  | "EVT_QUIZ_PASS"
  | "EVT_RUN"
  | "EVT_ASK";

export interface BlockDef {
  id: string;
  kind: BlockKind;
  label: string;
  motto?: string;
  color: "persona" | "rag" | "skill" | "trigger" | "script" | "display";
  skill?: SkillId;
  partnerId?: PartnerId;
  knowledge?: KnowledgeCard;
  text?: string;
  hidden?: boolean;
}

export interface KnowledgeCard {
  id: string;
  title: string;
  body: string;
  keywords: string[];
  specific?: boolean;
  partnerId?: PartnerId;
  distractor?: boolean;
}

export interface SlotConfig {
  id: string;
  label: string;
  hint: string;
  accepts: BlockKind[];
  shadow: SlotShadow;
  prefill?: string;
  locked?: boolean;
  gap?: boolean;
  capacity?: number;
}

export interface PlacedBlock {
  uid: string;
  defId: string;
  slotId: string;
  text?: string;
}

export interface Work {
  blocks: PlacedBlock[];
}

export interface QuizOption {
  id: string;
  label: string;
  icon: "persona" | "rag" | "firework" | "trigger" | "skill" | "memory" | "voice" | "combo";
  correct?: boolean;
}

export interface LevelDef {
  id: string;
  index: number;
  chapter: 1 | 2;
  name: string;
  concept: string;
  motto: string;
  newBlocks: string[];
  shadow: ShadowTier;
  gapCount: number;
  firstGapSafe: boolean;
  allowTrial: boolean;
  autonomy: number;
  cutscene: CutBeat[];
  hook: string;
  slots: SlotConfig[];
  pack: string[];
  extraPackLowGrade?: string[];
  mission: string;
  wow: string;
  quiz: {
    question: string;
    options: QuizOption[];
    cardIds: string[];
  };
  checklist?: string[];
  npcs?: { name: string; question: string; expect: string }[];
}

export interface CutBeat {
  caption: string;
  scene: "fog" | "beach" | "card" | "repeat" | "light" | "home" | "feed" | "badge" | "tear" | "album" | "wind" | "bridge" | "equip" | "choose" | "night" | "stage" | "slots" | "fire" | "queue" | "ship" | "cape" | "door";
}

export interface CodexCard {
  id: string;
  name: string;
  motto: string;
  desc: string;
  color: BlockDef["color"];
  lesson: string;
}

export interface Classmate {
  id: string;
  name: string;
  partnerId: PartnerId;
  blocks: number;
  status: "idle" | "active" | "stuck" | "error" | "done";
  stars: number;
  isYou?: boolean;
}

export interface ChatLine {
  id: string;
  from: "kid" | "agent" | "system";
  text: string;
  badge?: "rag" | "tool" | "firework";
  tool?: SkillId;
  mood?: PartnerMood;
  stickers?: { kind: string; count: number };
  math?: string;
  raisedSkill?: SkillId;
}

export interface AgentReply {
  text: string;
  mood: PartnerMood;
  ragHit: boolean;
  ragSpecific: boolean;
  tool?: SkillId;
  toolOk?: boolean;
  stickers?: { kind: string; count: number };
  math?: string;
  firework?: boolean;
  raisedSkill?: SkillId;
  offline?: boolean;
}
