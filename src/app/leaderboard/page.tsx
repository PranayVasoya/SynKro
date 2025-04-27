"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trophy, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Leaderboard = () => {
  const router = useRouter();
  const [leaderboard] = useState([
    { name: "Devvrat Saini", rank: 1, points: 1500, details: "Top performer in coding challenges", skills: ["JavaScript", "React", "Node.js"] },
    { name: "Dhairya Mehra", rank: 2, points: 1400, details: "Excellent problem solver", skills: ["Python", "Django", "Machine Learning"] },
    { name: "Krish Panchal", rank: 3, points: 1350, details: "Quick learner and efficient coder", skills: ["C++", "Algorithms", "Competitive Programming"] },
    { name: "Pranay Vasoya", rank: 4, points: 1300, details: "Consistent performer in contests", skills: ["Java", "Spring Boot", "Microservices"] },
    { name: "Dohn Joe", rank: 5, points: 1250, details: "Experienced in full-stack development", skills: ["HTML", "CSS", "JavaScript", "PHP"] },
    { name: "John Doe", rank: 6, points: 1200, details: "Specializes in backend systems", skills: ["Go", "Docker", "Kubernetes"] },
    { name: "John Joe", rank: 7, points: 1150, details: "Loves working on open-source projects", skills: ["Rust", "Blockchain", "Cryptography"] },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isAuthenticated = true;
  if (!isAuthenticated) {
    router.push("/signin");
    return null;
  }

  const topThree = leaderboard.slice(0, 3);

  // Animation variants for #1 rank celebration
  const celebrationVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: [1, 1.5, 1],
      opacity: [0, 1, 0],
      x: [0, Math.random() * 200 - 100, 0],
      y: [0, Math.random() * 200 - 100, 0],
      transition: {
        duration: 2,
        delay: i * 0.1,
        repeat: Infinity,
        repeatType: "reverse",
      },
    }),
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
            className="border border-border px-4 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
          >
            ← Back
          </motion.button>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl p-6 bg-background dark:bg-card rounded-2xl shadow-2xl border border-border"
        >
          <h2 className="text-4xl font-extrabold text-foreground text-center mb-10 flex items-center justify-center">
            <Trophy className="mr-3 text-primary w-10 h-10 animate-pulse" /> Leaderboard
          </h2>

          {/* Podium for Top 3 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-10 grid grid-rows-3 gap-6"
          >
            {topThree.map((user, index) => (
              <motion.div
                key={user.name}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-card dark:to-muted p-6 rounded-xl shadow-xl border border-border text-center transform hover:scale-105 transition-transform"
                style={{ height: `${300 - (index * 50)}px` }}
              >
                <div className="flex justify-center mb-4">
                  {user.rank === 1 && <span className="text-yellow-500 text-4xl">🥇</span>}
                  {user.rank === 2 && <span className="text-gray-500 text-4xl">🥈</span>}
                  {user.rank === 3 && <span className="text-orange-500 text-4xl">🥉</span>}
                </div>
                <h3 className="text-2xl font-bold text-foreground">{user.name}</h3>
                <p className="text-lg text-muted-foreground">Rank: #{user.rank}</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-4">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/60 h-4 rounded-full"
                    style={{ width: `${(user.points / 1500) * 100}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-lg text-foreground font-medium">{user.points} pts</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Full Leaderboard Table */}
          <div className="overflow-x-auto">
            <motion.table
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="w-full bg-gradient-to-r from-muted to-muted/80 dark:from-muted/50 dark:to-muted/30 rounded-lg overflow-hidden"
            >
              <thead>
                <tr className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                  <th className="p-4 text-left font-semibold">Rank</th>
                  <th className="p-4 text-left font-semibold">Name</th>
                  <th className="p-4 text-right font-semibold">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, index) => (
                  <motion.tr
                    key={user.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.6 }}
                    whileHover={{ backgroundColor: "hsl(var(--muted))", scale: 1.03, boxShadow: "0 0 15px hsl(var(--primary))" }}
                    className="border-b border-border cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="p-4">
                      <span className="flex items-center">
                        {user.rank === 1 && <span className="text-yellow-500 mr-2">🥇</span>}
                        {user.rank === 2 && <span className="text-gray-500 mr-2">🥈</span>}
                        {user.rank === 3 && <span className="text-orange-500 mr-2">🥉</span>}
                        {user.rank > 3 && <span className="text-primary mr-2">🔵</span>}
                        <span className="text-foreground font-medium">#{user.rank}</span>
                      </span>
                    </td>
                    <td className="p-4 text-foreground font-medium">{user.name}</td>
                    <td className="p-4 text-right text-muted-foreground font-medium">{user.points} pts</td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>

          <AnimatePresence>
            {selectedUser && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-0 bg-black bg-opacity-60 flex items-end justify-center z-50 p-6"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-b from-blue-50 to-blue-100 dark:from-card dark:to-muted w-full max-w-2xl max-h-[80vh] p-6 rounded-2xl shadow-2xl border border-border overflow-y-auto relative"
                  style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
                >
                  {selectedUser.rank === 1 && (
                    <motion.div className="absolute inset-0">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          custom={i}
                          variants={celebrationVariants}
                          initial="hidden"
                          animate="visible"
                          className="absolute w-2 h-2 bg-primary rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-3xl font-bold text-foreground flex items-center">
                      <Trophy className="mr-2 text-primary w-8 h-8" /> {selectedUser.name}
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedUser(null)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-40 h-40 bg-background dark:bg-card rounded-full flex items-center justify-center mb-6 shadow-lg border-4 border-primary/50"
                  >
                    <span className="text-7xl font-extrabold text-primary">{selectedUser.rank}</span>
                  </motion.div>
                  <p className="text-xl text-foreground mb-2">Rank: <span className="font-bold">#{selectedUser.rank}</span></p>
                  <p className="text-xl text-foreground mb-4">Points: <span className="font-bold">{selectedUser.points}</span></p>
                  <p className="text-lg text-muted-foreground mb-6 px-6 py-3 bg-card dark:bg-muted rounded-lg shadow-md">{selectedUser.details}</p>
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold text-foreground mb-4">Skills:</h4>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="flex flex-wrap justify-center gap-4"
                    >
                      {selectedUser.skills.map((skill, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          className="px-5 py-2 bg-card dark:bg-muted text-primary rounded-full shadow-md text-lg font-medium hover:bg-primary/10 transition-all duration-200"
                          whileHover={{ scale: 1.05, boxShadow: "0 0 10px hsl(var(--primary))" }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary))" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedUser(null)}
                    className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
                  >
                    Close
                  </motion.button>
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