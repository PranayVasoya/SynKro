"use client";

import { useState } from "react";
import Navbar from "@components/Navbar";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  // Placeholder state management
  const [namePlaceholder, setNamePlaceholder] = useState("Enter your Name");
  const [emailPlaceholder, setEmailPlaceholder] = useState("Enter your Email-ID");
  const [prnPlaceholder, setPrnPlaceholder] = useState("Enter your PRN");

  return (
    <div className="flex flex-col items-center w-full min-h-screen overflow-hidden">
      <Navbar />

      <div className="flex flex-col md:flex-row w-full flex-1 min-h-[90vh] p-6 md:p-0 relative">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-6 md:p-4 relative">
          {/* First Div - Heading */}
          <div className="w-full flex-1 flex items-center justify-center">
            <p className="text-2xl md:text-3xl font-bold text-black">
              Welcome to SynKro. <br /> Can&apos;t wait to see you here!!
            </p>
          </div>

          {/* Second Div - Input Fields with Borders */}
          <div className="w-full flex-1 flex flex-col items-center justify-center space-y-4 border-y border-gray-300 py-6">
            <input
              type="text"
              placeholder={namePlaceholder}
              className="w-3/4 p-3 border border-black rounded-lg text-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:text-black"
              onFocus={() => setNamePlaceholder("")}
              onBlur={(e) => e.target.value === "" && setNamePlaceholder("Enter your Name")}
            />
            <input
              type="text"
              placeholder={emailPlaceholder}
              className="w-3/4 p-3 border border-black rounded-lg text-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:text-black"
              onFocus={() => setEmailPlaceholder("")}
              onBlur={(e) => e.target.value === "" && setEmailPlaceholder("Enter your Email-ID")}
            />
            <input
              type="text"
              placeholder={prnPlaceholder}
              className="w-3/4 p-3 border border-black rounded-lg text-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:text-black"
              onFocus={() => setPrnPlaceholder("")}
              onBlur={(e) => e.target.value === "" && setPrnPlaceholder("Enter your PRN")}
            />
            <button className="w-3/4 p-3 border border-black rounded-lg hover:bg-black hover:text-white transition text-black">
              Sign Up
            </button>
          </div>

          {/* Third Div */}
          <div className="w-full flex-1 flex items-center justify-center text-md">
            <p className="text-black">
              Already have an account? Sign in
              <Link href="/signin">
                <span className="text-orange-500 cursor-pointer hover:underline"> here.</span>
              </Link>
            </p>
          </div>
        </div>

        {/* right Section - Image */}
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

export default Page;
