"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";

export default function MordernSignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const provider = new GoogleAuthProvider();

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
            window.location.href = "/journal";
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            window.location.href = "/journal";
        } catch (err) {
            setError("Google sign-in failed");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f] overflow-hidden text-white">

            <div className="relative w-full max-w-sm ronded-3xl bg-black/40 backdrop-blur-lg border border-white/5 p-8 shadow-xl">
            
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-6 shadow-md">
            
            </div>

        

            <input 
                placeholder="email" 
                className="w-full px-4 py-3 rounded-xl bg-white/10 placeholder-zinc-400 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

            <input 
                placeholder="Password"
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-white/10 placeholder-zinc-400 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
                onClick={handleSignIn}
                className="w-full py-3 rounded-full bg-white/20 font-medium hover:bg-white/30 transition"
                >
                    Sign In
                </button>
            
            <button
                onClick={handleGoogleLogin}
                className="w-full py-3 rounded-full bg-linear-to-r from-orange-500 to-amber-500 font-medium text-black hover:brightness-110 transition flex items-center gap-2"
                >
                    Continue with Google
                </button>
            
            </div>

            <p className="text-xs text-zinc-500 text-center mt-5">
                Don't have an account?
            <a href="/signup" className="text-white ml-1 underline">
                Sign up
            </a>
            </p>
        </div>
    );
}