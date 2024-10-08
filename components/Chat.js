import React, { useState, useEffect } from 'react';
import { ref, push, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAppContext } from '@/lib/AppContext';

export default function Chat({ roomId }) {
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
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-lg rounded-lg overflow-hidden">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 transition-transform transform ${msg.sender === "You" ? "text-right" : "text-left"}`}>
            <div className={`inline-block px-3 py-2 rounded-lg ${msg.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
              <strong className="font-semibold">{msg.sender}: </strong>
              <span>{msg.content}</span>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="border-t border-gray-400 p-4 bg-gray-100 transition-colors duration-300 hover:bg-gray-200">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-black"
        />
        <button type="submit" className="mt-2 w-full py-2 bg-blue-500 text-white rounded-lg transition-transform duration-300 transform hover:scale-105">
          Send
        </button>
      </form>
    </div>
  );
  
}