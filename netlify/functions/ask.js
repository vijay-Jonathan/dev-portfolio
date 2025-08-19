const fs = require('fs');
const path = require('path');

function cosineSim(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function chunkMarkdown(text) {
  const paragraphs = text.split(/\n{2,}/g).map(s => s.trim()).filter(Boolean);
  const chunks = [];
  let cur = '';
  for (const p of paragraphs) {
    if ((cur + '\n\n' + p).length > 1200) {
      if (cur) chunks.push(cur);
      cur = p;
    } else {
      cur = cur ? cur + '\n\n' + p : p;
    }
  }
  if (cur) chunks.push(cur);
  return chunks;
}

async function embedTexts(texts, apiKey) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: texts
    })
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Embedding error ${res.status}: ${t}`);
  }
  const data = await res.json();
  return data.data.map(d => d.embedding);
}

async function chatAnswer(question, context, apiKey) {
  const sys = 'You are a helpful assistant that only answers using the provided context. If the answer is not in the context, say: "I cannot find that in the site knowledge." Keep answers concise.';
  const user = `Context:\n${context}\n\nQuestion: ${question}`;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: user }
      ],
      temperature: 0.2
    })
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Chat error ${res.status}: ${t}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const question = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';

    const knowledgePath = path.resolve(process.cwd(), 'public/data/knowledge.md');
    let content = '';
    try {
      content = fs.readFileSync(knowledgePath, 'utf8') || '';
    } catch {
      content = '';
    }

    if (!content.trim()) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ answer: 'No knowledge added yet. Please add content to public/data/knowledge.md and redeploy.' })
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: 'Missing OPENAI_API_KEY' };
    }

    const chunks = chunkMarkdown(content);
    const texts = [...chunks, question];
    const embeddings = await embedTexts(texts, apiKey);
    const qVec = embeddings[embeddings.length - 1];
    const cVecs = embeddings.slice(0, -1);

    const scored = cVecs.map((vec, i) => ({ i, s: cosineSim(vec, qVec) }));
    scored.sort((a, b) => b.s - a.s);
    const top = scored.slice(0, 5).map(({ i }) => chunks[i]);
    const context = top.join('\n\n---\n\n');

    const answer = await chatAnswer(question, context, apiKey);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ answer })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: String(e)
    };
  }
};
