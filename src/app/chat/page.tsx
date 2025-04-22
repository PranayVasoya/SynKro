"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, ChevronRight } from "lucide-react";

// ChatPopup Component (for individual chat layout similar to WhatsApp)
const ChatPopup = ({ chat, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How's the project going?", sender: "other", time: "10:00 AM" },
    { id: 2, text: "Great, working on the design now!", sender: "me", time: "10:02 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: "me", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setNewMessage("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md h-[80vh] flex flex-col rounded-lg shadow-2xl border border-gray-200">
        <div className="flex items-center p-4 border-b border-gray-200">
          <button onClick={onClose} className="mr-4 text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <h2 className="text-xl font-semibold">{chat.title}</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`mb-2 ${msg.sender === "me" ? "text-right" : "text-left"}`}>
              <div className={`inline-block p-2 rounded-lg ${msg.sender === "me" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                {msg.text}
              </div>
              <div className="text-xs text-gray-500">{msg.time}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Page() {
  const router = useRouter();
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([
    { id: 1, title: "Project 1", lastMessage: "Let's finalize the design.", time: "09:15 AM" },
    { id: 2, title: "Sample Title", lastMessage: "Meeting at 2 PM?", time: "Yesterday" },
    { id: 3, title: "Synchronizaton", lastMessage: "Code review done.", time: "2 days ago" },
  ]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowChatPopup(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowChatPopup(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <nav className="w-full bg-gray-200 shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-black">SynKro</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl p-6 bg-white rounded-2xl shadow-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Chat Rooms</h2>
          <div className="space-y-4">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => handleChatSelect(chat)}
              >
                <div>
                  <h3 className="font-semibold text-gray-700">{chat.title}</h3>
                  <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                </div>
                <div className="text-sm text-gray-400">{chat.time}</div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {showChatPopup && selectedChat && <ChatPopup chat={selectedChat} onClose={() => setShowChatPopup(false)} />}
      </main>
    </div>
  );
}
