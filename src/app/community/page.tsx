"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

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
  createdAt: Date;
  project?: string | null;
}

interface JoinRequest {
  _id: string;
  status: "pending" | "accepted" | "rejected";
}

const DiscussionSidebar = ({
  forumId,
  onPostCreated,
}: {
  forumId: string;
  onPostCreated: () => void;
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [joinRequestStatus, setJoinRequestStatus] = useState<{ [projectId: string]: JoinRequest | null }>({});

  useEffect(() => {
    fetchPosts();
    if (posts.length > 0) {
      checkJoinRequestStatus();
    }
  }, [forumId, posts.length]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/forums/${forumId}/posts`);
      setPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts");
    }
  };

  const checkJoinRequestStatus = async () => {
    try {
      const projectIds = posts.filter((post) => post.project).map((post) => post.project!);
      const responses = await Promise.all(
        projectIds.map((projectId) =>
          axios.get(`/api/projects/${projectId}/join/status`).catch(() => ({ data: { data: null } }))
        )
      );
      const statusMap: { [projectId: string]: JoinRequest | null } = {};
      responses.forEach((response, index) => {
        statusMap[projectIds[index]] = response.data.data;
      });
      setJoinRequestStatus(statusMap);
    } catch (error) {
      console.error("Error checking join request status:", error);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      toast.error("Post content is required");
      return;
    }
    try {
      await axios.post(`/api/forums/${forumId}/posts`, { content: newPostContent });
      setNewPostContent("");
      onPostCreated();
      fetchPosts();
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  const handleJoinProject = async (projectId: string) => {
    try {
      const response = await axios.post(`/api/projects/${projectId}/join`);
      toast.success("Join request sent successfully!");
      setJoinRequestStatus((prev) => ({
        ...prev,
        [projectId]: { _id: response.data.data.joinRequestId, status: "pending" },
      }));
    } catch (error: any) {
      console.error("Error sending join request:", error);
      toast.error(error.response?.data?.error || "Failed to send join request");
    }
  };

  return (
    <motion.div
      className="w-full md:w-3/4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-semibold text-indigo-900 dark:text-white mb-4">
        Discussion
      </h3>
      <form onSubmit={handlePostSubmit} className="mb-6">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
          placeholder="Write a new post..."
          rows={4}
        />
        <Button
          type="submit"
          className="mt-2 bg-gradient-to-r from-cyan-400 to-cyan-700 dark:from-cyan-500 dark:to-cyan-800 text-white rounded-xl"
        >
          Post
        </Button>
      </form>
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <motion.div
              key={post._id}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h4 className="text-lg font-medium text-indigo-900 dark:text-white">
                {post.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{post.content}</p>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Posted by {post.createdBy.username} on{" "}
                {new Date(post.createdAt).toLocaleString()}
              </div>
              {post.project && (
                <Button
                  onClick={() => handleJoinProject(post.project!)}
                  disabled={joinRequestStatus[post.project!]?.status === "pending"}
                  className={`mt-3 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 text-white rounded-xl ${
                    joinRequestStatus[post.project!]?.status === "pending" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {joinRequestStatus[post.project!]?.status === "pending" ? "Request Pending" : "Join Group"}
                </Button>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No posts yet.</p>
        )}
      </div>
    </motion.div>
  );
};

export default function CommunityPage() {
  const router = useRouter();
  const [selectedForum, setSelectedForum] = useState<string>("1");
  const [forums, setForums] = useState<Forum[]>([
    {
      id: "1",
      title: "General Discussion",
      description: "Talk about anything related to SynKro.",
      posts: 45,
    },
    {
      id: "2",
      title: "Project Help",
      description: "Get help with your projects.",
      posts: 23,
    },
    {
      id: "3",
      title: "Ideas & Feedback",
      description: "Share your ideas and feedback.",
      posts: 15,
    },
  ]);

  const handleForumSelect = (forumId: string) => {
    setSelectedForum(forumId);
  };

  const handlePostCreated = () => {
    setForums((prevForums) =>
      prevForums.map((forum) =>
        forum.id === selectedForum
          ? { ...forum, posts: forum.posts + 1 }
          : forum
      )
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-card dark:to-muted">
      <nav className="w-full bg-gradient-to-r from-blue-50 via-blue-200 to-blue-50 dark:from-card dark:via-muted dark:to-card shadow-lg p-4 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-900 dark:text-white">
            SynKro Community
          </h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col md:flex-row p-6 pt-20 max-w-6xl mx-auto space-x-0 md:space-x-6 space-y-6 md:space-y-0">
        <motion.div
          className="w-full md:w-1/4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-indigo-900 dark:text-white mb-4">
            Forums
          </h3>
          <div className="space-y-2">
            {forums.map((forum) => (
              <motion.div
                key={forum.id}
                onClick={() => handleForumSelect(forum.id)}
                className={`p-3 rounded-xl cursor-pointer ${
                  selectedForum === forum.id
                    ? "bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-600 dark:to-blue-800 text-indigo-900 dark:text-white"
                    : "bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h4 className="text-lg font-medium">{forum.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {forum.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {forum.posts} posts
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <DiscussionSidebar
          forumId={selectedForum}
          onPostCreated={handlePostCreated}
        />
      </main>
    </div>
  );
}