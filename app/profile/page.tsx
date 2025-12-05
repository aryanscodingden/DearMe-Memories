"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut(auth);
    router.push("/");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
      <h1 className="text-4xl font-bold">Profile</h1>
      <p className="text-gray-300 max-w-sm">
        {auth.currentUser?.displayName || "User"}
      </p>
      <p className="text-gray-400 text-sm">
        {auth.currentUser?.email}
      </p>
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
      >
        Sign Out
      </button>
    </main>
  );
}
