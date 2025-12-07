"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {auth, db} from "@/lib/firebase";
import {collection, query, where, orderBy, onSnapshot} from "firebase/firestore";

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "journalEntries"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      setEntries(snap.docs.map(doc => ({id: doc.id, ...doc.data() })))
    })
  }, [])

  return (
    <div className="h-full flex">
      <aside className="w-96 border-r border-border p-6 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Entries</h2>

        <div className="space-y-3">
          {entries.map(entry => {
            const date = entry.createdAt?.toDate()
            ? new Date(entry.createdAt.toDate()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            : "";

            return (
              <Link 
                key={entry.id}
                href={`/journal/${entry.id}`}
                className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition"
                >
                  <p className="font-medium">{entry.title || "Untitled"}</p>
                  <p className="text-xs text-white/40 mt-1">{date}</p>
                  <p className="text-sm text-white/50 line-clamp-2 mt-1">
                    {entry.content?.replace(/<[^>]*>?/gm, "") || "No content.."}
                  </p>
                </Link>
            )
          })}
        </div>
      </aside>

    <main className="flex-1 flex items-center justify-center text-white/40">
      Select an entry to begin
    </main>
    </div>
  )
}