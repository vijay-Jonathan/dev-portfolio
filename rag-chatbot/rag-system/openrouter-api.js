class OpenRouterAPI {
    constructor() {
        this.apiKey = null;
        this.baseURL = 'https://openrouter.ai/api/v1';
        this.model = 'microsoft/phi-3-mini-128k-instruct:free'; // Updated free model
        this.maxTokens = 1000;
        this.temperature = 0.7;
        this.fallbackModels = [
            'microsoft/phi-3-mini-128k-instruct:free',
            'google/gemma-2-9b-it:free',
            'meta-llama/llama-3.1-8b-instruct:free',
            'mistralai/mistral-7b-instruct:free',
            'huggingfaceh4/zephyr-7b-beta:free'
        ];
    }

    setApiKey(apiKey) {
        this.apiKey = apiKey;
        // Save to localStorage for persistence
        try {
            localStorage.setItem('openrouter-api-key', apiKey);
        } catch (error) {
            console.warn('Could not save API key:', error);
        }
    }

    loadApiKey() {
        try {
            const saved = localStorage.getItem('openrouter-api-key');
            if (saved) {
                this.apiKey = saved;
                return true;
            }
        } catch (error) {
            console.warn('Could not load API key:', error);
        }
        return false;
    }

    isConfigured() {
        return this.apiKey && this.apiKey.trim() !== '';
    }

    async generateResponse(prompt, resumeContext = null) {
        if (!this.isConfigured()) {
            throw new Error('OpenRouter API key not configured');
        }

        const systemPrompt = this.createSystemPrompt(resumeContext);
        
        // Try primary model first, then fallback models
        const modelsToTry = [this.model, ...this.fallbackModels.filter(m => m !== this.model)];
        
        for (let i = 0; i < modelsToTry.length; i++) {
            const currentModel = modelsToTry[i];
            
            try {
                const requestBody = {
                    model: currentModel,
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: this.maxTokens,
                    temperature: this.temperature,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0
                };

                const response = await fetch(`${this.baseURL}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': window.location.origin,
                        'X-Title': 'Personal Resume Assistant'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage = errorData.error?.message || 'Unknown error';
                    
                    // If this is the last model to try, throw the error
                    if (i === modelsToTry.length - 1) {
                        throw new Error(`API Error: ${response.status} - ${errorMessage}`);
                    }
                    
                    // Otherwise, log and continue to next model
                    console.warn(`Model ${currentModel} failed: ${errorMessage}. Trying next model...`);
                    continue;
                }

                const data = await response.json();
                
                if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                    if (i === modelsToTry.length - 1) {
                        throw new Error('Invalid response format from API');
                    }
                    console.warn(`Model ${currentModel} returned invalid format. Trying next model...`);
                    continue;
                }

                // Success! Update the primary model for future requests
                if (currentModel !== this.model) {
                    console.log(`Switched to working model: ${currentModel}`);
                    this.model = currentModel;
                }

                return data.choices[0].message.content;
                
            } catch (error) {
                if (i === modelsToTry.length - 1) {
                    console.error('All models failed:', error);
                    throw error;
                }
                console.warn(`Model ${currentModel} failed:`, error.message);
            }
        }
    }

    createSystemPrompt(resumeContext) {
        let systemPrompt = `You are a personal resume assistant AI. Your job is to help answer questions about a specific person's background, experience, and qualifications based on their resume data.

IMPORTANT GUIDELINES:
1. Always speak in first person as if you ARE the person whose resume this is
2. Only provide information that can be found in or reasonably inferred from the resume data
3. Be specific and detailed when the resume data supports it
4. If asked about something not in the resume, politely say you don't have that information
5. For job description analysis, compare the requirements against the actual resume data
6. Be professional but conversational in tone
7. Highlight strengths and relevant experience clearly

`;

        if (resumeContext) {
            systemPrompt += `RESUME DATA CONTEXT:
${this.formatResumeContext(resumeContext)}

Use this information to answer questions accurately and personally.`;
        } else {
            systemPrompt += `No resume has been uploaded yet. Ask the user to upload their resume first.`;
        }

        return systemPrompt;
    }

    formatResumeContext(resumeData) {
        let context = '';

        // Personal Information
        if (resumeData.sections.personalInfo && Object.keys(resumeData.sections.personalInfo).length > 0) {
            context += '\nPERSONAL INFORMATION:\n';
            const personal = resumeData.sections.personalInfo;
            if (personal.name) context += `Name: ${personal.name}\n`;
            if (personal.email) context += `Email: ${personal.email}\n`;
            if (personal.phone) context += `Phone: ${personal.phone}\n`;
            if (personal.linkedin) context += `LinkedIn: ${personal.linkedin}\n`;
            if (personal.github) context += `GitHub: ${personal.github}\n`;
        }

        // Education
        if (resumeData.sections.education && resumeData.sections.education.length > 0) {
            context += '\nEDUCATION:\n';
            resumeData.sections.education.forEach((edu, index) => {
                context += `${index + 1}. `;
                if (edu.degree) context += `${edu.degree}`;
                if (edu.field) context += ` in ${edu.field}`;
                if (edu.institution) context += ` from ${edu.institution}`;
                if (edu.year) context += ` (${edu.year})`;
                context += '\n';
            });
        }

        // Work Experience
        if (resumeData.sections.experience && resumeData.sections.experience.length > 0) {
            context += '\nWORK EXPERIENCE:\n';
            resumeData.sections.experience.forEach((exp, index) => {
                context += `${index + 1}. `;
                if (exp.title) context += `${exp.title}`;
                if (exp.company) context += ` at ${exp.company}`;
                if (exp.startYear || exp.endYear) {
                    context += ` (${exp.startYear || '?'} - ${exp.endYear || 'Present'})`;
                }
                if (exp.description && exp.description.trim()) {
                    context += `\n   Description: ${exp.description.substring(0, 300)}`;
                }
                context += '\n';
            });
        }

        // Skills
        if (resumeData.sections.skills && resumeData.sections.skills.length > 0) {
            context += '\nSKILLS:\n';
            context += resumeData.sections.skills.slice(0, 20).join(', ') + '\n';
        }

        // Projects
        if (resumeData.sections.projects && resumeData.sections.projects.length > 0) {
            context += '\nPROJECTS:\n';
            resumeData.sections.projects.forEach((project, index) => {
                context += `${index + 1}. ${project.name}`;
                if (project.description) context += ` - ${project.description.substring(0, 200)}`;
                context += '\n';
            });
        }

        // Certifications
        if (resumeData.sections.certifications && resumeData.sections.certifications.length > 0) {
            context += '\nCERTIFICATIONS:\n';
            resumeData.sections.certifications.forEach((cert, index) => {
                context += `${index + 1}. ${cert}\n`;
            });
        }

        // Raw text excerpt for additional context
        if (resumeData.rawText) {
            context += '\nADDITIONAL CONTEXT (first 500 chars):\n';
            context += resumeData.rawText.substring(0, 500) + '...\n';
        }

        return context;
    }


    async testConnection() {
        if (!this.isConfigured()) {
            throw new Error('API key not configured');
        }

        try {
            // Simple test with minimal context
            const testPrompt = 'Respond with exactly: "Connection test successful"';
            
            for (const model of this.fallbackModels) {
                try {
                    const requestBody = {
                        model: model,
                        messages: [
                            {
                                role: "user",
                                content: testPrompt
                            }
                        ],
                        max_tokens: 50,
                        temperature: 0.1
                    };

                    const response = await fetch(`${this.baseURL}/chat/completions`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${this.apiKey}`,
                            'Content-Type': 'application/json',
                            'HTTP-Referer': window.location.origin,
                            'X-Title': 'Personal Resume Assistant'
                        },
                        body: JSON.stringify(requestBody)
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.choices && data.choices[0] && data.choices[0].message) {
                            // Found a working model
                            this.model = model;
                            console.log(`Test successful with model: ${model}`);
                            return true;
                        }
                    }
                } catch (modelError) {
                    console.warn(`Test failed for model ${model}:`, modelError.message);
                    continue;
                }
            }
            
            throw new Error('No working models found');
        } catch (error) {
            throw new Error(`Connection test failed: ${error.message}`);
        }
    }
}
