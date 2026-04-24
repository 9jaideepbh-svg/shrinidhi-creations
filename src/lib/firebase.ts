import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB2MMWtYz0Sk87mdFjsvAnxLXFJbToXbJg",
    authDomain: "shrinidhi-creations.firebaseapp.com",
    projectId: "shrinidhi-creations",
    messagingSenderId: "725962327038",
    appId: "1:725962327038:web:f29b659a142ac1a5a476af",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);