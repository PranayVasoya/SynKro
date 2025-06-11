"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="py-32 bg-card">
      <div className="max-w-7xl mx-auto px-8 lg:px-44 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-3xl lg:text-4xl font-bold text-foreground mb-6"
        >
          About SynKro
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-muted-foreground max-w-4xl mx-auto"
        >
          SynKro is a dynamic collaborative platform crafted to unite
          developers, designers, and innovators from around the globe. Our
          vision is to create a vibrant ecosystem where creativity flourishes,
          ideas are synchronized effortlessly, and projects are brought to life
          through teamwork. Targeting tech enthusiasts, startups, and seasoned
          professionals, SynKro offers a space to showcase skills, collaborate
          on cutting-edge projects, and grow professionally. With a focus on
          community-driven innovation, we provide tools for real-time
          collaboration, skill sharing, and project management, making SynKro
          the go-to hub for the next generation of tech leaders. Join us to
          connect, create, and contribute to a thriving global network!
        </motion.p>
      </div>
    </section>
  );
}
