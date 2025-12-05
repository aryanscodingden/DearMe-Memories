"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter()

  async function handleLogin() {
    await signInWithPopup(auth, provider);
    router.push ("/journal");
  }

  return (
    <main className="h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
      <h1 className="text-4xl font-bold">DearMe</h1>
      <p className="text-gray-300 max-w-sm">
        Write to your future self.
        Stay connected to your growth.
      </p>
      <button
        onClick={handleLogin}
        className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
        >
          Continue with google
        </button>
    </main>
  )
}