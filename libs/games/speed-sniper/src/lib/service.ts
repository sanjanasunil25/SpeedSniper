import { SniperContent, Difficulty } from './types';
import { SPEED_BY_ROUND } from './scorer';

const SYSTEM_PROMPT = `You are a game content generator for Speed Sniper, a fast-paced reflex game.
Generate exactly 8 rounds of questions.
Each round needs:
- A question answerable from the document
- 1 correct answer (1-3 words max)
- 7 wrong answers that come from the document and sound plausible (1-3 words max)

CRITICAL RULES:
- All answers must be 1-3 words MAXIMUM — they float as tokens on screen
- Wrong answers must be from the document — not random words
- Wrong answers must look believable alongside the correct one
- Never repeat the same answer token across rounds

Return ONLY valid JSON. No markdown. No explanation.
Format exactly:
{
  "rounds": [
    {
      "question": "string",
      "correct": "string",
      "distractors": ["string", "string", "string", "string", "string", "string", "string"]
    }
  ]
}`;

export class SpeedSniperService {
  async generateContent(text: string, apiKeyOverride?: string, difficulty: Difficulty = 'easy'): Promise<SniperContent> {
    const url = `https://openrouter.ai/api/v1/chat/completions`;
    
    const apiKey = (apiKeyOverride || (import.meta as any).env.VITE_OPENROUTER_API_KEY || '').trim();
    
    if (!apiKey) {
      throw new Error('API Key is not set in .env');
    }

    const referer = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200';

    const trimmedText = text.slice(0, 1500);
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': referer,
            'X-Title': 'Black Box Game Engine',
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'openrouter/free',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: `Difficulty: ${difficulty}\n\nResource text:\n<document>\n${trimmedText}\n</document>\n\nGenerate 8 Speed Sniper rounds now.` }
            ],
            response_format: { type: 'json_object' },
            max_tokens: 4000,
            temperature: 0.2,
          }),
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const rawText = data.choices?.[0]?.message?.content || '{}';
        const rawContent = JSON.parse(rawText);
        
        return this.validateAndBuild(rawContent, difficulty);
      } catch (err: any) {
        lastError = err;
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }

    throw lastError ?? new Error('OpenRouter API failed after retries');
  }

  private validateAndBuild(raw: any, difficulty: Difficulty): SniperContent {
    if (!raw || !Array.isArray(raw.rounds) || raw.rounds.length !== 8) {
      throw new Error('Invalid AI response: Expected 8 rounds.');
    }

    return {
      rounds: raw.rounds.map((r: any, i: number) => ({
        roundNumber: i + 1,
        question: r.question,
        correctToken: r.correct,
        distractors: r.distractors,
        speed: SPEED_BY_ROUND[i + 1],
      })),
      difficulty,
      generatedAt: Date.now(),
    };
  }
}
