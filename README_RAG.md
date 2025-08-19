# RAG Chatbot for dev-portfolio

## Overview
This adds a lightweight Retrieval-Augmented Generation (RAG) chatbot that answers strictly based on your Markdown knowledge file.

- Knowledge file: `public/data/knowledge.md` (you manually edit this)
- Backend: Netlify Function `/.netlify/functions/ask` (uses OpenAI for embeddings and answers)
- Frontend: Floating chat button with a panel UI

## Environment variables
Backend (Netlify):
- OPENAI_API_KEY: your OpenAI API key

Frontend:
- REACT_APP_CHAT_API_URL (optional): set to the deployed function URL, e.g.
  `https://YOUR-NETLIFY-SITE.netlify.app/.netlify/functions/ask`
  Leave empty during local development with `netlify dev`.

## Local development
1) Install deps
   npm install
   npm i -g netlify-cli

2) Start Netlify Dev (proxies CRA and serves functions)
   netlify dev
   This starts at http://localhost:8888. Open it and use the chat button.

3) Test empty knowledge
   Ensure `public/data/knowledge.md` is empty. Ask a question — you should see:
   "No knowledge added yet. Please add content..."

4) Add knowledge
   Edit `public/data/knowledge.md` with your content (markdown). Restart if needed:
   netlify dev
   Ask targeted questions and verify grounded answers.

## Deployment
Frontend (GitHub Pages): unchanged. You can still run:
- npm run deploy

Backend (Netlify Functions):
1) Create a Netlify site and connect this GitHub repo
2) Set build command: `npm run build`
3) Set publish directory: `build`
4) Add environment variable:
   - OPENAI_API_KEY
5) Deploy. Your function will be at:
   https://YOUR-SITE.netlify.app/.netlify/functions/ask

Frontend to Backend:
- In production (GitHub Pages domain), set REACT_APP_CHAT_API_URL in a `.env` file before `npm run build`:
  REACT_APP_CHAT_API_URL=https://YOUR-SITE.netlify.app/.netlify/functions/ask
  Then run `npm run build` and `npm run deploy`.

## Notes
- No secrets are exposed in the frontend; keys only live in Netlify env.
- Retrieval is stateless per request and recomputed on-demand to keep infra simple.
