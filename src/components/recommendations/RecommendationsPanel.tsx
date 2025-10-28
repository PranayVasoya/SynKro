"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Users, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";

interface Recommendation {
  userId: string;
  username: string;
  sharedSkills?: number;
  mutualConnections?: number;
  skills: string[];
  score?: number;
  sharedSkillsCount?: number;
}

export default function RecommendationsPanel() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState<"all" | "skills">("all");

  useEffect(() => {
    fetchRecommendations();
  }, [viewType]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<{ data: Recommendation[] }>(
        `/api/recommendations?type=${viewType}&limit=5`
      );
      setRecommendations(response.data.data || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast.error("Failed to load recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <Card className="p-6 bg-card shadow-lg rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Recommended Connections
          </h2>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("all")}
          >
            All
          </Button>
          <Button
            variant={viewType === "skills" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType("skills")}
          >
            By Skills
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading recommendations...
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No recommendations available yet. Update your skills to get better matches!
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.userId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-background dark:bg-muted/30 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {rec.username}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {rec.sharedSkills !== undefined && (
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3" />
                        {rec.sharedSkills} shared skills
                      </span>
                    )}
                    
                    {rec.mutualConnections !== undefined && rec.mutualConnections > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                        <Users className="w-3 h-3" />
                        {rec.mutualConnections} mutual connections
                      </span>
                    )}
                    
                    {rec.score !== undefined && (
                      <span className="inline-flex items-center gap-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                        <Award className="w-3 h-3" />
                        Score: {rec.score}
                      </span>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewProfile(rec.userId)}
                  className="ml-2"
                >
                  View Profile
                </Button>
              </div>
              
              {rec.skills && rec.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {rec.skills.slice(0, 5).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {rec.skills.length > 5 && (
                    <span className="text-xs text-muted-foreground px-2 py-1">
                      +{rec.skills.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}