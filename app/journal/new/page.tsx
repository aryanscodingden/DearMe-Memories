"use client";

import { useState, useRef, useEffect } from "react";
import {auth,db} from "@/lib/firebase"
import {addDoc, collection, serverTimestamp} from "firebase/firestore"
import {useRouter} from "next/navigation"

export default function NewEntryPage() {
    const router = useRouter();
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // Auto-focus the textarea when component mounts
        textareaRef.current?.focus();
    }, []);

    async function save() {
        await addDoc(collection(db, "journalEntries"), {
            userId: auth.currentUser?.uid,
            title,
            content,
            createdAt: serverTimestamp(),
        });
        router.push("/journal")
    }

    return (
        <main className="min-h-screen max-w-2xl mx-auto px-6 pt-20 pb-24">
            <input 
                className="w-full bg-transparent focus:outline-none text-3xl font-bold mb-6"
                placeholder="Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
        
        <textarea
            ref={textareaRef}
            className="w-full min-h-[50vh] bg-transparent focus:outline-none resize-none text-lg text-white/90 leading-relaxed"
            placeholder="Start writing...."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            />

        <div className="mt-6 flex justify-end gap-3">
            <button
                onClick={() => router.push("/journal")}
                className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
                >
                    Cancel
                </button>
            <button
                onClick={save}
                className="px-6 py-2 bg-white text-black rounded-full shadow hover:shadow-xl  transition font-medium"
                >
                    Save
                </button>
        </div>
        </main>
    )
}