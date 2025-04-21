"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Navbar from "@components/Navbar";
import Image from "next/image";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const verifyUserEmail = async () => {
    console.log("VerifyEmailPage: Sending POST request with token:", token);
    try {
      await axios.post("/api/users/verifyemail", { token });
      toast.success("Email verified successfully!");
      setVerified(true);
      setError(false);
    } catch (error: any) {
      console.error("VerifyEmailPage: Verification error:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.error || "Verification failed.");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlToken = searchParams.get("token");
      console.log("VerifyEmailPage: URL search params:", window.location.search);
      console.log("VerifyEmailPage: Extracted token:", urlToken);
      if (urlToken && typeof urlToken === "string") {
        setToken(urlToken);
      } else {
        console.log("VerifyEmailPage: No valid token found in URL");
        setError(true);
        setLoading(false);
        toast.error("No verification token provided.");
      }
    } catch (err) {
      console.error("VerifyEmailPage: Error extracting token:", err);
      setError(true);
      setLoading(false);
      toast.error("Failed to parse verification token.");
    }
  }, []);

  useEffect(() => {
    if (token && token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  useEffect(() => {
    if (verified) {
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    }
  }, [verified]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-col md:flex-row w-full flex-1 min-h-[90vh] p-6 md:p-0 relative">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-6 md:p-4 relative">
          <div className="w-full flex-1 flex flex-col items-center justify-center space-y-6">
            <h1 className="text-3xl font-bold text-black">Email Verification</h1>

            {loading && (
              <p className="text-gray-600 text-lg">Verifying your email...</p>
            )}

            {verified && (
              <p className="text-green-600 text-lg">
                ✅ Email verified successfully! Redirecting to Sign In...
              </p>
            )}

            {error && (
              <p className="text-red-600 text-lg">
                ❌ Email verification failed. Please try again or contact support.
              </p>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center space-y-6 bg-white">
          <div className="w-full flex justify-center bg-white backdrop-blur-md">
            <Image
              src="/people.jpg"
              alt="verify email"
              width={400}
              height={400}
              className="mix-blend-multiply max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}