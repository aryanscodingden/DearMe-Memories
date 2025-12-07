"use client";

import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { use, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "journalEntries"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, []);

  return (
    <div className="flex flex-1">
      <aside className="w-80 border-r border-white/10 overflow-y-auto p-6">
        <h2 className="text-lg font-semibold mb-4">Entries</h2>
        <div className="space-y-3">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/journal/${entry.id}`}
              className="block bg-white/5 p-4 rounded-lg hover:bg-white/10 transition"
            >
              <p className="font-medium text-orange-300">
                {entry.title || "Untitled"}
              </p>

              <p className="text-sm text-white/50 line-clamp-2">
                {entry.content || "No content yet.."}
              </p>
            </Link>
          ))}

          <main className="flex-1 flex items-center justify-center p-10 text-white/50">
            Select a entry from the left or create a new one
          </main>
        </div>
      </aside>
    </div>
  );
}
