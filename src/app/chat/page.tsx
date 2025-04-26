"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-background dark:bg-card w-full max-w-md h-[80vh] flex flex-col rounded-xl shadow-2xl border border-border transform transition-all duration-300 hover:shadow-3xl"
        >
          <div className="flex items-center p-4 border-b border-border">
            <motion.button
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="mr-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </motion.button>
            <h2 className="text-xl font-semibold text-foreground">{chat.title}</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-muted dark:bg-muted/50">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-2 ${msg.sender === "me" ? "text-right" : "text-left"}`}
              >
                <div className={`inline-block p-2 rounded-lg ${msg.sender === "me" ? "bg-primary text-primary-foreground" : "bg-gray-200 dark:bg-gray-600 text-foreground"}`}>
                  {msg.text}
                </div>
                <div className="text-xs text-muted-foreground">{msg.time}</div>
              </motion.div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary bg-muted text-foreground border-border transition-all duration-200 hover:border-primary"
              />
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary))" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-primary text-primary-foreground rounded-lg p-2 hover:bg-primary/90 transition-colors"
              >
                Send
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-background dark:to-muted">
      <nav className="w-full bg-gradient-to-b from-blue-50 to-blue-100 dark:from-card dark:to-muted shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">SynKro</h1>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/dashboard")}
              className="border border-border px-4 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
            >
              ← Back
            </motion.button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl p-6 bg-background dark:bg-card rounded-2xl shadow-2xl border border-border transform transition-all hover:scale-101 hover:shadow-3xl"
        >
          <h2 className="text-2xl font-bold text-foreground text-center mb-6">Chat Rooms</h2>
          <div className="space-y-4">
            {chats.map((chat, idx) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, backgroundColor: "hsl(var(--muted))" }}
                className="flex items-center justify-between p-4 bg-muted dark:bg-muted/50 rounded-lg cursor-pointer transition-colors border border-border"
                onClick={() => handleChatSelect(chat)}
              >
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">{chat.title}</h3>
                    <p className="text-sm text-muted-foreground">{chat.lastMessage}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-muted-foreground">{chat.time}</div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {showChatPopup && selectedChat && <ChatPopup chat={selectedChat} onClose={() => setShowChatPopup(false)} />}
      </main>
    </div>
  );
}