import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

if (typeof window !== 'undefined') {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
        console.error("Error setting persistence:", error);
    });
}

export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);


