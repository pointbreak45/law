import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import llmService from '../services/llmService';
import ragService from '../services/ragService';
import advancedRagService from '../services/advancedRagService';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! This is a light theme session. I provide general information on Indian law and the Constitution. For legal advice, please contact a qualified advocate.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    "Steps to file a police complaint (FIR)?",
    "What is Article 21 and its scope?",
    "Bailable vs non-bailable offences?",
    "How to draft an RTI request?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateBotResponse = async (userMessage) => {
    setIsTyping(true);
    
    try {
      // Step 1: Use Advanced RAG for precise document retrieval
      const retrievedDocs = await advancedRagService.retrievePrecise(userMessage, 2);
      
      let botResponse;
      
      // Step 2: If exact matches found, use direct answer from RAG
      if (retrievedDocs.length > 0 && retrievedDocs[0].matchType === 'exact') {
        botResponse = advancedRagService.generatePerfectAnswer(retrievedDocs, userMessage);
      } else {
        // Step 3: Use LLM with enhanced context for complex queries
        const context = advancedRagService.getEnhancedContext(retrievedDocs);
        const llmResponse = await llmService.getResponse(userMessage, context);
        botResponse = llmResponse.response;
      }
      
      const newBotMessage = {
        id: Date.now(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        sources: retrievedDocs.map(doc => ({
          id: doc.id,
          title: doc.title,
          dataset: doc.dataset,
          matchType: doc.matchType
        })),
        isExactMatch: retrievedDocs.length > 0 && retrievedDocs[0].matchType === 'exact'
      };

      setMessages(prev => [...prev, newBotMessage]);
      
    } catch (error) {
      console.error('Error getting bot response:', error);
      
      // Try fallback with basic RAG
      try {
        const fallbackDocs = await ragService.retrieve(userMessage, 1);
        const fallbackResponse = fallbackDocs.length > 0 ? 
          `Based on ${fallbackDocs[0].id}: ${fallbackDocs[0].content}\n\n**Disclaimer: This is only for information, not legal advice.**` :
          'I can provide information on Indian Constitutional law, Indian Penal Code, and Criminal Procedure Code. Please ask about specific Articles, Sections, or legal procedures. **Disclaimer: This is only for information, not legal advice.**';
        
        const fallbackMessage = {
          id: Date.now(),
          type: 'bot',
          content: fallbackResponse,
          timestamp: new Date(),
          isFallback: true
        };
        
        setMessages(prev => [...prev, fallbackMessage]);
        
      } catch (fallbackError) {
        const errorMessage = {
          id: Date.now(),
          type: 'bot',
          content: 'I apologize, but I encountered an issue while processing your query. Please try again or rephrase your question. For immediate legal assistance, please consult with a qualified advocate. **Disclaimer: This is only for information, not legal advice.**',
          timestamp: new Date(),
          isError: true
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response
    await simulateBotResponse(message);
  };

  const handlePromptClick = (prompt) => {
    handleSendMessage(prompt);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logo}>⚖️</div>
          <span style={styles.brandName}>LegalBot India</span>
        </div>
        <div style={styles.headerLinks}>
          <a href="/about" style={styles.headerLink}>About</a>
          <a href="/contact" style={styles.headerLink}>Contact</a>
          <Link to="/profile" style={styles.loginButton}>🔐 Login</Link>
        </div>
      </div>

      <div style={styles.content}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>Navigation</div>
          <nav style={styles.nav}>
            <div style={styles.navItemActive}>
              💬 Chatbot
            </div>
            <Link to="/profile" style={styles.navItem}>
              👤 User
            </Link>
            <a href="/contact" style={styles.navItem}>
              ✉️ Contact
            </a>
          </nav>

          <div style={styles.sidebarHeader}>Resources</div>
          <nav style={styles.nav}>
            <a href="/constitution" style={styles.navItem}>
              📜 Constitution
            </a>
            <a href="/acts-codes" style={styles.navItem}>
              📚 Acts & Codes
            </a>
          </nav>
        </div>

        {/* Chat Area */}
        <div style={styles.chatContainer}>
          {/* Chat Header */}
          <div style={styles.chatHeader}>
            <div style={styles.sessionInfo}>
              <h2 style={styles.sessionTitle}>Start a New Conversation</h2>
              <p style={styles.sessionSubtitle}>
                Light mode enabled. Informational only — not legal advice.
              </p>
            </div>
            <div style={styles.newSessionButton}>
              🔄 New session
            </div>
          </div>

          <div style={styles.chatContent}>
            {/* Disclaimer */}
            <div style={styles.disclaimer}>
              <strong>Disclaimer:</strong> Responses are for education. Consult a licensed advocate for legal advice.
            </div>

            {/* Main Chat Area */}
            <div style={styles.chatArea}>
              {/* Messages */}
              <div style={styles.messagesContainer}>
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    style={{
                      ...styles.messageWrapper,
                      ...(message.type === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper)
                    }}
                  >
                    <div 
                      style={{
                        ...styles.message,
                        ...(message.type === 'user' ? styles.userMessage : styles.botMessage)
                      }}
                    >
                      {message.type === 'bot' && (
                        <div style={styles.botAvatar}>
                          <img 
                            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23d4a574'/%3E%3C/svg%3E" 
                            alt="Bot" 
                            style={styles.avatarImage}
                          />
                        </div>
                      )}
                      <div style={styles.messageContent}>
                        <div style={styles.messageText}>
                          {message.content}
                        </div>
                        <div style={styles.messageTime}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                      {message.type === 'user' && (
                        <div style={styles.userAvatar}>
                          <img 
                            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23c084fc'/%3E%3C/svg%3E"
                            alt="User" 
                            style={styles.avatarImage}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div style={styles.messageWrapper}>
                    <div style={styles.typingMessage}>
                      <div style={styles.botAvatar}>
                        <img 
                          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23d4a574'/%3E%3C/svg%3E" 
                          alt="Bot" 
                          style={styles.avatarImage}
                        />
                      </div>
                      <div style={styles.typingIndicator}>
                        <div style={styles.typingDots}>
                          <span style={styles.dot}>•</span>
                          <span style={styles.dot}>•</span>
                          <span style={styles.dot}>•</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Prompts */}
              {messages.length <= 1 && (
                <div style={styles.suggestedPrompts}>
                  <h3 style={styles.promptsTitle}>Suggested prompts</h3>
                  <div style={styles.promptsList}>
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handlePromptClick(prompt)}
                        style={styles.promptButton}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div style={styles.inputArea}>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your question..."
                  style={styles.messageInput}
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isTyping || !inputMessage.trim()}
                  style={styles.sendButton}
                >
                  🔼 Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={styles.rightPanel}>
          <div style={styles.newChatHeader}>
            <h3 style={styles.newChatTitle}>New Chat</h3>
            <p style={styles.modelInfo}>Model: India Legal Knowledge</p>
          </div>

          <div style={styles.quickResponse}>
            <p>Thanks! Can you explain Fundamental Rights briefly?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  logo: {
    fontSize: '1.5rem'
  },
  brandName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  headerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  headerLink: {
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '0.875rem'
  },
  loginButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  content: {
    flex: 1,
    display: 'flex',
    height: 'calc(100vh - 80px)'
  },
  sidebar: {
    width: '240px',
    backgroundColor: 'white',
    borderRight: '1px solid #e5e7eb',
    padding: '2rem 0',
    display: 'flex',
    flexDirection: 'column'
  },
  sidebarHeader: {
    padding: '0 1.5rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '1rem'
  },
  nav: {
    marginBottom: '2rem'
  },
  navItem: {
    display: 'block',
    padding: '0.75rem 1.5rem',
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s'
  },
  navItemActive: {
    display: 'block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb'
  },
  sessionInfo: {
    flex: 1
  },
  sessionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.25rem'
  },
  sessionSubtitle: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  newSessionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    color: '#374151',
    cursor: 'pointer'
  },
  chatContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  disclaimer: {
    backgroundColor: '#fef3cd',
    color: '#92400e',
    padding: '0.75rem 1.5rem',
    fontSize: '0.875rem',
    borderBottom: '1px solid #e5e7eb'
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  messagesContainer: {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  messageWrapper: {
    display: 'flex',
    maxWidth: '100%'
  },
  userMessageWrapper: {
    justifyContent: 'flex-end'
  },
  botMessageWrapper: {
    justifyContent: 'flex-start'
  },
  message: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    maxWidth: '80%'
  },
  userMessage: {
    flexDirection: 'row-reverse'
  },
  botMessage: {
    flexDirection: 'row'
  },
  botAvatar: {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0
  },
  userAvatar: {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  messageContent: {
    flex: 1
  },
  messageText: {
    padding: '0.75rem 1rem',
    borderRadius: '1rem',
    fontSize: '0.875rem',
    lineHeight: '1.5'
  },
  messageTime: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.25rem',
    textAlign: 'right'
  },
  typingMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    maxWidth: '80%'
  },
  typingIndicator: {
    backgroundColor: '#f3f4f6',
    borderRadius: '1rem',
    padding: '0.75rem 1rem'
  },
  typingDots: {
    display: 'flex',
    gap: '0.25rem'
  },
  dot: {
    fontSize: '1.25rem',
    color: '#6b7280',
    animation: 'typing 1.5s infinite'
  },
  suggestedPrompts: {
    padding: '1.5rem',
    borderTop: '1px solid #e5e7eb'
  },
  promptsTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1rem'
  },
  promptsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  promptButton: {
    textAlign: 'left',
    padding: '0.75rem 1rem',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    color: '#374151',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  inputArea: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #e5e7eb'
  },
  inputContainer: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  },
  messageInput: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '1.5rem',
    fontSize: '0.875rem',
    outline: 'none',
    backgroundColor: '#f9fafb'
  },
  sendButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '1.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  rightPanel: {
    width: '320px',
    backgroundColor: 'white',
    borderLeft: '1px solid #e5e7eb',
    padding: '2rem'
  },
  newChatHeader: {
    marginBottom: '2rem'
  },
  newChatTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  modelInfo: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  quickResponse: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '1rem',
    borderRadius: '1rem',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    cursor: 'pointer'
  }
};

export default Chatbot;