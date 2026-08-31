import { createServerFn } from "@tanstack/react-start";
import type { PartnerId } from "@/lib/types";

export type AskInput = {
  question: string;
  personaName: string;
  personaTitle: string;
  catchphrase: string;
  personality: string;
  knowledge: { title: string; body: string }[];
  skills: string[];
  partnerId: PartnerId;
};

export const askStarSpirit = createServerFn({ method: "POST" })
  .validator((input: AskInput) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "offline" };

    const know =
      data.knowledge.length === 0
        ? "（百宝箱是空的）"
        : data.knowledge.map((k) => `- ${k.title}：${k.body}`).join("\n");

    const system = `你是小学课堂上的星灵伙伴「${data.personaTitle}·${data.personaName}」。
性格：${data.personality}
口头禅：${data.catchphrase}
技能（可自己选用，不要让孩子指定）：${data.skills.join("、") || "无"}
百宝箱资料：
${know}

规则：
- 用简体中文，短句，总共不超过 70 字。
- 每句回答都要自然带上口头禅。
- 资料里没有的专有事实不要编。不会就说「呃……不知道」。
- 面向 6-12 岁，温暖、不吓人、不讲灰雾伤害。
- 只输出一句对白，不要解释规则。`;

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          messages: [
            { role: "system", content: system },
            { role: "user", content: data.question.slice(0, 120) },
          ],
          max_tokens: 180,
          temperature: 0.7,
        }),
      });
      if (!res.ok) return { ok: false as const, error: `xAI ${res.status}` };
      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = body.choices?.[0]?.message?.content?.trim() ?? "";
      if (!text) return { ok: false as const, error: "empty" };
      return { ok: true as const, text: text.slice(0, 160) };
    } catch {
      return { ok: false as const, error: "network" };
    }
  });
