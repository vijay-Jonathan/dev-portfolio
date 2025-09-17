# Personal Resume RAG Chatbot

A personalized, static-website-compatible chatbot that reads YOUR resume (PDF/DOCX) and uses RAG (Retrieval-Augmented Generation) to answer questions about YOUR specific background and analyze job descriptions against YOUR profile.

## 🚀 Current Status: Step 4 - OpenRouter AI Integration ✅

### Features Implemented
- ✅ Modern, responsive chatbot UI
- ✅ **Real PDF/DOCX parsing with PDF.js and Mammoth.js**
- ✅ **Structured resume data extraction (education, experience, skills, projects)**
- ✅ **OpenRouter AI integration with free models (Llama 3.1, Phi-3, Gemma-2)**
- ✅ **AI-powered natural language responses about YOUR background**
- ✅ **Intelligent context-aware conversations using your resume data**
- ✅ **Fallback to RAG system if AI fails**
- ✅ **API key management with secure local storage**
- ✅ **Connection testing and error handling**
- ✅ **Dual mode: AI-enhanced vs Basic RAG responses**
- ✅ Personal resume storage and persistence
- ✅ Real-time conversation interface
- ✅ Message history with local storage
- ✅ Typing indicators and status updates
- ✅ Chat export functionality
- ✅ Mobile-responsive design

### 🧪 How to Test Locally

#### Option 1: Simple HTTP Server (Recommended)
```bash
# Navigate to the project directory
cd /home/dev/dev-portfolio/rag-chatbot

# Start a simple HTTP server (Python 3)
python3 -m http.server 8000

# Or if you have Node.js installed
npx serve .

# Or if you have PHP installed
php -S localhost:8000
```

Then open your browser and go to: `http://localhost:8000`

#### Option 2: Direct File Opening
You can also open `index.html` directly in your browser, but some features may be limited due to CORS restrictions.

### 🎯 Test Scenarios

**Setup Process:**
1. **Upload Resume**: Drag & drop or click to upload your resume file (PDF/DOCX)
2. **API Configuration**: 
   - Modal will appear asking for OpenRouter API key
   - Get free key from [OpenRouter.ai](https://openrouter.ai)
   - Test connection and save, OR skip for basic mode
3. **Start Chatting**: Ask questions about your background!

**Then try these personalized questions:**

1. **Education Questions** (gets actual education from your resume): 
   - "What is your education?"
   - "Tell me about your degree"
   - "Where did you study?"
   - "When did you graduate?"

2. **Current Work Questions** (finds your current job):
   - "Where do you currently work?"
   - "What is your current job?"
   - "What do you do now?"

3. **Experience Questions** (lists all your work history):
   - "What's your work experience?"
   - "Tell me about your previous jobs"
   - "What companies have you worked for?"

4. **Skills Questions** (extracts actual skills from resume):
   - "What are your technical skills?"
   - "What technologies do you know?"
   - "What programming languages do you use?"

5. **Project Questions** (finds projects in your resume):
   - "What projects have you worked on?"
   - "Show me your projects"

6. **Personal Info Questions**:
   - "What's your contact information?"
   - "What's your email?"

7. **Job Description Analysis** (paste a real job posting):
   - Copy any job posting and get detailed analysis of how YOUR background fits

8. **General Questions**:
   - "Tell me about yourself"
   - "What makes you qualified?"

9. **Without Resume Test**:
   - Try asking questions before uploading - see the "upload first" response

10. **AI vs Basic Mode Comparison**:
    - Compare responses with AI enabled vs basic RAG mode
    - Notice more natural, conversational AI responses
    - Test fallback when AI fails

11. **UI Features**:
    - Try the "AI Settings" button to reconfigure API
    - Try the "Change Resume" button after upload
    - Check browser console to see parsed resume data
    - Try the "Clear Chat" and "Export Chat" buttons

### 🏗️ Architecture Overview

```
rag-chatbot/
├── index.html                    # Main HTML structure with API modal
├── styles.css                   # Modern CSS with modal styles
├── script.js                    # Main chatbot application logic
├── rag-system/
│   ├── resume-parser.js         # PDF/DOCX parsing and data extraction
│   ├── rag-engine.js           # RAG query processing and intelligent responses
│   └── openrouter-api.js       # OpenRouter AI integration and API management
└── README.md                   # This file
```

### 🔧 Technical Details

- **Frontend**: Pure HTML/CSS/JavaScript (no frameworks)
- **AI Integration**: OpenRouter API with free models (Llama 3.1, Phi-3, Gemma-2)
- **PDF Parsing**: PDF.js library for extracting text from PDF files
- **DOCX Parsing**: Mammoth.js library for extracting text from Word documents
- **RAG System**: Custom-built resume parser and query engine
- **Data Extraction**: Structured parsing of education, experience, skills, projects
- **Dual Mode**: AI-enhanced responses + RAG fallback system
- **API Management**: Secure key storage, connection testing, error handling
- **Storage**: LocalStorage for resume data, API keys, and chat history
- **Styling**: Modern CSS with CSS Grid/Flexbox and modal components
- **Icons**: Font Awesome 6.0
- **Responsive**: Mobile-first design
- **Accessibility**: ARIA labels and keyboard navigation

### 🎨 UI Features

- **Modern Design**: Gradient backgrounds, smooth animations
- **Dark/Light Themes**: Ready for theme switching
- **Typing Indicators**: Shows when bot is "thinking"
- **Message Formatting**: Supports basic markdown-like formatting
- **Auto-resize**: Input field grows with content
- **Status Indicators**: Visual feedback for connection status

### 🚀 Next Steps

Once you confirm this skeleton works well, we'll proceed to:

**Step 2**: Integrate OpenRouter API for real AI responses
- Add API configuration
- Implement proper error handling
- Add rate limiting and retry logic

**Step 3**: Add resume data and vector store
- Create resume data structure
- Implement client-side vector embeddings
- Add semantic search capabilities

**Step 4**: Implement RAG retrieval
- Context-aware response generation
- Relevant information extraction
- Citation and source tracking

### 🔒 Security & Privacy

- All data stays client-side (except API calls)
- No server-side storage required
- Chat history stored locally only
- Ready for HTTPS deployment

### 📱 Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support
- Mobile browsers: Responsive design

---

**Ready for Step 2?** Let me know if the skeleton works well and we'll integrate the OpenRouter API!
