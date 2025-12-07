"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {auth, db} from "@/lib/firebase" 
import {doc, getDoc, updateDoc, serverTimestamp} from "firebase/firestore";
import { JournalEditor } from "@/components/ui/editor";

export default function EntryPage() {
    const {id} = useParams();
    const router = useRouter();

    const [entry, setEntry] = useState<any>(null)
    const [tags, setTags] = useState<string>("");

    useEffect(() => {
        async function fetchEntry() {
            const snap = await getDoc(doc(db, "journalEntries", id as string));
            if (!snap.exists()) return router.push("/journal");
            const data = snap.data();
            setEntry(data);
            setTags((data.tags || []).join(", "))
        }
        fetchEntry();
    }, [id, router]);

    async function save(content: string) {
        await updateDoc(doc(db, "journalEntries", id as string), {
            content, 
            tags: tags.split(",").map(t => t.trim()).filter(Boolean),
            updatedAt: serverTimestamp(),
        })
    }

    if (!entry) return <div className="flex-1 p-10 text-white/60">Loading...</div>

    const date = entry.createdAt?.toDate().toLocaleDateString();
    const time = entry.createdAt?.toDate().toLocaleTimeString();

    return (
        <main className="flex-1 p-10 max-w-3xl mx-auto">
            <div className="mb-6 text-sm text-white/40">
                {date} at {time}
            </div>

            <input 
                className="bg-transparent border-b border-white/10 text-white/70 focus:outline-none focus:border-orange-400 px-1 py-1 text-sm"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />
        
            <JournalEditor
                content={entry.content}
                onUpdate={save}
            />
        </main>
    ); 
}