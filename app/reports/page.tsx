"use client";

import { useEffect, useState } from "react";
import {auth, db} from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
    collection, 
    query, 
    where,
    orderBy,
    getDocs,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import {Loader2, FileText, Sparkles} from "lucide-react";
import { Streamdown } from "streamdown";

export default function ReportsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [selectedReport, setSelectedReport] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((u) => {
            if (!u) router.push("/login");
            setUser(u);
        });
        return unsub;
    }, [router]);

    useEffect(() => {
        if (!user) return;

        async function loadReports() {
            const q = query(
                collection(db, "reports"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc")
            );

            const snap = await getDocs(q);
            setReports(snap.docs.map((doc) => ({id:doc.id, ...doc.data()})));
            setLoading(false);
        }
        loadReports();
    }, [user]);

    async function generateReport() {
        if (!user) return;

        setGenerating(true);

        try {
            const res = await fetch("/api/generateReport",{
                method: "POST",
                body: JSON.stringify({userId: user.uid}),
            })

            const data = await res.json();

            if (!data.report) {
                alert("AI could not generate a report.");
                setGenerating(false);
                return;
            }

            const newReportData = {
                report: data.report, 
                userId: user.uid,
                createdId: serverTimestamp(),
            };

            await addDoc(collection(db, "reports"), newReportData);

            setReports([{...newReportData, createdAt: new Date()}, ...reports]);
            setSelectedReport(newReportData);
        } catch (err) {
            console.error(err);
            alert("Failed to generate report.");
        }
        setGenerating(false);
    }
    return (
        <div className="h-screen flex">
            <aside className="w-80 bg-white/40 border-r border-stone-200 backdrop-blur-md flex flex-col">
            <button
                onClick={generateReport}
                disabled={generating}
                className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {generating ? (
                        <>
                            <Loader2 className="animate-spin w-5 h-5" /> Generating...
                        </>
                    ) : (
                     <>
                        <Sparkles className="w-5 h-5" />
                        Generate report 
                        </>
                    )}
                </button>

                <div className="mt-10 space-y-4 overflow-y-auto">
                    {loading ? (
                        <p className="text-zinc-500 text-sm">Loading reports...</p>
                    ) : reports.length === 0 ? (
                        <p className="text-zinc-500 text-sm">
                            No reports yet. Generate your first!
                        </p>
                    ) : (
                        reports.map((rep) => {
                            const date = rep.createdAt?.toDate?.() || new Date();
                            return (
                                <button
                                    key={rep.id}
                                    onClick={() => setSelectedReport(rep)}
                                    className={`w-full p-4 text-left rounded-xl border transition ${
                                            selectedReport?.id === rep.id
                                            ? "bg-orange-100 border-orange-300"
                                            : "hover:bg-white/60 border-stone-200"
                                        }`}
                                >
                                    <div className="flex items-start gap-2">
                                        <FileText className="w-5 h-5 text-orange-500 mt-1" />
                                        <div>
                                            <p className="font-medium text-sm">
                                                {date.toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                Weekly Report
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            
            </aside>

            <main className="flex-1 overflow-y-auto p-8">
                {!selectedReport ? (
                    <div className="h-full flex items-center justify-center text-zinc-400">
                        <p>Select or generate a report to view</p>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-stone-800">
                            Weekly Report
                        </h1>
                        <div className="prose prose-stone prose-headings:text-stone-800 prose-p:text-stone-700 prose-strong:text-stone-900 prose-li:text-stone-700 max-w-none bg-white/60 p-8 rounded-xl border border-stone-200">
                            <Streamdown>{selectedReport.report}</Streamdown>
                        </div>
                    </div>
                )}  
            </main>
        </div>
    )
}