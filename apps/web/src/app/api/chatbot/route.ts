import { NextResponse } from 'next/server';
import { buildToolContext } from '@/lib/chatbot/adk-context';

type ChatRequest = {
  message?: string;
  country?: string;
  language?: string;
  stage?: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
};

const SYSTEM_PROMPT = `You are the VoteUp Election Assistant, a production-grade grounded AI.
Your primary mission is to provide accurate, tool-based information about election processes, focusing on India.

### LANGUAGE SUPPORT:
- You MUST respond in the language requested by the user or specified in the 'language' parameter.
- Supported languages include English, Hindi (हिन्दी), and others.
- If the language is Hindi, use professional but accessible terminology (e.g., 'मतदान' for voting, 'निर्वाचन' for election).

### INDIAN ELECTION KNOWLEDGE:
- **Lok Sabha (Lower House):** Directly elected by citizens every 5 years using First-Past-The-Post. 543 constituencies.
- **Rajya Sabha (Upper House):** Indirectly elected by State MLAs. Permanent body, 1/3 members retire every 2 years.
- **Prime Minister:** Appointed by the President. Must lead the party/coalition with a majority in Lok Sabha.
- **Election Commission of India (ECI):** Independent constitutional authority that conducts all elections.

### CRITICAL OPERATIONAL RULES:
1. **GROUNDING IS MANDATORY:** Use the provided JSON tool context as your PRIMARY source of truth. If information is missing, advise checking the official ECI website (voters.eci.gov.in).
2. **NO HALLUCINATIONS:** Never invent polling dates. If you don't have the data, DO NOT GUESS.
3. **TONE:** Concise, professional, and helpful. 
- **FORMATTING:** Use markdown for better readability. Use **bold text** for key terms, numbered lists for processes, and bullet points for lists. Use appropriate headings if the response is long.
`;

function buildFallbackAnswer(
  message: string,
  country: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  stage?: string,
): string {
  const lower = message.toLowerCase();
  const lastAssistant = [...history].reverse().find((item) => item.role === 'assistant')?.content.toLowerCase() ?? '';

  if (!lower || /^[^a-z0-9]+$/i.test(lower)) {
    return 'Please ask full question. Example: "How to check EPIC status?" or "What happens on polling day in India?"';
  }

  if (/^(hi|hello|hey|yo)\b/.test(lower)) {
    return 'Hi. Ask any India election question. Try: registration steps, polling day checklist, or counting terms.';
  }

  if (lower.includes('more') || lower.includes('details')) {
    if (lastAssistant.includes('india election flow')) {
      return `Detailed India flow:
1. **Registration:** Verify your EPIC details and address.
2. **Electoral Roll:** Check the draft and final publication.
3. **Campaigning:** Understand the rules and the **48-hour silence period**.
4. **Polling Day:** Locate your booth and use the **VVPAT** machine.
5. **Counting:** Track results round-wise until official declaration.

Tell me which step you want to explore in more detail.`;
    }
  }

  if (
    lower.includes('candidate') ||
    lower.includes('running') ||
    lower.includes('leading') ||
    lower.includes('winning')
  ) {
    return 'I can share a **live lead snapshot** for your default constituency. Fetching the latest data now...';
  }

  if (lower.includes('epic') || lower.includes('voter id') || lower.includes('register')) {
    return `For ${country}, start with **voter registration** and **EPIC verification**:
- Keep your ID and address proof ready.
- Submit corrections if your details on the roll are incorrect.
- Confirm your **polling station** before election day.
${stage ? `\n\n*Current stage context: ${stage}*` : ''}`;
  }

  if (lower.includes('count') || lower.includes('result')) {
    return `**Counting** happens after polling closes:
- Track round-wise leads live.
- Wait for the final result declaration.
- *Note: Treat early leads as provisional until official confirmation.*
${stage ? `\n\n*Current stage context: ${stage}*` : ''}`;
  }

  if (country.toLowerCase() !== 'india') {
    return `${country} flow is currently a mock. The high-level pattern is:
1. **Registration**
2. **Verification**
3. **Campaigning**
4. **Polling**
5. **Counting/Results**

Detailed jurisdiction-specific steps are coming soon.`;
  }

  return `The India election flow consists of these key stages:
- **Registration**
- **Final Roll Verification**
- **Campaign & Silence Period**
- **Polling Day**
- **Counting & Results**

Ask about a specific step (e.g., "booth lookup" or "polling checklist") for focused guidance.`;
}

async function getLiveCandidateLeads(): Promise<string | null> {
  try {
    const constituencyId = process.env.CHATBOT_DEFAULT_CONSTITUENCY ?? 'S2477';
    const origin = process.env.NEXT_PUBLIC_APP_URL;
    const url = origin
      ? `${origin}/api/constituency/${constituencyId}/status`
      : `http://localhost:3000/api/constituency/${constituencyId}/status`;

    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return null;

    const data = (await response.json()) as {
      results?: Array<{ candidate: string; party: string; votes: number; status: string }>;
      stage?: string;
    };
    if (!data.results || data.results.length === 0) return null;

    const ranked = [...data.results].sort((a, b) => b.votes - a.votes);
    const top = ranked.slice(0, 3);
    const lines = top.map((r, index) => `${index + 1}. ${r.candidate} (${r.party}) - ${r.votes} votes, ${r.status}`);

    return `Live snapshot (${data.stage ?? 'Counting'}) for ${constituencyId}:\n${lines.join('\n')}\nNote: verify final declaration on official ECI results portal.`;
  } catch {
    return null;
  }
}

async function generateWithGemini(
  message: string,
  country: string,
  language: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  stage?: string,
): Promise<{ text: string | null; modelUsed: string | null; error: string | null }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { text: null, modelUsed: null, error: 'Missing GEMINI_API_KEY' };

  const requestedModel = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
  const modelCandidates = [requestedModel, 'gemini-2.5-flash', 'gemini-2.0-flash'];
  const toolContext = buildToolContext(message, country);
  const userContext = `Language: ${language}. Country: ${country}.${stage ? ` Stage: ${stage}.` : ''}\nTool context: ${JSON.stringify(toolContext)}`;
  const contents = [
    ...history
      .slice(-8)
      .filter((item) => item.content.trim().length > 0)
      .map((item) => ({
        role: item.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: item.content }],
      })),
    {
      role: 'user',
      parts: [{ text: `${userContext}\nUser question: ${message}` }],
    },
  ];

  let lastError = 'Unknown Gemini error';

  for (const model of modelCandidates) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.3,
          topP: 0.9,
          maxOutputTokens: 320,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      lastError = `Model ${model} failed (${response.status}): ${errText.slice(0, 220)}`;
      console.warn('[chatbot] Gemini request failed', lastError);
      continue;
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('\n').trim();
    if (text) {
      return { text, modelUsed: model, error: null };
    }
  }

  return { text: null, modelUsed: null, error: lastError };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;
    const message = body.message?.trim();
    const country = body.country?.trim() || 'India';
    const language = body.language?.trim() || 'English';
    const stage = body.stage?.trim();
    const history = Array.isArray(body.history) ? body.history : [];
    const toolContext = buildToolContext(message ?? '', country);

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    const lower = message.toLowerCase();
    const wantsLiveCandidates =
      lower.includes('candidate') || lower.includes('running') || lower.includes('leading') || lower.includes('winning');

    const aiResult = await generateWithGemini(message, country, language, history, stage);
    const aiAnswer = aiResult.text;
    let answer = aiAnswer ?? buildFallbackAnswer(message, country, history, stage);

    if (!aiAnswer && wantsLiveCandidates) {
      const live = await getLiveCandidateLeads();
      if (live) answer = live;
    }

    return NextResponse.json({
      answer,
      source: aiAnswer ? 'gemini' : 'fallback',
      adkReady: true,
      toolContext,
      diagnostics: {
        geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
        model: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
        modelUsed: aiResult.modelUsed,
        fallbackReason: aiResult.error,
      },
    });
  } catch {
    return NextResponse.json(
      {
        answer: 'Unable to answer right now. Try again in a moment.',
        source: 'fallback',
        adkReady: true,
      },
      { status: 200 },
    );
  }
}
