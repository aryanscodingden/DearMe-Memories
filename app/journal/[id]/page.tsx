"use client";
 
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {auth, db} from "@/lib/firebase" 
import {doc, getDoc, updateDoc, serverTimestamp} from "firebase/firestore";
import { JournalEditor } from "@/components/ui/editor";

export default function EntryPage() {
    const {id} = useParams()
    const [entry, setEntry] = useState<any>(null);
    const [tags, setTags] = useState("");

    useEffect(() => {
        async function loadEntry() {
            const ref = doc(db, "journalEntries", id as string);
            const snap = await getDoc(ref);
            if (!snap.exists()) return;
            const data = snap.data();
            setEntry(data);
            setTags((data.tags || []).join(","));
        }
        loadEntry();
    }, [id]);

    async function save(content: string) {
        if (!auth.currentUser) return;
        await updateDoc(doc(db, "journalEntries", id as string), {
            content, 
            tags: tags.split(",").map(t => t.trim()).filter(Boolean),
            updatedAt: serverTimestamp(),
        });
    }

    if (!entry) return <div className="p-10">Loading....</div>

    const date = entry.createdAt?.toDate()
        ? entry.createdAt.toDate().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
        : "Unknown date";

    return (
        <main className="flex-1 overflow-y-auto p-10">
            <h1 className="text-4xl font-bold mb-1">{entry.title}</h1>
            <p className="text-white/40 mb-6">{date}</p>

            <input 
                className="bg-transparent border-b border-border mb-4 text-sm text-white/60 focus:outline-none focus:border-accent px-1 py-1"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />

            <JournalEditor content={entry.content} onUpdate={save} />
        </main>
    )
}