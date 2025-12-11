import { NextResponse } from "next/server";
import { hcChatCompletion } from "@/lib/hcai";
import { db } from "@/lib/firebase";
import {collection, query, where, orderBy, getDocs, getDoc} from "firebase/firestore";
import { error } from "console";

export async function POST(req: Request) {
    try {
        const {userId} = await req.json();

        if (!userId) {
            return NextResponse.json({error: "Missing UserID" }, {status: 400})
        }
        
        const q = query(
            collection(db, "journalEntries"),
            where("userId", "==", userId),
            orderBy("createdAt", "asc")
        );

        const snap = await getDocs(q);
        const entries = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        if (entries.length === 0) {
            return NextResponse.json({
                error: "No journal entries found for this user"
            }, {status: 404});
        }

        const journalDump = entries.map((entry: any) => {
            const date = entry.createdAt?.toDate?.().toISOString() || "Unknown date";
            return `### Entry (${date})\nTitle: ${entry.title}\nContent:\n${entry.content}\n\n`;
        }).join("\n");

        const prompt = `
            You are a World-class behavioural studies PhD holder, you are tasked to analyze the user's journal for self-growth.
            Read ALL the user's journal entries and entries & produce a single weekly report contaning:
            1. Summary of this weeks journals
            2. Patters you noticed (emotional, behavioural, productivity)
            3. Mental health insights (tone, stress levels, reccuring thoughts)
            4. Positive highlights (celebrate wins)
            5. Constructive imporvements (be supportive, not harsh)
            6. Actionable next steps for the next week 
            7. Overall tone stuff
            8. Mood breakdown 
        Here are all the users journals:
        
        ${journalDump}
        Generate a beautiful, structured report formatted in clear sections.
        Use headings, bullets, and short paras.
        `;

        const report = await hcChatCompletion({
            model: "openai/gpt-5.1",
            messages: [
                {role: "system", content: "You analyze journal entries to support mental, emotional, and personal growth."},
                {role: "user", content: prompt}
            ],
        });
        
        return NextResponse.json({
            report,
            entryCount: entries.length
        });

    } catch (err) {
        console.error("REPORT ERROR", err)
        return NextResponse.json({error: "Failed to generate report"}, {status: 500});
    }
}