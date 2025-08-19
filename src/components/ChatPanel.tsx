import React, { useEffect, useRef, useState } from 'react';
import '../assets/styles/Chatbot.scss';
import { askRag } from '../utils/chatApi';
import CloseIcon from '@mui/icons-material/Close';

type Msg = { role: 'user' | 'assistant'; content: string };

interface Props {
  open: boolean;
  onClose: () => void;
}

function ChatPanel({ open, onClose }: Props) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Hi! Ask me anything about the content on this site. I answer based only on the knowledge file.' }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, open]);

  if (!open) return null;

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    const nextMsgs: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages(nextMsgs);
    setInput('');
    setSending(true);
    try {
      const reply = await askRag(nextMsgs.map(m => ({ role: m.role, content: m.content })));
      setMessages(prev => [...prev, { role: 'assistant', content: reply.answer }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I could not answer at the moment.' }]);
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="chat-panel-overlay" onClick={onClose}>
      <div className="chat-panel" onClick={(e) => e.stopPropagation()}>
        <div className="chat-header">
          <h3 className="chat-title">Site Assistant</h3>
          <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 0, color: 'white', cursor: 'pointer' }}>
            <CloseIcon />
          </button>
        </div>
        <div className="chat-body" ref={bodyRef}>
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>{m.content}</div>
          ))}
        </div>
        <div className="chat-input">
          <textarea
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button onClick={send} disabled={sending}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;
