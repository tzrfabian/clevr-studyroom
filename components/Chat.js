import React, { useState, useEffect, useRef } from "react";
import { ref, push, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { useAppContext } from "@/lib/AppContext";

export default function Chat({ roomId }) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const { user } = useAppContext();

  const chatRef = ref(database, `rooms/${roomId}/messages`);
  const chatContainerRef = useRef(null);
  const isAtBottomRef = useRef(true);

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

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      if (isAtBottomRef.current) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Event listener for scrolling to check if user is at the bottom
  const handleScroll = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      isAtBottomRef.current =
        chatContainer.scrollHeight - chatContainer.scrollTop <=
        chatContainer.clientHeight + 10; // Tolerance of 10 pixels
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageObj = {
        sender: user?.displayName,
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      push(chatRef, messageObj);
      setNewMessage("");
    }
  };

  return (
    <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col shadow-xl rounded-lg overflow-hidden">
      <div
        ref={chatContainerRef}
        className="flex-grow p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{ maxHeight: "500px" }}
        onScroll={handleScroll} // Attach the scroll event
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`transition-transform transform ${
              msg.sender === user?.displayName ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform ${
                msg.sender === user?.displayName
                  ? "bg-green-500 text-white animate-slide-right"
                  : "bg-gray-200 text-gray-800 animate-slide-left"
              }`}
            >
              <strong className="font-semibold">{msg.sender}: </strong>
              <span>{msg.content}</span>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-gray-300 p-4 bg-gray-100 transition-colors duration-300 hover:bg-gray-200 flex space-x-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-black"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-lg transition-transform duration-300 transform hover:scale-105"
        >
          Send
        </button>
      </form>
    </div>
  );
}
