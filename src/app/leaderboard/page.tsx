"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  
  const [selectedUser, setSelectedUser] = useState(leaderboard[0]);

  const isAuthenticated = true;
  if (!isAuthenticated) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Navbar */}
      <nav className="w-full bg-gray-100 p-4 flex justify-between items-center border-b border-gray-300">
        <h1 className="text-xl font-bold text-black">SynKro</h1>
        <Link href="/dashboard" className="text-sm text-gray-600 hover:underline">&lt; Back to Dashboard</Link>
      </nav>
      
      {/* Main Content */}
      <main className="flex-1 p-6 flex">
        {/* Leaderboard Section */}
        <div className="w-1/2 pr-6">
          <h2 className="text-2xl text-black font-bold flex items-center">🏆 Leaderboard</h2>
          <ul className="mt-4 border-t border-gray-300">
            {leaderboard.map((user, index) => (
              <li key={index} className="flex justify-between items-center py-2 border-b border-gray-300 cursor-pointer hover:bg-gray-100" onClick={() => setSelectedUser(user)}>
                <div className="flex items-center">
                  {user.rank === 1 && <span className="text-yellow-500 mr-2">🥇</span>}
                  {user.rank === 2 && <span className="text-gray-500 mr-2">🥈</span>}
                  {user.rank === 3 && <span className="text-orange-500 mr-2">🥉</span>}
                  {user.rank > 3 && <span className="text-blue-500 mr-2">🔵</span>}
                  <span className="text-gray-800 font-medium">{user.name}</span>
                </div>
                <span className="text-gray-600">{user.points} pts</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* User Details Section */}
        <div className="w-1/2 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg text-white text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
            <span className="text-4xl font-bold text-blue-500">{selectedUser.rank}</span>
          </div>
          <h3 className="text-2xl font-semibold">{selectedUser.name}</h3>
          <p className="mt-2 text-lg">Rank: <span className="font-bold">#{selectedUser.rank}</span></p>
          <p className="text-lg">Points: <span className="font-bold">{selectedUser.points}</span></p>
          <p className="mt-4 px-6 py-3 bg-white text-blue-500 font-medium rounded-lg shadow-md">{selectedUser.details}</p>
          
          {/* Skills Section */}
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Skills:</h4>
            <ul className="mt-2 flex flex-wrap justify-center gap-2">
              {selectedUser.skills.map((skill, idx) => (
                <li key={idx} className="px-4 py-2 bg-white text-blue-500 rounded-full shadow-md">{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
