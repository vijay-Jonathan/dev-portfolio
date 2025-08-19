const endpoint =
  process.env.REACT_APP_CHAT_API_URL ||
  '/.netlify/functions/ask';

export interface ChatRequestBody {
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
}

export async function askRag(messages: ChatRequestBody['messages']) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messages })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<{ answer: string }>;
}
