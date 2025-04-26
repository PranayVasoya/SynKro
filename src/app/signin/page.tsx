"use client";

import { useState } from "react";
import Navbar from "@components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder state management
  const [emailPlaceholder, setEmailPlaceholder] = useState("Enter your Email");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("Enter your Password");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/users/signin", {
        email: formData.email,
        password: formData.password,
      });

      toast.success("Sign-in successful!");
      const isProfileComplete = response.data.profileComplete; // Assuming API response contains this
      if (!isProfileComplete) {
        router.push("/profile");
      }else{
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Sign-in failed.";
      console.error("Signin error:", err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-background dark:to-muted">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-gradient-to-b from-blue-50 to-blue-100 dark:from-card dark:to-muted shadow-md"
      >
        <Navbar />
      </motion.div>

      <div className="flex flex-col md:flex-row w-full flex-1 min-h-[90vh] p-6 md:p-0 relative">
        {/* Left Section - Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 flex flex-col items-center justify-center space-y-6 bg-transparent"
        >
          <div className="w-full flex justify-center">
            <Image
              src="/sign_in.png"
              alt="signin"
              width={400}
              height={400}
              className="max-w-full h-auto"
            />
          </div>
        </motion.div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-6 md:p-4 relative">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex-1 flex items-center justify-center"
          >
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              Good to see you again. <br /> What will you create today?
            </p>
          </motion.div>

          {/* Input Fields with Borders */}
          <form
            onSubmit={handleSignIn}
            className="w-full flex-1 flex flex-col items-center justify-center space-y-4 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-card dark:to-muted py-6 rounded-xl shadow-md border border-border"
          >
            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              type="email"
              placeholder={emailPlaceholder}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-3/4 p-3 border border-border rounded-lg text-center text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:text-foreground bg-background dark:bg-card transition-all duration-200"
              onFocus={() => setEmailPlaceholder("")}
              onBlur={(e) => e.target.value === "" && setEmailPlaceholder("Enter your Email")}
            />
            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              type="password"
              placeholder={passwordPlaceholder}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-3/4 p-3 border border-border rounded-lg text-center text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:text-foreground bg-background dark:bg-card transition-all duration-200"
              onFocus={() => setPasswordPlaceholder("")}
              onBlur={(e) => e.target.value === "" && setPasswordPlaceholder("Enter your Password")}
            />
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary))" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className={`w-3/4 p-3 border border-border rounded-lg transition text-foreground ${
                loading ? "opacity-50 cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-destructive text-sm"
              >
                {error}
              </motion.p>
            )}
          </form>

          {/* "Don't have an account?" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full flex-1 flex items-center justify-center text-md"
          >
            <p className="text-foreground">
              Don't have an account?{" "}
              <a href="/signup" className="text-primary cursor-pointer hover:underline">
                Click here.
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}