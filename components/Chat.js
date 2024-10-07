import React, { useState, useEffect } from 'react';
import { ref, push, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAppContext } from '@/lib/AppContext';

export default function Chat({ roomId, sendMessage }) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const { user } = useAppContext();

  const chatRef = ref(database, `rooms/${roomId}/messages`);

  useEffect(() => {
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.values(data);
        setMessages(loadedMessages);
      }
    });

    return () => unsubscribe();
  }, [chatRef]);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageObj = {
        sender: user?.displayName, // You can customize the sender based on logged-in user
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      push(chatRef, messageObj);
      setNewMessage('');
    }
  };

  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender}: </strong>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="border-t border-gray-400 p-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="mt-2 w-full btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}