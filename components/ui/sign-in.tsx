"use client";

import * as React from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { useState } from "react";

export default function MordernSignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

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
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] relative overflow-hidden w-full">
            <div className="relative z-10 w-full max-w-sm rounded-3xl bg-linear-to-r from-[#ffffff10] to-[#121212] backdrop-blur-sm shadow-2xl p-8 flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 mb-6 shadow-lg">
                    <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                    Dear<span className="text-orange-500">Me</span>
                </h2>
                <div className="flex flex-col w-full gap-4">
                    <div className="w-full flex flex-col gap-3">
                        <input
                            placeholder="Email"
                            type="email"
                            value={email}
                            className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                        />
                        <input
                            placeholder="Password"
                            type="password"
                            value={password}
                            className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                        />
                        {error && (
                            <div className="text-sm text-red-400 text-left">{error}</div>
                        )}
                    </div>
                    <hr className="opacity-10" />
                    <div>
                        <button
                            onClick={handleSignIn}
                            className="w-full bg-white/10 text-white font-medium px-5 py-3 rounded-full shadow hover:bg-white/20 transition mb-3 text-sm"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full flex items-center justify-center gap-2 bg-linear-to-b from-orange-500 to-amber-500 rounded-full px-5 py-3 font-medium text-black shadow hover:brightness-110 transition mb-2 text-sm"
                        >
                            <img 
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            Continue with Google
                        </button>
                        <div className="w-full text-center mt-2">
                            <span className="text-xs text-gray-400">
                                Don&apos;t have an account?{" "}
                                <a
                                    href="/signup"
                                    className="underline text-orange-400 hover:text-orange-300"
                                >
                                    Sign up, it&apos;s free!
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}