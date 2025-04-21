"use client";

import { useState } from "react";
import Navbar from "@components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  // Placeholder state management
  const [userPlaceholder, setUserPlaceholder] = useState("Enter your Username");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("Enter your Password");

  const handleSignIn = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen overflow-hidden">
      <Navbar />

      <div className="flex flex-col md:flex-row w-full flex-1 min-h-[90vh] p-6 md:p-0 relative">
        {/* Left Section - Image */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center space-y-6 bg-white">
          <div className="w-full flex justify-center">
            <Image
              src="/sign_in.png"
              alt="signin"
              width={400}
              height={400}
              className="mix-blend-multiply max-w-full h-auto"
            />
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-6 md:p-4 relative">
          {/* Heading */}
          <div className="w-full flex-1 flex items-center justify-center">
            <p className="text-2xl md:text-3xl font-bold text-black">
              Good to see you again. <br /> What will you create today?
            </p>
          </div>

          {/* Input Fields with Borders */}
          <div className="w-full flex-1 flex flex-col items-center justify-center space-y-4 border-y border-gray-300 py-6">
            <input
              type="text"
              placeholder={userPlaceholder}
              className="w-3/4 p-3 border border-black rounded-lg text-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:text-black"
              onFocus={() => setUserPlaceholder("")}
              onBlur={(e) => e.target.value === "" && setUserPlaceholder("Enter your PRN")}
            />
            <input
              type="password"
              placeholder={passwordPlaceholder}
              className="w-3/4 p-3 border border-black rounded-lg text-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:text-black"
              onFocus={() => setPasswordPlaceholder("")}
              onBlur={(e) => e.target.value === "" && setPasswordPlaceholder("Enter your Password")}
            />
            <button
              onClick={handleSignIn}
              className="w-3/4 p-3 border border-black rounded-lg hover:bg-black hover:text-white transition text-black"
            >
              Sign In
            </button>
          </div>

          {/* "Don't have an account?" */}
          <div className="w-full flex-1 flex items-center justify-center text-md">
            <p className="text-black">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="text-orange-500 cursor-pointer hover:underline">
                Click here.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
