"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {auth, db} from "@/lib/firebase";
import {collection, query, where, orderBy, onSnapshot} from "firebase/firestore";

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

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


  const groupedEntries = entries.reduce((groups: any, entry) => {
    const date = entry.createdAt?.toDate();
    const monthYear = date 
      ? new Date(date).toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : "No Date";
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(entry);
    return groups;
  }, {});

  return (
    <div className="h-full flex">
      <aside className="w-80 bg-white/40 backdrop-blur-sm border-r border-stone-200 overflow-y-auto">
        <div className="p-6 space-y-6">
          {Object.keys(groupedEntries).map(monthYear => (
            <div key={monthYear}>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 pl-1">
                {monthYear}
              </h3>
              <div className="space-y-2">
                {groupedEntries[monthYear].map((entry: any) => {
                  const date = entry.createdAt?.toDate();
                  const day = date ? new Date(date).getDate() : "";
                  const isSelected = selectedEntry?.id === entry.id;

                  return (
                    <button
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        isSelected 
                          ? "bg-orange-100 border border-orange-300 text-zinc-800" 
                          : "hover:bg-white/60 border border-transparent text-zinc-700"
                      }`}
                    >
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-[11px] font-medium text-orange-500">{day}</span>
                        <p className="font-medium text-[14px] truncate flex-1">
                          {entry.title || "Untitled"}
                        </p>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {entry.content?.replace(/<[^>]*>?/gm, "") || "No content.."}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {selectedEntry ? (
          <div className="max-w-4xl mx-auto p-10">
            <div className="mb-8">
              <h1 className="text-[40px] font-semibold tracking-tight mb-2 text-zinc-800">
                {selectedEntry.title || "Untitled"}
              </h1>
              <p className="text-sm text-zinc-400 mb-8">
                {selectedEntry.createdAt?.toDate()
                  ? new Date(selectedEntry.createdAt.toDate()).toLocaleDateString("en-US", { 
                      weekday: "long", 
                      year: "numeric", 
                      month: "long", 
                      day: "numeric" 
                    })
                  : "Unknown date"}
              </p>
            </div>
            <div 
              className="prose prose-stone max-w-none text-zinc-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedEntry.content || "<p class='text-zinc-400'>No content yet...</p>" }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400">
            Select an entry to view
          </div>
        )}
      </main>
    </div>
  )
}

