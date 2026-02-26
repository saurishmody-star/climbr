const PROMPT = `You are analysing a photo of a bouldering wall in a climbing gym.

Your task: identify each distinct ROUTE (set of climbing holds) by colour.

In climbing gyms, each route/problem is set using holds of the same colour. Look for groups of holds that share a colour — these represent individual climbs.

Return ONLY a valid JSON array. No explanation, no markdown, no code fences — just raw JSON.

Each object in the array:
{
  "color_name": "human-readable colour name (e.g. Red, Blue, Yellow, Pink, Purple, Green, Orange, White, Black)",
  "hex": "best-estimate hex code for that colour (e.g. #e63946)",
  "hold_count": estimated number of holds visible for this route (integer),
  "confidence": "high" | "medium" | "low",
  "notes": "brief observation about placement or style (max 10 words)"
}

Only include routes you can clearly identify. If the image is unclear, return your best effort with low confidence.`;

export async function analyseWall({ apiKey, base64, mediaType }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: PROMPT },
        ],
      }],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const raw = data.content[0].text.trim().replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim();

  let routes;
  try {
    routes = JSON.parse(raw);
  } catch {
    throw new Error('Could not parse response from Claude.');
  }

  if (!Array.isArray(routes) || routes.length === 0) {
    throw new Error('No routes detected. Try a clearer photo of the wall.');
  }

  return routes;
}

export const DEMO_ROUTES = [
  { color_name: 'Red',    hex: '#e63946', hold_count: 9,  confidence: 'high',   notes: 'Overhang section, top-right cluster' },
  { color_name: 'Blue',   hex: '#2563eb', hold_count: 7,  confidence: 'high',   notes: 'Slab left side, low start' },
  { color_name: 'Yellow', hex: '#f59e0b', hold_count: 11, confidence: 'high',   notes: 'Centre wall, dynamic moves' },
  { color_name: 'Green',  hex: '#16a34a', hold_count: 6,  confidence: 'medium', notes: 'Corner feature, crimpy finish' },
  { color_name: 'Purple', hex: '#7c3aed', hold_count: 8,  confidence: 'medium', notes: 'Roof section, full body' },
  { color_name: 'Orange', hex: '#ea580c', hold_count: 5,  confidence: 'low',    notes: 'Some holds obscured by others' },
];
