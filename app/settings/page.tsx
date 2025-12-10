"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { updateProfile, updateEmail, updatePassword, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();
    const user = auth.currentUser;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!user) return;
        setName(user.displayName || "");
        setEmail(user.email || "");
    }, [user]);

    const handleSave = async () => {
        setMessage("");

        try {
            if (!user) return;
            if (name && name !== user.displayName) {
                await updateProfile(user, { displayName: name });
            }
            if (email && email !== user.email) {
                await updateEmail(user, email);
            }
            if (password) {
                await updatePassword(user, password);
            }

            setMessage("Settings updated successfully");
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        if (!confirm("Are you sure? This action cannot be undone.")) return;
        await user.delete();
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-50 text-zinc-800 p-10">
            <div className="max-w-2xl mx-auto bg-white/60 backdrop-blur-md shadow-lg rounded-2xl p-8 space-y-6 border border-stone-200">
                <h2 className="text-3xl font-bold">Settings</h2>

                {message && (
                    <p className="text-sm font-medium text-orange-600">{message}</p>
                )}

                <div className="space-y-2">
                    <label className="font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-stone-300 px-4 py-2 focus:ring-2 focus:ring-orange-400"
                    />
                </div>

                <div className="space-y-2">
                    <label className="font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-stone-300 px-4 py-2 focus:ring-2 focus:ring-orange-400"
                    />
                </div>

                <div className="space-y-2">
                    <label className="font-medium">New Password</label>
                    <input
                        type="password"
                        placeholder="Change Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-stone-300 px-4 py-2 focus:ring-2 focus:ring-orange-400"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="w-full bg-orange-500 hover:bg-orange-600 transition text-white font-semibold rounded-lg py-3"
                >
                    Save Changes
                </button>

                <div className="space-y-3">
                    <p className="text-red-500 font-semibold">Danger Zone</p>
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full text-red-600 bg-red-100 hover:bg-red-200 transition font-medium rounded-lg py-3"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}