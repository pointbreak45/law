import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, CheckCircle, Clock, BookOpen, Scale } from 'lucide-react';
import ragService, { SearchResult, QueryResponse, HealthResponse } from './ragService';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  results?: SearchResult[];
  processing_time?: number;
  isLoading?: boolean;
  error?: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to Indian Law Assistant! I can help you find information about Indian legal documents including the Constitution, IPC, CrPC, and Contract Act. Ask me any legal question.',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<HealthResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested queries for quick access
  const suggestedQueries = ragService.getSuggestedQueries();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check backend health on component mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const health = await ragService.getHealthStatus();
      setBackendStatus(health);
    } catch (error) {
      console.error('Backend health check failed:', error);
      setBackendStatus({
        status: 'unhealthy',
        message: 'Backend not available',
        vector_store_ready: false,
        total_documents: 0
      });
    }
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: 'Searching legal documents...',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response: QueryResponse = await ragService.queryLawDataset(message.trim(), 3, true);
      
      let botContent = '';
      if (response.results.length > 0) {
        const topResult = response.results[0];
        botContent = `**${topResult.title}** (${topResult.section})\\n\\n${topResult.text}`;
        
        if (response.results.length > 1) {
          botContent += '\\n\\n**Related Sections:**\\n';
          response.results.slice(1).forEach((result, index) => {
            botContent += `${index + 2}. **${result.title}** (${result.section})\\n`;
          });
        }
      } else {
        botContent = "I couldn't find specific information about your query in the legal documents. Please try rephrasing your question or ask about specific articles, sections, or legal concepts.";
      }

      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'bot',
        content: botContent,
        timestamp: new Date(),
        results: response.results,
        processing_time: response.processing_time,
      };

      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = botMessage; // Replace loading message
        return newMessages;
      });

    } catch (error) {
      console.error('Error querying legal documents:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error while searching for legal information. Please make sure the backend server is running and try again.',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = errorMessage; // Replace loading message
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuery = (query: string) => {
    setInputMessage(query);
    handleSendMessage(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageContent = (content: string) => {
    return content
      .split('\\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <strong key={index}>{line.slice(2, -2)}</strong>;
        }
        return <span key={index}>{line}</span>;
      })
      .reduce<React.ReactNode[]>((acc, curr, index) => {
        if (index > 0) acc.push(<br key={`br-${index}`} />);
        acc.push(curr);
        return acc;
      }, []);
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 ${isUser ? 'ml-2' : 'mr-2'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? 'bg-blue-500' : isSystem ? 'bg-gray-500' : 'bg-green-500'
            }`}>
              {isUser ? (
                <User size={16} className="text-white" />
              ) : isSystem ? (
                <AlertCircle size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>
          </div>

          {/* Message Content */}
          <div
            className={`rounded-lg px-4 py-2 ${
              isUser 
                ? 'bg-blue-500 text-white' 
                : isSystem
                ? 'bg-gray-100 text-gray-800 border border-gray-200'
                : 'bg-white text-gray-800 shadow-sm border border-gray-200'
            }`}
          >
            <div className="text-sm">
              {formatMessageContent(message.content)}
            </div>

            {/* Loading indicator */}
            {message.isLoading && (
              <div className="flex items-center mt-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                <span className="text-xs">Searching...</span>
              </div>
            )}

            {/* Error indicator */}
            {message.error && (
              <div className="mt-2 text-red-500 text-xs">
                <AlertCircle size={12} className="inline mr-1" />
                Error: {message.error}
              </div>
            )}

            {/* Results metadata */}
            {message.results && message.results.length > 0 && (
              <div className="mt-3 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <BookOpen size={12} className="mr-1" />
                    {message.results.length} result{message.results.length !== 1 ? 's' : ''}
                  </span>
                  {message.processing_time && (
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {message.processing_time.toFixed(2)}s
                    </span>
                  )}
                </div>

                {/* Results preview */}
                <div className="mt-2 space-y-1">
                  {message.results.slice(0, 3).map((result, index) => {
                    const typeInfo = ragService.getDocumentTypeInfo(result.type);
                    return (
                      <div
                        key={index}
                        className="flex items-center text-xs p-2 bg-gray-50 rounded"
                      >
                        <span className="mr-2" style={{ color: typeInfo.color }}>
                          {typeInfo.icon}
                        </span>
                        <span className="font-medium">{result.section}</span>
                        <span className="mx-1">•</span>
                        <span className="text-gray-600 truncate">{result.title}</span>
                        {result.score && (
                          <span className="ml-auto text-gray-400">
                            {(result.score * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className={`text-xs mt-2 ${
              isUser ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Scale className="text-blue-600 mr-3" size={24} />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Indian Law Assistant
              </h1>
              <p className="text-sm text-gray-600">
                AI-powered legal document search
              </p>
            </div>
          </div>

          {/* Backend Status */}
          <div className="flex items-center">
            {backendStatus ? (
              <div className={`flex items-center px-3 py-1 rounded-full text-xs ${
                backendStatus.vector_store_ready 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {backendStatus.vector_store_ready ? (
                  <CheckCircle size={12} className="mr-1" />
                ) : (
                  <AlertCircle size={12} className="mr-1" />
                )}
                {backendStatus.vector_store_ready 
                  ? `Ready • ${backendStatus.total_documents} docs`
                  : 'Backend Unavailable'
                }
              </div>
            ) : (
              <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                Checking...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(renderMessage)}

        {/* Suggested Queries */}
        {messages.length === 1 && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Try asking about:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQueries.slice(0, 6).map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuery(query)}
                  className="text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
                  disabled={isLoading}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about Indian law, constitution, IPC, CrPC..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
          >
            <Send size={20} />
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          This information is for educational purposes only and does not constitute legal advice.
          Consult with a qualified lawyer for legal guidance.
        </div>
      </div>
    </div>
  );
};

export default Chatbot;