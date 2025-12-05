"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function JournalLayout({
    children, 
} : {
    children: React.ReactNode;
}) {
    const [ready, setReady] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/login");
            } else {
                setReady(true);
            }
        })
         return () => unsub();
    }, [router])

    if (!ready) return null;

    return <>{children}</>
}