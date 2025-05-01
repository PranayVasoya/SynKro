"use client";

import { useState } from "react"; // No need for useEffect here
import Navbar from "@components/Navbar"; // Assuming this path is correct
import Image from "next/image";
import Link from "next/link"; // Import Link for internal navigation
import { useRouter } from "next/navigation";
import axios from "axios"; // Import AxiosError
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // 1. Import icons

// Define an interface for expected API error responses (optional but good practice)
interface ApiErrorResponse {
  message?: string;
  error?: string; // Adjust based on your actual API error structure
}

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholders state
  const [emailPlaceholder, setEmailPlaceholder] = useState("Enter your Email");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("Enter your Password");

  // 2. Add state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic client-side check
    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password.");
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
        errorMessage = serverError?.message || serverError?.error || err.message || errorMessage;
      } else if (err instanceof Error) {
         errorMessage = err.message;
      }

      console.error("Signin error:", err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Framer Motion variants
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
    <div className="flex flex-col items-center w-full min-h-screen bg-white dark:bg-customDarkGray">
       <div className="w-full bg-white dark:bg-customDarkGray shadow-md sticky top-0 z-50">
         <Navbar />
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 w-full flex-1 items-center p-6 gap-6 max-w-7xl mx-auto">
         {/* Left side: Image */}
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
           className="flex justify-center items-center h-full md:order-first" // Image first
         >
           <Image
             src="/sign_in.png"
             alt="Illustration for Sign In page"
             width={450}
             height={450}
             className="max-w-full h-auto object-contain"
             priority
           />
         </motion.div>

         {/* Right side: Form and Text */}
         <motion.div
            className="flex flex-col items-center justify-center text-center gap-8 md:gap-10 h-full md:order-last" // Form last
            variants={containerVariants}
            initial="hidden"
            animate="visible"
         >
           <motion.p
             variants={itemVariants}
             className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
           >
             Good to see you again. <br /> What will you create today?
           </motion.p>

           {/* Form Section */}
           <motion.form
             // variants={itemVariants} // Apply variants to children instead
             onSubmit={handleSignIn}
             className="w-full max-w-sm flex flex-col items-center space-y-4 bg-gray-50 dark:bg-customMediumGray p-6 rounded-xl shadow-lg border border-gray-300 dark:border-gray-600" // Adjusted styles
           >
             {/* Email Input with Label */}
             {/* Apply motion variant to the wrapper div */}
             <motion.div className="w-full" variants={itemVariants}>
                <label htmlFor="email" className="sr-only">Email Address</label>
                <input // Not motion.input
                  id="email"
                  type="email"
                  placeholder={emailPlaceholder}
                  value={formData.email}
                  required
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-customDarkGray transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                  onFocus={() => setEmailPlaceholder("")}
                  onBlur={(e) => !e.target.value && setEmailPlaceholder("Enter your Email")}
                />
             </motion.div>

             {/* Password Input with Label and Toggle */}
             {/* 3. Apply motion variant to the wrapper div */}
             <motion.div className="w-full relative" variants={itemVariants}>
               <label htmlFor="password" className="sr-only">Password</label>
               <input // Not motion.input
                 id="password"
                 type={showPassword ? "text" : "password"} // Dynamic type
                 placeholder={passwordPlaceholder}
                 value={formData.password}
                 required
                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                 // Add symmetrical padding for centering + icon space
                 className="w-full p-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-customPurple dark:focus:ring-customPurple focus:border-transparent bg-white dark:bg-customDarkGray transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                 onFocus={() => setPasswordPlaceholder("")}
                 onBlur={(e) => !e.target.value && setPasswordPlaceholder("Enter your Password")}
               />
               {/* 4. Add toggle button */}
               <button
                  type="button" // Important: prevent form submission
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

             {/* Submit Button */}
             <motion.button
               variants={itemVariants}
               whileHover={{ scale: 1.03, backgroundColor: '#7a7ad9' }} // Use slightly darker purple
               whileTap={{ scale: 0.97 }}
               type="submit"
               disabled={loading}
               style={{ backgroundColor: loading ? '' : '#8c8bf1' }} // Apply customPurple bg via style when enabled
               className={`w-full p-3 mt-1 border border-transparent rounded-lg transition font-semibold ${ // Added small margin-top
                 loading
                   ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed" // Standard disabled colors
                   : "text-white" // White text on customPurple background
               }`}
             >
               {loading ? "Signing In..." : "Sign In"}
             </motion.button>

             {/* Error Message Display */}
             {error && (
               // Apply motion variant to error message if desired
               <motion.p
                 variants={itemVariants} // Apply stagger effect to error too
                 initial="hidden" // Need initial/animate if applying variants directly
                 animate="visible"
                 className="text-red-600 dark:text-red-500 text-sm pt-2"
               >
                 {error}
               </motion.p>
             )}
           </motion.form>

           {/* Link to Sign Up */}
           <motion.div
             variants={itemVariants}
             className="text-md text-gray-700 dark:text-gray-300"
           >
             Don&apos;t have an account?{" "}
             <Link href="/signup" className="text-customPurple hover:underline font-medium">
               Click here.
             </Link>
           </motion.div>
         </motion.div>
       </div>
     </div>
  );
}