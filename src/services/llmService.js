// LLM Service for LegalBot India
// Supports multiple AI providers: OpenAI, Google Gemini, Anthropic Claude, Cohere, Hugging Face

class LLMService {
  constructor() {
    this.config = {
      // Primary LLM Provider Configuration
      provider: process.env.REACT_APP_LLM_PROVIDER || 'openai', // openai, gemini, claude, cohere, huggingface
      
      // API Configuration
      apiKeys: {
        openai: process.env.REACT_APP_OPENAI_API_KEY || '',
        gemini: process.env.REACT_APP_GEMINI_API_KEY || '',
        claude: process.env.REACT_APP_CLAUDE_API_KEY || '',
        cohere: process.env.REACT_APP_COHERE_API_KEY || '',
        huggingface: process.env.REACT_APP_HUGGINGFACE_API_KEY || ''
      },
      
      // API Endpoints
      endpoints: {
        openai: 'https://api.openai.com/v1/chat/completions',
        gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        claude: 'https://api.anthropic.com/v1/messages',
        cohere: 'https://api.cohere.ai/v1/generate',
        huggingface: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large'
      },
      
      // Model Configuration
      models: {
        openai: 'gpt-3.5-turbo',
        gemini: 'gemini-pro',
        claude: 'claude-3-sonnet-20240229',
        cohere: 'command-light',
        huggingface: 'microsoft/DialoGPT-large'
      },
      
      // Generation Parameters
      parameters: {
        temperature: 0.1, // Low temperature for legal accuracy
        maxTokens: 1500,
        topP: 0.9,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0
      }
    };
    
    // System prompts for legal context
    this.systemPrompts = {
      base: `You are a precise legal information system for Indian law. 
You have access to comprehensive legal databases: Constitution of India, Indian Penal Code (IPC), and Criminal Procedure Code (CrPC).

Instructions:  
- Provide EXACT, AUTHORITATIVE answers based on the legal datasets provided.
- Quote the relevant Article/Section word-for-word from the official text.
- Do NOT provide suggestions, alternatives, or additional recommendations.
- Do NOT say "you might also want to ask" or similar phrases.
- Answer ONLY what is asked - be precise and direct.
- Use simple, clear language while maintaining legal accuracy.
- Always end with: **"Disclaimer: This is only for information, not legal advice."**

Provide perfect, complete answers without any suggestions.`,
      
      constitution: `You are specializing in Constitutional law of India. Focus on Articles, Fundamental Rights, Directive Principles, and constitutional procedures.`,
      
      ipc: `You are specializing in Indian Penal Code. Focus on criminal offences, punishments, definitions, and legal provisions under IPC.`,
      
      crpc: `You are specializing in Criminal Procedure Code. Focus on procedures for arrest, bail, FIR, investigation, trial, and evidence rules.`
    };
  }

  // Main method to get AI response
  async getResponse(query, context = null) {
    try {
      const provider = this.config.provider;
      const apiKey = this.config.apiKeys[provider];
      
      if (!apiKey) {
        console.warn(`No API key configured for provider: ${provider}`);
        return this.getFallbackResponse(query, context);
      }

      switch (provider) {
        case 'openai':
          return await this.callOpenAI(query, context);
        case 'gemini':
          return await this.callGemini(query, context);
        case 'claude':
          return await this.callClaude(query, context);
        case 'cohere':
          return await this.callCohere(query, context);
        case 'huggingface':
          return await this.callHuggingFace(query, context);
        default:
          return this.getFallbackResponse(query, context);
      }
    } catch (error) {
      console.error('LLM Service Error:', error);
      return this.getErrorResponse(query, error);
    }
  }

  // OpenAI API Integration
  async callOpenAI(query, context) {
    const messages = [
      { role: 'system', content: this.getSystemPrompt(context) },
      { role: 'user', content: query }
    ];

    if (context && context.retrievedContent) {
      messages.splice(1, 0, {
        role: 'system',
        content: `Relevant legal information: ${context.retrievedContent}`
      });
    }

    const response = await fetch(this.config.endpoints.openai, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKeys.openai}`
      },
      body: JSON.stringify({
        model: this.config.models.openai,
        messages: messages,
        temperature: this.config.parameters.temperature,
        max_tokens: this.config.parameters.maxTokens,
        top_p: this.config.parameters.topP,
        frequency_penalty: this.config.parameters.frequencyPenalty,
        presence_penalty: this.config.parameters.presencePenalty
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      response: data.choices[0].message.content,
      provider: 'openai',
      model: this.config.models.openai,
      usage: data.usage
    };
  }

  // Google Gemini API Integration
  async callGemini(query, context) {
    const prompt = this.buildPrompt(query, context);
    
    const response = await fetch(`${this.config.endpoints.gemini}?key=${this.config.apiKeys.gemini}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: this.config.parameters.temperature,
          maxOutputTokens: this.config.parameters.maxTokens,
          topP: this.config.parameters.topP
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      response: data.candidates[0].content.parts[0].text,
      provider: 'gemini',
      model: this.config.models.gemini
    };
  }

  // Anthropic Claude API Integration
  async callClaude(query, context) {
    const prompt = this.buildPrompt(query, context);
    
    const response = await fetch(this.config.endpoints.claude, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKeys.claude}`,
        'x-api-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.models.claude,
        max_tokens: this.config.parameters.maxTokens,
        temperature: this.config.parameters.temperature,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      response: data.content[0].text,
      provider: 'claude',
      model: this.config.models.claude
    };
  }

  // Cohere API Integration
  async callCohere(query, context) {
    const prompt = this.buildPrompt(query, context);
    
    const response = await fetch(this.config.endpoints.cohere, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKeys.cohere}`
      },
      body: JSON.stringify({
        model: this.config.models.cohere,
        prompt: prompt,
        max_tokens: this.config.parameters.maxTokens,
        temperature: this.config.parameters.temperature,
        p: this.config.parameters.topP
      })
    });

    if (!response.ok) {
      throw new Error(`Cohere API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      response: data.generations[0].text,
      provider: 'cohere',
      model: this.config.models.cohere
    };
  }

  // Hugging Face API Integration
  async callHuggingFace(query, context) {
    const prompt = this.buildPrompt(query, context);
    
    const response = await fetch(this.config.endpoints.huggingface, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKeys.huggingface}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: this.config.parameters.maxTokens,
          temperature: this.config.parameters.temperature,
          do_sample: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      response: data[0].generated_text,
      provider: 'huggingface',
      model: this.config.models.huggingface
    };
  }

  // Build prompt with context
  buildPrompt(query, context) {
    let prompt = this.getSystemPrompt(context) + '\n\n';
    
    if (context && context.retrievedContent) {
      prompt += `Relevant legal information: ${context.retrievedContent}\n\n`;
    }
    
    prompt += `User Query: ${query}\n\nResponse:`;
    return prompt;
  }

  // Get appropriate system prompt
  getSystemPrompt(context) {
    if (context && context.dataset) {
      return this.systemPrompts[context.dataset] || this.systemPrompts.base;
    }
    return this.systemPrompts.base;
  }

  // Fallback response when no API is available
  getFallbackResponse(query, context) {
    const fallbackResponses = {
      'fundamental rights': 'Fundamental Rights are guaranteed under Articles 12-35 of the Indian Constitution. These include Right to Equality (Articles 14-18), Right to Freedom (Articles 19-22), Right against Exploitation (Articles 23-24), Right to Freedom of Religion (Articles 25-28), Cultural and Educational Rights (Articles 29-30), and Right to Constitutional Remedies (Article 32). **Disclaimer: This is only for information, not legal advice.**',
      
      'article 21': 'Article 21 of the Indian Constitution states: "No person shall be deprived of his life or personal liberty except according to procedure established by law." This fundamental right has been expanded by the Supreme Court to include right to livelihood, clean environment, privacy, speedy trial, and dignified life. **Disclaimer: This is only for information, not legal advice.**',
      
      'fir': 'FIR (First Information Report) is filed under Section 154 of CrPC. Steps: 1) Go to police station, 2) Give information orally or in writing, 3) Police will write it down if oral, 4) Read and sign the FIR, 5) Get a copy, 6) FIR number will be given for reference. Police must register FIR for cognizable offences. **Disclaimer: This is only for information, not legal advice.**',
      
      'bail': 'Bail provisions are under Sections 436-450 of CrPC. For bailable offences, bail is a right. For non-bailable offences, it is discretionary. Anticipatory bail can be sought under Section 438 from High Court or Sessions Court. Factors considered: nature of offence, evidence, flight risk, influence on witnesses. **Disclaimer: This is only for information, not legal advice.**'
    };

    const queryLower = query.toLowerCase();
    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (queryLower.includes(key)) {
        return {
          response: response,
          provider: 'fallback',
          model: 'rule-based'
        };
      }
    }

    return {
      response: 'I understand you have a legal query. While I can provide general information about Indian law, for specific legal advice tailored to your situation, I recommend consulting with a qualified legal advocate. Please try rephrasing your question or ask about specific legal topics like Fundamental Rights, IPC sections, or CrPC procedures. **Disclaimer: This is only for information, not legal advice.**',
      provider: 'fallback',
      model: 'default'
    };
  }

  // Error response
  getErrorResponse(query, error) {
    return {
      response: 'I apologize, but I encountered a technical issue while processing your query. Please try again later or contact support if the problem persists. For immediate legal assistance, please consult with a qualified advocate. **Disclaimer: This is only for information, not legal advice.**',
      provider: 'error',
      model: 'none',
      error: error.message
    };
  }

  // Update API configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  // Check if service is properly configured
  isConfigured() {
    const provider = this.config.provider;
    return this.config.apiKeys[provider] && this.config.apiKeys[provider].length > 0;
  }

  // Get current configuration status
  getStatus() {
    return {
      provider: this.config.provider,
      configured: this.isConfigured(),
      model: this.config.models[this.config.provider],
      endpoint: this.config.endpoints[this.config.provider]
    };
  }
}

// Export singleton instance
export default new LLMService();