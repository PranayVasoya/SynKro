"use client";

import { useState, useEffect } from "react"; // Added useRef for potential future use
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy, X } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button"; // Assuming ui/button

// --- Type Definition ---
interface LeaderboardProject {
  _id: string;
  title: string;
  status: "active" | "completed";
}

interface LeaderboardEntry {
  _id: string;
  username: string;
  rank: number;
  points: number;
  details: string; // Assuming this is a short bio or summary
  skills: string[];
  projects: LeaderboardProject[];
}
// --- End Type Definition ---

const Leaderboard = () => {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(
    null
  );
  // Removed windowSize state as it wasn't directly used for layout logic
  const [isLoading, setIsLoading] = useState(true);

  // Replace with your actual authentication check logic
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    // Example: Fetch user or check session
    const checkAuth = async () => {
      try {
        await axios.get("/api/users/me"); // Simple check if logged in
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        router.push("/signin");
      }
    };
    checkAuth();
  }, [router]);
  // --- End Auth Check ---

  // Fetch Leaderboard Data
  useEffect(() => {
    // Only fetch if authentication check is complete and successful
    if (isAuthenticated === true) {
      fetchLeaderboard();
    }
  }, [isAuthenticated]); // Dependency on auth state

  const fetchLeaderboard = async () => {
    setIsLoading(true); // Set loading true when fetch starts
    try {
      // Add explicit type to axios response for better safety
      const response = await axios.get<{ data: LeaderboardEntry[] }>(
        "/api/leaderboard"
      );
      // Sort by rank explicitly, just in case API doesn't guarantee it
      const sortedData =
        response.data?.data?.sort((a, b) => a.rank - b.rank) || [];
      setLeaderboard(sortedData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Failed to fetch leaderboard");
      setLeaderboard([]); // Set empty on error
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking authentication or fetching
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        Authenticating...
      </div>
    );
  }
  // Redirect is handled within the auth check effect

  const topThree = leaderboard.slice(0, 3);
  const maxPoints = Math.max(...leaderboard.map((u) => u.points), 1); // Avoid division by zero

  // Confetti Animation (kept as is, but consider performance impact)
  const celebrationVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: [1, 1.5, 1],
      opacity: [0, 1, 0],
      x: [0, Math.random() * 200 - 100, 0],
      y: [0, Math.random() * 200 - 100, 0],
      transition: {
        duration: 2 + Math.random(), // Add slight variation
        delay: i * 0.05, // Faster start
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      },
    }),
  };

  return (
    // Use theme colors for main background (muted in light mode)
    <div className="flex flex-col min-h-screen bg-background">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Navbar - Use theme colors */}
      <nav className="w-full bg-card shadow-sm p-4 sticky top-0 z-40 border-b border-border">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">SynKro</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard")}
            aria-label="Back to Dashboard"
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 rounded-full px-4 py-2 transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:font-bold" // Added hover:font-bold
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>
      </nav>

      <main className="flex-1 flex items-start justify-center p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          // Use card for main container, standard padding
          className="w-full max-w-6xl p-6 bg-card rounded-xl shadow-lg border border-border"
        >
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-8 md:mb-12 flex items-center justify-center gap-3">
            <Trophy className="text-primary w-8 h-8 sm:w-10 sm:h-10" />{" "}
            Leaderboard
          </h2>

          {/* Loading / Empty States */}
          {isLoading ? (
            <p className="text-center text-muted-foreground py-10">
              Loading leaderboard...
            </p>
          ) : leaderboard.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              No contributors yet. Be the first!
            </p>
          ) : (
            <>
              {/* Podium Section - Responsive Flex Layout */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                // Flex layout, stacks vertically on mobile, horizontal row on md+
                // items-end aligns bases, justify-center centers horizontally
                className="mb-12 flex flex-col md:flex-row justify-center items-end gap-4 md:gap-6 lg:gap-8"
              >
                {/* Map top three, apply ordering and styling */}
                {topThree.map((user, index) => {
                  const rank = user.rank;
                  const isFirst = rank === 1;
                  const isSecond = rank === 2;
                  const isThird = rank === 3;
                  // Define order for desktop view (2nd, 1st, 3rd)
                  const orderClass = isFirst
                    ? "md:order-2"
                    : isSecond
                    ? "md:order-1"
                    : "md:order-3";
                  // Define relative width/height/style adjustments
                  const widthClass = isFirst ? "md:w-1/3" : "md:w-[30%]"; // Winner slightly wider
                  const paddingClass = isFirst ? "p-6 pt-8" : "p-5 pt-6"; // Winner more padding
                  const elevationClass = isFirst
                    ? "shadow-xl dark:shadow-primary/20"
                    : "shadow-lg";

                  return (
                    <motion.div
                      key={user._id}
                      initial={{ scale: 0.8, opacity: 0, y: 50 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1 + 0.2,
                        type: "spring",
                        stiffness: 100,
                      }}
                      // Use bg-background or bg-muted for contrast with bg-card main container
                      // Add order and width classes
                      className={`bg-background dark:bg-muted ${paddingClass} rounded-lg ${elevationClass} border border-border text-center transform hover:-translate-y-2 transition-transform duration-200 w-full ${widthClass} ${orderClass}`}
                      onClick={() => setSelectedUser(user)} // Make podium cards clickable
                      style={{ cursor: "pointer" }}
                    >
                      {/* Emoji / Rank Display */}
                      <div className="flex justify-center mb-3">
                        {isFirst && (
                          <span className="text-yellow-400 text-5xl">🥇</span>
                        )}
                        {isSecond && (
                          <span className="text-gray-400 text-4xl">🥈</span>
                        )}
                        {isThird && (
                          <span className="text-orange-400 text-4xl">🥉</span>
                        )}
                      </div>
                      <h3
                        className={`font-bold text-foreground ${
                          isFirst ? "text-2xl" : "text-xl"
                        }`}
                      >
                        {user.username}
                      </h3>
                      <p
                        className={`text-muted-foreground ${
                          isFirst ? "text-lg" : "text-base"
                        }`}
                      >
                        Rank #{user.rank}
                      </p>
                      {/* Progress Bar */}
                      <div className="w-full bg-muted dark:bg-background rounded-full h-2.5 mt-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(user.points / maxPoints) * 100}%`,
                          }}
                          transition={{
                            duration: 0.8,
                            delay: index * 0.1 + 0.5,
                            ease: "easeOut",
                          }}
                          className="bg-gradient-to-r from-primary/80 to-primary h-full rounded-full"
                        ></motion.div>
                      </div>
                      <p
                        className={`mt-2 text-foreground font-medium ${
                          isFirst ? "text-xl" : "text-lg"
                        }`}
                      >
                        {user.points} pts
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Full Leaderboard Table */}
              <div className="overflow-x-auto rounded-lg border border-border shadow-md">
                <motion.table
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="w-full text-sm sm:text-base" // Base text size
                >
                  <thead>
                    {/* Use primary background for header */}
                    <tr className="bg-primary text-primary-foreground">
                      <th className="p-3 sm:p-4 text-left font-semibold">
                        Rank
                      </th>
                      <th className="p-3 sm:p-4 text-left font-semibold">
                        Name
                      </th>
                      <th className="p-3 sm:p-4 text-right font-semibold">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Map remaining users or all users */}
                    {leaderboard.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.03 + 0.7,
                        }} // Faster stagger for table
                        whileHover={{ backgroundColor: "hsl(var(--muted))" }} // Use theme muted hover
                        className="border-b border-border last:border-b-0 cursor-pointer transition-colors duration-150"
                        onClick={() => setSelectedUser(user)}
                      >
                        <td className="p-3 sm:p-4">
                          {/* Rank Display with Number and optional Emoji */}
                          <span className="flex items-center font-medium text-foreground">
                            {user.rank === 1 && (
                              <span className="text-yellow-400 mr-2 text-lg">
                                🥇
                              </span>
                            )}
                            {user.rank === 2 && (
                              <span className="text-gray-400 mr-2 text-lg">
                                🥈
                              </span>
                            )}
                            {user.rank === 3 && (
                              <span className="text-orange-400 mr-2 text-lg">
                                🥉
                              </span>
                            )}
                            #{user.rank}
                          </span>
                        </td>
                        <td className="p-3 sm:p-4 text-foreground font-medium">
                          {user.username}
                        </td>
                        <td className="p-3 sm:p-4 text-right text-muted-foreground font-semibold">
                          {user.points} pts
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </motion.table>
              </div>
            </>
          )}

          {/* User Detail Modal */}
          <AnimatePresence>
            {selectedUser && (
              <motion.div
                key="user-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                // Changed from items-end to items-center for centered modal
                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                onClick={() => setSelectedUser(null)} // Close on backdrop click
              >
                <motion.div
                  key="user-modal-content"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  // Use card background, standard padding, max-height
                  className="bg-card w-full max-w-2xl max-h-[85vh] p-6 rounded-lg shadow-xl border border-border overflow-y-auto relative"
                  onClick={(e) => e.stopPropagation()} // Prevent close on modal content click
                >
                  {/* Optional Confetti for Rank 1 */}
                  {selectedUser.rank === 1 && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                      {[...Array(15)].map(
                        (
                          _,
                          i // Reduced number
                        ) => (
                          <motion.div
                            key={i}
                            custom={i}
                            variants={celebrationVariants}
                            initial="hidden"
                            animate="visible"
                            className={`absolute w-1.5 h-1.5 ${
                              i % 2 === 0 ? "bg-primary" : "bg-yellow-400"
                            } rounded-full`}
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                          />
                        )
                      )}
                    </div>
                  )}
                  {/* Modal Header */}
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                      <Trophy className="text-primary w-7 h-7 sm:w-8 sm:h-8" />{" "}
                      {selectedUser.username}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedUser(null)}
                      className="text-muted-foreground"
                      aria-label="Close user details"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Modal Body */}
                  <div className="relative z-10 space-y-6">
                    {/* Rank Circle */}
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-28 h-28 sm:w-32 sm:h-32 mx-auto bg-background dark:bg-muted rounded-full flex items-center justify-center mb-6 shadow-inner border-4 border-primary/40"
                    >
                      <span className="text-5xl sm:text-6xl font-extrabold text-primary">
                        #{selectedUser.rank}
                      </span>
                    </motion.div>

                    {/* Points */}
                    <p className="text-lg sm:text-xl text-foreground text-center">
                      Points:{" "}
                      <span className="font-bold">{selectedUser.points}</span>
                    </p>

                    {/* Details/Bio */}
                    {selectedUser.details && (
                      <p className="text-base sm:text-lg text-muted-foreground bg-muted dark:bg-background p-4 rounded-md shadow-sm text-center">
                        {selectedUser.details}
                      </p>
                    )}

                    {/* Projects */}
                    <div className="pt-2">
                      <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-3 text-center sm:text-left">
                        Projects Contributed To:
                      </h4>
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: { transition: { staggerChildren: 0.07 } },
                        }}
                        className="flex flex-wrap justify-center gap-3"
                      >
                        {selectedUser.projects.length > 0 ? (
                          selectedUser.projects.map((project) => (
                            <motion.span
                              key={project._id}
                              variants={{
                                hidden: { scale: 0.8, opacity: 0 },
                                visible: { scale: 1, opacity: 1 },
                              }}
                              className="px-4 py-1.5 bg-muted dark:bg-background text-sm font-medium text-primary rounded-full shadow-sm border border-border hover:bg-primary/10 transition-colors"
                            >
                              {project.title}{" "}
                              {/* Removed status for brevity maybe? Or add back if needed */}
                            </motion.span>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No projects listed
                          </span>
                        )}
                      </motion.div>
                    </div>

                    {/* Skills */}
                    <div className="pt-2">
                      <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-3 text-center sm:text-left">
                        Top Skills:
                      </h4>
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: { transition: { staggerChildren: 0.07 } },
                        }}
                        className="flex flex-wrap justify-center gap-3"
                      >
                        {selectedUser.skills.length > 0 ? (
                          selectedUser.skills.map((skill, idx) => (
                            <motion.span
                              key={idx}
                              variants={{
                                hidden: { scale: 0.8, opacity: 0 },
                                visible: { scale: 1, opacity: 1 },
                              }}
                              className="px-4 py-1.5 bg-muted dark:bg-background text-sm font-medium text-foreground rounded-full shadow-sm border border-border hover:bg-muted/80 transition-colors"
                            >
                              {skill}
                            </motion.span>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No skills listed
                          </span>
                        )}
                      </motion.div>
                    </div>
                  </div>

                  {/* Close Button (Optional - backdrop click also closes) */}
                  {/* <div className="mt-8 text-center relative z-10">
                       <Button onClick={() => setSelectedUser(null)}> Close </Button>
                   </div> */}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default Leaderboard;
