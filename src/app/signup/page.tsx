"use client";

import { useEffect, useState } from "react";
import Navbar from "@components/Navbar";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const [namePlaceholder, setNamePlaceholder] = useState("Enter your Name");
  const [emailPlaceholder, setEmailPlaceholder] = useState("Enter your Email-ID");
  const [passPlaceholder, setPassPlaceholder] = useState("Enter your Password");

  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: ""
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
    <div className="flex flex-col items-center w-full min-h-screen overflow-hidden">
      <Navbar />

      <div className="flex flex-col md:flex-row w-full flex-1 min-h-[90vh] p-6 md:p-0 relative">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-6 md:p-4 relative">
          {/* Heading */}
          <div className="w-full flex-1 flex items-center justify-center">
            <p className="text-2xl md:text-3xl font-bold text-black">
              Welcome to SynKro. <br /> Can&apos;t wait to see you here!!
            </p>
          </div>

          {/* Input Fields */}
          <div className="w-full flex-1 flex flex-col items-center justify-center space-y-4 border-y border-gray-300 py-6">
            <input
              type="text"
              placeholder={namePlaceholder}
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-3/4 p-3 border border-black rounded-lg text-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:text-black"
              onFocus={() => setNamePlaceholder("")}
              onBlur={(e) => e.target.value === "" && setNamePlaceholder("Enter your Name")}
            />

            <input
              type="email"
              placeholder={emailPlaceholder}
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-3/4 p-3 border border-black rounded-lg text-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:text-black"
              onFocus={() => setEmailPlaceholder("")}
              onBlur={(e) => e.target.value === "" && setEmailPlaceholder("Enter your Email-ID")}
            />

            <input
              type="password"
              placeholder={passPlaceholder}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-3/4 p-3 border border-black rounded-lg text-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:text-black"
              onFocus={() => setPassPlaceholder("")}
              onBlur={(e) => e.target.value === "" && setPassPlaceholder("Enter your Password")}
            />

            <button
              onClick={onSignup}
              disabled={buttonDisabled || loading}
              className={`w-3/4 p-3 border border-black rounded-lg transition text-black ${
                buttonDisabled || loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "hover:bg-black hover:text-white"
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>

          {/* Redirect to Login */}
          <div className="w-full flex-1 flex items-center justify-center text-md">
            <p className="text-black">
              Already have an account? Sign in
              <Link href="/signin">
                <span className="text-orange-500 cursor-pointer hover:underline"> here.</span>
              </Link>
            </p>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center space-y-6 bg-white">
          <div className="w-full flex justify-center bg-white backdrop-blur-md">
            <Image
              src="/sign_up.png"
              alt="signin"
              width={400}
              height={400}
              className="mix-blend-multiply max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
