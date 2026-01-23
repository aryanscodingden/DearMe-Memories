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
    deleteDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import {Loader2, FileText, Sparkles, Trash2} from "lucide-react";
import { Streamdown } from "streamdown";

export default function ReportsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [selectedReport, setSelectedReport] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reportToDelete, setReportToDelete] = useState<string | null>(null);

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
                createdAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, "reports"), newReportData);

            const savedReport = {
                id: docRef.id,
                ...newReportData,
                createdAt: new Date(),
            };

            setReports([savedReport, ...reports]);
            setSelectedReport(savedReport);
        } catch (err) {
            console.error(err);
            alert("Failed to generate report.");
        }
        setGenerating(false);
    }

    async function deleteReport() {
        if (!reportToDelete) return;

        try {
            await deleteDoc(doc(db, "reports", reportToDelete));
            setReports(reports.filter(r => r.id !== reportToDelete));
            if (selectedReport?.id === reportToDelete) {
                setSelectedReport(null);
            }
            setShowDeleteModal(false);
            setReportToDelete(null);
        } catch (err) {
            console.error(err);
            alert("Failed to delete report.");
        }
    }

    async function downloadPDF() {
        if (!selectedReport) return;

        try {
            const res = await fetch("/api/reportPDF", {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({markdown: selectedReport.report})
            });

        if (!res.ok) {
            alert("Failed to generate PDF")
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "DearMe-Report.pdf";
        a.click();

        URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Could not download pdf")
        }
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
                                <div key={rep.id} className="relative group">
                                    <button
                                        onClick={() => setSelectedReport(rep)}
                                        className={`w-full p-4 text-left rounded-xl border transition ${
                                                selectedReport?.id === rep.id
                                                ? "bg-orange-100 border-orange-300"
                                                : "hover:bg-white/60 border-stone-200"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
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
                                        </div>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setReportToDelete(rep.id);
                                            setShowDeleteModal(true);
                                        }}
                                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition p-1.5 rounded-md hover:bg-red-100"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
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
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-stone-800">
                                Weekly Report
                            </h1>
                            <button
                                onClick={downloadPDF}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
                            >
                                Download PDF
                            </button>
                        </div>
                        <div className="prose prose-stone prose-headings:text-stone-800 prose-p:text-stone-700 prose-strong:text-stone-900 prose-li:text-stone-700 max-w-none bg-white/60 p-8 rounded-xl border border-stone-200">
                            <Streamdown>{selectedReport.report}</Streamdown>
                        </div>
                    </div>
                )}  
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-80 shadow-xl space-y-4 text-center">
                            <h2 className="text-lg font-semibold text-zinc-800">
                                Delete this report?
                            </h2>
                            <p className="text-sm text-zinc-500">
                                This action cannot be undone.
                            </p>

                            <div className="flex flex-col gap-2 pt-2">
                                <button
                                    onClick={deleteReport}
                                    className="w-full py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-500 transition"
                                    >
                                        Delete
                                    </button>
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="w-full py-2 text-sm text-zinc-500 hover:text-zinc-700 transition"
                                    >
                                        Cancel
                                    </button>
                            </div>

                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}