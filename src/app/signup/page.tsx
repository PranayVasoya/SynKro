"use client";

import { useEffect, useState } from "react";
import Navbar from "@components/Navbar";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const SignupPage = () => {
  const [namePlaceholder, setNamePlaceholder] = useState("Enter your Name");
  const [emailPlaceholder, setEmailPlaceholder] = useState("Enter your Email-ID");
  const [passPlaceholder, setPassPlaceholder] = useState("Enter your Password");
  const [prnPlaceholder, setPrnPlaceholder] = useState("Enter your PRN");
  const [batchPlaceholder, setBatchPlaceholder] = useState("Enter your Batch");
  const [mobilePlaceholder, setMobilePlaceholder] = useState("Enter your Mobile Number");

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

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      toast.success("Signup successful! Please login to continue.");
      router.push("/signin");
    } catch (error: any) {
      console.log("Signup failed", error);
      toast.error(error.response?.data?.message || error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isDisabled = !user.username || !user.email || !user.password;
    setButtonDisabled(isDisabled);
  }, [user]);

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
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-6 md:p-4 relative">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex-1 flex items-center justify-center"
          >
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome to SynKro. <br /> Can't wait to see you here!!
            </p>
          </motion.div>

          {/* Input Fields */}
          <div className="w-full flex-1 flex flex-col items-center justify-center space-y-4 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-card dark:to-muted py-6 rounded-xl shadow-md border border-border">
            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              type="text"
              placeholder={namePlaceholder}
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-3/4 p-3 border border-border rounded-lg text-center text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:text-foreground bg-background dark:bg-card transition-all duration-200"
              onFocus={() => setNamePlaceholder("")}
              onBlur={(e) => e.target.value === "" && setNamePlaceholder("Enter your Name")}
            />

            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              type="email"
              placeholder={emailPlaceholder}
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-3/4 p-3 border border-border rounded-lg text-center text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:text-foreground bg-background dark:bg-card transition-all duration-200"
              onFocus={() => setEmailPlaceholder("")}
              onBlur={(e) => e.target.value === "" && setEmailPlaceholder("Enter your Email-ID")}
            />

            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              type="password"
              placeholder={passPlaceholder}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-3/4 p-3 border border-border rounded-lg text-center text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:text-foreground bg-background dark:bg-card transition-all duration-200"
              onFocus={() => setPassPlaceholder("")}
              onBlur={(e) => e.target.value === "" && setPassPlaceholder("Enter your Password")}
            />

            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              type="text"
              placeholder={prnPlaceholder}
              value={user.prn}
              onChange={(e) => setUser({ ...user, prn: e.target.value })}
              className="w-3/4 p-3 border border-border rounded-lg text-center text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:text-foreground bg-background dark:bg-card transition-all duration-200"
              onFocus={() => setPrnPlaceholder("")}
              onBlur={(e) => e.target.value === "" && setPrnPlaceholder("Enter your PRN")}
            />

            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              type="text"
              placeholder={batchPlaceholder}
              value={user.batch}
              onChange={(e) => setUser({ ...user, batch: e.target.value })}
              className="w-3/4 p-3 border border-border rounded-lg text-center text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:text-foreground bg-background dark:bg-card transition-all duration-200"
              onFocus={() => setBatchPlaceholder("")}
              onBlur={(e) => e.target.value === "" && setBatchPlaceholder("Enter your Batch")}
            />

            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              type="text"
              placeholder={mobilePlaceholder}
              value={user.mobile}
              onChange={(e) => setUser({ ...user, mobile: e.target.value })}
              className="w-3/4 p-3 border border-border rounded-lg text-center text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:text-foreground bg-background dark:bg-card transition-all duration-200"
              onFocus={() => setMobilePlaceholder("")}
              onBlur={(e) => e.target.value === "" && setMobilePlaceholder("Enter your Mobile Number")}
            />

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary))" }}
              whileTap={{ scale: 0.95 }}
              onClick={onSignup}
              disabled={buttonDisabled || loading}
              className={`w-3/4 p-3 border border-border rounded-lg transition text-foreground ${
                buttonDisabled || loading
                  ? "bg-muted cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </motion.button>
          </div>

          {/* Redirect to Login */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-full flex-1 flex items-center justify-center text-md"
          >
            <p className="text-foreground">
              Already have an account? Sign in
              <Link href="/signin">
                <span className="text-primary cursor-pointer hover:underline"> here.</span>
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right Section - Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 flex flex-col items-center justify-center space-y-6 bg-transparent"
        >
          <div className="w-full flex justify-center bg-transparent">
            <Image
              src="/sign_up.png"
              alt="signup"
              width={400}
              height={400}
              className="max-w-full h-auto"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;