import OpenAI from "openai";

let client: OpenAI | null = null;

/**
 * Lazy OpenAI client; reads OPENAI_API_KEY from the environment.
 */
export function getOpenAIClient(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  if (!client) {
    client = new OpenAI({ apiKey: key });
  }
  return client;
}

export function hasOpenAIKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}
