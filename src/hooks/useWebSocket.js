import { useState, useEffect, useRef, useCallback } from 'react';

const useWebSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(0);
  const [messageHistory, setMessageHistory] = useState([]);
  
  const webSocketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  
  const {
    onOpen = () => {},
    onMessage = () => {},
    onClose = () => {},
    onError = () => {},
    shouldReconnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    protocols = []
  } = options;

  // Connection states
  const connectionStatus = {
    0: 'Connecting',
    1: 'Open',
    2: 'Closing', 
    3: 'Closed'
  };

  const connect = useCallback(() => {
    try {
      // For demo purposes, we'll simulate WebSocket behavior
      // In a real implementation, you would use: new WebSocket(url, protocols)
      
      const mockSocket = {
        readyState: 1,
        send: (data) => {
          console.log('Sending message:', data);
          
          // Simulate receiving echo or bot response
          setTimeout(() => {
            const message = {
              data: JSON.stringify({
                type: 'bot_response',
                content: 'This is a simulated WebSocket response',
                timestamp: new Date().toISOString(),
                id: Date.now()
              }),
              timestamp: new Date()
            };
            
            setLastMessage(message);
            setMessageHistory(prev => [...prev, message]);
            onMessage(message);
          }, 1000);
        },
        close: () => {
          setReadyState(3);
          onClose();
        }
      };
      
      webSocketRef.current = mockSocket;
      setSocket(mockSocket);
      setReadyState(1);
      reconnectAttemptsRef.current = 0;
      
      onOpen();
      
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setReadyState(3);
      onError(error);
      
      if (shouldReconnect && reconnectAttemptsRef.current < reconnectAttempts) {
        reconnectAttemptsRef.current++;
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectInterval);
      }
    }
  }, [url, protocols, onOpen, onMessage, onClose, onError, shouldReconnect, reconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }
    
    setSocket(null);
    setReadyState(3);
  }, []);

  const sendMessage = useCallback((message) => {
    if (webSocketRef.current && webSocketRef.current.readyState === 1) {
      try {
        const messageData = typeof message === 'string' ? message : JSON.stringify(message);
        webSocketRef.current.send(messageData);
        
        // Add to message history
        const messageObj = {
          data: messageData,
          timestamp: new Date(),
          type: 'sent'
        };
        setMessageHistory(prev => [...prev, messageObj]);
        
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const sendJsonMessage = useCallback((message) => {
    sendMessage(JSON.stringify(message));
  }, [sendMessage]);

  // Initialize connection
  useEffect(() => {
    if (url) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [url, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, [disconnect]);

  return {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    readyState,
    connectionStatus: connectionStatus[readyState],
    messageHistory,
    connect,
    disconnect
  };
};

export default useWebSocket;