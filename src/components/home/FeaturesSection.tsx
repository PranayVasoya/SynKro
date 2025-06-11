"use client";

import { motion } from "framer-motion";

const featuresData = [
  {
    title: "Project Creation and Management",
    description:
      "Easily create and manage projects with a dedicated popup interface, including title, description, tech stack, and links, tailored for team collaboration.",
  },
  {
    title: "Skill Profile Customization",
    description:
      "Customize your skill profile with a wide range of categories (e.g., programming, frontend, backend) and save selections for a personalized showcase.",
  },
  {
    title: "Collaborative Project Updates",
    description:
      "Share and update projects in real-time with team members, featuring tech stack details and member recruitment options.",
  },
  {
    title: "Badge and Achievement Tracking",
    description:
      "Earn and display badges (e.g., Top Contributor, Leaderboard Champion) based on your contributions and skills mastered.",
  },
  {
    title: "Community Skill Matching",
    description:
      "Connect with others based on shared skills and interests, fostering collaboration through a robust matching system.",
  },
  {
    title: "Profile-Based Networking",
    description:
      "Network with peers via detailed profiles, including project history, social links, and real-time skill updates.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-3xl lg:text-4xl font-bold text-foreground mb-12 md:mb-16"
        >
          Key Features
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.03, transition: { duration: 0.2 } }}
              className="p-6 bg-card rounded-lg shadow-md text-left"
            >
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
