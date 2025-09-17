class ChatbotApp {
    constructor() {
        this.messages = [];
        this.isProcessing = false;
        this.resumeData = null;
        this.resumeText = '';
        this.resumeFileName = '';
        this.resumeParser = new ResumeParser();
        this.ragEngine = new RAGEngine();
        this.openRouterAPI = new OpenRouterAPI();
        this.useAI = false; // Will be set to true if API is configured
        this.initializeElements();
        this.bindEvents();
        this.loadChatHistory();
        this.loadResumeData();
        this.checkAPIConfiguration();
    }

    initializeElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.clearButton = document.getElementById('clearButton');
        this.exportButton = document.getElementById('exportButton');
        this.settingsButton = document.getElementById('settingsButton');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusDot = this.statusIndicator.querySelector('.status-dot');
        this.statusText = this.statusIndicator.querySelector('.status-text');
        
        // Upload elements
        this.uploadSection = document.getElementById('uploadSection');
        this.uploadArea = document.getElementById('uploadArea');
        this.resumeInput = document.getElementById('resumeInput');
        this.uploadStatus = document.getElementById('uploadStatus');
        
        // API Modal elements
        this.apiModal = document.getElementById('apiModal');
        this.closeModal = document.getElementById('closeModal');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.toggleApiKey = document.getElementById('toggleApiKey');
        this.testApiKey = document.getElementById('testApiKey');
        this.saveApiKey = document.getElementById('saveApiKey');
        this.skipApi = document.getElementById('skipApi');
        this.apiStatus = document.getElementById('apiStatus');
    }

    bindEvents() {
        // Send message events
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => this.autoResizeTextarea());

        // Action buttons
        this.clearButton.addEventListener('click', () => this.clearChat());
        this.exportButton.addEventListener('click', () => this.exportChat());
        this.settingsButton.addEventListener('click', () => this.showApiModal());

        // File upload events
        this.resumeInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.uploadArea.addEventListener('click', () => this.resumeInput.click());
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleFileDrop(e));

        // API Modal events
        this.closeModal.addEventListener('click', () => this.hideApiModal());
        this.toggleApiKey.addEventListener('click', () => this.toggleApiKeyVisibility());
        this.testApiKey.addEventListener('click', () => this.testApiConnection());
        this.saveApiKey.addEventListener('click', () => this.saveApiConfiguration());
        this.skipApi.addEventListener('click', () => this.skipApiConfiguration());
        
        // Close modal when clicking outside
        this.apiModal.addEventListener('click', (e) => {
            if (e.target === this.apiModal) {
                this.hideApiModal();
            }
        });

        // Focus input on load
        this.messageInput.focus();
    }

    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isProcessing) return;

        // Add user message
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.autoResizeTextarea();

        // Show processing state
        this.setProcessingState(true);

        try {
            let response;
            
            if (this.useAI && this.openRouterAPI.isConfigured()) {
                // Use AI-powered responses with resume context
                response = await this.openRouterAPI.generateResponse(message, this.resumeData);
            } else {
                // Fallback to RAG system responses
                response = await this.ragEngine.answerQuestion(message);
            }
            
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error getting response:', error);
            
            // If AI fails, try fallback to RAG
            if (this.useAI && this.resumeData) {
                try {
                    const fallbackResponse = await this.ragEngine.answerQuestion(message);
                    this.addMessage(fallbackResponse + '\n\n*Note: AI response failed, using basic mode.*', 'bot');
                } catch (ragError) {
                    this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                }
            } else {
                this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            }
            
            this.setStatus('error', 'Error occurred');
        } finally {
            this.setProcessingState(false);
        }
    }


    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        if (sender === 'bot') {
            avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Handle markdown-like formatting
        const formattedContent = this.formatMessage(content);
        contentDiv.innerHTML = formattedContent;

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Store message
        this.messages.push({ content, sender, timestamp: new Date().toISOString() });
        this.saveChatHistory();
    }

    formatMessage(content) {
        // Simple markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/•\s/g, '• ')
            .replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
        return typingDiv;
    }

    removeTypingIndicator() {
        const typingMessage = this.chatMessages.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    setProcessingState(processing) {
        this.isProcessing = processing;
        this.sendButton.disabled = processing;
        this.messageInput.disabled = processing;

        if (processing) {
            this.setStatus('loading', 'Thinking...');
            this.typingIndicator = this.showTypingIndicator();
        } else {
            this.setStatus('ready', 'Ready');
            this.removeTypingIndicator();
            this.messageInput.focus();
        }
    }

    setStatus(type, text) {
        this.statusDot.className = `status-dot ${type}`;
        this.statusText.textContent = text;
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            this.chatMessages.innerHTML = `
                <div class="message bot-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>Chat cleared! How can I help you today?</p>
                    </div>
                </div>
            `;
            this.messages = [];
            this.saveChatHistory();
        }
    }

    exportChat() {
        if (this.messages.length === 0) {
            alert('No messages to export!');
            return;
        }

        const chatData = {
            exportDate: new Date().toISOString(),
            messages: this.messages
        };

        const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    saveChatHistory() {
        try {
            localStorage.setItem('chatbot-messages', JSON.stringify(this.messages));
        } catch (error) {
            console.warn('Could not save chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            const saved = localStorage.getItem('chatbot-messages');
            if (saved) {
                this.messages = JSON.parse(saved);
                // Optionally restore messages to UI (commented out for clean start)
                // this.restoreMessagesToUI();
            }
        } catch (error) {
            console.warn('Could not load chat history:', error);
        }
    }

    restoreMessagesToUI() {
        // Clear existing messages except welcome
        const welcomeMessage = this.chatMessages.querySelector('.message');
        this.chatMessages.innerHTML = '';
        this.chatMessages.appendChild(welcomeMessage);

        // Restore saved messages
        this.messages.forEach(msg => {
            this.addMessageToUI(msg.content, msg.sender);
        });
    }

    addMessageToUI(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        if (sender === 'bot') {
            avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = this.formatMessage(content);

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        this.chatMessages.appendChild(messageDiv);
    }

    // File Upload Handlers
    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleFileDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    async processFile(file) {
        // Validate file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
        if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|doc)$/i)) {
            alert('Please upload a PDF or DOCX file.');
            return;
        }

        this.setStatus('loading', 'Processing resume...');
        
        try {
            this.resumeFileName = file.name;
            
            // Use the new RAG parser
            this.resumeData = await this.resumeParser.parseResume(file);
            this.resumeText = this.resumeData.rawText;
            
            // Initialize RAG engine with parsed data
            this.ragEngine.initialize(this.resumeParser);

            this.saveResumeData();
            this.showUploadSuccess();
            this.updateWelcomeMessage();
            this.setStatus('ready', 'Resume loaded successfully');
            
            // Show parsing results in console for debugging
            console.log('Resume parsed successfully:', this.resumeData);
            
        } catch (error) {
            console.error('Error processing file:', error);
            this.setStatus('error', 'Error processing file');
            alert('Error processing the file. Please try again or use a different format.');
        }
    }


    showUploadSuccess() {
        this.uploadArea.style.display = 'none';
        this.uploadStatus.style.display = 'block';
        this.uploadStatus.querySelector('span').textContent = `${this.resumeFileName} loaded successfully!`;
    }

    updateWelcomeMessage() {
        const welcomeMessage = this.chatMessages.querySelector('.message-content');
        if (welcomeMessage) {
            welcomeMessage.innerHTML = `
                <p>Perfect! I've successfully loaded your resume: <strong>${this.resumeFileName}</strong></p>
                <p>Now I can help you with:</p>
                <ul>
                    <li>Questions about <strong>your</strong> specific education and work experience</li>
                    <li>Details about <strong>your</strong> projects and technical skills</li>
                    <li>Job description analysis against <strong>your</strong> profile</li>
                    <li>Explaining why <strong>you're</strong> a great fit for specific roles</li>
                </ul>
                <p><strong>What would you like to know about your background?</strong></p>
            `;
        }
    }

    saveResumeData() {
        try {
            const resumeData = {
                fileName: this.resumeFileName,
                text: this.resumeText,
                structuredData: this.resumeData,
                uploadDate: new Date().toISOString()
            };
            localStorage.setItem('resume-data', JSON.stringify(resumeData));
        } catch (error) {
            console.warn('Could not save resume data:', error);
        }
    }

    loadResumeData() {
        try {
            const saved = localStorage.getItem('resume-data');
            if (saved) {
                const savedData = JSON.parse(saved);
                this.resumeFileName = savedData.fileName;
                this.resumeText = savedData.text;
                
                if (savedData.structuredData) {
                    this.resumeData = savedData.structuredData;
                    this.resumeParser.resumeData = savedData.structuredData;
                    this.ragEngine.initialize(this.resumeParser);
                }
                
                if (this.resumeText) {
                    this.showUploadSuccess();
                    this.updateWelcomeMessage();
                }
            }
        } catch (error) {
            console.warn('Could not load resume data:', error);
        }
    }

    // API Configuration Methods
    checkAPIConfiguration() {
        const hasApiKey = this.openRouterAPI.loadApiKey();
        if (hasApiKey) {
            this.useAI = true;
            this.setStatus('ready', 'AI Mode Active');
        } else {
            // Show API configuration modal after a short delay
            setTimeout(() => {
                this.showApiModal();
            }, 2000);
        }
    }

    showApiModal() {
        this.apiModal.style.display = 'block';
        this.apiKeyInput.focus();
    }

    hideApiModal() {
        this.apiModal.style.display = 'none';
        this.clearApiStatus();
    }

    toggleApiKeyVisibility() {
        const input = this.apiKeyInput;
        const icon = this.toggleApiKey.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    async testApiConnection() {
        const apiKey = this.apiKeyInput.value.trim();
        
        if (!apiKey) {
            this.showApiStatus('Please enter an API key first.', 'error');
            return;
        }

        if (!apiKey.startsWith('sk-or-v1-')) {
            this.showApiStatus('API key should start with "sk-or-v1-". Please check your key.', 'error');
            return;
        }

        this.testApiKey.disabled = true;
        this.testApiKey.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing models...';
        
        try {
            // Temporarily set the API key for testing
            const originalKey = this.openRouterAPI.apiKey;
            this.openRouterAPI.apiKey = apiKey;
            
            await this.openRouterAPI.testConnection();
            
            this.showApiStatus(`✅ Connection successful! Using model: ${this.openRouterAPI.model}`, 'success');
            
        } catch (error) {
            let errorMessage = error.message;
            
            // Provide more helpful error messages
            if (errorMessage.includes('401')) {
                errorMessage = 'Invalid API key. Please check your OpenRouter API key.';
            } else if (errorMessage.includes('403')) {
                errorMessage = 'API key doesn\'t have permission. Make sure it\'s active.';
            } else if (errorMessage.includes('No working models found')) {
                errorMessage = 'No free models are currently available. Try again later or check OpenRouter status.';
            }
            
            this.showApiStatus(`❌ ${errorMessage}`, 'error');
            this.openRouterAPI.apiKey = originalKey; // Restore original key
        } finally {
            this.testApiKey.disabled = false;
            this.testApiKey.innerHTML = '<i class="fas fa-flask"></i> Test Connection';
        }
    }

    saveApiConfiguration() {
        const apiKey = this.apiKeyInput.value.trim();
        
        if (!apiKey) {
            this.showApiStatus('Please enter an API key.', 'error');
            return;
        }

        try {
            this.openRouterAPI.setApiKey(apiKey);
            this.useAI = true;
            this.hideApiModal();
            this.setStatus('ready', 'AI Mode Active');
            
            // Update welcome message to mention AI capabilities
            this.addMessage('🚀 AI mode is now active! I can provide more detailed and natural responses about your background using advanced language models.', 'bot');
            
        } catch (error) {
            this.showApiStatus(`Error saving API key: ${error.message}`, 'error');
        }
    }

    skipApiConfiguration() {
        this.useAI = false;
        this.hideApiModal();
        this.setStatus('ready', 'Basic Mode');
        
        // Add message about basic mode
        this.addMessage('📝 Using basic mode. I can still answer questions about your resume using the built-in RAG system. You can configure AI later for enhanced responses.', 'bot');
    }

    showApiStatus(message, type) {
        this.apiStatus.textContent = message;
        this.apiStatus.className = `api-status ${type}`;
        this.apiStatus.style.display = 'block';
    }

    clearApiStatus() {
        this.apiStatus.style.display = 'none';
        this.apiStatus.textContent = '';
        this.apiStatus.className = 'api-status';
    }

}

// Global function for changing resume
function changeResume() {
    if (window.chatbot) {
        window.chatbot.uploadArea.style.display = 'block';
        window.chatbot.uploadStatus.style.display = 'none';
        window.chatbot.resumeInput.value = '';
    }
}

// Initialize the chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new ChatbotApp();
});

// Add some utility functions for future use
window.ChatbotUtils = {
    // Function to detect job descriptions
    isJobDescription(text) {
        const jobKeywords = [
            'requirements', 'qualifications', 'responsibilities', 'duties',
            'experience required', 'skills needed', 'job description',
            'position', 'role', 'candidate', 'apply', 'salary', 'benefits'
        ];
        const lowerText = text.toLowerCase();
        return jobKeywords.some(keyword => lowerText.includes(keyword)) && text.length > 100;
    },

    // Function to extract key information from text
    extractKeyInfo(text) {
        const info = {
            skills: [],
            experience: [],
            education: [],
            requirements: []
        };

        // This will be enhanced with proper NLP in later steps
        const lines = text.split('\n');
        lines.forEach(line => {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('skill') || lowerLine.includes('technology')) {
                info.skills.push(line.trim());
            } else if (lowerLine.includes('experience') || lowerLine.includes('year')) {
                info.experience.push(line.trim());
            } else if (lowerLine.includes('degree') || lowerLine.includes('education')) {
                info.education.push(line.trim());
            } else if (lowerLine.includes('require') || lowerLine.includes('must')) {
                info.requirements.push(line.trim());
            }
        });

        return info;
    }
};
