"use client";

import { useState } from "react";
import {auth, db} from "@/lib/firebase";
import {addDoc, collection, serverTimestamp} from "firebase/firestore"
import { useRouter } from "next/router";

export default function NewJournalEntryPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    async function handleSave() {
        if (!auth.currentUser) return;

        await addDoc(collection(db, "journalEntries"), {
            userId: auth.currentUser.uid,
            title,
            content,
            createdAt: serverTimestamp(),
        });

        router.push("/journal");    
    }
    return (
        <main className="min-h-screen px-6 pt-16 pb-10 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">New Entry</h1>

            <input 
                className="w-full mb-4 px-3 py-2 rounded-lg bg-white text-black placeholder:text-gray-500"
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
        </main>
    )
}