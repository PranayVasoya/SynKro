"use client";

import { useState, useEffect, FormEvent, useRef } from "react"; // Added useRef
import { useRouter } from "next/navigation";
import { Users, ChevronRight, X, Send } from "lucide-react"; // Added Send and X
import { motion, AnimatePresence } from "framer-motion";
import axios, { AxiosError } from "axios"; // Added AxiosError
import { toast, Toaster } from "react-hot-toast"; // Added Toaster
import { Button } from "@/components/ui/button"; // Added Button
import Navbar from "@/components/Navbar"; // Using global Navbar

// --- Interfaces (Assume these are in @/interfaces or @/types) ---
interface Forum {
  _id: string; // Changed id to _id for consistency with MongoDB
  title: string;
  description: string;
  postsCount: number; // Renamed for clarity
  // lastActivity?: string; // Potentially useful
}

interface UserDataSimple { // For createdBy in Post
  _id: string;
  username: string;
}

interface Post {
  _id: string;
  title?: string; // Title might be optional for simple posts/replies
  content: string;
  createdBy: Partial<UserDataSimple> | null; // Allow partial or null
  createdAt: string; // ISO Date string
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}
// --- End Interfaces ---


// --- DiscussionSidebar Component ---
const DiscussionSidebar = ({
  forum,
  onClose,
}: {
  forum: Forum;
  onClose: () => void;
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState(""); // Renamed
  const [isPosting, setIsPosting] = useState(false);
  const postsEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    postsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchPosts = async () => {
      if (!forum._id) return;
      try {
        const response = await axios.get<{ data: Post[] }>(`/api/forums/${forum._id}/posts`);
        setPosts(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts");
      }
    };
    fetchPosts();
  }, [forum._id]);

  useEffect(scrollToBottom, [posts]);

  const handleSendPost = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setIsPosting(true);

    const optimisticPost: Post = { // Create a temporary optimistic post
        _id: `temp-${Date.now()}`,
        content: newPostContent,
        createdBy: { username: "You" }, // Placeholder
        createdAt: new Date().toISOString(),
    };
    setPosts(prev => [...prev, optimisticPost]);
    const postToSend = newPostContent;
    setNewPostContent("");

    try {
      const response = await axios.post<{ data: Post }>(`/api/forums/${forum._id}/posts`, {
        content: postToSend,
        // title: "Optional Post Title", // If your API expects a title
      });
      // Replace optimistic post with actual server response
      setPosts(prev => prev.map(p => p._id === optimisticPost._id ? response.data.data : p));
    } catch (error: unknown) {
      console.error("Error sending post:", error);
      let errorMessage = "Failed to send post.";
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data as ApiErrorResponse | undefined;
        errorMessage = serverError?.message || serverError?.error || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      // Revert optimistic update
      setPosts(prev => prev.filter(p => p._id !== optimisticPost._id));
      setNewPostContent(postToSend);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    // AnimatePresence for the sidebar itself is in the parent component
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      // Use card bg, consistent styling
      className="fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 bg-card shadow-2xl border-l border-border z-[100] flex flex-col" // Ensure it's above backdrop
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <h2 className="text-lg font-semibold text-foreground truncate pr-2">
          {forum.title}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Posts Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-background dark:bg-muted/20"> {/* Changed bg */}
        {posts.length === 0 && (
            <div className="text-center text-muted-foreground py-10">No posts in this forum yet. Be the first!</div>
        )}
        {posts.map((post) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-3 bg-card rounded-lg shadow-sm border border-border" // Each post is a card
          >
            {post.title && <h4 className="font-semibold text-foreground mb-1">{post.title}</h4>}
            <p className="text-sm text-foreground/90 whitespace-pre-wrap">{post.content}</p> {/* Preserve whitespace */}
            <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
              Posted by {post.createdBy?.username || "User"} on{" "}
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </div>
          </motion.div>
        ))}
        <div ref={postsEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendPost} className="p-4 border-t border-border bg-card flex-shrink-0">
        <div className="flex items-center space-x-2">
          <textarea // Changed to textarea for multi-line posts
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Share your thoughts..."
            // Use bg-input for consistency
            className="flex-1 p-2 border rounded-md bg-input text-foreground border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none h-12 leading-tight" // Adjusted h-12
            rows={1} // Start with 1 row, will expand if needed by CSS or JS
            disabled={isPosting}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { // Send on Enter, new line on Shift+Enter
                    e.preventDefault();
                    handleSendPost(e);
                }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 flex-shrink-0" // Consistent button size
            disabled={isPosting || !newPostContent.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
// --- End DiscussionSidebar Component ---


// --- Main Community Page ---
export default function CommunityPage() { // Renamed Community to CommunityPage
  const router = useRouter();
  // Using useState for forums if they might be fetched later
  const [forums, setForums] = useState<Forum[]>([]);
  const [isLoadingForums, setIsLoadingForums] = useState(true);

  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
  const [showDiscussionSidebar, setShowDiscussionSidebar] = useState(false); // Renamed for clarity

  useEffect(() => {
    const fetchForums = async () => {
      setIsLoadingForums(true);
      try {
        // Replace with your actual API endpoint for forums
        // const response = await axios.get<{data: Forum[]}>("/api/forums");
        // setForums(response.data.data || []);

        // Using mock data for now:
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate fetch
        setForums([
          { _id: "1", title: "General Discussion", description: "Talk about anything related to SynKro.", postsCount: 45 },
          { _id: "2", title: "Project Collaboration", description: "Find team members or join existing projects.", postsCount: 102 },
          { _id: "3", title: "Showcase & Feedback", description: "Share your projects and get feedback from the community.", postsCount: 23 },
          { _id: "4", title: "Tech Talk", description: "Discuss new technologies, programming languages, and tools.", postsCount: 15 },
          { _id: "5", title: "Q&A and Help", description: "Ask questions and help others solve their SynKro-related problems.", postsCount: 78 },
        ]);
      } catch (error) {
        console.error("Error fetching forums:", error);
        toast.error("Failed to load forums");
      } finally {
        setIsLoadingForums(false);
      }
    };
    fetchForums();
  }, []);


  const handleForumSelect = (forum: Forum) => {
    setSelectedForum(forum);
    setShowDiscussionSidebar(true);
  };

  const handleCloseDiscussion = () => {
    setShowDiscussionSidebar(false);
    // setSelectedForum(null); // Optionally reset selected forum
  };

  // Framer Motion Variants for the list
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 150, damping: 20 }},
  };

  return (
    // Consistent page background
    <div className="flex flex-col min-h-screen bg-muted dark:bg-background">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar /> {/* Global Navbar */}

      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 relative overflow-x-hidden"> {/* Allow sidebar to overflow */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          // Main container card
          className="w-full max-w-3xl p-6 sm:p-8 bg-card rounded-xl shadow-xl border border-border"
        >
          <div className="flex items-center justify-center mb-6 sm:mb-8 text-center">
            <Users className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Community Forums
            </h1>
          </div>

          {isLoadingForums ? (
             <div className="text-center text-muted-foreground py-10">Loading forums...</div>
          ) : forums.length === 0 ? (
             <div className="text-center text-muted-foreground py-10">No forums available at the moment.</div>
          ) :(
            <motion.div
              className="space-y-4" // Increased spacing
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {forums.map((forum) => (
                <motion.div
                  key={forum._id}
                  variants={listItemVariants}
                  whileHover={{ scale: 1.02, x: 4, backgroundColor: "hsl(var(--muted))" }} // Theme hover
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-between p-4 sm:p-5 bg-background dark:bg-muted/30 rounded-lg cursor-pointer border border-border shadow-sm transition-colors"
                  onClick={() => handleForumSelect(forum)}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 overflow-hidden">
                     <div className="flex-shrink-0 bg-primary/10 p-2.5 sm:p-3 rounded-full">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-semibold text-md sm:text-lg text-foreground truncate">
                        {forum.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {forum.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 ml-2">
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                      {forum.postsCount} Post{forum.postsCount !== 1 ? 's' : ''}
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Discussion Sidebar - AnimatePresence wraps the conditional rendering */}
        <AnimatePresence>
          {showDiscussionSidebar && selectedForum && (
            <>
            {/* Backdrop for mobile/tablet when sidebar is open */}
            <motion.div
              key="discussion-sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[90] md:hidden" // Only on smaller than md
              onClick={handleCloseDiscussion}
            />
            <DiscussionSidebar
              forum={selectedForum}
              onClose={handleCloseDiscussion}
            />
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}