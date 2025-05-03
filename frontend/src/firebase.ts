import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB03mI_EcAtqRw-OIuEPQCzTQmb9PUnBB0",
    authDomain: "leetcode-advisor.firebaseapp.com",
    projectId: "leetcode-advisor",
    storageBucket: "leetcode-advisor.firebasestorage.app",
    messagingSenderId: "537386376860",
    appId: "1:537386376860:web:089d29b9d185f82a781759"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
