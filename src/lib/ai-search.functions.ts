import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { mockDevelopers } from "@/lib/mock-data";

const InputSchema = z.object({
  prompt: z.string().min(1).max(500),
});

type RankedDev = {
  id: string;
  name: string;
  role: string;
  skills: string[];
  matchScore: number;
  reason: string;
  avatarColor: string;
};

export const aiSearchDevelopers = createServerFn({ method: "POST" })
  .inputValidator((input) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { error: "AI service is not configured. Enable Lovable AI in workspace settings.", results: [] as RankedDev[] };
    }

    // Compact catalog for the LLM
    const catalog = mockDevelopers.map((d) => ({
      id: d.id,
      name: d.name,
      role: d.role,
      skills: d.skills,
      experience: d.experience,
      goal: d.goal,
      availability: d.availability,
      bio: d.bio,
    }));

    const systemPrompt = `You are HackMatch AI, a teammate-matching engine. The user describes the teammate they want. From the provided developer catalog, return the top 3-5 best matches. For each, give a 1-sentence reason explaining WHY they fit, and a matchScore 0-100 (higher = better). Use ONLY developers from the catalog (match by id).`;

    const userPrompt = `User request: "${data.prompt}"\n\nCatalog:\n${JSON.stringify(catalog, null, 2)}`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "rank_developers",
                description: "Return ranked developer matches with reasons.",
                parameters: {
                  type: "object",
                  properties: {
                    matches: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          matchScore: { type: "number" },
                          reason: { type: "string" },
                        },
                        required: ["id", "matchScore", "reason"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["matches"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "rank_developers" } },
        }),
      });

      if (res.status === 429) return { error: "Rate limit hit, please try again in a moment.", results: [] };
      if (res.status === 402) return { error: "AI credits exhausted. Add funds in workspace usage.", results: [] };
      if (!res.ok) {
        console.error("AI gateway error", res.status, await res.text());
        return { error: "AI service error", results: [] };
      }

      const json = await res.json();
      const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) return { error: "No matches returned", results: [] };

      const args = JSON.parse(toolCall.function.arguments) as {
        matches: { id: string; matchScore: number; reason: string }[];
      };

      const results: RankedDev[] = args.matches
        .map((m) => {
          const dev = mockDevelopers.find((d) => d.id === m.id);
          if (!dev) return null;
          return {
            id: dev.id,
            name: dev.name,
            role: dev.role,
            skills: dev.skills,
            avatarColor: dev.avatarColor,
            matchScore: Math.max(0, Math.min(100, Math.round(m.matchScore))),
            reason: m.reason,
          };
        })
        .filter((x): x is RankedDev => x !== null);

      return { error: null, results };
    } catch (e) {
      console.error("AI search failed:", e);
      return { error: "AI service is unavailable", results: [] };
    }
  });
