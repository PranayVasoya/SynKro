"use client";

import { useState } from "react";
import Navbar from "@components/Navbar"; // Assuming this path is correct
import Image from "next/image";
import Link from "next/link"; // Import Link for internal navigation
import { useRouter } from "next/navigation";
import axios from "axios"; // Import AxiosError for better typing
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

// Define an interface for expected API error responses (optional but good practice)
interface ApiErrorResponse {
  message?: string;
  error?: string; // Adjust based on your actual API error structure
}

export default function SignInPage() { // Renamed component for clarity (optional)
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholders can still be managed with state if you prefer the focus/blur effect
  const [emailPlaceholder, setEmailPlaceholder] = useState("Enter your Email");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("Enter your Password");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<{ data: { profileComplete: boolean } }>( // Add type hint for response data
        "/api/users/signin",
        formData // Send the whole formData object
      );
      toast.success("Sign-in successful!");
      const isProfileComplete = response.data.data.profileComplete;
      if (!isProfileComplete) {
        router.push("/profile");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      let errorMessage = "Sign-in failed. Please check your credentials."; // Default error

      // Try to extract a more specific error message from the API response
      if (axios.isAxiosError(err)) {
        const serverError = err.response?.data as ApiErrorResponse;
        if (serverError?.message) {
          errorMessage = serverError.message;
        } else if (serverError?.error) {
           errorMessage = serverError.error;
        } else if (err.message) {
           errorMessage = err.message; // Fallback to Axios error message
        }
      } else if (err instanceof Error) {
         errorMessage = err.message; // Fallback for non-Axios errors
      }

      console.error("Signin error:", err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Framer Motion variants for staggering animations (optional)
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
    // Removed overflow-hidden unless specifically needed
    <div className="flex flex-col items-center w-full min-h-screen bg-white dark:bg-customDarkGray">
       {/* Navbar container */}
       <div className="w-full bg-white dark:bg-customDarkGray shadow-md sticky top-0 z-50"> {/* Make navbar sticky */}
         <Navbar />
       </div>

       {/* Main content area */}
       {/* Using grid for potentially simpler responsive layout */}
       <div className="grid grid-cols-1 md:grid-cols-2 w-full flex-1 items-center p-6 gap-6 max-w-7xl mx-auto"> {/* Added max-width and centering */}

         {/* Left side: Image */}
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
           className="flex justify-center items-center h-full" // Center image vertically too
         >
           <Image
             src="/sign_in.png"
             alt="Illustration for Sign In page" // More descriptive alt text
             width={450} // Slightly adjusted size
             height={450}
             className="max-w-full h-auto object-contain"
             priority // Add priority if it's LCP (Largest Contentful Paint)
           />
         </motion.div>

         {/* Right side: Form and Text */}
         {/* Use flex column and center items, control spacing with gap */}
         <motion.div
            className="flex flex-col items-center justify-center text-center gap-8 md:gap-10 h-full" // Added gap for spacing
            variants={containerVariants}
            initial="hidden"
            animate="visible"
         >
           <motion.p
             variants={itemVariants}
             className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white" // Use consistent color names
           >
             Good to see you again. <br /> What will you create today?
           </motion.p>

           {/* Form Section */}
           {/* Use theme-aware background colors */}
           <motion.form
             variants={itemVariants}
             onSubmit={handleSignIn}
             className="w-full max-w-sm flex flex-col items-center space-y-4 bg-gray-50 dark:bg-customMediumGray p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700" // Adjusted styles
           >
             {/* Email Input with Label */}
             <div className="w-full">
                <label htmlFor="email" className="sr-only">Email Address</label> {/* Screen-reader only label */}
                <motion.input
                  variants={itemVariants}
                  id="email" // Connect label to input
                  type="email"
                  placeholder={emailPlaceholder}
                  value={formData.email}
                  required // Add required attribute
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-card transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500" // Adjusted colors/focus
                  onFocus={() => setEmailPlaceholder("")}
                  onBlur={(e) => !e.target.value && setEmailPlaceholder("Enter your Email")}
                />
             </div>

             {/* Password Input with Label */}
             <div className="w-full">
               <label htmlFor="password" className="sr-only">Password</label> {/* Screen-reader only label */}
               <motion.input
                 variants={itemVariants}
                 id="password" // Connect label to input
                 type="password"
                 placeholder={passwordPlaceholder}
                 value={formData.password}
                 required // Add required attribute
                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                 className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-card transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500" // Adjusted colors/focus
                 onFocus={() => setPasswordPlaceholder("")}
                 onBlur={(e) => !e.target.value && setPasswordPlaceholder("Enter your Password")}
               />
             </div>

             {/* Submit Button */}
             <motion.button
               variants={itemVariants}
               whileHover={{ scale: 1.03 }} // Simplified hover
               whileTap={{ scale: 0.97 }} // Simplified tap
               type="submit"
               disabled={loading}
               className={`w-full p-3 border border-transparent rounded-lg transition font-semibold ${
                 loading
                   ? "bg-gray-400 dark:bg-gray-600 text-gray-100 dark:text-gray-400 cursor-not-allowed"
                   : "bg-customPurple hover:bg-opacity-90 text-white dark:hover:bg-opacity-90" // Use theme color and Tailwind hover
               }`}
             >
               {loading ? "Signing In..." : "Sign In"}
             </motion.button>

             {/* Error Message Display */}
             {error && (
               <motion.p
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 0.3 }}
                 className="text-red-600 dark:text-red-500 text-sm pt-2" // Use standard destructive colors
               >
                 {error}
               </motion.p>
             )}
           </motion.form>

           {/* Link to Sign Up */}
           <motion.div
             variants={itemVariants}
             className="text-md text-gray-700 dark:text-gray-300" // Adjusted colors
           >
             Don&apos;t have an account?{" "}
             {/* Use Next.js Link component */}
             <Link href="/signup" className="text-customPurple hover:underline font-medium">
               Click here.
             </Link>
           </motion.div>
         </motion.div>
       </div>
     </div>
  );
}