"use client";
import { useEffect, useState, useMemo } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { JournalEditor } from "@/components/ui/editor";

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTime, setNewTime] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }

    const q = query(
      collection(db, "journalEntries"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setEntries(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [user]);

  const groupedEntries = useMemo(() => {
    return entries.reduce((groups: any, entry) => {
      try {
        const date = entry.createdAt?.toDate?.();
        const monthYear = date
          ? new Date(date).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
          : "No Date";

        if (!groups[monthYear]) {
          groups[monthYear] = [];
        }
        groups[monthYear].push(entry);
      } catch (error) {
        console.error("Error processing entry:", entry, error);
      }
      return groups;
    }, {});
  }, [entries]);

  return (
    <div className="h-full flex">
      <aside className="w-80 bg-white/40 backdrop-blur-sm border-r border-stone-200 overflow-y-auto">
        <div className="p-6 space-y-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
          >
            + Add Journal
          </button>

          {loading ? (
            <div className="text-center text-zinc-400 text-sm">Loading...</div>
          ) : entries.length === 0 ? (
            <div className="text-center text-zinc-400 text-sm py-8">
              No entries yet. Create your first journal entry!
            </div>
          ) : (
            Object.keys(groupedEntries).map((monthYear) => (
              <div key={monthYear}>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 pl-1">
                  {monthYear}
                </h3>
                <div className="space-y-2">
                  {groupedEntries[monthYear].map((entry: any) => {
                    let date, day;
                    try {
                      date = entry.createdAt?.toDate?.();
                      day = date ? new Date(date).getDate() : "";
                    } catch (error) {
                      console.error("Error parsing date:", error);
                      day = "";
                    }
                    const isSelected = selectedEntry?.id === entry.id;

                    return (
                      <button
                        key={entry.id}
                        onClick={() => setSelectedEntry(entry)}
                        className={`block w-full text-left p-3 rounded-lg transition ${
                          isSelected
                            ? "bg-orange-100 border border-orange-300 text-zinc-800"
                            : "hover:bg-white/60 border border-transparent text-zinc-700"
                        }`}
                      >
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-[11px] font-medium text-orange-500">
                            {day}
                          </span>
                          <p className="font-medium text-[14px] truncate flex-1">
                            {entry.title || "Untitled"}
                          </p>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-2">
                          {entry.content?.replace(/<[^>]*>?/gm, "") ||
                            "No content.."}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {selectedEntry ? (
          <div className="h-full p-10">
            <div className="mb-6">
              <h1 className="text-[34px] font-semibold leading-tight text-zinc-800">
                {selectedEntry.title || "Untitled"}
              </h1>
              <p className="text-sm text-zinc-500">
                {selectedEntry.createdAt?.toDate()
                  ? new Date(
                      selectedEntry.createdAt.toDate()
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unknown date"}
              </p>
            </div>
            <JournalEditor
              key={selectedEntry.id}
              content={selectedEntry.content || ""}
              onUpdate={async (html: string) => {
                if (!selectedEntry.id) return;
                
                // Update local state immediately for UI responsiveness
                setSelectedEntry({
                  ...selectedEntry,
                  content: html,
                });
                
                // Update in Firestore
                await updateDoc(doc(db, "journalEntries", selectedEntry.id), {
                  content: html,
                  updatedAt: serverTimestamp(),
                });
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400">
            Select an entry to edit
          </div>
        )}
      </main>

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
                  if (!user) return;
                  if (!newTitle.trim() || !newDate || !newTime) {
                    alert("Please fill in all fields");
                    return;
                  }

                  try {
                    const selectedDate = new Date(`${newDate}T${newTime}`);
                    const docRef = await addDoc(
                      collection(db, "journalEntries"),
                      {
                        title: newTitle.trim(),
                        content: "",
                        userId: user.uid,
                        createdAt: selectedDate,
                      }
                    );

                    setSelectedEntry({
                      id: docRef.id,
                      title: newTitle.trim(),
                      content: "",
                      createdAt: { toDate: () => selectedDate },
                    });

                    setShowAddModal(false);
                    setNewTitle("");
                    setNewDate("");
                    setNewTime("");
                  } catch (error) {
                    console.error("Error creating entry:", error);
                    alert("Failed to create entry. Please try again.");
                  }
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
  );
}
