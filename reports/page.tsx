"use clients";

import { useEffect, useState } from "react";
import {auth, db} from "@/lib/firebase";
import { useRouter } from "next/router";
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
            
        }
    })
}