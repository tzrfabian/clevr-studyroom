import React, { useState } from 'react';

export default function Chat({ messages, sendMessage }) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
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
      <form onSubmit={handleSend} className="border-t border-gray-200 p-4">
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