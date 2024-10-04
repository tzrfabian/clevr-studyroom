import { useDaily } from '@daily-co/daily-react-hooks';
import { useState, useCallback, useEffect } from 'react';

export function useChat() {
  const daily = useDaily();
  const [messages, setMessages] = useState([]);

  const sendMessage = useCallback((message) => {
    daily.sendAppMessage({ message }, '*');
    setMessages(prev => [...prev, { sender: 'You', content: message, timestamp: new Date() }]);
  }, [daily]);

  useEffect(() => {
    if (!daily) return;

    const handleAppMessage = (event) => {
      const { message } = event.data;
      setMessages(prev => [...prev, { sender: event.fromId, content: message, timestamp: new Date() }]);
    };

    daily.on('app-message', handleAppMessage);

    return () => {
      daily.off('app-message', handleAppMessage);
    };
  }, [daily]);

  return {
    messages,
    sendMessage
  };
}