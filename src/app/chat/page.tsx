"use client";

import { useState, useEffect, useRef, FormEvent } from "react"; // Added FormEvent
import { useRouter } from "next/navigation";
import { MessageCircle, ChevronRight, X, Send } from "lucide-react"; // Added Send and X
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios"; // Import AxiosError
import { toast, Toaster } from "react-hot-toast"; // Import Toaster
import { Button } from "@/components/ui/button"; // Import Button
import type { Variants } from "framer-motion";

// --- Interfaces (Assume these are in @/interfaces or @/types) ---
interface UserData { // Simple UserData for sender context
  _id: string;
  username: string;
}

interface Chatroom {
  _id: string;
  title: string;
  lastMessage?: string;
  time?: string; // Consider making this a Date string for consistent formatting
  // participants?: UserData[]; // Potentially useful
}

interface Message {
  _id?: string; // Messages from DB will have _id
  text: string;
  sender: "me" | string; // "me" or sender's username/ID
  senderId?: string; // Actual ID of the sender if not "me"
  time: string; // ISO Date string preferably
}

// --- End Interfaces ---


// --- ChatPopup Component ---
const ChatPopup = ({
  chat,
  currentUser, // Pass current user for styling "me" messages
  onClose,
}: {
  chat: Chatroom;
  currentUser: Partial<UserData>;
  onClose: () => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<{data: Message[]}>(`/api/chatrooms/${chat._id}/messages`);
        setMessages(response.data.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      }
    };
    if (chat._id) fetchMessages();
  }, [chat._id]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser._id) return;
    setIsSending(true);

    // Optimistic update
    const optimisticMessage: Message = {
      _id: `temp-${Date.now()}`,
      text: newMessage,
      sender: "me", // Or use currentUser._id and compare later
      senderId: currentUser._id,
      time: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMessage]);
    const messageToSend = newMessage;
    setNewMessage("");

    try {
      const response = await axios.post<{data: Message}>(`/api/chatrooms/${chat._id}/messages`, {
        text: messageToSend,
        // senderId: currentUser._id, // Backend should know sender from auth
      });
      // Replace optimistic message with actual message from server
      setMessages(prev => prev.map(msg => msg._id === optimisticMessage._id ? response.data.data : msg));
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      // Revert optimistic update
      setMessages(prev => prev.filter(msg => msg._id !== optimisticMessage._id));
      setNewMessage(messageToSend); // Put message back in input
    } finally {
      setIsSending(false);
    }
  };

  return (
    // AnimatePresence for modal itself is usually in the parent component
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4" // Higher z-index
      onClick={onClose} // Close on backdrop click
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-card w-full max-w-lg h-[85vh] md:h-[75vh] flex flex-col rounded-lg shadow-xl border border-border" // Use card bg
        onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{chat.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-background dark:bg-muted/20"> {/* Changed bg */}
          {messages.map((msg, index) => (
            <motion.div
              key={msg._id || `msg-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`flex ${
                msg.senderId === currentUser._id || msg.sender === "me" // Check against currentUser._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div className="max-w-[70%]">
                <div
                  className={`inline-block px-3 py-2 rounded-lg shadow-sm ${
                    msg.senderId === currentUser._id || msg.sender === "me"
                      ? "bg-primary text-primary-foreground rounded-br-none" // "My" message
                      : "bg-muted text-foreground rounded-bl-none" // Others' messages
                  }`}
                >
                  {msg.text}
                </div>
                <div
                  className={`text-xs text-muted-foreground mt-1 ${
                    msg.senderId === currentUser._id || msg.sender === "me" ? "text-right" : "text-left"
                  }`}
                >
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-card">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              // Use bg-input for contrast, consistent theming
              className="flex-1 p-2 border rounded-md bg-input text-foreground border-border focus:outline-none focus:ring-2 focus:ring-primary h-10"
              disabled={isSending}
            />
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 flex-shrink-0" // Ensure button size is consistent
              disabled={isSending || !newMessage.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
// --- End ChatPopup Component ---


// --- Main Chat Page ---
export default function ChatPage() { // Renamed Page to ChatPage
  const router = useRouter();
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chatroom | null>(null);
  const [chats, setChats] = useState<Chatroom[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state for chatrooms

  // Simulate current user - replace with actual user from context or auth
  const [currentUser, setCurrentUser] = useState<Partial<UserData>>({});

  useEffect(() => {
    // Simulate fetching current user
    const fetchCurrentUser = async () => {
        try {
            // In a real app, this would come from an auth context or /api/users/me
            const res = await axios.get<{ data: UserData }>("/api/users/me");
            if (res.data?.data) {
                setCurrentUser(res.data.data);
            } else {
                // Handle case where user is not fetched (e.g., not authenticated)
                router.push('/signin'); // Example redirect
            }
        } catch (error) {
            console.error("Failed to fetch current user", error);
            // router.push('/signin'); // Example redirect
        }
    };
    fetchCurrentUser();

    const fetchChatrooms = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<{ data: Chatroom[] }>("/api/chatrooms");
        setChats(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching chatrooms:", error);
        toast.error("Failed to load chatrooms");
      } finally {
        setIsLoading(false);
      }
    };
    fetchChatrooms();

    // No need for resize handler if ChatPopup is a full modal
  }, [router]);

  const handleChatSelect = (chat: Chatroom) => {
    if (!currentUser._id) {
        toast.error("User information not available. Please log in.");
        return;
    }
    setSelectedChat(chat);
    setShowChatPopup(true);
  };

  // Framer Motion Variants for the list
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const, // ✅ Fix: explicit string literal
      stiffness: 150,
      damping: 20,
    },
  },
};


  return (
    // Use consistent page background
    <div className="flex flex-col min-h-screen bg-muted dark:bg-background">
      <Toaster position="top-center" reverseOrder={false} />

      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8"> {/* Changed justify-center to justify-start */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          // Main container styling
          className="w-full max-w-2xl p-6 sm:p-8 bg-card rounded-xl shadow-xl border border-border"
        >
          <div className="flex items-center justify-center mb-6 sm:mb-8 text-center">
            <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Chat Rooms
            </h1>
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground py-10">Loading chatrooms...</div>
          ) : chats.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">No chat rooms available yet.</div>
          ) : (
            <motion.div
              className="space-y-3"
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {chats.map((chat) => (
                <motion.div
                  key={chat._id}
                  variants={listItemVariants}
                  whileHover={{ scale: 1.03, x: 5, backgroundColor: "hsl(var(--muted))" }} // Use theme variable for hover
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-between p-4 bg-background dark:bg-muted/30 rounded-lg cursor-pointer border border-border shadow-sm transition-colors"
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="flex items-center space-x-3 overflow-hidden"> {/* Added overflow-hidden */}
                    <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                        <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="overflow-hidden"> {/* For text truncation */}
                      <h3 className="font-semibold text-foreground truncate">{chat.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-2"> {/* Added ml-2 */}
                    <div className="text-xs text-muted-foreground whitespace-nowrap"> {/* Prevent time from wrapping */}
                      {chat.time
                        ? new Date(chat.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Chat Popup - AnimatePresence wraps the conditional rendering */}
        <AnimatePresence>
        {showChatPopup && selectedChat && currentUser._id && ( // Ensure currentUser._id exists
          <ChatPopup
            chat={selectedChat}
            currentUser={currentUser}
            onClose={() => setShowChatPopup(false)}
          />
        )}
        </AnimatePresence>
      </main>
    </div>
  );
}