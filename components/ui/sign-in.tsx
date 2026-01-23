"use client";

import * as React from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function MordernSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/journal");
      }
    });
    return unsubscribe;
  }, [router]);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignIn = async () => {
    if (!email || !password) {
      return setError("Please enter both email & password");
    }

    if (!validateEmail(email)) {
      return setError("Please enter a valid email");
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/journal");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/journal");
    } catch (err) {
      setError("Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden w-full">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&h=1200&fit=crop&q=80"
        alt=""
        className="w-full h-full object-cover absolute top-0 right-0 bottom-0 left-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Back to Home Button */}
      <a
        href="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Home</span>
      </a>

      {/* Logo */}
      <a
        href="/"
        className="absolute top-6 right-6 z-20 text-2xl font-bold text-white"
      >
        DearMe
      </a>

      {/* Sign In Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 p-8 mx-6 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur mb-4 ring-1 ring-white/30">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-white/70 text-sm text-center">
            Sign in to continue your journey
          </p>
        </div>

        <div className="flex flex-col w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all backdrop-blur"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all backdrop-blur"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
            />
            {error && (
              <div className="text-sm text-red-300 bg-red-500/20 px-4 py-2 rounded-lg border border-red-400/30">
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <button
              onClick={handleSignIn}
              className="w-full bg-white text-neutral-900 font-semibold px-5 py-3.5 rounded-full shadow-lg hover:bg-white/95 hover:shadow-xl transition-all text-sm"
            >
              Sign In
            </button>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-transparent text-white/60">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white/10 border border-white/20 backdrop-blur rounded-full px-5 py-3.5 font-medium text-white hover:bg-white/20 transition-all text-sm"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <div className="w-full text-center mt-4">
              <span className="text-sm text-white/70">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="font-semibold text-white hover:text-white/90 underline underline-offset-2"
                >
                  Sign up
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
