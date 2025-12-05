"use client";

import {useEffect, useState} from "react"
import {auth, db} from "@/lib/firebase"
import {
    collection, 
    query,
    where,
    onSnapshot,
    orderBy,
} from "firebase/firestore"
import Link from "next/link";
import { Plus } from "lucide-react";

type Entry = {
    id: string;
    title?: string;
    content?: string;
    createdAt?: {seconds: number; nanoseconds: number};
};

export default function JournalPage() {
    const [entries, setEntries] = useState<Entry[]>([]);

    useEffect(() => {
        if (!auth.currentUser) return;

        const q = query(
            collection(db, "journalEntries"),
            where("userId", "==", auth.currentUser.uid),
            orderBy("createdAt", "desc")
        );

        const unsub = onSnapshot(q, (snap) => {
            const list: Entry[] = snap.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as any),
            }));
            setEntries(list);
        });
        return () => unsub();
    }, []);

    return (
        <main className="min-h-screen px-6 pt-16 pb-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">My Journal</h1>
                <Link
                    href="/journal/new"
                    className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition flex items-center gap-2"
                >
                    <Plus size={16} />
                    New Entry
                </Link>
            </div>
            <div className="space-y-4">
                {entries.map((entry) => (
                    <Link
                        key={entry.id}
                        href={`/journal/${entry.id}`}
                        className="block bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
                        >
                            <h2 className="font-semibold text-lg">
                                {entry.title || "Untitled Entry"}
                            </h2>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                                {entry.content || "No content yet"}
                            </p>
                    </Link>
                ))}
            </div>
        </main>
    );
}