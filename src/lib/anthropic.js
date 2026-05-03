const MODEL = 'claude-sonnet-4-20250514';
const ENDPOINT = 'https://api.anthropic.com/v1/messages';
const KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const stripFences = (s) =>
  s.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();

const callClaude = async (system, user, maxTokens = 600) => {
  if (!KEY) throw new Error('VITE_ANTHROPIC_API_KEY missing');
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!r.ok) throw new Error(`Claude ${r.status}`);
  const j = await r.json();
  return j.content?.[0]?.text ?? '';
};

export const fetchBriefing = async () => {
  const system =
    'Return ONLY a JSON array of 4 objects with keys: tag (AI/MKT/World, max 5 chars) and text (max 80 chars). No markdown, no preamble. Topics: AI news, markets, world business. Be specific and current-sounding.';
  const txt = await callClaude(system, 'Generate today briefing.', 700);
  const arr = JSON.parse(stripFences(txt));
  if (!Array.isArray(arr)) throw new Error('Bad briefing shape');
  return arr;
};

export const fetchPodcast = async () => {
  const system =
    'Return ONLY a JSON object with keys: show, episode, duration, description (max 60 chars). Recommend one real podcast episode relevant to AI, business, or tech entrepreneurship. No markdown, no preamble.';
  const txt = await callClaude(system, 'Recommend one podcast episode.', 400);
  const obj = JSON.parse(stripFences(txt));
  return obj;
};

export const FALLBACK_BRIEFING = [
  { tag: 'AI', text: 'OpenAI ships o3 to all tiers — beats GPT-4o on reasoning' },
  { tag: 'MKT', text: 'JSE up 1.2% — Naspers leads, rand holds at R18.40' },
  { tag: 'World', text: 'Fed holds — Powell signals two cuts possible H2 2026' },
  { tag: 'AI', text: 'Anthropic releases Claude with extended memory tools' },
];

export const FALLBACK_PODCAST = {
  show: 'Lex Fridman',
  episode: 'Ep 468',
  duration: '1 hr 42 min',
  description: 'Sam Altman — AGI, power & the future of work',
};
