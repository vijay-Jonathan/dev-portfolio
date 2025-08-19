import React, { useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import Fab from '@mui/material/Fab';
import ChatPanel from './ChatPanel';
import '../assets/styles/Chatbot.scss';

function ChatLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="chat-launcher">
        <Fab color="primary" aria-label="chat" onClick={() => setOpen(true)} sx={{ bgcolor: '#5000ca' }}>
          <ChatIcon />
        </Fab>
      </div>
      <ChatPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default ChatLauncher;
