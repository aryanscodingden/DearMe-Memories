"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Mail, ArrowLeft } from "lucide-react";

export default function MordernSignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/journal");
      }
    });
    return unsubscribe;
  }, [router]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/journal");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak");
      } else {
        setError("Failed to create account. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/journal");
    } catch (err: any) {
      setError("Failed to sign up with Google. Please try again.");
      setIsLoading(false);
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

      {/* Sign Up Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 p-8 mx-6 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur mb-4 ring-1 ring-white/30">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            Create Account
          </h2>
          <p className="text-white/70 text-sm text-center">
            Start your journaling journey today
          </p>
        </div>

        <div className="flex flex-col w-full gap-4">
          {error && (
            <div className="text-sm text-red-300 bg-red-500/20 px-4 py-2 rounded-lg border border-red-400/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="w-full flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all backdrop-blur"
              placeholder="Email"
              required
              disabled={isLoading}
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all backdrop-blur"
              placeholder="Password (at least 6 characters)"
              required
              disabled={isLoading}
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all backdrop-blur"
              placeholder="Confirm Password"
              required
              disabled={isLoading}
            />

            <div className="flex flex-col gap-3 mt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-neutral-900 font-semibold px-5 py-3.5 rounded-full shadow-lg hover:bg-white/95 hover:shadow-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
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
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white/10 border border-white/20 backdrop-blur rounded-full px-5 py-3.5 font-medium text-white hover:bg-white/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-semibold text-white hover:text-white/90 underline underline-offset-2"
                  >
                    Sign in
                  </a>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
