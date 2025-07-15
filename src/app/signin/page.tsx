"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Components
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

// Interfaces
import { ApiErrorResponse } from "@/interfaces/api";

// Icons
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const router = useRouter();

  // Prevent scrollbar on this page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const [emailPlaceholder, setEmailPlaceholder] = useState(
    "Enter your Email-ID"
  );
  const [passwordPlaceholder, setPasswordPlaceholder] = useState(
    "Enter your Password"
  );

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!emailValid) {
      console.log("Invalid email format");
      setError("Please use your SIT email ending with @sitpune.edu.in");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post<{ data: { profileComplete: boolean } }>(
        "/api/users/signin",
        formData
      );
      toast.success("Sign-in successful!");

      const isProfileComplete = response.data.data.profileComplete;
      if (!isProfileComplete) {
        router.push("/profile");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      let errorMessage = "Sign-in failed. Please check your credentials.";

      if (axios.isAxiosError(err)) {
        const serverError = err.response?.data as ApiErrorResponse;
        const status = err.response?.status;
        if (status === 400) {
          errorMessage = "Invalid email or password. Please try again.";
        } else {
          errorMessage =
            serverError?.message ||
            serverError?.error ||
            err.message ||
            errorMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error("Signin error:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col items-center w-full h-screen bg-background overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-background grid grid-cols-1 md:grid-cols-2 w-full flex-1 items-center p-4 sm:p-6 gap-4 max-w-7xl mx-auto">
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center h-full md:order-first"
        >
          <Image
            src="/sign_in.png"
            alt="Illustration for Sign In page"
            width={400}
            height={400}
            className="max-w-full h-auto object-contain"
            priority
          />
        </motion.div>
        {/* --- End of Illustration --- */}

        {/* Sign In Section */}
        <motion.div
          className="flex flex-col items-center justify-center text-center gap-6 md:gap-8 h-full md:order-last"
          initial="hidden"
          animate="visible"
        >
          <motion.p
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground px-2"
            variants={itemVariants}
          >
            Good to see you again. <br /> What will you create today?
          </motion.p>

          <motion.form
            onSubmit={handleSignIn}
            className="w-full max-w-sm flex flex-col items-center space-y-3 bg-card p-5 rounded-xl shadow-lg border border-border"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="w-full" variants={itemVariants}>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder={emailPlaceholder}
                onFocus={() => setEmailPlaceholder("")}
                onBlur={(e) =>
                  !e.target.value && setEmailPlaceholder("Enter your Email-ID")
                }
                value={formData.email}
                required
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setEmailValid(
                    !e.target.value.startsWith("@") &&
                      e.target.value.endsWith("@sitpune.edu.in")
                  );
                }}
                className="w-full p-3 border border-border rounded-lg text-center text-foreground focus:outline-none focus:ring-2 focus:ring-customPurple focus:border-transparent bg-background transition-all duration-200 placeholder-placeholder"
              />
            </motion.div>

            <motion.div className="w-full relative" variants={itemVariants}>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={passwordPlaceholder}
                onFocus={() => setPasswordPlaceholder("")}
                onBlur={(e) =>
                  !e.target.value && setPasswordPlaceholder("Enter your Password")
                }
                value={formData.password}
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-3 px-10 border border-border rounded-lg text-center text-foreground focus:outline-none focus:ring-2 focus:ring-customPurple focus:border-transparent bg-background transition-all duration-200 placeholder-placeholder"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </motion.div>

            <Button
              variant="default"
              size="xl"
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? "" : "muted",
                color: loading ? "" : "foreground",
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            {error && (
              <motion.p
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="text-red-600 dark:text-red-500 text-sm pt-2"
              >
                {error}
              </motion.p>
            )}
          </motion.form>

          <motion.div
            variants={itemVariants}
            className="text-sm md:text-md text-muted-foreground"
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Click here.
            </Link>
          </motion.div>
        </motion.div>
        {/* --- End of Sign In Section --- */}
      </div>
    </div>
  );
}
