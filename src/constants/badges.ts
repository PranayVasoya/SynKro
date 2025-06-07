export interface Badge {
  name: string;
  description: string;
  icon: string;
}

export const INITIAL_BADGES: Badge[] = [
  {
      name: "Top Contributor",
      description: "Top 10 on leaderboard.",
      icon: "🏆",
    },
    {
        name: "Active Contributor",
        description: "Contributed to 10+ projects.",
        icon: "💪",
        },
    {
        name: "New Contributor",
        description: "Contributed to 1+ projects.",
        icon: "🌱",
    },
    {
        name: "Project Creator",
        description: "Created 1+ projects.",
        icon: "🚀",
    },
    {
        name: "Bug Hunter",
        description: "Reported 5+ bugs.",
        icon: "🐛",
    },
    {
        name: "Community Helper",
        description: "Helped 5+ users in discussions.",
        icon: "🤝",
    },
]
