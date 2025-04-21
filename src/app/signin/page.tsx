"use client";

import { useState } from "react";
import Navbar from "@components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

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
      router.push("/profile");
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
          <form
            onSubmit={handleSignIn}
            className="w-full flex-1 flex flex-col items-center justify-center space-y-4 border-y border-gray-300 py-6"
          >
            <input
              type="email"
              placeholder={emailPlaceholder}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-3/4 p-3 border border-black rounded-lg text-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:text-black"
              onFocus={() => setEmailPlaceholder("")}
              onBlur={(e) => e.target.value === "" && setEmailPlaceholder("Enter your Email")}
            />
            <input
              type="password"
              placeholder={passwordPlaceholder}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-3/4 p-3 border border-black rounded-lg text-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:text-black"
              onFocus={() => setPasswordPlaceholder("")}
              onBlur={(e) => e.target.value === "" && setPasswordPlaceholder("Enter your Password")}
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-3/4 p-3 border border-black rounded-lg transition text-black ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-black hover:text-white"
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </form>

          {/* "Don't have an account?" */}
          <div className="w-full flex-1 flex items-center justify-center text-md">
            <p className="text-black">
              Don't have an account?{" "}
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