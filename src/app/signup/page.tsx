"use client";

import { useState } from "react";
import Navbar from "@components/Navbar";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    prn: "",
    batch: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const [usernameValid, setUsernameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [prnValid, setPrnValid] = useState(false);
  const [batchValid, setBatchValid] = useState(false);
  const [mobileValid, setMobileValid] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validations = [
      {
        valid: usernameValid,
        message:
          "Name must only contain letters and spaces. Numbers or symbols are not allowed.",
      },
      {
        valid: emailValid,
        message: "Please use your SIT email ending with @sitpune.edu.in",
      },
      {
        valid: passwordValid,
        message:
          "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.",
      },
      {
        valid: prnValid,
        message: "PRN must be exactly 11 digits and contain only numbers.",
      },
      {
        valid: batchValid,
        message: "Batch must follow the format YYYY-YYYY, without spaces.",
      },
      {
        valid: mobileValid,
        message: "Please enter a valid 10-digit mobile number.",
      },
    ];

    for (const { valid, message } of validations) {
      if (!valid) {
        setError(message);
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        prn: formData.prn,
        batch: formData.batch,
        mobile: formData.mobile,
      };

      const response = await axios.post("/api/users/signup", payload);

      console.log("Signup success", response.data);
      toast.success("Signup successful! Please login to continue.");

      router.push("/signin");
    } catch (error: unknown) {
      let errorMessage = "Sign-up failed. Please try again.";

      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data as ApiErrorResponse;
        if (
          typeof serverError?.error === "string" &&
          serverError.error.includes("E11000 duplicate key error")
        ) {
          const key = serverError.error.match(/index: (\w+)_1/)?.[1]; // e.g., 'username'
          if (key === "username") {
            errorMessage = "This username is already taken.";
          } else if (key === "email") {
            errorMessage = "This email is already registered.";
          } else {
            errorMessage =
              "Duplicate entry detected. Please use unique values.";
          }
        } else {
          errorMessage =
            serverError?.message ||
            serverError?.error ||
            error.message ||
            errorMessage;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Signup failed:", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="flex flex-col items-center w-full min-h-screen bg-white dark:bg-customDarkGray">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full bg-white dark:bg-customDarkGray shadow-md sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full flex-1 items-center p-4 sm:p-6 gap-6 max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col items-center justify-center text-center gap-8 md:gap-10 h-full md:order-first"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
          >
            Welcome to SynKro. <br /> Can&apos;t wait to see you here!!
          </motion.p>

          <motion.form
            onSubmit={handleSignUp}
            className="w-full max-w-sm flex flex-col items-center space-y-3 bg-gray-50 dark:bg-customMediumGray p-6 rounded-xl shadow-lg border border-gray-300 dark:border-gray-600"
          >
            <motion.div className="w-full" variants={itemVariants}>
              <label htmlFor="username" className="sr-only">
                Name
              </label>
              <input
                id="username"
                type="text"
                placeholder={formData.username ? "" : "Enter your Name"}
                value={formData.username}
                required
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                  setUsernameValid(/^[a-zA-Z\s]+$/.test(e.target.value.trim()));
                }}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-customDarkGray transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </motion.div>

            <motion.div className="w-full" variants={itemVariants}>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder={formData.email ? "" : "Enter your Email-ID"}
                value={formData.email}
                required
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setEmailValid(
                    !e.target.value.startsWith("@") &&
                      e.target.value.endsWith("@sitpune.edu.in")
                  );
                }}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-customDarkGray transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </motion.div>

            <motion.div className="w-full relative" variants={itemVariants}>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={formData.password ? "" : "Enter your Password"}
                value={formData.password}
                required
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setPasswordValid(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
                      e.target.value
                    )
                  );
                }}
                className="w-full p-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-customDarkGray transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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

            <motion.div className="w-full" variants={itemVariants}>
              <label htmlFor="prn" className="sr-only">
                PRN
              </label>
              <input
                id="prn"
                type="text"
                placeholder={formData.prn ? "" : "Enter your PRN"}
                value={formData.prn}
                required
                onChange={(e) => {
                  setFormData({ ...formData, prn: e.target.value });
                  setPrnValid(/^\d{11}$/.test(e.target.value));
                }}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-customDarkGray transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </motion.div>

            <motion.div className="w-full" variants={itemVariants}>
              <label htmlFor="batch" className="sr-only">
                Batch
              </label>
              <input
                id="batch"
                type="text"
                placeholder={formData.batch ? "" : "Enter your Batch"}
                value={formData.batch}
                required
                onChange={(e) => {
                  setFormData({ ...formData, batch: e.target.value });
                  setBatchValid(/^\d{4}-\d{4}$/.test(e.target.value));
                }}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-customDarkGray transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </motion.div>

            <motion.div className="w-full" variants={itemVariants}>
              <label htmlFor="mobile" className="sr-only">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                placeholder={formData.mobile ? "" : "Enter your Mobile Number"}
                value={formData.mobile}
                required
                onChange={(e) => {
                  setFormData({ ...formData, mobile: e.target.value });
                  setMobileValid(/^[6-9]\d{9}$/.test(e.target.value));
                }}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-customDarkGray transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              whileHover={{ scale: 1.03, backgroundColor: "#7a7ad9" }}
              whileTap={{ scale: 0.97 }}
              style={{
                backgroundColor: loading ? "" : "#8c8bf1",
              }}
              className={`w-full p-3 mt-2 border border-transparent rounded-lg transition font-semibold ${
                loading
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "text-white"
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </motion.button>

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
}
