"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {auth, db} from "@/lib/firebase";
import {collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp} from "firebase/firestore";
import { Users } from "lucide-react";

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTime, setNewTime] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

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
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full text-left px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-300 transition"
            >
               + Add Journal
            </button>
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

      {/* Add Journal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white text-zinc-800 p-6 rounded-2xl w-96 space-y-4 shadow-xl">
            <h2 className="font-semibold text-xl mb-4">New Journal Entry</h2>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                className="w-full border border-stone-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />

              <input 
                type="date"
                className="w-full border border-stone-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />

              <input 
                type="time"
                className="w-full border border-stone-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={async () => {
                  if (!auth.currentUser) return;

                  const selectedDate = new Date(`${newDate}T${newTime}`);
                  const docRef = await addDoc(collection(db, "journalEntries"), {
                    title: newTitle, 
                    content: "",
                    userId: auth.currentUser.uid,
                    createdAt: selectedDate,
                  });

                  setSelectedEntry({
                    id: docRef.id,
                    title: newTitle,
                    content: "",
                    createdAt: { toDate: () => selectedDate },
                  });

                  setShowAddModal(false);
                  setNewTitle("");
                  setNewDate("");
                  setNewTime("");
                }}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
              > 
                Create Entry
              </button>

              <button
                onClick={() => setShowAddModal(false)}
                className="w-full py-2 text-sm text-zinc-500 hover:text-zinc-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

