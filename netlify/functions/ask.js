const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Configuration
const CONFIG = {
  EMBEDDING_MODEL: 'sentence-transformers/all-mpnet-base-v2',
  CHAT_MODEL: 'deepset/roberta-base-squad2',  // Using a reliable Q&A model
  MAX_CHUNK_LENGTH: 800,                    // Slightly smaller chunks for better focus
  MAX_CONTEXT_LENGTH: 1500,                 // Balanced context window
  TEMPERATURE: 0.1,                         // Lower temperature for more focused answers
  MAX_NEW_TOKENS: 500,                      // Increased token limit for detailed responses
  MIN_SCORE: 0.2,                           // Higher minimum similarity score
  CONFIDENCE_THRESHOLD: 0.15,               // Lower confidence threshold
  MAX_RETRIES: 3,                           // Number of retries for API calls
  RETRY_DELAY: 1000,                        // Delay between retries in ms
  MIN_ANSWER_LENGTH: 10                     // Minimum characters for a valid answer
};

// Simple cosine similarity
function cosineSim(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

// Split text into chunks
function splitIntoChunks(text, maxLength) {
  const chunks = [];
  let currentChunk = '';
  const paragraphs = text.split(/\n{2,}/g).map(s => s.trim()).filter(Boolean);
  
  for (const paragraph of paragraphs) {
    if ((currentChunk + '\n\n' + paragraph).length <= maxLength) {
      currentChunk = currentChunk ? currentChunk + '\n\n' + paragraph : paragraph;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = paragraph;
    }
  }
  
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

// Get embeddings from Hugging Face
async function getEmbeddings(texts, apiKey) {
  try {
    // Convert single text to array and ensure we're working with an array
    const textArray = Array.isArray(texts) ? texts : [texts];
    
    // Format the input as required by the sentence similarity model
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${CONFIG.EMBEDDING_MODEL}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            source_sentence: textArray[0],
            sentences: textArray.length > 1 ? textArray.slice(1) : [textArray[0]]
          },
          options: { wait_for_model: true }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Hugging Face API error:', error);
      throw new Error(`Hugging Face API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    
    // The response will be an array of similarity scores
    // For our use case, we'll return the result as is
    if (Array.isArray(result)) return result;
    
    throw new Error('Unexpected response format from Hugging Face API');
    
  } catch (error) {
    console.error('Error in getEmbeddings:', error);
    throw error;
  }
}

// Generate response using Hugging Face with retry logic
async function generateResponse(question, context, apiKey, retryCount = 0) {
  try {
    // Limit context length to prevent token limit issues
    const truncatedContext = context.length > CONFIG.MAX_CONTEXT_LENGTH 
      ? context.substring(0, CONFIG.MAX_CONTEXT_LENGTH)
      : context;

    console.log('Sending to model with context length:', truncatedContext.length);
    
    // Prepare the prompt to get more detailed responses
    const prompt = `Given the following context, please provide a detailed and complete answer to the question. 
If the answer isn't in the context, say "I don't have that information."

Context: ${truncatedContext}

Question: ${question}

Detailed Answer:`;
    
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${CONFIG.CHAT_MODEL}`,
      {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          inputs: {
            question: question,
            context: truncatedContext
          },
          parameters: {
            max_answer_length: 500,  // Increased max answer length
            max_question_length: 100,
            handle_impossible_answer: false,
            temperature: CONFIG.TEMPERATURE,
            max_length: CONFIG.MAX_NEW_TOKENS
          },
          options: { 
            wait_for_model: true,
            use_cache: true
          }
        })
      }
    );

    if (!response.ok) {
      // If rate limited or server error, retry with exponential backoff
      if ((response.status === 429 || response.status >= 500) && retryCount < CONFIG.MAX_RETRIES) {
        const delay = CONFIG.RETRY_DELAY * Math.pow(2, retryCount);
        console.log(`Retrying in ${delay}ms... (${retryCount + 1}/${CONFIG.MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return generateResponse(question, context, apiKey, retryCount + 1);
      }
      
      const error = await response.text();
      console.error('Hugging Face API error:', error);
      throw new Error(`Hugging Face API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    
    // Handle the response from the Q&A model
    let answer = result.answer || "I don't have that information.";
    
    // Clean up the answer
    answer = answer.trim();
    
    // If the answer is too short or lacks detail, try to enhance it
    if ((answer.length < CONFIG.MIN_ANSWER_LENGTH || answer.split(' ').length < 5) && 
        result.score > CONFIG.CONFIDENCE_THRESHOLD) {
      
      // Try to find a more complete sentence containing the answer
      const sentences = truncatedContext.split(/[.!?]+/);
      const relevantSentences = sentences.filter(s => 
        s.toLowerCase().includes(answer.toLowerCase()) && 
        s.split(' ').length > 5
      );
      
      if (relevantSentences.length > 0) {
        // Take the most relevant sentence (first one found)
        answer = relevantSentences[0].trim();
        
        // If we still have space, add more context
        const remainingSpace = CONFIG.MAX_NEW_TOKENS - answer.length;
        if (remainingSpace > 50 && relevantSentences.length > 1) {
          answer += ' ' + relevantSentences[1].trim();
        }
      }
    }
    
    // Clean up the response
    return answer
      .replace(/<[^>]*>?/gm, '')  // Remove HTML tags
      .replace(/\n+/g, ' ')       // Replace multiple newlines with space
      .replace(/\s+/g, ' ')       // Replace multiple spaces with single space
      .trim();
      
  } catch (error) {
    console.error('Error in generateResponse:', error);
    // Fallback to a simple response that works with the current context
    if (context.toLowerCase().includes(question.toLowerCase())) {
      return context;
    }
    return "I don't have that information in my knowledge base.";
  }
}

// Helper function to create response
function createResponse(statusCode, body, headers = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  return {
    statusCode,
    headers: { ...defaultHeaders, ...headers },
    body: JSON.stringify(body)
  };
}

// Define question types and their related keywords
const QUESTION_TYPES = [
  {
    type: 'education',
    keywords: ['education', 'university', 'college', 'graduate', 'degree', 'bachelor', 'master', 'phd', 'study', 'studied', 'school'],
    sections: ['EDUCATION', 'DEGREE', 'UNIVERSITY', 'COLLEGE']
  },
  {
    type: 'experience',
    keywords: ['experience', 'work', 'job', 'role', 'position', 'company', 'worked', 'employer'],
    sections: ['EXPERIENCE', 'WORK', 'JOB', 'EMPLOYMENT']
  },
  {
    type: 'skills',
    keywords: ['skill', 'technology', 'programming', 'language', 'framework', 'tool', 'technical', 'tech stack'],
    sections: ['SKILLS', 'TECHNICAL', 'TECHNOLOGIES', 'PROGRAMMING', 'LANGUAGES']
  },
  {
    type: 'contact',
    keywords: ['contact', 'email', 'phone', 'number', 'reach', 'get in touch'],
    sections: ['CONTACT', 'EMAIL', 'PHONE', 'LINKEDIN']
  }
];

// Main handler function
exports.handler = async function (event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, {});
  }

  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      throw new Error('Hugging Face API key not configured. Please set HUGGINGFACE_API_KEY environment variable.');
    }

    // Parse request body
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return createResponse(400, { error: 'Invalid JSON body' });
    }

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const question = messages.filter(m => m.role === 'user').slice(-1)[0]?.content?.trim() || '';

    if (!question) {
      return createResponse(400, { error: 'No question provided' });
    }

    console.log('Processing question:', question);

    // Read knowledge base
    const knowledgePath = path.resolve(process.cwd(), 'public/data/knowledge_structured.txt');
    let content;
    try {
      content = fs.readFileSync(knowledgePath, 'utf8') || '';
    } catch (error) {
      console.error('Error reading knowledge base:', error);
      return createResponse(500, { error: 'Failed to read knowledge base' });
    }

    if (!content.trim()) {
      return createResponse(200, { 
        answer: "I don't have any information in my knowledge base yet."
      });
    }

    // Split into chunks and process
    const chunks = splitIntoChunks(content, CONFIG.MAX_CHUNK_LENGTH);
    if (chunks.length === 0) {
      return createResponse(500, { error: 'Failed to process knowledge base content' });
    }

    try {
      const lowerQuestion = question.toLowerCase();
      let selectedTexts = [];
      
      // Find matching question type
      const matchedType = QUESTION_TYPES.find(type => 
        type.keywords.some(keyword => lowerQuestion.includes(keyword))
      );
      
      if (matchedType) {
        // If we have a matching question type, find relevant sections
        const relevantChunks = chunks.filter(chunk => 
          matchedType.sections.some(section => 
            chunk.toUpperCase().includes(section)
          )
        );
        
        if (relevantChunks.length > 0) {
          selectedTexts = relevantChunks;
        }
      }
      
      // If no specific chunks found, use similarity search
      if (selectedTexts.length === 0) {
        const similarityScores = await Promise.all(
          chunks.map(chunk => 
            getEmbeddings([question, chunk], apiKey)
              .then(scores => ({
                text: chunk,
                score: Array.isArray(scores) && scores.length > 0 ? scores[0] : 0
              }))
              .catch(() => ({ text: chunk, score: 0 }))
          )
        );
        
        const relevantChunks = similarityScores
          .filter(chunk => chunk.score > 0.1)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map(c => ({
            text: c.text,
            score: c.score
          }));
        
        // Sort chunks by their position in the original document
        relevantChunks.sort((a, b) => 
          content.indexOf(a.text) - content.indexOf(b.text)
        );
        
        selectedTexts = relevantChunks.map(c => c.text);
      }

      if (selectedTexts.length === 0) {
        return createResponse(200, { 
          answer: "I don't have enough information to answer that question based on my knowledge base."
        });
      }

      // Generate and return response
      const answer = await generateResponse(question, selectedTexts.join('\n\n'), apiKey);
      return createResponse(200, { answer });
      
    } catch (error) {
      console.error('Error in processing pipeline:', error);
      
      // Fallback to simple response if embedding fails
      if (error.message.includes('Hugging Face API error')) {
        try {
          const answer = await generateResponse(question, content.substring(0, 2000), apiKey);
          return createResponse(200, { answer });
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Error in handler:', error);
    return createResponse(500, { 
      error: 'An error occurred while processing your request',
      details: process.env.NETLIFY_DEV ? error.message : undefined
    });
  }
};