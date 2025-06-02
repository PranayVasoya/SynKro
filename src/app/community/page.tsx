"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Forum {
  id: string;
  title: string;
  description: string;
  posts: number;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  createdBy: { username: string };
  createdAt: string;
}

const DiscussionSidebar = ({ forum, onClose }: { forum: Forum; onClose: () => void }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/forums/${forum.id}/posts`);
        setPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts");
      }
    };
    fetchPosts();
  }, [forum.id]);

  const handleSendPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      const response = await axios.post(`/api/forums/${forum.id}/posts`, { content: newPost });
      setPosts([...posts, response.data.data]);
      setNewPost("");
    } catch (error) {
      console.error("Error sending post:", error);
      toast.error("Failed to send post");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="fixed top-0 right-0 h-full w-1/3 bg-background dark:bg-card shadow-2xl border-l border-border z-50"
      >
        <div className="flex items-center p-4 border-b border-border">
          <motion.button
            whileHover={{ scale: 1.2, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="mr-4 text-muted-foreground hover:text-foreground"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </motion.button>
          <h2 className="text-xl font-semibold text-foreground">{forum.title} Discussion</h2>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-100px)] bg-muted dark:bg-muted/50">
          {posts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-foreground">
                <h4 className="font-semibold">{post.title}</h4>
                <p>{post.content}</p>
                <div className="text-xs text-muted-foreground">
                  Posted by {post.createdBy.username} at {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <form onSubmit={handleSendPost} className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary bg-muted text-foreground border-border"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-primary text-primary-foreground rounded-lg p-2 hover:bg-primary/90"
            >
              Send
            </motion.button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default function Community() {
  const router = useRouter();
  const [forums] = useState<Forum[]>([
    { id: "1", title: "General Discussion", description: "Talk about anything related to SynKro.", posts: 45 },
    { id: "2", title: "Project Help", description: "Get help with your projects.", posts: 23 },
    { id: "3", title: "Ideas & Feedback", description: "Share your ideas and feedback.", posts: 15 },
  ]);
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !showSidebar) {
        // No specific action needed
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showSidebar]);

  const handleForumSelect = (forum: Forum) => {
    setSelectedForum(forum);
    setShowSidebar(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-background dark:to-muted">
      <nav className="w-full bg-gradient-to-b from-blue-50 to-blue-100 dark:from-card dark:to-muted shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">SynKro</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard")}
            className="border border-border px-4 py-2 rounded-lg hover:bg-muted text-foreground"
          >
            ← Back
          </motion.button>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl p-6 bg-background dark:bg-card rounded-2xl shadow-2xl border border-border"
        >
          <h2 className="text-3xl font-bold text-foreground text-center mb-8 flex items-center justify-center">
            <Users className="w-8 h-8 mr-2 text-primary" /> Community Forums
          </h2>
          <div className="space-y-6">
            {forums.map((forum, idx) => (
              console.log(idx),
              <motion.div
                key={forum.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-6 bg-muted dark:bg-muted/50 rounded-xl cursor-pointer border border-border"
                onClick={() => handleForumSelect(forum)}
              >
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{forum.title}</h3>
                  <p className="text-muted-foreground">{forum.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">{forum.posts} Posts</span>
                  <ChevronRight className="w-6 h-6 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {showSidebar && selectedForum && (
          <DiscussionSidebar forum={selectedForum} onClose={() => setShowSidebar(false)} />
        )}
      </main>
    </div>
  );
}