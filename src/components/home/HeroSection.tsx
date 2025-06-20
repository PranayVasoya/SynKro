"use client";

import { motion } from "framer-motion";

// Components
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-background w-full overflow-hidden py-16 lg:py-32">
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center px-6 py-12 md:px-12 lg:px-44 lg:py-16">
        <div className="flex flex-col items-center lg:items-start gap-y-4 lg:gap-y-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-3xl text-center lg:text-start lg:text-4xl font-semibold text-foreground"
          >
            Welcome to your
            <br />
            SynKro community
          </motion.p>
          <div className="flex justify-start items-center w-full">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-lg font-semibold text-muted-foreground"
            >
              Sync karo yaar!
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-col gap-3 w-full lg:w-auto lg:items-center"
          >
            <Button
              asChild
              variant="secondary"
              size="xl"
              className="w-full lg:w-auto"
            >
              <Link href="/signin">Sign in to your account</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="xl"
              className="w-full lg:w-auto"
            >
              <Link href="/signup">Create a new account</Link>
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Image
            src="/people.png"
            alt="Illustration of a diverse group of people collaborating"
            width={600}
            height={600}
            className="max-w-full h-auto lg:max-w-[600px]"
            priority
          />
        </motion.div>
      </div>

      {/* Gear Image */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Image
          src="/gear.png"
          alt=""
          aria-hidden="true"
          width={300}
          height={300}
          className="absolute bottom-[-50px] right-[-50px] opacity-30 pointer-events-none select-none z-0"
          style={{
            filter: "grayscale(100%) brightness(90%)",
          }}
        />
      </motion.div>
    </section>
  );
}
