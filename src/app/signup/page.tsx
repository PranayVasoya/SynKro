"use client";

import { useEffect, useState } from "react";
import Navbar from "@components/Navbar"; // Assuming path is correct
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // 1. Import icons

// Optional: Interface for API error response
interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const SignupPage = () => {
  // State for placeholders
  const [namePlaceholder, setNamePlaceholder] = useState("Enter your Name");
  const [emailPlaceholder, setEmailPlaceholder] = useState(
    "Enter your Email-ID"
  );
  const [passPlaceholder, setPassPlaceholder] = useState("Enter your Password");
  const [prnPlaceholder, setPrnPlaceholder] = useState("Enter your PRN");
  const [batchPlaceholder, setBatchPlaceholder] = useState("Enter your Batch");
  const [mobilePlaceholder, setMobilePlaceholder] = useState(
    "Enter your Mobile Number"
  );

  // 2. Add state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    prn: "",
    batch: "",
    mobile: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.username || !user.email || !user.password) {
      toast.error("Please fill in Name, Email, and Password.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: user.username,
        email: user.email,
        password: user.password,
        ...(user.prn && { prn: user.prn }),
        ...(user.batch && { batch: user.batch }),
        ...(user.mobile && { mobile: user.mobile }),
      };
      const response = await axios.post("/api/users/signup", payload);
      console.log("Signup success", response.data);
      toast.success("Signup successful! Please login to continue.");
      router.push("/signin");
    } catch (error: unknown) {
      let errorMessage = "Sign-up failed. Please try again.";

      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data as ApiErrorResponse;
        errorMessage =
          serverError?.message ||
          serverError?.error ||
          error.message ||
          errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.log("Signup failed", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isDisabled = !user.username || !user.email || !user.password;
    setButtonDisabled(isDisabled);
  }, [user.username, user.email, user.password]);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    // Use custom gray for dark background, white for light
    <div className="flex flex-col items-center w-full min-h-screen bg-white dark:bg-customDarkGray">
      {/* Navbar container - Use matching background */}
      <div className="w-full bg-white dark:bg-customDarkGray shadow-md sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Main content area - Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full flex-1 items-center p-4 sm:p-6 gap-6 max-w-7xl mx-auto">
        {/* Left side: Form and Text */}
        <motion.div
          className="flex flex-col items-center justify-center text-center gap-8 md:gap-10 h-full md:order-first"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Heading */}
          <motion.p
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
          >
            Welcome to SynKro. <br /> Can&apos;t wait to see you here!!
          </motion.p>

          {/* Form Section */}
          <motion.form
            // Apply item variant to the form itself if desired, or remove if container handles it
            // variants={itemVariants}
            onSubmit={onSignup}
            className="w-full max-w-sm flex flex-col items-center space-y-3 bg-gray-50 dark:bg-customMediumGray p-6 rounded-xl shadow-lg border border-gray-300 dark:border-gray-600"
          >
            {/* Name Input (Apply motion directly) */}
            <motion.div className="w-full" variants={itemVariants}>
              <label htmlFor="username" className="sr-only">
                Name
              </label>
              <input // Changed from motion.input to input, motion is on the wrapper div
                id="username"
                type="text"
                placeholder={namePlaceholder}
                value={user.username}
                required
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-customDarkGray transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                onFocus={() => setNamePlaceholder("")}
                onBlur={(e) =>
                  !e.target.value && setNamePlaceholder("Enter your Name")
                }
              />
            </motion.div>

            {/* Email Input (Apply motion directly) */}
            <motion.div className="w-full" variants={itemVariants}>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input // Changed from motion.input
                id="email"
                type="email"
                placeholder={emailPlaceholder}
                value={user.email}
                required
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-customDarkGray transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                onFocus={() => setEmailPlaceholder("")}
                onBlur={(e) =>
                  !e.target.value && setEmailPlaceholder("Enter your Email-ID")
                }
              />
            </motion.div>

            {/* Password Input Wrapper (Apply motion here) */}
            <motion.div className="w-full relative" variants={itemVariants}>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input // Changed from motion.input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={passPlaceholder}
                value={user.password}
                required
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                // Add matching pl-10 to balance pr-10 for centering
                className="w-full p-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-customDarkGray transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                onFocus={() => setPassPlaceholder("")}
                onBlur={(e) =>
                  !e.target.value && setPassPlaceholder("Enter your Password")
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                // Adjust icon position if needed with balanced padding
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </motion.div>

            {/* PRN Input (Apply motion directly) */}
            <motion.div className="w-full" variants={itemVariants}>
              <label htmlFor="prn" className="sr-only">
                PRN
              </label>
              <input // Changed from motion.input
                id="prn"
                type="text"
                placeholder={prnPlaceholder}
                value={user.prn}
                required
                onChange={(e) => setUser({ ...user, prn: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-customDarkGray transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                onFocus={() => setPrnPlaceholder("")}
                onBlur={(e) =>
                  !e.target.value && setPrnPlaceholder("Enter your PRN")
                }
              />
            </motion.div>

            {/* Batch Input (Apply motion directly) */}
            <motion.div className="w-full" variants={itemVariants}>
              <label htmlFor="batch" className="sr-only">
                Batch
              </label>
              <input // Changed from motion.input
                id="batch"
                type="text"
                placeholder={batchPlaceholder}
                value={user.batch}
                required
                onChange={(e) => setUser({ ...user, batch: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-customDarkGray transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                onFocus={() => setBatchPlaceholder("")}
                onBlur={(e) =>
                  !e.target.value && setBatchPlaceholder("Enter your Batch")
                }
              />
            </motion.div>

            {/* Mobile Input (Apply motion directly) */}
            <motion.div className="w-full" variants={itemVariants}>
              <label htmlFor="mobile" className="sr-only">
                Mobile Number
              </label>
              <input // Changed from motion.input
                id="mobile"
                type="tel"
                placeholder={mobilePlaceholder}
                value={user.mobile}
                required
                onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-customDarkGray transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                onFocus={() => setMobilePlaceholder("")}
                onBlur={(e) =>
                  !e.target.value &&
                  setMobilePlaceholder("Enter your Mobile Number")
                }
              />
            </motion.div>

            {/* Submit Button (Apply motion directly) */}
            <motion.button
              variants={itemVariants}
              type="submit"
              whileHover={{ scale: 1.03, backgroundColor: "#7a7ad9" }}
              whileTap={{ scale: 0.97 }}
              disabled={buttonDisabled || loading}
              style={{
                backgroundColor: buttonDisabled || loading ? "" : "#8c8bf1",
              }}
              className={`w-full p-3 mt-2 border border-transparent rounded-lg transition font-semibold ${
                buttonDisabled || loading
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "text-white"
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </motion.button>
          </motion.form>

          {/* Redirect to Login */}
          <motion.div
            variants={itemVariants}
            className="text-md text-gray-700 dark:text-gray-300"
          >
            Already have an account? Sign in{" "}
            <Link
              href="/signin"
              className="text-customPurple hover:underline font-medium"
            >
              here.
            </Link>
          </motion.div>
        </motion.div>

        {/* Right side: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center h-full md:order-last mt-8 md:mt-0"
        >
          <Image
            src="/sign_up.png"
            alt="Illustration for Sign Up page"
            width={450}
            height={450}
            className="max-w-full h-auto object-contain"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
